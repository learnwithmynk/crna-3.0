# ServiceTemplates Component - Visual Reference

## Component Appearance

### Full Component Layout (All Templates)

```
┌─────────────────────────────────────────────────────────┐
│  Service Description Templates                          │
│  Choose a template to get started, then customize       │
│  it to match your style and expertise.                  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  [📄] Mock Interview                            [∨]     │
│       Click to preview and use this template            │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  [📄] Essay Review                              [∨]     │
│       Click to preview and use this template            │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  [📄] Coaching/Strategy                         [∨]     │
│       Click to preview and use this template            │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  [📄] Q&A Call                                  [∨]     │
│       Click to preview and use this template            │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  ℹ️ Tips for Customizing Your Description              │
│  • Add specific details about your program             │
│  • Mention any unique expertise or specializations     │
│  • Keep it conversational and authentic                │
│  • Include what applicants will walk away with         │
│  • Be honest about what you can and can't help with    │
└─────────────────────────────────────────────────────────┘
```

---

### Collapsed Card (Default State)

```
┌───────────────────────────────────────────────────────────┐
│  ┌───┐                                                    │
│  │📄│  Mock Interview                           [∨]      │
│  └───┘  Click to preview and use this template           │
│                                                           │
└───────────────────────────────────────────────────────────┘
    ↑           ↑                                    ↑
  Icon       Title                            Expand button
 (gray)   (semibold)
```

**Colors:** White background, gray border, gray icon background

---

### Expanded Card (Showing Template)

```
┌───────────────────────────────────────────────────────────┐
│  ┌───┐                                                    │
│  │📄│  Mock Interview                           [∧]      │
│  └───┘  Click to preview and use this template           │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │ I'll simulate a real CRNA program interview,       │ │
│  │ covering behavioral questions, clinical scenarios, │ │
│  │ and program-specific topics. You'll receive        │ │
│  │ honest, constructive feedback on your answers,     │ │
│  │ body language, and presentation. I'll help you     │ │
│  │ identify areas for improvement and build           │ │
│  │ confidence for the real thing.                     │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                           │
│  ┌───────────────────────────────────────────────────┐   │
│  │         [📋] Use This Template                    │   │
│  └───────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────┘
           ↑                                  ↑
    Template preview               Primary action button
    (gray box, readable)              (yellow, black text)
```

**Colors:**
- Template preview: Light gray background (#F9FAFB)
- Button: Yellow background (#F7E547), black text

---

### Card After "Use This Template" Click

```
┌───────────────────────────────────────────────────────────┐
│  ┌───┐                                                    │
│  │📄│  Mock Interview                           [∧]      │
│  └───┘  Click to preview and use this template           │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │ I'll simulate a real CRNA program interview,       │ │
│  │ covering behavioral questions, clinical scenarios, │ │
│  │ and program-specific topics...                     │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                           │
│  ┌───────────────────────────────────────────────────┐   │
│  │         [✓] Copied to Description!               │   │
│  └───────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────┘
                        ↑
              Success state (2 seconds)
              Checkmark icon, yellow button
```

**Behavior:** Automatically reverts to "Use This Template" after 2 seconds

---

### Used Template Card (Green Success State)

```
┌───────────────────────────────────────────────────────────┐
│  ┌───┐                           ┌─────────┐             │
│  │📄│  Mock Interview            │ ✓ Used  │    [∨]     │
│  └───┘  Click to preview and     └─────────┘             │
│         use this template                                │
└───────────────────────────────────────────────────────────┘
    ↑                                    ↑
Green icon bg                      Green badge
(bg-green-200)                  (bg-green-200)
```

**Colors:**
- Card border: Green (#D1FAE5 - green-300)
- Card background: Light green (#F0FDF4 - green-50)
- Icon background: Green (#BBF7D0 - green-200)
- Badge: Green background with darker green text

---

### Mobile Layout (Collapsed Cards)

```
┌─────────────────────────────────┐
│  Service Description Templates  │
│  Choose a template to get       │
│  started, then customize it.    │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  [📄] Mock Interview     [∨]   │
│       Click to preview         │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  [📄] Essay Review       [∨]   │
│       Click to preview         │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  [📄] Coaching/Strategy  [∨]   │
│       Click to preview         │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  [📄] Q&A Call           [∨]   │
│       Click to preview         │
└─────────────────────────────────┘
```

**Note:** Cards stack vertically, text wraps naturally

---

### Single Template Mode (serviceType prop provided)

```
┌─────────────────────────────────────────────────────────┐
│  Service Description Templates                          │
│  Choose a template to get started, then customize       │
│  it to match your style and expertise.                  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  [📄] Mock Interview                            [∨]     │
│       Click to preview and use this template            │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  ℹ️ Tips for Customizing Your Description              │
│  • Add specific details about your program             │
│  • Mention any unique expertise or specializations     │
│  • Keep it conversational and authentic                │
│  • Include what applicants will walk away with         │
│  • Be honest about what you can and can't help with    │
└─────────────────────────────────────────────────────────┘
```

**Usage:** When `serviceType="mock_interview"` prop is provided, only that template shows

---

## Color Palette

### Default State
- **Card Background:** White (#FFFFFF)
- **Card Border:** Gray (#E5E7EB - gray-200)
- **Icon Background:** Gray (#F3F4F6 - gray-100)
- **Icon Color:** Gray (#6B7280 - gray-600)
- **Text:** Black (#1A1A1A)
- **Secondary Text:** Gray (#6B7280 - gray-600)

### Used/Success State
- **Card Background:** Light Green (#F0FDF4 - green-50)
- **Card Border:** Green (#D1FAE5 - green-300)
- **Icon Background:** Green (#BBF7D0 - green-200)
- **Icon Color:** Dark Green (#15803D - green-700)
- **Badge Background:** Green (#BBF7D0 - green-200)
- **Badge Text:** Dark Green (#166534 - green-800)

### Button
- **Primary:** Yellow background (#F7E547), black text
- **Primary Hover:** Black background, yellow text
- **Disabled:** Gray, reduced opacity

### Tips Section
- **Background:** Light Blue (#EFF6FF - blue-50)
- **Border:** Blue (#BFDBFE - blue-200)
- **Text:** Dark Blue (#1E3A8A - blue-900)
- **List Items:** Blue (#1E40AF - blue-800)

---

## Typography

### Heading
- **Font:** System font stack (Inter fallback)
- **Size:** 18px (text-lg)
- **Weight:** Semibold (600)
- **Color:** Near black (#1A1A1A - gray-900)

### Card Title
- **Font:** System font stack
- **Size:** 16px (text-base)
- **Weight:** Semibold (600)
- **Color:** Black

### Card Description
- **Font:** System font stack
- **Size:** 14px (text-sm)
- **Weight:** Normal (400)
- **Color:** Gray (#6B7280 - gray-500)

### Template Text
- **Font:** System font stack
- **Size:** 14px (text-sm)
- **Weight:** Normal (400)
- **Color:** Dark gray (#374151 - gray-700)
- **Line Height:** Relaxed (1.625)

### Tips
- **Font:** System font stack
- **Size:** 14px (text-sm)
- **Weight:** Normal (400)
- **Color:** Dark blue (#1E40AF - blue-800)

---

## Spacing

### Component
- **Outer spacing:** space-y-4 (16px between sections)
- **Header margin:** mb-4 (16px below)

### Cards
- **Gap between cards:** space-y-3 (12px)
- **Padding:** p-6 (24px) for header/content
- **Icon margin:** mr-3 (12px right)

### Template Preview Box
- **Padding:** p-4 (16px)
- **Margin:** None (flush with parent)
- **Border radius:** rounded-lg (8px)

### Button
- **Padding:** Full width
- **Margin:** None
- **Height:** min-h-[44px] (touch target)

---

## Responsive Behavior

### Desktop (≥768px)
- Cards full width
- Text doesn't wrap
- All elements visible
- Hover states active

### Tablet (≥640px, <768px)
- Cards full width
- Some text wrapping
- Touch targets 44px minimum
- Hover states active

### Mobile (<640px)
- Cards stack vertically
- Text wraps naturally
- Icon + title on separate lines if needed
- Touch-optimized spacing

---

## Animation & Transitions

### Card Expand/Collapse
```
Duration: 200ms
Easing: ease-in-out
Properties: height, opacity
```

### Button State Change
```
Duration: 200ms
Easing: ease-in-out
Properties: background-color, color, border-color
```

### Badge Appearance
```
Duration: Instant (no animation)
```

### Copied State
```
Show: Instant
Hide: After 2000ms
Transition: 200ms fade
```

---

## Interactive States

### Button States
1. **Default:** Yellow bg, black text, black border
2. **Hover:** Black bg, yellow text, black border
3. **Active/Pressed:** Darker black bg
4. **Disabled:** Gray, 50% opacity
5. **Success (Copied):** Yellow bg, checkmark icon

### Card States
1. **Collapsed:** Height auto, content hidden
2. **Expanded:** Height auto, content visible
3. **Unused:** Gray borders and icons
4. **Used:** Green borders, icons, and badge
5. **Hover (expand button):** Gray background on chevron

---

## Accessibility Features

### Keyboard Navigation
- Tab through expand buttons
- Enter/Space to expand/collapse
- Tab to "Use This Template" button
- Enter/Space to activate button

### Focus States
- Visible focus ring (2px yellow)
- Focus ring offset (2px)
- Clear visual indicator

### Screen Reader Support
- Card titles are proper headings
- Buttons have descriptive labels
- Icons have aria-hidden (decorative)
- State changes announced

### Color Contrast
- All text meets WCAG AA (4.5:1)
- Button text meets AAA (7:1)
- Focus indicators are visible
- Color is not only indicator (icons + text)

---

**Component Files:**
- Main: `/src/components/features/provider/ServiceTemplates.jsx`
- Examples: `/src/components/features/provider/ServiceTemplates.example.jsx`
- Docs: `/src/components/features/provider/ServiceTemplates.README.md`
- Summary: `/src/components/features/provider/ServiceTemplates.SUMMARY.md`
- Visual: This file

**Status:** ✅ Complete and ready for integration
