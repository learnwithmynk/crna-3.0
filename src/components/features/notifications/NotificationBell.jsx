/**
 * NotificationBell - Bell icon button with badge and dropdown
 *
 * Shows unread count badge, opens dropdown on click.
 * Uses Radix DropdownMenu for proper accessibility and positioning.
 */

import { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu';
import { NotificationDropdown } from './NotificationDropdown';
import { cn } from '@/lib/utils';

// TODO: Replace with API call - mock notifications for development
const mockNotifications = [
  {
    id: '1',
    type: 'milestone',
    title: 'You earned a new badge!',
    message: 'First Shadow Day Complete - Way to go!',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
    isRead: false,
  },
  {
    id: '2',
    type: 'message',
    title: 'New message from Sarah M.',
    message: 'Thanks for booking! Looking forward to our mock interview session.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    isRead: false,
    avatar: null,
    avatarFallback: 'SM',
  },
  {
    id: '3',
    type: 'community',
    title: 'New reply in "GRE Study Tips"',
    message: 'Jessica replied to your post about study schedules',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    isRead: false,
  },
  {
    id: '4',
    type: 'event',
    title: 'Upcoming: Live Q&A Session',
    message: 'CRNA Panel Q&A starts in 1 hour',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    isRead: true,
  },
  {
    id: '5',
    type: 'task',
    title: 'Reminder: Update your clinical hours',
    message: "You haven't logged hours in 2 weeks",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    isRead: true,
  },
];

export function NotificationBell({ className }) {
  const [isOpen, setIsOpen] = useState(false);
  // TODO: Replace with real notifications from useNotifications hook
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleNotificationClick = (notification) => {
    // Mark as read
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notification.id ? { ...n, isRead: true } : n
      )
    );
    // TODO: Navigate to relevant page based on notification type/link
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, isRead: true }))
    );
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn('relative', className)}
          aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
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
        <NotificationDropdown
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
