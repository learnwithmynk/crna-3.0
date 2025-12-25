/**
 * Acceptable Use Policy Page
 * Guidelines for acceptable behavior on the platform, especially for marketplace mentors.
 */

import { PageWrapper, PageHeader } from '@/components/layout/page-wrapper';
import { Card, CardContent } from '@/components/ui/card';

export function AcceptableUsePolicyPage() {
  const lastUpdated = 'December 16, 2024';

  return (
    <PageWrapper>
      <PageHeader
        title="Acceptable Use Policy"
        subtitle={`Last Updated: ${lastUpdated}`}
      />

      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="prose prose-sm max-w-none py-8 px-6 md:px-10">

            <h2>1. Introduction</h2>
            <p>
              This Acceptable Use Policy ("AUP") sets forth the rules and guidelines for using
              The CRNA Club's services, including our website, community forums, mentor marketplace,
              and all related features. This policy applies to all users, including applicants,
              mentors/providers, and administrators.
            </p>
            <p>
              By using our Service, you agree to comply with this AUP. Violation of this policy
              may result in suspension or termination of your account without refund.
            </p>

            <hr className="my-8" />

            <h2>2. General Conduct</h2>
            <p>All users must:</p>
            <ul>
              <li>Treat other users with respect and professionalism</li>
              <li>Provide accurate and truthful information</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Respect the intellectual property rights of others</li>
              <li>Use the Service only for its intended purposes</li>
            </ul>

            <hr className="my-8" />

            <h2>3. Prohibited Activities</h2>
            <p>The following activities are strictly prohibited:</p>

            <h3>3.1 Illegal Activities</h3>
            <ul>
              <li>Any activity that violates local, state, federal, or international law</li>
              <li>Fraud, identity theft, or financial crimes</li>
              <li>Money laundering or terrorist financing</li>
              <li>Solicitation of illegal services or products</li>
            </ul>

            <h3>3.2 Harmful Content</h3>
            <ul>
              <li>Content that promotes violence, self-harm, or harm to others</li>
              <li>Hate speech, discrimination, or harassment based on race, ethnicity, religion, gender, sexual orientation, disability, or other protected characteristics</li>
              <li>Threats, intimidation, or bullying of any kind</li>
              <li>Sexually explicit, pornographic, or obscene content</li>
              <li>Content that exploits minors in any way</li>
            </ul>

            <h3>3.3 HIPAA Violations</h3>
            <ul>
              <li>Sharing Protected Health Information (PHI) of any patient</li>
              <li>Posting identifiable patient information in any form</li>
              <li>Sharing clinical details that could identify specific patients</li>
              <li>Violations result in immediate and permanent account termination</li>
            </ul>

            <h3>3.4 Spam and Abuse</h3>
            <ul>
              <li>Unsolicited advertising, promotional material, or spam</li>
              <li>Chain letters, pyramid schemes, or multi-level marketing</li>
              <li>Automated posting, scraping, or data harvesting</li>
              <li>Creating multiple accounts to evade restrictions</li>
              <li>Manipulating ratings, reviews, or engagement metrics</li>
            </ul>

            <h3>3.5 Security Violations</h3>
            <ul>
              <li>Attempting to access accounts or data of other users</li>
              <li>Circumventing security measures or access controls</li>
              <li>Introducing malware, viruses, or malicious code</li>
              <li>Denial of service attacks or intentional service disruption</li>
              <li>Probing or testing the vulnerability of our systems</li>
            </ul>

            <h3>3.6 Misrepresentation</h3>
            <ul>
              <li>Impersonating another person or entity</li>
              <li>Falsely claiming qualifications, credentials, or affiliations</li>
              <li>Creating fake reviews or testimonials</li>
              <li>Providing false information in your profile or applications</li>
            </ul>

            <hr className="my-8" />

            <h2>4. Marketplace-Specific Guidelines</h2>
            <p>
              Additional rules apply to users participating in our mentor marketplace:
            </p>

            <h3>4.1 For Mentors/Providers</h3>
            <ul>
              <li><strong>Accurate Representation:</strong> Your profile, qualifications, and service descriptions must be truthful and accurate</li>
              <li><strong>Professional Conduct:</strong> Maintain professionalism in all interactions with clients</li>
              <li><strong>Timely Communication:</strong> Respond to booking requests and messages promptly</li>
              <li><strong>Deliver as Promised:</strong> Provide services as described in your listings</li>
              <li><strong>Confidentiality:</strong> Keep client information confidential unless required by law</li>
              <li><strong>No Guarantees:</strong> Do not guarantee admission outcomes or make promises you cannot keep</li>
              <li><strong>Scope of Advice:</strong> Do not provide medical, legal, or financial advice beyond your qualifications</li>
              <li><strong>Platform Transactions Only:</strong> ALL paid transactions must go through the platform - no exceptions</li>
              <li><strong>No Off-Platform Solicitation:</strong> Do not share personal contact information, payment links, or solicit clients to transact outside the platform</li>
              <li><strong>No Session Recording:</strong> Do not record sessions without explicit consent from all participants</li>
              <li><strong>Tax Compliance:</strong> You are responsible for reporting and paying applicable taxes on your earnings</li>
              <li><strong>Not Medical Providers:</strong> You are not providing clinical care - refer emergencies to 911</li>
            </ul>

            <h3>4.2 For Clients</h3>
            <ul>
              <li><strong>Respectful Communication:</strong> Treat mentors with respect</li>
              <li><strong>Timely Attendance:</strong> Show up on time for scheduled sessions</li>
              <li><strong>Honest Reviews:</strong> Provide honest feedback based on your genuine experience</li>
              <li><strong>Reasonable Expectations:</strong> Understand that mentors cannot guarantee admission outcomes</li>
              <li><strong>Payment Compliance:</strong> Use the platform's payment system for all transactions</li>
              <li><strong>No Off-Platform Requests:</strong> Do not request to move transactions or communications off-platform</li>
              <li><strong>No Session Recording:</strong> Do not record sessions without explicit consent from the mentor</li>
            </ul>

            <hr className="my-8" />

            <h2>5. Community Forum Guidelines</h2>
            <p>When participating in our community forums:</p>
            <ul>
              <li><strong>Stay On Topic:</strong> Keep posts relevant to the forum category</li>
              <li><strong>Be Constructive:</strong> Offer helpful, constructive feedback and advice</li>
              <li><strong>No Trolling:</strong> Do not post inflammatory content to provoke reactions</li>
              <li><strong>Respect Privacy:</strong> Do not share personal information about others without consent</li>
              <li><strong>No Confidential Info:</strong> Do not share confidential information from CRNA programs, interviews, or employers</li>
              <li><strong>Search First:</strong> Check if your question has already been answered before posting</li>
              <li><strong>One Account:</strong> Use only one account - no sockpuppets or alt accounts</li>
            </ul>

            <hr className="my-8" />

            <h2>6. Intellectual Property</h2>
            <ul>
              <li>Do not post content that infringes copyrights, trademarks, or other intellectual property rights</li>
              <li>Do not share or distribute our premium content, courses, or digital products without authorization</li>
              <li>Do not copy, reproduce, or redistribute content from our platform</li>
              <li>Respect the intellectual property of CRNA programs and other organizations</li>
            </ul>

            <hr className="my-8" />

            <h2>7. Reporting Violations</h2>
            <p>
              If you encounter content or behavior that violates this AUP, please report it immediately:
            </p>
            <ul>
              <li>Use the "Report" feature within the platform</li>
              <li>Email us at abuse@thecrnaclub.com</li>
              <li>Include as much detail as possible, including screenshots if relevant</li>
            </ul>
            <p>
              We take all reports seriously and will investigate promptly. False or malicious
              reports may themselves be considered a violation of this policy.
            </p>

            <hr className="my-8" />

            <h2>8. Enforcement</h2>
            <p>
              We reserve the right to investigate any suspected violation of this AUP and to take
              appropriate action, including but not limited to:
            </p>
            <ul>
              <li>Warning the user</li>
              <li>Removing content that violates this policy</li>
              <li>Temporarily suspending account access</li>
              <li>Permanently terminating accounts</li>
              <li>Reporting illegal activity to law enforcement</li>
              <li>Pursuing legal action</li>
            </ul>
            <p>
              <strong>No refunds will be provided for accounts terminated due to policy violations.</strong>
            </p>

            <hr className="my-8" />

            <h2>9. Changes to This Policy</h2>
            <p>
              We may update this Acceptable Use Policy from time to time. We will notify users of
              significant changes by posting a notice on our website or sending an email. Your
              continued use of the Service after changes constitutes acceptance of the updated policy.
            </p>

            <hr className="my-8" />

            <h2>10. Contact Us</h2>
            <p>
              If you have questions about this Acceptable Use Policy, please contact us at:
            </p>
            <ul>
              <li><strong>Email:</strong> support@thecrnaclub.com</li>
              <li><strong>Abuse Reports:</strong> abuse@thecrnaclub.com</li>
            </ul>

          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
