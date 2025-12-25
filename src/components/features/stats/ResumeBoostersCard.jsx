/**
 * Resume Boosters Card
 *
 * Displays additional achievements beyond clinical:
 * - Research
 * - Committees
 * - Volunteering
 * - Leadership
 *
 * Each section is expandable with inline editing
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Star,
  Pencil,
  FlaskConical,
  Users,
  Heart,
  Crown,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  CheckCircle2,
} from 'lucide-react';

// Booster section config
const SECTIONS = [
  {
    id: 'research',
    label: 'Research',
    icon: FlaskConical,
    placeholder: 'Describe any research projects, posters, or publications...',
    tip: 'Include poster presentations, QI projects, and publications',
  },
  {
    id: 'committees',
    label: 'Committees',
    icon: Users,
    placeholder: 'List committees or councils you serve on...',
    tip: 'Unit practice councils, code committees, shared governance',
  },
  {
    id: 'volunteering',
    label: 'Volunteering',
    icon: Heart,
    placeholder: 'Describe volunteer work, especially medical-related...',
    tip: 'Medical missions, free clinics, community health events',
  },
  {
    id: 'leadership',
    label: 'Leadership',
    icon: Crown,
    placeholder: 'List leadership roles and responsibilities...',
    tip: 'Charge nurse, preceptor, team lead roles',
  },
];

export function ResumeBoostersCard({
  resumeBoosters,
  onEdit,
  isEditable = true,
}) {
  const [expandedSection, setExpandedSection] = useState(null);

  // Count filled sections
  const filledSections = SECTIONS.filter(
    (section) => resumeBoosters?.[section.id]?.trim()
  ).length;

  // Toggle section expansion
  const toggleSection = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Star className="w-4 h-4" />
          Resume Boosters
        </CardTitle>
        <Badge variant="outline" className="text-xs">
          {filledSections}/{SECTIONS.length} sections
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Tip */}
        <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-xl text-sm text-blue-700">
          <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p>Specific examples work better than general descriptions. Include dates and outcomes when possible.</p>
        </div>

        {/* Sections */}
        <div className="space-y-2">
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            const content = resumeBoosters?.[section.id];
            const hasContent = content?.trim();
            const isExpanded = expandedSection === section.id;

            return (
              <div
                key={section.id}
                className="border rounded-xl overflow-hidden"
              >
                {/* Section Header */}
                <div
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && toggleSection(section.id)}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${hasContent ? 'text-green-600' : 'text-gray-400'}`} />
                    <span className="font-medium text-sm">{section.label}</span>
                    {hasContent && (
                      <CheckCircle2 className="w-3 h-3 text-green-600" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {isEditable && hasContent && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit?.('resumeBoosters', section.id);
                        }}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                      >
                        <Pencil className="w-3 h-3 text-gray-500" />
                      </button>
                    )}
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Section Content */}
                {isExpanded && (
                  <div className="px-3 pb-3 border-t bg-gray-50">
                    {hasContent ? (
                      <p className="text-sm text-gray-700 whitespace-pre-wrap pt-3">
                        {content}
                      </p>
                    ) : (
                      <div className="pt-3">
                        <p className="text-sm text-gray-500 italic mb-2">
                          {section.placeholder}
                        </p>
                        <p className="text-xs text-gray-400 mb-3">
                          Tip: {section.tip}
                        </p>
                        {isEditable && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onEdit?.('resumeBoosters', section.id)}
                          >
                            <Pencil className="w-3 h-3 mr-1" />
                            Add {section.label}
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default ResumeBoostersCard;
