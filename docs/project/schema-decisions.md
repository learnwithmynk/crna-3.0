# Schema Decisions

> **Purpose:** The source of truth for field naming conventions and data types.
> **When to use:** Before adding new fields or when unsure what to call something.
> **Last Updated:** December 13, 2024

---

## Quick Reference

| Question | Answer |
|----------|--------|
| camelCase or snake_case? | `camelCase` in frontend, `snake_case` in Supabase |
| How to name IDs? | `id` for primary key, `{entity}Id` for foreign keys |
| Date format? | ISO 8601 with timezone: `2025-01-15T00:00:00Z` |
| Boolean naming? | Use `is` or `has` prefix: `isTarget`, `hasGre` |
| Arrays? | Plural nouns: `medications`, `prerequisites` |

---

## Naming Conventions

### General Rules

```javascript
// ✅ DO: camelCase in frontend/React code
{ firstName: 'Jane', lastName: 'Doe', overallGpa: 3.5 }

// ✅ DO: snake_case in Supabase tables
// first_name, last_name, overall_gpa

// ❌ DON'T: PascalCase
{ FirstName: 'Jane', LastName: 'Doe' }
```

**Note:** Supabase uses `snake_case` (`overall_gpa`), frontend uses `camelCase` (`overallGpa`). Hooks/API layer handles the transformation.

### ID Fields

```javascript
// Primary key: just "id"
{ id: 'user_001' }

// Foreign keys: {entity}Id
{
  id: 'shadow_001',
  userId: 'user_001',      // References user
  programId: 'school_001'  // References program
}

// ✅ All IDs are strings (even if numeric)
{ id: '1', id: '42', id: 'abc_123' }

// ❌ DON'T use numbers
{ id: 1, id: 42 }
```

### Boolean Fields

```javascript
// ✅ Use is/has prefix
{
  isTarget: true,
  isCompleted: false,
  hasGre: true,
  hasShadowing: true
}

// ❌ DON'T use adjectives alone
{
  target: true,    // Ambiguous
  completed: false // Ambiguous
}
```

### Date Fields

```javascript
// ✅ Always ISO 8601 with timezone
{
  createdAt: '2025-01-15T14:30:00Z',
  updatedAt: '2025-01-16T09:00:00Z',
  applicationDeadline: '2025-10-15T00:00:00Z'  // Use midnight for date-only
}

// ❌ DON'T use other formats
{
  date: '2025-01-15',        // Missing time/timezone
  date: '01/15/2025',        // Ambiguous format
  date: 'January 15, 2025'   // Not machine-readable
}
```

### Array Fields

```javascript
// ✅ Plural nouns
{
  medications: [...],
  prerequisites: [...],
  skills: [...]
}

// ❌ DON'T use singular
{
  medication: [...],
  prerequisite: [...]
}
```

---

## Enum Definitions

### Application Stage

```typescript
type ApplicationStage =
  | 'exploring'       // Early research, 12+ months out
  | 'strategizing'    // Building plan, identifying programs
  | 'executing'       // Actively working on applications
  | 'interviewing'    // Interview phase
  | 'post_decision';  // Accepted, waitlisted, or deciding
```

**Usage:**
```javascript
// src/lib/enums.js - APPLICATION_STAGES
guidanceState: {
  applicationStage: 'executing'
}
```

---

### Program Status (Target Program)

```typescript
// 8 statuses - UPDATED Dec 5, 2024
type ProgramStatus =
  | 'not_started'        // Just added as target, no work done
  | 'in_progress'        // Actively working on application
  | 'submitted'          // Application sent
  | 'interview_invite'   // Received interview invitation
  | 'interview_complete' // Finished interviewing
  | 'waitlisted'         // On waitlist
  | 'denied'             // Not accepted
  | 'accepted';          // Got in!
```

**Note:** No "withdrew" status - users who withdraw just remove from targets.

**Usage:**
```javascript
// src/data/mockPrograms.js
targetData: {
  status: 'submitted'
}
```

---

### LOR Status

```typescript
type LorStatus =
  | 'not_requested'  // Haven't asked yet
  | 'requested'      // Asked, waiting for response
  | 'confirmed'      // They agreed to write it
  | 'submitted'      // They submitted to program
  | 'received'       // Program confirmed receipt
  | 'declined';      // They said no
```

**Usage:**
```javascript
lor: [
  { personName: 'Dr. Smith', status: 'received' }
]
```

---

### GRE Requirement

```typescript
type GreRequirement =
  | 'required'            // Must have GRE
  | 'required_but_waived' // Required but waivers available
  | 'preferred'           // Helpful but not required
  | 'not_required';       // No GRE needed
```

**Usage:**
```javascript
requirements: {
  gre: 'required_but_waived'
}
```

---

### CCRN Requirement

```typescript
type CcrnRequirement =
  | 'required'       // Must have before applying
  | 'preferred'      // Helps but not required
  | 'not_required';  // Not needed
```

---

### Clinical Confidence Level

```typescript
type ConfidenceLevel =
  | 'observed'     // Watched it being done
  | 'assisted'     // Helped with the procedure
  | 'performed'    // Did it independently
  | 'could_teach'; // Expert level, could teach others
```

**Usage:**
```javascript
medications: [
  { itemId: 'norepinephrine', confidenceLevel: 'performed' }
]
```

---

### ICU Type

```typescript
type IcuType =
  | 'micu'         // Medical ICU
  | 'sicu'         // Surgical ICU
  | 'cvicu'        // Cardiovascular ICU
  | 'cticu'        // Cardiothoracic ICU
  | 'neuro_icu'    // Neuro ICU
  | 'trauma_icu'   // Trauma ICU
  | 'burn_icu'     // Burn ICU
  | 'picu'         // Pediatric ICU
  | 'nicu'         // Neonatal ICU
  | 'mixed'        // Mixed/general ICU
  | 'flight_nurse' // Flight Nurse
  | 'other';       // Other
```

---

## Data Structures

### User Profile

```javascript
{
  id: 'user_001',
  email: 'jane@example.com',
  firstName: 'Jane',
  lastName: 'Doe',

  // Stage
  currentStage: 'applying',  // See UserStage enum

  // Gamification
  points: 847,
  level: 3,
  badges: ['first_shadow', 'gpa_entered'],

  // Academic
  academicProfile: {
    cumulativeGpa: 3.75,
    scienceGpa: 3.68,
    greQuantitative: 158,
    greVerbal: 156,
    greWriting: 4.5
  },

  // Clinical
  clinicalProfile: {
    primaryIcuType: 'cvicu',  // Note: icuType, not unitType
    yearsExperience: 2.5,
    hasCcrn: true,
    ccrnDate: '2024-06-01T00:00:00Z'
  }
}
```

---

### Program (Saved or Target)

```javascript
{
  id: 'saved_001',
  programId: 'school_001',  // Foreign key
  userId: 'user_001',       // Foreign key

  // The program data (from school database)
  program: {
    id: 'school_001',
    name: 'Nurse Anesthesia Program',
    schoolName: 'Georgetown University',
    location: { city: 'Washington', state: 'DC' },
    imageUrl: 'https://...',
    applicationDeadline: '2025-10-15T00:00:00Z',

    // ALWAYS nested, never flat
    requirements: {
      minimumGpa: 3.0,
      gpaTypes: ['Science GPA Required', 'Cumulative GPA Required'],
      ccrn: 'required',
      gre: 'required_but_waived',
      shadowingRequired: true,
      shadowingHours: 20,
      prerequisites: ['Statistics', 'Chemistry', 'Anatomy']
    }
  },

  // User's relationship to this program
  isTarget: true,
  savedAt: '2024-08-20T00:00:00Z',

  // Only exists if isTarget: true
  targetData: {
    status: 'submitted',
    submittedDate: '2024-10-14T00:00:00Z',
    interviewDate: '2024-12-15T00:00:00Z',  // Optional
    notes: 'Talked with Dr. Smith at AANA',
    progress: 75,
    checklist: [...],
    lor: [...],
    documents: [...]
  }
}
```

---

### Shadow Day

```javascript
{
  id: 'shadow_001',           // String, not number
  userId: 'user_001',

  date: '2025-08-21T00:00:00Z',
  hours: 8,
  addToTotalHours: true,      // Whether to count toward total

  // Provider info (not "CRNA" - could be AA)
  providerName: 'Dr. Sarah Chen',   // Not crnaName
  providerEmail: 'schen@hospital.org',
  providerCredential: 'CRNA',  // or 'AA'

  location: 'City Hospital OR',
  facility: 'City Hospital',

  // Skills observed (enum values, lowercase)
  skills: ['intubation', 'general_anesthesia', 'iv_placement'],

  casesObserved: 5,
  notes: 'Great day, learned a lot about pediatric cases',

  // Follow-up tracking
  followUpStatus: 'thank_you_sent',
  savedToNetwork: true
}
```

---

### Clinical Entry

```javascript
{
  id: 'clin_001',
  userId: 'user_001',

  date: '2025-11-27T00:00:00Z',
  shiftType: 'day',  // or 'night'
  hoursWorked: 12,

  // All use object format with confidence level
  patientPopulations: [
    { itemId: 'cardiac_surgery', confidenceLevel: 'performed' }
  ],
  medications: [
    { itemId: 'norepinephrine', confidenceLevel: 'performed' },
    { itemId: 'propofol', confidenceLevel: 'observed' }
  ],
  devices: [
    { itemId: 'art_line', confidenceLevel: 'assisted' }
  ],
  procedures: [
    { itemId: 'intubation', confidenceLevel: 'observed' }
  ],

  acuityScore: 7,  // 1-10 scale
  notes: 'Busy shift with 2 codes',
  highlightMoment: 'Successfully managed difficult airway'
}
```

---

### LOR (Letter of Recommendation)

```javascript
{
  id: 'lor_001',
  programId: 'school_001',  // Which program it's for

  personName: 'Dr. Jane Smith',
  relationship: 'Clinical Supervisor',  // or 'ICU Director', 'CRNA Mentor'
  email: 'jsmith@hospital.org',

  status: 'received',  // See LorStatus enum
  requestedDate: '2024-09-01T00:00:00Z',
  receivedDate: '2024-09-15T00:00:00Z'
}
```

---

## Clarifications

### courseType vs subject

These are different fields for different purposes:

```javascript
// User's COMPLETED prerequisites (what they've done)
// Uses: courseType
completedPrerequisites: [
  { courseType: 'anatomy', grade: 'A', credits: 4 }
]

// Course CATALOG (what's available to take)
// Uses: subject
availableCourses: [
  { subject: 'anatomy', title: 'Human Anatomy I', provider: 'Portage' }
]
```

---

### applicationMaterials vs documents

```javascript
// applicationMaterials = Checklist of WHAT'S NEEDED
applicationMaterials: [
  { type: 'personal_statement', status: 'complete' },
  { type: 'lor', count: 3, received: 2 },
  { type: 'gre_scores', status: 'sent' }
]

// documents = Actual UPLOADED FILES
documents: [
  { id: 'doc_001', name: 'Personal_Statement_Final.pdf', type: 'personal_statement' },
  { id: 'doc_002', name: 'Resume_2024.pdf', type: 'resume' }
]
```

---

### providerName vs crnaName

**Use `providerName`** - not all anesthesia providers are CRNAs (some are AAs - Anesthesiologist Assistants).

```javascript
// ✅ Correct
{ providerName: 'Dr. Sarah Chen', providerCredential: 'CRNA' }
{ providerName: 'John Smith', providerCredential: 'AA' }

// ❌ Wrong
{ crnaName: 'Dr. Sarah Chen' }
```

---

## Adding New Fields

When adding a new field to the codebase:

1. **Check this document first** - Does a convention exist?
2. **Follow the naming rules** - camelCase, proper prefixes
3. **Add it here** - Update this doc with the new field
4. **Update data-shapes.md** - Add to the TypeScript interface

```markdown
### Example: Adding a new field

**Field:** applicationFee
**Type:** number (in cents, e.g., 7500 = $75.00)
**Location:** program.requirements.applicationFee
**Added:** 2024-12-05
**Reason:** Track costs for budget planning
```
