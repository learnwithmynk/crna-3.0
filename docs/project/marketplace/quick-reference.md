# Marketplace Quick Reference Guide

> TL;DR of the full ShareTribe research report - actionable insights for building the CRNA Club marketplace

---

## 🎯 Core Recommendation

**Build a curated, high-trust service marketplace using ShareTribe's proven patterns, adapted for the CRNA community's unique advantages.**

---

## 📊 Key Numbers

| Metric | Recommendation | Why |
|--------|---------------|-----|
| **Take Rate** | 20-25% | Industry avg is 12.4%, but high curation justifies premium |
| **Beta Commission** | 15% for first 20 providers | Attract early supply |
| **Launch Providers** | 10-20 SRNAs | Quality over quantity |
| **First Services** | 3 types | Mock Interview, Essay Review, Strategy Session |
| **Target Review Rate** | 70%+ | Reviews build trust for next transactions |
| **Repeat Booking Target** | 40-60% | Indicates product-market fit |

---

## 🚀 Solving the Chicken-and-Egg Problem

**The Challenge:** Need providers to attract customers, need customers to attract providers.

**Solution Stack (Use All):**

1. **Supply First** ✅
   - Providers have bigger incentive (revenue stream)
   - Recruit 10-20 SRNAs before promoting to applicants
   - Offer beta incentive: 15% vs 20% commission

2. **Leverage Existing Community** ✅
   - You already have supply AND demand
   - Identify helpful SRNAs already active in forums
   - Promote to engaged members first

3. **Start Tiny** ✅
   - Phase 1: Only 3 service types
   - Phase 1: Only verified SRNAs from known programs
   - Expand once PMF proven

4. **Manual First Transactions** ✅
   - Admin matches first 10-20 bookings
   - Ensure exceptional quality
   - Builds initial reviews

5. **Built on Existing Product** ✅
   - You already have value (trackers, programs, learning)
   - Marketplace is layer on top
   - Lower risk than standalone marketplace

---

## 📐 Core Architecture (ShareTribe Model)

### Entities
```
Users (2 types)
  ├── SRNAs (Providers)
  └── Applicants (Customers)

Services (Listings)
  ├── Title, description, price
  ├── Service type (mock interview, essay review, etc.)
  └── Duration/deliverables

Bookings (Transactions)
  ├── Status: pending → confirmed → completed
  ├── Payment held in escrow
  └── Auto-release after completion

Reviews (Double-Blind)
  ├── Both parties review each other
  ├── Hidden until both submit
  └── Prevents feedback extortion

Messages
  ├── On-platform only (initially)
  └── Email notifications
```

### Transaction Flow
```
1. Customer browses providers/services
2. Customer books (instant or request)
3. Payment held by Stripe
4. Service delivered (live session or async)
5. Customer confirms OR auto-release after 24-48 hours
6. Both leave reviews (double-blind)
7. Payment released to provider (minus 20% commission)
```

---

## 🔒 Trust & Safety Stack

| Layer | Implementation | Priority |
|-------|---------------|----------|
| **SRNA Verification** | .edu email + enrollment proof + manual review | CRITICAL |
| **Payment Escrow** | Stripe holds until completion | CRITICAL |
| **Double-Blind Reviews** | Both parties review, hidden until both submit | HIGH |
| **Refund Policy** | Customer-friendly (full refund if not delivered) | HIGH |
| **Quality Monitoring** | Providers < 4.0 stars = reviewed | MEDIUM |
| **Response Time** | Must respond < 24 hours | MEDIUM |
| **Dispute Resolution** | Admin review within 72 hours | MEDIUM |

---

## 💰 Pricing Strategy

### Commission Structure (Recommended)

**20% flat commission (provider-side only)**

**Rationale:**
- ✅ Higher than average (12.4%) justified by high curation
- ✅ Lower than Uber/Fiverr (25-30%) to attract SRNAs
- ✅ Simple (no complexity)
- ✅ Transparent

**Beta Pricing:**
- First 20 providers: 15% for 3 months
- Clearly communicate it's promotional
- Standard rate after beta period

**Service Pricing (Provider-Set):**
- Mock Interview: $75-150 (45-60 min)
- Essay Review: $50-100 (async)
- Strategy Session: $75-125 (30-45 min)
- Resume Review: $40-75 (async)

Provide suggested ranges, let providers choose within reason.

---

## 🎨 MVP Feature Set

### Must Have (Phase 1)
- [ ] Provider profiles (name, bio, program, photo, stats)
- [ ] SRNA verification system (admin approval)
- [ ] Service listings (3 types)
- [ ] Request-based booking flow
- [ ] Messaging system (on-platform)
- [ ] Payment processing (Stripe Connect)
- [ ] Escrow + auto-release
- [ ] Review system (double-blind)
- [ ] Admin dashboard (approvals, bookings, disputes)
- [ ] Email notifications (booking, completion, review)

### Nice to Have (Phase 2)
- Calendar integration (Google Calendar)
- Instant booking option
- Advanced search filters
- Provider analytics dashboard
- Featured providers
- Service recommendations

### Future (Phase 3)
- Service bundles/packages
- Subscription coaching
- Video call integration (built-in)
- Document exchange system
- Provider referral program
- Smart matching algorithm

---

## 🛡️ Preventing Disintermediation (Platform Leakage)

**Risk:** After first booking, provider and customer go direct to avoid 20% fee.

**Prevention (Don't Restrict, Add Value):**

### For Providers
✅ Built-in audience (don't have to find customers)
✅ Payment processing (no chasing invoices)
✅ Reputation building (reviews only on platform)
✅ Booking management (automated)
✅ Community integration (forums, job board access)

### For Customers
✅ Quality assurance (verified SRNAs only)
✅ Payment protection (refund if issues)
✅ Easy rebooking (one click)
✅ Discovery (find new providers)
✅ Trust signals (reviews, ratings)

### Technical (Light Touch Initially)
- Start: Allow open communication (trust community)
- Monitor: Track messages for email/phone sharing attempts
- Later: Add filters only if disintermediation is proven issue
- Never: Don't be heavy-handed, community goodwill matters

**Key Metric:** Monogamous transactions < 30% (same buyer-seller pairs)

---

## 👥 Provider Onboarding Flow

### Step 1: Application (3 min)
- Name, email, photo
- CRNA program, year
- Brief bio (50-100 words)
- .edu email verification

### Step 2: Verification (24-48 hours admin review)
- Confirm enrollment
- Review profile quality
- Approve or request changes

### Step 3: First Service (5 min)
- Choose service type from template
- Customize description (or use template)
- Set price (within suggested range)
- Mark live vs async

### Step 4: Availability (2 min for live services)
- Mark general availability OR
- Connect calendar (post-MVP)

### Step 5: Payment Setup (5 min, can defer)
- Connect Stripe account
- Required before first payout

**Total: ~15 minutes active, 24-48 hours approval time**

---

## 📈 Success Metrics to Track

### Financial
- **GMV** (Gross Merchandise Value): Total transaction value
- **Take Rate**: Commission % (20%)
- **Revenue**: GMV × Take Rate
- **LTV:CAC**: Customer lifetime value vs acquisition cost (target > 3:1)

### Marketplace Health
- **Liquidity**: Time to first booking for new providers (target < 7 days)
- **Repeat Booking Rate**: % of customers who book 2+ times (target 40-60%)
- **Review Rate**: % of transactions reviewed (target 70%+)
- **Provider Retention**: % of providers still active after 3 months (target 70%+)

### Quality
- **Average Rating**: Across all providers (target 4.5+)
- **Response Time**: % of messages answered < 24 hours (target 90%+)
- **Completion Rate**: % of bookings successfully completed (target 95%+)
- **NPS**: Net Promoter Score for customers and providers (target 50+)

### Disintermediation Risk
- **Monogamous Transactions**: % repeat same buyer-seller (target < 30%)
- **One-and-Done Rate**: Customers with only 1 booking (target < 40%)
- **Message Filter Hits**: Attempts to share contact info

---

## 🗓️ Launch Timeline

### Week 1-2: Soft Launch (Internal Testing)
- Recruit first 10 providers
- Create profiles (white-glove service)
- Test bookings end-to-end
- Fix critical bugs

### Week 3-4: Beta Launch (Limited Members)
- Announce to subset of engaged members
- Offer $10 off first booking
- Manually facilitate first 20 transactions
- Gather intensive feedback

### Week 5-6: Iteration
- Survey every participant
- Identify friction points
- Refine flows
- Add critical missing features

### Month 2: Full Launch
**Success Criteria First:**
- 20+ providers
- 50+ completed transactions
- 4.5+ average rating
- 40%+ repeat booking rate
- No major bugs

**Then:**
- Announce to all members
- Blog post
- Newsletter promotion
- Dashboard banner
- Social media

---

## ⚠️ Common Mistakes to Avoid

| Mistake | Why Bad | Do Instead |
|---------|---------|------------|
| Launch with <5 providers | Illiquid marketplace, poor customer experience | Start with 10-20 quality providers |
| Instant booking only | Busy SRNAs may not respond fast enough | Start with request-based, add instant later |
| Charge both sides | Feels like hidden fees | Provider-side only (20%) |
| Allow price negotiation | Takes forever, users go off-platform | Fixed pricing within suggested ranges |
| Complex commission tiers | Confusing, hard to manage | Flat 20% to start |
| Skip verification | Quality issues, trust problems | Strict SRNA verification required |
| Restrict communication early | Frustrates users, damages goodwill | Trust first, add restrictions only if needed |
| Auto-release immediately | Providers get paid before service delivered | 24-48 hour hold, customer can dispute |
| Optional reviews | No trust signal for next transactions | Strongly incentivize (gamification, blocks rebooking) |
| Launch all service types | Overwhelming, hard to manage | Start with 3, expand based on demand |

---

## ✅ Pre-Launch Checklist

### Technical
- [ ] All marketplace pages built and tested
- [ ] Stripe Connect integration complete
- [ ] Payment escrow working
- [ ] Email notifications configured
- [ ] Admin dashboard functional
- [ ] Booking flow tested end-to-end
- [ ] Review system tested

### Business
- [ ] Take rate decided (20%)
- [ ] Provider agreement drafted
- [ ] Refund policy defined
- [ ] Support process established
- [ ] FAQ created (provider + customer versions)

### Content
- [ ] Service templates written (3-5 types)
- [ ] Provider handbook created
- [ ] Landing page copy written
- [ ] Email templates configured

### Go-to-Market
- [ ] 10-20 providers recruited
- [ ] Beta pricing announced (15% for first 20)
- [ ] Launch plan documented
- [ ] Feedback collection process ready
- [ ] Success metrics dashboard set up

---

## 🎯 Decision Summary

| Decision | Recommendation | Rationale |
|----------|---------------|-----------|
| **Booking Type** | Request-based initially, instant later | SRNAs are busy, may not respond fast |
| **Commission** | 20% flat (provider-side) | Simple, fair, justified by curation |
| **Service Types** | Start with 3, expand to 6-8 | Prove demand before adding complexity |
| **Verification** | Strict (enrollment proof required) | Trust is critical for high-stakes services |
| **Pricing Control** | Provider-set within suggested ranges | Balance autonomy with quality control |
| **Calendar** | Manual availability initially | Integrate Google Calendar post-MVP |
| **Reviews** | Double-blind, strongly encouraged | Standard best practice, prevents gaming |
| **Messaging** | On-platform only (no restrictions) | Trust community, monitor for issues |
| **Payment Timing** | Charge at booking, hold in escrow | Protects both parties |
| **Refund Policy** | Customer-friendly to start | Build trust, can tighten if abused |

---

## 📚 Key Insights from Research

### From ShareTribe
> "In almost all cases, it makes sense to start building a marketplace's audience from the supply side."

### From NFX (Marketplace Experts)
> "By far the most successful marketplaces out there have started out by focusing on a really, really small niche."

### From Cold Start Research
> "Before having a thousand raving users, you first have to get 100 happy users. And before that, you need 10 satisfied users."

### From Disintermediation Studies
> "You only have two options: increase the value to users such that the value exceeds the fees, or lower the fees."

### From Pricing Research
> "Successful ShareTribe customers average 12.4% commission, with 10% being most common. Range: 5-30%."

---

## 🔗 Next Steps

1. **Review full research report** at `/home/user/crna-club-rebuild/docs/research/sharetribe-marketplace-research.md`

2. **Update data-shapes.md** with marketplace models (already defined, add ProviderApplication, BookingMessage, etc.)

3. **Design marketplace pages** based on page-map.md structure

4. **Build MVP** (4-5 days development time)
   - Provider profiles + verification
   - 3 service types
   - Booking flow
   - Payment integration
   - Reviews

5. **Recruit beta providers** (10-20 SRNAs from community)

6. **Soft launch** and iterate based on feedback

7. **Full launch** after 50 successful transactions

---

**Questions?** See full research report for deep dives on any topic.
