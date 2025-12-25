# Booking Request Modals

Three modal components for handling provider booking requests in the marketplace.

## Components

### 1. AcceptRequestModal

**File:** `/src/components/features/provider/AcceptRequestModal.jsx`

**Purpose:** Allows providers to accept a booking request by selecting one of the applicant's preferred times.

**Features:**
- Displays all applicant's preferred times as selectable options
- Provider selects exactly one time slot
- Optional message textarea for communication
- Shows payment notice: "Payment will be charged when you accept"
- Displays service details and pricing breakdown
- Loading state during submission

**Props:**
```jsx
{
  open: boolean,              // Controls modal visibility
  onOpenChange: function,     // Callback when modal open state changes
  request: object,            // Booking request object
  onConfirm: function         // Callback(selectedTime, message) when confirmed
}
```

**Request Object Structure:**
```js
{
  id: 'uuid',
  status: 'pending',
  applicantSnapshot: {
    name: string,
    email: string
  },
  serviceSnapshot: {
    title: string,
    duration: number,        // minutes
    price_cents: number
  },
  amount_cents: number,      // Total charge to applicant
  platform_fee_cents: number, // 20% platform fee
  provider_payout_cents: number, // 80% to provider
  requested_times: [         // Array of ISO datetime strings
    '2024-12-20T14:00:00Z',
    '2024-12-21T10:00:00Z'
  ]
}
```

**Usage Example:**
```jsx
import { AcceptRequestModal } from '@/components/features/provider/AcceptRequestModal';

function BookingRequestCard({ request }) {
  const [acceptModalOpen, setAcceptModalOpen] = useState(false);

  const handleAccept = async (selectedTime, message) => {
    const response = await api.bookings.accept({
      requestId: request.id,
      scheduledAt: selectedTime,
      message
    });
    // Handle success
  };

  return (
    <>
      <Button onClick={() => setAcceptModalOpen(true)}>Accept</Button>
      <AcceptRequestModal
        open={acceptModalOpen}
        onOpenChange={setAcceptModalOpen}
        request={request}
        onConfirm={handleAccept}
      />
    </>
  );
}
```

---

### 2. DeclineRequestModal

**File:** `/src/components/features/provider/DeclineRequestModal.jsx`

**Purpose:** Allows providers to decline a booking request with an optional reason and message.

**Features:**
- Optional reason dropdown (schedule conflict, not taking clients, outside expertise, other)
- Optional message textarea
- Notice that applicant will be notified and can book with another mentor
- No charges are made when declining
- Loading state during submission

**Props:**
```jsx
{
  open: boolean,              // Controls modal visibility
  onOpenChange: function,     // Callback when modal open state changes
  request: object,            // Booking request object (same structure as AcceptRequestModal)
  onConfirm: function         // Callback(reason, message) when confirmed
}
```

**Decline Reasons:**
- `schedule_conflict` - Schedule conflict
- `not_taking_clients` - Not taking new clients
- `outside_expertise` - Outside my expertise
- `other` - Other

**Usage Example:**
```jsx
import { DeclineRequestModal } from '@/components/features/provider/DeclineRequestModal';

function BookingRequestCard({ request }) {
  const [declineModalOpen, setDeclineModalOpen] = useState(false);

  const handleDecline = async (reason, message) => {
    const response = await api.bookings.decline({
      requestId: request.id,
      reason,
      message
    });
    // Handle success
  };

  return (
    <>
      <Button variant="outline" onClick={() => setDeclineModalOpen(true)}>
        Decline
      </Button>
      <DeclineRequestModal
        open={declineModalOpen}
        onOpenChange={setDeclineModalOpen}
        request={request}
        onConfirm={handleDecline}
      />
    </>
  );
}
```

---

### 3. ProposeAlternativeModal

**File:** `/src/components/features/provider/ProposeAlternativeModal.jsx`

**Purpose:** Allows providers to propose up to 3 alternative times when applicant's preferred times don't work.

**Features:**
- Date/time picker for selecting alternative times
- Can propose up to 3 times
- Add/remove times before submitting
- Required message textarea to explain why alternatives are better
- Validates times are at least 1 hour in the future
- Prevents duplicate times
- Notice that applicant will be notified and can accept/decline

**Props:**
```jsx
{
  open: boolean,              // Controls modal visibility
  onOpenChange: function,     // Callback when modal open state changes
  request: object,            // Booking request object (same structure as AcceptRequestModal)
  onConfirm: function         // Callback(proposedTimes, message) when confirmed
}
```

**Validation Rules:**
- Minimum 1 time, maximum 3 times
- All times must be at least 1 hour in the future
- No duplicate times allowed
- Times are converted to ISO strings for API

**Usage Example:**
```jsx
import { ProposeAlternativeModal } from '@/components/features/provider/ProposeAlternativeModal';

function BookingRequestCard({ request }) {
  const [proposeModalOpen, setProposeModalOpen] = useState(false);

  const handleProposeAlternatives = async (proposedTimes, message) => {
    // proposedTimes is an array of ISO datetime strings
    const response = await api.bookings.proposeAlternatives({
      requestId: request.id,
      proposedTimes, // ['2024-12-20T14:00:00Z', '2024-12-21T10:00:00Z']
      message
    });
    // Handle success
  };

  return (
    <>
      <Button variant="outline" onClick={() => setProposeModalOpen(true)}>
        Propose Times
      </Button>
      <ProposeAlternativeModal
        open={proposeModalOpen}
        onOpenChange={setProposeModalOpen}
        request={request}
        onConfirm={handleProposeAlternatives}
      />
    </>
  );
}
```

---

## Complete Integration Example

```jsx
import { useState } from 'react';
import { AcceptRequestModal } from '@/components/features/provider/AcceptRequestModal';
import { DeclineRequestModal } from '@/components/features/provider/DeclineRequestModal';
import { ProposeAlternativeModal } from '@/components/features/provider/ProposeAlternativeModal';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

function BookingRequestCard({ request, onUpdate }) {
  const [acceptModalOpen, setAcceptModalOpen] = useState(false);
  const [declineModalOpen, setDeclineModalOpen] = useState(false);
  const [proposeModalOpen, setProposeModalOpen] = useState(false);

  const handleAccept = async (selectedTime, message) => {
    try {
      await api.bookings.accept({
        requestId: request.id,
        scheduledAt: selectedTime,
        message
      });
      onUpdate();
    } catch (error) {
      console.error('Failed to accept:', error);
    }
  };

  const handleDecline = async (reason, message) => {
    try {
      await api.bookings.decline({
        requestId: request.id,
        reason,
        message
      });
      onUpdate();
    } catch (error) {
      console.error('Failed to decline:', error);
    }
  };

  const handleProposeAlternatives = async (proposedTimes, message) => {
    try {
      await api.bookings.proposeAlternatives({
        requestId: request.id,
        proposedTimes,
        message
      });
      onUpdate();
    } catch (error) {
      console.error('Failed to propose alternatives:', error);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <h3>{request.serviceSnapshot.title}</h3>
          <p>From: {request.applicantSnapshot.name}</p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button onClick={() => setAcceptModalOpen(true)}>
              Accept
            </Button>
            <Button variant="outline" onClick={() => setProposeModalOpen(true)}>
              Propose Times
            </Button>
            <Button variant="outline" onClick={() => setDeclineModalOpen(true)}>
              Decline
            </Button>
          </div>
        </CardContent>
      </Card>

      <AcceptRequestModal
        open={acceptModalOpen}
        onOpenChange={setAcceptModalOpen}
        request={request}
        onConfirm={handleAccept}
      />

      <DeclineRequestModal
        open={declineModalOpen}
        onOpenChange={setDeclineModalOpen}
        request={request}
        onConfirm={handleDecline}
      />

      <ProposeAlternativeModal
        open={proposeModalOpen}
        onOpenChange={setProposeModalOpen}
        request={request}
        onConfirm={handleProposeAlternatives}
      />
    </>
  );
}
```

---

## Design Patterns

### State Management
- All modals use local state for form fields
- State is reset when modal closes
- Loading states prevent multiple submissions
- Error handling through try/catch in parent components

### User Experience
- Clear visual feedback for selected options
- Prominent payment notices
- Helpful placeholder text
- Validation with clear error messages
- Disabled states during submission

### Accessibility
- Proper ARIA labels through shadcn/ui Dialog
- Keyboard navigation supported
- Focus management automatic
- Screen reader friendly

### Mobile Responsive
- All modals are mobile-friendly through shadcn/ui
- Touch targets meet 44px minimum
- Scrollable content areas
- Responsive layout adjustments

---

## Testing

Example test files are provided:
- `AcceptRequestModal.example.jsx`
- `DeclineRequestModal.example.jsx`
- `ProposeAlternativeModal.example.jsx`

These can be used for visual testing and development.

---

## API Integration Notes

When integrating with backend:

1. **AcceptRequestModal** should trigger:
   - Update booking status to 'accepted'
   - Set `scheduled_at` field to selected time
   - Charge applicant via Stripe
   - Send notification to applicant
   - Create Cal.com booking

2. **DeclineRequestModal** should trigger:
   - Update booking status to 'declined'
   - Store decline reason
   - Send notification to applicant
   - No payment processing

3. **ProposeAlternativeModal** should trigger:
   - Update booking status to 'alternatives_proposed'
   - Store proposed times in `requested_times` (or separate field)
   - Send notification to applicant with new times
   - Await applicant response
