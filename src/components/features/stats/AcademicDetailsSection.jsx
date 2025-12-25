/**
 * Academic Details Section
 *
 * Consolidated section for academic profile including:
 * - GPAs (2x2 grid with color-coded values)
 * - GRE Scores (combined + breakdown)
 * - Certifications (larger badges with expiration dates)
 * - Prerequisites (checklist with retake support)
 *
 * Optimized for mentor review - clear visual hierarchy
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Pencil,
  GraduationCap,
  BookMarked,
  BookOpen,
  Award,
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
  ArrowRight,
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

// Certification display names
const CERT_LABELS = {
  ccrn: 'CCRN',
  'ccrn-pediatric': 'CCRN-Peds',
  'ccrn-neonatal': 'CCRN-Neo',
  'ccrn-k': 'CCRN-K',
  bls: 'BLS',
  acls: 'ACLS',
  pals: 'PALS',
  tncc: 'TNCC',
  nihss: 'NIHSS',
  'nursing-license': 'RN',
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

// Get GPA color based on value
const getGpaColor = (value, type = 'science') => {
  const competitive = type === 'science' ? 3.5 : 3.3;
  const minimum = type === 'science' ? 3.0 : 3.0;

  if (value >= competitive) return 'text-green-600';
  if (value >= minimum) return 'text-blue-600';
  return 'text-amber-600';
};

// Get grade color for display
const getGradeColor = (grade) => {
  if (!grade) return 'text-gray-400';
  const upperGrade = grade.toUpperCase();
  if (upperGrade.startsWith('A')) return 'text-green-600';
  if (upperGrade.startsWith('B')) return 'text-blue-600';
  if (upperGrade.startsWith('C')) return 'text-amber-600';
  return 'text-red-500';
};

// Check if certification expires soon (within 60 days)
const expiresSoon = (expiresDate) => {
  if (!expiresDate) return false;
  const expires = new Date(expiresDate);
  const now = new Date();
  const daysUntilExpiry = (expires - now) / (1000 * 60 * 60 * 24);
  return daysUntilExpiry > 0 && daysUntilExpiry <= 60;
};

// Format expiration date
const formatExpiry = (expiresDate) => {
  if (!expiresDate) return null;
  return new Date(expiresDate).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
};

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

/**
 * Compact GPA Box - 2x2 grid
 */
function GpaBox({ academicProfile, onEdit, isEditable }) {
  const { overallGpa, scienceGpa, scienceGpaWithForgiveness, last60Gpa } = academicProfile;

  const gpaItems = [
    { label: 'Overall', value: overallGpa, type: 'overall' },
    { label: 'Science', value: scienceGpa, type: 'science' },
    { label: 'Last 60', value: last60Gpa, type: 'overall' },
    ...(scienceGpaWithForgiveness && scienceGpaWithForgiveness !== scienceGpa
      ? [{ label: 'Forgiveness', value: scienceGpaWithForgiveness, type: 'science' }]
      : []),
  ].filter((item) => item.value);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
          <GraduationCap className="w-3.5 h-3.5" />
          GPAs
        </h3>
        {isEditable && (
          <button
            onClick={() => onEdit?.('gpa')}
            className="p-0.5 hover:bg-gray-100 rounded transition-colors"
            aria-label="Edit GPAs"
          >
            <Pencil className="w-3 h-3 text-gray-400" />
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {gpaItems.map((item) => (
          <div key={item.label} className="p-2 bg-gray-50 rounded-xl text-center">
            <p className={`text-lg font-bold ${getGpaColor(item.value, item.type)}`}>
              {item.value.toFixed(2)}
            </p>
            <p className="text-[10px] text-gray-500">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * GRE Scores - Combined score prominent, breakdown below
 */
function GreScoreBox({ academicProfile, onEdit, isEditable }) {
  const { greQuantitative, greVerbal, greAnalyticalWriting, greNotRequired } = academicProfile;

  const hasGRE = greQuantitative || greVerbal;
  const combinedScore = (greQuantitative || 0) + (greVerbal || 0);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5" />
          GRE
        </h3>
        {isEditable && (
          <button
            onClick={() => onEdit?.('gre')}
            className="p-0.5 hover:bg-gray-100 rounded transition-colors"
          >
            <Pencil className="w-3 h-3 text-gray-400" />
          </button>
        )}
      </div>
      {greNotRequired ? (
        <p className="text-xs text-gray-400 italic">Not required for target programs</p>
      ) : hasGRE ? (
        <div className="space-y-1.5">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-xl font-bold text-gray-800">{combinedScore}</p>
              <p className="text-[9px] text-gray-500">Combined</p>
            </div>
            {greAnalyticalWriting && (
              <div className="text-center">
                <p className="text-xl font-bold text-gray-800">{greAnalyticalWriting.toFixed(1)}</p>
                <p className="text-[9px] text-gray-500">Writing</p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 text-[10px] text-gray-500">
            {greQuantitative && <span>Q: {greQuantitative}</span>}
            {greQuantitative && greVerbal && <span>•</span>}
            {greVerbal && <span>V: {greVerbal}</span>}
          </div>
        </div>
      ) : (
        <p className="text-xs text-gray-400">Not recorded</p>
      )}
    </div>
  );
}

/**
 * Certifications Display - Larger badges with expiration dates
 */
function CertificationsDisplay({ clinicalProfile, onEdit, isEditable }) {
  const certifications = clinicalProfile?.certifications || [];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5" />
          Certifications
        </h3>
        {isEditable && (
          <button
            onClick={() => onEdit?.('certifications')}
            className="p-0.5 hover:bg-gray-100 rounded transition-colors"
          >
            <Pencil className="w-3 h-3 text-gray-400" />
          </button>
        )}
      </div>

      {certifications.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {certifications.map((cert, index) => {
            const isPassed = cert.status === 'passed';
            const isExpiringSoon = expiresSoon(cert.expiresDate);
            const label = CERT_LABELS[cert.type] || cert.type.toUpperCase();
            const expiry = formatExpiry(cert.expiresDate);

            return (
              <div
                key={index}
                className={`inline-flex flex-col items-center px-3 py-2 rounded-xl border ${
                  isPassed
                    ? isExpiringSoon
                      ? 'bg-amber-50 border-amber-200'
                      : 'bg-green-50 border-green-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center gap-1">
                  {isPassed && !isExpiringSoon && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                  )}
                  {isExpiringSoon && (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  )}
                  <span
                    className={`text-sm font-semibold ${
                      isPassed
                        ? isExpiringSoon
                          ? 'text-amber-700'
                          : 'text-green-700'
                        : 'text-gray-500'
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {isPassed && expiry && (
                  <span
                    className={`text-[10px] ${
                      isExpiringSoon ? 'text-amber-600' : 'text-gray-500'
                    }`}
                  >
                    Exp: {expiry}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-xs text-gray-400">None recorded</p>
      )}
    </div>
  );
}

/**
 * Prerequisites Checklist - Shows all 9 prerequisites with status and grades
 */
function PrerequisitesChecklist({ academicProfile, onEdit, isEditable }) {
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

  const completedCount = allPrereqs.filter(
    (p) => p.status === 'completed'
  ).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
          <BookMarked className="w-3.5 h-3.5" />
          Science Prerequisites
          <span className="ml-1 px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-normal">
            {completedCount}/{ALL_PREREQ_COURSES.length}
          </span>
        </h3>
        {isEditable && (
          <button
            onClick={() => onEdit?.('prerequisites')}
            className="p-0.5 hover:bg-gray-100 rounded transition-colors"
            aria-label="Edit Prerequisites"
          >
            <Pencil className="w-3 h-3 text-gray-400" />
          </button>
        )}
      </div>

      <div className="space-y-1.5">
        {allPrereqs.map((prereq) => {
          const isCompleted = prereq.status === 'completed';
          const isInProgress = prereq.status === 'in_progress';
          const isPlanned = prereq.status === 'planned';
          const hasRetake = prereq.retakeGrade && prereq.originalGrade;

          // Determine the display grade and year
          const displayGrade = hasRetake ? prereq.retakeGrade : prereq.grade;
          const displayYear = hasRetake ? prereq.retakeYear : prereq.year;

          return (
            <div
              key={prereq.courseType}
              className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-gray-50"
            >
              {/* Status Icon */}
              <div className="w-5 shrink-0">
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

              {/* Course Name */}
              <span
                className={`flex-1 text-sm ${
                  isCompleted || isInProgress
                    ? 'text-gray-700'
                    : isPlanned
                    ? 'text-gray-600'
                    : 'text-gray-400'
                }`}
              >
                {prereq.label}
              </span>

              {/* Grade & Year or Status */}
              <div className="flex items-center gap-1.5 text-sm">
                {isCompleted && hasRetake ? (
                  // Show original → retake with arrow
                  <>
                    <span className={`${getGradeColor(prereq.originalGrade)} line-through opacity-60`}>
                      {prereq.originalGrade}
                    </span>
                    <ArrowRight className="w-3 h-3 text-gray-400" />
                    <span className={`font-semibold ${getGradeColor(prereq.retakeGrade)}`}>
                      {prereq.retakeGrade}
                    </span>
                    <span className="text-[10px] text-gray-400 ml-1">
                      ({prereq.originalYear}→{prereq.retakeYear})
                    </span>
                  </>
                ) : isCompleted && displayGrade ? (
                  // Show single grade with year
                  <>
                    <span className={`font-semibold ${getGradeColor(displayGrade)}`}>
                      {displayGrade}
                    </span>
                    {displayYear && (
                      <span className="text-[10px] text-gray-400">({displayYear})</span>
                    )}
                  </>
                ) : isInProgress ? (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-medium">
                    In Progress
                  </span>
                ) : isPlanned ? (
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-[10px] font-medium">
                    Planning
                  </span>
                ) : (
                  <span className="text-[10px] text-gray-400">—</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function AcademicDetailsSection({
  academicProfile,
  clinicalProfile,
  onEdit,
  isEditable = true,
}) {
  if (!academicProfile) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Academic Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Top Row: GPAs (left) + GRE & Certs (right) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left: GPAs */}
          <GpaBox
            academicProfile={academicProfile}
            onEdit={onEdit}
            isEditable={isEditable}
          />

          {/* Right: GRE + Certs stacked */}
          <div className="space-y-4">
            <GreScoreBox
              academicProfile={academicProfile}
              onEdit={onEdit}
              isEditable={isEditable}
            />
            <CertificationsDisplay
              clinicalProfile={clinicalProfile}
              onEdit={onEdit}
              isEditable={isEditable}
            />
          </div>
        </div>

        {/* Bottom: Prerequisites checklist */}
        <div className="pt-3 border-t">
          <PrerequisitesChecklist
            academicProfile={academicProfile}
            onEdit={onEdit}
            isEditable={isEditable}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default AcademicDetailsSection;
