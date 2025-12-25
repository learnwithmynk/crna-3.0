/**
 * ApplicationStepIndicator Component
 *
 * Visual progress indicator for the 5-step provider application.
 * Shows current step, completed steps, and remaining steps.
 */

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = [
  { number: 1, label: 'Eligibility' },
  { number: 2, label: 'Basic Info' },
  { number: 3, label: 'Program' },
  { number: 4, label: 'Services' },
  { number: 5, label: 'Terms' }
];

export function ApplicationStepIndicator({ currentStep, completedSteps = [], className }) {
  return (
    <div className={cn('w-full', className)}>
      {/* Desktop - Horizontal */}
      <div className="hidden sm:flex items-center justify-between">
        {STEPS.map((step, index) => {
          const isCompleted = completedSteps.includes(step.number);
          const isCurrent = currentStep === step.number;
          const isUpcoming = step.number > currentStep;

          return (
            <div key={step.number} className="flex items-center flex-1">
              {/* Step circle */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors',
                    isCompleted && 'bg-green-500 text-white',
                    isCurrent && 'bg-primary text-black ring-4 ring-primary/20',
                    isUpcoming && 'bg-gray-200 text-gray-500'
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    step.number
                  )}
                </div>
                <span
                  className={cn(
                    'mt-2 text-xs font-medium',
                    isCompleted && 'text-green-600',
                    isCurrent && 'text-primary',
                    isUpcoming && 'text-gray-400'
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-1 mx-2 rounded',
                    completedSteps.includes(step.number + 1) || currentStep > step.number
                      ? 'bg-green-500'
                      : currentStep === step.number + 1
                      ? 'bg-gradient-to-r from-green-500 to-gray-200'
                      : 'bg-gray-200'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile - Compact */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Step {currentStep} of {STEPS.length}
          </span>
          <span className="text-sm text-gray-500">
            {STEPS.find(s => s.number === currentStep)?.label}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className={cn(
                'w-2 h-2 rounded-full',
                step.number <= currentStep ? 'bg-primary' : 'bg-gray-300'
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ApplicationStepIndicator;
