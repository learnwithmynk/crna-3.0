/**
 * NotificationSettings Component
 *
 * Comprehensive notification preferences management.
 * Organized by category: Email, In-App, and Frequency settings.
 * Auto-saves changes with visual feedback.
 */

import { useState } from 'react';
import { Bell, Mail, MessageSquare, Star, TrendingUp, Tag, Calendar, Trophy, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

/**
 * Individual notification preference toggle
 */
function NotificationToggle({ id, label, description, icon: Icon, enabled, onChange, showSaved }) {
  return (
    <div className="flex items-start gap-4 py-4 border-b border-gray-100 last:border-0">
      {/* Icon */}
      <div className="flex-shrink-0 mt-1">
        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
          <Icon className="w-5 h-5 text-gray-600" />
        </div>
      </div>

      {/* Label & Description */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Label htmlFor={id} className="text-sm font-medium text-gray-900 cursor-pointer">
            {label}
          </Label>
          {showSaved && (
            <span className="flex items-center gap-1 text-xs text-green-600 animate-in fade-in duration-200">
              <CheckCircle2 className="w-3 h-3" />
              Saved
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Toggle */}
      <div className="flex-shrink-0">
        <Switch
          id={id}
          checked={enabled}
          onCheckedChange={onChange}
          aria-label={label}
        />
      </div>
    </div>
  );
}

/**
 * Main NotificationSettings component
 */
export function NotificationSettings({ className }) {
  // Email notification preferences
  const [emailPrefs, setEmailPrefs] = useState({
    bookingUpdates: true,
    messages: true,
    reviews: true,
    weeklySummary: true,
    marketing: false,
  });

  // In-app notification preferences
  const [inAppPrefs, setInAppPrefs] = useState({
    bookingReminders: true,
    deadlineAlerts: true,
    communityActivity: true,
    achievementBadges: true,
  });

  // Frequency setting
  const [frequency, setFrequency] = useState('instant');

  // Quiet hours toggle (placeholder for future implementation)
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(false);

  // Track which setting was just saved (for "Saved" indicator)
  const [recentlySaved, setRecentlySaved] = useState(null);

  /**
   * Handle toggle change with auto-save feedback
   */
  const handleToggle = (category, key, value) => {
    if (category === 'email') {
      setEmailPrefs(prev => ({ ...prev, [key]: value }));
    } else {
      setInAppPrefs(prev => ({ ...prev, [key]: value }));
    }

    // Show "Saved" indicator
    const savedKey = `${category}-${key}`;
    setRecentlySaved(savedKey);

    // Hide after 2 seconds
    setTimeout(() => {
      setRecentlySaved(null);
    }, 2000);

    // TODO: Replace with actual API call
    // Example: await updateNotificationPreferences({ [key]: value });
  };

  /**
   * Handle frequency change
   */
  const handleFrequencyChange = (value) => {
    setFrequency(value);
    setRecentlySaved('frequency');
    setTimeout(() => setRecentlySaved(null), 2000);
    // TODO: Save to API
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Email Notifications */}
      <Card className="p-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Mail className="w-5 h-5 text-gray-700" />
            <h3 className="text-lg font-semibold text-gray-900">Email Notifications</h3>
          </div>
          <p className="text-sm text-gray-600">
            Choose which updates you'd like to receive via email
          </p>
        </div>

        <div className="space-y-0">
          <NotificationToggle
            id="email-booking-updates"
            label="Booking Updates"
            description="When someone books with you or a booking status changes"
            icon={Calendar}
            enabled={emailPrefs.bookingUpdates}
            onChange={(value) => handleToggle('email', 'bookingUpdates', value)}
            showSaved={recentlySaved === 'email-bookingUpdates'}
          />

          <NotificationToggle
            id="email-messages"
            label="Messages"
            description="New messages from mentors or mentees"
            icon={MessageSquare}
            enabled={emailPrefs.messages}
            onChange={(value) => handleToggle('email', 'messages', value)}
            showSaved={recentlySaved === 'email-messages'}
          />

          <NotificationToggle
            id="email-reviews"
            label="Reviews"
            description="When you receive a new review or rating"
            icon={Star}
            enabled={emailPrefs.reviews}
            onChange={(value) => handleToggle('email', 'reviews', value)}
            showSaved={recentlySaved === 'email-reviews'}
          />

          <NotificationToggle
            id="email-weekly-summary"
            label="Weekly Summary"
            description="Weekly digest of your progress and activity"
            icon={TrendingUp}
            enabled={emailPrefs.weeklySummary}
            onChange={(value) => handleToggle('email', 'weeklySummary', value)}
            showSaved={recentlySaved === 'email-weeklySummary'}
          />

          <NotificationToggle
            id="email-marketing"
            label="Marketing & Updates"
            description="Product updates, new features, and special offers"
            icon={Tag}
            enabled={emailPrefs.marketing}
            onChange={(value) => handleToggle('email', 'marketing', value)}
            showSaved={recentlySaved === 'email-marketing'}
          />
        </div>
      </Card>

      {/* In-App Notifications */}
      <Card className="p-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="w-5 h-5 text-gray-700" />
            <h3 className="text-lg font-semibold text-gray-900">In-App Notifications</h3>
          </div>
          <p className="text-sm text-gray-600">
            Manage notifications that appear within the app
          </p>
        </div>

        <div className="space-y-0">
          <NotificationToggle
            id="inapp-booking-reminders"
            label="Booking Reminders"
            description="Reminders before your scheduled sessions (sent 24 hours and 1 hour before)"
            icon={Calendar}
            enabled={inAppPrefs.bookingReminders}
            onChange={(value) => handleToggle('inapp', 'bookingReminders', value)}
            showSaved={recentlySaved === 'inapp-bookingReminders'}
          />

          <NotificationToggle
            id="inapp-deadline-alerts"
            label="Deadline Alerts"
            description="Application deadline reminders for your target programs"
            icon={Bell}
            enabled={inAppPrefs.deadlineAlerts}
            onChange={(value) => handleToggle('inapp', 'deadlineAlerts', value)}
            showSaved={recentlySaved === 'inapp-deadlineAlerts'}
          />

          <NotificationToggle
            id="inapp-community-activity"
            label="Community Activity"
            description="Replies to your forum posts and discussion mentions"
            icon={MessageSquare}
            enabled={inAppPrefs.communityActivity}
            onChange={(value) => handleToggle('inapp', 'communityActivity', value)}
            showSaved={recentlySaved === 'inapp-communityActivity'}
          />

          <NotificationToggle
            id="inapp-achievement-badges"
            label="Achievement Badges"
            description="Celebrate when you earn new badges and level up"
            icon={Trophy}
            enabled={inAppPrefs.achievementBadges}
            onChange={(value) => handleToggle('inapp', 'achievementBadges', value)}
            showSaved={recentlySaved === 'inapp-achievementBadges'}
          />
        </div>
      </Card>

      {/* Frequency Settings */}
      <Card className="p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-gray-700" />
                <h3 className="text-lg font-semibold text-gray-900">Notification Frequency</h3>
              </div>
              <p className="text-sm text-gray-600">
                How often would you like to receive notifications?
              </p>
            </div>
            {recentlySaved === 'frequency' && (
              <span className="flex items-center gap-1 text-xs text-green-600 animate-in fade-in duration-200">
                <CheckCircle2 className="w-3 h-3" />
                Saved
              </span>
            )}
          </div>
        </div>

        <RadioGroup value={frequency} onValueChange={handleFrequencyChange}>
          <div className="space-y-3">
            {/* Instant */}
            <div className="flex items-start gap-3 p-4 rounded-xl border-2 border-gray-100 hover:border-gray-200 transition-colors">
              <RadioGroupItem value="instant" id="frequency-instant" className="mt-0.5" />
              <div className="flex-1">
                <Label htmlFor="frequency-instant" className="text-sm font-medium text-gray-900 cursor-pointer">
                  Instant
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  Get notified immediately as things happen
                </p>
              </div>
            </div>

            {/* Daily Digest */}
            <div className="flex items-start gap-3 p-4 rounded-xl border-2 border-gray-100 hover:border-gray-200 transition-colors">
              <RadioGroupItem value="daily" id="frequency-daily" className="mt-0.5" />
              <div className="flex-1">
                <Label htmlFor="frequency-daily" className="text-sm font-medium text-gray-900 cursor-pointer">
                  Daily Digest
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  Receive a summary once per day (morning at 8 AM)
                </p>
              </div>
            </div>

            {/* Weekly Digest */}
            <div className="flex items-start gap-3 p-4 rounded-xl border-2 border-gray-100 hover:border-gray-200 transition-colors">
              <RadioGroupItem value="weekly" id="frequency-weekly" className="mt-0.5" />
              <div className="flex-1">
                <Label htmlFor="frequency-weekly" className="text-sm font-medium text-gray-900 cursor-pointer">
                  Weekly Digest
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  Receive a summary once per week (Monday mornings)
                </p>
              </div>
            </div>
          </div>
        </RadioGroup>

        {/* Quiet Hours - Placeholder */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <Label htmlFor="quiet-hours" className="text-sm font-medium text-gray-900 cursor-pointer">
                Quiet Hours
              </Label>
              <p className="text-sm text-gray-600 mt-1">
                Pause non-urgent notifications during specified hours (coming soon)
              </p>
            </div>
            <Switch
              id="quiet-hours"
              checked={quietHoursEnabled}
              onCheckedChange={setQuietHoursEnabled}
              disabled
              aria-label="Quiet hours (coming soon)"
            />
          </div>

          {quietHoursEnabled && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600 italic">
                Time picker controls will be available in a future update
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Info Card */}
      <Card className="p-4 bg-blue-50 border-blue-100">
        <div className="flex gap-3">
          <Bell className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-blue-900 font-medium mb-1">
              Changes save automatically
            </p>
            <p className="text-sm text-blue-700">
              Your notification preferences are synced across all your devices. Important notifications like booking confirmations will always be sent regardless of these settings.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
