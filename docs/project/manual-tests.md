# Manual Test Plan

> **Version:** 1.0 | **Last Updated:** December 13, 2024
> **Total Test Cases:** ~400 | **Estimated Execution Time:** 8-12 hours (full suite)

---

## How to Use This Document

### Test Execution
1. Work through test cases in order within each section
2. Check off each pass criterion as you verify it
3. Log any failures in `/docs/project/issues.md` using the template at the end
4. Update "Last Tested" dates when completing sections

### Symbols & Conventions
- `TC-XXX-###` = Test Case ID (Section-Number)
- `**Preconditions:**` = Setup required before test
- `**Pass Criteria:**` = All checkboxes must pass for test to pass
- `[ ]` = Unchecked (test not run or failed)
- `[x]` = Checked (test passed)

### Priority Levels
- **P0 (Critical):** Test every release - auth, payments, data persistence
- **P1 (High):** Test weekly - CRUD operations, core flows
- **P2 (Medium):** Test before major releases - empty states, error handling
- **P3 (Low):** Test periodically - edge cases, accessibility

---

## Test Environment Setup

### Prerequisites
```bash
# 1. Start development server
npm run dev

# 2. Clear browser data for clean state
# Chrome: Settings → Privacy → Clear browsing data

# 3. Open DevTools Console to monitor for errors
# Chrome: F12 or Cmd+Option+I
```

### Test Accounts
| Role | How to Access |
|------|---------------|
| Applicant | Default mock user (auto-loaded) |
| Provider/SRNA | Navigate to `/marketplace/provider/dashboard` |
| Admin | Navigate to `/admin` |

### Browser Requirements
- Chrome 120+ (primary testing browser)
- Test responsive layouts using DevTools device toolbar
- Keep Console open to catch JavaScript errors

---

# Section 1: Applicant Pages

## 1.1 Dashboard Page

**Route:** `/dashboard`
**Last Tested:** _Not yet tested_
**Priority:** P0

### TC-DASH-001: Page loads successfully

**Preconditions:** Dev server running, navigate to `/dashboard`
**Steps:**
1. Open browser to `http://localhost:5173/dashboard`
2. Wait for page to fully load
**Expected Result:** Dashboard renders with all widgets
**Pass Criteria:**
- [ ] Page loads without white screen
- [ ] No console errors (red messages)
- [ ] Header with logo visible
- [ ] Sidebar navigation visible (desktop) or bottom nav (mobile)

### TC-DASH-002: To-Do List widget displays

**Preconditions:** Dashboard loaded
**Steps:**
1. Locate "To-Do List" widget
2. Verify content displays
**Expected Result:** Widget shows tasks or empty state
**Pass Criteria:**
- [ ] Widget has "To-Do List" heading
- [ ] Tasks display with checkboxes (if data exists)
- [ ] Empty state shows if no tasks: icon + message + CTA
- [ ] "Add Task" button visible

### TC-DASH-003: To-Do task completion toggle

**Preconditions:** Dashboard loaded, at least 1 task visible
**Steps:**
1. Click checkbox next to a task
2. Observe visual change
3. Refresh page
**Expected Result:** Task marked complete, persists
**Pass Criteria:**
- [ ] Checkbox shows checked state immediately
- [ ] Task text styling changes (strikethrough or muted)
- [ ] Points toast appears ("+X points")
- [ ] Task remains checked after page refresh

### TC-DASH-004: To-Do task add new

**Preconditions:** Dashboard loaded
**Steps:**
1. Click "Add Task" or "+" button
2. Enter task text: "Test task"
3. Click Save/Enter
**Expected Result:** New task appears in list
**Pass Criteria:**
- [ ] Input field appears on click
- [ ] Can type task text
- [ ] Save button creates task
- [ ] New task appears at top/bottom of list
- [ ] Task persists after refresh

### TC-DASH-005: To-Do task edit

**Preconditions:** Dashboard loaded, at least 1 task exists
**Steps:**
1. Click edit icon/button on task (hover to reveal if needed)
2. Modify text
3. Save changes
**Expected Result:** Task text updated
**Pass Criteria:**
- [ ] Edit mode activates on click
- [ ] Can modify text
- [ ] Save persists changes
- [ ] Cancel discards changes

### TC-DASH-006: To-Do task delete

**Preconditions:** Dashboard loaded, at least 1 task exists
**Steps:**
1. Click delete icon on task
2. Confirm deletion if prompted
**Expected Result:** Task removed from list
**Pass Criteria:**
- [ ] Delete confirmation appears (if destructive)
- [ ] Task disappears from list
- [ ] Task does not return after refresh

### TC-DASH-007: Target Programs widget displays

**Preconditions:** Dashboard loaded
**Steps:**
1. Locate "Target Programs" or "My Programs" widget
2. Verify content
**Expected Result:** Shows up to 2 target programs or empty state
**Pass Criteria:**
- [ ] Widget heading visible
- [ ] Program cards show (if user has targets): name, image, progress %
- [ ] Empty state shows if no targets: "Find Programs" CTA
- [ ] "View All" link visible (if 2+ programs)

### TC-DASH-008: Target Program card click navigation

**Preconditions:** Dashboard loaded, at least 1 target program visible
**Steps:**
1. Click on a program card
**Expected Result:** Navigates to program detail page
**Pass Criteria:**
- [ ] Click is responsive (hover state visible)
- [ ] URL changes to `/my-programs/:id`
- [ ] Program detail page loads

### TC-DASH-009: Application Milestones widget displays

**Preconditions:** Dashboard loaded
**Steps:**
1. Locate "Application Milestones" section
**Expected Result:** Carousel or list of milestones
**Pass Criteria:**
- [ ] Milestones visible as cards/items
- [ ] Each shows: title, progress indicator
- [ ] Can scroll/navigate if carousel

### TC-DASH-010: Milestone card expand/detail

**Preconditions:** Dashboard loaded, milestones visible
**Steps:**
1. Click on a milestone card
**Expected Result:** Detail modal or expansion shows sub-items
**Pass Criteria:**
- [ ] Click triggers expansion or modal
- [ ] Sub-items/checklist visible
- [ ] Can check off sub-items
- [ ] Close/collapse works

### TC-DASH-011: Sidebar - Smart Nudges display

**Preconditions:** Dashboard loaded on desktop (1024px+)
**Steps:**
1. Look at right sidebar
2. Find "Smart Nudges" or "What's Next" section
**Expected Result:** Personalized action suggestions
**Pass Criteria:**
- [ ] At least 1 nudge visible
- [ ] Nudge has actionable text
- [ ] Click nudge navigates or opens relevant content

### TC-DASH-012: Onboarding modal - First visit

**Preconditions:** Clear localStorage, fresh user state
**Steps:**
1. Clear localStorage: `localStorage.clear()` in console
2. Refresh page
**Expected Result:** Onboarding modal appears
**Pass Criteria:**
- [ ] Modal opens automatically
- [ ] Welcome screen with "Let's Do This" button
- [ ] Cannot interact with background while modal open
- [ ] Can close/skip if option provided

### TC-DASH-013: Dashboard - Mobile layout (375px)

**Preconditions:** DevTools open, viewport set to 375px width
**Steps:**
1. Set viewport to 375px × 667px
2. Navigate to `/dashboard`
**Expected Result:** Mobile-optimized layout
**Pass Criteria:**
- [ ] Bottom navigation visible (not sidebar)
- [ ] Content stacks vertically
- [ ] All widgets accessible via scroll
- [ ] No horizontal scrollbar
- [ ] Touch targets ≥ 44px

### TC-DASH-014: Dashboard - Tablet layout (768px)

**Preconditions:** DevTools open, viewport set to 768px width
**Steps:**
1. Set viewport to 768px × 1024px
2. Navigate to `/dashboard`
**Expected Result:** Tablet-optimized layout
**Pass Criteria:**
- [ ] Sidebar may or may not appear (depends on breakpoint)
- [ ] Widgets may be 2-column
- [ ] All content accessible
- [ ] No horizontal scrollbar

### TC-DASH-015: Dashboard - Empty state (new user)

**Preconditions:** User with no data (or mock empty state)
**Steps:**
1. Navigate to dashboard as user with no programs/tasks
**Expected Result:** Helpful empty states throughout
**Pass Criteria:**
- [ ] To-Do shows empty state with "Add your first task"
- [ ] Programs shows "Find Programs" CTA
- [ ] Milestones shows getting started guidance
- [ ] No broken UI or "undefined" text

---

## 1.2 My Programs Page

**Route:** `/my-programs`
**Last Tested:** _Not yet tested_
**Priority:** P1

### TC-PROG-001: Page loads with sections

**Preconditions:** Navigate to `/my-programs`
**Steps:**
1. Open `/my-programs`
2. Wait for load
**Expected Result:** Two sections visible
**Pass Criteria:**
- [ ] "Target Programs" section visible
- [ ] "Saved Programs" section visible
- [ ] Both sections have appropriate content or empty states

### TC-PROG-002: Target program cards display

**Preconditions:** User has target programs
**Steps:**
1. View Target Programs section
**Expected Result:** Program cards with details
**Pass Criteria:**
- [ ] Each card shows: school name, image/logo
- [ ] Deadline displayed (if set)
- [ ] Progress percentage shown
- [ ] Deadline urgency indicator (red if <14 days)

### TC-PROG-003: Saved program cards display

**Preconditions:** User has saved (non-target) programs
**Steps:**
1. View Saved Programs section
**Expected Result:** Simpler cards for saved programs
**Pass Criteria:**
- [ ] Cards show school name
- [ ] "Make Target" action available
- [ ] "Unsave" action available

### TC-PROG-004: Click target program - Navigate to detail

**Preconditions:** Target programs visible
**Steps:**
1. Click on a target program card
**Expected Result:** Navigate to detail page
**Pass Criteria:**
- [ ] URL changes to `/my-programs/:id`
- [ ] Detail page loads with program info

### TC-PROG-005: Drag program from Saved to Target

**Preconditions:** Have both saved and target programs
**Steps:**
1. Click and hold a saved program card
2. Drag toward Target Programs section
3. Drop in target area
**Expected Result:** Program converts to target
**Pass Criteria:**
- [ ] Drag cursor activates
- [ ] Drop zone highlights on hover
- [ ] Program moves to Target section
- [ ] Confirmation toast or visual feedback

### TC-PROG-006: Drag program from Target to Saved

**Preconditions:** Have target programs
**Steps:**
1. Drag target program to Saved section
**Expected Result:** Program demoted to saved
**Pass Criteria:**
- [ ] Confirmation dialog appears (warns about losing checklist progress)
- [ ] Cancel keeps program as target
- [ ] Confirm moves to Saved section

### TC-PROG-007: "Make Target" button on saved program

**Preconditions:** Saved programs visible
**Steps:**
1. Hover/click on saved program card
2. Click "Make Target" button
**Expected Result:** Program becomes target
**Pass Criteria:**
- [ ] Button visible (hover or always visible)
- [ ] Click promotes to Target section
- [ ] Card now appears with full target styling

### TC-PROG-008: "Unsave" button on saved program

**Preconditions:** Saved programs visible
**Steps:**
1. Click "Unsave" or heart icon on saved program
**Expected Result:** Program removed from saved list
**Pass Criteria:**
- [ ] Confirmation if destructive
- [ ] Program disappears from Saved section
- [ ] Can re-save from School Database

### TC-PROG-009: "Find Programs" navigation

**Preconditions:** Page loaded
**Steps:**
1. Click "Find Programs" button/link
**Expected Result:** Navigate to school database
**Pass Criteria:**
- [ ] URL changes to `/schools`
- [ ] School Database page loads

### TC-PROG-010: Empty state - No target programs

**Preconditions:** User has no target programs
**Steps:**
1. View Target Programs section
**Expected Result:** Helpful empty state
**Pass Criteria:**
- [ ] Empty state message displayed
- [ ] CTA to add programs
- [ ] No broken layout

### TC-PROG-011: Empty state - No saved programs

**Preconditions:** User has no saved programs
**Steps:**
1. View Saved Programs section
**Expected Result:** Helpful empty state
**Pass Criteria:**
- [ ] Empty state message displayed
- [ ] CTA to browse schools

### TC-PROG-012: Mobile responsive (375px)

**Preconditions:** Viewport 375px
**Steps:**
1. Navigate to `/my-programs` at 375px
**Expected Result:** Mobile layout
**Pass Criteria:**
- [ ] Cards stack vertically
- [ ] Drag-and-drop may be disabled or simplified
- [ ] All actions accessible via tap
- [ ] No horizontal scroll

---

## 1.3 Target Program Detail Page

**Route:** `/my-programs/:programId`
**Last Tested:** _Not yet tested_
**Priority:** P1

### TC-TPROG-001: Page loads with program data

**Preconditions:** Valid program ID in URL
**Steps:**
1. Navigate to `/my-programs/prog_duke_crna` (or valid ID)
**Expected Result:** Program detail page loads
**Pass Criteria:**
- [ ] Program name in header
- [ ] School logo/image displayed
- [ ] No console errors

### TC-TPROG-002: Application status dropdown

**Preconditions:** Detail page loaded
**Steps:**
1. Find status dropdown (e.g., "Researching")
2. Click to open options
3. Select different status
**Expected Result:** Status updates
**Pass Criteria:**
- [ ] Dropdown opens with options: Researching, Applying, Interview Scheduled, Accepted, Declined, Waitlisted
- [ ] Selection updates immediately
- [ ] Status persists after refresh

### TC-TPROG-003: Application checklist displays

**Preconditions:** Detail page loaded
**Steps:**
1. Find "Application Checklist" section
**Expected Result:** Dynamic checklist based on program requirements
**Pass Criteria:**
- [ ] Checklist items visible
- [ ] Each item has checkbox
- [ ] Progress percentage shown
- [ ] Items may be expandable for details

### TC-TPROG-004: Checklist item toggle

**Preconditions:** Checklist visible
**Steps:**
1. Click checkbox on a checklist item
**Expected Result:** Item marked complete
**Pass Criteria:**
- [ ] Checkbox shows checked state
- [ ] Progress percentage updates
- [ ] Visual feedback (strikethrough, color change)
- [ ] State persists after refresh

### TC-TPROG-005: Add custom checklist item

**Preconditions:** Checklist visible
**Steps:**
1. Click "Add Item" or "+" button
2. Enter custom item text
3. Save
**Expected Result:** Custom item added
**Pass Criteria:**
- [ ] Input field appears
- [ ] Can enter text
- [ ] Item appears in checklist
- [ ] Limit enforced (max 3 custom items per implementation)

### TC-TPROG-006: Remove custom checklist item

**Preconditions:** Custom item exists
**Steps:**
1. Click remove/X on custom item
**Expected Result:** Item removed
**Pass Criteria:**
- [ ] Item disappears
- [ ] Progress recalculates
- [ ] Cannot remove default items

### TC-TPROG-007: Tabs - Tasks tab

**Preconditions:** Detail page loaded
**Steps:**
1. Click "Tasks" tab
**Expected Result:** Program-specific tasks display
**Pass Criteria:**
- [ ] Tab becomes active
- [ ] Tasks list shows (or empty state)
- [ ] Can add/complete tasks

### TC-TPROG-008: Tabs - Letters of Rec tab

**Preconditions:** Detail page loaded
**Steps:**
1. Click "LOR" or "Letters of Rec" tab
**Expected Result:** LOR tracking interface
**Pass Criteria:**
- [ ] Tab becomes active
- [ ] LOR entries display (or empty state)
- [ ] Can add new LOR entry
- [ ] Shows: Recommender name, status, due date

### TC-TPROG-009: Tabs - Documents tab

**Preconditions:** Detail page loaded
**Steps:**
1. Click "Documents" tab
**Expected Result:** Document management interface
**Pass Criteria:**
- [ ] Tab becomes active
- [ ] Document list shows (or empty state)
- [ ] Can upload/link documents

### TC-TPROG-010: Program notes section

**Preconditions:** Detail page loaded
**Steps:**
1. Find "Notes" section
2. Type in notes textarea
3. Wait or click save
**Expected Result:** Notes save (auto-save or manual)
**Pass Criteria:**
- [ ] Textarea is editable
- [ ] Content saves (check for save indicator)
- [ ] Notes persist after refresh

### TC-TPROG-011: Requirements section expand/collapse

**Preconditions:** Detail page loaded
**Steps:**
1. Find "Requirements" section
2. Click expand/collapse toggle
**Expected Result:** Section expands/collapses
**Pass Criteria:**
- [ ] Toggle icon changes direction
- [ ] Content shows/hides
- [ ] Smooth animation

### TC-TPROG-012: Helpful resources section

**Preconditions:** Detail page loaded
**Steps:**
1. Find "Helpful Resources" or similar section
**Expected Result:** Contextual resources based on checklist
**Pass Criteria:**
- [ ] Resources relevant to incomplete items show
- [ ] Links are clickable
- [ ] Opens in new tab (external links)

### TC-TPROG-013: Not found - Invalid program ID

**Preconditions:** Invalid program ID in URL
**Steps:**
1. Navigate to `/my-programs/invalid_id_123`
**Expected Result:** Error state with navigation
**Pass Criteria:**
- [ ] Error message displayed (not white screen)
- [ ] "Back to Programs" or similar link
- [ ] No console crash

### TC-TPROG-014: Mobile layout - Two-column collapse

**Preconditions:** Viewport 375px
**Steps:**
1. Navigate to program detail at 375px
**Expected Result:** Single-column layout
**Pass Criteria:**
- [ ] Content stacks vertically
- [ ] Checklist full-width
- [ ] Tabs accessible
- [ ] All functionality available

### TC-TPROG-015: Add LOR entry

**Preconditions:** LOR tab active
**Steps:**
1. Click "Add Recommender" or "+"
2. Fill form: Name, Email, Status
3. Save
**Expected Result:** LOR entry created
**Pass Criteria:**
- [ ] Form/modal opens
- [ ] Can fill required fields
- [ ] Entry appears in list
- [ ] Status tracking works (Requested, Received, Submitted)

### TC-TPROG-016: Update LOR status

**Preconditions:** LOR entry exists
**Steps:**
1. Click on LOR entry or status dropdown
2. Change status (e.g., Requested → Received)
**Expected Result:** Status updates
**Pass Criteria:**
- [ ] Dropdown/edit interface works
- [ ] Status updates immediately
- [ ] Visual indicator changes

### TC-TPROG-017: Delete LOR entry

**Preconditions:** LOR entry exists
**Steps:**
1. Click delete on LOR entry
2. Confirm deletion
**Expected Result:** Entry removed
**Pass Criteria:**
- [ ] Confirmation dialog
- [ ] Entry disappears
- [ ] Does not return after refresh

### TC-TPROG-018: Deadline alert display

**Preconditions:** Program has deadline set
**Steps:**
1. View program with approaching deadline
**Expected Result:** Deadline alert visible
**Pass Criteria:**
- [ ] Alert visible if deadline <60 days
- [ ] Color coded: Red (<14 days), Yellow (<30 days), Blue (<60 days)
- [ ] Shows days remaining

---

## 1.4 My Trackers Page

**Route:** `/trackers` or `/trackers/:tab`
**Last Tested:** _Not yet tested_
**Priority:** P1

### TC-TRACK-001: Page loads with tabs

**Preconditions:** Navigate to `/trackers`
**Steps:**
1. Open `/trackers`
**Expected Result:** Tabbed interface loads
**Pass Criteria:**
- [ ] Four tabs visible: Clinical, EQ, Shadow, Events
- [ ] Default tab selected (Clinical)
- [ ] Tab content loads

### TC-TRACK-002: Tab navigation - URL persistence

**Preconditions:** Page loaded
**Steps:**
1. Click "EQ" tab
2. Check URL
3. Refresh page
**Expected Result:** URL and tab state persist
**Pass Criteria:**
- [ ] URL changes to `/trackers/eq`
- [ ] After refresh, EQ tab still selected
- [ ] Content matches selected tab

### TC-TRACK-003: Clinical tab - Entry form

**Preconditions:** Clinical tab active
**Steps:**
1. Find entry form
2. Fill fields: Date, Unit, Hours, Acuity, Notes
3. Submit
**Expected Result:** Entry created
**Pass Criteria:**
- [ ] Form fields visible
- [ ] Date picker works
- [ ] Unit dropdown/selection works
- [ ] Submit creates entry
- [ ] Entry appears in log

### TC-TRACK-004: Clinical tab - Entry log display

**Preconditions:** Clinical tab, entries exist
**Steps:**
1. View entry log/history
**Expected Result:** Entries displayed
**Pass Criteria:**
- [ ] Entries show in list or table
- [ ] Shows: Date, Unit, Hours, Notes
- [ ] Sorted by date (recent first)

### TC-TRACK-005: Clinical tab - Edit entry

**Preconditions:** Entry exists
**Steps:**
1. Click edit on an entry
2. Modify data
3. Save
**Expected Result:** Entry updated
**Pass Criteria:**
- [ ] Edit mode activates
- [ ] Fields are editable
- [ ] Save persists changes
- [ ] Updated data displays

### TC-TRACK-006: Clinical tab - Delete entry

**Preconditions:** Entry exists
**Steps:**
1. Click delete on entry
2. Confirm
**Expected Result:** Entry removed
**Pass Criteria:**
- [ ] Confirmation dialog
- [ ] Entry disappears
- [ ] Stats recalculate

### TC-TRACK-007: Clinical tab - Stats summary

**Preconditions:** Clinical tab active
**Steps:**
1. View stats/summary section
**Expected Result:** Aggregated statistics
**Pass Criteria:**
- [ ] Total hours displayed
- [ ] Hours by unit type shown
- [ ] Acuity score calculated

### TC-TRACK-008: EQ tab - Reflection form

**Preconditions:** EQ tab active
**Steps:**
1. Find reflection entry form
2. Fill: Date, Situation, Reflection, Rating
3. Submit
**Expected Result:** Reflection saved
**Pass Criteria:**
- [ ] Form fields visible
- [ ] Can select emotional category
- [ ] Text area for reflection
- [ ] Rating selector works
- [ ] Entry appears in log

### TC-TRACK-009: EQ tab - Reflection prompts

**Preconditions:** EQ tab active
**Steps:**
1. Look for reflection prompts/suggestions
**Expected Result:** Guided prompts displayed
**Pass Criteria:**
- [ ] Prompts visible
- [ ] Can click prompt to start reflection
- [ ] Prompt text helpful for self-reflection

### TC-TRACK-010: Shadow tab - Log entry

**Preconditions:** Shadow tab active
**Steps:**
1. Fill shadow day form: Date, Location, CRNA Name, Hours
2. Submit
**Expected Result:** Shadow entry created
**Pass Criteria:**
- [ ] Form accepts input
- [ ] Entry appears in log
- [ ] Total hours update

### TC-TRACK-011: Shadow tab - Summary stats

**Preconditions:** Shadow tab, entries exist
**Steps:**
1. View summary section
**Expected Result:** Shadow statistics
**Pass Criteria:**
- [ ] Total hours displayed
- [ ] Number of shadow days
- [ ] Progress toward goal (if applicable)

### TC-TRACK-012: Events tab - Event log

**Preconditions:** Events tab active
**Steps:**
1. View events attended
**Expected Result:** Event list
**Pass Criteria:**
- [ ] Events display: Name, Date, Type
- [ ] Can add new event attendance
- [ ] Can mark events as attended

### TC-TRACK-013: Events tab - Add event

**Preconditions:** Events tab active
**Steps:**
1. Click "Add Event" or "+"
2. Fill: Event name, Date, Type
3. Save
**Expected Result:** Event added
**Pass Criteria:**
- [ ] Form/modal opens
- [ ] Fields editable
- [ ] Entry appears in log

### TC-TRACK-014: Mobile layout - Tab scrolling

**Preconditions:** Viewport 375px
**Steps:**
1. Navigate to `/trackers` at 375px
**Expected Result:** Tabs accessible
**Pass Criteria:**
- [ ] Tabs may scroll horizontally or stack
- [ ] All tabs accessible
- [ ] Content displays properly

### TC-TRACK-015: Data persistence across sessions

**Preconditions:** Entries added
**Steps:**
1. Add an entry
2. Close browser
3. Reopen and navigate to trackers
**Expected Result:** Data persists
**Pass Criteria:**
- [ ] Entry still visible
- [ ] All fields intact
- [ ] No data loss

### TC-TRACK-016: Points awarded for tracking

**Preconditions:** Gamification enabled
**Steps:**
1. Add a new entry (any tab)
2. Observe for points toast
**Expected Result:** Points awarded
**Pass Criteria:**
- [ ] Points toast appears
- [ ] Shows points amount and reason
- [ ] Points add to total (check header or profile)

---

## 1.5 My Stats Page

**Route:** `/my-stats`
**Last Tested:** _Not yet tested_
**Priority:** P1

### TC-STATS-001: Page loads with profile sections

**Preconditions:** Navigate to `/my-stats`
**Steps:**
1. Open `/my-stats`
**Expected Result:** Profile snapshot page loads
**Pass Criteria:**
- [ ] Hero section with avatar and user info
- [ ] Academic section visible
- [ ] Clinical section visible
- [ ] Multiple editable sections present

### TC-STATS-002: Hero section - User info display

**Preconditions:** Page loaded
**Steps:**
1. View hero/header section
**Expected Result:** User profile info
**Pass Criteria:**
- [ ] Avatar/photo displayed
- [ ] Name displayed
- [ ] Level/points indicator
- [ ] Application stage badge

### TC-STATS-003: GPA card display

**Preconditions:** Page loaded
**Steps:**
1. Find GPA section
**Expected Result:** GPA information displayed
**Pass Criteria:**
- [ ] Overall GPA shown (or "Not Set")
- [ ] Science GPA shown (if separate)
- [ ] Edit button visible

### TC-STATS-004: GPA edit sheet

**Preconditions:** Page loaded
**Steps:**
1. Click Edit on GPA card
2. Fill/modify GPA values
3. Save
**Expected Result:** GPA updates
**Pass Criteria:**
- [ ] Edit sheet/modal opens
- [ ] Can enter Overall GPA (0.0-4.0)
- [ ] Can enter Science GPA
- [ ] Validation prevents invalid values
- [ ] Save updates display
- [ ] Close/cancel discards changes

### TC-STATS-005: GRE scores display and edit

**Preconditions:** Page loaded
**Steps:**
1. Find GRE section
2. Click Edit
3. Enter scores
4. Save
**Expected Result:** GRE scores saved
**Pass Criteria:**
- [ ] Verbal, Quantitative, Writing fields
- [ ] Validation for score ranges
- [ ] "Not Taken" or N/A option
- [ ] Saves correctly

### TC-STATS-006: Certifications display

**Preconditions:** Page loaded
**Steps:**
1. Find Certifications section
**Expected Result:** Certification list
**Pass Criteria:**
- [ ] CCRN status highlighted
- [ ] Other certs listed (ACLS, BLS, PALS, etc.)
- [ ] Edit button visible

### TC-STATS-007: Certifications edit

**Preconditions:** Certifications section visible
**Steps:**
1. Click Edit
2. Toggle certifications on/off
3. Save
**Expected Result:** Certifications updated
**Pass Criteria:**
- [ ] Checkbox/toggle for each cert
- [ ] Can select/deselect
- [ ] Changes persist after save

### TC-STATS-008: Prerequisites section

**Preconditions:** Page loaded
**Steps:**
1. Find Prerequisites section
**Expected Result:** Prerequisite courses tracking
**Pass Criteria:**
- [ ] List of required prerequisites
- [ ] Completion status per course
- [ ] Progress indicator

### TC-STATS-009: Prerequisites edit

**Preconditions:** Prerequisites visible
**Steps:**
1. Click Edit on Prerequisites
2. Mark courses complete/incomplete
3. Add grade if applicable
4. Save
**Expected Result:** Prerequisites updated
**Pass Criteria:**
- [ ] Can toggle completion
- [ ] Can enter grades
- [ ] Progress recalculates

### TC-STATS-010: Clinical experience summary

**Preconditions:** Page loaded
**Steps:**
1. Find Clinical Experience section
**Expected Result:** Summary of clinical data
**Pass Criteria:**
- [ ] Total hours displayed
- [ ] ICU type shown
- [ ] Acuity badge/indicator
- [ ] "View Tracker" link works

### TC-STATS-011: Shadow hours summary

**Preconditions:** Page loaded
**Steps:**
1. Find Shadow Days section
**Expected Result:** Shadow statistics
**Pass Criteria:**
- [ ] Total hours shown
- [ ] Number of sessions
- [ ] "View Tracker" link works

### TC-STATS-012: EQ reflections summary

**Preconditions:** Page loaded
**Steps:**
1. Find EQ section
**Expected Result:** EQ overview
**Pass Criteria:**
- [ ] Number of reflections
- [ ] Recent reflection preview (optional)
- [ ] "View Tracker" link works

### TC-STATS-013: Resume boosters section

**Preconditions:** Page loaded
**Steps:**
1. Find Leadership/Research/Community section
**Expected Result:** Resume booster entries
**Pass Criteria:**
- [ ] Sections for Leadership, Research, Volunteering
- [ ] Entries display or empty state
- [ ] Edit button available

### TC-STATS-014: Resume boosters edit

**Preconditions:** Resume section visible
**Steps:**
1. Click Edit on Leadership section
2. Add entry: Title, Organization, Description
3. Save
**Expected Result:** Entry added
**Pass Criteria:**
- [ ] Form fields available
- [ ] Can add multiple entries
- [ ] Entries display after save

### TC-STATS-015: ReadyScore display

**Preconditions:** Page loaded
**Steps:**
1. Find ReadyScore section (sidebar on desktop)
**Expected Result:** ReadyScore or qualitative breakdown
**Pass Criteria:**
- [ ] Score or progress bars visible
- [ ] Breakdown by category
- [ ] Weekly focus/priority shown
- [ ] Tooltip or explanation available

### TC-STATS-016: Notes section

**Preconditions:** Page loaded
**Steps:**
1. Find Notes section
**Expected Result:** Notes display
**Pass Criteria:**
- [ ] User notes editable
- [ ] Admin notes visible (read-only)
- [ ] Mentor notes visible (read-only)

### TC-STATS-017: Notes edit

**Preconditions:** Notes section visible
**Steps:**
1. Type in user notes area
2. Save or auto-save
**Expected Result:** Notes saved
**Pass Criteria:**
- [ ] Can type in textarea
- [ ] Save indicator shows
- [ ] Notes persist after refresh

### TC-STATS-018: Mobile layout - Sidebar becomes footer

**Preconditions:** Viewport 375px
**Steps:**
1. Navigate to `/my-stats` at 375px
**Expected Result:** ReadyScore moves to bottom
**Pass Criteria:**
- [ ] Content stacks vertically
- [ ] ReadyScore at bottom or collapsible
- [ ] All edit buttons accessible
- [ ] No horizontal scroll

### TC-STATS-019: Priority actions section

**Preconditions:** Page loaded
**Steps:**
1. Find Priority Actions or "What's Next" section
**Expected Result:** Actionable recommendations
**Pass Criteria:**
- [ ] List of suggested actions
- [ ] Based on profile gaps
- [ ] Clickable to relevant section

### TC-STATS-020: All edit sheets - Cancel behavior

**Preconditions:** Any edit sheet open
**Steps:**
1. Open any edit sheet
2. Make changes
3. Click Cancel or X
**Expected Result:** Changes discarded
**Pass Criteria:**
- [ ] Sheet closes
- [ ] Original values remain
- [ ] No partial saves

---

## 1.6 School Database Page

**Route:** `/schools`
**Last Tested:** _Not yet tested_
**Priority:** P1

### TC-SCHOOL-001: Page loads with school grid

**Preconditions:** Navigate to `/schools`
**Steps:**
1. Open `/schools`
**Expected Result:** School database interface loads
**Pass Criteria:**
- [ ] Search bar visible
- [ ] Filter options visible
- [ ] School cards display in grid
- [ ] Results count shown

### TC-SCHOOL-002: Search schools by name

**Preconditions:** Page loaded
**Steps:**
1. Type school name in search (e.g., "Duke")
2. Observe results
**Expected Result:** Filtered results
**Pass Criteria:**
- [ ] Results filter in real-time
- [ ] Matching schools shown
- [ ] Results count updates
- [ ] "No results" if no match

### TC-SCHOOL-003: Filter by state

**Preconditions:** Page loaded
**Steps:**
1. Open state filter
2. Select a state (e.g., "California")
**Expected Result:** Schools filtered by state
**Pass Criteria:**
- [ ] Filter dropdown works
- [ ] Only CA schools shown
- [ ] Active filter displayed
- [ ] Can clear filter

### TC-SCHOOL-004: Filter by deadline

**Preconditions:** Page loaded
**Steps:**
1. Apply deadline filter (e.g., "Next 3 months")
**Expected Result:** Schools filtered by deadline
**Pass Criteria:**
- [ ] Filter options available
- [ ] Results match criteria
- [ ] Schools with no deadline handled appropriately

### TC-SCHOOL-005: Sort schools

**Preconditions:** Page loaded
**Steps:**
1. Click sort dropdown
2. Select "Fit Score" or "Name A-Z"
**Expected Result:** Schools reorder
**Pass Criteria:**
- [ ] Sort options available
- [ ] Order changes correctly
- [ ] Sort persists while browsing

### TC-SCHOOL-006: School card - Fit score display

**Preconditions:** Cards visible
**Steps:**
1. View school cards
**Expected Result:** Fit scores shown
**Pass Criteria:**
- [ ] Fit score badge on each card
- [ ] Score is percentage or grade
- [ ] Higher scores highlighted

### TC-SCHOOL-007: School card - Save to list

**Preconditions:** Cards visible
**Steps:**
1. Click heart/bookmark icon on card
**Expected Result:** School saved
**Pass Criteria:**
- [ ] Icon changes state (filled heart)
- [ ] Toast confirmation
- [ ] School appears in saved tray (if visible)

### TC-SCHOOL-008: School card - Unsave

**Preconditions:** School is saved
**Steps:**
1. Click heart icon again
**Expected Result:** School unsaved
**Pass Criteria:**
- [ ] Icon changes back (outline heart)
- [ ] School removed from saved tray

### TC-SCHOOL-009: School card - Click to profile

**Preconditions:** Cards visible
**Steps:**
1. Click on school card (not heart icon)
**Expected Result:** Navigate to school profile
**Pass Criteria:**
- [ ] URL changes to `/schools/:id`
- [ ] School profile page loads

### TC-SCHOOL-010: View modes - Recommended vs All

**Preconditions:** Page loaded
**Steps:**
1. Click "Recommended" or "For You" tab
2. Click "All" tab
**Expected Result:** View changes
**Pass Criteria:**
- [ ] Recommended shows personalized order
- [ ] All shows complete list
- [ ] Different results/order between views

### TC-SCHOOL-011: Saved programs tray

**Preconditions:** Schools saved
**Steps:**
1. Look for saved schools tray (bottom or sidebar)
**Expected Result:** Tray shows saved schools
**Pass Criteria:**
- [ ] Tray visible
- [ ] Shows saved schools
- [ ] Can expand/collapse
- [ ] Can remove from tray

### TC-SCHOOL-012: Clear all filters

**Preconditions:** Filters applied
**Steps:**
1. Apply 2+ filters
2. Click "Clear Filters" button
**Expected Result:** All filters reset
**Pass Criteria:**
- [ ] Button visible when filters active
- [ ] Click resets all filters
- [ ] Full results return

### TC-SCHOOL-013: Empty results state

**Preconditions:** Filters that match no schools
**Steps:**
1. Apply filters that yield 0 results
**Expected Result:** Empty state
**Pass Criteria:**
- [ ] "No schools match" message
- [ ] Suggestion to adjust filters
- [ ] Clear filters button

### TC-SCHOOL-014: Mobile filter sheet

**Preconditions:** Viewport 375px
**Steps:**
1. Navigate to `/schools` at 375px
2. Click filter button
**Expected Result:** Filter sheet opens
**Pass Criteria:**
- [ ] Filter button visible (not inline filters)
- [ ] Click opens full-screen or bottom sheet
- [ ] All filters accessible
- [ ] Apply/Close buttons work

---

## 1.7 School Profile Page

**Route:** `/schools/:schoolId`
**Last Tested:** _Not yet tested_
**Priority:** P1

### TC-SPROF-001: Page loads with school data

**Preconditions:** Valid school ID
**Steps:**
1. Navigate to `/schools/sch_duke` (or valid ID)
**Expected Result:** School profile loads
**Pass Criteria:**
- [ ] School name in header
- [ ] Logo/image displayed
- [ ] No console errors

### TC-SPROF-002: Fit score display

**Preconditions:** Page loaded
**Steps:**
1. View header section
**Expected Result:** Fit score visible
**Pass Criteria:**
- [ ] Fit score badge/number
- [ ] Score is calculated based on user profile
- [ ] Tooltip explains score (optional)

### TC-SPROF-003: Save/Unsave button

**Preconditions:** Page loaded
**Steps:**
1. Click Save button
2. Click again to Unsave
**Expected Result:** Toggle save state
**Pass Criteria:**
- [ ] Button state changes
- [ ] Toast feedback
- [ ] State persists after refresh

### TC-SPROF-004: Make Target button

**Preconditions:** Page loaded
**Steps:**
1. Click "Make Target" or "Add to Targets"
**Expected Result:** School becomes target program
**Pass Criteria:**
- [ ] Button changes to "Remove from Targets" or disabled
- [ ] School appears in My Programs as target
- [ ] Checklist created

### TC-SPROF-005: Deadline alert

**Preconditions:** School has deadline within 60 days
**Steps:**
1. View school with upcoming deadline
**Expected Result:** Deadline alert visible
**Pass Criteria:**
- [ ] Alert banner/badge shows
- [ ] Color coded by urgency
- [ ] Days remaining displayed

### TC-SPROF-006: Fast facts section

**Preconditions:** Page loaded
**Steps:**
1. View fast facts section
**Expected Result:** Key school info
**Pass Criteria:**
- [ ] Tuition displayed
- [ ] Program length shown
- [ ] Class size shown
- [ ] Location displayed

### TC-SPROF-007: Requirements tab

**Preconditions:** Page loaded
**Steps:**
1. Click Requirements tab
**Expected Result:** Admission requirements
**Pass Criteria:**
- [ ] GPA requirements
- [ ] Experience requirements
- [ ] Certification requirements
- [ ] Prerequisites listed

### TC-SPROF-008: Application tab

**Preconditions:** Page loaded
**Steps:**
1. Click Application tab
**Expected Result:** Application information
**Pass Criteria:**
- [ ] Application deadline
- [ ] Required materials
- [ ] Application portal link
- [ ] Interview info (if available)

### TC-SPROF-009: Reviews tab

**Preconditions:** Page loaded
**Steps:**
1. Click Reviews tab
**Expected Result:** Student reviews
**Pass Criteria:**
- [ ] Reviews list or empty state
- [ ] Star ratings
- [ ] Review text
- [ ] Reviewer info (anonymized if needed)

### TC-SPROF-010: Quick actions - Visit website

**Preconditions:** Page loaded
**Steps:**
1. Click "Visit Website" or external link
**Expected Result:** Opens school website
**Pass Criteria:**
- [ ] Opens in new tab
- [ ] Correct URL loads

### TC-SPROF-011: Recommended mentors widget

**Preconditions:** Page loaded, mentors available
**Steps:**
1. View "Recommended Mentors" section
**Expected Result:** Mentor suggestions
**Pass Criteria:**
- [ ] Shows mentors from this program
- [ ] Click navigates to mentor profile
- [ ] "View More" link if applicable

### TC-SPROF-012: Not found - Invalid school ID

**Preconditions:** Invalid ID in URL
**Steps:**
1. Navigate to `/schools/invalid_123`
**Expected Result:** Error state
**Pass Criteria:**
- [ ] Error message (not white screen)
- [ ] Back button/link
- [ ] No crash

---

## 1.8 Prerequisite Library Page

**Route:** `/prerequisites`
**Last Tested:** _Not yet tested_
**Priority:** P2

### TC-PREREQ-001: Page loads with course list

**Preconditions:** Navigate to `/prerequisites`
**Steps:**
1. Open `/prerequisites`
**Expected Result:** Course library loads
**Pass Criteria:**
- [ ] Search bar visible
- [ ] Course cards display
- [ ] Filter options available

### TC-PREREQ-002: Search courses

**Preconditions:** Page loaded
**Steps:**
1. Type in search (e.g., "Chemistry")
**Expected Result:** Filtered results
**Pass Criteria:**
- [ ] Results filter in real-time
- [ ] Matching courses shown
- [ ] Clear search works

### TC-PREREQ-003: Filter by subject

**Preconditions:** Page loaded
**Steps:**
1. Select subject filter (e.g., "Science")
**Expected Result:** Filtered by subject
**Pass Criteria:**
- [ ] Only science courses shown
- [ ] Filter indicator visible
- [ ] Can clear filter

### TC-PREREQ-004: Course card - Rating display

**Preconditions:** Cards visible
**Steps:**
1. View course cards
**Expected Result:** Ratings shown
**Pass Criteria:**
- [ ] Star rating visible
- [ ] Review count shown
- [ ] Higher rated courses distinguishable

### TC-PREREQ-005: Course card - Save course

**Preconditions:** Cards visible
**Steps:**
1. Click save/bookmark on course
**Expected Result:** Course saved
**Pass Criteria:**
- [ ] Icon state changes
- [ ] Course appears in Saved view

### TC-PREREQ-006: Course detail modal

**Preconditions:** Cards visible
**Steps:**
1. Click on course card
**Expected Result:** Detail modal opens
**Pass Criteria:**
- [ ] Modal with course details
- [ ] Provider info
- [ ] Reviews section
- [ ] Link to enroll/view

### TC-PREREQ-007: Write review modal

**Preconditions:** Course detail open
**Steps:**
1. Click "Write Review"
2. Fill review: Rating, Text
3. Submit
**Expected Result:** Review submitted
**Pass Criteria:**
- [ ] Modal opens
- [ ] Can select star rating
- [ ] Can write review text
- [ ] Submit adds review
- [ ] Review appears in list

### TC-PREREQ-008: Submit new course

**Preconditions:** Page loaded
**Steps:**
1. Click "Submit Course" or "Add Course"
2. Fill form: Name, Provider, Subject, Link
3. Submit
**Expected Result:** Course suggestion submitted
**Pass Criteria:**
- [ ] Modal/form opens
- [ ] Required fields validated
- [ ] Success confirmation
- [ ] Submitted for admin review (or auto-added)

### TC-PREREQ-009: View modes - All vs Saved

**Preconditions:** Courses saved
**Steps:**
1. Click "Saved" tab/toggle
**Expected Result:** Only saved courses shown
**Pass Criteria:**
- [ ] View switches
- [ ] Only saved courses visible
- [ ] Can unsave from this view

### TC-PREREQ-010: Empty state - No saved courses

**Preconditions:** No courses saved
**Steps:**
1. Switch to Saved view
**Expected Result:** Empty state
**Pass Criteria:**
- [ ] Helpful message
- [ ] CTA to browse courses

---

## 1.9 Learning Library Page

**Route:** `/learn`
**Last Tested:** _Not yet tested_
**Priority:** P1

### TC-LEARN-001: Page loads with module grid

**Preconditions:** Navigate to `/learn`
**Steps:**
1. Open `/learn`
**Expected Result:** Learning modules display
**Pass Criteria:**
- [ ] Module cards in grid
- [ ] Search bar visible
- [ ] Category filter available

### TC-LEARN-002: Search modules

**Preconditions:** Page loaded
**Steps:**
1. Type in search
**Expected Result:** Filtered results
**Pass Criteria:**
- [ ] Results filter
- [ ] Matching modules shown

### TC-LEARN-003: Filter by category

**Preconditions:** Page loaded
**Steps:**
1. Select category filter
**Expected Result:** Modules filtered
**Pass Criteria:**
- [ ] Only category modules shown
- [ ] Filter indicator visible

### TC-LEARN-004: Module card - Progress display

**Preconditions:** Cards visible, progress exists
**Steps:**
1. View module cards
**Expected Result:** Progress shown
**Pass Criteria:**
- [ ] Progress ring/bar visible
- [ ] Percentage displayed
- [ ] Completed modules distinguished

### TC-LEARN-005: Module card - Access control

**Preconditions:** Mix of accessible and locked modules
**Steps:**
1. View module cards
**Expected Result:** Access status indicated
**Pass Criteria:**
- [ ] Locked modules show lock icon
- [ ] Accessible modules clickable
- [ ] Paywall message on locked click

### TC-LEARN-006: Module card - Click to detail

**Preconditions:** Accessible module
**Steps:**
1. Click on module card
**Expected Result:** Navigate to module detail
**Pass Criteria:**
- [ ] URL changes to `/learn/:moduleSlug`
- [ ] Module detail page loads

### TC-LEARN-007: View modes - All/In Progress/Completed

**Preconditions:** Page loaded
**Steps:**
1. Switch between view tabs
**Expected Result:** Filtered views
**Pass Criteria:**
- [ ] All shows everything
- [ ] In Progress shows started modules
- [ ] Completed shows finished modules

### TC-LEARN-008: Continue learning banner

**Preconditions:** User has in-progress module
**Steps:**
1. View page with recent activity
**Expected Result:** Continue banner shows
**Pass Criteria:**
- [ ] Banner at top
- [ ] Shows last accessed module
- [ ] Click navigates to continue point

---

## 1.10 Module Detail Page

**Route:** `/learn/:moduleSlug`
**Last Tested:** _Not yet tested_
**Priority:** P1

### TC-MOD-001: Page loads with module info

**Preconditions:** Valid module slug
**Steps:**
1. Navigate to `/learn/getting-started`
**Expected Result:** Module detail loads
**Pass Criteria:**
- [ ] Module title and description
- [ ] Thumbnail image
- [ ] Progress bar
- [ ] Lesson list

### TC-MOD-002: Progress display

**Preconditions:** Page loaded
**Steps:**
1. View progress section
**Expected Result:** Progress shown
**Pass Criteria:**
- [ ] Progress bar with percentage
- [ ] Lessons completed count
- [ ] Visual distinction for completion

### TC-MOD-003: Lesson list - Sections collapse/expand

**Preconditions:** Module has sections
**Steps:**
1. Click section header to collapse
2. Click again to expand
**Expected Result:** Section toggles
**Pass Criteria:**
- [ ] Chevron icon rotates
- [ ] Lessons hide/show
- [ ] Smooth animation

### TC-MOD-004: Lesson item - Completion status

**Preconditions:** Lessons visible
**Steps:**
1. View lesson items
**Expected Result:** Status visible
**Pass Criteria:**
- [ ] Completed lessons have checkmark
- [ ] Incomplete lessons show different state
- [ ] Current/next lesson highlighted

### TC-MOD-005: Lesson item - Click to start

**Preconditions:** Lesson accessible
**Steps:**
1. Click on a lesson
**Expected Result:** Navigate to lesson
**Pass Criteria:**
- [ ] URL changes to `/learn/:moduleSlug/:lessonSlug`
- [ ] Lesson page loads

### TC-MOD-006: Start/Continue module button

**Preconditions:** Page loaded
**Steps:**
1. Click "Start Module" or "Continue"
**Expected Result:** Navigate to appropriate lesson
**Pass Criteria:**
- [ ] New user: First lesson
- [ ] Returning user: Next uncompleted lesson

### TC-MOD-007: Paywall display

**Preconditions:** User lacks access
**Steps:**
1. Navigate to locked module
**Expected Result:** Paywall shown
**Pass Criteria:**
- [ ] Content blurred or hidden
- [ ] Upgrade/purchase CTA visible
- [ ] Explains what access is needed

### TC-MOD-008: Search lessons within module

**Preconditions:** Page loaded
**Steps:**
1. Type in lesson search
**Expected Result:** Lessons filtered
**Pass Criteria:**
- [ ] Search box visible
- [ ] Results filter in real-time
- [ ] All sections searched

---

## 1.11 Lesson Page

**Route:** `/learn/:moduleSlug/:lessonSlug`
**Last Tested:** _Not yet tested_
**Priority:** P1

### TC-LESS-001: Page loads with lesson content

**Preconditions:** Valid module and lesson slugs
**Steps:**
1. Navigate to lesson page
**Expected Result:** Lesson content loads
**Pass Criteria:**
- [ ] Lesson title displayed
- [ ] Content visible (video, text)
- [ ] Navigation buttons present

### TC-LESS-002: Video playback

**Preconditions:** Lesson has video
**Steps:**
1. Click play on video
**Expected Result:** Video plays
**Pass Criteria:**
- [ ] Vimeo player loads
- [ ] Play/pause works
- [ ] Volume control works
- [ ] Fullscreen works

### TC-LESS-003: Mark as complete button

**Preconditions:** Lesson loaded, not completed
**Steps:**
1. Click "Mark Complete" button
**Expected Result:** Lesson marked complete
**Pass Criteria:**
- [ ] Button state changes
- [ ] Progress updates
- [ ] Points toast appears
- [ ] State persists

### TC-LESS-004: Previous/Next navigation

**Preconditions:** Lesson loaded
**Steps:**
1. Click "Next Lesson" button
2. Click "Previous Lesson" button
**Expected Result:** Navigation works
**Pass Criteria:**
- [ ] Next navigates to next lesson
- [ ] Previous navigates to previous
- [ ] Disabled if first/last lesson

### TC-LESS-005: Breadcrumb navigation

**Preconditions:** Lesson loaded
**Steps:**
1. Click module name in breadcrumb
**Expected Result:** Navigate to module
**Pass Criteria:**
- [ ] URL changes to module detail
- [ ] Module page loads

### TC-LESS-006: Downloadable resources

**Preconditions:** Lesson has downloads
**Steps:**
1. View resources section
2. Click download
**Expected Result:** Resource downloads
**Pass Criteria:**
- [ ] Download cards visible
- [ ] File type shown
- [ ] Click downloads file

### TC-LESS-007: Auto-mark on video completion

**Preconditions:** Video lesson
**Steps:**
1. Watch video to end (or skip to end)
**Expected Result:** Lesson auto-completes (if implemented)
**Pass Criteria:**
- [ ] Completion triggers at video end
- [ ] Progress updates automatically

### TC-LESS-008: Lesson not found

**Preconditions:** Invalid lesson slug
**Steps:**
1. Navigate to `/learn/module/invalid-lesson`
**Expected Result:** Error state
**Pass Criteria:**
- [ ] Error message shown
- [ ] Back to module link
- [ ] No crash

### TC-LESS-009: Mobile video display

**Preconditions:** Viewport 375px
**Steps:**
1. View lesson with video at 375px
**Expected Result:** Video adapts
**Pass Criteria:**
- [ ] Video fills width
- [ ] Aspect ratio maintained
- [ ] Controls accessible

### TC-LESS-010: Rich text content

**Preconditions:** Lesson has text content
**Steps:**
1. View lesson with rich text
**Expected Result:** Content renders
**Pass Criteria:**
- [ ] Headings styled
- [ ] Links clickable
- [ ] Lists formatted
- [ ] Images display

---

## 1.12 Events Page

**Route:** `/events`
**Last Tested:** _Not yet tested_
**Priority:** P2

### TC-EVENT-001: Page loads with event list

**Preconditions:** Navigate to `/events`
**Steps:**
1. Open `/events`
**Expected Result:** Events display
**Pass Criteria:**
- [ ] Event cards/list visible
- [ ] Filter options available
- [ ] Search functionality

### TC-EVENT-002: Filter by category

**Preconditions:** Page loaded
**Steps:**
1. Select category (e.g., "Conference")
**Expected Result:** Events filtered
**Pass Criteria:**
- [ ] Only category events shown
- [ ] Filter indicator visible

### TC-EVENT-003: Filter by state

**Preconditions:** Page loaded
**Steps:**
1. Select state filter
**Expected Result:** Events filtered by location
**Pass Criteria:**
- [ ] Only state events shown
- [ ] Virtual events may remain

### TC-EVENT-004: Event card - Details display

**Preconditions:** Events visible
**Steps:**
1. View event cards
**Expected Result:** Event info shown
**Pass Criteria:**
- [ ] Event name
- [ ] Date/time
- [ ] Location (or Virtual badge)
- [ ] Category tag

### TC-EVENT-005: Event card - Save/bookmark

**Preconditions:** Events visible
**Steps:**
1. Click save icon on event
**Expected Result:** Event saved
**Pass Criteria:**
- [ ] Icon state changes
- [ ] Event in saved list

### TC-EVENT-006: Event detail modal

**Preconditions:** Events visible
**Steps:**
1. Click on event card
**Expected Result:** Detail modal opens
**Pass Criteria:**
- [ ] Full description
- [ ] Registration link
- [ ] Save button
- [ ] Close button works

### TC-EVENT-007: Grid/List view toggle

**Preconditions:** Page loaded
**Steps:**
1. Click view toggle button
**Expected Result:** View changes
**Pass Criteria:**
- [ ] Grid ↔ List toggle works
- [ ] Content adapts to view
- [ ] Preference may persist

### TC-EVENT-008: Empty state - No events match

**Preconditions:** Filters with no results
**Steps:**
1. Apply restrictive filters
**Expected Result:** Empty state
**Pass Criteria:**
- [ ] "No events found" message
- [ ] Clear filters suggestion

---

## 1.13-1.18 Marketplace & Messaging Pages

**Note:** These sections (Marketplace, Mentor Profile, Booking Flow, My Bookings, Messages, Notifications) are covered in the existing manual-tests.md content. The test cases follow the same format with:
- Page load verification
- Core functionality testing
- Form validation
- Navigation flows
- Empty/loading/error states
- Mobile responsiveness

*Refer to existing marketplace sections in current manual-tests.md for detailed test cases.*

---

# Section 2: Admin Pages

## 2.1 Admin Dashboard

**Route:** `/admin`
**Last Tested:** _Not yet tested_
**Priority:** P2

### TC-ADMIN-001: Dashboard loads with navigation cards

**Preconditions:** Navigate to `/admin`
**Steps:**
1. Open `/admin`
**Expected Result:** Admin dashboard loads
**Pass Criteria:**
- [ ] Navigation cards to all admin sections
- [ ] Counts displayed (Modules, Downloads, etc.)
- [ ] Quick tips or guidance shown

### TC-ADMIN-002: Navigation cards link correctly

**Preconditions:** Dashboard loaded
**Steps:**
1. Click each navigation card
**Expected Result:** Navigates to correct page
**Pass Criteria:**
- [ ] Modules → `/admin/modules`
- [ ] Downloads → `/admin/downloads`
- [ ] Categories → `/admin/categories`
- [ ] Each link works

### TC-ADMIN-003: Counts are accurate

**Preconditions:** Known data in system
**Steps:**
1. View dashboard counts
2. Navigate to list page
3. Compare counts
**Expected Result:** Counts match
**Pass Criteria:**
- [ ] Module count matches list
- [ ] Download count matches list
- [ ] Counts update when data changes

---

## 2.2 Modules List Admin

**Route:** `/admin/modules`
**Last Tested:** _Not yet tested_
**Priority:** P1

### TC-AMOD-001: Page loads with module list

**Preconditions:** Navigate to `/admin/modules`
**Steps:**
1. Open `/admin/modules`
**Expected Result:** Module list displays
**Pass Criteria:**
- [ ] Stats cards at top
- [ ] Module list/table visible
- [ ] New Module button visible

### TC-AMOD-002: Stats cards display

**Preconditions:** Page loaded
**Steps:**
1. View stats cards
**Expected Result:** Accurate counts
**Pass Criteria:**
- [ ] Total Modules count
- [ ] Published count
- [ ] Draft count

### TC-AMOD-003: Search modules

**Preconditions:** Page loaded
**Steps:**
1. Type in search box
**Expected Result:** Modules filter
**Pass Criteria:**
- [ ] Real-time filtering
- [ ] Matches title and description
- [ ] Results count updates

### TC-AMOD-004: Filter by status

**Preconditions:** Page loaded
**Steps:**
1. Select "Published" filter
2. Select "Draft" filter
**Expected Result:** Modules filtered
**Pass Criteria:**
- [ ] Only matching status shows
- [ ] Filter indicator visible
- [ ] Clear filter works

### TC-AMOD-005: Filter by category

**Preconditions:** Page loaded, categories exist
**Steps:**
1. Select category filter
**Expected Result:** Modules filtered by category
**Pass Criteria:**
- [ ] Only category modules shown
- [ ] Can combine with status filter

### TC-AMOD-006: New Module button

**Preconditions:** Page loaded
**Steps:**
1. Click "New Module" button
**Expected Result:** Navigate to create page
**Pass Criteria:**
- [ ] URL changes to `/admin/modules/new`
- [ ] Empty form loads

### TC-AMOD-007: Module row - Edit link

**Preconditions:** Modules exist
**Steps:**
1. Click Edit on a module row
**Expected Result:** Navigate to edit page
**Pass Criteria:**
- [ ] URL changes to `/admin/modules/:id`
- [ ] Form loads with data

### TC-AMOD-008: Module row - Toggle publish status

**Preconditions:** Modules exist
**Steps:**
1. Click status badge to toggle
**Expected Result:** Status changes
**Pass Criteria:**
- [ ] Badge color changes
- [ ] Status persists after refresh

### TC-AMOD-009: Drag and drop reorder

**Preconditions:** Multiple modules exist
**Steps:**
1. Drag module to new position
2. Drop
**Expected Result:** Order changes
**Pass Criteria:**
- [ ] Visual feedback during drag
- [ ] Order updates after drop
- [ ] Order persists after refresh

### TC-AMOD-010: Delete module

**Preconditions:** Module exists
**Steps:**
1. Click delete icon on module
2. Confirm in modal
**Expected Result:** Module deleted
**Pass Criteria:**
- [ ] Confirmation modal shows
- [ ] Warning about cascade delete (lessons)
- [ ] Module removed from list
- [ ] Associated lessons deleted

### TC-AMOD-011: Clear filters button

**Preconditions:** Filters applied
**Steps:**
1. Apply filters
2. Click "Clear Filters"
**Expected Result:** All filters reset
**Pass Criteria:**
- [ ] All filters cleared
- [ ] Full list returns

### TC-AMOD-012: Empty state

**Preconditions:** No modules exist
**Steps:**
1. View page with no modules
**Expected Result:** Empty state
**Pass Criteria:**
- [ ] "No modules yet" message
- [ ] Create first module CTA

---

## 2.3 Module Editor Admin

**Route:** `/admin/modules/:moduleId` or `/admin/modules/new`
**Last Tested:** _Not yet tested_
**Priority:** P1

### TC-AMED-001: Create new module - Form loads

**Preconditions:** Navigate to `/admin/modules/new`
**Steps:**
1. Open new module page
**Expected Result:** Empty form displays
**Pass Criteria:**
- [ ] All form fields visible
- [ ] Fields are empty
- [ ] Save button visible

### TC-AMED-002: Create module - Save

**Preconditions:** On new module form
**Steps:**
1. Fill: Title, Slug, Description
2. Select category
3. Click Save
**Expected Result:** Module created
**Pass Criteria:**
- [ ] No validation errors
- [ ] Redirects to edit page with ID
- [ ] Success toast shown
- [ ] Module appears in list

### TC-AMED-003: Edit module - Load existing

**Preconditions:** Module exists
**Steps:**
1. Navigate to `/admin/modules/:id`
**Expected Result:** Form loads with data
**Pass Criteria:**
- [ ] All fields populated
- [ ] Values match stored data
- [ ] Module ID shown

### TC-AMED-004: Edit module - Save changes

**Preconditions:** On edit form
**Steps:**
1. Modify title
2. Click Save
**Expected Result:** Changes saved
**Pass Criteria:**
- [ ] Success toast
- [ ] New title visible
- [ ] Changes persist after refresh

### TC-AMED-005: Form validation - Title required

**Preconditions:** On form
**Steps:**
1. Clear title field
2. Click Save
**Expected Result:** Validation error
**Pass Criteria:**
- [ ] Save prevented
- [ ] Error message on title field
- [ ] Field highlighted

### TC-AMED-006: Form validation - Slug format

**Preconditions:** On form
**Steps:**
1. Enter slug with spaces or special chars
2. Click Save
**Expected Result:** Validation error
**Pass Criteria:**
- [ ] Slug must be URL-safe
- [ ] Error message shown
- [ ] Suggests fix

### TC-AMED-007: Entitlement checkboxes

**Preconditions:** On form, entitlements exist
**Steps:**
1. Check/uncheck entitlements
2. Save
**Expected Result:** Entitlements saved
**Pass Criteria:**
- [ ] Checkboxes work
- [ ] Multiple selections allowed
- [ ] Persists after save

### TC-AMED-008: Status toggle (Draft/Published)

**Preconditions:** On form
**Steps:**
1. Toggle status
2. Save
**Expected Result:** Status changes
**Pass Criteria:**
- [ ] Toggle works
- [ ] Status persists
- [ ] Affects visibility in app

### TC-AMED-009: Content tab - Add section

**Preconditions:** On module edit, Content tab
**Steps:**
1. Click "Add Section"
2. Enter section name
3. Save
**Expected Result:** Section created
**Pass Criteria:**
- [ ] Form/inline input appears
- [ ] Section added to list
- [ ] Can rename section

### TC-AMED-010: Content tab - Add lesson to section

**Preconditions:** Section exists
**Steps:**
1. Click "Add Lesson" in section
2. Fill lesson basics
3. Save
**Expected Result:** Lesson created
**Pass Criteria:**
- [ ] Navigates to lesson editor
- [ ] Lesson appears in section
- [ ] Order correct

### TC-AMED-011: Content tab - Reorder sections

**Preconditions:** Multiple sections
**Steps:**
1. Drag section to new position
**Expected Result:** Order changes
**Pass Criteria:**
- [ ] Drag works
- [ ] Order persists

### TC-AMED-012: Content tab - Reorder lessons

**Preconditions:** Multiple lessons in section
**Steps:**
1. Drag lesson within section
**Expected Result:** Order changes
**Pass Criteria:**
- [ ] Drag works within section
- [ ] Order persists

### TC-AMED-013: Content tab - Delete section

**Preconditions:** Section exists
**Steps:**
1. Click delete on section
2. Confirm
**Expected Result:** Section deleted
**Pass Criteria:**
- [ ] Confirmation warns about lessons
- [ ] Section and lessons removed

### TC-AMED-014: Preview button

**Preconditions:** Module has slug
**Steps:**
1. Click Preview button
**Expected Result:** Opens module in new tab
**Pass Criteria:**
- [ ] New tab opens
- [ ] Module page loads
- [ ] Shows current saved state

### TC-AMED-015: Back to Modules link

**Preconditions:** On editor
**Steps:**
1. Click "Back to Modules"
**Expected Result:** Navigate to list
**Pass Criteria:**
- [ ] Warns if unsaved changes
- [ ] Returns to modules list

---

## 2.4 Lesson Editor Admin

**Route:** `/admin/lessons/:lessonId` or `/admin/lessons/new`
**Last Tested:** _Not yet tested_
**Priority:** P1

### TC-ALES-001: Create lesson - Form loads

**Preconditions:** Navigate from module with moduleId
**Steps:**
1. Click Add Lesson in module
**Expected Result:** New lesson form
**Pass Criteria:**
- [ ] Form fields visible
- [ ] Module context shown
- [ ] Fields empty

### TC-ALES-002: Create lesson - Save

**Preconditions:** On new lesson form
**Steps:**
1. Fill: Title, Slug, Description
2. Add video URL
3. Save
**Expected Result:** Lesson created
**Pass Criteria:**
- [ ] Redirects to edit
- [ ] Lesson ID shown
- [ ] Appears in module

### TC-ALES-003: Edit lesson - Load existing

**Preconditions:** Lesson exists
**Steps:**
1. Navigate to `/admin/lessons/:id`
**Expected Result:** Form loads with data
**Pass Criteria:**
- [ ] All fields populated
- [ ] Video URL loaded

### TC-ALES-004: Edit lesson - Save changes

**Preconditions:** On edit form
**Steps:**
1. Modify description
2. Save
**Expected Result:** Changes saved
**Pass Criteria:**
- [ ] Success toast
- [ ] Changes persist

### TC-ALES-005: Video URL field

**Preconditions:** On form
**Steps:**
1. Enter Vimeo URL
2. Save
**Expected Result:** URL saved, ID extracted
**Pass Criteria:**
- [ ] Accepts full Vimeo URL
- [ ] Extracts video ID
- [ ] Preview available

### TC-ALES-006: Content editor (Editor.js)

**Preconditions:** On form
**Steps:**
1. Add text block
2. Add heading
3. Add list
4. Save
**Expected Result:** Rich content saved
**Pass Criteria:**
- [ ] Blocks add correctly
- [ ] Formatting preserved
- [ ] Content renders on lesson page

### TC-ALES-007: Download selector

**Preconditions:** Downloads exist
**Steps:**
1. Click Add Download
2. Select from list
3. Save
**Expected Result:** Download attached
**Pass Criteria:**
- [ ] Selector shows available downloads
- [ ] Can add multiple
- [ ] Downloads show on lesson

### TC-ALES-008: Remove download

**Preconditions:** Download attached
**Steps:**
1. Click remove on attached download
2. Save
**Expected Result:** Download removed
**Pass Criteria:**
- [ ] Download removed from list
- [ ] No longer shows on lesson

### TC-ALES-009: Free preview toggle

**Preconditions:** On form
**Steps:**
1. Toggle "Free Preview" on
2. Save
**Expected Result:** Lesson becomes free
**Pass Criteria:**
- [ ] Toggle works
- [ ] Lesson accessible without subscription

### TC-ALES-010: Unsaved changes warning

**Preconditions:** Changes made, not saved
**Steps:**
1. Try to navigate away
**Expected Result:** Warning shown
**Pass Criteria:**
- [ ] Browser or app warning
- [ ] Can cancel and stay
- [ ] Can confirm and leave

### TC-ALES-011: Delete lesson

**Preconditions:** Lesson exists
**Steps:**
1. Click Delete button
2. Confirm
**Expected Result:** Lesson deleted
**Pass Criteria:**
- [ ] Confirmation modal
- [ ] Lesson removed
- [ ] Redirects to module

### TC-ALES-012: Back to Module link

**Preconditions:** On editor
**Steps:**
1. Click "Back to Module"
**Expected Result:** Navigate to module content tab
**Pass Criteria:**
- [ ] Returns to module editor
- [ ] Content tab active

---

## 2.5-2.14 Additional Admin Pages

*The following admin pages follow similar patterns:*

### Downloads Admin (`/admin/downloads`)
- List with search, filter, sort
- Create/Edit with file upload or URL
- Delete with confirmation
- *10 test cases*

### Download Editor (`/admin/downloads/:id`)
- Form fields: Title, Slug, File, Category, Access
- File upload to Supabase
- *12 test cases*

### Categories Admin (`/admin/categories`)
- CRUD operations
- Inline editing
- *8 test cases*

### Entitlements Admin (`/admin/entitlements`)
- CRUD operations
- Inline editing
- Active/Inactive toggle
- *8 test cases*

### Points Config (`/admin/points`)
- Actions tab: Edit point values
- Promos tab: Create/edit promotions
- Overlap detection
- *12 test cases*

### Marketplace Dashboard (`/admin/marketplace`)
- Metrics display
- Charts
- Quick actions
- *8 test cases*

### Provider Management (`/admin/marketplace/providers`)
- Tabs: Pending, Approved, Suspended
- Approve/Reject flows
- Messaging
- *15 test cases*

### Booking Management (`/admin/marketplace/bookings`)
- Search and filters
- View details
- Force cancel
- Issue refunds
- *12 test cases*

### Dispute Resolution (`/admin/marketplace/disputes`)
- List with tabs
- Detail panel
- Resolution actions
- *12 test cases*

### Quality Moderation (`/admin/marketplace/quality`)
- Flagged content list
- Keep/Remove actions
- Contact exchange detection
- *10 test cases*

---

# Section 3: Provider/SRNA Pages

*Provider pages follow similar test patterns. Key unique tests:*

### Become a Mentor (`/marketplace/become-a-mentor`)
- Landing page content
- Commission display (20%)
- FAQ accordion
- *6 test cases*

### Provider Application (`/marketplace/provider/apply`)
- Multi-step form
- Student ID upload
- License verification
- *10 test cases*

### Provider Onboarding (`/marketplace/provider/onboarding`)
- 5-step wizard
- Progress widget
- Step navigation
- Go Live gating
- *15 test cases*

### Provider Dashboard (`/marketplace/provider/dashboard`)
- Widgets: Requests, Sessions, Earnings
- Inbox component
- *10 test cases*

### Provider Services (`/marketplace/provider/services`)
- Enable/disable services
- Edit pricing
- Instant book toggle
- *8 test cases*

### Provider Availability (`/marketplace/provider/availability`)
- Weekly hours grid
- Blocked dates
- Vacation mode
- *10 test cases*

### Provider Earnings (`/marketplace/provider/earnings`)
- Summary cards
- Transaction list
- Payout info
- *8 test cases*

---

# Section 4: Cross-Cutting Features

## 4.1 Authentication

### TC-AUTH-001: Login form display

**Preconditions:** Navigate to login
**Steps:**
1. Open login modal/page
**Expected Result:** Login form displays
**Pass Criteria:**
- [ ] Email field
- [ ] Password field
- [ ] Submit button
- [ ] Forgot password link

### TC-AUTH-002: Login - Valid credentials

**Preconditions:** Valid test account
**Steps:**
1. Enter valid email
2. Enter valid password
3. Submit
**Expected Result:** Login successful
**Pass Criteria:**
- [ ] Redirects to dashboard
- [ ] User info in header
- [ ] Session persists

### TC-AUTH-003: Login - Invalid credentials

**Preconditions:** Invalid credentials
**Steps:**
1. Enter wrong email/password
2. Submit
**Expected Result:** Error shown
**Pass Criteria:**
- [ ] Error message displayed
- [ ] Form not cleared
- [ ] Can retry

### TC-AUTH-004: Logout

**Preconditions:** Logged in
**Steps:**
1. Click logout button/menu
**Expected Result:** Logged out
**Pass Criteria:**
- [ ] Session cleared
- [ ] Redirects to login
- [ ] Protected routes inaccessible

---

## 4.2 Navigation

### TC-NAV-001: Sidebar navigation (desktop)

**Preconditions:** Desktop viewport
**Steps:**
1. Click each sidebar item
**Expected Result:** Navigates correctly
**Pass Criteria:**
- [ ] Each link works
- [ ] Active state highlights current page
- [ ] Hover states visible

### TC-NAV-002: Mobile bottom navigation

**Preconditions:** Mobile viewport (375px)
**Steps:**
1. Tap each bottom nav item
**Expected Result:** Navigates correctly
**Pass Criteria:**
- [ ] 5 items visible
- [ ] Each navigates correctly
- [ ] Active state shows

### TC-NAV-003: Mobile hamburger menu

**Preconditions:** Mobile viewport
**Steps:**
1. Tap hamburger icon
2. Tap menu item
**Expected Result:** Menu opens, navigates
**Pass Criteria:**
- [ ] Menu slides in
- [ ] All nav items accessible
- [ ] Close on selection or X

---

## 4.3 Notifications

### TC-NOTIF-001: Notification bell - Unread count

**Preconditions:** Unread notifications exist
**Steps:**
1. View header
**Expected Result:** Badge shows count
**Pass Criteria:**
- [ ] Red badge visible
- [ ] Count accurate
- [ ] Updates when read

### TC-NOTIF-002: Notification dropdown

**Preconditions:** Click bell
**Steps:**
1. Click notification bell
**Expected Result:** Dropdown opens
**Pass Criteria:**
- [ ] Recent notifications shown
- [ ] Mark all read button
- [ ] View all link

### TC-NOTIF-003: Mark notification as read

**Preconditions:** Unread notification
**Steps:**
1. Click on notification
**Expected Result:** Marked as read
**Pass Criteria:**
- [ ] Visual style changes
- [ ] Count decreases
- [ ] Navigates to relevant page

---

## 4.4 Forms & Validation

### TC-FORM-GEN-001: Required field indicator

**Preconditions:** Form with required fields
**Steps:**
1. View form
**Expected Result:** Required fields marked
**Pass Criteria:**
- [ ] Asterisk or indicator
- [ ] Consistent across app

### TC-FORM-GEN-002: Error message display

**Preconditions:** Invalid form submission
**Steps:**
1. Submit invalid form
**Expected Result:** Errors shown
**Pass Criteria:**
- [ ] Inline errors below fields
- [ ] Red border on invalid
- [ ] Clear error text

### TC-FORM-GEN-003: Success feedback

**Preconditions:** Valid form submission
**Steps:**
1. Submit valid form
**Expected Result:** Success feedback
**Pass Criteria:**
- [ ] Toast notification
- [ ] Clear success message
- [ ] Appropriate redirect

---

## 4.5 Modals & Dialogs

### TC-MODAL-GEN-001: Modal open/close

**Preconditions:** Modal trigger available
**Steps:**
1. Click trigger
2. Click X
3. Reopen
4. Click overlay
5. Reopen
6. Press ESC
**Expected Result:** All close methods work
**Pass Criteria:**
- [ ] X button closes
- [ ] Overlay click closes
- [ ] ESC key closes
- [ ] Focus trapped while open

### TC-MODAL-GEN-002: Confirm dialog

**Preconditions:** Destructive action available
**Steps:**
1. Click delete/remove action
**Expected Result:** Confirmation required
**Pass Criteria:**
- [ ] Dialog appears
- [ ] Clear warning message
- [ ] Cancel cancels
- [ ] Confirm executes

---

# Section 5: Integration Test Scenarios

## INT-001: New User Onboarding to First Target Program

**Description:** Complete user journey from first login to adding first target program
**Steps:**
1. Clear localStorage, visit `/dashboard`
2. Complete onboarding modal (any path)
3. Navigate to `/schools`
4. Search for a school
5. Save school (heart icon)
6. Convert to target program
7. Navigate to `/my-programs`
8. Click on target program
9. Complete one checklist item

**Pass Criteria:**
- [ ] Onboarding completes, points awarded
- [ ] School saves to list
- [ ] Target program created with checklist
- [ ] Checklist item persists
- [ ] No errors throughout flow

---

## INT-002: Provider Application to Launch

**Description:** Complete provider journey from application to live profile
**Steps:**
1. Navigate to `/marketplace/become-a-mentor`
2. Click "Start Application"
3. Complete eligibility
4. Fill application form with uploads
5. Submit application
6. (Simulate admin approval)
7. Complete onboarding steps 1-4
8. On step 5, launch profile
9. Verify profile in marketplace

**Pass Criteria:**
- [ ] Application submitted successfully
- [ ] Status page shows correct state
- [ ] Onboarding unlocks after approval
- [ ] Profile goes live
- [ ] Searchable in marketplace

---

## INT-003: Complete Booking Flow

**Description:** Applicant books mentor session end-to-end
**Steps:**
1. Navigate to `/marketplace`
2. Search for mentor
3. View mentor profile
4. Click "Book" on service
5. Complete intake form
6. Select time slots
7. Complete payment step
8. View confirmation
9. Check My Bookings

**Pass Criteria:**
- [ ] Mentor searchable
- [ ] Booking flow navigable
- [ ] Form data persists between steps
- [ ] Confirmation displays
- [ ] Booking appears in list

---

## INT-004: Admin Content Management

**Description:** Admin creates full learning content
**Steps:**
1. Navigate to `/admin/categories`
2. Create new category
3. Navigate to `/admin/downloads`
4. Create new download
5. Navigate to `/admin/modules`
6. Create new module with category
7. Add section and lesson
8. Attach download to lesson
9. Publish module
10. Verify visible in `/learn`

**Pass Criteria:**
- [ ] Category created
- [ ] Download uploaded
- [ ] Module created and published
- [ ] Lesson has download
- [ ] Module visible to users

---

# Section 6: Responsive Design Matrix

## Breakpoints to Test

| Breakpoint | Width | Key Changes |
|------------|-------|-------------|
| Mobile | 375px | Bottom nav, single column, touch targets |
| Tablet | 768px | Optional sidebar, 2-column grids |
| Desktop | 1024px | Sidebar visible, multi-column layouts |
| Wide | 1280px | Full layouts, max-width containers |

## Per-Page Responsive Checklist

For each page, verify at 375px:
- [ ] No horizontal scrollbar
- [ ] All content accessible via scroll
- [ ] Touch targets ≥ 44px
- [ ] Text readable without zoom
- [ ] Images scale appropriately
- [ ] Modals don't overflow screen
- [ ] Forms usable (keyboards don't obscure inputs)

---

# Section 7: Accessibility Checklist

## Keyboard Navigation

For each interactive element:
- [ ] Reachable via Tab key
- [ ] Operable via Enter/Space
- [ ] ESC closes modals/dropdowns
- [ ] Arrow keys for menus/tabs
- [ ] No keyboard traps

## Screen Reader

- [ ] All images have alt text
- [ ] Form inputs have labels
- [ ] Buttons have accessible names
- [ ] Headings use proper hierarchy (h1 → h2 → h3)
- [ ] ARIA labels where needed
- [ ] Live regions for dynamic content

## Visual

- [ ] Color contrast ≥ 4.5:1 (text)
- [ ] Focus indicators visible
- [ ] Error states not color-only
- [ ] Links distinguishable from text

---

# Issue Reporting Template

When issues are found, log in `/docs/project/issues.md`:

```markdown
### ISS-XXX: [Brief Description]

**Severity:** P0/P1/P2/P3 (Critical/High/Medium/Low)
**Found:** [Date] by [Tester]
**Test Case:** TC-XXX-###
**Environment:** [Browser, Viewport, Device]

**Steps to Reproduce:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected:** [What should happen]
**Actual:** [What happened]

**Screenshot/Video:** [Link if available]

**Notes:** [Additional context]
```

---

# Section 8: Community Forums (Admin)

## 8.1 Admin Forums Tab

**Route:** `/admin/community` → Forums tab
**Last Tested:** _Not yet tested_
**Priority:** P1

### TC-AFORUM-001: Forums tab displays forum table

**Preconditions:** Navigate to `/admin/community`, click Forums tab
**Steps:**
1. Open `/admin/community`
2. Click "Forums" tab
**Expected Result:** Forum management table loads
**Pass Criteria:**
- [ ] Table has columns: Forum, Topics, Replies, Status, Actions
- [ ] "Create Forum" button visible
- [ ] Top-level forums listed (Introductions, CRNA Programs, etc.)

### TC-AFORUM-002: CRNA Programs forum shows subforum count

**Preconditions:** Forums tab active
**Steps:**
1. Locate "CRNA Programs" row
2. Check for subforum indicator
**Expected Result:** Shows ~150 subforums badge
**Pass Criteria:**
- [ ] Badge shows "150 subforums" or similar
- [ ] Expand chevron/button visible
- [ ] Row styled differently from other forums

### TC-AFORUM-003: Expand forum to show subforums

**Preconditions:** Forums tab, CRNA Programs row visible
**Steps:**
1. Click expand button/chevron on CRNA Programs row
2. Wait for subforums to load
**Expected Result:** Subforums appear indented below
**Pass Criteria:**
- [ ] Chevron rotates to indicate expanded state
- [ ] Subforum rows appear indented
- [ ] Each subforum shows school name
- [ ] Subforums show topic/reply counts

### TC-AFORUM-004: Collapse expanded forum

**Preconditions:** CRNA Programs expanded
**Steps:**
1. Click expand button again
**Expected Result:** Subforums hide
**Pass Criteria:**
- [ ] Chevron rotates back
- [ ] Subforum rows disappear
- [ ] Only parent forum visible

### TC-AFORUM-005: Subforums display school names correctly

**Preconditions:** CRNA Programs expanded
**Steps:**
1. Scroll through subforums
2. Verify names match known CRNA programs
**Expected Result:** All 150 programs shown with correct names
**Pass Criteria:**
- [ ] Duke University CRNA Program visible
- [ ] University of Pittsburgh visible
- [ ] Names match schools data (not placeholder text)
- [ ] Alphabetically sorted

### TC-AFORUM-006: Create top-level forum

**Preconditions:** Forums tab active
**Steps:**
1. Click "Create Forum" button
2. Fill title: "Test Forum"
3. Fill description: "Test description"
4. Leave parent as "None"
5. Click Save/Create
**Expected Result:** New forum created
**Pass Criteria:**
- [ ] Dialog opens with form fields
- [ ] Title field required
- [ ] Description field optional
- [ ] New forum appears in list after save
- [ ] Success toast shown

### TC-AFORUM-007: Create subforum under parent

**Preconditions:** Forums tab active
**Steps:**
1. Click "Create Forum"
2. Fill title: "Test Subforum"
3. Select parent forum from dropdown
4. Click Save
**Expected Result:** Subforum created under parent
**Pass Criteria:**
- [ ] Parent dropdown shows available forums
- [ ] Subforum appears nested under parent
- [ ] Parent subforum count updates

### TC-AFORUM-008: Edit existing forum

**Preconditions:** Forum exists in list
**Steps:**
1. Click actions menu (⋮) on forum row
2. Select "Edit"
3. Modify title or description
4. Click Save
**Expected Result:** Forum updated
**Pass Criteria:**
- [ ] Edit dialog opens with existing data
- [ ] Title pre-filled with current value
- [ ] Description pre-filled
- [ ] Changes persist after save
- [ ] Updated values visible in list

### TC-AFORUM-009: Delete forum with confirmation

**Preconditions:** Non-essential forum exists
**Steps:**
1. Click actions menu on test forum
2. Select "Delete"
3. Review confirmation dialog
4. Click Confirm
**Expected Result:** Forum deleted
**Pass Criteria:**
- [ ] Confirmation dialog appears
- [ ] Warning about cascade delete (subforums/topics)
- [ ] Forum removed from list after confirm
- [ ] Cancel keeps forum

### TC-AFORUM-010: Delete forum - Cancel preserves forum

**Preconditions:** Forum visible
**Steps:**
1. Click Delete on forum
2. Click Cancel in dialog
**Expected Result:** Forum not deleted
**Pass Criteria:**
- [ ] Dialog closes
- [ ] Forum still visible in list
- [ ] No data loss

### TC-AFORUM-011: Lock forum

**Preconditions:** Unlocked forum visible
**Steps:**
1. Click actions menu on forum
2. Select "Lock"
**Expected Result:** Forum locked
**Pass Criteria:**
- [ ] Status changes to "Locked"
- [ ] Lock icon appears
- [ ] Action changes to "Unlock"
- [ ] Locked forums prevent new topics (tested in user view)

### TC-AFORUM-012: Unlock forum

**Preconditions:** Locked forum visible
**Steps:**
1. Click actions menu on locked forum
2. Select "Unlock"
**Expected Result:** Forum unlocked
**Pass Criteria:**
- [ ] Status changes to "Active"
- [ ] Lock icon removed
- [ ] Users can post again

### TC-AFORUM-013: Forum row shows topic/reply counts

**Preconditions:** Forums with activity visible
**Steps:**
1. View forum rows
2. Check Topics and Replies columns
**Expected Result:** Counts displayed
**Pass Criteria:**
- [ ] Topics column shows number
- [ ] Replies column shows number
- [ ] Numbers update when content changes

### TC-AFORUM-014: Program subforum linked to school ID

**Preconditions:** CRNA Programs expanded
**Steps:**
1. View a program subforum
2. Check if school_id indicator present
**Expected Result:** Subforum linked to school
**Pass Criteria:**
- [ ] Program names come from schools table
- [ ] school_id foreign key set
- [ ] Name updates if school name changes

### TC-AFORUM-015: Mobile responsive - Forums table

**Preconditions:** Viewport 375px
**Steps:**
1. Navigate to Forums tab at 375px
**Expected Result:** Table adapts to mobile
**Pass Criteria:**
- [ ] Table scrollable horizontally or stacked
- [ ] Actions menu accessible via tap
- [ ] Create button visible
- [ ] No horizontal overflow

---

## 8.2 Archived Forums (Settings Tab)

**Route:** `/admin/community` → Settings tab → Archived Forums
**Last Tested:** _Not yet tested_
**Priority:** P2

### TC-ARCH-001: Archived Forums section displays

**Preconditions:** Navigate to Settings tab
**Steps:**
1. Click Settings tab
2. Scroll to "Archived Forums" section
**Expected Result:** Section visible
**Pass Criteria:**
- [ ] "Archived Forums" heading with Archive icon
- [ ] Description explains purpose
- [ ] Shows archive count if any exist
- [ ] "Export All" button if archives exist

### TC-ARCH-002: Empty state when no archives

**Preconditions:** No archived forums exist
**Steps:**
1. View Archived Forums section
**Expected Result:** Helpful empty state
**Pass Criteria:**
- [ ] Archive icon (muted)
- [ ] "No archived forums" message
- [ ] "When a school is deleted..." explanation
- [ ] No broken UI

### TC-ARCH-003: Archive list displays archived forums

**Preconditions:** Archived forums exist (mock or real)
**Steps:**
1. View Archived Forums section
**Expected Result:** List of archives
**Pass Criteria:**
- [ ] Each archive shows school name
- [ ] Archived date displayed
- [ ] Topic and reply counts shown
- [ ] Action buttons visible (View, Export, Delete)

### TC-ARCH-004: Expand archive to see preview

**Preconditions:** Archive exists in list
**Steps:**
1. Click on archive row (not action buttons)
**Expected Result:** Row expands with preview
**Pass Criteria:**
- [ ] Chevron rotates to indicate expanded
- [ ] Content preview shown
- [ ] Topic list (first 5) displayed
- [ ] Reply counts per topic

### TC-ARCH-005: Collapse expanded archive

**Preconditions:** Archive row expanded
**Steps:**
1. Click archive row again
**Expected Result:** Row collapses
**Pass Criteria:**
- [ ] Chevron rotates back
- [ ] Preview hidden
- [ ] Only header info visible

### TC-ARCH-006: View archive in modal

**Preconditions:** Archive exists
**Steps:**
1. Click View button (eye icon) on archive
**Expected Result:** Modal opens with full content
**Pass Criteria:**
- [ ] Modal displays school name in title
- [ ] "Archived on [date]" subtitle
- [ ] All topics listed with full content
- [ ] Replies shown nested under topics
- [ ] Sticky badge on sticky topics

### TC-ARCH-007: Modal shows topic details

**Preconditions:** View archive modal open
**Steps:**
1. Review topic cards in modal
**Expected Result:** Full topic information
**Pass Criteria:**
- [ ] Topic title displayed
- [ ] Topic content (HTML rendered)
- [ ] Posted date and view count
- [ ] Reply count

### TC-ARCH-008: Modal shows nested replies

**Preconditions:** Topic has replies
**Steps:**
1. View topic with replies in modal
**Expected Result:** Replies displayed
**Pass Criteria:**
- [ ] Replies indented under topic
- [ ] Reply content rendered
- [ ] Nested replies (parent_reply_id) further indented
- [ ] Reply dates shown

### TC-ARCH-009: Close archive view modal

**Preconditions:** Modal open
**Steps:**
1. Click "Close" button
**Expected Result:** Modal closes
**Pass Criteria:**
- [ ] Modal disappears
- [ ] Background content accessible
- [ ] Can reopen same archive

### TC-ARCH-010: Export single archive as JSON

**Preconditions:** Archive exists
**Steps:**
1. Click Export JSON button (file icon) on archive
**Expected Result:** JSON file downloads
**Pass Criteria:**
- [ ] Download starts immediately
- [ ] Filename: `archived-forum-[school-name].json`
- [ ] JSON contains: school_name, archived_at, forum, topics, stats
- [ ] Topics include replies

### TC-ARCH-011: Export from modal

**Preconditions:** View archive modal open
**Steps:**
1. Click "Export JSON" in modal footer
**Expected Result:** Same JSON downloads
**Pass Criteria:**
- [ ] Download triggers from modal
- [ ] Same content as list export
- [ ] Modal stays open

### TC-ARCH-012: Export all archives

**Preconditions:** Multiple archives exist
**Steps:**
1. Click "Export All" button in section header
**Expected Result:** Combined JSON downloads
**Pass Criteria:**
- [ ] Download starts
- [ ] Filename: `all-archived-forums-YYYY-MM-DD.json`
- [ ] JSON is array of all archives
- [ ] Each archive has full data

### TC-ARCH-013: Delete archive - confirmation

**Preconditions:** Archive exists
**Steps:**
1. Click Delete button (trash icon) on archive
**Expected Result:** Confirmation dialog appears
**Pass Criteria:**
- [ ] Dialog shows "Delete Archive Permanently?"
- [ ] School name mentioned
- [ ] Topic/reply counts shown
- [ ] Warning about irreversibility
- [ ] Cancel and Delete buttons

### TC-ARCH-014: Delete archive - confirm

**Preconditions:** Delete confirmation open
**Steps:**
1. Click "Delete Permanently" button
**Expected Result:** Archive deleted
**Pass Criteria:**
- [ ] Dialog closes
- [ ] Archive removed from list
- [ ] Archive count updates in description
- [ ] Cannot recover after delete

### TC-ARCH-015: Delete archive - cancel

**Preconditions:** Delete confirmation open
**Steps:**
1. Click "Cancel" button
**Expected Result:** Archive preserved
**Pass Criteria:**
- [ ] Dialog closes
- [ ] Archive still in list
- [ ] No data loss

### TC-ARCH-016: Archive date formatting

**Preconditions:** Archives visible
**Steps:**
1. Check date display on archives
**Expected Result:** Human-readable dates
**Pass Criteria:**
- [ ] Format: "Dec 14, 2024, 2:30 PM" or similar
- [ ] Consistent across all archives
- [ ] Timezone appropriate

### TC-ARCH-017: Mobile responsive - Archives

**Preconditions:** Viewport 375px
**Steps:**
1. Navigate to Settings tab at 375px
2. Scroll to Archived Forums
**Expected Result:** Section adapts
**Pass Criteria:**
- [ ] Action buttons accessible
- [ ] Expand/collapse works
- [ ] Modal is full-screen or appropriately sized
- [ ] Export All button visible

---

## 8.3 Forum-School Integration

**Route:** Various
**Last Tested:** _Not yet tested_
**Priority:** P1

### TC-FSCHOOL-001: School profile links to forum

**Preconditions:** School profile page for school with forum
**Steps:**
1. Navigate to `/schools/[school-id]`
2. Look for "Discuss" or "Community" link
**Expected Result:** Link to school's forum
**Pass Criteria:**
- [ ] Forum link visible on school profile
- [ ] Click navigates to correct subforum
- [ ] Forum shows school name as title

### TC-FSCHOOL-002: Forum displays school name from schools table

**Preconditions:** Program forum visible
**Steps:**
1. View a program forum (e.g., Duke CRNA)
2. Check title source
**Expected Result:** Title comes from schools.name
**Pass Criteria:**
- [ ] Forum title matches schools table entry
- [ ] If school renamed, forum title updates
- [ ] No hardcoded forum titles for programs

### TC-FSCHOOL-003: New school auto-creates forum

**Preconditions:** Admin with ability to add schools
**Steps:**
1. Add a new school to schools table
2. Check CRNA Programs forum for new subforum
**Expected Result:** Subforum auto-created
**Pass Criteria:**
- [ ] Trigger fires on school INSERT
- [ ] New subforum appears under CRNA Programs
- [ ] school_id correctly linked
- [ ] Slug generated from school name

### TC-FSCHOOL-004: Delete school archives forum content

**Preconditions:** School with forum that has topics
**Steps:**
1. Delete a school from database
2. Check archived_forum_content table
3. Check forums table
**Expected Result:** Forum content archived, forum deleted
**Pass Criteria:**
- [ ] Archive trigger fires BEFORE delete
- [ ] All topics/replies saved to archive
- [ ] Archive has school_name preserved
- [ ] Forum deleted from forums table
- [ ] Archive visible in admin Settings

### TC-FSCHOOL-005: Archived forum preserves all content

**Preconditions:** School deleted, archive created
**Steps:**
1. View the archived forum in admin
2. Expand and check topics
3. Export as JSON
**Expected Result:** Complete content preserved
**Pass Criteria:**
- [ ] All topic titles present
- [ ] Topic content preserved (HTML)
- [ ] All replies preserved
- [ ] Nested replies maintain parent_reply_id
- [ ] View counts, sticky flags preserved

---

## 8.4 Content Tab (Admin)

**Route:** `/admin/community` → Content tab
**Last Tested:** _Not yet tested_
**Priority:** P1

### TC-ACONT-001: Content tab displays topics table

**Preconditions:** Navigate to Content tab
**Steps:**
1. Click "Content" tab
**Expected Result:** Topics management table
**Pass Criteria:**
- [ ] Table shows: Topic, Author, Forum, Date, Actions
- [ ] Search bar visible
- [ ] Filter options available

### TC-ACONT-002: Search topics

**Preconditions:** Content tab active
**Steps:**
1. Type search query in search bar
2. Observe results
**Expected Result:** Topics filtered
**Pass Criteria:**
- [ ] Results filter in real-time
- [ ] Matches title and content
- [ ] Clear search shows all

### TC-ACONT-003: Filter by forum

**Preconditions:** Content tab active
**Steps:**
1. Click forum filter dropdown
2. Select a specific forum
**Expected Result:** Topics from that forum only
**Pass Criteria:**
- [ ] Dropdown shows all forums
- [ ] Selection filters results
- [ ] Can clear filter

### TC-ACONT-004: Pin/unpin topic

**Preconditions:** Topic visible
**Steps:**
1. Click actions on topic
2. Select "Pin" or "Unpin"
**Expected Result:** Topic pin status toggles
**Pass Criteria:**
- [ ] Pin icon appears for pinned
- [ ] Pinned topics sort to top
- [ ] Status persists

### TC-ACONT-005: Hide/unhide topic

**Preconditions:** Topic visible
**Steps:**
1. Click actions on topic
2. Select "Hide"
**Expected Result:** Topic hidden from public
**Pass Criteria:**
- [ ] Status changes to Hidden
- [ ] Topic not visible to users
- [ ] Unhide restores visibility

### TC-ACONT-006: Delete topic

**Preconditions:** Topic visible
**Steps:**
1. Click Delete on topic
2. Confirm deletion
**Expected Result:** Topic soft-deleted
**Pass Criteria:**
- [ ] Confirmation required
- [ ] Topic removed from visible list
- [ ] deleted_at timestamp set

---

## 8.5 Moderation Tab (Admin)

**Route:** `/admin/community` → Moderation tab
**Last Tested:** _Not yet tested_
**Priority:** P1

### TC-AMOD-001: Reports sub-tab shows queue

**Preconditions:** Navigate to Moderation tab
**Steps:**
1. Click "Moderation" tab
2. Click "Reports" sub-tab
**Expected Result:** Pending reports displayed
**Pass Criteria:**
- [ ] Table shows reported content
- [ ] Reporter, reason, date visible
- [ ] Action buttons available

### TC-AMOD-002: Resolve report - Dismiss

**Preconditions:** Report visible
**Steps:**
1. Click "Dismiss" on report
**Expected Result:** Report dismissed
**Pass Criteria:**
- [ ] Report removed from queue
- [ ] Content unchanged
- [ ] resolved_at set

### TC-AMOD-003: Resolve report - Remove content

**Preconditions:** Report visible
**Steps:**
1. Click "Remove" on report
**Expected Result:** Content removed, report resolved
**Pass Criteria:**
- [ ] Reported content hidden
- [ ] Report marked resolved
- [ ] moderator_notes option

### TC-AMOD-004: Suspensions sub-tab

**Preconditions:** Navigate to Suspensions
**Steps:**
1. Click "Suspensions" sub-tab
**Expected Result:** Active suspensions list
**Pass Criteria:**
- [ ] Suspended users listed
- [ ] Reason and duration shown
- [ ] Lift suspension option

### TC-AMOD-005: Create new suspension

**Preconditions:** Suspensions tab active
**Steps:**
1. Click "Suspend User"
2. Select user
3. Set duration and reason
4. Save
**Expected Result:** User suspended
**Pass Criteria:**
- [ ] User search/select works
- [ ] Duration options available
- [ ] Suspension active immediately
- [ ] User cannot post while suspended

---

# Test Execution Log

| Section | Test Cases | Last Run | Pass | Fail | Skip | Tester |
|---------|------------|----------|------|------|------|--------|
| Dashboard | 15 | - | - | - | - | - |
| My Programs | 12 | - | - | - | - | - |
| Target Program | 18 | - | - | - | - | - |
| My Trackers | 16 | - | - | - | - | - |
| My Stats | 20 | - | - | - | - | - |
| School Database | 14 | - | - | - | - | - |
| School Profile | 12 | - | - | - | - | - |
| Prerequisites | 10 | - | - | - | - | - |
| Learning Library | 8 | - | - | - | - | - |
| Module Detail | 8 | - | - | - | - | - |
| Lesson Page | 10 | - | - | - | - | - |
| Events | 8 | - | - | - | - | - |
| Marketplace | 12 | - | - | - | - | - |
| Mentor Profile | 10 | - | - | - | - | - |
| Booking Flow | 15 | - | - | - | - | - |
| My Bookings | 12 | - | - | - | - | - |
| Messages | 10 | - | - | - | - | - |
| Notifications | 8 | - | - | - | - | - |
| Admin Dashboard | 6 | - | - | - | - | - |
| Modules Admin | 12 | - | - | - | - | - |
| Module Editor | 15 | - | - | - | - | - |
| Lesson Editor | 12 | - | - | - | - | - |
| Downloads Admin | 10 | - | - | - | - | - |
| Download Editor | 12 | - | - | - | - | - |
| Categories | 8 | - | - | - | - | - |
| Entitlements | 8 | - | - | - | - | - |
| Points Config | 12 | - | - | - | - | - |
| Marketplace Admin | 8 | - | - | - | - | - |
| Providers Admin | 15 | - | - | - | - | - |
| Bookings Admin | 12 | - | - | - | - | - |
| Disputes Admin | 12 | - | - | - | - | - |
| Quality Admin | 10 | - | - | - | - | - |
| Provider Pages | 80 | - | - | - | - | - |
| Cross-Cutting | 40 | - | - | - | - | - |
| Integration | 20 | - | - | - | - | - |
| Admin Forums Tab | 15 | - | - | - | - | - |
| Archived Forums | 17 | - | - | - | - | - |
| Forum-School Integration | 5 | - | - | - | - | - |
| Content Tab Admin | 6 | - | - | - | - | - |
| Moderation Tab Admin | 5 | - | - | - | - | - |
| **TOTAL** | **~448** | - | - | - | - | - |
