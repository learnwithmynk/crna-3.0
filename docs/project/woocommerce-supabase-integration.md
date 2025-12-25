# WooCommerce → Supabase Integration Guide

**Document Version:** 1.0
**Date:** December 9, 2024
**Status:** Approved Architecture
**Related:** [billing-migration-plan.md](./billing-migration-plan.md) (for subscription migration)

---

## Purpose

This document covers how **WooCommerce product purchases** (one-time products, toolkits, digital downloads) integrate with Supabase entitlements. It supplements the billing-migration-plan.md which focuses on subscription migration.

**This document answers:**
- How does a logged-in user's purchase get linked to their Supabase account?
- What happens when a guest purchases a digital product?
- How do thank you pages work?
- What are all the edge cases and fallback options?

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [User ID Mapping](#2-user-id-mapping)
3. [Purchase Flow Scenarios](#3-purchase-flow-scenarios)
4. [Thank You Page Flow](#4-thank-you-page-flow)
5. [Password Setup Flow](#5-password-setup-flow)
6. [Supabase Entitlements Schema](#6-supabase-entitlements-schema)
7. [Edge Cases](#7-edge-cases)
8. [Error Handling & Fallbacks](#8-error-handling--fallbacks)
9. [Implementation Checklist](#9-implementation-checklist)

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PRODUCT PURCHASE FLOW                             │
│                                                                      │
│  React App                    WooCommerce                            │
│  ┌─────────────┐              ┌──────────────────────┐              │
│  │ User clicks │              │ FunnelKit Checkout   │              │
│  │ "Buy Now"   │─────────────►│                      │              │
│  │             │  ?supabase_  │ • Collects payment   │              │
│  │ Adds        │  uid=xxx     │ • Creates order      │              │
│  │ supabase_uid│              │ • Saves supabase_uid │              │
│  │ to URL      │              │   to order meta      │              │
│  └─────────────┘              └──────────┬───────────┘              │
│                                          │                           │
│                                          │ order.completed webhook   │
│                                          ▼                           │
│                               ┌──────────────────────┐              │
│                               │ Supabase Edge        │              │
│                               │ Function             │              │
│                               │                      │              │
│                               │ 1. Extract order     │              │
│                               │ 2. Get supabase_uid  │              │
│                               │ 3. Map products to   │              │
│                               │    entitlements      │              │
│                               │ 4. Upsert to         │              │
│                               │    user_entitlements │              │
│                               │ 5. Sync to Groundhogg│              │
│                               └──────────────────────┘              │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Key Principle: `supabase_uid` as the Link

When a user is logged into the React app, we pass their Supabase user ID (`supabase_uid`) in the checkout URL. This ensures:
- Purchase is linked to correct account regardless of checkout email
- No email matching needed (avoids mismatch issues)
- Works for gift purchases (buyer stays logged in)

---

## 2. User ID Mapping

### How It Works

**Step 1: React app adds `supabase_uid` to checkout URL**

```javascript
// In React app, when user clicks "Buy Now"
const user = supabase.auth.getUser();

const checkoutUrl = new URL('https://thecrnaclub.com/checkout/');
checkoutUrl.searchParams.set('add-to-cart', productId);

if (user) {
  checkoutUrl.searchParams.set('supabase_uid', user.id);
}

window.location.href = checkoutUrl.toString();
// Result: https://thecrnaclub.com/checkout/?add-to-cart=123&supabase_uid=abc-123-def
```

**Step 2: WordPress plugin saves `supabase_uid` to order**

```php
// functions.php or custom plugin

// Save supabase_uid from URL to order meta
add_action('woocommerce_checkout_create_order', function($order) {
  if (isset($_GET['supabase_uid']) && !empty($_GET['supabase_uid'])) {
    $uid = sanitize_text_field($_GET['supabase_uid']);
    $order->update_meta_data('supabase_uid', $uid);
  }
});
```

**Step 3: Supabase Edge Function reads `supabase_uid` from webhook**

```javascript
// supabase/functions/woocommerce-order/index.ts

export async function handleOrder(order) {
  // Get supabase_uid from order meta
  const supabaseUid = order.meta_data.find(m => m.key === 'supabase_uid')?.value;

  // This is the user ID to grant entitlements to
  return supabaseUid;
}
```

### Why Not Use Email Matching?

| Approach | Problem |
|----------|---------|
| Match by checkout email | User might enter different email at checkout |
| Match by WP user email | WP user might not exist or have different email |
| Pass `supabase_uid` in URL | **Guaranteed correct** - links to logged-in user |

---

## 3. Purchase Flow Scenarios

### Scenario A: Logged-in User Buys Digital Product

```
1. User is logged into React app (supabase_uid = "abc-123")
2. User clicks "Buy Resume Template" ($29)
3. React app redirects to:
   https://thecrnaclub.com/checkout/?add-to-cart=456&supabase_uid=abc-123
4. User completes WooCommerce checkout (might use different email)
5. WooCommerce webhook fires: order.completed
6. Supabase Edge Function:
   - Reads supabase_uid = "abc-123" from order meta
   - Maps product 456 → entitlement "resume_template"
   - Inserts into user_entitlements for user "abc-123"
7. User returns to React app → has access immediately
```

**Result:** Entitlement goes to logged-in user, regardless of checkout email.

### Scenario B: Logged-in User Buys Physical Gift

```
1. User is logged into React app (supabase_uid = "abc-123")
2. User clicks "Buy CRNA Planner" (physical product, for a friend)
3. React app redirects to:
   https://thecrnaclub.com/checkout/?add-to-cart=789&supabase_uid=abc-123
4. User enters FRIEND's shipping address at checkout
5. WooCommerce processes order, ships to friend
6. Supabase Edge Function:
   - Sees this is physical-only product with no digital entitlement
   - No entitlement to add
7. User gets order confirmation, friend gets package
```

**Result:** Buyer's account unchanged, friend gets physical item.

### Scenario C: Guest Buys Physical Product Only

```
1. Visitor (not logged in) goes to WooCommerce shop
2. Adds "CRNA Mug" to cart (physical only)
3. Checks out as guest (no account needed)
4. WooCommerce processes order, ships item
5. No supabase_uid in order, no digital product
6. Supabase Edge Function: Does nothing (correct behavior)
```

**Result:** Standard e-commerce, no account needed.

### Scenario D: Guest Buys Digital Product (New Account)

```
1. Visitor (not logged in) goes to WooCommerce shop
2. Adds "Interview Toolkit" to cart (digital product)
3. Checks out with email: newuser@example.com
4. WooCommerce webhook fires: order.completed
5. Supabase Edge Function:
   a. No supabase_uid in order meta
   b. Product has digital entitlement → need account
   c. Check if user exists: SELECT * FROM auth.users WHERE email = 'newuser@example.com'
   d. User doesn't exist → Create new account:
      await supabase.auth.admin.createUser({
        email: 'newuser@example.com',
        email_confirm: true
      });
   e. Generate magic link for password setup
   f. Add entitlement to new user
   g. Send magic link email via Supabase
6. User receives email: "Set up your password to access your purchase"
```

**Result:** New account created, user sets password via magic link.

### Scenario E: Guest Buys Digital Product (Existing Account)

```
1. Visitor (not logged in) goes to WooCommerce shop
2. Adds "Interview Toolkit" to cart
3. Checks out with email: existinguser@example.com
4. WooCommerce webhook fires: order.completed
5. Supabase Edge Function:
   a. No supabase_uid in order meta
   b. Product has digital entitlement → need to find account
   c. Check if user exists: SELECT * FROM auth.users WHERE email = 'existinguser@example.com'
   d. User EXISTS → Add entitlement to existing user
   e. Send email: "Your purchase has been added to your account"
6. User logs in normally → sees new content unlocked
```

**Result:** Entitlement added to existing account, no new account created.

---

## 4. Thank You Page Flow

### Keep FunnelKit Thank You Pages

FunnelKit has existing thank you pages with upsells/bumps. We keep these but redirect to React for password setup when needed.

```
┌─────────────────────────────────────────────────────────────────────┐
│                    THANK YOU PAGE FLOW                               │
│                                                                      │
│  Purchase completes                                                  │
│        │                                                             │
│        ▼                                                             │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │            FunnelKit Thank You Page                          │    │
│  │                                                              │    │
│  │  ✓ Thank you for your purchase!                              │    │
│  │                                                              │    │
│  │  Your order #12345 is confirmed.                             │    │
│  │                                                              │    │
│  │  [View Order Details]                                        │    │
│  │                                                              │    │
│  │  ┌──────────────────────────────────────────────────────┐   │    │
│  │  │ 🎁 Special Offer: Add Interview Toolkit for 50% off! │   │    │
│  │  │              [$48.50] [Add to Order]                 │   │    │
│  │  └──────────────────────────────────────────────────────┘   │    │
│  │                                                              │    │
│  │  ┌──────────────────────────────────────────────────────┐   │    │
│  │  │ 📱 Access your purchase in the CRNA Club app:        │   │    │
│  │  │    [Go to App →]                                     │   │    │
│  │  │                                                       │   │    │
│  │  │    OR if you need to set up your password:           │   │    │
│  │  │    Check your email for a link from us.              │   │    │
│  │  └──────────────────────────────────────────────────────┘   │    │
│  │                                                              │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### React App Processing Page (Optional)

If user clicks "Go to App" before entitlement syncs:

```jsx
// /purchase-complete?order_id=123&order_key=wc_xxx&email=user@example.com

function PurchaseCompletePage() {
  const [status, setStatus] = useState('processing');
  const { order_id, email } = useSearchParams();

  useEffect(() => {
    // Poll for entitlement
    const checkAccess = async () => {
      const { data: entitlements } = await supabase
        .from('user_entitlements')
        .select('*')
        .eq('source_order_id', order_id);

      if (entitlements?.length > 0) {
        setStatus('ready');
      }
    };

    const interval = setInterval(checkAccess, 2000);
    const timeout = setTimeout(() => setStatus('delayed'), 30000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [order_id]);

  if (status === 'processing') {
    return (
      <div className="text-center p-8">
        <Spinner />
        <h2>Setting up your access...</h2>
        <p>This usually takes just a few seconds.</p>
      </div>
    );
  }

  if (status === 'ready') {
    return <Redirect to="/dashboard" />;
  }

  if (status === 'delayed') {
    return (
      <div className="text-center p-8">
        <h2>Almost there!</h2>
        <p>Your purchase is being processed. Check your email or try refreshing in a minute.</p>
        <Button onClick={() => window.location.reload()}>Refresh</Button>
      </div>
    );
  }
}
```

---

## 5. Password Setup Flow

### For New Accounts (Guest Digital Purchase)

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PASSWORD SETUP FLOW                               │
│                                                                      │
│  Supabase Edge Function creates account                              │
│        │                                                             │
│        ▼                                                             │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ Supabase sends magic link email:                             │    │
│  │                                                              │    │
│  │ Subject: Set up your CRNA Club account                       │    │
│  │                                                              │    │
│  │ Hi!                                                          │    │
│  │                                                              │    │
│  │ Thanks for your purchase! Click below to set up your         │    │
│  │ password and access your content.                            │    │
│  │                                                              │    │
│  │ [Set Up My Account]                                          │    │
│  │                                                              │    │
│  │ This link expires in 24 hours.                               │    │
│  │                                                              │    │
│  └─────────────────────────────────────────────────────────────┘    │
│        │                                                             │
│        │ User clicks link                                            │
│        ▼                                                             │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ React App: /auth/set-password?token=xxx                      │    │
│  │                                                              │    │
│  │ ┌────────────────────────────────────────────┐              │    │
│  │ │ Welcome to CRNA Club!                      │              │    │
│  │ │                                            │              │    │
│  │ │ Set your password to access your account.  │              │    │
│  │ │                                            │              │    │
│  │ │ Email: newuser@example.com                 │              │    │
│  │ │                                            │              │    │
│  │ │ New Password: [________________]           │              │    │
│  │ │ Confirm:      [________________]           │              │    │
│  │ │                                            │              │    │
│  │ │ [Create Account]                           │              │    │
│  │ └────────────────────────────────────────────┘              │    │
│  │                                                              │    │
│  └─────────────────────────────────────────────────────────────┘    │
│        │                                                             │
│        │ Password set, user logged in                                │
│        ▼                                                             │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ Dashboard with purchased content unlocked                    │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Supabase Magic Link Generation

```javascript
// In Edge Function after creating user
const { data, error } = await supabase.auth.admin.generateLink({
  type: 'magiclink',
  email: userEmail,
  options: {
    redirectTo: 'https://app.thecrnaclub.com/auth/set-password'
  }
});

// Supabase sends the email automatically
```

### Custom Email Template

Configure in Supabase Dashboard > Authentication > Email Templates:

```html
<!-- Magic Link template -->
<h2>Welcome to CRNA Club!</h2>

<p>Thanks for your purchase! Click below to set up your password and access your content.</p>

<p><a href="{{ .ConfirmationURL }}">Set Up My Account</a></p>

<p>This link expires in 24 hours.</p>

<p>If you didn't make this purchase, you can ignore this email.</p>
```

---

## 6. Supabase Entitlements Schema

```sql
-- User entitlements table
CREATE TABLE user_entitlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entitlement_slug TEXT NOT NULL,
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,  -- NULL = permanent
  source TEXT NOT NULL,    -- 'woocommerce', 'stripe', 'manual', 'promotion'
  source_order_id TEXT,    -- WooCommerce order ID for idempotency
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Prevent duplicate entitlements from same order
  UNIQUE(user_id, entitlement_slug, source_order_id)
);

-- Index for fast lookups
CREATE INDEX idx_user_entitlements_user_id ON user_entitlements(user_id);
CREATE INDEX idx_user_entitlements_slug ON user_entitlements(entitlement_slug);

-- Example data
INSERT INTO user_entitlements (user_id, entitlement_slug, source, source_order_id)
VALUES
  ('abc-123', 'resume_template', 'woocommerce', 'order_12345'),
  ('abc-123', 'interview_toolkit', 'woocommerce', 'order_12346'),
  ('abc-123', 'active_membership', 'stripe', 'sub_xyz789');
```

### Product → Entitlement Mapping

```javascript
// In Edge Function or config
const PRODUCT_ENTITLEMENTS = {
  // WooCommerce Product ID → Entitlement slug
  '123': 'resume_template',
  '456': 'cover_letter_template',
  '789': 'plan_apply_toolkit',
  '101': 'interview_toolkit',
  '202': null,  // Physical product, no digital entitlement
};

function getEntitlementForProduct(productId) {
  return PRODUCT_ENTITLEMENTS[productId] || null;
}
```

---

## 7. Edge Cases

### 7.1 Email Mismatch (Solved)

**Scenario:** User logged in as `sarah@gmail.com` but enters `sarah.smith@work.com` at checkout.

**Solution:** We use `supabase_uid` from URL, not email matching. Entitlement goes to the logged-in account (`sarah@gmail.com`).

### 7.2 User Clears Browser / Session Expires Before Checkout

**Scenario:** User adds item to cart, session expires, they complete checkout as "guest."

**Solution:**
- No `supabase_uid` in URL
- Edge Function falls back to email matching
- If email matches existing account, add entitlement there
- If no match, create new account

### 7.3 Webhook Arrives Before User Created

**Scenario:** Race condition where webhook fires before Supabase account fully created.

**Solution:** Edge Function retries:
```javascript
async function handleOrderWithRetry(order, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await processOrder(order);
      return;
    } catch (error) {
      if (error.code === 'USER_NOT_FOUND' && i < maxRetries - 1) {
        await sleep(2000); // Wait 2 seconds
        continue;
      }
      throw error;
    }
  }
}
```

### 7.4 Duplicate Webhook (Idempotency)

**Scenario:** WooCommerce sends same webhook twice.

**Solution:** Use `source_order_id` in unique constraint:
```sql
UNIQUE(user_id, entitlement_slug, source_order_id)
```

Upsert will ignore duplicates:
```javascript
await supabase
  .from('user_entitlements')
  .upsert({
    user_id: userId,
    entitlement_slug: 'resume_template',
    source: 'woocommerce',
    source_order_id: orderId
  }, {
    onConflict: 'user_id,entitlement_slug,source_order_id'
  });
```

### 7.5 Refund Processed

**Scenario:** Customer requests refund, order status changes to `refunded`.

**Solution:**
1. WooCommerce fires `order.refunded` webhook
2. Edge Function removes entitlement:
```javascript
if (order.status === 'refunded') {
  await supabase
    .from('user_entitlements')
    .delete()
    .eq('source_order_id', orderId);
}
```

### 7.6 supabase_uid Tampering

**Scenario:** Malicious user changes `supabase_uid` in URL to someone else's ID.

**Risk Assessment:** Low risk because:
- They'd need to know someone's UUID (not guessable)
- They still pay for the product
- Worst case: they gift someone a product

**Mitigation (if needed):**
- Add signed token: `?supabase_uid=xxx&sig=hmac(xxx)`
- Verify signature in Edge Function

### 7.7 WordPress Plugin Fails to Save supabase_uid

**Scenario:** Plugin error, `supabase_uid` not saved to order.

**Fallback:**
1. Edge Function logs warning
2. Falls back to email matching
3. If email matches existing Supabase user, use that
4. Monitor alerts for this condition

```javascript
if (!supabaseUid) {
  console.warn(`Order ${orderId} missing supabase_uid, falling back to email`);

  const { data: user } = await supabase.auth.admin.listUsers({
    filter: `email.eq.${order.billing.email}`
  });

  if (user?.users?.[0]) {
    supabaseUid = user.users[0].id;
  }
}
```

---

## 8. Error Handling & Fallbacks

### Webhook Retry Strategy

```javascript
// Supabase Edge Function
const RETRY_DELAYS = [0, 5000, 30000]; // immediate, 5s, 30s

export async function handler(req) {
  const order = await req.json();
  const retryCount = parseInt(req.headers.get('x-retry-count') || '0');

  try {
    await processOrder(order);
    return new Response('OK', { status: 200 });
  } catch (error) {
    if (retryCount < RETRY_DELAYS.length - 1) {
      // Return 500 to trigger WooCommerce retry
      return new Response('Retry', { status: 500 });
    }

    // Max retries reached - log for manual handling
    await logFailedOrder(order, error);

    // Return 200 to stop retries, we'll handle manually
    return new Response('Logged for manual processing', { status: 200 });
  }
}
```

### Failed Order Logging

```sql
CREATE TABLE failed_order_sync (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT NOT NULL,
  order_data JSONB,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Monitoring & Alerts

Set up alerts for:
- Failed webhook processing
- Orders without `supabase_uid` (above threshold)
- New accounts created without entitlements
- Entitlement sync delays > 30 seconds

---

## 9. Implementation Checklist

### WordPress Side

- [ ] Install/create plugin to save `supabase_uid` to order meta
- [ ] Configure WooCommerce webhook for `order.completed`
- [ ] Configure WooCommerce webhook for `order.refunded`
- [ ] Test `supabase_uid` saved correctly on checkout
- [ ] Update FunnelKit thank you pages with "Go to App" button

### Supabase Side

- [ ] Create `user_entitlements` table with indexes
- [ ] Create `failed_order_sync` table
- [ ] Deploy Edge Function for WooCommerce webhook
- [ ] Configure Supabase email templates
- [ ] Test magic link generation
- [ ] Set up monitoring/alerts

### React App Side

- [ ] Update "Buy Now" buttons to include `supabase_uid` in URL
- [ ] Create `/purchase-complete` page with polling
- [ ] Create `/auth/set-password` page for new accounts
- [ ] Test entitlement checks in protected content

### Testing

- [ ] Test logged-in user purchase → instant access
- [ ] Test guest digital purchase → account creation
- [ ] Test guest digital purchase with existing email → adds to account
- [ ] Test guest physical-only purchase → no account created
- [ ] Test refund → entitlement removed
- [ ] Test duplicate webhook → no duplicate entitlement
- [ ] Test email mismatch → correct account receives entitlement

---

## Summary

| Scenario | supabase_uid | Account Action | Entitlement Action |
|----------|--------------|----------------|-------------------|
| Logged-in user buys digital | ✓ In URL | None needed | Add to existing user |
| Logged-in user buys physical | ✓ In URL | None needed | None (physical only) |
| Guest buys physical | ✗ Missing | None needed | None (physical only) |
| Guest buys digital (new email) | ✗ Missing | Create new account | Add to new user |
| Guest buys digital (existing email) | ✗ Missing | None needed | Add to existing user |

**Key principle:** `supabase_uid` in URL is the authoritative link. Email matching is the fallback.

---

*Document Version 1.0 - Created December 9, 2024*
*Supplements billing-migration-plan.md for WooCommerce product purchases*
