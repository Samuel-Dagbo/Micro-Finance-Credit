'use client'
import { motion } from 'framer-motion'
import { CheckCircle, ArrowRight, FileText, Clock, Shield, PiggyBank } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

const loanTypes = [
  {
    type: 'Personal Loan',
    description: 'For personal needs, emergencies, or unexpected expenses.',
    amount: 'GH₵ 100 - GH₵ 10,000',
    rate: '18% - 24% p.a.',
    term: '1 - 12 months',
    features: ['No collateral required', 'Quick approval', 'Flexible repayment', 'Mobile application'],
    popular: false,
  },
  {
    type: 'Business Loan',
    description: 'Expand your business, purchase inventory, or invest in equipment.',
    amount: 'GH₵ 500 - GH₵ 50,000',
    rate: '20% - 28% p.a.',
    term: '3 - 24 months',
    features: ['Business growth support', 'Higher loan amounts', 'Tailored repayment', 'Dedicated officer'],
    popular: true,
  },
  {
    type: 'Emergency Loan',
    description: 'Fast access to funds for urgent medical or family emergencies.',
    amount: 'GH₵ 100 - GH₵ 5,000',
    rate: '22% - 30% p.a.',
    term: '1 - 6 months',
    features: ['Same-day approval', 'Minimal documentation', 'Emergency priority', 'Flexible terms'],
    popular: false,
  },
  {
    type: 'Agricultural Loan',
    description: 'Support for farmers to purchase seeds, equipment, and inputs.',
    amount: 'GH₵ 500 - GH₵ 30,000',
    rate: '15% - 22% p.a.',
    term: '3 - 18 months',
    features: ['Seasonal repayment', 'Agri-support included', 'Lower rates', 'Harvest-aligned terms'],
    popular: false,
  },
  {
    type: 'Education Loan',
    description: 'Invest in education for yourself or your children.',
    amount: 'GH₵ 200 - GH₵ 15,000',
    rate: '16% - 24% p.a.',
    term: '6 - 24 months',
    features: ['Direct school payment', 'Grace period', 'Lower rates', 'Long-term options'],
    popular: false,
  },
]

const requirements = [
  'Valid Ghana Card',
  'Proof of income or business activity',
  'Active mobile phone number',
  'Registered MicroFin customer account',
  'Minimum 3 months of account activity (for business loans)',
]

export default function LoansPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-white py-20 lg:py-28">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-50 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">Affordable Financing</span>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Loan Products</h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Affordable loans designed to meet your personal and business needs.
              Apply through our platform and get approved within 24 hours.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4">Our Products</span>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Loan</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              All loans come with transparent terms and no hidden fees.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loanTypes.map((loan, index) => (
              <motion.div
                key={loan.type}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
                  loan.popular
                    ? 'bg-gradient-to-br from-blue-600 to-blue-700 border-blue-500 text-white shadow-xl shadow-blue-500/20'
                    : 'bg-white border-gray-100 shadow-sm hover:shadow-lg'
                }`}
              >
                {loan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <h3 className={`text-xl font-semibold mb-2 ${loan.popular ? 'text-white' : 'text-gray-900'}`}>{loan.type}</h3>
                <p className={`mb-6 ${loan.popular ? 'text-blue-100' : 'text-gray-600'}`}>{loan.description}</p>
                <div className={`space-y-2 text-sm mb-6 ${loan.popular ? 'text-blue-100' : 'text-gray-500'}`}>
                  <div className="flex justify-between">
                    <span>Amount Range</span>
                    <span className={`font-medium ${loan.popular ? 'text-white' : 'text-gray-900'}`}>{loan.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Interest Rate</span>
                    <span className={`font-medium ${loan.popular ? 'text-white' : 'text-gray-900'}`}>{loan.rate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Loan Term</span>
                    <span className={`font-medium ${loan.popular ? 'text-white' : 'text-gray-900'}`}>{loan.term}</span>
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                  {loan.features.map((feature) => (
                    <div key={feature} className={`flex items-center gap-2 text-sm ${loan.popular ? 'text-blue-100' : 'text-gray-600'}`}>
                      <CheckCircle className={`h-4 w-4 flex-shrink-0 ${loan.popular ? 'text-green-300' : 'text-green-500'}`} />
                      {feature}
                    </div>
                  ))}
                </div>
                <Link href="/auth/activate">
                  <Button className={`w-full ${loan.popular ? 'bg-white text-blue-600 hover:bg-blue-50' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                    Apply Now
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Requirements</h2>
              <ul className="space-y-4">
                {requirements.map((req) => (
                  <li key={req} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">How to Apply</h2>
              <div className="space-y-6">
                {[
                  { step: '1', title: 'Register', desc: 'Visit our office with your Ghana Card to register.' },
                  { step: '2', title: 'Activate Account', desc: 'Download the app and activate with your Customer ID.' },
                  { step: '3', title: 'Apply for Loan', desc: 'Submit your loan application through the app.' },
                  { step: '4', title: 'Get Approved', desc: 'Receive approval within 24 hours.' },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link href="/auth/activate">
                  <Button className="w-full gap-2 bg-blue-600 hover:bg-blue-700">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
