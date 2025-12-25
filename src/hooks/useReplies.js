/**
 * useReplies Hook
 *
 * Manages topic replies from Supabase community forums.
 * Handles CRUD operations, threading, pagination, reactions, rate limiting, and spam prevention.
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from './useAuth';
import { containsProfanity } from '@/lib/profanityFilter';
import { getMockRepliesForTopic } from '@/data/mockReplies';
import { mockUsers } from '@/data/mockTopics';
import {
  isFirstTimeReplyPoster,
  checkAndLogFirstPost
} from '@/lib/spamCheck';

export function useReplies(topicId = null) {
  // Use centralized auth - prevents duplicate auth listeners
  const { user, isLoading: authLoading } = useAuth();

  const [replies, setReplies] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const perPage = 20;

  // Validate honeypot field (should be empty)
  const validateHoneypot = (honeypotValue) => {
    return !honeypotValue || honeypotValue.trim() === '';
  };

  // Check rate limit before creating reply
  const checkRateLimit = async () => {
    if (!isSupabaseConfigured()) return { allowed: true };

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { allowed: false, reason: 'Not authenticated' };

    const { data, error } = await supabase
      .rpc('check_post_rate_limit', { p_user_id: user.id, p_type: 'reply' });

    if (error) {
      console.error('Rate limit check error:', error);
      return { allowed: true }; // Allow on error
    }

    return { allowed: data, reason: data ? null : 'Rate limit exceeded. Please wait before posting again.' };
  };

  // Fetch replies for a topic from Supabase
  const fetchReplies = useCallback(async (tId, page = 1) => {
    // Fall back to mock data if Supabase not configured
    if (!isSupabaseConfigured()) {
      const mockReplies = getMockRepliesForTopic(parseInt(tId));
      const startIndex = (page - 1) * perPage;
      const paginatedReplies = mockReplies.slice(startIndex, startIndex + perPage);
      setReplies(paginatedReplies);
      setTotal(mockReplies.length);
      setTotalPages(Math.ceil(mockReplies.length / perPage));
      setCurrentPage(page);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const offset = (page - 1) * perPage;

      // Build query - fetch replies with author info
      let query = supabase
        .from('replies')
        .select(`
          id,
          topic_id,
          author_id,
          parent_reply_id,
          content,
          is_hidden,
          created_at,
          updated_at,
          user_profiles!replies_author_id_fkey (
            id,
            name,
            avatar_url
          )
        `, { count: 'exact' })
        .eq('topic_id', tId)
        .is('deleted_at', null);

      // Filter hidden replies unless user is author
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        query = query.or(`is_hidden.eq.false,author_id.eq.${user.id}`);
      } else {
        query = query.eq('is_hidden', false);
      }

      // Order by creation date (oldest first for forum threads)
      query = query
        .order('created_at', { ascending: true })
        .range(offset, offset + perPage - 1);

      const { data: repliesData, error: repliesError, count } = await query;

      if (repliesError) throw repliesError;

      // Get reaction counts for each reply
      const replyIds = repliesData?.map(r => r.id) || [];
      let reactionCounts = {};
      let userReactions = {};

      if (replyIds.length > 0) {
        // Get total reaction counts
        const { data: reactionData } = await supabase
          .from('reply_reactions')
          .select('reply_id, reaction_type')
          .in('reply_id', replyIds);

        // Group reactions by reply
        const reactionsByReply = {};
        reactionData?.forEach(r => {
          if (!reactionsByReply[r.reply_id]) {
            reactionsByReply[r.reply_id] = { like: [], love: [], laugh: [], wow: [], sad: [], angry: [] };
          }
          if (!reactionsByReply[r.reply_id][r.reaction_type]) {
            reactionsByReply[r.reply_id][r.reaction_type] = [];
          }
          reactionsByReply[r.reply_id][r.reaction_type].push(r.reply_id);
        });

        replyIds.forEach(id => {
          const reactions = reactionsByReply[id] || {};
          reactionCounts[id] = Object.values(reactions).reduce((sum, arr) => sum + arr.length, 0);
        });

        // Get current user's reactions if logged in
        if (user) {
          const { data: userReactionData } = await supabase
            .from('reply_reactions')
            .select('reply_id, reaction_type')
            .in('reply_id', replyIds)
            .eq('user_id', user.id);

          userReactionData?.forEach(r => {
            userReactions[r.reply_id] = r.reaction_type;
          });
        }
      }

      // Get reply counts for nested replies (count of children)
      let childCounts = {};
      if (replyIds.length > 0) {
        const { data: childData } = await supabase
          .from('replies')
          .select('parent_reply_id')
          .in('parent_reply_id', replyIds)
          .is('deleted_at', null);

        childData?.forEach(r => {
          childCounts[r.parent_reply_id] = (childCounts[r.parent_reply_id] || 0) + 1;
        });
      }

      // Transform to expected format
      const transformedReplies = repliesData?.map(reply => {
        // Calculate depth from parent_reply_id (simplified - could be enhanced)
        let depth = 0;
        if (reply.parent_reply_id) {
          const parent = repliesData.find(r => r.id === reply.parent_reply_id);
          depth = parent ? 1 : 1; // Simplified depth calculation
        }

        return {
          id: reply.id,
          topic_id: reply.topic_id,
          parent_id: reply.parent_reply_id,
          depth,
          content: { rendered: reply.content },
          author: {
            id: reply.author_id,
            name: reply.user_profiles?.name || 'Unknown',
            avatar: reply.user_profiles?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(reply.user_profiles?.name || 'U')}&background=random`,
          },
          created: reply.created_at,
          edited: reply.updated_at !== reply.created_at,
          reactions: {}, // Detailed reactions not needed for list view
          reaction_count: reactionCounts[reply.id] || 0,
          reply_count: childCounts[reply.id] || 0,
          user_reaction: userReactions[reply.id] || null,
          mentions: [], // TODO: Parse mentions from content
          media: [], // TODO: Parse media attachments
          is_hidden: reply.is_hidden,
        };
      }) || [];

      setReplies(transformedReplies);
      setTotal(count || 0);
      setTotalPages(Math.ceil((count || 0) / perPage));
      setCurrentPage(page);
    } catch (err) {
      console.error('Error fetching replies:', err);
      setError(err.message);
      // Fall back to mock data
      const mockReplies = getMockRepliesForTopic(parseInt(tId));
      if (mockReplies) {
        setReplies(mockReplies.slice(0, perPage));
        setTotal(mockReplies.length);
        setTotalPages(Math.ceil(mockReplies.length / perPage));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch if topicId is provided
  useEffect(() => {
    if (topicId) {
      fetchReplies(topicId);
    } else {
      setLoading(false);
    }
  }, [topicId, fetchReplies]);

  // Get a single reply by ID
  const getReply = useCallback((replyId) => {
    return replies.find(r => r.id === parseInt(replyId)) || null;
  }, [replies]);

  // Create a new reply (supports nested replies via parentReplyId)
  const createReply = useCallback(async (tId, content, parentReplyId = null, honeypotValue = '') => {
    // Validate honeypot
    if (!validateHoneypot(honeypotValue)) {
      console.warn('Honeypot triggered - likely bot');
      // Silently fail for bots
      return { id: Date.now(), content: { rendered: content } };
    }

    // Check for profanity in content
    const contentCheck = await containsProfanity(content);

    if (contentCheck.hasProfanity) {
      throw new Error('Please revise your message - inappropriate content detected');
    }

    if (!isSupabaseConfigured()) {
      // Calculate depth based on parent
      let depth = 0;
      if (parentReplyId) {
        const parentReply = replies.find(r => r.id === parentReplyId);
        depth = parentReply ? (parentReply.depth || 0) + 1 : 1;
      }

      const newReply = {
        id: Date.now(),
        topic_id: parseInt(tId),
        parent_id: parentReplyId,
        depth,
        content: { rendered: content },
        author: mockUsers.currentUser,
        created: new Date().toISOString(),
        edited: false,
        reactions: { like: [], love: [], laugh: [] },
        reaction_count: 0,
        reply_count: 0,
        mentions: [],
        media: []
      };

      // Update parent's reply_count if this is a nested reply
      setReplies(prev => {
        let updated = [...prev, newReply];
        if (parentReplyId) {
          updated = updated.map(r =>
            r.id === parentReplyId
              ? { ...r, reply_count: (r.reply_count || 0) + 1 }
              : r
          );
        }
        return updated;
      });
      setTotal(prev => prev + 1);

      return newReply;
    }

    try {
      // Check rate limit
      const rateCheck = await checkRateLimit();
      if (!rateCheck.allowed) {
        throw new Error(rateCheck.reason);
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Must be logged in to create a reply');

      // Check if user is suspended
      const { data: suspension } = await supabase
        .from('user_suspensions')
        .select('*')
        .eq('user_id', user.id)
        .is('lifted_at', null)
        .or('suspended_until.is.null,suspended_until.gt.now()')
        .single();

      if (suspension) {
        throw new Error('Your account is suspended and cannot create replies');
      }

      // Check if this is user's first reply and run spam check
      const isFirstReply = await isFirstTimeReplyPoster(user.id);
      if (isFirstReply) {
        // Get user email for spam check
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('email')
          .eq('id', user.id)
          .single();

        if (profile?.email) {
          // Run spam check (non-blocking - just logs for admin review)
          // We don't block the reply, just flag it for review
          await checkAndLogFirstPost(user.id, profile.email);
        }
      }

      // Create reply
      const { data: newReply, error } = await supabase
        .from('replies')
        .insert({
          topic_id: tId,
          author_id: user.id,
          parent_reply_id: parentReplyId,
          content,
          honeypot_field: honeypotValue || null,
        })
        .select(`
          *,
          user_profiles!replies_author_id_fkey (
            id,
            name,
            avatar_url
          )
        `)
        .single();

      if (error) throw error;

      // Increment rate counter
      await supabase.rpc('increment_post_rate', { p_user_id: user.id, p_type: 'reply' });

      // Update topic's last_activity_at
      await supabase
        .from('topics')
        .update({ last_activity_at: new Date().toISOString() })
        .eq('id', tId);

      const transformedReply = {
        id: newReply.id,
        topic_id: newReply.topic_id,
        parent_id: newReply.parent_reply_id,
        depth: parentReplyId ? 1 : 0,
        content: { rendered: newReply.content },
        author: {
          id: newReply.author_id,
          name: newReply.user_profiles?.name || 'You',
          avatar: newReply.user_profiles?.avatar_url,
        },
        created: newReply.created_at,
        edited: false,
        reactions: {},
        reaction_count: 0,
        reply_count: 0,
        mentions: [],
        media: [],
      };

      setReplies(prev => [...prev, transformedReply]);
      setTotal(prev => prev + 1);

      return transformedReply;
    } catch (err) {
      console.error('Error creating reply:', err);
      throw err;
    }
  }, [replies]);

  // Update a reply
  const updateReply = useCallback(async (replyId, content) => {
    if (!isSupabaseConfigured()) {
      setReplies(prev => prev.map(reply => {
        if (reply.id === parseInt(replyId)) {
          return {
            ...reply,
            content: { rendered: content },
            edited: true
          };
        }
        return reply;
      }));
      return;
    }

    try {
      const { error } = await supabase
        .from('replies')
        .update({
          content,
          updated_at: new Date().toISOString(),
        })
        .eq('id', replyId);

      if (error) throw error;

      setReplies(prev => prev.map(reply => {
        if (reply.id === replyId) {
          return {
            ...reply,
            content: { rendered: content },
            edited: true
          };
        }
        return reply;
      }));
    } catch (err) {
      console.error('Error updating reply:', err);
      throw err;
    }
  }, []);

  // Delete a reply (soft delete)
  const deleteReply = useCallback(async (replyId) => {
    if (!isSupabaseConfigured()) {
      setReplies(prev => prev.filter(r => r.id !== parseInt(replyId)));
      setTotal(prev => prev - 1);
      return;
    }

    try {
      const { error } = await supabase
        .from('replies')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', replyId);

      if (error) throw error;

      setReplies(prev => prev.filter(r => r.id !== replyId));
      setTotal(prev => prev - 1);
    } catch (err) {
      console.error('Error deleting reply:', err);
      throw err;
    }
  }, []);

  // Toggle reaction on a reply
  const toggleReaction = useCallback(async (replyId, reactionType) => {
    if (!isSupabaseConfigured()) {
      // Mock behavior - update local state
      setReplies(prev => prev.map(reply => {
        if (reply.id === replyId) {
          const hasReaction = reply.user_reaction === reactionType;
          return {
            ...reply,
            user_reaction: hasReaction ? null : reactionType,
            reaction_count: hasReaction ? reply.reaction_count - 1 : reply.reaction_count + 1,
          };
        }
        return reply;
      }));
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if user already reacted
      const { data: existing } = await supabase
        .from('reply_reactions')
        .select('*')
        .eq('reply_id', replyId)
        .eq('user_id', user.id)
        .single();

      if (existing) {
        if (existing.reaction_type === reactionType) {
          // Remove reaction
          await supabase
            .from('reply_reactions')
            .delete()
            .eq('reply_id', replyId)
            .eq('user_id', user.id);

          setReplies(prev => prev.map(r =>
            r.id === replyId
              ? { ...r, user_reaction: null, reaction_count: Math.max(0, r.reaction_count - 1) }
              : r
          ));
        } else {
          // Change reaction type
          await supabase
            .from('reply_reactions')
            .update({ reaction_type: reactionType })
            .eq('reply_id', replyId)
            .eq('user_id', user.id);

          setReplies(prev => prev.map(r =>
            r.id === replyId
              ? { ...r, user_reaction: reactionType }
              : r
          ));
        }
      } else {
        // Add new reaction
        await supabase
          .from('reply_reactions')
          .insert({ reply_id: replyId, user_id: user.id, reaction_type: reactionType });

        setReplies(prev => prev.map(r =>
          r.id === replyId
            ? { ...r, user_reaction: reactionType, reaction_count: r.reaction_count + 1 }
            : r
        ));
      }
    } catch (err) {
      console.error('Error toggling reaction:', err);
    }
  }, []);

  // Check if current user is the author of a reply
  const isAuthor = useCallback(async (reply) => {
    if (!isSupabaseConfigured()) {
      return reply.author.id === mockUsers.currentUser.id;
    }

    const { data: { user } } = await supabase.auth.getUser();
    return user && reply.author.id === user.id;
  }, []);

  // Go to page
  const goToPage = useCallback((page) => {
    if (topicId) {
      fetchReplies(topicId, page);
    }
  }, [topicId, fetchReplies]);

  // Refresh replies
  const refresh = useCallback(() => {
    if (topicId) {
      fetchReplies(topicId, currentPage);
    }
  }, [topicId, currentPage, fetchReplies]);

  // Get replies sorted by date (oldest first for forum threads)
  const sortedReplies = [...replies].sort(
    (a, b) => new Date(a.created) - new Date(b.created)
  );

  return {
    replies: sortedReplies,
    total,
    totalPages,
    currentPage,
    loading: loading || authLoading,
    error,

    // Methods
    fetchReplies,
    getReply,
    createReply,
    updateReply,
    deleteReply,
    toggleReaction,
    isAuthor,
    goToPage,
    refresh,

    // Computed values
    hasReplies: replies.length > 0,
    replyCount: total,

    // Auth state
    isAuthenticated: !!user,
    user,
  };
}

export default useReplies;
