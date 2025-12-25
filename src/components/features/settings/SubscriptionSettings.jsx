/**
 * Subscription Settings Component
 *
 * Displays and manages user subscription details including:
 * - Current plan card with status
 * - Trial information (if applicable)
 * - Payment method section
 * - Billing history
 * - Cancel subscription option
 *
 * TODO: Integrate with Stripe Customer Portal for actual payment management
 * TODO: Connect to real subscription API endpoints
 */

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import {
  CreditCard,
  Download,
  Calendar,
  AlertCircle,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { SUBSCRIPTION_TIERS, SUBSCRIPTION_STATUSES } from '@/lib/enums';

// Mock data - TODO: Replace with API calls
const SUBSCRIPTION_TIER_INFO = {
  [SUBSCRIPTION_TIERS.FREE]: {
    name: 'Free',
    price: '$0',
    period: null,
  },
  [SUBSCRIPTION_TIERS.TRIAL]: {
    name: '7-Day Free Trial',
    price: '$0',
    period: null,
  },
  [SUBSCRIPTION_TIERS.MEMBER]: {
    name: 'CRNA Club Membership',
    price: '$27',
    period: 'month',
  },
  [SUBSCRIPTION_TIERS.FOUNDING_MEMBER]: {
    name: 'Founding Member',
    price: '$12-19',
    period: 'month',
    badge: 'Lifetime Access',
  },
  [SUBSCRIPTION_TIERS.TOOLKIT_ONLY]: {
    name: 'Toolkit Only',
    price: 'One-time',
    period: null,
  },
};

// Mock billing history - TODO: Replace with API call
const mockBillingHistory = [
  {
    id: 'inv_001',
    date: '2024-12-01',
    amount: 27.00,
    status: 'paid',
    invoiceUrl: '#',
  },
  {
    id: 'inv_002',
    date: '2024-11-01',
    amount: 27.00,
    status: 'paid',
    invoiceUrl: '#',
  },
  {
    id: 'inv_003',
    date: '2024-10-01',
    amount: 27.00,
    status: 'paid',
    invoiceUrl: '#',
  },
];

// Mock payment method - TODO: Replace with API call
const mockPaymentMethod = {
  last4: '4242',
  brand: 'Visa',
  expMonth: 12,
  expYear: 2025,
};

export function SubscriptionSettings({ user }) {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  // Get subscription tier info
  const subscriptionTier = user?.subscriptionTier || SUBSCRIPTION_TIERS.FREE;
  const subscriptionStatus = user?.subscriptionStatus || SUBSCRIPTION_STATUSES.ACTIVE;
  const tierInfo = SUBSCRIPTION_TIER_INFO[subscriptionTier] || SUBSCRIPTION_TIER_INFO[SUBSCRIPTION_TIERS.FREE];

  // Calculate trial days remaining if on trial
  const trialEndsAt = user?.trialEndsAt ? new Date(user.trialEndsAt) : null;
  const today = new Date();
  const daysRemaining = trialEndsAt ? Math.ceil((trialEndsAt - today) / (1000 * 60 * 60 * 24)) : null;

  const isTrial = subscriptionStatus === SUBSCRIPTION_STATUSES.TRIAL;
  const isActive = subscriptionStatus === SUBSCRIPTION_STATUSES.ACTIVE;
  const isCancelled = subscriptionStatus === SUBSCRIPTION_STATUSES.CANCELLED;
  const isFree = subscriptionTier === SUBSCRIPTION_TIERS.FREE;

  // Format next billing date (mock - first of next month)
  const getNextBillingDate = () => {
    const next = new Date();
    next.setMonth(next.getMonth() + 1);
    next.setDate(1);
    return next.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const handleCancelSubscription = () => {
    // TODO: API call to cancel subscription
    toast.success('Subscription Cancelled', {
      description: 'Your access will continue until the end of your billing period.',
    });
    setCancelDialogOpen(false);
    console.log('[SubscriptionSettings] Cancel subscription requested');
  };

  const handleUpdatePaymentMethod = () => {
    // TODO: Redirect to Stripe Customer Portal
    console.log('[SubscriptionSettings] Update payment method clicked - redirect to Stripe portal');
    toast.info('Coming Soon', {
      description: 'Payment method update will be available soon!',
    });
  };

  const handleUpgrade = () => {
    // TODO: Navigate to upgrade page or open upgrade modal
    console.log('[SubscriptionSettings] Upgrade clicked');
  };

  const handleManagePlan = () => {
    // TODO: Open plan management options
    console.log('[SubscriptionSettings] Manage plan clicked');
  };

  const handleDownloadInvoice = (invoice) => {
    // TODO: Download invoice PDF from Stripe
    console.log('[SubscriptionSettings] Download invoice:', invoice.id);
    toast.info('Coming Soon', {
      description: 'Invoice download will be available soon!',
    });
  };

  // Get status badge variant
  const getStatusBadgeStatus = (status) => {
    const statusMap = {
      [SUBSCRIPTION_STATUSES.ACTIVE]: 'confirmed',
      [SUBSCRIPTION_STATUSES.TRIAL]: 'pending',
      [SUBSCRIPTION_STATUSES.CANCELLED]: 'cancelled',
      [SUBSCRIPTION_STATUSES.EXPIRED]: 'cancelled',
      [SUBSCRIPTION_STATUSES.PAUSED]: 'pending',
    };
    return statusMap[status] || 'default';
  };

  return (
    <div className="space-y-6">
      {/* Current Plan Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {tierInfo.name}
            </h3>
            <div className="flex items-center gap-2">
              <StatusBadge
                status={getStatusBadgeStatus(subscriptionStatus)}
                customLabel={subscriptionStatus === SUBSCRIPTION_STATUSES.ACTIVE ? 'Active' :
                            subscriptionStatus === SUBSCRIPTION_STATUSES.TRIAL ? 'Trial' :
                            subscriptionStatus === SUBSCRIPTION_STATUSES.CANCELLED ? 'Cancelled' :
                            subscriptionStatus}
              />
              {tierInfo.badge && (
                <span className="px-2 py-1 text-xs font-medium rounded bg-yellow-100 text-yellow-800">
                  {tierInfo.badge}
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {tierInfo.price}
            </div>
            {tierInfo.period && (
              <div className="text-sm text-gray-500">per {tierInfo.period}</div>
            )}
          </div>
        </div>

        {/* Next billing date */}
        {isActive && !isFree && subscriptionTier !== SUBSCRIPTION_TIERS.FOUNDING_MEMBER && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Calendar className="h-4 w-4" />
            <span>Next billing date: {getNextBillingDate()}</span>
          </div>
        )}

        {/* Founding member note */}
        {subscriptionTier === SUBSCRIPTION_TIERS.FOUNDING_MEMBER && (
          <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-lg p-3 mb-4">
            <CheckCircle2 className="h-4 w-4" />
            <span>You have lifetime access at this special rate. Thank you for being a founding member!</span>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2">
          {isFree ? (
            <Button variant="accent" onClick={handleUpgrade} className="w-full">
              Upgrade to Premium
            </Button>
          ) : (
            <Button variant="secondary" onClick={handleManagePlan}>
              Manage Plan
            </Button>
          )}
        </div>
      </div>

      {/* Trial Info */}
      {isTrial && daysRemaining !== null && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-yellow-900 mb-1">
                {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} remaining in your trial
              </h4>
              <p className="text-sm text-yellow-800 mb-3">
                Your trial ends on {trialEndsAt.toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}. Upgrade now to continue accessing all features.
              </p>
              <Button variant="accent" size="sm" onClick={handleUpgrade}>
                Upgrade Now
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Method */}
      {!isFree && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">
                  {mockPaymentMethod.brand} •••• {mockPaymentMethod.last4}
                </div>
                <div className="text-sm text-gray-500">
                  Expires {mockPaymentMethod.expMonth}/{mockPaymentMethod.expYear}
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleUpdatePaymentMethod}
            >
              Update
            </Button>
          </div>

          <p className="text-sm text-gray-500 flex items-center gap-1">
            <ExternalLink className="h-3 w-3" />
            Secure payment processing by Stripe
          </p>
        </div>
      )}

      {/* Billing History */}
      {!isFree && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing History</h3>

          <div className="space-y-3">
            {mockBillingHistory.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">
                      ${invoice.amount.toFixed(2)}
                    </div>
                    <div className="text-gray-500">
                      {new Date(invoice.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge
                    status={invoice.status === 'paid' ? 'confirmed' : 'pending'}
                    customLabel={invoice.status === 'paid' ? 'Paid' : 'Pending'}
                    size="sm"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownloadInvoice(invoice)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cancel Subscription */}
      {isActive && !isFree && subscriptionTier !== SUBSCRIPTION_TIERS.FOUNDING_MEMBER && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Cancel Subscription</h3>
          <p className="text-sm text-gray-600 mb-4">
            You can cancel your subscription at any time. You'll retain access to all features until the end of your current billing period.
          </p>
          <Button
            variant="destructive"
            onClick={() => setCancelDialogOpen(true)}
          >
            Cancel Subscription
          </Button>
        </div>
      )}

      {/* Cancelled subscription notice */}
      {isCancelled && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-red-900 mb-1">
                Subscription Cancelled
              </h4>
              <p className="text-sm text-red-800 mb-3">
                Your subscription has been cancelled. You'll have access to premium features until {getNextBillingDate()}.
              </p>
              <Button variant="accent" size="sm" onClick={handleManagePlan}>
                Reactivate Subscription
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        title="Cancel Subscription?"
        description="Are you sure you want to cancel your subscription? You'll retain access to all features until the end of your current billing period. You can reactivate at any time."
        confirmLabel="Yes, Cancel Subscription"
        cancelLabel="Keep Subscription"
        variant="destructive"
        onConfirm={handleCancelSubscription}
      />
    </div>
  );
}
