/**
 * Events Page
 *
 * Browse and discover events relevant to CRNA applicants.
 * Features:
 * - AANA State/National Meetings
 * - CRNA Club internal events
 * - School open houses and info sessions
 * - Save/bookmark events
 * - Filter by category and state
 * - Grid/List view toggle
 *
 * Route: /events
 */

import { useState } from 'react';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { useEvents } from '@/hooks/useEvents';
import { EventCard } from '@/components/features/events/EventCard';
import { EventDetailModal } from '@/components/features/events/EventDetailModal';
import { EventFilters, ViewToggle } from '@/components/features/events/EventFilters';
import { EmptyState } from '@/components/ui/empty-state';
import { Calendar, Bookmark } from 'lucide-react';

export function EventsPage() {
  const {
    filteredEvents,
    filters,
    setCategory,
    setState,
    resetFilters,
    viewMode,
    setViewMode,
    activeView,
    setActiveView,
    isEventSaved,
    toggleSaveEvent,
    selectedEvent,
    openEventDetail,
    closeEventDetail,
    savedEventsCount,
  } = useEvents();

  // Toast state for save feedback
  const [toast, setToast] = useState(null);

  const handleSaveEvent = (event) => {
    const wasSaved = isEventSaved(event.id);
    toggleSaveEvent(event);

    // Show toast feedback
    setToast({
      message: wasSaved ? 'Event removed from saved' : 'Event saved!',
      type: wasSaved ? 'info' : 'success',
    });

    // Clear toast after 2 seconds
    setTimeout(() => setToast(null), 2000);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50/80 to-pink-50/25">
      <PageWrapper className="px-8 md:px-16 lg:px-24 xl:px-32 pt-8 md:pt-12 lg:pt-16 pb-8 bg-transparent relative z-10">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-600 mt-1">Discover CRNA events, open houses, and networking opportunities</p>
        </div>

      {/* Header with View Toggle */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
          </span>
        </div>
        <ViewToggle activeView={activeView} onViewChange={setActiveView} />
      </div>

      {/* Filters */}
      <EventFilters
        selectedCategory={filters.category}
        onCategoryChange={setCategory}
        selectedState={filters.state}
        onStateChange={setState}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onReset={resetFilters}
      />

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'flex flex-col gap-4'
          }
        >
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isSaved={isEventSaved(event.id)}
              onSave={handleSaveEvent}
              onViewDetails={openEventDetail}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={activeView === 'saved' ? Bookmark : Calendar}
          title={activeView === 'saved' ? 'No saved events' : 'No events found'}
          description={
            activeView === 'saved'
              ? "You haven't saved any events yet. Browse events and click the bookmark icon to save them."
              : 'Try adjusting your filters to see more events.'
          }
          actionLabel={
            activeView === 'saved'
              ? 'Browse Events'
              : filters.category || filters.state
                ? 'Clear Filters'
                : undefined
          }
          onAction={
            activeView === 'saved'
              ? () => setActiveView('all')
              : filters.category || filters.state
                ? resetFilters
                : undefined
          }
        />
      )}

      {/* Event Detail Modal */}
      <EventDetailModal
        event={selectedEvent}
        isOpen={!!selectedEvent}
        onClose={closeEventDetail}
        isSaved={selectedEvent ? isEventSaved(selectedEvent.id) : false}
        onSave={handleSaveEvent}
      />

      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed bottom-4 right-4 px-4 py-2 rounded-xl shadow-lg text-sm font-medium transition-all z-50 ${
            toast.type === 'success'
              ? 'bg-green-500 text-white'
              : 'bg-gray-800 text-white'
          }`}
        >
          {toast.message}
        </div>
      )}
      </PageWrapper>
    </div>
  );
}

export default EventsPage;
