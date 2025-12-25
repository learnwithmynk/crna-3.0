/**
 * useUserBlocks Hook
 *
 * Manages user blocking functionality for the messaging system.
 * Allows users to block/unblock other users and check block status.
 *
 * Database schema:
 * - user_blocks: blocker_id (UUID), blocked_id (UUID), created_at
 * - Primary key on (blocker_id, blocked_id)
 *
 * TODO: Replace mock data with Supabase queries when configured:
 * - SELECT from user_blocks WHERE blocker_id = current_user
 * - INSERT into user_blocks for blocking
 * - DELETE from user_blocks for unblocking
 * - Real-time subscription for block updates
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// Mock data for when Supabase is not configured
const mockBlockedUsers = [];

// Helper to get current user ID (will be replaced with actual auth)
const getCurrentUserId = () => {
  // TODO: Replace with actual auth user ID
  return 'current-user-id';
};

export function useUserBlocks() {
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch blocked users on mount
  const fetchBlockedUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (!isSupabaseConfigured()) {
        // Fallback to mock data
        console.warn('Supabase not configured. Using mock blocked users data.');
        await new Promise(resolve => setTimeout(resolve, 200)); // Simulate network delay
        setBlockedUsers(mockBlockedUsers);
        setLoading(false);
        return;
      }

      const currentUserId = getCurrentUserId();

      // Query user_blocks table
      const { data, error: fetchError } = await supabase
        .from('user_blocks')
        .select(`
          blocked_id,
          created_at,
          blocked_user:auth.users!blocked_id (
            id,
            email,
            raw_user_meta_data
          )
        `)
        .eq('blocker_id', currentUserId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      // Transform data to include user name from metadata
      const transformedData = (data || []).map(block => ({
        id: block.blocked_id,
        name: block.blocked_user?.raw_user_meta_data?.full_name ||
              block.blocked_user?.email?.split('@')[0] ||
              'Unknown User',
        email: block.blocked_user?.email,
        blockedAt: block.created_at
      }));

      setBlockedUsers(transformedData);
      setError(null);
    } catch (err) {
      console.error('Error fetching blocked users:', err);
      setError(err.message);
      setBlockedUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchBlockedUsers();
  }, [fetchBlockedUsers]);

  // Subscribe to real-time changes if Supabase is configured
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const currentUserId = getCurrentUserId();

    // Subscribe to user_blocks changes
    const subscription = supabase
      .channel('user_blocks_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_blocks',
          filter: `blocker_id=eq.${currentUserId}`
        },
        () => {
          // Refresh blocked users when changes occur
          fetchBlockedUsers();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchBlockedUsers]);

  /**
   * Block a user
   */
  const blockUser = useCallback(async (userId) => {
    if (!userId) {
      return { success: false, error: 'User ID is required' };
    }

    try {
      if (!isSupabaseConfigured()) {
        // Mock implementation
        console.warn('Supabase not configured. Simulating block user.');
        await new Promise(resolve => setTimeout(resolve, 300));

        const newBlock = {
          id: userId,
          name: `User ${userId.slice(0, 8)}`,
          blockedAt: new Date().toISOString()
        };

        setBlockedUsers(prev => [newBlock, ...prev]);
        return { success: true };
      }

      const currentUserId = getCurrentUserId();

      // Insert block record
      const { error: insertError } = await supabase
        .from('user_blocks')
        .insert({
          blocker_id: currentUserId,
          blocked_id: userId
        });

      if (insertError) {
        // Check if already blocked (unique constraint violation)
        if (insertError.code === '23505') {
          return { success: true, message: 'User already blocked' };
        }
        throw insertError;
      }

      // Refresh blocked users list
      await fetchBlockedUsers();

      return { success: true };
    } catch (err) {
      console.error('Error blocking user:', err);
      return { success: false, error: err.message };
    }
  }, [fetchBlockedUsers]);

  /**
   * Unblock a user
   */
  const unblockUser = useCallback(async (userId) => {
    if (!userId) {
      return { success: false, error: 'User ID is required' };
    }

    try {
      if (!isSupabaseConfigured()) {
        // Mock implementation
        console.warn('Supabase not configured. Simulating unblock user.');
        await new Promise(resolve => setTimeout(resolve, 300));

        setBlockedUsers(prev => prev.filter(user => user.id !== userId));
        return { success: true };
      }

      const currentUserId = getCurrentUserId();

      // Delete block record
      const { error: deleteError } = await supabase
        .from('user_blocks')
        .delete()
        .eq('blocker_id', currentUserId)
        .eq('blocked_id', userId);

      if (deleteError) throw deleteError;

      // Refresh blocked users list
      await fetchBlockedUsers();

      return { success: true };
    } catch (err) {
      console.error('Error unblocking user:', err);
      return { success: false, error: err.message };
    }
  }, [fetchBlockedUsers]);

  /**
   * Check if a user is blocked
   */
  const isBlocked = useCallback((userId) => {
    if (!userId) return false;
    return blockedUsers.some(user => user.id === userId);
  }, [blockedUsers]);

  return {
    blockedUsers,
    loading,
    error,
    blockUser,
    unblockUser,
    isBlocked,
    fetchBlockedUsers
  };
}

export default useUserBlocks;
