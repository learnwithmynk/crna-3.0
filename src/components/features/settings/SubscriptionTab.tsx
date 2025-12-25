/**
 * SubscriptionTab
 *
 * Simple subscription management:
 * - Current plan with manage billing button
 * - Billing history
 */

import { useState } from 'react';
import { CreditCard, Calendar, Loader2, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Mock billing history
const BILLING_HISTORY = [
  {
    id: '1',
    date: '2025-12-01',
    description: 'CRNA Club Membership',
    amount: '$27.00',
    status: 'paid',
  },
  {
    id: '2',
    date: '2025-11-01',
    description: 'CRNA Club Membership',
    amount: '$27.00',
    status: 'paid',
  },
  {
    id: '3',
    date: '2025-10-01',
    description: 'CRNA Club Membership',
    amount: '$27.00',
    status: 'paid',
  },
];

export function SubscriptionTab() {
  const [isLoading, setIsLoading] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const handleManageBilling = () => {
    // TODO: Integrate with Stripe Customer Portal
    console.log('Manage billing clicked');
  };

  const handleCancelSubscription = async () => {
    setIsLoading(true);
    // TODO: Implement subscription cancellation
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setShowCancelConfirm(false);
  };

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription className="mt-1">
                CRNA Club Membership
              </CardDescription>
            </div>
            <Badge className="bg-green-100 text-green-800">
              Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-gray-900">$27</span>
            <span className="text-gray-500">/month</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Next billing: January 1, 2026</span>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleManageBilling}
              className="bg-yellow-400 hover:bg-yellow-500 text-black"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Manage Billing
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowCancelConfirm(true)}
            >
              Cancel
            </Button>
          </div>

          {showCancelConfirm && (
            <Alert className="border-orange-300 bg-orange-50">
              <AlertDescription>
                <p className="font-medium text-orange-900 mb-2">
                  Cancel your subscription?
                </p>
                <p className="text-sm text-gray-700 mb-3">
                  You'll lose access at the end of your billing period.
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCancelConfirm(false)}
                  >
                    Keep
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleCancelSubscription}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Canceling...
                      </>
                    ) : (
                      'Confirm'
                    )}
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-gray-600" />
            Billing History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {BILLING_HISTORY.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {invoice.description}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(invoice.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-900">
                    {invoice.amount}
                  </span>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
