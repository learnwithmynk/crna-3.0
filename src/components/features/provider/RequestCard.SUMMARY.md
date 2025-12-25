# RequestCard Component - Summary

## Overview
The `RequestCard` component is a comprehensive, scannable card that displays all details needed for a provider to evaluate and respond to a booking request from an applicant.

## Key Features

### 1. Smart Countdown Timer
- Calculates time remaining from request date + 48 hours
- **Color-coded urgency**:
  - Green: >24h remaining
  - Yellow: 6-24h remaining
  - Red: <6h remaining (shows additional urgency alert)
- Real-time countdown display

### 2. Collapsible Applicant Summary
Expandable section showing:
- Target programs (up to 3, with overflow count)
- ICU experience type and years
- GPA (if shared)
- Application stage
- Previous session history with this provider
- Link to full profile

**Why collapsible?** Keeps card scannable while providing depth when needed.

### 3. Detailed Service Information
- Service name with type-specific icon
- Duration in minutes
- **Transparent price breakdown**:
  - Original price
  - Platform fee (20%)
  - Mentor earnings (highlighted in green)
- Preferred time slots (up to 3, with overflow)

### 4. Rich Context
- **Applicant's message** - Custom notes/request details
- **Service-specific intake** - Additional fields based on service type:
  - Mock Interview: type, target school, date, concerns
  - Essay Review: essay type, word count, feedback areas
  - Coaching: goals, timeline, focus areas

### 5. Material Handling
- List of uploaded files
- File type icons (PDF, DOC, TXT)
- File sizes
- Download buttons for each file
- Hover states for better UX

### 6. Clear Actions
Three primary actions:
1. **Accept** (green, primary) - Accept the booking
2. **Decline** (outline) - Decline with optional reason
3. **Propose Alternative** (ghost) - Suggest different time/service

Buttons are responsive:
- Desktop: Row layout
- Mobile: Stacked full-width

### 7. Urgency Warnings
When <6 hours remaining:
- Red alert box appears
- Explains impact on response rate
- Encourages quick action

## Component Architecture

```
RequestCard
├── Header
│   ├── Avatar + Name
│   ├── Request Date
│   └── Countdown Badge (color-coded)
├── Collapsible Applicant Summary
│   ├── Target Programs
│   ├── ICU Experience
│   ├── GPA
│   ├── Stage
│   ├── Previous Sessions
│   └── View Profile Link
├── Service Details Card
│   ├── Service Icon + Name
│   ├── Duration
│   ├── Price Breakdown
│   └── Preferred Times
├── Applicant Message (if provided)
├── Intake Information (if provided)
├── Materials List (if uploaded)
│   └── File items with download
├── Action Buttons
│   ├── Accept
│   ├── Decline
│   └── Propose Alternative
└── Urgency Alert (if <6h)
```

## Design Decisions

### Visual Hierarchy
1. **Most important**: Countdown badge (color-coded urgency)
2. **Secondary**: Applicant name, service name, earnings
3. **Tertiary**: Additional details in collapsible sections

### Color System
- **Green**: Earnings, positive actions, good status
- **Blue**: Applicant message (stands out)
- **Yellow**: Warning state countdown
- **Red**: Critical urgency
- **Gray**: Supporting information

### Scannability
- Can understand key details in 5 seconds:
  - Who is requesting?
  - What service?
  - How much time left?
  - How much will I earn?
- Deep dive available via collapsible sections

### Mobile-First
- Touch targets 44px minimum
- Stacked layout on mobile
- Collapsible sections save space
- Readable text sizes

## Use Cases

### Primary Flow
1. Provider sees new request notification
2. Opens Requests page
3. Scans countdown badge for urgency
4. Reads service details and earnings
5. Reviews applicant message
6. Expands applicant summary if needed
7. Downloads materials if relevant
8. Makes decision: Accept, Decline, or Propose Alternative

### Edge Cases Handled
- **New applicant**: Shows "0 previous sessions"
- **Returning client**: Highlights session history
- **No materials**: Section doesn't show
- **Urgent**: Red alert with <6h warning
- **No avatar**: Shows initials fallback
- **Long program lists**: Shows first 3 + overflow count
- **Long messages**: Wraps properly
- **Multiple preferred times**: Shows first 3 + count

## Files Created

1. **RequestCard.jsx** - Main component (395 lines)
2. **RequestCard.example.jsx** - Usage examples with mock data
3. **RequestCard.md** - Full documentation with props, usage, integration
4. **RequestCard.SUMMARY.md** - This file

## Integration Points

### Required
- `onAccept(request)` - Handle acceptance flow
- `onDecline(request)` - Handle decline flow
- `onProposeAlternative(request)` - Handle alternative proposal

### Optional Enhancements
- Real-time countdown updates (WebSocket/polling)
- File preview modal
- Applicant profile modal/drawer
- Response templates
- Decline reason selection
- Alternative time picker

## Next Steps

1. **Create decline modal** - Reason selection + message
2. **Create propose alternative modal** - Time picker + message
3. **Create accept confirmation** - Confirm time, add to calendar
4. **Add analytics** - Track response times, accept rates
5. **Add notifications** - Alert when urgent (<6h)
6. **Add filters** - Sort by urgency, service type, earnings

## Performance Notes

- Countdown calculation is fast (no performance impact)
- Collapsible sections prevent DOM bloat
- File downloads open in new tab (no blocking)
- All images lazy load via Avatar component
- Minimal re-renders (controlled state)

## Accessibility

- Semantic HTML throughout
- Proper heading hierarchy
- ARIA labels on interactive elements
- Keyboard navigation
- Focus indicators
- Screen reader friendly
- Color + text for status (not color alone)

## Responsive Breakpoints

- **Mobile** (<640px): Stacked layout, full-width buttons
- **Tablet** (640-1024px): Two-column where appropriate
- **Desktop** (>1024px): Full multi-column layout

## Testing Checklist

- [ ] Countdown calculates correctly
- [ ] Color coding matches urgency
- [ ] Collapsible expands/collapses
- [ ] File downloads work
- [ ] Buttons trigger callbacks
- [ ] Mobile layout looks good
- [ ] Urgency alert shows at <6h
- [ ] Avatar fallback shows initials
- [ ] Long content wraps properly
- [ ] Overflow indicators work
