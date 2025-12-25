/**
 * EarningsSummaryWidget Component
 *
 * Displays comprehensive earnings overview for SRNA providers.
 * Shows current month earnings, available balance, pending amounts, and next payout.
 * Includes comparison to previous month and optional monthly goal progress.
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// TODO: Replace with API call
const DEFAULT_MOCK_EARNINGS = {
  thisMonth: 450,
  lastMonth: 300,
  availableBalance: 320,
  pendingEarnings: 130,
  nextPayoutDate: new Date('2024-12-20'),
  monthlyGoal: 500,
};

export function EarningsSummaryWidget({ earnings = DEFAULT_MOCK_EARNINGS, className }) {
  const {
    thisMonth,
    lastMonth,
    availableBalance,
    pendingEarnings,
    nextPayoutDate,
    monthlyGoal,
  } = earnings;

  // Calculate comparisons
  const monthOverMonthChange = thisMonth - lastMonth;
  const isPositiveGrowth = monthOverMonthChange > 0;
  const percentageChange = lastMonth > 0 ? ((monthOverMonthChange / lastMonth) * 100).toFixed(0) : 0;

  // Calculate goal progress
  const goalProgress = monthlyGoal ? Math.min((thisMonth / monthlyGoal) * 100, 100) : 0;
  const goalRemaining = monthlyGoal ? Math.max(monthlyGoal - thisMonth, 0) : 0;

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Calculate days until payout
  const daysUntilPayout = Math.ceil(
    (new Date(nextPayoutDate) - new Date()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Card className={cn('shadow-md', className)} data-testid="earnings-widget">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <DollarSign className="w-5 h-5 text-green-600" />
          Earnings Summary
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Main Earnings Display */}
        <div className="relative p-4 rounded-2xl bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border border-green-100">
          <p className="text-sm font-medium text-gray-600 mb-1">This Month</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-green-700">
              {formatCurrency(thisMonth)}
            </span>
            {monthOverMonthChange !== 0 && (
              <Badge
                variant="secondary"
                className={cn(
                  'flex items-center gap-1',
                  isPositiveGrowth
                    ? 'bg-green-100 text-green-700 hover:bg-green-100'
                    : 'bg-red-100 text-red-700 hover:bg-red-100'
                )}
              >
                {isPositiveGrowth ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span className="text-xs font-semibold">
                  {isPositiveGrowth ? '+' : ''}
                  {formatCurrency(monthOverMonthChange)} ({percentageChange}%)
                </span>
              </Badge>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            vs {formatCurrency(lastMonth)} last month
          </p>
        </div>

        {/* Monthly Goal Progress */}
        {monthlyGoal && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700">Monthly Goal</span>
              <span className="text-xs text-gray-500">
                {formatCurrency(thisMonth)} / {formatCurrency(monthlyGoal)}
              </span>
            </div>
            <Progress value={goalProgress} className="h-2" />
            <p className="text-xs text-gray-500">
              {goalProgress >= 100 ? (
                <span className="text-green-600 font-medium">
                  Goal achieved! Exceeded by {formatCurrency(thisMonth - monthlyGoal)}
                </span>
              ) : (
                <span>
                  {formatCurrency(goalRemaining)} to go ({(100 - goalProgress).toFixed(0)}% remaining)
                </span>
              )}
            </p>
          </div>
        )}

        {/* Balance Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Available Balance */}
          <div className="p-3 rounded-xl bg-white border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="text-xs font-medium text-gray-600">Available Balance</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(availableBalance)}
            </p>
            <p className="text-xs text-gray-500 mt-1">Ready for payout</p>
          </div>

          {/* Pending Earnings */}
          <div className="p-3 rounded-xl bg-white border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-medium text-gray-600">Pending</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(pendingEarnings)}
            </p>
            <p className="text-xs text-gray-500 mt-1">From active sessions</p>
          </div>
        </div>

        {/* Next Payout Info */}
        {nextPayoutDate && (
          <div className="p-3 rounded-xl bg-purple-50 border border-purple-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                <div>
                  <p className="text-xs font-medium text-gray-600">Next Payout</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatDate(nextPayoutDate)}
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-100">
                {daysUntilPayout === 0
                  ? 'Today'
                  : daysUntilPayout === 1
                  ? '1 day'
                  : `${daysUntilPayout} days`}
              </Badge>
            </div>
          </div>
        )}

        {/* View All Earnings Link */}
        <Button
          variant="outline"
          className="w-full group"
          onClick={() => {
            // TODO: Navigate to full earnings page
            console.log('Navigate to earnings page');
          }}
        >
          View All Earnings
          <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
        </Button>
      </CardContent>
    </Card>
  );
}

export default EarningsSummaryWidget;
