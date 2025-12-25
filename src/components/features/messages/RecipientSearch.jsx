/**
 * RecipientSearch Component
 *
 * Search and select users to start a conversation with.
 */

import { useState, useEffect } from 'react';
import { Search, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { mockUsers } from '@/data/mockTopics';
import { cn } from '@/lib/utils';

// Get searchable users (exclude current user)
function getSearchableUsers() {
  const CURRENT_USER_ID = mockUsers.currentUser.id;
  return Object.values(mockUsers)
    .filter(user => user.id !== CURRENT_USER_ID)
    .map(user => ({
      id: user.id,
      name: user.name,
      avatar: user.avatar
    }));
}

export function RecipientSearch({
  onSelect,
  excludeIds = [],
  placeholder = 'Search users...',
  autoFocus = true,
  className
}) {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // TODO: Replace with Supabase query
      // const { data, error } = await supabase
      //   .from('profiles')
      //   .select('id, name, avatar')
      //   .neq('id', currentUserId)
      //   .limit(50);

      setUsers(getSearchableUsers());
      setLoading(false);
    };

    fetchUsers();
  }, []);

  // Filter users by search query and exclude list
  const filteredUsers = users.filter(user => {
    if (excludeIds.includes(user.id)) return false;
    if (!query) return true;
    return user.name.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <div className={cn('space-y-3', className)}>
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus={autoFocus}
          className="pl-10"
        />
      </div>

      {/* Results */}
      <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-xl divide-y divide-gray-100">
        {loading ? (
          <>
            {[1, 2, 3].map((i) => (
              <UserItemSkeleton key={i} />
            ))}
          </>
        ) : filteredUsers.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            {query ? `No users found matching "${query}"` : 'No users available'}
          </div>
        ) : (
          filteredUsers.map((user) => (
            <button
              key={user.id}
              onClick={() => onSelect?.(user)}
              className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 transition-colors"
            >
              <img
                src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=E5E7EB&color=374151`}
                alt={user.name}
                className="w-10 h-10 rounded-full shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{user.name}</p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

// Skeleton for loading state
function UserItemSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3">
      <Skeleton className="w-10 h-10 rounded-full shrink-0" />
      <Skeleton className="h-5 w-32" />
    </div>
  );
}

export default RecipientSearch;
