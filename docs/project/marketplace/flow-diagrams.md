# Marketplace Non-Member Flow Diagrams

Quick visual reference for marketplace access flows.

---

## 🎯 Quick Decision Tree

```
Is user logged in?
├─ NO (Public Visitor)
│  ├─ Browsing? → ✅ Allow (full access to browse)
│  ├─ Booking? → 🔒 Show signup modal
│  ├─ Messaging? → 🔒 Show signup modal
│  └─ Saving? → 🔒 Show signup modal
│
└─ YES (Authenticated)
   ├─ Has active subscription (Trial/Paid)?
   │  └─ ✅ Full access (marketplace + platform)
   │
   └─ Free account only?
      ├─ Booking? → ✅ Allow
      ├─ Messaging? → ✅ Allow
      ├─ Platform features? → 🔒 Show trial upsell
      └─ Reviews? → ✅ Allow (if completed booking)
```

---

## 📊 The Three Conversion Paths

### Path 1: Direct to Trial (Recommended)
```
Google → Marketplace → Browse → Book Click
    ↓
Signup Modal: "Free Account or Trial?"
    ↓
Selects "Start 7-Day Free Trial" ⭐
    ↓
Trial Signup Form (with CC)
    ↓
✅ Full platform access immediately
    ↓
Complete booking
    ↓
Explore platform features
    ↓
Trial → Paid conversion (60% target)
```
**Best outcome:** High LTV, using full product

---

### Path 2: Free Then Trial (Common)
```
Google → Marketplace → Browse → Book Click
    ↓
Signup Modal: "Free Account or Trial?"
    ↓
Selects "Continue with Free Account"
    ↓
Quick Signup (no CC)
    ↓
✅ Booking access only
    ↓
Complete booking
    ↓
Post-booking upsell shown
    ↓
Email nurture sequence (14 days)
    ↓
Converts to trial (30% target at 30 days)
    ↓
Trial → Paid (60% target)
```
**Good outcome:** Eventually converts

---

### Path 3: Marketplace Only (Acceptable)
```
Google → Marketplace → Browse → Book Click
    ↓
Creates free account
    ↓
Books service
    ↓
Attends session
    ↓
Books 2nd service (repeat customer)
    ↓
Never converts to trial/paid
```
**Acceptable outcome:** Still revenue (20% commission)

---

## 🔐 Gate Modal Flows

### Booking Gate (Primary)

```
┌────────────────────────────────────────────────────┐
│ User clicks "Book This Service" (not logged in)   │
└─────────────────┬──────────────────────────────────┘
                  ↓
    ┌─────────────────────────────────────┐
    │  MODAL: Create Account to Book     │
    │                                     │
    │  Free Account                      │
    │  • Book mentors                    │
    │  • Message mentors                 │
    │  • Booking history                 │
    │                                     │
    │  OR                                │
    │                                     │
    │  7-Day Free Trial ⭐                │
    │  • Everything above PLUS           │
    │  • 140+ school database            │
    │  • Clinical trackers               │
    │  • Learning modules                │
    │  • Community                       │
    │                                     │
    │  [Start 7-Day Trial] ← Primary     │
    │  [Free Account] ← Secondary        │
    │                                     │
    │  Already have account? [Log In]    │
    └─────────┬───────────┬───────────────┘
              ↓           ↓
         Free Account   Trial
              ↓           ↓
         Quick Signup  Trial Signup
              ↓           ↓
         ✅ Booking    ✅ Booking
         access        + Full access
```

---

### Message Gate (Simpler)

```
┌────────────────────────────────────────────────────┐
│ User clicks "Message [Mentor]" (not logged in)    │
└─────────────────┬──────────────────────────────────┘
                  ↓
    ┌─────────────────────────────────────┐
    │  MODAL: Log In to Message Sarah    │
    │                                     │
    │  Have questions before booking?    │
    │  Create a free account to chat.    │
    │                                     │
    │  [Create Free Account]             │
    │  [Log In]                          │
    └─────────────┬───────────────────────┘
                  ↓
            Free Account Signup
                  ↓
            ✅ Message composer opens
                  ↓
            After sending: Toast upsell
```

---

### Save Gate (Minimal)

```
┌────────────────────────────────────────────────────┐
│ User clicks heart to save (not logged in)         │
└─────────────────┬──────────────────────────────────┘
                  ↓
    ┌─────────────────────────────────────┐
    │  MODAL: Log In to Save             │
    │                                     │
    │  Create free account to save       │
    │  mentors and book later.           │
    │                                     │
    │  [Create Free Account]             │
    │  [Log In]                          │
    └─────────────┬───────────────────────┘
                  ↓
            Quick Signup
                  ↓
            ✅ Mentor auto-saved
```

---

## 🔄 Edge Case Flows

### Already Has Account (Logged Out)

```
User clicks "Book Service"
    ↓
Modal: "Create Account or Log In"
    ↓
User clicks "Already have account? Log In"
    ↓
Login modal
    ↓
After login → Straight to booking ✅
```

---

### Expired Trial User

```
User (expired trial) clicks "Book Service"
    ↓
Check: Logged in? ✅
Check: Has access? ❌ (trial expired)
    ↓
Modal: "Welcome Back!"
    ↓
┌─────────────────────────────────────┐
│  Your trial ended on Nov 15        │
│                                     │
│  Reactivate to continue:           │
│  • Book mentors                    │
│  • Access all tools                │
│                                     │
│  Special: 20% off first month      │
│                                     │
│  [Reactivate] ($21.60)             │
│  [Just Book Service] (free)        │
└─────────────┬───────┬───────────────┘
              ↓       ↓
         Reactivate  Downgrade
         to Paid     to Free
              ↓       ↓
         Full access Booking only
```

---

### Cancelled Subscriber

```
User (cancelled) clicks "Book Service"
    ↓
Check: Previous member? ✅
    ↓
Modal: "We Miss You!"
    ↓
┌─────────────────────────────────────┐
│  Your membership ended Nov 30      │
│                                     │
│  All your data is still here:      │
│  • 5 target programs               │
│  • 12 clinical entries             │
│  • 3 shadow day logs               │
│                                     │
│  [Reactivate] ($27/mo)             │
│  [Just Book Service] (free)        │
└─────────────┬───────┬───────────────┘
              ↓       ↓
         Reactivate  Marketplace
         Full Access Only
```

---

### Toolkit Owner

```
Toolkit owner clicks "Book Service"
    ↓
Check: Has toolkit? ✅
Check: Has marketplace access? Partial
    ↓
Modal: "Book Your First Session"
    ↓
┌─────────────────────────────────────┐
│  As a toolkit owner:               │
│                                     │
│  Option 1: Book this service only  │
│  Keep toolkit + this booking       │
│  No additional cost                │
│                                     │
│  Option 2: Upgrade to full         │
│  Unlimited bookings + all features │
│  Try 7 days free                   │
│                                     │
│  [Book Service] ← Default          │
│  [Start Trial]                     │
└─────────────────────────────────────┘
```

---

## 📧 Email Nurture Timeline

### Free Account → Trial Conversion

```
Day 0: Account Created
├─ Email: Booking confirmation
└─ Tag: Marketplace - Free Account

Day 1: Pre-Session (if live session)
├─ Email: Session reminder + prep tips
└─ Soft CTA: "Track your progress"

Day 2: Post-Session
├─ Email: "How was your session?"
├─ Request review
└─ CTA: "Start tracking clinical skills"

Day 5: Value Showcase
├─ Email: Case study
├─ Feature: School database
└─ CTA: "Get 7 Days Free"

Day 9: Personalized
├─ Email: Based on their booking type
├─ Show relevant features
└─ CTA: "Try Everything Free"

Day 14: Last Touch
├─ Email: Founder story
├─ Offer: 20% off first month
└─ CTA: "Join The CRNA Club"

Conversion Target: 30% by Day 30
```

---

## 📍 User Journey Map

### Journey 1: Fast Converter (Ideal)

```
Day 0
─────
🔍 Google search "CRNA mock interview"
   → Lands on /marketplace
   → Browses mentors (10 min)
   → Clicks profile
   → Reviews build trust
   → Clicks "Book" → Gate modal
   → Chooses "Start Trial" ⭐
   → Signs up (CC required)
   → ✅ Full access granted

Day 1-3
───────
📚 Explores platform
   → Saves 2 programs
   → Logs clinical entry
   → Attends booked session
   → Great experience

Day 5
─────
💡 Realizes value
   → Using trackers daily
   → Active in community
   → Saves 3 more programs

Day 7
─────
📧 Trial reminder: "2 days left"
   → Shows usage stats
   → Clear value demonstrated

Day 8
─────
💳 Converts to paid ✅
   → Lifetime member achieved
```
**Timeline:** 8 days
**LTV:** High
**Channel:** Organic search

---

### Journey 2: Slow Converter (Common)

```
Day 0
─────
💬 Friend referral
   → Lands on specific mentor profile
   → Reads reviews
   → Clicks "Message" → Gate
   → Creates free account (quick)
   → Asks questions
   → Eventually books

Day 3
─────
🎯 Attends session
   → Good experience
   → Gets recommendation to track stuff
   → Sees upsell → Dismisses

Day 5
─────
📧 Email: Case study
   → Clicks → Lands on trial page
   → Not ready → Closes

Day 9
─────
📧 Email: "What are you working on?"
   → Clicks → Reads about trackers
   → Intrigued but busy

Day 14
─────
📧 Email: Special offer (20% off)
   → Decides to try
   → Starts trial ✅

Day 18
─────
📚 Explores platform
   → Starts using features
   → Gaining value

Day 21
─────
💳 Converts to paid ✅
```
**Timeline:** 21 days
**LTV:** High (eventually)
**Channel:** Referral

---

### Journey 3: Marketplace Only (Acceptable)

```
Day 0
─────
🔍 Google: "CRNA essay review"
   → Lands on marketplace
   → Books essay review
   → Creates free account
   → Completes booking

Day 7
─────
📝 Submits essay
   → Gets feedback
   → Excellent experience

Day 10
─────
📧 Trial upsell email
   → Opens → Not interested
   → Just needs essay help

Day 30
─────
📚 Preparing for interviews
   → Returns to marketplace
   → Books mock interview
   → Repeat customer ✅

Day 60
─────
💬 Refers friend
   → Word-of-mouth value ✅

Never converts to trial/paid
─────────────────────────────
Still valuable:
• 2 bookings = $160 GMV
• 20% commission = $32 revenue
• Referral value = additional revenue
• Not using platform costs (trackers/etc)
```
**Timeline:** Ongoing
**LTV:** Medium (marketplace only)
**Channel:** Organic search
**Outcome:** Acceptable ✅

---

## 🎯 Success Metrics Dashboard

### Acquisition Funnel
```
100 Marketplace page views
    ↓ (50% profile click rate)
 50 Provider profile views
    ↓ (40% intent signal - book/message/save)
 20 Gate modal shown
    ↓ (50% signup conversion)
 10 Accounts created
    ├─ 6 Free accounts (60%)
    └─ 4 Trial accounts (40%)
```

### Free → Trial Conversion
```
10 Free accounts created
    ↓
Day 7:  1 converted to trial (10%)
Day 14: 2 more converted (20% cumulative)
Day 30: 3 total converted (30% cumulative) ✅ Target
```

### Trial → Paid Conversion
```
10 Trials started
    ↓
Day 7:  6 converted to paid (60%) ✅ Target
Day 30: 7 total converted (70%)
```

### Overall Marketplace → Paid
```
100 Marketplace visitors
    ↓
 10 Accounts created
    ↓
  6 Free accounts
    ├─ 2 convert to trial (33%)
    │   └─ 1 converts to paid (50%)
    └─ 4 remain free
  4 Trial accounts
    └─ 2 convert to paid (50%)
    ↓
  3 Total paid members from 100 visitors (3% conversion)
+ 4 Marketplace-only customers
───────────────────────────────────
Total value from 100 visitors:
• 3 paid members @ $27/mo = $81/mo recurring
• 4 marketplace customers (avg 2 bookings/yr)
  = 8 bookings @ $32 commission = $256/year
• Total annual value = $1,228 from 100 visitors
```

---

## 🚀 Quick Reference: What Can Non-Members Do?

### ✅ YES (Full Access)
- Browse all mentors
- View full profiles
- Read all reviews
- See all pricing
- Filter/search mentors
- View service descriptions

### 🔒 NO (Requires Account)
- Book a service → Free account minimum
- Message a mentor → Free account minimum
- Save mentors → Free account minimum
- Leave reviews → Must have completed booking
- Access dashboard → Account required
- Access platform features → Trial/Paid only

### 📊 Free Account Gets
- ✅ Book unlimited services
- ✅ Message mentors
- ✅ Save favorites
- ✅ Booking history
- ✅ Leave reviews (post-booking)
- ❌ School database (blurred)
- ❌ Trackers (blurred)
- ❌ Learning library (locked)
- ❌ Community (locked)

---

## 📱 Mobile Considerations

### Mobile Booking Flow
```
Mobile visitor lands on mentor profile
    ↓
Scrolls through reviews
    ↓
Clicks "Book Service" (sticky bottom button)
    ↓
Full-screen modal: Signup options
    ↓
Mobile-optimized signup form
    ↓
Auto-redirects to booking after signup
    ↓
Booking form (mobile-friendly)
    ↓
Payment (Stripe mobile SDK)
    ↓
Confirmation screen
    ↓
Add to calendar (mobile deep link)
```

**Key Mobile Optimizations:**
- Sticky CTAs at bottom
- One-field-at-a-time forms
- Autofill support (email, payment)
- Social login options (Google, Apple)
- Minimal typing required
- Clear progress indicators

---

## End of Quick Reference

For full detailed spec, see: `marketplace-non-member-flow.md`
