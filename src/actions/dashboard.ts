'use server'

import { createClient } from '@/lib/supabase/server'

export async function getDashboardStats() {
  const supabase = await createClient() as any

  const { data: customers } = await supabase
    .from('customers')
    .select('id, status')

  const { data: loans } = await supabase
    .from('loans')
    .select('principal_amount, amount_paid, total_repayable, status')

  const { data: savings } = await supabase
    .from('savings_accounts')
    .select('balance, status')

  const { data: transactions } = await supabase
    .from('transactions')
    .select('amount, type, created_at')
    .order('created_at', { ascending: false })
    .limit(10)

  const totalCustomers = customers?.length || 0
  const activeCustomers = customers?.filter((c: any) => c.status === 'active').length || 0

  const totalDisbursed = loans?.reduce((sum: number, l: any) => sum + Number(l.principal_amount), 0) || 0
  const totalRepaid = loans?.reduce((sum: number, l: any) => sum + Number(l.amount_paid), 0) || 0
  const totalExpected = loans?.reduce((sum: number, l: any) => sum + Number(l.total_repayable), 0) || 0
  const activeLoans = loans?.filter((l: any) => l.status === 'active' || l.status === 'disbursed').length || 0

  const totalSavings = savings?.reduce((sum: number, s: any) => sum + Number(s.balance), 0) || 0
  const activeSavings = savings?.filter((s: any) => s.status === 'active').length || 0

  const revenue = totalExpected - totalDisbursed

  return {
    customers: { total: totalCustomers, active: activeCustomers },
    loans: {
      total: loans?.length || 0,
      active: activeLoans,
      totalDisbursed,
      totalRepaid,
      totalExpected,
      outstanding: totalExpected - totalRepaid,
    },
    savings: {
      total: savings?.length || 0,
      active: activeSavings,
      totalSavings,
    },
    revenue,
    recentTransactions: transactions || [],
  }
}

export async function getTransactions(limit: number = 50) {
  const supabase = await createClient() as any

  const { data, error } = await supabase
    .from('transactions')
    .select('*, customers(first_name, last_name, customer_id), savings_accounts(account_number), loans(loan_number)')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) return { error: error.message }
  return { data }
}

export async function getBranches() {
  const supabase = await createClient() as any

  const { data, error } = await supabase
    .from('branches')
    .select('*')
    .eq('is_active', true)
    .order('name')

  if (error) return { error: error.message }
  return { data }
}

export async function getStaff() {
  const supabase = await createClient() as any

  const { data, error } = await supabase
    .from('users')
    .select('*, branches(name, code)')
    .order('created_at', { ascending: false })

  if (error) return { error: error.message }
  return { data }
}

export async function getNotifications() {
  const supabase = await createClient() as any

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) return { error: error.message }
  return { data }
}

export async function markNotificationRead(notificationId: string) {
  const supabase = await createClient() as any

  const { error } = await supabase
    .from('notifications')
    .update({ status: 'read', read_at: new Date().toISOString() })
    .eq('id', notificationId)

  if (error) return { error: error.message }
  return { success: true }
}

export async function getSettings() {
  const supabase = await createClient() as any

  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .order('category', { ascending: true })

  if (error) return { error: error.message }
  return { data }
}

export async function updateSetting(key: string, value: unknown) {
  const supabase = await createClient() as any

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('settings')
    .update({ value: value as any, updated_by: user.id, updated_at: new Date().toISOString() })
    .eq('key', key)

  if (error) return { error: error.message }

  await supabase.from('audit_logs').insert({
    user_id: user.id,
    action: 'setting_updated',
    entity_type: 'setting',
    entity_id: key,
    new_values: { key, value },
  })

  return { success: true }
}
