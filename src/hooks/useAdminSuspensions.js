/**
 * useAdminSuspensions Hook
 *
 * Manages user suspensions for admin moderation.
 * Handles fetching suspensions, creating new suspensions, lifting suspensions, and searching users.
 *
 * Database table: user_suspensions
 * Fields: id, user_id, suspended_by, reason, suspended_until (null=permanent),
 *         created_at, lifted_at, lifted_by, lifted_notes
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { mockSuspensions, SUSPENSION_STATUS } from '@/data/community/mockSuspensions';

// Mock user data for search (fallback when Supabase not configured)
const mockUsers = [
  { id: 'user-101', name: 'Alice Cooper', email: 'alice@example.com' },
  { id: 'user-102', name: 'Bob Smith', email: 'bob@example.com' },
  { id: 'user-103', name: 'Charlie Brown', email: 'charlie@example.com' },
  { id: 'user-104', name: 'Diana Prince', email: 'diana@example.com' },
  { id: 'user-105', name: 'Ethan Hunt', email: 'ethan@example.com' },
];

/**
 * Helper function to determine suspension status
 * @param {Object} suspension - Suspension record
 * @returns {string} Status: 'active' | 'lifted' | 'expired'
 */
function determineSuspensionStatus(suspension) {
  if (suspension.lifted_at) {
    return SUSPENSION_STATUS.LIFTED;
  }

  // Permanent suspension (suspended_until is null)
  if (!suspension.suspended_until) {
    return SUSPENSION_STATUS.ACTIVE;
  }

  // Check if expired
  const suspendedUntil = new Date(suspension.suspended_until);
  const now = new Date();

  if (suspendedUntil <= now) {
    return SUSPENSION_STATUS.EXPIRED;
  }

  return SUSPENSION_STATUS.ACTIVE;
}

/**
 * Fetch suspensions filtered by status
 * @param {string} status - 'active' | 'history' (lifted or expired)
 * @returns {Object} Hook data and functions
 */
export function useAdminSuspensions(status = 'active') {
  const [suspensions, setSuspensions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch suspensions from Supabase
  const fetchSuspensions = useCallback(async () => {
    // Fall back to mock data if Supabase not configured
    if (!isSupabaseConfigured()) {
      setTimeout(() => {
        setSuspensions(mockSuspensions);
        setIsLoading(false);
      }, 300);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Fetch all suspensions with user profile data
      const { data: suspensionsData, error: suspensionsError } = await supabase
        .from('user_suspensions')
        .select(`
          id,
          user_id,
          suspended_by,
          reason,
          suspended_until,
          created_at,
          lifted_at,
          lifted_by,
          lifted_notes,
          user:user_profiles!user_suspensions_user_id_fkey (
            id,
            name,
            email,
            avatar_url
          ),
          suspended_by_user:user_profiles!user_suspensions_suspended_by_fkey (
            id,
            name
          ),
          lifted_by_user:user_profiles!user_suspensions_lifted_by_fkey (
            id,
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (suspensionsError) throw suspensionsError;

      // Transform to match expected format
      const transformedSuspensions = (suspensionsData || []).map((s) => {
        const suspensionStatus = determineSuspensionStatus(s);

        return {
          id: s.id,
          user_id: s.user_id,
          user_name: s.user?.name || 'Unknown User',
          user_email: s.user?.email || 'unknown@example.com',
          user_avatar: s.user?.avatar_url || null,
          reason: s.reason,
          suspended_at: s.created_at,
          suspended_until: s.suspended_until,
          suspended_by: s.suspended_by,
          suspended_by_name: s.suspended_by_user?.name || 'Unknown Admin',
          lifted_at: s.lifted_at,
          lifted_by: s.lifted_by,
          lifted_by_name: s.lifted_by_user?.name || null,
          lifted_notes: s.lifted_notes,
          created_at: s.created_at,
          status: suspensionStatus,
        };
      });

      setSuspensions(transformedSuspensions);
    } catch (err) {
      console.error('Error fetching suspensions:', err);
      setError(err.message);
      // Fall back to mock data on error
      setSuspensions(mockSuspensions);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuspensions();
  }, [fetchSuspensions]);

  // Filter by status
  const filteredSuspensions = useMemo(() => {
    if (status === 'active') {
      return suspensions.filter(s => s.status === SUSPENSION_STATUS.ACTIVE);
    } else if (status === 'history') {
      return suspensions.filter(s =>
        s.status === SUSPENSION_STATUS.LIFTED || s.status === SUSPENSION_STATUS.EXPIRED
      );
    }
    return suspensions;
  }, [suspensions, status]);

  /**
   * Create new suspension
   * @param {string} userId - User ID to suspend
   * @param {string} reason - Suspension reason
   * @param {number} durationDays - Duration in days (0 = permanent)
   */
  const createSuspension = async (userId, reason, durationDays) => {
    // Fall back to mock implementation if Supabase not configured
    if (!isSupabaseConfigured()) {
      console.log('Creating suspension (mock):', { userId, reason, durationDays });

      const user = mockUsers.find(u => u.id === userId);
      const suspendedUntil = durationDays === 0
        ? null
        : new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();

      const newSuspension = {
        id: `susp-${Date.now()}`,
        user_id: userId,
        user_name: user?.name || 'Unknown User',
        user_email: user?.email || 'unknown@example.com',
        user_avatar: null,
        reason,
        suspended_at: new Date().toISOString(),
        suspended_until: suspendedUntil,
        suspended_by: 'admin-current',
        suspended_by_name: 'Current Admin',
        lifted_at: null,
        lifted_by: null,
        lifted_notes: null,
        created_at: new Date().toISOString(),
        status: 'active',
      };

      setSuspensions(prev => [newSuspension, ...prev]);
      return newSuspension;
    }

    try {
      // Get current admin user
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        throw new Error('No authenticated user');
      }

      // Calculate suspension end date
      const suspendedUntil = durationDays === 0
        ? null
        : new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();

      // Insert suspension
      const { data: newSuspension, error: insertError } = await supabase
        .from('user_suspensions')
        .insert({
          user_id: userId,
          suspended_by: currentUser.id,
          reason,
          suspended_until: suspendedUntil,
        })
        .select(`
          id,
          user_id,
          suspended_by,
          reason,
          suspended_until,
          created_at,
          lifted_at,
          lifted_by,
          lifted_notes,
          user:user_profiles!user_suspensions_user_id_fkey (
            id,
            name,
            email,
            avatar_url
          ),
          suspended_by_user:user_profiles!user_suspensions_suspended_by_fkey (
            id,
            name
          )
        `)
        .single();

      if (insertError) throw insertError;

      // Transform to expected format
      const transformedSuspension = {
        id: newSuspension.id,
        user_id: newSuspension.user_id,
        user_name: newSuspension.user?.name || 'Unknown User',
        user_email: newSuspension.user?.email || 'unknown@example.com',
        user_avatar: newSuspension.user?.avatar_url || null,
        reason: newSuspension.reason,
        suspended_at: newSuspension.created_at,
        suspended_until: newSuspension.suspended_until,
        suspended_by: newSuspension.suspended_by,
        suspended_by_name: newSuspension.suspended_by_user?.name || 'Unknown Admin',
        lifted_at: null,
        lifted_by: null,
        lifted_notes: null,
        created_at: newSuspension.created_at,
        status: SUSPENSION_STATUS.ACTIVE,
      };

      // Add to local state
      setSuspensions(prev => [transformedSuspension, ...prev]);

      return transformedSuspension;
    } catch (err) {
      console.error('Error creating suspension:', err);
      throw err;
    }
  };

  /**
   * Lift (end) an active suspension early
   * @param {string} suspensionId - Suspension ID
   * @param {string} notes - Notes explaining why suspension was lifted
   */
  const liftSuspension = async (suspensionId, notes = '') => {
    // Fall back to mock implementation if Supabase not configured
    if (!isSupabaseConfigured()) {
      console.log('Lifting suspension (mock):', { suspensionId, notes });

      setSuspensions(prev => prev.map(s =>
        s.id === suspensionId
          ? {
            ...s,
            lifted_at: new Date().toISOString(),
            lifted_by: 'admin-current',
            lifted_by_name: 'Current Admin',
            lifted_notes: notes,
            status: SUSPENSION_STATUS.LIFTED,
          }
          : s
      ));
      return;
    }

    try {
      // Get current admin user
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        throw new Error('No authenticated user');
      }

      // Update suspension
      const { error: updateError } = await supabase
        .from('user_suspensions')
        .update({
          lifted_at: new Date().toISOString(),
          lifted_by: currentUser.id,
          lifted_notes: notes,
        })
        .eq('id', suspensionId);

      if (updateError) throw updateError;

      // Get admin name for display
      const { data: adminProfile } = await supabase
        .from('user_profiles')
        .select('name')
        .eq('id', currentUser.id)
        .single();

      // Update local state
      setSuspensions(prev => prev.map(s =>
        s.id === suspensionId
          ? {
            ...s,
            lifted_at: new Date().toISOString(),
            lifted_by: currentUser.id,
            lifted_by_name: adminProfile?.name || 'Current Admin',
            lifted_notes: notes,
            status: SUSPENSION_STATUS.LIFTED,
          }
          : s
      ));
    } catch (err) {
      console.error('Error lifting suspension:', err);
      throw err;
    }
  };

  /**
   * Search for users by name or email
   * @param {string} query - Search query
   * @returns {Array} Matching users
   */
  const searchUsers = async (query) => {
    if (!query || query.length < 2) return [];

    // Fall back to mock implementation if Supabase not configured
    if (!isSupabaseConfigured()) {
      console.log('Searching users (mock):', query);
      return mockUsers.filter(u =>
        u.name.toLowerCase().includes(query.toLowerCase()) ||
        u.email.toLowerCase().includes(query.toLowerCase())
      );
    }

    try {
      const { data, error: searchError } = await supabase
        .from('user_profiles')
        .select('id, name, email, avatar_url')
        .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
        .limit(10);

      if (searchError) throw searchError;

      return data || [];
    } catch (err) {
      console.error('Error searching users:', err);
      // Fall back to mock on error
      return mockUsers.filter(u =>
        u.name.toLowerCase().includes(query.toLowerCase()) ||
        u.email.toLowerCase().includes(query.toLowerCase())
      );
    }
  };

  return {
    suspensions: filteredSuspensions,
    isLoading,
    error,
    createSuspension,
    liftSuspension,
    searchUsers,
    refetch: fetchSuspensions,
  };
}

export default useAdminSuspensions;
