# ReadyScore System

The internal scoring system that measures user readiness for CRNA school applications.

---

## Overview

ReadyScore is a 0-100 score that helps users understand their application readiness. Users see the score and actionable drivers, but NOT the detailed category breakdown or weights.

**What users see:**
- Their ReadyScore number (e.g., "67")
- 3 actionable focus areas to improve
- Supportive, non-anxiety-inducing framing

**What users DON'T see:**
- Category weights
- Detailed scoring rubrics
- Point values for actions

---

## MVP Categories (6 Total)

| Category | Weight | What It Measures |
|----------|--------|------------------|
| **Academic** | 25% | GPA (overall, science, last 60) + prerequisites |
| **Clinical Experience** | 20% | ICU type, years, acuity, skills logged |
| **Shadowing** | 15% | Hours, unique CRNAs, diversity of settings |
| **Leadership & Research** | 15% | Professional development, projects, publications |
| **Engagement & Events** | 15% | AANA events, open houses, networking |
| **Certifications & Exams** | 10% | CCRN, GRE, CSC, CMC, etc. |

**Total: 100%**

---

## Category Scoring Logic

### 1. Academic (25%)

**Data sources:** `mockAcademicProfile`

**Scoring:**
```javascript
// GPA Component (60% of Academic score)
const gpaScore = calculateGpaScore(overallGpa, scienceGpa, last60Gpa);

function calculateGpaScore(overall, science, last60) {
  // Weight: Overall 30%, Science 40%, Last60 30%
  const weightedGpa = (overall * 0.3) + (science * 0.4) + (last60 * 0.3);

  if (weightedGpa >= 3.7) return 100;
  if (weightedGpa >= 3.5) return 85;
  if (weightedGpa >= 3.3) return 70;
  if (weightedGpa >= 3.0) return 55;
  return 40; // Below 3.0
}

// Prerequisites Component (40% of Academic score)
const prereqScore = (completedPrereqs / totalRequiredPrereqs) * 100;
// Bonus: No prereqs with grade < B adds +10

// Final Academic Score
const academicScore = (gpaScore * 0.6) + (prereqScore * 0.4);
```

### 2. Clinical Experience (20%)

**Data sources:** `mockClinicalEntries`, `clinicalCategories`

**Scoring:**
```javascript
function calculateClinicalScore(user) {
  let score = 0;

  // ICU Years (40% of Clinical score)
  const yearsScore = Math.min(user.icuYears / 3, 1) * 100; // Max at 3 years

  // ICU Type/Acuity (30% of Clinical score)
  const acuityScore = getAcuityScore(user.currentIcuType);
  // CVICU/SICU/Trauma = 100, MICU = 85, Step-down = 60, etc.

  // Skills Diversity (30% of Clinical score)
  const skillsLogged = countUniqueSkills(user.clinicalEntries);
  const skillsScore = Math.min(skillsLogged / 50, 1) * 100; // Max at 50 unique

  return (yearsScore * 0.4) + (acuityScore * 0.3) + (skillsScore * 0.3);
}
```

### 3. Shadowing (15%)

**Data sources:** `mockShadowDays`

**Scoring:**
```javascript
function calculateShadowScore(user) {
  // Hours (50% of Shadow score)
  const hoursScore = Math.min(user.shadowHours / 40, 1) * 100; // Max at 40 hrs

  // Unique CRNAs (30% of Shadow score)
  const crnaScore = Math.min(user.uniqueCrnas / 5, 1) * 100; // Max at 5 CRNAs

  // Setting Diversity (20% of Shadow score)
  const settingsScore = Math.min(user.uniqueSettings / 3, 1) * 100; // Max at 3 settings

  return (hoursScore * 0.5) + (crnaScore * 0.3) + (settingsScore * 0.2);
}
```

### 4. Leadership & Research (15%)

**Data sources:** Needs new `mockLeadership` structure

**Scoring:**
```javascript
function calculateLeadershipScore(user) {
  let score = 0;

  // Leadership Tier
  const leadershipTiers = {
    'none': 0,
    'committee_member': 40,
    'preceptor': 60,
    'charge_nurse': 70,
    'project_lead': 85,
    'council_member': 100
  };

  // Research Tier
  const researchTiers = {
    'none': 0,
    'ebp_project': 40,
    'poster_presentation': 60,
    'published_article': 85,
    'clinical_research_team': 100
  };

  const leadershipScore = leadershipTiers[user.leadershipLevel] || 0;
  const researchScore = researchTiers[user.researchLevel] || 0;

  return Math.max(leadershipScore, researchScore); // Take higher of the two
}
```

### 5. Engagement & Events (15%)

**Data sources:** `mockTrackedEvents`

**Scoring:**
```javascript
function calculateEngagementScore(user) {
  let score = 0;

  // Event attendance (weighted by type)
  const eventWeights = {
    'aana_national': 30,
    'aana_state': 20,
    'school_open_house': 15,
    'info_session': 10,
    'workshop': 10,
    'other': 5
  };

  user.eventsAttended.forEach(event => {
    score += eventWeights[event.type] || 5;
  });

  return Math.min(score, 100); // Cap at 100
}
```

### 6. Certifications & Exams (10%)

**Data sources:** `mockClinicalProfile.certifications`

**Scoring:**
```javascript
function calculateCertScore(user) {
  let score = 0;

  // CCRN is critical (50 points)
  if (user.hasCCRN) score += 50;

  // Other certs (10 points each, max 30)
  const otherCerts = ['CSC', 'CMC', 'TNCC', 'PALS', 'NIHSS'];
  const otherCertCount = otherCerts.filter(c => user.certifications.includes(c)).length;
  score += Math.min(otherCertCount * 10, 30);

  // GRE (20 points if taken)
  if (user.greTaken) score += 20;

  return Math.min(score, 100);
}
```

---

## Final ReadyScore Calculation

```javascript
function calculateReadyScore(user) {
  const academic = calculateAcademicScore(user) * 0.25;
  const clinical = calculateClinicalScore(user) * 0.20;
  const shadow = calculateShadowScore(user) * 0.15;
  const leadership = calculateLeadershipScore(user) * 0.15;
  const engagement = calculateEngagementScore(user) * 0.15;
  const certs = calculateCertScore(user) * 0.10;

  return Math.round(academic + clinical + shadow + leadership + engagement + certs);
}
```

---

## Actionable Drivers (MVP)

Users see up to 3 focus areas. Simple if-then rules, no point estimates shown.

```javascript
function getDrivers(user) {
  const drivers = [];

  // Priority order based on impact
  if (!user.hasCCRN) {
    drivers.push({
      action: "Get CCRN certified",
      context: "Most programs require this certification"
    });
  }

  if (user.shadowHours < 40) {
    drivers.push({
      action: "Log more shadow experiences",
      context: `You have ${user.shadowHours} hours — aim for 40+`
    });
  }

  if (user.incompletePrereqs.length > 0) {
    drivers.push({
      action: "Complete missing prerequisites",
      context: `${user.incompletePrereqs.length} courses remaining`
    });
  }

  if (user.icuYears < 2) {
    drivers.push({
      action: "Continue building ICU experience",
      context: "Most programs prefer 2+ years"
    });
  }

  if (user.eventsAttended.length === 0) {
    drivers.push({
      action: "Attend a CRNA networking event",
      context: "Great way to learn about programs"
    });
  }

  if (user.leadershipLevel === 'none' && user.researchLevel === 'none') {
    drivers.push({
      action: "Get involved in a leadership role or project",
      context: "Shows initiative beyond clinical work"
    });
  }

  // Return top 3 only
  return drivers.slice(0, 3);
}
```

---

## UI Display

```
┌─────────────────────────────────────┐
│  Your ReadyScore: 67                │
│  [====================        ]     │
│                                     │
│  Focus areas to strengthen:         │
│                                     │
│  → Get CCRN certified               │
│    Most programs require this       │
│                                     │
│  → Log more shadow experiences      │
│    You have 12 hours — aim for 40+  │
│                                     │
│  → Complete missing prerequisites   │
│    2 courses remaining              │
│                                     │
│  [See all recommendations]          │
└─────────────────────────────────────┘
```

**Design principles:**
- Supportive language, not deficit framing
- Context explains WHY, not point values
- 3 visible drivers, more available via expansion
- No anxiety-inducing countdowns or pressure

---

## What NOT to Show

- Category weights or breakdowns
- Point estimates ("+5 points")
- Comparisons to other users
- "Competitive" claims (we don't have applicant pool data)
- Low-volume social proof ("Only 3 people...")

---

## Deferred to V2

These categories/features were considered but deferred for MVP simplicity:

| Feature | Why Deferred |
|---------|--------------|
| **Academic GRIT** (retakes, upward trend) | Complex to track transcript trends |
| **Soft Skills/EQ** | Subjective, hard to score fairly |
| **Momentum Score** | Already handled by gamification system |
| **Comfortability Tracking** | Good idea but adds UX complexity |
| **Dynamic driver prioritization** | MVP uses static if-then rules |
| **Program-specific ReadyScore** | ("Your score for Georgetown: 72") |

---

## Data Model Requirements

### Existing Data (Ready to Use)
- `mockAcademicProfile`: GPAs, prerequisites
- `mockClinicalEntries`: Clinical skills logged
- `mockShadowDays`: Shadow hours, CRNAs
- `mockTrackedEvents`: Events attended
- `mockClinicalProfile.certifications`: Certs held

### New Data Needed
```javascript
// Add to user profile
{
  leadershipLevel: 'none' | 'committee_member' | 'preceptor' | 'charge_nurse' | 'project_lead' | 'council_member',
  researchLevel: 'none' | 'ebp_project' | 'poster_presentation' | 'published_article' | 'clinical_research_team',
  greTaken: boolean,
  greScores: { verbal: number, quant: number, writing: number } | null
}
```

---

## Implementation Files

| File | Purpose |
|------|---------|
| `src/lib/readinessCalculator.js` | Core scoring logic + driver generation |
| `src/components/features/stats/ReadyScoreCard.jsx` | UI component |
| `src/data/mockUser.js` | Add leadership/research fields |

---

## Future Considerations

1. **Recalibration**: As we get more users, may need to adjust weights based on actual acceptance outcomes
2. **Program-specific scores**: Different programs value different things
3. **AI-powered drivers**: More sophisticated prioritization based on user's specific targets
4. **Score history**: Track score changes over time to show progress
