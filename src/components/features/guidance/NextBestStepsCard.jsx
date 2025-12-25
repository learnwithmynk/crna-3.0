/**
 * NextBestStepsCard - Container for Smart Steps guidance
 *
 * Displays 0-3 prioritized action steps from the Guidance Engine.
 * When 0 steps qualify, shows AffirmationState (positive feedback).
 *
 * NEW: Soft lavender gradient design with glassmorphism
 *
 * Props:
 * - steps: NextBestStep[] (0-3 items from guidanceState.nextBestSteps)
 * - supportMode: SupportMode (for affirmation tone)
 * - onDismiss: (stepId: string) => void (optional)
 * - onStepClick: (stepId: string, href: string) => void (optional, for telemetry)
 * - compact: boolean (mobile mode - shows only 1 step)
 *
 * See /docs/skills/guidance-engine-spec.md for full specification.
 */

import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { AffirmationState } from './AffirmationState';
import { NextBestStepItem } from './NextBestStepItem';

export function NextBestStepsCard({
  steps = [],
  supportMode,
  onDismiss,
  onStepClick,
  compact = false,
}) {
  // 0 steps = affirmation state (user is on track)
  if (steps.length === 0) {
    return <AffirmationState supportMode={supportMode} />;
  }

  // Compact mode: show only first step
  const displaySteps = compact ? steps.slice(0, 1) : steps;

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-50 overflow-hidden">
      {/* Header */}
      <div className="px-8 pt-8 pb-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-200 to-purple-100">
            <Sparkles className="w-6 h-6 text-purple-700" />
          </div>
          <span className="bg-gradient-to-r from-purple-700 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Smart Steps
          </span>
        </h3>
      </div>

      {/* Steps list with numbered circles */}
      <div className="px-8 pb-8 pt-4 space-y-6">
        {displaySteps.map((step, index) => (
          <NextBestStepItem
            key={step.stepId}
            step={step}
            stepNumber={index + 1}
            onDismiss={onDismiss ? () => onDismiss(step.stepId) : undefined}
            onComplete={
              onStepClick
                ? () => onStepClick(step.stepId, step.cta?.href ?? step.href)
                : undefined
            }
          />
        ))}
      </div>

      {/* "View all" link when compact and more steps exist */}
      {compact && steps.length > 1 && (
        <div className="px-6 pb-6">
          <Link
            to="/dashboard"
            className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
          >
            View all {steps.length} steps →
          </Link>
        </div>
      )}
    </div>
  );
}

export default NextBestStepsCard;
