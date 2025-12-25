/**
 * California Privacy Rights Page
 * CCPA-specific disclosures and rights for California residents.
 */

import { PageWrapper, PageHeader } from '@/components/layout/page-wrapper';
import { Card, CardContent } from '@/components/ui/card';

export function CaliforniaPrivacyPage() {
  const lastUpdated = 'December 16, 2024';

  return (
    <PageWrapper>
      <PageHeader
        title="California Privacy Rights"
        subtitle={`Last Updated: ${lastUpdated}`}
      />

      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="prose prose-sm max-w-none py-8 px-6 md:px-10">

            <h2>1. Introduction</h2>
            <p>
              This California Privacy Rights notice supplements our Privacy Policy and applies
              solely to residents of California. This notice is provided pursuant to the
              California Consumer Privacy Act of 2018 (CCPA), as amended by the California
              Privacy Rights Act (CPRA).
            </p>
            <p>
              If you are a California resident, you have specific rights regarding your personal
              information. This notice explains those rights and how to exercise them.
            </p>

            <hr className="my-8" />

            <h2>2. Information We Collect</h2>
            <p>
              In the preceding 12 months, we have collected the following categories of personal
              information from California residents:
            </p>

            <h3>A. Identifiers</h3>
            <p>
              Name, email address, account username, IP address, device identifiers.
            </p>
            <p><em>Source: Directly from you, automatically collected</em></p>

            <h3>B. Personal Information (California Customer Records)</h3>
            <p>
              Name, address, telephone number, education information, employment information,
              payment card information (last 4 digits only - full numbers processed by Stripe).
            </p>
            <p><em>Source: Directly from you</em></p>

            <h3>C. Protected Classification Characteristics</h3>
            <p>
              We do not intentionally collect information in this category.
            </p>

            <h3>D. Commercial Information</h3>
            <p>
              Purchase history, subscription status, products/services purchased.
            </p>
            <p><em>Source: Directly from you, from transactions</em></p>

            <h3>E. Internet or Network Activity</h3>
            <p>
              Browsing history on our site, search history, interaction with our Service,
              pages viewed, features used.
            </p>
            <p><em>Source: Automatically collected</em></p>

            <h3>F. Geolocation Data</h3>
            <p>
              General location based on IP address (city/state level, not precise location).
            </p>
            <p><em>Source: Automatically collected</em></p>

            <h3>G. Professional or Employment Information</h3>
            <p>
              Current job title, employer, years of ICU experience, certifications.
            </p>
            <p><em>Source: Directly from you</em></p>

            <h3>H. Education Information</h3>
            <p>
              GPA, GRE scores, prerequisites completed, degree information, transcript data.
            </p>
            <p><em>Source: Directly from you</em></p>

            <h3>I. Inferences</h3>
            <p>
              Inferences drawn from the above to create a profile, including ReadyScore
              calculations and personalized recommendations.
            </p>
            <p><em>Source: Derived from your data</em></p>

            <hr className="my-8" />

            <h2>3. How We Use Personal Information</h2>
            <p>We use the personal information we collect for the following business purposes:</p>
            <ul>
              <li>Providing, maintaining, and improving our Service</li>
              <li>Processing transactions and sending related information</li>
              <li>Calculating your ReadyScore and providing personalized insights</li>
              <li>Sending administrative and marketing communications</li>
              <li>Responding to your inquiries and providing customer support</li>
              <li>Detecting, preventing, and addressing fraud and security issues</li>
              <li>Complying with legal obligations</li>
              <li>Research and analytics to improve our Service</li>
            </ul>

            <hr className="my-8" />

            <h2>4. Disclosure of Personal Information</h2>
            <p>
              In the preceding 12 months, we have disclosed the following categories of personal
              information for a business purpose:
            </p>
            <ul>
              <li><strong>Identifiers:</strong> To service providers (hosting, analytics, email)</li>
              <li><strong>Commercial Information:</strong> To payment processors</li>
              <li><strong>Internet Activity:</strong> To analytics providers</li>
            </ul>
            <p>
              We disclose personal information to the following categories of third parties:
            </p>
            <ul>
              <li>Service providers (hosting, analytics, email, payment processing)</li>
              <li>Other users (when you post content publicly or interact on the platform)</li>
              <li>Government entities (when required by law)</li>
            </ul>

            <hr className="my-8" />

            <h2>5. Sales and Sharing of Personal Information</h2>
            <p>
              <strong>We do not sell your personal information.</strong> We have not sold personal
              information of California residents in the preceding 12 months.
            </p>
            <p>
              <strong>We do not share your personal information for cross-context behavioral
              advertising.</strong>
            </p>

            <hr className="my-8" />

            <h2>6. Your California Privacy Rights</h2>
            <p>
              As a California resident, you have the following rights under the CCPA/CPRA:
            </p>

            <h3>Right to Know</h3>
            <p>
              You have the right to request that we disclose what personal information we have
              collected, used, disclosed, and sold about you in the past 12 months, including:
            </p>
            <ul>
              <li>The categories of personal information collected</li>
              <li>The sources of personal information</li>
              <li>The business purpose for collecting or selling personal information</li>
              <li>The categories of third parties with whom we share personal information</li>
              <li>The specific pieces of personal information we have collected about you</li>
            </ul>

            <h3>Right to Delete</h3>
            <p>
              You have the right to request that we delete personal information we have collected
              from you, subject to certain exceptions (such as completing a transaction, detecting
              security incidents, complying with legal obligations, or internal uses consistent
              with your relationship with us).
            </p>

            <h3>Right to Correct</h3>
            <p>
              You have the right to request that we correct inaccurate personal information we
              maintain about you.
            </p>

            <h3>Right to Opt-Out of Sale/Sharing</h3>
            <p>
              You have the right to opt-out of the sale or sharing of your personal information.
              However, as noted above, we do not sell or share your personal information for
              cross-context behavioral advertising.
            </p>

            <h3>Right to Limit Use of Sensitive Personal Information</h3>
            <p>
              You have the right to limit our use of sensitive personal information to purposes
              necessary to provide our Service. We only use sensitive personal information for
              such necessary purposes.
            </p>

            <h3>Right to Non-Discrimination</h3>
            <p>
              You have the right not to receive discriminatory treatment for exercising your
              privacy rights. We will not:
            </p>
            <ul>
              <li>Deny you goods or services</li>
              <li>Charge you different prices or rates</li>
              <li>Provide you a different level or quality of goods or services</li>
              <li>Suggest you may receive a different price or level of service</li>
            </ul>

            <hr className="my-8" />

            <h2>7. How to Exercise Your Rights</h2>
            <p>
              To exercise your California privacy rights, you may submit a request by:
            </p>
            <ul>
              <li><strong>Email:</strong> privacy@thecrnaclub.com</li>
              <li><strong>Subject Line:</strong> "California Privacy Rights Request"</li>
            </ul>
            <p>
              When submitting a request, please provide:
            </p>
            <ul>
              <li>Your full name</li>
              <li>The email address associated with your account</li>
              <li>A description of the right(s) you wish to exercise</li>
              <li>Enough information for us to verify your identity</li>
            </ul>

            <hr className="my-8" />

            <h2>8. Verification Process</h2>
            <p>
              When you submit a request, we will verify your identity by matching the information
              you provide with information we have on file. This may include:
            </p>
            <ul>
              <li>Confirming your email address</li>
              <li>Asking you to log into your account</li>
              <li>Requesting additional information if necessary</li>
            </ul>
            <p>
              We will respond to your request within 45 days. If we need more time (up to 90 days
              total), we will notify you.
            </p>

            <hr className="my-8" />

            <h2>9. Authorized Agents</h2>
            <p>
              You may designate an authorized agent to make a request on your behalf. To do so,
              you must provide the agent with written permission signed by you, and we may require
              you to verify your identity directly with us.
            </p>

            <hr className="my-8" />

            <h2>10. Retention of Personal Information</h2>
            <p>
              We retain personal information for as long as necessary to fulfill the purposes for
              which it was collected, or as required by law. The retention period depends on the
              context and our legal obligations.
            </p>

            <hr className="my-8" />

            <h2>11. Updates to This Notice</h2>
            <p>
              We may update this California Privacy Rights notice from time to time. The "Last
              Updated" date at the top indicates when changes were last made.
            </p>

            <hr className="my-8" />

            <h2>12. Contact Us</h2>
            <p>
              If you have questions about this notice or your California privacy rights, please
              contact us at:
            </p>
            <ul>
              <li><strong>Email:</strong> privacy@thecrnaclub.com</li>
              <li><strong>Support:</strong> support@thecrnaclub.com</li>
            </ul>

          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
