/**
 * AdminPrerequisiteCoursesPage
 *
 * Admin page for moderating user-submitted prerequisite courses.
 * Features:
 * - Tabs for Pending/Approved/Rejected submissions
 * - Search by institution, course name, or subject
 * - Approve/reject actions with reason
 * - View full submission details
 *
 * Route: /admin/prerequisite-courses
 */

import { useState, useMemo } from 'react';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
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
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  BookOpen,
  GraduationCap,
  FlaskConical,
  DollarSign,
  ExternalLink,
  Star,
  AlertTriangle,
} from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { useAdminCourseSubmissions, COURSE_SUBMISSION_STATUS } from '@/hooks/useAdminCourseSubmissions';
import { SUBJECT_AREAS, COURSE_FORMATS, COST_RANGES, ALL_REVIEW_TAGS } from '@/data/mockPrerequisites';
import { formatDistanceToNow, format } from 'date-fns';

// Get subject label from key
function getSubjectLabel(subjectKey) {
  return SUBJECT_AREAS.find(s => s.key === subjectKey)?.label || subjectKey;
}

// Get format label from key
function getFormatLabel(formatKey) {
  return COURSE_FORMATS.find(f => f.key === formatKey)?.label || formatKey;
}

// Get cost range display from key
function getCostDisplay(costRangeKey) {
  return COST_RANGES.find(c => c.key === costRangeKey)?.display || costRangeKey;
}

// Get tag label from key
function getTagLabel(tagKey) {
  return ALL_REVIEW_TAGS.find(t => t.key === tagKey)?.label || tagKey;
}

// Status badge component
function StatusBadge({ status }) {
  const variants = {
    pending: {
      className: 'bg-yellow-50 text-yellow-800 border-yellow-200',
      icon: Clock,
      label: 'Pending',
    },
    approved: {
      className: 'bg-green-50 text-green-800 border-green-200',
      icon: CheckCircle,
      label: 'Approved',
    },
    rejected: {
      className: 'bg-red-50 text-red-800 border-red-200',
      icon: XCircle,
      label: 'Rejected',
    },
  };

  const config = variants[status] || variants.pending;
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={config.className}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  );
}

// Submission row component
function SubmissionRow({ submission, onView, onApprove, onReject }) {
  const initials = submission.submittedBy?.name?.split(' ').map(n => n[0]).join('') || '?';
  const isPending = submission.status === COURSE_SUBMISSION_STATUS.PENDING;

  return (
    <TableRow>
      <TableCell>
        <div>
          <div className="font-medium">{submission.schoolName}</div>
          <div className="text-sm text-muted-foreground">{submission.courseName}</div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="secondary" className="capitalize">
          {getSubjectLabel(submission.subject)}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={submission.submittedBy?.avatarUrl} />
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <span className="text-sm">{submission.submittedBy?.name}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="text-sm text-muted-foreground">
          {formatDistanceToNow(new Date(submission.submittedAt), { addSuffix: true })}
        </div>
      </TableCell>
      <TableCell>
        <StatusBadge status={submission.status} />
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(submission)}>
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </DropdownMenuItem>
            {isPending && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onApprove(submission)} className="text-green-600">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onReject(submission)} className="text-red-600">
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

// Star rating display
function StarRating({ score, size = 'sm' }) {
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${iconSize} ${i <= score ? 'text-yellow-500 fill-yellow-500' : 'text-gray-200'}`}
        />
      ))}
    </div>
  );
}

export function AdminPrerequisiteCoursesPage() {
  const [activeTab, setActiveTab] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showDetailsSheet, setShowDetailsSheet] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const { submissions, counts, approveSubmission, rejectSubmission } = useAdminCourseSubmissions(activeTab);

  // Filter by search query
  const filteredSubmissions = useMemo(() => {
    if (!searchQuery.trim()) return submissions;

    const query = searchQuery.toLowerCase();
    return submissions.filter(s =>
      s.schoolName?.toLowerCase().includes(query) ||
      s.courseName?.toLowerCase().includes(query) ||
      getSubjectLabel(s.subject).toLowerCase().includes(query)
    );
  }, [submissions, searchQuery]);

  // Action handlers
  const handleView = (submission) => {
    setSelectedSubmission(submission);
    setShowDetailsSheet(true);
  };

  const handleApprove = (submission) => {
    setSelectedSubmission(submission);
    setShowApproveDialog(true);
  };

  const handleReject = (submission) => {
    setSelectedSubmission(submission);
    setRejectReason('');
    setShowRejectDialog(true);
  };

  const confirmApprove = async () => {
    if (!selectedSubmission) return;

    setIsProcessing(true);
    const result = await approveSubmission(selectedSubmission.id);

    if (result.success) {
      setShowApproveDialog(false);
      setSelectedSubmission(null);
    }
    setIsProcessing(false);
  };

  const confirmReject = async () => {
    if (!selectedSubmission || !rejectReason.trim()) return;

    setIsProcessing(true);
    const result = await rejectSubmission(selectedSubmission.id, rejectReason);

    if (result.success) {
      setShowRejectDialog(false);
      setSelectedSubmission(null);
      setRejectReason('');
    }
    setIsProcessing(false);
  };

  const breadcrumbs = [
    { label: 'Admin', href: '/admin' },
    { label: 'Prerequisite Courses' },
  ];

  return (
    <PageWrapper
      title="Prerequisite Course Moderation"
      description="Review and approve user-submitted prerequisite courses for the library"
      breadcrumbs={breadcrumbs}
    >
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{counts.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{counts.pending}</div>
            {counts.pending > 0 && (
              <p className="text-xs text-orange-600">Needs review</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{counts.approved}</div>
            <p className="text-xs text-green-600">In library</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{counts.rejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by institution, course name, or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending" className="gap-2">
            <AlertTriangle className="w-4 h-4" />
            Pending
            {counts.pending > 0 && (
              <Badge variant="secondary" className="ml-1 bg-orange-100 text-orange-800">
                {counts.pending}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({counts.approved})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({counts.rejected})
          </TabsTrigger>
        </TabsList>

        {/* Tab Content */}
        {['pending', 'approved', 'rejected'].map(status => (
          <TabsContent key={status} value={status} className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {status === 'pending' && 'Pending Submissions'}
                  {status === 'approved' && 'Approved Courses'}
                  {status === 'rejected' && 'Rejected Submissions'}
                </CardTitle>
                <CardDescription>
                  {status === 'pending' && 'Review and approve or reject course submissions'}
                  {status === 'approved' && 'Courses that have been approved and added to the library'}
                  {status === 'rejected' && 'Submissions that did not meet criteria'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredSubmissions.length === 0 ? (
                  <EmptyState
                    icon={status === 'pending' ? CheckCircle : BookOpen}
                    title={`No ${status} submissions`}
                    description={
                      status === 'pending'
                        ? 'All caught up! No submissions need review.'
                        : searchQuery
                        ? 'No submissions match your search.'
                        : `No ${status} submissions yet.`
                    }
                  />
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Course</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Submitted By</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSubmissions.map((submission) => (
                        <SubmissionRow
                          key={submission.id}
                          submission={submission}
                          onView={handleView}
                          onApprove={handleApprove}
                          onReject={handleReject}
                        />
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Details Sheet */}
      <Sheet open={showDetailsSheet} onOpenChange={setShowDetailsSheet}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Course Submission Details</SheetTitle>
            <SheetDescription>
              Review the full submission details
            </SheetDescription>
          </SheetHeader>

          {selectedSubmission && (
            <div className="space-y-6 py-6">
              {/* Status */}
              <div className="flex items-center justify-between">
                <StatusBadge status={selectedSubmission.status} />
                {selectedSubmission.courseUrl && (
                  <a
                    href={selectedSubmission.courseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                  >
                    View Course <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {/* Course Info */}
              <div className="space-y-4">
                <div>
                  <Label className="text-muted-foreground text-xs uppercase tracking-widest">Institution</Label>
                  <p className="font-medium">{selectedSubmission.schoolName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs uppercase tracking-widest">Course Name</Label>
                  <p className="font-medium">{selectedSubmission.courseName}</p>
                  {selectedSubmission.courseCode && (
                    <p className="text-sm text-muted-foreground">{selectedSubmission.courseCode}</p>
                  )}
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground text-xs uppercase tracking-widest">Subject</Label>
                  <p>{getSubjectLabel(selectedSubmission.subject)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs uppercase tracking-widest">Level</Label>
                  <p className="capitalize">{selectedSubmission.level}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs uppercase tracking-widest">Format</Label>
                  <p>{getFormatLabel(selectedSubmission.format)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs uppercase tracking-widest">Credits</Label>
                  <p>{selectedSubmission.credits || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs uppercase tracking-widest">Cost</Label>
                  <p>{selectedSubmission.costRange || getCostDisplay(selectedSubmission.costRangeKey)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs uppercase tracking-widest">Length</Label>
                  <p>{selectedSubmission.courseLengthWeeks ? `${selectedSubmission.courseLengthWeeks} weeks` : 'Self-paced'}</p>
                </div>
              </div>

              {/* Lab Info */}
              <div className="flex flex-wrap gap-2">
                {selectedSubmission.hasLab && (
                  <Badge variant="outline" className="bg-purple-50 text-purple-700">
                    <FlaskConical className="w-3 h-3 mr-1" />
                    Has Lab
                  </Badge>
                )}
                {selectedSubmission.labKitRequired && (
                  <Badge variant="outline" className="bg-orange-50 text-orange-700">
                    Lab Kit Required
                  </Badge>
                )}
                {selectedSubmission.selfPaced && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    Self-Paced
                  </Badge>
                )}
                {selectedSubmission.rollingAdmission && (
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    Rolling Admission
                  </Badge>
                )}
              </div>

              {/* Submitter */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <Label className="text-muted-foreground text-xs uppercase tracking-widest">Submitted By</Label>
                <div className="flex items-center gap-3 mt-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedSubmission.submittedBy?.avatarUrl} />
                    <AvatarFallback>
                      {selectedSubmission.submittedBy?.name?.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedSubmission.submittedBy?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(selectedSubmission.submittedAt), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                </div>
              </div>

              {/* First Review (if submitted with course) */}
              {selectedSubmission.firstReview && (
                <div className="space-y-3">
                  <Label className="text-muted-foreground text-xs uppercase tracking-widest">First Review</Label>
                  <div className="p-4 border rounded-xl space-y-3">
                    <div className="flex gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Recommend</p>
                        <StarRating score={selectedSubmission.firstReview.recommendScore} />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Ease</p>
                        <StarRating score={selectedSubmission.firstReview.easeScore} />
                      </div>
                    </div>
                    {selectedSubmission.firstReview.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {selectedSubmission.firstReview.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {getTagLabel(tag)}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {selectedSubmission.firstReview.reviewText && (
                      <p className="text-sm text-gray-700">{selectedSubmission.firstReview.reviewText}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Rejection Reason (if rejected) */}
              {selectedSubmission.status === 'rejected' && selectedSubmission.rejectionReason && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <Label className="text-red-800 text-xs uppercase tracking-widest">Rejection Reason</Label>
                  <p className="mt-1 text-sm text-red-700">{selectedSubmission.rejectionReason}</p>
                </div>
              )}
            </div>
          )}

          <SheetFooter>
            {selectedSubmission?.status === 'pending' && (
              <div className="flex gap-2 w-full">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowDetailsSheet(false);
                    handleReject(selectedSubmission);
                  }}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    setShowDetailsSheet(false);
                    handleApprove(selectedSubmission);
                  }}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
              </div>
            )}
            {selectedSubmission?.status !== 'pending' && (
              <Button variant="outline" onClick={() => setShowDetailsSheet(false)}>
                Close
              </Button>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Course Submission</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this course? It will be added to the prerequisite library.
            </DialogDescription>
          </DialogHeader>
          {selectedSubmission && (
            <div className="py-4">
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                <BookOpen className="w-8 h-8 text-green-600" />
                <div>
                  <div className="font-medium">{selectedSubmission.schoolName}</div>
                  <div className="text-sm text-muted-foreground">{selectedSubmission.courseName}</div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button
              onClick={confirmApprove}
              disabled={isProcessing}
              className="bg-green-600 hover:bg-green-700"
            >
              {isProcessing ? (
                <>Processing...</>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve Submission
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Course Submission</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this submission. This will help the user understand what to fix if they resubmit.
            </DialogDescription>
          </DialogHeader>
          {selectedSubmission && (
            <div className="py-4 space-y-4">
              <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl">
                <XCircle className="w-8 h-8 text-red-600" />
                <div>
                  <div className="font-medium">{selectedSubmission.schoolName}</div>
                  <div className="text-sm text-muted-foreground">{selectedSubmission.courseName}</div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reject-reason">Rejection Reason</Label>
                <Textarea
                  id="reject-reason"
                  placeholder="e.g., Please provide a valid institution name and course URL for verification..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs">Quick Templates</Label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="text-xs"
                    onClick={() => setRejectReason('Please provide the specific name of the institution (e.g., "Miami Dade College" rather than a generic name).')}
                  >
                    Unclear institution
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="text-xs"
                    onClick={() => setRejectReason('A valid course URL is required for verification. Please resubmit with a link to the official course page.')}
                  >
                    Missing URL
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="text-xs"
                    onClick={() => setRejectReason('This institution is not regionally accredited. Please submit courses from accredited institutions only.')}
                  >
                    Not accredited
                  </Button>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmReject}
              disabled={!rejectReason.trim() || isProcessing}
            >
              {isProcessing ? (
                <>Processing...</>
              ) : (
                <>
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject Submission
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );
}

export default AdminPrerequisiteCoursesPage;
