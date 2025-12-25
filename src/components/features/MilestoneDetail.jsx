/**
 * MilestoneDetail Component
 *
 * Two-panel modal showing milestone details with gradient left panel
 * and action items checklist on the right.
 * - Left/right arrows to navigate between milestones
 * - Confetti triggers ONCE per milestone when completed
 * - Scrollable action items list
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  CheckCircle2,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Stethoscope,
  Calculator,
  Search,
  FileText,
  Users,
  Award,
  Medal,
  BookOpen,
  Eye,
  PenTool,
  Mail,
  MessageSquare,
} from 'lucide-react';
import Confetti from 'react-confetti';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

// Icon mapping for milestones
const iconMap = {
  GraduationCap,
  Stethoscope,
  Calculator,
  Search,
  FileText,
  Users,
  Award,
  Medal,
  BookOpen,
  Eye,
  PenTool,
  Mail,
  MessageSquare,
};

// 13 gradient configurations matching the design system
const GRADIENT_CONFIG = {
  1: { // Brand Yellow
    bg: 'from-[#f6ff88] via-[#FFFFC7] to-[#FFE4B3]',
    text: 'text-amber-900',
    subtext: 'text-amber-800/70',
    pill: 'bg-amber-900/20 text-amber-900',
    progress: 'bg-amber-900/30',
    progressFill: 'bg-amber-800',
    iconBg: 'bg-white/40',
  },
  2: { // Soft Peach/Coral
    bg: 'from-[#FFCCCC] via-[#FFB8B8] to-[#FE90AF]',
    text: 'text-white',
    subtext: 'text-white/80',
    pill: 'bg-white/20 text-white',
    progress: 'bg-white/30',
    progressFill: 'bg-white',
    iconBg: 'bg-white/30',
  },
  3: { // Lavender Purple to Pink
    bg: 'from-[#D8B5FF] via-[#E8C5FF] to-[#FFBBBB]',
    text: 'text-purple-900',
    subtext: 'text-purple-800/70',
    pill: 'bg-purple-900/20 text-purple-900',
    progress: 'bg-purple-900/30',
    progressFill: 'bg-purple-800',
    iconBg: 'bg-white/40',
  },
  4: { // Mint to Teal
    bg: 'from-[#BFF098] via-[#A8E6CF] to-[#6FD6FF]',
    text: 'text-emerald-900',
    subtext: 'text-emerald-800/70',
    pill: 'bg-emerald-900/20 text-emerald-900',
    progress: 'bg-emerald-900/30',
    progressFill: 'bg-emerald-800',
    iconBg: 'bg-white/40',
  },
  5: { // Sky Blue
    bg: 'from-[#C6EA8D] via-[#A8E0C0] to-[#6FD6FF]',
    text: 'text-teal-900',
    subtext: 'text-teal-800/70',
    pill: 'bg-teal-900/20 text-teal-900',
    progress: 'bg-teal-900/30',
    progressFill: 'bg-teal-800',
    iconBg: 'bg-white/40',
  },
  6: { // Warm Sunset
    bg: 'from-[#F1EAB9] via-[#FFD6B8] to-[#FF8C8C]',
    text: 'text-orange-900',
    subtext: 'text-orange-800/70',
    pill: 'bg-orange-900/20 text-orange-900',
    progress: 'bg-orange-900/30',
    progressFill: 'bg-orange-800',
    iconBg: 'bg-white/40',
  },
  7: { // Grape
    bg: 'from-[#EA8D8D] via-[#C9A0DC] to-[#A890FE]',
    text: 'text-white',
    subtext: 'text-white/80',
    pill: 'bg-white/20 text-white',
    progress: 'bg-white/30',
    progressFill: 'bg-white',
    iconBg: 'bg-white/30',
  },
  8: { // Ocean
    bg: 'from-[#87CEEB] via-[#B8E0F0] to-[#FFFFC7]',
    text: 'text-sky-900',
    subtext: 'text-sky-800/70',
    pill: 'bg-sky-900/20 text-sky-900',
    progress: 'bg-sky-900/30',
    progressFill: 'bg-sky-800',
    iconBg: 'bg-white/40',
  },
  9: { // Rose
    bg: 'from-[#FCA5F1] via-[#E0C5F0] to-[#B5FFFF]',
    text: 'text-pink-900',
    subtext: 'text-pink-800/70',
    pill: 'bg-pink-900/20 text-pink-900',
    progress: 'bg-pink-900/30',
    progressFill: 'bg-pink-800',
    iconBg: 'bg-white/40',
  },
  10: { // Golden
    bg: 'from-[#FFB088] via-[#FFD088] to-[#FFE98A]',
    text: 'text-amber-900',
    subtext: 'text-amber-800/70',
    pill: 'bg-amber-900/20 text-amber-900',
    progress: 'bg-amber-900/30',
    progressFill: 'bg-amber-800',
    iconBg: 'bg-white/40',
  },
  11: { // Teal
    bg: 'from-[#A8E6CF] via-[#88D8C0] to-[#6DD5C0]',
    text: 'text-teal-900',
    subtext: 'text-teal-800/70',
    pill: 'bg-teal-900/20 text-teal-900',
    progress: 'bg-teal-900/30',
    progressFill: 'bg-teal-800',
    iconBg: 'bg-white/40',
  },
  12: { // Blush
    bg: 'from-[#FFE4E4] via-[#FFD4D4] to-[#FFC4C4]',
    text: 'text-rose-900',
    subtext: 'text-rose-800/70',
    pill: 'bg-rose-900/20 text-rose-900',
    progress: 'bg-rose-900/30',
    progressFill: 'bg-rose-800',
    iconBg: 'bg-white/40',
  },
  13: { // Cream
    bg: 'from-[#FFF8E7] via-[#FFE8CC] to-[#FFD8B1]',
    text: 'text-amber-900',
    subtext: 'text-amber-800/70',
    pill: 'bg-amber-900/20 text-amber-900',
    progress: 'bg-amber-900/30',
    progressFill: 'bg-amber-800',
    iconBg: 'bg-white/40',
  },
};

export function MilestoneDetail({
  milestone,
  allMilestones = [],
  open,
  onOpenChange,
  onToggleSubItem,
  onNavigate,
  celebratedMilestones = [],
  onMilestoneCelebrated,
}) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  // Track previous completion state to detect when milestone BECOMES complete
  const prevCompleteRef = useRef(false);
  const prevMilestoneIdRef = useRef(null);

  // Calculate progress
  const totalSubItems = milestone?.subItems?.length || 0;
  const completedSubItems = milestone?.subItems?.filter(item => item.completed).length || 0;
  const isComplete = completedSubItems === totalSubItems && totalSubItems > 0;
  const progress = totalSubItems > 0 ? (completedSubItems / totalSubItems) * 100 : 0;

  // Get gradient config based on milestone order (1-13, cycling)
  const gradientKey = milestone ? ((milestone.order - 1) % 13) + 1 : 1;
  const gradient = GRADIENT_CONFIG[gradientKey];

  // Get milestone icon
  const Icon = milestone ? (iconMap[milestone.icon] || GraduationCap) : GraduationCap;

  // Navigation helpers
  const currentIndex = milestone ? allMilestones.findIndex(m => m.id === milestone.id) : -1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < allMilestones.length - 1;

  const handlePrev = useCallback(() => {
    if (hasPrev && onNavigate) {
      onNavigate(allMilestones[currentIndex - 1].id);
    }
  }, [hasPrev, onNavigate, allMilestones, currentIndex]);

  const handleNext = useCallback(() => {
    if (hasNext && onNavigate) {
      onNavigate(allMilestones[currentIndex + 1].id);
    }
  }, [hasNext, onNavigate, allMilestones, currentIndex]);

  // Handle window resize for confetti
  useEffect(() => {
    const updateSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Trigger confetti ONCE when milestone BECOMES complete (transition from incomplete to complete)
  useEffect(() => {
    // Reset tracking when milestone changes
    if (milestone?.id !== prevMilestoneIdRef.current) {
      prevMilestoneIdRef.current = milestone?.id;
      prevCompleteRef.current = isComplete;
      return;
    }

    // Only trigger when transitioning from incomplete to complete
    const justBecameComplete = isComplete && !prevCompleteRef.current;
    prevCompleteRef.current = isComplete;

    if (
      justBecameComplete &&
      open &&
      milestone &&
      !celebratedMilestones.includes(milestone.id)
    ) {
      setShowConfetti(true);
      // Mark this milestone as celebrated
      if (onMilestoneCelebrated) {
        onMilestoneCelebrated(milestone.id);
      }
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isComplete, open, milestone?.id, celebratedMilestones, onMilestoneCelebrated]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, currentIndex, allMilestones, handlePrev, handleNext]);

  if (!milestone) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Confetti - INSIDE the dialog so it appears above the overlay */}
      {showConfetti && (
        <div className="fixed inset-0 z-[100] pointer-events-none">
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={200}
          />
        </div>
      )}

      {/* Navigation Arrows - rendered via portal to document.body */}
      {open && createPortal(
        <>
          {hasPrev && (
            <button
              onClick={handlePrev}
              className="fixed top-1/2 -translate-y-1/2 z-[9999] w-14 h-14 rounded-full bg-white shadow-lg border border-gray-200 hover:bg-gray-50 hover:shadow-xl flex items-center justify-center transition-all hover:scale-105 cursor-pointer pointer-events-auto"
              style={{ left: 'max(1rem, calc(50% - 30rem))' }}
              aria-label="Previous milestone"
              type="button"
            >
              <ChevronLeft className="w-7 h-7 text-gray-600" />
            </button>
          )}

          {hasNext && (
            <button
              onClick={handleNext}
              className="fixed top-1/2 -translate-y-1/2 z-[9999] w-14 h-14 rounded-full bg-white shadow-lg border border-gray-200 hover:bg-gray-50 hover:shadow-xl flex items-center justify-center transition-all hover:scale-105 cursor-pointer pointer-events-auto"
              style={{ right: 'max(1rem, calc(50% - 30rem))' }}
              aria-label="Next milestone"
              type="button"
            >
              <ChevronRight className="w-7 h-7 text-gray-600" />
            </button>
          )}
        </>,
        document.body
      )}

      <DialogContent
        className="max-w-4xl p-0 overflow-hidden gap-0 border-0 shadow-2xl pointer-events-auto"
        allowClickThrough={true}
        onPointerDownOutside={(e) => {
          // Prevent closing when clicking nav buttons
          const target = e.target;
          if (target.closest('button[aria-label="Previous milestone"]') || target.closest('button[aria-label="Next milestone"]')) {
            e.preventDefault();
          }
        }}
      >
        {/* Close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 z-10 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>

        <div className="flex flex-col md:flex-row min-h-[400px] md:min-h-[500px]">
          {/* Left Panel - Gradient with milestone info */}
          <div className={cn(
            'flex-1 p-6 md:p-8 flex flex-col justify-between bg-gradient-to-br',
            gradient.bg
          )}>
            {/* Top section */}
            <div>
              {/* Icon in white circle */}
              <div className={cn(
                'w-14 h-14 rounded-3xl flex items-center justify-center mb-4',
                gradient.iconBg
              )}>
                <Icon className={cn('w-7 h-7', gradient.text)} />
              </div>

              {/* Step pill badge */}
              <span className={cn(
                'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mb-4',
                gradient.pill
              )}>
                STEP {milestone.order}
              </span>

              {/* Title */}
              <h2 className={cn('text-2xl md:text-3xl font-bold mb-3 leading-tight', gradient.text)}>
                {milestone.title}
              </h2>

              {/* Description */}
              <p className={cn('text-sm md:text-base leading-relaxed', gradient.subtext)}>
                {milestone.description}
              </p>
            </div>

            {/* Bottom section - Progress */}
            <div className="mt-6 md:mt-8">
              <div className="flex items-center justify-between mb-2">
                <span className={cn('text-xs font-medium uppercase tracking-widest', gradient.subtext)}>
                  Milestone Progress
                </span>
                <span className={cn('text-sm font-semibold', gradient.text)}>
                  {Math.round(progress)}%
                </span>
              </div>
              <div className={cn('w-full h-2 rounded-full', gradient.progress)}>
                <div
                  className={cn('h-full rounded-full transition-all duration-500', gradient.progressFill)}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right Panel - Action Items */}
          <div className="flex-1 bg-white p-6 md:p-8 flex flex-col max-h-[500px]">
            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
              <ClipboardList className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Action Items</h3>
            </div>

            {/* Task list - scrollable */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 -mr-2 min-h-0">
              {milestone.subItems.map((subItem) => (
                <div
                  key={subItem.id}
                  onClick={() => onToggleSubItem(milestone.id, subItem.id)}
                  className={cn(
                    'flex items-start gap-3 p-3 rounded-2xl cursor-pointer transition-all',
                    subItem.completed
                      ? 'bg-gray-50'
                      : 'bg-gray-50/50 hover:bg-gray-100'
                  )}
                >
                  {/* Custom checkbox */}
                  <div className="mt-0.5 shrink-0">
                    {subItem.completed ? (
                      <div className="w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                    )}
                  </div>

                  {/* Task content */}
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      'text-sm leading-snug',
                      subItem.completed
                        ? 'text-gray-400 line-through'
                        : 'text-gray-700'
                    )}>
                      {subItem.label}
                    </p>
                    {/* Optional: Show due date if available */}
                    {subItem.dueDate && (
                      <p className="text-xs text-gray-400 mt-1">
                        Due: {subItem.dueDate}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Completion message */}
            {isComplete && (
              <div className="mt-4 p-3 bg-teal-50 border border-teal-100 rounded-2xl shrink-0">
                <p className="text-sm text-teal-700 font-medium text-center">
                  🎉 Milestone Complete! Great work!
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
