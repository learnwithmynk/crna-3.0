/**
 * HowItWorksSteps Component
 *
 * Displays the 4-step process for becoming a mentor.
 * Each step can expand on hover/click to show more details.
 */

import { useState } from 'react';
import { FileText, User, Calendar, DollarSign, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = [
  {
    number: 1,
    title: 'Apply',
    subtitle: '5 minutes',
    icon: FileText,
    details: [
      'Fill out a quick application form',
      'Upload your student ID for verification',
      'Enter your RN license number',
      'Tell us why you want to mentor'
    ]
  },
  {
    number: 2,
    title: 'Set Up Profile',
    subtitle: '15 minutes',
    icon: User,
    details: [
      'Add your bio and personality',
      'Choose your services and prices',
      'Set your availability',
      'Add your Zoom/video call link'
    ]
  },
  {
    number: 3,
    title: 'Accept Bookings',
    subtitle: 'On your schedule',
    icon: Calendar,
    details: [
      'Receive booking requests from applicants',
      'Review their goals and materials',
      'Accept or suggest alternative times',
      '48 hours to respond to requests'
    ]
  },
  {
    number: 4,
    title: 'Get Paid',
    subtitle: 'Every 2 weeks',
    icon: DollarSign,
    details: [
      'Conduct sessions via your video link',
      'Automatic payment collection',
      'Direct deposit to your bank',
      'Track earnings in your dashboard'
    ]
  }
];

function StepCard({ step, isExpanded, onToggle }) {
  const Icon = step.icon;

  return (
    <div
      className={cn(
        'relative bg-white rounded-2xl border-2 transition-all duration-300 cursor-pointer',
        isExpanded
          ? 'border-primary shadow-lg scale-105 z-10'
          : 'border-gray-200 hover:border-primary/50 hover:shadow-md'
      )}
      onClick={onToggle}
    >
      {/* Step number badge */}
      <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary text-black font-bold rounded-full flex items-center justify-center text-sm shadow-md">
        {step.number}
      </div>

      <div className="p-5">
        {/* Icon and title */}
        <div className="flex items-center gap-3 mb-2">
          <div className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center transition-colors',
            isExpanded ? 'bg-primary/20' : 'bg-gray-100'
          )}>
            <Icon className={cn(
              'w-6 h-6',
              isExpanded ? 'text-primary' : 'text-gray-600'
            )} />
          </div>
          <div>
            <h3 className="font-bold text-lg">{step.title}</h3>
            <p className="text-sm text-gray-500">{step.subtitle}</p>
          </div>
        </div>

        {/* Expand indicator */}
        <div className="flex justify-center mt-2">
          <ChevronDown className={cn(
            'w-5 h-5 text-gray-400 transition-transform',
            isExpanded && 'rotate-180'
          )} />
        </div>

        {/* Expanded details */}
        <div className={cn(
          'overflow-hidden transition-all duration-300',
          isExpanded ? 'max-h-48 mt-4 opacity-100' : 'max-h-0 opacity-0'
        )}>
          <ul className="space-y-2">
            {step.details.map((detail, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                {detail}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function HowItWorksSteps({ className }) {
  const [expandedStep, setExpandedStep] = useState(null);

  const handleToggle = (stepNumber) => {
    setExpandedStep(prev => prev === stepNumber ? null : stepNumber);
  };

  return (
    <div className={cn('', className)}>
      {/* Desktop: Horizontal layout with arrows */}
      <div className="hidden md:flex items-start justify-center gap-4">
        {STEPS.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="w-56">
              <StepCard
                step={step}
                isExpanded={expandedStep === step.number}
                onToggle={() => handleToggle(step.number)}
              />
            </div>
            {index < STEPS.length - 1 && (
              <div className="mx-2 text-gray-300 text-2xl font-light">→</div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile: Vertical layout */}
      <div className="md:hidden space-y-4">
        {STEPS.map((step, index) => (
          <div key={step.number}>
            <StepCard
              step={step}
              isExpanded={expandedStep === step.number}
              onToggle={() => handleToggle(step.number)}
            />
            {index < STEPS.length - 1 && (
              <div className="flex justify-center my-2">
                <div className="text-gray-300 text-2xl">↓</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default HowItWorksSteps;
