'use client'

import Link from 'next/link'
import { useState, useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { activateAccount } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { ArrowLeft, User, Phone, Mail, AlertCircle, CheckCircle } from 'lucide-react'

export default function ActivatePage() {
  const router = useRouter()
  const [email, setEmail] = useState('')

  const [state, formAction, isPending] = useActionState(
    async (_prev: any, formData: FormData) => {
      try {
        const result = await activateAccount(formData)
        if (result.success && result.email) {
          setEmail(result.email)
        }
        return result
      } catch (err: any) {
        return { error: err?.message || 'An unexpected error occurred' }
      }
    },
    null
  )

  if (state && 'success' in state && state.success && email) {
    return (
      <div className="min-h-screen flex">
        <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-green-600 via-green-700 to-green-900 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://media.istockphoto.com/id/2198966747/photo/couple-closing-real-estate-contract-with-real-estate-agent.webp?a=1&b=1&s=612x612&w=0&k=20&c=MRupwwS_sR21cACmOIEPxd5ykbXbZsxLoc_oKUsaNhc=')] bg-cover bg-center mix-blend-overlay opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 to-transparent" />
          <div className="relative z-10 flex flex-col justify-center px-12 text-white">
            <div className="mb-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm mb-6">
                <span className="text-2xl font-bold">M</span>
              </div>
              <h2 className="text-4xl font-bold mb-4">Your Journey Starts Here</h2>
              <p className="text-lg text-green-100 max-w-md">
                Activate your account and unlock access to loans, savings, and financial freedom.
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gray-50">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-6">
                <Mail className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h1>
              <p className="text-gray-500 mb-6">
                We sent a verification code to <strong className="text-gray-900">{email}</strong>
              </p>
              <p className="text-sm text-gray-500 mb-8">
                Enter the 6-digit code to verify your email and set up your password.
              </p>
              <Link href={`/auth/otp?email=${encodeURIComponent(email)}`}>
                <Button className="w-full bg-green-600 hover:bg-green-700" size="lg">
                  Continue to Verification
                  <ArrowLeft className="h-4 w-4 rotate-180 ml-2" />
                </Button>
              </Link>
              <p className="text-xs text-gray-400 mt-4">
                Didn't receive the code? Check your spam folder or try again.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-green-600 via-green-700 to-green-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://media.istockphoto.com/id/2198966747/photo/couple-closing-real-estate-contract-with-real-estate-agent.webp?a=1&b=1&s=612x612&w=0&k=20&c=MRupwwS_sR21cACmOIEPxd5ykbXbZsxLoc_oKUsaNhc=')] bg-cover bg-center mix-blend-overlay opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 to-transparent" />
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm mb-6">
              <span className="text-2xl font-bold">M</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">Your Journey Starts Here</h2>
            <p className="text-lg text-green-100 max-w-md">
              Activate your account and unlock access to loans, savings, and financial freedom.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-2xl font-bold">24hrs</p>
              <p className="text-sm text-green-200">Loan Approval</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-2xl font-bold">0%</p>
              <p className="text-sm text-green-200">Hidden Fees</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gray-50">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="text-center mb-8">
              <div className="lg:hidden flex justify-center mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-600">
                  <span className="text-xl font-bold text-white">M</span>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Activate Account</h1>
              <p className="text-gray-500 mt-1">Enter your Customer ID and phone number</p>
            </div>

            {state?.error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{state.error}</p>
              </div>
            )}

            <form action={formAction} className="space-y-5">
              <div>
                <label htmlFor="customer_id" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Customer ID
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="customer_id"
                    name="customer_id"
                    type="text"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all bg-white"
                    placeholder="e.g. CUST-001"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all bg-white"
                    placeholder="e.g. 0241234567"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" size="lg" disabled={isPending}>
                {isPending ? 'Activating...' : 'Activate Account'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Already activated?{' '}
                <Link href="/auth/login" className="text-green-600 hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
