/**
 * OnboardingProgressWidget Component
 *
 * Visual progress indicator for the provider onboarding flow.
 * Shows 5 steps: Application → Profile → Services → Availability → Stripe
 * Displays current step, completed steps, and "Next: [action]" prompt.
 * Responsive: horizontal on desktop, stacked on mobile.
 */

import { Check, Circle, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const ONBOARDING_STEPS = [
  { number: 1, label: 'Application', shortLabel: 'Apply' },
  { number: 2, label: 'Profile', shortLabel: 'Profile' },
  { number: 3, label: 'Services', shortLabel: 'Services' },
  { number: 4, label: 'Availability', shortLabel: 'Schedule' },
  { number: 5, label: 'Stripe', shortLabel: 'Payment' }
];

const NEXT_ACTIONS = {
  1: 'Complete your application',
  2: 'Build your provider profile',
  3: 'Add your services',
  4: 'Set your availability',
  5: 'Connect Stripe account'
};

export function OnboardingProgressWidget({ currentStep, completedSteps = [], className }) {
  const nextAction = NEXT_ACTIONS[currentStep];
  const isComplete = currentStep > 5;

  return (
    <Card className={cn('border-none shadow-lg bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50', className)}>
      <CardContent className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            {isComplete ? 'Onboarding Complete!' : 'Complete Your Onboarding'}
          </h3>
          {!isComplete && nextAction && (
            <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
              <span className="font-medium text-primary">Next:</span> {nextAction}
            </p>
          )}
        </div>

        {/* Desktop - Horizontal Progress */}
        <div className="hidden md:flex items-center justify-between">
          {ONBOARDING_STEPS.map((step, index) => {
            const isCompleted = completedSteps.includes(step.number);
            const isCurrent = currentStep === step.number;
            const isUpcoming = step.number > currentStep;

            return (
              <div key={step.number} className="flex items-center flex-1">
                {/* Step indicator */}
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      'w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300',
                      isCompleted && 'bg-green-500 text-white shadow-md',
                      isCurrent && 'bg-yellow-400 text-black ring-4 ring-yellow-400/30 scale-110',
                      isUpcoming && 'bg-white border-2 border-gray-300 text-gray-400'
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-6 h-6" />
                    ) : isCurrent ? (
                      <Circle className="w-6 h-6 fill-current" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span
                    className={cn(
                      'mt-2 text-sm font-medium text-center',
                      isCompleted && 'text-green-600',
                      isCurrent && 'text-gray-900',
                      isUpcoming && 'text-gray-400'
                    )}
                  >
                    {step.label}
                  </span>
                </div>

                {/* Connector line with chevron */}
                {index < ONBOARDING_STEPS.length - 1 && (
                  <div className="flex items-center flex-1 px-2">
                    <div
                      className={cn(
                        'flex-1 h-1 rounded transition-all duration-300',
                        completedSteps.includes(step.number + 1) || currentStep > step.number
                          ? 'bg-green-500'
                          : currentStep === step.number
                          ? 'bg-gradient-to-r from-yellow-400 to-gray-300'
                          : 'bg-gray-300'
                      )}
                    />
                    <ChevronRight
                      className={cn(
                        'w-4 h-4 mx-1',
                        completedSteps.includes(step.number + 1) || currentStep > step.number
                          ? 'text-green-500'
                          : currentStep === step.number
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      )}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile - Stacked Progress */}
        <div className="md:hidden">
          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">
                Step {currentStep} of {ONBOARDING_STEPS.length}
              </span>
              <span className="text-xs text-gray-500">
                {Math.round((currentStep / ONBOARDING_STEPS.length) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-yellow-400 to-green-500 h-3 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${(currentStep / ONBOARDING_STEPS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Step list */}
          <div className="space-y-2">
            {ONBOARDING_STEPS.map((step) => {
              const isCompleted = completedSteps.includes(step.number);
              const isCurrent = currentStep === step.number;
              const isUpcoming = step.number > currentStep;

              return (
                <div
                  key={step.number}
                  className={cn(
                    'flex items-center gap-3 p-2 rounded-xl transition-all',
                    isCurrent && 'bg-yellow-100 border border-yellow-300'
                  )}
                >
                  {/* Step icon */}
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0',
                      isCompleted && 'bg-green-500 text-white',
                      isCurrent && 'bg-yellow-400 text-black',
                      isUpcoming && 'bg-gray-200 text-gray-400'
                    )}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : step.number}
                  </div>

                  {/* Step label */}
                  <div className="flex-1">
                    <span
                      className={cn(
                        'text-sm font-medium',
                        isCompleted && 'text-green-600',
                        isCurrent && 'text-gray-900',
                        isUpcoming && 'text-gray-400'
                      )}
                    >
                      {step.label}
                    </span>
                  </div>

                  {/* Status indicator */}
                  {isCompleted && (
                    <span className="text-xs text-green-600 font-medium">Complete</span>
                  )}
                  {isCurrent && (
                    <span className="text-xs text-yellow-700 font-medium">In Progress</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Completion message */}
        {isComplete && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center gap-2 text-green-700">
              <Check className="w-5 h-5" />
              <p className="text-sm font-medium">
                All steps complete! You're ready to start mentoring applicants.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default OnboardingProgressWidget;
