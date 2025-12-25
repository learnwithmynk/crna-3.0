# Stripe Connect Integration

How Stripe Connect works for the SRNA Marketplace payouts.

---

## Overview

The CRNA Club Marketplace allows SRNAs (Student Registered Nurse Anesthetists) to offer services like mock interviews, essay reviews, and coaching to applicants. **Stripe Connect** handles the payment splitting between the platform and providers.

**Key Terms:**
- **Platform:** The CRNA Club (receives platform fee)
- **Connected Account:** SRNA provider (receives payout)
- **Destination Charge:** Payment goes to platform, portion transferred to provider

---

## Why Stripe Connect?

| Feature | Benefit |
|---------|---------|
| Compliant payouts | Stripe handles 1099s and tax reporting |
| Express accounts | Easy provider onboarding (hosted by Stripe) |
| Automatic transfers | No manual payout processing |
| Dispute handling | Stripe mediates chargebacks |
| Global support | Works internationally |

---

## Account Type: Express

We use **Stripe Connect Express** accounts for SRNAs:

| Type | Best For | Our Choice |
|------|----------|------------|
| Standard | Large businesses managing own Stripe | No |
| Express | Marketplaces with provider onboarding | **Yes** |
| Custom | Full UI control, complex compliance | No |

**Why Express:**
- Stripe hosts the onboarding UI
- Stripe handles identity verification
- Stripe provides the payout dashboard
- Minimal compliance burden on CRNA Club
- SRNAs can view their earnings on Stripe dashboard

---

## Platform Fee Structure

```
Service Price: $75 (Mock Interview)
Platform Fee: 25% = $18.75
SRNA Payout:  75% = $56.25
Stripe Fee:   ~2.9% + $0.30 = $2.48 (from platform portion)

Net to CRNA Club: $18.75 - $2.48 = $16.27
Net to SRNA: $56.25
```

**Fee configuration:**
```javascript
const PLATFORM_FEE_PERCENT = 25; // 25% platform fee
```

---

## Provider Onboarding Flow

### 1. SRNA Applies to Be Provider

```
SRNA Dashboard → "Become a Provider" → Application Form
```

Application captures:
- CRNA program name and year
- Areas of expertise
- Proposed services
- Agreement to terms

### 2. Admin Approves Application

```
Admin Dashboard → Provider Applications → Review → Approve
```

### 3. Stripe Onboarding Link Generated

```javascript
// Backend creates Express account and onboarding link
const account = await stripe.accounts.create({
  type: 'express',
  country: 'US',
  email: srna.email,
  capabilities: {
    card_payments: { requested: true },
    transfers: { requested: true },
  },
  metadata: {
    crna_user_id: srna.id,
    provider_id: provider.id,
  },
});

const accountLink = await stripe.accountLinks.create({
  account: account.id,
  refresh_url: 'https://thecrnaclub.com/provider/onboarding/refresh',
  return_url: 'https://thecrnaclub.com/provider/onboarding/complete',
  type: 'account_onboarding',
});

// Redirect SRNA to: accountLink.url
```

### 4. SRNA Completes Stripe Onboarding

Stripe-hosted flow collects:
- Legal name and DOB
- Address
- SSN (last 4 or full for verification)
- Bank account for payouts
- Identity verification (document upload if needed)

### 5. Stripe Webhook Confirms Account Ready

```javascript
// Webhook: account.updated
if (account.charges_enabled && account.payouts_enabled) {
  // Mark provider as active
  await updateProvider(account.metadata.provider_id, {
    stripeAccountId: account.id,
    payoutsEnabled: true,
    status: 'active',
  });
}
```

---

## Payment Flow

### 1. Applicant Books Service

```
Marketplace → Service Detail → Book Now → Checkout
```

### 2. Create Payment Intent with Transfer

```javascript
// Backend: Create destination charge
const paymentIntent = await stripe.paymentIntents.create({
  amount: 7500, // $75.00 in cents
  currency: 'usd',
  customer: applicant.stripeCustomerId,
  payment_method: paymentMethodId,
  confirm: true,

  // Key part: destination charge with platform fee
  application_fee_amount: 1875, // $18.75 platform fee (25%)
  transfer_data: {
    destination: provider.stripeAccountId, // SRNA's Express account
  },

  metadata: {
    booking_id: booking.id,
    service_id: service.id,
    provider_id: provider.id,
    applicant_id: applicant.id,
  },
});
```

### 3. Payment Confirmation

```javascript
// Webhook: payment_intent.succeeded
async function handlePaymentSuccess(paymentIntent) {
  const bookingId = paymentIntent.metadata.booking_id;

  await updateBooking(bookingId, {
    status: 'confirmed',
    paymentIntentId: paymentIntent.id,
    paidAt: new Date(),
  });

  // Notify provider
  await sendNotification(paymentIntent.metadata.provider_id, {
    type: 'new_booking',
    message: 'You have a new booking!',
  });

  // Award points to applicant
  await awardPoints(paymentIntent.metadata.applicant_id, 5, 'booked_service');
}
```

---

## Payout Schedule

Stripe Express accounts have automatic payouts:

| Schedule | Description |
|----------|-------------|
| Daily | Funds available next business day |
| Weekly | Funds transfer every Monday |
| Monthly | Funds transfer on 1st of month |

**Default:** Daily automatic payouts (Stripe default for Express)

SRNAs can adjust their payout schedule in their Stripe Express dashboard.

---

## Refunds

### Full Refund

```javascript
const refund = await stripe.refunds.create({
  payment_intent: paymentIntent.id,
  reverse_transfer: true, // Claws back from SRNA account
  refund_application_fee: true, // Refunds platform fee too
});
```

### Partial Refund (e.g., late cancellation, 50% refund)

```javascript
const refund = await stripe.refunds.create({
  payment_intent: paymentIntent.id,
  amount: 3750, // $37.50 (50% of $75)
  reverse_transfer: true,
  refund_application_fee: true,
});
```

---

## API Endpoints (Backend)

### Provider Onboarding

```
POST /crna/v1/providers/apply
Request:
{
  "programName": "Duke CRNA Program",
  "programYear": 2,
  "expertiseAreas": ["mock_interviews", "essay_review"],
  "proposedServices": [...]
}

Response (201):
{
  "success": true,
  "applicationId": "app_001",
  "status": "pending_review"
}
```

```
POST /crna/v1/providers/onboarding-link
(After admin approval)

Response (200):
{
  "url": "https://connect.stripe.com/express/onboarding/..."
}
```

```
GET /crna/v1/providers/me
Response (200):
{
  "id": "provider_001",
  "status": "active",
  "stripeAccountId": "acct_xxx",
  "payoutsEnabled": true,
  "services": [...],
  "totalEarnings": 1250.00,
  "pendingPayouts": 75.00
}
```

### Booking & Payment

```
POST /crna/v1/bookings
Request:
{
  "serviceId": "service_001",
  "providerId": "provider_001",
  "scheduledAt": "2024-12-15T14:00:00Z",
  "paymentMethodId": "pm_xxx"
}

Response (201):
{
  "success": true,
  "booking": {
    "id": "booking_001",
    "status": "confirmed",
    "paymentStatus": "paid"
  }
}
```

```
POST /crna/v1/bookings/:id/refund
Request:
{
  "reason": "provider_unavailable",
  "amount": "full" // or specific amount in cents
}

Response (200):
{
  "success": true,
  "refundId": "re_xxx",
  "amountRefunded": 7500
}
```

### Earnings (Provider Dashboard)

```
GET /crna/v1/providers/me/earnings
Query params:
- startDate (string)
- endDate (string)

Response (200):
{
  "totalEarnings": 1250.00,
  "pendingPayouts": 75.00,
  "completedBookings": 18,
  "thisMonth": 225.00,
  "transactions": [
    {
      "id": "txn_001",
      "type": "payout",
      "amount": 56.25,
      "serviceName": "Mock Interview (30 min)",
      "applicantName": "Sarah J.",
      "date": "2024-12-01",
      "status": "completed"
    }
  ]
}
```

---

## React Integration

### useProvider Hook

```jsx
// src/hooks/useProvider.js

export function useProvider() {
  const [provider, setProvider] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProvider() {
      try {
        const res = await fetch('/crna/v1/providers/me');
        if (res.ok) {
          setProvider(await res.json());
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetchProvider();
  }, []);

  const startOnboarding = async () => {
    const res = await fetch('/crna/v1/providers/onboarding-link', {
      method: 'POST',
    });
    const { url } = await res.json();
    window.location.href = url;
  };

  return {
    provider,
    isLoading,
    isProvider: !!provider,
    isActive: provider?.status === 'active',
    payoutsEnabled: provider?.payoutsEnabled,
    startOnboarding,
  };
}
```

### Provider Status Badge

```jsx
// src/components/features/provider/provider-status-badge.jsx

export function ProviderStatusBadge({ status, payoutsEnabled }) {
  if (status === 'active' && payoutsEnabled) {
    return (
      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
        Active Provider
      </span>
    );
  }

  if (status === 'active' && !payoutsEnabled) {
    return (
      <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
        Complete Payout Setup
      </span>
    );
  }

  if (status === 'pending_review') {
    return (
      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
        Application Under Review
      </span>
    );
  }

  return null;
}
```

### Checkout with Stripe

```jsx
// src/components/features/marketplace/booking-checkout.jsx

import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.VITE_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm({ booking, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setError(null);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message);
      setIsProcessing(false);
      return;
    }

    // Create booking and get client secret from backend
    const res = await fetch('/crna/v1/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        serviceId: booking.serviceId,
        providerId: booking.providerId,
        scheduledAt: booking.scheduledAt,
      }),
    });

    const { clientSecret } = await res.json();

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/marketplace/booking-confirmed`,
      },
    });

    if (confirmError) {
      setError(confirmError.message);
    } else {
      onSuccess();
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full mt-4"
      >
        {isProcessing ? 'Processing...' : `Pay $${(booking.amount / 100).toFixed(2)}`}
      </Button>
    </form>
  );
}

export function BookingCheckout({ booking, onSuccess }) {
  const options = {
    mode: 'payment',
    amount: booking.amount,
    currency: 'usd',
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#f6ff88',
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm booking={booking} onSuccess={onSuccess} />
    </Elements>
  );
}
```

---

## Webhooks

Backend must handle these Stripe webhooks:

### Account Webhooks

```javascript
// account.updated - Provider account status changed
case 'account.updated':
  const account = event.data.object;
  await updateProviderStripeStatus(account.metadata.provider_id, {
    chargesEnabled: account.charges_enabled,
    payoutsEnabled: account.payouts_enabled,
    requirements: account.requirements,
  });
  break;
```

### Payment Webhooks

```javascript
// payment_intent.succeeded - Payment completed
case 'payment_intent.succeeded':
  await handlePaymentSuccess(event.data.object);
  break;

// payment_intent.payment_failed - Payment failed
case 'payment_intent.payment_failed':
  await handlePaymentFailure(event.data.object);
  break;

// charge.refunded - Refund processed
case 'charge.refunded':
  await handleRefund(event.data.object);
  break;
```

### Transfer Webhooks

```javascript
// transfer.created - Money sent to provider
case 'transfer.created':
  const transfer = event.data.object;
  await recordProviderPayout(transfer.destination, transfer.amount);
  break;

// payout.paid - Provider received bank deposit
case 'payout.paid':
  await markPayoutComplete(event.data.object);
  break;
```

---

## Testing

### Test Mode

Use Stripe test mode during development:

```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
```

### Test Cards

| Card Number | Scenario |
|-------------|----------|
| 4242 4242 4242 4242 | Success |
| 4000 0000 0000 0002 | Decline |
| 4000 0000 0000 9995 | Insufficient funds |
| 4000 0025 0000 3155 | Requires authentication |

### Test Accounts

For Express account testing:
- Use `test@example.com` in onboarding
- Skip identity verification in test mode
- Bank account: `000123456789` with routing `110000000`

### Webhook Testing

Use Stripe CLI for local webhook testing:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Returns webhook signing secret:
# whsec_xxx
```

---

## Security Considerations

### Protect API Keys

```
# Never expose in frontend
STRIPE_SECRET_KEY=sk_live_xxx

# OK for frontend (read-only operations)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
```

### Verify Webhook Signatures

```javascript
const sig = request.headers['stripe-signature'];
let event;

try {
  event = stripe.webhooks.constructEvent(
    request.body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET
  );
} catch (err) {
  return response.status(400).send(`Webhook Error: ${err.message}`);
}
```

### Validate Payment Amounts

Always calculate amounts server-side:

```javascript
// BAD - trusting client amount
const amount = req.body.amount;

// GOOD - calculate from service price
const service = await getService(req.body.serviceId);
const amount = service.priceInCents;
```

---

## Error Handling

### Common Errors

| Error Code | Meaning | Action |
|------------|---------|--------|
| `account_invalid` | Connected account issue | Re-verify onboarding |
| `card_declined` | Payment declined | Ask for different card |
| `insufficient_funds` | Not enough balance | Ask for different card |
| `invalid_request` | API issue | Check request params |
| `rate_limit` | Too many requests | Implement backoff |

### User-Friendly Messages

```javascript
function getPaymentErrorMessage(error) {
  switch (error.code) {
    case 'card_declined':
      return 'Your card was declined. Please try a different card.';
    case 'insufficient_funds':
      return 'Insufficient funds. Please try a different card.';
    case 'expired_card':
      return 'Your card has expired. Please use a different card.';
    default:
      return 'Payment failed. Please try again or contact support.';
  }
}
```

---

## Migration Considerations

If migrating from another payment system:

1. **Don't migrate card data** - Have users re-enter payment methods
2. **Set up provider accounts fresh** - Each SRNA goes through Stripe onboarding
3. **Test thoroughly** - Run parallel systems during transition
4. **Communicate timeline** - Give providers advance notice

---

## Resources

- [Stripe Connect Documentation](https://stripe.com/docs/connect)
- [Express Account Guide](https://stripe.com/docs/connect/express-accounts)
- [Destination Charges](https://stripe.com/docs/connect/destination-charges)
- [Testing Connect](https://stripe.com/docs/connect/testing)
- [React Stripe.js](https://stripe.com/docs/stripe-js/react)
