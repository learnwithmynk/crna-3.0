/**
 * ShadowDaysTracker Component
 *
 * Comprehensive shadow day tracking with two-column layout matching Clinical/EQ Trackers.
 *
 * Layout: Two-column on desktop (entries list 2/3 + sidebar 1/3)
 * - Top stats: Hours, Cases, Days, Skills Observed (with orange gradient borders)
 * - Left: Shadow day entries list
 * - Right sidebar: Hours logged card, Add Future Shadow Days, Ready-to-log, CRNA Network
 *
 * TODO: Replace mock data with API calls
 */

import { useState, useMemo, useEffect, useRef } from 'react';
import {
  Calendar,
  Plus,
  Clock,
  Stethoscope,
  Sparkles,
  Trophy,
  Star,
  TrendingUp,
  CalendarPlus,
  Users,
  Pencil,
  ChevronDown,
  ChevronUp,
  UserPlus,
  Activity,
  X,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input, Label } from '@/components/ui/input';
import { EmptyState } from '@/components/ui/empty-state';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

// Existing components
import { ShadowDayCard } from './ShadowDayCard';
import { InlineShadowDayForm } from './InlineShadowDayForm';
import { ShadowGoalEditDialog } from './ShadowGoalEditDialog';

// Data
import {
  mockShadowDays,
  mockUpcomingShadowDays,
  mockCRNANetwork,
  calculateShadowStats,
  getReadyToLogDays,
  userShadowGoal,
} from '@/data/shadowDaysEnhanced';

/**
 * Compact 3-column summary card for sidebar (Cases, Days, Skills)
 */
function ShadowSummaryCard({ stats }) {
  return (
    <Card className="p-4 rounded-3xl border-0 bg-gradient-to-br from-orange-200 via-amber-100 to-yellow-200">
      <h4 className="font-semibold text-orange-900 mb-3 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-orange-700" />
        Your Shadow Stats
      </h4>
      <div className="grid grid-cols-3 gap-3">
        {/* Cases Observed */}
        <div className="text-center">
          <div className="w-8 h-8 rounded-xl bg-white/60 flex items-center justify-center mx-auto mb-1.5">
            <Stethoscope className="w-4 h-4 text-orange-700" />
          </div>
          <div className="text-lg font-bold text-orange-900">{stats.totalCases}</div>
          <div className="text-xs text-orange-700">Cases</div>
        </div>

        {/* Shadow Days */}
        <div className="text-center border-x border-orange-200/50">
          <div className="w-8 h-8 rounded-xl bg-white/60 flex items-center justify-center mx-auto mb-1.5">
            <Calendar className="w-4 h-4 text-orange-700" />
          </div>
          <div className="text-lg font-bold text-orange-900">{stats.totalDays}</div>
          <div className="text-xs text-orange-700">Days</div>
        </div>

        {/* Skills Observed */}
        <div className="text-center">
          <div className="w-8 h-8 rounded-xl bg-white/60 flex items-center justify-center mx-auto mb-1.5">
            <Activity className="w-4 h-4 text-orange-700" />
          </div>
          <div className="text-lg font-bold text-orange-900">{stats.skillsCovered}</div>
          <div className="text-xs text-orange-700">Skills</div>
        </div>
      </div>
    </Card>
  );
}

/**
 * Hours Logged celebration card with edit button for goal
 */
function HoursLoggedCard({ totalHours, goal, onLogShadow, onEditGoal }) {
  const totalPoints = totalHours * 2;
  const progress = Math.min((totalHours / goal) * 100, 100);
  const [isLevelUp, setIsLevelUp] = useState(false);
  const prevLevelRef = useRef(null);

  // Dynamic orange/coral/peach gradients
  const getCelebrationLevel = () => {
    if (totalHours >= goal) return { level: 4, emoji: '🏆', message: 'Goal achieved!', color: 'from-[#FB923C] via-[#FDBA74] to-[#FCD34D]' };
    if (progress >= 75) return { level: 3, emoji: '🔥', message: 'Almost there!', color: 'from-[#FB923C] via-[#FDBA74] to-[#FCD34D]' };
    if (progress >= 50) return { level: 2, emoji: '☀️', message: 'Great progress!', color: 'from-[#FDBA74] via-[#FCD34D] to-[#FDE68A]' };
    return { level: 1, emoji: '🌅', message: 'Keep it up!', color: 'from-[#FDBA74] via-[#FDE68A] to-[#FEF3C7]' };
  };

  const celebration = getCelebrationLevel();

  // Detect level up and trigger animation
  useEffect(() => {
    if (prevLevelRef.current !== null && celebration.level > prevLevelRef.current) {
      setIsLevelUp(true);
      const timer = setTimeout(() => setIsLevelUp(false), 1000);
      return () => clearTimeout(timer);
    }
    prevLevelRef.current = celebration.level;
  }, [celebration.level]);

  return (
    <Card className={cn(
      'p-5 rounded-3xl shadow-lg border-0 overflow-hidden relative transition-all duration-500',
      `bg-gradient-to-br ${celebration.color}`
    )}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

      {/* Level up celebration burst */}
      {isLevelUp && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-white/30 rounded-full animate-ping" />
        </div>
      )}

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Trophy className="w-5 h-5 text-orange-800" />
            </div>
            <span className="font-semibold text-orange-900">Hours Logged</span>
          </div>
          {/* Edit goal button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onEditGoal}
            className="h-8 w-8 bg-white/20 hover:bg-white/30 text-orange-800"
          >
            <Pencil className="w-4 h-4" />
          </Button>
        </div>

        <div className="mb-4">
          {/* Hours with emoji next to the number */}
          <div className="flex items-center gap-2">
            <span className="text-5xl font-bold text-orange-900">{totalHours}</span>
            <span className={cn(
              'text-3xl transition-transform duration-300',
              isLevelUp && 'animate-bounce'
            )}>{celebration.emoji}</span>
          </div>
          <div className="text-orange-800/80 text-sm">
            of {goal}h goal • {celebration.message}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="w-full bg-white/30 rounded-full h-2">
            <div
              className="bg-orange-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 bg-white/30 backdrop-blur-sm rounded-full px-3 py-1.5">
            <Star className="w-4 h-4 text-orange-800 fill-current" />
            <span className="text-sm font-medium text-orange-900">{totalPoints} pts earned</span>
          </div>
          <Button
            onClick={onLogShadow}
            size="sm"
            className="bg-white/30 hover:bg-white/40 text-orange-900 border-0 backdrop-blur-sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            Log +5 pts
          </Button>
        </div>

        {totalHours < goal && (
          <div className="mt-4 pt-3 border-t border-orange-900/20">
            <div className="flex items-center gap-2 text-sm text-orange-800">
              <TrendingUp className="w-4 h-4" />
              <span>{goal - totalHours} more hours to reach your goal!</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

/**
 * Ready to Log actions card
 * Integrates with: Dashboard Calendar events, Onboarding shadow info
 */
function ReadyToLogCard({ readyToLog, onLog, onDismiss }) {
  if (readyToLog.length === 0) return null;

  return (
    <Card className="p-4 bg-orange-50 border-orange-100 rounded-3xl">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-orange-600" />
        <h4 className="font-semibold text-orange-900">Ready to Log</h4>
        <Badge className="bg-orange-200 text-orange-800 text-xs">
          {readyToLog.length}
        </Badge>
      </div>
      <p className="text-xs text-orange-700 mb-3">
        These shadow days have passed and are waiting to be logged.
      </p>
      <div className="space-y-2">
        {readyToLog.map((day) => (
          <div key={day.id} className="flex items-center justify-between p-2 bg-white rounded-xl">
            <div>
              <p className="text-sm font-medium text-gray-900">{day.location}</p>
              <p className="text-xs text-gray-500">
                {new Date(day.date).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-1">
              <Button size="sm" onClick={() => onLog(day)} className="bg-orange-500 hover:bg-orange-600 text-white">
                Log
              </Button>
              <Button size="sm" variant="ghost" onClick={() => onDismiss(day.id)} className="text-gray-400">
                ×
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/**
 * Add Future Shadow Days card with modal
 */
function AddFutureShadowCard({ onAddFuture }) {
  return (
    <Card className="p-4 rounded-3xl border-0 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FFBFB3] to-[#FFD6CC] flex items-center justify-center shrink-0">
          <CalendarPlus className="w-5 h-5 text-orange-700" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-1">
            Add Upcoming Shadow Days
          </h4>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            Add your upcoming shadow days. They'll appear in "Ready to Log" once the date passes.
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={onAddFuture}
            className="border-orange-200 text-orange-700 hover:bg-orange-50"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Upcoming Date
          </Button>
        </div>
      </div>
    </Card>
  );
}

/**
 * Future Shadow Day Modal
 */
function FutureShadowModal({ open, onClose, onSave }) {
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [providerName, setProviderName] = useState('');

  const handleSave = () => {
    if (!date || !location) return;
    onSave({
      id: `upcoming_${Date.now()}`,
      date: new Date(date).toISOString(),
      location,
      providerName: providerName || 'To be assigned',
      status: 'upcoming',
    });
    setDate('');
    setLocation('');
    setProviderName('');
    onClose();
  };

  const isValid = date && location;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule Future Shadow Day</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="shadow-date">
              Date <span className="text-red-500">*</span>
            </Label>
            <Input
              id="shadow-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shadow-location">
              Location / Hospital <span className="text-red-500">*</span>
            </Label>
            <Input
              id="shadow-location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Kaiser Permanente, Duke Hospital"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shadow-provider">
              CRNA Name (optional)
            </Label>
            <Input
              id="shadow-provider"
              value={providerName}
              onChange={(e) => setProviderName(e.target.value)}
              placeholder="Leave blank if not yet assigned"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!isValid}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
            >
              Add Shadow Day
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Why This Matters coaching card
 */
function WhyItMattersCard() {
  return (
    <Card className="p-4 bg-white/80 backdrop-blur-sm rounded-3xl border border-white/20">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FFBFB3] to-[#FFD6CC] flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-orange-700" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-1">
            Why shadow days matter
          </h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            Most CRNA programs require 24+ hours of shadowing. Beyond meeting requirements,
            shadowing helps you build your network and gather interview stories.
          </p>
        </div>
      </div>
    </Card>
  );
}

/**
 * CRNA Network Card - Simplified for right sidebar
 */
function CRNANetworkCard({ network, onAdd, onEdit }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="p-4 bg-white/80 backdrop-blur-sm rounded-3xl border border-white/20">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full text-left"
      >
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-orange-600" />
          <h3 className="font-semibold text-gray-900">My CRNA Network</h3>
          {network.length > 0 && (
            <Badge variant="outline" className="text-xs">
              {network.length}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => { e.stopPropagation(); onAdd(); }}
            className="h-8 w-8 p-0 text-orange-600"
          >
            <UserPlus className="w-4 h-4" />
          </Button>
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="mt-4 space-y-3">
          {network.length === 0 ? (
            <div className="text-center py-4">
              <UserPlus className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">
                Add CRNAs you've met
              </p>
              <Button size="sm" variant="outline" onClick={onAdd} className="mt-2">
                <Plus className="w-4 h-4 mr-1" />
                Add Contact
              </Button>
            </div>
          ) : (
            network.map((crna) => (
              <div key={crna.id} className="p-3 bg-gray-50 rounded-2xl">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900">{crna.name}</h4>
                    <p className="text-sm text-gray-500">{crna.facility}</p>
                    {crna.notes && (
                      <p className="text-xs text-gray-500 italic mt-1 line-clamp-2">
                        "{crna.notes}"
                      </p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit(crna)}
                    className="h-7 px-2 text-gray-400 hover:text-gray-600 shrink-0"
                  >
                    <Pencil className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                </div>
                {crna.email && (
                  <p className="text-xs text-orange-600 mt-2 truncate">
                    {crna.email}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </Card>
  );
}

/**
 * Contact Edit Modal
 */
function ContactEditModal({ open, onClose, contact, onSave, onDelete }) {
  const [name, setName] = useState(contact?.name || '');
  const [facility, setFacility] = useState(contact?.facility || '');
  const [email, setEmail] = useState(contact?.email || '');
  const [notes, setNotes] = useState(contact?.notes || '');

  // Reset when contact changes
  useState(() => {
    if (contact) {
      setName(contact.name || '');
      setFacility(contact.facility || '');
      setEmail(contact.email || '');
      setNotes(contact.notes || '');
    } else {
      setName('');
      setFacility('');
      setEmail('');
      setNotes('');
    }
  }, [contact]);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      id: contact?.id || `crna_${Date.now()}`,
      name: name.trim(),
      facility: facility.trim(),
      email: email.trim(),
      notes: notes.trim(),
      totalHoursShadowed: contact?.totalHoursShadowed || 0,
      relationshipStatus: contact?.relationshipStatus || 'just_met',
      metAt: contact?.metAt || 'networking',
    });
    onClose();
  };

  const isEditing = !!contact?.id;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Contact' : 'Add CRNA Contact'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="contact-name">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="contact-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="CRNA's name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-facility">Hospital / Facility</Label>
            <Input
              id="contact-facility"
              value={facility}
              onChange={(e) => setFacility(e.target.value)}
              placeholder="Where they work"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-email">Email</Label>
            <Input
              id="contact-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="their.email@hospital.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-notes">Notes</Label>
            <Input
              id="contact-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How you met, what you discussed..."
            />
          </div>

          <div className="flex justify-between pt-2">
            {isEditing && onDelete ? (
              <Button
                variant="ghost"
                onClick={() => { onDelete(contact.id); onClose(); }}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Delete
              </Button>
            ) : (
              <div />
            )}
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!name.trim()}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
              >
                {isEditing ? 'Save Changes' : 'Add Contact'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Main ShadowDaysTracker component
 */
export function ShadowDaysTracker({ className }) {
  // State
  const [entries, setEntries] = useState(mockShadowDays);
  const [upcomingDays, setUpcomingDays] = useState(mockUpcomingShadowDays);
  const [network, setNetwork] = useState(mockCRNANetwork);
  const [goal, setGoal] = useState(userShadowGoal);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [isFutureModalOpen, setIsFutureModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [prefilledEntry, setPrefilledEntry] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Network state
  const [editingContact, setEditingContact] = useState(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Derived data
  const stats = useMemo(() => calculateShadowStats(entries), [entries]);
  const readyToLog = useMemo(() => getReadyToLogDays(upcomingDays), [upcomingDays]);

  // Sort entries by date (newest first)
  const sortedEntries = useMemo(
    () => [...entries].sort((a, b) => new Date(b.date) - new Date(a.date)),
    [entries]
  );

  // Handlers
  const handleAddEntry = () => {
    setEditingEntry(null);
    setPrefilledEntry(null);
    setIsFormOpen(true);
  };

  const handleEditEntry = (entry) => {
    setEditingEntry(entry);
    setPrefilledEntry(null);
    setIsFormOpen(true);
  };

  const handleDeleteEntry = (id) => {
    setDeletingId(id);
  };

  const confirmDelete = () => {
    if (deletingId) {
      setEntries(prev => prev.filter(e => e.id !== deletingId));
      setDeletingId(null);
    }
  };

  const handleLogFromUpcoming = (upcoming) => {
    setPrefilledEntry({
      date: upcoming.date,
      location: upcoming.location,
      providerName: upcoming.providerName !== 'To be assigned' ? upcoming.providerName : '',
      providerEmail: upcoming.providerEmail || '',
      hoursLogged: upcoming.hoursLogged || '',
      casesObserved: '',
      skillsObserved: [],
      notes: upcoming.notes || '',
    });
    setEditingEntry(null);
    setIsFormOpen(true);
    setUpcomingDays(prev => prev.filter(d => d.id !== upcoming.id));
  };

  const handleDismissReadyToLog = (id) => {
    setUpcomingDays(prev => prev.filter(d => d.id !== id));
  };

  const handleSubmit = (formData) => {
    if (editingEntry) {
      setEntries(prev =>
        prev.map(e => (e.id === editingEntry.id ? { ...formData, id: e.id } : e))
      );
    } else {
      const newEntry = {
        ...formData,
        id: `shadow_${Date.now()}`,
        status: 'logged',
        followUpStatus: 'none',
        savedToNetwork: false,
      };
      setEntries(prev => [newEntry, ...prev]);
    }
    setIsFormOpen(false);
    setEditingEntry(null);
    setPrefilledEntry(null);
  };

  const handleAddFutureShadow = (futureDay) => {
    setUpcomingDays(prev => [...prev, futureDay]);
  };

  // Network handlers
  const handleAddContact = () => {
    setEditingContact(null);
    setIsContactModalOpen(true);
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setIsContactModalOpen(true);
  };

  const handleSaveContact = (contactData) => {
    if (editingContact) {
      setNetwork(prev => prev.map(c => c.id === contactData.id ? contactData : c));
    } else {
      setNetwork(prev => [...prev, contactData]);
    }
  };

  const handleDeleteContact = (id) => {
    setNetwork(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFBFB3] to-[#FFD6CC] flex items-center justify-center">
          <Calendar className="w-6 h-6 text-orange-700" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Shadow Days Tracker</h2>
          <p className="text-sm text-gray-500">
            Track shadowing experiences and build your CRNA network
          </p>
        </div>
      </div>

      {/* Shadow Day Entry Modal */}
      <Dialog open={isFormOpen} onOpenChange={(open) => {
        if (!open) {
          setIsFormOpen(false);
          setEditingEntry(null);
          setPrefilledEntry(null);
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingEntry ? 'Edit Shadow Day' : 'Log Shadow Day'}
            </DialogTitle>
          </DialogHeader>
          <InlineShadowDayForm
            onSubmit={handleSubmit}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingEntry(null);
              setPrefilledEntry(null);
            }}
            initialValues={editingEntry || prefilledEntry}
          />
        </DialogContent>
      </Dialog>

      {/* Main Content Grid - Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Shadow Days List (2/3) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Primary CTA Button - Centered */}
          <div className="flex justify-center py-2">
            <Button
              onClick={() => setIsFormOpen(true)}
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5 mr-2" />
              Log Shadow Day
            </Button>
          </div>

          {/* Section Header */}
          <h3 className="font-semibold text-gray-900">Entries</h3>

          {entries.length === 0 ? (
            <EmptyState
              icon={<Calendar className="w-12 h-12 text-orange-300" />}
              title="Log your first shadow day"
              description="Track your hours, skills observed, and CRNAs you meet. Most programs require 24+ hours."
              action={
                <Button
                  onClick={handleAddEntry}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Log Shadow Day
                </Button>
              }
            />
          ) : (
            <div className="space-y-4">
              {sortedEntries.map((entry) => (
                <ShadowDayCard
                  key={entry.id}
                  entry={entry}
                  onEdit={handleEditEntry}
                  onDelete={handleDeleteEntry}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Sidebar (1/3) */}
        <div className="space-y-4 order-first lg:order-last">
          {/* Hours Logged celebration card */}
          <HoursLoggedCard
            totalHours={stats.totalHours}
            goal={goal}
            onLogShadow={handleAddEntry}
            onEditGoal={() => setIsGoalDialogOpen(true)}
          />

          {/* Compact summary: Cases, Days, Skills */}
          <ShadowSummaryCard stats={stats} />

          {/* Add Future Shadow Days - above Ready to Log */}
          <AddFutureShadowCard onAddFuture={() => setIsFutureModalOpen(true)} />

          {/* Ready to Log actions */}
          <ReadyToLogCard
            readyToLog={readyToLog}
            onLog={handleLogFromUpcoming}
            onDismiss={handleDismissReadyToLog}
          />

          {/* CRNA Network */}
          <CRNANetworkCard
            network={network}
            onAdd={handleAddContact}
            onEdit={handleEditContact}
          />

          {/* Why it matters - for new users */}
          {entries.length < 2 && <WhyItMattersCard />}
        </div>
      </div>

      {/* Goal Edit Dialog */}
      <ShadowGoalEditDialog
        open={isGoalDialogOpen}
        onOpenChange={setIsGoalDialogOpen}
        currentGoal={goal}
        onSave={setGoal}
      />

      {/* Future Shadow Day Modal */}
      <FutureShadowModal
        open={isFutureModalOpen}
        onClose={() => setIsFutureModalOpen(false)}
        onSave={handleAddFutureShadow}
      />

      {/* Contact Edit Modal */}
      <ContactEditModal
        open={isContactModalOpen}
        onClose={() => { setIsContactModalOpen(false); setEditingContact(null); }}
        contact={editingContact}
        onSave={handleSaveContact}
        onDelete={handleDeleteContact}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deletingId}
        onOpenChange={(open) => !open && setDeletingId(null)}
        title="Delete Shadow Day?"
        description="This will permanently delete this shadow day entry. This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </div>
  );
}

export default ShadowDaysTracker;
