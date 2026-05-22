'use server'

import { createClient } from '@/lib/supabase/server'
import { customerRegistrationSchema } from '@/lib/validations'
import { revalidatePath } from 'next/cache'

export async function registerCustomer(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const validated = customerRegistrationSchema.safeParse({
    first_name: formData.get('first_name'),
    last_name: formData.get('last_name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    ghana_card_number: formData.get('ghana_card_number'),
    date_of_birth: formData.get('date_of_birth'),
    gender: formData.get('gender'),
    address: formData.get('address'),
    occupation: formData.get('occupation'),
    employer: formData.get('employer'),
    monthly_income: formData.get('monthly_income'),
    branch_id: formData.get('branch_id'),
  })

  if (!validated.success) {
    return { error: validated.error.issues[0].message }
  }

  const { data: userData } = await supabase
    .from('users')
    .select('role, branch_id')
    .eq('id', user.id)
    .single()

  if (!userData || !['super_admin', 'branch_manager', 'loan_officer', 'cashier'].includes((userData as any).role)) {
    return { error: 'Insufficient permissions' }
  }

  const { data: customer, error } = await supabase
    .from('customers')
    .insert({
      ...validated.data,
      branch_id: validated.data.branch_id,
      registered_by: user.id,
      status: 'pending_activation',
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  await supabase.from('audit_logs').insert({
    user_id: user.id,
    action: 'customer_registered',
    entity_type: 'customer',
    entity_id: (customer as any).id,
    new_values: { customer_id: (customer as any).customer_id, name: `${(customer as any).first_name} ${(customer as any).last_name}` },
  })

  revalidatePath('/customers')
  return { success: true, customer_id: (customer as any).customer_id }
}

export async function updateCustomerStatus(customerId: string, status: 'active' | 'suspended' | 'closed') {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('customers')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', customerId)

  if (error) return { error: error.message }

  await supabase.from('audit_logs').insert({
    user_id: user.id,
    action: 'customer_status_updated',
    entity_type: 'customer',
    entity_id: customerId,
    new_values: { status },
  })

  revalidatePath('/customers')
  return { success: true }
}

export async function getCustomers(branchId?: string) {
  const supabase = await createClient()

  let query = supabase
    .from('customers')
    .select('*, branches(name, code)')
    .order('created_at', { ascending: false })

  if (branchId) {
    query = query.eq('branch_id', branchId)
  }

  const { data, error } = await query
  if (error) return { error: error.message }

  return { data }
}

export async function getCustomerById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('customers')
    .select('*, branches(name, code)')
    .eq('id', id)
    .single()

  if (error) return { error: error.message }
  return { data }
}

export async function getCustomerByCustomerId(customerId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('customers')
    .select('*, branches(name, code)')
    .eq('customer_id', customerId)
    .single()

  if (error) return { error: error.message }
  return { data }
}
