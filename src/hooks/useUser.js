/**
 * useUser Hook
 *
 * Returns user profile data with loading state.
 * Fetches from Supabase when authenticated, falls back to mock data/localStorage when not.
 *
 * The returned `user` object is enriched with data from related sources
 * (academic profile, clinical profile, target programs) to provide a
 * complete view for the Guidance Engine.
 *
 * NOTE: Target programs are now fetched via usePrograms hook and passed
 * to components that need combined user+program data.
 *
 * Tables used:
 * - user_profiles (core profile data)
 * - user_academic_profiles (GPA, GRE scores)
 * - user_clinical_profiles (ICU experience, hospital info)
 * - user_certifications (CCRN, BLS, etc.)
 * - user_guidance_state (guidance engine state)
 * - user_focus_areas (active focus areas)
 * - user_badges (earned badges)
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  mockUser,
  mockAcademicProfile,
  mockClinicalProfile,
  getNextLevelInfo,
} from '@/data/mockUser';
import { mockMilestones } from '@/data/mockMilestones';
import { usePrograms } from './usePrograms';
import { useAuth } from './useAuth';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export function useUser() {
  // Use centralized auth context instead of creating another subscription
  const { user: authUser, isLoading: authLoading } = useAuth();

  const [user, setUser] = useState(null);
  const [academicProfile, setAcademicProfile] = useState(null);
  const [clinicalProfile, setClinicalProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get real program data from usePrograms hook
  const { targetPrograms: realTargetPrograms, loading: programsLoading } = usePrograms();

  // Fetch user data from Supabase or use mock data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);

        if (authUser && isSupabaseConfigured()) {
          // Fetch from Supabase
          const [
            { data: profile, error: profileError },
            { data: academic, error: academicError },
            { data: clinical, error: clinicalError },
            { data: certifications, error: certsError },
            { data: guidanceState, error: guidanceError },
            { data: focusAreas, error: focusError },
            { data: badges, error: badgesError },
            { data: completedPrereqs, error: prereqsError },
          ] = await Promise.all([
            supabase.from('user_profiles').select('*').eq('id', authUser.id).single(),
            supabase.from('user_academic_profiles').select('*').eq('user_id', authUser.id).single(),
            supabase.from('user_clinical_profiles').select('*').eq('user_id', authUser.id).single(),
            supabase.from('user_certifications').select('*').eq('user_id', authUser.id),
            supabase.from('user_guidance_state').select('*').eq('user_id', authUser.id).single(),
            supabase.from('user_focus_areas').select('*').eq('user_id', authUser.id),
            supabase.from('user_badges').select('*').eq('user_id', authUser.id),
            supabase.from('user_completed_prerequisites').select('*').eq('user_id', authUser.id),
          ]);

          if (profileError && profileError.code !== 'PGRST116') throw profileError;
          if (academicError && academicError.code !== 'PGRST116') throw academicError;
          if (clinicalError && clinicalError.code !== 'PGRST116') throw clinicalError;
          if (certsError) throw certsError;
          if (guidanceError && guidanceError.code !== 'PGRST116') throw guidanceError;
          if (focusError) throw focusError;
          if (badgesError) throw badgesError;
          if (prereqsError) throw prereqsError;

          // Transform Supabase data to camelCase
          const transformedUser = profile ? {
            id: profile.id,
            email: profile.email,
            name: profile.name,
            preferredName: profile.preferred_name,
            avatarUrl: profile.avatar_url,
            subscriptionTier: profile.subscription_tier,
            subscriptionStatus: profile.subscription_status,
            trialEndsAt: profile.trial_ends_at,
            programStatus: profile.program_status,
            points: profile.points,
            level: profile.level,
            levelName: profile.level_name,
            loginStreak: profile.login_streak,
            previousStreak: profile.previous_streak,
            lastLoginAt: profile.last_login_at,
            onboardingCompletedAt: profile.onboarding_completed_at,
            onboardingWidgetComplete: profile.onboarding_widget_complete,
            onboardingWidgetProgress: profile.onboarding_widget_progress,
            onboardingPath: profile.onboarding_path,
            readyScore: profile.ready_score,
            previousReadyScore: profile.previous_ready_score,
            lastReadyScoreCelebration: profile.last_ready_score_celebration,
            resumeCompleted: profile.resume_completed,
            personalStatementCompleted: profile.personal_statement_completed,
            previousChecklistCompleted: profile.previous_checklist_completed,
            hasSeenFirstTargetCelebration: profile.has_seen_first_target_celebration,
            hasSeenSchoolScoutBadge: profile.has_seen_school_scout_badge,
            createdAt: profile.created_at,
            updatedAt: profile.updated_at,
            guidanceState: guidanceState ? {
              applicationStage: guidanceState.application_stage,
              supportMode: guidanceState.support_mode,
              riskSignals: guidanceState.risk_signals || [],
              nextBestSteps: guidanceState.next_best_steps || [],
              primaryFocusAreas: (focusAreas || []).map(fa => ({
                area: fa.area,
                status: fa.status,
                activatedAt: fa.activated_at,
                lastEngagedAt: fa.last_engaged_at,
                completedAt: fa.completed_at,
                source: fa.source,
              })),
              lastComputedAt: guidanceState.last_computed_at,
            } : mockUser.guidanceState,
            badges: (badges || []).map(b => ({
              id: b.badge_id,
              name: b.badge_name,
              description: b.badge_description,
              earnedAt: b.earned_at,
            })),
          } : null;

          const transformedAcademic = academic ? {
            userId: academic.user_id,
            overallGpa: academic.overall_gpa ? parseFloat(academic.overall_gpa) : null,
            scienceGpa: academic.science_gpa ? parseFloat(academic.science_gpa) : null,
            scienceGpaWithForgiveness: academic.science_gpa_with_forgiveness ? parseFloat(academic.science_gpa_with_forgiveness) : null,
            last60Gpa: academic.last_60_gpa ? parseFloat(academic.last_60_gpa) : null,
            nursingGpa: academic.nursing_gpa ? parseFloat(academic.nursing_gpa) : null,
            gpaCalculated: academic.gpa_calculated,
            greQuantitative: academic.gre_quantitative,
            greVerbal: academic.gre_verbal,
            greAnalyticalWriting: academic.gre_analytical_writing ? parseFloat(academic.gre_analytical_writing) : null,
            greCombined: academic.gre_combined,
            greTestDate: academic.gre_test_date,
            greExpiresDate: academic.gre_expires_date,
            completedPrerequisites: (completedPrereqs || []).map(p => ({
              courseType: p.course_type,
              year: p.year,
              grade: p.grade,
              schoolName: p.school_name,
              credits: p.credits,
              isGraduateLevel: p.is_graduate_level,
              notes: p.notes,
            })),
          } : null;

          const transformedClinical = clinical ? {
            userId: clinical.user_id,
            primaryIcuType: clinical.primary_icu_type,
            additionalIcuTypes: clinical.additional_icu_types || [],
            totalYearsExperience: clinical.total_years_experience ? parseFloat(clinical.total_years_experience) : null,
            hospitalName: clinical.hospital_name,
            hospitalCity: clinical.hospital_city,
            hospitalState: clinical.hospital_state,
            unitType: clinical.unit_type,
            bedCount: clinical.bed_count,
            isTeachingHospital: clinical.is_teaching_hospital,
            isLevel1Trauma: clinical.is_level_1_trauma,
            employmentStatus: clinical.employment_status,
            startDate: clinical.start_date,
            certifications: (certifications || []).map(c => ({
              id: c.id,
              type: c.cert_type,
              status: c.status,
              earnedDate: c.earned_date,
              expiresDate: c.expires_date,
              expirationDate: c.expires_date, // Alias for compatibility
              verificationNumber: c.verification_number,
              scheduledDate: c.scheduled_date,
              studyStartDate: c.study_start_date,
            })),
          } : null;

          setUser(transformedUser);
          setAcademicProfile(transformedAcademic);
          setClinicalProfile(transformedClinical);
        } else {
          // Not authenticated: use mock data
          await new Promise((resolve) => setTimeout(resolve, 300));
          setUser(mockUser);
          setAcademicProfile(mockAcademicProfile);
          setClinicalProfile(mockClinicalProfile);
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err.message);
        // Fallback to mock data on error
        setUser(mockUser);
        setAcademicProfile(mockAcademicProfile);
        setClinicalProfile(mockClinicalProfile);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchUser();
    }
  }, [authUser, authLoading]);

  // Enrich user object with related data for Guidance Engine
  // This combines data from multiple sources into a single object
  const enrichedUser = useMemo(() => {
    if (!user) return null;

    // Transform target programs for engine compatibility (using real data)
    const targetPrograms = realTargetPrograms
      .filter((p) => p.isTarget)
      .map((p) => ({
        id: p.id,
        name: p.program?.schoolName || 'Unknown Program',
        status: p.targetData?.status || 'researching',
        deadline: p.program?.applicationDeadline,
        checklist: p.targetData?.checklist || [],
        checklistProgress: p.targetData?.progress
          ? p.targetData.progress / 100
          : 0,
        requiresCCRN: p.program?.requirements?.ccrn === 'required',
        requiresGRE: p.program?.requirements?.gre === 'required',
        missingPrereqs: [], // Would be computed from comparing user prereqs to program reqs
      }));

    return {
      ...user,
      // From clinical profile
      certifications: clinicalProfile?.certifications || [],
      // From academic profile
      academicProfile: {
        gpaCalculated: academicProfile?.gpaCalculated || false,
        scienceGpa: academicProfile?.scienceGpa,
        overallGpa: academicProfile?.overallGpa,
        greScore: academicProfile?.greCombined,
        completedPrerequisites: academicProfile?.completedPrerequisites || [],
      },
      // Target programs (enriched with computed fields)
      targetPrograms,
      // Milestones from mock data
      milestones: mockMilestones,
      // Primary focus areas from guidanceState
      primaryFocusAreas: user.guidanceState?.primaryFocusAreas || [],
    };
  }, [user, academicProfile, clinicalProfile, realTargetPrograms]);

  // Calculate next level info
  const nextLevelInfo = user ? getNextLevelInfo(user.points) : null;

  // Update user profile in Supabase
  const updateUserProfile = useCallback(async (updates) => {
    if (!authUser || !isSupabaseConfigured()) {
      console.warn('Cannot update profile: user not authenticated');
      return;
    }

    try {
      // Map camelCase to snake_case for Supabase
      const supabaseUpdates = {};
      if (updates.name !== undefined) supabaseUpdates.name = updates.name;
      if (updates.preferredName !== undefined) supabaseUpdates.preferred_name = updates.preferredName;
      if (updates.avatarUrl !== undefined) supabaseUpdates.avatar_url = updates.avatarUrl;
      if (updates.programStatus !== undefined) supabaseUpdates.program_status = updates.programStatus;
      if (updates.onboardingCompletedAt !== undefined) supabaseUpdates.onboarding_completed_at = updates.onboardingCompletedAt;
      if (updates.onboardingWidgetComplete !== undefined) supabaseUpdates.onboarding_widget_complete = updates.onboardingWidgetComplete;
      if (updates.onboardingWidgetProgress !== undefined) supabaseUpdates.onboarding_widget_progress = updates.onboardingWidgetProgress;
      if (updates.onboardingPath !== undefined) supabaseUpdates.onboarding_path = updates.onboardingPath;
      if (updates.resumeCompleted !== undefined) supabaseUpdates.resume_completed = updates.resumeCompleted;
      if (updates.personalStatementCompleted !== undefined) supabaseUpdates.personal_statement_completed = updates.personalStatementCompleted;
      if (updates.readyScore !== undefined) supabaseUpdates.ready_score = updates.readyScore;
      if (updates.previousReadyScore !== undefined) supabaseUpdates.previous_ready_score = updates.previousReadyScore;
      if (updates.lastReadyScoreCelebration !== undefined) supabaseUpdates.last_ready_score_celebration = updates.lastReadyScoreCelebration;

      const { error: updateError } = await supabase
        .from('user_profiles')
        .update(supabaseUpdates)
        .eq('id', authUser.id);

      if (updateError) throw updateError;

      // Update local state
      setUser(prev => prev ? { ...prev, ...updates } : prev);
    } catch (err) {
      console.error('Error updating user profile:', err);
      setError(err.message);
    }
  }, [authUser]);

  // Update academic profile
  const updateAcademicProfile = useCallback(async (updates) => {
    if (!authUser || !isSupabaseConfigured()) {
      console.warn('Cannot update academic profile: user not authenticated');
      return;
    }

    try {
      // Map camelCase to snake_case for Supabase
      const supabaseUpdates = {};
      if (updates.overallGpa !== undefined) supabaseUpdates.overall_gpa = updates.overallGpa;
      if (updates.scienceGpa !== undefined) supabaseUpdates.science_gpa = updates.scienceGpa;
      if (updates.scienceGpaWithForgiveness !== undefined) supabaseUpdates.science_gpa_with_forgiveness = updates.scienceGpaWithForgiveness;
      if (updates.last60Gpa !== undefined) supabaseUpdates.last_60_gpa = updates.last60Gpa;
      if (updates.nursingGpa !== undefined) supabaseUpdates.nursing_gpa = updates.nursingGpa;
      if (updates.gpaCalculated !== undefined) supabaseUpdates.gpa_calculated = updates.gpaCalculated;
      if (updates.greQuantitative !== undefined) supabaseUpdates.gre_quantitative = updates.greQuantitative;
      if (updates.greVerbal !== undefined) supabaseUpdates.gre_verbal = updates.greVerbal;
      if (updates.greAnalyticalWriting !== undefined) supabaseUpdates.gre_analytical_writing = updates.greAnalyticalWriting;
      if (updates.greCombined !== undefined) supabaseUpdates.gre_combined = updates.greCombined;
      if (updates.greTestDate !== undefined) supabaseUpdates.gre_test_date = updates.greTestDate;
      if (updates.greExpiresDate !== undefined) supabaseUpdates.gre_expires_date = updates.greExpiresDate;

      const { error: updateError } = await supabase
        .from('user_academic_profiles')
        .upsert({ user_id: authUser.id, ...supabaseUpdates }, { onConflict: 'user_id' });

      if (updateError) throw updateError;

      // Update local state
      setAcademicProfile(prev => prev ? { ...prev, ...updates } : updates);
    } catch (err) {
      console.error('Error updating academic profile:', err);
      setError(err.message);
    }
  }, [authUser]);

  // Update clinical profile
  const updateClinicalProfile = useCallback(async (updates) => {
    if (!authUser || !isSupabaseConfigured()) {
      console.warn('Cannot update clinical profile: user not authenticated');
      return;
    }

    try {
      // Map camelCase to snake_case for Supabase
      const supabaseUpdates = {};
      if (updates.primaryIcuType !== undefined) supabaseUpdates.primary_icu_type = updates.primaryIcuType;
      if (updates.additionalIcuTypes !== undefined) supabaseUpdates.additional_icu_types = updates.additionalIcuTypes;
      if (updates.totalYearsExperience !== undefined) supabaseUpdates.total_years_experience = updates.totalYearsExperience;
      if (updates.hospitalName !== undefined) supabaseUpdates.hospital_name = updates.hospitalName;
      if (updates.hospitalCity !== undefined) supabaseUpdates.hospital_city = updates.hospitalCity;
      if (updates.hospitalState !== undefined) supabaseUpdates.hospital_state = updates.hospitalState;
      if (updates.unitType !== undefined) supabaseUpdates.unit_type = updates.unitType;
      if (updates.bedCount !== undefined) supabaseUpdates.bed_count = updates.bedCount;
      if (updates.isTeachingHospital !== undefined) supabaseUpdates.is_teaching_hospital = updates.isTeachingHospital;
      if (updates.isLevel1Trauma !== undefined) supabaseUpdates.is_level_1_trauma = updates.isLevel1Trauma;
      if (updates.employmentStatus !== undefined) supabaseUpdates.employment_status = updates.employmentStatus;
      if (updates.startDate !== undefined) supabaseUpdates.start_date = updates.startDate;

      const { error: updateError } = await supabase
        .from('user_clinical_profiles')
        .upsert({ user_id: authUser.id, ...supabaseUpdates }, { onConflict: 'user_id' });

      if (updateError) throw updateError;

      // Update local state
      setClinicalProfile(prev => prev ? { ...prev, ...updates } : updates);
    } catch (err) {
      console.error('Error updating clinical profile:', err);
      setError(err.message);
    }
  }, [authUser]);

  return {
    user: enrichedUser,
    academicProfile,
    clinicalProfile,
    nextLevelInfo,
    loading: loading || programsLoading || authLoading,
    error,

    // Auth state
    isAuthenticated: !!authUser,
    authUser,

    // Update methods
    updateUserProfile,
    updateAcademicProfile,
    updateClinicalProfile,

    // Helper methods
    isSubscribed: user?.subscriptionStatus === 'active',
    isTrial: user?.subscriptionStatus === 'trialing',
    hasCompletedOnboarding: !!user?.onboardingCompletedAt,
  };
}
