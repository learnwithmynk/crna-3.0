# useAuth Quick Reference

## Import

```jsx
import { useAuth } from '@/hooks/useAuth';
```

## Basic Usage

```jsx
const { user, isAuthenticated, isLoading } = useAuth();
```

## User Object Properties

```javascript
user.id                  // UUID
user.email               // Email address
user.role                // 'user' | 'admin' | 'provider'
user.entitlements        // Array of entitlement slugs
```

## Common Patterns

### Check if Admin

```jsx
const isAdmin = user?.role === 'admin';
```

### Check Single Entitlement

```jsx
const hasMembership = user?.entitlements?.includes('active_membership');
```

### Check Multiple Entitlements (OR logic)

```jsx
const hasAccess = user?.entitlements?.some(e =>
  ['active_membership', 'trial_access', 'founding_member'].includes(e)
);
```

### Check Multiple Entitlements (AND logic)

```jsx
const hasAll = ['active_membership', 'plan_apply_toolkit'].every(required =>
  user?.entitlements?.includes(required)
);
```

### Conditional Rendering

```jsx
{user?.role === 'admin' && <AdminPanel />}
{user?.entitlements?.includes('active_membership') && <PremiumFeature />}
```

## Available Roles

| Role | Description |
|------|-------------|
| `user` | Default role (applicant) |
| `admin` | Full administrative access |
| `provider` | SRNA mentor/provider |

## Common Entitlements

| Slug | Description |
|------|-------------|
| `active_membership` | Active paying member |
| `trial_access` | 7-day trial access |
| `founding_member` | Lifetime founding member |
| `plan_apply_toolkit` | Plan & Apply toolkit |
| `interviewing_toolkit` | Interviewing toolkit |

## Auth Methods

```jsx
// Sign in
const { data, error } = await signIn('email@example.com', 'password');

// Sign up
const { data, error } = await signUp('email@example.com', 'password', {
  full_name: 'John Doe'
});

// Sign out
await signOut();

// Reset password
await resetPassword('email@example.com');
```

## Loading States

```jsx
if (isLoading) return <LoadingSpinner />;
if (!isAuthenticated) return <LoginPage />;
```

## TypeScript

```typescript
import type { EnrichedUser, UserRole } from '@/types/auth';

const { user }: { user: EnrichedUser | null } = useAuth();
```

## Complete Example

```jsx
import { useAuth } from '@/hooks/useAuth';

function Dashboard() {
  const { user, isAuthenticated, isLoading, signOut } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const isAdmin = user?.role === 'admin';
  const hasPremium = user?.entitlements?.includes('active_membership');

  return (
    <div>
      <h1>Welcome, {user.email}</h1>
      <p>Role: {user.role}</p>

      {isAdmin && <AdminLink />}
      {hasPremium && <PremiumFeatures />}

      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

## Related Hooks

### useUserEntitlements

For detailed entitlement info:

```jsx
import { useUserEntitlements } from '@/hooks/useUserEntitlements';

const {
  entitlements,          // Full objects with details
  expiringEntitlements,  // Expiring within 7 days
  hasEntitlement,        // Helper method
  refetch               // Refresh entitlements
} = useUserEntitlements();
```

### useAccess

For access control logic:

```jsx
import { useAccess } from '@/hooks/useAccess';

const { hasAccess, reason } = useAccess({
  requiredEntitlements: ['active_membership'],
  denyBehavior: 'paywall'
});
```

## Common Mistakes

❌ **Don't** check `user.app_metadata.role`
```jsx
// OLD WAY (don't use)
const isAdmin = user?.app_metadata?.role === 'admin';
```

✅ **Do** check `user.role`
```jsx
// NEW WAY (use this)
const isAdmin = user?.role === 'admin';
```

❌ **Don't** fetch entitlements separately for simple checks
```jsx
// Unnecessary
const { user } = useAuth();
const { entitlementSlugs } = useUserEntitlements();
const hasAccess = entitlementSlugs.includes('active_membership');
```

✅ **Do** use user.entitlements directly
```jsx
// Better
const { user } = useAuth();
const hasAccess = user?.entitlements?.includes('active_membership');
```

## Debugging

### Log User Object

```jsx
console.log('User:', user);
console.log('Role:', user?.role);
console.log('Entitlements:', user?.entitlements);
```

### Check in DevTools

```javascript
// In browser console
window.__AUTH__ = useAuth(); // (if you expose it)
```

### Common Issues

**User is null:** User not signed in
**Role is 'user' but should be 'admin':** Update user_profiles.role in database
**Entitlements is empty:** Check user_entitlements table and RPC function
**Stale data:** User may need to sign out and back in for JWT refresh

## Files

- Implementation: `/src/hooks/useAuth.jsx`
- Types: `/src/types/auth.ts`
- Examples: `/src/hooks/useAuth.example.md`
- Migration: `/supabase/migrations/20251220200000_user_entitlements_and_roles.sql`
