/**
 * SettingsPage
 *
 * Main settings page with tab-based navigation.
 * Supports URL hash navigation (e.g., /settings#subscription)
 *
 * Tabs:
 * - Profile: Name, display name, password
 * - Subscription: Plan details, billing, upgrade/downgrade
 * - Privacy: Data export, privacy rights
 *
 * Route: /settings, /settings#tab
 */

import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { User, CreditCard, Lock } from 'lucide-react';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ProfileTab } from '@/components/features/settings/ProfileTab';
import { SubscriptionTab } from '@/components/features/settings/SubscriptionTab';
import { PrivacyTab } from '@/components/features/settings/PrivacyTab';

const TABS = [
  {
    value: 'profile',
    label: 'Profile',
    icon: User,
  },
  {
    value: 'subscription',
    label: 'Subscription',
    icon: CreditCard,
  },
  {
    value: 'privacy',
    label: 'Privacy',
    icon: Lock,
  },
];

export function SettingsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get active tab from URL hash (e.g., #subscription)
  const getActiveTabFromHash = () => {
    const hash = location.hash.replace('#', '');
    const validTab = TABS.find(tab => tab.value === hash);
    return validTab ? hash : 'profile';
  };

  const [activeTab, setActiveTab] = useState(getActiveTabFromHash);

  // Update active tab when hash changes
  useEffect(() => {
    setActiveTab(getActiveTabFromHash());
  }, [location.hash]);

  // Update URL hash when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/settings#${value}`, { replace: true });
  };

  return (
    <PageWrapper
      title="Settings"
      description="Manage your account, subscription, and preferences"
    >
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        {/* Tab Navigation - horizontal scroll on mobile */}
        <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
          <TabsList className="inline-flex w-auto min-w-full md:min-w-0">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex items-center gap-2 min-w-[100px]"
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.slice(0, 1)}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          <TabsContent value="profile" className="mt-0">
            <ProfileTab />
          </TabsContent>

          <TabsContent value="subscription" className="mt-0">
            <SubscriptionTab />
          </TabsContent>

          <TabsContent value="privacy" className="mt-0">
            <PrivacyTab />
          </TabsContent>
        </div>
      </Tabs>
    </PageWrapper>
  );
}
