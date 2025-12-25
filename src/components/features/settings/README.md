# Settings Components

Components for user settings and preferences management.

## Components

### NotificationSettings

Comprehensive notification preferences management with auto-save functionality.

**Features:**
- Email notification toggles (bookings, messages, reviews, weekly summary, marketing)
- In-app notification toggles (reminders, deadlines, community, achievements)
- Frequency settings (instant, daily digest, weekly digest)
- Quiet hours placeholder (for future implementation)
- Auto-save with visual feedback
- Clean card-based layout with icons

**Usage:**

```jsx
import { NotificationSettings } from '@/components/features/settings/NotificationSettings';

function SettingsPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Notification Settings</h1>
      <NotificationSettings />
    </div>
  );
}
```

**Integration with Settings Page:**

```jsx
import { useState } from 'react';
import { NotificationSettings } from '@/components/features/settings/NotificationSettings';
import { Card } from '@/components/ui/card';

function SettingsPage() {
  const [activeTab, setActiveTab] = useState('notifications');

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'account', label: 'Account' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'privacy', label: 'Privacy' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Page Header */}
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
              activeTab === tab.id
                ? 'border-yellow-400 text-gray-900'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'notifications' && <NotificationSettings />}
      {activeTab === 'profile' && <div>Profile settings coming soon</div>}
      {activeTab === 'account' && <div>Account settings coming soon</div>}
      {activeTab === 'privacy' && <div>Privacy settings coming soon</div>}
    </div>
  );
}
```

**State Management:**

Currently uses local component state. To persist preferences:

1. **Option 1: API Integration**
```jsx
// In NotificationSettings.jsx, replace TODO comments with:

import { useUpdateNotificationPreferences } from '@/hooks/useNotificationPreferences';

// Inside component:
const { mutate: updatePreferences } = useUpdateNotificationPreferences();

const handleToggle = (category, key, value) => {
  // Update local state...

  // Save to backend
  updatePreferences({
    category,
    key,
    value
  });
};
```

2. **Option 2: Supabase Direct**
```jsx
import { supabase } from '@/lib/supabase';

const handleToggle = async (category, key, value) => {
  // Update local state...

  // Save to Supabase
  const { error } = await supabase
    .from('user_preferences')
    .upsert({
      user_id: currentUser.id,
      category,
      preference_key: key,
      enabled: value,
      updated_at: new Date().toISOString()
    });

  if (error) {
    console.error('Failed to save preference:', error);
    // Show error toast
  }
};
```

**Database Schema (for persistence):**

```sql
-- User notification preferences table
CREATE TABLE user_notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Email notifications
  email_booking_updates BOOLEAN DEFAULT true,
  email_messages BOOLEAN DEFAULT true,
  email_reviews BOOLEAN DEFAULT true,
  email_weekly_summary BOOLEAN DEFAULT true,
  email_marketing BOOLEAN DEFAULT false,

  -- In-app notifications
  inapp_booking_reminders BOOLEAN DEFAULT true,
  inapp_deadline_alerts BOOLEAN DEFAULT true,
  inapp_community_activity BOOLEAN DEFAULT true,
  inapp_achievement_badges BOOLEAN DEFAULT true,

  -- Frequency settings
  notification_frequency TEXT DEFAULT 'instant' CHECK (notification_frequency IN ('instant', 'daily', 'weekly')),

  -- Quiet hours (future)
  quiet_hours_enabled BOOLEAN DEFAULT false,
  quiet_hours_start TIME,
  quiet_hours_end TIME,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id)
);

-- RLS policies
ALTER TABLE user_notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own preferences"
  ON user_notification_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON user_notification_preferences FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON user_notification_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

## Styling

Components follow The CRNA Club design system:
- Soft rounded corners (`rounded-xl`)
- Clean white cards with subtle shadows
- Yellow accent color for active states
- Icons from Lucide React
- Smooth transitions and hover states
- Mobile-responsive layout
