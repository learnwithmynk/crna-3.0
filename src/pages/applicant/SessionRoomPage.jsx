/**
 * SessionRoomPage
 *
 * Live session room for applicants to join video calls and take notes.
 * Route: /marketplace/bookings/:bookingId/join
 */

import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Video,
  Clock,
  FileText,
  Download,
  ExternalLink,
  ChevronLeft,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  Play,
  Square,
  ChevronRight
} from 'lucide-react';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SessionNotesEditor } from '@/components/features/marketplace/SessionNotesEditor';
import { useBooking, BOOKING_STATUS, useBookingActions } from '@/hooks/useBookings';
import { cn } from '@/lib/utils';

/**
 * Get initials from name
 */
function getInitials(name) {
  if (!name) return '??';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Format duration as HH:MM:SS
 */
function formatDuration(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Session timer component
 */
function SessionTimer({ scheduledAt, duration, isStarted, onStart, onEnd }) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  // Calculate session times
  const sessionStart = useMemo(() => new Date(scheduledAt), [scheduledAt]);
  const sessionEnd = useMemo(() => {
    const end = new Date(sessionStart);
    end.setMinutes(end.getMinutes() + (duration || 60));
    return end;
  }, [sessionStart, duration]);

  // Update timer every second when active
  useEffect(() => {
    if (!timerActive) return;

    const interval = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive]);

  // Start timer
  const handleStart = () => {
    setTimerActive(true);
    onStart?.();
  };

  // End session
  const handleEnd = () => {
    setTimerActive(false);
    onEnd?.();
  };

  const totalDurationSeconds = (duration || 60) * 60;
  const progress = Math.min((elapsedSeconds / totalDurationSeconds) * 100, 100);
  const isOvertime = elapsedSeconds > totalDurationSeconds;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            <span className="font-medium">Session Timer</span>
          </div>
          <Badge variant={isOvertime ? 'destructive' : timerActive ? 'default' : 'secondary'}>
            {timerActive ? (isOvertime ? 'Overtime' : 'In Progress') : 'Not Started'}
          </Badge>
        </div>

        {/* Timer display */}
        <div className="text-center mb-4">
          <p className={cn(
            'text-4xl font-mono font-bold',
            isOvertime && 'text-red-600'
          )}>
            {formatDuration(elapsedSeconds)}
          </p>
          <p className="text-sm text-gray-500">
            / {formatDuration(totalDurationSeconds)} scheduled
          </p>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
          <div
            className={cn(
              'h-full transition-all',
              isOvertime ? 'bg-red-500' : 'bg-primary'
            )}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          {!timerActive ? (
            <Button onClick={handleStart} className="flex-1">
              <Play className="w-4 h-4 mr-2" />
              Start Session
            </Button>
          ) : (
            <Button onClick={handleEnd} variant="destructive" className="flex-1">
              <Square className="w-4 h-4 mr-2" />
              End Session
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Materials sidebar
 */
function MaterialsSidebar({ booking }) {
  const attachments = booking.attachments || [];
  const intakeData = booking.intakeData || {};

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="w-5 h-5 text-primary" />
          Session Materials
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Attachments */}
        {attachments.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Files</h4>
            <div className="space-y-2">
              {attachments.map(file => (
                <a
                  key={file.id}
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="text-sm flex-1 truncate">{file.name}</span>
                  <Download className="w-4 h-4 text-gray-400" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Intake data summary */}
        {Object.keys(intakeData).length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Request Details</h4>
            <dl className="space-y-1 text-sm">
              {Object.entries(intakeData).slice(0, 5).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <dt className="text-gray-500 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}
                  </dt>
                  <dd className="text-gray-900 text-right truncate max-w-[150px]">
                    {Array.isArray(value) ? value.length + ' items' : String(value)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {/* Applicant notes */}
        {booking.applicantNotes && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Your Note</h4>
            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
              {booking.applicantNotes}
            </p>
          </div>
        )}

        {attachments.length === 0 && !booking.applicantNotes && Object.keys(intakeData).length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            No materials for this session.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Loading skeleton
 */
function PageSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-64" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-48" />
          <Skeleton className="h-64" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-48" />
        </div>
      </div>
    </div>
  );
}

export function SessionRoomPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);

  // Fetch booking
  const { booking, loading, error } = useBooking(bookingId);
  const { completeBooking } = useBookingActions();

  // Check if session can be joined
  const canJoin = useMemo(() => {
    if (!booking) return false;
    if (booking.status !== BOOKING_STATUS.CONFIRMED) return false;
    if (!booking.scheduledAt) return false;

    const now = new Date();
    const sessionTime = new Date(booking.scheduledAt);
    const diffMinutes = (sessionTime - now) / (1000 * 60);

    // Can join 15 minutes before to 60 minutes after start
    return diffMinutes <= 15 && diffMinutes >= -60;
  }, [booking]);

  // Handle session start
  const handleSessionStart = () => {
    setSessionStarted(true);
  };

  // Handle session end
  const handleSessionEnd = async () => {
    setSessionEnded(true);

    // Mark booking as complete
    await completeBooking(bookingId);

    // Redirect to review page after delay
    setTimeout(() => {
      navigate(`/marketplace/bookings/${bookingId}/review`);
    }, 2000);
  };

  // Breadcrumbs
  const breadcrumbs = [
    { label: 'Marketplace', href: '/marketplace' },
    { label: 'My Bookings', href: '/marketplace/my-bookings' },
    { label: 'Session Room' }
  ];

  // Error state
  if (error) {
    return (
      <PageWrapper breadcrumbs={breadcrumbs}>
        <Card className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Session Not Found</h2>
          <p className="text-gray-600 mb-4">
            This session doesn't exist or you don't have access to join it.
          </p>
          <Link to="/marketplace/my-bookings">
            <Button>Back to My Bookings</Button>
          </Link>
        </Card>
      </PageWrapper>
    );
  }

  // Loading state
  if (loading) {
    return (
      <PageWrapper breadcrumbs={breadcrumbs}>
        <PageSkeleton />
      </PageWrapper>
    );
  }

  // Can't join yet
  if (!canJoin) {
    return (
      <PageWrapper breadcrumbs={breadcrumbs}>
        <Card className="p-8 text-center max-w-lg mx-auto">
          <Clock className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Session Not Available Yet</h2>
          <p className="text-gray-600 mb-4">
            You can join the session 15 minutes before the scheduled start time.
          </p>
          {booking.scheduledAt && (
            <p className="text-sm text-gray-500 mb-4">
              Scheduled: {new Date(booking.scheduledAt).toLocaleString()}
            </p>
          )}
          <Link to={`/marketplace/bookings/${bookingId}`}>
            <Button variant="outline">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Booking Details
            </Button>
          </Link>
        </Card>
      </PageWrapper>
    );
  }

  // Session ended
  if (sessionEnded) {
    return (
      <PageWrapper breadcrumbs={breadcrumbs}>
        <Card className="p-8 text-center max-w-lg mx-auto">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Session Complete!</h2>
          <p className="text-gray-600 mb-4">
            Great work! Taking you to leave a review...
          </p>
          <div className="animate-pulse">
            <ChevronRight className="w-8 h-8 mx-auto text-gray-400" />
          </div>
        </Card>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper breadcrumbs={breadcrumbs}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {booking.serviceSnapshot?.title || 'Mentoring Session'}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="bg-primary/10 text-xs">
                  {getInitials(booking.providerSnapshot?.name)}
                </AvatarFallback>
              </Avatar>
              <span className="text-gray-600">
                with {booking.providerSnapshot?.name}
              </span>
            </div>
          </div>

          <Link to={`/marketplace/bookings/${bookingId}`}>
            <Button variant="outline" size="sm">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Details
            </Button>
          </Link>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Video and Notes */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video join card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Video className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Join Video Call</h3>
                    <p className="text-sm text-gray-600">
                      Click below to join your mentor's video call
                    </p>
                  </div>
                </div>

                {booking.meetingUrl ? (
                  <Button asChild className="w-full" size="lg">
                    <a
                      href={booking.meetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-5 h-5 mr-2" />
                      Join {booking.meetingUrl.includes('zoom') ? 'Zoom' : 'Video'} Call
                    </a>
                  </Button>
                ) : (
                  <Alert variant="warning">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      No video link available. Contact your mentor for the meeting link.
                    </AlertDescription>
                  </Alert>
                )}

                <p className="text-xs text-gray-500 mt-3 text-center">
                  The video call opens in a new tab. Keep this page open for notes.
                </p>
              </CardContent>
            </Card>

            {/* Session notes (split view) */}
            <SessionNotesEditor
              bookingId={bookingId}
              initialNotes={booking.sessionNotes}
              className="min-h-[400px]"
            />
          </div>

          {/* Right column - Timer and Materials */}
          <div className="space-y-6">
            {/* Session timer */}
            <SessionTimer
              scheduledAt={booking.scheduledAt}
              duration={booking.duration}
              isStarted={sessionStarted}
              onStart={handleSessionStart}
              onEnd={handleSessionEnd}
            />

            {/* Materials sidebar */}
            <MaterialsSidebar booking={booking} data-testid="materials-sidebar" />

            {/* Quick actions */}
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-3">Quick Actions</h4>
                <div className="space-y-2">
                  <Link to={`/marketplace/messages?booking=${bookingId}`} className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Message Mentor
                    </Button>
                  </Link>
                  <Link to={`/marketplace/bookings/${bookingId}`} className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="w-4 h-4 mr-2" />
                      View Full Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

export default SessionRoomPage;
