/**
 * useAdminTopics Hook
 *
 * Admin-level topic management - view all topics, moderate, pin, lock, delete.
 *
 * Database table: topics
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { mockAllTopics as mockTopics } from '@/data/mockTopics';

export function useAdminTopics(forumId = null) {
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 20,
    total: 0,
  });

  // Fetch topics with optional forum filter
  const fetchTopics = useCallback(async (page = 1, filters = {}) => {
    setIsLoading(true);

    // Fall back to mock data if Supabase not configured
    if (!isSupabaseConfigured()) {
      setTimeout(() => {
        let filtered = [...mockTopics];

        // Apply forum filter
        if (forumId) {
          filtered = filtered.filter(t => t.forum_id === forumId);
        }

        // Apply search filter
        if (filters.search) {
          const search = filters.search.toLowerCase();
          filtered = filtered.filter(t =>
            t.title.rendered.toLowerCase().includes(search) ||
            t.content.rendered.toLowerCase().includes(search)
          );
        }

        // Apply hidden filter
        if (filters.showHidden === false) {
          filtered = filtered.filter(t => !t.is_hidden);
        }

        // Sort: sticky first, then by date
        filtered.sort((a, b) => {
          if (a.is_sticky && !b.is_sticky) return -1;
          if (!a.is_sticky && b.is_sticky) return 1;
          return new Date(b.date) - new Date(a.date);
        });

        // Paginate
        const start = (page - 1) * pagination.perPage;
        const paginatedTopics = filtered.slice(start, start + pagination.perPage);

        setTopics(paginatedTopics.map(t => ({
          id: t.id,
          title: t.title.rendered,
          content_preview: t.content.rendered.replace(/<[^>]*>/g, '').slice(0, 150) + '...',
          author_id: t.author?.id || t.author,
          author_name: t.author?.name || t.author_name || 'Unknown User',
          author_avatar: t.author?.avatar || t.author_avatar,
          forum_id: t.forum_id,
          forum_name: t.forum_name || 'Unknown Forum',
          reply_count: t.reply_count || 0,
          view_count: t.view_count || 0,
          is_sticky: t.is_sticky || t.sticky || false,
          is_locked: t.is_locked || false,
          is_hidden: t.is_hidden || false,
          created_at: t.date || t.created,
          last_activity: t.last_active_time || t.last_active,
        })));

        setPagination(prev => ({
          ...prev,
          page,
          total: filtered.length,
        }));

        setIsLoading(false);
      }, 300);
      return;
    }

    try {
      const offset = (page - 1) * pagination.perPage;

      // Build query with joins for author and forum info
      let query = supabase
        .from('topics')
        .select(`
          id,
          forum_id,
          author_id,
          title,
          content,
          is_sticky,
          is_locked,
          is_hidden,
          view_count,
          created_at,
          updated_at,
          last_activity_at,
          user_profiles!topics_author_id_fkey (
            id,
            name,
            avatar_url
          ),
          forums (
            id,
            title
          )
        `, { count: 'exact' })
        .is('deleted_at', null);

      // Apply forum filter
      if (forumId) {
        query = query.eq('forum_id', forumId);
      }

      // Apply hidden filter
      if (filters.showHidden === false) {
        query = query.eq('is_hidden', false);
      }

      // Apply sticky filter
      if (filters.isSticky !== undefined) {
        query = query.eq('is_sticky', filters.isSticky);
      }

      // Apply search filter
      if (filters.search) {
        query = query.ilike('title', `%${filters.search}%`);
      }

      // Order by sticky first, then by creation date
      query = query
        .order('is_sticky', { ascending: false })
        .order('created_at', { ascending: false })
        .range(offset, offset + pagination.perPage - 1);

      const { data: topicsData, count, error } = await query;

      if (error) throw error;

      // Get reply counts for each topic
      const topicIds = topicsData?.map(t => t.id) || [];
      let replyCounts = {};

      if (topicIds.length > 0) {
        const { data: replyData } = await supabase
          .from('replies')
          .select('topic_id')
          .in('topic_id', topicIds)
          .is('deleted_at', null);

        replyData?.forEach(r => {
          replyCounts[r.topic_id] = (replyCounts[r.topic_id] || 0) + 1;
        });
      }

      // Transform to admin format
      const transformedTopics = topicsData?.map(topic => ({
        id: topic.id,
        title: topic.title,
        content_preview: topic.content.replace(/<[^>]*>/g, '').slice(0, 150) + '...',
        author_id: topic.author_id,
        author_name: topic.user_profiles?.name || 'Unknown User',
        author_avatar: topic.user_profiles?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(topic.user_profiles?.name || 'U')}&background=random`,
        forum_id: topic.forum_id,
        forum_name: topic.forums?.title || 'Unknown Forum',
        reply_count: replyCounts[topic.id] || 0,
        view_count: topic.view_count || 0,
        is_sticky: topic.is_sticky,
        is_locked: topic.is_locked,
        is_hidden: topic.is_hidden,
        created_at: topic.created_at,
        last_activity: topic.last_activity_at || topic.created_at,
      })) || [];

      setTopics(transformedTopics);
      setPagination(prev => ({
        ...prev,
        page,
        total: count || 0,
      }));
    } catch (err) {
      console.error('Error fetching admin topics:', err);
      // Fall back to mock data on error
      setTimeout(() => {
        const filtered = mockTopics.slice(0, pagination.perPage);
        setTopics(filtered.map(t => ({
          id: t.id,
          title: t.title.rendered,
          content_preview: t.content.rendered.replace(/<[^>]*>/g, '').slice(0, 150) + '...',
          author_id: t.author?.id || t.author,
          author_name: t.author?.name || 'Unknown User',
          author_avatar: t.author?.avatar,
          forum_id: t.forum_id,
          forum_name: 'Unknown Forum',
          reply_count: t.reply_count || 0,
          view_count: t.view_count || 0,
          is_sticky: t.sticky || false,
          is_locked: t.is_locked || false,
          is_hidden: t.is_hidden || false,
          created_at: t.created,
          last_activity: t.last_active,
        })));
        setPagination(prev => ({
          ...prev,
          page,
          total: mockTopics.length,
        }));
      }, 300);
    } finally {
      setIsLoading(false);
    }
  }, [forumId, pagination.perPage]);

  useEffect(() => {
    fetchTopics(1);
  }, [fetchTopics]);

  // Toggle sticky status
  const toggleSticky = async (topicId) => {
    if (!isSupabaseConfigured()) {
      setTopics(prev => prev.map(t =>
        t.id === topicId ? { ...t, is_sticky: !t.is_sticky } : t
      ));
      return;
    }

    try {
      // Get current value
      const topic = topics.find(t => t.id === topicId);
      if (!topic) return;

      const { error } = await supabase
        .from('topics')
        .update({ is_sticky: !topic.is_sticky })
        .eq('id', topicId);

      if (error) throw error;

      // Update local state
      setTopics(prev => prev.map(t =>
        t.id === topicId ? { ...t, is_sticky: !t.is_sticky } : t
      ));
    } catch (err) {
      console.error('Error toggling sticky:', err);
      throw err;
    }
  };

  // Toggle locked status
  const toggleLocked = async (topicId) => {
    if (!isSupabaseConfigured()) {
      setTopics(prev => prev.map(t =>
        t.id === topicId ? { ...t, is_locked: !t.is_locked } : t
      ));
      return;
    }

    try {
      // Get current value
      const topic = topics.find(t => t.id === topicId);
      if (!topic) return;

      const { error } = await supabase
        .from('topics')
        .update({ is_locked: !topic.is_locked })
        .eq('id', topicId);

      if (error) throw error;

      // Update local state
      setTopics(prev => prev.map(t =>
        t.id === topicId ? { ...t, is_locked: !t.is_locked } : t
      ));
    } catch (err) {
      console.error('Error toggling locked:', err);
      throw err;
    }
  };

  // Toggle hidden status
  const toggleHidden = async (topicId) => {
    if (!isSupabaseConfigured()) {
      setTopics(prev => prev.map(t =>
        t.id === topicId ? { ...t, is_hidden: !t.is_hidden } : t
      ));
      return;
    }

    try {
      // Get current value
      const topic = topics.find(t => t.id === topicId);
      if (!topic) return;

      const { error } = await supabase
        .from('topics')
        .update({ is_hidden: !topic.is_hidden })
        .eq('id', topicId);

      if (error) throw error;

      // Update local state
      setTopics(prev => prev.map(t =>
        t.id === topicId ? { ...t, is_hidden: !t.is_hidden } : t
      ));
    } catch (err) {
      console.error('Error toggling hidden:', err);
      throw err;
    }
  };

  // Delete topic (soft delete)
  const deleteTopic = async (topicId) => {
    if (!isSupabaseConfigured()) {
      setTopics(prev => prev.filter(t => t.id !== topicId));
      return;
    }

    try {
      const { error } = await supabase
        .from('topics')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', topicId);

      if (error) throw error;

      // Remove from local state
      setTopics(prev => prev.filter(t => t.id !== topicId));
      setPagination(prev => ({
        ...prev,
        total: prev.total - 1,
      }));
    } catch (err) {
      console.error('Error deleting topic:', err);
      throw err;
    }
  };

  // Move topic to different forum
  const moveTopic = async (topicId, newForumId) => {
    if (!isSupabaseConfigured()) {
      setTopics(prev => prev.map(t =>
        t.id === topicId ? { ...t, forum_id: newForumId } : t
      ));
      return;
    }

    try {
      const { error } = await supabase
        .from('topics')
        .update({ forum_id: newForumId })
        .eq('id', topicId);

      if (error) throw error;

      // Update local state
      setTopics(prev => prev.map(t =>
        t.id === topicId ? { ...t, forum_id: newForumId } : t
      ));
    } catch (err) {
      console.error('Error moving topic:', err);
      throw err;
    }
  };

  return {
    topics,
    isLoading,
    pagination,
    fetchTopics,
    toggleSticky,
    toggleLocked,
    toggleHidden,
    deleteTopic,
    moveTopic,
  };
}

export default useAdminTopics;
