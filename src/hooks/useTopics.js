/**
 * useTopics Hook
 *
 * Manages forum topics from Supabase community forums.
 * Handles CRUD operations, pagination, rate limiting, and spam prevention.
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from './useAuth';
import { containsProfanity } from '@/lib/profanityFilter';
import {
  mockTopicsGeorgetown,
  mockTopicsInterviewPrep,
  mockTopicsGeneral,
  mockAllTopics,
  mockTopicDetail,
  mockUsers
} from '@/data/mockTopics';
import {
  isFirstTimeTopicPoster,
  checkAndLogFirstPost
} from '@/lib/spamCheck';

// Map forum IDs to their mock topics (fallback)
const topicsByForum = {
  10: mockTopicsGeorgetown,
  6: mockTopicsInterviewPrep,
  9: mockTopicsGeneral,
};

export function useTopics(forumId = null) {
  // Use centralized auth - prevents duplicate auth listeners
  const { user, isLoading: authLoading } = useAuth();

  const [topics, setTopics] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const perPage = 20;

  // Fetch topics for a forum from Supabase
  const fetchTopics = useCallback(async (fId, page = 1) => {
    // Fall back to mock data if Supabase not configured
    if (!isSupabaseConfigured()) {
      const mockData = topicsByForum[parseInt(fId)];
      if (mockData) {
        setTopics(mockData.topics);
        setTotal(mockData.total);
        setTotalPages(mockData.total_pages);
      } else {
        setTopics([]);
        setTotal(0);
        setTotalPages(0);
      }
      setCurrentPage(page);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const offset = (page - 1) * perPage;

      // Build query - fetch topics with author info
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
          )
        `, { count: 'exact' })
        .is('deleted_at', null)
        .or('is_hidden.eq.false,author_id.eq.' + (await supabase.auth.getUser()).data.user?.id);

      // Filter by forum if provided
      if (fId) {
        query = query.eq('forum_id', fId);
      }

      // Order by sticky first, then last activity
      query = query
        .order('is_sticky', { ascending: false })
        .order('last_activity_at', { ascending: false })
        .range(offset, offset + perPage - 1);

      const { data: topicsData, error: topicsError, count } = await query;

      if (topicsError) throw topicsError;

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

      // Get reaction counts
      let reactionCounts = {};
      if (topicIds.length > 0) {
        const { data: reactionData } = await supabase
          .from('topic_reactions')
          .select('topic_id')
          .in('topic_id', topicIds);

        reactionData?.forEach(r => {
          reactionCounts[r.topic_id] = (reactionCounts[r.topic_id] || 0) + 1;
        });
      }

      // Transform to expected format
      const transformedTopics = topicsData?.map(topic => ({
        id: topic.id,
        forum_id: topic.forum_id,
        title: { rendered: topic.title },
        content: { rendered: topic.content },
        author: {
          id: topic.author_id,
          name: topic.user_profiles?.name || 'Unknown',
          avatar: topic.user_profiles?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(topic.user_profiles?.name || 'U')}&background=random`,
        },
        reply_count: replyCounts[topic.id] || 0,
        reaction_count: reactionCounts[topic.id] || 0,
        voice_count: replyCounts[topic.id] || 0, // Unique voices - simplified
        view_count: topic.view_count || 0,
        created: topic.created_at,
        last_active: topic.last_activity_at || topic.created_at,
        sticky: topic.is_sticky,
        is_locked: topic.is_locked,
        is_hidden: topic.is_hidden,
      })) || [];

      setTopics(transformedTopics);
      setTotal(count || 0);
      setTotalPages(Math.ceil((count || 0) / perPage));
      setCurrentPage(page);
    } catch (err) {
      console.error('Error fetching topics:', err);
      setError(err.message);
      // Fall back to mock data
      const mockData = topicsByForum[parseInt(fId)];
      if (mockData) {
        setTopics(mockData.topics);
        setTotal(mockData.total);
        setTotalPages(mockData.total_pages);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    if (forumId) {
      fetchTopics(forumId);
    } else if (!isSupabaseConfigured()) {
      setTopics(mockAllTopics.slice(0, 20));
      setTotal(mockAllTopics.length);
      setTotalPages(Math.ceil(mockAllTopics.length / 20));
      setLoading(false);
    } else {
      // Fetch all recent topics
      fetchTopics(null);
    }
  }, [forumId, fetchTopics]);

  // Get a single topic by ID
  const getTopic = useCallback((topicId) => {
    return topics.find(t => t.id === topicId) || null;
  }, [topics]);

  // Get topic detail with replies
  const getTopicDetail = useCallback(async (topicId) => {
    if (!isSupabaseConfigured()) {
      if (mockTopicDetail.id === parseInt(topicId)) {
        return mockTopicDetail;
      }
      const topic = mockAllTopics.find(t => t.id === parseInt(topicId));
      return topic ? { ...topic, replies: [], replies_total: 0 } : null;
    }

    try {
      const { data: topic, error } = await supabase
        .from('topics')
        .select(`
          *,
          user_profiles!topics_author_id_fkey (
            id,
            name,
            avatar_url
          ),
          forums (
            id,
            title,
            slug
          )
        `)
        .eq('id', topicId)
        .single();

      if (error) throw error;

      // Get reply count
      const { count: replyCount } = await supabase
        .from('replies')
        .select('*', { count: 'exact', head: true })
        .eq('topic_id', topicId)
        .is('deleted_at', null);

      // Increment view count
      await supabase
        .from('topics')
        .update({ view_count: (topic.view_count || 0) + 1 })
        .eq('id', topicId);

      return {
        id: topic.id,
        forum_id: topic.forum_id,
        forum_title: topic.forums?.title || 'Forum',
        forum_slug: topic.forums?.slug,
        title: { rendered: topic.title },
        content: { rendered: topic.content },
        author: {
          id: topic.author_id,
          name: topic.user_profiles?.name || 'Unknown',
          avatar: topic.user_profiles?.avatar_url || `https://ui-avatars.com/api/?name=U&background=random`,
        },
        reply_count: replyCount || 0,
        view_count: (topic.view_count || 0) + 1,
        created: topic.created_at,
        last_active: topic.last_activity_at,
        sticky: topic.is_sticky,
        is_locked: topic.is_locked,
        replies: [], // Replies fetched separately
        replies_total: replyCount || 0,
        replies_pages: Math.ceil((replyCount || 0) / 20),
        subscribed: false, // TODO: Check subscription
      };
    } catch (err) {
      console.error('Error fetching topic detail:', err);
      return null;
    }
  }, []);

  // Check rate limit before creating topic
  const checkRateLimit = async () => {
    if (!isSupabaseConfigured()) return { allowed: true };

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { allowed: false, reason: 'Not authenticated' };

    const { data, error } = await supabase
      .rpc('check_post_rate_limit', { p_user_id: user.id, p_type: 'topic' });

    if (error) {
      console.error('Rate limit check error:', error);
      return { allowed: true }; // Allow on error
    }

    return { allowed: data, reason: data ? null : 'Rate limit exceeded. Please wait before posting again.' };
  };

  // Validate honeypot field (should be empty)
  const validateHoneypot = (honeypotValue) => {
    return !honeypotValue || honeypotValue.trim() === '';
  };

  // Create a new topic
  const createTopic = useCallback(async (fId, title, content, honeypotValue = '') => {
    // Validate honeypot
    if (!validateHoneypot(honeypotValue)) {
      console.warn('Honeypot triggered - likely bot');
      // Silently fail for bots
      return { id: Date.now(), title: { rendered: title } };
    }

    // Check for profanity in title and content
    const titleCheck = await containsProfanity(title);
    const contentCheck = await containsProfanity(content);

    if (titleCheck.hasProfanity || contentCheck.hasProfanity) {
      throw new Error('Please revise your message - inappropriate content detected');
    }

    if (!isSupabaseConfigured()) {
      const newTopic = {
        id: Date.now(),
        title: { rendered: title },
        content: { rendered: content },
        forum_id: parseInt(fId),
        author: mockUsers.currentUser,
        reply_count: 0,
        voice_count: 0,
        created: new Date().toISOString(),
        last_active: new Date().toISOString(),
        sticky: false
      };
      setTopics(prev => [newTopic, ...prev]);
      setTotal(prev => prev + 1);
      return newTopic;
    }

    try {
      // Check rate limit
      const rateCheck = await checkRateLimit();
      if (!rateCheck.allowed) {
        throw new Error(rateCheck.reason);
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Must be logged in to create a topic');

      // Check if user is suspended
      const { data: suspension } = await supabase
        .from('user_suspensions')
        .select('*')
        .eq('user_id', user.id)
        .is('lifted_at', null)
        .or('suspended_until.is.null,suspended_until.gt.now()')
        .single();

      if (suspension) {
        throw new Error('Your account is suspended and cannot create topics');
      }

      // Check if this is user's first topic and run spam check
      const isFirstTopic = await isFirstTimeTopicPoster(user.id);
      if (isFirstTopic) {
        // Get user email for spam check
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('email')
          .eq('id', user.id)
          .single();

        if (profile?.email) {
          // Run spam check (non-blocking - just logs for admin review)
          // We don't block the post, just flag it for review
          await checkAndLogFirstPost(user.id, profile.email);
        }
      }

      // Create topic
      const { data: newTopic, error } = await supabase
        .from('topics')
        .insert({
          forum_id: fId,
          author_id: user.id,
          title,
          content,
          honeypot_field: honeypotValue || null,
        })
        .select(`
          *,
          user_profiles!topics_author_id_fkey (
            id,
            name,
            avatar_url
          )
        `)
        .single();

      if (error) throw error;

      // Increment rate counter
      await supabase.rpc('increment_post_rate', { p_user_id: user.id, p_type: 'topic' });

      const transformedTopic = {
        id: newTopic.id,
        forum_id: newTopic.forum_id,
        title: { rendered: newTopic.title },
        content: { rendered: newTopic.content },
        author: {
          id: newTopic.author_id,
          name: newTopic.user_profiles?.name || 'You',
          avatar: newTopic.user_profiles?.avatar_url,
        },
        reply_count: 0,
        voice_count: 0,
        created: newTopic.created_at,
        last_active: newTopic.created_at,
        sticky: false,
      };

      setTopics(prev => [transformedTopic, ...prev]);
      setTotal(prev => prev + 1);

      return transformedTopic;
    } catch (err) {
      console.error('Error creating topic:', err);
      throw err;
    }
  }, []);

  // Update a topic
  const updateTopic = useCallback(async (topicId, updates) => {
    if (!isSupabaseConfigured()) {
      setTopics(prev => prev.map(topic => {
        if (topic.id === parseInt(topicId)) {
          return {
            ...topic,
            title: updates.title ? { rendered: updates.title } : topic.title,
            content: updates.content ? { rendered: updates.content } : topic.content
          };
        }
        return topic;
      }));
      return;
    }

    try {
      const { error } = await supabase
        .from('topics')
        .update({
          title: updates.title,
          content: updates.content,
          updated_at: new Date().toISOString(),
        })
        .eq('id', topicId);

      if (error) throw error;

      setTopics(prev => prev.map(topic => {
        if (topic.id === topicId) {
          return {
            ...topic,
            title: updates.title ? { rendered: updates.title } : topic.title,
            content: updates.content ? { rendered: updates.content } : topic.content
          };
        }
        return topic;
      }));
    } catch (err) {
      console.error('Error updating topic:', err);
      throw err;
    }
  }, []);

  // Delete a topic (soft delete)
  const deleteTopic = useCallback(async (topicId) => {
    if (!isSupabaseConfigured()) {
      setTopics(prev => prev.filter(t => t.id !== parseInt(topicId)));
      setTotal(prev => prev - 1);
      return;
    }

    try {
      const { error } = await supabase
        .from('topics')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', topicId);

      if (error) throw error;

      setTopics(prev => prev.filter(t => t.id !== topicId));
      setTotal(prev => prev - 1);
    } catch (err) {
      console.error('Error deleting topic:', err);
      throw err;
    }
  }, []);

  // Toggle topic subscription
  const toggleSubscription = useCallback(async (topicId) => {
    if (!isSupabaseConfigured()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if already subscribed
      const { data: existing } = await supabase
        .from('topic_subscriptions')
        .select('*')
        .eq('topic_id', topicId)
        .eq('user_id', user.id)
        .single();

      if (existing) {
        // Unsubscribe
        await supabase
          .from('topic_subscriptions')
          .delete()
          .eq('topic_id', topicId)
          .eq('user_id', user.id);
      } else {
        // Subscribe
        await supabase
          .from('topic_subscriptions')
          .insert({ topic_id: topicId, user_id: user.id });
      }
    } catch (err) {
      console.error('Error toggling subscription:', err);
    }
  }, []);

  // Get sticky topics
  const stickyTopics = topics.filter(t => t.sticky);
  const regularTopics = topics.filter(t => !t.sticky);
  const sortedTopics = [...stickyTopics, ...regularTopics];

  // Pagination
  const goToPage = useCallback((page) => {
    fetchTopics(forumId, page);
  }, [forumId, fetchTopics]);

  const refresh = useCallback(() => {
    fetchTopics(forumId, currentPage);
  }, [forumId, currentPage, fetchTopics]);

  return {
    topics: sortedTopics,
    stickyTopics,
    regularTopics,
    total,
    totalPages,
    currentPage,
    loading: loading || authLoading,
    error,

    // Methods
    fetchTopics,
    getTopic,
    getTopicDetail,
    createTopic,
    updateTopic,
    deleteTopic,
    toggleSubscription,
    goToPage,
    refresh,

    // Computed values
    hasTopics: topics.length > 0,
    hasStickyTopics: stickyTopics.length > 0,

    // Auth state
    isAuthenticated: !!user,
    user,
  };
}

export default useTopics;
