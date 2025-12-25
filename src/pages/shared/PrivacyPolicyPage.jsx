/**
 * Privacy Policy Page
 * Comprehensive privacy policy covering data collection, usage, and user rights.
 */

import { PageWrapper, PageHeader } from '@/components/layout/page-wrapper';
import { Card, CardContent } from '@/components/ui/card';

export function PrivacyPolicyPage() {
  const lastUpdated = 'December 16, 2024';

  return (
    <PageWrapper>
      <PageHeader
        title="Privacy Policy"
        subtitle={`Last Updated: ${lastUpdated}`}
      />

      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="prose prose-sm max-w-none py-8 px-6 md:px-10">

            <h2>1. Introduction</h2>
            <p>
              The CRNA Club ("we," "us," or "our") is committed to protecting your privacy. This
              Privacy Policy explains how we collect, use, disclose, and safeguard your information
              when you use our website, mobile application, and related services (collectively, the
              "Service").
            </p>
            <p>
              Please read this Privacy Policy carefully. By using the Service, you consent to the
              collection and use of your information as described in this policy. If you do not
              agree with the terms of this Privacy Policy, please do not access the Service.
            </p>

            <hr className="my-8" />

            <h2>2. Information We Collect</h2>

            <h3>2.1 Information You Provide Directly</h3>
            <p>We collect information you voluntarily provide, including:</p>
            <ul>
              <li><strong>Account Information:</strong> Name, email address, password, profile picture</li>
              <li><strong>Payment Information:</strong> Billing address, payment card details (processed securely by Stripe - we do not store full card numbers)</li>
              <li><strong>Academic Information:</strong> GPA data (overall, science, last 60 credits), GRE scores, completed prerequisites, transcript data</li>
              <li><strong>Professional Information:</strong> ICU type and years of experience, certifications (CCRN, BLS, ACLS, PALS) and expiration dates, clinical experience logs, shadow day records, leadership activities</li>
              <li><strong>Application Data:</strong> Saved CRNA programs, application status, checklist progress, target school lists, documents you upload</li>
              <li><strong>User Content:</strong> Forum posts, comments, reviews, messages, reflections, and other content you submit</li>
              <li><strong>Communications:</strong> Emails, support requests, and other correspondence with us</li>
            </ul>

            <h3>2.2 Information Collected Automatically</h3>
            <p>When you access our Service, we automatically collect:</p>
            <ul>
              <li><strong>Device Information:</strong> Device type, operating system, browser type, unique device identifiers</li>
              <li><strong>Usage Data:</strong> Pages viewed, features used, time spent on pages, click patterns, search queries</li>
              <li><strong>Location Data:</strong> General geographic location based on IP address</li>
              <li><strong>Log Data:</strong> IP address, access times, referring URLs, error logs</li>
            </ul>

            <h3>2.3 Information from Third Parties</h3>
            <p>We may receive information from:</p>
            <ul>
              <li><strong>Payment Processors:</strong> Transaction confirmations and billing information from Stripe</li>
              <li><strong>Authentication Providers:</strong> If you sign in using a third-party service (Google, etc.)</li>
              <li><strong>Analytics Providers:</strong> Aggregated usage statistics and insights</li>
            </ul>

            <hr className="my-8" />

            <h2>3. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul>
              <li>Provide, maintain, and improve our Service</li>
              <li>Create and manage your account</li>
              <li>Process transactions and send related information</li>
              <li>Calculate your ReadyScore and provide personalized readiness insights</li>
              <li>Generate recommendations based on aggregate peer comparisons</li>
              <li>Match you with relevant CRNA programs based on your profile</li>
              <li>Facilitate mentor matching in our marketplace</li>
              <li>Send deadline reminders and certification expiration alerts</li>
              <li>Send administrative communications (updates, security alerts, support messages)</li>
              <li>Send marketing communications (with your consent, where required)</li>
              <li>Respond to your comments, questions, and support requests</li>
              <li>Monitor and analyze usage patterns and trends</li>
              <li>Detect, prevent, and address fraud, abuse, and technical issues</li>
              <li>Comply with legal obligations</li>
            </ul>

            <hr className="my-8" />

            <h2>4. How We Share Your Information</h2>

            <h3>4.1 We Never Sell Your Personal Data</h3>
            <p>
              <strong>We will never sell, rent, or trade your personal information to third parties
              for their marketing purposes.</strong>
            </p>

            <h3>4.2 Sharing with Service Providers</h3>
            <p>We may share your information with third-party service providers who perform services on our behalf:</p>
            <ul>
              <li><strong>Payment Processing:</strong> Stripe for payment transactions</li>
              <li><strong>Hosting:</strong> Cloud infrastructure providers (Vercel, Supabase)</li>
              <li><strong>Analytics:</strong> Services that help us understand usage patterns</li>
              <li><strong>Email:</strong> Email service providers for transactional and marketing emails</li>
              <li><strong>Customer Support:</strong> Help desk and support tools</li>
            </ul>
            <p>
              These providers are contractually obligated to use your information only for the
              purposes of providing their services to us and to maintain appropriate security measures.
            </p>

            <h3>4.3 Sharing with Other Users</h3>
            <p>Certain information may be visible to other users:</p>
            <ul>
              <li><strong>Forum Posts:</strong> Content you post in community forums is public to other members</li>
              <li><strong>Mentor Profiles:</strong> If you become a mentor, your profile information is visible to potential clients</li>
              <li><strong>Reviews:</strong> Reviews you leave for mentors are visible to other users</li>
            </ul>

            <h3>4.4 Aggregate and Anonymized Data</h3>
            <p>
              We may use and share aggregated, anonymized data that cannot identify you individually
              for research, analytics, benchmarking, marketing, and to improve our services. For
              example, we may publish statistics about average GPAs or experience levels of successful
              CRNA applicants.
            </p>

            <h3>4.5 Legal Requirements</h3>
            <p>We may disclose your information if required by law or in response to:</p>
            <ul>
              <li>Subpoenas, court orders, or legal process</li>
              <li>Requests from law enforcement or government agencies</li>
              <li>To protect our rights, property, or safety, or that of our users or the public</li>
              <li>To enforce our Terms and Conditions</li>
              <li>To detect, prevent, or address fraud or security issues</li>
            </ul>

            <h3>4.6 Business Transfers</h3>
            <p>
              If we are involved in a merger, acquisition, or sale of assets, your information may
              be transferred as part of that transaction. We will notify you of any change in
              ownership or use of your personal information.
            </p>

            <hr className="my-8" />

            <h2>5. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to collect and store information.
              For detailed information, please see our Cookie Policy.
            </p>
            <p>Types of cookies we use:</p>
            <ul>
              <li><strong>Essential Cookies:</strong> Required for the Service to function properly</li>
              <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how you use the Service</li>
              <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements (with consent)</li>
            </ul>
            <p>
              You can control cookies through your browser settings. Note that disabling certain
              cookies may affect the functionality of the Service.
            </p>

            <hr className="my-8" />

            <h2>6. Data Retention</h2>
            <p>
              We retain your personal information for as long as your account is active or as needed
              to provide you services. We may also retain and use your information as necessary to:
            </p>
            <ul>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes</li>
              <li>Enforce our agreements</li>
              <li>Maintain business records</li>
            </ul>
            <p>
              When you delete your account, we will delete or anonymize your personal information
              within 30 days, except for information we are required to retain by law.
            </p>

            <hr className="my-8" />

            <h2>7. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal
              information, including:
            </p>
            <ul>
              <li>Encryption of data in transit (HTTPS/TLS)</li>
              <li>Encryption of sensitive data at rest</li>
              <li>Secure authentication practices</li>
              <li>Regular security assessments</li>
              <li>Access controls limiting who can view your data</li>
              <li>Secure hosting infrastructure</li>
            </ul>
            <p>
              However, no method of transmission over the Internet or electronic storage is 100%
              secure. While we strive to protect your personal information, we cannot guarantee
              its absolute security.
            </p>

            <hr className="my-8" />

            <h2>8. Your Rights and Choices</h2>

            <h3>8.1 Access and Portability</h3>
            <p>
              You have the right to access the personal information we hold about you and to receive
              a copy of your data in a portable format.
            </p>

            <h3>8.2 Correction</h3>
            <p>
              You can update or correct most of your personal information through your account
              settings. If you need assistance, contact us at support@thecrnaclub.com.
            </p>

            <h3>8.3 Deletion</h3>
            <p>
              You may request deletion of your account and personal information by contacting us.
              Note that some information may be retained as required by law or for legitimate
              business purposes.
            </p>

            <h3>8.4 Marketing Communications</h3>
            <p>
              You can opt out of marketing emails by clicking the "unsubscribe" link in any
              marketing email or by updating your notification preferences in your account settings.
              Note that you cannot opt out of transactional emails (receipts, account alerts, etc.).
            </p>

            <h3>8.5 Do Not Track</h3>
            <p>
              Some browsers have a "Do Not Track" feature. Our Service does not currently respond
              to Do Not Track signals.
            </p>

            <hr className="my-8" />

            <h2>9. Children's Privacy</h2>
            <p>
              Our Service is not directed to individuals under 18 years of age. We do not knowingly
              collect personal information from children under 18. If we learn we have collected
              personal information from a child under 18, we will delete that information promptly.
              If you believe we have information from a child under 18, please contact us.
            </p>

            <hr className="my-8" />

            <h2>10. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your
              country of residence. These countries may have data protection laws that are different
              from the laws of your country. By using our Service, you consent to the transfer of
              your information to the United States and other countries where we operate.
            </p>

            <hr className="my-8" />

            <h2>11. California Privacy Rights</h2>
            <p>
              If you are a California resident, you have additional rights under the California
              Consumer Privacy Act (CCPA). Please see our California Privacy Rights page for details.
            </p>

            <hr className="my-8" />

            <h2>12. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any material
              changes by posting the new Privacy Policy on this page and updating the "Last Updated"
              date. We encourage you to review this Privacy Policy periodically.
            </p>

            <hr className="my-8" />

            <h2>13. Contact Us</h2>
            <p>
              If you have questions or concerns about this Privacy Policy or our data practices,
              please contact us at:
            </p>
            <ul>
              <li><strong>Email:</strong> privacy@thecrnaclub.com</li>
              <li><strong>Support:</strong> support@thecrnaclub.com</li>
              <li><strong>Website:</strong> www.thecrnaclub.com</li>
            </ul>

          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
