/**
 * PreviewModeBanner Component
 *
 * Fixed banner at top when admin is in preview mode.
 * Shows which entitlements are being simulated.
 * Provides buttons to change settings or exit preview mode.
 */

import { useState } from 'react';
import { usePreviewMode } from '@/hooks/usePreviewMode';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Settings, Eye } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

// Common entitlements for preview mode
const COMMON_ENTITLEMENTS = [
  { slug: 'active_membership', label: 'Active Membership' },
  { slug: 'trial_access', label: 'Trial Access' },
  { slug: 'founding_member', label: 'Founding Member' },
  { slug: 'plan_apply_toolkit', label: 'Plan + Apply Toolkit' },
  { slug: 'interviewing_toolkit', label: 'Interviewing Toolkit' },
];

export function PreviewModeBanner() {
  const { user } = useAuth();
  const { isPreviewMode, previewEntitlements, exitPreview, startPreview } = usePreviewMode();
  const [showSettings, setShowSettings] = useState(false);
  const [selectedEntitlements, setSelectedEntitlements] = useState(previewEntitlements);

  // Only show for admins
  const isAdmin = user?.role === 'admin' || user?.app_metadata?.role === 'admin';

  if (!isAdmin || !isPreviewMode) {
    return null;
  }

  const handleToggleEntitlement = (slug) => {
    setSelectedEntitlements(prev =>
      prev.includes(slug)
        ? prev.filter(e => e !== slug)
        : [...prev, slug]
    );
  };

  const handleSaveSettings = () => {
    startPreview(selectedEntitlements);
    setShowSettings(false);
  };

  return (
    <>
      {/* Fixed banner at top of viewport */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-400 border-b-2 border-yellow-600 shadow-lg">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-yellow-900" />
              <div>
                <p className="font-semibold text-sm text-yellow-900">
                  Preview Mode Active
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {previewEntitlements.length === 0 ? (
                    <Badge variant="outline" className="bg-white">
                      No Entitlements (Free User)
                    </Badge>
                  ) : (
                    previewEntitlements.map(slug => (
                      <Badge key={slug} variant="outline" className="bg-white text-xs">
                        {COMMON_ENTITLEMENTS.find(e => e.slug === slug)?.label || slug}
                      </Badge>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="bg-white hover:bg-gray-50"
                onClick={() => setShowSettings(true)}
              >
                <Settings className="w-4 h-4 mr-1" />
                Change
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="bg-white hover:bg-gray-50"
                onClick={exitPreview}
              >
                <X className="w-4 h-4 mr-1" />
                Exit Preview
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer to prevent content from being hidden under banner */}
      <div className="h-16" aria-hidden="true" />

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Preview Mode Settings</DialogTitle>
            <DialogDescription>
              Select which entitlements to simulate. This allows you to see the app as different user types.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-3">
              {COMMON_ENTITLEMENTS.map(({ slug, label }) => (
                <div key={slug} className="flex items-center space-x-2">
                  <Checkbox
                    id={slug}
                    checked={selectedEntitlements.includes(slug)}
                    onCheckedChange={() => handleToggleEntitlement(slug)}
                  />
                  <Label
                    htmlFor={slug}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {label}
                  </Label>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t">
              <p className="text-xs text-gray-500">
                Tip: Uncheck all to preview as a free user with no access.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSettings(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSettings}>
              Apply Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default PreviewModeBanner;
