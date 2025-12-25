/**
 * ThreadDetail Component
 *
 * Full conversation view with header, message list, and input.
 */

import { useRef, useEffect } from 'react';
import { ChevronLeft, MoreVertical } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export function ThreadDetail({
  conversation,
  otherUser,
  messages,
  loading = false,
  sending = false,
  onSend,
  onDelete,
  onBack,
  isOwnMessage,
  getSender,
  className
}) {
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Loading state for conversation
  if (loading && !conversation) {
    return (
      <div className={cn('flex flex-col h-full', className)}>
        <ThreadHeaderSkeleton onBack={onBack} />
        <div className="flex-1 p-4 space-y-4">
          {[1, 2, 3].map((i) => (
            <MessageBubbleSkeleton key={i} isOwn={i % 2 === 0} />
          ))}
        </div>
        <div className="p-3 border-t border-gray-200">
          <Skeleton className="h-11 w-full" />
        </div>
      </div>
    );
  }

  // No conversation selected
  if (!conversation) {
    return (
      <div className={cn('flex flex-col h-full items-center justify-center text-gray-500', className)}>
        <p>Select a conversation to start messaging</p>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="flex items-center gap-3 p-3 border-b border-gray-200 bg-white">
        {onBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="shrink-0 lg:hidden"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        )}

        <img
          src={otherUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser?.name || 'User')}&background=E5E7EB&color=374151`}
          alt={otherUser?.name || 'User'}
          className="w-10 h-10 rounded-full shrink-0"
        />

        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-gray-900 truncate">
            {otherUser?.name || 'Unknown User'}
          </h2>
          {/* Could add online status here */}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View Profile</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">Block User</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50"
      >
        {loading ? (
          <>
            {[1, 2, 3].map((i) => (
              <MessageBubbleSkeleton key={i} isOwn={i % 2 === 0} />
            ))}
          </>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
            <p>No messages yet. Say hello!</p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => {
              const isOwn = isOwnMessage?.(message) ?? false;
              const sender = !isOwn ? getSender?.(message) : null;

              // Show avatar only for first message in a sequence from same sender
              const prevMessage = messages[index - 1];
              const showAvatar = !prevMessage || prevMessage.sender_id !== message.sender_id;

              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwn={isOwn}
                  sender={sender}
                  showAvatar={showAvatar}
                  onDelete={isOwn ? onDelete : undefined}
                />
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-200 bg-white">
        <MessageInput
          onSend={onSend}
          sending={sending}
          placeholder={`Message ${otherUser?.name || 'User'}...`}
          autoFocus
        />
      </div>
    </div>
  );
}

// Skeleton for header
function ThreadHeaderSkeleton({ onBack }) {
  return (
    <div className="flex items-center gap-3 p-3 border-b border-gray-200">
      {onBack && (
        <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0 lg:hidden">
          <ChevronLeft className="w-5 h-5" />
        </Button>
      )}
      <Skeleton className="w-10 h-10 rounded-full shrink-0" />
      <div className="flex-1">
        <Skeleton className="h-5 w-32" />
      </div>
    </div>
  );
}

// Skeleton for message bubble
function MessageBubbleSkeleton({ isOwn }) {
  return (
    <div className={cn('flex gap-2', isOwn ? 'flex-row-reverse' : 'flex-row')}>
      {!isOwn && <Skeleton className="w-8 h-8 rounded-full shrink-0" />}
      <Skeleton className={cn('h-12 rounded-3xl', isOwn ? 'w-48' : 'w-64')} />
    </div>
  );
}

export default ThreadDetail;
