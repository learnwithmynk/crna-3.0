/**
 * ProviderRequestsPage
 *
 * View all incoming booking requests for providers.
 * Features:
 * - Filter tabs: All | Pending | Accepted | Declined
 * - 48h countdown timer for each request
 * - Urgency-based sorting (closest deadline first)
 * - Warning banner for requests expiring soon (< 24h)
 * - Pagination (10 requests per page)
 * - Empty states for each filter
 *
 * Route: /marketplace/provider/requests
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Clock, CheckCircle, XCircle, Inbox } from 'lucide-react';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { RequestCard } from '@/components/features/provider/RequestCard';
import { useBookings, BOOKING_STATUS, useBookingActions } from '@/hooks/useBookings';
import { mockUser } from '@/data/mockUser';
import { cn } from '@/lib/utils';

// Mock provider ID - in production this would come from auth context
const MOCK_PROVIDER_ID = 'provider_001';

/**
 * Calculate time remaining for a request (48h response window)
 */
function calculateTimeRemaining(expiresAt) {
  if (!expiresAt) return null;

  const expires = new Date(expiresAt);
  const now = new Date();
  const diffMs = expires - now;

  if (diffMs < 0) return { expired: true, hours: 0 };

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  return { expired: false, hours };
}

/**
 * Pagination component
 */
function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </Button>
      <span className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
}

export function ProviderRequestsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Fetch all provider bookings
  const { bookings: allBookings, loading } = useBookings({
    userId: MOCK_PROVIDER_ID,
    role: 'provider',
    includeCancelled: true,
    includeCompleted: true
  });

  // Booking actions
  const { acceptBooking, declineBooking } = useBookingActions();

  // Filter bookings by status
  const filteredBookings = useMemo(() => {
    let filtered = allBookings;

    switch (activeTab) {
      case 'pending':
        filtered = allBookings.filter(b => b.status === BOOKING_STATUS.PENDING_PROVIDER);
        break;
      case 'accepted':
        filtered = allBookings.filter(b => b.status === BOOKING_STATUS.CONFIRMED);
        break;
      case 'declined':
        filtered = allBookings.filter(b => b.status === BOOKING_STATUS.DECLINED);
        break;
      default:
        // 'all' - show all requests (exclude completed)
        filtered = allBookings.filter(b =>
          b.status === BOOKING_STATUS.PENDING_PROVIDER ||
          b.status === BOOKING_STATUS.CONFIRMED ||
          b.status === BOOKING_STATUS.DECLINED
        );
    }

    // Sort by urgency (pending requests with closest expiration first)
    return filtered.sort((a, b) => {
      // Pending requests always come first
      if (a.status === BOOKING_STATUS.PENDING_PROVIDER && b.status !== BOOKING_STATUS.PENDING_PROVIDER) {
        return -1;
      }
      if (b.status === BOOKING_STATUS.PENDING_PROVIDER && a.status !== BOOKING_STATUS.PENDING_PROVIDER) {
        return 1;
      }

      // Among pending, sort by expiration time
      if (a.status === BOOKING_STATUS.PENDING_PROVIDER && b.status === BOOKING_STATUS.PENDING_PROVIDER) {
        const aExpires = a.expiresAt ? new Date(a.expiresAt) : new Date(a.createdAt).getTime() + (48 * 60 * 60 * 1000);
        const bExpires = b.expiresAt ? new Date(b.expiresAt) : new Date(b.createdAt).getTime() + (48 * 60 * 60 * 1000);
        return aExpires - bExpires;
      }

      // Otherwise sort by created date (newest first)
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [allBookings, activeTab]);

  // Count requests by status
  const statusCounts = useMemo(() => {
    const pending = allBookings.filter(b => b.status === BOOKING_STATUS.PENDING_PROVIDER).length;
    const accepted = allBookings.filter(b => b.status === BOOKING_STATUS.CONFIRMED).length;
    const declined = allBookings.filter(b => b.status === BOOKING_STATUS.DECLINED).length;
    return { pending, accepted, declined };
  }, [allBookings]);

  // Check for urgent requests (< 24h remaining)
  const urgentRequests = useMemo(() => {
    return allBookings.filter(b => {
      if (b.status !== BOOKING_STATUS.PENDING_PROVIDER) return false;
      const timeRemaining = calculateTimeRemaining(b.expiresAt);
      return timeRemaining && !timeRemaining.expired && timeRemaining.hours < 24;
    });
  }, [allBookings]);

  // Paginate results
  const paginatedBookings = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredBookings.slice(startIndex, endIndex);
  }, [filteredBookings, currentPage]);

  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);

  // Reset to page 1 when tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // Handle accept request
  const handleAccept = async (requestId) => {
    await acceptBooking(requestId);
    // TODO: Show success toast
    console.log('Accepted request:', requestId);
  };

  // Handle decline request
  const handleDecline = async (requestId) => {
    await declineBooking(requestId);
    // TODO: Show success toast
    console.log('Declined request:', requestId);
  };

  // Handle propose alternative
  const handleProposeAlternative = (request) => {
    // TODO: Open modal/form to propose alternative times
    console.log('Propose alternative for:', request.id);
  };

  return (
    <PageWrapper
      breadcrumbs={[
        { label: 'Marketplace', href: '/marketplace' },
        { label: 'Provider Dashboard', href: '/marketplace/provider' },
        { label: 'Requests' }
      ]}
      title="Incoming Requests"
      description={`${statusCounts.pending} pending request${statusCounts.pending !== 1 ? 's' : ''}`}
    >
      {/* Urgency Warning Banner */}
      {urgentRequests.length > 0 && (
        <Card className="mb-6 border-orange-300 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-orange-900">
                  {urgentRequests.length} request{urgentRequests.length !== 1 ? 's' : ''} expiring soon!
                </h3>
                <p className="text-sm text-orange-700 mt-1">
                  You have {urgentRequests.length} request{urgentRequests.length !== 1 ? 's' : ''} with less than 24 hours remaining.
                  Respond quickly to maintain your reputation and response rate.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filter Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">
            All
            {filteredBookings.length > 0 && activeTab === 'all' && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-gray-200 rounded-full">
                {filteredBookings.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending
            {statusCounts.pending > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-orange-200 text-orange-800 rounded-full">
                {statusCounts.pending}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="accepted">
            Accepted
            {statusCounts.accepted > 0 && activeTab === 'accepted' && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-green-200 text-green-800 rounded-full">
                {statusCounts.accepted}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="declined">
            Declined
            {statusCounts.declined > 0 && activeTab === 'declined' && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-gray-200 rounded-full">
                {statusCounts.declined}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* All Requests */}
        <TabsContent value="all" className="space-y-4">
          {loading ? (
            <>
              <Skeleton className="h-64" />
              <Skeleton className="h-64" />
            </>
          ) : paginatedBookings.length > 0 ? (
            <>
              {paginatedBookings.map((request) => (
                <RequestCard
                  key={request.id}
                  request={{
                    id: request.id,
                    applicant: {
                      name: request.applicantSnapshot?.name || 'Applicant',
                      avatar: request.applicantSnapshot?.avatarUrl,
                      targetPrograms: request.intakeData?.targetPrograms || [],
                      icuExperience: { type: 'MICU', years: 3 }, // Mock data
                      gpa: '3.5', // Mock data
                      stage: 'Strategizing',
                      previousSessionsCount: 0
                    },
                    service: {
                      name: request.serviceSnapshot?.title,
                      type: request.serviceSnapshot?.type,
                      duration: request.duration,
                      price: request.price,
                      platformFee: 0.2
                    },
                    requestDate: request.createdAt,
                    preferredTimes: request.requestedSlots || [],
                    message: request.applicantNotes,
                    materials: request.attachments || [],
                    intakeInfo: request.intakeData || {}
                  }}
                  onAccept={handleAccept}
                  onDecline={handleDecline}
                  onProposeAlternative={handleProposeAlternative}
                />
              ))}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          ) : (
            <EmptyState
              icon={Inbox}
              title="No requests"
              description="You don't have any booking requests at this time."
              action={
                <Link to="/marketplace/provider/profile">
                  <Button>Update Your Profile</Button>
                </Link>
              }
            />
          )}
        </TabsContent>

        {/* Pending Requests */}
        <TabsContent value="pending" className="space-y-4">
          {loading ? (
            <>
              <Skeleton className="h-64" />
              <Skeleton className="h-64" />
            </>
          ) : paginatedBookings.length > 0 ? (
            <>
              {paginatedBookings.map((request) => (
                <RequestCard
                  key={request.id}
                  request={{
                    id: request.id,
                    applicant: {
                      name: request.applicantSnapshot?.name || 'Applicant',
                      avatar: request.applicantSnapshot?.avatarUrl,
                      targetPrograms: request.intakeData?.targetPrograms || [],
                      icuExperience: { type: 'MICU', years: 3 },
                      gpa: '3.5',
                      stage: 'Strategizing',
                      previousSessionsCount: 0
                    },
                    service: {
                      name: request.serviceSnapshot?.title,
                      type: request.serviceSnapshot?.type,
                      duration: request.duration,
                      price: request.price,
                      platformFee: 0.2
                    },
                    requestDate: request.createdAt,
                    preferredTimes: request.requestedSlots || [],
                    message: request.applicantNotes,
                    materials: request.attachments || [],
                    intakeInfo: request.intakeData || {}
                  }}
                  onAccept={handleAccept}
                  onDecline={handleDecline}
                  onProposeAlternative={handleProposeAlternative}
                />
              ))}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          ) : (
            <EmptyState
              icon={CheckCircle}
              title="All caught up!"
              description="No pending requests. Great job staying on top of your bookings!"
            />
          )}
        </TabsContent>

        {/* Accepted Requests */}
        <TabsContent value="accepted" className="space-y-4">
          {loading ? (
            <>
              <Skeleton className="h-64" />
              <Skeleton className="h-64" />
            </>
          ) : paginatedBookings.length > 0 ? (
            <>
              {paginatedBookings.map((request) => (
                <RequestCard
                  key={request.id}
                  request={{
                    id: request.id,
                    applicant: {
                      name: request.applicantSnapshot?.name || 'Applicant',
                      avatar: request.applicantSnapshot?.avatarUrl,
                      targetPrograms: request.intakeData?.targetPrograms || [],
                      icuExperience: { type: 'MICU', years: 3 },
                      gpa: '3.5',
                      stage: 'Strategizing',
                      previousSessionsCount: 0
                    },
                    service: {
                      name: request.serviceSnapshot?.title,
                      type: request.serviceSnapshot?.type,
                      duration: request.duration,
                      price: request.price,
                      platformFee: 0.2
                    },
                    requestDate: request.createdAt,
                    preferredTimes: request.requestedSlots || [],
                    message: request.applicantNotes,
                    materials: request.attachments || [],
                    intakeInfo: request.intakeData || {}
                  }}
                  onAccept={handleAccept}
                  onDecline={handleDecline}
                  onProposeAlternative={handleProposeAlternative}
                />
              ))}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          ) : (
            <EmptyState
              icon={Clock}
              title="No accepted requests"
              description="Requests you accept will appear here."
            />
          )}
        </TabsContent>

        {/* Declined Requests */}
        <TabsContent value="declined" className="space-y-4">
          {loading ? (
            <>
              <Skeleton className="h-64" />
              <Skeleton className="h-64" />
            </>
          ) : paginatedBookings.length > 0 ? (
            <>
              {paginatedBookings.map((request) => (
                <RequestCard
                  key={request.id}
                  request={{
                    id: request.id,
                    applicant: {
                      name: request.applicantSnapshot?.name || 'Applicant',
                      avatar: request.applicantSnapshot?.avatarUrl,
                      targetPrograms: request.intakeData?.targetPrograms || [],
                      icuExperience: { type: 'MICU', years: 3 },
                      gpa: '3.5',
                      stage: 'Strategizing',
                      previousSessionsCount: 0
                    },
                    service: {
                      name: request.serviceSnapshot?.title,
                      type: request.serviceSnapshot?.type,
                      duration: request.duration,
                      price: request.price,
                      platformFee: 0.2
                    },
                    requestDate: request.createdAt,
                    preferredTimes: request.requestedSlots || [],
                    message: request.applicantNotes,
                    materials: request.attachments || [],
                    intakeInfo: request.intakeData || {}
                  }}
                  onAccept={handleAccept}
                  onDecline={handleDecline}
                  onProposeAlternative={handleProposeAlternative}
                />
              ))}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          ) : (
            <EmptyState
              icon={XCircle}
              title="No declined requests"
              description="Requests you decline will appear here for your records."
            />
          )}
        </TabsContent>
      </Tabs>
    </PageWrapper>
  );
}

export default ProviderRequestsPage;
