/**
 * Research Section
 *
 * Displays research and QI projects:
 * - Research projects
 * - Poster presentations
 * - Publications
 * - QI/EBP projects
 *
 * Design: Each entry shows Project Name + Description
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FlaskConical, Pencil, Plus, FileText } from 'lucide-react';
import { parseEntriesAsStrings } from '@/lib/textParsers';

export function ResearchSection({
  resumeBoosters,
  onEdit,
  isEditable = true,
}) {
  const researchContent = resumeBoosters?.research || '';
  const publicationsContent = resumeBoosters?.publications || '';

  const hasResearch = researchContent.trim();
  const hasPublications = publicationsContent.trim();
  const hasContent = hasResearch || hasPublications;

  const researchEntries = parseEntriesAsStrings(researchContent);

  // Empty state
  if (!hasContent) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <FlaskConical className="w-4 h-4" />
            Research & QI
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-gray-500 text-sm">
            <FlaskConical className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p>No research experience added yet</p>
            <p className="text-xs mt-1">
              Add QI projects, posters, or publications
            </p>
            {isEditable && (
              <Button
                size="sm"
                variant="outline"
                className="mt-3"
                onClick={() => onEdit?.('research')}
              >
                <Plus className="w-3 h-3 mr-1" />
                Add Research
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
          <FlaskConical className="w-4 h-4" />
          Research & QI
        </CardTitle>
        {isEditable && (
          <button
            onClick={() => onEdit?.('research')}
            className="p-1.5 hover:bg-gray-100 rounded-xl transition-colors"
            aria-label="Edit Research"
          >
            <Pencil className="w-4 h-4 text-gray-500" />
          </button>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Research/QI Projects */}
        {hasResearch && (
          <div className="space-y-3">
            {researchEntries.length > 0 ? (
              researchEntries.map((entry, index) => (
                <div
                  key={index}
                  className="p-3 bg-gray-50 rounded-xl"
                >
                  <p className="text-sm text-gray-700">{entry}</p>
                </div>
              ))
            ) : (
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {researchContent}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Publications Sub-section */}
        {hasPublications && (
          <div className="space-y-2 pt-2 border-t">
            <p className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Publications
            </p>
            <p className="text-sm text-gray-700 whitespace-pre-wrap p-2 bg-purple-50 rounded-xl">
              {publicationsContent}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ResearchSection;
