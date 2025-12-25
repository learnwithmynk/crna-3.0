/**
 * ThreadList Component
 *
 * List of conversation threads with search functionality.
 */

import { useState } from 'react';
import { Search, MessageCircle, Plus } from 'lucide-react';
import { ThreadCard } from './ThreadCard';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { cn } from '@/lib/utils';

export function ThreadList({
  conversations,
  loading = false,
  selectedId,
  onSelect,
  onNewConversation,
  getOtherUser,
  searchConversations,
  className
}) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter conversations by search
  const displayConversations = searchQuery && searchConversations
    ? searchConversations(searchQuery)
    : conversations;

  // Loading state
  if (loading) {
    return (
      <div className={cn('flex flex-col h-full', className)}>
        <div className="p-3 border-b border-gray-200">
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="flex-1 overflow-y-auto">
          {[1, 2, 3, 4, 5].map((i) => (
            <ThreadCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header with search and new message button */}
      <div className="p-3 border-b border-gray-200 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
          {onNewConversation && (
            <Button
              onClick={onNewConversation}
              size="sm"
              variant="outline"
            >
              <Plus className="w-4 h-4 mr-1" />
              New
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto">
        {displayConversations.length === 0 ? (
          searchQuery ? (
            <Card className="m-3 p-6 text-center text-gray-500">
              No conversations found matching "{searchQuery}"
            </Card>
          ) : (
            <EmptyState
              icon={MessageCircle}
              title="No messages yet"
              description="Start a conversation with someone in the community!"
              action={onNewConversation && {
                label: 'New Message',
                onClick: onNewConversation
              }}
              className="p-6"
            />
          )
        ) : (
          <div className="divide-y divide-gray-100">
            {displayConversations.map((conversation) => (
              <ThreadCard
                key={conversation.id}
                conversation={conversation}
                otherUser={getOtherUser?.(conversation)}
                isSelected={conversation.id === selectedId}
                onClick={() => onSelect?.(conversation.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Skeleton for loading state
function ThreadCardSkeleton() {
  return (
    <div className="flex items-start gap-3 p-3">
      <Skeleton className="w-12 h-12 rounded-full shrink-0" />
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-12" />
        </div>
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
}

export default ThreadList;
