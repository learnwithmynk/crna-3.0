/**
 * AdminMarketplaceDashboard
 *
 * Central hub for marketplace administration with key metrics, charts,
 * and quick links to management queues.
 * Route: /admin/marketplace
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  UserCheck,
  UserX,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Clock,
  ChevronRight,
  Star,
  MessageSquare,
  ShieldCheck,
  Store,
} from 'lucide-react';
import { mockProviders, mockPendingProviders, PROVIDER_STATUS } from '@/data/marketplace/mockProviders';
import { mockBookings, BOOKING_STATUS } from '@/data/marketplace/mockBookings';
import { format, subDays, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

// Calculate marketplace stats from mock data
function useMarketplaceStats() {
  return useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    // Provider stats
    const activeProviders = mockProviders.filter(p => p.status === PROVIDER_STATUS.APPROVED).length;
    const pendingApplications = mockPendingProviders.length;
    const pausedProviders = mockProviders.filter(p => p.isPaused).length;

    // Booking stats
    const confirmedBookings = mockBookings.filter(b => b.status === BOOKING_STATUS.CONFIRMED).length;
    const pendingRequests = mockBookings.filter(b => b.status === BOOKING_STATUS.PENDING_PROVIDER).length;
    const completedBookings = mockBookings.filter(b => b.status === BOOKING_STATUS.COMPLETED).length;

    // Revenue this month (mock calculation)
    const monthlyBookings = mockBookings.filter(b =>
      b.status === BOOKING_STATUS.COMPLETED &&
      b.completedAt &&
      isWithinInterval(new Date(b.completedAt), { start: monthStart, end: monthEnd })
    );
    const monthlyRevenue = monthlyBookings.reduce((sum, b) => sum + (b.platformFee || 0), 0);
    const monthlyGMV = monthlyBookings.reduce((sum, b) => sum + (b.price || 0), 0);

    // All-time revenue
    const allTimeRevenue = mockBookings
      .filter(b => b.status === BOOKING_STATUS.COMPLETED)
      .reduce((sum, b) => sum + (b.platformFee || 0), 0);

    // Dispute count (mock - assume 2% of completed have disputes)
    const openDisputes = Math.floor(completedBookings * 0.02);

    // Average rating across all providers
    const avgRating = mockProviders.reduce((sum, p) => sum + p.rating, 0) / mockProviders.length;

    return {
      activeProviders,
      pendingApplications,
      pausedProviders,
      confirmedBookings,
      pendingRequests,
      completedBookings,
      monthlyRevenue,
      monthlyGMV,
      allTimeRevenue,
      openDisputes,
      avgRating: avgRating.toFixed(1),
    };
  }, []);
}

// Generate mock chart data for bookings over time
function useBookingsChartData() {
  return useMemo(() => {
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const date = subDays(new Date(), i);
      days.push({
        date: format(date, 'MMM d'),
        bookings: Math.floor(Math.random() * 5) + 1, // Mock: 1-5 bookings per day
        revenue: Math.floor(Math.random() * 300) + 50, // Mock: $50-350 revenue per day
      });
    }
    return days;
  }, []);
}

function StatCard({ title, value, change, icon: Icon, trend, href, badge }) {
  const content = (
    <Card className={href ? 'hover:shadow-md transition-shadow cursor-pointer' : ''}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <div className="text-2xl font-bold">{value}</div>
          {badge && (
            <Badge variant={badge.variant || 'secondary'} className="text-xs">
              {badge.text}
            </Badge>
          )}
        </div>
        {change && (
          <p className={`text-xs mt-1 ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-muted-foreground'}`}>
            {trend === 'up' && '↑ '}
            {trend === 'down' && '↓ '}
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  );

  return href ? <Link to={href}>{content}</Link> : content;
}

function QuickLinkCard({ to, icon: Icon, title, description, count, color = 'blue', urgent }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
    pink: 'bg-pink-50 text-pink-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <Link to={to}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer group h-full">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
              <Icon className="w-5 h-5" />
            </div>
            {count !== undefined && (
              <div className="flex items-center gap-2">
                {urgent && <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
                <span className="text-2xl font-bold text-gray-900">{count}</span>
              </div>
            )}
          </div>
          <div className="mt-4">
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors flex items-center gap-1">
              {title}
              <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </h3>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// Simple bar chart component (no external library needed)
function SimpleBarChart({ data, dataKey, label, color = '#3b82f6' }) {
  const max = Math.max(...data.map(d => d[dataKey]));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
        <span>{label}</span>
        <span>Last 30 days</span>
      </div>
      <div className="flex items-end gap-1 h-32">
        {data.map((d, i) => (
          <div
            key={i}
            className="flex-1 rounded-t transition-all hover:opacity-80"
            style={{
              backgroundColor: color,
              height: `${(d[dataKey] / max) * 100}%`,
              minHeight: '4px',
            }}
            title={`${d.date}: ${d[dataKey]}`}
          />
        ))}
      </div>
      <div className="flex justify-between text-xs text-muted-foreground mt-2">
        <span>{data[0]?.date}</span>
        <span>{data[data.length - 1]?.date}</span>
      </div>
    </div>
  );
}

export function AdminMarketplaceDashboard() {
  const stats = useMarketplaceStats();
  const chartData = useBookingsChartData();

  const breadcrumbs = [
    { label: 'Admin', href: '/admin' },
    { label: 'Marketplace' },
  ];

  const quickLinks = [
    {
      to: '/admin/marketplace/providers',
      icon: UserCheck,
      title: 'Provider Applications',
      description: 'Review and approve mentor applications',
      count: stats.pendingApplications,
      color: 'purple',
      urgent: stats.pendingApplications > 0,
    },
    {
      to: '/admin/marketplace/bookings',
      icon: Calendar,
      title: 'Bookings',
      description: 'Manage all platform bookings',
      count: stats.confirmedBookings + stats.pendingRequests,
      color: 'blue',
    },
    {
      to: '/admin/marketplace/disputes',
      icon: AlertTriangle,
      title: 'Disputes',
      description: 'Resolve booking disputes and refunds',
      count: stats.openDisputes,
      color: 'red',
      urgent: stats.openDisputes > 0,
    },
    {
      to: '/admin/marketplace/quality',
      icon: ShieldCheck,
      title: 'Quality & Moderation',
      description: 'Review flagged content and reviews',
      color: 'green',
    },
  ];

  return (
    <PageWrapper
      title="Marketplace Admin"
      description="Manage providers, bookings, and marketplace health"
      breadcrumbs={breadcrumbs}
    >
      {/* Hero Banner */}
      <div className="mb-8 p-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white">
        <div className="flex items-center gap-3 mb-2">
          <Store className="w-6 h-6" />
          <h2 className="text-xl font-semibold">Mentor Marketplace</h2>
        </div>
        <p className="text-purple-100">
          Monitor marketplace health, approve providers, and manage bookings.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Active Providers"
          value={stats.activeProviders}
          change={`${stats.pausedProviders} paused`}
          icon={Users}
          href="/admin/marketplace/providers"
        />
        <StatCard
          title="Pending Applications"
          value={stats.pendingApplications}
          icon={Clock}
          badge={stats.pendingApplications > 0 ? { text: 'Action needed', variant: 'destructive' } : null}
          href="/admin/marketplace/providers"
        />
        <StatCard
          title="Active Bookings"
          value={stats.confirmedBookings}
          change={`${stats.pendingRequests} awaiting provider`}
          icon={Calendar}
          href="/admin/marketplace/bookings"
        />
        <StatCard
          title="Revenue (This Month)"
          value={`$${stats.monthlyRevenue}`}
          change={`$${stats.monthlyGMV} GMV`}
          trend="up"
          icon={DollarSign}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Bookings Over Time</CardTitle>
            <CardDescription>Daily booking volume</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleBarChart data={chartData} dataKey="bookings" label="Bookings" color="#8b5cf6" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Revenue Over Time</CardTitle>
            <CardDescription>Daily platform revenue (20% commission)</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleBarChart data={chartData} dataKey="revenue" label="Revenue ($)" color="#10b981" />
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quickLinks.map((link) => (
          <QuickLinkCard key={link.to} {...link} />
        ))}
      </div>

      {/* Marketplace Health */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Marketplace Health</CardTitle>
          <CardDescription>Key performance indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-sm text-muted-foreground">Avg Provider Rating</div>
              <div className="text-2xl font-bold flex items-center gap-1">
                {stats.avgRating}
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Completed Bookings</div>
              <div className="text-2xl font-bold">{stats.completedBookings}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">All-Time Revenue</div>
              <div className="text-2xl font-bold">${stats.allTimeRevenue}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Open Disputes</div>
              <div className="text-2xl font-bold flex items-center gap-2">
                {stats.openDisputes}
                {stats.openDisputes > 0 && (
                  <Badge variant="destructive" className="text-xs">Needs attention</Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity (placeholder) */}
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Recent Activity</CardTitle>
            <CardDescription>Latest marketplace events</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin/marketplace/audit-log">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { icon: UserCheck, text: 'Rachel Liu applied as provider', time: '2 hours ago', color: 'text-purple-600' },
              { icon: Calendar, text: 'Booking #001 completed successfully', time: '5 hours ago', color: 'text-green-600' },
              { icon: DollarSign, text: '$100 payout processed for Sarah Chen', time: '1 day ago', color: 'text-blue-600' },
              { icon: MessageSquare, text: 'New review submitted for Marcus Johnson', time: '2 days ago', color: 'text-orange-600' },
            ].map((activity, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <activity.icon className={`w-4 h-4 ${activity.color}`} />
                <span className="flex-1">{activity.text}</span>
                <span className="text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageWrapper>
  );
}

export default AdminMarketplaceDashboard;
