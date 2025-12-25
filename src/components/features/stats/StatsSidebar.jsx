/**
 * Stats Page Sidebar (Context Panel)
 *
 * Sticky right sidebar for My Stats page containing:
 * - ReadyScore circular gauge
 * - Priority Actions (tiered, non-dismissible)
 * - Quick links to trackers + GPA calculator
 * - Notes section (collapsible cards)
 */

import React, { useState } from 'react';
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
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-white to-primary/5">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <TrendingUp className="w-4 h-4 text-primary" />
          CRNA School ReadyScore™
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Circular Score */}
        <div className="flex justify-center">
          <div className="relative w-24 h-24">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke={getStrokeColor(totalScore)}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(totalScore / 100) * 264} 264`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-bold ${getScoreColor(totalScore)}`}>
                {totalScore}
              </span>
            </div>
          </div>
        </div>

        {/* Level Badge */}
        <div className="text-center">
          <Badge className={`${readinessLevel.bgColor} ${readinessLevel.color} text-xs`}>
            {readinessLevel.label}
          </Badge>
          <p className="text-xs text-gray-500 mt-1.5">
            {readinessLevel.description}
          </p>
        </div>
      </CardContent>
    </Card>
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

  const { actions, tierLabel } = priorityActions;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-sm">
          <span>Priority Actions</span>
          <Badge variant="outline" className="text-xs font-normal">
            {tierLabel}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {actions.map((action) => {
            const Icon = ACTION_ICONS[action.icon] || ChevronRight;
            return (
              <button
                key={action.id}
                onClick={() => onNavigate?.(action.link)}
                className="w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
              >
                <Icon className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {action.action}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {action.context}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              </button>
            );
          })}
        </div>
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
      <CardContent className="p-0">
        <div className="divide-y">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <button
                key={link.path}
                onClick={() => onNavigate?.(link.path)}
                className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
              >
                <span className="flex items-center gap-2 text-sm text-gray-700">
                  <Icon className="w-4 h-4 text-gray-400" />
                  {link.label}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            );
          })}
        </div>
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
      className={cn('w-2 h-2 rounded-full flex-shrink-0', colors[type])}
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
  };

  return (
    <Card className={cn('overflow-hidden', accentStyles[accentColor])}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon className="w-3.5 h-3.5 text-gray-500" />
          <span className="text-xs font-medium">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <VisibilityDot type={visibilityType} />
          {isOpen ? (
            <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          )}
        </div>
      </button>

      {isOpen && (
        <CardContent className="px-3 pb-3 pt-0">
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
          accentColor="gray"
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
  // Notes props
  userNotes,
  adminNotes,
  mentorNotes,
  viewerRole,
  currentMentorId,
  onSaveNote,
  isOwnProfile,
}) {
  return (
    <div className="hidden lg:block w-80 flex-shrink-0">
      <div className="sticky top-24 space-y-3 max-h-[calc(100vh-8rem)] overflow-y-auto pr-1">
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
