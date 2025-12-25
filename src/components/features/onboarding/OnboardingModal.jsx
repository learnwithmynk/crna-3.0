/**
 * OnboardingModal
 *
 * Full-screen modal for first-login onboarding questionnaire.
 * Mobile-first design with dynamic branching based on user's application timeline.
 *
 * Paths:
 * - Path A (Foundation): 6+ months from applying - thorough data collection
 * - Path B (Execution): < 6 months / actively applying - focused on targets
 * - Path C (Accepted): Already accepted - transition flow
 */

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowLeft, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

import OnboardingProgress from './OnboardingProgress';
import { useOnboardingFlow } from './hooks/useOnboardingFlow';

// Screen imports
import WelcomeScreen from './screens/WelcomeScreen';
import TimelineScreen from './screens/TimelineScreen';
import IcuExperienceScreen from './screens/IcuExperienceScreen';
import ShadowingScreen from './screens/ShadowingScreen';
import CertificationsScreen from './screens/CertificationsScreen';
import GreScreen from './screens/GreScreen';
import SchoolsInterestScreen from './screens/SchoolsInterestScreen';
import TargetSchoolsScreen from './screens/TargetSchoolsScreen';
import QuickSnapshotScreen from './screens/QuickSnapshotScreen';
import HelpNeededScreen from './screens/HelpNeededScreen';
import AcceptanceScreen from './screens/AcceptanceScreen';
import ApplyingMoreScreen from './screens/ApplyingMoreScreen';
import SummaryScreen from './screens/SummaryScreen';

// Map screen names to components
const SCREEN_COMPONENTS = {
  welcome: WelcomeScreen,
  timeline: TimelineScreen,
  'icu-experience': IcuExperienceScreen,
  shadowing: ShadowingScreen,
  certifications: CertificationsScreen,
  gre: GreScreen,
  'schools-interest': SchoolsInterestScreen,
  'target-schools': TargetSchoolsScreen,
  'quick-snapshot': QuickSnapshotScreen,
  'help-needed': HelpNeededScreen,
  acceptance: AcceptanceScreen,
  'applying-more': ApplyingMoreScreen,
  summary: SummaryScreen,
};

export default function OnboardingModal({
  open,
  onOpenChange,
  onComplete,
  onSkip,
  initialData = {},
}) {
  const flow = useOnboardingFlow(initialData);
  const [isSkipConfirmOpen, setIsSkipConfirmOpen] = useState(false);

  const {
    currentScreen,
    screenIndex,
    data,
    progress,
    isLastScreen,
    goNext,
    goBack,
    updateField,
    updateFields,
    pointsEarned,
  } = flow;

  // Get current screen component
  const ScreenComponent = SCREEN_COMPONENTS[currentScreen];

  // Handle completion
  const handleComplete = () => {
    if (onComplete) {
      onComplete(data);
    }
    onOpenChange(false);
  };

  // Handle skip
  const handleSkip = () => {
    if (onSkip) {
      onSkip(data, currentScreen);
    }
    onOpenChange(false);
  };

  // Can go back (not on welcome screen)
  const canGoBack = screenIndex > 0 && currentScreen !== 'summary';

  // Show skip option (not on welcome or summary)
  const showSkipOption = currentScreen !== 'welcome' && currentScreen !== 'summary';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          // Full screen on mobile, max-width on desktop
          'fixed inset-0 sm:inset-auto',
          'sm:left-[50%] sm:top-[50%] sm:translate-x-[-50%] sm:translate-y-[-50%]',
          'sm:max-w-lg sm:max-h-[90vh] sm:rounded-3xl',
          'w-full h-full sm:h-auto',
          'p-0 gap-0',
          'flex flex-col',
          'overflow-hidden'
        )}
        // Prevent closing on overlay click
        onInteractOutside={(e) => e.preventDefault()}
        // Hide the default close button
        hideCloseButton
        // Disable focus trap to avoid React 19 + Radix infinite loop
        modal={false}
        // Allow clicks through the overlay to sidebar
        allowClickThrough
      >
        {/* Accessible title for screen readers */}
        <VisuallyHidden>
          <DialogTitle>CRNA Club Onboarding</DialogTitle>
        </VisuallyHidden>

        {/* Header with progress */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
          <div className="flex items-center justify-between px-4 py-3">
            {/* Back button or spacer */}
            <div className="w-10">
              {canGoBack && (
                <button
                  onClick={goBack}
                  className="p-2 -ml-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Go back"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Points indicator */}
            <div className="text-sm font-medium text-yellow-600">
              +{pointsEarned} pts
            </div>

            {/* Skip button */}
            <div className="w-10">
              {showSkipOption && (
                <button
                  onClick={() => setIsSkipConfirmOpen(true)}
                  className="p-2 -mr-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Skip onboarding"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <OnboardingProgress progress={progress} className="px-4 pb-3" />
        </div>

        {/* Screen content */}
        <div className="flex-1 overflow-y-auto">
          {ScreenComponent && (
            <ScreenComponent
              data={data}
              updateField={updateField}
              updateFields={updateFields}
              onContinue={isLastScreen ? handleComplete : goNext}
              onBack={goBack}
              pointsEarned={pointsEarned}
            />
          )}
        </div>

        {/* Skip confirmation dialog */}
        {isSkipConfirmOpen && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4 z-20">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
              <h3 className="text-lg font-semibold mb-2">Skip for now?</h3>
              <p className="text-gray-600 text-sm mb-4">
                You can complete this later from your dashboard. Some features will be limited until you finish.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsSkipConfirmOpen(false)}
                >
                  Keep Going
                </Button>
                <Button
                  variant="ghost"
                  className="flex-1 text-gray-500"
                  onClick={handleSkip}
                >
                  Skip
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
