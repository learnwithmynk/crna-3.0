/**
 * TopicCard Component
 *
 * Facebook-style expandable post card displaying a forum topic/post.
 * Features:
 * - Avatar + name + role badge (ADMIN/MODERATOR) + timestamp
 * - Post title and content
 * - "Liked by [Name]" indicator
 * - Like + Comment buttons with counts
 * - Inline expand/collapse comments (no page navigation)
 * - "View all X comments" link for posts with many comments
 */

import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ThumbsUp, MessageSquare, ChevronDown, ChevronUp, MoreHorizontal, Pin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { RelativeTime } from '@/components/ui/relative-time';
import { HtmlContent } from '@/components/ui/html-content';
import { ReplyList } from './ReplyList';
import { ReplyFormCompact } from './ReplyForm';
import { cn } from '@/lib/utils';
import { getMockRepliesForTopic, availableReactions } from '@/data/mockReplies';
import { mockUsers } from '@/data/mockTopics';

// Role badge component
function RoleBadge({ role }) {
  if (!role) return null;

  const roleStyles = {
    admin: 'bg-emerald-500 text-white',
    moderator: 'bg-amber-500 text-white',
    srna: 'bg-purple-500 text-white',
  };

  const roleLabels = {
    admin: 'ADMIN',
    moderator: 'MODERATOR',
    srna: 'SRNA',
  };

  return (
    <Badge className={cn('text-[10px] px-1.5 py-0 font-semibold', roleStyles[role])}>
      {roleLabels[role]}
    </Badge>
  );
}

// Liked by indicator
function LikedByIndicator({ likedBy, totalLikes }) {
  if (!likedBy || likedBy.length === 0) return null;

  const firstLiker = likedBy[0];
  const othersCount = totalLikes - 1;

  return (
    <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
      <Avatar className="w-5 h-5">
        <img src={firstLiker.avatar} alt={firstLiker.name} className="w-full h-full object-cover" />
      </Avatar>
      <span>
        Liked by <span className="font-medium text-gray-700">{firstLiker.name}</span>
        {othersCount > 0 && ` and ${othersCount} other${othersCount > 1 ? 's' : ''}`}
      </span>
    </div>
  );
}

export function TopicCard({ topic, forumId, className }) {
  const {
    id,
    title,
    content,
    author,
    reply_count,
    voice_count,
    created,
    last_active,
    sticky,
    reactions = {}
  } = topic;

  const [expanded, setExpanded] = useState(false);
  const [replies, setReplies] = useState([]);
  const [repliesLoaded, setRepliesLoaded] = useState(false);

  // Track reactions locally for interactivity (reactions is an object like { like: [user1, user2], love: [user3] })
  const [localReactions, setLocalReactions] = useState(reactions || {});
  const [showReactionPicker, setShowReactionPicker] = useState(false);

  const currentUserId = mockUsers.currentUser.id;

  // Get user's current reaction (if any)
  const userReaction = Object.entries(localReactions).find(
    ([, users]) => users?.some(u => u.id === currentUserId)
  )?.[0];

  // Calculate total reactions
  const totalReactions = Object.values(localReactions).reduce(
    (sum, users) => sum + (users?.length || 0),
    0
  );

  // Get top reactions to display emoji icons
  const topReactions = Object.entries(localReactions)
    .filter(([, users]) => users?.length > 0)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 3);

  // Get all users who reacted for "Liked by" display
  const allReactors = Object.values(localReactions).flat().filter(Boolean);
  const likedBy = allReactors;

  // Strip HTML and truncate for excerpt
  const getExcerpt = (html, maxLength = 200) => {
    if (!html) return '';
    const temp = document.createElement('div');
    temp.innerHTML = html;
    const text = temp.textContent || temp.innerText || '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const excerpt = content?.rendered ? getExcerpt(content.rendered) : '';

  // Handle reaction toggle
  const handleReact = useCallback((reactionId) => {
    setLocalReactions(prev => {
      const newReactions = { ...prev };

      // Remove user from any existing reaction
      Object.keys(newReactions).forEach(key => {
        if (newReactions[key]) {
          newReactions[key] = newReactions[key].filter(u => u.id !== currentUserId);
        }
      });

      // If clicking same reaction, just remove (toggle off)
      if (userReaction === reactionId) {
        return newReactions;
      }

      // Add user to new reaction
      if (!newReactions[reactionId]) {
        newReactions[reactionId] = [];
      }
      newReactions[reactionId] = [...newReactions[reactionId], mockUsers.currentUser];

      return newReactions;
    });
    setShowReactionPicker(false);
  }, [userReaction, currentUserId]);

  // Load replies when expanded
  const handleToggleExpand = useCallback(() => {
    if (!expanded && !repliesLoaded) {
      // Load replies on first expand
      const topicReplies = getMockRepliesForTopic(id);
      setReplies(topicReplies);
      setRepliesLoaded(true);
    }
    setExpanded(!expanded);
  }, [expanded, repliesLoaded, id]);

  // Handle submitting a new comment
  const handleSubmitReply = useCallback(async (content, parentId = null) => {
    const newReply = {
      id: Date.now(),
      topic_id: id,
      parent_id: parentId,
      depth: parentId ? 1 : 0,
      content: { rendered: `<p>${content}</p>` },
      author: mockUsers.currentUser,
      created: new Date().toISOString(),
      edited: false,
      reactions: { like: [], love: [], laugh: [] },
      reaction_count: 0,
      reply_count: 0,
      mentions: [],
      media: []
    };
    setReplies(prev => [...prev, newReply]);
  }, [id]);

  // Threshold for "View all comments" link
  const INLINE_COMMENT_LIMIT = 10;
  const hasMoreComments = reply_count > INLINE_COMMENT_LIMIT;

  return (
    <Card
      className={cn(
        'bg-white overflow-hidden',
        sticky && 'ring-1 ring-primary/20',
        className
      )}
    >
      {/* Sticky indicator */}
      {sticky && (
        <div className="bg-primary/10 px-4 py-1.5 flex items-center gap-2 text-xs font-medium text-primary border-b border-primary/10">
          <Pin className="w-3.5 h-3.5" />
          Pinned
        </div>
      )}

      <div className="p-4">
        {/* Header: Avatar + Author info + Actions */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <Link to={`/community/members/${author.id}`}>
              <Avatar className="w-10 h-10 shrink-0 ring-2 ring-white shadow-sm">
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="w-full h-full object-cover"
                />
              </Avatar>
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <Link
                  to={`/community/members/${author.id}`}
                  className="font-semibold text-gray-900 hover:underline"
                >
                  {author.name}
                </Link>
                <RoleBadge role={author.role} />
                <span className="text-gray-400">·</span>
                <RelativeTime date={created} className="text-sm text-gray-500" />
              </div>
            </div>
          </div>

          {/* Actions: Share + More */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-gray-500 hover:text-gray-700"
              onClick={(e) => {
                e.preventDefault();
                // TODO: Share functionality
              }}
            >
              Share
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:text-gray-600"
              onClick={(e) => {
                e.preventDefault();
                // TODO: More actions menu
              }}
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Title */}
        <h3
          className="font-semibold text-gray-900 text-lg mt-3 cursor-pointer hover:text-primary transition-colors"
          onClick={handleToggleExpand}
        >
          {title.rendered}
        </h3>

        {/* Content - show excerpt when collapsed, full when expanded */}
        {!expanded && excerpt && (
          <p
            className="text-gray-600 mt-2 line-clamp-3 cursor-pointer"
            onClick={handleToggleExpand}
          >
            {excerpt}
          </p>
        )}

        {expanded && content?.rendered && (
          <HtmlContent
            html={content.rendered}
            className="text-gray-600 mt-2"
          />
        )}

        {/* Liked by indicator */}
        {totalReactions > 0 && (
          <LikedByIndicator likedBy={likedBy} totalLikes={totalReactions} />
        )}

        {/* Action bar: Like + Comment */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1">
            {/* Reaction button with emoji picker */}
            <Popover open={showReactionPicker} onOpenChange={setShowReactionPicker}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-8 px-3",
                    userReaction
                      ? "text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  )}
                >
                  {/* Show reaction emojis if there are any */}
                  {topReactions.length > 0 ? (
                    <span className="flex -space-x-0.5 mr-1.5">
                      {topReactions.map(([id]) => {
                        const reaction = availableReactions.find(r => r.id === id);
                        return <span key={id} className="text-sm">{reaction?.icon}</span>;
                      })}
                    </span>
                  ) : (
                    <ThumbsUp className={cn("w-4 h-4 mr-1.5", userReaction && "fill-current")} />
                  )}
                  {userReaction ? (
                    availableReactions.find(r => r.id === userReaction)?.label || 'Liked'
                  ) : 'Like'}
                  {totalReactions > 0 && ` (${totalReactions})`}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2 bg-white shadow-lg border border-gray-200 rounded-full" align="start">
                <div className="flex gap-2">
                  {availableReactions.map((reaction) => (
                    <button
                      key={reaction.id}
                      onClick={() => handleReact(reaction.id)}
                      className={cn(
                        'p-2 rounded-full hover:bg-gray-100 transition-transform hover:scale-125',
                        userReaction === reaction.id && 'bg-blue-50 ring-2 ring-blue-200'
                      )}
                      title={reaction.label}
                    >
                      <span className="text-2xl">{reaction.icon}</span>
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* Comment button - toggles expansion */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              onClick={handleToggleExpand}
            >
              <MessageSquare className="w-4 h-4 mr-1.5" />
              Comment
            </Button>
          </div>

          {/* Comment count + expand/collapse indicator */}
          {reply_count > 0 && (
            <button
              onClick={handleToggleExpand}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              {reply_count} comment{reply_count !== 1 ? 's' : ''}
              {expanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Expanded comments section */}
      {expanded && (
        <div className="border-t border-gray-100">
          {/* Comments list */}
          <ReplyList
            replies={replies}
            loading={false}
            total={replies.length}
            totalPages={1}
            currentPage={1}
            currentUserId={currentUserId}
            onEditReply={(reply) => console.log('Edit reply:', reply.id)}
            onDeleteReply={(reply) => {
              setReplies(prev => prev.filter(r => r.id !== reply.id));
            }}
            onReportReply={(reply, reason) => {
              console.log('Report reply:', reply.id, 'reason:', reason);
              alert('Thank you for your report. Our team will review it.');
            }}
            onCreateReply={handleSubmitReply}
            onReactToReply={(replyId, reactionId) => {
              console.log('React to reply:', replyId, 'with:', reactionId);
            }}
            embedded={true}
          />

          {/* View all comments link for posts with many comments */}
          {hasMoreComments && (
            <div className="px-4 py-2 border-t border-gray-100">
              <Link
                to={`/community/forums/${forumId}/${id}`}
                className="text-sm text-primary hover:underline"
              >
                View all {reply_count} comments
              </Link>
            </div>
          )}

          {/* Comment input */}
          <div className="border-t border-gray-100 p-4 bg-gray-50/30">
            <ReplyFormCompact
              onSubmit={(content) => handleSubmitReply(content)}
              placeholder="Write a comment..."
            />
          </div>
        </div>
      )}
    </Card>
  );
}

// Compact variant for search results or sidebar (unchanged)
export function TopicCardCompact({ topic, forumId, className }) {
  const { id, title, author, reply_count, last_active, sticky } = topic;

  return (
    <Link
      to={`/community/forums/${forumId}/${id}`}
      className={cn(
        'block p-3 rounded-xl hover:bg-gray-50 transition-colors',
        sticky && 'bg-primary/5',
        className
      )}
    >
      <div className="flex items-center gap-2">
        {sticky && <Pin className="w-3.5 h-3.5 text-primary shrink-0" />}
        <span className="font-medium text-gray-900 truncate flex-1">
          {title.rendered}
        </span>
        <span className="text-xs text-gray-500 shrink-0">
          {reply_count} replies
        </span>
      </div>
      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
        <span>{author.name}</span>
        <span>·</span>
        <RelativeTime date={last_active} className="text-xs" />
      </div>
    </Link>
  );
}

export default TopicCard;
