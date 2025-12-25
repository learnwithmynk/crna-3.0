/**
 * Events Summary Card
 *
 * Displays event attendance summary:
 * - Total events logged
 * - Event names (truncated)
 * - Category checkboxes showing what types attended
 *
 * Removed: Target program engagement bar, contacts count
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronRight, CheckSquare, Square } from 'lucide-react';

// Event categories for checkboxes
const EVENT_CATEGORIES = [
  { id: 'aana_state', label: 'AANA State Meeting' },
  { id: 'aana_national', label: 'AANA National Meeting' },
  { id: 'open_house', label: 'School Event' },
  { id: 'info_session', label: 'Info Session' },
  { id: 'networking', label: 'Nursing Conference' },
];

export function EventsSummaryCard({
  eventStats,
  eventNames = [],
  onViewTracker,
}) {
  // Empty state
  if (!eventStats || eventStats.totalLogged === 0) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="w-4 h-4" />
            Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-gray-500 text-sm">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p>No events logged yet</p>
            <p className="text-xs mt-1">Track conferences and info sessions</p>
            <Button size="sm" variant="outline" className="mt-3" onClick={onViewTracker}>
              Log Event
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const {
    totalLogged,
    categoryBreakdown = {},
  } = eventStats;

  // Get attended categories
  const attendedCategories = new Set(Object.keys(categoryBreakdown));

  // Truncate event name for display
  const truncateName = (name, maxLength = 35) => {
    if (!name) return '';
    return name.length > maxLength ? `${name.slice(0, maxLength)}...` : name;
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Calendar className="w-4 h-4" />
          Events
        </CardTitle>
        <Button variant="ghost" size="sm" className="h-7 px-2" onClick={onViewTracker}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Events Count - matching Shadowing style */}
        <div className="p-3 bg-gray-50 rounded-xl text-center">
          <p className="text-2xl font-bold text-gray-800">{totalLogged}</p>
          <p className="text-xs text-gray-500">
            {totalLogged === 1 ? 'Event' : 'Events'} Logged
          </p>
        </div>

        {/* Event Names */}
        {eventNames.length > 0 && (
          <div className="space-y-1">
            {eventNames.slice(0, 3).map((name, index) => (
              <p key={index} className="text-xs text-gray-600 truncate text-center">
                {truncateName(name)}
              </p>
            ))}
            {eventNames.length > 3 && (
              <p className="text-[10px] text-gray-400 text-center">
                +{eventNames.length - 3} more
              </p>
            )}
          </div>
        )}

        {/* Category Checkboxes - compact grid */}
        <div className="space-y-1.5 pt-2 border-t">
          <p className="text-[10px] font-medium text-gray-500 text-center">Types attended:</p>
          <div className="grid grid-cols-2 gap-1">
            {EVENT_CATEGORIES.map((cat) => {
              const isAttended = attendedCategories.has(cat.id);
              return (
                <div
                  key={cat.id}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] ${
                    isAttended ? 'bg-green-50' : 'bg-gray-50'
                  }`}
                >
                  {isAttended ? (
                    <CheckSquare className="w-3 h-3 text-green-600 shrink-0" />
                  ) : (
                    <Square className="w-3 h-3 text-gray-300 shrink-0" />
                  )}
                  <span className={`truncate ${isAttended ? 'text-gray-700' : 'text-gray-400'}`}>
                    {cat.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default EventsSummaryCard;
