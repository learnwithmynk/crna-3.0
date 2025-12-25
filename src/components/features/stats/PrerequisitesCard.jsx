/**
 * Prerequisites Card (Compact)
 *
 * Compact display of completed prerequisites with:
 * - Inline badge flow (not individual rows)
 * - Collapsible missing section
 * - Minimal whitespace
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pencil, BookMarked, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { getMissingPrerequisites } from '@/data/mockStatsPage';

// Course type labels (short versions)
const COURSE_LABELS = {
  anatomy: 'Anatomy',
  physiology: 'Physiology',
  general_chemistry: 'Gen Chem',
  organic_chemistry: 'Organic',
  biochemistry: 'Biochem',
  physics: 'Physics',
  statistics: 'Stats',
  pharmacology: 'Pharm',
  pathophysiology: 'Patho',
  microbiology: 'Micro',
  research: 'Research',
};

// Grade color classes
const getGradeBadgeClass = (grade) => {
  if (!grade) return 'bg-gray-100 text-gray-600 border-gray-200';
  const upperGrade = grade.toUpperCase();
  if (upperGrade.startsWith('A')) return 'bg-green-50 text-green-700 border-green-200';
  if (upperGrade.startsWith('B')) return 'bg-blue-50 text-blue-700 border-blue-200';
  if (upperGrade.startsWith('C')) return 'bg-amber-50 text-amber-700 border-amber-200';
  return 'bg-gray-100 text-gray-600 border-gray-200';
};

export function PrerequisitesCard({ academicProfile, targetProgramCount = 2, onEdit, isEditable = true }) {
  const [showMissing, setShowMissing] = useState(false);
  const completedPrerequisites = academicProfile?.completedPrerequisites || [];
  const missingPrereqs = getMissingPrerequisites(completedPrerequisites, targetProgramCount);

  // Check if course is old (more than 7 years)
  const isOldCourse = (year) => {
    if (!year) return false;
    const currentYear = new Date().getFullYear();
    return currentYear - year > 7;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <BookMarked className="w-4 h-4" />
          Prerequisites
          {completedPrerequisites.length > 0 && (
            <span className="text-xs font-normal text-gray-500">
              ({completedPrerequisites.length} completed)
            </span>
          )}
        </CardTitle>
        {isEditable && (
          <button
            onClick={() => onEdit?.('prerequisites')}
            className="p-1.5 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <Pencil className="w-4 h-4 text-gray-500" />
          </button>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Completed Prerequisites - Badge Flow */}
        {completedPrerequisites.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {completedPrerequisites.map((prereq, index) => {
              const isOld = isOldCourse(prereq.year);
              const label = COURSE_LABELS[prereq.courseType] || prereq.courseType;

              return (
                <Badge
                  key={index}
                  variant="outline"
                  className={`text-xs py-1 ${getGradeBadgeClass(prereq.grade)} ${isOld ? 'border-dashed' : ''}`}
                  title={isOld ? `${prereq.year} - May need refresh` : `${prereq.year}`}
                >
                  {label} {prereq.grade}
                  {isOld && <span className="ml-1 text-amber-500">*</span>}
                </Badge>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No prerequisites recorded</p>
        )}

        {/* Missing Prerequisites - Collapsible */}
        {missingPrereqs.length > 0 && (
          <div className="pt-1">
            <button
              onClick={() => setShowMissing(!showMissing)}
              className="flex items-center gap-1.5 text-xs text-amber-600 hover:text-amber-700"
            >
              <AlertTriangle className="w-3 h-3" />
              <span>{missingPrereqs.length} recommended courses</span>
              {showMissing ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>

            {showMissing && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {missingPrereqs.map((prereq) => (
                  <Badge
                    key={prereq.type}
                    variant="outline"
                    className="text-xs bg-amber-50/50 text-amber-700 border-amber-200"
                  >
                    {prereq.label}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Old course footnote */}
        {completedPrerequisites.some(p => isOldCourse(p.year)) && (
          <p className="text-[10px] text-gray-400">
            * Courses older than 7 years may need refresh
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default PrerequisitesCard;
