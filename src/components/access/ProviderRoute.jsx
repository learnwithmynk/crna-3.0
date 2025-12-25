/**
 * ProviderRoute Component
 *
 * Wraps routes that require approved provider status.
 * Redirects to login if not authenticated.
 * Redirects to application status page if not approved provider.
 * Optionally checks entitlements via resourceSlug prop.
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProviderStatus } from '@/hooks/useProviderStatus';

export function ProviderRoute({ children, resourceSlug = null }) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { isApprovedProvider, isLoading: providerLoading } = useProviderStatus();
  const location = useLocation();

  const isLoading = authLoading || providerLoading;

  // Show loading spinner while checking auth and provider status
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to application status if not approved provider
  if (!isApprovedProvider) {
    return <Navigate to="/marketplace/provider/application-status" replace />;
  }

  // TODO: Add entitlement check if resourceSlug is provided
  // This would require a useResourceAccess hook to be implemented

  return children;
}

export default ProviderRoute;
