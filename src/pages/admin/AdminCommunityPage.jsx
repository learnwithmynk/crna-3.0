/**
 * AdminCommunityPage
 *
 * Unified admin page for community management with 4 tabs:
 * - Forums: Create/edit/reorder/delete forums & subforums
 * - Content: Browse all topics/replies, pin/lock/hide/delete
 * - Moderation: Reports queue + user suspensions
 * - Settings: Profanity word list management
 *
 * Route: /admin/community
 */

import { useState } from 'react';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  MessageSquare,
  FileText,
  Shield,
  Settings,
  Users,
  MessageCircle,
  AlertTriangle,
} from 'lucide-react';

// Tab components
import { ForumsTab } from '@/components/features/admin/community/ForumsTab';
import { ContentTab } from '@/components/features/admin/community/ContentTab';
import { ModerationTab } from '@/components/features/admin/community/ModerationTab';
import { SettingsTab } from '@/components/features/admin/community/SettingsTab';

// Hooks for stats
import { useAdminForums } from '@/hooks/useAdminForums';
import { useAdminReports } from '@/hooks/useAdminReports';
import { useAdminSuspensions } from '@/hooks/useAdminSuspensions';

export function AdminCommunityPage() {
  const [activeTab, setActiveTab] = useState('forums');

  // Get stats for overview cards
  const { getStats } = useAdminForums();
  const { reports: pendingReports } = useAdminReports('pending');
  const { suspensions: activeSuspensions } = useAdminSuspensions('active');

  const stats = getStats();
  const pendingReportCount = pendingReports?.length || 0;
  const activeSuspensionCount = activeSuspensions?.length || 0;

  const breadcrumbs = [
    { label: 'Admin', href: '/admin' },
    { label: 'Community' },
  ];

  return (
    <PageWrapper
      title="Community Management"
      description="Manage forums, moderate content, and configure community settings"
      breadcrumbs={breadcrumbs}
    >
      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Forums</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalForums}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalSubforums} subforums
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Topics</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTopics.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalReplies.toLocaleString()} replies
            </p>
          </CardContent>
        </Card>

        <Card className={pendingReportCount > 0 ? 'border-orange-200 bg-orange-50' : ''}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Reports</CardTitle>
            <AlertTriangle className={`h-4 w-4 ${pendingReportCount > 0 ? 'text-orange-500' : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingReportCount}</div>
            {pendingReportCount > 0 ? (
              <p className="text-xs text-orange-600">Needs review</p>
            ) : (
              <p className="text-xs text-muted-foreground">All caught up</p>
            )}
          </CardContent>
        </Card>

        <Card className={activeSuspensionCount > 0 ? 'border-red-200 bg-red-50' : ''}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Suspensions</CardTitle>
            <Users className={`h-4 w-4 ${activeSuspensionCount > 0 ? 'text-red-500' : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSuspensionCount}</div>
            <p className="text-xs text-muted-foreground">
              {activeSuspensionCount === 0 ? 'No active bans' : 'Currently suspended'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="forums" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Forums</span>
          </TabsTrigger>
          <TabsTrigger value="content" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Content</span>
          </TabsTrigger>
          <TabsTrigger value="moderation" className="gap-2 relative">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Moderation</span>
            {pendingReportCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-orange-500 text-[10px] text-white flex items-center justify-center">
                {pendingReportCount > 9 ? '9+' : pendingReportCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="forums">
          <ForumsTab />
        </TabsContent>

        <TabsContent value="content">
          <ContentTab />
        </TabsContent>

        <TabsContent value="moderation">
          <ModerationTab />
        </TabsContent>

        <TabsContent value="settings">
          <SettingsTab />
        </TabsContent>
      </Tabs>
    </PageWrapper>
  );
}

export default AdminCommunityPage;
