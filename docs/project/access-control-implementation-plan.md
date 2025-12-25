# Access Control System - Implementation Plan

> **Document Version:** 1.1
> **Created:** December 16, 2024
> **Updated:** December 20, 2024
> **Status:** Prerequisites Complete, Ready for Implementation
> **Estimated Effort:** 2-3 days

---

## Prerequisites (Added Dec 20, 2024)

Before implementing the access control system, the following foundational pieces must be in place:

### ✅ Completed: User Entitlements & Roles Migration

**Migration:** `20251220200000_user_entitlements_and_roles.sql`

This migration addresses critical gaps:

| Component | Description |
|-----------|-------------|
| `user_profiles.role` column | Values: `'user'`, `'admin'`, `'provider'`. Syncs to `auth.users.app_metadata` for fast RLS checks. |
| `user_entitlements` table | Junction table linking users to entitlements with expiry, source tracking, and metadata. |
| `trial_access` entitlement | Separate entitlement for trial users (can have limited access vs full members). |
| `founding_member` entitlement | For legacy founding members with lifetime access. |
| Helper functions | `grant_entitlement()`, `revoke_entitlement()`, `get_user_entitlements()`, `user_has_entitlement()`, `user_has_any_entitlement()` |

**Key Design Decisions:**

1. **Entitlements stored in database, not derived in code** - Stripe webhooks insert/delete entitlement rows
2. **Trial as separate entitlement** - `trial_access` with `expires_at` allows limiting trial features
3. **Role synced to JWT** - Trigger syncs `user_profiles.role` to `auth.users.raw_app_meta_data` for fast RLS
4. **Admin check pattern** - RLS policies check both JWT claim and user_profiles fallback

**Usage Examples:**
```sql
-- Grant trial access (expires in 7 days)
SELECT * FROM grant_entitlement(
  p_user_id := 'user-uuid',
  p_entitlement_slug := 'trial_access',
  p_source := 'trial',
  p_expires_at := NOW() + INTERVAL '7 days'
);

-- Grant subscription entitlement (from Stripe webhook)
SELECT * FROM grant_entitlement(
  p_user_id := 'user-uuid',
  p_entitlement_slug := 'active_membership',
  p_source := 'subscription',
  p_source_id := 'sub_xxxxx'
);

-- Check access in RLS policy or query
SELECT user_has_any_entitlement('user-uuid', ARRAY['active_membership', 'trial_access']);
```

### Still Needed: Frontend Hooks

Before implementing `ProtectedRoute` and `FeatureGate`, create:

1. **`useUserEntitlements`** - Fetches user's active entitlements from `user_entitlements` table
2. **`useProviderStatus`** - Fetches provider status from `provider_profiles` table
3. **Update `useAuth`** - Include entitlements and role in returned user object

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Goals & Requirements](#goals--requirements)
3. [Current State Analysis](#current-state-analysis)
4. [Proposed Architecture](#proposed-architecture)
5. [Database Schema](#database-schema)
6. [Complete Route Mapping](#complete-route-mapping)
7. [Implementation Phases](#implementation-phases)
8. [Code Examples](#code-examples)
9. [Admin UI Specifications](#admin-ui-specifications)
10. [Preview Mode ("View As")](#preview-mode-view-as)
11. [Smart Warnings System](#smart-warnings-system)
12. [Testing Requirements](#testing-requirements)
13. [Migration Strategy](#migration-strategy)
14. [Safeguards & Edge Cases](#safeguards--edge-cases)
15. [Future Considerations](#future-considerations)
16. [Appendix](#appendix)

---

## Executive Summary

### The Problem

The CRNA Club platform currently has a **hybrid access control system**:

- **Content** (downloads, modules, lessons) → Managed via admin forms with `accessible_via` fields ✅
- **Pages, features, widgets** → Hardcoded in component files scattered across the codebase ❌

This creates several issues:
1. No single view of "what does entitlement X unlock?"
2. Changing page access requires code deployment
3. Easy to forget protecting new features
4. No way to preview what different user tiers see
5. Creating promos/bundles requires developer involvement

### The Solution

Implement a **fully database-driven access control system** with:

1. **Centralized resource registry** - All protectable resources in one database table
2. **Unified admin UI** - Single page to view and edit all access rules
3. **Default protection rules** - New items protected automatically
4. **Preview mode** - "View as" feature to test user experiences
5. **Smart warnings** - Automatic detection of misconfigured access rules

### Key Principle

```
Code declares WHAT exists (resource registry)
Database stores WHO can access it (entitlements)
Admin UI manages BOTH in one place
```

---

## Goals & Requirements

### Primary Goals

| Goal | Success Criteria |
|------|------------------|
| Single source of truth | All access rules viewable in one admin page |
| No-code access changes | Change who sees a page without deploying code |
| Prevent accidental exposure | New items protected by default |
| Audit capability | Know what each entitlement unlocks at a glance |
| Self-service promos | Admin can create bundles without developer |

### Functional Requirements

1. **FR-1:** All pages, features, widgets, downloads, modules, and lessons must be viewable in one admin interface
2. **FR-2:** Access rules must be editable from the centralized admin page (not just item-specific forms)
3. **FR-3:** New content must have default protection applied automatically
4. **FR-4:** Admin must be able to preview the app as any entitlement combination
5. **FR-5:** System must warn about misconfigured or unprotected items
6. **FR-6:** Changes to access rules must not require code deployment
7. **FR-7:** Bulk editing of access rules must be supported

### Non-Functional Requirements

1. **NFR-1:** Access checks must add < 50ms latency to page loads
2. **NFR-2:** Admin UI must load all resources in < 2 seconds
3. **NFR-3:** System must handle 500+ protected resources
4. **NFR-4:** Preview mode must work across all pages without side effects

---

## Current State Analysis

### What Exists Today

#### Database Tables (Already Implemented)

```sql
-- Entitlements table (exists)
entitlements (id, slug, display_name, description, is_active)

-- Content tables with access control (exist)
downloads.accessible_via TEXT[]
modules.accessible_via TEXT[]
lessons.accessible_via TEXT[]
```

#### Existing Hooks (Already Implemented)

| Hook | Location | Purpose |
|------|----------|---------|
| `useEntitlements` | `/src/hooks/useEntitlements.js` | Fetch all entitlements |
| `useDownloadAccess` | `/src/hooks/useDownloadAccess.js` | Check download access |
| `useLessonAccess` | `/src/hooks/useLessonAccess.js` | Check lesson access |
| `useAuth` | `/src/hooks/useAuth.jsx` | Get current user + entitlements |

#### Existing Admin Pages (Already Implemented)

| Page | Route | Purpose |
|------|-------|---------|
| Entitlements | `/admin/entitlements` | Manage entitlement definitions |
| Downloads | `/admin/downloads` | Manage downloads (includes access control) |
| Modules | `/admin/modules` | Manage modules (includes access control) |

#### What's Hardcoded (Needs Migration)

Pages and features currently check access directly in components:

```jsx
// Example of current hardcoded approach (BAD)
function DashboardPage() {
  const { user } = useAuth();
  const hasAccess = user?.entitlements?.includes('active_membership');

  if (!hasAccess) return <UpgradePrompt />;
  return <Dashboard />;
}
```

**Files with hardcoded access checks to migrate:**
- All page components in `/src/pages/`
- Feature components that gate premium functionality
- Widgets with tier-specific features

---

## Proposed Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           ADMIN LAYER                                   │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    Access Control Admin Page                     │   │
│  │  • View all resources (pages, features, downloads, modules)      │   │
│  │  • Edit access rules inline                                      │   │
│  │  • See warnings for misconfigurations                            │   │
│  │  • Preview as different user tiers                               │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           DATA LAYER                                    │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────┐  │
│  │ protected_       │  │ downloads        │  │ modules / lessons    │  │
│  │ resources        │  │ (existing)       │  │ (existing)           │  │
│  │ (NEW)            │  │                  │  │                      │  │
│  │                  │  │ accessible_via   │  │ accessible_via       │  │
│  │ • pages          │  │ TEXT[]           │  │ TEXT[]               │  │
│  │ • features       │  │                  │  │                      │  │
│  │ • widgets        │  │                  │  │                      │  │
│  │ • tools          │  │                  │  │                      │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         APPLICATION LAYER                               │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  useResourceAccess(slug)                                         │   │
│  │  • Looks up resource in protected_resources                      │   │
│  │  • Compares against user entitlements (or preview entitlements)  │   │
│  │  • Returns { hasAccess, isLoading, denyBehavior }                │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  <FeatureGate slug="feature-name">                               │   │
│  │  • Wraps components that need access control                     │   │
│  │  • Shows content, upgrade prompt, or blur based on access        │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  <ProtectedRoute resourceSlug="page-name">                       │   │
│  │  • Wraps routes that need page-level access control              │   │
│  │  • Redirects or shows upgrade page if no access                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
1. Developer adds new feature
   └── Adds entry to resource-registry.js

2. On deploy, registry syncs to database
   └── New row in protected_resources table
   └── Default protection applied (e.g., active_membership)

3. Admin sees new item in Access Control page
   └── Can edit access rules without code
   └── Warning shown if no rules configured

4. User visits page
   └── useResourceAccess checks protected_resources
   └── Compares user.entitlements vs resource.accessible_via
   └── Returns access decision

5. Component renders based on access
   └── Full content if access granted
   └── Upgrade prompt/blur if denied
```

---

## Database Schema

### New Table: `protected_resources`

```sql
-- ============================================
-- PROTECTED RESOURCES TABLE
-- Stores access rules for pages, features, widgets, tools
-- ============================================

CREATE TABLE IF NOT EXISTS protected_resources (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identity
  slug TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,

  -- Classification
  resource_type TEXT NOT NULL CHECK (resource_type IN ('page', 'feature', 'widget', 'tool')),

  -- Hierarchy (for features/widgets within pages)
  parent_slug TEXT REFERENCES protected_resources(slug) ON DELETE SET NULL,

  -- Routing (for pages only)
  route_pattern TEXT,  -- e.g., '/schools/:id', '/quiz-lab'

  -- Access Control
  accessible_via TEXT[] DEFAULT '{}',  -- Array of entitlement slugs
  is_public BOOLEAN DEFAULT FALSE,     -- True = no auth required

  -- Behavior when access denied
  deny_behavior TEXT DEFAULT 'upgrade_prompt'
    CHECK (deny_behavior IN ('upgrade_prompt', 'blur', 'hide', 'redirect')),

  -- For tracking dismissed warnings
  warnings_dismissed TEXT[] DEFAULT '{}',

  -- Metadata (for future extensibility)
  metadata JSONB DEFAULT '{}',

  -- Status
  is_active BOOLEAN DEFAULT TRUE,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_protected_resources_slug ON protected_resources(slug);
CREATE INDEX idx_protected_resources_type ON protected_resources(resource_type);
CREATE INDEX idx_protected_resources_parent ON protected_resources(parent_slug);
CREATE INDEX idx_protected_resources_accessible_via ON protected_resources USING GIN(accessible_via);
CREATE INDEX idx_protected_resources_active ON protected_resources(is_active) WHERE is_active = TRUE;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE protected_resources ENABLE ROW LEVEL SECURITY;

-- Anyone can read active resources (needed for access checks)
CREATE POLICY "Anyone can view active resources" ON protected_resources
  FOR SELECT USING (is_active = TRUE);

-- Only admins can manage resources
CREATE POLICY "Admins can manage resources" ON protected_resources
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'user_role' = 'admin'
  );

-- ============================================
-- TRIGGERS
-- ============================================

CREATE TRIGGER update_protected_resources_updated_at
  BEFORE UPDATE ON protected_resources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- DEFAULT PROTECTION SETTINGS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS access_control_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default settings
INSERT INTO access_control_settings (setting_key, setting_value) VALUES
  ('default_page_protection', '["active_membership"]'),
  ('default_feature_protection', '["active_membership"]'),
  ('default_download_protection', '["active_membership"]'),
  ('default_module_protection', '["active_membership"]'),
  ('require_explicit_public', 'true')
ON CONFLICT (setting_key) DO NOTHING;

-- ============================================
-- ACCESS CHANGE LOG TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS access_change_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_type TEXT NOT NULL,  -- 'protected_resource', 'download', 'module', 'lesson'
  resource_id UUID NOT NULL,
  resource_slug TEXT,
  action TEXT NOT NULL,  -- 'created', 'updated', 'deleted'
  previous_access TEXT[],
  new_access TEXT[],
  changed_by UUID REFERENCES auth.users(id),
  changed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_access_log_resource ON access_change_log(resource_type, resource_id);
CREATE INDEX idx_access_log_time ON access_change_log(changed_at DESC);
```

### Schema for Warnings (Computed, Not Stored)

Warnings are computed at query time, not stored. See [Smart Warnings System](#smart-warnings-system) for queries.

---

## Complete Route Mapping

This section provides the **complete list of all routes** and their protection requirements.

### Route Categories

| Category | Protection Type | Description |
|----------|-----------------|-------------|
| **Public** | None | Accessible without login (login, register, landing) |
| **Authenticated** | Login required | Basic auth, no entitlement needed |
| **Protected** | Entitlement required | Requires specific entitlements |
| **Admin** | Admin role required | Admin-only routes |
| **Provider** | Provider role required | SRNA/Mentor routes |
| **Dev** | None (dev only) | Development/testing routes |

---

### Complete Route Table

#### Public Routes (No Protection)

| Route | Page | Notes |
|-------|------|-------|
| `/login` | LoginPage | Public auth page |
| `/register` | RegisterPage | Public auth page |

#### Applicant Protected Routes

These routes require `ProtectedRoute` wrapper with entitlement checks.

| Route | Resource Slug | Default Entitlement | Page Component |
|-------|---------------|---------------------|----------------|
| `/dashboard` | `dashboard` | `active_membership` | DashboardPage |
| `/my-programs` | `my-programs` | `active_membership` | MyProgramsPage |
| `/my-programs/:programId` | `my-programs-detail` | `active_membership` | TargetProgramDetailPage |
| `/trackers` | `trackers` | `active_membership` | MyTrackersPage |
| `/trackers/:tab` | `trackers` | `active_membership` | MyTrackersPage |
| `/my-stats` | `my-stats` | `active_membership` | MyStatsPage |
| `/schools` | `school-database` | `active_membership` | SchoolDatabasePage |
| `/schools/:schoolId` | `school-profile` | `active_membership` | SchoolProfilePage |
| `/prerequisites` | `prerequisites` | `active_membership` | PrerequisiteLibraryPage |
| `/learn` | `learning-library` | `active_membership` | LearningLibraryPage |
| `/learn/:moduleSlug` | `module-detail` | `active_membership` | ModuleDetailPage |
| `/learn/:moduleSlug/:lessonSlug` | `lesson-detail` | `active_membership` | LessonPage |
| `/events` | `events` | `active_membership` | EventsPage |
| `/tools` | `tools` | `active_membership` | ToolsPage |
| `/notifications` | `notifications` | `active_membership` | NotificationsPage |
| `/settings` | `settings` | `active_membership` | SettingsPage |
| `/my-purchases` | `my-purchases` | *authenticated only* | MyPurchasesPage |

#### Marketplace Routes (Applicant Side)

| Route | Resource Slug | Default Entitlement | Page Component |
|-------|---------------|---------------------|----------------|
| `/marketplace` | `marketplace` | `active_membership` | MarketplacePage |
| `/marketplace/mentor/:mentorId` | `mentor-profile` | `active_membership` | MentorProfilePage |
| `/marketplace/mentor/:mentorId/reviews` | `mentor-reviews` | `active_membership` | MentorReviewsPage |
| `/marketplace/book/:serviceId` | `marketplace-booking` | `active_membership` | BookingPage |
| `/marketplace/bookings/:bookingId` | `booking-detail` | `active_membership` | BookingDetailPage |
| `/marketplace/bookings/:bookingId/details` | `booking-detail` | `active_membership` | BookingDetailPage |
| `/marketplace/bookings/:bookingId/join` | `session-room` | `active_membership` | SessionRoomPage |
| `/marketplace/bookings/:bookingId/review` | `leave-review` | `active_membership` | LeaveReviewPage |
| `/marketplace/my-bookings` | `my-bookings` | `active_membership` | MyBookingsPage |

#### Community Routes

| Route | Resource Slug | Default Entitlement | Page Component |
|-------|---------------|---------------------|----------------|
| `/community/forums` | `community-forums` | `active_membership` | ForumsPage |
| `/community/forums/:forumId` | `forum-topics` | `active_membership` | ForumTopicsPage |
| `/community/forums/:forumId/:topicId` | `topic-detail` | `active_membership` | TopicDetailPage |
| `/community/groups` | `community-groups` | `active_membership` | GroupsPage |
| `/community/groups/:groupId` | `group-detail` | `active_membership` | GroupDetailPage |
| `/messages` | `messages` | `active_membership` | MessagesPage |

#### Provider/SRNA Routes

These require both authentication AND provider role verification.

| Route | Resource Slug | Requirements | Page Component |
|-------|---------------|--------------|----------------|
| `/marketplace/become-a-mentor` | `become-mentor` | *public* | BecomeMentorLandingPage |
| `/marketplace/provider/apply` | `provider-apply` | *authenticated* | ProviderApplicationPage |
| `/marketplace/provider/application-status` | `provider-status` | *authenticated* | ApplicationStatusPage |
| `/marketplace/provider/onboarding` | `provider-onboarding` | *approved provider* | ProviderOnboardingPage |
| `/marketplace/provider/dashboard` | `provider-dashboard` | *approved provider* | ProviderDashboardPage |
| `/marketplace/provider/requests` | `provider-requests` | *approved provider* | ProviderRequestsPage |
| `/marketplace/provider/bookings` | `provider-bookings` | *approved provider* | ProviderBookingsPage |
| `/marketplace/provider/bookings/:id/review` | `provider-review` | *approved provider* | ProviderLeaveReviewPage |
| `/marketplace/provider/services` | `provider-services` | *approved provider* | ProviderServicesPage |
| `/marketplace/provider/availability` | `provider-availability` | *approved provider* | ProviderAvailabilityPage |
| `/marketplace/provider/earnings` | `provider-earnings` | *approved provider* | ProviderEarningsPage |
| `/marketplace/provider/profile` | `provider-profile` | *approved provider* | ProviderProfilePage |
| `/marketplace/provider/insights` | `provider-insights` | *approved provider* | ProviderInsightsPage |
| `/marketplace/provider/resources` | `provider-resources` | *approved provider* | MentorResourcesPage |

#### Admin Routes

These require admin role. Use `AdminRoute` wrapper (separate from entitlement system).

| Route | Page Component | Notes |
|-------|----------------|-------|
| `/admin` | AdminDashboardPage | Admin home |
| `/admin/modules` | ModulesListPage | LMS management |
| `/admin/modules/new` | AdminModuleDetailPage | Create module |
| `/admin/modules/:moduleId` | AdminModuleDetailPage | Edit module |
| `/admin/lessons/new` | LessonEditPage | Create lesson |
| `/admin/lessons/:lessonId` | LessonEditPage | Edit lesson |
| `/admin/downloads` | DownloadsListPage | Downloads management |
| `/admin/downloads/new` | DownloadEditPage | Create download |
| `/admin/downloads/:downloadId` | DownloadEditPage | Edit download |
| `/admin/categories` | CategoriesPage | Category management |
| `/admin/entitlements` | EntitlementsPage | Entitlement management |
| `/admin/points` | PointsConfigPage | Gamification config |
| `/admin/marketplace` | AdminMarketplaceDashboard | Marketplace admin |
| `/admin/marketplace/providers` | AdminProvidersPage | Provider management |
| `/admin/marketplace/bookings` | AdminBookingsPage | Booking management |
| `/admin/marketplace/disputes` | AdminDisputesPage | Dispute resolution |
| `/admin/marketplace/quality` | AdminQualityPage | Quality metrics |
| `/admin/community` | AdminCommunityPage | Community admin |
| `/admin/community/reports` | AdminCommunityReportsPage | Content reports |
| `/admin/community/suspensions` | AdminSuspensionsPage | User suspensions |
| `/admin/user-reports` | AdminUserReportsPage | User feedback |
| `/admin/access-control` | AccessControlPage | **NEW** - Access management |

#### Development Routes (No Protection)

| Route | Page Component | Notes |
|-------|----------------|-------|
| `/playground` | PlaygroundPage | Dev testing |
| `/timeline-test` | TimelineTestPage | Timeline testing |
| `/lms-test` | LmsTestPage | LMS testing |
| `/component-showcase` | ComponentShowcasePage | Component library |
| `/preview/mentor-recommendations` | MentorRecommendationsPreview | Preview |
| `/preview/marketplace-demo` | MarketplaceDemoPage | Demo |
| `/preview/demo` | DemoIndexPage | Demo index |
| `/route-audit` | RouteAuditPage | Route audit |

---

### Updated router.jsx (Complete Changes)

**File:** `/src/router.jsx`

```jsx
/**
 * Router configuration for The CRNA Club
 * Updated with ProtectedRoute wrappers for access control
 */

import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/app-layout';
import { ProtectedRoute } from '@/components/access/ProtectedRoute';
import { AdminRoute } from '@/components/access/AdminRoute';
import { ProviderRoute } from '@/components/access/ProviderRoute';
import { PlaceholderPage } from '@/pages/shared/PlaceholderPage';

// ... lazy imports remain the same ...

// Helper to wrap with protection
function protectedPage(Component, resourceSlug) {
  return (
    <ProtectedRoute resourceSlug={resourceSlug}>
      <Suspense fallback={<PageLoader />}>
        <Component />
      </Suspense>
    </ProtectedRoute>
  );
}

function adminPage(Component) {
  return (
    <AdminRoute>
      <Suspense fallback={<PageLoader />}>
        <Component />
      </Suspense>
    </AdminRoute>
  );
}

function providerPage(Component, resourceSlug) {
  return (
    <ProviderRoute resourceSlug={resourceSlug}>
      <Suspense fallback={<PageLoader />}>
        <Component />
      </Suspense>
    </ProviderRoute>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      // Redirect root to dashboard
      { index: true, element: <Navigate to="/dashboard" replace /> },

      // =====================================================
      // APPLICANT CORE - Protected with active_membership
      // =====================================================
      { path: 'dashboard', element: protectedPage(DashboardPage, 'dashboard') },
      { path: 'my-programs', element: protectedPage(MyProgramsPage, 'my-programs') },
      { path: 'my-programs/:programId', element: protectedPage(TargetProgramDetailPage, 'my-programs-detail') },
      { path: 'trackers', element: protectedPage(MyTrackersPage, 'trackers') },
      { path: 'trackers/:tab', element: protectedPage(MyTrackersPage, 'trackers') },
      { path: 'my-stats', element: protectedPage(MyStatsPage, 'my-stats') },

      // =====================================================
      // CONTENT & DISCOVERY - Protected
      // =====================================================
      { path: 'schools', element: protectedPage(SchoolDatabasePage, 'school-database') },
      { path: 'schools/:schoolId', element: protectedPage(SchoolProfilePage, 'school-profile') },
      { path: 'prerequisites', element: protectedPage(PrerequisiteLibraryPage, 'prerequisites') },
      { path: 'learn', element: protectedPage(LearningLibraryPage, 'learning-library') },
      { path: 'learn/:moduleSlug', element: protectedPage(ModuleDetailPage, 'module-detail') },
      { path: 'learn/:moduleSlug/:lessonSlug', element: protectedPage(LessonPage, 'lesson-detail') },
      { path: 'learning', element: <Navigate to="/learn" replace /> },
      { path: 'events', element: protectedPage(EventsPage, 'events') },
      { path: 'tools', element: protectedPage(ToolsPage, 'tools') },

      // =====================================================
      // MARKETPLACE - Applicant Side
      // =====================================================
      { path: 'marketplace', element: protectedPage(MarketplacePage, 'marketplace') },
      { path: 'marketplace/mentor/:mentorId', element: protectedPage(MentorProfilePage, 'mentor-profile') },
      { path: 'marketplace/mentor/:mentorId/reviews', element: protectedPage(MentorReviewsPage, 'mentor-reviews') },
      { path: 'marketplace/book/:serviceId', element: protectedPage(BookingPage, 'marketplace-booking') },
      { path: 'marketplace/bookings/:bookingId', element: protectedPage(BookingDetailPage, 'booking-detail') },
      { path: 'marketplace/bookings/:bookingId/details', element: protectedPage(BookingDetailPage, 'booking-detail') },
      { path: 'marketplace/bookings/:bookingId/join', element: protectedPage(SessionRoomPage, 'session-room') },
      { path: 'marketplace/bookings/:bookingId/review', element: protectedPage(LeaveReviewPage, 'leave-review') },
      { path: 'marketplace/my-bookings', element: protectedPage(MyBookingsPage, 'my-bookings') },

      // =====================================================
      // MARKETPLACE - Provider Application (authenticated only)
      // =====================================================
      { path: 'marketplace/become-a-mentor', element: lazyLoad(BecomeMentorLandingPage) }, // Public landing
      { path: 'marketplace/provider/apply', element: lazyLoad(ProviderApplicationPage) }, // Auth only
      { path: 'marketplace/provider/application-status', element: lazyLoad(ApplicationStatusPage) }, // Auth only

      // =====================================================
      // MARKETPLACE - Provider Dashboard (requires provider role)
      // =====================================================
      { path: 'marketplace/provider/onboarding', element: providerPage(ProviderOnboardingPage, 'provider-onboarding') },
      { path: 'marketplace/provider/dashboard', element: providerPage(ProviderDashboardPage, 'provider-dashboard') },
      { path: 'marketplace/provider/requests', element: providerPage(ProviderRequestsPage, 'provider-requests') },
      { path: 'marketplace/provider/bookings', element: providerPage(ProviderBookingsPage, 'provider-bookings') },
      { path: 'marketplace/provider/bookings/:id/review', element: providerPage(ProviderLeaveReviewPage, 'provider-review') },
      { path: 'marketplace/provider/services', element: providerPage(ProviderServicesPage, 'provider-services') },
      { path: 'marketplace/provider/availability', element: providerPage(ProviderAvailabilityPage, 'provider-availability') },
      { path: 'marketplace/provider/earnings', element: providerPage(ProviderEarningsPage, 'provider-earnings') },
      { path: 'marketplace/provider/profile', element: providerPage(ProviderProfilePage, 'provider-profile') },
      { path: 'marketplace/provider/insights', element: providerPage(ProviderInsightsPage, 'provider-insights') },
      { path: 'marketplace/provider/resources', element: providerPage(MentorResourcesPage, 'provider-resources') },
      { path: 'marketplace/messages', element: <PlaceholderPage title="Marketplace Messages" /> },

      // =====================================================
      // COMMUNITY - Protected
      // =====================================================
      { path: 'community', element: <Navigate to="/community/forums" replace /> },
      { path: 'community/forums', element: protectedPage(ForumsPage, 'community-forums') },
      { path: 'community/forums/:forumId', element: protectedPage(ForumTopicsPage, 'forum-topics') },
      { path: 'community/forums/:forumId/:topicId', element: protectedPage(TopicDetailPage, 'topic-detail') },
      { path: 'community/groups', element: protectedPage(GroupsPage, 'community-groups') },
      { path: 'community/groups/:groupId', element: protectedPage(GroupDetailPage, 'group-detail') },
      { path: 'messages', element: protectedPage(MessagesPage, 'messages') },

      // =====================================================
      // ACCOUNT - Mixed protection
      // =====================================================
      { path: 'settings', element: protectedPage(() => <PlaceholderPage title="Settings" />, 'settings') },
      { path: 'settings/notifications', element: protectedPage(() => <PlaceholderPage title="Notification Settings" />, 'settings') },
      { path: 'my-purchases', element: lazyLoad(() => <PlaceholderPage title="My Purchases" />) }, // Auth only, no entitlement
      { path: 'notifications', element: protectedPage(NotificationsPage, 'notifications') },
      { path: 'documents', element: protectedPage(() => <PlaceholderPage title="My Documents" />, 'documents') },

      // =====================================================
      // ADMIN ROUTES - Requires admin role
      // =====================================================
      { path: 'admin', element: adminPage(AdminDashboardPage) },
      { path: 'admin/modules', element: adminPage(ModulesListPage) },
      { path: 'admin/modules/new', element: adminPage(AdminModuleDetailPage) },
      { path: 'admin/modules/:moduleId', element: adminPage(AdminModuleDetailPage) },
      { path: 'admin/lessons/new', element: adminPage(LessonEditPage) },
      { path: 'admin/lessons/:lessonId', element: adminPage(LessonEditPage) },
      { path: 'admin/downloads', element: adminPage(DownloadsListPage) },
      { path: 'admin/downloads/new', element: adminPage(DownloadEditPage) },
      { path: 'admin/downloads/:downloadId', element: adminPage(DownloadEditPage) },
      { path: 'admin/categories', element: adminPage(CategoriesPage) },
      { path: 'admin/entitlements', element: adminPage(EntitlementsPage) },
      { path: 'admin/points', element: adminPage(PointsConfigPage) },
      { path: 'admin/access-control', element: adminPage(AccessControlPage) }, // NEW
      { path: 'admin/marketplace', element: adminPage(AdminMarketplaceDashboard) },
      { path: 'admin/marketplace/providers', element: adminPage(AdminProvidersPage) },
      { path: 'admin/marketplace/bookings', element: adminPage(AdminBookingsPage) },
      { path: 'admin/marketplace/disputes', element: adminPage(AdminDisputesPage) },
      { path: 'admin/marketplace/quality', element: adminPage(AdminQualityPage) },
      { path: 'admin/community', element: adminPage(AdminCommunityPage) },
      { path: 'admin/community/reports', element: adminPage(AdminCommunityReportsPage) },
      { path: 'admin/community/suspensions', element: adminPage(AdminSuspensionsPage) },
      { path: 'admin/user-reports', element: adminPage(AdminUserReportsPage) },
    ],
  },

  // =====================================================
  // AUTH ROUTES - Public (no layout)
  // =====================================================
  { path: 'login', element: <PlaceholderPage title="Login" /> },
  { path: 'register', element: <PlaceholderPage title="Register" /> },

  // =====================================================
  // DEVELOPMENT ROUTES - No protection
  // =====================================================
  { path: 'playground', element: lazyLoad(PlaygroundPage) },
  { path: 'timeline-test', element: lazyLoad(TimelineTestPage) },
  { path: 'lms-test', element: lazyLoad(LmsTestPage) },
  { path: 'component-showcase', element: lazyLoad(ComponentShowcasePage) },
  { path: 'preview/mentor-recommendations', element: lazyLoad(MentorRecommendationsPreview) },
  { path: 'preview/marketplace-demo', element: lazyLoad(MarketplaceDemoPage) },
  { path: 'preview/demo', element: lazyLoad(DemoIndexPage) },
  { path: 'route-audit', element: lazyLoad(RouteAuditPage) },

  // 404
  { path: '*', element: <PlaceholderPage title="Page Not Found" /> },
]);
```

---

### New Components Required for Routes

#### AdminRoute Component

**File:** `/src/components/access/AdminRoute.jsx`

```jsx
/**
 * AdminRoute Component
 *
 * Protects admin routes. Requires user to have admin role.
 * Separate from entitlement-based protection.
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { Loader2 } from 'lucide-react';

export function AdminRoute({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </PageWrapper>
    );
  }

  // Check for admin role
  const isAdmin = user?.role === 'admin' ||
                  user?.user_metadata?.role === 'admin' ||
                  user?.app_metadata?.role === 'admin';

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default AdminRoute;
```

#### ProviderRoute Component

**File:** `/src/components/access/ProviderRoute.jsx`

```jsx
/**
 * ProviderRoute Component
 *
 * Protects provider/SRNA routes. Requires approved provider status.
 * Can optionally also check resource-based entitlements.
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useResourceAccess } from '@/hooks/useResourceAccess';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { Loader2 } from 'lucide-react';

export function ProviderRoute({ resourceSlug, children }) {
  const { user, isLoading: authLoading } = useAuth();
  const { hasAccess, isLoading: accessLoading } = useResourceAccess(resourceSlug);

  if (authLoading || accessLoading) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </PageWrapper>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check for approved provider status
  const isApprovedProvider = user?.provider_status === 'approved' ||
                             user?.user_metadata?.provider_status === 'approved';

  if (!isApprovedProvider) {
    return <Navigate to="/marketplace/provider/application-status" replace />;
  }

  // If resourceSlug provided, also check entitlement access
  if (resourceSlug && !hasAccess) {
    return <Navigate to="/marketplace/provider/dashboard" replace />;
  }

  return children;
}

export default ProviderRoute;
```

---

### Updated Resource Registry

**File:** `/src/config/resource-registry.js`

The complete registry with ALL pages:

```javascript
export const RESOURCE_REGISTRY = {
  pages: [
    // Applicant Core
    { slug: 'dashboard', displayName: 'Dashboard', route: '/dashboard', description: 'Main user dashboard' },
    { slug: 'my-programs', displayName: 'My Programs', route: '/my-programs', description: 'Saved CRNA programs' },
    { slug: 'my-programs-detail', displayName: 'Program Detail', route: '/my-programs/:programId', description: 'Individual program checklist' },
    { slug: 'trackers', displayName: 'Trackers', route: '/trackers', description: 'Clinical hours, shadowing tracking' },
    { slug: 'my-stats', displayName: 'My Stats', route: '/my-stats', description: 'User profile and qualifications' },

    // Content & Discovery
    { slug: 'school-database', displayName: 'School Database', route: '/schools', description: 'Browse CRNA programs' },
    { slug: 'school-profile', displayName: 'School Profile', route: '/schools/:id', description: 'Individual school details' },
    { slug: 'prerequisites', displayName: 'Prerequisites', route: '/prerequisites', description: 'Prerequisite library' },
    { slug: 'learning-library', displayName: 'Learning Library', route: '/learn', description: 'Educational modules' },
    { slug: 'module-detail', displayName: 'Module Detail', route: '/learn/:moduleSlug', description: 'Module content' },
    { slug: 'lesson-detail', displayName: 'Lesson', route: '/learn/:moduleSlug/:lessonSlug', description: 'Lesson content' },
    { slug: 'events', displayName: 'Events', route: '/events', description: 'Events and webinars' },
    { slug: 'tools', displayName: 'Tools', route: '/tools', description: 'Application tools' },

    // Marketplace - Applicant
    { slug: 'marketplace', displayName: 'Marketplace', route: '/marketplace', description: 'Mentor marketplace' },
    { slug: 'mentor-profile', displayName: 'Mentor Profile', route: '/marketplace/mentor/:id', description: 'Mentor details' },
    { slug: 'mentor-reviews', displayName: 'Mentor Reviews', route: '/marketplace/mentor/:id/reviews', description: 'Mentor reviews' },
    { slug: 'marketplace-booking', displayName: 'Book Service', route: '/marketplace/book/:id', description: 'Booking flow' },
    { slug: 'booking-detail', displayName: 'Booking Detail', route: '/marketplace/bookings/:id', description: 'Booking details' },
    { slug: 'session-room', displayName: 'Session Room', route: '/marketplace/bookings/:id/join', description: 'Video session' },
    { slug: 'leave-review', displayName: 'Leave Review', route: '/marketplace/bookings/:id/review', description: 'Review form' },
    { slug: 'my-bookings', displayName: 'My Bookings', route: '/marketplace/my-bookings', description: 'Booking history' },

    // Community
    { slug: 'community-forums', displayName: 'Forums', route: '/community/forums', description: 'Discussion forums' },
    { slug: 'forum-topics', displayName: 'Forum Topics', route: '/community/forums/:id', description: 'Forum topic list' },
    { slug: 'topic-detail', displayName: 'Topic Detail', route: '/community/forums/:fid/:tid', description: 'Topic discussion' },
    { slug: 'community-groups', displayName: 'Groups', route: '/community/groups', description: 'Community groups' },
    { slug: 'group-detail', displayName: 'Group Detail', route: '/community/groups/:id', description: 'Group page' },
    { slug: 'messages', displayName: 'Messages', route: '/messages', description: 'Direct messages' },

    // Account
    { slug: 'settings', displayName: 'Settings', route: '/settings', description: 'Account settings' },
    { slug: 'notifications', displayName: 'Notifications', route: '/notifications', description: 'Notification center' },
    { slug: 'documents', displayName: 'Documents', route: '/documents', description: 'Saved documents' },

    // Provider Pages (for resource registry, even though they use ProviderRoute)
    { slug: 'provider-onboarding', displayName: 'Provider Onboarding', route: '/marketplace/provider/onboarding', description: 'Provider setup' },
    { slug: 'provider-dashboard', displayName: 'Provider Dashboard', route: '/marketplace/provider/dashboard', description: 'Provider home' },
    { slug: 'provider-requests', displayName: 'Booking Requests', route: '/marketplace/provider/requests', description: 'Incoming requests' },
    { slug: 'provider-bookings', displayName: 'Provider Bookings', route: '/marketplace/provider/bookings', description: 'Provider bookings' },
    { slug: 'provider-services', displayName: 'My Services', route: '/marketplace/provider/services', description: 'Service management' },
    { slug: 'provider-availability', displayName: 'Availability', route: '/marketplace/provider/availability', description: 'Schedule settings' },
    { slug: 'provider-earnings', displayName: 'Earnings', route: '/marketplace/provider/earnings', description: 'Earnings dashboard' },
    { slug: 'provider-profile', displayName: 'Provider Profile', route: '/marketplace/provider/profile', description: 'Profile editor' },
    { slug: 'provider-insights', displayName: 'Insights', route: '/marketplace/provider/insights', description: 'Performance analytics' },
    { slug: 'provider-resources', displayName: 'Mentor Resources', route: '/marketplace/provider/resources', description: 'Provider resources' },
  ],

  features: [
    // School Profile Features
    { slug: 'school-ai-insights', displayName: 'AI School Insights', parent: 'school-profile', description: 'AI-powered program fit analysis' },
    { slug: 'school-comparison', displayName: 'School Comparison', parent: 'school-profile', description: 'Compare to saved programs' },
    { slug: 'school-save', displayName: 'Save School', parent: 'school-profile', description: 'Save to My Programs' },

    // Dashboard Features
    { slug: 'dashboard-ai-tips', displayName: 'AI Recommendations', parent: 'dashboard', description: 'Personalized AI suggestions' },

    // My Stats Features
    { slug: 'stats-ai-analysis', displayName: 'AI Profile Analysis', parent: 'my-stats', description: 'AI strengths/weaknesses analysis' },

    // Quiz Lab Features (when implemented)
    { slug: 'quiz-analytics', displayName: 'Quiz Analytics', parent: 'quiz-lab', description: 'Performance breakdown' },
    { slug: 'quiz-ai-explanations', displayName: 'AI Explanations', parent: 'quiz-lab', description: 'AI-generated rationales' },
  ],

  widgets: [
    { slug: 'readyscore-widget', displayName: 'ReadyScore', parent: 'dashboard', description: 'Application readiness score' },
    { slug: 'smart-nudges-widget', displayName: 'Smart Nudges', parent: 'dashboard', description: 'Action recommendations' },
    { slug: 'progress-tracker-widget', displayName: 'Progress Tracker', parent: 'dashboard', description: 'Journey progress' },
  ],

  tools: [
    { slug: 'gpa-calculator', displayName: 'GPA Calculator', route: '/tools/gpa-calculator', description: 'Calculate GPA' },
    { slug: 'timeline-generator', displayName: 'Timeline Generator', route: '/tools/timeline', description: 'Application timeline' },
    { slug: 'essay-reviewer', displayName: 'AI Essay Reviewer', route: '/tools/essay-review', description: 'Essay feedback' },
  ],
};
```

---

### Route Count Summary

| Category | Count |
|----------|-------|
| Public routes | 2 |
| Protected applicant routes | 32 |
| Protected marketplace routes | 9 |
| Protected community routes | 6 |
| Provider routes | 13 |
| Admin routes | 22 |
| Dev routes | 8 |
| **Total routes** | **92** |

---

## Implementation Phases

### Phase 1: Database & Core Infrastructure (Day 1 Morning)

#### Step 1.1: Create Database Migration

**File:** `/supabase/migrations/20251217000000_access_control_system.sql`

```sql
-- Copy the schema from Database Schema section above
```

**Verification:**
- [ ] Run migration locally
- [ ] Verify tables created in Supabase dashboard
- [ ] Test RLS policies work correctly

#### Step 1.2: Create Resource Registry

**File:** `/src/config/resource-registry.js`

This file declares all protectable resources in code. It serves as the source of truth for WHAT exists.

```javascript
/**
 * Resource Registry
 *
 * Declares all protectable resources (pages, features, widgets, tools).
 * This registry syncs to the protected_resources database table.
 *
 * IMPORTANT: When adding a new page or feature, add it here first.
 * The database stores ACCESS RULES, this file declares WHAT EXISTS.
 */

export const RESOURCE_REGISTRY = {
  pages: [
    {
      slug: 'dashboard',
      displayName: 'Dashboard',
      route: '/dashboard',
      description: 'Main user dashboard with stats and progress',
    },
    {
      slug: 'my-programs',
      displayName: 'My Programs',
      route: '/my-programs',
      description: 'Saved CRNA programs and checklists',
    },
    {
      slug: 'my-programs-detail',
      displayName: 'Program Detail',
      route: '/my-programs/:id',
      description: 'Individual program checklist and notes',
    },
    {
      slug: 'school-database',
      displayName: 'School Database',
      route: '/schools',
      description: 'Browse and search CRNA programs',
    },
    {
      slug: 'school-profile',
      displayName: 'School Profile',
      route: '/schools/:id',
      description: 'Individual school details and requirements',
    },
    {
      slug: 'my-stats',
      displayName: 'My Stats',
      route: '/my-stats',
      description: 'User profile and qualifications',
    },
    {
      slug: 'trackers',
      displayName: 'Trackers',
      route: '/trackers',
      description: 'Clinical hours, shadowing, certifications tracking',
    },
    {
      slug: 'quiz-lab',
      displayName: 'Quiz Lab',
      route: '/quiz-lab',
      description: 'Practice questions for CCRN and other certifications',
    },
    {
      slug: 'learning-library',
      displayName: 'Learning Library',
      route: '/learning',
      description: 'Educational modules and courses',
    },
    {
      slug: 'downloads-library',
      displayName: 'Downloads Library',
      route: '/downloads',
      description: 'Downloadable resources and templates',
    },
    {
      slug: 'community-forums',
      displayName: 'Community Forums',
      route: '/community',
      description: 'Discussion forums and community',
    },
    {
      slug: 'marketplace',
      displayName: 'Mentor Marketplace',
      route: '/marketplace',
      description: 'Find and book SRNA mentors',
    },
    {
      slug: 'events',
      displayName: 'Events',
      route: '/events',
      description: 'Upcoming events and webinars',
    },
  ],

  features: [
    // School Profile Features
    {
      slug: 'school-ai-insights',
      displayName: 'AI School Insights',
      parent: 'school-profile',
      description: 'AI-powered program fit analysis and recommendations',
    },
    {
      slug: 'school-comparison',
      displayName: 'School Comparison',
      parent: 'school-profile',
      description: 'Compare school to saved programs',
    },

    // Quiz Lab Features
    {
      slug: 'quiz-analytics',
      displayName: 'Quiz Analytics',
      parent: 'quiz-lab',
      description: 'Performance breakdown by category',
    },
    {
      slug: 'quiz-ai-explanations',
      displayName: 'AI Question Explanations',
      parent: 'quiz-lab',
      description: 'AI-generated detailed rationales',
    },

    // Dashboard Features
    {
      slug: 'dashboard-ai-recommendations',
      displayName: 'AI Recommendations',
      parent: 'dashboard',
      description: 'Personalized AI-powered suggestions',
    },

    // My Stats Features
    {
      slug: 'stats-ai-analysis',
      displayName: 'AI Profile Analysis',
      parent: 'my-stats',
      description: 'AI analysis of profile strengths/weaknesses',
    },
  ],

  widgets: [
    {
      slug: 'readyscore-widget',
      displayName: 'ReadyScore',
      parent: 'dashboard',
      description: 'Application readiness score display',
    },
    {
      slug: 'smart-nudges-widget',
      displayName: 'Smart Nudges',
      parent: 'dashboard',
      description: 'Personalized action recommendations',
    },
    {
      slug: 'progress-tracker-widget',
      displayName: 'Progress Tracker',
      parent: 'dashboard',
      description: 'Visual progress through application journey',
    },
  ],

  tools: [
    {
      slug: 'gpa-calculator',
      displayName: 'GPA Calculator',
      route: '/tools/gpa-calculator',
      description: 'Calculate and project GPA',
    },
    {
      slug: 'timeline-generator',
      displayName: 'Timeline Generator',
      route: '/tools/timeline',
      description: 'Generate application timeline',
    },
    {
      slug: 'essay-reviewer',
      displayName: 'AI Essay Reviewer',
      route: '/tools/essay-review',
      description: 'AI-powered essay feedback',
    },
  ],
};

/**
 * Flatten registry for easy iteration
 */
export function getAllResources() {
  const all = [];

  for (const [type, resources] of Object.entries(RESOURCE_REGISTRY)) {
    const singularType = type.slice(0, -1); // 'pages' -> 'page'
    for (const resource of resources) {
      all.push({
        ...resource,
        resourceType: singularType,
      });
    }
  }

  return all;
}

/**
 * Get resource by slug
 */
export function getResourceBySlug(slug) {
  return getAllResources().find(r => r.slug === slug);
}

/**
 * Get children of a parent resource
 */
export function getChildResources(parentSlug) {
  return getAllResources().filter(r => r.parent === parentSlug);
}
```

**Verification:**
- [ ] All current pages are listed
- [ ] Parent-child relationships are correct
- [ ] No duplicate slugs

#### Step 1.3: Create Registry Sync Function

**File:** `/src/lib/syncResourceRegistry.js`

```javascript
/**
 * Sync Resource Registry to Database
 *
 * Called on app init (dev) or via admin action (prod).
 * Creates/updates protected_resources rows from the code registry.
 * Does NOT overwrite existing access rules.
 */

import supabase from '@/lib/supabase';
import { getAllResources } from '@/config/resource-registry';

export async function syncResourceRegistry() {
  const resources = getAllResources();
  const results = { created: 0, updated: 0, errors: [] };

  for (const resource of resources) {
    try {
      const { data: existing } = await supabase
        .from('protected_resources')
        .select('id, accessible_via')
        .eq('slug', resource.slug)
        .single();

      if (existing) {
        // Update metadata but preserve access rules
        const { error } = await supabase
          .from('protected_resources')
          .update({
            display_name: resource.displayName,
            description: resource.description,
            resource_type: resource.resourceType,
            parent_slug: resource.parent || null,
            route_pattern: resource.route || null,
            // Do NOT update accessible_via - preserve admin settings
          })
          .eq('id', existing.id);

        if (error) throw error;
        results.updated++;
      } else {
        // Create new with default protection
        const defaultProtection = await getDefaultProtection(resource.resourceType);

        const { error } = await supabase
          .from('protected_resources')
          .insert({
            slug: resource.slug,
            display_name: resource.displayName,
            description: resource.description,
            resource_type: resource.resourceType,
            parent_slug: resource.parent || null,
            route_pattern: resource.route || null,
            accessible_via: defaultProtection,
            is_public: false,
          });

        if (error) throw error;
        results.created++;
      }
    } catch (err) {
      results.errors.push({ slug: resource.slug, error: err.message });
    }
  }

  return results;
}

async function getDefaultProtection(resourceType) {
  const { data } = await supabase
    .from('access_control_settings')
    .select('setting_value')
    .eq('setting_key', `default_${resourceType}_protection`)
    .single();

  return data?.setting_value || ['active_membership'];
}
```

---

### Phase 2: Access Hooks & Components (Day 1 Afternoon)

#### Step 2.1: Create useResourceAccess Hook

**File:** `/src/hooks/useResourceAccess.js`

```javascript
/**
 * useResourceAccess Hook
 *
 * Check if the current user can access a protected resource.
 * Supports preview mode for admin testing.
 *
 * @param {string} slug - The resource slug to check
 * @returns {Object} Access status and resource info
 */

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { usePreviewMode } from '@/hooks/usePreviewMode';
import supabase from '@/lib/supabase';

// Cache for resource lookups (refreshed on page load)
const resourceCache = new Map();

export function useResourceAccess(slug) {
  const { user } = useAuth();
  const { previewEntitlements, isPreviewMode } = usePreviewMode();
  const [resource, setResource] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch resource from cache or database
  useEffect(() => {
    async function fetchResource() {
      if (!slug) {
        setIsLoading(false);
        return;
      }

      // Check cache first
      if (resourceCache.has(slug)) {
        setResource(resourceCache.get(slug));
        setIsLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from('protected_resources')
          .select('*')
          .eq('slug', slug)
          .eq('is_active', true)
          .single();

        if (fetchError) throw fetchError;

        resourceCache.set(slug, data);
        setResource(data);
      } catch (err) {
        console.error(`Error fetching resource "${slug}":`, err);
        setError(err.message);
        setResource(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchResource();
  }, [slug]);

  // Calculate access
  const accessInfo = useMemo(() => {
    if (!resource) {
      return {
        hasAccess: false,
        isLoading,
        error,
        resource: null,
        denyBehavior: 'upgrade_prompt',
        isPreviewMode: false,
      };
    }

    // Public resources - everyone has access
    if (resource.is_public) {
      return {
        hasAccess: true,
        isLoading: false,
        error: null,
        resource,
        accessReason: 'public',
        isPreviewMode,
      };
    }

    // Get entitlements to check against
    const entitlementsToCheck = isPreviewMode
      ? previewEntitlements
      : (user?.entitlements || user?.user_metadata?.entitlements || []);

    // No entitlements required - everyone with auth has access
    const requiredEntitlements = resource.accessible_via || [];
    if (requiredEntitlements.length === 0) {
      return {
        hasAccess: !!user,
        isLoading: false,
        error: null,
        resource,
        accessReason: user ? 'authenticated' : 'requires_auth',
        denyBehavior: resource.deny_behavior,
        isPreviewMode,
      };
    }

    // Check if user has ANY of the required entitlements
    const hasAccess = requiredEntitlements.some(ent =>
      entitlementsToCheck.includes(ent)
    );

    const matchingEntitlement = requiredEntitlements.find(ent =>
      entitlementsToCheck.includes(ent)
    );

    return {
      hasAccess,
      isLoading: false,
      error: null,
      resource,
      requiredEntitlements,
      userEntitlements: entitlementsToCheck,
      matchingEntitlement,
      accessReason: hasAccess ? 'entitlement' : 'insufficient_entitlements',
      denyBehavior: resource.deny_behavior,
      isPreviewMode,
    };
  }, [resource, user, previewEntitlements, isPreviewMode, isLoading, error]);

  return accessInfo;
}

/**
 * Prefetch multiple resources at once (for performance)
 */
export async function prefetchResources(slugs) {
  const uncached = slugs.filter(slug => !resourceCache.has(slug));

  if (uncached.length === 0) return;

  const { data } = await supabase
    .from('protected_resources')
    .select('*')
    .in('slug', uncached)
    .eq('is_active', true);

  if (data) {
    data.forEach(resource => {
      resourceCache.set(resource.slug, resource);
    });
  }
}

/**
 * Clear resource cache (call after admin updates)
 */
export function clearResourceCache() {
  resourceCache.clear();
}

export default useResourceAccess;
```

#### Step 2.2: Create usePreviewMode Hook

**File:** `/src/hooks/usePreviewMode.js`

```javascript
/**
 * usePreviewMode Hook
 *
 * Manages the "View As" preview mode for testing access control.
 * Stores preview entitlements in URL params for easy sharing/refresh.
 */

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';

const PreviewModeContext = createContext(null);

export function PreviewModeProvider({ children }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [previewEntitlements, setPreviewEntitlements] = useState([]);

  // Read preview mode from URL on mount
  useEffect(() => {
    const previewParam = searchParams.get('preview_as');
    if (previewParam) {
      setPreviewEntitlements(previewParam.split(',').filter(Boolean));
    }
  }, [searchParams]);

  const isPreviewMode = previewEntitlements.length > 0 || searchParams.has('preview_as');

  const startPreview = useCallback((entitlements) => {
    setPreviewEntitlements(entitlements);
    setSearchParams(prev => {
      prev.set('preview_as', entitlements.join(','));
      return prev;
    });
  }, [setSearchParams]);

  const exitPreview = useCallback(() => {
    setPreviewEntitlements([]);
    setSearchParams(prev => {
      prev.delete('preview_as');
      return prev;
    });
  }, [setSearchParams]);

  const value = {
    isPreviewMode,
    previewEntitlements,
    startPreview,
    exitPreview,
  };

  return (
    <PreviewModeContext.Provider value={value}>
      {children}
    </PreviewModeContext.Provider>
  );
}

export function usePreviewMode() {
  const context = useContext(PreviewModeContext);
  if (!context) {
    // Return safe defaults if outside provider
    return {
      isPreviewMode: false,
      previewEntitlements: [],
      startPreview: () => {},
      exitPreview: () => {},
    };
  }
  return context;
}

export default usePreviewMode;
```

#### Step 2.3: Create FeatureGate Component

**File:** `/src/components/access/FeatureGate.jsx`

```jsx
/**
 * FeatureGate Component
 *
 * Wraps features that need access control.
 * Shows content, upgrade prompt, or blur based on access.
 *
 * Usage:
 *   <FeatureGate slug="quiz-analytics">
 *     <QuizAnalyticsDashboard />
 *   </FeatureGate>
 */

import React from 'react';
import { useResourceAccess } from '@/hooks/useResourceAccess';
import { UpgradeCard } from '@/components/features/upgrade/UpgradeCard';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export function FeatureGate({
  slug,
  children,
  fallback,
  showSkeleton = true,
  className,
}) {
  const { hasAccess, isLoading, resource, denyBehavior, isPreviewMode } = useResourceAccess(slug);

  // Loading state
  if (isLoading) {
    if (!showSkeleton) return null;
    return <Skeleton className={cn("h-32 w-full", className)} />;
  }

  // Access granted
  if (hasAccess) {
    return (
      <>
        {isPreviewMode && (
          <div className="absolute top-1 right-1 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
            ✓ Accessible
          </div>
        )}
        {children}
      </>
    );
  }

  // Access denied - handle based on deny_behavior
  const behavior = denyBehavior || 'upgrade_prompt';

  switch (behavior) {
    case 'hide':
      return null;

    case 'blur':
      return (
        <div className={cn("relative", className)}>
          <div className="blur-sm pointer-events-none select-none">
            {children}
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm">
            <UpgradeCard
              feature={resource?.display_name}
              compact
            />
          </div>
          {isPreviewMode && (
            <div className="absolute top-1 right-1 text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">
              🔒 Blocked
            </div>
          )}
        </div>
      );

    case 'redirect':
      // Redirect is typically handled at page level, fall through to prompt
    case 'upgrade_prompt':
    default:
      return (
        <div className={cn("relative", className)}>
          {fallback || (
            <UpgradeCard
              feature={resource?.display_name}
              description={resource?.description}
            />
          )}
          {isPreviewMode && (
            <div className="absolute top-1 right-1 text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">
              🔒 Blocked
            </div>
          )}
        </div>
      );
  }
}

export default FeatureGate;
```

#### Step 2.4: Create ProtectedRoute Component

**File:** `/src/components/access/ProtectedRoute.jsx`

```jsx
/**
 * ProtectedRoute Component
 *
 * Wraps routes that need page-level access control.
 * Redirects to upgrade page or shows full-page upgrade prompt.
 *
 * Usage in router.jsx:
 *   <Route path="/quiz-lab" element={
 *     <ProtectedRoute resourceSlug="quiz-lab">
 *       <QuizLabPage />
 *     </ProtectedRoute>
 *   } />
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useResourceAccess } from '@/hooks/useResourceAccess';
import { useAuth } from '@/hooks/useAuth';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { UpgradePrompt } from '@/components/features/upgrade/UpgradePrompt';
import { Loader2 } from 'lucide-react';

export function ProtectedRoute({
  resourceSlug,
  children,
  requireAuth = true,
}) {
  const { user, isLoading: authLoading } = useAuth();
  const { hasAccess, isLoading, resource, denyBehavior, isPreviewMode } = useResourceAccess(resourceSlug);

  // Still loading
  if (authLoading || isLoading) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </PageWrapper>
    );
  }

  // Not logged in
  if (requireAuth && !user && !isPreviewMode) {
    return <Navigate to="/login" replace />;
  }

  // Access granted
  if (hasAccess) {
    return children;
  }

  // Access denied
  if (denyBehavior === 'redirect') {
    return <Navigate to="/upgrade" replace />;
  }

  // Show upgrade prompt
  return (
    <PageWrapper
      title={resource?.display_name || 'Premium Feature'}
      showBreadcrumbs={false}
    >
      <UpgradePrompt
        feature={resource?.display_name}
        description={resource?.description}
      />
    </PageWrapper>
  );
}

export default ProtectedRoute;
```

#### Step 2.5: Create Preview Mode Banner

**File:** `/src/components/access/PreviewModeBanner.jsx`

```jsx
/**
 * PreviewModeBanner Component
 *
 * Shows a banner when admin is in preview mode.
 * Allows changing preview settings or exiting.
 */

import React from 'react';
import { usePreviewMode } from '@/hooks/usePreviewMode';
import { Button } from '@/components/ui/button';
import { Eye, X, Settings } from 'lucide-react';

export function PreviewModeBanner() {
  const { isPreviewMode, previewEntitlements, exitPreview } = usePreviewMode();

  if (!isPreviewMode) return null;

  const entitlementList = previewEntitlements.length > 0
    ? previewEntitlements.join(', ')
    : 'No entitlements (free user)';

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-amber-950 px-4 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Eye className="w-5 h-5" />
          <span className="font-medium">Preview Mode:</span>
          <span className="text-sm">{entitlementList}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-amber-950 hover:bg-amber-600"
            onClick={() => window.open('/admin/access-control?preview=true', '_blank')}
          >
            <Settings className="w-4 h-4 mr-1" />
            Change
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-amber-950 hover:bg-amber-600"
            onClick={exitPreview}
          >
            <X className="w-4 h-4 mr-1" />
            Exit Preview
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PreviewModeBanner;
```

---

### Phase 3: Admin UI (Day 2)

#### Step 3.1: Create Access Control Admin Page

**File:** `/src/pages/admin/AccessControlPage.jsx`

This is a large component. Key sections:

1. **Protection Status Dashboard** - Stats cards showing protected/public/unconfigured counts
2. **Warnings Section** - Auto-detected issues
3. **Resource List** - Grouped by type with inline editing
4. **Filters** - By type, protection status, entitlement
5. **Bulk Edit** - Select multiple, apply changes

```jsx
/**
 * AccessControlPage - Admin
 *
 * Centralized access control management.
 * View and edit permissions for all resources in one place.
 *
 * Route: /admin/access-control
 */

import React, { useState, useMemo } from 'react';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useProtectedResources,
  useAccessControlStats,
  useAccessWarnings,
} from '@/hooks/useAccessControl';
import { useEntitlements } from '@/hooks/useEntitlements';
import { useDownloads } from '@/hooks/useDownloads';
import { useModules } from '@/hooks/useModules';
import { ProtectionStatusCards } from '@/components/features/admin/access/ProtectionStatusCards';
import { AccessWarnings } from '@/components/features/admin/access/AccessWarnings';
import { ResourceList } from '@/components/features/admin/access/ResourceList';
import { AccessEditModal } from '@/components/features/admin/access/AccessEditModal';
import { BulkEditModal } from '@/components/features/admin/access/BulkEditModal';
import { PreviewLauncher } from '@/components/features/admin/access/PreviewLauncher';
import {
  Shield,
  Search,
  Filter,
  Eye,
  RefreshCw,
  Download as DownloadIcon,
} from 'lucide-react';

export function AccessControlPage() {
  // Data hooks
  const { resources, isLoading: resourcesLoading, refetch: refetchResources } = useProtectedResources();
  const { downloads, isLoading: downloadsLoading } = useDownloads();
  const { modules, isLoading: modulesLoading } = useModules();
  const { entitlements } = useEntitlements();
  const { stats } = useAccessControlStats();
  const { warnings, dismissWarning } = useAccessWarnings();

  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedItems, setSelectedItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [bulkEditOpen, setBulkEditOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Combine all resources for unified view
  const allResources = useMemo(() => {
    const combined = [];

    // Add protected_resources (pages, features, widgets, tools)
    resources?.forEach(r => {
      combined.push({
        ...r,
        source: 'protected_resources',
        sourceType: r.resource_type,
      });
    });

    // Add downloads
    downloads?.forEach(d => {
      combined.push({
        id: d.id,
        slug: d.slug,
        display_name: d.title,
        description: d.description,
        resource_type: 'download',
        accessible_via: d.accessible_via || [],
        is_public: d.is_free,
        source: 'downloads',
        sourceType: 'download',
      });
    });

    // Add modules
    modules?.forEach(m => {
      combined.push({
        id: m.id,
        slug: m.slug,
        display_name: m.title,
        description: m.description,
        resource_type: 'module',
        accessible_via: m.accessible_via || [],
        is_public: false,
        source: 'modules',
        sourceType: 'module',
      });
    });

    return combined;
  }, [resources, downloads, modules]);

  // Filter resources
  const filteredResources = useMemo(() => {
    let result = allResources;

    // Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(r =>
        r.display_name?.toLowerCase().includes(query) ||
        r.slug?.toLowerCase().includes(query) ||
        r.description?.toLowerCase().includes(query)
      );
    }

    // Type filter
    if (typeFilter !== 'all') {
      result = result.filter(r => r.resource_type === typeFilter);
    }

    // Status filter
    if (statusFilter === 'protected') {
      result = result.filter(r => r.accessible_via?.length > 0);
    } else if (statusFilter === 'public') {
      result = result.filter(r => r.is_public);
    } else if (statusFilter === 'unconfigured') {
      result = result.filter(r =>
        !r.is_public && (!r.accessible_via || r.accessible_via.length === 0)
      );
    }

    return result;
  }, [allResources, searchQuery, typeFilter, statusFilter]);

  // Group by type for display
  const groupedResources = useMemo(() => {
    const groups = {
      page: [],
      feature: [],
      widget: [],
      tool: [],
      download: [],
      module: [],
    };

    filteredResources.forEach(r => {
      const type = r.resource_type;
      if (groups[type]) {
        groups[type].push(r);
      }
    });

    return groups;
  }, [filteredResources]);

  const isLoading = resourcesLoading || downloadsLoading || modulesLoading;

  const breadcrumbs = [
    { label: 'Admin', href: '/admin' },
    { label: 'Access Control' },
  ];

  return (
    <PageWrapper
      title="Access Control"
      description="Manage who can access what across the platform"
      breadcrumbs={breadcrumbs}
    >
      {/* Protection Status Cards */}
      <ProtectionStatusCards stats={stats} />

      {/* Warnings */}
      {warnings?.length > 0 && (
        <AccessWarnings
          warnings={warnings}
          onDismiss={dismissWarning}
          onFix={(warning) => setEditingItem(warning.resource)}
        />
      )}

      {/* Actions Bar */}
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="border rounded-md px-3 py-2 text-sm"
              >
                <option value="all">All Types</option>
                <option value="page">Pages</option>
                <option value="feature">Features</option>
                <option value="widget">Widgets</option>
                <option value="tool">Tools</option>
                <option value="download">Downloads</option>
                <option value="module">Modules</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border rounded-md px-3 py-2 text-sm"
              >
                <option value="all">All Status</option>
                <option value="protected">Protected</option>
                <option value="public">Public</option>
                <option value="unconfigured">⚠️ Unconfigured</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setPreviewOpen(true)}
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview As
              </Button>

              {selectedItems.length > 0 && (
                <Button onClick={() => setBulkEditOpen(true)}>
                  Edit {selectedItems.length} Selected
                </Button>
              )}

              <Button variant="outline" onClick={refetchResources}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resource Lists */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All ({filteredResources.length})</TabsTrigger>
          <TabsTrigger value="pages">Pages ({groupedResources.page.length})</TabsTrigger>
          <TabsTrigger value="features">Features ({groupedResources.feature.length})</TabsTrigger>
          <TabsTrigger value="downloads">Downloads ({groupedResources.download.length})</TabsTrigger>
          <TabsTrigger value="modules">Modules ({groupedResources.module.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <ResourceList
            resources={filteredResources}
            entitlements={entitlements}
            selectedItems={selectedItems}
            onSelectionChange={setSelectedItems}
            onEdit={setEditingItem}
            isLoading={isLoading}
            showTypeColumn
          />
        </TabsContent>

        <TabsContent value="pages">
          <ResourceList
            resources={groupedResources.page}
            entitlements={entitlements}
            selectedItems={selectedItems}
            onSelectionChange={setSelectedItems}
            onEdit={setEditingItem}
            isLoading={isLoading}
            showHierarchy
          />
        </TabsContent>

        {/* Similar TabsContent for features, downloads, modules */}
      </Tabs>

      {/* Edit Modal */}
      <AccessEditModal
        open={!!editingItem}
        onOpenChange={(open) => !open && setEditingItem(null)}
        resource={editingItem}
        entitlements={entitlements}
        onSave={async (updates) => {
          // Save logic here
          refetchResources();
          setEditingItem(null);
        }}
      />

      {/* Bulk Edit Modal */}
      <BulkEditModal
        open={bulkEditOpen}
        onOpenChange={setBulkEditOpen}
        selectedItems={selectedItems}
        entitlements={entitlements}
        onSave={async (updates) => {
          // Bulk save logic here
          refetchResources();
          setSelectedItems([]);
          setBulkEditOpen(false);
        }}
      />

      {/* Preview Launcher */}
      <PreviewLauncher
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        entitlements={entitlements}
      />
    </PageWrapper>
  );
}

export default AccessControlPage;
```

#### Step 3.2: Create Supporting Admin Components

**Files to create:**

| File | Purpose |
|------|---------|
| `/src/components/features/admin/access/ProtectionStatusCards.jsx` | Stats cards at top |
| `/src/components/features/admin/access/AccessWarnings.jsx` | Warning display |
| `/src/components/features/admin/access/ResourceList.jsx` | Resource list with checkboxes |
| `/src/components/features/admin/access/ResourceRow.jsx` | Individual row with inline edit |
| `/src/components/features/admin/access/AccessEditModal.jsx` | Edit single resource |
| `/src/components/features/admin/access/BulkEditModal.jsx` | Edit multiple resources |
| `/src/components/features/admin/access/PreviewLauncher.jsx` | Launch preview mode |
| `/src/hooks/useAccessControl.js` | Data fetching for access control |

(Detailed implementations in Appendix)

---

### Phase 4: Migration & Integration (Day 2-3)

#### Step 4.1: Update Router with ProtectedRoute

**File:** `/src/router.jsx` (modify existing)

```jsx
import { ProtectedRoute } from '@/components/access/ProtectedRoute';

// Before:
<Route path="/quiz-lab" element={<QuizLabPage />} />

// After:
<Route path="/quiz-lab" element={
  <ProtectedRoute resourceSlug="quiz-lab">
    <QuizLabPage />
  </ProtectedRoute>
} />
```

#### Step 4.2: Add FeatureGate to Components

Example migration for a page:

```jsx
// Before (SchoolProfilePage.jsx):
function SchoolProfilePage() {
  return (
    <PageWrapper>
      <SchoolHeader />
      <AISchoolInsights />  {/* Was always shown */}
      <SchoolDetails />
    </PageWrapper>
  );
}

// After:
import { FeatureGate } from '@/components/access/FeatureGate';

function SchoolProfilePage() {
  return (
    <PageWrapper>
      <SchoolHeader />
      <FeatureGate slug="school-ai-insights">
        <AISchoolInsights />
      </FeatureGate>
      <SchoolDetails />
    </PageWrapper>
  );
}
```

#### Step 4.3: Add Preview Mode Provider to App

**File:** `/src/App.jsx` (modify existing)

```jsx
import { PreviewModeProvider } from '@/hooks/usePreviewMode';
import { PreviewModeBanner } from '@/components/access/PreviewModeBanner';

function App() {
  return (
    <AuthProvider>
      <PreviewModeProvider>
        <PreviewModeBanner />
        <RouterProvider router={router} />
      </PreviewModeProvider>
    </AuthProvider>
  );
}
```

#### Step 4.4: Run Initial Sync

After deploying, run the registry sync to populate protected_resources:

```javascript
// Can be triggered via admin button or run once on deploy
import { syncResourceRegistry } from '@/lib/syncResourceRegistry';

await syncResourceRegistry();
// Creates rows for all resources with default protection
```

---

## Admin UI Specifications

### Protection Status Cards

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│    142      │  │      3      │  │     12      │  │      0      │
│  Protected  │  │  ⚠️ Public  │  │  Premium    │  │ 🔴 No Rules │
│   (green)   │  │   (blue)    │  │   (purple)  │  │    (red)    │
└─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘
```

**Queries:**
- Protected: `WHERE accessible_via != '{}' OR is_public = true`
- Public: `WHERE is_public = true`
- Premium only: `WHERE 'premium_tier' = ANY(accessible_via) AND NOT 'active_membership' = ANY(accessible_via)`
- No rules: `WHERE accessible_via = '{}' AND is_public = false`

### Resource Row Design

```
┌────────────────────────────────────────────────────────────────────────┐
│ ☐ │ 🟢 │ Resume Templates     │ download │ 🏷️ Active 🏷️ P&A │ [Edit] │
└────────────────────────────────────────────────────────────────────────┘
  │    │           │                │              │              │
  │    │           │                │              │              └─ Action button
  │    │           │                │              └─ Entitlement badges
  │    │           │                └─ Resource type badge
  │    │           └─ Display name (clickable to edit)
  │    └─ Protection status indicator
  └─ Selection checkbox
```

**Status Indicators:**
- 🟢 Green: Protected (has entitlements)
- 🔵 Blue: Intentionally public
- 🟡 Yellow: Premium only (upsell opportunity)
- 🔴 Red: No rules set (needs attention)

### Edit Modal

```
┌─────────────────────────────────────────────────────────────────┐
│  Edit Access: Resume Templates                              ✕   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Resource Type: Download                                        │
│  Slug: resume-templates                                         │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ☐ Make Public (free for everyone)                              │
│                                                                 │
│  Required Entitlements (user needs ANY):                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ☑ Active Membership                                     │   │
│  │ ☑ Plan+Apply Toolkit                                    │   │
│  │ ☐ Interviewing Toolkit                                  │   │
│  │ ☐ Premium Tier                                          │   │
│  │ ☐ CCRN Prep Toolkit                                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  When Access Denied:                                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ◉ Show upgrade prompt                                   │   │
│  │ ○ Blur content with overlay                             │   │
│  │ ○ Hide completely                                       │   │
│  │ ○ Redirect to upgrade page                              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  [Go to download editor →]          [Cancel]  [Save Changes]    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Preview Mode ("View As")

### Launch Modal

```
┌─────────────────────────────────────────────────────────────────┐
│  👁️ Preview Mode                                            ✕   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Simulate how the app appears to users with specific            │
│  entitlements. Blocked features will show upgrade prompts.      │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Quick Presets:                                                 │
│  [Free User] [Trial] [Basic Member] [Premium] [P&A Only]       │
│                                                                 │
│  Or select specific entitlements:                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ☐ Active Membership                                     │   │
│  │ ☑ Plan+Apply Toolkit                                    │   │
│  │ ☐ Interviewing Toolkit                                  │   │
│  │ ☐ Premium Tier                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Currently simulating: Plan+Apply Toolkit only                  │
│                                                                 │
│                               [Cancel]  [Launch Preview →]      │
└─────────────────────────────────────────────────────────────────┘
```

### Preview Banner (Shown During Preview)

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ⚠️ PREVIEW MODE: Viewing as "Plan+Apply Toolkit"    [Change] [Exit]    │
└─────────────────────────────────────────────────────────────────────────┘
```

### Visual Indicators During Preview

When in preview mode, show indicators on gated content:

- **Accessible:** Green badge "✓ Accessible"
- **Blocked:** Red badge "🔒 Blocked" + shows what would appear to user

---

## Smart Warnings System

### Warning Types & Detection Queries

#### Warning 1: No Protection Set

```sql
-- Items with no entitlements AND not marked public
SELECT
  'protected_resources' as source,
  slug,
  display_name,
  resource_type,
  'no_rules' as warning_type,
  'This item has no access rules and is not marked as public' as message
FROM protected_resources
WHERE accessible_via = '{}'
  AND is_public = FALSE
  AND is_active = TRUE
  AND 'no_rules' != ALL(COALESCE(warnings_dismissed, '{}'))

UNION ALL

SELECT
  'downloads' as source,
  slug,
  title as display_name,
  'download' as resource_type,
  'no_rules' as warning_type,
  'This download has no access rules and is not marked as free' as message
FROM downloads
WHERE accessible_via = '{}'
  AND is_free = FALSE
  AND status = 'active';
```

#### Warning 2: Feature More Restrictive Than Parent

```sql
SELECT
  child.slug,
  child.display_name,
  parent.slug as parent_slug,
  parent.display_name as parent_name,
  child.accessible_via as child_requires,
  parent.accessible_via as parent_requires,
  'feature_parent_mismatch' as warning_type,
  'Feature requires entitlements that parent page does not require' as message
FROM protected_resources child
JOIN protected_resources parent ON child.parent_slug = parent.slug
WHERE child.resource_type IN ('feature', 'widget')
  AND parent.resource_type = 'page'
  AND child.accessible_via != '{}'
  AND NOT (parent.accessible_via @> child.accessible_via)
  AND 'feature_parent_mismatch' != ALL(COALESCE(child.warnings_dismissed, '{}'));
```

#### Warning 3: Orphaned Feature

```sql
SELECT
  slug,
  display_name,
  parent_slug,
  'orphaned_feature' as warning_type,
  'Feature references a parent that does not exist' as message
FROM protected_resources
WHERE parent_slug IS NOT NULL
  AND parent_slug NOT IN (
    SELECT slug FROM protected_resources WHERE resource_type = 'page'
  );
```

#### Warning 4: Unused Entitlement

```sql
SELECT
  e.slug,
  e.display_name,
  'unused_entitlement' as warning_type,
  'Entitlement is not assigned to any content' as message
FROM entitlements e
WHERE e.is_active = TRUE
  AND NOT EXISTS (
    SELECT 1 FROM protected_resources WHERE e.slug = ANY(accessible_via)
  )
  AND NOT EXISTS (
    SELECT 1 FROM downloads WHERE e.slug = ANY(accessible_via)
  )
  AND NOT EXISTS (
    SELECT 1 FROM modules WHERE e.slug = ANY(accessible_via)
  );
```

### Dismissing Warnings

When admin clicks "This is fine", add warning type to `warnings_dismissed` array:

```sql
UPDATE protected_resources
SET warnings_dismissed = array_append(warnings_dismissed, 'feature_parent_mismatch')
WHERE slug = 'school-ai-insights';
```

---

## Testing Requirements

### Unit Tests

| Test | What to Verify |
|------|----------------|
| `useResourceAccess` | Returns correct access for various entitlement combinations |
| `useResourceAccess` | Preview mode overrides user entitlements |
| `useResourceAccess` | Handles missing/invalid slugs gracefully |
| `FeatureGate` | Renders children when access granted |
| `FeatureGate` | Shows upgrade prompt when access denied |
| `FeatureGate` | Respects deny_behavior setting |
| `ProtectedRoute` | Allows access when entitled |
| `ProtectedRoute` | Redirects when not entitled |
| `syncResourceRegistry` | Creates new resources |
| `syncResourceRegistry` | Updates metadata without overwriting access rules |

### Integration Tests

| Test | Steps |
|------|-------|
| Page protection | 1. Remove entitlement from user 2. Navigate to protected page 3. Verify upgrade prompt shown |
| Feature gating | 1. Load page with gated feature 2. Verify feature shows upgrade prompt 3. Add entitlement 4. Verify feature visible |
| Preview mode | 1. Enable preview with limited entitlements 2. Navigate through app 3. Verify correct features blocked 4. Exit preview 5. Verify full access restored |
| Admin editing | 1. Change resource access rules in admin 2. Clear cache 3. Verify new rules applied |
| Bulk edit | 1. Select multiple resources 2. Add entitlement to all 3. Verify all updated |

### Manual Test Checklist

- [ ] All pages in registry are protected
- [ ] All features in registry are gated
- [ ] New download gets default protection
- [ ] Admin can edit access from Access Control page
- [ ] Admin can edit access from item's own form
- [ ] Both edit locations stay in sync
- [ ] Preview mode shows correct blocked/allowed states
- [ ] Warnings appear for misconfigured items
- [ ] Dismissing warning persists across page loads
- [ ] Bulk edit works correctly
- [ ] CSV export includes all resources

---

## Migration Strategy

### Step 1: Deploy Infrastructure (No User Impact)

1. Run database migration
2. Deploy code with new hooks and components
3. Do NOT update router yet - old pages still work

### Step 2: Sync Registry

1. Trigger registry sync via admin
2. Verify all resources appear in admin UI
3. Review and adjust default protection as needed

### Step 3: Update Router (Gradual)

Migrate pages one at a time:

```jsx
// Week 1: Low-risk pages
<ProtectedRoute resourceSlug="events"><EventsPage /></ProtectedRoute>

// Week 2: Core pages
<ProtectedRoute resourceSlug="dashboard"><DashboardPage /></ProtectedRoute>

// Week 3: Remaining pages
// ...
```

### Step 4: Add FeatureGates

Add FeatureGate wrappers to premium features:

```jsx
<FeatureGate slug="quiz-analytics">
  <QuizAnalytics />
</FeatureGate>
```

### Step 5: Remove Old Hardcoded Checks

After ProtectedRoute/FeatureGate are in place, remove old inline checks:

```jsx
// Remove this:
const hasAccess = user?.entitlements?.includes('active_membership');
if (!hasAccess) return <UpgradePrompt />;

// ProtectedRoute or FeatureGate now handles it
```

### Rollback Plan

If issues arise:
1. Router changes can be reverted without data loss
2. protected_resources table can be truncated and re-synced
3. Original content tables (downloads, modules) are unchanged

---

## Safeguards & Edge Cases

### Safeguard 1: Default Protection

**Problem:** New items could be accidentally exposed.

**Solution:** Default protection applied on creation.

```javascript
// In syncResourceRegistry.js
const defaultProtection = await getDefaultProtection(resource.resourceType);
// New resources get this automatically
```

### Safeguard 2: Public Requires Explicit Action

**Problem:** Admin could accidentally make something public.

**Solution:** Require confirmation for public items.

```jsx
// In AccessEditModal
const handlePublicToggle = (checked) => {
  if (checked) {
    // Show confirmation dialog
    setShowPublicConfirm(true);
  } else {
    setIsPublic(false);
  }
};
```

### Safeguard 3: Cache Invalidation

**Problem:** Access rules could be cached and stale.

**Solution:** Clear cache on admin updates.

```javascript
// After saving in admin
import { clearResourceCache } from '@/hooks/useResourceAccess';
clearResourceCache();
```

### Safeguard 4: Preview Mode Isolation

**Problem:** Preview mode could affect real data.

**Solution:** Preview only affects access checks, not data operations.

```javascript
// Preview mode is read-only - only affects what useResourceAccess returns
// All data operations use real user context
```

### Edge Cases to Handle

| Edge Case | Handling |
|-----------|----------|
| Resource in registry but not in DB | Sync creates it with defaults |
| Resource in DB but not in registry | Keep it (may be manually added) |
| User has no entitlements array | Treat as empty array |
| Resource has empty accessible_via | Require auth but no specific entitlement |
| Preview mode on mobile | Show simplified banner |
| Multiple tabs with different preview states | Each tab independent (URL-based) |
| Admin previewing themselves | Works normally, banner shown |

---

## Future Considerations

### Potential Enhancements

1. **Time-based access** - Add `valid_from` and `valid_until` to protected_resources
2. **User-specific overrides** - Table for per-user access grants
3. **Access request workflow** - Users can request access, admins approve
4. **Analytics** - Track access denied events, conversion to upgrade
5. **A/B testing** - Show different deny behaviors to different users
6. **API endpoint protection** - Extend to API routes, not just UI

### Scaling Considerations

Current design handles:
- 500+ protected resources ✅
- 10,000+ users ✅
- 100+ entitlements ✅

For larger scale:
- Add Redis cache for resource lookups
- Denormalize user entitlements
- Consider dedicated auth service

### Integration Points

| System | Integration |
|--------|-------------|
| Stripe | Webhook updates user entitlements on subscription change |
| WooCommerce | Sync product purchases to entitlements |
| Groundhogg | Tag changes could trigger entitlement updates |
| Analytics | Track feature gate impressions and conversions |

---

## Appendix

### A. Complete File List

| File | Type | Purpose |
|------|------|---------|
| `supabase/migrations/20251217000000_access_control_system.sql` | Migration | Database schema |
| `src/config/resource-registry.js` | Config | Resource definitions |
| `src/lib/syncResourceRegistry.js` | Utility | Sync registry to DB |
| `src/hooks/useResourceAccess.js` | Hook | Check resource access |
| `src/hooks/usePreviewMode.js` | Hook | Preview mode state |
| `src/hooks/useAccessControl.js` | Hook | Admin data fetching |
| `src/components/access/FeatureGate.jsx` | Component | Wrap gated features |
| `src/components/access/ProtectedRoute.jsx` | Component | Wrap gated routes |
| `src/components/access/PreviewModeBanner.jsx` | Component | Preview mode UI |
| `src/pages/admin/AccessControlPage.jsx` | Page | Main admin page |
| `src/components/features/admin/access/*.jsx` | Components | Admin UI components |

### B. Entitlement Slugs Reference

| Slug | Display Name | Typical Use |
|------|--------------|-------------|
| `active_membership` | Active Membership | Base paid tier |
| `premium_tier` | Premium Tier | Enhanced features |
| `plan_apply_toolkit` | Plan+Apply Toolkit | P&A course + downloads |
| `interviewing_toolkit` | Interviewing Toolkit | Interview prep content |
| `ccrn_prep_toolkit` | CCRN Prep Toolkit | CCRN study materials |
| `free_trial` | Free Trial | 7-day trial access |

### C. Admin Route

Add to router:

```jsx
// In admin routes section
<Route path="/admin/access-control" element={
  <AdminRoute>
    <AccessControlPage />
  </AdminRoute>
} />
```

Add to admin sidebar navigation.

---

## Document History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Dec 16, 2024 | Initial planning document |

---

## Approval

- [ ] Technical review complete
- [ ] Product review complete
- [ ] Ready for implementation

---

*End of Implementation Plan*
