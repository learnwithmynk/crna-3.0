/**
 * TimelineScreen
 *
 * Critical branching point that determines the user's path (A/B/C).
 * Shows immediate insight after selection to prove personalization.
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, Target, PartyPopper, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const TIMELINE_OPTIONS = [
  {
    id: 'exploring_18_plus',
    label: 'More than 18 months out',
    sublabel: 'Just starting to learn about CRNA',
    icon: Calendar,
    path: 'A',
    insight: {
      title: 'Foundation Mode activated',
      message: "You have time to build strategically. We'll help you develop a strong foundation across all areas of your application.",
    },
  },
  {
    id: 'strategizing_6_18',
    label: '6-18 months out',
    sublabel: 'Researching programs and building experience',
    icon: Calendar,
    path: 'A',
    insight: {
      title: 'Strategy Mode activated',
      message: "This is the sweet spot for planning. We'll help you identify gaps and prioritize what matters most.",
    },
  },
  {
    id: 'applying_soon',
    label: 'Less than 6 months',
    sublabel: 'Getting ready to submit applications',
    icon: Target,
    path: 'B',
    insight: {
      title: 'Execution Mode activated',
      message: "Time to focus. We'll create checklists for your target programs and keep you on track for deadlines.",
    },
  },
  {
    id: 'actively_applying',
    label: 'Currently applying',
    sublabel: 'Applications in progress or submitted',
    icon: Target,
    path: 'B',
    insight: {
      title: 'Execution Mode activated',
      message: "Let's get organized. We'll track your applications and make sure nothing falls through the cracks.",
    },
  },
  {
    id: 'accepted',
    label: 'Already accepted!',
    sublabel: 'Heading to CRNA school',
    icon: PartyPopper,
    path: 'C',
    insight: {
      title: 'Congratulations!',
      message: "Amazing achievement! Let's set up your account - you might want to mentor future applicants or connect with your new cohort.",
    },
  },
];

export default function TimelineScreen({ data, updateField, onContinue }) {
  const [selected, setSelected] = useState(data.timeline);
  const [showInsight, setShowInsight] = useState(false);

  // Show insight when selection changes
  useEffect(() => {
    if (selected) {
      setShowInsight(false);
      const timer = setTimeout(() => setShowInsight(true), 100);
      return () => clearTimeout(timer);
    }
  }, [selected]);

  const handleSelect = (optionId) => {
    setSelected(optionId);
    updateField('timeline', optionId);
  };

  const selectedOption = TIMELINE_OPTIONS.find((opt) => opt.id === selected);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 px-4 py-6">
        {/* Question */}
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          When are you planning to apply to CRNA school?
        </h2>
        <p className="text-gray-600 text-sm mb-6">
          This helps us personalize your experience.
        </p>

        {/* Options */}
        <div className="space-y-3">
          {TIMELINE_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isSelected = selected === option.id;

            return (
              <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                className={cn(
                  'w-full p-4 rounded-2xl border-2 transition-all duration-200 text-left',
                  'flex items-center gap-4',
                  'min-h-[72px]', // Touch target
                  isSelected
                    ? 'border-yellow-400 bg-yellow-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                )}
              >
                <div
                  className={cn(
                    'p-2 rounded-full flex-shrink-0',
                    isSelected ? 'bg-yellow-200' : 'bg-gray-100'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-5 w-5',
                      isSelected ? 'text-yellow-700' : 'text-gray-500'
                    )}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900">{option.label}</div>
                  <div className="text-sm text-gray-500">{option.sublabel}</div>
                </div>
                {isSelected && (
                  <CheckCircle2 className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Insight card - appears after selection */}
        {selectedOption && showInsight && (
          <div
            className={cn(
              'mt-6 p-4 rounded-2xl bg-yellow-50 border border-yellow-200',
              'animate-in fade-in slide-in-from-bottom-2 duration-300'
            )}
          >
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-full bg-yellow-200 flex-shrink-0">
                <CheckCircle2 className="h-4 w-4 text-yellow-700" />
              </div>
              <div>
                <div className="font-medium text-yellow-900 mb-1">
                  {selectedOption.insight.title}
                </div>
                <p className="text-sm text-yellow-800">
                  {selectedOption.insight.message}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sticky footer */}
      <div className="sticky bottom-0 p-4 bg-white border-t border-gray-100">
        <Button
          onClick={onContinue}
          disabled={!selected}
          className="w-full h-12 text-base font-semibold"
        >
          Continue
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        <p className="text-xs text-center text-gray-400 mt-2">+2 points</p>
      </div>
    </div>
  );
}
