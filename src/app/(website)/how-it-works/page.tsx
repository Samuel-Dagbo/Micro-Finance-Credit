'use client'
import { motion } from 'framer-motion'
import { UserPlus, Smartphone, Mail, CreditCard, ArrowRight, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

const steps = [
  { number: '01', title: 'Visit Our Office', description: 'Bring your valid Ghana Card and visit any of our branch offices.', icon: UserPlus, details: ['Bring your Ghana Card', 'Provide your personal details', 'Capture your profile photo', 'Receive your unique Customer ID'] },
  { number: '02', title: 'Download the App', description: 'Download the MicroFin mobile app from the Google Play Store or Apple App Store.', icon: Smartphone, details: ['Search "MicroFin" in your app store', 'Download and install the app', 'Open the app on your phone', 'Ensure you have internet connection'] },
  { number: '03', title: 'Activate Your Account', description: 'Open the app and enter your Customer ID and phone number to begin activation.', icon: Mail, details: ['Enter your Customer ID', 'Enter your registered phone number', 'Receive OTP on your email', 'Enter the 6-digit OTP code'] },
  { number: '04', title: 'Set Your Password', description: 'Create a strong password for your account to secure future logins.', icon: CreditCard, details: ['Create a strong password', 'Minimum 8 characters required', 'Include uppercase, lowercase, and numbers', 'Confirm your password'] },
  { number: '05', title: 'Start Banking', description: 'Your account is now active! View balances, apply for loans, and manage finances.', icon: CheckCircle, details: ['View your savings balance', 'Apply for loans', 'Make deposits and withdrawals', 'Track your transactions'] },
]

export default function HowItWorksPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-white py-20 lg:py-28">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-50 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">Simple Process</span>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">How It Works</h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Getting started with MicroFin is simple. Follow these 5 easy steps to begin your financial journey.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}
              >
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4">
                    Step {step.number}
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{step.title}</h2>
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed">{step.description}</p>
                  <ul className="space-y-3">
                    {step.details.map((detail) => (
                      <li key={detail} className="flex items-center gap-3 text-gray-700">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex-1 flex justify-center">
                  <div className="relative">
                    <div className="h-64 w-64 rounded-3xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 flex items-center justify-center border border-blue-100">
                      <step.icon className="h-24 w-24 text-blue-400" />
                    </div>
                    <div className="absolute -bottom-4 -right-4 h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      {step.number}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Visit our nearest branch with your Ghana Card and begin your journey to financial freedom.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/activate">
                <Button size="lg" className="gap-2 bg-blue-600 hover:bg-blue-700">
                  Activate Your Account
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline">
                  Find a Branch
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
