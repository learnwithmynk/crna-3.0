/**
 * AdminCommunityReportsPage
 *
 * Admin page for moderating community content reports.
 * Features:
 * - Tab filters: All, Pending, Reviewed, Dismissed, Actioned
 * - Report cards with content preview, reporter, reason, timestamp
 * - Actions: View, Dismiss, Hide Content, Suspend User
 * - Bulk action checkbox selection
 *
 * Route: /admin/community/reports
 */

import { useState, useMemo } from 'react';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  EyeOff,
  UserX,
  Eye,
} from 'lucide-react';
import { ReportCard } from '@/components/features/admin/ReportCard';
import { ReportActionSheet } from '@/components/features/admin/ReportActionSheet';
import { EmptyState } from '@/components/ui/empty-state';
import { useAdminReports } from '@/hooks/useAdminReports';
import { REPORT_STATUS } from '@/data/community/mockReports';

export function AdminCommunityReportsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedReports, setSelectedReports] = useState([]);
  const [actionSheet, setActionSheet] = useState({
    open: false,
    report: null,
    actionType: null, // 'dismiss' | 'hide' | 'suspend'
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const { reports, isLoading, updateReportStatus, hideContent, suspendUser } = useAdminReports(activeTab);
  const { reports: allReports } = useAdminReports('all');

  // Count by status
  const counts = useMemo(() => {
    return {
      all: allReports.length,
      pending: allReports.filter(r => r.status === REPORT_STATUS.PENDING).length,
      reviewed: allReports.filter(r => r.status === REPORT_STATUS.REVIEWED).length,
      dismissed: allReports.filter(r => r.status === REPORT_STATUS.DISMISSED).length,
      actioned: allReports.filter(r => r.status === REPORT_STATUS.ACTIONED).length,
    };
  }, [allReports]);

  // Toggle report selection
  const toggleReportSelection = (reportId) => {
    setSelectedReports(prev =>
      prev.includes(reportId)
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    );
  };

  // Select/deselect all reports
  const toggleSelectAll = () => {
    if (selectedReports.length === reports.length) {
      setSelectedReports([]);
    } else {
      setSelectedReports(reports.map(r => r.id));
    }
  };

  // Open action sheet
  const openActionSheet = (report, actionType) => {
    setActionSheet({ open: true, report, actionType });
  };

  // Close action sheet
  const closeActionSheet = () => {
    setActionSheet({ open: false, report: null, actionType: null });
  };

  // Handle view report
  const handleViewReport = (report) => {
    console.log('Viewing report:', report);
    // TODO: Could open a detailed view modal if needed
  };

  // Handle dismiss report
  const handleDismissReport = (report) => {
    openActionSheet(report, 'dismiss');
  };

  // Handle hide content
  const handleHideContent = (report) => {
    openActionSheet(report, 'hide');
  };

  // Handle suspend user
  const handleSuspendUser = (report) => {
    openActionSheet(report, 'suspend');
  };

  // Confirm action from sheet
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
          await updateReportStatus(
            report.id,
            REPORT_STATUS.ACTIONED,
            `Content hidden. ${data.adminNotes}`
          );
          break;

        case 'suspend':
          await suspendUser(
            report.content_author_id,
            data.durationDays,
            data.adminNotes
          );
          await updateReportStatus(
            report.id,
            REPORT_STATUS.ACTIONED,
            `User suspended for ${data.durationDays === 0 ? 'permanent' : `${data.durationDays} days`}. ${data.adminNotes}`
          );
          break;
      }

      // Clear selection if report was selected
      setSelectedReports(prev => prev.filter(id => id !== report.id));

      closeActionSheet();
    } catch (error) {
      console.error('Error processing action:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Bulk dismiss selected reports
  const handleBulkDismiss = async () => {
    setIsProcessing(true);
    try {
      for (const reportId of selectedReports) {
        await updateReportStatus(reportId, REPORT_STATUS.DISMISSED, 'Bulk dismissed');
      }
      setSelectedReports([]);
    } catch (error) {
      console.error('Error bulk dismissing:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const breadcrumbs = [
    { label: 'Admin', href: '/admin' },
    { label: 'Community', href: '/admin/community' },
    { label: 'Reports' },
  ];

  return (
    <PageWrapper
      title="Community Reports"
      description="Review and moderate reported community content"
      breadcrumbs={breadcrumbs}
    >
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{counts.all}</div>
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
            <CardTitle className="text-sm font-medium text-muted-foreground">Reviewed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{counts.reviewed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Dismissed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{counts.dismissed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Actioned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{counts.actioned}</div>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Actions (shown when reports are selected) */}
      {selectedReports.length > 0 && (
        <Card className="mb-6 border-primary">
          <CardContent className="py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={selectedReports.length === reports.length}
                  onCheckedChange={toggleSelectAll}
                />
                <span className="text-sm font-medium">
                  {selectedReports.length} report{selectedReports.length !== 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleBulkDismiss}
                  disabled={isProcessing}
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Dismiss All
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedReports([])}
                >
                  Clear Selection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">
            All ({counts.all})
          </TabsTrigger>
          <TabsTrigger value="pending" className="gap-2">
            <AlertTriangle className="w-4 h-4" />
            Pending
            {counts.pending > 0 && (
              <Badge variant="secondary" className="ml-1 bg-orange-100 text-orange-800">
                {counts.pending}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="reviewed">
            Reviewed ({counts.reviewed})
          </TabsTrigger>
          <TabsTrigger value="dismissed">
            Dismissed ({counts.dismissed})
          </TabsTrigger>
          <TabsTrigger value="actioned">
            Actioned ({counts.actioned})
          </TabsTrigger>
        </TabsList>

        {/* Tab Content */}
        {['all', 'pending', 'reviewed', 'dismissed', 'actioned'].map(status => (
          <TabsContent key={status} value={status} className="mt-6">
            {isLoading ? (
              <Card>
                <CardContent className="py-12">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                  </div>
                </CardContent>
              </Card>
            ) : reports.length === 0 ? (
              <EmptyState
                icon={status === 'pending' ? AlertTriangle : CheckCircle}
                title={`No ${status === 'all' ? '' : status} reports`}
                description={
                  status === 'pending'
                    ? 'All caught up! No reports need review.'
                    : `No reports have been ${status}.`
                }
              />
            ) : (
              <div className="space-y-4">
                {reports.map((report) => (
                  <div key={report.id} className="flex items-start gap-3">
                    {/* Checkbox for selection */}
                    <Checkbox
                      checked={selectedReports.includes(report.id)}
                      onCheckedChange={() => toggleReportSelection(report.id)}
                      className="mt-5"
                    />
                    {/* Report Card */}
                    <div className="flex-1">
                      <ReportCard
                        report={report}
                        onView={handleViewReport}
                        onDismiss={handleDismissReport}
                        onHideContent={handleHideContent}
                        onSuspendUser={handleSuspendUser}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Action Sheet */}
      <ReportActionSheet
        open={actionSheet.open}
        onOpenChange={(open) => !open && closeActionSheet()}
        report={actionSheet.report}
        actionType={actionSheet.actionType}
        onConfirm={handleConfirmAction}
        isLoading={isProcessing}
      />
    </PageWrapper>
  );
}

export default AdminCommunityReportsPage;
