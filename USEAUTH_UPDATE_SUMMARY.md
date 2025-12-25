# useAuth Hook Update Summary

## Overview

The `useAuth` hook has been updated to automatically include user role and entitlements in the returned user object. This eliminates the need to separately fetch user roles and entitlements in components.

## Changes Made

### 1. Updated `/src/hooks/useAuth.jsx`

#### Added `enrichUserData()` function
- Fetches `role` from `user_profiles` table
- Fetches active entitlements using `get_user_entitlements()` RPC function
- Returns enriched user object with role and entitlements array

#### Updated auth state initialization
- Initial session load now calls `enrichUserData()`
- Auth state change listener now calls `enrichUserData()`
- Sign in method now enriches user data
- Sign up method now enriches user data (if user is confirmed)

#### User object now includes:
```javascript
{
  id: string,                    // User UUID
  email: string,                 // User email
  user_metadata: { ... },        // Supabase user metadata
  role: 'user' | 'admin' | 'provider',  // From user_profiles.role
  entitlements: string[],        // Array of active entitlement slugs
  app_metadata: { ... },         // Supabase app metadata
  // ... other Supabase auth fields
}
```

### 2. Created `/src/types/auth.ts`

TypeScript type definitions for:
- `EnrichedUser` - Extended user type with role and entitlements
- `AuthContextValue` - Complete auth context interface
- `UserRole` - Role type union
- `EntitlementSource` - Source type union
- `Entitlement` - Entitlement table interface
- `UserEntitlement` - User entitlement table interface
- `EntitlementWithDetails` - RPC function return type

### 3. Created `/src/hooks/useAuth.example.md`

Comprehensive usage examples showing:
- Basic usage
- Role checking
- Single entitlement checking
- Multiple entitlement checking
- Complete user object structure
- Available entitlement slugs
- Role types

## How It Works

### Data Flow

1. User signs in or session is initialized
2. `enrichUserData()` is called with the auth user object
3. Role is fetched from `user_profiles` table
4. Entitlements are fetched via `get_user_entitlements()` RPC function
5. Entitlement slugs are extracted into an array
6. Enriched user object is set in state

### RPC Function Used

```sql
get_user_entitlements(p_user_id UUID)
```

This function:
- Joins `user_entitlements` with `entitlements` table
- Filters for active entitlements only (`is_active = TRUE`)
- Excludes expired entitlements (`expires_at IS NULL OR expires_at > NOW()`)
- Returns entitlement details including slug, display name, source, etc.

## Usage Examples

### Check if user is admin

```jsx
import { useAuth } from '@/hooks/useAuth';

function AdminPanel() {
  const { user } = useAuth();

  if (user?.role !== 'admin') {
    return <div>Access denied</div>;
  }

  return <div>Admin Panel</div>;
}
```

### Check if user has active membership

```jsx
import { useAuth } from '@/hooks/useAuth';

function PremiumFeature() {
  const { user } = useAuth();

  const hasAccess = user?.entitlements?.includes('active_membership');

  if (!hasAccess) {
    return <div>Upgrade to access this feature</div>;
  }

  return <div>Premium Content</div>;
}
```

### Check if user has any of multiple entitlements

```jsx
import { useAuth } from '@/hooks/useAuth';

function ToolkitFeature() {
  const { user } = useAuth();

  const hasAccess = user?.entitlements?.some(entitlement =>
    ['active_membership', 'plan_apply_toolkit', 'trial_access'].includes(entitlement)
  );

  if (!hasAccess) {
    return <div>Subscribe or purchase toolkit to access</div>;
  }

  return <div>Toolkit Content</div>;
}
```

## Backward Compatibility

### Existing Code

All existing code continues to work:

- `AdminRoute.jsx` already checks `user?.role === 'admin'` ✅
- `useUserEntitlements` hook still works for more detailed entitlement info ✅
- `useAccess` hook still works for access control logic ✅
- All other components using `useAuth` are unaffected ✅

### Mock User

The mock user (used when Supabase is not configured) already includes:
```javascript
{
  role: 'admin',
  entitlements: ['active_membership']
}
```

This ensures development and testing work without Supabase.

## Database Schema

### Tables Used

#### `user_profiles`
- `id` (UUID) - Foreign key to auth.users
- `role` (TEXT) - User role ('user', 'admin', 'provider')
- Default: 'user'

#### `user_entitlements`
- `user_id` (UUID) - Foreign key to auth.users
- `entitlement_slug` (TEXT) - Foreign key to entitlements
- `expires_at` (TIMESTAMPTZ) - Null means never expires
- `source` (TEXT) - How it was granted

#### `entitlements`
- `slug` (TEXT) - Unique identifier
- `display_name` (TEXT) - Human-readable name
- `is_active` (BOOLEAN) - Whether active

### Available Entitlements

- `active_membership` - Active paying member
- `trial_access` - 7-day trial access
- `founding_member` - Lifetime founding member
- `plan_apply_toolkit` - Plan & Apply toolkit (one-time purchase)
- `interviewing_toolkit` - Interviewing toolkit (one-time purchase)

## Error Handling

If there's an error fetching role or entitlements:
- Error is logged to console
- User object still returned with defaults:
  - `role: 'user'`
  - `entitlements: []`
- App continues to function

## Performance Considerations

### Additional Queries

Each auth state change now makes 2 additional queries:
1. Fetch role from `user_profiles`
2. Fetch entitlements via RPC function

### When Queries Run

- On initial page load (if user is signed in)
- On sign in
- On sign up (if email verification not required)
- On auth state change (rare)

### Optimization Opportunities

For future optimization, consider:
- Caching entitlements in localStorage
- Using Supabase Realtime to subscribe to entitlement changes
- Batching role and entitlements into a single query

## Testing

### Manual Testing

1. Sign in as a user
2. Check `user.role` in console
3. Check `user.entitlements` in console
4. Navigate to admin pages (should work for admin users)
5. Access premium features (should work for users with entitlements)

### TypeScript Support

When creating new TypeScript files, import types:

```typescript
import type { EnrichedUser, UserRole } from '@/types/auth';

function MyComponent() {
  const { user } = useAuth();
  // user is typed as EnrichedUser | null
}
```

## Migration Guide

### For Existing Code

No migration needed! The hook is backward compatible.

### For New Code

Instead of:
```jsx
const { user } = useAuth();
const { entitlementSlugs } = useUserEntitlements();

const isAdmin = user?.app_metadata?.role === 'admin';
const hasAccess = entitlementSlugs.includes('active_membership');
```

You can now use:
```jsx
const { user } = useAuth();

const isAdmin = user?.role === 'admin';
const hasAccess = user?.entitlements?.includes('active_membership');
```

### When to Use `useUserEntitlements`

Use `useUserEntitlements` when you need:
- Detailed entitlement information (expires_at, source, display_name)
- Expiring soon warnings
- Ability to refetch entitlements
- Helper methods like `hasAnyEntitlement()`, `hasAllEntitlements()`

Use `user.entitlements` from `useAuth` when you only need:
- Quick access checks
- Simple slug array
- Role and entitlements in same object

## Files Modified

- `/src/hooks/useAuth.jsx` - Main implementation

## Files Created

- `/src/types/auth.ts` - TypeScript type definitions
- `/src/hooks/useAuth.example.md` - Usage examples
- `/USEAUTH_UPDATE_SUMMARY.md` - This file

## Next Steps

### Recommended

1. Test the implementation with Supabase connected
2. Verify admin routes work correctly
3. Verify access control works for premium features
4. Update any components that were manually fetching role/entitlements

### Optional

1. Migrate existing code to use `user.role` instead of `user.app_metadata.role`
2. Add TypeScript to new components using the auth types
3. Add integration tests for role/entitlement checks
4. Consider adding a `useIsAdmin()` helper hook for convenience

## Support

For questions or issues:
1. Check `/src/hooks/useAuth.example.md` for usage examples
2. Check `/src/types/auth.ts` for TypeScript definitions
3. Check migration file `/supabase/migrations/20251220200000_user_entitlements_and_roles.sql`
4. Review RPC functions: `get_user_entitlements()`, `user_has_entitlement()`, `user_has_any_entitlement()`
