/**
 * useTrackers Hook
 *
 * Manages all tracker data: clinical logs, shadow days, EQ reflections, events.
 * Uses Supabase when authenticated, falls back to mock data otherwise.
 *
 * Supabase Tables:
 * - clinical_entries (ICU clinical experience tracking)
 * - shadow_days (shadowing/networking tracking)
 * - eq_reflections (emotional intelligence reflections)
 * - user_events (saved events and attendance)
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from './useAuth';
import {
  mockUpcomingEvents,
  mockRecentDiscussions,
  mockActivityFeed,
  mockSavedPrerequisites,
  mockQuickLinks
} from '@/data/mockActivity';
import { mockClinicalEntries } from '@/data/mockClinicalEntries';
import { mockShadowDays } from '@/data/mockShadowDays';
import { mockEQReflections } from '@/data/mockEQReflections';

/**
 * Transform snake_case from Supabase to camelCase for app
 */
function transformClinicalEntry(entry) {
  return {
    id: entry.id,
    userId: entry.user_id,
    shiftDate: entry.shift_date,
    shiftType: entry.shift_type,
    shiftDuration: entry.shift_duration,
    patientCount: entry.patient_count,
    patientPopulations: entry.patient_populations || [],
    medications: entry.medications || [],
    devices: entry.devices || [],
    procedures: entry.procedures || [],
    teachingInvolved: entry.teaching_involved,
    codeOrRapidResponse: entry.code_or_rapid_response,
    unusualCases: entry.unusual_cases || [],
    notes: entry.notes,
    highlightMoment: entry.highlight_moment,
    pointsEarned: entry.points_earned,
    createdAt: entry.created_at,
    updatedAt: entry.updated_at,
  };
}

function transformShadowDay(shadow) {
  return {
    id: shadow.id,
    userId: shadow.user_id,
    date: shadow.date,
    status: shadow.status,
    location: shadow.location,
    providerName: shadow.provider_name,
    providerEmail: shadow.provider_email,
    providerLinkedin: shadow.provider_linkedin,
    providerProgram: shadow.provider_program,
    providerSpecialty: shadow.provider_specialty,
    hoursLogged: shadow.hours_logged,
    casesObserved: shadow.cases_observed,
    skillsObserved: shadow.skills_observed || [],
    notes: shadow.notes,
    standoutMoment: shadow.standout_moment,
    followUpStatus: shadow.follow_up_status,
    savedToNetwork: shadow.saved_to_network,
    targetProgramId: shadow.target_program_id,
    addToTotalHours: shadow.add_to_total_hours,
    prepCompleted: shadow.prep_completed,
    createdAt: shadow.created_at,
    updatedAt: shadow.updated_at,
  };
}

function transformEQReflection(reflection) {
  return {
    id: reflection.id,
    userId: reflection.user_id,
    date: reflection.date,
    title: reflection.title,
    reflection: reflection.reflection,
    categories: reflection.categories || [],
    isInterviewStory: reflection.is_interview_story,
    pointsEarned: reflection.points_earned,
    createdAt: reflection.created_at,
    updatedAt: reflection.updated_at,
  };
}

function transformUserEvent(event) {
  return {
    id: event.id,
    userId: event.user_id,
    name: event.name,
    date: event.date,
    description: event.description,
    eventType: event.event_type,
    location: event.location,
    isVirtual: event.is_virtual,
    registrationUrl: event.registration_url,
    programId: event.program_id,
    schoolEventId: event.school_event_id,
    attendanceStatus: event.attendance_status,
    notes: event.notes,
    calendarSynced: event.calendar_synced,
    createdAt: event.created_at,
    updatedAt: event.updated_at,
  };
}

export function useTrackers() {
  // Use centralized auth - prevents duplicate auth listeners
  const { user, isLoading: authLoading } = useAuth();
  const hasFetchedRef = useRef(false);

  // Tracker data state
  const [clinicalEntries, setClinicalEntries] = useState([]);
  const [shadowDays, setShadowDays] = useState([]);
  const [eqReflections, setEQReflections] = useState([]);
  const [userEvents, setUserEvents] = useState([]);

  // Legacy activity data (still using mock data)
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [recentDiscussions, setRecentDiscussions] = useState([]);
  const [activityFeed, setActivityFeed] = useState([]);
  const [savedPrerequisites, setSavedPrerequisites] = useState([]);
  const [quickLinks, setQuickLinks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tracker data
  useEffect(() => {
    const fetchTrackerData = async () => {
      try {
        setLoading(true);

        if (user && isSupabaseConfigured()) {
          // Fetch from Supabase
          const [clinicalRes, shadowRes, eqRes, eventsRes] = await Promise.all([
            supabase
              .from('clinical_entries')
              .select('*')
              .eq('user_id', user.id)
              .order('shift_date', { ascending: false }),
            supabase
              .from('shadow_days')
              .select('*')
              .eq('user_id', user.id)
              .order('date', { ascending: false }),
            supabase
              .from('eq_reflections')
              .select('*')
              .eq('user_id', user.id)
              .order('date', { ascending: false }),
            supabase
              .from('user_events')
              .select('*')
              .eq('user_id', user.id)
              .order('date', { ascending: true }),
          ]);

          if (clinicalRes.error) throw clinicalRes.error;
          if (shadowRes.error) throw shadowRes.error;
          if (eqRes.error) throw eqRes.error;
          if (eventsRes.error) throw eventsRes.error;

          setClinicalEntries((clinicalRes.data || []).map(transformClinicalEntry));
          setShadowDays((shadowRes.data || []).map(transformShadowDay));
          setEQReflections((eqRes.data || []).map(transformEQReflection));
          setUserEvents((eventsRes.data || []).map(transformUserEvent));
        } else {
          // Use mock data for unauthenticated users
          setClinicalEntries(mockClinicalEntries);
          setShadowDays(mockShadowDays);
          setEQReflections(mockEQReflections);
          setUserEvents([]);
        }

        // Legacy mock data (still using for now)
        setUpcomingEvents(mockUpcomingEvents);
        setRecentDiscussions(mockRecentDiscussions);
        setActivityFeed(mockActivityFeed);
        setSavedPrerequisites(mockSavedPrerequisites);
        setQuickLinks(mockQuickLinks);

        setError(null);
      } catch (err) {
        console.error('Error fetching tracker data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchTrackerData();
    }
  }, [user, authLoading]);

  // Add clinical entry
  const addClinicalEntry = useCallback(async (entryData) => {
    if (user && isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('clinical_entries')
          .insert({
            user_id: user.id,
            shift_date: entryData.shiftDate,
            shift_type: entryData.shiftType || 'day',
            shift_duration: entryData.shiftDuration || 12,
            patient_count: entryData.patientCount || 1,
            patient_populations: entryData.patientPopulations || [],
            medications: entryData.medications || [],
            devices: entryData.devices || [],
            procedures: entryData.procedures || [],
            teaching_involved: entryData.teachingInvolved || false,
            code_or_rapid_response: entryData.codeOrRapidResponse || false,
            unusual_cases: entryData.unusualCases || [],
            notes: entryData.notes || '',
            highlight_moment: entryData.highlightMoment || '',
            points_earned: entryData.pointsEarned || 2,
          })
          .select()
          .single();

        if (error) throw error;

        setClinicalEntries(prev => [transformClinicalEntry(data), ...prev]);
        return data;
      } catch (err) {
        console.error('Error adding clinical entry:', err);
        setError(err.message);
        throw err;
      }
    } else {
      // Mock data fallback
      const newEntry = { ...entryData, id: `clin_${Date.now()}`, userId: 'user_123' };
      setClinicalEntries(prev => [newEntry, ...prev]);
      return newEntry;
    }
  }, [user]);

  // Update clinical entry
  const updateClinicalEntry = useCallback(async (entryId, updates) => {
    if (user && isSupabaseConfigured()) {
      try {
        const supabaseUpdates = {};
        if (updates.shiftDate !== undefined) supabaseUpdates.shift_date = updates.shiftDate;
        if (updates.shiftType !== undefined) supabaseUpdates.shift_type = updates.shiftType;
        if (updates.shiftDuration !== undefined) supabaseUpdates.shift_duration = updates.shiftDuration;
        if (updates.patientCount !== undefined) supabaseUpdates.patient_count = updates.patientCount;
        if (updates.patientPopulations !== undefined) supabaseUpdates.patient_populations = updates.patientPopulations;
        if (updates.medications !== undefined) supabaseUpdates.medications = updates.medications;
        if (updates.devices !== undefined) supabaseUpdates.devices = updates.devices;
        if (updates.procedures !== undefined) supabaseUpdates.procedures = updates.procedures;
        if (updates.teachingInvolved !== undefined) supabaseUpdates.teaching_involved = updates.teachingInvolved;
        if (updates.codeOrRapidResponse !== undefined) supabaseUpdates.code_or_rapid_response = updates.codeOrRapidResponse;
        if (updates.unusualCases !== undefined) supabaseUpdates.unusual_cases = updates.unusualCases;
        if (updates.notes !== undefined) supabaseUpdates.notes = updates.notes;
        if (updates.highlightMoment !== undefined) supabaseUpdates.highlight_moment = updates.highlightMoment;

        const { error } = await supabase
          .from('clinical_entries')
          .update(supabaseUpdates)
          .eq('id', entryId)
          .eq('user_id', user.id);

        if (error) throw error;

        setClinicalEntries(prev => prev.map(entry =>
          entry.id === entryId ? { ...entry, ...updates } : entry
        ));
      } catch (err) {
        console.error('Error updating clinical entry:', err);
        setError(err.message);
        throw err;
      }
    } else {
      setClinicalEntries(prev => prev.map(entry =>
        entry.id === entryId ? { ...entry, ...updates } : entry
      ));
    }
  }, [user]);

  // Delete clinical entry
  const deleteClinicalEntry = useCallback(async (entryId) => {
    if (user && isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('clinical_entries')
          .delete()
          .eq('id', entryId)
          .eq('user_id', user.id);

        if (error) throw error;

        setClinicalEntries(prev => prev.filter(entry => entry.id !== entryId));
      } catch (err) {
        console.error('Error deleting clinical entry:', err);
        setError(err.message);
        throw err;
      }
    } else {
      setClinicalEntries(prev => prev.filter(entry => entry.id !== entryId));
    }
  }, [user]);

  // Add shadow day
  const addShadowDay = useCallback(async (shadowData) => {
    if (user && isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('shadow_days')
          .insert({
            user_id: user.id,
            date: shadowData.date,
            status: shadowData.status || 'logged',
            location: shadowData.location,
            provider_name: shadowData.providerName || '',
            provider_email: shadowData.providerEmail || null,
            provider_linkedin: shadowData.providerLinkedin || null,
            provider_program: shadowData.providerProgram || null,
            provider_specialty: shadowData.providerSpecialty || null,
            hours_logged: shadowData.hoursLogged || 0,
            cases_observed: shadowData.casesObserved || 0,
            skills_observed: shadowData.skillsObserved || [],
            notes: shadowData.notes || '',
            standout_moment: shadowData.standoutMoment || null,
            follow_up_status: shadowData.followUpStatus || 'none',
            saved_to_network: shadowData.savedToNetwork || false,
            target_program_id: shadowData.targetProgramId || null,
            add_to_total_hours: shadowData.addToTotalHours !== undefined ? shadowData.addToTotalHours : true,
            prep_completed: shadowData.prepCompleted || false,
          })
          .select()
          .single();

        if (error) throw error;

        setShadowDays(prev => [transformShadowDay(data), ...prev]);
        return data;
      } catch (err) {
        console.error('Error adding shadow day:', err);
        setError(err.message);
        throw err;
      }
    } else {
      const newShadow = { ...shadowData, id: `shadow_${Date.now()}`, userId: 'user_123' };
      setShadowDays(prev => [newShadow, ...prev]);
      return newShadow;
    }
  }, [user]);

  // Update shadow day
  const updateShadowDay = useCallback(async (shadowId, updates) => {
    if (user && isSupabaseConfigured()) {
      try {
        const supabaseUpdates = {};
        if (updates.date !== undefined) supabaseUpdates.date = updates.date;
        if (updates.status !== undefined) supabaseUpdates.status = updates.status;
        if (updates.location !== undefined) supabaseUpdates.location = updates.location;
        if (updates.providerName !== undefined) supabaseUpdates.provider_name = updates.providerName;
        if (updates.providerEmail !== undefined) supabaseUpdates.provider_email = updates.providerEmail;
        if (updates.providerLinkedin !== undefined) supabaseUpdates.provider_linkedin = updates.providerLinkedin;
        if (updates.providerProgram !== undefined) supabaseUpdates.provider_program = updates.providerProgram;
        if (updates.providerSpecialty !== undefined) supabaseUpdates.provider_specialty = updates.providerSpecialty;
        if (updates.hoursLogged !== undefined) supabaseUpdates.hours_logged = updates.hoursLogged;
        if (updates.casesObserved !== undefined) supabaseUpdates.cases_observed = updates.casesObserved;
        if (updates.skillsObserved !== undefined) supabaseUpdates.skills_observed = updates.skillsObserved;
        if (updates.notes !== undefined) supabaseUpdates.notes = updates.notes;
        if (updates.standoutMoment !== undefined) supabaseUpdates.standout_moment = updates.standoutMoment;
        if (updates.followUpStatus !== undefined) supabaseUpdates.follow_up_status = updates.followUpStatus;
        if (updates.savedToNetwork !== undefined) supabaseUpdates.saved_to_network = updates.savedToNetwork;
        if (updates.targetProgramId !== undefined) supabaseUpdates.target_program_id = updates.targetProgramId;
        if (updates.addToTotalHours !== undefined) supabaseUpdates.add_to_total_hours = updates.addToTotalHours;
        if (updates.prepCompleted !== undefined) supabaseUpdates.prep_completed = updates.prepCompleted;

        const { error } = await supabase
          .from('shadow_days')
          .update(supabaseUpdates)
          .eq('id', shadowId)
          .eq('user_id', user.id);

        if (error) throw error;

        setShadowDays(prev => prev.map(shadow =>
          shadow.id === shadowId ? { ...shadow, ...updates } : shadow
        ));
      } catch (err) {
        console.error('Error updating shadow day:', err);
        setError(err.message);
        throw err;
      }
    } else {
      setShadowDays(prev => prev.map(shadow =>
        shadow.id === shadowId ? { ...shadow, ...updates } : shadow
      ));
    }
  }, [user]);

  // Delete shadow day
  const deleteShadowDay = useCallback(async (shadowId) => {
    if (user && isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('shadow_days')
          .delete()
          .eq('id', shadowId)
          .eq('user_id', user.id);

        if (error) throw error;

        setShadowDays(prev => prev.filter(shadow => shadow.id !== shadowId));
      } catch (err) {
        console.error('Error deleting shadow day:', err);
        setError(err.message);
        throw err;
      }
    } else {
      setShadowDays(prev => prev.filter(shadow => shadow.id !== shadowId));
    }
  }, [user]);

  // Add EQ reflection
  const addEQReflection = useCallback(async (reflectionData) => {
    if (user && isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('eq_reflections')
          .insert({
            user_id: user.id,
            date: reflectionData.date,
            title: reflectionData.title,
            reflection: reflectionData.reflection,
            categories: reflectionData.categories || [],
            is_interview_story: reflectionData.isInterviewStory || false,
            points_earned: reflectionData.pointsEarned || 2,
          })
          .select()
          .single();

        if (error) throw error;

        setEQReflections(prev => [transformEQReflection(data), ...prev]);
        return data;
      } catch (err) {
        console.error('Error adding EQ reflection:', err);
        setError(err.message);
        throw err;
      }
    } else {
      const newReflection = { ...reflectionData, id: `eq_${Date.now()}`, userId: 'user_123' };
      setEQReflections(prev => [newReflection, ...prev]);
      return newReflection;
    }
  }, [user]);

  // Update EQ reflection
  const updateEQReflection = useCallback(async (reflectionId, updates) => {
    if (user && isSupabaseConfigured()) {
      try {
        const supabaseUpdates = {};
        if (updates.date !== undefined) supabaseUpdates.date = updates.date;
        if (updates.title !== undefined) supabaseUpdates.title = updates.title;
        if (updates.reflection !== undefined) supabaseUpdates.reflection = updates.reflection;
        if (updates.categories !== undefined) supabaseUpdates.categories = updates.categories;
        if (updates.isInterviewStory !== undefined) supabaseUpdates.is_interview_story = updates.isInterviewStory;

        const { error } = await supabase
          .from('eq_reflections')
          .update(supabaseUpdates)
          .eq('id', reflectionId)
          .eq('user_id', user.id);

        if (error) throw error;

        setEQReflections(prev => prev.map(reflection =>
          reflection.id === reflectionId ? { ...reflection, ...updates } : reflection
        ));
      } catch (err) {
        console.error('Error updating EQ reflection:', err);
        setError(err.message);
        throw err;
      }
    } else {
      setEQReflections(prev => prev.map(reflection =>
        reflection.id === reflectionId ? { ...reflection, ...updates } : reflection
      ));
    }
  }, [user]);

  // Delete EQ reflection
  const deleteEQReflection = useCallback(async (reflectionId) => {
    if (user && isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('eq_reflections')
          .delete()
          .eq('id', reflectionId)
          .eq('user_id', user.id);

        if (error) throw error;

        setEQReflections(prev => prev.filter(reflection => reflection.id !== reflectionId));
      } catch (err) {
        console.error('Error deleting EQ reflection:', err);
        setError(err.message);
        throw err;
      }
    } else {
      setEQReflections(prev => prev.filter(reflection => reflection.id !== reflectionId));
    }
  }, [user]);

  // Save event
  const saveEvent = useCallback(async (eventData) => {
    if (user && isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('user_events')
          .insert({
            user_id: user.id,
            name: eventData.name,
            date: eventData.date,
            description: eventData.description || null,
            event_type: eventData.eventType || null,
            location: eventData.location || null,
            is_virtual: eventData.isVirtual || false,
            registration_url: eventData.registrationUrl || null,
            program_id: eventData.programId || null,
            school_event_id: eventData.schoolEventId || null,
            attendance_status: eventData.attendanceStatus || 'saved',
            notes: eventData.notes || null,
          })
          .select()
          .single();

        if (error) throw error;

        setUserEvents(prev => [...prev, transformUserEvent(data)].sort((a, b) =>
          new Date(a.date) - new Date(b.date)
        ));
        return data;
      } catch (err) {
        console.error('Error saving event:', err);
        setError(err.message);
        throw err;
      }
    } else {
      console.log('Saving event (mock):', eventData);
    }
  }, [user]);

  // Remove saved event
  const removeSavedEvent = useCallback(async (eventId) => {
    if (user && isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('user_events')
          .delete()
          .eq('id', eventId)
          .eq('user_id', user.id);

        if (error) throw error;

        setUserEvents(prev => prev.filter(event => event.id !== eventId));
      } catch (err) {
        console.error('Error removing event:', err);
        setError(err.message);
        throw err;
      }
    } else {
      setUpcomingEvents(prev => prev.filter(event => event.id !== eventId));
    }
  }, [user]);

  // Update event attendance
  const updateEventAttendance = useCallback(async (eventId, status) => {
    if (user && isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('user_events')
          .update({ attendance_status: status })
          .eq('id', eventId)
          .eq('user_id', user.id);

        if (error) throw error;

        setUserEvents(prev => prev.map(event =>
          event.id === eventId ? { ...event, attendanceStatus: status } : event
        ));
      } catch (err) {
        console.error('Error updating event attendance:', err);
        setError(err.message);
        throw err;
      }
    }
  }, [user]);

  // Add prerequisite (still using mock data)
  const addPrerequisite = useCallback(async (prerequisite) => {
    setSavedPrerequisites(prev => [...prev, prerequisite]);
  }, []);

  // Remove prerequisite (still using mock data)
  const removePrerequisite = useCallback(async (prerequisiteId) => {
    setSavedPrerequisites(prev => prev.filter(p => p.id !== prerequisiteId));
  }, []);

  // Update prerequisite (still using mock data)
  const updatePrerequisite = useCallback(async (prerequisiteId, updates) => {
    setSavedPrerequisites(prev => prev.map(prereq =>
      prereq.id === prerequisiteId
        ? { ...prereq, ...updates }
        : prereq
    ));
  }, []);

  // Sort events by date
  const sortedEvents = [...upcomingEvents].sort((a, b) =>
    new Date(a.date) - new Date(b.date)
  );

  // Get upcoming events (next 30 days)
  const nextEvents = sortedEvents.filter(event => {
    const eventDate = new Date(event.date);
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    return eventDate >= now && eventDate <= thirtyDaysFromNow;
  });

  // Get participated discussions
  const participatedDiscussions = recentDiscussions.filter(d => d.participated);

  // Get completed prerequisites
  const completedPrerequisites = savedPrerequisites.filter(p => p.completed);

  // Get incomplete prerequisites
  const incompletePrerequisites = savedPrerequisites.filter(p => !p.completed);

  return {
    // Legacy activity data (mock)
    upcomingEvents: sortedEvents,
    nextEvents,
    recentDiscussions,
    participatedDiscussions,
    activityFeed,
    savedPrerequisites,
    completedPrerequisites,
    incompletePrerequisites,
    quickLinks,

    // Tracker data (Supabase-backed)
    clinicalEntries,
    shadowDays,
    eqReflections,
    userEvents,

    // State
    loading: loading || authLoading,
    error,

    // Clinical methods
    addClinicalEntry,
    updateClinicalEntry,
    deleteClinicalEntry,

    // Shadow day methods
    addShadowDay,
    updateShadowDay,
    deleteShadowDay,

    // EQ reflection methods
    addEQReflection,
    updateEQReflection,
    deleteEQReflection,

    // Event methods
    saveEvent,
    removeSavedEvent,
    updateEventAttendance,

    // Prerequisite methods (still mock)
    addPrerequisite,
    removePrerequisite,
    updatePrerequisite,

    // Helper computed values
    hasUpcomingEvents: upcomingEvents.length > 0,
    hasRecentActivity: activityFeed.length > 0,
    prerequisitesCompletionRate: savedPrerequisites.length > 0
      ? Math.round((completedPrerequisites.length / savedPrerequisites.length) * 100)
      : 0,
    hasClinicalEntries: clinicalEntries.length > 0,
    hasShadowDays: shadowDays.length > 0,
    hasEQReflections: eqReflections.length > 0,

    // Auth state
    isAuthenticated: !!user,
    user,
  };
}
