import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | TokSpotter',
  description: 'Privacy Policy for TokSpotter - TikTok Shop Trend Intelligence Platform',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

        <p className="text-sm text-gray-600 mb-8">
          <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>

        <div className="prose prose-gray max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              Welcome to TokSpotter. We respect your privacy and are committed to protecting your personal data. This
              Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our
              TikTok Shop trend intelligence platform. Please read this privacy policy carefully. If you do not agree
              with the terms of this privacy policy, please do not access the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">2.1 Personal Information You Provide</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              We collect information that you voluntarily provide when using our service:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Account Information:</strong> Name, email address, password (encrypted)</li>
              <li><strong>Profile Information:</strong> Optional profile details, business information</li>
              <li><strong>Communication Data:</strong> Information you provide when contacting support</li>
              <li><strong>Payment Information:</strong> Billing details (processed securely through third-party payment processors)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">2.2 Automatically Collected Information</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              When you access our service, we automatically collect certain information:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Usage Data:</strong> Pages viewed, features used, time spent on platform</li>
              <li><strong>Device Information:</strong> Browser type, operating system, device identifiers</li>
              <li><strong>Log Data:</strong> IP address, access times, error logs</li>
              <li><strong>Cookies and Tracking:</strong> Session cookies, analytics cookies, preference settings</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">2.3 TikTok Shop Data</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              We collect publicly available product data from TikTok Shop via official API:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Product Information:</strong> Product names, descriptions, images, prices</li>
              <li><strong>Performance Metrics:</strong> Sales counts, ratings, review counts (aggregated public data)</li>
              <li><strong>Shop Information:</strong> Shop names, public shop profiles</li>
              <li><strong>Category Data:</strong> Product categories and classifications</li>
            </ul>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
              <p className="text-sm text-blue-900">
                <strong>Important:</strong> We do NOT collect, access, or process any personally identifiable information
                (PII) of TikTok users, creators, or shoppers. All TikTok-sourced data is publicly available product
                information only.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We use the collected information for the following purposes:
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">3.1 Service Provision</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Create and manage your account</li>
              <li>Provide trend analysis and product intelligence</li>
              <li>Process transactions and manage subscriptions</li>
              <li>Deliver customer support and respond to inquiries</li>
              <li>Send service-related notifications and updates</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">3.2 Service Improvement</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Analyze usage patterns to improve features</li>
              <li>Develop new features and services</li>
              <li>Conduct research and analytics</li>
              <li>Monitor and analyze trends in user behavior</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">3.3 Security and Compliance</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Protect against fraud, abuse, and security threats</li>
              <li>Enforce our Terms of Service</li>
              <li>Comply with legal obligations</li>
              <li>Respond to law enforcement requests</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">3.4 Communications</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Send important account and service updates</li>
              <li>Provide customer support responses</li>
              <li>Send marketing communications (with your consent, opt-out available)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. TikTok API Compliance and Data Protection</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              TokSpotter operates in full compliance with TikTok's Developer Terms and API guidelines:
            </p>

            <div className="bg-green-50 border-l-4 border-green-500 p-4 my-4">
              <h4 className="font-semibold text-green-900 mb-2">Our Commitment to User Privacy</h4>
              <ul className="list-disc pl-6 text-green-900 text-sm space-y-1">
                <li>We recognize that user data belongs to the users themselves</li>
                <li>We safeguard all data with industry-leading security measures</li>
                <li>We never share user data without explicit consent</li>
                <li>We do not collect or process any PII from TikTok users</li>
                <li>We respect all copyright mechanisms and creator attributions</li>
                <li>We follow all data sharing and privacy laws</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">4.1 Data Access Limitations</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>We only access publicly available TikTok Shop product data</li>
              <li>We do not access private user accounts or personal profiles</li>
              <li>We do not collect viewing history, shopping behavior, or purchase data of individual users</li>
              <li>We do not access or store TikTok user authentication tokens</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">4.2 Data Security Measures</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>End-to-end encryption for data transmission</li>
              <li>Secure cloud storage with access controls</li>
              <li>Regular security audits and penetration testing</li>
              <li>Employee access limited on need-to-know basis</li>
              <li>Compliance with industry security standards (SOC 2, ISO 27001)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. How We Share Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We do not sell your personal information. We may share your information in the following circumstances:
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">5.1 Service Providers</h3>
            <p className="text-gray-700 leading-relaxed">
              We may share your information with third-party service providers who perform services on our behalf:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Cloud Hosting:</strong> Firebase/Google Cloud Platform (data storage)</li>
              <li><strong>Payment Processing:</strong> Stripe or similar payment processors</li>
              <li><strong>Analytics:</strong> Google Analytics (anonymized data)</li>
              <li><strong>Email Services:</strong> Transactional email providers</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-2">
              All service providers are contractually bound to protect your data and use it only for specified purposes.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">5.2 Legal Requirements</h3>
            <p className="text-gray-700 leading-relaxed">
              We may disclose your information if required by law or in response to valid legal requests, such as:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Compliance with legal obligations or court orders</li>
              <li>Protection of our rights, property, or safety</li>
              <li>Investigation of fraud or security issues</li>
              <li>Protection of user safety or public safety</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">5.3 Business Transfers</h3>
            <p className="text-gray-700 leading-relaxed">
              In the event of a merger, acquisition, or sale of assets, your information may be transferred to the
              acquiring entity. We will provide notice before your information is transferred and becomes subject to
              a different privacy policy.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">5.4 With Your Consent</h3>
            <p className="text-gray-700 leading-relaxed">
              We may share your information for any other purpose with your explicit consent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data Retention</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We retain your information for as long as necessary to provide our services and comply with legal obligations:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Account Data:</strong> Retained while your account is active, plus 90 days after deletion</li>
              <li><strong>Transaction Records:</strong> Retained for 7 years for tax and accounting purposes</li>
              <li><strong>Usage Logs:</strong> Retained for 12 months for security and analytics</li>
              <li><strong>TikTok Product Data:</strong> Retained as long as publicly available and relevant for trend analysis</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              You may request deletion of your personal data at any time by contacting us at privacy@tokspotter.com.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Your Privacy Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Depending on your location, you may have the following rights regarding your personal data:
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">7.1 General Rights</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
              <li><strong>Deletion:</strong> Request deletion of your personal data (right to be forgotten)</li>
              <li><strong>Data Portability:</strong> Request your data in a structured, machine-readable format</li>
              <li><strong>Object:</strong> Object to processing of your data for certain purposes</li>
              <li><strong>Restrict Processing:</strong> Request restriction of processing in certain circumstances</li>
              <li><strong>Withdraw Consent:</strong> Withdraw consent for marketing communications at any time</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">7.2 California Privacy Rights (CCPA)</h3>
            <p className="text-gray-700 leading-relaxed">
              California residents have additional rights under the California Consumer Privacy Act (CCPA):
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Right to know what personal information is collected, used, shared, or sold</li>
              <li>Right to delete personal information</li>
              <li>Right to opt-out of the sale of personal information (we do not sell personal information)</li>
              <li>Right to non-discrimination for exercising your privacy rights</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">7.3 European Privacy Rights (GDPR)</h3>
            <p className="text-gray-700 leading-relaxed">
              European Union and UK residents have rights under the General Data Protection Regulation (GDPR):
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Right to access your personal data</li>
              <li>Right to rectification of inaccurate data</li>
              <li>Right to erasure (right to be forgotten)</li>
              <li>Right to restrict processing</li>
              <li>Right to data portability</li>
              <li>Right to object to processing</li>
              <li>Right to lodge a complaint with a supervisory authority</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">7.4 Exercising Your Rights</h3>
            <p className="text-gray-700 leading-relaxed">
              To exercise any of these rights, please contact us at privacy@tokspotter.com. We will respond to your
              request within 30 days. You may also access and update certain information through your account settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Cookies and Tracking Technologies</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We use cookies and similar tracking technologies to enhance your experience:
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">8.1 Types of Cookies We Use</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Essential Cookies:</strong> Required for basic service functionality (login, sessions)</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how users interact with our service</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              <li><strong>Marketing Cookies:</strong> Track effectiveness of marketing campaigns (with consent)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">8.2 Managing Cookies</h3>
            <p className="text-gray-700 leading-relaxed">
              You can control cookies through your browser settings. Note that disabling essential cookies may impact
              service functionality. Most browsers allow you to refuse cookies, delete existing cookies, or receive
              notifications when cookies are set.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Third-Party Services</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Our service integrates with third-party services that have their own privacy policies:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>TikTok:</strong> Subject to TikTok's Privacy Policy and Terms of Service</li>
              <li><strong>Google Cloud Platform/Firebase:</strong> Subject to Google's Privacy Policy</li>
              <li><strong>Payment Processors:</strong> Subject to their respective privacy policies</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              We are not responsible for the privacy practices of third-party services. We encourage you to review
              their privacy policies before providing any information to them.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              TokSpotter is not intended for users under the age of 18. We do not knowingly collect personal information
              from children under 18. If we become aware that we have collected personal information from a child under
              18, we will take steps to delete that information. If you believe we have collected information from a
              child under 18, please contact us at privacy@tokspotter.com.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. International Data Transfers</h2>
            <p className="text-gray-700 leading-relaxed">
              Your information may be transferred to and processed in countries other than your country of residence.
              These countries may have different data protection laws. We ensure appropriate safeguards are in place
              for international transfers, including:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Standard Contractual Clauses approved by the European Commission</li>
              <li>Adequacy decisions for certain countries</li>
              <li>Your explicit consent for specific transfers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Data Security</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We implement industry-standard security measures to protect your data:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Encryption:</strong> Data encrypted in transit (TLS/SSL) and at rest (AES-256)</li>
              <li><strong>Access Controls:</strong> Role-based access with multi-factor authentication</li>
              <li><strong>Regular Audits:</strong> Security assessments and penetration testing</li>
              <li><strong>Monitoring:</strong> 24/7 security monitoring and incident response</li>
              <li><strong>Employee Training:</strong> Regular security awareness training for all staff</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              While we strive to protect your data, no method of transmission over the internet is 100% secure.
              We cannot guarantee absolute security but will notify you of any data breaches as required by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Changes to This Privacy Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes in our practices, technology,
              legal requirements, or other factors. We will notify you of significant changes by:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Posting the updated policy on this page with a new "Last Updated" date</li>
              <li>Sending an email notification to registered users</li>
              <li>Displaying a prominent notice on our service</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              Your continued use of the service after changes become effective constitutes acceptance of the updated
              Privacy Policy. We encourage you to review this policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices,
              please contact us:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                <strong>Privacy Contact:</strong> privacy@tokspotter.com<br />
                <strong>Data Protection Officer:</strong> dpo@tokspotter.com<br />
                <strong>General Support:</strong> support@tokspotter.com<br />
                <strong>Website:</strong> https://tokspotter.com<br />
                <strong>Response Time:</strong> We aim to respond to all privacy inquiries within 48 hours
              </p>
            </div>
          </section>

          <section className="border-t pt-6 mt-8">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
              <p className="text-sm text-blue-900 font-semibold mb-2">
                TikTok API Compliance Statement
              </p>
              <p className="text-sm text-blue-900">
                TokSpotter is committed to full compliance with TikTok's Developer Terms, API Guidelines, and Data
                Protection requirements. We operate transparently, respect user privacy, and implement the highest
                standards of data security. We only access publicly available TikTok Shop product data and never
                collect or process personally identifiable information of TikTok users.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
