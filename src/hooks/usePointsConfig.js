/**
 * usePointsConfig - Hook for managing gamification points configuration
 *
 * Provides:
 * - Point actions (what awards points)
 * - Active promos (current multipliers)
 * - Admin CRUD for actions and promos
 * - Helper to get effective points for an action
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

// Mock mode for development without Supabase auth
const USE_MOCK_MODE = import.meta.env.DEV;

// Default point actions (matches migration seed data)
const DEFAULT_ACTIONS = [
  { id: '1', slug: 'lesson_complete', label: 'Complete a Lesson', description: 'Awarded when marking a lesson as complete', base_points: 3, daily_max: 10, is_active: true },
  { id: '2', slug: 'review_submit', label: 'Submit Course Review', description: 'Awarded for submitting a prerequisite course review', base_points: 10, daily_max: null, is_active: true },
  { id: '3', slug: 'shadow_log', label: 'Log Shadow Hours', description: 'Awarded for logging shadow day hours', base_points: 5, daily_max: 3, is_active: true },
  { id: '4', slug: 'clinical_log', label: 'Log Clinical Experience', description: 'Awarded for logging clinical experience hours', base_points: 5, daily_max: 3, is_active: true },
  { id: '5', slug: 'profile_complete', label: 'Complete Profile Section', description: 'Awarded for completing a MyStats section', base_points: 15, daily_max: null, is_active: true },
  { id: '6', slug: 'eq_log', label: 'Log EQ Hours', description: 'Awarded for logging extracurricular hours', base_points: 5, daily_max: 3, is_active: true },
  { id: '7', slug: 'program_save', label: 'Save Target Program', description: 'Awarded for adding a school to target list', base_points: 5, daily_max: 5, is_active: true },
  { id: '8', slug: 'task_complete', label: 'Complete Program Task', description: 'Awarded for completing a program checklist task', base_points: 2, daily_max: 20, is_active: true },
  { id: '9', slug: 'first_login', label: 'First Login Bonus', description: 'One-time bonus for first login', base_points: 50, daily_max: 1, is_active: true },
  { id: '10', slug: 'daily_streak', label: 'Daily Login Streak', description: 'Awarded for consecutive daily logins', base_points: 5, daily_max: 1, is_active: true },
];

/**
 * Fetch all point actions
 */
export function usePointActions() {
  const [actions, setActions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActions = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('point_actions')
        .select('*')
        .order('label');

      if (fetchError) throw fetchError;

      setActions(data || []);
    } catch (err) {
      console.error('Error fetching point actions:', err);
      if (USE_MOCK_MODE) {
        setActions(DEFAULT_ACTIONS);
      } else {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActions();
  }, [fetchActions]);

  return { actions, isLoading, error, refetch: fetchActions };
}

/**
 * Fetch point promos with optional filtering
 */
export function usePointPromos(options = {}) {
  const { activeOnly = false } = options;
  const [promos, setPromos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPromos = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('point_promos')
        .select('*')
        .order('starts_at', { ascending: false });

      if (activeOnly) {
        query = query.eq('is_active', true);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setPromos(data || []);
    } catch (err) {
      console.error('Error fetching point promos:', err);
      if (USE_MOCK_MODE) {
        setPromos([]);
      } else {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [activeOnly]);

  useEffect(() => {
    fetchPromos();
  }, [fetchPromos]);

  return { promos, isLoading, error, refetch: fetchPromos };
}

/**
 * Get currently active promo (if any)
 */
export function useActivePromo() {
  const [promo, setPromo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchActivePromo() {
      try {
        const { data, error } = await supabase.rpc('get_active_promo');

        if (error) throw error;

        setPromo(data?.[0] || null);
      } catch (err) {
        console.error('Error fetching active promo:', err);
        setPromo(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchActivePromo();
  }, []);

  return { promo, isLoading };
}

/**
 * Admin CRUD operations for point actions and promos
 */
export function usePointsAdmin() {
  const [isSaving, setIsSaving] = useState(false);

  // Update point action
  const updateAction = useCallback(async (actionId, updates) => {
    setIsSaving(true);
    try {
      if (USE_MOCK_MODE) {
        toast.success('Action updated (mock mode)');
        return { success: true };
      }

      const { error } = await supabase
        .from('point_actions')
        .update(updates)
        .eq('id', actionId);

      if (error) throw error;

      toast.success('Point action updated');
      return { success: true };
    } catch (err) {
      console.error('Error updating action:', err);
      toast.error('Failed to update action');
      return { success: false, error: err.message };
    } finally {
      setIsSaving(false);
    }
  }, []);

  // Create point action
  const createAction = useCallback(async (action) => {
    setIsSaving(true);
    try {
      if (USE_MOCK_MODE) {
        toast.success('Action created (mock mode)');
        return { success: true, data: { id: 'mock-' + Date.now(), ...action } };
      }

      const { data, error } = await supabase
        .from('point_actions')
        .insert(action)
        .select()
        .single();

      if (error) throw error;

      toast.success('Point action created');
      return { success: true, data };
    } catch (err) {
      console.error('Error creating action:', err);
      toast.error('Failed to create action');
      return { success: false, error: err.message };
    } finally {
      setIsSaving(false);
    }
  }, []);

  // Delete point action
  const deleteAction = useCallback(async (actionId) => {
    setIsSaving(true);
    try {
      if (USE_MOCK_MODE) {
        toast.success('Action deleted (mock mode)');
        return { success: true };
      }

      const { error } = await supabase
        .from('point_actions')
        .delete()
        .eq('id', actionId);

      if (error) throw error;

      toast.success('Point action deleted');
      return { success: true };
    } catch (err) {
      console.error('Error deleting action:', err);
      toast.error('Failed to delete action');
      return { success: false, error: err.message };
    } finally {
      setIsSaving(false);
    }
  }, []);

  // Create promo
  const createPromo = useCallback(async (promo) => {
    setIsSaving(true);
    try {
      if (USE_MOCK_MODE) {
        toast.success('Promo created (mock mode)');
        return { success: true, data: { id: 'mock-' + Date.now(), ...promo } };
      }

      const { data, error } = await supabase
        .from('point_promos')
        .insert(promo)
        .select()
        .single();

      if (error) throw error;

      toast.success('Promo created');
      return { success: true, data };
    } catch (err) {
      console.error('Error creating promo:', err);
      toast.error('Failed to create promo');
      return { success: false, error: err.message };
    } finally {
      setIsSaving(false);
    }
  }, []);

  // Update promo
  const updatePromo = useCallback(async (promoId, updates) => {
    setIsSaving(true);
    try {
      if (USE_MOCK_MODE) {
        toast.success('Promo updated (mock mode)');
        return { success: true };
      }

      const { error } = await supabase
        .from('point_promos')
        .update(updates)
        .eq('id', promoId);

      if (error) throw error;

      toast.success('Promo updated');
      return { success: true };
    } catch (err) {
      console.error('Error updating promo:', err);
      toast.error('Failed to update promo');
      return { success: false, error: err.message };
    } finally {
      setIsSaving(false);
    }
  }, []);

  // Delete promo
  const deletePromo = useCallback(async (promoId) => {
    setIsSaving(true);
    try {
      if (USE_MOCK_MODE) {
        toast.success('Promo deleted (mock mode)');
        return { success: true };
      }

      const { error } = await supabase
        .from('point_promos')
        .delete()
        .eq('id', promoId);

      if (error) throw error;

      toast.success('Promo deleted');
      return { success: true };
    } catch (err) {
      console.error('Error deleting promo:', err);
      toast.error('Failed to delete promo');
      return { success: false, error: err.message };
    } finally {
      setIsSaving(false);
    }
  }, []);

  return {
    isSaving,
    updateAction,
    createAction,
    deleteAction,
    createPromo,
    updatePromo,
    deletePromo,
  };
}

/**
 * Helper to calculate effective points for an action
 */
export function calculateEffectivePoints(action, activePromo) {
  if (!action) return { base: 0, multiplier: 1, effective: 0, dailyMax: null, effectiveDailyMax: null };

  const multiplier = activePromo &&
    (activePromo.scope_type === 'global' || activePromo.scope_value === action.slug)
    ? parseFloat(activePromo.multiplier)
    : 1;

  return {
    base: action.base_points,
    multiplier,
    effective: Math.round(action.base_points * multiplier),
    dailyMax: action.daily_max,
    effectiveDailyMax: action.daily_max ? Math.round(action.daily_max * multiplier) : null,
  };
}

/**
 * Get promo status (upcoming, active, ended)
 */
export function getPromoStatus(promo) {
  const now = new Date();
  const start = new Date(promo.starts_at);
  const end = new Date(promo.ends_at);

  if (now < start) return 'upcoming';
  if (now > end) return 'ended';
  return 'active';
}

/**
 * Check if promo dates overlap with existing promos
 */
export function checkPromoOverlap(newPromo, existingPromos) {
  const newStart = new Date(newPromo.starts_at);
  const newEnd = new Date(newPromo.ends_at);

  return existingPromos.filter(p => {
    if (p.id === newPromo.id) return false; // Skip self
    if (!p.is_active) return false; // Only check active promos

    const existStart = new Date(p.starts_at);
    const existEnd = new Date(p.ends_at);

    // Check for overlap
    return newStart <= existEnd && newEnd >= existStart;
  });
}
