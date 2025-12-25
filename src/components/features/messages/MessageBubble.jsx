/**
 * MessageBubble Component
 *
 * Single message bubble in chat-style layout.
 * Own messages: right-aligned, primary color
 * Other messages: left-aligned, gray background
 */

import { MoreHorizontal, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { RelativeTime } from '@/components/ui/relative-time';
import { cn } from '@/lib/utils';

export function MessageBubble({
  message,
  isOwn = false,
  sender,
  showAvatar = true,
  onDelete,
  className
}) {
  const canDelete = isOwn && onDelete;

  return (
    <div
      className={cn(
        'flex gap-2 group',
        isOwn ? 'flex-row-reverse' : 'flex-row',
        className
      )}
    >
      {/* Avatar */}
      {showAvatar && !isOwn && (
        <img
          src={sender?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(sender?.name || 'User')}&background=E5E7EB&color=374151`}
          alt={sender?.name || 'User'}
          className="w-8 h-8 rounded-full shrink-0 mt-1"
        />
      )}

      {/* Spacer for alignment when no avatar */}
      {showAvatar && !isOwn && !sender?.avatar && (
        <div className="w-8 shrink-0" />
      )}

      {/* Message content */}
      <div
        className={cn(
          'flex flex-col max-w-[75%]',
          isOwn ? 'items-end' : 'items-start'
        )}
      >
        {/* Sender name (for other's messages) */}
        {!isOwn && sender?.name && (
          <span className="text-xs text-gray-500 mb-1 px-1">
            {sender.name}
          </span>
        )}

        {/* Bubble */}
        <div className="flex items-start gap-1">
          {/* Actions dropdown (for own messages) */}
          {canDelete && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                >
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => onDelete(message.id)}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <div
            className={cn(
              'rounded-3xl px-4 py-2',
              isOwn
                ? 'bg-blue-500 text-white rounded-br-md'
                : 'bg-gray-100 text-gray-900 rounded-bl-md'
            )}
          >
            <p className="text-sm whitespace-pre-wrap break-words">
              {message.content}
            </p>
          </div>
        </div>

        {/* Timestamp */}
        <span className={cn(
          'text-xs text-gray-400 mt-1 px-1',
          isOwn ? 'text-right' : 'text-left'
        )}>
          <RelativeTime date={message.created_at} />
        </span>
      </div>
    </div>
  );
}

export default MessageBubble;
