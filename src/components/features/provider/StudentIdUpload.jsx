/**
 * StudentIdUpload Component
 *
 * File upload for student ID verification.
 * Accepts images and PDFs.
 */

import { useState, useRef } from 'react';
import { Upload, FileText, Image, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ACCEPTED_TYPES = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'application/pdf': '.pdf'
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function StudentIdUpload({
  value,
  onChange,
  error,
  disabled = false,
  className
}) {
  const [file, setFile] = useState(value || null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;

    // Validate file type
    if (!Object.keys(ACCEPTED_TYPES).includes(selectedFile.type)) {
      return;
    }

    // Validate file size
    if (selectedFile.size > MAX_FILE_SIZE) {
      return;
    }

    setFile(selectedFile);

    // Create preview for images
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }

    onChange?.(selectedFile);
  };

  const handleInputChange = (e) => {
    const selectedFile = e.target.files?.[0];
    handleFileSelect(selectedFile);
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

    const selectedFile = e.dataTransfer.files?.[0];
    handleFileSelect(selectedFile);
  };

  const handleRemove = () => {
    setFile(null);
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

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className={cn('space-y-3', className)}>
      {/* Upload area */}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative rounded-xl border-2 border-dashed transition-all cursor-pointer',
          'flex flex-col items-center justify-center p-6',
          isDragging && 'border-primary bg-primary/5',
          error && 'border-red-300 bg-red-50',
          !isDragging && !error && 'border-gray-300 hover:border-primary/50 hover:bg-gray-50',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        {file ? (
          <div className="flex items-center gap-4 w-full">
            {/* Preview or icon */}
            {preview ? (
              <img
                src={preview}
                alt="Student ID preview"
                className="w-16 h-16 rounded object-cover border"
              />
            ) : (
              <div className="w-16 h-16 rounded bg-gray-100 flex items-center justify-center">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
            )}

            {/* File info */}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{file.name}</p>
              <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
              <div className="flex items-center gap-1 text-green-600 text-sm mt-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Ready to upload</span>
              </div>
            </div>

            {/* Remove button */}
            {!disabled && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="w-8 h-8 text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <Upload className="w-6 h-6 text-gray-400" />
            </div>
            <div className="text-center">
              <p className="font-medium text-gray-700 mb-1">
                Upload your student ID
              </p>
              <p className="text-sm text-gray-500">
                Drag and drop or click to browse
              </p>
              <p className="text-xs text-gray-400 mt-2">
                JPG, PNG, or PDF up to 10MB
              </p>
            </div>
          </>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept={Object.values(ACCEPTED_TYPES).join(',')}
          onChange={handleInputChange}
          disabled={disabled}
          className="hidden"
        />
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Info note */}
      <p className="text-xs text-gray-500">
        Your student ID is used to verify your enrollment in a CRNA program.
        It will be reviewed by our team and kept confidential.
      </p>
    </div>
  );
}

export default StudentIdUpload;
