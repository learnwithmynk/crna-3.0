/**
 * HelpNeededScreen
 *
 * Path B screen with icon button grid for selecting help areas.
 * Maps to primaryFocusAreas in Guidance Engine.
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  PenLine,
  FileText,
  Mic2,
  Mail,
  ClipboardList,
  HelpCircle,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import EducationalInsightCard from '../EducationalInsightCard';
import { getHelpNeededContext } from '@/lib/onboarding/getEducationalContext';

const HELP_OPTIONS = [
  {
    id: 'essay',
    label: 'Essay',
    description: 'Personal statement help',
    icon: PenLine,
  },
  {
    id: 'resume',
    label: 'Resume',
    description: 'CV building',
    icon: FileText,
  },
  {
    id: 'interview_prep',
    label: 'Interview',
    description: 'Mock interviews',
    icon: Mic2,
  },
  {
    id: 'lor',
    label: 'Letters of Rec',
    description: 'LOR management',
    icon: Mail,
  },
  {
    id: 'logistics',
    label: 'Application',
    description: 'Logistics & deadlines',
    icon: ClipboardList,
  },
  {
    id: 'other',
    label: 'Other',
    description: 'Something else',
    icon: HelpCircle,
  },
];

export default function HelpNeededScreen({ data, updateField, onContinue }) {
  const [selected, setSelected] = useState(data.helpNeeded || []);
  const [showInsight, setShowInsight] = useState(false);

  // Update parent data
  useEffect(() => {
    updateField('helpNeeded', selected);
  }, [selected, updateField]);

  // Show insight after selection
  useEffect(() => {
    if (selected.length > 0) {
      const timer = setTimeout(() => setShowInsight(true), 300);
      return () => clearTimeout(timer);
    } else {
      setShowInsight(false);
    }
  }, [selected.length]);

  // Toggle selection
  const toggleOption = (optionId) => {
    setSelected((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId]
    );
  };

  // Get context
  const context = getHelpNeededContext(selected);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 px-4 py-6">
        {/* Question */}
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          What do you need the most help with?
        </h2>
        <p className="text-gray-600 text-sm mb-6">
          Select all that apply. We'll prioritize these areas for you.
        </p>

        {/* Icon button grid */}
        <div className="grid grid-cols-2 gap-3">
          {HELP_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isSelected = selected.includes(option.id);

            return (
              <button
                key={option.id}
                onClick={() => toggleOption(option.id)}
                className={cn(
                  'relative p-4 rounded-2xl border-2 transition-all duration-200',
                  'flex flex-col items-center justify-center text-center',
                  'min-h-[100px]',
                  isSelected
                    ? 'border-yellow-400 bg-yellow-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                )}
              >
                {/* Checkmark overlay */}
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <div className="w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center">
                      <Check className="h-3 w-3 text-black" />
                    </div>
                  </div>
                )}

                <div
                  className={cn(
                    'p-3 rounded-full mb-2',
                    isSelected ? 'bg-yellow-200' : 'bg-gray-100'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-6 w-6',
                      isSelected ? 'text-yellow-700' : 'text-gray-500'
                    )}
                  />
                </div>
                <div className="font-medium text-gray-900">{option.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{option.description}</div>
              </button>
            );
          })}
        </div>

        {/* Educational insight */}
        {showInsight && context?.educational && (
          <div className="mt-6">
            <EducationalInsightCard
              title="We'll help you with this"
              message={context.educational}
              show={true}
              variant="positive"
            />
          </div>
        )}

        {/* Skip option */}
        {selected.length === 0 && (
          <button
            onClick={onContinue}
            className="w-full mt-6 text-center text-sm text-gray-500 hover:text-gray-700 py-2"
          >
            Skip - I'll figure it out as I go
          </button>
        )}
      </div>

      {/* Sticky footer */}
      <div className="sticky bottom-0 p-4 bg-white border-t border-gray-100">
        <Button onClick={onContinue} className="w-full h-12 text-base font-semibold">
          {selected.length > 0 ? 'Continue' : 'Skip for Now'}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        <p className="text-xs text-center text-gray-400 mt-2">
          {selected.length > 0 ? '+3 points' : '+2 points'}
        </p>
      </div>
    </div>
  );
}
