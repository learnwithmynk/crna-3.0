/**
 * useAdminForums Hook
 *
 * Admin-level forum management - CRUD operations for forums and subforums.
 * Includes reordering, locking, and statistics.
 *
 * Database tables: forums, schools (via school_id foreign key)
 *
 * IMPORTANT: Program subforums should link to schools via school_id.
 * This ensures program name changes in schools table automatically
 * reflect in forums without manual updates.
 *
 * When querying forums with Supabase, use the forums_with_school_info view
 * or join with schools table to get display_title from schools.name
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { mockForums } from '@/data/mockForums';
import { schools } from '@/data/supabase/schools';

// Build school lookup map from real data (150 schools)
const schoolsMap = schools.reduce((map, school) => {
  map[school.id] = school;
  return map;
}, {});

export function useAdminForums() {
  const [forums, setForums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all forums (flat list with parent relationships)
  const fetchForums = useCallback(async () => {
    // Fall back to mock data if Supabase not configured
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, using mock data');

      // Transform mock data to flat admin format
      const flatForums = [];
      mockForums.forEach(forum => {
        flatForums.push({
          id: forum.id,
          title: forum.title.rendered,
          description: forum.content?.rendered?.replace(/<[^>]*>/g, '') || '',
          parent_id: null,
          school_id: null, // Top-level forums don't link to schools
          sort_order: flatForums.length,
          is_locked: false,
          topic_count: forum.topic_count || 0,
          reply_count: forum.reply_count || 0,
          last_active: forum.last_active,
        });

        // Add subforums with school_id link
        if (forum.sub_forums) {
          forum.sub_forums.forEach((sub, idx) => {
            // Use school_id from subforum data (now using real school IDs)
            const schoolId = sub.school_id || sub.id;
            const school = schoolsMap[schoolId];

            flatForums.push({
              id: sub.id,
              // Display title comes from schools.name via school_id join
              title: school?.name || sub.title.rendered,
              description: '',
              parent_id: forum.id,
              school_id: school ? schoolId : null, // Link to schools table
              sort_order: idx,
              is_locked: false,
              topic_count: sub.topic_count || 0,
              reply_count: sub.reply_count || 0,
              last_active: null,
            });
          });
        }
      });
      setForums(flatForums);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Try to use forums_with_school_info view, fallback to join if view doesn't exist
      let forumsData, forumsError;

      // Try view first
      const viewResult = await supabase
        .from('forums_with_school_info')
        .select('*')
        .order('sort_order', { ascending: true });

      if (viewResult.error && viewResult.error.code === '42P01') {
        // View doesn't exist, fallback to manual join
        const joinResult = await supabase
          .from('forums')
          .select(`
            *,
            school:schools(id, name, city, state)
          `)
          .order('sort_order', { ascending: true });

        forumsData = joinResult.data;
        forumsError = joinResult.error;
      } else {
        forumsData = viewResult.data;
        forumsError = viewResult.error;
      }

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

      // Transform to flat admin format with counts
      const transformedForums = forumsData.map(forum => ({
        id: forum.id,
        title: forum.school_name || forum.school?.name || forum.title,
        description: forum.description || '',
        slug: forum.slug,
        parent_id: forum.parent_id,
        school_id: forum.school_id,
        sort_order: forum.sort_order,
        is_locked: forum.is_locked || false,
        topic_count: countsMap[forum.id] || 0,
        reply_count: replyCountsMap[forum.id] || 0,
        last_active: forum.updated_at,
        // Include school info if available
        school_city: forum.school_city || forum.school?.city,
        school_state: forum.school_state || forum.school?.state,
      }));

      setForums(transformedForums);
    } catch (err) {
      console.error('Error fetching admin forums:', err);
      setError(err.message);
      // Fall back to mock data on error
      setForums([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchForums();
  }, [fetchForums]);

  // Get top-level forums only
  const topLevelForums = forums.filter(f => !f.parent_id);

  // Get subforums for a parent
  const getSubforums = useCallback((parentId) => {
    return forums.filter(f => f.parent_id === parentId);
  }, [forums]);

  // Create a new forum (for non-school forums)
  const createForum = async (data) => {
    if (!isSupabaseConfigured()) {
      // Mock implementation
      const newForum = {
        id: Date.now(), // Temporary ID
        title: data.title,
        description: data.description || '',
        parent_id: data.parent_id || null,
        school_id: data.school_id || null, // Link to schools table
        sort_order: forums.length,
        is_locked: false,
        topic_count: 0,
        reply_count: 0,
        last_active: null,
      };

      setForums(prev => [...prev, newForum]);
      return newForum;
    }

    try {
      // Generate slug from title
      const slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      const { data: newForum, error } = await supabase
        .from('forums')
        .insert({
          title: data.title,
          description: data.description || '',
          slug: slug,
          parent_id: data.parent_id || null,
          school_id: data.school_id || null,
          sort_order: data.sort_order ?? forums.length,
        })
        .select()
        .single();

      if (error) throw error;

      // Add to local state
      setForums(prev => [...prev, {
        ...newForum,
        topic_count: 0,
        reply_count: 0,
      }]);

      return newForum;
    } catch (err) {
      console.error('Error creating forum:', err);
      throw err;
    }
  };

  // Create a forum linked to a school (for program subforums)
  // Use this when adding a program subforum - the title will sync with schools.name
  const createSchoolForum = async (schoolId, parentForumId) => {
    if (!isSupabaseConfigured()) {
      // Mock implementation
      const school = schoolsMap[schoolId];
      const schoolName = school?.name || 'Unknown School';

      const newForum = {
        id: Date.now(),
        title: schoolName, // Will be overridden by schools.name in production
        description: `Discussion forum for ${schoolName}`,
        parent_id: parentForumId,
        school_id: schoolId,
        sort_order: forums.filter(f => f.parent_id === parentForumId).length,
        is_locked: false,
        topic_count: 0,
        reply_count: 0,
        last_active: null,
      };

      setForums(prev => [...prev, newForum]);
      return newForum;
    }

    try {
      // Call the RPC function to get or create school forum
      const { data: forumId, error } = await supabase
        .rpc('get_or_create_school_forum', {
          p_school_id: schoolId,
          p_parent_forum_id: parentForumId
        });

      if (error) throw error;

      // Fetch the created/existing forum
      const { data: forum, error: fetchError } = await supabase
        .from('forums')
        .select(`
          *,
          school:schools(id, name, city, state)
        `)
        .eq('id', forumId)
        .single();

      if (fetchError) throw fetchError;

      // Add to local state if not already present
      const existingForum = forums.find(f => f.id === forumId);
      if (!existingForum) {
        setForums(prev => [...prev, {
          ...forum,
          title: forum.school?.name || forum.title,
          topic_count: 0,
          reply_count: 0,
        }]);
      }

      return forum;
    } catch (err) {
      console.error('Error creating school forum:', err);
      throw err;
    }
  };

  // Get forum by school ID
  const getForumBySchoolId = useCallback((schoolId) => {
    return forums.find(f => f.school_id === schoolId);
  }, [forums]);

  // Update a forum
  const updateForum = async (forumId, data) => {
    if (!isSupabaseConfigured()) {
      // Mock implementation
      setForums(prev => prev.map(f =>
        f.id === forumId ? { ...f, ...data } : f
      ));
      return;
    }

    try {
      const updateData = {};
      if (data.title !== undefined) updateData.title = data.title;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.is_locked !== undefined) updateData.is_locked = data.is_locked;
      if (data.sort_order !== undefined) updateData.sort_order = data.sort_order;

      const { error } = await supabase
        .from('forums')
        .update(updateData)
        .eq('id', forumId);

      if (error) throw error;

      // Update local state
      setForums(prev => prev.map(f =>
        f.id === forumId ? { ...f, ...data } : f
      ));
    } catch (err) {
      console.error('Error updating forum:', err);
      throw err;
    }
  };

  // Delete a forum (and its subforums)
  const deleteForum = async (forumId) => {
    if (!isSupabaseConfigured()) {
      // Mock implementation
      setForums(prev => prev.filter(f =>
        f.id !== forumId && f.parent_id !== forumId
      ));
      return;
    }

    try {
      // First check if forum has topics
      const { count, error: countError } = await supabase
        .from('topics')
        .select('*', { count: 'exact', head: true })
        .eq('forum_id', forumId)
        .is('deleted_at', null);

      if (countError) throw countError;

      if (count > 0) {
        throw new Error(`Cannot delete forum with ${count} topics. Please delete or move topics first.`);
      }

      // Check for subforums
      const subforums = forums.filter(f => f.parent_id === forumId);
      if (subforums.length > 0) {
        throw new Error(`Cannot delete forum with ${subforums.length} subforums. Please delete subforums first.`);
      }

      // Delete the forum
      const { error } = await supabase
        .from('forums')
        .delete()
        .eq('id', forumId);

      if (error) throw error;

      // Remove from local state
      setForums(prev => prev.filter(f => f.id !== forumId));
    } catch (err) {
      console.error('Error deleting forum:', err);
      throw err;
    }
  };

  // Toggle forum locked status
  const toggleLocked = async (forumId) => {
    const forum = forums.find(f => f.id === forumId);
    if (!forum) return;

    await updateForum(forumId, { is_locked: !forum.is_locked });
  };

  // Reorder forums (drag and drop)
  const reorderForums = async (reorderedForums) => {
    if (!isSupabaseConfigured()) {
      // Mock implementation
      setForums(reorderedForums.map((f, idx) => ({
        ...f,
        sort_order: idx,
      })));
      return;
    }

    try {
      // Batch update all forums with new sort_order
      const updates = reorderedForums.map((f, idx) => ({
        id: f.id,
        sort_order: idx,
      }));

      // Upsert all forums with new sort order
      const { error } = await supabase
        .from('forums')
        .upsert(updates);

      if (error) throw error;

      // Update local state
      setForums(reorderedForums.map((f, idx) => ({
        ...f,
        sort_order: idx,
      })));
    } catch (err) {
      console.error('Error reordering forums:', err);
      throw err;
    }
  };

  // Get forum statistics
  const getStats = useCallback(() => {
    return {
      totalForums: topLevelForums.length,
      totalSubforums: forums.filter(f => f.parent_id).length,
      totalTopics: forums.reduce((sum, f) => sum + (f.topic_count || 0), 0),
      totalReplies: forums.reduce((sum, f) => sum + (f.reply_count || 0), 0),
    };
  }, [forums, topLevelForums]);

  return {
    forums,
    topLevelForums,
    isLoading,
    error,
    getSubforums,
    getStats,
    createForum,
    createSchoolForum,
    getForumBySchoolId,
    updateForum,
    deleteForum,
    toggleLocked,
    reorderForums,
    refresh: fetchForums,
  };
}

export default useAdminForums;
