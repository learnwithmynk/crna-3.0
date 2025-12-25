# VacationModeSettings Component

## Overview
The `VacationModeSettings` component allows SRNA providers to manage their marketplace availability during vacations or periods when they're unable to take new bookings. It provides a complete interface for pausing availability, setting vacation dates, configuring auto-responses, and viewing existing bookings during the pause period.

## Location
`/Users/sachi/Desktop/crna-club-rebuild/src/components/features/provider/VacationModeSettings.jsx`

## Features

### 1. Pause Toggle
- Large, prominent toggle switch to pause/unpause availability
- Clear visual feedback when paused (orange warning banner)
- Descriptive text explaining what pausing does

### 2. Vacation Date Range
- Optional start and end date pickers
- Only shown when paused is active
- End date automatically constrained to be after start date
- Helps providers plan ahead

### 3. Auto-Response Message
- Customizable message sent to applicants during pause
- Character counter (500 character limit)
- Placeholder text with example message
- Only shown when paused

### 4. Existing Bookings Display
- Shows confirmed bookings during vacation period
- Each booking card displays:
  - Applicant name with avatar/initials
  - Service type
  - Date and time
  - Status badge
- Scrollable list with max-height
- Empty state with encouraging message

### 5. Visual Feedback
- Warning banner (orange) when paused - shows at top
- Info banner (blue) when not paused - explains how vacation mode works
- Clear visual hierarchy
- Responsive design (mobile-first)

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isPaused` | `boolean` | `false` | Whether vacation mode is currently active |
| `onPausedChange` | `function` | - | Callback when pause toggle changes. Receives `(checked: boolean)` |
| `vacationStart` | `Date \| null` | `null` | Start date of vacation period |
| `vacationEnd` | `Date \| null` | `null` | End date of vacation period |
| `onVacationDatesChange` | `function` | - | Callback when dates change. Receives `(start: Date \| null, end: Date \| null)` |
| `autoResponseMessage` | `string` | `''` | Custom auto-response message for inquiries |
| `onAutoResponseChange` | `function` | - | Callback when message changes. Receives `(message: string)` |
| `bookingsDuringPause` | `array` | `[]` | Array of booking objects during vacation period |
| `className` | `string` | - | Additional CSS classes |

## Booking Object Shape

```javascript
{
  id: 'booking-1',
  applicantName: 'Sarah Johnson',
  applicantAvatar: 'https://...' or null,
  service: 'Mock Interview Session',
  date: Date object,
  time: '2:00 PM EST',
  status: 'confirmed' // 'confirmed', 'pending', 'completed', etc.
}
```

## Usage Example

```jsx
import { VacationModeSettings } from '@/components/features/provider';
import { useState } from 'react';

function ProviderSettingsPage() {
  const [isPaused, setIsPaused] = useState(false);
  const [vacationStart, setVacationStart] = useState(null);
  const [vacationEnd, setVacationEnd] = useState(null);
  const [autoResponse, setAutoResponse] = useState('');
  const [bookings, setBookings] = useState([]);

  const handleVacationDatesChange = (start, end) => {
    setVacationStart(start);
    setVacationEnd(end);

    // Fetch bookings in this date range
    if (start && end) {
      fetchBookingsInRange(start, end).then(setBookings);
    }
  };

  return (
    <VacationModeSettings
      isPaused={isPaused}
      onPausedChange={setIsPaused}
      vacationStart={vacationStart}
      vacationEnd={vacationEnd}
      onVacationDatesChange={handleVacationDatesChange}
      autoResponseMessage={autoResponse}
      onAutoResponseChange={setAutoResponse}
      bookingsDuringPause={bookings}
    />
  );
}
```

## Component Structure

```
VacationModeSettings
├── PausedBanner (conditional - shown when paused)
├── InfoBanner (conditional - shown when not paused)
├── Pause Toggle Section
├── Vacation Dates Section (conditional - shown when paused)
│   ├── Start Date Input
│   └── End Date Input
├── Auto-Response Section (conditional - shown when paused)
│   └── Message Textarea with character counter
├── Existing Bookings Section (conditional - shown when paused and has bookings)
│   └── BookingCard[] (list of bookings)
└── Action Buttons
    ├── Save Changes Button
    └── Cancel Button
```

## Behavior Details

### When Toggle is OFF (Not Paused)
- Shows blue info banner explaining vacation mode
- Only displays the toggle section
- Date range, auto-response, and bookings sections are hidden

### When Toggle is ON (Paused)
- Shows orange warning banner at top
- Displays vacation date range picker
- Shows auto-response message textarea
- If dates are set, shows bookings during that period
- If no bookings exist during vacation, shows encouraging message

### Date Validation
- End date input has `min` attribute set to start date
- Prevents selecting end date before start date
- Dates are optional (pause can be indefinite)

### Auto-Response
- Character limit: 500 characters
- Character counter displayed below textarea
- Placeholder provides example message format
- Saved and sent to applicants who try to contact paused provider

## Styling

### Colors
- Warning banner: Orange (`orange-50`, `orange-200`, `orange-600`, `orange-900`)
- Info banner: Blue (`blue-50`, `blue-200`, `blue-600`, `blue-900`)
- Success badge: Green (`green-100`, `green-800`)
- Avatar fallback: Purple (`purple-100`, `purple-700`)

### Responsive Behavior
- Date inputs: Stack on mobile (`grid-cols-1`), side-by-side on tablet+ (`sm:grid-cols-2`)
- Booking cards: Flex layout that wraps gracefully on mobile
- Touch targets: All interactive elements meet 44px minimum

## Integration Points

### API Calls (TODO)
1. **Save Settings**: Save vacation mode state, dates, and auto-response
2. **Fetch Bookings**: Query bookings within vacation date range
3. **Update Profile**: Hide/show provider in marketplace search
4. **Send Auto-Response**: Trigger when applicants contact paused provider

### Recommended API Endpoints
```javascript
// Save vacation settings
POST /api/provider/vacation-settings
Body: { isPaused, vacationStart, vacationEnd, autoResponseMessage }

// Get bookings in date range
GET /api/provider/bookings?start=YYYY-MM-DD&end=YYYY-MM-DD

// Update provider visibility
PATCH /api/provider/profile
Body: { isAcceptingBookings: !isPaused }
```

## Testing Considerations

### Unit Tests
- Toggle pause on/off
- Date validation (end after start)
- Auto-response character limit
- Booking list rendering
- Empty states

### E2E Tests
- Complete vacation mode flow
- Verify profile hidden when paused
- Test auto-response delivery
- Verify existing bookings remain active

## Accessibility

- All form inputs have associated labels
- Switch has proper aria-label
- Color is not the only indicator of state
- Keyboard navigable
- Screen reader friendly

## Future Enhancements

1. **Automatic Unpause**: Option to automatically unpause on end date
2. **Calendar Integration**: Visual calendar view of bookings during pause
3. **Notification Settings**: Alert when nearing end of vacation
4. **Quick Templates**: Pre-written auto-response templates
5. **Vacation History**: Log of past vacation periods
6. **Booking Conflicts**: Warn if pausing with upcoming confirmed bookings

## Related Components
- `ProviderBookingCard` - Used to display individual bookings
- `BookingsCalendarView` - Alternative view for all bookings
- Provider settings pages

## Notes
- Pausing is immediate - no delay or pending state
- Existing confirmed bookings are NOT cancelled when pausing
- Provider can still access and manage existing bookings while paused
- Auto-response is only for new inquiries, not existing conversations
