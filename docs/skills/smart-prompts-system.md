# Smart Prompts System

Contextual prompts and nudges that help collect user data and guide users through their CRNA application journey.

---

## Overview

Two types of prompts work together:
1. **Inline Prompts** - Appear at natural touchpoints during user interactions
2. **Periodic Nudges** - Appear on dashboard or as notifications based on time/state

### Core Principles

1. **Silent tracking > Asking** - Infer what we can from behavior
2. **Supportive, not anxiety-inducing** - Frame everything positively
3. **Context-aware timing** - Show prompts at natural touchpoints
4. **Dismissible and respectful** - Never re-show dismissed prompts
5. **Thoughtful about what we ask** - Only ask when we truly can't infer
6. **Focus-aware delivery** - Prioritize prompts relevant to user's active focus areas

### Guidance State Integration

Prompts use the **Guidance State** (Category 12 metadata) as the governing layer for eligibility:

**Core Principle:**
- **Guidance State** decides "should we say anything at all"
- **Smart Prompts** decide "what to say, if allowed"

**Hierarchy:** Guidance Engine → Next Best Steps → Smart Prompts

See `/docs/skills/canonical-user-model.md` (Category 12) for field definitions and `/docs/skills/guidance-engine-spec.md` for computation rules.

---

## Guidance-Aware Prompt Gating

### `guidanceEligibility` Schema

Each prompt gains optional eligibility gates that reference `guidanceState`:

```javascript
guidanceEligibility?: {
  allowedApplicationStages?: ApplicationStage[]  // Only show in these stages
  allowedSupportModes?: SupportMode[]            // Only show in these modes
  requiredRiskSignals?: RiskSignal[]             // Must have these signals
  blockedRiskSignals?: RiskSignal[]              // Must NOT have these signals
  requiredFocusAreas?: FocusArea[]               // User must be focused on these
  suppressIfNextBestStepsExist?: boolean         // Hide if guidance is active
}
```

> **Note:** These gates are optional. Most prompts will use 1-2 gates max.

### Global Suppression Rule (Critical)

```
IF guidanceState.nextBestSteps.length > 0
AND prompt.isActionOriented === true
→ DO NOT SHOW PROMPT
```

**Why:** Prevents "do this" overload and establishes clear voice hierarchy.

### Prompt Role Separation

Smart Prompts are now **contextual only**. Primary directives come from Next Best Steps.

| Prompt Type | Allowed? | Notes |
|-------------|----------|-------|
| Requirement clarification | ✅ | "This program requires CCRN" |
| Contextual enrichment | ✅ | "This experience is valuable" |
| Reflection / EQ | ✅ | When emotionally appropriate |
| Reminders | ✅ | Only if not competing with guidance |
| Primary task direction | ❌ | That's Next Best Steps |

### Important Boundary

Smart Prompts must **not**:
- Introduce new primary tasks
- Duplicate milestone-level actions
- Compete with Target Program checklists

Smart Prompts exist to:
- Collect missing data
- Provide contextual clarification
- Encourage reflection or awareness
- Support execution of tasks that already exist elsewhere

### Prompt Category Eligibility Rules

**Requirement Prompts** (CCRN_NEEDED, GRE_NEEDED, PREREQ_GAP):

```javascript
guidanceEligibility: {
  allowedApplicationStages: ['strategizing', 'executing'],
  allowedSupportModes: ['strategy', 'execution'],
  blockedRiskSignals: ['momentum'],
  suppressIfNextBestStepsExist: true
}
```

- ✅ Shown when relevant to current work
- ❌ Suppressed during interview prep
- ❌ Suppressed when user has strong momentum

**Deadline Prompts** (DEADLINE_30, DEADLINE_14, DEADLINE_7):

```javascript
guidanceEligibility: {
  allowedApplicationStages: ['executing'],
  allowedSupportModes: ['execution'],
  requiredRiskSignals: ['deadline_pressure']
}
```

- ❌ Never shown during strategizing
- ❌ Never shown during interviewing

> **Note:** Deadline prompts are informational and MAY display alongside Next Best Steps, as long as they do not introduce a competing action. They provide awareness/context, not primary instruction.

**Tracker Reflection Prompts** (SHADOW_REFLECTION, EQ_PROMPT, CLINICAL_HIGHLIGHT):

```javascript
guidanceEligibility: {
  allowedSupportModes: ['orientation', 'confidence'],
  blockedRiskSignals: ['deadline_pressure']
}
```

- ❌ Never shown during urgent execution phases

**Engagement Prompts** (WELCOME_BACK, STREAK_AT_RISK):

```javascript
guidanceEligibility: {
  blockedRiskSignals: ['deadline_pressure']
}
```

- ❌ Never pile engagement nudges on deadline urgency

**Celebration Prompts** (READYSCORE_UP, MILESTONE_COMPLETE):

- No restrictions — always allowed
- Momentum-reinforcing

### Important Clarifications

1. **Missing CCRN/prereq = Smart Prompt** (inline notification), NOT a risk signal
2. **High-Impact Actions** are Next Best Steps only:
   - Add CCRN
   - Complete missing prerequisite
   - Log shadow hours
   - Complete checklist items near deadline
   - Submit application

   > These are examples for v1, not an exhaustive or permanent list.

3. **Smart Prompts should never introduce new primary actions** outside what Next Best Steps already covers

---

## What We Track Silently (No Prompts Needed)

| Behavior | What We Learn | Used For |
|----------|---------------|----------|
| Programs viewed | Interest signals | Recommendations |
| Programs saved | Commitment level | Personalization |
| Filters used repeatedly | Implicit preferences | Default filters |
| Search queries | Intent | Content suggestions |
| Time on pages | Engagement depth | Analytics |
| Feature usage | User segment | UX optimization |
| Status changes | Application progress | "What's Next" logic |
| Deadlines | Timeline | We know from database |

---

## What We Must Ask (Minimal)

| Data | When | Why We Can't Infer |
|------|------|-------------------|
| Name, unit type, experience | Onboarding | Core identity |
| GPAs | Profile setup | Precision required |
| Certifications | Profile setup | Binary status |
| Prerequisites + grades | Profile setup | Course-specific |
| Shadow days/hours | Tracker | Self-reported |
| Interview date | Status → "Interview Invite" | Only they know |

---

## Inline Prompts Catalog

### Requirements Matching

| Prompt ID | Trigger | Copy | Actions |
|-----------|---------|------|---------|
| `CCRN_NEEDED` | View program requiring CCRN AND user has no CCRN | "This program requires CCRN certification. Is yours up to date?" | [Got CCRN] → Opens cert tracker / [Working on it] → Dismiss |
| `GRE_NEEDED` | View program requiring GRE AND user has no GRE | "This program requires GRE scores. Have you taken it yet?" | [Yes, add scores] → Opens GRE edit / [Not yet] → Dismiss |
| `PREREQ_GAP` | View program AND missing required prereq | "Heads up: This program requires {course}. We don't see it in your profile." | [I have it] → Opens prereq edit / [Got it] → Dismiss |

**Important:** Prompts only show if BOTH conditions are true. If user HAS CCRN, `CCRN_NEEDED` never shows.

### Tracker Enrichment

| Prompt ID | Trigger | Copy | Actions |
|-----------|---------|------|---------|
| `SHADOW_REFLECTION` | After logging shadow hours | "Quick reflection: What was the most surprising thing you observed?" | Text input → Saves / [Skip] |
| `CLINICAL_HIGHLIGHT` | After logging high-acuity clinical entry | "That sounds like a great case! Want to mark it as a highlight for interviews?" | [Mark highlight] / [Skip] |
| `EQ_PROMPT` | After challenging clinical entry | "Sounds like a tough shift. Writing about it can help process and prepare for interviews." | [Reflect] → Opens EQ form / [Skip] |

### Status Transitions

| Prompt ID | Trigger | Copy | Actions |
|-----------|---------|------|---------|
| `INTERVIEW_DATE` | Status → "Interview Invited" | "Congrats on the interview invite! When is your interview scheduled?" | Date picker → Saves |
| `SUBMITTED_CONFIRM` | Status → "Submitted" | "Application submitted! Want to set a reminder to follow up?" | [Yes] / [No thanks] |
| `OUTCOME_PROMPT` | 2+ weeks after interview date | "Any news from {programName}? Updating helps track your journey." | Status selector |

---

## Periodic Nudges Catalog

### Deadline & Time-Sensitive

| Nudge ID | Trigger | Copy |
|----------|---------|------|
| `DEADLINE_30` | Target deadline < 30 days | "Your {programName} deadline is in {days} days. You're at {progress}% complete." |
| `DEADLINE_14` | Target deadline < 14 days | "Two weeks until {programName} deadline! You're making progress - {incompleteCount} items to go." |
| `DEADLINE_7` | Target deadline < 7 days | "This week: {programName} deadline. Let's finish strong!" |
| `LOR_PENDING` | LOR requested > 14 days, still pending | "Check in with {recommenderName}? It's been {days} days. If they're delayed, you still have time to ask a backup." |

### Engagement & Momentum

| Nudge ID | Trigger | Copy |
|----------|---------|------|
| `WELCOME_BACK` | Last login > 7 days | "Welcome back! Here's what's happened: {summary}" |
| `STREAK_AT_RISK` | Clinical streak > 3 AND no log today | "You're on a {streak}-day streak! Log today's shift to keep it going." |
| `SHADOW_REMINDER` | Last shadow > 30 days AND hours < goal | "Haven't logged a shadow day in a while. Need help finding opportunities?" |

### Celebration

| Nudge ID | Trigger | Copy |
|----------|---------|------|
| `MILESTONE_COMPLETE` | User completes milestone | "Milestone complete: {milestoneName}! You're making real progress." |
| `READYSCORE_UP` | ReadyScore increased 10+ | "Your ReadyScore jumped to {score}! Your hard work is paying off." |
| `CHECKLIST_DONE` | Checklist 100% complete | "All done with {programName} checklist! You're ready to submit." |

---

## UI Patterns

### InlinePromptCard (Non-blocking)

```
┌─────────────────────────────────────────────────────┐
│ [icon]                                           X  │
│ This program requires CCRN certification.           │
│ Is yours up to date?                                │
│                                                     │
│ [Got CCRN]  [Working on it]                        │
└─────────────────────────────────────────────────────┘
```

- Background: `bg-blue-50 border-blue-200` (info) or `bg-yellow-50` (action)
- Position: Inline with content, not overlay
- Dismissable: Yes (X button)

### DashboardNudgeCard

```
┌─────────────────────────────────────────────────────┐
│  Two weeks until Georgetown deadline!               │
│                                                     │
│  You're making progress - 3 items to go.            │
│  You've got this!                                   │
│                                                     │
│  [View checklist →]                                 │
└─────────────────────────────────────────────────────┘
```

- Background varies by urgency: Normal (white), High (yellow), Critical (red)
- Position: Dashboard widget area
- Max 3 visible at once

### Toast (Transient)

```
┌────────────────────────────────────────┐
│ +2 points! Shift logged.               │
└────────────────────────────────────────┘
```

- Duration: 3-5 seconds
- Use for: Confirmations, points, quick feedback

---

## Frequency Rules

### Global Limits

| Rule | Value | Rationale |
|------|-------|-----------|
| Max inline prompts per page | 2 | Avoid overwhelming |
| Max dashboard nudges | 3 | Keep dashboard clean |
| Min time between nudges | 4 hours | Respect attention |
| Max prompts per session | 5 | Prevent fatigue |
| Cool-off after dismiss | 7 days | Respect user choice |

### Category-Specific

| Category | Show Frequency | Re-show After Snooze |
|----------|---------------|---------------------|
| Deadline alerts | Daily for < 14 days | 1 day |
| LOR reminders | Every 5 days | 3 days |
| Streak warnings | Daily (morning) | Never |
| Profile prompts | Once per section | 7 days |
| Celebration | Once per achievement | Never |

### Focus Area Prioritization

When multiple prompts are eligible, prompts related to the user's **active focus areas** (`primaryFocusAreas` with `status: 'active'`) may be prioritized. This ensures nudges feel relevant to what the user is currently working on.

Example: If user has `school_search` as an active focus area, school-related prompts (deadline alerts, program requirements) take priority over general engagement prompts.

---

## Copy Guidelines

### Tone Principles

1. **Supportive, not nagging**
   - Bad: "You still haven't completed your CCRN"
   - Good: "This program requires CCRN certification. Is yours up to date?"

2. **Action-oriented**
   - Bad: "Your deadline is approaching"
   - Good: "Two weeks until Georgetown deadline! Let's finish strong."

3. **Celebrate progress**
   - Bad: "3 items remaining"
   - Good: "You're making progress - 3 items to go."

4. **No anxiety induction**
   - Bad: "WARNING: Only 7 days left!"
   - Good: "This week: Georgetown deadline. You've got this!"

5. **LOR follow-up is supportive**
   - Bad: "Your recommender hasn't responded"
   - Good: "Have you heard back from [Name]? If they're delayed, you still have time to ask a backup."

---

## Data Model

### Prompt State Storage

**Dismissal Semantics (v1):** Default dismissal is permanent unless a prompt explicitly supports snoozing. Snoozing is only enabled for time-sensitive prompts (e.g., deadlines, LOR follow-ups).

```typescript
interface PromptState {
  userId: string;

  // Track dismissed prompts
  dismissedPrompts: {
    promptId: string;
    context?: string;           // e.g., program_id for context-specific
    dismissedAt: Date;
    dismissType: 'permanent' | 'snooze_7d' | 'snooze_30d';
  }[];

  // Track interactions
  promptInteractions: {
    promptId: string;
    shownAt: Date;
    action: 'completed' | 'dismissed' | 'snoozed';
    responseData?: any;
  }[];

  // Rate limiting
  lastNudgeShown: Record<string, Date>;

  // Celebration tracking
  celebratedEvents: string[];
}
```

### User Meta Additions

```typescript
// Add to user profile
{
  smartPromptsAccepted: string[];    // ['ccrn_prompt', 'gre_prompt']
  smartPromptsDismissed: string[];   // ['region_prompt']
  lastPromptShownAt: Date;
}
```

---

## Prompt Lifecycle

```
      HIDDEN
         |
  trigger conditions met
         ↓
      ACTIVE
         |
  +------+------+------+------+
  ↓      ↓      ↓      ↓      ↓
COMPLETED SNOOZED DISMISSED EXPIRED FULFILLED
              |
     snooze ends
              ↓
           ACTIVE
```

| Current | Event | Next |
|---------|-------|------|
| HIDDEN | Conditions met | ACTIVE |
| ACTIVE | User clicks action | COMPLETED |
| ACTIVE | User dismisses | DISMISSED |
| ACTIVE | User snoozes | SNOOZED |
| ACTIVE | Conditions no longer met | EXPIRED |
| SNOOZED | Snooze period ends | ACTIVE (re-evaluate) |

---

## Implementation Files

| File | Purpose |
|------|---------|
| `/src/lib/smartPrompts/promptDefinitions.js` | All prompt configs |
| `/src/lib/smartPrompts/promptEngine.js` | Evaluation logic |
| `/src/hooks/useSmartPrompts.js` | Main hook |
| `/src/components/features/prompts/InlinePromptCard.jsx` | Inline UI |
| `/src/components/features/prompts/DashboardNudgeCard.jsx` | Dashboard UI |
| `/src/components/features/prompts/DashboardNudges.jsx` | Container |
| `/src/pages/applicant/DashboardPage.jsx` | Integration |

---

## Implementation Phases

### Phase 1: Foundation
- Create `useSmartPrompts` hook with basic evaluation
- Implement `InlinePromptCard` component
- Add 3 highest-value inline prompts: CCRN_NEEDED, SHADOW_REFLECTION, INTERVIEW_DATE

### Phase 2: Dashboard Nudges
- Create `DashboardNudgeCard` component
- Create `DashboardNudges` container
- Add deadline and engagement nudges

### Phase 3: Full Catalog
- Implement remaining inline prompts
- Add all periodic nudges
- Build celebration modals
- Complete frequency limiting

### Phase 4: Polish
- Add analytics tracking
- Tune frequency rules
- Document for dev team handoff

---

## Tracker-Level Nudge Dismissal

Tracker components (Clinical, EQ, Shadow Days) have their own nudge/prompt systems that follow specific dismissal patterns.

### Clinical Tracker Catch-Up Nudge

**Trigger:** `daysSinceLastLog >= 4`

**Dismissal Behavior:**

| Action | Effect | Storage |
|--------|--------|---------|
| X button | Dismisses for 24 hours | `lastDismissedAt` (localStorage/Supabase) |
| "Remind me in 3 days" | Snoozes for 3 days | `snoozedUntil` (localStorage/Supabase) |
| "Don't remind me again" | Permanent dismiss | `permanentlyDismissed` (localStorage/Supabase) |

**Snooze Duration by Tracker:**
- Clinical, EQ, Events: 3 days (high-frequency activities)
- Shadow Days: 7 days (infrequent activity, ~once per 1-3 months)

**Progressive Dismissal:**
- After 5 X-button dismisses (tracked via `dismissCount`), the "Remind me in 3 days" option changes to "Don't remind me again"
- This prevents users from being trapped in endless nudges while giving them multiple chances

**State Schema:**
```typescript
interface TrackerNudgeState {
  // Clinical catch-up nudge
  clinical_catchup: {
    dismissCount: number;           // Tracks X button clicks (persist)
    permanentlyDismissed: boolean;  // Never show again (persist)
    snoozedUntil: string | null;    // ISO date string (persist)
    lastDismissedAt: string | null; // ISO date string - 24-hour dismiss (persist)
  };
}
```

**Supabase Integration:**
For production, store persistent nudge state in user preferences:

```sql
-- Add to user_preferences table or create nudge_state table
ALTER TABLE user_preferences ADD COLUMN tracker_nudge_state JSONB DEFAULT '{}';
```

**Message Tiers:**
| Days Since | Message |
|------------|---------|
| 4+ days | "It's been a few days - time to catch up on your recent shifts?" |
| 7+ days | "A week since your last log! Don't forget those great experiences." |
| 14+ days | "We miss you! Log your recent shifts while the memories are fresh." |

### EQ Tracker Nudges

Similar pattern can be applied to EQ tracker nudges as needed.

### Shadow Days Tracker Nudges

`SHADOW_REMINDER` nudge triggers when:
- Last shadow > 30 days AND hours < goal

Follows same dismissal pattern as Clinical catch-up.
