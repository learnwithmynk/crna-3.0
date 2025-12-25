/**
 * EntryCard Component
 *
 * Individual tracker entry card with tags, notes, and edit/delete actions.
 * Used in EntryList for all tracker types.
 *
 * Example:
 * <EntryCard
 *   entry={{ id: '1', notes: 'Great event', tags: ['networking'] }}
 *   onEdit={() => {}}
 *   onDelete={() => {}}
 *   renderContent={(entry) => <CustomContent entry={entry} />}
 * />
 */

import { Pencil, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function EntryCard({
  entry,
  onEdit,
  onDelete,
  renderContent,
  tagFormatter = (tag) => tag,
  maxTags = 5,
}) {
  const tags = entry.tags || [];
  const visibleTags = tags.slice(0, maxTags);
  const hiddenCount = tags.length - maxTags;

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Custom content area (title, specific fields) */}
          {renderContent && renderContent(entry)}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {visibleTags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tagFormatter(tag)}
                </Badge>
              ))}
              {hiddenCount > 0 && (
                <Badge variant="outline" className="text-xs">
                  +{hiddenCount} more
                </Badge>
              )}
            </div>
          )}

          {/* Notes preview */}
          {entry.notes && (
            <p className="text-sm text-gray-600 line-clamp-2 mt-2">
              {entry.notes}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(entry)}
            className="min-w-[44px] min-h-[44px] text-gray-400 hover:text-gray-600"
            aria-label="Edit entry"
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(entry.id)}
            className="min-w-[44px] min-h-[44px] text-gray-400 hover:text-red-600 hover:bg-red-50"
            aria-label="Delete entry"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
