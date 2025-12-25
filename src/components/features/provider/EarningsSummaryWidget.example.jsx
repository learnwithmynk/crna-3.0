/**
 * EarningsSummaryWidget Usage Examples
 *
 * Demonstrates different states and configurations of the EarningsSummaryWidget component.
 */

import React from 'react';
import { EarningsSummaryWidget } from './EarningsSummaryWidget';

export function EarningsSummaryWidgetExamples() {
  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold mb-2">EarningsSummaryWidget Examples</h1>
        <p className="text-gray-600 mb-8">
          Various states and configurations for the provider earnings summary.
        </p>

        {/* Example 1: Default with mock data */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Default State (Using Built-in Mock Data)</h2>
          <EarningsSummaryWidget />
        </section>

        {/* Example 2: High earner with goal achieved */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Goal Achieved - High Earner</h2>
          <EarningsSummaryWidget
            earnings={{
              thisMonth: 1250,
              lastMonth: 900,
              availableBalance: 800,
              pendingEarnings: 450,
              nextPayoutDate: new Date('2024-12-20'),
              monthlyGoal: 1000,
            }}
          />
        </section>

        {/* Example 3: New provider with minimal earnings */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">New Provider - Starting Out</h2>
          <EarningsSummaryWidget
            earnings={{
              thisMonth: 75,
              lastMonth: 0,
              availableBalance: 0,
              pendingEarnings: 75,
              nextPayoutDate: new Date('2024-12-27'),
              monthlyGoal: 500,
            }}
          />
        </section>

        {/* Example 4: Declining earnings */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Declining Earnings</h2>
          <EarningsSummaryWidget
            earnings={{
              thisMonth: 320,
              lastMonth: 550,
              availableBalance: 180,
              pendingEarnings: 140,
              nextPayoutDate: new Date('2024-12-15'),
              monthlyGoal: 600,
            }}
          />
        </section>

        {/* Example 5: No monthly goal set */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">No Monthly Goal</h2>
          <EarningsSummaryWidget
            earnings={{
              thisMonth: 425,
              lastMonth: 380,
              availableBalance: 290,
              pendingEarnings: 135,
              nextPayoutDate: new Date('2024-12-22'),
              monthlyGoal: null,
            }}
          />
        </section>

        {/* Example 6: Payout today */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Payout Today</h2>
          <EarningsSummaryWidget
            earnings={{
              thisMonth: 680,
              lastMonth: 520,
              availableBalance: 520,
              pendingEarnings: 160,
              nextPayoutDate: new Date(), // Today
              monthlyGoal: 800,
            }}
          />
        </section>

        {/* Example 7: Large balance ready for payout */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Large Balance - Ready for Payout</h2>
          <EarningsSummaryWidget
            earnings={{
              thisMonth: 2100,
              lastMonth: 1850,
              availableBalance: 3950,
              pendingEarnings: 0,
              nextPayoutDate: new Date('2024-12-20'),
              monthlyGoal: 2000,
            }}
          />
        </section>
      </div>
    </div>
  );
}

export default EarningsSummaryWidgetExamples;
