/**
 * useAdminCourseSubmissions Hook
 *
 * Hook for managing prerequisite course submissions in admin view.
 * Wired to Supabase prerequisite_courses table with mock fallback.
 */

import { useState, useMemo, useCallback, useEffect } from 'react';
import supabase, { isSupabaseConfigured } from '@/lib/supabase';
import {
  mockCourseSubmissions,
  COURSE_SUBMISSION_STATUS,
  getCourseSubmissionCounts,
  approveCourseSubmission as mockApprove,
  rejectCourseSubmission as mockReject,
} from '@/data/mockPrerequisiteCourseSubmissions';

/**
 * Transform Supabase course data to match expected format
 */
function transformCourse(dbCourse) {
  return {
    id: dbCourse.id,
    schoolName: dbCourse.school_name,
    courseName: dbCourse.course_name,
    courseCode: dbCourse.course_code,
    courseUrl: dbCourse.course_url,
    subject: dbCourse.subject,
    level: dbCourse.level,
    credits: dbCourse.credits,
    format: dbCourse.format,
    costRange: dbCourse.cost_range,
    costRangeKey: dbCourse.cost_range_key,
    courseLengthWeeks: dbCourse.course_length_weeks,
    hasLab: dbCourse.has_lab,
    labKitRequired: dbCourse.lab_kit_required,
    selfPaced: dbCourse.self_paced,
    rollingAdmission: dbCourse.rolling_admission,
    reviewCount: dbCourse.review_count || 0,
    avgRecommendScore: dbCourse.avg_recommend_score,
    avgEaseScore: dbCourse.avg_ease_score,
    status: dbCourse.status,
    submittedBy: dbCourse.user_profiles ? {
      id: dbCourse.user_profiles.id,
      name: dbCourse.user_profiles.name || 'Anonymous',
      email: dbCourse.user_profiles.email || '',
      avatarUrl: dbCourse.user_profiles.avatar_url || null,
    } : null,
    submittedAt: dbCourse.created_at,
    approvedAt: dbCourse.approved_at,
    approvedBy: dbCourse.approved_by ? {
      id: dbCourse.approved_by,
      name: 'Admin', // Note: We don't join approver profile for simplicity
    } : null,
    rejectionReason: dbCourse.rejection_reason,
    // Note: firstReview would need to be fetched from prerequisite_reviews table
    firstReview: null,
  };
}

/**
 * Hook for fetching and managing course submissions
 *
 * @param {string} statusFilter - Filter by status ('all', 'pending', 'approved', 'rejected')
 * @returns {Object} Submissions data and actions
 */
export function useAdminCourseSubmissions(statusFilter = 'all') {
  const [submissions, setSubmissions] = useState([]);
  const [counts, setCounts] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const useSupabase = isSupabaseConfigured();

  // Fetch submissions from Supabase
  const fetchSubmissions = useCallback(async () => {
    if (!useSupabase) {
      // Use mock data when Supabase not configured
      const filtered = statusFilter === 'all'
        ? mockCourseSubmissions
        : mockCourseSubmissions.filter(s => s.status === statusFilter);
      setSubmissions(filtered);
      setCounts(getCourseSubmissionCounts());
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Build query with join to user_profiles for submitter info
      let query = supabase
        .from('prerequisite_courses')
        .select(`
          *,
          user_profiles:submitted_by (
            id,
            name,
            email,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      // Apply status filter if not 'all'
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      // Transform data to match expected format
      const transformed = (data || []).map(transformCourse);
      setSubmissions(transformed);
    } catch (err) {
      console.error('Error fetching course submissions:', err);
      setError(err.message);
      // Fallback to mock data on error
      const filtered = statusFilter === 'all'
        ? mockCourseSubmissions
        : mockCourseSubmissions.filter(s => s.status === statusFilter);
      setSubmissions(filtered);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, refreshKey, useSupabase]);

  // Fetch counts from Supabase
  const fetchCounts = useCallback(async () => {
    if (!useSupabase) {
      setCounts(getCourseSubmissionCounts());
      return;
    }

    try {
      // Get counts for each status using aggregate queries
      const [pendingResult, approvedResult, rejectedResult] = await Promise.all([
        supabase.from('prerequisite_courses').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('prerequisite_courses').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
        supabase.from('prerequisite_courses').select('*', { count: 'exact', head: true }).eq('status', 'rejected'),
      ]);

      const pending = pendingResult.count || 0;
      const approved = approvedResult.count || 0;
      const rejected = rejectedResult.count || 0;

      setCounts({
        total: pending + approved + rejected,
        pending,
        approved,
        rejected,
      });
    } catch (err) {
      console.error('Error fetching counts:', err);
      // Fallback to mock counts on error
      setCounts(getCourseSubmissionCounts());
    }
  }, [refreshKey, useSupabase]);

  // Fetch data on mount and when filters change
  useEffect(() => {
    fetchSubmissions();
    fetchCounts();
  }, [fetchSubmissions, fetchCounts]);

  // Approve a submission
  const approveSubmission = useCallback(async (submissionId) => {
    if (!useSupabase) {
      // Use mock function when Supabase not configured
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        const result = mockApprove(submissionId);
        if (result.success) {
          setRefreshKey(k => k + 1);
        }
        return result;
      } catch (error) {
        console.error('Error approving submission:', error);
        return { success: false, error: error.message };
      } finally {
        setIsLoading(false);
      }
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get current user ID for approved_by field
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Update the submission to approved status
      const { data, error: updateError } = await supabase
        .from('prerequisite_courses')
        .update({
          status: 'approved',
          approved_by: user.id,
          approved_at: new Date().toISOString(),
        })
        .eq('id', submissionId)
        .select()
        .single();

      if (updateError) throw updateError;

      // Refresh data
      setRefreshKey(k => k + 1);

      return { success: true, data: transformCourse(data) };
    } catch (err) {
      console.error('Error approving submission:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, [useSupabase]);

  // Reject a submission
  const rejectSubmission = useCallback(async (submissionId, reason) => {
    if (!useSupabase) {
      // Use mock function when Supabase not configured
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        const result = mockReject(submissionId, reason);
        if (result.success) {
          setRefreshKey(k => k + 1);
        }
        return result;
      } catch (error) {
        console.error('Error rejecting submission:', error);
        return { success: false, error: error.message };
      } finally {
        setIsLoading(false);
      }
    }

    setIsLoading(true);
    setError(null);

    try {
      // Update the submission to rejected status with reason
      const { data, error: updateError } = await supabase
        .from('prerequisite_courses')
        .update({
          status: 'rejected',
          rejection_reason: reason,
        })
        .eq('id', submissionId)
        .select()
        .single();

      if (updateError) throw updateError;

      // Refresh data
      setRefreshKey(k => k + 1);

      return { success: true, data: transformCourse(data) };
    } catch (err) {
      console.error('Error rejecting submission:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, [useSupabase]);

  // Refresh data
  const refresh = useCallback(() => {
    setRefreshKey(k => k + 1);
  }, []);

  return {
    submissions,
    counts,
    isLoading,
    error,
    approveSubmission,
    rejectSubmission,
    refresh,
  };
}

export { COURSE_SUBMISSION_STATUS };
export default useAdminCourseSubmissions;
