/**
 * useReactions Hook
 *
 * Manages reactions on topics and replies from Supabase community forums.
 * Supports toggling reactions (like, love, helpful) on both topics and replies.
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export function useReactions(contentType = null, contentId = null) {
  const [reactions, setReactions] = useState([]);
  const [userReaction, setUserReaction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get table name based on content type
  const getTableName = useCallback((type) => {
    return type === 'topic' ? 'topic_reactions' : 'reply_reactions';
  }, []);

  // Get content ID field name based on content type
  const getContentIdField = useCallback((type) => {
    return type === 'topic' ? 'topic_id' : 'reply_id';
  }, []);

  // Fetch reactions for content
  const fetchReactions = useCallback(async (type, id) => {
    // Fall back gracefully if Supabase not configured
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, reactions disabled');
      setReactions([]);
      setUserReaction(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const tableName = getTableName(type);
      const contentIdField = getContentIdField(type);

      // Fetch all reactions for this content
      const { data: reactionsData, error: reactionsError } = await supabase
        .from(tableName)
        .select('user_id, reaction_type, created_at')
        .eq(contentIdField, id);

      if (reactionsError) throw reactionsError;

      setReactions(reactionsData || []);

      // Check if current user has reacted
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const currentUserReaction = reactionsData?.find(r => r.user_id === user.id);
        setUserReaction(currentUserReaction ? currentUserReaction.reaction_type : null);
      } else {
        setUserReaction(null);
      }
    } catch (err) {
      console.error('Error fetching reactions:', err);
      setError(err.message);
      setReactions([]);
      setUserReaction(null);
    } finally {
      setLoading(false);
    }
  }, [getTableName, getContentIdField]);

  // Initial fetch if contentType and contentId are provided
  useEffect(() => {
    if (contentType && contentId) {
      fetchReactions(contentType, contentId);
    }
  }, [contentType, contentId, fetchReactions]);

  // Toggle a reaction (add if not present, remove if same, replace if different)
  const toggleReaction = useCallback(async (type, id, reactionType) => {
    // Fall back gracefully if Supabase not configured
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, reactions disabled');
      return { success: false, error: 'Reactions not available' };
    }

    try {
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Must be logged in to react');
      }

      const tableName = getTableName(type);
      const contentIdField = getContentIdField(type);

      // Check if user already has a reaction
      const { data: existing, error: checkError } = await supabase
        .from(tableName)
        .select('reaction_type')
        .eq(contentIdField, id)
        .eq('user_id', user.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116 is "not found" which is expected
        throw checkError;
      }

      if (existing) {
        if (existing.reaction_type === reactionType) {
          // Same reaction - remove it
          const { error: deleteError } = await supabase
            .from(tableName)
            .delete()
            .eq(contentIdField, id)
            .eq('user_id', user.id);

          if (deleteError) throw deleteError;

          // Update local state
          setReactions(prev => prev.filter(r => r.user_id !== user.id));
          setUserReaction(null);

          return { success: true, action: 'removed' };
        } else {
          // Different reaction - update it
          const { error: updateError } = await supabase
            .from(tableName)
            .update({ reaction_type: reactionType })
            .eq(contentIdField, id)
            .eq('user_id', user.id);

          if (updateError) throw updateError;

          // Update local state
          setReactions(prev => prev.map(r =>
            r.user_id === user.id
              ? { ...r, reaction_type: reactionType }
              : r
          ));
          setUserReaction(reactionType);

          return { success: true, action: 'updated' };
        }
      } else {
        // No existing reaction - add new one
        const newReaction = {
          [contentIdField]: id,
          user_id: user.id,
          reaction_type: reactionType,
        };

        const { error: insertError } = await supabase
          .from(tableName)
          .insert(newReaction);

        if (insertError) throw insertError;

        // Update local state
        setReactions(prev => [...prev, {
          user_id: user.id,
          reaction_type: reactionType,
          created_at: new Date().toISOString(),
        }]);
        setUserReaction(reactionType);

        return { success: true, action: 'added' };
      }
    } catch (err) {
      console.error('Error toggling reaction:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, [getTableName, getContentIdField]);

  // Get reactions with counts by type
  const getReactions = useCallback((type, id) => {
    // This method allows getting reactions for different content on demand
    // Returns a promise that resolves to reaction counts
    return new Promise(async (resolve) => {
      if (!isSupabaseConfigured()) {
        resolve([]);
        return;
      }

      try {
        const tableName = getTableName(type);
        const contentIdField = getContentIdField(type);

        const { data, error } = await supabase
          .from(tableName)
          .select('reaction_type')
          .eq(contentIdField, id);

        if (error) throw error;

        // Count reactions by type
        const counts = {};
        data?.forEach(r => {
          counts[r.reaction_type] = (counts[r.reaction_type] || 0) + 1;
        });

        // Convert to array format
        const reactionsArray = Object.entries(counts).map(([type, count]) => ({
          type,
          count,
        }));

        resolve(reactionsArray);
      } catch (err) {
        console.error('Error getting reactions:', err);
        resolve([]);
      }
    });
  }, [getTableName, getContentIdField]);

  // Get current user's reaction for specific content
  const getUserReaction = useCallback(async (type, id) => {
    if (!isSupabaseConfigured()) {
      return null;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const tableName = getTableName(type);
      const contentIdField = getContentIdField(type);

      const { data, error } = await supabase
        .from(tableName)
        .select('reaction_type')
        .eq(contentIdField, id)
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data?.reaction_type || null;
    } catch (err) {
      console.error('Error getting user reaction:', err);
      return null;
    }
  }, [getTableName, getContentIdField]);

  // Get reaction counts by type from current state
  const reactionCounts = reactions.reduce((acc, reaction) => {
    acc[reaction.reaction_type] = (acc[reaction.reaction_type] || 0) + 1;
    return acc;
  }, {});

  // Get total reaction count
  const totalReactions = reactions.length;

  // Check if current user has reacted with specific type
  const hasUserReacted = useCallback((reactionType) => {
    return userReaction === reactionType;
  }, [userReaction]);

  return {
    reactions,
    reactionCounts,
    totalReactions,
    userReaction,
    loading,
    error,

    // Methods
    toggleReaction,
    getReactions,
    getUserReaction,
    hasUserReacted,
    refresh: () => {
      if (contentType && contentId) {
        fetchReactions(contentType, contentId);
      }
    },
  };
}

export default useReactions;
