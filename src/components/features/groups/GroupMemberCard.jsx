/**
 * GroupMemberCard Component
 *
 * Single member item in group members list.
 * Shows avatar, name, role, and admin actions.
 */

import { Shield, ShieldCheck, MoreHorizontal, UserMinus, ChevronUp, ChevronDown } from 'lucide-react';
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
import { RelativeTime } from '@/components/ui/relative-time';
import { cn } from '@/lib/utils';

export function GroupMemberCard({
  member,
  isCurrentUserAdmin = false,
  onPromote,
  onDemote,
  onRemove,
  className
}) {
  const { name, avatar, role, joined, last_active } = member;

  const isAdmin = role === 'admin';
  const isMod = role === 'mod';
  const canManage = isCurrentUserAdmin && !isAdmin; // Can't manage other admins

  return (
    <div className={cn(
      'flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors',
      className
    )}>
      {/* Avatar */}
      <Avatar className="w-10 h-10 shrink-0">
        <img src={avatar} alt={name} className="w-full h-full object-cover" />
      </Avatar>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900 truncate">{name}</span>
          {isAdmin && (
            <Badge variant="default" className="shrink-0 text-xs">
              <ShieldCheck className="w-3 h-3 mr-1" />
              Admin
            </Badge>
          )}
          {isMod && (
            <Badge variant="secondary" className="shrink-0 text-xs">
              <Shield className="w-3 h-3 mr-1" />
              Mod
            </Badge>
          )}
        </div>
        <div className="text-xs text-gray-500">
          Joined <RelativeTime date={joined} className="text-xs" />
        </div>
      </div>

      {/* Actions */}
      {canManage && (
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
            {!isMod && (
              <DropdownMenuItem onClick={() => onPromote?.(member.user_id)}>
                <ChevronUp className="w-4 h-4 mr-2" />
                Promote to Mod
              </DropdownMenuItem>
            )}
            {isMod && (
              <DropdownMenuItem onClick={() => onDemote?.(member.user_id)}>
                <ChevronDown className="w-4 h-4 mr-2" />
                Demote to Member
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onRemove?.(member.user_id)}
              className="text-red-600 focus:text-red-600"
            >
              <UserMinus className="w-4 h-4 mr-2" />
              Remove from Group
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

export default GroupMemberCard;
