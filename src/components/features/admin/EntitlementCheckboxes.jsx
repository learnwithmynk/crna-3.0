/**
 * EntitlementCheckboxes Component
 *
 * Reusable checkbox group for selecting entitlements (access control).
 * Used in ModuleForm and LessonForm.
 */

import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useEntitlements } from '@/hooks/useEntitlements';
import { Loader2, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * EntitlementCheckboxes Component
 *
 * @param {Object} props
 * @param {string[]} props.value - Array of selected entitlement slugs
 * @param {Function} props.onChange - Called with updated array when selection changes
 * @param {boolean} props.allowInherit - Show "inherit from module" option (for lessons)
 * @param {boolean} props.inheritChecked - Whether inherit is checked
 * @param {Function} props.onInheritChange - Called when inherit checkbox changes
 * @param {string} props.className - Additional CSS classes
 */
export function EntitlementCheckboxes({
  value = [],
  onChange,
  allowInherit = false,
  inheritChecked = false,
  onInheritChange,
  className,
}) {
  const { entitlements, isLoading } = useEntitlements();

  const handleToggle = (slug) => {
    if (inheritChecked) return; // Disabled when inheriting

    const newValue = value.includes(slug)
      ? value.filter((s) => s !== slug)
      : [...value, slug];

    onChange(newValue);
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm">Loading entitlements...</span>
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Inherit from module option */}
      {allowInherit && (
        <div className="flex items-center gap-2 pb-3 border-b">
          <Checkbox
            id="inherit-entitlements"
            checked={inheritChecked}
            onCheckedChange={onInheritChange}
          />
          <Label
            htmlFor="inherit-entitlements"
            className="text-sm font-medium cursor-pointer"
          >
            Inherit from module
          </Label>
          <span className="text-xs text-gray-500">
            (Use module's access settings)
          </span>
        </div>
      )}

      {/* Entitlement checkboxes */}
      <div
        className={cn(
          'grid gap-2',
          inheritChecked && 'opacity-50 pointer-events-none'
        )}
      >
        {entitlements.length === 0 ? (
          <p className="text-sm text-gray-500 italic">
            No entitlements available
          </p>
        ) : (
          entitlements.map((entitlement) => (
            <div
              key={entitlement.slug}
              className="flex items-center gap-2"
            >
              <Checkbox
                id={`entitlement-${entitlement.slug}`}
                checked={value.includes(entitlement.slug)}
                onCheckedChange={() => handleToggle(entitlement.slug)}
                disabled={inheritChecked}
              />
              <Label
                htmlFor={`entitlement-${entitlement.slug}`}
                className="flex items-center gap-2 text-sm cursor-pointer"
              >
                <Shield className="w-3 h-3 text-gray-400" />
                {entitlement.display_name}
              </Label>
            </div>
          ))
        )}
      </div>

      {/* Help text */}
      {value.length === 0 && !inheritChecked && (
        <p className="text-xs text-amber-600">
          No entitlements selected - content will be publicly accessible
        </p>
      )}
    </div>
  );
}

export default EntitlementCheckboxes;
