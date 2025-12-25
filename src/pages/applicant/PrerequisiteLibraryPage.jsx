/**
 * PrerequisiteLibraryPage
 *
 * Browse and discover prerequisite courses recommended by other CRNA applicants.
 * Features:
 * - Search and filter by subject, level
 * - Course cards with ratings
 * - View saved courses
 * - Course detail modal
 * - Write review modal
 * - Submit new course modal
 */

import { useState, useMemo } from 'react';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, BookOpen, Search, Star } from 'lucide-react';
import { CourseCard } from '@/components/features/prerequisites/CourseCard';
import { PrerequisiteFilters } from '@/components/features/prerequisites/PrerequisiteFilters';
import { CourseDetailModal } from '@/components/features/prerequisites/CourseDetailModal';
import { WriteReviewModal } from '@/components/features/prerequisites/WriteReviewModal';
import { SubmitCourseModal } from '@/components/features/prerequisites/SubmitCourseModal';
import { SmartCourseSuggestions } from '@/components/features/prerequisites/SmartCourseSuggestions';
import { EmptyState } from '@/components/ui/empty-state';
import { mockPrerequisiteCourses } from '@/data/mockPrerequisites';
import { mockAcademicProfile } from '@/data/mockUser';
import { schools } from '@/data/supabase/schools';

// Mock: Get user's target programs with full school data
// TODO: Replace with real user data from Supabase
const getMockTargetPrograms = () => {
  // For demo, use first 3 schools as user's target programs
  // In production, this comes from user's saved/target programs joined with schools table
  return schools.slice(0, 3);
};

export function PrerequisiteLibraryPage() {
  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [rollingAdmissionOnly, setRollingAdmissionOnly] = useState(false);
  const [viewMode, setViewMode] = useState('all');

  // Modal state
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [isSubmitCourseOpen, setIsSubmitCourseOpen] = useState(false);
  const [reviewCourse, setReviewCourse] = useState(null);

  // Course data state (for local mutations like saving)
  const [courses, setCourses] = useState(mockPrerequisiteCourses);

  // Filter courses
  const filteredCourses = useMemo(() => {
    let result = [...courses];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.courseName.toLowerCase().includes(query) ||
          c.schoolName.toLowerCase().includes(query) ||
          c.subject.toLowerCase().includes(query)
      );
    }

    // Subject filter
    if (selectedSubjects.length > 0) {
      result = result.filter((c) => selectedSubjects.includes(c.subject));
    }

    // Level filter
    if (selectedLevel) {
      result = result.filter((c) => c.level === selectedLevel);
    }

    // Rolling admission filter
    if (rollingAdmissionOnly) {
      result = result.filter((c) => c.rollingAdmission === true);
    }

    // Saved filter
    if (viewMode === 'saved') {
      result = result.filter((c) => c.isSaved);
    }

    return result;
  }, [courses, searchQuery, selectedSubjects, selectedLevel, rollingAdmissionOnly, viewMode]);

  // Handlers
  const handleSaveCourse = (courseId) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, isSaved: true } : c))
    );
  };

  const handleUnsaveCourse = (courseId) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, isSaved: false } : c))
    );
  };

  const handleViewDetails = (course) => {
    setSelectedCourse(course);
    setIsDetailModalOpen(true);
  };

  const handleWriteReview = (course) => {
    setReviewCourse(course);
    setIsWriteReviewOpen(true);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedSubjects([]);
    setSelectedLevel('');
    setRollingAdmissionOnly(false);
    setViewMode('all');
  };

  const handleSubmitCourse = (newCourse) => {
    // Add the new course to the list (with pending status in real app)
    const courseWithId = {
      ...newCourse,
      id: `course_${Date.now()}`,
      averageRecommend: 0,
      averageEase: 0,
      reviewCount: 0,
      isSaved: false,
    };
    setCourses((prev) => [courseWithId, ...prev]);
    setIsSubmitCourseOpen(false);
  };

  const handleSubmitReview = (review) => {
    // In a real app, this would update the course's review count and averages
    console.log('Review submitted:', review);
    setIsWriteReviewOpen(false);
    setReviewCourse(null);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50/80 to-pink-50/25">
      <PageWrapper className="px-8 md:px-16 lg:px-24 xl:px-32 pt-8 md:pt-12 lg:pt-16 pb-8 bg-transparent relative z-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Prerequisite Library
            </h1>
            <p className="text-gray-500 mt-1 max-w-md text-sm leading-relaxed">
              Browse courses recommended by previous applicants.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {/* Search Input */}
            <div className="relative w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 bg-white/70 border-gray-200/60 text-sm"
              />
            </div>
            <Button
              onClick={() => setIsSubmitCourseOpen(true)}
              size="sm"
              className="h-9 bg-linear-to-r from-[#F1EAB9] via-[#FFD6B8] to-[#FF8C8C] hover:from-[#E8E0A8] hover:via-[#FFCAA8] hover:to-[#FF7B7B] text-orange-900 border-none shadow-sm font-medium"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Submit Course
              <span className="ml-1.5 inline-flex items-center gap-0.5 text-[10px] text-orange-700 bg-white/50 px-1.5 py-0.5 rounded-full">
                <Star className="w-2 h-2 fill-orange-400 text-orange-400" />
                +20
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <PrerequisiteFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedSubjects={selectedSubjects}
        onSubjectsChange={setSelectedSubjects}
        selectedLevel={selectedLevel}
        onLevelChange={setSelectedLevel}
        rollingAdmissionOnly={rollingAdmissionOnly}
        onRollingAdmissionChange={setRollingAdmissionOnly}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onClearFilters={handleClearFilters}
        resultCount={filteredCourses.length}
        totalCount={courses.length}
        savedCount={courses.filter(c => c.isSaved).length}
        className="mb-8"
      />

      {/* Course Grid - 3 columns */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-8">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onSave={handleSaveCourse}
              onUnsave={handleUnsaveCourse}
              onViewDetails={handleViewDetails}
              onWriteReview={handleWriteReview}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={BookOpen}
          title={viewMode === 'saved' ? 'No saved courses' : 'No courses found'}
          description={
            viewMode === 'saved'
              ? "You haven't saved any courses yet. Browse the library and save courses you're interested in."
              : 'Try adjusting your filters or search query to find courses.'
          }
          action={
            viewMode === 'saved' ? (
              <Button variant="outline" onClick={() => setViewMode('all')}>
                Browse All Courses
              </Button>
            ) : (
              <Button variant="outline" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            )
          }
        />
      )}

      {/* Modals */}
      <CourseDetailModal
        course={selectedCourse}
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        onWriteReview={handleWriteReview}
      />

      <WriteReviewModal
        course={reviewCourse}
        open={isWriteReviewOpen}
        onOpenChange={setIsWriteReviewOpen}
        onSubmit={handleSubmitReview}
      />

      <SubmitCourseModal
        open={isSubmitCourseOpen}
        onOpenChange={setIsSubmitCourseOpen}
        onSubmit={handleSubmitCourse}
      />
      </PageWrapper>
    </div>
  );
}

export default PrerequisiteLibraryPage;
