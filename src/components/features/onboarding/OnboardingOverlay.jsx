/**
 * OnboardingOverlay
 *
 * Blurred overlay shown when user has skipped onboarding.
 * Displays a reminder nudge after 24 hours.
 */

import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function OnboardingOverlay({
  isSkipped,
  shouldShowReminder,
  onResumeOnboarding,
  onDismissReminder,
  className,
}) {
  // Don't show if not skipped
  if (!isSkipped) return null;

  return (
    <>
      {/* Reminder nudge (shows after 24h) */}
      {shouldShowReminder && (
        <div
          className={cn(
            'fixed bottom-4 left-4 right-4 z-50 sm:left-auto sm:right-4 sm:max-w-md',
            'animate-in slide-in-from-bottom-4 duration-300',
            className
          )}
        >
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-yellow-100 flex-shrink-0">
                <Sparkles className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 mb-1">
                  Complete your profile setup
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Get personalized recommendations and unlock all features by finishing your profile.
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={onResumeOnboarding}
                    className="flex-1 sm:flex-none"
                  >
                    Complete Setup
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onDismissReminder}
                    className="text-gray-500"
                  >
                    Later
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
