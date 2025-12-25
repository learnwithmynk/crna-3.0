/**
 * DownloadEditPage - Admin
 *
 * Create or edit a download resource.
 * Route: /admin/downloads/:downloadId
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { Button } from '@/components/ui/button';
import { DownloadForm } from '@/components/features/admin/DownloadForm';
import { useDownloadAdmin } from '@/hooks/useDownloads';
import { useFileUpload } from '@/hooks/useFileUpload';
import supabase from '@/lib/supabase';
import {
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';

export function DownloadEditPage() {
  const { downloadId } = useParams();
  const navigate = useNavigate();
  // downloadId is undefined when on /admin/downloads/new route
  // or 'new' if someone navigates to /admin/downloads/new via the param route
  const isNew = !downloadId || downloadId === 'new';

  // Hooks
  const { createDownload, updateDownload } = useDownloadAdmin();
  const { deleteFile } = useFileUpload();

  // Local state
  const [download, setDownload] = useState(null);
  const [isLoading, setIsLoading] = useState(!isNew);
  const [error, setError] = useState(null);
  const [downloadData, setDownloadData] = useState({
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
  });
  const [isSaving, setIsSaving] = useState(false);

  // Fetch download data
  useEffect(() => {
    if (isNew) return;

    const fetchDownload = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await supabase
          .from('downloads')
          .select('*')
          .eq('id', downloadId)
          .single();

        if (fetchError) throw fetchError;

        setDownload(data);
        setDownloadData({
          title: data.title || '',
          slug: data.slug || '',
          description: data.description || '',
          thumbnail_url: data.thumbnail_url || '',
          file_url: data.file_url || '',
          file_type: data.file_type || '',
          file_source: data.file_source || 'url',
          storage_path: data.storage_path || '',
          file_size_bytes: data.file_size_bytes || null,
          category_slugs: data.category_slugs || [],
          is_free: data.is_free || false,
          accessible_via: data.accessible_via || [],
          purchase_product_url: data.purchase_product_url || '',
          groundhogg_tag: data.groundhogg_tag || '',
          status: data.status || 'active',
        });
      } catch (err) {
        console.error('Error fetching download:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDownload();
  }, [downloadId, isNew]);

  // Handlers
  const handleSave = async () => {
    // Validation
    if (!downloadData.title?.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!downloadData.slug?.trim()) {
      toast.error('Slug is required');
      return;
    }
    if (!downloadData.file_url?.trim()) {
      toast.error('File URL is required');
      return;
    }

    setIsSaving(true);
    try {
      // Map camelCase to what the hook expects
      const saveData = {
        title: downloadData.title,
        slug: downloadData.slug,
        description: downloadData.description || null,
        thumbnailUrl: downloadData.thumbnail_url || null,
        fileUrl: downloadData.file_url,
        fileType: downloadData.file_type || null,
        fileSource: downloadData.file_source || 'url',
        storagePath: downloadData.storage_path || null,
        fileSizeBytes: downloadData.file_size_bytes || null,
        categorySlugs: downloadData.category_slugs || [],
        isFree: downloadData.is_free || false,
        accessibleVia: downloadData.accessible_via || [],
        purchaseProductUrl: downloadData.purchase_product_url || null,
        groundhoggTag: downloadData.groundhogg_tag || null,
        status: downloadData.status || 'active',
      };

      if (isNew) {
        const { data: created, error: createError } = await createDownload(saveData);
        if (createError) {
          toast.error('Failed to create download', { description: createError });
          return;
        }
        toast.success('Download created!');
        navigate(`/admin/downloads/${created.id}`, { replace: true });
      } else {
        // If file source changed from supabase to url, delete old file
        if (
          download?.file_source === 'supabase' &&
          downloadData.file_source === 'url' &&
          download?.storage_path
        ) {
          await deleteFile(download.storage_path);
        }

        const { error: updateError } = await updateDownload(downloadId, saveData);
        if (updateError) {
          toast.error('Failed to save download', { description: updateError });
          return;
        }
        toast.success('Download saved!');
      }
    } catch (err) {
      console.error('Failed to save download:', err);
      toast.error('Failed to save download');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    if (downloadData.file_url) {
      window.open(downloadData.file_url, '_blank');
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <PageWrapper title="Loading...">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </PageWrapper>
    );
  }

  // Error state
  if (error) {
    return (
      <PageWrapper title="Error">
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Failed to Load Download
          </h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button onClick={() => navigate('/admin/downloads')}>
            Back to Downloads
          </Button>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title={isNew ? 'New Download' : downloadData.title || 'Edit Download'}
      description={isNew ? 'Create a new downloadable resource' : 'Edit download settings'}
    >
      {/* Download ID badge */}
      {!isNew && downloadId && (
        <div className="mb-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600 font-mono">
            ID: {downloadId}
          </span>
        </div>
      )}

      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/downloads')}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Downloads
        </Button>

        <div className="flex items-center gap-2">
          {!isNew && downloadData.file_url && (
            <Button variant="outline" onClick={handlePreview}>
              <ExternalLink className="w-4 h-4 mr-2" />
              View File
            </Button>
          )}
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Form */}
      <DownloadForm
        download={downloadData}
        onChange={setDownloadData}
        isNew={isNew}
      />
    </PageWrapper>
  );
}

export default DownloadEditPage;
