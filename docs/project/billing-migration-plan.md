# Billing System Migration Plan: WooCommerce to Stripe Billing

**Document Version:** 2.0
**Date:** December 9, 2024
**Status:** Pending Review
**Author:** Planning Session with Project Owner

---

## Table of Contents

1. [Project Background](#1-project-background)
2. [Current State: How Things Work Now](#2-current-state-how-things-work-now)
3. [Problem Statement](#3-problem-statement)
4. [Recommended Solution: Stripe Billing Migration](#4-recommended-solution-stripe-billing-migration)
5. [Hybrid Checkout Model](#5-hybrid-checkout-model)
6. [Entitlements System](#6-entitlements-system)
7. [Backup Solution: Natural Age-Out](#7-backup-solution-natural-age-out)
8. [System Architecture Maps](#8-system-architecture-maps)
9. [Cancellation Flow](#9-cancellation-flow)
10. [Technical Implementation Details](#10-technical-implementation-details)
11. [Action Items for Dev Team](#11-action-items-for-dev-team)
12. [Risk Assessment](#12-risk-assessment)
13. [Timeline](#13-timeline)
14. [Open Questions](#14-open-questions)

---

## 1. Project Background

### What Is The CRNA Club?

The CRNA Club is a membership platform helping ICU nurses apply to CRNA (Certified Registered Nurse Anesthetist) school. The platform provides:

- School database (~140 CRNA programs)
- Application tracking tools
- Learning modules and digital downloads
- Community forums
- Marketplace for mentorship services (SRNAs helping applicants)
- A la carte digital products (toolkits, guides, templates)

### The Rebuild Context

The CRNA Club is rebuilding its frontend from WordPress to React. As part of this rebuild:

- **Supabase** will become the source of truth for app data and user permissions
- **React frontend** will read permissions from Supabase (not WordPress)
- **WordPress** will remain for content (schools, lessons) but not for app state

This creates a need to rethink how billing, permissions, and access control flow through the system.

---

## 2. Current State: How Things Work Now

> **For Dev Team:** This section explains the existing system so you understand what we're migrating FROM.

### Current Tech Stack

| Component | Current Tool | Role |
|-----------|--------------|------|
| **CMS/Backend** | WordPress | Hosts content, user accounts, plugins |
| **Subscriptions** | WooCommerce Subscriptions | Manages recurring billing, renewal dates |
| **E-commerce** | WooCommerce Shop | Sells subscriptions AND one-time products |
| **Payment Processing** | Stripe (via WooCommerce) | Processes credit card charges |
| **Email/CRM** | Groundhogg | Email marketing, contact tags, automations |
| **Frontend (old)** | WordPress themes | Current member-facing site |
| **Frontend (new)** | React + Vite | New member-facing application |
| **App Database (new)** | Supabase | User data, permissions, app state |

### How Subscriptions Work Today

```
USER SIGNS UP:
1. User goes to WooCommerce checkout page
2. Enters credit card info
3. WooCommerce creates:
   - WordPress user account
   - WooCommerce Subscription record (stored in WP database)
   - Stripe Customer (cus_xxx)
   - Stripe Payment Method (pm_xxx)
4. WooCommerce charges via Stripe
5. Groundhogg automation applies access tags

MONTHLY RENEWAL:
1. WooCommerce cron job checks "subscriptions due today"
2. For each due subscription, WooCommerce calls Stripe API to charge
3. If payment succeeds → subscription stays active
4. If payment fails → WooCommerce marks subscription as "on-hold"
5. Groundhogg tags updated based on status

KEY INSIGHT: WooCommerce does NOT create Stripe Subscription objects.
It stores subscription logic in WordPress database and just uses Stripe
to process individual charges. If you look in Stripe Dashboard →
Subscriptions, it's EMPTY.
```

### How Access Control Works Today

Access is controlled via **Groundhogg tags** applied to user records:

| Tag Pattern | Example | Purpose |
|-------------|---------|---------|
| `03. [Access] - {Product} - Give Access` | `03. [Access] - Premium Member 1 - Give Access` | Grants access to content |
| `02. [Status] - {State}` | `02. [Status] - Premium Member 1 - Active` | Tracks subscription status |

**Current Flow:**
```
WooCommerce Event (purchase, renewal, cancel)
        │
        ▼
Groundhogg Automation (built-in WooCommerce integration)
        │
        ▼
Tag Applied/Removed from Contact
        │
        ▼
WordPress checks tags for content access
```

**Important Clarification:** Groundhogg has **native WooCommerce integration** - it can listen to WooCommerce events directly. WP Fusion is NOT required and is not being used. This simplifies our setup.

### Current Product Offerings

**Subscriptions (recurring):**

| Product | Price | What It Unlocks |
|---------|-------|-----------------|
| Founding Member Tier 1 | $12/month | Full membership access (legacy, locked) |
| Founding Member Tier 2 | $16/month | Full membership access (legacy, locked) |
| Founding Member Tier 3 | $19/month | Full membership access (legacy, locked) |
| CRNA Club Membership | $27/month | Full membership access (current) |

**One-Time Products (a la carte):**

| Product | Price | What It Unlocks |
|---------|-------|-----------------|
| Plan+Apply Toolkit | ~$97 | Plan & Apply content (permanent) |
| Interviewing Toolkit | ~$97 | Interview prep content (permanent) |
| Digital Downloads | Varies | Individual templates, guides |

### Key Business Rules

1. **All subscription tiers grant the same access** - pricing is the only difference
2. **One-time purchases are permanent** - user keeps access even if they cancel membership
3. **Some content overlaps** - Plan+Apply Toolkit and Membership both unlock the same "Plan & Apply" content
4. **Founding member pricing is locked** - these users keep their price forever

---

## 3. Problem Statement

### The Core Challenge

Currently, WooCommerce Subscriptions manages all billing logic:
- Tracks subscription status
- Stores next billing dates
- Triggers renewal charges
- Updates Groundhogg tags (via native Groundhogg integration)

The new React frontend needs to read permissions from Supabase, not WordPress. This creates a question:

**How do we keep Supabase permissions in sync with subscription status?**

### Why This Is Complicated

**WooCommerce doesn't create Stripe Subscriptions.** It uses Stripe only as a payment processor:

```
What WooCommerce does:
├── Creates Stripe Customer (cus_xxx) ✓
├── Saves payment method to Stripe (pm_xxx) ✓
├── Stores subscription logic in WordPress database
├── Runs cron job to trigger charges on renewal date
└── Stripe just processes charges when asked

What WooCommerce does NOT do:
└── Create Stripe Subscription objects (sub_xxx)
```

If you look in Stripe Dashboard → Subscriptions, it's empty. WooCommerce is the "brain" managing subscription schedules. Stripe is just the "hands" processing payments.

### The Original Hybrid Approach (Rejected)

The initial plan was to run two systems in parallel:
- **Legacy users:** Stay on WooCommerce, sync to Supabase
- **New users:** Go to Stripe Billing, sync to Supabase

**Why this was rejected:**
- 12-18 months of dual system maintenance
- Complex routing logic ("which billing system is this user on?")
- Dual webhook systems to maintain
- Edge cases multiply for every scenario
- High ongoing technical debt

### What We Need Instead

A cleaner migration that:
1. Moves everyone to Stripe Billing (single system)
2. Preserves existing payment methods (no card re-entry)
3. Preserves legacy pricing ($12, $16, $19 tiers)
4. Maintains billing dates (no double-charging)
5. Minimizes transition complexity

---

## 4. Recommended Solution: Stripe Billing Migration

### Overview

Migrate all WooCommerce subscriptions to Stripe Billing in a one-time migration. After migration:
- Stripe manages all subscription logic
- Stripe sends webhooks to Supabase
- Supabase is source of truth for React app
- Groundhogg receives data from Supabase for email
- WooCommerce Subscriptions is retired

### Why This Works

**The payment methods already exist in Stripe.** WooCommerce stores Stripe Customer IDs (`cus_xxx`) and payment methods (`pm_xxx`) in Stripe. We can create new Stripe Subscription objects using these existing payment methods.

**Users don't re-enter their credit cards.** The migration creates Stripe Subscriptions attached to their existing saved payment methods.

**Billing dates are preserved.** Stripe's `billing_cycle_anchor` parameter lets us set the first charge date to match their existing WooCommerce renewal date.

### Data Flow After Migration

```
User Action (subscribe, cancel, payment fails)
                    │
                    ▼
             ┌─────────────┐
             │   Stripe    │  Source of truth for billing
             │   Billing   │  Manages renewals automatically
             └──────┬──────┘
                    │
                    │ Webhooks (subscription events)
                    ▼
             ┌─────────────┐
             │  Supabase   │  Source of truth for app permissions
             │             │  React app reads from here
             └──────┬──────┘
                    │
                    │ Webhook (permission changes)
                    ▼
             ┌─────────────┐
             │ Groundhogg  │  Email marketing only
             │             │  Receives subscriber data for email blasts
             └─────────────┘
```

### What Gets Retired vs What Stays

| Tool | Status After Migration | Notes |
|------|------------------------|-------|
| WooCommerce Subscriptions | **RETIRED** | No longer manages subscription billing |
| WooCommerce Shop | **STAYS** | Still used for one-time product purchases |
| Stripe (payment processor) | **UPGRADED** | Now handles subscriptions directly via Stripe Billing |
| Groundhogg | **STAYS** | Receives data from Supabase; keeps native WooCommerce integration for product purchases |
| WP Fusion | **NOT USED** | Was never needed - Groundhogg has native WooCommerce integration |

**Key Clarification:** WooCommerce itself stays for the shop/one-time products. Only WooCommerce *Subscriptions* is retired. See [Section 5: Hybrid Checkout Model](#5-hybrid-checkout-model) for details.

### Email Handling

| Email Type | Sent By |
|------------|---------|
| Payment failed / dunning | Stripe (built-in emails enabled) |
| Welcome sequences | Groundhogg |
| Marketing / broadcasts | Groundhogg |
| Win-back after cancellation | Groundhogg |

Stripe's built-in dunning emails will handle failed payment notifications. Groundhogg handles all marketing and lifecycle emails.

---

## 5. Hybrid Checkout Model

> **Key Decision:** Subscriptions go through Stripe Checkout/Billing. One-time products stay on WooCommerce Shop.

### Why Two Checkout Systems?

We're not replacing ALL of WooCommerce - just the subscription part:

| Purchase Type | Checkout System | Why |
|---------------|-----------------|-----|
| **Subscriptions** | Stripe Checkout → Stripe Billing | Clean recurring billing, webhooks to Supabase |
| **One-time products** | WooCommerce Shop | Already works, no migration needed |

### Subscription Flow (NEW)

```
User wants to subscribe
        │
        ▼
┌─────────────────────────────────────────────┐
│            STRIPE CHECKOUT                   │
│  (hosted checkout page on checkout.stripe.com) │
│                                              │
│  • User enters email, payment method         │
│  • Stripe handles card validation            │
│  • PCI compliance handled by Stripe          │
└─────────────────────────────────────────────┘
        │
        │ Creates:
        │ • Stripe Customer (cus_xxx)
        │ • Stripe Payment Method (pm_xxx)
        │ • Stripe Subscription (sub_xxx) ← NEW!
        ▼
┌─────────────────────────────────────────────┐
│            STRIPE BILLING                    │
│                                              │
│  • Manages subscription lifecycle            │
│  • Auto-charges on renewal date              │
│  • Handles dunning for failed payments       │
│  • Sends webhooks on all events              │
└─────────────────────────────────────────────┘
        │
        │ Webhook: customer.subscription.created
        ▼
┌─────────────────────────────────────────────┐
│            SUPABASE                          │
│                                              │
│  • Creates/updates user record               │
│  • Sets subscription_status = 'active'       │
│  • Adds entitlement: 'active_membership'     │
│  • Triggers Groundhogg tag sync              │
└─────────────────────────────────────────────┘
```

### Product Purchase Flow (UNCHANGED)

```
User wants to buy Plan+Apply Toolkit
        │
        ▼
┌─────────────────────────────────────────────┐
│         WOOCOMMERCE CHECKOUT                 │
│  (existing WordPress checkout page)          │
│                                              │
│  • User enters payment info                  │
│  • WooCommerce processes via Stripe          │
│  • Standard WooCommerce order created        │
└─────────────────────────────────────────────┘
        │
        │ WooCommerce order completed
        ▼
┌─────────────────────────────────────────────┐
│     GROUNDHOGG (native integration)          │
│                                              │
│  • Receives WooCommerce purchase event       │
│  • Applies tag for product access            │
│  • e.g., "03. [Access] - Plan+Apply Toolkit" │
└─────────────────────────────────────────────┘
        │
        │ Webhook to Supabase (or sync job)
        ▼
┌─────────────────────────────────────────────┐
│            SUPABASE                          │
│                                              │
│  • Adds entitlement: 'plan_apply_toolkit'    │
│  • This entitlement is PERMANENT             │
│  • User keeps access even if they cancel     │
│    membership later                          │
└─────────────────────────────────────────────┘
```

### Summary: Where Purchases Go

| Product | Checkout | Billing | Access Tracked In |
|---------|----------|---------|-------------------|
| Membership (any tier) | Stripe Checkout | Stripe Billing | Supabase |
| Plan+Apply Toolkit | WooCommerce | WooCommerce | Supabase (via Groundhogg sync) |
| Interviewing Toolkit | WooCommerce | WooCommerce | Supabase (via Groundhogg sync) |
| Digital downloads | WooCommerce | WooCommerce | Supabase (via Groundhogg sync) |

---

## 6. Entitlements System

> **Key Concept:** Entitlements are "access grants" - permissions that unlock content. They are NOT content items themselves.

### What Is an Entitlement?

An entitlement is a permission stored on the user record that grants access to certain content or features.

```
User Record (Supabase)
├── email: "sarah@example.com"
├── stripe_customer_id: "cus_xxx"
├── subscription_status: "active"
└── entitlements: [
      "active_membership",      ← From active subscription
      "plan_apply_toolkit"      ← From one-time purchase (permanent)
    ]
```

### Entitlement Types

| Entitlement | Source | Permanence |
|-------------|--------|------------|
| `active_membership` | Active subscription (any tier) | **Removed on cancel** |
| `plan_apply_toolkit` | One-time purchase | **Permanent** |
| `interviewing_toolkit` | One-time purchase | **Permanent** |
| `founding_member` | Legacy status (badge only) | **Permanent** |

### Content Has "Unlocked By" Rules

Each piece of content specifies which entitlements can unlock it:

```javascript
// Example: Plan & Apply lesson
{
  id: "lesson_plan_apply_01",
  title: "How to Research CRNA Programs",
  accessible_via: [
    "active_membership",      // Members can access
    "plan_apply_toolkit"      // Toolkit buyers can also access
  ]
}

// Example: Interview prep lesson
{
  id: "lesson_interview_01",
  title: "Common CRNA Interview Questions",
  accessible_via: [
    "active_membership",      // Members can access
    "interviewing_toolkit"    // Toolkit buyers can also access
  ]
}

// Example: Member-only forum
{
  id: "forum_programs",
  title: "CRNA Program Discussions",
  accessible_via: [
    "active_membership"       // ONLY members - not toolkit buyers
  ]
}
```

### Access Check Logic

When user tries to access content, check if they have **ANY** matching entitlement:

```javascript
function canAccess(user, content) {
  // Get user's entitlements array
  const userEntitlements = user.entitlements || [];

  // Get content's required entitlements
  const requiredEntitlements = content.accessible_via || [];

  // User can access if they have ANY matching entitlement
  return requiredEntitlements.some(req =>
    userEntitlements.includes(req)
  );
}

// Example usage:
const user = {
  entitlements: ["plan_apply_toolkit"]  // Bought toolkit, no membership
};

const lesson = {
  accessible_via: ["active_membership", "plan_apply_toolkit"]
};

canAccess(user, lesson);  // TRUE - user has plan_apply_toolkit
```

### What Happens on Subscription Cancel

```
User cancels membership
        │
        ▼
Stripe webhook: customer.subscription.deleted
        │
        ▼
Supabase Edge Function:
├── Sets subscription_status = 'cancelled'
├── REMOVES entitlement: 'active_membership'
├── KEEPS entitlement: 'plan_apply_toolkit' (if they had it)
└── Syncs to Groundhogg (removes access tag, adds cancelled tag)
        │
        ▼
User's access:
├── Plan+Apply content: ✓ STILL ACCESSIBLE (from toolkit purchase)
├── Interview content: ✗ NO ACCESS (membership-only or toolkit needed)
├── Community forums: ✗ NO ACCESS (membership-only)
└── School database: ✗ NO ACCESS (membership-only)
```

### Overlapping Entitlements Example

**Scenario:** User buys Plan+Apply Toolkit, then later subscribes to membership.

```
User Record:
├── entitlements: [
│     "plan_apply_toolkit",   ← From purchase
│     "active_membership"     ← From subscription
│   ]
└── subscription_status: "active"

They now have TWO ways to access Plan+Apply content.
```

**Scenario:** Same user cancels membership.

```
User Record:
├── entitlements: [
│     "plan_apply_toolkit"    ← Still here (permanent)
│   ]
└── subscription_status: "cancelled"

They STILL have access to Plan+Apply content via their toolkit purchase.
Other member-only content is now locked.
```

### Supabase Schema for Entitlements

```sql
-- Users table (add entitlements column)
ALTER TABLE users ADD COLUMN entitlements TEXT[] DEFAULT '{}';

-- Example user record
INSERT INTO users (email, stripe_customer_id, subscription_status, entitlements)
VALUES (
  'sarah@example.com',
  'cus_xxx',
  'active',
  ARRAY['active_membership', 'plan_apply_toolkit']
);

-- Query: Does user have access to content?
SELECT * FROM users
WHERE email = 'sarah@example.com'
AND entitlements && ARRAY['active_membership', 'plan_apply_toolkit'];
-- The && operator checks for array overlap
```

### Groundhogg Tag Mapping

| Entitlement | Groundhogg Tag |
|-------------|----------------|
| `active_membership` | `03. [Access] - Premium Member 1 - Give Access` |
| `plan_apply_toolkit` | `03. [Access] - Plan+Apply Toolkit` |
| `interviewing_toolkit` | `03. [Access] - Interviewing Toolkit` |

When syncing to Groundhogg:
- ADD tag when entitlement is added
- REMOVE tag when entitlement is removed
- For subscriptions: remove on cancel
- For purchases: NEVER remove (permanent)

---

## 7. Backup Solution: Natural Age-Out

If the Stripe migration is deemed too risky or resource-intensive, here is the fallback approach.

### Overview

Keep WooCommerce running for existing users indefinitely. Only new users go through Stripe Billing. Over time, as legacy users naturally churn, the WooCommerce subscriber base shrinks to zero.

### How It Works

```
EXISTING USERS (WooCommerce):
WooCommerce Subscriptions ──► Groundhogg ──► Supabase
(continues as-is)            (WP Fusion)    (sync for React)

NEW USERS (Stripe):
Stripe Billing ──► Supabase ──► Groundhogg
                   (source)     (for email)
```

### Tradeoffs

| Factor | Age-Out Approach |
|--------|------------------|
| **Upfront effort** | Low - minimal migration work |
| **Duration** | Long - 2-3 years until WooCommerce fully empty |
| **Ongoing maintenance** | High - dual systems for years |
| **Routing complexity** | Medium - need "which system" flag per user |
| **Technical debt** | Accumulates over 2-3 years |

### When To Choose This Option

- If dev resources are severely limited
- If migration risk is unacceptable to the business
- If WooCommerce subscriber count is already very low

### Recommendation

**This is the backup plan, not the recommended approach.** The Stripe migration (Option 1) requires more upfront work but eliminates years of dual-system maintenance.

---

## 8. System Architecture Maps

### Current State

```
┌─────────────────────────────────────────────────────────────────┐
│                       CURRENT SYSTEM                            │
│                                                                 │
│  ┌─────────────────┐       ┌─────────────────┐                 │
│  │   WooCommerce   │◄─────►│   Groundhogg    │                 │
│  │  Subscriptions  │       │   (CRM/Email)   │                 │
│  │       +         │ native│                 │                 │
│  │   WooCommerce   │ integ │ • Tags          │                 │
│  │     Shop        │ ration│ • Automations   │                 │
│  │                 │       │ • Email sends   │                 │
│  │ • Subscription  │       │                 │                 │
│  │   logic (WP DB) │       │ NOTE: WP Fusion │                 │
│  │ • Renewal dates │       │ is NOT needed - │                 │
│  │ • Product sales │       │ Groundhogg has  │                 │
│  │ • Status        │       │ native WooComm  │                 │
│  └────────┬────────┘       │ integration     │                 │
│           │                └─────────────────┘                 │
│           │                                                     │
│           ▼                                                     │
│  ┌─────────────────┐                                           │
│  │     Stripe      │                                           │
│  │ (payment only)  │                                           │
│  │                 │                                           │
│  │ • Customers     │                                           │
│  │ • Payment       │                                           │
│  │   methods       │                                           │
│  │ • Charges       │                                           │
│  │                 │                                           │
│  │ NO subscription │                                           │
│  │ objects here!   │                                           │
│  └─────────────────┘                                           │
│                                                                 │
│  ┌─────────────────┐                                           │
│  │   WordPress     │                                           │
│  │   REST API      │                                           │
│  └────────┬────────┘                                           │
│           │                                                     │
│           ▼                                                     │
│  ┌─────────────────┐                                           │
│  │  React Frontend │                                           │
│  │ (reads from WP) │                                           │
│  └─────────────────┘                                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Target State (After Migration)

```
┌─────────────────────────────────────────────────────────────────┐
│                       TARGET SYSTEM                             │
│                                                                 │
│  ┌─────────────────┐      ┌─────────────────┐                  │
│  │     Stripe      │      │   WooCommerce   │                  │
│  │     Billing     │      │     Shop        │                  │
│  │                 │      │   (products)    │                  │
│  │ SUBSCRIPTIONS   │      │                 │                  │
│  │ • Subscriptions │      │ ONE-TIME SALES  │                  │
│  │ • Customers     │      │ • Toolkits      │                  │
│  │ • Auto-renewal  │      │ • Downloads     │                  │
│  │ • Dunning       │      │ • Bundles       │                  │
│  └────────┬────────┘      └────────┬────────┘                  │
│           │                        │                            │
│           │ Webhooks               │ Native integration         │
│           ▼                        ▼                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                      SUPABASE                            │   │
│  │            Source of truth for APP PERMISSIONS           │   │
│  │                                                          │   │
│  │  • User records                                          │   │
│  │  • subscription_status ('active', 'cancelled', etc.)     │   │
│  │  • entitlements[] array:                                 │   │
│  │    - 'active_membership' ← from Stripe (removed on cancel)│   │
│  │    - 'plan_apply_toolkit' ← from WooCommerce (permanent) │   │
│  │    - 'interviewing_toolkit' ← from WooCommerce (permanent)│   │
│  │  • stripe_customer_id, groundhogg_contact_id             │   │
│  │                                                          │   │
│  └────────────────────────┬─────────────────────────────────┘   │
│                           │                                     │
│           ┌───────────────┼───────────────┐                    │
│           │               │               │                    │
│           ▼               ▼               ▼                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐        │
│  │ Groundhogg  │  │    React    │  │   Groundhogg    │        │
│  │ (from       │  │   Frontend  │  │ (from WooComm   │        │
│  │  Supabase)  │  │             │  │  native integ)  │        │
│  │             │  │ Reads       │  │                 │        │
│  │ Receives    │  │ entitlements│  │ Product tags    │        │
│  │ sub tags    │  │ from        │  │ still work via  │        │
│  │ via webhook │  │ Supabase    │  │ native WooComm  │        │
│  └─────────────┘  └─────────────┘  └─────────────────┘        │
│                                                                 │
│  RETIRED:                                                       │
│  • WooCommerce Subscriptions plugin (subscription billing)     │
│                                                                 │
│  STAYS:                                                         │
│  • WooCommerce Shop (one-time product sales)                   │
│  • Groundhogg (email marketing, receives data from Supabase    │
│    for subscriptions, native WooComm for product purchases)    │
│                                                                 │
│  NEVER USED:                                                    │
│  • WP Fusion (Groundhogg has native WooCommerce integration)   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Migration Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    MIGRATION PROCESS                            │
│                                                                 │
│  STEP 1: Export from WooCommerce                               │
│  ┌─────────────────────────────────────────────┐               │
│  │ For each active subscription:               │               │
│  │ • User email                                │               │
│  │ • Stripe Customer ID (cus_xxx)              │               │
│  │ • Current price ($12, $16, $19, or $27)     │               │
│  │ • Next billing date                         │               │
│  │ • Subscription status                       │               │
│  └─────────────────────────────────────────────┘               │
│                         │                                       │
│                         ▼                                       │
│  STEP 2: Create Stripe Subscriptions                           │
│  ┌─────────────────────────────────────────────┐               │
│  │ For each user:                              │               │
│  │ • Look up Stripe Customer (cus_xxx)         │               │
│  │ • Get saved payment method (pm_xxx)         │               │
│  │ • Map price to Stripe Price ID              │               │
│  │ • Create Stripe Subscription:               │               │
│  │   - customer: cus_xxx                       │               │
│  │   - price: price_xxx                        │               │
│  │   - default_payment_method: pm_xxx          │               │
│  │   - billing_cycle_anchor: [next bill date]  │               │
│  │   - proration_behavior: 'none'              │               │
│  └─────────────────────────────────────────────┘               │
│                         │                                       │
│                         ▼                                       │
│  STEP 3: Update Supabase                                       │
│  ┌─────────────────────────────────────────────┐               │
│  │ For each migrated user:                     │               │
│  │ • Store stripe_customer_id                  │               │
│  │ • Store stripe_subscription_id              │               │
│  │ • Set subscription_status = 'active'        │               │
│  │ • Set billing_system = 'stripe'             │               │
│  └─────────────────────────────────────────────┘               │
│                         │                                       │
│                         ▼                                       │
│  STEP 4: Disable WooCommerce                                   │
│  ┌─────────────────────────────────────────────┐               │
│  │ • Cancel WooCommerce subscriptions          │               │
│  │   (does NOT cancel Stripe payment methods)  │               │
│  │ • Disable WooCommerce Subscriptions plugin  │               │
│  │ • Remove WP Fusion subscription triggers    │               │
│  └─────────────────────────────────────────────┘               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 9. Cancellation Flow

This section details how user cancellations flow through the system and sync back to Groundhogg for email automations.

### Cancellation Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    CANCELLATION FLOW                            │
│                                                                 │
│  User clicks "Cancel Subscription"                             │
│  (in React app or Stripe Customer Portal)                      │
│                         │                                       │
│                         ▼                                       │
│  ┌─────────────────────────────────────────────┐               │
│  │              STRIPE                          │               │
│  │                                              │               │
│  │  Subscription status → 'canceled'            │               │
│  │  (or 'cancel_at_period_end' if delayed)      │               │
│  │                                              │               │
│  └─────────────────────────────────────────────┘               │
│                         │                                       │
│                         │ Webhook fires:                        │
│                         │ • customer.subscription.updated       │
│                         │   (status: canceled)                  │
│                         │ • OR customer.subscription.deleted    │
│                         ▼                                       │
│  ┌─────────────────────────────────────────────┐               │
│  │           SUPABASE EDGE FUNCTION             │               │
│  │                                              │               │
│  │  1. Receive Stripe webhook                   │               │
│  │  2. Extract customer_id, status              │               │
│  │  3. Look up user by stripe_customer_id       │               │
│  │  4. Update user record:                      │               │
│  │     • subscription_status = 'cancelled'      │               │
│  │     • updated_at = now()                     │               │
│  │  5. Trigger Groundhogg sync                  │               │
│  │                                              │               │
│  └─────────────────────────────────────────────┘               │
│                         │                                       │
│                         │ Webhook to Groundhogg API:            │
│                         │ POST /wp-json/gh/v4/contacts/{id}/tags│
│                         ▼                                       │
│  ┌─────────────────────────────────────────────┐               │
│  │            GROUNDHOGG                        │               │
│  │                                              │               │
│  │  1. REMOVE tag:                              │               │
│  │     "03. [Access] - Premium Member 1 -       │               │
│  │      Give Access"                            │               │
│  │                                              │               │
│  │  2. ADD tag (optional):                      │               │
│  │     "02. [Status] - Cancelled"               │               │
│  │                                              │               │
│  │  3. Groundhogg automation triggers:          │               │
│  │     • Cancellation confirmation email        │               │
│  │     • Win-back sequence (Day 3, 7, 14)       │               │
│  │     • Survey request                         │               │
│  │                                              │               │
│  └─────────────────────────────────────────────┘               │
│                         │                                       │
│                         ▼                                       │
│  ┌─────────────────────────────────────────────┐               │
│  │          REACT FRONTEND                      │               │
│  │                                              │               │
│  │  Reads from Supabase:                        │               │
│  │  • subscription_status = 'cancelled'         │               │
│  │  • Access revoked                            │               │
│  │  • Shows upgrade/resubscribe prompt          │               │
│  │                                              │               │
│  └─────────────────────────────────────────────┘               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Stripe Webhook Events for Cancellation

| Stripe Event | When It Fires | Action |
|--------------|---------------|--------|
| `customer.subscription.updated` | User cancels (status changes) | Update Supabase, sync to Groundhogg |
| `customer.subscription.deleted` | Subscription fully removed | Update Supabase, sync to Groundhogg |

**Note:** If using `cancel_at_period_end` (cancel at end of billing cycle), the status becomes `active` with `cancel_at_period_end: true`. The subscription actually cancels when the period ends, firing another webhook.

### Groundhogg Tag Changes on Cancellation

| Action | Tag | Purpose |
|--------|-----|---------|
| **REMOVE** | `03. [Access] - Premium Member 1 - Give Access` | Revokes access, removes from member email segments |
| **ADD** (optional) | `02. [Status] - Cancelled` | Triggers win-back automation, tracks cancelled users |
| **ADD** (optional) | `02. [Status] - Cancelled - [Date]` | Tracks when they cancelled for reporting |

### Groundhogg Automations Triggered by Cancellation

When the "Cancelled" tag is applied, Groundhogg can automatically:

1. **Send cancellation confirmation email** (immediate)
2. **Start win-back sequence:**
   - Day 1: "We're sorry to see you go"
   - Day 3: "Here's what you're missing"
   - Day 7: "Special offer to come back"
   - Day 14: Final "We'd love to have you back"
3. **Send cancellation survey** (why did you leave?)
4. **Remove from marketing segments** (stop promotional emails)

### Resubscription Flow

When a cancelled user resubscribes:

```
User clicks "Resubscribe"
         │
         ▼
┌─────────────────┐
│  Stripe Checkout │  Creates new subscription
└────────┬────────┘
         │
         │ Webhook: customer.subscription.created
         ▼
┌─────────────────┐
│    Supabase     │  Updates: subscription_status = 'active'
└────────┬────────┘
         │
         │ Webhook to Groundhogg
         ▼
┌─────────────────┐
│   Groundhogg    │  REMOVE: "02. [Status] - Cancelled"
│                 │  ADD: "03. [Access] - Premium Member 1 - Give Access"
└─────────────────┘
         │
         ▼
   Win-back sequence stops (tag removed)
   Welcome-back email sends
   User regains access in React app
```

### Supabase → Groundhogg Webhook Implementation

**Endpoint to call:**
```
POST https://yoursite.com/wp-json/gh/v4/contacts/{contact_id}/tags

Headers:
  Authorization: Bearer {groundhogg_api_key}
  Content-Type: application/json

Body (to add tag):
{
  "tags": [123]  // Tag ID for "Cancelled"
}

DELETE https://yoursite.com/wp-json/gh/v4/contacts/{contact_id}/tags/{tag_id}
  // To remove access tag
```

**Finding contact by email:**
```
GET https://yoursite.com/wp-json/gh/v4/contacts?email={user_email}
```

### Tag Sync Summary Table

| Subscription Status | Groundhogg Access Tag | Groundhogg Status Tag |
|--------------------|----------------------|----------------------|
| `active` | ✓ Applied | Remove "Cancelled" if present |
| `trialing` | ✓ Applied | - |
| `past_due` | ✓ Keep (grace period) | Optionally add "Payment Failed" |
| `cancelled` | ✗ Removed | Add "Cancelled" |
| `unpaid` | ✗ Removed | Add "Payment Failed" |

---

## 10. Technical Implementation Details

### Stripe Setup

**Products to Create:**

| Product Name | Price | Stripe Price ID (example) |
|--------------|-------|---------------------------|
| CRNA Club Founding $12 | $12/month | price_founding_12 |
| CRNA Club Founding $16 | $16/month | price_founding_16 |
| CRNA Club Founding $19 | $19/month | price_founding_19 |
| CRNA Club Membership | $27/month | price_membership_27 |

**Webhook Events to Configure:**

| Event | Purpose |
|-------|---------|
| `customer.subscription.created` | New subscription → update Supabase → add Groundhogg tag |
| `customer.subscription.updated` | Status change → update Supabase → update Groundhogg tag |
| `customer.subscription.deleted` | Cancelled → update Supabase → remove Groundhogg tag |
| `invoice.payment_succeeded` | Payment success → update Supabase |
| `invoice.payment_failed` | Payment failed → update Supabase → optionally tag in Groundhogg |
| `customer.subscription.trial_will_end` | Trial ending → update Supabase (if applicable) |

**Stripe Email Settings:**

Enable in Stripe Dashboard → Settings → Emails:
- Failed payment emails ✓
- Expiring card emails ✓
- Successful payment receipts ✓

### Supabase Schema

**Users/Permissions Table:**

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `email` | text | User email (unique) |
| `stripe_customer_id` | text | Stripe customer ID (cus_xxx) |
| `stripe_subscription_id` | text | Stripe subscription ID (sub_xxx) |
| `subscription_status` | text | 'active', 'cancelled', 'past_due', 'trialing' |
| `subscription_tier` | text | 'founding_12', 'founding_16', 'founding_19', 'membership' |
| `current_period_end` | timestamp | When current billing period ends |
| `cancel_at_period_end` | boolean | Whether subscription will cancel at period end |
| `entitlements` | text[] | Array of access grants (see Section 6) |
| `billing_system` | text | 'stripe' (for future reference) |
| `groundhogg_contact_id` | integer | Groundhogg contact ID for tag sync |
| `created_at` | timestamp | Record creation |
| `updated_at` | timestamp | Last update |

**Entitlements Column Usage:**

```sql
-- Example values for entitlements array:
-- Active subscriber who also bought toolkit:
entitlements = ARRAY['active_membership', 'plan_apply_toolkit']

-- Cancelled subscriber who had bought toolkit:
entitlements = ARRAY['plan_apply_toolkit']

-- Check if user can access content:
SELECT * FROM users
WHERE id = 'user_xxx'
AND entitlements && ARRAY['active_membership', 'plan_apply_toolkit'];
-- Returns user if they have ANY of the required entitlements
```

### WooCommerce Data to Extract

**User Meta Fields:**

| WooCommerce Field | Location | Use |
|-------------------|----------|-----|
| `_stripe_customer_id` | User meta | Map to Stripe customer |
| Subscription amount | Subscription object | Map to correct price tier |
| Next payment date | Subscription object | Set billing_cycle_anchor |
| Subscription status | Subscription object | Filter active only for migration |

### Webhook Handler Logic (Supabase Edge Function)

**On `customer.subscription.created` or `customer.subscription.updated`:**
```
1. Extract customer_id, subscription_id, status from webhook
2. Look up user in Supabase by stripe_customer_id
3. Update subscription_status, current_period_end
4. If status = 'active' → call Groundhogg API to ADD access tag
5. If status = 'canceled' → call Groundhogg API to REMOVE access tag, ADD cancelled tag
```

**On `customer.subscription.deleted`:**
```
1. Extract customer_id from webhook
2. Look up user in Supabase
3. Update subscription_status to 'cancelled'
4. Call Groundhogg API to REMOVE access tag
5. Call Groundhogg API to ADD cancelled tag
```

**On `invoice.payment_failed`:**
```
1. Extract customer_id from webhook
2. Look up user in Supabase
3. Update subscription_status to 'past_due'
4. Optionally call Groundhogg API to ADD "Payment Failed" tag
```

### WooCommerce Product Purchase → Supabase Sync

When a user purchases a one-time product (toolkit, download), we need to add the entitlement to Supabase:

**Option A: Groundhogg webhook to Supabase**

```
WooCommerce Order Completed
        │
        ▼
Groundhogg (native integration) applies tag
        │
        ▼
Groundhogg automation calls Supabase webhook
POST /functions/v1/add-entitlement
{
  "email": "user@example.com",
  "entitlement": "plan_apply_toolkit"
}
        │
        ▼
Supabase Edge Function adds entitlement to user's array
```

**Option B: Direct WooCommerce webhook**

```
WooCommerce Order Completed
        │
        ▼
WooCommerce webhook to Supabase
POST /functions/v1/woocommerce-order
{
  "order_id": 12345,
  "customer_email": "user@example.com",
  "product_id": 789,  // Plan+Apply Toolkit
  "status": "completed"
}
        │
        ▼
Supabase Edge Function:
1. Maps product_id to entitlement name
2. Adds entitlement to user's array
3. Optionally syncs to Groundhogg
```

**Product ID to Entitlement Mapping:**

| WooCommerce Product | Product ID | Entitlement |
|---------------------|------------|-------------|
| Plan+Apply Toolkit | TBD | `plan_apply_toolkit` |
| Interviewing Toolkit | TBD | `interviewing_toolkit` |

### Groundhogg API Reference

**Find contact by email:**
```
GET /wp-json/gh/v4/contacts?email={email}
Response: { contacts: [{ ID: 123, ... }] }
```

**Add tag to contact:**
```
POST /wp-json/gh/v4/contacts/{contact_id}/tags
Body: { "tags": [tag_id] }
```

**Remove tag from contact:**
```
DELETE /wp-json/gh/v4/contacts/{contact_id}/tags/{tag_id}
```

**Get tag ID by name:**
```
GET /wp-json/gh/v4/tags?search={tag_name}
```

---

## 11. Action Items for Dev Team

### Phase 1: Setup (Week 1)

| # | Task | Owner | Dependencies |
|---|------|-------|--------------|
| 1.1 | Create Stripe Products and Prices ($12, $16, $19, $27) | Dev | Stripe access |
| 1.2 | Set up Stripe webhook endpoint in Supabase | Dev | Supabase access |
| 1.3 | Create Supabase table for user permissions | Dev | Schema design |
| 1.4 | Configure Stripe webhook events | Dev | 1.2 complete |
| 1.5 | Enable Stripe built-in emails (dunning) | Dev | Stripe access |
| 1.6 | Document Groundhogg tag IDs needed for sync | Dev | Groundhogg access |

### Phase 2: Build Migration Tools (Week 2)

| # | Task | Owner | Dependencies |
|---|------|-------|--------------|
| 2.1 | Write WooCommerce export script | Dev | WP database access |
| 2.2 | Validate all users have Stripe Customer IDs | Dev | 2.1 complete |
| 2.3 | Build migration script (create Stripe Subscriptions) | Dev | 1.1, 2.1 complete |
| 2.4 | Build Supabase webhook handler for Stripe events | Dev | 1.2 complete |
| 2.5 | Build Supabase → Groundhogg sync (add/remove tags) | Dev | Groundhogg API access |
| 2.6 | Test Groundhogg tag sync in isolation | Dev | 2.5 complete |

### Phase 3: Test (Week 3)

| # | Task | Owner | Dependencies |
|---|------|-------|--------------|
| 3.1 | Identify 10-20 test users (team members, friendly users) | PM | - |
| 3.2 | Run migration for test users only | Dev | 2.3 complete |
| 3.3 | Verify Stripe subscriptions created correctly | QA | 3.2 complete |
| 3.4 | Verify Supabase updated via webhooks | QA | 3.2 complete |
| 3.5 | Verify Groundhogg tags updated on subscription events | QA | 3.2 complete |
| 3.6 | Test cancellation flow end-to-end | QA | 3.2 complete |
| 3.7 | Wait for test user renewal cycle, verify charge works | QA | 3.2 + time |

### Phase 4: Migrate (Week 4-5)

| # | Task | Owner | Dependencies |
|---|------|-------|--------------|
| 4.1 | Run migration in batches (50-100 users at a time) | Dev | 3.7 pass |
| 4.2 | Monitor for failures after each batch | Dev | 4.1 ongoing |
| 4.3 | Handle edge cases as discovered | Dev | 4.2 ongoing |
| 4.4 | Verify all users migrated | QA | 4.1 complete |

### Phase 5: Cutover (Week 5-6)

| # | Task | Owner | Dependencies |
|---|------|-------|--------------|
| 5.1 | Disable WooCommerce Subscriptions renewal processing | Dev | 4.4 complete |
| 5.2 | Set up Stripe Checkout for new user signups | Dev | - |
| 5.3 | Update React app to read permissions from Supabase | Dev | - |
| 5.4 | Remove WP Fusion subscription triggers | Dev | 5.1 complete |
| 5.5 | Verify Groundhogg automations trigger on cancellation | QA | 5.1 complete |
| 5.6 | Monitor for issues, address support tickets | Support | 5.1 complete |

### Phase 6: Cleanup (Week 6+)

| # | Task | Owner | Dependencies |
|---|------|-------|--------------|
| 6.1 | Document new architecture | Dev | 5.x complete |
| 6.2 | Disable/remove WooCommerce Subscriptions plugin | Dev | 5.x + buffer |
| 6.3 | Archive migration scripts | Dev | 6.2 complete |
| 6.4 | Verify Groundhogg segments use new tag logic | Dev | 6.2 complete |

---

## 12. Risk Assessment

### Migration Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| User missing Stripe Customer ID | Low | Medium | Pre-migration audit, manual handling |
| Expired payment method | Medium | Low | Stripe dunning handles this automatically |
| Wrong price tier mapping | Low | High | Careful mapping, verify in test phase |
| Billing anchor set incorrectly | Low | High | Verify with test users first |
| Webhook failures | Medium | Medium | Retry logic, monitoring, manual fixes |
| Double-charge during migration | Low | High | Use proration_behavior: 'none' |
| Groundhogg tag sync fails | Medium | Medium | Retry logic, reconciliation script |

### Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Support tickets during transition | High | Low | Prepare FAQ, support training |
| Groundhogg tags out of sync | Medium | Medium | Reconciliation script, monitoring |
| Failed migration for subset of users | Medium | Medium | Manual intervention process |
| Groundhogg automations don't trigger | Medium | Medium | Test in Phase 3, verify tag IDs |

### Rollback Plan

If migration fails catastrophically:
1. Re-enable WooCommerce Subscriptions
2. WooCommerce still has subscription data (not deleted)
3. Cancel Stripe Subscriptions created during migration
4. Investigate and fix issues before retry

---

## 13. Timeline

```
Week 1:  Setup
         ├── Stripe products/prices
         ├── Supabase schema
         ├── Webhook infrastructure
         └── Document Groundhogg tag IDs

Week 2:  Build
         ├── Export script
         ├── Migration script
         ├── Webhook handlers
         └── Groundhogg sync function

Week 3:  Test
         ├── Test user migration
         ├── Verify billing works
         ├── Verify webhooks work
         └── Test cancellation → Groundhogg flow

Week 4:  Migrate (Part 1)
         ├── Batch migration
         └── Monitor and fix

Week 5:  Migrate (Part 2) + Cutover
         ├── Complete migration
         ├── Disable WooCommerce
         └── Enable Stripe checkout

Week 6+: Cleanup + Monitor
         ├── Documentation
         ├── Remove old code
         └── Ongoing monitoring
```

**Total Duration:** 6-8 weeks

---

## 14. Open Questions

| # | Question | Needs Answer From | Impact |
|---|----------|-------------------|--------|
| 1 | Exact count of active WooCommerce subscribers? | Data query | Scope of migration |
| 2 | Are there any annual subscriptions? | Business | Different migration logic |
| 3 | Any users without Stripe Customer ID? | Data query | Manual handling needed |
| 4 | Groundhogg tag IDs for access and status tags? | Groundhogg admin | Webhook implementation |
| 5 | Who approves go-live for each phase? | Business | Rollout process |
| 6 | What Groundhogg automations exist for cancellation? | Business | Verify they'll still work |
| 7 | Support team readiness for migration FAQs? | Support | Customer experience |

---

## Summary

### Key Decisions Made

1. **WP Fusion is NOT needed** - Groundhogg has native WooCommerce integration
2. **WooCommerce Shop STAYS** - For one-time product sales (toolkits, downloads)
3. **WooCommerce Subscriptions RETIRES** - Replaced by Stripe Billing
4. **Supabase is source of truth** for app permissions
5. **Entitlements model** - Array of access grants on user record:
   - Subscription entitlements (e.g., `active_membership`) are removed on cancel
   - Purchase entitlements (e.g., `plan_apply_toolkit`) are permanent
6. **Overlapping access** - Content specifies which entitlements can unlock it; user needs ANY matching entitlement
7. **Stripe handles dunning** - Built-in failed payment emails, Groundhogg handles marketing

### Hybrid Checkout Model

| Purchase Type | Where | Billing |
|---------------|-------|---------|
| Subscriptions | Stripe Checkout | Stripe Billing |
| Products (toolkits, downloads) | WooCommerce | WooCommerce (one-time) |

### Long-Term Architecture

```
SUBSCRIPTIONS:     Stripe Billing → Supabase → React + Groundhogg
PRODUCTS:          WooCommerce → Groundhogg → Supabase → React
PERMISSIONS:       Supabase entitlements[] array
ACCESS CHECK:      Does user have ANY required entitlement?
```

### Transition Period (6-8 weeks)

- Migrate existing WooCommerce subscriptions to Stripe Billing
- Test thoroughly before full migration (including cancellation flow)
- Cutover to Stripe-only for subscriptions once migration complete
- WooCommerce Shop continues operating for products

### Backup Plan

If Stripe migration is not feasible:
- Let WooCommerce subscription users age out naturally
- New users go to Stripe, legacy users stay on WooCommerce
- Higher ongoing maintenance but lower upfront risk

### Recommendation

Proceed with Stripe Billing migration. The upfront investment (6-8 weeks) eliminates years of dual-system complexity.

---

*Document Version 2.0 - Updated December 9, 2024*
*Includes: Hybrid checkout model, entitlements system, WP Fusion clarification*
*Prepared for dev team review. Please validate technical assumptions and timeline estimates before finalizing.*
