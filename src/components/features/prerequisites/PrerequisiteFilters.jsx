/**
 * PrerequisiteFilters Component
 *
 * Filter controls for the Prerequisite Library including:
 * - View toggle (All/Saved) - prominent tabs
 * - Search input
 * - Subject area multi-select tags with gradient borders
 * - Education level toggle (Undergrad/Graduate)
 */

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { X, Heart, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SUBJECT_AREAS, EDUCATION_LEVELS } from '@/data/mockPrerequisites';

export function PrerequisiteFilters({
  searchQuery = '',
  onSearchChange,
  selectedSubjects = [],
  onSubjectsChange,
  selectedLevel = '',
  onLevelChange,
  rollingAdmissionOnly = false,
  onRollingAdmissionChange,
  viewMode = 'all', // 'all' | 'saved'
  onViewModeChange,
  onClearFilters,
  resultCount = 0,
  totalCount = 0,
  savedCount = 0,
  className = '',
}) {
  const hasActiveFilters =
    searchQuery ||
    selectedSubjects.length > 0 ||
    selectedLevel ||
    rollingAdmissionOnly;

  // Toggle subject in selection
  const toggleSubject = (subjectKey) => {
    if (selectedSubjects.includes(subjectKey)) {
      onSubjectsChange?.(selectedSubjects.filter((s) => s !== subjectKey));
    } else {
      onSubjectsChange?.([...selectedSubjects, subjectKey]);
    }
  };

  // Handle clear all
  const handleClearAll = () => {
    onClearFilters?.();
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Glassmorphism container - no border, flat design */}
      <div className="bg-white/70 backdrop-blur-sm rounded-4xl shadow-sm">
        {/* Two-column layout for Subject Areas and Education Level */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
        {/* Subject Areas with Gradient Outlines */}
        <div className="flex flex-col items-center">
          <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3 text-center">
            Subject Areas
          </label>
          <div className="flex flex-wrap gap-2.5 justify-center">
            {SUBJECT_AREAS.map((subject) => {
              const isSelected = selectedSubjects.includes(subject.key);
              return (
                <div key={subject.key} className="relative">
                  {/* Gradient border wrapper */}
                  <div
                    className={cn(
                      'p-px rounded-full transition-all',
                      isSelected
                        ? 'bg-linear-to-r from-[#FFD6B8] via-[#FE90AF] to-[#FFB088]'
                        : 'bg-gray-200 hover:bg-linear-to-r hover:from-[#FFD6B8]/50 hover:via-[#FE90AF]/50 hover:to-[#FFB088]/50'
                    )}
                  >
                    <button
                      onClick={() => toggleSubject(subject.key)}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-sm transition-all',
                        isSelected
                          ? 'bg-linear-to-r from-[#FFF5E6] to-[#FFEBE0] text-orange-800 font-medium'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      )}
                    >
                      {subject.label}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Education Level - Compact pills */}
        <div className="flex flex-col items-center">
          <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3 text-center">
            Education Level
          </label>
          <div className="flex flex-wrap gap-2.5 justify-center">
            {EDUCATION_LEVELS.map((level) => {
              const isSelected = selectedLevel === level.key;
              return (
                <div key={level.key} className="relative">
                  <div
                    className={cn(
                      'p-px rounded-full transition-all',
                      isSelected
                        ? 'bg-linear-to-r from-[#FFD6B8] via-[#FE90AF] to-[#FFB088]'
                        : 'bg-gray-200 hover:bg-linear-to-r hover:from-[#FFD6B8]/50 hover:via-[#FE90AF]/50 hover:to-[#FFB088]/50'
                    )}
                  >
                    <button
                      onClick={() =>
                        onLevelChange?.(isSelected ? '' : level.key)
                      }
                      className={cn(
                        'px-4 py-1.5 rounded-full text-sm transition-all',
                        isSelected
                          ? 'bg-linear-to-r from-[#FFF5E6] to-[#FFEBE0] text-orange-800 font-medium'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      )}
                    >
                      {level.label}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Rolling Admission Checkbox */}
          <div className="flex items-center gap-2.5 mt-6 pt-4">
            <Checkbox
              id="rollingAdmission"
              checked={rollingAdmissionOnly}
              onCheckedChange={(checked) => onRollingAdmissionChange?.(checked)}
              className="rounded-lg"
            />
            <Label htmlFor="rollingAdmission" className="text-sm font-normal text-gray-600 cursor-pointer">
              Rolling Admission
            </Label>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="text-gray-500 h-9 px-4 mt-3 rounded-xl hover:bg-white/60"
            >
              <X className="w-3.5 h-3.5 mr-1.5" />
              Clear All
            </Button>
          )}
        </div>
        </div>
      </div>

      {/* Results Count with View Toggle */}
      <div className="flex items-center justify-between pt-4">
        {totalCount > 0 && (
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium text-gray-700">{resultCount}</span> of{' '}
            <span className="font-medium text-gray-700">{totalCount}</span> courses
          </div>
        )}

        {/* View Toggle - Right aligned */}
        <div className="inline-flex bg-white/70 backdrop-blur-sm rounded-2xl p-1 shadow-sm">
          <button
            onClick={() => onViewModeChange?.('all')}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all',
              viewMode === 'all'
                ? 'bg-linear-to-r from-[#FFF5E6] to-[#FFEBE0] text-orange-800 shadow-sm'
                : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
            )}
          >
            <BookOpen className="w-3.5 h-3.5" />
            All
            <span className="text-xs text-gray-500">({totalCount})</span>
          </button>
          <button
            onClick={() => onViewModeChange?.('saved')}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all',
              viewMode === 'saved'
                ? 'bg-linear-to-r from-[#FEE2E2] to-[#FECACA] text-red-800 shadow-sm'
                : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
            )}
          >
            <Heart className="w-3.5 h-3.5" />
            Saved
            {savedCount > 0 && (
              <span className="text-xs text-gray-500">({savedCount})</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PrerequisiteFilters;
