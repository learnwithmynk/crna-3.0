/**
 * DownloadSelector Component
 *
 * Multi-select component for choosing downloads to associate with a lesson.
 * Supports both "include" and "exclude" modes.
 */

import React, { useState, useMemo } from 'react';
import { useDownloads } from '@/hooks/useDownloads';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Loader2,
  Search,
  FileDown,
  ChevronDown,
  ChevronRight,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * DownloadSelector Component
 *
 * @param {Object} props
 * @param {string[]} props.value - Array of selected download IDs
 * @param {Function} props.onChange - Called with updated array when selection changes
 * @param {string} props.mode - 'include' or 'exclude' (affects UI text)
 * @param {string} props.label - Section label
 * @param {string} props.className - Additional CSS classes
 * @param {number} props.maxHeight - Max height for scrollable list (default: 200)
 */
export function DownloadSelector({
  value = [],
  onChange,
  mode = 'include',
  label,
  className,
  maxHeight = 200,
}) {
  const { downloads, isLoading } = useDownloads({ adminMode: true });
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Filter downloads by search
  const filteredDownloads = useMemo(() => {
    if (!searchQuery.trim()) return downloads;

    const query = searchQuery.toLowerCase();
    return downloads.filter(
      (d) =>
        d.title?.toLowerCase().includes(query) ||
        d.slug?.toLowerCase().includes(query)
    );
  }, [downloads, searchQuery]);

  // Get selected downloads info
  const selectedDownloads = useMemo(() => {
    return value
      .map((id) => downloads.find((d) => d.id === id))
      .filter(Boolean);
  }, [value, downloads]);

  const handleToggle = (id) => {
    const newValue = value.includes(id)
      ? value.filter((v) => v !== id)
      : [...value, id];
    onChange(newValue);
  };

  const handleRemove = (id) => {
    onChange(value.filter((v) => v !== id));
  };

  const handleClear = () => {
    onChange([]);
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm">Loading downloads...</span>
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      {/* Selected badges */}
      {selectedDownloads.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedDownloads.map((download) => (
            <Badge
              key={download.id}
              variant={mode === 'exclude' ? 'destructive' : 'secondary'}
              className="flex items-center gap-1 pr-1"
            >
              <FileDown className="w-3 h-3" />
              <span className="max-w-[150px] truncate">{download.title}</span>
              <button
                onClick={() => handleRemove(download.id)}
                className="ml-1 hover:bg-black/10 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          {selectedDownloads.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-6 px-2 text-xs"
            >
              Clear all
            </Button>
          )}
        </div>
      )}

      {/* Collapsible selector */}
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-between"
          >
            <span className="flex items-center gap-2">
              <FileDown className="w-4 h-4" />
              {label || (mode === 'exclude' ? 'Exclude downloads' : 'Add downloads')}
              {value.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {value.length}
                </Badge>
              )}
            </span>
            {isOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent className="mt-2">
          <div className="border rounded-lg p-3 space-y-3 bg-gray-50">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search downloads..."
                className="pl-8 h-8"
              />
            </div>

            {/* Download list */}
            <div
              className="space-y-1 overflow-y-auto"
              style={{ maxHeight }}
            >
              {filteredDownloads.length === 0 ? (
                <p className="text-sm text-gray-500 italic py-2 text-center">
                  {searchQuery ? 'No downloads match your search' : 'No downloads available'}
                </p>
              ) : (
                filteredDownloads.map((download) => (
                  <div
                    key={download.id}
                    className={cn(
                      'flex items-center gap-2 p-2 rounded hover:bg-white cursor-pointer',
                      value.includes(download.id) && 'bg-white'
                    )}
                    onClick={() => handleToggle(download.id)}
                  >
                    <Checkbox
                      checked={value.includes(download.id)}
                      onCheckedChange={() => handleToggle(download.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {download.title}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {download.slug}
                      </p>
                    </div>
                    {download.file_type && (
                      <Badge variant="outline" className="text-xs shrink-0">
                        {download.file_type}
                      </Badge>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Count */}
            <p className="text-xs text-gray-500 text-right">
              {filteredDownloads.length} download{filteredDownloads.length !== 1 ? 's' : ''}
              {value.length > 0 && ` · ${value.length} selected`}
            </p>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

export default DownloadSelector;
