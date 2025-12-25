# ProviderBookingCard - Visual Reference

## Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│ HEADER                                                      │
│ ┌────┐ Sarah Johnson                    [Pending]          │
│ │ SJ │ Interviewing                                        │
│ └────┘                                                      │
├─────────────────────────────────────────────────────────────┤
│ CONTENT                                                     │
│                                                             │
│ Mock Interview Prep                                         │
│ ⏰ 60 minutes • 🎥 Live Session                            │
│                                                             │
│ 📅 Dec 20, 2024 at 2:00 PM EST                             │
│                                                             │
│ 💲 $125.00 (You earn: $100.00)                             │
│                                                             │
│ 🎯 Target programs: Georgetown, Duke +1 more               │
│                                                             │
│ ┌───────────────────────────────────────────────────────┐  │
│ │ "I have my Georgetown interview coming up in 2        │  │
│ │  weeks. Would love to practice answering common       │  │
│ │  questions..."                                        │  │
│ └───────────────────────────────────────────────────────┘  │
│                                                             │
│ ┌─────────────────────────────────────────────────────┐    │
│ │ 📄 Materials (2)                              ▼     │    │
│ └─────────────────────────────────────────────────────┘    │
│   (Collapsed by default)                                   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ FOOTER                                                      │
│ [Accept]  [Decline]                                         │
└─────────────────────────────────────────────────────────────┘
```

## Materials Expanded

```
┌─────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────┐    │
│ │ 📄 Materials (2)                              ▲     │    │
│ └─────────────────────────────────────────────────────┘    │
│     📄 personal-statement-draft3.docx    [📥 Download]     │
│     ─────────────────────────────────────────────────      │
│     📄 resume.pdf                        [📥 Download]     │
└─────────────────────────────────────────────────────────────┘
```

## Status States

### 1. Pending Acceptance (Yellow Badge)
```
Actions: [Accept] [Decline]
```

### 2. Confirmed/Upcoming (Blue Badge)
```
Actions: [Reschedule] [Cancel] [Message]
        [View Details →]
```

### 3. Upcoming - Ready to Join (Blue Badge)
```
Actions: [🎥 Join Video] (green, prominent)
        [Reschedule] [Cancel] [Message]
        [View Details →]

Note: Join Video only shows 5 min before session
```

### 4. Completed - Needs Review (Green Badge)
```
Actions: [⭐ Leave Review]
        [Message]
        [View Details →]
```

### 5. Completed - With Review (Green Badge)
```
Actions: [View Review]
        [Message]
        [View Details →]
```

### 6. Cancelled (Gray Badge)
```
┌─────────────────────────────────────────────────────────────┐
│ ⚠️ Cancelled: Applicant had to reschedule due to work     │
│    emergency                                               │
└─────────────────────────────────────────────────────────────┘

Actions: "This booking was cancelled" (centered text)
```

## Color Reference

### Status Badge Colors

**Pending Acceptance**
- Background: `bg-yellow-100`
- Text: `text-yellow-800`
- Icon: AlertCircle

**Confirmed/Upcoming**
- Background: `bg-blue-100`
- Text: `text-blue-800`
- Icon: CheckCircle2

**In Progress**
- Background: `bg-purple-100`
- Text: `text-purple-800`
- Icon: AlertCircle

**Completed**
- Background: `bg-green-100`
- Text: `text-green-800`
- Icon: CheckCircle2

**Cancelled**
- Background: `bg-gray-100`
- Text: `text-gray-600`
- Icon: XCircle

**Declined**
- Background: `bg-red-100`
- Text: `text-red-800`
- Icon: XCircle

**Disputed**
- Background: `bg-orange-100`
- Text: `text-orange-800`
- Icon: AlertCircle

### Component Colors

**Avatar Fallback**
- Gradient: `from-pink-100 to-purple-100`
- Text: `text-purple-600`

**Notes Box**
- Background: `bg-gray-50`
- Text: `text-gray-700` (italic)

**Cancellation Alert**
- Background: `bg-red-50`
- Border: `border-red-100`
- Text: `text-red-800`

**Join Video Button (Active)**
- Background: `bg-green-600`
- Hover: `hover:bg-green-700`

**Provider Earnings**
- Text: `text-green-600`

## Responsive Behavior

### Desktop (1024px+)
```
┌─────────────────────────────────────────────────────────────┐
│ [Avatar] Name + Info              [Status Badge]            │
│                                                             │
│ Service details all on one line                            │
│ Actions: [Button 1] [Button 2] [Button 3]  [Details →]    │
└─────────────────────────────────────────────────────────────┘
```

### Mobile (375px)
```
┌────────────────────────────┐
│ [Avatar] Name              │
│          [Badge]           │
│                            │
│ Service details            │
│ wrapped to multiple lines  │
│                            │
│ [Button 1]                 │
│ [Button 2]                 │
│ [Button 3]                 │
│ [Details →]                │
└────────────────────────────┘
```

## Icon Reference

- 📅 Calendar - `<Calendar />`
- ⏰ Clock - `<Clock />`
- 💲 DollarSign - `<DollarSign />`
- 📄 FileText - `<FileText />`
- 📥 Download - `<Download />`
- 🎥 Video - `<Video />`
- 🔄 RefreshCw - `<RefreshCw />`
- ❌ X - `<X />`
- ⭐ Star - `<Star />`
- 🎯 Target - `<Target />`
- 💬 MessageSquare - `<MessageSquare />`
- ✅ CheckCircle2 - `<CheckCircle2 />`
- ⛔ XCircle - `<XCircle />`
- ⚠️ AlertCircle - `<AlertCircle />`
- ▼ ChevronDown - `<ChevronDown />`

## Interaction States

### Hover
- Card: Increased shadow (`hover:shadow-md`)
- Buttons: Standard button hover states
- Download links: Blue underline

### Focus
- All interactive elements have visible focus rings
- Keyboard navigable

### Loading (Future)
- Buttons show spinner on click
- Disable other actions during async operations

### Error (Future)
- Show error message above footer
- Keep actions enabled for retry

## Spacing

- Card padding: `p-6`
- Section spacing: `space-y-4`
- Header padding bottom: `pb-4`
- Footer padding top: `pt-4`
- Footer border top: `border-t`
- Button gaps: `gap-2`
- Icon-text gap: `gap-2`
- Avatar size: Default (40px)

## Typography

- Applicant name: `font-semibold text-lg`
- Service title: `font-medium text-base`
- Body text: `text-sm`
- Stage/meta: `text-sm text-gray-500`
- Notes: `text-sm text-gray-700 italic`
- Price: `font-medium`
- Earnings: `text-green-600`

## Accessibility

- Semantic HTML (header, content, footer)
- Alt text on avatar images
- ARIA labels on icon-only buttons
- Keyboard navigation support
- Focus visible on all interactive elements
- Color contrast meets WCAG AA standards
- Icons paired with text labels
