/**
 * EventCard - Displays an event in the grid/list view
 * Shows event logo, title, category, date, description preview, and bookmark action
 */

import { Bookmark, ArrowRight, MapPin, Video } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatEventDateShort, getCategoryWithState } from '@/data/mockEvents';

export function EventCard({ event, isSaved, onSave, onViewDetails }) {
  const handleSaveClick = (e) => {
    e.stopPropagation();
    onSave?.(event);
  };

  const handleCardClick = () => {
    onViewDetails?.(event);
  };

  // Truncate description for preview
  const truncatedDescription = event.description.length > 120
    ? event.description.substring(0, 120) + '...'
    : event.description;

  // Get placeholder image based on event type
  const getPlaceholderImage = () => {
    if (event.source === 'crna_club') {
      return '/images/crna-club-logo.png';
    }
    if (event.schoolName) {
      return `/images/schools/${event.schoolId || 'default'}.png`;
    }
    return '/images/aana/aana-logo.png';
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-gradient-to-b from-yellow-50 to-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden group"
    >
      {/* Header with logo and bookmark */}
      <div className="relative p-6 pb-4">
        {/* Bookmark button */}
        <button
          onClick={handleSaveClick}
          className="absolute top-4 right-4 min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors z-10"
          title={isSaved ? 'Remove from saved' : 'Save event'}
        >
          <span className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 bg-white hover:bg-gray-50 transition-colors">
            <Bookmark
              className={`w-4 h-4 ${isSaved ? 'fill-current text-yellow-500' : 'text-gray-400'}`}
            />
          </span>
        </button>

        {/* Event logo/image */}
        <div className="flex justify-center mb-4">
          <div className="w-24 h-24 rounded-full bg-white shadow-sm flex items-center justify-center overflow-hidden border border-gray-100">
            {event.imageUrl ? (
              <img
                src={event.imageUrl}
                alt={event.schoolName || event.title}
                className="w-full h-full object-contain p-2"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div
              className={`w-full h-full items-center justify-center text-2xl font-bold text-gray-400 bg-gray-50 ${event.imageUrl ? 'hidden' : 'flex'}`}
            >
              {event.schoolName?.charAt(0) || event.title.charAt(0)}
            </div>
          </div>
        </div>

        {/* Event title */}
        <h3 className="font-semibold text-gray-900 text-base leading-tight mb-3 line-clamp-2">
          {event.title}
        </h3>

        {/* Category badge */}
        <div className="flex flex-wrap gap-2 mb-2">
          <Badge
            variant="outline"
            className="text-xs font-normal rounded-full px-3 py-1 border-gray-300"
          >
            {getCategoryWithState(event)}
          </Badge>
        </div>

        {/* Date badge */}
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge
            variant="outline"
            className="text-xs font-normal rounded-full px-3 py-1 border-gray-300"
          >
            {formatEventDateShort(event)}
          </Badge>
        </div>

        {/* Description preview */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {truncatedDescription}
        </p>

        {/* View Event link */}
        <button
          onClick={handleCardClick}
          className="inline-flex items-center text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors group-hover:underline"
        >
          View Event
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
}

export default EventCard;
