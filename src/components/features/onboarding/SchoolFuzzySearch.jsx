/**
 * SchoolFuzzySearch
 *
 * Multi-select fuzzy search for CRNA programs.
 * Uses Fuse.js for fast, typo-tolerant searching.
 */

import { useState, useMemo, useRef, useEffect } from 'react';
import Fuse from 'fuse.js';
import { Search, X, Check, GraduationCap } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { schools } from '@/data/supabase/schools';

// Configure Fuse.js for fuzzy matching
const fuseOptions = {
  keys: [
    { name: 'name', weight: 0.6 },
    { name: 'city', weight: 0.2 },
    { name: 'state', weight: 0.2 },
  ],
  threshold: 0.4, // 0 = exact match, 1 = match anything
  includeScore: true,
  minMatchCharLength: 2,
};

export default function SchoolFuzzySearch({
  selectedSchools = [],
  onSelectionChange,
  maxSelections = 10,
  placeholder = 'Search schools by name, city, or state...',
  twoTierSelection = false, // If true, shows "Definitely" vs "Interested" options
  className,
}) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Initialize Fuse search
  const fuse = useMemo(() => new Fuse(schools, fuseOptions), []);

  // Search results
  const results = useMemo(() => {
    if (!query.trim()) {
      // Show popular schools when no query
      return schools.slice(0, 10);
    }
    return fuse.search(query).slice(0, 20).map((r) => r.item);
  }, [query, fuse]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !inputRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle school selection
  const handleSelect = (school, tier = 'interested') => {
    const isSelected = selectedSchools.some((s) =>
      typeof s === 'object' ? s.id === school.id : s === school.id
    );

    if (isSelected) {
      // Remove
      onSelectionChange(
        selectedSchools.filter((s) =>
          typeof s === 'object' ? s.id !== school.id : s !== school.id
        )
      );
    } else if (selectedSchools.length < maxSelections) {
      // Add
      if (twoTierSelection) {
        onSelectionChange([...selectedSchools, { id: school.id, tier }]);
      } else {
        onSelectionChange([...selectedSchools, school.id]);
      }
    }
  };

  // Get selected school IDs for checking
  const selectedIds = selectedSchools.map((s) =>
    typeof s === 'object' ? s.id : s
  );

  // Get full school objects for selected items
  const selectedSchoolObjects = selectedSchools
    .map((s) => {
      const id = typeof s === 'object' ? s.id : s;
      const school = schools.find((sch) => sch.id === id);
      if (!school) return null;
      return {
        ...school,
        tier: typeof s === 'object' ? s.tier : 'interested',
      };
    })
    .filter(Boolean);

  return (
    <div className={cn('relative', className)}>
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="pl-10 h-12 text-base"
        />
      </div>

      {/* Dropdown results */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className={cn(
            'absolute z-50 w-full mt-2 bg-white rounded-2xl border border-gray-200 shadow-lg',
            'max-h-64 overflow-y-auto'
          )}
        >
          {results.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              No schools found. Try a different search term.
            </div>
          ) : (
            <div className="py-2">
              {!query && (
                <div className="px-3 py-1 text-xs text-gray-500 font-medium uppercase">
                  Popular Schools
                </div>
              )}
              {results.map((school) => {
                const isSelected = selectedIds.includes(school.id);

                return (
                  <button
                    key={school.id}
                    onClick={() => handleSelect(school)}
                    disabled={!isSelected && selectedSchools.length >= maxSelections}
                    className={cn(
                      'w-full px-3 py-2.5 flex items-center gap-3 text-left',
                      'transition-colors',
                      isSelected
                        ? 'bg-yellow-50'
                        : 'hover:bg-gray-50',
                      !isSelected &&
                        selectedSchools.length >= maxSelections &&
                        'opacity-50 cursor-not-allowed'
                    )}
                  >
                    <div
                      className={cn(
                        'w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0',
                        isSelected ? 'bg-yellow-400' : 'border-2 border-gray-300'
                      )}
                    >
                      {isSelected && <Check className="h-3 w-3 text-black" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {school.name}
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        {school.city}, {school.state}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Selected schools pills */}
      {selectedSchoolObjects.length > 0 && (
        <div className="mt-4">
          <div className="text-sm text-gray-600 mb-2">
            Selected ({selectedSchoolObjects.length}/{maxSelections})
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedSchoolObjects.map((school) => (
              <div
                key={school.id}
                className={cn(
                  'inline-flex items-center gap-2 px-3 py-1.5 rounded-full',
                  'bg-yellow-100 text-yellow-800',
                  'text-sm'
                )}
              >
                <GraduationCap className="h-3.5 w-3.5" />
                <span className="truncate max-w-[150px]">{school.name}</span>
                <button
                  onClick={() => handleSelect(school)}
                  className="ml-1 p-0.5 hover:bg-yellow-200 rounded-full transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
