/**
 * CommunityActivityWidget - Dashboard widget showing recent forum activity
 *
 * Features:
 * - Skool-inspired post composer bar at top
 * - Filterable by forum via pill buttons
 * - Shows recent forum topics with "Load More" pagination
 * - Skool-style feed items with user avatar, level badge, likes/comments
 * - Shows relative time (e.g., "3d") + category
 * - Infinite scroll via Load More button
 * - Link to view all forums
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowRight, Users, Loader2, ThumbsUp, MessageCircle, ChevronRight } from 'lucide-react';
import { useRecentTopics } from '@/hooks/useRecentTopics';
import { ForumFilterPills } from '@/components/features/community/ForumFilterPills';
import { PostComposer } from '@/components/features/community/PostComposer';
import { LabelText, ActionLink } from '@/components/ui/label-text';
import { formatDistanceToNowStrict } from 'date-fns';

// TODO: Replace with actual user data
const mockCurrentUser = {
  name: 'Sarah Johnson',
  avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=e5e7eb&color=6b7280',
};

export function CommunityActivityWidget({ limit = 5 }) {
  const [selectedForum, setSelectedForum] = useState(null);
  const { topics, loading, loadingMore, hasMore, loadMore } = useRecentTopics(limit, selectedForum);

  /**
   * Format timestamp as short relative time (e.g., "3d", "2h", "5m")
   * @param {string} timestamp - ISO timestamp
   * @returns {string} - Short relative time string
   */
  const formatShortTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      const result = formatDistanceToNowStrict(date, { addSuffix: false });
      // Convert "3 days" to "3d", "2 hours" to "2h", etc.
      return result
        .replace(' seconds', 's')
        .replace(' second', 's')
        .replace(' minutes', 'm')
        .replace(' minute', 'm')
        .replace(' hours', 'h')
        .replace(' hour', 'h')
        .replace(' days', 'd')
        .replace(' day', 'd')
        .replace(' weeks', 'w')
        .replace(' week', 'w')
        .replace(' months', 'mo')
        .replace(' month', 'mo')
        .replace(' years', 'y')
        .replace(' year', 'y');
    } catch (err) {
      return 'now';
    }
  };

  /**
   * Get initials from a name
   */
  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-50 overflow-hidden" data-testid="community-activity-widget">
      <div className="px-10 py-8">
        {/* Post Composer - clean, no background */}
        <PostComposer user={mockCurrentUser} className="shadow-none" />

        {/* Forum Filter Pills */}
        <div className="mt-10 mb-12">
          <ForumFilterPills
            selectedSlug={selectedForum}
            onSelect={setSelectedForum}
          />
        </div>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : topics.length > 0 ? (
          <div className="space-y-10">
            {topics.map((topic) => (
              <a
                key={topic.id}
                href={`/community/forums/${topic.id}`}
                className="flex items-start gap-5 group"
              >
                {/* User avatar - subtle gray background */}
                <Avatar className="w-12 h-12 shrink-0">
                  <AvatarImage src={topic.author?.avatar} alt={topic.author?.name} />
                  <AvatarFallback className="bg-gray-100 text-gray-500 text-sm font-semibold">
                    {getInitials(topic.author?.name || 'User')}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  {/* Title + Category inline */}
                  <p className="mb-2">
                    <span className="font-bold text-base text-gray-900 group-hover:text-primary transition-colors">
                      {topic.title}
                    </span>
                    <LabelText className="ml-4 tracking-widest text-gray-300">
                      {topic.forumName}
                    </LabelText>
                  </p>

                  {/* Preview text - 2 lines */}
                  {topic.preview && (
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                      {topic.preview}
                    </p>
                  )}

                  {/* Bottom row: Likes, Comments, Time */}
                  <div className="flex items-center gap-6 text-sm text-gray-300">
                    <span className="flex items-center gap-2">
                      <ThumbsUp className="w-4 h-4" strokeWidth={1.5} />
                      <span>{topic.likeCount || 0}</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
                      <span>{topic.replyCount || 0}</span>
                    </span>
                    <span>{formatShortTime(topic.createdAt)}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-900 mb-1">No recent activity</p>
            <p className="text-sm text-gray-500">
              Be the first to start a discussion!
            </p>
          </div>
        )}

        {/* Load More Button */}
        {hasMore && topics.length > 0 && (
          <div className="pt-10 pb-4 text-center">
            <ActionLink
              showArrow={false}
              onClick={loadMore}
              disabled={loadingMore}
              className="text-gray-400 hover:text-gray-600 tracking-widest"
            >
              {loadingMore ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin inline" />
                  Loading...
                </>
              ) : (
                'Load More'
              )}
            </ActionLink>
          </div>
        )}
      </div>
    </div>
  );
}
