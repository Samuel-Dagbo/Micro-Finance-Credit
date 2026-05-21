'use client'
import { motion } from 'framer-motion'

export default function TermsPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-white py-20 lg:py-28">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-50 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">Legal</span>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Terms & Conditions</h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              The terms and conditions that govern your use of our services.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-8 text-gray-600 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p>
                By registering for and using MicroFin Platform services, you agree to be bound by these Terms 
                and Conditions. If you do not agree, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Eligibility</h2>
              <p>
                To use our services, you must:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Be a Ghanaian citizen or resident</li>
                <li>Be at least 18 years of age</li>
                <li>Possess a valid Ghana Card</li>
                <li>Complete the registration process at our office</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Account Responsibilities</h2>
              <p>
                You are responsible for maintaining the confidentiality of your account credentials. 
                You must notify us immediately of any unauthorized use of your account. We reserve the 
                right to suspend or terminate accounts that violate these terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Loans</h2>
              <p>
                Loan terms, interest rates, and repayment schedules are determined at the time of approval. 
                Borrowers must repay loans according to the agreed schedule. Late payments may incur penalties. 
                Defaulting on loans may result in legal action and reporting to credit bureaus.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Savings</h2>
              <p>
                Savings accounts are subject to the terms specified at account opening. Interest rates may 
                change based on market conditions. Fixed deposit accounts have specific maturity dates and 
                early withdrawal penalties may apply.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Fees and Charges</h2>
              <p>
                We may charge fees for certain services as outlined in our fee schedule. All fees will be 
                communicated to you before they are applied. We reserve the right to modify fees with 
                30 days notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Limitation of Liability</h2>
              <p>
                MicroFin Platform shall not be liable for any indirect, incidental, or consequential damages 
                arising from the use of our services. Our total liability shall not exceed the amount of fees 
                paid by you in the 12 months preceding the claim.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Governing Law</h2>
              <p>
                These terms are governed by the laws of Ghana. Any disputes shall be resolved through the 
                courts of Ghana or through arbitration as agreed by both parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact</h2>
              <p>
                For questions about these terms, contact us at:<br />
                Email: legal@microfin.gh<br />
                Phone: +233 30 000 0000
              </p>
            </section>
          </div>
        </div>
      </section>
    </div>
  )
}
