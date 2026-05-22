'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { loginSchema, customerActivationSchema, otpVerificationSchema, passwordSetupSchema } from '@/lib/validations'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  try {
    const validated = loginSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
    })

    if (!validated.success) {
      return { error: validated.error.issues[0].message }
    }

    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email: validated.data.email.toLowerCase().trim(),
      password: validated.data.password,
    })

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        return { error: 'Invalid email or password' }
      }
      if (error.message.includes('Email not confirmed')) {
        return { error: 'Please verify your email address before signing in' }
      }
      return { error: 'Unable to sign in. Please try again.' }
    }

    if (!data.user) {
      return { error: 'Unable to sign in. Please try again.' }
    }

    revalidatePath('/', 'layout')
    return { success: true }
  } catch (err) {
    console.error('Login error:', err)
    return { error: 'An unexpected error occurred. Please try again.' }
  }
}

export async function logout() {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
  } catch (err) {
    console.error('Logout error:', err)
  }
  redirect('/auth/login')
}

export async function sendOtp(email: string) {
  try {
    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithOtp({
      email: email.toLowerCase().trim(),
      options: {
        shouldCreateUser: false,
      },
    })

    if (error) {
      return { error: error.message }
    }

    return { success: true }
  } catch (err) {
    console.error('Send OTP error:', err)
    return { error: 'Unable to send OTP. Please try again.' }
  }
}

export async function activateAccount(formData: FormData) {
  try {
    const validated = customerActivationSchema.safeParse({
      customer_id: formData.get('customer_id'),
      phone: formData.get('phone'),
    })

    if (!validated.success) {
      return { error: validated.error.issues[0].message }
    }

    const supabase = await createClient()

    const { data: customer, error } = await supabase
      .from('customers')
      .select('*')
      .eq('customer_id', validated.data.customer_id.trim())
      .eq('phone', validated.data.phone.trim())
      .single()

    if (error || !customer) {
      return { error: 'Invalid customer ID or phone number' }
    }

    const c = customer as any
    if (c.status === 'active') {
      return { error: 'Account already activated. Please sign in.' }
    }
    if (c.status !== 'pending_activation') {
      return { error: 'This account cannot be activated at this time' }
    }

    if (!c.email) {
      return { error: 'No email found for this customer. Please contact support.' }
    }

    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: c.email.toLowerCase().trim(),
      options: {
        shouldCreateUser: true,
        data: {
          customer_id: c.customer_id,
        },
      },
    })

    if (otpError) {
      return { error: otpError.message }
    }

    return { success: true, email: c.email }
  } catch (err) {
    console.error('Activate account error:', err)
    return { error: 'An unexpected error occurred. Please try again.' }
  }
}

export async function verifyOtpAndSetupPassword(formData: FormData) {
  try {
    const email = formData.get('email') as string
    const otp = formData.get('otp') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirm_password') as string

    if (!email || !otp || !password || !confirmPassword) {
      return { error: 'All fields are required' }
    }

    const otpValidated = otpVerificationSchema.safeParse({ email, otp })
    if (!otpValidated.success) {
      return { error: otpValidated.error.issues[0].message }
    }

    const passwordValidated = passwordSetupSchema.safeParse({ password, confirm_password: confirmPassword })
    if (!passwordValidated.success) {
      return { error: passwordValidated.error.issues[0].message }
    }

    const supabase = await createClient()

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email: email.toLowerCase().trim(),
      token: otp,
      type: 'email',
    })

    if (verifyError) {
      return { error: 'Invalid or expired OTP. Please request a new one.' }
    }

    const adminSupabase = createAdminClient()

    const { data: usersData, error: userError } = await adminSupabase.auth.admin.listUsers()

    if (userError) {
      return { error: 'Verification failed. Please try again.' }
    }

    const user = usersData.users.find(u => u.email === email.toLowerCase().trim())
    if (!user) {
      return { error: 'User account not found. Please start the activation process again.' }
    }

    const { error: updateError } = await adminSupabase.auth.admin.updateUserById(user.id, {
      password,
    })

    if (updateError) {
      return { error: 'Password setup failed. Please try again.' }
    }

    const { data: customerRecord } = await supabase
      .from('customers')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .single()

    if (customerRecord) {
      const { error: upsertError } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          email: email.toLowerCase().trim(),
          full_name: `${(customerRecord as any).first_name} ${(customerRecord as any).last_name}`,
          phone: (customerRecord as any).phone || null,
          role: 'customer',
          is_active: true,
        })

      if (!upsertError) {
        await supabase
          .from('customers')
          .update({ status: 'active', user_id: user.id, activated_at: new Date().toISOString() })
          .eq('id', (customerRecord as any).id)
      }
    }

    revalidatePath('/', 'layout')
    return { success: true }
  } catch (err) {
    console.error('Verify OTP and setup password error:', err)
    return { error: 'An unexpected error occurred. Please try again.' }
  }
}

export async function getCurrentUser() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data: userData } = await supabase
      .from('users')
      .select('*, branches(name, code)')
      .eq('id', user.id)
      .single()

    if (userData) return userData as any

    const { data: customerData } = await supabase
      .from('customers')
      .select('*, branches(name)')
      .eq('user_id', user.id)
      .single()

    if (customerData) return customerData

    return {
      id: user.id,
      email: user.email,
      full_name: user.email?.split('@')[0] || 'User',
      first_name: user.email?.split('@')[0] || 'User',
      last_name: '',
      role: 'super_admin',
      branches: null,
      is_active: true,
    }
  } catch (err) {
    console.error('Get current user error:', err)
    return null
  }
}

export async function getUserRole() {
  try {
    const user = await getCurrentUser() as any
    return user?.role || null
  } catch (err) {
    console.error('Get user role error:', err)
    return null
  }
}

export async function seedTestCustomers() {
  try {
    const adminSupabase = createAdminClient()
    const supabase = await createClient()
    const testCustomers = [
      {
        email: 'ama.mensah@test.com',
        password: 'Test@1234',
        first_name: 'Ama',
        last_name: 'Mensah',
        phone: '0241111111',
        occupation: 'Market Trader',
      },
      {
        email: 'kwame.asante@test.com',
        password: 'Test@1234',
        first_name: 'Kwame',
        last_name: 'Asante',
        phone: '0242222222',
        occupation: 'Farmer',
      },
    ]

    const results = []

    for (const tc of testCustomers) {
      const { data: existingUsers } = await adminSupabase.auth.admin.listUsers()
      const alreadyExists = existingUsers?.users?.some(u => u.email === tc.email)
      if (alreadyExists) {
        results.push({ email: tc.email, status: 'already exists' })
        continue
      }

      const { data: authData, error: authError } = await adminSupabase.auth.admin.createUser({
        email: tc.email,
        password: tc.password,
        email_confirm: true,
      })

      if (authError || !authData.user) {
        results.push({ email: tc.email, status: 'failed', error: authError?.message })
        continue
      }

      const { data: mainBranch } = await supabase
        .from('branches')
        .select('id')
        .limit(1)
        .single()

      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: tc.email,
          full_name: `${tc.first_name} ${tc.last_name}`,
          phone: tc.phone,
          role: 'customer',
          is_active: true,
        })

      if (userError) {
        results.push({ email: tc.email, status: 'failed', error: userError.message })
        continue
      }

      const { error: customerError } = await supabase
        .from('customers')
        .insert({
          user_id: authData.user.id,
          branch_id: (mainBranch as any)?.id || '',
          first_name: tc.first_name,
          last_name: tc.last_name,
          email: tc.email,
          phone: tc.phone,
          occupation: tc.occupation,
          status: 'active',
          registered_by: authData.user.id,
        })

      if (customerError) {
        results.push({ email: tc.email, status: 'customer failed', error: customerError.message })
      } else {
        results.push({ email: tc.email, status: 'created', password: tc.password })
      }
    }

    return { results }
  } catch (err) {
    console.error('Seed test customers error:', err)
    return { error: 'Failed to seed test customers' }
  }
}
