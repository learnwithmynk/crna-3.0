/**
 * DMCA Policy Page
 * Copyright infringement notification and counter-notification procedures.
 */

import { PageWrapper, PageHeader } from '@/components/layout/page-wrapper';
import { Card, CardContent } from '@/components/ui/card';

export function DMCAPolicyPage() {
  const lastUpdated = 'December 16, 2024';

  return (
    <PageWrapper>
      <PageHeader
        title="DMCA Policy"
        subtitle={`Last Updated: ${lastUpdated}`}
      />

      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="prose prose-sm max-w-none py-8 px-6 md:px-10">

            <h2>1. Introduction</h2>
            <p>
              The CRNA Club respects the intellectual property rights of others and expects our
              users to do the same. In accordance with the Digital Millennium Copyright Act of 1998
              ("DMCA"), we will respond expeditiously to claims of copyright infringement committed
              using our Service.
            </p>
            <p>
              This policy outlines our procedures for handling copyright infringement notices and
              counter-notifications.
            </p>

            <hr className="my-8" />

            <h2>2. Reporting Copyright Infringement</h2>
            <p>
              If you believe that your copyrighted work has been copied and posted on our Service
              in a way that constitutes copyright infringement, please provide our Designated
              Copyright Agent with a written notification containing the following information:
            </p>
            <ol>
              <li>
                <strong>Identification of the copyrighted work:</strong> Identify the copyrighted
                work that you claim has been infringed. If multiple copyrighted works are covered
                by a single notification, provide a representative list.
              </li>
              <li>
                <strong>Identification of the infringing material:</strong> Identify the material
                that you claim is infringing and that you want removed, including enough information
                to locate the material. Please include the specific URL(s) where the material appears.
              </li>
              <li>
                <strong>Your contact information:</strong> Provide your name, mailing address,
                telephone number, and email address.
              </li>
              <li>
                <strong>Good faith statement:</strong> Include the following statement: "I have a
                good faith belief that the use of the material in the manner complained of is not
                authorized by the copyright owner, its agent, or the law."
              </li>
              <li>
                <strong>Accuracy statement:</strong> Include the following statement: "The
                information in this notification is accurate, and under penalty of perjury, I am
                the owner, or an agent authorized to act on behalf of the owner, of an exclusive
                right that is allegedly infringed."
              </li>
              <li>
                <strong>Signature:</strong> Include your physical or electronic signature.
              </li>
            </ol>

            <hr className="my-8" />

            <h2>3. Designated Copyright Agent</h2>
            <p>
              Please send your DMCA notification to our Designated Copyright Agent at:
            </p>
            <ul>
              <li><strong>Email:</strong> dmca@thecrnaclub.com</li>
              <li><strong>Subject Line:</strong> DMCA Takedown Notice</li>
            </ul>
            <p>
              <strong>Important:</strong> Only DMCA notices should be sent to the Designated
              Copyright Agent. For other inquiries, please contact support@thecrnaclub.com.
            </p>

            <hr className="my-8" />

            <h2>4. Processing of Notifications</h2>
            <p>Upon receiving a valid DMCA notification, we will:</p>
            <ol>
              <li>Remove or disable access to the allegedly infringing material</li>
              <li>Notify the user who posted the material that it has been removed</li>
              <li>Provide the user with a copy of the takedown notice</li>
              <li>Inform the user of their right to submit a counter-notification</li>
            </ol>

            <hr className="my-8" />

            <h2>5. Counter-Notification</h2>
            <p>
              If you believe that your content was removed or disabled by mistake or
              misidentification, you may submit a counter-notification. Your counter-notification
              must include:
            </p>
            <ol>
              <li>
                <strong>Identification of material:</strong> Identify the material that was removed
                and the location where it appeared before it was removed.
              </li>
              <li>
                <strong>Your contact information:</strong> Provide your name, mailing address,
                telephone number, and email address.
              </li>
              <li>
                <strong>Consent to jurisdiction:</strong> Include the following statement: "I
                consent to the jurisdiction of the Federal District Court for the judicial district
                in which my address is located, or if my address is outside of the United States,
                the judicial district in which The CRNA Club is located, and I will accept service
                of process from the person who provided the original notification or an agent of
                such person."
              </li>
              <li>
                <strong>Good faith statement:</strong> Include the following statement: "I swear,
                under penalty of perjury, that I have a good faith belief that the material was
                removed or disabled as a result of mistake or misidentification of the material
                to be removed or disabled."
              </li>
              <li>
                <strong>Signature:</strong> Include your physical or electronic signature.
              </li>
            </ol>
            <p>
              Send counter-notifications to: dmca@thecrnaclub.com with the subject line
              "DMCA Counter-Notification."
            </p>

            <hr className="my-8" />

            <h2>6. Processing of Counter-Notifications</h2>
            <p>Upon receiving a valid counter-notification, we will:</p>
            <ol>
              <li>Promptly provide the original complainant with a copy of the counter-notification</li>
              <li>Inform the original complainant that we will restore the removed material in 10-14 business days</li>
              <li>Restore the material within 10-14 business days unless we receive notice that the original complainant has filed a court action</li>
            </ol>

            <hr className="my-8" />

            <h2>7. Repeat Infringers</h2>
            <p>
              In accordance with the DMCA and our Terms and Conditions, we will terminate the
              accounts of users who are repeat infringers. We consider a "repeat infringer" to
              be any user who has been the subject of more than two valid DMCA notifications.
            </p>

            <hr className="my-8" />

            <h2>8. Misrepresentation</h2>
            <p>
              <strong>Warning:</strong> Knowingly materially misrepresenting that material is
              infringing, or that material was removed or disabled by mistake, may subject you
              to liability for damages, including costs and attorneys' fees. Please consider
              consulting with a legal professional before submitting a DMCA notification or
              counter-notification.
            </p>

            <hr className="my-8" />

            <h2>9. Contact Us</h2>
            <p>
              For questions about this DMCA Policy, please contact us at:
            </p>
            <ul>
              <li><strong>DMCA Notices:</strong> dmca@thecrnaclub.com</li>
              <li><strong>General Support:</strong> support@thecrnaclub.com</li>
            </ul>

          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
