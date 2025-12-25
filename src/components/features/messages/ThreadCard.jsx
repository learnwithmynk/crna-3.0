/**
 * ThreadCard Component
 *
 * Conversation preview card showing avatar, name, last message, and unread badge.
 */

import { RelativeTime } from '@/components/ui/relative-time';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function ThreadCard({
  conversation,
  otherUser,
  isSelected = false,
  onClick,
  className
}) {
  const hasUnread = conversation.unread_count > 0;
  const lastMessage = conversation.last_message;

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-start gap-3 p-3 text-left transition-colors',
        'hover:bg-gray-50 focus:outline-none focus:bg-gray-50',
        isSelected && 'bg-blue-50 hover:bg-blue-50',
        hasUnread && 'bg-blue-50/50',
        className
      )}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <img
          src={otherUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser?.name || 'User')}&background=E5E7EB&color=374151`}
          alt={otherUser?.name || 'User'}
          className="w-12 h-12 rounded-full"
        />
        {/* Online indicator (placeholder for future) */}
        {/* <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" /> */}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h3 className={cn(
            'text-sm truncate',
            hasUnread ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'
          )}>
            {otherUser?.name || 'Unknown User'}
          </h3>
          {lastMessage && (
            <span className="text-xs text-gray-400 shrink-0">
              <RelativeTime date={lastMessage.created_at} short />
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 mt-1">
          {lastMessage ? (
            <p className={cn(
              'text-sm truncate',
              hasUnread ? 'text-gray-900' : 'text-gray-500'
            )}>
              {lastMessage.content}
            </p>
          ) : (
            <p className="text-sm text-gray-400 italic">
              No messages yet
            </p>
          )}

          {/* Unread badge */}
          {hasUnread && (
            <Badge
              variant="default"
              className="shrink-0 h-5 min-w-[20px] px-1.5 text-xs bg-blue-500"
            >
              {conversation.unread_count > 99 ? '99+' : conversation.unread_count}
            </Badge>
          )}
        </div>
      </div>
    </button>
  );
}

export default ThreadCard;
