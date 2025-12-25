/**
 * GrowYourPracticeCTA Example Usage
 *
 * Demonstrates how to use the GrowYourPracticeCTA component
 * with state management for tracking completed actions.
 */

import { useState } from 'react';
import { GrowYourPracticeCTA } from './GrowYourPracticeCTA';

export default function GrowYourPracticeCTAExample() {
  // Track which actions have been completed
  const [completedActions, setCompletedActions] = useState([
    'forums', // Example: user has already posted in forums
  ]);

  // Track engagement score (could be calculated from backend)
  const [engagementScore, setEngagementScore] = useState(24);

  // Points mapping for calculating score
  const ACTION_POINTS = {
    forums: 2,
    questions: 2,
    'live-qa': 10,
    social: 0, // No points for social sharing
  };

  // Handle when user completes/uncompletes an action
  const handleActionComplete = (actionId) => {
    setCompletedActions((prev) => {
      const isCurrentlyCompleted = prev.includes(actionId);

      // Toggle completion status
      if (isCurrentlyCompleted) {
        // Remove from completed
        const newCompleted = prev.filter((id) => id !== actionId);

        // Decrease score if action has points
        const points = ACTION_POINTS[actionId] || 0;
        setEngagementScore((score) => Math.max(0, score - points));

        return newCompleted;
      } else {
        // Add to completed
        const newCompleted = [...prev, actionId];

        // Increase score if action has points
        const points = ACTION_POINTS[actionId] || 0;
        setEngagementScore((score) => score + points);

        return newCompleted;
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Provider Dashboard</h1>
          <p className="text-gray-600">
            Grow your mentoring practice with community engagement
          </p>
        </div>

        {/* The Component */}
        <GrowYourPracticeCTA
          completedActions={completedActions}
          engagementScore={engagementScore}
          onActionComplete={handleActionComplete}
        />

        {/* Debug Info */}
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <h3 className="font-semibold mb-2">Debug Info:</h3>
          <div className="text-sm space-y-1">
            <p>
              <strong>Completed Actions:</strong>{' '}
              {completedActions.length > 0
                ? completedActions.join(', ')
                : 'None'}
            </p>
            <p>
              <strong>Engagement Score:</strong> {engagementScore} points
            </p>
          </div>
        </div>

        {/* Multiple States Example */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-semibold mb-2 text-gray-600">
              Empty State (New Provider)
            </h3>
            <GrowYourPracticeCTA
              completedActions={[]}
              engagementScore={0}
              onActionComplete={(id) => console.log('Action:', id)}
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2 text-gray-600">
              High Engagement Provider
            </h3>
            <GrowYourPracticeCTA
              completedActions={['forums', 'questions', 'live-qa', 'social']}
              engagementScore={142}
              onActionComplete={(id) => console.log('Action:', id)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
