/**
 * EntryList Component
 *
 * List of tracker entries grouped by date with sticky date headers.
 * Used for all tracker types (events, shadow days, clinical, EQ).
 *
 * Example:
 * <EntryList
 *   entries={events}
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 *   renderEntryContent={(entry) => <EventContent entry={entry} />}
 *   emptyState={<EmptyState ... />}
 * />
 */

import { Calendar } from 'lucide-react';
import { EntryCard } from './EntryCard';

/**
 * Format date for display in header
 */
function formatDateHeader(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Reset times for comparison
  today.setHours(0, 0, 0, 0);
  yesterday.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);

  if (compareDate.getTime() === today.getTime()) {
    return 'Today';
  }
  if (compareDate.getTime() === yesterday.getTime()) {
    return 'Yesterday';
  }

  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
  });
}

/**
 * Group entries by date (YYYY-MM-DD)
 */
function groupEntriesByDate(entries) {
  const grouped = {};

  entries.forEach((entry) => {
    const dateKey = new Date(entry.date).toISOString().split('T')[0];
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(entry);
  });

  // Sort by date descending (newest first)
  const sortedKeys = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return sortedKeys.map((dateKey) => ({
    dateKey,
    entries: grouped[dateKey],
  }));
}

export function EntryList({
  entries,
  onEdit,
  onDelete,
  renderEntryContent,
  tagFormatter,
  maxTags,
  emptyState,
}) {
  if (!entries || entries.length === 0) {
    return emptyState || null;
  }

  const groupedEntries = groupEntriesByDate(entries);

  return (
    <div className="space-y-6">
      {groupedEntries.map(({ dateKey, entries: dateEntries }) => (
        <div key={dateKey}>
          {/* Date Header */}
          <div className="flex items-center gap-2 mb-3 sticky top-0 bg-gradient-to-r from-pink-50/90 to-purple-50/90 backdrop-blur-sm py-2 -mx-4 px-4 md:mx-0 md:px-0 z-10">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-600">
              {formatDateHeader(dateKey)}
            </span>
            <span className="text-xs text-gray-400">
              ({dateEntries.length} {dateEntries.length === 1 ? 'entry' : 'entries'})
            </span>
          </div>

          {/* Entries for this date */}
          <div className="space-y-3">
            {dateEntries.map((entry) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                onEdit={onEdit}
                onDelete={onDelete}
                renderContent={renderEntryContent}
                tagFormatter={tagFormatter}
                maxTags={maxTags}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
