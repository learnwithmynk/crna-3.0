/**
 * useLessonAccess Hook
 *
 * Check if the current user can access a lesson based on entitlements.
 * Lessons can have their own entitlements or inherit from their parent module.
 */

import { useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';

/**
 * Hook to check if user has access to a lesson
 * @param {Object} lesson - Lesson object with accessible_via array
 * @param {Object} module - Parent module object with accessible_via array
 * @returns {Object} Access status and required entitlements
 */
export function useLessonAccess(lesson, module) {
  const { user } = useAuth();

  const accessInfo = useMemo(() => {
    // If no lesson provided, no access check needed
    if (!lesson) {
      return {
        hasAccess: false,
        isLoading: true,
        requiredEntitlements: [],
        userEntitlements: [],
      };
    }

    // Get user's entitlements (from Supabase user metadata or context)
    const userEntitlements = user?.entitlements || user?.user_metadata?.entitlements || [];

    // Determine required entitlements:
    // 1. Use lesson's accessible_via if it has entries
    // 2. Otherwise, inherit from module
    const lessonEntitlements = lesson.accessible_via || [];
    const moduleEntitlements = module?.accessible_via || [];

    const requiredEntitlements =
      lessonEntitlements.length > 0 ? lessonEntitlements : moduleEntitlements;

    // If no entitlements required, everyone has access
    if (requiredEntitlements.length === 0) {
      return {
        hasAccess: true,
        isLoading: false,
        requiredEntitlements: [],
        userEntitlements,
        accessReason: 'public',
      };
    }

    // Check if user has any of the required entitlements
    const hasAccess = requiredEntitlements.some((entitlement) =>
      userEntitlements.includes(entitlement)
    );

    // Find which entitlement grants access (for UI display)
    const matchingEntitlement = requiredEntitlements.find((entitlement) =>
      userEntitlements.includes(entitlement)
    );

    return {
      hasAccess,
      isLoading: false,
      requiredEntitlements,
      userEntitlements,
      matchingEntitlement,
      accessReason: hasAccess ? 'entitlement' : 'none',
      inheritedFromModule: lessonEntitlements.length === 0 && moduleEntitlements.length > 0,
    };
  }, [lesson, module, user]);

  return accessInfo;
}

/**
 * Check access for multiple lessons at once
 * Useful for rendering lesson lists with lock icons
 * @param {Array} lessons - Array of lesson objects
 * @param {Object} module - Parent module object
 * @returns {Map} Map of lesson ID to access status
 */
export function useLessonsAccess(lessons, module) {
  const { user } = useAuth();

  const accessMap = useMemo(() => {
    const map = new Map();

    if (!lessons?.length) return map;

    const userEntitlements = user?.entitlements || user?.user_metadata?.entitlements || [];
    const moduleEntitlements = module?.accessible_via || [];

    lessons.forEach((lesson) => {
      const lessonEntitlements = lesson.accessible_via || [];
      const requiredEntitlements =
        lessonEntitlements.length > 0 ? lessonEntitlements : moduleEntitlements;

      const hasAccess =
        requiredEntitlements.length === 0 ||
        requiredEntitlements.some((e) => userEntitlements.includes(e));

      map.set(lesson.id, {
        hasAccess,
        requiredEntitlements,
        isLocked: !hasAccess,
      });
    });

    return map;
  }, [lessons, module, user]);

  return accessMap;
}

export default useLessonAccess;
