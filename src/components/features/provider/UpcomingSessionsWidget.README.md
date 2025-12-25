# UpcomingSessionsWidget

Display provider's upcoming mentoring sessions with smart time-based actions.

## Location

`/src/components/features/provider/UpcomingSessionsWidget.jsx`

## Overview

A dashboard widget that shows providers their next 3 upcoming sessions with applicants. Features intelligent time display, automatic "Join Video" button activation, and responsive layout.

## Features

- **Smart Time Display**: Shows relative time ("In 2 hours", "Tomorrow at 3pm", "Monday at 10am")
- **Dynamic Join Button**: "Join Video" button appears 5 minutes before session starts
- **Session Sorting**: Automatically sorts by time and shows next 3 sessions
- **Avatar Fallbacks**: Displays initials when no profile photo available
- **Empty State**: Friendly message with calendar link when no sessions scheduled
- **Mobile Responsive**: Optimized for all screen sizes

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `sessions` | `Array<Session>` | Mock data | Array of session objects |
| `onJoinVideo` | `function(sessionId)` | Console log | Callback when "Join Video" clicked |
| `className` | `string` | `''` | Additional CSS classes |

### Session Object Structure

```typescript
{
  id: string;              // Unique session identifier
  applicantName: string;   // Full name of applicant
  applicantAvatar: string | null;  // Avatar URL (optional)
  service: string;         // Service type (e.g., "Mock Interview")
  scheduledAt: Date | string;  // Session start time
  videoLink: string;       // Video meeting URL
  duration: number;        // Duration in minutes
}
```

## Usage

### Basic Usage

```jsx
import { UpcomingSessionsWidget } from '@/components/features/provider/UpcomingSessionsWidget';

function ProviderDashboard() {
  const sessions = [
    {
      id: 'session-1',
      applicantName: 'Sarah Johnson',
      applicantAvatar: null,
      service: 'Mock Interview',
      scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
      videoLink: 'https://zoom.us/j/123456789',
      duration: 60,
    },
  ];

  const handleJoinVideo = (sessionId) => {
    const session = sessions.find(s => s.id === sessionId);
    window.open(session.videoLink, '_blank');
  };

  return (
    <UpcomingSessionsWidget
      sessions={sessions}
      onJoinVideo={handleJoinVideo}
    />
  );
}
```

### With API Data

```jsx
function ProviderDashboard() {
  const { data: sessions, isLoading } = useQuery('sessions', fetchSessions);

  if (isLoading) return <UpcomingSessionsWidgetSkeleton />;

  return (
    <UpcomingSessionsWidget
      sessions={sessions}
      onJoinVideo={(id) => {
        analytics.track('Session Joined', { sessionId: id });
        // Handle video joining logic
      }}
    />
  );
}
```

## Join Video Logic

The "Join Video" button becomes visible when:
- Session starts in ≤ 5 minutes
- OR session started ≤ 30 minutes ago

This allows providers to join slightly early and accounts for running sessions.

## Relative Time Display

| Time Until Session | Display Format |
|-------------------|----------------|
| < 1 minute | "Starting now" |
| 1-59 minutes | "In X minutes" |
| 1-23 hours | "In X hours" |
| Tomorrow | "Tomorrow at 3:00pm" |
| 2-6 days | "Wednesday at 10:00am" |
| Same year | "Dec 15 at 2:30pm" |
| Different year | "Jan 5, 2025 at 11:00am" |

## Empty State

When no sessions are scheduled, displays:
- Coffee cup icon
- "No upcoming sessions" message
- "Time to relax!" subtext
- "View Calendar" button

## Dependencies

- `@/components/ui/card` - Card wrapper components
- `@/components/ui/button` - Button component
- `@/components/ui/avatar` - Avatar display
- `@/lib/dateFormatters` - Relative time formatting
- `lucide-react` - Icons (Video, Calendar, ChevronRight, Coffee)

## Testing

Component includes `data-testid="upcoming-sessions-widget"` for testing:

```jsx
import { render, screen } from '@testing-library/react';

test('displays upcoming sessions', () => {
  render(<UpcomingSessionsWidget sessions={mockSessions} />);
  expect(screen.getByTestId('upcoming-sessions-widget')).toBeInTheDocument();
  expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
});

test('shows join button for imminent sessions', () => {
  const imminentSession = {
    id: '1',
    scheduledAt: new Date(Date.now() + 3 * 60 * 1000), // 3 min
    // ... other props
  };

  render(<UpcomingSessionsWidget sessions={[imminentSession]} />);
  expect(screen.getByText('Join Video')).toBeInTheDocument();
});
```

## Styling

Component uses:
- Card with shadow and border
- Hover effects on session cards
- Green accent for "Join Video" button
- Gray tones for text hierarchy
- Responsive spacing

## Future Enhancements

Potential improvements:
- [ ] Auto-refresh when sessions approach start time
- [ ] Notification badge when session can be joined
- [ ] One-click reschedule option
- [ ] Session notes preview
- [ ] Applicant profile quick view on hover
- [ ] Bulk actions (cancel multiple sessions)

## Related Components

- `OnboardingProgressWidget` - Provider onboarding flow
- `ProviderCalendar` - Full calendar view
- `SessionDetailPage` - Individual session details

## Notes

- Uses mock data by default for development
- Automatically sorts and limits to 3 sessions
- Avatar fallback shows 2-letter initials
- Empty state included for zero sessions
- Mobile-first responsive design
- Accessible keyboard navigation
