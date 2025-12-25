/**
 * BulkEditModal
 *
 * Modal for bulk editing access control rules for multiple resources.
 * Features:
 * - Multi-select entitlements (checkboxes)
 * - Option to "Add to existing" or "Replace all"
 * - Preview of affected items
 * - Validation and warnings
 */

import { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Loader2, Shield, AlertCircle, CheckCircle2 } from 'lucide-react';

export function BulkEditModal({
  open,
  onOpenChange,
  selectedItems = [],
  entitlements = [],
  onSave
}) {
  const [mode, setMode] = useState('replace'); // 'replace' or 'add'
  const [selectedEntitlements, setSelectedEntitlements] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // Reset state when modal opens/closes or items change
  useEffect(() => {
    if (open) {
      setMode('replace');
      setSelectedEntitlements([]);
    }
  }, [open, selectedItems]);

  // Group selected items by type
  const itemsByType = useMemo(() => {
    const groups = {
      module: [],
      lesson: [],
      download: [],
    };

    selectedItems.forEach(item => {
      if (groups[item.type]) {
        groups[item.type].push(item);
      }
    });

    return groups;
  }, [selectedItems]);

  // Calculate what the result will be for each item
  const preview = useMemo(() => {
    return selectedItems.map(item => {
      let resultingEntitlements = [];

      if (mode === 'replace') {
        resultingEntitlements = selectedEntitlements;
      } else if (mode === 'add') {
        // Combine existing and new, removing duplicates
        const existing = item.accessible_via || [];
        resultingEntitlements = [...new Set([...existing, ...selectedEntitlements])];
      }

      return {
        id: item.id,
        name: item.display_name || item.name,
        type: item.type,
        currentEntitlements: item.accessible_via || [],
        resultingEntitlements,
        isPublic: resultingEntitlements.length === 0,
      };
    });
  }, [selectedItems, selectedEntitlements, mode]);

  const handleToggleEntitlement = (slug, checked) => {
    if (checked) {
      setSelectedEntitlements([...selectedEntitlements, slug]);
    } else {
      setSelectedEntitlements(selectedEntitlements.filter(s => s !== slug));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Prepare updates for each resource
      const updates = selectedItems.map(item => {
        let entitlementsToSave = [];

        if (mode === 'replace') {
          entitlementsToSave = selectedEntitlements;
        } else if (mode === 'add') {
          const existing = item.accessible_via || [];
          entitlementsToSave = [...new Set([...existing, ...selectedEntitlements])];
        }

        return {
          resourceId: item.id,
          resourceType: item.type,
          data: {
            entitlements: entitlementsToSave,
            isPublic: entitlementsToSave.length === 0,
          },
        };
      });

      // Call the parent's onSave handler
      await onSave(updates);

      // Close modal on success
      onOpenChange(false);
    } catch (err) {
      console.error('Failed to bulk update access rules:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  if (selectedItems.length === 0) return null;

  const hasChanges = selectedEntitlements.length > 0 || mode === 'replace';
  const willMakePublic = mode === 'replace' && selectedEntitlements.length === 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Edit Access Control</DialogTitle>
          <DialogDescription>
            Update access rules for {selectedItems.length} selected {selectedItems.length === 1 ? 'resource' : 'resources'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Selected Items Summary */}
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-gray-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-gray-900 mb-2">
                  Selected Resources ({selectedItems.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(itemsByType).map(([type, items]) =>
                    items.length > 0 && (
                      <Badge key={type} variant="secondary" className="capitalize">
                        {items.length} {type}{items.length !== 1 ? 's' : ''}
                      </Badge>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Edit Mode Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Update Mode</Label>
            <RadioGroup value={mode} onValueChange={setMode}>
              <div className="flex items-start gap-3 p-4 border rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => setMode('replace')}
              >
                <RadioGroupItem value="replace" />
                <div className="flex-1">
                  <p className="font-medium text-sm">Replace All Entitlements</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Remove existing entitlements and set new ones for all selected resources
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 border rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => setMode('add')}
              >
                <RadioGroupItem value="add" />
                <div className="flex-1">
                  <p className="font-medium text-sm">Add to Existing</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Keep existing entitlements and add new ones (no duplicates)
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Entitlements Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium flex items-center gap-2">
              <Shield className="w-4 h-4" />
              {mode === 'replace' ? 'New Entitlements' : 'Add Entitlements'}
            </Label>
            <p className="text-sm text-gray-600">
              {mode === 'replace'
                ? 'Select entitlements to replace existing access rules'
                : 'Select additional entitlements to add to existing rules'}
            </p>

            {entitlements.length === 0 ? (
              <div className="flex items-center justify-center py-8 text-gray-500">
                <p className="text-sm">No entitlements available</p>
              </div>
            ) : (
              <div className="space-y-2 border rounded-xl p-3 max-h-64 overflow-y-auto">
                {entitlements.map((entitlement) => (
                  <div
                    key={entitlement.slug}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleToggleEntitlement(
                      entitlement.slug,
                      !selectedEntitlements.includes(entitlement.slug)
                    )}
                  >
                    <Checkbox
                      checked={selectedEntitlements.includes(entitlement.slug)}
                      onCheckedChange={(checked) =>
                        handleToggleEntitlement(entitlement.slug, checked)
                      }
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{entitlement.display_name}</p>
                      {entitlement.description && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {entitlement.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Warning Messages */}
          {willMakePublic && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl">
              <div className="flex gap-2">
                <AlertCircle className="w-5 h-5 text-orange-600 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-orange-900">
                    Warning: Making Resources Public
                  </p>
                  <p className="text-sm text-orange-700 mt-1">
                    No entitlements selected. All {selectedItems.length} resource{selectedItems.length !== 1 ? 's' : ''} will become publicly accessible.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Preview Summary */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
              <p className="text-sm font-medium text-blue-900">
                Preview Changes
              </p>
            </div>
            <div className="text-sm text-blue-700 space-y-1">
              {mode === 'replace' ? (
                selectedEntitlements.length === 0 ? (
                  <p>
                    All <strong>{selectedItems.length} resource{selectedItems.length !== 1 ? 's' : ''}</strong> will be made <strong>public</strong> (accessible to everyone).
                  </p>
                ) : (
                  <p>
                    All <strong>{selectedItems.length} resource{selectedItems.length !== 1 ? 's' : ''}</strong> will require <strong>{selectedEntitlements.length} entitlement{selectedEntitlements.length !== 1 ? 's' : ''}</strong> for access.
                  </p>
                )
              ) : (
                selectedEntitlements.length > 0 ? (
                  <p>
                    Adding <strong>{selectedEntitlements.length} entitlement{selectedEntitlements.length !== 1 ? 's' : ''}</strong> to <strong>{selectedItems.length} resource{selectedItems.length !== 1 ? 's' : ''}</strong>.
                  </p>
                ) : (
                  <p className="text-gray-500">Select entitlements to add</p>
                )
              )}

              {/* Show items that will become public */}
              {mode === 'add' && selectedEntitlements.length > 0 && (
                <div className="mt-2 pt-2 border-t border-blue-200">
                  <p className="text-xs">
                    Resources will keep their existing entitlements plus the new ones.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Affected Items List (Optional - shows first few) */}
          {selectedItems.length <= 5 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Affected Resources</Label>
              <div className="space-y-2 p-3 bg-gray-50 rounded-xl max-h-40 overflow-y-auto">
                {preview.map((item) => (
                  <div key={item.id} className="flex items-start gap-2 text-xs">
                    <Badge variant="outline" className="capitalize shrink-0">
                      {item.type}
                    </Badge>
                    <span className="flex-1 truncate text-gray-700">{item.name}</span>
                    <span className="text-gray-500 shrink-0">
                      {item.currentEntitlements.length} → {item.resultingEntitlements.length}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || (mode === 'add' && selectedEntitlements.length === 0)}
          >
            {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Update {selectedItems.length} Resource{selectedItems.length !== 1 ? 's' : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default BulkEditModal;
