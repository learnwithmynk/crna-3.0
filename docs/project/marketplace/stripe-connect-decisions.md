# Stripe Connect Decisions

**Created:** December 8, 2024
**Status:** Business Decisions Document

---

## Executive Summary

This document consolidates all Stripe Connect-related business and technical decisions for the CRNA Club Mentor Marketplace.

---

## Account Type: Express

**Decision:** Use Stripe Connect Express accounts for providers

**Why:**
- Quick onboarding (5-10 min) - Stripe handles identity verification
- Platform controls payout timing (enables escrow pattern)
- Stripe handles tax reporting (1099s)
- Providers can customize their payout bank account
- Less platform liability

**Alternative Considered:** Custom accounts
- More control but requires significant compliance work
- Not worth it for marketplace of this scale

---

## Commission Structure

### Platform Fee: 20%

**Decision:** Take 20% commission from provider earnings

**Why:**
- **Higher than industry average (12.4%)** because:
  - Curated supply (verified SRNAs only)
  - Built-in demand (existing member base)
  - High-stakes services (career impact)
  - Trust/safety features included
  - Customer support for both sides

**Breakdown on $100 service:**
- Applicant pays: $100
- Stripe processing: ~$2.90 (3% + $0.30)
- Platform commission: $20 (20% of $100)
- Provider receives: $77.10 (100 - 2.90 - 20)

### Beta Launch Rate: 15%

**Decision:** Offer 15% commission for first 20 providers ("Founding Mentors")

**Duration:** First 3 months or 50 bookings, whichever comes first

**Why:** Incentivize early adoption, build supply-side liquidity

---

## No Buyer Fee

**Decision:** Do NOT charge applicants a platform fee

**Why:**
- Simplifies pricing (what you see is what you pay)
- Competitive advantage vs TeachRN (which likely has hidden fees)
- Lower friction for booking
- Commission from provider is sufficient for revenue

**Alternative Considered:** 5% buyer fee
- Would increase revenue ~$5 per $100 transaction
- But adds friction and complexity
- Not recommended for MVP

---

## Payment Authorization

### Pre-Authorization Pattern

**Decision:** Authorize payment on booking request, capture on session completion

**Flow:**
1. Applicant submits booking request → Payment authorized (held)
2. Provider accepts/declines within 24h
3. If declined: Authorization released (no charge)
4. If accepted: Authorization continues until session
5. Session completes: Payment captured
6. 48h hold for disputes
7. Funds released to provider

**Authorization Expiry:** 7 days

**Why:** Protects both parties
- Applicant: Money not taken until service confirmed
- Provider: Knows payment is guaranteed before accepting

---

## Payout Schedule

### Weekly Payouts (Mondays)

**Decision:** Process payouts every Monday for completed sessions from previous week

**Why:**
- Standard for marketplaces
- Allows 48h dispute window after completion
- Predictable for providers
- Reduces Stripe payout fees (batching)

**Timeline:**
- Saturday: Session completed
- Sunday: 48h dispute window starts
- Monday: Dispute window closes (if no dispute)
- Tuesday: Payout batch processed
- Wednesday-Friday: Funds arrive in provider bank

**Alternative Considered:** Instant payouts
- Stripe charges extra fee (~1%)
- Doesn't allow dispute window
- Not recommended for MVP

---

## Refund Policy

### Provider Cancellation

| Timing | Applicant Refund | Provider Penalty |
|--------|------------------|------------------|
| 48+ hrs before | 100% | Warning recorded |
| 24-48 hrs | 100% | Warning + visibility impact |
| < 24 hrs | 100% + $10 credit | 7-day suspension |
| No-show | 100% + $10 credit | Quality flag + suspension |

### Applicant Cancellation

| Timing | Refund | Provider Compensation |
|--------|--------|----------------------|
| 48+ hrs before | 100% | $0 |
| 24-48 hrs | 50% | 50% (after platform fee) |
| < 24 hrs | 0% | 100% (after platform fee) |
| No-show | 0% | 100% (after platform fee) |

**Rationale:**
- Protects applicants from provider flakiness
- Respects provider time commitment for late cancellations
- Standard marketplace practice

---

## Dispute Window

### 48-Hour Hold Period

**Decision:** Hold funds in escrow for 48 hours after session completion

**Why:**
- Allows applicants to report issues before payment releases
- Standard practice for service marketplaces
- Balances provider cash flow vs applicant protection

**Dispute Process:**
1. Applicant files dispute within 48h
2. Payment held pending review
3. Provider notified, can respond with evidence
4. Admin reviews within 72h
5. Decision: Full refund, partial refund, or deny

---

## Chargeback Handling

**Decision:** Platform absorbs chargebacks for legitimate transactions

**Why:**
- Providers shouldn't be penalized for Stripe disputes
- Platform has more resources to fight chargebacks
- Builds provider trust

**Process:**
1. Stripe notifies platform of dispute
2. Platform gathers evidence (booking confirmation, messages, etc.)
3. Platform responds to Stripe
4. If lost: Platform absorbs loss (provider keeps money)
5. If pattern of chargebacks: Investigate for fraud

**Exception:** If provider fraud is proven, provider loses payout

---

## Tax Reporting

### 1099 Forms

**Decision:** Stripe handles 1099s for providers earning $600+

**Requirements:**
- Providers submit W-9 information through Stripe
- Stripe files 1099-K for providers earning $600+ annually
- Platform receives 1099 summary for accounting

**Provider Responsibility:**
- Report income on taxes
- Platform doesn't provide tax advice

---

## Identity Verification

### Stripe Identity Integration

**Decision:** Use Stripe Identity for provider verification

**What Stripe Collects:**
- Government-issued ID (driver's license, passport)
- Selfie for facial match
- Address verification
- SSN (for tax reporting)

**Additional Platform Verification:**
- .edu email OR enrollment document
- Admin approval after ID verified

**Verification Timeline:**
- Instant: ~70% of providers
- Manual review: ~30% (24-48 hours)

---

## Currency & Location

### US Only (MVP)

**Decision:** Only US providers and applicants for MVP

**Why:**
- Simplifies compliance (no international tax issues)
- All CRNA programs are US-based
- Stripe Connect Express supports US natively
- Can expand internationally later

**Currency:** USD only

---

## Minimum Payout Amount

### $25 Minimum

**Decision:** Minimum $25 balance required before payout

**Why:**
- Reduces Stripe fees per transaction
- Standard marketplace practice
- Most providers will exceed quickly

**Exception:** On provider deactivation, pay out remaining balance regardless

---

## Fee Display

### Transparent Fee Breakdown

**Decision:** Show fee breakdown clearly during booking

**Applicant View:**
```
Service: Mock Interview
Price: $100.00
Platform fee: $0.00
Total: $100.00
```

**Provider View:**
```
Service: Mock Interview
Price: $100.00
Platform fee: -$20.00 (20%)
You receive: $80.00
```

**Why:** Transparency builds trust, no surprises

---

## Stripe Dashboard Access

### Express Dashboard for Providers

**Decision:** Providers access Stripe Express Dashboard for:
- Bank account management
- Payout history
- Tax documents
- Identity updates

**Platform Dashboard Shows:**
- Earnings summary
- Payout schedule
- Transaction history
- But NOT bank account details

---

## Implementation Checklist

### Stripe Setup Tasks
- [ ] Create Stripe Connect account (platform)
- [ ] Configure Express account settings
- [ ] Set up webhook endpoints
- [ ] Configure payout schedule (weekly, Monday)
- [ ] Set commission rate (20% / 15% beta)
- [ ] Test identity verification flow
- [ ] Test payment authorization and capture
- [ ] Test refund flows
- [ ] Test payout processing
- [ ] Set up dispute notification handling

### Webhook Events to Handle
```
account.updated              # Provider verification changes
payment_intent.succeeded     # Payment captured
payment_intent.payment_failed # Payment failed
charge.refunded              # Refund processed
charge.dispute.created       # Chargeback filed
transfer.created             # Payout initiated
transfer.paid                # Payout completed
transfer.failed              # Payout failed
payout.failed                # Provider bank rejected
```

---

## Open Questions

### For Business Review
1. **Should we offer instant payouts?** (Higher fee, faster cash)
2. **Should beta rate (15%) be permanent for founding mentors?**
3. **What's the max refund we'll issue without admin approval?**
4. **Should providers see applicant's full name before accepting?**

### For Legal Review
1. Terms of service for providers
2. Refund policy language
3. Dispute resolution arbitration clause
4. Tax reporting disclaimer

---

## Change Log

| Date | Change | Reason |
|------|--------|--------|
| Dec 8, 2024 | Initial decisions documented | Pre-development planning |
