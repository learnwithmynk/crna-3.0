/**
 * ApplicationProgressStepper - Visual progress stepper for application workflow
 *
 * Shows the application journey:
 * - If requirements not verified: Review Requirements → In Progress → Submitted → Interview → Decision
 * - If requirements verified: In Progress → Submitted → Interview → Decision
 *
 * Hidden when status is 'denied'
 * Uses subtle warm gradient background
 *
 * Canonical statuses (from canonical-user-model.md):
 * not_started, in_progress, submitted, interview_invite, interview_complete, waitlisted, denied, accepted
 */

import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Check, FileEdit, Send, Users, PartyPopper, ClipboardCheck } from 'lucide-react';

// Base workflow steps (after requirements verified)
const BASE_WORKFLOW_STEPS = [
  {
    id: 'in_progress',
    label: 'In Progress',
    icon: FileEdit,
    statuses: ['in_progress']
  },
  {
    id: 'submitted',
    label: 'Submitted',
    icon: Send,
    statuses: ['submitted']
  },
  {
    id: 'interview',
    label: 'Interview',
    icon: Users,
    statuses: ['interview_invite', 'interview_complete']
  },
  {
    id: 'decision',
    label: 'Decision',
    icon: PartyPopper,
    statuses: ['accepted', 'waitlisted']
  },
];

// Review requirements step (shown first when not verified)
const REVIEW_REQUIREMENTS_STEP = {
  id: 'review_requirements',
  label: 'Review Requirements',
  icon: ClipboardCheck,
  statuses: [] // Special handling - this is always the first step when shown
};

/**
 * Get current step index based on status and steps array
 */
function getStepIndex(status, steps, requirementsVerified) {
  // If requirements not verified, we're at step 0 (review requirements)
  if (!requirementsVerified && steps[0]?.id === 'review_requirements') {
    return 0;
  }

  if (!status || status === 'not_started') return -1;

  for (let i = 0; i < steps.length; i++) {
    if (steps[i].statuses.includes(status)) {
      return i;
    }
  }
  return -1;
}

/**
 * Check if step is completed
 */
function isStepCompleted(stepIndex, currentStepIndex) {
  return stepIndex < currentStepIndex;
}

/**
 * Check if step is current
 */
function isStepCurrent(stepIndex, currentStepIndex) {
  return stepIndex === currentStepIndex;
}

export function ApplicationProgressStepper({ status, requirementsVerified = true }) {
  // Build steps array based on requirements verification status
  const steps = useMemo(() => {
    if (requirementsVerified) {
      return BASE_WORKFLOW_STEPS;
    }
    return [REVIEW_REQUIREMENTS_STEP, ...BASE_WORKFLOW_STEPS];
  }, [requirementsVerified]);

  const currentStepIndex = getStepIndex(status, steps, requirementsVerified);

  // Special case: accepted shows celebration
  const isAccepted = status === 'accepted';
  const isWaitlisted = status === 'waitlisted';

  return (
    <div className="bg-linear-to-r from-amber-50/60 via-orange-50/50 to-rose-50/40 rounded-2xl p-4 md:p-6">
      <div className="flex items-center justify-between relative">
        {/* Progress line background */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 hidden sm:block"
          style={{ left: '10%', right: '10%' }}
        />

        {/* Progress line filled */}
        <div
          className="absolute top-5 h-0.5 bg-amber-400 hidden sm:block transition-all duration-500"
          style={{
            left: '10%',
            width: currentStepIndex >= 0
              ? `${Math.min(currentStepIndex / (steps.length - 1) * 80, 80)}%`
              : '0%'
          }}
        />

        {steps.map((step, index) => {
          const completed = isStepCompleted(index, currentStepIndex);
          const current = isStepCurrent(index, currentStepIndex);
          const StepIcon = step.icon;

          return (
            <div
              key={step.id}
              className="flex flex-col items-center relative z-10 flex-1"
            >
              {/* Step circle */}
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                  completed && "bg-amber-400 text-white",
                  current && !isAccepted && !isWaitlisted && "bg-amber-500 text-white ring-2 ring-amber-400 ring-offset-2",
                  current && isAccepted && "bg-green-500 text-white ring-2 ring-green-400 ring-offset-2",
                  current && isWaitlisted && "bg-amber-600 text-white ring-2 ring-amber-500 ring-offset-2",
                  !completed && !current && "bg-white text-gray-400 border border-gray-200"
                )}
              >
                {completed ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <StepIcon className="w-5 h-5" />
                )}
              </div>

              {/* Step label */}
              <span
                className={cn(
                  "mt-2 text-xs font-medium text-center transition-colors",
                  completed && "text-amber-700",
                  current && "text-gray-900 font-semibold",
                  !completed && !current && "text-gray-500"
                )}
              >
                {step.label}
              </span>

              {/* Current status indicator */}
              {current && (
                <span className={cn(
                  "mt-1 text-xs px-2 py-0.5 rounded-full font-medium",
                  isAccepted && "bg-green-100 text-green-700",
                  isWaitlisted && "bg-amber-100 text-amber-700",
                  step.id === 'review_requirements' && "bg-blue-100 text-blue-700",
                  !isAccepted && !isWaitlisted && step.id !== 'review_requirements' && "bg-amber-100 text-amber-700"
                )}>
                  {step.id === 'review_requirements' && 'Action Needed'}
                  {status === 'interview_invite' && 'Interview Invited'}
                  {status === 'interview_complete' && 'Interview Complete'}
                  {status === 'accepted' && '🎉 Accepted!'}
                  {status === 'waitlisted' && 'Waitlisted'}
                  {step.id !== 'review_requirements' && !['interview_invite', 'interview_complete', 'accepted', 'waitlisted'].includes(status) && 'Current'}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Not started message - only show when requirements are verified but status is not_started */}
      {currentStepIndex === -1 && requirementsVerified && (
        <p className="text-center text-sm text-gray-500 mt-4">
          Update your status to track your application progress
        </p>
      )}
    </div>
  );
}
