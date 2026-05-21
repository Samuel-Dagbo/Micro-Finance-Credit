'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Search } from 'lucide-react'

const faqs = [
  {
    category: 'General',
    questions: [
      {
        q: 'What is MicroFin Platform?',
        a: 'MicroFin Platform is a digital microfinance service that provides accessible loans, savings accounts, and financial management tools to individuals and small businesses across Ghana.',
      },
      {
        q: 'Who can use MicroFin?',
        a: 'Any Ghanaian with a valid Ghana Card can register and use our services. You need to visit our office first to complete registration, then activate your account through our mobile app.',
      },
      {
        q: 'Is MicroFin regulated?',
        a: 'Yes, MicroFin Platform operates under the regulations of the Bank of Ghana and follows all financial industry standards and compliance requirements.',
      },
    ],
  },
  {
    category: 'Account & Registration',
    questions: [
      {
        q: 'How do I register for an account?',
        a: 'Visit any of our branch offices with your valid Ghana Card. Our staff will register you and provide a unique Customer ID. You can then activate your account through our mobile app.',
      },
      {
        q: 'How do I activate my account?',
        a: 'Download the MicroFin app, enter your Customer ID and registered phone number. You will receive an OTP on your email. Enter the OTP and create your password to complete activation.',
      },
      {
        q: 'What if I forget my password?',
        a: 'You can reset your password through the app using the "Forgot Password" option. You will need to verify your identity through your registered email.',
      },
      {
        q: 'Can I have multiple accounts?',
        a: 'Each customer can have one primary customer account but can open multiple savings accounts (regular, fixed, target) under that account.',
      },
    ],
  },
  {
    category: 'Loans',
    questions: [
      {
        q: 'What types of loans do you offer?',
        a: 'We offer Personal Loans, Business Loans, Emergency Loans, Agricultural Loans, and Education Loans. Each has different terms, rates, and eligibility requirements.',
      },
      {
        q: 'How long does loan approval take?',
        a: 'Most loan applications are processed within 24 hours. Emergency loans may be approved the same day for urgent situations.',
      },
      {
        q: 'What are the interest rates?',
        a: 'Interest rates vary by loan type, ranging from 15% to 30% per annum. The exact rate depends on the loan type, amount, and your credit history with us.',
      },
      {
        q: 'Can I repay my loan early?',
        a: 'Yes, you can repay your loan early at any time. There are no penalties for early repayment, and you will save on interest charges.',
      },
      {
        q: 'What happens if I miss a payment?',
        a: 'Missing a payment may result in a penalty charge. We recommend contacting us immediately if you anticipate difficulty making a payment so we can work out a solution.',
      },
    ],
  },
  {
    category: 'Savings',
    questions: [
      {
        q: 'What types of savings accounts are available?',
        a: 'We offer Regular Savings (flexible, no minimum), Target Savings (goal-oriented with higher rates), and Fixed Deposits (locked term with highest rates).',
      },
      {
        q: 'What interest rate do savings accounts earn?',
        a: 'Regular Savings earn 8% p.a., Target Savings earn 10% p.a., and Fixed Deposits earn 12-15% p.a. depending on the term length.',
      },
      {
        q: 'Can I withdraw from my savings anytime?',
        a: 'Regular Savings allow instant withdrawals. Target Savings allow withdrawals but may affect your interest rate. Fixed Deposits have a lock-in period and early withdrawal may incur a penalty.',
      },
      {
        q: 'Is there a minimum deposit?',
        a: 'There is no minimum deposit for Regular Savings. You can start saving with any amount.',
      },
    ],
  },
  {
    category: 'Security',
    questions: [
      {
        q: 'Is my money safe with MicroFin?',
        a: 'Yes, your money is protected with bank-grade security including 256-bit encryption, secure authentication, and regulatory oversight by the Bank of Ghana.',
      },
      {
        q: 'How do you protect my personal data?',
        a: 'We follow strict data protection regulations and use industry-standard encryption to protect your personal and financial information.',
      },
      {
        q: 'What should I do if I suspect unauthorized access?',
        a: 'Contact our customer support immediately. We can freeze your account and investigate any suspicious activity.',
      },
    ],
  },
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredFaqs = faqs
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.a.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.questions.length > 0)

  return (
    <div>
      <section className="relative overflow-hidden bg-white py-20 lg:py-28">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-50 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">Help Center</span>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Find answers to common questions about our services, accounts, and processes.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="relative mb-12">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all"
            />
          </div>

          {filteredFaqs.map((category) => (
            <div key={category.category} className="mb-12">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">{category.category}</h2>
              <div className="space-y-4">
                {category.questions.map((faq, index) => {
                  const key = `${category.category}-${index}`
                  const isOpen = openIndex === key

                  return (
                    <div
                      key={key}
                      className="border border-gray-200 rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : key)}
                        className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-gray-900 pr-4">{faq.q}</span>
                        <ChevronDown
                          className={`h-5 w-5 text-gray-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        />
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="px-5 pb-5 text-gray-600 leading-relaxed">
                              {faq.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No questions found matching your search.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
