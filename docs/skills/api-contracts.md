# API Contracts

Expected API request/response shapes for dev team integration.

---

## Overview

The React frontend expects these API endpoints. During development, we use mock data. The dev team will wire up real endpoints in January 2025.

**Base URL:** `https://thecrnaclub.com/wp-json`

**Authentication:** JWT token in Authorization header
```
Authorization: Bearer <jwt_token>
```

---

## Authentication

### Login

```
POST /jwt-auth/v1/token

Request:
{
  "username": "user@email.com",
  "password": "password123"
}

Response (200):
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user_email": "user@email.com",
  "user_nicename": "sarah-johnson",
  "user_display_name": "Sarah Johnson"
}

Response (403):
{
  "code": "invalid_credentials",
  "message": "Invalid username or password"
}
```

### Validate Token

```
POST /jwt-auth/v1/token/validate

Headers:
Authorization: Bearer <token>

Response (200):
{
  "code": "jwt_auth_valid_token",
  "data": { "status": 200 }
}
```

---

## User Profile

### Get Current User

```
GET /crna/v1/user/me

Response (200):
{
  "id": "user_001",
  "email": "sarah@email.com",
  "name": "Sarah Johnson",
  "preferredName": "Sarah",
  "avatarUrl": "https://...",
  
  "subscriptionTier": "core",
  "subscriptionStatus": "active",
  "trialEndsAt": null,
  
  "currentStage": "6_to_12_months",
  "programStatus": "some_targets",
  
  "points": 847,
  "level": 3,
  "levelName": "Ambitious Achiever",
  
  "tags": [
    "03. [Access] - Premium Member 1 - Give Access",
    "02. [Status] - Premium Member 1 - Active"
  ],
  
  "onboardingCompletedAt": "2024-06-03T00:00:00Z",
  "createdAt": "2024-06-01T00:00:00Z"
}
```

### Update User Profile

```
PUT /crna/v1/user/me

Request:
{
  "preferredName": "Sarah",
  "currentStage": "applying_now",
  "programStatus": "actively_applying"
}

Response (200):
{
  "success": true,
  "user": { ... updated user object }
}
```

---

## Academic Profile

### Get Academic Data

```
GET /crna/v1/user/academic

Response (200):
{
  "userId": "user_001",
  "overallGpa": 3.45,
  "scienceGpa": 3.23,
  "scienceGpaWithForgiveness": 3.35,
  "last60Gpa": 3.52,
  "gpaCalculated": true,
  
  "greQuantitative": 156,
  "greVerbal": 152,
  "greAnalyticalWriting": 4.0,
  "greCombined": 308,
  
  "completedPrerequisites": [
    {
      "courseType": "anatomy",
      "year": 2015,
      "grade": "B",
      "schoolName": "Arizona State University"
    }
  ]
}
```

### Update Academic Data

```
PUT /crna/v1/user/academic

Request:
{
  "greQuantitative": 160,
  "greVerbal": 155,
  "greAnalyticalWriting": 4.5
}

Response (200):
{
  "success": true,
  "academic": { ... updated object }
}
```

---

## Clinical Profile

### Get Clinical Data

```
GET /crna/v1/user/clinical

Response (200):
{
  "userId": "user_001",
  "primaryIcuType": "micu",
  "additionalIcuTypes": ["cvicu"],
  "totalYearsExperience": 3.5,
  
  "certifications": [
    {
      "type": "ccrn",
      "status": "passed",
      "earnedDate": "2023-05-15"
    }
  ],
  
  "clinicalSkills": {
    "populations": ["cardiac", "renal"],
    "medications": ["norepinephrine", "vasopressin"],
    "devices": ["ecmo", "mechanical_ventilation"],
    "procedures": ["intubation", "extubation"]
  }
}
```

---

## Programs

### Get All Schools

```
GET /crna/v1/programs

Query params:
- state (string): Filter by state
- gre (string): "required", "not_required", "waived"
- type (string): "integrated", "front_loaded"
- minGpa (number): Minimum GPA requirement
- search (string): Text search
- page (number): Pagination
- perPage (number): Items per page (default 20)

Response (200):
{
  "programs": [
    {
      "id": "school_001",
      "name": "Doctor of Nurse Anesthesia Practice Program",
      "schoolName": "Georgetown University",
      "location": { "city": "Washington", "state": "DC" },
      "imageUrl": "https://...",
      "type": "integrated",
      "degree": "dnap",
      "minimumGpa": 3.0,
      "greRequired": true,
      "greWaived": true,
      "applicationDeadline": "2025-10-15",
      "estimatedTuitionInState": 126025
    }
  ],
  "total": 140,
  "page": 1,
  "totalPages": 7
}
```

### Get Single School

```
GET /crna/v1/programs/:id

Response (200):
{
  "id": "school_001",
  "name": "Doctor of Nurse Anesthesia Practice Program",
  "schoolName": "Georgetown University",
  ... full school object with all fields
}
```

### Get User's Saved Programs

```
GET /crna/v1/user/programs

Response (200):
{
  "saved": [
    {
      "id": "saved_001",
      "programId": "school_001",
      "program": { ... program object },
      "isTarget": false,
      "savedAt": "2024-08-20T00:00:00Z"
    }
  ],
  "targets": [
    {
      "id": "saved_002",
      "programId": "school_002",
      "program": { ... program object },
      "isTarget": true,
      "savedAt": "2024-08-15T00:00:00Z",
      "targetData": {
        "status": "submitted",
        "submittedDate": "2024-10-14",
        "notes": "...",
        "checklist": [...],
        "documents": [...]
      }
    }
  ]
}
```

### Save a Program

```
POST /crna/v1/user/programs

Request:
{
  "programId": "school_001"
}

Response (201):
{
  "success": true,
  "savedProgram": { ... saved program object },
  "pointsEarned": 5
}
```

### Convert to Target

```
PUT /crna/v1/user/programs/:id/target

Request:
{
  "isTarget": true
}

Response (200):
{
  "success": true,
  "savedProgram": { ... with targetData initialized },
  "pointsEarned": 3
}
```

### Update Target Program

```
PUT /crna/v1/user/programs/:id

Request:
{
  "status": "submitted",
  "notes": "Updated notes...",
  "checklist": [
    { "id": "c1", "label": "...", "completed": true }
  ]
}

Response (200):
{
  "success": true,
  "savedProgram": { ... updated }
}
```

### Remove Saved Program

```
DELETE /crna/v1/user/programs/:id

Response (200):
{
  "success": true
}
```

---

## Trackers

### Get Clinical Entries

```
GET /crna/v1/trackers/clinical

Query params:
- startDate (string): ISO date
- endDate (string): ISO date
- page (number)
- perPage (number)

Response (200):
{
  "entries": [
    {
      "id": "clinical_001",
      "date": "2024-08-21",
      "notes": "...",
      "patientPopulations": ["cardiac", "renal"],
      "medications": ["norepinephrine"],
      "devices": ["ecmo"],
      "procedures": ["cardioversion"]
    }
  ],
  "stats": {
    "totalEntries": 47,
    "topPopulation": "Cardiac",
    "topMedication": "Norepinephrine",
    "topDevice": "ECMO",
    "topProcedure": "Extubation"
  }
}
```

### Create Clinical Entry

```
POST /crna/v1/trackers/clinical

Request:
{
  "date": "2024-08-21",
  "notes": "Great day with complex patient...",
  "patientPopulations": ["cardiac"],
  "medications": ["norepinephrine", "vasopressin"],
  "devices": ["ecmo"],
  "procedures": ["cardioversion"]
}

Response (201):
{
  "success": true,
  "entry": { ... created entry },
  "pointsEarned": 2
}
```

### Get EQ Entries

```
GET /crna/v1/trackers/eq

Response (200):
{
  "entries": [
    {
      "id": "eq_001",
      "date": "2024-08-21",
      "title": "Difficult conversation",
      "reflection": "...",
      "categories": ["conflict_resolution", "team_communication"]
    }
  ],
  "stats": {
    "totalEntries": 12,
    "topSkill": "Stress Management"
  }
}
```

### Create EQ Entry

```
POST /crna/v1/trackers/eq

Request:
{
  "date": "2024-08-21",
  "title": "Handled stress well",
  "reflection": "...",
  "categories": ["stress_management"]
}

Response (201):
{
  "success": true,
  "entry": { ... },
  "pointsEarned": 2
}
```

### Get Shadow Days

```
GET /crna/v1/trackers/shadow

Response (200):
{
  "entries": [...],
  "stats": {
    "totalHours": 24,
    "casesObserved": 8,
    "skillsObserved": ["intubation", "extubation"]
  }
}
```

### Create Shadow Day

```
POST /crna/v1/trackers/shadow

Request:
{
  "date": "2024-08-21",
  "location": "Kaiser Permanente",
  "providerName": "Dr. Smith",
  "providerEmail": "smith@kaiser.com",
  "hoursLogged": 8,
  "casesObserved": 3,
  "notes": "...",
  "addToTotalHours": true,
  "skillsObserved": ["intubation"]
}

Response (201):
{
  "success": true,
  "entry": { ... },
  "pointsEarned": 2
}
```

### Get Tracked Events

```
GET /crna/v1/trackers/events

Response (200):
{
  "entries": [
    {
      "id": "event_001",
      "title": "AANA Annual Congress",
      "date": "2024-08-22",
      "category": "aana_national_meeting",
      "location": "Nashville, TN",
      "notes": "..."
    }
  ]
}
```

---

## Prerequisites

### Get All Courses

```
GET /crna/v1/prerequisites

Query params:
- subject (string): anatomy, chemistry, etc.
- level (string): undergraduate, graduate
- search (string)
- page (number)

Response (200):
{
  "courses": [
    {
      "id": "course_001",
      "schoolName": "Portage Learning",
      "courseName": "CHEM103: General Chemistry I w/ Lab",
      "subject": "general_chemistry",
      "level": "undergraduate",
      "format": "online_async",
      "credits": 4,
      "costRange": "$500-$1000",
      "averageRecommend": 4.2,
      "averageEase": 3.8,
      "reviewCount": 24
    }
  ],
  "total": 89
}
```

### Get Course Details

```
GET /crna/v1/prerequisites/:id

Response (200):
{
  "course": { ... full course object },
  "reviews": [
    {
      "id": "review_001",
      "userId": "user_xxx",
      "userNickname": "FutureCRNA",
      "recommend": 4,
      "ease": 5,
      "reviewText": "...",
      "tags": ["self_paced", "exams_quizzes"],
      "createdAt": "2024-10-16"
    }
  ]
}
```

### Submit Course Review

```
POST /crna/v1/prerequisites/:id/reviews

Request:
{
  "recommend": 4,
  "ease": 5,
  "reviewText": "Great course...",
  "tags": ["self_paced", "pre_recorded_lectures"]
}

Response (201):
{
  "success": true,
  "review": { ... },
  "pointsEarned": 10
}
```

---

## Gamification

### Get User Gamification

```
GET /crna/v1/user/gamification

Response (200):
{
  "points": 847,
  "level": 3,
  "levelName": "Ambitious Achiever",
  "nextLevelAt": 1000,
  "pointsToNextLevel": 153,
  
  "badges": [
    {
      "id": "badge_1",
      "name": "Target Trailblazer",
      "description": "Converted 3+ Target Programs",
      "earned": true,
      "earnedAt": "2024-09-15"
    },
    {
      "id": "badge_2",
      "name": "Critical Care Crusher",
      "earned": false,
      "progress": 12,
      "requirement": 20
    }
  ]
}
```

### Get Leaderboard

```
GET /crna/v1/gamification/leaderboard

Query params:
- limit (number): default 10

Response (200):
{
  "leaderboard": [
    { "rank": 1, "nickname": "NurseAmbition", "points": 2450 },
    { "rank": 2, "nickname": "FutureCRNA", "points": 2180 }
  ],
  "currentUser": {
    "rank": 47,
    "points": 847
  }
}
```

---

## Community (BuddyBoss)

### Get Forums

```
GET /buddyboss/v1/forums

Response (200):
{
  "forums": [
    {
      "id": "forum_001",
      "title": "CRNA Programs",
      "description": "Discuss specific programs",
      "topicCount": 234,
      "postCount": 1847
    }
  ]
}
```

### Get Topics in Forum

```
GET /buddyboss/v1/forums/:forumId/topics

Response (200):
{
  "topics": [
    {
      "id": "topic_001",
      "title": "Georgetown interview tips?",
      "author": { "id": "user_xxx", "name": "...", "avatar": "..." },
      "replyCount": 12,
      "createdAt": "2024-11-20",
      "lastActivity": "2024-11-27"
    }
  ]
}
```

### Get Topic Detail

```
GET /buddyboss/v1/topics/:topicId

Response (200):
{
  "topic": { ... },
  "replies": [
    {
      "id": "reply_001",
      "content": "...",
      "author": { ... },
      "createdAt": "2024-11-21"
    }
  ]
}
```

### Create Topic

```
POST /buddyboss/v1/forums/:forumId/topics

Request:
{
  "title": "New topic title",
  "content": "Topic body..."
}

Response (201):
{
  "success": true,
  "topic": { ... },
  "pointsEarned": 2
}
```

### Create Reply

```
POST /buddyboss/v1/topics/:topicId/replies

Request:
{
  "content": "Reply content..."
}

Response (201):
{
  "success": true,
  "reply": { ... },
  "pointsEarned": 2
}
```

---

## Events

### Get Events

```
GET /crna/v1/events

Query params:
- category (string)
- startDate (string)
- endDate (string)

Response (200):
{
  "events": [
    {
      "id": "event_001",
      "title": "TXWes CRNA Online Information Session",
      "category": "program_info_session",
      "date": "2024-12-17",
      "time": "1:00 PM UTC",
      "location": "Online",
      "description": "...",
      "registrationUrl": "https://..."
    }
  ]
}
```

---

## Error Responses

All endpoints may return:

```
Response (401):
{
  "code": "unauthorized",
  "message": "Authentication required"
}

Response (403):
{
  "code": "forbidden",
  "message": "Insufficient permissions"
}

Response (404):
{
  "code": "not_found",
  "message": "Resource not found"
}

Response (422):
{
  "code": "validation_error",
  "message": "Validation failed",
  "errors": {
    "field_name": ["Error message"]
  }
}

Response (500):
{
  "code": "server_error",
  "message": "Internal server error"
}
```
