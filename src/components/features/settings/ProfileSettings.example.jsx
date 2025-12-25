/**
 * ProfileSettings Example Usage
 *
 * This file demonstrates how to use the ProfileSettings component in a Settings page.
 *
 * The ProfileSettings component is a complete, standalone component that handles:
 * - Avatar upload/removal
 * - Personal information editing
 * - Password changes
 * - Form validation and error handling
 * - Success/error toast notifications
 */

import React from 'react';
import { ProfileSettings } from './ProfileSettings';

/**
 * Example: Simple Settings Page with Profile Tab
 */
export function SettingsPageExample() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Profile Settings Component */}
        <ProfileSettings />
      </div>
    </div>
  );
}

/**
 * Example: Tabbed Settings Page
 *
 * You might want to use ProfileSettings as one tab in a multi-tab settings page:
 * - Profile (ProfileSettings)
 * - Notifications
 * - Privacy
 * - Billing
 */
export function TabbedSettingsPageExample() {
  const [activeTab, setActiveTab] = React.useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'privacy', label: 'Privacy' },
    { id: 'billing', label: 'Billing' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 -mb-px ${
                activeTab === tab.id
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="max-w-4xl">
          {activeTab === 'profile' && <ProfileSettings />}
          {activeTab === 'notifications' && (
            <div className="text-gray-500">Notifications settings coming soon...</div>
          )}
          {activeTab === 'privacy' && (
            <div className="text-gray-500">Privacy settings coming soon...</div>
          )}
          {activeTab === 'billing' && (
            <div className="text-gray-500">Billing settings coming soon...</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SettingsPageExample;
