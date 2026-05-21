import { createClient } from '@/lib/supabase/server'
import Header from '@/components/website/header'
import Footer from '@/components/website/footer'

export default async function WebsiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let user = null

  try {
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    user = authUser
  } catch {
    // Graceful degradation
  }

  return (
    <div className="min-h-screen bg-white">
      <Header user={user} />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
