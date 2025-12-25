/**
 * usePrograms Hook
 *
 * Manages saved and target programs with CRUD operations.
 * Uses real school data from Supabase schools table.
 *
 * User-specific data (saved/target status, checklists, LORs, documents):
 * - Authenticated users: Supabase tables (user_saved_schools, target_program_checklists, etc.)
 * - Unauthenticated users: localStorage fallback for testing/demos
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { schools } from '@/data/supabase/schools';
import { usePersistentState } from './usePersistentState';
import { useAuth } from './useAuth';
import {
  DEFAULT_CHECKLIST_ITEMS,
  DEFAULT_TASK_TEMPLATES,
  GLOBAL_TASK_CATEGORIES,
  CHECKLIST_TASK_MAPPING,
  TASK_CHECKLIST_SYNC_MAP,
} from '@/data/taskConfig';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// LocalStorage keys for user-specific program data
// crna_saved_schools and crna_target_schools sync with useSchools (simple ID arrays)
// crna_target_schools_data stores extended target info (checklist, progress, etc.)
// crna_school_notes stores notes for ANY school (saved, target, or neither)
// crna_global_tasks stores tasks that are global (GRE, CCRN - only done once)
// crna_dashboard_tasks stores tasks for users without target programs
const SAVED_SCHOOLS_KEY = 'crna_saved_schools';        // Array of school IDs (syncs with useSchools)
const TARGET_SCHOOLS_KEY = 'crna_target_schools';      // Array of school IDs (syncs with useSchools)
const TARGET_DATA_KEY = 'crna_target_schools_data';    // Object with detailed target data
const SCHOOL_NOTES_KEY = 'crna_school_notes';          // Object: { schoolId: "notes text" }
const GLOBAL_TASKS_KEY = 'crna_global_tasks';          // Array of global task objects
const DASHBOARD_TASKS_KEY = 'crna_dashboard_tasks';    // Array of dashboard suggested tasks (for users without targets)
const DISMISSED_SUGGESTIONS_KEY = 'crna_dismissed_suggestions'; // Array of dismissed suggestion IDs

/**
 * Transform a school from the database into the program format used by the app
 */
function schoolToProgram(school) {
  return {
    id: `school_${school.id}`,
    name: school.name,
    schoolName: school.name,
    location: { city: school.city, state: school.state },
    imageUrl: school.imageUrl,
    websiteUrl: school.websiteUrl,
    type: school.programType,
    degree: school.degree,
    applicationDeadline: school.applicationDeadline,
    minimumGpa: school.minimumGpa,
    requirements: {
      minimumGpa: school.minimumGpa,
      gpaTypes: [
        school.gpaScience && 'Science GPA Required',
        school.gpaNursing && 'Nursing GPA Required',
        school.gpaCumulative && 'Cumulative/Overall GPA Required',
        school.gpaGraduate && 'Graduate GPA Required',
        school.gpaLast60 && 'Last 60 Credits GPA Required',
      ].filter(Boolean),
      ccrn: school.ccrnRequired ? 'required' : 'not_required',
      shadowingRequired: school.shadowingRequired,
      shadowingHours: school.shadowingRequired ? 16 : null, // Default hours if required
      personalStatement: !!school.essayPrompt,
      resumeRequired: true, // Most programs require this
      gre: school.greRequired ? 'required' : (school.greWaivedFor ? 'waived_for' : 'not_required'),
      greWaivedFor: school.greWaivedFor,
      prerequisites: [
        school.prereqStatistics && 'Statistics',
        school.prereqGenChemistry && 'General Chemistry',
        school.prereqOrganicChemistry && 'Organic Chemistry',
        school.prereqBiochemistry && 'Biochemistry',
        school.prereqAnatomy && 'Anatomy',
        school.prereqPhysics && 'Physics',
        school.prereqPharmacology && 'Pharmacology',
        school.prereqPhysiology && 'Physiology',
        school.prereqMicrobiology && 'Microbiology',
        school.prereqResearch && 'Research',
      ].filter(Boolean),
    },
    // Include raw school data for additional fields
    _schoolData: school,
  };
}

/**
 * Generate tasks based on application deadline
 * @param {string} programId - Program ID
 * @param {string} schoolName - School name
 * @param {string} deadline - Application deadline
 * @param {Object} school - School data (for requirement checking)
 * @returns {Array} - Array of task objects
 */
function generateTasksForProgram(programId, schoolName, deadline, school = null) {
  if (!deadline) return [];

  return DEFAULT_TASK_TEMPLATES.map((template, index) => {
    const deadlineDate = new Date(deadline);
    const dueDate = new Date(deadlineDate);
    dueDate.setDate(deadlineDate.getDate() - (template.weeksBeforeDeadline * 7));

    // Check if this task category is required by the school
    const isGlobal = template.isGlobal || GLOBAL_TASK_CATEGORIES.includes(template.category);
    const triggersChecklistSync = template.triggersChecklistSync || false;

    return {
      id: `task_${programId}_${index}`,
      task: template.task,
      programId,
      programName: schoolName,
      status: 'not_started',
      dueDate: dueDate.toISOString().split('T')[0],
      category: template.category,
      isOptional: template.isOptional,
      isGlobal,
      triggersChecklistSync,
    };
  });
}

/**
 * Check if a school requires GRE
 */
function schoolRequiresGre(school) {
  if (!school) return true; // Default to required if unknown
  return school.greRequired === true;
}

/**
 * Check if a school requires CCRN
 */
function schoolRequiresCcrn(school) {
  if (!school) return true; // Default to required if unknown
  return school.ccrnRequired === true;
}

/**
 * Generate checklist items with hidden status based on school requirements
 * @param {Object} school - School data
 * @returns {Array} - Array of checklist items with hidden flags
 */
function generateChecklistForSchool(school) {
  const greRequired = schoolRequiresGre(school);
  const ccrnRequired = schoolRequiresCcrn(school);

  return DEFAULT_CHECKLIST_ITEMS.map(item => {
    // Determine if item should be hidden based on school requirements
    let hidden = false;
    let hiddenReason = null;

    if (item.id === 'c5' || item.id === 'c6') {
      // GRE-related items
      if (!greRequired) {
        hidden = true;
        hiddenReason = 'school_not_required';
      }
    } else if (item.id === 'c7') {
      // CCRN-related item
      if (!ccrnRequired) {
        hidden = true;
        hiddenReason = 'school_not_required';
      }
    }

    return {
      ...item,
      hidden,
      hiddenReason,
    };
  });
}

export function usePrograms() {
  // Use centralized auth context instead of creating another subscription
  const { user, isLoading: authLoading } = useAuth();

  // Persisted user-specific data (localStorage fallback for unauthenticated users)
  const [savedSchoolIdsRaw, setSavedSchoolIdsLocal] = usePersistentState(SAVED_SCHOOLS_KEY, []);
  const [targetSchoolIdsRaw, setTargetSchoolIdsLocal] = usePersistentState(TARGET_SCHOOLS_KEY, []);
  const [targetDetailedDataLocal, setTargetDetailedDataLocal] = usePersistentState(TARGET_DATA_KEY, {});
  const [schoolNotesLocal, setSchoolNotesLocal] = usePersistentState(SCHOOL_NOTES_KEY, {});
  const [globalTasksLocal, setGlobalTasksLocal] = usePersistentState(GLOBAL_TASKS_KEY, []);
  const [dashboardTasksLocal, setDashboardTasksLocal] = usePersistentState(DASHBOARD_TASKS_KEY, []);
  const [dismissedSuggestionsLocal, setDismissedSuggestionsLocal] = usePersistentState(DISMISSED_SUGGESTIONS_KEY, []);

  // Supabase data state (for authenticated users)
  const [supabaseSavedSchools, setSupabaseSavedSchools] = useState([]);
  const [supabaseTargetData, setSupabaseTargetData] = useState({});

  // Ensure we always have arrays, even if localStorage has corrupted/different data format
  const savedSchoolIdsLocal = Array.isArray(savedSchoolIdsRaw) ? savedSchoolIdsRaw : [];
  const targetSchoolIdsLocal = Array.isArray(targetSchoolIdsRaw) ? targetSchoolIdsRaw : [];

  // Use Supabase data when authenticated, localStorage otherwise
  // Memoize to prevent new array references on every render
  const savedSchoolIds = useMemo(() => {
    return user ? supabaseSavedSchools.filter(s => !s.is_target).map(s => s.school_id) : savedSchoolIdsLocal;
  }, [user, supabaseSavedSchools, savedSchoolIdsLocal]);

  const targetSchoolIds = useMemo(() => {
    return user ? supabaseSavedSchools.filter(s => s.is_target).map(s => s.school_id) : targetSchoolIdsLocal;
  }, [user, supabaseSavedSchools, targetSchoolIdsLocal]);

  const targetDetailedData = user ? supabaseTargetData : targetDetailedDataLocal;

  // State setters that work for both modes - memoize to prevent new function references
  const noopSetter = useCallback(() => {}, []);
  const setSavedSchoolIds = user ? noopSetter : setSavedSchoolIdsLocal;
  const setTargetSchoolIds = user ? noopSetter : setTargetSchoolIdsLocal;
  const setTargetDetailedData = user ? setSupabaseTargetData : setTargetDetailedDataLocal;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch saved schools from Supabase when authenticated
  useEffect(() => {
    async function fetchSavedSchools() {
      if (!user || !isSupabaseConfigured()) return;

      try {
        // Fetch saved schools with their checklists
        const { data: savedSchools, error: savedError } = await supabase
          .from('user_saved_schools')
          .select(`
            *,
            checklists:target_program_checklists(*),
            lors:target_program_lors(*),
            documents:target_program_documents(*)
          `)
          .eq('user_id', user.id);

        if (savedError) throw savedError;

        setSupabaseSavedSchools(savedSchools || []);

        // Build target detailed data from Supabase records
        const targetData = {};
        (savedSchools || []).filter(s => s.is_target).forEach(saved => {
          targetData[saved.school_id] = {
            status: saved.status || 'not_started',
            notes: saved.notes || '',
            progress: saved.progress || 0,
            verifiedRequirements: false,
            checklist: (saved.checklists || []).length > 0
              ? saved.checklists.map(c => ({
                  id: c.id,
                  label: c.label,
                  completed: c.completed,
                  isDefault: c.is_default,
                }))
              : DEFAULT_CHECKLIST_ITEMS.map(item => ({ ...item })),
            lor: (saved.lors || []).map(l => ({
              id: l.id,
              personName: l.person_name,
              relationship: l.relationship,
              email: l.email,
              status: l.status,
              requestedDate: l.requested_date,
              receivedDate: l.received_date,
              notes: l.notes,
            })),
            documents: (saved.documents || []).map(d => ({
              id: d.id,
              name: d.name,
              documentType: d.document_type,
              fileUrl: d.file_url,
              uploadedAt: d.uploaded_at,
            })),
            savedAt: saved.saved_at,
          };
        });
        setSupabaseTargetData(targetData);
      } catch (err) {
        console.error('Error fetching saved schools:', err);
        setError(err.message);
      }
    }

    fetchSavedSchools();
  }, [user]);

  // Build a map of school ID to school data for quick lookup
  const schoolMap = useMemo(() => {
    const map = {};
    schools.forEach(school => {
      map[school.id] = school;
    });
    return map;
  }, []);

  // Build target programs from user data + real school data
  const targetPrograms = useMemo(() => {
    return targetSchoolIds.map(schoolId => {
      const school = schoolMap[Number(schoolId)];
      if (!school) return null;

      const detailedData = targetDetailedData[schoolId] || {};
      const program = schoolToProgram(school);
      return {
        id: `saved_${schoolId}`,
        programId: `school_${schoolId}`,
        program,
        isTarget: true,
        savedAt: detailedData.savedAt || new Date().toISOString(),
        targetData: {
          status: detailedData.status || 'not_started',
          submittedDate: detailedData.submittedDate || null,
          notes: detailedData.notes || '',
          progress: detailedData.progress || 0,
          verifiedRequirements: detailedData.verifiedRequirements || false,
          checklist: detailedData.checklist || DEFAULT_CHECKLIST_ITEMS.map(item => ({ ...item })),
          lor: detailedData.lor || [],
          documents: detailedData.documents || [],
        },
      };
    }).filter(Boolean);
  }, [targetSchoolIds, targetDetailedData, schoolMap]);

  // Build saved (non-target) programs
  const savedPrograms = useMemo(() => {
    return savedSchoolIds
      .filter(schoolId => !targetSchoolIds.includes(schoolId)) // Exclude targets
      .map(schoolId => {
        const school = schoolMap[Number(schoolId)];
        if (!school) return null;

        const program = schoolToProgram(school);
        return {
          id: `saved_${schoolId}`,
          programId: `school_${schoolId}`,
          program,
          isTarget: false,
          savedAt: new Date().toISOString(),
        };
      }).filter(Boolean);
  }, [savedSchoolIds, targetSchoolIds, schoolMap]);

  // Generate tasks from target programs
  const tasks = useMemo(() => {
    return targetPrograms.flatMap(tp => {
      const school = tp.program._schoolData;
      return generateTasksForProgram(tp.programId, school.name, school.applicationDeadline);
    });
  }, [targetPrograms]);

  // Milestones (static for now)
  const milestones = useMemo(() => [
    { id: 'm1', label: 'Profile Complete', completed: false },
    { id: 'm2', label: 'First Target Program', completed: targetPrograms.length > 0 },
    { id: 'm3', label: 'GRE Scheduled', completed: false },
    { id: 'm4', label: 'First Application Submitted', completed: targetPrograms.some(tp => tp.targetData.status === 'submitted') },
  ], [targetPrograms]);

  // Initialize loading state
  useEffect(() => {
    // Simulate brief loading for consistency with API pattern
    const timer = setTimeout(() => setLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  // Get a specific target program by programId
  const getTargetProgram = useCallback((programId) => {
    return targetPrograms.find(p => p.programId === programId) || null;
  }, [targetPrograms]);

  // Get tasks for a specific program
  const getTasksForProgram = useCallback((programId) => {
    return tasks.filter(t => t.programId === programId);
  }, [tasks]);

  // Extract school ID from programId (e.g., "school_3789" -> 3789)
  const getSchoolIdFromProgramId = (programId) => {
    if (typeof programId === 'string' && programId.startsWith('school_')) {
      return Number(programId.replace('school_', ''));
    }
    return Number(programId);
  };

  // Helper to ensure array in callbacks (handles corrupted localStorage)
  const ensureArray = (val) => (Array.isArray(val) ? val : []);

  // Save a school (add to saved list)
  const saveSchool = useCallback(async (schoolId) => {
    const id = typeof schoolId === 'string' ? getSchoolIdFromProgramId(schoolId) : schoolId;

    if (user && isSupabaseConfigured()) {
      // Supabase: Insert into user_saved_schools
      try {
        const { data, error: insertError } = await supabase
          .from('user_saved_schools')
          .upsert({
            user_id: user.id,
            school_id: id,
            is_target: false,
            status: 'researching',
          }, { onConflict: 'user_id,school_id' })
          .select()
          .single();

        if (insertError) throw insertError;

        // Update local state
        setSupabaseSavedSchools(prev => {
          const existing = prev.find(s => s.school_id === id);
          if (existing) return prev;
          return [...prev, data];
        });
      } catch (err) {
        console.error('Error saving school:', err);
        setError(err.message);
      }
    } else {
      // localStorage fallback
      setSavedSchoolIdsLocal(prev => {
        const arr = ensureArray(prev);
        if (arr.includes(id)) return arr;
        return [...arr, id];
      });
    }
  }, [user, setSavedSchoolIdsLocal]);

  // Convert saved program to target
  const convertToTarget = useCallback(async (programId) => {
    const schoolId = getSchoolIdFromProgramId(programId);

    if (user && isSupabaseConfigured()) {
      // Supabase: Update or insert as target
      try {
        const { data, error: upsertError } = await supabase
          .from('user_saved_schools')
          .upsert({
            user_id: user.id,
            school_id: schoolId,
            is_target: true,
            status: 'researching',
          }, { onConflict: 'user_id,school_id' })
          .select()
          .single();

        if (upsertError) throw upsertError;

        // Create default checklist items for the target
        const checklistItems = DEFAULT_CHECKLIST_ITEMS.map((item, index) => ({
          saved_school_id: data.id,
          user_id: user.id,
          label: item.label,
          completed: false,
          is_default: true,
          sort_order: index,
        }));

        const { error: checklistError } = await supabase
          .from('target_program_checklists')
          .upsert(checklistItems, { onConflict: 'saved_school_id,label' });

        if (checklistError) console.warn('Checklist creation error:', checklistError);

        // Update local state
        setSupabaseSavedSchools(prev => {
          const filtered = prev.filter(s => s.school_id !== schoolId);
          return [...filtered, { ...data, checklists: [], lors: [], documents: [] }];
        });

        setSupabaseTargetData(prev => ({
          ...prev,
          [schoolId]: {
            status: 'researching',
            notes: '',
            progress: 0,
            verifiedRequirements: false,
            checklist: DEFAULT_CHECKLIST_ITEMS.map(item => ({ ...item })),
            lor: [],
            documents: [],
            savedAt: data.saved_at,
          }
        }));
      } catch (err) {
        console.error('Error converting to target:', err);
        setError(err.message);
      }
    } else {
      // localStorage fallback
      setSavedSchoolIdsLocal(prev => {
        const arr = ensureArray(prev);
        if (arr.includes(schoolId)) return arr;
        return [...arr, schoolId];
      });

      setTargetSchoolIdsLocal(prev => {
        const arr = ensureArray(prev);
        if (arr.includes(schoolId)) return arr;
        return [...arr, schoolId];
      });

      setTargetDetailedDataLocal(prev => ({
        ...(prev && typeof prev === 'object' ? prev : {}),
        [schoolId]: {
          status: 'not_started',
          notes: '',
          progress: 0,
          verifiedRequirements: false,
          checklist: DEFAULT_CHECKLIST_ITEMS.map(item => ({ ...item })),
          lor: [],
          documents: [],
          savedAt: new Date().toISOString(),
        }
      }));
    }
  }, [user, setSavedSchoolIdsLocal, setTargetSchoolIdsLocal, setTargetDetailedDataLocal]);

  // Remove program (from saved or target)
  const removeProgram = useCallback(async (programId, isTarget) => {
    const schoolId = getSchoolIdFromProgramId(programId);

    if (user && isSupabaseConfigured()) {
      // Supabase: Delete from user_saved_schools (cascades to checklists, lors, documents)
      try {
        const { error: deleteError } = await supabase
          .from('user_saved_schools')
          .delete()
          .eq('user_id', user.id)
          .eq('school_id', schoolId);

        if (deleteError) throw deleteError;

        // Update local state
        setSupabaseSavedSchools(prev => prev.filter(s => s.school_id !== schoolId));
        setSupabaseTargetData(prev => {
          const { [schoolId]: _, ...rest } = prev;
          return rest;
        });
      } catch (err) {
        console.error('Error removing program:', err);
        setError(err.message);
      }
    } else {
      // localStorage fallback
      if (isTarget) {
        setTargetSchoolIdsLocal(prev => ensureArray(prev).filter(id => id !== schoolId));
        setTargetDetailedDataLocal(prev => {
          const obj = prev && typeof prev === 'object' ? prev : {};
          const { [schoolId]: _, ...rest } = obj;
          return rest;
        });
      } else {
        setSavedSchoolIdsLocal(prev => ensureArray(prev).filter(id => id !== schoolId));
      }
    }
  }, [user, setSavedSchoolIdsLocal, setTargetSchoolIdsLocal, setTargetDetailedDataLocal]);

  // Revert target program back to saved (loses progress data)
  const revertToSaved = useCallback(async (programId) => {
    const schoolId = getSchoolIdFromProgramId(programId);

    if (user && isSupabaseConfigured()) {
      // Supabase: Update is_target to false and delete related checklist/lor/documents
      try {
        // First get the saved_school record
        const savedSchool = supabaseSavedSchools.find(s => s.school_id === schoolId);
        if (!savedSchool) return;

        // Delete checklists, lors, documents for this target
        await Promise.all([
          supabase.from('target_program_checklists').delete().eq('saved_school_id', savedSchool.id),
          supabase.from('target_program_lors').delete().eq('saved_school_id', savedSchool.id),
          supabase.from('target_program_documents').delete().eq('saved_school_id', savedSchool.id),
        ]);

        // Update to non-target
        const { data, error: updateError } = await supabase
          .from('user_saved_schools')
          .update({ is_target: false, status: 'researching', progress: 0, notes: '' })
          .eq('id', savedSchool.id)
          .select()
          .single();

        if (updateError) throw updateError;

        // Update local state
        setSupabaseSavedSchools(prev =>
          prev.map(s => s.school_id === schoolId ? { ...data, checklists: [], lors: [], documents: [] } : s)
        );
        setSupabaseTargetData(prev => {
          const { [schoolId]: _, ...rest } = prev;
          return rest;
        });
      } catch (err) {
        console.error('Error reverting to saved:', err);
        setError(err.message);
      }
    } else {
      // localStorage fallback
      setTargetSchoolIdsLocal(prev => ensureArray(prev).filter(id => id !== schoolId));
      setTargetDetailedDataLocal(prev => {
        const obj = prev && typeof prev === 'object' ? prev : {};
        const { [schoolId]: _, ...rest } = obj;
        return rest;
      });
      setSavedSchoolIdsLocal(prev => {
        const arr = ensureArray(prev);
        if (arr.includes(schoolId)) return arr;
        return [...arr, schoolId];
      });
    }
  }, [user, supabaseSavedSchools, setSavedSchoolIdsLocal, setTargetSchoolIdsLocal, setTargetDetailedDataLocal]);

  // Update target program data
  const updateTargetData = useCallback(async (programId, updates) => {
    const schoolId = getSchoolIdFromProgramId(programId);

    if (user && isSupabaseConfigured()) {
      // Supabase: Update user_saved_schools record
      try {
        const savedSchool = supabaseSavedSchools.find(s => s.school_id === schoolId);
        if (!savedSchool) return;

        // Map updates to snake_case for Supabase
        const supabaseUpdates = {};
        if (updates.status !== undefined) supabaseUpdates.status = updates.status;
        if (updates.notes !== undefined) supabaseUpdates.notes = updates.notes;
        if (updates.progress !== undefined) supabaseUpdates.progress = updates.progress;

        if (Object.keys(supabaseUpdates).length > 0) {
          const { error: updateError } = await supabase
            .from('user_saved_schools')
            .update(supabaseUpdates)
            .eq('id', savedSchool.id);

          if (updateError) throw updateError;
        }

        // Update local state
        setSupabaseTargetData(prev => {
          const existing = prev[schoolId] || {};
          return {
            ...prev,
            [schoolId]: {
              ...existing,
              ...updates,
            }
          };
        });
      } catch (err) {
        console.error('Error updating target data:', err);
        setError(err.message);
      }
    } else {
      // localStorage fallback
      setTargetDetailedDataLocal(prev => {
        const existing = prev[schoolId] || {};
        return {
          ...prev,
          [schoolId]: {
            ...existing,
            ...updates,
          }
        };
      });
    }
  }, [user, supabaseSavedSchools, setTargetDetailedDataLocal]);

  // Toggle checklist item
  const toggleChecklistItem = useCallback(async (programId, checklistItemId) => {
    const schoolId = getSchoolIdFromProgramId(programId);

    if (user && isSupabaseConfigured()) {
      // Supabase: Toggle checklist item
      try {
        const existing = supabaseTargetData[schoolId] || {};
        const checklist = existing.checklist || [];
        const item = checklist.find(c => c.id === checklistItemId);
        if (!item) return;

        const newCompleted = !item.completed;

        // Update in Supabase
        const { error: updateError } = await supabase
          .from('target_program_checklists')
          .update({
            completed: newCompleted,
            completed_at: newCompleted ? new Date().toISOString() : null,
          })
          .eq('id', checklistItemId);

        if (updateError) throw updateError;

        // Update local state
        const updatedChecklist = checklist.map(c =>
          c.id === checklistItemId ? { ...c, completed: newCompleted } : c
        );
        const completedCount = updatedChecklist.filter(c => c.completed).length;
        const progress = Math.round((completedCount / updatedChecklist.length) * 100);

        // Also update progress in user_saved_schools
        const savedSchool = supabaseSavedSchools.find(s => s.school_id === schoolId);
        if (savedSchool) {
          await supabase
            .from('user_saved_schools')
            .update({ progress })
            .eq('id', savedSchool.id);
        }

        setSupabaseTargetData(prev => ({
          ...prev,
          [schoolId]: {
            ...existing,
            checklist: updatedChecklist,
            progress,
          }
        }));
      } catch (err) {
        console.error('Error toggling checklist item:', err);
        setError(err.message);
      }
    } else {
      // localStorage fallback
      setTargetDetailedDataLocal(prev => {
        const existing = prev[schoolId] || {};
        const checklist = existing.checklist || DEFAULT_CHECKLIST_ITEMS.map(item => ({ ...item }));

        const updatedChecklist = checklist.map(item =>
          item.id === checklistItemId
            ? { ...item, completed: !item.completed }
            : item
        );

        const completedCount = updatedChecklist.filter(item => item.completed).length;
        const progress = Math.round((completedCount / updatedChecklist.length) * 100);

        return {
          ...prev,
          [schoolId]: {
            ...existing,
            checklist: updatedChecklist,
            progress,
          }
        };
      });
    }
  }, [user, supabaseTargetData, supabaseSavedSchools, setTargetDetailedDataLocal]);

  // Get active tasks
  const activeTasks = useMemo(() => tasks.filter(task => task.status !== 'completed'), [tasks]);

  // Get completed milestones count
  const completedMilestonesCount = useMemo(() => milestones.filter(m => m.completed).length, [milestones]);

  // Add a custom checklist item (max 3 custom items allowed)
  const addChecklistItem = useCallback(async (programId, label) => {
    const schoolId = getSchoolIdFromProgramId(programId);

    if (user && isSupabaseConfigured()) {
      // Supabase: Insert new checklist item
      try {
        const savedSchool = supabaseSavedSchools.find(s => s.school_id === schoolId);
        if (!savedSchool) return;

        const existing = supabaseTargetData[schoolId] || {};
        const checklist = existing.checklist || [];
        const customItemCount = checklist.filter(item => !item.isDefault).length;
        if (customItemCount >= 3) {
          console.warn('Maximum of 3 custom checklist items allowed');
          return;
        }

        const { data, error: insertError } = await supabase
          .from('target_program_checklists')
          .insert({
            saved_school_id: savedSchool.id,
            user_id: user.id,
            label,
            completed: false,
            is_default: false,
            sort_order: checklist.length,
          })
          .select()
          .single();

        if (insertError) throw insertError;

        const newItem = {
          id: data.id,
          label: data.label,
          completed: false,
          isDefault: false,
        };

        const updatedChecklist = [...checklist, newItem];
        const completedCount = updatedChecklist.filter(item => item.completed).length;
        const progress = Math.round((completedCount / updatedChecklist.length) * 100);

        setSupabaseTargetData(prev => ({
          ...prev,
          [schoolId]: {
            ...existing,
            checklist: updatedChecklist,
            progress,
          }
        }));
      } catch (err) {
        console.error('Error adding checklist item:', err);
        setError(err.message);
      }
    } else {
      // localStorage fallback
      setTargetDetailedDataLocal(prev => {
        const existing = prev[schoolId] || {};
        const checklist = existing.checklist || DEFAULT_CHECKLIST_ITEMS.map(item => ({ ...item }));
        const customItemCount = checklist.filter(item => !item.isDefault).length;
        if (customItemCount >= 3) {
          console.warn('Maximum of 3 custom checklist items allowed');
          return prev;
        }

        const newItem = {
          id: `custom_${Date.now()}`,
          label,
          completed: false,
          isDefault: false,
          excludesTaxonomy: null
        };

        const updatedChecklist = [...checklist, newItem];
        const completedCount = updatedChecklist.filter(item => item.completed).length;
        const progress = Math.round((completedCount / updatedChecklist.length) * 100);

        return {
          ...prev,
          [schoolId]: {
            ...existing,
            checklist: updatedChecklist,
            progress,
          }
        };
      });
    }
  }, [user, supabaseSavedSchools, supabaseTargetData, setTargetDetailedDataLocal]);

  // Remove a custom checklist item (only custom items can be removed)
  const removeChecklistItem = useCallback(async (programId, checklistItemId) => {
    const schoolId = getSchoolIdFromProgramId(programId);

    if (user && isSupabaseConfigured()) {
      // Supabase: Delete checklist item
      try {
        const existing = supabaseTargetData[schoolId] || {};
        const checklist = existing.checklist || [];
        const itemToRemove = checklist.find(item => item.id === checklistItemId);
        if (itemToRemove?.isDefault) {
          console.warn('Default checklist items cannot be removed');
          return;
        }

        const { error: deleteError } = await supabase
          .from('target_program_checklists')
          .delete()
          .eq('id', checklistItemId);

        if (deleteError) throw deleteError;

        const updatedChecklist = checklist.filter(item => item.id !== checklistItemId);
        const completedCount = updatedChecklist.filter(item => item.completed).length;
        const progress = updatedChecklist.length > 0 ? Math.round((completedCount / updatedChecklist.length) * 100) : 0;

        setSupabaseTargetData(prev => ({
          ...prev,
          [schoolId]: {
            ...existing,
            checklist: updatedChecklist,
            progress,
          }
        }));
      } catch (err) {
        console.error('Error removing checklist item:', err);
        setError(err.message);
      }
    } else {
      // localStorage fallback
      setTargetDetailedDataLocal(prev => {
        const existing = prev[schoolId] || {};
        const checklist = existing.checklist || [];
        const itemToRemove = checklist.find(item => item.id === checklistItemId);
        if (itemToRemove?.isDefault) {
          console.warn('Default checklist items cannot be removed');
          return prev;
        }

        const updatedChecklist = checklist.filter(item => item.id !== checklistItemId);
        const completedCount = updatedChecklist.filter(item => item.completed).length;
        const progress = updatedChecklist.length > 0 ? Math.round((completedCount / updatedChecklist.length) * 100) : 0;

        return {
          ...prev,
          [schoolId]: {
            ...existing,
            checklist: updatedChecklist,
            progress,
          }
        };
      });
    }
  }, [user, supabaseTargetData, setTargetDetailedDataLocal]);

  // Update LOR data for a program
  const updateLor = useCallback(async (programId, lorData) => {
    const schoolId = getSchoolIdFromProgramId(programId);

    if (user && isSupabaseConfigured()) {
      // Supabase: Full replace of LOR data
      try {
        const savedSchool = supabaseSavedSchools.find(s => s.school_id === schoolId);
        if (!savedSchool) return;

        // Delete existing LORs
        await supabase
          .from('target_program_lors')
          .delete()
          .eq('saved_school_id', savedSchool.id);

        // Insert new LORs
        if (lorData.length > 0) {
          const lorRecords = lorData.map(lor => ({
            saved_school_id: savedSchool.id,
            user_id: user.id,
            person_name: lor.personName,
            relationship: lor.relationship,
            email: lor.email,
            status: lor.status,
            requested_date: lor.requestedDate,
            received_date: lor.receivedDate,
            notes: lor.notes,
          }));

          await supabase.from('target_program_lors').insert(lorRecords);
        }

        // Update local state
        setSupabaseTargetData(prev => ({
          ...prev,
          [schoolId]: {
            ...(prev[schoolId] || {}),
            lor: lorData,
          }
        }));
      } catch (err) {
        console.error('Error updating LOR:', err);
        setError(err.message);
      }
    } else {
      // localStorage fallback
      setTargetDetailedDataLocal(prev => ({
        ...prev,
        [schoolId]: {
          ...(prev[schoolId] || {}),
          lor: lorData,
        }
      }));
    }
  }, [user, supabaseSavedSchools, setTargetDetailedDataLocal]);

  // Update documents for a program
  const updateDocuments = useCallback(async (programId, documents) => {
    const schoolId = getSchoolIdFromProgramId(programId);

    if (user && isSupabaseConfigured()) {
      // Supabase: Full replace of documents
      try {
        const savedSchool = supabaseSavedSchools.find(s => s.school_id === schoolId);
        if (!savedSchool) return;

        // Delete existing documents
        await supabase
          .from('target_program_documents')
          .delete()
          .eq('saved_school_id', savedSchool.id);

        // Insert new documents
        if (documents.length > 0) {
          const docRecords = documents.map(doc => ({
            saved_school_id: savedSchool.id,
            user_id: user.id,
            name: doc.name,
            document_type: doc.documentType,
            file_url: doc.fileUrl,
          }));

          await supabase.from('target_program_documents').insert(docRecords);
        }

        // Update local state
        setSupabaseTargetData(prev => ({
          ...prev,
          [schoolId]: {
            ...(prev[schoolId] || {}),
            documents,
          }
        }));
      } catch (err) {
        console.error('Error updating documents:', err);
        setError(err.message);
      }
    } else {
      // localStorage fallback
      setTargetDetailedDataLocal(prev => ({
        ...prev,
        [schoolId]: {
          ...(prev[schoolId] || {}),
          documents,
        }
      }));
    }
  }, [user, supabaseSavedSchools, setTargetDetailedDataLocal]);

  // Get school by ID (for direct lookup)
  const getSchoolById = useCallback((schoolId) => {
    const id = typeof schoolId === 'string' ? getSchoolIdFromProgramId(schoolId) : schoolId;
    return schoolMap[id] || null;
  }, [schoolMap]);

  // Get notes for any school (not limited to saved/target)
  const getSchoolNotes = useCallback((schoolId) => {
    const id = typeof schoolId === 'string' ? getSchoolIdFromProgramId(schoolId) : schoolId;

    if (user && isSupabaseConfigured()) {
      // For Supabase, notes might be stored in user_school_notes table (to be added)
      // For now, fall back to local storage
      return schoolNotesLocal[id] || '';
    }
    return schoolNotesLocal[id] || '';
  }, [user, schoolNotesLocal]);

  // Update notes for any school (not limited to saved/target)
  const updateSchoolNotes = useCallback(async (schoolId, notes) => {
    const id = typeof schoolId === 'string' ? getSchoolIdFromProgramId(schoolId) : schoolId;

    if (user && isSupabaseConfigured()) {
      // TODO: Save to Supabase user_school_notes table when implemented
      // For now, use localStorage
      setSchoolNotesLocal(prev => ({
        ...prev,
        [id]: notes,
      }));
    } else {
      // localStorage fallback
      setSchoolNotesLocal(prev => ({
        ...prev,
        [id]: notes,
      }));
    }
  }, [user, setSchoolNotesLocal]);

  // Get program data for a school (combines school data with user target/saved state)
  const getProgramForSchool = useCallback((schoolId) => {
    const id = typeof schoolId === 'string' ? getSchoolIdFromProgramId(schoolId) : schoolId;
    const school = schoolMap[id];
    if (!school) return null;

    const detailedData = targetDetailedData[id];
    const isTarget = targetSchoolIds.includes(id);
    const isSaved = savedSchoolIds.includes(id);

    return {
      school,
      program: schoolToProgram(school),
      isTarget,
      isSaved,
      targetData: detailedData || null,
    };
  }, [schoolMap, targetDetailedData, targetSchoolIds, savedSchoolIds]);

  // ============================================
  // GLOBAL TASK MANAGEMENT
  // ============================================

  // Get earliest deadline for a task category (GRE/CCRN)
  const getEarliestDeadlineForCategory = useCallback((category) => {
    const relevantPrograms = targetPrograms.filter(tp => {
      const school = tp.program._schoolData;
      if (category === 'gre' && !schoolRequiresGre(school)) return false;
      if ((category === 'ccrn' || category === 'ccrn-prep') && !schoolRequiresCcrn(school)) return false;
      return school.applicationDeadline;
    });

    if (relevantPrograms.length === 0) return null;

    // Sort by deadline and return earliest
    const sorted = relevantPrograms.sort((a, b) => {
      const dateA = new Date(a.program._schoolData.applicationDeadline);
      const dateB = new Date(b.program._schoolData.applicationDeadline);
      return dateA - dateB;
    });

    return {
      deadline: sorted[0].program._schoolData.applicationDeadline,
      schoolName: sorted[0].program._schoolData.name,
      programId: sorted[0].programId,
    };
  }, [targetPrograms]);

  // Add a global task (GRE/CCRN - only done once)
  const addGlobalTask = useCallback((taskTemplate) => {
    const taskId = `global_${taskTemplate.task.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}`;
    const deadline = getEarliestDeadlineForCategory(taskTemplate.category);

    const newTask = {
      id: taskId,
      task: taskTemplate.task,
      category: taskTemplate.category,
      status: 'not_started',
      dueDate: deadline ? calculateDueDate(deadline.deadline, taskTemplate.weeksBeforeDeadline || 0) : null,
      linkedSchoolName: deadline?.schoolName || null,
      linkedProgramId: deadline?.programId || null,
      isGlobal: true,
      triggersChecklistSync: taskTemplate.triggersChecklistSync || false,
      createdAt: new Date().toISOString(),
    };

    setGlobalTasksLocal(prev => [...(prev || []), newTask]);
    return newTask;
  }, [getEarliestDeadlineForCategory, setGlobalTasksLocal]);

  // Delete a global task
  const deleteGlobalTask = useCallback((taskId) => {
    setGlobalTasksLocal(prev => (prev || []).filter(t => t.id !== taskId));
  }, [setGlobalTasksLocal]);

  // Complete a global task (returns the task for sync dialog triggering)
  const completeGlobalTask = useCallback((taskId) => {
    let completedTask = null;
    setGlobalTasksLocal(prev => {
      return (prev || []).map(t => {
        if (t.id === taskId) {
          completedTask = { ...t, status: 'completed', completedAt: new Date().toISOString() };
          return completedTask;
        }
        return t;
      });
    });
    return completedTask;
  }, [setGlobalTasksLocal]);

  // Update global task status
  const updateGlobalTaskStatus = useCallback((taskId, status) => {
    setGlobalTasksLocal(prev => {
      return (prev || []).map(t => {
        if (t.id === taskId) {
          return {
            ...t,
            status,
            completedAt: status === 'completed' ? new Date().toISOString() : t.completedAt,
          };
        }
        return t;
      });
    });
  }, [setGlobalTasksLocal]);

  // ============================================
  // HIDDEN CHECKLIST ITEM MANAGEMENT
  // ============================================

  // Hide a checklist item on a specific program
  const hideChecklistItem = useCallback((programId, itemId, reason = 'user_hidden') => {
    const schoolId = getSchoolIdFromProgramId(programId);

    setTargetDetailedDataLocal(prev => {
      const existing = prev[schoolId] || {};
      const checklist = existing.checklist || DEFAULT_CHECKLIST_ITEMS.map(item => ({ ...item }));

      const updatedChecklist = checklist.map(item =>
        item.id === itemId ? { ...item, hidden: true, hiddenReason: reason } : item
      );

      // Recalculate progress (only visible items count)
      const visibleItems = updatedChecklist.filter(item => !item.hidden);
      const completedCount = visibleItems.filter(item => item.completed).length;
      const progress = visibleItems.length > 0 ? Math.round((completedCount / visibleItems.length) * 100) : 0;

      return {
        ...prev,
        [schoolId]: {
          ...existing,
          checklist: updatedChecklist,
          progress,
        }
      };
    });
  }, [setTargetDetailedDataLocal]);

  // Reveal a hidden checklist item
  const revealChecklistItem = useCallback((programId, itemId) => {
    const schoolId = getSchoolIdFromProgramId(programId);

    setTargetDetailedDataLocal(prev => {
      const existing = prev[schoolId] || {};
      const checklist = existing.checklist || DEFAULT_CHECKLIST_ITEMS.map(item => ({ ...item }));

      const updatedChecklist = checklist.map(item =>
        item.id === itemId ? { ...item, hidden: false, hiddenReason: null } : item
      );

      // Recalculate progress (only visible items count)
      const visibleItems = updatedChecklist.filter(item => !item.hidden);
      const completedCount = visibleItems.filter(item => item.completed).length;
      const progress = visibleItems.length > 0 ? Math.round((completedCount / visibleItems.length) * 100) : 0;

      return {
        ...prev,
        [schoolId]: {
          ...existing,
          checklist: updatedChecklist,
          progress,
        }
      };
    });
  }, [setTargetDetailedDataLocal]);

  // Get hidden items for a program
  const getHiddenItems = useCallback((programId) => {
    const schoolId = getSchoolIdFromProgramId(programId);
    const data = targetDetailedData[schoolId];
    if (!data?.checklist) return [];
    return data.checklist.filter(item => item.hidden);
  }, [targetDetailedData]);

  // ============================================
  // CHECKLIST SYNC (across all target programs)
  // ============================================

  // Sync checklist items across all target programs
  const syncChecklistItemsAcrossPrograms = useCallback((itemIds, completed = true) => {
    setTargetDetailedDataLocal(prev => {
      const updated = { ...prev };

      Object.keys(updated).forEach(schoolId => {
        const existing = updated[schoolId] || {};
        const checklist = existing.checklist || DEFAULT_CHECKLIST_ITEMS.map(item => ({ ...item }));

        const updatedChecklist = checklist.map(item => {
          if (itemIds.includes(item.id)) {
            return { ...item, completed };
          }
          return item;
        });

        // Recalculate progress (only visible items count)
        const visibleItems = updatedChecklist.filter(item => !item.hidden);
        const completedCount = visibleItems.filter(item => item.completed).length;
        const progress = visibleItems.length > 0 ? Math.round((completedCount / visibleItems.length) * 100) : 0;

        updated[schoolId] = {
          ...existing,
          checklist: updatedChecklist,
          progress,
        };
      });

      return updated;
    });
  }, [setTargetDetailedDataLocal]);

  // ============================================
  // DASHBOARD TASKS (for users without targets)
  // ============================================

  // Add a dashboard task (for users without target programs)
  const addDashboardTask = useCallback((task) => {
    const newTask = {
      id: `dashboard_${Date.now()}`,
      task: task.task,
      category: task.category,
      status: 'not_started',
      dueDate: null,
      link: task.link || null,
      createdAt: new Date().toISOString(),
    };

    setDashboardTasksLocal(prev => [...(prev || []), newTask]);
    return newTask;
  }, [setDashboardTasksLocal]);

  // Complete a dashboard task
  const completeDashboardTask = useCallback((taskId) => {
    setDashboardTasksLocal(prev => {
      return (prev || []).map(t => {
        if (t.id === taskId) {
          return { ...t, status: 'completed', completedAt: new Date().toISOString() };
        }
        return t;
      });
    });
  }, [setDashboardTasksLocal]);

  // Delete a dashboard task
  const deleteDashboardTask = useCallback((taskId) => {
    setDashboardTasksLocal(prev => (prev || []).filter(t => t.id !== taskId));
  }, [setDashboardTasksLocal]);

  // ============================================
  // DISMISSED SUGGESTIONS MANAGEMENT
  // ============================================

  // Dismiss a suggestion permanently
  const dismissSuggestion = useCallback((suggestionId) => {
    setDismissedSuggestionsLocal(prev => {
      const arr = prev || [];
      if (arr.includes(suggestionId)) return arr;
      return [...arr, suggestionId];
    });
  }, [setDismissedSuggestionsLocal]);

  // Helper to calculate due date
  function calculateDueDate(deadline, weeksBeforeDeadline) {
    if (!deadline) return null;
    const deadlineDate = new Date(deadline);
    const dueDate = new Date(deadlineDate);
    dueDate.setDate(deadlineDate.getDate() - (weeksBeforeDeadline * 7));
    return dueDate.toISOString().split('T')[0];
  }

  return {
    targetPrograms,
    savedPrograms,
    tasks,
    activeTasks,
    milestones,
    completedMilestonesCount,
    loading: loading || authLoading,
    error,

    // Methods
    getTargetProgram,
    getTasksForProgram,
    saveSchool,
    convertToTarget,
    revertToSaved,
    removeProgram,
    updateTargetData,
    toggleChecklistItem,
    addChecklistItem,
    removeChecklistItem,
    updateLor,
    updateDocuments,
    getSchoolById,
    getProgramForSchool,
    getSchoolNotes,
    updateSchoolNotes,

    // Global task management
    globalTasks: globalTasksLocal || [],
    addGlobalTask,
    deleteGlobalTask,
    completeGlobalTask,
    updateGlobalTaskStatus,
    getEarliestDeadlineForCategory,

    // Hidden checklist management
    hideChecklistItem,
    revealChecklistItem,
    getHiddenItems,

    // Checklist sync
    syncChecklistItemsAcrossPrograms,

    // Dashboard tasks (for users without targets)
    dashboardTasks: dashboardTasksLocal || [],
    addDashboardTask,
    completeDashboardTask,
    deleteDashboardTask,

    // Dismissed suggestions
    dismissedSuggestions: dismissedSuggestionsLocal || [],
    dismissSuggestion,

    // Helper computed values
    hasTargetPrograms: targetPrograms.length > 0,
    hasSavedPrograms: savedPrograms.length > 0,
    totalPrograms: targetPrograms.length + savedPrograms.length,

    // Auth state
    isAuthenticated: !!user,
    user,

    // Access to raw school data
    allSchools: schools,
    schoolMap,

    // Helper functions for checking requirements
    schoolRequiresGre,
    schoolRequiresCcrn,
  };
}
