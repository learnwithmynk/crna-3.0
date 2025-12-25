# GrowYourPracticeCTA Visual Design

## Component Appearance

```
┌─────────────────────────────────────────────────────────────┐
│  🚀 Grow Your Practice                                      │
│  Get more clients by engaging with the community            │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ☐ 💬 Post in the forums                            │   │
│  │       2 pts each                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ☐ 👥 Answer questions in groups                    │   │
│  │       2 pts each                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ☐ 🎥 Host a live Q&A call                          │   │
│  │       10 pts                                         │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ☐ 🔗 Share your profile on social media            │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────┐ ┌──────────────────────────┐ │
│  │  Go to Community         │ │ Download Social Templates│ │
│  └──────────────────────────┘ └──────────────────────────┘ │
│  ────────────────────────────────────────────────────────── │
│  24 points                                          🚀      │
│  Your engagement score                                       │
│  Higher engagement = better search ranking                   │
└─────────────────────────────────────────────────────────────┘

Background: Purple → Pink → Orange gradient
Text: White
Checkboxes: White borders, purple fill when checked
Action items: Frosted glass effect (white/10 bg, backdrop blur)
Primary button: White background, purple text
Secondary button: Transparent with white border
```

## Mobile View (< 640px)

```
┌─────────────────────────────┐
│ 🚀 Grow Your Practice       │
│ Get more clients...         │
│                             │
│ ┌─────────────────────────┐ │
│ │ ☐ 💬 Post in forums     │ │
│ │    2 pts each           │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ ☐ 👥 Answer questions   │ │
│ │    2 pts each           │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ ☐ 🎥 Host live Q&A      │ │
│ │    10 pts               │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ ☐ 🔗 Share on social    │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │   Go to Community       │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ Download Templates      │ │
│ └─────────────────────────┘ │
│ ─────────────────────────── │
│ 24 points             🚀    │
│ Your engagement score       │
│ Higher engagement = better  │
│ search ranking              │
└─────────────────────────────┘

Buttons stack vertically
```

## Color Palette

### Gradient Background
```css
background: linear-gradient(135deg,
  #a855f7,  /* purple-500 */
  #ec4899,  /* pink-500 */
  #fb923c   /* orange-400 */
);
```

### Text Colors
- Header: `white` (100% opacity)
- Subtitle: `white/90` (90% opacity)
- Action labels: `white` (100% opacity)
- Points text: `white/80` (80% opacity)
- Bottom help text: `white/70` (70% opacity)

### Interactive Elements
- Action items background: `white/10` with backdrop blur
- Action items border: `white/20`
- Hover state: `white/20` background, `white/40` border
- Checkbox border: `white/50`
- Checkbox background: `white/20`
- Checked checkbox: `white` background with `purple-600` text

### Buttons
- Primary: `white` background, `purple-600` text, `white` border
- Primary hover: `gray-100` background
- Secondary: `transparent` background, `white` text, `white` border
- Secondary hover: `white/10` background

## States

### Empty State (No completed actions)
```
All checkboxes: ☐ (unchecked)
Engagement score: 0 points
```

### Partial Completion
```
☑ Post in forums (checked, line-through)
☐ Answer questions (unchecked)
☐ Host live Q&A (unchecked)
☐ Share on social (unchecked)
Engagement score: 2 points
```

### High Engagement
```
☑ Post in forums (checked)
☑ Answer questions (checked)
☑ Host live Q&A (checked)
☑ Share on social (checked)
Engagement score: 142 points
```

## Icons

| Action | Icon | Source |
|--------|------|--------|
| Component header | TrendingUp | lucide-react |
| Post in forums | MessageSquare | lucide-react |
| Answer questions | Users | lucide-react |
| Host live Q&A | Video | lucide-react |
| Share on social | Share2 | lucide-react |
| Engagement score | TrendingUp (decorative) | lucide-react |

## Spacing

- Card padding: `p-6` (24px)
- Header margin bottom: `mb-6` (24px)
- Actions gap: `space-y-3` (12px)
- Action item padding: `p-3` (12px)
- Action item gap: `gap-3` (12px)
- Buttons margin bottom: `mb-6` (24px)
- Buttons gap: `gap-3` (12px on mobile, horizontal when stacked)
- Score section padding top: `pt-4` (16px)
- Score text margin top: `mt-2` (8px)

## Touch Targets

All interactive elements meet the 44px minimum:
- Checkboxes: 24px visual size, but in 44px padding area
- Buttons: `min-h-[44px]` explicitly set
- Action items: Full row is clickable via label

## Accessibility Features

1. **Keyboard Navigation**
   - Tab through checkboxes
   - Space to toggle checkbox
   - Tab to buttons
   - Enter to activate button

2. **Screen Reader Support**
   - Checkboxes have associated labels via `htmlFor`
   - Icons are decorative (no alt text needed)
   - Buttons have clear text labels

3. **Color Contrast**
   - White on gradient background exceeds WCAG AA
   - Checked items remain readable with line-through

4. **Focus States**
   - Checkboxes show focus ring (Radix UI default)
   - Buttons show focus outline

## Responsive Breakpoints

| Breakpoint | Behavior |
|------------|----------|
| < 640px | Buttons stack vertically, full width |
| >= 640px | Buttons side-by-side, flex-1 |

## Animation & Transitions

- Hover states: `transition-all` on action items
- Border color changes on hover
- Background opacity changes on hover
- Checkbox state changes (Radix UI default animations)

## Integration with Design System

Follows CRNA Club design patterns:
- Uses shadcn/ui Card component structure
- Matches Button component API
- Uses Checkbox from component library
- Icons from lucide-react (standard)
- Utility classes via cn() helper
- Tailwind CSS for all styling

## Example in Context

```
Provider Dashboard

┌─────────────────────┐  ┌─────────────────────┐
│ Earnings Summary    │  │ Recent Bookings     │
│ $247 this month     │  │ 3 upcoming sessions │
└─────────────────────┘  └─────────────────────┘

┌──────────────────────────────────────────────┐
│ 🚀 Grow Your Practice                        │
│ [Full component as shown above]              │
└──────────────────────────────────────────────┘

┌────────────────────────────────────────────────┐
│ Onboarding Progress                            │
│ 80% Complete - Finish Stripe setup             │
└────────────────────────────────────────────────┘
```

## Design Rationale

1. **Vibrant Gradient**: Stands out from other white cards on dashboard
2. **White Text**: High contrast against colorful background
3. **Glass Morphism**: Modern, trendy design pattern for action items
4. **Clear CTAs**: Primary action (community) emphasized over secondary
5. **Gamification**: Points visible to encourage engagement
6. **Progress Indicator**: Engagement score shows cumulative impact
7. **Social Proof**: "Better search ranking" motivates participation
