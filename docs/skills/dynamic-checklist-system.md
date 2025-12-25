# Dynamic Checklist System

Generate application checklists dynamically based on each school's specific requirements.

---

## Overview

Instead of a static 12-item checklist for all programs, the system generates checklists based on what each school actually requires. This prevents confusion (e.g., showing "Complete GRE" when a school doesn't require it).

---

## Checklist Structure

### Universal Items (9 items - always included)

| ID | Label | Rationale |
|----|-------|-----------|
| c1 | Verify all program requirements + due date | Validates our data |
| c2 | Check for Open House or program event | Networking opportunity |
| c3 | Request official Transcripts | All programs require |
| c4 | Complete Prerequisites | All programs have some |
| c8 | Complete Resume | Nearly universal |
| c9 | Complete Personal Statement | Nearly universal |
| c10 | Complete Letters of Recommendation | All programs require |
| c11 | Complete Supplemental Forms | Most have some |
| c12 | Submit Application | Final step |

### Conditional Items (3 items - based on school data)

| ID | Label | Condition Field | When Included |
|----|-------|-----------------|---------------|
| c5 | Complete the GRE | `greRequired` | When `greRequired === true` |
| c6 | Send GRE Scores | `greRequired` | When `greRequired === true` |
| c7 | Complete CCRN | `ccrnRequired` | When `ccrnRequired === true` |
| c13 | Complete Shadowing | `shadowingRequired` | When `shadowingRequired === true` |

---

## Generation Logic

```javascript
// src/lib/checklistGenerator.js

export function generateChecklistForSchool(school) {
  // Universal items - always included
  const universalItems = [
    { id: 'c1', label: 'Verify all program requirements + due date', completed: false, isDefault: true, isConditional: false, requirementType: null },
    { id: 'c2', label: 'Check for Open House or program event', completed: false, isDefault: true, isConditional: false, requirementType: null },
    { id: 'c3', label: 'Request official Transcripts', completed: false, isDefault: true, isConditional: false, requirementType: null },
    { id: 'c4', label: 'Complete Prerequisites', completed: false, isDefault: true, isConditional: false, requirementType: null },
    { id: 'c8', label: 'Complete Resume', completed: false, isDefault: true, isConditional: false, requirementType: null },
    { id: 'c9', label: 'Complete Personal Statement', completed: false, isDefault: true, isConditional: false, requirementType: null },
    { id: 'c10', label: 'Complete Letters of Recommendation', completed: false, isDefault: true, isConditional: false, requirementType: null },
    { id: 'c11', label: 'Complete Supplemental Forms', completed: false, isDefault: true, isConditional: false, requirementType: null },
    { id: 'c12', label: 'Submit Application', completed: false, isDefault: true, isConditional: false, requirementType: null },
  ];

  // Conditional items - only added if required by school
  const conditionalItems = [];

  if (school.greRequired === true) {
    conditionalItems.push(
      { id: 'c5', label: 'Complete the GRE', completed: false, isDefault: true, isConditional: true, requirementType: 'gre', requirementSource: 'database' },
      { id: 'c6', label: 'Send GRE Scores', completed: false, isDefault: true, isConditional: true, requirementType: 'gre', requirementSource: 'database' }
    );
  }

  if (school.ccrnRequired === true) {
    conditionalItems.push(
      { id: 'c7', label: 'Complete CCRN', completed: false, isDefault: true, isConditional: true, requirementType: 'ccrn', requirementSource: 'database' }
    );
  }

  if (school.shadowingRequired === true) {
    const hours = school.shadowingHours ? ` (${school.shadowingHours} hours)` : '';
    conditionalItems.push(
      { id: 'c13', label: `Complete Shadowing${hours}`, completed: false, isDefault: true, isConditional: true, requirementType: 'shadowing', requirementSource: 'database' }
    );
  }

  // Combine: universal items with conditional items inserted in logical order
  return [
    ...universalItems.slice(0, 4),  // c1-c4
    ...conditionalItems,             // GRE, CCRN, Shadowing (if required)
    ...universalItems.slice(4),      // c8-c12
  ];
}
```

---

## "Not Required" Section

When a conditional item is NOT on the checklist (because our database says the school doesn't require it), show a **"Not Required"** section below the checklist.

### UI Pattern

```
┌─────────────────────────────────────────────────┐
│  Application Checklist                          │
│  ─────────────────────────────────────────────  │
│  ☑ Verify all program requirements              │
│  ☐ Request official Transcripts                 │
│  ☐ Complete Prerequisites                       │
│  ...                                            │
│                                                 │
│  ─────────────────────────────────────────────  │
│  Not Required (per our database)                │
│                                                 │
│  GRE           [+ Add to checklist]             │
│  CCRN          [+ Add to checklist]             │
│                                                 │
│  ⚑ Data wrong? Report it (+5 pts)              │
└─────────────────────────────────────────────────┘
```

### When User Clicks "Add to checklist"

1. Add the conditional item(s) to the checklist
2. Mark with `userOverride: true`
3. Item now appears in main checklist
4. User can remove it later (unlike default items)

---

## Data Model

### ChecklistItem Extended Fields

```typescript
interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  isDefault: boolean;           // System-generated vs user-added custom item

  // NEW fields for dynamic system
  isConditional: boolean;       // GRE, CCRN, Shadowing items
  requirementType: 'gre' | 'ccrn' | 'shadowing' | null;
  requirementSource: 'database' | 'user_added' | null;
  userOverride: boolean;        // True if user added back a "not required" item

  excludesTaxonomy: string | null;  // For filtering resources when completed
}
```

### TargetProgramData Extensions

```typescript
interface TargetProgramData {
  // ... existing fields
  checklist: ChecklistItem[];           // Now dynamically generated
  userOverrides: ('gre' | 'ccrn' | 'shadowing')[];  // Track user overrides
}
```

---

## Report Inaccurate Data Form

When users discover our database is wrong, they can report it via a flag icon.

### Form Location
- School Profile page (SchoolHeader.jsx)
- Target Program Detail page (header area)

### Form Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| schoolId | Hidden | Auto | From context |
| schoolName | Hidden | Auto | From context |
| category | Multi-select | Yes (min 1) | GRE, CCRN, GPA, Experience, Deadline, Prerequisites, Shadowing, Contact, References, Tuition, Program Details, Other |
| correction | Text | Yes | "What should it say?" |
| sourceUrl | URL | No | Optional proof |
| additionalNotes | Textarea | No | Extra context |

### Points (from gamification-system.md)
- 5 points per submission
- 10 submissions/week max
- 217 lifetime max
- "Feedback Champion" badge at 3+ submissions

---

## Flow: When User Adds a Target Program

```
1. User clicks "Make Target" on a saved program
                ↓
2. System calls generateChecklistForSchool(school)
                ↓
3. Checklist generated with:
   - 9 universal items (always)
   - 0-4 conditional items (based on greRequired, ccrnRequired, shadowingRequired)
                ↓
4. Target program created with generated checklist
                ↓
5. User views Target Program Detail page
                ↓
6. Checklist shows current items
                ↓
7. "Not Required" section shows any excluded conditionals
                ↓
8. User can add back any item if our DB is wrong
```

---

## Edge Cases

| Edge Case | Handling |
|-----------|----------|
| School has null/undefined for greRequired | Treat as "unknown" - do NOT include, show in "Not Required" |
| User adds GRE then data updates to say not required | Keep user's version - do not auto-remove |
| User completes GRE items then realizes not needed | Items stay checked (filters out GRE resources) |
| School data updated after target created | Do NOT auto-update existing checklists |
| Multiple programs with different requirements | Each target has its own independent checklist |

---

## Implementation Files

| File | Purpose |
|------|---------|
| `/src/lib/checklistGenerator.js` | Core generation logic |
| `/src/hooks/usePrograms.js` | Modify `convertToTarget()` to use generator |
| `/src/components/features/programs/ApplicationChecklist.jsx` | Add "Not Required" section |
| `/src/components/features/schools/ReportInaccurateDataModal.jsx` | Data correction form |
| `/src/data/mockPrograms.js` | Update ChecklistItem type |
