# Marketplace AI Opportunity Roadmap

**The CRNA Club - Mentor Marketplace Intelligence Strategy**

This document outlines practical AI/ML opportunities for the SRNA Marketplace, organized by implementation phase and complexity.

---

## Executive Summary

The CRNA Club has a **unique advantage**: rich applicant data (academic profiles, target programs, clinical experience, application stage) that enables intelligent mentor matching beyond basic marketplaces.

**Key Opportunities:**
1. **Phase 1 (MVP)**: Rule-based matching using existing data (no ML required)
2. **Phase 2**: Simple collaborative filtering and engagement nudges
3. **Phase 3**: Predictive matching and success scoring

**Strategic Approach:** Start simple with rules, collect interaction data, then layer in ML as data grows.

---

## Current Data Assets

### What We Already Have (from Canonical User Model)

**Applicant Profile Data:**
- Target programs (specific schools applying to)
- Academic profile (GPA, prerequisites, GRE scores)
- Clinical profile (ICU type, years experience, certifications)
- Application stage (exploring, applying, interviewing)
- Tracker data (clinical entries, shadow days, EQ reflections)
- ReadyScore (0-100 readiness metric)

**SRNA Provider Data (to be collected):**
- Program attending (critical for matching)
- Program year (1st, 2nd, 3rd year perspective)
- Undergraduate background (ICU type before school)
- Services offered (mock interview, essay review, etc.)
- Availability windows
- Pricing per service

**Platform Context:**
- Small marketplace (~50-200 SRNAs, ~2000 applicants)
- High-value, high-trust services ($50-200 per session)
- Niche vertical (not competing with Fiverr/Upwork)
- Relationship-driven (repeat bookings expected)

---

## Phase 1: Rule-Based "AI" (MVP - Launch Ready)

**Philosophy:** Smart rules feel like AI to users. Use deterministic logic based on data we already have.

### 1.1 Provider Matching Rules

#### Rule 1: Target Program Match (Highest Signal)
```
IF applicant.targetPrograms INCLUDES provider.programName
  → BOOST provider to "Recommended for You" section
  → ADD badge: "At [Program Name]"
  → PRIORITY: 10 (highest)
```

**Why this works:** Applicants desperately want insights from students at their target schools.

**Implementation:** Simple array intersection check.

#### Rule 2: Similar Background Match
```
IF applicant.primaryIcuType === provider.priorIcuType
  → ADD badge: "Also worked in [ICU Type]"
  → PRIORITY: 7
```

**Why this works:** Shared clinical background builds trust and relevance.

#### Rule 3: Service Type × Application Stage Match
```
STAGE_SERVICE_MAP = {
  'exploring': ['strategy_session', 'school_qa'],
  'preparing': ['resume_review', 'essay_review', 'strategy_session'],
  'applying': ['essay_review', 'resume_review', 'application_strategy'],
  'interviewing': ['mock_interview', 'interview_coaching']
}

IF applicant.currentStage IN STAGE_SERVICE_MAP
  → FILTER services to show relevant types first
  → PRIORITY: 5
```

**Why this works:** Different needs at different stages.

#### Rule 4: Prerequisite Gap Match
```
IF applicant MISSING prerequisite X
  AND provider offers 'clinical_tutoring' in X
  → SHOW provider in "Get Help With [Subject]"
  → PRIORITY: 6
```

**Why this works:** Targeted help for specific gaps.

#### Rule 5: Certification Prep Match
```
IF applicant.certifications[CCRN].status === 'studying'
  AND provider offers 'ccrn_tutoring'
  → BOOST provider
  → PRIORITY: 6
```

### 1.2 Search & Filter Intelligence

#### Smart Default Filters (No ML Needed)
```javascript
function getDefaultFilters(applicant) {
  return {
    // If they have target programs, default to showing those providers
    programs: applicant.targetPrograms.map(t => t.program.name),

    // Default to services relevant to their stage
    serviceTypes: STAGE_SERVICE_MAP[applicant.currentStage],

    // Default sort by "Relevance" (composite of rules above)
    sortBy: 'relevance'
  }
}
```

#### Query Understanding (Simple Pattern Matching)
```javascript
const QUERY_PATTERNS = {
  'georgetown': { filterBy: 'program', value: 'Georgetown' },
  'cvicu': { filterBy: 'backgroundIcuType', value: 'cvicu' },
  'essay': { filterBy: 'serviceType', value: 'essay_review' },
  'interview prep': { filterBy: 'serviceType', value: 'mock_interview' },
  'gre': { filterBy: 'serviceType', value: 'gre_tutoring' }
}
```

**Example:** User searches "Georgetown interview" → Auto-filters to Georgetown SRNAs offering mock interviews.

### 1.3 Provider Ranking Algorithm (Composite Score)

```javascript
function calculateRelevanceScore(provider, applicant) {
  let score = 0;

  // Target program match (strongest signal)
  if (applicant.targetPrograms.some(t => t.program.name === provider.programName)) {
    score += 100;
  }

  // Similar ICU background
  if (applicant.primaryIcuType === provider.priorIcuType) {
    score += 50;
  }

  // Service type matches stage
  const relevantServices = STAGE_SERVICE_MAP[applicant.currentStage];
  const matchingServices = provider.services.filter(s =>
    relevantServices.includes(s.type)
  );
  score += matchingServices.length * 20;

  // Provider quality signals (simple heuristics)
  score += provider.totalBookings * 2; // Experience matters
  score += provider.averageRating * 10; // Max +50 for 5-star

  // Response time (faster = better)
  if (provider.avgResponseTimeHours < 2) score += 30;
  else if (provider.avgResponseTimeHours < 6) score += 20;
  else if (provider.avgResponseTimeHours < 24) score += 10;

  // Profile completeness
  if (provider.bio.length > 200) score += 10;
  if (provider.avatarUrl) score += 5;

  return score;
}
```

**Display Logic:**
- Score 100+: "Highly Recommended for You"
- Score 50-99: "Recommended"
- Score 0-49: Standard listing

### 1.4 Provider Display Sections

```
┌─────────────────────────────────────────────────┐
│ 🎯 SRNAs at Your Target Programs                │
│ [Providers matching target programs]            │
│ → Sorted by rating, then response time         │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ 💡 Recommended For You                           │
│ [Composite relevance score 50+]                 │
│ → Badge shows WHY: "Also CVICU" "Offers Mock"  │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ ⭐ Top Rated Mentors                             │
│ [Rating >= 4.8, bookings >= 10]                │
│ → Social proof for quality                      │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ 🔥 Popular Right Now                             │
│ [Most bookings in last 30 days]                 │
│ → Availability signal                            │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ 📚 All Mentors                                   │
│ [Remaining providers, sorted by relevance]      │
└─────────────────────────────────────────────────┘
```

### 1.5 Quality Signals (Heuristic-Based)

**No ML needed - simple calculations:**

| Signal | Calculation | Display |
|--------|-------------|---------|
| Response Time | Median time from inquiry to first response | "Usually responds in 2 hours" |
| Completion Rate | (completed bookings / total bookings) × 100 | "99% completion rate" |
| Repeat Rate | (repeat customers / unique customers) × 100 | "45% of clients rebook" |
| Profile Strength | Bio length + avatar + services offered | "Complete Profile" badge |
| Availability | Open slots next 14 days / 14 | "High availability" vs "Limited slots" |
| Recent Activity | Last booking date | "Active this week" |

**Trust Badges (Auto-Awarded):**
- ✅ **Verified SRNA**: School confirmed
- 🌟 **Top Rated**: 4.8+ rating, 10+ bookings
- ⚡ **Quick Responder**: <3 hour avg response
- 🔁 **Client Favorite**: 40%+ repeat rate
- 📅 **Highly Available**: 50%+ slots open

### 1.6 Pricing Intelligence (Rule-Based)

**No dynamic pricing yet - just smart guidance:**

```javascript
// Suggested price ranges by service type
const PRICE_BENCHMARKS = {
  mock_interview: { min: 75, median: 100, max: 150 },
  essay_review: { min: 50, median: 75, max: 125 },
  resume_review: { min: 40, median: 60, max: 100 },
  strategy_session: { min: 60, median: 85, max: 140 },
  school_qa: { min: 30, median: 50, max: 80 },
  clinical_tutoring: { min: 50, median: 75, max: 120 }
}

function suggestPrice(serviceType, providerStats) {
  const benchmark = PRICE_BENCHMARKS[serviceType];

  // New provider: suggest median
  if (providerStats.totalBookings < 5) {
    return benchmark.median;
  }

  // High-rated, experienced: suggest 75th percentile
  if (providerStats.averageRating >= 4.8 && providerStats.totalBookings >= 20) {
    return benchmark.median + ((benchmark.max - benchmark.median) / 2);
  }

  // Default: median
  return benchmark.median;
}
```

**Display to Providers:**
```
┌────────────────────────────────────────────────┐
│ 💰 Pricing Guidance                             │
│ Based on 45 similar services:                  │
│ • Typical range: $75 - $150                    │
│ • Most common: $100                            │
│ • Your experience suggests: $110 - $125        │
└────────────────────────────────────────────────┘
```

---

## Phase 2: Basic ML (Post-Launch, 3-6 Months)

**Prerequisites:**
- 100+ completed bookings
- 50+ providers
- User interaction data collected

### 2.1 Collaborative Filtering (Item-Item)

**Approach:** "Users who booked Provider A also booked Provider B"

**Why Item-Item (not User-User):**
- Smaller provider pool than applicant pool (more stable)
- Provider similarities change less than user preferences
- Better for cold start (new users)

**Simple Implementation (Memory-Based):**
```python
# Pseudo-code for item-item collaborative filtering
def calculate_provider_similarity(provider_a, provider_b, booking_matrix):
    """
    booking_matrix: users × providers matrix (1 if booked, 0 otherwise)
    """
    # Cosine similarity between provider vectors
    vector_a = booking_matrix[:, provider_a]
    vector_b = booking_matrix[:, provider_b]

    similarity = cosine_similarity(vector_a, vector_b)
    return similarity

def get_similar_providers(provider_id, booking_matrix, top_n=5):
    """
    Find providers similar based on who books them together
    """
    similarities = []
    for other_provider in all_providers:
        if other_provider != provider_id:
            sim = calculate_provider_similarity(provider_id, other_provider, booking_matrix)
            similarities.append((other_provider, sim))

    # Return top N most similar
    return sorted(similarities, key=lambda x: x[1], reverse=True)[:top_n]
```

**Display:**
```
After booking with Sarah (Georgetown Mock Interview):
┌────────────────────────────────────────────────┐
│ Users who booked Sarah also worked with:       │
│ • Emily - Georgetown Essay Review (73% match) │
│ • James - Duke Mock Interview (68% match)     │
│ • Maria - Application Strategy (65% match)    │
└────────────────────────────────────────────────┘
```

**Data to Collect NOW (for future CF):**
- Booking co-occurrence (same user books multiple providers)
- Service sequence (what they book after mock interview)
- Rating correlation (if you liked A, you'll like B)

### 2.2 Simple Recommendation Model

**Approach:** Hybrid of content-based (Phase 1 rules) + collaborative filtering

```javascript
function generateRecommendations(applicant, allProviders, bookingData) {
  const recommendations = [];

  for (const provider of allProviders) {
    let score = 0;

    // CONTENT-BASED (Phase 1 rules) - 60% weight
    const contentScore = calculateRelevanceScore(provider, applicant);
    score += contentScore * 0.6;

    // COLLABORATIVE FILTERING - 40% weight
    const cfScore = getCollaborativeScore(provider, applicant, bookingData);
    score += cfScore * 0.4;

    recommendations.push({ provider, score, breakdown: { contentScore, cfScore } });
  }

  return recommendations.sort((a, b) => b.score - a.score);
}

function getCollaborativeScore(provider, applicant, bookingData) {
  // Find similar users (same stage, similar targets)
  const similarUsers = findSimilarUsers(applicant, bookingData);

  // What did they book?
  const bookingCounts = {};
  similarUsers.forEach(user => {
    user.bookings.forEach(booking => {
      bookingCounts[booking.providerId] = (bookingCounts[booking.providerId] || 0) + 1;
    });
  });

  // Score this provider based on popularity among similar users
  return bookingCounts[provider.id] || 0;
}
```

### 2.3 Engagement Nudges (Triggered Messages)

**Simple rule-based triggers, no ML needed:**

#### Discovery Nudges
| Trigger | Message | CTA |
|---------|---------|-----|
| Has target program + hasn't browsed marketplace | "3 SRNAs at Georgetown offer mock interviews" | [Browse Mentors] |
| Viewed provider 3+ times, no booking | "Still considering Sarah? She's available this week" | [Book Session] |
| Application stage → Interviewing | "Interview prep time! 12 mentors offer mock interviews" | [Find Your Coach] |
| ReadyScore < 60 in Materials | "Get your essay reviewed by an SRNA - avg 4.9★ rating" | [Browse Services] |

#### Urgency Nudges
| Trigger | Message | CTA |
|---------|---------|-----|
| Target deadline < 30 days, no essay review booked | "Georgetown deadline in 28 days. Book essay review now" | [Browse Reviews] |
| Interview date < 14 days, no mock interview | "Interview in 12 days - practice with an SRNA mentor" | [Find Coaches] |

#### Retention Nudges
| Trigger | Message | CTA |
|---------|---------|-----|
| Completed booking, 5-star rating | "Loved working with Sarah? Rebook for interview prep" | [Book Again] |
| Completed booking 30 days ago | "Ready for your next milestone? Browse mentors" | [Explore Services] |

#### Provider Nudges
| Trigger | Message | CTA |
|---------|---------|-----|
| New inquiry from target match | "New inquiry from an applicant to your program!" | [Respond Now] |
| Response time > 24 hours | "Quick responses = more bookings. Reply within 6 hours" | [View Inbox] |
| No bookings in 14 days | "Update your availability to get more bookings" | [Edit Calendar] |

### 2.4 Search Improvement (Learning from Queries)

**Track and Learn:**
```javascript
// Log every search
const searchLog = {
  userId: 'user_123',
  query: 'Georgetown interview prep',
  filters: { program: 'Georgetown', serviceType: 'mock_interview' },
  resultsCount: 5,
  resultsClicked: ['provider_42', 'provider_103'],
  bookingMade: 'provider_42',
  timestamp: '2025-12-07T10:30:00Z'
}
```

**Simple Analytics:**
1. **Query clustering**: Group similar searches ("interview prep" = "mock interview" = "practice interview")
2. **Click-through rate by position**: Are top results getting clicks?
3. **Booking conversion by search**: Which queries lead to bookings?
4. **Zero-result queries**: What are users searching for that we can't match?

**Improvements:**
- Add synonyms to search (interview = mock, essay = personal statement)
- Boost providers with high CTR for specific queries
- Alert admins to unmatched queries (opportunity to recruit SRNAs)

### 2.5 Review Sentiment Analysis (Basic)

**Approach:** Simple keyword-based sentiment + manual review flagging

```javascript
const POSITIVE_KEYWORDS = [
  'helpful', 'great', 'excellent', 'amazing', 'thorough',
  'prepared', 'confident', 'detailed', 'supportive', 'patient'
];

const NEGATIVE_KEYWORDS = [
  'unhelpful', 'rushed', 'late', 'canceled', 'rude',
  'unprepared', 'waste', 'confusing', 'disappointing'
];

const SUSPICIOUS_PATTERNS = [
  { pattern: /(.)\1{4,}/, flag: 'character_repetition' }, // "greaaaat"
  { pattern: /^(.{10,}?)\1+$/, flag: 'copy_paste' }, // Repeated text
  { pattern: /\b(buy|sell|discount|promo)\b/i, flag: 'spam_keywords' }
];

function analyzeReview(reviewText, rating) {
  const analysis = {
    sentiment: 'neutral',
    suspiciousFlags: [],
    keywords: []
  };

  // Count positive/negative keywords
  const positiveCount = POSITIVE_KEYWORDS.filter(kw =>
    reviewText.toLowerCase().includes(kw)
  ).length;

  const negativeCount = NEGATIVE_KEYWORDS.filter(kw =>
    reviewText.toLowerCase().includes(kw)
  ).length;

  // Sentiment
  if (positiveCount > negativeCount + 2) analysis.sentiment = 'positive';
  else if (negativeCount > positiveCount + 1) analysis.sentiment = 'negative';

  // Check for rating-sentiment mismatch (fake review signal)
  if (rating >= 4 && analysis.sentiment === 'negative') {
    analysis.suspiciousFlags.push('rating_sentiment_mismatch');
  }
  if (rating <= 2 && analysis.sentiment === 'positive') {
    analysis.suspiciousFlags.push('rating_sentiment_mismatch');
  }

  // Check suspicious patterns
  SUSPICIOUS_PATTERNS.forEach(({ pattern, flag }) => {
    if (pattern.test(reviewText)) {
      analysis.suspiciousFlags.push(flag);
    }
  });

  // Flag for manual review if suspicious
  if (analysis.suspiciousFlags.length > 0) {
    analysis.requiresReview = true;
  }

  return analysis;
}
```

**Use Cases:**
- Auto-flag suspicious reviews for admin review
- Extract positive keywords for provider profile ("thorough", "patient")
- Identify quality issues early (negative sentiment trending)

---

## Phase 3: Advanced AI (12+ Months, Mature Marketplace)

**Prerequisites:**
- 500+ completed bookings
- 100+ providers
- Rich interaction data
- Budget for ML infrastructure

### 3.1 Predictive Matching (Success Scoring)

**Goal:** Predict booking success BEFORE it happens

**Model:** Gradient boosted trees (XGBoost/LightGBM)

**Features:**
```python
features = {
    # Applicant features
    'applicant_stage': 'interviewing',
    'applicant_readyscore': 72,
    'applicant_target_programs_count': 3,
    'applicant_has_target_match': True,  # Provider at target school

    # Provider features
    'provider_rating': 4.9,
    'provider_total_bookings': 45,
    'provider_completion_rate': 0.98,
    'provider_response_time_hours': 2.5,
    'provider_repeat_rate': 0.42,

    # Match features
    'same_icu_background': True,
    'service_stage_match': True,  # Mock interview + interviewing stage
    'price_vs_median': 1.1,  # 10% above median
    'availability_next_week': True,

    # Behavioral features
    'applicant_viewed_profile_count': 2,
    'applicant_viewed_similar_providers': 5,
    'time_of_week': 'weekday_evening',
    'days_until_deadline': 28
}

target = 'booking_completed_with_5_star'  # Binary: 0 or 1
```

**Prediction Output:**
```javascript
{
  provider_id: 'provider_42',
  match_score: 0.87,  // 87% predicted success
  confidence: 'high',
  reasons: [
    { factor: 'target_program_match', impact: +0.35 },
    { factor: 'provider_rating', impact: +0.15 },
    { factor: 'same_icu_background', impact: +0.12 },
    { factor: 'service_stage_match', impact: +0.10 },
    { factor: 'response_time', impact: +0.08 }
  ]
}
```

**Display:**
```
┌────────────────────────────────────────────────┐
│ Sarah Martinez                                 │
│ Georgetown University, 2nd Year SRNA          │
│                                                │
│ 🎯 97% Match - Highly Recommended             │
│                                                │
│ Why this match:                                │
│ ✓ Currently at your target program            │
│ ✓ Also worked in CVICU (like you)            │
│ ✓ 4.9★ from 45+ applicants                   │
│ ✓ Specializes in interview prep               │
│                                                │
│ [$100/hour] [Book Session →]                  │
└────────────────────────────────────────────────┘
```

### 3.2 Dynamic Pricing (Demand-Based)

**Model:** Reinforcement learning or simple demand multiplier

**Factors:**
```javascript
function calculateDynamicPrice(basePrice, context) {
  let multiplier = 1.0;

  // Demand signal
  if (context.bookings_last_7_days > context.avg_weekly * 1.5) {
    multiplier *= 1.15;  // High demand, +15%
  }

  // Supply signal
  if (context.available_slots_next_14_days < 3) {
    multiplier *= 1.10;  // Low supply, +10%
  }

  // Urgency signal (applicant's deadline approaching)
  if (context.applicant_deadline_days < 14) {
    multiplier *= 1.05;  // Urgency, +5%
  }

  // Provider quality premium
  if (context.provider_rating >= 4.9 && context.provider_repeat_rate > 0.4) {
    multiplier *= 1.10;  // Premium quality, +10%
  }

  // Cap multiplier at 1.3x (never more than 30% increase)
  multiplier = Math.min(multiplier, 1.3);

  return Math.round(basePrice * multiplier);
}
```

**Transparency:**
```
┌────────────────────────────────────────────────┐
│ 💡 Pricing Insight                             │
│ This session is $120 (typically $100)         │
│ • High demand this week                        │
│ • Limited availability                         │
│ • Premium provider (4.9★, top 10%)           │
└────────────────────────────────────────────────┘
```

### 3.3 Conversational Search (LLM-Powered)

**Approach:** Use GPT-4 or Claude to understand natural queries

**Example:**
```
User: "I need help getting into Georgetown, especially with my essay"

LLM Processing:
{
  intent: 'find_mentor',
  program: 'Georgetown University',
  service_types: ['essay_review', 'application_strategy'],
  implied_stage: 'applying',
  urgency: 'medium'
}

Results:
→ Filter to Georgetown SRNAs
→ Services: Essay Review, Application Strategy
→ Sort by: Essay review ratings first
→ Add badge: "Georgetown Expert"
```

**Conversational Follow-Up:**
```
System: "I found 4 Georgetown SRNAs who specialize in essay review.
        Would you like to see all essay reviewers, or just Georgetown?"

User: "Just Georgetown for now"

System: "Great! Here are 4 Georgetown SRNAs. Sarah has the highest rating
        for essays (4.9★ from 23 reviews). When do you need this reviewed?"

User: "My deadline is in 3 weeks"

System: "I'll prioritize mentors with fast turnaround. Sarah typically
        delivers in 48 hours. Would you like to book with her?"
```

### 3.4 Personalization Engine (User Profiles)

**Build implicit preference profiles:**

```javascript
const userProfile = {
  userId: 'user_123',

  // Inferred preferences (from behavior)
  preferences: {
    priceRange: { min: 50, max: 120 },  // From viewed providers
    responseSpeedImportance: 'high',     // Clicked fast responders
    ratingThreshold: 4.7,                 // Never clicked < 4.7
    preferredProviderTraits: [
      { trait: 'same_icu_background', weight: 0.8 },
      { trait: 'at_target_program', weight: 1.0 },
      { trait: 'high_repeat_rate', weight: 0.6 }
    ]
  },

  // Engagement patterns
  engagement: {
    typicalSearchTime: 'weekday_evening',  // 6-9pm weekdays
    avgTimeToDecision: 4.2,  // Days from first view to booking
    researchDepth: 'high',   // Views 8+ profiles before booking
    pricesensitivity: 'medium'  // Books mid-range prices
  },

  // Journey stage
  journey: {
    firstMarketplaceVisit: '2024-10-15',
    totalProviderViews: 23,
    bookingsMade: 1,
    servicesBooked: ['essay_review'],
    nextLikelyService: 'mock_interview'  // Predicted
  }
}
```

**Use for:**
- Default filters match preferences
- Sort order reflects priorities (rating > price for this user)
- Nudge timing matches engagement patterns (send evening emails)
- Service recommendations (predict next need)

### 3.5 Automated Quality Coaching

**Goal:** Help providers improve using ML insights

**Provider Dashboard Widget:**
```
┌────────────────────────────────────────────────┐
│ 📊 Your Performance Insights                   │
│                                                │
│ Good News:                                     │
│ ✓ Your response time (1.2h) is top 10%       │
│ ✓ 92% of clients rebook - excellent!          │
│                                                │
│ Opportunities:                                 │
│ ⚠️ Conversion rate: 45% (avg is 62%)          │
│   → Tip: Add more detail to your bio          │
│   → Tip: Offer a free 15-min consultation     │
│                                                │
│ ⚠️ Weekend availability: 20% (avg 55%)        │
│   → Insight: 38% of bookings happen weekends  │
│   → Action: Open 2-3 weekend slots?           │
└────────────────────────────────────────────────┘
```

**ML Model:** Compare provider to top performers, identify gaps

---

## Phase 4: Reverse Flow - Job Posting Matching

**When:** Phase 3 (only if marketplace volume supports it)

### Applicant Posts Need → Providers Apply

**Data Model:**
```javascript
interface JobPosting {
  id: string;
  applicantId: string;

  // Need details
  serviceType: 'mock_interview' | 'essay_review' | etc.
  description: string;
  targetPrograms: string[];  // "Georgetown", "Duke"

  // Budget & timing
  budget: { min: number, max: number };
  deadlineDate: Date;
  preferredSchedule: string;  // "Weekday evenings", "ASAP"

  // Auto-filled from applicant profile
  applicantStage: string;
  applicantBackground: {
    icuType: string,
    yearsExperience: number,
    gpa: number
  };

  status: 'open' | 'reviewing_applications' | 'booked' | 'closed';
  applications: JobApplication[];
}

interface JobApplication {
  id: string;
  providerId: string;
  proposedPrice: number;
  message: string;
  availability: Date[];
  appliedAt: Date;

  // Auto-calculated
  matchScore: number;  // ML score
  matchReasons: string[];
}
```

### Matching Algorithm (Provider Side)

**Show relevant job postings:**

```javascript
function matchJobsToProvider(provider, allJobs) {
  return allJobs
    .filter(job => job.status === 'open')
    .map(job => ({
      job,
      score: calculateJobMatchScore(provider, job),
      reasons: getMatchReasons(provider, job)
    }))
    .sort((a, b) => b.score - a.score);
}

function calculateJobMatchScore(provider, job) {
  let score = 0;

  // Service type match (required)
  if (!provider.services.some(s => s.type === job.serviceType)) {
    return 0;  // Not qualified
  }
  score += 50;

  // Target program match
  if (job.targetPrograms.includes(provider.programName)) {
    score += 100;  // Strongest signal
  }

  // Background match
  if (job.applicantBackground.icuType === provider.priorIcuType) {
    score += 40;
  }

  // Price fit
  const providerAvgPrice = provider.services
    .find(s => s.type === job.serviceType)?.price || 0;

  if (providerAvgPrice >= job.budget.min && providerAvgPrice <= job.budget.max) {
    score += 30;
  }

  // Availability match
  // ... (check if provider available when applicant needs)

  // Provider quality signals
  if (provider.averageRating >= 4.8) score += 20;
  if (provider.completionRate >= 0.95) score += 10;

  return score;
}
```

**Display to Provider:**
```
┌────────────────────────────────────────────────┐
│ 🎯 Highly Recommended Job (95% Match)          │
│                                                │
│ Georgetown Applicant needs Mock Interview      │
│ Budget: $100-$125                              │
│ Deadline: Interview in 10 days                 │
│                                                │
│ Why you're a great fit:                        │
│ ✓ You're at Georgetown (their target)         │
│ ✓ You both have CVICU background              │
│ ✓ Price fits their budget                     │
│ ✓ Your rating: 4.9★ (top 5%)                  │
│                                                │
│ [Apply for This Job] [Pass]                   │
└────────────────────────────────────────────────┘
```

---

## Smart Nudge Triggers (Complete Catalog)

### Marketplace Discovery Nudges

| Nudge ID | Trigger | Message Template | Priority | Frequency |
|----------|---------|------------------|----------|-----------|
| `MKT_TARGET_MATCH` | Has 1+ target programs AND hasn't visited marketplace | "{count} SRNAs at {programName} offer mentoring. Explore now!" | High | Once |
| `MKT_STAGE_SERVICE` | Stage changes to 'interviewing' AND no mock interview booked | "Interview prep time! 12 mentors offer mock interviews - avg 4.9★" | High | Once per stage |
| `MKT_DEADLINE_APPROACHING` | Target deadline < 45 days AND no marketplace visits | "Georgetown deadline in 6 weeks. Get your essay reviewed by an SRNA" | High | Weekly until visit |
| `MKT_GAP_SERVICE` | Missing prereq OR low ReadyScore component | "Struggling with Organic Chem? 3 SRNAs offer tutoring in your area" | Medium | Once |
| `MKT_NEW_PROVIDER` | New provider joins at applicant's target program | "New! {ProviderName} from {ProgramName} just joined as a mentor" | Medium | Real-time |

### Booking Conversion Nudges

| Nudge ID | Trigger | Message Template | Priority | Frequency |
|----------|---------|------------------|----------|-----------|
| `CONV_VIEWED_NO_BOOK` | Viewed provider 3+ times, no booking | "Still considering {ProviderName}? She's available this week" | Medium | Once after 3 days |
| `CONV_CART_ABANDON` | Started booking flow, didn't complete | "Your session with {ProviderName} is still available. Complete booking?" | High | Once after 2 hours |
| `CONV_DEADLINE_URGENCY` | Deadline < 14 days, viewed providers but no booking | "{ProgramName} deadline in {days} days. Book your essay review now?" | High | Every 3 days |
| `CONV_PRICE_DROP` | Provider lowers price on service user viewed | "{ProviderName} lowered their price to ${newPrice}. Book now!" | High | Real-time |
| `CONV_AVAILABILITY_OPEN` | Provider user favorited opens new slots | "{ProviderName} just opened availability for next week" | Medium | Real-time |

### Post-Booking Engagement

| Nudge ID | Trigger | Message Template | Priority | Frequency |
|----------|---------|------------------|----------|-----------|
| `POST_LEAVE_REVIEW` | Booking completed 48 hours ago, no review | "How was your session with {ProviderName}? Leave a review" | Medium | Once after 2 days |
| `POST_REBOOK_PROMPT` | Booked service A, likely needs service B next | "Ready for the next step? Book your mock interview now" | Medium | 7 days after first booking |
| `POST_SAME_PROVIDER` | 5-star review left, same provider has other services | "Loved working with {ProviderName}? She also offers {OtherService}" | Medium | Once |
| `POST_REFERRAL` | 2+ successful bookings | "Know someone applying? Give $25, get $25 in marketplace credit" | Low | Once per user |

### Provider Engagement Nudges

| Nudge ID | Trigger | Message Template | Priority | Frequency |
|----------|---------|------------------|----------|-----------|
| `PROV_NEW_INQUIRY` | New booking request received | "New inquiry from a {ProgramName} applicant!" | High | Real-time |
| `PROV_MATCH_ALERT` | High-match applicant viewed profile | "Great fit! An applicant to your program viewed your profile" | Medium | Real-time |
| `PROV_SLOW_RESPONSE` | Inquiry > 12 hours, no response | "Quick reminder: {ApplicantName} is waiting for your response" | High | Once after 12h |
| `PROV_NO_BOOKINGS` | No bookings in 21 days | "Update your availability to get more bookings" | Medium | Every 21 days |
| `PROV_INCOMPLETE_PROFILE` | Profile completeness < 80% | "Complete your profile to get 3x more views" | Medium | Weekly until 80% |
| `PROV_PRICING_TOO_HIGH` | Price > 90th percentile, low bookings | "Your prices may be limiting bookings. Industry avg: ${avgPrice}" | Low | Once per month |

### Marketplace Quality Nudges

| Nudge ID | Trigger | Message Template | Priority | Frequency |
|----------|---------|------------------|----------|-----------|
| `QLTY_LOW_RATING_ALERT` | Provider drops below 4.0 rating | "Your rating dropped to {rating}. Need help improving?" | High | Real-time |
| `QLTY_MULTIPLE_CANCELS` | 2+ cancellations in 30 days | "Multiple cancellations hurt your ranking. What's going on?" | High | Real-time |
| `QLTY_LATE_DELIVERY` | Async service delivered > promised time | "Late delivery impacts your completion rate. Stay on track!" | Medium | Real-time |

---

## Data Collection Requirements

### Events to Track NOW (Even Phase 1)

**Critical for future ML:**

```typescript
// Marketplace interaction events
interface MarketplaceEvent {
  eventType:
    | 'provider_viewed'
    | 'provider_favorited'
    | 'service_viewed'
    | 'search_performed'
    | 'filter_applied'
    | 'sort_changed'
    | 'booking_started'
    | 'booking_completed'
    | 'booking_cancelled'
    | 'review_submitted'
    | 'message_sent'
    | 'inquiry_made';

  userId: string;
  sessionId: string;
  timestamp: Date;

  // Context
  applicantStage: string;
  applicantTargetPrograms: string[];

  // Event-specific data
  metadata: {
    // For provider_viewed
    providerId?: string;
    dwellTimeSeconds?: number;  // How long on profile
    scrollDepth?: number;  // % of profile viewed

    // For search_performed
    query?: string;
    filters?: object;
    resultsCount?: number;

    // For booking_completed
    serviceId?: string;
    price?: number;
    bookingId?: string;

    // For review_submitted
    rating?: number;
    reviewText?: string;
    reviewSentiment?: 'positive' | 'neutral' | 'negative';
  };
}
```

### Data Warehouse Schema

**Core Tables:**

```sql
-- Users (applicants and providers)
users (
  id, email, name, role, created_at, current_stage, subscription_tier
)

-- Providers
providers (
  id, user_id, program_name, program_year, prior_icu_type,
  bio, avatar_url, avg_rating, total_bookings,
  completion_rate, avg_response_time_hours, approved_at
)

-- Services
services (
  id, provider_id, type, title, description, price,
  duration_minutes, is_active, created_at
)

-- Bookings
bookings (
  id, service_id, provider_id, applicant_id,
  status, price, scheduled_at, completed_at,
  rating, review_text, review_sentiment
)

-- Marketplace Events (analytics)
marketplace_events (
  id, event_type, user_id, session_id, timestamp,
  provider_id, service_id, booking_id,
  metadata_json
)

-- Provider Match Scores (computed daily)
provider_match_scores (
  applicant_id, provider_id, computed_at,
  relevance_score, cf_score, ml_score,
  reasons_json
)

-- Search Queries (for optimization)
search_queries (
  id, user_id, query, filters_json,
  results_count, clicked_provider_ids,
  booking_made, timestamp
)
```

### Feature Engineering Pipeline

**Batch compute daily:**

```javascript
// For each applicant
const dailyFeatures = {
  applicantId: 'user_123',
  computedAt: '2025-12-07',

  // Engagement features
  marketplaceVisits: 5,
  totalProviderViews: 12,
  uniqueProvidersViewed: 8,
  avgDwellTimeSeconds: 45,
  favoriteCount: 2,
  searchCount: 7,

  // Behavioral features
  priceRangeViewed: { min: 50, max: 150 },
  mostViewedServiceType: 'mock_interview',
  mostViewedProgram: 'Georgetown',
  timeOfDayPattern: 'evening',  // Most active 6-9pm

  // Journey features
  daysSinceFirstVisit: 12,
  bookingsMade: 1,
  avgDaysToBooking: 8,
  conversionRate: 0.125,  // 1 booking / 8 viewed

  // Predicted features
  nextLikelyService: 'essay_review',
  churnRisk: 'low',
  lifetimeValuePrediction: 250
};
```

---

## Implementation Complexity Matrix

| Feature | Value (1-10) | Complexity (1-10) | Time to Implement | When | Dependencies |
|---------|--------------|-------------------|-------------------|------|--------------|
| **Phase 1: Rule-Based** | | | | | |
| Target program matching | 10 | 2 | 1 day | Launch | Program data |
| Similar background badges | 8 | 2 | 1 day | Launch | ICU type fields |
| Service-stage matching | 9 | 3 | 2 days | Launch | Stage enum |
| Smart default filters | 7 | 3 | 2 days | Launch | User preferences |
| Composite ranking score | 9 | 4 | 3 days | Launch | All profile data |
| Provider sections (Recommended, etc) | 8 | 3 | 2 days | Launch | Ranking algo |
| Quality signals (response time, etc) | 8 | 4 | 3 days | Launch | Booking metadata |
| Trust badges (auto-awarded) | 7 | 3 | 2 days | Launch | Provider stats |
| Price guidance (benchmarks) | 6 | 3 | 2 days | Launch | Service pricing data |
| Query pattern matching | 6 | 4 | 3 days | Week 2 | Search logs |
| **Phase 1 Total** | **8.2 avg** | **3.1 avg** | **2-3 weeks** | **Launch** | |
| **Phase 2: Basic ML** | | | | | |
| Item-item collaborative filtering | 8 | 6 | 1 week | Month 3 | 100+ bookings |
| Hybrid recommendations | 9 | 6 | 1 week | Month 3 | CF + content |
| Discovery nudges | 7 | 4 | 3 days | Month 2 | Event tracking |
| Urgency nudges | 8 | 4 | 3 days | Month 2 | Deadline data |
| Search query learning | 6 | 5 | 5 days | Month 4 | Search logs |
| Basic sentiment analysis | 6 | 5 | 5 days | Month 3 | Review data |
| Fake review detection | 7 | 5 | 5 days | Month 3 | Review patterns |
| Provider coaching insights | 7 | 6 | 1 week | Month 4 | Provider analytics |
| **Phase 2 Total** | **7.3 avg** | **5.1 avg** | **5-6 weeks** | **Months 2-4** | |
| **Phase 3: Advanced** | | | | | |
| Predictive match scoring (ML) | 10 | 8 | 3 weeks | Month 12 | 500+ bookings, ML infra |
| Dynamic pricing | 7 | 9 | 4 weeks | Month 18 | Pricing history, A/B testing |
| LLM conversational search | 8 | 7 | 2 weeks | Month 9 | LLM API access |
| Personalization engine | 9 | 8 | 3 weeks | Month 12 | User profiles |
| Automated quality coaching | 7 | 7 | 2 weeks | Month 10 | Provider analytics |
| Job posting matching | 6 | 8 | 3 weeks | Month 15 | Reverse flow UX |
| **Phase 3 Total** | **7.8 avg** | **7.8 avg** | **17 weeks** | **Months 9-18** | |

### Resource Requirements by Phase

**Phase 1 (Launch):**
- **Team**: 1 full-stack developer
- **Time**: 2-3 weeks
- **Infrastructure**: Standard web app (no ML)
- **Cost**: $0 additional (existing stack)

**Phase 2 (Months 2-4):**
- **Team**: 1 full-stack dev + 1 data analyst
- **Time**: 5-6 weeks (can be spread out)
- **Infrastructure**: Analytics DB (Postgres), basic Python ML environment
- **Cost**: ~$200/mo (analytics tooling)

**Phase 3 (Months 9-18):**
- **Team**: 1 ML engineer + 1 full-stack dev + 1 data scientist
- **Time**: 17 weeks (over 9 months, phased)
- **Infrastructure**: ML pipeline (Airflow), feature store, model serving, LLM API
- **Cost**: ~$1,500/mo (compute + LLM API costs)

---

## Quick Win Opportunities (Highest ROI)

**Top 5 Features to Build First:**

### 1. Target Program Matching (Value: 10/10, Complexity: 2/10)
**Why:** Applicants DESPERATELY want SRNAs from their target schools. This is the killer feature.
**Implementation:** 1 day
**Impact:** +40% booking conversion estimated

### 2. Composite Ranking Algorithm (Value: 9/10, Complexity: 4/10)
**Why:** Showing the RIGHT providers first = more bookings
**Implementation:** 3 days
**Impact:** +25% engagement on top results

### 3. Smart Default Filters (Value: 7/10, Complexity: 3/10)
**Why:** Reduce friction - pre-filter to what they need
**Implementation:** 2 days
**Impact:** +30% time-to-booking reduction

### 4. Discovery Nudges (Value: 7/10, Complexity: 4/10)
**Why:** Many applicants don't know marketplace exists
**Implementation:** 3 days
**Impact:** +50% marketplace awareness

### 5. Provider Quality Signals (Value: 8/10, Complexity: 4/10)
**Why:** Trust signals = higher conversion
**Implementation:** 3 days
**Impact:** +20% booking confidence

---

## Cold Start Strategies

**Challenge:** New marketplace = few providers, few bookings, no ML data

### Provider Cold Start (New SRNAs)

**Strategy 1: Content-Based Boosting**
```javascript
// New providers get temporary boost in rankings
if (provider.totalBookings < 5 && provider.approvedAt > Date.now() - 30days) {
  score += 20;  // "New Mentor" boost
  addBadge('New to Marketplace');
}
```

**Strategy 2: Preference Elicitation**
```
When provider signs up:
┌────────────────────────────────────────────────┐
│ Help applicants find you!                      │
│ Select your specialties: (3-5)                │
│ ☐ Interview prep for [Program Type]           │
│ ☐ Personal statement review                    │
│ ☐ GPA/prerequisite strategy                   │
│ ☐ Application timeline planning                │
│ ☐ CCRN exam prep                              │
└────────────────────────────────────────────────┘
```

**Strategy 3: Manual Curation**
```
Admin dashboard:
"Featured This Week" - Manually select 3 new providers to highlight
```

### Applicant Cold Start (New Users)

**Strategy 1: Explicit Preferences (Onboarding)**
```
First marketplace visit:
┌────────────────────────────────────────────────┐
│ 🎯 Find Your Perfect Mentor                    │
│                                                │
│ What are you looking for? (select all)        │
│ ☑ Mock interview practice                     │
│ ☑ Essay/personal statement review              │
│ ☐ Application strategy session                │
│ ☐ CCRN exam tutoring                          │
│                                                │
│ Your target programs:                          │
│ • Georgetown University                        │
│ • Duke University                              │
│                                                │
│ [Show Me Mentors →]                            │
└────────────────────────────────────────────────┘
```

**Strategy 2: Leverage Existing Profile**
```javascript
// We already know a LOT about applicants from main platform
const coldStartProfile = {
  targetPrograms: user.targetPrograms,  // Use for matching!
  currentStage: user.currentStage,      // Suggest relevant services
  icuType: user.primaryIcuType,         // Background matching
  upcomingDeadlines: user.targetPrograms[0].applicationDeadline
};

// Immediate personalization without ML
```

**Strategy 3: Social Proof Fallback**
```javascript
// If no personalized data, show popularity
if (bookingCount < minThreshold) {
  sortBy = 'most_booked_overall';  // Bandwagon effect
  showBadge = 'Most Popular';
}
```

### System Cold Start (Launch Day)

**Strategy 1: Seed with Manual Matches**
```
Pre-launch:
1. Recruit 20-30 diverse SRNAs (different programs, backgrounds)
2. Create "Staff Picks" section
3. Manually write compelling provider bios
4. Offer launch discount (10% off first booking)
```

**Strategy 2: Cross-Promote from Main Platform**
```
Dashboard nudge for ALL active applicants:
┌────────────────────────────────────────────────┐
│ 🆕 NEW: Book 1-on-1 sessions with SRNAs       │
│ Get personalized help with essays, interviews, │
│ and applications. 30 mentors available now.   │
│ [Explore Marketplace →]                        │
└────────────────────────────────────────────────┘
```

**Strategy 3: Incentivize Early Bookings**
```
First 100 bookings:
- 15% discount for applicants
- $25 bonus for providers
- Featured in "Early Adopter" showcase
```

---

## Success Metrics & Monitoring

### North Star Metrics

**Marketplace Health:**
- **Liquidity Rate**: % of searches that result in booking within 7 days (Target: >15%)
- **Match Quality**: Average rating of bookings from recommended providers (Target: >4.7)
- **Time to First Booking**: Days from marketplace launch to first booking per provider (Target: <14 days)

### Phase 1 KPIs (Rule-Based)

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Click-through rate on "Recommended for You" | >25% | Clicks / Impressions |
| Target program match conversion | >30% | Bookings from target match / Total bookings |
| Provider profile views per session | >3 | Avg profiles viewed per visit |
| Search → Booking conversion | >10% | Bookings / Search sessions |
| Trust badge correlation | +15% CTR | CTR with badge vs without |

### Phase 2 KPIs (Basic ML)

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Collaborative filtering lift | +20% | CF recommendations bookings vs baseline |
| Nudge engagement rate | >12% | Nudge clicks / Nudges shown |
| Search query understanding | >80% | Queries resulting in relevant results |
| Fake review detection accuracy | >85% | True positives / (True pos + False pos) |
| Repeat booking rate | >35% | Users with 2+ bookings / Total bookers |

### Phase 3 KPIs (Advanced AI)

| Metric | Target | How to Measure |
|--------|--------|----------------|
| ML match score AUC | >0.75 | Model performance on booking success |
| Dynamic pricing acceptance | >70% | Bookings at dynamic price / Total |
| LLM search satisfaction | >4.5/5 | User rating of search results |
| Personalization engine lift | +30% | Personalized vs generic CTR |
| Provider quality improvement | +0.3 rating | Avg rating change after coaching |

---

## A/B Testing Strategy

### Phase 1 Tests

**Test 1: Ranking Algorithm**
- **Variant A**: Rule-based composite score (Phase 1)
- **Variant B**: Simple popularity sort (bookings + rating)
- **Variant C**: Recency-weighted (newest providers first)
- **Measure**: Booking conversion rate, time on site

**Test 2: Provider Sections**
- **Variant A**: 4 sections (Target Match, Recommended, Top Rated, All)
- **Variant B**: 2 sections (Recommended, All)
- **Variant C**: No sections, single ranked list
- **Measure**: Scroll depth, profile clicks, booking rate

**Test 3: Trust Badges**
- **Variant A**: All badges shown (Verified, Top Rated, Quick Response, etc.)
- **Variant B**: Only verification badge
- **Variant C**: No badges
- **Measure**: CTR on badged vs non-badged providers

### Phase 2 Tests

**Test 4: Nudge Timing**
- **Variant A**: Immediate (show nudge on page load)
- **Variant B**: Delayed (show after 30 seconds)
- **Variant C**: Exit intent (show when leaving)
- **Measure**: Nudge click-through, annoyance (bounce rate)

**Test 5: Recommendation Mix**
- **Variant A**: 60% content, 40% collaborative
- **Variant B**: 50/50 split
- **Variant C**: 40% content, 60% collaborative
- **Measure**: Booking quality (ratings), diversity

---

## Ethical Considerations & Bias Mitigation

### Potential Biases to Monitor

**1. Availability Bias**
- **Risk**: Providers with more availability rank higher, creating rich-get-richer
- **Mitigation**: Cap availability boost at 10% of score, rotate "low availability" providers into top slots occasionally

**2. Price Discrimination**
- **Risk**: Dynamic pricing could exploit applicants' urgency
- **Mitigation**: Cap price increases at 30%, show "Why this price?" transparency, allow booking at base price with 7-day advance

**3. New Provider Disadvantage**
- **Risk**: No bookings = no data = no recommendations = no bookings (death spiral)
- **Mitigation**: "New Mentor" boost for first 30 days, featured rotation, manual curation

**4. Program Prestige Bias**
- **Risk**: SRNAs from "top" programs get more bookings unfairly
- **Mitigation**: Don't use program ranking in algorithm, highlight unique strengths, show diverse programs

**5. Rating Inflation**
- **Risk**: Only happy customers leave reviews (selection bias)
- **Mitigation**: Prompt all users for reviews, weight recent reviews more, show review distribution (not just average)

**6. Homophily Bias**
- **Risk**: Same-background matching excludes diverse perspectives
- **Mitigation**: Include "Different Perspective" recommendations, highlight cross-background success stories

### Transparency Commitments

**What Users Should Know:**
1. How recommendations are generated (target match, background, ratings)
2. Why prices vary (demand, provider experience, urgency)
3. What data we collect and how it's used
4. How reviews are verified (real bookings only)

**What We Monitor:**
- Booking distribution across providers (Gini coefficient <0.6)
- Average booking rate by provider demographic
- Review sentiment correlation with provider background
- Price elasticity by applicant demographic

---

## Implementation Roadmap Summary

### Immediate (Weeks 1-3) - MVP Launch
✅ Target program matching
✅ Composite ranking algorithm
✅ Smart default filters
✅ Provider quality signals
✅ Trust badges
✅ Event tracking infrastructure

**Outcome:** Functional marketplace with intelligent matching

---

### Short-term (Months 1-4) - Engagement
✅ Discovery nudges
✅ Urgency nudges
✅ Search query learning
✅ Basic sentiment analysis
✅ Collaborative filtering (simple)

**Outcome:** Active, growing marketplace with retention loops

---

### Medium-term (Months 6-12) - Intelligence
✅ Hybrid recommendations (content + CF)
✅ Provider coaching insights
✅ LLM conversational search
✅ Personalization engine (basic)

**Outcome:** Smart marketplace that improves with use

---

### Long-term (Months 12-24) - Optimization
✅ Predictive match scoring (ML)
✅ Advanced personalization
✅ Dynamic pricing (optional)
✅ Automated quality systems
✅ Job posting matching (reverse flow)

**Outcome:** Mature, self-optimizing marketplace

---

## Key Takeaways

### For Sachi (Decision-Maker)

1. **Start Simple**: Phase 1 rule-based matching delivers 80% of value with 20% of effort
2. **Leverage Existing Data**: We already have GOLD (target programs, academic profiles, stage) - use it!
3. **Data Collection is Critical**: Track everything from Day 1, even if not using yet
4. **ML Needs Volume**: Don't invest in advanced ML until 500+ bookings
5. **Trust > Sophistication**: Users care more about trust signals than fancy algorithms

### For Dev Team (Implementation)

1. **Build for Observability**: Log every interaction, score, recommendation reason
2. **A/B Test Everything**: Don't assume, validate with data
3. **Start with Rules, Graduate to ML**: Easier to iterate, easier to explain
4. **Bias is Real**: Monitor for unfair patterns, course-correct proactively
5. **Keep It Simple**: Complexity is the enemy of shipping

### For Product Team (Features)

1. **Target Program Match = Killer Feature**: This alone is worth building for
2. **Nudges Drive Discovery**: Most users won't find marketplace without prompts
3. **Provider Success = Platform Success**: Coach providers to quality
4. **Cold Start is Solvable**: Leverage main platform data from day 1
5. **Personalization Compounds**: Small improvements in matching = big LTV gains

---

## References & Research Sources

### Two-Sided Marketplace Matching
- [Optimal Matchmaking Strategy in Two-Sided Marketplaces](https://pubsonline.informs.org/doi/abs/10.1287/mnsc.2022.4444) - Management Science, 2022
- [Sharetribe: What is matching in marketplaces?](https://www.sharetribe.com/marketplace-glossary/matching/)
- [Mind the Product: Optimal Matching for Marketplace Startups](https://www.mindtheproduct.com/optimal-matching-for-marketplace-startups-and-the-role-of-bias/)

### Collaborative Filtering & Recommendations
- [Collaborative Filtering Guide](https://www.datacamp.com/tutorial/collaborative-filtering) - DataCamp
- [Google Developers: Collaborative Filtering Basics](https://developers.google.com/machine-learning/recommendation/collaborative/basics)
- [Developing Store-Based Collaborative Filtering](https://www.mdpi.com/2076-3417/13/20/11231) - MDPI, 2023

### Dynamic Pricing & Quality Signals
- [Lyft Engineering: Dynamic Pricing to Sustain Marketplace Balance](https://eng.lyft.com/dynamic-pricing-to-sustain-marketplace-balance-1d23a8d1be90)
- [AI-Powered Dynamic Pricing in E-Commerce 2024](https://www.rapidinnovation.io/post/ai-powered-dynamic-pricing-in-e-commerce)
- [Dynamic Pricing Algorithms: Top 3 Models](https://research.aimultiple.com/dynamic-pricing-algorithm/)

### Fraud Detection & Sentiment Analysis
- [Fake Review Detection Using Sentiment Analysis](https://www.sciencedirect.com/science/article/abs/pii/S0148296323005027) - ScienceDirect
- [Detection of Fraudulent Sellers in Online Marketplaces](https://arxiv.org/pdf/1805.00464)
- [Natural Language Processing for Online Reviews](https://pmc.ncbi.nlm.nih.gov/articles/PMC11323031/)

### Semantic Search & Personalization
- [Microsoft Learn: Semantic Ranking in Azure AI Search](https://learn.microsoft.com/en-us/azure/search/semantic-search-overview)
- [eBay: Personalized Ranking in eCommerce Search](https://www.researchgate.net/publication/332799449_Personalized_Ranking_in_eCommerce_Search)
- [Algolia: Guide to Semantic Search Engines](https://www.algolia.com/blog/ai/the-definitive-guide-to-semantic-search-engines)

### Cold Start Problem Solutions
- [Wikipedia: Cold Start in Recommender Systems](https://en.wikipedia.org/wiki/Cold_start_(recommender_systems))
- [6 Strategies to Solve Cold Start Problem](https://baotramduong.medium.com/recommender-system-the-cold-start-problem-strategies-to-address-it-bddb177e723c) - Medium
- [Bootstrapping Recommender Systems](https://www.researchgate.net/publication/221615658_On_bootstrapping_recommender_systems)

### Behavioral Nudges & Engagement
- [Nudge Marketing: Key Principles & Examples](https://popupsmart.com/blog/nudge-marketing)
- [29 Best Examples of Nudge Marketing in eCommerce](https://www.convertcart.com/blog/nudge-marketing-examples)
- [CleverTap: Intelligent Personalized Nudges](https://clevertap.com/blog/intelligent-personalized-nudges-with-reminders-to-boost-customer-engagement/)

---

**Document Version:** 1.0
**Last Updated:** December 7, 2025
**Author:** AI Product Strategist (Claude)
**Status:** Complete - Ready for Review
