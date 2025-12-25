/**
 * useEvents - Hook for managing events state
 * Handles saved events, filtering, and event selection
 *
 * Integrates with Supabase tables:
 * - school_events (school info sessions, deadlines)
 * - crna_club_events (admin-created club events)
 * - state_meetings (AANA state meetings)
 * - user_saved_events (events user has saved)
 * - user_calendar_events (user-created events)
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from './useAuth';
import { mockEvents } from '@/data/mockEvents';

// Initial saved events for unauthenticated users
const INITIAL_SAVED_EVENT_IDS = ['event_009', 'event_010'];

export function useEvents() {
  // Use centralized auth - prevents duplicate auth listeners
  const { user, isLoading: authLoading } = useAuth();

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Supabase event data (authenticated users)
  const [supabaseEvents, setSupabaseEvents] = useState([]);
  const [supabaseSavedEventIds, setSupabaseSavedEventIds] = useState(new Set());

  // Local state (unauthenticated users)
  const [localEvents] = useState(mockEvents);
  const [localSavedEventIds, setLocalSavedEventIds] = useState(new Set(INITIAL_SAVED_EVENT_IDS));

  // Use Supabase or local data based on auth state
  const events = user ? supabaseEvents : localEvents;
  const savedEventIds = user ? supabaseSavedEventIds : localSavedEventIds;

  // Filter state
  const [filters, setFilters] = useState({
    category: null,
    state: null,
  });

  // View state
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list' | 'calendar'
  const [activeView, setActiveView] = useState('all'); // 'all' | 'saved'

  // Selected event for modal
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Set loading to false when auth is done and Supabase not configured
  useEffect(() => {
    if (!isSupabaseConfigured() && !authLoading) {
      setLoading(false);
    }
  }, [authLoading]);

  // Fetch events from Supabase when authenticated
  useEffect(() => {
    async function fetchEvents() {
      if (!user || !isSupabaseConfigured()) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch all event types in parallel
        const [schoolEventsRes, crnaClubEventsRes, stateMeetingsRes, savedEventsRes] = await Promise.all([
          // 1. School events (info sessions, open houses)
          supabase
            .from('school_events')
            .select('*')
            .gte('event_date', new Date().toISOString().split('T')[0])
            .order('event_date', { ascending: true }),

          // 2. CRNA Club events
          supabase
            .from('crna_club_events')
            .select('*')
            .eq('is_published', true)
            .gte('event_date', new Date().toISOString().split('T')[0])
            .order('event_date', { ascending: true }),

          // 3. State meetings (AANA events)
          supabase
            .from('state_meetings')
            .select('*')
            .eq('is_published', true)
            .gte('event_date', new Date().toISOString().split('T')[0])
            .order('event_date', { ascending: true }),

          // 4. User's saved events
          supabase
            .from('user_saved_events')
            .select('*')
            .eq('user_id', user.id),
        ]);

        if (schoolEventsRes.error) throw schoolEventsRes.error;
        if (crnaClubEventsRes.error) throw crnaClubEventsRes.error;
        if (stateMeetingsRes.error) throw stateMeetingsRes.error;
        if (savedEventsRes.error) throw savedEventsRes.error;

        // Transform school events to app format
        const transformedSchoolEvents = (schoolEventsRes.data || []).map(event => ({
          id: event.id,
          title: event.name,
          description: event.description,
          date: event.event_date,
          time: event.event_time || '00:00',
          timezone: event.timezone || 'America/New_York',
          category: event.event_type === 'info_session' ? 'school_info_session' :
                   event.event_type === 'open_house' ? 'school_open_house' :
                   'school_info_session',
          source: 'school',
          imageUrl: null,
          location: event.is_virtual ? 'Virtual' : null,
          isVirtual: event.is_virtual,
          externalUrl: event.registration_url,
          rsvpUrl: event.registration_url,
          hostedBy: null,
          schoolId: event.school_id ? `school_${event.school_id}` : null,
          schoolName: event.school_name,
          state: null,
          pointsValue: 0,
          attendanceWebhookId: null,
          _supabaseType: 'school_event',
          _supabaseId: event.id,
        }));

        // Transform CRNA Club events to app format
        const transformedCrnaClubEvents = (crnaClubEventsRes.data || []).map(event => ({
          id: `crna_${event.id}`,
          title: event.title,
          description: event.description,
          date: event.event_date,
          time: event.event_time || '00:00',
          timezone: 'America/New_York',
          category: 'crna_club_event',
          source: 'crna_club',
          imageUrl: null,
          location: event.location || (event.is_virtual ? 'Virtual' : null),
          isVirtual: event.is_virtual,
          externalUrl: event.virtual_link,
          rsvpUrl: event.registration_url,
          hostedBy: 'The CRNA Club Team',
          schoolId: null,
          schoolName: null,
          state: null,
          pointsValue: 0,
          attendanceWebhookId: null,
          _supabaseType: 'crna_club_event',
          _supabaseId: event.id,
        }));

        // Transform state meetings to app format
        const transformedStateMeetings = (stateMeetingsRes.data || []).map(event => ({
          id: `state_${event.id}`,
          title: event.title,
          description: event.description,
          date: event.event_date,
          time: event.event_time || '00:00',
          timezone: event.timezone || 'America/New_York',
          category: 'aana_state_meeting',
          source: 'aana',
          imageUrl: null,
          location: event.city && event.state ? `${event.city}, ${event.state}` : event.location,
          isVirtual: event.is_virtual,
          externalUrl: event.registration_url,
          rsvpUrl: event.registration_url,
          hostedBy: event.organization || 'AANA',
          schoolId: null,
          schoolName: null,
          state: event.state,
          pointsValue: 0,
          attendanceWebhookId: null,
          _supabaseType: 'state_meeting',
          _supabaseId: event.id,
        }));

        // Combine all events
        const allEvents = [
          ...transformedSchoolEvents,
          ...transformedCrnaClubEvents,
          ...transformedStateMeetings,
        ];

        setSupabaseEvents(allEvents);

        // Build saved event IDs set
        const savedIds = new Set();
        (savedEventsRes.data || []).forEach(saved => {
          if (saved.school_event_id) {
            savedIds.add(saved.school_event_id);
          } else if (saved.crna_club_event_id) {
            savedIds.add(`crna_${saved.crna_club_event_id}`);
          } else if (saved.state_meeting_id) {
            savedIds.add(`state_${saved.state_meeting_id}`);
          }
        });
        setSupabaseSavedEventIds(savedIds);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError(err.message);
        setLoading(false);
      }
    }

    fetchEvents();
  }, [user]);

  /**
   * Check if an event is saved
   */
  const isEventSaved = useCallback(
    (eventId) => savedEventIds.has(eventId),
    [savedEventIds]
  );

  /**
   * Toggle save status for an event
   */
  const toggleSaveEvent = useCallback(async (event) => {
    if (user && isSupabaseConfigured()) {
      // Supabase: Insert or delete from user_saved_events
      try {
        const isSaved = savedEventIds.has(event.id);

        if (isSaved) {
          // Unsave event - delete from user_saved_events
          let deleteQuery = supabase
            .from('user_saved_events')
            .delete()
            .eq('user_id', user.id);

          // Determine which field to match based on event type
          if (event._supabaseType === 'school_event') {
            deleteQuery = deleteQuery.eq('school_event_id', event._supabaseId);
          } else if (event._supabaseType === 'crna_club_event') {
            deleteQuery = deleteQuery.eq('crna_club_event_id', event._supabaseId);
          } else if (event._supabaseType === 'state_meeting') {
            deleteQuery = deleteQuery.eq('state_meeting_id', event._supabaseId);
          }

          const { error: deleteError } = await deleteQuery;
          if (deleteError) throw deleteError;

          // Update local state
          setSupabaseSavedEventIds(prev => {
            const next = new Set(prev);
            next.delete(event.id);
            return next;
          });
        } else {
          // Save event - insert into user_saved_events
          const insertData = {
            user_id: user.id,
            school_event_id: event._supabaseType === 'school_event' ? event._supabaseId : null,
            crna_club_event_id: event._supabaseType === 'crna_club_event' ? event._supabaseId : null,
            state_meeting_id: event._supabaseType === 'state_meeting' ? event._supabaseId : null,
          };

          const { error: insertError } = await supabase
            .from('user_saved_events')
            .insert(insertData);

          if (insertError) throw insertError;

          // Update local state
          setSupabaseSavedEventIds(prev => {
            const next = new Set(prev);
            next.add(event.id);
            return next;
          });
        }
      } catch (err) {
        console.error('Error toggling save event:', err);
        setError(err.message);
      }
    } else {
      // localStorage fallback for unauthenticated users
      setLocalSavedEventIds((prev) => {
        const next = new Set(prev);
        if (next.has(event.id)) {
          next.delete(event.id);
        } else {
          next.add(event.id);
        }
        return next;
      });
    }
  }, [user, savedEventIds]);

  /**
   * Filter events based on current filters and view
   */
  const filteredEvents = useMemo(() => {
    let result = [...events];

    // Filter by saved status if viewing saved
    if (activeView === 'saved') {
      result = result.filter((event) => savedEventIds.has(event.id));
    }

    // Filter by category
    if (filters.category) {
      result = result.filter((event) => event.category === filters.category);
    }

    // Filter by state
    if (filters.state) {
      result = result.filter((event) => event.state === filters.state);
    }

    // Sort by date (upcoming first)
    result.sort((a, b) => new Date(a.date) - new Date(b.date));

    return result;
  }, [events, filters, activeView, savedEventIds]);

  /**
   * Get upcoming saved events (for dashboard widget)
   */
  const upcomingSavedEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return events
      .filter((event) => savedEventIds.has(event.id))
      .filter((event) => new Date(event.date) >= today)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 3);
  }, [events, savedEventIds]);

  /**
   * Update filters
   */
  const setCategory = useCallback((category) => {
    setFilters((prev) => ({ ...prev, category }));
  }, []);

  const setState = useCallback((state) => {
    setFilters((prev) => ({ ...prev, state }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ category: null, state: null });
  }, []);

  /**
   * Open event detail modal
   */
  const openEventDetail = useCallback((event) => {
    setSelectedEvent(event);
  }, []);

  /**
   * Close event detail modal
   */
  const closeEventDetail = useCallback(() => {
    setSelectedEvent(null);
  }, []);

  /**
   * Get saved events count
   */
  const savedEventsCount = savedEventIds.size;

  return {
    // Events
    events,
    filteredEvents,
    upcomingSavedEvents,

    // Saved state
    savedEventIds,
    isEventSaved,
    toggleSaveEvent,
    savedEventsCount,

    // Filters
    filters,
    setCategory,
    setState,
    resetFilters,

    // View
    viewMode,
    setViewMode,
    activeView,
    setActiveView,

    // Modal
    selectedEvent,
    openEventDetail,
    closeEventDetail,

    // Loading and error states
    loading: loading || authLoading,
    error,

    // Auth state
    isAuthenticated: !!user,
    user,
  };
}

export default useEvents;
