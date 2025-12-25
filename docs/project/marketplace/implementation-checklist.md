# Marketplace Non-Member Flow - Implementation Checklist

Sprint-ready tasks for implementing the marketplace non-member access flow.

---

## 🎯 Overview

**Goal:** Allow non-members to browse marketplace freely, require account creation (free minimum) to book.

**Three Access Levels:**
1. **Non-member (Public):** Browse only
2. **Free Account:** Browse + Book + Message
3. **Trial/Paid:** Everything

---

## Sprint 1: Public Marketplace (Week 1)

### Backend Tasks

- [ ] **API: Public marketplace endpoints**
  - [ ] `GET /api/marketplace/providers` (public, no auth)
  - [ ] `GET /api/marketplace/providers/:id` (public, no auth)
  - [ ] `GET /api/marketplace/services` (public, no auth)
  - [ ] Ensure endpoints work without authentication
  - [ ] Add rate limiting for public endpoints
  - Estimate: 4 hours

- [ ] **API: Provider profile data**
  - [ ] Return full profile data for public requests
  - [ ] Include: bio, services, reviews, ratings, stats
  - [ ] Exclude: email, phone, internal notes
  - Estimate: 2 hours

- [ ] **API: Reviews endpoint (public)**
  - [ ] `GET /api/marketplace/providers/:id/reviews`
  - [ ] Public access to reviews
  - [ ] Paginated response
  - Estimate: 2 hours

### Frontend Tasks

- [ ] **Page: Marketplace Directory (`/marketplace`)**
  - [ ] Create `MarketplacePage.jsx`
  - [ ] SSR/SSG for SEO (if using Next.js) or ensure crawlable
  - [ ] Grid layout of provider cards
  - [ ] Filter sidebar (service type, location, price)
  - [ ] Search functionality
  - [ ] No authentication required
  - Estimate: 8 hours

- [ ] **Page: Provider Profile (`/marketplace/:providerId`)**
  - [ ] Create `ProviderProfilePage.jsx`
  - [ ] SSR/SSG for SEO
  - [ ] Display: Avatar, bio, stats, services, reviews
  - [ ] Public access (no login required)
  - [ ] CTAs: Book, Message, Save (will trigger gates)
  - Estimate: 6 hours

- [ ] **Component: ProviderCard**
  - [ ] Display provider in grid
  - [ ] Show: Avatar, name, rating, price range, service types
  - [ ] Click → Navigate to profile
  - Estimate: 3 hours

- [ ] **Component: ServiceCard**
  - [ ] Display service on provider profile
  - [ ] Show: Title, description, price, duration, reviews
  - [ ] CTA: "Book This Service" button
  - Estimate: 2 hours

- [ ] **Component: ReviewCard**
  - [ ] Display review on provider profile
  - [ ] Show: Rating, text, date, service type
  - [ ] Anonymous or first name only
  - Estimate: 2 hours

### SEO Tasks

- [ ] **Meta tags for marketplace**
  - [ ] Title, description for `/marketplace`
  - [ ] Dynamic title/description for provider profiles
  - [ ] OG tags for social sharing
  - Estimate: 2 hours

- [ ] **Schema markup**
  - [ ] Service schema for providers
  - [ ] Review schema for reviews
  - [ ] Breadcrumb schema
  - Estimate: 3 hours

- [ ] **robots.txt / sitemap**
  - [ ] Allow marketplace pages
  - [ ] Disallow booking flow pages
  - [ ] Generate sitemap for providers
  - Estimate: 1 hour

**Sprint 1 Total Estimate: ~35 hours**

---

## Sprint 2: Authentication Gates (Week 2)

### Backend Tasks

- [ ] **Auth: Free account signup**
  - [ ] `POST /api/auth/signup` endpoint
  - [ ] Minimal fields: name, email, password
  - [ ] No payment info required
  - [ ] Return JWT token
  - [ ] Apply tag: `01. [Lead Gen] - Marketplace - Created Account`
  - Estimate: 4 hours

- [ ] **Auth: Trial signup**
  - [ ] `POST /api/auth/signup/trial` endpoint
  - [ ] Fields: name, email, password, payment info
  - [ ] Create Stripe customer
  - [ ] Start 7-day trial subscription
  - [ ] Apply tag: `02. [Status] - 7 Day Free Trial - Active`
  - [ ] Return JWT token
  - Estimate: 6 hours

- [ ] **Auth: Login endpoint**
  - [ ] `POST /api/auth/login`
  - [ ] Email/password validation
  - [ ] Return JWT with user data + access level
  - Estimate: 2 hours

- [ ] **User model: Access level field**
  - [ ] Add `accessLevel` field: `public` | `free` | `trial` | `paid`
  - [ ] Computed based on tags/subscription status
  - [ ] Include in JWT payload
  - Estimate: 2 hours

- [ ] **Middleware: Check booking access**
  - [ ] Booking endpoints require `free` or higher
  - [ ] Return 401 if not authenticated
  - [ ] Return 403 if insufficient access
  - Estimate: 2 hours

### Frontend Tasks

- [ ] **Modal: BookingGateModal**
  - [ ] Trigger when non-authenticated user clicks "Book"
  - [ ] Show options: Free Account | Trial | Login
  - [ ] Copy as specified in main doc
  - [ ] CTAs clearly differentiated
  - Estimate: 6 hours

- [ ] **Modal: MessageGateModal**
  - [ ] Trigger when non-authenticated user clicks "Message"
  - [ ] Simpler than booking modal
  - [ ] Options: Free Account | Login
  - Estimate: 3 hours

- [ ] **Modal: SaveGateModal**
  - [ ] Trigger when non-authenticated user clicks "Save"
  - [ ] Minimal modal
  - [ ] Options: Free Account | Login
  - Estimate: 2 hours

- [ ] **Form: FreeAccountSignup**
  - [ ] Fields: name, email, password
  - [ ] Validation
  - [ ] Submit to `POST /api/auth/signup`
  - [ ] On success: Store token, redirect to original intent
  - Estimate: 4 hours

- [ ] **Form: TrialSignup**
  - [ ] Fields: name, email, password, card info
  - [ ] Stripe Elements integration
  - [ ] Submit to `POST /api/auth/signup/trial`
  - [ ] On success: Store token, redirect to original intent
  - Estimate: 6 hours

- [ ] **Form: Login**
  - [ ] Fields: email, password
  - [ ] "Forgot password?" link
  - [ ] Submit to `POST /api/auth/login`
  - [ ] On success: Store token, redirect
  - Estimate: 3 hours

- [ ] **Hook: useAuth**
  - [ ] Check if user is logged in
  - [ ] Get user's access level
  - [ ] Methods: login(), logout(), signup()
  - Estimate: 3 hours

- [ ] **Hook: useAccessControl**
  - [ ] canBook() → requires `free` or higher
  - [ ] canMessage() → requires `free` or higher
  - [ ] canSave() → requires `free` or higher
  - [ ] canAccessPlatform() → requires `trial` or `paid`
  - Estimate: 2 hours

**Sprint 2 Total Estimate: ~45 hours**

---

## Sprint 3: Booking Flow (Week 3)

### Backend Tasks

- [ ] **API: Create booking**
  - [ ] `POST /api/bookings`
  - [ ] Require authentication (free account minimum)
  - [ ] Create Stripe payment intent
  - [ ] Store booking in database
  - [ ] Status: `pending`
  - Estimate: 6 hours

- [ ] **API: Confirm booking**
  - [ ] Webhook handler for Stripe payment success
  - [ ] Update booking status: `confirmed`
  - [ ] Send confirmation emails (provider + customer)
  - [ ] Create calendar invite
  - Estimate: 4 hours

- [ ] **API: Get user bookings**
  - [ ] `GET /api/bookings/me`
  - [ ] Return user's booking history
  - [ ] Include: service, provider, date, status
  - Estimate: 2 hours

- [ ] **Email: Booking confirmation (customer)**
  - [ ] Template with booking details
  - [ ] Calendar invite (.ics file)
  - [ ] Provider contact info
  - [ ] Upsell footer (if free account)
  - Estimate: 3 hours

- [ ] **Email: Booking confirmation (provider)**
  - [ ] Template with customer info
  - [ ] Booking details
  - [ ] Link to booking management
  - Estimate: 2 hours

### Frontend Tasks

- [ ] **Page: BookingPage (`/marketplace/:providerId/book/:serviceId`)**
  - [ ] Private route (requires auth)
  - [ ] If not logged in → Redirect to signup
  - [ ] Show service details
  - [ ] Date/time picker (or manual input for async)
  - [ ] Payment form (Stripe)
  - [ ] Submit booking
  - Estimate: 8 hours

- [ ] **Component: DateTimePicker**
  - [ ] For live services
  - [ ] Show provider availability (if available)
  - [ ] Timezone handling
  - Estimate: 6 hours

- [ ] **Component: PaymentForm**
  - [ ] Stripe Elements integration
  - [ ] Card input
  - [ ] Billing details
  - [ ] Submit payment
  - Estimate: 4 hours

- [ ] **Page: BookingConfirmation**
  - [ ] Show after successful booking
  - [ ] Booking details
  - [ ] Calendar invite download
  - [ ] Next steps
  - [ ] Upsell section (if free account)
  - Estimate: 4 hours

- [ ] **Page: MyBookings (`/my-bookings`)**
  - [ ] List user's bookings
  - [ ] Filter: Upcoming | Past
  - [ ] Click booking → Details
  - [ ] CTA to book another
  - Estimate: 5 hours

**Sprint 3 Total Estimate: ~44 hours**

---

## Sprint 4: Free Account Experience (Week 4)

### Backend Tasks

- [ ] **Tag: Marketplace-only tag**
  - [ ] Create tag: `02. [Status] - Marketplace Only - Active`
  - [ ] Auto-apply on free account creation
  - [ ] Remove on trial/paid upgrade
  - Estimate: 1 hour

- [ ] **API: User access check**
  - [ ] `GET /api/user/me/access`
  - [ ] Return: `{ hasMembership, hasBookingAccess, accessLevel }`
  - [ ] Used by frontend to show/hide features
  - Estimate: 2 hours

### Frontend Tasks

- [ ] **Page: Dashboard (Free Account View)**
  - [ ] Limited dashboard for free accounts
  - [ ] Show: Upcoming bookings, saved mentors
  - [ ] Don't show: Trackers, programs, stats (blurred)
  - [ ] Upsell widget for locked features
  - Estimate: 6 hours

- [ ] **Component: PaywallOverlay**
  - [ ] Wrap locked features
  - [ ] Blur content behind
  - [ ] Overlay with upsell message
  - [ ] CTA: "Start Free Trial"
  - Estimate: 3 hours

- [ ] **Component: TrialBanner**
  - [ ] Persistent banner for free accounts
  - [ ] "Try everything free for 7 days"
  - [ ] Dismissible (cookie for 7 days)
  - [ ] Click → Trial signup modal
  - Estimate: 3 hours

- [ ] **Component: PostBookingUpsell**
  - [ ] Show on booking confirmation page
  - [ ] Only for free accounts
  - [ ] Highlight platform features
  - [ ] CTA: "Start 7-Day Trial"
  - Estimate: 3 hours

- [ ] **Navigation updates**
  - [ ] Free accounts see limited nav
  - [ ] Locked items show lock icon
  - [ ] Click locked item → Paywall modal
  - Estimate: 2 hours

**Sprint 4 Total Estimate: ~20 hours**

---

## Sprint 5: Upsell & Nurture (Week 5)

### Backend Tasks

- [ ] **Email Sequence: Marketplace nurture**
  - [ ] Day 0: Booking confirmation (existing)
  - [ ] Day 1: Session reminder (if live)
  - [ ] Day 2: Post-session follow-up + review request
  - [ ] Day 5: Case study + feature showcase
  - [ ] Day 9: Personalized based on booking type
  - [ ] Day 14: Final push with special offer
  - Estimate: 8 hours (all templates)

- [ ] **Tag automation: Email triggers**
  - [ ] Tag: `Marketplace - Created Account` → Starts sequence
  - [ ] Tag: Trial/Paid → Removes from sequence
  - [ ] Tag: Booking completed → Triggers Day 2 email
  - Estimate: 3 hours

- [ ] **Groundhogg/Email tool setup**
  - [ ] Create email sequence in Groundhogg
  - [ ] Set up triggers
  - [ ] Test sequence end-to-end
  - Estimate: 4 hours

### Frontend Tasks

- [ ] **Modal: UpgradePrompt**
  - [ ] Reusable upsell modal
  - [ ] Different variants: post-booking, paywall, general
  - [ ] Copy from main spec
  - [ ] CTAs: Start Trial | Maybe Later
  - Estimate: 4 hours

- [ ] **Toast: Soft Upsell**
  - [ ] After certain actions (save mentor, send message)
  - [ ] Non-intrusive toast notification
  - [ ] "Loving the marketplace? Try the full platform free"
  - Estimate: 2 hours

- [ ] **Component: PricingTable**
  - [ ] Show all three tiers: Free | Trial | Paid
  - [ ] Feature comparison
  - [ ] Highlight trial as recommended
  - [ ] Used in modals and pricing page
  - Estimate: 6 hours

**Sprint 5 Total Estimate: ~27 hours**

---

## Sprint 6: Edge Cases & Polish (Week 6)

### Backend Tasks

- [ ] **Handle: Expired trial user books**
  - [ ] Check user's previous subscription status
  - [ ] If expired trial → Show reactivate option
  - [ ] Allow downgrade to free (marketplace only)
  - Estimate: 3 hours

- [ ] **Handle: Cancelled subscriber books**
  - [ ] Similar to expired trial
  - [ ] Show win-back offer
  - [ ] Option to reactivate or just book
  - Estimate: 3 hours

- [ ] **Handle: Toolkit owner books**
  - [ ] Check if user has toolkit tag
  - [ ] Allow booking (no additional payment)
  - [ ] Option to upgrade to full membership
  - Estimate: 2 hours

- [ ] **Handle: Email already exists (signup)**
  - [ ] Check email on signup attempt
  - [ ] Return friendly error: "Email already registered"
  - [ ] Suggest login instead
  - Estimate: 2 hours

### Frontend Tasks

- [ ] **Modal: ExpiredTrialModal**
  - [ ] Custom modal for expired trial users
  - [ ] Options: Reactivate | Marketplace Only
  - [ ] Special offer: 20% off first month
  - Estimate: 3 hours

- [ ] **Modal: WinBackModal**
  - [ ] For cancelled subscribers
  - [ ] Show what they're missing
  - [ ] Personalized (show their saved data)
  - [ ] Options: Reactivate | Marketplace Only
  - Estimate: 4 hours

- [ ] **Error handling: Payment failure**
  - [ ] Stripe error messages
  - [ ] Allow retry
  - [ ] Save booking as draft
  - [ ] Send email to complete booking
  - Estimate: 3 hours

- [ ] **Error handling: Service unavailable**
  - [ ] If mentor pauses service after signup
  - [ ] Show friendly message
  - [ ] Options: Browse other services, similar mentors
  - Estimate: 2 hours

- [ ] **Mobile optimization**
  - [ ] Test all flows on mobile
  - [ ] Sticky CTAs
  - [ ] One-field forms
  - [ ] Mobile-friendly payment
  - Estimate: 6 hours

**Sprint 6 Total Estimate: ~28 hours**

---

## Sprint 7: Analytics & Testing (Week 7)

### Analytics Tasks

- [ ] **Events: Discovery funnel**
  - [ ] `marketplace_page_viewed`
  - [ ] `provider_profile_viewed`
  - [ ] `service_viewed`
  - Estimate: 2 hours

- [ ] **Events: Conversion funnel**
  - [ ] `book_button_clicked` (with auth status)
  - [ ] `signup_modal_shown` (with trigger)
  - [ ] `signup_option_selected` (free vs trial)
  - [ ] `account_created` (with type)
  - [ ] `booking_completed`
  - Estimate: 3 hours

- [ ] **Events: Upsell tracking**
  - [ ] `trial_upsell_shown` (with location)
  - [ ] `trial_upsell_clicked`
  - [ ] `free_to_trial_converted`
  - [ ] `trial_to_paid_converted`
  - Estimate: 2 hours

- [ ] **Dashboard: Conversion metrics**
  - [ ] Create analytics dashboard
  - [ ] Funnels: Marketplace → Account → Booking → Paid
  - [ ] Cohort analysis: Free → Trial → Paid
  - [ ] Key metrics: CVR, Time to conversion, LTV
  - Estimate: 6 hours

- [ ] **Google Analytics 4 setup**
  - [ ] Set up GA4 property
  - [ ] Custom events configured
  - [ ] Conversion tracking
  - [ ] Ecommerce tracking (bookings)
  - Estimate: 4 hours

### Testing Tasks

- [ ] **QA: Public browsing**
  - [ ] Can view marketplace without login ✅
  - [ ] Can view profiles without login ✅
  - [ ] Can see all reviews/pricing ✅
  - [ ] Cannot book without login ✅
  - Estimate: 2 hours

- [ ] **QA: Free account flow**
  - [ ] Signup works (no CC required) ✅
  - [ ] Can complete booking ✅
  - [ ] Can message mentors ✅
  - [ ] Can save mentors ✅
  - [ ] Cannot access locked features ✅
  - Estimate: 3 hours

- [ ] **QA: Trial flow**
  - [ ] Trial signup works (CC required) ✅
  - [ ] Full access granted ✅
  - [ ] Can book + access platform ✅
  - [ ] Trial countdown shown ✅
  - Estimate: 2 hours

- [ ] **QA: Edge cases**
  - [ ] Expired trial → Reactivate or downgrade ✅
  - [ ] Cancelled user → Win-back flow ✅
  - [ ] Toolkit owner → Booking allowed ✅
  - [ ] Email exists → Friendly error ✅
  - [ ] Payment failure → Retry flow ✅
  - Estimate: 4 hours

- [ ] **QA: Mobile**
  - [ ] All flows work on iOS Safari ✅
  - [ ] All flows work on Android Chrome ✅
  - [ ] Forms are mobile-friendly ✅
  - [ ] Payment works on mobile ✅
  - Estimate: 3 hours

- [ ] **QA: Email sequence**
  - [ ] All 6 emails send correctly ✅
  - [ ] Links work ✅
  - [ ] Unsubscribe works ✅
  - [ ] Sequence stops on conversion ✅
  - Estimate: 2 hours

**Sprint 7 Total Estimate: ~33 hours**

---

## Launch Checklist

### Pre-Launch (1 week before)

- [ ] **Content review**
  - [ ] All copy reviewed and approved
  - [ ] Legal review of terms/privacy
  - [ ] Email templates approved
  - [ ] FAQ created

- [ ] **Staging testing**
  - [ ] End-to-end test on staging
  - [ ] All edge cases tested
  - [ ] Performance testing
  - [ ] Load testing (if high traffic expected)

- [ ] **Analytics verification**
  - [ ] All events firing correctly
  - [ ] GA4 tracking verified
  - [ ] Conversion tracking working
  - [ ] Dashboard showing data

- [ ] **Email testing**
  - [ ] Send test emails to team
  - [ ] Verify all links work
  - [ ] Check mobile rendering
  - [ ] Spam score check

### Launch Day

- [ ] **Deploy to production**
  - [ ] Backend deployed
  - [ ] Frontend deployed
  - [ ] Database migrations run
  - [ ] Environment variables set

- [ ] **Smoke testing**
  - [ ] Marketplace page loads ✅
  - [ ] Provider profiles load ✅
  - [ ] Signup flows work ✅
  - [ ] Booking works ✅
  - [ ] Emails send ✅

- [ ] **Monitor**
  - [ ] Watch error logs
  - [ ] Monitor analytics
  - [ ] Check email delivery rates
  - [ ] Track first bookings

### Post-Launch (First week)

- [ ] **Daily monitoring**
  - [ ] Check analytics daily
  - [ ] Review error logs
  - [ ] Monitor conversion rates
  - [ ] Gather user feedback

- [ ] **Iterate**
  - [ ] Fix critical bugs immediately
  - [ ] Document minor issues for next sprint
  - [ ] A/B test modal copy
  - [ ] Optimize based on data

---

## Total Estimated Effort

| Sprint | Focus | Hours |
|--------|-------|-------|
| Sprint 1 | Public Marketplace | 35 |
| Sprint 2 | Authentication Gates | 45 |
| Sprint 3 | Booking Flow | 44 |
| Sprint 4 | Free Account Experience | 20 |
| Sprint 5 | Upsell & Nurture | 27 |
| Sprint 6 | Edge Cases & Polish | 28 |
| Sprint 7 | Analytics & Testing | 33 |
| **Total** | | **~232 hours** |

**With 2 developers:** ~6-7 weeks
**With 1 developer:** ~12-14 weeks

---

## Dependencies

### External Services
- ✅ Stripe (payment processing)
- ✅ Groundhogg (email sequences)
- ✅ Supabase (if using for database)
- ✅ Google Analytics 4
- ⚠️ Calendar integration (optional, post-MVP)

### Internal Dependencies
- ✅ User authentication system
- ✅ Provider profiles created
- ✅ Services defined
- ✅ Existing subscription system
- ✅ Tag taxonomy (Groundhogg)

---

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Low conversion rate | High | A/B test modal copy, iterate quickly |
| Marketplace-only users don't convert | Medium | Acceptable outcome, still revenue via commission |
| Payment integration issues | High | Thorough testing, have backup payment method |
| Email deliverability | Medium | Use reputable ESP, monitor bounce rates |
| SEO issues (pages not indexed) | Medium | Submit sitemap, test with Google Search Console |
| Mobile UX problems | High | Extensive mobile testing, prioritize mobile-first |

---

## Success Metrics (First 30 Days)

- [ ] 1,000+ marketplace page views
- [ ] 200+ signup modal impressions
- [ ] 50+ free accounts created
- [ ] 30+ trial accounts created
- [ ] 40+ bookings completed
- [ ] 30%+ free → trial conversion (by day 30)
- [ ] 60%+ trial → paid conversion
- [ ] 20%+ marketplace → paid conversion (by day 90)

---

## Post-Launch Optimization (Sprints 8+)

### Phase 2 Features
- [ ] Social login (Google, Apple)
- [ ] Calendar integration (Google Calendar, Outlook)
- [ ] Video call integration (Zoom, Google Meet)
- [ ] Advanced search/filters
- [ ] Provider recommendations (AI matching)
- [ ] Service bundles/packages
- [ ] Referral program

### Optimization Tasks
- [ ] A/B test modal headlines
- [ ] A/B test CTA button copy
- [ ] A/B test pricing presentation
- [ ] Optimize email subject lines
- [ ] Test different upsell timing
- [ ] Personalize email content based on behavior

---

## Notes

- This checklist assumes marketplace basic functionality already exists
- Adjust estimates based on team's familiarity with stack
- Consider parallel work where possible
- Some tasks can be deprioritized for MVP (calendar integration, advanced filters)
- Focus on core flow first: Browse → Gate → Signup → Book → Upsell

---

**Ready to start Sprint 1!**
