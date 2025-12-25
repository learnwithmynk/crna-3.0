/**
 * AdminDisputesPage
 *
 * Manage booking disputes and refund requests.
 * Features: List of open disputes, dispute details with evidence,
 * resolution actions (full/partial refund, deny), communication log.
 * Route: /admin/marketplace/disputes
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
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  DollarSign,
  FileText,
  User,
  Calendar,
  Eye,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

// Mock dispute data
const DISPUTE_STATUS = {
  OPEN: 'open',
  IN_REVIEW: 'in_review',
  RESOLVED: 'resolved',
};

const DISPUTE_REASON = {
  SERVICE_NOT_DELIVERED: 'service_not_delivered',
  QUALITY_ISSUE: 'quality_issue',
  PROVIDER_NO_SHOW: 'provider_no_show',
  UNAUTHORIZED_CHARGE: 'unauthorized_charge',
  OTHER: 'other',
};

const mockDisputes = [
  {
    id: 'dispute_001',
    bookingId: 'booking_004',
    applicantId: 'user_001',
    applicantName: 'Sarah Johnson',
    providerId: 'provider_001',
    providerName: 'Sarah Chen',
    serviceName: 'Duke CRNA Program Insider Q&A',
    amount: 50,
    reason: DISPUTE_REASON.QUALITY_ISSUE,
    description: 'The session was only 15 minutes instead of the promised 30 minutes. Provider seemed rushed and didn\'t answer all my questions.',
    status: DISPUTE_STATUS.OPEN,
    priority: 'medium',
    applicantEvidence: [
      { type: 'text', content: 'Call ended at 5:15pm instead of 5:30pm' },
    ],
    providerEvidence: null,
    communicationLog: [
      { from: 'applicant', message: 'Session was cut short', timestamp: '2024-12-10T10:00:00Z' },
      { from: 'system', message: 'Dispute opened', timestamp: '2024-12-10T10:00:00Z' },
    ],
    createdAt: '2024-12-10T10:00:00Z',
    updatedAt: '2024-12-10T10:00:00Z',
  },
  {
    id: 'dispute_002',
    bookingId: 'booking_007',
    applicantId: 'user_004',
    applicantName: 'Mike Williams',
    providerId: 'provider_002',
    providerName: 'Marcus Johnson',
    serviceName: 'Behavioral Interview Prep',
    amount: 110,
    reason: DISPUTE_REASON.PROVIDER_NO_SHOW,
    description: 'Provider never joined the call. I waited for 20 minutes and they didn\'t show up.',
    status: DISPUTE_STATUS.IN_REVIEW,
    priority: 'high',
    applicantEvidence: [
      { type: 'text', content: 'Waited from 4:00pm to 4:20pm, provider never appeared' },
      { type: 'screenshot', url: '/evidence/zoom_waiting_room.png' },
    ],
    providerEvidence: [
      { type: 'text', content: 'Had a clinical emergency at school. Tried to reschedule but couldn\'t reach applicant.' },
    ],
    communicationLog: [
      { from: 'applicant', message: 'Provider didn\'t show up', timestamp: '2024-12-08T16:30:00Z' },
      { from: 'system', message: 'Dispute opened', timestamp: '2024-12-08T16:30:00Z' },
      { from: 'admin', message: 'Requested provider response', timestamp: '2024-12-08T17:00:00Z' },
      { from: 'provider', message: 'Submitted evidence', timestamp: '2024-12-09T09:00:00Z' },
    ],
    createdAt: '2024-12-08T16:30:00Z',
    updatedAt: '2024-12-09T09:00:00Z',
  },
];

const STATUS_CONFIG = {
  [DISPUTE_STATUS.OPEN]: { label: 'Open', icon: AlertTriangle, className: 'bg-yellow-50 text-yellow-800' },
  [DISPUTE_STATUS.IN_REVIEW]: { label: 'In Review', icon: Clock, className: 'bg-blue-50 text-blue-800' },
  [DISPUTE_STATUS.RESOLVED]: { label: 'Resolved', icon: CheckCircle, className: 'bg-green-50 text-green-800' },
};

const REASON_LABELS = {
  [DISPUTE_REASON.SERVICE_NOT_DELIVERED]: 'Service Not Delivered',
  [DISPUTE_REASON.QUALITY_ISSUE]: 'Quality Issue',
  [DISPUTE_REASON.PROVIDER_NO_SHOW]: 'Provider No-Show',
  [DISPUTE_REASON.UNAUTHORIZED_CHARGE]: 'Unauthorized Charge',
  [DISPUTE_REASON.OTHER]: 'Other',
};

function DisputeCard({ dispute, onReview }) {
  const statusConfig = STATUS_CONFIG[dispute.status];
  const StatusIcon = statusConfig.icon;

  return (
    <Card data-testid="dispute-item" className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={statusConfig.className}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {statusConfig.label}
              </Badge>
              {dispute.priority === 'high' && (
                <Badge variant="destructive">High Priority</Badge>
              )}
            </div>
            <h3 className="font-semibold mt-2">{dispute.serviceName}</h3>
            <p className="text-sm text-muted-foreground">${dispute.amount} booking</p>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <div>{format(new Date(dispute.createdAt), 'MMM d, yyyy')}</div>
            <div>{formatDistanceToNow(new Date(dispute.createdAt), { addSuffix: true })}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Label className="text-xs text-muted-foreground">Applicant</Label>
            <p className="text-sm font-medium">{dispute.applicantName}</p>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Provider</Label>
            <p className="text-sm font-medium">{dispute.providerName}</p>
          </div>
        </div>

        <div className="mb-4">
          <Label className="text-xs text-muted-foreground">Reason</Label>
          <p className="text-sm">{REASON_LABELS[dispute.reason]}</p>
        </div>

        <div className="mb-4">
          <Label className="text-xs text-muted-foreground">Description</Label>
          <p className="text-sm line-clamp-2">{dispute.description}</p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              {dispute.communicationLog.length} messages
            </span>
            <span className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              {(dispute.applicantEvidence?.length || 0) + (dispute.providerEvidence?.length || 0)} evidence
            </span>
          </div>
          <Button onClick={() => onReview(dispute)}>
            <Eye className="w-4 h-4 mr-2" />
            Review
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function AdminDisputesPage() {
  const [activeTab, setActiveTab] = useState('open');
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [showResolveDialog, setShowResolveDialog] = useState(false);
  const [resolution, setResolution] = useState('full_refund');
  const [refundAmount, setRefundAmount] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');

  // Filter disputes by status
  const disputes = useMemo(() => ({
    open: mockDisputes.filter(d => d.status === DISPUTE_STATUS.OPEN),
    inReview: mockDisputes.filter(d => d.status === DISPUTE_STATUS.IN_REVIEW),
    resolved: mockDisputes.filter(d => d.status === DISPUTE_STATUS.RESOLVED),
    all: mockDisputes,
  }), []);

  const handleReview = (dispute) => {
    setSelectedDispute(dispute);
    setRefundAmount(String(dispute.amount));
  };

  const openResolveDialog = () => {
    setShowResolveDialog(true);
    setResolution('full_refund');
    setRefundAmount(String(selectedDispute?.amount || 0));
    setResolutionNotes('');
  };

  const confirmResolve = () => {
    // TODO: API call to resolve dispute
    console.log('Resolve dispute:', selectedDispute?.id, {
      resolution,
      refundAmount: resolution === 'partial_refund' ? refundAmount : null,
      notes: resolutionNotes,
    });
    setShowResolveDialog(false);
    setSelectedDispute(null);
  };

  const breadcrumbs = [
    { label: 'Admin', href: '/admin' },
    { label: 'Marketplace', href: '/admin/marketplace' },
    { label: 'Disputes' },
  ];

  return (
    <PageWrapper
      title="Dispute Resolution"
      description="Manage booking disputes and refund requests"
      breadcrumbs={breadcrumbs}
    >
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Open</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{disputes.open.length}</div>
            {disputes.open.length > 0 && (
              <p className="text-xs text-yellow-600">Needs attention</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{disputes.inReview.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{disputes.resolved.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Resolution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3 days</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Disputes List */}
        <div>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="open" className="gap-2">
                Open
                {disputes.open.length > 0 && (
                  <Badge variant="secondary">{disputes.open.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="inReview">In Review ({disputes.inReview.length})</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
            </TabsList>

            <TabsContent value="open" className="mt-4 space-y-4">
              {disputes.open.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                    No open disputes
                  </CardContent>
                </Card>
              ) : (
                disputes.open.map(dispute => (
                  <DisputeCard key={dispute.id} dispute={dispute} onReview={handleReview} />
                ))
              )}
            </TabsContent>

            <TabsContent value="inReview" className="mt-4 space-y-4">
              {disputes.inReview.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No disputes in review
                  </CardContent>
                </Card>
              ) : (
                disputes.inReview.map(dispute => (
                  <DisputeCard key={dispute.id} dispute={dispute} onReview={handleReview} />
                ))
              )}
            </TabsContent>

            <TabsContent value="resolved" className="mt-4 space-y-4">
              {disputes.resolved.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No resolved disputes
                  </CardContent>
                </Card>
              ) : (
                disputes.resolved.map(dispute => (
                  <DisputeCard key={dispute.id} dispute={dispute} onReview={handleReview} />
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Dispute Details Panel */}
        <div>
          {selectedDispute ? (
            <Card className="sticky top-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Dispute Details</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedDispute(null)}>
                    <XCircle className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Booking Info */}
                <div>
                  <h4 className="font-medium mb-2">Booking Information</h4>
                  <div className="p-3 bg-gray-50 rounded-xl space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Service</span>
                      <span className="font-medium">{selectedDispute.serviceName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount</span>
                      <span className="font-medium">${selectedDispute.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Booking ID</span>
                      <span className="font-mono text-sm">{selectedDispute.bookingId}</span>
                    </div>
                  </div>
                </div>

                {/* Parties */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Applicant</h4>
                    <div className="p-3 bg-blue-50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">{selectedDispute.applicantName}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Provider</h4>
                    <div className="p-3 bg-purple-50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-purple-600" />
                        <span className="font-medium">{selectedDispute.providerName}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reason & Description */}
                <div>
                  <h4 className="font-medium mb-2">Dispute Reason</h4>
                  <Badge variant="outline" className="mb-2">
                    {REASON_LABELS[selectedDispute.reason]}
                  </Badge>
                  <p className="text-sm">{selectedDispute.description}</p>
                </div>

                {/* Evidence */}
                <div>
                  <h4 className="font-medium mb-2">Evidence</h4>
                  <div className="space-y-2">
                    <div className="p-3 bg-blue-50 rounded-xl">
                      <Label className="text-xs text-blue-600">From Applicant</Label>
                      {selectedDispute.applicantEvidence?.map((e, i) => (
                        <p key={i} className="text-sm mt-1">{e.content || e.url}</p>
                      )) || <p className="text-sm text-muted-foreground">No evidence submitted</p>}
                    </div>
                    <div className="p-3 bg-purple-50 rounded-xl">
                      <Label className="text-xs text-purple-600">From Provider</Label>
                      {selectedDispute.providerEvidence?.map((e, i) => (
                        <p key={i} className="text-sm mt-1">{e.content || e.url}</p>
                      )) || <p className="text-sm text-muted-foreground">No evidence submitted</p>}
                    </div>
                  </div>
                </div>

                {/* Communication Log */}
                <div>
                  <h4 className="font-medium mb-2">Communication Log</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedDispute.communicationLog.map((log, i) => (
                      <div key={i} className="text-sm p-2 bg-gray-50 rounded">
                        <div className="flex items-center justify-between">
                          <span className="font-medium capitalize">{log.from}</span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(log.timestamp), 'MMM d, h:mm a')}
                          </span>
                        </div>
                        <p className="text-muted-foreground">{log.message}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                {selectedDispute.status !== DISPUTE_STATUS.RESOLVED && (
                  <div className="pt-4 border-t">
                    <Button className="w-full" onClick={openResolveDialog}>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Resolve Dispute
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-16 text-center text-muted-foreground">
                <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select a dispute to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Resolve Dialog */}
      <Dialog open={showResolveDialog} onOpenChange={setShowResolveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Dispute</DialogTitle>
            <DialogDescription>
              Choose a resolution for this dispute
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label>Resolution Type</Label>
              <Select value={resolution} onValueChange={setResolution}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full_refund">Full Refund to Applicant</SelectItem>
                  <SelectItem value="partial_refund">Partial Refund</SelectItem>
                  <SelectItem value="deny">Deny Refund (Provider Keeps Payment)</SelectItem>
                  <SelectItem value="credit">Platform Credit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {resolution === 'partial_refund' && (
              <div className="space-y-2">
                <Label>Refund Amount ($)</Label>
                <Input
                  type="number"
                  min="0"
                  max={selectedDispute?.amount || 0}
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Resolution Notes</Label>
              <Textarea
                placeholder="Explain the reasoning for this resolution..."
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResolveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmResolve}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Confirm Resolution
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );
}

export default AdminDisputesPage;
