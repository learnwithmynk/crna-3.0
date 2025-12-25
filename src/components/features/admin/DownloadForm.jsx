/**
 * DownloadForm Component
 *
 * Form for editing download metadata: title, slug, file, description,
 * categories, entitlements, and access settings.
 */

import React, { useState, useEffect, useRef } from 'react';
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
import { useFileUpload, getFileType } from '@/hooks/useFileUpload';
import { useImageUpload } from '@/hooks/useImageUpload';
import {
  Image as ImageIcon,
  Upload,
  X,
  Loader2,
  Link as LinkIcon,
  Copy,
  Check,
  FileText,
  ExternalLink,
  HardDrive,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const FILE_TYPES = [
  { value: 'PDF', label: 'PDF Document' },
  { value: 'DOCX', label: 'Word Document' },
  { value: 'XLSX', label: 'Excel Spreadsheet' },
  { value: 'CSV', label: 'CSV File' },
  { value: 'PPTX', label: 'PowerPoint' },
  { value: 'ZIP', label: 'ZIP Archive' },
  { value: 'PNG', label: 'PNG Image' },
  { value: 'JPG', label: 'JPG Image' },
  { value: 'OTHER', label: 'Other' },
];

export function DownloadForm({ download, onChange, isNew = false }) {
  const { categories } = useCategories();
  const { entitlements } = useEntitlements();
  const { upload: uploadFile, isUploading: isUploadingFile, progress: uploadProgress } = useFileUpload();
  const { upload: uploadImage, isUploading: isUploadingImage } = useImageUpload();
  const fileInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);

  const [copied, setCopied] = useState(false);
  const [localData, setLocalData] = useState({
    title: '',
    slug: '',
    description: '',
    thumbnail_url: '',
    file_url: '',
    file_type: '',
    file_source: 'url',
    storage_path: '',
    category_slugs: [],
    is_free: false,
    accessible_via: [],
    purchase_product_url: '',
    groundhogg_tag: '',
    status: 'active',
    ...download,
  });

  // Sync with parent when download prop changes
  useEffect(() => {
    if (download) {
      setLocalData((prev) => ({ ...prev, ...download }));
    }
  }, [download]);

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

  // Handle file upload to Supabase
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await uploadFile(file, { folder: 'resources' });
    if (result.url) {
      handleChange('file_url', result.url);
      handleChange('file_source', 'supabase');
      handleChange('storage_path', result.path);
      handleChange('file_type', result.fileType);
      if (result.fileSize) {
        handleChange('file_size_bytes', result.fileSize);
      }
      toast.success('File uploaded!');
    } else if (result.error) {
      toast.error('Upload failed', { description: result.error });
    }
  };

  // Handle thumbnail upload
  const handleThumbnailUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await uploadImage(file, { folder: 'downloads/thumbnails' });
    if (result.url) {
      handleChange('thumbnail_url', result.url);
      toast.success('Thumbnail uploaded!');
    } else if (result.error) {
      toast.error('Upload failed', { description: result.error });
    }
  };

  // Toggle category
  const toggleCategory = (slug) => {
    const current = localData.category_slugs || [];
    const newList = current.includes(slug)
      ? current.filter((s) => s !== slug)
      : [...current, slug];
    handleChange('category_slugs', newList);
  };

  // Toggle entitlement
  const toggleEntitlement = (slug) => {
    const current = localData.accessible_via || [];
    const newList = current.includes(slug)
      ? current.filter((s) => s !== slug)
      : [...current, slug];
    handleChange('accessible_via', newList);
  };

  // Handle free toggle
  const handleFreeToggle = (checked) => {
    // Update both is_free and accessible_via together to avoid race conditions
    const newData = {
      ...localData,
      is_free: checked,
      // Clear entitlements if marking as free
      accessible_via: checked ? [] : localData.accessible_via,
    };
    setLocalData(newData);
    onChange?.(newData);
  };

  // Switch file source mode
  const handleFileSourceChange = (mode) => {
    // Clear file data when switching modes
    if (mode !== localData.file_source) {
      const newData = {
        ...localData,
        file_source: mode,
        file_url: '',
        storage_path: '',
      };
      setLocalData(newData);
      onChange?.(newData);
    }
  };

  // Copy slug URL
  const copySlug = () => {
    navigator.clipboard.writeText(localData.slug);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Download Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={localData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter download title"
            />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="slug"
                  value={localData.slug}
                  onChange={(e) => handleChange('slug', e.target.value)}
                  placeholder="download-url-slug"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={copySlug}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                  title="Copy slug"
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
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={localData.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Brief description of this download..."
              rows={3}
            />
          </div>

          {/* Thumbnail */}
          <div className="space-y-2">
            <Label>Thumbnail (optional)</Label>
            <div className="flex items-start gap-4">
              {localData.thumbnail_url ? (
                <div className="relative">
                  <img
                    src={localData.thumbnail_url}
                    alt="Download thumbnail"
                    className="w-24 h-24 object-cover rounded-xl border"
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
                <div className="w-24 h-24 bg-gray-100 rounded-xl border-2 border-dashed flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-gray-300" />
                </div>
              )}
              <div>
                <input
                  ref={thumbnailInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleThumbnailUpload}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => thumbnailInputRef.current?.click()}
                  disabled={isUploadingImage}
                >
                  {isUploadingImage ? (
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
                  Optional preview image
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File */}
      <Card>
        <CardHeader>
          <CardTitle>File</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File Source Toggle */}
          <div className="flex gap-2 p-1 bg-gray-100 rounded-xl w-fit">
            <button
              type="button"
              onClick={() => handleFileSourceChange('supabase')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                localData.file_source === 'supabase'
                  ? 'bg-white shadow text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              <HardDrive className="w-4 h-4" />
              Upload File
            </button>
            <button
              type="button"
              onClick={() => handleFileSourceChange('url')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                localData.file_source === 'url'
                  ? 'bg-white shadow text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              <ExternalLink className="w-4 h-4" />
              External URL
            </button>
          </div>

          {/* Upload File Mode */}
          {localData.file_source === 'supabase' && (
            <div className="space-y-4">
              {localData.file_url && localData.file_source === 'supabase' ? (
                <div className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <FileText className="w-8 h-8 text-green-600" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-green-900">File uploaded</p>
                    <p className="text-sm text-green-700 truncate">{localData.file_url}</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      handleChange('file_url', '');
                      handleChange('storage_path', '');
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div
                  className={cn(
                    'border-2 border-dashed rounded-xl p-8 text-center transition-colors',
                    isUploadingFile ? 'border-blue-300 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                  )}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.ppt,.pptx,.zip,.png,.jpg,.jpeg,.gif,.webp,.txt"
                  />
                  {isUploadingFile ? (
                    <>
                      <Loader2 className="w-10 h-10 mx-auto mb-3 text-blue-500 animate-spin" />
                      <p className="text-sm font-medium text-blue-700">Uploading... {uploadProgress}%</p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" />
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PDF, Word, Excel, PowerPoint, ZIP, images (max 25MB)
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-4"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Select File
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* External URL Mode */}
          {localData.file_source === 'url' && (
            <div className="space-y-2">
              <Label htmlFor="file_url">File URL *</Label>
              <Input
                id="file_url"
                value={localData.file_url || ''}
                onChange={(e) => handleChange('file_url', e.target.value)}
                placeholder="https://drive.google.com/..."
              />
              <p className="text-xs text-gray-500">
                Paste a Google Drive, Dropbox, or other external link
              </p>
            </div>
          )}

          {/* File Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>File Type</Label>
              <Select
                value={localData.file_type || ''}
                onValueChange={(value) => handleChange('file_type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {FILE_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">
            Assign categories for organization and lesson auto-population.
          </p>
          {categories.length === 0 ? (
            <p className="text-sm text-gray-400 italic">No categories defined yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const isSelected = (localData.category_slugs || []).includes(cat.slug);
                return (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => toggleCategory(cat.slug)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-sm font-medium border transition-colors',
                      isSelected
                        ? 'bg-blue-100 border-blue-300 text-blue-800'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                    )}
                  >
                    {cat.display_name}
                  </button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Access Control */}
      <Card>
        <CardHeader>
          <CardTitle>Access Control</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Free Checkbox */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
            <Checkbox
              id="is_free"
              checked={localData.is_free}
              onCheckedChange={handleFreeToggle}
            />
            <div>
              <Label htmlFor="is_free" className="cursor-pointer font-medium">
                Free Download
              </Label>
              <p className="text-sm text-gray-500">
                Available to everyone, no login required
              </p>
            </div>
          </div>

          {/* Entitlements - only show if NOT free */}
          {!localData.is_free && (
            <>
              <p className="text-sm text-gray-500">
                Select which membership tiers can access this download:
              </p>
              {entitlements.length === 0 ? (
                <p className="text-sm text-gray-400 italic">No entitlements defined yet.</p>
              ) : (
                <div className="space-y-3">
                  {entitlements.map((ent) => (
                    <div key={ent.slug} className="flex items-center gap-3">
                      <Checkbox
                        id={`ent-${ent.slug}`}
                        checked={(localData.accessible_via || []).includes(ent.slug)}
                        onCheckedChange={() => toggleEntitlement(ent.slug)}
                      />
                      <Label
                        htmlFor={`ent-${ent.slug}`}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        {ent.display_name}
                        {ent.description && (
                          <span className="text-xs text-gray-400">
                            ({ent.description})
                          </span>
                        )}
                      </Label>
                    </div>
                  ))}
                </div>
              )}

              {/* Warning if no entitlements selected */}
              {!localData.is_free && (localData.accessible_via || []).length === 0 && (
                <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-800">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">No access level selected</p>
                    <p className="text-yellow-700">
                      This download won't be accessible to anyone. Select at least one entitlement or mark it as free.
                    </p>
                  </div>
                </div>
              )}

              {/* Selected entitlements badges */}
              {(localData.accessible_via || []).length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {localData.accessible_via.map((slug) => {
                    const ent = entitlements.find((e) => e.slug === slug);
                    return (
                      <Badge key={slug} variant="secondary">
                        {ent?.display_name || slug}
                      </Badge>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Purchase & Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Purchase & Reference</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* WooCommerce Product URL */}
          <div className="space-y-2">
            <Label htmlFor="purchase_url">WooCommerce Product URL</Label>
            <Input
              id="purchase_url"
              value={localData.purchase_product_url || ''}
              onChange={(e) => handleChange('purchase_product_url', e.target.value)}
              placeholder="https://thecrnaclub.com/product/..."
            />
            <p className="text-xs text-gray-500">
              Shown as "Get Now" button when user lacks access
            </p>
          </div>

          {/* Groundhogg Tag */}
          <div className="space-y-2">
            <Label htmlFor="groundhogg_tag">Groundhogg Tag (reference)</Label>
            <Input
              id="groundhogg_tag"
              value={localData.groundhogg_tag || ''}
              onChange={(e) => handleChange('groundhogg_tag', e.target.value)}
              placeholder="e.g., download-resume-template"
            />
            <p className="text-xs text-gray-500">
              For VA reference only - no functionality
            </p>
          </div>

          {/* Download Count (read-only) */}
          {!isNew && (
            <div className="space-y-2">
              <Label>Download Count</Label>
              <p className="text-2xl font-bold text-gray-900">
                {download?.download_count || 0}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default DownloadForm;
