/**
 * SchoolFilters Component
 *
 * Filter sidebar for the School Database.
 * Desktop: Fixed sidebar on left
 * Mobile: Bottom sheet/drawer
 */

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import {
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
// Options for Requires / Does Not Require dropdowns (prerequisite courses only)
const requirementOptions = [
  { value: 'statistics', label: 'Statistics' },
  { value: 'genChemistry', label: 'General Chemistry' },
  { value: 'organicChemistry', label: 'Organic Chemistry' },
  { value: 'research', label: 'Research' },
  { value: 'biochemistry', label: 'Biochemistry' },
  { value: 'acceptsOrganicOrBiochem', label: 'Accepts Either Organic or Biochem' },
  { value: 'anatomy', label: 'Anatomy' },
  { value: 'physics', label: 'Physics' },
  { value: 'pharmacology', label: 'Pharmacology' },
  { value: 'physiology', label: 'Physiology' },
  { value: 'microbiology', label: 'Microbiology' },
];

export function SchoolFilters({
  filters,
  onFilterChange,
  onClearFilters,
  allStates,
  filteredCount,
  totalCount,
  maxTuition = 293400,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Check if any filters are active
  const hasActiveFilters =
    filters.search ||
    filters.states.length > 0 ||
    filters.tuitionMin > 0 ||
    filters.tuitionMax < maxTuition ||
    filters.greNotRequired ||
    filters.greRequired ||
    filters.greWaived ||
    filters.requires.length > 0 ||
    filters.doesNotRequire.length > 0 ||
    filters.acceptsNicu ||
    filters.acceptsPicu ||
    filters.acceptsEr ||
    filters.acceptsOtherCriticalCare ||
    filters.typeFrontLoaded ||
    filters.typeIntegrated ||
    filters.gpaScience ||
    filters.gpaNursing ||
    filters.gpaCumulative ||
    filters.gpaGraduate ||
    filters.gpaLast60 ||
    filters.ableToWork ||
    filters.nursingCas ||
    filters.rollingAdmissions ||
    filters.partiallyOnline ||
    filters.acceptsBachelorsScienceRelated;

  // Format currency for display
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Handle tuition slider change
  const handleTuitionChange = (values) => {
    onFilterChange('tuitionMin', values[0]);
    onFilterChange('tuitionMax', values[1]);
  };

  // Handle multi-select for requires/doesNotRequire
  const handleMultiSelectChange = (filterKey, value) => {
    const currentValues = filters[filterKey];
    if (currentValues.includes(value)) {
      onFilterChange(filterKey, currentValues.filter(v => v !== value));
    } else {
      onFilterChange(filterKey, [...currentValues, value]);
    }
  };

  const filterContent = (
    <div className="space-y-6">
      {/* School Name Search */}
      <div>
        <Label className="text-sm font-semibold mb-2 block">School Name</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Location */}
      <div>
        <Label className="text-sm font-semibold mb-2 block">Location</Label>
        <Select
          value={filters.states[0] || 'all'}
          onValueChange={(value) => onFilterChange('states', value === 'all' ? [] : [value])}
        >
          <SelectTrigger>
            <SelectValue placeholder="All States" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All States</SelectItem>
            {allStates.map((state) => (
              <SelectItem key={state} value={state}>
                {state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tuition Range Slider */}
      <div>
        <Label className="text-sm font-semibold mb-2 block">Tuition</Label>
        <Slider
          defaultValue={[filters.tuitionMin, filters.tuitionMax]}
          value={[filters.tuitionMin, filters.tuitionMax]}
          min={0}
          max={maxTuition}
          step={1000}
          onValueChange={handleTuitionChange}
          className="mt-2"
        />
        <div className="text-sm text-gray-600 mt-2">
          {formatCurrency(filters.tuitionMin)} — {formatCurrency(filters.tuitionMax)}
        </div>
      </div>

      {/* GRE Checkboxes */}
      <div>
        <Label className="text-sm font-semibold mb-2 block">GRE</Label>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="greNotRequired"
              checked={filters.greNotRequired}
              onCheckedChange={(checked) => onFilterChange('greNotRequired', checked)}
            />
            <label htmlFor="greNotRequired" className="text-sm cursor-pointer">
              Not Required
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="greRequired"
              checked={filters.greRequired}
              onCheckedChange={(checked) => onFilterChange('greRequired', checked)}
            />
            <label htmlFor="greRequired" className="text-sm cursor-pointer">
              Required
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="greWaived"
              checked={filters.greWaived}
              onCheckedChange={(checked) => onFilterChange('greWaived', checked)}
            />
            <label htmlFor="greWaived" className="text-sm cursor-pointer">
              Required but Waived
            </label>
          </div>
        </div>
      </div>

      {/* Requires Multi-Select */}
      <div>
        <Label className="text-sm font-semibold mb-2 block">Requires</Label>
        <Select
          value=""
          onValueChange={(value) => handleMultiSelectChange('requires', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
          <SelectContent>
            {requirementOptions.map((opt) => (
              <SelectItem
                key={opt.value}
                value={opt.value}
                className={filters.requires.includes(opt.value) ? 'bg-gray-100' : ''}
              >
                {filters.requires.includes(opt.value) ? '✓ ' : ''}{opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {filters.requires.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {filters.requires.map((req) => (
              <span
                key={req}
                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs cursor-pointer hover:bg-gray-200"
                onClick={() => handleMultiSelectChange('requires', req)}
              >
                {requirementOptions.find(o => o.value === req)?.label}
                <X className="w-3 h-3" />
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Does Not Require Multi-Select */}
      <div>
        <Label className="text-sm font-semibold mb-2 block">Does Not Require</Label>
        <Select
          value=""
          onValueChange={(value) => handleMultiSelectChange('doesNotRequire', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
          <SelectContent>
            {requirementOptions.map((opt) => (
              <SelectItem
                key={opt.value}
                value={opt.value}
                className={filters.doesNotRequire.includes(opt.value) ? 'bg-gray-100' : ''}
              >
                {filters.doesNotRequire.includes(opt.value) ? '✓ ' : ''}{opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {filters.doesNotRequire.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {filters.doesNotRequire.map((req) => (
              <span
                key={req}
                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs cursor-pointer hover:bg-gray-200"
                onClick={() => handleMultiSelectChange('doesNotRequire', req)}
              >
                {requirementOptions.find(o => o.value === req)?.label}
                <X className="w-3 h-3" />
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Specialty Accepted */}
      <div>
        <Label className="text-sm font-semibold mb-2 block">Specialty Accepted</Label>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="acceptsNicu"
              checked={filters.acceptsNicu}
              onCheckedChange={(checked) => onFilterChange('acceptsNicu', checked)}
            />
            <label htmlFor="acceptsNicu" className="text-sm cursor-pointer">
              NICU Experience
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="acceptsPicu"
              checked={filters.acceptsPicu}
              onCheckedChange={(checked) => onFilterChange('acceptsPicu', checked)}
            />
            <label htmlFor="acceptsPicu" className="text-sm cursor-pointer">
              PICU Experience
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="acceptsEr"
              checked={filters.acceptsEr}
              onCheckedChange={(checked) => onFilterChange('acceptsEr', checked)}
            />
            <label htmlFor="acceptsEr" className="text-sm cursor-pointer">
              ER Experience
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="acceptsOtherCriticalCare"
              checked={filters.acceptsOtherCriticalCare}
              onCheckedChange={(checked) => onFilterChange('acceptsOtherCriticalCare', checked)}
            />
            <label htmlFor="acceptsOtherCriticalCare" className="text-sm cursor-pointer">
              Possibly Accepts Other Areas Of Critical Care
            </label>
          </div>
        </div>
      </div>

      {/* Type */}
      <div>
        <Label className="text-sm font-semibold mb-2 block">Type</Label>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="typeFrontLoaded"
              checked={filters.typeFrontLoaded}
              onCheckedChange={(checked) => onFilterChange('typeFrontLoaded', checked)}
            />
            <label htmlFor="typeFrontLoaded" className="text-sm cursor-pointer">
              Front-Loaded
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="typeIntegrated"
              checked={filters.typeIntegrated}
              onCheckedChange={(checked) => onFilterChange('typeIntegrated', checked)}
            />
            <label htmlFor="typeIntegrated" className="text-sm cursor-pointer">
              Integrated
            </label>
          </div>
        </div>
      </div>

      {/* GPA Type */}
      <div>
        <Label className="text-sm font-semibold mb-2 block">GPA Type</Label>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="gpaCumulative"
              checked={filters.gpaCumulative}
              onCheckedChange={(checked) => onFilterChange('gpaCumulative', checked)}
            />
            <label htmlFor="gpaCumulative" className="text-sm cursor-pointer">
              Overall/Cumulative
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="gpaScience"
              checked={filters.gpaScience}
              onCheckedChange={(checked) => onFilterChange('gpaScience', checked)}
            />
            <label htmlFor="gpaScience" className="text-sm cursor-pointer">
              Science
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="gpaNursing"
              checked={filters.gpaNursing}
              onCheckedChange={(checked) => onFilterChange('gpaNursing', checked)}
            />
            <label htmlFor="gpaNursing" className="text-sm cursor-pointer">
              Nursing/Undergraduate
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="gpaLast60"
              checked={filters.gpaLast60}
              onCheckedChange={(checked) => onFilterChange('gpaLast60', checked)}
            />
            <label htmlFor="gpaLast60" className="text-sm cursor-pointer">
              Last 60 Credits
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="gpaGraduate"
              checked={filters.gpaGraduate}
              onCheckedChange={(checked) => onFilterChange('gpaGraduate', checked)}
            />
            <label htmlFor="gpaGraduate" className="text-sm cursor-pointer">
              Graduate
            </label>
          </div>
        </div>
      </div>

      {/* Other */}
      <div>
        <Label className="text-sm font-semibold mb-2 block">Other</Label>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="ableToWork"
              checked={filters.ableToWork}
              onCheckedChange={(checked) => onFilterChange('ableToWork', checked)}
            />
            <label htmlFor="ableToWork" className="text-sm cursor-pointer">
              Work During Program
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="nursingCas"
              checked={filters.nursingCas}
              onCheckedChange={(checked) => onFilterChange('nursingCas', checked)}
            />
            <label htmlFor="nursingCas" className="text-sm cursor-pointer">
              Nursing Cas
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="rollingAdmissions"
              checked={filters.rollingAdmissions}
              onCheckedChange={(checked) => onFilterChange('rollingAdmissions', checked)}
            />
            <label htmlFor="rollingAdmissions" className="text-sm cursor-pointer">
              Rolling Admissions
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="partiallyOnline"
              checked={filters.partiallyOnline}
              onCheckedChange={(checked) => onFilterChange('partiallyOnline', checked)}
            />
            <label htmlFor="partiallyOnline" className="text-sm cursor-pointer">
              Partially Online
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="acceptsBachelorsScienceRelated"
              checked={filters.acceptsBachelorsScienceRelated}
              onCheckedChange={(checked) => onFilterChange('acceptsBachelorsScienceRelated', checked)}
            />
            <label htmlFor="acceptsBachelorsScienceRelated" className="text-sm cursor-pointer">
              Accepts Bachelors of Science In a Related Field
            </label>
          </div>
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          onClick={onClearFilters}
          className="w-full"
        >
          <X className="w-4 h-4 mr-2" />
          Clear All Filters
        </Button>
      )}

      {/* Results Count */}
      <div className="pt-4 border-t border-orange-100/60 text-sm text-gray-600">
        Showing <span className="font-semibold text-orange-700">{filteredCount}</span> of{' '}
        <span className="font-semibold">{totalCount}</span> programs
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-20 bg-white rounded-[2rem] overflow-hidden max-h-[calc(100vh-6rem)] flex flex-col">
          {/* Top padding zone - always visible, not scrollable */}
          <div className="pt-8 px-8 shrink-0" />
          {/* Scrollable content area */}
          <div className="px-8 pb-8 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {filterContent}
          </div>
        </div>
      </div>

      {/* Mobile Filter Button + Sheet */}
      <div className="lg:hidden fixed bottom-20 left-4 right-4 z-40">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button className="w-full shadow-lg bg-linear-to-r from-[#F1EAB9] via-[#FFD6B8] to-[#FF8C8C] hover:from-[#E8E0A8] hover:via-[#FFCAA8] hover:to-[#FF7B7B] text-orange-900 border-none" size="lg">
              <SlidersHorizontal className="w-5 h-5 mr-2" />
              Filters
              {hasActiveFilters && (
                <span className="ml-2 bg-white text-orange-600 rounded-full w-5 h-5 text-xs flex items-center justify-center font-semibold">
                  !
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh] overflow-auto bg-linear-to-br from-[#FFFBF7] via-white to-[#FFF8F3]">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-orange-500" />
                <span className="bg-linear-to-r from-[#F97066] via-[#FE90AF] to-[#FFB088] bg-clip-text text-transparent">Filter Schools</span>
              </SheetTitle>
            </SheetHeader>
            <div className="mt-4">
              {filterContent}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

export default SchoolFilters;
