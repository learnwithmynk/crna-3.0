/**
 * ShadowingScreen
 *
 * Collects shadowing hours with educational context.
 * Part of Path A (Foundation Building) flow.
 */

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ArrowRight, Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import EducationalInsightCard from '../EducationalInsightCard';
import { getShadowingContext } from '@/lib/onboarding/getEducationalContext';

export default function ShadowingScreen({ data, updateField, onContinue }) {
  const [hours, setHours] = useState(data.shadowHours || 0);
  const [showInsight, setShowInsight] = useState(false);

  // Update parent data
  useEffect(() => {
    updateField('shadowHours', hours);
  }, [hours, updateField]);

  // Show insight after input
  useEffect(() => {
    const timer = setTimeout(() => setShowInsight(true), 300);
    return () => clearTimeout(timer);
  }, [hours]);

  // Get context
  const context = useMemo(() => getShadowingContext(hours), [hours]);

  // Increment/decrement handlers
  const increment = () => setHours((prev) => Math.min(prev + 4, 200));
  const decrement = () => setHours((prev) => Math.max(prev - 4, 0));

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 px-4 py-6">
        {/* Question */}
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          How many hours have you shadowed a CRNA?
        </h2>
        <p className="text-gray-600 text-sm mb-6">
          Include all shadow experiences - formal and informal.
        </p>

        {/* Hours input */}
        <div className="flex flex-col items-center py-8">
          <Label className="text-sm font-medium text-gray-500 mb-4">
            Total shadow hours
          </Label>

          {/* Large number input with +/- buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={decrement}
              disabled={hours === 0}
              className={cn(
                'w-14 h-14 rounded-full flex items-center justify-center',
                'border-2 border-gray-200 transition-colors',
                hours === 0
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:border-gray-300 hover:bg-gray-50 active:bg-gray-100'
              )}
            >
              <Minus className="h-6 w-6 text-gray-600" />
            </button>

            <div className="w-32 text-center">
              <Input
                type="number"
                value={hours}
                onChange={(e) =>
                  setHours(Math.max(0, Math.min(200, Number(e.target.value) || 0)))
                }
                className={cn(
                  'text-4xl font-bold text-center h-16 border-2',
                  'focus:border-yellow-400 focus:ring-0',
                  hours > 0 ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'
                )}
                min={0}
                max={200}
              />
            </div>

            <button
              onClick={increment}
              className={cn(
                'w-14 h-14 rounded-full flex items-center justify-center',
                'border-2 border-gray-200 transition-colors',
                'hover:border-yellow-400 hover:bg-yellow-50 active:bg-yellow-100'
              )}
            >
              <Plus className="h-6 w-6 text-gray-600" />
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-2">hours</p>

          {/* Quick add buttons */}
          <div className="flex gap-2 mt-6">
            {[4, 8, 16, 24].map((val) => (
              <button
                key={val}
                onClick={() => setHours(val)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                  hours === val
                    ? 'bg-yellow-400 text-black'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                {val}h
              </button>
            ))}
          </div>
        </div>

        {/* Educational insight */}
        <EducationalInsightCard
          title={hours > 0 ? context.encouragement : 'Why shadowing matters'}
          message={context.educational}
          show={showInsight}
          variant={hours >= 24 ? 'positive' : 'default'}
        />
      </div>

      {/* Sticky footer */}
      <div className="sticky bottom-0 p-4 bg-white border-t border-gray-100">
        <Button onClick={onContinue} className="w-full h-12 text-base font-semibold">
          Continue
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        <p className="text-xs text-center text-gray-400 mt-2">
          {hours > 0 ? '+4 points' : '+2 points'}
        </p>
      </div>
    </div>
  );
}
