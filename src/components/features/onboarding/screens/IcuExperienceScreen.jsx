/**
 * IcuExperienceScreen
 *
 * Collects ICU experience data with educational context.
 * Part of Path A (Foundation Building) flow.
 */

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import EducationalInsightCard from '../EducationalInsightCard';
import {
  getIcuExperienceContext,
  getIcuTypeContext,
} from '@/lib/onboarding/getEducationalContext';

const ICU_TYPES = [
  { id: 'micu', label: 'Medical ICU (MICU)' },
  { id: 'sicu', label: 'Surgical ICU (SICU)' },
  { id: 'cvicu', label: 'Cardiovascular ICU (CVICU)' },
  { id: 'neuro', label: 'Neuro ICU' },
  { id: 'trauma', label: 'Trauma ICU' },
  { id: 'picu', label: 'Pediatric ICU (PICU)' },
  { id: 'nicu', label: 'Neonatal ICU (NICU)' },
  { id: 'mixed', label: 'Mixed/General ICU' },
];

const YEARS_OPTIONS = Array.from({ length: 11 }, (_, i) => i); // 0-10
const MONTHS_OPTIONS = Array.from({ length: 12 }, (_, i) => i); // 0-11

export default function IcuExperienceScreen({ data, updateFields, onContinue }) {
  const [years, setYears] = useState(data.icuYears || 0);
  const [months, setMonths] = useState(data.icuMonths || 0);
  const [icuType, setIcuType] = useState(data.icuType || '');
  const [showInsight, setShowInsight] = useState(false);

  // Update parent data when local state changes
  useEffect(() => {
    updateFields({
      icuYears: years,
      icuMonths: months,
      icuType: icuType,
    });
  }, [years, months, icuType, updateFields]);

  // Show insight after user makes changes
  useEffect(() => {
    const hasInput = years > 0 || months > 0 || icuType;
    if (hasInput) {
      const timer = setTimeout(() => setShowInsight(true), 300);
      return () => clearTimeout(timer);
    } else {
      setShowInsight(false);
    }
  }, [years, months, icuType]);

  // Get context based on input
  const experienceContext = useMemo(
    () => getIcuExperienceContext(years, months),
    [years, months]
  );
  const typeContext = useMemo(() => getIcuTypeContext(icuType), [icuType]);

  // Determine which insight to show
  const insightMessage = useMemo(() => {
    if (icuType && typeContext?.educational) {
      return typeContext.educational;
    }
    if ((years > 0 || months > 0) && experienceContext?.encouragement) {
      return experienceContext.encouragement;
    }
    return experienceContext?.educational;
  }, [icuType, typeContext, years, months, experienceContext]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 px-4 py-6">
        {/* Question */}
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Tell us about your ICU experience
        </h2>
        <p className="text-gray-600 text-sm mb-6">
          This helps us match you with programs and track your progress.
        </p>

        {/* Experience inputs */}
        <div className="space-y-6">
          {/* Years and Months */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              How much ICU experience do you have?
            </Label>
            <div className="flex gap-4">
              {/* Years selector */}
              <div className="flex-1">
                <div className="relative">
                  <select
                    value={years}
                    onChange={(e) => setYears(Number(e.target.value))}
                    className={cn(
                      'w-full h-12 px-4 pr-10 rounded-2xl border-2 border-gray-200',
                      'bg-white text-gray-900 font-medium',
                      'appearance-none cursor-pointer',
                      'focus:outline-none focus:border-yellow-400',
                      'transition-colors'
                    )}
                  >
                    {YEARS_OPTIONS.map((y) => (
                      <option key={y} value={y}>
                        {y} {y === 1 ? 'year' : 'years'}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Months selector */}
              <div className="flex-1">
                <div className="relative">
                  <select
                    value={months}
                    onChange={(e) => setMonths(Number(e.target.value))}
                    className={cn(
                      'w-full h-12 px-4 pr-10 rounded-2xl border-2 border-gray-200',
                      'bg-white text-gray-900 font-medium',
                      'appearance-none cursor-pointer',
                      'focus:outline-none focus:border-yellow-400',
                      'transition-colors'
                    )}
                  >
                    {MONTHS_OPTIONS.map((m) => (
                      <option key={m} value={m}>
                        {m} {m === 1 ? 'month' : 'months'}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* ICU Type */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              What type of ICU do you work in?
            </Label>
            <div className="relative">
              <select
                value={icuType}
                onChange={(e) => setIcuType(e.target.value)}
                className={cn(
                  'w-full h-12 px-4 pr-10 rounded-2xl border-2',
                  icuType ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 bg-white',
                  'text-gray-900 font-medium',
                  'appearance-none cursor-pointer',
                  'focus:outline-none focus:border-yellow-400',
                  'transition-colors'
                )}
              >
                <option value="">Select ICU type...</option>
                {ICU_TYPES.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Educational insight */}
        <div className="mt-6">
          <EducationalInsightCard
            title="Why this matters"
            message={insightMessage}
            show={showInsight && !!insightMessage}
          />
        </div>
      </div>

      {/* Sticky footer */}
      <div className="sticky bottom-0 p-4 bg-white border-t border-gray-100">
        <Button onClick={onContinue} className="w-full h-12 text-base font-semibold">
          Continue
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        <p className="text-xs text-center text-gray-400 mt-2">+2 points</p>
      </div>
    </div>
  );
}
