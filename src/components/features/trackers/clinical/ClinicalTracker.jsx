/**
 * ClinicalTracker Component
 *
 * Main clinical experience tracker for MyTrackersPage including:
 * - Inline entry form (expandable, not modal)
 * - Celebratory shifts logged card with points
 * - Entry list with cards
 * - Two-column layout on desktop
 * - Sidebar with acuity score and top stats
 *
 * Layout: Two-column on desktop (main entries + sidebar with celebration/stats)
 */

import { useState, useMemo, useEffect, useRef } from 'react';
import {
  Heart,
  Plus,
  Sparkles,
  Trophy,
  TrendingUp,
  Users,
  Pill,
  Activity,
  Stethoscope,
  X,
  Clock,
  Star,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { usePromptState } from '@/hooks/usePromptState';
import { usePoints, POINT_ACTIONS } from '@/hooks/usePoints';
import { useBadgeCheck } from '@/hooks/useBadges';
import { toast } from 'sonner';

// Components
import { ClinicalEntryCard } from './ClinicalEntryCard';
import { AcuityScoreCard } from './AcuityScoreCard';
import { InlineClinicalEntryForm } from './InlineClinicalEntryForm';

// Data
import {
  mockClinicalEntries,
  getEntriesByDate,
} from '@/data/mockClinicalEntries';
import { calculateClinicalStats } from '@/data/clinicalCategories';

/**
 * Calculate days since last log
 */
function getDaysSinceLastLog(entries) {
  if (!entries || entries.length === 0) return null;

  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.shiftDate) - new Date(a.shiftDate)
  );

  const lastDate = new Date(sortedEntries[0].shiftDate);
  const today = new Date();
  const diffTime = today - lastDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

/**
 * Catch-up nudge messages
 */
const CATCH_UP_MESSAGES = [
  { days: 4, message: "It's been a few days - time to catch up on your recent shifts?" },
  { days: 7, message: "A week since your last log! Don't forget those great experiences." },
  { days: 14, message: "We miss you! Log your recent shifts while the memories are fresh." },
];

/**
 * Dismissible Catch-Up Nudge
 * - X button dismisses until next session (not permanent)
 * - After 5 dismisses, offer "Don't remind me again" option
 */
function CatchUpNudge({ daysSince, dismissCount, onLogShift, onDismiss, onSnooze, onPermanentDismiss }) {
  const catchUpMsg = CATCH_UP_MESSAGES.find((m) => daysSince >= m.days) ||
    CATCH_UP_MESSAGES[0];

  const showPermanentDismiss = dismissCount >= 5;

  return (
    <Card className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-100">
      <div className="flex items-start gap-3">
        <Clock className="w-8 h-8 text-amber-400 shrink-0" />
        <div className="flex-1">
          <p className="font-medium text-amber-900">{catchUpMsg.message}</p>
          <p className="text-sm text-amber-700 mt-1">
            {daysSince} days since your last log
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <Button size="sm" onClick={onLogShift}>
              Log Shift
            </Button>
            {showPermanentDismiss ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={onPermanentDismiss}
                className="text-amber-700 hover:text-amber-800 hover:bg-amber-100"
              >
                Don't remind me again
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={onSnooze}
                className="text-amber-700 hover:text-amber-800 hover:bg-amber-100"
              >
                Remind me in 3 days
              </Button>
            )}
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="p-1 hover:bg-amber-100 rounded-full transition-colors"
          aria-label="Dismiss until next session"
          title="Dismiss until next session"
        >
          <X className="w-4 h-4 text-amber-500" />
        </button>
      </div>
    </Card>
  );
}

/**
 * Top Stats Card for sidebar
 * Theme: Peach Sunrise (Clinical A) - secondary gradient
 */
function TopStatsCard({ stats }) {
  const { topPopulation, topMedication, topDevice, topProcedure } = stats;

  const statItems = [
    { icon: Users, label: 'Top Population', value: topPopulation },
    { icon: Pill, label: 'Top Medication', value: topMedication },
    { icon: Activity, label: 'Top Device', value: topDevice },
    { icon: Stethoscope, label: 'Top Procedure', value: topProcedure },
  ];

  return (
    <Card className="p-4 rounded-3xl border-0 bg-gradient-to-br from-[#FFF0EE] via-[#FFF6F0] to-[#FFFBE8]">
      <h4 className="font-semibold text-[#8B4030] mb-3 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-[#8B4030]" />
        Your Top Experience
      </h4>
      <div className="space-y-3">
        {statItems.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/60 flex items-center justify-center">
              <Icon className="w-4 h-4 text-[#8B4030]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[#A05040]/80">{label}</p>
              <p className="text-sm font-medium text-[#8B4030] truncate">
                {value || '—'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/**
 * Celebratory Shifts Logged Card
 * Theme: Peach Sunrise (Clinical A) - primary gradient (pink to yellow)
 */
function ShiftsLoggedCard({ totalShifts, onLogShift }) {
  const totalPoints = totalShifts * 2; // 2 points per shift logged
  const [isLevelUp, setIsLevelUp] = useState(false);
  const prevLevelRef = useRef(null);

  // Determine celebration level - Peach Sunrise gradient (pink top → yellow bottom)
  // Badge: "Critical Care Crusher" unlocks at 20 shifts
  const getCelebrationLevel = () => {
    if (totalShifts >= 20) return { level: 4, emoji: '🏆', message: 'Critical Care Crusher!' };
    if (totalShifts >= 10) return { level: 3, emoji: '🔥', message: 'On fire!' };
    if (totalShifts >= 5) return { level: 2, emoji: '⭐', message: 'Great progress!' };
    return { level: 1, emoji: '💪', message: 'Keep it up!' };
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
      'bg-gradient-to-br from-[#FFB0B5] via-[#FFCAB5] to-[#FFE0A0]'
    )}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-1/2 translate-x-1/2" />
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
            <div className="w-10 h-10 rounded-2xl bg-white/30 backdrop-blur-sm flex items-center justify-center">
              <Trophy className="w-5 h-5 text-[#8B4030]" />
            </div>
            <span className="font-semibold text-[#8B4030]">Shifts Logged</span>
          </div>
          <span className={cn(
            'text-3xl transition-transform duration-300',
            isLevelUp && 'animate-bounce'
          )}>{celebration.emoji}</span>
        </div>

        <div className="mb-4">
          <div className="text-5xl font-bold mb-1 text-[#8B4030]">{totalShifts}</div>
          <div className="text-[#A05040]/80 text-sm">{celebration.message}</div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 bg-white/30 backdrop-blur-sm rounded-full px-3 py-1.5">
            <Star className="w-4 h-4 fill-current text-[#8B4030]" />
            <span className="text-sm font-medium text-[#8B4030]">{totalPoints} pts earned</span>
          </div>
          <Button
            onClick={onLogShift}
            size="sm"
            className="bg-white/40 hover:bg-white/50 text-[#8B4030] border-0 backdrop-blur-sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            Log +5 pts
          </Button>
        </div>

        {/* Progress to badge hint */}
        {totalShifts < 20 && (
          <div className="mt-4 pt-3 border-t border-white/20">
            <div className="flex items-center gap-2 text-sm text-[#A05040]/80">
              <TrendingUp className="w-4 h-4" />
              <span>{20 - totalShifts} more to unlock "Critical Care Crusher" badge!</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

/**
 * Why This Matters coaching card
 * Theme: Peach Sunrise (Clinical A)
 */
function WhyItMattersCard() {
  return (
    <Card className="p-4 bg-white/80 backdrop-blur-sm rounded-3xl border border-white/20">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FFE0DC] to-[#FFF0D0] flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-[#8B4030]" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-1">
            Why track your clinical experience?
          </h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            Your clinical experience log becomes your interview prep goldmine. When programs
            ask "Tell me about a time you managed a complex patient," you'll have specific
            stories ready.
          </p>
        </div>
      </div>
    </Card>
  );
}

/**
 * Main ClinicalTracker component
 */
export function ClinicalTracker({ className }) {
  // State
  const [entries, setEntries] = useState(mockClinicalEntries);
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Points & badges hooks
  const { awardPoints } = usePoints();
  const { checkBadge } = useBadgeCheck('clinical_entries');

  // Nudge state from usePromptState hook (persisted to localStorage, ready for Supabase)
  const {
    getNudgeState,
    shouldShowNudge: checkNudgeVisibility,
    dismissNudge,
    snoozeNudge,
    permanentlyDismissNudge,
  } = usePromptState();

  const NUDGE_ID = 'clinical_catchup';
  const nudgeState = getNudgeState(NUDGE_ID);

  // Derived data
  const stats = useMemo(() => calculateClinicalStats(entries), [entries]);
  const sortedEntries = useMemo(() => getEntriesByDate(entries), [entries]);
  const daysSinceLastLog = useMemo(() => getDaysSinceLastLog(entries), [entries]);

  // Should show catch-up nudge?
  // Hook handles: permanent dismiss, snooze, and 24-hour X-button dismiss
  const showNudge = useMemo(() => {
    if (!checkNudgeVisibility(NUDGE_ID)) return false;
    // Check if enough days have passed
    return daysSinceLastLog !== null && daysSinceLastLog >= 4;
  }, [checkNudgeVisibility, daysSinceLastLog]);

  // Handlers
  const handleAddEntry = () => {
    setEditingEntry(null);
    setIsFormExpanded(true);
  };

  const handleEditEntry = (entry) => {
    setEditingEntry(entry);
    setIsFormExpanded(true);
  };

  const handleDeleteEntry = (id) => {
    setDeletingId(id);
  };

  const confirmDelete = () => {
    if (deletingId) {
      setEntries((prev) => prev.filter((e) => e.id !== deletingId));
      setDeletingId(null);
    }
  };

  const handleSubmit = async (formData) => {
    if (editingEntry) {
      // Update existing - no points for edits
      setEntries((prev) =>
        prev.map((e) => (e.id === editingEntry.id ? { ...formData, id: e.id } : e))
      );
    } else {
      // Add new entry
      const newEntry = {
        ...formData,
        id: `clin_${Date.now()}`,
        userId: 'user_123',
        pointsEarned: 2,
        createdAt: new Date().toISOString(),
      };
      setEntries((prev) => [newEntry, ...prev]);

      // Award points for new entry
      const pointResult = await awardPoints(POINT_ACTIONS.CLINICAL_LOG, null, {
        referenceId: newEntry.id,
        referenceType: 'clinical_entry',
      });

      if (pointResult.success) {
        toast.success(`+${pointResult.pointsAwarded} points earned!`);
      }

      // Check for badge (count includes new entry)
      const newCount = entries.length + 1;
      const badgeResult = await checkBadge(newCount);
      if (badgeResult) {
        toast.success(`🏆 Badge earned: ${badgeResult.name}!`, {
          description: badgeResult.description,
          duration: 5000,
        });
      }
    }
    setIsFormExpanded(false);
    setEditingEntry(null);
  };

  const handleCloseForm = () => {
    setIsFormExpanded(false);
    setEditingEntry(null);
  };

  // Dismiss for 24 hours (X button) - also increments dismiss count
  const handleDismissNudge = () => {
    dismissNudge(NUDGE_ID); // Increments dismissCount and sets lastDismissedAt
  };

  // Snooze for 3 days
  const handleSnoozeNudge = () => {
    snoozeNudge(NUDGE_ID, 3);
  };

  // Permanent dismiss (after 5 session dismisses)
  const handlePermanentDismiss = () => {
    permanentlyDismissNudge(NUDGE_ID);
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header - Theme: Peach Sunrise (Clinical A) */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFE0DC] to-[#FFF0D0] flex items-center justify-center">
          <Heart className="w-6 h-6 text-[#8B4030]" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Clinical Experience Tracker</h2>
          <p className="text-sm text-gray-500">
            Log your shifts, medications, devices, and procedures
          </p>
        </div>
      </div>

      {/* Form Modal */}
      <Dialog open={isFormExpanded} onOpenChange={(open) => {
        if (!open) {
          handleCloseForm();
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingEntry ? 'Edit Shift' : 'Log Shift'}
            </DialogTitle>
          </DialogHeader>
          <InlineClinicalEntryForm
            onSubmit={handleSubmit}
            onCancel={handleCloseForm}
            initialValues={editingEntry}
          />
        </DialogContent>
      </Dialog>

      {/* Main Content Grid - Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Shift List (2/3) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Primary CTA Button - Centered - Theme: Peach Sunrise */}
          <div className="flex justify-center py-2">
            <Button
              onClick={() => setIsFormExpanded(true)}
              size="lg"
              className="bg-gradient-to-r from-[#F09090] to-[#F8C080] hover:from-[#E88080] hover:to-[#F0B070] text-white shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5 mr-2" />
              Log Shift
            </Button>
          </div>

          {/* Section Header */}
          <h3 className="font-semibold text-gray-900">Entries</h3>

          {entries.length === 0 ? (
            <EmptyState
              icon={<Heart className="w-12 h-12 text-[#FFB0B5]" />}
              title="Log your first shift"
              description="Track the medications you titrate, devices you manage, and procedures you assist with. This builds your interview prep library."
              action={
                <Button
                  onClick={handleAddEntry}
                  className="bg-gradient-to-r from-[#F09090] to-[#F8C080] hover:from-[#E88080] hover:to-[#F0B070] text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Log Shift
                </Button>
              }
            />
          ) : (
            <div className="space-y-4">
              {sortedEntries.map((entry) => (
                <ClinicalEntryCard
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
          {/* Dismissible Catch-Up Nudge */}
          {showNudge && (
            <CatchUpNudge
              daysSince={daysSinceLastLog}
              dismissCount={nudgeState.dismissCount}
              onLogShift={handleAddEntry}
              onDismiss={handleDismissNudge}
              onSnooze={handleSnoozeNudge}
              onPermanentDismiss={handlePermanentDismiss}
            />
          )}

          {/* Celebratory Shifts Logged Card */}
          <ShiftsLoggedCard
            totalShifts={entries.length}
            onLogShift={handleAddEntry}
          />

          {/* Why It Matters (show for new users) */}
          {entries.length < 3 && <WhyItMattersCard />}

          {/* Top Stats Card */}
          <TopStatsCard stats={stats} />

          {/* Acuity Score */}
          <AcuityScoreCard entries={entries} />
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deletingId}
        onOpenChange={(open) => !open && setDeletingId(null)}
        title="Delete Clinical Entry?"
        description="This will permanently delete this shift entry. This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </div>
  );
}

export default ClinicalTracker;
