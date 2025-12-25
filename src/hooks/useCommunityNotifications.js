/**
 * useCommunityNotifications Hook
 *
 * Manages in-app notifications for community forums:
 * - Fetches notifications from community_notifications table
 * - Realtime subscription for new notifications
 * - Mark as read functionality
 * - Mock data fallback when Supabase not configured
 *
 * Usage:
 *   const { notifications, unreadCount, markAsRead, markAllAsRead, isLoading } = useCommunityNotifications();
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { mockNotifications } from '@/data/community/mockNotifications';
import { useAuth } from './useAuth';

export function useCommunityNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const channelRef = useRef(null);
  const hasFetchedRef = useRef(false);

  // Use centralized auth - no local auth listener needed
  const { user } = useAuth();
  const userId = user?.id || null;

  // Computed value
  const unreadCount = useMemo(() => notifications.filter(n => !n.is_read).length, [notifications]);

  // Fetch notifications function
  const fetchNotifications = useCallback(async () => {
    try {
      if (!isSupabaseConfigured()) {
        // Use mock data when Supabase not configured
        setNotifications(mockNotifications);
        setIsLoading(false);
        return;
      }

      if (!userId) {
        // Not authenticated yet
        setNotifications([]);
        setIsLoading(false);
        return;
      }

      // Simplified query without actor join (table may not exist yet)
      const { data, error: fetchError } = await supabase
        .from('community_notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (fetchError) throw fetchError;

      // If no notifications, return empty array (no fallback to mock)
      if (!data || data.length === 0) {
        setNotifications([]);
        return;
      }

      // Transform data with placeholder actor info (no actor join available)
      const transformedData = (data || []).map(notification => ({
        ...notification,
        actor_name: 'Someone',
        actor_avatar: null,
      }));

      setNotifications(transformedData);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err.message);
      // Use empty array on error (table may not exist)
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Fetch notifications when userId changes - but only once per user
  useEffect(() => {
    // Skip if we've already fetched for this user
    if (hasFetchedRef.current && userId) {
      return;
    }
    hasFetchedRef.current = true;
    fetchNotifications();
  }, [userId, fetchNotifications]);

  // Subscribe to realtime updates
  useEffect(() => {
    // Cleanup previous channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    // Don't subscribe if no user or Supabase not configured
    if (!userId || !isSupabaseConfigured()) {
      return;
    }

    const channel = supabase
      .channel(`community_notifications_${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'community_notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setNotifications((prev) => [payload.new, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'community_notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setNotifications((prev) =>
            prev.map((n) => (n.id === payload.new.id ? payload.new : n))
          );
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [userId]);

  // Mark single notification as read
  const markAsRead = useCallback(async (notificationId) => {
    try {
      // Optimistic update
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
      );

      if (!userId || !isSupabaseConfigured()) return; // Mock mode, state already updated

      const { error: updateError } = await supabase
        .from('community_notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('user_id', userId);

      if (updateError) throw updateError;
    } catch (err) {
      console.error('Error marking notification as read:', err);
      // Revert optimistic update
      fetchNotifications();
    }
  }, [userId, fetchNotifications]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      // Optimistic update
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true }))
      );

      if (!userId || !isSupabaseConfigured()) return; // Mock mode, state already updated

      const { error: updateError } = await supabase
        .from('community_notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (updateError) throw updateError;
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      // Revert optimistic update
      fetchNotifications();
    }
  }, [userId, fetchNotifications]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    refresh: fetchNotifications,
  };
}
