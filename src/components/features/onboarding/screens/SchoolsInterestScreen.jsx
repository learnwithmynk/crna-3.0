/**
 * SchoolsInterestScreen
 *
 * Path A screen for selecting schools of interest (not targets yet).
 * Uses fuzzy search for easy selection.
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, GraduationCap } from 'lucide-react';
import SchoolFuzzySearch from '../SchoolFuzzySearch';
import EducationalInsightCard from '../EducationalInsightCard';

export default function SchoolsInterestScreen({ data, updateField, onContinue }) {
  const [selectedSchools, setSelectedSchools] = useState(data.interestedSchools || []);
  const [showInsight, setShowInsight] = useState(false);

  // Update parent data
  useEffect(() => {
    updateField('interestedSchools', selectedSchools);
  }, [selectedSchools, updateField]);

  // Show insight after selections
  useEffect(() => {
    if (selectedSchools.length > 0) {
      const timer = setTimeout(() => setShowInsight(true), 300);
      return () => clearTimeout(timer);
    } else {
      setShowInsight(false);
    }
  }, [selectedSchools.length]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 px-4 py-6">
        {/* Question */}
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Any CRNA programs catching your eye?
        </h2>
        <p className="text-gray-600 text-sm mb-6">
          Select any schools you're interested in. Don't worry if you're not sure yet - you can change this anytime.
        </p>

        {/* School search */}
        <SchoolFuzzySearch
          selectedSchools={selectedSchools}
          onSelectionChange={setSelectedSchools}
          maxSelections={10}
          placeholder="Search by school name, city, or state..."
        />

        {/* Educational insight */}
        <div className="mt-6">
          <EducationalInsightCard
            title="Why saving schools helps"
            message={
              selectedSchools.length > 0
                ? `Great choices! We'll help you research these ${selectedSchools.length} program${selectedSchools.length !== 1 ? 's' : ''} and track their requirements. When you're ready, you can convert any of them to target schools to create application checklists.`
                : "Having clear targets helps us personalize everything - from checklists to deadline reminders. Don't worry if you're not sure yet - you can always add more later."
            }
            show={true}
            variant={selectedSchools.length > 0 ? 'positive' : 'default'}
          />
        </div>

        {/* Skip option */}
        {selectedSchools.length === 0 && (
          <button
            onClick={onContinue}
            className="w-full mt-4 text-center text-sm text-gray-500 hover:text-gray-700 py-2"
          >
            Skip for now - I'll explore schools later
          </button>
        )}
      </div>

      {/* Sticky footer */}
      <div className="sticky bottom-0 p-4 bg-white border-t border-gray-100">
        <Button
          onClick={onContinue}
          className="w-full h-12 text-base font-semibold"
        >
          {selectedSchools.length > 0 ? 'Continue' : 'Skip for Now'}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        <p className="text-xs text-center text-gray-400 mt-2">
          {selectedSchools.length > 0 ? '+3 points' : '+2 points'}
        </p>
      </div>
    </div>
  );
}
