/**
 * PhotoUpload Component
 *
 * Photo upload for provider applications with preview and AI tips.
 * Encourages friendly, approachable photos over formal headshots.
 */

import { useState, useRef } from 'react';
import { Camera, Upload, X, Sparkles, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const PHOTO_TIPS = [
  "Smile! Applicants want to see the real you.",
  "Natural lighting works best - near a window is perfect.",
  "A casual, friendly photo works better than a formal headshot.",
  "Show your personality - this is how applicants will find you!"
];

export function PhotoUpload({
  value,
  onChange,
  error,
  disabled = false,
  className
}) {
  const [preview, setPreview] = useState(value || null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
      onChange?.(file);
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    const file = e.dataTransfer.files?.[0];
    handleFileSelect(file);
  };

  const handleRemove = () => {
    setPreview(null);
    onChange?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Upload area */}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative rounded-2xl border-2 border-dashed transition-all cursor-pointer',
          'flex flex-col items-center justify-center p-6',
          isDragging && 'border-primary bg-primary/5',
          error && 'border-red-300 bg-red-50',
          !isDragging && !error && 'border-gray-300 hover:border-primary/50 hover:bg-gray-50',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Profile preview"
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
            />
            {!disabled && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <User className="w-10 h-10 text-gray-400" />
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-primary font-medium mb-1">
                <Camera className="w-5 h-5" />
                <span>Upload your photo</span>
              </div>
              <p className="text-sm text-gray-500">
                Drag and drop or click to browse
              </p>
              <p className="text-xs text-gray-400 mt-1">
                JPG, PNG up to 5MB
              </p>
            </div>
          </>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          disabled={disabled}
          className="hidden"
        />
      </div>

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {/* AI Tips */}
      <div className="bg-purple-50 rounded-xl p-4">
        <div className="flex items-center gap-2 text-purple-700 font-medium mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Photo Tips</span>
        </div>
        <ul className="space-y-1">
          {PHOTO_TIPS.map((tip, idx) => (
            <li key={idx} className="text-sm text-purple-600 flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default PhotoUpload;
