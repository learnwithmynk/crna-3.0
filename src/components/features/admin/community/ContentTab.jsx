/**
 * ContentTab
 *
 * Content moderation tab - browse all topics/replies, pin, lock, hide, delete.
 */

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  MoreHorizontal,
  Pin,
  Lock,
  Unlock,
  EyeOff,
  Eye,
  Trash2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { useAdminTopics } from '@/hooks/useAdminTopics';
import { useAdminForums } from '@/hooks/useAdminForums';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

export function ContentTab() {
  const { topLevelForums, getSubforums } = useAdminForums();
  const [selectedForumId, setSelectedForumId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showHidden, setShowHidden] = useState(true);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [topicToDelete, setTopicToDelete] = useState(null);

  const {
    topics,
    isLoading,
    pagination,
    fetchTopics,
    toggleSticky,
    toggleLocked,
    toggleHidden,
    deleteTopic,
  } = useAdminTopics(selectedForumId);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTopics(1, { search: searchQuery, showHidden });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, showHidden, selectedForumId, fetchTopics]);

  // Handle page change
  const handlePageChange = (newPage) => {
    fetchTopics(newPage, { search: searchQuery, showHidden });
  };

  // Toggle topic selection
  const toggleSelection = (topicId) => {
    setSelectedTopics(prev =>
      prev.includes(topicId)
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  // Select/deselect all
  const toggleSelectAll = () => {
    if (selectedTopics.length === topics.length) {
      setSelectedTopics([]);
    } else {
      setSelectedTopics(topics.map(t => t.id));
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (topicToDelete) {
      await deleteTopic(topicToDelete.id);
      setDeleteDialogOpen(false);
      setTopicToDelete(null);
    }
  };

  // Bulk hide selected
  const handleBulkHide = async () => {
    for (const topicId of selectedTopics) {
      const topic = topics.find(t => t.id === topicId);
      if (topic && !topic.is_hidden) {
        await toggleHidden(topicId);
      }
    }
    setSelectedTopics([]);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Get all forums for filter dropdown
  const allForums = [];
  topLevelForums.forEach(forum => {
    allForums.push({ id: forum.id, title: forum.title, isParent: true });
    getSubforums(forum.id).forEach(sub => {
      allForums.push({ id: sub.id, title: `  → ${sub.title}`, isParent: false });
    });
  });

  const totalPages = Math.ceil(pagination.total / pagination.perPage);

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-medium">Content Moderation</h3>
          <p className="text-sm text-muted-foreground">
            Browse and moderate all topics and replies
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Forum Filter */}
            <Select
              value={selectedForumId || 'all'}
              onValueChange={(value) => setSelectedForumId(value === 'all' ? null : value)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Forums" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Forums</SelectItem>
                {allForums.map((forum) => (
                  <SelectItem key={forum.id} value={String(forum.id)}>
                    {forum.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Show Hidden Toggle */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="show-hidden"
                checked={showHidden}
                onCheckedChange={setShowHidden}
              />
              <label htmlFor="show-hidden" className="text-sm">
                Show hidden
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedTopics.length > 0 && (
        <Card className="border-primary">
          <CardContent className="py-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {selectedTopics.length} topic{selectedTopics.length !== 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={handleBulkHide}>
                  <EyeOff className="h-4 w-4 mr-1" />
                  Hide All
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setSelectedTopics([])}>
                  Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Topics Table */}
      {isLoading ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          </CardContent>
        </Card>
      ) : topics.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No topics found"
          description={searchQuery ? 'Try a different search term.' : 'No topics in this forum yet.'}
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedTopics.length === topics.length && topics.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Topic</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Forum</TableHead>
                  <TableHead className="text-center">Replies</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topics.map((topic) => (
                  <TableRow
                    key={topic.id}
                    className={topic.is_hidden ? 'opacity-50 bg-muted/30' : ''}
                    data-testid="topic-row"
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedTopics.includes(topic.id)}
                        onCheckedChange={() => toggleSelection(topic.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="max-w-md">
                        <div className="font-medium flex items-center gap-2">
                          {topic.is_sticky && (
                            <Pin className="h-3 w-3 text-primary" />
                          )}
                          {topic.title}
                        </div>
                        <div className="text-sm text-muted-foreground truncate">
                          {topic.content_preview}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{topic.author_name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">{topic.forum_name}</div>
                    </TableCell>
                    <TableCell className="text-center">{topic.reply_count}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {topic.is_sticky && (
                          <Badge variant="default" className="text-xs">Pinned</Badge>
                        )}
                        {topic.is_locked && (
                          <Badge variant="secondary" className="text-xs">Locked</Badge>
                        )}
                        {topic.is_hidden && (
                          <Badge variant="destructive" className="text-xs">Hidden</Badge>
                        )}
                        {!topic.is_sticky && !topic.is_locked && !topic.is_hidden && (
                          <Badge variant="outline" className="text-xs">Normal</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(topic.created_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <a
                              href={`/community/forums/${topic.forum_id}/${topic.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              View Topic
                            </a>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => toggleSticky(topic.id)}>
                            <Pin className="h-4 w-4 mr-2" />
                            {topic.is_sticky ? 'Unpin' : 'Pin to Top'}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleLocked(topic.id)}>
                            {topic.is_locked ? (
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
                          <DropdownMenuItem onClick={() => toggleHidden(topic.id)}>
                            {topic.is_hidden ? (
                              <>
                                <Eye className="h-4 w-4 mr-2" />
                                Unhide
                              </>
                            ) : (
                              <>
                                <EyeOff className="h-4 w-4 mr-2" />
                                Hide
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setTopicToDelete(topic);
                              setDeleteDialogOpen(true);
                            }}
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
              </TableBody>
            </Table>
          </CardContent>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {((pagination.page - 1) * pagination.perPage) + 1} to{' '}
                {Math.min(pagination.page * pagination.perPage, pagination.total)} of{' '}
                {pagination.total} topics
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                  Page {pagination.page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Topic"
        description={`Are you sure you want to delete "${topicToDelete?.title}"? This will also delete all replies. This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  );
}

export default ContentTab;
