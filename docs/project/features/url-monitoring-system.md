# URL Monitoring & Data Freshness System

> **Status:** Planning
> **Related to:** School Database, Events, Data Accuracy

---

## Overview

Monitor CRNA program pages and AANA state pages for changes. When changes are detected, admins are notified to review and update relevant data (events, deadlines, prerequisites, tuition, etc.).

**Key insight:** One monitor per program page catches all types of updates, not just events.

---

## What This Monitors

### 1. CRNA Program Pages (~140)
- Already have program-specific URLs stored in `schools` table
- Changes could indicate: new events, deadline updates, prereq changes, tuition updates, faculty changes

### 2. AANA State Meeting Pages (~50)
- State association pages listing upcoming meetings
- Changes typically indicate new events

---

## Recommended Approach

### Third-Party Monitoring (Visualping, Distill.io, etc.)

| Service | Pros | Cost |
|---------|------|------|
| **Visualping** | Easy setup, webhooks, visual diffs | ~$40/mo for 200 pages |
| **Distill.io** | Element-specific monitoring | Similar |
| **ChangeTower** | Bulk monitoring | ~$30/mo |

**Flow:**
1. Add program URLs to monitoring service
2. Service checks pages daily
3. Change detected → webhook to Supabase Edge Function
4. Edge Function sets `needs_review = true` on school record
5. Admin sees flagged schools in dashboard
6. Admin reviews, updates data, marks as reviewed

---

## Schema Changes

### Add to `schools` table:

| Column | Type | Default | Description |
|--------|------|---------|-------------|
| `program_page_url` | text | - | Already exists - CRNA program specific page |
| `last_change_detected_at` | timestamptz | null | When monitoring service flagged a change |
| `last_reviewed_at` | timestamptz | null | When admin last audited this school |
| `needs_review` | boolean | false | Flag for admin dashboard |
| `monitoring_enabled` | boolean | true | Can disable for problematic pages |

### New table: `monitored_urls`

For AANA state pages and any non-school URLs:

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `url` | text | Page URL to monitor |
| `type` | text | `aana_state`, `other` |
| `state` | text | State code (for AANA pages) |
| `label` | text | Display name ("AANA Michigan") |
| `last_change_detected_at` | timestamptz | When change flagged |
| `last_reviewed_at` | timestamptz | When admin reviewed |
| `needs_review` | boolean | Flag for dashboard |
| `monitoring_enabled` | boolean | Active/inactive |
| `created_at` | timestamptz | Record created |

### New table: `url_change_log`

Audit trail of detected changes:

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `source_type` | text | `school`, `aana_state`, `other` |
| `source_id` | uuid | FK to school or monitored_url |
| `detected_at` | timestamptz | When change detected |
| `reviewed_at` | timestamptz | When admin reviewed |
| `reviewed_by` | uuid | Admin user ID |
| `changes_made` | text | Notes on what was updated |
| `false_positive` | boolean | No actual relevant change |

---

## Admin Dashboard Features

### "Needs Review" Queue

```
┌─────────────────────────────────────────────────────────┐
│ Schools Needing Review (12)                             │
├─────────────────────────────────────────────────────────┤
│ 🔴 Duke University - changed 2 days ago                 │
│ 🔴 Johns Hopkins - changed 3 days ago                   │
│ 🟡 UCLA - changed 1 week ago                            │
│ ...                                                     │
└─────────────────────────────────────────────────────────┘
```

### Review Screen

When admin clicks a school:
- Show embedded iframe or link to program page
- Quick links to common subpages (Events, Admissions, Prerequisites)
- Form to update fields that changed
- "Mark Reviewed" button with optional notes
- "False Positive" button if no real changes

---

## What Changes Get Caught

| Change Type | Admin Action |
|-------------|--------------|
| New open house/info session | Add to `events` table |
| Application deadline update | Update `schools.application_deadline` |
| Prerequisites changed | Update `schools.prerequisites` |
| Tuition/fees changed | Update `schools.tuition`, `schools.fees` |
| Class size changed | Update `schools.class_size` |
| Faculty updates | Update `schools.faculty` |
| AANA state meeting added | Add to `events` table |
| No relevant change | Mark as false positive |

---

## Implementation Phases

### Phase 1: Manual Foundation
- Add `needs_review`, `last_reviewed_at` columns to schools
- Build admin "Needs Review" queue UI
- Manually flag schools for review (no automation yet)

### Phase 2: Monitoring Integration
- Set up Visualping account with school URLs
- Create Supabase Edge Function webhook endpoint
- Auto-flag schools when changes detected

### Phase 3: AANA State Pages
- Add `monitored_urls` table
- Add ~50 AANA state pages to monitoring
- Same webhook flow

### Phase 4: Analytics & Optimization
- Track false positive rates by school
- Identify schools that change frequently vs rarely
- Adjust monitoring frequency accordingly
- Track data freshness metrics

---

## Cost Estimate

| Item | Monthly Cost |
|------|--------------|
| Visualping (~200 pages, daily checks) | ~$40 |
| Supabase Edge Functions | Included in plan |
| **Total** | **~$40/mo** |

---

## Alternative: User-Powered Monitoring

Supplement automated monitoring with user submissions:

- "Report Outdated Info" button on school pages
- "Submit Event Tip" for discovered open houses
- Points awarded for valid submissions
- Reduces reliance on paid monitoring

---

## Open Questions

1. How often should pages be checked? (Daily seems right)
2. Should we store page snapshots for comparison?
3. Priority order for initial 200 monitors - most saved schools first?
4. Who handles the review queue? (Admin only or delegate?)

---

## Related Docs

- `/docs/project/features/events-supabase-schema.md` - Events table schema
- `/docs/skills/b2b-school-analytics.md` - School data structure
