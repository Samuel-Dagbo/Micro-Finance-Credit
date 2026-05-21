'use client'
import { motion } from 'framer-motion'
import { PiggyBank, TrendingUp, Shield, Target, Calendar, ArrowRight, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

const savingsTypes = [
  {
    icon: PiggyBank,
    type: 'Regular Savings',
    description: 'Flexible savings account with no minimum balance. Deposit and withdraw anytime.',
    rate: '8% p.a.',
    features: ['No minimum balance', 'Instant withdrawals', 'Daily interest calculation', 'Mobile access'],
    color: 'from-green-500 to-emerald-600',
  },
  {
    icon: Target,
    type: 'Target Savings',
    description: 'Save towards a specific goal with a target amount and timeline.',
    rate: '10% p.a.',
    features: ['Set your goal', 'Track progress', 'Higher interest rate', 'Automated reminders'],
    color: 'from-blue-500 to-blue-600',
    popular: true,
  },
  {
    icon: Calendar,
    type: 'Fixed Deposit',
    description: 'Lock your savings for a fixed period and earn higher interest rates.',
    rate: '12% - 15% p.a.',
    features: ['Guaranteed returns', 'Higher interest rates', 'Flexible terms', 'Maturity notifications'],
    color: 'from-purple-500 to-purple-600',
  },
]

export default function SavingsPage() {
  const [deposit, setDeposit] = useState(1000)
  const [monthly, setMonthly] = useState(200)
  const [rate, setRate] = useState(10)
  const [months, setMonths] = useState(12)

  const total = deposit + monthly * months
  const interest = total * (rate / 100) * (months / 12)
  const estimated = total + interest

  return (
    <div>
      <section className="relative overflow-hidden bg-white py-20 lg:py-28">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-green-50 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-6">Grow Your Wealth</span>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Savings Products</h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Grow your money with our competitive savings accounts.
              Earn interest, set goals, and build your financial future.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-4">Savings Plans</span>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the savings plan that works best for your financial goals.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {savingsTypes.map((plan, index) => (
              <motion.div
                key={plan.type}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
                  plan.popular
                    ? 'bg-gradient-to-br from-blue-600 to-blue-700 border-blue-500 text-white shadow-xl shadow-blue-500/20'
                    : 'bg-white border-gray-100 shadow-sm hover:shadow-lg'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
                    RECOMMENDED
                  </div>
                )}
                <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-6 shadow-lg`}>
                  <plan.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className={`text-xl font-semibold mb-2 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>{plan.type}</h3>
                <p className={`mb-4 ${plan.popular ? 'text-blue-100' : 'text-gray-600'}`}>{plan.description}</p>
                <div className={`text-3xl font-bold mb-6 ${plan.popular ? 'text-white' : 'text-blue-600'}`}>{plan.rate}</div>
                <ul className="space-y-2 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className={`flex items-center gap-2 text-sm ${plan.popular ? 'text-blue-100' : 'text-gray-600'}`}>
                      <CheckCircle className={`h-4 w-4 flex-shrink-0 ${plan.popular ? 'text-green-300' : 'text-green-500'}`} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/auth/activate">
                  <Button className={`w-full ${plan.popular ? 'bg-white text-blue-600 hover:bg-blue-50' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                    Start Saving
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Save with MicroFin?</h2>
              <div className="space-y-6">
                {[
                  { icon: TrendingUp, title: 'Competitive Interest Rates', description: 'Earn up to 15% annual interest on your savings.' },
                  { icon: Shield, title: 'Secure & Regulated', description: 'Your savings are protected and regulated by the Bank of Ghana.' },
                  { icon: PiggyBank, title: 'Flexible Access', description: 'Deposit and withdraw from your savings account anytime.' },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link href="/auth/activate">
                  <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                    Start Saving Today
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Savings Calculator</h3>
              <div className="space-y-5">
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Initial Deposit: GH₵ {deposit.toLocaleString()}</label>
                  <input type="range" min={100} max={10000} step={100} value={deposit} onChange={(e) => setDeposit(Number(e.target.value))} className="w-full" />
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Monthly Contribution: GH₵ {monthly.toLocaleString()}</label>
                  <input type="range" min={50} max={2000} step={50} value={monthly} onChange={(e) => setMonthly(Number(e.target.value))} className="w-full" />
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Interest Rate: {rate}% p.a.</label>
                  <input type="range" min={5} max={15} step={1} value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full" />
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Duration: {months} months</label>
                  <input type="range" min={3} max={36} step={1} value={months} onChange={(e) => setMonths(Number(e.target.value))} className="w-full" />
                </div>
                <div className="p-5 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl text-white">
                  <div className="text-sm text-blue-200 mb-1">Estimated Balance</div>
                  <div className="text-3xl font-bold">GH₵ {Math.round(estimated).toLocaleString()}</div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">* This is an estimate. Actual returns may vary.</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
