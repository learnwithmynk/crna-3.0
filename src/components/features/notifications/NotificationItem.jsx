/**
 * NotificationItem - Individual notification item in the dropdown
 *
 * Displays notification type icon, message, time, and read status.
 * Supports various notification types: message, milestone, marketplace, community, system
 */

import {
  MessageSquare,
  Trophy,
  ShoppingBag,
  Users,
  Bell,
  CheckCircle,
  Calendar,
  Star
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const typeIcons = {
  message: MessageSquare,
  milestone: Trophy,
  marketplace: ShoppingBag,
  community: Users,
  event: Calendar,
  badge: Star,
  task: CheckCircle,
  system: Bell,
};

const typeColors = {
  message: 'bg-blue-100 text-blue-600',
  milestone: 'bg-yellow-100 text-yellow-600',
  marketplace: 'bg-green-100 text-green-600',
  community: 'bg-purple-100 text-purple-600',
  event: 'bg-orange-100 text-orange-600',
  badge: 'bg-pink-100 text-pink-600',
  task: 'bg-teal-100 text-teal-600',
  system: 'bg-gray-100 text-gray-600',
};

export function NotificationItem({
  notification,
  onClick,
  className
}) {
  const {
    id,
    type = 'system',
    title,
    message,
    timestamp,
    isRead = false,
    avatar,
    avatarFallback,
  } = notification;

  const Icon = typeIcons[type] || Bell;
  const colorClass = typeColors[type] || typeColors.system;

  const formatTime = (ts) => {
    if (!ts) return '';
    const date = new Date(ts);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <button
      onClick={() => onClick?.(notification)}
      className={cn(
        'w-full flex items-start gap-3 p-3 text-left transition-colors hover:bg-gray-50 focus:outline-none focus:bg-gray-50',
        !isRead && 'bg-blue-50/50',
        className
      )}
    >
      {/* Avatar or Icon */}
      {avatar ? (
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarImage src={avatar} alt="" />
          <AvatarFallback>{avatarFallback || '?'}</AvatarFallback>
        </Avatar>
      ) : (
        <div className={cn('p-2 rounded-full shrink-0', colorClass)}>
          <Icon className="w-4 h-4" />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={cn(
          'text-sm line-clamp-1',
          !isRead ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'
        )}>
          {title}
        </p>
        {message && (
          <p className="text-sm text-gray-500 line-clamp-2 mt-0.5">
            {message}
          </p>
        )}
        <p className="text-xs text-gray-400 mt-1">
          {formatTime(timestamp)}
        </p>
      </div>

      {/* Unread indicator */}
      {!isRead && (
        <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-2" />
      )}
    </button>
  );
}