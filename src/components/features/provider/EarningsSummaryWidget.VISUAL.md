# EarningsSummaryWidget - Visual Reference

## Component Layout

```
┌─────────────────────────────────────────────────────┐
│ 💰 Earnings Summary                                 │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │   This Month                                  │ │
│  │   $450  [↗ +$150 (50%)]                      │ │
│  │   vs $300 last month                         │ │
│  └───────────────────────────────────────────────┘ │
│    ↑ Green gradient background                    │
│                                                     │
│  Monthly Goal                   $450 / $500        │
│  [████████████████░░░░░░] 90%                      │
│  $50 to go (10% remaining)                         │
│                                                     │
│  ┌─────────────────────┐ ┌─────────────────────┐  │
│  │ 💰 Available Balance│ │ 🕐 Pending          │  │
│  │ $320                │ │ $130                │  │
│  │ Ready for payout    │ │ From active sessions│  │
│  └─────────────────────┘ └─────────────────────┘  │
│                                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │ 📅 Next Payout         [5 days]              │ │
│  │    Dec 20, 2024                              │ │
│  └───────────────────────────────────────────────┘ │
│    ↑ Purple accent background                     │
│                                                     │
│  [View All Earnings →]                             │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## Section Breakdown

### 1. Header
```
┌─────────────────────────────────────────┐
│ 💰 Earnings Summary                     │
└─────────────────────────────────────────┘
```
- Icon: Dollar sign (green)
- Title: "Earnings Summary"
- Standard CardHeader styling

### 2. Main Earnings Display (Gradient Card)
```
┌───────────────────────────────────────────┐
│ This Month                                │
│                                           │
│ $450  [↗ +$150 (50%)]                    │
│                                           │
│ vs $300 last month                        │
└───────────────────────────────────────────┘
```
**Visual Properties:**
- Background: `bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50`
- Border: `border-green-100`
- Padding: `p-4`
- Rounded: `rounded-xl`

**Elements:**
- Label: "This Month" (small, gray)
- Amount: Large text (4xl, bold, green-700)
- Badge: Growth indicator
  - Green with TrendingUp icon (positive)
  - Red with TrendingDown icon (negative)
  - Shows amount and percentage
- Comparison: Small gray text

### 3. Monthly Goal Progress (Conditional)
```
Monthly Goal              $450 / $500
[████████████████░░░░░░] 90%
$50 to go (10% remaining)
```
**Only shows if `monthlyGoal` is set**

**Elements:**
- Header: "Monthly Goal" + current/goal amounts
- Progress bar: Green fill
- Status text:
  - If < 100%: "$X to go (X% remaining)"
  - If ≥ 100%: "Goal achieved! Exceeded by $X" (green)

### 4. Balance Cards Grid
```
┌─────────────────┐  ┌─────────────────┐
│ 💰 Available    │  │ 🕐 Pending      │
│    Balance      │  │                 │
│                 │  │                 │
│ $320            │  │ $130            │
│                 │  │                 │
│ Ready for       │  │ From active     │
│ payout          │  │ sessions        │
└─────────────────┘  └─────────────────┘
```

**Layout:**
- Grid: `grid-cols-1 sm:grid-cols-2 gap-3`
- Card styling: White background, gray border
- Padding: `p-3`

**Left Card - Available Balance:**
- Icon: DollarSign (green-600)
- Label: "Available Balance" (small, gray)
- Amount: 2xl, bold
- Description: "Ready for payout"

**Right Card - Pending:**
- Icon: Clock (orange-500)
- Label: "Pending" (small, gray)
- Amount: 2xl, bold
- Description: "From active sessions"

### 5. Next Payout Banner
```
┌─────────────────────────────────────────┐
│ 📅 Next Payout          [5 days]       │
│    Dec 20, 2024                        │
└─────────────────────────────────────────┘
```
**Visual Properties:**
- Background: `bg-purple-50`
- Border: `border-purple-100`
- Padding: `p-3`
- Rounded: `rounded-lg`

**Elements:**
- Left side:
  - Calendar icon (purple-600)
  - Label: "Next Payout"
  - Date: Bold, formatted
- Right side:
  - Badge: Days until payout
    - "Today" | "1 day" | "X days"
    - Purple background

### 6. View All Earnings Button
```
┌─────────────────────────────────────────┐
│ View All Earnings              →       │
└─────────────────────────────────────────┘
```
- Full width outline button
- Arrow icon that slides right on hover
- Links to full earnings page

## Color Palette

### Primary Colors
- **Green Gradient**: `from-green-50 via-emerald-50 to-teal-50`
- **Green Accent**: `green-600`, `green-700`
- **Purple Accent**: `purple-50`, `purple-100`, `purple-600`, `purple-700`
- **Orange Accent**: `orange-500`

### Status Colors
- **Positive Growth**: Green badge (`bg-green-100 text-green-700`)
- **Negative Growth**: Red badge (`bg-red-100 text-red-700`)
- **Goal Achieved**: Green text (`text-green-600`)

### Neutral Colors
- **Card Background**: White
- **Border**: `gray-200`
- **Text**: `gray-600`, `gray-900`

## Responsive Breakpoints

### Mobile (< 640px)
```
┌─────────────────┐
│ Main Earnings   │
└─────────────────┘
┌─────────────────┐
│ Goal Progress   │
└─────────────────┘
┌─────────────────┐
│ Available       │
│ Balance         │
└─────────────────┘
┌─────────────────┐
│ Pending         │
└─────────────────┘
┌─────────────────┐
│ Next Payout     │
└─────────────────┘
```
Balance cards stack vertically

### Desktop (≥ 640px)
```
┌─────────────────────────┐
│ Main Earnings           │
└─────────────────────────┘
┌─────────────────────────┐
│ Goal Progress           │
└─────────────────────────┘
┌───────────┐ ┌───────────┐
│ Available │ │ Pending   │
└───────────┘ └───────────┘
┌─────────────────────────┐
│ Next Payout             │
└─────────────────────────┘
```
Balance cards side-by-side in 2-column grid

## State Examples

### Example 1: Positive Growth
```
This Month
$450  [↗ +$150 (50%)]
vs $300 last month
```
Green badge with up arrow

### Example 2: Negative Growth
```
This Month
$320  [↘ -$230 (-42%)]
vs $550 last month
```
Red badge with down arrow

### Example 3: Goal Achieved
```
Monthly Goal              $1250 / $1000
[████████████████████] 125%
✓ Goal achieved! Exceeded by $250
```
Full progress bar, green achievement text

### Example 4: Near Goal
```
Monthly Goal              $450 / $500
[████████████████░░░░] 90%
$50 to go (10% remaining)
```
Partially filled progress bar

### Example 5: Payout Today
```
📅 Next Payout          [Today]
   Dec 13, 2024
```
Badge shows "Today" instead of days

### Example 6: No Goal Set
```
This Month
$425  [↗ +$45 (12%)]
vs $380 last month

[No progress bar section shown]

┌Available┐ ┌Pending┐
```
Goal section completely hidden

## Spacing & Sizing

### Container
- Padding: `p-4` (CardContent)
- Spacing between sections: `space-y-4`

### Main Earnings
- Padding: `p-4`
- Amount font size: `text-4xl`
- Badge gap: `gap-1`

### Balance Cards
- Grid gap: `gap-3`
- Card padding: `p-3`
- Amount font size: `text-2xl`
- Icon size: `w-4 h-4`

### Icons
- Header icon: `w-5 h-5`
- Section icons: `w-4 h-4`
- Badge icons: `w-3 h-3`
- Trend icons: `w-3 h-3`
- Button arrow: `w-4 h-4`

### Touch Targets
- All buttons/interactive elements: Minimum 44x44px
- Calendar day cells: `min-h-[44px] min-w-[44px]`

## Animation & Interaction

### Button Hover
```jsx
className="group"
<ArrowRight className="transition-transform group-hover:translate-x-1" />
```
Arrow slides right on hover

### Progress Bar
Smooth fill animation (handled by Progress component)

### Badge Transitions
Smooth color transitions on state changes

## Typography

### Font Sizes
- Main earnings: `text-4xl` (36px)
- Balance amounts: `text-2xl` (24px)
- Section labels: `text-sm` (14px)
- Descriptions: `text-xs` (12px)

### Font Weights
- Earnings amount: `font-bold` (700)
- Balance amounts: `font-bold` (700)
- Section titles: `font-medium` (500)
- Labels: `font-medium` (500)

### Line Heights
Default spacing for readability

## Accessibility Notes

- All monetary values include currency symbol
- Trend direction shown with both icon AND text/number
- Progress includes both visual bar and text percentage
- Proper semantic heading structure
- Color contrast meets WCAG AA standards
- Touch targets meet minimum 44px
- Screen reader friendly labels
