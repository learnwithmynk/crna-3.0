# Stripe Connect Implementation Guide for CRNA Club Mentor Marketplace

**Date:** December 7, 2025
**Purpose:** Research-based implementation guide for integrating Stripe Connect into The CRNA Club mentor marketplace where SRNAs offer paid services to Applicants.

---

## Table of Contents

1. [Recommended Connect Account Type](#1-recommended-connect-account-type)
2. [Provider Onboarding Flow](#2-provider-onboarding-flow)
3. [Recommended Payment Flow](#3-recommended-payment-flow)
4. [Implementation Checklist](#4-implementation-checklist)
5. [Edge Cases to Handle](#5-edge-cases-to-handle)
6. [Cost Analysis](#6-cost-analysis)
7. [Quick Reference](#7-quick-reference)

---

## 1. Recommended Connect Account Type

### **Recommendation: Express Accounts**

Express accounts provide the optimal balance for The CRNA Club marketplace based on your specific requirements.

#### Why Express Accounts?

**Pros:**
- **Simplified onboarding:** Stripe handles identity verification and compliance automatically
- **Platform control:** You control payout schedules, branding, and payment flows
- **Provider experience:** SRNAs get access to Express Dashboard (lightweight, 2-page dashboard) to manage their info and view payouts
- **Quick setup:** Moderate integration effort - faster than Custom, more control than Standard
- **US-focused:** Perfect for US-only providers (SRNAs are US-based students)
- **Platform support:** You handle customer support, which aligns with your community model
- **Shared responsibility:** Stripe handles compliance, you handle user experience

**Cons:**
- **Monthly fees:** $2 per active account/month + 0.25% + $0.25 per payout
- **Limited customization:** Less customizable than Custom accounts
- **Stripe branding:** Some Stripe branding visible in onboarding/dashboard

#### Account Type Comparison

| Feature | Standard | **Express** ✅ | Custom |
|---------|----------|---------------|--------|
| **Onboarding** | Provider self-onboards with Stripe | **Stripe handles with platform branding** | Platform builds entire flow |
| **Dashboard Access** | Full Stripe Dashboard | **Lightweight Express Dashboard** | No dashboard (platform builds own) |
| **Integration Effort** | Minimal | **Moderate** | High |
| **Provider Control** | Full control | **Shared control** | Platform has full control |
| **Cost** | $0 | **$2/active account/mo + payout fees** | $2/active account/mo + payout fees |
| **Compliance** | Provider responsible | **Stripe handles** | Platform responsible |
| **Dispute Liability** | Provider responsible | **Platform responsible** | Platform responsible |
| **Best For** | Experienced merchants | **Service marketplaces** | White-label platforms |

**Note:** An account is only "active" in months when payouts are sent, so inactive providers cost nothing.

---

## 2. Provider Onboarding Flow

### Step-by-Step Provider Onboarding Process

#### Step 1: Application & Approval (Platform Side)
Before Stripe onboarding, SRNAs must be approved as providers by your admin team.

**Required from SRNA:**
- Proof of CRNA school acceptance
- Valid nursing license (RN)
- Application form with services they want to offer
- Background check (optional but recommended)

**Your platform:**
- Review application
- Approve/reject provider status
- If approved → trigger Stripe Connect account creation

#### Step 2: Create Stripe Connect Account (API)

```javascript
// Create Express account for approved SRNA
const account = await stripe.accounts.create({
  type: 'express',
  country: 'US',
  email: 'srna@example.com',
  capabilities: {
    card_payments: {requested: true},
    transfers: {requested: true},
  },
  business_type: 'individual', // Most SRNAs will be individuals
  metadata: {
    platform_user_id: 'srna_123',
    user_type: 'srna_provider'
  }
});
```

#### Step 3: Stripe-Hosted Onboarding (Provider Side)

Generate an Account Link to send SRNA to Stripe's onboarding flow:

```javascript
const accountLink = await stripe.accountLinks.create({
  account: account.id,
  refresh_url: 'https://crnaclub.com/provider/onboarding/refresh',
  return_url: 'https://crnaclub.com/provider/onboarding/complete',
  type: 'account_onboarding',
});

// Redirect SRNA to accountLink.url
```

**What Stripe Collects:**
- **Personal Information:** Full legal name, date of birth, phone number
- **Address:** Residential address
- **Tax Information:** Full 9-digit SSN (required after $500K threshold, last 4 before that)
- **Banking Details:** Bank account or debit card for payouts
- **Identity Verification:** Stripe verifies identity automatically
  - May request ID document (driver's license) if auto-verification fails
  - Typical verification time: Instant to 1-2 business days

**Required vs Optional Fields:**
- **Currently Due:** Information required immediately to start accepting payments
- **Eventually Due:** Information required later when hitting certain thresholds
- **Recommendation:** Collect `eventually_due` fields upfront for smoother experience

#### Step 4: Handle Account Updates (Webhooks)

Listen for webhooks to track onboarding status:

```javascript
// Key webhook events
'account.updated' // Account verification status changes
'account.application.authorized' // Provider completed onboarding
'account.application.deauthorized' // Provider disconnected

// Check requirements in webhook handler
if (account.requirements.currently_due.length > 0) {
  // Provider needs to provide more info
  // Send them back to onboarding with new Account Link
}
```

#### Step 5: Verification & Approval

**Time to Approval:**
- **Instant:** 70-80% of providers (auto-verified)
- **1-2 business days:** 15-20% (manual review)
- **3-7 business days:** 5-10% (additional documentation needed)

**Fallback for Verification Issues:**
- If auto-verification fails, Stripe requests ID document upload
- Platform should monitor `account.updated` webhooks for `verification.fields_needed`
- Send provider email: "Additional verification needed" with new Account Link

#### Step 6: Provider Dashboard Access

Once verified, SRNAs can access Express Dashboard to:
- View payout history
- Update banking information
- View transaction details
- Update personal information
- See earnings and fees

**Important:** Express Dashboard is view-only for most operations. Platform controls payment flows.

### UI/UX Recommendations

**Onboarding Progress Indicator:**
```
1. Platform Approval ✅
2. Stripe Account Setup 🔄 (in progress)
3. Verification Pending ⏳
4. Ready to Accept Bookings 🎉
```

**Error Handling:**
- **Account Link Expired:** Links expire after use or 5 minutes - regenerate seamlessly
- **Verification Failed:** Clear messaging: "We need to verify your identity. Please upload a photo of your driver's license."
- **Incomplete Onboarding:** Email reminders after 24h, 3d, 7d with new Account Links

**Mobile Optimization:**
- Stripe's onboarding flow is mobile-responsive
- Test on iOS/Android to ensure smooth experience
- Consider in-app browser vs external browser redirect

---

## 3. Recommended Payment Flow

### **Recommendation: Destination Charges**

Destination charges are ideal for service marketplaces with 1:1 bookings (one applicant books one SRNA).

### How It Works

```
Customer (Applicant) → Platform (CRNA Club) → Provider (SRNA)
```

1. **Applicant books service** (e.g., Mock Interview - $50)
2. **Charge created on platform account** ($50 charge)
3. **Platform takes application fee** ($7.50 = 15%)
4. **Remaining funds transferred to SRNA** ($42.50 minus Stripe fees)

### Visual Money Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    BOOKING: Mock Interview                   │
│                         Price: $50.00                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │   Applicant      │
                    │   Pays $50.00    │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ Platform Account │
                    │   (CRNA Club)    │
                    └──────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
          ┌──────────────────┐  ┌──────────────────┐
          │ Platform Fee     │  │ SRNA Transfer    │
          │ $7.50 (15%)      │  │ $42.50 - fees    │
          └──────────────────┘  └──────────────────┘
                                         │
                                         ▼
                                ┌──────────────────┐
                                │ Stripe Fees      │
                                │ ~$1.48           │
                                │ (2.9% + $0.30)   │
                                └──────────────────┘
                                         │
                                         ▼
                                ┌──────────────────┐
                                │ SRNA Receives    │
                                │ ~$41.02          │
                                └──────────────────┘
```

### When Money Moves

**Option A: Immediate Transfer (Recommended for trust)**
- **Booking created:** Applicant charged $50 immediately
- **Service scheduled:** SRNA sees "Pending earnings: $41"
- **Service completed:** Applicant confirms completion
- **Transfer initiated:** Funds move to SRNA's balance immediately
- **SRNA paid:** According to payout schedule (daily, weekly, or instant)

**Option B: Hold Until Service Complete (Recommended for quality)**
- **Booking created:** Applicant charged $50, held on platform
- **Service completed:** Applicant confirms or 48h auto-confirm
- **Transfer initiated:** Only after confirmation
- **Refund window:** Cancel/refund before transfer

### Implementation Code

```javascript
// Create destination charge with application fee
const paymentIntent = await stripe.paymentIntents.create({
  amount: 5000, // $50.00
  currency: 'usd',
  customer: applicantStripeCustomerId,
  payment_method: paymentMethodId,
  on_behalf_of: srnaConnectedAccountId,
  transfer_data: {
    destination: srnaConnectedAccountId,
    amount: 4250, // $42.50 (85% to SRNA, 15% platform fee)
  },
  application_fee_amount: 750, // $7.50 platform fee (15%)
  metadata: {
    booking_id: 'booking_123',
    service_type: 'mock_interview',
    srna_id: 'srna_456',
    applicant_id: 'applicant_789'
  },
  description: 'Mock Interview with Sarah J.',
  confirm: true,
});
```

### Alternative: Separate Charges and Transfers (SCT)

Use SCT if you need to:
- Split payment to multiple providers (e.g., group coaching session)
- Transfer funds before charging customer (advance payments)
- Don't know provider at time of charge

**Example: Split payment for group session**
```javascript
// Charge customer
const charge = await stripe.charges.create({
  amount: 10000, // $100
  currency: 'usd',
  customer: applicantId,
});

// Transfer to multiple SRNAs
await stripe.transfers.create({
  amount: 4250,
  currency: 'usd',
  destination: srna1AccountId,
});

await stripe.transfers.create({
  amount: 4250,
  currency: 'usd',
  destination: srna2AccountId,
});

// Platform keeps $15 fee (100 - 42.50 - 42.50)
```

**For CRNA Club:** Stick with destination charges unless you add group services later.

---

## 4. Implementation Checklist

### Phase 1: Setup (Week 1)

**Stripe Account Configuration**
- [ ] Create Stripe account (if not already)
- [ ] Enable Stripe Connect in Dashboard
- [ ] Choose Express account type
- [ ] Configure Connect settings
- [ ] Set up OAuth for Connect (optional, for branding)
- [ ] Request production access for Connect

**Platform Branding**
- [ ] Add platform logo/icon to Connect settings
- [ ] Customize brand colors in Stripe Dashboard
- [ ] Set business name and support email
- [ ] Configure statement descriptor (appears on bank statements)

**Webhook Configuration**
- [ ] Create webhook endpoint URL: `https://crnaclub.com/api/webhooks/stripe`
- [ ] Register webhook in Stripe Dashboard for Connect events
- [ ] Configure events to listen for (see list below)
- [ ] Add webhook signature verification to endpoint
- [ ] Test webhook locally with Stripe CLI

### Phase 2: Provider Onboarding (Week 2)

**Database Schema**
- [ ] Add `stripe_connect_account_id` to `srna_providers` table
- [ ] Add `stripe_onboarding_complete` boolean field
- [ ] Add `stripe_charges_enabled` boolean field
- [ ] Add `stripe_payouts_enabled` boolean field
- [ ] Add `stripe_requirements_currently_due` JSON field
- [ ] Add timestamps: `stripe_account_created_at`, `stripe_verified_at`

**API Endpoints**
- [ ] `POST /api/provider/create-connect-account` - Create Express account
- [ ] `GET /api/provider/onboarding-link` - Generate Account Link
- [ ] `GET /api/provider/onboarding-status` - Check requirements
- [ ] `GET /api/provider/dashboard-link` - Generate Express Dashboard link
- [ ] `POST /api/webhooks/stripe` - Handle webhook events

**UI Screens**
- [ ] Provider application form (platform approval)
- [ ] "Start Stripe Setup" page with CTA
- [ ] Onboarding redirect handler (return_url)
- [ ] Onboarding refresh handler (refresh_url)
- [ ] Provider dashboard showing onboarding status
- [ ] Email templates (onboarding incomplete, verification needed, approved)

**Onboarding Flow Logic**
- [ ] Create Express account on platform approval
- [ ] Generate Account Link and redirect provider
- [ ] Handle return_url: check account status
- [ ] Handle refresh_url: regenerate Account Link if expired
- [ ] Monitor `account.updated` webhooks
- [ ] Update provider status when `charges_enabled` = true
- [ ] Send notifications at key milestones

### Phase 3: Payment Processing (Week 3)

**Booking & Payment Flow**
- [ ] Add `stripe_payment_intent_id` to `bookings` table
- [ ] Add `stripe_charge_id` to `bookings` table
- [ ] Add `stripe_transfer_id` to `bookings` table
- [ ] Add `platform_fee_amount` to `bookings` table
- [ ] Add `provider_payout_amount` to `bookings` table
- [ ] Add payment status tracking (pending, authorized, captured, failed)

**API Endpoints**
- [ ] `POST /api/bookings/create` - Create booking + payment intent
- [ ] `POST /api/bookings/:id/confirm-payment` - Confirm payment
- [ ] `POST /api/bookings/:id/complete` - Mark service complete, initiate transfer
- [ ] `POST /api/bookings/:id/cancel` - Cancel booking + refund
- [ ] `GET /api/bookings/:id/payment-status` - Check payment status

**Payment Processing Logic**
- [ ] Calculate platform fee percentage (15% default, configurable per service?)
- [ ] Calculate transfer amount (price - platform fee - Stripe fees estimate)
- [ ] Create destination charge with `on_behalf_of` and `transfer_data`
- [ ] Set `capture_method: manual` for authorization only
- [ ] Capture payment after service completion
- [ ] Handle payment failures gracefully
- [ ] Store all Stripe IDs in database

**Authorization & Capture (for Bookings)**
- [ ] Authorize payment on booking creation (`capture_method: manual`)
- [ ] Hold funds for up to 7 days (or 30 with extended auth)
- [ ] Capture on service completion or 24h after scheduled time
- [ ] Cancel authorization if booking cancelled
- [ ] Handle authorization expiration (release funds automatically)

### Phase 4: Refunds & Disputes (Week 4)

**Refund Handling**
- [ ] `POST /api/bookings/:id/refund` - Issue refund
- [ ] Full refund vs partial refund logic
- [ ] Reverse transfer to SRNA (deduct from their balance)
- [ ] Check SRNA balance before reversing transfer
- [ ] Handle insufficient balance (platform covers or debt to SRNA)
- [ ] Refund timing: before service vs after service
- [ ] Cancellation policy: 24h notice = full refund, <24h = 50%, no-show = 0%

**Dispute Management**
- [ ] Listen for `charge.dispute.created` webhook
- [ ] Store dispute in database with status
- [ ] Notify admin team of dispute
- [ ] Gather evidence from SRNA and applicant
- [ ] Submit evidence via API if contesting
- [ ] Handle dispute outcome: won vs lost
- [ ] Update SRNA balance if lost (deduct disputed amount)

**Edge Cases**
- [ ] SRNA account has insufficient balance for refund
- [ ] Chargeback on service already completed and paid out
- [ ] No-show scenario: applicant vs provider
- [ ] Service quality disputes (bad review ≠ refund)
- [ ] Fraudulent booking detection

### Phase 5: Payouts (Week 5)

**Payout Configuration**
- [ ] Set default payout schedule for new accounts (weekly recommended)
- [ ] Allow SRNAs to change payout schedule in settings
- [ ] Support instant payouts (optional, 1.5% fee)
- [ ] Handle payout failures (invalid bank account)
- [ ] Notify SRNA of payout schedule and next payout date

**Payout Dashboard (for SRNAs)**
- [ ] Show pending earnings (not yet paid out)
- [ ] Show payout history with dates and amounts
- [ ] Show upcoming payout date and estimated amount
- [ ] Show platform fees deducted
- [ ] Show Stripe fees (transparent breakdown)
- [ ] Download payout statements (CSV)

**API Endpoints**
- [ ] `GET /api/provider/payouts` - List payout history
- [ ] `GET /api/provider/balance` - Current balance
- [ ] `POST /api/provider/instant-payout` - Request instant payout (if enabled)
- [ ] `PUT /api/provider/payout-schedule` - Update schedule

### Phase 6: Reporting & Compliance (Week 6)

**Tax Reporting (1099-K)**
- [ ] Enable 1099 tax reporting in Stripe Dashboard
- [ ] Confirm Stripe will file 1099-K for providers earning >$600/year
- [ ] Inform SRNAs during onboarding about tax obligations
- [ ] Provide tax information page in provider dashboard
- [ ] Store tax form delivery method (e-delivery via Express Dashboard)
- [ ] Notify SRNAs in January about tax forms

**Platform Reporting**
- [ ] Transaction volume dashboard (total processed)
- [ ] Platform fee revenue tracking
- [ ] Active providers count (for billing)
- [ ] Top providers by earnings
- [ ] Service category breakdown
- [ ] Refund rate monitoring
- [ ] Dispute rate monitoring

**Compliance & Security**
- [ ] Implement webhook signature verification
- [ ] Use Stripe API keys securely (environment variables)
- [ ] Never log sensitive data (credit card, SSN)
- [ ] HTTPS only for all payment pages
- [ ] PCI compliance: use Stripe Elements (client-side tokenization)
- [ ] Fraud detection: enable Radar for Platforms
- [ ] Terms of Service: add marketplace terms, provider agreement
- [ ] Privacy Policy: disclose Stripe as payment processor

### Phase 7: Testing (Week 7)

**Test Mode Testing**
- [ ] Create test Express account
- [ ] Test onboarding flow end-to-end
- [ ] Test payment creation with test cards
- [ ] Test authorization and capture
- [ ] Test refunds (full and partial)
- [ ] Test transfers to connected accounts
- [ ] Test webhook delivery and processing
- [ ] Test dispute simulation
- [ ] Test payout scheduling

**Test Cards**
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Requires auth: `4000 0027 6000 3184`
- Dispute: `4000 0000 0000 0259`

**UAT (User Acceptance Testing)**
- [ ] Onboard 2-3 real SRNAs in test mode
- [ ] Have test applicants book services
- [ ] Complete end-to-end booking + payout flow
- [ ] Test edge cases (cancellations, no-shows)
- [ ] Collect feedback on UI/UX
- [ ] Fix bugs and refine flow

**Production Readiness**
- [ ] Review Stripe integration guidelines
- [ ] Complete Stripe activation questionnaire
- [ ] Get production API keys
- [ ] Switch webhooks to production endpoint
- [ ] Test production onboarding with 1 SRNA
- [ ] Monitor first 10 transactions closely

### Webhooks to Handle

**Critical Events:**
```javascript
const criticalEvents = [
  'account.updated',                    // Provider account status changes
  'payment_intent.succeeded',           // Payment completed
  'payment_intent.payment_failed',      // Payment failed
  'charge.succeeded',                   // Charge completed
  'charge.failed',                      // Charge failed
  'charge.refunded',                    // Refund issued
  'charge.dispute.created',             // Dispute opened
  'charge.dispute.closed',              // Dispute resolved
  'transfer.created',                   // Transfer to provider created
  'transfer.failed',                    // Transfer failed
  'payout.paid',                        // Provider received payout
  'payout.failed',                      // Payout failed
];
```

**Monitoring Events:**
```javascript
const monitoringEvents = [
  'account.application.authorized',     // Provider completed onboarding
  'account.application.deauthorized',   // Provider disconnected
  'capability.updated',                 // Capabilities changed
  'charge.captured',                    // Payment captured
  'customer.created',                   // New customer
  'radar.early_fraud_warning.created',  // Fraud alert
];
```

---

## 5. Edge Cases to Handle

### Payment Failures

**Scenario: Applicant's card is declined**
- **When:** Booking creation
- **Handling:**
  - Show clear error message: "Your card was declined. Please try a different payment method."
  - Save booking as "Payment Failed" status
  - Allow retry with different card
  - Send email with payment link
  - Delete booking after 24h if not paid

**Scenario: Authorization succeeds but capture fails**
- **When:** Service completion
- **Handling:**
  - Retry capture automatically (up to 3 times)
  - If still fails, notify admin
  - Refund authorization (release funds)
  - Mark booking as "Payment Error"
  - Manually resolve (contact customer)

### Refund Scenarios

**Scenario: Applicant cancels 24h before service**
- **Policy:** Full refund
- **Handling:**
  - Issue full refund via API
  - Reverse transfer to SRNA (if already transferred)
  - Check SRNA balance - if insufficient, create debt record
  - Notify both parties
  - Update booking status: "Cancelled - Refunded"

**Scenario: Applicant cancels <24h before service**
- **Policy:** 50% refund (50% to SRNA as cancellation fee)
- **Handling:**
  - Issue 50% refund to applicant
  - Transfer 50% to SRNA (minus fees)
  - Calculate new application fee on 50%
  - Update booking status: "Cancelled - Partial Refund"

**Scenario: SRNA no-show**
- **Policy:** Full refund to applicant
- **Handling:**
  - Issue full refund
  - Do NOT transfer to SRNA
  - Mark SRNA for review (quality flag)
  - Update booking status: "Provider No-Show - Refunded"
  - 3 no-shows = suspend provider

**Scenario: Applicant no-show**
- **Policy:** No refund, full payment to SRNA
- **Handling:**
  - Do NOT refund
  - Transfer full amount to SRNA
  - Mark applicant for review (serial no-shows)
  - Update booking status: "Customer No-Show - Paid"

**Scenario: Refund after SRNA already received payout**
- **Problem:** SRNA's Stripe balance is $0
- **Handling:**
  - Attempt to reverse transfer (creates negative balance)
  - If SRNA has negative balance:
    - Option A: Deduct from future earnings
    - Option B: Request manual repayment
    - Option C: Platform absorbs cost (rare)
  - Send SRNA notification of debt
  - Pause payouts until balance positive

### Provider Account Issues

**Scenario: SRNA's bank account is invalid (payout fails)**
- **When:** Scheduled payout
- **Webhook:** `payout.failed`
- **Handling:**
  - Notify SRNA immediately: "Payout failed - please update bank account"
  - Generate Express Dashboard link
  - Retry payout after bank update
  - Hold future payouts until resolved
  - Auto-retry after 7 days if no update

**Scenario: SRNA fails identity verification**
- **When:** Onboarding
- **Webhook:** `account.updated` with `requirements.currently_due`
- **Handling:**
  - Request ID document upload
  - Send clear instructions: "Upload driver's license or passport"
  - Give 7 days to comply
  - If not resolved, suspend provider status
  - Manual review by admin if repeated failures

**Scenario: SRNA's account is flagged for fraud**
- **When:** After suspicious activity
- **Webhook:** `account.updated` with `charges_enabled: false`
- **Handling:**
  - Immediately suspend provider from marketplace
  - Notify admin for investigation
  - Hold all pending payouts
  - Cooperate with Stripe's fraud team
  - If cleared, reinstate; if confirmed, ban permanently

**Scenario: SRNA disconnects Connect account**
- **When:** Provider revokes access
- **Webhook:** `account.application.deauthorized`
- **Handling:**
  - Immediately disable provider status
  - Cancel all future bookings
  - Process any pending payouts
  - Notify affected applicants
  - Mark provider as "Disconnected" in database

### Chargeback & Dispute Scenarios

**Scenario: Applicant files chargeback for "service not received"**
- **When:** Days/weeks after service
- **Webhook:** `charge.dispute.created`
- **Handling:**
  - Gather evidence:
    - Booking confirmation email
    - Service completion timestamp
    - Any messages between applicant and SRNA
    - Session notes if available
  - Submit evidence to Stripe via API
  - Notify SRNA of dispute
  - Hold SRNA's balance for dispute amount
  - If dispute lost: deduct from SRNA balance
  - If won: release hold

**Scenario: Multiple disputes from same applicant (fraud)**
- **Pattern:** >2 disputes in 3 months
- **Handling:**
  - Flag applicant account for review
  - Block from making new bookings
  - Require admin approval for future transactions
  - Consider banning if clearly fraudulent
  - Report to Stripe if suspected fraud ring

**Scenario: Platform dispute rate exceeds threshold**
- **Problem:** >1% dispute rate triggers Visa/Mastercard monitoring
- **Handling:**
  - Implement stricter booking confirmations
  - Add service completion verification (applicant confirms)
  - Improve provider vetting (reduce bad providers)
  - Add terms acknowledgment before booking
  - Consider requiring 3DS for high-value services
  - Monitor and respond to all disputes quickly

### Fraud Prevention

**Scenario: Card testing attack (multiple failed payments)**
- **Pattern:** Many small transactions from different cards
- **Handling:**
  - Enable Stripe Radar (automatic)
  - Rate limit payment attempts (3 per 10 min)
  - Require CAPTCHA after failed payment
  - Block known bad IPs
  - Monitor for unusual patterns

**Scenario: Stolen card used for booking**
- **When:** Real cardholder reports fraud
- **Result:** Chargeback (platform liable)
- **Prevention:**
  - Require 3D Secure for high-value services (>$100)
  - Verify email address matches payment
  - Check Radar risk score (block if high)
  - Delay service for new accounts (24h cooling-off period)

**Scenario: Fake provider trying to onboard**
- **Red flags:** Fake license, suspicious email, odd behavior
- **Prevention:**
  - Verify nursing license with state board
  - Check CRNA school enrollment
  - Phone verification required
  - Manual review all new providers
  - Start with limited privileges (max 1 booking/day for first month)

### Technical Failures

**Scenario: Webhook endpoint is down**
- **Problem:** Missing critical events
- **Handling:**
  - Stripe retries webhooks for up to 3 days
  - Set up monitoring/alerts for webhook failures
  - Have fallback: poll Stripe API for events
  - Replay missed events from Stripe Dashboard

**Scenario: Database write fails after payment succeeds**
- **Problem:** Payment processed but not recorded
- **Handling:**
  - Use idempotency keys for all Stripe calls
  - Implement transaction rollback if DB write fails
  - Reconciliation job: check Stripe vs DB daily
  - Alert on mismatches
  - Manual resolution for orphaned payments

**Scenario: Transfer initiated but booking cancelled**
- **Problem:** Race condition
- **Handling:**
  - Lock booking record during payment operations
  - Check booking status before transfer
  - If too late, reverse transfer
  - Refund applicant
  - Log error for investigation

### Payout Issues

**Scenario: SRNA wants instant payout but not eligible**
- **Reason:** New account (<60 days) or daily limit hit (10/day)
- **Handling:**
  - Show clear message: "Instant Payouts available after 60 days"
  - Offer standard payout schedule
  - Educate on instant payout fees (1.5%)

**Scenario: SRNA has negative balance from refunds**
- **Amount:** -$50 from 2 refunds
- **Handling:**
  - Hold future payouts until positive
  - Show in dashboard: "Next earnings will cover your balance"
  - If balance negative for >30 days, contact provider
  - Request manual repayment if leaving platform

### Service Quality Issues

**Scenario: Applicant complains service was poor quality**
- **Dispute:** "The mock interview was unprofessional"
- **Handling:**
  - Not eligible for refund per terms (opinion-based)
  - Offer credit for future booking
  - Review SRNA if pattern of complaints
  - Lower SRNA's rating/visibility
  - Mediation: offer partial refund as goodwill (50%)

**Scenario: Service ran short (30 min instead of 60 min)**
- **Clear violation:** Measurable
- **Handling:**
  - Issue partial refund (50%)
  - Reverse partial transfer from SRNA
  - Warning to SRNA
  - 3 violations = suspend provider

---

## 6. Cost Analysis

### Stripe Fees Breakdown

#### Standard Processing Fees
These fees apply to all card transactions:

| Fee Type | Amount | Who Pays |
|----------|--------|----------|
| **Card processing** | 2.9% + $0.30 per transaction | Platform |
| **International card** | +1.5% cross-border fee | Platform |
| **ACH transfer** | 0.8% (capped at $5) | Platform |

**Example:** $50 booking
- Stripe fee: $50 × 2.9% + $0.30 = $1.75

#### Connect Account Fees (Express)
These fees are specific to Connect:

| Fee Type | Amount | When Charged |
|----------|--------|--------------|
| **Active account fee** | $2 per month | Only months with payouts |
| **Payout fee** | 0.25% + $0.25 per payout | Each payout |
| **Instant payout fee** | 1.5% of payout amount | If provider requests instant |

**Example:** 50 active providers, weekly payouts
- Monthly active account fees: 50 × $2 = $100
- Weekly payout fees: 50 × 4 weeks × $0.25 = $50 (plus 0.25% of volume)
- Total Connect fees: ~$150/month + 0.25% of payout volume

#### Tax Reporting Fees (US)

| Form Type | Cost | When |
|-----------|------|------|
| **1099-K e-filed (IRS)** | $2.99 per form | Annually (January) |
| **1099-K e-filed (State)** | $1.49 per form | Annually |
| **1099-K mailed** | $2.99 per form | If provider opts out of e-delivery |

**Example:** 100 providers earning >$600/year
- IRS filing: 100 × $2.99 = $299
- State filing: 100 × $1.49 = $149
- Total: ~$448/year (if all e-delivery)

### Platform Revenue Model

#### Recommended Fee Structure

**Platform Application Fee: 15%**
- Industry standard for service marketplaces
- Covers Stripe fees + platform revenue
- Transparent to providers

**Example Calculation: $50 Mock Interview**

```
Service Price:              $50.00
├─ Customer Pays:           $50.00
├─ Stripe Card Fee:        - $1.75 (2.9% + $0.30)
├─ Platform Fee:           - $7.50 (15%)
└─ Provider Receives:       $40.75

Provider Payout:            $40.75
├─ Payout Fee:             - $0.23 (0.25% + $0.25)
└─ Provider Net:            $40.52

Platform Net Revenue:
  Application Fee:          $7.50
  Minus Stripe Fees:       -$1.75
  Minus Payout Fee:        -$0.23
  = Platform Net:           $5.52 (11% of transaction)
```

#### Monthly Cost Scenarios

**Scenario 1: Early Stage (10 active providers, 50 bookings/month)**

```
Revenue:
  50 bookings × $50 avg = $2,500 volume
  Platform fees (15%): $375

Costs:
  Stripe card fees (3%): $75
  Active account fees: $20 (10 × $2)
  Payout fees: $15 (10 × 4 weeks × $0.25 + 0.25% volume)
  Total costs: $110

Net Margin: $375 - $110 = $265 (70% margin)
```

**Scenario 2: Growth Stage (50 active providers, 250 bookings/month)**

```
Revenue:
  250 bookings × $50 avg = $12,500 volume
  Platform fees (15%): $1,875

Costs:
  Stripe card fees (3%): $375
  Active account fees: $100 (50 × $2)
  Payout fees: $75 (50 × 4 weeks × $0.25 + 0.25% volume)
  Total costs: $550

Net Margin: $1,875 - $550 = $1,325 (71% margin)
```

**Scenario 3: Mature Stage (200 active providers, 1,000 bookings/month)**

```
Revenue:
  1,000 bookings × $50 avg = $50,000 volume
  Platform fees (15%): $7,500

Costs:
  Stripe card fees (3%): $1,500
  Active account fees: $400 (200 × $2)
  Payout fees: $325 (200 × 4 weeks × $0.25 + 0.25% volume)
  Tax reporting (annual): $37 (200 × $4.48 / 12)
  Total costs: $2,262

Net Margin: $7,500 - $2,262 = $5,238 (70% margin)
```

### Cost Optimization Strategies

**1. Adjust Payout Schedule**
- Weekly payouts: 200 providers × 4 × $0.25 = $200/month
- Monthly payouts: 200 providers × 1 × $0.25 = $50/month
- **Savings:** $150/month with monthly payouts
- **Trade-off:** Provider satisfaction (weekly is better)

**2. Batch Small Transactions**
- Minimum booking amount: $25 (vs $10)
- Reduces impact of $0.30 per transaction fee
- On $10 transaction: 3% + $0.30 = 6% effective rate
- On $25 transaction: 3% + $0.30 = 4.2% effective rate

**3. Encourage ACH Payments (Future)**
- ACH fee: 0.8% (vs 2.9% + $0.30 for cards)
- On $50: $0.40 ACH vs $1.75 card = $1.35 savings
- **Challenge:** ACH is slower (3-5 days), less common for consumers

**4. Instant Payout Policy**
- Charge provider for instant payout fee (1.5%)
- Or include in platform fee calculation
- Most providers okay with weekly payouts

**5. Optimize Active Account Billing**
- "Active" = payout sent that month
- Hold payouts until minimum threshold ($25?)
- Reduces active account fees for low-volume providers
- **Trade-off:** Provider experience

### Total Cost to Platform (Annual Projection)

**Assumptions:**
- Average 100 active providers
- 500 bookings/month × $50 average = $25,000/month = $300,000/year
- Weekly payouts

**Annual Costs:**

```
Stripe Card Processing:
  $300,000 × 3% = $9,000

Connect Account Fees:
  100 providers × $2 × 12 months = $2,400

Payout Fees:
  100 providers × 52 weeks × $0.25 = $1,300
  $300,000 × 0.25% = $750
  Total: $2,050

Tax Reporting:
  100 forms × $4.48 = $448

TOTAL ANNUAL COST: $13,898
  (4.6% of transaction volume)

Platform Revenue:
  $300,000 × 15% = $45,000

NET MARGIN: $31,102
  (68.9% margin on fees)
```

**Takeaway:** At 15% platform fee, you retain ~11% after all Stripe costs, which is healthy for a marketplace.

---

## 7. Quick Reference

### Key API Calls

```javascript
// 1. Create Express account
const account = await stripe.accounts.create({
  type: 'express',
  country: 'US',
  email: 'provider@example.com',
  capabilities: {
    card_payments: {requested: true},
    transfers: {requested: true},
  },
});

// 2. Generate onboarding link
const accountLink = await stripe.accountLinks.create({
  account: account.id,
  refresh_url: 'https://crnaclub.com/provider/onboarding/refresh',
  return_url: 'https://crnaclub.com/provider/onboarding/complete',
  type: 'account_onboarding',
});

// 3. Create destination charge
const paymentIntent = await stripe.paymentIntents.create({
  amount: 5000,
  currency: 'usd',
  customer: customerId,
  on_behalf_of: connectedAccountId,
  transfer_data: {
    destination: connectedAccountId,
    amount: 4250,
  },
  application_fee_amount: 750,
  metadata: {booking_id: 'booking_123'},
});

// 4. Issue refund
const refund = await stripe.refunds.create({
  payment_intent: paymentIntentId,
  reverse_transfer: true, // Reverses the transfer to connected account
});

// 5. Retrieve account status
const account = await stripe.accounts.retrieve(connectedAccountId);
const onboardingComplete = account.charges_enabled && account.payouts_enabled;
const needsInfo = account.requirements.currently_due.length > 0;

// 6. Create Express Dashboard link
const loginLink = await stripe.accounts.createLoginLink(connectedAccountId);
// Redirect provider to loginLink.url
```

### Important Webhooks

```javascript
// Listen for these events
'account.updated'                 // Check charges_enabled, payouts_enabled
'payment_intent.succeeded'        // Payment completed
'payment_intent.payment_failed'   // Payment failed - retry or cancel
'charge.dispute.created'          // Dispute opened - gather evidence
'transfer.created'                // Transfer to provider succeeded
'payout.failed'                   // Provider's bank account invalid
```

### Configuration Checklist

**Before Launch:**
- [ ] Express accounts enabled
- [ ] Destination charges tested
- [ ] Webhooks verified with signature checking
- [ ] 1099 tax reporting enabled
- [ ] Platform branding configured
- [ ] Radar for fraud enabled
- [ ] Terms of service updated
- [ ] Provider agreement created
- [ ] Refund policy documented
- [ ] Cancellation policy defined

### Key Decisions Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Account Type** | Express | Best balance of control and simplicity |
| **Payment Flow** | Destination Charges | Standard 1:1 bookings, immediate transfers |
| **Platform Fee** | 15% | Industry standard, covers costs + margin |
| **Payout Schedule** | Weekly (default) | Provider satisfaction, reasonable costs |
| **Instant Payouts** | Optional, provider pays fee | Let providers choose speed vs cost |
| **Onboarding** | Stripe-hosted | Faster development, Stripe handles compliance |
| **Tax Reporting** | Stripe handles | Automated 1099-K for >$600/year |
| **Dispute Liability** | Platform | Required for Express accounts |
| **Refund Policy** | Tiered by timing | 24h+ = full, <24h = 50%, no-show = 0% |

### Resources & Documentation

**Stripe Docs:**
- [Connect Overview](https://stripe.com/docs/connect)
- [Express Accounts](https://stripe.com/docs/connect/express-accounts)
- [Destination Charges](https://stripe.com/docs/connect/destination-charges)
- [Webhooks](https://stripe.com/docs/webhooks)
- [1099 Tax Reporting](https://stripe.com/docs/connect/tax-reporting)

**Testing:**
- [Test Cards](https://stripe.com/docs/testing)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)
- [Webhook Testing](https://stripe.com/docs/webhooks/test)

**Support:**
- Stripe Support: support@stripe.com
- Stripe Discord: Join for real-time help
- Stack Overflow: Tag `stripe-connect`

---

## Next Steps

1. **Review & Approve:** Share this guide with dev team for feedback
2. **Prioritize:** Decide which features are MVP vs post-launch
3. **Timeline:** Estimate dev time for each phase (likely 6-8 weeks)
4. **Design:** Create UI mockups for provider onboarding, booking flow, provider dashboard
5. **Test Account:** Create Stripe Connect test account and experiment
6. **Schema:** Design database schema with all required fields
7. **API Spec:** Define REST API endpoints for frontend integration
8. **Security:** Plan authentication, authorization, rate limiting
9. **Build:** Start with Phase 1 (Setup) and iterate

---

**Document Version:** 1.0
**Last Updated:** December 7, 2025
**Next Review:** Before Phase 1 development begins

---

## Sources

This guide is based on official Stripe Connect documentation and industry best practices as of December 2025:

- [Connect account types | Stripe Documentation](https://docs.stripe.com/connect/accounts)
- [Stripe Connect Comparison: Standard vs Express vs Custom Accounts | ChargeKeep](https://www.chargekeep.com/stripe-connect-accounts-comparison/)
- [Comparing Stripe Connect modes Standard vs Express vs Custom](https://www.nimblechapps.com/blog/comparing-stripe-connect-standard-vs-express-vs-custom)
- [Collect payments then pay out on your marketplace | Stripe Documentation](https://docs.stripe.com/connect/collect-then-transfer-guide)
- [Stripe Connect marketplace payments: overview - Sharetribe](https://www.sharetribe.com/academy/marketplace-payments/stripe-connect-overview/)
- [Platforms and marketplaces with Stripe Connect | Stripe Documentation](https://docs.stripe.com/connect)
- [Stripe-hosted onboarding | Stripe Documentation](https://docs.stripe.com/connect/hosted-onboarding)
- [Required verification information | Stripe Documentation](https://docs.stripe.com/connect/required-verification-information)
- [Collect application fees | Stripe Documentation](https://docs.stripe.com/connect/marketplace/tasks/app-fees)
- [Create destination charges | Stripe Documentation](https://docs.stripe.com/connect/destination-charges)
- [Create separate charges and transfers | Stripe Documentation](https://docs.stripe.com/connect/separate-charges-and-transfers)
- [Recommended Connect integrations and charge types | Stripe Documentation](https://docs.stripe.com/connect/integration-recommendations)
- [Manage payout schedule | Stripe Documentation](https://docs.stripe.com/connect/manage-payout-schedule)
- [Instant Payouts for Stripe Dashboard users | Stripe Documentation](https://docs.stripe.com/payouts/instant-payouts)
- [Handle refunds and disputes | Stripe Documentation](https://docs.stripe.com/connect/marketplace/tasks/refunds-disputes)
- [Disputes on Connect platforms | Stripe Documentation](https://support.stripe.com/questions/dispute-responsibility-for-connect-platforms-and-connected-accounts)
- [Risk and liability management with Connect | Stripe Documentation](https://docs.stripe.com/connect/risk-management)
- [Place a hold on a payment method | Stripe Documentation](https://docs.stripe.com/payments/place-a-hold-on-a-payment-method)
- [Place an extended hold on an online card payment | Stripe Documentation](https://docs.stripe.com/payments/extended-authorization)
- [US tax reporting for Connect platforms | Stripe Documentation](https://docs.stripe.com/connect/tax-reporting)
- [Stripe Connect: 1099](https://stripe.com/connect/1099)
- [Pricing information | Stripe Connect](https://stripe.com/connect/pricing)
- [Stripe Fees and Pricing: Your Complete Guide for 2025](https://paymentcloudinc.com/blog/stripe-fees/)
- [Connect webhooks | Stripe Documentation](https://docs.stripe.com/connect/webhooks)
- [Best practices for preventing fraud | Stripe Documentation](https://docs.stripe.com/disputes/prevention/best-practices)
- [Best practices for risk management | Stripe Documentation](https://docs.stripe.com/connect/risk-management/best-practices)
- [Stripe for Marketplaces | Power Payments for Marketplaces](https://stripe.com/use-cases/marketplaces)
- [Build a marketplace | Stripe Documentation](https://docs.stripe.com/connect/marketplace)
