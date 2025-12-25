# ProviderBookingsPage

Provider view for managing all bookings (upcoming and past sessions).

## Route
`/marketplace/provider/bookings`

## Components Created

### 1. ProviderBookingsPage.jsx
Main page component with:
- **View Modes**: Calendar | List (toggle buttons)
- **Tabs**: Upcoming | Past
- **Filters**:
  - Search by name or service
  - Filter by service type
  - Sort by date
- **Empty States**:
  - Upcoming: "No upcoming sessions" with CTA to view requests
  - Past: "No past sessions yet"

### 2. ProviderBookingCard.jsx
Individual booking card component displaying:
- **Applicant Info**: Avatar, name, current stage
- **Status Badge**: Visual indicator (confirmed, completed, cancelled)
- **Service Details**: Title, duration, live/async indicator
- **Date/Time**: Formatted scheduling info
- **Pricing**: Amount paid and provider payout
- **Target Programs**: Applicant's target schools
- **Notes**: Applicant's booking notes
- **Materials**: Collapsible section for uploaded files
- **Actions**: Context-aware based on status
  - Pending: Accept/Decline
  - Confirmed: Join Video (when within 5 min), Reschedule, Cancel, Message
  - Completed: Leave Review, Message
  - Always: View Details

### 3. BookingsCalendarView.jsx
Calendar visualization component with:
- **View Modes**: Month | Week (toggle)
- **Navigation**: Previous, Today, Next
- **Booking Blocks**: Color-coded by status
  - Green: Confirmed
  - Gray: Completed
  - Red: Cancelled
- **Click Handlers**: Open booking details
- **Legend**: Status color reference

## Mock Data Structure

```javascript
{
  id: 'booking-1',
  applicantName: 'Sarah M.',
  service: 'Mock Interview',
  scheduledAt: new Date(),
  duration: 60,
  price: 125,
  status: 'confirmed', // or 'completed', 'cancelled'
  videoLink: 'https://zoom.us/...'
}
```

## Features

### List View
- Grid layout (2 columns on desktop)
- Search and filter controls
- Sorted by date ascending
- ProviderBookingCard for each booking

### Calendar View
- Month view: 7x6 grid with all days
- Week view: 7 day horizontal layout
- Today highlighting (blue border)
- Bookings shown as colored blocks with time
- Max 3 bookings per day cell ("+N more" for overflow)
- Click day to see all bookings (placeholder)
- Click booking to view details

### Filtering
- **Service Type**: All Services, Mock Interview, Essay Review, etc.
- **Search**: By applicant name or service name
- Filters apply to both tabs (Upcoming/Past)
- Results sorted by date

### Empty States
- Upcoming: Encourages checking incoming requests
- Past: Simple message that history will appear here
- Shows when no bookings match filters

## Integration Points

### Router
Route added to `/src/router.jsx`:
```javascript
{ path: 'marketplace/provider/bookings', element: lazyLoad(ProviderBookingsPage) }
```

### Component Index
Exports added to `/src/components/features/provider/index.js`:
- `BookingsCalendarView`
- `ProviderBookingCard`

### Dependencies
- `date-fns`: Date formatting and calendar calculations
- `lucide-react`: Icons
- shadcn/ui components: Card, Button, Tabs, Select, Input, Badge, Avatar

## Next Steps (API Integration)

1. **Fetch Bookings**:
   ```javascript
   // GET /api/provider/bookings?status=upcoming
   // GET /api/provider/bookings?status=past
   ```

2. **Action Handlers**:
   - `onJoinCall`: Open video link
   - `onViewDetails`: Navigate to booking detail page
   - `onAccept`: Accept pending request
   - `onDecline`: Decline pending request
   - `onReschedule`: Open reschedule modal
   - `onCancel`: Cancel confirmed booking
   - `onLeaveReview`: Navigate to review form
   - `onMessageApplicant`: Open messaging

3. **Real-time Updates**:
   - Websocket or polling for new bookings
   - Status changes (confirmed, cancelled)
   - Booking requests expiring

## Visual Design

- Gradient background: `from-pink-50 via-purple-50 to-pink-50`
- Card hover effect: Shadow transition
- Status badges: Color-coded with icons
- Calendar: Clean grid with subtle borders
- Join Video button: Green with pulse animation when session is starting soon
- Mobile responsive: Single column on small screens

## Files Created

1. `/src/pages/srna/ProviderBookingsPage.jsx` - Main page
2. `/src/components/features/provider/ProviderBookingCard.jsx` - Card component
3. `/src/components/features/provider/BookingsCalendarView.jsx` - Calendar component
4. `/src/router.jsx` - Updated with route
5. `/src/components/features/provider/index.js` - Updated exports
