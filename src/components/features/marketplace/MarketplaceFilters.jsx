/**
 * MarketplaceFilters Component
 *
 * Filter sidebar/panel for the marketplace browse page.
 * Supports filtering by service type, program, price range, rating, availability.
 */

import { useState } from 'react';
import { X, Filter, ChevronDown, ChevronUp, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const SERVICE_TYPES = [
  { value: 'mock_interview', label: 'Mock Interview' },
  { value: 'essay_review', label: 'Essay Review' },
  { value: 'strategy_session', label: 'Coaching/Strategy' },
  { value: 'school_qa', label: 'Q&A Call' }
];

const ICU_TYPES = [
  { value: 'MICU', label: 'Medical ICU' },
  { value: 'SICU', label: 'Surgical ICU' },
  { value: 'CVICU', label: 'Cardiovascular ICU' },
  { value: 'CTICU', label: 'Cardiothoracic ICU' },
  { value: 'Neuro ICU', label: 'Neuro ICU' },
  { value: 'Trauma ICU', label: 'Trauma ICU' },
  { value: 'PICU', label: 'Pediatric ICU' }
];

const RATING_OPTIONS = [
  { value: 4.5, label: '4.5+ Stars' },
  { value: 4.0, label: '4.0+ Stars' },
  { value: 3.5, label: '3.5+ Stars' }
];

/**
 * Collapsible filter section
 */
function FilterSection({ title, children, defaultOpen = true }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 py-4 first:pt-0 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left"
      >
        <span className="font-medium text-gray-900">{title}</span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>
      {isOpen && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );
}

export function MarketplaceFilters({
  filters,
  onChange,
  onClear,
  className,
  isMobile = false,
  onClose
}) {
  const activeFilterCount = Object.values(filters).filter(v => {
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === 'number') return v > 0;
    return Boolean(v);
  }).length;

  const handleServiceTypeChange = (type, checked) => {
    const current = filters.serviceTypes || [];
    const updated = checked
      ? [...current, type]
      : current.filter(t => t !== type);
    onChange({ ...filters, serviceTypes: updated });
  };

  const handleIcuTypeChange = (type, checked) => {
    const current = filters.icuTypes || [];
    const updated = checked
      ? [...current, type]
      : current.filter(t => t !== type);
    onChange({ ...filters, icuTypes: updated });
  };

  return (
    <div className={cn('bg-white', isMobile ? 'h-full' : 'rounded-xl border border-gray-200 p-4', className)}>
      {/* Mobile Header */}
      {isMobile && (
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            <span className="font-semibold">Filters</span>
            {activeFilterCount > 0 && (
              <Badge variant="default">{activeFilterCount}</Badge>
            )}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className={isMobile ? 'p-4 overflow-y-auto' : ''}>
        {/* Desktop Header */}
        {!isMobile && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <span className="font-medium">Filters</span>
            </div>
            {activeFilterCount > 0 && (
              <button
                onClick={onClear}
                className="text-sm text-primary hover:underline"
              >
                Clear all
              </button>
            )}
          </div>
        )}

        {/* Service Type */}
        <FilterSection title="Service Type">
          {SERVICE_TYPES.map(type => (
            <div key={type.value} className="flex items-center gap-2">
              <Checkbox
                id={`service-${type.value}`}
                checked={(filters.serviceTypes || []).includes(type.value)}
                onCheckedChange={(checked) => handleServiceTypeChange(type.value, checked)}
              />
              <Label htmlFor={`service-${type.value}`} className="text-sm cursor-pointer">
                {type.label}
              </Label>
            </div>
          ))}
        </FilterSection>

        {/* ICU Experience */}
        <FilterSection title="ICU Background" defaultOpen={false}>
          {ICU_TYPES.map(type => (
            <div key={type.value} className="flex items-center gap-2">
              <Checkbox
                id={`icu-${type.value}`}
                checked={(filters.icuTypes || []).includes(type.value)}
                onCheckedChange={(checked) => handleIcuTypeChange(type.value, checked)}
              />
              <Label htmlFor={`icu-${type.value}`} className="text-sm cursor-pointer">
                {type.label}
              </Label>
            </div>
          ))}
        </FilterSection>

        {/* Price Range */}
        <FilterSection title="Price Range">
          <div className="px-2">
            <Slider
              min={0}
              max={200}
              step={10}
              value={[filters.minPrice || 0, filters.maxPrice || 200]}
              onValueChange={([min, max]) => {
                onChange({ ...filters, minPrice: min, maxPrice: max });
              }}
            />
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>${filters.minPrice || 0}</span>
              <span>${filters.maxPrice || 200}+</span>
            </div>
          </div>
        </FilterSection>

        {/* Rating */}
        <FilterSection title="Rating">
          {RATING_OPTIONS.map(option => (
            <div key={option.value} className="flex items-center gap-2">
              <Checkbox
                id={`rating-${option.value}`}
                checked={filters.minRating === option.value}
                onCheckedChange={(checked) => {
                  onChange({ ...filters, minRating: checked ? option.value : null });
                }}
              />
              <Label htmlFor={`rating-${option.value}`} className="text-sm cursor-pointer flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                {option.label}
              </Label>
            </div>
          ))}
        </FilterSection>

        {/* Availability */}
        <FilterSection title="Availability">
          <div className="flex items-center gap-2">
            <Checkbox
              id="instant-book"
              checked={filters.instantBookOnly || false}
              onCheckedChange={(checked) => {
                onChange({ ...filters, instantBookOnly: checked });
              }}
            />
            <Label htmlFor="instant-book" className="text-sm cursor-pointer">
              Instant Book available
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="available-now"
              checked={filters.availableOnly || false}
              onCheckedChange={(checked) => {
                onChange({ ...filters, availableOnly: checked });
              }}
            />
            <Label htmlFor="available-now" className="text-sm cursor-pointer">
              Currently available
            </Label>
          </div>
        </FilterSection>
      </div>

      {/* Mobile Footer */}
      {isMobile && (
        <div className="p-4 border-t border-gray-200 space-y-2">
          <Button onClick={onClose} className="w-full">
            Show Results
          </Button>
          {activeFilterCount > 0 && (
            <Button variant="outline" onClick={onClear} className="w-full">
              Clear All Filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default MarketplaceFilters;
