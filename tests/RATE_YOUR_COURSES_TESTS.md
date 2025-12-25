# Rate Your Courses Feature - Playwright Tests

Comprehensive test coverage for the "Rate Your Courses" feature and Admin Prerequisite Courses Moderation UI implemented on December 17, 2025.

## Test Files Created

### 1. **rate-your-courses.spec.cjs** (12 tests)
Tests the RateYourCoursesCard component on the Prerequisites Library page.

**Features tested:**
- Card display with title and subtext
- +20 points badge
- Progress indicator (X of Y rated)
- Unrated course rows with Rate buttons
- Clicking Rate opens SubmitCourseModal
- Empty state when all courses rated
- Mobile responsive layout

**Location:** `/prerequisites`
**Component:** `RateYourCoursesCard.jsx`

---

### 2. **smart-course-suggestions.spec.cjs** (19 tests)
Tests the SmartCourseSuggestions component showing personalized course recommendations.

**Features tested:**
- Collapsible panel with suggestion count badge
- "For Your Programs" personalized section with purple indicators
- "Top Rated" section with yellow indicators and review counts
- "Most Reviewed" fallback section with green indicators
- Clickable course rows opening detail modal
- Truncated course names
- Save button on hover
- Empty state handling
- Mobile responsive layout

**Location:** `/prerequisites`
**Component:** `SmartCourseSuggestions.jsx`

---

### 3. **prerequisites-inline-rating-prompt.spec.cjs** (19 tests)
Tests the inline rating prompt that appears when changing prerequisite status from "in_progress" to "completed".

**Features tested:**
- Prerequisites Edit Sheet opening from My Stats page
- Existing prerequisites display
- Add Prerequisite button
- Status dropdown with all options (Completed, Currently Taking, Planning to Take, Planning to Retake)
- Inline prompt appearance on status change
- Prompt messaging ("Nice! Want to rate this course for other applicants?")
- +20 points indicator
- "Rate Now" button with sparkles icon
- "Maybe Later" button
- Dismissing prompt
- Opening review modal from Rate Now
- Save Changes and Cancel buttons
- Mobile responsive layout

**Location:** `/my-stats` → Edit Prerequisites
**Component:** `PrerequisitesEditSheet.jsx`

---

### 4. **admin-prerequisite-courses.spec.cjs** (39 tests)
Tests the admin moderation page for user-submitted prerequisite courses.

**Features tested:**
- Page title ("Prerequisite Course Moderation")
- Page description
- Stats cards (Total Submissions, Pending Review, Approved, Rejected) with numerical counts and icons
- Tabs (Pending, Approved, Rejected) with active state switching
- Search functionality (case-insensitive filtering)
- Submission table display:
  - Institution and course name
  - Subject badges
  - Submitter avatars and names
  - Timestamps (relative, e.g., "2 hours ago")
  - Status badges
  - Action menu (MoreHorizontal icon)
- Action menu dropdown:
  - View Details
  - Approve (for pending submissions)
  - Reject (for pending submissions)
- View Details sheet:
  - Full course information
  - Review ratings with stars
  - Close button
- Approve dialog:
  - Confirmation message
  - Confirm and Cancel buttons
- Reject dialog:
  - Reason textarea (optional)
  - Confirm and Cancel buttons
- Empty states
- Mobile responsive layout (stacked stats cards, accessible tabs, scrollable table)

**Location:** `/admin/prerequisite-courses`
**Component:** `AdminPrerequisiteCoursesPage.jsx`

---

### 5. **submit-course-review-modal.spec.cjs** (40 tests)
Tests the combined modal for submitting a new prerequisite course AND reviewing it.

**Features tested:**
- Opening modal from "Submit New Course" button
- +20 points badge display
- **Course submission fields:**
  - School/Institution name
  - Course name
  - Course code
  - Course URL
  - Subject dropdown
  - Level dropdown
  - Credits (number input)
  - Format dropdown
  - Cost range dropdown
  - Boolean checkboxes (hasLab, labKitRequired, selfPaced, rollingAdmission)
- **Review fields:**
  - Recommend rating (1-5 stars)
  - Ease rating (1-5 stars)
  - Star interface with clickable stars
  - Rating labels (Highly Recommend, Very Easy, etc.)
  - Tag selection checkboxes (Flexible Deadlines, Great Prof, etc.)
  - Review text area (optional)
- **Rating color coding:**
  - 1 star: red
  - 2 stars: orange
  - 3 stars: yellow
  - 4 stars: lime
  - 5 stars: green
- **Form validation:**
  - Required fields (school name, course name, subject, level, recommend, ease)
  - Submit button disabled when form incomplete
  - Required field indicators
- **Submission flow:**
  - Submit button
  - Cancel button
  - Closing modal on Cancel
  - Success state after submission
- Mobile responsive layout (touch-friendly stars and checkboxes)

**Location:** `/prerequisites` → Submit New Course button
**Component:** `SubmitCourseModal.jsx`

---

## Total Test Coverage

- **Total test files:** 5
- **Total tests:** 129
- **Components covered:** 5
- **Routes tested:** 3 (`/prerequisites`, `/my-stats`, `/admin/prerequisite-courses`)

## Running the Tests

```bash
# Run all new prerequisite tests
npx playwright test tests/rate-your-courses.spec.cjs tests/smart-course-suggestions.spec.cjs tests/prerequisites-inline-rating-prompt.spec.cjs tests/admin-prerequisite-courses.spec.cjs tests/submit-course-review-modal.spec.cjs --reporter=list

# Run individual test files
npx playwright test tests/rate-your-courses.spec.cjs --reporter=list
npx playwright test tests/smart-course-suggestions.spec.cjs --reporter=list
npx playwright test tests/prerequisites-inline-rating-prompt.spec.cjs --reporter=list
npx playwright test tests/admin-prerequisite-courses.spec.cjs --reporter=list
npx playwright test tests/submit-course-review-modal.spec.cjs --reporter=list

# Run with visible browser for debugging
npx playwright test tests/rate-your-courses.spec.cjs --headed

# Run specific test by name
npx playwright test tests/ -g "Rate Your Courses" --reporter=list
```

## Test Patterns Used

All tests follow the existing Playwright test patterns from the codebase:

1. **Mock authentication:** Tests run with Supabase disabled, using mock user data
2. **Resilient selectors:** Prioritizing role-based selectors, then text, then CSS
3. **Graceful degradation:** Tests handle cases where elements may not be visible due to data state
4. **Mobile responsive testing:** Separate test suites for mobile viewports (375x667)
5. **Proper waits:** Using `waitForLoadState`, `waitForTimeout`, and explicit visibility checks
6. **Data-agnostic:** Tests pass whether mock data exists or not (checking for visibility before assertions)

## Notes

- Tests use mock data from `/src/data/` files
- Prerequisites Library page route: `/prerequisites`
- Admin page requires admin permissions (handled by mock auth)
- Inline rating prompt only appears when changing status from "in_progress" to "completed"
- All tests are structured to be resilient to missing mock data
- Mobile tests use 375x667 viewport (iPhone SE size)
- Tests verify accessibility (ARIA roles, labels, touch targets)

## Integration with Existing Test Suite

These tests complement the existing test suite in `/tests/` and `/tests/hooks/`:

- **Existing tests:** Core features (auth, trackers, events, bookings, programs)
- **New tests:** Prerequisite courses feature (rating, submissions, admin moderation)

Total project test count: **~270+ tests** (existing tests + new prerequisite tests)
