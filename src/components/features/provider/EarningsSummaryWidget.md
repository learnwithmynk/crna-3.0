# EarningsSummaryWidget Component

## Overview

The `EarningsSummaryWidget` displays a comprehensive earnings overview for SRNA providers in their dashboard. It shows current month earnings, available balance, pending amounts, next payout date, and optional monthly goal progress.

## Features

- **This Month Earnings**: Large, prominent display with gradient background
- **Month-over-Month Comparison**: Shows change vs previous month with trend indicator
- **Available Balance**: Money ready for payout
- **Pending Earnings**: Amount from sessions not yet completed
- **Next Payout Date**: Countdown to next payout
- **Monthly Goal Progress**: Optional progress bar showing progress toward goal
- **View All Link**: Button to navigate to full earnings page

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `earnings` | `object` | See below | Earnings data object |
| `className` | `string` | `undefined` | Additional CSS classes |

### Earnings Object Structure

```javascript
{
  thisMonth: 450,           // Current month earnings (number)
  lastMonth: 300,           // Previous month earnings (number)
  availableBalance: 320,    // Balance ready for payout (number)
  pendingEarnings: 130,     // Pending from active sessions (number)
  nextPayoutDate: Date,     // Date object for next payout
  monthlyGoal: 500          // Optional monthly goal (number or null)
}
```

## Usage

### Basic Usage (with built-in mock data)

```jsx
import { EarningsSummaryWidget } from '@/components/features/provider';

function ProviderDashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <EarningsSummaryWidget />
    </div>
  );
}
```

### With Custom Data

```jsx
import { EarningsSummaryWidget } from '@/components/features/provider';

function ProviderDashboard() {
  const earningsData = {
    thisMonth: 1250,
    lastMonth: 900,
    availableBalance: 800,
    pendingEarnings: 450,
    nextPayoutDate: new Date('2024-12-20'),
    monthlyGoal: 1000,
  };

  return (
    <EarningsSummaryWidget earnings={earningsData} />
  );
}
```

### With API Data

```jsx
import { EarningsSummaryWidget } from '@/components/features/provider';
import { useProviderEarnings } from '@/hooks/useProviderEarnings';

function ProviderDashboard() {
  const { earnings, isLoading } = useProviderEarnings();

  if (isLoading) return <div>Loading...</div>;

  return (
    <EarningsSummaryWidget earnings={earnings} />
  );
}
```

### Without Monthly Goal

```jsx
<EarningsSummaryWidget
  earnings={{
    thisMonth: 425,
    lastMonth: 380,
    availableBalance: 290,
    pendingEarnings: 135,
    nextPayoutDate: new Date('2024-12-22'),
    monthlyGoal: null, // No goal tracking
  }}
/>
```

## Visual Design

### Main Features

1. **Gradient Earnings Display**
   - Large, eye-catching number with green gradient background
   - Badge showing month-over-month change with trend icon
   - Previous month comparison text

2. **Monthly Goal Progress**
   - Progress bar with percentage
   - Current/goal amounts
   - Goal achievement messaging

3. **Balance Grid**
   - Two-column responsive grid
   - Available balance (ready for payout)
   - Pending earnings (from active sessions)

4. **Payout Info**
   - Purple accent banner
   - Next payout date
   - Days until payout badge

### Color Scheme

- **Primary Gradient**: Green tones (`from-green-50 via-emerald-50 to-teal-50`)
- **Positive Growth**: Green badges with trending up icon
- **Negative Growth**: Red badges with trending down icon
- **Payout Section**: Purple accent (`purple-50`, `purple-100`)
- **Available Balance Icon**: Green (`green-600`)
- **Pending Icon**: Orange (`orange-500`)

### Responsive Behavior

- **Mobile (< 640px)**: Single column balance cards
- **Desktop (≥ 640px)**: Two-column balance grid

## States & Variations

### Positive Growth

```jsx
<EarningsSummaryWidget
  earnings={{
    thisMonth: 450,
    lastMonth: 300,
    // Shows green badge with +$150 (50%)
  }}
/>
```

### Negative Growth

```jsx
<EarningsSummaryWidget
  earnings={{
    thisMonth: 320,
    lastMonth: 550,
    // Shows red badge with -$230 (-42%)
  }}
/>
```

### Goal Achieved

```jsx
<EarningsSummaryWidget
  earnings={{
    thisMonth: 1250,
    monthlyGoal: 1000,
    // Shows "Goal achieved! Exceeded by $250"
  }}
/>
```

### New Provider (First Month)

```jsx
<EarningsSummaryWidget
  earnings={{
    thisMonth: 75,
    lastMonth: 0,
    availableBalance: 0,
    pendingEarnings: 75,
    // Shows growth but handles division by zero
  }}
/>
```

### Payout Today

```jsx
<EarningsSummaryWidget
  earnings={{
    nextPayoutDate: new Date(), // Today
    // Badge shows "Today"
  }}
/>
```

## Interactions

### View All Earnings Button

Clicking the "View All Earnings" button should navigate to the full earnings page:

```jsx
// In the component, update the onClick handler:
onClick={() => {
  navigate('/provider/earnings');
}}
```

## Testing

The component includes `data-testid="earnings-widget"` for testing:

```javascript
// Example test
const widget = screen.getByTestId('earnings-widget');
expect(widget).toBeInTheDocument();
```

## API Integration

### Expected API Response Format

```json
{
  "earnings": {
    "current_month": 450,
    "previous_month": 300,
    "available_balance": 320,
    "pending_earnings": 130,
    "next_payout_date": "2024-12-20T00:00:00Z",
    "monthly_goal": 500
  }
}
```

### Data Transformation

```javascript
// Transform API response to component format
const earnings = {
  thisMonth: apiData.earnings.current_month,
  lastMonth: apiData.earnings.previous_month,
  availableBalance: apiData.earnings.available_balance,
  pendingEarnings: apiData.earnings.pending_earnings,
  nextPayoutDate: new Date(apiData.earnings.next_payout_date),
  monthlyGoal: apiData.earnings.monthly_goal,
};
```

## Accessibility

- Clear visual hierarchy with semantic headings
- Color is not the only indicator (icons + text for trends)
- Touch targets meet 44px minimum
- Progress bar includes text percentage
- Readable color contrasts (WCAG AA compliant)

## Related Components

- `OnboardingProgressWidget` - Similar card-based widget
- `CalendarWidget` - Another dashboard widget
- `ToDoListWidget` - Dashboard widget pattern

## Future Enhancements

1. **Earnings History Chart**: Add sparkline showing last 6 months
2. **Goal Setting**: Allow providers to set/edit monthly goal
3. **Payout Preferences**: Link to payout settings
4. **Tax Summary**: Year-to-date earnings for tax purposes
5. **Performance Metrics**: Average earnings per session, hourly rate

## Notes

- Mock data is included as default for development
- Remember to replace `console.log` with actual navigation
- Component is mobile-first responsive
- Uses shadcn/ui Card, Button, Badge, and Progress components
- Currency formatting uses US locale by default
