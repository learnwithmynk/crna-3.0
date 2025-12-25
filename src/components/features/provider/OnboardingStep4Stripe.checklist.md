# OnboardingStep4Stripe - Implementation Checklist

## Frontend Tasks

### Component Integration
- [ ] Import `OnboardingStep4Stripe` into onboarding flow
- [ ] Set up state management for `data.stripe` object
- [ ] Implement `onConnectStripe` handler
- [ ] Implement `onChange` handler
- [ ] Implement `onNext` and `onBack` handlers
- [ ] Add component to step 4 in onboarding wizard

### Stripe Connect Flow
- [ ] Create callback route: `/provider/onboarding/stripe/callback`
- [ ] Create refresh route: `/provider/onboarding/stripe/refresh`
- [ ] Handle URL parameters from Stripe redirect
- [ ] Implement account verification on callback
- [ ] Update state after successful connection
- [ ] Handle connection errors gracefully

### State Management
- [ ] Add `stripeConnected` to onboarding data
- [ ] Add `stripePending` to onboarding data
- [ ] Add `bankLastFour` to onboarding data
- [ ] Persist state to localStorage or backend
- [ ] Load existing state on page refresh

### Error Handling
- [ ] Show error toast on connection failure
- [ ] Handle expired account links
- [ ] Handle incomplete onboarding
- [ ] Handle network errors
- [ ] Add retry mechanism

### Testing
- [ ] Test "Not Connected" state displays correctly
- [ ] Test "Connect with Stripe" button works
- [ ] Test redirect to Stripe Connect
- [ ] Test callback handling
- [ ] Test "Pending" state displays correctly
- [ ] Test "Complete Setup" button works
- [ ] Test "Connected" state displays correctly
- [ ] Test bank account display
- [ ] Test "Change account" link
- [ ] Test "Skip for now" flow
- [ ] Test navigation (Back/Continue buttons)
- [ ] Test mobile responsive layout
- [ ] Test with real Stripe test account

---

## Backend Tasks

### API Endpoints
- [ ] Create `POST /api/provider/stripe/connect` endpoint
- [ ] Create `POST /api/provider/stripe/verify` endpoint
- [ ] Create `GET /api/provider/stripe/status` endpoint
- [ ] Create `POST /api/provider/stripe/refresh` endpoint (optional)
- [ ] Add authentication middleware to all endpoints
- [ ] Add rate limiting to prevent abuse

### Stripe Integration
- [ ] Install Stripe Node.js library (`npm install stripe`)
- [ ] Configure Stripe with API keys
- [ ] Implement account creation
- [ ] Implement account link creation
- [ ] Implement account retrieval
- [ ] Implement account verification
- [ ] Set up webhook endpoint for account events
- [ ] Handle `account.updated` webhook
- [ ] Handle `account.external_account.created` webhook

### Database
- [ ] Create `provider_stripe_accounts` table
- [ ] Add indexes for performance
- [ ] Add foreign key constraints
- [ ] Create migration file
- [ ] Run migration
- [ ] Create database query functions
- [ ] Test CRUD operations

### Security
- [ ] Validate all input parameters
- [ ] Sanitize user data
- [ ] Use environment variables for API keys
- [ ] Implement CSRF protection
- [ ] Validate Stripe webhooks with signature
- [ ] Use HTTPS for all Stripe communication
- [ ] Whitelist callback URLs
- [ ] Never expose Stripe secret key to frontend

### Testing
- [ ] Test account creation in Stripe test mode
- [ ] Test account link generation
- [ ] Test callback handling
- [ ] Test account verification
- [ ] Test with various account states
- [ ] Test error scenarios
- [ ] Test webhook handling
- [ ] Test database operations
- [ ] Load test API endpoints

---

## DevOps Tasks

### Environment Setup
- [ ] Add `STRIPE_SECRET_KEY` to production environment
- [ ] Add `STRIPE_PUBLISHABLE_KEY` to production environment
- [ ] Add `STRIPE_WEBHOOK_SECRET` to production environment
- [ ] Configure Stripe webhook URL in dashboard
- [ ] Set up separate test and live Stripe accounts
- [ ] Document environment variables in README

### Deployment
- [ ] Deploy backend API changes
- [ ] Deploy frontend changes
- [ ] Test in staging environment
- [ ] Verify Stripe Connect flow in staging
- [ ] Test webhooks in staging
- [ ] Deploy to production
- [ ] Monitor for errors after deployment

### Monitoring
- [ ] Set up logging for Stripe API calls
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Monitor webhook delivery
- [ ] Set up alerts for failed connections
- [ ] Track success/failure metrics
- [ ] Monitor account creation rate

---

## Documentation

- [ ] Document Stripe Connect setup process
- [ ] Create user guide for providers
- [ ] Document troubleshooting steps
- [ ] Add FAQ section
- [ ] Document backend API
- [ ] Add inline code comments
- [ ] Update project documentation

---

## Compliance & Legal

- [ ] Review Stripe Terms of Service
- [ ] Review platform agreement for providers
- [ ] Ensure tax information disclosure is clear
- [ ] Add 1099 reporting process documentation
- [ ] Ensure compliance with payment processing regulations
- [ ] Add privacy policy updates for payment data
- [ ] Consult legal team if needed

---

## Post-Launch

- [ ] Monitor first 10 provider onboardings
- [ ] Gather user feedback
- [ ] Track completion rate
- [ ] Identify common issues
- [ ] Optimize conversion flow
- [ ] Add analytics tracking
- [ ] A/B test improvements

---

## Quick Reference

### Required Props
```jsx
{
  data: { stripeConnected, stripePending, bankLastFour },
  onChange: Function,
  onNext: Function,
  onBack: Function,
  onConnectStripe: Function
}
```

### API Endpoints
- `POST /api/provider/stripe/connect` - Create account link
- `POST /api/provider/stripe/verify` - Verify connection
- `GET /api/provider/stripe/status` - Get current status

### Database Fields
- `stripe_account_id` - Stripe Connect account ID
- `stripe_connected` - Boolean: fully connected
- `stripe_pending` - Boolean: setup started
- `bank_last_four` - String: last 4 of bank account

### Environment Variables
- `STRIPE_SECRET_KEY` - Stripe API secret key
- `STRIPE_PUBLISHABLE_KEY` - Stripe API public key
- `STRIPE_WEBHOOK_SECRET` - Webhook signature secret
