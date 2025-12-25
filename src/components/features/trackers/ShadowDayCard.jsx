/**
 * ShadowDayCard - Displays a single shadow day entry
 *
 * Collapsible card that shows:
 * - Collapsed: Date, location, truncated notes preview
 * - Expanded: Full details including CRNA, hours, cases, skills, notes
 *
 * Click on card to expand, click chevron to collapse
 */

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LabelText } from '@/components/ui/label-text';
import {
  Pencil,
  Trash2,
  Clock,
  Stethoscope,
  ChevronDown,
  ChevronUp,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Truncate text to a max length with ellipsis
 */
function truncateText(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

export function ShadowDayCard({ entry, onEdit, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formattedDate = new Date(entry.date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Handle card click to toggle expand/collapse
  const handleCardClick = (e) => {
    // Don't toggle if clicking on buttons or links
    if (e.target.closest('button')) return;
    if (e.target.closest('a')) return;
    setIsExpanded(!isExpanded);
  };

  return (
    <Card
      className={cn(
        'group p-5 bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm hover:shadow-md transition-all duration-200',
        'cursor-pointer',
        isExpanded
          ? 'border-[1.5px] border-transparent bg-clip-padding'
          : 'border border-white/20'
      )}
      style={isExpanded ? {
        background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #f97316, #fb923c, #fdba74) border-box',
      } : undefined}
      onClick={handleCardClick}
    >
      {/* Header row - always visible */}
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-900 text-lg">
            {formattedDate}
          </div>
          <div className="text-sm text-gray-600 mt-0.5">{entry.location}</div>
          {/* Truncated notes preview when collapsed */}
          {entry.notes && !isExpanded && (
            <p className="text-sm text-gray-500 mt-2 line-clamp-2">
              {truncateText(entry.notes, 120)}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 ml-2">
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => { e.stopPropagation(); onEdit(entry); }}
              className="h-8 w-8 p-0"
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => { e.stopPropagation(); onDelete(entry.id); }}
              className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          {/* Expand/collapse toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
            className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Expandable details */}
      <div
        className={cn(
          'grid transition-all duration-200 ease-in-out',
          isExpanded
            ? 'grid-rows-[1fr] opacity-100 mt-4'
            : 'grid-rows-[0fr] opacity-0'
        )}
      >
        <div className="overflow-hidden space-y-4">
          {/* CRNA Info */}
          <div className="flex items-center gap-2">
            <LabelText className="text-orange-900 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-orange-700" />
              CRNA
            </LabelText>
            <span className="text-sm text-gray-700">{entry.crnaName || 'Not specified'}</span>
          </div>

          {/* Stats Row */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center">
                <Clock className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-900">{entry.hours || 0}</div>
                <div className="text-xs text-gray-500">hours</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center">
                <Stethoscope className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-900">{entry.cases || 0}</div>
                <div className="text-xs text-gray-500">cases</div>
              </div>
            </div>
          </div>

          {/* Skills */}
          {entry.skills && entry.skills.length > 0 && (
            <div>
              <LabelText className="text-orange-900 mb-2 block">
                Skills Observed
              </LabelText>
              <div className="flex flex-wrap gap-1.5">
                {entry.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200/50"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {entry.notes && (
            <div className="p-3 bg-orange-50/60 rounded-2xl border border-orange-100/50">
              <p className="text-sm text-gray-700">{entry.notes}</p>
            </div>
          )}

          {/* Email */}
          {entry.crnaEmail && (
            <div className="text-sm">
              <span className="text-gray-500">Email: </span>
              <a
                href={`mailto:${entry.crnaEmail}`}
                className="text-orange-600 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {entry.crnaEmail}
              </a>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

export default ShadowDayCard;
