/**
 * EventFilters - Filter controls for the Events page
 * Includes category dropdown, state dropdown, reset button, and view toggle
 */

import { LayoutGrid, List, Calendar, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EVENT_CATEGORIES, getStatesWithEvents } from '@/data/mockEvents';

export function EventFilters({
  selectedCategory,
  onCategoryChange,
  selectedState,
  onStateChange,
  viewMode,
  onViewModeChange,
  onReset,
}) {
  const statesWithEvents = getStatesWithEvents();

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Category filter */}
        <Select
          value={selectedCategory || 'all'}
          onValueChange={(value) => onCategoryChange(value === 'all' ? null : value)}
        >
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {Object.values(EVENT_CATEGORIES).map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* State filter */}
        <Select
          value={selectedState || 'all'}
          onValueChange={(value) => onStateChange(value === 'all' ? null : value)}
        >
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Select State" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All States</SelectItem>
            {statesWithEvents.map((state) => (
              <SelectItem key={state.value} value={state.value}>
                {state.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Reset button */}
        <Button
          variant="secondary"
          size="sm"
          onClick={onReset}
          className="bg-gray-900 text-white hover:bg-gray-800"
        >
          <RotateCcw className="w-4 h-4 mr-1" />
          Reset
        </Button>
      </div>

      {/* View mode toggle */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
        <button
          onClick={() => onViewModeChange('grid')}
          className={`p-2 rounded-lg transition-colors ${
            viewMode === 'grid'
              ? 'bg-gray-900 text-white'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          title="Grid view"
        >
          <LayoutGrid className="w-4 h-4" />
        </button>
        <button
          onClick={() => onViewModeChange('list')}
          className={`p-2 rounded-lg transition-colors ${
            viewMode === 'list'
              ? 'bg-gray-900 text-white'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          title="List view"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onClick={() => onViewModeChange('calendar')}
          className={`p-2 rounded-lg transition-colors ${
            viewMode === 'calendar'
              ? 'bg-gray-900 text-white'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          title="Calendar view"
          disabled
        >
          <Calendar className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/**
 * ViewToggle - Toggle between "View All" and "Saved" views
 */
export function ViewToggle({ activeView, onViewChange }) {
  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => onViewChange('all')}
        className={`text-sm font-medium transition-colors ${
          activeView === 'all'
            ? 'text-gray-900 underline underline-offset-4'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        View All
      </button>
      <button
        onClick={() => onViewChange('saved')}
        className={`text-sm font-medium transition-colors ${
          activeView === 'saved'
            ? 'text-gray-900 underline underline-offset-4'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        Saved
      </button>
    </div>
  );
}

export default EventFilters;
