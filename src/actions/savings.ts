'use server'

import { createClient } from '@/lib/supabase/server'
import { depositSchema, withdrawalSchema } from '@/lib/validations'
import { revalidatePath } from 'next/cache'

export async function createSavingsAccount(customerId: string, accountType: 'regular' | 'fixed' | 'target', targetAmount?: number, maturityDate?: string) {
  const supabase = await createClient() as any

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data: customer } = await supabase
    .from('customers')
    .select('branch_id')
    .eq('id', customerId)
    .single()

  if (!customer) return { error: 'Customer not found' }

  const { data: account, error } = await supabase
    .from('savings_accounts')
    .insert({
      customer_id: customerId,
      account_type: accountType,
      balance: 0,
      target_amount: targetAmount || null,
      maturity_date: maturityDate || null,
      status: 'active',
    })
    .select()
    .single()

  if (error) return { error: error.message }

  await supabase.from('audit_logs').insert({
    user_id: user.id,
    action: 'savings_account_created',
    entity_type: 'savings_account',
    entity_id: account.id,
    new_values: { account_number: account.account_number, type: accountType },
  })

  revalidatePath('/savings')
  return { success: true, account_number: account.account_number }
}

export async function processDeposit(formData: FormData) {
  const supabase = await createClient() as any

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const validated = depositSchema.safeParse({
    customer_id: formData.get('customer_id'),
    account_id: formData.get('account_id'),
    amount: formData.get('amount'),
    payment_method: formData.get('payment_method'),
    notes: formData.get('notes'),
  })

  if (!validated.success) {
    return { error: validated.error.issues[0].message }
  }

  const { data: account } = await supabase
    .from('savings_accounts')
    .select('*')
    .eq('id', validated.data.account_id)
    .single()

  if (!account) return { error: 'Account not found' }
  if (account.status !== 'active') return { error: 'Account is not active' }

  const newBalance = Number(account.balance) + validated.data.amount

  const { error: updateError } = await supabase
    .from('savings_accounts')
    .update({ balance: newBalance, updated_at: new Date().toISOString() })
    .eq('id', validated.data.account_id)

  if (updateError) return { error: updateError.message }

  await supabase.from('transactions').insert({
    transaction_number: '',
    customer_id: validated.data.customer_id,
    account_id: validated.data.account_id,
    type: 'deposit',
    amount: validated.data.amount,
    processed_by: user.id,
    description: `Savings deposit - ${account.account_number}`,
  })

  await supabase.from('audit_logs').insert({
    user_id: user.id,
    action: 'deposit_processed',
    entity_type: 'savings_account',
    entity_id: validated.data.account_id,
    new_values: { amount: validated.data.amount, new_balance: newBalance },
  })

  revalidatePath('/savings')
  revalidatePath('/transactions')
  return { success: true }
}

export async function processWithdrawal(formData: FormData) {
  const supabase = await createClient() as any

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const validated = withdrawalSchema.safeParse({
    customer_id: formData.get('customer_id'),
    account_id: formData.get('account_id'),
    amount: formData.get('amount'),
    notes: formData.get('notes'),
  })

  if (!validated.success) {
    return { error: validated.error.issues[0].message }
  }

  const { data: account } = await supabase
    .from('savings_accounts')
    .select('*')
    .eq('id', validated.data.account_id)
    .single()

  if (!account) return { error: 'Account not found' }
  if (account.status !== 'active') return { error: 'Account is not active' }
  if (Number(account.balance) < validated.data.amount) return { error: 'Insufficient balance' }

  const newBalance = Number(account.balance) - validated.data.amount

  const { error: updateError } = await supabase
    .from('savings_accounts')
    .update({ balance: newBalance, updated_at: new Date().toISOString() })
    .eq('id', validated.data.account_id)

  if (updateError) return { error: updateError.message }

  await supabase.from('transactions').insert({
    transaction_number: '',
    customer_id: validated.data.customer_id,
    account_id: validated.data.account_id,
    type: 'withdrawal',
    amount: validated.data.amount,
    processed_by: user.id,
    description: `Savings withdrawal - ${account.account_number}`,
  })

  await supabase.from('audit_logs').insert({
    user_id: user.id,
    action: 'withdrawal_processed',
    entity_type: 'savings_account',
    entity_id: validated.data.account_id,
    new_values: { amount: validated.data.amount, new_balance: newBalance },
  })

  revalidatePath('/savings')
  revalidatePath('/transactions')
  return { success: true }
}

export async function getSavingsAccounts(customerId?: string) {
  const supabase = await createClient() as any

  let query = supabase
    .from('savings_accounts')
    .select('*, customers(first_name, last_name, customer_id)')
    .order('created_at', { ascending: false })

  if (customerId) {
    query = query.eq('customer_id', customerId)
  }

  const { data, error } = await query
  if (error) return { error: error.message }
  return { data }
}

export async function getSavingsStats() {
  const supabase = await createClient() as any

  const { data: accounts } = await supabase
    .from('savings_accounts')
    .select('balance, status')

  const totalSavings = accounts?.reduce((sum: number, a: any) => sum + Number(a.balance), 0) || 0
  const activeAccounts = accounts?.filter((a: any) => a.status === 'active').length || 0
  const frozenAccounts = accounts?.filter((a: any) => a.status === 'frozen').length || 0

  return {
    totalSavings,
    totalAccounts: accounts?.length || 0,
    activeAccounts,
    frozenAccounts,
  }
}
