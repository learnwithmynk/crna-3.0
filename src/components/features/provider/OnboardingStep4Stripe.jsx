/**
 * OnboardingStep4Stripe Component
 *
 * Step 4 of provider onboarding - "Get Paid"
 * Handles Stripe Connect setup for marketplace payouts.
 * Shows commission breakdown (20% vs competitors' 35%+),
 * Stripe connection status, payout details, and tax information.
 */

import {
  DollarSign,
  CreditCard,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  ArrowRight,
  BadgeCheck,
  Clock,
  Building2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function OnboardingStep4Stripe({
  data = {},
  onChange,
  onNext,
  onBack,
  onConnectStripe,
}) {
  const {
    stripeConnected = false,
    stripePending = false,
    bankLastFour = null,
  } = data;

  // Determine connection status
  const isConnected = stripeConnected && !stripePending;
  const isPending = stripePending;
  const isNotConnected = !stripeConnected && !stripePending;

  const handleConnectStripe = () => {
    if (onConnectStripe) {
      // TODO: Replace with actual Stripe Connect flow
      onConnectStripe();
    }
  };

  const handleSkipForNow = () => {
    if (onNext) {
      onNext();
    }
  };

  const handleContinue = () => {
    if (onNext) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Get Paid</h2>
        <p className="text-gray-600">
          Set up your payout account to receive earnings from mentorship services
        </p>
      </div>

      {/* Commission Breakdown - Highlight Low Rate */}
      <Card className="border-2 border-primary bg-yellow-50">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                Industry-Leading Commission Rate
              </CardTitle>
              <CardDescription className="mt-1">
                Keep more of what you earn
              </CardDescription>
            </div>
            <Badge variant="success" className="text-sm px-3 py-1">
              Save 15%
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Visual Breakdown */}
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="space-y-3">
              {/* You set price */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  You set your price
                </span>
                <span className="text-lg font-bold text-gray-900">$100.00</span>
              </div>

              {/* Platform fee */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Platform fee (20%)
                </span>
                <span className="text-lg font-semibold text-red-600">-$20.00</span>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-300 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-gray-900">
                    You receive
                  </span>
                  <span className="text-2xl font-bold text-green-600">$80.00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Comparison */}
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <BadgeCheck className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-gray-900">
                Compare to other platforms
              </span>
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              <p>• Other mentorship platforms: <span className="font-semibold text-red-600">35%+</span> commission</p>
              <p>• The CRNA Club: <span className="font-semibold text-green-600">20%</span> commission</p>
              <p className="text-xs text-green-700 font-medium mt-2">
                That's one of the lowest rates in the industry
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stripe Connect Setup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-gray-700" />
            Payment Account Setup
          </CardTitle>
          <CardDescription>
            Connect your bank account to receive payouts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status Indicator */}
          <div
            className={cn(
              'rounded-xl p-4 border-2 transition-all',
              isConnected && 'bg-green-50 border-green-500',
              isPending && 'bg-yellow-50 border-yellow-500',
              isNotConnected && 'bg-gray-50 border-gray-300'
            )}
          >
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className="flex-shrink-0 mt-0.5">
                {isConnected && (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                )}
                {isPending && (
                  <Clock className="w-6 h-6 text-yellow-600" />
                )}
                {isNotConnected && (
                  <AlertTriangle className="w-6 h-6 text-gray-400" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                {isConnected && (
                  <>
                    <h4 className="text-sm font-semibold text-green-900 mb-1">
                      Payment Account Connected
                    </h4>
                    <p className="text-sm text-green-700">
                      Your payout account is ready to receive payments
                    </p>
                    {bankLastFour && (
                      <div className="mt-3 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-700">
                          Bank account ending in ••••{bankLastFour}
                        </span>
                      </div>
                    )}
                  </>
                )}

                {isPending && (
                  <>
                    <h4 className="text-sm font-semibold text-yellow-900 mb-1">
                      Complete Your Stripe Setup
                    </h4>
                    <p className="text-sm text-yellow-700 mb-3">
                      You've started the setup process. Click below to complete your Stripe account.
                    </p>
                    <Button
                      onClick={handleConnectStripe}
                      variant="default"
                      size="sm"
                      className="bg-yellow-500 text-black hover:bg-yellow-600"
                    >
                      Complete Stripe Setup
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </>
                )}

                {isNotConnected && (
                  <>
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">
                      Connect with Stripe
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Set up secure payouts in minutes with Stripe Connect
                    </p>
                    <Button
                      onClick={handleConnectStripe}
                      variant="default"
                      size="default"
                      className="w-full sm:w-auto"
                    >
                      Connect with Stripe
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Change Account Link (if connected) */}
          {isConnected && (
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <span className="text-sm text-gray-600">Need to update your account?</span>
              <button
                onClick={handleConnectStripe}
                className="text-sm font-medium text-primary hover:underline"
              >
                Change account
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payout Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Payout Schedule</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                Automatic payouts every 2 weeks
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Funds are transferred directly to your bank account on the 1st and 15th of each month
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <BadgeCheck className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                Powered by Stripe
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Trusted by millions of businesses for secure, reliable payments
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tax Information Alert */}
      <Alert variant="warning">
        <AlertTriangle className="w-5 h-5" />
        <AlertTitle className="text-base font-semibold">Tax Information</AlertTitle>
        <AlertDescription className="space-y-2 mt-2">
          <p className="text-sm">
            As an independent contractor, you're responsible for your own taxes.
          </p>
          <ul className="list-disc list-inside text-sm space-y-1 ml-2">
            <li>You'll receive a 1099 form at year end for earnings over $600</li>
            <li>Consider setting aside 20-30% of your earnings for taxes</li>
            <li>Consult with a tax professional for personalized advice</li>
          </ul>
        </AlertDescription>
      </Alert>

      {/* Navigation Buttons */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t">
        <Button
          onClick={onBack}
          variant="outline"
          size="lg"
          className="w-full sm:w-auto"
        >
          Back
        </Button>

        <div className="flex-1" />

        {!isConnected && (
          <Button
            onClick={handleSkipForNow}
            variant="ghost"
            size="lg"
            className="w-full sm:w-auto text-gray-600"
          >
            Skip for now
          </Button>
        )}

        <Button
          onClick={handleContinue}
          variant="default"
          size="lg"
          className="w-full sm:w-auto"
          disabled={!isConnected && !isNotConnected && !isPending}
        >
          {isConnected ? 'Continue' : 'Continue without connecting'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Warning if skipping */}
      {!isConnected && (
        <Alert variant="default" className="border-blue-200 bg-blue-50">
          <AlertDescription className="text-sm text-blue-900">
            You can connect your Stripe account later from your provider dashboard.
            You won't be able to receive payments until your account is connected.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

export default OnboardingStep4Stripe;
