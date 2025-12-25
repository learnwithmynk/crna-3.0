# Events - Supabase Schema

> **Status:** Planning
> **Related to:** Events Page, School Profiles

---

## Overview

Database schema for events system including AANA meetings, CRNA Club events, and school events (open houses, info sessions).

---

## Table: `events`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | NO | `gen_random_uuid()` | Primary key |
| `title` | text | NO | - | Event title |
| `description` | text | YES | - | Event description |
| `date` | date | NO | - | Event date |
| `time` | time | YES | - | Event start time |
| `timezone` | text | YES | `'America/New_York'` | IANA timezone |
| `category` | text | NO | - | See categories below |
| `source` | text | NO | - | `aana`, `crna_club`, `school` |
| `image_url` | text | YES | - | Event banner/logo URL |
| `location` | text | YES | - | Location name or address |
| `is_virtual` | boolean | NO | `false` | Virtual event flag |
| `external_url` | text | YES | - | Link to external event page |
| `rsvp_url` | text | YES | - | Zoom/internal RSVP link (CRNA Club only) |
| `hosted_by` | text | YES | - | Host name/org |
| `school_id` | uuid | YES | - | FK to `schools.id` (school events only) |
| `state` | text | YES | - | US state code (e.g., `MI`, `TX`) |
| `points_value` | integer | YES | - | Points for attendance (CRNA Club events only) |
| `attendance_webhook_id` | text | YES | - | Zoom webhook ID (CRNA Club events only) |
| `is_published` | boolean | NO | `true` | Show/hide event |
| `created_at` | timestamptz | NO | `now()` | Record created |
| `updated_at` | timestamptz | NO | `now()` | Record updated |

### Event Categories

| Category | Source | Points Eligible |
|----------|--------|-----------------|
| `aana_state_meeting` | `aana` | No |
| `aana_national_meeting` | `aana` | No |
| `crna_club_event` | `crna_club` | Yes |
| `school_open_house` | `school` | No |
| `school_info_session` | `school` | No |

**Note:** `points_value` and `attendance_webhook_id` only apply to `crna_club_event` category. External events (AANA, schools) cannot track attendance.

---

## Table: `user_saved_events`

Bookmarks - users saving events for later.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | NO | `gen_random_uuid()` | Primary key |
| `user_id` | uuid | NO | - | FK to `auth.users.id` |
| `event_id` | uuid | NO | - | FK to `events.id` |
| `created_at` | timestamptz | NO | `now()` | When saved |

**Constraints:**
- Unique on `(user_id, event_id)`
- `event_id` FK has `ON DELETE CASCADE` - when event deleted, bookmark auto-deletes

**On unbookmark:** Hard delete the row (no soft delete).

---

## Table: `event_rsvps`

Attendance tracking for CRNA Club events only.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | NO | `gen_random_uuid()` | Primary key |
| `user_id` | uuid | NO | - | FK to `auth.users.id` |
| `event_id` | uuid | NO | - | FK to `events.id` |
| `status` | text | NO | `'registered'` | `registered`, `attended`, `no_show` |
| `points_awarded` | boolean | NO | `false` | Whether points were given |
| `registered_at` | timestamptz | NO | `now()` | When RSVP'd |
| `attended_at` | timestamptz | YES | - | When attendance confirmed via webhook |

---

## Indexes

| Table | Index Name | Columns | Purpose |
|-------|------------|---------|---------|
| `events` | `idx_events_date` | `date` | Filter by date |
| `events` | `idx_events_category` | `category` | Filter by category |
| `events` | `idx_events_state` | `state` | Filter by state |
| `events` | `idx_events_school_id` | `school_id` | School profile queries |
| `events` | `idx_events_published_date` | `is_published, date` | Published upcoming events |
| `user_saved_events` | `idx_saved_user` | `user_id` | User's saved events |
| `event_rsvps` | `idx_rsvp_user` | `user_id` | User's RSVPs |
| `event_rsvps` | `idx_rsvp_event` | `event_id` | Event attendance list |

---

## Row Level Security (RLS)

### `events`
| Policy | Rule |
|--------|------|
| SELECT | Anyone can read where `is_published = true` |
| INSERT | Admin role only |
| UPDATE | Admin role only |
| DELETE | Admin role only |

### `user_saved_events`
| Policy | Rule |
|--------|------|
| SELECT | `auth.uid() = user_id` |
| INSERT | `auth.uid() = user_id` |
| DELETE | `auth.uid() = user_id` |

### `event_rsvps`
| Policy | Rule |
|--------|------|
| SELECT | `auth.uid() = user_id` OR admin |
| INSERT | `auth.uid() = user_id` |
| UPDATE | Admin only (for status changes) |

---

## Old Events Handling

| Scenario | Action |
|----------|--------|
| Event date passes | Stays in table, filtered out by `date >= today` in queries |
| Cleanup job (cron) | Delete events older than 90 days past their date |
| Bookmark on deleted event | Auto-deleted via `ON DELETE CASCADE` |
| "Saved" tab display | Only shows upcoming events by default |

---

## Helper Queries

### Get events for school profile page
```sql
-- Returns: school's events + AANA state meetings in same state
SELECT * FROM events
WHERE (school_id = :school_id OR (category = 'aana_state_meeting' AND state = :school_state))
  AND date >= CURRENT_DATE
  AND is_published = true
ORDER BY date ASC;
```

### Get user's saved upcoming events
```sql
SELECT e.* FROM events e
JOIN user_saved_events s ON s.event_id = e.id
WHERE s.user_id = :user_id
  AND e.date >= CURRENT_DATE
  AND e.is_published = true
ORDER BY e.date ASC;
```

---

## Attendance Webhook Flow (CRNA Club Events)

1. User clicks "RSVP" → redirected to Zoom registration
2. Zoom confirms registration → webhook creates `event_rsvps` row with `status = 'registered'`
3. User joins Zoom meeting → attendance webhook fires
4. Edge Function updates `status = 'attended'`, `attended_at = now()`
5. Points awarded, `points_awarded = true`

---

## Related Docs

- `/docs/project/features/url-monitoring-system.md` - Monitoring school/AANA pages for new events
- `src/data/mockEvents.js` - Current mock data structure
