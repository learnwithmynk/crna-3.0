/**
 * DeleteConfirmModal Component
 *
 * Confirmation modal for delete actions.
 * Shows item name and requires confirmation before proceeding.
 * Wraps the existing ConfirmDialog component.
 */

import React from 'react';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

export function DeleteConfirmModal({
  open,
  onOpenChange,
  onConfirm,
  title = 'Delete Item',
  description,
  itemName,
  isLoading = false,
}) {
  const defaultDescription = itemName
    ? `Are you sure you want to delete "${itemName}"? This action cannot be undone.`
    : 'Are you sure you want to delete this item? This action cannot be undone.';

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description || defaultDescription}
      confirmLabel={isLoading ? 'Deleting...' : 'Delete'}
      variant="destructive"
      onConfirm={onConfirm}
    />
  );
}

export default DeleteConfirmModal;
