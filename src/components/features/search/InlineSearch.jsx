/**
 * InlineSearch Component
 *
 * A search input component for filtering content on a page.
 * Features debounced search, clear button, and optional filter count.
 *
 * Used in: LearningLibraryPage, SchoolDatabasePage, etc.
 */

import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * @param {Object} props
 * @param {string} props.value - Current search value (controlled)
 * @param {Function} props.onChange - Callback when search value changes
 * @param {string} props.placeholder - Placeholder text
 * @param {number} props.debounceMs - Debounce delay in ms (default: 300)
 * @param {string} props.className - Additional classes
 * @param {boolean} props.autoFocus - Auto focus on mount
 */
export function InlineSearch({
  value = '',
  onChange,
  placeholder = 'Search...',
  debounceMs = 300,
  className,
  autoFocus = false,
}) {
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  // Sync local value when external value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Handle input change with debounce
  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);

    // Clear existing timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set new timeout for debounced callback
    debounceRef.current = setTimeout(() => {
      onChange?.(newValue);
    }, debounceMs);
  };

  // Handle clear button
  const handleClear = () => {
    setLocalValue('');
    onChange?.('');
    inputRef.current?.focus();
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className={cn('relative', className)}>
      {/* Search icon */}
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />

      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        value={localValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={cn(
          'w-full h-11 pl-10 pr-10 rounded-xl border border-gray-300 bg-white',
          'text-sm placeholder:text-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
          'min-h-[44px]' // Touch target minimum
        )}
      />

      {/* Clear button */}
      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Clear search"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      )}
    </div>
  );
}

/**
 * InlineSearchWithFilters - Search with filter dropdown/buttons
 *
 * Extended version with integrated filter controls.
 */
export function InlineSearchWithFilters({
  value = '',
  onChange,
  placeholder = 'Search...',
  debounceMs = 300,
  className,
  filterCount = 0,
  onFilterClick,
  children,
}) {
  return (
    <div className={cn('flex flex-col sm:flex-row gap-3', className)}>
      <InlineSearch
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        debounceMs={debounceMs}
        className="flex-1"
      />
      {children}
      {onFilterClick && (
        <button
          type="button"
          onClick={onFilterClick}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-xl border min-h-[44px]',
            'text-sm font-medium transition-colors',
            filterCount > 0
              ? 'border-primary bg-primary/10 text-gray-900'
              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
          )}
        >
          Filters
          {filterCount > 0 && (
            <span className="bg-primary text-black text-xs font-semibold px-2 py-0.5 rounded-full">
              {filterCount}
            </span>
          )}
        </button>
      )}
    </div>
  );
}

export default InlineSearch;
