import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/overview'
  const redirectTo = searchParams.get('redirect_to')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const target = redirectTo || next
      const allowedPaths = ['/overview', '/customers', '/loans', '/savings', '/transactions', '/staff', '/reports', '/settings']
      const safeRedirect = allowedPaths.includes(target) ? target : '/overview'
      return NextResponse.redirect(`${origin}${safeRedirect}`)
    }
    console.error('OAuth callback error:', error.message)
  }

  return NextResponse.redirect(`${origin}/auth/login`)
}
