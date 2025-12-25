# ApplicantSummaryCard

A compact card component that displays a summary of an applicant's profile for providers/mentors. Helps mentors quickly understand who they're working with and review session history.

## File Location

`/src/components/features/provider/ApplicantSummaryCard.jsx`

## Usage

```jsx
import { ApplicantSummaryCard } from '@/components/features/provider/ApplicantSummaryCard';

function SessionDetailPage() {
  const applicant = {
    id: 'applicant_001',
    name: 'Sarah Johnson',
    avatarUrl: null,
    subscriptionTier: 'member',
    targetPrograms: [
      { id: 'prog_1', schoolName: 'Georgetown' },
      { id: 'prog_2', schoolName: 'Duke' },
      { id: 'prog_3', schoolName: 'Columbia' }
    ],
    icuType: 'micu',
    icuYears: 3,
    gpa: 3.6,
    gpaPrivate: false,
    stage: 'strategizing',
    schoolsAttended: ['Georgetown'],
    icuTypeMatch: true
  };

  const sessionHistory = [
    {
      id: 'session_001',
      serviceName: 'Mock Interview',
      date: 'Dec 1, 2024',
      rating: 5
    }
  ];

  return (
    <ApplicantSummaryCard
      applicant={applicant}
      sessionHistory={sessionHistory}
      showFullProfile={true}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `applicant` | object | `{}` | Applicant data object (see structure below) |
| `sessionHistory` | array | `[]` | Array of past session objects |
| `showFullProfile` | boolean | `false` | Whether to show "View Full Profile" link |
| `className` | string | - | Additional CSS classes |

### Applicant Object Structure

```typescript
{
  id: string;                    // Unique applicant ID
  name: string;                  // Full name
  avatarUrl?: string;            // Profile picture URL (optional)
  subscriptionTier: string;      // 'free', 'lead', 'member', etc.
  targetPrograms: Array<{        // Programs they're applying to
    id: string;
    schoolName: string;
  }>;
  icuType: string;               // 'micu', 'cvicu', 'sicu', etc.
  icuYears?: number;             // Years of ICU experience
  gpa?: number;                  // Overall GPA
  gpaPrivate?: boolean;          // Whether GPA is hidden
  stage: string;                 // 'exploring', 'planning', 'applying_now', etc.
  schoolsAttended?: string[];    // Schools the provider attended (for matching)
  icuTypeMatch?: boolean;        // Whether ICU type matches provider's
}
```

### Session History Object Structure

```typescript
{
  id: string;           // Session ID
  serviceName: string;  // Name of service (e.g., "Mock Interview")
  date: string;         // Human-readable date (e.g., "Dec 1, 2024")
  rating?: number;      // Star rating 1-5 (optional)
}
```

## Features

### Header Section
- **Avatar**: Displays applicant's profile picture or initials
- **Name**: Applicant's full name
- **Member Badge**: Yellow badge shown only for CRNA Club members
- **View Full Profile Link**: Optional link to applicant's full profile (only shown if `showFullProfile={true}` and applicant is a member)

### Stats Grid (2x2)
Four key stats displayed in a compact grid:
1. **Target Programs**: Shows up to 3 program names, truncated if too long
   - If more than 3 targets, shows "+N more"
   - Shows "None yet" if no target programs
2. **ICU Experience**: Years and ICU type (e.g., "3 years MICU")
3. **GPA**: Displays GPA or "Not shared" if private
4. **Stage**: Application stage formatted nicely (e.g., "Actively Applying")

### Session History
- **First-time client**: Shows "First time client" message
- **Returning client**:
  - Shows count of previous sessions
  - Lists up to 2 sessions by default
  - Each session shows name, date, and star rating
  - "Show all" button if more than 2 sessions
  - Expandable/collapsible list

### Quick Insights
Smart insights shown when applicable:
- **School Match**: Green badge if applicant is targeting a school the provider attended
- **ICU Type Match**: Blue badge if applicant has similar ICU background

## Design Specifications

### Layout
- Compact card design suitable for sidebars or modals
- Mobile-responsive (stacks stats on small screens)
- Max width recommended: 400-500px

### Colors
- Member badge: Yellow (`bg-yellow-100 text-yellow-800`)
- Stats grid: Light gray background (`bg-gray-50`)
- School match insight: Green (`bg-green-50 text-green-700`)
- ICU match insight: Blue (`bg-blue-50 text-blue-700`)
- Avatar fallback: Purple/pink gradient

### Touch Targets
- All interactive elements (buttons, links) have minimum 44px touch targets
- "View Full Profile" link is easily tappable on mobile

## States

### Loading State
The component doesn't handle loading internally. Wrap in a skeleton loader if needed:

```jsx
{isLoading ? (
  <Skeleton className="h-96 w-full" />
) : (
  <ApplicantSummaryCard applicant={applicant} />
)}
```

### Empty State
- Shows "Unknown Applicant" if no name provided
- Shows "None yet" for target programs if empty
- Shows "First time client" if no session history

### Privacy Handling
- Respects `gpaPrivate` flag - shows "Not shared" instead of GPA
- Only shows "View Full Profile" for paying members
- Session history only shows data that provider has access to

## Common Use Cases

### 1. Provider Session Detail Page
Show applicant summary in sidebar while provider reviews session details:

```jsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <div className="lg:col-span-2">
    {/* Session content */}
  </div>
  <div className="lg:col-span-1">
    <ApplicantSummaryCard
      applicant={applicant}
      sessionHistory={sessionHistory}
      showFullProfile={true}
    />
  </div>
</div>
```

### 2. Booking Request Modal
Show applicant summary when provider reviews a booking request:

```jsx
<Dialog>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>New Booking Request</DialogTitle>
    </DialogHeader>
    <ApplicantSummaryCard
      applicant={applicant}
      sessionHistory={sessionHistory}
      showFullProfile={true}
    />
    <DialogFooter>
      <Button variant="outline">Decline</Button>
      <Button>Accept Booking</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### 3. Provider Dashboard - Upcoming Sessions
Show quick summary of upcoming client:

```jsx
<Card>
  <CardHeader>
    <CardTitle>Today's Sessions</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    {sessions.map(session => (
      <div key={session.id} className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="font-medium">{session.time}</p>
          <Badge>{session.serviceName}</Badge>
        </div>
        <ApplicantSummaryCard
          applicant={session.applicant}
          sessionHistory={session.history}
          showFullProfile={true}
        />
      </div>
    ))}
  </CardContent>
</Card>
```

## Accessibility

- Avatar has proper alt text
- All interactive elements are keyboard accessible
- Proper color contrast ratios maintained
- Screen reader friendly labels on stat icons

## Dependencies

- `@/components/ui/card`
- `@/components/ui/badge`
- `@/components/ui/avatar`
- `@/components/ui/button`
- `lucide-react` (icons)
- `@/lib/utils` (cn utility)

## Related Components

- **ProfilePreviewPanel**: Full profile preview for onboarding
- **OnboardingStep1Profile**: Provider profile setup
- **SessionDetailsCard**: Detailed session information
