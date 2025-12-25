# RequestCard Component

Comprehensive card component for displaying booking requests with all details needed for providers to make informed decisions.

## Features

### Header Section
- **Applicant Avatar & Name** - Shows profile picture or initials fallback
- **Request Date** - Formatted timestamp
- **Countdown Badge** - Color-coded urgency indicator:
  - **Green** (48h+ left) - Plenty of time
  - **Yellow** (6-24h left) - Warning
  - **Red** (<6h left) - Critical

### Collapsible Applicant Summary
Expandable section showing:
- **Target Programs** - Up to 3 programs with overflow indicator
- **ICU Experience** - Type and years
- **GPA** - If shared by applicant
- **Application Stage** - Current phase (Researching, Plan & Apply, etc.)
- **Previous Sessions** - History with this provider
- **View Full Profile** - Link to detailed applicant profile

### Service Details
- Service name with type icon
- Duration
- **Price Breakdown**:
  - Service price
  - Platform fee (20%)
  - Mentor earnings (highlighted in green)
- **Preferred Times** - Up to 3 time slots with overflow

### Applicant's Message
- Custom message/notes from applicant
- Displayed in blue highlight box for emphasis

### Service-Specific Intake Info
Additional context based on service type:
- **Mock Interview**: Interview type, target school, date, concerns
- **Essay Review**: Essay type, word count, specific feedback areas
- **Coaching**: Goals, timeline, focus areas

### Uploaded Materials
- List of files with icons based on type
- File size display
- Download buttons for each file

### Action Buttons
- **Accept** - Primary green button
- **Decline** - Outline button
- **Propose Alternative** - Ghost/text button

### Urgency Warning
Red alert box shown when <6 hours remaining to maintain response rate.

## Props

```typescript
interface RequestCardProps {
  request: {
    id: string;
    requestDate: string; // ISO date string
    applicant: {
      name: string;
      avatar?: string;
      targetPrograms?: string[];
      icuExperience?: {
        type: string;
        years: number;
      };
      gpa?: string;
      stage?: string;
      previousSessionsCount?: number;
    };
    service: {
      name: string;
      type: string; // 'mock-interview' | 'essay-review' | 'general-coaching' | 'group-session'
      duration: number; // minutes
      price: number;
      platformFee?: number; // default 0.2 (20%)
    };
    preferredTimes?: string[];
    message?: string;
    materials?: Array<{
      name: string;
      size?: number; // bytes
      url: string;
    }>;
    intakeInfo?: Record<string, any>;
  };
  onAccept?: (request) => void;
  onDecline?: (request) => void;
  onProposeAlternative?: (request) => void;
  className?: string;
}
```

## Usage

```jsx
import { RequestCard } from '@/components/features/provider';

function RequestsPage() {
  const handleAccept = (request) => {
    // Navigate to scheduling flow or auto-accept
    console.log('Accepting:', request.id);
  };

  const handleDecline = (request) => {
    // Show decline reason modal
    console.log('Declining:', request.id);
  };

  const handleProposeAlternative = (request) => {
    // Show alternative times/services modal
    console.log('Proposing alternative:', request.id);
  };

  return (
    <div className="space-y-6">
      {requests.map((request) => (
        <RequestCard
          key={request.id}
          request={request}
          onAccept={handleAccept}
          onDecline={handleDecline}
          onProposeAlternative={handleProposeAlternative}
        />
      ))}
    </div>
  );
}
```

## Countdown Logic

The countdown badge calculates time remaining based on:
- Request date + 48 hours = response deadline
- Color coding:
  - **Green**: >24 hours remaining
  - **Yellow**: 6-24 hours remaining
  - **Red**: <6 hours remaining

When <6 hours remain, an urgency warning appears at the bottom of the card.

## Service Icons

Icons automatically map to service types:
- `mock-interview` → Video camera
- `essay-review` → File edit
- `general-coaching` → Message square
- `group-session` → Users

## File Icons

File icons based on extension:
- `.pdf` → Red PDF icon
- `.doc`, `.docx` → Blue document icon
- `.txt` → Gray text icon
- Others → Gray generic file icon

## Mobile Responsive

- **Desktop**: Two-column action buttons
- **Mobile**: Stacked full-width buttons
- All sections collapse appropriately
- Touch-friendly 44px+ targets

## Accessibility

- Proper heading hierarchy
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus states on all interactive elements
- Screen reader friendly countdown information

## Design Notes

- Uses consistent design system colors
- Green emphasis on earnings (positive reinforcement)
- Blue highlight for applicant message (stands out)
- Red urgency warnings (clear calls to action)
- Collapsible sections keep card scannable while providing depth

## States to Handle

1. **Standard** - Plenty of time to respond
2. **Warning** - <24 hours to respond
3. **Critical** - <6 hours to respond (shows urgency alert)
4. **New applicant** - No previous sessions
5. **Returning client** - Has session history
6. **Minimal materials** - No files uploaded
7. **Multiple materials** - Several files to review

## Integration Points

### Backend API
```typescript
GET /api/provider/requests
POST /api/provider/requests/:id/accept
POST /api/provider/requests/:id/decline
POST /api/provider/requests/:id/propose-alternative
```

### Real-time Updates
- WebSocket or polling to update countdown timer
- Notification when new request arrives
- Auto-refresh when request expires

### Analytics
Track:
- Response time distribution
- Accept/decline rates
- Propose alternative usage
- Most common decline reasons
