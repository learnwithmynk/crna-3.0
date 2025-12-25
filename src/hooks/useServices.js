/**
 * useServices Hook
 *
 * Fetches and manages marketplace service offerings.
 * Services are the specific offerings from providers.
 *
 * Data sources:
 * - Authenticated users: Supabase tables (services, provider_profiles)
 * - Unauthenticated users: Mock data fallback for testing/demos
 */

import { useState, useEffect, useMemo, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from './useAuth';
import { mockServices, getServiceById, getServicesByProvider, SERVICE_TYPES } from '@/data/marketplace/mockServices';

// Re-export service types for convenience
export { SERVICE_TYPES };

/**
 * Transform a service from Supabase (snake_case) to app format (camelCase)
 */
function transformServiceFromSupabase(service) {
  return {
    id: service.id,
    providerId: service.provider_id,
    type: service.type,
    title: service.title,
    description: service.description,
    deliverables: service.deliverables || [], // Assuming deliverables might be stored as JSON
    price: service.price_cents / 100, // Convert cents to dollars
    duration: service.duration_minutes,
    delivery: service.is_live ? 'live' : 'async',
    isLive: service.is_live,
    isActive: service.is_active,
    deliveryMethod: service.delivery_method,
    calComEventTypeId: service.cal_com_event_type_id,
    bookingCount: 0, // Would need to be counted from bookings table
    createdAt: service.created_at,
    updatedAt: service.updated_at,
  };
}

/**
 * Main hook for fetching services with filters
 */
export function useServices(options = {}) {
  const {
    providerId = null,
    serviceType = null,
    isLive = null, // true = live sessions, false = async, null = both
    minPrice = null,
    maxPrice = null,
    sortBy = 'price_low' // 'price_low', 'price_high', 'duration', 'popular'
  } = options;

  // Use centralized auth - prevents duplicate auth listeners
  const { user, isLoading: authLoading } = useAuth();
  const hasFetchedRef = useRef(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [supabaseServices, setSupabaseServices] = useState([]);

  // Fetch services from Supabase when authenticated
  useEffect(() => {
    async function fetchServices() {
      if (!user || !isSupabaseConfigured()) return;

      try {
        setLoading(true);
        setError(null);

        // Build query
        let query = supabase
          .from('services')
          .select(`
            *,
            provider:provider_profiles!inner(
              id,
              display_name,
              avatar_url,
              status
            )
          `)
          .eq('is_active', true)
          .eq('provider.status', 'approved');

        // Apply provider filter at query level if specified
        if (providerId) {
          query = query.eq('provider_id', providerId);
        }

        // Apply service type filter at query level if specified
        if (serviceType) {
          query = query.eq('type', serviceType);
        }

        const { data: services, error: fetchError } = await query;

        if (fetchError) throw fetchError;

        // Transform to app format
        const transformed = (services || []).map(transformServiceFromSupabase);
        setSupabaseServices(transformed);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError(err.message);
        setLoading(false);
      }
    }

    if (user) {
      fetchServices();
    }
  }, [user, providerId, serviceType]);

  // Filter and sort services
  const filteredServices = useMemo(() => {
    // Use Supabase data when authenticated, mock data otherwise
    let services = user ? supabaseServices : [...mockServices].filter(s => s.isActive);

    // For unauthenticated users, apply filters to mock data
    if (!user) {
      // Provider filter
      if (providerId) {
        services = services.filter(s => s.providerId === providerId);
      }

      // Service type filter
      if (serviceType) {
        services = services.filter(s => s.type === serviceType);
      }
    }

    // Live/async filter (applies to both authenticated and unauthenticated)
    if (isLive !== null) {
      services = services.filter(s => s.isLive === isLive);
    }

    // Price filters (applies to both authenticated and unauthenticated)
    if (minPrice !== null) {
      services = services.filter(s => s.price >= minPrice);
    }
    if (maxPrice !== null) {
      services = services.filter(s => s.price <= maxPrice);
    }

    // Sort
    switch (sortBy) {
      case 'price_low':
        services.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        services.sort((a, b) => b.price - a.price);
        break;
      case 'duration':
        services.sort((a, b) => (a.duration || 0) - (b.duration || 0));
        break;
      case 'popular':
        services.sort((a, b) => (b.bookingCount || 0) - (a.bookingCount || 0));
        break;
      default:
        break;
    }

    return services;
  }, [user, supabaseServices, providerId, serviceType, isLive, minPrice, maxPrice, sortBy]);

  // Simulate loading for unauthenticated users
  useEffect(() => {
    if (!user) {
      setLoading(true);
      const timer = setTimeout(() => {
        setLoading(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [user, providerId, serviceType, isLive, minPrice, maxPrice, sortBy]);

  return {
    services: filteredServices,
    loading: loading || authLoading,
    error,
    totalCount: filteredServices.length,
    isAuthenticated: !!user,
    user,
  };
}

/**
 * Hook for fetching a single service by ID
 */
export function useService(serviceId) {
  // Use centralized auth - prevents duplicate auth listeners
  const { user, isLoading: authLoading } = useAuth();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchService() {
      if (!serviceId) {
        setLoading(false);
        return;
      }

      if (user && isSupabaseConfigured()) {
        // Fetch from Supabase
        try {
          setLoading(true);
          setError(null);

          const { data: serviceData, error: fetchError } = await supabase
            .from('services')
            .select(`
              *,
              provider:provider_profiles!inner(
                id,
                display_name,
                avatar_url,
                status
              )
            `)
            .eq('id', serviceId)
            .eq('is_active', true)
            .eq('provider.status', 'approved')
            .single();

          if (fetchError) {
            if (fetchError.code === 'PGRST116') {
              // Not found
              setService(null);
              setError('Service not found');
            } else {
              throw fetchError;
            }
          } else {
            setService(transformServiceFromSupabase(serviceData));
          }
          setLoading(false);
        } catch (err) {
          console.error('Error fetching service:', err);
          setError(err.message);
          setLoading(false);
        }
      } else {
        // Use mock data
        setLoading(true);
        setTimeout(() => {
          const found = getServiceById(serviceId);
          if (found) {
            setService(found);
            setError(null);
          } else {
            setService(null);
            setError('Service not found');
          }
          setLoading(false);
        }, 200);
      }
    }

    if (!authLoading) {
      fetchService();
    }
  }, [serviceId, user, authLoading]);

  return {
    service,
    loading: loading || authLoading,
    error,
    isAuthenticated: !!user,
    user,
  };
}

/**
 * Hook for fetching services by provider
 */
export function useProviderServices(providerId) {
  // Use centralized auth - prevents duplicate auth listeners
  const { user, isLoading: authLoading } = useAuth();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProviderServices() {
      if (!providerId) {
        setLoading(false);
        return;
      }

      if (user && isSupabaseConfigured()) {
        // Fetch from Supabase
        try {
          setLoading(true);

          const { data: servicesData, error: fetchError } = await supabase
            .from('services')
            .select(`
              *,
              provider:provider_profiles!inner(
                id,
                display_name,
                avatar_url,
                status
              )
            `)
            .eq('provider_id', providerId)
            .eq('is_active', true)
            .eq('provider.status', 'approved')
            .order('created_at', { ascending: false });

          if (fetchError) throw fetchError;

          const transformed = (servicesData || []).map(transformServiceFromSupabase);
          setServices(transformed);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching provider services:', err);
          setServices([]);
          setLoading(false);
        }
      } else {
        // Use mock data
        setLoading(true);
        setTimeout(() => {
          setServices(getServicesByProvider(providerId));
          setLoading(false);
        }, 200);
      }
    }

    if (!authLoading) {
      fetchProviderServices();
    }
  }, [providerId, user, authLoading]);

  // Group services by type
  const groupedServices = useMemo(() => {
    const groups = {};
    services.forEach(service => {
      const type = service.type;
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(service);
    });
    return groups;
  }, [services]);

  // Get price range for provider
  const priceRange = useMemo(() => {
    if (services.length === 0) return { min: 0, max: 0 };
    const prices = services.map(s => s.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }, [services]);

  return {
    services,
    groupedServices,
    priceRange,
    loading: loading || authLoading,
    isAuthenticated: !!user,
    user,
  };
}

/**
 * Hook for service type metadata
 */
export function useServiceTypeInfo(serviceType) {
  const info = SERVICE_TYPES.find(t => t.value === serviceType);

  return {
    label: info?.label || serviceType,
    description: info?.description || '',
    icon: info?.icon || null,
    isLive: info?.isLive ?? true,
    defaultDuration: info?.defaultDuration || 60,
    suggestedPrice: info?.suggestedPrice || { min: 50, max: 150 }
  };
}

// Alias for useService
export const useServiceById = useService;

export default useServices;
