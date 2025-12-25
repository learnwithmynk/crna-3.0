/**
 * ProtectedRoute Component (Entitlement-based)
 *
 * Wraps pages that require specific entitlements to access.
 * Different from /src/components/auth/ProtectedRoute.jsx which only checks authentication.
 * This component checks both authentication AND resource access permissions.
 *
 * Usage:
 * <ProtectedRoute resourceSlug="school-explorer">
 *   <SchoolExplorerPage />
 * </ProtectedRoute>
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useResourceAccess } from '@/hooks/useResourceAccess';
import { UpgradeCard } from '@/components/ui/UpgradeCard';

export function ProtectedRoute({
  resourceSlug,
  children,
  requireAuth = true
}) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { hasAccess, isLoading: accessLoading, denyBehavior } = useResourceAccess(resourceSlug);
  const location = useLocation();

  // Show loading spinner while checking auth and access
  const isLoading = authLoading || accessLoading;
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // Check authentication first (if required)
  if (requireAuth && !isAuthenticated) {
    // Save the attempted URL for redirecting after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check resource access
  if (!hasAccess) {
    // Handle different deny behaviors
    switch (denyBehavior) {
      case 'redirect':
        // Redirect to upgrade page
        return <Navigate to="/upgrade" state={{ from: location }} replace />;

      case 'upgrade_prompt':
        // Show upgrade prompt page
        return (
          <div className="container max-w-2xl mx-auto py-12 px-4">
            <UpgradeCard
              variant="default"
              title="Premium Feature"
              description="This feature is available to CRNA Club members. Start your free trial to get instant access."
            />
          </div>
        );

      case 'blur':
        // Show blurred content with overlay
        return (
          <div className="relative min-h-screen">
            <div className="blur-sm pointer-events-none select-none" aria-hidden="true">
              {children}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="container max-w-2xl mx-auto px-4">
                <UpgradeCard
                  variant="default"
                  title="Unlock This Feature"
                  description="Upgrade to access this content and unlock your full potential."
                />
              </div>
            </div>
          </div>
        );

      case 'hide':
      default:
        // Redirect to upgrade page by default when hiding
        return <Navigate to="/upgrade" state={{ from: location }} replace />;
    }
  }

  // User has access, render the protected content
  return children;
}

export default ProtectedRoute;
