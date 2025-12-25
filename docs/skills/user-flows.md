# User Flows

Conceptual overview of key user journeys through The CRNA Club application.

> **Note:** This document explains *what users are trying to accomplish* and *how they move through the app*. For implementation details, see `src/router.jsx` and component files. For test coverage, see `docs/project/manual-tests.md`.

---

## New User Onboarding

### Free Trial Signup Flow

```
Landing Page
    ↓
Click "Start Free Trial"
    ↓
Registration Form
- Email, Password
- Name
- CC info (for auto-conversion)
    ↓
Stripe processes trial signup
    ↓
Redirect to React App
    ↓
Welcome Modal
- "Welcome to The CRNA Club!"
- Video overview
- "Let's get started" button
    ↓
Dashboard (First Visit)
- Onboarding widget prominent
- Empty states with CTAs
    ↓
Guided Actions:
1. Complete your profile → /my-stats
2. Save your first program → /schools
3. Log your first clinical entry → /trackers
```

### Post-Purchase (Direct Member)

```
Checkout (Stripe)
    ↓
Purchase complete
    ↓
Account created in Supabase
    ↓
Redirect to React App with auth
    ↓
Welcome Modal (membership version)
    ↓
Dashboard with onboarding widget
```

---

## Program Discovery & Tracking

### Find and Save a Program

```
Dashboard or Nav
    ↓
Click "Schools" or "Browse Schools"
    ↓
School Database Page (/schools)
- See all 140+ programs
- Apply filters (state, GRE, tuition, etc.)
    ↓
Browse cards
    ↓
Click school card
    ↓
School Profile Page (/schools/:id)
- View all details
- Read requirements
    ↓
Click "Save" button
    ↓
Program added to Saved Programs
- Toast: "Program saved!"
- +5 points (if first save)
    ↓
Navigate to My Programs
- Program appears in Saved section
```

### Convert Saved to Target

```
My Programs Page (/my-programs)
    ↓
View Saved Programs
    ↓
Click "Make Target" on a program
    ↓
Confirmation modal (optional)
    ↓
Program moves to Target Programs
- Default checklist generated
- Status: "Not Started"
- +3 points
    ↓
Click into Target Program
    ↓
Target Program Detail Page (/my-programs/:id)
- See requirements
- Work through checklist
- Add notes
- Upload documents
```

### Track Application Progress

```
Target Program Detail Page
    ↓
Update status dropdown
- Not Started → In Progress → Submitted → Interview Invited → etc.
    ↓
Check off checklist items
- Each item: +2 points
    ↓
Upload documents
- Transcript, Resume, Essay
    ↓
Update status to "Submitted"
    ↓
Wait for outcome...
    ↓
Update: Interview Invited / Waitlisted / Accepted / Denied
    ↓
If Accepted:
- Celebration!
- Prompt to become SRNA mentor
```

---

## Clinical Tracking

### Log a Clinical Entry

```
Dashboard or Nav
    ↓
Click "My Trackers" → Clinical tab (/trackers)
    ↓
Clinical Tracker Page
- See summary stats
- See previous entries
    ↓
In the form area:
1. Select Patient Populations (tags)
2. Select Medications used
3. Select Devices used
4. Select Procedures performed
5. Add notes about the shift
6. Select date
    ↓
Click "Submit"
    ↓
Entry appears in log
- +5 points
- Stats update
    ↓
Repeat daily/weekly to build comprehensive log
```

### View Clinical Summary

```
My Stats Page (/my-stats)
    ↓
Clinical Skills section
    ↓
Tabs: Populations | Medications | Devices | Procedures
    ↓
See aggregate tags from all entries
- "Cardiac (12)" "Neuro (8)" etc.
    ↓
This populates "living resume"
```

---

## Shadow Day Tracking

### Log Shadow Experience

```
My Trackers → Shadow Days tab (/trackers)
    ↓
View current stats:
- Total Hours: X
- Cases Observed: X
    ↓
Fill out form:
- Date
- Location (facility)
- Who I Observed (CRNA name)
- Email Address
- Cases Observed (number)
- Hours Logged
- Notes
    ↓
Click Submit
    ↓
Entry added to log
- +5 points
- Total hours update
    ↓
Check off Skills Observed (optional)
- Intubation, Extubation, etc.
```

---

## EQ Reflection Tracking

### Log an EQ Entry

```
My Trackers → EQ tab (/trackers)
    ↓
View previous reflections
    ↓
Fill out form:
- Date
- Title (what happened)
- Reflection (what you learned)
- Categories (Communication, Leadership, etc.)
    ↓
Click Submit
    ↓
Entry added to log
- +5 points
- Builds interview story bank
```

---

## Learning Library

### Browse and Complete Lessons

```
Nav → Learn (/learn)
    ↓
Learning Library Page
- Browse module cards
- See progress indicators
    ↓
Click module card
    ↓
Module Detail Page (/learn/:moduleSlug)
- See all lessons in module
- Track completion status
    ↓
Click lesson
    ↓
Lesson Page (/learn/:moduleSlug/:lessonSlug)
- Watch video (Vimeo)
- Read content
- Access resources
    ↓
Click "Mark Complete"
    ↓
Progress saved
- +3 points
- Next lesson unlocked
```

### Download Resources

```
Nav → Downloads (/downloads)
    ↓
Browse download categories
    ↓
Click download card
    ↓
If entitled:
- Download starts immediately
If not entitled:
- Paywall shown with upgrade CTA
```

---

## Prerequisite Course Discovery

### Find a Course

```
Nav → Prerequisite Library (/prerequisites)
    ↓
Prerequisite Library Page
    ↓
Filter by:
- Subject (Anatomy, Chemistry, etc.)
- Level (Graduate/Undergraduate)
- View All or Saved
    ↓
Browse course cards
- See school, ratings, cost
    ↓
Click "View Details"
    ↓
Course Detail Page
- Full course info
- Student reviews
    ↓
Decide if it fits your needs
    ↓
Click "Save" to add to Saved Courses
```

### Write a Review

```
Course Detail Page
    ↓
Click "Write Review"
    ↓
Modal opens
    ↓
Rate:
- Willingness to Recommend (1-5)
- Ease of Course (1-5)
    ↓
Write review text
    ↓
Select tags (Time Required, Self-Paced, etc.)
    ↓
Submit
    ↓
Review appears on course
- +10 points
```

---

## Marketplace - Applicant Side

### Find a Mentor

```
Nav → Marketplace (/marketplace)
    ↓
Marketplace Page
- Browse mentor cards
- Filter by service type, price, availability
- Search by name or program
    ↓
Click mentor card
    ↓
Mentor Profile Page (/marketplace/mentor/:id)
- Bio, credentials, program info
- Personality info ("vibe check")
- Services offered with pricing
- Reviews from past sessions
- Welcome video (if uploaded)
    ↓
Select a service
    ↓
Click "Book" or "Quick Book" (if instant booking enabled)
```

### Book a Service

```
Click "Book" on service
    ↓
Booking Flow (/marketplace/book/:serviceId)
    ↓
Step 1: Select Time
- View mentor's availability calendar
- Pick date and time slot
    ↓
Step 2: Service-Specific Intake
- Mock Interview: interview type, target programs, concerns
- Essay Review: document upload, draft stage, feedback type
- Coaching: current stage, main concerns, priority question
    ↓
Step 3: Review & Pay
- Booking summary
- Price breakdown (service + platform fee)
- Payment via Stripe
    ↓
If Request-Based Booking:
- Payment authorized (not captured)
- Mentor has 48h to accept/decline
- If accepted: payment captured, booking confirmed
- If declined: authorization released, try another mentor
    ↓
If Instant Booking:
- Payment captured immediately
- Booking confirmed
    ↓
Confirmation
- "Booking confirmed!"
- Calendar invite sent
- Appears in My Bookings
```

### Pre-Booking Inquiry

```
Mentor Profile Page
    ↓
Click "Send Message" (before booking)
    ↓
Inquiry Modal
- Ask questions about the service
- Clarify availability
    ↓
Conversation thread created
- Check Messages (/marketplace/messages) for replies
    ↓
If satisfied, proceed to book
```

### Manage Bookings

```
Nav → My Bookings (/marketplace/my-bookings)
    ↓
See all bookings by status:
- Upcoming
- Pending (awaiting mentor response)
- Completed
- Cancelled
    ↓
Click booking for details
    ↓
Before session:
- View meeting link
- Message mentor
- Cancel or reschedule (with policy)
    ↓
After session:
- Leave review (double-blind - visible after both review or 14 days)
- Rate experience (1-5 stars)
```

---

## Marketplace - Provider (SRNA) Side

### Become a Provider

```
Landing Page (/marketplace/become-a-mentor)
- Learn about mentoring opportunity
- See commission rates (20%)
- Understand expectations
    ↓
Click "Apply Now"
    ↓
Provider Application (/marketplace/provider/apply)
- CRNA program & graduation year
- License verification (RN license number + state)
- Student ID upload
- Bio and why you want to mentor
    ↓
Submit application
    ↓
Application Status Page (/marketplace/provider/application-status)
- Track application progress
- Admin may request additional info
- Respond via messaging
    ↓
If Approved:
- Proceed to onboarding
```

### Complete Provider Onboarding

```
Provider Onboarding (/marketplace/provider/onboarding)
    ↓
Step 1: Profile Setup
- Profile photo
- Welcome video (optional)
- Bio
- Personality questions (vibe matching)
    ↓
Step 2: Create Services
- Choose service types (Mock Interview, Essay Review, Coaching)
- Set pricing
- Set duration
- Use templates or customize
    ↓
Step 3: Set Availability
- Connect calendar
- Set recurring availability
- Block vacation dates
    ↓
Step 4: Stripe Connect
- Complete Stripe onboarding for payouts
- Verify identity
- Add bank account
    ↓
Step 5: Review & Go Live
- Preview your profile
- Agree to terms
- Click "Go Live"
    ↓
Profile visible in marketplace!
```

### Manage as Provider

```
Provider Dashboard (/marketplace/provider/dashboard)
- Overview stats (bookings, earnings, rating)
- Quick actions
    ↓
Incoming Requests (/marketplace/provider/requests)
- See pending booking requests
- Accept or decline within 48h
- Message applicant if needed
    ↓
My Bookings (/marketplace/provider/bookings)
- Upcoming sessions
- Session notes (Editor.js)
- Mark complete
    ↓
My Services (/marketplace/provider/services)
- Edit service details
- Toggle active/inactive
- View performance per service
    ↓
Availability (/marketplace/provider/availability)
- Update calendar
- Set vacation mode
    ↓
Earnings (/marketplace/provider/earnings)
- View earnings history
- Track payouts
- See pending balance
    ↓
Insights (/marketplace/provider/insights)
- Profile views
- Conversion rate
- Review trends
```

---

## Community Engagement

### Post in Forum

```
Nav → Community → Forums
    ↓
Forums Page
- See categories
    ↓
Click category (e.g., "CRNA Programs")
    ↓
Topics List
    ↓
Click "New Discussion"
    ↓
Create Topic Form
- Title
- Content (rich text)
    ↓
Post
    ↓
Topic created
- +2 points
- Appears in forum
```

### Reply to Topic

```
Topic Detail Page
    ↓
Read original post
    ↓
Read existing replies
    ↓
Scroll to reply form
    ↓
Write reply
    ↓
Submit
    ↓
Reply appears
- +2 points
```

### Join a Group

```
Nav → Community → Groups
    ↓
Groups Page
    ↓
Browse groups
    ↓
Click group card
    ↓
Group Detail Page
- Description
- Members
- Activity feed
    ↓
Click "Join Group"
    ↓
Now a member
- +2 points
- Can post in group
```

---

## Upgrade Flow

### Free User Hits Paywall

```
Free user browsing
    ↓
Clicks into protected content
    ↓
Paywall overlay shows
- Content blurred
- "Unlock Full Access"
- Benefits listed
    ↓
Click "Start Free Trial" or "Subscribe"
    ↓
Redirect to Stripe checkout
    ↓
Complete purchase
    ↓
Redirect back to app
    ↓
Full access granted
- Paywall removed
```

### Trial Ending Reminder

```
7-day trial user
    ↓
Day 5: Email reminder
    ↓
Day 6: In-app notification
- "Your trial ends tomorrow!"
    ↓
Day 7: Final reminder
    ↓
If CC on file: Auto-converts
If cancelled: Reverts to free
```

---

## Admin Flows

### Manage Learning Content

```
Admin Dashboard (/admin)
    ↓
Modules List (/admin/modules)
- View all modules
- Create new module
    ↓
Module Editor (/admin/modules/:id)
- Edit module details
- Manage sections
- Reorder lessons
    ↓
Lesson Editor (/admin/lessons/:id)
- Block editor (Editor.js)
- Add video, text, resources
- Set entitlements
- Preview
    ↓
Publish changes
```

### Manage Marketplace

```
Admin Dashboard → Marketplace (/admin/marketplace)
    ↓
Provider Management (/admin/marketplace/providers)
- Review pending applications
- Approve/deny with message
- View provider details
- Suspend providers if needed
    ↓
Booking Management (/admin/marketplace/bookings)
- View all bookings
- Handle disputes
- Process refunds
    ↓
Quality Moderation (/admin/marketplace/quality)
- Review flagged content
- Moderate reviews
- Quality metrics
```

### Configure Points

```
Admin Dashboard → Points (/admin/points)
    ↓
View all point actions
- lesson_complete: 3 pts
- shadow_log: 5 pts
- etc.
    ↓
Edit base points per action
    ↓
Create promotional periods
- 2x points this week!
- Set date range
- Apply to all or specific actions
```

---

## Events Flow

### Browse and Track Events

```
Nav → Events (/events)
    ↓
Events Page
- Upcoming events calendar
- Filter by type, date, location
    ↓
Click event card
    ↓
Event Detail
- Date, time, location
- Description
- Registration link (external)
    ↓
Click "Log Attendance" (after attending)
    ↓
Add to Events Tracker
- +5 points
- Appears in My Stats
```
