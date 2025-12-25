/**
 * School Database Page
 *
 * Main page for browsing and searching CRNA programs.
 * Features:
 * - Smart filters based on user profile
 * - Fit score on each card
 * - Three view modes: Recommended, All, Comparison
 * - Saved programs tray
 *
 * Route: /schools
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LayoutGrid } from 'lucide-react';
import { useSchools } from '@/hooks/useSchools';
import { SchoolCard } from '@/components/features/schools/SchoolCard';
import { SchoolFilters } from '@/components/features/schools/SchoolFilters';
import { SavedProgramsTray } from '@/components/features/schools/SavedProgramsTray';
import { SchoolOnboardingModal } from '@/components/features/schools/SchoolOnboardingModal';

export function SchoolDatabasePage() {
  const {
    schools,
    savedSchools,
    targetSchools,
    filters,
    updateFilter,
    clearFilters,
    allStates,
    sortBy,
    setSortBy,
    totalCount,
    filteredCount,
    toggleSaveSchool,
    toggleTarget,
    unsaveSchool,
  } = useSchools();

  // Tray open state
  const [trayOpen, setTrayOpen] = useState(false);

  // Check if onboarding was completed
  const [showOnboarding, setShowOnboarding] = useState(() => {
    try {
      return !localStorage.getItem('schoolDatabaseOnboarded');
    } catch {
      return true;
    }
  });

  const handleOnboardingComplete = (timeline) => {
    localStorage.setItem('schoolDatabaseOnboarded', 'true');
    localStorage.setItem('schoolDatabaseTimeline', timeline);
    setShowOnboarding(false);

    // Adjust default sort based on timeline
    if (timeline === 'applying_now') {
      setSortBy('deadline');
    }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-orange-50 via-amber-50/80 to-pink-50/25">
      {/* Onboarding Modal */}
      <SchoolOnboardingModal
        open={showOnboarding}
        onComplete={handleOnboardingComplete}
        onSkip={() => {
          localStorage.setItem('schoolDatabaseOnboarded', 'true');
          setShowOnboarding(false);
        }}
      />

      {/* Page Header */}
      <div className="px-8 md:px-16 lg:px-24 xl:px-32 pt-8 md:pt-12 lg:pt-16 pb-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            School Database
          </h1>
          <p className="text-gray-500 mt-1 text-sm leading-relaxed max-w-2xl">
            Filter and find your CRNA programs. Remember, while we strive to keep up to date, program information changes regularly—always check the program website. When you've identified programs to apply to, convert them from a Saved Program to a Target Program.
          </p>
        </div>

        <div className="flex gap-6 items-start">
          {/* Left Sidebar: Filters */}
          <SchoolFilters
            filters={filters}
            onFilterChange={updateFilter}
            onClearFilters={clearFilters}
            allStates={allStates}
            filteredCount={filteredCount}
            totalCount={totalCount}
          />

          {/* Main Content */}
          <div className="flex-1 min-w-0 pb-24 lg:pb-6">
            {/* School Cards Grid */}
            {schools.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {schools.map((school, index) => (
                  <SchoolCard
                    key={`${school.id}-${index}`}
                    school={school}
                    onSave={toggleSaveSchool}
                    onUnsave={toggleSaveSchool}
                    onMakeTarget={toggleTarget}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <LayoutGrid className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No schools match your filters
                </h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your filters to see more programs
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>

          {/* Right Sidebar: Saved Programs Tray */}
          <SavedProgramsTray
            savedSchools={savedSchools}
            targetSchools={targetSchools}
            onUnsave={unsaveSchool}
            onToggleTarget={toggleTarget}
            open={trayOpen}
            onOpenChange={setTrayOpen}
          />
        </div>
      </div>
    </div>
  );
}

export default SchoolDatabasePage;
