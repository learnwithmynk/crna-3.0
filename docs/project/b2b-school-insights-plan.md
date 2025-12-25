# B2B School Insights & Advertising Strategy Plan

**Created:** December 16, 2024
**Purpose:** Comprehensive implementation plan for school-facing data insights and advertising revenue features
**Audience:** Development team

---

## Executive Summary

We are building an internal admin tool to view aggregate data about user interest in CRNA programs. This data serves two purposes:

1. **Sales Pitches:** Provide data to pitch advertising/partnership deals to universities
2. **Social Content:** Generate platform-wide statistics for marketing content that positions CRNA Club as "data-forward"

**Key Constraint:** All school-facing data is **aggregate only**. We never share individual user information with schools. This is a privacy requirement.

---

## Background & Business Context

### The Opportunity

CRNA Club tracks ~140 CRNA programs and has users who:
- Save programs they're interested in
- Target programs they plan to apply to
- Track application status through the funnel
- Log shadow hours, clinical experience, certifications

This creates valuable aggregate data that schools would pay for:
- How many applicants are interested in their program?
- What's the quality profile of interested applicants (avg GPA, % with CCRN)?
- Who are their competitor programs (overlap analysis)?
- How does interest trend over time?

### Revenue Streams This Enables

| Revenue Type | Description |
|--------------|-------------|
| **Analytics SaaS** | Schools pay $500-5,000/year for dashboard access |
| **Featured Placement** | Schools pay for sponsored search results |
| **Event Promotion** | Schools pay to boost info sessions |
| **Content Marketing** | Platform-wide stats shared on social media drive inbound interest |

### Why Aggregate Only?

- User trust: Applicants don't want schools knowing they're interested before they apply
- Future opt-in: We may add "let schools see you" as an opt-in feature later (not MVP)
- Legal simplicity: No individual data = no GDPR/privacy concerns

---

## What We're Building

### 1. School Data Readiness Page (List View)

**Purpose:** At-a-glance view of ALL schools showing how close each is to having statistically reliable data.

**Why:** Before sharing any stat publicly or with a school, we need enough users (N≥50) for statistical confidence. This page shows which schools are "ready" vs "building."

### 2. School Pitch Report Page (Detail View)

**Purpose:** Deep-dive into a single school's data with all metrics needed for a sales pitch or social content.

**Features:**
- Confidence indicators (green/yellow/gray) showing data reliability
- Margin of error displayed for each metric
- Pipeline funnel (saved → targeted → applying → submitted)
- Applicant quality metrics (GPA distribution, CCRN rate, ICU experience)
- Competitor overlap (which other schools do these users also target?)
- Platform-wide context (total users, % who match this school)

### 3. Social Content Mode

**Purpose:** Platform-wide aggregate stats (not school-specific) for creating marketing content.

**Examples:**
- "Average GPA of CRNA applicants on our platform: 3.47"
- "72% of our users have CCRN certification"
- "Most popular programs this cycle: Duke, Georgetown, Columbia"

### 4. Shadow Day School Affiliation

**Purpose:** When users log shadow hours, optionally link to a target program's clinical site.

**Why:** This is a high-commitment engagement signal - shadowing at a specific school's site shows serious interest.

### 5. Outcome Tracking Improvements

**Purpose:** Encourage users to report application outcomes (accepted/denied/waitlisted).

**Why:** Outcome data is extremely valuable for:
- Schools: "What's the profile of applicants who got accepted?"
- Social content: "Users with 3.5+ GPA and CCRN had 73% acceptance rate"
- User nudges: "Users like you had X% acceptance rate at this program"

---

## Data Confidence System

### Statistical Thresholds

| N (users) | Confidence Level | What Can Be Shared | Margin of Error |
|-----------|------------------|-------------------|-----------------|
| < 30 | Building (gray) | Raw counts only | Too high |
| 30-49 | Close (yellow) | Stats with caveats | ±18% |
| 50-99 | Ready (green) | Stats confidently | ±14% |
| 100+ | High confidence | Full distributions | ±10% |
| 200+ | Very high | Subgroup analysis | ±7% |

### Margin of Error Formula

For proportions at 95% confidence:
```
MOE = 1.96 * sqrt(0.25 / n)
```

Simplified for display:
```javascript
function getMarginOfError(n) {
  if (n < 30) return null; // Don't show stats
  const moe = 1.96 * Math.sqrt(0.25 / n);
  return Math.round(moe * 100); // Returns percentage
}
```

---

## New Routes

| Route | Page Component | Purpose |
|-------|----------------|---------|
| `/admin/school-insights` | `SchoolInsightsPage.jsx` | List view - all schools with data readiness |
| `/admin/school-insights/:schoolId` | `SchoolPitchReportPage.jsx` | Detail view - single school pitch data |

### Navigation

Add to `AdminDashboardPage.jsx` admin sections array:
```javascript
{
  to: '/admin/school-insights',
  icon: BarChart3, // from lucide-react
  title: 'School Insights',
  description: 'View aggregate data for B2B pitches and social content',
  color: 'blue',
}
```

---

## New Database Fields

### 1. Shadow Days - Add School Affiliation

**Table:** `shadow_days` (or `user_shadow_days`)

**New Fields:**
```sql
ALTER TABLE shadow_days ADD COLUMN school_id INTEGER REFERENCES schools(id);
ALTER TABLE shadow_days ADD COLUMN is_affiliated_site BOOLEAN DEFAULT FALSE;
```

**Purpose:** When user logs shadow hours, they can optionally indicate if this was at a clinical site for one of their target programs.

### 2. Outcome Tracking - Already Exists

The `user_saved_schools` table already has:
- `status` (includes 'accepted', 'denied', 'waitlisted')

We just need to ensure the outcome prompt (already designed in smart-prompts-system.md) is implemented.

### 3. Points for Outcome Reporting (Optional)

**Table:** Points configuration

**New Action:**
```javascript
{
  action: 'report_application_outcome',
  points: 5,
  frequency: '1x per program',
  description: 'Report acceptance/denial/waitlist status'
}
```

---

## New Helper Files

### `/src/lib/dataConfidence.js`

```javascript
/**
 * Data Confidence Helpers
 *
 * Provides statistical confidence calculations for B2B school insights.
 */

export const CONFIDENCE_THRESHOLDS = {
  READY: 50,      // Full stats shareable
  CLOSE: 30,      // Basic stats with caveats
  BUILDING: 0,    // Counts only
};

export const CONFIDENCE_LEVELS = {
  ready: {
    key: 'ready',
    label: 'Ready',
    color: 'green',
    description: 'High confidence - safe to share',
  },
  close: {
    key: 'close',
    label: 'Close',
    color: 'yellow',
    description: 'Share with caveats',
  },
  building: {
    key: 'building',
    label: 'Building',
    color: 'gray',
    description: 'Counts only - need more data',
  },
};

/**
 * Get confidence level based on sample size
 */
export function getConfidenceLevel(n) {
  if (n >= CONFIDENCE_THRESHOLDS.READY) return CONFIDENCE_LEVELS.ready;
  if (n >= CONFIDENCE_THRESHOLDS.CLOSE) return CONFIDENCE_LEVELS.close;
  return CONFIDENCE_LEVELS.building;
}

/**
 * Calculate margin of error for a proportion at 95% confidence
 * Returns percentage (e.g., 14 for ±14%)
 */
export function getMarginOfError(n) {
  if (n < 30) return null;
  const moe = 1.96 * Math.sqrt(0.25 / n);
  return Math.round(moe * 100);
}

/**
 * Format margin of error for display
 */
export function formatMarginOfError(n) {
  const moe = getMarginOfError(n);
  if (moe === null) return 'Insufficient data';
  return `±${moe}%`;
}

/**
 * Check if a metric is shareable based on sample size and metric type
 */
export function isShareable(n, metricType = 'singleStat') {
  const thresholds = {
    count: 1,           // Raw counts always shareable
    singleStat: 50,     // Avg GPA, % CCRN
    distribution: 100,  // GPA breakdown chart
    overlap: 50,        // Competitor overlap (need 50 in BOTH schools)
  };
  return n >= (thresholds[metricType] || 50);
}

/**
 * Get progress toward ready threshold
 */
export function getProgressToReady(n) {
  return Math.min(100, Math.round((n / CONFIDENCE_THRESHOLDS.READY) * 100));
}
```

---

## New Hooks

### `/src/hooks/useSchoolInsights.js`

```javascript
/**
 * useSchoolInsights
 *
 * Fetches and computes aggregate statistics for a single school.
 * Used by SchoolPitchReportPage.
 */

import { useMemo } from 'react';
import { useSchools } from './useSchools';
import { useSavedSchools } from './useSavedSchools';
import { useUserProfiles } from './useUserProfiles';
import { getConfidenceLevel, getMarginOfError } from '@/lib/dataConfidence';

export function useSchoolInsights(schoolId) {
  // Fetch all users who have saved/targeted this school
  // Fetch their profile data for quality metrics
  // Compute aggregates

  // Returns:
  // {
  //   school: { id, name, ... },
  //   pipeline: { saved, targeted, applying, submitted, accepted, denied },
  //   quality: { avgGpa, gpaDistribution, ccrnRate, avgIcuYears, icuTypeBreakdown },
  //   competitors: [{ schoolId, schoolName, overlapCount, overlapPercent }],
  //   confidence: { level, marginOfError, sampleSize },
  //   platformContext: { totalUsers, usersMatchingCriteria },
  //   isLoading,
  //   error,
  // }
}
```

### `/src/hooks/useAllSchoolsInsights.js`

```javascript
/**
 * useAllSchoolsInsights
 *
 * Fetches summary data for all schools - used by list view.
 * Optimized for showing many schools at once.
 */

export function useAllSchoolsInsights() {
  // Returns array of:
  // {
  //   schoolId,
  //   schoolName,
  //   state,
  //   savedCount,
  //   targetedCount,
  //   confidenceLevel,
  //   progressToReady,
  // }
}
```

### `/src/hooks/usePlatformInsights.js`

```javascript
/**
 * usePlatformInsights
 *
 * Fetches platform-wide aggregate statistics.
 * Used by Social Content mode.
 */

export function usePlatformInsights() {
  // Returns:
  // {
  //   totalUsers,
  //   avgGpa,
  //   gpaDistribution,
  //   ccrnRate,
  //   avgIcuYears,
  //   icuTypeBreakdown,
  //   topPrograms: [{ schoolId, name, savedCount }],
  //   degreePreference: { dnp: X%, dnap: Y%, msna: Z% },
  // }
}
```

---

## New Pages

### `/src/pages/admin/SchoolInsightsPage.jsx`

**Purpose:** List view showing all schools with data readiness indicators.

**Layout:**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  📊 School Data Insights                                     [Admin Only]   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Platform Summary                                                           │
│  Total Users: 4,247 | Avg GPA: 3.47 | CCRN Rate: 72%                       │
│                                                                             │
│  Data Readiness: 23 ready ✓ | 31 close | 86 building                       │
│                                                                             │
│  [Filter: All ▼]  [Sort by: Users ▼]  [Search...]                          │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ✅ READY (50+ users)                                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ School                        State   Users   Progress              │   │
│  │ Duke University               NC      312     ████████████████ ✓    │   │
│  │ Georgetown University         DC      284     ████████████████ ✓    │   │
│  │ Columbia University           NY      201     ████████████████ ✓    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  🟡 CLOSE (30-49 users)                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ U of Cincinnati               OH      47      ████████████████░░    │   │
│  │ Emory University              GA      44      ███████████████░░░    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ⬜ BUILDING (<30 users)                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ U of North Dakota             ND      24      ████████░░░░░░░░░░    │   │
│  │ Midwestern University         AZ      19      ██████░░░░░░░░░░░░    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Features:**
- Platform summary stats at top (for social content)
- Schools grouped by confidence level
- Progress bar showing users vs goal (50)
- Click row to go to detail page
- Search/filter functionality
- Sort by: users, name, state

---

### `/src/pages/admin/SchoolPitchReportPage.jsx`

**Purpose:** Detailed view for a single school with all pitch data.

**Layout:**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  📊 School Pitch Report                                      [Admin Only]   │
│  ← Back to All Schools                                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Georgetown University                                                      │
│  Washington, DC | DNP | Front-Loaded                                        │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │  DATA CONFIDENCE                                                      │ │
│  │  Users tracking: 284        Status: ✅ Ready (±6% margin of error)    │ │
│  │  ████████████████████████████████████████████████████████ 284/50      │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  PIPELINE                                                                   │
│  ┌────────────────────────────────────────────────────────────────────────┐│
│  │  ✅ 284       → ✅ 142      → ✅ 67       → ✅ 31       → ✅ 12        ││
│  │  Saved         Targeted      Applying      Submitted     Accepted      ││
│  │                                                                        ││
│  │  Conversion: 50% → 47% → 46% → 39%                                     ││
│  └────────────────────────────────────────────────────────────────────────┘│
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  APPLICANT QUALITY (based on 142 targeted users)                            │
│                                                                             │
│  ┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────────┐│
│  │ ✅ Average GPA       │ │ ✅ CCRN Rate         │ │ ✅ Avg ICU Years     ││
│  │    3.54 (±0.08)      │ │    89% (±5%)         │ │    3.2 yrs (±0.3)    ││
│  │    n=142             │ │    n=142             │ │    n=142             ││
│  └──────────────────────┘ └──────────────────────┘ └──────────────────────┘│
│                                                                             │
│  GPA Distribution                    ICU Type Breakdown                     │
│  3.8+ ████ 12%                       MICU  ████████████ 35%                 │
│  3.6  █████████ 24%                  CVICU ██████████ 28%                   │
│  3.4  ████████████ 31%               SICU  ███████ 18%                      │
│  3.2  ████████ 21%                   Other █████ 19%                        │
│  3.0  ████ 12%                                                              │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  COMPETITIVE OVERLAP (users who saved Georgetown also saved...)             │
│                                                                             │
│  ✅ Duke University         ████████████████████████  73% (207 users)       │
│  ✅ Columbia University     ████████████████████      68% (193 users)       │
│  ✅ Rush University         ████████████████          54% (153 users)       │
│  ✅ U of Pittsburgh         ██████████████            42% (119 users)       │
│  🟡 Emory University        ███████████               34% (97 users)        │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  PLATFORM CONTEXT                                                           │
│                                                                             │
│  Total platform users: 4,247                                                │
│  Users who saved this school: 284 (6.7% of platform)                        │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  WHAT'S SHAREABLE                                                           │
│  ✅ Pipeline counts and conversions                                         │
│  ✅ Average GPA, CCRN rate, ICU experience                                  │
│  ✅ GPA distribution chart                                                  │
│  ✅ Top 5 competitor overlap                                                │
│                                                                             │
│  [Copy Stats to Clipboard]                                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Features:**
- Confidence banner with margin of error
- Pipeline funnel with conversions
- Quality metrics with individual confidence indicators
- GPA distribution bar chart
- ICU type breakdown
- Competitor overlap list
- "What's shareable" checklist
- Copy to clipboard button for easy use in emails/decks

---

## New Components

### `/src/components/features/insights/ConfidenceBadge.jsx`

Displays confidence level with appropriate color:
```jsx
// Usage: <ConfidenceBadge level="ready" count={284} goal={50} />
// Renders: ✅ Ready (284 users)
```

### `/src/components/features/insights/ConfidenceProgressBar.jsx`

Progress bar showing users vs goal:
```jsx
// Usage: <ConfidenceProgressBar current={47} goal={50} />
// Renders: ████████████████░░ 47/50
```

### `/src/components/features/insights/MetricCard.jsx`

Stat card with confidence indicator:
```jsx
// Usage: <MetricCard label="Average GPA" value="3.54" moe="±0.08" n={142} confident={true} />
```

### `/src/components/features/insights/PipelineFunnel.jsx`

Visual funnel showing conversion stages:
```jsx
// Usage: <PipelineFunnel stages={[{label: 'Saved', count: 284}, ...]} />
```

### `/src/components/features/insights/CompetitorOverlapList.jsx`

List of competitor schools with overlap bars:
```jsx
// Usage: <CompetitorOverlapList competitors={[{name: 'Duke', overlap: 73, count: 207}, ...]} />
```

### `/src/components/features/insights/GpaDistributionChart.jsx`

Bar chart showing GPA distribution:
```jsx
// Usage: <GpaDistributionChart distribution={{'3.8+': 12, '3.6-3.8': 24, ...}} />
```

### `/src/components/features/insights/IcuTypeBreakdown.jsx`

Horizontal bar chart for ICU types:
```jsx
// Usage: <IcuTypeBreakdown breakdown={{micu: 35, cvicu: 28, sicu: 18, other: 19}} />
```

---

## Shadow Day School Affiliation

### UI Change: Shadow Day Form

Add to the shadow day logging form:

```
┌─────────────────────────────────────────────────────────────┐
│  Log Shadow Day                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Date: [December 15, 2025]                                  │
│  Hours: [8]                                                 │
│  Location: [Sibley Memorial Hospital]                       │
│  CRNA Name: [John Smith, CRNA]                              │
│  Cases Observed: [4]                                        │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  Is this a clinical site for one of your target programs?   │
│                                                             │
│  [  ] No / Not sure                                         │
│  [  ] Yes → [Select program ▼]                              │
│             (Shows only user's target programs)             │
│                                                             │
│  [Save Shadow Day]                                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Data Model

Add to shadow_days table:
- `school_id` (INTEGER, nullable, FK to schools)
- `is_affiliated_site` (BOOLEAN, default false)

---

## Outcome Tracking

### Already Designed

From `/docs/skills/smart-prompts-system.md`:

**Prompt ID:** `OUTCOME_PROMPT`
**Trigger:** 2+ weeks after interview date
**Copy:** "Any news from {programName}? Updating helps track your journey."
**Actions:** Status selector

### Implementation Needed

1. Implement the `OUTCOME_PROMPT` trigger in `promptEngine.js`
2. Optionally add gamification points for reporting outcomes (5 pts suggested)

### Status Flow

```
submitted → interview_invite → interview_complete → accepted
                                                  → waitlisted
                                                  → denied
```

---

## Queries Needed

### Pipeline Counts by School

```sql
SELECT
  school_id,
  COUNT(*) as saved_count,
  COUNT(*) FILTER (WHERE is_target = true) as targeted_count,
  COUNT(*) FILTER (WHERE status IN ('in_progress', 'applying')) as applying_count,
  COUNT(*) FILTER (WHERE status = 'submitted') as submitted_count,
  COUNT(*) FILTER (WHERE status = 'accepted') as accepted_count,
  COUNT(*) FILTER (WHERE status = 'denied') as denied_count,
  COUNT(*) FILTER (WHERE status = 'waitlisted') as waitlisted_count
FROM user_saved_schools
GROUP BY school_id;
```

### Quality Metrics for a School

```sql
-- Get profiles of users targeting a specific school
SELECT
  up.overall_gpa,
  up.science_gpa,
  up.primary_icu_type,
  up.total_years_experience,
  CASE WHEN EXISTS (
    SELECT 1 FROM user_certifications uc
    WHERE uc.user_id = up.user_id AND uc.type = 'ccrn'
  ) THEN true ELSE false END as has_ccrn
FROM user_profiles up
JOIN user_saved_schools uss ON uss.user_id = up.user_id
WHERE uss.school_id = :schoolId
  AND uss.is_target = true;
```

### Competitor Overlap

```sql
-- For school X, find other schools that users also saved
WITH school_users AS (
  SELECT user_id FROM user_saved_schools WHERE school_id = :schoolId
)
SELECT
  s.id as competitor_id,
  s.name as competitor_name,
  COUNT(DISTINCT uss.user_id) as overlap_count,
  ROUND(100.0 * COUNT(DISTINCT uss.user_id) / (SELECT COUNT(*) FROM school_users), 1) as overlap_percent
FROM user_saved_schools uss
JOIN schools s ON uss.school_id = s.id
WHERE uss.user_id IN (SELECT user_id FROM school_users)
  AND uss.school_id != :schoolId
GROUP BY s.id, s.name
ORDER BY overlap_count DESC
LIMIT 10;
```

### Platform-Wide Stats

```sql
-- Overall platform statistics
SELECT
  COUNT(DISTINCT user_id) as total_users,
  AVG(overall_gpa) as avg_gpa,
  AVG(total_years_experience) as avg_icu_years,
  COUNT(*) FILTER (WHERE has_ccrn = true) * 100.0 / COUNT(*) as ccrn_rate
FROM user_profiles
WHERE overall_gpa IS NOT NULL;
```

---

## Implementation Order

### Phase 1: Foundation (Week 1)

1. Create `dataConfidence.js` helper file
2. Create database migration for shadow day school affiliation
3. Create `useAllSchoolsInsights` hook
4. Create `SchoolInsightsPage` (list view) with basic table

### Phase 2: Detail View (Week 2)

1. Create `useSchoolInsights` hook
2. Create `SchoolPitchReportPage` (detail view)
3. Create component library:
   - `ConfidenceBadge`
   - `ConfidenceProgressBar`
   - `MetricCard`
   - `PipelineFunnel`

### Phase 3: Quality Metrics (Week 3)

1. Add quality metrics queries to `useSchoolInsights`
2. Create visualization components:
   - `GpaDistributionChart`
   - `IcuTypeBreakdown`
3. Add competitor overlap calculation and display

### Phase 4: Shadow Affiliation & Outcomes (Week 4)

1. Update shadow day form with school affiliation field
2. Implement `OUTCOME_PROMPT` in prompt engine
3. (Optional) Add points for outcome reporting

### Phase 5: Polish (Week 5)

1. Add copy-to-clipboard functionality
2. Add search/filter to list view
3. Add platform summary stats to list view header
4. Testing and bug fixes

---

## Testing Checklist

- [ ] List view loads all schools
- [ ] Schools are correctly grouped by confidence level
- [ ] Progress bars show correct percentages
- [ ] Clicking school navigates to detail page
- [ ] Detail page shows correct pipeline counts
- [ ] Quality metrics calculate correctly
- [ ] Margin of error displays correctly based on sample size
- [ ] Competitor overlap calculation is accurate
- [ ] Gray/yellow/green confidence indicators work correctly
- [ ] Shadow day form saves school affiliation
- [ ] Outcome prompt triggers at correct time

---

## Future Considerations (Not MVP)

1. **Opt-in user visibility:** Let users choose to be visible to schools they're targeting
2. **Trend data:** Show YoY changes in interest
3. **Timing insights:** When do users save, how long until they apply
4. **Geographic breakdown:** Where are interested applicants located
5. **Export to PDF:** Generate pitch decks automatically
6. **School dashboard:** Self-service portal for schools to see their own data

---

## Related Documentation

- `/docs/skills/b2b-school-analytics.md` - Original B2B analytics spec
- `/docs/skills/smart-prompts-system.md` - Outcome prompt definition
- `/docs/skills/canonical-user-model.md` - User data model
- `/docs/skills/gamification-system.md` - Points system

---

## Questions for Product

1. Should we show schools with 0 users on the list view, or hide them?
2. What's the minimum N for showing competitor overlap? (Currently spec'd as 50 in both schools)
3. Should platform summary stats be available even without clicking into a school?
