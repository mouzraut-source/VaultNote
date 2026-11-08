import { motion } from 'framer-motion'
import { PageLayout } from '@/components/layout/PageLayout'
import { Card } from '@/components/Card'
import { fadeInUp } from '@/components/ui/MotionComponents'

export function PrivacyPolicy() {
  const lastUpdated = 'January 15, 2025'

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
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
              <p className="text-lg text-gray-500">Last updated: {lastUpdated}</p>
            </header>

            <div className="space-y-8">
              <Card className="space-y-6" padding="lg">
                <section>
                  <h2 className="text-xl font-semibold text-gray-900">1. Information We Collect</h2>
                  <div className="mt-4 space-y-3 text-gray-600">
                    <p>We collect information you provide directly to us, including:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Account information: name, email address, password (hashed)</li>
                      <li>Payment information: transaction references, UPI IDs (for manual verification)</li>
                      <li>Purchase history: products purchased, access logs</li>
                      <li>Communication: support messages, feedback</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900">2. How We Use Your Information</h2>
                  <div className="mt-4 space-y-3 text-gray-600">
                    <p>We use your information to:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Create and manage your account</li>
                      <li>Process payments and verify transactions</li>
                      <li>Grant access to purchased academic materials</li>
                      <li>Send order confirmations and account notifications</li>
                      <li>Improve our platform and user experience</li>
                      <li>Comply with legal obligations</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900">3. Data Storage & Security</h2>
                  <div className="mt-4 space-y-3 text-gray-600">
                    <p>Your data is stored securely using:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Supabase (PostgreSQL) with Row Level Security (RLS) policies</li>
                      <li>Encrypted storage for sensitive data</li>
                      <li>Signed URLs with 5-minute expiry for PDF access</li>
                      <li>No service role keys in frontend code</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900">4. Payment Information</h2>
                  <div className="mt-4 space-y-3 text-gray-600">
                    <p>For UPI payments:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>We only store transaction references and UPI IDs you provide</li>
                      <li>We do not store full bank details, card numbers, or passwords</li>
                      <li>Payment proofs are stored in private Supabase Storage buckets</li>
                      <li>Admins manually verify transactions before granting access</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900">5. Your Rights</h2>
                  <div className="mt-4 space-y-3 text-gray-600">
                    <p>You have the right to:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Access your personal data</li>
                      <li>Request correction of inaccurate data</li>
                      <li>Request deletion of your account and data</li>
                      <li>Export your data</li>
                      <li>Object to processing</li>
                    </ul>
                    <p>Contact us at privacy@vaultnote.com to exercise these rights.</p>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900">6. Data Retention</h2>
                  <div className="mt-4 space-y-3 text-gray-600">
                    <p>We retain your data for:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Account data: While your account is active</li>
                      <li>Purchase records: 7 years for financial compliance</li>
                      <li>Payment proofs: 3 years after verification</li>
                      <li>Access logs: 1 year for security auditing</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900">7. Third-Party Services</h2>
                  <div className="mt-4 space-y-3 text-gray-600">
                    <p>We use the following services:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Supabase: Authentication, database, storage</li>
                      <li>Cloudflare Pages: Hosting and CDN</li>
                      <li>PDF.js: Client-side PDF rendering</li>
                    </ul>
                    <p>These services have their own privacy policies.</p>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900">8. Cookies & Tracking</h2>
                  <div className="mt-4 space-y-3 text-gray-600">
                    <p>We use minimal cookies:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Session cookies for authentication (HttpOnly, Secure)</li>
                      <li>No third-party tracking cookies</li>
                      <li>No advertising cookies</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900">9. Changes to This Policy</h2>
                  <div className="mt-4 space-y-3 text-gray-600">
                    <p>We may update this policy. Changes will be posted here with an updated "Last updated" date. Continued use constitutes acceptance.</p>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900">10. Contact Us</h2>
                  <div className="mt-4 space-y-3 text-gray-600">
                    <p>For privacy questions:</p>
                    <address className="not-italic">
                      <p>Email: privacy@vaultnote.com</p>
                      <p>Address: VaultNote, Academic Content Platform</p>
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