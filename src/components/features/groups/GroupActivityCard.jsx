/**
 * GroupActivityCard Component
 *
 * Single activity item in group feed.
 * Shows author, content, and engagement metrics.
 */

import { Heart, MessageCircle, MoreHorizontal, Trash2, Flag } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { HtmlContent } from '@/components/ui/html-content';
import { RelativeTime } from '@/components/ui/relative-time';
import { cn } from '@/lib/utils';

export function GroupActivityCard({
  activity,
  isAuthor = false,
  onFavorite,
  onComment,
  onDelete,
  onReport,
  className
}) {
  const {
    user,
    content,
    date,
    comment_count,
    favorite_count,
    favorited
  } = activity;

  return (
    <Card className={cn('p-4', className)}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 shrink-0">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </Avatar>
          <div>
            <p className="font-medium text-gray-900">{user.name}</p>
            <RelativeTime date={date} className="text-sm text-gray-500" />
          </div>
        </div>

        {/* Actions dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {isAuthor ? (
              <DropdownMenuItem
                onClick={onDelete}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Post
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={onReport}>
                <Flag className="w-4 h-4 mr-2" />
                Report Post
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Content */}
      <HtmlContent html={content.rendered} className="text-gray-700 mb-4" />

      {/* Engagement */}
      <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
        <button
          onClick={onFavorite}
          className={cn(
            'flex items-center gap-1.5 text-sm transition-colors',
            favorited
              ? 'text-red-500'
              : 'text-gray-500 hover:text-red-500'
          )}
        >
          <Heart
            className={cn('w-4 h-4', favorited && 'fill-current')}
          />
          {favorite_count > 0 && <span>{favorite_count}</span>}
        </button>

        <button
          onClick={onComment}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          {comment_count > 0 && <span>{comment_count}</span>}
        </button>
      </div>
    </Card>
  );
}

export default GroupActivityCard;
