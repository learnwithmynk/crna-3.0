# Admin Flows & Edge Case Handling

**Created:** December 8, 2024
**Status:** Complete Design Specification

---

## Admin Dashboard Architecture

### Route Structure

```
/admin/marketplace/
├── dashboard          # Overview metrics
├── providers          # Provider management
├── bookings           # Booking management
├── disputes           # Dispute resolution
├── quality            # Review moderation
├── financials         # Revenue reports
└── audit-log          # Admin activity log
```

---

## 1. Provider Management

### Provider List View (`/admin/marketplace/providers`)

**Filters:**
- Status: Pending, Approved, Suspended, Banned
- Commission tier
- Rating range
- Date approved

**Columns:**
- Name, Program, Status, Bookings, Rating, Earnings, Last active, Actions

**Batch Actions:**
- Approve multiple
- Flag for review
- Send message

### Provider Detail View

**Performance Metrics:**
- Total earnings (all-time, YTD, this month, pending)
- Completion rate
- Average response time
- Average rating
- Cancellation rate
- No-show rate

**Quality Monitoring:**
- Last 10 reviews
- Complaints/flags
- Dispute history
- Warning history

**Admin Actions:**
- Message provider
- Adjust commission rate
- Flag for review
- Send warning
- Suspend temporarily
- Ban permanently
- Edit profile (admin override)
- Force payout
- View Stripe status

---

## 2. Cancellation Policies

### Provider Cancellation

| Timing | Applicant Gets | Provider Consequence |
|--------|----------------|---------------------|
| 48+ hours | Full refund | Warning (1st), Suspension (2nd+) |
| 24-48 hours | Full refund | Warning (1st), 3-day suspension (2nd+) |
| < 24 hours | Full refund + $10 credit | 7-day suspension (1st), longer (2nd+) |
| < 1 hour | Full refund + $20 credit | Immediate 7-day suspension |

**Pattern Detection:** 3+ cancellations in 30 days → Automatic 3-day suspension + review

### Applicant Cancellation

| Timing | Applicant Gets | Provider Gets |
|--------|----------------|---------------|
| 48+ hours | Full refund | $0 |
| 24-48 hours | 50% refund | 50% (net of fee) |
| < 24 hours | No refund | Full payment (net) |

---

## 3. Refund Matrix

### Complete Refund Scenarios

| Scenario | Applicant Gets | Provider Gets | Platform Action |
|----------|----------------|---------------|-----------------|
| Provider cancels (any time) | 100% | $0 | Auto-refund |
| Provider no-show | 100% + $10 credit | $0 | Auto-refund + quality flag |
| Applicant cancels 48+ hrs | 100% | $0 | Auto-refund |
| Applicant cancels 24-48 hrs | 50% | 50% net | Partial refund |
| Applicant cancels < 24 hrs | $0 | 100% net | No refund |
| Applicant no-show | $0 | 100% net | Provider paid |
| Service not delivered | Case by case | Case by case | Dispute review |
| Technical platform failure | 100% | Reimbursed | Emergency refund |
| Service quality complaint | 25-100% | Varies | Admin review |
| Provider emergency (verified) | 100% + $10 | $0 | No penalty to provider |

### Processing Large Refunds ($200+)
- Flag for admin review
- Create ticket in admin dashboard
- Admin approves or denies
- Process after approval

---

## 4. Dispute Resolution Workflow

### Phase 1: Initiation

**Who can initiate:** Applicant, Provider, Platform

**Required information:**
- Booking ID
- Reason (dropdown + explanation)
- Evidence (optional uploads)
- Preferred resolution

**Time window:** 14 days after booking completion

### Phase 2: Evidence Gathering (48-72h)

**Admin actions:**
1. Create dispute ticket
2. Request evidence from both parties
3. Set 48h deadline for response
4. Auto-collect: conversation history, session timing, ratings

### Phase 3: Investigation (48-72h)

**Review criteria by reason:**

**"Service not delivered"**
- Did booking complete?
- Is there proof of delivery?
- Decision: Proof = deny refund; No proof = issue refund

**"Quality issue"**
- Did service match description?
- Pattern of similar complaints?
- Decision: Clear violation = 50% refund; Subjective = mediation

**"Unauthorized payment"**
- Account activity analysis
- Device/location check
- Decision: Clear hack = refund; Likely lie = deny + flag

### Phase 4: Resolution

**Options:**
1. **Full refund** - Applicant gets 100%, provider gets $0
2. **Partial refund** - 25-50% to applicant, rest to provider
3. **Deny refund** - Provider keeps payment
4. **Platform credit** - Alternative to cash refund

### Phase 5: Appeal (7 days)

- Different admin reviews appeal
- Final decision is final
- Can involve Stripe for chargebacks

---

## 5. No-Show Handling

### Provider No-Show

**Detection:**
- No Zoom access after 15 min
- Applicant reports in app

**Immediate Actions:**
1. Full refund + $10 credit to applicant
2. Email: "Provider didn't attend. Refund issued."
3. Flag provider account

**Provider Consequences:**
- 1st: Warning
- 2nd in 90 days: 3-day suspension
- 3rd: 7-day suspension + review
- 4th: 30-day suspension or ban

### Applicant No-Show

**Detection:**
- Provider waits 10+ min
- Provider marks no-show in app

**Actions:**
1. No refund (applicant forfeited)
2. Full payout to provider
3. Email applicant: "Payment forfeited due to no-show"

**Applicant Consequences:**
- 1st: Warning
- 2nd in 90 days: Reminder confirmation required
- 3rd: Admin approval required to book
- 4th+: Account review

---

## 6. Admin Audit Trail

### What to Log

```sql
CREATE TABLE admin_audit_log (
  id UUID PRIMARY KEY,
  timestamp TIMESTAMP DEFAULT NOW(),
  admin_id UUID NOT NULL,
  admin_name TEXT,
  action_type TEXT NOT NULL,
  target_type TEXT,
  target_id UUID,
  details JSONB,
  reason TEXT,
  result TEXT,
  ip_address TEXT
);
```

### Action Types

| Action | Target | Details |
|--------|--------|---------|
| approve_provider | Provider | Application ID, commission rate |
| reject_provider | Provider | Reason |
| suspend_provider | Provider | Duration, reason |
| ban_provider | Provider | Reason |
| issue_refund | Booking | Amount, reason |
| cancel_booking | Booking | Reason, refund issued |
| resolve_dispute | Dispute | Resolution type, amount |
| remove_review | Review | Reason |
| edit_profile | Provider | Fields changed (before/after) |

---

## 7. Edge Case Playbook

### Provider Edge Cases

**EC-P1: Provider Becomes Inactive**
- Detection: No activity > 7 days + pending bookings
- Action: Send message, wait 24h, auto-pause, notify applicants
- Resolution: Rebook with different provider or refund

**EC-P2: Stripe Account Becomes Ineligible**
- Detection: Webhook `account.updated` with `charges_enabled: false`
- Action: Suspend provider, email to update Stripe, hold payouts
- Resolution: Provider fixes Stripe or gets banned

**EC-P3: Provider Requests Emergency Suspension**
- Process: Verify legitimacy, pause future bookings
- For pending bookings: Offer reschedule or refund
- No penalty if genuine emergency

### Payment Edge Cases

**EC-$1: Double Charge**
- Detection: Applicant reports, Stripe shows 2 charges
- Action: Immediate refund of duplicate
- Follow-up: Investigate cause

**EC-$2: Payment Authorized But Never Captured**
- Detection: Booking complete but payment still authorized
- Action: Manually capture if service delivered, else release

**EC-$3: Payout Rejected by Bank**
- Detection: Webhook `payout.failed`
- Action: Store funds in Stripe balance, email provider to update bank
- Resolution: Retry after provider updates

**EC-$4: Chargeback from Credit Card**
- Detection: Webhook `charge.dispute.created`
- Action: Gather evidence, submit to Stripe
- Resolution: Win = keep funds; Lose = platform absorbs

### Quality Edge Cases

**EC-Q1: Defamatory Review**
- Detection: Review contains false claims
- Action: Remove review, warn reviewer
- Communication: Email both parties

**EC-Q2: Fake Reviews (Review Farming)**
- Detection: Multiple 5-star reviews from new accounts
- Action: Remove reviews, warn provider
- Repeated offense: Suspension

**EC-Q3: Provider Requesting Off-Platform Contact**
- Detection: Message flags
- Action: Warning (1st), suspension (2nd), ban (3rd)

---

## 8. Database Schema Additions

```sql
-- Provider suspension history
CREATE TABLE provider_suspensions (
  id UUID PRIMARY KEY,
  provider_id UUID NOT NULL,
  reason TEXT NOT NULL,
  suspension_start TIMESTAMP NOT NULL,
  suspension_end TIMESTAMP,
  admin_notes TEXT
);

-- Disputes
CREATE TABLE disputes (
  id UUID PRIMARY KEY,
  booking_id UUID NOT NULL,
  applicant_id UUID NOT NULL,
  provider_id UUID NOT NULL,
  reason TEXT NOT NULL,
  dispute_type TEXT,
  status TEXT DEFAULT 'open',
  evidence_applicant JSONB,
  evidence_provider JSONB,
  resolution TEXT,
  refund_issued DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP
);

-- Provider monthly metrics
CREATE TABLE provider_monthly_metrics (
  id UUID PRIMARY KEY,
  provider_id UUID NOT NULL,
  month DATE NOT NULL,
  total_bookings INT,
  completed_bookings INT,
  cancelled_bookings INT,
  no_show_count INT,
  average_rating DECIMAL(3,2),
  review_count INT,
  refund_rate DECIMAL(3,2),
  dispute_count INT
);
```

---

## 9. API Endpoints

```
# Dashboard
GET    /api/admin/marketplace/dashboard

# Providers
GET    /api/admin/marketplace/providers
GET    /api/admin/marketplace/providers/:id
PUT    /api/admin/marketplace/providers/:id/suspend
PUT    /api/admin/marketplace/providers/:id/ban
PUT    /api/admin/marketplace/providers/:id

# Bookings
GET    /api/admin/marketplace/bookings
GET    /api/admin/marketplace/bookings/:id
POST   /api/admin/marketplace/bookings/:id/refund
POST   /api/admin/marketplace/bookings/:id/complete
POST   /api/admin/marketplace/bookings/:id/cancel

# Disputes
GET    /api/admin/marketplace/disputes
GET    /api/admin/marketplace/disputes/:id
POST   /api/admin/marketplace/disputes/:id/resolve

# Quality
GET    /api/admin/marketplace/quality
POST   /api/admin/marketplace/quality/remove-review

# Audit
GET    /api/admin/marketplace/audit-log

# Financials
GET    /api/admin/marketplace/financials
```

---

## 10. Communication Templates

### Provider Emails

**Approval:**
> Subject: You're approved! Complete your profile
>
> Congratulations! Your application to The CRNA Club Marketplace has been approved. Complete your profile to start accepting bookings.

**Suspension:**
> Subject: Your marketplace account has been suspended
>
> Your account has been temporarily suspended for [X days] due to [reason]. During this time, you cannot accept new bookings.

**Quality Warning:**
> Subject: Quality feedback on your recent bookings
>
> We've received feedback about recent bookings that we'd like to share. Please review and let us know if you have questions.

### Dispute Emails

**Resolution - Applicant Favor:**
> Subject: Your dispute has been resolved
>
> We've reviewed your dispute and issued a [full/partial] refund of $X. It should appear in your account within 3-5 business days.

**Resolution - Provider Favor:**
> Subject: Dispute resolution update
>
> We've reviewed the dispute and found the service was completed as described. No refund will be issued.

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Dispute rate | < 5% of bookings |
| Refund rate | < 10% of bookings |
| Average dispute resolution time | < 5 days |
| Provider suspension rate | < 2% |
| Appeal rate | < 5% of disputes |
| Chargeback rate | < 0.5% |
