/**
 * ModerationTab
 *
 * Combined reports queue and user suspensions management.
 */

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertTriangle,
  CheckCircle,
  UserX,
  UserCheck,
  XCircle,
  EyeOff,
  Plus,
  Search,
  Ban,
  Clock,
} from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { ReportCard } from '@/components/features/admin/ReportCard';
import { ReportActionSheet } from '@/components/features/admin/ReportActionSheet';
import { useAdminReports } from '@/hooks/useAdminReports';
import { useAdminSuspensions } from '@/hooks/useAdminSuspensions';
import { REPORT_STATUS } from '@/data/community/mockReports';
import { SUSPENSION_DURATIONS } from '@/data/community/mockSuspensions';

export function ModerationTab() {
  const [subTab, setSubTab] = useState('reports');
  const [reportFilter, setReportFilter] = useState('pending');

  // Reports state
  const [actionSheet, setActionSheet] = useState({
    open: false,
    report: null,
    actionType: null,
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Suspensions state
  const [createSuspensionOpen, setCreateSuspensionOpen] = useState(false);
  const [liftSuspensionOpen, setLiftSuspensionOpen] = useState(false);
  const [selectedSuspension, setSelectedSuspension] = useState(null);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [suspensionReason, setSuspensionReason] = useState('');
  const [suspensionDuration, setSuspensionDuration] = useState('7');
  const [liftNotes, setLiftNotes] = useState('');

  // Reports hook
  const { reports, isLoading: reportsLoading, updateReportStatus, hideContent, suspendUser } = useAdminReports(reportFilter);

  // Suspensions hook
  const activeSuspensions = useAdminSuspensions('active');
  const historySuspensions = useAdminSuspensions('history');

  // Report counts
  const allReports = useAdminReports('all').reports;
  const reportCounts = useMemo(() => ({
    pending: allReports.filter(r => r.status === REPORT_STATUS.PENDING).length,
    reviewed: allReports.filter(r => r.status === REPORT_STATUS.REVIEWED).length,
    actioned: allReports.filter(r => r.status === REPORT_STATUS.ACTIONED).length,
  }), [allReports]);

  // ===== REPORTS HANDLERS =====

  const openActionSheet = (report, actionType) => {
    setActionSheet({ open: true, report, actionType });
  };

  const closeActionSheet = () => {
    setActionSheet({ open: false, report: null, actionType: null });
  };

  const handleConfirmAction = async (data) => {
    if (!actionSheet.report) return;

    setIsProcessing(true);
    try {
      const { report, actionType } = actionSheet;

      switch (actionType) {
        case 'dismiss':
          await updateReportStatus(report.id, REPORT_STATUS.DISMISSED, data.adminNotes);
          break;
        case 'hide':
          await hideContent(report.content_type, report.content_id);
          await updateReportStatus(report.id, REPORT_STATUS.ACTIONED, `Content hidden. ${data.adminNotes}`);
          break;
        case 'suspend':
          await suspendUser(report.content_author_id, data.durationDays, data.adminNotes);
          await updateReportStatus(report.id, REPORT_STATUS.ACTIONED, `User suspended. ${data.adminNotes}`);
          break;
      }
      closeActionSheet();
    } catch (error) {
      console.error('Error processing action:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // ===== SUSPENSIONS HANDLERS =====

  const handleUserSearch = async (query) => {
    setUserSearchQuery(query);
    if (query.length >= 2) {
      const results = await activeSuspensions.searchUsers(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setUserSearchQuery(user.email);
    setSearchResults([]);
  };

  const handleCreateSuspension = async () => {
    if (!selectedUser || !suspensionReason.trim()) return;

    setIsProcessing(true);
    try {
      await activeSuspensions.createSuspension(
        selectedUser.id,
        suspensionReason,
        parseInt(suspensionDuration)
      );
      setCreateSuspensionOpen(false);
      resetSuspensionForm();
    } catch (error) {
      console.error('Error creating suspension:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLiftSuspension = async () => {
    if (!selectedSuspension) return;

    setIsProcessing(true);
    try {
      await activeSuspensions.liftSuspension(selectedSuspension.id, liftNotes);
      setLiftSuspensionOpen(false);
      setSelectedSuspension(null);
      setLiftNotes('');
    } catch (error) {
      console.error('Error lifting suspension:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetSuspensionForm = () => {
    setUserSearchQuery('');
    setSearchResults([]);
    setSelectedUser(null);
    setSuspensionReason('');
    setSuspensionDuration('7');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDurationLabel = (suspendedAt, suspendedUntil) => {
    if (!suspendedUntil) return 'Permanent';
    const start = new Date(suspendedAt);
    const end = new Date(suspendedUntil);
    const days = Math.round((end - start) / (1000 * 60 * 60 * 24));
    return `${days} day${days !== 1 ? 's' : ''}`;
  };

  return (
    <div className="space-y-6">
      <Tabs value={subTab} onValueChange={setSubTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="reports" className="gap-2">
              <AlertTriangle className="h-4 w-4" />
              Reports
              {reportCounts.pending > 0 && (
                <Badge variant="secondary" className="ml-1 bg-orange-100 text-orange-800">
                  {reportCounts.pending}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="suspensions" className="gap-2">
              <UserX className="h-4 w-4" />
              Suspensions
              {activeSuspensions.suspensions.length > 0 && (
                <Badge variant="secondary" className="ml-1 bg-red-100 text-red-800">
                  {activeSuspensions.suspensions.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {subTab === 'suspensions' && (
            <Button onClick={() => setCreateSuspensionOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Suspension
            </Button>
          )}
        </div>

        {/* Reports Tab Content */}
        <TabsContent value="reports" className="mt-6 space-y-4">
          {/* Report Filter */}
          <div className="flex gap-2">
            {['pending', 'reviewed', 'actioned'].map((status) => (
              <Button
                key={status}
                variant={reportFilter === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setReportFilter(status)}
              >
                {status === 'pending' && <AlertTriangle className="h-4 w-4 mr-1" />}
                {status === 'reviewed' && <CheckCircle className="h-4 w-4 mr-1" />}
                {status === 'actioned' && <EyeOff className="h-4 w-4 mr-1" />}
                {status.charAt(0).toUpperCase() + status.slice(1)}
                <Badge variant="secondary" className="ml-2">
                  {reportCounts[status] || 0}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Reports List */}
          {reportsLoading ? (
            <Card>
              <CardContent className="py-12">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              </CardContent>
            </Card>
          ) : reports.length === 0 ? (
            <EmptyState
              icon={reportFilter === 'pending' ? AlertTriangle : CheckCircle}
              title={`No ${reportFilter} reports`}
              description={
                reportFilter === 'pending'
                  ? 'All caught up! No reports need review.'
                  : `No reports have been ${reportFilter}.`
              }
            />
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  onDismiss={(r) => openActionSheet(r, 'dismiss')}
                  onHideContent={(r) => openActionSheet(r, 'hide')}
                  onSuspendUser={(r) => openActionSheet(r, 'suspend')}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Suspensions Tab Content */}
        <TabsContent value="suspensions" className="mt-6 space-y-4">
          {/* Active Suspensions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <UserX className="h-4 w-4" />
                Active Suspensions ({activeSuspensions.suspensions.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activeSuspensions.suspensions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No active suspensions</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeSuspensions.suspensions.map((suspension) => (
                      <TableRow key={suspension.id} data-testid="suspension-row">
                        <TableCell>
                          <div>
                            <div className="font-medium">{suspension.user_name}</div>
                            <div className="text-sm text-muted-foreground">{suspension.user_email}</div>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{suspension.reason}</TableCell>
                        <TableCell>
                          <Badge variant={suspension.suspended_until ? 'secondary' : 'destructive'}>
                            {getDurationLabel(suspension.suspended_at, suspension.suspended_until)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {suspension.suspended_until ? formatDate(suspension.suspended_until) : 'Never'}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedSuspension(suspension);
                              setLiftSuspensionOpen(true);
                            }}
                          >
                            <UserCheck className="h-4 w-4 mr-1" />
                            Lift
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Suspension History */}
          {historySuspensions.suspensions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  History ({historySuspensions.suspensions.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ended</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {historySuspensions.suspensions.slice(0, 5).map((suspension) => (
                      <TableRow key={suspension.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{suspension.user_name}</div>
                            <div className="text-sm text-muted-foreground">{suspension.user_email}</div>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{suspension.reason}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {getDurationLabel(suspension.suspended_at, suspension.suspended_until)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {suspension.status === 'lifted' ? 'Lifted' : 'Expired'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(suspension.lifted_at || suspension.suspended_until)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Report Action Sheet */}
      <ReportActionSheet
        open={actionSheet.open}
        onOpenChange={(open) => !open && closeActionSheet()}
        report={actionSheet.report}
        actionType={actionSheet.actionType}
        onConfirm={handleConfirmAction}
        isLoading={isProcessing}
      />

      {/* Create Suspension Dialog */}
      <Dialog open={createSuspensionOpen} onOpenChange={setCreateSuspensionOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create User Suspension</DialogTitle>
            <DialogDescription>
              Suspend a user from posting in the community.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Search User</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={userSearchQuery}
                  onChange={(e) => handleUserSearch(e.target.value)}
                  className="pl-9"
                />
                {searchResults.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-auto">
                    {searchResults.map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => handleSelectUser(user)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100"
                      >
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {selectedUser && (
                <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                  <UserX className="h-4 w-4" />
                  <div>
                    <div className="font-medium text-sm">{selectedUser.name}</div>
                    <div className="text-xs text-muted-foreground">{selectedUser.email}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Reason</Label>
              <Textarea
                placeholder="Explain why this user is being suspended..."
                value={suspensionReason}
                onChange={(e) => setSuspensionReason(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Duration</Label>
              <Select value={suspensionDuration} onValueChange={setSuspensionDuration}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUSPENSION_DURATIONS.map((d) => (
                    <SelectItem key={d.value} value={String(d.value)}>
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateSuspensionOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateSuspension}
              disabled={!selectedUser || !suspensionReason.trim() || isProcessing}
            >
              <Ban className="h-4 w-4 mr-2" />
              {isProcessing ? 'Creating...' : 'Create Suspension'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lift Suspension Dialog */}
      <Dialog open={liftSuspensionOpen} onOpenChange={setLiftSuspensionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lift Suspension</DialogTitle>
            <DialogDescription>
              End this suspension early and restore user's posting privileges.
            </DialogDescription>
          </DialogHeader>

          {selectedSuspension && (
            <div className="py-4 space-y-4">
              <div className="p-3 bg-muted rounded-lg">
                <div className="font-medium">{selectedSuspension.user_name}</div>
                <div className="text-sm text-muted-foreground">{selectedSuspension.user_email}</div>
                <div className="text-sm mt-2">
                  <span className="font-medium">Reason: </span>
                  {selectedSuspension.reason}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Notes (Optional)</Label>
                <Textarea
                  placeholder="Explain why this suspension is being lifted..."
                  value={liftNotes}
                  onChange={(e) => setLiftNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setLiftSuspensionOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleLiftSuspension} disabled={isProcessing}>
              <UserCheck className="h-4 w-4 mr-2" />
              {isProcessing ? 'Lifting...' : 'Lift Suspension'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ModerationTab;
