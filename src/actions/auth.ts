'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { loginSchema, customerActivationSchema, otpVerificationSchema, passwordSetupSchema } from '@/lib/validations'
import { revalidatePath } from 'next/cache'

export async function login(formData: FormData) {
  const validated = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validated.success) {
    return { error: validated.error.issues[0].message }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: validated.data.email,
    password: validated.data.password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
}

export async function sendOtp(email: string) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function activateAccount(formData: FormData) {
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
    .eq('customer_id', validated.data.customer_id)
    .eq('phone', validated.data.phone)
    .single()

  if (error || !customer) {
    return { error: 'Invalid customer ID or phone number' }
  }

  const c = customer as any
  if (c.status !== 'pending_activation') {
    return { error: 'Account already activated' }
  }

  const { error: otpError } = await supabase.auth.signInWithOtp({
    email: c.email,
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
}

export async function verifyOtpAndSetupPassword(formData: FormData) {
  const email = formData.get('email') as string
  const otp = formData.get('otp') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirm_password') as string

  const otpValidated = otpVerificationSchema.safeParse({ email, otp })
  if (!otpValidated.success) {
    return { error: otpValidated.error.issues[0].message }
  }

  const passwordValidated = passwordSetupSchema.safeParse({ password, confirm_password: confirmPassword })
  if (!passwordValidated.success) {
    return { error: passwordValidated.error.issues[0].message }
  }

  const adminSupabase = createAdminClient()

  const { data: users, error: userError } = await adminSupabase.auth.admin.listUsers()

  if (userError) {
    return { error: 'Verification failed' }
  }

  const user = users.users.find(u => u.email === email)
  if (!user) {
    return { error: 'User not found' }
  }

  const { error: updateError } = await adminSupabase.auth.admin.updateUserById(user.id, {
    password,
  })

  if (updateError) {
    return { error: 'Password setup failed' }
  }

  return { success: true }
}

export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: userData } = await supabase
    .from('users')
    .select('*, branches(name, code)')
    .eq('id', user.id)
    .single()

  return userData as any
}

export async function getUserRole() {
  const user = await getCurrentUser() as any
  return user?.role || null
}
