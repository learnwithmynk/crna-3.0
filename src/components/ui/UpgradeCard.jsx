/**
 * UpgradeCard Component
 *
 * Displays an upgrade prompt when user doesn't have access to a feature.
 * Used by FeatureGate and other access control components.
 */

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Lock, Sparkles } from 'lucide-react';

export function UpgradeCard({
  title = "Unlock Full Access",
  description = "Join The CRNA Club to access this feature and unlock your full potential.",
  ctaText = "Start Free Trial",
  ctaLink = "/pricing",
  className = "",
  variant = "default" // "default" | "compact" | "overlay"
}) {

  if (variant === "overlay") {
    return (
      <div className={`absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm z-10 ${className}`}>
        <div className="text-center p-6 max-w-md">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-gray-600 mb-4">{description}</p>
          <Button asChild>
            <a href={ctaLink}>
              <Sparkles className="w-4 h-4 mr-2" />
              {ctaText}
            </a>
          </Button>
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={`flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50 ${className}`}>
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
            <Lock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-sm">{title}</p>
            <p className="text-xs text-gray-600">{description}</p>
          </div>
        </div>
        <Button size="sm" asChild>
          <a href={ctaLink}>{ctaText}</a>
        </Button>
      </div>
    );
  }

  // Default variant - full card
  return (
    <Card className={`p-8 text-center ${className}`}>
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
        <Lock className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>
      <Button size="lg" asChild>
        <a href={ctaLink}>
          <Sparkles className="w-4 h-4 mr-2" />
          {ctaText}
        </a>
      </Button>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Get instant access to all features with a 7-day free trial
        </p>
      </div>
    </Card>
  );
}

export default UpgradeCard;
