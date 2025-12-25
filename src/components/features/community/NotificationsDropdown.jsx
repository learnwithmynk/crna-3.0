/**
 * NotificationsDropdown Component
 *
 * Dropdown panel showing list of notifications.
 * Displays inside NotificationBell's dropdown menu.
 *
 * Features:
 * - List of notification items with icons based on type
 * - Click notification to navigate to content
 * - "Mark all as read" button
 * - Empty state when no notifications
 * - Scrollable list (max height)
 * - Relative time display
 *
 * Props:
 * - notifications: Array of notification objects
 * - unreadCount: Number of unread notifications
 * - onNotificationClick: Function(notification)
 * - onMarkAllRead: Function()
 * - onClose: Function() to close dropdown
 */

import {
  MessageSquare,
  Reply,
  AtSign,
  Heart,
  ThumbsUp,
  Smile,
  Check,
  Bell,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RelativeTime } from '@/components/ui/relative-time';
import { cn } from '@/lib/utils';

// Icon mapping based on notification type
const notificationIcons = {
  topic_reply: MessageSquare,
  reply_to_reply: Reply,
  mentioned: AtSign,
  reaction_received: Heart,
};

// Color mapping for icon backgrounds
const notificationColors = {
  topic_reply: 'bg-blue-100 text-blue-600',
  reply_to_reply: 'bg-purple-100 text-purple-600',
  mentioned: 'bg-yellow-100 text-yellow-600',
  reaction_received: 'bg-pink-100 text-pink-600',
};

export function NotificationsDropdown({
  notifications,
  unreadCount,
  onNotificationClick,
  onMarkAllRead,
  onClose,
}) {
  return (
    <div
      className="w-96 bg-white border rounded-xl shadow-lg"
      data-testid="notifications-dropdown"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-600 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMarkAllRead}
            className="text-xs text-blue-600 hover:text-blue-700"
          >
            Mark all read
          </Button>
        )}
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
            <Bell className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-900 mb-1">No notifications yet</p>
          <p className="text-xs text-gray-500">
            You'll see updates here when people interact with your posts
          </p>
        </div>
      ) : (
        <ScrollArea className="max-h-[500px]">
          <div className="divide-y">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClick={() => onNotificationClick(notification)}
              />
            ))}
          </div>
        </ScrollArea>
      )}

      {/* Footer (optional - could link to full notifications page) */}
      {notifications.length > 0 && (
        <div className="px-4 py-3 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            View all notifications
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * NotificationItem Component
 *
 * Individual notification in the list.
 */
function NotificationItem({ notification, onClick }) {
  const Icon = notificationIcons[notification.type] || MessageSquare;
  const iconColor = notificationColors[notification.type] || 'bg-gray-100 text-gray-600';

  // Get initials for avatar fallback
  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors text-left',
        !notification.is_read && 'bg-blue-50 hover:bg-blue-100'
      )}
      data-testid="notification-item"
    >
      {/* Actor Avatar or Type Icon */}
      {notification.actor_avatar || notification.actor_name ? (
        <Avatar className="w-10 h-10 flex-shrink-0">
          <AvatarImage src={notification.actor_avatar} alt={notification.actor_name} />
          <AvatarFallback className="text-xs">
            {getInitials(notification.actor_name)}
          </AvatarFallback>
        </Avatar>
      ) : (
        <div className={cn('w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0', iconColor)}>
          <Icon className="w-5 h-5" />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 mb-0.5">
          {notification.title}
        </p>
        {notification.message && (
          <p className="text-xs text-gray-600 mb-1 line-clamp-2">
            {notification.message}
          </p>
        )}
        <p className="text-xs text-gray-500">
          <RelativeTime date={notification.created_at} />
        </p>
      </div>

      {/* Unread indicator */}
      {!notification.is_read && (
        <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1" />
      )}
    </button>
  );
}
