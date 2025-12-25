# Marketplace Non-Member Access Flow

**Created:** December 8, 2024
**Purpose:** Define how non-members can browse and access the CRNA Club mentor marketplace
**Status:** DESIGN SPEC - Ready for implementation

---

## Executive Summary

**Recommendation:** Allow full browsing with strategic gating to drive account creation while providing excellent SEO and discovery.

**Key Decisions:**
- ✅ **Non-members can browse** all mentors, profiles, reviews, and pricing (public)
- 🔒 **Gated actions:** Booking, messaging, saving mentors (requires free account minimum)
- 📈 **Three-tier conversion:** Free Account → Trial → Paid Membership
- 🎯 **Goal:** Convert marketplace visitors to full members, not just marketplace-only users

---

## 1. Access Matrix

| Feature | Non-Member (Public) | Free Account | Trial (7-day) | Paid Member |
|---------|---------------------|--------------|---------------|-------------|
| **Discovery** |
| Browse mentor directory | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| View provider profiles | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| See service listings | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| View pricing | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| See reviews/ratings | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| Filter/search mentors | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **Engagement** |
| Book a service | ❌ No (gate) | ✅ Yes | ✅ Yes | ✅ Yes |
| Message a mentor | ❌ No (gate) | ✅ Yes | ✅ Yes | ✅ Yes |
| Save/favorite mentors | ❌ No (gate) | ✅ Yes | ✅ Yes | ✅ Yes |
| Leave reviews | ❌ No | ❌ No* | ✅ Yes* | ✅ Yes* |
| View booking history | ❌ No | ✅ Yes | ✅ Yes | ✅ Yes |
| **Platform Access** |
| School database | ❌ Blurred | ❌ Blurred | ✅ Full | ✅ Full |
| Trackers | ❌ Blurred | ❌ Blurred | ✅ Full | ✅ Full |
| Learning library | ❌ Blurred | ❌ Blurred | ✅ Full | ✅ Full |
| Community forums | ❌ Blurred | ❌ Blurred | ✅ Full | ✅ Full |
| Dashboard | ❌ No | ✅ Limited** | ✅ Full | ✅ Full |

**Notes:**
- \* Only users who have booked that specific service can review
- \*\* Free accounts see dashboard with upsell prompts and marketplace bookings only

**Rationale:**
1. **Public browsing builds trust** - Visitors can evaluate quality before creating account
2. **SEO benefit** - Google can index profiles, driving organic traffic
3. **Social proof** - Reviews/ratings visible to build confidence
4. **Clear value ladder** - Free → Trial → Paid progression
5. **Marketplace as acquisition** - Use marketplace to acquire users, convert to full members

---

## 2. Gating Flow Diagrams

### 2.1 Booking a Service (Primary Conversion Point)

```
Non-Member clicks "Book This Service"
    ↓
Check: Is user logged in?
    ↓
NO → Show Account Creation Modal
    ↓
┌─────────────────────────────────────────────┐
│  Create Your Free Account to Book           │
│                                             │
│  Get started with The CRNA Club:           │
│  ✓ Book verified SRNA mentors              │
│  ✓ Access your booking history             │
│  ✓ Save favorite mentors                   │
│                                             │
│  Or try everything FREE for 7 days:        │
│  ✓ All of the above PLUS                   │
│  ✓ School database (140+ programs)         │
│  ✓ Clinical experience trackers            │
│  ✓ Learning modules & downloads            │
│  ✓ Community forums & events               │
│                                             │
│  [Continue with Free Account]              │
│  [Start 7-Day Free Trial] ← Highlighted    │
│                                             │
│  Already have an account? [Log In]         │
└─────────────────────────────────────────────┘
    ↓
User chooses:
    ├─→ Free Account
    │       ↓
    │   Quick signup (name, email, password)
    │       ↓
    │   Redirect to booking flow
    │       ↓
    │   Post-booking: Upsell trial
    │
    └─→ Start Trial
            ↓
        Trial signup (name, email, password, CC)
            ↓
        Redirect to booking flow
            ↓
        Post-booking: Show full platform value
```

**Key Copy:**
- **Headline:** "Create Account to Book This Service"
- **Subhead:** "Join 10,000+ ICU nurses getting into CRNA school"
- **CTA Primary:** "Start 7-Day Free Trial" (yellow button)
- **CTA Secondary:** "Continue with Free Account" (ghost button)
- **Below buttons:** "Already have an account? Log In"

**Why this works:**
- Presents choice without hiding the free option
- Highlights trial as recommended path (better value)
- Clear value propositions for each tier
- Low friction - can start free, upgrade later

---

### 2.2 Messaging a Mentor

```
Non-Member clicks "Message [Name]"
    ↓
Check: Is user logged in?
    ↓
NO → Show Modal
    ↓
┌─────────────────────────────────────────────┐
│  Log In to Message Sarah                    │
│                                             │
│  Questions before booking? Create a free   │
│  account to message Sarah directly.        │
│                                             │
│  [Create Free Account]                     │
│  [Log In]                                  │
└─────────────────────────────────────────────┘
    ↓
After account creation:
    ↓
Redirect back to provider profile
    ↓
Message composer auto-opens
    ↓
After sending: Show toast with upsell
"Message sent! ✨ Want to track your application journey? Start your free trial."
```

**Why simpler than booking:**
- Messaging is lower-intent action
- Keep it simple: just need account
- Upsell after they're engaged

---

### 2.3 Saving a Mentor

```
Non-Member clicks heart icon to save
    ↓
Check: Is user logged in?
    ↓
NO → Show mini-modal
    ↓
┌─────────────────────────────────────────────┐
│  Log In to Save Mentors                     │
│                                             │
│  Create a free account to save your        │
│  favorite mentors and book later.          │
│                                             │
│  [Create Free Account]                     │
│  [Log In]                                  │
└─────────────────────────────────────────────┘
    ↓
After signup:
    ↓
Auto-save that mentor
    ↓
Show toast: "Sarah saved! View in My Bookings → Saved Mentors"
```

---

## 3. Account Creation Flow

### 3.1 Free Account Signup (Minimal)

**Purpose:** Remove friction for marketplace-only users

```
┌─────────────────────────────────────────────┐
│  Create Your Free Account                   │
│                                             │
│  Name:        [________________]           │
│  Email:       [________________]           │
│  Password:    [________________]           │
│                                             │
│  [Create Account]                          │
│                                             │
│  By creating an account, you agree to our  │
│  Terms of Service and Privacy Policy       │
└─────────────────────────────────────────────┘
```

**After signup:**
1. ✅ Account created (no onboarding interruption)
2. ✅ Redirect to original intent (booking page, message composer, etc.)
3. ✅ Tag applied: `01. [Lead Gen] - Marketplace - Created Account`
4. ✅ Enter marketplace-specific nurture sequence

**No immediate onboarding** - Let them complete their booking first

---

### 3.2 Trial Signup (Standard)

**Purpose:** Capture payment info for auto-conversion

```
┌─────────────────────────────────────────────┐
│  Start Your 7-Day Free Trial                │
│                                             │
│  Name:        [________________]           │
│  Email:       [________________]           │
│  Password:    [________________]           │
│                                             │
│  Card Info:   [________________]           │
│  Exp/CVV:     [____] [___]                 │
│                                             │
│  [Start Free Trial]                        │
│                                             │
│  You won't be charged until Dec 15, 2024  │
│  Cancel anytime before then.               │
└─────────────────────────────────────────────┘
```

**After signup:**
1. ✅ Trial activated
2. ✅ Tag applied: `02. [Status] - 7 Day Free Trial - Active`
3. ✅ Welcome email sent
4. ✅ Redirect to:
   - If came from booking: Complete booking
   - If general signup: Welcome onboarding modal
5. ✅ After booking completion: Show platform tour

---

### 3.3 Minimal vs Full Onboarding

**Marketplace User (Free Account):**
- ❌ No onboarding interruption
- ✅ Let them book first
- ✅ After booking: Show soft upsell in email
- ✅ Persistent banner: "Get 7 days free access to School Database, Trackers & more"

**Trial/Paid User (Full Access):**
- ✅ After signup: Welcome modal with video
- ✅ Dashboard tour (optional, can skip)
- ✅ Onboarding widget on dashboard
- ✅ Guided actions: Add program, log clinical entry, etc.

**Post-Booking Flow (Free Account):**
```
Booking completed
    ↓
Confirmation page
    ↓
┌─────────────────────────────────────────────┐
│  ✅ Your session with Sarah is booked!      │
│                                             │
│  Check your email for details and calendar │
│  invite.                                    │
│                                             │
│  [View Booking Details]                    │
└─────────────────────────────────────────────┘
    ↓
Below confirmation (upsell section):
    ↓
┌─────────────────────────────────────────────┐
│  While you're preparing for your session... │
│                                             │
│  Get everything you need to stand out:     │
│  • Track your clinical skills              │
│  • Research 140+ CRNA programs             │
│  • Join our community of 10k+ nurses       │
│                                             │
│  Free for 7 days, then just $27/month      │
│                                             │
│  [Start Free Trial]                        │
│  [Maybe Later]                             │
└─────────────────────────────────────────────┘
```

---

## 4. Messaging & Copy

### 4.1 Booking Gate Modal

**Headline Options:**
1. "Create Account to Book This Service" (Clear, functional)
2. "Ready to Work with [Mentor Name]?" (Personal)
3. "One Step Away from Your Mock Interview" (Outcome-focused)

**Recommended:** Option 1 - Clear and direct

**Body Copy:**
```
Join The CRNA Club to book verified SRNA mentors.

With a free account you get:
✓ Secure booking & payment
✓ Message mentors directly
✓ Access booking history
✓ Save favorite mentors

Want more? Start a 7-day free trial for:
✓ Everything above PLUS
✓ 140+ program database with filters
✓ Clinical experience tracker
✓ Shadow day log
✓ Learning modules & downloads
✓ Community forums
```

**CTAs:**
- Primary: "Start 7-Day Free Trial" (bg-yellow-400)
- Secondary: "Continue with Free Account" (ghost button)
- Tertiary: "Already have an account? Log In" (link)

---

### 4.2 Value Proposition Microcopy

**For marketplace-only features:**
- "Book verified SRNAs currently in CRNA school"
- "Read real reviews from applicants like you"
- "Secure payment with money-back guarantee"

**For full membership upsell:**
- "Track everything in one place"
- "Join 10,000+ ICU nurses getting into CRNA school"
- "Everything you need to stand out as an applicant"

---

### 4.3 Error States

**If user tries to book while logged out:**
```
Toast notification:
"Please log in or create an account to book services"
[View Options]
```

**If user's session expired during booking:**
```
Modal:
"Your session expired for security"

Please log in to complete your booking. Your
selected service is still available.

[Log In]
```

**If service becomes unavailable:**
```
Modal:
"This service is no longer available"

Sarah has paused bookings for this service.
Check out her other services or browse similar
mentors.

[View Sarah's Other Services]
[Browse Similar Mentors]
```

---

## 5. Conversion Strategy

### 5.1 Touchpoints for Upsell (Free → Trial/Paid)

| Touchpoint | Timing | Message | CTA |
|------------|--------|---------|-----|
| **Post-Booking Confirmation** | Immediately after booking | "While you prep, track your journey" | Start Free Trial |
| **Email #1: Booking Confirmed** | Immediately | Footer upsell: "PS: Get 7 days free" | Start Trial |
| **Email #2: Session Reminder** | 24 hours before | "After your session, track your progress" | Start Trial |
| **Email #3: How Was It?** | 24 hours after | "Keep the momentum going" | Start Trial |
| **Persistent Banner** | Every page visit | "Try everything free for 7 days" | Start Trial |
| **Booking History Empty State** | When revisiting | "Track your full application journey" | Start Trial |

---

### 5.2 Email Nurture Sequence (Free Marketplace Users)

**Segment:** Users who created free account from marketplace

**Sequence:**

**Day 0 (Immediate):** Booking confirmation
- ✅ Service details
- ✅ Calendar invite
- ✅ What to expect
- Soft CTA: "PS: Try our full platform free for 7 days"

**Day 1 (Session reminder - if live session):**
- ✅ Reminder about upcoming session
- ✅ Preparation tips
- Social proof: "10k+ nurses use our trackers"
- CTA: "Start tracking your clinical experience"

**Day 2 (Post-session follow-up):**
- ✅ "How was your session?"
- ✅ Request review (if session completed)
- Value showcase: "Members who track clinical skills are 2x more likely to get accepted"
- CTA: "Start Your Free Trial"

**Day 5 (If no trial conversion):**
- ✅ Case study: "How Jessica used our trackers to get into Duke"
- ✅ Feature spotlight: School database
- CTA: "Get 7 Days Free"

**Day 9 (If no trial conversion):**
- ✅ "What are you working on right now?"
- ✅ Show relevant feature based on their booking type:
  - Mock interview → Interview prep resources
  - Essay review → Personal statement guide
  - Strategy → School selection tools
- CTA: "Access All Resources - 7 Days Free"

**Day 14 (Final):**
- ✅ Founder story / community spotlight
- ✅ "Join us full-time"
- Offer: First month 20% off
- CTA: "Join The CRNA Club"

---

### 5.3 In-App Prompts (Free Account Users)

**Persistent Banner (Dismissible, returns after 7 days):**
```
┌─────────────────────────────────────────────────────────────┐
│  📚 Track your journey • Research schools • Join community  │
│  Try everything FREE for 7 days → [Start Trial] [X]        │
└─────────────────────────────────────────────────────────────┘
```

**Dashboard Widget (Free users see limited dashboard):**
```
┌─────────────────────────────────────────────┐
│  📊 Your Dashboard                           │
│                                             │
│  Upcoming Bookings:                         │
│  • Mock Interview with Sarah - Dec 15       │
│                                             │
│  ─────────────────────────────────────      │
│                                             │
│  🔒 Track Your Application Journey          │
│                                             │
│  Upgrade to access:                         │
│  • Clinical experience tracker              │
│  • 140+ CRNA programs database             │
│  • Shadow day log                          │
│  • GPA calculator                          │
│  • Community forums                        │
│                                             │
│  [Start 7-Day Free Trial]                  │
│  [See All Features]                        │
└─────────────────────────────────────────────┘
```

---

### 5.4 Pricing Presentation

**Modal: "See All Features & Pricing"**

```
┌──────────────────────────────────────────────────────────────┐
│  Choose Your Plan                                            │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Free Account │  │   7-Day      │  │ Membership   │      │
│  │              │  │   FREE       │  │  $27/month   │      │
│  │   $0         │  │   TRIAL      │  │              │      │
│  │              │  │              │  │              │      │
│  │ ✓ Book       │  │ ✓ Everything │  │ ✓ Everything │      │
│  │   mentors    │  │   in Free +  │  │   in Trial   │      │
│  │ ✓ Messaging  │  │              │  │              │      │
│  │              │  │ ✓ 140+ progs │  │ ✓ Unlimited  │      │
│  │              │  │ ✓ Trackers   │  │   access     │      │
│  │              │  │ ✓ Learning   │  │ ✓ Priority   │      │
│  │              │  │ ✓ Community  │  │   support    │      │
│  │              │  │              │  │              │      │
│  │ [Keep Free]  │  │ [Start Trial]│  │ [Subscribe]  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                    ← Recommended                            │
└──────────────────────────────────────────────────────────────┘
```

**Feature Comparison Table:**
Available as expandable section below pricing cards

---

## 6. Analytics Events to Track

### 6.1 Discovery Funnel

```javascript
// Public browsing
track('marketplace_page_viewed', { referrer, utm_source });
track('mentor_profile_viewed', { providerId, referrer });
track('service_viewed', { serviceId, providerId, price });

// Conversion attempts
track('book_button_clicked', {
  serviceId,
  providerId,
  isLoggedIn: false,
  pricePoint
});
track('message_button_clicked', { providerId, isLoggedIn: false });
track('save_button_clicked', { providerId, isLoggedIn: false });
```

### 6.2 Account Creation Funnel

```javascript
// Modal shown
track('signup_modal_shown', {
  trigger: 'booking' | 'message' | 'save',
  serviceId
});

// User choice
track('signup_option_selected', {
  option: 'free_account' | 'trial' | 'login',
  trigger: 'booking'
});

// Form interaction
track('signup_form_started', { accountType });
track('signup_form_field_completed', { field, accountType });
track('signup_form_submitted', { accountType });
track('signup_form_error', { field, error, accountType });

// Success
track('account_created', {
  accountType,
  trigger,
  timeToComplete,
  referralSource
});
```

### 6.3 Booking Funnel (Post-Signup)

```javascript
track('booking_flow_started', {
  serviceId,
  accountAge: 'new' | 'existing',
  accountType
});
track('booking_date_selected', { serviceId });
track('booking_payment_info_entered', { serviceId });
track('booking_completed', {
  serviceId,
  providerId,
  amount,
  accountAge,
  accountType,
  timeFromSignup
});
```

### 6.4 Conversion Tracking

```javascript
// Upsell impressions
track('trial_upsell_shown', {
  location: 'post_booking' | 'banner' | 'email' | 'dashboard',
  userSegment: 'marketplace_only'
});

// Upsell clicks
track('trial_upsell_clicked', { location, userSegment });

// Conversions
track('free_to_trial_converted', {
  daysAfterSignup,
  triggeredBy: 'post_booking' | 'email' | 'banner',
  totalBookings
});
track('trial_to_paid_converted', {
  daysInTrial,
  totalBookings,
  originTrigger: 'marketplace'
});
```

### 6.5 Key Metrics Dashboard

**Conversion Funnel:**
1. Marketplace page views
2. Provider profile views
3. Book button clicks (logged out)
4. Signup modal shown
5. Account creation started
6. Account created (Free | Trial)
7. Booking completed
8. Free → Trial conversion
9. Trial → Paid conversion

**Target Metrics:**
- **Modal → Account creation:** 40%+
- **Account → Booking completion:** 80%+
- **Free account → Trial (30 days):** 30%+
- **Trial → Paid:** 60%+
- **Marketplace → Paid (90 days):** 20%+

---

## 7. Edge Cases

### 7.1 User Already Has Account But Not Logged In

**Scenario:** User created account months ago, comes back via Google

```
Clicks "Book Service"
    ↓
Modal: "Create Account to Book"
    ↓
User clicks "Already have an account? Log In"
    ↓
Login modal
    ↓
After login: Direct to booking flow
```

**Alternative (Smart Detection):**
```
User enters email in signup form
    ↓
Backend checks: Email exists
    ↓
Show inline message:
"This email already has an account. [Log in instead]"
```

---

### 7.2 Expired Trial User

**Scenario:** User had trial, didn't convert, comes back to book mentor

**Current status:**
- Tag: `02. [Status] - 7 Day Free Trial - Ended`
- No access tag

**Experience:**
```
Clicks "Book Service"
    ↓
Check: User logged in? YES
Check: Has booking access? NO (no active subscription)
    ↓
Show modal:

┌─────────────────────────────────────────────┐
│  Welcome Back! 👋                            │
│                                             │
│  Your free trial ended on Nov 15.          │
│                                             │
│  Continue where you left off:              │
│  • Book verified SRNA mentors              │
│  • Access all trackers & tools             │
│  • Join our community                      │
│                                             │
│  Special offer: Get 20% off your first     │
│  month when you subscribe today.           │
│                                             │
│  [Subscribe & Book] ($21.60 first month)   │
│  [Just Book This Service] (free account)   │
└─────────────────────────────────────────────┘
```

**If they choose "Just Book This Service":**
- Convert to free account status
- Apply tag: `02. [Status] - Marketplace Only - Active`
- Allow booking
- Remove full platform access
- Show upsell banners

---

### 7.3 Cancelled Subscriber

**Scenario:** User was paid member, cancelled, now wants to book

**Current status:**
- Tag: `02. [Status] - Premium Member 1 - Cancelled`
- Access tag removed

**Experience:**
```
Similar to expired trial, but:

┌─────────────────────────────────────────────┐
│  We Miss You! 😢                             │
│                                             │
│  Your membership ended on Nov 30.          │
│                                             │
│  Reactivate to continue:                   │
│  • All your saved data is still here       │
│  • Your X target programs                  │
│  • Your clinical tracker entries           │
│  • PLUS book mentors                       │
│                                             │
│  [Reactivate Membership] ($27/mo)          │
│  [Just Book This Service] (free)           │
└─────────────────────────────────────────────┘
```

---

### 7.4 Toolkit-Only Purchaser

**Scenario:** User bought Plan+Apply toolkit, now wants to book

**Current status:**
- Tag: `02. [Status] - Plan + Apply Toolkit - Purchased`
- Limited access to toolkit content

**Experience:**
```
Check: User logged in? YES
Check: Has booking access? PARTIAL (toolkit, not marketplace)
    ↓
Show modal:

┌─────────────────────────────────────────────┐
│  Book Your First Mentor Session             │
│                                             │
│  As a toolkit owner, you can:              │
│                                             │
│  Option 1: Book this service only          │
│  Keep your toolkit access + this booking   │
│  No additional cost                        │
│                                             │
│  Option 2: Upgrade to full membership      │
│  Unlimited bookings + all features         │
│  $27/month (or try 7 days free)            │
│                                             │
│  [Book This Service]                       │
│  [Start Free Trial]                        │
└─────────────────────────────────────────────┘
```

**Reasoning:** Toolkit purchasers already paid, let them book freely

---

### 7.5 Multiple Browser/Device Sessions

**Scenario:** User starts signup on mobile, completes on desktop

**Solution:** Email verification link

```
Mobile: User enters email, gets verification email
    ↓
Desktop: User clicks link in email
    ↓
Opens desktop browser
    ↓
"Complete your signup"
    ↓
Finish password creation
    ↓
Logged in on desktop
```

---

### 7.6 Mentor Unavailable During Booking

**Scenario:** User signs up, but mentor paused bookings in meantime

```
User completes signup
    ↓
Returns to booking page
    ↓
Check: Service still available? NO
    ↓
Show message:

┌─────────────────────────────────────────────┐
│  Service Temporarily Unavailable            │
│                                             │
│  Sarah has paused new bookings for this    │
│  service.                                  │
│                                             │
│  You can:                                  │
│  • Check her other available services      │
│  • Browse similar mentors                  │
│  • Get notified when she's available       │
│                                             │
│  [View Other Services]                     │
│  [Browse Similar Mentors]                  │
│  [Notify Me When Available]                │
└─────────────────────────────────────────────┘
```

---

### 7.7 Payment Failure During Booking

**Scenario:** Free user tries to book, payment fails

```
User completes booking form
    ↓
Submits payment
    ↓
Stripe error: Card declined
    ↓
Show inline error:

"Your card was declined. Please check your
card details or try a different payment method.

[Update Payment Info]
[Try Different Card]
[Contact Support]"

Booking saved as draft
Email sent with "Complete your booking" link
```

---

## 8. SEO Considerations

### 8.1 Public vs Authenticated Pages

**Public (Indexable):**
- `/marketplace` - Main directory
- `/marketplace/:providerId` - Individual profiles
- All mentor profiles should be crawlable

**Private (No-index):**
- `/marketplace/:providerId/book/:serviceId` - Booking flow
- `/my-bookings` - User booking history
- `/dashboard` - Dashboard

---

### 8.2 Meta Tags for Marketplace Pages

**Marketplace Directory (`/marketplace`):**
```html
<title>CRNA School Interview Prep & Mentoring | The CRNA Club</title>
<meta name="description" content="Book mock interviews, essay reviews, and application coaching from verified SRNAs currently in CRNA school. Get expert help from mentors who recently got accepted.">
<meta name="keywords" content="CRNA interview prep, CRNA mentoring, mock interview, essay review, application coaching">
<link rel="canonical" href="https://thecrnaclub.com/marketplace">
```

**Provider Profile (`/marketplace/:providerId`):**
```html
<title>Sarah Johnson - CRNA Mentor | Duke CRNA Student | The CRNA Club</title>
<meta name="description" content="Book a session with Sarah, a 2nd-year CRNA student at Duke. Specializes in mock interviews and essay reviews. 4.9★ rating from 47 applicants.">
<meta property="og:image" content="https://thecrnaclub.com/avatars/sarah.jpg">
<meta property="og:type" content="profile">
```

---

### 8.3 Schema Markup for Services

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "CRNA Interview Preparation",
  "provider": {
    "@type": "Person",
    "name": "Sarah Johnson",
    "jobTitle": "SRNA, Duke University"
  },
  "offers": {
    "@type": "Offer",
    "price": "75.00",
    "priceCurrency": "USD"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "47"
  }
}
```

---

### 8.4 Structured Data for Breadcrumbs

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://thecrnaclub.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Marketplace",
      "item": "https://thecrnaclub.com/marketplace"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Sarah Johnson",
      "item": "https://thecrnaclub.com/marketplace/sarah-johnson"
    }
  ]
}
```

---

### 8.5 robots.txt

```
# Allow marketplace pages
Allow: /marketplace$
Allow: /marketplace/*

# Disallow booking flows
Disallow: /marketplace/*/book/*

# Disallow user-specific pages
Disallow: /my-bookings
Disallow: /dashboard
```

---

## 9. Scenario Walkthroughs

### Scenario 1: Google Search → Marketplace

**User Journey:** Sarah searches "CRNA mock interview prep"

```
1. Google SERP
   Title: "CRNA School Interview Prep & Mentoring | The CRNA Club"
   Description: "Book mock interviews from verified SRNAs..."
   ↓
2. Clicks result → Lands on /marketplace
   - Sees 15 verified mentors
   - Can filter by service type, program, price
   - All profiles visible (no blur)
   ↓
3. Clicks "Emma - Duke SRNA" profile
   - Full profile visible
   - Bio, services, reviews, pricing all visible
   - Clear CTAs: "Book Mock Interview" "$85"
   ↓
4. Clicks "Book Mock Interview"
   - Gate modal appears
   - Options: Free Account | Trial | Login
   ↓
5. Selects "Start 7-Day Free Trial"
   - Signup form (name, email, password, CC)
   - Submits
   ↓
6. Account created + Trial activated
   - Welcome email sent
   - Tag applied: Trial Active
   ↓
7. Redirected to booking flow
   - Service pre-selected
   - Chooses date/time
   - Completes payment
   ↓
8. Booking confirmed
   - Confirmation page
   - Email with calendar invite
   - Upsell box: "Explore school database while you prep"
   ↓
9. Explores dashboard
   - Sees onboarding widget
   - "Add your first target program"
   - Clicks through to /schools
   ↓
10. Now using full platform
    - Converted from marketplace → full member ✅
```

**Key Metrics for This Path:**
- Google click → Marketplace page view
- Marketplace page → Profile view
- Profile view → Book click
- Book click → Signup modal
- Signup modal → Account created (Trial)
- Account created → Booking completed
- Days to first non-marketplace feature use

---

### Scenario 2: Referral from Member

**User Journey:** Jessica's friend shares link to specific mentor

```
1. Receives text message
   "Check out Sarah's CRNA interview help!
    https://thecrnaclub.com/marketplace/sarah-johnson"
   ↓
2. Clicks link (on mobile)
   - Lands directly on Sarah's profile
   - Full profile visible
   - Sees 4.9★ rating, 47 reviews
   ↓
3. Scrolls through reviews
   - "Sarah helped me nail my Georgetown interview!"
   - "Best $85 I spent on my application"
   - Builds trust
   ↓
4. Clicks "Book 1-Hour Mock Interview"
   - Gate modal
   - Options shown
   ↓
5. Selects "Continue with Free Account"
   - Quick signup (just name/email/password)
   - No CC required
   ↓
6. Account created
   - Tag: Marketplace - Created Account
   - Referred by: jessica@... (if tracked)
   ↓
7. Redirected to booking flow
   - Selects date
   - Enters payment for this service only
   - Completes booking
   ↓
8. Booking confirmed
   - Email confirmation
   - Calendar invite
   - Post-booking upsell shown
   ↓
9. Dismisses upsell
   - "Maybe later"
   - Exits site
   ↓
10. Email nurture begins
    Day 1: Session reminder
    Day 2: "How was your session? Start trial"
    Day 5: Case study email
    Day 9: "What are you working on?"
    ↓
11. Day 9: Clicks email CTA
    - Lands on trial signup
    - Converts to trial
    - Tag updated: Trial Active
```

**Conversion Metric:**
- Day 0: Free account (marketplace only)
- Day 9: Converted to trial via email
- Success! ✅

---

### Scenario 3: Browsing → Booking Attempt

**User Journey:** Alex is exploring, not sure yet

```
1. Lands on /marketplace
   - Maybe from blog post CTA
   ↓
2. Browses mentor cards
   - Filters by "Mock Interview"
   - Sees 8 mentors offering this service
   ↓
3. Opens 3 different profiles in tabs
   - Compares bios
   - Compares prices ($75-$120)
   - Compares ratings
   ↓
4. Decides on "Marcus - Uniformed Services"
   - Military background resonates
   - 5.0★ rating
   ↓
5. Clicks "Message Marcus"
   - Gate modal (simpler than booking)
   - "Log in to message Marcus"
   ↓
6. Creates free account
   - Quick signup
   ↓
7. Message composer opens
   - Types: "Hi Marcus, I'm also prior military.
     What programs did you apply to?"
   - Sends
   ↓
8. Message sent confirmation
   - "Marcus typically responds within 4 hours"
   - Toast with upsell: "Track your journey! Try 7 days free"
   ↓
9. Gets response from Marcus
   - Email notification
   - Logs back in to read response
   ↓
10. Conversation continues
    - Builds rapport
    - Marcus mentions his service
    ↓
11. Alex clicks "Book Strategy Session"
    - Already logged in ✅
    - Goes straight to booking flow
    - Completes payment
    ↓
12. Now has booking history
    - Can see conversations
    - Can see upcoming session
    - Dashboard shows limited view
    ↓
13. Persistent banner shows
    - "Get 7 days free - Track your schools"
    - Clicks banner
    ↓
14. Converts to trial
    - Success! ✅
```

**Key Insight:** Messaging can be a lower-friction entry point

---

### Scenario 4: Post-Free-Account Experience

**User Journey:** Day in the life of marketplace-only user

```
User created free account 3 days ago
Booked one session
Currently has no trial/paid subscription

1. Logs in to check booking details
   ↓
2. Lands on /dashboard (limited view)
   ↓
   Sees:
   ┌─────────────────────────────────────────┐
   │ 📅 Upcoming Bookings                    │
   │ Mock Interview with Emma - Dec 12, 2pm  │
   │ [View Details] [Join Video Call]        │
   │                                         │
   │ ─────────────────────────────────────   │
   │                                         │
   │ 🔒 Unlock Your Full Application Journey│
   │                                         │
   │ (Blurred preview of trackers/programs)  │
   │                                         │
   │ [Start 7-Day Free Trial]                │
   └─────────────────────────────────────────┘
   ↓
3. Dismisses, goes to /marketplace
   - Browses more mentors
   - Saves a few (heart icon)
   ↓
4. Tries to access /schools from nav
   - Paywall overlay appears
   - Shows blurred school cards
   - CTA: "Start Free Trial to Research Programs"
   ↓
5. Clicks "Maybe Later"
   - Returns to marketplace
   ↓
6. Attends booked session
   - Has great experience
   - Wants to book follow-up
   ↓
7. Books second session with same mentor
   - Repeat booking ✅
   ↓
8. Post-booking email (different for repeat):
   "Great to see you back! Ready to track your
   whole journey? Try everything free for 7 days."
   ↓
9. Still doesn't convert
   - Continues as marketplace-only user
   - That's okay! They're still engaged
   ↓
10. Email Day 14: Final push
    "Special offer: 20% off first month"
    ↓
11. Converts to paid (not trial)
    - Success! ✅
```

**Metric:** Free → Paid conversion (skipped trial)

---

### Scenario 5: Marketplace User → Full Member Conversion

**User Journey:** The ideal conversion path

```
Day 0: Marketplace Discovery
- Creates free account
- Books mock interview
- Tag: Marketplace - Free Account

Day 3: Pre-Session Prep
- Gets email: "Prepare for your session"
- Includes link to "CRNA Interview Question Bank"
- Link goes to trial-gated content
- Clicks → Sees paywall → Starts trial ✅
- Tag updated: Trial Active

Day 4: Attends Session
- Mentor mentions: "Track your clinical skills"
- After session, explores trackers
- Logs first clinical entry
- +2 points ✅

Day 5: Explores Platform
- Checks out school database
- Saves 3 programs
- Adds 1 as target
- Completes checklist items
- Gaining value ✅

Day 7: Trial Reminder
- Email: "Your trial ends in 2 days"
- Shows usage stats: "You've saved 3 programs,
  logged 2 clinical entries, earned 15 points"
- CTA: "Continue for $27/month"

Day 8: Converts to Paid
- Subscribes ✅
- Tag: Premium Member - Active
- Full access maintained

Day 30: Fully Engaged
- Using trackers weekly
- Saved 8 programs
- Active in community
- Booked 2nd mentor session
- Lifetime member! ✅
```

**Perfect Conversion:** Marketplace → Trial → Paid
**Timeline:** 8 days
**LTV:** High (using full platform + marketplace)

---

## 10. Implementation Checklist

### 10.1 Backend Requirements

**Authentication:**
- [ ] Create "marketplace-only" user role/tag
- [ ] Endpoint: `POST /auth/signup` (free account)
- [ ] Endpoint: `POST /auth/signup/trial` (with payment)
- [ ] Endpoint: `POST /auth/login`
- [ ] Endpoint: `GET /auth/me` (return access level)

**Booking Access Control:**
- [ ] Check: Can user book? (logged in minimum)
- [ ] Check: Can user message? (logged in minimum)
- [ ] Check: Can user save? (logged in minimum)
- [ ] Check: Can user review? (must have completed booking)

**Tags/Segments:**
- [ ] Create tag: `01. [Lead Gen] - Marketplace - Created Account`
- [ ] Create tag: `02. [Status] - Marketplace Only - Active`
- [ ] Tag automation: Apply on free account signup
- [ ] Tag automation: Remove on trial/paid conversion

**Email Sequences:**
- [ ] Sequence: Marketplace user nurture (7 emails, 14 days)
- [ ] Trigger: Tag applied "Marketplace - Created Account"
- [ ] Emails include booking confirmations, upsells, case studies

---

### 10.2 Frontend Requirements

**Public Pages:**
- [ ] `/marketplace` - Directory (SSR/SSG for SEO)
- [ ] `/marketplace/:providerId` - Profile (SSR/SSG for SEO)
- [ ] Both pages fully accessible without login
- [ ] Schema markup implemented
- [ ] Meta tags optimized

**Gate Modals:**
- [ ] BookingGateModal component
- [ ] MessageGateModal component
- [ ] SaveGateModal component
- [ ] Each shows appropriate options

**Signup Flows:**
- [ ] FreeAccountSignup component
- [ ] TrialSignup component
- [ ] Login component
- [ ] Password reset flow

**User Dashboard (Free):**
- [ ] Limited dashboard view for free accounts
- [ ] Show only: Bookings, Messages, Saved Mentors
- [ ] Upsell widgets for locked features
- [ ] Persistent trial banner

**Upsell Components:**
- [ ] PostBookingUpsell component
- [ ] TrialBanner component (dismissible)
- [ ] DashboardUpsellWidget component
- [ ] PaywallOverlay component (for locked features)

---

### 10.3 Analytics Implementation

**Events to Implement:**
- [ ] `marketplace_page_viewed`
- [ ] `provider_profile_viewed`
- [ ] `book_button_clicked` (with logged_out flag)
- [ ] `signup_modal_shown`
- [ ] `signup_option_selected`
- [ ] `account_created` (with type: free/trial)
- [ ] `booking_completed`
- [ ] `trial_upsell_shown`
- [ ] `trial_upsell_clicked`
- [ ] `free_to_trial_converted`

**Dashboards:**
- [ ] Marketplace acquisition funnel
- [ ] Free → Trial → Paid conversion rates
- [ ] Time-to-conversion metrics
- [ ] LTV by acquisition source

---

### 10.4 Copy & Content

- [ ] Write all modal copy
- [ ] Write email sequence (7 emails)
- [ ] Write FAQ: "Do I need a membership to book?"
- [ ] Write support docs for free accounts
- [ ] Create comparison table: Free vs Trial vs Paid

---

### 10.5 Testing Scenarios

**Manual Testing:**
- [ ] Non-member can browse all mentors
- [ ] Non-member can view full profiles
- [ ] Non-member sees gate when booking
- [ ] Free account can complete booking
- [ ] Trial account gets full access
- [ ] Expired trial → Free account (booking still works)
- [ ] Cancelled member → Free account (booking still works)
- [ ] Toolkit owner can book

**Edge Cases:**
- [ ] User already has account (email check)
- [ ] Payment failure during booking
- [ ] Mentor unavailable after signup
- [ ] Session expired during booking flow
- [ ] Multiple device/browser sessions

---

## 11. Success Criteria

### 11.1 Launch Metrics (First 30 Days)

| Metric | Target | Tracking |
|--------|--------|----------|
| **Marketplace page views** | 1,000+ | GA4 |
| **Profile views** | 500+ | GA4 |
| **Signup modal impressions** | 200+ | Custom event |
| **Free accounts created** | 50+ | Backend |
| **Trial accounts created** | 30+ | Backend |
| **Bookings completed** | 40+ | Backend |
| **Free → Trial (30 days)** | 30%+ | Cohort analysis |

### 11.2 Long-Term Health (90 Days)

| Metric | Target | Tracking |
|--------|--------|----------|
| **Marketplace → Paid conversion** | 20%+ | Cohort analysis |
| **Avg time to conversion** | <21 days | Cohort analysis |
| **Repeat booking rate** | 40%+ | Backend |
| **Free account retention** | 60%+ at 30d | Cohort analysis |
| **Organic marketplace traffic** | 40%+ of total | GA4 |

---

## 12. Open Questions for Product Owner

1. **Free account limitations:**
   - Should free accounts have any booking limits? (e.g., 1 booking/month?)
   - **Recommendation:** No limits to start. Let them book unlimited. Focus on platform upsell.

2. **Pricing strategy:**
   - Any special pricing for marketplace-only users who want to upgrade?
   - **Recommendation:** Standard trial offer. Maybe 20% off first month if convert within 14 days.

3. **Provider visibility:**
   - Should all providers be visible to non-members, or just featured/top-rated?
   - **Recommendation:** All visible. We want full SEO benefit.

4. **Review requirements:**
   - Should users be able to review if they have free account but completed booking?
   - **Recommendation:** Yes. Booking access = review access (builds trust).

5. **Messaging access:**
   - Should free accounts have unlimited messaging or be limited?
   - **Recommendation:** Unlimited. It's a conversion tool, not a cost center.

6. **Data collection:**
   - What onboarding data should we collect from marketplace-only users?
   - **Recommendation:** Minimal (name/email/password). Progressive profiling after first booking.

7. **Refund policy:**
   - Same refund policy for free accounts as paid members?
   - **Recommendation:** Yes. Customer-friendly policy builds trust. Monitor for abuse.

8. **Provider compensation:**
   - Do free-account bookings have same commission structure as member bookings?
   - **Recommendation:** Yes. 20% across the board. Providers don't care about buyer's membership status.

---

## 13. Next Steps

### Immediate (This Week):
1. ✅ Review this spec with stakeholders
2. ✅ Get approval on key decisions
3. ✅ Finalize copy for modals and emails
4. ✅ Set up analytics events
5. ✅ Create Figma mockups for gates/modals

### Short-Term (Next 2 Weeks):
1. ✅ Implement public marketplace pages (SSR)
2. ✅ Build gate modal components
3. ✅ Implement free account signup
4. ✅ Implement trial signup
5. ✅ Build limited dashboard for free accounts
6. ✅ Set up email nurture sequence
7. ✅ QA all flows

### Launch (Week 3):
1. ✅ Soft launch to subset of providers
2. ✅ Test end-to-end flows
3. ✅ Monitor analytics
4. ✅ Full public launch
5. ✅ Blog post: "Book CRNA Mentors"

### Post-Launch (Month 2):
1. ✅ Analyze conversion funnels
2. ✅ A/B test modal copy
3. ✅ Optimize email sequence
4. ✅ Interview users who converted
5. ✅ Iterate based on data

---

## Appendix: Competitor Analysis

### How Others Handle Non-Member Access

**Clarity.fm (Expert Calls):**
- ✅ Full browsing without account
- ✅ Profiles, pricing, reviews all public
- 🔒 Must create account to book
- 📧 Aggressive email follow-ups

**Wyzant (Tutoring):**
- ✅ Browse tutors
- ✅ See limited profiles
- 🔒 Must sign up to see full profile
- 🔒 Must sign up to message

**Fiverr:**
- ✅ Full browsing
- ✅ Full gig details
- 🔒 Must sign up to order

**Coursera (1:1 Mentorship):**
- ✅ Browse mentors
- ✅ Full profiles
- 🔒 Must have Coursera Plus to book

**Our Approach (Hybrid):**
- ✅ More open than Wyzant (full profiles public)
- ✅ Less restrictive than Coursera (no paid membership required)
- ✅ Similar to Clarity (account to book)
- ✅ Unique: Triple-tier conversion path (Free → Trial → Paid)

**Why This Works for Us:**
1. We have existing value (school database, trackers)
2. Marketplace is acquisition tool, not core product
3. Converting marketplace users to full members = higher LTV
4. Trust is critical in CRNA niche - transparency builds trust

---

## Document History

| Date | Change | Author |
|------|--------|--------|
| Dec 8, 2024 | Initial creation | Claude (Growth PM Agent) |
| Dec 8, 2024 | Added all sections, scenarios, edge cases | Claude (Growth PM Agent) |

---

**Ready for review and implementation.**
