# Mentor Marketplace Master Plan

> **The CRNA Club - SRNA Mentor Marketplace**
> **Last Updated:** December 8, 2024
> **Status:** Planning Complete - Ready for Development

---

## Executive Summary

Building a two-sided marketplace where **SRNAs** (students in CRNA programs) offer mentoring services to **Applicants** (ICU nurses applying to CRNA school).

### Key Stats
- **Platform Fee:** 20% (provider-side only)
- **Target Launch Providers:** 20-30 SRNAs
- **MVP Timeline:** 6-7 weeks development
- **Phase 1:** Applicants search & book mentors
- **Phase 2:** Applicants post jobs, mentors apply

### Competitive Advantage
The CRNA Club has a **massive advantage** over generic marketplaces:
- Rich applicant data (target programs, academic profile, stage)
- Curated supply (verified SRNAs only)
- Existing community (no cold-start problem)
- Vertical specificity (no Upwork/Fiverr competition)

---

## Documentation Index

All research and specifications are complete. Here's where to find everything:

### This Folder (`/docs/project/marketplace/`)
| Document | Summary |
|----------|---------|
| `README.md` | This file - master plan linking everything |
| `provider-onboarding-flow.md` | **NEW** - Screen-by-screen SRNA onboarding |
| `booking-process-flow.md` | **NEW** - Complete booking state machine |
| `messaging-architecture.md` | **NEW** - Chat/messaging build vs buy |
| `admin-flows-edge-cases.md` | **NEW** - 40+ edge cases, dispute handling |
| `stripe-connect-decisions.md` | Payment/payout/dispute policies |
| `data-architecture.md` | Data fields, matching, ML prep |
| `ai-matching-strategy.md` | Recommendation engine roadmap |
| `non-member-flow.md` | Conversion funnel design |
| `flow-diagrams.md` | Visual user journeys |
| `implementation-checklist.md` | Sprint-ready tasks |
| `sharetribe-research.md` | Two-sided marketplace best practices |
| `quick-reference.md` | TL;DR of marketplace patterns |
| `competitor-analysis.md` | TeachRN competitive intelligence |

### Technical Reference (`/docs/reference/`)
| Document | Summary |
|----------|---------|
| `stripe-connect-implementation-guide.md` | Full payment integration (60+ pages) |
| `stripe-connect-payment-flows.md` | Visual payment flow diagrams |
| `marketplace-page-architecture.md` | All pages, routes, components |

### Related Docs
| Document | Location | Summary |
|----------|----------|---------|
| Marketplace Data Shapes | `/docs/skills/data-shapes.md` | Provider/booking types |
| Data Integration Risks | `/docs/project/data-integration-risks.md` | Schema conflicts |
| Marketplace UX Agent | `/docs/agents/marketplace-ux-researcher.md` | Research agent prompt |

---

## The Two Phases

### Phase 1: Provider-Led Marketplace (MVP)
Applicants search and book SRNAs who offer services.

**Flow:**
```
Applicant → Browse Mentors → View Profile → Book Service → Pay → Session → Review
```

**Services Offered:**
1. **Mock Interview** ($75-150, 45-60 min live)
2. **Essay Review** ($50-100, async 48h turnaround)
3. **Strategy Session** ($75-125, 30-45 min live)
4. **Resume Review** ($40-75, async)
5. **School Q&A** ($30-60, 30 min live)

### Phase 2: Job Posting Flow (Future)
Applicants post their needs, mentors apply with proposals.

**Flow:**
```
Applicant → Post Job → Receive Applications → Select Provider → Book → Pay
```

**Benefits:**
- Higher conversion (applicant initiated)
- Better matching (applicant specifies needs)
- Price discovery (competitive bidding)

---

## Key Architecture Decisions

### 1. Request-Based Booking (Not Instant)
**Why:** SRNAs are busy students with variable schedules
- Applicant requests service + availability preferences
- Provider has 24h to accept/decline
- Payment authorized but not captured until accepted
- Calendar integration optional (Phase 2)

### 2. Commission: 20% Provider-Side
**Why:** Higher than industry (12.4%) because:
- Curated supply (verified SRNAs only)
- Built-in demand (existing member base)
- High-stakes services (career impact)
- Trust/safety features included

**Beta Launch:** 15% for first 20 providers

### 3. Payment: Stripe Connect Express
**Why:** Best balance of control and simplicity
- Quick provider onboarding (Stripe handles verification)
- Platform controls payout timing (escrow pattern)
- 48-hour hold after completion for disputes
- Stripe handles tax reporting (1099s)

### 4. Double-Blind Reviews
**Why:** Industry standard for honest feedback
- Both parties submit reviews independently
- Reviews hidden until both submit
- Prevents retaliation

### 5. Non-Member Access
**Why:** Marketplace as acquisition funnel
- Non-members can browse freely
- Account required to book
- Free account OR trial options at gate
- Target: 20% convert to paid members

---

## SRNA Provider Onboarding

### 3-Stage Progressive Onboarding

**Stage 1: Minimum Viable Profile (5-7 min)** - Go live immediately
- Identity verification (ID + selfie)
- SRNA status verification (.edu email or enrollment proof)
- Basic profile (name, photo, program, bio)
- One service offering
- Stripe Connect setup

**Stage 2: Enhanced Profile (15-20 min)** - Better discoverability
- Extended bio
- Additional services
- Credentials/background
- Detailed availability

**Stage 3: Expert Profile (30+ min)** - Premium positioning
- Video introduction
- Testimonials
- Service packages
- Specializations

### Verification Strategy
1. **Automated:** Government ID via Stripe Identity
2. **Education:** .edu email OR enrollment document upload
3. **Manual:** Admin reviews each application (5-10 min)
4. **Target:** 24-48 hour approval turnaround

---

## Applicant User Journey

### Discovery
- Sidebar navigation: "Find a Mentor"
- Dashboard widget: "Mentors at Your Target Programs"
- Smart nudges: "3 SRNAs at Georgetown offer mock interviews"
- Stage-based prompts: "You're interviewing - book mock interview prep"

### Search & Filter
- Search by keyword
- Filter by: Program, Service Type, Price, Rating, Availability
- "Recommended for You" (target program match)
- "Top Rated" (4.8+ stars)

### Booking Flow (3 Steps)
1. **Details:** Select service, provide context, upload materials (if needed)
2. **Request:** Choose availability preferences, add notes
3. **Payment:** Card authorization (not captured until accepted)

### Post-Booking
- Email confirmation + calendar invite
- Pre-session reminder (24h)
- Session delivery (Zoom for live, async for reviews)
- Review request (both parties)
- Rebooking prompt

---

## AI/ML Matching Strategy

### Phase 1 (MVP): Rule-Based "AI"
No ML needed - just smart logic using existing data:

**Target Program Matching** (highest value)
```javascript
if (applicant.targetPrograms.includes(provider.program)) {
  score += 100; // Show first
}
```

**Composite Ranking Algorithm**
- Target match: 100 points
- ICU background match: 50 points
- Service-stage fit: 20 points
- Rating/reviews: 10-30 points
- Response time: 10 points

**Smart Nudges**
- "Georgetown deadline in 28 days - book essay review"
- "3 SRNAs at your target programs"
- "You're interviewing - try mock interview prep"

### Phase 2 (Months 2-4): Basic ML
After 100+ bookings:
- Collaborative filtering ("users who booked X also booked Y")
- Engagement nudges with timing optimization
- Basic sentiment analysis on reviews

### Phase 3 (Months 12+): Advanced AI
After 500+ bookings, 100+ providers:
- Predictive match scoring
- Dynamic pricing recommendations
- Personalization engine

---

## Database Schema Summary

### Core Tables
```
provider_profiles      # SRNA marketplace profiles
services               # Provider service offerings
bookings               # Transactions
booking_reviews        # Double-blind reviews
messages               # In-platform communication
saved_providers        # Customer favorites
provider_applications  # Before approval
marketplace_analytics  # Event tracking for AI
```

### Phase 2 Tables
```
job_postings           # Applicant-posted needs
job_applications       # Provider proposals
```

**Full schema:** `/docs/reference/marketplace-database-schema.md` (when created from agent output)

---

## Page Structure Summary

### Applicant Pages
- `/marketplace` - Discovery home
- `/marketplace/search` - Search results
- `/marketplace/mentor/:id` - Provider profile
- `/marketplace/book/:serviceId` - Booking flow
- `/marketplace/my-bookings` - Manage bookings
- `/marketplace/messages` - Conversations
- `/marketplace/saved` - Favorited mentors

### Provider Pages
- `/marketplace/provider/apply` - Application
- `/marketplace/provider/onboarding` - Setup wizard
- `/marketplace/provider/dashboard` - Command center
- `/marketplace/provider/services` - Manage offerings
- `/marketplace/provider/calendar` - Availability
- `/marketplace/provider/bookings` - Requests
- `/marketplace/provider/earnings` - Payouts

**Full page specs:** `/docs/reference/marketplace-page-architecture.md`

---

## Launch Strategy

### Pre-Launch (Week 0)
- [ ] Identify 30-40 potential SRNAs (active community members)
- [ ] Personal outreach via email/DM
- [ ] Create "Beta Provider" incentive (15% commission, featured placement)
- [ ] Prepare onboarding white-glove service

### Soft Launch (Weeks 1-2)
- [ ] Onboard first 10-20 providers
- [ ] Announce to subset of engaged members
- [ ] Offer $10 off first booking (launch incentive)
- [ ] Manually facilitate first 20 transactions
- [ ] Collect feedback from every participant

### Full Launch (After Success Criteria Met)
**Criteria:**
- 20+ active providers
- 50+ completed transactions
- 4.5+ average rating
- 40%+ repeat booking rate

**Actions:**
- Newsletter announcement
- Dashboard promotion to all members
- Social media campaign
- Blog post about new feature

---

## Success Metrics

### Financial
- **GMV:** Total transaction value
- **Take Rate:** 20% commission
- **Net Revenue:** GMV × 20% - Stripe fees (~4.5%)

### Marketplace Health
- **Liquidity:** Time to first booking (target: <7 days)
- **Repeat Rate:** % booking again (target: 40-60%)
- **Review Rate:** % leaving reviews (target: 70%+)
- **Provider Retention:** Active at 90 days (target: 70%+)

### Quality
- **Average Rating:** 1-5 stars (target: 4.5+)
- **Completion Rate:** % bookings completed (target: 95%+)
- **Response Time:** Provider reply speed (target: <4 hours)

### Conversion (Non-Members)
- **Free Account:** Marketplace-only signups
- **Free → Trial:** 30% by day 30
- **Trial → Paid:** 60%
- **Overall → Paid:** 20% by day 90

---

## Implementation Timeline

### Week 1: Foundation
- Core components (MentorCard, ServiceCard, etc.)
- Marketplace home page
- Search and filter

### Week 2: Booking Flow
- Provider profile pages
- 3-step booking flow
- Payment integration (Stripe Connect)

### Week 3: Provider Experience
- Application form
- Onboarding wizard
- Dashboard and service management

### Week 4: Platform Features
- Messaging system
- Review system (double-blind)
- My Bookings page

### Week 5: Admin & Polish
- Admin dashboard (approvals, analytics)
- Edge case handling
- Mobile optimization

### Week 6: Integration & Testing
- Cross-linking to main app
- Smart nudges
- End-to-end testing

### Week 7: Launch Prep
- Provider recruitment
- Beta testing
- Analytics verification
- Launch!

**Total Estimated Effort:** ~232 hours (2 developers, 6-7 weeks)

---

## Open Questions

### Business Decisions Needed
1. **Commission rate:** 20% or lower? Beta rate?
2. **Refund policy:** Full refund 24h+ before? Provider cancellation?
3. **Review requirements:** Minimum booking count? Character limit?
4. **Provider limits:** Max services? Max bookings/week?

### Technical Decisions Needed
1. **Video calls:** Zoom integration or in-platform?
2. **Calendar:** Google Calendar API or simple slots?
3. **File storage:** Supabase Storage or S3?
4. **Analytics:** Custom or Mixpanel/Amplitude?

### Launch Decisions Needed
1. **Beta incentive:** 15% commission? Featured placement?
2. **Launch promo:** $10 off? Free first booking?
3. **Member announcement:** Newsletter? In-app banner?
4. **Provider targets:** How many before full launch?

---

## Next Steps

### Immediate (This Week)
1. [ ] Review this master plan
2. [ ] Make key business decisions (questions above)
3. [ ] Approve page structure and database schema
4. [ ] Identify first 10 SRNA outreach targets

### Development Start (Week 1)
1. [ ] Set up Stripe Connect test account
2. [ ] Create marketplace components
3. [ ] Build search/discovery pages
4. [ ] Begin provider onboarding flow

### Ongoing
1. [ ] Weekly progress reviews
2. [ ] Provider recruitment (parallel to dev)
3. [ ] User testing with real SRNAs
4. [ ] Iterate based on feedback

---

## Document Change Log

| Date | Change | Author |
|------|--------|--------|
| Dec 8, 2024 | Initial comprehensive research complete | Claude |

---

## Related Documents

**In this folder:**
- `sharetribe-research.md` - Marketplace patterns
- `ai-matching-strategy.md` - AI/ML strategy
- `non-member-flow.md` - Conversion funnel
- `implementation-checklist.md` - Sprint tasks

**Technical reference:**
- `/docs/reference/stripe-connect-implementation-guide.md` - Payment integration
- `/docs/reference/marketplace-page-architecture.md` - Page specs

**Other:**
- `/docs/skills/data-shapes.md` - Data structures

