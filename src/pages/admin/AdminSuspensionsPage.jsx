/**
 * AdminSuspensionsPage
 *
 * Admin page for managing user suspensions.
 * Features:
 * - Active suspensions tab
 * - Suspension history tab (lifted/expired)
 * - Create suspension dialog with user search
 * - Duration picker (1-90 days, permanent)
 * - Lift suspension action
 *
 * Route: /admin/community/suspensions
 */

import { useState, useMemo } from 'react';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
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
  UserX,
  UserCheck,
  Plus,
  Clock,
  CheckCircle,
  Ban,
  Search,
} from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { useAdminSuspensions } from '@/hooks/useAdminSuspensions';
import { SUSPENSION_STATUS, SUSPENSION_DURATIONS } from '@/data/community/mockSuspensions';

export function AdminSuspensionsPage() {
  const [activeTab, setActiveTab] = useState('active');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [liftDialogOpen, setLiftDialogOpen] = useState(false);
  const [selectedSuspension, setSelectedSuspension] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Create suspension form state
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [suspensionReason, setSuspensionReason] = useState('');
  const [suspensionDuration, setSuspensionDuration] = useState('7');
  const [liftNotes, setLiftNotes] = useState('');

  const activeSuspensions = useAdminSuspensions('active');
  const historySuspensions = useAdminSuspensions('history');

  // Get current hook based on active tab
  const currentHook = activeTab === 'active' ? activeSuspensions : historySuspensions;
  const { suspensions, isLoading, createSuspension, liftSuspension, searchUsers } = currentHook;

  // Count by status
  const counts = useMemo(() => {
    const allActive = activeSuspensions.suspensions;
    const allHistory = historySuspensions.suspensions;
    return {
      active: allActive.length,
      history: allHistory.length,
    };
  }, [activeSuspensions.suspensions, historySuspensions.suspensions]);

  // Handle user search
  const handleUserSearch = async (query) => {
    setUserSearchQuery(query);
    if (query.length >= 2) {
      const results = await searchUsers(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  // Select user from search results
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setUserSearchQuery(user.email);
    setSearchResults([]);
  };

  // Open create suspension dialog
  const openCreateDialog = () => {
    setCreateDialogOpen(true);
    setUserSearchQuery('');
    setSearchResults([]);
    setSelectedUser(null);
    setSuspensionReason('');
    setSuspensionDuration('7');
  };

  // Close create suspension dialog
  const closeCreateDialog = () => {
    setCreateDialogOpen(false);
    setUserSearchQuery('');
    setSearchResults([]);
    setSelectedUser(null);
    setSuspensionReason('');
    setSuspensionDuration('7');
  };

  // Handle create suspension
  const handleCreateSuspension = async () => {
    if (!selectedUser || !suspensionReason.trim()) return;

    setIsProcessing(true);
    try {
      await createSuspension(
        selectedUser.id,
        suspensionReason,
        parseInt(suspensionDuration)
      );
      closeCreateDialog();
    } catch (error) {
      console.error('Error creating suspension:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Open lift suspension dialog
  const openLiftDialog = (suspension) => {
    setSelectedSuspension(suspension);
    setLiftDialogOpen(true);
    setLiftNotes('');
  };

  // Close lift suspension dialog
  const closeLiftDialog = () => {
    setLiftDialogOpen(false);
    setSelectedSuspension(null);
    setLiftNotes('');
  };

  // Handle lift suspension
  const handleLiftSuspension = async () => {
    if (!selectedSuspension) return;

    setIsProcessing(true);
    try {
      await liftSuspension(selectedSuspension.id, liftNotes);
      closeLiftDialog();
    } catch (error) {
      console.error('Error lifting suspension:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get suspension duration label
  const getDurationLabel = (suspendedAt, suspendedUntil) => {
    if (!suspendedUntil) return 'Permanent';
    const start = new Date(suspendedAt);
    const end = new Date(suspendedUntil);
    const days = Math.round((end - start) / (1000 * 60 * 60 * 24));
    return `${days} day${days !== 1 ? 's' : ''}`;
  };

  // Check if suspension is expired
  const isExpired = (suspension) => {
    if (!suspension.suspended_until) return false;
    return new Date(suspension.suspended_until) < new Date();
  };

  const breadcrumbs = [
    { label: 'Admin', href: '/admin' },
    { label: 'Community', href: '/admin/community' },
    { label: 'Suspensions' },
  ];

  return (
    <PageWrapper
      title="User Suspensions"
      description="Manage suspended user accounts"
      breadcrumbs={breadcrumbs}
    >
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Suspensions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{counts.active}</div>
            {counts.active > 0 && (
              <p className="text-xs text-red-600">Currently suspended</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{counts.history}</div>
            <p className="text-xs text-muted-foreground">Lifted or expired</p>
          </CardContent>
        </Card>
      </div>

      {/* Create Suspension Button */}
      <div className="mb-6">
        <Button onClick={openCreateDialog}>
          <Plus className="w-4 h-4 mr-2" />
          Create Suspension
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="active" className="gap-2">
            <UserX className="w-4 h-4" />
            Active
            {counts.active > 0 && (
              <Badge variant="secondary" className="ml-1 bg-red-100 text-red-800">
                {counts.active}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <Clock className="w-4 h-4" />
            History ({counts.history})
          </TabsTrigger>
        </TabsList>

        {/* Active Suspensions Tab */}
        <TabsContent value="active" className="mt-6">
          {isLoading ? (
            <Card>
              <CardContent className="py-12">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              </CardContent>
            </Card>
          ) : suspensions.length === 0 ? (
            <EmptyState
              icon={CheckCircle}
              title="No active suspensions"
              description="No users are currently suspended."
            />
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Suspended At</TableHead>
                      <TableHead>Expires At</TableHead>
                      <TableHead>Suspended By</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {suspensions.map((suspension) => (
                      <TableRow key={suspension.id} data-testid="suspension-row">
                        <TableCell>
                          <div>
                            <div className="font-medium">{suspension.user_name}</div>
                            <div className="text-sm text-muted-foreground">{suspension.user_email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-md text-sm">{suspension.reason}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={suspension.suspended_until ? 'secondary' : 'destructive'}>
                            {getDurationLabel(suspension.suspended_at, suspension.suspended_until)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(suspension.suspended_at)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {suspension.suspended_until ? formatDate(suspension.suspended_until) : 'Never'}
                        </TableCell>
                        <TableCell className="text-sm">
                          {suspension.suspended_by_name}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openLiftDialog(suspension)}
                          >
                            <UserCheck className="w-4 h-4 mr-1" />
                            Lift
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="mt-6">
          {isLoading ? (
            <Card>
              <CardContent className="py-12">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              </CardContent>
            </Card>
          ) : suspensions.length === 0 ? (
            <EmptyState
              icon={Clock}
              title="No suspension history"
              description="No suspensions have been lifted or expired yet."
            />
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Suspended At</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ended At</TableHead>
                      <TableHead>Ended By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {suspensions.map((suspension) => (
                      <TableRow key={suspension.id} data-testid="suspension-row">
                        <TableCell>
                          <div>
                            <div className="font-medium">{suspension.user_name}</div>
                            <div className="text-sm text-muted-foreground">{suspension.user_email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-md text-sm">{suspension.reason}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {getDurationLabel(suspension.suspended_at, suspension.suspended_until)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(suspension.suspended_at)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={suspension.status === SUSPENSION_STATUS.LIFTED ? 'secondary' : 'outline'}
                          >
                            {suspension.status === SUSPENSION_STATUS.LIFTED ? 'Lifted' : 'Expired'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {suspension.status === SUSPENSION_STATUS.LIFTED
                            ? formatDate(suspension.lifted_at)
                            : formatDate(suspension.suspended_until)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {suspension.status === SUSPENSION_STATUS.LIFTED
                            ? suspension.lifted_by_name
                            : 'Auto'}
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

      {/* Create Suspension Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create User Suspension</DialogTitle>
            <DialogDescription>
              Suspend a user from posting in the community. They will still be able to read content.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* User Search */}
            <div className="space-y-2">
              <Label htmlFor="user-search">Search User</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="user-search"
                  placeholder="Search by name or email..."
                  value={userSearchQuery}
                  onChange={(e) => handleUserSearch(e.target.value)}
                  className="pl-9"
                />
                {/* Search Results Dropdown */}
                {searchResults.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
                    {searchResults.map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => handleSelectUser(user)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex flex-col"
                      >
                        <span className="font-medium">{user.name}</span>
                        <span className="text-sm text-muted-foreground">{user.email}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {selectedUser && (
                <div className="flex items-center gap-2 mt-2 p-2 bg-muted rounded-lg">
                  <UserX className="w-4 h-4" />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{selectedUser.name}</div>
                    <div className="text-xs text-muted-foreground">{selectedUser.email}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Reason */}
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Suspension</Label>
              <Textarea
                id="reason"
                placeholder="Explain why this user is being suspended..."
                value={suspensionReason}
                onChange={(e) => setSuspensionReason(e.target.value)}
                rows={3}
              />
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Select value={suspensionDuration} onValueChange={setSuspensionDuration}>
                <SelectTrigger id="duration">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUSPENSION_DURATIONS.map((duration) => (
                    <SelectItem key={duration.value} value={String(duration.value)}>
                      {duration.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeCreateDialog}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateSuspension}
              disabled={!selectedUser || !suspensionReason.trim() || isProcessing}
            >
              <Ban className="w-4 h-4 mr-2" />
              {isProcessing ? 'Creating...' : 'Create Suspension'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lift Suspension Dialog */}
      <Dialog open={liftDialogOpen} onOpenChange={setLiftDialogOpen}>
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
                <Label htmlFor="lift-notes">Notes (Optional)</Label>
                <Textarea
                  id="lift-notes"
                  placeholder="Explain why this suspension is being lifted early..."
                  value={liftNotes}
                  onChange={(e) => setLiftNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={closeLiftDialog}>
              Cancel
            </Button>
            <Button
              onClick={handleLiftSuspension}
              disabled={isProcessing}
            >
              <UserCheck className="w-4 h-4 mr-2" />
              {isProcessing ? 'Lifting...' : 'Lift Suspension'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );
}

export default AdminSuspensionsPage;
