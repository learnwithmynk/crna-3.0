# Sellability Infrastructure Guide

A practical guide for building features in a way that captures valuable data and makes the platform sellable.

---

## Context

- 550 real users on WordPress (profiles, programs, tracker data)
- Clinical data has meds/procedures but NO patient info (not HIPAA)
- Target: Strategic acquirer
- Focus: How we BUILD, not sales pitch

---

## Section 1: Data Capture Principles

**Every feature should:**
1. Log user actions to an events table
2. Timestamp all state changes
3. Store data in a way that's exportable
4. Track engagement metrics

---

## Section 2: Analytics Events to Capture

**Core events (implement as we build):**

| Event | When to Log | Properties |
|-------|-------------|------------|
| `page_view` | Every page load | page, duration, referrer |
| `program_saved` | User saves a program | program_id |
| `program_targeted` | User targets a program | program_id |
| `program_removed` | User removes a program | program_id, was_target |
| `tracker_entry_created` | New tracker entry | type (clinical/eq/shadow/event) |
| `profile_updated` | Profile field changed | field_name, completion_% |
| `search_performed` | School database search | query, filters, result_count |
| `school_viewed` | School detail page | school_id, time_on_page |

**Storage:** Supabase `analytics_events` table

---

## Section 3: Per-Feature Data Capture Guide

**When building each feature, capture:**

| Feature | What to Log |
|---------|-------------|
| **Dashboard** | page_view with session duration |
| **My Programs** | save, unsave, target, untarget actions |
| **School Database** | searches, filter usage, school views |
| **Trackers** | entry creation, entry types, tag usage |
| **My Stats** | profile field updates, completion rate |
| **Marketplace** | service views, booking attempts |
| **Community** | posts, replies, group joins |
| **Onboarding** | step completions, drop-off points |

---

## Section 4: Privacy & Data Structure

**Clinical data status:**
- User-entered procedures, medications, devices
- NO patient-identifiable information
- NOT subject to HIPAA

**Data portability requirements:**
- Users can export their data
- All data exportable for migration
- Clear timestamps on all records

**Data structure principles:**
- Store raw events (don't aggregate prematurely)
- Use JSONB for flexible properties
- Index by user_id, event_name, date

---

## Section 5: Data Capture Opportunities by Feature

**What to capture and why it matters:**

| Feature | Data to Capture | Why It Matters |
|---------|-----------------|----------------|
| **School Database** | Search queries, filter combinations, time-on-page | Understand what users look for, program demand |
| **My Programs** | Save/unsave patterns, target conversion, comparisons | Program popularity, decision patterns |
| **Trackers** | Entry frequency, skill diversity, progression | Engagement depth, user growth |
| **My Stats** | Profile completion rate, field-by-field | Data quality, user intent |
| **Marketplace** | Service views, booking conversion | Revenue potential, demand signals |
| **Community** | Topic popularity, reply rates | Content value, engagement |
| **Onboarding** | Drop-off points, completion rate | Activation health |
| **Micro-Apps** | Usage frequency, results generated | Feature value |

---

## Section 6: Derived Metrics & Insights

### Engagement Metrics

| Metric | How to Compute |
|--------|----------------|
| Program Popularity Score | saves + (targets × 2) + views weighted |
| User Engagement Score | tracker_entries + profile_completion + logins |
| Feature Adoption | % users who used feature in last 30 days |
| Retention Curves | % users active at 7/30/90 days |

### Onboarding & User Journey Metrics

| Metric | How to Compute | What It Tells Us |
|--------|----------------|------------------|
| Time to First Save | Days from signup → first program saved | How quickly users engage |
| Time to First Target | Days from signup → first target program | How long in early planning stage |
| Saves within 7 days | Count of programs saved in first week | Early engagement signal |
| Saves within 30 days | Count of programs saved in first month | Planning intensity |
| Target conversion rate | % of saved programs that become targets | Decision-making patterns |
| Profile completion time | Days from signup → profile 100% complete | Onboarding friction |
| Onboarding drop-off point | Last completed step before churn | Where we lose users |

### User Stage Analysis

| Metric | How to Compute | What It Tells Us |
|--------|----------------|------------------|
| Stage at signup | `current_stage` field value at registration | Who is joining (early planners vs active applicants) |
| Stage progression | Changes to `current_stage` over time | How users move through journey |
| Time in each stage | Days spent at each `current_stage` | Stage duration benchmarks |
| Stage → conversion | % of each stage that converts to paid | Which stages are most valuable |
| Stage → engagement | Avg tracker entries by stage | Which stages are most active |

### Event Engagement Metrics

| Metric | How to Compute | What It Tells Us |
|--------|----------------|------------------|
| Event attendance rate | % of users who saved/attended a school event | How many engage before applying |
| Events per user | Avg school events saved/attended per user | Engagement depth |
| Event → Target correlation | % of users who attended event then targeted that school | Event influence on decisions |
| Event → Application correlation | % of event attendees who applied to that school | Event ROI |
| Time from event to target | Days from attending event → targeting that school | Decision timeline |
| Event types by stage | Which event types (info session, open house) by user stage | Stage-specific behavior |

### Cohort Analysis

| Metric | How to Compute | What It Tells Us |
|--------|----------------|------------------|
| Signup cohort retention | % of [month] signups still active at 30/60/90 days | Cohort health |
| Stage cohort behavior | Avg saves/targets by signup stage | Stage-specific patterns |
| Seasonal patterns | Signups/activity by month | Application cycle timing |
| Event engagement by cohort | % of each cohort attending events | Cohort engagement depth |

### Questions to Ask When Building Each Feature

1. What user behavior data can we capture here?
2. What aggregate insights can we derive?
3. What proves engagement/stickiness?
4. What could inform recommendations later?
5. How does this help us understand who is joining and at what stage?

---

## Section 7: Build Checklist

**Before marking a feature complete:**
- [ ] Are user actions being logged to analytics_events?
- [ ] Are all state changes timestamped?
- [ ] Can this data be exported?
- [ ] Can we compute engagement metrics from this?

---

## Implementation

### 1. Analytics Events Table (schema.sql)

```sql
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  event_name TEXT NOT NULL,
  properties JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_user ON analytics_events(user_id);
CREATE INDEX idx_events_name ON analytics_events(event_name);
CREATE INDEX idx_events_date ON analytics_events(created_at);
```

### 2. Event Logging Utility (src/lib/analytics.js)

```javascript
// Simple event logging utility
export function trackEvent(eventName, properties = {}) {
  // For now, just log to console (dev team wires to Supabase)
  console.log('[Analytics]', eventName, properties);

  // TODO: Replace with Supabase insert
  // supabase.from('analytics_events').insert({
  //   event_name: eventName,
  //   properties,
  //   user_id: getCurrentUserId()
  // });
}
```

### 3. Usage in Components

```javascript
import { trackEvent } from '@/lib/analytics';

// When user saves a program
trackEvent('program_saved', { program_id: 3789 });

// When user views a school
trackEvent('school_viewed', { school_id: 3789 });
```
