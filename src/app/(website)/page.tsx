'use client'

import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Shield, TrendingUp, Users, Wallet, Clock, BarChart3, Star, Play, CheckCircle, Sparkles, Phone, Mail, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: 'easeOut' },
}

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.12 } },
}

const features = [
  { icon: Shield, title: 'Bank-Grade Security', description: 'Your money and data protected with enterprise-level encryption and security protocols.' },
  { icon: TrendingUp, title: 'Competitive Rates', description: 'Low interest rates on loans and high returns on savings to grow your wealth faster.' },
  { icon: Users, title: 'Financial Inclusion', description: 'Accessible financial services for everyone, regardless of income level or banking history.' },
  { icon: Wallet, title: 'Digital Wallet', description: 'Manage your savings and loans from anywhere with our mobile-first platform.' },
  { icon: Clock, title: 'Quick Processing', description: 'Loan approvals in 24 hours and instant savings account management.' },
  { icon: BarChart3, title: 'Smart Analytics', description: 'Track your financial growth with detailed insights and personalized reports.' },
]

const steps = [
  { number: '01', title: 'Register', description: 'Visit our office with your Ghana Card and complete registration with our staff.' },
  { number: '02', title: 'Activate', description: 'Download the app, enter your Customer ID and phone number to activate.' },
  { number: '03', title: 'Verify', description: 'Verify your email with the OTP sent to you and set your secure password.' },
  { number: '04', title: 'Start Banking', description: 'Access your savings, apply for loans, and manage your finances digitally.' },
]

const stats = [
  { value: '50,000+', label: 'Active Customers' },
  { value: 'GH₵ 120M+', label: 'Loans Disbursed' },
  { value: 'GH₵ 45M+', label: 'Savings Managed' },
  { value: '99.9%', label: 'Uptime' },
]

const testimonials = [
  {
    name: 'Ama Mensah',
    role: 'Market Trader, Kumasi',
    content: 'MicroFin helped me expand my business. I got a loan of GH₵5,000 and now I have two shops!',
    rating: 5,
  },
  {
    name: 'Kwame Asante',
    role: 'Farmer, Tamale',
    content: 'The loan process was so fast. I applied and got approved within 24 hours. Amazing service!',
    rating: 5,
  },
  {
    name: 'Grace Osei',
    role: 'Teacher, Accra',
    content: 'I have been saving with MicroFin for 3 years. The interest rates are better than any bank.',
    rating: 5,
  },
]

function AnimatedCounter({ target }: { target: string }) {
  const [count, setCount] = useState(0)
  const numericPart = parseInt(target.replace(/[^0-9]/g, ''))
  const prefix = target.match(/^[^0-9]*/)?.[0] || ''
  const suffix = target.match(/[^0-9]*$/)?.[0] || ''

  useEffect(() => {
    let start = 0
    const duration = 2000
    const increment = numericPart / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= numericPart) {
        setCount(numericPart)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [numericPart])

  return <span>{prefix}{count.toLocaleString()}{suffix}</span>
}

export default function HomePage() {
  return (
    <div>
      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden bg-white">
        {/* Subtle decorative elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-50/80 to-transparent" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-cyan-50/50 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-16 sm:pt-12 sm:pb-20 lg:pt-16 lg:pb-24">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left content */}
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-sm text-blue-700 mb-6"
              >
                <Sparkles className="h-4 w-4 text-yellow-500" />
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                Trusted by 50,000+ Ghanaians
              </motion.div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-[1.15] mb-4 lg:mb-6">
                Modern{' '}
                <span className="text-gradient bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  Microfinance
                </span>
                <br className="hidden sm:block" />
                for{' '}
                <span className="text-gradient bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                  Everyone
                </span>
              </h1>

              <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-lg leading-relaxed">
                Access loans, grow your savings, and manage your finances digitally.
                Built for Ghana, designed for the future.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-8 lg:mb-10">
                <Link href="/auth/activate">
                  <Button size="lg" className="gap-2 text-sm sm:text-base px-6 sm:px-10 py-3 sm:py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/20 w-full sm:w-auto">
                    Get Started Free
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button size="lg" variant="outline" className="gap-2 text-sm sm:text-base px-6 sm:px-10 py-3 sm:py-6 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl w-full sm:w-auto">
                    <Play className="h-4 w-4 sm:h-5 sm:w-5" />
                    See How It Works
                  </Button>
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex items-center gap-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-xs font-bold text-white">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">4.9/5 from 2,000+ reviews</p>
                </div>
              </div>
            </motion.div>

            {/* Right - Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="relative">
                {/* Decorative background shape */}
                <div className="absolute -inset-4 bg-gradient-to-br from-blue-100 to-cyan-50 rounded-3xl" />
                
                {/* Main image */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src="https://media.istockphoto.com/id/2198966747/photo/couple-closing-real-estate-contract-with-real-estate-agent.webp?a=1&b=1&s=612x612&w=0&k=20&c=MRupwwS_sR21cACmOIEPxd5ykbXbZsxLoc_oKUsaNhc="
                    alt="Happy customer closing a deal"
                    className="w-full h-[350px] sm:h-[400px] lg:h-[500px] object-cover"
                  />
                </div>

                {/* Floating card - Loan approved */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.6 }}
                  className="absolute -bottom-4 sm:-bottom-6 -left-2 sm:-left-6 bg-white rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-5 flex items-center gap-3 sm:gap-4 border border-gray-100"
                >
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-gray-900">Loan Approved!</p>
                    <p className="text-xs text-gray-500">GH₵ 15,000 disbursed</p>
                  </div>
                </motion.div>

                {/* Floating card - Savings growth */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3, duration: 0.6 }}
                  className="absolute -top-3 sm:-top-4 -right-2 sm:-right-4 bg-white rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-5 border border-gray-100"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-blue-100 flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Savings Growth</p>
                      <p className="text-base sm:text-lg font-bold text-green-600">+24.5%</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="relative -mt-8 z-10 pb-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 lg:p-8"
          >
            {stats.map((stat) => (
              <motion.div key={stat.label} variants={fadeInUp} className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-blue-600">
                  <AnimatedCounter target={stat.value} />
                </div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4">Why Choose Us</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Why Choose MicroFin?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We combine technology with financial expertise to deliver exceptional microfinance services.
            </p>
          </motion.div>

          <motion.div variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                className="group p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20">
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== IMAGE SHOWCASE ===== */}
      <section className="py-20 lg:py-28 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4">Our Impact</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Empowering Communities Through Financial Access
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                From market traders to farmers, we provide the financial tools that help everyday Ghanaians build better futures.
              </p>
              <div className="space-y-4">
                {[
                  { title: 'Quick Loan Approval', desc: 'Get approved within 24 hours of application' },
                  { title: 'Flexible Repayment', desc: 'Choose repayment plans that work for you' },
                  { title: 'Secure Savings', desc: 'Your money is safe with bank-grade security' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://media.istockphoto.com/id/2198966747/photo/couple-closing-real-estate-contract-with-real-estate-agent.webp?a=1&b=1&s=612x612&w=0&k=20&c=MRupwwS_sR21cACmOIEPxd5ykbXbZsxLoc_oKUsaNhc="
                  alt="Happy customers"
                    className="w-full h-64 sm:h-80 lg:h-96 object-cover"
                />
              </div>
              <div className="absolute -bottom-6 right-2 sm:-right-4 lg:-right-6 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl shadow-xl p-6">
                <p className="text-3xl font-bold">98%</p>
                <p className="text-sm text-blue-200">Customer Satisfaction</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4">Simple Process</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Get Started in 4 Simple Steps</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From registration to your first transaction, we make it seamless.
            </p>
          </motion.div>

          <motion.div variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div key={step.number} variants={fadeInUp} className="relative group">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-200 to-transparent z-0" />
                )}
                <div className="relative z-10">
                  <div className="text-6xl font-black text-blue-100 group-hover:text-blue-200 transition-colors mb-4">{step.number}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-12">
            <Link href="/how-it-works">
              <Button variant="outline" className="gap-2">
                See Full Process
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-20 lg:py-28 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4">Testimonials</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Real stories from real people who transformed their lives with MicroFin.
            </p>
          </motion.div>

          <motion.div variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <motion.div key={t.name} variants={fadeInUp} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-6">"{t.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://media.istockphoto.com/id/2198966747/photo/couple-closing-real-estate-contract-with-real-estate-agent.webp?a=1&b=1&s=612x612&w=0&k=20&c=MRupwwS_sR21cACmOIEPxd5ykbXbZsxLoc_oKUsaNhc="
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
              Ready to Take Control of Your Finances?
            </h2>
            <p className="text-lg text-blue-100 mb-10">
              Join thousands of Ghanaians who trust MicroFin for their financial needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/activate">
                <Button size="lg" variant="secondary" className="gap-3 text-base px-10 py-6 rounded-xl shadow-lg">
                  Activate Your Account
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="gap-3 text-base px-10 py-6 border-white/30 text-white hover:bg-white/10 rounded-xl">
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== FOOTER CTA BAR ===== */}
      <section className="bg-white border-t border-gray-100 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-8 text-center sm:text-left">
            <div className="flex items-center gap-4 justify-center sm:justify-start">
              <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Phone className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Call Us</p>
                <p className="font-semibold text-gray-900">+233 30 123 4567</p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-center sm:justify-start">
              <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email Us</p>
                <p className="font-semibold text-gray-900">support@microfin.com.gh</p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-center sm:justify-start">
              <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Visit Us</p>
                <p className="font-semibold text-gray-900">Accra, Ghana</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
