/**
 * ProgramDocumentsTab - Document management for a program
 *
 * Features:
 * - Drag-and-drop upload area
 * - Upload documents (mock - shows file picker)
 * - List documents by type
 * - Document cards with name, type, date, actions
 */

import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Upload,
  FileText,
  Download,
  Trash2,
  File,
  FileCheck,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDateFull } from '@/lib/dateFormatters';

const DOCUMENT_TYPES = [
  { value: 'transcript', label: 'Transcript', icon: FileText },
  { value: 'resume', label: 'Resume/CV', icon: FileCheck },
  { value: 'personal_statement', label: 'Personal Statement', icon: File },
  { value: 'essay', label: 'Essay', icon: File },
  { value: 'certification', label: 'Certification', icon: FileCheck },
  { value: 'other', label: 'Other', icon: File },
];

// formatDate moved to @/lib/dateFormatters (use formatDateFull with '' fallback)

/**
 * Get document type info
 */
function getDocTypeInfo(type) {
  return DOCUMENT_TYPES.find(t => t.value === type) || DOCUMENT_TYPES[DOCUMENT_TYPES.length - 1];
}

/**
 * Format file size
 */
function formatFileSize(bytes) {
  if (!bytes) return '';
  const kb = bytes / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
}

/**
 * Document Card Component
 */
function DocumentCard({ document, onDelete }) {
  const typeInfo = getDocTypeInfo(document.type);
  const TypeIcon = typeInfo.icon;

  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
          <TypeIcon className="w-5 h-5 text-gray-500" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 truncate text-sm">
            {document.name}
          </h4>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className="text-xs">
              {typeInfo.label}
            </Badge>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDateFull(document.uploadedAt, '')}
            </span>
            {document.size && (
              <span className="text-xs text-gray-400">
                {formatFileSize(document.size)}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-0">
          <button
            className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Download"
            aria-label={`Download ${document.name}`}
            onClick={() => {
              // TODO: Implement download
              console.log('Download:', document.id);
            }}
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(document.id)}
            className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Delete"
            aria-label={`Delete ${document.name}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Card>
  );
}

export function ProgramDocumentsTab({ documents = [], programId, onUpdate }) {
  const [selectedType, setSelectedType] = useState('personal_statement');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = useCallback((file) => {
    if (!file) return;

    // Mock upload - in production this would upload to server
    const newDocument = {
      id: `doc_${Date.now()}`,
      name: file.name,
      type: selectedType,
      uploadedAt: new Date().toISOString(),
      size: file.size
    };

    onUpdate([...documents, newDocument]);
  }, [selectedType, documents, onUpdate]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
    // Reset file input
    e.target.value = '';
  };

  // Drag and drop handlers
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set to false if we're leaving the dropzone entirely
    if (dropZoneRef.current && !dropZoneRef.current.contains(e.relatedTarget)) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      // Check file type
      const validTypes = ['.pdf', '.doc', '.docx', '.txt'];
      const ext = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
      if (validTypes.includes(ext)) {
        handleFileUpload(file);
      } else {
        // Could show an error toast here
        console.warn('Invalid file type. Please upload PDF, DOC, DOCX, or TXT files.');
      }
    }
  }, [handleFileUpload]);

  const handleDelete = (docId) => {
    onUpdate(documents.filter(d => d.id !== docId));
  };

  // Group documents by type
  const documentsByType = documents.reduce((acc, doc) => {
    const type = doc.type || 'other';
    if (!acc[type]) acc[type] = [];
    acc[type].push(doc);
    return acc;
  }, {});

  // Drag and drop zone component
  const DropZone = ({ isCompact = false }) => (
    <div
      ref={dropZoneRef}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={cn(
        "border-2 border-dashed rounded-xl transition-all",
        isDragging
          ? "border-primary bg-primary/5 scale-[1.02]"
          : "border-gray-200 hover:border-gray-300",
        isCompact ? "p-4" : "p-6"
      )}
    >
      <div className={cn("text-center", isCompact && "flex items-center justify-center gap-4")}>
        <Upload className={cn(
          "text-gray-400 mx-auto",
          isCompact ? "w-6 h-6" : "w-8 h-8 mb-3",
          isDragging && "text-primary"
        )} />
        <div className={cn(!isCompact && "mb-3")}>
          <p className={cn(
            "text-gray-600",
            isCompact ? "text-sm" : "text-sm mb-1"
          )}>
            {isDragging ? (
              <span className="text-primary font-medium">Drop file here</span>
            ) : (
              <>Drag and drop or <span className="text-primary cursor-pointer" onClick={handleUploadClick}>browse</span></>
            )}
          </p>
          {!isCompact && (
            <p className="text-xs text-gray-400">PDF, DOC, DOCX, or TXT (max 10MB)</p>
          )}
        </div>
        {!isDragging && (
          <div className={cn(
            "flex items-center gap-2",
            isCompact ? "" : "justify-center"
          )}>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DOCUMENT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleUploadClick}>
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
          </div>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".pdf,.doc,.docx,.txt"
        onChange={handleFileChange}
      />
    </div>
  );

  if (documents.length === 0) {
    return (
      <div className="space-y-4">
        <EmptyState
          icon={FileText}
          title="No documents uploaded"
          description="Upload your application documents like transcripts, resume, and personal statement."
        />
        <DropZone />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Drag and Drop Upload Zone */}
      <DropZone isCompact />

      {/* Documents by Type */}
      {DOCUMENT_TYPES.map((type) => {
        const typeDocs = documentsByType[type.value];
        if (!typeDocs || typeDocs.length === 0) return null;

        return (
          <div key={type.value}>
            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <type.icon className="w-4 h-4" />
              {type.label}
              <span className="text-gray-400">({typeDocs.length})</span>
            </h4>
            <div className="space-y-2">
              {typeDocs.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
