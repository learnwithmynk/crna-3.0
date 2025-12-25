# Empty States

Empty states are critical for guiding users to take action. Every list, tracker, and data-dependent view needs a thoughtful empty state.

---

## Empty State Anatomy

```
┌─────────────────────────────────────┐
│                                     │
│            [Icon]                   │
│                                     │
│      Primary Message                │
│   Secondary description text        │
│                                     │
│        [ Action Button ]            │
│                                     │
└─────────────────────────────────────┘
```

---

## Empty State by Page

### Dashboard - To-Do List Empty
**When:** No tasks created
**Message:** "You're all caught up!"
**Description:** "Add tasks as you work through your application journey."
**Action:** "Add Task" button

---

### My Programs - No Saved Programs
**When:** User hasn't saved any programs
**Message:** "No programs saved yet"
**Description:** "Start exploring the school database to find programs that match your goals."
**Action:** "Browse Schools" → `/schools`

---

### My Programs - No Target Programs
**When:** User has saved programs but none marked as targets
**Message:** "No target programs yet"
**Description:** "Convert a saved program to a target to start tracking your application."
**Action:** "View Saved Programs" toggle

---

### Target Program - Empty Checklist
**When:** All default items removed, no custom items
**Message:** "No checklist items"
**Description:** "Add items to track your progress for this program."
**Action:** "Add Checklist Item" button

---

### Target Program - No Documents
**When:** No documents uploaded
**Message:** "No documents yet"
**Description:** "Upload your transcripts, resume, and essays for this program."
**Action:** "Upload Document" button

---

### Clinical Tracker - No Entries
**When:** No clinical entries logged
**Message:** "Start tracking your clinical experience"
**Description:** "Log your shifts to build a comprehensive record for your applications and interviews."
**Action:** "Log First Entry" button

---

### EQ Tracker - No Entries
**When:** No EQ reflections logged
**Message:** "Reflect on your growth"
**Description:** "Recording moments of leadership, conflict resolution, and teamwork will help you in interviews."
**Action:** "Add Reflection" button

---

### Shadow Days - No Entries
**When:** No shadow days logged
**Message:** "Log your shadowing experiences"
**Description:** "Track your hours and the skills you observe during CRNA shadowing."
**Action:** "Log Shadow Day" button

---

### Events Tracker - No Events
**When:** No events logged
**Message:** "Track the events you attend"
**Description:** "Log AANA meetings, open houses, and info sessions you've attended."
**Action:** "Add Event" button

---

### School Database - No Results
**When:** Filters return no schools
**Message:** "No programs match your filters"
**Description:** "Try adjusting your filters or search terms."
**Action:** "Reset Filters" button

---

### Prerequisite Library - No Results
**When:** Search/filters return no courses
**Message:** "No courses found"
**Description:** "Try different search terms or submit a new course."
**Action:** "Submit New Course" button

---

### Prerequisite Library - No Saved Courses
**When:** User hasn't saved any courses
**Message:** "No saved courses yet"
**Description:** "Save courses you're interested in to access them later."
**Action:** "Browse Courses" button

---

### Forums - No Topics
**When:** Forum category has no topics
**Message:** "No discussions yet"
**Description:** "Be the first to start a conversation in this forum."
**Action:** "New Discussion" button

---

### Groups - User Not in Any Groups
**When:** User hasn't joined any groups
**Message:** "You haven't joined any groups yet"
**Description:** "Join groups to connect with other applicants on similar journeys."
**Action:** "Browse Groups" button

---

### Messages - No Conversations
**When:** User has no message threads
**Message:** "No messages yet"
**Description:** "Send a message to connect with other members."
**Action:** "Start Conversation" button

---

### My Purchases - No Toolkit Access
**When:** User hasn't purchased any toolkits
**Message:** "No purchases yet"
**Description:** "You'll see your toolkit content here after purchase."
**Action:** "Browse Toolkits" → Shop

---

### Events Directory - No Upcoming Events
**When:** No events in the near future
**Message:** "No upcoming events"
**Description:** "Check back soon for new AANA meetings, open houses, and CRNA Club events."
**Action:** "View Past Events" toggle

---

## Empty State Component

```jsx
// src/components/ui/empty-state.jsx

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12 px-4 text-center",
      className
    )}>
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-gray-400" />
        </div>
      )}
      
      <h3 className="text-lg font-medium text-gray-900 mb-1">
        {title}
      </h3>
      
      <p className="text-gray-500 max-w-sm mb-6">
        {description}
      </p>
      
      {action && (
        action.href ? (
          <Button asChild>
            <a href={action.href}>{action.label}</a>
          </Button>
        ) : (
          <Button onClick={action.onClick}>
            {action.label}
          </Button>
        )
      )}
    </div>
  );
}
```

---

## Usage Example

```jsx
import { EmptyState } from '@/components/ui/empty-state';
import { Target } from 'lucide-react';

function MyProgramsList({ programs }) {
  if (programs.length === 0) {
    return (
      <EmptyState
        icon={Target}
        title="No programs saved yet"
        description="Start exploring the school database to find programs that match your goals."
        action={{
          label: 'Browse Schools',
          href: '/schools'
        }}
      />
    );
  }

  return (
    <div className="grid gap-4">
      {programs.map(program => (
        <ProgramCard key={program.id} program={program} />
      ))}
    </div>
  );
}
```

---

## Design Guidelines

### Icon Selection
Use Lucide icons that match the context:
- `Target` - Programs
- `Heart` - Clinical
- `Users` - Community
- `Calendar` - Events/Shadow Days
- `BookOpen` - Learning
- `FileText` - Documents
- `MessageSquare` - Messages
- `Search` - No results

### Tone
- **Encouraging, not blaming:** "Start tracking..." not "You haven't tracked..."
- **Action-oriented:** Point to what they can do next
- **Brief:** 1 sentence for primary, 1-2 for description

### Visual Weight
- Empty states should be noticeable but not overwhelming
- Use muted colors (gray-400 for icon, gray-500 for description)
- Keep whitespace generous
- Center in the available space

### Consistency
- Same component structure across all empty states
- Same spacing and sizing
- Icons all from same library (Lucide)
- Buttons use primary style

---

## First-Time User Experience

Some empty states double as onboarding prompts:

### Dashboard (New User)
Instead of multiple empty widgets, show a focused onboarding card:

```jsx
<Card className="p-6 text-center">
  <h2 className="text-xl font-bold mb-2">Welcome to The CRNA Club! 🎉</h2>
  <p className="text-gray-600 mb-6">
    Let's get you set up. Start by completing your profile and saving your first program.
  </p>
  <div className="flex justify-center gap-4">
    <Button onClick={() => navigate('/my-stats')}>Complete Profile</Button>
    <Button variant="outline" onClick={() => navigate('/schools')}>
      Browse Schools
    </Button>
  </div>
</Card>
```

### Progressive Disclosure
As user completes actions, empty states transform into data:
1. First visit: Prominent onboarding card
2. After profile: Normal empty states with actions
3. After first program saved: Show program, other sections still empty
4. Gradually fills in as they engage

---

## Loading vs Empty

Distinguish between:

**Loading** (data is fetching):
```jsx
<div className="grid gap-4">
  <Skeleton className="h-24" />
  <Skeleton className="h-24" />
  <Skeleton className="h-24" />
</div>
```

**Empty** (data fetched, nothing exists):
```jsx
<EmptyState
  title="No programs yet"
  description="..."
  action={...}
/>
```

Always show skeleton while loading, then resolve to content or empty state.
