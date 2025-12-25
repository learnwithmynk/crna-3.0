/**
 * Settings Page Example
 *
 * Example implementation of a full settings page using the AccountSettings and PrivacySettings components.
 * This can be used as a reference for creating the actual SettingsPage in /src/pages/shared/
 */

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { AccountSettings } from './AccountSettings';
import { PrivacySettings } from './PrivacySettings';
import { User, Shield, Bell, CreditCard } from 'lucide-react';

/**
 * Example Settings Page with Tabs
 */
export function SettingsExample() {
  const [activeTab, setActiveTab] = useState('account');

  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Settings' },
  ];

  return (
    <PageWrapper breadcrumbs={breadcrumbs}>
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Settings Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="w-full justify-start overflow-x-auto bg-white border border-gray-200 p-1">
            <TabsTrigger value="account" className="gap-2">
              <User className="w-4 h-4" />
              Account
            </TabsTrigger>
            <TabsTrigger value="privacy" className="gap-2">
              <Shield className="w-4 h-4" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="billing" className="gap-2">
              <CreditCard className="w-4 h-4" />
              Billing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <AccountSettings />
          </TabsContent>

          <TabsContent value="privacy">
            <PrivacySettings />
          </TabsContent>

          <TabsContent value="notifications">
            <div className="bg-white rounded-3xl border border-gray-200 p-8 text-center">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">
                Notification settings will be added here
              </p>
            </div>
          </TabsContent>

          <TabsContent value="billing">
            <div className="bg-white rounded-3xl border border-gray-200 p-8 text-center">
              <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">
                Billing and subscription settings will be added here
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageWrapper>
  );
}

export default SettingsExample;
