/**
 * WelcomeVideoUpload
 *
 * Component for uploading a welcome/introduction video to provider profile.
 * Similar to Upwork's video introduction feature.
 *
 * Features:
 * - Drag & drop or click to upload
 * - Video preview with playback
 * - Duration limit (2 minutes recommended, 3 max)
 * - File size limit (100MB)
 * - Thumbnail auto-generation
 * - Delete/replace functionality
 *
 * TODO: Replace mock upload with Supabase Storage API
 */

import { useState, useRef, useCallback } from 'react';
import {
  Video,
  Upload,
  Play,
  Pause,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Clock,
  Info,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const MAX_FILE_SIZE_MB = 100;
const MAX_DURATION_SECONDS = 180; // 3 minutes
const RECOMMENDED_DURATION_SECONDS = 120; // 2 minutes
const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-m4v'];

function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatFileSize(bytes) {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
}

export function WelcomeVideoUpload({
  videoUrl,
  thumbnailUrl,
  durationSeconds,
  onUpload,
  onDelete,
  isUploading = false,
  uploadProgress = 0,
  error,
  className,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewDuration, setPreviewDuration] = useState(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);

  const displayError = error || localError;

  const validateFile = useCallback((file) => {
    setLocalError(null);

    // Check file type
    if (!ACCEPTED_VIDEO_TYPES.includes(file.type)) {
      setLocalError('Please upload an MP4, WebM, or MOV video file');
      return false;
    }

    // Check file size
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > MAX_FILE_SIZE_MB) {
      setLocalError(`Video must be under ${MAX_FILE_SIZE_MB}MB (yours is ${sizeMB.toFixed(1)}MB)`);
      return false;
    }

    return true;
  }, []);

  const handleFileSelect = useCallback(async (file) => {
    if (!validateFile(file)) return;

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Get video duration
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = url;

    video.onloadedmetadata = () => {
      const duration = video.duration;
      setPreviewDuration(duration);

      if (duration > MAX_DURATION_SECONDS) {
        setLocalError(`Video is too long (${formatDuration(duration)}). Maximum is ${formatDuration(MAX_DURATION_SECONDS)}`);
        URL.revokeObjectURL(url);
        setPreviewUrl(null);
        return;
      }

      // All validations passed, trigger upload
      onUpload?.(file, duration);
    };

    video.onerror = () => {
      setLocalError('Could not read video file. Please try a different file.');
      URL.revokeObjectURL(url);
      setPreviewUrl(null);
    };
  }, [validateFile, onUpload]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    // Reset input so same file can be selected again
    e.target.value = '';
  }, [handleFileSelect]);

  const handlePlayPause = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const handleDelete = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      setPreviewDuration(null);
    }
    setLocalError(null);
    onDelete?.();
  }, [previewUrl, onDelete]);

  // Determine what to show
  const hasVideo = videoUrl || previewUrl;
  const displayUrl = previewUrl || videoUrl;
  const displayDuration = previewDuration || durationSeconds;

  // Uploading state
  if (isUploading) {
    return (
      <div className={cn('border-2 border-dashed rounded-2xl p-8', className)}>
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <RefreshCw className="w-8 h-8 text-primary animate-spin" />
          </div>
          <h3 className="font-medium text-gray-900 mb-2">Uploading video...</h3>
          <Progress value={uploadProgress} className="max-w-xs mx-auto mb-2" />
          <p className="text-sm text-gray-500">{uploadProgress}% complete</p>
        </div>
      </div>
    );
  }

  // Has video - show preview
  if (hasVideo) {
    return (
      <div className={cn('border rounded-2xl overflow-hidden bg-gray-50', className)}>
        <div className="relative aspect-video bg-black">
          <video
            ref={videoRef}
            src={displayUrl}
            poster={thumbnailUrl}
            className="w-full h-full object-contain"
            onEnded={() => setIsPlaying(false)}
            playsInline
          />

          {/* Play/Pause overlay */}
          <button
            onClick={handlePlayPause}
            className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors group"
          >
            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              {isPlaying ? (
                <Pause className="w-6 h-6 text-gray-900" />
              ) : (
                <Play className="w-6 h-6 text-gray-900 ml-1" />
              )}
            </div>
          </button>

          {/* Duration badge */}
          {displayDuration && (
            <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 rounded text-white text-sm font-medium">
              {formatDuration(displayDuration)}
            </div>
          )}
        </div>

        {/* Actions bar */}
        <div className="p-4 flex items-center justify-between bg-white border-t">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span>Welcome video uploaded</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Replace
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,video/webm,video/quicktime,video/x-m4v"
          onChange={handleInputChange}
          className="hidden"
        />
      </div>
    );
  }

  // Empty state - upload prompt
  return (
    <div className={cn('space-y-4', className)}>
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'border-2 border-dashed rounded-2xl p-8 cursor-pointer transition-all',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50',
          displayError && 'border-red-300 bg-red-50'
        )}
      >
        <div className="text-center">
          <div className={cn(
            'w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4',
            displayError ? 'bg-red-100' : 'bg-primary/10'
          )}>
            {displayError ? (
              <AlertCircle className="w-8 h-8 text-red-500" />
            ) : (
              <Video className="w-8 h-8 text-primary" />
            )}
          </div>

          <h3 className="font-medium text-gray-900 mb-1">
            {displayError ? 'Upload failed' : 'Add a welcome video'}
          </h3>

          {displayError ? (
            <p className="text-sm text-red-600 mb-4">{displayError}</p>
          ) : (
            <p className="text-sm text-gray-500 mb-4">
              Introduce yourself to potential mentees. Videos help build trust!
            </p>
          )}

          <Button variant="outline" size="sm" className="pointer-events-none">
            <Upload className="w-4 h-4 mr-2" />
            Choose video
          </Button>

          <p className="text-xs text-gray-400 mt-3">
            MP4, WebM, or MOV up to {MAX_FILE_SIZE_MB}MB
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,video/webm,video/quicktime,video/x-m4v"
          onChange={handleInputChange}
          className="hidden"
        />
      </div>

      {/* Tips */}
      <div className="bg-blue-50 rounded-xl p-4">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-blue-900 mb-2">Tips for a great welcome video:</p>
            <ul className="space-y-1 text-blue-700">
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Keep it under 2 minutes (60-90 seconds is ideal)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Share your background and what makes you unique</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Explain how you can help applicants succeed</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Good lighting and clear audio make a big difference</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Compact version for profile cards/previews
 */
export function WelcomeVideoPreview({
  videoUrl,
  thumbnailUrl,
  durationSeconds,
  providerName,
  className,
  onPlay,
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const handlePlayPause = useCallback((e) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
    onPlay?.();
  }, [isPlaying, onPlay]);

  if (!videoUrl) return null;

  return (
    <div className={cn('relative rounded-xl overflow-hidden bg-black', className)}>
      <video
        ref={videoRef}
        src={videoUrl}
        poster={thumbnailUrl}
        className="w-full h-full object-cover"
        onEnded={() => setIsPlaying(false)}
        playsInline
      />

      {/* Play overlay */}
      <button
        onClick={handlePlayPause}
        className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
      >
        {!isPlaying && (
          <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
            <Play className="w-5 h-5 text-gray-900 ml-0.5" />
          </div>
        )}
      </button>

      {/* Video badge */}
      <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 rounded text-white text-xs font-medium flex items-center gap-1">
        <Video className="w-3 h-3" />
        Intro
      </div>

      {/* Duration */}
      {durationSeconds && (
        <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 rounded text-white text-xs">
          {formatDuration(durationSeconds)}
        </div>
      )}
    </div>
  );
}

/**
 * Full-screen video modal for profile page
 */
export function WelcomeVideoModal({
  isOpen,
  onClose,
  videoUrl,
  providerName,
}) {
  const videoRef = useRef(null);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full rounded-xl"
          controls
          autoPlay
        />
        <p className="text-center text-white/80 mt-4">
          Welcome video from {providerName}
        </p>
      </div>
    </div>
  );
}

export default WelcomeVideoUpload;
