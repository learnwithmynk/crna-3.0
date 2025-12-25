/**
 * EntitlementForm Component
 *
 * Modal form for creating/editing entitlements (access control levels).
 * Fields: slug (auto-generated from display_name), display_name, description, is_active
 */

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';

/**
 * Generate a URL-safe slug from text
 */
function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Spaces to hyphens
    .replace(/-+/g, '-') // Multiple hyphens to single
    .replace(/^-|-$/g, ''); // Trim hyphens from ends
}

export function EntitlementForm({ open, onOpenChange, entitlement, onSubmit }) {
  const isEditing = !!entitlement;

  // Form state
  const [displayName, setDisplayName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Reset form when modal opens/closes or entitlement changes
  useEffect(() => {
    if (open) {
      if (entitlement) {
        setDisplayName(entitlement.display_name || '');
        setSlug(entitlement.slug || '');
        setSlugManuallyEdited(true); // Don't auto-generate for existing
        setDescription(entitlement.description || '');
        setIsActive(entitlement.is_active !== false);
      } else {
        setDisplayName('');
        setSlug('');
        setSlugManuallyEdited(false);
        setDescription('');
        setIsActive(true);
      }
      setError(null);
    }
  }, [open, entitlement]);

  // Auto-generate slug from display_name (only for new entitlements)
  useEffect(() => {
    if (!slugManuallyEdited && displayName) {
      setSlug(generateSlug(displayName));
    }
  }, [displayName, slugManuallyEdited]);

  const handleSlugChange = (e) => {
    setSlug(generateSlug(e.target.value));
    setSlugManuallyEdited(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!displayName.trim()) {
      setError('Display name is required');
      return;
    }
    if (!slug.trim()) {
      setError('Slug is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit({
        displayName: displayName.trim(),
        slug: slug.trim(),
        description: description.trim() || null,
        isActive,
      });
    } catch (err) {
      setError(err.message || 'Failed to save entitlement');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Entitlement' : 'New Entitlement'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Display Name */}
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name *</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g., Active Members"
              autoFocus
            />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug">
              Slug *
              <span className="text-xs text-gray-500 ml-2">
                (identifier used in code)
              </span>
            </Label>
            <Input
              id="slug"
              value={slug}
              onChange={handleSlugChange}
              placeholder="e.g., active-members"
              className="font-mono text-sm"
            />
            {!isEditing && !slugManuallyEdited && displayName && (
              <p className="text-xs text-gray-500">
                Auto-generated from display name
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Description
              <span className="text-xs text-gray-500 ml-2">(optional)</span>
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What content does this entitlement grant access to?"
              rows={3}
            />
          </div>

          {/* Active Toggle */}
          <div className="flex items-center justify-between py-2">
            <div>
              <Label htmlFor="isActive" className="cursor-pointer">
                Active
              </Label>
              <p className="text-xs text-gray-500">
                Inactive entitlements won't appear in assignment dropdowns
              </p>
            </div>
            <Switch
              id="isActive"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : isEditing ? (
                'Save Changes'
              ) : (
                'Create Entitlement'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EntitlementForm;
