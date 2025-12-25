/**
 * useSchools Hook
 *
 * Manages school data, filtering, sorting, and saved schools state.
 * Fetches school data from Supabase with fallback to static data.
 * Integrates fit score calculation with user profile data.
 */

import { useState, useMemo, useCallback, useEffect } from 'react';
import { usePersistentState } from './usePersistentState';
import { schools as staticSchools } from '@/data/supabase/schools';
import { mockAcademicProfile, mockClinicalProfile } from '@/data/mockUser';
import { mockUserUnitProfile } from '@/data/mockUserUnitProfile';
import { calculateFitScore } from '@/lib/fitScoreCalculator';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from './useAuth';

// Combine user profile data for fit score calculation
const getUserProfile = () => ({
  ...mockAcademicProfile,
  ...mockClinicalProfile,
  hospitalState: mockUserUnitProfile.hospitalState,
  unitType: mockUserUnitProfile.unitType,
});

// Convert snake_case Supabase columns to camelCase JS keys
function toCamelCase(str) {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

// Transform a school object from Supabase format to JS format
function transformSchoolFromSupabase(school) {
  const transformed = {};
  for (const [key, value] of Object.entries(school)) {
    const camelKey = toCamelCase(key);
    transformed[camelKey] = value;
  }
  return transformed;
}

// LocalStorage keys
const SAVED_SCHOOLS_KEY = 'crna_saved_schools';
const TARGET_SCHOOLS_KEY = 'crna_target_schools';

/**
 * Main hook for school database functionality
 */
export function useSchools() {
  // Auth state for Supabase operations
  const { user } = useAuth();

  // Schools data state
  const [schools, setSchools] = useState(staticSchools);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch schools from Supabase on mount
  useEffect(() => {
    async function fetchSchools() {
      if (!isSupabaseConfigured()) {
        console.warn('Supabase not configured, using static schools data');
        setSchools(staticSchools);
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from('schools')
          .select('*')
          .order('name');

        if (fetchError) {
          console.error('Error fetching schools:', fetchError.message);
          setError(fetchError.message);
          // Fall back to static data
          setSchools(staticSchools);
        } else if (data && data.length > 0) {
          // Transform snake_case to camelCase
          const transformedSchools = data.map(transformSchoolFromSupabase);
          setSchools(transformedSchools);
        } else {
          // No data in Supabase, use static
          console.warn('No schools in Supabase, using static data');
          setSchools(staticSchools);
        }
      } catch (err) {
        console.error('Unexpected error fetching schools:', err);
        setError(err.message);
        setSchools(staticSchools);
      } finally {
        setLoading(false);
      }
    }

    fetchSchools();
  }, []);

  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    states: [],
    tuitionMin: 0,
    tuitionMax: 300000,

    // GRE checkboxes (multiple can be selected)
    greNotRequired: false,
    greRequired: false,
    greWaived: false,

    // Requires / Does Not Require multi-select
    requires: [],
    doesNotRequire: [],

    // Specialty Accepted
    acceptsNicu: false,
    acceptsPicu: false,
    acceptsEr: false,
    acceptsOtherCriticalCare: false,

    // Program Type checkboxes
    typeFrontLoaded: false,
    typeIntegrated: false,

    // GPA Type filters (which GPA types the program uses)
    gpaScience: false,
    gpaNursing: false,
    gpaCumulative: false,
    gpaGraduate: false,
    gpaLast60: false,

    // Other section
    ableToWork: false,
    nursingCas: false,
    rollingAdmissions: false,
    partiallyOnline: false,
    acceptsBachelorsScienceRelated: false,
  });

  // Sort state
  const [sortBy, setSortBy] = useState('name'); // 'fitScore', 'name', 'deadline', 'tuition'
  const [sortOrder, setSortOrder] = useState('asc');

  // View mode
  const [viewMode, setViewMode] = useState('all'); // 'recommended', 'all', 'comparison'

  // Saved schools (persisted to localStorage)
  const [savedSchoolIdsRaw, setSavedSchoolIds] = usePersistentState(SAVED_SCHOOLS_KEY, []);

  // Target schools (persisted to localStorage)
  const [targetSchoolIdsRaw, setTargetSchoolIds] = usePersistentState(TARGET_SCHOOLS_KEY, []);

  // Ensure we always have arrays, even if localStorage has corrupted/different data format
  const savedSchoolIds = Array.isArray(savedSchoolIdsRaw) ? savedSchoolIdsRaw : [];
  const targetSchoolIds = Array.isArray(targetSchoolIdsRaw) ? targetSchoolIdsRaw : [];

  // Comparison selection
  const [comparisonIds, setComparisonIds] = useState([]);

  // User profile for fit scores
  const userProfile = useMemo(() => getUserProfile(), []);

  // All states for filter dropdown
  const allStates = useMemo(() => {
    const states = [...new Set(schools.map(s => s.state))].filter(Boolean);
    return states.sort();
  }, [schools]);

  // Calculate fit scores for all schools
  const schoolsWithFitScore = useMemo(() => {
    return schools.map(school => ({
      ...school,
      fitScore: calculateFitScore(school, userProfile),
      isSaved: savedSchoolIds.includes(school.id),
      isTarget: targetSchoolIds.includes(school.id),
    }));
  }, [schools, userProfile, savedSchoolIds, targetSchoolIds]);

  // Mapping for requires/doesNotRequire filters
  const requirementFieldMap = {
    ccrn: 'ccrnRequired',
    gre: 'greRequired',
    shadowing: 'shadowingRequired',
    statistics: 'prereqStatistics',
    genChemistry: 'prereqGenChemistry',
    organicChemistry: 'prereqOrganicChemistry',
    biochemistry: 'prereqBiochemistry',
    anatomy: 'prereqAnatomy',
    physics: 'prereqPhysics',
    pharmacology: 'prereqPharmacology',
    physiology: 'prereqPhysiology',
    microbiology: 'prereqMicrobiology',
    research: 'prereqResearch',
  };

  // Apply filters
  const filteredSchools = useMemo(() => {
    return schoolsWithFitScore.filter(school => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesName = school.name?.toLowerCase().includes(searchLower);
        const matchesCity = school.city?.toLowerCase().includes(searchLower);
        const matchesState = school.state?.toLowerCase().includes(searchLower);
        if (!matchesName && !matchesCity && !matchesState) return false;
      }

      // State filter
      if (filters.states.length > 0 && !filters.states.includes(school.state)) {
        return false;
      }

      // Tuition filter
      const tuition = school.tuitionInState || school.tuitionOutOfState || 0;
      if (tuition < filters.tuitionMin || tuition > filters.tuitionMax) {
        return false;
      }

      // GRE filter (checkbox style - OR logic when multiple selected)
      const greFiltersActive = filters.greNotRequired || filters.greRequired || filters.greWaived;
      if (greFiltersActive) {
        const matchesNotRequired = filters.greNotRequired && !school.greRequired;
        const matchesRequired = filters.greRequired && school.greRequired && !school.greWaivedFor;
        const matchesWaived = filters.greWaived && school.greWaivedFor;
        if (!matchesNotRequired && !matchesRequired && !matchesWaived) return false;
      }

      // Requires filter (AND logic - school must require ALL selected items)
      if (filters.requires.length > 0) {
        for (const req of filters.requires) {
          const field = requirementFieldMap[req];
          if (field && !school[field]) return false;
        }
      }

      // Does Not Require filter (AND logic - school must NOT require ALL selected items)
      if (filters.doesNotRequire.length > 0) {
        for (const req of filters.doesNotRequire) {
          const field = requirementFieldMap[req];
          if (field && school[field]) return false;
        }
      }

      // Specialty Accepted filters
      if (filters.acceptsNicu && !school.acceptsNicu) return false;
      if (filters.acceptsPicu && !school.acceptsPicu) return false;
      if (filters.acceptsEr && !school.acceptsEr) return false;
      if (filters.acceptsOtherCriticalCare && !school.acceptsOtherCriticalCare) return false;

      // Program type filter (OR logic when multiple selected)
      const typeFiltersActive = filters.typeFrontLoaded || filters.typeIntegrated;
      if (typeFiltersActive) {
        const matchesFrontLoaded = filters.typeFrontLoaded && school.programType === 'front_loaded';
        const matchesIntegrated = filters.typeIntegrated && school.programType === 'integrated';
        if (!matchesFrontLoaded && !matchesIntegrated) return false;
      }

      // GPA Type filters (AND logic - school must use ALL selected GPA types)
      if (filters.gpaScience && !school.gpaScience) return false;
      if (filters.gpaNursing && !school.gpaNursing) return false;
      if (filters.gpaCumulative && !school.gpaCumulative) return false;
      if (filters.gpaGraduate && !school.gpaGraduate) return false;
      if (filters.gpaLast60 && !school.gpaLast60) return false;

      // Other section filters
      if (filters.ableToWork && !school.ableToWork) return false;
      if (filters.nursingCas && !school.nursingCas) return false;
      if (filters.rollingAdmissions && !school.rollingAdmissions) return false;
      if (filters.partiallyOnline && !school.partiallyOnline) return false;
      if (filters.acceptsBachelorsScienceRelated && !school.acceptsBachelorsScienceRelated) return false;

      return true;
    });
  }, [schoolsWithFitScore, filters]);

  // Apply view mode filter
  const viewFilteredSchools = useMemo(() => {
    if (viewMode === 'recommended') {
      // Only show schools with 60%+ fit score
      return filteredSchools.filter(s => s.fitScore.score >= 60);
    }
    return filteredSchools;
  }, [filteredSchools, viewMode]);

  // Apply sorting
  const sortedSchools = useMemo(() => {
    const sorted = [...viewFilteredSchools].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'fitScore':
          comparison = a.fitScore.score - b.fitScore.score;
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'deadline':
          const dateA = new Date(a.applicationDeadline || '9999-12-31');
          const dateB = new Date(b.applicationDeadline || '9999-12-31');
          comparison = dateA - dateB;
          break;
        case 'tuition':
          const tuitionA = a.tuitionInState || a.tuitionOutOfState || 0;
          const tuitionB = b.tuitionInState || b.tuitionOutOfState || 0;
          comparison = tuitionA - tuitionB;
          break;
        default:
          comparison = 0;
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return sorted;
  }, [viewFilteredSchools, sortBy, sortOrder]);

  // Get saved schools
  const savedSchools = useMemo(() => {
    return schoolsWithFitScore.filter(s => savedSchoolIds.includes(s.id));
  }, [schoolsWithFitScore, savedSchoolIds]);

  // Get target schools
  const targetSchools = useMemo(() => {
    return schoolsWithFitScore.filter(s => targetSchoolIds.includes(s.id));
  }, [schoolsWithFitScore, targetSchoolIds]);

  // Get comparison schools
  const comparisonSchools = useMemo(() => {
    return schoolsWithFitScore.filter(s => comparisonIds.includes(s.id));
  }, [schoolsWithFitScore, comparisonIds]);

  // Helper to ensure array in callbacks (handles corrupted localStorage)
  const ensureArray = (val) => (Array.isArray(val) ? val : []);

  // Actions - support both authenticated (Supabase) and unauthenticated (localStorage) users
  const saveSchool = useCallback(async (schoolId) => {
    if (user && isSupabaseConfigured()) {
      // Authenticated: Save to Supabase
      try {
        const { error: insertError } = await supabase
          .from('user_saved_schools')
          .upsert({
            user_id: user.id,
            school_id: schoolId,
            is_target: false,
            status: 'researching',
          }, { onConflict: 'user_id,school_id' });

        if (insertError) throw insertError;
      } catch (err) {
        console.error('Error saving school to Supabase:', err);
      }
    }
    // Always update localStorage for consistency (also triggers sync event)
    setSavedSchoolIds(prev => {
      const arr = ensureArray(prev);
      if (arr.includes(schoolId)) return arr;
      return [...arr, schoolId];
    });
  }, [user]);

  const unsaveSchool = useCallback(async (schoolId) => {
    if (user && isSupabaseConfigured()) {
      // Authenticated: Delete from Supabase
      try {
        const { error: deleteError } = await supabase
          .from('user_saved_schools')
          .delete()
          .eq('user_id', user.id)
          .eq('school_id', schoolId);

        if (deleteError) throw deleteError;
      } catch (err) {
        console.error('Error removing school from Supabase:', err);
      }
    }
    // Always update localStorage
    setSavedSchoolIds(prev => ensureArray(prev).filter(id => id !== schoolId));
    // Also remove from targets if it was a target
    setTargetSchoolIds(prev => ensureArray(prev).filter(id => id !== schoolId));
  }, [user]);

  const toggleSaveSchool = useCallback((schoolId) => {
    if (savedSchoolIds.includes(schoolId)) {
      unsaveSchool(schoolId);
    } else {
      saveSchool(schoolId);
    }
  }, [savedSchoolIds, saveSchool, unsaveSchool]);

  const makeTarget = useCallback(async (schoolId) => {
    if (user && isSupabaseConfigured()) {
      // Authenticated: Update or insert as target in Supabase
      try {
        const { error: upsertError } = await supabase
          .from('user_saved_schools')
          .upsert({
            user_id: user.id,
            school_id: schoolId,
            is_target: true,
            status: 'researching',
          }, { onConflict: 'user_id,school_id' });

        if (upsertError) throw upsertError;
      } catch (err) {
        console.error('Error making target in Supabase:', err);
      }
    }
    // First ensure it's saved in localStorage
    saveSchool(schoolId);
    setTargetSchoolIds(prev => {
      const arr = ensureArray(prev);
      if (arr.includes(schoolId)) return arr;
      return [...arr, schoolId];
    });
  }, [user, saveSchool]);

  const removeTarget = useCallback(async (schoolId) => {
    if (user && isSupabaseConfigured()) {
      // Authenticated: Update is_target to false in Supabase
      try {
        const { error: updateError } = await supabase
          .from('user_saved_schools')
          .update({ is_target: false })
          .eq('user_id', user.id)
          .eq('school_id', schoolId);

        if (updateError) throw updateError;
      } catch (err) {
        console.error('Error removing target in Supabase:', err);
      }
    }
    setTargetSchoolIds(prev => ensureArray(prev).filter(id => id !== schoolId));
  }, [user]);

  const toggleTarget = useCallback((schoolId) => {
    if (targetSchoolIds.includes(schoolId)) {
      removeTarget(schoolId);
    } else {
      makeTarget(schoolId);
    }
  }, [targetSchoolIds, makeTarget, removeTarget]);

  const addToComparison = useCallback((schoolId) => {
    setComparisonIds(prev => {
      if (prev.includes(schoolId)) return prev;
      if (prev.length >= 3) return prev; // Max 3 schools
      return [...prev, schoolId];
    });
  }, []);

  const removeFromComparison = useCallback((schoolId) => {
    setComparisonIds(prev => prev.filter(id => id !== schoolId));
  }, []);

  const clearComparison = useCallback(() => {
    setComparisonIds([]);
  }, []);

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      states: [],
      tuitionMin: 0,
      tuitionMax: 300000,
      greNotRequired: false,
      greRequired: false,
      greWaived: false,
      requires: [],
      doesNotRequire: [],
      acceptsNicu: false,
      acceptsPicu: false,
      acceptsEr: false,
      acceptsOtherCriticalCare: false,
      typeFrontLoaded: false,
      typeIntegrated: false,
      gpaCalculationsComplete: false,
      ableToWork: false,
      nursingCas: false,
      rollingAdmissions: false,
      partiallyOnline: false,
      acceptsBachelorsScienceRelated: false,
    });
  }, []);

  const getSchoolById = useCallback((id) => {
    return schoolsWithFitScore.find(s => s.id === id || s.id === Number(id));
  }, [schoolsWithFitScore]);

  return {
    // Data
    schools: sortedSchools,
    allSchools: schoolsWithFitScore,
    savedSchools,
    targetSchools,
    comparisonSchools,
    totalCount: schools.length,
    filteredCount: sortedSchools.length,
    recommendedCount: filteredSchools.filter(s => s.fitScore.score >= 60).length,

    // Loading state
    loading,
    error,

    // Filter state
    filters,
    updateFilter,
    clearFilters,
    allStates,

    // Sort state
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,

    // View mode
    viewMode,
    setViewMode,

    // Actions
    saveSchool,
    unsaveSchool,
    toggleSaveSchool,
    makeTarget,
    removeTarget,
    toggleTarget,
    addToComparison,
    removeFromComparison,
    clearComparison,
    getSchoolById,

    // User profile
    userProfile,
  };
}

export default useSchools;
