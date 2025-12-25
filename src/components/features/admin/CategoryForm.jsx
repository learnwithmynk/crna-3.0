/**
 * CategoryForm Component
 *
 * Modal form for creating/editing categories.
 * Fields: slug (auto-generated from display_name), display_name, description
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

export function CategoryForm({ open, onOpenChange, category, onSubmit }) {
  const isEditing = !!category;

  // Form state
  const [displayName, setDisplayName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Reset form when modal opens/closes or category changes
  useEffect(() => {
    if (open) {
      if (category) {
        setDisplayName(category.display_name || '');
        setSlug(category.slug || '');
        setSlugManuallyEdited(true); // Don't auto-generate for existing
        setDescription(category.description || '');
      } else {
        setDisplayName('');
        setSlug('');
        setSlugManuallyEdited(false);
        setDescription('');
      }
      setError(null);
    }
  }, [open, category]);

  // Auto-generate slug from display_name (only for new categories)
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
      });
    } catch (err) {
      setError(err.message || 'Failed to save category');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Category' : 'New Category'}
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
              placeholder="e.g., Interview Prep"
              autoFocus
            />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug">
              Slug *
              <span className="text-xs text-gray-500 ml-2">
                (URL-safe identifier)
              </span>
            </Label>
            <Input
              id="slug"
              value={slug}
              onChange={handleSlugChange}
              placeholder="e.g., interview-prep"
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
              placeholder="Brief description of what this category contains..."
              rows={3}
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
                'Create Category'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CategoryForm;
