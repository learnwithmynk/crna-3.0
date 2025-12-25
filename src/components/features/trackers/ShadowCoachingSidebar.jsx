/**
 * ShadowCoachingSidebar Component
 *
 * A unified, context-aware sidebar that adapts based on user's shadow day journey:
 * - PREPARING: Has upcoming shadow day within 7 days
 * - FOLLOW_UP: Completed shadow day 0-5 days ago, needs logging/follow-up
 * - BUILDING: Actively tracking, no immediate actions
 * - NEW_USER: No shadow days logged yet
 *
 * Each state shows different sidebar content to reduce overwhelm and
 * guide the user to their most relevant next action.
 */

import { useState } from 'react';
import {
  Sparkles,
  Calendar,
  CheckCircle2,
  MessageCircle,
  Users,
  BookOpen,
  Lightbulb,
  Target,
  Clock,
  ChevronDown,
  ChevronUp,
  Mail,
  FileText,
  Plus,
  Star,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

import { ShadowQuestionsBank } from './ShadowQuestionsBank';
import { CRNANetworkCard } from './CRNANetworkCard';
import {
  SHADOW_PREP_CHECKLIST,
  SHADOW_RELATED_LESSONS,
  FOLLOW_UP_ACTIONS,
} from '@/data/shadowDaysEnhanced';

// ============================================
// USER STATE CONSTANTS
// ============================================

export const SHADOW_USER_STATES = {
  PREPARING: 'PREPARING',
  FOLLOW_UP: 'FOLLOW_UP',
  BUILDING: 'BUILDING',
  NEW_USER: 'NEW_USER',
};

// ============================================
// HELPER: Detect User State
// ============================================

export function getUserShadowState(shadowDays = [], upcomingDays = []) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  // Check for upcoming shadow day within 7 days
  const hasUpcoming = upcomingDays.some((day) => {
    const shadowDate = new Date(day.date);
    shadowDate.setHours(0, 0, 0, 0);
    const daysUntil = Math.ceil((shadowDate - now) / (1000 * 60 * 60 * 24));
    return daysUntil >= 0 && daysUntil <= 7;
  });

  // Check for recent shadow day needing follow-up (0-5 days ago)
  const recentNeedsAction = shadowDays.some((day) => {
    if (day.status !== 'logged') return false;
    const entryDate = new Date(day.date);
    entryDate.setHours(0, 0, 0, 0);
    const daysAgo = Math.floor((now - entryDate) / (1000 * 60 * 60 * 24));
    const needsFollowUp = day.followUpStatus === 'none';
    return daysAgo >= 0 && daysAgo <= 5 && needsFollowUp;
  });

  if (shadowDays.length === 0) return SHADOW_USER_STATES.NEW_USER;
  if (hasUpcoming) return SHADOW_USER_STATES.PREPARING;
  if (recentNeedsAction) return SHADOW_USER_STATES.FOLLOW_UP;
  return SHADOW_USER_STATES.BUILDING;
}

// ============================================
// PERSONALIZED MESSAGE COMPONENT
// ============================================

function PersonalizedMessage({ userState, data }) {
  const getMessageContent = () => {
    switch (userState) {
      case SHADOW_USER_STATES.PREPARING:
        return {
          icon: Calendar,
          color: 'from-blue-50 to-indigo-50',
          iconColor: 'text-blue-500',
          message: data.upcomingDay
            ? `${data.daysUntil} day${data.daysUntil !== 1 ? 's' : ''} until your shadow at ${data.upcomingDay.location}. Complete your prep!`
            : 'You have a shadow day coming up soon. Get prepared!',
        };

      case SHADOW_USER_STATES.FOLLOW_UP:
        return {
          icon: Mail,
          color: 'from-yellow-50 to-orange-50',
          iconColor: 'text-yellow-600',
          message: data.recentDay
            ? `Great shadow day! Send a thank you to ${data.recentDay.crnaName} within 48 hours.`
            : 'Follow up on your recent shadow day to build relationships.',
        };

      case SHADOW_USER_STATES.BUILDING:
        return {
          icon: Target,
          color: 'from-green-50 to-emerald-50',
          iconColor: 'text-green-500',
          message:
            data.hoursLogged >= data.goal
              ? `Goal achieved! ${data.hoursLogged} hours logged. Keep building your network!`
              : `${data.hoursLogged} of ${data.goal} hours logged. Schedule your next shadow day!`,
        };

      case SHADOW_USER_STATES.NEW_USER:
      default:
        return {
          icon: Sparkles,
          color: 'from-purple-50 to-pink-50',
          iconColor: 'text-purple-500',
          message: 'Start tracking shadow experiences to build your CRNA network.',
        };
    }
  };

  const content = getMessageContent();
  const Icon = content.icon;

  return (
    <div className={cn('p-3 rounded-xl bg-gradient-to-r', content.color)}>
      <div className="flex items-start gap-2">
        <Icon className={cn('w-4 h-4 flex-shrink-0 mt-0.5', content.iconColor)} />
        <p className="text-sm font-medium text-gray-700">{content.message}</p>
      </div>
    </div>
  );
}

// ============================================
// COMPACT PREP CHECKLIST
// ============================================

function CompactPrepChecklist({ checkedItems = [], onToggle, defaultExpanded = true }) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const completedCount = checkedItems.length;
  const totalCount = SHADOW_PREP_CHECKLIST.length;
  const progress = (completedCount / totalCount) * 100;

  return (
    <Card className="overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-gray-900">Prep Checklist</span>
          <span className="text-xs text-gray-500">
            ({completedCount}/{totalCount})
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Mini progress bar */}
          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden hidden sm:block">
            <div
              className="h-full bg-green-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-100">
          <div className="space-y-1.5 mt-3">
            {SHADOW_PREP_CHECKLIST.map((item) => {
              const isChecked = checkedItems.includes(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => onToggle?.(item.id)}
                  className={cn(
                    'w-full flex items-center gap-2 px-2 py-1.5 rounded text-left transition-colors text-sm',
                    isChecked
                      ? 'bg-green-50 text-green-800'
                      : 'hover:bg-gray-50 text-gray-700'
                  )}
                >
                  <div
                    className={cn(
                      'w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0',
                      isChecked
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-300'
                    )}
                  >
                    {isChecked && (
                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 12 12">
                        <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
                      </svg>
                    )}
                  </div>
                  <span className={cn(isChecked && 'line-through')}>{item.label}</span>
                </button>
              );
            })}
          </div>

          {completedCount === totalCount && (
            <div className="mt-3 p-2 bg-green-100 rounded-xl text-center">
              <p className="text-xs font-medium text-green-800">
                All set! Good luck on your shadow day.
              </p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

// ============================================
// COMPACT LESSONS CARD
// ============================================

function CompactLessonsCard({ limit = 2, completedLessons = [] }) {
  const [expanded, setExpanded] = useState(false);

  const availableLessons = SHADOW_RELATED_LESSONS.filter(
    (l) => !completedLessons.includes(l.id)
  ).slice(0, limit);

  if (availableLessons.length === 0) return null;

  return (
    <Card className="overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-medium text-gray-900">Prep Lessons</span>
          <Badge variant="outline" className="text-xs px-1.5 py-0">
            {availableLessons.length}
          </Badge>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-100">
          <div className="space-y-2 mt-3">
            {availableLessons.map((lesson) => (
              <a
                key={lesson.id}
                href={`/learn/${lesson.slug}`}
                className="flex items-center justify-between p-2 bg-purple-50 rounded hover:bg-purple-100 transition-colors"
              >
                <span className="text-sm text-purple-900 truncate">{lesson.title}</span>
                <span className="text-xs text-purple-600 flex-shrink-0">{lesson.duration}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

// ============================================
// FOLLOW-UP TEMPLATES CARD
// ============================================

function FollowUpTemplatesCard({ recentDay, onShowTemplate }) {
  if (!recentDay) return null;

  const thankYouAction = FOLLOW_UP_ACTIONS.find((a) => a.id === 'followup_1');
  const linkedInAction = FOLLOW_UP_ACTIONS.find((a) => a.id === 'followup_2');

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <Mail className="w-4 h-4 text-blue-600" />
        <h3 className="text-sm font-medium text-gray-900">Follow-Up Templates</h3>
      </div>

      <div className="space-y-2">
        {thankYouAction && (
          <button
            onClick={() => onShowTemplate?.(thankYouAction, recentDay)}
            className="w-full flex items-center justify-between p-2 bg-blue-50 rounded hover:bg-blue-100 transition-colors text-left"
          >
            <span className="text-sm text-blue-900">Thank You Email</span>
            <Badge className="text-xs bg-blue-100 text-blue-700">Recommended</Badge>
          </button>
        )}

        {linkedInAction && (
          <button
            onClick={() => onShowTemplate?.(linkedInAction, recentDay)}
            className="w-full flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors text-left"
          >
            <span className="text-sm text-gray-700">LinkedIn Message</span>
          </button>
        )}
      </div>
    </Card>
  );
}

// ============================================
// LOR OPPORTUNITY CARD
// ============================================

function LOROpportunityCard({ eligibleCRNAs = [], onRequestLOR }) {
  if (eligibleCRNAs.length === 0) return null;

  return (
    <Card className="p-4 bg-purple-50 border-purple-100">
      <div className="flex items-center gap-2 mb-3">
        <FileText className="w-4 h-4 text-purple-600" />
        <h3 className="text-sm font-medium text-purple-900">LOR Opportunity</h3>
        <Badge className="text-xs bg-purple-100 text-purple-700">
          {eligibleCRNAs.length}
        </Badge>
      </div>

      <p className="text-xs text-purple-700 mb-3">
        You've built enough rapport to request a letter:
      </p>

      <div className="space-y-2">
        {eligibleCRNAs.slice(0, 2).map((crna) => (
          <div
            key={crna.id}
            className="flex items-center justify-between p-2 bg-white rounded"
          >
            <div>
              <p className="text-sm font-medium text-gray-900">{crna.name}</p>
              <p className="text-xs text-gray-500">{crna.totalHoursShadowed}h together</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onRequestLOR?.(crna)}
              className="text-xs text-purple-600 border-purple-200"
            >
              Request
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ============================================
// SCHEDULE NEXT SHADOW CTA
// ============================================

function ScheduleNextShadowCard({ hoursRemaining, onAddShadow }) {
  return (
    <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
      <div className="flex items-center gap-2 mb-2">
        <Plus className="w-4 h-4 text-blue-600" />
        <h3 className="text-sm font-medium text-blue-900">Schedule Next Shadow</h3>
      </div>

      <p className="text-xs text-blue-700 mb-3">
        {hoursRemaining > 0
          ? `${hoursRemaining} more hours to reach your goal. Keep building!`
          : 'Goal achieved! Continue building your network for strong LORs.'}
      </p>

      <Button
        size="sm"
        className="w-full bg-blue-600 hover:bg-blue-700"
        onClick={onAddShadow}
      >
        <Plus className="w-3 h-3 mr-1" />
        Log Shadow Day
      </Button>
    </Card>
  );
}

// ============================================
// GETTING STARTED GUIDE (NEW USER)
// ============================================

function GettingStartedGuide({ onAddShadow }) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="w-4 h-4 text-yellow-500" />
        <h3 className="text-sm font-medium text-gray-900">Getting Started</h3>
      </div>

      <div className="space-y-3 text-sm text-gray-600">
        <div className="flex items-start gap-2">
          <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium text-blue-700">
            1
          </span>
          <span>Contact your hospital's anesthesia department</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium text-blue-700">
            2
          </span>
          <span>Ask CRNAs you know for introductions</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium text-blue-700">
            3
          </span>
          <span>Check with your target programs for recommendations</span>
        </div>
      </div>

      <Button
        size="sm"
        className="w-full mt-4"
        onClick={onAddShadow}
      >
        <Plus className="w-3 h-3 mr-1" />
        Log Your First Shadow Day
      </Button>
    </Card>
  );
}

// ============================================
// QUESTIONS PREVIEW (NEW USER)
// ============================================

function QuestionsPreview() {
  const previewQuestions = [
    'What made you choose CRNA over other advanced practice roles?',
    'What do you wish you had known before starting CRNA school?',
    'Can you walk me through how you approach a pre-op assessment?',
  ];

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <MessageCircle className="w-4 h-4 text-blue-600" />
        <h3 className="text-sm font-medium text-gray-900">Questions to Ask</h3>
      </div>

      <p className="text-xs text-gray-500 mb-3">
        Prepare thoughtful questions for your shadow day:
      </p>

      <div className="space-y-2">
        {previewQuestions.map((q, i) => (
          <p key={i} className="text-sm text-gray-700 pl-3 border-l-2 border-blue-200">
            "{q}"
          </p>
        ))}
      </div>
    </Card>
  );
}

// ============================================
// MAIN SIDEBAR COMPONENT
// ============================================

export function ShadowCoachingSidebar({
  userState,
  // Data
  shadowDays = [],
  upcomingDays = [],
  network = [],
  stats = {},
  goal = 24,
  // Callbacks
  onTogglePrepItem,
  onShowTemplate,
  onRequestLOR,
  onAddShadow,
  // State
  checkedPrepItems = [],
  className,
}) {
  // Calculate derived data for personalized message
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  // Find upcoming day
  const upcomingDay = upcomingDays.find((day) => {
    const shadowDate = new Date(day.date);
    shadowDate.setHours(0, 0, 0, 0);
    return shadowDate >= now;
  });

  const daysUntil = upcomingDay
    ? Math.ceil((new Date(upcomingDay.date) - now) / (1000 * 60 * 60 * 24))
    : null;

  // Find recent day needing follow-up
  const recentDay = shadowDays.find((day) => {
    if (day.status !== 'logged' || day.followUpStatus !== 'none') return false;
    const entryDate = new Date(day.date);
    entryDate.setHours(0, 0, 0, 0);
    const daysAgo = Math.floor((now - entryDate) / (1000 * 60 * 60 * 24));
    return daysAgo >= 0 && daysAgo <= 5;
  });

  // Eligible CRNAs for LOR
  const eligibleCRNAs = network.filter(
    (crna) =>
      crna.totalHoursShadowed >= 8 &&
      crna.lorStatus !== 'received' &&
      crna.lorStatus !== 'declined'
  );

  const hoursRemaining = Math.max(0, goal - (stats.totalHours || 0));

  const messageData = {
    upcomingDay,
    daysUntil,
    recentDay,
    hoursLogged: stats.totalHours || 0,
    goal,
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Always show: Personalized message */}
      <PersonalizedMessage userState={userState} data={messageData} />

      {/* PREPARING state */}
      {userState === SHADOW_USER_STATES.PREPARING && (
        <>
          <CompactPrepChecklist
            checkedItems={checkedPrepItems}
            onToggle={onTogglePrepItem}
            defaultExpanded={true}
          />
          <ShadowQuestionsBank
            collapsed={false}
            limit={5}
            hasTargetProgramCRNA={upcomingDay?.targetProgramId != null}
          />
          <CompactLessonsCard limit={2} />
          <CRNANetworkCard
            network={network}
            onRequestLOR={onRequestLOR}
            collapsed={true}
          />
        </>
      )}

      {/* FOLLOW_UP state */}
      {userState === SHADOW_USER_STATES.FOLLOW_UP && (
        <>
          <FollowUpTemplatesCard recentDay={recentDay} onShowTemplate={onShowTemplate} />
          <LOROpportunityCard eligibleCRNAs={eligibleCRNAs} onRequestLOR={onRequestLOR} />
          <CRNANetworkCard
            network={network}
            onRequestLOR={onRequestLOR}
            collapsed={false}
          />
          <ShadowQuestionsBank collapsed={true} />
        </>
      )}

      {/* BUILDING state */}
      {userState === SHADOW_USER_STATES.BUILDING && (
        <>
          <ScheduleNextShadowCard
            hoursRemaining={hoursRemaining}
            onAddShadow={onAddShadow}
          />
          <CRNANetworkCard
            network={network}
            onRequestLOR={onRequestLOR}
            collapsed={false}
          />
          <LOROpportunityCard eligibleCRNAs={eligibleCRNAs} onRequestLOR={onRequestLOR} />
          <ShadowQuestionsBank collapsed={true} />
        </>
      )}

      {/* NEW_USER state */}
      {userState === SHADOW_USER_STATES.NEW_USER && (
        <>
          <GettingStartedGuide onAddShadow={onAddShadow} />
          <QuestionsPreview />
          <CompactPrepChecklist
            checkedItems={[]}
            onToggle={() => {}}
            defaultExpanded={false}
          />
        </>
      )}
    </div>
  );
}

export default ShadowCoachingSidebar;
