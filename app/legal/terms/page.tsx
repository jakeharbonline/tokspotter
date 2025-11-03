import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | TokSpotter',
  description: 'Terms of Service for TokSpotter - TikTok Shop Trend Intelligence Platform',
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>

        <p className="text-sm text-gray-600 mb-8">
          <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>

        <div className="prose prose-gray max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              Welcome to TokSpotter. By accessing or using our service, you agree to be bound by these Terms of Service
              and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited
              from using or accessing this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              TokSpotter is a TikTok Shop trend intelligence platform that provides users with:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Real-time trending product data from TikTok Shop</li>
              <li>Product performance analytics and metrics</li>
              <li>Trend categorization and scoring algorithms</li>
              <li>Historical product performance tracking</li>
              <li>Market intelligence for e-commerce decision making</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              TokSpotter integrates with TikTok Shop's official API to provide publicly available product information.
              We do not access, collect, or process any personally identifiable information (PII) of TikTok users.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts and Registration</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              To use certain features of TokSpotter, you may be required to create an account. You agree to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain and promptly update your account information</li>
              <li>Maintain the security of your password and account</li>
              <li>Accept responsibility for all activities that occur under your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Usage and TikTok API Compliance</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              TokSpotter operates in full compliance with TikTok's Developer Terms of Service and API guidelines:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Public Data Only:</strong> We only access publicly available product information from TikTok Shop</li>
              <li><strong>No Personal Data:</strong> We do not collect, process, or store any personally identifiable information (PII) of TikTok users or creators</li>
              <li><strong>No Watermark Removal:</strong> We respect all creator copyright mechanisms and do not remove watermarks or attribution</li>
              <li><strong>API Rate Limits:</strong> We adhere to all TikTok API rate limits and usage guidelines</li>
              <li><strong>Data Security:</strong> All data obtained through TikTok's API is stored securely and protected with industry-standard safeguards</li>
              <li><strong>No Data Sharing:</strong> We do not share TikTok-sourced data with third parties without explicit authorization</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Acceptable Use Policy</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              You agree not to use TokSpotter to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Violate any applicable local, state, national, or international law</li>
              <li>Infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
              <li>Harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
              <li>Submit false or misleading information</li>
              <li>Engage in any automated use of the system, such as using scripts to send comments or messages</li>
              <li>Interfere with, disrupt, or create an undue burden on the service or networks</li>
              <li>Attempt to bypass any measures designed to prevent or restrict access to the service</li>
              <li>Copy, modify, or distribute any content from the service without authorization</li>
              <li>Use the service for any commercial purpose not explicitly authorized by us</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Intellectual Property Rights</h2>
            <p className="text-gray-700 leading-relaxed">
              TokSpotter and its original content, features, and functionality are owned by TokSpotter and are protected
              by international copyright, trademark, patent, trade secret, and other intellectual property laws. Product
              data sourced from TikTok Shop remains the property of TikTok and respective content creators. Our service
              provides analytical insights and does not claim ownership of any TikTok-sourced content.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Data Accuracy and Disclaimer</h2>
            <p className="text-gray-700 leading-relaxed">
              While we strive to provide accurate and up-to-date information, TokSpotter makes no warranties or
              representations about the accuracy, completeness, or reliability of any product data, trends, or analytics.
              All information is provided "as is" and should be independently verified before making business decisions.
              We are not responsible for any decisions made based on information provided by our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Third-Party Services and Links</h2>
            <p className="text-gray-700 leading-relaxed">
              TokSpotter may contain links to third-party websites or services, including TikTok Shop. We are not
              responsible for the content, privacy policies, or practices of any third-party websites or services.
              You acknowledge and agree that TokSpotter shall not be responsible or liable for any damage or loss
              caused by your use of any third-party services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Subscription and Billing</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              If you subscribe to paid features of TokSpotter:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>You agree to pay all fees associated with your subscription plan</li>
              <li>Subscriptions automatically renew unless cancelled before the renewal date</li>
              <li>We reserve the right to modify pricing with 30 days notice to existing subscribers</li>
              <li>Refunds may be provided at our discretion or as required by law</li>
              <li>You are responsible for all taxes associated with your subscription</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              To the maximum extent permitted by law, TokSpotter shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly
              or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from: (a) your
              access to or use of or inability to access or use the service; (b) any conduct or content of any third
              party on the service; or (c) unauthorized access, use, or alteration of your transmissions or content.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Termination</h2>
            <p className="text-gray-700 leading-relaxed">
              We may terminate or suspend your account and access to the service immediately, without prior notice or
              liability, for any reason, including breach of these Terms. Upon termination, your right to use the
              service will immediately cease. You may terminate your account at any time by contacting us or through
              your account settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these Terms at any time. We will provide notice of significant changes
              by posting the new Terms on this page and updating the "Last Updated" date. Your continued use of the
              service after changes become effective constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the United States and
              the state in which TokSpotter operates, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Dispute Resolution</h2>
            <p className="text-gray-700 leading-relaxed">
              Any disputes arising out of or relating to these Terms or the service will first be attempted to be
              resolved through good-faith negotiation. If negotiation fails, disputes will be resolved through binding
              arbitration in accordance with the rules of the American Arbitration Association.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">15. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                <strong>Email:</strong> legal@tokspotter.com<br />
                <strong>Website:</strong> https://tokspotter.com<br />
                <strong>Support:</strong> support@tokspotter.com
              </p>
            </div>
          </section>

          <section className="border-t pt-6 mt-8">
            <p className="text-sm text-gray-600">
              By using TokSpotter, you acknowledge that you have read, understood, and agree to be bound by these
              Terms of Service and our Privacy Policy.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
