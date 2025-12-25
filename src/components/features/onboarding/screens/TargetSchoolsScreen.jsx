/**
 * TargetSchoolsScreen
 *
 * Path B screen for selecting target schools (required for appliers).
 * Creates target programs with checklists immediately.
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Target, AlertCircle } from 'lucide-react';
import SchoolFuzzySearch from '../SchoolFuzzySearch';
import EducationalInsightCard from '../EducationalInsightCard';

export default function TargetSchoolsScreen({ data, updateField, onContinue }) {
  const [selectedSchools, setSelectedSchools] = useState(data.targetSchools || []);
  const [showInsight, setShowInsight] = useState(false);

  // Update parent data
  useEffect(() => {
    updateField('targetSchools', selectedSchools);
  }, [selectedSchools, updateField]);

  // Show insight after selections
  useEffect(() => {
    if (selectedSchools.length > 0) {
      const timer = setTimeout(() => setShowInsight(true), 300);
      return () => clearTimeout(timer);
    }
  }, [selectedSchools.length]);

  // Can't continue without at least one school
  const canContinue = selectedSchools.length > 0;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 px-4 py-6">
        {/* Question */}
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Which programs are you applying to?
        </h2>
        <p className="text-gray-600 text-sm mb-6">
          We'll create personalized checklists and track deadlines for each program.
        </p>

        {/* Required indicator */}
        <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 px-3 py-2 rounded-xl mb-4">
          <Target className="h-4 w-4" />
          <span>Select at least one target program to continue</span>
        </div>

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
            title={selectedSchools.length > 0 ? 'Checklists ready!' : 'Why targets matter'}
            message={
              selectedSchools.length > 0
                ? `We'll create application checklists for ${selectedSchools.length === 1 ? 'this program' : `these ${selectedSchools.length} programs`}. Each has different requirements - we'll track them all and alert you before deadlines.`
                : "Target programs get full application tracking - checklists, deadline alerts, document tracking, and progress monitoring. This is how we keep you organized."
            }
            show={true}
            variant={selectedSchools.length > 0 ? 'positive' : 'actionable'}
          />
        </div>
      </div>

      {/* Sticky footer */}
      <div className="sticky bottom-0 p-4 bg-white border-t border-gray-100">
        <Button
          onClick={onContinue}
          disabled={!canContinue}
          className="w-full h-12 text-base font-semibold"
        >
          Continue
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        <p className="text-xs text-center text-gray-400 mt-2">
          {selectedSchools.length > 0 ? '+5 points' : 'Select a program to continue'}
        </p>
      </div>
    </div>
  );
}
