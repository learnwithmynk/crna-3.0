/**
 * CategoriesPage - Admin
 *
 * Manage content categories (shared across modules, lessons, downloads).
 * Features inline editing for display_name and modal for create/full edit.
 * Route: /admin/categories
 */

import React, { useState, useMemo } from 'react';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DeleteConfirmModal } from '@/components/features/admin/DeleteConfirmModal';
import { CategoryForm } from '@/components/features/admin/CategoryForm';
import { useCategories, useCategoryAdmin } from '@/hooks/useCategories';
import {
  Plus,
  Search,
  Tag,
  Loader2,
  AlertCircle,
  Pencil,
  Trash2,
  Check,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

function CategoryRow({ category, onEdit, onDelete, onInlineUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(category.display_name);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!editValue.trim() || editValue === category.display_name) {
      setIsEditing(false);
      setEditValue(category.display_name);
      return;
    }

    setIsSaving(true);
    try {
      await onInlineUpdate(category.id, { displayName: editValue.trim() });
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update category:', err);
      setEditValue(category.display_name);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(category.display_name);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors group">
      {/* Slug */}
      <div className="shrink-0 w-40">
        <code className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
          {category.slug}
        </code>
      </div>

      {/* Display Name - Inline Editable */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-8 max-w-xs"
              autoFocus
              disabled={isSaving}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="h-8 w-8 p-0"
            >
              <Check className="w-4 h-4 text-green-600" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              disabled={isSaving}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4 text-gray-500" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span
              className="font-medium text-gray-900 cursor-pointer hover:text-blue-600"
              onClick={() => setIsEditing(true)}
              title="Click to edit"
            >
              {category.display_name}
            </span>
            <Pencil
              className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              onClick={() => setIsEditing(true)}
            />
          </div>
        )}
        {category.description && (
          <p className="text-sm text-gray-500 mt-1 truncate">
            {category.description}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(category)}
          className="h-8 w-8 p-0"
          title="Edit details"
        >
          <Pencil className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(category)}
          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

export function CategoriesPage() {
  const { categories, isLoading, error, refetch } = useCategories();
  const { createCategory, updateCategory, deleteCategory } = useCategoryAdmin();

  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter and search categories
  const filteredCategories = useMemo(() => {
    let result = categories || [];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.slug?.toLowerCase().includes(query) ||
          c.display_name?.toLowerCase().includes(query) ||
          c.description?.toLowerCase().includes(query)
      );
    }

    // Sort alphabetically by display_name
    return result.sort((a, b) =>
      (a.display_name || '').localeCompare(b.display_name || '')
    );
  }, [categories, searchQuery]);

  // Handlers
  const handleCreate = () => {
    setEditingCategory(null);
    setFormOpen(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormOpen(true);
  };

  const handleDelete = (category) => {
    setCategoryToDelete(category);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    setIsDeleting(true);
    try {
      await deleteCategory(categoryToDelete.id);
      setDeleteModalOpen(false);
      setCategoryToDelete(null);
      refetch();
    } catch (err) {
      console.error('Failed to delete category:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleInlineUpdate = async (id, data) => {
    await updateCategory(id, data);
    refetch();
  };

  const handleFormSubmit = async (data) => {
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, data);
      } else {
        await createCategory(data);
      }
      setFormOpen(false);
      setEditingCategory(null);
      refetch();
    } catch (err) {
      console.error('Failed to save category:', err);
      throw err;
    }
  };

  if (error) {
    return (
      <PageWrapper title="Categories">
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Error Loading Categories
          </h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </PageWrapper>
    );
  }

  const breadcrumbs = [
    { label: 'Admin', href: '/admin' },
    { label: 'Categories' },
  ];

  return (
    <PageWrapper
      title="Categories"
      description="Manage content categories for modules, lessons, and downloads"
      breadcrumbs={breadcrumbs}
    >
      {/* Actions Bar */}
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Create Button */}
            <Button onClick={handleCreate} className="shrink-0">
              <Plus className="w-4 h-4 mr-2" />
              New Category
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Categories List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="w-5 h-5" />
            <span>
              Categories{' '}
              <span className="text-sm font-normal text-gray-500">
                ({filteredCategories.length})
              </span>
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Tag className="w-12 h-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                {categories?.length === 0
                  ? 'No categories yet'
                  : 'No matches found'}
              </h3>
              <p className="text-gray-500 mb-4">
                {categories?.length === 0
                  ? 'Create your first category to organize content.'
                  : 'Try adjusting your search.'}
              </p>
              {categories?.length === 0 && (
                <Button onClick={handleCreate}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Category
                </Button>
              )}
            </div>
          ) : (
            <div>
              {/* Header */}
              <div className="flex items-center gap-4 px-4 py-2 bg-gray-50 border-b text-sm font-medium text-gray-500">
                <div className="w-40">Slug</div>
                <div className="flex-1">Display Name</div>
                <div className="w-20"></div>
              </div>
              {/* Rows */}
              {filteredCategories.map((category) => (
                <CategoryRow
                  key={category.id}
                  category={category}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onInlineUpdate={handleInlineUpdate}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Category Form Modal */}
      <CategoryForm
        open={formOpen}
        onOpenChange={setFormOpen}
        category={editingCategory}
        onSubmit={handleFormSubmit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        title="Delete Category"
        itemName={categoryToDelete?.display_name}
        description="Deleting this category will remove it from all modules, lessons, and downloads that use it."
        isLoading={isDeleting}
      />
    </PageWrapper>
  );
}

export default CategoriesPage;
