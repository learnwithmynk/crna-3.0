/**
 * PointsConfigPage - Admin page for managing gamification points
 *
 * Features:
 * - View/edit point values for all actions
 * - Create/edit promotional multipliers
 * - See effective points with active promos
 * - Warning for overlapping promo dates
 */

import { useState } from 'react';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Coins,
  Plus,
  Pencil,
  Trash2,
  Sparkles,
  AlertTriangle,
  Calendar,
  TrendingUp,
  Gift,
} from 'lucide-react';
import {
  usePointActions,
  usePointPromos,
  useActivePromo,
  usePointsAdmin,
  calculateEffectivePoints,
  getPromoStatus,
  checkPromoOverlap,
} from '@/hooks/usePointsConfig';
import { format, formatDistanceToNow } from 'date-fns';

export function PointsConfigPage() {
  const { actions, isLoading: actionsLoading, refetch: refetchActions } = usePointActions();
  const { promos, isLoading: promosLoading, refetch: refetchPromos } = usePointPromos();
  const { promo: activePromo } = useActivePromo();
  const {
    isSaving,
    updateAction,
    createAction,
    deleteAction,
    createPromo,
    updatePromo,
    deletePromo,
  } = usePointsAdmin();

  const [editingAction, setEditingAction] = useState(null);
  const [editingPromo, setEditingPromo] = useState(null);
  const [showNewPromo, setShowNewPromo] = useState(false);

  // Action edit modal handlers
  const handleEditAction = (action) => {
    setEditingAction({ ...action });
  };

  const handleSaveAction = async () => {
    if (!editingAction) return;

    const result = await updateAction(editingAction.id, {
      base_points: parseInt(editingAction.base_points) || 1,
      daily_max: editingAction.daily_max ? parseInt(editingAction.daily_max) : null,
      is_active: editingAction.is_active,
      description: editingAction.description,
    });

    if (result.success) {
      setEditingAction(null);
      refetchActions();
    }
  };

  // Promo modal handlers
  const handleNewPromo = () => {
    setEditingPromo({
      name: '',
      description: '',
      scope_type: 'global',
      scope_value: null,
      multiplier: 2.0,
      starts_at: '',
      ends_at: '',
      banner_text: '',
      is_active: true,
    });
    setShowNewPromo(true);
  };

  const handleEditPromo = (promo) => {
    setEditingPromo({
      ...promo,
      starts_at: promo.starts_at ? format(new Date(promo.starts_at), "yyyy-MM-dd'T'HH:mm") : '',
      ends_at: promo.ends_at ? format(new Date(promo.ends_at), "yyyy-MM-dd'T'HH:mm") : '',
    });
    setShowNewPromo(false);
  };

  const handleSavePromo = async () => {
    if (!editingPromo) return;

    const promoData = {
      name: editingPromo.name,
      description: editingPromo.description,
      scope_type: editingPromo.scope_type,
      scope_value: editingPromo.scope_type === 'action' ? editingPromo.scope_value : null,
      multiplier: parseFloat(editingPromo.multiplier) || 2.0,
      starts_at: new Date(editingPromo.starts_at).toISOString(),
      ends_at: new Date(editingPromo.ends_at).toISOString(),
      banner_text: editingPromo.banner_text,
      is_active: editingPromo.is_active,
    };

    const result = showNewPromo
      ? await createPromo(promoData)
      : await updatePromo(editingPromo.id, promoData);

    if (result.success) {
      setEditingPromo(null);
      setShowNewPromo(false);
      refetchPromos();
    }
  };

  const handleDeletePromo = async (promoId) => {
    if (!confirm('Delete this promo?')) return;
    const result = await deletePromo(promoId);
    if (result.success) refetchPromos();
  };

  // Check for overlapping promos
  const overlappingPromos = editingPromo && editingPromo.starts_at && editingPromo.ends_at
    ? checkPromoOverlap(editingPromo, promos)
    : [];

  // Stats
  const activeActions = actions.filter(a => a.is_active).length;
  const upcomingPromos = promos.filter(p => getPromoStatus(p) === 'upcoming').length;

  const breadcrumbs = [
    { label: 'Admin', href: '/admin' },
    { label: 'Points Config' },
  ];

  return (
    <PageWrapper
      title="Points Configuration"
      description="Manage point values and promotional multipliers"
      breadcrumbs={breadcrumbs}
    >
      {/* Active Promo Banner */}
      {activePromo && (
        <Alert className="mb-6 border-amber-200 bg-amber-50">
          <Gift className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>Active Promo:</strong> {activePromo.name} ({activePromo.multiplier}x multiplier)
            {activePromo.banner_text && ` - "${activePromo.banner_text}"`}
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Point Actions</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeActions}</div>
            <p className="text-xs text-muted-foreground">
              {actions.length - activeActions} inactive
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Promo</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activePromo ? `${activePromo.multiplier}x` : 'None'}
            </div>
            <p className="text-xs text-muted-foreground">
              {activePromo ? activePromo.name : 'No active promotions'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Promos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingPromos}</div>
            <p className="text-xs text-muted-foreground">Scheduled</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="actions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="actions">Point Actions</TabsTrigger>
          <TabsTrigger value="promos">Promotions</TabsTrigger>
        </TabsList>

        {/* Point Actions Tab */}
        <TabsContent value="actions">
          <Card>
            <CardHeader>
              <CardTitle>Point Actions</CardTitle>
              <CardDescription>
                Configure how many points each action awards. Daily max limits how many times per day.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {actionsLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Action</TableHead>
                      <TableHead className="text-right">Base Points</TableHead>
                      <TableHead className="text-right">Daily Max</TableHead>
                      <TableHead className="text-right">Effective*</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {actions.map((action) => {
                      const effective = calculateEffectivePoints(action, activePromo);
                      const hasBonus = effective.multiplier > 1;

                      return (
                        <TableRow key={action.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{action.label}</div>
                              <div className="text-sm text-muted-foreground">
                                {action.slug}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {action.base_points}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {action.daily_max ?? '∞'}
                          </TableCell>
                          <TableCell className="text-right">
                            {hasBonus ? (
                              <span className="text-amber-600 font-semibold">
                                {effective.effective} pts
                                <TrendingUp className="inline h-3 w-3 ml-1" />
                              </span>
                            ) : (
                              <span className="font-mono">{effective.effective}</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={action.is_active ? 'default' : 'secondary'}>
                              {action.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditAction(action)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}

              {activePromo && (
                <p className="text-xs text-muted-foreground mt-4">
                  * Effective points include the active {activePromo.multiplier}x promo multiplier
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Promotions Tab */}
        <TabsContent value="promos">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Promotional Periods</CardTitle>
                <CardDescription>
                  Time-based multipliers. Only one promo can be active at a time.
                </CardDescription>
              </div>
              <Button onClick={handleNewPromo}>
                <Plus className="h-4 w-4 mr-2" />
                New Promo
              </Button>
            </CardHeader>
            <CardContent>
              {promosLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : promos.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No promotions created yet
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Promo</TableHead>
                      <TableHead>Scope</TableHead>
                      <TableHead className="text-right">Multiplier</TableHead>
                      <TableHead>Schedule</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {promos.map((promo) => {
                      const status = getPromoStatus(promo);

                      return (
                        <TableRow key={promo.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{promo.name}</div>
                              {promo.banner_text && (
                                <div className="text-sm text-muted-foreground">
                                  "{promo.banner_text}"
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {promo.scope_type === 'global' ? 'All Actions' : promo.scope_value}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-mono font-semibold">
                            {promo.multiplier}x
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {format(new Date(promo.starts_at), 'MMM d')} -{' '}
                              {format(new Date(promo.ends_at), 'MMM d, yyyy')}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {status === 'active' && `Ends ${formatDistanceToNow(new Date(promo.ends_at), { addSuffix: true })}`}
                              {status === 'upcoming' && `Starts ${formatDistanceToNow(new Date(promo.starts_at), { addSuffix: true })}`}
                              {status === 'ended' && 'Ended'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                status === 'active'
                                  ? 'default'
                                  : status === 'upcoming'
                                  ? 'secondary'
                                  : 'outline'
                              }
                              className={status === 'active' ? 'bg-green-600' : ''}
                            >
                              {status === 'active' && 'Active'}
                              {status === 'upcoming' && 'Upcoming'}
                              {status === 'ended' && 'Ended'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditPromo(promo)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeletePromo(promo.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Action Modal */}
      <Dialog open={!!editingAction} onOpenChange={() => setEditingAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Point Action</DialogTitle>
            <DialogDescription>{editingAction?.label}</DialogDescription>
          </DialogHeader>

          {editingAction && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Base Points</Label>
                  <Input
                    type="number"
                    min="1"
                    value={editingAction.base_points}
                    onChange={(e) =>
                      setEditingAction((prev) => ({
                        ...prev,
                        base_points: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Daily Max (empty = unlimited)</Label>
                  <Input
                    type="number"
                    min="1"
                    value={editingAction.daily_max || ''}
                    placeholder="∞"
                    onChange={(e) =>
                      setEditingAction((prev) => ({
                        ...prev,
                        daily_max: e.target.value || null,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={editingAction.description || ''}
                  onChange={(e) =>
                    setEditingAction((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="action-active"
                  checked={editingAction.is_active}
                  onCheckedChange={(checked) =>
                    setEditingAction((prev) => ({
                      ...prev,
                      is_active: checked,
                    }))
                  }
                />
                <Label htmlFor="action-active">Active</Label>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingAction(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAction} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Promo Modal (Create/Edit) */}
      <Dialog
        open={!!editingPromo}
        onOpenChange={() => {
          setEditingPromo(null);
          setShowNewPromo(false);
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{showNewPromo ? 'Create Promo' : 'Edit Promo'}</DialogTitle>
            <DialogDescription>
              Set up a time-based points multiplier
            </DialogDescription>
          </DialogHeader>

          {editingPromo && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Promo Name</Label>
                <Input
                  value={editingPromo.name}
                  placeholder="e.g., Holiday Double Points"
                  onChange={(e) =>
                    setEditingPromo((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Scope</Label>
                  <Select
                    value={editingPromo.scope_type}
                    onValueChange={(value) =>
                      setEditingPromo((prev) => ({
                        ...prev,
                        scope_type: value,
                        scope_value: value === 'global' ? null : prev.scope_value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="global">All Actions</SelectItem>
                      <SelectItem value="action">Specific Action</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {editingPromo.scope_type === 'action' && (
                  <div className="space-y-2">
                    <Label>Action</Label>
                    <Select
                      value={editingPromo.scope_value || ''}
                      onValueChange={(value) =>
                        setEditingPromo((prev) => ({ ...prev, scope_value: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select action" />
                      </SelectTrigger>
                      <SelectContent>
                        {actions.map((action) => (
                          <SelectItem key={action.slug} value={action.slug}>
                            {action.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {editingPromo.scope_type === 'global' && (
                  <div className="space-y-2">
                    <Label>Multiplier</Label>
                    <Select
                      value={String(editingPromo.multiplier)}
                      onValueChange={(value) =>
                        setEditingPromo((prev) => ({
                          ...prev,
                          multiplier: parseFloat(value),
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1.5">1.5x</SelectItem>
                        <SelectItem value="2">2x</SelectItem>
                        <SelectItem value="2.5">2.5x</SelectItem>
                        <SelectItem value="3">3x</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {editingPromo.scope_type === 'action' && (
                <div className="space-y-2">
                  <Label>Multiplier</Label>
                  <Select
                    value={String(editingPromo.multiplier)}
                    onValueChange={(value) =>
                      setEditingPromo((prev) => ({
                        ...prev,
                        multiplier: parseFloat(value),
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1.5">1.5x</SelectItem>
                      <SelectItem value="2">2x</SelectItem>
                      <SelectItem value="2.5">2.5x</SelectItem>
                      <SelectItem value="3">3x</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date & Time</Label>
                  <Input
                    type="datetime-local"
                    value={editingPromo.starts_at}
                    onChange={(e) =>
                      setEditingPromo((prev) => ({ ...prev, starts_at: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date & Time</Label>
                  <Input
                    type="datetime-local"
                    value={editingPromo.ends_at}
                    onChange={(e) =>
                      setEditingPromo((prev) => ({ ...prev, ends_at: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Banner Text (shown to users)</Label>
                <Input
                  value={editingPromo.banner_text || ''}
                  placeholder="e.g., 2x Points on Milestones This Week!"
                  onChange={(e) =>
                    setEditingPromo((prev) => ({ ...prev, banner_text: e.target.value }))
                  }
                />
              </div>

              {overlappingPromos.length > 0 && (
                <Alert variant="warning" className="border-amber-200 bg-amber-50">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800">
                    This promo overlaps with: {overlappingPromos.map((p) => p.name).join(', ')}.
                    Only one promo can be active at a time.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex items-center gap-2">
                <Checkbox
                  id="promo-active"
                  checked={editingPromo.is_active}
                  onCheckedChange={(checked) =>
                    setEditingPromo((prev) => ({ ...prev, is_active: checked }))
                  }
                />
                <Label htmlFor="promo-active">Active</Label>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditingPromo(null);
                setShowNewPromo(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSavePromo}
              disabled={isSaving || !editingPromo?.name || !editingPromo?.starts_at || !editingPromo?.ends_at}
            >
              {isSaving ? 'Saving...' : showNewPromo ? 'Create Promo' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );
}
