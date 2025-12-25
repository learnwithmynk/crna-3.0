# Dev Team Handoff Document

Complete technical reference for The CRNA Club React application.

**Last Updated:** December 14, 2024

---

# SECTION A: CONTEXT

## 1. About The CRNA Club

**The CRNA Club** is a membership platform for ICU nurses pursuing careers as Certified Registered Nurse Anesthetists (CRNAs). The application journey typically takes 2-3 years, and this app serves as their all-in-one companion throughout.

### Glossary

| Term | Definition |
|------|------------|
| **CRNA** | Certified Registered Nurse Anesthetist - advanced practice nurse who administers anesthesia |
| **SRNA** | Student Registered Nurse Anesthetist - already accepted into CRNA school |
| **ICU** | Intensive Care Unit - where applicants work (1-3 years required experience) |
| **ReadyScore** | 0-100 score indicating application readiness |
| **Shadow Day** | Observing a CRNA at work (most schools require 20-40 hours) |
| **EQ Reflection** | Emotional intelligence journal entry for interview prep |
| **Supabase** | Primary backend (Postgres + Auth + Realtime + Storage) |
| **Cal.com** | Scheduling API for marketplace bookings |
| **Community** | Custom Supabase forums (not BuddyBoss) |
| **Groundhogg** | WordPress email marketing plugin |
| **Entitlement** | Permission slug that grants access to content |

### User Types

| Type | Description | Primary Features |
|------|-------------|------------------|
| **Applicant** | ICU nurse preparing to apply to CRNA school | Dashboard, Schools, Trackers, Stats, Marketplace (buyer) |
| **SRNA/Provider** | Student already in CRNA program, offers mentoring | Marketplace (seller), Earnings, Bookings |
| **Admin** | Platform staff | User management, Content, Provider approvals |

### Subscription Model

| Tier | Price | Access |
|------|-------|--------|
| Free/Lead | $0 | Paywalled preview, limited features |
| 7-Day Trial | $0 → $27/mo | Full access, auto-converts |
| CRNA Club Membership | $27/mo | Full access |
| Founding Member | $12-19/mo | Legacy pricing, lifetime access |
| Toolkit Only | ~$97 one-time | Specific content bundles |

Access is controlled by **entitlements** stored in Supabase, NOT Groundhogg tags.

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                           FRONTEND                                   │
│  React 19 + Vite 7 + Tailwind 4 + shadcn/ui                         │
│  Deployed on Vercel                                                  │
├─────────────────────────────────────────────────────────────────────┤
│                       PRIMARY BACKEND                                │
│  Supabase                                                            │
│  ├── Postgres (16 migrations, ~50 tables)                           │
│  ├── Auth (magic links, passwords)                                  │
│  ├── Realtime (marketplace messaging)                               │
│  ├── Storage (images, videos, downloads)                            │
│  └── Edge Functions (webhooks, migrations)                          │
├─────────────────────────────────────────────────────────────────────┤
│                        MARKETPLACE                                   │
│  ├── Stripe Connect Express (20% platform fee)                      │
│  ├── Cal.com Platform API (scheduling, white-labeled)               │
│  └── Supabase Realtime (pre-booking messaging)                      │
├─────────────────────────────────────────────────────────────────────┤
│                    WORDPRESS (Retained)                              │
│  ├── Groundhogg (email marketing, automations)                      │
│  ├── WooCommerce (one-time products, physical goods)                │
│  ├── (Community moved to Supabase - see Phase 6)                    │
│  └── Blog (content marketing)                                        │
├─────────────────────────────────────────────────────────────────────┤
│                        EMAIL SOURCES                                 │
│  ├── Supabase (magic links, password reset)                         │
│  ├── Stripe (payment receipts, failed payments)                     │
│  └── Groundhogg (welcome sequences, marketing)                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Service Responsibilities

| Service | Owns | Does NOT Own |
|---------|------|--------------|
| **Supabase** | Auth, user data, trackers, marketplace, schools, permissions | Email marketing, blog |
| **WordPress** | Email (Groundhogg), products (WooCommerce), blog, community | Auth, user data |
| **Stripe** | Payments, subscriptions, Connect payouts | User accounts |
| **Cal.com** | Scheduling, availability, bookings | Payments, user data |

---

# SECTION B: GETTING STARTED

## 3. Quick Start

```bash
# Clone and run
git clone [repository-url]
cd crna-club-rebuild
npm install
npm run dev
# Opens http://localhost:5173
```

Everything works with mock data. No backend required to explore the UI.

### Build Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build
npm run test:run     # Unit tests (Vitest)
npx playwright test  # E2E tests (769 tests)
```

### Environment Variables

Copy `.env.example` to `.env`:

```env
# Supabase (Required)
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# Stripe (Required for billing)
VITE_STRIPE_PUBLISHABLE_KEY=

# Cal.com (Required for marketplace scheduling)
CAL_COM_API_URL=https://api.cal.com/v2
CAL_COM_CLIENT_ID=
CAL_COM_CLIENT_SECRET=
CAL_COM_WEBHOOK_SECRET=

# WordPress (for legacy integrations)
VITE_API_URL=https://thecrnaclub.com/wp-json

# Feature Flags
VITE_ENABLE_MARKETPLACE=false
```

---

## 4. Codebase Structure

```
/crna-club-rebuild
├── src/
│   ├── components/
│   │   ├── ui/               # shadcn/ui base components
│   │   ├── layout/           # Sidebar, Header, PageWrapper
│   │   └── features/         # Feature-specific components
│   │       ├── dashboard/    # Dashboard widgets
│   │       ├── marketplace/  # Marketplace components
│   │       ├── trackers/     # Clinical, Shadow, EQ trackers
│   │       ├── admin/        # Admin panel components
│   │       └── ...
│   ├── pages/
│   │   ├── applicant/        # Applicant-facing pages
│   │   ├── srna/             # SRNA/provider pages
│   │   ├── admin/            # Admin pages
│   │   └── shared/           # Auth, settings, etc.
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utilities, helpers
│   │   ├── supabase.js       # Supabase client
│   │   ├── telemetry.js      # Analytics tracking
│   │   └── guidance/         # Guidance engine
│   ├── data/                 # Mock data files
│   │   └── marketplace/      # Marketplace mock data
│   └── styles/               # Global styles
├── supabase/
│   └── migrations/           # 27 SQL migration files
├── tests/                    # Playwright E2E tests (45 files)
├── docs/
│   ├── skills/               # How-to guides
│   ├── project/              # Project documentation
│   │   └── marketplace/      # Marketplace planning docs
│   └── reference/            # Screenshots, specs
└── public/                   # Static assets
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Pages | PascalCase + "Page" | `DashboardPage.jsx` |
| Components | PascalCase | `ProgramCard.jsx` |
| Hooks | camelCase with "use" | `usePrograms.js` |
| Utilities | camelCase | `formatCurrency.js` |
| Mock data | camelCase with "mock" | `mockSchools.js` |
| Type definitions | PascalCase | `src/types/school.ts` |

### TypeScript Setup (New Code)

**All new files should be written in TypeScript.** The project is configured for gradual adoption:

```
tsconfig.json          # TypeScript config (allowJs: true)
src/types/             # Shared type definitions
  └── school.ts        # Example: School interface
```

**Rules:**
- **New files:** Use `.ts` (utilities, hooks) or `.tsx` (components)
- **Existing files:** Leave as `.js`/`.jsx` - don't convert unless necessary
- **Imports:** TypeScript files can import from JavaScript files (and vice versa)

**Example - New TypeScript Hook:**
```typescript
// src/hooks/useNewFeature.ts
import type { School } from '@/types/school';

interface UseNewFeatureReturn {
  data: School | null;
  isLoading: boolean;
}

export function useNewFeature(schoolId: string): UseNewFeatureReturn {
  // TypeScript will catch errors like school.naem (typo)
  return { data: null, isLoading: false };
}
```

**Example - New TypeScript Component:**
```tsx
// src/components/features/NewCard.tsx
import type { School } from '@/types/school';

interface NewCardProps {
  school: School;
  onSave: (id: string) => void;
}

export function NewCard({ school, onSave }: NewCardProps) {
  return (
    <div onClick={() => onSave(school.id)}>
      {school.name}
    </div>
  );
}
```

**Type definitions location:** `src/types/`
- `school.ts` - School, FitScore, SchoolWithFitScore
- Add new files as needed: `user.ts`, `booking.ts`, etc.

**Benefits:**
- Autocomplete in VS Code
- Catch typos at compile time (not runtime)
- Self-documenting function signatures
- Easier refactoring

### React → Supabase Naming

React uses **camelCase**, Supabase uses **snake_case**:

```javascript
// React component
const school = { minimumGpa: 3.5, tuitionInState: 50000 };

// Supabase table
// minimum_gpa, tuition_in_state
```

Convert when fetching/saving.

---

# SECTION C: DATABASE & BACKEND

## 5. Complete Database Schema

### Migration Files (Run in Order)

All migrations are in `supabase/migrations/`. Run with:

```bash
npx supabase db push
```

| Migration | Tables Created | Purpose |
|-----------|----------------|---------|
| `20251210054954` | `user_id_mapping`, `provider_profiles`, `services`, `bookings`, `booking_cal_com_mapping`, `booking_reviews`, `notifications`, `conversations`, `messages`, `message_flags`, `saved_providers`, `provider_applications` | Core marketplace |
| `20251210060000` | `categories`, `entitlements`, `modules`, `sections`, `lessons`, `downloads`, `user_lesson_progress` | LMS schema |
| `20251210070000` | *(extends downloads)* | Downloads file source field |
| `20251210080000` | *(functions)* | Category rename function |
| `20251210090000` | `point_actions`, `point_promos`, `user_points`, `user_point_log` | Gamification points |
| `20251212000000` | `guidance_events` | Guidance telemetry |
| `20251212100000` | *(extends marketplace)* | Marketplace schema updates |
| `20251213100000` | *(extends point_actions)* | Marketplace point actions |
| `20251213200000` | `user_onboarding` | Onboarding state |
| `20251213300000` | `admin_conversations`, `admin_messages` | Admin messaging |
| `20251213400000` | *(extends bookings)* | Cancellations/disputes |
| `20251213500000` | *(extends provider_profiles)* | Welcome video |
| `20251213600000` | `schools`, `school_events`, `schools_internal`, `user_saved_schools`, `target_program_checklists`, `target_program_lors`, `target_program_documents` | Schools & programs |
| `20251213700000` | `user_profiles`, `user_academic_profiles`, `user_completed_prerequisites`, `user_clinical_profiles`, `user_certifications`, `user_guidance_state`, `user_focus_areas`, `user_activity_log` | User profiles |
| `20251213800000` | `clinical_entries`, `clinical_tracker_stats`, `shadow_days`, `crna_network`, `shadow_tracker_stats`, `eq_reflections`, `eq_tracker_stats`, `user_events`, `event_tracker_stats`, `user_letter_requests`, `user_leadership` | Trackers |
| `20251213900000` | `wordpress_user_mapping`, `wordpress_user_meta_staging`, `migration_log`, `groundhogg_tag_sync`, `analytics_events` | WordPress migration |
| `20251214000000` | `forums`, `topics`, `replies`, `topic_reactions`, `reply_reactions`, `community_reports`, `user_blocks`, `user_suspensions`, `topic_subscriptions`, `community_notifications`, `profanity_words`, `user_post_rate` | Community forums |
| `20251214100000` | *(extends profanity_words)* | Profanity words RLS |
| `20251214150000` | `spam_check_cache` | StopForumSpam cache |
| `20251214200000` | *(triggers)* | Community notification triggers |
| `20251214300000` | *(extends forums)* | Forum-school linking |
| `20251214400000` | `user_reports` | User-submitted error reports & event suggestions |
| `20251214500000` | *(extends user_guidance_state)* | Prompt state for tracker nudges |
| `20251214600000` | `badges`, `user_badges` | Badge definitions and user achievements |
| `20251214700000` | `level_thresholds`, views | Leaderboard views, auto-level trigger |
| `20251214800000` | `user_calendar_events` | User calendar events (custom events) |
| `20251214900000` | *(extends user_saved_schools)* | Interview date tracking |

**Total: 27 migrations, ~70 tables**

### Key Tables by Feature

#### User Data

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `user_profiles` | Core profile (extends auth.users) | `subscription_tier`, `points`, `level`, `ready_score` |
| `user_academic_profiles` | GPA & test scores | `overall_gpa`, `science_gpa`, `gre_*` |
| `user_clinical_profiles` | ICU experience | `primary_icu_type`, `total_years_experience` |
| `user_certifications` | CCRN, BLS, ACLS, etc. | `cert_type`, `status`, `expires_date` |
| `user_guidance_state` | Computed guidance state | `application_stage`, `next_best_steps[]` |

#### Trackers

| Table | Purpose | Auto-Stats Table |
|-------|---------|------------------|
| `clinical_entries` | Clinical shift logs | `clinical_tracker_stats` |
| `shadow_days` | Shadow day logs | `shadow_tracker_stats` |
| `eq_reflections` | EQ journal entries | `eq_tracker_stats` |
| `user_events` | Events saved/attended | `event_tracker_stats` |

Stats tables auto-update via triggers on INSERT.

#### Schools

| Table | Purpose |
|-------|---------|
| `schools` | 140+ CRNA programs with requirements |
| `school_events` | Info sessions, open houses |
| `schools_internal` | Admin-only data (RLS protected) |
| `user_saved_schools` | User's target programs |
| `target_program_checklists` | Per-program task checklists |
| `target_program_lors` | Letter of recommendation tracking |

#### Marketplace

| Table | Purpose |
|-------|---------|
| `provider_profiles` | SRNA mentor profiles |
| `provider_applications` | Application to become provider |
| `services` | Service offerings (mock interview, essay review, etc.) |
| `bookings` | Booking records |
| `booking_reviews` | Double-blind reviews |
| `conversations` | Pre-booking inquiry threads |
| `messages` | Individual messages |
| `notifications` | In-app notifications |

#### LMS

| Table | Purpose |
|-------|---------|
| `modules` | Top-level content containers |
| `sections` | Optional grouping within modules |
| `lessons` | Individual content pages (Editor.js JSON) |
| `downloads` | Downloadable resources |
| `user_lesson_progress` | Completion tracking |

### Auto-Created User Profile

When a user signs up via Supabase Auth, a trigger automatically creates:

```sql
-- Runs on auth.users INSERT
1. user_profiles row (with email, name from auth metadata)
2. user_guidance_state row (with defaults)
```

No manual profile creation needed.

### Row Level Security (RLS)

All user data tables have RLS enabled:

| Policy Pattern | Effect |
|----------------|--------|
| `user_own_*` | Users can only read/write their own data |
| `admin_read_*` | Admins can read all (for support) |
| `admin_*` | Admins can read/write all |

**Admin detection:**
```sql
auth.jwt() ->> 'role' = 'admin' OR
auth.jwt() ->> 'user_role' = 'admin'
```

Set custom claims in Supabase Auth for admin users.

---

## 6. WordPress Integration

### What Lives in WordPress

| System | Purpose | Integration |
|--------|---------|-------------|
| **Groundhogg** | Email marketing, automations | Receives tags FROM Supabase |
| **WooCommerce** | One-time products, cart | Webhook to Supabase on purchase |
| **Community** | Custom Supabase forums | No longer using BuddyBoss |
| **Blog** | Content marketing | Link out or fetch via REST |

### WordPress User Migration

For existing WordPress users, use the migration helper:

```sql
SELECT * FROM migrate_wordpress_user(
  p_wordpress_user_id := 12345,
  p_email := 'user@example.com',
  p_display_name := 'John Doe',
  p_meta := '{"overall_gpa": "3.8"}'::jsonb
);
```

### WordPress Meta Key Mapping

| WordPress Meta Key | Supabase Table.Column |
|--------------------|-----------------------|
| `nickname` | `user_profiles.preferred_name` |
| `display_name` | `user_profiles.name` |
| `profile_photo` | `user_profiles.avatar_url` |
| `membership_level` | `user_profiles.subscription_tier` |
| `gamipress_points` | `user_profiles.points` |
| `overall_gpa` | `user_academic_profiles.overall_gpa` |
| `science_gpa` | `user_academic_profiles.science_gpa` |
| `primary_icu_type` | `user_clinical_profiles.primary_icu_type` |

**Serialized arrays (need parsing):**
- `completed_prereqs` → `user_completed_prerequisites` (one row per course)
- `certifications` → `user_certifications` (one row per cert)
- `clinical_entries` → `clinical_entries` (one row per shift)

### Groundhogg Tag Sync

Tags sync FROM Supabase TO Groundhogg (not the other way):

```
Stripe webhook → Supabase Edge Function → Update user_entitlements
                                        → Call Groundhogg API to sync tags
```

Groundhogg does NOT control access. Supabase entitlements do.

---

# SECTION D: FEATURE DEEP DIVES

## 7. Priority 1: Auth & User Profiles

### Auth Flow

1. User submits login form
2. Supabase Auth `signInWithPassword()` or magic link
3. Session stored automatically in localStorage
4. Trigger creates `user_profiles` row if new user
5. Community uses Supabase directly (no WordPress sync needed)

### Entitlements System

Entitlements are permission slugs that grant access:

| Entitlement | Source | Permanence |
|-------------|--------|------------|
| `active_membership` | Active subscription | Removed on cancel |
| `plan_apply_toolkit` | One-time purchase | Permanent |
| `interviewing_toolkit` | One-time purchase | Permanent |
| `founding_member` | Legacy status | Permanent |

**Access check pattern:**
```javascript
function canAccess(user, content) {
  return content.accessible_via.some(req =>
    user.entitlements.includes(req)
  );
}
```

---

## 8. Priority 2: Schools & Programs

### School Database

- 140+ CRNA programs with detailed info
- Requirements: GPA, certs, ICU experience, prerequisites
- Application info: deadlines, fees, process
- Statistics: class size, NCE pass rate

### Target Program Tracking

Users can save schools as targets and track:
- Application status (researching → submitted → accepted)
- Per-program checklists (custom tasks)
- LOR tracking (who, status, received date)
- Document uploads

---

## 8.5 Dynamic Task Management (GRE/CCRN)

### Overview

GRE and CCRN are **one-time exams** that shouldn't appear as separate tasks for each target program. The Dynamic Task Management system handles global tasks, checklist sync, and smart suggestions.

### Key Concepts

| Concept | Description |
|---------|-------------|
| **Global Task** | A task that applies across all target programs (e.g., "GRE Exam", "CCRN Exam") |
| **Per-School Task** | A task specific to one program (e.g., "Submit Application to Duke") |
| **Checklist Sync** | Auto-marking checklist items complete across all programs when a global task is done |
| **Hidden Items** | Checklist items hidden when a school doesn't require them (e.g., GRE for schools that don't require it) |

### Global Task Categories

```javascript
// src/data/taskConfig.js
export const GLOBAL_TASK_CATEGORIES = ['gre', 'ccrn', 'ccrn-prep'];
```

Tasks in these categories are shown with a 🌐 globe badge and affect all target programs.

### Checklist-to-Task Mapping

```javascript
// src/data/taskConfig.js
export const CHECKLIST_TASK_MAPPING = {
  c5: 'gre',      // Complete the GRE
  c6: 'gre',      // Send GRE Scores
  c7: 'ccrn',     // Complete CCRN
};

export const TASK_CHECKLIST_SYNC_MAP = {
  'GRE Exam': ['c5', 'c6'],
  'First certification (ie. CCRN, CMC)': ['c7'],
  'CCRN Exam': ['c7'],
};
```

### Behavioral Rules

#### 1. Global Task Deadline Calculation
- Uses **earliest deadline** among target programs that require GRE/CCRN
- Badge shows which school's deadline is used
- If no programs require it: Shows "No deadline set" with info tooltip

#### 2. Profile Update → Checklist Sync
When user updates profile with GRE scores or CCRN certification:
1. Detect first-time addition (had no GRE → now has GRE)
2. Show `ChecklistSyncDialog`: "Mark all GRE items complete across your X schools?"
3. If confirmed: Auto-check c5/c6 (GRE) or c7 (CCRN) on all target programs

#### 3. Task Completion → Checklist Sync
When "GRE Exam" or "CCRN Exam" task is marked complete:
1. Show `ChecklistSyncDialog` before completing
2. If confirmed: Complete task AND sync checklists
3. If declined: Complete task only (no checklist sync)
4. Practice/prep tasks (GRE Practice 1, CCRN Prep) → No sync

#### 4. Global Task Deletion
When deleting a global task:
1. Show `GlobalTaskDeleteDialog` with warning
2. Copy: "This is a global task that tracks your [GRE/CCRN] prep across all schools. Deleting it will remove it from your dashboard and all school task lists."
3. Can re-add via "Add Suggested Tasks" on any school

#### 5. Hidden Checklist Items
- Schools NOT requiring GRE/CCRN: Items hidden by default
- User can reveal via 👁 icon
- After revealing: Show `ReportRequirementError` dialog to report incorrect data

#### 6. Dashboard Suggested Tasks (No Target Programs)
When user has no target programs, show `SuggestedTasksWidget` instead of `ToDoListWidget`:

| User Condition | Suggested Tasks |
|----------------|-----------------|
| No GRE scores | Schedule GRE, GRE Practice 1, GRE Practice 2, Take GRE Exam |
| No CCRN cert | Schedule CCRN, CCRN Practice 1, CCRN Practice 2, Take CCRN |
| No shadow hours | Schedule Shadow Day |
| Profile incomplete | Fill out My Stats page |
| GPAs not calculated | Calculate your GPAs |

Data sources: `useOnboardingStatus()`, `useOnboardingSteps()`, user profile tables

### Key Files

| File | Purpose |
|------|---------|
| `src/data/taskConfig.js` | All task configuration (templates, mappings, suggested tasks) |
| `src/components/features/programs/GlobalTaskDeleteDialog.jsx` | Confirm global task deletion |
| `src/components/features/programs/ChecklistSyncDialog.jsx` | Confirm checklist sync across schools |
| `src/components/features/dashboard/SuggestedTasksWidget.jsx` | Dashboard widget for users without targets |
| `src/components/features/dashboard/ToDoListWidget.jsx` | Dashboard tasks with global task handling |
| `src/components/features/programs/ProgramTasksTab.jsx` | Per-program task table with global badges |
| `src/pages/applicant/MyStatsPage.jsx` | Profile update sync trigger |
| `src/hooks/usePrograms.js` | Task state management |

### Configuration in taskConfig.js

```javascript
// Task templates with global flag
export const DEFAULT_TASK_TEMPLATES = [
  { task: 'Submit Application', weeksBeforeDeadline: 0, category: 'application' },
  { task: 'GRE Exam', weeksBeforeDeadline: 20, category: 'gre', isGlobal: true, triggersChecklistSync: true },
  { task: 'CCRN Exam', weeksBeforeDeadline: 18, category: 'ccrn', isGlobal: true, triggersChecklistSync: true },
  // ...
];

// Dashboard suggestions for users without targets
export const DASHBOARD_SUGGESTED_TASKS = [
  { id: 'sug_gre_1', task: 'Schedule GRE', category: 'gre', showIf: 'noGre' },
  { id: 'sug_ccrn_1', task: 'Schedule CCRN', category: 'ccrn', showIf: 'noCcrn' },
  // ...
];
```

### Edge Cases

| Scenario | Behavior |
|----------|----------|
| Remove program with earliest deadline | Recalculate from remaining programs |
| No programs require GRE | Show "No deadline set" |
| Re-add deleted task | Fresh start, recalculate deadline |
| Mixed requirements | Per-school visibility for checklist items |
| Profile update after tasks exist | Show sync dialog, respect existing completion |

---

## 9. Priority 3: Trackers

### Clinical Tracker

Logs ICU shifts with:
- Shift date, type (day/night), duration
- Patient populations (cardiac, trauma, neuro, etc.)
- Medications, devices, procedures (JSONB with confidence levels)
- Notes and "highlight moment" for interview prep

### Shadow Tracker

Logs shadowing experiences:
- Date, location, provider info
- Hours logged, cases observed
- Skills observed
- Follow-up status (thank you sent, LOR requested)

### EQ Tracker

Emotional intelligence journal:
- Reflection text
- Categories (leadership, conflict resolution, etc.)
- "Interview story" flag for easy retrieval

### Auto-Updating Stats

Each tracker has a `*_stats` table that auto-updates:

```sql
-- After INSERT on clinical_entries:
clinical_tracker_stats.total_logs += 1
clinical_tracker_stats.last_entry_date = MAX(shift_date)
```

---

## 10. Priority 4: LMS (Custom Built)

Replaced LearnDash with custom implementation.

### Structure

```
Module (e.g., "Pharmacology")
  └── Section (optional grouping)
       └── Lesson (content page)
            └── Downloads (attached resources)
```

### Content Editor

- **Editor.js** for block-based content
- Blocks: paragraphs, headers, lists, images, videos, embeds
- Autosave + undo/redo

### Access Control

```javascript
const lesson = {
  accessible_via: ["active_membership", "plan_apply_toolkit"]
};
// User can access if they have ANY matching entitlement
```

### Key Files

| File | Purpose |
|------|---------|
| `src/hooks/useModules.js` | Module CRUD |
| `src/hooks/useLessons.js` | Lesson CRUD |
| `src/hooks/useDownloads.js` | Download CRUD |
| `src/components/features/learning/LessonContent.jsx` | Lesson renderer |

---

## 11. Priority 5: Gamification

### Points System

Admin-configurable point values:

| Action | Base Points | Daily Max |
|--------|-------------|-----------|
| `lesson_complete` | 3 | 10 |
| `shadow_log` | 5 | 3 |
| `clinical_log` | 5 | 3 |
| `eq_log` | 5 | 3 |
| `event_log` | 2 | 3 |
| `profile_complete` | 15 | ∞ |
| `program_save` | 3 | 5 |
| `task_complete` | 2 | 20 |
| `milestone_complete` | 10 | ∞ |
| `forum_post` | 2 | 10 |
| `forum_reply` | 2 | 50 |
| `receive_reaction` | 1 | 20 |
| `report_school_error` | 5 | 5 |
| `report_program_event` | 5 | 5 |
| `feedback_submit` | 5 | ∞ |
| `first_login` | 50 | 1 |
| `daily_streak` | 5 | 1 |
| `badge_earn` | 0 (badge value) | ∞ |

### Level System

Users progress through 6 levels based on total points:

| Level | Name | Min Points |
|-------|------|------------|
| 1 | Aspiring Applicant | 0 |
| 2 | Dedicated Dreamer | 200 |
| 3 | Ambitious Achiever | 600 |
| 4 | Committed Candidate | 1,000 |
| 5 | Goal Crusher | 1,600 |
| 6 | Peak Performer | 2,000 |

Levels auto-update via database trigger when points change.

### Badge System

8 achievement badges with different requirements:

| Badge | Requirement | Points |
|-------|-------------|--------|
| Critical Care Crusher | 20 clinical entries | 50 |
| Target Trailblazer | 3 target programs | 30 |
| Lesson Legend | 20 lessons completed | 50 |
| Milestone Machine | 7 milestones completed | 40 |
| Top Contributor | 10 forum posts/replies | 30 |
| Feedback Champion | 3 feedback submissions | 25 |
| EQ Master | 15 EQ reflections | 40 |
| Shadow Seeker | 10 shadow days | 35 |

### Leaderboards

Two leaderboard views:
- **All-time**: Ranked by total points
- **Monthly**: Ranked by points earned this month (resets automatically)

### Promotional Periods

Time-based multipliers (e.g., "2x points this week"):
- One promo active at a time
- Can apply to all actions or specific ones
- Daily max scales with multiplier

### Key Hooks

| Hook | Purpose | Status |
|------|---------|--------|
| `usePoints` | Award points, check caps, track levels | ✅ Supabase-connected |
| `useBadges` | Check/award badges, track progress | ✅ Supabase-connected |
| `usePointsConfig` | Admin config for actions/promos | ✅ Supabase-connected |

### usePoints Hook

```javascript
import { usePoints, POINT_ACTIONS } from '@/hooks/usePoints';

const {
  points,                    // Current total
  currentLevel,              // { level, name, minPoints }
  history,                   // Recent point awards
  isLoading,

  awardPoints,               // Award points (respects daily caps)
  checkDailyCap,             // Check remaining submissions
  getProgressToNextLevel,    // { progress, pointsNeeded, nextLevel }
  getPointsEarnedToday,      // Total points earned today
  getRecentHistory,          // Last N point awards
  refetch,                   // Refresh from Supabase
} = usePoints();

// Award points for an action
const result = await awardPoints(POINT_ACTIONS.CLINICAL_LOG, null, {
  referenceId: 'entry-uuid',
  referenceType: 'clinical_entry'
});
// => { success: true, pointsAwarded: 2, newTotal: 152 }

// Check daily cap before showing UI
const { canSubmit, remaining, cap } = checkDailyCap(POINT_ACTIONS.CLINICAL_LOG);
// => { canSubmit: true, remaining: 2, cap: 3 }
```

### useBadges Hook

```javascript
import { useBadges, useBadgeCheck, BADGES } from '@/hooks/useBadges';

const {
  earnedBadges,              // Array of earned badges
  allBadges,                 // All available badges with progress
  newBadgeNotification,      // Just-earned badge (for celebration)
  isLoading,

  isBadgeEarned,             // Check if badge is earned
  getEarnedBadge,            // Get badge details if earned
  clearNotification,         // Clear celebration modal
  refetch,
} = useBadges();

// Or use useBadgeCheck for checking/awarding specific badges
const { checkAndAwardBadge } = useBadgeCheck();

// After logging a clinical entry, check for badge
await checkAndAwardBadge('critical_care_crusher', {
  currentCount: 20,
  referenceId: 'entry-uuid'
});
```

### Awarding Points (Supabase RPC)

```sql
SELECT * FROM award_points(
  p_user_id := 'user-uuid',
  p_action_slug := 'lesson_complete',
  p_reference_id := 'lesson-uuid',
  p_reference_type := 'lesson'
);
-- Returns: success, points_awarded, message, new_total
```

### Awarding Badges (Supabase RPC)

```sql
SELECT * FROM award_badge(
  p_user_id := 'user-uuid',
  p_badge_slug := 'critical_care_crusher',
  p_count_at_earn := 20
);
-- Returns: success, badge_name, points_awarded, already_earned

-- Or auto-check based on count
SELECT * FROM check_and_award_badges(
  p_user_id := 'user-uuid',
  p_requirement_type := 'clinical_entries',
  p_current_count := 20
);
-- Returns any newly awarded badges
```

### Getting User Gamification Summary

```sql
SELECT * FROM get_user_gamification_summary('user-uuid');
-- Returns: total_points, current_level, level_name, level_tooltip,
--          points_to_next_level, next_level_threshold, progress_to_next_level_percent,
--          total_badges_available, badges_earned,
--          all_time_rank, monthly_rank, monthly_points
```

### Gamification Migrations

| Migration | Purpose |
|-----------|---------|
| `20251210090000` | Point actions, promos, user_points, user_point_log |
| `20251214600000` | Badges table, user_badges, award_badge function |
| `20251214700000` | Level thresholds, leaderboards, auto-level trigger |

### Integration Pattern

When building features that should award points or check badges:

```javascript
// Example: ClinicalTracker after saving entry
const { awardPoints } = usePoints();
const { checkAndAwardBadge } = useBadgeCheck();

async function handleSubmit(entry) {
  // Save entry to database...
  const savedEntry = await saveEntry(entry);

  // Award points (hook handles daily caps)
  await awardPoints(POINT_ACTIONS.CLINICAL_LOG, null, {
    referenceId: savedEntry.id,
    referenceType: 'clinical_entry'
  });

  // Check for badge (hook handles already-earned check)
  const totalEntries = await getEntryCount();
  await checkAndAwardBadge('critical_care_crusher', {
    currentCount: totalEntries
  });
}
```

---

## 12. Priority 6: Marketplace

### Overview

SRNAs (providers) offer paid services to applicants:
- Mock interviews ($75-150)
- Essay/PS review ($50-100)
- Application coaching ($100-200)
- Shadow day hosting ($50-100)

### Provider Onboarding

1. SRNA applies with license info + student ID
2. Admin verifies (Nursys API for RN license)
3. Stripe Connect Express account created
4. Cal.com account created
5. Provider builds profile + services

### Booking Flow

1. Applicant browses providers
2. Selects service + time slot (from Cal.com)
3. Fills intake form (service-specific)
4. Payment AUTHORIZED (not captured)
5. Provider has 48h to accept/decline
6. On accept: Payment captured, Cal.com event created
7. Session happens
8. 48h dispute window
9. Payout to provider (bi-weekly)

### Key Decisions

| Decision | Choice |
|----------|--------|
| Stripe account type | Connect Express |
| Platform fee | 20% (15% for founding mentors) |
| Payment timing | Authorize on request, capture on accept |
| Booking model | Request-based (not instant book for MVP) |
| Reviews | Double-blind (visible after both review OR 14 days) |
| Payouts | Bi-weekly |

### Documentation

Full marketplace docs: `/docs/project/marketplace/README.md`

---

## 13. Priority 7: Community (Custom Supabase Forums)

### Overview

Custom Supabase-based community forums (NOT BuddyBoss). Forums only - no Groups feature for MVP.

**Features:**
- Forums with subforums (admin-created)
- Topics and threaded replies
- Reactions (like, love, helpful)
- @mentions with validation
- In-app notifications (realtime)
- Admin moderation (reports queue, suspensions)

**Spam Prevention:**
- Paid membership is primary filter (only members can post)
- Honeypot fields (hidden form fields)
- Profanity filter (word list)
- Rate limiting (10 topics/day, 50 replies/day, 30s between posts)
- Auto-hide after 3 reports
- StopForumSpam API check on first post

### Database Tables

| Table | Purpose |
|-------|---------|
| `forums` | Forum containers (admin-created) |
| `topics` | User-created discussion topics |
| `replies` | Replies to topics (threaded) |
| `topic_reactions` | Likes/reactions on topics |
| `reply_reactions` | Likes/reactions on replies |
| `community_reports` | User reports for moderation |
| `user_blocks` | User-level blocking |
| `user_suspensions` | Admin bans/suspensions |
| `topic_subscriptions` | Notification subscriptions |
| `community_notifications` | In-app notifications |
| `profanity_words` | Admin-configurable word list |
| `user_post_rate` | Rate limiting tracking |
| `spam_check_cache` | StopForumSpam API cache |

### Key Files

| File | Purpose |
|------|---------|
| `src/hooks/useForums.js` | Forum CRUD (wire to Supabase) |
| `src/hooks/useTopics.js` | Topic CRUD (wire to Supabase) |
| `src/hooks/useReplies.js` | Reply CRUD (wire to Supabase) |
| `src/hooks/useReactions.js` | Reaction handling |
| `src/hooks/useAdminReports.js` | Admin reports queue |
| `src/hooks/useAdminSuspensions.js` | User suspension management |
| `src/hooks/useCommunityNotifications.js` | In-app notifications |
| `src/hooks/useRecentTopics.js` | Dashboard widget data |
| `src/hooks/useUserBlocks.js` | User blocking |
| `src/lib/profanityFilter.js` | Profanity word matching |
| `src/lib/spamCheck.js` | StopForumSpam API integration |
| `src/lib/mentionValidator.js` | @mention validation |
| `src/pages/applicant/ForumsPage.jsx` | Forums list |
| `src/pages/applicant/ForumTopicsPage.jsx` | Topics in forum |
| `src/pages/applicant/TopicDetailPage.jsx` | Topic with replies |
| `src/pages/admin/AdminCommunityReportsPage.jsx` | Moderation queue |
| `src/pages/admin/AdminSuspensionsPage.jsx` | User suspensions |
| `src/components/features/community/` | All forum components |
| `src/components/features/admin/ReportCard.jsx` | Report display |
| `src/components/features/admin/ReportActionSheet.jsx` | Moderation actions |
| `src/components/features/dashboard/CommunityActivityWidget.jsx` | Dashboard widget |

### Admin Routes

| Route | Page | Purpose |
|-------|------|---------|
| `/admin/community/reports` | AdminCommunityReportsPage | Reports queue with hide/warn/dismiss actions |
| `/admin/community/suspensions` | AdminSuspensionsPage | View/manage user suspensions |

### What's NOT Included (deferred)

- Groups feature (skipped for MVP)
- Private messaging between members (use marketplace messaging)
- Email notifications (add via Groundhogg later)
- Akismet integration (add if spam becomes issue)
- Member connections/friends

### Implementation Status

**Phase 6 - COMPLETE** ✅

All frontend components built with mock data. Tests passing:
- community-notifications.spec.cjs - 28 tests ✅
- admin-suspensions.spec.cjs - 24 tests ✅
- admin-community-reports.spec.cjs - 67 tests (some timing issues)

**Dev team tasks:**
1. Run community forum migrations (`20251214*.sql`)
2. Wire hooks to real Supabase tables
3. Configure RLS policies
4. Set up Supabase Realtime for notifications
5. Seed profanity words table (use `scripts/seed-profanity-words.cjs`)

---

## 14. User Reports & Crowdsourced Data

### Overview

Users can report incorrect program requirements and suggest program events. This crowdsourced data helps keep the school database accurate while rewarding engaged users with points.

### Report Types

| Type | Points | Daily Cap | Purpose |
|------|--------|-----------|---------|
| School Requirement Error | +5 | 5/day | Flag incorrect GPA, prereqs, deadlines, etc. |
| Program Event Suggestion | +10 | 5/day | Share info sessions, open houses, deadlines |

### User Flow

1. User clicks "Something not right?" on program/school requirements
2. Selects error categories (GPA, prerequisites, GRE, certification, shadowing, resume, personal statement, deadline, other)
3. Adds optional details
4. Points awarded **immediately** on submission
5. Report queued for admin review

### Anti-Abuse Protection

- **Daily caps**: Max 5 submissions per type per day (resets at midnight)
- **Max daily points**: 25 from errors + 50 from events = 75 pts/day
- **Cap storage**: localStorage with date-based reset
- **UI feedback**: Shows "X of 5 remaining today" in form

### Admin Queue

Route: `/admin/user-reports`

Admins can:
- Filter by status (Pending/Approved/Dismissed/All)
- Filter by type (School Errors/Event Suggestions)
- Approve reports (verifies data quality)
- Dismiss reports (spam, duplicates, incorrect)

**Note**: Points are awarded immediately on submission, not on approval. Admin approval is for data quality verification, not point gating.

### Database

Migration: `supabase/migrations/20251214400000_user_reports.sql`

```sql
-- Key tables
user_reports (
  id, type, status, user_id, program_id, school_name,
  error_categories[], event_title, event_date, details,
  points_value, points_awarded, submitted_at, reviewed_at, reviewed_by
)

-- Functions
approve_user_report(report_id, admin_notes) -- Sets status, awards points
dismiss_user_report(report_id, dismiss_reason) -- Sets status
```

### Key Files

| File | Purpose |
|------|---------|
| `src/components/features/programs/ReportRequirementError.jsx` | Flag button + dialog form |
| `src/pages/admin/AdminUserReportsPage.jsx` | Admin reports queue |
| `src/hooks/usePoints.js` | Points awarding + daily cap tracking |
| `src/components/features/programs/ProgramSidebar.jsx` | Event sharing with points |
| `src/components/features/programs/ProgramDetailHeader.jsx` | Report button in requirements |
| `src/components/features/schools/SchoolRequirements.jsx` | Report button on school page |

### Integration Points

**usePoints hook exports:**
```javascript
import { usePoints, POINT_ACTIONS } from '@/hooks/usePoints';

const {
  points,           // Current total
  awardPoints,      // Award points (respects daily cap)
  checkDailyCap,    // Check remaining submissions
  // ...
} = usePoints();

// Check cap before showing form
const { canSubmit, remaining, cap } = checkDailyCap(POINT_ACTIONS.REPORT_SCHOOL_ERROR);
// => { canSubmit: true, remaining: 4, cap: 5 }
```

**TODO for dev team:**
1. ~~Wire `usePoints` to Supabase~~ ✅ DONE - see Section 11 for usage
2. Wire report submission to `user_reports` table
3. Daily cap tracking uses localStorage (with Supabase fallback for production)

---

# SECTION E: IMPLEMENTATION GUIDE

## 15. Wiring Up Hooks

### Current Pattern (Mock Data)

```javascript
export function usePrograms() {
  const [programs, setPrograms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with API call
    setTimeout(() => {
      setPrograms(mockPrograms);
      setIsLoading(false);
    }, 500);
  }, []);

  return { programs, isLoading };
}
```

### After Pattern (Real API)

```javascript
import { supabase } from '@/lib/supabase';

export function usePrograms() {
  const [programs, setPrograms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPrograms() {
      try {
        const { data, error } = await supabase
          .from('user_saved_schools')
          .select(`
            *,
            school:schools(*)
          `)
          .eq('user_id', userId);

        if (error) throw error;
        setPrograms(data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPrograms();
  }, [userId]);

  return { programs, isLoading, error };
}
```

### Finding TODOs

```bash
# Find all integration points
grep -r "TODO: Replace with API" src/

# Find all TODOs in hooks
grep -r "TODO" src/hooks/
```

---

## 15.5 Hooks Status & Dev Team TODOs

### ✅ Supabase-Connected Hooks (Ready for Production)

These hooks have full Supabase integration with localStorage fallback for development:

| Hook | Tables/Functions Used | Notes |
|------|----------------------|-------|
| `usePoints` | `user_points`, `user_point_log`, `award_points()` RPC | Falls back to localStorage in dev mode |
| `useBadges` | `badges`, `user_badges`, `award_badge()` RPC | Falls back to localStorage in dev mode |
| `usePointsConfig` | `point_actions`, `point_promos` | Admin config |
| `useSchools` | `schools`, `school_events` | Read-only |
| `useModules` | `modules`, `sections` | LMS admin |
| `useLessons` | `lessons`, `user_lesson_progress` | LMS content |
| `useDownloads` | `downloads` | LMS resources |
| `useAdminForums` | `forums`, `forums_with_school_info` VIEW | Admin forum management, mock fallback |
| `useAdminTopics` | `topics`, `forums`, `user_profiles` | Admin topic moderation, mock fallback |
| `useAdminReports` | `community_reports`, `topics`, `replies` | Report queue management, mock fallback |
| `useAdminSuspensions` | `user_suspensions`, `user_profiles` | User suspension CRUD, mock fallback |
| `useProfanityWords` | `profanity_words` | Community word filter, mock fallback |
| `useAdminCourseSubmissions` | `prerequisite_courses` | Course submission review, mock fallback |

### ⚠️ Mock Mode Behavior

Hooks use this pattern to determine mock vs production mode:

```javascript
const USE_MOCK_MODE = !isSupabaseConfigured();
```

This means:
- **When Supabase is configured** (env vars set): Uses real Supabase in both dev and production
- **When Supabase is not configured**: Falls back to localStorage/mock data

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env.local` to use Supabase.

### 🔧 Hooks Needing Supabase Wiring (Dev Team TODO)

**Priority 0 - Prompt State (Tracker Nudges):**

The `usePromptState` hook manages tracker nudge dismissals (clinical catch-up, EQ reflection, shadow reminder, etc.). Currently uses localStorage only - needs Supabase sync when auth is ready.

| Hook | Supabase Table | Status |
|------|----------------|--------|
| `usePromptState` | `user_guidance_state.prompt_state` (JSONB) | localStorage working, needs Supabase sync |

**Implementation steps:**
1. Supabase column already deployed: `user_guidance_state.prompt_state` (migration `20251214500000`)
2. When auth is available, sync localStorage → Supabase on login
3. Merge strategy: Use higher dismissCount, prefer permanentlyDismissed=true
4. See detailed TODO in `src/hooks/usePromptState.js` header comment

**Trackers already wired:**
- `ClinicalTracker.jsx` - Uses `clinical_catchup` nudge ID (triggers: 4+ days since last log, 3-day snooze)
- `EQTracker.jsx` - Uses `eq_reflection` nudge ID (triggers: 7+ days since last reflection, 3-day snooze)
- `ShadowDaysTracker.jsx` - Uses `shadow_reminder` nudge ID (triggers: 30+ days AND hours < goal, 7-day snooze)
- `EventsTracker.jsx` - Uses `events_log` nudge ID (triggers: past events waiting to be logged, 3-day snooze)

**Dismissal timing:**
- X button: 24 hours (all trackers)
- Snooze: 3 days for Clinical/EQ/Events, 7 days for Shadow Days
- Permanent: After 5 X-button clicks

No changes needed to tracker components - just update the hook to sync with Supabase.

**Priority 1 - Core User Data:**
| Hook | Supabase Tables | Status |
|------|-----------------|--------|
| `useAuth` | `auth.users` | ✅ DONE: Supabase Auth integrated with mock fallback |
| `useUser` | `user_profiles`, `user_academic_profiles`, `user_clinical_profiles` | TODO: Wire to profile tables |
| `usePrograms` | `user_saved_schools`, `target_program_checklists` | TODO: Wire to Supabase |
| `useGuidanceState` | `user_guidance_state` | TODO: Wire to Supabase |

**⚠️ IMPORTANT: Consolidate useSchools and usePrograms**

Currently `useSchools` and `usePrograms` both manage saved/target school state independently:
- `useSchools`: Used on School Database page, stores savedSchoolIds/targetSchoolIds in localStorage
- `usePrograms`: Used on My Programs page, has Supabase integration for authenticated users

**Problem:** They use the same localStorage keys but don't share state properly. Changes made via `useSchools` (e.g., saving a school from the database) won't sync to `usePrograms` without a page refresh.

**Solution:** Refactor `useSchools` to delegate save/target operations to `usePrograms`:
1. `useSchools` should only handle filtering, sorting, and display of schools
2. Save/target operations should call into `usePrograms` methods
3. This ensures one source of truth: Supabase for authenticated users, localStorage for unauthenticated

**Quick fix applied:** Added same-tab event sync to `usePersistentState` hook so localStorage changes propagate between hook instances. This works but is a band-aid - the proper fix is consolidation.

**Priority 2 - Trackers:**
| Hook | Supabase Tables | Status |
|------|-----------------|--------|
| `useTrackers` | `clinical_entries`, `shadow_days`, `eq_reflections`, `user_events` | TODO: Wire CRUD operations |

**Priority 3 - Marketplace:**
| Hook | Supabase Tables | Status |
|------|-----------------|--------|
| `useProviders` | `provider_profiles`, `services` | TODO: Wire to Supabase |
| `useBookings` | `bookings`, `booking_cal_com_mapping` | TODO: Wire + Cal.com integration |
| `useServices` | `services` | TODO: Wire to Supabase |
| `useConversations` | `conversations`, `messages` | TODO: Wire + Realtime |
| `useMessages` | `messages` | TODO: Wire + Realtime |
| `useNotifications` | `notifications` | TODO: Wire + Realtime |
| `useReviews` | `booking_reviews` | TODO: Wire to Supabase |

**Priority 4 - Community Forums:**
| Hook | Supabase Tables | Status |
|------|-----------------|--------|
| `useRecentTopics` | `topics`, `replies` | TODO: Wire to Supabase |
| `useAdminForums` | `forums`, `forums_with_school_info` VIEW | ✅ Supabase-connected (with mock fallback) |
| `useAdminTopics` | `topics`, `forums`, `user_profiles` | ✅ Supabase-connected (with mock fallback) |
| `useAdminReports` | `community_reports`, `topics`, `replies` | ✅ Supabase-connected (with mock fallback) |
| `useAdminSuspensions` | `user_suspensions`, `user_profiles` | ✅ Supabase-connected (with mock fallback) |
| `useProfanityWords` | `profanity_words` | ✅ Supabase-connected (with mock fallback) |
| `useAdminCourseSubmissions` | `prerequisite_courses` | ✅ Supabase-connected (with mock fallback) |
| `useUserBlocks` | `user_blocks` | TODO: Wire to Supabase |
| `useArchivedForums` | `forums` | TODO: Wire to Supabase |

**Priority 5 - Groups (Deferred for MVP):**
| Hook | Notes |
|------|-------|
| `useGroups` | Groups feature deferred - low priority |
| `useGroupMembers` | Groups feature deferred |
| `useGroupActivity` | Groups feature deferred |

### 🎮 Gamification Integration Checklist

After wiring tracker hooks, add point awarding:

```javascript
// Example: In ClinicalTracker handleSubmit
import { usePoints, POINT_ACTIONS } from '@/hooks/usePoints';
import { useBadgeCheck } from '@/hooks/useBadges';

const { awardPoints } = usePoints();
const { checkBadge } = useBadgeCheck('clinical_entries');

async function handleSubmit(entry) {
  const saved = await saveEntry(entry);

  // Award points
  await awardPoints(POINT_ACTIONS.CLINICAL_LOG, null, {
    referenceId: saved.id,
    referenceType: 'clinical_entry'
  });

  // Check for badge
  const count = await getClinicalEntryCount();
  await checkBadge(count);
}
```

**Trackers to update:**
- [x] `ClinicalTracker` → `POINT_ACTIONS.CLINICAL_LOG` + `critical_care_crusher` badge ✅
- [ ] `ShadowDaysTracker` → `POINT_ACTIONS.SHADOW_LOG` + `shadow_seeker` badge
- [ ] `EQTracker` → `POINT_ACTIONS.EQ_LOG` + `eq_master` badge
- [ ] `EventsTracker` → `POINT_ACTIONS.EVENT_LOG`
- [ ] `LessonPage` → `POINT_ACTIONS.LESSON_COMPLETE` + `lesson_legend` badge
- [ ] Program save → `POINT_ACTIONS.PROGRAM_SAVE` + `target_trailblazer` badge
- [ ] Task complete → `POINT_ACTIONS.TASK_COMPLETE`
- [ ] Milestone complete → `POINT_ACTIONS.MILESTONE_COMPLETE` + `milestone_machine` badge
- [ ] Forum post → `POINT_ACTIONS.FORUM_POST` + `top_contributor` badge
- [ ] Forum reply → `POINT_ACTIONS.FORUM_REPLY` + `top_contributor` badge

---

## 16. Testing

### Playwright E2E Tests

900+ tests across 45 test files:

```bash
# Run all tests
npx playwright test

# Run specific test file
npx playwright test tests/marketplace.spec.cjs

# Run with UI
npx playwright test --ui

# Show report
npx playwright show-report
```

### Vitest Unit Tests

```bash
# Watch mode
npm run test

# Single run (CI)
npm run test:run
```

### Test Files Location

```
tests/
├── admin-*.spec.cjs          # Admin panel tests
├── admin-community-reports.spec.cjs  # Community reports moderation
├── admin-suspensions.spec.cjs        # User suspension management
├── booking-*.spec.cjs        # Marketplace booking tests
├── community-notifications.spec.cjs  # Community notifications
├── dashboard.spec.cjs        # Dashboard tests
├── marketplace-*.spec.cjs    # Marketplace tests
├── onboarding.spec.cjs       # Onboarding tests
├── provider-*.spec.cjs       # Provider tests
├── ...
```

---

## 17. Deployment

### Vercel (Frontend)

1. Push to main branch
2. Vercel auto-deploys
3. Set environment variables in Vercel project settings

### Supabase (Backend)

```bash
# Push migrations to remote
npx supabase db push

# Or connect and run manually
npx supabase db remote set
```

---

# SECTION F: CHECKLISTS & REFERENCE

## 18. Suggested First 2 Weeks

### Week 1: Foundation

**Day 1-2: Environment Setup**
- [ ] Clone repo, run `npm install`, verify `npm run dev` works
- [ ] Read DEV-TEAM-START-HERE.md and this document
- [ ] Set up Supabase project (or get access to existing)
- [ ] Run all 16 migrations in order
- [ ] Set up environment variables

**Day 3-4: Authentication**
- [ ] Implement Supabase Auth (login, register, logout)
- [ ] Test auth flow end-to-end
- [ ] Configure RLS policies for all tables
- [ ] Verify auto-profile creation trigger works

**Day 5: Core API Wiring**
- [ ] Wire up `useUser` hook to real profile
- [ ] Wire up `useSchools` hook to schools table
- [ ] Test data flows correctly

### Week 2: Features & Testing

**Day 6-7: Trackers & Programs**
- [ ] Wire up `usePrograms` (saved/target programs)
- [ ] Wire up tracker hooks (clinical, shadow, EQ, events)
- [ ] Test CRUD operations

**Day 8-9: LMS & Marketplace**
- [ ] Test LMS admin without mock mode
- [ ] Set up Supabase Storage buckets
- [ ] Wire up marketplace hooks
- [ ] Test Stripe Connect flow (if ready)

**Day 10: QA & Polish**
- [ ] Run Playwright test suite
- [ ] Test on mobile devices
- [ ] Fix critical bugs
- [ ] Document issues

---

## 19. Pre-Launch Checklist

### Core Functionality
- [ ] All TODO comments resolved
- [ ] Authentication working end-to-end
- [ ] All API endpoints returning real data
- [ ] Error handling implemented
- [ ] Loading states work correctly
- [ ] Empty states work with real data

### Database
- [ ] Run ALL 27 migrations in order
- [ ] Import schools data (140+ programs)
- [ ] Import prerequisite courses
- [ ] Configure admin custom claims
- [ ] Verify auto-profile creation trigger

### Storage
- [ ] Set up `lesson-images` bucket
- [ ] Set up `welcome-videos` bucket
- [ ] Configure bucket policies for authenticated uploads

### Testing
- [ ] Playwright tests passing
- [ ] Mobile tested on real devices
- [ ] Performance acceptable (<3s initial load)

### Integrations
- [ ] Stripe Connect configured
- [ ] Cal.com API configured
- [ ] Community forum migrations applied (4 migration files)
- [ ] Seed profanity words (`scripts/seed-profanity-words.cjs`)
- [ ] Test WordPress user migration

---

## 20. Known Issues

See `/docs/project/issues.md` for current bugs.

**Open TODOs:**
- `ProgramTasksTab.jsx` - Task checkbox toggle needs real state management (ISS-006)

### ISS-011: Auth Trigger Error Handling (High Priority)

The `handle_new_user()` trigger that creates `user_profiles` on signup was failing and blocking signups. We added error handling so signup succeeds even if profile creation fails:

```sql
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'handle_new_user failed: %', SQLERRM;
  RETURN NEW;
```

**Impact:**
- Users can sign up, but their `user_profiles` record may not exist
- App needs to handle missing profiles gracefully

**Action Required:**
1. Check Supabase logs for `handle_new_user failed:` warnings
2. Debug why the original insert was failing (likely RLS or constraint issue)
3. Fix the root cause so profiles are created reliably
4. Add app-side fallback to create profile on first login if missing

### ISS-009: Duplicate School IDs in WordPress Data

The original WordPress schools data contained 4 schools with duplicate IDs. These were different schools that mistakenly shared the same WordPress post ID:

| Original ID | School 1 | School 2 | New ID Assigned |
|-------------|----------|----------|-----------------|
| 3817 | Rosalind Franklin (Illinois) | Rosalind Franklin - Colorado Branch | 2527836 |
| 3865 | Cleveland Clinic Foundation / Case Western | Frances Payne Bolton / Case Western | 2527837 |
| 3870 | OHSU (Fresno, CA campus) | OHSU (Portland, OR - main campus) | 2527838 |
| 3878 | Geisinger Health / Bloomsburg U | U of Pennsylvania | 2527839 |

**Resolution:** Assigned new unique IDs (2527836-2527839) to the duplicate entries and seeded all 150 schools into Supabase.

**Action Required:**
- Fix duplicate IDs in WordPress (source of truth)
- Re-export schools data after WordPress fix
- Update static `schools.js` if still needed for fallback

---

## 21. Mock Data Locations

```
src/data/
├── mockUser.js              # User profile, subscription
├── mockPrograms.js          # Saved/target programs
├── mockSchools.js           # School database
├── mockTrackers.js          # Clinical, EQ, Shadow, Events
├── mockPrerequisites.js     # Prerequisite courses
├── mockCommunity.js         # Forums, groups, messages
├── mockEvents.js            # Platform events
├── mockGamification.js      # Points, badges, levels
├── community/
│   ├── mockNotifications.js # Community notifications
│   ├── mockReports.js       # Admin reports queue
│   └── mockSuspensions.js   # User suspensions
└── marketplace/
    ├── index.js             # Central export
    ├── mockProviders.js     # Provider profiles
    ├── mockServices.js      # Service offerings
    ├── mockBookings.js      # Booking records
    ├── mockReviews.js       # Reviews
    ├── mockConversations.js # Pre-booking inquiries
    └── mockAdminMessages.js # Admin messaging
```

---

## 22. Key Documentation Links

| Document | Purpose |
|----------|---------|
| [DEV-TEAM-START-HERE.md](/DEV-TEAM-START-HERE.md) | Quick start guide |
| [CLAUDE.md](/CLAUDE.md) | AI session context |
| [step-by-step-guide.md](step-by-step-guide.md) | Task breakdown by phase |
| [billing-migration-plan.md](billing-migration-plan.md) | Subscription migration |
| [woocommerce-supabase-integration.md](woocommerce-supabase-integration.md) | Product purchase sync |
| [marketplace/README.md](marketplace/README.md) | Marketplace architecture |
| [issues.md](issues.md) | Known bugs |

### Skill Files

| Building... | Read This |
|-------------|-----------|
| Components | `/docs/skills/component-library.md` |
| Page layout | `/docs/skills/design-system.md` |
| API shapes | `/docs/skills/api-contracts.md` |
| WordPress | `/docs/skills/wordpress-integration.md` |
| Gamification | `/docs/skills/gamification-system.md` |
| Access control | `/docs/skills/access-control.md` |
| ReadyScore | `/docs/skills/readyscore-system.md` |
| Community Forums | `/docs/project/step-by-step-guide.md` (Phase 6) |

---

## 23. Prerequisite Library Data Model

### Data Cleanup (Dec 13, 2024)

Removed aspirational fields that we don't/won't collect:
- `acceptedByPrograms` - Removed from course objects
- `popularWithApplicantsTo` - Removed from course objects
- Related helper functions removed: `getCoursesForTargetPrograms`, `getHighYieldCourses`, `getPopularCoursesForProgram`

### User-Contributed Data Collection

Added `programsRequiring` field to both WriteReviewModal and SubmitCourseModal:
- Users select which CRNA programs on their list require the course they're reviewing/submitting
- Label: "Which CRNA programs on your list require this course?"
- This crowdsourced data will power future features like "Applicants to [School X] took these courses"

### Personalized "Suggested for You"

SmartCourseSuggestions now provides personalized recommendations:
1. **For Your Programs** (purple) - Courses in subjects the user still needs based on:
   - User's target/saved programs and their prerequisite requirements (from schools table)
   - User's completed prerequisites (from user_academic_profiles)
   - Gap analysis: required subjects minus completed subjects
2. **Top Rated** (yellow) - Highest averageRecommend score
3. **Most Reviewed** (green) - Fallback when no personalization data available

Key files:
- `src/components/features/prerequisites/SmartCourseSuggestions.jsx` - Personalization logic
- `src/components/features/prerequisites/WriteReviewModal.jsx` - programsRequiring field
- `src/components/features/prerequisites/SubmitCourseModal.jsx` - programsRequiring field
- `src/data/mockPrerequisites.js` - Cleaned course data

---

## 24. Settings Page

### Profile Tab
Four fields saved to both `auth.users` metadata AND `user_profiles` table:
- **Profile Picture** - Avatar image uploaded to Supabase Storage (`avatars/` folder)
- **First Name** - Used for internal personalization (dashboard greeting: "Hey Sarah!")
- **Last Name** - User's last name
- **Display Name** - Public name shown in header, forums, comments, and marketplace

**Name Display Logic:**
- **Header**: Shows `display_name` → falls back to `first_name` → `full_name` → `email`
- **Dashboard greeting**: Uses `first_name` for personal touch ("Hey Sarah!")
- **Forums/Marketplace**: Uses `display_name`

Password change form included (requires Supabase Auth integration).

### Subscription Tab
- Current plan display with status badge
- "Manage Billing" button → Stripe Customer Portal (TODO: integrate)
- Cancel subscription flow with confirmation
- Billing history with invoice links → Stripe invoice URLs (TODO: integrate)

### Privacy Tab
- Data export button (functional - downloads JSON of user data)
- Contact email for privacy questions

### Database Fields
Migration `20251221000000_settings_profile_fields.sql` adds to `user_profiles`:
```sql
first_name TEXT
last_name TEXT
display_name TEXT
avatar_url TEXT
```

### Key Files
- `src/pages/applicant/SettingsPage.tsx` - Main page with 3 tabs
- `src/components/features/settings/ProfileTab.tsx` - Profile form
- `src/components/features/settings/SubscriptionTab.tsx` - Subscription management
- `src/components/features/settings/PrivacyTab.tsx` - Data export
- `src/hooks/useAuth.jsx` - `updateProfile()` syncs to both auth metadata AND user_profiles table

### Integration Notes
1. **Profile Save**: `updateProfile()` in useAuth.jsx handles dual storage:
   - `supabase.auth.updateUser({ data: {...} })` for auth metadata
   - `supabase.from('user_profiles').upsert({...})` for user_profiles table
2. **Avatar Upload**: Uses `useImageUpload` hook to upload to Supabase Storage `avatars/` folder
3. **Role Flash Fix**: Header only shows role label after enrichment completes (prevents "SRNA Applicant" → "Admin" flash)
4. **Stripe Customer Portal**: Wire up "Manage Billing" button to redirect to Stripe portal
5. **Stripe Invoices**: Billing history links should open Stripe invoice URLs
6. **Password Change**: Currently has TODO - use `supabase.auth.updateUser({ password })`
