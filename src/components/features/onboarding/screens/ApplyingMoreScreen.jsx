/**
 * ApplyingMoreScreen
 *
 * Path C branching screen - asks if accepted user is still applying elsewhere.
 * If yes, transitions to Path B flow. If no, completes with SRNA transition.
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Target,
  Users,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const OPTIONS = [
  {
    id: 'yes',
    label: 'Yes, still applying to other programs',
    description: "I want to track my other applications",
    icon: Target,
    value: true,
  },
  {
    id: 'no',
    label: "No, I'm done applying",
    description: "I'm ready to transition to SRNA mode",
    icon: Users,
    value: false,
  },
];

export default function ApplyingMoreScreen({ data, updateField, onContinue }) {
  const [selected, setSelected] = useState(data.applyingToMore);

  // Update parent data
  useEffect(() => {
    if (selected !== undefined) {
      updateField('applyingToMore', selected);
    }
  }, [selected, updateField]);

  const handleSelect = (value) => {
    setSelected(value);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 px-4 py-6">
        {/* Question */}
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Are you applying to any other programs?
        </h2>
        <p className="text-gray-600 text-sm mb-6">
          If you're waiting on other decisions, we can help you stay organized.
        </p>

        {/* Options */}
        <div className="space-y-3">
          {OPTIONS.map((option) => {
            const Icon = option.icon;
            const isSelected = selected === option.value;

            return (
              <button
                key={option.id}
                onClick={() => handleSelect(option.value)}
                className={cn(
                  'w-full p-4 rounded-2xl border-2 transition-all duration-200 text-left',
                  'flex items-center gap-4',
                  'min-h-[72px]',
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
                  <div className="text-sm text-gray-500">{option.description}</div>
                </div>
                {isSelected && (
                  <CheckCircle2 className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Context based on selection */}
        {selected !== undefined && (
          <div
            className={cn(
              'mt-6 p-4 rounded-2xl border',
              'animate-in fade-in slide-in-from-bottom-2 duration-300',
              selected ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'
            )}
          >
            {selected ? (
              <p className="text-sm text-blue-800">
                We'll set you up with application tracking for your other programs. You can manage both your acceptance and pending applications.
              </p>
            ) : (
              <p className="text-sm text-green-800">
                Awesome! We'll set up your account for your new journey as an SRNA. You can also become a mentor to help future applicants.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Sticky footer */}
      <div className="sticky bottom-0 p-4 bg-white border-t border-gray-100">
        <Button
          onClick={onContinue}
          disabled={selected === undefined}
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
