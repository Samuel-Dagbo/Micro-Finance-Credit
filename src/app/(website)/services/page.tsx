'use client'
import { motion } from 'framer-motion'
import { Wallet, TrendingUp, Shield, Clock, Users, BarChart3, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

export default function ServicesPage() {
  const services = [
    {
      icon: Wallet,
      title: 'Savings Accounts',
      description: 'Grow your money with our flexible savings accounts. Choose from regular, fixed, or target savings plans.',
      features: ['Competitive interest rates', 'Flexible deposit options', 'Target savings goals', 'Instant access to funds'],
      link: '/savings-products',
    },
    {
      icon: TrendingUp,
      title: 'Micro Loans',
      description: 'Access affordable loans for personal needs, business expansion, emergencies, education, and agriculture.',
      features: ['Quick approval process', 'Flexible repayment terms', 'Competitive interest rates', 'No collateral required'],
      link: '/loan-products',
    },
    {
      icon: Shield,
      title: 'Financial Security',
      description: 'Your money is protected with bank-grade security, encryption, and regulatory compliance.',
      features: ['256-bit encryption', 'Two-factor authentication', 'Regulated by Bank of Ghana', 'Fraud protection'],
      link: '/about',
    },
    {
      icon: Clock,
      title: 'Quick Processing',
      description: 'Experience fast loan approvals and instant account management with our digital platform.',
      features: ['24-hour loan approval', 'Instant deposits', 'Real-time balance updates', 'Mobile-first design'],
      link: '/how-it-works',
    },
    {
      icon: Users,
      title: 'Dedicated Support',
      description: 'Our customer support team is always ready to help you with any questions or concerns.',
      features: ['Phone support', 'Email support', 'In-app messaging', 'Branch visits'],
      link: '/contact',
    },
    {
      icon: BarChart3,
      title: 'Financial Insights',
      description: 'Track your financial growth with detailed analytics, reports, and personalized recommendations.',
      features: ['Transaction history', 'Savings analytics', 'Loan tracking', 'Financial reports'],
      link: '/overview',
    },
  ]

  return (
    <div>
      <section className="relative overflow-hidden bg-white py-20 lg:py-28">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-50 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">What We Offer</span>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Our Services</h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Comprehensive microfinance solutions designed to empower your financial journey.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20">
                  <service.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                <ul className="space-y-2 mb-8">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href={service.link}>
                  <Button variant="outline" className="w-full group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors">
                    Learn More
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
