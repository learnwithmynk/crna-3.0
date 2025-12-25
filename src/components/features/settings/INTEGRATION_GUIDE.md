# NotificationSettings Integration Guide

## Quick Start

The `NotificationSettings` component is ready to use. Here's how to integrate it into your app:

### 1. Basic Usage

```jsx
import { NotificationSettings } from '@/components/features/settings/NotificationSettings';

function MySettingsPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <NotificationSettings />
    </div>
  );
}
```

### 2. With Routing

Add to your router configuration:

```jsx
// In your router setup (e.g., App.jsx or routes.jsx)
import SettingsPage from '@/pages/shared/SettingsPage';

{
  path: '/settings',
  element: <SettingsPage />
}

// Or with protected route
{
  path: '/settings',
  element: <ProtectedRoute><SettingsPage /></ProtectedRoute>
}
```

### 3. Link from Navigation

```jsx
import { Settings } from 'lucide-react';

<Link to="/settings" className="flex items-center gap-2">
  <Settings className="w-4 h-4" />
  Settings
</Link>
```

## Features

### Email Notifications
- **Booking Updates** - Notifies when bookings are made or status changes
- **Messages** - New messages from mentors/mentees
- **Reviews** - New review notifications
- **Weekly Summary** - Progress digest
- **Marketing** - Product updates and offers

### In-App Notifications
- **Booking Reminders** - Session reminders (24hrs and 1hr before)
- **Deadline Alerts** - Application deadline reminders
- **Community Activity** - Forum replies and mentions
- **Achievement Badges** - Badge and level-up celebrations

### Frequency Settings
- **Instant** - Real-time notifications
- **Daily Digest** - Once per day summary
- **Weekly Digest** - Weekly summary

### Auto-Save
- Changes save automatically when toggled
- Visual "Saved" indicator appears for 2 seconds
- Currently uses local state (see persistence section below)

## Making It Persistent

Currently, preferences are stored in component state and will reset on page refresh. To make them persistent:

### Option A: Create a Custom Hook

```jsx
// src/hooks/useNotificationPreferences.js
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

export function useNotificationPreferences() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState({
    email: {
      bookingUpdates: true,
      messages: true,
      reviews: true,
      weeklySummary: true,
      marketing: false,
    },
    inApp: {
      bookingReminders: true,
      deadlineAlerts: true,
      communityActivity: true,
      achievementBadges: true,
    },
    frequency: 'instant',
  });

  // Load preferences on mount
  useEffect(() => {
    if (!user) return;

    async function loadPreferences() {
      const { data, error } = await supabase
        .from('user_notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setPreferences({
          email: {
            bookingUpdates: data.email_booking_updates,
            messages: data.email_messages,
            reviews: data.email_reviews,
            weeklySummary: data.email_weekly_summary,
            marketing: data.email_marketing,
          },
          inApp: {
            bookingReminders: data.inapp_booking_reminders,
            deadlineAlerts: data.inapp_deadline_alerts,
            communityActivity: data.inapp_community_activity,
            achievementBadges: data.inapp_achievement_badges,
          },
          frequency: data.notification_frequency,
        });
      }

      setLoading(false);
    }

    loadPreferences();
  }, [user]);

  // Save preferences
  const updatePreference = async (category, key, value) => {
    if (!user) return;

    // Update local state immediately
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));

    // Convert to snake_case for database
    const dbKey = category === 'email'
      ? `email_${key.replace(/([A-Z])/g, '_$1').toLowerCase()}`
      : `inapp_${key.replace(/([A-Z])/g, '_$1').toLowerCase()}`;

    // Save to database
    const { error } = await supabase
      .from('user_notification_preferences')
      .upsert({
        user_id: user.id,
        [dbKey]: value,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Failed to save preference:', error);
      // Optionally revert local state on error
    }
  };

  const updateFrequency = async (value) => {
    if (!user) return;

    setPreferences(prev => ({ ...prev, frequency: value }));

    await supabase
      .from('user_notification_preferences')
      .upsert({
        user_id: user.id,
        notification_frequency: value,
        updated_at: new Date().toISOString(),
      });
  };

  return {
    preferences,
    loading,
    updatePreference,
    updateFrequency,
  };
}
```

### Option B: Update Component Directly

Modify `NotificationSettings.jsx` to use Supabase:

```jsx
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

export function NotificationSettings({ className }) {
  const { user } = useAuth();

  // Load preferences on mount
  useEffect(() => {
    if (!user) return;

    async function loadPreferences() {
      const { data, error } = await supabase
        .from('user_notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setEmailPrefs({
          bookingUpdates: data.email_booking_updates,
          messages: data.email_messages,
          reviews: data.email_reviews,
          weeklySummary: data.email_weekly_summary,
          marketing: data.email_marketing,
        });

        setInAppPrefs({
          bookingReminders: data.inapp_booking_reminders,
          deadlineAlerts: data.inapp_deadline_alerts,
          communityActivity: data.inapp_community_activity,
          achievementBadges: data.inapp_achievement_badges,
        });

        setFrequency(data.notification_frequency);
      }
    }

    loadPreferences();
  }, [user]);

  // Update handleToggle to save to Supabase
  const handleToggle = async (category, key, value) => {
    // ... existing state update code ...

    // Save to Supabase
    const dbKey = category === 'email'
      ? `email_${camelToSnake(key)}`
      : `inapp_${camelToSnake(key)}`;

    await supabase
      .from('user_notification_preferences')
      .upsert({
        user_id: user.id,
        [dbKey]: value,
        updated_at: new Date().toISOString(),
      });
  };

  // ... rest of component
}

// Helper function
function camelToSnake(str) {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase();
}
```

## Database Schema

Run this migration to add the preferences table:

```sql
-- Create user notification preferences table
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

  -- Frequency
  notification_frequency TEXT DEFAULT 'instant'
    CHECK (notification_frequency IN ('instant', 'daily', 'weekly')),

  -- Quiet hours (for future use)
  quiet_hours_enabled BOOLEAN DEFAULT false,
  quiet_hours_start TIME,
  quiet_hours_end TIME,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE user_notification_preferences ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own preferences"
  ON user_notification_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON user_notification_preferences FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON user_notification_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create trigger to update updated_at
CREATE TRIGGER update_user_notification_preferences_updated_at
  BEFORE UPDATE ON user_notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## Implementing Actual Notifications

Once preferences are saved, you can use them to control notification delivery:

### Email Notifications (via Groundhogg or Supabase Edge Functions)

```javascript
// Example: Before sending booking confirmation email
const { data: prefs } = await supabase
  .from('user_notification_preferences')
  .select('email_booking_updates')
  .eq('user_id', userId)
  .single();

if (prefs.email_booking_updates) {
  // Send email via Groundhogg or Supabase
  await sendEmail({
    to: user.email,
    template: 'booking_confirmation',
    data: bookingData,
  });
}
```

### In-App Notifications (via Supabase Realtime)

```javascript
// Example: Create in-app notification
const { data: prefs } = await supabase
  .from('user_notification_preferences')
  .select('inapp_booking_reminders')
  .eq('user_id', userId)
  .single();

if (prefs.inapp_booking_reminders) {
  await supabase.from('notifications').insert({
    user_id: userId,
    type: 'booking_reminder',
    title: 'Session starting soon',
    message: 'Your session with Sarah starts in 1 hour',
    data: { booking_id: bookingId },
    created_at: new Date().toISOString(),
  });
}
```

## Styling Customization

The component uses your theme context. To customize:

```jsx
// Wrap with a specific theme
import { ThemeProvider } from '@/contexts/ThemeContext';

<ThemeProvider theme="purple">
  <NotificationSettings />
</ThemeProvider>

// Or customize individual elements
<NotificationSettings className="max-w-2xl" />
```

## Testing

The component is fully functional with local state. To test:

1. Visit `/settings` route
2. Toggle notification preferences
3. See "Saved" indicator appear
4. Check browser console for any errors

For integration testing, add Supabase mocks or use a test database.
