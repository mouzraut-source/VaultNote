import { motion } from 'framer-motion'
import { PageLayout } from '@/components/layout/PageLayout'
import { Card } from '@/components/Card'
import { fadeInUp } from '@/components/ui/MotionComponents'

export function TermsOfService() {
  const lastUpdated = 'January 15, 2025'
  const effectiveDate = 'January 15, 2025'

  return (
    <PageLayout>
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <header className="text-center mb-12">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Terms of Service</h1>
              <p className="text-lg text-gray-500">Last updated: {lastUpdated} | Effective: {effectiveDate}</p>
            </header>

            <div className="space-y-8">
              <Card className="space-y-6" padding="lg">
                <section>
                  <h2 className="text-xl font-semibold text-gray-900">1. Acceptance of Terms</h2>
                  <div className="mt-4 space-y-3 text-gray-600">
                    <p>By accessing or using VaultNote ("the Platform"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part, you may not use the Platform.</p>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900">2. Description of Service</h2>
                  <div className="mt-4 space-y-3 text-gray-600">
                    <p>VaultNote is an academic content distribution platform that enables:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Students to purchase and access academic materials (PDFs, notes, guides)</li>
                      <li>Manual UPI payment verification by administrators</li>
                      <li>Secure, time-limited PDF viewing via signed URLs</li>
                      <li>Account management and purchase history</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900">3. User Accounts</h2>
                  <div className="mt-4 space-y-3 text-gray-600">
                    <ul className="list-disc list-inside space-y-2 ml-4 text-gray-600">
                      <li>You must provide accurate, complete registration information</li>
                      <li>You are responsible for maintaining password confidentiality</li>
                      <li>One account per person; no sharing or transfer</li>
                      <li>Single active session per account enforced</li>
                      <li>You must notify us immediately of unauthorized access</li>
                      <li>We may suspend accounts violating these Terms</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900">4. Purchases & Payments</h2>
                  <div className="mt-4 space-y-3 text-gray-600">
                    <h3 className="font-medium text-gray-900">Payment Process:</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4 text-gray-600">
                      <li>Payments are made via UPI to our designated account</li>
                      <li>You must submit transaction reference and UPI ID for verification</li>
                      <li>Admins manually verify within 24 hours (typically faster)</li>
                      <li>Access granted only after admin approval</li>
                      <li>Rejected payments: no access granted, no refund for invalid refs</li>
                    </ul>
                    <h3 className="font-medium text-gray-900 mt-4">Pricing:</h3>
                    <p className="text-gray-600">Prices displayed in INR. We reserve the right to change prices with notice.</p>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900">5. Access to Materials</h2>
                  <div className="mt-4 space-y-3 text-gray-600">
                    <ul className="list-disc list-inside space-y-2 ml-4 text-gray-600">
                      <li>Access granted upon payment approval</li>
                      <li>PDFs viewed in-browser via PDF.js (no download)</li>
                      <li>Signed URLs expire in 5 minutes for security</li>
                      <li>No printing, downloading, or screen recording permitted</li>
                      <li>Access is personal, non-transferable license</li>
                      <li>We may revoke access for Terms violations</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900">6. Intellectual Property</h2>
                  <div className="mt-4 space-y-3 text-gray-600">
                    <p className="text-gray-600">All content on the Platform (materials, designs, code, trademarks) is owned by VaultNote or its licensors. You receive a limited license to view purchased materials. No rights to copy, distribute, modify, or create derivative works.</p>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900">7. User Conduct</h2>
                  <div className="mt-4 space-y-3 text-gray-600">
                    <p className="text-gray-600">You agree not to:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4 text-gray-600">
                      <li>Share account credentials or purchased content</li>
                      <li>Attempt to bypass payment or access controls</li>
                      <li>Reverse engineer, decompile, or extract source code</li>
                      <li>Use automated tools to scrape or download content</li>
                      <li>Harass, threaten, or impersonate others</li>
                      <li>Violate any applicable laws or regulations</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900">8. Refunds</h2>
                  <div className="mt-4 space-y-3 text-gray-600">
                    <ul className="list-disc list-inside space-y-2 ml-4 text-gray-600">
                      <li>Refunds for duplicate payments or system errors only</li>
                      <li>No refunds for change of mind or mistaken purchases</li>
                      <li>Refund requests: contact support within 7 days</li>
                      <li>Approved refunds processed to original payment method</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900">9. Disclaimers</h2>
                  <div className="mt-4 space-y-3 text-gray-600">
                    <p className="text-gray-600">The Platform is provided "as is" without warranties of any kind. We do not guarantee:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4 text-gray-600">
                      <li>Uninterrupted or error-free access</li>
                      <li>Accuracy or completeness of academic materials</li>
                      <li>Specific academic outcomes from using materials</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900">10. Limitation of Liability</h2>
                  <div className="mt-4 space-y-3 text-gray-600">
                    <p className="text-gray-600">To the maximum extent permitted by law, VaultNote shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or use. Total liability limited to amount paid in preceding 12 months.</p>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900">11. Termination</h2>
                  <div className="mt-4 space-y-3 text-gray-600">
                    <p className="text-gray-600">We may terminate or suspend your account immediately for Terms violations. Upon termination: access revoked, no refunds for unused periods, certain provisions survive (IP, liability, disputes).</p>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900">12. Governing Law & Disputes</h2>
                  <div className="mt-4 space-y-3 text-gray-600">
                    <p className="text-gray-600">These Terms governed by laws of India. Disputes resolved in courts of Mumbai, Maharashtra. You agree to personal jurisdiction there.</p>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900">13. Changes to Terms</h2>
                  <div className="mt-4 space-y-3 text-gray-600">
                    <p className="text-gray-600">We may modify Terms with 30 days' notice via email or platform notice. Continued use after changes constitutes acceptance. Material changes require explicit consent.</p>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900">14. Contact Information</h2>
                  <div className="mt-4 space-y-3 text-gray-600">
                    <address className="not-italic">
                      <p>VaultNote Academic Platform</p>
                      <p>Email: legal@vaultnote.com</p>
                      <p>Support: support@vaultnote.com</p>
                    </address>
                  </div>
                </section>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  )
}