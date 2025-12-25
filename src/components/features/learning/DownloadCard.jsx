/**
 * DownloadCard Component
 *
 * Displays a downloadable resource with thumbnail, title, and action button.
 * Button shows "Download" if user has access, "Get Now" if they need to purchase.
 *
 * Used in: LessonResources, Downloads pages
 */

import { Download, ShoppingCart, Lock, FileText, FileSpreadsheet, FileArchive, FileVideo, FileImage, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/**
 * Get icon component for file type
 */
function getFileIcon(fileType) {
  const type = fileType?.toLowerCase();

  const iconMap = {
    pdf: FileText,
    doc: FileText,
    docx: FileText,
    xls: FileSpreadsheet,
    xlsx: FileSpreadsheet,
    csv: FileSpreadsheet,
    zip: FileArchive,
    rar: FileArchive,
    mp4: FileVideo,
    mov: FileVideo,
    webm: FileVideo,
    png: FileImage,
    jpg: FileImage,
    jpeg: FileImage,
    gif: FileImage,
    webp: FileImage,
  };

  return iconMap[type] || File;
}

/**
 * Get color for file type badge
 */
function getFileTypeColor(fileType) {
  const type = fileType?.toLowerCase();

  const colorMap = {
    pdf: 'bg-red-100 text-red-700',
    doc: 'bg-blue-100 text-blue-700',
    docx: 'bg-blue-100 text-blue-700',
    xls: 'bg-green-100 text-green-700',
    xlsx: 'bg-green-100 text-green-700',
    csv: 'bg-green-100 text-green-700',
    zip: 'bg-amber-100 text-amber-700',
    rar: 'bg-amber-100 text-amber-700',
  };

  return colorMap[type] || 'bg-gray-100 text-gray-700';
}

/**
 * Format file size to human-readable
 */
function formatFileSize(bytes) {
  if (!bytes) return null;

  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

/**
 * @param {Object} props
 * @param {Object} props.download - Download object from Supabase
 * @param {boolean} props.hasAccess - Whether user can download this resource
 * @param {Function} props.onDownload - Called when download button is clicked
 * @param {string} props.variant - Display variant: 'card', 'compact', 'list'
 * @param {string} props.className - Additional classes
 */
export function DownloadCard({
  download,
  hasAccess = true,
  onDownload,
  variant = 'card',
  className,
}) {
  const FileIcon = getFileIcon(download.file_type);
  const fileSize = formatFileSize(download.file_size_bytes);

  // Handle download/purchase click
  const handleClick = () => {
    if (hasAccess) {
      // Track download if callback provided
      onDownload?.(download.id);
      // Open file URL
      window.open(download.file_url, '_blank');
    } else if (download.purchase_product_url) {
      // Navigate to purchase page
      window.open(download.purchase_product_url, '_blank');
    }
  };

  // Compact variant (for inline lists)
  if (variant === 'compact') {
    return (
      <div
        className={cn(
          'flex items-center gap-3 p-3 border border-gray-200 rounded-xl bg-white hover:border-gray-300 transition-colors',
          className
        )}
      >
        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
          <FileIcon className="w-5 h-5 text-gray-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 truncate">{download.title}</p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="uppercase">{download.file_type}</span>
            {fileSize && <span>• {fileSize}</span>}
          </div>
        </div>
        <Button
          size="sm"
          variant={hasAccess ? 'default' : 'outline'}
          onClick={handleClick}
          className={cn(
            hasAccess && 'bg-[#f6ff88] hover:bg-[#e5ee77] text-gray-900'
          )}
        >
          {hasAccess ? (
            <>
              <Download className="w-4 h-4 mr-1" />
              Get
            </>
          ) : (
            <>
              <Lock className="w-4 h-4 mr-1" />
              Unlock
            </>
          )}
        </Button>
      </div>
    );
  }

  // List variant (horizontal list item)
  if (variant === 'list') {
    return (
      <div
        className={cn(
          'flex items-center gap-4 p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors',
          className
        )}
      >
        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
          <FileIcon className="w-6 h-6 text-gray-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900">{download.title}</p>
          {download.description && (
            <p className="text-sm text-gray-500 line-clamp-1 mt-0.5">
              {download.description}
            </p>
          )}
        </div>
        <Badge className={cn('shrink-0', getFileTypeColor(download.file_type))}>
          {download.file_type?.toUpperCase() || 'FILE'}
        </Badge>
        <Button
          size="sm"
          onClick={handleClick}
          className={cn(
            'shrink-0',
            hasAccess && 'bg-[#f6ff88] hover:bg-[#e5ee77] text-gray-900'
          )}
        >
          {hasAccess ? (
            <>
              <Download className="w-4 h-4 mr-1" />
              Download
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4 mr-1" />
              Get Now
            </>
          )}
        </Button>
      </div>
    );
  }

  // Default card variant
  return (
    <div
      className={cn(
        'flex flex-col border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow',
        className
      )}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-50">
        {download.thumbnail_url ? (
          <img
            src={download.thumbnail_url}
            alt={download.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <FileIcon className="w-16 h-16 text-gray-300" />
          </div>
        )}

        {/* File type badge */}
        <Badge
          className={cn(
            'absolute top-2 right-2',
            getFileTypeColor(download.file_type)
          )}
        >
          {download.file_type?.toUpperCase() || 'FILE'}
        </Badge>

        {/* Lock overlay if no access */}
        {!hasAccess && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Lock className="w-8 h-8 text-white/80" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">
          {download.title}
        </h3>

        {download.description && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-3">
            {download.description}
          </p>
        )}

        {/* Meta info */}
        {fileSize && (
          <p className="text-xs text-gray-400 mt-auto mb-3">
            {fileSize}
          </p>
        )}

        {/* Action button */}
        <Button
          onClick={handleClick}
          className={cn(
            'w-full',
            hasAccess && 'bg-[#f6ff88] hover:bg-[#e5ee77] text-gray-900'
          )}
        >
          {hasAccess ? (
            <>
              <Download className="w-4 h-4 mr-2" />
              Download
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4 mr-2" />
              Get Now
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default DownloadCard;
