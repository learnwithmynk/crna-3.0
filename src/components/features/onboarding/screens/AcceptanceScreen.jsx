/**
 * AcceptanceScreen
 *
 * Path C screen for users who have already been accepted.
 * Celebrates their achievement and collects acceptance info.
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, PartyPopper, GraduationCap } from 'lucide-react';
import SchoolFuzzySearch from '../SchoolFuzzySearch';

export default function AcceptanceScreen({ data, updateField, onContinue }) {
  const [acceptedProgram, setAcceptedProgram] = useState(
    data.acceptedProgramId ? [data.acceptedProgramId] : []
  );

  // Update parent data
  useEffect(() => {
    updateField('acceptedProgramId', acceptedProgram[0] || null);
  }, [acceptedProgram, updateField]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 px-4 py-6">
        {/* Celebration header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
            <PartyPopper className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Congratulations!
          </h2>
          <p className="text-gray-600">
            Getting accepted to CRNA school is a huge achievement. You should be proud!
          </p>
        </div>

        {/* Program selection */}
        <div className="bg-gray-50 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <GraduationCap className="h-4 w-4" />
            Where were you accepted?
          </div>

          <SchoolFuzzySearch
            selectedSchools={acceptedProgram}
            onSelectionChange={setAcceptedProgram}
            maxSelections={1}
            placeholder="Search for your program..."
          />
        </div>

        {/* Info card */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
          <h3 className="font-medium text-blue-900 mb-2">What's next for you?</h3>
          <ul className="text-sm text-blue-800 space-y-1.5">
            <li>• Connect with your future cohort in the community</li>
            <li>• Consider becoming a mentor to future applicants</li>
            <li>• Access SRNA-specific resources and tips</li>
          </ul>
        </div>
      </div>

      {/* Sticky footer */}
      <div className="sticky bottom-0 p-4 bg-white border-t border-gray-100">
        <Button onClick={onContinue} className="w-full h-12 text-base font-semibold">
          Continue
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        <p className="text-xs text-center text-gray-400 mt-2">+5 points</p>
      </div>
    </div>
  );
}
