# useAuth Hook - Usage Examples

The `useAuth` hook now automatically includes `role` and `entitlements` in the user object.

## Basic Usage

```jsx
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please sign in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.email}</h1>
      <p>Role: {user.role}</p>
      <p>Entitlements: {user.entitlements.join(', ')}</p>
    </div>
  );
}
```

## Check User Role

```jsx
import { useAuth } from '@/hooks/useAuth';

function AdminPanel() {
  const { user } = useAuth();

  // Check if user is admin
  if (user?.role !== 'admin') {
    return <div>Access denied</div>;
  }

  return <div>Admin Panel</div>;
}
```

## Check User Entitlements

```jsx
import { useAuth } from '@/hooks/useAuth';

function PremiumFeature() {
  const { user } = useAuth();

  // Check if user has active membership
  const hasAccess = user?.entitlements?.includes('active_membership');

  if (!hasAccess) {
    return <div>Upgrade to access this feature</div>;
  }

  return <div>Premium Feature Content</div>;
}
```

## Check Multiple Entitlements

```jsx
import { useAuth } from '@/hooks/useAuth';

function ToolkitFeature() {
  const { user } = useAuth();

  // Check if user has ANY of these entitlements
  const hasAccess = user?.entitlements?.some(entitlement =>
    ['active_membership', 'plan_apply_toolkit', 'trial_access'].includes(entitlement)
  );

  if (!hasAccess) {
    return <div>Subscribe or purchase toolkit to access</div>;
  }

  return <div>Toolkit Content</div>;
}
```

## User Object Structure

```typescript
{
  id: string;                    // User UUID from auth.users
  email: string;                 // User email
  user_metadata: {
    full_name: string;
    avatar_url: string | null;
  };
  role: 'user' | 'admin' | 'provider';  // From user_profiles.role
  entitlements: string[];        // Array of active entitlement slugs
  app_metadata: {
    role: string;                // Synced from user_profiles
  };
  // ... other Supabase auth fields
}
```

## Available Entitlement Slugs

- `active_membership` - Active paying member
- `trial_access` - 7-day trial access
- `founding_member` - Lifetime founding member
- `plan_apply_toolkit` - Plan & Apply toolkit (one-time purchase)
- `interviewing_toolkit` - Interviewing toolkit (one-time purchase)

## Role Types

- `user` - Default role (applicant)
- `admin` - Full administrative access
- `provider` - SRNA mentor/provider

## Notes

- The `role` and `entitlements` are automatically fetched when the user signs in
- They are refreshed on every auth state change
- If there's an error fetching the data, defaults are used: `role: 'user'`, `entitlements: []`
- Only active, non-expired entitlements are included
- The mock user (when Supabase is not configured) has `role: 'admin'` and `entitlements: ['active_membership']`
