/**
 * Research & Community Section
 *
 * Combined section for Resume Boosters:
 * - Research/QI Projects at top (with Publications subsection)
 * - Community Involvement at bottom
 * - Scrollable when content is tall
 *
 * Design: Taller card to sit next to Leadership
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FlaskConical, Heart, Pencil, Plus, FileText } from 'lucide-react';

export function ResearchCommunitySection({
  resumeBoosters,
  onEdit,
  isEditable = true,
}) {
  const researchContent = resumeBoosters?.research || '';
  const publicationsContent = resumeBoosters?.publications || '';
  const volunteeringContent = resumeBoosters?.volunteering || '';

  const hasResearch = researchContent.trim();
  const hasPublications = publicationsContent.trim();
  const hasVolunteering = volunteeringContent.trim();
  const hasAnyContent = hasResearch || hasPublications || hasVolunteering;

  // Parse entries with title:description format
  const parseEntries = (content) => {
    if (!content) return [];
    return content
      .split(/\n/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .map((s) => {
        const colonIndex = s.indexOf(':');
        if (colonIndex > 0 && colonIndex < 50) {
          return {
            title: s.slice(0, colonIndex).trim(),
            description: s.slice(colonIndex + 1).trim(),
          };
        }
        return { title: s, description: '' };
      });
  };

  const researchEntries = parseEntries(researchContent);
  const volunteerEntries = parseEntries(volunteeringContent);

  // Combined empty state
  if (!hasAnyContent) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <FlaskConical className="w-4 h-4" />
            Research & Community
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-gray-500 text-sm">
            <div className="flex justify-center gap-2 mb-2">
              <FlaskConical className="w-6 h-6 text-gray-300" />
              <Heart className="w-6 h-6 text-gray-300" />
            </div>
            <p>No research or community experience added yet</p>
            <p className="text-xs mt-1">
              Add QI projects, publications, or volunteer work
            </p>
            <div className="flex justify-center gap-2 mt-3">
              {isEditable && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit?.('research')}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Research
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit?.('volunteering')}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Community
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <FlaskConical className="w-4 h-4" />
          Research & Community
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 max-h-72 overflow-y-auto">
        {/* Research/QI Section */}
        {(hasResearch || hasPublications) && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
                <FlaskConical className="w-3.5 h-3.5" />
                Research & QI
              </p>
              {isEditable && (
                <button
                  onClick={() => onEdit?.('research')}
                  className="p-0.5 hover:bg-gray-100 rounded transition-colors"
                  aria-label="Edit Research"
                >
                  <Pencil className="w-3 h-3 text-gray-400" />
                </button>
              )}
            </div>

            {/* Research entries - Resume style */}
            {hasResearch && (
              <div className="space-y-2">
                {researchEntries.map((entry, index) => (
                  <div key={index} className="border-l-2 border-teal-400 pl-3 py-1">
                    <p className="text-sm font-bold text-gray-800">{entry.title}</p>
                    {entry.description && (
                      <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{entry.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Publications subsection */}
            {hasPublications && (
              <div className="space-y-1 pt-1">
                <p className="text-[10px] font-medium text-gray-400 flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  Publications
                </p>
                <div className="border-l-2 border-purple-400 pl-3 py-1">
                  <p className="text-xs text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {publicationsContent}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Divider between sections */}
        {(hasResearch || hasPublications) && hasVolunteering && (
          <div className="border-t pt-3" />
        )}

        {/* Community Section */}
        {hasVolunteering && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5" />
                Community Involvement
              </p>
              {isEditable && (
                <button
                  onClick={() => onEdit?.('volunteering')}
                  className="p-0.5 hover:bg-gray-100 rounded transition-colors"
                  aria-label="Edit Community"
                >
                  <Pencil className="w-3 h-3 text-gray-400" />
                </button>
              )}
            </div>

            <div className="space-y-2">
              {volunteerEntries.map((entry, index) => (
                <div key={index} className="border-l-2 border-rose-400 pl-3 py-1">
                  <p className="text-sm font-bold text-gray-800">{entry.title}</p>
                  {entry.description && (
                    <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{entry.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Show empty state for missing section when other has content */}
        {!(hasResearch || hasPublications) && hasVolunteering && isEditable && (
          <div className="text-center py-3 border-t">
            <p className="text-xs text-gray-400 mb-2">No research added yet</p>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-xs"
              onClick={() => onEdit?.('research')}
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Research
            </Button>
          </div>
        )}

        {(hasResearch || hasPublications) && !hasVolunteering && isEditable && (
          <div className="text-center py-3 border-t">
            <p className="text-xs text-gray-400 mb-2">No community involvement added yet</p>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-xs"
              onClick={() => onEdit?.('volunteering')}
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Community
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ResearchCommunitySection;
