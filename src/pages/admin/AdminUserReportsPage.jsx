/**
 * AdminUserReportsPage
 *
 * Admin page for reviewing user-submitted reports:
 * - School/Program requirement errors
 * - Program event suggestions
 *
 * Features:
 * - Tab filters: All, Pending, Approved, Dismissed
 * - Report cards with details, user info, submission date
 * - Actions: Approve (awards points), Dismiss, View Details
 *
 * Route: /admin/user-reports
 */

import { useState, useMemo } from 'react';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Flag,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Gift,
  User,
  School,
  ExternalLink,
  AlertTriangle,
  Filter,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Report types
const REPORT_TYPES = {
  SCHOOL_ERROR: 'school_requirement_error',
  PROGRAM_EVENT: 'program_event_suggestion',
};

// Report statuses
const REPORT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  DISMISSED: 'dismissed',
};

// Mock data - TODO: Replace with API call
const MOCK_USER_REPORTS = [
  {
    id: 'ur_1',
    type: REPORT_TYPES.SCHOOL_ERROR,
    status: REPORT_STATUS.PENDING,
    userId: 'user_123',
    userName: 'Sarah Johnson',
    userEmail: 'sarah@example.com',
    programId: 'prog_1',
    programName: 'Duke University CRNA Program',
    schoolName: 'Duke University',
    categories: ['gpa', 'prerequisites'],
    details: 'The minimum GPA listed is 3.0 but their website now says 3.2. Also, they no longer require Organic Chemistry.',
    submittedAt: '2024-12-12T14:30:00Z',
    pointsAwarded: 5,
  },
  {
    id: 'ur_2',
    type: REPORT_TYPES.PROGRAM_EVENT,
    status: REPORT_STATUS.PENDING,
    userId: 'user_456',
    userName: 'Michael Chen',
    userEmail: 'michael@example.com',
    programId: 'prog_2',
    programName: 'University of Pittsburgh CRNA',
    schoolName: 'University of Pittsburgh',
    eventTitle: 'Virtual Open House',
    eventDate: '2025-01-15',
    details: 'They just announced a new virtual open house for prospective students.',
    submittedAt: '2024-12-11T09:15:00Z',
    pointsAwarded: 10,
  },
  {
    id: 'ur_3',
    type: REPORT_TYPES.SCHOOL_ERROR,
    status: REPORT_STATUS.APPROVED,
    userId: 'user_789',
    userName: 'Emily Davis',
    userEmail: 'emily@example.com',
    programId: 'prog_3',
    programName: 'Columbia University CRNA',
    schoolName: 'Columbia University',
    categories: ['deadline'],
    details: 'Application deadline changed from March 1st to February 15th for Fall 2025.',
    submittedAt: '2024-12-10T16:45:00Z',
    pointsAwarded: 5,
    reviewedAt: '2024-12-11T10:00:00Z',
    reviewedBy: 'Admin',
  },
  {
    id: 'ur_4',
    type: REPORT_TYPES.PROGRAM_EVENT,
    status: REPORT_STATUS.DISMISSED,
    userId: 'user_111',
    userName: 'James Wilson',
    userEmail: 'james@example.com',
    programId: 'prog_4',
    programName: 'USC CRNA Program',
    schoolName: 'USC',
    eventTitle: 'Info Session',
    eventDate: '2024-11-20',
    details: 'Info session next week',
    submittedAt: '2024-12-09T11:30:00Z',
    pointsAwarded: 10,
    reviewedAt: '2024-12-09T14:00:00Z',
    reviewedBy: 'Admin',
    dismissReason: 'Event already in database',
  },
];

/**
 * Format date for display
 */
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/**
 * Report Card Component
 */
function UserReportCard({ report, onApprove, onDismiss, onView }) {
  const isSchoolError = report.type === REPORT_TYPES.SCHOOL_ERROR;
  const isPending = report.status === REPORT_STATUS.PENDING;

  return (
    <Card className={cn(
      "transition-all",
      isPending && "border-amber-200 bg-amber-50/30"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Type Icon */}
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
            isSchoolError ? "bg-red-100" : "bg-blue-100"
          )}>
            {isSchoolError ? (
              <Flag className="w-5 h-5 text-red-600" />
            ) : (
              <Calendar className="w-5 h-5 text-blue-600" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900">
                    {isSchoolError ? 'Requirement Error' : 'Event Suggestion'}
                  </span>
                  <Badge
                    variant={
                      report.status === REPORT_STATUS.PENDING ? 'warning' :
                      report.status === REPORT_STATUS.APPROVED ? 'success' :
                      'secondary'
                    }
                    className="text-xs"
                  >
                    {report.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">
                  <School className="w-3.5 h-3.5 inline mr-1" />
                  {report.schoolName}
                  {report.programName !== report.schoolName && (
                    <span className="text-gray-400"> • {report.programName}</span>
                  )}
                </p>
              </div>

              {/* Points Badge */}
              <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <Gift className="w-3 h-3" />
                +{report.pointsAwarded} pts
              </div>
            </div>

            {/* Categories (for school errors) */}
            {isSchoolError && report.categories && (
              <div className="flex flex-wrap gap-1 mb-2">
                {report.categories.map((cat) => (
                  <Badge key={cat} variant="outline" className="text-xs capitalize">
                    {cat.replace('_', ' ')}
                  </Badge>
                ))}
              </div>
            )}

            {/* Event Info (for event suggestions) */}
            {!isSchoolError && report.eventTitle && (
              <div className="mb-2 p-2 bg-gray-50 rounded text-sm">
                <p className="font-medium">{report.eventTitle}</p>
                <p className="text-gray-500 text-xs">
                  {new Date(report.eventDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            )}

            {/* Details */}
            {report.details && (
              <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                "{report.details}"
              </p>
            )}

            {/* Meta */}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {report.userName}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDate(report.submittedAt)}
              </span>
            </div>

            {/* Review Info (for non-pending) */}
            {!isPending && report.reviewedAt && (
              <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
                {report.status === REPORT_STATUS.APPROVED ? (
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle2 className="w-3 h-3" />
                    Approved by {report.reviewedBy} on {formatDate(report.reviewedAt)}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-gray-500">
                    <XCircle className="w-3 h-3" />
                    Dismissed: {report.dismissReason}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          {isPending && (
            <div className="flex flex-col gap-2 shrink-0">
              <Button
                size="sm"
                onClick={() => onApprove(report)}
                className="min-h-9"
              >
                <CheckCircle2 className="w-4 h-4 mr-1" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDismiss(report)}
                className="min-h-9"
              >
                <XCircle className="w-4 h-4 mr-1" />
                Dismiss
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function AdminUserReportsPage() {
  const [activeTab, setActiveTab] = useState('pending');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'school_error' | 'event'
  const [reports, setReports] = useState(MOCK_USER_REPORTS);
  const [actionDialog, setActionDialog] = useState({
    open: false,
    report: null,
    action: null, // 'approve' | 'dismiss'
  });
  const [dismissReason, setDismissReason] = useState('');

  // Filter reports
  const filteredReports = useMemo(() => {
    let filtered = reports;

    // Filter by tab (status)
    if (activeTab !== 'all') {
      filtered = filtered.filter(r => r.status === activeTab);
    }

    // Filter by type
    if (typeFilter === 'school_error') {
      filtered = filtered.filter(r => r.type === REPORT_TYPES.SCHOOL_ERROR);
    } else if (typeFilter === 'event') {
      filtered = filtered.filter(r => r.type === REPORT_TYPES.PROGRAM_EVENT);
    }

    // Sort by date (newest first)
    return filtered.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  }, [reports, activeTab, typeFilter]);

  // Counts
  const counts = useMemo(() => ({
    all: reports.length,
    pending: reports.filter(r => r.status === REPORT_STATUS.PENDING).length,
    approved: reports.filter(r => r.status === REPORT_STATUS.APPROVED).length,
    dismissed: reports.filter(r => r.status === REPORT_STATUS.DISMISSED).length,
  }), [reports]);

  // Handle approve
  const handleApprove = (report) => {
    setActionDialog({ open: true, report, action: 'approve' });
  };

  // Handle dismiss
  const handleDismiss = (report) => {
    setActionDialog({ open: true, report, action: 'dismiss' });
  };

  // Confirm action
  const confirmAction = () => {
    const { report, action } = actionDialog;
    if (!report) return;

    setReports(prev => prev.map(r => {
      if (r.id === report.id) {
        return {
          ...r,
          status: action === 'approve' ? REPORT_STATUS.APPROVED : REPORT_STATUS.DISMISSED,
          reviewedAt: new Date().toISOString(),
          reviewedBy: 'Admin',
          ...(action === 'dismiss' && dismissReason ? { dismissReason } : {}),
        };
      }
      return r;
    }));

    // TODO: Award points if approved
    if (action === 'approve') {
      console.log(`Awarding ${report.pointsAwarded} points to user ${report.userId}`);
    }

    setActionDialog({ open: false, report: null, action: null });
    setDismissReason('');
  };

  return (
    <PageWrapper title="User Reports" subtitle="Review user-submitted school errors and event suggestions">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{counts.pending}</p>
                  <p className="text-sm text-gray-500">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{counts.approved}</p>
                  <p className="text-sm text-gray-500">Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{counts.dismissed}</p>
                  <p className="text-sm text-gray-500">Dismissed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Flag className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{counts.all}</p>
                  <p className="text-sm text-gray-500">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Submitted Reports</CardTitle>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="text-sm border border-gray-200 rounded-xl px-3 py-1.5 bg-white"
                >
                  <option value="all">All Types</option>
                  <option value="school_error">School Errors</option>
                  <option value="event">Event Suggestions</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="pending" className="gap-2">
                  Pending
                  {counts.pending > 0 && (
                    <Badge variant="warning" className="text-xs">{counts.pending}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="dismissed">Dismissed</TabsTrigger>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-0">
                {filteredReports.length === 0 ? (
                  <EmptyState
                    icon={Flag}
                    title="No reports found"
                    description={
                      activeTab === 'pending'
                        ? "No pending reports to review. Great job!"
                        : "No reports match the current filters."
                    }
                  />
                ) : (
                  <div className="space-y-3">
                    {filteredReports.map((report) => (
                      <UserReportCard
                        key={report.id}
                        report={report}
                        onApprove={handleApprove}
                        onDismiss={handleDismiss}
                        onView={() => console.log('View report:', report)}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Action Confirmation Dialog */}
        <Dialog
          open={actionDialog.open}
          onOpenChange={(open) => {
            if (!open) {
              setActionDialog({ open: false, report: null, action: null });
              setDismissReason('');
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {actionDialog.action === 'approve' ? 'Approve Report' : 'Dismiss Report'}
              </DialogTitle>
              <DialogDescription>
                {actionDialog.action === 'approve' ? (
                  <>
                    This will mark the report as approved and award{' '}
                    <strong>+{actionDialog.report?.pointsAwarded} points</strong> to{' '}
                    {actionDialog.report?.userName}.
                  </>
                ) : (
                  'This will dismiss the report. The user will not receive points.'
                )}
              </DialogDescription>
            </DialogHeader>

            {actionDialog.action === 'dismiss' && (
              <div className="py-4">
                <label className="text-sm font-medium text-gray-700">
                  Reason for dismissal (optional)
                </label>
                <input
                  type="text"
                  value={dismissReason}
                  onChange={(e) => setDismissReason(e.target.value)}
                  placeholder="e.g., Already in database, Invalid submission..."
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                />
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setActionDialog({ open: false, report: null, action: null })}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmAction}
                variant={actionDialog.action === 'approve' ? 'default' : 'destructive'}
              >
                {actionDialog.action === 'approve' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Approve & Award Points
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 mr-1" />
                    Dismiss
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageWrapper>
  );
}
