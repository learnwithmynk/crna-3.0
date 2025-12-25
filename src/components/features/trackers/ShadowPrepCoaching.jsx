/**
 * ShadowPrepCoaching Component
 *
 * Pre-shadow day preparation coaching including:
 * - Upcoming shadow day preview with countdown
 * - Preparation checklist
 * - LearnDash lesson recommendations
 * - Research prompts for the facility
 * - Target program connection alerts
 */

import { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Circle,
  BookOpen,
  Building2,
  Target,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Lightbulb,
  Clock,
  MapPin,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  SHADOW_PREP_CHECKLIST,
  SHADOW_RELATED_LESSONS,
} from '@/data/shadowDaysEnhanced';

/**
 * Countdown display for upcoming shadow day
 */
function CountdownBadge({ date }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const shadowDate = new Date(date);
  shadowDate.setHours(0, 0, 0, 0);

  const diffDays = Math.ceil((shadowDate - today) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return (
      <Badge className="bg-green-100 text-green-700 border-green-200">
        Today!
      </Badge>
    );
  } else if (diffDays === 1) {
    return (
      <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
        Tomorrow
      </Badge>
    );
  } else if (diffDays <= 7) {
    return (
      <Badge className="bg-blue-100 text-blue-700 border-blue-200">
        In {diffDays} days
      </Badge>
    );
  } else {
    return (
      <Badge variant="outline" className="text-gray-600">
        In {diffDays} days
      </Badge>
    );
  }
}

/**
 * Upcoming shadow day preview card
 */
function UpcomingShadowPreview({ shadowDay, targetPrograms = [] }) {
  const formattedDate = new Date(shadowDay.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  // Check if this is at a target program
  const isTargetProgram = shadowDay.targetProgramId &&
    targetPrograms.some(p => p.id === shadowDay.targetProgramId);

  return (
    <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <span className="font-semibold text-blue-900">Upcoming Shadow Day</span>
        </div>
        <CountdownBadge date={shadowDay.date} />
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-blue-800">
          <Clock className="w-4 h-4" />
          <span>{formattedDate}</span>
          {shadowDay.hours && <span>• {shadowDay.hours} hours</span>}
        </div>
        <div className="flex items-center gap-2 text-sm text-blue-800">
          <MapPin className="w-4 h-4" />
          <span>{shadowDay.location}</span>
        </div>
        {shadowDay.crnaName && shadowDay.crnaName !== 'To be assigned' && (
          <div className="text-sm text-blue-800">
            <span className="font-medium">With:</span> {shadowDay.crnaName}
            {shadowDay.crnaSpecialty && (
              <span className="text-blue-600"> ({shadowDay.crnaSpecialty})</span>
            )}
          </div>
        )}
      </div>

      {isTargetProgram && (
        <div className="flex items-center gap-2 p-2 bg-green-100 rounded-xl text-sm text-green-800 mb-3">
          <Target className="w-4 h-4" />
          <span>
            <strong>Target Program!</strong> This is at one of your target schools.
            Great opportunity to learn more and make connections.
          </span>
        </div>
      )}

      {shadowDay.notes && (
        <p className="text-sm text-blue-700 italic">"{shadowDay.notes}"</p>
      )}
    </Card>
  );
}

/**
 * Preparation checklist
 */
function PrepChecklist({ checkedItems, onToggle }) {
  const [expanded, setExpanded] = useState(true);

  const completedCount = checkedItems.length;
  const totalCount = SHADOW_PREP_CHECKLIST.length;
  const progress = (completedCount / totalCount) * 100;

  return (
    <div className="space-y-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full text-left"
      >
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <span className="font-medium text-gray-900">Preparation Checklist</span>
          <span className="text-sm text-gray-500">
            ({completedCount}/{totalCount})
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {expanded && (
        <>
          {/* Progress bar */}
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Checklist items */}
          <div className="space-y-2">
            {SHADOW_PREP_CHECKLIST.map((item) => {
              const isChecked = checkedItems.includes(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => onToggle(item.id)}
                  className={cn(
                    'w-full flex items-start gap-3 p-3 rounded-xl text-left transition-colors',
                    isChecked
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                  )}
                >
                  {isChecked ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      'font-medium',
                      isChecked ? 'text-green-900' : 'text-gray-900'
                    )}>
                      {item.label}
                    </p>
                    <p className={cn(
                      'text-sm',
                      isChecked ? 'text-green-700' : 'text-gray-600'
                    )}>
                      {item.description}
                    </p>
                    {item.lessonLink && (
                      <a
                        href={item.lessonLink}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1"
                      >
                        <BookOpen className="w-3 h-3" />
                        {item.lessonTitle}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {completedCount === totalCount && (
            <div className="p-3 bg-green-100 rounded-xl text-center">
              <p className="text-green-800 font-medium">
                You're all set! Good luck on your shadow day.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/**
 * Lesson recommendations
 */
function LessonRecommendations({ lessons, completedLessons = [] }) {
  const available = lessons.filter(l => !completedLessons.includes(l.id)).slice(0, 3);

  if (available.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-purple-600" />
        <span className="font-medium text-gray-900">Recommended Lessons</span>
      </div>

      <div className="space-y-2">
        {available.map((lesson) => (
          <a
            key={lesson.id}
            href={`/learn/${lesson.slug}`}
            className="flex items-center justify-between p-3 bg-purple-50 border border-purple-100 rounded-xl hover:bg-purple-100 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <p className="font-medium text-purple-900">{lesson.title}</p>
              <p className="text-sm text-purple-700">{lesson.description}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-purple-600 flex-shrink-0">
              <Clock className="w-4 h-4" />
              {lesson.duration}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

/**
 * Main ShadowPrepCoaching component
 */
export function ShadowPrepCoaching({
  upcomingShadowDays = [],
  targetPrograms = [],
  completedLessons = [],
  className,
}) {
  const [checkedItems, setCheckedItems] = useState([]);

  // Get nearest upcoming shadow day
  const nextShadowDay = upcomingShadowDays[0];

  const handleTogglePrep = (itemId) => {
    setCheckedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // If no upcoming shadow days, show prompt to schedule
  if (!nextShadowDay) {
    return (
      <Card className={cn('p-5', className)}>
        <div className="flex items-start gap-3">
          <Lightbulb className="w-6 h-6 text-yellow-500 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">
              Schedule Your Next Shadow Day
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Most CRNA programs require 24+ hours of shadowing. Start reaching out
              to CRNAs now to secure your spot.
            </p>
            <div className="space-y-2 text-sm text-gray-700">
              <p className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-gray-400" />
                Contact your hospital's anesthesia department
              </p>
              <p className="flex items-center gap-2">
                <Target className="w-4 h-4 text-gray-400" />
                Ask CRNAs you know for introductions
              </p>
              <p className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-gray-400" />
                Check with your target programs for recommendations
              </p>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Upcoming Shadow Day Preview */}
      <UpcomingShadowPreview
        shadowDay={nextShadowDay}
        targetPrograms={targetPrograms}
      />

      {/* Preparation Checklist */}
      <Card className="p-4">
        <PrepChecklist
          checkedItems={checkedItems}
          onToggle={handleTogglePrep}
        />
      </Card>

      {/* Lesson Recommendations */}
      <Card className="p-4">
        <LessonRecommendations
          lessons={SHADOW_RELATED_LESSONS}
          completedLessons={completedLessons}
        />
      </Card>
    </div>
  );
}

export default ShadowPrepCoaching;
