/**
 * MyBookingsPage
 *
 * Displays applicant's marketplace bookings with tabs for:
 * - Upcoming bookings
 * - Past bookings
 * - Saved mentors
 *
 * Route: /marketplace/my-bookings
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Star,
  Heart,
  MessageSquare,
  Video,
  ChevronRight,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { useUpcomingBookings, usePastBookings, usePendingRequests } from '@/hooks/useBookings';
import { useSavedProviders } from '@/hooks/useProviders';
import { cn } from '@/lib/utils';

/**
 * Format time until session
 */
function formatTimeUntil(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = date - now;

  if (diffMs < 0) return 'Past';

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return 'Starting soon';
  if (diffHours < 24) return `In ${diffHours} hours`;
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays < 7) return `In ${diffDays} days`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Format countdown for pending requests (48h response window)
 */
function formatCountdown(expiresAt) {
  if (!expiresAt) return null;

  const expires = new Date(expiresAt);
  const now = new Date();
  const diffMs = expires - now;

  if (diffMs < 0) return 'Expired';

  const hours = Math.floor(diffMs / (1000 * 60 * 60));

  if (hours < 1) return 'Less than 1 hour left';
  if (hours < 24) return `${hours} hours left`;
  return `${Math.ceil(hours / 24)} days left`;
}

/**
 * Status badge component
 */
function BookingStatusBadge({ status }) {
  const config = {
    pending_provider: { label: 'Pending', variant: 'warning', icon: Clock },
    pending_payment: { label: 'Payment Pending', variant: 'warning', icon: AlertCircle },
    confirmed: { label: 'Confirmed', variant: 'success', icon: CheckCircle },
    completed: { label: 'Completed', variant: 'secondary', icon: CheckCircle },
    cancelled: { label: 'Cancelled', variant: 'error', icon: XCircle },
    declined: { label: 'Declined', variant: 'error', icon: XCircle }
  };

  const { label, variant, icon: Icon } = config[status] || config.pending_provider;

  return (
    <Badge variant={variant} className="flex items-center gap-1">
      <Icon className="w-3 h-3" />
      {label}
    </Badge>
  );
}

/**
 * Booking card component
 */
function BookingCard({ booking, variant = 'upcoming' }) {
  const isUpcoming = variant === 'upcoming';
  const isPending = booking.status === 'pending_provider';
  const isConfirmed = booking.status === 'confirmed';
  const isCompleted = booking.status === 'completed';

  // Check if join button should show (5 min before session)
  const canJoin = useMemo(() => {
    if (!isConfirmed || !booking.scheduledAt) return false;
    const sessionTime = new Date(booking.scheduledAt);
    const now = new Date();
    const diffMs = sessionTime - now;
    return diffMs <= 5 * 60 * 1000 && diffMs > -60 * 60 * 1000; // 5 min before to 1 hour after
  }, [isConfirmed, booking.scheduledAt]);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Provider Avatar */}
          <Avatar className="w-12 h-12">
            <AvatarImage src={booking.providerSnapshot?.avatarUrl} />
            <AvatarFallback>
              {booking.providerSnapshot?.name?.slice(0, 2).toUpperCase() || '??'}
            </AvatarFallback>
          </Avatar>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div>
                <h3 className="font-semibold text-gray-900">
                  {booking.serviceSnapshot?.title}
                </h3>
                <p className="text-sm text-gray-600">
                  with {booking.providerSnapshot?.name}
                </p>
              </div>
              <BookingStatusBadge status={booking.status} />
            </div>

            {/* Schedule */}
            {booking.scheduledAt && (
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(booking.scheduledAt).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {new Date(booking.scheduledAt).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit'
                  })}
                </span>
                {booking.duration && (
                  <span>{booking.duration} min</span>
                )}
              </div>
            )}

            {/* Pending countdown */}
            {isPending && booking.expiresAt && (
              <div className="mt-2 text-sm text-orange-600 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatCountdown(booking.expiresAt)} for mentor to respond
              </div>
            )}

            {/* Upcoming indicator */}
            {isConfirmed && isUpcoming && (
              <div className="mt-2 text-sm text-green-600 font-medium">
                {formatTimeUntil(booking.scheduledAt)}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              {/* View Details */}
              <Link to={`/marketplace/bookings/${booking.id}/details`}>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </Link>

              {/* Message */}
              <Link to={`/marketplace/messages?booking=${booking.id}`}>
                <Button variant="ghost" size="sm">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Message
                </Button>
              </Link>

              {/* Join Video (5 min before session) */}
              {canJoin && booking.meetingUrl && (
                <a href={booking.meetingUrl} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <Video className="w-4 h-4 mr-1" />
                    Join Video
                  </Button>
                </a>
              )}

              {/* Leave Review (completed bookings without review) */}
              {isCompleted && !booking.applicantReviewId && (
                <Link to={`/marketplace/bookings/${booking.id}/review`}>
                  <Button variant="outline" size="sm">
                    <Star className="w-4 h-4 mr-1" />
                    Leave Review
                  </Button>
                </Link>
              )}

              {/* Book Again (completed) */}
              {isCompleted && (
                <Link to={`/marketplace/mentor/${booking.providerId}`}>
                  <Button variant="ghost" size="sm">
                    Book Again
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Saved mentor card
 */
function SavedMentorCard({ provider, onRemove }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={provider.avatarUrl} />
            <AvatarFallback>
              {provider.name?.slice(0, 2).toUpperCase() || '??'}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900">{provider.name}</h3>
            <p className="text-sm text-gray-600">{provider.programName}</p>
            {provider.rating && (
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm">{provider.rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Link to={`/marketplace/mentor/${provider.id}`}>
              <Button size="sm">
                View Profile
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(provider.id)}
            >
              <Heart className="w-4 h-4 fill-red-500 text-red-500" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Loading skeleton for booking cards
 */
function BookingCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-40" />
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function MyBookingsPage() {
  const [activeTab, setActiveTab] = useState('upcoming');

  // Fetch data
  const { bookings: upcomingBookings, loading: upcomingLoading } = useUpcomingBookings('user_001');
  const { bookings: pastBookings, loading: pastLoading } = usePastBookings('user_001');
  const { requests: pendingBookings, loading: pendingLoading } = usePendingRequests('user_001');
  const { savedProvidersList, toggleSave, loading: savedLoading } = useSavedProviders();

  // Combine pending and confirmed upcoming
  const allUpcoming = useMemo(() => {
    return [...(pendingBookings || []), ...(upcomingBookings || [])].sort((a, b) => {
      // Pending first, then by date
      if (a.status === 'pending_provider' && b.status !== 'pending_provider') return -1;
      if (a.status !== 'pending_provider' && b.status === 'pending_provider') return 1;
      return new Date(a.scheduledAt || a.createdAt) - new Date(b.scheduledAt || b.createdAt);
    });
  }, [pendingBookings, upcomingBookings]);

  const isLoading = upcomingLoading || pastLoading || pendingLoading;

  return (
    <PageWrapper
      title="My Bookings"
      breadcrumbs={[
        { label: 'Marketplace', href: '/marketplace' },
        { label: 'My Bookings' }
      ]}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Upcoming
            {allUpcoming.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {allUpcoming.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="past" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Past
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Saved Mentors
            {savedProvidersList.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {savedProvidersList.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Upcoming Tab */}
        <TabsContent value="upcoming">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <BookingCardSkeleton key={i} />
              ))}
            </div>
          ) : allUpcoming.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No upcoming bookings"
              description="You don't have any upcoming sessions scheduled."
              action={
                <Link to="/marketplace">
                  <Button>
                    Find a Mentor
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              }
            />
          ) : (
            <div className="space-y-4">
              {allUpcoming.map(booking => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  variant="upcoming"
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Past Tab */}
        <TabsContent value="past">
          {pastLoading ? (
            <div className="space-y-4">
              {[1, 2].map(i => (
                <BookingCardSkeleton key={i} />
              ))}
            </div>
          ) : pastBookings.length === 0 ? (
            <EmptyState
              icon={Clock}
              title="No past bookings"
              description="Your completed sessions will appear here."
            />
          ) : (
            <div className="space-y-4">
              {pastBookings.map(booking => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  variant="past"
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Saved Mentors Tab */}
        <TabsContent value="saved">
          {savedLoading ? (
            <div className="space-y-4">
              {[1, 2].map(i => (
                <BookingCardSkeleton key={i} />
              ))}
            </div>
          ) : savedProvidersList.length === 0 ? (
            <EmptyState
              icon={Heart}
              title="No saved mentors"
              description="Save mentors you're interested in to easily find them later."
              action={
                <Link to="/marketplace">
                  <Button variant="outline">
                    Browse Mentors
                  </Button>
                </Link>
              }
            />
          ) : (
            <div className="space-y-4">
              {savedProvidersList.map(provider => (
                <SavedMentorCard
                  key={provider.id}
                  provider={provider}
                  onRemove={toggleSave}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </PageWrapper>
  );
}

export default MyBookingsPage;
