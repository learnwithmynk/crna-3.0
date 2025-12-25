/**
 * AdminBookingsPage
 *
 * Manage all platform bookings with filters and admin actions.
 * Features: Status/provider/applicant/date filters, force cancel/refund actions.
 * Route: /admin/marketplace/bookings
 */

import { useState, useMemo } from 'react';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Search,
  MoreHorizontal,
  Eye,
  XCircle,
  DollarSign,
  Clock,
  CheckCircle,
  Calendar,
  AlertTriangle,
  Filter,
  X,
  RefreshCw,
} from 'lucide-react';
import { mockBookings, BOOKING_STATUS } from '@/data/marketplace/mockBookings';
import { mockProviders } from '@/data/marketplace/mockProviders';
import { format, formatDistanceToNow, isWithinInterval, subDays } from 'date-fns';

// Status badge configuration
const STATUS_CONFIG = {
  [BOOKING_STATUS.PENDING_PAYMENT]: { label: 'Pending Payment', variant: 'outline', className: 'bg-gray-50' },
  [BOOKING_STATUS.PAYMENT_FAILED]: { label: 'Payment Failed', variant: 'destructive' },
  [BOOKING_STATUS.PENDING_PROVIDER]: { label: 'Awaiting Provider', variant: 'outline', className: 'bg-yellow-50 text-yellow-800' },
  [BOOKING_STATUS.CONFIRMED]: { label: 'Confirmed', variant: 'outline', className: 'bg-blue-50 text-blue-800' },
  [BOOKING_STATUS.COMPLETED]: { label: 'Completed', variant: 'outline', className: 'bg-green-50 text-green-800' },
  [BOOKING_STATUS.CANCELLED]: { label: 'Cancelled', variant: 'outline', className: 'bg-red-50 text-red-800' },
  [BOOKING_STATUS.DECLINED]: { label: 'Declined', variant: 'outline', className: 'bg-orange-50 text-orange-800' },
};

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || { label: status, variant: 'outline' };
  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
}

function BookingRow({ booking, onView, onCancel, onRefund }) {
  const provider = mockProviders.find(p => p.id === booking.providerId);

  return (
    <TableRow data-testid="booking-row">
      <TableCell>
        <div className="font-mono text-sm">{booking.id}</div>
        <div className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(booking.createdAt), { addSuffix: true })}
        </div>
      </TableCell>
      <TableCell>
        <div className="font-medium">{booking.serviceSnapshot?.title}</div>
        <div className="text-sm text-muted-foreground capitalize">
          {booking.serviceSnapshot?.type?.replace('_', ' ')}
        </div>
      </TableCell>
      <TableCell>
        <div>{booking.providerSnapshot?.name || provider?.name}</div>
        <div className="text-sm text-muted-foreground">
          {booking.providerSnapshot?.program || provider?.program}
        </div>
      </TableCell>
      <TableCell>
        <div>Applicant #{booking.applicantId?.slice(-4)}</div>
      </TableCell>
      <TableCell>
        {booking.scheduledAt ? (
          <div>
            <div>{format(new Date(booking.scheduledAt), 'MMM d, yyyy')}</div>
            <div className="text-sm text-muted-foreground">
              {format(new Date(booking.scheduledAt), 'h:mm a')}
            </div>
          </div>
        ) : (
          <div className="text-muted-foreground">Async</div>
        )}
      </TableCell>
      <TableCell>
        <div className="font-medium">${booking.price}</div>
        <div className="text-xs text-muted-foreground">
          Fee: ${booking.platformFee}
        </div>
      </TableCell>
      <TableCell>
        <StatusBadge status={booking.status} />
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(booking)}>
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </DropdownMenuItem>
            {(booking.status === BOOKING_STATUS.CONFIRMED || booking.status === BOOKING_STATUS.PENDING_PROVIDER) && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onCancel(booking)} className="text-red-600">
                  <XCircle className="w-4 h-4 mr-2" />
                  Force Cancel
                </DropdownMenuItem>
              </>
            )}
            {(booking.status === BOOKING_STATUS.COMPLETED || booking.status === BOOKING_STATUS.CANCELLED) && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onRefund(booking)} className="text-orange-600">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Issue Refund
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

export function AdminBookingsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showRefundDialog, setShowRefundDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [refundAmount, setRefundAmount] = useState('');

  // Calculate stats
  const stats = useMemo(() => {
    const confirmed = mockBookings.filter(b => b.status === BOOKING_STATUS.CONFIRMED).length;
    const pending = mockBookings.filter(b => b.status === BOOKING_STATUS.PENDING_PROVIDER).length;
    const completed = mockBookings.filter(b => b.status === BOOKING_STATUS.COMPLETED).length;
    const cancelled = mockBookings.filter(b => b.status === BOOKING_STATUS.CANCELLED || b.status === BOOKING_STATUS.DECLINED).length;
    const totalRevenue = mockBookings
      .filter(b => b.status === BOOKING_STATUS.COMPLETED)
      .reduce((sum, b) => sum + (b.platformFee || 0), 0);

    return { confirmed, pending, completed, cancelled, totalRevenue };
  }, []);

  // Filter bookings
  const filteredBookings = useMemo(() => {
    let result = [...mockBookings];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(b =>
        b.id.toLowerCase().includes(query) ||
        b.serviceSnapshot?.title?.toLowerCase().includes(query) ||
        b.providerSnapshot?.name?.toLowerCase().includes(query) ||
        b.applicantId?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(b => b.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      let startDate;
      switch (dateFilter) {
        case '7days':
          startDate = subDays(now, 7);
          break;
        case '30days':
          startDate = subDays(now, 30);
          break;
        case '90days':
          startDate = subDays(now, 90);
          break;
        default:
          startDate = null;
      }
      if (startDate) {
        result = result.filter(b =>
          isWithinInterval(new Date(b.createdAt), { start: startDate, end: now })
        );
      }
    }

    // Sort by created date (newest first)
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return result;
  }, [searchQuery, statusFilter, dateFilter]);

  const handleView = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsDialog(true);
  };

  const handleCancel = (booking) => {
    setSelectedBooking(booking);
    setCancelReason('');
    setShowCancelDialog(true);
  };

  const handleRefund = (booking) => {
    setSelectedBooking(booking);
    setRefundAmount(String(booking.price));
    setShowRefundDialog(true);
  };

  const confirmCancel = () => {
    // TODO: API call to cancel booking
    console.log('Cancel booking:', selectedBooking?.id, 'Reason:', cancelReason);
    setShowCancelDialog(false);
    setSelectedBooking(null);
  };

  const confirmRefund = () => {
    // TODO: API call to issue refund
    console.log('Refund booking:', selectedBooking?.id, 'Amount:', refundAmount);
    setShowRefundDialog(false);
    setSelectedBooking(null);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setDateFilter('all');
  };

  const hasActiveFilters = searchQuery || statusFilter !== 'all' || dateFilter !== 'all';

  const breadcrumbs = [
    { label: 'Admin', href: '/admin' },
    { label: 'Marketplace', href: '/admin/marketplace' },
    { label: 'Bookings' },
  ];

  return (
    <PageWrapper
      title="Booking Management"
      description="View and manage all platform bookings"
      breadcrumbs={breadcrumbs}
    >
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Confirmed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.confirmed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Awaiting Provider</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cancelled/Declined</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Platform Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by ID, service, provider..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value={BOOKING_STATUS.PENDING_PROVIDER}>Awaiting Provider</SelectItem>
                <SelectItem value={BOOKING_STATUS.CONFIRMED}>Confirmed</SelectItem>
                <SelectItem value={BOOKING_STATUS.COMPLETED}>Completed</SelectItem>
                <SelectItem value={BOOKING_STATUS.CANCELLED}>Cancelled</SelectItem>
                <SelectItem value={BOOKING_STATUS.DECLINED}>Declined</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters}>
                <X className="w-4 h-4 mr-2" />
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Bookings</CardTitle>
              <CardDescription>
                {filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''} found
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredBookings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No bookings match your filters
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Scheduled</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <BookingRow
                    key={booking.id}
                    booking={booking}
                    onView={handleView}
                    onCancel={handleCancel}
                    onRefund={handleRefund}
                  />
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-mono text-lg">{selectedBooking.id}</div>
                  <div className="text-sm text-muted-foreground">
                    Created {format(new Date(selectedBooking.createdAt), 'PPpp')}
                  </div>
                </div>
                <StatusBadge status={selectedBooking.status} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Service</Label>
                  <p className="font-medium">{selectedBooking.serviceSnapshot?.title}</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {selectedBooking.serviceSnapshot?.type?.replace('_', ' ')}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Provider</Label>
                  <p className="font-medium">{selectedBooking.providerSnapshot?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedBooking.providerSnapshot?.program}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Scheduled</Label>
                  {selectedBooking.scheduledAt ? (
                    <p>{format(new Date(selectedBooking.scheduledAt), 'PPpp')}</p>
                  ) : (
                    <p className="text-muted-foreground">Async service</p>
                  )}
                </div>
                <div>
                  <Label className="text-muted-foreground">Payment</Label>
                  <p className="font-medium">${selectedBooking.price}</p>
                  <p className="text-sm text-muted-foreground">
                    Platform fee: ${selectedBooking.platformFee} • Provider: ${selectedBooking.providerPayout}
                  </p>
                </div>
              </div>

              {selectedBooking.applicantNotes && (
                <div>
                  <Label className="text-muted-foreground">Applicant Notes</Label>
                  <p className="mt-1 p-3 bg-gray-50 rounded-xl">{selectedBooking.applicantNotes}</p>
                </div>
              )}

              {selectedBooking.cancellationNote && (
                <div className="p-4 bg-red-50 rounded-xl">
                  <Label className="text-red-800">Cancellation Reason</Label>
                  <p className="mt-1 text-red-900">{selectedBooking.cancellationNote}</p>
                </div>
              )}

              {selectedBooking.declineReason && (
                <div className="p-4 bg-orange-50 rounded-xl">
                  <Label className="text-orange-800">Decline Reason</Label>
                  <p className="mt-1 text-orange-900">{selectedBooking.declineReason}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Force Cancel Booking</DialogTitle>
            <DialogDescription>
              This will cancel the booking and automatically refund the applicant.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="p-4 bg-red-50 rounded-xl">
              <div className="font-medium text-red-900">{selectedBooking?.serviceSnapshot?.title}</div>
              <div className="text-sm text-red-700">
                ${selectedBooking?.price} will be refunded
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cancel-reason">Cancellation Reason</Label>
              <Textarea
                id="cancel-reason"
                placeholder="Explain why this booking is being cancelled..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmCancel}
              disabled={!cancelReason.trim()}
            >
              <XCircle className="w-4 h-4 mr-2" />
              Force Cancel & Refund
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Refund Dialog */}
      <Dialog open={showRefundDialog} onOpenChange={setShowRefundDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Issue Refund</DialogTitle>
            <DialogDescription>
              Issue a full or partial refund for this booking.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="font-medium">{selectedBooking?.serviceSnapshot?.title}</div>
              <div className="text-sm text-muted-foreground">
                Original amount: ${selectedBooking?.price}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="refund-amount">Refund Amount ($)</Label>
              <Input
                id="refund-amount"
                type="number"
                min="0"
                max={selectedBooking?.price || 0}
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Enter a partial amount or leave as full refund
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRefundDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmRefund}
              disabled={!refundAmount || parseFloat(refundAmount) <= 0}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Issue ${refundAmount} Refund
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );
}

export default AdminBookingsPage;
