/**
 * PointsToast - Toast notification when user earns points
 *
 * Uses sonner (already configured in App.jsx) for toast notifications.
 * Call showPointsToast() to display the notification.
 *
 * Usage:
 * import { showPointsToast } from '@/components/features/gamification/PointsToast';
 * showPointsToast(10, 'Logged clinical experience');
 */

import { toast } from 'sonner';
import { Star } from 'lucide-react';

/**
 * Show a points earned toast notification
 * @param {number} points - Number of points earned
 * @param {string} action - Description of what earned the points (optional)
 */
export function showPointsToast(points, action) {
  toast.custom(
    (t) => (
      <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-lg">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20">
          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-900">
            +{points} point{points !== 1 ? 's' : ''}!
          </p>
          {action && (
            <p className="text-sm text-gray-500">{action}</p>
          )}
        </div>
      </div>
    ),
    {
      duration: 3000,
      position: 'bottom-right',
    }
  );
}

/**
 * PointsToastContent - Standalone component for custom rendering
 * Use this if you need to render the toast content differently
 */
export function PointsToastContent({ points, action }) {
  return (
    <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-lg">
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20">
        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
      </div>
      <div className="flex-1">
        <p className="font-semibold text-gray-900">
          +{points} point{points !== 1 ? 's' : ''}!
        </p>
        {action && (
          <p className="text-sm text-gray-500">{action}</p>
        )}
      </div>
    </div>
  );
}
