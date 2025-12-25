/**
 * Terms and Conditions Page
 * Comprehensive legal terms covering data collection, refund policies,
 * marketplace terms, HIPAA compliance, arbitration, and user conduct.
 */

import { PageWrapper, PageHeader } from '@/components/layout/page-wrapper';
import { Card, CardContent } from '@/components/ui/card';

export function TermsPage() {
  const lastUpdated = 'December 16, 2024';

  return (
    <PageWrapper>
      <PageHeader
        title="Terms and Conditions"
        subtitle={`Last Updated: ${lastUpdated}`}
      />

      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="prose prose-sm max-w-none py-8 px-6 md:px-10">

            <p className="font-bold uppercase">
              IMPORTANT: PLEASE READ THESE TERMS CAREFULLY BEFORE USING OUR SERVICE. These Terms
              contain an arbitration agreement and class action waiver that affect your legal rights.
              By using The CRNA Club, you agree to resolve disputes through binding individual
              arbitration and waive your right to participate in class actions or jury trials.
              If you do not agree to these Terms, do not use our Service.
            </p>

            <hr className="my-8" />

            <h2>1. Acceptance of Terms</h2>
            <p>
              Welcome to The CRNA Club ("we," "us," "our," or the "Company"). By accessing or using
              our website, mobile application, and related services (collectively, the "Service"),
              you ("User," "you," or "your") agree to be bound by these Terms and Conditions ("Terms").
              If you do not agree to ALL of these Terms, you must not access or use our Service.
            </p>
            <p>
              The CRNA Club is an online platform designed to provide educational resources and tools
              for ICU nurses interested in pursuing careers as Certified Registered Nurse Anesthetists (CRNAs).
              Our Service includes educational content, tracking tools, a mentor marketplace, community
              forums, and various digital products.
            </p>
            <p>
              These Terms constitute a legally binding agreement between you and The CRNA Club.
              By creating an account, making a purchase, or otherwise using our Service, you acknowledge
              that you have read, understood, and agree to be bound by these Terms, including our
              Privacy Policy.
            </p>

            <h3>1.1 Assumption of Risk</h3>
            <p>
              YOU EXPRESSLY ACKNOWLEDGE AND AGREE THAT YOUR USE OF THE SERVICE IS AT YOUR SOLE RISK.
              The Service is provided on an "AS IS" and "AS AVAILABLE" basis. You assume full
              responsibility for your use of the Service and any decisions made based on information
              obtained through it.
            </p>

            <hr className="my-8" />

            <h2>2. User Accounts and Eligibility</h2>

            <h3>2.1 Account Creation</h3>
            <p>
              To access certain features of our Service, you must create an account. You agree to
              provide accurate, current, and complete information during registration and to update
              such information to keep it accurate, current, and complete. Providing false or
              misleading information may result in immediate account termination.
            </p>

            <h3>2.2 Account Security</h3>
            <p>
              You are solely responsible for maintaining the confidentiality of your account credentials
              and for all activities that occur under your account. You agree to notify us immediately
              of any unauthorized use of your account. We are not liable for any loss or damage arising
              from your failure to protect your account credentials.
            </p>

            <h3>2.3 Eligibility</h3>
            <p>Our Service is intended for use by individuals who are:</p>
            <ul>
              <li>At least 18 years of age</li>
              <li>Legally capable of entering into binding contracts</li>
              <li>Not barred from using the Service under applicable law</li>
            </ul>

            <h3>2.4 User Types</h3>
            <p>Our platform serves different user types with specific roles:</p>
            <ul>
              <li><strong>Applicants:</strong> Individuals preparing for or applying to CRNA programs</li>
              <li><strong>Mentors/Providers:</strong> Independent service providers who offer mentorship services through our marketplace</li>
              <li><strong>Administrators:</strong> Authorized personnel who manage the platform</li>
            </ul>

            <h3>2.5 User Representations and Warranties</h3>
            <p>By using the Service, you represent and warrant that:</p>
            <ul>
              <li>All information you provide is accurate, current, and complete</li>
              <li>You have the legal right and authority to enter into these Terms</li>
              <li>You will not use the Service for any illegal or unauthorized purpose</li>
              <li>Your use of the Service will not violate any applicable law or regulation</li>
              <li>You have the right to post any content you submit and it does not infringe any third-party rights</li>
              <li>If you are a Mentor, you have the qualifications and credentials you claim to possess</li>
              <li>You are not located in a country subject to U.S. government embargo or designated as a "terrorist supporting" country</li>
              <li>You are not on any U.S. government list of prohibited or restricted parties</li>
            </ul>

            <hr className="my-8" />

            <h2>3. No Professional Advice Disclaimer</h2>

            <p>
              <strong>IMPORTANT DISCLAIMER:</strong> THE CRNA CLUB DOES NOT PROVIDE MEDICAL, LEGAL,
              FINANCIAL, ACADEMIC, OR OTHER PROFESSIONAL ADVICE. All content, tools, and features
              are for informational and educational purposes only.
            </p>

            <h3>3.1 Educational Information Only</h3>
            <p>
              The information provided through our Service, including but not limited to CRNA program
              data, readiness scores, educational content, and mentor guidance, is for general
              informational purposes only. This information should not be relied upon as professional
              academic, career, medical, or legal advice.
            </p>

            <h3>3.2 No Guarantee of Admission</h3>
            <p>
              <strong>THE CRNA CLUB MAKES NO REPRESENTATIONS, WARRANTIES, OR GUARANTEES REGARDING
              YOUR ADMISSION TO ANY CRNA PROGRAM.</strong> ReadyScores, recommendations, insights,
              mentor advice, and all other features are tools designed to help you prepare—they are
              NOT predictors of admission outcomes. Admission decisions are made solely by CRNA
              programs based on their own criteria. We have no influence over, and accept no
              responsibility for, any program's admission decisions.
            </p>

            <h3>3.3 School and Program Data Accuracy</h3>
            <p>
              <strong>CRNA PROGRAM INFORMATION IN OUR DATABASE MAY NOT BE ACCURATE, COMPLETE, OR
              CURRENT.</strong> Program requirements, deadlines, tuition, prerequisites, and other
              details change frequently and without notice. We compile this information from various
              sources but cannot guarantee its accuracy.
            </p>
            <p>
              <strong>YOU ARE SOLELY RESPONSIBLE FOR VERIFYING ALL PROGRAM REQUIREMENTS, DEADLINES,
              AND INFORMATION DIRECTLY WITH EACH CRNA PROGRAM.</strong> Do not rely on our database
              as your sole source of information. Always confirm details with the official program
              website or admissions office before making any decisions or taking any actions.
            </p>
            <p>
              We make reasonable efforts to maintain accurate information, but we expressly disclaim
              any liability for errors, omissions, or outdated information in our school database.
              You assume all risk associated with relying on information obtained through our Service.
            </p>

            <h3>3.4 Consult Professionals</h3>
            <p>
              For decisions regarding your education, career, health, finances, or legal matters,
              you should consult qualified professionals in those respective fields.
            </p>

            <hr className="my-8" />

            <h2>4. Subscriptions, Billing, and Refund Policy</h2>

            <h3>4.1 Subscription Plans</h3>
            <p>We offer various subscription tiers that provide access to different features and content:</p>
            <ul>
              <li><strong>Free/Lead Tier:</strong> Limited access with paywalled content previews</li>
              <li><strong>7-Day Free Trial:</strong> Full access for 7 days, automatically converts to paid subscription unless cancelled</li>
              <li><strong>CRNA Club Membership:</strong> Full access to platform features</li>
              <li><strong>Founding Member:</strong> Legacy lifetime access (closed to new subscribers)</li>
              <li><strong>Toolkit Bundles:</strong> One-time purchase digital product bundles</li>
            </ul>

            <h3>4.2 Billing and Auto-Renewal</h3>
            <p>
              Subscription fees are billed in advance on a recurring basis. By subscribing, you authorize
              us to charge your payment method automatically at the start of each billing period until
              you cancel. You are responsible for keeping your payment information current.
            </p>

            <h3>4.3 Refund Policy</h3>
            <p>
              <strong>Membership Subscriptions - 7-Day Money-Back Guarantee:</strong> We offer a 7-day
              money-back guarantee for new membership subscriptions. If you are not satisfied for any
              reason, you may request a full refund within 7 days of your initial subscription purchase.
              This guarantee applies to your first subscription payment only and does not apply to
              renewal payments, which are non-refundable.
            </p>
            <p>
              <strong>Digital Products - No Refunds:</strong> Due to the nature of digital products and
              downloadable content, ALL ONE-TIME PURCHASES ARE FINAL AND NON-REFUNDABLE. This includes
              digital toolkits and bundles, downloadable templates, guides, and resources, individual
              course or module purchases, and any other digital content delivered electronically. By
              purchasing digital products, you acknowledge that you are receiving immediate access to
              digital content and waive any right to a refund.
            </p>

            <h3>4.4 Cancellation</h3>
            <p>
              You may cancel your subscription at any time through your account settings. Cancellation
              takes effect at the end of your current billing period. No partial refunds are provided
              for unused portions of a billing period.
            </p>

            <hr className="my-8" />

            <h2>5. Data Collection and Privacy</h2>

            <p>
              To provide personalized guidance and features, we collect and process various types of
              information. By using our Service, you consent to this data collection as described
              below and in our Privacy Policy.
            </p>

            <h3>5.1 Information We Collect</h3>
            <p>We collect the following categories of information:</p>
            <ul>
              <li><strong>Personal Information:</strong> Name, email address, profile picture, account credentials</li>
              <li><strong>Payment Information:</strong> Billing details processed securely through Stripe (we do not store full payment card numbers)</li>
              <li><strong>Academic Information:</strong> GPA data, GRE scores, completed prerequisites, transcript information</li>
              <li><strong>Professional Information:</strong> ICU experience, certifications, clinical logs, shadow day records</li>
              <li><strong>Application Data:</strong> Saved programs, application status, checklists, documents</li>
              <li><strong>Usage Data:</strong> Pages viewed, features used, search queries, engagement patterns</li>
              <li><strong>User Content:</strong> Forum posts, reviews, reflections, messages</li>
            </ul>

            <h3>5.2 How We Use Your Data</h3>
            <p>Your data is used to provide and improve our Service, including:</p>
            <ul>
              <li>Calculating ReadyScore and providing personalized insights</li>
              <li>Generating recommendations based on aggregate peer data</li>
              <li>Facilitating mentor matching and marketplace transactions</li>
              <li>Sending relevant notifications and reminders</li>
              <li>Improving our algorithms and service quality</li>
              <li>Complying with legal obligations</li>
            </ul>

            <h3>5.3 We Never Sell Your Personal Data</h3>
            <p>
              <strong>We will never sell, rent, or trade your personal information to third parties
              for their marketing purposes.</strong> We may use anonymized, aggregated data that
              cannot identify you individually for research, analytics, benchmarking, and to improve
              our services. This aggregate data helps us understand trends and improve the experience
              for all users.
            </p>

            <h3>5.4 Data Retention and Deletion</h3>
            <p>
              We retain your data for as long as your account is active or as needed to provide
              services. You may request deletion of your account and associated data by contacting
              support@thecrnaclub.com. Some data may be retained as required by law, for dispute
              resolution, or to enforce our agreements.
            </p>

            <h3>5.5 Data Security</h3>
            <p>
              We implement reasonable security measures to protect your data. However, no method of
              electronic transmission or storage is 100% secure. You acknowledge that you provide
              your information at your own risk.
            </p>

            <hr className="my-8" />

            <h2>6. HIPAA Compliance and Protected Health Information</h2>

            <p>
              <strong>CRITICAL WARNING: DO NOT share Protected Health Information (PHI) of patients
              on this platform under ANY circumstances. Violation of this policy is grounds for
              IMMEDIATE and PERMANENT account termination without refund.</strong>
            </p>

            <h3>6.1 Prohibited Health Information</h3>
            <p>
              You must NEVER post, share, upload, or transmit any Protected Health Information (PHI)
              as defined by the Health Insurance Portability and Accountability Act (HIPAA), including
              but not limited to:
            </p>
            <ul>
              <li>Patient names, addresses, or contact information</li>
              <li>Medical record numbers or account numbers</li>
              <li>Social Security numbers or other identifiers</li>
              <li>Photographs or identifying descriptions of patients</li>
              <li>Specific dates of treatment, admission, or discharge</li>
              <li>Any information that could identify a specific patient</li>
              <li>Any clinical details that could be linked to an identifiable patient</li>
            </ul>

            <h3>6.2 Your Clinical Logs</h3>
            <p>When logging clinical experiences on our platform, you must:</p>
            <ul>
              <li>Only record general types of cases, procedures, and experiences</li>
              <li>Never include any patient-identifying information</li>
              <li>Use generic descriptions (e.g., "elderly patient with cardiac history" not specific details)</li>
              <li>Ensure all entries comply with your employer's policies and HIPAA regulations</li>
            </ul>

            <h3>6.3 Consequences of Violation</h3>
            <p>
              If we determine, in our sole discretion, that you have shared PHI or violated HIPAA
              guidelines on our platform:
            </p>
            <ul>
              <li>Your account will be immediately and permanently terminated</li>
              <li>No refunds will be provided for any paid services</li>
              <li>The offending content will be removed immediately</li>
              <li>We may report violations to appropriate authorities as required by law</li>
              <li>You may be subject to legal liability under HIPAA and other applicable laws</li>
            </ul>

            <h3>6.4 Not a HIPAA-Covered Entity</h3>
            <p>
              The CRNA Club is NOT a HIPAA-covered entity. We do not provide healthcare services.
              However, many of our users are healthcare professionals bound by HIPAA, and we require
              all users to respect patient privacy and confidentiality.
            </p>

            <hr className="my-8" />

            <h2>7. User Content and Community Guidelines</h2>

            <h3>7.1 User-Generated Content</h3>
            <p>
              You may submit content through our Service, including forum posts, reviews, reflections,
              and profile information ("User Content"). You retain ownership of your User Content,
              but grant us a non-exclusive, worldwide, royalty-free, perpetual license to use,
              reproduce, modify, display, and distribute such content in connection with the Service.
            </p>

            <h3>7.2 Your Responsibility for Content</h3>
            <p>
              You are solely responsible for all content you post. We do not endorse, verify, or
              guarantee the accuracy of any User Content. You agree to indemnify us against any claims
              arising from your User Content.
            </p>

            <h3>7.3 Prohibited Content and Conduct</h3>
            <p>You agree NOT to:</p>
            <ul>
              <li>Post any Protected Health Information (PHI) - see Section 6</li>
              <li>Post false, misleading, defamatory, or fraudulent information</li>
              <li>Harass, bully, threaten, or intimidate other users</li>
              <li>Post hate speech, discriminatory content, or content promoting violence</li>
              <li>Share spam, unauthorized advertisements, or promotional material</li>
              <li>Post sexually explicit or pornographic content</li>
              <li>Share others' personal or confidential information without consent</li>
              <li>Impersonate another person or misrepresent your qualifications</li>
              <li>Share confidential information from CRNA programs, interviews, or employers</li>
              <li>Violate any applicable laws, regulations, or professional ethical standards</li>
              <li>Attempt to circumvent security measures or access unauthorized areas</li>
              <li>Use automated systems (bots, scrapers) without permission</li>
              <li>Post content that infringes intellectual property rights</li>
            </ul>

            <h3>7.4 Content Moderation and Removal</h3>
            <p>
              We reserve the right, but have no obligation, to monitor, edit, or remove any content
              at our sole discretion. We may suspend or terminate accounts that violate these Terms
              without prior notice and without refund.
            </p>

            <hr className="my-8" />

            <h2>8. Marketplace Terms</h2>

            <p>
              <strong>MARKETPLACE PLATFORM DISCLAIMER: The CRNA Club operates solely as a platform
              connecting mentors and clients. We are NOT a party to any transaction or service
              agreement between users.</strong>
            </p>

            <h3>8.1 Platform Role - We Are Only a Venue</h3>
            <p>
              The CRNA Club provides a marketplace platform that enables connections between CRNA
              applicants ("Clients") and mentor service providers ("Mentors"). We are solely a venue
              and are NOT involved in the actual transactions or services provided between Mentors
              and Clients.
            </p>
            <p>We do not:</p>
            <ul>
              <li>Employ, supervise, or control Mentors</li>
              <li>Guarantee the quality, safety, accuracy, or legality of any services</li>
              <li>Guarantee that Mentors will perform services as described</li>
              <li>Verify the accuracy of Mentor credentials or claims</li>
              <li>Mediate or resolve disputes between Mentors and Clients</li>
              <li>Provide any services directly to Clients</li>
            </ul>

            <h3>8.2 Independent Contractors</h3>
            <p>
              <strong>Mentors are independent contractors, NOT employees, agents, or representatives
              of The CRNA Club.</strong> We have no control over and assume no responsibility for
              the actions, advice, or services provided by Mentors. Any agreements for services are
              solely between the Mentor and Client.
            </p>

            <h3>8.3 Disputes Between Users</h3>
            <p>
              <strong>Any disputes arising from marketplace transactions are solely between the
              Mentor and Client.</strong> The CRNA Club is not responsible for resolving disputes
              and will not be held liable for any claims arising from marketplace services.
              Users agree to resolve disputes directly with each other.
            </p>
            <p>
              While we may, at our sole discretion, attempt to facilitate communication between
              parties or review reported issues, we are under no obligation to do so. Any decisions
              we make regarding disputes are final and made at our sole discretion.
            </p>

            <h3>8.4 Mentor Responsibilities</h3>
            <p>Mentors independently agree to:</p>
            <ul>
              <li>Provide accurate information about their qualifications</li>
              <li>Deliver services as described in their listings</li>
              <li>Comply with all applicable laws, regulations, and professional standards</li>
              <li>Report and pay all applicable taxes on their earnings</li>
              <li>Maintain appropriate professional conduct</li>
              <li>Not provide medical, legal, or financial advice beyond their qualifications</li>
            </ul>

            <h3>8.5 Commission and Payments</h3>
            <p>
              The CRNA Club charges a 20% platform fee on marketplace transactions. Payments are
              processed through Stripe. We are not responsible for payment disputes, chargebacks,
              or issues with payment processing.
            </p>

            <h3>8.6 No Liability for Marketplace Services</h3>
            <p>
              <strong>TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE CRNA CLUB DISCLAIMS ALL LIABILITY
              FOR ANY MARKETPLACE SERVICES, INCLUDING ANY ADVICE, GUIDANCE, OR RECOMMENDATIONS PROVIDED
              BY MENTORS.</strong> You use marketplace services entirely at your own risk.
            </p>

            <h3>8.7 No Background Checks or Verification</h3>
            <p>
              <strong>WE DO NOT CONDUCT BACKGROUND CHECKS, VERIFY CREDENTIALS, OR CONFIRM THE IDENTITY
              OF MENTORS OR ANY USERS.</strong> While Mentors represent that the information in their
              profiles is accurate, we do not independently verify educational credentials, SRNA status,
              employment history, or any other claims. You are solely responsible for evaluating the
              qualifications and suitability of any Mentor before engaging their services.
            </p>

            <h3>8.8 Off-Platform Transactions Prohibited</h3>
            <p>
              <strong>All paid transactions must be conducted through The CRNA Club platform.</strong>
              You agree NOT to:
            </p>
            <ul>
              <li>Solicit or accept payments outside of our platform</li>
              <li>Provide contact information to circumvent platform fees</li>
              <li>Offer or request services "off the books"</li>
              <li>Use the platform to recruit clients or mentors for off-platform services</li>
            </ul>
            <p>
              Violation of this policy may result in immediate account termination, forfeiture of
              pending earnings (for Mentors), and potential legal action to recover lost fees.
            </p>

            <h3>8.9 Session Recording and Confidentiality</h3>
            <p>
              Recording of marketplace sessions (video calls, audio calls) is prohibited without the
              express consent of all parties. Both Mentors and Clients agree to maintain confidentiality
              of session content. You may not share, publish, or distribute recordings, transcripts,
              or detailed accounts of sessions without written permission from all participants.
            </p>

            <h3>8.10 Medical Emergencies</h3>
            <p>
              <strong>MENTORS ARE NOT MEDICAL PROFESSIONALS PROVIDING CLINICAL CARE.</strong> The CRNA
              Club and its Mentors do not provide emergency medical services. If you are experiencing
              a medical emergency, call 911 or your local emergency services immediately. Do not use
              this platform to seek medical advice or emergency assistance.
            </p>

            <hr className="my-8" />

            <h2>9. Intellectual Property</h2>

            <h3>9.1 Our Intellectual Property</h3>
            <p>
              The Service and its content, features, and functionality (excluding User Content) are
              owned by The CRNA Club and protected by intellectual property laws. This includes:
            </p>
            <ul>
              <li>Our brand name, logo, and visual identity</li>
              <li>Educational content, courses, and modules</li>
              <li>Digital products, templates, and tools</li>
              <li>Software, algorithms, and proprietary systems (including ReadyScore)</li>
              <li>CRNA program database and compiled information</li>
            </ul>

            <h3>9.2 Limited License</h3>
            <p>
              We grant you a limited, non-exclusive, non-transferable, revocable license to access
              and use the Service for personal, non-commercial purposes. You may not copy, modify,
              distribute, sell, lease, or create derivative works without our written permission.
            </p>

            <h3>9.3 Digital Product License</h3>
            <p>
              Purchased digital products are licensed for your personal use only. You may not
              redistribute, resell, share, or make these products available to others.
            </p>

            <hr className="my-8" />

            <h2>10. Disclaimers and Limitations of Liability</h2>

            <h3>10.1 Disclaimer of Warranties</h3>
            <p>
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND,
              EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY,
              FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR ACCURACY. WE DO NOT WARRANT
              THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE.
            </p>

            <h3>10.2 Limitation of Liability</h3>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE CRNA CLUB AND ITS OFFICERS, DIRECTORS,
              EMPLOYEES, AGENTS, AND AFFILIATES SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
              SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES, INCLUDING BUT NOT LIMITED TO
              DAMAGES FOR LOSS OF PROFITS, GOODWILL, DATA, OPPORTUNITIES, OR OTHER INTANGIBLE LOSSES,
              REGARDLESS OF WHETHER WE WERE ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
            </p>
            <p>
              IN NO EVENT SHALL OUR TOTAL LIABILITY EXCEED THE AMOUNTS PAID BY YOU TO US IN THE
              TWELVE (12) MONTHS PRECEDING THE CLAIM, OR ONE HUNDRED DOLLARS ($100), WHICHEVER IS GREATER.
            </p>

            <h3>10.3 Specific Disclaimers</h3>
            <p>Without limiting the foregoing, we are not liable for:</p>
            <ul>
              <li>Any admission decisions by CRNA programs</li>
              <li>Accuracy of program information, deadlines, or requirements</li>
              <li>Actions, advice, or services provided by Mentors</li>
              <li>User Content posted by other users</li>
              <li>Third-party services or websites linked from our Service</li>
              <li>Technical failures, data loss, or security breaches</li>
              <li>Your reliance on any information provided through the Service</li>
              <li>Any decisions you make based on the Service</li>
            </ul>

            <h3>10.4 Indemnification</h3>
            <p>
              You agree to indemnify, defend, and hold harmless The CRNA Club and its officers,
              directors, employees, agents, and affiliates from and against any and all claims,
              damages, losses, costs, and expenses (including reasonable attorneys' fees) arising
              from: (a) your use of the Service; (b) your User Content; (c) your violation of these
              Terms; (d) your violation of any rights of another party; or (e) your violation of
              any applicable law.
            </p>

            <hr className="my-8" />

            <h2>11. Dispute Resolution and Arbitration Agreement</h2>

            <p>
              <strong>IMPORTANT: PLEASE READ THIS SECTION CAREFULLY. IT AFFECTS YOUR LEGAL RIGHTS.
              By using The CRNA Club, you agree to resolve disputes through binding arbitration
              and waive your right to a jury trial and to participate in class actions.</strong>
            </p>

            <h3>11.1 Agreement to Arbitrate</h3>
            <p>
              You and The CRNA Club agree that any dispute, claim, or controversy arising out of or
              relating to these Terms or the Service shall be resolved exclusively through final and
              binding individual arbitration, rather than in court, except that either party may seek
              injunctive relief in court for intellectual property infringement.
            </p>

            <h3>11.2 Waiver of Jury Trial</h3>
            <p>
              BY AGREEING TO THESE TERMS, YOU WAIVE YOUR RIGHT TO A JURY TRIAL FOR ANY DISPUTES
              WITH THE CRNA CLUB.
            </p>

            <h3>11.3 Class Action Waiver</h3>
            <p>
              YOU AGREE THAT ANY ARBITRATION OR PROCEEDING SHALL BE LIMITED TO THE DISPUTE BETWEEN
              US AND YOU INDIVIDUALLY. YOU WAIVE ANY RIGHT TO PARTICIPATE IN A CLASS ACTION LAWSUIT
              OR CLASS-WIDE ARBITRATION, TO JOIN CLAIMS WITH THOSE OF OTHERS, OR TO SERVE AS A
              REPRESENTATIVE OR MEMBER OF A CLASS.
            </p>

            <h3>11.4 Arbitration Process</h3>
            <p>
              Arbitration shall be conducted by a single arbitrator in accordance with the rules of
              the American Arbitration Association (AAA). The arbitration shall be conducted remotely
              to the extent possible. The arbitrator's decision shall be final and binding, and
              judgment may be entered in any court of competent jurisdiction.
            </p>

            <h3>11.5 Time Limitation on Claims</h3>
            <p>
              <strong>You agree that any claim arising out of or relating to these Terms or the
              Service must be filed within ONE (1) YEAR after the claim arose.</strong> Any claim
              filed after this period is permanently barred.
            </p>

            <h3>11.6 Release of Claims</h3>
            <p>
              To the maximum extent permitted by law, you release The CRNA Club and its officers,
              directors, employees, and agents from all claims, demands, and damages of every kind
              and nature, known and unknown, arising out of or connected with your use of the Service.
            </p>

            <h3>11.7 Governing Law</h3>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the
              State of [Your State], without regard to conflict of law principles. Any disputes not
              subject to arbitration shall be resolved exclusively in the state or federal courts
              located in [Your State/County].
            </p>

            <hr className="my-8" />

            <h2>12. Third-Party Links and Services</h2>
            <p>
              Our Service may contain links to third-party websites, services, or content that are
              not owned or controlled by The CRNA Club. We have no control over, and assume no
              responsibility for, the content, privacy policies, or practices of any third-party
              websites or services. You acknowledge and agree that:
            </p>
            <ul>
              <li>We are not responsible for the availability or accuracy of third-party sites</li>
              <li>We do not endorse any third-party content, products, or services</li>
              <li>You access third-party sites at your own risk</li>
              <li>These Terms do not apply to third-party sites - review their terms separately</li>
            </ul>
            <p>
              Links to CRNA program websites, educational resources, or other external content are
              provided for convenience only. We make no representations about the accuracy of
              information on linked sites.
            </p>

            <hr className="my-8" />

            <h2>13. Service Modifications and Availability</h2>

            <h3>13.1 Modifications to Service</h3>
            <p>
              We reserve the right to modify, suspend, or discontinue any part of the Service at any
              time, with or without notice. This includes changes to features, content, pricing, or
              availability. We may also impose limits on certain features or restrict access to parts
              of the Service without notice or liability.
            </p>

            <h3>13.2 No Guarantee of Availability</h3>
            <p>
              We do not guarantee that the Service will be available at all times or that it will be
              uninterrupted, timely, secure, or error-free. We are not liable for any interruption
              or discontinuation of the Service.
            </p>

            <h3>13.3 Content Removal</h3>
            <p>
              We reserve the right to remove any content, features, or functionality from the Service
              at any time without prior notice. This includes educational content, tools, and features
              you may have been using.
            </p>

            <hr className="my-8" />

            <h2>14. General Terms</h2>

            <h3>14.1 Termination</h3>
            <p>
              We may terminate or suspend your account immediately, without prior notice or liability,
              for any reason, including breach of these Terms. Upon termination, your right to use
              the Service ceases immediately. Termination does not limit any other rights or remedies
              available to us.
            </p>

            <h3>14.2 Force Majeure</h3>
            <p>
              We shall not be liable for any failure or delay in performing our obligations due to
              circumstances beyond our reasonable control, including natural disasters, acts of war
              or terrorism, pandemics, government actions, or technical failures.
            </p>

            <h3>14.3 Changes to Terms</h3>
            <p>
              We reserve the right to modify these Terms at any time. Material changes will be posted
              on this page with an updated "Last Updated" date. Your continued use of the Service
              after changes constitutes acceptance of the modified Terms.
            </p>

            <h3>14.4 Severability</h3>
            <p>
              If any provision of these Terms is found to be unenforceable, that provision will be
              modified to the minimum extent necessary, and the remaining provisions will continue
              in full force and effect.
            </p>

            <h3>14.5 Entire Agreement</h3>
            <p>
              These Terms, together with our Privacy Policy and any other agreements referenced herein,
              constitute the entire agreement between you and The CRNA Club and supersede all prior
              agreements.
            </p>

            <h3>14.6 No Waiver</h3>
            <p>
              Our failure to enforce any provision of these Terms shall not constitute a waiver of
              that provision or any other provision.
            </p>

            <h3>14.7 Assignment</h3>
            <p>
              You may not assign or transfer these Terms without our written consent. We may assign
              these Terms without restriction.
            </p>

            <h3>14.8 Electronic Communications</h3>
            <p>
              By using our Service, you consent to receive electronic communications from us. You
              agree that all agreements, notices, and communications we provide electronically satisfy
              any legal requirement that such communications be in writing.
            </p>

            <h3>14.9 Survival</h3>
            <p>
              The following sections shall survive termination of these Terms: User Representations
              and Warranties (Section 2.5), No Professional Advice Disclaimer (Section 3), Data
              Collection and Privacy (Section 5), HIPAA Compliance (Section 6), User Content (Section 7),
              Marketplace Terms (Section 8), Intellectual Property (Section 9), Disclaimers and
              Limitations of Liability (Section 10), Dispute Resolution and Arbitration (Section 11),
              and any other provisions that by their nature should survive.
            </p>

            <h3>14.10 Headings</h3>
            <p>
              The section headings in these Terms are for convenience only and have no legal or
              contractual effect.
            </p>

            <h3>14.11 Export Compliance</h3>
            <p>
              You agree to comply with all applicable export and re-export control laws and regulations,
              including the Export Administration Regulations maintained by the U.S. Department of
              Commerce. You may not access or use the Service if you are located in a country subject
              to U.S. sanctions or if you are on any U.S. government prohibited party list.
            </p>

            <hr className="my-8" />

            <h2>15. Contact Us</h2>

            <p>If you have any questions about these Terms and Conditions, please contact us:</p>
            <ul>
              <li><strong>Email:</strong> support@thecrnaclub.com</li>
              <li><strong>Website:</strong> www.thecrnaclub.com</li>
            </ul>

            <hr className="my-8" />

            <p className="font-bold">
              BY USING THE CRNA CLUB, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND
              AGREE TO BE BOUND BY THESE TERMS AND CONDITIONS, INCLUDING THE ARBITRATION AGREEMENT,
              CLASS ACTION WAIVER, AND ALL DISCLAIMERS AND LIMITATIONS OF LIABILITY.
            </p>

          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
