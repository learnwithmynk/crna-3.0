/**
 * PreviewModeIndicator Component
 *
 * Banner that appears when in preview mode.
 * Shows which entitlements are active and provides exit button.
 *
 * Usage:
 * Place in your main layout (e.g., PageWrapper) to show when preview is active.
 */

import { usePreviewMode } from '@/hooks/usePreviewMode';
import { Button } from '@/components/ui/button';
import { Eye, X } from 'lucide-react';

export function PreviewModeIndicator() {
  const { isPreviewMode, previewEntitlements, exitPreview } = usePreviewMode();

  if (!isPreviewMode) {
    return null;
  }

  return (
    <div className="sticky top-0 z-50 bg-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Eye className="h-5 w-5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm">
                Preview Mode Active
              </div>
              <div className="text-xs opacity-90 mt-0.5">
                {previewEntitlements.length === 0 ? (
                  'Viewing as Free User (no entitlements)'
                ) : (
                  <>
                    Viewing with: {previewEntitlements.join(', ')}
                  </>
                )}
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={exitPreview}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 flex-shrink-0"
          >
            <X className="h-4 w-4 mr-2" />
            Exit Preview
          </Button>
        </div>
      </div>
    </div>
  );
}
