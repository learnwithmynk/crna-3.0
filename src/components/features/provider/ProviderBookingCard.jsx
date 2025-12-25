/**
 * ProviderBookingCard - Displays booking details for providers
 *
 * Shows booking information from the provider's perspective with:
 * - Applicant info and status badge
 * - Service details, date/time, pricing with provider earnings
 * - Uploaded materials (collapsible)
 * - Context-aware actions based on booking status
 */

import { useState } from 'react';
import {
  Calendar,
  Clock,
  DollarSign,
  FileText,
  Download,
  Video,
  RefreshCw,
  X,
  Star,
  ChevronDown,
  Target,
  MessageSquare,
  User,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

/**
 * Helper function to get badge styling based on status
 */
function getStatusBadgeStyles(status) {
  const styles = {
    pending_acceptance: { className: 'bg-yellow-100 text-yellow-800', label: 'Pending', icon: AlertCircle },
    confirmed: { className: 'bg-blue-100 text-blue-800', label: 'Upcoming', icon: CheckCircle2 },
    in_progress: { className: 'bg-purple-100 text-purple-800', label: 'In Progress', icon: AlertCircle },
    completed: { className: 'bg-green-100 text-green-800', label: 'Completed', icon: CheckCircle2 },
    cancelled: { className: 'bg-gray-100 text-gray-600', label: 'Cancelled', icon: XCircle },
    declined: { className: 'bg-red-100 text-red-800', label: 'Declined', icon: XCircle },
    expired: { className: 'bg-gray-100 text-gray-600', label: 'Expired', icon: XCircle },
    disputed: { className: 'bg-orange-100 text-orange-800', label: 'Disputed', icon: AlertCircle },
  };

  return styles[status] || { className: 'bg-gray-100 text-gray-600', label: status, icon: AlertCircle };
}

/**
 * Helper function to format date and time nicely
 */
function formatDateTime(dateString) {
  if (!dateString) return null;

  const date = new Date(dateString);
  return {
    date: format(date, 'MMM d, yyyy'),
    time: format(date, 'h:mm a z'),
    full: format(date, 'MMM d, yyyy \'at\' h:mm a z'),
  };
}

/**
 * Helper function to check if video button should be shown
 * Only visible 5 minutes before scheduled time
 */
function canJoinVideo(scheduledAt) {
  if (!scheduledAt) return false;

  const now = new Date();
  const sessionTime = new Date(scheduledAt);
  const fiveMinutesBeforeSession = new Date(sessionTime.getTime() - 5 * 60 * 1000);

  return now >= fiveMinutesBeforeSession;
}

export function ProviderBookingCard({
  booking,
  onJoinVideo,
  onReschedule,
  onCancel,
  onLeaveReview,
  onAccept,
  onDecline,
  onViewReview,
  onMessageApplicant,
  onViewDetails,
}) {
  const [isMaterialsOpen, setIsMaterialsOpen] = useState(false);

  // Destructure booking data with fallbacks
  const {
    id,
    status,
    scheduledAt,
    applicantName,
    applicant = { name: applicantName },
    service = {},
    amountPaid = 0,
    providerPayout = 0,
    materials = [],
    applicantNotes,
    cancellationReason,
    providerReview,
    videoLink,
  } = booking;

  const statusBadge = getStatusBadgeStyles(status);
  const StatusIcon = statusBadge.icon;
  const dateTime = formatDateTime(scheduledAt);
  const showJoinVideo = status === 'confirmed' && videoLink && canJoinVideo(scheduledAt);

  // Get applicant initials for avatar fallback
  const applicantInitials = (applicant.name || applicantName)
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || '?';

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        {/* Header: Applicant info + Status */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={applicant?.avatarUrl} alt={applicant?.name || applicantName} />
              <AvatarFallback className="bg-gradient-to-br from-pink-100 to-purple-100 text-purple-600">
                {applicantInitials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{applicant?.name || applicantName}</h3>
              {applicant?.currentStage && (
                <p className="text-sm text-gray-500 capitalize">
                  {applicant.currentStage.replace('_', ' ')}
                </p>
              )}
            </div>
          </div>
          <Badge variant="outline" className={statusBadge.className}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {statusBadge.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Service Info */}
        <div>
          <h4 className="font-medium text-base mb-2">{service?.title || service?.type}</h4>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{service?.durationMinutes || booking.duration} minutes</span>
            {service?.isLive && (
              <>
                <span className="text-gray-400">•</span>
                <Video className="w-4 h-4" />
                <span>Live Session</span>
              </>
            )}
          </div>
        </div>

        {/* Date and Time */}
        {dateTime && (
          <div className="flex items-start gap-2 text-sm">
            <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
            <span>{dateTime.full}</span>
          </div>
        )}

        {/* Pricing */}
        <div className="flex items-start gap-2 text-sm">
          <DollarSign className="w-4 h-4 text-gray-400 mt-0.5" />
          <div>
            <span className="font-medium">${amountPaid.toFixed(2)}</span>
            <span className="text-green-600 ml-2">
              (You earn: ${providerPayout.toFixed(2)})
            </span>
          </div>
        </div>

        {/* Target Programs */}
        {applicant?.targetPrograms && applicant.targetPrograms.length > 0 && (
          <div className="flex items-start gap-2 text-sm">
            <Target className="w-4 h-4 text-gray-400 mt-0.5" />
            <div>
              <span className="text-gray-600">Target programs: </span>
              <span className="font-medium">
                {applicant.targetPrograms.slice(0, 2).join(', ')}
                {applicant.targetPrograms.length > 2 && ` +${applicant.targetPrograms.length - 2} more`}
              </span>
            </div>
          </div>
        )}

        {/* Booking Notes/Context */}
        {applicantNotes && (
          <div className="bg-gray-50 rounded-xl p-3 text-sm">
            <p className="text-gray-700 italic">"{applicantNotes}"</p>
          </div>
        )}

        {/* Materials Section (Collapsible) */}
        {materials.length > 0 && (
          <Collapsible open={isMaterialsOpen} onOpenChange={setIsMaterialsOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-between"
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Materials ({materials.length})
                </span>
                <ChevronDown className={cn(
                  'w-4 h-4 transition-transform',
                  isMaterialsOpen && 'rotate-180'
                )} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <div className="space-y-2 pl-4">
                {materials.map((material, index) => (
                  <div
                    key={material.id || index}
                    className="flex items-center justify-between text-sm py-2 border-b last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{material.filename}</span>
                    </div>
                    <a
                      href={material.url}
                      download
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </a>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Cancellation Reason (for cancelled bookings) */}
        {status === 'cancelled' && cancellationReason && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-sm">
            <p className="text-red-800">
              <span className="font-medium">Cancelled: </span>
              {cancellationReason}
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2 pt-4 border-t">
        {/* Pending Acceptance Actions */}
        {status === 'pending_acceptance' && (
          <>
            <Button
              onClick={() => onAccept?.(id)}
              className="flex-1 min-w-[120px]"
            >
              Accept
            </Button>
            <Button
              onClick={() => onDecline?.(id)}
              variant="outline"
              className="flex-1 min-w-[120px]"
            >
              Decline
            </Button>
          </>
        )}

        {/* Upcoming/Confirmed Actions */}
        {status === 'confirmed' && (
          <>
            {showJoinVideo && videoLink && (
              <Button
                onClick={() => onJoinVideo?.(videoLink)}
                className="flex-1 min-w-[140px] bg-green-600 hover:bg-green-700"
                asChild
              >
                <a href={videoLink} target="_blank" rel="noopener noreferrer">
                  <Video className="w-4 h-4 mr-2" />
                  Join Video
                </a>
              </Button>
            )}
            <Button
              onClick={() => onReschedule?.(id)}
              variant="outline"
              size="sm"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reschedule
            </Button>
            <Button
              onClick={() => onCancel?.(id)}
              variant="outline"
              size="sm"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            {onMessageApplicant && (
              <Button
                onClick={() => onMessageApplicant?.(applicant?.id)}
                variant="ghost"
                size="sm"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Message
              </Button>
            )}
          </>
        )}

        {/* Completed Actions */}
        {status === 'completed' && (
          <>
            {!providerReview ? (
              <Button
                onClick={() => onLeaveReview?.(id)}
                className="flex-1 min-w-[140px]"
              >
                <Star className="w-4 h-4 mr-2" />
                Leave Review
              </Button>
            ) : (
              <Button
                onClick={() => onViewReview?.(id)}
                variant="outline"
                className="flex-1 min-w-[140px]"
              >
                View Review
              </Button>
            )}
            {onMessageApplicant && (
              <Button
                onClick={() => onMessageApplicant?.(applicant?.id)}
                variant="outline"
                size="sm"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Message
              </Button>
            )}
          </>
        )}

        {/* Cancelled - Info message */}
        {status === 'cancelled' && (
          <div className="w-full text-center text-sm text-gray-500">
            <p>This booking was cancelled</p>
          </div>
        )}

        {/* Always show View Details link (except for pending) */}
        {status !== 'pending_acceptance' && (
          <Button
            onClick={() => onViewDetails?.(id)}
            variant="link"
            size="sm"
            className="text-gray-600 ml-auto"
          >
            View Details
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ProviderBookingCard;
