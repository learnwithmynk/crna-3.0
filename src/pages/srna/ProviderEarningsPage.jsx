/**
 * ProviderEarningsPage
 *
 * Shows providers their earnings and payout history.
 * Route: /marketplace/provider/earnings
 *
 * Features:
 * - Summary cards row (Total Earned, Available Balance, This Month, Next Payout)
 * - Earnings table with filters (date range, service type)
 * - Payout history section (past payouts to bank)
 * - Link to Stripe Dashboard
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  TrendingUp,
  Calendar,
  ExternalLink,
  Download,
  Filter,
  ChevronDown,
  Wallet,
  CreditCard,
  ArrowLeft
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

// MOCK DATA - Replace with API call
const mockSummaryStats = {
  totalEarned: 4350.00,
  availableBalance: 580.00,
  thisMonth: 890.00,
  nextPayout: {
    date: 'Dec 20, 2024',
    amount: 580.00,
  },
};

const mockEarningsTransactions = [
  {
    id: 'txn_001',
    date: '2024-12-12',
    serviceType: 'Mock Interview',
    applicantName: 'Sarah Johnson',
    grossAmount: 125.00,
    platformFee: 25.00,
    netPayout: 100.00,
    status: 'completed',
  },
  {
    id: 'txn_002',
    date: '2024-12-11',
    serviceType: 'Essay Review',
    applicantName: 'Michael Chen',
    grossAmount: 85.00,
    platformFee: 17.00,
    netPayout: 68.00,
    status: 'completed',
  },
  {
    id: 'txn_003',
    date: '2024-12-09',
    serviceType: 'Strategy Session',
    applicantName: 'Amanda Foster',
    grossAmount: 100.00,
    platformFee: 20.00,
    netPayout: 80.00,
    status: 'completed',
  },
  {
    id: 'txn_004',
    date: '2024-12-08',
    serviceType: 'Mock Interview',
    applicantName: 'David Rodriguez',
    grossAmount: 125.00,
    platformFee: 25.00,
    netPayout: 100.00,
    status: 'completed',
  },
  {
    id: 'txn_005',
    date: '2024-12-06',
    serviceType: 'School Q&A',
    applicantName: 'Rachel Thompson',
    grossAmount: 50.00,
    platformFee: 10.00,
    netPayout: 40.00,
    status: 'completed',
  },
  {
    id: 'txn_006',
    date: '2024-12-04',
    serviceType: 'Resume Review',
    applicantName: 'Jennifer Kim',
    grossAmount: 75.00,
    platformFee: 15.00,
    netPayout: 60.00,
    status: 'completed',
  },
  {
    id: 'txn_007',
    date: '2024-12-03',
    serviceType: 'Strategy Session',
    applicantName: 'Brian Martinez',
    grossAmount: 100.00,
    platformFee: 20.00,
    netPayout: 80.00,
    status: 'completed',
  },
  {
    id: 'txn_008',
    date: '2024-12-01',
    serviceType: 'Essay Review',
    applicantName: 'Lisa Anderson',
    grossAmount: 85.00,
    platformFee: 17.00,
    netPayout: 68.00,
    status: 'completed',
  },
  {
    id: 'txn_009',
    date: '2024-11-28',
    serviceType: 'Mock Interview',
    applicantName: 'Christopher Lee',
    grossAmount: 125.00,
    platformFee: 25.00,
    netPayout: 100.00,
    status: 'completed',
  },
  {
    id: 'txn_010',
    date: '2024-11-25',
    serviceType: 'School Q&A',
    applicantName: 'Emily Parker',
    grossAmount: 50.00,
    platformFee: 10.00,
    netPayout: 40.00,
    status: 'completed',
  },
];

const mockPayoutHistory = [
  {
    id: 'payout_001',
    date: '2024-12-05',
    amount: 1240.00,
    status: 'completed',
    bankAccountLast4: '4242',
    arrivalDate: '2024-12-07',
  },
  {
    id: 'payout_002',
    date: '2024-11-20',
    amount: 1680.00,
    status: 'completed',
    bankAccountLast4: '4242',
    arrivalDate: '2024-11-22',
  },
  {
    id: 'payout_003',
    date: '2024-11-05',
    amount: 850.00,
    status: 'completed',
    bankAccountLast4: '4242',
    arrivalDate: '2024-11-07',
  },
  {
    id: 'payout_004',
    date: '2024-10-20',
    amount: 580.00,
    status: 'completed',
    bankAccountLast4: '4242',
    arrivalDate: '2024-10-22',
  },
];

// Summary Stat Card Component
function SummaryStatCard({ icon: Icon, label, value, subtext, iconColor = "text-gray-400" }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <Icon className={cn("w-5 h-5", iconColor)} />
        </div>
        <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
        <p className="text-sm text-gray-600 mb-1">{label}</p>
        {subtext && (
          <p className="text-xs text-gray-500">{subtext}</p>
        )}
      </CardContent>
    </Card>
  );
}

export function ProviderEarningsPage() {
  const [dateFilter, setDateFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [showAllTransactions, setShowAllTransactions] = useState(false);

  // Filter transactions based on filters
  const filteredTransactions = mockEarningsTransactions.filter((txn) => {
    // Date filter
    if (dateFilter === 'this-month') {
      const txnDate = new Date(txn.date);
      const now = new Date();
      if (txnDate.getMonth() !== now.getMonth() || txnDate.getFullYear() !== now.getFullYear()) {
        return false;
      }
    } else if (dateFilter === 'last-month') {
      const txnDate = new Date(txn.date);
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      if (txnDate.getMonth() !== lastMonth.getMonth() || txnDate.getFullYear() !== lastMonth.getFullYear()) {
        return false;
      }
    }

    // Service filter
    if (serviceFilter !== 'all' && txn.serviceType !== serviceFilter) {
      return false;
    }

    return true;
  });

  // Show first 5 or all transactions
  const displayedTransactions = showAllTransactions
    ? filteredTransactions
    : filteredTransactions.slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-2">
          <Link to="/marketplace/provider/dashboard">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>

        {/* Page Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Earnings & Payouts
            </h1>
            <p className="text-gray-600">
              Track your mentoring income and payout history
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a
                href="https://dashboard.stripe.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Stripe Dashboard
              </a>
            </Button>
          </div>
        </div>

        {/* Summary Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryStatCard
            icon={TrendingUp}
            label="Total Earned"
            value={`$${mockSummaryStats.totalEarned.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            subtext="All-time earnings"
            iconColor="text-green-600"
          />
          <SummaryStatCard
            icon={Wallet}
            label="Available Balance"
            value={`$${mockSummaryStats.availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            subtext="Ready to payout"
            iconColor="text-blue-600"
          />
          <SummaryStatCard
            icon={DollarSign}
            label="This Month"
            value={`$${mockSummaryStats.thisMonth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            subtext="Net earnings (Dec)"
            iconColor="text-purple-600"
          />
          <SummaryStatCard
            icon={Calendar}
            label="Next Payout"
            value={`$${mockSummaryStats.nextPayout.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            subtext={mockSummaryStats.nextPayout.date}
            iconColor="text-yellow-600"
          />
        </div>

        {/* Earnings Transactions Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle>Earnings Transactions</CardTitle>
                <CardDescription>
                  Detailed breakdown of your earnings
                </CardDescription>
              </div>
              <div className="flex gap-3">
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-[160px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="All Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="this-month">This Month</SelectItem>
                    <SelectItem value="last-month">Last Month</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={serviceFilter} onValueChange={setServiceFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="All Services" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Services</SelectItem>
                    <SelectItem value="Mock Interview">Mock Interview</SelectItem>
                    <SelectItem value="Essay Review">Essay Review</SelectItem>
                    <SelectItem value="Resume Review">Resume Review</SelectItem>
                    <SelectItem value="Strategy Session">Strategy Session</SelectItem>
                    <SelectItem value="School Q&A">School Q&A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200">
                  <tr className="text-left text-sm text-gray-600">
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Service</th>
                    <th className="pb-3 font-medium">Applicant</th>
                    <th className="pb-3 font-medium text-right">Gross</th>
                    <th className="pb-3 font-medium text-right">Fee (20%)</th>
                    <th className="pb-3 font-medium text-right">Net Payout</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {displayedTransactions.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-gray-500">
                        No transactions found for the selected filters
                      </td>
                    </tr>
                  ) : (
                    displayedTransactions.map((txn) => (
                      <tr key={txn.id} className="text-sm hover:bg-gray-50">
                        <td className="py-4 text-gray-900">
                          {new Date(txn.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="py-4 text-gray-900">{txn.serviceType}</td>
                        <td className="py-4 text-gray-600">{txn.applicantName}</td>
                        <td className="py-4 text-right text-gray-900">
                          ${txn.grossAmount.toFixed(2)}
                        </td>
                        <td className="py-4 text-right text-gray-600">
                          -${txn.platformFee.toFixed(2)}
                        </td>
                        <td className="py-4 text-right font-semibold text-gray-900">
                          ${txn.netPayout.toFixed(2)}
                        </td>
                        <td className="py-4">
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200"
                          >
                            {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {displayedTransactions.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                  No transactions found for the selected filters
                </div>
              ) : (
                displayedTransactions.map((txn) => (
                  <div
                    key={txn.id}
                    className="border border-gray-200 rounded-xl p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{txn.serviceType}</p>
                        <p className="text-sm text-gray-600">{txn.applicantName}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200"
                      >
                        {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(txn.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t border-gray-100">
                      <span className="text-gray-600">Gross:</span>
                      <span className="text-gray-900">${txn.grossAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Platform Fee (20%):</span>
                      <span className="text-gray-600">-${txn.platformFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold pt-2 border-t border-gray-100">
                      <span className="text-gray-900">Net Payout:</span>
                      <span className="text-gray-900">${txn.netPayout.toFixed(2)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Load More / Show Less Button */}
            {filteredTransactions.length > 5 && (
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  onClick={() => setShowAllTransactions(!showAllTransactions)}
                >
                  {showAllTransactions ? 'Show Less' : `Load More (${filteredTransactions.length - 5} more)`}
                  <ChevronDown className={cn(
                    "w-4 h-4 ml-2 transition-transform",
                    showAllTransactions && "rotate-180"
                  )} />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payout History Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  Payout History
                </CardTitle>
                <CardDescription>
                  Past transfers to your bank account
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200">
                  <tr className="text-left text-sm text-gray-600">
                    <th className="pb-3 font-medium">Payout Date</th>
                    <th className="pb-3 font-medium">Arrival Date</th>
                    <th className="pb-3 font-medium text-right">Amount</th>
                    <th className="pb-3 font-medium">Bank Account</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mockPayoutHistory.map((payout) => (
                    <tr key={payout.id} className="text-sm hover:bg-gray-50">
                      <td className="py-4 text-gray-900">
                        {new Date(payout.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="py-4 text-gray-600">
                        {new Date(payout.arrivalDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="py-4 text-right font-semibold text-gray-900">
                        ${payout.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 text-gray-600">
                        ****{payout.bankAccountLast4}
                      </td>
                      <td className="py-4">
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200"
                        >
                          {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {mockPayoutHistory.map((payout) => (
                <div
                  key={payout.id}
                  className="border border-gray-200 rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">
                        ${payout.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      <p className="text-sm text-gray-600">
                        Bank ****{payout.bankAccountLast4}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-gray-100">
                    <span className="text-gray-600">Payout Date:</span>
                    <span className="text-gray-900">
                      {new Date(payout.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Arrival Date:</span>
                    <span className="text-gray-900">
                      {new Date(payout.arrivalDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Help Text */}
            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-sm text-blue-900">
                <strong>Payout Schedule:</strong> Earnings are automatically transferred to your bank account every two weeks.
                Funds typically arrive 2 business days after the payout is initiated.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ProviderEarningsPage;
