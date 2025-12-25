/**
 * GroupCard Component
 *
 * Clickable card displaying a group preview.
 * Shows cover image, name, member count, and join status.
 */

import { Link } from 'react-router-dom';
import { Users, Lock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function GroupCard({ group, className }) {
  const {
    id,
    name,
    description,
    status,
    member_count,
    cover_url,
    avatar_url,
    is_member,
    last_activity
  } = group;

  const isPrivate = status === 'private';

  return (
    <Link
      to={`/community/groups/${id}`}
      className="block"
    >
      <Card
        className={cn(
          'overflow-hidden hover:shadow-md transition-shadow cursor-pointer',
          'border border-gray-200 hover:border-gray-300',
          className
        )}
      >
        {/* Cover image */}
        <div className="relative h-24 bg-gray-100">
          {cover_url && (
            <img
              src={cover_url}
              alt=""
              className="w-full h-full object-cover"
            />
          )}

          {/* Avatar overlay */}
          <Avatar className="absolute -bottom-6 left-4 w-14 h-14 border-2 border-white shadow-sm">
            <img
              src={avatar_url}
              alt={name}
              className="w-full h-full object-cover"
            />
          </Avatar>

          {/* Private badge */}
          {isPrivate && (
            <Badge
              variant="secondary"
              className="absolute top-2 right-2 bg-white/90"
            >
              <Lock className="w-3 h-3 mr-1" />
              Private
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="p-4 pt-8">
          {/* Title row */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 line-clamp-1">
              {name}
            </h3>
            {is_member && (
              <Badge variant="outline" className="shrink-0 text-xs">
                Joined
              </Badge>
            )}
          </div>

          {/* Description */}
          {description?.rendered && (
            <p
              className="text-sm text-gray-500 line-clamp-2 mb-3"
              dangerouslySetInnerHTML={{
                __html: description.rendered.replace(/<[^>]*>/g, '')
              }}
            />
          )}

          {/* Stats row */}
          <div className="flex items-center text-sm text-gray-500">
            <Users className="w-4 h-4 mr-1" />
            <span>{member_count.toLocaleString()} members</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

// Compact variant for sidebar or lists
export function GroupCardCompact({ group, className }) {
  const { id, name, avatar_url, member_count, is_member, status } = group;
  const isPrivate = status === 'private';

  return (
    <Link
      to={`/community/groups/${id}`}
      className={cn(
        'flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors',
        className
      )}
    >
      <Avatar className="w-10 h-10 shrink-0">
        <img src={avatar_url} alt={name} className="w-full h-full object-cover" />
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900 truncate">{name}</span>
          {isPrivate && <Lock className="w-3 h-3 text-gray-400 shrink-0" />}
        </div>
        <span className="text-xs text-gray-500">
          {member_count.toLocaleString()} members
        </span>
      </div>

      {is_member && (
        <Badge variant="outline" className="shrink-0 text-xs">
          Joined
        </Badge>
      )}
    </Link>
  );
}

export default GroupCard;
