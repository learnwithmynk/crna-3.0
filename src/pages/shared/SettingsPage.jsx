/**
 * SettingsPage
 *
 * User settings and preferences management page.
 * Tabbed interface for different settings categories.
 */

import { useState } from 'react';
import { User, Lock, Bell, Shield } from 'lucide-react';
import { NotificationSettings } from '@/components/features/settings/NotificationSettings';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('notifications');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">
            Manage your account preferences and notification settings
          </p>
        </div>

        {/* Tab Navigation */}
        <Card className="mb-6 p-2">
          <div className="flex gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all',
                    activeTab === tab.id
                      ? 'bg-yellow-100 text-yellow-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Tab Content */}
        {activeTab === 'notifications' && <NotificationSettings />}

        {activeTab === 'profile' && (
          <Card className="p-8 text-center">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile Settings</h3>
            <p className="text-gray-600">Coming soon</p>
          </Card>
        )}

        {activeTab === 'account' && (
          <Card className="p-8 text-center">
            <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Settings</h3>
            <p className="text-gray-600">Coming soon</p>
          </Card>
        )}

        {activeTab === 'privacy' && (
          <Card className="p-8 text-center">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Privacy Settings</h3>
            <p className="text-gray-600">Coming soon</p>
          </Card>
        )}
      </div>
    </div>
  );
}
