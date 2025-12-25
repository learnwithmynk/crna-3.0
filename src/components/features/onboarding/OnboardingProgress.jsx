/**
 * OnboardingProgress
 *
 * Progress bar for onboarding flow.
 * Uses endowed progress effect (starts at 10%) to create momentum.
 */

import { cn } from '@/lib/utils';

export default function OnboardingProgress({ progress = 10, className }) {
  return (
    <div className={cn('w-full', className)}>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
