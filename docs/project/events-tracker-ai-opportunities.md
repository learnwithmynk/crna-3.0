# Events Tracker Page - UX & AI Optimization Research

**Date:** November 29, 2024
**Status:** Research Complete - Ready for Implementation

---

## Current State Analysis

### What Exists Now
1. **Header + Tabs**: Clinical, EQ, Shadow, Events
2. **Stats Row**: 6 events logged, 10 contacts made, 1/2 programs engaged
3. **Engagement by Program**: Collapsible, shows "1/2 engaged" with no context
4. **Coming Up**: Empty state with "Browse Events" CTA
5. **Ready to Log**: Large cards for past saved events awaiting logging
6. **My Event Log**: Two-column - event list left, talking points right

### Problems Identified
| Issue | Impact | Priority |
|-------|--------|----------|
| "Ready to Log" dominates viewport | Users scroll past valuable content | High |
| "Engagement by Program" lacks context | Metric without meaning = ignored | High |
| Empty "Coming Up" = missed opportunity | No guidance when user needs it most | Medium |
| No prioritization of events to log | User fatigue from too many prompts | Medium |

---

## UX Recommendations

### 1. Information Hierarchy (Revised Priority)

**Above the fold (most important):**
1. Stats summary (compact)
2. Coming Up OR Smart Suggestions (if empty)
3. Engagement Coaching sidebar/card

**Below the fold:**
4. Ready to Log (collapsed/compact)
5. My Event Log (full section)

### 2. "Ready to Log" Optimization

**Current Problem:** Each event card is ~150px tall, showing 2-3 fills the viewport.

**Recommended Solutions:**

#### Option A: Compact List View (Recommended)
```
┌─────────────────────────────────────────────────────────────┐
│ ✨ READY TO LOG                              7 events waiting│
├─────────────────────────────────────────────────────────────┤
│ ○ AANA Mid-Year Assembly 2025 · May 19 · DC    [Log] [Skip]│
│ ○ Cedar Crest Virtual Tour · Feb 9 · Virtual   [Log] [Skip]│
│ ○ Georgetown Info Session · Jan 15 · Virtual   [Log] [Skip]│
│                                                             │
│                    Show 4 more events                       │
└─────────────────────────────────────────────────────────────┘
```

**Benefits:**
- 3-4 events visible in ~120px instead of ~450px
- "Log" opens a quick-entry modal
- "Skip" = "Didn't Attend" (dismisses)
- Expandable for users who want full cards

#### Option B: Horizontal Scroll Carousel
- Show compact cards in a horizontal scroll
- Takes fixed height (~140px)
- Swipe through events

#### Option C: Collapsible Section (Minimum Viable)
- Default collapsed showing count: "7 events waiting to log →"
- Expands to show full cards
- Less ideal but quick to implement

### 3. "Engagement by Program" Redesign

**Current Problem:** "1/2 engaged" means nothing without:
- Which programs are engaged vs not
- WHY engagement matters
- HOW to improve

**Recommended: Coaching Card with Actionable Insights**

```
┌─────────────────────────────────────────────────────────────┐
│ 📊 PROGRAM ENGAGEMENT                                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  You've engaged with 1 of 2 target programs                │
│  ████████████░░░░░░░░░░░░ 50%                              │
│                                                             │
│  ✓ Georgetown - Attended info session Nov 9                │
│  ○ Duke - No events attended yet                           │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 💡 WHY THIS MATTERS                                  │   │
│  │ Programs notice when applicants attend events.       │   │
│  │ It shows genuine interest and gives you talking     │   │
│  │ points for interviews.                               │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  📅 Duke has an upcoming virtual info session Dec 12       │
│                                        [Add to Calendar →] │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Key Elements:**
1. Visual progress bar
2. List which programs are engaged vs not
3. Explain WHY in collapsible/tooltip
4. Specific actionable suggestion with CTA

**Placement Options:**
- **Sidebar (desktop)**: Always visible alongside event log
- **Top card (mobile)**: Collapsible, above event log
- **Sticky bottom bar**: Persistent nudge

### 4. "Coming Up" Smart Suggestions

**When Empty, Show Personalized Recommendations:**

```
┌─────────────────────────────────────────────────────────────┐
│ 📅 COMING UP                                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  No saved events coming up                                  │
│                                                             │
│  ┌─ SUGGESTED FOR YOU ─────────────────────────────────┐   │
│  │                                                      │   │
│  │  🎯 Based on your target programs:                  │   │
│  │  • Duke Virtual Info Session - Dec 12              │   │
│  │  • Georgetown Open House - Jan 8                    │   │
│  │                                                      │   │
│  │  🌟 High-value events:                              │   │
│  │  • AANA Mid-Year Assembly - May 19, DC             │   │
│  │    (Great for networking + shows commitment)        │   │
│  │                                                      │   │
│  │  📍 Near you (based on profile):                    │   │
│  │  • Texas AANA State Meeting - Feb 22, Houston      │   │
│  │                                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│                              [Browse All Events →]          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Suggestion Logic Priority:**
1. **Target program events** - Highest priority, directly relevant
2. **Events near application deadlines** - Time-sensitive
3. **High-value general events** - AANA meetings, etc.
4. **Location-based** - In-person events near user
5. **Virtual events** - Easy wins, no travel required

---

## AI Opportunity Analysis

### 1. Smart Event Suggestions Engine

**Inputs:**
- User's target programs
- User's location (from profile)
- Application timeline/deadlines
- Past event attendance patterns
- Event type preferences (virtual vs in-person)

**Outputs:**
```javascript
// Example suggestion object
{
  event: "Duke Virtual Info Session",
  relevance: "target_program",
  priority: "high",
  reason: "You're applying to Duke - attending shows demonstrated interest",
  deadline_context: "Duke deadline is Feb 1 - this is your last chance before apps due",
  cta: "Add to Calendar"
}
```

**Implementation Complexity:** Medium
- Requires: Target programs list, events database with program associations
- Nice-to-have: Location data, deadline integration

### 2. Engagement Score & Coaching

**Current:** "1/2 programs engaged" (meaningless)

**Enhanced:**
```javascript
{
  engagement_score: 50,
  programs: [
    { name: "Georgetown", engaged: true, events: ["Info Session Nov 9"], strength: "good" },
    { name: "Duke", engaged: false, events: [], strength: "none" }
  ],
  coaching: {
    priority_action: "Attend a Duke event before their Feb 1 deadline",
    why_it_matters: "Programs track event attendance. Duke specifically mentions 'demonstrated interest' in their admissions criteria.",
    suggested_event: { name: "Duke Virtual Info Session", date: "Dec 12", link: "/events/123" }
  }
}
```

**AI Enhancement Ideas:**
- Parse program websites to know which schools value demonstrated interest
- Track which event types (info session vs open house vs AANA meeting) correlate with acceptances
- Personalize "why it matters" based on user's application stage

### 3. "Ready to Log" Intelligence

**Smart Prioritization:**
1. **Most recent first** - Fresher memories = better notes
2. **Target program events first** - Higher value to log
3. **Events with contacts made** - If they networked, capture it
4. **Auto-archive old events** - Events 60+ days old → "Didn't attend"

**Quick Log Enhancement:**
- Pre-fill event type from saved event data
- Suggest common talking points based on event type
- Voice-to-text for notes on mobile

### 4. AI-Generated Talking Points (Already Exists - Enhance)

**Current:** Shows AI-generated talking points from notes

**Enhanced:**
- Auto-generate draft talking points even before user adds notes
- Template: "I attended [event] on [date] and learned about [program]'s [highlight]"
- Connect to interview prep: "Use this talking point when asked 'Why [Program]?'"

### 5. Cross-Feature Intelligence

**Event → Target Program Connection:**
- When user logs event for a target program, auto-update program's "engagement" status
- Show event attendance on Target Program Detail page
- Include in application checklist: "☑ Attended event for [Program]"

**Event → Timeline Connection:**
- If user has deadline approaching and hasn't engaged with that program, surface warning
- "⚠️ Duke deadline in 3 weeks - you haven't attended any Duke events"

**Event → Interview Prep:**
- Auto-populate interview talking points from event notes
- "You have 5 talking points ready for your Georgetown interview"

---

## Recommended Layout (Final)

### Desktop (1024px+)
```
┌──────────────────────────────────────────────────────────────────────────┐
│ MY TRACKERS    [Clinical] [EQ] [Shadow] [Events●]                        │
├──────────────────────────────────────────────────────────────────────────┤
│ Events & Notes                     6 logged · 10 contacts · 1/2 programs │
├────────────────────────────────────────────┬─────────────────────────────┤
│                                            │                             │
│  📅 COMING UP                              │  📊 ENGAGEMENT COACHING     │
│  ┌─────────────────────────────────────┐   │                             │
│  │ [Smart suggestions if empty]        │   │  1 of 2 programs engaged   │
│  │ [Upcoming events if not empty]      │   │  ████████░░░░░░░░ 50%      │
│  └─────────────────────────────────────┘   │                             │
│                                            │  ✓ Georgetown               │
│  ✨ READY TO LOG              3 waiting    │  ○ Duke (no events yet)     │
│  ┌─────────────────────────────────────┐   │                             │
│  │ ○ Event 1 · Date · Loc   [Log][Skip]│   │  💡 Next step:              │
│  │ ○ Event 2 · Date · Loc   [Log][Skip]│   │  Duke has an info session  │
│  │ ○ Event 3 · Date · Loc   [Log][Skip]│   │  Dec 12 - Add it!          │
│  │           Show 4 more               │   │  [Add to Calendar →]       │
│  └─────────────────────────────────────┘   │                             │
│                                            │  ───────────────────────    │
│  📋 MY EVENT LOG              [+ Log Event]│  Why this matters ▼         │
│  ┌─────────────────────────────────────┐   │                             │
│  │ Texas AANA Assembly  [AANA Meeting] │   │                             │
│  │ Nov 14 · Austin, TX        Edit     │   │                             │
│  │ Notes: The networking was...        │   │                             │
│  │ 3 contacts                          │   │                             │
│  │ ✨ "I attended the Texas AANA..."   │   │                             │
│  │                     Show details ▼  │   │                             │
│  ├─────────────────────────────────────┤   │                             │
│  │ Georgetown Info Session             │   │                             │
│  │ ...                                 │   │                             │
│  └─────────────────────────────────────┘   │                             │
│                                            │                             │
└────────────────────────────────────────────┴─────────────────────────────┘
```

### Mobile (375px)
```
┌─────────────────────────────────┐
│ MY TRACKERS                     │
│ [Clinical][EQ][Shadow][Events●] │
├─────────────────────────────────┤
│ 6 logged · 10 contacts · 1/2    │
├─────────────────────────────────┤
│ 📊 ENGAGEMENT         50% ████░ │
│ Duke needs attention  [See How] │
├─────────────────────────────────┤
│ 📅 COMING UP                    │
│ No events saved                 │
│ [See suggestions for you →]     │
├─────────────────────────────────┤
│ ✨ READY TO LOG    3 waiting ▼  │
│ (collapsed by default)          │
├─────────────────────────────────┤
│ 📋 MY EVENT LOG    [+ Log]      │
│ ┌─────────────────────────────┐ │
│ │ Texas AANA Assembly         │ │
│ │ Nov 14 · Austin · 3 contacts│ │
│ │                      Edit ▼ │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ Georgetown Info Session     │ │
│ │ ...                         │ │
└─────────────────────────────────┘
```

---

## Implementation Priority

### Phase 1 (Quick Wins)
1. ✅ Compact "Ready to Log" list view
2. ✅ Collapse "Ready to Log" by default on mobile
3. ✅ Add "Why this matters" tooltip to engagement stat

### Phase 2 (High Value)
4. Engagement Coaching sidebar/card with program breakdown
5. Smart event suggestions when "Coming Up" is empty
6. Quick log modal instead of navigating to full form

### Phase 3 (AI Enhancement)
7. Prioritized event suggestions based on target programs
8. Auto-archive old "Ready to Log" events
9. Cross-feature: Show engagement on Target Program Detail page

---

## Questions for Stakeholder

1. Do we have event-to-program associations in the data model? (Needed for smart suggestions)
2. Should "Didn't Attend" events be tracked or fully dismissed?
3. How many target programs does the average user have? (Affects sidebar design)
4. Is there an existing events recommendation algorithm, or build from scratch?

---

## Related Files
- `/src/pages/applicant/MyTrackersPage.jsx` - Current implementation
- `/docs/skills/data-shapes.md` - Event data model
- `/docs/skills/empty-states.md` - Empty state patterns
