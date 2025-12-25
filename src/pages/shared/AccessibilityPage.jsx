/**
 * Accessibility Statement Page
 * Our commitment to digital accessibility and ADA compliance.
 */

import { PageWrapper, PageHeader } from '@/components/layout/page-wrapper';
import { Card, CardContent } from '@/components/ui/card';

export function AccessibilityPage() {
  const lastUpdated = 'December 16, 2024';

  return (
    <PageWrapper>
      <PageHeader
        title="Accessibility Statement"
        subtitle={`Last Updated: ${lastUpdated}`}
      />

      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="prose prose-sm max-w-none py-8 px-6 md:px-10">

            <h2>Our Commitment to Accessibility</h2>
            <p>
              The CRNA Club is committed to ensuring digital accessibility for people with
              disabilities. We are continually improving the user experience for everyone and
              applying the relevant accessibility standards to ensure we provide equal access
              to all users.
            </p>

            <hr className="my-8" />

            <h2>Conformance Status</h2>
            <p>
              We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 at Level
              AA. These guidelines explain how to make web content more accessible for people
              with disabilities and more user-friendly for everyone.
            </p>
            <p>
              We are working towards full compliance and are committed to making ongoing
              improvements to meet accessibility standards.
            </p>

            <hr className="my-8" />

            <h2>Measures We Take</h2>
            <p>The CRNA Club takes the following measures to ensure accessibility:</p>
            <ul>
              <li>Include accessibility as part of our internal policies and design processes</li>
              <li>Provide accessibility training for our development team</li>
              <li>Use accessible design patterns and components</li>
              <li>Test with assistive technologies including screen readers</li>
              <li>Conduct regular accessibility audits</li>
              <li>Assign clear accessibility goals and responsibilities</li>
            </ul>

            <hr className="my-8" />

            <h2>Technical Specifications</h2>
            <p>
              Accessibility of our Service relies on the following technologies to work with
              the particular combination of web browser and any assistive technologies or
              plugins installed on your computer:
            </p>
            <ul>
              <li>HTML</li>
              <li>WAI-ARIA</li>
              <li>CSS</li>
              <li>JavaScript</li>
            </ul>
            <p>
              These technologies are relied upon for conformance with the accessibility
              standards used.
            </p>

            <hr className="my-8" />

            <h2>Accessibility Features</h2>
            <p>Our website includes the following accessibility features:</p>

            <h3>Navigation</h3>
            <ul>
              <li>Consistent navigation structure throughout the site</li>
              <li>Skip navigation links to bypass repetitive content</li>
              <li>Descriptive page titles and headings</li>
              <li>Keyboard-accessible menus and interactive elements</li>
            </ul>

            <h3>Visual Design</h3>
            <ul>
              <li>Sufficient color contrast between text and backgrounds</li>
              <li>Text can be resized up to 200% without loss of content</li>
              <li>Content does not rely solely on color to convey information</li>
              <li>Focus indicators for keyboard navigation</li>
            </ul>

            <h3>Content</h3>
            <ul>
              <li>Alternative text for meaningful images</li>
              <li>Descriptive link text</li>
              <li>Form labels and instructions</li>
              <li>Error messages that identify problems and suggest corrections</li>
            </ul>

            <h3>Compatibility</h3>
            <ul>
              <li>Compatible with popular screen readers</li>
              <li>Works with browser zoom functionality</li>
              <li>Supports keyboard-only navigation</li>
            </ul>

            <hr className="my-8" />

            <h2>Known Limitations</h2>
            <p>
              Despite our best efforts to ensure accessibility of our Service, there may be
              some limitations. Below is a description of known limitations:
            </p>
            <ul>
              <li>
                <strong>User-Generated Content:</strong> Content posted by users (forum posts,
                reviews, messages) may not always meet accessibility standards. We encourage
                users to create accessible content.
              </li>
              <li>
                <strong>Third-Party Content:</strong> Some third-party content or embedded
                media may not be fully accessible.
              </li>
              <li>
                <strong>PDF Documents:</strong> Some downloadable PDF documents may not be
                fully accessible. We are working to remediate these.
              </li>
            </ul>

            <hr className="my-8" />

            <h2>Feedback</h2>
            <p>
              We welcome your feedback on the accessibility of The CRNA Club. Please let us
              know if you encounter accessibility barriers:
            </p>
            <ul>
              <li><strong>Email:</strong> accessibility@thecrnaclub.com</li>
              <li><strong>Support:</strong> support@thecrnaclub.com</li>
            </ul>
            <p>
              When contacting us, please include:
            </p>
            <ul>
              <li>The web address (URL) of the page where you encountered the issue</li>
              <li>A description of the accessibility problem</li>
              <li>The assistive technology you were using (if any)</li>
              <li>Your contact information</li>
            </ul>
            <p>
              We try to respond to feedback within 5 business days.
            </p>

            <hr className="my-8" />

            <h2>Compatibility with Browsers and Assistive Technology</h2>
            <p>
              Our Service is designed to be compatible with the following assistive
              technologies:
            </p>
            <ul>
              <li>Screen readers (JAWS, NVDA, VoiceOver, TalkBack)</li>
              <li>Screen magnification software</li>
              <li>Speech recognition software</li>
              <li>Keyboard-only navigation</li>
            </ul>
            <p>
              Our Service is designed to be compatible with recent versions of major browsers
              including Chrome, Firefox, Safari, and Edge.
            </p>

            <hr className="my-8" />

            <h2>Assessment Approach</h2>
            <p>
              The CRNA Club assesses the accessibility of our Service through the following
              approaches:
            </p>
            <ul>
              <li>Self-evaluation using automated testing tools</li>
              <li>Manual testing with screen readers and keyboard navigation</li>
              <li>Review of user feedback</li>
            </ul>

            <hr className="my-8" />

            <h2>Continuous Improvement</h2>
            <p>
              We are committed to continuously improving accessibility. Our ongoing efforts include:
            </p>
            <ul>
              <li>Regular accessibility testing as part of our development process</li>
              <li>Training for content creators on accessible practices</li>
              <li>Updating our policies and processes based on feedback</li>
              <li>Staying informed about accessibility best practices and standards</li>
            </ul>

          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
