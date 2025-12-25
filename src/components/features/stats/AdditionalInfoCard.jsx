/**
 * Additional Information Card
 *
 * Compact card for displaying "Additional Information" field
 * that can be shown on the main stats page.
 * Links to Notes for editing.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Pencil, Globe, Save, X } from 'lucide-react';

export function AdditionalInfoCard({
  additionalInfo,
  onSave,
  isEditable = true,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(additionalInfo || '');

  const handleSave = () => {
    onSave?.(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(additionalInfo || '');
    setIsEditing(false);
  };

  // Empty state
  if (!additionalInfo && !isEditing) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="w-4 h-4" />
              Additional Information
            </CardTitle>
            <span className="flex items-center gap-1 text-[10px] text-blue-600">
              <Globe className="w-3 h-3" />
              Public
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-gray-500 text-sm">
            <FileText className="w-6 h-6 mx-auto mb-2 text-gray-300" />
            <p className="text-xs">Share anything else mentors should know</p>
            {isEditable && (
              <Button
                size="sm"
                variant="outline"
                className="mt-2"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="w-3 h-3 mr-1" />
                Add Info
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Editing state
  if (isEditing) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="w-4 h-4" />
              Additional Information
            </CardTitle>
            <span className="flex items-center gap-1 text-[10px] text-blue-600">
              <Globe className="w-3 h-3" />
              Public
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            placeholder="Add any information you'd like mentors and admins to know about you that isn't captured in other sections..."
            className="w-full min-h-[80px] p-2 border rounded-xl text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/20"
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="outline" onClick={handleCancel}>
              <X className="w-3 h-3 mr-1" />
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="w-3 h-3 mr-1" />
              Save
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Display state
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="w-4 h-4" />
            Additional Information
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[10px] text-blue-600">
              <Globe className="w-3 h-3" />
              Public
            </span>
            {isEditable && (
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <Pencil className="w-3.5 h-3.5 text-gray-400" />
              </button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
          {additionalInfo}
        </p>
      </CardContent>
    </Card>
  );
}

export default AdditionalInfoCard;
