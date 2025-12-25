# Access Control System

A comprehensive system for route protection, feature gating, and access control testing.

## Overview

The Access Control system provides:

1. **Route Protection** - AdminRoute and ProviderRoute components for protecting entire pages
2. **Feature Gating** - FeatureGate component for controlling access to specific features/widgets
3. **Preview Mode** - Testing system for admins to preview different user access levels
4. **Access Hooks** - Reusable hooks for checking access permissions

This is essential for:
- Protecting admin and provider-only routes
- Implementing paywall and access restrictions
- Testing different user experiences (free, trial, paid)
- QA testing without creating multiple test accounts
- Demonstrating features to stakeholders

## Components

## Route Protection Components

### ProtectedRoute (`src/components/access/ProtectedRoute.jsx`)

Wraps pages that require specific entitlements to access. Different from `/src/components/auth/ProtectedRoute.jsx` which only checks authentication.

**Usage:**
```jsx
import { ProtectedRoute } from '@/components/access';
import { Routes, Route } from 'react-router-dom';

<Routes>
  <Route path="/schools" element={
    <ProtectedRoute resourceSlug="school-explorer">
      <SchoolExplorerPage />
    </ProtectedRoute>
  } />
</Routes>
```

**Behavior:**
- Shows loading spinner while checking auth and access
- Not authenticated (if requireAuth=true) → redirects to `/login`
- No access → handles based on `denyBehavior`:
  - `'redirect'` → redirects to `/upgrade`
  - `'upgrade_prompt'` → shows UpgradeCard component
  - `'blur'` → shows blurred content with overlay
  - `'hide'` → redirects to `/upgrade`
- Has access → renders children

**Props:**
- `resourceSlug` (string, required) - The slug to check in protected_resources table
- `children` (ReactNode, required) - The page content to render if access granted
- `requireAuth` (boolean, default: true) - Whether authentication is required

**Use Cases:**
- Protecting entire pages that require membership
- Different from AdminRoute/ProviderRoute which check role/status
- Works with useResourceAccess hook to check entitlements
- Respects deny_behavior from protected_resources table

---

### AdminRoute (`src/components/access/AdminRoute.jsx`)

Wraps routes that require admin role.

**Usage:**
```jsx
import { AdminRoute } from '@/components/access';
import { Routes, Route } from 'react-router-dom';

<Routes>
  <Route path="/admin/*" element={
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  } />
</Routes>
```

**Behavior:**
- Not authenticated → redirects to `/login`
- Authenticated but not admin → redirects to `/dashboard`
- Admin → renders children
- Shows loading spinner while checking auth

**Admin Detection:**
Checks both `user.role === 'admin'` AND `user.app_metadata?.role === 'admin'` for compatibility.

---

### ProviderRoute (`src/components/access/ProviderRoute.jsx`)

Wraps routes that require approved provider status.

**Usage:**
```jsx
import { ProviderRoute } from '@/components/access';

<Route path="/marketplace/provider/*" element={
  <ProviderRoute>
    <ProviderDashboard />
  </ProviderRoute>
} />
```

**Behavior:**
- Not authenticated → redirects to `/login`
- Not approved provider → redirects to `/marketplace/provider/application-status`
- Approved provider → renders children
- Shows loading spinner while checking

**Props:**
- `resourceSlug` (optional) - Check entitlements for specific resource access (future enhancement)

---

### FeatureGate (`src/components/access/FeatureGate.jsx`)

Wraps features/widgets that need access control. Supports multiple deny behaviors.

**Usage:**
```jsx
import { FeatureGate } from '@/components/access';

// Hide if no access (default)
<FeatureGate slug="premium_widget">
  <PremiumWidget />
</FeatureGate>

// Show blurred content with upgrade overlay
<FeatureGate slug="advanced_stats" denyBehavior="blur">
  <AdvancedStats />
</FeatureGate>

// Show upgrade card
<FeatureGate slug="marketplace" denyBehavior="upgrade_prompt">
  <MarketplaceContent />
</FeatureGate>

// Custom fallback
<FeatureGate
  slug="premium_feature"
  fallback={<div>This feature requires a subscription.</div>}
>
  <PremiumFeature />
</FeatureGate>
```

**Props:**
- `slug` - Resource slug to check access for
- `children` - Content to show when user has access
- `fallback` - Custom fallback when access denied (default: null)
- `showSkeleton` - Show skeleton while loading (default: true)
- `denyBehavior` - How to handle access denial:
  - `'hide'` - Return null (hide completely)
  - `'blur'` - Show blurred content with upgrade overlay
  - `'upgrade_prompt'` - Show UpgradeCard component
- `className` - Additional CSS classes

---

### PreviewModeBanner (`src/components/access/PreviewModeBanner.jsx`)

Fixed banner at top of viewport when admin is in preview mode.

**Usage:**
```jsx
import { PreviewModeBanner } from '@/components/access';

function App() {
  return (
    <>
      <PreviewModeBanner />
      {/* rest of app */}
    </>
  );
}
```

**Features:**
- Shows which entitlements are being simulated
- "Change" button opens settings dialog to modify preview entitlements
- "Exit Preview" button returns to normal mode
- Only visible to admins in preview mode
- Fixed positioning at top of viewport
- Includes spacer div to prevent content overlap

---

## Access Control Hooks

### useResourceAccess (`src/hooks/useResourceAccess.js`)

Checks if current user has access to a specific resource.

**Usage:**
```jsx
import { useResourceAccess } from '@/hooks/useResourceAccess';

function MyComponent() {
  const { hasAccess, isLoading, denyBehavior } = useResourceAccess('premium_dashboard');

  if (isLoading) return <Spinner />;
  if (!hasAccess) return <UpgradePrompt />;

  return <PremiumDashboard />;
}
```

**Returns:**
- `hasAccess` (boolean) - Whether user has access
- `isLoading` (boolean) - Loading state
- `denyBehavior` (string) - Suggested behavior: 'hide', 'blur', 'upgrade_prompt'
- `slug` (string) - The resource slug being checked

**Related Functions:**
- `useAccess` - Alias for `useResourceAccess`
- `useEntitlementAccess(slug)` - Check for specific entitlement
- `useAnyEntitlementAccess([slugs])` - Check if user has ANY of the entitlements

---

### useProviderStatus (`src/hooks/useProviderStatus.js`)

Fetches current user's provider profile status from `provider_profiles` table.

**Usage:**
```jsx
import { useProviderStatus } from '@/hooks/useProviderStatus';

function ProviderSettings() {
  const {
    isApproved,
    isPending,
    status,
    isLoading
  } = useProviderStatus();

  if (isLoading) return <Spinner />;
  if (!isApproved) return <Navigate to="/application-status" />;

  return <ProviderSettingsForm />;
}
```

**Returns:**
- `profile` - Full provider profile object
- `status` - Status string: 'pending', 'approved', 'suspended'
- `isProvider` - Whether user has a provider profile
- `isApproved` - Status is 'approved'
- `isPending` - Status is 'pending'
- `isSuspended` - Status is 'suspended'
- `hasStripeConnected` - Stripe Connect onboarding complete
- `hasCalComConnected` - Cal.com integration connected
- `isAvailable/isLimited/isUnavailable` - Availability status
- `isLoading` - Loading state
- `error` - Error message if fetch failed
- `refetch()` - Function to refetch provider status

---

## Preview Mode Components

### 1. `usePreviewMode` Hook (`src/hooks/usePreviewMode.js`)

Context-based hook that manages preview mode state via URL parameters.

**Features:**
- Stores preview state in URL params (`?preview_as=trial_access,active_membership`)
- Syncs across page navigation
- Provides simple API for entering/exiting preview mode

**API:**

```javascript
const {
  isPreviewMode,        // boolean - whether preview mode is active
  previewEntitlements,  // string[] - current preview entitlements
  startPreview,         // (entitlements: string[]) => void
  exitPreview,          // () => void
} = usePreviewMode();
```

**Usage:**

```javascript
import { usePreviewMode } from '@/hooks/usePreviewMode';

function MyComponent() {
  const { isPreviewMode, previewEntitlements, exitPreview } = usePreviewMode();

  // Use preview entitlements in access control logic
  const effectiveEntitlements = isPreviewMode
    ? previewEntitlements
    : user?.entitlements || [];

  const hasAccess = effectiveEntitlements.includes('active_membership');

  return (
    <div>
      {hasAccess ? <PremiumContent /> : <PaywallPrompt />}
    </div>
  );
}
```

### 2. `PreviewLauncher` Component

Modal dialog for launching preview mode with different entitlements.

**Features:**
- Quick presets (Free User, Trial, Basic Member, Premium)
- Checkbox list for granular entitlement selection
- Visual preview summary

**Props:**

```typescript
interface PreviewLauncherProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entitlements: Array<{
    slug: string;
    display_name?: string;
    description?: string;
  }>;
}
```

**Usage:**

```javascript
import { useState } from 'react';
import { PreviewLauncher } from '@/components/access';
import { useEntitlements } from '@/hooks/useEntitlements';

function AdminPanel() {
  const [isLauncherOpen, setIsLauncherOpen] = useState(false);
  const { entitlements } = useEntitlements();

  return (
    <>
      <Button onClick={() => setIsLauncherOpen(true)}>
        Test Access Control
      </Button>

      <PreviewLauncher
        open={isLauncherOpen}
        onOpenChange={setIsLauncherOpen}
        entitlements={entitlements}
      />
    </>
  );
}
```

### 3. `PreviewModeIndicator` Component

Sticky banner that appears when preview mode is active.

**Features:**
- Shows current preview entitlements
- Provides exit button
- Automatically hidden when not in preview mode

**Usage:**

```javascript
import { PreviewModeIndicator } from '@/components/access';

export function PageWrapper({ children }) {
  return (
    <>
      <PreviewModeIndicator />
      <main>{children}</main>
    </>
  );
}
```

### 4. `PreviewModeExample` Component

Complete reference implementation showing all features in action.

View this component to see:
- How to integrate all pieces
- Example access control patterns
- Integration instructions

## Integration Guide

### Step 1: Add Provider to App

Wrap your app with `PreviewModeProvider` in `App.jsx`:

```javascript
import { PreviewModeProvider } from '@/hooks/usePreviewMode';

function App() {
  return (
    <AuthProvider>
      <PreviewModeProvider>
        <ThemeProvider theme="coral" background="dusk">
          <RouterProvider router={router} />
        </ThemeProvider>
      </PreviewModeProvider>
    </AuthProvider>
  );
}
```

### Step 2: Add Indicator to Layout

Add the preview mode indicator to your main layout (e.g., `PageWrapper`):

```javascript
import { PreviewModeIndicator } from '@/components/access';

export function PageWrapper({ children }) {
  return (
    <div className="min-h-screen">
      <PreviewModeIndicator />
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}
```

### Step 3: Integrate with Access Control

Update your access control logic to use preview entitlements when in preview mode:

```javascript
import { useAuth } from '@/hooks/useAuth';
import { usePreviewMode } from '@/hooks/usePreviewMode';

function useEffectiveEntitlements() {
  const { user } = useAuth();
  const { isPreviewMode, previewEntitlements } = usePreviewMode();

  // In preview mode, use preview entitlements
  // Otherwise, use real user entitlements
  return isPreviewMode
    ? previewEntitlements
    : user?.entitlements || [];
}

// Then in your components:
function ProtectedContent() {
  const entitlements = useEffectiveEntitlements();
  const hasAccess = entitlements.includes('active_membership');

  if (!hasAccess) {
    return <PaywallPrompt />;
  }

  return <PremiumContent />;
}
```

### Step 4: Add Preview Launcher Trigger

Add a button in admin areas to open the preview launcher:

```javascript
import { useState } from 'react';
import { PreviewLauncher } from '@/components/access';
import { useEntitlements } from '@/hooks/useEntitlements';
import { Eye } from 'lucide-react';

function AdminToolbar() {
  const [showLauncher, setShowLauncher] = useState(false);
  const { entitlements } = useEntitlements();

  return (
    <>
      <Button onClick={() => setShowLauncher(true)}>
        <Eye className="h-4 w-4 mr-2" />
        Test Access Control
      </Button>

      <PreviewLauncher
        open={showLauncher}
        onOpenChange={setShowLauncher}
        entitlements={entitlements}
      />
    </>
  );
}
```

## URL Parameter Format

Preview mode uses the `preview_as` URL parameter:

```
# Free user (no entitlements)
?preview_as=

# Trial user
?preview_as=trial_access

# Member with multiple entitlements
?preview_as=active_membership,trial_access

# Combined with other params
?tab=settings&preview_as=active_membership
```

The URL parameter:
- Persists across page navigation
- Can be shared with team members for testing
- Automatically syncs with preview mode state

## Quick Presets

The Preview Launcher includes these presets:

1. **Free User** - No entitlements (paywalled/blurred preview)
2. **Trial User** - `trial_access` entitlement only
3. **Basic Member** - `active_membership` entitlement only
4. **Premium Member** - All available entitlements (for comprehensive testing)

## Best Practices

### 1. Use Preview Mode for Testing

Always test access control changes in preview mode before deploying:

```javascript
// Test all states:
// - No entitlements (free user)
// - Trial access only
// - Active membership only
// - Multiple entitlements
```

### 2. Centralize Access Control Logic

Create a custom hook to centralize entitlement checking:

```javascript
// src/hooks/useAccess.js
export function useAccess() {
  const { user } = useAuth();
  const { isPreviewMode, previewEntitlements } = usePreviewMode();

  const effectiveEntitlements = isPreviewMode
    ? previewEntitlements
    : user?.entitlements || [];

  return {
    hasAccess: (requiredEntitlement) =>
      effectiveEntitlements.includes(requiredEntitlement),
    hasAnyAccess: (requiredEntitlements) =>
      requiredEntitlements.some(e => effectiveEntitlements.includes(e)),
    hasAllAccess: (requiredEntitlements) =>
      requiredEntitlements.every(e => effectiveEntitlements.includes(e)),
    entitlements: effectiveEntitlements,
  };
}
```

### 3. Visual Indicators

Always show when preview mode is active to avoid confusion:

```javascript
// The PreviewModeIndicator component handles this automatically
<PreviewModeIndicator />
```

### 4. Clear Exit Path

Make it easy to exit preview mode:

```javascript
const { exitPreview } = usePreviewMode();

<Button onClick={exitPreview}>
  Exit Preview Mode
</Button>
```

## Advanced Usage

### Testing Specific Scenarios

Create custom preview links for common test scenarios:

```javascript
// Share these links with QA team
const testLinks = {
  freeUser: '?preview_as=',
  trialUser: '?preview_as=trial_access',
  basicMember: '?preview_as=active_membership',
  premiumMember: '?preview_as=active_membership,trial_access,toolkit_access',
};
```

### Conditional Features Based on Preview

Add developer tools that only appear in preview mode:

```javascript
const { isPreviewMode } = usePreviewMode();

return (
  <div>
    {isPreviewMode && (
      <div className="fixed bottom-4 right-4">
        <DevTools />
      </div>
    )}
  </div>
);
```

### Testing Paywall Variants

Test different paywall messages for different user types:

```javascript
const { previewEntitlements } = usePreviewMode();

const paywallMessage = previewEntitlements.includes('trial_access')
  ? 'Your trial has ended. Upgrade to continue.'
  : 'Unlock this feature with a membership.';
```

## Troubleshooting

### Preview Mode Not Activating

1. Ensure `PreviewModeProvider` is wrapping your app
2. Check that URL parameter is formatted correctly
3. Verify no other code is stripping URL params

### Entitlements Not Loading

1. Check that `useEntitlements()` is successfully fetching data
2. Verify Supabase connection is configured
3. Check browser console for errors

### Access Control Not Respecting Preview Mode

1. Ensure access control logic checks `isPreviewMode`
2. Use `previewEntitlements` when in preview mode
3. Centralize access control logic to avoid inconsistencies

## Files

### Route Protection Components
- `/src/components/access/ProtectedRoute.jsx` - Entitlement-based page protection
- `/src/components/access/AdminRoute.jsx` - Admin-only route wrapper
- `/src/components/access/ProviderRoute.jsx` - Provider-only route wrapper
- `/src/components/access/FeatureGate.jsx` - Feature-level access control
- `/src/components/access/PreviewModeBanner.jsx` - Preview mode status banner
- `/src/components/ui/UpgradeCard.jsx` - Upgrade prompt component

### Hooks
- `/src/hooks/useResourceAccess.js` - Resource access checking hook
- `/src/hooks/useProviderStatus.js` - Provider profile status hook
- `/src/hooks/usePreviewMode.js` - Preview mode context and hook

### Preview Mode Components (Legacy)
- `/src/components/access/PreviewLauncher.jsx` - Modal for launching preview
- `/src/components/access/PreviewModeIndicator.jsx` - Banner showing active preview
- `/src/components/access/PreviewModeExample.jsx` - Complete reference implementation

### Exports
- `/src/components/access/index.js` - Barrel exports for all components
- `/src/hooks/index.js` - Barrel exports for all hooks
- `/src/components/access/README.md` - This documentation

## Related Documentation

- `/docs/skills/access-control.md` - General access control patterns
- `/src/hooks/useEntitlements.js` - Entitlement management
- `/src/hooks/useAuth.jsx` - Authentication context
