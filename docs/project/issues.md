# Issues Log

Track bugs, problems, and issues found during development.

---

## How to Use

When an issue is found:
1. Add it below with today's date
2. Categorize by severity
3. Note where it was found
4. Update status as it's resolved

---

## Severity Levels

- **🔴 Critical:** Broken functionality, blocking users
- **🟠 High:** Significant UX issue, should fix before launch
- **🟡 Medium:** Minor UX issue, fix if time allows
- **🟢 Low:** Cosmetic, nice to have

---

## 🎨 UI Changes In Progress (Dec 14, 2024)

Track things broken during the design system update sprint. Fix these before merging!

| # | Component/File | What Changed | What Might Break | Status |
|---|----------------|--------------|------------------|--------|
| 1 | `src/components/ui/button.jsx` | Design system update | Button variants, sizes, colors throughout app | ⬜ |
| 2 | `src/components/ui/card.jsx` | Design system update | Card styling, padding, borders everywhere | ⬜ |
| 3 | `src/components/ui/input.jsx` | Design system update | Form inputs styling across all forms | ⬜ |
| 4 | `src/components/ui/badge.jsx` | Design system update | Status badges, tags throughout app | ⬜ |
| 5 | `src/components/ui/tabs.jsx` | Design system update | Tab navigation (Trackers, Programs, etc.) | ⬜ |
| 6 | `src/components/ui/dialog.jsx` | Design system update | All modals/dialogs in the app | ⬜ |
| 7 | `src/components/ui/sheet.jsx` | Design system update | Side panels/drawers | ⬜ |
| 8 | `src/components/ui/select.jsx` | Design system update | Dropdown selects in forms | ⬜ |
| 9 | `src/components/ui/checkbox.jsx` | Design system update | Checkboxes (checklists, forms) | ⬜ |
| 10 | `src/components/ui/switch.jsx` | Design system update | Toggle switches | ⬜ |
| 11 | `src/components/ui/radio-group.jsx` | Design system update | Radio buttons in forms | ⬜ |
| 12 | `src/components/ui/progress.jsx` | Design system update | Progress bars (trackers, checklists) | ⬜ |
| 13 | `src/components/ui/toggle.jsx` | Design system update | Toggle buttons | ⬜ |
| 14 | `src/components/ui/tag-select.jsx` | Design system update | Multi-select tags | ⬜ |
| 15 | `src/index.css` | CSS variables, colors | Global styling, theme colors | ⬜ |
| 16 | `src/components/layout/sidebar.jsx` | Layout changes | Navigation, mobile menu | ⬜ |
| 17 | `src/components/layout/header.jsx` | Layout changes | Top header, search, notifications | ⬜ |
| 18 | `src/components/layout/page-wrapper.jsx` | Layout changes | Page container, spacing | ⬜ |
| 19 | Dashboard widgets | Multiple dashboard components | ToDoList, Calendar, Onboarding, etc. | ⬜ |
| 20 | Tracker components | Clinical, Shadow, EQ, Events | Form layouts, cards, data display | ⬜ |
| 21 | Program components | My Programs page components | Checklist, LOR, Documents tabs | ⬜ |
| 22 | School components | SchoolCard, Filters, Requirements | Search/filter UI, school cards | ⬜ |
| 23 | Marketplace components | RecommendedMentors widget | Mentor cards, booking UI | ⬜ |
| 24 | Guidance components | NextBestSteps card | Step items, styling | ⬜ |

**Status Legend:** ⬜ Needs Fix | 🔄 In Progress | ✅ Fixed | ⏭️ Deferred

---

## Open Issues

### 🔴 Critical

_No critical issues_

---

### 🟠 High

#### ISS-011: Auth trigger silently catches errors - profile creation may fail

**Severity:** 🟠 High
**Found:** 2024-12-14
**Location:** Supabase `handle_new_user()` trigger function

**Description:**
The `on_auth_user_created` trigger that creates `user_profiles` and `user_guidance_state` records on signup was blocking signups due to an unknown constraint/RLS issue. We added error handling so signup succeeds even if profile creation fails:

```sql
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'handle_new_user failed: %', SQLERRM;
  RETURN NEW;
```

**Problem:**
- Users can now sign up, but their `user_profiles` record may not exist
- Errors are logged as PostgreSQL warnings (check Supabase logs)
- App needs to handle missing profiles gracefully

**Action Required:**
1. Check Supabase logs for `handle_new_user failed:` warnings
2. Debug why the original insert was failing (likely RLS or constraint issue)
3. Fix the root cause so profiles are created reliably
4. Add app-side fallback to create profile on first login if missing

---

### 🟡 Medium

#### ISS-009: Duplicate School IDs in WordPress Data

**Severity:** 🟡 Medium
**Found:** 2024-12-14
**Location:** Schools data (WordPress export)

**Description:**
The original WordPress schools data contained 4 schools with duplicate IDs. These were different schools that mistakenly shared the same WordPress post ID:

| Original ID | School 1 | School 2 | New ID Assigned |
|-------------|----------|----------|-----------------|
| 3817 | Rosalind Franklin (Illinois) | Rosalind Franklin - Colorado Branch | 2527836 |
| 3865 | Cleveland Clinic Foundation / Case Western | Frances Payne Bolton / Case Western | 2527837 |
| 3870 | OHSU (Fresno, CA campus) | OHSU (Portland, OR - main campus) | 2527838 |
| 3878 | Geisinger Health / Bloomsburg U | U of Pennsylvania | 2527839 |

**Resolution:**
Assigned new unique IDs (2527836-2527839) to the duplicate entries and seeded all 150 schools into Supabase. The static `schools.js` file still contains the original duplicates - this should be fixed in WordPress to assign proper unique IDs.

**Action Required:**
- Fix duplicate IDs in WordPress (source of truth)
- Re-export schools data after WordPress fix
- Update static `schools.js` if still needed for fallback

---

#### ISS-006: ProgramTasksTab checkbox toggle and action buttons are non-functional

**Severity:** 🟡 Medium
**Found:** 2024-12-09
**Location:** `src/components/features/programs/ProgramTasksTab.jsx:173-176, 210-225`

**Description:**
The task checkbox toggle and action buttons (edit/delete) only log to console with TODO comments. They don't actually update task state.

**Notes:**
This is expected incomplete functionality (marked with TODOs), but should be addressed before production.

---

### 🟢 Low

_No low priority issues_

---

## Resolved Issues

| ID | Issue | Severity | Found | Resolved | Resolution |
|----|-------|----------|-------|----------|------------|
| ISS-002 | EmptyState icon prop API mismatch | 🔴 Critical | 2024-12-09 | 2024-12-09 | Updated EmptyState to accept both component refs and JSX elements |
| ISS-003 | EmptyState action prop API mismatch | 🔴 Critical | 2024-12-09 | 2024-12-09 | Updated EmptyState to accept action as JSX, object, or actionLabel/onAction |
| ISS-004 | Dashboard "Complete Profile" wrong route | 🟠 High | 2024-12-09 | 2024-12-09 | Changed `/stats` to `/my-stats` in DashboardPage.jsx |
| ISS-005 | Large bundle size (1.6MB+ JS) | 🟡 Medium | 2024-12-09 | 2024-12-09 | Implemented code-splitting with React.lazy - main bundle reduced from 1,649KB to 357KB (78% reduction) |
| ISS-007 | window.confirm for delete confirmations | 🟡 Medium | 2024-12-09 | 2024-12-09 | Created ConfirmDialog component, updated EQTracker, ShadowDaysTracker, ClinicalTracker |
| ISS-008 | TaskRow missing group class for hover | 🟢 Low | 2024-12-09 | 2024-12-09 | Added `group` class to TaskRow div in ToDoListWidget.jsx |
| ISS-010 | MilestoneDetail modal navigation arrows not working | 🟠 High | 2024-12-14 | 2024-12-14 | Fixed by rendering arrows via createPortal directly to document.body with z-[9999], added onMouseDown stopPropagation |

---

## Issue Template

When adding an issue:

```markdown
### [ID]: [Brief Description]

**Severity:** 🔴/🟠/🟡/🟢
**Found:** [Date]
**Location:** [Page/Component]
**Browser/Device:** [If relevant]

**Description:**
[Detailed description of the issue]

**Steps to Reproduce:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Screenshots:**
[If applicable]

**Notes:**
[Any additional context]
```

---

## Example Issue

### ISS-001: Button text truncates on mobile

**Severity:** 🟡 Medium
**Found:** 2024-11-28
**Location:** MyProgramsPage, "Make Target" button
**Browser/Device:** iPhone 12 (375px)

**Description:**
The "Make Target" button text gets truncated on narrow mobile screens.

**Steps to Reproduce:**
1. Open My Programs page on 375px viewport
2. View a saved program card
3. Look at the "Make Target" button

**Expected Behavior:**
Button text should be fully visible or wrapped appropriately.

**Actual Behavior:**
Text shows as "Make Tar..." with ellipsis.

**Resolution:**
Use shorter text "Target" on mobile or allow wrapping.
