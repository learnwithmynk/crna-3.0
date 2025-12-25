/**
 * SubscriptionSettings Example
 *
 * Demonstrates the SubscriptionSettings component with different subscription states.
 * Run with: npm run dev and navigate to this example
 */

import { useState } from 'react';
import { SubscriptionSettings } from './SubscriptionSettings';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { Button } from '@/components/ui/button';
import { SUBSCRIPTION_TIERS, SUBSCRIPTION_STATUSES } from '@/lib/enums';

// Mock user states to demonstrate different scenarios
const MOCK_USERS = {
  free: {
    id: 'user_001',
    email: 'user@example.com',
    subscriptionTier: SUBSCRIPTION_TIERS.FREE,
    subscriptionStatus: SUBSCRIPTION_STATUSES.ACTIVE,
  },
  activeMember: {
    id: 'user_002',
    email: 'member@example.com',
    subscriptionTier: SUBSCRIPTION_TIERS.MEMBER,
    subscriptionStatus: SUBSCRIPTION_STATUSES.ACTIVE,
  },
  trialUser: {
    id: 'user_003',
    email: 'trial@example.com',
    subscriptionTier: SUBSCRIPTION_TIERS.MEMBER,
    subscriptionStatus: SUBSCRIPTION_STATUSES.TRIAL,
    trialEndsAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
  },
  foundingMember: {
    id: 'user_004',
    email: 'founding@example.com',
    subscriptionTier: SUBSCRIPTION_TIERS.FOUNDING_MEMBER,
    subscriptionStatus: SUBSCRIPTION_STATUSES.ACTIVE,
  },
  cancelledMember: {
    id: 'user_005',
    email: 'cancelled@example.com',
    subscriptionTier: SUBSCRIPTION_TIERS.MEMBER,
    subscriptionStatus: SUBSCRIPTION_STATUSES.CANCELLED,
  },
};

export function SubscriptionSettingsExample() {
  const [selectedUser, setSelectedUser] = useState('activeMember');

  return (
    <PageWrapper
      title="Subscription Settings"
      description="Example showcasing different subscription states"
    >
      {/* User State Selector */}
      <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Select User State:</h3>
        <div className="flex flex-wrap gap-2">
          {Object.keys(MOCK_USERS).map((key) => (
            <Button
              key={key}
              variant={selectedUser === key ? 'accent' : 'outline'}
              size="sm"
              onClick={() => setSelectedUser(key)}
            >
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </Button>
          ))}
        </div>
      </div>

      {/* SubscriptionSettings Component */}
      <SubscriptionSettings user={MOCK_USERS[selectedUser]} />
    </PageWrapper>
  );
}

export default SubscriptionSettingsExample;
