# Calendar Events System

## Event Types & Sources

| Event Type | Color | Source | Auto-Show? | Can Hide? | Can Delete? |
|------------|-------|--------|------------|-----------|-------------|
| `crna_club` | Yellow | CRNA Club platform events | Yes (all members) | Yes | No |
| `deadline` | Red | Target program deadlines | Yes (if target) | Yes | No (remove target instead) |
| `school_event` | Blue | School info sessions, open houses | Conditional* | Yes | No (unsave from MyEvents instead) |
| `state_meeting` | Blue | State AA&A meetings | Conditional** | Yes | No |
| `shadow_day` | Orange | User calendar / Shadow tracker | No (user adds) | N/A | Yes |
| `work_shift` | Green | User calendar | No (user adds) | N/A | Yes |
| `interview` | Teal | User calendar OR status change | Mixed*** | Yes | Yes (if user-added) |
| `marketplace` | Purple | Marketplace bookings | Yes (if booked) | Yes | No (cancel booking instead) |
| `other` | Gray | User calendar | No (user adds) | N/A | Yes |

### Conditional Visibility Rules

**\* School Events (`school_event`):**
- Show if: Event is for a **saved program** OR **target program**
- Show if: User explicitly saved the event in MyEvents
- Do NOT show: Random school events user hasn't engaged with

**\*\* State AA&A Meetings (`state_meeting`):**
- Show if: Meeting is in a state where user has a **saved program** OR **target program**
- Example: User has Duke (NC) as target → Show NC AANA meetings

**\*\*\* Interview Events:**
- Auto-created when user changes target program status to `interview_invited`
- User can also manually add interview events
- Auto-created interviews can be hidden but not deleted (tied to program status)

---

## User Actions Matrix

### Hide vs Delete vs Unsave

| Action | What it does | When to use |
|--------|--------------|-------------|
| **Hide** | Removes from calendar view only | User doesn't want calendar clutter |
| **Delete** | Permanently removes user-created event | User added by mistake or cancelled |
| **Unsave** | Removes from MyEvents (and calendar) | User no longer interested in event |

### Action Availability by Event Type

| Event Type | Hide | Delete | Unsave | Notes |
|------------|------|--------|--------|-------|
| CRNA Club | ✅ | ❌ | ❌ | Platform events always exist |
| Deadline | ✅ | ❌ | ❌ | Remove target program to remove |
| School Event | ✅ | ❌ | ✅ (in MyEvents) | Hide from calendar, unsave separately |
| State Meeting | ✅ | ❌ | ❌ | Auto-shows based on programs |
| Shadow Day | ❌ | ✅ | ❌ | User-created |
| Work Shift | ❌ | ✅ | ❌ | User-created |
| Interview (auto) | ✅ | ❌ | ❌ | Tied to program status |
| Interview (manual) | ❌ | ✅ | ❌ | User-created |
| Marketplace | ✅ | ❌ | ❌ | Cancel booking to remove |
| Other | ❌ | ✅ | ❌ | User-created |

---

## Interview Date Capture Flow

### Trigger: Status Change to `interview_invited`

When user updates a target program status to "Interview Invited":

1. **Immediate Modal** appears asking:
   - "Congratulations! When is your interview?"
   - Date picker input
   - "I don't know yet" button

2. **If date provided:**
   - Create `interview` event on calendar
   - Link to target program
   - Show celebration toast

3. **If "I don't know yet":**
   - Store `interview_date_unknown: true` on target program
   - Store `interview_date_ask_count: 0`
   - Store `interview_date_last_asked: now()`

### Reminder Flow (if date unknown)

| Ask # | Timing | Location | Action |
|-------|--------|----------|--------|
| 1 | 24 hours later | Target program page banner | Soft reminder |
| 2 | 48 hours later | Target program page banner | Soft reminder |
| 3 | 72 hours later | Target program page banner | Last banner reminder |
| 4 | 7 days later | Toast notification | "Do you know your interview date for [School] yet?" with link |

### Reminder Stops When:
- User provides interview date
- User changes status to `accepted`, `accepted_declined`, `rejected`, or `waitlisted`
- User dismisses toast (snooze for 7 more days)
- User permanently dismisses (don't ask again for this program)

---

## Target Program Statuses

### Current Statuses
```javascript
const PROGRAM_STATUSES = [
  'not_started',        // Default
  'in_progress',        // Working on application
  'submitted',          // Application submitted
  'interview_invited',  // Received interview invite
  'interviewed',        // Completed interview
  'waitlisted',         // On waitlist
  'accepted',           // Accepted!
  'rejected',           // Not accepted
];
```

### New Status to Add
```javascript
'accepted_declined'     // Accepted but user declined the offer
```

**Behavior for `accepted_declined`:**
- Stops all interview date reminders
- Keeps program in target list (for reference)
- Shows "Declined" badge instead of "Accepted"
- Does NOT count toward "acceptances" in stats
- User can revert to `accepted` if they change mind

---

## Database Schema Updates

### Add to `saved_schools` table:
```sql
-- Interview date tracking (for interview_invited status)
interview_date DATE,
interview_date_unknown BOOLEAN DEFAULT FALSE,
interview_date_ask_count INTEGER DEFAULT 0,
interview_date_last_asked TIMESTAMPTZ,
interview_date_dismissed BOOLEAN DEFAULT FALSE,
```

### Add to status enum:
```sql
-- Update status check constraint
ALTER TABLE saved_schools
DROP CONSTRAINT IF EXISTS saved_schools_status_check;

ALTER TABLE saved_schools
ADD CONSTRAINT saved_schools_status_check
CHECK (status IN (
  'not_started', 'in_progress', 'submitted',
  'interview_invited', 'interviewed',
  'waitlisted', 'accepted', 'accepted_declined', 'rejected'
));
```

---

## UI Components Needed

### 1. InterviewDateModal
- Triggered on status change to `interview_invited`
- Date picker + "I don't know yet" option
- Creates calendar event if date provided

### 2. InterviewDateBanner
- Shown on target program detail page
- Soft reminder to add interview date
- Dismissable (counts toward ask limit)

### 3. InterviewDateToast
- Shown 7 days after last ask
- Links to add event modal with program pre-selected
- "Remind me later" (7 days) or "Don't ask again"

### 4. HideEventButton
- X button on calendar events (for hideable types)
- Confirmation: "Hide from calendar? You can unhide in MyEvents."

---

## State Machine: Interview Date Flow

```
┌─────────────────┐
│ Status Changed  │
│ to interview_   │
│ invited         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     Date provided     ┌─────────────────┐
│ Show Interview  │ ───────────────────▶  │ Create Calendar │
│ Date Modal      │                       │ Event           │
└────────┬────────┘                       └─────────────────┘
         │
         │ "I don't know yet"
         ▼
┌─────────────────┐
│ Set unknown=true│
│ ask_count=0     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     24hr     ┌─────────────────┐
│ Wait            │ ──────────▶  │ Show Banner #1  │
└─────────────────┘              └────────┬────────┘
                                          │
                   ┌──────────────────────┴──────────────────────┐
                   │                                              │
                   ▼ Date provided                    ▼ Dismissed │
         ┌─────────────────┐                ┌─────────────────┐   │
         │ Create Calendar │                │ ask_count++     │   │
         │ Event, DONE     │                │ Wait 24hr       │◀──┘
         └─────────────────┘                └────────┬────────┘
                                                     │
                                          (repeat until ask_count=3)
                                                     │
                                                     ▼
                                          ┌─────────────────┐
                                          │ Wait 7 days     │
                                          └────────┬────────┘
                                                   │
                                                   ▼
                                          ┌─────────────────┐
                                          │ Show Toast      │
                                          │ Notification    │
                                          └─────────────────┘
```
