/**
 * ShadowFollowUpPrompts Component
 *
 * Post-shadow day action prompts including:
 * - "Ready to Log" for past shadow days
 * - Thank you note reminders
 * - LinkedIn connection prompts
 * - LOR request suggestions
 * - Email templates
 */

import { useState } from 'react';
import {
  Mail,
  Linkedin,
  FileText,
  UserPlus,
  Clock,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Copy,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { FOLLOW_UP_ACTIONS } from '@/data/shadowDaysEnhanced';

/**
 * Ready to Log Card - prompts user to log past shadow days
 */
function ReadyToLogCard({ shadowDay, onLog, onDismiss }) {
  const formattedDate = new Date(shadowDay.date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Card className="p-4 bg-yellow-50 border-yellow-200">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-yellow-100 rounded-full">
          <Sparkles className="w-5 h-5 text-yellow-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-yellow-900">Ready to Log?</h4>
            <Badge className="bg-yellow-200 text-yellow-800 border-yellow-300">
              +5 pts
            </Badge>
          </div>
          <p className="text-sm text-yellow-800 mb-2">
            You had a shadow day at <strong>{shadowDay.location}</strong> on{' '}
            {formattedDate}. Log it while it's fresh!
          </p>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => onLog(shadowDay)}
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              Yes, Log It
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDismiss(shadowDay.id)}
              className="text-yellow-700 hover:text-yellow-800"
            >
              Didn't Attend
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

/**
 * Follow-up action card
 */
function FollowUpActionCard({
  entry,
  action,
  onComplete,
  onShowTemplate,
}) {
  const daysAgo = Math.floor(
    (new Date() - new Date(entry.date)) / (1000 * 60 * 60 * 24)
  );

  const getUrgencyColor = () => {
    if (daysAgo <= 2) return 'text-green-600';
    if (daysAgo <= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getUrgencyText = () => {
    if (daysAgo === 0) return 'Today';
    if (daysAgo === 1) return 'Yesterday';
    return `${daysAgo} days ago`;
  };

  const getIcon = () => {
    switch (action.id) {
      case 'followup_1':
        return <Mail className="w-5 h-5" />;
      case 'followup_2':
        return <Linkedin className="w-5 h-5" />;
      case 'followup_5':
        return <FileText className="w-5 h-5" />;
      default:
        return <UserPlus className="w-5 h-5" />;
    }
  };

  return (
    <div className="flex items-start gap-3 p-3 bg-white border rounded-xl">
      <div className={cn('p-2 rounded-full bg-gray-100', getUrgencyColor())}>
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium text-gray-900">{action.action}</h4>
          <span className={cn('text-xs', getUrgencyColor())}>
            {getUrgencyText()}
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-2">
          For <strong>{entry.crnaName}</strong> at {entry.location}
        </p>
        <p className="text-xs text-gray-500 mb-2">{action.timing}</p>
        <div className="flex items-center gap-2">
          {action.template && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onShowTemplate(action, entry)}
              className="text-xs"
            >
              View Template
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onComplete(entry.id, action.id)}
            className="text-xs text-green-600 hover:text-green-700"
          >
            <Check className="w-3 h-3 mr-1" />
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Template modal/card
 */
function TemplateCard({ action, entry, onClose, onCopy }) {
  const [copied, setCopied] = useState(false);

  // Replace placeholders in template
  const personalizedTemplate = action.template
    ?.replace(/\[CRNA Name\]/g, entry.crnaName)
    .replace(/\[Facility\]/g, entry.location)
    .replace(/\[Date\]/g, new Date(entry.date).toLocaleDateString())
    .replace(/\[specific thing you learned\]/g, 'your approach to patient care')
    .replace(/\[topic\]/g, 'anesthesia')
    .replace(/\[Specific moment that stood out\]/g, entry.standoutMoment || 'Seeing you manage that complex case')
    .replace(/\[Your Name\]/g, '[Your Name]')
    .replace(/\[X hours\]/g, `${entry.hours || '8'} hours`);

  const handleCopy = () => {
    navigator.clipboard.writeText(personalizedTemplate);
    setCopied(true);
    onCopy?.();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="p-4 bg-white border-2 border-primary/20">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-900">{action.action} Template</h4>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 mb-3 max-h-64 overflow-y-auto">
        <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
          {personalizedTemplate}
        </pre>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">
          Personalized for {entry.crnaName}
        </p>
        <Button size="sm" onClick={handleCopy}>
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-1" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-1" />
              Copy to Clipboard
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}

/**
 * LOR Recommendation Card
 */
function LORRecommendationCard({ crnas, onRequestLOR }) {
  const eligibleCRNAs = crnas.filter(
    c => c.totalHoursShadowed >= 8 && c.lorStatus !== 'received'
  );

  if (eligibleCRNAs.length === 0) return null;

  return (
    <Card className="p-4 bg-purple-50 border-purple-100">
      <div className="flex items-start gap-3">
        <FileText className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-purple-900 mb-1">
            LOR Opportunity
          </h4>
          <p className="text-sm text-purple-700 mb-3">
            You've built enough rapport with these CRNAs to request a letter:
          </p>
          <div className="space-y-2">
            {eligibleCRNAs.map((crna) => (
              <div
                key={crna.id}
                className="flex items-center justify-between p-2 bg-white rounded-xl"
              >
                <div>
                  <p className="font-medium text-gray-900">{crna.name}</p>
                  <p className="text-xs text-gray-600">
                    {crna.totalHoursShadowed} hours • {crna.facility}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onRequestLOR(crna)}
                  className="text-purple-600 border-purple-200"
                >
                  Request LOR
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

/**
 * Main ShadowFollowUpPrompts component
 */
export function ShadowFollowUpPrompts({
  readyToLog = [],
  recentEntries = [],
  crnaNetwork = [],
  onLogShadowDay,
  onDismissReadyToLog,
  onCompleteAction,
  onRequestLOR,
  className,
}) {
  const [expanded, setExpanded] = useState(true);
  const [activeTemplate, setActiveTemplate] = useState(null);

  // Get entries needing follow-up (logged in last 7 days, no thank you sent)
  const needsFollowUp = recentEntries.filter(
    e => e.followUpStatus === 'none' && e.status === 'logged'
  );

  // Determine which follow-up action to show based on timing
  const getRelevantAction = (entry) => {
    const daysAgo = Math.floor(
      (new Date() - new Date(entry.date)) / (1000 * 60 * 60 * 24)
    );

    if (daysAgo <= 2) {
      return FOLLOW_UP_ACTIONS.find(a => a.id === 'followup_1'); // Thank you
    } else if (daysAgo <= 5) {
      return FOLLOW_UP_ACTIONS.find(a => a.id === 'followup_2'); // LinkedIn
    }
    return null;
  };

  const hasActions = readyToLog.length > 0 || needsFollowUp.length > 0;

  if (!hasActions && crnaNetwork.length === 0) return null;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Section Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full text-left"
      >
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-orange-500" />
          <h3 className="font-semibold text-gray-900">Action Items</h3>
          {hasActions && (
            <Badge className="bg-orange-100 text-orange-700">
              {readyToLog.length + needsFollowUp.length}
            </Badge>
          )}
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {expanded && (
        <div className="space-y-4">
          {/* Ready to Log */}
          {readyToLog.map((shadowDay) => (
            <ReadyToLogCard
              key={shadowDay.id}
              shadowDay={shadowDay}
              onLog={onLogShadowDay}
              onDismiss={onDismissReadyToLog}
            />
          ))}

          {/* Follow-up Actions */}
          {needsFollowUp.map((entry) => {
            const action = getRelevantAction(entry);
            if (!action) return null;

            return (
              <FollowUpActionCard
                key={`${entry.id}-${action.id}`}
                entry={entry}
                action={action}
                onComplete={onCompleteAction}
                onShowTemplate={(a, e) => setActiveTemplate({ action: a, entry: e })}
              />
            );
          })}

          {/* Template Display */}
          {activeTemplate && (
            <TemplateCard
              action={activeTemplate.action}
              entry={activeTemplate.entry}
              onClose={() => setActiveTemplate(null)}
            />
          )}

          {/* LOR Recommendations */}
          <LORRecommendationCard
            crnas={crnaNetwork}
            onRequestLOR={onRequestLOR}
          />

          {/* No actions message */}
          {!hasActions && crnaNetwork.length > 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              No pending follow-ups. Keep building your network!
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default ShadowFollowUpPrompts;
