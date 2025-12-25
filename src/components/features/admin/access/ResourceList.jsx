/**
 * ResourceList
 *
 * Table/list of resources with columns: checkbox, status indicator, name, type, entitlements, actions.
 * Click row to edit. Status indicators: green (protected), blue (public), red (no rules).
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Circle } from 'lucide-react';
import { useEntitlements } from '@/hooks/useEntitlements';

function ResourceRow({ resource, isSelected, onSelect, onEdit }) {
  const { getEntitlementNames } = useEntitlements();

  // Determine status indicator
  const getStatusIndicator = () => {
    if (resource.isPublic) {
      return <Circle className="w-3 h-3 fill-blue-500 text-blue-500" />;
    } else if (resource.hasRules) {
      return <Circle className="w-3 h-3 fill-green-500 text-green-500" />;
    } else {
      return <Circle className="w-3 h-3 fill-red-500 text-red-500" />;
    }
  };

  const getStatusText = () => {
    if (resource.isPublic) return 'Public';
    if (resource.hasRules) return 'Protected';
    return 'No Rules';
  };

  const entitlementNames = resource.accessible_via && resource.accessible_via.length > 0
    ? getEntitlementNames(resource.accessible_via)
    : [];

  return (
    <div
      className="flex items-center gap-4 p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors group cursor-pointer"
      onClick={(e) => {
        // Don't trigger row click if checkbox or edit button was clicked
        if (e.target.closest('[data-prevent-row-click]')) return;
        onEdit(resource);
      }}
    >
      {/* Checkbox */}
      <div data-prevent-row-click onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={isSelected}
          onCheckedChange={onSelect}
        />
      </div>

      {/* Status Indicator */}
      <div className="shrink-0 flex items-center gap-2">
        {getStatusIndicator()}
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">{resource.name}</p>
        <p className="text-sm text-gray-500">
          {resource.type === 'module' ? 'Module' : resource.type === 'lesson' ? 'Lesson' : 'Download'} • {resource.status}
        </p>
      </div>

      {/* Type Badge */}
      <div className="shrink-0">
        <Badge variant="secondary" className="capitalize">
          {resource.type}
        </Badge>
      </div>

      {/* Entitlements */}
      <div className="shrink-0 w-48">
        {resource.isPublic ? (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Public Access
          </Badge>
        ) : entitlementNames.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {entitlementNames.slice(0, 2).map((name, idx) => (
              <Badge key={idx} variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                {name}
              </Badge>
            ))}
            {entitlementNames.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{entitlementNames.length - 2}
              </Badge>
            )}
          </div>
        ) : (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            None
          </Badge>
        )}
      </div>

      {/* Status Text */}
      <div className="shrink-0 w-24">
        <span className={`text-sm font-medium ${
          resource.isPublic ? 'text-blue-600' :
          resource.hasRules ? 'text-green-600' :
          'text-red-600'
        }`}>
          {getStatusText()}
        </span>
      </div>

      {/* Actions */}
      <div
        data-prevent-row-click
        className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(resource)}
          className="h-8 w-8 p-0"
        >
          <Edit className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

export function ResourceList({ resources, selectedIds, onSelect, onSelectAll, onEdit }) {
  const allSelected = resources.length > 0 && selectedIds.length === resources.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < resources.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Resources ({resources.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {resources.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-gray-500">No resources found</p>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="flex items-center gap-4 px-4 py-3 bg-gray-50 border-b text-sm font-medium text-gray-600">
              <div data-prevent-row-click onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={onSelectAll}
                  className={someSelected ? 'data-[state=checked]:bg-gray-400' : ''}
                />
              </div>
              <div className="shrink-0 w-3"></div>
              <div className="flex-1">Name</div>
              <div className="shrink-0">Type</div>
              <div className="shrink-0 w-48">Entitlements</div>
              <div className="shrink-0 w-24">Status</div>
              <div className="shrink-0 w-8"></div>
            </div>

            {/* Rows */}
            {resources.map((resource) => (
              <ResourceRow
                key={resource.id}
                resource={resource}
                isSelected={selectedIds.includes(resource.id)}
                onSelect={(checked) => onSelect(resource.id, checked)}
                onEdit={onEdit}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ResourceList;
