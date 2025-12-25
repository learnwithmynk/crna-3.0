# Content & Data Map

Where data lives and how it maps to the React frontend.

> **Note:** Most data is stored in Supabase. WordPress is retained only for BuddyBoss community features (forums, groups). See `supabase/migrations/` for table schemas.

---

## Data Location Summary

| Data | Location | Notes |
|------|----------|-------|
| Schools/Programs | Supabase | `schools`, `schools_internal`, `school_events` |
| User Profiles | Supabase | `user_profiles`, `user_academic_profiles`, `user_clinical_profiles` |
| Trackers | Supabase | `clinical_entries`, `shadow_days`, `eq_reflections`, `user_events` |
| Target Programs | Supabase | `user_saved_schools`, `target_program_*` tables |
| Prerequisite Courses | Supabase | `prerequisite_courses`, `prerequisite_reviews` (to be created) |
| Learning/LMS | Supabase | `modules`, `lessons`, `downloads`, `categories` |
| Marketplace | Supabase | `provider_profiles`, `services`, `bookings`, etc. |
| Gamification | Supabase | `point_actions`, `user_points`, `user_badges` |
| Events Calendar | Supabase | `school_events` or dedicated events table |
| Community/Forums | WordPress (BuddyBoss) | Forums, topics, replies, groups via REST API |

---

## Supabase Tables

### Schools & Programs

```
schools
├── id (uuid)
├── name (text) - Program name
├── school_name (text)
├── city (text)
├── state (text)
├── program_type (text) - integrated, front_loaded
├── degree_type (text) - dnp, dnap, msn
├── program_length_months (int)
├── class_size (int)
├── clinical_sites (int)
├── partially_online (boolean)
├── nursing_cas (boolean)
├── rolling_admissions (boolean)
├── pass_rate_first_time (decimal)
├── tuition_in_state (int)
├── tuition_out_of_state (int)
├── minimum_gpa (decimal)
├── minimum_experience_years (decimal)
├── gre_required (boolean)
├── ccrn_required (boolean)
├── shadowing_required (boolean)
├── application_opens (date)
├── application_deadline (date)
├── accepts_nicu (boolean)
├── accepts_picu (boolean)
├── accepts_er (boolean)
├── contact_email (text)
├── website_url (text)
├── image_url (text)
└── created_at, updated_at

schools_internal (admin-only data)
├── id (uuid)
├── school_id (uuid FK)
├── internal_notes (text)
├── priority_level (int)
└── last_verified_at (timestamp)

school_events
├── id (uuid)
├── school_id (uuid FK, optional)
├── title (text)
├── event_date (date)
├── event_time (time)
├── category (text) - program_info, aana_state, aana_national
├── location (text)
├── description (text)
├── registration_url (text)
└── featured (boolean)
```

**React Components:**
- `SchoolDatabasePage` → `/schools`
- `SchoolProfilePage` → `/schools/:id`
- `SchoolCard` component
- `EventsPage` → `/events`

---

### User Saved/Target Programs

```
user_saved_schools
├── id (uuid)
├── user_id (uuid FK)
├── school_id (uuid FK)
├── is_target (boolean)
├── status (text) - not_started, in_progress, submitted, etc.
├── notes (text)
├── saved_at (timestamp)
└── target_converted_at (timestamp)

target_program_checklists
├── id (uuid)
├── user_saved_school_id (uuid FK)
├── label (text)
├── completed (boolean)
├── is_default (boolean)
├── order (int)
└── created_at

target_program_documents
├── id (uuid)
├── user_saved_school_id (uuid FK)
├── name (text)
├── type (text) - transcript, resume, essay
├── file_url (text)
├── uploaded_at (timestamp)
└── size (int)

target_program_lors
├── id (uuid)
├── user_saved_school_id (uuid FK)
├── person_name (text)
├── relationship (text)
├── email (text)
├── status (text) - not_requested, requested, received
├── requested_date (date)
└── received_date (date)
```

**React Components:**
- `MyProgramsPage` → `/my-programs`
- `TargetProgramDetailPage` → `/my-programs/:id`
- `SavedProgramCard`, `TargetProgramCard`

---

### User Profiles

```
user_profiles
├── id (uuid)
├── user_id (uuid FK to auth.users)
├── preferred_name (text)
├── avatar_url (text)
├── current_stage (text) - exploring, planning, applying, etc.
├── target_start_year (int)
├── target_start_term (text)
└── created_at, updated_at

user_academic_profiles
├── id (uuid)
├── user_id (uuid FK)
├── overall_gpa (decimal)
├── science_gpa (decimal)
├── science_gpa_forgiveness (decimal)
├── last_60_gpa (decimal)
├── gpa_calculated (boolean)
├── gre_quantitative (int)
├── gre_verbal (int)
├── gre_analytical_writing (decimal)
└── gre_test_date (date)

user_clinical_profiles
├── id (uuid)
├── user_id (uuid FK)
├── primary_icu_type (text) - micu, cvicu, sicu, etc.
├── additional_icu_types (text[])
├── total_years_experience (decimal)
└── current_employer (text)

user_certifications
├── id (uuid)
├── user_id (uuid FK)
├── type (text) - ccrn, bls, acls, pals, etc.
├── status (text) - passed, scheduled, studying, not_started
├── earned_date (date)
└── expires_date (date)

user_completed_prerequisites
├── id (uuid)
├── user_id (uuid FK)
├── course_type (text) - anatomy, physiology, chemistry, etc.
├── year (int)
├── grade (text)
├── school_name (text)
└── credits (int)

user_leadership
├── id (uuid)
├── user_id (uuid FK)
├── type (text) - research, committee, volunteering, leadership
├── title (text)
├── description (text)
└── created_at
```

**React Components:**
- `MyStatsPage` → `/my-stats`
- Various edit sheets for each section

---

### Trackers

```
clinical_entries
├── id (uuid)
├── user_id (uuid FK)
├── date (date)
├── populations (text[]) - cardiac, neuro, trauma, etc.
├── medications (text[])
├── devices (text[])
├── procedures (text[])
├── notes (text)
├── highlight_moment (text)
└── created_at

clinical_tracker_stats (cached/computed)
├── user_id (uuid FK)
├── total_entries (int)
├── streak (int)
├── last_entry_date (date)
└── updated_at

shadow_days
├── id (uuid)
├── user_id (uuid FK)
├── date (date)
├── location (text)
├── provider_name (text)
├── provider_email (text)
├── hours_logged (decimal)
├── cases_observed (int)
├── skills_observed (text[])
├── notes (text)
└── add_to_total (boolean)

eq_reflections
├── id (uuid)
├── user_id (uuid FK)
├── date (date)
├── title (text)
├── reflection (text)
├── categories (text[]) - communication, leadership, teamwork, etc.
└── created_at

user_events (events attended)
├── id (uuid)
├── user_id (uuid FK)
├── event_id (uuid FK, optional)
├── title (text)
├── date (date)
├── category (text)
├── location (text)
├── notes (text)
└── created_at
```

**React Components:**
- `TrackersPage` → `/trackers` (tabs: Clinical, Shadow, EQ, Events)
- `ClinicalTracker`, `ShadowDaysTracker`, `EQTracker`

---

### Prerequisite Courses (To Be Created)

```
prerequisite_courses
├── id (uuid)
├── course_name (text)
├── school_name (text)
├── subject (text) - anatomy, physiology, chemistry, etc.
├── academic_level (text) - undergraduate, graduate
├── format (text) - online_sync, online_async, in_person, hybrid
├── credits (int)
├── cost_range (text)
├── course_url (text)
├── description (text)
├── submitted_by (uuid FK)
├── status (text) - pending, approved, rejected
├── avg_recommend_rating (decimal)
├── avg_ease_rating (decimal)
├── review_count (int)
└── created_at, updated_at

prerequisite_reviews
├── id (uuid)
├── course_id (uuid FK)
├── user_id (uuid FK)
├── recommend_rating (int 1-5)
├── ease_rating (int 1-5)
├── review_text (text)
├── tags (text[]) - self_paced, pre_recorded, heavy_workload, etc.
└── created_at

user_saved_prerequisites
├── id (uuid)
├── user_id (uuid FK)
├── course_id (uuid FK)
└── saved_at
```

**React Components:**
- `PrerequisitesPage` → `/prerequisites`
- `CourseDetailPage` → `/prerequisites/:id`
- `CourseCard`, `WriteReviewModal`

---

### Learning/LMS (Custom)

```
modules
├── id (uuid)
├── title (text)
├── slug (text)
├── description (text)
├── image_url (text)
├── order (int)
├── is_published (boolean)
└── created_at, updated_at

sections (optional grouping within modules)
├── id (uuid)
├── module_id (uuid FK)
├── title (text)
├── order (int)
└── created_at

lessons
├── id (uuid)
├── module_id (uuid FK)
├── section_id (uuid FK, optional)
├── title (text)
├── slug (text)
├── content (jsonb) - Editor.js JSON
├── video_url (text) - Vimeo URL
├── video_duration_seconds (int)
├── order (int)
├── is_published (boolean)
├── entitlements (text[]) - active_membership, plan_apply_toolkit, etc.
└── created_at, updated_at

downloads
├── id (uuid)
├── title (text)
├── description (text)
├── file_url (text)
├── file_source (text) - supabase, external
├── category_id (uuid FK)
├── entitlements (text[])
├── download_count (int)
└── created_at, updated_at

categories
├── id (uuid)
├── name (text)
├── slug (text)
├── type (text) - module, lesson, download
└── order (int)

entitlements
├── id (uuid)
├── slug (text) - active_membership, plan_apply_toolkit, etc.
├── name (text)
├── description (text)
└── created_at

user_lesson_progress
├── id (uuid)
├── user_id (uuid FK)
├── lesson_id (uuid FK)
├── completed (boolean)
├── completed_at (timestamp)
└── progress_percent (int)
```

**React Components:**
- `LearningLibraryPage` → `/learn`
- `ModuleDetailPage` → `/learn/:moduleSlug`
- `LessonPage` → `/learn/:moduleSlug/:lessonSlug`
- Admin: `ModulesListPage`, `LessonEditPage`

---

### Marketplace

```
provider_profiles
├── id (uuid)
├── user_id (uuid FK)
├── display_name (text)
├── bio (text)
├── avatar_url (text)
├── welcome_video_url (text)
├── crna_program (text)
├── graduation_year (int)
├── personality (jsonb) - zodiac, cats_dogs, road_trip_music, etc.
├── stripe_account_id (text)
├── cal_com_user_id (text)
├── is_active (boolean)
├── instant_book_enabled (boolean)
├── rating_avg (decimal)
├── review_count (int)
└── created_at, updated_at

provider_applications
├── id (uuid)
├── user_id (uuid FK)
├── status (text) - pending, approved, denied, info_requested
├── license_number (text)
├── license_state (text)
├── student_id_url (text)
├── bio (text)
├── denial_reason (text)
├── info_request_message (text)
└── created_at, updated_at

services
├── id (uuid)
├── provider_id (uuid FK)
├── type (text) - mock_interview, essay_review, coaching
├── title (text)
├── description (text)
├── price_cents (int)
├── duration_minutes (int)
├── is_active (boolean)
├── instant_book_enabled (boolean)
└── created_at, updated_at

bookings
├── id (uuid)
├── service_id (uuid FK)
├── applicant_id (uuid FK)
├── provider_id (uuid FK)
├── status (text) - pending, confirmed, completed, cancelled
├── booking_model (text) - request, instant
├── scheduled_at (timestamp)
├── price_cents (int)
├── platform_fee_cents (int)
├── stripe_payment_intent_id (text)
├── intake_data (jsonb) - service-specific form data
├── session_notes (jsonb) - Editor.js JSON
├── cancellation_reason (text)
├── refund_amount_cents (int)
└── created_at, updated_at

booking_reviews
├── id (uuid)
├── booking_id (uuid FK)
├── reviewer_id (uuid FK)
├── reviewer_type (text) - applicant, provider
├── rating (int 1-5)
├── review_text (text)
├── is_visible (boolean) - double-blind until both review
└── created_at

conversations (pre-booking inquiries)
├── id (uuid)
├── applicant_id (uuid FK)
├── provider_id (uuid FK)
├── service_id (uuid FK, optional)
├── status (text) - open, closed
└── created_at, updated_at

messages
├── id (uuid)
├── conversation_id (uuid FK)
├── sender_id (uuid FK)
├── content (text)
├── read_at (timestamp)
└── created_at

notifications
├── id (uuid)
├── user_id (uuid FK)
├── type (text) - booking_request, booking_confirmed, message, etc.
├── title (text)
├── body (text)
├── data (jsonb) - links, IDs
├── read_at (timestamp)
└── created_at
```

**React Components:**
- Applicant: `MarketplacePage`, `MentorProfilePage`, `BookingFlowPage`, `MyBookingsPage`
- Provider: `ProviderDashboardPage`, `ProviderOnboardingPage`, `ProviderServicesPage`
- Admin: `AdminProvidersPage`, `AdminBookingsPage`

---

### Gamification

```
point_actions
├── id (uuid)
├── slug (text) - lesson_complete, shadow_log, etc.
├── name (text)
├── description (text)
├── base_points (int)
├── daily_max (int, nullable)
├── is_active (boolean)
└── created_at

point_promos
├── id (uuid)
├── name (text)
├── multiplier (decimal) - 1.5, 2.0, etc.
├── applies_to (text, nullable) - null = all actions
├── starts_at (timestamp)
├── ends_at (timestamp)
└── created_at

user_points
├── id (uuid)
├── user_id (uuid FK)
├── total_points (int)
├── current_level (int)
└── updated_at

user_point_log
├── id (uuid)
├── user_id (uuid FK)
├── action_slug (text)
├── points_awarded (int)
├── multiplier_applied (decimal)
├── reference_id (uuid, optional)
├── reference_type (text, optional)
└── created_at

user_badges
├── id (uuid)
├── user_id (uuid FK)
├── badge_slug (text)
├── earned_at (timestamp)
└── created_at
```

**React Components:**
- Points display throughout app
- Admin: `AdminPointsPage` → `/admin/points`

---

## WordPress (BuddyBoss Only)

Community features remain in WordPress, accessed via BuddyBoss REST API.

### Forums (bbp_forum)

```
REST Base: /wp-json/buddyboss/v1/forums

Forums:
1. Introductions
2. CRNA Programs (with sub-forums per school)
3. Application Journey
4. Prerequisites
5. Critical Care Experience
6. Interview Prep
7. Study Groups
8. General Discussion

Fields:
├── forum_title (text)
├── forum_description (textarea)
├── parent_forum (relation)
├── topic_count (computed)
└── post_count (computed)
```

### Topics (bbp_topic)

```
REST Base: /wp-json/buddyboss/v1/topics

Fields:
├── topic_title (text)
├── topic_content (wysiwyg)
├── forum_id (relation)
├── author_id (relation)
├── reply_count (computed)
├── last_active (datetime)
└── sticky (boolean)
```

### Replies (bbp_reply)

```
REST Base: /wp-json/buddyboss/v1/replies

Fields:
├── reply_content (wysiwyg)
├── topic_id (relation)
├── author_id (relation)
└── created_at (datetime)
```

### Groups (bp_group)

```
REST Base: /wp-json/buddyboss/v1/groups

Sample Groups:
- Annual Congress 2025 - Nashville Meetup
- Parents on the Path
- Global CRNA Hopefuls
- Program-specific groups

Fields:
├── group_name (text)
├── group_description (textarea)
├── group_type (select: public, private)
├── member_count (computed)
├── cover_image (media)
└── admins (user relations)
```

**React Components:**
- `CommunityPage` → `/community`
- `ForumsPage`, `TopicDetailPage`, `GroupsPage`
- Uses BuddyBoss REST API, not Supabase

---

## Migration Tables

Tables for WordPress → Supabase migration:

```
wordpress_user_mapping
├── wp_user_id (int)
├── supabase_user_id (uuid)
└── migrated_at

wordpress_user_meta_staging
├── wp_user_id (int)
├── meta_key (text)
├── meta_value (text)
└── imported_at

migration_log
├── id (uuid)
├── table_name (text)
├── records_migrated (int)
├── started_at (timestamp)
└── completed_at (timestamp)

groundhogg_tag_sync
├── user_id (uuid FK)
├── tag_id (int)
├── tag_name (text)
└── synced_at
```

---

## API Response Transformations

When fetching from Supabase, data is already in the correct format. For BuddyBoss:

```javascript
// Transform BuddyBoss topic to React format
function transformTopic(bbTopic) {
  return {
    id: `topic_${bbTopic.id}`,
    title: bbTopic.title.rendered,
    content: bbTopic.content.rendered,
    author: {
      id: bbTopic.author,
      name: bbTopic.author_name,
      avatar: bbTopic.author_avatar,
    },
    forumId: bbTopic.forum_id,
    replyCount: bbTopic.reply_count,
    lastActive: bbTopic.last_active,
    createdAt: bbTopic.date,
  };
}
```

---

## Missing Tables (To Create)

These tables are referenced but not yet in migrations:

1. **`prerequisite_courses`** - Prerequisite course library
2. **`prerequisite_reviews`** - Reviews for prerequisite courses
3. **`user_saved_prerequisites`** - User's saved courses

See `/docs/project/handoff.md` for the complete list of migrations to run.
