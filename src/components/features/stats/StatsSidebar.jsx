/**
 * Stats Page Sidebar (Context Panel)
 *
 * Sticky right sidebar for My Stats page containing:
 * - Profile completion indicator (until 3 actions done)
 * - Gamification widget (Level + Level Name)
 * - ReadyScore circular gauge
 * - Priority Actions (tiered, non-dismissible)
 * - Quick links to trackers + GPA calculator
 * - Notes section (collapsible cards)
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Eye,
  Calendar,
  Stethoscope,
  Heart,
  Calculator,
  GraduationCap,
  Award,
  Users,
  Crown,
  BookOpen,
  Activity,
  Timer,
  RefreshCw,
  FlaskConical,
  BadgePlus,
  FileQuestion,
  FileText,
  Lock,
  Shield,
  MessageSquare,
  Pencil,
  Sparkles,
  Star,
  Zap,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { getNextLevelInfo } from '@/data/mockUser';

// =============================================================================
// PROFILE COMPLETION CARD (Sidebar version with scroll-to-section)
// =============================================================================

// Map action IDs to scroll targets (fallback)
const ACTION_SCROLL_TARGETS = {
  clinical: 'clinical-section',
  shadow: 'shadow-section',
  certifications: 'academic-section',
  prerequisites: 'prerequisites-section',
  events: 'events-section',
  extracurriculars: 'leadership-section',
};

// Map action IDs to edit sheet types
const ACTION_EDIT_TYPES = {
  clinical: 'clinical',
  shadow: 'shadow',
  certifications: 'certifications',
  prerequisites: 'prerequisites',
  events: 'events',
  extracurriculars: 'resume_leadership', // Opens leadership edit sheet
};

function ProfileCompletionCard({
  completedCount = 0,
  requiredActions = 3,
  isComplete = false,
  pointsReward = 20,
  completedLabels = [],
  suggestedActions = [],
  onDismiss,
  onScrollToSection,
  onEdit,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasShownToastRef = useRef(false);

  // Show toast when complete, then auto-dismiss
  useEffect(() => {
    if (isComplete && !hasShownToastRef.current) {
      hasShownToastRef.current = true;
      toast.success(`Profile started! +${pointsReward} points earned`, {
        description: 'Keep adding details to improve your ReadyScore.',
      });
      onDismiss?.();
    }
  }, [isComplete, pointsReward, onDismiss]);

  // Don't render if complete
  if (isComplete) {
    return null;
  }

  const handleActionClick = (actionId) => {
    // Try to open the edit modal first
    const editType = ACTION_EDIT_TYPES[actionId];
    if (editType && onEdit) {
      onEdit(editType);
      return;
    }

    // Fallback: scroll to section
    const targetId = ACTION_SCROLL_TARGETS[actionId];
    if (targetId) {
      onScrollToSection?.(targetId);
    }
  };

  return (
    <div className="bg-linear-to-br from-purple-100 via-indigo-50 to-violet-100 rounded-2xl border border-purple-200/60 overflow-hidden shadow-sm">
      {/* Main bar */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center gap-3 text-left hover:bg-purple-100/50 transition-colors"
      >
        {/* Progress circles */}
        <div className="flex items-center gap-1.5">
          {[...Array(requiredActions)].map((_, i) => (
            <div
              key={i}
              className={cn(
                'w-5 h-5 rounded-full flex items-center justify-center transition-colors',
                i < completedCount
                  ? 'bg-green-500'
                  : 'bg-white/60 border border-purple-200'
              )}
            >
              {i < completedCount && (
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              )}
            </div>
          ))}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm">
            {completedCount}/{requiredActions} complete
          </p>
          <p className="text-xs text-gray-600">
            +{pointsReward} pts when done
          </p>
        </div>

        {/* Expand icon */}
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-purple-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-purple-400" />
        )}
      </button>

      {/* Expanded details */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-1 border-t border-purple-100/60 animate-in slide-in-from-top-1 duration-200">
          {/* Completed actions */}
          {completedLabels.length > 0 && (
            <div className="mb-3">
              <p className="text-[10px] font-medium text-gray-500 mb-1.5">Completed:</p>
              <div className="flex flex-wrap gap-1.5">
                {completedLabels.map((label, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[10px] font-medium"
                  >
                    <Check className="w-2.5 h-2.5" />
                    {label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Suggested actions - clickable to scroll */}
          {suggestedActions.length > 0 && (
            <div>
              <p className="text-[10px] font-medium text-gray-500 mb-1.5">
                Quick ways to get started:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {suggestedActions.slice(0, 4).map((action) => (
                  <button
                    key={action.id}
                    onClick={() => handleActionClick(action.id)}
                    className="px-2 py-0.5 bg-white/80 border border-purple-200/60 text-purple-700 rounded-full text-[10px] hover:bg-purple-50 hover:border-purple-300 transition-colors cursor-pointer"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// GAMIFICATION WIDGET
// =============================================================================

// Level colors for display
const LEVEL_COLORS = {
  1: { stroke: '#9ca3af', bg: 'bg-gray-100', text: 'text-gray-600' },
  2: { stroke: '#3b82f6', bg: 'bg-blue-100', text: 'text-blue-600' },
  3: { stroke: '#22c55e', bg: 'bg-green-100', text: 'text-green-600' },
  4: { stroke: '#eab308', bg: 'bg-yellow-100', text: 'text-yellow-600' },
  5: { stroke: '#f97316', bg: 'bg-orange-100', text: 'text-orange-600' },
  6: { stroke: '#9333ea', bg: 'bg-purple-100', text: 'text-purple-600' },
};

function GamificationWidget({ user }) {
  if (!user) return null;

  const { level = 1, levelName = 'Beginner', points = 0, loginStreak = 0 } = user;
  const nextLevelInfo = getNextLevelInfo(points) || { progress: 0, pointsNeeded: 100 };
  const progress = nextLevelInfo.progress || 0;
  const pointsNeeded = nextLevelInfo.pointsNeeded || 0;

  return (
    <div className="bg-white rounded-2xl shadow-[0_0_20px_rgba(251,146,60,0.3)] p-4">
      {/* Top row: Level badge + Streak */}
      <div className="flex items-center justify-between mb-3">
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-200/60 text-amber-800 text-[10px] font-bold tracking-wider">
          <Crown className="w-3 h-3" />
          LEVEL {level}
        </span>
        {loginStreak > 0 && (
          <div className="flex items-center gap-0.5 text-orange-600 font-bold text-sm">
            <Zap className="w-4 h-4 fill-orange-500 text-orange-500" />
            <span>{loginStreak}</span>
          </div>
        )}
      </div>

      {/* Large XP display */}
      <div className="text-center mb-3">
        <div className="text-3xl font-black text-gray-800 tracking-tight">{points.toLocaleString()}</div>
        <div className="text-[10px] font-semibold text-gray-400 tracking-widest mt-0.5">TOTAL XP</div>
      </div>

      {/* Progress section */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-gray-600">Next Level</span>
          <span className="text-xs font-bold text-gray-500">{Math.round(progress)}%</span>
        </div>
        {/* Progress bar */}
        <div className="w-full h-1.5 bg-gray-200/60 rounded-full overflow-hidden mb-1.5">
          <div
            className="h-full rounded-full bg-amber-400 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-[10px] text-gray-400 text-center">{pointsNeeded.toLocaleString()} XP to level {level + 1}</p>
      </div>
    </div>
  );
}

// =============================================================================
// READYSCORE COMPACT (Simplified - no mini bars)
// =============================================================================

const getScoreColor = (score) => {
  if (score >= 80) return 'text-purple-600';
  if (score >= 60) return 'text-green-600';
  if (score >= 40) return 'text-blue-600';
  return 'text-gray-600';
};

const getStrokeColor = (score) => {
  if (score >= 80) return '#9333ea';
  if (score >= 60) return '#22c55e';
  if (score >= 40) return '#3b82f6';
  return '#9ca3af';
};

function ReadyScoreGauge({ readinessData }) {
  if (!readinessData) return null;

  const { totalScore, readinessLevel } = readinessData;

  return (
    <div className="bg-linear-to-br from-amber-100 via-orange-100 to-rose-100 rounded-2xl shadow-[0_0_20px_rgba(251,146,60,0.4)] overflow-hidden p-4">
      {/* Centered Title */}
      <p className="text-center text-sm font-semibold bg-linear-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent mb-3">
        CRNA School ReadyScore™
      </p>

      {/* Circular Score - Orange/sunset themed */}
      <div className="flex justify-center">
        <div className="relative w-24 h-24">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="rgba(255,255,255,0.6)"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="#ea580c"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${(totalScore / 100) * 264} 264`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-orange-600">
              {totalScore}
            </span>
          </div>
        </div>
      </div>

      {/* Level Badge - Orange themed */}
      <div className="text-center mt-3">
        <Badge className="bg-white/70 text-orange-700 text-xs">
          {readinessLevel.label}
        </Badge>
        <p className="text-xs text-gray-700 mt-1.5">
          {readinessLevel.description}
        </p>
      </div>
    </div>
  );
}

// =============================================================================
// PRIORITY ACTIONS
// =============================================================================

// Icon mapping for priority actions
const ACTION_ICONS = {
  GraduationCap,
  Stethoscope,
  Eye,
  Calendar,
  Award,
  Users,
  Heart,
  Crown,
  BookOpen,
  FileText,
  BadgePlus,
  FlaskConical,
  Timer,
  Activity,
  RefreshCw,
  FileQuestion,
};

function PriorityActionsCard({ priorityActions, onNavigate }) {
  if (!priorityActions || priorityActions.actions.length === 0) {
    return null;
  }

  const { actions } = priorityActions;

  return (
    <Card className="border-purple-200 overflow-hidden">
      {/* Purple AI-themed header */}
      <CardHeader className="pb-2 bg-linear-to-r from-purple-50 to-violet-50">
        <CardTitle className="flex items-center gap-2 text-sm">
          <div className="flex items-center justify-center w-5 h-5 rounded-md bg-linear-to-br from-purple-500 to-violet-600">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
          <span className="bg-linear-to-r from-purple-700 to-violet-600 bg-clip-text text-transparent font-semibold">
            Smart Suggestions
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-3 space-y-1">
        {actions.map((action) => {
          const Icon = ACTION_ICONS[action.icon] || ChevronRight;
          return (
            <button
              key={action.id}
              onClick={() => onNavigate?.(action.link)}
              className="w-full flex items-start gap-3 px-3 py-2.5 hover:bg-purple-50 rounded-xl transition-colors text-left"
            >
              <Icon className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {action.action}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {action.context}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}

// =============================================================================
// QUICK LINKS
// =============================================================================

function QuickLinks({ onNavigate }) {
  const links = [
    { label: 'GPA Calculator', path: '/tools/gpa-calculator', icon: Calculator },
    { label: 'Clinical Tracker', path: '/trackers/clinical', icon: Stethoscope },
    { label: 'Shadow Tracker', path: '/trackers/shadow', icon: Eye },
    { label: 'Events Tracker', path: '/trackers/events', icon: Calendar },
    { label: 'EQ Tracker', path: '/trackers/eq', icon: Heart },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Quick Links</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <button
              key={link.path}
              onClick={() => onNavigate?.(link.path)}
              className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 rounded-xl transition-colors text-left"
            >
              <span className="flex items-center gap-2 text-sm text-gray-700">
                <Icon className="w-4 h-4 text-gray-400" />
                {link.label}
              </span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}

// =============================================================================
// SIDEBAR NOTES SECTION
// =============================================================================

/**
 * Small visibility indicator dot
 */
function VisibilityDot({ type }) {
  const colors = {
    public: 'bg-blue-400',
    private: 'bg-gray-400',
    admin: 'bg-purple-400',
    mentor: 'bg-amber-400',
  };

  const titles = {
    public: 'Visible on profile',
    private: 'Only you',
    admin: 'All admins',
    mentor: 'You + admins',
  };

  return (
    <span
      className={cn('w-2 h-2 rounded-full shrink-0', colors[type])}
      title={titles[type]}
    />
  );
}

/**
 * Compact editable note for sidebar
 */
function CompactEditableNote({ value, placeholder, onSave, isEditable }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value || '');

  const handleSave = () => {
    onSave?.(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value || '');
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="space-y-2">
        <textarea
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          placeholder={placeholder}
          className="w-full min-h-[60px] p-2 border rounded text-xs resize-y focus:outline-none focus:ring-1 focus:ring-primary/30"
          autoFocus
        />
        <div className="flex justify-end gap-1">
          <Button size="sm" variant="ghost" className="h-6 px-2 text-xs" onClick={handleCancel}>
            Cancel
          </Button>
          <Button size="sm" className="h-6 px-2 text-xs" onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      {value ? (
        <p className="text-xs text-gray-600 line-clamp-3">{value}</p>
      ) : (
        <p className="text-xs text-gray-400 italic">{placeholder}</p>
      )}
      {isEditable && (
        <button
          onClick={() => setIsEditing(true)}
          className="absolute -top-1 -right-1 p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-100 rounded transition-all"
        >
          <Pencil className="w-3 h-3 text-gray-500" />
        </button>
      )}
    </div>
  );
}

/**
 * Collapsible note card for sidebar
 */
function CollapsibleNoteCard({
  title,
  icon: Icon,
  visibilityType,
  defaultOpen = false,
  accentColor = 'gray',
  children,
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const accentStyles = {
    purple: 'border-purple-200 bg-purple-50/30',
    amber: 'border-amber-200 bg-amber-50/30',
    gray: 'border-gray-200 bg-gray-50/50',
    blue: 'border-blue-200 bg-blue-50/30',
    orange: 'border-2 border-orange-200 bg-linear-to-br from-orange-50 via-amber-50/50 to-yellow-50/30 shadow-[0_0_15px_-3px_rgba(251,146,60,0.3)]',
  };

  // Extra padding for orange (Private Notes) style
  const isOrangeStyle = accentColor === 'orange';

  return (
    <Card className={cn('overflow-hidden', accentStyles[accentColor])}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between hover:bg-gray-50/50 transition-colors',
          isOrangeStyle ? 'px-5 py-4' : 'px-3 py-2'
        )}
      >
        <div className="flex items-center gap-2.5">
          <Icon className={cn(
            isOrangeStyle ? 'w-5 h-5 text-orange-600' : 'w-3.5 h-3.5 text-gray-500'
          )} />
          <span className={cn(
            'font-medium',
            isOrangeStyle ? 'text-base' : 'text-xs'
          )}>{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <VisibilityDot type={visibilityType} />
          {isOpen ? (
            <ChevronUp className={cn(isOrangeStyle ? 'w-4 h-4' : 'w-3.5 h-3.5', 'text-gray-400')} />
          ) : (
            <ChevronDown className={cn(isOrangeStyle ? 'w-4 h-4' : 'w-3.5 h-3.5', 'text-gray-400')} />
          )}
        </div>
      </button>

      {isOpen && (
        <CardContent className={cn(
          'pt-0',
          isOrangeStyle ? 'px-5 pb-5' : 'px-3 pb-3'
        )}>
          {children}
        </CardContent>
      )}
    </Card>
  );
}

/**
 * Sidebar notes section container
 */
function SidebarNotesSection({
  userNotes = {},
  adminNotes = [],
  mentorNotes = [],
  viewerRole = 'user',
  currentMentorId = null,
  onSaveNote,
  isOwnProfile = true,
}) {
  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1">
        Notes
      </h4>

      {/* My Private Notes - User Only */}
      {viewerRole === 'user' && isOwnProfile && (
        <CollapsibleNoteCard
          title="Private Notes"
          icon={Lock}
          visibilityType="private"
          accentColor="orange"
          defaultOpen={true}
        >
          <CompactEditableNote
            value={userNotes?.privateNotes}
            placeholder="Personal notes only you can see..."
            onSave={(val) => onSaveNote?.('privateNotes', val)}
            isEditable={true}
          />
        </CollapsibleNoteCard>
      )}

      {/* Admin Notes - Admin Only */}
      {viewerRole === 'admin' && (
        <CollapsibleNoteCard
          title="Admin Notes"
          icon={Shield}
          visibilityType="admin"
          accentColor="purple"
        >
          <div className="space-y-2">
            {adminNotes.length > 0 ? (
              adminNotes.slice(0, 2).map((note, idx) => (
                <div key={idx} className="text-xs text-gray-600 border-l-2 border-purple-300 pl-2">
                  {note.content?.slice(0, 80)}{note.content?.length > 80 ? '...' : ''}
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 italic">No admin notes</p>
            )}
          </div>
        </CollapsibleNoteCard>
      )}

      {/* Mentor Notes - Mentor Only */}
      {viewerRole === 'mentor' && currentMentorId && (
        <CollapsibleNoteCard
          title="My Mentor Notes"
          icon={MessageSquare}
          visibilityType="mentor"
          accentColor="amber"
        >
          <div className="space-y-2">
            {mentorNotes.filter(n => n.mentorId === currentMentorId).length > 0 ? (
              mentorNotes
                .filter(n => n.mentorId === currentMentorId)
                .slice(0, 2)
                .map((note, idx) => (
                  <div key={idx} className="text-xs text-gray-600 border-l-2 border-amber-300 pl-2">
                    {note.content?.slice(0, 80)}{note.content?.length > 80 ? '...' : ''}
                  </div>
                ))
            ) : (
              <p className="text-xs text-gray-400 italic">No mentor notes</p>
            )}
          </div>
        </CollapsibleNoteCard>
      )}
    </div>
  );
}

// =============================================================================
// MAIN SIDEBAR
// =============================================================================

export function StatsSidebar({
  readinessData,
  priorityActions,
  onNavigate,
  // User data for gamification
  user,
  // Notes props
  userNotes,
  adminNotes,
  mentorNotes,
  viewerRole,
  currentMentorId,
  onSaveNote,
  isOwnProfile,
  // Profile completion props
  profileCompletion,
  onScrollToSection,
  onEdit,
}) {
  return (
    <div className="hidden lg:block w-80 shrink-0">
      <div className="sticky top-24 space-y-3">
        {/* Profile Completion Card - Shows until 3 actions complete */}
        {profileCompletion?.shouldShowIndicator && (
          <ProfileCompletionCard
            completedCount={profileCompletion.completedCount}
            requiredActions={profileCompletion.requiredActions}
            isComplete={profileCompletion.isComplete}
            pointsReward={profileCompletion.pointsReward}
            completedLabels={profileCompletion.completedLabels}
            suggestedActions={profileCompletion.suggestedActions}
            onDismiss={profileCompletion.onDismiss}
            onScrollToSection={onScrollToSection}
            onEdit={onEdit}
          />
        )}

        <GamificationWidget user={user} />
        <ReadyScoreGauge readinessData={readinessData} />
        <PriorityActionsCard
          priorityActions={priorityActions}
          onNavigate={onNavigate}
        />
        <QuickLinks onNavigate={onNavigate} />

        {/* Notes Section */}
        <SidebarNotesSection
          userNotes={userNotes}
          adminNotes={adminNotes}
          mentorNotes={mentorNotes}
          viewerRole={viewerRole}
          currentMentorId={currentMentorId}
          onSaveNote={onSaveNote}
          isOwnProfile={isOwnProfile}
        />
      </div>
    </div>
  );
}

export default StatsSidebar;
