/**
 * DashboardNudgeCard
 *
 * Individual nudge card component for the dashboard sidebar.
 * Displays title, message, actions, and handles dismiss/snooze.
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  X,
  Clock,
  AlertTriangle,
  AlertCircle,
  Info,
  PartyPopper,
  ChevronRight,
} from 'lucide-react';

/**
 * Urgency styling configurations
 */
const urgencyStyles = {
  critical: {
    container: 'bg-red-50 border-l-4 border-l-red-500',
    icon: AlertTriangle,
    iconColor: 'text-red-500',
    title: 'text-red-900',
  },
  high: {
    container: 'bg-orange-50 border-l-4 border-l-orange-400',
    icon: AlertCircle,
    iconColor: 'text-orange-500',
    title: 'text-orange-900',
  },
  medium: {
    container: 'bg-blue-50 border-l-4 border-l-blue-400',
    icon: Info,
    iconColor: 'text-blue-500',
    title: 'text-blue-900',
  },
  low: {
    container: 'bg-gray-50 border-l-4 border-l-gray-300',
    icon: Info,
    iconColor: 'text-gray-500',
    title: 'text-gray-900',
  },
  celebration: {
    container: 'bg-primary/10 border-l-4 border-l-primary',
    icon: PartyPopper,
    iconColor: 'text-primary',
    title: 'text-gray-900',
  },
};

export function DashboardNudgeCard({
  nudge,
  onDismiss,
  onSnooze,
  onAction,
  compact = false,
  className,
}) {
  const {
    id,
    title,
    message,
    actions = [],
    urgency = 'medium',
    type,
    dismissible = true,
    snoozeable = false,
  } = nudge;

  // Use celebration style for celebration type
  const effectiveUrgency = type === 'celebration' ? 'celebration' : urgency;
  const styles = urgencyStyles[effectiveUrgency] || urgencyStyles.medium;
  const Icon = styles.icon;

  const handleAction = (action) => {
    if (action.actionType === 'dismiss') {
      onDismiss?.(id);
    } else if (action.actionType === 'snooze') {
      onSnooze?.(id, action.days || 7);
    } else if (action.actionType === 'link' && action.href) {
      // Navigate to link
      window.location.href = action.href;
    } else {
      // Custom action handler
      onAction?.(id, action);
    }
  };

  return (
    <div
      className={cn(
        'relative rounded-xl p-4 shadow-sm',
        styles.container,
        compact && 'p-3',
        className
      )}
    >
      {/* Dismiss button */}
      {dismissible && (
        <button
          onClick={() => onDismiss?.(id)}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-black/5 transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4 text-gray-400" />
        </button>
      )}

      {/* Content */}
      <div className="flex gap-3">
        {/* Icon */}
        <div className={cn('flex-shrink-0 mt-0.5', styles.iconColor)}>
          <Icon className="h-5 w-5" />
        </div>

        <div className="flex-1 min-w-0">
          {/* Title */}
          <h4
            className={cn(
              'font-medium text-sm leading-tight pr-6',
              styles.title,
              compact && 'text-xs'
            )}
          >
            {title}
          </h4>

          {/* Message */}
          {message && (
            <p
              className={cn(
                'mt-1 text-sm text-gray-600',
                compact && 'text-xs mt-0.5'
              )}
            >
              {message}
            </p>
          )}

          {/* Actions */}
          {actions.length > 0 && (
            <div className={cn('mt-3 flex flex-wrap gap-2', compact && 'mt-2')}>
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={index === 0 ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleAction(action)}
                  className={cn(
                    'text-xs h-7',
                    index === 0 && type !== 'celebration' && 'bg-gray-900 hover:bg-gray-800'
                  )}
                >
                  {action.label}
                  {action.actionType === 'link' && (
                    <ChevronRight className="ml-1 h-3 w-3" />
                  )}
                </Button>
              ))}
            </div>
          )}

          {/* Snooze option */}
          {snoozeable && (
            <button
              onClick={() => onSnooze?.(id, 7)}
              className="mt-2 text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <Clock className="h-3 w-3" />
              Remind me later
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Compact version for inline prompts
 */
export function InlineNudgeCard({
  nudge,
  onDismiss,
  onSnooze,
  onAction,
  className,
}) {
  return (
    <DashboardNudgeCard
      nudge={nudge}
      onDismiss={onDismiss}
      onSnooze={onSnooze}
      onAction={onAction}
      compact
      className={cn('shadow-none', className)}
    />
  );
}

/**
 * Celebration card with special styling
 */
export function CelebrationCard({ nudge, onDismiss, onAction }) {
  const { id, title, message, actions = [] } = nudge;

  return (
    <div className="relative bg-gradient-to-r from-primary/20 to-yellow-100 rounded-xl p-4 shadow-sm border border-primary/30">
      {/* Dismiss button */}
      <button
        onClick={() => onDismiss?.(id)}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-black/5 transition-colors"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4 text-gray-400" />
      </button>

      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <PartyPopper className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1 pr-6">
          <h4 className="font-semibold text-gray-900">{title}</h4>
          {message && <p className="mt-1 text-sm text-gray-600">{message}</p>}

          {actions.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={index === 0 ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => {
                    if (action.actionType === 'dismiss') {
                      onDismiss?.(id);
                    } else {
                      onAction?.(id, action);
                    }
                  }}
                  className="text-xs h-7"
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardNudgeCard;
