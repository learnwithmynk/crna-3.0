# Booking Process Flow

**Created:** December 8, 2024
**Status:** Complete Design Specification

---

## Executive Summary

This document provides the complete specification for the booking process flow, covering:

- Two parallel user journeys (applicant + provider)
- 13 distinct pages/screens
- Complete state machines for bookings and payments
- Notification triggers across all states
- Edge cases with handling strategies

**Key Design Principles:**
1. **Request-based booking** (not instant) - accommodates SRNA schedules
2. **Payment escrow** - protects both parties
3. **Double-blind reviews** - ensures honesty
4. **Low-friction account creation** - marketplace as acquisition funnel

---

## Applicant Journey Overview

```
Phase 1: DISCOVERY
├── Browse marketplace (no login required)
├── View mentor profiles
├── Account creation gate (on booking action)
│
Phase 2: BOOKING REQUEST
├── Select service
├── Provide context & preferred times
├── Authorize payment (not charged yet)
│
Phase 3: WAITING
├── Provider has 24h to respond
├── Auto-decline if no response
│
Phase 4: CONFIRMATION
├── Provider accepts → Session confirmed
├── Calendar invite sent
│
Phase 5: SESSION
├── Pre-session reminders
├── Join video call / Submit materials
├── Session completion
│
Phase 6: POST-SESSION
├── Payment charged
├── Review exchange (double-blind)
├── Funds released to provider (48h)
```

---

## Booking State Machine

```
                           [Request Submitted]
                                   │
                                   ▼
                      ┌─────────────────────────┐
                      │   pending_acceptance    │
                      │   (24h timeout)         │
                      └─────────────────────────┘
                         │         │         │
                   [Accept]   [Decline]  [Timeout]
                         │         │         │
              ┌──────────┘         │         └──────────┐
              ▼                    ▼                    ▼
     ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
     │  confirmed  │      │  declined   │      │   expired   │
     └─────────────┘      │  (terminal) │      │  (terminal) │
              │           └─────────────┘      └─────────────┘
              │
              ├──────[Cancel]──────┐
              │                    ▼
              │           ┌─────────────┐
              │           │  cancelled  │
              │           │  (terminal) │
              │           └─────────────┘
              │
              ▼
     ┌─────────────┐
     │ in_progress │  (session started)
     └─────────────┘
              │
              ▼
     ┌─────────────┐
     │  completed  │  (payment charged)
     └─────────────┘
              │
              ├──────[Dispute within 48h]───┐
              │                              ▼
              │                     ┌─────────────┐
              │                     │  disputed   │
              │                     └─────────────┘
              │                              │
              │                     [Resolution]
              │                              │
              ▼                              ▼
     ┌─────────────┐              ┌─────────────┐
     │   settled   │              │   settled   │
     │  (terminal) │              │  (terminal) │
     └─────────────┘              └─────────────┘
```

---

## Screen-by-Screen: Applicant Side

### 1. Browse Marketplace (`/marketplace`)

**Purpose:** Discover mentors without login

**Layout:**
- Search bar + filters (sidebar)
- Mentor card grid

**Filters:**
- Service Type (mock interview, essay review, etc.)
- Program (dropdown of schools)
- Price Range ($0-200 slider)
- Rating (4+ stars)
- Availability (Today, This week, Flexible)

**Mentor Card:**
```
┌───────────────────────────────────┐
│ [Avatar] Sarah Chen               │
│          Georgetown CRNA          │
│                                   │
│ ★★★★★ 4.8 (23 reviews)           │
│                                   │
│ Mock Interview • Essay Review     │
│ $75-150                           │
│                                   │
│ [View Profile]                    │
└───────────────────────────────────┘
```

---

### 2. Mentor Profile (`/marketplace/mentor/:id`)

**Purpose:** Evaluate mentor and their services

**Sections:**
- Header: Avatar, name, program, rating, response time
- Bio: Extended biography and background
- Experience: Quick facts (ICU type, years, certifications)
- Services: Available services with prices
- Reviews: Past applicant reviews

**Service Card:**
```
┌───────────────────────────────────┐
│ 🎤 Mock Interview - Technical     │
│                                   │
│ $100 • 60 minutes                 │
│                                   │
│ "1-on-1 simulated interview with  │
│ feedback on your responses..."    │
│                                   │
│ [Book This Service]               │
└───────────────────────────────────┘
```

**Gating:** Clicking "Book This Service" requires account

---

### 3. Booking Step 1: Service & Context (`/marketplace/book/:serviceId`)

**Purpose:** Select service and provide context

**Fields:**
- Service summary (pre-selected)
- Context textarea: "Describe what you want to work on..."
- Materials upload: PDF, DOCX, TXT, images (25MB max)

**Navigation:** [Back to Mentor] [Next Step]

---

### 4. Booking Step 2: Choose Time (`/marketplace/book/:serviceId?step=2`)

**Purpose:** Propose available times

**Fields:**
- Calendar picker (next 30 days)
- Time slot selection (30-min increments)
- Timezone (auto-detected)
- Add up to 3 time preferences
- Scheduling notes (optional)

**Price Breakdown:**
```
Service cost: $100
Platform fee: $0
Total: $100

ℹ️ You'll authorize this amount now.
   Charged after service is delivered.
```

---

### 5. Booking Step 3: Review & Payment (`/marketplace/book/:serviceId?step=3`)

**Purpose:** Confirm details and authorize payment

**Sections:**
- Request summary (mentor, service, context, times)
- Payment form (Stripe Elements)
- Terms checkbox

**Payment Flow:**
1. Tokenize card with Stripe
2. Create booking with `status: pending_acceptance`
3. Authorize (not charge) the amount
4. Redirect to confirmation

---

### 6. Booking Confirmation (`/marketplace/bookings/:bookingId`)

**Purpose:** Confirm submission and set expectations

```
┌─────────────────────────────────────────┐
│ ✅ Your request has been sent!          │
│                                         │
│ Sarah will respond within 24 hours.     │
│                                         │
│ What Happens Next:                      │
│ 1. Sarah reviews your request           │
│ 2. She accepts or proposes a time       │
│ 3. You receive email confirmation       │
│ 4. Card charged after session complete  │
│                                         │
│ [View My Bookings] [Back to Browse]     │
└─────────────────────────────────────────┘
```

---

### 7. My Bookings (`/marketplace/my-bookings`)

**Purpose:** Track all bookings

**Tabs:** Upcoming, Completed, Saved Mentors

**Booking Card (Pending):**
```
┌─────────────────────────────────────┐
│ ⏳ Awaiting Response                │
│                                     │
│ [Avatar] Sarah Chen                 │
│          Georgetown CRNA            │
│                                     │
│ Mock Interview - Technical          │
│ $100 (authorized, not charged)      │
│                                     │
│ Proposed Times:                     │
│ • Mon Dec 15, 3-5pm EST            │
│ • Wed Dec 17, 10am-12pm EST        │
│                                     │
│ 22 hours left to respond            │
│                                     │
│ [Message] [Details] [Cancel]        │
└─────────────────────────────────────┘
```

**Booking Card (Confirmed):**
```
┌─────────────────────────────────────┐
│ ✅ CONFIRMED                        │
│                                     │
│ [Avatar] Sarah Chen                 │
│          ★★★★★ 4.8                 │
│                                     │
│ Mock Interview - Technical          │
│                                     │
│ 📅 Mon, Dec 15, 2024               │
│ 🕐 3:00 PM - 4:00 PM EST           │
│                                     │
│ [Add to Calendar] [Message]         │
│ [Reschedule] [Cancel]               │
└─────────────────────────────────────┘
```

---

### 8. Session Join Page (`/marketplace/bookings/:id/join`)

**Purpose:** Join live video session

**Layout:**
- Embedded Zoom/Meet window
- Session timer
- Materials sidebar
- End session button

---

### 9. Post-Session Review (`/marketplace/bookings/:id/review`)

**Purpose:** Leave feedback

**Fields:**
- Star rating (1-5, required)
- Written review (optional, 10-1000 chars)
- Helpful tags (Organized, Communicator, Thorough, etc.)
- Anonymous checkbox

**Double-Blind Note:**
> "Your review is private until Sarah reviews too. Once both submit, reviews become public."

---

## Screen-by-Screen: Provider Side

### 1. Provider Dashboard (`/marketplace/provider/dashboard`)

**Widgets:**
- Incoming Requests (count + link)
- Active Bookings (next session)
- This Month's Earnings
- My Rating
- Quick Actions

---

### 2. Incoming Requests (`/marketplace/provider/bookings?tab=incoming`)

**Request Card:**
```
┌────────────────────────────────────────┐
│ ⏰ 18 hours to respond                 │
│                                        │
│ Applicant: M.                          │
│ Target programs: Georgetown, Yale      │
│                                        │
│ Service: Mock Interview - Technical    │
│ Price: $100 (you get $80)              │
│                                        │
│ Context:                               │
│ "I'm preparing for Georgetown..."      │
│                                        │
│ Materials:                             │
│ [📥] essay_draft.pdf                   │
│ [📥] resume.docx                       │
│                                        │
│ Preferred Times:                       │
│ • Mon Dec 15, 3-5pm EST               │
│ • Wed Dec 17, 10am-12pm EST           │
│                                        │
│ [Accept] [Decline] [Propose Alternative]
└────────────────────────────────────────┘
```

**Accept Modal:**
- Choose from applicant's proposed times
- Optional message
- Confirm button

**Decline Modal:**
- Reason dropdown (optional)
- Optional message
- Confirm button

**Propose Alternative Modal:**
- Calendar picker for new times
- Message to applicant
- Send button

---

### 3. Confirmed Bookings (`/marketplace/provider/bookings?tab=confirmed`)

**Views:** Calendar or List

**Booking Card:**
- Countdown to session
- Applicant info (first name only)
- Service details
- Materials downloads
- Join session button (5 min before)
- Reschedule/Cancel options

---

### 4. Earnings Dashboard (`/marketplace/provider/earnings`)

**Summary Cards:**
- Total Earned (all-time)
- Available for Payout
- This Month
- Next Payout Date

**Earnings Table:**
| Date | Service | Applicant | Amount | Commission | You Receive | Status |
|------|---------|-----------|--------|------------|------------|--------|
| Dec 15 | Mock Interview | M. | $100 | $20 | $80 | Released |

---

## Payment State Machine

```
[Request Submitted]
        │
        ▼
┌─────────────────────────┐
│ AUTHORIZATION           │
│ (Card hold, not charge) │
│ Expires in 7 days       │
└─────────────────────────┘
        │
        ├──[Declined/Expired/Cancelled]
        │         │
        │         ▼
        │    Release authorization
        │    (Funds back to applicant)
        │
        └──[Confirmed + Session Complete]
                  │
                  ▼
        ┌─────────────────────────┐
        │ CAPTURE                 │
        │ (Charge card)           │
        │ Funds in platform escrow│
        └─────────────────────────┘
                  │
                  │ 48h dispute window
                  │
                  ├──[Dispute filed]
                  │         │
                  │         ▼
                  │    Admin review
                  │    Refund/Partial/Deny
                  │
                  └──[No dispute]
                            │
                            ▼
        ┌─────────────────────────┐
        │ RELEASED TO PROVIDER    │
        │ Amount: $80 (80%)       │
        │ Platform: $20 (20%)     │
        └─────────────────────────┘
                  │
                  │ Weekly payout (Monday)
                  │
                  ▼
        ┌─────────────────────────┐
        │ PAID OUT                │
        │ To provider bank        │
        └─────────────────────────┘
```

---

## Notification Triggers

| Event | Recipient | Channel | Content |
|-------|-----------|---------|---------|
| Request submitted | Provider | Email, In-app | "New booking request from [Name]" |
| Request accepted | Applicant | Email, In-app | "Sarah accepted your booking!" |
| Request declined | Applicant | Email, In-app | "Provider declined. Refund issued." |
| Request expired | Applicant | Email, In-app | "No response. Automatic refund." |
| 24h before session | Both | Email, In-app | "Your session is tomorrow!" |
| 5 min before session | Both | In-app | "Join now!" |
| Session complete | Both | Email | "Leave a review" |
| Review submitted | Other party | Email | "Review received (hidden until you review)" |
| Both reviewed | Both | Email | "Reviews now visible!" |
| Payout processed | Provider | Email | "Payout of $X processed" |

---

## Edge Cases

### Provider doesn't respond in 24h
- Auto-decline triggered
- Full refund to applicant
- Email to both parties

### Applicant cancels < 24h before
- No refund (per policy)
- Full payout to provider
- Booking marked cancelled

### Provider cancels after accepting
- Full refund to applicant
- Cancellation recorded
- Warning to provider (pattern tracked)

### No-show by provider
- Applicant reports in app
- Full refund + $10 credit
- Provider warning/suspension

### No-show by applicant
- Provider marks no-show
- No refund (applicant forfeits)
- Full payout to provider

### Technical failure (Zoom dies)
- Both parties report
- Admin verifies
- Free rebook or full refund
- Neither party penalized

### Dispute filed within 48h
- Payment held in escrow
- Admin reviews evidence
- Resolution: full/partial refund or deny

---

## Implementation Timeline

| Week | Focus |
|------|-------|
| 1 | Discovery & browsing pages |
| 2 | Booking flow & payments |
| 3 | Provider dashboard & request handling |
| 4 | Booking management (My Bookings) |
| 5 | Reviews & post-session |
| 6 | Disputes & admin |
| 7 | Messaging integration |
| 8 | QA & polish |

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Request to acceptance | < 8 hours |
| Completion rate | > 95% |
| Review rate | > 70% |
| Average rating | > 4.5 |
| Repeat booking rate | > 40% |
| Refund rate | < 10% |
| Dispute rate | < 5% |
