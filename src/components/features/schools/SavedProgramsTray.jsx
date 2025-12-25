/**
 * SavedProgramsTray Component
 *
 * Right sidebar tray for quick management of saved/target schools.
 * Supports drag-and-drop between Saved and Target sections.
 * Desktop: Fixed sidebar on right
 * Mobile: Bottom sheet
 *
 * Includes confirmation dialogs matching MyProgramsPage behavior:
 * - "Make Target" explanation shown only once (uses localStorage)
 * - "Remove from Targets" warning always shown
 */

import { useState } from 'react';
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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Heart,
  Star,
  X,
  Bookmark,
  Target,
  ArrowRight,
  GripVertical,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// localStorage key for tracking if user has seen the "Make Target" explanation
const HAS_SEEN_TARGET_EXPLANATION_KEY = 'crna_has_seen_target_explanation';

export function SavedProgramsTray({
  savedSchools = [],
  targetSchools = [],
  onUnsave,
  onToggleTarget,
  open,
  onOpenChange,
}) {
  const [activeId, setActiveId] = useState(null);
  const [activeSchool, setActiveSchool] = useState(null);

  // Dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    type: null, // 'convertToTarget' | 'revertToSaved' | 'unsave'
    school: null,
  });

  // Track if user has seen the target explanation
  const [hasSeenTargetExplanation, setHasSeenTargetExplanation] = useState(() => {
    try {
      return localStorage.getItem(HAS_SEEN_TARGET_EXPLANATION_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const savedCount = savedSchools.length;
  const targetCount = targetSchools.length;

  // Non-target saved schools
  const savedOnlySchools = savedSchools.filter(
    (school) => !targetSchools.some((t) => t.id === school.id)
  );

  // Configure drag sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement before drag starts
      },
    })
  );

  // Handle drag start
  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
    // Find the school being dragged
    const school = [...savedSchools, ...targetSchools].find(
      (s) => s.id === active.id
    );
    setActiveSchool(school);
  };

  // Handle drag end
  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    setActiveSchool(null);

    if (!over) return;

    const schoolId = active.id;
    const dropZone = over.id;

    // Check if school is currently a target
    const isCurrentlyTarget = targetSchools.some((s) => s.id === schoolId);
    const school = [...savedSchools, ...targetSchools].find((s) => s.id === schoolId);

    // If dropped on targets zone and not already a target, show dialog
    if (dropZone === 'targets-zone' && !isCurrentlyTarget) {
      handleMakeTarget(school);
    }
    // If dropped on saved zone and is a target, show warning dialog
    else if (dropZone === 'saved-zone' && isCurrentlyTarget) {
      setConfirmDialog({
        open: true,
        type: 'revertToSaved',
        school,
      });
    }
  };

  // Handle making a school a target
  const handleMakeTarget = (school) => {
    // If user has never seen the explanation, show it
    if (!hasSeenTargetExplanation) {
      setConfirmDialog({
        open: true,
        type: 'convertToTarget',
        school,
      });
    } else {
      // User has seen explanation before, just do it
      onToggleTarget(school.id);
    }
  };

  // Handle removing from targets (always show warning)
  const handleRemoveFromTarget = (school) => {
    setConfirmDialog({
      open: true,
      type: 'revertToSaved',
      school,
    });
  };

  // Handle toggle target click (decides which dialog to show based on current state)
  const handleToggleTargetClick = (school, isCurrentlyTarget) => {
    if (isCurrentlyTarget) {
      // Removing from targets - always show warning
      handleRemoveFromTarget(school);
    } else {
      // Making a target
      handleMakeTarget(school);
    }
  };

  // Handle unsave click
  const handleUnsaveClick = (school) => {
    // For unsave, just do it directly (no dialog needed for simple unsave)
    onUnsave(school.id);
  };

  // Confirm dialog action
  const handleConfirmAction = () => {
    const { type, school } = confirmDialog;

    if (type === 'convertToTarget') {
      // Mark that user has seen the explanation
      setHasSeenTargetExplanation(true);
      try {
        localStorage.setItem(HAS_SEEN_TARGET_EXPLANATION_KEY, 'true');
      } catch {
        // Ignore localStorage errors
      }
      onToggleTarget(school.id);
    } else if (type === 'revertToSaved') {
      onToggleTarget(school.id);
    } else if (type === 'unsave') {
      onUnsave(school.id);
    }

    setConfirmDialog({ open: false, type: null, school: null });
  };

  // Shared tray content JSX
  const trayContentJSX = (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="h-full flex flex-col">
        {/* Target Schools Section */}
        <DroppableZone id="targets-zone" isActive={activeId !== null}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Target className="w-4 h-4 text-orange-500" />
              Targets
              <Badge className="text-xs bg-linear-to-r from-[#FFF5E6] to-[#FFEBE0] text-orange-700 border border-orange-200/60">
                {targetCount}
              </Badge>
            </h3>
          </div>
          <p className="text-xs text-gray-500 mb-3 leading-relaxed">
            Mark schools as targets to unlock a dedicated tracker with application checklists, deadlines, and document management for each program.
          </p>

          {targetSchools.length > 0 ? (
            <div className="space-y-2">
              {targetSchools.map((school) => (
                <DraggableSchoolItem
                  key={school.id}
                  school={school}
                  isTarget={true}
                  onRemove={() => handleUnsaveClick(school)}
                  onToggleTarget={() => handleToggleTargetClick(school, true)}
                  isDragging={activeId === school.id}
                />
              ))}
            </div>
          ) : (
            <div className={cn(
              "bg-orange-50/30 rounded-2xl p-3 text-center border-2 border-dashed border-orange-200/60 transition-colors",
              activeId && "border-orange-300 bg-orange-50/50"
            )}>
              <Star className="w-5 h-5 text-orange-300 mx-auto mb-1" />
              <p className="text-xs text-gray-500">
                {activeId ? 'Drop here to make target' : 'Drag a school here to make it a target'}
              </p>
            </div>
          )}
        </DroppableZone>

        {/* Divider */}
        <div className="border-t border-orange-100/60 my-3" />

        {/* Saved Schools Section */}
        <DroppableZone id="saved-zone" isActive={activeId !== null} className="flex-1 overflow-auto">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#FE90AF]" />
              Saved
              <Badge className="text-xs bg-linear-to-r from-sky-50 to-blue-50 text-sky-700 border border-sky-200/60">
                {savedOnlySchools.length}
              </Badge>
            </h3>
          </div>

          {savedOnlySchools.length > 0 ? (
            <div className="space-y-2">
              {savedOnlySchools.map((school) => (
                <DraggableSchoolItem
                  key={school.id}
                  school={school}
                  isTarget={false}
                  onRemove={() => handleUnsaveClick(school)}
                  onToggleTarget={() => handleToggleTargetClick(school, false)}
                  isDragging={activeId === school.id}
                />
              ))}
            </div>
          ) : (
            <div className={cn(
              "bg-gray-50/50 rounded-2xl p-3 text-center border-2 border-dashed border-gray-200/60 transition-colors",
              activeId && "border-gray-300"
            )}>
              <p className="text-xs text-gray-500">
                {activeId ? 'Drop here to remove from targets' : 'No saved schools yet'}
              </p>
            </div>
          )}
        </DroppableZone>

        {/* Link to My Programs */}
        <div className="pt-4 border-t border-orange-100/60 mt-auto">
          <Link to="/my-programs">
            <Button variant="ghost" className="w-full text-sm text-orange-600 hover:text-orange-700 hover:bg-orange-50/50" size="sm">
              Manage My Programs
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Drag Overlay - shows the item being dragged */}
      <DragOverlay>
        {activeSchool ? (
          <div className="bg-white rounded-xl shadow-lg border-2 border-primary p-2 opacity-90">
            <p className="text-sm font-medium truncate">{activeSchool.name}</p>
            <p className="text-xs text-gray-500 truncate">
              {activeSchool.city}, {activeSchool.state}
            </p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );

  return (
    <>
      {/* Desktop Tray - Sticky */}
      <div className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-20 bg-linear-to-br from-[#FFFBF7] via-white to-[#FFF8F3] rounded-3xl border border-orange-200/40 shadow-sm max-h-[calc(100vh-6rem)] flex flex-col">
          <h2 className="font-semibold text-lg p-4 pb-2 flex items-center gap-2 shrink-0">
            <Bookmark className="w-5 h-5 text-orange-500" />
            <span className="bg-linear-to-r from-[#F97066] via-[#FE90AF] to-[#FFB088] bg-clip-text text-transparent">My Programs</span>
          </h2>
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            {trayContentJSX}
          </div>
        </div>
      </div>

      {/* Mobile Floating Button + Sheet */}
      <div className="lg:hidden fixed bottom-20 right-4 z-40">
        <Sheet open={open} onOpenChange={onOpenChange}>
          <SheetTrigger asChild>
            <Button
              size="icon"
              className="h-14 w-14 rounded-full shadow-lg relative bg-linear-to-br from-[#FFE4CC] to-[#FFD0B0] hover:from-[#FFD6B8] hover:to-[#FFC0A0] text-orange-700 border-none"
            >
              <Bookmark className="w-6 h-6" />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-linear-to-r from-[#F97066] to-[#FE90AF] text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 bg-linear-to-br from-[#FFFBF7] via-white to-[#FFF8F3]">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-orange-500" />
                <span className="bg-linear-to-r from-[#F97066] via-[#FE90AF] to-[#FFB088] bg-clip-text text-transparent">My Programs</span>
              </SheetTitle>
            </SheetHeader>
            <div className="mt-4 h-[calc(100vh-8rem)]">
              {trayContentJSX}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Confirmation Dialogs */}
      <Dialog
        open={confirmDialog.open}
        onOpenChange={(dialogOpen) => {
          if (!dialogOpen) {
            setConfirmDialog({ open: false, type: null, school: null });
          }
        }}
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
                    Converting <strong>{confirmDialog.school?.name}</strong> to a target program will create your personalized application tracker.
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
                    setConfirmDialog({ open: false, type: null, school: null })
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
                    {confirmDialog.school?.name}
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
                    setConfirmDialog({ open: false, type: null, school: null })
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

          {/* Unsave Dialog (if needed later) */}
          {confirmDialog.type === 'unsave' && (
            <>
              <DialogHeader>
                <DialogTitle>Remove from Saved?</DialogTitle>
                <DialogDescription>
                  Remove{' '}
                  <strong>
                    {confirmDialog.school?.name}
                  </strong>{' '}
                  from your saved programs?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() =>
                    setConfirmDialog({ open: false, type: null, school: null })
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
    </>
  );
}

/**
 * Droppable zone component
 */
function DroppableZone({ id, children, isActive, className }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "rounded-2xl p-2 -m-2 transition-colors",
        isActive && "bg-orange-50/30",
        isOver && "bg-orange-50/50",
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * Draggable school item
 */
function DraggableSchoolItem({ school, isTarget, onRemove, onToggleTarget, isDragging }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
  } = useDraggable({
    id: school.id,
  });

  const style = transform ? {
    transform: CSS.Translate.toString(transform),
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex items-center gap-2 p-2 rounded-2xl hover:bg-orange-50/30 transition-colors bg-white/50",
        isDragging && "opacity-50"
      )}
    >
      {/* Drag Handle */}
      <button
        {...listeners}
        {...attributes}
        className="p-1 cursor-grab active:cursor-grabbing text-gray-400 hover:text-orange-500 touch-none"
      >
        <GripVertical className="w-4 h-4" />
      </button>

      {/* School Info */}
      <Link
        to={`/schools/${school.id}`}
        className="flex-1 min-w-0"
      >
        <p className="text-sm font-medium truncate group-hover:bg-linear-to-r group-hover:from-[#F97066] group-hover:via-[#FE90AF] group-hover:to-[#FFB088] group-hover:bg-clip-text group-hover:text-transparent transition-colors">
          {school.name}
        </p>
        <p className="text-xs text-gray-500 truncate">
          {school.city}, {school.state}
        </p>
      </Link>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Target button - only show for saved (non-target) items */}
        {!isTarget && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleTarget();
            }}
            className="p-1.5 rounded-xl transition-colors hover:bg-orange-50 text-gray-400 hover:text-orange-500"
            title="Make target"
          >
            <Target className="w-4 h-4" />
          </button>
        )}
        {/* X button - for targets: revert to saved, for saved: remove completely */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (isTarget) {
              // Revert target to saved (triggers warning dialog)
              onToggleTarget();
            } else {
              // Remove from saved completely
              onRemove();
            }
          }}
          className={cn(
            "p-1.5 rounded-xl transition-colors",
            isTarget
              ? "hover:bg-orange-50 text-gray-400 hover:text-orange-500"
              : "hover:bg-red-50 text-gray-400 hover:text-red-500"
          )}
          title={isTarget ? "Revert to saved" : "Remove from saved"}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default SavedProgramsTray;
