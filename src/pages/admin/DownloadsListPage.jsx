/**
 * DownloadsListPage - Admin
 *
 * List all downloads with search, filters, and CRUD actions.
 * Route: /admin/downloads
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DeleteConfirmModal } from '@/components/features/admin/DeleteConfirmModal';
import { useDownloads, useDownloadAdmin } from '@/hooks/useDownloads';
import { useCategories } from '@/hooks/useCategories';
import { useFileUpload } from '@/hooks/useFileUpload';
import {
  Plus,
  Search,
  Download,
  Loader2,
  AlertCircle,
  Filter,
  FileText,
  ExternalLink,
  MoreVertical,
  Pencil,
  Trash2,
  Eye,
  Archive,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

// File type colors
const FILE_TYPE_COLORS = {
  PDF: 'bg-red-100 text-red-700',
  DOCX: 'bg-blue-100 text-blue-700',
  DOC: 'bg-blue-100 text-blue-700',
  XLSX: 'bg-green-100 text-green-700',
  XLS: 'bg-green-100 text-green-700',
  CSV: 'bg-green-100 text-green-700',
  PPTX: 'bg-orange-100 text-orange-700',
  PPT: 'bg-orange-100 text-orange-700',
  ZIP: 'bg-purple-100 text-purple-700',
  IMG: 'bg-pink-100 text-pink-700',
  PNG: 'bg-pink-100 text-pink-700',
  JPG: 'bg-pink-100 text-pink-700',
  default: 'bg-gray-100 text-gray-700',
};

function DownloadRow({ download, categories, onEdit, onDelete, onToggleStatus }) {
  const fileTypeColor = FILE_TYPE_COLORS[download.file_type] || FILE_TYPE_COLORS.default;
  const isArchived = download.status === 'archived';

  // Get category display names
  const categoryNames = download.category_slugs
    ?.map((slug) => {
      const cat = categories.find((c) => c.slug === slug);
      return cat?.display_name || slug;
    })
    .slice(0, 2); // Show max 2

  const remainingCategories = (download.category_slugs?.length || 0) - 2;

  return (
    <div
      className={cn(
        'flex items-center gap-4 p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors',
        isArchived && 'opacity-60'
      )}
    >
      {/* File Type Badge */}
      <div className="shrink-0">
        <Badge className={cn('font-mono text-xs', fileTypeColor)}>
          {download.file_type || 'FILE'}
        </Badge>
      </div>

      {/* Title & Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-gray-900 truncate">{download.title}</h3>
          {download.is_free && (
            <Badge variant="outline" className="text-xs shrink-0">
              Free
            </Badge>
          )}
          {download.file_source === 'supabase' && (
            <Badge variant="outline" className="text-xs shrink-0 bg-blue-50">
              Hosted
            </Badge>
          )}
          {isArchived && (
            <Badge variant="secondary" className="text-xs shrink-0">
              Archived
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
          {categoryNames?.length > 0 && (
            <span className="truncate">
              {categoryNames.join(', ')}
              {remainingCategories > 0 && ` +${remainingCategories}`}
            </span>
          )}
        </div>
      </div>

      {/* Download Count */}
      <div className="shrink-0 text-center">
        <p className="text-sm font-medium text-gray-900">{download.download_count || 0}</p>
        <p className="text-xs text-gray-500">downloads</p>
      </div>

      {/* Actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(download)}>
            <Pencil className="w-4 h-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => window.open(download.file_url, '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View File
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onToggleStatus(download)}>
            <Archive className="w-4 h-4 mr-2" />
            {isArchived ? 'Restore' : 'Archive'}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onDelete(download)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function DownloadsListPage() {
  const navigate = useNavigate();
  const { downloads, isLoading, error, refetch } = useDownloads({ adminMode: true });
  const { deleteDownload, updateDownload } = useDownloadAdmin();
  const { categories } = useCategories();
  const { deleteFile } = useFileUpload();

  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [downloadToDelete, setDownloadToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter and search downloads
  const filteredDownloads = useMemo(() => {
    let result = downloads || [];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (d) =>
          d.title?.toLowerCase().includes(query) ||
          d.description?.toLowerCase().includes(query) ||
          d.slug?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((d) => d.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      result = result.filter((d) => d.category_slugs?.includes(categoryFilter));
    }

    return result;
  }, [downloads, searchQuery, statusFilter, categoryFilter]);

  // Stats
  const stats = useMemo(() => {
    const all = downloads || [];
    return {
      total: all.length,
      active: all.filter((d) => d.status === 'active').length,
      archived: all.filter((d) => d.status === 'archived').length,
      totalDownloads: all.reduce((sum, d) => sum + (d.download_count || 0), 0),
    };
  }, [downloads]);

  // Handlers
  const handleEdit = (download) => {
    navigate(`/admin/downloads/${download.id}`);
  };

  const handleDelete = (download) => {
    setDownloadToDelete(download);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!downloadToDelete) return;

    setIsDeleting(true);
    try {
      // If file is hosted in Supabase, delete it from storage too
      if (downloadToDelete.file_source === 'supabase' && downloadToDelete.storage_path) {
        await deleteFile(downloadToDelete.storage_path);
      }

      await deleteDownload(downloadToDelete.id);
      setDeleteModalOpen(false);
      setDownloadToDelete(null);
      refetch();
    } catch (err) {
      console.error('Failed to delete download:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async (download) => {
    const newStatus = download.status === 'archived' ? 'active' : 'archived';
    try {
      await updateDownload(download.id, { status: newStatus });
      refetch();
    } catch (err) {
      console.error('Failed to update download status:', err);
    }
  };

  const handleCreateNew = () => {
    navigate('/admin/downloads/new');
  };

  if (error) {
    return (
      <PageWrapper title="Downloads">
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Error Loading Downloads
          </h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </PageWrapper>
    );
  }

  const breadcrumbs = [
    { label: 'Admin', href: '/admin' },
    { label: 'Downloads' },
  ];

  return (
    <PageWrapper
      title="Downloads"
      description="Manage downloadable resources and files"
      breadcrumbs={breadcrumbs}
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Archived</p>
                <p className="text-2xl font-bold text-gray-600">{stats.archived}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <Archive className="w-6 h-6 text-gray-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Downloads</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalDownloads}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Download className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions Bar */}
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search downloads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="w-4 h-4 mr-2 text-gray-400" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.slug} value={cat.slug}>
                      {cat.display_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Create Button */}
            <Button onClick={handleCreateNew} className="shrink-0">
              <Plus className="w-4 h-4 mr-2" />
              New Download
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Downloads List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>
              Downloads{' '}
              {filteredDownloads.length !== downloads?.length && (
                <span className="text-sm font-normal text-gray-500">
                  ({filteredDownloads.length} of {downloads?.length})
                </span>
              )}
            </span>
            {(searchQuery || statusFilter !== 'all' || categoryFilter !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setCategoryFilter('all');
                }}
              >
                Clear Filters
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : filteredDownloads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="w-12 h-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                {downloads?.length === 0 ? 'No downloads yet' : 'No matches found'}
              </h3>
              <p className="text-gray-500 mb-4">
                {downloads?.length === 0
                  ? 'Create your first download to get started.'
                  : 'Try adjusting your search or filters.'}
              </p>
              {downloads?.length === 0 && (
                <Button onClick={handleCreateNew}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Download
                </Button>
              )}
            </div>
          ) : (
            <div className="divide-y">
              {filteredDownloads.map((download) => (
                <DownloadRow
                  key={download.id}
                  download={download}
                  categories={categories}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        title="Delete Download"
        itemName={downloadToDelete?.title}
        description={
          downloadToDelete?.download_count > 0
            ? `This download has been accessed ${downloadToDelete.download_count} times. This action cannot be undone.`
            : undefined
        }
        isLoading={isDeleting}
      />
    </PageWrapper>
  );
}

export default DownloadsListPage;
