/**
 * GroupMemberList Component
 *
 * List of group members with sections for admins, mods, and members.
 */

import { Users, Search } from 'lucide-react';
import { useState } from 'react';
import { GroupMemberCard } from './GroupMemberCard';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { cn } from '@/lib/utils';

export function GroupMemberList({
  members,
  admins = [],
  mods = [],
  regularMembers = [],
  total,
  loading = false,
  isCurrentUserAdmin = false,
  onPromote,
  onDemote,
  onRemove,
  searchable = true,
  className
}) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter members by search query
  const filterBySearch = (list) => {
    if (!searchQuery) return list;
    const lowerQuery = searchQuery.toLowerCase();
    return list.filter(m => m.name.toLowerCase().includes(lowerQuery));
  };

  const filteredAdmins = filterBySearch(admins);
  const filteredMods = filterBySearch(mods);
  const filteredMembers = filterBySearch(regularMembers);

  // Loading state
  if (loading) {
    return (
      <div className={cn('space-y-4', className)}>
        {searchable && <Skeleton className="h-10 w-full" />}
        {[1, 2, 3, 4, 5].map((i) => (
          <MemberCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Empty state
  if (!members || members.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No members yet"
        description="Be the first to join this group!"
        className={className}
      />
    );
  }

  const hasResults = filteredAdmins.length + filteredMods.length + filteredMembers.length > 0;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Search */}
      {searchable && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      {/* No search results */}
      {!hasResults && searchQuery && (
        <Card className="p-6 text-center text-gray-500">
          No members found matching "{searchQuery}"
        </Card>
      )}

      {/* Admins */}
      {filteredAdmins.length > 0 && (
        <section>
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-widest mb-2 px-1">
            Admins ({filteredAdmins.length})
          </h3>
          <Card className="divide-y divide-gray-100">
            {filteredAdmins.map((member) => (
              <GroupMemberCard
                key={member.user_id}
                member={member}
                isCurrentUserAdmin={isCurrentUserAdmin}
                onPromote={onPromote}
                onDemote={onDemote}
                onRemove={onRemove}
              />
            ))}
          </Card>
        </section>
      )}

      {/* Mods */}
      {filteredMods.length > 0 && (
        <section>
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-widest mb-2 px-1">
            Moderators ({filteredMods.length})
          </h3>
          <Card className="divide-y divide-gray-100">
            {filteredMods.map((member) => (
              <GroupMemberCard
                key={member.user_id}
                member={member}
                isCurrentUserAdmin={isCurrentUserAdmin}
                onPromote={onPromote}
                onDemote={onDemote}
                onRemove={onRemove}
              />
            ))}
          </Card>
        </section>
      )}

      {/* Regular members */}
      {filteredMembers.length > 0 && (
        <section>
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-widest mb-2 px-1">
            Members ({filteredMembers.length})
          </h3>
          <Card className="divide-y divide-gray-100">
            {filteredMembers.map((member) => (
              <GroupMemberCard
                key={member.user_id}
                member={member}
                isCurrentUserAdmin={isCurrentUserAdmin}
                onPromote={onPromote}
                onDemote={onDemote}
                onRemove={onRemove}
              />
            ))}
          </Card>
        </section>
      )}

      {/* Total count */}
      {total > members.length && (
        <p className="text-sm text-gray-500 text-center">
          Showing {members.length} of {total.toLocaleString()} members
        </p>
      )}
    </div>
  );
}

// Skeleton for loading state
function MemberCardSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3">
      <Skeleton className="w-10 h-10 rounded-full shrink-0" />
      <div className="flex-1">
        <Skeleton className="h-5 w-32 mb-1" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}

export default GroupMemberList;
