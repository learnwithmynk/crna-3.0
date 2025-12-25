# Canonical User Data Model

**The CRNA Club - Complete Data & Insights Reference**

This document maps ALL user data organized by:
1. User journey stage (what matters when)
2. Data category (the 10 domains of user data)
3. Insights catalog (every possible nudge/prompt)

Use this to understand what data powers what features before writing any code.

---

## Part 1: Data by User Stage

### Stage: Exploring (12+ months out)

**User mindset:** "Is CRNA right for me? What do I need?"

**Data we have at this stage:**
| Data Point | Source | Mock File |
|------------|--------|-----------|
| Basic profile (name, email, avatar) | WordPress | `mockUser.js` |
| ICU type | WordPress | `mockClinicalProfile.primaryIcuType` |
| Years of experience | WordPress | `mockClinicalProfile.totalYearsExperience` |
| Current stage (self-reported) | WordPress | `mockUser.currentStage` |
| Basic GPA (if entered) | WordPress | `mockAcademicProfile.overallGpa` |
| Subscription tier | WordPress | `mockUser.subscriptionTier` |
| Gamification (points, level) | WordPress | `mockUser.points`, `mockUser.level` |

**Insights relevant to this stage:**
| Insight | Trigger | Data Required | Built? |
|---------|---------|---------------|--------|
| "Based on your MICU experience, here are programs that accept it" | Has ICU type | `primaryIcuType`, programs database | ❌ |
| "Your GPA is above/below average for accepted students" | Has GPA | `overallGpa`, benchmarks | ❌ |
| "Most members at your stage focus on Milestones 1-3" | currentStage = exploring | `currentStage`, aggregate data | ❌ |
| "Start with these LearnDash lessons" | New user | `milestones_completed` | ❌ |
| "Welcome! Complete your profile to get personalized insights" | Profile incomplete | Profile completeness check | ⚠️ Onboarding widget |

**Milestones relevant:** 1 (Understand Profession), 2 (Critical Care), 3 (GPA + Prerequisites), 4 (Explore Programs)

---

### Stage: Planning (6-12 months out)

**User mindset:** "What do I need to do to be ready? Am I on track?"

**Data we have at this stage:**
| Data Point | Source | Mock File |
|------------|--------|-----------|
| Everything from Exploring | — | — |
| Detailed academic profile | WordPress/Analyzer | `mockAcademicProfile` (all fields) |
| GRE scores | WordPress | `mockAcademicProfile.gre*` |
| Completed prerequisites | WordPress | `mockAcademicProfile.completedPrerequisites[]` |
| Certifications (CCRN, etc.) | WordPress | `mockClinicalProfile.certifications[]` |
| Clinical tracker entries | Supabase | `mockClinicalEntries[]` |
| Shadow day entries | Supabase | `mockShadowDays[]` |
| EQ reflection entries | Supabase | `mockEQReflections[]` |
| Target programs (0-5 typically) | Supabase | `mockTargetPrograms[]` |
| Saved programs | Supabase | `mockSavedPrograms[]` |
| Milestone progress | WordPress | `mockMilestones[].completed` |
| Events logged | Supabase | `mockTrackedEvents[]` |

**Insights relevant to this stage:**
| Insight | Trigger | Data Required | Built? |
|---------|---------|---------------|--------|
| **ReadyScore (0-100)** | Has academic + clinical data | academic, clinical, shadow, materials, events | ✅ `readinessCalculator.js` |
| Weekly Focus recommendation | weakest component < 50 | ReadyScore components | ✅ `generateWeeklyFocus()` |
| "You're missing Organic Chem - 80% of targets require it" | Prereq gap vs targets | `completedPrerequisites`, `targetPrograms[].requirements` | ❌ |
| "Your shadow hours (12) are below the 24-hour goal" | shadowHours < 24 | `mockTrackerStats.shadow.totalHours` | ✅ ReadyScore |
| "72% of CVICU nurses log Impella - do you have access?" | Peer gap | `clinicalEntries`, peer aggregates, `unitType` | ✅ `smartSuggestions.js` |
| "Great! You have ECMO experience - only 35% of peers do" | Rare strength | `clinicalEntries`, peer aggregates | ✅ `generateStrengths()` |
| "3 of your targets have deadlines in 60 days" | Deadline < 60 days | `targetPrograms[].applicationDeadline` | ❌ |
| "Your CCRN expires in 90 days" | expiresDate < 90 days | `certifications[].expiresDate` | ❌ |
| "Log a clinical entry to maintain your 7-day streak" | Streak > 3, no log today | `trackerStats.clinical.streak`, last entry date | ❌ |

**Milestones relevant:** 3-10 (GPA through Shadowing)

---

### Stage: Actively Applying (< 6 months, applying_now)

**User mindset:** "Am I competitive? What's left to do? Don't let me miss deadlines!"

**Data we have at this stage:**
| Data Point | Source | Mock File |
|------------|--------|-----------|
| Everything from Planning | — | — |
| Complete academic profile | WordPress | `mockAcademicProfile` (all fields filled) |
| Full clinical experience log | Supabase | `mockClinicalEntries[]` (many entries) |
| Target programs with checklists | Supabase | `mockTargetPrograms[].targetData.checklist[]` |
| LOR tracking per program | Supabase | `mockTargetPrograms[].targetData.lor[]` |
| Documents per program | Supabase | `mockTargetPrograms[].targetData.documents[]` |
| Application status per program | Supabase | `mockTargetPrograms[].targetData.status` |
| Tasks per program | Supabase | `mockTasks[]` |
| Event attendance | Supabase | `mockTrackedEvents[]` |

**Insights relevant to this stage:**
| Insight | Trigger | Data Required | Built? |
|---------|---------|---------------|--------|
| "Your ReadyScore is 72 - Strong" | Always | ReadyScore calculation | ✅ |
| "Georgetown deadline is in 14 days - you have 3 incomplete items" | Deadline < 30 days AND incomplete checklist | `applicationDeadline`, `checklist[]` | ❌ |
| "2 applications are missing personal statements" | doc type missing | `documents[]` per program | ❌ |
| "You haven't logged a shadow day in 30 days" | lastShadowDate > 30 days | `shadowDays[]` dates | ❌ |
| "LOR from Dr. Smith is still pending" | LOR status = requested, > 14 days | `lor[].status`, `lor[].requestedDate` | ❌ |
| "Task overdue: Essay Final Draft was due 3 days ago" | task.dueDate < today | `mockTasks[].dueDate` | ❌ |
| "Cedar Crest doesn't require GRE - skip those checklist items" | Program-specific | `program.requirements.gre` | ⚠️ Checklist taxonomy |
| "Prepare for Georgetown interview - common questions" | status = submitted | `targetData.status` | ❌ |

**Milestones relevant:** 11-13 (Personal Statement, LORs, Interview Prep)

---

### Stage: Submitted / Waiting

**User mindset:** "What can I do while I wait? How do I prepare for interviews?"

**Data we have at this stage:**
| Data Point | Source | Mock File |
|------------|--------|-----------|
| Everything from Applying | — | — |
| Submission dates per program | Supabase | `targetData.submittedDate` |
| Interview invites/dates | Supabase | `targetData.interviewDate` (not in mock yet) |
| Application outcome | Supabase | `targetData.outcome` |

**Insights relevant to this stage:**
| Insight | Trigger | Data Required | Built? |
|---------|---------|---------------|--------|
| "Interview at Georgetown in 7 days - prep resources" | interviewDate < 14 days | `targetData.interviewDate` | ❌ |
| "Keep logging clinical - it helps if waitlisted" | status = submitted | `targetData.status` | ❌ |
| "Connect with SRNAs from Georgetown in the marketplace" | Has target | `targetPrograms`, marketplace providers | ❌ |
| "You were accepted! Share your journey in the community" | outcome = accepted | `targetData.outcome` | ❌ |
| "Waitlisted at Duke - here's what others did" | outcome = waitlisted | `targetData.outcome` | ❌ |

---

### Stage: Accepted / Enrolled

**User mindset:** "I made it! How can I help others?"

**Data we have at this stage:**
| Data Point | Source | Mock File |
|------------|--------|-----------|
| Acceptance details | Supabase | `targetData.outcome = 'accepted'` |
| Program they're attending | Supabase | `targetPrograms[]` where accepted |
| Historical application data | All above | — |

**Insights relevant to this stage:**
| Insight | Trigger | Data Required | Built? |
|---------|---------|---------------|--------|
| "Become a mentor - help the next generation" | outcome = accepted | `targetData.outcome` | ❌ |
| "Apply to be a marketplace provider" | currentStage = accepted | `currentStage` | ❌ |
| "Share your acceptance story in the forum" | outcome = accepted | `targetData.outcome` | ❌ |

---

## Part 2: Complete Data Catalog (11 Categories)

### Category 1: Identity & Profile

| Field | Type | Source | Relevant Stages | Powers | Mock Location |
|-------|------|--------|-----------------|--------|---------------|
| `id` | string | WP | All | Auth, all queries | `mockUser.id` |
| `email` | string | WP | All | Auth, notifications | `mockUser.email` |
| `name` | string | WP | All | UI display | `mockUser.name` |
| `preferredName` | string | WP | All | UI personalization | `mockUser.preferredName` |
| `avatarUrl` | string | WP | All | UI display | `mockUser.avatarUrl` |
| ~~`currentStage`~~ | ~~enum~~ | — | — | **MOVED to Category 12 as `applicationStage`** | — |
| `programStatus` | enum | WP | Planning+ | Dashboard state | `mockUser.programStatus` |
| `subscriptionTier` | enum | WP | All | Access control | `mockUser.subscriptionTier` |
| `subscriptionStatus` | enum | WP | All | Access control | `mockUser.subscriptionStatus` |
| `trialEndsAt` | datetime | WP | Trial users | Trial countdown | `mockUser.trialEndsAt` |

**Note:** `currentStage` has been moved to Category 12 as `applicationStage`. See Category 12: Guidance & Focus State.

---

### Category 2: Academic Profile

| Field | Type | Source | Relevant Stages | Powers | Mock Location |
|-------|------|--------|-----------------|--------|---------------|
| `overallGpa` | decimal | WP/Analyzer | Planning+ | ReadyScore (25%), eligibility | `mockAcademicProfile.overallGpa` |
| `scienceGpa` | decimal | WP/Analyzer | Planning+ | ReadyScore (25%), eligibility | `mockAcademicProfile.scienceGpa` |
| `scienceGpaWithForgiveness` | decimal | Analyzer | Planning+ | Grade forgiveness display | `mockAcademicProfile.scienceGpaWithForgiveness` |
| `last60Gpa` | decimal | Analyzer | Planning+ | Some programs require | `mockAcademicProfile.last60Gpa` |
| `gpaCalculated` | boolean | WP | Planning+ | Show "use analyzer" prompt | `mockAcademicProfile.gpaCalculated` |
| `greQuantitative` | int (130-170) | WP | Applying | Eligibility check | `mockAcademicProfile.greQuantitative` |
| `greVerbal` | int (130-170) | WP | Applying | Eligibility check | `mockAcademicProfile.greVerbal` |
| `greAnalyticalWriting` | decimal (0-6) | WP | Applying | Eligibility check | `mockAcademicProfile.greAnalyticalWriting` |
| `greCombined` | int | Computed | Applying | Quick reference | `mockAcademicProfile.greCombined` |
| `completedPrerequisites` | array | WP | Planning+ | Gap analysis, suggestions | `mockAcademicProfile.completedPrerequisites[]` |

**completedPrerequisites array shape:**
```javascript
{ courseType: 'anatomy', year: 2015, grade: 'B', schoolName: 'ASU' }
```

**courseType enum:** `anatomy`, `physiology`, `physics`, `biochemistry`, `organic_chemistry`, `general_chemistry`, `pathophysiology`, `pharmacology`, `microbiology`, `research`, `statistics`

---

### Category 3: Clinical Profile

| Field | Type | Source | Relevant Stages | Powers | Mock Location |
|-------|------|--------|-----------------|--------|---------------|
| `primaryIcuType` | enum | WP | All | Peer comparison, program match | `mockClinicalProfile.primaryIcuType` |
| `additionalIcuTypes` | array | WP | All | Breadth of experience | `mockClinicalProfile.additionalIcuTypes[]` |
| `totalYearsExperience` | decimal | WP | Planning+ | Eligibility check | `mockClinicalProfile.totalYearsExperience` |
| `certifications` | array | WP | Planning+ | Eligibility, expiration alerts | `mockClinicalProfile.certifications[]` |

**primaryIcuType enum:** `micu`, `sicu`, `cvicu`, `cticu`, `neuro_icu`, `trauma_icu`, `burn_icu`, `picu`, `nicu`, `mixed`, `flight_nurse`, `other`

**certifications array shape:**
```javascript
{
  type: 'ccrn',           // ccrn, bls, acls, pals, etc.
  status: 'passed',       // passed, scheduled, studying, not_started
  earnedDate: '2023-05-15T00:00:00Z',
  expiresDate: '2026-05-15T00:00:00Z'
}
```

---

### Category 4: Program Preferences

**Purpose:** Explicit user preferences for program matching & filtering.
**Source:** User input (onboarding wizard, preferences page)
**Storage:** WordPress user meta OR Supabase user_preferences table

| Field | Type | Description | Powers | Mock Location |
|-------|------|-------------|--------|---------------|
| `preferredRegions` | array | ['northeast', 'midwest', 'southeast', 'southwest', 'west'] | Program filtering, recommendations | `mockUserPreferences.preferredRegions` |
| `preferredStates` | array | ['CA', 'NY', 'TX', ...] | Program filtering | `mockUserPreferences.preferredStates` |
| `maxTuition` | number | Maximum tuition budget ($) | Program filtering | `mockUserPreferences.maxTuition` |
| `willingToRelocate` | boolean | Open to moving anywhere | Expands recommendations | `mockUserPreferences.willingToRelocate` |
| `programTypePreference` | enum | 'front_loaded', 'integrated', 'no_preference' | Program filtering | `mockUserPreferences.programTypePreference` |
| `degreePreference` | enum | 'dnp', 'dnap', 'no_preference' | Program filtering | `mockUserPreferences.degreePreference` |
| `avoidGre` | boolean | Prefer programs without GRE | Program filtering | `mockUserPreferences.avoidGre` |
| `preferOnlineHybrid` | boolean | Prefer distance/hybrid options | Program filtering | `mockUserPreferences.preferOnlineHybrid` |
| `classSizePreference` | enum | 'small' (<20), 'medium' (20-40), 'large' (>40), 'no_preference' | Program filtering | `mockUserPreferences.classSizePreference` |
| `militaryInterest` | boolean | Interested in military programs | Include military options | `mockUserPreferences.militaryInterest` |
| `startYearPreference` | number | Target year to start (2025, 2026, etc.) | Timeline planning | `mockUserPreferences.startYearPreference` |
| `startTermPreference` | enum | 'fall', 'spring', 'summer', 'any' | Program matching | `mockUserPreferences.startTermPreference` |

**Insights powered by this data:**
- "Based on your preferences, here are 12 programs that match"
- "You prefer no-GRE programs - here are 45 options"
- "Programs in your preferred states with deadlines this year"
- "These programs fit your $100k budget"

---

### Category 5: School Search Behavior

**Purpose:** Implicit preferences inferred from user behavior. Powers "Similar users also viewed" and personalization.
**Source:** Analytics/tracking (client-side events)
**Storage:** Supabase user_behavior table or analytics platform

| Field | Type | Description | Powers | Mock Location |
|-------|------|-------------|--------|---------------|
| `programsViewed` | array | [{ programId, viewedAt, dwellTimeMs }] | "Recently viewed", recommendations | `mockSearchBehavior.programsViewed` |
| `programsCompared` | array | [{ programIds[], comparedAt }] | "Compare again" suggestions | `mockSearchBehavior.programsCompared` |
| `searchQueries` | array | [{ query, filters, resultsCount, timestamp }] | Search optimization | `mockSearchBehavior.searchQueries` |
| `filtersUsed` | object | { gre: 5, tuition: 3, state: 8, ... } (counts) | Preference inference | `mockSearchBehavior.filtersUsed` |
| `sortPreference` | string | Last used sort ('deadline', 'gpa', 'tuition') | Default sort | `mockSearchBehavior.sortPreference` |
| `viewedSchoolPages` | array | [{ schoolId, sectionsViewed[], timestamp }] | Content personalization | `mockSearchBehavior.viewedSchoolPages` |
| `downloadedResources` | array | [{ resourceId, resourceType, timestamp }] | Content recommendations | `mockSearchBehavior.downloadedResources` |
| `clickedDeadlines` | array | [{ programId, timestamp }] | Deadline importance signal | `mockSearchBehavior.clickedDeadlines` |
| `timeOnSchoolDatabase` | number | Total seconds on school search | Engagement metric | `mockSearchBehavior.timeOnSchoolDatabase` |
| `searchSessionCount` | number | How many search sessions | Engagement metric | `mockSearchBehavior.searchSessionCount` |
| `programsSaved` | array | Direct user action to save | Direct signal | ✅ `mockSavedPrograms[]` |

**Insights powered by this data:**
- "Users who viewed Georgetown also viewed Duke"
- "Based on your searches, you might like these programs"
- "You've viewed Cedar Crest 5 times - ready to save it?"
- "Continue your research: Georgetown, Duke, Rush"

---

### Category 6: Target Program Data

| Field | Type | Source | Relevant Stages | Powers | Mock Location |
|-------|------|--------|-----------------|--------|---------------|
| `targetPrograms` | array | Supabase | Planning+ | ReadyScore, deadline alerts | `mockTargetPrograms[]` |

**targetPrograms array shape:**
```javascript
{
  id: 'saved_001',
  programId: 'school_001',
  program: { /* CrnaProgram object */ },
  isTarget: true,
  savedAt: '2024-08-20T00:00:00Z',
  targetData: {
    status: 'submitted',  // researching, preparing, applying, submitted, interview_invited, interviewed, waitlisted, accepted, denied
    submittedDate: '2024-10-14T00:00:00Z',
    interviewDate: null,
    outcomeDate: null,
    outcome: null,  // accepted, waitlisted, denied
    notes: 'Strong program...',
    progress: 75,  // checklist completion %
    verifiedRequirements: true,
    checklist: [{ id, label, completed, isDefault, excludesTaxonomy }],
    lor: [{ id, personName, relationship, email, status, requestedDate, receivedDate }],
    documents: [{ id, name, type, uploadedAt, size }]
  }
}
```

**status enum:** (defined in `src/lib/enums.js` as PROGRAM_STATUSES)
- `not_started` - Not Started
- `in_progress` - In Progress
- `submitted` - Submitted
- `interview_invite` - Interview Invited
- `interview_complete` - Interview Complete
- `waitlisted` - Waitlisted
- `denied` - Denied
- `accepted` - Accepted

---

### Category 7: Tracker Data (Clinical, EQ, Shadow, Events)

#### Clinical Entries

| Field | Type | Source | Powers | Mock Location |
|-------|------|--------|--------|---------------|
| `clinicalEntries` | array | Supabase | Acuity score, peer comparison | `mockClinicalEntries[]` |

**Entry shape:** See `mockClinicalEntries.js` - includes medications, devices, procedures, patient populations, notes, highlight moments.

#### EQ Reflections

| Field | Type | Source | Powers | Mock Location |
|-------|------|--------|--------|---------------|
| `eqReflections` | array | Supabase | Interview prep, self-awareness | `mockEQReflections[]` |

**Entry shape:** `{ id, date, title, reflection, categories[] }`

#### Shadow Days

| Field | Type | Source | Powers | Mock Location |
|-------|------|--------|--------|---------------|
| `shadowDays` | array | Supabase | ReadyScore (20%), requirements | `mockShadowDays[]` |

**Entry shape:** `{ id, date, location, providerName, hoursLogged, casesObserved, skillsObserved[], notes }`

#### Tracked Events

| Field | Type | Source | Powers | Mock Location |
|-------|------|--------|--------|---------------|
| `trackedEvents` | array | Supabase | ReadyScore (15%), engagement | `mockTrackedEvents[]` |

**Entry shape:** `{ id, title, date, category, location, notes }`

---

### Category 8: Tracker Stats (Cached/Computed)

| Field | Type | Source | Powers | Mock Location |
|-------|------|--------|--------|---------------|
| `clinical.streak` | int | Computed | Streak alerts | `mockTrackerStats.clinical.streak` |
| `clinical.totalLogs` | int | Computed | Badge progress | `mockTrackerStats.clinical.totalLogs` |
| `clinical.populations` | int | Computed | Diversity display | `mockTrackerStats.clinical.populations` |
| `clinical.devices` | int | Computed | Experience breadth | `mockTrackerStats.clinical.devices` |
| `clinical.procedures` | int | Computed | Experience breadth | `mockTrackerStats.clinical.procedures` |
| `eq.streak` | int | Computed | Streak alerts | `mockTrackerStats.eq.streak` |
| `eq.totalLogs` | int | Computed | Badge progress | `mockTrackerStats.eq.totalLogs` |
| `shadow.totalHours` | int | Computed | ReadyScore, goal progress | `mockTrackerStats.shadow.totalHours` |
| `shadow.casesObserved` | int | Computed | Experience display | `mockTrackerStats.shadow.casesObserved` |
| `events.totalLogged` | int | Computed | ReadyScore | `mockTrackerStats.events.totalLogged` |

---

### Category 9: Milestone Progress

| Field | Type | Source | Powers | Mock Location |
|-------|------|--------|--------|---------------|
| `milestones` | array | WP | Progress display, nudges | `mockMilestones[]` |

**Milestone shape:**
```javascript
{
  id: 1,
  title: 'Understand the Profession + Early Prep',
  description: '...',
  completed: false,
  order: 1,
  icon: 'GraduationCap',
  subItems: [{ id, label, completed, resources[] }],
  metaFields: []
}
```

**13 Milestones:**
1. Understand the Profession + Early Prep
2. Critical Care Experience
3. GPA + Prerequisites
4. Explore CRNA Programs
5. Resume/CV
6. Anesthesia Events + Networking
7. Leadership + Community Involvement
8. Certifications
9. GRE
10. Shadowing
11. Personal Statement
12. Letters of Recommendation
13. Interview Preparation

---

### Category 10: Gamification

| Field | Type | Source | Powers | Mock Location |
|-------|------|--------|--------|---------------|
| `points` | int | WP (Gamplify) | Level calculation, leaderboard | `mockUser.points` |
| `level` | int (1-6) | Computed | Level badge display | `mockUser.level` |
| `levelName` | string | Computed | UI display | `mockUser.levelName` |
| `badges` | array | WP (Gamplify) | Achievement display | `mockUser.badges[]` |

**Levels:**
| Level | Name | Points Required |
|-------|------|-----------------|
| 1 | Aspiring Applicant | 0 |
| 2 | Dedicated Dreamer | 200 |
| 3 | Ambitious Achiever | 600 |
| 4 | Committed Candidate | 1000 |
| 5 | Goal Crusher | 1600 |
| 6 | Peak Performer | 2000 |

**Badges:** `Target Trailblazer`, `Critical Care Crusher`, `Top Contributor`, `Feedback Champion`, `Lesson Legend`, `Milestone Machine`

---

### Category 10B: Resume Boosters

| Field | Type | Source | Powers | Mock Location |
|-------|------|--------|--------|---------------|
| `researchDetails` | text | WP/Supabase | Interview prep, profile completeness | `mockUser.resumeBoosters.research` |
| `committeeDetails` | text | WP/Supabase | Interview prep, leadership evidence | `mockUser.resumeBoosters.committee` |
| `volunteeringDetails` | text | WP/Supabase | Interview prep, well-roundedness | `mockUser.resumeBoosters.volunteering` |
| `leadershipDetails` | text | WP/Supabase | Interview prep, leadership evidence | `mockUser.resumeBoosters.leadership` |

**Used for:**
- MyStats "Resume Boosters" section
- Interview prep talking points
- Profile completeness calculation

---

### Category 11: System Metadata

| Field | Type | Source | Powers | Mock Location |
|-------|------|--------|--------|---------------|
| `createdAt` | datetime | WP | Account age | `mockUser.createdAt` |
| `lastLoginAt` | datetime | WP | Inactivity nudges | `mockUser.lastLoginAt` |
| `onboardingCompletedAt` | datetime | WP | Onboarding flow | `mockUser.onboardingCompletedAt` |

---

## Part 3: Insights Catalog

### Readiness Insights (ReadyScore Engine)

**File:** `src/lib/readinessCalculator.js`

| Insight | Trigger Condition | Data Required | Stage | Built? |
|---------|-------------------|---------------|-------|--------|
| Overall ReadyScore (0-100) | Has any academic/clinical data | academicProfile, clinicalAcuityScore, shadowStats, materials, events | Planning+ | ✅ |
| Academic component score | Has GPA data | scienceGpa, overallGpa, completedPrerequisites | Planning+ | ✅ |
| Clinical component score | Has clinical entries | clinicalEntries, acuityScore | Planning+ | ✅ |
| Shadowing component score | Has shadow data | totalHours, totalDays, uniqueCRNAs | Planning+ | ✅ |
| Materials component score | Has target programs | checklist completion % | Applying | ✅ |
| Engagement component score | Has events logged | totalLogged, programsEngaged | Planning+ | ✅ |
| Weekly Focus recommendation | Weakest component < 50 | All ReadyScore components | Planning+ | ✅ |
| "Log X more shadow hours" | shadowHours < 24 | shadowStats.totalHours | Planning+ | ✅ |

---

### Peer Comparison Insights (Smart Suggestions Engine)

**File:** `src/lib/smartSuggestions.js`

| Insight | Trigger Condition | Data Required | Stage | Built? |
|---------|-------------------|---------------|-------|--------|
| Missing common medication | peer% > 60, user hasn't logged | clinicalEntries, unitType, peerAggregates | Planning+ | ✅ |
| Missing common device | peer% > 50, user hasn't logged | clinicalEntries, unitType, peerAggregates | Planning+ | ✅ |
| Missing common procedure | peer% > 50, user hasn't logged | clinicalEntries, unitType, peerAggregates | Planning+ | ✅ |
| Rare strength | User has, peer% < 50 | clinicalEntries, unitType, peerAggregates | Planning+ | ✅ |
| Monthly goal suggestion | Gaps exist | clinicalEntries, gaps | Planning+ | ✅ |
| Coverage stats (med/device/proc %) | Always | clinicalEntries, peerAggregates | Planning+ | ✅ |

---

### Deadline Insights (NOT YET BUILT)

| Insight | Trigger Condition | Data Required | Stage | Built? |
|---------|-------------------|---------------|-------|--------|
| "Deadline in 30 days" | deadline < 30 days | targetPrograms[].applicationDeadline | Applying | ❌ |
| "Deadline in 14 days - urgent" | deadline < 14 days | targetPrograms[].applicationDeadline | Applying | ❌ |
| "Deadline passed" | deadline < today | targetPrograms[].applicationDeadline | Applying | ❌ |
| "Application incomplete, deadline soon" | deadline < 14 days AND checklist incomplete | deadline, checklist[] | Applying | ❌ |
| "Task overdue" | task.dueDate < today | mockTasks[].dueDate | Applying | ❌ |

**Implementation notes:** Simple date comparison. Needs current date vs deadline calculation.

---

### Certification Insights (NOT YET BUILT)

| Insight | Trigger Condition | Data Required | Stage | Built? |
|---------|-------------------|---------------|-------|--------|
| "CCRN expires in 60 days" | expiresDate < 60 days | certifications[].expiresDate | Planning+ | ❌ |
| "CCRN expires in 30 days - renew now" | expiresDate < 30 days | certifications[].expiresDate | Planning+ | ❌ |
| "Your targets require CCRN" | targets require, user doesn't have | targetPrograms[].requirements.ccrn, certifications[] | Planning+ | ❌ |
| "BLS/ACLS expiring" | expiresDate < 60 days | certifications[] | All | ❌ |

**Implementation notes:** Loop through certifications, compare expiresDate to today.

---

### Prerequisite Gap Insights (NOT YET BUILT)

| Insight | Trigger Condition | Data Required | Stage | Built? |
|---------|-------------------|---------------|-------|--------|
| "Missing Organic Chem - 80% of targets require" | Gap vs target requirements | completedPrerequisites, targetPrograms[].requirements.prerequisites | Planning+ | ❌ |
| "Your Anatomy is 10+ years old - some programs expire prereqs" | prereq.year < (today - 10) | completedPrerequisites[].year | Planning+ | ❌ |
| "Consider retaking Chemistry (grade: C)" | grade < B | completedPrerequisites[].grade | Planning+ | ❌ |

**Implementation notes:** Compare completedPrerequisites to union of targetPrograms requirements.

---

### LOR Insights (NOT YET BUILT)

| Insight | Trigger Condition | Data Required | Stage | Built? |
|---------|-------------------|---------------|-------|--------|
| "LOR from Dr. Smith pending for 14+ days" | status = requested, requestedDate > 14 days ago | lor[].status, lor[].requestedDate | Applying | ❌ |
| "Georgetown needs 3 LORs, you have 2" | lor.length < program.numberOfReferences | lor[], program.numberOfReferences | Applying | ❌ |
| "Send reminder to Dr. Johnson" | status = requested, > 21 days | lor[].status, lor[].requestedDate | Applying | ❌ |

---

### Engagement Insights (NOT YET BUILT)

| Insight | Trigger Condition | Data Required | Stage | Built? |
|---------|-------------------|---------------|-------|--------|
| "You haven't logged in 7 days" | lastLoginAt > 7 days | lastLoginAt | All | ❌ |
| "Welcome back! Here's what's new" | lastLoginAt > 14 days | lastLoginAt | All | ❌ |
| "Maintain your 7-day streak!" | streak > 3 AND no log today | trackerStats.streak, last entry date | Planning+ | ❌ |
| "You're on a 10-day streak!" | streak milestone | trackerStats.streak | Planning+ | ❌ |
| "You haven't logged a shadow day in 30 days" | lastShadowDate > 30 days | shadowDays[] dates | Planning+ | ❌ |

---

### Interview Prep Insights (NOT YET BUILT)

| Insight | Trigger Condition | Data Required | Stage | Built? |
|---------|-------------------|---------------|-------|--------|
| "Interview at Georgetown in 7 days" | interviewDate < 7 days | targetData.interviewDate | Submitted | ❌ |
| "Prepare for Georgetown - common questions" | status = interview_invited | targetData.status | Submitted | ❌ |
| "Review your EQ reflections for interview stories" | Has interviews scheduled | targetData.interviewDate, eqReflections[] | Submitted | ❌ |
| "Research Georgetown's clinical sites" | interview < 14 days | targetData.interviewDate, program details | Submitted | ❌ |

---

### Program Match Insights (NOT YET BUILT)

| Insight | Trigger Condition | Data Required | Stage | Built? |
|---------|-------------------|---------------|-------|--------|
| "Based on your GPA, you're competitive at 45 programs" | Has GPA | overallGpa, scienceGpa, programs database | Planning+ | ❌ |
| "Programs that don't require GRE" | avoidGre OR no GRE scores | preferences OR academic, programs database | Planning+ | ❌ |
| "Similar users also saved Duke" | Has saved programs | savedPrograms[], peer data | Planning+ | ❌ |
| "You meet all requirements for Cedar Crest" | Full eligibility check | All academic/clinical, program requirements | Planning+ | ❌ |

---

### Onboarding Insights (PARTIALLY BUILT)

| Insight | Trigger Condition | Data Required | Stage | Built? |
|---------|-------------------|---------------|-------|--------|
| "Complete your profile" | Profile incomplete | Profile fields | Exploring | ⚠️ Onboarding widget |
| "Save your first program" | programsSaved.length = 0 | savedPrograms[] | Exploring | ⚠️ Empty state CTA |
| "Log your first clinical entry" | clinicalEntries.length = 0 | clinicalEntries[] | Planning | ⚠️ Empty state CTA |
| "Convert a saved program to target" | hasSaved, !hasTarget | savedPrograms[], targetPrograms[] | Planning | ⚠️ UI nudge |

---

## Part 4: Smart Insight Engine I/O (Technical Reference)

This section documents what each engine reads and writes. This is the technical contract for building new insights.

### Existing Engines

#### readinessCalculator.js

**Input:**
```javascript
{
  academicProfile: { scienceGpa, overallGpa, greQuantitative, greVerbal, greAnalyticalWriting, completedPrerequisites },
  clinicalAcuityScore: number (0-100),
  shadowStats: { totalHours, totalDays, uniqueCRNAs },
  applicationMaterials: { items: [{ status: 'completed'|'in_progress'|'not_started' }] },
  eventStats: { totalLogged, programsEngaged },
  targetProgramCount: number
}
```

**Output:**
```javascript
{
  totalScore: number (0-100),
  readinessLevel: { level, label, color, description },
  components: { academic, clinical, shadowing, materials, engagement },
  componentScores: [{ key, label, score }],
  strongest: { key, label, score },
  weakest: { key, label, score },
  focusArea: { key, label, score } | null
}
```

#### smartSuggestions.js

**Input:**
```javascript
entries: [{ medications, devices, procedures }],
unitType: 'micu' | 'cvicu' | 'sicu' | etc.
```

**Output:**
```javascript
[
  {
    type: 'missing_common' | 'rare_strength' | 'goal_suggestion',
    category: 'medication' | 'device' | 'procedure',
    itemId: string,
    item: { id, label, category, tier },
    percentage: number,
    message: string,
    priority: number
  }
]
```

---

### Planned Engines (NOT YET BUILT)

#### deadlineAlertEngine.js

**Purpose:** Surface deadline-related alerts and urgency indicators.

**Input:**
```javascript
{
  targetPrograms: [{ id, program, applicationDeadline, checklist }],
  today: Date
}
```

**Output:**
```javascript
[
  {
    programId: string,
    programName: string,
    deadline: Date,
    daysRemaining: number,
    urgency: 'overdue' | 'critical' | 'urgent' | 'approaching' | 'safe',
    incompleteItems: [{ id, label }]
  }
]
```

**Urgency Triggers:**
- `overdue`: deadline < today
- `critical`: < 7 days remaining
- `urgent`: < 14 days remaining
- `approaching`: < 30 days remaining
- `safe`: 30+ days remaining

**Used by:** Dashboard alerts, Notification system, Target Program cards

---

#### certificationAlertEngine.js

**Purpose:** Track certification status and expiration warnings.

**Input:**
```javascript
{
  certifications: [{ type, status, earnedDate, expiresDate }],
  targetPrograms: [{ requirements: { ccrn, bls, acls, pals } }],
  today: Date
}
```

**Output:**
```javascript
[
  {
    certType: string,
    status: 'valid' | 'expiring_soon' | 'expired' | 'missing',
    expiresDate: Date | null,
    daysRemaining: number | null,
    requiredByPrograms: [{ programId, programName }]
  }
]
```

**Triggers:**
- `expired`: expiresDate < today
- `expiring_soon`: expiresDate < 90 days
- `missing`: required by targets but user doesn't have

**Used by:** Dashboard alerts, MyStats certifications section

---

#### prerequisiteGapEngine.js

**Purpose:** Compare user's completed prerequisites against target program requirements.

**Input:**
```javascript
{
  completedPrerequisites: [{ courseType, year, grade, schoolName }],
  targetPrograms: [{ requirements: { prerequisites: [] } }],
  today: Date
}
```

**Output:**
```javascript
{
  missing: [{ courseType, requiredByCount, requiredByPrograms[] }],
  expiringSoon: [{ courseType, year, programsWithExpiration[] }],
  lowGrades: [{ courseType, grade, recommendRetake: boolean }],
  recommendations: [{ type, message, priority }]
}
```

**Used by:** MyStats prereq section, Course suggestions, Gap analysis card

---

#### programMatchEngine.js

**Purpose:** Match user profile against program requirements for eligibility and recommendations.

**Input:**
```javascript
{
  academicProfile: { scienceGpa, overallGpa, gre*, completedPrerequisites },
  clinicalProfile: { primaryIcuType, totalYearsExperience, certifications },
  preferences: { /* Category 4 fields */ },
  programsDatabase: [{ requirements, tuition, location, ... }]
}
```

**Output:**
```javascript
{
  matchingPrograms: [{ programId, matchScore, eligibilityDetails }],
  eligibilityDetails: [{ field, userValue, requirement, meets: boolean }],
  recommendations: [{ programId, reason, matchScore }]
}
```

**Used by:** School Database filtering, Program recommendations widget

---

#### engagementNudgeEngine.js

**Purpose:** Generate engagement nudges based on user activity patterns.

**Input:**
```javascript
{
  lastLoginAt: Date,
  trackerStats: { clinical: { streak, lastEntry }, eq: { streak }, shadow: { lastEntry } },
  activityLog: [{ type, timestamp }],
  today: Date
}
```

**Output:**
```javascript
[
  {
    type: 'inactivity' | 'streak_at_risk' | 'streak_milestone' | 'welcome_back' | 'logging_reminder',
    message: string,
    action: { label, href },
    priority: number
  }
]
```

**Types:**
- `inactivity`: No login in 7+ days
- `streak_at_risk`: Active streak but no log today
- `streak_milestone`: Hit 7, 14, 30 day streak
- `welcome_back`: Returning after 14+ days
- `logging_reminder`: Specific tracker hasn't been updated in X days

**Used by:** Dashboard nudges, Email triggers, Push notifications

---

## Part 5: Activity Log & Engagement Data

### Category 9B: Activity Log & Engagement

**Purpose:** Track what the user does in the platform for nudges, analytics, and personalization.
**Source:** Client-side events → Supabase
**Storage:** Supabase activity_log table

| Field | Type | Description | Powers | Mock Location |
|-------|------|-------------|--------|---------------|
| `activityLog` | array | All user actions with timestamps | Activity feed, analytics | `mockActivityLog.entries` |
| `lastLoginAt` | datetime | Most recent login | Inactivity nudges | `mockUser.lastLoginAt` |
| `loginStreak` | number | Consecutive days logged in | Engagement gamification | `mockActivityLog.loginStreak` |
| `totalLogins` | number | Lifetime login count | Engagement metric | `mockActivityLog.totalLogins` |
| `lastClinicalEntry` | datetime | Last clinical log | "Log your shift" nudge | Computed from `mockClinicalEntries` |
| `lastShadowEntry` | datetime | Last shadow log | "Schedule shadow day" nudge | Computed from `mockShadowDays` |
| `lastEqEntry` | datetime | Last EQ reflection | "Reflect on your week" nudge | Computed from `mockEQReflections` |
| `lastEventLogged` | datetime | Last event logged | Event engagement | Computed from `mockTrackedEvents` |
| `lessonsCompleted` | array | LearnDash lesson IDs completed | Learning progress | `mockActivityLog.lessonsCompleted` |
| `lastLessonAt` | datetime | Last lesson completed | "Continue learning" nudge | `mockActivityLog.lastLessonAt` |
| `forumPostCount` | number | Total forum posts | Community engagement | `mockActivityLog.forumPostCount` |
| `forumLastPostAt` | datetime | Last forum activity | Community nudge | `mockActivityLog.forumLastPostAt` |
| `marketplaceBookings` | number | Total bookings made | Marketplace engagement | `mockActivityLog.marketplaceBookings` |
| `feedbackSubmissions` | number | Feedback forms submitted | Badge progress | `mockActivityLog.feedbackSubmissions` |

**Activity Log Entry Shape:**
```javascript
{
  id: 'activity_001',
  userId: 'user_123',
  type: 'clinical_entry' | 'shadow_entry' | 'program_saved' | 'lesson_completed' | 'forum_post' | 'milestone_completed' | 'badge_earned' | 'booking_made',
  timestamp: '2025-11-28T08:00:00Z',
  metadata: { /* type-specific data */ },
  pointsEarned: 2
}
```

**Insights powered by this data:**
- "You haven't logged in 7 days - here's what you missed"
- "You're on a 10-day streak! Keep it going"
- "You haven't logged a clinical entry in 14 days"
- "Continue where you left off: Milestone 5"
- "Your activity this month: 12 entries, 2 shadow days, 3 lessons"

---

### Category 12: Guidance & Focus State

**Purpose:** System-computed fields that power personalized guidance, Smart Prompts, and future AI features. These fields are the output of the **Guidance Engine** - a deterministic, rules-based system that reads user data and outputs guidance state.

**Source:** Guidance Engine computation (rules-based, no AI in v1)
**Storage:** Supabase user_guidance_state table
**Spec:** See `/docs/skills/guidance-engine-spec.md` for full computation rules

| Field | Type | Source | Description | Mock Location |
|-------|------|--------|-------------|---------------|
| `applicationStage` | enum | Computed | Lifecycle stage based on highest program status | `mockUser.guidanceState.applicationStage` |
| `supportMode` | enum | Computed | Guidance style derived from applicationStage | `mockUser.guidanceState.supportMode` |
| `primaryFocusAreas` | array | System/User | Active focus areas (user-completed only) | `mockUser.guidanceState.primaryFocusAreas` |
| `riskSignals` | array | Computed | Active risk/health signals | `mockUser.guidanceState.riskSignals` |
| `nextBestSteps` | array | Computed | 0-3 actionable guidance items | `mockUser.guidanceState.nextBestSteps` |
| `lastComputedAt` | datetime | System | When engine last computed state | `mockUser.guidanceState.lastComputedAt` |

**Key distinction:**
- `applicationStage` = what is happening (lifecycle position, computed from data)
- `supportMode` = how the app should help (guidance style, derived from stage)

**applicationStage enum:** (defined in `src/lib/enums.js` as `APPLICATION_STAGES`)
- `exploring` - Early research, no target programs
- `strategizing` - Has saved/researching programs, building plan
- `executing` - Actively working on applications (any program in_progress or submitted)
- `interviewing` - Interview phase (any program interview_invite or interview_complete)
- `post_decision` - Decision made (any program accepted, waitlisted, or denied)

**Stage Computation Rules:**
- System reads highest-status program from `targetPrograms[]`
- Stage = highest of: accepted/waitlisted/denied → `post_decision`, interview_* → `interviewing`, in_progress/submitted → `executing`, researching → `strategizing`, none → `exploring`

**supportMode enum:** (derived from applicationStage)
- `orientation` - For exploring and post_decision stages (reduce overwhelm, explain structure/next steps)
- `strategy` - For strategizing stage (decision-making, planning)
- `execution` - For executing stage (task completion, deadlines)
- `confidence` - For interviewing stage (reassurance, interview readiness)

**Support Mode Mapping:**
| applicationStage | supportMode |
|------------------|-------------|
| exploring | orientation |
| strategizing | strategy |
| executing | execution |
| interviewing | confidence |
| post_decision | orientation |

> **Note:** `post_decision` maps to `orientation` because users who have received decisions (accepted, waitlisted, denied) need help transitioning to their next phase, not interview confidence.

**riskSignals enum:** (defined in `src/lib/enums.js` as `RISK_SIGNALS`)
- `stagnation` - No meaningful action in 14+ days
- `deadline_pressure` - Nearest deadline <30 days AND checklist <60% complete
- `momentum` - ≥3 meaningful actions in last 7 days (positive signal)

**Risk Signal Thresholds:**
- Empty array = healthy state (user is on track)
- `momentum` is a positive signal indicating good progress

**nextBestSteps array shape:**
```javascript
{
  stepId: 'complete_ccrn',
  action: 'Add CCRN certification',
  whyItMatters: 'Required by all your target programs',
  cta: { label: 'Add Certification', href: '/my-stats/certifications' },
  dismissedAt: null  // null = active, Date = dismissed
}
```

**Step Count Rules:**
- 0 steps = silence/affirmation (user is on track - a valid, positive state)
- 1-3 steps = actionable guidance prioritized by impact

**primaryFocusAreas array shape:**
```javascript
{
  area: 'school_search',  // see enum below
  status: 'active',       // active, secondary, completed
  activatedAt: '2024-09-01T00:00:00Z',
  lastEngagedAt: '2024-10-15T00:00:00Z',
  source: 'behavior'      // system, behavior, user_action
}
```

**source enum (FOCUS_AREA_SOURCES):**
- `system` - System-inferred based on stage or requirements
- `behavior` - Inferred from user behavior (page views, feature usage)
- `user_action` - User explicitly set via UI

**Focus Area Completion Rule:**
- Focus areas can only be marked `completed` by the user, not the system
- System can activate areas and change status between `active` and `secondary`

**area enum (PRIMARY_FOCUS_AREAS):**
- `school_search` - Finding and comparing programs
- `gpa_prereqs` - Academic preparation
- `certifications` - CCRN, BLS, ACLS, etc.
- `shadowing` - Shadow day planning and logging
- `leadership` - Leadership experience documentation
- `resume` - Resume/CV preparation
- `essay` - Personal statement writing
- `interview_prep` - Interview preparation

> **Note:** Networking is intentionally NOT a focus area. It's considered an always-on background activity, not something users "focus on" discretely.

**Insights powered by this data:**
- Personalized dashboard based on `supportMode`
- Smart Prompt eligibility gated by `primaryFocusAreas`
- Risk indicators based on `riskSignals`
- Actionable guidance via `nextBestSteps`

**Removed Fields (v1):**
- ~~`supportModeConfidence`~~ - Removed, no emotional self-report in v1
- ~~`hasApplicationStructure`~~ - Computed on-the-fly: `targetPrograms.length > 0`
- ~~`applicationUrgencyLevel`~~ - Replaced by `riskSignals` (deadline_pressure)
- ~~`lastSupportModeUpdateAt`~~ - Replaced by `lastComputedAt`

---

## Summary: What's Built vs What's Missing

### Built (Ready to Use)
- ✅ ReadyScore calculation (5 components)
- ✅ Weekly focus recommendation
- ✅ Peer comparison suggestions (medications, devices, procedures)
- ✅ Experience gaps and strengths
- ✅ Monthly goal suggestions
- ✅ Coverage stats vs peers

### Data Models Documented (Ready to Implement)
- ✅ Category 4: Program Preferences (12 fields defined)
- ✅ Category 5: School Search Behavior (11 fields defined)
- ✅ Category 9B: Activity Log & Engagement (14 fields defined)
- ✅ Category 12: Guidance & Focus State (7 fields defined)
- ✅ 5 Planned Engines (I/O contracts defined)

### Partially Built (UI exists, logic incomplete)
- ⚠️ Onboarding nudges (widget exists, not all triggers)
- ⚠️ Empty state CTAs (exist but not personalized)
- ⚠️ Checklist taxonomy filtering (exists in data)

### Not Built (High Priority)
- ❌ Deadline alerts (< 30 days, < 14 days, overdue) → `deadlineAlertEngine.js`
- ❌ Certification expiration alerts → `certificationAlertEngine.js`
- ❌ Prerequisite gap analysis vs targets → `prerequisiteGapEngine.js`
- ❌ LOR tracking nudges
- ❌ Task overdue alerts
- ❌ Interview prep nudges

### Not Built (Medium Priority)
- ❌ Streak maintenance nudges → `engagementNudgeEngine.js`
- ❌ Inactivity nudges (7+ days) → `engagementNudgeEngine.js`
- ❌ Shadow day logging reminders → `engagementNudgeEngine.js`

### Not Built (Deferred - Now Documented)
- ❌ Program recommendation engine → `programMatchEngine.js` (Category 4, 5 data model ready)
- ❌ "Similar users" suggestions (needs peer behavior tracking)
- ❌ Predictive readiness ("you'll be ready by...")

---

## Mock Data Files to Create

When ready to implement:

1. **`mockUserPreferences.js`** - Category 4 data
2. **`mockSearchBehavior.js`** - Category 5 data
3. **`mockActivityLog.js`** - Category 9B data (expand existing mockActivity.js)

---

## Next Steps

After reviewing this document:

1. **Prioritize insights** - Which engines do you want built first?
2. **Create mock data** - Generate mockUserPreferences.js, mockSearchBehavior.js, mockActivityLog.js
3. **Build engines** - Start with deadlineAlertEngine.js (high value, low complexity)
4. **Approve hook architecture** - Should we create `useInsightsData()` to centralize?
