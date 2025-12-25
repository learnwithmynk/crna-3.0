# Provider (SRNA Mentor) Onboarding Flow

**Created:** December 8, 2024
**Status:** Complete Design Specification

---

## Executive Summary

The provider onboarding flow consists of three distinct phases:

1. **Application Phase** - SRNAs submit their background, credentials, and service interests
2. **Admin Review & Approval** - CRNA Club admins verify credentials and approve/reject
3. **Profile Setup & Stripe Onboarding** - Approved SRNAs complete their profile, configure services, and connect their Stripe account

**Total expected time:** 30-45 minutes across multiple sessions

---

## Overview Flow Diagram

```
PHASE 1: APPLICATION SUBMISSION
┌──────────────────────────────────────────────────────────────────┐
│ User discovers "Become a Mentor" CTA (dashboard, sidebar, etc.)  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │ Eligibility Check     │
                    │ (Are you SRNA? Yes?)  │
                    └───────────────────────┘
                          │         │
                        YES         NO
                          │         │
                          ▼         ▼
                   ┌─────────┐  ┌──────────────────┐
                   │  FORM   │  │ "Not Yet"        │
                   └─────────┘  │ Page + Waitlist  │
                          │     └──────────────────┘
                          ▼
            ┌────────────────────────────────┐
            │ Application Form               │
            │ - Personal Info                │
            │ - Program Details              │
            │ - Background                   │
            │ - Bio                          │
            │ - Service Interests            │
            │ - Proof of Enrollment          │
            │ - Agreements/Compliance        │
            └────────────────────────────────┘
                          │
                          ▼
            ┌────────────────────────────────┐
            │ Submission Confirmation        │
            │ "We'll review in 2-3 days"     │
            └────────────────────────────────┘


PHASE 2: ADMIN REVIEW
┌──────────────────────────────────────────────────────────────────┐
│ Admin Dashboard: Provider Applications Queue (pending count)      │
└──────────────────────────────────────────────────────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────────┐
        │ Admin Reviews Application            │
        │ - Verifies enrollment document       │
        │ - Checks education requirements      │
        │ - Reviews bio & background           │
        └─────────────────────────────────────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼
     APPROVE    INFO REQ.    REJECT
        │           │           │
        ▼           ▼           ▼
    Email sent  Re-submit   Email sent
    + Provider  required    with reason
    account
    created


PHASE 3: PROFILE SETUP & STRIPE ONBOARDING
┌──────────────────────────────────────────────────────────────────┐
│ SRNA Clicks "Complete Profile" (email link)                       │
└──────────────────────────────────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
    STEP 1            STEP 2            STEP 3
    Complete          Create            Set
    Profile           Services          Availability
        │                 │                 │
        └─────────────────┼─────────────────┘
                          │
                          ▼
                    STEP 4: Payment Setup
                    (Stripe Connect Express)
                          │
                          ▼
                    ┌─────────────────┐
                    │ Profile Live!   │
                    │ Ready for       │
                    │ Bookings        │
                    └─────────────────┘
```

---

## Phase 1: Application Submission

### Screen 1.1: Eligibility Check

**Route:** `/marketplace/provider/apply`

**Purpose:** Verify the user is eligible (currently SRNA or accepted SRNA)

```
┌──────────────────────────────────────────────┐
│ Are you currently or recently enrolled in a  │
│ CRNA program?                                │
│                                              │
│ [Yes, I'm a current SRNA/Student] (button)   │
│ [Yes, I was accepted] (secondary)            │
│ [Not yet / No] (secondary)                   │
└──────────────────────────────────────────────┘
```

**Logic:**
- **YES**: Proceed to application form
- **NO**: Show waitlist signup

---

### Screen 1.2: Provider Application Form

**Route:** `/marketplace/provider/apply`

#### Section A: Personal Info (Pre-filled)

| Field | Type | Validation | Notes |
|-------|------|-----------|-------|
| Full Name | Text | Required, 2-50 chars | Auto-filled |
| Email | Email | Required, .edu preferred | Show requirement |
| Profile Photo | Image upload | Optional | Drag & drop, 2MB max |
| Phone Number | Phone | Required | Admin contact |

#### Section B: CRNA Program Info

| Field | Type | Validation | Notes |
|-------|------|-----------|-------|
| School/University | Select/Combobox | Required | Dropdown of ~140 programs + "Other" |
| Program Type | Select | Required | DNP, DNAP, MSNA |
| Expected Graduation | Month/Year | Required | Must be future |
| Current Year in Program | Select | Required | 1st, 2nd, 3rd, 4th |
| Enrollment Proof | File upload | Required | Student ID, enrollment letter, or transcript |

#### Section C: Academic Background

| Field | Type | Validation | Notes |
|-------|------|-----------|-------|
| Undergraduate Institution | Text | Optional | Free text |
| Undergraduate Degree | Text | Optional | e.g., "BS Nursing" |
| GPA when Applied | Number | Optional | 0.0-4.0 |
| Science GPA when Applied | Number | Optional | 0.0-4.0 |
| GRE Score (if taken) | Number | Optional | 260-340 |
| CCRN Certified | Yes/No | Optional | When applied |
| Years ICU Experience | Number | Optional | When applied |
| ICU Type | Multi-select | Optional | MICU, SICU, CVICU, etc. |

#### Section D: Bio & Motivation

| Field | Type | Validation |
|-------|------|-----------|
| Bio | Textarea | Required, 200-500 words |

**Bio Prompts:**
- Your CRNA program and year
- Your background (GPA, experience, etc.)
- What you wish you'd known
- What services you're best at
- Your personality/teaching style

#### Section E: Service Interests

| Field | Type | Validation |
|-------|------|-----------|
| Services | Checkboxes | Required, ≥1 |

**Options:**
- Mock Interview
- Personal Statement Review
- Resume/CV Review
- Application Strategy Session
- School Q&A
- Clinical Tutoring
- Other (specify)

#### Section F: Agreements

| Field | Type | Required |
|-------|------|----------|
| Terms of Service | Checkbox | Yes |
| Platform Fee (20%) | Checkbox | Yes |
| 24-Hour Response | Checkbox | Yes |
| 4.0+ Rating Requirement | Checkbox | Yes |

---

### Screen 1.3: Application Confirmation

```
┌─────────────────────────────────────────────────┐
│ 🎉 Application Submitted!                       │
│                                                 │
│ What Happens Next:                              │
│                                                 │
│ 1️⃣  We'll review your application (2-3 days)    │
│ 2️⃣  Check your email for approval               │
│ 3️⃣  Complete your profile                       │
│ 4️⃣  Start accepting bookings!                   │
│                                                 │
│ Reference: APP-2024-XXXX                        │
│                                                 │
│ [Return to Dashboard] [Browse as Applicant]     │
└─────────────────────────────────────────────────┘
```

---

## Phase 2: Admin Review

### Admin Applications Queue

**Route:** `/admin/marketplace/applications`

**Tabs:** Pending (with count), Approved, Rejected, All

**Per Application Card:**
```
┌────────────────────────────────────────────────┐
│ 🔵 Sarah Johnson (Pending)                     │
│ Duke University, DNP, Class of 2025            │
│                                                │
│ Applied: Dec 8, 2024 (1 hour ago)              │
│ Services: Mock Interview, Essay Review         │
│ Document: ✓ Student ID (verified)              │
│                                                │
│ [Approve] [Request More Info] [Reject]         │
└────────────────────────────────────────────────┘
```

### Admin Verification Checklist

**Enrollment Verification:**
- Student ID shows program name + enrollment date
- OR Enrollment letter from official registrar
- OR Transcript shows current CRNA courses

**Background Verification:**
- Self-reported GPA seems reasonable
- Experience aligns with typical SRNA
- No red flags

**Bio Verification:**
- Professional tone
- No spam or external links
- Shows genuine interest in mentoring

### Decision Actions

**Approve:**
1. Create provider account
2. Send approval email with onboarding link
3. Profile becomes visible to applicants

**Request Info:**
1. Update status to `info_requested`
2. Send email with specific request
3. Applicant can re-submit

**Reject:**
1. Update status to `rejected`
2. Send email with reason
3. Can reapply after 30 days

---

## Phase 3: Profile Setup & Stripe

### Step 1: Complete Profile

**Route:** `/marketplace/provider/onboarding/profile`

**Fields to Collect:**

| Field | Type | Notes |
|-------|------|-------|
| Tagline | Text (50 chars) | "Mock interview expert" |
| Specialties | Multi-select | Non-traditional backgrounds, Low GPA success, etc. |
| General Availability | Checkboxes | Mornings, Afternoons, Evenings, Weekends |
| Timezone | Dropdown | Auto-detect + override |
| Bio Refinement | Textarea | Pre-filled from application |

---

### Step 2: Create First Service

**Route:** `/marketplace/provider/onboarding/service`

**Template Options:**
- Mock Interview ($100-150, 60 min live)
- Personal Statement Review ($75-100, 2-3 day async)
- Application Strategy Session ($75-125, 45 min live)
- Custom Service

**Service Form Fields:**

| Field | Type | Validation |
|-------|------|-----------|
| Service Title | Text | Required, 5-60 chars |
| Description | Textarea | Required, 100-500 words |
| Price | Number | $25-$500 |
| Format | Radio | Live Video / Async Document |
| Duration | Dropdown | 30/45/60/90/120 min (live) |
| Delivery Time | Dropdown | 1/2-3/3-5/7 days (async) |
| Active | Toggle | Default: On |

**Price Display:**
```
Price: $100
You'll earn: $80 (80% after 20% platform fee)
```

---

### Step 3: Set Availability

**Route:** `/marketplace/provider/onboarding/availability`

| Field | Type | Notes |
|-------|------|-------|
| Scheduling Style | Radio | Manual review vs Fixed schedule |
| General Availability | Checkboxes | Morning/Afternoon/Evening/Weekend |
| Timezone | Dropdown | EDT, CDT, PDT, etc. |
| Advance Notice | Dropdown | Same day, 1-7 days |
| Buffer Between Bookings | Dropdown | None, 1-4 hours |
| Max Bookings/Week | Number | Optional limit |
| Blocked Dates | Date range picker | Exams, vacation, etc. |

---

### Step 4: Payment Setup (Stripe Connect)

**Route:** `/marketplace/provider/onboarding/payment`

**Content:**
```
💰 Connect Your Bank Account

Get paid automatically when applicants complete sessions.

HOW PAYOUTS WORK
• Frequency: Every Monday
• Timing: 24-48 hours after session complete
• Fee Structure: $100 service → You earn $80 (20% platform fee)

🔐 Security
Your banking information is handled 100% by Stripe.
The CRNA Club never sees your bank account details.

[CONNECT WITH STRIPE] (Primary)

or

[Set Up Later] (Link)

ℹ️ You won't be able to withdraw earnings until
   your Stripe account is connected and verified.
```

---

## Stripe Connect Express Flow

### 1. Create Express Account

```javascript
const account = await stripe.accounts.create({
  type: 'express',
  country: 'US',
  email: provider.email,
  capabilities: {
    transfers: { requested: true }
  }
});
```

### 2. Create Account Link

```javascript
const accountLink = await stripe.accountLinks.create({
  account: accountId,
  type: 'account_onboarding',
  return_url: `${APP_URL}/marketplace/provider/onboarding/payment/success`,
  refresh_url: `${APP_URL}/marketplace/provider/onboarding/payment/retry`
});
```

### 3. Redirect to Stripe

User completes Stripe's hosted onboarding:
- Legal name, DOB, address
- SSN (US requirement)
- Bank account details
- Identity verification (may require documents)

### 4. Handle Return

**Success:** Check account status, mark provider as payment-ready

**Verification Pending:** Show "Verification in progress (24-48h)"

**Documents Required:** Show link to complete in Stripe dashboard

### 5. Webhook Events

```javascript
// Listen for these events:
'account.updated'      // Verification status changes
'transfer.paid'        // Payout succeeded
'transfer.failed'      // Payout failed
'charge.dispute.created' // Chargeback filed
```

---

## Database Schema

```sql
-- Provider Applications
CREATE TABLE provider_applications (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,

  -- Program Info
  program_name TEXT NOT NULL,
  program_type TEXT NOT NULL,
  program_year INT NOT NULL,
  expected_graduation DATE NOT NULL,
  enrollment_proof_url TEXT,

  -- Background
  undergrad_school TEXT,
  gpa_when_applied DECIMAL(3,1),
  science_gpa DECIMAL(3,1),
  gre_score INT,
  ccrn_when_applied BOOLEAN,
  icu_years INT,
  icu_types TEXT[],

  -- Application
  bio TEXT NOT NULL,
  service_interests TEXT[],

  -- Status
  status TEXT DEFAULT 'pending',
  submitted_at TIMESTAMP,
  reviewed_at TIMESTAMP,
  reviewed_by UUID,

  created_at TIMESTAMP DEFAULT NOW()
);

-- Providers (after approval)
CREATE TABLE providers (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  application_id UUID,

  -- Profile
  tagline TEXT,
  bio TEXT,
  specialties TEXT[],

  -- Stripe
  stripe_account_id TEXT,
  stripe_status TEXT DEFAULT 'pending',
  payouts_enabled BOOLEAN DEFAULT FALSE,

  -- Status
  status TEXT DEFAULT 'active',
  approved_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT NOW()
);

-- Services
CREATE TABLE services (
  id UUID PRIMARY KEY,
  provider_id UUID NOT NULL,

  service_type TEXT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(7,2) NOT NULL,

  is_live BOOLEAN,
  duration_minutes INT,
  delivery_days INT,
  is_active BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## API Endpoints

```
POST   /api/provider/applications           # Submit application
GET    /api/provider/applications/:id       # Get application
PATCH  /api/provider/applications/:id       # Update draft

POST   /api/provider/stripe/create-account  # Create Stripe account
POST   /api/provider/stripe/account-link    # Generate onboarding link
GET    /api/provider/stripe/status          # Check account status

GET    /api/provider/profile                # Get provider profile
PATCH  /api/provider/profile                # Update profile

POST   /api/provider/services               # Create service
GET    /api/provider/services               # List services
PATCH  /api/provider/services/:id           # Update service
DELETE /api/provider/services/:id           # Delete service

# Admin
GET    /api/admin/provider-applications     # List all applications
PATCH  /api/admin/provider-applications/:id/approve
PATCH  /api/admin/provider-applications/:id/reject
PATCH  /api/admin/provider-applications/:id/request-info
```

---

## Edge Cases

### Provider Abandons Application
- Form auto-saves to localStorage
- On return: "Continue where you left off?"

### Provider Abandons Onboarding
- Progress saved per step
- After 7 days inactive: Reminder email
- Dashboard shows "Complete Your Onboarding" banner

### Stripe Verification Fails
- Email provider with explanation
- Link to update info in Stripe dashboard
- Admin notified if urgent

### Admin Rejects, Provider Reapplies
- New application created
- Prior rejection shown (admin context)
- 30-day waiting period enforced

---

## Success Metrics

- Application to approval: < 3 days
- Onboarding completion rate: > 80%
- Stripe verification success: > 95%
- Time to first booking: < 7 days
