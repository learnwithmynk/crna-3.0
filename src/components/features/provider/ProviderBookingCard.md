# ProviderBookingCard Component

Displays booking details for providers with context-aware actions based on booking status.

## Features

- **Applicant Information**: Avatar, name, and application stage
- **Status Badge**: Visual indicator of booking status with appropriate colors
- **Service Details**: Title, duration, and session type (live/async)
- **Date & Time**: Formatted with timezone
- **Pricing**: Shows total amount and provider earnings after 20% platform fee
- **Target Programs**: Display applicant's target programs (if available)
- **Applicant Notes**: Context provided by the applicant
- **Materials**: Collapsible section showing uploaded files with download links
- **Status-Aware Actions**: Different buttons based on booking status
- **Join Video**: Only visible 5 minutes before scheduled time

## Props

```typescript
interface ProviderBookingCardProps {
  booking: Booking;
  onJoinVideo?: (videoLink: string) => void;
  onReschedule?: (bookingId: string) => void;
  onCancel?: (bookingId: string) => void;
  onLeaveReview?: (bookingId: string) => void;
  onAccept?: (bookingId: string) => void;
  onDecline?: (bookingId: string) => void;
  onViewReview?: (bookingId: string) => void;
  onMessageApplicant?: (applicantId: string) => void;
  onViewDetails?: (bookingId: string) => void;
}

interface Booking {
  id: string;
  status: BookingStatus;
  scheduledAt: string; // ISO date string
  applicant: {
    id: string;
    name: string;
    avatarUrl?: string;
    currentStage?: string;
    targetPrograms?: string[];
  };
  service: {
    title: string;
    durationMinutes: number;
    isLive: boolean;
  };
  amountPaid: number;
  providerPayout: number;
  applicantNotes?: string;
  materials?: Material[];
  cancellationReason?: string;
  providerReview?: Review;
  videoLink?: string;
}

type BookingStatus =
  | 'pending_acceptance'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'declined'
  | 'expired'
  | 'disputed';
```

## Status Badge Colors

| Status | Color | Label |
|--------|-------|-------|
| `pending_acceptance` | Yellow | Pending |
| `confirmed` | Blue | Upcoming |
| `in_progress` | Purple | In Progress |
| `completed` | Green | Completed |
| `cancelled` | Gray | Cancelled |
| `declined` | Red | Declined |
| `expired` | Gray | Expired |
| `disputed` | Orange | Disputed |

## Actions by Status

### Pending Acceptance
- **Accept** button (primary)
- **Decline** button (outline)

### Confirmed (Upcoming)
- **Join Video** button (only visible 5 min before session, green)
- **Reschedule** button (outline)
- **Cancel** button (outline)
- **Message** button (ghost, optional)
- **View Details** link

### Completed
- **Leave Review** button (if no review yet)
- **View Review** button (if review exists)
- **Message** button (outline, optional)
- **View Details** link

### Cancelled
- Info message: "This booking was cancelled"
- Shows cancellation reason if provided

## Usage

```jsx
import { ProviderBookingCard } from '@/components/features/provider';

function ProviderBookingsPage() {
  const handleAccept = async (bookingId) => {
    // Accept the booking request
  };

  const handleDecline = async (bookingId) => {
    // Decline the booking request
  };

  const handleJoinVideo = (videoLink) => {
    window.open(videoLink, '_blank');
  };

  return (
    <div className="space-y-4">
      {bookings.map(booking => (
        <ProviderBookingCard
          key={booking.id}
          booking={booking}
          onAccept={handleAccept}
          onDecline={handleDecline}
          onJoinVideo={handleJoinVideo}
          onReschedule={handleReschedule}
          onCancel={handleCancel}
          onLeaveReview={handleLeaveReview}
          onViewReview={handleViewReview}
          onMessageApplicant={handleMessageApplicant}
          onViewDetails={handleViewDetails}
        />
      ))}
    </div>
  );
}
```

## Layout Sections

### Header
- Left: Avatar + Applicant name + stage
- Right: Status badge

### Content
1. **Service Info**: Title, duration, session type
2. **Date & Time**: Formatted datetime with timezone
3. **Pricing**: Total and provider earnings
4. **Target Programs**: Applicant's target schools (optional)
5. **Notes**: Applicant's context (optional)
6. **Materials**: Collapsible list with download links (optional)
7. **Cancellation Reason**: For cancelled bookings (optional)

### Footer
- Context-aware action buttons based on status
- View Details link (for most statuses)

## Video Join Logic

The "Join Video" button only appears when:
1. Status is `confirmed`
2. `videoLink` is provided
3. Current time is 5 minutes or less before `scheduledAt`

This prevents providers from joining too early and ensures smooth session starts.

## Materials Section

When the booking has uploaded materials:
- Shows collapsible button: "Materials (X)"
- Expands to show file list
- Each file has:
  - File icon
  - Filename
  - Download link

## Responsive Design

- Mobile-first design
- Actions wrap on small screens
- Avatar scales appropriately
- Touch-friendly button sizes (min 44px)

## Accessibility

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus states on all buttons
- Icon + text for clarity

## Example States

See `ProviderBookingCard.example.jsx` for examples of:
- Pending acceptance
- Upcoming with materials
- Session starting soon
- Completed (needs review)
- Completed (with review)
- Cancelled booking
