/**
 * FeatureGate Component
 *
 * Wraps features/widgets that need access control.
 * Handles different deny behaviors: hide, blur, or show upgrade prompt.
 * Shows preview mode indicators for admins.
 */

import { useResourceAccess } from '@/hooks/useResourceAccess';
import { usePreviewMode } from '@/hooks/usePreviewMode';
import { UpgradeCard } from '@/components/ui/UpgradeCard';
import { Skeleton } from '@/components/ui/skeleton';

export function FeatureGate({
  slug,
  children,
  fallback = null,
  showSkeleton = true,
  denyBehavior = 'hide', // 'hide', 'blur', 'upgrade_prompt'
  className = '',
}) {
  const { hasAccess, isLoading, denyBehavior: computedDenyBehavior } = useResourceAccess(slug);
  const { isPreviewMode } = usePreviewMode();

  // Use computed deny behavior if not explicitly provided
  const effectiveDenyBehavior = denyBehavior || computedDenyBehavior;

  // Show skeleton while loading (if enabled)
  if (isLoading && showSkeleton) {
    return (
      <div className={className}>
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  // If loading without skeleton, show nothing
  if (isLoading) {
    return null;
  }

  // If has access, render children with optional preview indicator
  if (hasAccess) {
    return (
      <div className={`${className} ${isPreviewMode ? 'preview-mode-content' : ''}`}>
        {isPreviewMode && (
          <div className="mb-2 px-2 py-1 bg-yellow-100 border border-yellow-300 rounded text-xs text-yellow-800">
            Preview Mode: {slug}
          </div>
        )}
        {children}
      </div>
    );
  }

  // Handle deny behaviors based on access denial
  switch (effectiveDenyBehavior) {
    case 'hide':
      return fallback || null;

    case 'blur':
      return (
        <div className={`relative ${className}`}>
          <div className="blur-sm pointer-events-none select-none" aria-hidden="true">
            {children}
          </div>
          <UpgradeCard
            variant="overlay"
            title="Unlock This Feature"
            description="Upgrade to access this content"
          />
        </div>
      );

    case 'upgrade_prompt':
      return (
        <div className={className}>
          {fallback || (
            <UpgradeCard
              variant="default"
              title="Premium Feature"
              description="This feature is available to CRNA Club members. Start your free trial to get instant access."
            />
          )}
        </div>
      );

    default:
      return fallback || null;
  }
}

export default FeatureGate;
