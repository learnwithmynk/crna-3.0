/**
 * TopicHeader Component
 *
 * Header for topic detail page showing title, author, stats, and actions.
 */

import { useState } from 'react';
import {
  MessageSquare,
  Users,
  Clock,
  Pin,
  Bell,
  BellOff,
  MoreVertical,
  Edit,
  Trash2,
  Flag
} from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { RelativeTime } from '@/components/ui/relative-time';
import { HtmlContent } from '@/components/ui/html-content';
import { cn } from '@/lib/utils';

export function TopicHeader({
  topic,
  isAuthor = false,
  subscribed = false,
  onSubscribe,
  onEdit,
  onDelete,
  onReport,
  className
}) {
  const {
    title,
    content,
    author,
    reply_count,
    voice_count,
    created,
    last_active,
    sticky
  } = topic;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Title row */}
      <div className="flex items-start gap-3">
        {/* Sticky badge */}
        {sticky && (
          <Badge variant="secondary" className="shrink-0 mt-1">
            <Pin className="w-3 h-3 mr-1" />
            Pinned
          </Badge>
        )}

        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex-1">
          {title.rendered}
        </h1>

        {/* Actions dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onSubscribe}>
              {subscribed ? (
                <>
                  <BellOff className="w-4 h-4 mr-2" />
                  Unsubscribe
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4 mr-2" />
                  Subscribe
                </>
              )}
            </DropdownMenuItem>

            {isAuthor && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onEdit}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit topic
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={onDelete}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete topic
                </DropdownMenuItem>
              </>
            )}

            {!isAuthor && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onReport}>
                  <Flag className="w-4 h-4 mr-2" />
                  Report
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Author and meta */}
      <div className="flex items-center gap-3">
        <Avatar className="w-10 h-10">
          <img
            src={author.avatar}
            alt={author.name}
            className="w-full h-full object-cover"
          />
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="font-medium text-gray-900">{author.name}</div>
          <div className="text-sm text-gray-500">
            <RelativeTime date={created} />
            {author.member_since && (
              <span className="hidden sm:inline">
                {' · '}Member since {new Date(author.member_since).toLocaleDateString(undefined, {
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Topic content */}
      <div className="pt-2">
        <HtmlContent
          html={content.rendered}
          className="text-gray-700"
        />
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-4 pt-4 border-t border-gray-200 text-sm text-gray-500">
        <span className="flex items-center gap-1.5">
          <MessageSquare className="w-4 h-4" />
          {reply_count} {reply_count === 1 ? 'reply' : 'replies'}
        </span>

        <span className="flex items-center gap-1.5">
          <Users className="w-4 h-4" />
          {voice_count} {voice_count === 1 ? 'participant' : 'participants'}
        </span>

        {last_active && last_active !== created && (
          <span className="flex items-center gap-1.5 ml-auto">
            <Clock className="w-4 h-4" />
            <span className="hidden sm:inline">Last active </span>
            <RelativeTime date={last_active} showTooltip={false} className="text-sm text-gray-500" />
          </span>
        )}
      </div>
    </div>
  );
}

export default TopicHeader;
