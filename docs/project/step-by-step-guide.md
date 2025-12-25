# Step-by-Step Build Guide

A granular, step-by-step guide for building The CRNA Club React frontend.

**How to use this file:**
- Work through tasks in order
- Check off each item as you complete it
- 🔄 = Git commit point (commit your work!)
- 🤖 = Agent trigger (ask Claude to run this agent)
- 📖 = Read this file first
- ⏱️ = Estimated time

---

## 📚 Key Reference Documents

These documents contain important architecture decisions - reference as needed:

| Document | When to Reference |
|----------|-------------------|
| `/docs/project/decision-log.md` | Architecture decisions, integration choices |
| `/docs/project/billing-migration-plan.md` | Billing/subscription implementation |
| `/docs/project/woocommerce-supabase-integration.md` | Product purchases sync |
| `/docs/project/marketplace/README.md` | Marketplace implementation |
| `/docs/project/lms-implementation-plan.md` | Learning library / LMS |

**Key Architecture Decisions (Dec 9, 2024):**
- Supabase Auth as primary (sync to WordPress for legacy)
- Supabase `user_entitlements` as source of truth (not Groundhogg tags)
- Stripe Billing for subscriptions, WooCommerce + FunnelKit for products
- Cal.com Platform API for marketplace scheduling (100% white-labeled)
- Stripe Connect Express for marketplace payouts (20% commission)
- Editor.js for LMS content editing (reusable for "My Docs" feature)
- WP Fusion NOT used (Groundhogg native integration)

---

## ✅ Phase 0: Setup (COMPLETE)

All setup tasks are done! You have a working React app.

---

## ✅ Phase 1: Design System + Components (COMPLETE)

**Target:** Nov 30 | **Status:** ✅ COMPLETE

### 1.1 Preparation ✅

- [x] 📖 Read `/docs/skills/design-system.md`
- [x] 📖 Read `/docs/skills/component-library.md`
- [x] 📖 Read `/docs/skills/coding-standards.md`
- [x] Open the app locally (`npm run dev`)
- [x] Open browser DevTools and set to 375px mobile view

### 1.2 Install Additional UI Dependencies ✅

- [x] Install Radix UI dependencies
- [x] Verify install worked (no errors)
- [x] 🔄 Committed

### 1.3 Base UI Components - Batch 1 ✅

- [x] Select component created
- [x] Checkbox component created
- [x] Tabs component created
- [x] All components tested and working
- [x] 🔄 Committed

### 1.4 Base UI Components - Batch 2 ✅

- [x] Dialog/Modal component created
- [x] Tooltip component created
- [x] Progress bar component created
- [x] Avatar component created
- [x] All components tested and working
- [x] 🔄 Committed

### 1.5 Custom Components - Batch 1 ✅

- [x] TagSelect component created
- [x] StatusBadge component created
- [x] All components tested and working
- [x] 🔄 Committed

### 1.6 Custom Components - Batch 2 ✅

- [x] StatCard component created
- [x] ProgressRing component created
- [x] HighlightHeading component created
- [x] All components tested and working
- [x] 🔄 Committed

### 1.7 Create Component Index Files ✅

- [x] UI components index created
- [x] Layout components index created
- [x] Imports updated
- [x] 🔄 Committed

### 1.8 QA Phase 1 ✅

- [x] QA completed - 100% WCAG 2.1 AA compliance
- [x] All touch targets verified (44px minimum)
- [x] Colors updated to #f6ff88 (primary yellow)
- [x] All issues fixed
- [x] 🔄 Committed

### 1.9 Phase 1 Wrap-up ✅

- [x] Status updated
- [x] 🔄 Committed
- [x] 🎉 Phase 1 COMPLETE!

---

## 🟡 Phase 2: Applicant Core Pages (~80% Complete)

**Target:** Dec 3 | **Status:** 🟡 ~80% Complete (QA remaining)

### 2.1 Preparation ✅

- [x] 📖 Read `/docs/skills/page-map.md` (Dashboard section)
- [x] 📖 Read `/docs/skills/empty-states.md`
- [x] 📖 Read `/docs/skills/data-shapes.md`
- [x] 📖 Read `/docs/skills/mock-data.md`

### 2.2 Create Mock Data Files ✅

- [x] mockUser.js created with user profile, subscription, gamification data
- [x] mockPrograms.js created with saved and target programs
- [x] mockTrackers.js created with clinical, EQ, shadow, events data
- [x] mockSchools.js created with school database
- [x] mockPrerequisites.js created with prerequisite courses
- [x] index.js exports all mock data
- [x] 🔄 Committed

### 2.3 Create Custom Hooks ✅

- [x] useUser hook created
- [x] usePrograms hook created
- [x] useTrackers hook created
- [x] useSchools hook created
- [x] hooks index file created
- [x] 🔄 Committed

### 2.4-2.7 Dashboard Page ✅

- [x] DashboardPage with full layout
- [x] ToDoListWidget component
- [x] MyProgramsWidget component
- [x] ApplicationMilestonesWidget component
- [x] MyEventsWidget component
- [x] QuickLinksWidget component
- [x] Smart Nudges integration (see Phase 2.5)
- [x] Empty states for all widgets
- [x] Mobile responsive layout
- [x] 🔄 Committed

### 2.8 My Programs Page ✅

- [x] MyProgramsPage with target and saved sections
- [x] ProgramCard component
- [x] SavedProgramCard component
- [x] Filters and search
- [x] Mobile responsive
- [x] 🔄 Committed

### 2.9 Target Program Detail Page ✅

- [x] TargetProgramDetailPage with two-column layout
- [x] ApplicationChecklist component (dynamic - see Phase 2.5)
- [x] ProgramTasks component with tabs
- [x] LOR tracking section
- [x] Documents section
- [x] Notes section
- [x] 🔄 Committed

### 2.10-2.12 My Trackers Page ✅

- [x] MyTrackersPage with tab navigation
- [x] Clinical tab with summary stats, tag selects, entry log
- [x] EQ tab with reflection prompts
- [x] Shadow Days tab with enhanced tracker
- [x] Events tab
- [x] ShadowDaysPage (dedicated page)
- [x] All forms working
- [x] 🔄 Committed

### 2.13 My Stats / Profile Page ✅

- [x] MyStatsPage with all profile sections
- [x] ReadyScore display (see Phase 2.5)
- [x] GPACard component
- [x] CertificationsCard component
- [x] ClinicalSkillsCard component
- [x] Prerequisites tracking
- [x] 🔄 Committed

### 2.14 QA Phase 2 ⬜

- [x] 🤖 **Run QA Agent:** "QA phase 2 - all applicant core pages"
- [x] Test Dashboard → My Programs → Program Detail flow
- [x] Test Dashboard → Trackers → Log entry flow
- [x] Test Dashboard → My Stats flow
- [x] Check all empty states
- [x] Test at 375px, 768px, 1024px
- [x ] Log issues in `/docs/project/issues.md`
- [x] Fix critical issues
- [ ] 🔄 **COMMIT:** `git add . && git commit -m "Phase 2 QA fixes"`

### 2.15 Phase 2 Wrap-up ⬜

- [x] Update `/docs/project/status.md` - mark Phase 2 complete
- [x] 🔄 **COMMIT:** `git add . && git commit -m "Complete Phase 2: Applicant Core Pages"`
- [x] 🎉 **CELEBRATE!** Phase 2 done!

---

## ✅ Phase 2.5: Data Layer Systems (COMPLETE)

**Status:** ✅ COMPLETE

This phase was added to establish the intelligent systems that drive the app's personalization and engagement features.

### Smart Prompts / Nudge Engine ✅

- [x] Created 7 engines:
  - deadlineAlertEngine.js (3 prompts)
  - certificationEngine.js (2 prompts)
  - lorTrackingEngine.js (3 prompts)
  - interviewPrepEngine.js (11 prompts)
  - engagementNudgeEngine.js (16 prompts)
  - eventEngagementEngine.js (2 prompts)
  - prerequisiteGapEngine.js (2 prompts)
- [x] Implemented priority scoring algorithm (prioritySystem.js)
- [x] Added frequency management (frequencyManager.js)
- [x] Created 39 prompt definitions (promptDefinitions.js)
- [x] Built dashboard nudge components (DashboardNudges.jsx, DashboardNudgeCard.jsx)
- [x] Created useSmartPrompts hook
- [x] Integrated into DashboardPage
- [x] Documented in `/docs/skills/smart-prompts-system.md`

### ReadyScore System ✅

- [x] Designed scoring algorithm with weighted factors
- [x] Implemented readinessCalculator.js
- [x] Created ReadyScoreDisplay component
- [x] Documented in `/docs/skills/readyscore-system.md`

### Dynamic Checklist System ✅

- [x] Designed requirement-based checklist generation
- [x] Checklist items derived from school requirements
- [x] Progress tracking per program
- [x] Documented in `/docs/skills/dynamic-checklist-system.md`

### Canonical User Model ✅

- [x] Mapped all user data fields across the app
- [x] Defined data collection points
- [x] Established field naming conventions
- [x] Documented in `/docs/skills/canonical-user-model.md`

### Schema & Risk Documentation ✅

- [x] Established naming conventions in `/docs/project/schema-decisions.md`
- [x] Created `/docs/project/data-integration-risks.md`
- [x] Documented API integration considerations

---

## Phase 3: Marketplace Applicant Side

**Target:** TBD | **Status:** 🟡 FRONTEND COMPLETE - Backend Integration Pending
**Estimated Time:** 4-5 weeks

> **Architecture:** Cal.com handles scheduling (100% white-labeled). Stripe Connect handles payments. Supabase handles messaging & data. Custom React UI for everything.
>
> **Key Corrections Applied:**
> - 48h provider response time (not 24h)
> - Payment captured on accept (not session complete)
> - Quick Book only for mentors who enable it

### 📖 Skills & References

| Purpose | File |
|---------|------|
| Master Plan | `/docs/project/marketplace/README.md` |
| Booking Flow | `/docs/project/marketplace/booking-process-flow.md` |
| Stripe Connect Decisions | `/docs/project/marketplace/stripe-connect-decisions.md` |
| Messaging Architecture | `/docs/project/marketplace/messaging-architecture.md` |
| Provider Onboarding | `/docs/project/marketplace/provider-onboarding-flow.md` |
| Gamification | `/docs/skills/gamification-system.md` |

---

### 3.0 Foundation Setup (Week 1)

#### 3.0.1 Preparation
- [ ] 📖 Read `/docs/project/marketplace/README.md`
- [ ] 📖 Read `/docs/project/marketplace/booking-process-flow.md`
- [ ] 📖 Read `/docs/project/marketplace/stripe-connect-decisions.md`
- [x] Sign up for Cal.com Platform API (request access)
- [x] Set up Stripe Connect test account
- [ ] Set up Nursys e-Notify account (free - for license verification)

#### 3.0.2 Environment Configuration
- [ ] Add to `.env.local`:
```env
# Cal.com
CAL_COM_API_URL=https://api.cal.com/v2
CAL_COM_CLIENT_ID=xxx
CAL_COM_CLIENT_SECRET=xxx
CAL_COM_WEBHOOK_SECRET=xxx

# Stripe Connect
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_CONNECT_CLIENT_ID=ca_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Nursys (for RN license verification)
NURSYS_API_URL=https://api.nursys.com
NURSYS_API_KEY=xxx
```
- [ ] 🔄 **COMMIT:** `git add .env.example && git commit -m "Add marketplace environment variables template"`

#### 3.0.3 Database Schema Setup ✅
- [x] 🤖 **Run Agent:** Create Supabase migration for marketplace tables
  ```
  Prompt: "Create a Supabase migration file for marketplace tables including providers, provider_applications, services, bookings, booking_reviews, conversations, messages, and notifications. Include RLS policies."
  ```
- [x] Create migration file: `supabase/migrations/20251212_marketplace_schema.sql` ✅ (2 files exist)
- [x] Add tables: ✅ All tables created
  - `providers` (with license verification fields) ✅
  - `provider_applications` ✅
  - `services` ✅
  - `bookings` ✅
  - `booking_reviews` ✅
  - `conversations` ✅
  - `messages` ✅
  - `notifications` ✅
- [x] Add new fields per plan: ✅ All fields added
  - `provider_applications.license_number` ✅
  - `provider_applications.license_state` ✅
  - `provider_applications.license_verified` ✅
  - `provider_applications.license_verified_at` ✅
  - `provider_applications.student_id_url` ✅
  - `providers.vacation_start` ✅
  - `providers.vacation_end` ✅
  - `providers.vacation_message` ✅
  - `providers.is_paused` ✅
  - `providers.instant_book_enabled` ✅
  - `providers.video_call_link` (Zoom/Meet URL) ✅
  - **`providers.personality` (JSONB)** ✅
  - `bookings.session_notes` (JSONB for Editor.js) ✅
- [ ] Run migration: `npx supabase db push` (for dev team)
- [ ] 🧪 **Test:** Insert test data in Supabase dashboard (for dev team)
- [x] 🔄 **COMMIT:** Schema migrations created

#### 3.0.4 Core Library Files ✅ (3 of 4 complete)
- [x] 🤖 **Run Agent:** Create Cal.com API helper library ✅
  - `/src/lib/calcom.js` exists (17KB)
- [x] 🤖 **Run Agent:** Create Stripe Connect helper library ✅
  - `/src/lib/stripe-connect.js` exists (18KB)
- [ ] 🤖 **Run Agent:** Create Nursys license verification helper ❌ NOT CREATED
  ```
  Prompt: "Create /src/lib/nursys.js with function verifyLicense(licenseNumber, state) that returns { verified, status, expirationDate, discipline }. Include mock mode for development."
  ```
- [x] Create `/src/lib/booking.js` - Booking orchestration logic with state machine transitions ✅ (22KB)
- [ ] 🧪 **Test:** API helpers work with test credentials (for dev team)
- [x] 🔄 **COMMIT:** Core libraries created

#### 3.0.5 Edge Functions Setup ❌ (For dev team)
- [ ] Create `supabase/functions/verify-nursing-license/index.ts` (for dev team)
- [ ] Create `supabase/functions/sync-groundhogg-tags/index.ts` (for dev team)
- [ ] Create `supabase/functions/booking-reminder/index.ts` (24h nudge for providers) (for dev team)
- [ ] Deploy: `npx supabase functions deploy` (for dev team)
- [ ] 🔄 **COMMIT:** Edge functions (for dev team)

---

### 3.1 Mock Data & Hooks (Week 1) ✅

#### 3.1.1 Create Mock Data Files ✅
- [x] Verify `/src/data/marketplace/mockProviders.js` exists (5 providers + 2 pending)
  - Include personality data for each provider
- [x] Verify `/src/data/marketplace/mockServices.js` exists (12 services)
- [x] Verify `/src/data/marketplace/mockBookings.js` exists (all states)
- [x] Verify `/src/data/marketplace/mockReviews.js` exists
- [x] Verify `/src/data/marketplace/mockConversations.js` exists
- [x] Verify `/src/data/marketplace/mockNotifications.js` exists
- [x] Add new mock data for intake forms:
  - `mockIntakeForms.js` - service-specific intake templates
- [x] 🔄 **COMMIT:** Marketplace mock data verified

#### 3.1.2 Create Core Hooks ✅
- [x] 🤖 **Run Agent:** Create useProviders hook with search/filter
  ```
  Prompt: "Create /src/hooks/useProviders.js hook that fetches providers from mock data, supports search by name/school, filter by service type/price/rating, and returns { providers, loading, error, searchProviders, filterProviders }."
  ```
- [x] 🤖 **Run Agent:** Create useServices hook
  ```
  Prompt: "Create /src/hooks/useServices.js hook for fetching provider services with { services, getServiceById, getServicesByProvider }."
  ```
- [x] 🤖 **Run Agent:** Create useBookings hook with state management
  ```
  Prompt: "Create /src/hooks/useBookings.js hook with 48h timeout logic, payment state transitions, and functions: { bookings, createBooking, cancelBooking, getBookingById, updateBookingStatus }."
  ```
- [x] 🤖 **Run Agent:** Create useReviews hook with double-blind logic
  ```
  Prompt: "Create /src/hooks/useReviews.js hook with double-blind review visibility logic (hidden until both parties review OR 14 days pass). Include { reviews, submitReview, getReviewsForProvider }."
  ```
- [x] 🤖 **Run Agent:** Create useCalComAvailability hook ✅
  ```
  Prompt: "Create /src/hooks/useCalComAvailability.js hook that fetches available time slots from Cal.com API for a given provider and date range."
  ```
- [x] 🤖 **Run Agent:** Create useConversations hook with Supabase realtime ✅
  ```
  Prompt: "Create /src/hooks/useConversations.js hook with Supabase realtime subscriptions for messaging. Include { conversations, messages, sendMessage, markAsRead }."
  ```
- [x] 🤖 **Run Agent:** Create useNotifications hook ✅
  ```
  Prompt: "Create /src/hooks/useNotifications.js hook with { notifications, unreadCount, markAsRead, markAllAsRead }."
  ```
- [x] 🧪 **Test:** All hooks return expected data ✅
- [x] 🔄 **COMMIT:** Marketplace hooks complete

---

### 3.2 Discovery Pages (Week 1-2) ✅

> **Note:** Members-only for MVP. Login required to view marketplace.

#### 3.2.1 Marketplace Home Page ✅
**Route:** `/marketplace`

- [x] 🤖 **Run Agent:** Create MarketplacePage with hero, filters, and mentor grid
  ```
  Prompt: "Create /src/pages/applicant/MarketplacePage.jsx with:
  - Hero section with search bar
  - Filter sidebar (service type, program, price, rating, availability)
  - Mentor card grid (3-4 columns desktop, 1 mobile)
  - Empty state: 'No mentors match your filters'
  Use useProviders hook for data."
  ```
- [x] 🤖 **Run Agent:** Create MarketplaceFilters component ✅
  ```
  Prompt: "Create /src/components/features/marketplace/MarketplaceFilters.jsx with filters for service type (dropdown), program (search), price range (slider), rating (stars), availability (date picker)."
  ```
- [x] 🤖 **Run Agent:** Create MentorCard component with personality preview ✅
  ```
  Prompt: "Create /src/components/features/marketplace/MentorCard.jsx showing:
  - Avatar, name, school, rating, services, price range
  - Personality snippet (show 1-2 fun facts like '🐕 Dog lover • ☕ Coffee obsessed')
  - Show 'Book Now' ONLY if instant_book_enabled: true
  - Show 'View Profile' for all
  - Save button (heart icon)"
  ```
- [x] Update `/src/router.jsx` - add `/marketplace` route
- [x] 🎭 **Playwright Test:** Create `tests/marketplace-browse.spec.cjs` (16 tests)
```javascript
import { test, expect } from '@playwright/test';

test('marketplace page loads with mentors', async ({ page }) => {
  await page.goto('/marketplace');
  await expect(page.getByRole('heading', { name: /find a mentor/i })).toBeVisible();
  await expect(page.locator('[data-testid="mentor-card"]')).toHaveCount({ min: 1 });
});

test('filter by service type works', async ({ page }) => {
  await page.goto('/marketplace');
  await page.getByLabel('Service Type').selectOption('mock_interview');
  await expect(page.locator('[data-testid="mentor-card"]')).toHaveCount({ min: 1 });
});

test('search filters mentors', async ({ page }) => {
  await page.goto('/marketplace');
  await page.getByPlaceholder('Search mentors').fill('Georgetown');
  await expect(page.locator('[data-testid="mentor-card"]')).toHaveCount({ min: 1 });
});

test('mentor card shows personality snippet', async ({ page }) => {
  await page.goto('/marketplace');
  // Cards should show personality preview with emojis
  await expect(page.locator('[data-testid="mentor-card"]').first()).toContainText(/🐕|☕|🎵/);
});
```
- [x] Run: `npx playwright test tests/marketplace-browse.spec.cjs` ✅ All passing
- [x] 🔄 **COMMIT:** Marketplace browse page complete

#### 3.2.2 Mentor Profile Page ✅
**Route:** `/marketplace/mentor/:id`

- [x] 🤖 **Run Agent:** Create MentorProfilePage with personality section and services
  ```
  Prompt: "Create /src/pages/applicant/MentorProfilePage.jsx with:
  - Header: Avatar, name, program, rating, response time
  - Bio section
  - 'Get to Know Me' personality section (fun cards showing their answers like '🐕 Dog person', '♈ Aries')
  - 'Currently Unavailable' badge if is_paused: true or in vacation dates
  - Services section (cards with Book/Request buttons based on instant_book_enabled)
  - Specializations/background (ICU type, years, certifications)
  - Reviews section with filters
  - 'Message' and 'Book' CTAs"
  ```
- [x] 🤖 **Run Agent:** Create ServiceCard component
  ```
  Prompt: "Create /src/components/features/marketplace/ServiceCard.jsx showing service name, description, price, duration, and correct CTA based on mentor's booking model (instant vs request)."
  ```
- [x] 🤖 **Run Agent:** Create PersonalityDisplay component for mentor profiles
  ```
  Prompt: "Create /src/components/features/marketplace/PersonalityDisplay.jsx with:
  - Fun card/badge layout for personality answers
  - Emoji icons for each category (zodiac, pets, music, etc.)
  - Responsive grid (2-3 columns on desktop, 1 on mobile)
  - Only shows questions they answered (skip empty)"
  ```
- [x] 🤖 **Run Agent:** Create ReviewCard component
  ```
  Prompt: "Create /src/components/features/marketplace/ReviewCard.jsx showing star rating, review text, reviewer first name, date, service type, and helpful tags."
  ```
- [x] 🤖 **Run Agent:** Create ReviewList component with filters
  ```
  Prompt: "Create /src/components/features/marketplace/ReviewList.jsx with filter by service type, sort by date/rating, and pagination."
  ```
- [x] Update router
- [x] 🎭 **Playwright Test:** Create `tests/mentor-profile.spec.cjs` (22 tests)
```javascript
import { test, expect } from '@playwright/test';

test('mentor profile displays correctly', async ({ page }) => {
  await page.goto('/marketplace/mentor/test-mentor-1');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByTestId('service-card')).toHaveCount({ min: 1 });
  await expect(page.getByTestId('review-card')).toHaveCount({ min: 1 });
});

test('mentor profile shows personality section', async ({ page }) => {
  await page.goto('/marketplace/mentor/test-mentor-1');
  await expect(page.getByText(/get to know me/i)).toBeVisible();
  await expect(page.getByTestId('personality-card')).toHaveCount({ min: 1 });
});

test('paused mentor shows unavailable badge', async ({ page }) => {
  await page.goto('/marketplace/mentor/paused-mentor');
  await expect(page.getByText(/currently unavailable/i)).toBeVisible();
});
```
- [x] Run: `npx playwright test tests/mentor-profile.spec.cjs` ✅ All passing
- [x] 🔄 **COMMIT:** Mentor Profile page complete

#### 3.2.3 All Reviews Page ✅
**Route:** `/marketplace/mentor/:id/reviews`

- [x] 🤖 **Run Agent:** Create MentorReviewsPage with pagination ✅
  - `/src/pages/applicant/MentorReviewsPage.jsx` (15KB)
- [x] Update router ✅ (route at `/marketplace/mentor/:mentorId/reviews`)
- [x] 🎭 **Playwright Test:** Add to `tests/mentor-profile.spec.cjs` ✅ (5 tests added)
- [x] 🔄 **COMMIT:** Mentor Reviews page complete

---

### 3.3 Booking Flow (Week 2) ✅

> **IMPORTANT:** Payment authorized on submit, CAPTURED when provider accepts (not after session)

#### 3.3.1 Booking Step 1: Service & Context (with Service-Specific Intake) ✅
**Route:** `/marketplace/book/:serviceId`

- [x] 🤖 **Run Agent:** Create BookingPage wizard container
  ```
  Prompt: "Create /src/pages/applicant/BookingPage.jsx as a 3-step wizard container with step indicator, back/next navigation, and step state management."
  ```
- [x] 🤖 **Run Agent:** Create ServiceIntakeForm with conditional fields by service type
  ```
  Prompt: "Create /src/components/features/marketplace/ServiceIntakeForm.jsx with conditional fields based on service type:

  MOCK INTERVIEW fields:
  - Interview type: Traditional, MMI, Behavioral (radio)
  - Target programs (from user's saved list, multi-select)
  - Areas of concern (checkboxes: Technical Q&A, Storytelling, Nerves, Program-fit)
  - 'I'd like a recording' checkbox

  ESSAY REVIEW fields:
  - Document type: Personal Statement, Secondary, Diversity (dropdown)
  - Draft stage: First draft, Revised, Near-final (radio)
  - Feedback type: Grammar only, Story & structure, Developmental (radio)
  - Deadline date picker
  - Specific concerns textarea

  COACHING fields:
  - Current stage: Exploring, Building prereqs, Ready to apply (radio)
  - Main concerns (checkboxes)
  - 'If I could get clarity on ONE thing...' textarea"
  ```
- [x] 🤖 **Run Agent:** Create BookingStepContext component
  ```
  Prompt: "Create /src/components/features/marketplace/BookingStepContext.jsx with:
  - Service summary (read-only)
  - ServiceIntakeForm (conditional by service type)
  - File upload (PDF, DOCX, TXT, images, 25MB max)
  - Target programs selection (optional)
  - Next/Back navigation"
  ```
- [x] 🎭 **Playwright Test:** Create `tests/booking-flow.spec.cjs` (30 tests)
```javascript
import { test, expect } from '@playwright/test';

test('booking step 1 shows service-specific intake for mock interview', async ({ page }) => {
  await page.goto('/marketplace/book/mock-interview-service-1');
  await expect(page.getByText(/interview type/i)).toBeVisible();
  await expect(page.getByText(/areas of concern/i)).toBeVisible();
});

test('booking step 1 shows different intake for essay review', async ({ page }) => {
  await page.goto('/marketplace/book/essay-review-service-1');
  await expect(page.getByText(/document type/i)).toBeVisible();
  await expect(page.getByText(/feedback type/i)).toBeVisible();
});

test('file upload works', async ({ page }) => {
  await page.goto('/marketplace/book/mock-interview-service-1');
  await page.setInputFiles('input[type="file"]', 'tests/fixtures/test-resume.pdf');
  await expect(page.getByText('test-resume.pdf')).toBeVisible();
});
```
- [x] Run: `npx playwright test tests/booking-flow.spec.cjs` ✅ All passing
- [x] 🔄 **COMMIT:** Booking flow complete

#### 3.3.2 Booking Step 2: Choose Availability ✅
**Route:** `/marketplace/book/:serviceId?step=2`

> **Note:** Steps 2 and 3 are implemented directly within BookingPage.jsx (21KB monolithic component) rather than as separate component files. All functionality is present.

- [x] ✅ Schedule selection UI implemented in BookingPage.jsx
  - Timezone detection + picker ✅
  - Calendar picker (next 30 days) ✅
  - Time slot selection (from Cal.com API hook) ✅
  - Add up to 3 time preferences ✅
  - Scheduling notes textarea ✅
  - Price breakdown display ✅
- [x] Uses `useCalComAvailability` hook for availability data ✅
- [x] 🎭 **Playwright Test:** Tests in `tests/booking-flow.spec.cjs` ✅
- [x] 🔄 **COMMIT:** Booking step 2 complete (part of BookingPage.jsx)

#### 3.3.3 Booking Step 3: Review & Payment ✅
**Route:** `/marketplace/book/:serviceId?step=3`

- [x] ✅ Payment UI implemented in BookingPage.jsx
  - Request summary (collapsible) ✅
  - Stripe Elements payment form placeholder ✅
  - Terms checkboxes ✅
  - 'Authorize Payment' button ✅
  - Processing/loading state ✅
  - Authorization explanation text ✅
- [x] 🎭 **Playwright Test:** Tests in `tests/booking-flow.spec.cjs` ✅
- [x] 🔄 **COMMIT:** Booking step 3 complete (part of BookingPage.jsx)

#### 3.3.4 Booking Confirmation Page ✅
**Route:** `/marketplace/bookings/:id`

> **Note:** Booking confirmation functionality is integrated into the booking flow - upon successful submission, user is redirected to My Bookings page with success toast.

- [x] ✅ Confirmation flow implemented
- [x] 🎭 **Playwright Test:** Tests in `tests/booking-flow.spec.cjs` ✅
- [x] 🔄 **COMMIT:** Booking confirmation complete

---

### 3.4 Booking Management (Week 2-3) ✅

#### 3.4.1 My Bookings Page ✅
**Route:** `/marketplace/my-bookings`

- [x] 🤖 **Run Agent:** Create MyBookingsPage with tabs
  ```
  Prompt: "Create /src/pages/applicant/MyBookingsPage.jsx with:
  - Tabs: Upcoming, Past, Saved Mentors
  - Filters: Service type, Status
  - Empty states per tab
  Use useBookings hook for data."
  ```
- [x] 🤖 **Run Agent:** Create BookingCard with status-based actions
  ```
  Prompt: "Create /src/components/features/marketplace/BookingCard.jsx with:
  - Status badge (Pending/Confirmed/Completed/Cancelled/Expired)
  - Show countdown: 'X hours left for mentor to respond' for pending
  - Actions by status:
    - Pending: Message, View Details, Cancel
    - Confirmed: Add to Calendar, Message, Reschedule, Cancel, Join Video (5 min before)
    - Completed: Leave Review, Book Again, View Notes"
  ```
- [x] 🤖 **Run Agent:** Create SavedMentorCard component
  ```
  Prompt: "Create /src/components/features/marketplace/SavedMentorCard.jsx showing saved mentor with quick book button."
  ```
- [x] Update router
- [x] 🎭 **Playwright Test:** Create `tests/my-bookings.spec.cjs` (22 tests)
```javascript
import { test, expect } from '@playwright/test';

test('my bookings shows correct tabs', async ({ page }) => {
  await page.goto('/marketplace/my-bookings');
  await expect(page.getByRole('tab', { name: /upcoming/i })).toBeVisible();
  await expect(page.getByRole('tab', { name: /past/i })).toBeVisible();
  await expect(page.getByRole('tab', { name: /saved mentors/i })).toBeVisible();
});

test('pending booking shows countdown', async ({ page }) => {
  await page.goto('/marketplace/my-bookings');
  await expect(page.getByText(/hours left/i)).toBeVisible();
});

test('confirmed booking shows join button near session time', async ({ page }) => {
  await page.goto('/marketplace/my-bookings');
  await expect(page.getByRole('button', { name: /join video/i })).toBeVisible();
});
```
- [x] Run: `npx playwright test tests/my-bookings.spec.cjs` ✅ All passing
- [x] 🔄 **COMMIT:** My Bookings page complete

#### 3.4.2 Booking Detail Page ✅
**Route:** `/marketplace/bookings/:id/details`

- [x] 🤖 **Run Agent:** Create BookingDetailPage with session prep and notes ✅
  - `/src/pages/applicant/BookingDetailPage.jsx` (16KB)
- [x] 🤖 **Run Agent:** Create WhatToExpectCard component ✅
  - `/src/components/features/marketplace/WhatToExpectCard.jsx` (9KB)
- [x] 🤖 **Run Agent:** Create SessionNotesEditor component ✅
  - `/src/components/features/marketplace/SessionNotesEditor.jsx` (10KB)
- [x] Update router ✅
- [x] 🎭 **Playwright Test:** Tests in `tests/booking-flow.spec.cjs` ✅
- [x] 🔄 **COMMIT:** Booking Detail page complete

#### 3.4.3 Session Room Page ✅
**Route:** `/marketplace/bookings/:id/join`

- [x] 🤖 **Run Agent:** Create SessionRoomPage ✅
  - `/src/pages/applicant/SessionRoomPage.jsx` (16KB)
- [x] 🎭 **Playwright Test:** Tests in `tests/booking-flow.spec.cjs` ✅
- [x] 🔄 **COMMIT:** Session room page complete

#### 3.4.4 Leave Review Page ✅
**Route:** `/marketplace/bookings/:id/review`

- [x] 🤖 **Run Agent:** Create LeaveReviewPage with double-blind note ✅
  - `/src/pages/applicant/LeaveReviewPage.jsx` (15KB)
- [x] 🎭 **Playwright Test:** Tests in `tests/booking-flow.spec.cjs` ✅
- [x] 🔄 **COMMIT:** Leave review page complete

---

### 3.5 Messaging System (Week 3) ✅

#### 3.5.1 Pre-Booking Inquiries ✅
- [x] 🤖 **Run Agent:** Create InquiryComposer component ✅
  - `/src/components/features/messaging/InquiryComposer.jsx` (9KB)
- [x] 🤖 **Run Agent:** Create ConversationThread component with Supabase realtime ✅
  - `/src/components/features/messaging/ConversationThread.jsx` (10KB)
- [x] 🤖 **Run Agent:** Create MessageBubble component ✅
  - `/src/components/features/messaging/MessageBubble.jsx` (5KB)
- [x] 🤖 **Run Agent:** Create MessageInput component ✅
  - `/src/components/features/messaging/MessageInput.jsx` (5KB)
- [x] 🎭 **Playwright Test:** Tests in `tests/messaging.spec.cjs` ✅
- [x] 🔄 **COMMIT:** Messaging components complete

#### 3.5.2 Messages Page ✅
**Route:** `/marketplace/messages`

- [x] 🤖 **Run Agent:** Create MessagesPage
  ```
  Prompt: "Create /src/pages/applicant/MarketplaceMessagesPage.jsx with:
  - Conversation list (left panel)
  - Conversation thread (main area)
  - Filters: All, Unread, Inquiries, Active Bookings"
  ```
- [x] 🎭 **Playwright Test:** Create `tests/messaging.spec.cjs` (14 tests)
```javascript
test('messages page shows conversation list', async ({ page }) => {
  await page.goto('/marketplace/messages');
  await expect(page.getByTestId('conversation-list')).toBeVisible();
});

test('clicking conversation shows thread', async ({ page }) => {
  await page.goto('/marketplace/messages');
  await page.getByTestId('conversation-item').first().click();
  await expect(page.getByTestId('message-thread')).toBeVisible();
});
```
- [x] Run: `npx playwright test tests/messaging.spec.cjs` ✅ All passing
- [x] 🔄 **COMMIT:** Messages page complete

---

### 3.6 Notifications (Week 3) ✅

#### 3.6.1 In-App Notifications ✅
- [x] Verify `/src/hooks/useNotifications.js` exists ✅
- [x] Verify `/src/components/features/notifications/NotificationBell.jsx` exists ✅
- [x] Verify `/src/components/features/notifications/NotificationDropdown.jsx` exists ✅
- [x] Verify `/src/components/features/notifications/NotificationItem.jsx` exists ✅
- [x] Verify Header includes NotificationBell ✅
- [x] 🎭 **Playwright Test:** Create `tests/notifications.spec.cjs` (24 tests)
```javascript
import { test, expect } from '@playwright/test';

test('notification bell shows count', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page.getByTestId('notification-bell')).toBeVisible();
  await expect(page.getByTestId('notification-count')).toBeVisible();
});

test('clicking bell opens dropdown', async ({ page }) => {
  await page.goto('/dashboard');
  await page.getByTestId('notification-bell').click();
  await expect(page.getByTestId('notification-dropdown')).toBeVisible();
});
```
- [x] Run: `npx playwright test tests/notifications.spec.cjs` ✅ All passing
- [x] 🔄 **COMMIT:** Notifications UI verified

#### 3.6.2 Notifications Page ✅ COMPLETE
**Route:** `/notifications`

- [x] Verify `/src/pages/shared/NotificationsPage.jsx` exists ✅
- [x] Verify router has `/notifications` route ✅
- [x] 🎭 **Playwright Test:** Tests in `tests/notifications.spec.cjs` ✅
- [x] 🔄 **COMMIT:** Notifications page complete

---

### 3.7 Modals & Dialogs (Week 3-4) ✅

#### 3.7.1 Booking Modals ✅
- [x] 🤖 **Run Agent:** Create CancelBookingModal with refund policy
  ```
  Prompt: "Create /src/components/features/marketplace/CancelBookingModal.jsx with:
  - Refund policy display based on timing (48h+, 24-48h, <24h)
  - Show refund amount
  - Confirmation button"
  ```
- [x] 🤖 **Run Agent:** Create RescheduleModal
  ```
  Prompt: "Create /src/components/features/marketplace/RescheduleModal.jsx with new time selection and Cal.com reschedule integration."
  ```
- [x] 🎭 **Playwright Test:** Create `tests/booking-modals.spec.cjs` (30 tests)
```javascript
import { test, expect } from '@playwright/test';

test('cancel modal shows refund policy', async ({ page }) => {
  await page.goto('/marketplace/my-bookings');
  await page.getByRole('button', { name: /cancel/i }).first().click();
  await expect(page.getByText(/refund/i)).toBeVisible();
});
```
- [x] Run: `npx playwright test tests/booking-modals.spec.cjs` ✅ All passing
- [x] 🔄 **COMMIT:** Booking modals complete

#### 3.7.2 Account Gate Modal ✅
- [x] 🤖 **Run Agent:** Create AccountGateModal for non-logged-in booking attempts ✅
  ```
  Prompt: "Create /src/components/features/auth/AccountGateModal.jsx that triggers when non-logged-in user tries to book, with options: Free account, 7-day trial, Login. Include Stripe Elements for trial signup."
  ```
- [x] 🔄 **COMMIT:** Account gate modal complete

---

### 3.8 Gamification Integration (Week 4) ✅

#### 3.8.1 Add Marketplace Point Actions ✅
- [x] Update `supabase/migrations/` to add point actions: ✅
```sql
-- Created: supabase/migrations/20251213100000_marketplace_point_actions.sql
INSERT INTO point_actions (slug, label, description, base_points, daily_max) VALUES
  ('marketplace_book_session', 'Book a Mentoring Session', 'Awarded when booking a marketplace mentoring session', 10, NULL),
  ('marketplace_complete_session', 'Complete a Mentoring Session', 'Awarded when completing a mentoring session', 15, NULL),
  ('marketplace_leave_review', 'Leave a Session Review', 'Awarded for leaving a review after a mentoring session', 5, 3);
```
- [x] Update gamification hooks to award points on booking actions ✅ (Notes in migration file for dev team)
- [x] 🔄 **COMMIT:** Marketplace gamification points complete

---

### 3.9 Applicant QA (Week 4) ✅

#### 3.9.1 Manual Testing ⬜ (For Final QA)
- [ ] 🤖 **Run QA Agent:** "QA marketplace applicant pages"
- [ ] 🧪 **Test Flow:** Marketplace → Mentor Profile → Book → Pay → Confirmation
- [ ] 🧪 **Test Flow:** My Bookings → View Details → Session Notes → Join Session → Leave Review
- [ ] 🧪 **Test Flow:** Message Mentor → Book from conversation
- [ ] 🧪 **Test:** Notifications appear for booking events
- [ ] 🧪 **Test:** Service-specific intake forms show correct fields
- [ ] 🧪 **Test:** Session notes autosave works
- [ ] 🧪 **Test:** All pages at 375px, 768px, 1024px
- [ ] 🧪 **Test:** Empty states (no mentors, no bookings, no messages)

#### 3.9.2 Playwright E2E Tests ✅
- [x] 🎭 **Run all Playwright tests:**
```bash
npx playwright test tests/marketplace-browse.spec.cjs   # 16 tests ✅
npx playwright test tests/mentor-profile.spec.cjs      # 22 tests ✅
npx playwright test tests/booking-flow.spec.cjs        # 30 tests ✅
npx playwright test tests/my-bookings.spec.cjs         # 22 tests ✅
npx playwright test tests/messaging.spec.cjs           # 14 tests ✅
npx playwright test tests/notifications.spec.cjs       # 24 tests ✅
npx playwright test tests/booking-modals.spec.cjs      # 30 tests ✅
# Total: 158 tests - ALL PASSING ✅
```
- [x] Fix any failing tests (fixed 33 failures → 0)
- [ ] Log issues in `/docs/project/issues.md`
- [ ] Fix critical issues
- [x] 🔄 **COMMIT:** Playwright tests fixed and passing

---

### 3.10 Phase 3 Wrap-up ✅

- [x] Update `/docs/project/status.md` - mark Phase 3 Frontend complete ✅
- [x] 🔄 **COMMIT:** Phase 3 Marketplace Frontend complete
- [x] 🎉 **CELEBRATE!** Phase 3 Frontend done!

---

### Phase 3 Summary (Applicant Side)

| Category | Count |
|----------|-------|
| Pages | 11 |
| Components | 30+ |
| Hooks | 8 |
| Playwright Test Files | 9 |
| Mock Files | 7 |

**Routes Created:**
- `/marketplace` - Browse mentors (with personality previews)
- `/marketplace/mentor/:id` - Mentor profile (with "Get to Know Me" section)
- `/marketplace/mentor/:id/reviews` - All reviews
- `/marketplace/book/:serviceId` - 3-step booking with service-specific intake
- `/marketplace/bookings/:id` - Booking confirmation
- `/marketplace/bookings/:id/details` - Full booking detail with session notes (NEW)
- `/marketplace/my-bookings` - My bookings
- `/marketplace/bookings/:id/join` - Session room
- `/marketplace/bookings/:id/review` - Leave review
- `/marketplace/messages` - Marketplace messages
- `/notifications` - All notifications

---

# PHASE 4: Provider (SRNA) Marketplace Side ✅ FRONTEND COMPLETE

**Estimated Time:** 3-4 weeks | **Status:** ✅ ALL PAGES & TESTS COMPLETE (227 Playwright tests passing)

> **Key Additions:**
> - **"How It Works" landing page BEFORE signup** ✅
> - **Fun, vibe-forward profile questions** ✅ (major differentiator from TeachRN)
> - **AI-powered profile writing tips** ✅
> - Nursing license + student ID verification ✅
> - Onboarding progress widget with clear expectations ✅
> - Mentor-only BuddyBoss community (WordPress admin task pending)
> - Mentor resource library ✅
> - "Grow Your Practice" CTA ✅
> - Applicant summary view ✅
> - Vacation/pause mode ✅
> - Provider leave review page ✅
> - Performance insights ✅

---

## 4.0 Pre-Application Experience (Week 5) ✅ COMPLETE

> **Goal:** Make mentors feel confident and informed BEFORE they invest time in creating a profile.
> **Key Insight:** TeachRN takes 35% commission, has sterile profiles, and mentors can't differentiate themselves. We're different.

### 4.0.1 "Become a Mentor" Landing Page
**Route:** `/marketplace/become-a-mentor`

- [x] 🤖 **Run Agent:** "Create BecomeMentorLandingPage with clear expectations and fun vibe"
- [x] Create `/src/pages/srna/BecomeMentorLandingPage.jsx`

  **Section 1: Hero**
  - "Turn Your SRNA Experience Into Income"
  - Subhead: "Help aspiring CRNAs while earning extra money. Set your own hours, your own rates."
  - [Get Started] CTA button

  **Section 2: How It Works (Simple 4-Step Visual)**
  ```
  1. Apply (5 min) → 2. Set Up Profile → 3. Accept Bookings → 4. Get Paid
  ```
  - Each step expands on click/hover with details

  **Section 3: Crystal Clear Expectations**
  - **You're an independent contractor** - You run your own mentoring business
  - **Commission: 20%** - You keep 80%, we handle payments and the platform
    - Example: "$100 session = $80 in your pocket"
    - Compare: "Other platforms take 35%+"
  - **You provide your own Zoom/video link** - We don't host video calls
  - **You're responsible for your own taxes** - 1099 at year end
  - **48 hours to respond to requests** - Keep response time high to rank well
  - **Set your own prices** - We suggest ranges but you decide
  - **Payouts every 2 weeks** - Direct to your bank account

  **Section 4: What Makes CRNA Club Different**
  - 🎨 **Stand out with personality** - Fun profile questions help applicants find mentors they vibe with
  - 💰 **Keep more of what you earn** - 20% vs industry 35%
  - 📈 **Built-in audience** - 8,000+ engaged CRNA applicants in our community
  - 🤝 **Mentor community** - Private forum, resources, templates to help you succeed
  - 📱 **Modern platform** - Mobile-friendly, real-time messaging, easy scheduling

  **Section 5: FAQ Accordion**
  - "How much can I realistically earn?"
  - "How long does approval take?" (2-3 business days)
  - "Do I need to be a CRNA?" (No, current SRNAs only)
  - "What services can I offer?" (Mock interviews, essay reviews, coaching, Q&A calls)
  - "How do I get paid?" (Stripe - direct deposit every 2 weeks)
  - "What if I need to take a break?" (Easy vacation mode)
  - "Can I message clients off-platform?" (No - for your protection)
  - "What if a client doesn't show up?" (You still get paid)

  **Section 6: Ready to Start?**
  - "Sounds good? Ready to get started?"
  - [Start My Application] button → `/marketplace/provider/apply`
  - "Application takes about 5 minutes. We'll review within 2-3 business days."

- [x] 🤖 **Run Agent:** "Create HowItWorksSteps component"
- [x] Create `/src/components/features/provider/HowItWorksSteps.jsx`
- [x] 🤖 **Run Agent:** "Create ExpectationsCard component"
- [x] Create `/src/components/features/provider/ExpectationsCard.jsx`
- [x] 🤖 **Run Agent:** "Create MentorFAQ component with accordion"
- [x] Create `/src/components/features/provider/MentorFAQ.jsx`
- [x] 🎭 **Playwright Test:** Create `tests/become-mentor.spec.cjs`
```javascript
test('become mentor page shows commission clearly', async ({ page }) => {
  await page.goto('/marketplace/become-a-mentor');
  await expect(page.getByText(/20%/)).toBeVisible();
  await expect(page.getByText(/you keep 80%/i)).toBeVisible();
});

test('become mentor page shows FAQ', async ({ page }) => {
  await page.goto('/marketplace/become-a-mentor');
  await expect(page.getByText(/how much can i/i)).toBeVisible();
  await page.getByText(/how much can i/i).click();
  // FAQ answer expands
  await expect(page.getByText(/realistic/i)).toBeVisible();
});

test('start application button navigates to apply page', async ({ page }) => {
  await page.goto('/marketplace/become-a-mentor');
  await page.getByRole('button', { name: /start my application/i }).click();
  await expect(page).toHaveURL(/\/marketplace\/provider\/apply/);
});
```
- [x] Run: `npx playwright test tests/become-mentor.spec.cjs` ✅ All passing
- [x] 🔄 **COMMIT:** Become a Mentor landing page complete

---

## 4.1 Provider Application Flow (Week 5) ✅ COMPLETE

### 4.1.1 Provider Application Page
**Route:** `/marketplace/provider/apply`

- [x] 🤖 **Run Agent:** "Create ProviderApplicationPage with license verification"
- [x] Create `/src/pages/srna/ProviderApplicationPage.jsx`

  **Step 1: Eligibility Check**
  - "Are you currently enrolled in a CRNA program?"
  - Yes → Continue | No → "Sorry, mentors must be current SRNAs"

  **Step 2: Basic Info**
  - Personal info (name, email)
  - **Photo Upload** (required - friendly face photo, not formal headshot)
    - AI tip: "Smile! Applicants want to see the real you."
  - **Student ID Upload** (required - image or PDF)
  - **RN License Number** (required)
  - **License State** (dropdown)

  **Step 3: Program Info**
  - CRNA program name (dropdown of 140+ schools)
  - Year in program (1st, 2nd, 3rd)
  - Expected graduation date
  - ICU background (type, years)

  **Step 4: Services & Motivation**
  - What services are you interested in offering? (checkboxes)
    - Mock interviews, Essay review, Coaching, General Q&A
  - Why do you want to be a mentor? (200-500 chars)
    - AI tip: "Be genuine! Share what excites you about helping applicants."

  **Step 5: Terms & Submit**
  - Terms agreement checkboxes:
    - [ ] I understand I'm an independent contractor
    - [ ] I understand CRNA Club takes 20% commission
    - [ ] I will provide my own video call link (Zoom/Meet)
    - [ ] I am responsible for my own taxes (1099)
    - [ ] I will respond to requests within 48 hours
  - Submit button
  - **Auto-verify license via Nursys API on submit**

- [x] 🤖 **Run Agent:** "Create ApplicationStepIndicator component"
- [x] Create `/src/components/features/provider/ApplicationStepIndicator.jsx`
- [x] 🤖 **Run Agent:** "Create PhotoUpload component with AI tips"
- [x] Create `/src/components/features/provider/PhotoUpload.jsx`
- [x] 🤖 **Run Agent:** "Create StudentIdUpload component"
- [x] Create `/src/components/features/provider/StudentIdUpload.jsx`
- [x] 🎭 **Playwright Test:** Create `tests/provider-application.spec.cjs`
```javascript
test('application requires student ID and license', async ({ page }) => {
  await page.goto('/marketplace/provider/apply');
  await expect(page.getByLabel('Student ID')).toBeVisible();
  await expect(page.getByLabel('RN License Number')).toBeVisible();
  await expect(page.getByLabel('License State')).toBeVisible();
});

test('application shows terms checkboxes', async ({ page }) => {
  await page.goto('/marketplace/provider/apply');
  // Navigate to terms step
  await expect(page.getByText(/independent contractor/i)).toBeVisible();
  await expect(page.getByText(/20% commission/i)).toBeVisible();
});

test('application validates required fields', async ({ page }) => {
  await page.goto('/marketplace/provider/apply');
  await page.getByRole('button', { name: /submit/i }).click();
  await expect(page.getByText(/required/i)).toBeVisible();
});
```
- [x] Run: `npx playwright test tests/provider-application.spec.cjs` ✅ All passing
- [x] 🔄 **COMMIT:** Provider application page complete

### 4.1.2 Application Status Page
**Route:** `/marketplace/provider/application-status`

- [x] 🤖 **Run Agent:** "Create ApplicationStatusPage"
- [x] Create `/src/pages/srna/ApplicationStatusPage.jsx`
  - Pending: "Your application is under review (typically 2-3 business days)"
  - Approved: Redirect to onboarding
  - Rejected: Show reason + reapply option (30-day wait)
  - Show license verification status
- [x] 🔄 **COMMIT:** Application status page complete

---

## 4.2 Provider Onboarding (Week 5) ✅ COMPLETE

### 4.2.1 Onboarding Progress Widget
- [x] 🤖 **Run Agent:** "Create OnboardingProgressWidget component"
- [x] Create `/src/components/features/provider/OnboardingProgressWidget.jsx`
  - Visual progress: Application → Profile → Services → Availability → Stripe
  - Current step highlighted
  - "Next: [action]" prompt
  - Persists at top of onboarding pages

### 4.2.2 Onboarding Wizard
**Route:** `/marketplace/provider/onboarding`

- [x] 🤖 **Run Agent:** "Create ProviderOnboardingPage with progress widget"
- [x] Create `/src/pages/srna/ProviderOnboardingPage.jsx` (multi-step wizard)
  - Include OnboardingProgressWidget at top

#### Step 1: Your Profile - Professional + Personality
- [x] 🤖 **Run Agent:** "Create OnboardingStep1Profile with fun personality questions"
- [x] Create `/src/components/features/provider/OnboardingStep1Profile.jsx`

  **Professional Section:**
  - Tagline (50-100 chars) - AI tip: "Example: 'Making ICU to SRNA transitions less scary!'"
  - Extended bio (200-500 words) - AI tip: "Share your journey! What made you pursue CRNA?"
  - ICU background (type + years)
  - Specializations/tags (checkboxes)

  **Fun "Get to Know Me" Section (Major Differentiator!):**
  > These questions help applicants find mentors they VIBE with.
  > All optional but strongly encouraged. Shows in profile as fun cards.

  - **"If you knew me, you'd know that..."** (free text, 100 chars max)
    - Example: "I'm obsessed with coffee and can talk about hemodynamics for hours"
  - **"My astrological sign is..."** (dropdown: Aries through Pisces + "I don't believe in that 😂")
  - **"My ICU vibe is..."** (dropdown: Organized chaos, Silent efficiency, Coffee-fueled heroics, Teaching every moment)
  - **"Cats or dogs?"** (radio: Cats 🐱, Dogs 🐕, Both!, Neither)
  - **"My favorite patient population to care for is..."** (free text, 50 chars)
    - Example: "Neuro patients - the brain fascinates me!"
  - **"If I drove you on a road trip, we'd be listening to..."** (free text, 75 chars)
    - Example: "True crime podcasts and 2000s pop bangers"
  - **"A weird fact about me:"** (free text, 150 chars)
    - Example: "I can name every Friends episode by the opening scene"
  - **"My comfort food is..."** (free text, 50 chars)
  - **"When I'm not studying, you'll find me..."** (free text, 100 chars)
  - **"My motto/mantra is..."** (free text, 100 chars)
    - Example: "Done is better than perfect"

  **Profile Preview:** Live preview on right side showing how applicants will see them

- [x] 🤖 **Run Agent:** "Create PersonalityQuestions component with fun UI"
- [x] Create `/src/components/features/provider/PersonalityQuestions.jsx`
  - Fun card-style layout
  - Icons/emojis for each question
  - Character counters
  - Optional badges ("Fill 5+ to unlock 'Personality Pro' badge!")
- [x] 🤖 **Run Agent:** "Create ProfilePreviewPanel component"
- [x] Create `/src/components/features/provider/ProfilePreviewPanel.jsx`
  - Real-time preview as mentor fills out profile
  - Toggle: "View as applicant"

#### Step 2: Your Services
- [x] 🤖 **Run Agent:** "Create OnboardingStep2Services with templates and AI tips"
- [x] Create `/src/components/features/provider/OnboardingStep2Services.jsx`

  **For each service type (Mock Interview, Essay Review, Coaching, Q&A Call):**
  - Enable/disable toggle
  - **Pre-filled template** - one-click to use suggested description
  - Custom description editor with AI tips:
    - AI tip: "Be specific! Instead of 'I'll help with your essay', try 'I'll give detailed feedback on story structure, authenticity, and how to stand out'"
  - Price ($) with suggested range shown
    - AI tip: "Average mock interview price: $75-150. Start lower to build reviews!"
  - Duration (30min, 45min, 60min, 90min)
  - **Deliverables checklist** (what you'll provide):
    - Mock Interview: □ Real-time feedback □ Written summary □ Recording □ Follow-up Q&A
    - Essay Review: □ Inline comments □ Summary feedback □ Revision suggestions □ Second review
  - **Instant Book toggle** per service
    - Explanation: "Allow applicants to book instantly without approval"

- [x] 🤖 **Run Agent:** "Create ServiceTemplates component"
- [x] Create `/src/components/features/provider/ServiceTemplates.jsx`
  - Pre-written descriptions for each service type
  - One-click "Use this template" button
  - Customizable after selection

#### Step 3: Availability & Video
- [x] 🤖 **Run Agent:** "Create OnboardingStep3Availability component"
- [x] Create `/src/components/features/provider/OnboardingStep3Availability.jsx`
  - Weekly availability grid (drag to select hours)
  - Timezone auto-detect + picker
  - Buffer between bookings (15min, 30min)
  - Minimum notice time (24h, 48h, 72h)
  - Booking model: Instant Book vs Request-Only (global default)
  - Cancellation policy selection (Flexible/Moderate/Strict)
    - Show what each means
  - **Video call link** (Zoom/Meet URL) - REQUIRED
    - Helper: "Don't have Zoom? [Get free account]"
    - Validation: Must be valid Zoom or Meet URL

#### Step 4: Get Paid
- [x] 🤖 **Run Agent:** "Create OnboardingStep4Stripe component"
- [x] Create `/src/components/features/provider/OnboardingStep4Stripe.jsx`
  - Stripe Connect Express onboarding
  - Bank account setup
  - **Commission breakdown clearly shown:**
    - "You set your price: $100"
    - "Platform fee (20%): $20"
    - "You receive: $80"
  - Payout schedule: "Every 2 weeks, direct to your bank"
  - Tax reminder: "You'll receive a 1099 for tax reporting"

#### Step 5: Review & Launch
- [x] 🤖 **Run Agent:** "Create OnboardingStep5Review component"
- [x] Create `/src/components/features/provider/OnboardingStep5Review.jsx`
  - Full profile preview (as applicant will see it)
  - Services summary with prices
  - Availability summary
  - Checklist of what's complete vs incomplete
  - "Launch My Profile" button
  - Post-launch: Confetti! 🎉 "You're live! Share your profile link."

- [x] 🎭 **Playwright Test:** Create `tests/provider-onboarding.spec.cjs`
```javascript
test('onboarding shows progress widget', async ({ page }) => {
  await page.goto('/marketplace/provider/onboarding');
  await expect(page.getByTestId('onboarding-progress')).toBeVisible();
});

test('profile step shows personality questions', async ({ page }) => {
  await page.goto('/marketplace/provider/onboarding');
  await expect(page.getByText(/if you knew me/i)).toBeVisible();
  await expect(page.getByText(/cats or dogs/i)).toBeVisible();
});

test('can complete profile step with personality', async ({ page }) => {
  await page.goto('/marketplace/provider/onboarding');
  await page.getByLabel('Tagline').fill('Mock interview expert');
  await page.getByLabel('Bio').fill('I love helping applicants succeed...');
  await page.getByLabel(/if you knew me/i).fill('I drink way too much coffee');
  await page.getByRole('button', { name: /next/i }).click();
  await expect(page.getByText(/services/i)).toBeVisible();
});

test('services step shows AI tips', async ({ page }) => {
  await page.goto('/marketplace/provider/onboarding?step=2');
  await expect(page.getByText(/be specific/i)).toBeVisible();
});

test('services step shows template option', async ({ page }) => {
  await page.goto('/marketplace/provider/onboarding?step=2');
  await expect(page.getByRole('button', { name: /use this template/i })).toBeVisible();
});

test('availability step requires video link', async ({ page }) => {
  await page.goto('/marketplace/provider/onboarding?step=3');
  await page.getByRole('button', { name: /next/i }).click();
  await expect(page.getByText(/video link required/i)).toBeVisible();
});

test('payment step shows commission breakdown', async ({ page }) => {
  await page.goto('/marketplace/provider/onboarding?step=4');
  await expect(page.getByText(/you receive.*80/i)).toBeVisible();
  await expect(page.getByText(/platform fee.*20/i)).toBeVisible();
});

test('review step shows launch button', async ({ page }) => {
  await page.goto('/marketplace/provider/onboarding?step=5');
  await expect(page.getByRole('button', { name: /launch my profile/i })).toBeVisible();
});
```
- [x] Run: `npx playwright test tests/provider-onboarding.spec.cjs` ✅ All passing
- [x] 🔄 **COMMIT:** Provider onboarding wizard complete

---

## 4.3 Provider Dashboard (Week 5-6) ✅ COMPLETE

### 4.3.1 Provider Dashboard
**Route:** `/marketplace/provider/dashboard`

- [x] 🤖 **Run Agent:** "Create ProviderDashboardPage with growth CTA and community link"
- [x] Create `/src/pages/srna/ProviderDashboardPage.jsx`
  - **OnboardingProgressWidget** (if onboarding incomplete)
  - Incoming requests widget (count + preview)
  - Upcoming sessions widget (next 3)
  - Earnings summary widget (this month, available)
  - Rating display
  - **"Grow Your Practice" CTA widget** (NEW)
  - Quick actions (Edit profile, Update services, View calendar)
- [x] 🤖 **Run Agent:** "Create IncomingRequestsWidget component"
- [x] Create `/src/components/features/provider/IncomingRequestsWidget.jsx`
  - Show countdown: "48 hours to respond"
- [x] 🤖 **Run Agent:** "Create UpcomingSessionsWidget component"
- [x] Create `/src/components/features/provider/UpcomingSessionsWidget.jsx`
- [x] 🤖 **Run Agent:** "Create EarningsSummaryWidget component"
- [x] Create `/src/components/features/provider/EarningsSummaryWidget.jsx`
- [x] 🤖 **Run Agent:** "Create GrowYourPracticeCTA component"
- [x] Create `/src/components/features/provider/GrowYourPracticeCTA.jsx`
  - Checklist:
    - □ Post in the forums (2 pts each)
    - □ Answer questions in groups (2 pts each)
    - □ Host a live Q&A call (10 pts)
    - □ Share your profile on social media
  - [Go to Community] button → links to BuddyBoss mentor group
  - [Download Social Templates] button → links to Canva templates
- [x] Update router
- [x] 🎭 **Playwright Test:** Create `tests/provider-dashboard.spec.cjs`
```javascript
test('provider dashboard shows all widgets', async ({ page }) => {
  await page.goto('/marketplace/provider/dashboard');
  await expect(page.getByTestId('incoming-requests-widget')).toBeVisible();
  await expect(page.getByTestId('upcoming-sessions-widget')).toBeVisible();
  await expect(page.getByTestId('earnings-widget')).toBeVisible();
  await expect(page.getByTestId('grow-your-practice')).toBeVisible();
});

test('grow your practice links to community', async ({ page }) => {
  await page.goto('/marketplace/provider/dashboard');
  await page.getByRole('button', { name: /go to community/i }).click();
  // Should navigate to BuddyBoss mentor group
});
```
- [x] Run: `npx playwright test tests/provider-dashboard.spec.cjs` ✅ All passing
- [x] 🔄 **COMMIT:** Provider dashboard complete

---

## 4.4 Incoming Requests (Week 6) ✅ COMPLETE

### 4.4.1 Incoming Requests Page
**Route:** `/marketplace/provider/requests`

- [x] 🤖 **Run Agent:** "Create ProviderRequestsPage with 48h countdown"
- [x] Create `/src/pages/srna/ProviderRequestsPage.jsx`
  - List of pending booking requests
  - **Countdown timer per request (48h to respond)**
  - Nudge at 24h remaining
- [x] 🤖 **Run Agent:** "Create RequestCard with applicant summary"
- [x] Create `/src/components/features/provider/RequestCard.jsx`
  - **Applicant Summary Card** (NEW):
    - Target programs
    - ICU experience
    - GPA (if shared)
    - Stage: "Actively applying"
    - Previous sessions with this applicant
    - [View Full Profile] link (if CRNA Club member)
  - Service requested + price (you get $X after commission)
  - Context/notes from applicant (service-specific intake)
  - Materials download links
  - Preferred times list
  - Actions: Accept, Decline, Propose Alternative
- [x] 🤖 **Run Agent:** "Create ApplicantSummaryCard component"
- [x] Create `/src/components/features/provider/ApplicantSummaryCard.jsx`
  - Pulls from applicant's MyStats if member
  - Shows previous session history with this mentor
- [x] 🤖 **Run Agent:** "Create AcceptRequestModal component"
- [x] Create `/src/components/features/provider/AcceptRequestModal.jsx`
  - Choose from applicant's proposed times
  - Optional message
  - **Note: "Payment will be charged when you accept"**
- [x] 🤖 **Run Agent:** "Create DeclineRequestModal component"
- [x] Create `/src/components/features/provider/DeclineRequestModal.jsx`
  - Reason dropdown (optional)
  - Message to applicant
- [x] 🤖 **Run Agent:** "Create ProposeAlternativeModal component"
- [x] Create `/src/components/features/provider/ProposeAlternativeModal.jsx`
  - Calendar picker for new times
  - Message to applicant
- [x] 🎭 **Playwright Test:** Create `tests/provider-requests.spec.cjs`
```javascript
test('request card shows 48h countdown', async ({ page }) => {
  await page.goto('/marketplace/provider/requests');
  await expect(page.getByText(/hours to respond/i)).toBeVisible();
});

test('request card shows applicant summary', async ({ page }) => {
  await page.goto('/marketplace/provider/requests');
  await expect(page.getByTestId('applicant-summary')).toBeVisible();
  await expect(page.getByText(/target programs/i)).toBeVisible();
});

test('accept modal shows payment note', async ({ page }) => {
  await page.goto('/marketplace/provider/requests');
  await page.getByRole('button', { name: /accept/i }).first().click();
  await expect(page.getByText(/payment will be charged/i)).toBeVisible();
});
```
- [x] Run: `npx playwright test tests/provider-requests.spec.cjs` ✅ All passing
- [x] 🔄 **COMMIT:** Incoming requests page complete

---

## 4.5 Provider Bookings (Week 6) ✅ COMPLETE

### 4.5.1 Provider Bookings Page
**Route:** `/marketplace/provider/bookings`

- [x] 🤖 **Run Agent:** "Create ProviderBookingsPage with calendar view"
- [x] Create `/src/pages/srna/ProviderBookingsPage.jsx`
  - Tabs: Upcoming, Past
  - View toggle: Calendar / List
- [x] 🤖 **Run Agent:** "Create ProviderBookingCard component"
- [x] Create `/src/components/features/provider/ProviderBookingCard.jsx`
  - Applicant summary (first name, target programs)
  - Service, time, materials
  - Join video button (5 min before)
  - Reschedule, Cancel, Mark Complete actions
  - **Leave Review button** (after session)
- [x] 🤖 **Run Agent:** "Create BookingsCalendarView component"
- [x] Create `/src/components/features/provider/BookingsCalendarView.jsx`
  - Month/week/day views
  - Sessions as blocks
- [x] 🎭 **Playwright Test:** Create `tests/provider-bookings.spec.cjs`
```javascript
test('provider bookings shows calendar and list views', async ({ page }) => {
  await page.goto('/marketplace/provider/bookings');
  await expect(page.getByRole('button', { name: /calendar/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /list/i })).toBeVisible();
});
```
- [x] Run: `npx playwright test tests/provider-bookings.spec.cjs` ✅ All passing
- [x] 🔄 **COMMIT:** Provider bookings page complete

### 4.5.2 Provider Leave Review Page (NEW)
**Route:** `/marketplace/provider/bookings/:id/review`

- [x] 🤖 **Run Agent:** "Create ProviderLeaveReviewPage for double-blind reviews"
- [x] Create `/src/pages/srna/ProviderLeaveReviewPage.jsx`
  - Booking summary
  - Star rating (1-5)
  - Written feedback (optional, 10-500 chars)
  - Tags: Prepared, Engaged, Professional, Responsive
  - Private notes (admin-only, not shown to applicant)
  - Double-blind explanation: "Your review will be visible to other mentors after 14 days or when applicant also reviews"
- [x] 🎭 **Playwright Test:** Add to `tests/provider-bookings.spec.cjs`
```javascript
test('provider can leave review', async ({ page }) => {
  await page.goto('/marketplace/provider/bookings/test-booking-1/review');
  await expect(page.getByLabel('Rating')).toBeVisible();
  await expect(page.getByText(/visible to other mentors/i)).toBeVisible();
});
```
- [x] 🔄 **COMMIT:** Provider leave review page complete

---

## 4.6 Provider Services & Availability (Week 6) ✅ COMPLETE

### 4.6.1 Services Management Page
**Route:** `/marketplace/provider/services`

- [x] 🤖 **Run Agent:** "Create ProviderServicesPage"
- [x] Create `/src/pages/srna/ProviderServicesPage.jsx`
  - List of services with stats (bookings, rating)
  - Enable/disable toggle per service
  - Instant Book toggle per service
- [x] 🤖 **Run Agent:** "Create EditServiceSheet component"
- [x] Create `/src/components/features/provider/EditServiceSheet.jsx`
  - All service fields editable
  - Deliverables checklist
- [x] 🎭 **Playwright Test:** Create `tests/provider-services.spec.cjs` ✅ (17 tests)
```javascript
test('can toggle service availability', async ({ page }) => {
  await page.goto('/marketplace/provider/services');
  await page.getByTestId('service-toggle').first().click();
  await expect(page.getByText(/disabled/i)).toBeVisible();
});
```
- [x] Run: `npx playwright test tests/provider-services.spec.cjs` ✅ All passing
- [x] 🔄 **COMMIT:** Provider services page complete

### 4.6.2 Availability Settings Page (with Vacation Mode)
**Route:** `/marketplace/provider/availability`

- [x] 🤖 **Run Agent:** "Create ProviderAvailabilityPage with vacation mode"
- [x] Create `/src/pages/srna/ProviderAvailabilityPage.jsx`
  - Weekly hours grid
  - Blocked dates picker
  - Timezone display
  - Booking preferences
  - **Vacation/Pause Mode** (NEW):
    - "I'm unavailable for new bookings" toggle
    - Vacation date range picker
    - Auto-response message for inquiries
    - List of existing bookings during pause
  - **Calendar Sync** (NEW):
    - "Connect Google Calendar" button
    - "Connect Outlook Calendar" button
- [x] 🤖 **Run Agent:** "Create WeeklyAvailabilityGrid component"
- [x] Create `/src/components/features/provider/WeeklyAvailabilityGrid.jsx`
- [x] 🤖 **Run Agent:** "Create BlockedDatesCalendar component"
- [x] Create `/src/components/features/provider/BlockedDatesCalendar.jsx`
- [x] 🤖 **Run Agent:** "Create VacationModeSettings component"
- [x] Create `/src/components/features/provider/VacationModeSettings.jsx`
- [x] 🎭 **Playwright Test:** Create `tests/provider-availability.spec.js`
```javascript
test('vacation mode settings visible', async ({ page }) => {
  await page.goto('/marketplace/provider/availability');
  await expect(page.getByText(/vacation mode/i)).toBeVisible();
  await expect(page.getByLabel(/auto-response/i)).toBeVisible();
});

test('can enable pause mode', async ({ page }) => {
  await page.goto('/marketplace/provider/availability');
  await page.getByLabel(/unavailable for new bookings/i).check();
  await expect(page.getByText(/you are paused/i)).toBeVisible();
});
```
- [x] Run: `npx playwright test tests/provider-availability.spec.cjs` ✅ (20 tests) All passing
- [x] 🔄 **COMMIT:** Provider availability page complete

---

## 4.7 Provider Earnings (Week 6) ✅ COMPLETE

### 4.7.1 Earnings Dashboard
**Route:** `/marketplace/provider/earnings`

- [x] 🤖 **Run Agent:** "Create ProviderEarningsPage"
- [x] Create `/src/pages/srna/ProviderEarningsPage.jsx`
  - Summary cards: Total earned, Available, This month, Next payout
  - Earnings table with filters
  - Payout history
  - Link to Stripe Express dashboard
- [x] 🤖 **Run Agent:** "Create EarningsTable component"
- [x] Create `/src/components/features/provider/EarningsTable.jsx`
- [x] 🤖 **Run Agent:** "Create PayoutHistoryList component"
- [x] Create `/src/components/features/provider/PayoutHistoryList.jsx`
- [x] 🎭 **Playwright Test:** Create `tests/provider-earnings.spec.js`
```javascript
test('earnings page shows summary cards', async ({ page }) => {
  await page.goto('/marketplace/provider/earnings');
  await expect(page.getByText(/total earned/i)).toBeVisible();
  await expect(page.getByText(/next payout/i)).toBeVisible();
});
```
- [x] Run: `npx playwright test tests/provider-earnings.spec.cjs` ✅ (28 tests) All passing
- [x] 🔄 **COMMIT:** Provider earnings page complete

---

## 4.8 Provider Profile & Insights (Week 6) ✅ COMPLETE

### 4.8.1 Edit Public Profile
**Route:** `/marketplace/provider/profile`

- [x] 🤖 **Run Agent:** "Create ProviderProfilePage with preview"
- [x] Create `/src/pages/srna/ProviderProfilePage.jsx`
  - All public-facing fields
  - **Profile preview** (show how it looks to applicants)
- [x] 🤖 **Run Agent:** "Create ProfilePreview component"
- [x] Create `/src/components/features/provider/ProfilePreview.jsx`
- [x] 🎭 **Playwright Test:** Create `tests/provider-profile.spec.cjs` ✅ (23 tests)
- [x] Run: `npx playwright test tests/provider-profile.spec.cjs` ✅ All passing
- [x] 🔄 **COMMIT:** Provider profile editor complete

### 4.8.2 Performance Insights (NEW)
**Route:** `/marketplace/provider/insights`

- [x] 🤖 **Run Agent:** "Create ProviderInsightsPage with analytics"
- [x] Create `/src/pages/srna/ProviderInsightsPage.jsx`
  - Profile views (this week, this month, all-time)
  - Inquiry rate (% of views that lead to messages)
  - Booking conversion (% of inquiries that book)
  - Average response time
  - Rating trend (chart over last 6 months)
  - Top services (which get booked most)
  - Repeat clients (% who rebook)
- [x] 🎭 **Playwright Test:** Create `tests/provider-insights.spec.cjs` ✅ (22 tests)
```javascript
test('insights page shows metrics', async ({ page }) => {
  await page.goto('/marketplace/provider/insights');
  await expect(page.getByText(/profile views/i)).toBeVisible();
  await expect(page.getByText(/booking conversion/i)).toBeVisible();
});
```
- [x] Run: `npx playwright test tests/provider-insights.spec.cjs` ✅ All passing
- [x] 🔄 **COMMIT:** Provider insights page complete

---

## 4.9 Mentor Ecosystem (Week 6-7) 🟡 PARTIAL

### 4.9.1 Mentor-Only BuddyBoss Community
- [ ] In WordPress Admin:
  - Create BuddyBoss group: "CRNA Club Mentors" (hidden/private)
  - Set up auto-add on provider approval
- [x] Add link in Provider Dashboard: "Go to Mentor Community" ✅ (Link in GrowYourPracticeCTA)
- [ ] 🔄 **COMMIT:** Configure mentor BuddyBoss group (WordPress admin task)

### 4.9.2 Mentor Resource Library ✅ COMPLETE
**Route:** `/marketplace/provider/resources`

- [x] 🤖 **Run Agent:** "Create MentorResourcesPage"
- [x] Create `/src/pages/srna/MentorResourcesPage.jsx`
  - Video trainings section
  - PDF guides section
  - Templates section
  - Social media marketing kit
- [x] Create Supabase Storage bucket: `mentor-resources` ✅ (Created via Supabase Dashboard)
- [x] Upload initial resources: (Placeholders ready - actual content upload pending)
  - [x] Video: "How to Conduct a Mock Interview"
  - [x] Video: "Giving Constructive Feedback"
  - [x] PDF: "Customer Service Best Practices"
  - [x] PDF: "Setting Expectations with Clients"
  - [x] Template: Session notes template
  - [x] Template: Feedback form template
  - [x] Canva Instagram story templates (link)
  - [x] Profile share graphics
- [x] 🎭 **Playwright Test:** Create `tests/mentor-resources.spec.cjs` ✅ (27 tests)
```javascript
test('resources page shows categories', async ({ page }) => {
  await page.goto('/marketplace/provider/resources');
  await expect(page.getByText(/video trainings/i)).toBeVisible();
  await expect(page.getByText(/templates/i)).toBeVisible();
  await expect(page.getByText(/social media/i)).toBeVisible();
});
```
- [x] Run: `npx playwright test tests/mentor-resources.spec.cjs` ✅ All passing
- [x] 🔄 **COMMIT:** Mentor resources page complete

---

## 4.10 Provider QA (Week 7) ✅ PLAYWRIGHT TESTS COMPLETE

### 4.10.1 Manual Testing ⬜ (For Final QA)
- [ ] 🤖 **Run QA Agent:** "QA marketplace provider pages"
- [ ] 🧪 **Test Flow:** Apply (with license + student ID) → Approved → Onboarding → Dashboard
- [ ] 🧪 **Test Flow:** Receive Request (see applicant summary) → Accept (48h) → Session → Mark Complete → Leave Review
- [ ] 🧪 **Test Flow:** Edit Services → Change Availability → Enable Vacation Mode
- [ ] 🧪 **Test Flow:** View Earnings → Payout History
- [ ] 🧪 **Test Flow:** View Insights → Check metrics
- [ ] 🧪 **Test Flow:** Access Mentor Community → View Resources
- [ ] 🧪 **Test:** Onboarding progress widget shows correct state
- [ ] 🧪 **Test:** "Grow Your Practice" CTA links work
- [ ] 🧪 **Test:** All pages at 375px, 768px, 1024px

### 4.10.2 Playwright E2E Tests ✅ ALL PASSING (227 tests)
- [x] 🎭 **Run all provider Playwright tests:**
```bash
npx playwright test tests/become-mentor.spec.cjs       # 17 tests ✅
npx playwright test tests/provider-application.spec.cjs # 16 tests ✅
npx playwright test tests/provider-onboarding.spec.cjs  # 17 tests ✅
npx playwright test tests/provider-dashboard.spec.cjs   # 12 tests ✅
npx playwright test tests/provider-requests.spec.cjs    # 10 tests ✅
npx playwright test tests/provider-bookings.spec.cjs    # 18 tests ✅
npx playwright test tests/provider-services.spec.cjs    # 17 tests ✅
npx playwright test tests/provider-availability.spec.cjs # 20 tests ✅
npx playwright test tests/provider-earnings.spec.cjs    # 28 tests ✅
npx playwright test tests/provider-profile.spec.cjs     # 23 tests ✅
npx playwright test tests/provider-insights.spec.cjs    # 22 tests ✅
npx playwright test tests/mentor-resources.spec.cjs     # 27 tests ✅
```
- [x] Fix any failing tests ✅ (Fixed route param :bookingId → :id in router.jsx)
- [ ] Log issues in `/docs/project/issues.md`
- [ ] Fix critical issues
- [x] 🔄 **COMMIT:** Phase 4 provider Playwright tests complete

---

## 4.11 Phase 4 Wrap-up ✅

- [x] All provider pages built ✅
- [x] All provider components built ✅
- [x] All Playwright tests passing (227 tests) ✅
- [x] 🔄 **COMMIT:** Phase 4 Provider Side complete
- [x] 🎉 **CELEBRATE!** Phase 4 done!

---

### Phase 4 Summary (Provider Side)

| Category | Count |
|----------|-------|
| Pages | 14 |
| Components | 40+ |
| Playwright Test Files | 11 |

**Key Differentiators from TeachRN:**
- 20% commission vs 35%
- Fun personality questions for vibe-matching
- Clear expectations BEFORE signup
- AI-powered profile writing tips
- Service templates with deliverables
- Mentor community + resources
- Live profile preview during onboarding

**Routes Created:**
- `/marketplace/become-a-mentor` - **Landing page with clear expectations (NEW)**
- `/marketplace/provider/apply` - Provider application with license verification
- `/marketplace/provider/application-status` - Application status
- `/marketplace/provider/onboarding` - **5-step onboarding with personality questions (ENHANCED)**
- `/marketplace/provider/dashboard` - Provider command center with "Grow" CTA
- `/marketplace/provider/requests` - Incoming booking requests with applicant summary
- `/marketplace/provider/bookings` - Confirmed sessions
- `/marketplace/provider/bookings/:id/review` - Provider leave review (NEW)
- `/marketplace/provider/services` - Manage service offerings
- `/marketplace/provider/availability` - Set availability with vacation mode
- `/marketplace/provider/earnings` - Earnings & payouts
- `/marketplace/provider/profile` - Edit public profile with preview + personality
- `/marketplace/provider/insights` - Performance analytics (NEW)
- `/marketplace/provider/resources` - Training & templates (NEW)

---

# PHASE 4.5: Admin Marketplace Management

**Estimated Time:** 1-2 weeks

---

## 4.5.1 Admin Dashboard
**Route:** `/admin/marketplace`

- [x] 🤖 **Run Agent:** "Create AdminMarketplaceDashboard"
- [x] Create `/src/pages/admin/AdminMarketplaceDashboard.jsx`
  - Key metrics: Active providers, Pending applications, Active bookings, Revenue
  - Charts: Bookings over time, Revenue over time
  - Quick links to queues
- [x] 🔄 **COMMIT:** `git add . && git commit -m "Add admin marketplace dashboard"`

## 4.5.2 Provider Applications Queue
**Route:** `/admin/marketplace/providers`

- [x] 🤖 **Run Agent:** "Create ProviderApplicationsPage for admin"
- [x] Create `/src/pages/admin/ProviderApplicationsPage.jsx`
  - Tabs: Pending, Approved, Rejected
  - Show license verification status
  - View student ID uploads
  - Approve/Reject buttons
  - Notes field for rejection reason
- [x] 🎭 **Playwright Test:** Create `tests/admin-providers.spec.js`
```javascript
test('admin can view pending applications', async ({ page }) => {
  await page.goto('/admin/marketplace/providers');
  await expect(page.getByRole('tab', { name: /pending/i })).toBeVisible();
});

test('admin can approve application', async ({ page }) => {
  await page.goto('/admin/marketplace/providers');
  await page.getByRole('button', { name: /approve/i }).first().click();
  await expect(page.getByText(/approved/i)).toBeVisible();
});
```
- [x] 🔄 **COMMIT:** `git add . && git commit -m "Add admin provider applications page"`

## 4.5.3 Dispute Resolution Queue
**Route:** `/admin/marketplace/disputes`

- [x] 🤖 **Run Agent:** "Create DisputeQueuePage for admin"
- [x] Create `/src/pages/admin/DisputeQueuePage.jsx`
  - List of open disputes
  - Dispute details: booking, parties, reason, evidence
  - Resolution actions: Full refund, Partial refund, Deny
  - Communication log
- [x] 🎭 **Playwright Test:** Create `tests/admin-disputes.spec.js`
```javascript
test('admin can view disputes', async ({ page }) => {
  await page.goto('/admin/marketplace/disputes');
  await expect(page.getByTestId('dispute-item')).toHaveCount({ min: 0 });
});
```
- [x] 🔄 **COMMIT:** `git add . && git commit -m "Add admin dispute queue page"`

## 4.5.4 Bookings Management
**Route:** `/admin/marketplace/bookings`

- [x] 🤖 **Run Agent:** "Create AdminBookingsPage"
- [x] Create `/src/pages/admin/AdminBookingsPage.jsx`
  - All platform bookings with filters
  - Status, provider, applicant, date filters
  - Force cancel/refund actions
- [x] 🔄 **COMMIT:** `git add . && git commit -m "Add admin bookings page"`

## 4.5.5 Quality/Moderation
**Route:** `/admin/marketplace/quality`

- [x] 🤖 **Run Agent:** "Create AdminQualityPage"
- [x] Create `/src/pages/admin/AdminQualityPage.jsx`
  - Flagged reviews
  - Flagged messages (contact exchange attempts)
  - Reported content
  - Remove/approve actions
- [x] 🔄 **COMMIT:** `git add . && git commit -m "Add admin quality page"`

## 4.5.6 Admin QA

- [x] 🎭 **Run all admin Playwright tests:**
```bash
npx playwright test tests/admin-providers.spec.js
npx playwright test tests/admin-disputes.spec.js
```
- [x] 🔄 **COMMIT:** `git add . && git commit -m "Phase 4.5 admin QA fixes"`

---

## 4.5.7 Phase 4.5 Wrap-up ✅

- [x] All admin marketplace pages built ✅
- [x] 🔄 **COMMIT:** Phase 4.5 Admin Marketplace complete
- [x] 🎉 **CELEBRATE!** Marketplace Frontend complete!

---

### Phase 4.5 Summary (Admin)

| Category | Count |
|----------|-------|
| Pages | 5 |
| Playwright Test Files | 2 |

**Routes Created:**
- `/admin/marketplace` - Dashboard
- `/admin/marketplace/providers` - Applications queue
- `/admin/marketplace/disputes` - Dispute resolution
- `/admin/marketplace/bookings` - All bookings
- `/admin/marketplace/quality` - Moderation

---

# FINAL: Run All Marketplace Tests

```bash
# Run all marketplace Playwright tests
npx playwright test tests/marketplace-*.spec.js tests/mentor-*.spec.js tests/booking-*.spec.js tests/my-bookings.spec.js tests/leave-review.spec.js tests/messaging.spec.js tests/notifications.spec.js tests/provider-*.spec.js tests/admin-*.spec.js tests/become-mentor.spec.js

# Generate test report
npx playwright show-report
```

---

## 🟡 Phase 5: Additional Features (~50% Complete)

**Target:** Dec 9 | **Status:** 🟡 ~50% Complete

### 5.1 Preparation ✅

- [x] 📖 Read `/docs/skills/onboarding-system.md`
- [x] 📖 Read `/docs/skills/notification-system.md`
- [x] 📖 Read remaining sections in `/docs/skills/page-map.md`

### 5.2 School Database Page ✅

- [x] mockSchools.js created with sample schools
- [x] SchoolDatabasePage with filters and school cards
- [x] SchoolCard component
- [x] SchoolFilters component
- [x] Router updated
- [x] 🔄 Committed

### 5.3 School Profile Page ✅

- [x] SchoolProfilePage with all requirement sections
- [x] RequirementsSection component
- [x] Fast Facts display
- [x] Router updated
- [x] 🔄 Committed

### 5.4 Prerequisite Library ✅

- [x] mockPrerequisites.js created
- [x] PrerequisiteLibraryPage with search and course cards
- [x] CourseCard component
- [x] Router updated
- [x] 🔄 Committed

### 5.5 Course Detail ✅

- [x] CourseDetailModal component created (modal, not separate page)
- [x] Ratings and reviews display
- [x] Integrated into PrerequisiteLibraryPage
- [x] 🔄 Committed

### 5.6 Events Directory ⬜

- [x] Ask Claude: "Create mockEvents.js with sample events"
- [x] Save to `/src/data/mockEvents.js`
- [x] Ask Claude: "Create EventsPage with grid and filters"
- [x] Save to `/src/pages/applicant/EventsPage.jsx`
- [x] Ask Claude: "Create EventCard component"
- [x] Save to `/src/components/features/events/EventCard.jsx`
- [x] Update router
- [x] 🔄 **COMMIT:** `git add . && git commit -m "Add Events page"`

### 5.7 Learning Library ⬜

> **Note:** The Learning Library UI is built in Phase 5.5 (LMS Implementation). This section covers only the basic placeholder if needed before LMS is ready.

- [ ] Skip if doing full LMS implementation (Phase 5.5)
- [ ] Or create placeholder: `/src/pages/applicant/LearningLibraryPage.jsx`
- [ ] 🔄 **COMMIT:** `git add . && git commit -m "Add Learning Library placeholder"`

### 5.8 Onboarding Flow 🟡 ~90% COMPLETE

> **Strategic Onboarding Experience**
> This is a mentor-like onboarding flow that positions The CRNA Club as an "Application Companion" - not just another membership site with videos. The flow collects baseline data while providing immediate educational value ("why this matters") and personalized feedback.
>
> **Full Design Spec:** `/Users/sachi/.claude/plans/reflective-weaving-reddy.md`

#### Step 5.8.1: Database Setup ✅

- [x] Create Supabase migration for `user_onboarding` table:

```sql
-- supabase/migrations/YYYYMMDD_user_onboarding.sql
CREATE TABLE user_onboarding (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,

  -- Questionnaire answers
  timeline TEXT, -- 'exploring_18_plus' | 'strategizing_6_18' | 'applying_soon' | 'actively_applying' | 'accepted'
  currently_in_icu TEXT, -- 'yes' | 'nursing_school' | 'other_unit'
  icu_type TEXT,
  icu_years INTEGER,
  icu_months INTEGER,
  shadow_hours INTEGER,
  certifications TEXT[], -- ['CCRN', 'ACLS', 'BLS']
  gre_status TEXT, -- 'taken' | 'planning' | 'looking_for_no_gre'
  gre_quantitative INTEGER,
  gre_verbal INTEGER,
  gre_writing DECIMAL,
  help_needed TEXT[], -- ['essay', 'resume', 'interview_prep', 'lor', 'logistics']
  user_state TEXT,

  -- Flow tracking
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  skipped_at TIMESTAMPTZ,
  current_screen TEXT,
  path TEXT, -- 'A' | 'B' | 'C'

  -- Admin analytics
  signup_application_stage TEXT,

  UNIQUE(user_id)
);
```
- [x] Run migration: Created `supabase/migrations/20251213200000_user_onboarding.sql` ✅
- [x] 🔄 **COMMIT:** User onboarding migration created

#### Step 5.8.2: Core Modal Structure ✅

- [x] OnboardingModal component created ✅
- [x] Save to `/src/components/features/onboarding/OnboardingModal.jsx` ✅
- [x] OnboardingProgress component created ✅
- [x] Save to `/src/components/features/onboarding/OnboardingProgress.jsx` ✅
- [x] useOnboardingFlow hook created ✅
- [x] Save to `/src/components/features/onboarding/hooks/useOnboardingFlow.js` ✅
- [x] 🔄 **COMMIT:** Onboarding modal structure complete

#### Step 5.8.3: Welcome Screen ✅

- [x] WelcomeScreen component created ✅
- [x] Save to `/src/components/features/onboarding/screens/WelcomeScreen.jsx` ✅
- [x] 🔄 **COMMIT:** Onboarding welcome screen complete

#### Step 5.8.4: Timeline Screen (Branch Point) ✅

- [x] TimelineScreen component created ✅
- [x] Save to `/src/components/features/onboarding/screens/TimelineScreen.jsx` ✅
- [x] 🔄 **COMMIT:** Timeline branch screen complete

#### Step 5.8.5: Path A Screens (Foundation Building) ✅

- [x] IcuExperienceScreen component created ✅
- [x] Save to `/src/components/features/onboarding/screens/IcuExperienceScreen.jsx` ✅
- [x] ShadowingScreen component created ✅
- [x] Save to `/src/components/features/onboarding/screens/ShadowingScreen.jsx` ✅
- [x] CertificationsScreen component created ✅
- [x] Save to `/src/components/features/onboarding/screens/CertificationsScreen.jsx` ✅
- [x] GreScreen component created ✅
- [x] Save to `/src/components/features/onboarding/screens/GreScreen.jsx` ✅
- [x] 🔄 **COMMIT:** Path A onboarding screens complete

#### Step 5.8.6: Educational Insight Card ✅

- [x] EducationalInsightCard component created ✅
- [x] Save to `/src/components/features/onboarding/EducationalInsightCard.jsx` ✅
- [x] getEducationalContext utility created ✅
- [x] Save to `/src/lib/onboarding/getEducationalContext.js` ✅
- [x] 🔄 **COMMIT:** Educational insight system complete

#### Step 5.8.7: School Selection (Fuzzy Search) ✅

- [x] SchoolFuzzySearch component created ✅
- [x] Save to `/src/components/features/onboarding/SchoolFuzzySearch.jsx` ✅
- [x] SchoolsInterestScreen component created ✅
- [x] Save to `/src/components/features/onboarding/screens/SchoolsInterestScreen.jsx` ✅
- [x] 🔄 **COMMIT:** School selection with fuzzy search complete

#### Step 5.8.8: Summary Screen (Aha Moment) ✅

- [x] SummaryScreen component created ✅
- [x] Save to `/src/components/features/onboarding/screens/SummaryScreen.jsx` ✅
- [x] 🔄 **COMMIT:** Onboarding summary screen complete

#### Step 5.8.9: Path B Screens (Execution Mode) ✅

- [x] TargetSchoolsScreen component created ✅
- [x] Save to `/src/components/features/onboarding/screens/TargetSchoolsScreen.jsx` ✅
- [x] QuickSnapshotScreen component created ✅
- [x] Save to `/src/components/features/onboarding/screens/QuickSnapshotScreen.jsx` ✅
- [x] HelpNeededScreen component created ✅
- [x] Save to `/src/components/features/onboarding/screens/HelpNeededScreen.jsx` ✅
- [x] 🔄 **COMMIT:** Path B execution mode screens complete

#### Step 5.8.10: Path C Screens (Already Accepted) ✅

- [x] AcceptanceScreen component created ✅
- [x] Save to `/src/components/features/onboarding/screens/AcceptanceScreen.jsx` ✅
- [x] ApplyingMoreScreen component created ✅
- [x] Save to `/src/components/features/onboarding/screens/ApplyingMoreScreen.jsx` ✅
- [x] 🔄 **COMMIT:** Path C accepted user screens complete

#### Step 5.8.11: Celebration Wiring ⬜

- [ ] Ask Claude: "Create useGamification hook for centralized celebration triggers:
  - showPointsToast(points, reason)
  - showLevelUp(newLevel)
  - triggerConfetti()
  - Integration with existing PointsToast, LevelUpModal components"
- [ ] Save to `/src/hooks/useGamification.js`
- [ ] Wire celebrations into onboarding:
  - +5 pts on Welcome screen view
  - +2 pts per screen completion
  - +15 pts on questionnaire completion
  - LevelUpModal if they hit 20 pts
- [ ] 🔄 **COMMIT:** `git add . && git commit -m "Wire celebration system to onboarding"`

#### Step 5.8.12: Dashboard Integration ✅

- [x] useOnboardingStatus hook created ✅
- [x] Save to `/src/hooks/useOnboardingStatus.js` ✅
- [x] OnboardingOverlay component created ✅
- [x] Save to `/src/components/features/onboarding/OnboardingOverlay.jsx` ✅

- [ ] Update DashboardPage.jsx:
  - Check onboarding status on mount
  - If never completed AND never skipped → show OnboardingModal
  - If skipped → show OnboardingOverlay on sidebar
  - If completed → normal experience

- [ ] 🔄 **COMMIT:** `git add . && git commit -m "Integrate onboarding with dashboard"`

#### Step 5.8.13: Persistent Session Reminder ⬜

- [ ] Add reminder logic to DashboardPage or App.jsx:
```javascript
// On app load (not just login)
const { onboardingCompleted, onboardingSkipped, skippedAt } = useOnboardingStatus();

if (!onboardingCompleted && !onboardingSkipped) {
  showOnboardingModal(); // Always show if never interacted
} else if (onboardingSkipped && !onboardingCompleted) {
  const hoursSinceSkip = (Date.now() - new Date(skippedAt)) / (1000 * 60 * 60);
  const shownThisSession = sessionStorage.getItem('onboardingReminderShown');

  if (hoursSinceSkip >= 24 && !shownThisSession) {
    showOnboardingReminderNudge(); // Soft nudge, not full modal
    sessionStorage.setItem('onboardingReminderShown', 'true');
  }
}
```
- [ ] 🔄 **COMMIT:** `git add . && git commit -m "Add onboarding reminder for persistent sessions"`

#### Step 5.8.14: ReadyScore Qualitative Display ⬜

- [ ] Ask Claude: "Update ReadinessOverviewCard to show qualitative breakdown before threshold:
  - Clinical Foundation: Strong/Building/Getting Started
  - Shadowing Progress: Strong/Building/Getting Started
  - Certifications: Solid/Building/Getting Started
  - Progress bars with qualitative labels
  - 'Add GPA and 1 target program to unlock full ReadyScore'"
- [ ] Modify `/src/components/features/stats/ReadinessOverviewCard.jsx`
- [ ] Add `isReadyScoreUnlocked()` to `/src/lib/readinessCalculator.js`
- [ ] 🔄 **COMMIT:** `git add . && git commit -m "Add qualitative ReadyScore display"`

#### Step 5.8.15: Guidance Engine Initialization ⬜

- [ ] Update computeGuidanceState to initialize from onboarding data:
  - Set applicationStage from timeline answer
  - Derive supportMode from stage
  - Set primaryFocusAreas from help_needed answers
- [ ] Modify `/src/lib/guidance/computeGuidanceState.js`
- [ ] 🔄 **COMMIT:** `git add . && git commit -m "Initialize Guidance Engine from onboarding data"`

#### Step 5.8.16: QA Onboarding Flow ✅

- [x] 🎭 **Playwright Test:** Create `tests/onboarding.spec.cjs` (50 tests)
```javascript
import { test, expect } from '@playwright/test';

// Helper to clear onboarding state
async function clearOnboardingState(page) {
  await page.evaluate(() => {
    localStorage.removeItem('onboarding-completed-at');
    localStorage.removeItem('onboarding-skipped-at');
    localStorage.removeItem('onboarding-data');
    sessionStorage.removeItem('onboarding-reminder-shown');
  });
}

// Helper to scope locators to modal
function getModal(page) {
  return page.locator('[role="dialog"]');
}

// Test categories covered:
// - Initial Display (modal opens, welcome screen content)
// - Timeline Navigation (path branching logic)
// - Path A: Foundation Building flow (8 screens)
// - Path B: Execution Mode flow (6 screens)
// - Path C: Already Accepted flow (branch logic)
// - Skip Functionality (skip button, localStorage)
// - Reminder Logic (24h timer, session storage)
// - Progress Bar (endowed progress, increments)
// - Summary Screen (confetti, personalized content)
// - Back Navigation (preserves state)
// - Mobile/Tablet Responsive (breakpoints)
// - Certifications (pill toggles, CCRN highlight)
// - School Search (fuzzy search, selection)
```
- [x] Run: `npx playwright test tests/onboarding.spec.cjs` ✅ 49 passed, 1 skipped (reminder dismissal - component wiring TODO)
- [x] Test Path A (Foundation Building): Welcome → Timeline → ICU → Shadow → Certs → GRE → Schools → Summary ✅
- [x] Test Path B (Execution Mode): Welcome → Timeline → Target Schools → Quick Snapshot → Help Needed → Summary ✅
- [x] Test Path C (Accepted): Welcome → Timeline → Acceptance → Applying More → Summary or SRNA transition ✅
- [x] Test skip flow: Skip → localStorage set ✅ (24h reminder component wiring TODO)
- [x] Test mobile responsiveness: Full-screen modal, touch targets ✅
- [ ] Test celebrations: Points toasts, level up modal, confetti (requires Step 5.8.11 celebration wiring)
- [ ] Test data persistence: Check Supabase table after completion (requires backend integration)
- [x] 🔄 **COMMIT:** Onboarding Playwright tests complete

---

**Onboarding Files Summary:**
```
src/components/features/onboarding/
├── OnboardingModal.jsx
├── OnboardingProgress.jsx
├── EducationalInsightCard.jsx
├── SchoolFuzzySearch.jsx
├── screens/
│   ├── WelcomeScreen.jsx
│   ├── TimelineScreen.jsx
│   ├── IcuExperienceScreen.jsx
│   ├── ShadowingScreen.jsx
│   ├── CertificationsScreen.jsx
│   ├── GreScreen.jsx
│   ├── SchoolsInterestScreen.jsx
│   ├── TargetSchoolsScreen.jsx
│   ├── QuickSnapshotScreen.jsx
│   ├── HelpNeededScreen.jsx
│   ├── AcceptanceScreen.jsx
│   ├── ApplyingMoreScreen.jsx
│   └── SummaryScreen.jsx
└── hooks/
    └── useOnboardingFlow.js

src/lib/onboarding/
└── getEducationalContext.js

src/hooks/
├── useOnboardingStatus.js
└── useGamification.js

src/components/features/dashboard/
└── OnboardingOverlay.jsx

supabase/migrations/
└── YYYYMMDD_user_onboarding.sql

tests/
└── onboarding.spec.cjs          # 50 Playwright E2E tests (49 passing, 1 skipped)
```

### 5.9 Notifications UI ✅

- [x] Ask Claude: "Create NotificationBell component for header"
- [x] Save to `/src/components/features/notifications/NotificationBell.jsx`
- [x] Ask Claude: "Create NotificationDropdown component"
- [x] Save to `/src/components/features/notifications/NotificationDropdown.jsx`
- [x] Ask Claude: "Create NotificationItem component"
- [x] Save to `/src/components/features/notifications/NotificationItem.jsx`
- [x] Update Header to use NotificationBell
- [x] 🔄 **COMMIT:** `git add . && git commit -m "Add notifications UI"`

### 5.10 Gamification UI ✅

- [x] Ask Claude: "Create LevelUpModal celebration component"
- [x] Save to `/src/components/features/gamification/LevelUpModal.jsx`
- [x] Ask Claude: "Create BadgeEarnedModal component"
- [x] Save to `/src/components/features/gamification/BadgeEarnedModal.jsx`
- [x] Ask Claude: "Create PointsToast component"
- [x] Save to `/src/components/features/gamification/PointsToast.jsx`
- [x] 🔄 **COMMIT:** `git add . && git commit -m "Add gamification UI components"`

### 5.11 QA Phase 5 ⬜

- [x] 🤖 **Run QA Agent:** "QA phase 5 - all additional features"
- [x] Test School Database → School Profile flow
- [x] Test Prerequisite Library → Course Detail flow
- [x] Test Events page
- [x] Test Learning Library
- [x] Test notifications dropdown
- [x] Fix issues
- [x] 🔄 **COMMIT:** `git add . && git commit -m "Phase 5 QA fixes"`

### 5.12 Phase 5 Wrap-up ⬜

- [x] Update `/docs/project/status.md` - mark Phase 5 complete
- [x] 🔄 **COMMIT:** `git add . && git commit -m "Complete Phase 5: Additional Features"`
- [x] 🎉 **CELEBRATE!** Phase 5 done!

---

## Phase 5.5: Custom LMS Implementation

**Target:** TBD | **Status:** ✅ PLANNING COMPLETE - Ready for Development
**Estimated Time:** ~8-10 weeks

> **Architecture:** Editor.js for block-based content editing (Notion-like). All data in Supabase (no external CMS, no recurring costs). Same Editor.js to be reused for future "My Docs" user notes feature.

### 📖 Skills & References

| Purpose | File |
|---------|------|
| Full Implementation Plan | `/docs/project/lms-implementation-plan.md` |
| Plan File | `~/.claude/plans/compressed-forging-penguin.md` |
| Decision Log | `/docs/project/decision-log.md` (Dec 9 LMS decisions) |

### Key Decisions (Dec 9, 2024)
- **Editor.js** for block-based content (not TipTap)
- **Supabase** for all LMS data (no external CMS)
- **Full platform search** from day one (⌘+K modal)
- **Autosave + 5-level Undo/Redo** (not full revision history)
- **Image upload** via Supabase Storage bucket `lesson-images`
- **3 points** awarded on lesson completion (gamification)
- **3-layer download aggregation** (category auto-populate + manual + exclusions)

---

### 5.5.1 Database Setup (3-4 days)

#### 5.5.1.1 Create Supabase Tables
- [x] Add to Supabase SQL Editor:
```sql
-- Categories (shared across modules, lessons, downloads)
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Entitlements (access control)
CREATE TABLE entitlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed entitlements
INSERT INTO entitlements (slug, display_name) VALUES
  ('active_membership', 'Active Members'),
  ('plan_apply_toolkit', 'Plan+Apply Toolkit'),
  ('interviewing_toolkit', 'Interviewing Toolkit');

-- Modules (top-level containers)
CREATE TABLE modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  order_index INTEGER DEFAULT 0,
  accessible_via TEXT[] DEFAULT '{}',
  category_slugs TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sections (optional grouping within modules)
CREATE TABLE sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lessons
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  section_id UUID REFERENCES sections(id) ON DELETE SET NULL,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  vimeo_video_id TEXT,
  video_thumbnail_url TEXT,
  video_description TEXT,
  content JSONB,
  resource_category_slug TEXT,
  manual_download_ids UUID[],
  excluded_download_ids UUID[],
  accessible_via TEXT[] DEFAULT '{}',
  category_slugs TEXT[] DEFAULT '{}',
  order_index INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Downloads
CREATE TABLE downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  file_url TEXT NOT NULL,
  file_type TEXT,
  category_slugs TEXT[] DEFAULT '{}',
  is_free BOOLEAN DEFAULT FALSE,
  accessible_via TEXT[] DEFAULT '{}',
  purchase_product_url TEXT,
  groundhogg_tag TEXT,
  download_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Progress
CREATE TABLE user_lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);
```
- [x] 🧪 **Test:** Insert test data in Supabase dashboard
- [x] 🔄 **COMMIT:** `git add . && git commit -m "Document LMS database schema"`

#### 5.5.1.2 Create Indexes
- [x] Add to Supabase SQL Editor:
```sql
CREATE INDEX idx_lessons_module ON lessons(module_id);
CREATE INDEX idx_lessons_section ON lessons(section_id);
CREATE INDEX idx_sections_module ON sections(module_id);
CREATE INDEX idx_progress_user ON user_lesson_progress(user_id);
CREATE INDEX idx_downloads_categories ON downloads USING GIN(category_slugs);
CREATE INDEX idx_lessons_categories ON lessons USING GIN(category_slugs);
CREATE INDEX idx_modules_categories ON modules USING GIN(category_slugs);

-- Full-text search indexes
CREATE INDEX idx_modules_search ON modules USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '')));
CREATE INDEX idx_lessons_search ON lessons USING GIN(to_tsvector('english', title || ' ' || COALESCE(video_description, '')));
CREATE INDEX idx_downloads_search ON downloads USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '')));
```
- [x] 🧪 **Test:** Search queries work in Supabase dashboard
- [x] 🔄 **COMMIT:** `git add . && git commit -m "Add LMS database indexes"`

#### 5.5.1.3 Create RLS Policies
- [x] Set up Row Level Security for all LMS tables
- [x] Public read access for published content
- [x] Authenticated write access for admin users
- [x] User-specific access for progress tracking
- [x] 🧪 **Test:** RLS policies work correctly
- [x] 🔄 **COMMIT:** `git add . && git commit -m "Add LMS RLS policies"`

#### 5.5.1.4 Create Supabase Storage Bucket
- [x] Create bucket `lesson-images` in Supabase Storage
- [x] Set public access policy for images
- [ ] 🧪 **Test:** Upload test image, verify public URL works
- [x] 🔄 **COMMIT:** `git add . && git commit -m "Add lesson-images storage bucket"`

---

### 5.5.2 Core Hooks (2-3 days)

#### 5.5.2.1 Create LMS Hooks (9 hooks)
- [x] Create `/src/hooks/useModules.js` - CRUD for modules
  - `getModules()` - List all published modules
  - `getModule(slug)` - Get single module with sections/lessons
  - `createModule(data)` - Create module (admin)
  - `updateModule(id, data)` - Update module (admin)
  - `deleteModule(id)` - Delete module (admin)
  - `reorderModules(ids)` - Update order_index (admin)
- [x] Create `/src/hooks/useLessons.js` - CRUD for lessons
  - `getLessons(moduleId)` - List lessons in module
  - `getLesson(slug)` - Get single lesson with content
  - `createLesson(data)` - Create lesson (admin)
  - `updateLesson(id, data)` - Update lesson (admin)
  - `deleteLesson(id)` - Delete lesson (admin)
  - `reorderLessons(ids)` - Update order_index (admin)
- [x] Create `/src/hooks/useDownloads.js` - CRUD for downloads
  - `getDownloads()` - List all downloads
  - `getDownload(slug)` - Get single download
  - `createDownload(data)` - Create download (admin)
  - `updateDownload(id, data)` - Update download (admin)
  - `deleteDownload(id)` - Delete download (admin)
  - `incrementDownloadCount(id)` - Track downloads
- [x] Create `/src/hooks/useCategories.js` - CRUD for categories
- [x] Create `/src/hooks/useEntitlements.js` - Read entitlements
- [x] Create `/src/hooks/useLessonAccess.js` - Check if user can access lesson
  - Returns `{ hasAccess, requiredEntitlements }`
  - Checks lesson entitlements or inherits from module
- [x] Create `/src/hooks/useDownloadAccess.js` - Check if user can access download
  - Returns `{ hasAccess, isFree }`
- [x] Create `/src/hooks/useLessonProgress.js` - Track/update progress
  - `markComplete(lessonId)` - Mark lesson complete + award points
  - `getProgress(moduleId)` - Get completion % for module
  - `getRecentlyAccessed()` - Last 5 accessed lessons
- [x] Create `/src/hooks/useImageUpload.js` - Upload images to Supabase Storage
  - `upload(file)` - Returns public URL
- [x] 🧪 **Test:** All hooks return expected data
- [x] 🔄 **COMMIT:** `git add . && git commit -m "Add LMS core hooks"`

---

### 5.5.3 Editor.js Setup (4-5 days)

#### 5.5.3.1 Install Editor.js Dependencies
- [x] Run:
```bash
npm install @editorjs/editorjs @editorjs/header @editorjs/list @editorjs/checklist @editorjs/table @editorjs/image @editorjs/quote @editorjs/delimiter @editorjs/embed @editorjs/inline-code @editorjs/marker
```
- [x] 🧪 **Test:** Import Editor.js in console, no errors
- [x] 🔄 **COMMIT:** `git add . && git commit -m "Install Editor.js dependencies"`

#### 5.5.3.2 Create Editor.js Configuration
- [ ] Create `/src/lib/editorjs-config.js`:
```javascript
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Checklist from '@editorjs/checklist';
import Table from '@editorjs/table';
import Image from '@editorjs/image';
import Quote from '@editorjs/quote';
import Delimiter from '@editorjs/delimiter';
import Embed from '@editorjs/embed';
import InlineCode from '@editorjs/inline-code';
import Marker from '@editorjs/marker';

export const EDITOR_TOOLS = {
  header: { class: Header, config: { levels: [1, 2, 3], defaultLevel: 2 } },
  list: { class: List, inlineToolbar: true },
  checklist: Checklist,
  table: Table,
  image: { class: Image, config: { /* uploader config added later */ } },
  quote: Quote,
  delimiter: Delimiter,
  embed: { class: Embed, config: { services: { vimeo: true, youtube: true } } },
  inlineCode: InlineCode,
  marker: Marker,
};
```
- [x] 🔄 **COMMIT:** `git add . && git commit -m "Add Editor.js configuration"`

#### 5.5.3.3 Create BlockEditor Component
- [x] Create `/src/components/features/editor/BlockEditor.jsx`:
  - Initialize Editor.js with tools config
  - Implement autosave (30s interval + 2s debounce)
  - Implement undo/redo (5 levels in memory)
  - Keyboard shortcuts: ⌘+Z (undo), ⌘+Shift+Z (redo)
  - Save status indicator ("Saving..." → "Saved" → "Last saved: X min ago")
  - `onChange(data)` callback
  - `initialData` prop
- [x] 🧪 **Test:** Editor loads, autosave works, undo/redo works
- [x] 🔄 **COMMIT:** `git add . && git commit -m "Add BlockEditor component with autosave"`

#### 5.5.3.4 Create EditorRenderer Component
- [x] Create `/src/components/features/editor/EditorRenderer.jsx`:
  - Read-only rendering of Editor.js JSON
  - Render each block type (header, paragraph, list, table, image, etc.)
  - Sanitize HTML content (use DOMPurify)
  - Responsive images
- [x] 🧪 **Test:** Renderer displays all block types correctly
- [x] 🔄 **COMMIT:** `git add . && git commit -m "Add EditorRenderer component"`

#### 5.5.3.5 Integrate Image Upload
- [x] Update `/src/lib/editorjs-config.js` with image uploader:
```javascript
image: {
  class: Image,
  config: {
    uploader: {
      uploadByFile: async (file) => {
        const { upload } = useImageUpload();
        const url = await upload(file);
        return { success: 1, file: { url } };
      }
    }
  }
}
```
- [x] Create `/src/components/features/editor/ImageUploader.jsx` - Drag & drop component
- [x] 🧪 **Test:** Drag image into editor, uploads to Supabase, displays correctly
- [x] 🔄 **COMMIT:** `git add . && git commit -m "Add Editor.js image upload"`

#### 5.5.3.6 Create Custom Block Tools (3 tools)
- [x] Create `/src/components/features/editor/tools/CalloutTool.js`:
  - Types: tip, warning, note, important
  - Icon + colored background
  - Text content
- [x] Create `/src/components/features/editor/tools/LinkCardTool.js`:
  - Internal link to app sections
  - Title + description + icon
  - Click navigates to destination
- [x] Create `/src/components/features/editor/tools/DownloadTool.js`:
  - Select download from list
  - Shows download button in content
  - Respects entitlements
- [x] Add custom tools to `editorjs-config.js`
- [x] 🧪 **Test:** All custom blocks work in editor and renderer
- [x] 🔄 **COMMIT:** `git add . && git commit -m "Add custom Editor.js blocks"`

---

### 5.5.4 Admin - Modules & Lessons (5-7 days)

#### 5.5.4.1 Modules List Page
**Route:** `/admin/modules`

- [x] Create `/src/pages/admin/ModulesListPage.jsx`:
  - List all modules with search
  - Show: title, lesson count, status, last updated
  - Add new module button
  - Drag & drop reorder modules
  - Delete module (with confirmation)
- [x] Create `/src/components/features/admin/SortableModuleList.jsx` - Drag & drop list
- [x] Create `/src/components/features/admin/DeleteConfirmModal.jsx`
- [x] Update router
- [x] 🧪 **Test:** List loads, search works, reorder works
- [x] 🔄 **COMMIT:** `git add . && git commit -m "Add modules list admin page"`

#### 5.5.4.2 Module Detail Page - Done but module not showing after save is because no auth
**Route:** `/admin/modules/:id`

- [x] Create `/src/pages/admin/ModuleDetailPage.jsx`:
  - Edit module title, slug, thumbnail, description
  - Entitlement checkboxes (who can access)
  - Category tags
  - Status (draft/published)
  - Section management (add/edit/delete)
  - Lesson list with search
  - Drag & drop reorder lessons within sections
  - Add new lesson button
  - Delete lesson (with confirmation)
  - Show lesson URL (copyable)
- [x] Create `/src/components/features/admin/ModuleForm.jsx`
- [x] Create `/src/components/features/admin/SectionManager.jsx`
- [x] Create `/src/components/features/admin/SortableLessonList.jsx`
- [x] Update router
- [] 🧪 **Test:** Edit module, add section, reorder lessons
- [x] 🔄 **COMMIT:** `git add . && git commit -m "Add module detail admin page"`

#### 5.5.4.3 Lesson Edit Page
**Route:** `/admin/lessons/:id`

- [x] Create `/src/pages/admin/LessonEditPage.jsx`:
  - Title, slug (auto-generated, editable)
  - Lesson URL display (copyable for hyperlinking)
  - Vimeo video ID field + thumbnail preview
  - Video description textarea
  - **Editor.js content editor** (BlockEditor component)
  - Category selection
  - Resource category dropdown (for download auto-populate)
  - Manual download selection (multi-select from downloads list)
  - Excluded downloads (multi-select)
  - Entitlement checkboxes (or "inherit from module")
  - Status (draft/published)
  - Save button with autosave indicator
  - Preview button (opens user-facing lesson in new tab)
- [x] Create `/src/components/features/admin/LessonForm.jsx`
- [x] Create `/src/components/features/admin/DownloadSelector.jsx` - Multi-select downloads
- [x] Create `/src/components/features/admin/EntitlementCheckboxes.jsx`
- [x] Update router
- [x] 🧪 **Test:** Create lesson, add content, save, preview
- [x] 🔄 **COMMIT:** `git add . && git commit -m "Add lesson edit admin page"`

---

### 5.5.5 Admin - Downloads (3-4 days)

#### 5.5.5.1 Downloads List Page
**Route:** `/admin/downloads`

- [x] Create `/src/pages/admin/DownloadsListPage.jsx`:
  - List all downloads with search
  - Show: title, file type, categories, download count, status
  - Add new download button
  - Delete download (with confirmation)
- [x] Create `/src/components/features/admin/DownloadCard.jsx`
- [x] Update router
- [x] 🧪 **Test:** List loads, search works
- [x] 🔄 **COMMIT:** `git add . && git commit -m "Add downloads list admin page"`

#### 5.5.5.2 Download Edit Page
**Route:** `/admin/downloads/:id`

- [x] Create `/src/pages/admin/DownloadEditPage.jsx`:
  - Title, slug, description
  - Thumbnail URL
  - File URL (paste Google Drive link, etc.)
  - File type dropdown (PDF, XLSX, ZIP, etc.)
  - Category tags (multi-select)
  - Access: Free checkbox OR entitlement checkboxes
  - WooCommerce product URL (for "Get Now" button)
  - Groundhogg tag (reference field, no functionality)
  - Download count display (read-only)
  - Status (active/archived)
- [x] Create `/src/components/features/admin/DownloadForm.jsx`
- [x] Update router
- [x] 🧪 **Test:** Create download, edit, save
- [x] 🔄 **COMMIT:** `git add . && git commit -m "Add download edit admin page"`

---

### 5.5.6 Admin - Categories & Entitlements (2-3 days) - IN PROGRESS

#### 5.5.6.1 Categories Page
**Route:** `/admin/categories`

- [x] Create `/src/pages/admin/CategoriesPage.jsx`:
  - List all categories
  - Show: slug, display name, usage count
  - Add/edit/delete categories
  - Inline editing
- [x] Create `/src/components/features/admin/CategoryForm.jsx`
- [x] Update router
- [x] 🧪 **Test:** Create category, edit, delete
- [x] 🔄 **COMMIT:** `git add . && git commit -m "Add categories admin page"`

#### 5.5.6.2 Entitlements Page
**Route:** `/admin/entitlements`

- [x] Create `/src/pages/admin/EntitlementsPage.jsx`:
  - List all entitlements
  - Show: slug, display name, description, content count
  - Add/edit/delete entitlements
- [x] Create `/src/components/features/admin/EntitlementForm.jsx`
- [ ] Update router
- [x] 🧪 **Test:** Create entitlement, edit, delete
- [x] 🔄 **COMMIT:** `git add . && git commit -m "Add entitlements admin page"`

---

### 5.5.7 User-Facing Module Grid (2-3 days)

#### 5.5.7.1 Learning Library Page
**Route:** `/learn`

- [x] Create `/src/pages/applicant/LearningLibraryPage.jsx`:
  - Grid of module cards (4 cols desktop, 2 tablet, 1 mobile)
  - Search modules
  - Sort: Alphabetical, Recently Added
  - Filter by category
  - Inline search bar
- [ ] Create `/src/components/features/learning/ModuleCard.jsx`:
  - Thumbnail
  - Title
  - Description (truncated)
  - Lesson count
  - Progress % (completed / total)
  - Lock icon if no access
  - Last activity date
- [x] Create `/src/components/features/learning/ModuleGrid.jsx`
- [x] Create `/src/components/features/search/InlineSearch.jsx`
- [x] Update router
- [ x] 🧪 **Test:** Grid loads, search works, cards clickable
- [x] 🔄 **COMMIT:** `git add . && git commit -m "Add Learning Library page"`

---

### 5.5.8 User-Facing Module Detail (2-3 days)

#### 5.5.8.1 Module Detail Page
**Route:** `/learn/:moduleSlug`

- [x] Create `/src/pages/applicant/ModuleDetailPage.jsx`:
  - Module header (thumbnail, title, description)
  - Progress bar with % complete
  - "Start Module" or "Continue" button
  - Search lessons
  - Lesson list (grouped by section if applicable)
  - Completion checkmark per lesson
  - Access control check (show paywall if no access)
- [x] Create `/src/components/features/learning/LessonList.jsx`:
  - Section headers (collapsible)
  - Lesson items with: title, duration indicator, completion status
- [x] Create `/src/components/features/learning/ProgressBar.jsx`
- [x] Create `/src/components/features/learning/LessonPaywall.jsx`:
  - Lock icon
  - "This module requires a membership"
  - CTA buttons: Start Free Trial, View Plans
- [x] Update router
- [x] 🧪 **Test:** Module loads, lessons grouped correctly, progress shows
- [x] 🔄 **COMMIT:** `git add . && git commit -m "Add Module Detail page"`

---

### 5.5.9 User-Facing Lesson Page (4-5 days)

#### 5.5.9.1 Lesson Page
**Route:** `/learn/:moduleSlug/:lessonSlug`

- [x] Create `/src/pages/applicant/LessonPage.jsx`:
  - Lesson X of Y indicator
  - Prev/Next navigation buttons
  - Status badge (In Progress / Completed)
  - Lesson title
  - Vimeo video (if present)
  - Video description
  - "What You Need to Know" section (Editor.js content)
  - "More Resources For You" section (downloads)
  - Mark Complete button
  - "Let's Keep Watching" (next lessons in module)
  - Access control (paywall if no access)

**Layout:**
```
┌─────────────────────────────────────────────────────────────────┐
│ LESSON 8 OF 23                              [In Progress] [< >] │
├─────────────────────────────────────────────────────────────────┤
│                      LESSON TITLE                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    VIMEO VIDEO                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│  Video description text here...                                 │
│  ─────────────────────────────────────────────────────────────  │
│                    WHAT YOU NEED TO KNOW                        │
│  [Editor.js rendered content]                                   │
│  ─────────────────────────────────────────────────────────────  │
│                    MORE RESOURCES FOR YOU                       │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                │
│  │ [Download] │  │ [Get Now]  │  │ [Download] │                │
│  └────────────┘  └────────────┘  └────────────┘                │
│                      [Mark Complete]                            │
│  ─────────────────────────────────────────────────────────────  │
│                    LET'S KEEP WATCHING...                       │
│  [Next lessons]                                                 │
└─────────────────────────────────────────────────────────────────┘
```

- [x] Create `/src/components/features/learning/VimeoPlayer.jsx`:
  - Responsive Vimeo embed
  - 16:9 aspect ratio
  - Lazy loading
- [x] Create `/src/components/features/learning/LessonContent.jsx`:
  - Uses EditorRenderer to display content
- [x] Create `/src/components/features/learning/LessonResources.jsx`:
  - Implements 3-layer aggregation logic
  - Carousel or grid of download cards
- [x] Create `/src/components/features/learning/DownloadCard.jsx`:
  - Thumbnail
  - Title
  - File type badge
  - Download or Get Now button
- [x] Create `/src/components/features/learning/DownloadButton.jsx`:
  - If hasAccess: "Download" → opens file_url
  - If !hasAccess: "Get Now" → navigates to purchase_product_url
  - (Integrated into DownloadCard)
- [x] Create `/src/components/features/learning/LessonNavigation.jsx`:
  - Prev/Next buttons
  - Lesson X of Y display
- [x] Create `/src/components/features/learning/MarkCompleteButton.jsx`:
  - Marks lesson complete
  - Awards 3 gamification points
  - Shows celebration animation
- [x] Create `/src/lib/lesson-resources.js` - Resource aggregation logic:
```javascript
export function getLessonResources(lesson, allDownloads) {
  let resources = [];

  // 1. Auto-populate from category
  if (lesson.resource_category_slug) {
    resources.push(...allDownloads.filter(
      d => d.category_slugs.includes(lesson.resource_category_slug)
    ));
  }

  // 2. Add manual downloads
  if (lesson.manual_download_ids?.length) {
    resources.push(...allDownloads.filter(
      d => lesson.manual_download_ids.includes(d.id)
    ));
  }

  // 3. Remove exclusions
  if (lesson.excluded_download_ids?.length) {
    resources = resources.filter(
      r => !lesson.excluded_download_ids.includes(r.id)
    );
  }

  // 4. Deduplicate
  return [...new Map(resources.map(r => [r.id, r])).values()];
}
```
- [x] Create `/src/lib/gamification.js`:
  - (Logic integrated into useLessonProgress hook and MarkCompleteButton)
- [x] Update router
- [x] 🧪 **Test:** Video plays, content renders, downloads work, mark complete awards points
  - Playwright tests created: `tests/lesson-page.spec.cjs` (22 tests passing)
- [x] 🔄 **COMMIT:** `git add . && git commit -m "Add Lesson page with all components"`

---

### 5.5.10 Global Search (3-4 days)

#### 5.5.10.1 Search Hook
- [ ] Create `/src/hooks/useGlobalSearch.js`:
  - Search across: modules, lessons, downloads, schools, BuddyBoss posts
  - Debounced input (300ms)
  - Returns grouped results by type
  - Uses Postgres full-text search for Supabase
  - Uses WordPress REST API for BuddyBoss
```javascript
export function useGlobalSearch(query) {
  const [results, setResults] = useState({
    modules: [], lessons: [], downloads: [], schools: [], posts: []
  });

  useEffect(() => {
    if (!query || query.length < 2) return;

    Promise.all([
      searchSupabase('modules', query),
      searchSupabase('lessons', query),
      searchSupabase('downloads', query),
      searchSupabase('schools', query),
      searchBuddyBoss(query),
    ]).then(([modules, lessons, downloads, schools, posts]) => {
      setResults({ modules, lessons, downloads, schools, posts });
    });
  }, [query]);

  return results;
}
```
- [ ] 🧪 **Test:** Search returns results from all sources
- [ ] 🔄 **COMMIT:** `git add . && git commit -m "Add global search hook"`

#### 5.5.10.2 Global Search Modal
- [x] Create `/src/components/features/search/GlobalSearch.jsx`:
  - Uses shadcn Command component
  - Opens with ⌘+K / Ctrl+K
  - Search input at top
  - Results grouped by type with icons:
    - 📚 Modules
    - 📖 Lessons
    - 📥 Downloads
    - 🏫 Schools
    - 💬 Community
  - Click result navigates to item
  - Empty state: "No results found"
- [x] Create `/src/components/features/search/SearchResult.jsx`
- [x] Add GlobalSearch to App.jsx or Layout
- [x] Add keyboard shortcut listener
- [x] 🧪 **Test:** ⌘+K opens modal, search works, navigation works
- [x] 🔄 **COMMIT:** `git add . && git commit -m "Add global search modal"`

#### 5.5.10.3 Inline Search for Pages
- [ ] Update LearningLibraryPage with InlineSearch
- [ ] Update ModuleDetailPage with InlineSearch
- [ ] 🧪 **Test:** Inline search filters results on page
- [ ] 🔄 **COMMIT:** `git add . && git commit -m "Add inline search to LMS pages"`

---

### 5.5.11 Content Migration (3-5 days)

#### 5.5.11.1 Migrate Modules from LearnDash
- [ ] Export module list from LearnDash
- [ ] Create modules in Supabase (12 modules)
- [ ] Set thumbnails, descriptions, entitlements
- [ ] 🧪 **Test:** All modules appear in Learning Library
- [ ] 🔄 **COMMIT:** `git add . && git commit -m "Migrate modules from LearnDash"`

#### 5.5.11.2 Migrate Lessons from LearnDash
- [ ] Export lessons from LearnDash (~90 lessons)
- [ ] Convert content to Editor.js JSON format
- [ ] Import Vimeo video IDs
- [ ] Set entitlements per lesson
- [ ] 🧪 **Test:** All lessons accessible, content displays correctly
- [ ] 🔄 **COMMIT:** `git add . && git commit -m "Migrate lessons from LearnDash"`

#### 5.5.11.3 Migrate Downloads
- [ ] List all current downloads with file URLs
- [ ] Create downloads in Supabase
- [ ] Assign categories for auto-population
- [ ] Set entitlements
- [ ] 🧪 **Test:** Downloads appear on lessons, access control works
- [ ] 🔄 **COMMIT:** `git add . && git commit -m "Migrate downloads"`

---

### 5.5.12 Testing & Polish (3-4 days)

#### 5.5.12.1 Admin QA
- [ ] 🤖 **Run QA Agent:** "QA LMS admin pages"
- [ ] 🧪 **Test Flow:** Modules list → Create module → Add sections → Add lessons
- [ ] 🧪 **Test Flow:** Lesson edit → Add content → Save → Preview
- [ ] 🧪 **Test Flow:** Downloads list → Create download → Assign categories
- [ ] 🧪 **Test:** Drag & drop reordering
- [ ] 🧪 **Test:** Editor.js autosave and undo/redo
- [ ] 🧪 **Test:** Image upload to Supabase Storage
- [ ] Log issues in `/docs/project/issues.md`
- [ ] Fix critical issues
- [ ] 🔄 **COMMIT:** `git add . && git commit -m "LMS admin QA fixes"`

#### 5.5.12.2 User-Facing QA
- [ ] 🤖 **Run QA Agent:** "QA LMS user-facing pages"
- [ ] 🧪 **Test Flow:** Learning Library → Module → Lesson → Complete → Next
- [ ] 🧪 **Test:** Global search (⌘+K)
- [ ] 🧪 **Test:** Download button logic (Download vs Get Now)
- [ ] 🧪 **Test:** Progress tracking and gamification points
- [ ] 🧪 **Test:** Paywall for restricted content
- [ ] 🧪 **Test:** All pages at 375px, 768px, 1024px
- [ ] Log issues in `/docs/project/issues.md`
- [ ] Fix critical issues
- [ ] 🔄 **COMMIT:** `git add . && git commit -m "LMS user-facing QA fixes"`

---

### 5.5.13 Phase 5.5 Wrap-up

- [ ] Update `/docs/project/status.md` - mark Phase 5.5 complete
- [ ] 🔄 **COMMIT:** `git add . && git commit -m "Complete Phase 5.5: Custom LMS"`
- [ ] 🎉 **CELEBRATE!** Phase 5.5 done!

---

### Phase 5.5 Summary

| Category | Count |
|----------|-------|
| Supabase Tables | 7 |
| Hooks | 10 |
| Admin Pages | 6 |
| User Pages | 3 |
| Components | 30+ |
| Estimated Time | ~8-10 weeks |

**Routes Created:**

Admin:
- `/admin/modules` - Modules list
- `/admin/modules/:id` - Module detail (sections, lessons)
- `/admin/lessons/:id` - Lesson editor with Editor.js
- `/admin/downloads` - Downloads list
- `/admin/downloads/:id` - Download editor
- `/admin/categories` - Categories management
- `/admin/entitlements` - Entitlements management

User-Facing:
- `/learn` - Learning Library (module grid)
- `/learn/:moduleSlug` - Module detail (lesson list)
- `/learn/:moduleSlug/:lessonSlug` - Lesson page

**Key Features:**
- Editor.js block-based content editing
- Autosave + 5-level undo/redo
- Image upload to Supabase Storage
- 3-layer download aggregation
- Full platform search (⌘+K)
- Gamification integration (3 points per lesson)
- Entitlement-based access control

---

## Phase 6: Custom Supabase Community (Forums Only)

**Target:** TBD | **Estimated Total Time:** ~23 hours

> **Architecture Decision (Dec 13, 2024):** We're building custom community forums in Supabase instead of using BuddyBoss. No Groups feature for MVP - just Forums. Paid membership is the primary spam filter (only members can post). Additional anti-spam measures include honeypot fields, profanity filter, rate limiting, and auto-hide after reports.
>
> **Frontend Status:** ~90% complete (mock data). This phase focuses on:
> 1. Database schema for forums
> 2. Wiring hooks to Supabase
> 3. Admin moderation tools
> 4. Spam prevention
> 5. In-app notifications
> 6. Activity feed widget

### 📖 Skills & References

| Purpose | File |
|---------|------|
| Existing forum components | `/src/components/features/community/` |
| Existing forum pages | `/src/pages/applicant/Forums*.jsx`, `TopicDetailPage.jsx` |
| Existing hooks | `/src/hooks/useForums.js`, `useTopics.js`, `useReplies.js` |
| Notification system | `/docs/skills/notification-system.md` |
| Gamification | `/docs/skills/gamification-system.md` |

---

### 6.1 Database Schema (2 hours)

#### 6.1.1 Create Forums Migration
- [x] Create `supabase/migrations/YYYYMMDDHHMMSS_community_forums.sql`:

```sql
-- =============================================
-- COMMUNITY FORUMS SCHEMA
-- =============================================

-- Forums (admin-created via Supabase dashboard)
CREATE TABLE forums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE NOT NULL,
  parent_id UUID REFERENCES forums(id), -- NULL = top-level forum
  sort_order INTEGER DEFAULT 0,
  is_locked BOOLEAN DEFAULT FALSE, -- No new topics allowed
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Topics (user-created)
CREATE TABLE topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  forum_id UUID REFERENCES forums(id) NOT NULL,
  author_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL, -- HTML from rich text editor
  is_sticky BOOLEAN DEFAULT FALSE,
  is_locked BOOLEAN DEFAULT FALSE, -- No replies allowed
  is_hidden BOOLEAN DEFAULT FALSE, -- Hidden after reports threshold
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity_at TIMESTAMPTZ DEFAULT NOW(), -- Updated on new reply

  -- Honeypot (for spam detection)
  honeypot_field TEXT, -- Should always be empty, filled = bot

  -- Soft delete
  deleted_at TIMESTAMPTZ
);

-- Replies (user-created)
CREATE TABLE replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID REFERENCES topics(id) NOT NULL,
  author_id UUID REFERENCES auth.users(id) NOT NULL,
  parent_reply_id UUID REFERENCES replies(id), -- For threading
  content TEXT NOT NULL, -- HTML from rich text editor
  is_hidden BOOLEAN DEFAULT FALSE, -- Hidden after reports threshold
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Honeypot
  honeypot_field TEXT,

  -- Soft delete
  deleted_at TIMESTAMPTZ
);

-- Reactions (likes/favorites)
CREATE TABLE topic_reactions (
  topic_id UUID REFERENCES topics(id) NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  reaction_type TEXT DEFAULT 'like', -- 'like', 'love', 'helpful'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (topic_id, user_id)
);

CREATE TABLE reply_reactions (
  reply_id UUID REFERENCES replies(id) NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  reaction_type TEXT DEFAULT 'like',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (reply_id, user_id)
);

-- Reports (for moderation)
CREATE TABLE community_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES auth.users(id) NOT NULL,
  content_type TEXT NOT NULL, -- 'topic' | 'reply'
  content_id UUID NOT NULL, -- topic_id or reply_id
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending' | 'reviewed' | 'dismissed' | 'actioned'
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(reporter_id, content_type, content_id) -- One report per user per content
);

-- User blocks (user-level blocking)
CREATE TABLE user_blocks (
  blocker_id UUID REFERENCES auth.users(id) NOT NULL,
  blocked_id UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (blocker_id, blocked_id)
);

-- Admin bans/suspensions
CREATE TABLE user_suspensions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  suspended_by UUID REFERENCES auth.users(id) NOT NULL,
  reason TEXT NOT NULL,
  suspended_until TIMESTAMPTZ, -- NULL = permanent ban
  created_at TIMESTAMPTZ DEFAULT NOW(),
  lifted_at TIMESTAMPTZ,
  lifted_by UUID REFERENCES auth.users(id)
);

-- Topic subscriptions (for notifications)
CREATE TABLE topic_subscriptions (
  topic_id UUID REFERENCES topics(id) NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (topic_id, user_id)
);

-- In-app notifications
CREATE TABLE community_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  type TEXT NOT NULL, -- 'reply_to_topic' | 'reply_to_reply' | 'mention' | 'reaction'
  title TEXT NOT NULL,
  message TEXT,
  link TEXT, -- URL to navigate to
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Reference to source
  source_type TEXT, -- 'topic' | 'reply'
  source_id UUID,
  actor_id UUID REFERENCES auth.users(id) -- Who triggered the notification
);

-- Profanity word list (admin-configurable)
CREATE TABLE profanity_words (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  word TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rate limiting tracking
CREATE TABLE user_post_rate (
  user_id UUID REFERENCES auth.users(id) PRIMARY KEY,
  topic_count_today INTEGER DEFAULT 0,
  reply_count_today INTEGER DEFAULT 0,
  last_topic_at TIMESTAMPTZ,
  last_reply_at TIMESTAMPTZ,
  last_reset_date DATE DEFAULT CURRENT_DATE
);

-- Spam check cache (StopForumSpam results)
CREATE TABLE spam_check_cache (
  ip_address INET PRIMARY KEY,
  is_spammer BOOLEAN,
  confidence DECIMAL,
  checked_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX idx_topics_forum_id ON topics(forum_id);
CREATE INDEX idx_topics_author_id ON topics(author_id);
CREATE INDEX idx_topics_last_activity ON topics(last_activity_at DESC);
CREATE INDEX idx_replies_topic_id ON replies(topic_id);
CREATE INDEX idx_replies_author_id ON replies(author_id);
CREATE INDEX idx_reports_status ON community_reports(status);
CREATE INDEX idx_notifications_user_unread ON community_notifications(user_id, is_read);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE forums ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE topic_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reply_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_suspensions ENABLE ROW LEVEL SECURITY;
ALTER TABLE topic_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_notifications ENABLE ROW LEVEL SECURITY;

-- Forums: Anyone can read
CREATE POLICY "forums_read" ON forums FOR SELECT USING (true);

-- Topics: Read all non-hidden, non-deleted; write own
CREATE POLICY "topics_read" ON topics FOR SELECT USING (
  deleted_at IS NULL AND
  (is_hidden = FALSE OR author_id = auth.uid())
);
CREATE POLICY "topics_insert" ON topics FOR INSERT WITH CHECK (
  auth.uid() = author_id AND
  NOT EXISTS (SELECT 1 FROM user_suspensions WHERE user_id = auth.uid() AND lifted_at IS NULL AND (suspended_until IS NULL OR suspended_until > NOW()))
);
CREATE POLICY "topics_update_own" ON topics FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "topics_delete_own" ON topics FOR DELETE USING (auth.uid() = author_id);

-- Replies: Similar to topics
CREATE POLICY "replies_read" ON replies FOR SELECT USING (
  deleted_at IS NULL AND
  (is_hidden = FALSE OR author_id = auth.uid())
);
CREATE POLICY "replies_insert" ON replies FOR INSERT WITH CHECK (
  auth.uid() = author_id AND
  NOT EXISTS (SELECT 1 FROM user_suspensions WHERE user_id = auth.uid() AND lifted_at IS NULL AND (suspended_until IS NULL OR suspended_until > NOW()))
);
CREATE POLICY "replies_update_own" ON replies FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "replies_delete_own" ON replies FOR DELETE USING (auth.uid() = author_id);

-- Reactions: Read all, manage own
CREATE POLICY "topic_reactions_read" ON topic_reactions FOR SELECT USING (true);
CREATE POLICY "topic_reactions_manage" ON topic_reactions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "reply_reactions_read" ON reply_reactions FOR SELECT USING (true);
CREATE POLICY "reply_reactions_manage" ON reply_reactions FOR ALL USING (auth.uid() = user_id);

-- Reports: Users can create, only see own
CREATE POLICY "reports_insert" ON community_reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "reports_read_own" ON community_reports FOR SELECT USING (auth.uid() = reporter_id);

-- Blocks: Manage own
CREATE POLICY "blocks_manage" ON user_blocks FOR ALL USING (auth.uid() = blocker_id);

-- Subscriptions: Manage own
CREATE POLICY "subscriptions_manage" ON topic_subscriptions FOR ALL USING (auth.uid() = user_id);

-- Notifications: Read/manage own
CREATE POLICY "notifications_own" ON community_notifications FOR ALL USING (auth.uid() = user_id);

-- Admin policies (add to all relevant tables)
CREATE POLICY "admin_all_topics" ON topics FOR ALL USING (
  auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'user_role' = 'admin'
);
CREATE POLICY "admin_all_replies" ON replies FOR ALL USING (
  auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'user_role' = 'admin'
);
CREATE POLICY "admin_all_reports" ON community_reports FOR ALL USING (
  auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'user_role' = 'admin'
);
CREATE POLICY "admin_all_suspensions" ON user_suspensions FOR ALL USING (
  auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'user_role' = 'admin'
);

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Auto-update topic last_activity_at on new reply
CREATE OR REPLACE FUNCTION update_topic_last_activity()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE topics SET last_activity_at = NOW() WHERE id = NEW.topic_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_topic_activity
AFTER INSERT ON replies
FOR EACH ROW EXECUTE FUNCTION update_topic_last_activity();

-- Auto-hide content after 3 reports
CREATE OR REPLACE FUNCTION auto_hide_reported_content()
RETURNS TRIGGER AS $$
DECLARE
  report_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO report_count
  FROM community_reports
  WHERE content_type = NEW.content_type AND content_id = NEW.content_id;

  IF report_count >= 3 THEN
    IF NEW.content_type = 'topic' THEN
      UPDATE topics SET is_hidden = TRUE WHERE id = NEW.content_id;
    ELSIF NEW.content_type = 'reply' THEN
      UPDATE replies SET is_hidden = TRUE WHERE id = NEW.content_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_hide_content
AFTER INSERT ON community_reports
FOR EACH ROW EXECUTE FUNCTION auto_hide_reported_content();

-- Rate limiting reset (run daily via cron)
CREATE OR REPLACE FUNCTION reset_daily_post_rates()
RETURNS void AS $$
BEGIN
  UPDATE user_post_rate
  SET topic_count_today = 0,
      reply_count_today = 0,
      last_reset_date = CURRENT_DATE
  WHERE last_reset_date < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- Rate limit check function
CREATE OR REPLACE FUNCTION check_post_rate_limit(p_user_id UUID, p_type TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  v_rate RECORD;
  v_daily_topic_limit INTEGER := 10;
  v_daily_reply_limit INTEGER := 50;
  v_min_seconds_between_posts INTEGER := 30;
BEGIN
  SELECT * INTO v_rate FROM user_post_rate WHERE user_id = p_user_id;

  IF NOT FOUND THEN
    INSERT INTO user_post_rate (user_id) VALUES (p_user_id);
    RETURN TRUE;
  END IF;

  -- Reset if new day
  IF v_rate.last_reset_date < CURRENT_DATE THEN
    UPDATE user_post_rate SET topic_count_today = 0, reply_count_today = 0, last_reset_date = CURRENT_DATE WHERE user_id = p_user_id;
    v_rate.topic_count_today := 0;
    v_rate.reply_count_today := 0;
  END IF;

  -- Check daily limits
  IF p_type = 'topic' AND v_rate.topic_count_today >= v_daily_topic_limit THEN
    RETURN FALSE;
  END IF;
  IF p_type = 'reply' AND v_rate.reply_count_today >= v_daily_reply_limit THEN
    RETURN FALSE;
  END IF;

  -- Check time between posts
  IF p_type = 'topic' AND v_rate.last_topic_at IS NOT NULL THEN
    IF EXTRACT(EPOCH FROM (NOW() - v_rate.last_topic_at)) < v_min_seconds_between_posts THEN
      RETURN FALSE;
    END IF;
  END IF;
  IF p_type = 'reply' AND v_rate.last_reply_at IS NOT NULL THEN
    IF EXTRACT(EPOCH FROM (NOW() - v_rate.last_reply_at)) < v_min_seconds_between_posts THEN
      RETURN FALSE;
    END IF;
  END IF;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Increment rate counter
CREATE OR REPLACE FUNCTION increment_post_rate(p_user_id UUID, p_type TEXT)
RETURNS void AS $$
BEGIN
  IF p_type = 'topic' THEN
    UPDATE user_post_rate
    SET topic_count_today = topic_count_today + 1, last_topic_at = NOW()
    WHERE user_id = p_user_id;
  ELSE
    UPDATE user_post_rate
    SET reply_count_today = reply_count_today + 1, last_reply_at = NOW()
    WHERE user_id = p_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Enable Realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE community_notifications;
```

- [x] Run migration: `npx supabase db push`
- [x] 🧪 **Manual Test:** Insert test forum via Supabase dashboard
- [x] 🔄 **COMMIT:** `git add . && git commit -m "Add community forums schema"`

---

### 6.2 Wire Up Existing Hooks (4 hours)

#### 6.2.1 Update useForums Hook
- [x] Update `/src/hooks/useForums.js` to use Supabase:

```javascript
// Key changes:
// 1. Replace mock data imports with Supabase queries
// 2. Add error handling
// 3. Add loading states

import { supabase } from '@/lib/supabase';

export function useForums() {
  // ... fetch from forums table with subforums
  // SELECT *, (SELECT COUNT(*) FROM topics WHERE forum_id = forums.id) as topic_count
}
```

- [x] 🧪 **Test:** Forums page loads real data
- [x] 🔄 **COMMIT:** `git add . && git commit -m "Wire useForums to Supabase"`

#### 6.2.2 Update useTopics Hook
- [x] Update `/src/hooks/useTopics.js` to use Supabase:
  - Fetch topics with author info (join user_profiles)
  - Include reaction counts
  - Respect is_hidden and deleted_at
  - Handle pagination
- [x] Add rate limit check before createTopic
- [x] Add honeypot validation
- [x] 🧪 **Test:** Create topic, view topics list
- [x] 🔄 **COMMIT:** `git add . && git commit -m "Wire useTopics to Supabase"`

#### 6.2.3 Update useReplies Hook
- [ ] Update `/src/hooks/useReplies.js` to use Supabase:
  - Fetch replies with author info
  - Handle threading (parent_reply_id)
  - Include reaction counts
  - Respect is_hidden and deleted_at
- [x] Add rate limit check before createReply
- [x] Add honeypot validation
- [x] 🧪 **Test:** Post reply, view threaded replies
- [ ] 🔄 **COMMIT:** `git add . && git commit -m "Wire useReplies to Supabase"`

#### 6.2.4 Create useReactions Hook
- [x] Create `/src/hooks/useReactions.js`:
  - toggleReaction(contentType, contentId, reactionType)
  - getReactions(contentType, contentId)
- [ ] 🧪 **Test:** Like/unlike topic and reply
- [ ] 🔄 **COMMIT:** `git add . && git commit -m "Add useReactions hook"`

#### 6.2.5 Create useUserBlocks Hook
- [x] Create `/src/hooks/useUserBlocks.js`:
  - blockUser(userId)
  - unblockUser(userId)
  - isBlocked(userId)
  - blockedUsers list
- [x] 🧪 **Test:** Block user, verify their content hidden
- [ ] 🔄 **COMMIT:** `git add . && git commit -m "Add useUserBlocks hook"`

---

### 6.3 Admin Moderation (6 hours)

#### 6.3.1 Admin Reports Page
**Route:** `/admin/community/reports`

- [x] Create `/src/pages/admin/AdminCommunityReportsPage.jsx`:
  - Tab filters: All, Pending, Reviewed, Dismissed, Actioned
  - Report card showing: content preview, reporter, reason, timestamp
  - Actions: View content, Dismiss, Hide content, Suspend user
  - Bulk actions for multiple reports
- [x] Create `/src/hooks/useAdminReports.js`:
  - fetchReports(status)
  - updateReportStatus(id, status, notes)
  - hideContent(contentType, contentId)
- [x] Create `/src/components/features/admin/ReportCard.jsx`
- [x] Create `/src/components/features/admin/ReportActionSheet.jsx`
- [x] Update router: add `/admin/community/reports`
- [x] 🎭 **Playwright Test:** Create `tests/admin-community-reports.spec.cjs`:

```javascript
import { test, expect } from '@playwright/test';

test.describe('Admin Community Reports', () => {
  test('displays pending reports', async ({ page }) => {
    await page.goto('/admin/community/reports');
    await expect(page.getByRole('heading', { name: /reports/i })).toBeVisible();
  });

  test('can dismiss a report', async ({ page }) => {
    await page.goto('/admin/community/reports');
    await page.getByTestId('report-card').first().getByRole('button', { name: /dismiss/i }).click();
    await expect(page.getByText(/report dismissed/i)).toBeVisible();
  });

  test('can hide reported content', async ({ page }) => {
    await page.goto('/admin/community/reports');
    await page.getByTestId('report-card').first().getByRole('button', { name: /hide content/i }).click();
    await expect(page.getByText(/content hidden/i)).toBeVisible();
  });

  test('can suspend user from report', async ({ page }) => {
    await page.goto('/admin/community/reports');
    await page.getByTestId('report-card').first().getByRole('button', { name: /suspend user/i }).click();
    await page.getByLabel(/reason/i).fill('Repeated violations');
    await page.getByRole('button', { name: /confirm/i }).click();
    await expect(page.getByText(/user suspended/i)).toBeVisible();
  });
});
```

- [x] Run: `npx playwright test tests/admin-community-reports.spec.cjs`
- [ ] 🔄 **COMMIT:** `git add . && git commit -m "Add admin reports page"`

#### 6.3.2 Admin User Suspensions Page
**Route:** `/admin/community/suspensions`

- [x] Create `/src/pages/admin/AdminSuspensionsPage.jsx`:
  - Active suspensions list
  - Suspension history
  - Create suspension form (user search, reason, duration)
  - Lift suspension action
- [x] Create `/src/hooks/useAdminSuspensions.js`:
  - fetchSuspensions()
  - createSuspension(userId, reason, duration)
  - liftSuspension(id)
- [x] Update router: add `/admin/community/suspensions`
- [x] 🎭 **Playwright Test:** Add to `tests/admin-community-reports.spec.cjs`:

```javascript
test('can create new suspension', async ({ page }) => {
  await page.goto('/admin/community/suspensions');
  await page.getByRole('button', { name: /new suspension/i }).click();
  await page.getByLabel(/user/i).fill('testuser@example.com');
  await page.getByLabel(/reason/i).fill('Spam');
  await page.getByLabel(/duration/i).selectOption('7_days');
  await page.getByRole('button', { name: /suspend/i }).click();
  await expect(page.getByText(/suspended/i)).toBeVisible();
});

test('can lift suspension', async ({ page }) => {
  await page.goto('/admin/community/suspensions');
  await page.getByTestId('suspension-row').first().getByRole('button', { name: /lift/i }).click();
  await expect(page.getByText(/suspension lifted/i)).toBeVisible();
});
```

- [x] 🔄 **COMMIT:** `git add . && git commit -m "Add admin suspensions page"`

#### 6.3.3 Update Admin Navigation
- [x] Add "Community" section to admin sidebar:
  - Reports (with unread badge)
  - Suspensions
- [x] 🔄 **COMMIT:** `git add . && git commit -m "Add community to admin nav"`

---

### 6.4 Spam Prevention (4.5 hours)

#### 6.4.1 Honeypot Fields (30 min)
- [x] Update `NewTopicSheet.jsx` to include honeypot:

```jsx
// Hidden field - bots fill this, humans don't
<input
  type="text"
  name="website"
  className="sr-only"
  tabIndex={-1}
  autoComplete="off"
  value={honeypot}
  onChange={(e) => setHoneypot(e.target.value)}
/>
```

- [x] Update `ReplyForm.jsx` with same pattern
- [x] Update hooks to check honeypot before submit
- [x] 🧪 **Manual Test:** Submit with filled honeypot → rejected
- [x] 🔄 **COMMIT:** `git add . && git commit -m "Add honeypot spam detection"`

#### 6.4.2 Profanity Filter (1 hour)
- [x] Create `/src/lib/profanityFilter.js`:

```javascript
// Simple word list filter
export async function containsProfanity(text) {
  const { data: words } = await supabase.from('profanity_words').select('word');
  const wordList = words.map(w => w.word.toLowerCase());
  const textLower = text.toLowerCase();
  return wordList.some(word => textLower.includes(word));
}

export function sanitizeText(text) {
  // Replace profanity with asterisks
}
```

- [x] Seed `profanity_words` table with initial word list
- [x] Integrate into topic/reply creation
- [x] Show user-friendly error: "Please revise your message"
- [ ] 🧪 **Manual Test:** Submit with profanity → rejected with message
- [ ] 🔄 **COMMIT:** `git add . && git commit -m "Add profanity filter"`

#### 6.4.3 StopForumSpam Integration (2 hours)
- [ ] Create `/src/lib/spamCheck.js`:

```javascript
const STOPFORUMSPAM_API = 'https://api.stopforumspam.org/api';

export async function checkSpammer(email, ip) {
  // Check cache first
  const { data: cached } = await supabase
    .from('spam_check_cache')
    .select('*')
    .eq('ip_address', ip)
    .single();

  if (cached && cached.checked_at > new Date(Date.now() - 24 * 60 * 60 * 1000)) {
    return cached.is_spammer;
  }

  // Query StopForumSpam API
  const response = await fetch(
    `${STOPFORUMSPAM_API}?email=${encodeURIComponent(email)}&ip=${ip}&json`
  );
  const data = await response.json();

  const isSpammer = data.email?.appears > 0 || data.ip?.appears > 0;
  const confidence = Math.max(data.email?.confidence || 0, data.ip?.confidence || 0);

  // Cache result
  await supabase.from('spam_check_cache').upsert({
    ip_address: ip,
    is_spammer: isSpammer,
    confidence,
    checked_at: new Date().toISOString()
  });

  return isSpammer && confidence > 50; // Only flag high-confidence spammers
}
```

- [ ] Add spam check to first post by new users
- [ ] Log flagged users for admin review (don't auto-block)
- [ ] 🧪 **Manual Test:** Check known spam email/IP → flagged
- [ ] 🔄 **COMMIT:** `git add . && git commit -m "Add StopForumSpam integration"`

#### 6.4.4 @Mention Validation (1 hour)
- [ ] Create `/src/lib/mentionValidator.js`:

```javascript
export async function validateMentions(content) {
  // Extract @mentions from content
  const mentions = content.match(/@(\w+)/g) || [];
  const usernames = mentions.map(m => m.slice(1));

  // Check which users exist and are active
  const { data: validUsers } = await supabase
    .from('user_profiles')
    .select('preferred_name')
    .in('preferred_name', usernames);

  const validUsernames = validUsers.map(u => u.preferred_name);
  const invalidMentions = usernames.filter(u => !validUsernames.includes(u));

  return {
    valid: invalidMentions.length === 0,
    invalidMentions
  };
}
```

- [ ] Add warning when @mentioning non-existent user: "User @xyz not found"
- [ ] 🧪 **Manual Test:** @mention invalid user → warning shown
- [ ] 🔄 **COMMIT:** `git add . && git commit -m "Add @mention validation"`

---

### 6.5 In-App Notifications (3 hours)

#### 6.5.1 Create useNotifications Hook
- [x] Create `/src/hooks/useCommunityNotifications.js`:
  - Supabase realtime subscription for new notifications
  - markAsRead(notificationId)
  - markAllAsRead()
  - unreadCount
- [ ] 🧪 **Test:** Notification appears when someone replies to your topic
- [ ] 🔄 **COMMIT:** `git add . && git commit -m "Add community notifications hook"`

#### 6.5.2 Create Notification Bell Component
- [x] Create `/src/components/features/community/NotificationBell.jsx`:
  - Bell icon with unread count badge
  - Dropdown showing recent notifications
  - Click notification → navigate to content
  - "Mark all as read" button
- [x] Add to Header component
- [ ] 🎭 **Playwright Test:** Create `tests/community-notifications.spec.cjs`:

```javascript
import { test, expect } from '@playwright/test';

test.describe('Community Notifications', () => {
  test('notification bell shows unread count', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.getByTestId('notification-bell')).toBeVisible();
    // With mock data, expect some unread
    await expect(page.getByTestId('unread-badge')).toBeVisible();
  });

  test('clicking bell opens notifications dropdown', async ({ page }) => {
    await page.goto('/dashboard');
    await page.getByTestId('notification-bell').click();
    await expect(page.getByTestId('notifications-dropdown')).toBeVisible();
  });

  test('clicking notification navigates to content', async ({ page }) => {
    await page.goto('/dashboard');
    await page.getByTestId('notification-bell').click();
    await page.getByTestId('notification-item').first().click();
    await expect(page).toHaveURL(/community\/forums/);
  });

  test('mark all as read clears badge', async ({ page }) => {
    await page.goto('/dashboard');
    await page.getByTestId('notification-bell').click();
    await page.getByRole('button', { name: /mark all/i }).click();
    await expect(page.getByTestId('unread-badge')).not.toBeVisible();
  });
});
```

- [ ] Run: `npx playwright test tests/community-notifications.spec.cjs`
- [ ] 🔄 **COMMIT:** `git add . && git commit -m "Add notification bell component"`

#### 6.5.3 Create Notification Triggers
- [x] Add database triggers to create notifications:
  - When someone replies to your topic
  - When someone replies to your reply
  - When someone @mentions you
  - When someone reacts to your content
- [ ] 🧪 **Manual Test:** Reply to topic → author gets notification
- [ ] 🔄 **COMMIT:** `git add . && git commit -m "Add notification triggers"`

---

### 6.6 Activity Feed Widget (1 hour)

#### 6.6.1 Create Dashboard Community Widget
- [x] Create `/src/components/features/dashboard/CommunityActivityWidget.jsx`:
  - Shows 3-5 recent forum topics
  - "New topic in [Forum]: [Title]" format
  - Link to full forums page
  - Empty state: "No recent activity"
- [x] Add to DashboardPage.jsx
- [ ] 🎭 **Playwright Test:** Add to `tests/dashboard.spec.cjs`:

```javascript
test('dashboard shows community activity widget', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page.getByTestId('community-activity-widget')).toBeVisible();
});

test('community widget links to forums', async ({ page }) => {
  await page.goto('/dashboard');
  await page.getByTestId('community-activity-widget').getByRole('link', { name: /view all/i }).click();
  await expect(page).toHaveURL('/community/forums');
});
```

- [ ] 🔄 **COMMIT:** `git add . && git commit -m "Add community activity widget to dashboard"`

---

### 6.7 QA & Testing (2 hours)

#### 6.7.1 Playwright E2E Tests
- [ ] Create `tests/community-forums.spec.cjs` (update existing if needed):

```javascript
import { test, expect } from '@playwright/test';

test.describe('Community Forums', () => {
  test('forums page displays forum list', async ({ page }) => {
    await page.goto('/community/forums');
    await expect(page.getByRole('heading', { name: /forums/i })).toBeVisible();
    await expect(page.getByTestId('forum-card')).toHaveCount({ min: 1 });
  });

  test('can navigate to forum topics', async ({ page }) => {
    await page.goto('/community/forums');
    await page.getByTestId('forum-card').first().click();
    await expect(page.getByTestId('topic-card')).toHaveCount({ min: 0 });
  });

  test('can create new topic', async ({ page }) => {
    await page.goto('/community/forums/1');
    await page.getByRole('button', { name: /new topic/i }).click();
    await page.getByLabel(/title/i).fill('Test Topic Title');
    await page.getByTestId('rich-text-editor').fill('This is the topic content.');
    await page.getByRole('button', { name: /post/i }).click();
    await expect(page.getByText(/topic created/i)).toBeVisible();
  });

  test('can reply to topic', async ({ page }) => {
    await page.goto('/community/forums/1/1001');
    await page.getByTestId('reply-form').fill('This is a reply.');
    await page.getByRole('button', { name: /reply/i }).click();
    await expect(page.getByText(/reply posted/i)).toBeVisible();
  });

  test('can report content', async ({ page }) => {
    await page.goto('/community/forums/1/1001');
    await page.getByTestId('topic-actions').click();
    await page.getByRole('menuitem', { name: /report/i }).click();
    await page.getByLabel(/reason/i).fill('This is spam');
    await page.getByRole('button', { name: /submit/i }).click();
    await expect(page.getByText(/reported/i)).toBeVisible();
  });

  test('can block user', async ({ page }) => {
    await page.goto('/community/forums/1/1001');
    // Navigate to user profile or use action menu
    await page.getByRole('button', { name: /block/i }).click();
    await expect(page.getByText(/blocked/i)).toBeVisible();
  });

  test('rate limiting prevents spam', async ({ page }) => {
    await page.goto('/community/forums/1');
    // Try to create topics rapidly
    for (let i = 0; i < 3; i++) {
      await page.getByRole('button', { name: /new topic/i }).click();
      await page.getByLabel(/title/i).fill(`Spam Topic ${i}`);
      await page.getByTestId('rich-text-editor').fill('Spam content');
      await page.getByRole('button', { name: /post/i }).click();
    }
    // Should see rate limit message
    await expect(page.getByText(/slow down|rate limit/i)).toBeVisible();
  });
});
```

- [ ] Run: `npx playwright test tests/community-forums.spec.cjs`
- [ ] Run: `npx playwright test tests/admin-community-reports.spec.cjs`
- [ ] Run: `npx playwright test tests/community-notifications.spec.cjs`

#### 6.7.2 Manual Testing Checklist
- [ ] 🧪 **Flow:** Forums → Topics → Topic Detail → Reply
- [ ] 🧪 **Flow:** Create topic → Edit topic → Delete topic
- [ ] 🧪 **Flow:** Report content → Admin sees report → Admin hides content
- [ ] 🧪 **Flow:** Admin suspends user → User can't post
- [ ] 🧪 **Test:** Block user → Their content hidden from you
- [ ] 🧪 **Test:** Honeypot filled → Submission rejected
- [ ] 🧪 **Test:** Profanity in post → Warning shown
- [ ] 🧪 **Test:** Rapid posting → Rate limited
- [ ] 🧪 **Test:** Invalid @mention → Warning shown
- [ ] 🧪 **Test:** Reply to topic → Topic author gets notification
- [ ] 🧪 **Test:** Notification bell shows count, dropdown works
- [ ] 🧪 **Test:** Dashboard activity widget shows recent topics
- [ ] 🧪 **Test:** All pages at 375px, 768px, 1024px

#### 6.7.3 Fix Issues
- [ ] Log issues in `/docs/project/issues.md`
- [ ] Fix critical issues
- [ ] 🔄 **COMMIT:** `git add . && git commit -m "Phase 6 QA fixes"`

---

### 6.8 Phase 6 Wrap-up

- [ ] Update `/docs/project/status.md` - mark Phase 6 complete
- [ ] 🔄 **COMMIT:** `git add . && git commit -m "Complete Phase 6: Custom Supabase Community"`
- [ ] 🎉 **CELEBRATE!** Phase 6 done!

---

### Phase 6 Summary

| Category | Count |
|----------|-------|
| New Database Tables | 12 |
| Admin Pages | 2 |
| New Hooks | 4 |
| New Components | 5 |
| Estimated Hours | ~23 |

**Features Built:**
- Custom Supabase forums (no BuddyBoss dependency)
- Admin moderation: reports queue, user suspensions
- Spam prevention: honeypot, profanity filter, rate limiting, StopForumSpam
- In-app notifications with realtime
- Dashboard activity widget
- User blocking
- @mention validation

**What's NOT Included (deferred):**
- Groups feature (skipped for MVP)
- Private messaging between members (use marketplace messaging)
- Email notifications (add via Groundhogg later)
- Akismet integration (add if spam becomes issue)
- Member connections/friends

---

## Phase 7: Polish + Handoff

**Target:** Dec 15 | **Estimated Total Time:** 4-6 hours

### 7.1 Full QA Pass (2 hours)

- [ ] 🤖 **Run QA Agent:** "QA phase - full application walkthrough"
- [ ] Test every page at 375px (mobile)
- [ ] Test every page at 768px (tablet)
- [ ] Test every page at 1024px (desktop)
- [ ] Test in Chrome
- [ ] Test in Safari (if available)
- [ ] Test in Firefox (if available)
- [ ] Document all issues in `/docs/project/issues.md`
- [ ] 🔄 **COMMIT:** `git add . && git commit -m "Full QA documentation"`

### 7.2 Fix Critical Issues (1-2 hours)

- [ ] Review issues.md
- [ ] Fix all Critical (🔴) issues
- [ ] Fix all High (🟠) issues
- [ ] Log remaining issues for dev team
- [ ] 🔄 **COMMIT:** `git add . && git commit -m "Fix critical and high priority issues"`

### 7.3 Documentation Updates (1 hour)

- [ ] Update `/docs/project/status.md` with final status
- [ ] Review `/docs/project/handoff.md` - add any missing info
- [ ] Search codebase for all TODO comments
- [ ] Document all TODO locations in handoff.md
- [ ] Update API contracts if any changes discovered
- [ ] 🔄 **COMMIT:** `git add . && git commit -m "Update documentation for handoff"`

### 7.4 Deploy Final Build (30 min)

- [ ] Run `npm run build` - verify it succeeds
- [ ] Run `npm run preview` - test production build locally
- [ ] Deploy to Vercel (if not already connected): `npx vercel --prod`
- [ ] Test production URL
- [ ] 🔄 **COMMIT:** `git add . && git commit -m "Final production build"`

### 7.5 Handoff Prep (30 min)

- [ ] Create list of questions for dev team
- [ ] Note any concerns or risks
- [ ] Prepare walkthrough demo notes
- [ ] 📖 Review `/docs/skills/handoff-checklist.md` - verify all items checked
- [ ] 🔄 **COMMIT:** `git add . && git commit -m "Complete Phase 7: Ready for handoff"`

### 7.6 DONE! 🎉

- [ ] Update status.md - mark project complete
- [ ] Share Vercel URL with team
- [ ] Schedule handoff meeting
- [ ] 🎉 **MAJOR CELEBRATION!** You built an entire app!

---

## Quick Reference

### Commit Message Format
```
git add . && git commit -m "Your message here"
```

### Starting Each Session
Say: **"Boot up"** - Claude will check status and tell you what's next

### Getting Help
- **"QA this"** - Claude checks current work
- **"PM status"** - Get project status report
- **"Research: [topic]"** - Deep dive on a topic
- **"Write copy for [X]"** - Get UI text

### When Stuck
1. Re-read the relevant skill file
2. Ask Claude to explain
3. Break the task into smaller pieces
4. Log blocker in issues.md and move to next task

---

## Time Estimates Summary

| Phase | Estimated Time | Focus |
|-------|---------------|-------|
| Phase 1 | 4-6 hours | Design System + Components |
| Phase 2 | 8-12 hours | Applicant Core Pages |
| Phase 2.5 | Complete | Data Layer Systems |
| Phase 3 | ~4 weeks | Marketplace (Applicant Side) |
| Phase 4 | ~2-3 weeks | Marketplace (Provider Side) |
| Phase 5 | 8-10 hours | Additional Features |
| Phase 5.5 | ~8-10 weeks | Custom LMS (Editor.js + Supabase) |
| Phase 6 | ~23 hours | Custom Supabase Forums (no Groups) |
| Phase 7 | 4-6 hours | Polish + Handoff |
| **Total** | **~18-22 weeks** | |

### Marketplace Summary (Phases 3 + 4)

| Category | Applicant | Provider | Total |
|----------|-----------|----------|-------|
| Pages | 10 | 9 | 19 |
| Components | 25+ | 20+ | 45+ |
| Hooks | 7 | - | 7 |
| Estimated Time | 4 weeks | 2-3 weeks | 6-7 weeks |

**Key Integrations:**
- Cal.com Platform API (scheduling)
- Stripe Connect (payments, 20% commission)
- Supabase Realtime (messaging)
- SendGrid (email via Groundhogg)

**Reference:** Full Cal.com integration plan at `~/.claude/plans/parsed-kindling-honey.md`

### LMS Summary (Phase 5.5)

| Category | Count |
|----------|-------|
| Supabase Tables | 7 |
| Hooks | 10 |
| Admin Pages | 6 |
| User Pages | 3 |
| Components | 30+ |
| Estimated Time | 8-10 weeks |

**Key Features:**
- Editor.js block-based content editing (Notion-like)
- Autosave + 5-level undo/redo
- Image upload to Supabase Storage
- 3-layer download aggregation (category + manual + exclusions)
- Full platform search (⌘+K modal)
- Gamification (3 points per lesson completion)
- Entitlement-based access control

**Reference:** Full implementation plan at `/docs/project/lms-implementation-plan.md`
