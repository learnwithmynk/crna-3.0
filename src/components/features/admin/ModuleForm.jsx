/**
 * ModuleForm Component
 *
 * Form for editing module metadata: title, slug, thumbnail, description,
 * entitlements, category, and status.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCategories } from '@/hooks/useCategories';
import { useEntitlements } from '@/hooks/useEntitlements';
import { useImageUpload } from '@/hooks/useImageUpload';
import {
  Image as ImageIcon,
  Upload,
  X,
  Loader2,
  Link as LinkIcon,
  Copy,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function ModuleForm({ module, onChange, onSave, isSaving = false }) {
  const { categories } = useCategories();
  const { entitlements } = useEntitlements();
  const { upload, isUploading } = useImageUpload();

  const [copied, setCopied] = useState(false);
  const [localData, setLocalData] = useState({
    title: '',
    slug: '',
    description: '',
    thumbnail_url: '',
    category_slug: '',
    status: 'draft',
    entitlement_slugs: [],
    ...module,
  });

  // Sync with parent when module prop changes
  useEffect(() => {
    if (module) {
      setLocalData((prev) => ({ ...prev, ...module }));
    }
  }, [module]);

  // Notify parent of changes
  const handleChange = (field, value) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    onChange?.(newData);
  };

  // Auto-generate slug from title
  const generateSlug = () => {
    const slug = localData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    handleChange('slug', slug);
  };

  // Handle thumbnail upload
  const handleThumbnailUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await upload(file, { folder: 'modules' });
    if (result.url) {
      handleChange('thumbnail_url', result.url);
      toast.success('Thumbnail uploaded!');
    } else if (result.error) {
      toast.error('Upload failed', { description: result.error });
    }
  };

  // Toggle entitlement
  const toggleEntitlement = (slug) => {
    const current = localData.entitlement_slugs || [];
    const newList = current.includes(slug)
      ? current.filter((s) => s !== slug)
      : [...current, slug];
    handleChange('entitlement_slugs', newList);
  };

  // Copy URL to clipboard
  const copyUrl = () => {
    const url = `${window.location.origin}/learn/${localData.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Module Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={localData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter module title"
            />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug">URL Slug</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="slug"
                  value={localData.slug}
                  onChange={(e) => handleChange('slug', e.target.value)}
                  placeholder="module-url-slug"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={copyUrl}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                  title="Copy URL"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={generateSlug}
                disabled={!localData.title}
              >
                Generate
              </Button>
            </div>
            {localData.slug && (
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <LinkIcon className="w-3 h-3" />
                /learn/{localData.slug}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={localData.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Brief description of what this module covers..."
              rows={3}
            />
          </div>

          {/* Thumbnail */}
          <div className="space-y-2">
            <Label>Thumbnail</Label>
            <div className="flex items-start gap-4">
              {localData.thumbnail_url ? (
                <div className="relative">
                  <img
                    src={localData.thumbnail_url}
                    alt="Module thumbnail"
                    className="w-32 h-20 object-cover rounded-xl border"
                  />
                  <button
                    type="button"
                    onClick={() => handleChange('thumbnail_url', '')}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="w-32 h-20 bg-gray-100 rounded-xl border-2 border-dashed flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-gray-300" />
                </div>
              )}
              <div>
                <input
                  type="file"
                  id="thumbnail"
                  accept="image/*"
                  className="hidden"
                  onChange={handleThumbnailUpload}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('thumbnail').click()}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Image
                    </>
                  )}
                </Button>
                <p className="text-xs text-gray-500 mt-1">
                  Recommended: 800x500px, max 5MB
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category & Status */}
      <Card>
        <CardHeader>
          <CardTitle>Organization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={localData.category_slug || ''}
                onValueChange={(value) => handleChange('category_slug', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.slug} value={cat.slug}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={localData.status}
                onValueChange={(value) => handleChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Entitlements */}
      <Card>
        <CardHeader>
          <CardTitle>Access Control</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">
            Select which membership tiers can access this module. If none selected, module is available to all members.
          </p>
          <div className="space-y-3">
            {entitlements.map((ent) => (
              <div key={ent.slug} className="flex items-center gap-3">
                <Checkbox
                  id={`ent-${ent.slug}`}
                  checked={(localData.entitlement_slugs || []).includes(ent.slug)}
                  onCheckedChange={() => toggleEntitlement(ent.slug)}
                />
                <Label
                  htmlFor={`ent-${ent.slug}`}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  {ent.name}
                  {ent.description && (
                    <span className="text-xs text-gray-400">
                      ({ent.description})
                    </span>
                  )}
                </Label>
              </div>
            ))}
          </div>
          {(localData.entitlement_slugs || []).length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {localData.entitlement_slugs.map((slug) => {
                const ent = entitlements.find((e) => e.slug === slug);
                return (
                  <Badge key={slug} variant="secondary">
                    {ent?.name || slug}
                  </Badge>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      {onSave && (
        <div className="flex justify-end">
          <Button onClick={onSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

export default ModuleForm;
