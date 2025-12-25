/**
 * Prerequisites Sub-Card
 *
 * Separate card component for displaying science prerequisites.
 * Features:
 * - Shows completed/in-progress/planned courses with grades and years
 * - Expandable section for not-taken courses
 * - Year displayed in light gray next to course name
 * - Status indicators (completed, in-progress, planned)
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Pencil,
  BookMarked,
  CheckCircle2,
  Circle,
  Clock,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';

// =============================================================================
// CONSTANTS
// =============================================================================

// Course type labels (full names)
const COURSE_LABELS = {
  anatomy_physiology: 'Anatomy & Physiology',
  anatomy: 'Anatomy',
  physiology: 'Physiology',
  general_chemistry: 'General Chemistry',
  organic_chemistry: 'Organic Chemistry',
  biochemistry: 'Biochemistry',
  physics: 'Physics',
  statistics: 'Statistics',
  pharmacology: 'Pharmacology',
  pathophysiology: 'Pathophysiology',
  microbiology: 'Microbiology',
  research: 'Research Methods',
};

// All prerequisite course types (standard 9)
const ALL_PREREQ_COURSES = [
  'anatomy_physiology',
  'general_chemistry',
  'organic_chemistry',
  'biochemistry',
  'physics',
  'statistics',
  'pharmacology',
  'pathophysiology',
  'microbiology',
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

// Get grade color for display
const getGradeColor = (grade) => {
  if (!grade) return 'text-gray-400';
  const upperGrade = grade.toUpperCase();
  if (upperGrade.startsWith('A')) return 'text-green-600';
  if (upperGrade.startsWith('B')) return 'text-blue-600';
  if (upperGrade.startsWith('C')) return 'text-amber-600';
  return 'text-red-500';
};

// Format year as full YYYY
const formatYear = (year) => {
  if (!year) return null;
  return year.toString();
};

// Check if course is older than 5 years
const isOlderThan5Years = (year) => {
  if (!year) return false;
  const currentYear = new Date().getFullYear();
  return currentYear - parseInt(year) > 5;
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function PrerequisitesSubCard({ academicProfile, onEdit, onQuickStart, isEditable = true }) {
  const [showNotTaken, setShowNotTaken] = useState(false);
  const completedPrerequisites = academicProfile?.completedPrerequisites || [];

  // Build a map of user's prerequisites
  const prereqMap = {};
  completedPrerequisites.forEach((prereq) => {
    prereqMap[prereq.courseType] = prereq;
  });

  // Build full list with all standard courses
  const allPrereqs = ALL_PREREQ_COURSES.map((courseType) => {
    const userPrereq = prereqMap[courseType];
    return {
      courseType,
      label: COURSE_LABELS[courseType] || courseType,
      ...userPrereq,
    };
  });

  // Separate taken vs not-taken courses
  const takenPrereqs = allPrereqs.filter(
    (p) => p.status === 'completed' || p.status === 'in_progress' || p.status === 'planned'
  );
  const notTakenPrereqs = allPrereqs.filter(
    (p) => !p.status
  );

  const completedCount = allPrereqs.filter(
    (p) => p.status === 'completed'
  ).length;
  const inProgressCount = allPrereqs.filter(
    (p) => p.status === 'in_progress'
  ).length;

  // Render a single prerequisite row
  const renderPrereqRow = (prereq, isNotTaken = false) => {
    const isCompleted = prereq.status === 'completed';
    const isInProgress = prereq.status === 'in_progress';
    const isPlanned = prereq.status === 'planned';
    const hasRetake = prereq.retakeGrade && prereq.originalGrade;
    // Check if course year is older than 5 years (use retake year if available)
    const courseYear = prereq.retakeYear || prereq.year;
    const isOld = isOlderThan5Years(courseYear);

    return (
      <div
        key={prereq.courseType}
        className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-gray-50 transition-colors"
      >
        {/* Left: Status icon + course name + year */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {/* Status Icon */}
          <div className="w-4 shrink-0">
            {isCompleted ? (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            ) : isInProgress ? (
              <Clock className="w-4 h-4 text-blue-500" />
            ) : isPlanned ? (
              <Circle className="w-4 h-4 text-amber-400 fill-amber-100" />
            ) : (
              <Circle className="w-4 h-4 text-gray-300" />
            )}
          </div>

          {/* Course Name + Year */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span
              className={`text-sm truncate ${
                isCompleted || isInProgress
                  ? 'text-gray-700'
                  : isPlanned
                  ? 'text-gray-600'
                  : 'text-gray-400'
              }`}
            >
              {prereq.label}
            </span>
            {/* Show retake year if available, otherwise regular year */}
            {(prereq.retakeYear || prereq.year) && (
              <span className="text-xs text-gray-400 shrink-0">
                {formatYear(prereq.retakeYear || prereq.year)}{isOld && '*'}
              </span>
            )}
          </div>
        </div>

        {/* Right: Grade (fixed width for alignment) */}
        <div className="w-16 text-right shrink-0">
          {isCompleted && hasRetake ? (
            // Show original → retake
            <div className="flex items-center justify-end gap-1">
              <span className={`${getGradeColor(prereq.originalGrade)} line-through opacity-50 text-xs`}>
                {prereq.originalGrade}
              </span>
              <ArrowRight className="w-3 h-3 text-gray-300" />
              <span className={`font-semibold text-sm ${getGradeColor(prereq.retakeGrade)}`}>
                {prereq.retakeGrade}
              </span>
            </div>
          ) : isCompleted && prereq.grade ? (
            // Show single grade
            <span className={`font-semibold text-sm ${getGradeColor(prereq.grade)}`}>
              {prereq.grade}
            </span>
          ) : isInProgress ? (
            <span className="text-[10px] text-blue-600 font-medium whitespace-nowrap">In Progress</span>
          ) : isPlanned ? (
            <span className="text-xs text-amber-600 font-medium">Planned</span>
          ) : (
            <span className="text-xs text-gray-300">—</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-linear-to-br from-purple-100 to-indigo-100">
              <BookMarked className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-base">Science Prerequisites</CardTitle>
              <p className="text-xs text-gray-500 mt-0.5">
                {completedCount}/{ALL_PREREQ_COURSES.length} completed
                {inProgressCount > 0 && ` • ${inProgressCount} in progress`}
              </p>
            </div>
          </div>
          {isEditable && (
            <button
              onClick={() => onEdit?.('prerequisites')}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Edit Prerequisites"
            >
              <Pencil className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Quick Start prompt when no courses added */}
        {takenPrereqs.length === 0 && isEditable && onQuickStart && (
          <div className="text-center py-4 mb-3">
            <p className="text-sm text-gray-500 mb-3">
              Quickly add your completed courses
            </p>
            <Button
              size="sm"
              onClick={onQuickStart}
              className="bg-linear-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white"
            >
              <Sparkles className="w-4 h-4 mr-1.5" />
              Quick Add
            </Button>
          </div>
        )}

        {/* Taken courses */}
        <div className="space-y-0.5">
          {takenPrereqs.map((prereq) => renderPrereqRow(prereq))}
        </div>

        {/* Not taken courses - Expandable section */}
        {notTakenPrereqs.length > 0 && (
          <div className="mt-3">
            <button
              onClick={() => setShowNotTaken(!showNotTaken)}
              className="flex items-center gap-1.5 px-2 py-1.5 w-full text-left hover:bg-gray-50 rounded-lg transition-colors"
            >
              {showNotTaken ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
              <span className="text-xs text-gray-500">
                {notTakenPrereqs.length} other course{notTakenPrereqs.length !== 1 ? 's' : ''}
              </span>
            </button>

            {showNotTaken && (
              <div className="space-y-0.5 mt-1 pt-1 border-t border-gray-100">
                {notTakenPrereqs.map((prereq) => renderPrereqRow(prereq, true))}
              </div>
            )}
          </div>
        )}

        {/* Footnote about course age */}
        <p className="text-[10px] text-gray-400 mt-3 px-2">
          * Courses older than 5 years may need to be retaken
        </p>
      </CardContent>
    </Card>
  );
}

export default PrerequisitesSubCard;
