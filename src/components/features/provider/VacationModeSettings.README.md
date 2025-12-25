# VacationModeSettings Component - Quick Reference

## What It Does
Allows SRNA providers to pause their marketplace availability during vacations or busy periods, with automatic profile hiding and inquiry auto-responses.

## Files Created
- `VacationModeSettings.jsx` - Main component (12KB)
- `VacationModeSettings.example.jsx` - Usage example with state management
- `VacationModeSettings.md` - Comprehensive documentation
- `VacationModeSettings.visual.md` - Visual design specifications

## Quick Start

```jsx
import { VacationModeSettings } from '@/components/features/provider';

function MySettingsPage() {
  const [isPaused, setIsPaused] = useState(false);
  const [vacationStart, setVacationStart] = useState(null);
  const [vacationEnd, setVacationEnd] = useState(null);
  const [autoResponse, setAutoResponse] = useState('');

  return (
    <VacationModeSettings
      isPaused={isPaused}
      onPausedChange={setIsPaused}
      vacationStart={vacationStart}
      vacationEnd={vacationEnd}
      onVacationDatesChange={(start, end) => {
        setVacationStart(start);
        setVacationEnd(end);
      }}
      autoResponseMessage={autoResponse}
      onAutoResponseChange={setAutoResponse}
      bookingsDuringPause={[]} // Fetch based on date range
    />
  );
}
```

## Key Features

### 1. Visual State Indicators
- **Not Paused**: Blue info banner explaining vacation mode
- **Paused**: Orange warning banner showing profile is hidden
- Clear toggle with descriptive text

### 2. Optional Vacation Dates
- Start and end date pickers (HTML5 date inputs)
- End date automatically constrained after start date
- Helps with planning but not required (can pause indefinitely)

### 3. Auto-Response System
- Custom message sent to inquiries (500 char limit)
- Character counter with real-time updates
- Helpful placeholder text
- Only shown when paused

### 4. Booking Management
- Shows existing confirmed bookings during vacation
- Each card displays: applicant, service, date/time, status
- Scrollable list if many bookings
- Empty state encouragement if none

### 5. Responsive Design
- Mobile-first approach
- Date inputs stack on mobile, side-by-side on tablet+
- Touch-friendly controls (44px minimum)
- Scrollable booking list on small screens

## Props Reference

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `isPaused` | boolean | ✅ | Current pause state |
| `onPausedChange` | function | ✅ | Toggle handler `(checked) => void` |
| `vacationStart` | Date\|null | ✅ | Start date |
| `vacationEnd` | Date\|null | ✅ | End date |
| `onVacationDatesChange` | function | ✅ | Date handler `(start, end) => void` |
| `autoResponseMessage` | string | ✅ | Custom message |
| `onAutoResponseChange` | function | ✅ | Message handler `(text) => void` |
| `bookingsDuringPause` | array | ✅ | Booking objects |
| `className` | string | ❌ | Additional CSS classes |

## Booking Object Structure

```typescript
{
  id: string;
  applicantName: string;
  applicantAvatar?: string | null;
  service: string;
  date: Date;
  time?: string;
  status?: string; // 'confirmed', 'pending', etc.
}
```

## Integration Checklist

### Backend Requirements
- [ ] API endpoint to save vacation settings
- [ ] API endpoint to fetch bookings in date range
- [ ] Update provider profile visibility in marketplace
- [ ] Auto-response delivery system for inquiries
- [ ] Webhook/event when provider pauses/unpauses

### Frontend Requirements
- [x] Component created and exported
- [ ] State management (local or global)
- [ ] API integration
- [ ] Error handling
- [ ] Loading states
- [ ] Success/error notifications
- [ ] E2E tests

### Suggested API Endpoints

```javascript
// Save vacation mode settings
POST /api/provider/vacation-mode
{
  isPaused: boolean,
  vacationStart: string | null, // ISO 8601
  vacationEnd: string | null,
  autoResponseMessage: string
}

// Get bookings in date range
GET /api/provider/bookings?start=2024-12-18&end=2025-01-05
Response: Booking[]

// Update profile visibility
PATCH /api/provider/profile
{ isAcceptingBookings: boolean }
```

## User Experience Flow

1. Provider opens settings page
2. Sees info banner about vacation mode
3. Toggles "I'm unavailable" switch
4. Warning banner appears, form expands
5. (Optional) Sets vacation start/end dates
6. (Optional) Customizes auto-response message
7. Reviews existing bookings during period
8. Clicks "Save Changes"
9. Profile hidden from marketplace
10. Auto-response sent to new inquiries

## Common Customizations

### Different Character Limit
```jsx
// In component, change:
const MAX_CHARS = 1000; // instead of 500

<p className="text-xs text-gray-500 mt-1">
  {autoResponseMessage.length} / {MAX_CHARS} characters
</p>
```

### Auto-Unpause on End Date
```javascript
// Add useEffect to check end date
useEffect(() => {
  if (!isPaused || !vacationEnd) return;

  const checkEndDate = () => {
    if (new Date() >= vacationEnd) {
      onPausedChange(false);
      // Show notification
    }
  };

  const interval = setInterval(checkEndDate, 60000); // Check hourly
  return () => clearInterval(interval);
}, [isPaused, vacationEnd]);
```

### Load Bookings on Date Change
```javascript
const handleVacationDatesChange = async (start, end) => {
  setVacationStart(start);
  setVacationEnd(end);

  if (start && end) {
    const bookings = await fetchBookingsInRange(start, end);
    setBookingsDuringPause(bookings);
  }
};
```

## Testing

### Unit Tests
```javascript
describe('VacationModeSettings', () => {
  it('shows info banner when not paused', () => {});
  it('shows warning banner when paused', () => {});
  it('toggles pause state', () => {});
  it('validates end date after start', () => {});
  it('displays bookings during vacation', () => {});
  it('counts characters in auto-response', () => {});
});
```

### E2E Tests
```javascript
test('provider can enable vacation mode', async ({ page }) => {
  // Navigate to settings
  // Toggle vacation mode
  // Set dates
  // Enter message
  // Save
  // Verify profile hidden
  // Verify auto-response sent
});
```

## Accessibility

- ✅ Keyboard navigable
- ✅ Screen reader friendly
- ✅ Color + text indicators (not color alone)
- ✅ Touch-friendly (44px targets)
- ✅ Semantic HTML
- ✅ Proper label associations
- ✅ Focus management

## Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile Safari (iOS 14+)
- ✅ Chrome Mobile (latest)

**Note**: Uses HTML5 date inputs (native picker on mobile, calendar on desktop)

## Performance

- Component size: ~12KB unminified
- Dependencies: shadcn/ui components, lucide-react icons
- Re-renders optimized with proper prop passing
- No heavy computations
- Efficient booking list rendering

## Support

For questions or issues:
1. Check `VacationModeSettings.md` for full documentation
2. Review `VacationModeSettings.example.jsx` for usage patterns
3. See `VacationModeSettings.visual.md` for design specs
4. Contact dev team for API integration help

## Version History

- **v1.0** (2024-12-13): Initial creation
  - Toggle pause functionality
  - Optional vacation dates
  - Auto-response message
  - Booking display during vacation
  - Responsive design
  - Full documentation
