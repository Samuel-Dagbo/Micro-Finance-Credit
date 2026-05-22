'use client'
import { motion } from 'framer-motion'
import { Target, Eye, Heart, Award, Users, Building2, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

export default function AboutPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-white py-20 lg:py-28">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-50 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl">
              <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">About Us</span>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">About MicroFin</h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                We are on a mission to provide accessible, affordable, and transparent microfinance services
                to every Ghanaian, leveraging technology to bridge the financial inclusion gap.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="https://media.istockphoto.com/id/2198966747/photo/couple-closing-real-estate-contract-with-real-estate-agent.webp?a=1&b=1&s=612x612&w=0&k=20&c=MRupwwS_sR21cACmOIEPxd5ykbXbZsxLoc_oKUsaNhc="
                  alt="MicroFin team"
                  className="w-full h-48 sm:h-64 lg:h-80 object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Founded in 2020, MicroFin Platform emerged from a simple observation: millions of hardworking
                  Ghanaians lacked access to fair financial services. Traditional banks were out of reach, and
                  informal lending came with exploitative rates.
                </p>
                <p>
                  We built a digital-first microfinance platform that combines the trust of traditional banking
                  with the convenience of modern technology. Our platform serves individuals, small businesses,
                  and communities across Ghana.
                </p>
                <p>
                  Today, we serve over 50,000 active customers, manage GH₵ 45 million in savings, and have
                  disbursed over GH₵ 120 million in loans to empower dreams and businesses.
                </p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {[
                  { icon: Target, value: '2020', label: 'Founded' },
                  { icon: Users, value: '50K+', label: 'Customers' },
                  { icon: Building2, value: '15+', label: 'Branches' },
                  { icon: Award, value: '99.9%', label: 'Uptime' },
                ].map((stat) => (
                  <div key={stat.label} className="p-3 sm:p-5 bg-white rounded-xl text-center shadow-sm border border-gray-100">
                    <stat.icon className="h-5 w-5 sm:h-7 sm:w-7 text-blue-600 mx-auto mb-1 sm:mb-2" />
                    <div className="text-base sm:text-xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-xs text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4">Our Values</span>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Eye, title: 'Transparency', description: 'Clear terms, no hidden fees, and full visibility into your financial activities.' },
              { icon: Heart, title: 'Inclusion', description: 'Financial services designed for everyone, regardless of income level or banking history.' },
              { icon: Target, title: 'Empowerment', description: 'Providing tools and resources that help individuals and businesses thrive.' },
            ].map((value) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center mb-5">
                  <value.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-bold text-white mb-4">Join Our Growing Community</h2>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Be part of the financial revolution transforming Ghana.
            </p>
            <Link href="/auth/activate">
              <Button size="lg" variant="secondary" className="gap-2">
                Get Started Today
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
