# Guidance Engine Specification v1

System for computing and managing user guidance state to power personalized experiences.

> **Status:** Specification finalized (v1). Schema implemented, engine logic deferred.

---

## Purpose

The Guidance Engine is a **deterministic, rules-based system** that computes the user's **Guidance State** (Category 12 metadata) to enable:

1. **Next Best Steps** - Actionable guidance prioritized by impact
2. **Smart Prompts eligibility** - Stage-appropriate nudges and prompts
3. **Dashboard personalization** - Contextual widgets and content
4. **Future AI features** - Explainable, auditable context for AI personalization

### Guardrails

- **No shaming language** - Never frame guidance around what user "hasn't done"
- **No anxiety induction** - Avoid countdowns, pressure tactics, or competitive comparisons
- **Deterministic in v1** - No AI/ML in engine; rules-based only
- **Explainable** - Every output should be traceable to specific inputs
- **Silence is valid** - 0 steps = affirmation, not absence

---

## What the Guidance Engine Is NOT

The Guidance Engine does **not** replace:
- Milestones
- Program-specific checklists
- Granular task lists (e.g., "Write Georgetown essay")

It does **not** generate or manage:
- Detailed to-do items
- Program-specific application steps
- Long-form tasks (e.g., "Write your personal statement")

Those responsibilities belong to:
- **Milestones** (macro progress)
- **Target Program Checklists** (program-specific execution)

---

## What the Guidance Engine DOES

The Guidance Engine exists to:
- Identify which **milestones deserve attention right now**
- Determine the appropriate **support tone** (orientation, strategy, execution, confidence)
- Highlight **areas of focus**, not prescribe exact tasks
- Influence UI emphasis, ordering, and nudging behavior

> **Next Best Steps** are prioritization signals that point users toward existing milestones or checklist items that have the highest impact right now — they do not create new tasks.

---

## Relationship to Milestones and Program Checklists

### Milestones Are First-Class Entities

Milestones are **real, trackable objects** in the system — not just conceptual groupings:

- Each milestone has structured sub-tasks/resources
- Each tracks status: `not_started` | `in_progress` | `completed`
- Stored in user metadata
- Span global application readiness (not school-specific)

**The 13 Milestones:**
1. Understand the Profession + Early Prep
2. Critical Care Experience
3. GPA + Prerequisites
4. Explore & Save CRNA Programs
5. Resume / CV
6. Anesthesia Events + Networking
7. Leadership + Community Involvement
8. Certifications
9. GRE
10. Shadowing
11. Personal Statement
12. Letters of Recommendation
13. Interview Preparation

### The Three Layers

| Layer | Owns | Example |
|-------|------|---------|
| **Milestones** | Macro roadmap — what eventually needs to happen (global readiness) | "Certifications", "Shadowing", "Personal Statement" |
| **Target Program Checklists** | Program-specific execution — what THIS school requires | "Georgetown essay", "CCRN verified", "Transcript submitted" |
| **Guidance Engine** | Attention prioritization — what deserves focus NOW, from existing milestones and checklists | "Work on your personal statement", "Continue your Georgetown application" |

### How Next Best Steps Reference Work

Next Best Steps reference **areas of work**, not atomic checklist items. They use program context when helpful but stay high-level:

| Problematic (Too Specific) | Preferred (Area-Focused) |
|---------------------------|-------------------------|
| "Complete checklist item for Georgetown" | "Work on your Georgetown application tasks" |
| "Complete Personal Statement checklist item" | "Begin working on your personal statement" |
| "Complete certifications checklist item" | "Add or verify your CCRN certification" |

Each step:
- Hyperlinks to the correct destination (milestone page, target program page, or tool hub)
- Lets the existing UI handle specificity
- Does NOT micromanage individual checklist items

### Milestone-to-Step Mapping (Conceptual)

In v1, Next Best Steps **conceptually map** to milestones but do not store `milestoneId`:

| Next Best Step | Links To |
|----------------|----------|
| "Calculate your GPA" | GPA Analyzer tool |
| "Explore CRNA programs" | Explore & Save Programs milestone |
| "Add or verify your CCRN certification" | Certifications milestone |
| "Build shadowing experience" | Shadowing milestone |
| "Work on your Georgetown application" | Georgetown target program page |

> **Note:** Not every step maps to a checklist item. Some steps point only to milestones. The engine surfaces attention signals across both layers.

**Why no `milestoneId` in v1:**
- Avoids tight coupling between engine logic and milestone records
- Keeps the engine flexible if milestones evolve
- Some steps span multiple milestones (e.g., CCRN touches Certifications + Critical Care)
- Simpler, more flexible engine logic

### Milestone Status Influences Prioritization

The engine is **milestone-aware** — it reads milestone completion status to influence which steps surface:

| Milestone Status | Engine Behavior |
|------------------|-----------------|
| `completed` | De-prioritize or exclude from step candidates |
| `in_progress` | Eligible for guidance — may surface related steps |
| `not_started` | May elevate if foundational or time-sensitive |

> **Note:** Milestone status is a filter and weighting signal, not a hard dependency.

### What the Engine Does NOT Do

The Guidance Engine does **not**:
- Advance or complete milestones
- Replace milestone progress tracking
- Break milestones into granular sub-tasks
- Own the detailed "how" of execution
- Reference atomic checklist items by name

Granular execution lives in:
- Target Program Checklists
- Milestone sub-items (where applicable)
- Dedicated tools (GPA analyzer, prereq library, resume builder, etc.)

---

## Relationship to Smart Prompts

Next Best Steps and Smart Prompts are **complementary layers** with different timing and purpose:

| Layer | Purpose | Timing |
|-------|---------|--------|
| **Next Best Steps** | Proactive guidance | Dashboard, emphasis |
| **Smart Prompts** | Contextual clarification | Inline, moment-based |

**Example - CCRN:**
- **Smart Prompt:** "This program requires CCRN" → fires when viewing that specific program
- **Next Best Step:** "Work toward your CCRN" → fires proactively if any target requires it

**Key distinctions:**
- Next Best Steps surface on the dashboard as primary guidance
- Smart Prompts appear in context (viewing a program, after logging an entry)
- Both may reference the same underlying need, but at different moments
- Smart Prompts are suppressed when action-oriented AND Next Best Steps exist (global suppression rule)

See `/docs/skills/smart-prompts-system.md` for prompt eligibility rules.

---

## Inputs (Read-Only)

The engine reads from the Canonical User Model but does not modify source data:

| Data Source | Used For |
|-------------|----------|
| `targetPrograms[]` | Stage computation (highest status wins) |
| `targetPrograms[].checklist` | Deadline pressure calculation |
| `milestones[]` | Step prioritization (status filters candidates) |
| `activityLog[]` | Stagnation/momentum detection |
| `certifications[]` | Step qualification (e.g., "Add CCRN" step) |
| `completedPrerequisites[]` | Step qualification (e.g., "Complete prerequisite" step) |
| `primaryFocusAreas[]` | Step ranking by relevance |

---

## Core Outputs

The engine writes to `guidanceState`:

```javascript
guidanceState: {
  applicationStage: ApplicationStage,
  supportMode: SupportMode,
  primaryFocusAreas: PrimaryFocusArea[],
  riskSignals: RiskSignal[],
  nextBestSteps: NextBestStep[],
  lastComputedAt: datetime
}
```

---

## 1. Application Stage (Computed)

**What phase the user is in** - lifecycle position derived from highest program status.

```typescript
type ApplicationStage =
  | 'exploring'        // No target programs
  | 'strategizing'     // Has saved/researching programs
  | 'executing'        // Any program in_progress or submitted
  | 'interviewing'     // Any program interview_invite or interview_complete
  | 'post_decision'    // Any program accepted, waitlisted, or denied
```

### Computation Rules

System reads `targetPrograms[]` and selects highest status:

| Program Status | Maps To Stage |
|----------------|---------------|
| (none) | `exploring` |
| `not_started`, `researching` | `strategizing` |
| `in_progress`, `submitted` | `executing` |
| `interview_invite`, `interview_complete` | `interviewing` |
| `accepted`, `waitlisted`, `denied` | `post_decision` |

**Highest wins:** If user has one program at `submitted` and another at `interview_invite`, stage = `interviewing`.

---

## 2. Support Mode (Derived)

**How the platform should help** - guidance style derived from applicationStage.

```typescript
type SupportMode =
  | 'orientation'   // Reduce overwhelm, explain structure
  | 'strategy'      // Decision-making, planning support
  | 'execution'     // Task completion, deadline focus
  | 'confidence'    // Reassurance, interview readiness
```

### Mapping Table

| applicationStage | supportMode |
|------------------|-------------|
| `exploring` | `orientation` |
| `strategizing` | `strategy` |
| `executing` | `execution` |
| `interviewing` | `confidence` |
| `post_decision` | `orientation` |

> **Note:** `post_decision` maps to `orientation` because users need help transitioning to their next phase (accepted → SRNA prep, waitlisted → next steps, denied → regroup).

---

## 3. Risk Signals (Computed)

**Discrete signals that modify guidance behavior.** Simple string array for v1.

```typescript
type RiskSignal = 'stagnation' | 'deadline_pressure' | 'momentum'
```

### Signal Definitions

| Signal | Definition | Threshold |
|--------|------------|-----------|
| `stagnation` | No meaningful progress | 14+ days since last meaningful action |
| `deadline_pressure` | At-risk deadline | Nearest deadline < 30 days AND checklist < 60% complete |
| `momentum` | Strong progress (positive) | ≥ 3 meaningful actions in last 7 days |

### Meaningful Actions

For stagnation/momentum calculation, "meaningful action" includes:
- Logging clinical/shadow/EQ entry
- Completing checklist item
- Submitting application
- Adding/updating target program
- Completing milestone item

**NOT meaningful:** Page views, logins, browsing

### Signal Behavior

- Empty array `[]` = healthy state (user is on track)
- `momentum` is a **positive signal** - may suppress corrective nudges
- Signals are computed, not stored long-term (recalculated on each engine run)

---

## 4. Next Best Steps (Computed)

**Actionable guidance shown to the user.** 0-3 steps prioritized by impact.

```typescript
type NextBestStep = {
  stepId: string,
  action: string,           // What to do (verb phrase)
  whyItMatters: string,     // Brief explanation
  cta: {
    label: string,
    href: string
  },
  dismissedAt: datetime | null  // null = active
}
```

### Step Count Rules

| Count | Meaning |
|-------|---------|
| 0 | **Affirmation State** - User is on track. Valid positive state. |
| 1 | Primary guidance - single most impactful action |
| 2 | Primary + secondary - two high-impact actions |
| 3 | Maximum - avoid overwhelming user |

### Affirmation State

**0 steps is intentional and positive.** When no high-yield steps qualify, the UI should:
- Display affirmation ("You're on track")
- Optionally remind of current focus areas
- NOT show "nothing to do" or empty state

### Step Qualification (High-Yield Only)

Steps must meet **high-yield threshold** - actions that meaningfully move the needle:

| Step Type | Qualification Criteria |
|-----------|----------------------|
| Add CCRN | Required by ≥1 target AND user doesn't have |
| Complete prerequisite | Missing for ≥1 target |
| Log shadow hours | Total < 40 hours |
| Complete checklist item | Deadline < 30 days AND item incomplete |
| Submit application | Status = in_progress AND checklist ≥ 90% |

> **Note:** Step qualification is independent of risk signals. A step may qualify even if `deadline_pressure` is not present, as long as the action meets the high-yield threshold.

### Step Ranking

When multiple steps qualify, rank by:
1. **Deadline proximity** - Closer deadline = higher priority
2. **Focus area alignment** - Matches user's active focus areas
3. **Impact breadth** - Affects more target programs

### Dismissal Rules

- User can dismiss any step
- Dismissed steps don't resurface for 7 days (cool-off period)
- `dismissedAt` tracks when dismissed; engine filters during computation

---

## 5. Primary Focus Areas (System + User)

**What the user is actively working on.** Maintained by system inference and user actions.

```typescript
type PrimaryFocusArea = {
  area: FocusArea,
  status: 'active' | 'secondary' | 'completed',
  activatedAt: datetime,
  lastEngagedAt: datetime,
  source: 'system' | 'behavior' | 'user_action'
}

type FocusArea =
  | 'school_search'
  | 'gpa_prereqs'
  | 'certifications'
  | 'shadowing'
  | 'leadership'
  | 'resume'
  | 'essay'
  | 'interview_prep'
```

### Activation Rules

| User Action | Activated Focus Area |
|-------------|---------------------|
| Views schools page, uses filters | `school_search` |
| Edits GPA, adds prereqs | `gpa_prereqs` |
| Adds/updates certifications | `certifications` |
| Logs shadow hours | `shadowing` |
| Adds leadership entries | `leadership` |
| Edits resume, downloads template | `resume` |
| Views essay guides, uses essay tool | `essay` |
| Views mock interview, preps for interview | `interview_prep` |

> **Note:** Activation rules are heuristic, not exclusive. Multiple user actions may activate the same focus area, and a single action may activate multiple areas if contextually appropriate.

### Status Transitions

- **`active` → `secondary`**: No engagement in 14+ days AND another area more recent
- **`secondary` → `active`**: Re-engagement with area
- **`active`/`secondary` → `completed`**: **User-declared only** - system cannot auto-complete

### Important Notes

- **Networking is NOT a focus area** - It's always-on background activity
- Focus areas influence step ranking, not hard filters
- Maximum active areas: No hard limit, but UI may show top 2-3

---

## 6. Last Computed At

```typescript
lastComputedAt: datetime
```

Used for:
- Preventing over-computation (throttling)
- Auditability and debugging
- Future: Explainability ("as of X, we recommended Y because Z")

---

## Integration Points

### Smart Prompts System

See `/docs/skills/smart-prompts-system.md`

- Prompts may filter by `applicationStage`
- Prompts prioritized by `primaryFocusAreas`
- `riskSignals` influence prompt frequency and urgency

### Dashboard

- `nextBestSteps` displayed in guidance card
- Widget order influenced by `primaryFocusAreas`
- `supportMode` determines guidance tone

### Future: AI Features

- Engine outputs provide explainable context for AI
- All recommendations traceable to rules
- No black-box decisions in v1

---

## Deprecated Fields

These fields have been removed from the schema:

| Field | Replacement |
|-------|-------------|
| `supportModeConfidence` | Removed - no emotional self-report in v1 |
| `hasApplicationStructure` | Computed on-the-fly: `targetPrograms.length > 0` |
| `applicationUrgencyLevel` | Replaced by `riskSignals` (deadline_pressure) |
| `lastSupportModeUpdateAt` | Replaced by `lastComputedAt` |

---

## Implementation Phases

### Phase 1: Schema (DONE)
- ✅ Define schema and enums (`src/lib/enums.js`)
- ✅ Add mock data (`src/data/mockUser.js`)
- ✅ Document spec (this file)
- ✅ Update canonical user model

### Phase 2: Engine Logic (FUTURE)
- Build `computeGuidanceState()` function
- Implement stage/mode computation
- Implement risk signal detection
- Implement step qualification and ranking

### Phase 3: Integration (FUTURE)
- Wire to dashboard
- Wire to smart prompts
- Add behavioral tracking hooks

---

## Related Documentation

- `/docs/skills/canonical-user-model.md` - Category 12 field definitions
- `/docs/skills/smart-prompts-system.md` - Prompt delivery system
- `/src/lib/enums.js` - Enum values
- `/src/data/mockUser.js` - Example guidanceState data
