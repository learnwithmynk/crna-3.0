/**
 * ForumsTab
 *
 * Forum management tab for admin community page.
 * Create, edit, reorder, lock, and delete forums & subforums.
 */

import { useState, Fragment } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Lock,
  Unlock,
  GripVertical,
  ChevronRight,
  FolderPlus,
} from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { useAdminForums } from '@/hooks/useAdminForums';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

export function ForumsTab() {
  const {
    forums,
    topLevelForums,
    isLoading,
    getSubforums,
    createForum,
    updateForum,
    deleteForum,
    toggleLocked,
  } = useAdminForums();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedForum, setSelectedForum] = useState(null);
  const [expandedForums, setExpandedForums] = useState(new Set());
  const [isProcessing, setIsProcessing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    parent_id: '',
  });

  // Toggle expanded state for a forum
  const toggleExpanded = (forumId) => {
    setExpandedForums(prev => {
      const newSet = new Set(prev);
      if (newSet.has(forumId)) {
        newSet.delete(forumId);
      } else {
        newSet.add(forumId);
      }
      return newSet;
    });
  };

  // Open create dialog
  const openCreateDialog = (parentId = null) => {
    setFormData({
      title: '',
      description: '',
      parent_id: parentId || '',
    });
    setCreateDialogOpen(true);
  };

  // Open edit dialog
  const openEditDialog = (forum) => {
    setSelectedForum(forum);
    setFormData({
      title: forum.title,
      description: forum.description || '',
      parent_id: forum.parent_id || '',
    });
    setEditDialogOpen(true);
  };

  // Open delete confirmation
  const openDeleteDialog = (forum) => {
    setSelectedForum(forum);
    setDeleteDialogOpen(true);
  };

  // Handle create forum
  const handleCreate = async () => {
    if (!formData.title.trim()) return;

    setIsProcessing(true);
    try {
      await createForum({
        title: formData.title.trim(),
        description: formData.description.trim(),
        parent_id: formData.parent_id || null,
      });
      setCreateDialogOpen(false);
      setFormData({ title: '', description: '', parent_id: '' });
    } catch (error) {
      console.error('Error creating forum:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle update forum
  const handleUpdate = async () => {
    if (!selectedForum || !formData.title.trim()) return;

    setIsProcessing(true);
    try {
      await updateForum(selectedForum.id, {
        title: formData.title.trim(),
        description: formData.description.trim(),
      });
      setEditDialogOpen(false);
      setSelectedForum(null);
    } catch (error) {
      console.error('Error updating forum:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle delete forum
  const handleDelete = async () => {
    if (!selectedForum) return;

    setIsProcessing(true);
    try {
      await deleteForum(selectedForum.id);
      setDeleteDialogOpen(false);
      setSelectedForum(null);
    } catch (error) {
      console.error('Error deleting forum:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle toggle lock
  const handleToggleLock = async (forum) => {
    await toggleLocked(forum.id);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Forum Management</h3>
          <p className="text-sm text-muted-foreground">
            Create and organize forums and subforums
          </p>
        </div>
        <Button onClick={() => openCreateDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          New Forum
        </Button>
      </div>

      {/* Forums List */}
      {topLevelForums.length === 0 ? (
        <EmptyState
          icon={FolderPlus}
          title="No forums yet"
          description="Create your first forum to get started."
          action={{
            label: 'Create Forum',
            onClick: () => openCreateDialog(),
          }}
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Forum</TableHead>
                  <TableHead className="text-center">Topics</TableHead>
                  <TableHead className="text-center">Replies</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topLevelForums.map((forum) => {
                  const subforums = getSubforums(forum.id);
                  const hasSubforums = subforums.length > 0;
                  const isExpanded = expandedForums.has(forum.id);

                  return (
                    <Fragment key={forum.id}>
                      {/* Parent Forum Row */}
                      <TableRow data-testid="forum-row">
                        <TableCell>
                          {hasSubforums ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => toggleExpanded(forum.id)}
                            >
                              <ChevronRight
                                className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                              />
                            </Button>
                          ) : (
                            <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                          )}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{forum.title}</div>
                            {forum.description && (
                              <div className="text-sm text-muted-foreground truncate max-w-md">
                                {forum.description}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{forum.topic_count}</TableCell>
                        <TableCell className="text-center">{forum.reply_count}</TableCell>
                        <TableCell className="text-center">
                          {forum.is_locked ? (
                            <Badge variant="secondary">
                              <Lock className="h-3 w-3 mr-1" />
                              Locked
                            </Badge>
                          ) : (
                            <Badge variant="outline">Open</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEditDialog(forum)}>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openCreateDialog(forum.id)}>
                                <FolderPlus className="h-4 w-4 mr-2" />
                                Add Subforum
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleLock(forum)}>
                                {forum.is_locked ? (
                                  <>
                                    <Unlock className="h-4 w-4 mr-2" />
                                    Unlock
                                  </>
                                ) : (
                                  <>
                                    <Lock className="h-4 w-4 mr-2" />
                                    Lock
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => openDeleteDialog(forum)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>

                      {/* Subforum Rows */}
                      {isExpanded && subforums.map((subforum) => (
                        <TableRow key={subforum.id} className="bg-muted/30" data-testid="subforum-row">
                          <TableCell></TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 pl-6">
                              <ChevronRight className="h-3 w-3 text-muted-foreground" />
                              <div>
                                <div className="font-medium">{subforum.title}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">{subforum.topic_count}</TableCell>
                          <TableCell className="text-center">{subforum.reply_count}</TableCell>
                          <TableCell className="text-center">
                            {subforum.is_locked ? (
                              <Badge variant="secondary" className="text-xs">Locked</Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs">Open</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openEditDialog(subforum)}>
                                  <Pencil className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleToggleLock(subforum)}>
                                  {subforum.is_locked ? (
                                    <>
                                      <Unlock className="h-4 w-4 mr-2" />
                                      Unlock
                                    </>
                                  ) : (
                                    <>
                                      <Lock className="h-4 w-4 mr-2" />
                                      Lock
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => openDeleteDialog(subforum)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={createDialogOpen || editDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setCreateDialogOpen(false);
          setEditDialogOpen(false);
          setSelectedForum(null);
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editDialogOpen ? 'Edit Forum' : formData.parent_id ? 'Create Subforum' : 'Create Forum'}
            </DialogTitle>
            <DialogDescription>
              {editDialogOpen
                ? 'Update the forum details.'
                : formData.parent_id
                  ? 'Create a new subforum within the parent forum.'
                  : 'Create a new top-level forum.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Forum title..."
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="Brief description of this forum..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            {!editDialogOpen && !formData.parent_id && (
              <div className="space-y-2">
                <Label htmlFor="parent">Parent Forum (optional)</Label>
                <Select
                  value={formData.parent_id || 'none'}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, parent_id: value === 'none' ? '' : value }))}
                >
                  <SelectTrigger id="parent">
                    <SelectValue placeholder="None (top-level forum)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (top-level forum)</SelectItem>
                    {topLevelForums.map((forum) => (
                      <SelectItem key={forum.id} value={String(forum.id)}>
                        {forum.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCreateDialogOpen(false);
                setEditDialogOpen(false);
                setSelectedForum(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={editDialogOpen ? handleUpdate : handleCreate}
              disabled={!formData.title.trim() || isProcessing}
            >
              {isProcessing ? 'Saving...' : editDialogOpen ? 'Save Changes' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Forum"
        description={
          selectedForum?.parent_id
            ? `Are you sure you want to delete the subforum "${selectedForum?.title}"? This action cannot be undone.`
            : `Are you sure you want to delete "${selectedForum?.title}" and all its subforums? This action cannot be undone.`
        }
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        isLoading={isProcessing}
      />
    </div>
  );
}

export default ForumsTab;
