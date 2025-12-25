/**
 * MyProgramsPage - Manage saved and target programs
 *
 * Features:
 * - Vertical stack with Target Programs featured at top
 * - School images on cards
 * - Drag-and-drop between sections to promote/demote
 * - Target programs link to detail page for tracking
 * - Sorted by deadline urgency
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from '@dnd-kit/core';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { StatusBadge } from '@/components/ui/status-badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePrograms } from '@/hooks/usePrograms';
import { useUser } from '@/hooks/useUser';
import {
  Target,
  Bookmark,
  Search,
  MapPin,
  GripVertical,
  X,
  AlertTriangle,
  Clock,
  Sparkles,
  CheckCircle2,
  ListChecks,
  BookOpen,
  GraduationCap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getDeadlineStatus } from '@/lib/dateFormatters';

// localStorage key for tracking if user has seen the "Make Target" explanation
const HAS_SEEN_TARGET_EXPLANATION_KEY = 'crna_has_seen_target_explanation';

export function MyProgramsPage() {
  const { user } = useUser();
  const {
    targetPrograms,
    savedPrograms,
    convertToTarget,
    revertToSaved,
    removeProgram,
  } = usePrograms();

  // Get user's first name for background text
  const firstName = user?.preferredName || user?.name?.split(' ')[0] || 'My';

  // Drag state
  const [activeId, setActiveId] = useState(null);
  const [activeProgram, setActiveProgram] = useState(null);

  // Dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    type: null,
    program: null,
  });

  // Track if user has seen the target explanation
  const [hasSeenTargetExplanation, setHasSeenTargetExplanation] = useState(() => {
    try {
      return localStorage.getItem(HAS_SEEN_TARGET_EXPLANATION_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Filter state for saved programs
  const [savedSearch, setSavedSearch] = useState('');
  const [savedFilters, setSavedFilters] = useState({
    greNotRequired: false,
    greRequired: false,
    state: 'all',
  });

  // Non-target saved programs
  const savedOnlyPrograms = savedPrograms.filter(
    (p) => !targetPrograms.some((t) => t.programId === p.programId)
  );

  // Sort target programs by deadline (earliest first)
  const sortedTargetPrograms = useMemo(() => {
    return [...targetPrograms].sort((a, b) => {
      const aDate = a.program?.applicationDeadline ? new Date(a.program.applicationDeadline) : new Date('2099-12-31');
      const bDate = b.program?.applicationDeadline ? new Date(b.program.applicationDeadline) : new Date('2099-12-31');
      return aDate - bDate;
    });
  }, [targetPrograms]);

  // Get unique states from saved programs
  const savedProgramStates = useMemo(() => {
    const states = new Set();
    savedOnlyPrograms.forEach(p => {
      if (p.program?.location?.state) {
        states.add(p.program.location.state);
      }
    });
    return Array.from(states).sort();
  }, [savedOnlyPrograms]);

  // Check if any filters are active
  const hasActiveFilters = savedSearch || savedFilters.greNotRequired || savedFilters.greRequired || savedFilters.state !== 'all';

  // Clear all filters
  const clearFilters = () => {
    setSavedSearch('');
    setSavedFilters({ greNotRequired: false, greRequired: false, state: 'all' });
  };

  // Filter saved programs
  const filteredSavedPrograms = useMemo(() => {
    let filtered = savedOnlyPrograms;

    // Apply search filter
    if (savedSearch.trim()) {
      const search = savedSearch.toLowerCase();
      filtered = filtered.filter(p =>
        p.program?.schoolName?.toLowerCase().includes(search) ||
        p.program?.location?.state?.toLowerCase().includes(search) ||
        p.program?.location?.city?.toLowerCase().includes(search)
      );
    }

    // Apply GRE filters
    if (savedFilters.greNotRequired && !savedFilters.greRequired) {
      filtered = filtered.filter(p => !p.program?.greRequired);
    } else if (savedFilters.greRequired && !savedFilters.greNotRequired) {
      filtered = filtered.filter(p => p.program?.greRequired);
    }

    // Apply state filter
    if (savedFilters.state !== 'all') {
      filtered = filtered.filter(p => p.program?.location?.state === savedFilters.state);
    }

    return filtered;
  }, [savedOnlyPrograms, savedFilters, savedSearch]);

  // Configure drag sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Handle drag start
  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
    const program = [...targetPrograms, ...savedOnlyPrograms].find(
      (p) => p.id === active.id
    );
    setActiveProgram(program);
  };

  // Handle drag end
  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    setActiveProgram(null);

    if (!over) return;

    const programId = active.id;
    const dropZone = over.id;

    const isCurrentlyTarget = targetPrograms.some((p) => p.id === programId);

    if (dropZone === 'targets-zone' && !isCurrentlyTarget) {
      // Promote to target
      const program = savedOnlyPrograms.find((p) => p.id === programId);
      if (program) {
        // If user has seen the explanation before, skip the dialog
        if (hasSeenTargetExplanation) {
          convertToTarget(program.programId);
        } else {
          setConfirmDialog({
            open: true,
            type: 'convertToTarget',
            program,
          });
        }
      }
    } else if (dropZone === 'saved-zone' && isCurrentlyTarget) {
      // Demote to saved - show confirmation
      const program = targetPrograms.find((p) => p.id === programId);
      if (program) {
        setConfirmDialog({
          open: true,
          type: 'revertToSaved',
          program,
        });
      }
    }
  };

  // Handle unsave
  const handleUnsave = (program) => {
    setConfirmDialog({
      open: true,
      type: 'unsave',
      program,
    });
  };

  // Handle make target click
  const handleMakeTarget = (program) => {
    // If user has seen the explanation before, skip the dialog
    if (hasSeenTargetExplanation) {
      convertToTarget(program.programId);
    } else {
      setConfirmDialog({
        open: true,
        type: 'convertToTarget',
        program,
      });
    }
  };

  // Confirm dialog action with error handling
  const handleConfirmAction = async () => {
    const { type, program } = confirmDialog;

    try {
      if (type === 'revertToSaved') {
        await revertToSaved(program.programId);
      } else if (type === 'unsave') {
        await removeProgram(program.programId, false);
      } else if (type === 'convertToTarget') {
        // Mark that user has seen the explanation
        setHasSeenTargetExplanation(true);
        try {
          localStorage.setItem(HAS_SEEN_TARGET_EXPLANATION_KEY, 'true');
        } catch {
          // Ignore localStorage errors
        }
        await convertToTarget(program.programId);
      }
    } catch (err) {
      console.error('Action failed:', err);
      // TODO: Show toast error when sonner is imported
    } finally {
      setConfirmDialog({ open: false, type: null, program: null });
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50/80 to-pink-50/25">
      <PageWrapper className="px-8 md:px-16 lg:px-24 xl:px-32 pt-8 md:pt-12 lg:pt-16 pb-8 bg-transparent relative z-10">
      {/* Page Header with Stats */}
      <div className="mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {firstName}'s Programs
            </h1>
            <p className="text-gray-500 mt-1 max-w-md">
              Save programs you're interested in, then convert them to targets to open your personalized tracking dashboard for each school.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 rounded-full">
              <Target className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-orange-700">{targetPrograms.length} Targets</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 rounded-full">
              <Bookmark className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-orange-700">{savedOnlyPrograms.length} Saved</span>
            </div>
            <Link to="/schools">
              <Button size="sm" className="bg-gray-900 hover:bg-gray-800 text-white">
                <Search className="w-4 h-4 mr-1.5" />
                Find Programs
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="space-y-10">
          {/* Target Programs Section - Featured at top */}
          <DroppableZone id="targets-zone" isActive={activeId !== null} variant="featured">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-50">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Target Programs</h2>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mt-0.5">
                  Programs you're actively applying to
                </p>
              </div>
            </div>

            {sortedTargetPrograms.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-5">
                {sortedTargetPrograms.map((program) => (
                  <DraggableTargetCard
                    key={program.id}
                    program={program}
                    isDragging={activeId === program.id}
                  />
                ))}
              </div>
            ) : (
              <div
                className={cn(
                  'border border-dashed rounded-3xl p-10 text-center transition-all max-w-lg mx-auto',
                  activeId ? 'border-orange-300 bg-orange-50/30 scale-[1.02]' : 'border-orange-200/60 bg-orange-50/20'
                )}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-orange-500" />
                </div>
                <p className="font-semibold text-gray-800 mb-2 text-lg">
                  {activeId ? 'Drop here to start tracking' : 'No target programs yet'}
                </p>
                <p className="text-sm text-gray-500 mb-4 max-w-sm mx-auto">
                  {activeId
                    ? 'This will create a dedicated application tracker for this school'
                    : 'Save programs from the school database, then mark them as targets to track your applications'}
                </p>
                {!activeId && (
                  <Link to="/schools">
                    <Button className="bg-gray-900 hover:bg-gray-800 text-white">
                      <Search className="w-4 h-4 mr-1.5" />
                      Browse School Database
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </DroppableZone>

          {/* Saved Programs Section */}
          <DroppableZone id="saved-zone" isActive={activeId !== null} variant="default">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-50">
                <Bookmark className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Saved Programs</h2>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mt-0.5">
                  Programs you're interested in
                </p>
              </div>
            </div>

            {savedOnlyPrograms.length > 0 ? (
              <div className="flex gap-6">
                {/* Filters sidebar inside saved section */}
                <div className="w-56 shrink-0 space-y-5 bg-gray-50/80 rounded-2xl p-4 h-fit sticky top-4">
                  {/* Search */}
                  <div>
                    <Label className="text-xs font-semibold text-gray-600 mb-1.5 block">School Name</Label>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Search..."
                        value={savedSearch}
                        onChange={(e) => setSavedSearch(e.target.value)}
                        className="pl-8 h-9 text-sm"
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <Label className="text-xs font-semibold text-gray-600 mb-1.5 block">Location</Label>
                    <Select
                      value={savedFilters.state}
                      onValueChange={(value) => setSavedFilters(prev => ({ ...prev, state: value }))}
                    >
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue placeholder="All States" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All States</SelectItem>
                        {savedProgramStates.map((state) => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* GRE Checkboxes */}
                  <div>
                    <Label className="text-xs font-semibold text-gray-600 mb-2 block">GRE</Label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="greNotRequired"
                          checked={savedFilters.greNotRequired}
                          onCheckedChange={(checked) => setSavedFilters(prev => ({ ...prev, greNotRequired: checked }))}
                        />
                        <label htmlFor="greNotRequired" className="text-sm cursor-pointer">
                          Not Required
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="greRequired"
                          checked={savedFilters.greRequired}
                          onCheckedChange={(checked) => setSavedFilters(prev => ({ ...prev, greRequired: checked }))}
                        />
                        <label htmlFor="greRequired" className="text-sm cursor-pointer">
                          Required
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Clear Filters */}
                  {hasActiveFilters && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs"
                      onClick={clearFilters}
                    >
                      <X className="w-3 h-3 mr-1" />
                      Clear All Filters
                    </Button>
                  )}

                  {/* Results Count */}
                  <div className="pt-3 border-t text-xs text-gray-500">
                    Showing <span className="font-medium">{filteredSavedPrograms.length}</span> of{' '}
                    <span className="font-medium">{savedOnlyPrograms.length}</span> programs
                  </div>
                </div>

                {/* Programs grid */}
                <div className="flex-1">
                  {filteredSavedPrograms.length > 0 ? (
                    <div className="flex flex-wrap gap-4">
                      {filteredSavedPrograms.map((program) => (
                        <DraggableSavedCard
                          key={program.id}
                          program={program}
                          isDragging={activeId === program.id}
                          onUnsave={() => handleUnsave(program)}
                          onMakeTarget={() => handleMakeTarget(program)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No programs match your filters</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2"
                        onClick={clearFilters}
                      >
                        Clear filters
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div
                className={cn(
                  'border border-dashed rounded-3xl p-8 text-center transition-colors max-w-md mx-auto',
                  activeId ? 'border-sky-300 bg-sky-50/50' : 'border-gray-200/60'
                )}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Bookmark className="w-7 h-7 text-orange-400" />
                </div>
                <p className="font-medium text-gray-700 mb-1">
                  {activeId ? 'Drop here to remove from targets' : 'No saved programs yet'}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  {activeId
                    ? 'This will keep the program in your list but remove target tracking'
                    : 'Start by exploring schools and saving ones that interest you'}
                </p>
                {!activeId && (
                  <Link to="/schools">
                    <Button size="sm" className="bg-gray-900 hover:bg-gray-800 text-white">
                      <Search className="w-4 h-4 mr-1.5" />
                      Browse Schools
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </DroppableZone>
        </div>

        {/* Drag Overlay - must be above all droppable zones */}
        <DragOverlay dropAnimation={null} zIndex={9999}>
          {activeProgram ? (
            <div className="bg-white rounded-2xl shadow-2xl border-2 border-orange-400 p-3 w-56 cursor-grabbing">
              {activeProgram.program?.imageUrl && (
                <img
                  src={activeProgram.program.imageUrl}
                  alt=""
                  className="w-full h-16 object-cover rounded-xl mb-2"
                />
              )}
              <p className="font-medium text-sm">
                {activeProgram.program?.schoolName}
              </p>
              <p className="text-xs text-gray-500">
                {activeProgram.program?.location?.city},{' '}
                {activeProgram.program?.location?.state}
              </p>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Confirmation Dialogs */}
      <Dialog
        open={confirmDialog.open}
        onOpenChange={(open) =>
          !open && setConfirmDialog({ open: false, type: null, program: null })
        }
      >
        <DialogContent>
          {/* Convert to Target Dialog */}
          {confirmDialog.type === 'convertToTarget' && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-primary">
                  <Sparkles className="w-5 h-5" />
                  Create Target Program
                </DialogTitle>
                <DialogDescription className="text-left space-y-3 pt-2">
                  <p>
                    Converting <strong>{confirmDialog.program?.program?.schoolName}</strong> to a target program will create your personalized application tracker.
                  </p>
                  <div className="bg-primary/5 rounded-xl p-4 space-y-2">
                    <p className="font-medium text-gray-800 text-sm">What you'll get:</p>
                    <ul className="text-sm space-y-1.5">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                        <span>Personalized application checklist</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                        <span>Progress tracking dashboard</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                        <span>Document upload & organization</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                        <span>Deadline reminders & status tracking</span>
                      </li>
                    </ul>
                  </div>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() =>
                    setConfirmDialog({ open: false, type: null, program: null })
                  }
                >
                  Cancel
                </Button>
                <Button onClick={handleConfirmAction}>
                  <Target className="w-4 h-4 mr-1.5" />
                  Make Target
                </Button>
              </DialogFooter>
            </>
          )}

          {/* Revert to Saved Dialog */}
          {confirmDialog.type === 'revertToSaved' && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-orange-600">
                  <AlertTriangle className="w-5 h-5" />
                  Remove from Targets?
                </DialogTitle>
                <DialogDescription>
                  This will remove{' '}
                  <strong>
                    {confirmDialog.program?.program?.schoolName}
                  </strong>{' '}
                  from your target programs.{' '}
                  <span className="text-orange-600 font-medium">
                    Your application progress and checklist data will be lost.
                  </span>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() =>
                    setConfirmDialog({ open: false, type: null, program: null })
                  }
                >
                  Keep as Target
                </Button>
                <Button variant="destructive" onClick={handleConfirmAction}>
                  Remove from Targets
                </Button>
              </DialogFooter>
            </>
          )}

          {/* Unsave Dialog */}
          {confirmDialog.type === 'unsave' && (
            <>
              <DialogHeader>
                <DialogTitle>Remove from Saved?</DialogTitle>
                <DialogDescription>
                  Remove{' '}
                  <strong>
                    {confirmDialog.program?.program?.schoolName}
                  </strong>{' '}
                  from your saved programs?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() =>
                    setConfirmDialog({ open: false, type: null, program: null })
                  }
                >
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleConfirmAction}>
                  Remove
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </PageWrapper>
    </div>
  );
}

/**
 * Droppable zone component
 */
function DroppableZone({ id, children, isActive, variant = 'default' }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  if (variant === 'featured') {
    return (
      <div
        ref={setNodeRef}
        className={cn(
          'bg-white rounded-[2.5rem] shadow-sm overflow-hidden p-8 transition-all',
          isActive && 'ring-2 ring-orange-200/50',
          isOver && 'bg-orange-50/30'
        )}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'bg-white rounded-[2.5rem] shadow-sm overflow-hidden p-8 transition-all',
        isActive && 'ring-2 ring-gray-200',
        isOver && 'bg-gray-50 ring-2 ring-gray-300'
      )}
    >
      {children}
    </div>
  );
}

/**
 * Draggable Target Program Card - Narrower, centered layout
 */
function DraggableTargetCard({ program, isDragging }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: program.id,
  });

  // Hide the original card when dragging - DragOverlay shows the preview
  // We still need transform for dnd-kit to track position, but we make card invisible
  const style = {
    transform: CSS.Translate.toString(transform),
    // Make original invisible when dragging so only DragOverlay shows
    opacity: isDragging ? 0 : undefined,
    // Prevent transition delays during drag
    transition: isDragging ? 'none' : undefined,
  };

  const deadlineInfo = getDeadlineStatus(program.program?.applicationDeadline);
  const progress = program.targetData?.progress || 0;
  const completedItems = program.targetData?.completedItems || 0;
  const totalItems = program.targetData?.totalItems || 8;
  const status = program.targetData?.status || 'not_started';

  // Placeholder image if none available
  const imageUrl = program.program?.imageUrl || `https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=200&fit=crop`;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        'group overflow-hidden hover:shadow-lg cursor-grab active:cursor-grabbing w-64 shrink-0 border border-orange-200/60 hover:border-orange-300 bg-white'
      )}
      {...listeners}
      {...attributes}
    >
      {/* School Image */}
      <div className="relative h-28 overflow-hidden">
        <img
          src={imageUrl}
          alt={program.program?.schoolName}
          className="w-full h-full object-cover"
        />
        {/* Status overlay */}
        <div className="absolute top-2 right-2">
          <StatusBadge status={status} size="sm" />
        </div>
        {/* Drag indicator - always visible */}
        <div className="absolute top-2 left-2 p-1.5 bg-white/90 rounded-lg shadow-sm opacity-60 group-hover:opacity-100 transition-opacity">
          <GripVertical className="w-4 h-4 text-gray-500" />
        </div>
      </div>

      {/* Content */}
      <Link to={`/my-programs/${program.id}`} className="block p-4">
        <h3 className="font-semibold text-sm mb-1 transition-colors line-clamp-1 group-hover:bg-linear-to-r group-hover:from-[#F97066] group-hover:via-[#FE90AF] group-hover:to-[#FFB088] group-hover:bg-clip-text group-hover:text-transparent">
          {program.program?.schoolName}
        </h3>

        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {program.program?.location?.city}, {program.program?.location?.state}
          </span>
        </div>

        {/* Deadline */}
        <div
          className={cn(
            'flex items-center gap-1.5 text-xs mb-3 px-2 py-1 rounded-lg w-fit',
            deadlineInfo.isUrgent && !deadlineInfo.isPast && 'bg-orange-50 text-orange-700',
            deadlineInfo.isPast && 'bg-red-50 text-red-700',
            !deadlineInfo.isUrgent && !deadlineInfo.isPast && 'bg-gray-50 text-gray-600'
          )}
        >
          <Clock className="w-3 h-3" />
          {deadlineInfo.text}
        </div>

        {/* Progress */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Progress value={progress} variant="orange" className="h-2 flex-1" />
            <span className="text-xs font-medium text-gray-600 w-8">{progress}%</span>
          </div>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <ListChecks className="w-3 h-3" />
            {completedItems}/{totalItems} checklist items
          </p>
        </div>
      </Link>
    </Card>
  );
}

/**
 * Draggable Saved Program Card - Narrower, compact
 */
function DraggableSavedCard({ program, isDragging, onUnsave, onMakeTarget }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: program.id,
  });

  // Hide the original card when dragging - DragOverlay shows the preview
  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0 : undefined,
    transition: isDragging ? 'none' : undefined,
  };

  // Placeholder image if none available
  const imageUrl = program.program?.imageUrl || `https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=200&fit=crop`;

  // Get deadline info
  const deadlineInfo = getDeadlineStatus(program.program?.applicationDeadline);

  // Get prerequisites count
  const prerequisites = program.program?.requirements?.prerequisites || [];
  const prereqCount = prerequisites.length;

  // Get GRE requirement - check both old and new data formats
  const greRequired = program.program?.requirements?.gre === 'required' || program.program?.greRequired;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="group overflow-hidden hover:shadow-md cursor-grab active:cursor-grabbing w-56 shrink-0"
      {...listeners}
      {...attributes}
    >
      {/* School Image */}
      <div className="relative h-24 overflow-hidden">
        <img
          src={imageUrl}
          alt={program.program?.schoolName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Drag indicator - always visible */}
        <div className="absolute top-2 left-2 p-1.5 bg-white/90 rounded-lg shadow-sm opacity-60 group-hover:opacity-100 transition-opacity">
          <GripVertical className="w-4 h-4 text-gray-500" />
        </div>
        {/* Quick actions overlay - 44px touch targets */}
        <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onMakeTarget();
            }}
            className="min-w-11 min-h-11 flex items-center justify-center bg-white/95 rounded-xl shadow-sm hover:bg-primary hover:text-white transition-colors"
            title="Make target"
          >
            <Target className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onUnsave();
            }}
            className="min-w-11 min-h-11 flex items-center justify-center bg-white/95 rounded-xl shadow-sm hover:bg-gray-100 hover:text-gray-600 transition-colors"
            title="Remove"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <Link to={`/schools/${program.programId}`} className="block p-3">
        <h3 className="font-medium text-sm mb-1 transition-colors line-clamp-1 group-hover:bg-linear-to-r group-hover:from-[#F97066] group-hover:via-[#FE90AF] group-hover:to-[#FFB088] group-hover:bg-clip-text group-hover:text-transparent">
          {program.program?.schoolName}
        </h3>

        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {program.program?.location?.city}, {program.program?.location?.state}
          </span>
        </div>

        {/* Deadline */}
        {program.program?.applicationDeadline && (
          <div
            className={cn(
              'flex items-center gap-1.5 text-xs mb-2 px-2 py-1 rounded-lg w-fit',
              deadlineInfo.isUrgent && !deadlineInfo.isPast && 'bg-amber-50 text-amber-700',
              deadlineInfo.isPast && 'bg-gray-100 text-gray-500',
              !deadlineInfo.isUrgent && !deadlineInfo.isPast && 'bg-gray-50 text-gray-600'
            )}
          >
            <Clock className="w-3 h-3" />
            {deadlineInfo.text}
          </div>
        )}

        {/* GRE Badge */}
        <div className="mb-2">
          <Badge
            variant="outline"
            className={cn(
              'text-[10px] px-1.5 py-0.5',
              greRequired
                ? 'text-blue-600 border-blue-200 bg-blue-50'
                : 'text-emerald-600 border-emerald-200 bg-emerald-50'
            )}
          >
            <GraduationCap className="w-3 h-3 mr-1" />
            {greRequired ? 'GRE Required' : 'No GRE'}
          </Badge>
        </div>

        {/* Prerequisites Pills */}
        {prereqCount > 0 && (
          <div className="flex flex-wrap gap-1">
            {prerequisites.slice(0, 4).map((prereq, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className="text-[9px] px-1.5 py-0 text-gray-600 border-gray-200 bg-gray-50 font-normal"
              >
                {prereq}
              </Badge>
            ))}
            {prereqCount > 4 && (
              <Badge
                variant="outline"
                className="text-[9px] px-1.5 py-0 text-gray-500 border-gray-200 bg-gray-50 font-normal"
              >
                +{prereqCount - 4} more
              </Badge>
            )}
          </div>
        )}
      </Link>
    </Card>
  );
}
