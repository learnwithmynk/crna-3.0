/**
 * OnboardingWidget - Dashboard Getting Started Checklist
 *
 * Shows a checklist of 5 onboarding steps for new users to complete.
 * Displayed on the Dashboard after the modal onboarding flow.
 *
 * Steps:
 * 1. Complete your profile (20 pts)
 * 2. Save your first program (5 pts)
 * 3. Log your first clinical entry (2 pts)
 * 4. Complete your first lesson (3 pts)
 * 5. Introduce yourself (2 pts)
 *
 * Total: 32 points - gets users to Level 2!
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Check, Sparkles, X, ChevronRight, PartyPopper } from 'lucide-react';
import { useOnboardingSteps } from '@/hooks/useOnboardingSteps';
import { LabelText } from '@/components/ui/label-text';
import { cn } from '@/lib/utils';

export function OnboardingWidget({ className }) {
  const {
    steps,
    completedCount,
    totalCount,
    progress,
    totalPoints,
    earnedPoints,
    allCompleted,
    isDismissed,
    dismissWidget,
  } = useOnboardingSteps();

  // Don't render if dismissed or all completed (auto-hides after celebration)
  if (isDismissed) {
    return null;
  }

  // Celebration state when all complete
  if (allCompleted) {
    return (
      <div className={cn('bg-green-50 rounded-3xl shadow-sm', className)}>
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
              <PartyPopper className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-green-800 mb-1">
                Onboarding Complete!
              </h3>
              <p className="text-green-700 mb-3">
                You've earned {totalPoints} points. You're ready to crush your
                CRNA goals!
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={dismissWidget}
                className="border-0 bg-green-100 text-green-700 hover:bg-green-200"
              >
                Got it!
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('relative rounded-[2.5rem] overflow-visible', className)}>
      {/* Subtle warm glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-br from-amber-200/30 via-orange-200/25 to-amber-300/30 rounded-4xl blur-lg -z-10" />

      {/* White card with gradient border effect */}
      <div className="relative bg-white rounded-[2.5rem] shadow-lg border border-amber-200/40 overflow-hidden">
        {/* Header */}
        <div className="px-5 pt-5 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-sm">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Get Started</h3>
            </div>
            <div className="flex items-center gap-2">
              <LabelText size="base">
                {completedCount}/{totalCount} complete
              </LabelText>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-300 hover:text-gray-500"
                onClick={dismissWidget}
                aria-label="Dismiss onboarding"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Task list - no inner card, just dividers */}
        <div className="divide-y divide-gray-100">
          {steps.map((step) => (
            <Link
              key={step.id}
              to={step.link}
              className={cn(
                'flex items-center gap-4 px-5 py-4 transition-colors',
                step.completed
                  ? 'opacity-50'
                  : 'hover:bg-gray-50 active:bg-gray-100'
              )}
            >
              {/* Empty circle checkbox */}
              <div
                className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center shrink-0',
                  step.completed
                    ? 'bg-green-500 text-white'
                    : 'border-2 border-gray-300'
                )}
              >
                {step.completed && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
              </div>

              {/* Step info */}
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    'font-bold text-base text-gray-900',
                    step.completed && 'line-through text-gray-400'
                  )}
                >
                  {step.title}
                </p>
                <p className="text-sm text-gray-400 mt-0.5">
                  {step.description}
                </p>
              </div>

              {/* Points badge with light pink pill background */}
              <span
                className={cn(
                  'text-sm font-semibold shrink-0 px-2 py-0.5 rounded-full',
                  step.completed
                    ? 'text-green-600 bg-green-50'
                    : 'text-amber-600 bg-amber-50'
                )}
              >
                +{step.points} pts
              </span>

              {/* Chevron */}
              <ChevronRight className="w-5 h-5 shrink-0 text-gray-300" />
            </Link>
          ))}
        </div>

        {/* Points summary footer */}
        <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
          <LabelText size="base" className="font-semibold">Points earned</LabelText>
          <span className="text-base font-bold text-gray-900">
            {earnedPoints} / {totalPoints}
          </span>
        </div>
      </div>
    </div>
  );
}

export default OnboardingWidget;
