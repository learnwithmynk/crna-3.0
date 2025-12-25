/**
 * UpcomingEventsWidget - Compact list of upcoming saved and CRNA Club events
 *
 * Shows user's saved events + CRNA Club events in a compact list view.
 * Filters out marketplace appointments (those show in Calendar).
 *
 * Used in: DashboardPage sidebar
 */

import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, ChevronRight } from 'lucide-react';

// TODO: Replace with API call
import { mockCalendarEvents } from '@/data/mockActivity';

const EVENT_LABELS = {
  crna_club: 'CRNA Club',
  saved: 'Saved',
};

export function UpcomingEventsWidget({ maxEvents = 3 }) {
  // Filter to only saved events and CRNA Club events, exclude marketplace
  const upcomingEvents = mockCalendarEvents
    .filter(event => event.type === 'crna_club' || event.type === 'saved')
    .filter(event => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, maxEvents);

  // Format date for display
  const formatEventDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Check if today
    if (date.toDateString() === now.toDateString()) {
      return `Today, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    }

    // Check if tomorrow
    if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    }

    // Otherwise show date
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  if (upcomingEvents.length === 0) {
    return (
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="w-4 h-4" />
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="text-center py-4">
            <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No upcoming events</p>
            <Link
              to="/events"
              className="text-sm text-purple-600 hover:text-purple-700 hover:underline mt-2 inline-block"
            >
              Browse events
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Calendar className="w-4 h-4" />
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="space-y-2">
          {upcomingEvents.map((event) => (
            <Link
              key={event.id}
              to={event.url || '/events'}
              className="block p-2 -mx-2 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-1 group-hover:text-purple-700">
                    {event.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {formatEventDate(event.date)}
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className={`text-xs shrink-0 ${
                    event.type === 'crna_club'
                      ? 'bg-primary/20 text-primary-foreground'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {EVENT_LABELS[event.type]}
                </Badge>
              </div>
            </Link>
          ))}
        </div>

        {/* View All link */}
        <Link
          to="/events"
          className="flex items-center justify-center gap-1 mt-3 pt-3 border-t text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          View all events
          <ChevronRight className="w-4 h-4" />
        </Link>
      </CardContent>
    </Card>
  );
}

export default UpcomingEventsWidget;
