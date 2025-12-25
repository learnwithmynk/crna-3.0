/**
 * Stripe Connect Integration Helpers
 *
 * Handles payment processing for the mentor marketplace using Stripe Connect Express.
 * Manages provider onboarding, payment intents, refunds, and payout calculations.
 *
 * Key features:
 * - Express accounts for providers (quick onboarding, Stripe handles verification)
 * - Payment authorization on booking, capture on completion
 * - 20% platform commission (15% for founding mentors)
 * - Weekly payouts with 48h dispute window
 *
 * Environment variables required:
 * - VITE_STRIPE_PUBLISHABLE_KEY (client-side)
 * - STRIPE_SECRET_KEY (server-side only)
 * - STRIPE_WEBHOOK_SECRET (server-side only)
 *
 * @see /docs/project/marketplace/stripe-connect-decisions.md for full policy details
 */

// =============================================================================
// CONFIGURATION
// =============================================================================

/**
 * Default platform commission rate (20%)
 * Can be overridden per-provider (e.g., 15% for founding mentors)
 */
export const DEFAULT_COMMISSION_RATE = 0.20;

/**
 * Beta/founding mentor commission rate (15%)
 */
export const FOUNDING_MENTOR_COMMISSION_RATE = 0.15;

/**
 * Minimum payout amount ($25)
 */
export const MINIMUM_PAYOUT_AMOUNT = 2500; // In cents

/**
 * Stripe Publishable Key (safe for client-side)
 */
export const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';

// =============================================================================
// PAYMENT CALCULATION HELPERS
// =============================================================================

/**
 * Calculate payment breakdown for a service booking.
 *
 * @param {number} servicePrice - Service price in dollars
 * @param {number} commissionRate - Platform commission rate (0.15 or 0.20)
 * @returns {Object} Payment breakdown in cents
 *
 * @example
 * const breakdown = calculatePaymentBreakdown(100, 0.20);
 * // Returns:
 * // {
 * //   totalCharge: 10000,        // $100.00 - what applicant pays
 * //   platformFee: 2000,          // $20.00 - platform keeps
 * //   providerPayout: 8000,       // $80.00 - provider receives (before Stripe fee)
 * //   stripeFeeEstimate: 320,     // ~$3.20 - Stripe processing (2.9% + $0.30)
 * //   netProviderPayout: 7680,    // ~$76.80 - actual provider receives
 * //   displayBreakdown: { ... }   // Formatted for display
 * // }
 */
export function calculatePaymentBreakdown(servicePrice, commissionRate = DEFAULT_COMMISSION_RATE) {
  // Convert to cents for precision
  const totalChargeCents = Math.round(servicePrice * 100);

  // Platform commission
  const platformFeeCents = Math.round(totalChargeCents * commissionRate);

  // Provider payout (before Stripe processing fee)
  const providerPayoutCents = totalChargeCents - platformFeeCents;

  // Estimate Stripe processing fee (2.9% + $0.30)
  // Note: Actual fee depends on card type, international, etc.
  const stripeFeeEstimate = Math.round(totalChargeCents * 0.029 + 30);

  // Net provider payout after Stripe fee
  // Note: In Connect Express, Stripe fee is deducted from the transfer
  const netProviderPayoutCents = providerPayoutCents - stripeFeeEstimate;

  return {
    // All amounts in cents
    totalCharge: totalChargeCents,
    platformFee: platformFeeCents,
    providerPayout: providerPayoutCents,
    stripeFeeEstimate,
    netProviderPayout: netProviderPayoutCents,

    // Formatted for display
    displayBreakdown: {
      servicePrice: formatCurrency(totalChargeCents),
      platformFee: formatCurrency(platformFeeCents),
      platformFeePercent: `${Math.round(commissionRate * 100)}%`,
      providerReceives: formatCurrency(providerPayoutCents),
      stripeFee: `~${formatCurrency(stripeFeeEstimate)}`,
      netProviderReceives: `~${formatCurrency(netProviderPayoutCents)}`,
    },
  };
}

/**
 * Calculate refund amount based on cancellation timing.
 * Uses cancellation policy from booking.js
 *
 * @param {number} totalPaidCents - Original payment amount in cents
 * @param {number} refundPercent - Refund percentage (0-100)
 * @returns {Object} Refund breakdown
 */
export function calculateRefundBreakdown(totalPaidCents, refundPercent) {
  const refundAmountCents = Math.round((totalPaidCents * refundPercent) / 100);
  const retainedAmountCents = totalPaidCents - refundAmountCents;

  return {
    refundAmount: refundAmountCents,
    retainedAmount: retainedAmountCents,
    displayBreakdown: {
      originalPayment: formatCurrency(totalPaidCents),
      refundAmount: formatCurrency(refundAmountCents),
      refundPercent: `${refundPercent}%`,
    },
  };
}

// =============================================================================
// PROVIDER ONBOARDING (Backend operations)
// =============================================================================

/**
 * Create a Stripe Connect Express account for a new provider.
 * Called when admin approves provider application.
 *
 * @param {Object} params - Provider details
 * @param {string} params.email - Provider email
 * @param {string} params.firstName - Provider first name
 * @param {string} params.lastName - Provider last name
 * @param {Object} stripe - Stripe SDK instance (server-side)
 * @returns {Promise<Object>} Stripe account object
 *
 * @example
 * // In Supabase Edge Function:
 * const account = await createProviderStripeAccount({
 *   email: 'provider@school.edu',
 *   firstName: 'Sarah',
 *   lastName: 'Chen'
 * }, stripe);
 */
export async function createProviderStripeAccount({ email, firstName, lastName }, stripe) {
  const account = await stripe.accounts.create({
    type: 'express',
    country: 'US',
    email,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
    business_type: 'individual',
    individual: {
      email,
      first_name: firstName,
      last_name: lastName,
    },
    settings: {
      payouts: {
        schedule: {
          delay_days: 7, // Weekly payout delay
          interval: 'weekly',
          weekly_anchor: 'monday',
        },
      },
    },
    metadata: {
      platform: 'crna_club_marketplace',
    },
  });

  return account;
}

/**
 * Generate an account onboarding link for provider to complete Stripe setup.
 * Provider clicks this to verify identity, add bank account, etc.
 *
 * @param {string} stripeAccountId - Provider's Stripe account ID
 * @param {string} returnUrl - URL to return to after onboarding
 * @param {string} refreshUrl - URL to get a new link if expired
 * @param {Object} stripe - Stripe SDK instance
 * @returns {Promise<string>} Onboarding URL
 */
export async function createAccountLink(stripeAccountId, returnUrl, refreshUrl, stripe) {
  const accountLink = await stripe.accountLinks.create({
    account: stripeAccountId,
    refresh_url: refreshUrl,
    return_url: returnUrl,
    type: 'account_onboarding',
  });

  return accountLink.url;
}

/**
 * Generate a login link for provider to access their Stripe Express Dashboard.
 * Use for payout history, bank account management, tax docs.
 *
 * @param {string} stripeAccountId - Provider's Stripe account ID
 * @param {Object} stripe - Stripe SDK instance
 * @returns {Promise<string>} Dashboard login URL
 */
export async function createDashboardLink(stripeAccountId, stripe) {
  const loginLink = await stripe.accounts.createLoginLink(stripeAccountId);
  return loginLink.url;
}

/**
 * Check if provider's Stripe account is fully set up and can receive payouts.
 *
 * @param {string} stripeAccountId - Provider's Stripe account ID
 * @param {Object} stripe - Stripe SDK instance
 * @returns {Promise<Object>} Account status
 */
export async function getAccountStatus(stripeAccountId, stripe) {
  const account = await stripe.accounts.retrieve(stripeAccountId);

  return {
    accountId: account.id,
    chargesEnabled: account.charges_enabled,
    payoutsEnabled: account.payouts_enabled,
    detailsSubmitted: account.details_submitted,
    requiresAction: account.requirements?.currently_due?.length > 0,
    currentlyDue: account.requirements?.currently_due || [],
    eventuallyDue: account.requirements?.eventually_due || [],
    errors: account.requirements?.errors || [],
  };
}

// =============================================================================
// PAYMENT INTENTS (Booking payments)
// =============================================================================

/**
 * Create a PaymentIntent for a booking.
 * Payment is captured immediately (Stripe Connect handles escrow via delayed transfer).
 *
 * @param {Object} params - Payment parameters
 * @param {number} params.amount - Amount in cents
 * @param {string} params.providerStripeAccountId - Provider's Stripe account ID
 * @param {number} params.applicationFee - Platform fee in cents
 * @param {Object} params.metadata - Booking metadata
 * @param {Object} stripe - Stripe SDK instance
 * @returns {Promise<Object>} PaymentIntent object
 */
export async function createBookingPaymentIntent(
  { amount, providerStripeAccountId, applicationFee, metadata = {} },
  stripe
) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    // Send payment to provider's connected account
    transfer_data: {
      destination: providerStripeAccountId,
    },
    // Platform keeps the application fee
    application_fee_amount: applicationFee,
    // Capture immediately - Stripe Connect delays transfer for escrow
    capture_method: 'automatic',
    metadata: {
      platform: 'crna_club_marketplace',
      ...metadata,
    },
  });

  return paymentIntent;
}

/**
 * Confirm a PaymentIntent on the client side.
 * Call this after user enters card details.
 *
 * @param {string} clientSecret - PaymentIntent client secret
 * @param {Object} paymentMethod - Stripe payment method or card element
 * @param {Object} stripe - Stripe.js instance (client-side)
 * @returns {Promise<Object>} Confirmation result
 */
export async function confirmPayment(clientSecret, paymentMethod, stripe) {
  const result = await stripe.confirmCardPayment(clientSecret, {
    payment_method: paymentMethod,
  });

  if (result.error) {
    return {
      success: false,
      error: result.error.message,
      errorCode: result.error.code,
    };
  }

  return {
    success: true,
    paymentIntent: result.paymentIntent,
  };
}

// =============================================================================
// REFUNDS
// =============================================================================

/**
 * Process a refund for a booking.
 *
 * @param {Object} params - Refund parameters
 * @param {string} params.paymentIntentId - Original PaymentIntent ID
 * @param {number} params.amount - Refund amount in cents (null for full refund)
 * @param {string} params.reason - Refund reason for records
 * @param {Object} stripe - Stripe SDK instance
 * @returns {Promise<Object>} Refund object
 */
export async function createRefund({ paymentIntentId, amount = null, reason = '' }, stripe) {
  const refundParams = {
    payment_intent: paymentIntentId,
    metadata: {
      reason,
      platform: 'crna_club_marketplace',
    },
  };

  // If amount specified, it's a partial refund
  if (amount !== null) {
    refundParams.amount = amount;
  }

  const refund = await stripe.refunds.create(refundParams);

  return {
    refundId: refund.id,
    amount: refund.amount,
    status: refund.status,
    reason: refund.reason,
  };
}

/**
 * Reverse a transfer to provider (for refunds/disputes).
 * Called when we need to claw back provider payout after refund.
 *
 * @param {string} transferId - Original transfer ID
 * @param {number} amount - Amount to reverse in cents (null for full)
 * @param {Object} stripe - Stripe SDK instance
 * @returns {Promise<Object>} Transfer reversal
 */
export async function reverseTransfer(transferId, amount = null, stripe) {
  const reversalParams = {};

  if (amount !== null) {
    reversalParams.amount = amount;
  }

  const reversal = await stripe.transfers.createReversal(transferId, reversalParams);

  return reversal;
}

// =============================================================================
// WEBHOOKS
// =============================================================================

/**
 * Stripe webhook events we care about
 */
export const STRIPE_WEBHOOK_EVENTS = {
  // Account events
  ACCOUNT_UPDATED: 'account.updated',

  // Payment events
  PAYMENT_INTENT_SUCCEEDED: 'payment_intent.succeeded',
  PAYMENT_INTENT_FAILED: 'payment_intent.payment_failed',

  // Refund events
  CHARGE_REFUNDED: 'charge.refunded',
  CHARGE_REFUND_UPDATED: 'charge.refund.updated',

  // Dispute events
  CHARGE_DISPUTE_CREATED: 'charge.dispute.created',
  CHARGE_DISPUTE_UPDATED: 'charge.dispute.updated',
  CHARGE_DISPUTE_CLOSED: 'charge.dispute.closed',

  // Transfer/payout events
  TRANSFER_CREATED: 'transfer.created',
  TRANSFER_PAID: 'transfer.paid',
  TRANSFER_FAILED: 'transfer.failed',
  PAYOUT_CREATED: 'payout.created',
  PAYOUT_PAID: 'payout.paid',
  PAYOUT_FAILED: 'payout.failed',
};

/**
 * Verify Stripe webhook signature.
 *
 * @param {string} payload - Raw request body
 * @param {string} signature - Stripe-Signature header
 * @param {string} webhookSecret - Webhook endpoint secret
 * @param {Object} stripe - Stripe SDK instance
 * @returns {Object} Verified event or throws error
 */
export function verifyWebhookSignature(payload, signature, webhookSecret, stripe) {
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Format cents to currency display string.
 *
 * @param {number} cents - Amount in cents
 * @param {string} currency - Currency code (default: 'USD')
 * @returns {string} Formatted currency string (e.g., "$100.00")
 */
export function formatCurrency(cents, currency = 'USD') {
  const amount = cents / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Parse a dollar amount string to cents.
 *
 * @param {string|number} amount - Dollar amount (e.g., "100.00" or 100)
 * @returns {number} Amount in cents
 */
export function dollarsToCents(amount) {
  if (typeof amount === 'string') {
    amount = parseFloat(amount.replace(/[$,]/g, ''));
  }
  return Math.round(amount * 100);
}

/**
 * Get provider's commission rate based on their status.
 *
 * @param {Object} provider - Provider object
 * @param {boolean} provider.isFoundingMentor - Whether provider is a founding mentor
 * @param {number} provider.customCommissionRate - Custom rate if set
 * @returns {number} Commission rate (0.15 or 0.20)
 */
export function getProviderCommissionRate(provider) {
  // Custom rate takes precedence
  if (provider.customCommissionRate !== null && provider.customCommissionRate !== undefined) {
    return provider.customCommissionRate;
  }

  // Founding mentors get 15%
  if (provider.isFoundingMentor) {
    return FOUNDING_MENTOR_COMMISSION_RATE;
  }

  // Default rate
  return DEFAULT_COMMISSION_RATE;
}

/**
 * Check if a provider can receive payouts.
 *
 * @param {Object} accountStatus - From getAccountStatus()
 * @returns {{ canReceive: boolean, reason?: string }}
 */
export function canProviderReceivePayouts(accountStatus) {
  if (!accountStatus.chargesEnabled) {
    return {
      canReceive: false,
      reason: 'Payment processing is not enabled. Please complete account setup.',
    };
  }

  if (!accountStatus.payoutsEnabled) {
    return {
      canReceive: false,
      reason: 'Payouts are not enabled. Please add a bank account.',
    };
  }

  if (!accountStatus.detailsSubmitted) {
    return {
      canReceive: false,
      reason: 'Account setup is incomplete. Please verify your identity.',
    };
  }

  if (accountStatus.requiresAction) {
    return {
      canReceive: false,
      reason: `Additional information required: ${accountStatus.currentlyDue.join(', ')}`,
    };
  }

  return { canReceive: true };
}

// =============================================================================
// EARNINGS SUMMARY
// =============================================================================

/**
 * Calculate provider earnings summary.
 * Used for provider dashboard display.
 *
 * @param {Array} completedBookings - Array of completed bookings
 * @param {Array} pendingBookings - Array of pending/confirmed bookings
 * @returns {Object} Earnings summary
 */
export function calculateEarningsSummary(completedBookings, pendingBookings = []) {
  // Completed earnings
  const totalEarned = completedBookings.reduce((sum, b) => sum + (b.provider_payout || 0), 0);

  // Pending earnings (confirmed but not completed)
  const pendingEarnings = pendingBookings.reduce((sum, b) => sum + (b.provider_payout || 0), 0);

  // This month's earnings
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisMonthEarnings = completedBookings
    .filter((b) => new Date(b.completed_at) >= startOfMonth)
    .reduce((sum, b) => sum + (b.provider_payout || 0), 0);

  return {
    totalEarned,
    pendingEarnings,
    thisMonthEarnings,
    totalBookings: completedBookings.length,
    display: {
      totalEarned: formatCurrency(totalEarned),
      pendingEarnings: formatCurrency(pendingEarnings),
      thisMonthEarnings: formatCurrency(thisMonthEarnings),
    },
  };
}

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  // Configuration
  DEFAULT_COMMISSION_RATE,
  FOUNDING_MENTOR_COMMISSION_RATE,
  MINIMUM_PAYOUT_AMOUNT,
  STRIPE_PUBLISHABLE_KEY,

  // Calculation helpers
  calculatePaymentBreakdown,
  calculateRefundBreakdown,
  calculateEarningsSummary,

  // Provider onboarding (backend)
  createProviderStripeAccount,
  createAccountLink,
  createDashboardLink,
  getAccountStatus,

  // Payment operations (backend)
  createBookingPaymentIntent,
  confirmPayment,
  createRefund,
  reverseTransfer,

  // Webhooks
  STRIPE_WEBHOOK_EVENTS,
  verifyWebhookSignature,

  // Utilities
  formatCurrency,
  dollarsToCents,
  getProviderCommissionRate,
  canProviderReceivePayouts,
};
