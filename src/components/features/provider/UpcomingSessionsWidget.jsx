/**
 * UpcomingSessionsWidget Component
 *
 * Displays the provider's next upcoming sessions on the dashboard.
 * Shows session details including applicant info, service type, and timing.
 * Enables providers to join video sessions when they're ready to start.
 *
 * Features:
 * - Shows next 3 upcoming sessions
 * - Relative time display ("In 2 hours", "Tomorrow at 3pm")
 * - "Join Video" button appears 5 minutes before session
 * - Empty state when no sessions scheduled
 * - Link to full calendar view
 */

import { Video, Calendar, ChevronRight, Coffee } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { formatRelativeDateTime } from '@/lib/dateFormatters';
import { cn } from '@/lib/utils';

// Mock data for development
const MOCK_SESSIONS = [
  {
    id: 'session-1',
    applicantName: 'Sarah Johnson',
    applicantAvatar: null,
    service: 'Mock Interview',
    scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    videoLink: 'https://zoom.us/j/123456789',
    duration: 60,
  },
  {
    id: 'session-2',
    applicantName: 'Michael Chen',
    applicantAvatar: null,
    service: 'Essay Review Session',
    scheduledAt: new Date(Date.now() + 26 * 60 * 60 * 1000), // Tomorrow
    videoLink: 'https://zoom.us/j/987654321',
    duration: 30,
  },
  {
    id: 'session-3',
    applicantName: 'Emily Rodriguez',
    applicantAvatar: null,
    service: 'One-on-One Coaching',
    scheduledAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
    videoLink: 'https://zoom.us/j/456789123',
    duration: 45,
  },
];

/**
 * Get initials from name for avatar fallback
 * @param {string} name - Full name
 * @returns {string} Initials (e.g., "JD")
 */
function getInitials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Check if session is ready to join (within 5 minutes of start time)
 * @param {Date} scheduledAt - Session start time
 * @returns {boolean}
 */
function canJoinSession(scheduledAt) {
  const now = new Date();
  const diffMs = scheduledAt - now;
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  // Allow joining 5 minutes before start time
  return diffMinutes <= 5 && diffMinutes >= -30; // Also allow 30 min after start
}

/**
 * Session Card Component
 */
function SessionCard({ session, onJoinVideo }) {
  const canJoin = canJoinSession(session.scheduledAt);
  const relativeTime = formatRelativeDateTime(session.scheduledAt);

  return (
    <div className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors">
      {/* Applicant Avatar */}
      <Avatar className="w-10 h-10 flex-shrink-0">
        <AvatarImage src={session.applicantAvatar} alt={session.applicantName} />
        <AvatarFallback>{getInitials(session.applicantName)}</AvatarFallback>
      </Avatar>

      {/* Session Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="font-medium text-gray-900 text-sm">
              {session.applicantName}
            </h4>
            <p className="text-xs text-gray-600 mt-0.5">{session.service}</p>
          </div>
        </div>

        {/* Time and Duration */}
        <div className="flex items-center gap-2 mt-2 text-xs">
          <span
            className={cn(
              'font-medium',
              canJoin && 'text-green-600',
              !canJoin && 'text-gray-600'
            )}
          >
            {relativeTime}
          </span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-500">{session.duration} min</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-3">
          {canJoin ? (
            <Button
              size="sm"
              onClick={() => onJoinVideo(session.id)}
              className="bg-green-600 hover:bg-green-700 text-white gap-1.5"
            >
              <Video className="w-3.5 h-3.5" />
              Join Video
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900 gap-1"
              asChild
            >
              <a href={`/provider/sessions/${session.id}`}>
                View Details
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Empty State Component
 */
function EmptyState() {
  return (
    <div className="text-center py-8">
      <Coffee className="w-12 h-12 mx-auto text-gray-300 mb-3" />
      <h4 className="text-sm font-medium text-gray-900 mb-1">
        No upcoming sessions
      </h4>
      <p className="text-xs text-gray-500">Time to relax!</p>
    </div>
  );
}

/**
 * UpcomingSessionsWidget Component
 */
export function UpcomingSessionsWidget({
  sessions = MOCK_SESSIONS,
  onJoinVideo = (sessionId) => console.log('Join video:', sessionId),
  className,
}) {
  // Sort sessions by scheduled time and take first 3
  const upcomingSessions = [...sessions]
    .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt))
    .slice(0, 3);

  const hasSessions = upcomingSessions.length > 0;

  return (
    <Card className={cn('', className)} data-testid="upcoming-sessions-widget">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            Upcoming Sessions
          </CardTitle>
          {hasSessions && (
            <Button variant="ghost" size="sm" asChild>
              <a
                href="/provider/calendar"
                className="text-xs text-gray-600 hover:text-gray-900"
              >
                View Calendar
                <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </a>
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {hasSessions ? (
          <div className="space-y-2">
            {upcomingSessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onJoinVideo={onJoinVideo}
              />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}

        {/* View Calendar link for empty state */}
        {!hasSessions && (
          <div className="mt-4 text-center">
            <Button variant="outline" size="sm" asChild>
              <a href="/provider/calendar">
                <Calendar className="w-3.5 h-3.5 mr-1.5" />
                View Calendar
              </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default UpcomingSessionsWidget;
