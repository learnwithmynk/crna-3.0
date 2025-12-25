# Mock Data Guidelines

How to create and use mock data during development.

---

## Purpose

Mock data allows us to:
1. Build complete UI without waiting for API integration
2. Test various states (empty, loading, full, error)
3. Document expected data shapes for dev team
4. Demo the app realistically

---

## File Location

All mock data lives in `/src/data/`:

```
src/data/
├── mockUser.js
├── mockPrograms.js
├── mockSchools.js
├── mockTrackers.js
├── mockPrerequisites.js
├── mockCommunity.js
├── mockMarketplace.js
├── mockEvents.js
└── mockGamification.js
```

---

## Mock Data Principles

### 1. Use Realistic Values
Don't use "Test School" or "Lorem ipsum" - use real school names, realistic GPAs, actual certification names.

**Bad:**
```javascript
const school = {
  name: "Test School 1",
  location: "City, ST",
  gpa: 4.0
};
```

**Good:**
```javascript
const school = {
  name: "Duke University School of Nursing",
  location: { city: "Durham", state: "NC" },
  minimumGpa: 3.2
};
```

### 2. Include Variety
Mix different states, statuses, and edge cases:
- Programs at different application stages
- Trackers with various entry counts
- Users at different points in their journey

### 3. Match Data Shapes Exactly
Mock data must match the interfaces in `data-shapes.md`:

```javascript
// If the interface says:
// interface Program { id: string; name: string; location: { city: string; state: string } }

// Mock data must match:
const program = {
  id: "prog_123",      // ✅ string
  name: "Duke CRNA",   // ✅ string
  location: {          // ✅ object with city and state
    city: "Durham",
    state: "NC"
  }
};
```

### 4. Mark with TODO Comments
Every file using mock data should have a clear TODO:

```javascript
// TODO: Replace with API call to GET /api/programs
import { mockPrograms } from '@/data/mockPrograms';
```

### 5. Use Consistent IDs
Use prefixed IDs that indicate the type:
- Users: `user_123`
- Programs: `prog_123`
- Schools: `school_123`
- Entries: `entry_123`

---

## Mock Data Templates

### mockUser.js

```javascript
// src/data/mockUser.js

export const mockUser = {
  id: "user_001",
  email: "sarah.johnson@email.com",
  name: "Sarah Johnson",
  preferredName: "Sarah",
  avatarUrl: "/images/default-avatar.png",
  
  subscriptionTier: "core",
  subscriptionStatus: "active",
  trialEndsAt: null,
  
  currentStage: "6_to_12_months",
  programStatus: "some_targets",
  
  points: 847,
  level: 3,
  levelName: "Ambitious Achiever",
  badges: [
    { id: "badge_1", name: "Target Trailblazer", earnedAt: "2024-09-15" }
  ],
  
  createdAt: "2024-06-01",
  lastLoginAt: "2024-11-28",
  onboardingCompletedAt: "2024-06-03"
};

export const mockAcademicProfile = {
  userId: "user_001",
  overallGpa: 3.45,
  scienceGpa: 3.23,
  scienceGpaWithForgiveness: 3.35,
  last60Gpa: 3.52,
  gpaCalculated: true,
  
  greQuantitative: 156,
  greVerbal: 152,
  greAnalyticalWriting: 4.0,
  greCombined: 308,
  
  completedPrerequisites: [
    { courseType: "anatomy", year: 2015, grade: "B", schoolName: "ASU" },
    { courseType: "physiology", year: 2019, grade: "A", schoolName: "Portage" },
    { courseType: "pharmacology", year: 2019, grade: "B", schoolName: "Portage" }
  ]
};

export const mockClinicalProfile = {
  userId: "user_001",
  primaryIcuType: "micu",
  additionalIcuTypes: ["cvicu"],
  totalYearsExperience: 3.5,
  
  certifications: [
    { type: "ccrn", status: "passed", earnedDate: "2023-05-15" },
    { type: "bls", status: "passed", earnedDate: "2023-01-10" },
    { type: "acls", status: "passed", earnedDate: "2023-01-10" }
  ]
};
```

---

### mockPrograms.js

```javascript
// src/data/mockPrograms.js

export const mockTargetPrograms = [
  {
    id: "saved_001",
    programId: "school_001",
    program: {
      id: "school_001",
      name: "Doctor of Nurse Anesthesia Practice Program",
      schoolName: "Georgetown University",
      location: { city: "Washington", state: "DC" },
      imageUrl: "/images/schools/georgetown.jpg",
      type: "integrated",
      degree: "dnap",
      applicationDeadline: "2025-10-15",
      minimumGpa: 3.0
    },
    isTarget: true,
    savedAt: "2024-08-20",
    targetData: {
      status: "submitted",
      submittedDate: "2024-10-14",
      notes: "Strong program, talked with Dr. Smith at AANA.",
      checklist: [
        { id: "c1", label: "Verify all program requirements", completed: true, isDefault: true },
        { id: "c2", label: "Complete Prerequisites", completed: true, isDefault: true },
        { id: "c3", label: "Complete the GRE", completed: true, isDefault: true },
        { id: "c4", label: "Complete CCRN", completed: true, isDefault: true },
        { id: "c5", label: "Complete Resume", completed: true, isDefault: true },
        { id: "c6", label: "Complete Personal Statement", completed: false, isDefault: true },
        { id: "c7", label: "Request Letters of Recommendation", completed: false, isDefault: true }
      ],
      documents: [
        { id: "doc1", name: "Personal Statement - Georgetown", type: "personal_statement", uploadedAt: "2024-10-01" }
      ]
    }
  },
  {
    id: "saved_002",
    programId: "school_002",
    program: {
      id: "school_002",
      name: "Cedar Crest College Nurse Anesthesia Program",
      schoolName: "Cedar Crest College",
      location: { city: "Allentown", state: "PA" },
      imageUrl: "/images/schools/cedar-crest.jpg",
      type: "integrated",
      degree: "dnp",
      applicationDeadline: "2025-05-01",
      minimumGpa: 3.0
    },
    isTarget: true,
    savedAt: "2024-09-15",
    targetData: {
      status: "researching",
      notes: "",
      checklist: [
        { id: "c1", label: "Verify all program requirements", completed: false, isDefault: true },
        { id: "c2", label: "Complete Prerequisites", completed: false, isDefault: true }
      ],
      documents: []
    }
  }
];

export const mockSavedPrograms = [
  {
    id: "saved_003",
    programId: "school_003",
    program: {
      id: "school_003",
      name: "Edgewood College Nurse Anesthesia Program",
      schoolName: "Edgewood College",
      location: { city: "Madison", state: "WI" },
      imageUrl: "/images/schools/edgewood.jpg",
      type: "integrated",
      degree: "dnp",
      applicationDeadline: "2025-07-07",
      minimumGpa: 3.0,
      greRequired: false,
      prerequisitesRequired: ["Organic Chemistry", "Anatomy", "Physiology", "Microbiology"]
    },
    isTarget: false,
    savedAt: "2024-10-01"
  },
  {
    id: "saved_004",
    programId: "school_004",
    program: {
      id: "school_004",
      name: "Bellarmine University",
      schoolName: "Bellarmine University",
      location: { city: "Louisville", state: "KY" },
      imageUrl: "/images/schools/bellarmine.jpg",
      type: "integrated",
      degree: "dnp",
      applicationDeadline: "2025-10-15",
      minimumGpa: 3.0,
      greRequired: false
    },
    isTarget: false,
    savedAt: "2024-10-05"
  }
];
```

---

### mockTrackers.js

```javascript
// src/data/mockTrackers.js

export const mockClinicalEntries = [
  {
    id: "clinical_001",
    userId: "user_001",
    date: "2024-08-21",
    notes: "Today was a great day! Cared for complex cardiac patient.",
    patientPopulations: ["cardiac"],
    medications: ["norepinephrine", "vasopressin", "dopamine"],
    devices: ["mechanical_ventilation", "ecmo"],
    procedures: ["cardioversion"]
  },
  {
    id: "clinical_002",
    userId: "user_001",
    date: "2024-08-19",
    notes: "Cared for a critically ill patient on veno-venous ECMO. The patient was initially stable but required hemodynamic interventions.",
    patientPopulations: ["cardiac", "renal"],
    medications: ["norepinephrine", "epinephrine", "milrinone"],
    devices: ["ecmo", "mechanical_ventilation"],
    procedures: ["extubation"]
  }
];

export const mockEqEntries = [
  {
    id: "eq_001",
    userId: "user_001",
    date: "2024-08-21",
    title: "Took a Moment to Pause",
    reflection: "Felt overwhelmed, then I took a second to regroup and then I did the thing!",
    categories: ["stress_management", "resilience"]
  },
  {
    id: "eq_002",
    userId: "user_001",
    date: "2024-08-22",
    title: "Sachi Crashout",
    reflection: "Had a conflict with manager, details, lots of details",
    categories: ["conflict_resolution", "team_communication"]
  }
];

export const mockShadowDays = [
  {
    id: "shadow_001",
    userId: "user_001",
    date: "2024-08-21",
    location: "Kaiser Permanente",
    providerName: "Sachi Lord",
    providerEmail: "sachi@kaiser.com",
    hoursLogged: 7,
    casesObserved: 2,
    notes: "Great experience observing various cases.",
    addToTotalHours: true,
    skillsObserved: []
  }
];

export const mockTrackedEvents = [
  {
    id: "event_001",
    userId: "user_001",
    title: "2025 Fall Delaware AANA State Meeting",
    date: "2024-08-13",
    category: "aana_state_meeting",
    location: "Delaware",
    notes: "Met so many cool SRNAs, talked to Dr. Temmermand, made sure I understood what an Opt Out state was."
  },
  {
    id: "event_002",
    userId: "user_001",
    title: "AANA Annual Congress",
    date: "2024-08-22",
    category: "aana_national_meeting",
    location: "Nashville, TN",
    notes: "Saw the Atomic Anesthesia Crew, they were AWESOME! I learned so much about the CRNA profession."
  }
];

export const mockTrackerStats = {
  clinical: {
    totalEntries: 2,
    topPopulation: "Cardiac",
    topInfusion: "Norepinephrine",
    topDevice: "ECMO",
    topProcedure: "Extubation"
  },
  eq: {
    totalEntries: 2,
    topSkill: "Stress Management"
  },
  shadow: {
    totalHours: 7,
    casesObserved: 2,
    skillsObserved: 0
  },
  events: {
    totalEvents: 2
  }
};
```

---

### mockSchools.js

```javascript
// src/data/mockSchools.js

export const mockSchools = [
  {
    id: "school_001",
    name: "Doctor of Nurse Anesthesia Practice Program",
    schoolName: "Georgetown University",
    location: { city: "Washington", state: "DC" },
    imageUrl: "/images/schools/georgetown.jpg",
    type: "integrated",
    degree: "dnap",
    lengthMonths: 36,
    programStart: "August",
    classSize: 30,
    clinicalSites: 10,
    partiallyOnline: false,
    ableToWork: false,
    nursingCas: true,
    rollingAdmissions: false,
    estimatedTuitionInState: 126025,
    estimatedTuitionOutOfState: 126025,
    minimumGpa: 3.0,
    gpaType: "Science GPA Required, Cumulative/Overall GPA Required",
    minimumExperience: 2,
    greRequired: true,
    greWaived: true,
    greExpiration: true,
    ccrnRequired: false,
    shadowingRequired: false,
    personalStatementRequired: true,
    resumeRequired: true,
    prerequisitesRequired: ["Statistics", "General Chemistry"],
    prerequisiteNotes: "ANES 500 Chemistry and Physics for Nurse Anesthesia required by December 31.",
    prerequisitesExpire: true,
    acceptsNicuExperience: true,
    acceptsPicuExperience: true,
    acceptsErExperience: false,
    acceptsOtherCriticalCare: true,
    applicationOpens: "2024-12-01",
    applicationDeadline: "2025-06-01",
    numberOfReferences: 3,
    referenceDescription: "One from licensed CRNA, one from immediate supervisor, one from RN/APRN co-worker.",
    essayPrompt: "Essay outlining reasons for choosing to become a nurse anesthetist...",
    contactName: "Olympia Kelly",
    contactEmail: "olympia.kelly@ahu.edu",
    contactPhone: "407-303-7742",
    instagramHandle: "@georgetownnursing",
    websiteUrl: "https://nursing.georgetown.edu",
    firstTimeNcePassRate: 83,
    attritionRate: 4
  },
  // Add more schools...
];

// For search/filter, we'll have ~140 schools
export const mockSchoolCount = 140;
```

---

### mockGamification.js

```javascript
// src/data/mockGamification.js

export const mockLevels = [
  { level: 1, name: "Aspiring Applicant", pointsRequired: 20, tooltip: "You're off to a strong start! Earn 200 points to reach Level 2!" },
  { level: 2, name: "Dedicated Dreamer", pointsRequired: 200, tooltip: "Keep it up! Earn 600 total points to level up to Level 3!" },
  { level: 3, name: "Ambitious Achiever", pointsRequired: 600, tooltip: "You're making great progress! Earn 1,000 total points to reach Level 4." },
  { level: 4, name: "Committed Candidate", pointsRequired: 1000, tooltip: "Almost there! Earn 1,600 total points to unlock Level 5." },
  { level: 5, name: "Goal Crusher", pointsRequired: 1600, tooltip: "You're nearing the top! Earn 2,000 total points to reach Level 6." },
  { level: 6, name: "Peak Performer", pointsRequired: 2000, tooltip: "You're a top achiever! You've reached elite status." }
];

export const mockBadges = [
  { id: "badge_1", name: "Target Trailblazer", description: "Converted 3+ Target Programs", requirement: 3, type: "target_programs", earned: true, earnedAt: "2024-09-15" },
  { id: "badge_2", name: "Critical Care Crusher", description: "Submitted 20+ Clinical Entries", requirement: 20, type: "clinical_entries", earned: false, progress: 2 },
  { id: "badge_3", name: "Top Contributor", description: "Commented 10+ times in community", requirement: 10, type: "community_comments", earned: false, progress: 4 },
  { id: "badge_4", name: "Feedback Champion", description: "Submitted 3+ feedback forms", requirement: 3, type: "feedback_forms", earned: false, progress: 1 },
  { id: "badge_5", name: "Lesson Legend", description: "Completed 20+ lessons", requirement: 20, type: "lessons_completed", earned: false, progress: 12 },
  { id: "badge_6", name: "Milestone Machine", description: "Completed 7+ milestones", requirement: 7, type: "milestones_completed", earned: false, progress: 3 }
];

export const mockLeaderboard = [
  { rank: 1, nickname: "NurseAmbition", points: 2450 },
  { rank: 2, nickname: "FutureCRNA", points: 2180 },
  { rank: 3, nickname: "ICUwarrior", points: 1920 },
  { rank: 4, nickname: "AnesthesiaGoals", points: 1755 },
  { rank: 5, nickname: "CriticalCarePro", points: 1680 },
  // Current user
  { rank: 47, nickname: "SarahJ", points: 847, isCurrentUser: true }
];
```

---

## Using Mock Data in Hooks

```javascript
// src/hooks/usePrograms.js

import { useState, useEffect } from 'react';

// TODO: Replace with API call
import { mockTargetPrograms, mockSavedPrograms } from '@/data/mockPrograms';

export function usePrograms() {
  const [targetPrograms, setTargetPrograms] = useState([]);
  const [savedPrograms, setSavedPrograms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with API call
    // const data = await api.get('/user/programs');
    
    // Simulate loading delay
    setTimeout(() => {
      setTargetPrograms(mockTargetPrograms);
      setSavedPrograms(mockSavedPrograms);
      setIsLoading(false);
    }, 500);
  }, []);

  return {
    targetPrograms,
    savedPrograms,
    isLoading
  };
}
```

---

## Testing Different States

Create mock data variants for testing:

```javascript
// Empty state
export const mockEmptyPrograms = [];

// Loading state (handled in hook)

// Error state
export const mockProgramsError = {
  code: 'FETCH_ERROR',
  message: 'Failed to load programs'
};

// Full state (lots of data)
export const mockManyPrograms = Array.from({ length: 50 }, (_, i) => ({
  id: `prog_${i}`,
  name: `Program ${i}`,
  // ...
}));
```
