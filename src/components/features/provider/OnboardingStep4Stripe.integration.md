# OnboardingStep4Stripe - Integration Guide

## Quick Start

### 1. Import the Component

```jsx
import { OnboardingStep4Stripe } from '@/components/features/provider/OnboardingStep4Stripe';
```

### 2. Set Up State Management

```jsx
const [onboardingData, setOnboardingData] = useState({
  // ... other steps data
  stripe: {
    stripeConnected: false,
    stripePending: false,
    bankLastFour: null,
  }
});

const [currentStep, setCurrentStep] = useState(4);
```

### 3. Implement Stripe Connect Handler

```jsx
const handleConnectStripe = async () => {
  try {
    // 1. Create Stripe Connect account link via your backend
    const response = await fetch('/api/provider/stripe/connect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        userId: currentUser.id,
        returnUrl: `${window.location.origin}/provider/onboarding/stripe/callback`,
        refreshUrl: `${window.location.origin}/provider/onboarding/stripe/refresh`,
      }),
    });

    const { url } = await response.json();

    // 2. Update state to pending
    setOnboardingData(prev => ({
      ...prev,
      stripe: { ...prev.stripe, stripePending: true }
    }));

    // 3. Redirect to Stripe Connect
    window.location.href = url;

  } catch (error) {
    console.error('Failed to connect Stripe:', error);
    // Show error toast/notification
  }
};
```

### 4. Handle Stripe Callback

```jsx
// In your onboarding page or callback route
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const accountId = params.get('account_id');

  if (accountId) {
    // Verify the connection with your backend
    verifyStripeConnection(accountId);
  }
}, []);

const verifyStripeConnection = async (accountId) => {
  try {
    const response = await fetch('/api/provider/stripe/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`,
      },
      body: JSON.stringify({ accountId }),
    });

    const { connected, bankLastFour } = await response.json();

    if (connected) {
      setOnboardingData(prev => ({
        ...prev,
        stripe: {
          stripeConnected: true,
          stripePending: false,
          bankLastFour,
        }
      }));
    }
  } catch (error) {
    console.error('Failed to verify Stripe connection:', error);
  }
};
```

### 5. Render the Component

```jsx
{currentStep === 4 && (
  <OnboardingStep4Stripe
    data={onboardingData.stripe}
    onChange={(updates) => setOnboardingData(prev => ({
      ...prev,
      stripe: { ...prev.stripe, ...updates }
    }))}
    onNext={() => setCurrentStep(5)}
    onBack={() => setCurrentStep(3)}
    onConnectStripe={handleConnectStripe}
  />
)}
```

---

## Backend API Endpoints

### POST /api/provider/stripe/connect

Creates a Stripe Connect account link for onboarding.

**Request:**
```json
{
  "userId": "user_123",
  "returnUrl": "https://app.crnaclub.com/provider/onboarding/stripe/callback",
  "refreshUrl": "https://app.crnaclub.com/provider/onboarding/stripe/refresh"
}
```

**Response:**
```json
{
  "url": "https://connect.stripe.com/express/oauth/authorize?..."
}
```

**Backend Implementation (Node.js/Express example):**
```javascript
app.post('/api/provider/stripe/connect', async (req, res) => {
  const { userId, returnUrl, refreshUrl } = req.body;

  try {
    // Get or create Stripe account
    let stripeAccountId = await getStripeAccountId(userId);

    if (!stripeAccountId) {
      const account = await stripe.accounts.create({
        type: 'express',
        country: 'US',
        email: req.user.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
      });
      stripeAccountId = account.id;
      await saveStripeAccountId(userId, stripeAccountId);
    }

    // Create account link
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: refreshUrl,
      return_url: returnUrl,
      type: 'account_onboarding',
    });

    res.json({ url: accountLink.url });
  } catch (error) {
    console.error('Stripe connect error:', error);
    res.status(500).json({ error: 'Failed to create Stripe connection' });
  }
});
```

### POST /api/provider/stripe/verify

Verifies Stripe account connection and retrieves bank details.

**Request:**
```json
{
  "accountId": "acct_123456789"
}
```

**Response:**
```json
{
  "connected": true,
  "bankLastFour": "4242",
  "payoutsEnabled": true,
  "chargesEnabled": true
}
```

**Backend Implementation:**
```javascript
app.post('/api/provider/stripe/verify', async (req, res) => {
  const { accountId } = req.body;

  try {
    // Retrieve account details from Stripe
    const account = await stripe.accounts.retrieve(accountId);

    const connected = account.charges_enabled && account.payouts_enabled;
    const bankLastFour = account.external_accounts?.data[0]?.last4 || null;

    // Update database
    await updateProviderStripeStatus(req.user.id, {
      stripeAccountId: accountId,
      stripeConnected: connected,
      stripePending: !connected,
      bankLastFour,
    });

    res.json({
      connected,
      bankLastFour,
      payoutsEnabled: account.payouts_enabled,
      chargesEnabled: account.charges_enabled,
    });
  } catch (error) {
    console.error('Stripe verify error:', error);
    res.status(500).json({ error: 'Failed to verify Stripe connection' });
  }
});
```

### GET /api/provider/stripe/status

Retrieves current Stripe connection status for a provider.

**Response:**
```json
{
  "stripeConnected": true,
  "stripePending": false,
  "bankLastFour": "4242",
  "accountId": "acct_123456789"
}
```

---

## Database Schema

Add these fields to your `providers` or `users` table:

```sql
ALTER TABLE providers ADD COLUMN stripe_account_id VARCHAR(255);
ALTER TABLE providers ADD COLUMN stripe_connected BOOLEAN DEFAULT FALSE;
ALTER TABLE providers ADD COLUMN stripe_pending BOOLEAN DEFAULT FALSE;
ALTER TABLE providers ADD COLUMN bank_last_four VARCHAR(4);
ALTER TABLE providers ADD COLUMN stripe_onboarding_completed_at TIMESTAMP;
```

Or in Supabase migrations:

```sql
-- Create provider_stripe_accounts table
CREATE TABLE provider_stripe_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  stripe_account_id VARCHAR(255) NOT NULL UNIQUE,
  connected BOOLEAN DEFAULT FALSE,
  pending BOOLEAN DEFAULT FALSE,
  bank_last_four VARCHAR(4),
  charges_enabled BOOLEAN DEFAULT FALSE,
  payouts_enabled BOOLEAN DEFAULT FALSE,
  onboarding_completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_provider_stripe_accounts_provider_id ON provider_stripe_accounts(provider_id);
CREATE INDEX idx_provider_stripe_accounts_stripe_account_id ON provider_stripe_accounts(stripe_account_id);
```

---

## Environment Variables

Add these to your `.env` file:

```bash
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# For production
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...

# Webhook secret for Stripe events
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## Testing

### Test with Stripe Test Mode

Use these test account numbers:

```
Bank Account (US):
  Routing: 110000000
  Account: 000123456789

Bank Account (Instant Verification):
  Routing: 110000000
  Account: 000111111116
```

### Manual Testing Flow

1. **Not Connected State:**
   - Click "Connect with Stripe"
   - Verify redirect to Stripe Connect
   - Fill out Stripe onboarding form
   - Verify redirect back to callback URL

2. **Pending State:**
   - Close Stripe onboarding before completing
   - Verify pending state shows
   - Click "Complete Stripe Setup"
   - Verify returns to where you left off

3. **Connected State:**
   - Complete Stripe onboarding
   - Verify green success state
   - Verify bank last 4 digits display
   - Test "Change account" link

---

## Error Handling

### Common Errors

1. **Account Link Expired**
   - Stripe account links expire after 5 minutes
   - Create new link via refresh_url

2. **Incomplete Onboarding**
   - User closes window before completing
   - Show pending state with "Complete Setup" CTA

3. **Account Restricted**
   - Stripe account has restrictions
   - Show warning and link to Stripe dashboard

### Example Error Handler

```jsx
const handleConnectStripe = async () => {
  try {
    const response = await fetch('/api/provider/stripe/connect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to connect Stripe');
    }

    const { url } = await response.json();
    window.location.href = url;

  } catch (error) {
    console.error('Stripe connection error:', error);

    // Show user-friendly error
    showToast({
      type: 'error',
      title: 'Connection Failed',
      message: 'Unable to connect to Stripe. Please try again.',
    });
  }
};
```

---

## Security Considerations

1. **Always verify on backend** - Never trust client-side account_id
2. **Use HTTPS** - Required for Stripe Connect
3. **Validate callback URLs** - Whitelist return/refresh URLs
4. **Store minimal data** - Only store account_id and last4 in DB
5. **Use webhooks** - Listen for account.updated events

---

## See Also

- [Stripe Connect Documentation](https://stripe.com/docs/connect)
- [Stripe Express Accounts](https://stripe.com/docs/connect/express-accounts)
- `/docs/skills/stripe-connect-integration.md` - Project-specific guide
- `/docs/project/marketplace/payout-system.md` - Marketplace payout logic
