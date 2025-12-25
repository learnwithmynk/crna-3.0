# EarningsSummaryWidget - Implementation Guide

## Quick Start

### 1. Import the Component

```jsx
import { EarningsSummaryWidget } from '@/components/features/provider';
```

### 2. Use with Mock Data (Development)

```jsx
function ProviderDashboard() {
  return (
    <div className="p-6">
      <EarningsSummaryWidget />
    </div>
  );
}
```

The component includes built-in mock data, so you can start using it immediately.

## Integration Steps

### Step 1: Add to Provider Dashboard Page

Location: `/src/pages/provider/ProviderDashboardPage.jsx`

```jsx
import { EarningsSummaryWidget, OnboardingProgressWidget } from '@/components/features/provider';

export function ProviderDashboardPage() {
  return (
    <PageWrapper>
      <div className="space-y-6">
        {/* Top section - Onboarding if incomplete */}
        <OnboardingProgressWidget currentStep={3} completedSteps={[1, 2]} />

        {/* Dashboard widgets grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EarningsSummaryWidget />
          {/* Other widgets */}
        </div>
      </div>
    </PageWrapper>
  );
}
```

### Step 2: Create API Hook (For Backend Integration)

Location: `/src/hooks/useProviderEarnings.js`

```jsx
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useProviderEarnings() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['provider-earnings-summary'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from('provider_earnings_summary')
        .select('*')
        .eq('provider_id', user.id)
        .single();

      if (error) throw error;

      return {
        thisMonth: data.current_month_earnings,
        lastMonth: data.previous_month_earnings,
        availableBalance: data.available_balance,
        pendingEarnings: data.pending_earnings,
        nextPayoutDate: new Date(data.next_payout_date),
        monthlyGoal: data.monthly_goal,
      };
    },
  });

  return { earnings: data, isLoading, error, refetch };
}
```

### Step 3: Use with API Data

```jsx
import { EarningsSummaryWidget } from '@/components/features/provider';
import { useProviderEarnings } from '@/hooks/useProviderEarnings';

function ProviderDashboard() {
  const { earnings, isLoading, error } = useProviderEarnings();

  if (isLoading) {
    return <EarningsWidgetSkeleton />;
  }

  if (error) {
    return <ErrorMessage message="Failed to load earnings" />;
  }

  return <EarningsSummaryWidget earnings={earnings} />;
}
```

### Step 4: Add Navigation Handler

Update the "View All Earnings" button to navigate to the full earnings page:

```jsx
// In ProviderDashboard component
import { useNavigate } from 'react-router-dom';

function ProviderDashboard() {
  const navigate = useNavigate();
  const { earnings } = useProviderEarnings();

  // Clone earnings and add navigation handler
  const earningsWithNav = {
    ...earnings,
    onViewAll: () => navigate('/provider/earnings'),
  };

  return <EarningsSummaryWidget earnings={earningsWithNav} />;
}
```

**OR** modify the component to accept an `onViewAll` prop:

```jsx
// In EarningsSummaryWidget.jsx
<Button
  variant="outline"
  className="w-full group"
  onClick={onViewAll || (() => console.log('Navigate to earnings page'))}
>
```

## Database Schema (Backend Team)

### Table: `provider_earnings_summary`

```sql
CREATE TABLE provider_earnings_summary (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID REFERENCES profiles(id) NOT NULL,
  current_month_earnings DECIMAL(10,2) DEFAULT 0,
  previous_month_earnings DECIMAL(10,2) DEFAULT 0,
  available_balance DECIMAL(10,2) DEFAULT 0,
  pending_earnings DECIMAL(10,2) DEFAULT 0,
  next_payout_date TIMESTAMP,
  monthly_goal DECIMAL(10,2),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(provider_id)
);

-- Index for fast lookups
CREATE INDEX idx_provider_earnings_provider_id
  ON provider_earnings_summary(provider_id);
```

### Calculation Logic (Backend)

The backend should calculate these values:

**current_month_earnings**: Sum of all completed session earnings in current month
```sql
SELECT COALESCE(SUM(amount), 0)
FROM provider_transactions
WHERE provider_id = $1
  AND status = 'completed'
  AND DATE_TRUNC('month', completed_at) = DATE_TRUNC('month', NOW());
```

**previous_month_earnings**: Sum of all completed session earnings in previous month
```sql
SELECT COALESCE(SUM(amount), 0)
FROM provider_transactions
WHERE provider_id = $1
  AND status = 'completed'
  AND DATE_TRUNC('month', completed_at) = DATE_TRUNC('month', NOW() - INTERVAL '1 month');
```

**available_balance**: Earnings ready for payout (completed but not yet paid out)
```sql
SELECT COALESCE(SUM(amount), 0)
FROM provider_transactions
WHERE provider_id = $1
  AND status = 'completed'
  AND payout_status = 'pending';
```

**pending_earnings**: Earnings from sessions not yet completed
```sql
SELECT COALESCE(SUM(amount), 0)
FROM provider_transactions
WHERE provider_id = $1
  AND status = 'pending';
```

**next_payout_date**: Based on payout schedule (e.g., every 15th and 30th)
```sql
-- If we're before the 15th, next payout is the 15th
-- If we're on/after the 15th, next payout is the 30th (or next month's 15th)
```

## API Endpoint (Backend Team)

### GET /api/provider/earnings/summary

**Response:**
```json
{
  "current_month_earnings": 450.00,
  "previous_month_earnings": 300.00,
  "available_balance": 320.00,
  "pending_earnings": 130.00,
  "next_payout_date": "2024-12-20T00:00:00Z",
  "monthly_goal": 500.00
}
```

**Error Response:**
```json
{
  "error": "Not authorized",
  "code": 401
}
```

## Testing

### Unit Tests

```jsx
import { render, screen } from '@testing-library/react';
import { EarningsSummaryWidget } from './EarningsSummaryWidget';

describe('EarningsSummaryWidget', () => {
  it('renders with mock data', () => {
    render(<EarningsSummaryWidget />);
    expect(screen.getByTestId('earnings-widget')).toBeInTheDocument();
  });

  it('shows positive growth indicator', () => {
    const earnings = {
      thisMonth: 450,
      lastMonth: 300,
      availableBalance: 320,
      pendingEarnings: 130,
      nextPayoutDate: new Date('2024-12-20'),
      monthlyGoal: 500,
    };
    render(<EarningsSummaryWidget earnings={earnings} />);
    expect(screen.getByText(/\+\$150/)).toBeInTheDocument();
  });

  it('hides goal section when not set', () => {
    const earnings = {
      thisMonth: 450,
      lastMonth: 300,
      availableBalance: 320,
      pendingEarnings: 130,
      nextPayoutDate: new Date('2024-12-20'),
      monthlyGoal: null,
    };
    render(<EarningsSummaryWidget earnings={earnings} />);
    expect(screen.queryByText('Monthly Goal')).not.toBeInTheDocument();
  });
});
```

### Integration Tests

```jsx
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProviderDashboard } from './ProviderDashboard';

describe('ProviderDashboard with EarningsSummaryWidget', () => {
  it('loads and displays earnings data', async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <ProviderDashboard />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('earnings-widget')).toBeInTheDocument();
    });
  });
});
```

## Loading States

Create a skeleton loader:

```jsx
function EarningsWidgetSkeleton() {
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
          <div className="w-32 h-5 bg-gray-200 rounded animate-pulse" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 rounded-xl bg-gray-100 animate-pulse">
          <div className="w-24 h-4 bg-gray-200 rounded mb-2" />
          <div className="w-32 h-10 bg-gray-200 rounded" />
        </div>
        {/* More skeleton elements */}
      </CardContent>
    </Card>
  );
}
```

## Error States

```jsx
function EarningsErrorDisplay({ onRetry }) {
  return (
    <Card className="shadow-md border-red-200">
      <CardContent className="p-6 text-center">
        <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
        <h3 className="font-semibold mb-1">Failed to Load Earnings</h3>
        <p className="text-sm text-gray-600 mb-4">
          We couldn't load your earnings data. Please try again.
        </p>
        <Button onClick={onRetry} variant="outline">
          Retry
        </Button>
      </CardContent>
    </Card>
  );
}
```

## Best Practices

1. **Always handle loading states** - Show skeleton while data loads
2. **Handle errors gracefully** - Provide retry functionality
3. **Update in real-time** - Refetch after transactions complete
4. **Cache appropriately** - Use React Query's caching (5 minute stale time)
5. **Optimize re-renders** - Memoize if used in complex layouts

## Common Issues & Solutions

### Issue: "Cannot read property 'thisMonth' of undefined"
**Solution**: Make sure `earnings` is defined or component uses default mock data

### Issue: Next payout shows negative days
**Solution**: Ensure `nextPayoutDate` is in the future, not the past

### Issue: Goal progress shows > 100%
**Solution**: Component caps at 100% for visual bar, but shows exceeded amount in text

### Issue: Currency shows decimals (e.g., $450.50)
**Solution**: Component formats to whole dollars by default. To show cents, modify `formatCurrency`:
```js
minimumFractionDigits: 2,
maximumFractionDigits: 2,
```

## Performance Optimization

```jsx
import { memo } from 'react';

// Memoize if parent re-renders frequently
const MemoizedEarningsWidget = memo(EarningsSummaryWidget, (prevProps, nextProps) => {
  return JSON.stringify(prevProps.earnings) === JSON.stringify(nextProps.earnings);
});
```

## Related Pages to Build

1. **Full Earnings Page** (`/provider/earnings`)
   - Transaction history table
   - Earnings charts/graphs
   - Payout history
   - Tax documents

2. **Payout Settings** (`/provider/settings/payouts`)
   - Stripe account management
   - Payout schedule preferences
   - Bank account details

3. **Goal Settings**
   - Set monthly earning goals
   - Track progress over time
   - Goal suggestions based on history

## Next Steps for Development Team

1. Create Supabase table and functions for earnings calculations
2. Build API endpoint for earnings summary
3. Implement `useProviderEarnings` hook with real data
4. Create full earnings page with transaction history
5. Add real-time updates when new transactions complete
6. Implement payout scheduling system
7. Add goal setting functionality
