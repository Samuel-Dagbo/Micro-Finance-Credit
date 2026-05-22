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
    const testCustomers = [
      {
        email: 'ama.mensah@test.com',
        password: 'Test@1234',
        first_name: 'Ama',
        last_name: 'Mensah',
        phone: '0241111111',
        occupation: 'Market Trader',
        savings: { type: 'regular' as const, balance: 2500, rate: 8 },
        loan: { type: 'business' as const, principal: 5000, rate: 24, term: 6, frequency: 'monthly' as const, paid: 1800 },
      },
      {
        email: 'kwame.asante@test.com',
        password: 'Test@1234',
        first_name: 'Kwame',
        last_name: 'Asante',
        phone: '0242222222',
        occupation: 'Farmer',
        savings: { type: 'target' as const, balance: 1200, rate: 10, target: 5000 },
        loan: { type: 'agricultural' as const, principal: 8000, rate: 18, term: 12, frequency: 'monthly' as const, paid: 0 },
      },
    ]

    const { data: branchData } = await adminSupabase
      .from('branches')
      .select('id')
      .limit(1)
      .maybeSingle()

    if (!branchData) {
      return { error: 'No branch found. Please create a branch first in the Supabase dashboard.' }
    }

    const branchId = branchData.id
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

      const { error: userError } = await adminSupabase
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

      const { data: customerData, error: customerError } = await adminSupabase
        .from('customers')
        .insert({
          user_id: authData.user.id,
          branch_id: branchId,
          first_name: tc.first_name,
          last_name: tc.last_name,
          email: tc.email,
          phone: tc.phone,
          occupation: tc.occupation,
          status: 'active',
          registered_by: authData.user.id,
        })
        .select('id, customer_id')
        .single()

      if (customerError || !customerData) {
        results.push({ email: tc.email, status: 'customer failed', error: customerError?.message })
        continue
      }

      const savingsType = tc.savings.type
      const { error: savingsError } = await adminSupabase
        .from('savings_accounts')
        .insert({
          customer_id: customerData.id,
          account_type: savingsType,
          balance: tc.savings.balance,
          interest_rate: tc.savings.rate,
          target_amount: (tc.savings as any).target || null,
          status: 'active',
        })

      if (savingsError) {
        results.push({ email: tc.email, status: 'savings failed', error: savingsError.message })
        continue
      }

      const totalRepayable = Math.round(tc.loan.principal * (1 + (tc.loan.rate / 100) * (tc.loan.term / 12)))
      const { data: loanData, error: loanError } = await adminSupabase
        .from('loans')
        .insert({
          customer_id: customerData.id,
          branch_id: branchId,
          loan_type: tc.loan.type,
          principal_amount: tc.loan.principal,
          interest_rate: tc.loan.rate,
          term_months: tc.loan.term,
          repayment_frequency: tc.loan.frequency,
          status: tc.loan.paid > 0 ? 'active' : 'disbursed',
          approved_by: authData.user.id,
          approved_at: new Date().toISOString(),
          disbursed_at: new Date().toISOString(),
          due_date: new Date(Date.now() + tc.loan.term * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          total_repayable: totalRepayable,
          amount_paid: tc.loan.paid,
          created_by: authData.user.id,
        })
        .select('id')
        .single()

      if (loanError) {
        results.push({ email: tc.email, status: 'loan failed', error: loanError.message })
        continue
      }

      if (tc.loan.paid > 0) {
        const installmentAmount = Math.round(totalRepayable / tc.loan.term)
        const paidInstallments = Math.floor(tc.loan.paid / installmentAmount)
        for (let i = 1; i <= paidInstallments; i++) {
          await adminSupabase
            .from('loan_repayment_schedules')
            .insert({
              loan_id: loanData.id,
              installment_number: i,
              due_date: new Date(Date.now() - (tc.loan.term - i) * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              principal_amount: Math.round(tc.loan.principal / tc.loan.term),
              interest_amount: Math.round((totalRepayable - tc.loan.principal) / tc.loan.term),
              total_amount: installmentAmount,
              amount_paid: installmentAmount,
              status: 'paid',
              paid_at: new Date(Date.now() - (tc.loan.term - i) * 30 * 24 * 60 * 60 * 1000).toISOString(),
            })

          await adminSupabase
            .from('transactions')
            .insert({
              transaction_number: `SEED-${Date.now()}-${i}`,
              customer_id: customerData.id,
              type: 'loan_repayment',
              amount: installmentAmount,
              status: 'completed',
              description: `Loan repayment - Installment ${i} of ${tc.loan.term}`,
              processed_by: authData.user.id,
            })
        }

        for (let i = paidInstallments + 1; i <= tc.loan.term; i++) {
          await adminSupabase
            .from('loan_repayment_schedules')
            .insert({
              loan_id: loanData.id,
              installment_number: i,
              due_date: new Date(Date.now() + (i - paidInstallments) * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              principal_amount: Math.round(tc.loan.principal / tc.loan.term),
              interest_amount: Math.round((totalRepayable - tc.loan.principal) / tc.loan.term),
              total_amount: installmentAmount,
              amount_paid: 0,
              status: 'pending',
            })
        }
      } else {
        for (let i = 1; i <= tc.loan.term; i++) {
          await adminSupabase
            .from('loan_repayment_schedules')
            .insert({
              loan_id: loanData.id,
              installment_number: i,
              due_date: new Date(Date.now() + i * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              principal_amount: Math.round(tc.loan.principal / tc.loan.term),
              interest_amount: Math.round((totalRepayable - tc.loan.principal) / tc.loan.term),
              total_amount: Math.round(totalRepayable / tc.loan.term),
              amount_paid: 0,
              status: 'pending',
            })
        }
      }

      await adminSupabase
        .from('transactions')
        .insert({
          transaction_number: `SEED-${Date.now()}-deposit`,
          customer_id: customerData.id,
          type: 'deposit',
          amount: tc.savings.balance,
          status: 'completed',
          description: `Initial savings deposit - ${tc.savings.type} account`,
          processed_by: authData.user.id,
        })

      if (tc.loan.paid > 0) {
        await adminSupabase
          .from('transactions')
          .insert({
            transaction_number: `SEED-${Date.now()}-disbursement`,
            customer_id: customerData.id,
            type: 'loan_disbursement',
            amount: tc.loan.principal,
            status: 'completed',
            description: `Loan disbursement - ${tc.loan.type} loan`,
            processed_by: authData.user.id,
          })
      }

      results.push({
        email: tc.email,
        status: 'created',
        password: tc.password,
        customer_id: customerData.customer_id,
        savings_balance: `GH₵ ${tc.savings.balance.toLocaleString()}`,
        loan_amount: `GH₵ ${tc.loan.principal.toLocaleString()}`,
      })
    }

    return { results }
  } catch (err) {
    console.error('Seed test customers error:', err)
    return { error: 'Failed to seed test customers' }
  }
}
