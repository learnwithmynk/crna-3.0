# IncomingRequestsWidget

Provider dashboard widget that displays pending booking requests with countdown timers.

## Features

- **Pending Requests List**: Shows first 3 pending booking requests
- **Countdown Timers**: 48-hour response deadline with color-coded urgency
- **Quick Actions**: Accept/Decline buttons on each request
- **Commission Display**: Shows "You'll earn $X" (80% after 20% commission)
- **Empty State**: Friendly message when no pending requests
- **View All Link**: When more than 3 requests exist

## Timer Color Coding

The countdown timer changes color based on time remaining:

- **Green** (> 24 hours): Plenty of time to respond
- **Yellow/Orange** (12-24 hours): Moderate urgency
- **Red** (< 12 hours): Urgent - deadline approaching

## Props

```jsx
<IncomingRequestsWidget
  requests={array}      // Array of request objects
  onAccept={function}   // Called with requestId when Accept clicked
  onDecline={function}  // Called with requestId when Decline clicked
  className={string}    // Optional additional CSS classes
/>
```

## Request Object Structure

```js
{
  id: 'req-1',
  applicantName: 'Sarah M.',
  applicantAvatar: null,        // URL or null for initials fallback
  service: 'Mock Interview',
  price: 100,                   // Full price in dollars
  submittedAt: Date,            // When request was submitted
  preferredTimes: ['Mon 2pm', 'Tue 10am']
}
```

## Usage Example

```jsx
import { IncomingRequestsWidget } from '@/components/features/provider/IncomingRequestsWidget';

function ProviderDashboard() {
  const handleAccept = async (requestId) => {
    // Navigate to scheduling page or show confirmation
    await acceptRequest(requestId);
  };

  const handleDecline = async (requestId) => {
    if (confirm('Are you sure?')) {
      await declineRequest(requestId);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <IncomingRequestsWidget
        requests={pendingRequests}
        onAccept={handleAccept}
        onDecline={handleDecline}
      />
      {/* Other dashboard widgets */}
    </div>
  );
}
```

## Empty State

When no requests are pending:

```
🕐 (green circle icon)

No pending requests - great job staying on top of things!
```

## View Example

To see the component in action:

```bash
# Run dev server
npm run dev

# Navigate to:
# /examples/provider/incoming-requests-widget
```

Or check: `IncomingRequestsWidget.example.jsx`

## Technical Details

- **Auto-updating**: Timer updates every 60 seconds
- **Commission**: Fixed 20% platform fee (shows 80% to provider)
- **Responsive**: Works on mobile and desktop
- **Accessibility**: Proper touch targets (44px minimum)
- **Test ID**: `data-testid="incoming-requests-widget"`

## Integration with Provider Dashboard

Typically placed in the top-left quadrant of provider dashboard alongside:
- Earnings widget
- Upcoming sessions widget
- Performance stats
