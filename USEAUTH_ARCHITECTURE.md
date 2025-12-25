# useAuth Hook Architecture

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Signs In                            │
│                    (or session initializes)                      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Supabase Auth Response                         │
│  { id, email, user_metadata, app_metadata, ... }                │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    enrichUserData(authUser)                      │
│                                                                   │
│  ┌────────────────────────┐    ┌──────────────────────────┐    │
│  │  Fetch from            │    │  Fetch from              │    │
│  │  user_profiles         │    │  user_entitlements       │    │
│  │                        │    │                          │    │
│  │  SELECT role           │    │  CALL RPC:               │    │
│  │  WHERE id = user.id    │    │  get_user_entitlements() │    │
│  │                        │    │                          │    │
│  │  Returns: 'admin'      │    │  Returns: [              │    │
│  │                        │    │    {slug: 'active_...',  │    │
│  │                        │    │     display_name: '...', │    │
│  │                        │    │     expires_at: null}    │    │
│  │                        │    │  ]                       │    │
│  └────────────┬───────────┘    └─────────────┬────────────┘    │
│               │                              │                  │
│               └──────────────┬───────────────┘                  │
│                              │                                  │
│                              ▼                                  │
│                  Extract & Combine:                             │
│                  role = 'admin'                                 │
│                  entitlements = ['active_membership']           │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Enriched User Object                          │
│  {                                                               │
│    id: 'uuid-123',                                              │
│    email: 'user@example.com',                                   │
│    user_metadata: { ... },                                      │
│    app_metadata: { ... },                                       │
│    role: 'admin',                    ← NEW                     │
│    entitlements: ['active_membership'] ← NEW                   │
│  }                                                               │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    setUser(enrichedUser)                         │
│                 Component Re-renders                             │
└─────────────────────────────────────────────────────────────────┘
```

## Database Schema Relationships

```
┌──────────────────┐
│   auth.users     │
│  (Supabase)      │
│                  │
│  - id (PK)       │
│  - email         │
│  - user_metadata │
│  - app_metadata  │
└────────┬─────────┘
         │
         │ 1:1
         │
         ▼
┌──────────────────┐
│  user_profiles   │
│  (Custom)        │
│                  │
│  - id (FK)       │
│  - role ─────────┼──► 'user' | 'admin' | 'provider'
│  - name          │
│  - email         │
└──────────────────┘
         │
         │ 1:N
         │
         ▼
┌────────────────────┐         ┌──────────────────┐
│ user_entitlements  │    N:1  │  entitlements    │
│ (Junction)         │◄────────│  (Lookup)        │
│                    │         │                  │
│  - user_id (FK)    │         │  - slug (PK)     │
│  - entitlement_slug├────────►│  - display_name  │
│  - expires_at      │         │  - is_active     │
│  - source          │         └──────────────────┘
│  - granted_at      │
└────────────────────┘
```

## RPC Function: get_user_entitlements()

```sql
CREATE FUNCTION get_user_entitlements(p_user_id UUID)
RETURNS TABLE (
  entitlement_slug TEXT,
  display_name TEXT,
  expires_at TIMESTAMPTZ,
  source TEXT,
  is_expiring_soon BOOLEAN
)

-- Query:
SELECT
  ue.entitlement_slug,
  e.display_name,
  ue.expires_at,
  ue.source,
  (ue.expires_at IS NOT NULL AND ue.expires_at < NOW() + INTERVAL '7 days') as is_expiring_soon
FROM user_entitlements ue
JOIN entitlements e ON e.slug = ue.entitlement_slug
WHERE ue.user_id = p_user_id
  AND e.is_active = TRUE
  AND (ue.expires_at IS NULL OR ue.expires_at > NOW())
```

## Component Usage Pattern

```jsx
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { user, isLoading, isAuthenticated } = useAuth();

  // user.role is available immediately
  // user.entitlements is available immediately

  if (isLoading) return <Loading />;
  if (!isAuthenticated) return <Login />;

  return (
    <div>
      <h1>Welcome, {user.email}</h1>
      <p>Role: {user.role}</p>
      <p>Entitlements: {user.entitlements.join(', ')}</p>

      {user.role === 'admin' && <AdminPanel />}
      {user.entitlements.includes('active_membership') && <PremiumFeature />}
    </div>
  );
}
```

## Hook Comparison

### Before (using separate hooks)

```jsx
function MyComponent() {
  const { user } = useAuth();
  const { entitlementSlugs } = useUserEntitlements();

  const isAdmin = user?.app_metadata?.role === 'admin';
  const hasAccess = entitlementSlugs.includes('active_membership');

  // 2 hooks, 2 queries, 2 loading states
}
```

### After (using enriched user)

```jsx
function MyComponent() {
  const { user } = useAuth();

  const isAdmin = user?.role === 'admin';
  const hasAccess = user?.entitlements?.includes('active_membership');

  // 1 hook, but still 2 queries (combined in enrichUserData)
}
```

### When to still use `useUserEntitlements`

```jsx
function EntitlementManager() {
  const { user } = useAuth();
  const {
    entitlements,           // Full entitlement objects with details
    expiringEntitlements,   // Entitlements expiring soon
    hasAnyEntitlement,      // Helper method
    refetch                 // Refetch entitlements
  } = useUserEntitlements();

  // Use when you need detailed info or helper methods
  return (
    <div>
      {expiringEntitlements.map(e => (
        <ExpiringWarning
          entitlement={e.display_name}
          expiresAt={e.expires_at}
        />
      ))}
    </div>
  );
}
```

## Error Handling

```
enrichUserData(authUser)
  │
  ├─► Fetch role from user_profiles
  │   ├─► Success: role = data.role
  │   └─► Error: role = 'user' (default)
  │
  ├─► Fetch entitlements via RPC
  │   ├─► Success: entitlements = [...slugs]
  │   └─► Error: entitlements = [] (empty array)
  │
  └─► Return enriched user with defaults on any error
```

## When enrichUserData() is Called

1. **Initial Page Load** (if user signed in)
   - `useEffect` → `supabase.auth.getSession()` → `enrichUserData()`

2. **User Signs In**
   - `signIn()` → `supabase.auth.signInWithPassword()` → `enrichUserData()`

3. **User Signs Up** (if email verification disabled)
   - `signUp()` → `supabase.auth.signUp()` → `enrichUserData()`

4. **Auth State Change** (rare)
   - `onAuthStateChange` → `enrichUserData()`
   - Examples: token refresh, session restored

## Performance Characteristics

### Queries per Auth Event

| Event | Queries | Tables/Functions |
|-------|---------|------------------|
| Sign In | 3 | auth.users, user_profiles, get_user_entitlements() |
| Page Load (signed in) | 3 | auth.users, user_profiles, get_user_entitlements() |
| Token Refresh | 3 | auth.users, user_profiles, get_user_entitlements() |
| Sign Out | 1 | auth.users |

### Query Timing

- **Auth query**: ~50-100ms (Supabase Auth)
- **Role query**: ~20-50ms (Simple SELECT)
- **Entitlements RPC**: ~50-100ms (JOIN + WHERE)
- **Total**: ~120-250ms for full auth with enrichment

### Caching

Currently no caching. Queries run on every auth state change.

**Future optimization ideas:**
- Cache entitlements in localStorage
- Use Supabase Realtime for entitlement updates
- Combine role + entitlements into single query/view
- Add TTL cache in hook state

## Security Notes

### Row Level Security (RLS)

✅ `user_profiles`: Users can read their own profile
✅ `user_entitlements`: Users can read their own entitlements
✅ `get_user_entitlements()`: SECURITY DEFINER function, safe RLS bypass
✅ Only returns data for requested user_id (no privilege escalation)

### Role Sync

The migration includes a trigger that syncs `user_profiles.role` to `auth.users.app_metadata`:

```sql
-- Trigger: on_user_role_change
-- Updates auth.users.raw_app_meta_data when role changes
-- Allows fast JWT-based RLS checks without JOIN
```

This means:
- `user.role` comes from database (fresh)
- `user.app_metadata.role` comes from JWT (may be stale until re-login)
- Use `user.role` for accuracy

## Migration Path

### From WooCommerce/WordPress

```
WooCommerce Subscription
  ↓
WordPress Hook (on subscription change)
  ↓
Webhook to Next.js API
  ↓
API calls Supabase RPC: grant_entitlement()
  ↓
user_entitlements updated
  ↓
User refreshes → enrichUserData() → sees new entitlement
```

### From Stripe (future)

```
Stripe Subscription Created
  ↓
Stripe Webhook
  ↓
Supabase Edge Function
  ↓
Call RPC: grant_entitlement()
  ↓
user_entitlements updated
  ↓
User refreshes → enrichUserData() → sees new entitlement
```

## Testing Checklist

- [ ] Sign in as regular user → `user.role === 'user'`
- [ ] Sign in as admin → `user.role === 'admin'`
- [ ] User with active membership → `user.entitlements.includes('active_membership')`
- [ ] User with trial → `user.entitlements.includes('trial_access')`
- [ ] User with no entitlements → `user.entitlements.length === 0`
- [ ] AdminRoute blocks non-admin users
- [ ] AdminRoute allows admin users
- [ ] Premium features check entitlements correctly
- [ ] Error handling (disconnect Supabase, should use defaults)
- [ ] Mock user works in dev (no Supabase)
