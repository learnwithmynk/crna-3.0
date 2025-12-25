/**
 * TalkingPointsCard Component
 *
 * Displays AI-generated interview talking points from event notes.
 * Features:
 * - Generated summary paragraph
 * - Copy to clipboard functionality
 * - Edit option
 * - Regenerate button (mock)
 * - Loading/generating state
 */

import { useState } from 'react';
import { toast } from 'sonner';
import { Sparkles, Copy, Check, RefreshCw, Edit2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Loading skeleton for generating state
 */
function GeneratingSkeleton() {
  return (
    <div className="space-y-2 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="h-4 bg-gray-200 rounded w-11/12" />
      <div className="h-4 bg-gray-200 rounded w-10/12" />
      <div className="h-4 bg-gray-200 rounded w-3/4" />
    </div>
  );
}

/**
 * Main component
 */
export function TalkingPointsCard({
  talkingPoints,
  onRegenerate,
  onEdit,
  isGenerating = false,
  eventTitle,
  programName,
  className,
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!talkingPoints) return;

    try {
      await navigator.clipboard.writeText(talkingPoints);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // No talking points yet
  if (!talkingPoints && !isGenerating) {
    return (
      <div
        className={cn(
          'border border-dashed border-gray-300 rounded-xl p-4 bg-gray-50',
          className
        )}
      >
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-purple-500" />
          <span className="text-sm font-medium text-gray-700">Interview Talking Points</span>
        </div>
        <p className="text-sm text-gray-500 mb-3">
          Log this event with detailed notes to generate interview talking points.
        </p>
        <Button
          variant="outline"
          size="sm"
          disabled
          className="text-gray-400"
        >
          <Sparkles className="w-4 h-4 mr-1" />
          Generate Talking Points
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'border border-purple-200 bg-gradient-to-br from-purple-50 to-white rounded-xl p-4',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          </div>
          <span className="text-sm font-semibold text-purple-900">
            Your Interview Talking Points
          </span>
        </div>
        {programName && (
          <span className="text-xs text-purple-600 bg-purple-100 px-2 py-0.5 rounded">
            {programName}
          </span>
        )}
      </div>

      {/* Event context */}
      {eventTitle && (
        <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
          <MessageSquare className="w-3 h-3" />
          Based on: {eventTitle}
        </p>
      )}

      {/* Content */}
      <div className="mb-4">
        {isGenerating ? (
          <GeneratingSkeleton />
        ) : (
          <blockquote className="text-sm text-gray-700 leading-relaxed italic border-l-2 border-purple-300 pl-3">
            "{talkingPoints}"
          </blockquote>
        )}
      </div>

      {/* Actions */}
      {!isGenerating && talkingPoints && (
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="text-xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1 text-green-500" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1" />
                Copy to Clipboard
              </>
            )}
          </Button>

          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="text-xs text-gray-500"
            >
              <Edit2 className="w-3.5 h-3.5 mr-1" />
              Edit
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (onRegenerate) {
                onRegenerate();
              } else {
                toast.info('AI regeneration coming soon', {
                  description: 'This feature will use AI to generate new talking points.',
                });
              }
            }}
            className="text-xs text-gray-500"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" />
            Regenerate
          </Button>
        </div>
      )}

      {/* Generating state actions */}
      {isGenerating && (
        <div className="flex items-center gap-2 text-sm text-purple-600">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Generating talking points...</span>
        </div>
      )}
    </div>
  );
}

/**
 * Compact inline version for event list items
 */
export function TalkingPointsPreview({
  talkingPoints,
  maxLength = 100,
  onClick,
  className,
}) {
  if (!talkingPoints) return null;

  const truncated =
    talkingPoints.length > maxLength
      ? talkingPoints.substring(0, maxLength) + '...'
      : talkingPoints;

  return (
    <button
      onClick={onClick}
      className={cn(
        'text-left w-full mt-2 p-2 bg-purple-50 rounded text-xs text-purple-700 hover:bg-purple-100 transition-colors',
        className
      )}
    >
      <div className="flex items-start gap-1.5">
        <Sparkles className="w-3 h-3 mt-0.5 flex-shrink-0" />
        <span className="line-clamp-2">{truncated}</span>
      </div>
    </button>
  );
}

export default TalkingPointsCard;
