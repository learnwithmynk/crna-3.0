/**
 * AffirmationState - Positive feedback when user has 0 Next Best Steps
 *
 * Displays supportive messaging when the user is "on track" and no
 * high-yield actions are currently needed. Message tone adapts to supportMode.
 *
 * See /docs/skills/guidance-engine-spec.md for affirmation state definition.
 */

import { CheckCircle } from 'lucide-react';
import { SUPPORT_MODES } from '@/lib/enums';

const AFFIRMATION_MESSAGES = {
  [SUPPORT_MODES.ORIENTATION]: {
    headline: 'Take your time',
    subtext: "Explore at your own pace. We'll guide you when you're ready.",
  },
  [SUPPORT_MODES.STRATEGY]: {
    headline: 'Great progress!',
    subtext: 'Your plan is taking shape. Keep building momentum.',
  },
  [SUPPORT_MODES.EXECUTION]: {
    headline: "You're on track",
    subtext: "You're making great progress on your applications.",
  },
  [SUPPORT_MODES.CONFIDENCE]: {
    headline: "You're ready",
    subtext: "Trust the work you've put in. You've got this.",
  },
};

export function AffirmationState({ supportMode }) {
  const message =
    AFFIRMATION_MESSAGES[supportMode] ??
    AFFIRMATION_MESSAGES[SUPPORT_MODES.ORIENTATION];

  return (
    <div className="bg-green-50 rounded-xl border-l-[3px] border-l-green-500 p-4">
      <div className="flex items-start gap-3">
        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
        <div>
          <h3 className="font-medium text-green-900">{message.headline}</h3>
          <p className="text-sm text-green-700 mt-1">{message.subtext}</p>
        </div>
      </div>
    </div>
  );
}

export default AffirmationState;
