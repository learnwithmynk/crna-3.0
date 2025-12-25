# EarningsSummaryWidget Component

## Purpose

The `EarningsSummaryWidget` provides SRNA providers with a comprehensive, at-a-glance view of their marketplace earnings directly on their dashboard. It combines current earnings, growth trends, payout information, and goal tracking into a single, visually appealing widget.

## Business Context

For SRNA providers, understanding their earnings is critical for:
- **Financial Planning**: Knowing when money will be available
- **Performance Tracking**: Seeing growth month-over-month
- **Goal Setting**: Staying motivated toward monthly earning targets
- **Cash Flow Management**: Understanding available vs pending balances

This widget serves as the primary earnings touchpoint in the provider dashboard, with a link to the full earnings page for detailed transaction history.

## Key Features

### 1. Current Month Earnings (Primary Display)
- Large, prominent dollar amount with gradient green background
- Immediately shows provider's current month performance
- Most important metric displayed first and largest

### 2. Growth Comparison
- Automatic calculation of month-over-month change
- Visual badge with trend indicator (up/down arrow)
- Shows both dollar amount and percentage change
- Green for positive growth, red for decline
- Handles edge cases (e.g., first month with $0 last month)

### 3. Monthly Goal Progress (Optional)
- Visual progress bar showing goal completion
- Current/goal amount display
- Remaining amount and percentage to goal
- Special messaging when goal is exceeded
- Only shows if provider has set a goal

### 4. Available Balance
- Money that's been earned and is ready for payout
- Distinct from pending earnings
- Shows provider what they can actually receive

### 5. Pending Earnings
- Money from sessions that haven't completed yet
- Important for providers to know their "pipeline"
- Helps with financial forecasting

### 6. Next Payout Information
- Clear date display
- Countdown in days (or "Today" if payout is today)
- Purple accent to draw attention
- Helps providers know when to expect money

### 7. Quick Navigation
- "View All Earnings" button
- Links to full earnings page with transaction history
- Clear call-to-action for deeper analysis

## Data Model

```typescript
interface EarningsData {
  thisMonth: number;          // Current month total earnings
  lastMonth: number;          // Previous month total earnings
  availableBalance: number;   // Ready for payout
  pendingEarnings: number;    // From incomplete sessions
  nextPayoutDate: Date;       // When next payout occurs
  monthlyGoal?: number;       // Optional earning goal
}
```

## Component Architecture

### Props
- `earnings` (object): Earnings data (uses mock data as default)
- `className` (string): Additional CSS classes for container

### Dependencies
- shadcn/ui components: Card, Button, Badge, Progress
- Lucide React icons: DollarSign, TrendingUp, TrendingDown, Calendar, Clock, ArrowRight
- Utility function: `cn` for class merging

### Mock Data
Includes comprehensive mock data for development:
```javascript
{
  thisMonth: 450,
  lastMonth: 300,
  availableBalance: 320,
  pendingEarnings: 130,
  nextPayoutDate: new Date('2024-12-20'),
  monthlyGoal: 500
}
```

## Visual Design

### Color Strategy
- **Green Gradient**: Used for main earnings display (positive, money)
- **Green Badges**: Positive growth indicators
- **Red Badges**: Negative growth indicators
- **Purple Accent**: Next payout section (draws attention)
- **Orange Icon**: Pending earnings (warning/waiting state)
- **White Cards**: Balance displays (clean, clear)

### Layout Strategy
- **Top**: Most important metric (current month) with gradient
- **Middle**: Goal progress (if applicable)
- **Grid**: Available and pending side-by-side
- **Bottom**: Next payout info and action button
- **Responsive**: Balance cards stack on mobile, side-by-side on desktop

### Responsive Behavior
- Mobile: Single column, stacked balance cards
- Desktop: Two-column balance grid
- All touch targets meet 44px minimum
- Readable at all screen sizes

## Usage Patterns

### 1. Dashboard Widget (Primary Use)
```jsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <EarningsSummaryWidget />
  <OtherDashboardWidget />
</div>
```

### 2. With API Integration
```jsx
const { data: earnings, isLoading } = useQuery('provider-earnings', fetchEarnings);

if (isLoading) return <WidgetSkeleton />;

return <EarningsSummaryWidget earnings={earnings} />;
```

### 3. Different Provider States

**New Provider (First Month)**
```jsx
<EarningsSummaryWidget
  earnings={{
    thisMonth: 75,
    lastMonth: 0,
    availableBalance: 0,
    pendingEarnings: 75,
    nextPayoutDate: futureDate,
    monthlyGoal: 500
  }}
/>
```

**High Performer (Goal Exceeded)**
```jsx
<EarningsSummaryWidget
  earnings={{
    thisMonth: 1250,
    lastMonth: 900,
    availableBalance: 800,
    pendingEarnings: 450,
    nextPayoutDate: futureDate,
    monthlyGoal: 1000
  }}
/>
```

**No Goal Set**
```jsx
<EarningsSummaryWidget
  earnings={{
    thisMonth: 425,
    lastMonth: 380,
    availableBalance: 290,
    pendingEarnings: 135,
    nextPayoutDate: futureDate,
    monthlyGoal: null  // Progress section won't render
  }}
/>
```

## Calculations & Logic

### Month-over-Month Change
```javascript
const monthOverMonthChange = thisMonth - lastMonth;
const isPositiveGrowth = monthOverMonthChange > 0;
const percentageChange = lastMonth > 0
  ? ((monthOverMonthChange / lastMonth) * 100).toFixed(0)
  : 0;
```

**Edge Case**: First month (lastMonth = 0)
- Shows dollar change but percentage is 0
- Prevents division by zero error

### Goal Progress
```javascript
const goalProgress = monthlyGoal
  ? Math.min((thisMonth / monthlyGoal) * 100, 100)
  : 0;
const goalRemaining = monthlyGoal
  ? Math.max(monthlyGoal - thisMonth, 0)
  : 0;
```

**Key Points**:
- Progress capped at 100% for visual bar
- Remaining amount can't be negative
- Entire section hidden if no goal set

### Payout Countdown
```javascript
const daysUntilPayout = Math.ceil(
  (new Date(nextPayoutDate) - new Date()) / (1000 * 60 * 60 * 24)
);
```

**Display Logic**:
- 0 days: "Today"
- 1 day: "1 day"
- 2+ days: "X days"

### Currency Formatting
```javascript
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
```

**Returns**: "$450" (no cents for whole dollar amounts)

## API Integration

### Endpoint (To Be Implemented)
```
GET /api/provider/earnings/summary
```

### Expected Response
```json
{
  "current_month": 450,
  "previous_month": 300,
  "available_balance": 320,
  "pending_earnings": 130,
  "next_payout_date": "2024-12-20T00:00:00Z",
  "monthly_goal": 500
}
```

### Data Transformation Hook
```javascript
function useProviderEarnings() {
  const { data, isLoading, error } = useQuery(
    'provider-earnings',
    fetchEarnings
  );

  const earnings = data ? {
    thisMonth: data.current_month,
    lastMonth: data.previous_month,
    availableBalance: data.available_balance,
    pendingEarnings: data.pending_earnings,
    nextPayoutDate: new Date(data.next_payout_date),
    monthlyGoal: data.monthly_goal,
  } : null;

  return { earnings, isLoading, error };
}
```

## Testing Considerations

### Test IDs
- Main container: `data-testid="earnings-widget"`

### Test Cases

1. **Renders with mock data**
```javascript
render(<EarningsSummaryWidget />);
expect(screen.getByTestId('earnings-widget')).toBeInTheDocument();
expect(screen.getByText('$450')).toBeInTheDocument();
```

2. **Shows positive growth correctly**
```javascript
const earnings = { thisMonth: 450, lastMonth: 300, ... };
render(<EarningsSummaryWidget earnings={earnings} />);
expect(screen.getByText(/\+\$150/)).toBeInTheDocument();
expect(screen.getByText(/50%/)).toBeInTheDocument();
```

3. **Shows negative growth correctly**
```javascript
const earnings = { thisMonth: 300, lastMonth: 450, ... };
render(<EarningsSummaryWidget earnings={earnings} />);
expect(screen.getByText(/-\$150/)).toBeInTheDocument();
```

4. **Hides goal section when not set**
```javascript
const earnings = { monthlyGoal: null, ... };
render(<EarningsSummaryWidget earnings={earnings} />);
expect(screen.queryByText('Monthly Goal')).not.toBeInTheDocument();
```

5. **Shows goal achievement message**
```javascript
const earnings = { thisMonth: 1200, monthlyGoal: 1000, ... };
render(<EarningsSummaryWidget earnings={earnings} />);
expect(screen.getByText(/Goal achieved/)).toBeInTheDocument();
```

6. **Handles payout today**
```javascript
const earnings = { nextPayoutDate: new Date(), ... };
render(<EarningsSummaryWidget earnings={earnings} />);
expect(screen.getByText('Today')).toBeInTheDocument();
```

## Accessibility

### Color Independence
- Trend direction shown with BOTH icon AND text
- Not reliant on color alone (green/red)
- Clear labels for all sections

### Semantic HTML
- Proper heading hierarchy
- Button for navigation (not div)
- Card structure with semantic sections

### Touch Targets
- All interactive elements ≥ 44px
- Adequate spacing between elements
- Easy to tap on mobile

### Screen Readers
- Currency values include "$" symbol
- Date formats are readable
- Progress bar includes text percentage
- Icon-only elements have labels

## Performance

### Optimizations
- Calculations only run when earnings prop changes
- No unnecessary re-renders
- Efficient date/currency formatting

### Loading States
Component accepts undefined earnings - parent should handle loading:
```jsx
{isLoading ? (
  <WidgetSkeleton />
) : (
  <EarningsSummaryWidget earnings={data} />
)}
```

## Future Enhancements

1. **Earnings Trend Chart**
   - Small sparkline showing last 6 months
   - Inline with month-over-month comparison

2. **Quick Actions**
   - "Request Payout" button (if balance above threshold)
   - "Update Goal" inline editing

3. **Breakdown Toggle**
   - Expand to show earnings by service type
   - Session count alongside dollar amounts

4. **Tax Information**
   - Year-to-date total
   - Link to tax documents

5. **Performance Metrics**
   - Average earnings per session
   - Effective hourly rate
   - Acceptance rate impact on earnings

6. **Goal Setting**
   - Inline goal editor
   - Goal suggestions based on history
   - Multi-month goal tracking

## Related Components

- **OnboardingProgressWidget**: Similar widget pattern
- **CalendarWidget**: Another dashboard widget
- **FullEarningsPage**: Destination for "View All" link
- **PayoutSettingsPage**: Manage payout preferences

## Files

- **Component**: `EarningsSummaryWidget.jsx`
- **Example**: `EarningsSummaryWidget.example.jsx`
- **Docs**: `EarningsSummaryWidget.md`
- **Visual**: `EarningsSummaryWidget.VISUAL.md`
- **Index**: Exported from `provider/index.js`

## Notes for Developers

- Mock data is included - no need to provide it during development
- Remember to replace console.log with actual navigation
- Component is mobile-first responsive
- All UI components from shadcn/ui
- Uses Intl.NumberFormat for currency (US locale default)
- Date handling assumes valid Date objects or ISO strings
- Goal section conditionally renders (check for null/undefined)
