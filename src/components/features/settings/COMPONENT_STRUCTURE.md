# NotificationSettings Component Structure

## Visual Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│ NOTIFICATION SETTINGS                                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 📧 Email Notifications                               │  │
│  │ Choose which updates you'd like to receive via email │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │                                                       │  │
│  │  📅  Booking Updates                      [ON]  ✓    │  │
│  │      When someone books with you...                  │  │
│  │                                                       │  │
│  │  💬  Messages                            [ON]       │  │
│  │      New messages from mentors...                    │  │
│  │                                                       │  │
│  │  ⭐  Reviews                             [ON]       │  │
│  │      When you receive a new review...                │  │
│  │                                                       │  │
│  │  📈  Weekly Summary                      [ON]       │  │
│  │      Weekly digest of your progress...               │  │
│  │                                                       │  │
│  │  🏷️  Marketing & Updates                [OFF]      │  │
│  │      Product updates and special offers...           │  │
│  │                                                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 🔔 In-App Notifications                              │  │
│  │ Manage notifications that appear within the app      │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │                                                       │  │
│  │  📅  Booking Reminders                   [ON]       │  │
│  │      Reminders before scheduled sessions...          │  │
│  │                                                       │  │
│  │  🔔  Deadline Alerts                     [ON]       │  │
│  │      Application deadline reminders...               │  │
│  │                                                       │  │
│  │  💬  Community Activity                  [ON]       │  │
│  │      Replies to your forum posts...                  │  │
│  │                                                       │  │
│  │  🏆  Achievement Badges                  [ON]       │  │
│  │      When you earn new badges...                     │  │
│  │                                                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 📈 Notification Frequency              ✓ Saved      │  │
│  │ How often would you like to receive notifications?  │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │                                                       │  │
│  │  ○  Instant                                          │  │
│  │     Get notified immediately as things happen        │  │
│  │                                                       │  │
│  │  ●  Daily Digest                                     │  │
│  │     Receive a summary once per day (morning 8 AM)    │  │
│  │                                                       │  │
│  │  ○  Weekly Digest                                    │  │
│  │     Receive a summary once per week (Mon mornings)   │  │
│  │                                                       │  │
│  │  ─────────────────────────────────────────────────   │  │
│  │                                                       │  │
│  │  Quiet Hours                              [OFF]      │  │
│  │  Pause non-urgent notifications (coming soon)        │  │
│  │                                                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ ℹ️  Changes save automatically                        │  │
│  │                                                       │  │
│  │ Your notification preferences are synced across all  │  │
│  │ your devices. Important notifications like booking   │  │
│  │ confirmations will always be sent.                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Component Breakdown

### NotificationToggle Subcomponent

Each toggle row contains:
```
┌────────────────────────────────────────────────────────┐
│  [Icon Box]  Label               ✓ Saved    [Toggle]  │
│              Description text                         │
└────────────────────────────────────────────────────────┘
```

**Layout:**
- **Icon Box**: 40x40px, rounded-xl, gray-50 background
- **Label**: font-medium, text-sm, clickable (cursor-pointer)
- **Saved Indicator**: Appears for 2 seconds, green text, fade-in animation
- **Toggle**: Switch component with theme colors
- **Description**: text-sm, text-gray-600, multi-line

### Cards

All sections use the Card component with:
- **Padding**: p-6
- **Background**: white
- **Border**: subtle gray
- **Shadow**: sm
- **Corners**: rounded-xl

### Icons Used

| Icon | Component | Usage |
|------|-----------|-------|
| Mail | Lucide | Email section header |
| Bell | Lucide | In-app section header |
| TrendingUp | Lucide | Frequency section header |
| Calendar | Lucide | Booking-related toggles |
| MessageSquare | Lucide | Message/community toggles |
| Star | Lucide | Reviews toggle |
| Trophy | Lucide | Achievement toggle |
| Tag | Lucide | Marketing toggle |
| CheckCircle2 | Lucide | "Saved" indicator |

### Spacing System

```
Container: space-y-6 (24px between cards)

Card Header:
  mb-6 (24px margin-bottom)
  gap-2 (8px between icon and title)

Card Content:
  space-y-0 (no gap, using borders)

Toggle Rows:
  py-4 (16px top/bottom padding)
  gap-4 (16px between elements)
  border-b (separator line)

Radio Options:
  space-y-3 (12px between options)
  p-4 (16px padding)
  gap-3 (12px between radio and label)
```

### Color Scheme

**Backgrounds:**
- Page: `bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50`
- Cards: `bg-white`
- Icon boxes: `bg-gray-50`
- Info card: `bg-blue-50`

**Text:**
- Headings: `text-gray-900`
- Body: `text-gray-600`
- Labels: `text-gray-900 font-medium`

**Accents:**
- Success/Saved: `text-green-600`
- Info: `text-blue-600/700/900`
- Switches: Theme colors (via ThemeContext)

**Borders:**
- Separator: `border-gray-100`
- Card: `border-gray-100`
- Radio hover: `border-gray-200`

### Responsive Behavior

**Mobile (< 640px):**
- Cards full width
- Icon boxes slightly smaller
- Text wraps naturally
- Switches maintain 44px touch target

**Tablet (640px - 1024px):**
- Max width constrained
- Same layout as mobile

**Desktop (> 1024px):**
- Max width 3xl (768px)
- Centered content
- All features visible

### Animation & Transitions

**Saved Indicator:**
- `animate-in fade-in duration-200`
- Appears instantly
- Fades out after 2 seconds

**Radio Options:**
- `transition-colors`
- Border changes on hover
- Smooth state changes

**Switches:**
- `transition-all duration-200`
- Smooth thumb movement
- Color change animation

## State Management

```javascript
// Email preferences (boolean values)
emailPrefs: {
  bookingUpdates: true,
  messages: true,
  reviews: true,
  weeklySummary: true,
  marketing: false
}

// In-app preferences (boolean values)
inAppPrefs: {
  bookingReminders: true,
  deadlineAlerts: true,
  communityActivity: true,
  achievementBadges: true
}

// Frequency (string value)
frequency: 'instant' | 'daily' | 'weekly'

// Quiet hours (boolean, currently disabled)
quietHoursEnabled: false

// UI state (string, temporary)
recentlySaved: 'email-bookingUpdates' | null
```

## Auto-Save Flow

```
User toggles switch
       ↓
Update local state immediately
       ↓
Set recentlySaved = 'category-key'
       ↓
Show "Saved" indicator (green checkmark + text)
       ↓
TODO: Call API to persist
       ↓
setTimeout 2 seconds
       ↓
Clear recentlySaved (indicator fades out)
```

## Accessibility Features

✓ All switches have proper labels (htmlFor attribute)
✓ Radio buttons have unique IDs
✓ Descriptions provide context
✓ Keyboard navigation works
✓ Focus states visible (via ThemeContext)
✓ ARIA labels where needed
✓ Semantic HTML structure
✓ Color contrast meets WCAG standards
✓ Touch targets >= 44px

## Props API

```typescript
interface NotificationSettingsProps {
  className?: string;  // Optional className for container
}
```

Simple API - component is mostly self-contained. To customize behavior, modify the component directly or wrap in a custom hook.
