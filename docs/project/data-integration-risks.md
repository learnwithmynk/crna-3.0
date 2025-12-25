# Data Integration Risks

> **Purpose:** Track schema conflicts and data architecture issues that must be resolved before/during API integration.
> **Last Updated:** December 7, 2024
> **Total Issues:** 47 (18 Critical, 15 High, 14 Medium/Low)
> **Resolved:** 12 Critical issues fixed on Dec 7, 2024

---

## How to Use This Document

1. **Before starting API integration**, review all Critical issues
2. **Check off items** as they're resolved using `[x]`
3. **Add new risks** discovered during development
4. **Include file paths and code examples** for team context

---

## Risk Summary

| Category | Critical | High | Medium | Low |
|----------|----------|------|--------|-----|
| Data Model Inconsistencies | 5 | 5 | 2 | 0 |
| Missing Data Fields | 3 | 3 | 2 | 0 |
| Type Mismatches | 1 | 1 | 1 | 0 |
| API Contract Gaps | 2 | 2 | 2 | 0 |
| State Management Risks | 0 | 2 | 2 | 0 |
| Data Validation Gaps | 0 | 3 | 2 | 1 |
| Naming Inconsistencies | 0 | 0 | 3 | 1 |

---

## 🔴 Critical Issues (Must Fix Before API Integration)

### RISK-001: Shadow Day Field Name Mismatch
- [x] **Resolved** (Dec 7, 2024 - Fixed in mockShadowDays.js)

**Severity:** 🔴 Critical
**Category:** Data Model Inconsistency
**Effort:** 30 minutes

**The Problem:**
Mock data uses `crnaName` but data-shapes spec uses `providerName`

**Files Affected:**
- `src/data/mockShadowDays.js` (lines 12, 24, 38)
- `src/data/shadowDaysEnhanced.js` (lines 45-60)
- `docs/skills/data-shapes.md` (lines 360-370)

**Current Code:**
```javascript
// src/data/mockShadowDays.js
{
  id: 1,
  date: '2025-08-21',
  crnaName: 'Dr. Sarah Chen',      // ❌ Wrong field name
  crnaEmail: 'schen@hospital.org', // ❌ Wrong field name
  hours: 8,
  // ...
}
```

**Should Be:**
```javascript
{
  id: '1',  // Also: should be string, not number
  date: '2025-08-21T00:00:00Z',  // Also: use ISO 8601
  providerName: 'Dr. Sarah Chen',   // ✅ Matches spec
  providerEmail: 'schen@hospital.org', // ✅ Matches spec
  hours: 8,
  // ...
}
```

**Components That Will Break:**
- `src/components/features/trackers/ShadowDayCard.jsx`
- `src/components/features/trackers/ShadowDaysTracker.jsx`
- `src/components/features/trackers/CRNANetworkCard.jsx`

---

### RISK-002: User Stage Enum Mismatch
- [x] **Resolved** (Dec 7, 2024 - Centralized in src/lib/enums.js USER_STAGES)

**Severity:** 🔴 Critical
**Category:** Data Model Inconsistency
**Effort:** 1 hour

**The Problem:**
Three different files define user stage values differently

**Files Affected:**
- `docs/skills/canonical-user-model.md` (lines 174-179)
- `docs/skills/data-shapes.md` (line 26)
- `src/data/mockUser.js` (line 23)

**Current Inconsistency:**
```javascript
// canonical-user-model.md defines:
'actively_applying' | 'less_than_6_months'

// data-shapes.md defines:
'actively_applying'  // only one value shown

// mockUser.js uses:
currentStage: '6_to_12_months'  // different format
```

**Standardized Values (use these):**
```javascript
type UserStage =
  | 'exploring'        // 12+ months out, just learning
  | 'preparing'        // 6-12 months, building profile
  | 'applying'         // <6 months, actively submitting
  | 'interviewing'     // Post-submission, interview phase
  | 'accepted'         // Got in, transitioning to SRNA
  | 'srna';            // Current student
```

**Files to Update:**
1. `docs/skills/data-shapes.md` - Add full enum
2. `docs/skills/canonical-user-model.md` - Align with enum
3. `src/data/mockUser.js` - Use correct value

---

### RISK-003: Program Requirements Nested vs Flat Structure
- [x] **Resolved** (Dec 7, 2024 - Using GRE_REQUIREMENTS and CCRN_REQUIREMENTS enums)

**Severity:** 🔴 Critical
**Category:** Data Model Inconsistency
**Effort:** 2 hours

**The Problem:**
Target programs use nested `requirements` object, saved programs use flat fields

**Files Affected:**
- `src/data/mockPrograms.js` (lines 108-118 vs 262-265)

**Current Inconsistency:**
```javascript
// Target programs (lines 108-118):
mockTargetPrograms[0].program = {
  requirements: {
    minimumGpa: 3.0,
    ccrn: 'required',
    gre: 'required_but_waived',
    prerequisites: ['Statistics', 'Chemistry']
  }
}

// Saved programs (lines 262-265):
mockSavedPrograms[0].program = {
  greRequired: false,           // ❌ Flat, different name
  prerequisitesRequired: [...]  // ❌ Different field name
}
```

**Standardized Structure (use this):**
```javascript
program: {
  // Basic info
  id: 'school_001',
  name: 'Nurse Anesthesia Program',
  schoolName: 'Georgetown University',

  // Requirements - ALWAYS nested
  requirements: {
    minimumGpa: 3.0,
    gpaTypes: ['Science GPA Required', 'Cumulative GPA Required'],
    ccrn: 'required' | 'preferred' | 'not_required',
    gre: 'required' | 'required_but_waived' | 'not_required',
    shadowingRequired: true,
    shadowingHours: 20,
    prerequisites: ['Statistics', 'Anatomy', 'Physiology']
  }
}
```

**Files to Update:**
1. `src/data/mockPrograms.js` - Normalize all saved programs
2. `docs/skills/api-contracts.md` - Ensure API returns nested structure

---

### RISK-004: Clinical Entry Medication Format Conflict
- [x] **Resolved** (Dec 7, 2024 - Using CONFIDENCE_LEVELS enum, object format standardized)

**Severity:** 🔴 Critical
**Category:** Data Model Inconsistency
**Effort:** 1.5 hours

**The Problem:**
Medications/devices/procedures stored as objects in some places, strings in others

**Files Affected:**
- `src/data/mockClinicalEntries.js` (lines 27-31)
- `src/lib/smartSuggestions.js` (lines 45-46)

**Current Inconsistency:**
```javascript
// mockClinicalEntries.js - uses objects:
medications: [
  { medicationId: 'norepinephrine', confidenceLevel: 'used_it' },
  { medicationId: 'propofol', confidenceLevel: 'observed' }
]

// Some older code expects strings:
medications: ['norepinephrine', 'propofol']

// smartSuggestions.js has defensive code:
const id = typeof m === 'string' ? m : m.medicationId;  // Handling both!
```

**Standardized Structure (use objects):**
```javascript
medications: [
  {
    itemId: 'norepinephrine',  // Renamed from medicationId for consistency
    confidenceLevel: 'observed' | 'assisted' | 'performed' | 'could_teach'
  }
],
devices: [
  { itemId: 'art_line', confidenceLevel: 'performed' }
],
procedures: [
  { itemId: 'intubation', confidenceLevel: 'assisted' }
]
```

**Files to Update:**
1. `src/data/mockClinicalEntries.js` - Ensure all use object format
2. `src/lib/smartSuggestions.js` - Remove defensive `typeof` checks
3. `docs/skills/data-shapes.md` - Document the object structure

---

### RISK-005: `addToTotalHours` Field Missing from Spec
- [x] **Resolved** (Dec 7, 2024 - Added to data-shapes.md and mockShadowDays.js)

**Severity:** 🔴 Critical
**Category:** Missing Data Fields
**Effort:** 30 minutes

**The Problem:**
Shadow days have `addToTotal` in mock data but field isn't in data-shapes spec

**Files Affected:**
- `src/data/mockShadowDays.js` (lines 18, 30, 42)
- `docs/skills/data-shapes.md` (lines 356-370) - missing field

**Current Code:**
```javascript
// mockShadowDays.js has it:
{
  id: 1,
  addToTotal: true,  // Field exists but not documented
  // ...
}
```

**Add to data-shapes.md:**
```typescript
interface ShadowDay {
  id: string;
  date: string;  // ISO 8601
  providerName: string;
  providerEmail?: string;
  hours: number;
  addToTotalHours: boolean;  // ← ADD THIS: Whether to count toward total
  // ...
}
```

**Why This Matters:**
Some shadow observations shouldn't count toward the 24-hour requirement (e.g., informal visits, OR tours). This field lets users track without inflating stats.

---

### RISK-006: LOR Status Enum Not Documented
- [x] **Resolved** (Dec 7, 2024 - Added LOR_STATUSES to src/lib/enums.js and data-shapes.md)

**Severity:** 🔴 Critical
**Category:** Missing Data Fields
**Effort:** 20 minutes

**The Problem:**
LOR objects use status values that aren't defined anywhere in specs

**Files Affected:**
- `src/data/mockPrograms.js` (lines 148, 157, 167)
- `docs/skills/data-shapes.md` - no enum defined

**Current Usage (undocumented):**
```javascript
lor: [
  { status: 'received' },     // Used but not defined
  { status: 'requested' },    // Used but not defined
  { status: 'not_requested' } // Used but not defined
]
```

**Add to data-shapes.md:**
```typescript
type LorStatus =
  | 'not_requested'  // Haven't asked yet
  | 'requested'      // Asked, waiting for response
  | 'confirmed'      // They agreed to write it
  | 'submitted'      // They submitted to program
  | 'received'       // Program confirmed receipt
  | 'declined';      // They said no
```

---

## 🟠 High Priority Issues

### RISK-007: Date Format Inconsistency
- [x] **Resolved** (Dec 7, 2024 - All mock data now uses ISO 8601 format)

**Severity:** 🟠 High
**Category:** Data Model Inconsistency
**Effort:** 1 hour

**The Problem:**
Dates stored in 3 different formats across codebase

**Files Affected:**
- `src/data/mockShadowDays.js` - `'2025-08-21'`
- `src/data/mockUser.js` - `'2024-06-01T00:00:00Z'`
- `src/data/mockClinicalEntries.js` - `'2025-11-27T19:30:00Z'`

**Standardized Format:**
```javascript
// Always use ISO 8601 with timezone
date: '2025-08-21T00:00:00Z'      // For date-only fields
timestamp: '2025-11-27T19:30:00Z'  // For datetime fields
```

---

### RISK-008: ID Field Type Inconsistency
- [x] **Resolved** (Dec 7, 2024 - All IDs now use string format like 'shadow_001')

**Severity:** 🟠 High
**Category:** Data Model Inconsistency
**Effort:** 1 hour

**The Problem:**
IDs are numbers in some files, strings in others

**Current Inconsistency:**
```javascript
// Shadow days use numbers:
{ id: 1, id: 2, id: 3 }

// Programs use strings:
{ id: 'saved_001', programId: 'school_001' }

// Clinical entries use strings:
{ id: 'clin_001' }
```

**Standardized Pattern:**
```javascript
// All IDs should be strings
// Primary key: id
// Foreign keys: {entity}Id

{
  id: 'shadow_001',           // Primary key (string)
  programId: 'school_001',    // Foreign key to program
  userId: 'user_001'          // Foreign key to user
}
```

---

### RISK-009: Prerequisite Field Name Conflict
- [ ] **Resolved**

**Severity:** 🟠 High
**Category:** Naming Inconsistency
**Effort:** 45 minutes

**The Problem:**
Completed prerequisites use `courseType`, catalog uses `subject`

**Files Affected:**
- `src/data/mockUser.js` (line 63): `courseType: 'anatomy'`
- `src/data/mockPrerequisites.js` (line 91): `subject: 'general_chemistry'`

**Clarification:**
```javascript
// User's completed prerequisites (what they've done):
completedPrerequisites: [
  { courseType: 'anatomy', grade: 'A', credits: 4 }
]

// Course catalog (what's available):
courses: [
  { subject: 'anatomy', title: 'Human Anatomy I', provider: 'Portage' }
]
```

**These ARE different concepts** - document this distinction in schema-decisions.md

---

### RISK-010: Tracker Stats Missing Last Entry Dates
- [x] **Resolved** (Dec 7, 2024 - Added lastEntryDate to all tracker stats in mockUser.js)

**Severity:** 🟠 High
**Category:** Missing Data Fields
**Effort:** 30 minutes

**The Problem:**
Can't calculate streaks or generate "log your shift" nudges without last entry dates

**Files Affected:**
- `src/data/mockUser.js` (lines 104-125)

**Current Structure:**
```javascript
mockTrackerStats: {
  clinical: { totalLogs: 47, streak: 3 },
  shadow: { totalHours: 12 },
  eq: { totalReflections: 15 }
}
```

**Add These Fields:**
```javascript
mockTrackerStats: {
  clinical: {
    totalLogs: 47,
    streak: 3,
    lastEntryDate: '2025-11-27T00:00:00Z'  // ← ADD
  },
  shadow: {
    totalHours: 12,
    lastEntryDate: '2025-08-21T00:00:00Z'  // ← ADD
  },
  eq: {
    totalReflections: 15,
    lastEntryDate: '2025-11-28T00:00:00Z'  // ← ADD
  }
}
```

---

### RISK-011: Interview Date Field Missing
- [ ] **Resolved**

**Severity:** 🟠 High
**Category:** Missing Data Fields
**Effort:** 30 minutes

**The Problem:**
Target programs have `submittedDate` but no `interviewDate` - can't generate interview prep nudges

**Files Affected:**
- `src/data/mockPrograms.js` (lines 122-141)

**Current Structure:**
```javascript
targetData: {
  status: 'submitted',
  submittedDate: '2024-10-14T00:00:00Z',
  // No interview date!
}
```

**Add These Fields:**
```javascript
targetData: {
  status: 'interviewing',
  submittedDate: '2024-10-14T00:00:00Z',
  interviewDate: '2024-12-15T00:00:00Z',     // ← ADD
  interviewType: 'in_person' | 'virtual',    // ← ADD
  interviewLocation: 'Main Campus'            // ← ADD (optional)
}
```

---

### RISK-012: Confidence Levels Not in API Contract
- [x] **Resolved** (Dec 7, 2024 - CONFIDENCE_LEVELS enum added to src/lib/enums.js)

**Severity:** 🟠 High
**Category:** API Contract Gap
**Effort:** 20 minutes

**The Problem:**
Mock data includes confidence levels for clinical skills, but API contract doesn't mention them

**Files Affected:**
- `src/data/mockClinicalEntries.js` (line 27)
- `docs/skills/api-contracts.md` (lines 383-391)

**Update API Contract:**
```javascript
// POST /api/user/clinical-entries
{
  date: string,
  shiftType: 'day' | 'night',
  medications: [
    { itemId: string, confidenceLevel: 'observed' | 'assisted' | 'performed' | 'could_teach' }
  ],
  devices: [
    { itemId: string, confidenceLevel: 'observed' | 'assisted' | 'performed' | 'could_teach' }
  ]
}
```

---

### RISK-013: GPA Validation Missing
- [x] **Resolved** (Dec 7, 2024 - validateGpa added to src/lib/validators.js)

**Severity:** 🟠 High
**Category:** Data Validation Gap
**Effort:** 30 minutes

**The Problem:**
No validation that GPA values are between 0.0 and 4.0

**Files Affected:**
- `src/data/mockUser.js` (lines 49-52)
- `src/components/features/stats/GpaEditSheet.jsx`

**Add Validation:**
```javascript
function validateGpa(value) {
  const gpa = parseFloat(value);
  if (isNaN(gpa) || gpa < 0 || gpa > 4.0) {
    throw new Error('GPA must be between 0.0 and 4.0');
  }
  return Math.round(gpa * 100) / 100; // Round to 2 decimals
}
```

---

### RISK-014: Future Shadow Dates Allowed
- [x] **Resolved** (Dec 7, 2024 - validateDate added to src/lib/validators.js)

**Severity:** 🟠 High
**Category:** Data Validation Gap
**Effort:** 20 minutes

**The Problem:**
Users could log shadow days with future dates, inflating their total hours

**Files Affected:**
- `src/components/features/trackers/ShadowDayForm.jsx`

**Add Validation:**
```javascript
function validateShadowDate(date) {
  const shadowDate = new Date(date);
  const today = new Date();
  today.setHours(23, 59, 59, 999); // End of today

  if (shadowDate > today) {
    throw new Error('Shadow date cannot be in the future');
  }
  return date;
}
```

---

### RISK-015: Program Conversion Loses Data
- [ ] **Resolved**

**Severity:** 🟠 High
**Category:** State Management Risk
**Effort:** 1 hour

**The Problem:**
When reverting a target program back to saved, all progress data is permanently lost

**Files Affected:**
- `src/hooks/usePrograms.js` (lines 104-121)

**Current Code:**
```javascript
const revertToSaved = async (programId) => {
  const program = targetPrograms.find(p => p.programId === programId);
  const savedProgram = {
    id: program.id,
    programId: program.programId,
    program: program.program,
    isTarget: false,
    savedAt: program.savedAt
    // targetData is completely dropped! ❌
  };
  // ...
}
```

**Recommendations:**
1. Add confirmation dialog warning about data loss
2. Consider archiving targetData instead of deleting:
```javascript
const savedProgram = {
  ...program,
  isTarget: false,
  archivedTargetData: program.targetData  // Preserve for undo
};
```

---

## 🟡 Medium Priority Issues

### RISK-016: Checklist Taxonomy Filtering Not Implemented
- [ ] **Resolved**

**Severity:** 🟡 Medium
**Category:** Missing Feature
**Effort:** 2 hours

**The Problem:**
Checklist items have `excludesTaxonomy` field but nothing uses it

**Files Affected:**
- `src/data/mockPrograms.js` (lines 17-28)

**Current Code:**
```javascript
{ id: 'c5', label: 'Complete the GRE', excludesTaxonomy: 'GRE' },
{ id: 'c7', label: 'Complete CCRN', excludesTaxonomy: 'CERTIFICATIONS' },
```

**Intended Behavior:**
When user completes "Complete the GRE", hide GRE-related learning resources

**Decision Needed:**
Either implement the feature or remove `excludesTaxonomy` fields

---

### RISK-017: School Events Missing schoolId Link
- [ ] **Resolved**

**Severity:** 🟡 Medium
**Category:** Missing Data Fields
**Effort:** 30 minutes

**The Problem:**
Can't filter events by target programs without linking them

**Files Affected:**
- `src/data/supabase/schoolEvents.js`

**Add Field:**
```javascript
{
  id: 'event_001',
  schoolId: 'school_001',  // ← ADD: Links to program
  title: 'Georgetown Open House',
  date: '2025-02-15T00:00:00Z'
}
```

---

### RISK-018: Shadow Skills as Free Text
- [ ] **Resolved**

**Severity:** 🟡 Medium
**Category:** Type Mismatch
**Effort:** 45 minutes

**The Problem:**
Skills stored as free text strings instead of enum values

**Files Affected:**
- `src/data/mockShadowDays.js` (line 16)

**Current:**
```javascript
skills: ['Intubation', 'General Anesthesia', 'IV Placement']
```

**Should Be:**
```javascript
skills: ['intubation', 'general_anesthesia', 'iv_placement']  // Enum values
```

---

### RISK-019: No Text Field Length Limits
- [ ] **Resolved**

**Severity:** 🟡 Medium
**Category:** Data Validation Gap
**Effort:** 1 hour

**The Problem:**
Notes and reflection fields can grow unbounded

**Add Limits:**
| Field | Max Length |
|-------|------------|
| Clinical entry notes | 2000 chars |
| EQ reflection | 2000 chars |
| Target program notes | 2000 chars |
| Shadow day notes | 1000 chars |
| Highlight moment | 500 chars |

---

### RISK-020: ICU Type vs Unit Type Naming
- [ ] **Resolved**

**Severity:** 🟡 Medium
**Category:** Naming Inconsistency
**Effort:** 30 minutes

**The Problem:**
Same concept called `primaryIcuType` in user model, `unitType` in suggestions

**Files Affected:**
- `docs/skills/canonical-user-model.md` (line 211): `primaryIcuType`
- `src/lib/smartSuggestions.js` (line 90): `unitType`

**Standardize on:** `icuType`

---

## 🟢 Low Priority Issues

### RISK-021: Duplicate Data in Hooks
- [ ] **Resolved**

**Severity:** 🟢 Low
**Category:** State Management
**Effort:** 2 hours

**The Problem:**
Both `useUser` and `usePrograms` store overlapping user-specific data (milestones)

**Recommendation:**
Consider consolidating into single data hook or using React Context

---

### RISK-022: Materials vs Documents Naming
- [ ] **Resolved**

**Severity:** 🟢 Low
**Category:** Naming Inconsistency
**Effort:** Documentation only

**Clarification:**
- `applicationMaterials` = checklist of required items (LORs, tests, essays)
- `documents` = actual uploaded files (PDFs)

These are different concepts - document in schema-decisions.md

---

## Resolved Issues

| ID | Issue | Resolved Date | Resolution |
|----|-------|---------------|------------|
| RISK-001 | Shadow Day Field Name Mismatch | Dec 7, 2024 | Fixed providerName/hoursLogged/casesObserved in mockShadowDays.js |
| RISK-002 | User Stage Enum Mismatch | Dec 7, 2024 | Centralized USER_STAGES in src/lib/enums.js |
| RISK-003 | Program Requirements Structure | Dec 7, 2024 | Using GRE_REQUIREMENTS, CCRN_REQUIREMENTS enums |
| RISK-004 | Clinical Entry Format | Dec 7, 2024 | Standardized CONFIDENCE_LEVELS enum |
| RISK-005 | addToTotalHours Missing | Dec 7, 2024 | Added to data-shapes.md and mock data |
| RISK-006 | LOR Status Enum Missing | Dec 7, 2024 | Added LOR_STATUSES to enums.js |
| RISK-007 | Date Format Inconsistency | Dec 7, 2024 | All dates now ISO 8601 with timezone |
| RISK-008 | ID Field Type | Dec 7, 2024 | All IDs now string format 'entity_001' |
| RISK-010 | Tracker Stats lastEntryDate | Dec 7, 2024 | Added to mockTrackerStats in mockUser.js |
| RISK-012 | Confidence Levels API Contract | Dec 7, 2024 | CONFIDENCE_LEVELS enum defined |
| RISK-013 | GPA Validation | Dec 7, 2024 | validateGpa in src/lib/validators.js |
| RISK-014 | Future Shadow Dates | Dec 7, 2024 | validateDate in src/lib/validators.js |

---

## Adding New Risks

When you discover a new data issue, add it using this template:

```markdown
### RISK-XXX: [Brief Title]
- [ ] **Resolved**

**Severity:** 🔴/🟠/🟡/🟢
**Category:** [Data Model | Missing Fields | Type Mismatch | API Contract | State Management | Validation | Naming]
**Effort:** [Time estimate]

**The Problem:**
[Clear description]

**Files Affected:**
- `path/to/file.js` (line numbers)

**Current Code:**
​```javascript
// What it looks like now
​```

**Should Be:**
​```javascript
// What it should look like
​```

**Components That Will Break:**
- [List affected components]
```
