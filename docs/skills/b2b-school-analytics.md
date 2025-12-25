# B2B School Analytics System

Privacy-compliant analytics to sell to CRNA schools and power ad sales.

---

## Overview

Track user behavior to provide aggregate insights to CRNA programs about their applicant pool. Schools can use this data for:
- Understanding their pipeline (saves, targets, applications)
- Benchmarking applicant quality vs peers
- Identifying process improvement opportunities
- Measuring advertising ROI

**Critical Constraint:** Only aggregate insights - never individual user data.

---

## 3-Table Architecture

| Table | Purpose | Who Queries |
|-------|---------|-------------|
| `analytics_events` | Raw event log (user_id, program_id, event_type, timestamp) | Backend batch jobs ONLY |
| `user_profile_snapshots` | Periodic snapshots with **bucketed** values (GPA at event time) | Backend aggregation |
| `program_metrics` | Pre-computed aggregates per program (weekly/monthly) | **Schools see ONLY this** |

### Data Flow

```
User actions (view, save, target)
         ↓
[analytics_events] - raw log with user_id, program_id, timestamp
         ↓
    Weekly/Monthly batch job
         ↓
[user_profile_snapshots] - bucketed user data (GPA 3.4-3.5, 2-3 yrs ICU)
         ↓
    Aggregation job computes per-program stats
         ↓
[program_metrics] - "Georgetown: 847 saves, avg applicant GPA 3.4-3.5, 89% CCRN"
         ↓
    School dashboard queries ONLY this
```

### Why Snapshots?

Captures user profile **at the time of the event** for historical accuracy:
- User applies with 3.4 GPA in March
- User retakes class, now has 3.6 GPA in October
- Georgetown's "avg applicant GPA" stays accurate (3.4 at application time)

---

## Events to Track

### MVP Events

```javascript
const ANALYTICS_EVENTS = {
  // Program interactions
  PROGRAM_VIEWED: 'program_viewed',
  PROGRAM_SAVED: 'program_saved',
  PROGRAM_UNSAVED: 'program_unsaved',
  PROGRAM_TARGETED: 'program_targeted',
  PROGRAM_REMOVED_FROM_TARGETS: 'program_removed_from_targets',

  // Application progress
  APPLICATION_STATUS_UPDATED: 'application_status_updated',

  // Search & discovery
  SEARCH_QUERY: 'search_query',
};
```

### Event Schema

```javascript
// analytics_events table
{
  id: uuid,
  user_id: string,
  program_id: string,
  event_type: string,
  timestamp: datetime,

  // Snapshot at event time (already bucketed for privacy)
  user_gpa_bucket: string,        // '3.4-3.5'
  user_icu_years_bucket: string,  // '2-3'
  user_has_ccrn: boolean,
  user_icu_type: string,          // 'micu', 'cvicu', etc.

  // Event-specific metadata
  metadata: json,                 // { query: 'Georgetown', new_status: 'submitted' }

  created_at: datetime
}
```

### Phase 2 Events (Future)

```javascript
// Content & feature usage
PROGRAM_DETAIL_SECTION_VIEWED: 'program_detail_section_viewed',
PROGRAM_COMPARED: 'program_compared',
EVENT_REGISTERED: 'event_registered',
CHECKLIST_ITEM_COMPLETED: 'checklist_item_completed',

// Engagement
USER_LOGGED_IN: 'user_logged_in',
CLINICAL_ENTRY_LOGGED: 'clinical_entry_logged',
SHADOW_DAY_LOGGED: 'shadow_day_logged',
```

---

## Privacy Safeguards

### Bucketing (De-identification)

Never store exact values - use buckets:

| Field | Buckets |
|-------|---------|
| GPA | 0.1 increments: 3.0-3.1, 3.1-3.2, ... 3.9-4.0 |
| ICU Years | 1-2, 2-3, 3-4, 4-5, 5+ |
| Shadow Hours | 0-20, 20-40, 40-60, 60-80, 80+ |
| GRE Scores | 10-point ranges: 140-150, 150-160, 160-170 |

### Minimum Group Size

Never show metrics based on < 10 users. If a program has only 5 saves, show "< 10 saves" not "5 saves".

### Access Control

- **Row-level security**: Schools only see their own program's `program_metrics`
- **Audit logging**: Every dashboard view logged with timestamp, user, data accessed
- Schools NEVER have access to `analytics_events` or `user_profile_snapshots`

### What Schools CAN See

```json
{
  "programName": "Georgetown University CRNA Program",
  "period": "Fall 2024 Cycle",

  "pipeline": {
    "totalSaves": 847,
    "activeTargets": 142,
    "applicationsSubmitted": 98,
    "saveToTargetRate": "16.8%"
  },

  "applicantProfile": {
    "gpaDistribution": {
      "3.0-3.1": "2%",
      "3.1-3.2": "5%",
      "3.2-3.3": "8%",
      "3.3-3.4": "12%",
      "3.4-3.5": "18%",
      "3.5-3.6": "22%",
      "3.6-3.7": "18%",
      "3.7-3.8": "10%",
      "3.8-3.9": "4%",
      "3.9-4.0": "1%"
    },
    "ccrnRate": "89%",
    "avgIcuYears": "3.2",
    "icuTypeBreakdown": {
      "micu": "35%",
      "cvicu": "28%",
      "sicu": "18%",
      "other": "19%"
    }
  },

  "competitiveSet": [
    { "program": "Duke", "overlap": "73%" },
    { "program": "Columbia", "overlap": "68%" },
    { "program": "Rush", "overlap": "54%" }
  ]
}
```

### What Schools CANNOT See

- Individual user names, emails, or identifying information
- Exact GPA values (only buckets)
- Which specific users saved/targeted their program
- Individual applications or documents
- Any data that could identify a user when combined with external data

---

## Metrics for Schools

### Pipeline & Demand

| Metric | Description | Aggregation |
|--------|-------------|-------------|
| Saves count | Total users who saved program | Weekly |
| Targets count | Users with isTarget=true | Weekly |
| Applications count | Users who submitted | Weekly |
| Funnel conversion | view → save → target → apply rates | Monthly |
| Days to convert | Avg time at each funnel stage | Monthly |
| Application cycle | First-time vs repeat applicants | Quarterly |

### Applicant Quality Benchmarks

| Metric | Description | Aggregation |
|--------|-------------|-------------|
| GPA distribution | 0.1-increment buckets | Monthly |
| ICU experience | Years + unit type breakdown | Monthly |
| Certification rates | % with CCRN, GRE taken, etc. | Monthly |
| Shadow hours | Distribution by bucket | Monthly |

### Competitive Intelligence

| Metric | Description | Aggregation |
|--------|-------------|-------------|
| Program overlap | "Users who save you also save X" | Monthly |
| Peer comparison | Your metrics vs peer group avg | Quarterly |
| Regional benchmarks | Your metrics vs regional avg | Quarterly |
| National benchmarks | Your metrics vs national avg | Quarterly |

### Process Improvement Signals

| Metric | Description | Aggregation |
|--------|-------------|-------------|
| Search queries | Top searches related to program | Monthly |
| Drop-off points | Where users abandon funnel | Monthly |
| FAQ data | Common questions searched | Quarterly |
| Timeline friction | Which deadlines users miss | Quarterly |

### Ad Sales Metrics

| Metric | Description | Aggregation |
|--------|-------------|-------------|
| Impressions | Times program appeared in search/browse | Weekly |
| Engagement | Time on page, repeat views, save rate | Weekly |
| Cost per application | Ad spend / applications (if running ads) | Monthly |
| Audience demographics | Bucketed profile of engaged users | Monthly |

---

## Aggregation Cadence

| Frequency | What Gets Computed |
|-----------|-------------------|
| **Real-time** | Application submissions only (for notifications) |
| **Weekly** | Funnel metrics, engagement scores, competitor overlap |
| **Monthly** | Full applicant profile benchmarks, conversion trends, process signals |
| **Quarterly** | Year-over-year comparisons, cohort analysis, predictive models |

---

## Data Model

### Table: `analytics_events`

```sql
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  program_id VARCHAR NOT NULL,
  event_type VARCHAR NOT NULL,
  timestamp TIMESTAMP NOT NULL,

  -- Bucketed profile snapshot at event time
  user_gpa_bucket VARCHAR,
  user_icu_years_bucket VARCHAR,
  user_has_ccrn BOOLEAN,
  user_icu_type VARCHAR,

  -- Event metadata
  metadata JSONB,

  created_at TIMESTAMP DEFAULT NOW(),

  -- Indexes for aggregation queries
  INDEX idx_program_time (program_id, timestamp),
  INDEX idx_event_type (event_type),
  INDEX idx_user_program (user_id, program_id)
);
```

### Table: `user_profile_snapshots`

```sql
CREATE TABLE user_profile_snapshots (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  snapshot_date DATE NOT NULL,

  -- Academic (BUCKETED)
  overall_gpa_bucket VARCHAR,      -- '3.4-3.5'
  science_gpa_bucket VARCHAR,
  has_gre BOOLEAN,
  gre_quant_bucket VARCHAR,        -- '150-160'
  gre_verbal_bucket VARCHAR,

  -- Clinical (BUCKETED)
  primary_icu_type VARCHAR,
  icu_years_bucket VARCHAR,        -- '2-3'
  has_ccrn BOOLEAN,

  -- Shadow (BUCKETED)
  shadow_hours_bucket VARCHAR,     -- '40-60'

  -- Engagement
  application_cycle INT,           -- 1, 2, 3 (first, second, third cycle)

  created_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(user_id, snapshot_date)
);
```

### Table: `program_metrics`

```sql
CREATE TABLE program_metrics (
  id UUID PRIMARY KEY,
  program_id VARCHAR NOT NULL,
  period_type VARCHAR NOT NULL,    -- 'weekly', 'monthly', 'quarterly'
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,

  -- Pipeline metrics
  saves_count INT,
  targets_count INT,
  applications_count INT,
  save_to_target_rate DECIMAL,
  target_to_apply_rate DECIMAL,

  -- Applicant profile (distributions as JSON)
  gpa_distribution JSONB,
  icu_type_distribution JSONB,
  icu_years_distribution JSONB,
  ccrn_rate DECIMAL,
  gre_rate DECIMAL,
  shadow_hours_distribution JSONB,

  -- Competitive data
  competitive_overlap JSONB,       -- [{ program_id, overlap_pct }]

  -- Benchmarks
  peer_group_avg JSONB,
  regional_avg JSONB,
  national_avg JSONB,

  -- Process signals
  top_search_queries JSONB,
  funnel_dropoff_points JSONB,

  -- Ad metrics
  impressions INT,
  avg_time_on_page DECIMAL,
  repeat_view_rate DECIMAL,

  calculated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(program_id, period_type, period_start)
);
```

---

## Implementation Phases

### Phase 1: Event Instrumentation (MVP)

**Add tracking to React components:**

```javascript
// src/lib/analyticsClient.js
export async function trackEvent(eventType, programId, metadata = {}) {
  const userProfile = await getCurrentUserProfile();

  const event = {
    event_type: eventType,
    program_id: programId,
    user_id: getCurrentUserId(),
    timestamp: new Date().toISOString(),

    // Bucket profile data
    user_gpa_bucket: bucketGpa(userProfile.overallGpa),
    user_icu_years_bucket: bucketYears(userProfile.icuYears),
    user_has_ccrn: userProfile.hasCcrn,
    user_icu_type: userProfile.primaryIcuType,

    metadata,
  };

  eventQueue.push(event);

  if (eventQueue.length >= 10) {
    await flushEventQueue();
  }
}

// Bucketing functions
function bucketGpa(gpa) {
  if (!gpa) return null;
  const lower = Math.floor(gpa * 10) / 10;
  const upper = lower + 0.1;
  return `${lower.toFixed(1)}-${upper.toFixed(1)}`;
}

function bucketYears(years) {
  if (years < 1) return '0-1';
  if (years < 2) return '1-2';
  if (years < 3) return '2-3';
  if (years < 4) return '3-4';
  if (years < 5) return '4-5';
  return '5+';
}
```

**Track in components:**

```javascript
// ProgramCard.jsx - on view
useEffect(() => {
  trackEvent('program_viewed', program.id);
}, [program.id]);

// SaveButton - on save
const handleSave = () => {
  saveProgram(program.id);
  trackEvent('program_saved', program.id);
};

// TargetProgramDetail - on status change
const handleStatusChange = (newStatus) => {
  updateStatus(newStatus);
  trackEvent('application_status_updated', program.id, {
    new_status: newStatus
  });
};
```

### Phase 2: Aggregation Jobs

**Weekly job (Supabase Edge Function or cron):**

```javascript
// supabase/functions/compute-weekly-metrics/index.ts
export async function computeWeeklyMetrics() {
  const programs = await getAllPrograms();
  const weekStart = getWeekStart();
  const weekEnd = getWeekEnd();

  for (const program of programs) {
    const events = await getEventsForProgram(program.id, weekStart, weekEnd);

    const metrics = {
      saves_count: countEvents(events, 'program_saved'),
      targets_count: countEvents(events, 'program_targeted'),
      applications_count: countEvents(events, 'application_status_updated',
        e => e.metadata.new_status === 'submitted'),
      // ... more metrics
    };

    await upsertProgramMetrics(program.id, 'weekly', weekStart, weekEnd, metrics);
  }
}
```

### Phase 3: School Dashboard

**New pages:**

- `/admin/school-analytics/:schoolId` - School staff login
- Role: `school_admin` with row-level security

**Query only `program_metrics`:**

```javascript
// src/pages/admin/SchoolAnalyticsPage.jsx
export function SchoolAnalyticsPage() {
  const { schoolId } = useParams();
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    // Row-level security ensures they only see their program
    fetchProgramMetrics(schoolId).then(setMetrics);
  }, [schoolId]);

  return (
    <div>
      <PipelineMetrics data={metrics?.pipeline} />
      <ApplicantProfile data={metrics?.applicantProfile} />
      <CompetitiveSet data={metrics?.competitive} />
    </div>
  );
}
```

---

## Sample School Dashboard

```
┌─────────────────────────────────────────────────────────────────────┐
│  Georgetown University CRNA Program                                │
│  Analytics Dashboard - Fall 2024 Cycle                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  PIPELINE                                                           │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐             │
│  │   847   │ → │   142   │ → │    98   │ → │    42   │             │
│  │  Saves  │   │ Targets │   │ Applied │   │Accepted │             │
│  └─────────┘   └─────────┘   └─────────┘   └─────────┘             │
│       16.8%  →      69%   →      43%                                │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  APPLICANT PROFILE                                                  │
│                                                                     │
│  GPA Distribution          ICU Experience        Certifications    │
│  ┌──────────────┐          ┌──────────────┐      ┌────────────┐    │
│  │ 3.5-3.6 ██████│ 22%     │ MICU   ██████│ 35%  │ CCRN   89% │    │
│  │ 3.4-3.5 █████ │ 18%     │ CVICU  ████  │ 28%  │ GRE    92% │    │
│  │ 3.6-3.7 █████ │ 18%     │ SICU   ███   │ 18%  │ CSC    12% │    │
│  │ 3.3-3.4 ███   │ 12%     │ Other  ██    │ 19%  └────────────┘    │
│  └──────────────┘          └──────────────┘                         │
│                                                                     │
│  Avg ICU Experience: 3.2 years                                      │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  COMPETITIVE SET                                                    │
│  Users who save your program also save:                             │
│                                                                     │
│  Duke University           ██████████████████████████████  73%     │
│  Columbia University       █████████████████████████       68%     │
│  Rush University           ████████████████████           54%      │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  TRENDS (vs Last Year)                                              │
│  • Saves: +12%                                                      │
│  • Applications: +8%                                                │
│  • Avg GPA: +0.05 (3.46 → 3.51)                                    │
│  • CCRN Rate: +4% (85% → 89%)                                      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Revenue Models

### Tiered SaaS (Recommended)

| Tier | Price | Includes |
|------|-------|----------|
| Free | $0 | Basic saves/targets count |
| Standard | $500/year | + Demographics + Funnels |
| Premium | $2,000/year | + Competitive intel + Benchmarks |
| Enterprise | $5,000/year | + Custom cohorts + API access |

### Ad Sales

- Schools pay for featured placement in search results
- Track "cost per application" to prove ROI
- Offer sponsored content (program spotlights, webinars)

---

## Implementation Files

| File | Purpose |
|------|---------|
| `/src/lib/analyticsClient.js` | Event tracking + bucketing |
| `/src/lib/analyticsHelpers.js` | Bucketing functions |
| `/supabase/functions/compute-weekly-metrics` | Weekly aggregation job |
| `/supabase/functions/compute-monthly-metrics` | Monthly aggregation job |
| `/src/pages/admin/SchoolAnalyticsPage.jsx` | School dashboard |
| `/src/components/features/analytics/PipelineMetrics.jsx` | Pipeline chart |
| `/src/components/features/analytics/ApplicantProfile.jsx` | Demographics |
| `/src/components/features/analytics/CompetitiveSet.jsx` | Overlap chart |
