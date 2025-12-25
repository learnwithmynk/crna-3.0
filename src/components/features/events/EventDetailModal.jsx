/**
 * EventDetailModal - Pop-up modal showing full event details
 * Displays event banner, title, date/time, location, description, and action buttons
 */

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  MapPin,
  Clock,
  ExternalLink,
  Bookmark,
  User,
  Video,
  Award,
} from 'lucide-react';
import {
  formatEventDateTime,
  getCategoryWithState,
  getCategoryLabel,
} from '@/data/mockEvents';

export function EventDetailModal({
  event,
  isOpen,
  onClose,
  isSaved,
  onSave,
}) {
  if (!event) return null;

  const handleSaveClick = () => {
    onSave?.(event);
  };

  const handleActionClick = () => {
    const url = event.rsvpUrl || event.externalUrl;
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  // Determine the action button text and style
  const getActionButton = () => {
    if (event.source === 'crna_club' && event.rsvpUrl) {
      return {
        text: 'RSVP',
        icon: <Video className="w-4 h-4 mr-2" />,
        className: 'bg-yellow-400 hover:bg-yellow-500 text-black',
      };
    }
    return {
      text: 'Check It Out',
      icon: <ExternalLink className="w-4 h-4 mr-2" />,
      className: 'bg-yellow-400 hover:bg-yellow-500 text-black',
    };
  };

  const actionButton = getActionButton();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-0">
        {/* Banner/Header area */}
        <div className="bg-gradient-to-b from-yellow-50 to-white p-6 pb-4">
          {/* Event logo/image */}
          <div className="flex justify-center mb-4">
            <div className="w-28 h-28 rounded-full bg-white shadow-md flex items-center justify-center overflow-hidden border border-gray-100">
              {event.imageUrl ? (
                <img
                  src={event.imageUrl}
                  alt={event.schoolName || event.title}
                  className="w-full h-full object-contain p-3"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div
                className={`w-full h-full items-center justify-center text-3xl font-bold text-gray-400 bg-gray-50 ${event.imageUrl ? 'hidden' : 'flex'}`}
              >
                {event.schoolName?.charAt(0) || event.title.charAt(0)}
              </div>
            </div>
          </div>

          {/* Event title */}
          <DialogHeader className="text-center">
            <DialogTitle className="text-xl font-bold text-gray-900 leading-tight">
              {event.title}
            </DialogTitle>
          </DialogHeader>

          {/* Category and date badges */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <Badge
              variant="outline"
              className="text-xs font-normal rounded-full px-3 py-1 border-gray-300"
            >
              {getCategoryWithState(event)}
            </Badge>
          </div>
        </div>

        {/* Content area */}
        <div className="px-6 pb-6">
          {/* Event details */}
          <div className="space-y-3 mb-6">
            {/* Date and Time */}
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {formatEventDateTime(event)}
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-3">
              {event.isVirtual ? (
                <Video className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              ) : (
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              )}
              <div>
                <p className="text-sm text-gray-700">{event.location}</p>
                {event.isVirtual && (
                  <p className="text-xs text-gray-500">Virtual Event</p>
                )}
              </div>
            </div>

            {/* Hosted by (if applicable) */}
            {event.hostedBy && (
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-700">
                    Hosted by {event.hostedBy}
                  </p>
                </div>
              </div>
            )}

            {/* Points value (for CRNA Club events) */}
            {event.pointsValue > 0 && (
              <div className="flex items-start gap-3">
                <Award className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium text-yellow-600">
                      +{event.pointsValue} points
                    </span>{' '}
                    for attending
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">
              About This Event
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* School info (if linked to a program) */}
          {event.schoolName && (
            <div className="mb-6 p-3 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">
                Program
              </p>
              <p className="text-sm font-medium text-gray-900">
                {event.schoolName}
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={handleActionClick}
              className={`w-full font-medium ${actionButton.className}`}
            >
              {actionButton.icon}
              {actionButton.text}
            </Button>

            <Button
              variant="outline"
              onClick={handleSaveClick}
              className={`w-full ${isSaved ? 'border-yellow-400 bg-yellow-50' : ''}`}
            >
              <Bookmark
                className={`w-4 h-4 mr-2 ${isSaved ? 'fill-current text-yellow-500' : ''}`}
              />
              {isSaved ? 'Saved' : 'Save Event'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default EventDetailModal;
