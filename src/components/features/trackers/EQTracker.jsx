/**
 * EQTracker Component
 *
 * Main EQ/Leadership tracker for documenting emotional intelligence
 * experiences and soft skills for CRNA school interview prep.
 *
 * Layout: Two-column on desktop (entries list + sidebar with celebration cards)
 * - Top EQ Skill card with lavender gradient
 * - Reflections Logged card with grape gradient
 * - Horizontal scroll prompt carousel
 * - My reflections log
 *
 * TODO: Replace mock data with API calls
 */

import { useState, useMemo, useRef } from 'react';
import {
  Brain,
  Plus,
  Sparkles,
  Trophy,
  Star,
  TrendingUp,
  Crown,
  Lightbulb,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Clock,
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

import { EQReflectionCard } from './EQReflectionCard';
import { EQReflectionForm } from './EQReflectionForm';

import {
  mockEQReflections,
  EQ_CATEGORIES,
  REFLECTION_PROMPTS,
  getCategoryInfo,
} from '@/data/mockEQReflections';

/**
 * Calculate days since last reflection
 */
function getDaysSinceLastReflection(reflections) {
  if (!reflections || reflections.length === 0) return null;

  const sortedReflections = [...reflections].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const lastDate = new Date(sortedReflections[0].date);
  const today = new Date();
  const diffTime = today - lastDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

/**
 * Weekly reflection nudge messages
 */
const EQ_NUDGE_MESSAGES = [
  { days: 7, message: "It's been a week - got any leadership moments to reflect on?" },
  { days: 14, message: "Two weeks since your last reflection. Capture those EQ stories!" },
  { days: 21, message: "Build your interview story bank! Log a recent leadership experience." },
];

/**
 * EQ Weekly Reflection Nudge - Sunshine theme (light yellow)
 * Triggers after 7+ days without a reflection
 */
function EQReflectionNudge({ daysSince, dismissCount, onAddReflection, onDismiss, onSnooze, onPermanentDismiss }) {
  const nudgeMsg = EQ_NUDGE_MESSAGES.find((m) => daysSince >= m.days) ||
    EQ_NUDGE_MESSAGES[0];

  const showPermanentDismiss = dismissCount >= 5;

  return (
    <Card className="p-4 bg-gradient-to-r from-[#FFFBE5] to-[#FFF8D5] border-[#FFE055]/30">
      <div className="flex items-start gap-3">
        <Clock className="w-8 h-8 text-[#B8860B] shrink-0" />
        <div className="flex-1">
          <p className="font-medium text-[#7A5500]">{nudgeMsg.message}</p>
          <p className="text-sm text-[#B8860B] mt-1">
            {daysSince} days since your last reflection
          </p>
          <div className="flex items-center gap-4 mt-3">
            <Button
              size="sm"
              onClick={onAddReflection}
              className="bg-[#7A5500] hover:bg-[#5A4000] text-white"
            >
              Add Reflection
            </Button>
            {showPermanentDismiss ? (
              <button
                onClick={onPermanentDismiss}
                className="text-sm text-[#B8860B] hover:text-[#7A5500] hover:underline"
              >
                Don't remind me again
              </button>
            ) : (
              <button
                onClick={onSnooze}
                className="text-sm text-[#B8860B] hover:text-[#7A5500] hover:underline"
              >
                Remind me in 3 days
              </button>
            )}
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="p-1 hover:bg-[#FFE055]/30 rounded-full transition-colors"
          aria-label="Dismiss until next session"
          title="Dismiss until next session"
        >
          <X className="w-4 h-4 text-[#B8860B]" />
        </button>
      </div>
    </Card>
  );
}

/**
 * Top EQ Skill Card - Sunshine theme (A) - secondary gradient
 */
function TopSkillCard({ reflections }) {
  // Calculate which category appears most
  const categoryCount = {};
  reflections.forEach((r) => {
    r.categories.forEach((cat) => {
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });
  });

  const topCategory = Object.entries(categoryCount)
    .sort(([, a], [, b]) => b - a)[0];

  const categoryInfo = topCategory ? getCategoryInfo(topCategory[0]) : null;

  return (
    <Card className="p-5 rounded-3xl shadow-lg border-0 overflow-hidden relative bg-gradient-to-br from-[#FFFBE5] via-[#FFFCEE] to-[#FFFDF8]">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/30 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/20 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-white/60 flex items-center justify-center">
              <Crown className="w-5 h-5 text-[#7A5500]" />
            </div>
            <span className="font-semibold text-[#7A5500]">Top EQ Skill</span>
          </div>
        </div>

        {categoryInfo ? (
          <div className="mb-2">
            <div className="text-2xl font-bold text-[#7A5500] mb-1">
              {categoryInfo.label}
            </div>
            <div className="text-[#8B6510]/80 text-sm">
              {topCategory[1]} reflection{topCategory[1] > 1 ? 's' : ''} logged
            </div>
          </div>
        ) : (
          <div className="text-[#8B6510]/80 text-sm">
            Log your first reflection to see your top skill
          </div>
        )}

        <div className="mt-3 pt-3 border-t border-[#7A5500]/20">
          <div className="text-xs text-[#8B6510]/80">
            {reflections.length > 0
              ? `Covering ${new Set(reflections.flatMap(r => r.categories)).size} of ${EQ_CATEGORIES.length} categories`
              : 'Track your emotional intelligence growth'}
          </div>
        </div>
      </div>
    </Card>
  );
}

/**
 * Reflections Logged Card - Sunshine theme (A) - primary gradient (yellow to cream)
 */
function ReflectionsLoggedCard({ totalReflections, onLogReflection }) {
  const totalPoints = totalReflections * 2;

  // Determine celebration level
  const getCelebrationLevel = () => {
    if (totalReflections >= 15) return { emoji: '🏆', message: 'EQ Master!' };
    if (totalReflections >= 10) return { emoji: '🔥', message: 'On fire!' };
    if (totalReflections >= 5) return { emoji: '⭐', message: 'Great progress!' };
    return { emoji: '💪', message: 'Keep it up!' };
  };

  const celebration = getCelebrationLevel();

  return (
    <Card className="p-5 rounded-3xl shadow-lg border-0 overflow-hidden relative bg-gradient-to-br from-[#FFE055] via-[#FFE878] to-[#FFFBE0]">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-white/30 backdrop-blur-sm flex items-center justify-center">
              <Trophy className="w-5 h-5 text-[#7A5500]" />
            </div>
            <span className="font-semibold text-[#7A5500]">Reflections Logged</span>
          </div>
          <span className="text-3xl">{celebration.emoji}</span>
        </div>

        <div className="mb-4">
          <div className="text-5xl font-bold mb-1 text-[#7A5500]">{totalReflections}</div>
          <div className="text-[#8B6510]/80 text-sm">{celebration.message}</div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 bg-white/30 backdrop-blur-sm rounded-full px-3 py-1.5">
            <Star className="w-4 h-4 fill-current text-[#7A5500]" />
            <span className="text-sm font-medium text-[#7A5500]">{totalPoints} pts earned</span>
          </div>
          <Button
            onClick={onLogReflection}
            size="sm"
            className="bg-white/40 hover:bg-white/50 text-[#7A5500] border-0 backdrop-blur-sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            Log +5 pts
          </Button>
        </div>

        {/* Progress to badge hint */}
        {totalReflections < 15 && (
          <div className="mt-4 pt-3 border-t border-[#7A5500]/20">
            <div className="flex items-center gap-2 text-sm text-[#8B6510]/80">
              <TrendingUp className="w-4 h-4" />
              <span>{15 - totalReflections} more to unlock "EQ Master" badge!</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

/**
 * Why This Matters coaching card - Sunshine theme (A)
 */
function WhyItMattersCard() {
  return (
    <Card className="p-4 bg-white/80 backdrop-blur-sm rounded-3xl border border-white/20">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FFF2B8] to-[#FFF8D5] flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-[#7A5500]" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-1">
            Why track EQ experiences?
          </h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            CRNA interviews heavily emphasize behavioral questions. Having documented
            examples of conflict resolution, leadership, and teamwork gives you
            concrete stories to share.
          </p>
        </div>
      </div>
    </Card>
  );
}


/**
 * Prompt card for vertical grid - Sunshine theme (yellow)
 */
function PromptCard({ prompt, onStart, isHighlighted }) {
  const categoryInfo = getCategoryInfo(prompt.category);

  return (
    <button
      onClick={() => onStart(prompt)}
      className={cn(
        'w-full p-4 rounded-2xl text-left transition-all',
        'border-2 hover:shadow-md',
        isHighlighted
          ? 'border-[#FFE055] bg-[#FFFBE5]/80'
          : 'border-[#FFE055]/40 bg-white/80 hover:border-[#FFE055]/70'
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        {categoryInfo && (
          <span className={cn(
            'text-xs font-medium px-2 py-0.5 rounded-full',
            categoryInfo.color
          )}>
            {categoryInfo.label}
          </span>
        )}
        {isHighlighted && (
          <span className="text-xs text-[#B8860B] font-medium">New!</span>
        )}
      </div>
      <h4 className="font-medium text-gray-900 text-sm mb-1">
        {prompt.title}
      </h4>
      <p className="text-xs text-gray-500 line-clamp-2">
        {prompt.prompt}
      </p>
    </button>
  );
}

/**
 * Collapsible prompt grid with gradient header - Sunshine theme (yellow)
 */
function PromptGrid({ onStartReflection, usedCategories = [] }) {
  const scrollRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Prioritize unused categories
  const sortedPrompts = useMemo(() => {
    const unused = REFLECTION_PROMPTS.filter(p => !usedCategories.includes(p.category));
    const used = REFLECTION_PROMPTS.filter(p => usedCategories.includes(p.category));
    return [...unused, ...used];
  }, [usedCategories]);

  // Group prompts into pages of 4 (2x2 grid)
  const promptPages = useMemo(() => {
    const pages = [];
    for (let i = 0; i < sortedPrompts.length; i += 4) {
      pages.push(sortedPrompts.slice(i, i + 4));
    }
    return pages;
  }, [sortedPrompts]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const containerWidth = scrollRef.current.offsetWidth;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -containerWidth : containerWidth,
        behavior: 'smooth',
      });
    }
  };

  // Count unused prompts for badge
  const unusedCount = sortedPrompts.filter(p => !usedCategories.includes(p.category)).length;

  return (
    <div className="rounded-3xl overflow-hidden border border-[#FFE055]/40 shadow-sm">
      {/* Gradient Header Bar - Clickable to expand/collapse - Sunshine theme */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#FFFBE5] via-[#FFF8D5] to-[#FFF2B8] hover:from-[#FFF8D5] hover:via-[#FFF2B8] hover:to-[#FFECB0] transition-colors"
      >
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-[#B8860B]" />
          <h3 className="font-semibold text-[#7A5500]">Reflection Prompts</h3>
          {unusedCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-medium bg-[#FFE055]/50 text-[#7A5500] rounded-full">
              {unusedCount} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#B8860B]">
            {isExpanded ? 'Hide' : 'Show'} prompts
          </span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-[#B8860B]" />
          ) : (
            <ChevronDown className="w-5 h-5 text-[#B8860B]" />
          )}
        </div>
      </button>

      {/* Expandable Content */}
      <div
        className={cn(
          'grid transition-all duration-300 ease-in-out bg-white/80',
          isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        )}
      >
        <div className="overflow-hidden">
          <div className="p-4">
            {/* Carousel with arrows on sides */}
            <div className="flex items-center gap-2">
              {/* Left Arrow */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => scroll('left')}
                className="h-10 w-10 p-0 text-gray-400 hover:text-[#7A5500] hover:bg-[#FFF8D5] rounded-full shrink-0"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>

              {/* Scrollable 2x2 grid container */}
              <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory flex-1"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {promptPages.map((page, pageIndex) => (
                  <div
                    key={pageIndex}
                    className="grid grid-cols-2 grid-rows-2 gap-3 min-w-full snap-center"
                  >
                    {page.map((prompt) => (
                      <PromptCard
                        key={prompt.id}
                        prompt={prompt}
                        onStart={onStartReflection}
                        isHighlighted={!usedCategories.includes(prompt.category)}
                      />
                    ))}
                  </div>
                ))}
              </div>

              {/* Right Arrow */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => scroll('right')}
                className="h-10 w-10 p-0 text-gray-400 hover:text-[#7A5500] hover:bg-[#FFF8D5] rounded-full shrink-0"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Main EQTracker component
 */
export function EQTracker({ className }) {
  // State
  const [reflections, setReflections] = useState(mockEQReflections);
  const [showForm, setShowForm] = useState(false);
  const [editingReflection, setEditingReflection] = useState(null);
  const [promptContext, setPromptContext] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Nudge state from usePromptState hook (persisted to localStorage, ready for Supabase)
  const {
    getNudgeState,
    shouldShowNudge: checkNudgeVisibility,
    dismissNudge,
    snoozeNudge,
    permanentlyDismissNudge,
  } = usePromptState();

  const NUDGE_ID = 'eq_reflection';
  const nudgeState = getNudgeState(NUDGE_ID);

  // Derived data
  const usedCategories = useMemo(() => {
    const cats = new Set();
    reflections.forEach((r) => r.categories.forEach((c) => cats.add(c)));
    return Array.from(cats);
  }, [reflections]);

  // Sort reflections by date (newest first)
  const sortedReflections = useMemo(
    () => [...reflections].sort((a, b) => new Date(b.date) - new Date(a.date)),
    [reflections]
  );

  // Calculate days since last reflection
  const daysSinceLastReflection = useMemo(
    () => getDaysSinceLastReflection(reflections),
    [reflections]
  );

  // Should show weekly nudge? (7+ days since last reflection)
  // Hook handles: permanent dismiss, snooze, and 24-hour X-button dismiss
  const showNudge = useMemo(() => {
    if (!checkNudgeVisibility(NUDGE_ID)) return false;
    // Check if enough days have passed (7+ days)
    return daysSinceLastReflection !== null && daysSinceLastReflection >= 7;
  }, [checkNudgeVisibility, daysSinceLastReflection]);

  // Handlers
  const handleStartFromPrompt = (prompt) => {
    setPromptContext(prompt);
    setEditingReflection(null);
    setShowForm(true);
  };

  const handleNewReflection = () => {
    setPromptContext(null);
    setEditingReflection(null);
    setShowForm(true);
  };

  const handleEdit = (reflection) => {
    setEditingReflection(reflection);
    setPromptContext(null);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setDeletingId(id);
  };

  const confirmDelete = () => {
    if (deletingId) {
      setReflections((prev) => prev.filter((r) => r.id !== deletingId));
      setDeletingId(null);
    }
  };

  const handleSave = (data) => {
    if (editingReflection) {
      // Update existing
      setReflections((prev) =>
        prev.map((r) => (r.id === editingReflection.id ? { ...r, ...data } : r))
      );
    } else {
      // Add new
      setReflections((prev) => [data, ...prev]);
    }
    setShowForm(false);
    setEditingReflection(null);
    setPromptContext(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingReflection(null);
    setPromptContext(null);
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
      {/* Header - Sunshine theme (A) */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFF2B8] to-[#FFF8D5] flex items-center justify-center">
          <Brain className="w-6 h-6 text-[#7A5500]" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">EQ Tracker</h2>
          <p className="text-sm text-gray-500">
            Document leadership & emotional intelligence experiences
          </p>
        </div>
      </div>

      {/* Main Content Grid - Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Reflections List (2/3) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Prompt Grid - Vertical compact layout */}
          <PromptGrid
            onStartReflection={handleStartFromPrompt}
            usedCategories={usedCategories}
          />

          {/* Primary CTA Button - Centered - Sunshine theme (amber/gold) */}
          <div className="flex justify-center py-2">
            <Button
              onClick={handleNewReflection}
              size="lg"
              className="bg-gradient-to-r from-[#FFD54F] to-[#FFB300] hover:from-[#FFC107] hover:to-[#FFA000] text-[#5D4037] shadow-md hover:shadow-lg transition-all font-semibold"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Reflection
            </Button>
          </div>

          {/* Section Header */}
          <h3 className="font-semibold text-gray-900">Entries</h3>

          {/* Form Modal */}
          <Dialog open={showForm} onOpenChange={(open) => {
            if (!open) {
              handleCancel();
            }
          }}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingReflection ? 'Edit Reflection' : 'New Reflection'}
                </DialogTitle>
              </DialogHeader>
              <EQReflectionForm
                initialValues={editingReflection || {}}
                promptContext={promptContext}
                onSave={handleSave}
                onCancel={handleCancel}
                isEditing={!!editingReflection}
              />
            </DialogContent>
          </Dialog>

          {reflections.length === 0 ? (
            <EmptyState
              icon={<Brain className="w-12 h-12 text-[#FFD54F]" />}
              title="No reflections yet"
              description="Start documenting your leadership and EQ experiences to prepare for interviews."
              action={
                <Button
                  onClick={handleNewReflection}
                  className="bg-gradient-to-r from-[#FFD54F] to-[#FFB300] hover:from-[#FFC107] hover:to-[#FFA000] text-[#5D4037] font-semibold"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Reflection
                </Button>
              }
            />
          ) : (
            <div className="space-y-4">
              {sortedReflections.map((reflection) => (
                <EQReflectionCard
                  key={reflection.id}
                  reflection={reflection}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Sidebar (1/3) */}
        <div className="space-y-4 order-first lg:order-last">
          {/* Dismissible Weekly Reflection Nudge */}
          {showNudge && (
            <EQReflectionNudge
              daysSince={daysSinceLastReflection}
              dismissCount={nudgeState.dismissCount}
              onAddReflection={handleNewReflection}
              onDismiss={handleDismissNudge}
              onSnooze={handleSnoozeNudge}
              onPermanentDismiss={handlePermanentDismiss}
            />
          )}

          {/* Reflections Logged Card */}
          <ReflectionsLoggedCard
            totalReflections={reflections.length}
            onLogReflection={handleNewReflection}
          />

          {/* Top EQ Skill Card */}
          <TopSkillCard reflections={reflections} />

          {/* Why It Matters (show for new users) */}
          {reflections.length < 3 && <WhyItMattersCard />}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deletingId}
        onOpenChange={(open) => !open && setDeletingId(null)}
        title="Delete Reflection?"
        description="This will permanently delete this reflection. This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </div>
  );
}

export default EQTracker;
