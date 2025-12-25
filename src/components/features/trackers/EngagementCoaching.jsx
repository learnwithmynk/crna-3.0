/**
 * EngagementCoaching Component
 *
 * Actionable sidebar/card showing program engagement status with coaching.
 * Features:
 * - Visual progress bar for overall engagement
 * - Per-program breakdown (engaged vs not)
 * - Explains WHY engagement matters
 * - Specific actionable next step with CTA
 *
 * Replaces the static "Engagement by Program" collapsible section.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  CheckCircle2,
  Circle,
  Calendar,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Target,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Progress bar component
 */
function EngagementProgressBar({ engaged, total }) {
  const percentage = total > 0 ? Math.round((engaged / total) * 100) : 0;

  // Color based on percentage
  const getColorClass = () => {
    if (percentage === 0) return 'bg-gray-300';
    if (percentage < 50) return 'bg-yellow-400';
    if (percentage < 100) return 'bg-blue-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">
          <span className="font-semibold text-gray-900">{engaged}</span> of {total} programs engaged
        </span>
        <span className="font-medium text-gray-900">{percentage}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-500', getColorClass())}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

/**
 * Single program row
 */
function ProgramRow({ program, isEngaged, lastEvent, onAddEvent }) {
  return (
    <div className="flex items-start gap-2 py-2">
      {isEngaged ? (
        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
      ) : (
        <Circle className="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5" />
      )}
      <div className="flex-1 min-w-0">
        <span className={cn(
          'text-sm font-medium',
          isEngaged ? 'text-gray-900' : 'text-gray-500'
        )}>
          {program.schoolName}
        </span>
        {isEngaged && lastEvent && (
          <p className="text-xs text-gray-500 truncate">
            {lastEvent}
          </p>
        )}
        {!isEngaged && (
          <p className="text-xs text-gray-400">
            No events attended yet
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Why This Matters explainer
 */
function WhyItMatters({ isExpanded, onToggle }) {
  return (
    <div className="bg-purple-50 rounded-xl p-3 mt-3">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between text-left"
      >
        <span className="text-xs font-medium text-purple-700 flex items-center gap-1.5">
          <Lightbulb className="w-3.5 h-3.5" />
          Why engagement matters
        </span>
        {isExpanded ? (
          <ChevronUp className="w-3.5 h-3.5 text-purple-500" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-purple-500" />
        )}
      </button>
      {isExpanded && (
        <div className="mt-2 text-xs text-purple-700 space-y-1.5">
          <p>
            Programs notice when applicants attend events. It shows genuine
            interest and gives you talking points for interviews.
          </p>
          <p>
            <strong>Pro tip:</strong> Mention specific details from events in
            your personal statement and interviews.
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Main component
 */
export function EngagementCoaching({
  targetPrograms = [],
  programEngagement = [],
  suggestedEvent = null,
  onAddToCalendar,
  onBrowseEvents,
  className,
}) {
  const navigate = useNavigate();
  const [showWhyMatters, setShowWhyMatters] = useState(false);

  // Calculate engagement stats
  const engagedPrograms = programEngagement.filter(p => p.totalTouchpoints > 0);
  const unengagedPrograms = programEngagement.filter(p => p.totalTouchpoints === 0);
  const totalPrograms = programEngagement.length;
  const engagedCount = engagedPrograms.length;

  // Find the priority program to engage (first unengaged with upcoming deadline)
  const priorityProgram = unengagedPrograms[0];

  // If no target programs, show a different state
  if (totalPrograms === 0) {
    return (
      <div className={cn('rounded-3xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-sm p-4', className)}>
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-widest flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4" />
          Program Engagement
        </h3>
        <div className="text-center py-4">
          <Target className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500 mb-3">
            Add target programs to track your engagement
          </p>
          <Button variant="outline" size="sm" onClick={() => navigate('/schools')}>
            Browse Programs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('rounded-3xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-sm p-4', className)}>
      {/* Header */}
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-widest flex items-center gap-2 mb-4">
        <TrendingUp className="w-4 h-4" />
        Program Engagement
      </h3>

      {/* Progress Bar */}
      <EngagementProgressBar engaged={engagedCount} total={totalPrograms} />

      {/* Program List */}
      <div className="mt-4 space-y-0.5 max-h-[200px] overflow-y-auto">
        {/* Engaged programs first */}
        {engagedPrograms.map((program) => (
          <ProgramRow
            key={program.programId}
            program={program}
            isEngaged={true}
            lastEvent={program.touchpoints?.[0]?.label}
          />
        ))}
        {/* Then unengaged */}
        {unengagedPrograms.map((program) => (
          <ProgramRow
            key={program.programId}
            program={program}
            isEngaged={false}
          />
        ))}
      </div>

      {/* Actionable Suggestion */}
      {priorityProgram && suggestedEvent && (
        <div className="mt-4 p-3 bg-yellow-50/80 rounded-2xl">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-yellow-800">
                Next step for {priorityProgram.programName}
              </p>
              <p className="text-xs text-yellow-700 mt-0.5">
                {suggestedEvent.title}
              </p>
              <p className="text-xs text-yellow-600 mt-0.5 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {suggestedEvent.dateFormatted}
              </p>
              <Button
                size="sm"
                onClick={() => onAddToCalendar?.(suggestedEvent)}
                className="mt-2 h-7 text-xs bg-yellow-500 hover:bg-yellow-600 text-gray-900"
              >
                <Calendar className="w-3 h-3 mr-1" />
                Add to Calendar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* No Suggested Event but has unengaged programs */}
      {priorityProgram && !suggestedEvent && (
        <div className="mt-4 p-3 bg-gray-50/80 rounded-2xl">
          <div className="flex items-start gap-2">
            <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-gray-700">
                <span className="font-medium">{priorityProgram.programName}</span> needs engagement
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Check for upcoming info sessions or open houses
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onBrowseEvents ? onBrowseEvents() : navigate('/events')}
                className="mt-2 h-7 text-xs"
              >
                Find Events
                <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* All Engaged Celebration */}
      {engagedCount === totalPrograms && totalPrograms > 0 && (
        <div className="mt-4 p-3 bg-green-50/80 rounded-2xl text-center">
          <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto mb-1" />
          <p className="text-sm font-medium text-green-800">
            Great job! You've engaged with all your target programs
          </p>
          <p className="text-xs text-green-600 mt-0.5">
            Keep logging events to build stronger talking points
          </p>
        </div>
      )}

      {/* Why This Matters */}
      <WhyItMatters
        isExpanded={showWhyMatters}
        onToggle={() => setShowWhyMatters(!showWhyMatters)}
      />
    </div>
  );
}

export default EngagementCoaching;
