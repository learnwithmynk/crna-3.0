/**
 * NotificationBell Component
 *
 * Bell icon with unread count badge that opens notifications dropdown.
 * Uses useCommunityNotifications hook for data and realtime updates.
 *
 * Features:
 * - Bell icon from lucide-react
 * - Unread count badge (red circle with number)
 * - Click to open/close dropdown
 * - Accessible aria labels
 *
 * Props:
 * - className: Optional additional classes
 */

import { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu';
import { NotificationsDropdown } from './NotificationsDropdown';
import { useCommunityNotifications } from '@/hooks/useCommunityNotifications';
import { cn } from '@/lib/utils';

export function NotificationBell({ className }) {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useCommunityNotifications();

  const handleNotificationClick = (notification) => {
    // Mark as read
    markAsRead(notification.id);

    // Navigate to the linked content
    if (notification.link) {
      window.location.href = notification.link;
    }
  };

  const handleMarkAllRead = () => {
    markAllAsRead();
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn('relative', className)}
          aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
          data-testid="notification-bell"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium"
              data-testid="unread-badge"
              aria-label={`${unreadCount} unread notifications`}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="p-0 w-auto border-0 bg-transparent shadow-none"
      >
        <NotificationsDropdown
          notifications={notifications}
          unreadCount={unreadCount}
          onNotificationClick={handleNotificationClick}
          onMarkAllRead={handleMarkAllRead}
          onClose={() => setIsOpen(false)}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
