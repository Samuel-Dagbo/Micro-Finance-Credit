'use server'

import { createClient } from '@/lib/supabase/server'
import { loanCreationSchema, loanApprovalSchema, repaymentSchema } from '@/lib/validations'
import { calculateLoanRepayment, generateRepaymentSchedule } from '@/lib/utils/helpers'
import { revalidatePath } from 'next/cache'

export async function createLoan(formData: FormData) {
  const supabase = await createClient() as any

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const validated = loanCreationSchema.safeParse({
    customer_id: formData.get('customer_id'),
    loan_type: formData.get('loan_type'),
    principal_amount: formData.get('principal_amount'),
    interest_rate: formData.get('interest_rate'),
    term_months: formData.get('term_months'),
    repayment_frequency: formData.get('repayment_frequency'),
    notes: formData.get('notes'),
  })

  if (!validated.success) {
    return { error: validated.error.issues[0].message }
  }

  const { data: userData } = await supabase
    .from('users')
    .select('role, branch_id')
    .eq('id', user.id)
    .single()

  if (!userData || !['super_admin', 'branch_manager', 'loan_officer'].includes(userData.role)) {
    return { error: 'Insufficient permissions' }
  }

  const { data: customer } = await supabase
    .from('customers')
    .select('branch_id')
    .eq('id', validated.data.customer_id)
    .single()

  if (!customer) return { error: 'Customer not found' }

  const repayment = calculateLoanRepayment(
    validated.data.principal_amount,
    validated.data.interest_rate,
    validated.data.term_months,
    validated.data.repayment_frequency
  )

  const { data: loan, error } = await supabase
    .from('loans')
    .insert({
      customer_id: validated.data.customer_id,
      branch_id: customer.branch_id,
      loan_type: validated.data.loan_type,
      principal_amount: validated.data.principal_amount,
      interest_rate: validated.data.interest_rate,
      term_months: validated.data.term_months,
      repayment_frequency: validated.data.repayment_frequency,
      total_repayable: repayment.totalRepayable,
      created_by: user.id,
      notes: validated.data.notes,
      status: 'pending',
    })
    .select()
    .single()

  if (error) return { error: error.message }

  const schedule = generateRepaymentSchedule(
    validated.data.principal_amount,
    validated.data.interest_rate,
    validated.data.term_months,
    validated.data.repayment_frequency
  )

  const scheduleInserts = schedule.map(s => ({
    loan_id: loan.id,
    ...s,
  }))

  await supabase.from('loan_repayment_schedules').insert(scheduleInserts)

  await supabase.from('audit_logs').insert({
    user_id: user.id,
    action: 'loan_created',
    entity_type: 'loan',
    entity_id: loan.id,
    new_values: { loan_number: loan.loan_number, principal: validated.data.principal_amount },
  })

  revalidatePath('/loans')
  return { success: true, loan_number: loan.loan_number }
}

export async function approveLoan(formData: FormData) {
  const supabase = await createClient() as any

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const validated = loanApprovalSchema.safeParse({
    loan_id: formData.get('loan_id'),
    approved: formData.get('approved') === 'true',
    notes: formData.get('notes'),
  })

  if (!validated.success) {
    return { error: validated.error.issues[0].message }
  }

  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!userData || !['super_admin', 'branch_manager'].includes(userData.role)) {
    return { error: 'Insufficient permissions' }
  }

  const updates: Record<string, unknown> = {
    approved_by: user.id,
    approved_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  if (validated.data.approved) {
    updates.status = 'approved'
  } else {
    updates.status = 'rejected'
  }

  if (validated.data.notes) {
    updates.notes = validated.data.notes
  }

  const { error } = await supabase
    .from('loans')
    .update(updates)
    .eq('id', validated.data.loan_id)

  if (error) return { error: error.message }

  await supabase.from('audit_logs').insert({
    user_id: user.id,
    action: validated.data.approved ? 'loan_approved' : 'loan_rejected',
    entity_type: 'loan',
    entity_id: validated.data.loan_id,
    new_values: { status: validated.data.approved ? 'approved' : 'rejected' },
  })

  revalidatePath('/loans')
  return { success: true }
}

export async function disburseLoan(loanId: string) {
  const supabase = await createClient() as any

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data: loan } = await supabase
    .from('loans')
    .select('*, customers(*)')
    .eq('id', loanId)
    .single()

  if (!loan) return { error: 'Loan not found' }
  if (loan.status !== 'approved') return { error: 'Loan must be approved before disbursement' }

  const { error: loanError } = await supabase
    .from('loans')
    .update({
      status: 'disbursed',
      disbursed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', loanId)

  if (loanError) return { error: loanError.message }

  await supabase.from('transactions').insert({
    transaction_number: '',
    customer_id: loan.customer_id,
    loan_id: loanId,
    type: 'loan_disbursement',
    amount: loan.principal_amount,
    processed_by: user.id,
    description: `Loan disbursement - ${loan.loan_number}`,
  })

  await supabase.from('audit_logs').insert({
    user_id: user.id,
    action: 'loan_disbursed',
    entity_type: 'loan',
    entity_id: loanId,
    new_values: { status: 'disbursed', amount: loan.principal_amount },
  })

  revalidatePath('/loans')
  return { success: true }
}

export async function processRepayment(formData: FormData) {
  const supabase = await createClient() as any

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const validated = repaymentSchema.safeParse({
    loan_id: formData.get('loan_id'),
    amount: formData.get('amount'),
    payment_method: formData.get('payment_method'),
    payment_reference: formData.get('payment_reference'),
    notes: formData.get('notes'),
  })

  if (!validated.success) {
    return { error: validated.error.issues[0].message }
  }

  const { data: loan } = await supabase
    .from('loans')
    .select('*')
    .eq('id', validated.data.loan_id)
    .single()

  if (!loan) return { error: 'Loan not found' }
  if (!['disbursed', 'active'].includes(loan.status)) return { error: 'Loan is not active' }

  const remainingAmount = loan.total_repayable - loan.amount_paid
  if (validated.data.amount > remainingAmount) {
    return { error: 'Payment amount exceeds remaining balance' }
  }

  const interestPortion = (validated.data.amount * loan.interest_rate / 100) / 12
  const principalPortion = validated.data.amount - interestPortion

  const { error: repaymentError } = await supabase
    .from('loan_repayments')
    .insert({
      loan_id: validated.data.loan_id,
      customer_id: loan.customer_id,
      amount: validated.data.amount,
      principal_portion: principalPortion,
      interest_portion: interestPortion,
      payment_method: validated.data.payment_method,
      payment_reference: validated.data.payment_reference,
      collected_by: user.id,
      notes: validated.data.notes,
    })

  if (repaymentError) return { error: repaymentError.message }

  const newAmountPaid = loan.amount_paid + validated.data.amount
  const newStatus = newAmountPaid >= loan.total_repayable ? 'completed' : 'active'

  await supabase
    .from('loans')
    .update({
      amount_paid: newAmountPaid,
      status: newStatus,
      completed_at: newStatus === 'completed' ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', validated.data.loan_id)

  await supabase.from('transactions').insert({
    transaction_number: '',
    customer_id: loan.customer_id,
    loan_id: validated.data.loan_id,
    type: 'loan_repayment',
    amount: validated.data.amount,
    processed_by: user.id,
    description: `Loan repayment - ${loan.loan_number}`,
  })

  await supabase.from('audit_logs').insert({
    user_id: user.id,
    action: 'repayment_processed',
    entity_type: 'loan',
    entity_id: validated.data.loan_id,
    new_values: { amount: validated.data.amount, new_balance: loan.total_repayable - newAmountPaid },
  })

  revalidatePath('/loans')
  revalidatePath('/transactions')
  return { success: true }
}

export async function getLoans(branchId?: string, status?: string) {
  const supabase = await createClient() as any

  let query = supabase
    .from('loans')
    .select('*, customers(first_name, last_name, customer_id), branches(name, code)')
    .order('created_at', { ascending: false })

  if (branchId) {
    query = query.eq('branch_id', branchId)
  }
  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query
  if (error) return { error: error.message }
  return { data }
}

export async function getLoanById(id: string) {
  const supabase = await createClient() as any

  const { data, error } = await supabase
    .from('loans')
    .select('*, customers(*), branches(name, code), loan_repayment_schedules(*), loan_repayments(*)')
    .eq('id', id)
    .single()

  if (error) return { error: error.message }
  return { data }
}

export async function getLoanStats() {
  const supabase = await createClient() as any

  const { data: totalLoans } = await supabase
    .from('loans')
    .select('id', { count: 'exact' })

  const { data: activeLoans } = await supabase
    .from('loans')
    .select('id', { count: 'exact' })
    .eq('status', 'active')

  const { data: pendingLoans } = await supabase
    .from('loans')
    .select('id', { count: 'exact' })
    .eq('status', 'pending')

  const { data: completedLoans } = await supabase
    .from('loans')
    .select('id', { count: 'exact' })
    .eq('status', 'completed')

  const { data: loans } = await supabase
    .from('loans')
    .select('principal_amount, amount_paid, total_repayable')

  const totalDisbursed = loans?.reduce((sum: number, l: any) => sum + Number(l.principal_amount), 0) || 0
  const totalRepaid = loans?.reduce((sum: number, l: any) => sum + Number(l.amount_paid), 0) || 0
  const totalExpected = loans?.reduce((sum: number, l: any) => sum + Number(l.total_repayable), 0) || 0

  return {
    total: totalLoans?.length || 0,
    active: activeLoans?.length || 0,
    pending: pendingLoans?.length || 0,
    completed: completedLoans?.length || 0,
    totalDisbursed,
    totalRepaid,
    totalExpected,
    outstanding: totalExpected - totalRepaid,
  }
}
