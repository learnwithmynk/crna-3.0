# Marketplace Page Architecture

**Document Type:** Product Design Specification
**Created:** 2024-12-08
**Purpose:** Complete page structure and navigation design for The CRNA Club mentor marketplace

---

## Table of Contents

1. [Overview](#overview)
2. [Site Map](#site-map)
3. [Page Specifications](#page-specifications)
4. [Navigation Structure](#navigation-structure)
5. [Cross-Linking Strategy](#cross-linking-strategy)
6. [Component Inventory](#component-inventory)
7. [Mobile Considerations](#mobile-considerations)
8. [Implementation Checklist](#implementation-checklist)

---

## Overview

### Product Context

The CRNA Club marketplace is a curated, high-trust service marketplace that connects:
- **Applicants** (ICU nurses applying to CRNA school) with
- **SRNAs** (current CRNA students) who offer mentorship services

### Key Principles

1. **Trust-First:** Strict SRNA verification, payment escrow, double-blind reviews
2. **Request-Based:** Bookings require provider acceptance (SRNAs are busy students)
3. **Integrated:** Marketplace is a layer on top of existing CRNA Club product
4. **Mobile-Optimized:** 60%+ of traffic is mobile
5. **Simple Initially:** Start with 3 service types, expand based on demand

### Success Metrics

| Metric | Target | Why |
|--------|--------|-----|
| Time to First Booking | < 7 days for new providers | Liquidity indicator |
| Repeat Booking Rate | 40-60% | Product-market fit signal |
| Review Completion Rate | 70%+ | Trust signal for next transactions |
| Average Rating | 4.5+ stars | Quality indicator |
| Provider Retention | 70%+ active at 3 months | Supply health |

---

## Site Map

```
/marketplace
├── /                                    # Marketplace home/landing
├── /search                              # Search results with filters
├── /category/:categorySlug              # Category view (e.g., /marketplace/category/mock-interview)
│
├── /mentor/:providerId                  # Mentor profile
│   ├── /services                        # All mentor's services (tabs on profile)
│   └── /reviews                         # All mentor's reviews (tabs on profile)
│
├── /service/:serviceId                  # Service detail page (if needed separately)
│
├── /book/:serviceId                     # Booking flow (multi-step)
│   ├── /details                         # Step 1: Service details + provider info
│   ├── /request                         # Step 2: Request message + availability
│   └── /payment                         # Step 3: Payment + confirmation
│
├── /my-bookings                         # Applicant's bookings
│   ├── ?status=pending                  # Filter: Pending requests
│   ├── ?status=upcoming                 # Filter: Confirmed upcoming
│   ├── ?status=completed                # Filter: Past completed
│   └── /:bookingId                      # Single booking detail
│
├── /messages                            # Messaging inbox (shared with platform messages)
│   └── /:conversationId                 # Single conversation thread
│
├── /saved                               # Saved/favorited mentors
│
└── /provider                            # Provider area (SRNA only)
    ├── /apply                           # Provider application form
    ├── /onboarding                      # Multi-step setup wizard (post-approval)
    │   ├── /profile                     # Step 1: Complete profile
    │   ├── /service                     # Step 2: Create first service
    │   ├── /availability                # Step 3: Set availability
    │   └── /payment                     # Step 4: Stripe Connect setup
    │
    ├── /dashboard                       # Provider dashboard
    ├── /services                        # Manage services
    │   ├── /new                         # Create new service
    │   └── /:serviceId/edit             # Edit existing service
    │
    ├── /calendar                        # Availability management
    ├── /bookings                        # Booking management
    │   ├── ?status=requests             # Filter: Pending requests (need action)
    │   ├── ?status=upcoming             # Filter: Confirmed upcoming
    │   ├── ?status=completed            # Filter: Past completed
    │   └── /:bookingId                  # Single booking detail
    │
    ├── /earnings                        # Earnings & payouts
    │   ├── /history                     # Transaction history
    │   └── /payouts                     # Payout details
    │
    ├── /reviews                         # Reviews received
    └── /settings                        # Provider account settings

/admin/marketplace                       # Admin area (admins only)
├── /applications                        # Provider applications to review
│   └── /:applicationId                  # Single application detail
├── /providers                           # All providers list
│   └── /:providerId                     # Provider admin view
├── /bookings                            # All bookings
├── /disputes                            # Disputed transactions
├── /analytics                           # Marketplace analytics
└── /settings                            # Marketplace configuration
```

---

## Page Specifications

### Applicant-Facing Pages

---

#### 1. Marketplace Home `/marketplace`

**Purpose:** Discovery entry point - browse available mentors and services

**User Type:** Applicants (logged in)

**Key Components:**
- Hero section with search bar
- Featured/Recommended mentors carousel
- Service type cards (Mock Interview, Essay Review, Strategy Session)
- "Mentors at Your Target Programs" section
- Top-rated mentors grid
- Recent reviews carousel
- FAQ/How It Works section

**Data Needed:**
- Featured providers (admin-curated or algorithm)
- User's target programs → providers at those schools
- Service type definitions
- Top-rated providers (4.8+ stars, 5+ bookings)
- Recent high-quality reviews

**Actions Available:**
- Search mentors/services
- Filter by service type
- Click mentor card → profile
- Click service type → category view
- Save/favorite mentor (heart icon)

**Entry Points:**
- Sidebar navigation: "Marketplace"
- Dashboard widget: "Find a Mentor"
- Contextual nudges (e.g., after completing milestone 12 "Interview Prep")
- Direct URL

**Exit Points:**
- Mentor profile page
- Category/search results
- Booking flow (if "Quick Book" CTA)
- My Bookings

**Mobile Considerations:**
- Sticky search bar at top
- Service type cards in horizontal scroll
- Stack mentor cards vertically
- Simplified filters (drawer)

---

#### 2. Search Results `/marketplace/search`

**Purpose:** Filtered marketplace view based on search/filters

**URL Patterns:**
```
/marketplace/search?q=mock+interview
/marketplace/search?service=mock_interview&state=TX&maxPrice=100
/marketplace/search?program=duke-university
```

**Key Components:**
- Search bar (pre-filled with query)
- Active filters display with X to remove
- Filter sidebar/drawer:
  - Service type (multi-select)
  - Mentor's program/location
  - Price range (slider)
  - Rating (4+ stars, etc.)
  - Availability (available this week)
  - Response time
- Sort dropdown (Recommended, Highest Rated, Price Low-High, Newest)
- Results grid (mentor + service cards)
- Pagination or infinite scroll
- Empty state: "No mentors found, try adjusting filters"

**Data Needed:**
- Filtered list of providers/services
- Each card: provider name, avatar, program, rating, # reviews, service type, price, response time, availability indicator

**Actions Available:**
- Refine filters
- Sort results
- Click mentor → profile
- Click service → booking flow
- Save mentor
- Load more results

**Entry Points:**
- Marketplace home search
- Sidebar navigation
- Category pages

**Exit Points:**
- Mentor profile
- Booking flow
- Marketplace home

---

#### 3. Category View `/marketplace/category/:categorySlug`

**Purpose:** Browse mentors offering a specific service type

**Example URLs:**
```
/marketplace/category/mock-interview
/marketplace/category/essay-review
/marketplace/category/strategy-session
```

**Key Components:**
- Category header: title, description, icon
- "What to expect" section (service type description)
- Average price range indicator
- Recommended duration
- Filter sidebar (subset of full search filters)
- Mentor grid (showing this service)
- Testimonials specific to this service type

**Data Needed:**
- Service type metadata (name, description, icon, typical price, duration)
- Providers offering this service
- Reviews specific to this service type

**Actions Available:**
- Filter by price, rating, program
- Click mentor → profile (scrolls to this service)
- Quick book
- Save mentor

**Entry Points:**
- Marketplace home (service type cards)
- Search results
- Dashboard nudges

**Exit Points:**
- Mentor profile
- Booking flow
- Search results

---

#### 4. Mentor Profile `/marketplace/mentor/:providerId`

**Purpose:** Complete provider information and services offered

**URL Pattern:**
```
/marketplace/mentor/sarah-johnson-duke
```

**Layout:** Hero + Tabs

**Hero Section:**
- Provider photo (large)
- Name
- CRNA Program + Year (e.g., "Duke University DNP Class of 2025")
- Location
- Verified badge
- Star rating + number of reviews
- Response time (e.g., "Usually responds in 2 hours")
- Save/Favorite button (heart icon)

**Tab Navigation:**
1. **Services** (default tab)
2. **About**
3. **Reviews**

**Tab 1: Services**
- Service cards grid
- Each card shows:
  - Service type icon + name
  - Duration (e.g., "60 minutes")
  - Price
  - Live vs Async badge
  - Brief description
  - Availability indicator ("Available this week")
  - "Book Now" button
- Empty state: "This mentor hasn't added any services yet"

**Tab 2: About**
- Bio (rich text, 200-500 words)
- "Why I'm Here to Help" section
- Program details:
  - School name + program type
  - Expected graduation
  - Undergraduate school
  - ICU experience before CRNA school
- Stats card:
  - Total bookings completed
  - Member since date
  - Average response time
  - Repeat booking rate (if high)

**Tab 3: Reviews**
- Average ratings breakdown:
  - Overall star rating (large)
  - Rating distribution (bar chart: 5 star, 4 star, etc.)
  - Total reviews count
- Review list:
  - Each review shows: reviewer name (or "Anonymous Applicant"), date, star rating, service type, review text
  - Provider response (if any)
- Pagination
- Empty state: "No reviews yet. Be the first to work with this mentor!"

**Data Needed:**
- Provider profile data
- All active services
- All reviews + ratings
- Provider stats (bookings, response time, etc.)
- Availability status (pulled from calendar)

**Actions Available:**
- Book a service → booking flow
- Save/unsave mentor
- Send message (if enabled)
- Share profile (social share)
- Report profile (flag icon)
- Navigate between tabs

**Entry Points:**
- Marketplace home
- Search results
- Category pages
- "Recommended for You" widgets
- Direct link sharing

**Exit Points:**
- Booking flow
- Messages
- Back to marketplace/search

**Trust Signals:**
- Verified SRNA badge (with tooltip explaining verification)
- Star rating prominently displayed
- Response time
- Number of completed bookings
- Program affiliation
- Detailed bio

**Mobile Considerations:**
- Stack hero content vertically
- Sticky tabs navigation
- Service cards stack vertically
- Collapse bio with "Read more"
- Reviews: show 3, then "View all" button

---

#### 5. Booking Flow `/marketplace/book/:serviceId`

**Purpose:** Multi-step process to request and pay for a service

**Flow Type:** Request-based (provider must accept)

**URL Pattern:**
```
/marketplace/book/service_abc123
```

**Overall Structure:**
- Progress indicator: Step 1 → Step 2 → Step 3
- Persistent right sidebar: Booking summary card (desktop)
- Mobile: Summary card at top, sticky "Continue" button at bottom

**Booking Summary Card (Sticky):**
- Provider photo + name
- Service type + duration
- Price breakdown:
  - Service price: $100
  - Platform fee: Included
  - Total: $100
- Need help? → Support link

---

**Step 1: Review Details** `/marketplace/book/:serviceId/details`

**Purpose:** Confirm service selection and review what's included

**Key Components:**
- Service description (full)
- What's included list:
  - 60-minute live call
  - Personalized feedback document
  - Email follow-up
- What to expect:
  - Booking process explanation
  - Response time expectation (provider usually responds within X hours)
  - Cancellation policy
- Provider info card (mini version with link to full profile)
- "Continue to Request" button

**Actions:**
- Continue → Step 2
- Back to mentor profile
- Change service (back to profile)

---

**Step 2: Request Booking** `/marketplace/book/:serviceId/request`

**Purpose:** Provide availability and message to provider

**Key Components:**

**For Live Services (Mock Interview, Strategy Session):**
- "Tell [Provider Name] about your availability" section
- Timezone selector (auto-detected, editable)
- Preferred dates/times input:
  - Option 1: Date + Time range
  - Option 2: Date + Time range
  - Option 3: Date + Time range
  - "+ Add another option"
- Alternative: "I'm flexible, let's coordinate via message"

**For Async Services (Essay Review, Resume Review):**
- Document upload area (drag & drop)
- File size/type restrictions
- "When do you need this by?" date selector

**Message to Provider (Required):**
- Textarea: "Tell [Provider Name] about your needs and goals"
- Character count: 50-500 characters
- Placeholder text:
  - For Mock Interview: "Hi! I'm preparing for my interview at [School]. I'd love to practice answering common questions and get feedback on..."
  - For Essay Review: "I'm applying to [School] and working on my personal statement. I'd like feedback on..."

**Pre-Submission Checklist:**
- [ ] I understand the provider will review my request and may accept or decline
- [ ] I understand payment will only be processed if the provider accepts

**Actions:**
- Continue → Step 3 (payment)
- Back → Step 1
- Save draft (if implementing)
- Cancel booking

**Validation:**
- At least one availability option OR "flexible" selected (for live)
- Message is 50+ characters
- File uploaded (for async)
- Checkboxes confirmed

---

**Step 3: Payment & Confirmation** `/marketplace/book/:serviceId/payment`

**Purpose:** Collect payment (held in escrow) and confirm booking request

**Key Components:**

**Booking Summary (Expanded):**
- Provider name + photo
- Service type + duration
- Requested dates/times (or "Async - flexible")
- Your message (preview, collapsible)
- Pricing:
  - Service fee: $100
  - Platform processing: Included
  - **Total: $100**
  - Note: "You'll only be charged if [Provider Name] accepts your request. If declined, no charge will occur."

**Payment Method:**
- Credit card input (Stripe Elements)
  - Card number
  - Expiration
  - CVC
  - ZIP code
- "Save card for future bookings" checkbox
- Secure payment badges (SSL, Stripe, etc.)

**Cancellation & Refund Policy:**
- Collapsible section explaining:
  - Full refund if provider declines
  - Full refund if canceled > 48 hours before session
  - 50% refund if canceled 24-48 hours before
  - No refund if canceled < 24 hours
  - Link to full terms

**Legal:**
- [ ] I agree to the [Terms of Service] and [Cancellation Policy]

**Submit Button:**
- "Submit Booking Request - $100"
- Disabled until form valid + checkbox checked
- Loading state while processing

**Actions:**
- Submit → Confirmation page
- Back → Step 2
- Cancel booking

---

**Confirmation Page** `/marketplace/book/:serviceId/confirm?bookingId=xyz`

**Purpose:** Confirm request was sent successfully

**Key Components:**
- Success icon + message:
  - "Booking request sent!"
  - "We've sent your request to [Provider Name]. They'll review it and respond within [X hours]."
- What happens next:
  1. Provider reviews your request
  2. If accepted: You'll receive an email with session details
  3. If declined: Your card won't be charged, and we'll help you find another mentor
- Booking reference number: `#BK-12345`
- Next steps:
  - View booking status → My Bookings
  - Browse other mentors → Marketplace
  - Message provider → Messages

**Actions:**
- Go to My Bookings
- Return to Marketplace
- Find Another Mentor (if request is declined)

**Email Notifications Triggered:**
- To Applicant: "Booking request sent" confirmation
- To Provider: "New booking request" alert

---

#### 6. My Bookings `/marketplace/my-bookings`

**Purpose:** Manage all booking requests and confirmed sessions

**User Type:** Applicants

**Key Components:**

**Tab Navigation:**
1. **Pending** - Awaiting provider response
2. **Upcoming** - Confirmed sessions
3. **Completed** - Past sessions
4. **All** - Everything

**Filter/Sort (subtle, top right):**
- Sort by: Date, Service Type, Provider
- Filter by service type dropdown

**Booking Cards:**

**Pending Status:**
- Provider photo + name + program
- Service type + price
- Requested date/time
- Status badge: "Pending Provider Response"
- Time indicator: "Requested 2 hours ago"
- Actions:
  - Cancel Request (button)
  - Message Provider (link)
  - View Details (link)

**Upcoming Status:**
- Provider photo + name + program
- Service type + price
- Confirmed date/time (large, bold)
  - For live: "Tomorrow at 3:00 PM EST"
  - For async: "Due by Dec 15, 2024"
- Add to Calendar button (Google/Apple/Outlook)
- Meeting link (if live, shows 15 min before session)
- Actions:
  - Join Session (button, only 15 min before → 30 min after scheduled time)
  - Reschedule (link)
  - Cancel (link)
  - Message Provider (link)
  - View Details (link)

**Completed Status:**
- Provider photo + name + program
- Service type + price
- Completed date
- Star rating (if reviewed: shows rating, if not: "Leave a review" CTA)
- Actions:
  - Leave Review (button, primary if not reviewed)
  - View Review (if already reviewed)
  - Rebook with [Provider Name] (link)
  - View Details (link)

**Empty States:**
- Pending: "No pending requests"
- Upcoming: "No upcoming sessions. [Browse Marketplace]"
- Completed: "No completed sessions yet"

**Data Needed:**
- All user's bookings with status
- Provider info for each booking
- Session details (date/time, price, etc.)
- Review status
- Meeting links (if live sessions)

**Actions Available:**
- View booking detail
- Cancel/reschedule
- Join session (live)
- Leave review (completed)
- Message provider
- Rebook
- Filter/sort

**Entry Points:**
- Sidebar navigation: "My Bookings"
- Booking confirmation page
- Dashboard widget: "Upcoming Sessions"
- Email notifications (click through to specific booking)

**Exit Points:**
- Booking detail page
- Marketplace (browse more)
- Messages
- Review flow

**Mobile Considerations:**
- Tabs at top (horizontal scroll if needed)
- Stack booking cards vertically
- Simplified card layout (smaller provider photo, stack content)
- Quick actions in dropdown menu (three dots)

---

#### 7. Booking Detail `/marketplace/my-bookings/:bookingId`

**Purpose:** Full details and actions for a single booking

**URL Pattern:**
```
/marketplace/my-bookings/booking_abc123
```

**Layout:** Two columns (desktop), stacked (mobile)

**Left Column: Booking Details**

**Header:**
- Status badge (Pending, Confirmed, Completed, Cancelled, Disputed)
- Booking reference: `#BK-12345`
- Service type + price

**Session Info:**
- Provider card (photo, name, program, rating, link to profile)
- Service details:
  - Type
  - Duration
  - Date/time (for live) or Due date (for async)
  - Timezone
- Meeting link (if live, if within session window)
- Add to Calendar button

**Your Message:**
- Shows message sent to provider
- Requested availability options (if applicable)

**Timeline:**
- Booking requested: [date/time]
- Provider accepted: [date/time]
- Session scheduled: [date/time]
- Session completed: [date/time]
- Review left: [date/time]

**Actions (varies by status):**

**If Pending:**
- Cancel Request (button)
- Message Provider (button)

**If Upcoming:**
- Join Session (primary button, if within window)
- Add to Calendar (button)
- Reschedule (link)
- Cancel Booking (link)
- Message Provider (button)

**If Completed (not reviewed):**
- Leave Review (primary button)
- Rebook with Provider (button)
- Message Provider (button)

**If Completed (reviewed):**
- View Review (button)
- Rebook with Provider (button)
- Message Provider (button)

**Right Column: Support & Policies**

**Need Help?**
- Contact Support button
- Report an Issue link

**Cancellation Policy:**
- Shows applicable policy based on session date
- Refund amount if cancelled now

**Payment Receipt:**
- Collapsible section showing:
  - Service fee: $100
  - Platform fee: Included
  - Total paid: $100
  - Payment method: Visa ****1234
  - Date charged
  - Download receipt (PDF link)

**Data Needed:**
- Complete booking record
- Provider info
- Service info
- Payment details
- Messages (if any)
- Review (if completed)

**Entry Points:**
- My Bookings list
- Email notifications
- Dashboard "Upcoming Sessions"
- Provider dashboard (if provider)

**Exit Points:**
- Back to My Bookings
- Provider profile
- Review flow
- Messages
- Rebook → Booking flow

---

#### 8. Saved Mentors `/marketplace/saved`

**Purpose:** Quick access to favorited/saved mentors

**User Type:** Applicants

**Key Components:**
- Header: "Saved Mentors" + count
- Sort: Recently saved, Alphabetical, Rating
- Grid of mentor cards:
  - Photo, name, program
  - Rating + review count
  - Service types offered (pills)
  - Availability indicator
  - "View Profile" button
  - Unsave button (heart icon filled → unfilled)
- Empty state: "You haven't saved any mentors yet. [Browse Marketplace]"

**Data Needed:**
- User's saved provider IDs
- Provider info for each saved provider

**Actions Available:**
- View profile
- Unsave
- Book service (quick action)

**Entry Points:**
- Sidebar navigation (if saved count > 0)
- Marketplace home
- Saved heart icon on mentor cards

**Exit Points:**
- Mentor profile
- Booking flow
- Marketplace home

---

### Provider-Facing Pages (SRNA)

---

#### 9. Provider Application `/marketplace/provider/apply`

**Purpose:** SRNA applies to become a marketplace provider

**User Type:** Logged-in SRNAs or applicants who think they're eligible

**Access Control:**
- Available to anyone logged in
- Shows eligibility check if not SRNA

**Layout:** Single-page form or wizard (recommend single page for speed)

**Eligibility Check (if needed):**
- "Are you currently enrolled in a CRNA program?"
  - Yes → Continue to application
  - No → "The marketplace is currently only open to current SRNA students. We'll notify you when we expand!"

**Application Form:**

**Personal Info:**
- Full name (pre-filled from profile)
- Email (.edu required, highlighted)
- Phone number
- Profile photo (upload or use existing)

**CRNA Program Info:**
- School/University (dropdown + "Other" with text input)
- Program type (DNP, DNAP, MSNA)
- Expected graduation month/year
- Current year in program (1st year, 2nd year, 3rd year)

**Background:**
- Undergraduate institution
- Undergraduate degree + major
- ICU experience before CRNA school (years)
- Primary ICU type (MICU, SICU, CVICU, etc.)

**Bio:**
- "Tell applicants about yourself and why you want to help" (textarea)
- Character count: 200-500 words
- Tips/prompts:
  - Your background and why you chose CRNA
  - What you wish you knew when applying
  - How you can help applicants succeed

**Service Interests:**
- "Which services are you interested in offering?" (multi-select)
  - Mock Interview
  - Personal Statement Review
  - Resume/CV Review
  - Application Strategy Session
  - School Q&A
  - Other (specify)

**Verification:**
- "Upload proof of enrollment" (student ID, acceptance letter, or .edu email verification)
- File upload (drag & drop)

**Agreements:**
- [ ] I agree to the [Provider Terms of Service]
- [ ] I understand The CRNA Club will take a 20% platform fee on all bookings
- [ ] I commit to responding to booking requests within 24 hours
- [ ] I understand I must maintain a 4.0+ star rating to remain active

**Submit Button:**
- "Submit Application"
- Loading state

**Data Needed:**
- Schools dropdown list
- Service type definitions

**Actions:**
- Submit application → Confirmation page
- Save draft (auto-save)
- Cancel

**After Submission:**

**Confirmation Page:**
- "Application submitted!"
- "We'll review your application and respond within 2-3 business days."
- "What happens next:"
  1. Admin reviews your application
  2. You'll receive an email (approved or feedback needed)
  3. Once approved, you can complete your profile and create services
- "Return to Dashboard" button

**Email Notifications:**
- To Applicant: "Application received" confirmation
- To Admin: "New provider application to review"

**Entry Points:**
- Marketplace home: "Become a Mentor" button
- Dashboard (if SRNA): "Earn Money as a Mentor" widget
- Sidebar: "Become a Mentor" (if eligible)

**Exit Points:**
- Dashboard
- Marketplace

---

#### 10. Provider Onboarding `/marketplace/provider/onboarding`

**Purpose:** Multi-step setup wizard after application approval

**User Type:** Approved SRNAs (first login after approval)

**Access Control:**
- Only shown if: Application approved + onboarding not completed
- Skippable partially (can complete step 4 later)

**Progress Indicator:**
- Step 1: Complete Profile (required)
- Step 2: Create First Service (required)
- Step 3: Set Availability (required for live services)
- Step 4: Payment Setup (can skip, required before first payout)

---

**Step 1: Complete Profile** `/marketplace/provider/onboarding/profile`

**Purpose:** Finalize provider profile

**Pre-filled from application:**
- Name, photo, bio
- School, program, graduation year

**Additional Fields:**
- Tagline (50 characters): "Mock interview expert" or "Personal statement guru"
- Specialties (multi-select tags):
  - High GPA applicants
  - Low GPA success stories
  - Non-traditional backgrounds
  - Specific programs (my school)
- Availability preference:
  - Weekdays only
  - Weekends only
  - Evenings
  - Flexible

**Actions:**
- Continue → Step 2
- Skip for now (if allowing)

---

**Step 2: Create First Service** `/marketplace/provider/onboarding/service`

**Purpose:** Create at least one service offering

**Service Templates (recommended approach):**
- Show 3-4 common service templates
- User picks one, customizes

**Template Cards:**
1. **Mock Interview**
   - Suggested price: $100-150
   - Suggested duration: 60 min
   - Type: Live
   - Description template provided

2. **Personal Statement Review**
   - Suggested price: $75-100
   - Delivery: 2-3 days
   - Type: Async
   - Description template provided

3. **Application Strategy Session**
   - Suggested price: $75-125
   - Suggested duration: 45 min
   - Type: Live
   - Description template provided

**Custom Service Option:**
- "Create custom service" button → form

**Service Form (after selecting template or custom):**
- Service name (pre-filled if template)
- Description (textarea, template provided, editable)
  - Character count: 100-500 words
  - Tips: What's included, what to expect, who it's for
- Price (number input)
  - Min: $25, Max: $500 (validation)
  - Shows: "You'll earn [X] after 20% platform fee"
- Duration (if live):
  - Dropdown: 30 min, 45 min, 60 min, 90 min, Custom
- Delivery time (if async):
  - Dropdown: 1 day, 2 days, 3 days, 1 week, Custom
- Service type:
  - Live (video call) OR Async (document-based)
- Active/Inactive toggle:
  - Default: Active

**Actions:**
- Create Service → Step 3
- Add Another Service (creates first, then loops back)
- Back → Step 1

**Validation:**
- All required fields filled
- Price within min/max
- Description meets minimum length

---

**Step 3: Set Availability** `/marketplace/provider/onboarding/availability`

**Purpose:** Define when you're available for bookings (live services only)

**Approach:** Request-based (not calendar blocking initially)

**Options:**

**Option A: General Availability (Recommended MVP):**
- "I'll review each booking request individually and coordinate via message"
- Checkbox: "I'm generally available on:"
  - Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday (checkboxes)
- Time preferences:
  - Mornings (6am-12pm)
  - Afternoons (12pm-5pm)
  - Evenings (5pm-9pm)
- Timezone (auto-detected)

**Option B: Set Recurring Schedule (Post-MVP):**
- Weekly calendar grid
- Click to add blocks of availability
- Recurring: "Repeat every week"

**Buffer Settings:**
- "How much advance notice do you need?" (dropdown)
  - 1 day, 2 days, 3 days, 1 week
- "How many hours between bookings?" (dropdown)
  - 1 hour, 2 hours, 4 hours, Same day is fine

**Actions:**
- Continue → Step 4
- Skip (if only offering async services)

---

**Step 4: Payment Setup** `/marketplace/provider/onboarding/payment`

**Purpose:** Connect Stripe account for payouts

**Key Components:**
- Explainer: "Connect your bank account to receive earnings from bookings"
- Security badges (Stripe, SSL, etc.)
- "Your banking details are secured by Stripe and never stored on our servers"
- "Connect with Stripe" button (Stripe Connect OAuth)
  - Opens Stripe onboarding flow in new tab/modal
  - Returns to app after completion

**Payout Info:**
- Frequency: "Payouts occur every Monday for bookings completed the previous week"
- Timing: "Funds released 24-48 hours after session completion"
- Fee: "The CRNA Club takes 20% commission. You keep 80%."
- Example: "For a $100 booking, you earn $80"

**Skip Option:**
- "Set up later" button
- Note: "You can add payment details anytime. You'll need to complete this before your first payout."

**Actions:**
- Connect Stripe → Stripe OAuth flow
- Skip for now → Dashboard

**After Completion:**
- Redirect to Provider Dashboard
- Show welcome modal: "You're all set! Your profile is live."
- Email: "Welcome to the CRNA Club Marketplace"

---

#### 11. Provider Dashboard `/marketplace/provider/dashboard`

**Purpose:** Provider's command center for bookings, earnings, and performance

**User Type:** Approved providers only

**Access Control:**
- Requires approved provider status
- If application pending: Shows "Application Under Review" page
- If not applied: Redirects to application

**Layout:** Dashboard grid with cards

**Top Stats Row (KPI Cards):**

1. **Pending Requests**
   - Count (large number)
   - Urgent indicator if > 12 hours old
   - "View Requests" button

2. **Upcoming Sessions**
   - Count
   - Next session: Date/time
   - "View Calendar" button

3. **This Month's Earnings**
   - Dollar amount
   - Percentage change vs last month
   - "View Details" button

4. **Your Rating**
   - Star rating (large)
   - X reviews
   - "View Reviews" button

**Main Content Area:**

**Booking Requests (if any):**
- "Pending Requests Needing Action" section
- List of request cards:
  - Applicant name (or avatar if anonymous preference)
  - Service requested
  - Requested dates/times
  - Their message (preview, "Read more")
  - Time since requested: "2 hours ago"
  - Actions:
    - Accept (button)
    - Decline (button)
    - Message (link)
- Empty state: "No pending requests"

**Upcoming Sessions (next 3):**
- Session cards:
  - Applicant name
  - Service type
  - Date/time
  - Countdown: "Tomorrow at 3pm" or "In 2 hours"
  - Preparation status (if implemented): "Reviewed applicant's notes"
  - Actions:
    - Join Session (if within window)
    - View Details
    - Message Applicant
- "View all upcoming" link
- Empty state: "No upcoming sessions"

**Performance Card:**
- Response time: "You typically respond in X hours"
- Completion rate: "95% of sessions completed"
- Repeat booking rate: "40% of clients book again"
- Goal progress (gamification):
  - "Complete 5 more sessions to reach [Badge Name]"

**Quick Actions Card:**
- Create New Service
- Update Availability
- View Earnings
- Edit Profile

**Recent Activity:**
- Timeline of recent events:
  - New booking request received
  - Session completed with [Name]
  - Review received (5 stars)
  - Payout processed ($240)
- "View all activity" link

**Data Needed:**
- Provider stats (bookings, earnings, rating)
- Pending booking requests
- Upcoming confirmed bookings
- Recent activity feed
- Performance metrics

**Entry Points:**
- Sidebar navigation: "Provider Dashboard" (if provider)
- After onboarding completion
- After accepting/declining booking
- From email notifications

**Exit Points:**
- Booking management
- Service management
- Earnings page
- Calendar
- Profile edit

**Mobile Considerations:**
- Stack KPI cards 2x2 grid
- Collapse sections with expand/collapse
- Prioritize pending requests at top
- Simplified action buttons

---

#### 12. Manage Services `/marketplace/provider/services`

**Purpose:** View, edit, create, and toggle services

**User Type:** Approved providers

**Key Components:**

**Header:**
- "My Services" title
- "+ Create New Service" button (primary)
- Toggle: "Show Active Only" / "Show All"

**Services Grid:**
- Service cards (similar to applicant view, but with provider actions)
- Each card shows:
  - Service type icon + name
  - Price (with "You earn $X after 20% fee")
  - Duration or delivery time
  - Live/Async badge
  - Active/Inactive status toggle
  - Stats:
    - Total bookings: X
    - Average rating: X.X stars
  - Actions:
    - Edit (button)
    - Duplicate (link)
    - Delete (link, with confirmation)
    - Active/Inactive toggle

**Empty State:**
- "You haven't created any services yet"
- "Create your first service to start earning"
- "Create Service" button

**Data Needed:**
- All provider's services
- Booking stats per service
- Rating per service (if available)

**Actions Available:**
- Create new service → Service form
- Edit service → Service form (pre-filled)
- Duplicate service → Service form (pre-filled, new ID)
- Delete service (confirmation modal)
- Toggle active/inactive
- Preview service (see as applicant would)

**Entry Points:**
- Provider dashboard
- Sidebar: "My Services"
- Onboarding completion
- Email: "Your service is live"

**Exit Points:**
- Service creation/edit flow
- Provider dashboard

---

#### 13. Service Form (Create/Edit) `/marketplace/provider/services/new` or `/:serviceId/edit`

**Purpose:** Create or edit a service offering

**Layout:** Single page form with sidebar preview

**Left Column: Form**

**Basic Info:**
- Service name (text input)
  - Max 60 characters
- Service type (dropdown):
  - Mock Interview
  - Personal Statement Review
  - Resume/CV Review
  - Application Strategy Session
  - School Q&A
  - Clinical Tutoring
  - Custom
- Description (rich text editor or textarea)
  - Toolbar: Bold, Italic, Bullets, Links
  - Character count: 100-500 words
  - Placeholder: "Describe what's included, what to expect, and who this service is for"

**Pricing:**
- Price (number input)
  - Min: $25, Max: $500
  - Shows calculation: "You'll earn $X (80%) after $Y platform fee (20%)"
- Suggested price range (shown as hint): "$75-100 for similar services"

**Delivery:**
- Service format (radio buttons):
  - Live session (video call) OR
  - Async (document/message-based)

**If Live:**
- Duration (dropdown): 30 min, 45 min, 60 min, 90 min, 2 hours, Custom
- Platform (dropdown): Zoom (your link), Google Meet (your link), Platform video (future)

**If Async:**
- Delivery time (dropdown): 1 day, 2-3 days, 3-5 days, 1 week, Custom
- Accepts file uploads: Yes/No toggle
- Max file size: (if yes) 10 MB, 25 MB, 50 MB

**Availability:**
- "I'm currently accepting bookings for this service" (toggle)
- If inactive: "This service is hidden from the marketplace"

**Advanced (collapsible):**
- Max bookings per week (number input): Leave empty for no limit
- Requires consultation before booking (toggle): If yes, applicant must message first
- Custom questions for applicant (future feature)

**Actions:**
- Save & Publish (if new)
- Save Changes (if editing)
- Save as Draft (inactive)
- Cancel
- Delete Service (if editing, with confirmation)

**Right Column: Live Preview**
- "Preview" title
- Shows how service appears to applicants:
  - Service card
  - Updates in real-time as form is filled

**Validation:**
- Required: Name, type, description (min 100 chars), price, format, duration/delivery
- Price within min/max
- Description character count

**Entry Points:**
- My Services: "+ Create New Service"
- Provider onboarding: Step 2
- Provider dashboard: "Create New Service"
- My Services: "Edit" button

**Exit Points:**
- After save: Back to My Services
- Cancel: Back to My Services

---

#### 14. Calendar/Availability Management `/marketplace/provider/calendar`

**Purpose:** Manage availability for live sessions

**User Type:** Providers offering live services

**MVP Approach:** Simple general availability

**Key Components:**

**General Availability:**
- "When are you generally available?" section
- Day selector:
  - Monday through Sunday (checkboxes)
- Time blocks per selected day:
  - Morning (6am-12pm)
  - Afternoon (12pm-5pm)
  - Evening (5pm-10pm)
- Timezone (dropdown, auto-detected)

**Booking Preferences:**
- Advance notice required:
  - Dropdown: Same day, 1 day, 2 days, 3 days, 1 week
- Buffer between bookings:
  - Dropdown: None, 1 hour, 2 hours, 4 hours
- Max bookings per day:
  - Number input: Leave empty for no limit

**Blocked Dates (Optional):**
- "+ Block specific dates" button
- Calendar picker: Select date range
- Reason (optional): "On vacation", "Exams", etc.
- List of blocked date ranges:
  - Each shows: Date range, reason, Delete button

**Auto-Accept Settings (Future):**
- Toggle: "Automatically accept bookings that fit my availability"
- If off: "Review each request manually" (current default)

**Actions:**
- Save Availability
- Preview My Availability (shows applicant view)
- Cancel Changes

**Post-MVP: Calendar Integration:**
- "Connect Google Calendar" button
- "Connect Apple Calendar" button
- Sync availability automatically
- Show calendar view (week/month) with booked slots

**Data Needed:**
- Provider's current availability settings
- Blocked dates
- Upcoming booked sessions (to show on calendar)

**Entry Points:**
- Provider dashboard: "Update Availability"
- Provider onboarding: Step 3
- Sidebar: "Calendar"

**Exit Points:**
- Provider dashboard

---

#### 15. Booking Management `/marketplace/provider/bookings`

**Purpose:** Manage all booking requests and sessions

**User Type:** Providers

**Tab Navigation:**
1. **Requests** - Pending requests needing action (shows count badge)
2. **Upcoming** - Confirmed future sessions
3. **Completed** - Past sessions
4. **All** - Everything

**Filter/Sort:**
- Sort by: Date, Service Type, Status
- Filter by service dropdown

**Booking Cards:**

**Requests Tab:**
- Applicant info:
  - Name/Avatar
  - Member since
  - Link to their profile (if allowing)
- Service requested + price
- Requested dates/times (if live) or "Flexible" or "By [date]" (if async)
- Their message (full text, expandable)
- Requested: "2 hours ago" (with urgency indicator if > 12 hours)
- Actions:
  - Accept Request (button, primary)
  - Decline Request (button, secondary)
  - Message Applicant (button)
  - View Full Details (link)

**Accept Action:**
- Opens modal:
  - Confirm acceptance
  - For live: Select specific date/time from their options OR propose alternative
  - For async: Confirm delivery date
  - Optional message to applicant
  - "Confirm & Accept" button
- After acceptance:
  - Status changes to Upcoming
  - Payment processed
  - Both parties notified

**Decline Action:**
- Opens modal:
  - "Are you sure you want to decline?"
  - Reason (optional dropdown):
    - Not available at requested times
    - Not the right fit for my expertise
    - Too busy right now
    - Other (text input)
  - Optional message to applicant (pre-filled with suggestion)
  - "Decline Request" button
- After decline:
  - Applicant notified
  - Payment not processed
  - Applicant can rebook with another provider

**Upcoming Tab:**
- Applicant info
- Service type
- Confirmed date/time (large, bold)
  - "Tomorrow at 3:00 PM EST"
  - Countdown: "In 18 hours"
- Add to Calendar button
- Meeting link (if live)
- Preparation checklist (optional):
  - [ ] Reviewed applicant's message
  - [ ] Prepared session materials
  - [ ] Sent pre-session email
- Actions:
  - Join Session (button, primary, if within window)
  - Reschedule (link)
  - Cancel Session (link, with policy warning)
  - Message Applicant (button)
  - View Details (link)

**Completed Tab:**
- Applicant info
- Service type
- Completed date
- Earnings: "You earned $80" (after fee)
- Review status:
  - If applicant reviewed: Show their rating + review
  - If you haven't responded: "Leave a review" button
  - If both reviewed: Show both reviews
- Actions:
  - View Details
  - View Reviews
  - Message Applicant

**Data Needed:**
- All provider's bookings (all statuses)
- Applicant info for each booking
- Session details
- Payment/earnings info
- Review data

**Entry Points:**
- Provider dashboard
- Sidebar: "Bookings" (with count badge if requests)
- Email notifications

**Exit Points:**
- Booking detail page
- Accept/decline modals
- Messages
- Session join (external Zoom/Meet link)

**Mobile Considerations:**
- Tabs as horizontal scroll
- Stack booking card content
- Primary action (Accept/Join) as large button
- Secondary actions in dropdown menu

---

#### 16. Earnings Dashboard `/marketplace/provider/earnings`

**Purpose:** View earnings, transaction history, and payout details

**User Type:** Providers

**Key Components:**

**Overview Cards (Top Row):**

1. **Available Balance**
   - Dollar amount (large)
   - Ready to be paid out
   - "Next payout: Monday, Dec 11" (date of next scheduled payout)

2. **This Month's Earnings**
   - Dollar amount
   - X bookings completed
   - Percentage change vs last month (with arrow)

3. **Total Earnings (All Time)**
   - Dollar amount
   - Since member since date

4. **Pending Earnings**
   - Dollar amount
   - Funds held for in-progress bookings
   - "Released after session completion"

**Earnings Chart:**
- Line/bar chart showing earnings over time
- Dropdown: Last 7 days, Last 30 days, Last 3 months, Last 12 months, All time
- Toggle: Gross vs Net (before/after platform fee)

**Transaction History:**
- Table/card list of all transactions
- Columns/fields:
  - Date
  - Applicant name
  - Service type
  - Status (Pending, Completed, Refunded)
  - Gross amount
  - Platform fee (20%)
  - Your earnings (80%)
- Filters:
  - Date range
  - Status
  - Service type
- Export to CSV button

**Payout History:**
- Section: "Payouts to Your Bank"
- List of payouts:
  - Payout date
  - Amount
  - Bank account (last 4 digits)
  - Status (Paid, In Transit, Failed)
  - Transaction ID
- Download receipt/invoice (PDF)

**Payment Method:**
- Connected Stripe account details
- Bank account (last 4 digits)
- "Update payment method" button → Stripe dashboard

**Tax Information:**
- If US provider: "1099 tax form will be issued if earnings > $600/year"
- Download tax documents (if applicable)
- "We're not tax advisors. Consult a tax professional."

**Data Needed:**
- Provider's balance (available, pending)
- All transactions (bookings)
- Payout history
- Stripe account status
- Earnings data for charting

**Actions Available:**
- Filter/sort transactions
- Export transaction history (CSV)
- Download payout receipts
- Update payment method
- View tax documents

**Entry Points:**
- Provider dashboard: "This Month's Earnings" card
- Sidebar: "Earnings"
- Email: "Payout processed"

**Exit Points:**
- Stripe dashboard (external)
- Back to Provider dashboard

---

#### 17. Provider Reviews `/marketplace/provider/reviews`

**Purpose:** View all reviews received and respond

**User Type:** Providers

**Key Components:**

**Summary Section:**
- Overall rating (large star rating + number)
- Total reviews count
- Rating distribution (bar chart):
  - 5 stars: X reviews
  - 4 stars: X reviews
  - etc.
- Breakdown by service type (if offering multiple)

**Review List:**
- Filter/sort:
  - Sort by: Most recent, Highest rated, Lowest rated
  - Filter by service type
  - Filter by rating (All, 5 star, 4 star, etc.)
- Each review card shows:
  - Star rating
  - Applicant name (or "Anonymous Applicant" if they chose privacy)
  - Date
  - Service type + booking date
  - Review text
  - Provider response (if any)
  - "Respond" button (if no response yet)

**Respond to Review:**
- Click "Respond" → opens textarea
- Character limit: 500 characters
- "Responses are public and show professionalism"
- "Submit Response" button
- Can edit response later

**Double-Blind Review System:**
- Note: "Reviews are only visible after both parties submit their reviews or 7 days after session, whichever comes first"
- Shows reviews in "Pending reveal" state if waiting for applicant

**Low Rating Alert:**
- If average drops below 4.0: Alert shown
  - "Your rating is below 4.0. Focus on improving service quality. Providers below 4.0 may be deactivated."

**Data Needed:**
- All reviews received
- Average rating + distribution
- Pending reviews (waiting for reveal)

**Actions Available:**
- Respond to review
- Edit response
- Filter/sort reviews
- Report review (if inappropriate)

**Entry Points:**
- Provider dashboard: "Your Rating" card
- Sidebar: "Reviews"
- Email: "New review received"

**Exit Points:**
- Provider dashboard

---

#### 18. Provider Settings `/marketplace/provider/settings`

**Purpose:** Configure provider account, profile, and preferences

**User Type:** Providers

**Tab Navigation:**
1. **Profile**
2. **Services**
3. **Notifications**
4. **Payments**
5. **Account**

**Profile Tab:**
- Edit all profile fields:
  - Name, photo, bio
  - Program details
  - Tagline, specialties
- "Preview My Profile" button (shows applicant view)
- "Save Changes" button

**Services Tab:**
- Shortcut to /marketplace/provider/services
- Or embedded list here

**Notifications Tab:**
- Email notification preferences (checkboxes):
  - [ ] New booking request
  - [ ] Booking accepted/declined
  - [ ] Session reminder (24 hours before)
  - [ ] Session reminder (1 hour before)
  - [ ] New review received
  - [ ] Payout processed
  - [ ] New message received
- SMS notifications (if implemented):
  - Phone number input
  - Same checkboxes as email

**Payments Tab:**
- Connected Stripe account
- Bank details (last 4 digits)
- "Update payment method" → Stripe
- Payout schedule: "Every Monday"
- Tax forms (if applicable)

**Account Tab:**
- Pause my marketplace presence:
  - Toggle: "Accept new bookings"
  - If off: "Your profile is hidden from search. Existing bookings will continue."
- Deactivate provider account:
  - "Deactivate" button (with confirmation)
  - Note: "This will hide your profile and prevent new bookings. You can reactivate anytime."
- Delete account:
  - "Delete My Account" button (with serious confirmation)
  - Note: "This is permanent and cannot be undone."

**Data Needed:**
- Provider profile
- Notification preferences
- Stripe account status
- Account status (active, paused, deactivated)

**Actions Available:**
- Update profile
- Change notification settings
- Update payment method
- Pause/resume marketplace presence
- Deactivate account

**Entry Points:**
- Provider dashboard
- Sidebar: "Settings"
- Profile edit prompts

**Exit Points:**
- Provider dashboard

---

### Admin Pages

---

#### 19. Provider Applications Admin `/admin/marketplace/applications`

**Purpose:** Review and approve/reject provider applications

**User Type:** Admins only

**Key Components:**

**Filter Tabs:**
1. **Pending** (with count badge)
2. **Approved**
3. **Rejected**
4. **All**

**Application Cards:**
- Applicant name + photo
- Applied date
- CRNA Program + year
- Status badge (Pending, Approved, Rejected)
- Quick preview:
  - Bio (first 100 characters)
  - Service interests
  - Verification document (thumbnail/link)
- Actions:
  - Review (button) → Detail page
  - Quick Approve (if pending)
  - Quick Reject (if pending)

**Data Needed:**
- All provider applications
- Application details
- Verification documents

**Actions Available:**
- View application detail
- Approve/reject
- Filter by status

**Entry Points:**
- Admin sidebar: "Marketplace" → "Applications" (with pending count)
- Email: "New provider application"

**Exit Points:**
- Application detail page

---

#### 20. Application Detail (Admin) `/admin/marketplace/applications/:applicationId`

**Purpose:** Review single application in detail

**Layout:** Two columns

**Left Column: Application Details**
- Full application form data:
  - Personal info
  - Program info
  - Background
  - Bio (full text)
  - Service interests
  - Verification document (downloadable)
- Application timeline:
  - Submitted: [date/time]
  - Reviewed by: [admin name] on [date]
  - Status changes

**Right Column: Admin Actions**

**If Pending:**
- Approve Application (button, primary)
  - Modal: Confirm approval
  - Optional welcome message to send
  - Triggers: Email to applicant, creates provider account, enables onboarding
- Request More Info (button)
  - Modal: What's needed?
  - Sends email to applicant
  - Status changes to "Info Requested"
- Reject Application (button, destructive)
  - Modal: Reason for rejection (internal notes + message to applicant)
  - Triggers: Email to applicant

**If Approved:**
- View Provider Profile (link)
- Deactivate Provider (button)

**If Rejected:**
- View Rejection Reason
- Re-open Application (button)

**Admin Notes:**
- Textarea for internal notes
- Visible only to admins
- Auto-saves

**Data Needed:**
- Complete application record
- Verification documents
- Admin notes/activity log

**Entry Points:**
- Applications list
- Email notification

**Exit Points:**
- Back to applications list
- Provider profile (if approved)

---

#### 21. Marketplace Analytics (Admin) `/admin/marketplace/analytics`

**Purpose:** Monitor marketplace health and performance

**User Type:** Admins

**Key Metrics Dashboard:**

**Financial Metrics:**
- GMV (Gross Merchandise Value): Total transaction volume
- Platform Revenue: GMV × 20%
- Month-over-month growth
- Average transaction value
- Top earning providers

**Marketplace Health:**
- Total active providers
- Total active applicants (who have browsed)
- Liquidity: Average time to first booking for new providers
- Repeat booking rate
- Review completion rate
- Average rating across platform

**Supply Metrics:**
- Providers by program
- Providers by service type
- Provider retention (% still active after 3 months)
- Average bookings per provider
- Top providers (by bookings, earnings)

**Demand Metrics:**
- Total bookings (all time, this month)
- Bookings by service type
- Average booking value
- Repeat customers (% who book 2+ times)

**Quality Metrics:**
- Average rating
- % of providers with 4.5+ stars
- Response time (average time to accept/decline request)
- Completion rate (% of bookings successfully completed)
- Dispute rate

**Charts & Graphs:**
- Bookings over time (line chart)
- Revenue over time (line chart)
- Service type distribution (pie chart)
- Rating distribution (histogram)
- Provider growth (line chart)

**Export:**
- Export all data to CSV
- Date range selector

**Entry Points:**
- Admin sidebar: "Marketplace" → "Analytics"

---

## Navigation Structure

### Global Navigation (All Users)

**Sidebar Navigation - Applicant View:**
```
Dashboard
My Programs
My Trackers
My Stats
---
School Database
Prerequisite Library
Learning Library
Events
---
Marketplace [NEW]
  → Browse Mentors
  → My Bookings (if any exist, with count badge)
  → Saved Mentors (if any exist)
---
Community
  → Forums
  → Groups
  → Messages
---
Tools
  → GPA Calculator
  → Financial Planner
  → My Documents
---
Settings
```

**Sidebar Navigation - SRNA/Provider View:**

If user is SRNA but NOT approved provider:
```
[Same as applicant view, plus:]
---
Become a Mentor [HIGHLIGHTED]
```

If user is approved provider:
```
[Same as applicant view, replacing Marketplace with:]
---
Marketplace
  → Browse Mentors
  → My Bookings
---
Provider Dashboard [HIGHLIGHTED]
  → Dashboard
  → My Services (with active count)
  → Bookings (with pending requests count badge)
  → Calendar
  → Earnings
  → Reviews (with average rating)
  → Settings
```

**Sidebar Navigation - Admin View:**
```
[Same as applicant view, plus:]
---
Admin
  → Marketplace
    → Applications (with pending count badge)
    → Providers
    → Bookings
    → Disputes (with count badge if any)
    → Analytics
    → Settings
```

### Marketplace-Specific Navigation

**Marketplace Home Top Bar:**
```
[Search bar]   [Filter: Service Type ▼]   [Saved Mentors]   [My Bookings]
```

**Search Results Top Bar:**
```
[Search bar]   [Active Filters: Mock Interview ✕, TX ✕]   [Sort: Recommended ▼]
```

**Provider Dashboard Top Bar:**
```
[Provider Dashboard]   Services   Bookings (3)   Calendar   Earnings   Reviews
```

### Breadcrumbs

**Applicant Pages:**
```
Home > Marketplace
Home > Marketplace > Search Results
Home > Marketplace > [Provider Name]
Home > Marketplace > Book [Service Name]
Home > My Bookings
Home > My Bookings > [Booking #12345]
```

**Provider Pages:**
```
Home > Provider Dashboard
Home > Provider Dashboard > Services
Home > Provider Dashboard > Services > Edit [Service Name]
Home > Provider Dashboard > Bookings
Home > Provider Dashboard > Earnings
```

**Admin Pages:**
```
Home > Admin > Marketplace > Applications
Home > Admin > Marketplace > Application Review
Home > Admin > Marketplace > Analytics
```

### Mobile Navigation

**Bottom Tab Bar (Mobile, when in marketplace):**
```
[Home] [Search] [Messages] [Bookings] [More]
```

**Hamburger Menu (Mobile):**
- Full sidebar navigation collapses into hamburger
- Provider dashboard becomes separate section
- Marketplace gets submenu expansion

---

## Cross-Linking Strategy

### From Existing App to Marketplace

**1. Dashboard Widgets:**

**Applicant Dashboard:**
- "Get Interview-Ready" widget (after reaching milestone 12):
  - "Practice with a mentor who's been through it"
  - CTA: "Browse Mock Interview Mentors"
  - Links to: `/marketplace/category/mock-interview`

- "Find a Mentor at Your Target Programs" widget:
  - Shows 3 mentor cards from user's target programs
  - CTA: "View All Mentors"
  - Links to: `/marketplace/search?programs=[user's target program IDs]`

**SRNA Dashboard (if not yet provider):**
- "Earn Money as a Mentor" widget:
  - "Help applicants and earn $75-150 per session"
  - CTA: "Apply to Become a Provider"
  - Links to: `/marketplace/provider/apply`

**2. Contextual Nudges:**

**After Milestone Completion:**
- Milestone 12 (Interview Prep) complete → Modal:
  - "Great job completing Interview Prep!"
  - "Want to practice with a real SRNA? Book a mock interview."
  - CTA: "Find a Mentor"

**After Submitting Application:**
- Program status changes to "Submitted" → Notification:
  - "Application submitted! While you wait, prepare for interviews."
  - CTA: "Book Mock Interview"

**After Interview Invite:**
- Program status changes to "Interview Invite" → Email + Dashboard banner:
  - "You got an interview! Prepare with a mentor from [School Name]."
  - CTA: "Find [School] Mentors"

**3. From My Programs Page:**

**Target Program Detail:**
- New tab: "Connect with Students"
  - Shows providers from this specific program
  - "Ask questions and get insider tips from current students at [School]"
  - CTA: "View Mentors" → `/marketplace/search?program=[programId]`

**4. From Learning Library:**

**Module Completion:**
- After completing "General Interview Prep" module:
  - "Next step: Practice with a mock interview"
  - CTA: "Book Mock Interview"

**5. From Community:**

**Forum Posts:**
- When user posts question about interviews or essays:
  - Suggested resource in sidebar: "Get 1-on-1 help from an SRNA"
  - CTA: "Browse Marketplace"

**6. From Stats Page:**

**Profile Completion:**
- If profile < 80% complete:
  - "Get help perfecting your resume and profile"
  - CTA: "Book Resume Review"

### From Marketplace Back to App

**1. From Provider Profiles:**

**If provider mentions their program:**
- Link program name → School Profile page
- "Learn more about [School Name]"

**2. From Booking Confirmation:**

**After booking mock interview:**
- "Prepare for your session"
- Suggested actions:
  - Update My Stats (resume section)
  - Review target program details
  - Log practice reflection in EQ Tracker

**3. From My Bookings:**

**After completed session:**
- "Log what you learned"
- Suggested actions:
  - Add notes to target program
  - Update To-Do list
  - Log EQ reflection (if interview prep)

**4. From Provider Dashboard:**

**Link to applicant's info:**
- When accepting booking, show link to applicant's public stats (if they've opted in)
- "View [Applicant]'s programs and goals"

### External Links

**From Marketplace:**
- Join live session → Zoom/Google Meet (external)
- Download receipt → PDF
- Stripe payment setup → Stripe Connect OAuth

**To Marketplace:**
- Email notifications → Deep links to specific bookings, requests, etc.
- Social share → Marketplace home with referral code

---

## Component Inventory

### Reusable Marketplace Components

**Discovery & Browsing:**
1. **MentorCard**
   - Props: mentor (object), variant ('grid' | 'list'), showSaveButton (bool)
   - Displays: photo, name, program, rating, services offered, CTA
   - Actions: Save/unsave, click → profile

2. **ServiceCard**
   - Props: service (object), provider (object), variant ('compact' | 'full')
   - Displays: service type, price, duration, description, provider info
   - Actions: Book now, view provider profile

3. **FeaturedMentorCarousel**
   - Props: mentors (array), title (string)
   - Swipeable carousel of mentor cards

4. **ServiceTypeCard**
   - Props: serviceType (object)
   - Displays: icon, name, description, typical price range, CTA
   - Actions: View category

5. **SearchBar**
   - Props: initialQuery (string), onSearch (function)
   - Full-text search with autocomplete
   - Mobile: Expandable

6. **FilterSidebar**
   - Props: filters (object), activeFilters (object), onChange (function)
   - Collapsible filter groups
   - Mobile: Drawer that slides up

**Booking & Sessions:**
7. **BookingCard**
   - Props: booking (object), variant ('pending' | 'upcoming' | 'completed')
   - Displays: Different content based on status
   - Actions: Status-specific actions (accept, decline, join, review, etc.)

8. **BookingSummaryCard**
   - Props: service (object), provider (object), price (number)
   - Sticky card in booking flow
   - Shows running total, service details

9. **BookingFlowProgress**
   - Props: currentStep (number), totalSteps (number)
   - Linear progress indicator
   - Step labels: Details → Request → Payment

10. **SessionCountdown**
    - Props: sessionDate (Date)
    - Human-readable countdown: "In 2 hours" or "Tomorrow at 3pm"
    - Visual urgency indicator for < 1 hour

**Reviews & Ratings:**
11. **ReviewCard**
    - Props: review (object), showProvider (bool)
    - Displays: rating, text, date, reviewer name, service type
    - Optional: Provider response

12. **RatingBreakdown**
    - Props: ratings (object)
    - Displays: Average + distribution bar chart
    - Clickable bars to filter reviews

13. **StarRating**
    - Props: rating (number), size ('sm' | 'md' | 'lg'), interactive (bool)
    - Read-only or input mode
    - Accessible (keyboard navigation)

14. **LeaveReviewModal**
    - Props: booking (object), onSubmit (function)
    - Star rating input + textarea
    - Character count, validation

**Provider Dashboard:**
15. **ProviderStatCard**
    - Props: title (string), value (string | number), change (number), icon (component)
    - KPI card with trend indicator
    - Click → detail page

16. **BookingRequestCard**
    - Props: booking (object), onAccept (function), onDecline (function)
    - Applicant info, request details, message
    - Prominent accept/decline buttons
    - Urgency indicator

17. **EarningsChart**
    - Props: data (array), timeRange (string)
    - Line/bar chart
    - Responsive, accessible

18. **TransactionTable**
    - Props: transactions (array), filters (object)
    - Sortable, filterable table
    - Mobile: Card view instead of table

**Forms & Inputs:**
19. **PriceInput**
    - Props: value (number), onChange (function), minPrice (number), maxPrice (number)
    - Shows fee calculation: "You earn $X (80%)"
    - Validation

20. **AvailabilitySelector**
    - Props: availability (object), onChange (function)
    - Day/time grid for selecting availability
    - Timezone selector

21. **ServiceTemplateSelector**
    - Props: templates (array), onSelect (function)
    - Grid of service templates
    - Quick start for common services

**Status & Badges:**
22. **ProviderVerifiedBadge**
    - Props: provider (object)
    - Checkmark icon + "Verified SRNA" text
    - Tooltip explaining verification

23. **ServiceTypeBadge**
    - Props: serviceType (string), size ('sm' | 'md')
    - Styled badge with icon
    - Color-coded by type

24. **BookingStatusBadge**
    - Props: status (string)
    - Color-coded badge
    - Pending (yellow), Confirmed (green), Completed (blue), Cancelled (gray)

**Messaging:**
25. **ConversationThread**
    - Props: messages (array), otherUser (object)
    - Message bubbles (sender vs receiver)
    - Timestamp, read receipts

26. **MessageComposer**
    - Props: recipient (object), onSend (function), context (string)
    - Textarea with send button
    - Character counter
    - Attachment support (future)

**Empty States:**
27. **EmptyBookings**
    - Props: variant ('applicant' | 'provider'), tab (string)
    - Contextual empty state
    - CTA to browse marketplace or promote profile

28. **EmptySearchResults**
    - Props: query (string), filters (object)
    - "No results" with suggestions
    - Loosen filters or browse all

**Modals & Overlays:**
29. **AcceptBookingModal**
    - Props: booking (object), onConfirm (function)
    - Select/confirm time slot
    - Optional message to applicant
    - Payment processing indicator

30. **DeclineBookingModal**
    - Props: booking (object), onConfirm (function)
    - Reason dropdown (optional)
    - Optional message
    - Confirmation warning

31. **CancelBookingModal**
    - Props: booking (object), policy (object), onConfirm (function)
    - Shows refund amount based on cancellation policy
    - Reason input
    - Warning about impact on rating

**Admin Components:**
32. **ApplicationReviewCard**
    - Props: application (object), onApprove (function), onReject (function)
    - Full application details
    - Approve/reject/request info buttons

33. **MarketplaceAnalyticsDashboard**
    - Props: data (object)
    - KPI cards + charts
    - Date range selector

---

## Mobile Considerations

### Design Principles
1. **Touch-First:** All interactive elements minimum 44px tap target
2. **Thumb-Friendly:** Primary actions within thumb reach
3. **Simplified:** Reduce cognitive load, prioritize critical info
4. **Progressive Disclosure:** Hide advanced features behind "More" or "Advanced"

### Responsive Breakpoints
```css
/* Tailwind default breakpoints */
sm: 640px   /* Small tablet */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
```

### Mobile-Specific Patterns

**1. Marketplace Home (Mobile):**
- Stack sections vertically
- Service type cards: Horizontal scroll
- Mentor grid: Stack cards vertically (1 column)
- Sticky search bar at top
- Bottom navigation: Home, Search, Bookings, More

**2. Search Results (Mobile):**
- Filters in bottom drawer (slides up)
- Active filters: Horizontal pill scroll with X to remove
- Sort dropdown at top right
- Results: Stack cards vertically
- Infinite scroll (not pagination)

**3. Mentor Profile (Mobile):**
- Hero section: Stack photo and info vertically
- Tabs: Sticky horizontal scroll
- Services: Stack cards vertically
- Bio: "Read more" expansion for long text
- CTAs: Sticky bottom button bar

**4. Booking Flow (Mobile):**
- Full-screen steps (not sidebar)
- Progress indicator at top
- Booking summary: Collapsible at top (tap to expand)
- Continue button: Sticky at bottom
- Back button: Top left

**5. My Bookings (Mobile):**
- Tabs: Horizontal scroll
- Booking cards: Simplified layout
- Actions: Primary button visible, secondary in "..." menu
- Swipe to reveal actions (future enhancement)

**6. Provider Dashboard (Mobile):**
- KPI cards: 2x2 grid
- Pending requests: Priority at top
- Sections: Collapsible accordions
- Bottom tab navigation: Dashboard, Bookings, Services, More

**7. Messaging (Mobile):**
- Full-screen thread
- Composer: Sticky at bottom
- Back button: Top left to inbox
- Native keyboard handling

### Mobile Navigation Patterns

**Primary Navigation (Mobile):**
- Hamburger menu (top left) → Full sidebar
- Bottom tab bar (when in marketplace):
  ```
  [Browse] [Search] [Messages] [Bookings] [Menu]
  ```

**Provider Navigation (Mobile):**
- Bottom tab bar:
  ```
  [Dashboard] [Bookings] [Services] [Earnings] [More]
  ```

### Touch Interactions

**Gestures:**
- Swipe: Navigate between tabs, dismiss modals
- Pull-to-refresh: Reload booking list, search results
- Long-press: Quick actions on booking cards (future)
- Pinch: (Not needed for this app)

**Feedback:**
- Tap: Visual ripple effect on buttons
- Loading: Skeleton screens (not spinners)
- Success: Checkmark animation
- Error: Shake animation + inline message

### Performance Optimizations

**Mobile-Specific:**
1. **Lazy load images:** Mentor photos, service images
2. **Virtual scrolling:** Long lists (search results, bookings)
3. **Defer non-critical JS:** Load payment form only when needed
4. **Optimize images:** Serve WebP, responsive sizes
5. **Cache aggressively:** Mentor profiles, service data (Service Worker)
6. **Prefetch:** Likely next pages (booking flow steps)

### Offline Support (Future)

**MVP: Basic offline messaging:**
- Show cached bookings
- Queue messages to send when online
- Offline indicator banner

**Post-MVP:**
- Full offline mode with sync
- Download mentor profiles for offline viewing

### Accessibility (Mobile)

**Screen Reader Support:**
- Semantic HTML (header, nav, main, section)
- ARIA labels for icon buttons
- Announce dynamic content changes
- Skip navigation links

**Motor Accessibility:**
- Large touch targets (44px minimum)
- Avoid gestures as only interaction method
- Keyboard navigation support (for screen readers)

**Visual Accessibility:**
- High contrast mode support
- Scalable text (no px for font sizes, use rem)
- Color not sole indicator (use icons + text)

---

## Implementation Checklist

### Phase 1: Foundation (Week 1)

**Data & API:**
- [ ] Define marketplace data models (Provider, Service, Booking, Review)
- [ ] Create mock data files
- [ ] Set up Stripe Connect test account
- [ ] Design API contracts (even if mocking)

**Core Components:**
- [ ] Build MentorCard component
- [ ] Build ServiceCard component
- [ ] Build SearchBar component
- [ ] Build FilterSidebar component
- [ ] Build BookingCard component (3 variants)
- [ ] Build ReviewCard + StarRating components
- [ ] Build status badges

**Pages:**
- [ ] Marketplace Home page
- [ ] Search Results page
- [ ] Mentor Profile page

**Navigation:**
- [ ] Add "Marketplace" to sidebar
- [ ] Update routing

### Phase 2: Booking Flow (Week 1-2)

**Components:**
- [ ] Build BookingSummaryCard
- [ ] Build BookingFlowProgress
- [ ] Build PriceInput component
- [ ] Build payment form (Stripe Elements)
- [ ] Build modals (Accept, Decline, Cancel)

**Pages:**
- [ ] Booking flow: Step 1 (Details)
- [ ] Booking flow: Step 2 (Request)
- [ ] Booking flow: Step 3 (Payment)
- [ ] Booking confirmation page
- [ ] My Bookings page (all tabs)
- [ ] Booking Detail page

**Features:**
- [ ] Mock payment processing
- [ ] Email notification triggers (logged, not sent)
- [ ] Booking status state machine

### Phase 3: Provider Experience (Week 2)

**Pages:**
- [ ] Provider Application page
- [ ] Provider Onboarding wizard (4 steps)
- [ ] Provider Dashboard
- [ ] Manage Services page
- [ ] Service Create/Edit form
- [ ] Calendar/Availability page
- [ ] Provider Bookings page
- [ ] Earnings Dashboard
- [ ] Provider Reviews page
- [ ] Provider Settings page

**Components:**
- [ ] Build ProviderStatCard
- [ ] Build BookingRequestCard
- [ ] Build EarningsChart
- [ ] Build TransactionTable
- [ ] Build ServiceTemplateSelector
- [ ] Build AvailabilitySelector

**Features:**
- [ ] Accept/decline booking flow
- [ ] Service creation flow
- [ ] Mock earnings calculations (80% payout)

### Phase 4: Admin & Polish (Week 2-3)

**Admin Pages:**
- [ ] Provider Applications admin page
- [ ] Application Detail review page
- [ ] Marketplace Analytics dashboard

**Components:**
- [ ] Build ApplicationReviewCard
- [ ] Build MarketplaceAnalyticsDashboard

**Polish:**
- [ ] Review system (double-blind logic)
- [ ] All empty states
- [ ] All loading states
- [ ] Error handling
- [ ] Form validation
- [ ] Mobile responsive testing
- [ ] Accessibility audit (keyboard navigation, screen readers)

### Phase 5: Integration & Testing (Week 3)

**Cross-Linking:**
- [ ] Add marketplace widgets to Dashboard
- [ ] Add contextual nudges (milestone completion)
- [ ] Link from My Programs to program-specific mentors
- [ ] Add "Get Help" links from Stats, Trackers

**Testing:**
- [ ] User flow testing: Browse → Book → Complete → Review
- [ ] Provider flow testing: Apply → Onboard → Accept Booking → Earn
- [ ] Admin flow testing: Review application → Approve
- [ ] Mobile testing on real devices
- [ ] Accessibility testing (WCAG 2.1 AA)
- [ ] Performance testing (Lighthouse)

**Documentation:**
- [ ] Update API contracts documentation
- [ ] Component library documentation
- [ ] User-facing help docs/FAQ
- [ ] Provider handbook
- [ ] Admin guide

### Phase 6: Launch Prep (Week 3-4)

**Business Setup:**
- [ ] Finalize provider agreement (legal)
- [ ] Set up real Stripe Connect
- [ ] Configure payout schedule
- [ ] Write refund/cancellation policy
- [ ] Create service templates (descriptions)
- [ ] Write email templates

**Go-to-Market:**
- [ ] Recruit 10-20 beta providers
- [ ] Create provider profiles (white-glove service)
- [ ] Test real bookings end-to-end
- [ ] Create launch announcement
- [ ] Prepare dashboard banners
- [ ] Write blog post/newsletter

**Monitoring:**
- [ ] Set up analytics tracking (Mixpanel, PostHog, etc.)
- [ ] Define success metrics dashboard
- [ ] Create admin alert system (new applications, disputes)

---

## Appendix

### Key Decisions Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Booking Type** | Request-based (provider must accept) | SRNAs are busy students, may not respond instantly. Reduces no-shows. |
| **Commission** | 20% platform fee (provider-side only) | Simple, transparent. Higher than average (12.4%) justified by high curation and built-in audience. |
| **Service Types** | Start with 3: Mock Interview, Essay Review, Strategy Session | Prove demand before adding complexity. |
| **Verification** | Strict (.edu email + enrollment proof + manual review) | Trust is critical. High-stakes services require verified providers. |
| **Pricing** | Provider-set within suggested ranges | Balance autonomy with quality control. Prevents race to bottom. |
| **Reviews** | Double-blind (both submit before reveal) | Prevents feedback extortion, encourages honest reviews. |
| **Calendar** | Manual/flexible initially, integrate later | MVP simplicity. Complex calendar integration can come in Phase 2. |
| **Messaging** | On-platform only (no restrictions on content) | Trust community initially. Monitor for off-platform coordination. Add filters only if needed. |
| **Payment Timing** | Charge at booking request, hold in escrow | Protects both parties. Released after completion or auto-release after 48 hours. |
| **Refund Policy** | Customer-friendly (full refund if declined/cancelled >48hr) | Build trust with applicants. Can tighten if abused. |

### Service Type Definitions

**Mock Interview:**
- **Type:** Live (video call)
- **Duration:** 60 minutes
- **Typical Price:** $100-150
- **What's Included:** Full mock interview simulation, real-time feedback, written notes document, email follow-up with resources

**Personal Statement Review:**
- **Type:** Async (document-based)
- **Delivery:** 2-3 days
- **Typical Price:** $75-100
- **What's Included:** Line-by-line editing, structural feedback, grammar/spelling corrections, 30-min follow-up call (optional)

**Application Strategy Session:**
- **Type:** Live (video call)
- **Duration:** 45 minutes
- **Typical Price:** $75-125
- **What's Included:** Program selection advice, application timeline, prerequisite planning, Q&A

**Resume/CV Review:**
- **Type:** Async (document-based)
- **Delivery:** 1-2 days
- **Typical Price:** $50-75
- **What's Included:** Formatting improvements, content suggestions, CRNA-specific tips, revised document

**School Q&A:**
- **Type:** Live (video call) or Async (messaging)
- **Duration:** 30 minutes (if live)
- **Typical Price:** $40-75
- **What's Included:** Insider tips about specific program, current student perspective, Q&A

**Clinical Tutoring (Future):**
- **Type:** Live (video call)
- **Duration:** 60 minutes
- **Typical Price:** $75-100
- **What's Included:** Pathophysiology, pharmacology, or anatomy review, practice questions, study strategies

### Email Notification Triggers

**Applicant Emails:**
1. Booking request sent (confirmation)
2. Provider accepted booking (with session details)
3. Provider declined booking (with option to find another mentor)
4. Session reminder (24 hours before)
5. Session reminder (1 hour before, with join link)
6. Session completed (leave a review)
7. Review received from provider
8. Message received from provider
9. Booking cancelled (refund details)

**Provider Emails:**
1. New booking request (with applicant's message)
2. Booking accepted confirmation
3. Session reminder (24 hours before)
4. Session reminder (1 hour before)
5. Session completed (leave a review)
6. Review received from applicant
7. Message received from applicant
8. Payout processed (with amount and transaction ID)
9. Application approved (welcome + onboarding link)

**Admin Emails:**
1. New provider application submitted
2. New dispute reported
3. Provider rating dropped below 4.0
4. Unusual activity detected

### Future Enhancements

**Phase 2 (Post-Launch):**
- [ ] Instant booking option (for providers who opt in)
- [ ] Calendar integration (Google Calendar, iCal)
- [ ] Video call integration (built-in, not external Zoom)
- [ ] Service bundles/packages (e.g., "Interview Prep Package" = Mock Interview + Essay Review)
- [ ] Advanced search filters (accepts specific programs, has X experience)
- [ ] Featured providers (paid promotion)
- [ ] Provider referral program (earn bonus for referring other SRNAs)

**Phase 3 (Mature Product):**
- [ ] Smart matching algorithm (recommend providers based on user's programs, goals)
- [ ] Subscription coaching (recurring sessions at discounted rate)
- [ ] Group sessions (one provider, multiple applicants)
- [ ] Document exchange system (secure file sharing)
- [ ] Provider analytics (detailed performance metrics)
- [ ] Applicant success tracking (did they get accepted after using marketplace?)
- [ ] Automated quality control (flag providers with low ratings)
- [ ] Machine learning recommendations (suggest services based on user behavior)

---

**Document Version:** 1.0
**Last Updated:** 2024-12-08
**Next Review:** After Phase 1 implementation

