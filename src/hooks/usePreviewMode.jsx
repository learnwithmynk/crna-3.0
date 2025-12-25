/**
 * usePreviewMode Hook
 *
 * Context-based hook for "View As" preview mode for access control testing.
 * Allows admins to preview the app with different entitlements without affecting real data.
 *
 * Preview state is stored in URL params for easy sharing and testing.
 * Example: ?preview_as=active_membership,trial_access
 *
 * Usage:
 * 1. Wrap app with <PreviewModeProvider>
 * 2. Use usePreviewMode() hook to access preview state
 * 3. Use startPreview([entitlements]) to enter preview mode
 * 4. Use exitPreview() to return to normal mode
 */

import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PreviewModeContext = createContext(null);

const PREVIEW_PARAM = 'preview_as';

/**
 * Parse entitlements from URL param
 * @param {string} search - URL search string (e.g., "?preview_as=trial_access,active_membership")
 * @returns {string[]} Array of entitlement slugs
 */
function parsePreviewFromUrl(search) {
  const params = new URLSearchParams(search);
  const previewParam = params.get(PREVIEW_PARAM);

  if (!previewParam) return null;

  // Split by comma and filter out empty strings
  return previewParam.split(',').filter(Boolean);
}

/**
 * Update URL with preview entitlements
 * @param {string[]} entitlements - Array of entitlement slugs
 * @param {URLSearchParams} currentParams - Current URL params
 * @returns {string} New search string
 */
function buildPreviewUrl(entitlements, currentParams) {
  const params = new URLSearchParams(currentParams);

  if (!entitlements || entitlements.length === 0) {
    // Remove preview param
    params.delete(PREVIEW_PARAM);
  } else {
    // Set preview param
    params.set(PREVIEW_PARAM, entitlements.join(','));
  }

  const searchString = params.toString();
  return searchString ? `?${searchString}` : '';
}

/**
 * Preview Mode Provider Component
 * Wrap your app with this to enable preview mode functionality
 */
export function PreviewModeProvider({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Parse initial preview state from URL
  const [previewEntitlements, setPreviewEntitlements] = useState(() => {
    return parsePreviewFromUrl(location.search);
  });

  // Sync preview state from URL changes
  useEffect(() => {
    const entitlements = parsePreviewFromUrl(location.search);
    setPreviewEntitlements(entitlements);
  }, [location.search]);

  /**
   * Start preview mode with specified entitlements
   * @param {string[]} entitlements - Array of entitlement slugs
   */
  const startPreview = useCallback((entitlements) => {
    const params = new URLSearchParams(location.search);
    const newSearch = buildPreviewUrl(entitlements, params);

    // Update URL and state
    navigate({
      pathname: location.pathname,
      search: newSearch,
    }, { replace: true });

    setPreviewEntitlements(entitlements);
  }, [location.pathname, location.search, navigate]);

  /**
   * Exit preview mode (return to normal)
   */
  const exitPreview = useCallback(() => {
    const params = new URLSearchParams(location.search);
    const newSearch = buildPreviewUrl(null, params);

    // Update URL and state
    navigate({
      pathname: location.pathname,
      search: newSearch,
    }, { replace: true });

    setPreviewEntitlements(null);
  }, [location.pathname, location.search, navigate]);

  const value = useMemo(() => ({
    isPreviewMode: previewEntitlements !== null,
    previewEntitlements: previewEntitlements || [],
    startPreview,
    exitPreview,
  }), [previewEntitlements, startPreview, exitPreview]);

  return (
    <PreviewModeContext.Provider value={value}>
      {children}
    </PreviewModeContext.Provider>
  );
}

/**
 * Hook to use preview mode context
 * Returns safe defaults if used outside PreviewModeProvider
 */
export function usePreviewMode() {
  const context = useContext(PreviewModeContext);

  // Return safe defaults if no context (e.g., outside router)
  if (!context) {
    return {
      isPreviewMode: false,
      previewEntitlements: [],
      startPreview: () => {},
      exitPreview: () => {},
    };
  }

  return context;
}

export default usePreviewMode;
