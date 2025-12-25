/**
 * IncomingRequestsWidget Component
 *
 * Displays pending booking requests for provider dashboard with countdown timers.
 * Shows first 3 pending requests with quick accept/decline actions.
 * Countdown timer changes color based on urgency (48h deadline):
 * - Green: > 24 hours remaining
 * - Yellow/Orange: 12-24 hours remaining
 * - Red: < 12 hours remaining
 */

import { useState, useEffect } from 'react';
import { Clock, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

// Mock data for development
const MOCK_REQUESTS = [
  {
    id: 'req-1',
    applicantName: 'Sarah M.',
    applicantAvatar: null,
    service: 'Mock Interview',
    price: 100,
    submittedAt: new Date(Date.now() - 20 * 60 * 60 * 1000), // 20 hours ago
    preferredTimes: ['Mon 2pm', 'Tue 10am']
  },
  {
    id: 'req-2',
    applicantName: 'Jennifer K.',
    applicantAvatar: null,
    service: 'Essay Review',
    price: 75,
    submittedAt: new Date(Date.now() - 40 * 60 * 60 * 1000), // 40 hours ago
    preferredTimes: ['Wed 1pm', 'Thu 3pm']
  },
  {
    id: 'req-3',
    applicantName: 'Rachel T.',
    applicantAvatar: null,
    service: '1:1 Coaching Session',
    price: 150,
    submittedAt: new Date(Date.now() - 10 * 60 * 60 * 1000), // 10 hours ago
    preferredTimes: ['Fri 10am', 'Sat 2pm']
  }
];

// Calculate time remaining and format display
function useCountdown(submittedAt) {
  const [timeRemaining, setTimeRemaining] = useState(null);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const deadlineMs = 48 * 60 * 60 * 1000; // 48 hours in milliseconds
      const now = new Date();
      const elapsed = now - submittedAt;
      const remaining = deadlineMs - elapsed;

      if (remaining <= 0) {
        return {
          hours: 0,
          minutes: 0,
          total: 0,
          expired: true
        };
      }

      const totalHours = Math.floor(remaining / (60 * 60 * 1000));
      const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));

      return {
        hours: totalHours,
        minutes,
        total: remaining,
        expired: false
      };
    };

    // Initial calculation
    setTimeRemaining(calculateTimeRemaining());

    // Update every minute
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 60000);

    return () => clearInterval(interval);
  }, [submittedAt]);

  return timeRemaining;
}

// Format countdown display and determine urgency color
function getCountdownDisplay(timeRemaining) {
  if (!timeRemaining) {
    return { text: 'Calculating...', color: 'text-gray-500' };
  }

  if (timeRemaining.expired) {
    return { text: 'Expired', color: 'text-red-600 font-semibold' };
  }

  const { hours, minutes } = timeRemaining;
  const text = `${hours}h ${minutes}m left to respond`;

  // Determine color based on urgency
  let color;
  if (hours > 24) {
    color = 'text-green-600'; // Green: > 24 hours
  } else if (hours >= 12) {
    color = 'text-orange-500'; // Yellow/Orange: 12-24 hours
  } else {
    color = 'text-red-600'; // Red: < 12 hours
  }

  return { text, color };
}

function RequestItem({ request, onAccept, onDecline }) {
  const timeRemaining = useCountdown(request.submittedAt);
  const countdown = getCountdownDisplay(timeRemaining);
  const commissionRate = 0.20;
  const providerEarnings = request.price * (1 - commissionRate);

  // Get initials for avatar fallback
  const initials = request.applicantName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="border-b border-gray-100 last:border-0 py-4 first:pt-0 last:pb-0">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <Avatar className="h-10 w-10 flex-shrink-0">
          {request.applicantAvatar && (
            <AvatarImage src={request.applicantAvatar} alt={request.applicantName} />
          )}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>

        {/* Request details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <p className="font-medium text-gray-900">{request.applicantName}</p>
              <p className="text-sm text-gray-600">{request.service}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-semibold text-gray-900">
                You'll earn ${providerEarnings.toFixed(0)}
              </p>
            </div>
          </div>

          {/* Countdown timer */}
          <div className="flex items-center gap-1 mb-3">
            <Clock className={cn('w-4 h-4', countdown.color)} />
            <span className={cn('text-sm font-medium', countdown.color)}>
              {countdown.text}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => onAccept(request.id)}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              Accept
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDecline(request.id)}
              className="flex-1"
            >
              Decline
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
        <Clock className="w-8 h-8 text-green-600" />
      </div>
      <p className="text-sm text-gray-600">
        No pending requests - great job staying on top of things!
      </p>
    </div>
  );
}

export function IncomingRequestsWidget({
  requests = MOCK_REQUESTS,
  onAccept = (id) => console.log('Accept request:', id),
  onDecline = (id) => console.log('Decline request:', id),
  className
}) {
  // Show only first 3 requests
  const displayRequests = requests.slice(0, 3);
  const hasMoreRequests = requests.length > 3;

  return (
    <Card
      className={cn('shadow-sm hover:shadow-md transition-shadow', className)}
      data-testid="incoming-requests-widget"
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Incoming Requests
            {requests.length > 0 && (
              <span className="ml-2 inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-600 rounded-full">
                {requests.length}
              </span>
            )}
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {displayRequests.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Request list */}
            <div className="space-y-0">
              {displayRequests.map((request) => (
                <RequestItem
                  key={request.id}
                  request={request}
                  onAccept={onAccept}
                  onDecline={onDecline}
                />
              ))}
            </div>

            {/* View all link */}
            {hasMoreRequests && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <a
                  href="/provider/requests"
                  className="text-sm font-medium text-primary hover:underline flex items-center justify-center gap-1 group"
                >
                  View All Requests ({requests.length})
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default IncomingRequestsWidget;
