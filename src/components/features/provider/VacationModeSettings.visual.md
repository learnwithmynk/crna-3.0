# VacationModeSettings - Visual Design Summary

## Component Purpose
Allows SRNA providers to pause marketplace availability during vacations with auto-responses and booking management.

---

## Visual States

### State 1: Not Paused (Default)
```
┌─────────────────────────────────────────────────────────┐
│ Vacation Mode                                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ ℹ️  How Vacation Mode Works                        │ │
│ │ • Your profile will be hidden from marketplace      │ │
│ │ • Applicants cannot request new bookings            │ │
│ │ • Existing confirmed bookings remain active         │ │
│ │ • Auto-response sent to any inquiries               │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ I'm unavailable for new bookings          [Toggle]  │ │
│ │ Pause your availability and hide your profile       │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ [Save Changes]  [Cancel]                                │
└─────────────────────────────────────────────────────────┘
```

### State 2: Paused (Active Vacation Mode)
```
┌─────────────────────────────────────────────────────────┐
│ Vacation Mode                                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ ⚠️  You are paused - New bookings disabled          │ │
│ │ Your profile is hidden from search results and      │ │
│ │ applicants cannot book new sessions with you.       │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ I'm unavailable for new bookings          [Toggle✓] │ │
│ │ Pause your availability and hide your profile       │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ 📅 Vacation Dates (Optional)                            │
│ Setting dates helps you plan ahead.                     │
│                                                         │
│ ┌──────────────────────────┐ ┌──────────────────────┐  │
│ │ Start Date               │ │ End Date             │  │
│ │ [12/18/2024            ] │ │ [01/05/2025        ] │  │
│ └──────────────────────────┘ └──────────────────────┘  │
│                                                         │
│ Auto-Response Message                                   │
│ This message will be sent to applicants who try to     │
│ contact you                                             │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Hi! Thanks for reaching out. I'm currently on      │ │
│ │ vacation until January 5th and unavailable for     │ │
│ │ new bookings. I'll be back then and would love     │ │
│ │ to work with you!                                  │ │
│ └─────────────────────────────────────────────────────┘ │
│ 145 / 500 characters                                    │
│                                                         │
│ Existing Bookings During Vacation            [3]       │
│ These confirmed bookings will remain active.            │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [SJ] Sarah Johnson                    [Confirmed]   │ │
│ │      Mock Interview Session                         │ │
│ │      📅 Dec 20, 2024  🕐 2:00 PM EST              │ │
│ └─────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [EC] Emily Chen                       [Confirmed]   │ │
│ │      Essay Review                                   │ │
│ │      📅 Dec 22, 2024  🕐 10:00 AM EST             │ │
│ └─────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [RM] Rachel Martinez                  [Confirmed]   │ │
│ │      1:1 Coaching Call                              │ │
│ │      📅 Dec 28, 2024  🕐 3:30 PM EST              │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ [Save Changes]  [Cancel]                                │
└─────────────────────────────────────────────────────────┘
```

---

## Color Scheme

### Warning Banner (Paused State)
- Background: `orange-50` (#FFF7ED)
- Border: `orange-200` (#FED7AA)
- Icon: `orange-600` (#EA580C)
- Text: `orange-900` (#7C2D12) / `orange-700` (#C2410C)

### Info Banner (Not Paused State)
- Background: `blue-50` (#EFF6FF)
- Border: `blue-200` (#BFDBFE)
- Icon: `blue-600` (#2563EB)
- Text: `blue-900` (#1E3A8A) / `blue-700` (#1D4ED8)

### Toggle Section
- Background: `gray-50` (#F9FAFB)
- Border: `gray-200` (#E5E7EB)
- Text: `gray-900` (#111827) / `gray-600` (#4B5563)

### Booking Cards
- Background: `white` (#FFFFFF)
- Border: `gray-200` (#E5E7EB)
- Hover Border: `gray-300` (#D1D5DB)
- Avatar Background: `purple-100` (#F3E8FF)
- Avatar Text: `purple-700` (#7C3AED)

### Status Badges
- Confirmed: Green (`green-100`, `green-800`)
- Pending: Yellow/Orange
- Default: Gray

---

## Typography

### Headers
- Card Title: `text-lg font-semibold` (18px, ~600 weight)
- Section Headers: `font-semibold text-gray-900`
- Subsection Headers: `text-sm font-medium text-gray-700`

### Body Text
- Primary: `text-sm text-gray-600` (14px)
- Secondary: `text-xs text-gray-500` (12px)
- Labels: `text-sm font-medium text-gray-700`

### Booking Card Text
- Name: `font-medium text-gray-900`
- Service: `text-sm text-gray-600`
- Date/Time: `text-sm text-gray-500`

---

## Spacing & Layout

### Card Structure
- Card padding: `p-6` (24px)
- Section spacing: `space-y-6` (24px vertical gap)
- Sub-section spacing: `space-y-4` (16px vertical gap)

### Form Elements
- Input height: `h-11` (44px - touch target)
- Label margin: `mb-2` (8px)
- Field spacing: `space-y-2` (8px)

### Grid Layout
- Date inputs: `grid-cols-1 sm:grid-cols-2 gap-4`
  - Mobile: Stack vertically
  - Tablet+: Side by side

### Booking Cards
- Gap between cards: `space-y-3` (12px)
- Card padding: `p-4` (16px)
- Internal spacing: `gap-3` (12px)
- Max height: `max-h-[400px]` with scroll

---

## Interactive Elements

### Toggle Switch
- Size: `h-5 w-9`
- States:
  - OFF: Gray background
  - ON: Primary yellow background
  - Focus: Ring with offset

### Date Inputs
- Type: `date` (native picker)
- Border: Gray with rounded corners
- Focus: Primary ring
- Min height: 44px (touch target)

### Textarea
- Min height: `120px`
- Resizable: Vertical only
- Character counter below
- Placeholder text provided

### Buttons
- Save Changes: Primary yellow button
- Cancel: Outline button
- Full width on save, auto-width on cancel
- Flex layout: `gap-3`

---

## Responsive Behavior

### Mobile (< 640px)
- Single column layout
- Date inputs stack vertically
- Full-width buttons
- Compact spacing on booking cards
- Scrollable booking list

### Tablet (640px - 1024px)
- Date inputs side-by-side (2 columns)
- Wider card layout
- More generous spacing

### Desktop (> 1024px)
- Optimal readability width
- Comfortable spacing
- Full feature visibility

---

## Icon Usage

| Icon | Context | Size |
|------|---------|------|
| `AlertCircle` | Warning banner | 20px (`w-5 h-5`) |
| `Info` | Info banner | 20px |
| `Calendar` | Date section header, booking date | 20px / 16px |
| `User` | Booking applicant name | 16px (`w-4 h-4`) |
| `Clock` | Booking time | 16px |

---

## Empty States

### No Bookings During Vacation
```
┌─────────────────────────────────────────────────────────┐
│ ✅ No existing bookings during your vacation period.    │
│    Enjoy your time off!                                 │
└─────────────────────────────────────────────────────────┘
```
- Green background (`green-50`)
- Green border (`green-200`)
- Green text (`green-700`)
- Centered text

---

## User Flow

1. **Default State** → Provider sees info banner and toggle
2. **Toggle ON** → Warning banner appears, date/message fields show
3. **Set Dates** (optional) → Date inputs become active
4. **Enter Message** → Textarea with character count
5. **View Bookings** → If dates set, bookings in range appear
6. **Save** → Settings persisted, profile hidden from marketplace
7. **Toggle OFF** → Return to default state, profile visible again

---

## Accessibility Features

- ✅ All inputs have labels
- ✅ Toggle has proper switch semantics
- ✅ Color + text for state indication (not color alone)
- ✅ Keyboard navigable
- ✅ Touch targets 44px minimum
- ✅ Clear focus indicators
- ✅ Semantic HTML structure
- ✅ Screen reader friendly

---

## Mobile Optimizations

- Touch-friendly form controls (44px min)
- Clear visual hierarchy
- Adequate spacing between interactive elements
- Scrollable booking list
- Native date pickers
- Vertical stacking on small screens
- Easy thumb-zone button placement

---

## Data Validation

### Dates
- End date must be after start date (enforced by `min` attribute)
- Dates are optional (can pause indefinitely)
- Format: YYYY-MM-DD (native date input)

### Auto-Response
- Max length: 500 characters
- Character counter updates in real-time
- Placeholder provides example format

### Toggle
- Immediate effect (no confirmation needed)
- Clear visual feedback

---

## Performance Considerations

- Booking cards virtualized if > 10 items (future enhancement)
- Debounce on textarea input for character count
- Lazy load booking avatars
- Efficient re-renders with React.memo (if needed)

---

## Testing Scenarios

### Visual Regression
- Toggle on/off states
- With/without vacation dates
- Empty bookings vs populated list
- Long auto-response text
- Mobile vs desktop layouts

### Interaction
- Toggle pause
- Select dates (start then end)
- Type auto-response message
- Click save/cancel
- Scroll booking list

### Edge Cases
- Very long applicant names
- No bookings during vacation
- Many bookings (scroll test)
- Invalid date selection attempts
- Character limit reached
