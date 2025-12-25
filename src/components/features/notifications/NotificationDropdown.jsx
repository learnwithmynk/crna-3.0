/**
 * NotificationDropdown - Dropdown panel showing recent notifications
 *
 * Shows a list of notifications with a header, mark all read action,
 * and link to full notifications page.
 */

import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NotificationItem } from './NotificationItem';
import { cn } from '@/lib/utils';

export function NotificationDropdown({
  notifications = [],
  unreadCount = 0,
  onNotificationClick,
  onMarkAllRead,
  onClose,
  className
}) {
  const hasNotifications = notifications.length > 0;

  return (
    <div className={cn(
      'w-80 sm:w-96 bg-white rounded-xl shadow-lg border overflow-hidden',
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900">Notifications</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMarkAllRead}
              className="h-8 px-2 text-xs text-gray-600 hover:text-gray-900"
            >
              <Check className="w-3.5 h-3.5 mr-1" />
              Mark all read
            </Button>
          )}
        </div>
      </div>

      {/* Notification list */}
      <div className="max-h-[400px] overflow-y-auto divide-y divide-gray-100">
        {hasNotifications ? (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onClick={(n) => {
                onNotificationClick?.(n);
                onClose?.();
              }}
            />
          ))
        ) : (
          <div className="py-12 text-center">
            <p className="text-gray-500 text-sm">No notifications yet</p>
            <p className="text-gray-400 text-xs mt-1">
              We'll let you know when something happens
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
