# Data Shapes

This file defines the data structures used throughout the app. Use these when creating mock data and when building components.

---

## User Profile

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  preferredName?: string;
  avatarUrl?: string;
  
  // Subscription
  subscriptionTier: 'founding' | 'core' | 'trial' | 'toolkit_only' | 'free';
  subscriptionStatus: 'active' | 'cancelled' | 'on_hold' | 'expired';
  trialEndsAt?: Date;
  
  // Application Stage (see src/lib/enums.js USER_STAGES)
  currentStage:
    | 'exploring'     // 12+ months out
    | 'preparing'     // 6-12 months out
    | 'applying'      // < 6 months, actively applying
    | 'interviewing'  // Post-submission, interview phase
    | 'accepted'      // Got in
    | 'srna';         // In school
  programStatus: 'no_targets' | 'some_targets' | 'all_submitted' | 'accepted';
  
  // Gamification
  points: number;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  levelName: string;
  badges: Badge[];
  
  // Timestamps
  createdAt: Date;
  lastLoginAt: Date;
  onboardingCompletedAt?: Date;
}
```

---

## Academic Data

```typescript
interface AcademicProfile {
  userId: string;
  
  // GPA Metrics
  overallGpa?: number;
  scienceGpa?: number;
  scienceGpaWithForgiveness?: number;
  last60Gpa?: number;
  gpaCalculated: boolean; // Have they used the calculator?
  
  // GRE Scores
  greQuantitative?: number;
  greVerbal?: number;
  greAnalyticalWriting?: number;
  greCombined?: number;
  
  // Prerequisites Completed (array of course IDs they've marked complete)
  completedPrerequisites: CompletedPrereq[];
}

interface CompletedPrereq {
  courseType: PrerequisiteType;
  year: number;
  grade: string;
  schoolName?: string;
  courseId?: string; // If linked to prereq library
}

type PrerequisiteType = 
  | 'anatomy'
  | 'physiology'
  | 'physics'
  | 'biochemistry'
  | 'organic_chemistry'
  | 'general_chemistry'
  | 'pathophysiology'
  | 'pharmacology'
  | 'microbiology'
  | 'research'
  | 'statistics';
```

---

## Clinical Profile

```typescript
interface ClinicalProfile {
  userId: string;
  
  // ICU Experience
  primaryIcuType: IcuType;
  additionalIcuTypes: IcuType[];
  totalYearsExperience: number;
  
  // Certifications
  certifications: Certification[];
}

type IcuType = 
  | 'micu' // Medical ICU
  | 'sicu' // Surgical ICU
  | 'cvicu' // Cardiovascular ICU
  | 'neuro_icu'
  | 'picu' // Pediatric ICU
  | 'nicu' // Neonatal ICU
  | 'trauma_icu'
  | 'burn_icu'
  | 'ccu' // Cardiac Care Unit
  | 'flight_nurse'
  | 'er'
  | 'other';

interface Certification {
  type: CertificationType;
  status: 'not_started' | 'studying' | 'passed' | 'expired';
  earnedDate?: Date;
  expiresDate?: Date;
}

type CertificationType = 
  | 'ccrn'
  | 'csc'
  | 'cmc'
  | 'pccn'
  | 'bls'
  | 'acls'
  | 'pals'
  | 'tncc'
  | 'enpc'
  | 'nihss';
```

---

## Programs

```typescript
interface CrnaProgram {
  id: string;
  name: string;
  schoolName: string;
  location: {
    city: string;
    state: string;
  };
  imageUrl?: string;
  
  // Program Details
  type: 'integrated' | 'front_loaded';
  degree: 'dnap' | 'dnp' | 'msna';
  lengthMonths: number;
  programStart: string; // "May", "August", etc.
  classSize: number;
  clinicalSites: number;
  partiallyOnline: boolean;
  ableToWork: boolean;
  nursingCas: boolean;
  rollingAdmissions: boolean;
  
  // Costs
  estimatedTuitionInState: number;
  estimatedTuitionOutOfState: number;
  
  // Requirements
  minimumGpa: number;
  gpaType: string; // "Science GPA Required, Cumulative/Overall GPA Required"
  minimumExperience: number; // Years
  
  // GRE
  greRequired: boolean;
  greWaived: boolean;
  greExpiration: boolean;
  
  // Other Requirements
  ccrnRequired: boolean;
  shadowingRequired: boolean;
  shadowingHours?: number;
  personalStatementRequired: boolean;
  resumeRequired: boolean;
  
  // Prerequisites
  prerequisitesRequired: string[];
  prerequisiteNotes?: string;
  prerequisitesExpire: boolean;
  
  // Experience Accepted
  acceptsNicuExperience: boolean;
  acceptsPicuExperience: boolean;
  acceptsErExperience: boolean;
  acceptsOtherCriticalCare: boolean;
  
  // Dates
  applicationOpens?: Date;
  applicationDeadline?: Date;
  
  // References
  numberOfReferences: number;
  referenceDescription?: string;
  
  // Essay
  essayPrompt?: string;
  
  // Contact
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  instagramHandle?: string;
  websiteUrl?: string;
  
  // Stats
  firstTimeNcePassRate?: number;
  attritionRate?: number;
}
```

---

## User's Saved Programs

```typescript
interface SavedProgram {
  id: string;
  userId: string;
  programId: string;
  program: CrnaProgram; // Populated
  
  isTarget: boolean;
  savedAt: Date;
  
  // Only if isTarget = true
  targetData?: TargetProgramData;
}

interface TargetProgramData {
  status: ProgramStatus;
  interviewDate?: Date;
  submittedDate?: Date;
  outcomeDate?: Date;
  outcome?: 'accepted' | 'waitlisted' | 'denied';

  // Personal notes
  notes: string;

  // Checklist progress (see dynamic-checklist-system.md)
  progress: number; // 0-100 percentage
  verifiedRequirements: boolean;
  checklist: ChecklistItem[];

  // Letters of Recommendation
  lor: LetterOfRecommendation[];

  // Documents
  documents: ProgramDocument[];
}

// See src/lib/enums.js PROGRAM_STATUSES
type ProgramStatus =
  | 'not_started'
  | 'in_progress'
  | 'submitted'
  | 'interview_invite'
  | 'interview_complete'
  | 'waitlisted'
  | 'denied'
  | 'accepted';

// See src/lib/enums.js LOR_STATUSES
type LorStatus =
  | 'not_requested'
  | 'requested'
  | 'confirmed'
  | 'submitted'
  | 'received'
  | 'declined';

interface LetterOfRecommendation {
  id: string;
  personName: string;
  relationship: string;
  email?: string;
  status: LorStatus;
  requestedDate?: Date;
  receivedDate?: Date;
}

interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  dueDate?: Date;
  isDefault: boolean; // System-generated vs user-added
}

interface ProgramDocument {
  id: string;
  name: string;
  type: 'transcript' | 'resume' | 'personal_statement' | 'other';
  uploadedAt: Date;
  fileUrl: string;
}
```

---

## Trackers

### Clinical Experience Tracker

```typescript
interface ClinicalEntry {
  id: string;
  userId: string;
  date: Date;
  notes: string;
  
  // Tagged items
  patientPopulations: PatientPopulation[];
  medications: string[];
  devices: string[];
  procedures: string[];
}

type PatientPopulation = 
  | 'cardiac'
  | 'neuro'
  | 'trauma'
  | 'renal'
  | 'liver'
  | 'pulmonary'
  | 'surgical'
  | 'medical'
  | 'transplant'
  | 'ld_ob' // Labor & Delivery
  | 'ortho'
  | 'burn'
  | 'oncology';

// Common medications, devices, procedures are stored as strings
// UI shows predefined options but allows custom entries
```

### EQ/Leadership Tracker

```typescript
interface EqEntry {
  id: string;
  userId: string;
  date: Date;
  title: string;
  reflection: string;
  categories: EqCategory[];
}

type EqCategory = 
  | 'conflict_resolution'
  | 'team_communication'
  | 'stress_management'
  | 'empathy_compassion'
  | 'adaptability'
  | 'leadership'
  | 'self_reflection'
  | 'cultural_competency'
  | 'resilience'
  | 'ethics';
```

### Shadow Day Tracker

```typescript
interface ShadowDay {
  id: string;
  userId: string;
  date: Date;           // ISO 8601 format with timezone
  location: string;
  providerName: string; // Name of CRNA shadowed
  providerEmail?: string;
  hoursLogged: number;
  casesObserved: number;
  notes: string;
  addToTotalHours: boolean; // Whether to include in total shadow hours count

  // Skills observed (checkboxes) - see src/lib/enums.js SHADOW_SKILLS
  skillsObserved: ShadowSkill[];
}

type ShadowSkill = 
  | 'preoperative_assessment'
  | 'intubation'
  | 'extubation'
  | 'invasive_line_placement'
  | 'neuraxial_anesthesia'
  | 'nerve_block'
  | 'mac_sedation'
  | 'general_anesthesia'
  | 'lma'
  | 'videoscope'
  | 'tee'
  | 'pocus';
```

### Events Tracker

```typescript
interface TrackedEvent {
  id: string;
  userId: string;
  title: string;
  date: Date;
  category: EventCategory;
  location?: string;
  notes: string;
}

type EventCategory = 
  | 'aana_state_meeting'
  | 'aana_national_meeting'
  | 'crna_club_event'
  | 'open_house'
  | 'info_session'
  | 'networking'
  | 'other';
```

---

## Prerequisite Library

```typescript
interface PrerequisiteCourse {
  id: string;
  
  // Institution
  schoolName: string;
  schoolType: 'community_college' | 'university' | 'online_school';
  state?: string;
  
  // Course Info
  coursePrefix: string; // "BIOL"
  courseNumber: string; // "201"
  courseTitle: string; // "Human Anatomy & Physiology I"
  subjectArea: PrerequisiteType;
  educationLevel: 'undergraduate' | 'graduate';
  credits: number;
  hasLab: boolean;
  
  // Delivery
  format: 'in_person' | 'online_sync' | 'online_async' | 'hybrid';
  termsOffered: ('fall' | 'spring' | 'summer')[];
  enrollAnytime: boolean;
  courseLengthWeeks?: number;
  costRange: 'less_than_1000' | '1000_to_2000' | 'more_than_2000';
  
  // Reviews
  averageRecommendScore: number; // 1-5
  averageEaseScore: number; // 1-5
  reviewCount: number;
  
  // Programs this satisfies
  programsUsedFor: string[]; // Program IDs
  
  // Tags
  tags: string[]; // "good for working nurses", "self-paced", etc.
}

interface CourseReview {
  id: string;
  courseId: string;
  userId: string;
  date: Date;
  
  recommendScore: 1 | 2 | 3 | 4 | 5;
  easeScore: 1 | 2 | 3 | 4 | 5;
  reviewText: string;
  weeklyTimeCommitment: '0_5' | '5_10' | '10_15' | '15_plus';
  
  tags: string[]; // Selected from predefined list
}
```

---

## Gamification

```typescript
interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  earnedAt?: Date;
  
  // Unlock criteria
  type: BadgeType;
  requirement: number;
}

type BadgeType = 
  | 'target_trailblazer' // 3+ target programs
  | 'critical_care_crusher' // 20+ clinical entries
  | 'top_contributor' // 10+ community comments
  | 'feedback_champion' // 3+ feedback submissions
  | 'lesson_legend' // 20+ lessons completed
  | 'milestone_machine'; // 7+ milestones completed

interface Level {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  name: string;
  pointsRequired: number;
  tooltipText: string;
}

// Level definitions
const LEVELS: Level[] = [
  { level: 1, name: 'Aspiring Applicant', pointsRequired: 20, tooltipText: "You're off to a strong start! Earn 200 points to reach Level 2!" },
  { level: 2, name: 'Dedicated Dreamer', pointsRequired: 200, tooltipText: "Keep it up! Earn 600 total points to level up to Level 3!" },
  { level: 3, name: 'Ambitious Achiever', pointsRequired: 600, tooltipText: "You're making great progress! Earn 1,000 total points to reach Level 4." },
  { level: 4, name: 'Committed Candidate', pointsRequired: 1000, tooltipText: "Almost there! Earn 1,600 total points to unlock Level 5." },
  { level: 5, name: 'Goal Crusher', pointsRequired: 1600, tooltipText: "You're nearing the top! Earn 2,000 total points to reach Level 6." },
  { level: 6, name: 'Peak Performer', pointsRequired: 2000, tooltipText: "You're a top achiever! You've reached elite status - keep up the solid work." },
];
```

---

## Milestones

```typescript
interface Milestone {
  id: string;
  title: string;
  description: string;
  order: number;
  
  // Checklist items within milestone
  items: MilestoneItem[];
  
  // Progress
  status: 'not_started' | 'in_progress' | 'completed';
  completedItems: number;
  totalItems: number;
}

interface MilestoneItem {
  id: string;
  label: string;
  type: 'video' | 'action' | 'link' | 'checkbox';
  completed: boolean;
  
  // If type is video
  videoId?: string;
  
  // If type is link
  linkUrl?: string;
  linkText?: string;
}

// The 13 milestones (abbreviated titles)
const MILESTONES = [
  'Understand the Profession + Early Prep',
  'Critical Care Experience',
  'GPA + Prerequisites',
  'Explore + Research Programs',
  'Shadowing',
  'Leadership + Extracurriculars',
  'Networking + Events',
  'Certifications',
  'Resume/CV',
  'Personal Statement',
  'Letters of Recommendation',
  'Interview Prep',
  'Application Submission',
];
```

---

## Marketplace (Future)

```typescript
interface SrnaProvider {
  id: string;
  userId: string;
  
  // Profile
  name: string;
  avatarUrl?: string;
  bio: string;
  programName: string;
  programYear: number;
  
  // Verification
  approvedAt: Date;
  stripeAccountId: string;
  
  // Services offered
  services: MarketplaceService[];
  
  // Stats
  totalBookings: number;
  averageRating: number;
  responseTime: string; // "Usually responds within 2 hours"
}

interface MarketplaceService {
  id: string;
  providerId: string;
  
  type: ServiceType;
  title: string;
  description: string;
  price: number;
  durationMinutes: number;
  
  isLive: boolean; // Live call vs async
  isActive: boolean;
}

type ServiceType = 
  | 'mock_interview'
  | 'essay_review'
  | 'resume_review'
  | 'strategy_session'
  | 'school_qa'
  | 'clinical_tutoring';

interface Booking {
  id: string;
  serviceId: string;
  providerId: string;
  applicantId: string;
  
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  scheduledAt?: Date;
  completedAt?: Date;
  
  // Payment
  amountPaid: number;
  platformFee: number;
  providerPayout: number;
  
  // Review
  review?: BookingReview;
}

interface BookingReview {
  rating: 1 | 2 | 3 | 4 | 5;
  reviewText: string;
  createdAt: Date;
}
```

---

## Events (Platform Events Directory)

```typescript
interface PlatformEvent {
  id: string;
  title: string;
  description: string;
  
  category: 'aana_state' | 'aana_national' | 'crna_club' | 'program_event';
  subcategory?: string; // State name for AANA state meetings
  
  date: Date;
  endDate?: Date;
  timezone: string;
  
  location?: string;
  isVirtual: boolean;
  registrationUrl?: string;
  
  imageUrl?: string;
  
  // For CRNA Club events
  zoomLink?: string;
  
  // User interaction
  savedByUserIds: string[];
}
```

---

## Mock Data Guidelines

When creating mock data:

1. **Use realistic values** - Real school names, realistic GPAs, actual certification names
2. **Variety in status** - Mix of completed/in-progress/not-started items
3. **Consistent user** - Use same user ID across related data
4. **Include edge cases** - Empty states, maximum values, optional fields
5. **Mark clearly** - Add `// MOCK DATA` comments

Example:
```javascript
// MOCK DATA - Replace with API call
export const mockUser = {
  id: 'user_123',
  name: 'Sachi',
  email: 'sachi@example.com',
  // ...
};
```
