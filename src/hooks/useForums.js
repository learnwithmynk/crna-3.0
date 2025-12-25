/**
 * useForums Hook
 *
 * Manages forum data from Supabase community forums.
 * Fetches forums with topic counts and handles subforums.
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from './useAuth';
import { mockForums, mockForumDetail } from '@/data/mockForums';

export function useForums() {
  // Use centralized auth - prevents duplicate auth listeners
  const { user, isLoading: authLoading } = useAuth();

  const [forums, setForums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all forums from Supabase
  const fetchForums = useCallback(async () => {
    // Fall back to mock data if Supabase not configured
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, using mock data');
      setForums(mockForums);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch forums with topic counts
      const { data: forumsData, error: forumsError } = await supabase
        .from('forums')
        .select(`
          id,
          title,
          description,
          slug,
          parent_id,
          sort_order,
          is_locked,
          created_at,
          updated_at
        `)
        .order('sort_order', { ascending: true });

      if (forumsError) throw forumsError;

      // Get topic counts for each forum
      const { data: topicCounts, error: countError } = await supabase
        .from('topics')
        .select('forum_id')
        .is('deleted_at', null);

      if (countError) throw countError;

      // Count topics per forum
      const countsMap = {};
      topicCounts?.forEach(t => {
        countsMap[t.forum_id] = (countsMap[t.forum_id] || 0) + 1;
      });

      // Get reply counts per forum (via topics)
      const { data: replyCounts, error: replyError } = await supabase
        .from('replies')
        .select('topic_id, topics!inner(forum_id)')
        .is('deleted_at', null);

      if (replyError) throw replyError;

      const replyCountsMap = {};
      replyCounts?.forEach(r => {
        const forumId = r.topics?.forum_id;
        if (forumId) {
          replyCountsMap[forumId] = (replyCountsMap[forumId] || 0) + 1;
        }
      });

      // Transform to expected format with nested subforums
      const topLevel = forumsData.filter(f => !f.parent_id);
      const subforumsMap = {};

      forumsData.filter(f => f.parent_id).forEach(sf => {
        if (!subforumsMap[sf.parent_id]) {
          subforumsMap[sf.parent_id] = [];
        }
        subforumsMap[sf.parent_id].push({
          id: sf.id,
          title: { rendered: sf.title },
          slug: sf.slug,
          description: sf.description,
          topic_count: countsMap[sf.id] || 0,
          reply_count: replyCountsMap[sf.id] || 0,
          parent: sf.parent_id,
          is_locked: sf.is_locked,
        });
      });

      const transformedForums = topLevel.map(forum => ({
        id: forum.id,
        title: { rendered: forum.title },
        slug: forum.slug,
        content: { rendered: forum.description || '' },
        topic_count: countsMap[forum.id] || 0,
        reply_count: replyCountsMap[forum.id] || 0,
        parent: 0,
        is_locked: forum.is_locked,
        last_active: forum.updated_at,
        sub_forums: subforumsMap[forum.id] || [],
      }));

      setForums(transformedForums);
    } catch (err) {
      console.error('Error fetching forums:', err);
      setError(err.message);
      // Fall back to mock data on error
      setForums(mockForums);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchForums();
  }, [fetchForums]);

  // Get a single forum by ID
  const getForum = useCallback((forumId) => {
    // Check top-level forums
    const forum = forums.find(f => f.id === forumId);
    if (forum) return forum;

    // Check subforums
    for (const parentForum of forums) {
      if (parentForum.sub_forums) {
        const subforum = parentForum.sub_forums.find(sf => sf.id === forumId);
        if (subforum) return subforum;
      }
    }
    return null;
  }, [forums]);

  // Get forum detail (includes moderators, full info)
  const getForumDetail = useCallback(async (forumId) => {
    if (!isSupabaseConfigured()) {
      // Mock data fallback
      if (mockForumDetail.id === parseInt(forumId)) {
        return mockForumDetail;
      }
      const forum = forums.find(f => f.id === parseInt(forumId));
      return forum ? { ...forum, moderators: [] } : null;
    }

    try {
      const { data: forum, error } = await supabase
        .from('forums')
        .select('*')
        .eq('id', forumId)
        .single();

      if (error) throw error;

      // Get subforums
      const { data: subforums } = await supabase
        .from('forums')
        .select('id, title, slug, description')
        .eq('parent_id', forumId)
        .order('sort_order');

      // Get topic count
      const { count: topicCount } = await supabase
        .from('topics')
        .select('*', { count: 'exact', head: true })
        .eq('forum_id', forumId)
        .is('deleted_at', null);

      return {
        id: forum.id,
        title: { rendered: forum.title },
        slug: forum.slug,
        content: { rendered: forum.description || '' },
        topic_count: topicCount || 0,
        parent: forum.parent_id || 0,
        is_locked: forum.is_locked,
        last_active: forum.updated_at,
        sub_forums: subforums?.map(sf => ({
          id: sf.id,
          title: { rendered: sf.title },
          slug: sf.slug,
        })) || [],
        moderators: [], // TODO: Implement moderators if needed
      };
    } catch (err) {
      console.error('Error fetching forum detail:', err);
      return null;
    }
  }, [forums]);

  // Get subforums for a parent forum
  const getSubforums = useCallback((parentForumId) => {
    const forum = forums.find(f => f.id === parentForumId);
    return forum?.sub_forums || [];
  }, [forums]);

  // Get top-level forums only (parent = 0)
  const topLevelForums = forums.filter(f => f.parent === 0);

  // Get total topic count across all forums
  const totalTopicCount = forums.reduce((sum, f) => sum + (f.topic_count || 0), 0);

  // Get total reply count across all forums
  const totalReplyCount = forums.reduce((sum, f) => sum + (f.reply_count || 0), 0);

  // Search forums by title
  const searchForums = useCallback((query) => {
    if (!query) return forums;
    const lowerQuery = query.toLowerCase();
    return forums.filter(f =>
      f.title.rendered.toLowerCase().includes(lowerQuery) ||
      f.sub_forums?.some(sf => sf.title.rendered.toLowerCase().includes(lowerQuery))
    );
  }, [forums]);

  return {
    forums,
    topLevelForums,
    loading: loading || authLoading,
    error,

    // Methods
    getForum,
    getForumDetail,
    getSubforums,
    searchForums,
    refresh: fetchForums,

    // Computed values
    totalTopicCount,
    totalReplyCount,
    forumCount: forums.length,

    // Auth state
    isAuthenticated: !!user,
    user,
  };
}

export default useForums;
