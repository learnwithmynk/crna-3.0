/**
 * ProviderInsightsPage
 *
 * Analytics and insights dashboard for SRNA mentors/providers.
 * Route: /marketplace/provider/insights
 *
 * Shows:
 * - Summary stat cards (profile views, inquiry rate, booking conversion, average rating)
 * - Charts (profile views over time, service popularity, revenue by month)
 * - Booking funnel visualization
 * - Recent activity feed
 * - Personalized tips to improve metrics
 */

import { Link } from 'react-router-dom';
import {
  Eye,
  MessageSquare,
  Calendar,
  Star,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Lightbulb,
  ArrowRight,
  Heart,
  Bookmark,
  Clock,
  CheckCircle2,
  Camera,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// MOCK DATA - Replace with API call
const mockInsightsData = {
  // Summary stats
  profileViews: {
    thisWeek: 127,
    lastWeek: 103,
    trendPercent: 23.3,
    trending: 'up'
  },
  inquiryRate: {
    percent: 18.5,
    count: 23,
    totalViews: 124,
    trendPercent: 5.2,
    trending: 'up'
  },
  bookingConversion: {
    percent: 65.2,
    booked: 15,
    totalInquiries: 23,
    trendPercent: -3.1,
    trending: 'down'
  },
  averageRating: {
    rating: 4.9,
    totalReviews: 27,
    breakdown: {
      5: 24,
      4: 2,
      3: 1,
      2: 0,
      1: 0
    }
  },

  // Profile views over time (last 30 days)
  profileViewsOverTime: [
    { date: '2024-11-14', views: 8 },
    { date: '2024-11-15', views: 12 },
    { date: '2024-11-16', views: 6 },
    { date: '2024-11-17', views: 10 },
    { date: '2024-11-18', views: 15 },
    { date: '2024-11-19', views: 18 },
    { date: '2024-11-20', views: 14 },
    { date: '2024-11-21', views: 11 },
    { date: '2024-11-22', views: 9 },
    { date: '2024-11-23', views: 16 },
    { date: '2024-11-24', views: 19 },
    { date: '2024-11-25', views: 22 },
    { date: '2024-11-26', views: 17 },
    { date: '2024-11-27', views: 13 },
    { date: '2024-11-28', views: 20 },
    { date: '2024-11-29', views: 24 },
    { date: '2024-11-30', views: 18 },
    { date: '2024-12-01', views: 15 },
    { date: '2024-12-02', views: 21 },
    { date: '2024-12-03', views: 25 },
    { date: '2024-12-04', views: 19 },
    { date: '2024-12-05', views: 23 },
    { date: '2024-12-06', views: 27 },
    { date: '2024-12-07', views: 22 },
    { date: '2024-12-08', views: 20 },
    { date: '2024-12-09', views: 26 },
    { date: '2024-12-10', views: 28 },
    { date: '2024-12-11', views: 24 },
    { date: '2024-12-12', views: 30 },
    { date: '2024-12-13', views: 27 },
  ],

  // Service popularity
  servicePopularity: [
    { service: 'Mock Interview', bookings: 45, revenue: 5625, avgPrice: 125 },
    { service: 'Essay Review', bookings: 32, revenue: 2720, avgPrice: 85 },
    { service: 'Strategy Session', bookings: 28, revenue: 2800, avgPrice: 100 },
    { service: 'School Q&A', bookings: 18, revenue: 900, avgPrice: 50 },
  ],

  // Revenue by month (last 6 months)
  revenueByMonth: [
    { month: 'Jul 2024', gross: 1250, net: 1000 },
    { month: 'Aug 2024', gross: 1450, net: 1160 },
    { month: 'Sep 2024', gross: 1680, net: 1344 },
    { month: 'Oct 2024', gross: 1920, net: 1536 },
    { month: 'Nov 2024', gross: 2100, net: 1680 },
    { month: 'Dec 2024', gross: 450, net: 360 }, // Current month (partial)
  ],

  // Booking funnel
  bookingFunnel: {
    views: 624,
    inquiries: 115,
    bookings: 75,
    completed: 68
  },

  // Recent activity
  recentActivity: [
    {
      id: 'act_001',
      type: 'view',
      applicantName: 'Jessica Chen',
      timestamp: '2024-12-13T14:30:00Z',
      details: 'Viewed your profile'
    },
    {
      id: 'act_002',
      type: 'save',
      applicantName: 'Michael Rodriguez',
      timestamp: '2024-12-13T13:45:00Z',
      details: 'Saved you as a favorite'
    },
    {
      id: 'act_003',
      type: 'inquiry',
      applicantName: 'Amanda Foster',
      timestamp: '2024-12-13T12:20:00Z',
      details: 'Sent inquiry about Mock Interview'
    },
    {
      id: 'act_004',
      type: 'view',
      applicantName: 'David Kim',
      timestamp: '2024-12-13T11:15:00Z',
      details: 'Viewed your profile'
    },
    {
      id: 'act_005',
      type: 'booking',
      applicantName: 'Rachel Thompson',
      timestamp: '2024-12-13T10:30:00Z',
      details: 'Booked Essay Review session'
    },
    {
      id: 'act_006',
      type: 'view',
      applicantName: 'Sarah Martinez',
      timestamp: '2024-12-13T09:45:00Z',
      details: 'Viewed your profile'
    },
    {
      id: 'act_007',
      type: 'save',
      applicantName: 'James Wilson',
      timestamp: '2024-12-13T08:20:00Z',
      details: 'Saved you as a favorite'
    },
    {
      id: 'act_008',
      type: 'inquiry',
      applicantName: 'Emily Davis',
      timestamp: '2024-12-13T07:10:00Z',
      details: 'Sent inquiry about Strategy Session'
    },
  ],

  // Personalized tips
  tips: [
    {
      id: 'tip_001',
      title: 'Add profile photos',
      description: 'Profiles with 3+ photos get 40% more saves',
      impact: 'high',
      actionLink: '/marketplace/provider/profile/edit',
      actionText: 'Upload Photos',
      currentValue: 2,
      targetValue: 3,
      metric: 'photos'
    },
    {
      id: 'tip_002',
      title: 'Enable instant booking',
      description: 'Instant booking increases conversion by 25%',
      impact: 'high',
      actionLink: '/marketplace/provider/settings',
      actionText: 'Enable Now',
      currentValue: false,
      targetValue: true,
      metric: 'instant_book'
    },
    {
      id: 'tip_003',
      title: 'Improve response time',
      description: 'Your avg response time is 3.5 hours. Top mentors respond in <2 hours',
      impact: 'medium',
      actionLink: null,
      actionText: null,
      currentValue: 3.5,
      targetValue: 2,
      metric: 'response_time'
    },
    {
      id: 'tip_004',
      title: 'Add video introduction',
      description: 'Profiles with videos get 60% more inquiries',
      impact: 'high',
      actionLink: '/marketplace/provider/profile/edit',
      actionText: 'Add Video',
      currentValue: false,
      targetValue: true,
      metric: 'video'
    },
  ]
};

// Helper function to format relative time
function getRelativeTime(timestamp) {
  const now = new Date('2024-12-13T15:00:00Z'); // Mock current time
  const then = new Date(timestamp);
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) {
    return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  } else {
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
  }
}

// Summary Stat Card Component
function SummaryStatCard({ icon: Icon, label, value, trend, trendPercent, badge }) {
  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown;
  const trendColor = trend === 'up' ? 'text-green-600' : 'text-red-600';
  const trendBgColor = trend === 'up' ? 'bg-green-50' : 'bg-red-50';

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <Icon className="w-5 h-5 text-gray-400" />
          {trendPercent !== undefined && (
            <div className={cn("flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium", trendBgColor, trendColor)}>
              <TrendIcon className="w-3 h-3" />
              {Math.abs(trendPercent)}%
            </div>
          )}
        </div>
        <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
        <p className="text-sm text-gray-600">{label}</p>
        {badge && (
          <p className="text-xs text-gray-500 mt-1">{badge}</p>
        )}
      </CardContent>
    </Card>
  );
}

// Simple Bar Chart Component (visualization placeholder)
function SimpleBarChart({ data, dataKey, valueKey, maxValue }) {
  return (
    <div className="space-y-2">
      {data.map((item, index) => {
        const percentage = (item[valueKey] / maxValue) * 100;
        return (
          <div key={index} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-700">{item[dataKey]}</span>
              <span className="font-semibold text-gray-900">{item[valueKey]}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Profile Views Chart (last 30 days)
function ProfileViewsChart({ data }) {
  const maxViews = Math.max(...data.map(d => d.views));
  const totalViews = data.reduce((sum, d) => sum + d.views, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Views Over Time</CardTitle>
        <CardDescription>Last 30 days • {totalViews} total views</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between h-48 gap-1">
          {data.map((day, index) => {
            const heightPercent = (day.views / maxViews) * 100;
            return (
              <div key={index} className="flex-1 flex flex-col items-center justify-end">
                <div
                  className="w-full bg-primary rounded-t hover:bg-primary/80 transition-colors cursor-pointer"
                  style={{ height: `${heightPercent}%` }}
                  title={`${day.date}: ${day.views} views`}
                />
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>{data[0].date}</span>
          <span>{data[Math.floor(data.length / 2)].date}</span>
          <span>{data[data.length - 1].date}</span>
        </div>
      </CardContent>
    </Card>
  );
}

// Service Popularity Card
function ServicePopularityCard({ data }) {
  const totalBookings = data.reduce((sum, s) => sum + s.bookings, 0);
  const totalRevenue = data.reduce((sum, s) => sum + s.revenue, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Popularity</CardTitle>
        <CardDescription>{totalBookings} total bookings • ${totalRevenue.toLocaleString()} revenue</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((service, index) => {
            const percentage = (service.bookings / totalBookings) * 100;
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{service.service}</p>
                    <p className="text-xs text-gray-500">
                      {service.bookings} bookings • ${service.avgPrice} avg
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">${service.revenue.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{percentage.toFixed(1)}%</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// Revenue by Month Chart
function RevenueByMonthChart({ data }) {
  const maxRevenue = Math.max(...data.map(d => d.gross));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue by Month</CardTitle>
        <CardDescription>Last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((month, index) => {
            const grossPercent = (month.gross / maxRevenue) * 100;
            const netPercent = (month.net / maxRevenue) * 100;
            return (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 font-medium">{month.month}</span>
                  <div className="text-right">
                    <span className="font-semibold text-gray-900">${month.net.toLocaleString()}</span>
                    <span className="text-xs text-gray-500 ml-2">(${month.gross.toLocaleString()} gross)</span>
                  </div>
                </div>
                <div className="relative w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="absolute top-0 left-0 bg-gray-300 h-3 rounded-full"
                    style={{ width: `${grossPercent}%` }}
                  />
                  <div
                    className="absolute top-0 left-0 bg-green-500 h-3 rounded-full"
                    style={{ width: `${netPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-4 mt-4 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded" />
            <span>Net (80%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-300 rounded" />
            <span>Gross (100%)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Booking Funnel Visualization
function BookingFunnelCard({ funnel }) {
  const stages = [
    { label: 'Profile Views', value: funnel.views, icon: Eye },
    { label: 'Inquiries', value: funnel.inquiries, icon: MessageSquare },
    { label: 'Bookings', value: funnel.bookings, icon: Calendar },
    { label: 'Completed', value: funnel.completed, icon: CheckCircle2 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Funnel</CardTitle>
        <CardDescription>How visitors become customers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stages.map((stage, index) => {
            const prevValue = index > 0 ? stages[index - 1].value : null;
            const conversionRate = prevValue ? ((stage.value / prevValue) * 100).toFixed(1) : null;
            const widthPercent = (stage.value / stages[0].value) * 100;
            const Icon = stage.icon;

            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-gray-900">{stage.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {conversionRate && (
                      <span className="text-xs text-gray-500">{conversionRate}% conversion</span>
                    )}
                    <span className="font-bold text-gray-900">{stage.value}</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className={cn(
                      "h-4 rounded-full transition-all duration-300",
                      index === 0 && "bg-blue-400",
                      index === 1 && "bg-purple-400",
                      index === 2 && "bg-green-400",
                      index === 3 && "bg-yellow-400"
                    )}
                    style={{ width: `${widthPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-700 mb-2 font-medium">Key Insights:</p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• {((funnel.inquiries / funnel.views) * 100).toFixed(1)}% of viewers send inquiries</li>
            <li>• {((funnel.bookings / funnel.inquiries) * 100).toFixed(1)}% of inquiries convert to bookings</li>
            <li>• {((funnel.completed / funnel.bookings) * 100).toFixed(1)}% completion rate</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

// Recent Activity Feed
function RecentActivityFeed({ activities }) {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'view':
        return Eye;
      case 'save':
        return Bookmark;
      case 'inquiry':
        return MessageSquare;
      case 'booking':
        return Calendar;
      default:
        return Users;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'view':
        return 'bg-blue-50 text-blue-600';
      case 'save':
        return 'bg-pink-50 text-pink-600';
      case 'inquiry':
        return 'bg-purple-50 text-purple-600';
      case 'booking':
        return 'bg-green-50 text-green-600';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>What's happening with your profile</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {activities.map((activity) => {
            const Icon = getActivityIcon(activity.type);
            const colorClass = getActivityColor(activity.type);

            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className={cn("p-2 rounded-full", colorClass)}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.applicantName}</p>
                  <p className="text-xs text-gray-600">{activity.details}</p>
                </div>
                <span className="text-xs text-gray-500">{getRelativeTime(activity.timestamp)}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// Personalized Tips Card
function PersonalizedTipsCard({ tips }) {
  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          Tips to Improve Your Metrics
        </CardTitle>
        <CardDescription>Personalized recommendations based on your data</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {tips.map((tip) => (
          <div
            key={tip.id}
            className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-gray-900">{tip.title}</h4>
                  <Badge variant="outline" className={getImpactColor(tip.impact)}>
                    {tip.impact} impact
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{tip.description}</p>
              </div>
            </div>
            {tip.actionLink && (
              <Button size="sm" asChild className="mt-3">
                <Link to={tip.actionLink}>
                  {tip.actionText}
                  <ArrowRight className="w-3 h-3 ml-2" />
                </Link>
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function ProviderInsightsPage() {
  const data = mockInsightsData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Provider Insights
          </h1>
          <p className="text-gray-600">
            Track your performance and discover ways to grow your mentoring practice
          </p>
        </div>

        {/* Summary Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryStatCard
            icon={Eye}
            label="Profile Views This Week"
            value={data.profileViews.thisWeek}
            trend={data.profileViews.trending}
            trendPercent={data.profileViews.trendPercent}
            badge={`vs. ${data.profileViews.lastWeek} last week`}
          />
          <SummaryStatCard
            icon={MessageSquare}
            label="Inquiry Rate"
            value={`${data.inquiryRate.percent}%`}
            trend={data.inquiryRate.trending}
            trendPercent={data.inquiryRate.trendPercent}
            badge={`${data.inquiryRate.count} of ${data.inquiryRate.totalViews} views`}
          />
          <SummaryStatCard
            icon={Calendar}
            label="Booking Conversion"
            value={`${data.bookingConversion.percent}%`}
            trend={data.bookingConversion.trending}
            trendPercent={data.bookingConversion.trendPercent}
            badge={`${data.bookingConversion.booked} of ${data.bookingConversion.totalInquiries} inquiries`}
          />
          <SummaryStatCard
            icon={Star}
            label="Average Rating"
            value={
              <div className="flex items-center gap-2">
                <span>{data.averageRating.rating}</span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-4 h-4",
                        i < Math.floor(data.averageRating.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      )}
                    />
                  ))}
                </div>
              </div>
            }
            badge={`${data.averageRating.totalReviews} reviews`}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProfileViewsChart data={data.profileViewsOverTime} />
          <ServicePopularityCard data={data.servicePopularity} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueByMonthChart data={data.revenueByMonth} />
          <BookingFunnelCard funnel={data.bookingFunnel} />
        </div>

        {/* Recent Activity & Tips */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentActivityFeed activities={data.recentActivity} />
          <PersonalizedTipsCard tips={data.tips} />
        </div>

        {/* Bottom CTA */}
        <Card className="bg-gradient-to-r from-primary/10 to-purple-100 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  Want to boost your bookings?
                </h3>
                <p className="text-sm text-gray-600">
                  Check out our mentor resources and join the community for tips from top earners
                </p>
              </div>
              <Button asChild>
                <Link to="/community/groups/mentor-lounge">
                  Join Mentor Lounge
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ProviderInsightsPage;
