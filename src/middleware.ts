import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isAuthRoute = pathname.startsWith('/auth/')
  const dashboardPaths = [
    '/overview',
    '/customers',
    '/loans',
    '/savings',
    '/transactions',
    '/staff',
    '/reports',
    '/settings',
  ]
  const isDashboardRoute = dashboardPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  )
  const isApiRoute = pathname.startsWith('/api/')
  const isNextStatic = pathname.startsWith('/_next')
  const hasFileExtension = /\.[a-zA-Z0-9]+$/.test(pathname)

  if (isApiRoute || isNextStatic || hasFileExtension) {
    return NextResponse.next()
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    if (isDashboardRoute) {
      const redirectUrl = new URL('/auth/login', request.url)
      redirectUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(redirectUrl)
    }
    return response
  }

  if (user && isAuthRoute && pathname !== '/auth/activate' && pathname !== '/auth/otp') {
    return NextResponse.redirect(new URL('/overview', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
