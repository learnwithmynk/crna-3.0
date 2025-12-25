/**
 * ConversationThread Component
 *
 * Displays a full conversation thread with messages, header,
 * and input. Handles scrolling and real-time updates.
 */

import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Calendar, MoreVertical, Archive, Flag, Trash2 } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { cn } from '@/lib/utils';

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
 * Format date for message grouping
 */
function formatDateHeader(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }
}

/**
 * Group messages by date
 */
function groupMessagesByDate(messages) {
  const groups = [];
  let currentDate = null;

  messages.forEach(message => {
    const msgDate = new Date(message.createdAt).toDateString();

    if (msgDate !== currentDate) {
      currentDate = msgDate;
      groups.push({
        date: message.createdAt,
        messages: [message]
      });
    } else {
      groups[groups.length - 1].messages.push(message);
    }
  });

  return groups;
}

/**
 * Conversation header with participant info
 */
function ConversationHeader({
  participant,
  bookingContext,
  onBack,
  onArchive,
  onReport,
  showBackButton = true
}) {
  return (
    <div className="border-b bg-white p-3 flex items-center gap-3">
      {showBackButton && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="shrink-0 lg:hidden"
          aria-label="Back to conversations"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
      )}

      <Avatar className="h-10 w-10 shrink-0">
        {participant.avatar && (
          <AvatarImage src={participant.avatar} alt={participant.name} />
        )}
        <AvatarFallback className="bg-primary/10">
          {getInitials(participant.name)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold truncate">{participant.name}</h3>
        {bookingContext && (
          <p className="text-sm text-gray-500 truncate">
            Regarding: {bookingContext.serviceName}
          </p>
        )}
      </div>

      {/* Booking CTA */}
      {participant.providerId && (
        <Link to={`/marketplace/mentor/${participant.providerId}`}>
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <Calendar className="w-4 h-4 mr-1" />
            Book with {participant.name.split(' ')[0]}
          </Button>
        </Link>
      )}

      {/* Actions menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="More options">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {onArchive && (
            <DropdownMenuItem onClick={onArchive}>
              <Archive className="w-4 h-4 mr-2" />
              Archive conversation
            </DropdownMenuItem>
          )}
          {onReport && (
            <DropdownMenuItem onClick={onReport} className="text-red-600">
              <Flag className="w-4 h-4 mr-2" />
              Report conversation
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

/**
 * Loading skeleton for thread
 */
function ThreadSkeleton() {
  return (
    <div className="flex-1 p-4 space-y-4">
      <div className="flex justify-start">
        <div className="flex gap-2">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="w-48 h-16 rounded-3xl" />
        </div>
      </div>
      <div className="flex justify-end">
        <Skeleton className="w-40 h-12 rounded-3xl" />
      </div>
      <div className="flex justify-start">
        <div className="flex gap-2">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="w-56 h-20 rounded-3xl" />
        </div>
      </div>
    </div>
  );
}

/**
 * Empty state for new conversation
 */
function EmptyThread({ participant }) {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-sm">
        <Avatar className="h-16 w-16 mx-auto mb-4">
          {participant.avatar && (
            <AvatarImage src={participant.avatar} alt={participant.name} />
          )}
          <AvatarFallback className="bg-primary/10 text-xl">
            {getInitials(participant.name)}
          </AvatarFallback>
        </Avatar>
        <h3 className="font-semibold text-lg">{participant.name}</h3>
        <p className="text-gray-500 mt-2">
          Start a conversation with {participant.name.split(' ')[0]}.
          Ask questions about their services or discuss your goals.
        </p>
      </div>
    </div>
  );
}

export function ConversationThread({
  conversation,
  messages,
  currentUserId,
  loading = false,
  onSendMessage,
  onBack,
  onArchive,
  onReport,
  showBackButton = true,
  className
}) {
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const [autoScroll, setAutoScroll] = useState(true);

  // Get the other participant (not current user)
  const participant = conversation?.participants?.find(
    p => p.userId !== currentUserId
  ) || conversation?.participant || { name: 'Unknown' };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, autoScroll]);

  // Handle scroll to detect if user scrolled up
  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
      setAutoScroll(isAtBottom);
    }
  };

  // Group messages by date
  const messageGroups = messages ? groupMessagesByDate(messages) : [];

  return (
    <div className={cn('flex flex-col h-full bg-gray-50', className)}>
      {/* Header */}
      {conversation && (
        <ConversationHeader
          participant={participant}
          bookingContext={conversation.bookingContext}
          onBack={onBack}
          onArchive={onArchive}
          onReport={onReport}
          showBackButton={showBackButton}
        />
      )}

      {/* Messages area */}
      {loading ? (
        <ThreadSkeleton />
      ) : messages?.length === 0 ? (
        <EmptyThread participant={participant} />
      ) : (
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-4"
        >
          {messageGroups.map((group, groupIndex) => (
            <div key={group.date}>
              {/* Date header */}
              <div className="flex justify-center my-4">
                <Badge variant="secondary" className="text-xs font-normal">
                  {formatDateHeader(group.date)}
                </Badge>
              </div>

              {/* Messages in group */}
              {group.messages.map((message, msgIndex) => {
                const isSent = message.senderId === currentUserId;
                const sender = conversation?.participants?.find(
                  p => p.userId === message.senderId
                );

                // Only show avatar for first message in a sequence from same sender
                const prevMessage = msgIndex > 0 ? group.messages[msgIndex - 1] : null;
                const showAvatar = !isSent && prevMessage?.senderId !== message.senderId;

                return (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isSent={isSent}
                    senderName={sender?.name || participant.name}
                    senderAvatar={sender?.avatar || participant.avatar}
                    showAvatar={showAvatar}
                    showTimestamp={true}
                    showReadReceipt={isSent}
                  />
                );
              })}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Message input */}
      {conversation && (
        <MessageInput
          onSend={onSendMessage}
          placeholder={`Message ${participant.name?.split(' ')[0]}...`}
          disabled={loading}
        />
      )}
    </div>
  );
}

export default ConversationThread;
