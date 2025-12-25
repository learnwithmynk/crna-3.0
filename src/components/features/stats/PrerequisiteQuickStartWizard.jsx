/**
 * PrerequisiteQuickStartWizard
 *
 * A simplified 3-step wizard for quickly adding prerequisite courses.
 * Designed for low-friction onboarding - users can add details later.
 *
 * Steps:
 * 1. "Which courses have you taken?" - checkboxes
 * 2. "Which have you retaken?" - only shows completed courses
 * 3. "Which do you plan to take?" - remaining courses
 *
 * Shows once unless user clicks "Skip" or completes. Has "Don't show again" option.
 */

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, ChevronRight, ChevronLeft, BookOpen, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

// Core prerequisite courses
const PREREQUISITE_COURSES = [
  { id: 'anatomy', label: 'Anatomy' },
  { id: 'physiology', label: 'Physiology' },
  { id: 'anatomy_physiology', label: 'Anatomy & Physiology (Combined)' },
  { id: 'general_chemistry', label: 'General Chemistry' },
  { id: 'organic_chemistry', label: 'Organic Chemistry' },
  { id: 'biochemistry', label: 'Biochemistry' },
  { id: 'physics', label: 'Physics' },
  { id: 'statistics', label: 'Statistics' },
  { id: 'microbiology', label: 'Microbiology' },
];

const STORAGE_KEY = 'prereq-wizard-dismissed';

export function PrerequisiteQuickStartWizard({ open, onOpenChange, onComplete, existingCourses = [] }) {
  const [step, setStep] = useState(1);
  const [completedCourses, setCompletedCourses] = useState([]);
  const [retakenCourses, setRetakenCourses] = useState([]);
  const [plannedCourses, setPlannedCourses] = useState([]);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  // Check if permanently dismissed
  const isPermanentlyDismissed = localStorage.getItem(STORAGE_KEY) === 'true';

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setStep(1);
      // Pre-populate with existing courses if any
      const existingIds = existingCourses
        .filter(c => c.status === 'completed')
        .map(c => c.courseType);
      setCompletedCourses(existingIds);
      setRetakenCourses([]);
      setPlannedCourses([]);
    }
  }, [open, existingCourses]);

  const toggleCourse = (courseId, list, setList) => {
    setList(prev =>
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    // Build prerequisites array
    const prerequisites = [];

    // Add completed courses
    completedCourses.forEach(courseId => {
      prerequisites.push({
        id: `quick-${courseId}-${Date.now()}`,
        courseType: courseId,
        status: retakenCourses.includes(courseId) ? 'completed' : 'completed',
        isRetake: retakenCourses.includes(courseId),
        grade: '',
        year: '',
        schoolName: '',
      });
    });

    // Add planned courses
    plannedCourses.forEach(courseId => {
      prerequisites.push({
        id: `quick-${courseId}-${Date.now()}`,
        courseType: courseId,
        status: 'planned',
        grade: '',
        year: '',
        schoolName: '',
      });
    });

    onComplete?.(prerequisites);
    onOpenChange(false);
  };

  const handleSkip = () => {
    if (dontShowAgain) {
      localStorage.setItem(STORAGE_KEY, 'true');
    }
    onOpenChange(false);
  };

  // Don't render if permanently dismissed
  if (isPermanentlyDismissed && !open) {
    return null;
  }

  // Get remaining courses for step 3 (not completed)
  const remainingCourses = PREREQUISITE_COURSES.filter(
    c => !completedCourses.includes(c.id)
  );

  const stepTitles = [
    'Which courses have you taken?',
    'Which have you retaken?',
    'Which do you plan to take?',
  ];

  const stepDescriptions = [
    'Select all the prerequisite courses you\'ve completed.',
    'Select any courses you\'ve retaken to improve your grade.',
    'Select courses you\'re planning to take in the future.',
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-lg">Quick Start: Prerequisites</DialogTitle>
              <p className="text-xs text-gray-500">Step {step} of 3</p>
            </div>
          </div>
          <DialogDescription className="pt-2">
            {stepDescriptions[step - 1]}
          </DialogDescription>
        </DialogHeader>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 py-2">
          {[1, 2, 3].map(s => (
            <div
              key={s}
              className={cn(
                'w-2 h-2 rounded-full transition-colors',
                s === step ? 'bg-orange-500' : s < step ? 'bg-green-500' : 'bg-gray-200'
              )}
            />
          ))}
        </div>

        <div className="py-4">
          <h3 className="font-semibold text-gray-900 mb-3">{stepTitles[step - 1]}</h3>

          {/* Step 1: Completed courses */}
          {step === 1 && (
            <div className="space-y-2 max-h-[40vh] overflow-y-auto">
              {PREREQUISITE_COURSES.map(course => {
                const isSelected = completedCourses.includes(course.id);
                return (
                  <button
                    key={course.id}
                    onClick={() => toggleCourse(course.id, completedCourses, setCompletedCourses)}
                    className={cn(
                      'w-full px-4 py-3 rounded-xl text-left transition-all',
                      'flex items-center gap-3 border',
                      isSelected
                        ? 'bg-green-50 border-green-300'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <div
                      className={cn(
                        'w-5 h-5 rounded flex items-center justify-center flex-shrink-0',
                        isSelected
                          ? 'bg-green-500'
                          : 'border-2 border-gray-300'
                      )}
                    >
                      {isSelected && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <span className={cn(
                      'text-sm font-medium',
                      isSelected ? 'text-green-800' : 'text-gray-700'
                    )}>
                      {course.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Step 2: Retaken courses */}
          {step === 2 && (
            <div className="space-y-2 max-h-[40vh] overflow-y-auto">
              {completedCourses.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">You haven't selected any completed courses.</p>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={handleBack}
                    className="mt-2"
                  >
                    Go back to add courses
                  </Button>
                </div>
              ) : (
                <>
                  {PREREQUISITE_COURSES.filter(c => completedCourses.includes(c.id)).map(course => {
                    const isSelected = retakenCourses.includes(course.id);
                    return (
                      <button
                        key={course.id}
                        onClick={() => toggleCourse(course.id, retakenCourses, setRetakenCourses)}
                        className={cn(
                          'w-full px-4 py-3 rounded-xl text-left transition-all',
                          'flex items-center gap-3 border',
                          isSelected
                            ? 'bg-amber-50 border-amber-300'
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        )}
                      >
                        <div
                          className={cn(
                            'w-5 h-5 rounded flex items-center justify-center flex-shrink-0',
                            isSelected
                              ? 'bg-amber-500'
                              : 'border-2 border-gray-300'
                          )}
                        >
                          {isSelected && <Check className="h-3 w-3 text-white" />}
                        </div>
                        <span className={cn(
                          'text-sm font-medium',
                          isSelected ? 'text-amber-800' : 'text-gray-700'
                        )}>
                          {course.label}
                        </span>
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setRetakenCourses([])}
                    className={cn(
                      'w-full px-4 py-3 rounded-xl text-center text-sm border transition-all',
                      retakenCourses.length === 0
                        ? 'bg-gray-100 border-gray-400 text-gray-700'
                        : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                    )}
                  >
                    I haven't retaken any courses
                  </button>
                </>
              )}
            </div>
          )}

          {/* Step 3: Planned courses */}
          {step === 3 && (
            <div className="space-y-2 max-h-[40vh] overflow-y-auto">
              {remainingCourses.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">You've already completed all core prerequisites!</p>
                  <div className="flex items-center justify-center gap-2 mt-3 text-green-600">
                    <Sparkles className="w-5 h-5" />
                    <span className="font-medium">Nice work!</span>
                  </div>
                </div>
              ) : (
                <>
                  {remainingCourses.map(course => {
                    const isSelected = plannedCourses.includes(course.id);
                    return (
                      <button
                        key={course.id}
                        onClick={() => toggleCourse(course.id, plannedCourses, setPlannedCourses)}
                        className={cn(
                          'w-full px-4 py-3 rounded-xl text-left transition-all',
                          'flex items-center gap-3 border',
                          isSelected
                            ? 'bg-blue-50 border-blue-300'
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        )}
                      >
                        <div
                          className={cn(
                            'w-5 h-5 rounded flex items-center justify-center flex-shrink-0',
                            isSelected
                              ? 'bg-blue-500'
                              : 'border-2 border-gray-300'
                          )}
                        >
                          {isSelected && <Check className="h-3 w-3 text-white" />}
                        </div>
                        <span className={cn(
                          'text-sm font-medium',
                          isSelected ? 'text-blue-800' : 'text-gray-700'
                        )}>
                          {course.label}
                        </span>
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setPlannedCourses([])}
                    className={cn(
                      'w-full px-4 py-3 rounded-xl text-center text-sm border transition-all',
                      plannedCourses.length === 0
                        ? 'bg-gray-100 border-gray-400 text-gray-700'
                        : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                    )}
                  >
                    I'm not planning to take any more
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="flex-col gap-3 sm:flex-col">
          <div className="flex gap-2 w-full">
            {step > 1 && (
              <Button variant="outline" onClick={handleBack} className="flex-1">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            )}
            {step < 3 ? (
              <Button onClick={handleNext} className="flex-1">
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={handleComplete} className="flex-1">
                Done
                <Check className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>

          {/* Skip option with don't show again */}
          <div className="flex items-center justify-between w-full pt-2 border-t border-gray-100">
            <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="rounded border-gray-300"
              />
              Don't show again
            </label>
            <Button variant="ghost" size="sm" onClick={handleSkip} className="text-gray-400">
              Skip for now
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default PrerequisiteQuickStartWizard;
