/**
 * TaskFilterBar - Filter controls for task list
 *
 * Desktop: Inline Select dropdowns, always visible
 * Mobile: Filter icon that opens bottom sheet
 */

import React, { useState } from 'react';
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
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SlidersHorizontal, X } from 'lucide-react';

export function TaskFilterBar({
  programs = [],
  showProgramFilter = true,
  filters,
  onFiltersChange,
}) {
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  // Count active filters (excluding defaults)
  const activeFilterCount = [
    filters.programId !== 'all',
    filters.status !== 'all',
    filters.dueDate !== 'all',
  ].filter(Boolean).length;

  const handleFilterChange = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      programId: 'all',
      status: 'all',
      dueDate: 'all',
    });
  };

  // Status options
  const statusOptions = [
    { value: 'all', label: 'All' },
    { value: 'not_started', label: 'Not Started' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ];

  // Due date options
  const dueDateOptions = [
    { value: 'all', label: 'All Dates' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'this_week', label: 'This Week' },
    { value: 'this_month', label: 'This Month' },
    { value: 'next_90', label: 'Next 90 Days' },
  ];

  // Desktop filters (compact)
  const DesktopFilters = () => (
    <div className="hidden sm:flex items-center gap-1.5 flex-wrap">
      {/* Program Filter */}
      {showProgramFilter && (
        <Select
          value={filters.programId}
          onValueChange={(value) => handleFilterChange('programId', value)}
        >
          <SelectTrigger className="w-[130px] h-7 text-xs border-gray-200">
            <SelectValue placeholder="All Programs" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">All Programs</SelectItem>
            {programs.map((p) => (
              <SelectItem key={p.program.id} value={p.program.id} className="text-xs">
                {p.program.schoolName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Status Filter */}
      <Select
        value={filters.status}
        onValueChange={(value) => handleFilterChange('status', value)}
      >
        <SelectTrigger className="w-[100px] h-7 text-xs border-gray-200">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value} className="text-xs">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Due Date Filter */}
      <Select
        value={filters.dueDate}
        onValueChange={(value) => handleFilterChange('dueDate', value)}
      >
        <SelectTrigger className="w-[100px] h-7 text-xs border-gray-200">
          <SelectValue placeholder="Due Date" />
        </SelectTrigger>
        <SelectContent>
          {dueDateOptions.map((option) => (
            <SelectItem key={option.value} value={option.value} className="text-xs">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Clear Filters */}
      {activeFilterCount > 0 && (
        <button
          onClick={clearFilters}
          className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-0.5 ml-1"
        >
          <X className="w-3 h-3" />
          Clear
        </button>
      )}
    </div>
  );

  // Mobile filter button and sheet
  const MobileFilters = () => (
    <div className="sm:hidden">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setMobileSheetOpen(true)}
        className="h-9"
      >
        <SlidersHorizontal className="w-4 h-4 mr-2" />
        Filters
        {activeFilterCount > 0 && (
          <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
            {activeFilterCount}
          </Badge>
        )}
      </Button>

      <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
        <SheetContent side="bottom" className="h-auto max-h-[80vh]">
          <SheetHeader>
            <SheetTitle>Filter Tasks</SheetTitle>
          </SheetHeader>

          <div className="space-y-6 py-4">
            {/* Program Filter */}
            {showProgramFilter && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Program</label>
                <Select
                  value={filters.programId}
                  onValueChange={(value) => handleFilterChange('programId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Programs" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Programs</SelectItem>
                    {programs.map((p) => (
                      <SelectItem key={p.program.id} value={p.program.id}>
                        {p.program.schoolName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleFilterChange('status', option.value)}
                    className={`px-3 py-2 text-sm rounded-xl border transition-colors ${
                      filters.status === option.value
                        ? 'bg-primary border-primary text-gray-900 font-medium'
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Due Date Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Due Date</label>
              <div className="flex flex-wrap gap-2">
                {dueDateOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleFilterChange('dueDate', option.value)}
                    className={`px-3 py-2 text-sm rounded-xl border transition-colors ${
                      filters.dueDate === option.value
                        ? 'bg-primary border-primary text-gray-900 font-medium'
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <SheetFooter>
            <Button variant="outline" onClick={clearFilters}>
              Clear All
            </Button>
            <Button onClick={() => setMobileSheetOpen(false)}>
              Apply Filters
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );

  return (
    <div className="flex items-center gap-2">
      <DesktopFilters />
      <MobileFilters />
    </div>
  );
}
