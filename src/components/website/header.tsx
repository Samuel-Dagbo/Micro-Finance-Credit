'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, User, ArrowRight, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/loan-products', label: 'Loans' },
  { href: '/savings-products', label: 'Savings' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/contact', label: 'Contact' },
]

interface HeaderProps {
  user: any
}

export default function Header({ user }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Top bar */}
      <div className="hidden lg:block bg-blue-600 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-9 items-center justify-between text-xs">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Phone className="h-3 w-3" />
                <span>+233 30 123 4567</span>
              </div>
              <span>support@microfin.com.gh</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Mon - Fri: 8:00 AM - 5:00 PM</span>
              <span className="h-3 w-px bg-blue-400" />
              <span>Licensed by Bank of Ghana</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-gray-200/50'
            : 'bg-white'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 lg:h-20 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-600/20 group-hover:shadow-blue-600/40 transition-shadow">
                <span className="text-lg font-bold text-white">M</span>
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">MicroFin</span>
                <span className="hidden sm:block text-[10px] text-gray-400 -mt-1 tracking-wider uppercase">Digital Banking</span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 rounded-lg transition-colors group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-blue-600 rounded-full group-hover:w-6 transition-all duration-300" />
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3">
              {user ? (
                <Link href="/overview">
                  <Button className="gap-2 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20">
                    <User className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button variant="ghost" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/activate">
                    <Button className="gap-2 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 transition-all">
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden border-t border-gray-100 bg-white overflow-hidden"
            >
              <div className="px-4 py-6 space-y-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <div className="pt-4 mt-4 border-t border-gray-100 space-y-2">
                  <div className="flex items-center gap-3 px-4 py-2 text-sm text-gray-500">
                    <Phone className="h-4 w-4" />
                    <span>+233 30 123 4567</span>
                  </div>
                  <div className="space-y-3">
                  {user ? (
                    <Link href="/overview" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full gap-2 bg-blue-600 hover:bg-blue-700">
                        <User className="h-4 w-4" />
                        Dashboard
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link href="/auth/login" onClick={() => setMobileOpen(false)} className="block">
                        <Button variant="outline" className="w-full">Sign In</Button>
                      </Link>
                      <Link href="/auth/activate" onClick={() => setMobileOpen(false)} className="block">
                        <Button className="w-full gap-2 bg-blue-600 hover:bg-blue-700">
                          Get Started
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
