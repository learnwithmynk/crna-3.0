/**
 * SkillsLifetimeSummary - Collapsible summary of all skills observed
 * Shows skills with counts across all shadow days
 */

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const ALL_SKILLS = [
  'Preoperative Assessment',
  'Intubation',
  'Extubation',
  'Invasive Line Placement',
  'Neuraxial Anesthesia',
  'Nerve Block',
  'MAC Sedation',
  'General Anesthesia',
  'LMA',
  'Videoscope',
  'TEE',
  'POCUS',
];

export function SkillsLifetimeSummary({ entries }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Count skills across all entries
  const skillCounts = {};
  entries.forEach(entry => {
    entry.skills?.forEach(skill => {
      skillCounts[skill] = (skillCounts[skill] || 0) + 1;
    });
  });

  // Separate observed vs not observed
  const observedSkills = ALL_SKILLS.filter(skill => skillCounts[skill] > 0)
    .sort((a, b) => skillCounts[b] - skillCounts[a]);
  const notObservedSkills = ALL_SKILLS.filter(skill => !skillCounts[skill]);

  const totalObservedCount = observedSkills.length;

  return (
    <Card className="p-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left"
      >
        <div>
          <h3 className="font-semibold text-gray-900">Skills Observed (Lifetime)</h3>
          <p className="text-sm text-gray-600 mt-1">
            {totalObservedCount} of {ALL_SKILLS.length} skills observed
          </p>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          {/* Observed Skills */}
          {observedSkills.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Observed:</h4>
              <div className="space-y-2">
                {observedSkills.map(skill => (
                  <div
                    key={skill}
                    className="flex items-center justify-between py-2 px-3 bg-green-50 border border-green-200 rounded-xl"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-sm text-gray-900">{skill}</span>
                    </div>
                    <span className="text-sm font-medium text-green-700">
                      {skillCounts[skill]}×
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Not Yet Observed */}
          {notObservedSkills.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Not yet observed:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {notObservedSkills.map(skill => (
                  <div
                    key={skill}
                    className="flex items-center gap-2 py-2 px-3 bg-gray-50 border border-gray-200 rounded-xl"
                  >
                    <div className="w-2 h-2 rounded-full bg-gray-400" />
                    <span className="text-sm text-gray-600">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
