/**
 * LessonPaywall Component
 *
 * Displayed when a user doesn't have access to a module or lesson.
 * Shows lock icon, message, and CTAs for upgrading.
 *
 * Used in: ModuleDetailPage, LessonPage
 */

import { Link } from 'react-router-dom';
import { Lock, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

/**
 * @param {Object} props
 * @param {string} props.title - Title of the locked content
 * @param {Array} props.requiredEntitlements - List of entitlements needed
 * @param {string} props.variant - Display variant: 'card', 'inline', 'fullscreen'
 * @param {string} props.className - Additional classes
 */
export function LessonPaywall({
  title,
  requiredEntitlements = [],
  variant = 'card',
  className,
}) {
  // Map entitlement slugs to display names
  const entitlementNames = {
    active_membership: 'CRNA Club Membership',
    plan_apply_toolkit: 'Plan+Apply Toolkit',
    interviewing_toolkit: 'Interviewing Toolkit',
  };

  const getEntitlementName = (slug) =>
    entitlementNames[slug] || slug.replace(/_/g, ' ');

  if (variant === 'inline') {
    return (
      <div
        className={cn(
          'flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200',
          className
        )}
      >
        <div className="p-2 bg-gray-100 rounded-full">
          <Lock className="w-5 h-5 text-gray-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-600">
            This content requires{' '}
            <span className="font-medium">
              {requiredEntitlements.length > 0
                ? getEntitlementName(requiredEntitlements[0])
                : 'a membership'}
            </span>
          </p>
        </div>
        <Button size="sm" asChild>
          <Link to="/pricing">Upgrade</Link>
        </Button>
      </div>
    );
  }

  if (variant === 'fullscreen') {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center min-h-[60vh] text-center px-4',
          className
        )}
      >
        <div className="p-4 bg-gray-100 rounded-full mb-6">
          <Lock className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {title || 'Content Locked'}
        </h2>
        <p className="text-gray-600 max-w-md mb-8">
          This module requires a membership to access. Upgrade to unlock all
          learning content, tools, and community features.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button size="lg" asChild>
            <Link to="/pricing" className="gap-2">
              <Sparkles className="w-5 h-5" />
              Start Free Trial
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/pricing">View Plans</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Default: card variant
  return (
    <Card className={cn('p-6 text-center', className)}>
      <div className="p-3 bg-gray-100 rounded-full w-fit mx-auto mb-4">
        <Lock className="w-8 h-8 text-gray-400" />
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title ? `Unlock "${title}"` : 'Module Locked'}
      </h3>

      <p className="text-gray-600 mb-6 max-w-sm mx-auto">
        {requiredEntitlements.length > 0 ? (
          <>
            This content requires{' '}
            <span className="font-medium">
              {getEntitlementName(requiredEntitlements[0])}
            </span>
            . Upgrade to unlock all lessons and resources.
          </>
        ) : (
          'This module requires a membership to access. Upgrade to unlock all learning content.'
        )}
      </p>

      {/* Benefits list */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
        <p className="text-sm font-medium text-gray-700 mb-3">
          With your membership, you get:
        </p>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            Unlimited access to all learning modules
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            Downloadable resources and templates
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            Community forums and group coaching
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            Track your progress with smart tools
          </li>
        </ul>
      </div>

      {/* CTAs */}
      <div className="flex flex-col gap-3">
        <Button size="lg" className="w-full" asChild>
          <Link to="/pricing" className="gap-2">
            <Sparkles className="w-5 h-5" />
            Start 7-Day Free Trial
          </Link>
        </Button>
        <Button variant="ghost" size="sm" className="text-gray-500" asChild>
          <Link to="/pricing" className="gap-1">
            View all plans
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </Card>
  );
}

/**
 * Overlay paywall for blurred content preview
 */
export function PaywallOverlay({ title, className }) {
  return (
    <div
      className={cn(
        'absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10',
        className
      )}
    >
      <LessonPaywall title={title} variant="card" />
    </div>
  );
}

export default LessonPaywall;
