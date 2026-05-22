import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardSidebar from '@/components/dashboard/sidebar'
import DashboardHeader from '@/components/dashboard/header'

async function getUserProfile(userId: string, email: string) {
  const supabase = await createClient()

  const { data: staffData } = await supabase
    .from('users')
    .select('*, branches(name, code)')
    .eq('id', userId)
    .single()

  if (staffData) {
    if (staffData.role === 'customer') {
      const { data: customerData } = await supabase
        .from('customers')
        .select('*, branches(name)')
        .eq('user_id', userId)
        .single()

      if (customerData) {
        return {
          type: 'customer' as const,
          data: {
            ...customerData,
            first_name: customerData.first_name,
            last_name: customerData.last_name,
            email: customerData.email,
            role: 'customer',
            branches: customerData.branches,
          },
        }
      }
    }
    return { type: 'staff' as const, data: staffData }
  }

  const { data: customerData } = await supabase
    .from('customers')
    .select('*, branches(name)')
    .eq('user_id', userId)
    .single()

  if (customerData) {
    return {
      type: 'customer' as const,
      data: {
        ...customerData,
        first_name: customerData.first_name,
        last_name: customerData.last_name,
        email: customerData.email,
        role: 'customer',
        branches: customerData.branches,
      },
    }
  }

  const { error: insertError } = await supabase
    .from('users')
    .insert({
      id: userId,
      email,
      full_name: email.split('@')[0],
      role: 'super_admin',
      is_active: true,
    })
    .select('*, branches(name, code)')
    .single()

  if (!insertError) {
    const { data: newStaffData } = await supabase
      .from('users')
      .select('*, branches(name, code)')
      .eq('id', userId)
      .single()

    if (newStaffData) {
      return { type: 'staff' as const, data: newStaffData }
    }
  }

  return {
    type: 'fallback' as const,
    data: {
      id: userId,
      email,
      full_name: email.split('@')[0],
      first_name: email.split('@')[0],
      last_name: '',
      role: 'super_admin',
      branches: null,
      is_active: true,
    },
  }
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const profile = await getUserProfile(user.id, user.email || '')

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar user={profile.data} />
      <div className="lg:pl-64">
        <DashboardHeader user={profile.data} />
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
