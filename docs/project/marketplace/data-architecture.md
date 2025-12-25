# Mentor Marketplace Data Architecture Research

**Date:** December 7, 2024
**Purpose:** Define data fields for SRNA mentors to enable intelligent matching with applicants
**Status:** RESEARCH ONLY - Do not build yet

---

## Executive Summary

This document outlines the data we should collect from SRNA mentors (providers) to power future intelligent matching. The goal is to collect the RIGHT data upfront during provider onboarding so we can later build:

1. **Smart matching** - Connect applicants with mentors who share their background/goals
2. **Program-specific expertise** - Match mentors with applicants targeting the same schools
3. **Service recommendations** - Suggest the right service type based on applicant needs
4. **Quality signals** - Surface high-quality mentors for specific use cases

---

## Privacy Considerations

**IMPORTANT:** Many SRNAs are private about their school/program information. Key principles:

- **Most fields should be OPTIONAL** - Don't block onboarding for missing data
- **Program data is for matching, NOT public display** - School info used internally for matching but not shown on public profile unless mentor opts in
- **Clearly communicate data usage** - Tell mentors how their info will be used
- **Allow granular visibility controls** - Let mentors choose what's public vs private

---

## Part 1: Mentor Profile Data

### Current SrnaProvider Interface (from data-shapes.md)

```typescript
interface SrnaProvider {
  id: string;
  userId: string;
  name: string;
  avatarUrl?: string;
  bio: string;
  programName: string;      // Current CRNA school
  programYear: number;       // Year in program (1, 2, 3)
  approvedAt: Date;
  stripeAccountId: string;
  services: MarketplaceService[];
  totalBookings: number;
  averageRating: number;
  responseTime: string;      // "Usually responds within 2 hours"
}
```

### Proposed Additional Fields

#### 1.1 Academic Background (When They Applied)

| Field | Type | Required | Description | Matching Use |
|-------|------|----------|-------------|--------------|
| `applicationGpa` | decimal | Optional | GPA when they applied | Match with similar-GPA applicants |
| `applicationScienceGpa` | decimal | Optional | Science GPA when applied | More specific academic match |
| `hadGre` | boolean | Optional | Whether they took GRE | Match with GRE/no-GRE applicants |
| `greComposite` | number? | Optional | Combined GRE score (if taken) | Match by score range |
| `retookCourses` | boolean | Optional | Had to retake any courses | Valuable for low-GPA applicants |

**Why this matters:** Applicants with lower GPAs want to know "Can someone with MY stats get in?" Matching them with mentors who had similar academic profiles creates powerful connection.

#### 1.2 Pre-CRNA Career Background

| Field | Type | Required | Description | Matching Use |
|-------|------|----------|-------------|--------------|
| `icuTypeWhenApplied` | IcuType | **Required** | Primary ICU type when applied | Direct match with applicant's ICU |
| `additionalIcuTypes` | IcuType[] | Optional | Other ICU experience | Breadth matching |
| `yearsIcuWhenApplied` | number | **Required** | ICU years at application time | Timeline similarity |
| `hospitalName` | string | Optional | Hospital/facility name | Connect mentors/applicants from same hospital |
| `hospitalRegion` | string | Optional | State/region worked in | Geographic matching |
| `wasChargeNurse` | boolean | Optional | Had leadership experience | Match with leadership-seekers |
| `hadResearch` | boolean | Optional | Published or presented research | Match research-focused applicants |

**Why this matters:** An applicant from a community hospital MICU will relate better to a mentor who came from a similar setting. Hospital name enables powerful "same hospital" connections when mentors are comfortable sharing.

#### 1.3 Application Journey

| Field | Type | Required | Visibility | Description | Matching Use |
|-------|------|----------|------------|-------------|--------------|
| `applicationYear` | number | Optional | Public | Year they applied (2023, 2024) | Recency of experience |
| `applicationCycle` | string | Optional | Public | "Fall 2023", "Spring 2024" | Match with same-cycle applicants |
| `schoolsAppliedTo` | string[] | Optional | **Private** | Program IDs they applied to | Exact program matching |
| `schoolsInterviewedAt` | string[] | Optional | **Private** | Programs where interviewed | Interview-specific advice |
| `schoolsAcceptedTo` | string[] | Optional | **Private** | Programs with acceptances | Acceptance journey advice |
| `totalApplicationsSubmitted` | number | Optional | Public | How many apps submitted | Quantity strategy matching |
| `applicationSpreadStrategy` | enum | Optional | Public | `narrow` (1-3) \| `moderate` (4-7) \| `wide` (8+) | Match by strategy |

**Privacy note:** School-specific fields (`schoolsAppliedTo`, `schoolsInterviewedAt`, `schoolsAcceptedTo`) are PRIVATE by default - used only for internal matching, never displayed publicly unless mentor explicitly opts in.

**Why this matters:** If an applicant is targeting Georgetown, they want a mentor who applied to/got into Georgetown, not just any SRNA. But many SRNAs don't want their school publicly known.

#### 1.4 Personality & Communication Style

| Field | Type | Required | Description | Matching Use |
|-------|------|----------|-------------|--------------|
| `communicationStyle` | enum | Optional | `direct` \| `supportive` \| `analytical` | Style matching |
| `feedbackStyle` | enum | Optional | `gentle` \| `balanced` \| `tough_love` | Preference matching |
| `languages` | string[] | Optional | Languages spoken beyond English | Non-English speaker support |

**Why this matters:** Some applicants want tough love feedback, others need gentle encouragement. Matching by style reduces friction.

#### 1.5 Mentoring History

| Field | Type | Required | Description | Matching Use |
|-------|------|----------|-------------|--------------|
| `previousMentoringExperience` | boolean | Optional | Mentored before (formally/informally) | Quality signal |
| `mentoringDescription` | string | Optional | How they've helped others | Bio enhancement |
| `teachingExperience` | boolean | Optional | TA, preceptor, educator role | Quality signal |
| `helpedApplicantsCount` | number | Optional | # of applicants helped before | Social proof |

---

## Part 2: Service-Level Data

### Current MarketplaceService Interface

```typescript
interface MarketplaceService {
  id: string;
  providerId: string;
  type: ServiceType;  // mock_interview, essay_review, resume_review, strategy_session, school_qa, clinical_tutoring
  title: string;
  description: string;
  price: number;
  durationMinutes: number;
  isLive: boolean;
  isActive: boolean;
}
```

### Proposed Additional Fields Per Service

#### 2.1 Expertise & Specialization

| Field | Type | Description | Matching Use |
|-------|------|-------------|--------------|
| `expertiseLevel` | enum | `experienced` \| `highly_experienced` \| `expert` | Quality tiering |
| `topicSpecialties` | string[] | Specific areas of expertise | Fine-grained matching |
| `programExpertise` | string[] | Program IDs they know well | Program-specific matching |
| `targetAudience` | string[] | `early_explorers`, `active_applicants`, `post_interview` | Stage matching |
| `icuTypeExpertise` | IcuType[] | ICU backgrounds they understand best | Background matching |

**Topic Specialties (Unified List):**

Rather than per-service specialties, mentors select from a unified list of what they can help with:

| Specialty | Description |
|-----------|-------------|
| `resume` | Resume/CV review and optimization |
| `essay` | Personal statement and essay writing |
| `interview_prep` | Mock interviews and interview strategy |
| `general_qa` | General Q&A about CRNA journey |
| `certification_advice` | CCRN prep, other certification guidance |
| `unit_leadership` | Leadership roles, charge nurse experience |
| `networking` | Networking strategies, building connections |
| `school_selection` | Choosing which programs to target |
| `timeline_planning` | Building an application timeline |
| `reapplicant_strategy` | Advice for those reapplying |

Mentors can select multiple specialties. This powers both service creation and matching.

#### 2.2 Capacity & Availability

**IMPORTANT:** Availability is critical for applicants, especially during interview season when they need quick turnaround.

| Field | Type | Required | Description | Matching Use |
|-------|------|----------|-------------|--------------|
| `availabilityStatus` | enum | **Required** | `immediate` \| `within_week` \| `limited` \| `booked` | Quick filtering |
| `weeklySlots` | number | Optional | Max bookings per week | Capacity management |
| `availabilityWindows` | object[] | Optional | `[{ dayOfWeek, startTime, endTime }]` | Calendar matching |
| `typicalTurnaround` | enum | Optional | `24h`, `48h`, `3_5_days`, `1_week` | Urgency matching |
| `timezone` | string | **Required** | Provider's timezone | Scheduling convenience |
| `acceptsRushRequests` | boolean | Optional | Can accommodate urgent needs | Emergency matching |
| `rushFeePercentage` | number? | Optional | Extra fee for rush service | Price transparency |

**Availability status definitions:**
- `immediate` - Can book within 24-48 hours
- `within_week` - Available slots this week
- `limited` - Booking 1-2 weeks out
- `booked` - Not taking new bookings currently

#### 2.3 Delivery Preferences

| Field | Type | Description | Matching Use |
|-------|------|-------------|--------------|
| `deliveryFormat` | enum[] | `video_call`, `phone`, `written_feedback`, `screen_share` | Format matching |
| `recordingAllowed` | boolean | Okay with session recording | Applicant need |
| `followUpIncluded` | boolean | Includes follow-up questions | Value comparison |
| `revisionsIncluded` | number | # of revisions for async services | Value comparison |
| `materialsProvided` | boolean | Provides prep materials | Value comparison |
| `languagesOffered` | string[] | Languages for this service | Non-English matching |

---

## Part 3: Matching Signal Mapping

### Applicant → Mentor Match Table

**Note:** Since many fields are optional, matching should gracefully handle missing data. If a mentor hasn't provided certain info, those signals are simply not factored in (rather than penalizing them).

| Applicant Data Point | Mentor Data Point | Match Logic | Strength | Required? |
|---------------------|-------------------|-------------|----------|-----------|
| `targetPrograms[]` | `schoolsAcceptedTo[]` | Exact program match | **Critical** | Optional |
| `targetPrograms[]` | `schoolsInterviewedAt[]` | Program interviewed at | High | Optional |
| `primaryIcuType` | `icuTypeWhenApplied` | Same ICU type | High | **Yes** |
| `totalYearsExperience` | `yearsIcuWhenApplied` | Similar timeline | Medium | **Yes** |
| `currentStage` | `targetAudience` | Stage-appropriate | High | Optional |
| `scienceGpa` | `applicationScienceGpa` | Within 0.3 range | Medium | Optional |
| `currentEmployer` | `hospitalName` | Same hospital | High | Optional |
| User's service need | `topicSpecialties[]` | Specialty match | High | Optional |
| Applicant urgency | `availabilityStatus` | Meets deadline | **Critical** | **Yes** |
| `timezone` | `timezone` | Same/close timezone | Medium | **Yes** |

### Match Score Algorithm (Conceptual)

```javascript
function calculateMatchScore(applicant, mentor, serviceType) {
  let score = 0;
  let maxScore = 0;

  // Critical matches (weighted heavily)
  if (hasExactProgramMatch(applicant.targetPrograms, mentor.schoolsAcceptedTo)) {
    score += 30; // Accepted to applicant's target school
  } else if (hasExactProgramMatch(applicant.targetPrograms, mentor.schoolsInterviewedAt)) {
    score += 20; // Interviewed at target school
  } else if (hasExactProgramMatch(applicant.targetPrograms, mentor.schoolsAppliedTo)) {
    score += 10; // Applied to target school
  }
  maxScore += 30;

  // Background similarity
  if (applicant.primaryIcuType === mentor.icuTypeWhenApplied) {
    score += 15;
  }
  maxScore += 15;

  // Academic similarity (for essay/strategy services)
  if (serviceType === 'essay_review' || serviceType === 'strategy_session') {
    const gpaDiff = Math.abs(applicant.scienceGpa - mentor.applicationScienceGpa);
    if (gpaDiff <= 0.2) score += 10;
    else if (gpaDiff <= 0.4) score += 5;
    maxScore += 10;
  }

  // Stage appropriateness
  if (mentor.targetAudience.includes(applicant.currentStage)) {
    score += 10;
  }
  maxScore += 10;

  // Specialty match for service
  const serviceSpecialties = getApplicantNeeds(applicant, serviceType);
  const matchingSpecialties = intersection(serviceSpecialties, mentor.topicSpecialties);
  score += (matchingSpecialties.length / serviceSpecialties.length) * 15;
  maxScore += 15;

  // Availability/urgency match
  if (meetsUrgencyNeeds(applicant.urgency, mentor.typicalTurnaround)) {
    score += 10;
  }
  maxScore += 10;

  return (score / maxScore) * 100;
}
```

---

## Part 4: Future-Proofing for ML Recommendations

### Booking Outcome Data

| Field | Type | Description | ML Use |
|-------|------|-------------|--------|
| `bookingId` | string | Unique booking ID | Join key |
| `applicantId` | string | Who booked | User journey tracking |
| `mentorId` | string | Who provided | Provider performance |
| `serviceType` | ServiceType | What service | Service effectiveness |
| `scheduledAt` | datetime | When scheduled | Timing patterns |
| `completedAt` | datetime | When completed | Fulfillment rate |
| `rating` | 1-5 | Applicant rating | Quality signal |
| `reviewText` | string | Written review | NLP analysis |
| `wouldRecommend` | boolean | Would recommend mentor | Net promoter |
| `valuePaidPerceived` | enum | `poor`, `fair`, `good`, `excellent` | Price/value optimization |

### Session Feedback Tags (Post-Booking)

| Tag Category | Tags | ML Use |
|--------------|------|--------|
| Communication | `clear`, `patient`, `encouraging`, `professional`, `personable` | Style matching |
| Expertise | `knowledgeable`, `experienced`, `gave_new_insights`, `program_specific_tips` | Quality signals |
| Preparation | `well_prepared`, `thorough`, `customized`, `generic` | Quality signals |
| Value | `worth_the_price`, `would_pay_more`, `overpriced` | Pricing optimization |
| Outcome | `helped_a_lot`, `somewhat_helpful`, `not_what_i_needed` | Effectiveness |

### Success Tracking (Long-Term)

| Field | Type | Description | ML Use |
|-------|------|-------------|--------|
| `applicantAcceptedAfter` | boolean | Did applicant get accepted after booking? | Outcome attribution |
| `programAcceptedTo` | string? | Which program(s) accepted | Success correlation |
| `repeatBookings` | number | # of repeat bookings with same mentor | Trust signal |
| `referralsMade` | number | Did applicant refer others | Satisfaction proxy |
| `timeFromBookingToAcceptance` | number | Days between service and acceptance | Attribution window |
| `mentorWorkedWithAt` | string[] | All programs mentor helped applicants with | Program expertise validation |

### Training Data Structure for Recommendations

```javascript
// Each booking becomes a training example
{
  // Features (input)
  applicant: {
    gpa: 3.4,
    scienceGpa: 3.2,
    icuType: 'micu',
    yearsExperience: 2.5,
    stage: 'applying',
    targetPrograms: ['georgetown', 'duke'],
    urgency: 'high',
    previousBookings: 0
  },
  mentor: {
    applicationGpa: 3.5,
    icuTypeWhenApplied: 'micu',
    yearsIcuWhenApplied: 3,
    schoolsAcceptedTo: ['georgetown'],
    totalBookings: 47,
    averageRating: 4.8,
    topicSpecialties: ['personal_statement', 'behavioral_questions']
  },
  service: {
    type: 'mock_interview',
    price: 75,
    duration: 45
  },
  context: {
    daysToDeadline: 21,
    dayOfWeek: 'Saturday',
    timeSlot: 'afternoon'
  },

  // Label (output)
  outcome: {
    rating: 5,
    wouldRecommend: true,
    valuePaidPerceived: 'excellent',
    repeatBooking: true,
    applicantAccepted: true // 3 months later
  }
}
```

---

## Part 5: Data Collection Strategy

### 5.1 Onboarding Questionnaire

**Design principle:** Collect minimum required data to start, make everything else optional. Mentors can always add more later.

---

**Step 1: Required Basics** (1 min)
- Primary ICU type when you applied (dropdown) **REQUIRED**
- Years of ICU experience at application (slider: 1-10+) **REQUIRED**
- Your timezone **REQUIRED**
- Current availability status (Immediate / Within a week / Limited / Booked) **REQUIRED**

**Step 2: Optional - Academic Background**
- GPA when applied (slider: 2.5-4.0)
- Science GPA when applied (slider: 2.5-4.0)
- Did you take the GRE? (Yes/No)
- Did you retake any prereqs? (Yes/No)

**Step 3: Optional - Application Journey**
*Note: This info helps us match you with applicants targeting your schools, but stays private.*
- What year did you apply? (dropdown)
- How many schools did you apply to? (1-3, 4-7, 8+)
- Which schools did you apply to? (multi-select, PRIVATE)
- Which schools interviewed you? (multi-select, PRIVATE)
- Which schools accepted you? (multi-select, PRIVATE)

**Step 4: Optional - About You**
- What can you help with? (multi-select from topic specialties)
- Languages spoken beyond English (multi-select)
- Brief bio (textarea, 100 words)

---

**UX Note:** Use a progress indicator but allow skipping optional sections. "Complete your profile" nudges can prompt for more data later.

### 5.2 Progressive Profiling (After First Booking)

After their first completed booking, prompt for:
- Topic specialties (based on service type)
- Capacity preferences
- Timezone/availability

After 5 bookings:
- Request detailed specialty tags
- Ask about teaching experience
- Mentoring history

### 5.3 Inferred from Behavior

| Behavior | Inference |
|----------|-----------|
| Completes bookings quickly | High responsiveness |
| High ratings on specific service type | Specialty strength |
| Repeat bookings from same applicants | Strong relationship builder |
| Bookings from specific target programs | Program expertise |
| Handles rush requests successfully | Rush-capable |

### 5.4 Admin-Verified Data

| Field | Verification Method |
|-------|-------------------|
| Currently enrolled in CRNA program | Manual verification at approval |
| Program and year | Cross-reference with school records |
| Stripe account | Automatic via Stripe Connect |

---

## Part 6: Schema Additions Summary

### New SrnaProviderProfile Interface

```typescript
interface SrnaProviderProfile {
  // === Existing fields ===
  id: string;
  userId: string;
  name: string;
  avatarUrl?: string;
  bio?: string;
  programName: string;            // Current CRNA school (admin-verified)
  programYear: number;             // Year in program (admin-verified)
  approvedAt: Date;
  stripeAccountId: string;
  services: MarketplaceService[];
  totalBookings: number;
  averageRating: number;
  responseTime: string;

  // === NEW: Required Fields ===
  icuTypeWhenApplied: IcuType;     // REQUIRED at onboarding
  yearsIcuWhenApplied: number;     // REQUIRED at onboarding
  timezone: string;                 // REQUIRED at onboarding
  availabilityStatus: 'immediate' | 'within_week' | 'limited' | 'booked'; // REQUIRED

  // === NEW: Optional Academic Background ===
  applicationGpa?: number;
  applicationScienceGpa?: number;
  hadGre?: boolean;
  greComposite?: number;
  retookCourses?: boolean;

  // === NEW: Optional Clinical Background ===
  additionalIcuTypes?: IcuType[];
  hospitalName?: string;            // For "same hospital" matching
  hospitalRegion?: string;
  wasChargeNurse?: boolean;
  hadResearch?: boolean;

  // === NEW: Optional Application Journey (PRIVATE - not shown publicly) ===
  applicationYear?: number;
  applicationCycle?: string;
  schoolsAppliedTo?: string[];       // Program IDs - PRIVATE
  schoolsInterviewedAt?: string[];   // Program IDs - PRIVATE
  schoolsAcceptedTo?: string[];      // Program IDs - PRIVATE
  totalApplicationsSubmitted?: number;
  applicationSpreadStrategy?: 'narrow' | 'moderate' | 'wide';

  // === NEW: Optional Personality & Style ===
  communicationStyle?: 'direct' | 'supportive' | 'analytical';
  feedbackStyle?: 'gentle' | 'balanced' | 'tough_love';
  languages?: string[];              // Languages beyond English

  // === NEW: Optional Mentoring Background ===
  previousMentoringExperience?: boolean;
  mentoringDescription?: string;
  teachingExperience?: boolean;
  helpedApplicantsCount?: number;

  // === NEW: Topic Specialties ===
  topicSpecialties?: TopicSpecialty[];
}

type TopicSpecialty =
  | 'resume'
  | 'essay'
  | 'interview_prep'
  | 'general_qa'
  | 'certification_advice'
  | 'unit_leadership'
  | 'networking'
  | 'school_selection'
  | 'timeline_planning'
  | 'reapplicant_strategy';
```

### Enhanced MarketplaceService Interface

```typescript
interface MarketplaceService {
  // === Existing fields ===
  id: string;
  providerId: string;
  type: ServiceType;
  title: string;
  description: string;
  price: number;
  durationMinutes: number;
  isLive: boolean;
  isActive: boolean;

  // === NEW: Optional Expertise ===
  programExpertise?: string[];      // Program IDs (PRIVATE, for matching)
  targetAudience?: UserStage[];
  icuTypeExpertise?: IcuType[];

  // === NEW: Capacity (some at provider level, some at service level) ===
  typicalTurnaround?: '24h' | '48h' | '3_5_days' | '1_week';
  acceptsRushRequests?: boolean;
  rushFeePercentage?: number;

  // === NEW: Delivery ===
  deliveryFormat?: ('video_call' | 'phone' | 'written_feedback')[];
  followUpIncluded?: boolean;
  revisionsIncluded?: number;
}
```

**Note:** `topicSpecialties`, `timezone`, and `availabilityStatus` are at the PROVIDER level, not per-service.

### New BookingOutcome Interface (for ML)

```typescript
interface BookingOutcome {
  bookingId: string;
  applicantId: string;
  mentorId: string;
  serviceId: string;

  // Ratings
  rating: 1 | 2 | 3 | 4 | 5;
  wouldRecommend: boolean;
  valuePaidPerceived: 'poor' | 'fair' | 'good' | 'excellent';

  // Feedback tags (selected by applicant post-session)
  communicationTags: string[];
  expertiseTags: string[];
  preparationTags: string[];
  outcomeTags: string[];

  // Long-term tracking (updated later)
  applicantAcceptedAfter?: boolean;
  programAcceptedTo?: string;
  repeatBookings: number;
  referralsMade: number;
}
```

---

## Part 7: Naming Convention Alignment

Per `schema-decisions.md`, ensure consistency:

| Convention | Applied |
|------------|---------|
| camelCase for all fields | ✅ `applicationGpa`, `icuTypeWhenApplied` |
| Use existing enums | ✅ `IcuType`, `UserStage`, `ServiceType` |
| Timestamps as datetime | ✅ `approvedAt`, `completedAt` |
| IDs as strings | ✅ `schoolsAppliedTo: string[]` |
| Arrays for multi-select | ✅ `topicSpecialties: string[]` |

---

## Part 8: Implementation Priorities

### Phase 1: MVP Launch (Minimum Required)
Collect at onboarding - required for basic matching:
- `icuTypeWhenApplied` **REQUIRED** (direct match with applicants)
- `yearsIcuWhenApplied` **REQUIRED** (timeline matching)
- `timezone` **REQUIRED** (scheduling)
- `availabilityStatus` **REQUIRED** (urgency matching)

### Phase 2: Enhanced Matching (Optional at Onboarding)
Prompt but don't require:
- `schoolsAppliedTo` / `schoolsAcceptedTo` (program matching - PRIVATE)
- `applicationGpa` / `applicationScienceGpa` (range matching)
- `topicSpecialties` (service matching)
- `hospitalName` (same-hospital matching)
- `languages` (non-English support)

### Phase 3: Progressive Profiling
Add after first booking via profile completion nudges:
- `communicationStyle` / `feedbackStyle`
- `mentoringDescription`
- Detailed service-level expertise

### Phase 4: ML Preparation
Start collecting after 100+ bookings:
- `BookingOutcome` feedback tags
- Long-term success tracking
- Referral tracking

---

## Part 9: Remaining Open Questions

1. **Program data linkage** - Should `schoolsAppliedTo` be free-text or linked to our program database IDs? (Recommend: linked to IDs for exact matching)

2. **Feedback timing** - When to collect BookingOutcome? Immediately after? 24 hours? (Recommend: 24 hours with reminder)

3. **Success tracking** - How long to wait before asking if applicant got accepted? (Recommend: 6 months after booking, or when they update their stage to 'accepted')

---

## Part 10: Usage Notes for Implementation

When building the marketplace, reference this document for:

1. **Provider Onboarding Flow** - Use the questionnaire structure in Part 5
2. **Database Schema** - Use the interfaces in Part 6
3. **Matching Algorithm** - Use the signal mapping in Part 3
4. **Privacy Controls** - Ensure school data stays private per Part 1.3
5. **Availability Display** - Show availability status prominently per Part 2.2

---

## References

- [data-shapes.md](../skills/data-shapes.md) - Existing data models
- [user-meta-fields.md](../skills/user-meta-fields.md) - User field conventions
- [api-contracts.md](../skills/api-contracts.md) - API patterns
- [canonical-user-model.md](../skills/canonical-user-model.md) - Comprehensive user data catalog
- [readyscore-system.md](../skills/readyscore-system.md) - Scoring patterns for reference
