/**
 * Community Involvement Section
 *
 * Renamed from Volunteering to be more inclusive:
 * - Volunteer activities
 * - Medical missions
 * - Community service
 *
 * Design: Each entry shows Position + Organization + Description
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Pencil, Plus } from 'lucide-react';
import { parseEntriesAsStrings } from '@/lib/textParsers';

export function CommunityInvolvementSection({
  resumeBoosters,
  onEdit,
  isEditable = true,
}) {
  const volunteeringContent = resumeBoosters?.volunteering || '';
  const hasContent = volunteeringContent.trim();

  const entries = parseEntriesAsStrings(volunteeringContent);

  // Empty state
  if (!hasContent) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Heart className="w-4 h-4" />
            Community Involvement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-gray-500 text-sm">
            <Heart className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p>No community involvement added yet</p>
            <p className="text-xs mt-1">
              Add volunteer work or medical missions
            </p>
            {isEditable && (
              <Button
                size="sm"
                variant="outline"
                className="mt-3"
                onClick={() => onEdit?.('volunteering')}
              >
                <Plus className="w-3 h-3 mr-1" />
                Add Community Involvement
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
          <Heart className="w-4 h-4" />
          Community
        </CardTitle>
        {isEditable && (
          <button
            onClick={() => onEdit?.('volunteering')}
            className="p-1.5 hover:bg-gray-100 rounded-xl transition-colors"
            aria-label="Edit Community Involvement"
          >
            <Pencil className="w-4 h-4 text-gray-500" />
          </button>
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        {entries.length > 0 ? (
          entries.map((entry, index) => (
            <div
              key={index}
              className="p-3 bg-rose-50 rounded-xl"
            >
              <p className="text-sm text-gray-700">{entry}</p>
            </div>
          ))
        ) : (
          <div className="p-3 bg-rose-50 rounded-xl">
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {volunteeringContent}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default CommunityInvolvementSection;
