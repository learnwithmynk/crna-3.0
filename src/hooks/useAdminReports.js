/**
 * useAdminReports Hook
 *
 * Manages community content reports for admin moderation.
 * Handles fetching reports, updating status, hiding content, and suspending users.
 *
 * Database table: community_reports
 * Fields: id, reporter_id, content_type, content_id, reason, status,
 *         reviewed_by, reviewed_at, admin_notes, created_at
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { mockReports } from '@/data/community/mockReports';

/**
 * Fetch reports filtered by status
 * @param {string} status - 'all' | 'pending' | 'reviewed' | 'dismissed' | 'actioned'
 * @returns {Array} Filtered reports
 */
export function useAdminReports(status = 'all') {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch reports from Supabase
  const fetchReports = useCallback(async () => {
    // Fall back to mock data if Supabase not configured
    if (!isSupabaseConfigured()) {
      setTimeout(() => {
        setReports(mockReports);
        setIsLoading(false);
      }, 300);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Fetch reports with reporter profile data
      // Note: We join to user_profiles using reporter_id
      const { data: reportsData, error: reportsError } = await supabase
        .from('community_reports')
        .select(`
          id,
          reporter_id,
          content_type,
          content_id,
          reason,
          status,
          reviewed_by,
          reviewed_at,
          admin_notes,
          created_at,
          reporter:user_profiles!reporter_id (
            id,
            name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (reportsError) throw reportsError;

      // Get content details for each report
      const enrichedReports = await Promise.all(
        (reportsData || []).map(async (report) => {
          let contentPreview = '';
          let contentAuthorId = null;
          let contentAuthorName = 'Unknown';

          try {
            if (report.content_type === 'topic') {
              const { data: topic } = await supabase
                .from('topics')
                .select(`
                  content,
                  author_id,
                  author:user_profiles!author_id (name)
                `)
                .eq('id', report.content_id)
                .single();

              if (topic) {
                // Strip HTML tags for preview
                contentPreview = topic.content.replace(/<[^>]*>/g, '').substring(0, 150);
                contentAuthorId = topic.author_id;
                contentAuthorName = topic.author?.name || 'Unknown';
              }
            } else if (report.content_type === 'reply') {
              const { data: reply } = await supabase
                .from('replies')
                .select(`
                  content,
                  author_id,
                  author:user_profiles!author_id (name)
                `)
                .eq('id', report.content_id)
                .single();

              if (reply) {
                contentPreview = reply.content.replace(/<[^>]*>/g, '').substring(0, 150);
                contentAuthorId = reply.author_id;
                contentAuthorName = reply.author?.name || 'Unknown';
              }
            }
          } catch (err) {
            console.error('Error fetching content for report:', err);
          }

          return {
            id: report.id,
            reporter_id: report.reporter_id,
            reporter_name: report.reporter?.name || 'Unknown',
            reporter_avatar: report.reporter?.avatar_url || null,
            content_type: report.content_type,
            content_id: report.content_id,
            content_preview: contentPreview,
            content_author_id: contentAuthorId,
            content_author_name: contentAuthorName,
            reason: report.reason,
            details: '', // Not stored in DB, only in mock
            status: report.status,
            reviewed_by: report.reviewed_by,
            reviewed_at: report.reviewed_at,
            admin_notes: report.admin_notes,
            created_at: report.created_at,
          };
        })
      );

      setReports(enrichedReports);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError(err.message);
      // Fall back to mock data on error
      setReports(mockReports);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Filter by status
  const filteredReports = useMemo(() => {
    if (status === 'all') return reports;
    return reports.filter(r => r.status === status);
  }, [reports, status]);

  /**
   * Update report status with admin notes
   * @param {string} reportId - Report ID
   * @param {string} newStatus - New status
   * @param {string} notes - Admin notes
   */
  const updateReportStatus = async (reportId, newStatus, notes = '') => {
    if (!isSupabaseConfigured()) {
      // Update local state
      setReports(prev => prev.map(r =>
        r.id === reportId
          ? {
            ...r,
            status: newStatus,
            admin_notes: notes,
            reviewed_at: new Date().toISOString()
          }
          : r
      ));
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Must be logged in to update reports');

      const { error } = await supabase
        .from('community_reports')
        .update({
          status: newStatus,
          admin_notes: notes,
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', reportId);

      if (error) throw error;

      // Update local state
      setReports(prev => prev.map(r =>
        r.id === reportId
          ? {
            ...r,
            status: newStatus,
            admin_notes: notes,
            reviewed_by: user.id,
            reviewed_at: new Date().toISOString()
          }
          : r
      ));
    } catch (err) {
      console.error('Error updating report status:', err);
      throw err;
    }
  };

  /**
   * Hide reported content (topic or reply)
   * @param {string} contentType - 'topic' | 'reply'
   * @param {string} contentId - Content ID
   */
  const hideContent = async (contentType, contentId) => {
    if (!isSupabaseConfigured()) {
      return;
    }

    try {
      const table = contentType === 'topic' ? 'topics' : 'replies';
      const { error } = await supabase
        .from(table)
        .update({ is_hidden: true })
        .eq('id', contentId);

      if (error) throw error;
    } catch (err) {
      console.error('Error hiding content:', err);
      throw err;
    }
  };

  /**
   * Suspend user account
   * @param {string} userId - User ID to suspend
   * @param {number} durationDays - Suspension duration in days (0 = permanent)
   * @param {string} reason - Suspension reason
   */
  const suspendUser = async (userId, durationDays, reason) => {
    if (!isSupabaseConfigured()) {
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Must be logged in to suspend users');

      const suspendedUntil = durationDays === 0
        ? null // Permanent suspension
        : new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();

      const { error } = await supabase
        .from('user_suspensions')
        .insert({
          user_id: userId,
          suspended_by: user.id,
          reason: reason,
          suspended_until: suspendedUntil
        });

      if (error) throw error;
    } catch (err) {
      console.error('Error suspending user:', err);
      throw err;
    }
  };

  return {
    reports: filteredReports,
    isLoading,
    error,
    updateReportStatus,
    hideContent,
    suspendUser,
    refresh: fetchReports,
  };
}

export default useAdminReports;
