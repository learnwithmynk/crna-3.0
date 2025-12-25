# OnboardingStep4Stripe Component

Step 4 of the provider onboarding flow - "Get Paid". Handles Stripe Connect setup for marketplace payouts with clear commission breakdown and tax information.

## Features

### 1. Commission Breakdown (Industry-Leading Rate)
- **Visual calculator** showing:
  - Service price (example: $100)
  - Platform fee (20%): -$20
  - Provider receives: $80
- **Comparison callout**: "Other platforms take 35%+"
- **Badge highlight**: "Save 15%" compared to competitors
- Emphasizes this is one of the lowest rates in the industry

### 2. Stripe Connect Integration
Three possible states:

#### Not Connected (Initial)
- Alert with "Connect with Stripe" CTA button
- Opens Stripe Connect Express onboarding flow
- Explanation of secure payouts

#### Pending (Setup Started)
- Yellow alert showing incomplete setup
- "Complete Your Stripe Setup" CTA
- Continues Stripe onboarding where user left off

#### Connected (Complete)
- Green success state with checkmark
- Shows last 4 digits of connected bank account
- "Change account" link for updates

### 3. Payout Information
- **Schedule**: Every 2 weeks (1st and 15th of month)
- **Method**: Direct bank transfer
- **Provider**: Powered by Stripe badge
- Trust indicators (used by millions of businesses)

### 4. Tax Information Alert
- Warning-styled alert box
- Key points:
  - Independent contractor status
  - 1099 form for earnings over $600
  - Recommendation: Set aside 20-30% for taxes
  - Suggestion to consult tax professional

### 5. Navigation
- **Back button**: Returns to Step 3 (Services/Availability)
- **Skip for now**: Optional skip (with warning that payments can't be received)
- **Continue**: Proceeds to next step
- Info alert when skipping: Can connect later from dashboard

## Props

```jsx
{
  data: {
    stripeConnected: boolean,      // Whether Stripe account is fully connected
    stripePending: boolean,         // Whether setup was started but not completed
    bankLastFour: string | null,   // Last 4 digits of bank account (if connected)
  },
  onChange: (updates) => void,     // Callback when data changes
  onNext: () => void,              // Callback to proceed to next step
  onBack: () => void,              // Callback to return to previous step
  onConnectStripe: () => void,     // Callback to initiate Stripe Connect flow
}
```

## Usage

```jsx
import { OnboardingStep4Stripe } from '@/components/features/provider/OnboardingStep4Stripe';

function ProviderOnboarding() {
  const [stepData, setStepData] = useState({
    stripeConnected: false,
    stripePending: false,
    bankLastFour: null,
  });

  const handleConnectStripe = async () => {
    // 1. Call backend API to create Stripe Connect account link
    const response = await fetch('/api/stripe/create-connect-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    const { url } = await response.json();

    // 2. Open Stripe Connect in new window or redirect
    window.location.href = url;

    // 3. Handle callback from Stripe (set stripePending = true)
    setStepData(prev => ({ ...prev, stripePending: true }));
  };

  const handleStripeCallback = (accountId) => {
    // Called after Stripe redirects back
    // Verify account and update state
    setStepData({
      stripeConnected: true,
      stripePending: false,
      bankLastFour: '4242', // Get from Stripe API
    });
  };

  return (
    <OnboardingStep4Stripe
      data={stepData}
      onChange={setStepData}
      onNext={() => console.log('Go to next step')}
      onBack={() => console.log('Go to previous step')}
      onConnectStripe={handleConnectStripe}
    />
  );
}
```

## Validation

- **Optional but recommended**: Stripe connection is not required to proceed
- **Skip option**: Shows warning that payments can't be received until connected
- **Can complete later**: Users can connect Stripe from provider dashboard after onboarding

## State Flow

```
Not Connected → (Click "Connect with Stripe") → Pending → (Complete Stripe setup) → Connected
                                                   ↓
                                        Can skip and complete later
```

## Design Notes

### Visual Hierarchy
1. **Commission breakdown** (highlighted in yellow card) - Key differentiator
2. **Stripe connection status** - Primary action
3. **Payout info** - Supporting details
4. **Tax alert** - Important disclaimer

### Color Coding
- **Yellow background**: Commission breakdown card (brand primary color)
- **Green**: Connected state, success indicators
- **Yellow/Amber**: Pending state, warnings
- **Gray**: Not connected state
- **Orange**: Tax information alert

### Responsive Design
- Full-width cards on mobile
- Side-by-side layout on desktop
- Touch-friendly buttons (min 44px height)

## Integration Notes

### Stripe Connect Flow
1. Backend creates Stripe Connect account link via Stripe API
2. User redirects to Stripe to complete onboarding (express or standard)
3. Stripe redirects back to callback URL with account_id
4. Backend verifies account and stores in database
5. Frontend updates to "connected" state

### API Endpoints Needed
- `POST /api/stripe/create-connect-link` - Initiate connection
- `GET /api/stripe/account-status` - Check connection status
- `POST /api/stripe/refresh-link` - Get new link if expired

### Database Fields
- `stripe_account_id` - Stripe Connect account ID
- `stripe_account_status` - pending, active, restricted
- `stripe_onboarding_complete` - boolean
- `bank_account_last_four` - for display

## See Also
- `/docs/skills/stripe-connect-integration.md` - Full Stripe Connect guide
- `/docs/project/marketplace/payout-system.md` - Marketplace payout logic
- `OnboardingProgressWidget.jsx` - Overall onboarding progress tracker
