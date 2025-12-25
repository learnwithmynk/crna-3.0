/**
 * ModulesListPage - Admin
 *
 * List all modules with search, drag & drop reorder, and CRUD actions.
 * Route: /admin/modules
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SortableModuleList } from '@/components/features/admin/SortableModuleList';
import { DeleteConfirmModal } from '@/components/features/admin/DeleteConfirmModal';
import { useModules, useModuleAdmin } from '@/hooks/useModules';
import { useCategories } from '@/hooks/useCategories';
import {
  Plus,
  Search,
  BookOpen,
  Loader2,
  AlertCircle,
  Filter,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function ModulesListPage() {
  const navigate = useNavigate();

  // Fetch modules list (adminMode: true to include drafts)
  const { modules, isLoading, error, refetch } = useModules({ adminMode: true });

  // CRUD operations
  const { updateModule, deleteModule, reorderModules } = useModuleAdmin();

  const { categories } = useCategories();

  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter and search modules
  const filteredModules = useMemo(() => {
    let result = modules || [];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (m) =>
          m.title?.toLowerCase().includes(query) ||
          m.description?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((m) => m.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      result = result.filter((m) => m.category_slug === categoryFilter);
    }

    return result;
  }, [modules, searchQuery, statusFilter, categoryFilter]);

  // Stats
  const stats = useMemo(() => {
    const all = modules || [];
    return {
      total: all.length,
      published: all.filter((m) => m.status === 'published').length,
      draft: all.filter((m) => m.status === 'draft').length,
    };
  }, [modules]);

  // Handlers
  const handleEdit = (module) => {
    navigate(`/admin/modules/${module.id}`);
  };

  const handleDelete = (module) => {
    setModuleToDelete(module);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!moduleToDelete) return;

    setIsDeleting(true);
    try {
      await deleteModule(moduleToDelete.id);
      setDeleteModalOpen(false);
      setModuleToDelete(null);
      refetch(); // Refresh the list
    } catch (err) {
      console.error('Failed to delete module:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTogglePublish = async (module) => {
    const newStatus = module.status === 'published' ? 'draft' : 'published';
    try {
      await updateModule(module.id, { status: newStatus });
      refetch(); // Refresh the list
    } catch (err) {
      console.error('Failed to update module status:', err);
    }
  };

  const handleReorder = async (newOrder) => {
    try {
      await reorderModules(newOrder.map((m) => m.id));
      refetch(); // Refresh the list
    } catch (err) {
      console.error('Failed to reorder modules:', err);
    }
  };

  const handleCreateNew = () => {
    navigate('/admin/modules/new');
  };

  if (error) {
    return (
      <PageWrapper title="Modules">
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Error Loading Modules
          </h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </PageWrapper>
    );
  }

  const breadcrumbs = [
    { label: 'Admin', href: '/admin' },
    { label: 'Modules' },
  ];

  return (
    <PageWrapper
      title="Modules"
      description="Manage learning modules and their lessons"
      breadcrumbs={breadcrumbs}
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Modules
                </p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Published</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.published}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Drafts</p>
                <p className="text-2xl font-bold text-gray-600">{stats.draft}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-gray-500" />
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
                placeholder="Search modules..."
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
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
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
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Create Button */}
            <Button onClick={handleCreateNew} className="shrink-0">
              <Plus className="w-4 h-4 mr-2" />
              New Module
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modules List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>
              Modules{' '}
              {filteredModules.length !== modules?.length && (
                <span className="text-sm font-normal text-gray-500">
                  ({filteredModules.length} of {modules?.length})
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
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <SortableModuleList
              modules={filteredModules}
              onReorder={handleReorder}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onTogglePublish={handleTogglePublish}
            />
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        title="Delete Module"
        itemName={moduleToDelete?.title}
        description={
          moduleToDelete?.lesson_count > 0
            ? `This module contains ${moduleToDelete.lesson_count} lessons. Deleting it will also remove all associated lessons and content.`
            : undefined
        }
        isLoading={isDeleting}
      />
    </PageWrapper>
  );
}

export default ModulesListPage;
