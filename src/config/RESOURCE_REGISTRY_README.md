# Resource Registry & Database Sync System

This system provides centralized access control for all pages, features, widgets, and tools in The CRNA Club application.

---

## Overview

### The Two-Part System

1. **Resource Registry** (`src/config/resource-registry.js`)
   - **Defines WHAT exists** in the application
   - Static, version-controlled list of all resources
   - Includes metadata: display names, descriptions, routes, hierarchy

2. **Database Table** (`protected_resources`)
   - **Stores WHO can access** each resource
   - Dynamic, configurable access control
   - Can be modified by admins without code changes

### Why This Separation?

- **Registry changes** → Code deployment required → Git history tracked
- **Access control changes** → Instant update → No code change needed
- Best of both worlds: Structure in code, permissions in database

---

## File Locations

```
src/
├── config/
│   ├── resource-registry.js          # Resource definitions (WHAT exists)
│   └── RESOURCE_REGISTRY_README.md   # This file
├── lib/
│   ├── syncResourceRegistry.js       # Sync utility (registry → DB)
│   └── syncResourceRegistry.test.js  # Validation tests
└── components/
    └── features/
        └── admin/
            └── ResourceRegistrySync.jsx  # Admin UI for syncing

supabase/
└── migrations/
    └── 20251220300000_protected_resources.sql  # Database schema
```

---

## Resource Registry Structure

### Categories

| Category | Description | Example |
|----------|-------------|---------|
| `pages` | Full pages with routes | Dashboard, My Programs, School Database |
| `features` | Major sections within pages | AI Insights, Program Checklist |
| `widgets` | Small UI components | GPA Calculator, ReadyScore Badge |
| `tools` | Standalone utilities | Transcript Analyzer, Timeline Generator |

### Resource Fields

```javascript
{
  slug: 'dashboard',                    // Unique identifier (required)
  displayName: 'Dashboard',             // Human-readable name (required)
  route: '/dashboard',                  // URL pattern (pages only)
  parent: null,                         // Parent slug (features/widgets)
  description: 'Overview and nudges',   // Help text (optional)
  category: 'pages'                     // Added automatically
}
```

### Hierarchy Example

```
dashboard (page)
├── dashboard-ai-tips (feature)
├── dashboard-readyscore (feature)
│   └── readyscore-badge (widget)
└── dashboard-quick-actions (feature)
```

---

## Adding New Resources

### 1. Add to Registry

Edit `src/config/resource-registry.js`:

```javascript
// For a new page
pages: [
  {
    slug: 'my-new-page',
    displayName: 'My New Page',
    route: '/my-new-page',
    description: 'Description of what this page does'
  },
  // ... other pages
]

// For a new feature within a page
features: [
  {
    slug: 'my-new-feature',
    displayName: 'My New Feature',
    parent: 'my-new-page',  // Must reference existing page
    description: 'Feature description'
  },
  // ... other features
]
```

### 2. Validate Registry

Run validation test:

```bash
node src/lib/syncResourceRegistry.test.js
```

This checks for:
- Duplicate slugs
- Missing required fields
- Invalid parent references
- Pages missing routes

### 3. Sync to Database

Option A: **Admin UI** (Recommended)
- Go to Admin → Entitlements
- Use "Resource Registry Sync" component
- Click "Preview Sync" to see changes
- Click "Sync to Database" to apply

Option B: **Direct Function Call**
```javascript
import { syncResourceRegistry } from '@/lib/syncResourceRegistry';

const results = await syncResourceRegistry({ verbose: true });
console.log(results);
```

### 4. Configure Access Control

After syncing, configure WHO can access the resource:

```sql
-- Require active membership
UPDATE protected_resources
SET accessible_via = ARRAY['active_membership', 'trial_access', 'founding_member']
WHERE slug = 'my-new-page';

-- Make public (no login required)
UPDATE protected_resources
SET is_public = TRUE
WHERE slug = 'my-new-page';

-- Admin only (checked by role)
UPDATE protected_resources
SET accessible_via = ARRAY[]::TEXT[]
WHERE slug = 'my-new-page';
```

---

## Sync Behavior

### On CREATE (New Resource)

When a resource exists in registry but NOT in database:

```javascript
// Default accessible_via based on slug patterns:
{
  // Most resources → require membership
  accessible_via: ['active_membership', 'trial_access', 'founding_member'],

  // Public pages → no auth required
  'login', 'terms', 'privacy': {
    is_public: true,
    accessible_via: []
  },

  // Admin pages → role-based check
  'admin-*': {
    accessible_via: [],  // Checked via user role instead
  }
}
```

### On UPDATE (Existing Resource)

When a resource exists in BOTH registry and database:

**Updated:**
- `display_name`
- `description`
- `resource_type`
- `parent_slug`
- `route_pattern`

**Preserved:**
- `accessible_via` (access control)
- `is_public`
- `deny_behavior`
- `metadata`

This allows admins to configure access without code changes.

---

## Database Functions

### Check Access

```sql
-- Check if user can access a resource
SELECT user_can_access_resource('user-uuid', 'school-database');
-- Returns: true/false
```

### Get Accessible Resources

```sql
-- Get ALL resources user can access
SELECT * FROM get_user_accessible_resources('user-uuid');

-- Get only pages user can access
SELECT * FROM get_user_accessible_resources('user-uuid', 'page');
```

### Get Access Details

```sql
-- Get detailed access info (including missing entitlements)
SELECT * FROM get_resource_access_info('user-uuid', 'school-ai-insights');
-- Returns: has_access, deny_behavior, required_entitlements, missing_entitlements
```

### Get Hierarchy

```sql
-- Get full hierarchy for a resource
SELECT * FROM get_resource_hierarchy('stats-ai-analysis');
-- Returns: stats-ai-analysis (0) -> my-stats (1)

-- Get all children of a resource
SELECT * FROM get_child_resources('dashboard');
-- Returns: dashboard-ai-tips, dashboard-readyscore, etc.
```

---

## Access Control Configuration

### Entitlement Slugs

Common entitlements to use in `accessible_via`:

| Slug | Description |
|------|-------------|
| `active_membership` | Paid member |
| `trial_access` | 7-day free trial |
| `founding_member` | Lifetime access |
| `plan_apply_toolkit` | Plan+Apply toolkit purchase |
| `interviewing_toolkit` | Interviewing toolkit purchase |

### Deny Behaviors

When user lacks access, the UI responds based on `deny_behavior`:

| Behavior | UI Response |
|----------|-------------|
| `upgrade_prompt` | Show modal prompting upgrade (default) |
| `blur` | Show blurred preview with overlay |
| `hide` | Completely hide the component |
| `redirect` | Redirect to `redirect_url` |

Example:

```sql
-- Show upgrade prompt for AI insights
UPDATE protected_resources
SET deny_behavior = 'upgrade_prompt'
WHERE slug = 'school-ai-insights';

-- Blur the ReadyScore
UPDATE protected_resources
SET deny_behavior = 'blur'
WHERE slug = 'readyscore';

-- Hide premium tools completely
UPDATE protected_resources
SET deny_behavior = 'hide'
WHERE slug = 'mock-interview';
```

---

## Helper Functions (JavaScript)

### Registry Helpers

```javascript
import {
  getAllResources,
  getResourceBySlug,
  getChildResources,
  getAllPages,
  validateRegistry
} from '@/config/resource-registry';

// Get all resources
const all = getAllResources();
// Returns: [{ slug, displayName, category, route, parent, ... }]

// Get specific resource
const dashboard = getResourceBySlug('dashboard');
// Returns: { slug: 'dashboard', displayName: 'Dashboard', ... }

// Get children of a resource
const dashboardFeatures = getChildResources('dashboard');
// Returns: [{ slug: 'dashboard-ai-tips', ... }, ...]

// Validate registry
const validation = validateRegistry();
// Returns: { valid: true/false, errors: [], totalResources: 142, byCategory: {...} }
```

### Sync Functions

```javascript
import {
  syncResourceRegistry,
  syncSingleResource,
  previewSync
} from '@/lib/syncResourceRegistry';

// Full sync
const results = await syncResourceRegistry({
  dryRun: false,  // Set true to preview
  verbose: true   // Log progress
});

// Sync single resource
const result = await syncSingleResource('dashboard', { verbose: true });

// Preview without writing
const preview = await previewSync();
```

---

## Common Tasks

### Add a New Page

1. Add to registry:
   ```javascript
   pages: [
     {
       slug: 'quiz-lab',
       displayName: 'Quiz Lab',
       route: '/quiz-lab',
       description: 'Practice quizzes and assessments'
     }
   ]
   ```

2. Validate: `node src/lib/syncResourceRegistry.test.js`

3. Sync via Admin UI or `syncResourceRegistry()`

4. Configure access in database (default: active_membership + trial + founding)

### Add a Feature to Existing Page

1. Add to registry:
   ```javascript
   features: [
     {
       slug: 'quiz-ai-feedback',
       displayName: 'AI Feedback',
       parent: 'quiz-lab',
       description: 'AI-powered quiz feedback'
     }
   ]
   ```

2. Sync to database

3. Feature inherits parent's access by default, or configure separately:
   ```sql
   UPDATE protected_resources
   SET accessible_via = ARRAY['active_membership', 'founding_member']  -- No trial
   WHERE slug = 'quiz-ai-feedback';
   ```

### Make a Resource Public

```sql
UPDATE protected_resources
SET is_public = TRUE, accessible_via = ARRAY[]::TEXT[]
WHERE slug = 'terms';
```

### Require Multiple Products (OR Logic)

User needs ANY of these entitlements:

```sql
UPDATE protected_resources
SET accessible_via = ARRAY['active_membership', 'plan_apply_toolkit', 'interviewing_toolkit']
WHERE slug = 'learning-library';
```

### Admin-Only Resource

```sql
UPDATE protected_resources
SET accessible_via = ARRAY[]::TEXT[]
WHERE slug = 'admin-dashboard';
-- Access checked via user.role = 'admin' instead
```

---

## React Integration (Future)

### Protected Route Component

```jsx
import { useResourceAccess } from '@/hooks/useResourceAccess';

function ProtectedRoute({ resourceSlug, children, fallback }) {
  const { hasAccess, denyBehavior, isLoading } = useResourceAccess(resourceSlug);

  if (isLoading) return <LoadingSpinner />;
  if (!hasAccess) {
    if (denyBehavior === 'redirect') return <Navigate to="/upgrade" />;
    if (denyBehavior === 'hide') return null;
    if (denyBehavior === 'blur') return <BlurredContent>{children}</BlurredContent>;
    return <UpgradePrompt />;  // Default: upgrade_prompt
  }

  return children;
}
```

### Protected Feature Component

```jsx
function DashboardAITips() {
  return (
    <ProtectedFeature resourceSlug="dashboard-ai-tips">
      <AITipsCard />
    </ProtectedFeature>
  );
}
```

---

## Troubleshooting

### "Duplicate slug" Error

Each slug must be unique across ALL categories.

**Fix:** Choose a different slug or check for typos.

### "Resource has invalid parent"

Parent slug doesn't exist in registry.

**Fix:** Ensure parent resource is defined first, or check spelling.

### "Page missing route"

All pages must have a `route` field.

**Fix:** Add `route: '/your-route'` to the page definition.

### Sync Shows "Orphaned Resources"

Resources exist in database but not in registry.

**Options:**
- Add them back to registry if still needed
- Delete from database if deprecated
- Leave them (they won't be accessible from new code)

### Access Check Always Returns False

**Check:**
1. Is resource in database? `SELECT * FROM protected_resources WHERE slug = 'your-slug';`
2. Is resource active? `is_active = TRUE`
3. Does user have required entitlements? `SELECT * FROM get_user_entitlements('user-id');`
4. Check hierarchy - parent must be accessible first

---

## Best Practices

### Naming Conventions

- **Slugs:** kebab-case (`dashboard`, `school-ai-insights`)
- **Display Names:** Title Case (`Dashboard`, `School AI Insights`)
- **Prefixes:**
  - Admin pages: `admin-*`
  - Provider pages: `provider-*`
  - Marketplace: `marketplace-*` or `mentor-*`

### Hierarchy Guidelines

- Keep hierarchy shallow (max 3 levels: page → feature → widget)
- Features should always have a parent page
- Tools can be standalone (no parent)

### Access Control Guidelines

- **Default:** Require membership (`active_membership` + `trial_access` + `founding_member`)
- **Public:** Only for legal pages and login/signup
- **Admin:** Empty `accessible_via`, check role instead
- **Premium:** Remove `trial_access` for features not in trial

### Sync Strategy

- **During Development:** Sync after adding new resources
- **In Production:** Sync via admin UI after deployments
- **Always Preview First:** Use dry run to check changes

---

## Migration Path

If migrating from old system:

1. **Audit existing pages/features** - List all currently protected resources
2. **Add to registry** - Create entries for each resource
3. **Validate** - Run `syncResourceRegistry.test.js`
4. **Preview sync** - Check what would change
5. **Migrate access rules** - Configure `accessible_via` arrays
6. **Full sync** - Apply to database
7. **Test** - Verify access checks work correctly
8. **Update code** - Replace old access checks with `user_can_access_resource()`

---

## Support

For questions or issues:

1. Check this README
2. Review `/docs/skills/access-control.md`
3. Read migration file: `supabase/migrations/20251220300000_protected_resources.sql`
4. Test with: `node src/lib/syncResourceRegistry.test.js`

---

**Last Updated:** 2024-12-20
**Version:** 1.0.0
