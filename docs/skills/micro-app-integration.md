# Micro-App Integration

How external micro-apps integrate with The CRNA Club platform.

---

## Overview

Three micro-apps exist as separate Vercel deployments. They provide specialized functionality and feed data back to the main platform.

---

## Micro-Apps

### 1. Transcript Analyzer

**URL:** https://transcript-analyzer-alpha.vercel.app/

**Purpose:** Automatically calculate various GPA types from course data.

**Features:**
- Input per-course data (title, prefix, credits, grade, institution, term)
- Calculate Overall GPA
- Calculate Science GPA
- Calculate Science GPA with grade forgiveness
- Calculate Last 60 credits GPA
- Identify which courses count as "science"

**Data Flow:**
```
User opens Transcript Analyzer
    ↓
User inputs course data manually
(or uploads transcript image for OCR - future)
    ↓
App calculates GPAs
    ↓
User clicks "Save to Profile"
    ↓
App sends data to WordPress API
    ↓
POST /crna/v1/user/academic
{
  "overall_gpa": 3.45,
  "science_gpa": 3.23,
  "science_gpa_forgiveness": 3.35,
  "last_60_gpa": 3.52,
  "gpa_calculated": true,
  "courses": [
    {
      "title": "Human Anatomy",
      "prefix": "BIO",
      "credits": 4,
      "grade": "A",
      "institution": "ASU",
      "term": "Fall 2019",
      "is_science": true
    }
  ]
}
    ↓
User's profile updated
    ↓
+10 points for first calculation
```

**Integration Points:**
- Linked from My Stats page
- Linked from GPA Calculator quick link
- Results populate GPA fields in My Stats

---

### 2. Mock Interview Lab

**URL:** https://mock-interview-lab.vercel.app/

**Purpose:** Practice CRNA-specific interview questions with AI feedback.

**Features:**
- Curated question bank of CRNA interview questions
- Typed or spoken answer input
- AI analysis of answers
- Feedback on clinical reasoning, communication, content

**Question Categories:**
- Clinical scenarios ("A patient's BP drops during induction...")
- Behavioral questions ("Tell me about a time you handled conflict...")
- Motivation questions ("Why do you want to be a CRNA?")
- Program-specific questions

**Data Logged:**
```javascript
{
  user_id: "user_001",
  session_id: "session_xyz",
  timestamp: "2024-11-28T10:00:00Z",
  questions: [
    {
      question_id: "q_001",
      question_text: "...",
      category: "clinical",
      user_response: "...",
      response_method: "typed", // or "spoken"
      ai_feedback: {
        clinical_reasoning: 4,
        communication: 5,
        content_accuracy: 4,
        overall: 4.3,
        suggestions: ["Consider mentioning...", "Good use of SBAR..."]
      },
      duration_seconds: 180
    }
  ],
  overall_session_score: 4.2
}
```

**Integration Points:**
- Linked from Learning Library (Interview Prep module)
- Linked from Dashboard quick links
- Session history viewable (future)
- +5 points per completed session

---

### 3. Timeline Generator

**URL:** https://crna-timeline-generator.vercel.app/

**Purpose:** Create personalized application timeline based on target programs.

**Input Data:**
- Desired start year (e.g., 2026)
- Desired start term (Fall, Spring, Summer)
- Selected target programs (fetched from user's saved programs)
- Current completion status of prerequisites, GRE, etc.

**Output:**
- Visual timeline showing when to:
  - Complete remaining prerequisites
  - Take/retake GRE
  - Complete CCRN
  - Schedule shadow days
  - Request letters of recommendation
  - Draft personal statement
  - Submit applications
- Exportable to calendar (iCal)
- Shareable link

**Data Flow:**
```
User opens Timeline Generator
    ↓
App fetches user's target programs
GET /crna/v1/user/programs?targets_only=true
    ↓
App fetches user's profile data
GET /crna/v1/user/me (GPA, certifications, etc.)
    ↓
User selects start year/term
    ↓
App generates personalized timeline
    ↓
User can download iCal or share link
    ↓
Optional: Save timeline to profile
POST /crna/v1/user/timeline
{
  "target_start": "Fall 2026",
  "milestones": [
    { "task": "Complete GRE", "date": "2025-06-01" },
    { "task": "Submit Georgetown", "date": "2025-10-01" }
  ]
}
```

**Integration Points:**
- Linked from Dashboard
- Linked from My Programs page
- Results can influence task recommendations

---

## Authentication Across Apps

Micro-apps need to know the user's identity to fetch/save data.

### Option 1: URL Token (Current)
```
https://transcript-analyzer-alpha.vercel.app/?token=<jwt_token>
```
- Main app generates short-lived token
- Micro-app validates token with WordPress
- Simple but token visible in URL

### Option 2: PostMessage (Iframe)
```javascript
// Main app embeds micro-app in iframe
<iframe src="https://transcript-analyzer-alpha.vercel.app/" />

// Pass auth via postMessage
iframe.contentWindow.postMessage({
  type: 'auth',
  token: jwt_token
}, 'https://transcript-analyzer-alpha.vercel.app');
```

### Option 3: Shared Cookie Domain (Future)
- If micro-apps moved to subdomains (analyzer.thecrnaclub.com)
- Can share auth cookies

**Current approach:** URL token for simplicity

---

## Linking to Micro-Apps

### From Dashboard Quick Links

```jsx
function QuickLinks() {
  const { token } = useAuth();
  
  const microApps = [
    {
      name: "GPA Calculator",
      description: "Calculate your GPAs from transcript",
      url: `https://transcript-analyzer-alpha.vercel.app/?token=${token}`,
      icon: Calculator,
    },
    {
      name: "Mock Interview",
      description: "Practice interview questions",
      url: `https://mock-interview-lab.vercel.app/?token=${token}`,
      icon: Mic,
    },
    {
      name: "Timeline Generator",
      description: "Plan your application timeline",
      url: `https://crna-timeline-generator.vercel.app/?token=${token}`,
      icon: Calendar,
    },
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {microApps.map(app => (
        <a
          key={app.name}
          href={app.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 bg-white rounded-lg border hover:border-yellow-400 transition"
        >
          <app.icon className="w-8 h-8 text-yellow-500 mb-2" />
          <h3 className="font-semibold">{app.name}</h3>
          <p className="text-sm text-gray-600">{app.description}</p>
        </a>
      ))}
    </div>
  );
}
```

### Contextual Links

```jsx
// On My Stats page, GPA section
function GpaSection({ gpa }) {
  const { token } = useAuth();
  
  return (
    <Card>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">Science GPA</h3>
          <p className="text-3xl font-bold">{gpa || "—"}</p>
        </div>
        <a
          href={`https://transcript-analyzer-alpha.vercel.app/?token=${token}`}
          target="_blank"
          className="text-sm text-blue-600 hover:underline"
        >
          {gpa ? "Recalculate" : "Calculate Now"} →
        </a>
      </div>
    </Card>
  );
}
```

---

## Receiving Data from Micro-Apps

When micro-apps send data back, it updates the main platform:

```javascript
// Webhook or API endpoint receives data
// Example: Transcript Analyzer saves GPAs

// WordPress handles the POST
// Updates user meta
// Triggers point award if applicable
// Returns success

// Main React app can listen for changes:
function useGpaRefresh() {
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin === 'https://transcript-analyzer-alpha.vercel.app') {
        if (event.data.type === 'gpa_updated') {
          // Refetch user profile
          refetchUser();
          // Show success toast
          toast.success('Your GPAs have been updated!');
        }
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);
}
```

---

## Analytics & Logging

Micro-app usage is tracked for:
1. **Points:** Award points for meaningful completions
2. **Analytics:** Understand how users engage with tools
3. **Recommendations:** Suggest next steps based on usage

```javascript
// Logged per micro-app session
{
  user_id: "user_001",
  app: "transcript_analyzer",
  action: "gpa_calculated",
  timestamp: "2024-11-28T10:00:00Z",
  data: {
    science_gpa: 3.23,
    course_count: 45
  }
}
```

---

## Future Micro-Apps

Potential additions:
1. **School Comparison Tool** - Side-by-side program comparison
2. **Prerequisite Planner** - Plan which courses to take when
3. **Interview Scheduler** - Manage interview dates/times
4. **Document Checklist** - Track application materials per school

These would follow the same integration pattern:
- Separate Vercel deployment
- JWT token auth
- API integration with WordPress
- Points for completion
- Data logged for analytics
