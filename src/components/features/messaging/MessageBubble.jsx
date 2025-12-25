/**
 * MessageBubble Component
 *
 * Displays a single message in a conversation thread.
 * Styled differently based on sender (sent vs received).
 */

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Check, CheckCheck, FileText, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MESSAGE_TYPE } from '@/data/marketplace/mockConversations';

/**
 * Get initials from name
 */
function getInitials(name) {
  if (!name) return '??';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Format timestamp for display
 */
function formatTime(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  } else if (diffDays === 1) {
    return 'Yesterday ' + date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  } else if (diffDays < 7) {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      hour: 'numeric',
      minute: '2-digit'
    });
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  }
}

/**
 * System message (booking confirmations, etc.)
 */
function SystemMessage({ message }) {
  return (
    <div className="flex justify-center my-4">
      <div className="bg-gray-100 text-gray-600 text-sm px-4 py-2 rounded-full max-w-[80%] text-center">
        {message.content}
      </div>
    </div>
  );
}

/**
 * File attachment message
 */
function FileMessage({ message, isSent }) {
  return (
    <a
      href={message.fileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'flex items-center gap-2 p-3 rounded-xl',
        isSent ? 'bg-primary text-white' : 'bg-gray-100 text-gray-900'
      )}
    >
      <FileText className="w-5 h-5 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="font-medium truncate">{message.fileName || 'Attachment'}</p>
        {message.fileSize && (
          <p className={cn(
            'text-xs',
            isSent ? 'text-white/70' : 'text-gray-500'
          )}>
            {message.fileSize}
          </p>
        )}
      </div>
    </a>
  );
}

export function MessageBubble({
  message,
  isSent,
  senderName,
  senderAvatar,
  showAvatar = true,
  showTimestamp = true,
  showReadReceipt = true
}) {
  // System messages have special rendering
  if (message.type === MESSAGE_TYPE.SYSTEM) {
    return <SystemMessage message={message} />;
  }

  const isRead = message.readAt !== null;

  return (
    <div
      className={cn(
        'flex gap-2 mb-3',
        isSent ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      {showAvatar && (
        <Avatar className="w-8 h-8 shrink-0">
          {senderAvatar && <AvatarImage src={senderAvatar} alt={senderName} />}
          <AvatarFallback className="bg-primary/10 text-xs">
            {getInitials(senderName)}
          </AvatarFallback>
        </Avatar>
      )}

      {/* Message content */}
      <div
        className={cn(
          'max-w-[70%]',
          isSent ? 'items-end' : 'items-start'
        )}
      >
        {/* Sender name (for received messages) */}
        {!isSent && showAvatar && (
          <p className="text-xs text-gray-500 mb-1 ml-1">{senderName}</p>
        )}

        {/* Message bubble */}
        {message.type === MESSAGE_TYPE.FILE ? (
          <FileMessage message={message} isSent={isSent} />
        ) : (
          <div
            className={cn(
              'px-4 py-2 rounded-3xl whitespace-pre-wrap break-words',
              isSent
                ? 'bg-primary text-white rounded-br-sm'
                : 'bg-gray-100 text-gray-900 rounded-bl-sm'
            )}
          >
            {message.content}
          </div>
        )}

        {/* Timestamp and read receipt */}
        {(showTimestamp || showReadReceipt) && (
          <div
            className={cn(
              'flex items-center gap-1 mt-1 px-1',
              isSent ? 'justify-end' : 'justify-start'
            )}
          >
            {showTimestamp && (
              <span className="text-xs text-gray-400">
                {formatTime(message.createdAt)}
              </span>
            )}
            {showReadReceipt && isSent && (
              <span className="text-xs text-gray-400">
                {isRead ? (
                  <CheckCheck className="w-3.5 h-3.5 text-primary" />
                ) : (
                  <Check className="w-3.5 h-3.5" />
                )}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Spacer for alignment when no avatar */}
      {!showAvatar && <div className="w-8 shrink-0" />}
    </div>
  );
}

export default MessageBubble;
