/**
 * Leadership Section
 *
 * Prominent standalone section for leadership experience:
 * - Charge Nurse, Preceptor, etc.
 * - Each role with description
 * - Committees as sub-category
 *
 * Design: Each entry shows Title + Description
 * Edit modal has quick-check options + dynamic description field
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Pencil, Users, Plus } from 'lucide-react';
import { parseEntriesWithTitleDescription } from '@/lib/textParsers';

// Common leadership roles for quick-check options
export const LEADERSHIP_ROLES = [
  { id: 'charge_nurse', label: 'Charge Nurse' },
  { id: 'preceptor', label: 'Preceptor' },
  { id: 'unit_council', label: 'Unit-Based Council' },
  { id: 'code_committee', label: 'Code Blue Committee/Team' },
  { id: 'rapid_response', label: 'Rapid Response Team' },
  { id: 'other', label: 'Other' },
];

export function LeadershipSection({
  resumeBoosters,
  onEdit,
  isEditable = true,
}) {
  const leadershipContent = resumeBoosters?.leadership || '';
  const committeesContent = resumeBoosters?.committees || '';

  const hasLeadership = leadershipContent.trim();
  const hasCommittees = committeesContent.trim();
  const hasContent = hasLeadership || hasCommittees;

  const leadershipEntries = parseEntriesWithTitleDescription(leadershipContent);
  const committeeEntries = parseEntriesWithTitleDescription(committeesContent);

  // Empty state
  if (!hasContent) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Crown className="w-4 h-4" />
            Leadership
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-gray-500 text-sm">
            <Crown className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p>No leadership experience added yet</p>
            <p className="text-xs mt-1">
              Add charge nurse, preceptor, or committee roles
            </p>
            {isEditable && (
              <Button
                size="sm"
                variant="outline"
                className="mt-3"
                onClick={() => onEdit?.('leadership')}
              >
                <Plus className="w-3 h-3 mr-1" />
                Add Leadership
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Crown className="w-4 h-4" />
          Leadership
        </CardTitle>
        {isEditable && (
          <button
            onClick={() => onEdit?.('leadership')}
            className="p-1.5 hover:bg-gray-100 rounded-xl transition-colors"
            aria-label="Edit Leadership"
          >
            <Pencil className="w-4 h-4 text-gray-500" />
          </button>
        )}
      </CardHeader>
      <CardContent className="space-y-3 max-h-72 overflow-y-auto">
        {/* Leadership Roles - Resume bullet point style */}
        {hasLeadership && (
          <div className="space-y-2.5">
            {leadershipEntries.map((entry, index) => (
              <div key={index} className="border-l-2 border-amber-400 pl-3 py-1">
                <p className="text-sm font-bold text-gray-800">{entry.title}</p>
                {entry.description && (
                  <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{entry.description}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Committees - Formal list with title/description */}
        {hasCommittees && (
          <div className="space-y-2 pt-2 border-t">
            <p className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              Committees
            </p>
            <div className="space-y-2">
              {committeeEntries.map((entry, index) => (
                <div
                  key={index}
                  className="border-l-2 border-blue-400 pl-3 py-1"
                >
                  <p className="text-sm font-bold text-gray-800">{entry.title}</p>
                  {entry.description && (
                    <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{entry.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default LeadershipSection;
