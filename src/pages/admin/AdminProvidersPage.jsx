/**
 * AdminProvidersPage
 *
 * Manage provider applications and approved providers.
 * Features: Tabs for Pending/Approved/Rejected, license verification status,
 * approve/reject actions with notes.
 * Route: /admin/marketplace/providers
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
  AlertTriangle,
  Shield,
  GraduationCap,
  Eye,
  UserCheck,
  UserX,
  Pause,
  Play,
  Star,
  Calendar,
  DollarSign,
  ExternalLink,
  MessageSquare,
  Send,
  Info,
  Mail,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockProviders, mockPendingProviders, PROVIDER_STATUS } from '@/data/marketplace/mockProviders';
import {
  MESSAGE_TYPES,
  getProviderConversation,
  getConversationMessages,
  getAdminConversations,
  getUnreadAdminConversations,
  sendAdminMessage,
  approveProviderApplication,
  denyProviderApplication,
  requestProviderInfo,
} from '@/data/marketplace/mockAdminMessages';
import { format, formatDistanceToNow } from 'date-fns';

// Combine all providers for management
function useAllProviders() {
  return useMemo(() => {
    // Transform pending providers to match approved provider structure
    const pending = mockPendingProviders.map(p => ({
      ...p,
      rating: null,
      reviewCount: 0,
      totalBookings: 0,
      isPaused: false,
    }));

    // Get rejected providers (mock - none in current data)
    const rejected = [];

    return {
      pending,
      approved: mockProviders.filter(p => p.status === PROVIDER_STATUS.APPROVED),
      suspended: mockProviders.filter(p => p.status === PROVIDER_STATUS.SUSPENDED),
      rejected,
      all: [...pending, ...mockProviders],
    };
  }, []);
}

function VerificationBadge({ status, label }) {
  const variants = {
    verified: { icon: CheckCircle, className: 'bg-green-100 text-green-800', text: 'Verified' },
    pending: { icon: Clock, className: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
    failed: { icon: XCircle, className: 'bg-red-100 text-red-800', text: 'Failed' },
  };

  const config = variants[status] || variants.pending;
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={`${config.className} gap-1`}>
      <Icon className="w-3 h-3" />
      {label}: {config.text}
    </Badge>
  );
}

function ProviderRow({ provider, onApprove, onReject, onView, onSuspend, onUnsuspend, onMessage, isPending }) {
  const initials = provider.name?.split(' ').map(n => n[0]).join('') || '?';

  return (
    <TableRow data-testid="provider-row">
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={provider.avatarUrl} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{provider.name}</div>
            <div className="text-sm text-muted-foreground">{provider.email || provider.userId}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <GraduationCap className="w-4 h-4 text-muted-foreground" />
          <span>{provider.program}</span>
        </div>
        <div className="text-sm text-muted-foreground">Year {provider.programYear}</div>
      </TableCell>
      <TableCell>
        <div className="text-sm capitalize">{provider.previousIcuType?.replace('_', ' ')}</div>
        <div className="text-sm text-muted-foreground">{provider.yearsIcuExperience} years</div>
      </TableCell>
      <TableCell>
        {isPending ? (
          <div className="flex flex-col gap-1">
            <VerificationBadge status={provider.idVerificationStatus} label="ID" />
            <VerificationBadge status={provider.eduVerificationStatus} label="Edu" />
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <Shield className="w-4 h-4 text-green-600" />
            <span className="text-sm">RN {provider.licenseNumber}</span>
          </div>
        )}
      </TableCell>
      <TableCell>
        {isPending ? (
          <div className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(provider.submittedAt), { addSuffix: true })}
          </div>
        ) : (
          <div>
            {provider.rating && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="font-medium">{provider.rating}</span>
                <span className="text-muted-foreground">({provider.reviewCount})</span>
              </div>
            )}
            <div className="text-sm text-muted-foreground">{provider.totalBookings} bookings</div>
          </div>
        )}
      </TableCell>
      <TableCell>
        {isPending ? (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        ) : provider.isPaused ? (
          <Badge variant="outline" className="bg-orange-50 text-orange-800">
            <Pause className="w-3 h-3 mr-1" />
            Paused
          </Badge>
        ) : provider.status === PROVIDER_STATUS.SUSPENDED ? (
          <Badge variant="destructive">Suspended</Badge>
        ) : (
          <Badge variant="outline" className="bg-green-50 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </Badge>
        )}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(provider)}>
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onMessage(provider)}>
              <MessageSquare className="w-4 h-4 mr-2" />
              Send Message
            </DropdownMenuItem>
            {isPending && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onApprove(provider)} className="text-green-600">
                  <UserCheck className="w-4 h-4 mr-2" />
                  Approve
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onReject(provider)} className="text-red-600">
                  <UserX className="w-4 h-4 mr-2" />
                  Reject
                </DropdownMenuItem>
              </>
            )}
            {!isPending && (
              <>
                <DropdownMenuSeparator />
                {provider.isPaused || provider.status === PROVIDER_STATUS.SUSPENDED ? (
                  <DropdownMenuItem onClick={() => onUnsuspend(provider)}>
                    <Play className="w-4 h-4 mr-2" />
                    Reactivate
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => onSuspend(provider)} className="text-orange-600">
                    <Pause className="w-4 h-4 mr-2" />
                    Suspend
                  </DropdownMenuItem>
                )}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

// Admin Inbox Component
function AdminInbox({ onOpenConversation }) {
  const conversations = useMemo(() => getAdminConversations(), []);
  const unreadConversations = useMemo(() => getUnreadAdminConversations(), []);

  if (conversations.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-medium text-lg mb-2">No messages yet</h3>
        <p className="text-muted-foreground">
          Messages from providers will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {conversations.map((conversation) => {
        const messages = getConversationMessages(conversation.id);
        const lastMessage = messages[messages.length - 1];
        const hasUnread = conversation.unreadByAdmin > 0;

        return (
          <button
            key={conversation.id}
            onClick={() => onOpenConversation(conversation)}
            className={`w-full text-left p-4 rounded-xl border transition-colors hover:bg-gray-50 ${
              hasUnread ? 'bg-blue-50 border-blue-200' : 'bg-white'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarFallback>
                    {conversation.providerName?.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{conversation.providerName}</span>
                    {hasUnread && (
                      <Badge variant="default" className="bg-blue-600">
                        {conversation.unreadByAdmin} new
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {lastMessage?.content?.slice(0, 60)}...
                  </p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(conversation.lastMessageAt), { addSuffix: true })}
                </div>
                <Badge
                  variant="outline"
                  className={`mt-1 text-xs ${
                    conversation.status === 'open'
                      ? 'bg-yellow-50 text-yellow-800'
                      : conversation.status === 'waiting_response'
                      ? 'bg-orange-50 text-orange-800'
                      : 'bg-green-50 text-green-800'
                  }`}
                >
                  {conversation.status === 'waiting_response' ? 'Waiting' : conversation.status}
                </Badge>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export function AdminProvidersPage() {
  const providers = useAllProviders();
  const [activeTab, setActiveTab] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [messageType, setMessageType] = useState(MESSAGE_TYPES.CHECK_IN);
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // Get unread message count for inbox badge
  const unreadConversations = useMemo(() => getUnreadAdminConversations(), []);

  // Filter providers based on search
  const filteredProviders = useMemo(() => {
    const query = searchQuery.toLowerCase();
    const filterFn = (p) =>
      p.name?.toLowerCase().includes(query) ||
      p.program?.toLowerCase().includes(query) ||
      p.email?.toLowerCase().includes(query);

    return {
      pending: providers.pending.filter(filterFn),
      approved: providers.approved.filter(filterFn),
      suspended: providers.suspended.filter(filterFn),
    };
  }, [providers, searchQuery]);

  const handleApprove = (provider) => {
    setSelectedProvider(provider);
    setShowApproveDialog(true);
  };

  const handleReject = (provider) => {
    setSelectedProvider(provider);
    setRejectReason('');
    setShowRejectDialog(true);
  };

  const handleView = (provider) => {
    setSelectedProvider(provider);
    setShowDetailsDialog(true);
  };

  const handleSuspend = (provider) => {
    // TODO: Implement suspend logic
    console.log('Suspend provider:', provider.id);
  };

  const handleUnsuspend = (provider) => {
    // TODO: Implement unsuspend logic
    console.log('Unsuspend provider:', provider.id);
  };

  const handleMessage = (provider) => {
    setSelectedProvider(provider);
    setMessageContent('');
    setMessageType(MESSAGE_TYPES.CHECK_IN);
    setShowMessageDialog(true);
  };

  // Open conversation from inbox
  const handleOpenConversation = (conversation) => {
    // Create a mock provider object from conversation data for the message dialog
    const providerFromConversation = {
      id: conversation.providerId,
      name: conversation.providerName,
      email: conversation.providerEmail,
    };
    setSelectedProvider(providerFromConversation);
    setMessageContent('');
    setMessageType(MESSAGE_TYPES.CHECK_IN);
    setShowMessageDialog(true);
  };

  // Get conversation for selected provider
  const selectedConversation = useMemo(() => {
    if (!selectedProvider) return { conversation: null, messages: [] };
    const conversation = getProviderConversation(selectedProvider.id);
    const messages = conversation ? getConversationMessages(conversation.id) : [];
    return { conversation, messages };
  }, [selectedProvider]);

  const confirmApprove = () => {
    // TODO: Replace with actual API call
    const result = approveProviderApplication(selectedProvider?.id);
    console.log('Approved:', selectedProvider?.id, result);
    // In production, this would:
    // 1. Update application status in DB
    // 2. Add Groundhogg tag: srna_provider_approved
    // 3. Send in-app notification
    // 4. Create system message in conversation
    setShowApproveDialog(false);
    setSelectedProvider(null);
  };

  const confirmReject = () => {
    // TODO: Replace with actual API call
    const result = denyProviderApplication(selectedProvider?.id, rejectReason);
    console.log('Rejected:', selectedProvider?.id, 'Reason:', rejectReason, result);
    // In production, this would:
    // 1. Update application status in DB
    // 2. Add Groundhogg tag: srna_provider_denied
    // 3. Send in-app notification
    // 4. Create message in conversation with denial reason
    // 5. Set reapply date (30 days)
    setShowRejectDialog(false);
    setSelectedProvider(null);
    setRejectReason('');
  };

  const handleSendMessage = async () => {
    if (!messageContent.trim() || !selectedProvider) return;

    setIsSendingMessage(true);
    // TODO: Replace with actual API call
    const result = sendAdminMessage(selectedProvider.id, messageContent, messageType);
    console.log('Message sent:', result);

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 500));

    setIsSendingMessage(false);
    setMessageContent('');
    // Keep dialog open to continue conversation or close
    // setShowMessageDialog(false);
  };

  const handleRequestInfo = async () => {
    if (!messageContent.trim() || !selectedProvider) return;

    setIsSendingMessage(true);
    // TODO: Replace with actual API call
    const result = requestProviderInfo(selectedProvider.id, messageContent);
    console.log('Info requested:', result);

    await new Promise(resolve => setTimeout(resolve, 500));

    setIsSendingMessage(false);
    setMessageContent('');
  };

  const breadcrumbs = [
    { label: 'Admin', href: '/admin' },
    { label: 'Marketplace', href: '/admin/marketplace' },
    { label: 'Providers' },
  ];

  return (
    <PageWrapper
      title="Provider Management"
      description="Review applications and manage approved providers"
      breadcrumbs={breadcrumbs}
    >
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{providers.pending.length}</div>
            {providers.pending.length > 0 && (
              <p className="text-xs text-orange-600">Action needed</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {providers.approved.filter(p => !p.isPaused).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Paused</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {providers.approved.filter(p => p.isPaused).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Suspended</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{providers.suspended.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, program, or email..."
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
            Pending
            {providers.pending.length > 0 && (
              <Badge variant="secondary" className="ml-1">{providers.pending.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">Approved ({providers.approved.length})</TabsTrigger>
          <TabsTrigger value="suspended">Suspended ({providers.suspended.length})</TabsTrigger>
          <TabsTrigger value="inbox" className="gap-2">
            <Mail className="w-4 h-4" />
            Inbox
            {unreadConversations.length > 0 && (
              <Badge variant="default" className="ml-1 bg-blue-600">{unreadConversations.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Applications</CardTitle>
              <CardDescription>
                Review and approve or reject provider applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredProviders.pending.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {searchQuery ? 'No pending applications match your search' : 'No pending applications'}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Applicant</TableHead>
                      <TableHead>Program</TableHead>
                      <TableHead>ICU Experience</TableHead>
                      <TableHead>Verification</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProviders.pending.map((provider) => (
                      <ProviderRow
                        key={provider.id}
                        provider={provider}
                        isPending={true}
                        onApprove={handleApprove}
                        onReject={handleReject}
                        onView={handleView}
                        onSuspend={handleSuspend}
                        onUnsuspend={handleUnsuspend}
                        onMessage={handleMessage}
                      />
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Approved Providers</CardTitle>
              <CardDescription>
                Active and paused providers on the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredProviders.approved.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {searchQuery ? 'No approved providers match your search' : 'No approved providers'}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Provider</TableHead>
                      <TableHead>Program</TableHead>
                      <TableHead>ICU Experience</TableHead>
                      <TableHead>License</TableHead>
                      <TableHead>Performance</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProviders.approved.map((provider) => (
                      <ProviderRow
                        key={provider.id}
                        provider={provider}
                        isPending={false}
                        onApprove={handleApprove}
                        onReject={handleReject}
                        onView={handleView}
                        onSuspend={handleSuspend}
                        onUnsuspend={handleUnsuspend}
                        onMessage={handleMessage}
                      />
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suspended" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Suspended Providers</CardTitle>
              <CardDescription>
                Providers temporarily or permanently suspended
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredProviders.suspended.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No suspended providers
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Provider</TableHead>
                      <TableHead>Program</TableHead>
                      <TableHead>ICU Experience</TableHead>
                      <TableHead>License</TableHead>
                      <TableHead>Performance</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProviders.suspended.map((provider) => (
                      <ProviderRow
                        key={provider.id}
                        provider={provider}
                        isPending={false}
                        onApprove={handleApprove}
                        onReject={handleReject}
                        onView={handleView}
                        onSuspend={handleSuspend}
                        onUnsuspend={handleUnsuspend}
                        onMessage={handleMessage}
                      />
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inbox" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Provider Messages
              </CardTitle>
              <CardDescription>
                Manage conversations with providers and applicants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AdminInbox onOpenConversation={handleOpenConversation} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Provider Application</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve {selectedProvider?.name}'s application?
              They will be able to offer services on the marketplace.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
              <UserCheck className="w-8 h-8 text-green-600" />
              <div>
                <div className="font-medium">{selectedProvider?.name}</div>
                <div className="text-sm text-muted-foreground">{selectedProvider?.program}</div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmApprove} className="bg-green-600 hover:bg-green-700">
              <UserCheck className="w-4 h-4 mr-2" />
              Approve Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Provider Application</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting {selectedProvider?.name}'s application.
              This will be sent to the applicant.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl">
              <UserX className="w-8 h-8 text-red-600" />
              <div>
                <div className="font-medium">{selectedProvider?.name}</div>
                <div className="text-sm text-muted-foreground">{selectedProvider?.program}</div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reject-reason">Rejection Reason</Label>
              <Textarea
                id="reject-reason"
                placeholder="Please explain why this application is being rejected..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmReject}
              disabled={!rejectReason.trim()}
            >
              <UserX className="w-4 h-4 mr-2" />
              Reject Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Provider Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Provider Details</DialogTitle>
          </DialogHeader>
          {selectedProvider && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedProvider.avatarUrl} />
                  <AvatarFallback className="text-lg">
                    {selectedProvider.name?.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedProvider.name}</h3>
                  <p className="text-muted-foreground">{selectedProvider.program} • Year {selectedProvider.programYear}</p>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">ICU Type</Label>
                  <p className="capitalize">{selectedProvider.previousIcuType?.replace('_', ' ')}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">ICU Experience</Label>
                  <p>{selectedProvider.yearsIcuExperience} years</p>
                </div>
                {selectedProvider.licenseNumber && (
                  <>
                    <div>
                      <Label className="text-muted-foreground">RN License</Label>
                      <p>{selectedProvider.licenseNumber} ({selectedProvider.licenseState})</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Commission Rate</Label>
                      <p>{selectedProvider.commissionRate}%</p>
                    </div>
                  </>
                )}
                {selectedProvider.rating && (
                  <>
                    <div>
                      <Label className="text-muted-foreground">Rating</Label>
                      <p className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        {selectedProvider.rating} ({selectedProvider.reviewCount} reviews)
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Total Bookings</Label>
                      <p>{selectedProvider.totalBookings}</p>
                    </div>
                  </>
                )}
              </div>

              {/* Bio */}
              {selectedProvider.bio && (
                <div>
                  <Label className="text-muted-foreground">Bio</Label>
                  <p className="mt-1">{selectedProvider.bio}</p>
                </div>
              )}

              {/* Application Notes */}
              {selectedProvider.applicationNotes && (
                <div className="p-4 bg-yellow-50 rounded-xl">
                  <Label className="text-yellow-800">Application Notes</Label>
                  <p className="mt-1 text-yellow-900">{selectedProvider.applicationNotes}</p>
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

      {/* Message Dialog */}
      <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Message {selectedProvider?.name}
            </DialogTitle>
            <DialogDescription>
              Send a message to this provider. They will receive a notification.
            </DialogDescription>
          </DialogHeader>

          {selectedProvider && (
            <div className="flex-1 min-h-0 space-y-4">
              {/* Provider Info */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedProvider.avatarUrl} />
                  <AvatarFallback>
                    {selectedProvider.name?.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{selectedProvider.name}</div>
                  <div className="text-sm text-muted-foreground">{selectedProvider.email || selectedProvider.program}</div>
                </div>
              </div>

              {/* Conversation History */}
              {selectedConversation.messages.length > 0 && (
                <div>
                  <Label className="text-muted-foreground text-xs uppercase tracking-widest">
                    Previous Messages
                  </Label>
                  <ScrollArea className="h-48 mt-2 border rounded-xl">
                    <div className="p-4 space-y-3">
                      {selectedConversation.messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${
                            msg.senderRole === 'admin' ? 'items-end' : 'items-start'
                          }`}
                        >
                          <div
                            className={`max-w-[80%] rounded-xl p-3 ${
                              msg.senderRole === 'admin'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-gray-100'
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                          </div>
                          <span className="text-xs text-muted-foreground mt-1">
                            {msg.senderName} • {format(new Date(msg.createdAt), 'MMM d, h:mm a')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}

              {/* Message Type Selection */}
              <div className="space-y-2">
                <Label>Message Type</Label>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    type="button"
                    size="sm"
                    variant={messageType === MESSAGE_TYPES.CHECK_IN ? 'default' : 'outline'}
                    onClick={() => setMessageType(MESSAGE_TYPES.CHECK_IN)}
                  >
                    <Mail className="w-3 h-3 mr-1" />
                    Check-in
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={messageType === MESSAGE_TYPES.INFO_REQUEST ? 'default' : 'outline'}
                    onClick={() => setMessageType(MESSAGE_TYPES.INFO_REQUEST)}
                  >
                    <Info className="w-3 h-3 mr-1" />
                    Request Info
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={messageType === MESSAGE_TYPES.APPLICATION_UPDATE ? 'default' : 'outline'}
                    onClick={() => setMessageType(MESSAGE_TYPES.APPLICATION_UPDATE)}
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    Application Update
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={messageType === MESSAGE_TYPES.SUPPORT ? 'default' : 'outline'}
                    onClick={() => setMessageType(MESSAGE_TYPES.SUPPORT)}
                  >
                    <MessageSquare className="w-3 h-3 mr-1" />
                    Support
                  </Button>
                </div>
              </div>

              {/* Message Input */}
              <div className="space-y-2">
                <Label htmlFor="message-content">Message</Label>
                <Textarea
                  id="message-content"
                  placeholder={
                    messageType === MESSAGE_TYPES.INFO_REQUEST
                      ? "What information do you need from this provider?"
                      : messageType === MESSAGE_TYPES.CHECK_IN
                      ? "How can we help? Any questions about the platform?"
                      : "Type your message..."
                  }
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  rows={4}
                />
              </div>

              {/* Quick Templates for Info Request */}
              {messageType === MESSAGE_TYPES.INFO_REQUEST && (
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs">Quick Templates</Label>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="text-xs"
                      onClick={() => setMessageContent('Could you provide a clearer photo of your student ID? The current one is difficult to read.')}
                    >
                      Unclear student ID
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="text-xs"
                      onClick={() => setMessageContent('We need verification of your enrollment in a CRNA program. Please provide an enrollment letter or official documentation from your school.')}
                    >
                      Enrollment verification
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="text-xs"
                      onClick={() => setMessageContent('Could you provide your RN license number and the state where it was issued?')}
                    >
                      License info needed
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowMessageDialog(false)}>
              Cancel
            </Button>
            {messageType === MESSAGE_TYPES.INFO_REQUEST ? (
              <Button
                onClick={handleRequestInfo}
                disabled={!messageContent.trim() || isSendingMessage}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {isSendingMessage ? (
                  <>Sending...</>
                ) : (
                  <>
                    <Info className="w-4 h-4 mr-2" />
                    Request Info
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleSendMessage}
                disabled={!messageContent.trim() || isSendingMessage}
              >
                {isSendingMessage ? (
                  <>Sending...</>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );
}

export default AdminProvidersPage;
