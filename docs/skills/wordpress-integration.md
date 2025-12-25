# WordPress Integration

The CRNA Club uses WordPress as a headless CMS. The React frontend fetches data from WordPress via REST API.

---

## Architecture Overview

```
┌─────────────────────┐     ┌─────────────────────┐
│   React Frontend    │────▶│  WordPress Backend  │
│   (Vercel)          │◀────│  (Headless CMS)     │
└─────────────────────┘     └─────────────────────┘
         │                           │
         │                           ├── WooCommerce (Billing)
         │                           ├── LearnDash (Courses)
         │                           ├── BuddyBoss (Community)
         │                           ├── JetEngine (CPTs)
         │                           ├── Groundhogg (Email/CRM)
         │                           └── Gamplify Game (Points)
         │
         └──────────────────────────────────────────
                              │
                    ┌─────────────────────┐
                    │   Supabase (New)    │
                    │   - Marketplace     │
                    │   - New user data   │
                    │   - Event logging   │
                    └─────────────────────┘
```

---

## WordPress Custom Post Types (JetEngine)

### CRNA Programs (`crna_program`)
~140 schools in database

**Key Fields:**
- `program_name` - Full program name
- `school_name` - University/institution name
- `city`, `state` - Location
- `program_type` - "Integrated" or "Front-Loaded"
- `degree_type` - "DNAP", "DNP", "MSNA"
- `program_length` - Months
- `program_start` - Start month
- `class_size` - Number of students
- `clinical_sites` - Number of clinical sites
- `tuition_in_state`, `tuition_out_of_state` - Costs
- `minimum_gpa` - Required GPA
- `gpa_type` - What GPA they look at
- `minimum_experience` - Years of ICU
- `gre_required`, `gre_waived`, `gre_expiration` - GRE requirements
- `ccrn_required` - Boolean
- `shadowing_required`, `shadowing_hours` - Shadowing
- `prerequisites_required` - Array of course types
- `prerequisite_notes` - Text
- `application_deadline`, `application_opens` - Dates
- `contact_name`, `contact_email`, `contact_phone`, `instagram` - Contact
- `website_url` - External link
- `essay_prompt` - Text
- `reference_count`, `reference_description` - References
- `accepts_nicu`, `accepts_picu`, `accepts_er`, `accepts_other_cc` - Experience types
- `nce_pass_rate`, `attrition_rate` - Stats
- `featured_image` - Image URL

### Prerequisites Library (`prerequisite_course`)
User-submitted courses

**Key Fields:**
- `course_title` - Course name
- `course_prefix`, `course_number` - e.g., "BIOL 201"
- `school_name` - Institution
- `school_type` - "community_college", "university", "online"
- `state` - Location
- `subject_area` - "anatomy", "chemistry", etc.
- `education_level` - "undergraduate", "graduate"
- `credits` - Credit hours
- `has_lab` - Boolean
- `format` - "in_person", "online_sync", "online_async", "hybrid"
- `terms_offered` - Array
- `enroll_anytime` - Boolean
- `course_length_weeks` - Number
- `cost_range` - Price bracket
- `programs_used_for` - Relation to programs
- `tags` - Custom tags

### Course Reviews (`course_review`)
**Key Fields:**
- `course_id` - Relation to course
- `user_id` - Author
- `recommend_score` - 1-5
- `ease_score` - 1-5
- `review_text` - Content
- `weekly_commitment` - Time bracket
- `tags` - Selected attributes
- `created_at` - Date

### Events (`gamplify_event`)
Platform and external events

**Key Fields:**
- `title` - Event name
- `description` - Details
- `category` - "aana_state", "aana_national", "crna_club", "program_event"
- `subcategory` - State name or other
- `event_date`, `end_date` - Timing
- `location` - Venue/Online
- `is_virtual` - Boolean
- `registration_url` - External link
- `zoom_link` - For CRNA Club events
- `featured_image` - Image

### Digital Downloads (`digital_download`)
**Key Fields:**
- `title` - Download name
- `description` - What it is
- `file_url` - Actual file
- `included_in_plan_apply` - Boolean
- `included_in_interviewing` - Boolean
- `access_tags` - Required tags

---

## LearnDash Integration

### Courses/Modules
12 main modules containing lessons:

1. Certifications + GRE
2. Critical Care Experience + Leadership
3. CRNA Profession Overview + Finances
4. CRNA Programs
5. General Interview Prep
6. GPA + Prerequisites
7. Networking + Anesthesia Events
8. Pathophysiology
9. Personal Statement
10. Pharmacology
11. Resume/CV
12. Shadowing + Letters of Recommendation

### API Endpoints
```
GET /wp-json/ldlms/v2/courses
GET /wp-json/ldlms/v2/courses/{id}
GET /wp-json/ldlms/v2/courses/{id}/lessons
GET /wp-json/ldlms/v2/courses/{id}/progress
POST /wp-json/ldlms/v2/courses/{id}/lessons/{lessonId}/complete
```

### User Progress
- LearnDash tracks completion per user
- Progress stored in WordPress user meta
- Completion triggers points via Gamplify Game

---

## BuddyBoss Integration

### Forums (bbPress)
```
GET /wp-json/buddyboss/v1/forums
GET /wp-json/buddyboss/v1/forums/{id}/topics
GET /wp-json/buddyboss/v1/topics/{id}
GET /wp-json/buddyboss/v1/topics/{id}/replies
POST /wp-json/buddyboss/v1/topics
POST /wp-json/buddyboss/v1/replies
```

### Groups
```
GET /wp-json/buddyboss/v1/groups
GET /wp-json/buddyboss/v1/groups/{id}
GET /wp-json/buddyboss/v1/groups/{id}/members
POST /wp-json/buddyboss/v1/groups/{id}/join
GET /wp-json/buddyboss/v1/groups/{id}/activity
```

### Messages
```
GET /wp-json/buddyboss/v1/messages
GET /wp-json/buddyboss/v1/messages/{threadId}
POST /wp-json/buddyboss/v1/messages
```

### Activity Feed
```
GET /wp-json/buddyboss/v1/activity
POST /wp-json/buddyboss/v1/activity
```

### Connections/Friends
```
GET /wp-json/buddyboss/v1/friends
POST /wp-json/buddyboss/v1/friends
```

---

## WooCommerce Integration

### Subscriptions
```
GET /wp-json/wc/v3/subscriptions
GET /wp-json/wc/v3/subscriptions/{id}
```

### Orders
```
GET /wp-json/wc/v3/orders
GET /wp-json/wc/v3/orders/{id}
```

### Products
```
GET /wp-json/wc/v3/products
GET /wp-json/wc/v3/products/{id}
```

### Checkout Flow
User clicks upgrade → Redirect to WooCommerce checkout page → Returns to React app after purchase.

For membership: `https://thecrnaclub.com/checkout/?add-to-cart={membership_product_id}`

---

## Groundhogg Integration

### Tags
```
GET /wp-json/gh/v4/contacts/{id}/tags
POST /wp-json/gh/v4/contacts/{id}/tags
DELETE /wp-json/gh/v4/contacts/{id}/tags/{tagId}
```

### Contact Info
```
GET /wp-json/gh/v4/contacts/{id}
PUT /wp-json/gh/v4/contacts/{id}
```

---

## JetEngine/User Meta

### Key User Meta Fields
```
// Academic
science_gpa
overall_gpa
science_gpa_forgiveness
last_60_gpa
gre_quantitative
gre_verbal
gre_writing
gre_combined

// Clinical
primary_icu_type
additional_icu_types
years_experience
certifications (serialized array)

// Application
current_stage
program_status
interview_invites
```

### Retrieving User Meta
```
GET /wp-json/wp/v2/users/me
  → Returns user object with meta fields

// Or custom endpoint
GET /wp-json/crna/v1/user/profile
  → Returns structured user profile data
```

### Updating User Meta
```
PUT /wp-json/wp/v2/users/me
  body: { meta: { science_gpa: 3.5 } }

// Or custom endpoint
PUT /wp-json/crna/v1/user/profile
  body: { scienceGpa: 3.5, primaryIcuType: 'micu' }
```

---

## Saved Programs (User-Specific)

### JetEngine Relations
User ↔ Program (many-to-many with meta)

```
GET /wp-json/crna/v1/user/saved-programs
GET /wp-json/crna/v1/user/target-programs
POST /wp-json/crna/v1/user/programs/{programId}/save
POST /wp-json/crna/v1/user/programs/{programId}/target
DELETE /wp-json/crna/v1/user/programs/{programId}
PUT /wp-json/crna/v1/user/programs/{programId}
  body: { status: 'submitted', notes: '...', checklist: [...] }
```

---

## Tracker Entries (JetEngine CCT)

### Clinical Tracker
```
GET /wp-json/crna/v1/trackers/clinical
POST /wp-json/crna/v1/trackers/clinical
PUT /wp-json/crna/v1/trackers/clinical/{id}
DELETE /wp-json/crna/v1/trackers/clinical/{id}
```

### EQ Tracker
```
GET /wp-json/crna/v1/trackers/eq
POST /wp-json/crna/v1/trackers/eq
...
```

### Shadow Days
```
GET /wp-json/crna/v1/trackers/shadow
POST /wp-json/crna/v1/trackers/shadow
...
```

### Events
```
GET /wp-json/crna/v1/trackers/events
POST /wp-json/crna/v1/trackers/events
...
```

---

## Authentication

### JWT Authentication
Using JWT for API auth:

```javascript
// Login
POST /wp-json/jwt-auth/v1/token
body: { username, password }
→ { token: 'xxx.yyy.zzz' }

// Use token in headers
Authorization: Bearer xxx.yyy.zzz
```

### Hybrid Auth with Supabase
1. User logs into Supabase Auth (React frontend)
2. Supabase token exchanged/synced with WordPress JWT
3. Both systems recognize the user

Dev team will implement the sync mechanism.

---

## CORS Configuration

WordPress must allow requests from React app domain:

```php
// In WordPress
add_action('init', function() {
  header('Access-Control-Allow-Origin: https://app.thecrnaclub.com');
  header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
  header('Access-Control-Allow-Headers: Authorization, Content-Type');
});
```

---

## Rate Limiting

Be mindful of API rate limits:
- Cache responses where possible
- Batch requests when feasible
- Use pagination for large datasets

```javascript
// Example: Fetch schools with pagination
GET /wp-json/crna/v1/programs?page=1&per_page=20
→ { data: [...], total: 140, pages: 7 }
```

---

## Error Handling

Standard WordPress REST API errors:

```javascript
// 401 Unauthorized
{ code: 'rest_not_logged_in', message: 'You are not logged in.' }

// 403 Forbidden
{ code: 'rest_forbidden', message: 'You do not have permission.' }

// 404 Not Found
{ code: 'rest_no_route', message: 'No route was found matching the URL.' }

// 500 Server Error
{ code: 'internal_error', message: 'Something went wrong.' }
```

Handle gracefully in React:
```javascript
try {
  const data = await api.get('/programs');
} catch (error) {
  if (error.status === 401) {
    // Redirect to login
  } else if (error.status === 403) {
    // Show upgrade prompt
  } else {
    // Show error message
  }
}
```
