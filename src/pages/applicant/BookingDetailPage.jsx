/**
 * BookingDetailPage
 *
 * Full booking detail page for applicants.
 * Shows booking summary, prep materials, session notes, and actions.
 * Route: /marketplace/bookings/:bookingId/details
 */

import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  MessageSquare,
  FileText,
  Download,
  ChevronLeft,
  AlertCircle,
  CheckCircle,
  XCircle,
  Timer,
  ExternalLink,
  CalendarPlus
} from 'lucide-react';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { WhatToExpectCard, HowToPrepareCard } from '@/components/features/marketplace/WhatToExpectCard';
import { SessionNotesEditor } from '@/components/features/marketplace/SessionNotesEditor';
import { CancelBookingModal } from '@/components/features/marketplace/CancelBookingModal';
import { useBooking, BOOKING_STATUS, useBookingActions } from '@/hooks/useBookings';
import { cn } from '@/lib/utils';

/**
 * Status badge configuration
 */
const STATUS_CONFIG = {
  [BOOKING_STATUS.PENDING_PROVIDER]: {
    label: 'Pending Mentor Response',
    variant: 'warning',
    icon: Timer
  },
  [BOOKING_STATUS.CONFIRMED]: {
    label: 'Confirmed',
    variant: 'success',
    icon: CheckCircle
  },
  [BOOKING_STATUS.COMPLETED]: {
    label: 'Completed',
    variant: 'default',
    icon: CheckCircle
  },
  [BOOKING_STATUS.CANCELLED]: {
    label: 'Cancelled',
    variant: 'destructive',
    icon: XCircle
  },
  [BOOKING_STATUS.DECLINED]: {
    label: 'Declined',
    variant: 'destructive',
    icon: XCircle
  }
};

/**
 * Format date for display
 */
function formatDate(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Format time for display
 */
function formatTime(dateStr, timezone) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short'
  });
}

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
 * Check if session is joinable (within 5 minutes of start)
 */
function isJoinable(scheduledAt) {
  if (!scheduledAt) return false;
  const now = new Date();
  const sessionTime = new Date(scheduledAt);
  const diffMinutes = (sessionTime - now) / (1000 * 60);
  return diffMinutes <= 5 && diffMinutes >= -60; // 5 min before to 60 min after
}

/**
 * Generate Google Calendar link
 */
function getGoogleCalendarLink(booking) {
  if (!booking.scheduledAt) return null;

  const startTime = new Date(booking.scheduledAt);
  const endTime = new Date(startTime.getTime() + (booking.duration || 60) * 60 * 1000);

  const formatForCal = (date) => date.toISOString().replace(/-|:|\.\d{3}/g, '');

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${booking.serviceSnapshot?.title || 'Mentoring Session'} with ${booking.providerSnapshot?.name || 'Mentor'}`,
    dates: `${formatForCal(startTime)}/${formatForCal(endTime)}`,
    details: `CRNA Club mentoring session.\n\nJoin link: ${booking.meetingUrl || 'Link will be provided'}`,
    location: booking.meetingUrl || ''
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Loading skeleton
 */
function PageSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-32 w-full" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
      <Skeleton className="h-48 w-full" />
    </div>
  );
}

/**
 * Booking summary card
 */
function BookingSummaryCard({ booking }) {
  const statusConfig = STATUS_CONFIG[booking.status] || STATUS_CONFIG[BOOKING_STATUS.CONFIRMED];
  const StatusIcon = statusConfig.icon;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Service info */}
          <div className="flex-1">
            <div className="flex items-start gap-3 mb-4">
              <Badge variant={statusConfig.variant} className="flex items-center gap-1">
                <StatusIcon className="w-3 h-3" />
                {statusConfig.label}
              </Badge>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {booking.serviceSnapshot?.title || 'Mentoring Session'}
            </h2>

            {/* Provider info */}
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10">
                  {getInitials(booking.providerSnapshot?.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">with {booking.providerSnapshot?.name}</p>
                <p className="text-sm text-gray-500">{booking.providerSnapshot?.program}</p>
              </div>
            </div>

            {/* Session details */}
            <div className="space-y-2 text-sm">
              {booking.scheduledAt && (
                <>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(booking.scheduledAt)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>
                      {formatTime(booking.scheduledAt, booking.timezone)}
                      {booking.duration && ` (${booking.duration} min)`}
                    </span>
                  </div>
                </>
              )}
              {booking.turnaroundDeadline && !booking.scheduledAt && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Due by {formatDate(booking.turnaroundDeadline)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Price summary */}
          <div className="md:text-right md:border-l md:pl-6">
            <p className="text-sm text-gray-500">Total Paid</p>
            <p className="text-2xl font-bold text-gray-900">
              ${booking.price}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Booking ID: {booking.id}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Pending status alert with countdown
 */
function PendingAlert({ timeRemaining }) {
  if (!timeRemaining) return null;

  const { expired, hours, minutes } = timeRemaining;

  if (expired) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          This booking request has expired. The mentor did not respond within 48 hours.
          Your payment authorization has been released.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert variant="warning">
      <Timer className="h-4 w-4" />
      <AlertDescription>
        Waiting for mentor response. <strong>{hours}h {minutes}m</strong> remaining.
        Your payment is authorized but won't be charged until the mentor accepts.
      </AlertDescription>
    </Alert>
  );
}

/**
 * Attachments/materials section
 */
function AttachmentsSection({ attachments }) {
  if (!attachments || attachments.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="w-5 h-5 text-primary" />
          Your Materials
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {attachments.map(file => (
            <div
              key={file.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium text-sm">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    Uploaded {new Date(file.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <a href={file.url} target="_blank" rel="noopener noreferrer">
                  <Download className="w-4 h-4" />
                </a>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Intake data summary
 */
function IntakeDataCard({ intakeData, serviceType }) {
  if (!intakeData || Object.keys(intakeData).length === 0) return null;

  const formatKey = (key) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/^./, str => str.toUpperCase());
  };

  const formatValue = (value) => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    return value;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="w-5 h-5 text-primary" />
          Your Request Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="space-y-2">
          {Object.entries(intakeData).map(([key, value]) => (
            <div key={key} className="flex flex-col sm:flex-row sm:justify-between">
              <dt className="text-sm font-medium text-gray-600">
                {formatKey(key)}
              </dt>
              <dd className="text-sm text-gray-900 sm:text-right">
                {formatValue(value)}
              </dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}

export function BookingDetailPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [showCancelModal, setShowCancelModal] = useState(false);

  // Fetch booking
  const { booking, loading, error, timeRemaining } = useBooking(bookingId);

  // Check if joinable
  const canJoin = booking?.status === BOOKING_STATUS.CONFIRMED &&
    booking?.meetingUrl &&
    isJoinable(booking.scheduledAt);

  // Check if can cancel
  const canCancel = booking?.status === BOOKING_STATUS.PENDING_PROVIDER ||
    (booking?.status === BOOKING_STATUS.CONFIRMED && booking?.scheduledAt &&
      new Date(booking.scheduledAt) > new Date());

  // Check if can leave review
  const canReview = booking?.status === BOOKING_STATUS.COMPLETED && !booking?.applicantReviewId;

  // Breadcrumbs
  const breadcrumbs = [
    { label: 'Marketplace', href: '/marketplace' },
    { label: 'My Bookings', href: '/marketplace/my-bookings' },
    { label: booking?.serviceSnapshot?.title || 'Booking Details' }
  ];

  // Error state
  if (error) {
    return (
      <PageWrapper breadcrumbs={breadcrumbs}>
        <Card className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Booking Not Found</h2>
          <p className="text-gray-600 mb-4">
            This booking doesn't exist or you don't have access to view it.
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

  const serviceType = booking.serviceSnapshot?.type;

  return (
    <PageWrapper breadcrumbs={breadcrumbs}>
      <div className="max-w-4xl mx-auto">
        {/* Back link */}
        <Link
          to="/marketplace/my-bookings"
          className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to My Bookings
        </Link>

        {/* Pending alert */}
        {booking.status === BOOKING_STATUS.PENDING_PROVIDER && (
          <div className="mb-6">
            <PendingAlert timeRemaining={timeRemaining} />
          </div>
        )}

        {/* Booking summary */}
        <BookingSummaryCard booking={booking} />

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 mt-4">
          {canJoin && (
            <Button asChild>
              <a href={booking.meetingUrl} target="_blank" rel="noopener noreferrer">
                <Video className="w-4 h-4 mr-2" />
                Join Session
              </a>
            </Button>
          )}

          {booking.scheduledAt && (
            <Button variant="outline" asChild>
              <a href={getGoogleCalendarLink(booking)} target="_blank" rel="noopener noreferrer">
                <CalendarPlus className="w-4 h-4 mr-2" />
                Add to Calendar
              </a>
            </Button>
          )}

          <Link to={`/marketplace/messages?booking=${bookingId}`}>
            <Button variant="outline">
              <MessageSquare className="w-4 h-4 mr-2" />
              Message Mentor
            </Button>
          </Link>

          {canReview && (
            <Link to={`/marketplace/bookings/${bookingId}/review`}>
              <Button variant="outline">
                Leave Review
              </Button>
            </Link>
          )}

          {canCancel && (
            <Button
              variant="outline"
              className="text-red-600 hover:text-red-700"
              onClick={() => setShowCancelModal(true)}
            >
              Cancel Booking
            </Button>
          )}
        </div>

        <Separator className="my-8" />

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <WhatToExpectCard serviceType={serviceType} />
          <HowToPrepareCard serviceType={serviceType} />
        </div>

        {/* Intake data */}
        {booking.intakeData && (
          <div className="mb-6">
            <IntakeDataCard intakeData={booking.intakeData} serviceType={serviceType} />
          </div>
        )}

        {/* Attachments */}
        {booking.attachments && (
          <div className="mb-6">
            <AttachmentsSection attachments={booking.attachments} />
          </div>
        )}

        {/* Session notes */}
        <SessionNotesEditor
          bookingId={bookingId}
          initialNotes={booking.sessionNotes}
          readOnly={booking.status === BOOKING_STATUS.CANCELLED ||
            booking.status === BOOKING_STATUS.DECLINED}
          className="mb-6"
        />

        {/* Applicant notes */}
        {booking.applicantNotes && (
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Your Note to Mentor</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{booking.applicantNotes}</p>
            </CardContent>
          </Card>
        )}

        {/* Cancel modal */}
        {showCancelModal && (
          <CancelBookingModal
            booking={booking}
            open={showCancelModal}
            onOpenChange={setShowCancelModal}
            onCancelled={() => {
              setShowCancelModal(false);
              navigate('/marketplace/my-bookings');
            }}
          />
        )}
      </div>
    </PageWrapper>
  );
}

export default BookingDetailPage;
