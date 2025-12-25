/**
 * Cookie Policy Page
 * Information about cookies and tracking technologies used on the platform.
 */

import { PageWrapper, PageHeader } from '@/components/layout/page-wrapper';
import { Card, CardContent } from '@/components/ui/card';

export function CookiePolicyPage() {
  const lastUpdated = 'December 16, 2024';

  return (
    <PageWrapper>
      <PageHeader
        title="Cookie Policy"
        subtitle={`Last Updated: ${lastUpdated}`}
      />

      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="prose prose-sm max-w-none py-8 px-6 md:px-10">

            <h2>1. What Are Cookies?</h2>
            <p>
              Cookies are small text files that are stored on your device (computer, tablet, or mobile
              phone) when you visit a website. They are widely used to make websites work more
              efficiently and to provide information to website owners.
            </p>
            <p>
              This Cookie Policy explains what cookies are, how we use them, what types of cookies
              we use, and how you can control your cookie preferences.
            </p>

            <hr className="my-8" />

            <h2>2. How We Use Cookies</h2>
            <p>We use cookies for the following purposes:</p>
            <ul>
              <li><strong>Authentication:</strong> To recognize you when you sign in and keep you logged in</li>
              <li><strong>Security:</strong> To protect your account and detect fraudulent activity</li>
              <li><strong>Preferences:</strong> To remember your settings and preferences</li>
              <li><strong>Analytics:</strong> To understand how visitors use our Service and improve user experience</li>
              <li><strong>Performance:</strong> To ensure the Service operates efficiently</li>
            </ul>

            <hr className="my-8" />

            <h2>3. Types of Cookies We Use</h2>

            <h3>3.1 Essential Cookies</h3>
            <p>
              These cookies are necessary for the Service to function properly. They enable core
              functionality such as security, authentication, and accessibility. You cannot opt
              out of these cookies.
            </p>
            <p>Examples:</p>
            <ul>
              <li>Session cookies that keep you logged in</li>
              <li>Security cookies that protect against fraud</li>
              <li>Load balancing cookies that ensure site stability</li>
            </ul>

            <h3>3.2 Functional Cookies</h3>
            <p>
              These cookies enable enhanced functionality and personalization. They remember choices
              you make (such as your language preference or region) and provide enhanced features.
            </p>
            <p>Examples:</p>
            <ul>
              <li>Language preferences</li>
              <li>Display settings</li>
              <li>Recently viewed items</li>
            </ul>

            <h3>3.3 Analytics Cookies</h3>
            <p>
              These cookies help us understand how visitors interact with our Service by collecting
              and reporting information anonymously. This helps us improve the Service.
            </p>
            <p>Examples:</p>
            <ul>
              <li>Pages visited and time spent</li>
              <li>Features used</li>
              <li>Error reports</li>
              <li>Traffic sources</li>
            </ul>

            <h3>3.4 Marketing Cookies</h3>
            <p>
              These cookies may be set through our site by advertising partners. They may be used
              to build a profile of your interests and show you relevant advertisements on other
              sites. We only use these with your consent.
            </p>

            <hr className="my-8" />

            <h2>4. Third-Party Cookies</h2>
            <p>
              Some cookies are placed by third-party services that appear on our pages. We do not
              control these cookies. Third parties that may set cookies include:
            </p>
            <ul>
              <li><strong>Stripe:</strong> For secure payment processing</li>
              <li><strong>Analytics providers:</strong> For usage analytics</li>
              <li><strong>Authentication providers:</strong> For social login (if applicable)</li>
            </ul>
            <p>
              We recommend reviewing the privacy policies of these third parties for more information
              about their cookie practices.
            </p>

            <hr className="my-8" />

            <h2>5. How Long Do Cookies Last?</h2>
            <p>Cookies can be either session cookies or persistent cookies:</p>
            <ul>
              <li><strong>Session Cookies:</strong> These are temporary and expire when you close your browser</li>
              <li><strong>Persistent Cookies:</strong> These remain on your device for a set period or until you delete them</li>
            </ul>
            <p>
              The duration of persistent cookies varies depending on their purpose. Essential cookies
              typically last for the duration of your session, while analytics cookies may persist
              for up to 2 years.
            </p>

            <hr className="my-8" />

            <h2>6. Managing Your Cookie Preferences</h2>

            <h3>6.1 Browser Settings</h3>
            <p>
              Most web browsers allow you to control cookies through their settings. You can usually
              find these settings in the "Options" or "Preferences" menu of your browser. You can:
            </p>
            <ul>
              <li>See what cookies are stored on your device</li>
              <li>Delete all or specific cookies</li>
              <li>Block all cookies or only third-party cookies</li>
              <li>Set preferences for specific websites</li>
            </ul>

            <h3>6.2 Browser-Specific Instructions</h3>
            <p>
              For information on how to manage cookies in your specific browser, please visit:
            </p>
            <ul>
              <li>Chrome: chrome://settings/cookies</li>
              <li>Firefox: about:preferences#privacy</li>
              <li>Safari: Preferences > Privacy</li>
              <li>Edge: edge://settings/privacy</li>
            </ul>

            <h3>6.3 Impact of Disabling Cookies</h3>
            <p>
              Please note that if you choose to disable cookies, some features of our Service may
              not function properly. For example:
            </p>
            <ul>
              <li>You may not be able to stay logged in</li>
              <li>Your preferences may not be saved</li>
              <li>Some pages may not display correctly</li>
            </ul>

            <hr className="my-8" />

            <h2>7. Other Tracking Technologies</h2>
            <p>
              In addition to cookies, we may use other tracking technologies:
            </p>
            <ul>
              <li><strong>Local Storage:</strong> Similar to cookies but can store more data. Used for caching and offline functionality.</li>
              <li><strong>Session Storage:</strong> Like local storage but only lasts for the browser session.</li>
              <li><strong>Pixels/Beacons:</strong> Small images that track page views and email opens.</li>
            </ul>

            <hr className="my-8" />

            <h2>8. Updates to This Policy</h2>
            <p>
              We may update this Cookie Policy from time to time to reflect changes in technology,
              legislation, or our data practices. We will notify you of any material changes by
              posting the updated policy on this page.
            </p>

            <hr className="my-8" />

            <h2>9. Contact Us</h2>
            <p>
              If you have questions about our use of cookies, please contact us at:
            </p>
            <ul>
              <li><strong>Email:</strong> privacy@thecrnaclub.com</li>
              <li><strong>Website:</strong> www.thecrnaclub.com</li>
            </ul>

          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
