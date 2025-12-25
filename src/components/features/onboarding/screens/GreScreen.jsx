/**
 * GreScreen
 *
 * Collects GRE status and optional scores.
 * Part of Path A (Foundation Building) flow.
 */

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ArrowRight, CheckCircle2, GraduationCap, Search, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import EducationalInsightCard from '../EducationalInsightCard';
import { getGreContext } from '@/lib/onboarding/getEducationalContext';

const GRE_OPTIONS = [
  {
    id: 'taken',
    label: "I've taken the GRE",
    sublabel: 'Add your scores to match with programs',
    icon: CheckCircle2,
  },
  {
    id: 'planning',
    label: "I'm planning to take it",
    sublabel: 'We\'ll help you prepare',
    icon: Calendar,
  },
  {
    id: 'looking_for_no_gre',
    label: 'Looking for programs without GRE',
    sublabel: 'Many programs don\'t require it or offer waivers',
    icon: Search,
  },
];

export default function GreScreen({ data, updateFields, onContinue }) {
  const [status, setStatus] = useState(data.greStatus || '');
  const [quantitative, setQuantitative] = useState(data.greQuantitative || '');
  const [verbal, setVerbal] = useState(data.greVerbal || '');
  const [writing, setWriting] = useState(data.greWriting || '');
  const [showInsight, setShowInsight] = useState(false);

  // Update parent data
  useEffect(() => {
    updateFields({
      greStatus: status,
      greQuantitative: quantitative ? Number(quantitative) : null,
      greVerbal: verbal ? Number(verbal) : null,
      greWriting: writing ? Number(writing) : null,
    });
  }, [status, quantitative, verbal, writing, updateFields]);

  // Show insight after selection
  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => setShowInsight(true), 300);
      return () => clearTimeout(timer);
    } else {
      setShowInsight(false);
    }
  }, [status]);

  // Get context
  const context = useMemo(
    () =>
      getGreContext(status, {
        quantitative: quantitative ? Number(quantitative) : null,
        verbal: verbal ? Number(verbal) : null,
        writing: writing ? Number(writing) : null,
      }),
    [status, quantitative, verbal, writing]
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 px-4 py-6">
        {/* Question */}
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          What's your GRE situation?
        </h2>
        <p className="text-gray-600 text-sm mb-6">
          Many programs don't require GRE or offer waivers based on GPA/experience.
        </p>

        {/* Options */}
        <div className="space-y-3">
          {GRE_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isSelected = status === option.id;

            return (
              <button
                key={option.id}
                onClick={() => setStatus(option.id)}
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
                  <div className="text-sm text-gray-500">{option.sublabel}</div>
                </div>
                {isSelected && (
                  <CheckCircle2 className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Score inputs (only if taken) */}
        {status === 'taken' && (
          <div className="mt-6 p-4 bg-gray-50 rounded-2xl space-y-4">
            <Label className="text-sm font-medium text-gray-700">
              Add your scores (optional)
            </Label>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-xs text-gray-500 mb-1 block">Verbal</Label>
                <Input
                  type="number"
                  value={verbal}
                  onChange={(e) => setVerbal(e.target.value)}
                  placeholder="130-170"
                  min={130}
                  max={170}
                  className="h-12 text-center"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-500 mb-1 block">Quant</Label>
                <Input
                  type="number"
                  value={quantitative}
                  onChange={(e) => setQuantitative(e.target.value)}
                  placeholder="130-170"
                  min={130}
                  max={170}
                  className="h-12 text-center"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-500 mb-1 block">Writing</Label>
                <Input
                  type="number"
                  step="0.5"
                  value={writing}
                  onChange={(e) => setWriting(e.target.value)}
                  placeholder="0-6"
                  min={0}
                  max={6}
                  className="h-12 text-center"
                />
              </div>
            </div>

            <p className="text-xs text-gray-500">
              You can add these later if you don't have them handy.
            </p>
          </div>
        )}

        {/* Educational insight */}
        <div className="mt-6">
          <EducationalInsightCard
            title={status === 'looking_for_no_gre' ? 'Good news' : 'About the GRE'}
            message={context?.educational || context?.encouragement}
            show={showInsight && !!context}
            variant={status === 'taken' ? 'positive' : 'default'}
          />
        </div>
      </div>

      {/* Sticky footer */}
      <div className="sticky bottom-0 p-4 bg-white border-t border-gray-100">
        <Button
          onClick={onContinue}
          disabled={!status}
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
