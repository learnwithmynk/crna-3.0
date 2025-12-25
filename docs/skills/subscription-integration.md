# Subscription Integration

How subscriptions work with WooCommerce and the React frontend.

---

## Overview

Subscriptions are managed by **WooCommerce Subscriptions** on WordPress. The React app:
1. Reads subscription status via API
2. Shows/hides content based on status
3. Redirects to WooCommerce for purchase/upgrade

---

## Subscription Tiers

| Tier | Price | Status | Access Level |
|------|-------|--------|--------------|
| Free/Lead | $0 | `none` | Paywalled preview |
| 7-Day Trial | $0 (then converts) | `trialing` | Full access |
| CRNA Club Membership | ~$27/mo | `active` | Full access |
| Founding Member | $12-19/mo | `active` | Full access (legacy) |
| Toolkit Only | One-time | `toolkit_only` | Specific downloads |
| Cancelled | - | `cancelled` | Free level |
| Expired | - | `expired` | Free level |

---

## User Subscription Data

```javascript
// From GET /crna/v1/user/me

{
  "subscriptionTier": "core",        // "free", "trial", "core", "founding", "toolkit"
  "subscriptionStatus": "active",    // "none", "trialing", "active", "cancelled", "expired"
  "trialEndsAt": null,               // ISO date if trialing
  "subscriptionEndsAt": null,        // ISO date if will expire
  "toolkitsPurchased": [             // If toolkit_only
    "plan_apply_toolkit",
    "interview_toolkit"
  ]
}
```

---

## Groundhogg Tags

Subscription state is tracked via Groundhogg tags:

### Active Member Tags
```
03. [Access] - Premium Member 1 - Give Access
02. [Status] - Premium Member 1 - Active
```

### Trial Tags
```
02. [Status] - 7 Day Free Trial - Active
03. [Access] - Premium Member 1 - Give Access  (same access)
```

### Founding Member Tags
```
03. [Access] - Premium Member Legacy - Give Access
02. [Status] - Founding Member [Legacy Plan 1-4] - Active
```

### Toolkit Tags
```
02. [Status] - Plan + Apply Toolkit - Purchased
02. [Status] - Interview Toolkit - Purchased
```

### Cancelled/Expired
```
02. [Status] - Premium Member 1 - Cancelled
03. [Access] - Premium Member 1 - Give Access  (REMOVED)
```

---

## React Integration

### useSubscription Hook

```jsx
// src/hooks/useSubscription.js

import { useUser } from './useUser';

export function useSubscription() {
  const { user, isLoading } = useUser();
  
  const subscription = {
    tier: user?.subscriptionTier || 'free',
    status: user?.subscriptionStatus || 'none',
    trialEndsAt: user?.trialEndsAt,
    
    // Computed properties
    isActive: ['active', 'trialing'].includes(user?.subscriptionStatus),
    isTrial: user?.subscriptionStatus === 'trialing',
    isFree: !user?.subscriptionStatus || user?.subscriptionStatus === 'none',
    isExpired: user?.subscriptionStatus === 'expired',
    isCancelled: user?.subscriptionStatus === 'cancelled',
    
    // Trial days remaining
    trialDaysLeft: user?.trialEndsAt 
      ? Math.ceil((new Date(user.trialEndsAt) - new Date()) / (1000 * 60 * 60 * 24))
      : null,
    
    // Toolkits
    hasToolkit: (toolkit) => user?.toolkitsPurchased?.includes(toolkit),
    hasPlanApplyToolkit: user?.toolkitsPurchased?.includes('plan_apply_toolkit'),
    hasInterviewToolkit: user?.toolkitsPurchased?.includes('interview_toolkit'),
  };
  
  return { subscription, isLoading };
}
```

### Usage in Components

```jsx
function Dashboard() {
  const { subscription } = useSubscription();
  
  if (!subscription.isActive) {
    return <UpgradePrompt />;
  }
  
  return (
    <div>
      {subscription.isTrial && (
        <TrialBanner daysLeft={subscription.trialDaysLeft} />
      )}
      {/* Full dashboard content */}
    </div>
  );
}
```

---

## Paywall Component

```jsx
// src/components/features/paywall/paywall.jsx

import { useSubscription } from '@/hooks/useSubscription';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

export function Paywall({ children, feature = 'this content' }) {
  const { subscription } = useSubscription();
  
  if (subscription.isActive) {
    return children;
  }
  
  return (
    <div className="relative">
      {/* Blurred preview */}
      <div className="blur-sm pointer-events-none opacity-50">
        {children}
      </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-white/80">
        <div className="text-center p-6 max-w-md">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-yellow-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            Unlock {feature}
          </h3>
          <p className="text-gray-600 mb-4">
            Start your free 7-day trial to access all features.
          </p>
          <Button 
            onClick={() => window.location.href = 'https://thecrnaclub.com/checkout?add-to-cart=TRIAL_PRODUCT_ID'}
            className="bg-yellow-400 hover:bg-yellow-500 text-black"
          >
            Start Free Trial
          </Button>
        </div>
      </div>
    </div>
  );
}
```

---

## Trial Banner

```jsx
// src/components/features/trial/trial-banner.jsx

import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function TrialBanner({ daysLeft }) {
  const isUrgent = daysLeft <= 2;
  
  return (
    <div className={`
      p-4 rounded-lg flex items-center justify-between
      ${isUrgent ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'}
    `}>
      <div className="flex items-center gap-3">
        <AlertCircle className={`w-5 h-5 ${isUrgent ? 'text-red-500' : 'text-yellow-600'}`} />
        <div>
          <p className="font-medium">
            {daysLeft === 1 
              ? 'Your trial ends tomorrow!' 
              : `${daysLeft} days left in your trial`}
          </p>
          <p className="text-sm text-gray-600">
            Subscribe now to keep your access
          </p>
        </div>
      </div>
      <Button
        onClick={() => window.location.href = 'https://thecrnaclub.com/checkout?add-to-cart=MEMBERSHIP_PRODUCT_ID'}
        variant={isUrgent ? 'destructive' : 'default'}
        className={!isUrgent && 'bg-yellow-400 hover:bg-yellow-500 text-black'}
      >
        Subscribe Now
      </Button>
    </div>
  );
}
```

---

## Checkout Links

### Start Free Trial
```javascript
const trialCheckoutUrl = 'https://thecrnaclub.com/checkout?add-to-cart=TRIAL_PRODUCT_ID';
```

### Subscribe (Direct)
```javascript
const subscribeUrl = 'https://thecrnaclub.com/checkout?add-to-cart=MEMBERSHIP_PRODUCT_ID';
```

### Buy Toolkit
```javascript
const planApplyUrl = 'https://thecrnaclub.com/checkout?add-to-cart=PLAN_APPLY_ID';
const interviewUrl = 'https://thecrnaclub.com/checkout?add-to-cart=INTERVIEW_TOOLKIT_ID';
```

### Manage Subscription
```javascript
const manageUrl = 'https://thecrnaclub.com/my-account/subscriptions/';
```

---

## Protected Routes

```jsx
// src/components/layout/protected-route.jsx

import { Navigate } from 'react-router-dom';
import { useSubscription } from '@/hooks/useSubscription';
import { Paywall } from '@/components/features/paywall/paywall';

export function ProtectedRoute({ children, requiresSubscription = false }) {
  const { subscription, isLoading } = useSubscription();
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (requiresSubscription && !subscription.isActive) {
    // Option 1: Show paywall overlay
    return <Paywall>{children}</Paywall>;
    
    // Option 2: Redirect to upgrade page
    // return <Navigate to="/upgrade" replace />;
  }
  
  return children;
}
```

### Route Configuration

```jsx
// In router.jsx

{
  path: 'dashboard',
  element: (
    <ProtectedRoute requiresSubscription>
      <DashboardPage />
    </ProtectedRoute>
  )
}
```

---

## Feature-Level Protection

Some features are protected at the component level:

```jsx
function SchoolDatabasePage() {
  const { subscription } = useSubscription();
  
  return (
    <PageWrapper>
      <PageHeader title="School Database" />
      
      {/* Filters always visible */}
      <SchoolFilters />
      
      {/* Results - show preview if free, full if subscribed */}
      {subscription.isActive ? (
        <SchoolGrid schools={allSchools} />
      ) : (
        <>
          {/* Show first 5 blurred */}
          <SchoolGrid schools={previewSchools} blur />
          <UpgradePrompt 
            message="Subscribe to see all 140 programs"
          />
        </>
      )}
    </PageWrapper>
  );
}
```

---

## Subscription Events

When subscription status changes (via WooCommerce webhooks → Groundhogg):

### New Subscription
1. WooCommerce creates subscription
2. Groundhogg applies access tags
3. User refreshes or re-fetches profile
4. React app grants full access

### Trial Ending
1. Day 5: Groundhogg sends email reminder
2. Day 6: Tag applied for "trial ending soon"
3. Day 7: Either converts or cancels
4. React app updates on next API call

### Cancellation
1. User cancels in WooCommerce
2. Access continues until end of billing period
3. At period end, access tags removed
4. React app reverts to free on next API call

---

## Testing Subscriptions

For development, use mock subscription states:

```javascript
// src/data/mockUser.js

// Active member
export const mockActiveMember = {
  subscriptionTier: 'core',
  subscriptionStatus: 'active',
  trialEndsAt: null,
};

// Trial user (3 days left)
export const mockTrialUser = {
  subscriptionTier: 'trial',
  subscriptionStatus: 'trialing',
  trialEndsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
};

// Free user
export const mockFreeUser = {
  subscriptionTier: 'free',
  subscriptionStatus: 'none',
  trialEndsAt: null,
};

// Toolkit only
export const mockToolkitUser = {
  subscriptionTier: 'toolkit',
  subscriptionStatus: 'none',
  toolkitsPurchased: ['plan_apply_toolkit'],
};
```

Switch between states to test different UIs:

```javascript
// In useUser hook during development
const mockState = 'active'; // 'active', 'trial', 'free', 'toolkit'
```
