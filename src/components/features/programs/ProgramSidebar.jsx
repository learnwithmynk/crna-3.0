/**
 * ProgramSidebar - Program Events + Digital Downloads
 *
 * Features:
 * - Program Events section with helpful empty state
 * - Add custom event tied to this program
 * - Option to share event with admin for points
 * - Digital Downloads filtered by checklist completion
 * - Download cards with thumbnails and external links
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Calendar, Download, ExternalLink, FileText, Filter, Plus, Globe, Gift, Clock, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDateFull } from '@/lib/dateFormatters';
import { usePoints, POINT_ACTIONS } from '@/hooks/usePoints';

// Mock digital downloads - would come from WordPress CPT
// TODO: Replace with API call
const MOCK_DOWNLOADS = [
  {
    id: 'd1',
    title: 'Essay Workbook',
    description: 'Personal Statement',
    thumbnail: null,
    taxonomies: ['PERSONAL STATEMENT'],
    url: '#'
  },
  {
    id: 'd2',
    title: 'Email Templates',
    description: 'Letters of Recommendation, Shadowing',
    thumbnail: null,
    taxonomies: ['LETTERS OF RECOMMENDATION', 'SHADOWING'],
    url: '#'
  },
  {
    id: 'd3',
    title: 'Application Tracker',
    description: 'Becoming Competitive, Letters of Recommendation, Resume',
    thumbnail: null,
    taxonomies: ['LETTERS OF RECOMMENDATION', 'RESUME'],
    url: '#'
  },
  {
    id: 'd4',
    title: 'Roadmap Planning Tool',
    description: 'AANA Meetings, About the Profession, Becoming Competitive',
    thumbnail: null,
    taxonomies: ['AANA MEETINGS', 'ABOUT THE PROFESSION'],
    url: '#'
  },
  {
    id: 'd5',
    title: 'Prerequisite Algorithm',
    description: 'GPA, Prerequisites',
    thumbnail: null,
    taxonomies: ['GPA', 'PREREQUISITES'],
    url: '#'
  },
  {
    id: 'd6',
    title: 'GPA Calculator Spreadsheet',
    description: 'GPA',
    thumbnail: null,
    taxonomies: ['GPA'],
    url: '#'
  },
  {
    id: 'd7',
    title: 'GRE Study Guide',
    description: 'GRE',
    thumbnail: null,
    taxonomies: ['GRE'],
    url: '#'
  },
  {
    id: 'd8',
    title: 'Resume Template Pack',
    description: 'Resume',
    thumbnail: null,
    taxonomies: ['RESUME'],
    url: '#'
  },
];

// Taxonomy mapping from checklist items
const CHECKLIST_TO_TAXONOMY = {
  'Complete the GRE': 'GRE',
  'Send GRE Scores': 'GRE',
  'Complete CCRN': 'CERTIFICATIONS',
  'Complete Resume': 'RESUME',
  'Complete Personal Statement': 'PERSONAL STATEMENT',
  'Complete Letters of Recommendation': 'LETTERS OF RECOMMENDATION',
};

/**
 * Download Card Component
 */
function DownloadCard({ download }) {
  return (
    <a
      href={download.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
    >
      {/* Thumbnail */}
      <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
        {download.thumbnail ? (
          <img
            src={download.thumbnail}
            alt=""
            className="w-full h-full object-cover rounded-xl"
          />
        ) : (
          <FileText className="w-6 h-6 text-gray-400" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900 group-hover:text-primary transition-colors">
          {download.title}
        </h4>
        <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">
          {download.description}
        </p>
      </div>

      {/* Link Icon */}
      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary flex-shrink-0 mt-1" />
    </a>
  );
}

/**
 * Custom Event Card
 */
function CustomEventCard({ event, onDelete }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
        <Calendar className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900 truncate">{event.title}</h4>
        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          <span>{formatDateFull(event.date)}</span>
        </div>
        {event.sharedWithAdmin && (
          <div className="flex items-center gap-1 mt-1 text-xs text-green-600">
            <Gift className="w-3 h-3" />
            <span>Shared with admin (+10 pts pending)</span>
          </div>
        )}
      </div>
      <button
        onClick={() => onDelete(event.id)}
        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors min-h-11 min-w-11 flex items-center justify-center"
        title="Delete event"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

export function ProgramSidebar({ checklist = [], programId, schoolName, websiteUrl }) {
  const [filter, setFilter] = useState('recommended');
  const [customEvents, setCustomEvents] = useState([]);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    shareWithAdmin: false
  });

  const { awardPoints, checkDailyCap } = usePoints();
  const eventCap = checkDailyCap(POINT_ACTIONS.REPORT_PROGRAM_EVENT);

  // Calculate excluded taxonomies based on completed checklist items
  const excludedTaxonomies = useMemo(() => {
    const excluded = new Set();
    checklist.forEach(item => {
      if (item.completed) {
        const taxonomy = CHECKLIST_TO_TAXONOMY[item.label];
        if (taxonomy) {
          excluded.add(taxonomy);
        }
      }
    });
    return excluded;
  }, [checklist]);

  // Filter downloads
  const filteredDownloads = useMemo(() => {
    if (filter === 'all') {
      return MOCK_DOWNLOADS;
    }

    // Filter based on checklist completion (exclude completed topics)
    return MOCK_DOWNLOADS.filter(download =>
      !download.taxonomies.some(tax => excludedTaxonomies.has(tax))
    );
  }, [filter, excludedTaxonomies]);

  const handleAddEvent = () => {
    if (!newEvent.title.trim() || !newEvent.date) return;

    const event = {
      id: `custom_event_${Date.now()}`,
      title: newEvent.title.trim(),
      date: newEvent.date,
      sharedWithAdmin: newEvent.shareWithAdmin,
      programId
    };

    setCustomEvents(prev => [...prev, event]);
    setNewEvent({ title: '', date: '', shareWithAdmin: false });
    setIsAddEventOpen(false);

    // If shareWithAdmin is true, award points immediately and send to backend for review
    if (event.sharedWithAdmin) {
      // Award 10 points for sharing an event
      awardPoints(POINT_ACTIONS.REPORT_PROGRAM_EVENT, 10, {
        programId,
        schoolName,
        eventTitle: event.title,
        eventDate: event.date,
      });
      console.log('Event shared with admin for review:', event);
      // TODO: Send to backend for admin review
    }
  };

  const handleDeleteEvent = (eventId) => {
    setCustomEvents(prev => prev.filter(e => e.id !== eventId));
  };

  return (
    <div className="space-y-6">
      {/* Program Events */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="w-4 h-4 text-primary" />
              Program Events
            </CardTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsAddEventOpen(true)}
              className="min-h-9"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {customEvents.length === 0 ? (
            <div className="text-center py-6 px-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-gray-400" />
              </div>
              <h4 className="text-sm font-medium text-gray-700 mb-1">No events scheduled</h4>
              <p className="text-xs text-gray-500 mb-3">
                Check the program's website for upcoming info sessions, open houses, or deadline reminders.
              </p>
              {websiteUrl && (
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                >
                  <Globe className="w-3.5 h-3.5" />
                  Visit Program Website
                </a>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {customEvents.map(event => (
                <CustomEventCard
                  key={event.id}
                  event={event}
                  onDelete={handleDeleteEvent}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Event Dialog */}
      <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Program Event</DialogTitle>
            <DialogDescription>
              Track an info session, open house, or deadline for this program.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="eventTitle">Event Name *</Label>
              <Input
                id="eventTitle"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="e.g., Virtual Info Session, Application Deadline"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventDate">Date *</Label>
              <Input
                id="eventDate"
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              />
            </div>

            {eventCap.canSubmit ? (
              <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl border border-amber-200">
                <Checkbox
                  id="shareWithAdmin"
                  checked={newEvent.shareWithAdmin}
                  onCheckedChange={(checked) => setNewEvent({ ...newEvent, shareWithAdmin: checked })}
                />
                <div className="flex-1">
                  <label htmlFor="shareWithAdmin" className="text-sm font-medium text-amber-800 cursor-pointer">
                    Let us know about this event!
                  </label>
                  <p className="text-xs text-amber-700 mt-0.5">
                    Earn <strong>+10 points</strong> for sharing!
                  </p>
                </div>
                <Gift className="w-5 h-5 text-amber-500 shrink-0" />
              </div>
            ) : (
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <Checkbox
                  id="shareWithAdmin"
                  checked={false}
                  disabled
                />
                <div className="flex-1">
                  <label htmlFor="shareWithAdmin" className="text-sm font-medium text-gray-500 cursor-not-allowed">
                    Daily sharing limit reached
                  </label>
                  <p className="text-xs text-gray-400 mt-0.5">
                    You can share more events tomorrow. Thanks for your help!
                  </p>
                </div>
                <Gift className="w-5 h-5 text-gray-300 shrink-0" />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddEventOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddEvent}
              disabled={!newEvent.title.trim() || !newEvent.date}
            >
              Add Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Digital Downloads */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Download className="w-4 h-4 text-primary" />
              Digital Downloads
              <span className="text-sm font-normal text-gray-500">
                ({filteredDownloads.length})
              </span>
            </CardTitle>
          </div>

          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full mt-2">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recommended">Recommended for you</SelectItem>
              <SelectItem value="all">All Downloads</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>

        <CardContent className="pt-0">
          {filteredDownloads.length === 0 ? (
            <div className="text-center py-4">
              <Download className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">
                Great job! You've completed all the related topics.
              </p>
            </div>
          ) : (
            <div className="space-y-1 -mx-3">
              {filteredDownloads.slice(0, 6).map((download) => (
                <DownloadCard key={download.id} download={download} />
              ))}
            </div>
          )}

          {filteredDownloads.length > 6 && (
            <p className="text-xs text-center text-gray-500 mt-3">
              +{filteredDownloads.length - 6} more downloads
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
