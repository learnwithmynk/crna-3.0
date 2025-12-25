/**
 * AccessControlPage
 *
 * Admin page for managing access control across all resources.
 * Features:
 * - Sync resource registry to database
 * - Overview stats cards
 * - Warnings for resources needing attention
 * - Tabs to filter by resource type (content + pages/features)
 * - Search and filter functionality
 * - Bulk edit capabilities
 * - Individual resource editing
 *
 * Route: /admin/access-control
 */

import { useState, useMemo } from 'react';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Shield,
  Search,
  Loader2,
  AlertCircle,
  Edit,
  Eye,
  Filter,
  RefreshCw,
  CheckCircle,
  XCircle,
  FileText,
  Layout,
  Box,
  Wrench,
} from 'lucide-react';

// Feature components
import { ProtectionStatusCards } from '@/components/features/admin/access/ProtectionStatusCards';
import { AccessWarnings } from '@/components/features/admin/access/AccessWarnings';
import { ResourceList } from '@/components/features/admin/access/ResourceList';
import { AccessEditModal } from '@/components/features/admin/access/AccessEditModal';

// Hooks
import useAccessControl from '@/hooks/useAccessControl';

export function AccessControlPage() {
  const {
    resources,
    protectedResources,
    stats,
    warnings,
    isLoading,
    isSyncing,
    syncResult,
    error,
    refetch,
    syncRegistry,
    updateResourceAccess,
    bulkUpdateAccess
  } = useAccessControl();

  // Local state
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState([]);
  const [editingResource, setEditingResource] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [dismissedWarnings, setDismissedWarnings] = useState([]);
  const [showSyncDetails, setShowSyncDetails] = useState(false);

  // Format protected resources for display
  const formattedProtectedResources = useMemo(() => {
    return (protectedResources || []).map(pr => ({
      ...pr,
      id: pr.id,
      type: pr.resource_type,
      name: pr.display_name,
      slug: pr.slug,
      isPublic: pr.is_public,
      hasRules: pr.accessible_via && pr.accessible_via.length > 0,
      accessible_via: pr.accessible_via,
    }));
  }, [protectedResources]);

  // Combined resources for "all" tab
  const allResources = useMemo(() => {
    return [...resources, ...formattedProtectedResources];
  }, [resources, formattedProtectedResources]);

  // Filter and search resources
  const filteredResources = useMemo(() => {
    let result = [];

    // Select base list based on tab
    if (activeTab === 'all') {
      result = allResources;
    } else if (activeTab === 'pages') {
      result = formattedProtectedResources.filter(r => r.type === 'page');
    } else if (activeTab === 'features') {
      result = formattedProtectedResources.filter(r => ['feature', 'widget', 'tool'].includes(r.type));
    } else {
      result = resources.filter(r => r.type === activeTab);
    }

    // Filter by status
    if (statusFilter === 'protected') {
      result = result.filter(r => r.hasRules && !r.isPublic);
    } else if (statusFilter === 'public') {
      result = result.filter(r => r.isPublic);
    } else if (statusFilter === 'unconfigured') {
      result = result.filter(r => !r.hasRules && !r.isPublic);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(r =>
        r.name?.toLowerCase().includes(query) ||
        r.slug?.toLowerCase().includes(query) ||
        r.type?.toLowerCase().includes(query)
      );
    }

    return result;
  }, [allResources, formattedProtectedResources, resources, activeTab, statusFilter, searchQuery]);

  // Active warnings (not dismissed)
  const activeWarnings = useMemo(() => {
    return warnings.filter(w => !dismissedWarnings.includes(w.id));
  }, [warnings, dismissedWarnings]);

  // Handlers
  const handleSelectResource = (id, checked) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter(sid => sid !== id));
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(filteredResources.map(r => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleEditResource = (resource) => {
    setEditingResource(resource);
    setEditModalOpen(true);
  };

  const handleSaveAccess = async (data) => {
    if (!editingResource) return;

    const result = await updateResourceAccess(
      editingResource.id,
      editingResource.type,
      data
    );

    if (!result.error) {
      refetch();
      setEditModalOpen(false);
      setEditingResource(null);
    }
  };

  const handleBulkEdit = async () => {
    // TODO: Implement bulk edit dialog
    console.log('Bulk edit:', selectedIds);
  };

  const handleFixWarning = (resource) => {
    handleEditResource(resource);
  };

  const handleDismissWarning = (warningId) => {
    setDismissedWarnings([...dismissedWarnings, warningId]);
  };

  const handlePreviewAs = () => {
    // Open preview mode in new tab with sample entitlements
    window.open('/?preview_as=active_membership,trial_access', '_blank');
  };

  const handleSyncRegistry = async () => {
    setShowSyncDetails(true);
    await syncRegistry({ dryRun: false });
  };

  const handlePreviewSync = async () => {
    setShowSyncDetails(true);
    await syncRegistry({ dryRun: true });
  };

  if (error) {
    return (
      <PageWrapper title="Access Control">
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Error Loading Resources
          </h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </PageWrapper>
    );
  }

  const breadcrumbs = [
    { label: 'Admin', href: '/admin' },
    { label: 'Access Control' },
  ];

  return (
    <PageWrapper
      title="Access Control"
      description="Manage content access rules and entitlements"
      breadcrumbs={breadcrumbs}
    >
      {/* Sync Registry Section */}
      <Card className="mb-6 border-amber-200 bg-amber-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <RefreshCw className="w-5 h-5" />
            Resource Registry Sync
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Sync the resource registry (pages, features, widgets, tools) to the database.
            This populates the <code className="bg-gray-200 px-1 rounded">protected_resources</code> table
            with default access rules.
          </p>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviewSync}
              disabled={isSyncing}
            >
              {isSyncing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Eye className="w-4 h-4 mr-2" />
              )}
              Preview Sync
            </Button>
            <Button
              size="sm"
              onClick={handleSyncRegistry}
              disabled={isSyncing}
            >
              {isSyncing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Sync Now
            </Button>
          </div>

          {/* Sync Result */}
          {showSyncDetails && syncResult && (
            <div className={`mt-4 p-3 rounded-lg ${syncResult.success ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'}`}>
              <div className="flex items-center gap-2 mb-2">
                {syncResult.success ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span className="font-medium">
                  {syncResult.success ? 'Sync Completed' : 'Sync Failed'}
                </span>
              </div>
              {syncResult.success && (
                <div className="text-sm space-y-1">
                  <p>Created: <strong>{syncResult.created}</strong> resources</p>
                  <p>Updated: <strong>{syncResult.updated}</strong> resources</p>
                  {syncResult.orphaned?.length > 0 && (
                    <p className="text-amber-700">
                      Orphaned (in DB but not in registry): {syncResult.orphaned.length}
                    </p>
                  )}
                </div>
              )}
              {syncResult.errors?.length > 0 && (
                <div className="mt-2 text-sm text-red-700">
                  <p className="font-medium">Errors:</p>
                  <ul className="list-disc list-inside">
                    {syncResult.errors.slice(0, 5).map((err, i) => (
                      <li key={i}>{err.message}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Registry Stats */}
          <div className="mt-4 flex gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Layout className="w-4 h-4" />
              {formattedProtectedResources.filter(r => r.type === 'page').length} pages
            </span>
            <span className="flex items-center gap-1">
              <Box className="w-4 h-4" />
              {formattedProtectedResources.filter(r => r.type === 'feature').length} features
            </span>
            <span className="flex items-center gap-1">
              <Wrench className="w-4 h-4" />
              {formattedProtectedResources.filter(r => ['widget', 'tool'].includes(r.type)).length} widgets/tools
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Status Cards */}
      <ProtectionStatusCards stats={stats} />

      {/* Warnings Section */}
      {activeWarnings.length > 0 && (
        <div className="mt-6">
          <AccessWarnings
            warnings={activeWarnings}
            onFix={handleFixWarning}
            onDismiss={handleDismissWarning}
          />
        </div>
      )}

      {/* Actions Bar */}
      <Card className="mt-6">
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Resources</SelectItem>
                <SelectItem value="protected">Protected Only</SelectItem>
                <SelectItem value="public">Public Only</SelectItem>
                <SelectItem value="unconfigured">Unconfigured</SelectItem>
              </SelectContent>
            </Select>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {selectedIds.length > 0 && (
                <Button variant="outline" onClick={handleBulkEdit}>
                  <Edit className="w-4 h-4 mr-2" />
                  Bulk Edit ({selectedIds.length})
                </Button>
              )}
              <Button variant="outline" onClick={handlePreviewAs}>
                <Eye className="w-4 h-4 mr-2" />
                Preview As
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content - Tabs */}
      <div className="mt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-grid">
            <TabsTrigger value="all">
              All
              <Badge variant="secondary" className="ml-2">
                {allResources.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="pages">
              Pages
              <Badge variant="secondary" className="ml-2">
                {formattedProtectedResources.filter(r => r.type === 'page').length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="features">
              Features
              <Badge variant="secondary" className="ml-2">
                {formattedProtectedResources.filter(r => ['feature', 'widget', 'tool'].includes(r.type)).length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="module">
              Modules
              <Badge variant="secondary" className="ml-2">
                {resources.filter(r => r.type === 'module').length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="lesson">
              Lessons
              <Badge variant="secondary" className="ml-2">
                {resources.filter(r => r.type === 'lesson').length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="download">
              Downloads
              <Badge variant="secondary" className="ml-2">
                {resources.filter(r => r.type === 'download').length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : (
              <ResourceList
                resources={filteredResources}
                selectedIds={selectedIds}
                onSelect={handleSelectResource}
                onSelectAll={handleSelectAll}
                onEdit={handleEditResource}
              />
            )}
          </div>
        </Tabs>
      </div>

      {/* Info Banner */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <div className="flex gap-3">
          <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-medium mb-1">How Access Control Works</p>
            <p className="text-blue-700">
              Resources can be <strong>public</strong> (accessible to everyone),{' '}
              <strong>protected</strong> (require entitlements), or{' '}
              <strong>unconfigured</strong> (no access rules set). Users gain access when their
              entitlements match the resource's requirements. Lessons inherit access rules from
              their parent module if not explicitly configured.
            </p>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <AccessEditModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        resource={editingResource}
        onSave={handleSaveAccess}
      />
    </PageWrapper>
  );
}

export default AccessControlPage;
