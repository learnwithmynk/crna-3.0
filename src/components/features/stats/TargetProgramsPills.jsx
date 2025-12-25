/**
 * Target Programs Pills
 *
 * Displays target programs as pill badges at the top of My Stats page.
 * Shows school names in a horizontal scrollable row.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, ChevronRight } from 'lucide-react';

export function TargetProgramsPills({ targetPrograms = [], maxVisible = 5 }) {
  const navigate = useNavigate();

  if (!targetPrograms || targetPrograms.length === 0) {
    return null;
  }

  const visiblePrograms = targetPrograms.slice(0, maxVisible);
  const remainingCount = targetPrograms.length - maxVisible;

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <GraduationCap className="w-4 h-4 text-gray-500" />
        <span className="text-xs font-medium text-gray-500">
          Target Programs ({targetPrograms.length})
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {visiblePrograms.map((program) => {
          const schoolName = program.program?.schoolName || program.program?.name || 'Unknown School';
          // Shorten long names
          const displayName = schoolName.length > 25
            ? schoolName.substring(0, 22) + '...'
            : schoolName;

          return (
            <button
              key={program.id}
              onClick={() => navigate(`/programs/${program.programId}`)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium hover:bg-purple-200 transition-colors"
            >
              {displayName}
            </button>
          );
        })}
        {remainingCount > 0 && (
          <button
            onClick={() => navigate('/my-programs')}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            +{remainingCount} more
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
        {targetPrograms.length === 0 && (
          <button
            onClick={() => navigate('/schools')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-dashed border-gray-300 text-gray-500 rounded-full text-sm hover:border-gray-400 hover:text-gray-600 transition-colors"
          >
            Add target programs
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

export default TargetProgramsPills;
