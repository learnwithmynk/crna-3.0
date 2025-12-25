/**
 * EntitlementsPage - Admin
 *
 * Manage access control entitlements (who can access what content).
 * Features inline editing for display_name and modal for create/full edit.
 * Route: /admin/entitlements
 */

import React, { useState, useMemo } from 'react';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DeleteConfirmModal } from '@/components/features/admin/DeleteConfirmModal';
import { EntitlementForm } from '@/components/features/admin/EntitlementForm';
import { useEntitlements, useEntitlementAdmin } from '@/hooks/useEntitlements';
import {
  Plus,
  Search,
  Shield,
  Loader2,
  AlertCircle,
  Pencil,
  Trash2,
  Check,
  X,
} from 'lucide-react';

function EntitlementRow({ entitlement, onEdit, onDelete, onInlineUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(entitlement.display_name);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!editValue.trim() || editValue === entitlement.display_name) {
      setIsEditing(false);
      setEditValue(entitlement.display_name);
      return;
    }

    setIsSaving(true);
    try {
      await onInlineUpdate(entitlement.id, { displayName: editValue.trim() });
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update entitlement:', err);
      setEditValue(entitlement.display_name);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(entitlement.display_name);
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
      <div className="shrink-0 w-48">
        <code className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
          {entitlement.slug}
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
              {entitlement.display_name}
            </span>
            <Pencil
              className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              onClick={() => setIsEditing(true)}
            />
          </div>
        )}
        {entitlement.description && (
          <p className="text-sm text-gray-500 mt-1 truncate">
            {entitlement.description}
          </p>
        )}
      </div>

      {/* Status Badge */}
      <div className="shrink-0 w-20">
        <Badge
          variant={entitlement.is_active ? 'default' : 'secondary'}
          className={entitlement.is_active ? 'bg-green-100 text-green-800' : ''}
        >
          {entitlement.is_active ? 'Active' : 'Inactive'}
        </Badge>
      </div>

      {/* Actions */}
      <div className="shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(entitlement)}
          className="h-8 w-8 p-0"
          title="Edit details"
        >
          <Pencil className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(entitlement)}
          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

export function EntitlementsPage() {
  const { entitlements, isLoading, error, refetch } = useEntitlements();
  const { createEntitlement, updateEntitlement, deleteEntitlement } =
    useEntitlementAdmin();

  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingEntitlement, setEditingEntitlement] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [entitlementToDelete, setEntitlementToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter and search entitlements
  const filteredEntitlements = useMemo(() => {
    let result = entitlements || [];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.slug?.toLowerCase().includes(query) ||
          e.display_name?.toLowerCase().includes(query) ||
          e.description?.toLowerCase().includes(query)
      );
    }

    // Sort alphabetically by display_name
    return result.sort((a, b) =>
      (a.display_name || '').localeCompare(b.display_name || '')
    );
  }, [entitlements, searchQuery]);

  // Stats
  const stats = useMemo(() => {
    const all = entitlements || [];
    return {
      total: all.length,
      active: all.filter((e) => e.is_active).length,
      inactive: all.filter((e) => !e.is_active).length,
    };
  }, [entitlements]);

  // Handlers
  const handleCreate = () => {
    setEditingEntitlement(null);
    setFormOpen(true);
  };

  const handleEdit = (entitlement) => {
    setEditingEntitlement(entitlement);
    setFormOpen(true);
  };

  const handleDelete = (entitlement) => {
    setEntitlementToDelete(entitlement);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!entitlementToDelete) return;

    setIsDeleting(true);
    try {
      await deleteEntitlement(entitlementToDelete.id);
      setDeleteModalOpen(false);
      setEntitlementToDelete(null);
      refetch();
    } catch (err) {
      console.error('Failed to delete entitlement:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleInlineUpdate = async (id, data) => {
    await updateEntitlement(id, data);
    refetch();
  };

  const handleFormSubmit = async (data) => {
    try {
      if (editingEntitlement) {
        await updateEntitlement(editingEntitlement.id, data);
      } else {
        await createEntitlement(data);
      }
      setFormOpen(false);
      setEditingEntitlement(null);
      refetch();
    } catch (err) {
      console.error('Failed to save entitlement:', err);
      throw err;
    }
  };

  if (error) {
    return (
      <PageWrapper title="Entitlements">
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Error Loading Entitlements
          </h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </PageWrapper>
    );
  }

  const breadcrumbs = [
    { label: 'Admin', href: '/admin' },
    { label: 'Entitlements' },
  ];

  return (
    <PageWrapper
      title="Entitlements"
      description="Manage access control levels for content"
      breadcrumbs={breadcrumbs}
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-sm text-gray-500">Total Entitlements</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {stats.active}
            </div>
            <p className="text-sm text-gray-500">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-400">
              {stats.inactive}
            </div>
            <p className="text-sm text-gray-500">Inactive</p>
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
                placeholder="Search entitlements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Create Button */}
            <Button onClick={handleCreate} className="shrink-0">
              <Plus className="w-4 h-4 mr-2" />
              New Entitlement
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Info Banner */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <div className="flex gap-3">
          <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-medium mb-1">What are Entitlements?</p>
            <p className="text-blue-700">
              Entitlements are access control levels that define who can access what content.
              They work like permission tags assigned to both <strong>users</strong> (via subscriptions or purchases)
              and <strong>content</strong> (modules, lessons, downloads). When a user's entitlements match
              the content's required entitlements, they gain access.
            </p>
          </div>
        </div>
      </div>

      {/* Entitlements List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            <span>
              Entitlements{' '}
              <span className="text-sm font-normal text-gray-500">
                ({filteredEntitlements.length})
              </span>
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : filteredEntitlements.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Shield className="w-12 h-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                {entitlements?.length === 0
                  ? 'No entitlements yet'
                  : 'No matches found'}
              </h3>
              <p className="text-gray-500 mb-4">
                {entitlements?.length === 0
                  ? 'Create your first entitlement to control content access.'
                  : 'Try adjusting your search.'}
              </p>
              {entitlements?.length === 0 && (
                <Button onClick={handleCreate}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Entitlement
                </Button>
              )}
            </div>
          ) : (
            <div>
              {/* Header */}
              <div className="flex items-center gap-4 px-4 py-2 bg-gray-50 border-b text-sm font-medium text-gray-500">
                <div className="w-48">Slug</div>
                <div className="flex-1">Display Name</div>
                <div className="w-20">Status</div>
                <div className="w-20"></div>
              </div>
              {/* Rows */}
              {filteredEntitlements.map((entitlement) => (
                <EntitlementRow
                  key={entitlement.id}
                  entitlement={entitlement}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onInlineUpdate={handleInlineUpdate}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Entitlement Form Modal */}
      <EntitlementForm
        open={formOpen}
        onOpenChange={setFormOpen}
        entitlement={editingEntitlement}
        onSubmit={handleFormSubmit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        title="Delete Entitlement"
        itemName={entitlementToDelete?.display_name}
        description="Deleting this entitlement will remove access control from all modules, lessons, and downloads that use it. Users with this entitlement will lose access to that content."
        isLoading={isDeleting}
      />
    </PageWrapper>
  );
}

export default EntitlementsPage;
