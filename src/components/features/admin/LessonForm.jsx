/**
 * LessonForm Component
 *
 * Form for creating and editing lessons.
 * Includes all lesson fields: title, slug, video, content, downloads, access control.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BlockEditor } from '@/components/features/lms/BlockEditor';
import { EntitlementCheckboxes } from './EntitlementCheckboxes';
import { DownloadSelector } from './DownloadSelector';
import { useCategories } from '@/hooks/useCategories';
import {
  Video,
  Link as LinkIcon,
  Copy,
  Check,
  FileText,
  Download,
  Shield,
  Settings,
  Image as ImageIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Generate slug from title
 */
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * LessonForm Component
 *
 * @param {Object} props
 * @param {Object} props.lesson - Lesson data (null for new)
 * @param {Object} props.module - Parent module data
 * @param {Function} props.onChange - Called when any field changes
 * @param {string} props.className - Additional CSS classes
 */
export function LessonForm({ lesson, module, onChange, className }) {
  const { categories } = useCategories();
  const editorRef = useRef(null);

  const [localData, setLocalData] = useState({
    title: '',
    slug: '',
    vimeo_video_id: '',
    video_thumbnail_url: '',
    video_description: '',
    video_duration_seconds: null,
    content: null,
    resource_category_slug: '',
    manual_download_ids: [],
    excluded_download_ids: [],
    accessible_via: [],
    category_slugs: [],
    status: 'draft',
    meta_description: '',
  });

  const [slugEdited, setSlugEdited] = useState(false);
  const [copied, setCopied] = useState(false);
  const [inheritEntitlements, setInheritEntitlements] = useState(true);

  // Initialize from lesson prop
  useEffect(() => {
    if (lesson) {
      setLocalData({
        title: lesson.title || '',
        slug: lesson.slug || '',
        vimeo_video_id: lesson.vimeo_video_id || '',
        video_thumbnail_url: lesson.video_thumbnail_url || '',
        video_description: lesson.video_description || '',
        video_duration_seconds: lesson.video_duration_seconds || null,
        content: lesson.content || null,
        resource_category_slug: lesson.resource_category_slug || '',
        manual_download_ids: lesson.manual_download_ids || [],
        excluded_download_ids: lesson.excluded_download_ids || [],
        accessible_via: lesson.accessible_via || [],
        category_slugs: lesson.category_slugs || [],
        status: lesson.status || 'draft',
        meta_description: lesson.meta_description || '',
      });
      setSlugEdited(true);
      // If accessible_via is empty, we're inheriting
      setInheritEntitlements(
        !lesson.accessible_via || lesson.accessible_via.length === 0
      );
    }
  }, [lesson]);

  // Handle field change
  const handleChange = (field, value) => {
    const updated = { ...localData, [field]: value };

    // Auto-generate slug from title if not manually edited
    if (field === 'title' && !slugEdited) {
      updated.slug = generateSlug(value);
    }

    setLocalData(updated);
    onChange?.(updated);
  };

  // Handle slug edit
  const handleSlugChange = (value) => {
    setSlugEdited(true);
    handleChange('slug', generateSlug(value));
  };

  // Handle inherit entitlements toggle
  const handleInheritChange = (checked) => {
    setInheritEntitlements(checked);
    if (checked) {
      handleChange('accessible_via', []);
    }
  };

  // Handle content change from editor
  const handleContentChange = (data) => {
    handleChange('content', data);
  };

  // Copy lesson URL
  const handleCopyUrl = () => {
    const url = `${window.location.origin}/learn/${module?.slug || 'module'}/${localData.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Get Vimeo thumbnail
  const getVimeoThumbnail = (videoId) => {
    if (!videoId) return null;
    return `https://vumbnail.com/${videoId}.jpg`;
  };

  // Resource categories for download auto-populate
  const resourceCategories = categories.filter((c) =>
    c.slug?.startsWith('resource-') || c.type === 'resource'
  );

  return (
    <div className={cn('space-y-6', className)}>
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Title */}
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={localData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter lesson title"
            />
          </div>

          {/* Slug */}
          <div>
            <Label htmlFor="slug">URL Slug *</Label>
            <div className="flex gap-2">
              <Input
                id="slug"
                value={localData.slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="lesson-slug"
                className="font-mono"
              />
              {localData.slug && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyUrl}
                  title="Copy lesson URL"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              )}
            </div>
            {localData.slug && (
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                <LinkIcon className="w-3 h-3" />
                /learn/{module?.slug || 'module'}/{localData.slug}
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={localData.status}
              onValueChange={(value) => handleChange('status', value)}
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gray-400" />
                    Draft
                  </span>
                </SelectItem>
                <SelectItem value="published">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    Published
                  </span>
                </SelectItem>
                <SelectItem value="archived">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-400" />
                    Archived
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div>
            <Label>Categories</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {categories.map((cat) => (
                <Badge
                  key={cat.slug}
                  variant={
                    localData.category_slugs?.includes(cat.slug)
                      ? 'default'
                      : 'outline'
                  }
                  className="cursor-pointer"
                  onClick={() => {
                    const current = localData.category_slugs || [];
                    const newList = current.includes(cat.slug)
                      ? current.filter((s) => s !== cat.slug)
                      : [...current, cat.slug];
                    handleChange('category_slugs', newList);
                  }}
                >
                  {cat.name}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Video Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="w-5 h-5" />
            Video Content
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Vimeo ID */}
          <div>
            <Label htmlFor="vimeo_video_id">Vimeo Video ID</Label>
            <Input
              id="vimeo_video_id"
              value={localData.vimeo_video_id}
              onChange={(e) => handleChange('vimeo_video_id', e.target.value)}
              placeholder="123456789"
              className="font-mono"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the numeric ID from the Vimeo URL (e.g., vimeo.com/123456789)
            </p>
          </div>

          {/* Thumbnail Preview */}
          {localData.vimeo_video_id && (
            <div>
              <Label>Thumbnail Preview</Label>
              <div className="mt-1 relative aspect-video w-full max-w-md rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={
                    localData.video_thumbnail_url ||
                    getVimeoThumbnail(localData.vimeo_video_id)
                  }
                  alt="Video thumbnail"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/placeholder-video.png';
                  }}
                />
              </div>
            </div>
          )}

          {/* Custom Thumbnail URL */}
          <div>
            <Label htmlFor="video_thumbnail_url">Custom Thumbnail URL</Label>
            <Input
              id="video_thumbnail_url"
              value={localData.video_thumbnail_url}
              onChange={(e) => handleChange('video_thumbnail_url', e.target.value)}
              placeholder="https://..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Optional. Leave blank to use Vimeo's auto-generated thumbnail.
            </p>
          </div>

          {/* Video Description */}
          <div>
            <Label htmlFor="video_description">Video Description</Label>
            <Textarea
              id="video_description"
              value={localData.video_description}
              onChange={(e) => handleChange('video_description', e.target.value)}
              placeholder="Brief description shown below the video..."
              rows={3}
            />
          </div>

          {/* Duration */}
          <div>
            <Label htmlFor="video_duration_seconds">Duration (seconds)</Label>
            <Input
              id="video_duration_seconds"
              type="number"
              value={localData.video_duration_seconds || ''}
              onChange={(e) =>
                handleChange(
                  'video_duration_seconds',
                  e.target.value ? parseInt(e.target.value) : null
                )
              }
              placeholder="300"
              className="w-32"
            />
            {localData.video_duration_seconds && (
              <p className="text-xs text-gray-500 mt-1">
                {Math.floor(localData.video_duration_seconds / 60)}m{' '}
                {localData.video_duration_seconds % 60}s
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Editor Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Lesson Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-xl overflow-hidden">
            <BlockEditor
              ref={editorRef}
              initialData={localData.content}
              onChange={handleContentChange}
              autosave={false}
              placeholder="Start writing lesson content..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Downloads */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Downloads & Resources
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Resource Category */}
          <div>
            <Label htmlFor="resource_category_slug">Auto-populate from Category</Label>
            <Select
              value={localData.resource_category_slug || 'none'}
              onValueChange={(value) =>
                handleChange('resource_category_slug', value === 'none' ? '' : value)
              }
            >
              <SelectTrigger id="resource_category_slug">
                <SelectValue placeholder="Select category..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {resourceCategories.map((cat) => (
                  <SelectItem key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">
              Downloads in this category will be automatically shown in the lesson
            </p>
          </div>

          {/* Manual Downloads */}
          <div>
            <Label>Additional Downloads</Label>
            <DownloadSelector
              value={localData.manual_download_ids}
              onChange={(ids) => handleChange('manual_download_ids', ids)}
              mode="include"
              label="Add specific downloads"
            />
          </div>

          {/* Excluded Downloads */}
          <div>
            <Label>Excluded Downloads</Label>
            <DownloadSelector
              value={localData.excluded_download_ids}
              onChange={(ids) => handleChange('excluded_download_ids', ids)}
              mode="exclude"
              label="Exclude downloads"
            />
            <p className="text-xs text-gray-500 mt-1">
              These will be hidden even if they match the resource category
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Access Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Access Control
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EntitlementCheckboxes
            value={localData.accessible_via}
            onChange={(slugs) => handleChange('accessible_via', slugs)}
            allowInherit={true}
            inheritChecked={inheritEntitlements}
            onInheritChange={handleInheritChange}
          />
          {module?.accessible_via?.length > 0 && inheritEntitlements && (
            <p className="text-xs text-gray-500 mt-2">
              Inheriting from module: {module.accessible_via.join(', ')}
            </p>
          )}
        </CardContent>
      </Card>

      {/* SEO */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            SEO Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="meta_description">Meta Description</Label>
            <Textarea
              id="meta_description"
              value={localData.meta_description}
              onChange={(e) => handleChange('meta_description', e.target.value)}
              placeholder="Brief description for search engines..."
              rows={2}
            />
            <p className="text-xs text-gray-500 mt-1">
              {localData.meta_description?.length || 0}/160 characters
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default LessonForm;
