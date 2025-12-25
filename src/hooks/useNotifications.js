/**
 * useNotifications Hook
 *
 * Fetches and manages in-app notifications.
 * Supports marking notifications as read and real-time updates.
 *
 * When authenticated: Fetches from Supabase community_notifications table
 * When NOT authenticated: Uses mock data for testing/demos
 */

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from './useAuth';
import {
  mockNotifications,
  getUserNotifications,
  getUnreadNotifications,
  getUnreadNotificationCount,
  getNotificationById,
  markNotificationRead,
  getNotificationStyle,
  NOTIFICATION_TYPES
} from '@/data/marketplace/mockNotifications';

// Re-export types for convenience
export { NOTIFICATION_TYPES };

/**
 * Transform Supabase notification (snake_case) to app format (camelCase)
 */
function transformNotification(dbNotification) {
  return {
    id: dbNotification.id,
    userId: dbNotification.user_id,
    type: dbNotification.type,
    title: dbNotification.title,
    body: dbNotification.message,
    link: dbNotification.link,
    readAt: dbNotification.is_read ? dbNotification.created_at : null, // Approximate readAt based on is_read
    createdAt: dbNotification.created_at,
    sourceType: dbNotification.source_type,
    sourceId: dbNotification.source_id,
    actorId: dbNotification.actor_id,
  };
}

/**
 * Main hook for fetching user notifications
 */
export function useNotifications(options = {}) {
  const {
    userId, // Deprecated: only used for mock data when not authenticated
    limit = 20,
    unreadOnly = false
  } = options;

  // Use centralized auth - prevents duplicate auth listeners
  const { user, isLoading: authLoading } = useAuth();
  const hasFetchedRef = useRef(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [supabaseNotifications, setSupabaseNotifications] = useState([]);

  // Fetch notifications from Supabase when authenticated
  useEffect(() => {
    async function fetchNotifications() {
      if (!user || !isSupabaseConfigured()) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        let query = supabase
          .from('community_notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (unreadOnly) {
          query = query.eq('is_read', false);
        }

        if (!unreadOnly && limit) {
          query = query.limit(limit);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;

        setSupabaseNotifications(data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();
  }, [user, limit, unreadOnly]);

  // Use Supabase data when authenticated, mock data otherwise
  const notifications = useMemo(() => {
    if (user) {
      return supabaseNotifications.map(transformNotification);
    }

    // Fallback to mock data for unauthenticated users
    if (!userId) return [];

    if (unreadOnly) {
      return getUnreadNotifications(userId);
    }

    return getUserNotifications(userId, limit);
  }, [user, supabaseNotifications, userId, limit, unreadOnly]);

  // Unread count
  const unreadCount = useMemo(() => {
    if (user) {
      return supabaseNotifications.filter(n => !n.is_read).length;
    }

    // Fallback to mock data count
    if (!userId) return 0;
    return getUnreadNotificationCount(userId);
  }, [user, supabaseNotifications, userId]);

  return {
    notifications,
    unreadCount,
    loading: loading || authLoading,
    error,
    isAuthenticated: !!user,
    user,
  };
}

/**
 * Hook for a single notification
 */
export function useNotification(notificationId) {
  // Use centralized auth - prevents duplicate auth listeners
  const { user, isLoading: authLoading } = useAuth();

  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchNotification() {
      if (!notificationId) {
        setLoading(false);
        return;
      }

      if (user && isSupabaseConfigured()) {
        // Fetch from Supabase
        try {
          setLoading(true);
          const { data, error: fetchError } = await supabase
            .from('community_notifications')
            .select('*')
            .eq('id', notificationId)
            .eq('user_id', user.id) // Ensure user can only access their own notifications
            .single();

          if (fetchError) throw fetchError;

          setNotification(data ? transformNotification(data) : null);
          setError(null);
        } catch (err) {
          console.error('Error fetching notification:', err);
          setNotification(null);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      } else {
        // Fallback to mock data
        setLoading(true);
        setTimeout(() => {
          const found = getNotificationById(notificationId);
          if (found) {
            setNotification(found);
            setError(null);
          } else {
            setNotification(null);
            setError('Notification not found');
          }
          setLoading(false);
        }, 100);
      }
    }

    fetchNotification();
  }, [notificationId, user]);

  return { notification, loading: loading || authLoading, error };
}

/**
 * Hook for notification actions (mark read, etc.)
 */
export function useNotificationActions() {
  // Use centralized auth - prevents duplicate auth listeners
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const markAsRead = useCallback(async (notificationId) => {
    setLoading(true);
    setError(null);

    try {
      if (user && isSupabaseConfigured()) {
        // Update in Supabase
        const { error: updateError } = await supabase
          .from('community_notifications')
          .update({ is_read: true })
          .eq('id', notificationId)
          .eq('user_id', user.id); // Ensure user can only update their own notifications

        if (updateError) throw updateError;
      } else {
        // Fallback to mock behavior
        await new Promise(resolve => setTimeout(resolve, 100));
        markNotificationRead(notificationId);
      }

      return { success: true };
    } catch (err) {
      console.error('Error marking notification as read:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [user]);

  const markAllAsRead = useCallback(async (userId) => {
    setLoading(true);
    setError(null);

    try {
      if (user && isSupabaseConfigured()) {
        // Update all unread notifications in Supabase
        const { error: updateError } = await supabase
          .from('community_notifications')
          .update({ is_read: true })
          .eq('user_id', user.id)
          .eq('is_read', false);

        if (updateError) throw updateError;
      } else {
        // Fallback to mock behavior
        await new Promise(resolve => setTimeout(resolve, 200));

        // Mark all unread notifications as read
        const unread = getUnreadNotifications(userId);
        unread.forEach(n => markNotificationRead(n.id));
      }

      return { success: true };
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [user]);

  const dismissNotification = useCallback(async (notificationId) => {
    setLoading(true);
    setError(null);

    try {
      if (user && isSupabaseConfigured()) {
        // Delete notification from Supabase
        const { error: deleteError } = await supabase
          .from('community_notifications')
          .delete()
          .eq('id', notificationId)
          .eq('user_id', user.id); // Ensure user can only delete their own notifications

        if (deleteError) throw deleteError;
      } else {
        // Mock behavior - just mark as success
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      return { success: true };
    } catch (err) {
      console.error('Error dismissing notification:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    markAsRead,
    markAllAsRead,
    dismissNotification,
    loading,
    error,
    isAuthenticated: !!user,
    user,
  };
}

/**
 * Hook for notification styling/display helpers
 */
export function useNotificationHelpers() {
  const getStyle = useCallback((type) => {
    return getNotificationStyle(type);
  }, []);

  const formatTime = useCallback((dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }, []);

  return { getStyle, formatTime };
}

/**
 * Hook for notification preferences (future use)
 */
export function useNotificationPreferences(userId) {
  const [preferences, setPreferences] = useState({
    email: {
      booking_confirmed: true,
      booking_reminder: true,
      booking_cancelled: true,
      new_inquiry: true,
      review_request: true
    },
    push: {
      booking_confirmed: true,
      booking_reminder: true,
      booking_cancelled: true,
      new_inquiry: false,
      review_request: false
    }
  });
  const [loading, setLoading] = useState(false);

  const updatePreferences = useCallback(async (channel, type, value) => {
    setLoading(true);
    try {
      // TODO: API call
      await new Promise(resolve => setTimeout(resolve, 200));
      setPreferences(prev => ({
        ...prev,
        [channel]: {
          ...prev[channel],
          [type]: value
        }
      }));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return { preferences, updatePreferences, loading };
}

export default useNotifications;
