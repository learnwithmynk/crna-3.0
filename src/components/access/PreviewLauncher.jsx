/**
 * PreviewLauncher Component
 *
 * Modal/dialog for launching preview mode to test access control.
 * Allows admins to quickly select entitlements and preview the app
 * as different user types (Free, Trial, Member, etc.).
 *
 * Features:
 * - Quick presets (Free User, Trial, Basic Member, Premium)
 * - Checkbox list for granular entitlement selection
 * - Visual preview of what will be tested
 *
 * Props:
 * - open: boolean - Whether the dialog is open
 * - onOpenChange: (open: boolean) => void - Callback when open state changes
 * - entitlements: Array - List of available entitlements from useEntitlements()
 */

import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { usePreviewMode } from '@/hooks/usePreviewMode';
import { Eye, EyeOff, Sparkles, User, UserCheck, Crown } from 'lucide-react';

// Quick preset configurations
const PRESETS = [
  {
    id: 'free',
    label: 'Free User',
    description: 'No entitlements (paywalled/blurred preview)',
    icon: User,
    entitlements: [],
  },
  {
    id: 'trial',
    label: 'Trial User',
    description: '7-day trial with full access',
    icon: Sparkles,
    entitlements: ['trial_access'],
  },
  {
    id: 'basic',
    label: 'Basic Member',
    description: 'Active membership ($27/mo)',
    icon: UserCheck,
    entitlements: ['active_membership'],
  },
  {
    id: 'premium',
    label: 'Premium Member',
    description: 'All entitlements (testing)',
    icon: Crown,
    entitlements: 'all', // Special case: all available entitlements
  },
];

export function PreviewLauncher({ open, onOpenChange, entitlements = [] }) {
  const { startPreview, isPreviewMode, previewEntitlements } = usePreviewMode();

  // Selected entitlements state
  const [selectedEntitlements, setSelectedEntitlements] = useState(
    isPreviewMode ? previewEntitlements : []
  );

  // Get all entitlement slugs for "Premium" preset
  const allEntitlementSlugs = useMemo(() => {
    return entitlements.map((e) => e.slug || e.value);
  }, [entitlements]);

  /**
   * Handle preset selection
   */
  const handlePresetClick = (preset) => {
    if (preset.entitlements === 'all') {
      setSelectedEntitlements(allEntitlementSlugs);
    } else {
      setSelectedEntitlements(preset.entitlements);
    }
  };

  /**
   * Toggle individual entitlement checkbox
   */
  const handleToggleEntitlement = (entitlementSlug) => {
    setSelectedEntitlements((prev) => {
      if (prev.includes(entitlementSlug)) {
        return prev.filter((slug) => slug !== entitlementSlug);
      } else {
        return [...prev, entitlementSlug];
      }
    });
  };

  /**
   * Launch preview mode with selected entitlements
   */
  const handleLaunchPreview = () => {
    startPreview(selectedEntitlements);
    onOpenChange(false);
  };

  /**
   * Check if preset is currently selected
   */
  const isPresetActive = (preset) => {
    if (preset.entitlements === 'all') {
      return selectedEntitlements.length === allEntitlementSlugs.length &&
        allEntitlementSlugs.every((slug) => selectedEntitlements.includes(slug));
    }
    return preset.entitlements.length === selectedEntitlements.length &&
      preset.entitlements.every((slug) => selectedEntitlements.includes(slug));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-purple-500" />
            Launch Preview Mode
          </DialogTitle>
          <DialogDescription>
            Test access control by previewing the app with different entitlements.
            Your changes won't affect real data.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Quick Presets */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Presets</h3>
            <div className="grid grid-cols-2 gap-3">
              {PRESETS.map((preset) => {
                const Icon = preset.icon;
                const isActive = isPresetActive(preset);

                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handlePresetClick(preset)}
                    className={`
                      flex items-start gap-3 p-4 rounded-2xl border-2 text-left
                      transition-all duration-200
                      ${isActive
                        ? 'border-purple-300 bg-purple-50/50 shadow-soft'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className={`
                      p-2 rounded-xl
                      ${isActive ? 'bg-purple-100' : 'bg-gray-100'}
                    `}>
                      <Icon className={`h-4 w-4 ${isActive ? 'text-purple-600' : 'text-gray-600'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-900">
                        {preset.label}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {preset.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Selection */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Custom Entitlements
            </h3>
            <div className="bg-gray-50 rounded-2xl p-4 space-y-3 max-h-[240px] overflow-y-auto">
              {entitlements.length === 0 ? (
                <div className="text-sm text-gray-500 text-center py-8">
                  No entitlements available. Connect to Supabase to load entitlements.
                </div>
              ) : (
                entitlements.map((entitlement) => {
                  const slug = entitlement.slug || entitlement.value;
                  const label = entitlement.display_name || entitlement.label || slug;
                  const description = entitlement.description;
                  const isChecked = selectedEntitlements.includes(slug);

                  return (
                    <div
                      key={slug}
                      className="flex items-start gap-3 p-3 bg-white rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <Checkbox
                        id={`entitlement-${slug}`}
                        checked={isChecked}
                        onCheckedChange={() => handleToggleEntitlement(slug)}
                        className="mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <Label
                          htmlFor={`entitlement-${slug}`}
                          className="text-sm font-medium text-gray-900 cursor-pointer"
                        >
                          {label}
                        </Label>
                        {description && (
                          <div className="text-xs text-gray-500 mt-0.5">
                            {description}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Preview Summary */}
          {selectedEntitlements.length > 0 && (
            <div className="bg-purple-50 rounded-2xl p-4 border border-purple-200">
              <div className="flex items-start gap-3">
                <Eye className="h-4 w-4 text-purple-600 mt-0.5" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-purple-900">
                    Preview Summary
                  </div>
                  <div className="text-xs text-purple-700 mt-1">
                    You'll see the app with{' '}
                    <span className="font-semibold">
                      {selectedEntitlements.length} entitlement
                      {selectedEntitlements.length !== 1 ? 's' : ''}
                    </span>
                    : {selectedEntitlements.join(', ')}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleLaunchPreview}
            className="gap-2"
          >
            {selectedEntitlements.length === 0 ? (
              <>
                <EyeOff className="h-4 w-4" />
                Preview as Free User
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                Launch Preview
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
