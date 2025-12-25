/**
 * NextBestStepItem - Individual step row in the Next Best Steps card
 *
 * Displays a single actionable step with:
 * - Gradient numbered circle (1, 2, 3)
 * - Action text (what to do)
 * - Why it matters (brief explanation)
 * - Click to navigate to destination
 * - Dismiss button (X) to hide for 7 days
 *
 * NEW: Soft gradient design with enhanced hover states
 *
 * See /docs/skills/guidance-engine-spec.md for step schema.
 */

import { Link } from 'react-router-dom';
import { ChevronRight, X } from 'lucide-react';

export function NextBestStepItem({ step, stepNumber, onDismiss, onComplete }) {
  const handleDismiss = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDismiss?.();
  };

  const handleClick = () => {
    // Track completion before navigation
    onComplete?.();
  };

  return (
    <Link
      to={step.cta?.href ?? step.href}
      onClick={handleClick}
      className="group block rounded-2xl p-4 hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-start gap-4">
        {/* Gradient numbered circle */}
        {stepNumber && (
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 text-white text-base font-semibold shrink-0 shadow-sm">
            {stepNumber}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-base font-semibold text-gray-900 group-hover:text-gray-700">
            {step.action}
          </p>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {step.whyItMatters}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Dismiss button - visible on hover (desktop) or always (mobile via CSS) */}
          {onDismiss && (
            <button
              onClick={handleDismiss}
              className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100"
              aria-label="Dismiss this step"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Chevron */}
          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
        </div>
      </div>
    </Link>
  );
}

export default NextBestStepItem;
