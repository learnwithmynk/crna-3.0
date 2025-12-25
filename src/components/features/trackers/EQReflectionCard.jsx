/**
 * EQReflectionCard Component
 *
 * Displays a single EQ/Leadership reflection entry with:
 * - Date and title
 * - Category badges
 * - Expandable reflection sections
 * - Edit/delete actions
 */

import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Edit2,
  Trash2,
  Scale,
  Users,
  Heart,
  HeartHandshake,
  RefreshCw,
  Crown,
  Brain,
  Globe,
  Shield,
  BadgeCheck,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LabelText } from '@/components/ui/label-text';
import { cn } from '@/lib/utils';
import { getCategoryInfo } from '@/data/mockEQReflections';

// Icon mapping
const CATEGORY_ICONS = {
  Scale,
  Users,
  Heart,
  HeartHandshake,
  RefreshCw,
  Crown,
  Brain,
  Globe,
  Shield,
  BadgeCheck,
};

/**
 * Format date to readable string
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Section labels for structured reflection
 */
const SECTION_LABELS = {
  situation: 'The Situation',
  emotions: 'What I Felt',
  response: 'How I Responded',
  different: 'What I\'d Do Differently',
  learned: 'What I Learned',
};

export function EQReflectionCard({
  reflection,
  onEdit,
  onDelete,
  className,
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Get category info for badges
  const categoryInfos = reflection.categories.map(getCategoryInfo).filter(Boolean);

  // Check if we have structured reflection content
  const hasStructuredReflection = reflection.structuredReflection &&
    Object.values(reflection.structuredReflection).some((v) => v?.trim());

  // Handle card click to toggle expand/collapse
  const handleCardClick = (e) => {
    // Don't toggle if clicking on buttons
    if (e.target.closest('button')) return;
    if (hasStructuredReflection) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <Card
      className={cn(
        'group p-4 bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm hover:shadow-md transition-all duration-200',
        hasStructuredReflection && 'cursor-pointer',
        isExpanded
          ? 'border-[1.5px] border-transparent bg-clip-padding'
          : 'border border-white/20',
        className
      )}
      style={isExpanded ? {
        background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #a855f7, #9333ea, #7c3aed) border-box',
      } : undefined}
      onClick={handleCardClick}
    >
      {/* Header Row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Date */}
          <p className="text-xs text-gray-500 mb-1">
            {formatDate(reflection.date)}
          </p>

          {/* Title */}
          <h4 className="font-medium text-gray-900 leading-snug">
            {reflection.title}
          </h4>

          {/* Category Badges */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {categoryInfos.map((cat) => {
              const IconComponent = CATEGORY_ICONS[cat.icon];
              return (
                <Badge
                  key={cat.value}
                  variant="outline"
                  className={cn('text-xs', cat.color)}
                >
                  {IconComponent && <IconComponent className="w-3 h-3 mr-1" />}
                  {cat.label}
                </Badge>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => { e.stopPropagation(); onEdit(reflection); }}
                className="w-8 h-8 text-gray-400 hover:text-gray-600"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => { e.stopPropagation(); onDelete(reflection.id); }}
                className="w-8 h-8 text-gray-400 hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
          {/* Expand/collapse toggle */}
          {hasStructuredReflection && (
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
          )}
        </div>
      </div>

      {/* Preview (collapsed) - show truncated situation */}
      {hasStructuredReflection && !isExpanded && reflection.structuredReflection?.situation && (
        <p className="text-sm text-gray-600 mt-3 line-clamp-2">
          {reflection.structuredReflection.situation}
        </p>
      )}

      {/* Expandable details */}
      {hasStructuredReflection && (
        <div
          className={cn(
            'grid transition-all duration-200 ease-in-out',
            isExpanded
              ? 'grid-rows-[1fr] opacity-100 mt-4'
              : 'grid-rows-[0fr] opacity-0'
          )}
        >
          <div className="overflow-hidden">
            <div className="space-y-4 pt-4 border-t border-gray-100">
              {Object.entries(SECTION_LABELS).map(([key, label]) => {
                const content = reflection.structuredReflection?.[key];
                if (!content?.trim()) return null;

                return (
                  <div key={key}>
                    <h5 className="text-xs font-semibold text-purple-900 uppercase tracking-widest mb-1">
                      {label}
                    </h5>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {content}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

export default EQReflectionCard;
