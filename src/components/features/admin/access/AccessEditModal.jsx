/**
 * AccessEditModal
 *
 * Modal/Sheet to edit single resource access control.
 * - Toggle: Make Public
 * - Multi-select: Required Entitlements (checkboxes)
 * - Save/Cancel buttons
 */

import { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Loader2, Globe, Shield } from 'lucide-react';
import { useEntitlements } from '@/hooks/useEntitlements';

export function AccessEditModal({ open, onOpenChange, resource, onSave }) {
  const { entitlements, isLoading: entitlementsLoading } = useEntitlements();
  const [isPublic, setIsPublic] = useState(false);
  const [selectedEntitlements, setSelectedEntitlements] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form state when resource changes
  useEffect(() => {
    if (resource) {
      setIsPublic(resource.isPublic || false);
      setSelectedEntitlements(resource.accessible_via || []);
    }
  }, [resource]);

  const handleTogglePublic = (checked) => {
    setIsPublic(checked);
    if (checked) {
      setSelectedEntitlements([]);
    }
  };

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
      await onSave({
        isPublic,
        entitlements: isPublic ? [] : selectedEntitlements,
      });
      onOpenChange(false);
    } catch (err) {
      console.error('Failed to save access rules:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    // Reset to original values
    if (resource) {
      setIsPublic(resource.isPublic || false);
      setSelectedEntitlements(resource.accessible_via || []);
    }
  };

  if (!resource) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Edit Access Control</SheetTitle>
          <SheetDescription>
            Configure who can access this {resource.type}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Resource Info */}
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-gray-600 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{resource.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="capitalize text-xs">
                    {resource.type}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    Status: {resource.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Make Public Toggle */}
          <div className="space-y-3">
            <Label className="text-base font-medium flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Public Access
            </Label>
            <div className="flex items-start gap-3 p-4 border rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => handleTogglePublic(!isPublic)}
            >
              <Checkbox
                checked={isPublic}
                onCheckedChange={handleTogglePublic}
              />
              <div className="flex-1">
                <p className="font-medium text-sm">Make this resource public</p>
                <p className="text-xs text-gray-500 mt-1">
                  Anyone can access this {resource.type} without entitlements
                </p>
              </div>
            </div>
          </div>

          {/* Required Entitlements */}
          {!isPublic && (
            <div className="space-y-3">
              <Label className="text-base font-medium flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Required Entitlements
              </Label>
              <p className="text-sm text-gray-600">
                Select which entitlements grant access to this {resource.type}
              </p>

              {entitlementsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                </div>
              ) : (
                <div className="space-y-2 border rounded-xl p-3">
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

              {selectedEntitlements.length === 0 && !isPublic && (
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl">
                  <p className="text-sm text-orange-800">
                    <strong>Warning:</strong> No entitlements selected. This {resource.type} will be inaccessible to all users.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Summary */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-sm font-medium text-blue-900 mb-1">
              Access Summary
            </p>
            <p className="text-sm text-blue-700">
              {isPublic ? (
                <>This {resource.type} will be <strong>publicly accessible</strong> to all users.</>
              ) : selectedEntitlements.length > 0 ? (
                <>This {resource.type} requires <strong>{selectedEntitlements.length} entitlement{selectedEntitlements.length !== 1 ? 's' : ''}</strong> for access.</>
              ) : (
                <>This {resource.type} will be <strong>inaccessible</strong> (no access rules).</>
              )}
            </p>
          </div>
        </div>

        <SheetFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default AccessEditModal;
