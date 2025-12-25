/**
 * GroupHeader Component
 *
 * Hero section for group detail page.
 * Shows cover image, avatar, name, description, and action buttons.
 */

import { Users, Lock, Settings, Share2, MoreHorizontal } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { JoinLeaveButton } from './JoinLeaveButton';
import { cn } from '@/lib/utils';

export function GroupHeader({
  group,
  isMember = false,
  isAdmin = false,
  onJoin,
  onLeave,
  onShare,
  onSettings,
  className
}) {
  const {
    name,
    description,
    status,
    member_count,
    cover_url,
    avatar_url,
    activity_count
  } = group;

  const isPrivate = status === 'private';

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: name,
        url: window.location.href
      }).catch(() => {});
    }
    onShare?.();
  };

  return (
    <div className={cn('bg-white rounded-xl border border-gray-200 overflow-hidden', className)}>
      {/* Cover image */}
      <div className="relative h-32 sm:h-48 bg-gradient-to-r from-primary/20 to-purple-200">
        {cover_url && (
          <img
            src={cover_url}
            alt=""
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 pb-6">
        {/* Avatar and actions row */}
        <div className="flex items-end justify-between -mt-10 sm:-mt-12 mb-4">
          <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-4 border-white shadow-lg">
            <img
              src={avatar_url}
              alt={name}
              className="w-full h-full object-cover"
            />
          </Avatar>

          <div className="flex items-center gap-2 mb-2">
            {/* Join/Leave button */}
            <JoinLeaveButton
              isMember={isMember}
              isPrivate={isPrivate}
              onJoin={onJoin}
              onLeave={onLeave}
            />

            {/* More actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Group
                </DropdownMenuItem>
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onSettings}>
                      <Settings className="w-4 h-4 mr-2" />
                      Group Settings
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Group info */}
        <div>
          {/* Title row */}
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              {name}
            </h1>
            {isPrivate && (
              <Badge variant="secondary" className="shrink-0">
                <Lock className="w-3 h-3 mr-1" />
                Private
              </Badge>
            )}
          </div>

          {/* Description */}
          {description?.rendered && (
            <p
              className="text-gray-600 mb-4"
              dangerouslySetInnerHTML={{
                __html: description.rendered.replace(/<[^>]*>/g, '')
              }}
            />
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {member_count?.toLocaleString()} members
            </span>
            {activity_count > 0 && (
              <span>
                {activity_count.toLocaleString()} posts
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupHeader;
