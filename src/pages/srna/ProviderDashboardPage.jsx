/**
 * ProviderDashboardPage
 *
 * Main command center for SRNA mentors/providers.
 * Route: /marketplace/provider/dashboard
 *
 * Shows:
 * - Onboarding progress (if incomplete)
 * - Stats row (requests, sessions, earnings, rating)
 * - Incoming requests widget
 * - Upcoming sessions widget
 * - Earnings summary
 * - Growth CTA checklist
 * - Quick actions
 */

import { Link } from 'react-router-dom';
import {
  Calendar,
  DollarSign,
  Star,
  MessageSquare,
  Edit,
  Settings,
  TrendingUp,
  Clock,
  CheckCircle2,
  ArrowRight,
  Users,
  Bell
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// TODO: Import from actual provider components when they exist
// import { OnboardingProgressWidget } from '@/components/features/provider/OnboardingProgressWidget';
// import { IncomingRequestsWidget } from '@/components/features/provider/IncomingRequestsWidget';
// import { UpcomingSessionsWidget } from '@/components/features/provider/UpcomingSessionsWidget';
// import { EarningsSummaryWidget } from '@/components/features/provider/EarningsSummaryWidget';
// import { GrowYourPracticeCTA } from '@/components/features/provider/GrowYourPracticeCTA';
import { ProviderInbox } from '@/components/features/provider/ProviderInbox';

// MOCK DATA - Replace with API call
const mockProviderProfile = {
  id: 'provider_001',
  userId: 'user_001',
  name: 'Sarah Martinez',
  program: 'Georgetown University',
  yearInProgram: 2,
  onboardingComplete: false, // Set to true to hide onboarding widget
  onboardingProgress: {
    identityVerified: true,
    profileComplete: true,
    servicesAdded: true,
    stripeConnected: false, // Still needs to complete
    availabilitySet: true,
  },
  stats: {
    incomingRequests: 3,
    upcomingSessions: 2,
    thisMonthEarnings: 450.00,
    overallRating: 4.9,
    totalReviews: 27,
    responseTime: 'Usually within 2 hours',
  }
};

const mockIncomingRequests = [
  {
    id: 'request_001',
    applicantName: 'Jessica Chen',
    applicantAvatar: null,
    serviceType: 'Mock Interview',
    price: 125,
    requestedDate: '2024-12-16',
    requestedTime: '2:00 PM EST',
    submittedAt: '2024-12-13T10:30:00Z',
    expiresIn: '22 hours',
    status: 'pending',
    notes: 'Interviewing at Georgetown next month. Would love to practice with someone from the program!'
  },
  {
    id: 'request_002',
    applicantName: 'Michael Rodriguez',
    applicantAvatar: null,
    serviceType: 'Essay Review',
    price: 85,
    submittedAt: '2024-12-13T14:20:00Z',
    expiresIn: '18 hours',
    status: 'pending',
    turnaround: '48 hours',
    notes: 'Personal statement for Georgetown application. Looking for feedback on structure and content.'
  },
  {
    id: 'request_003',
    applicantName: 'Amanda Foster',
    applicantAvatar: null,
    serviceType: 'Strategy Session',
    price: 100,
    requestedDate: '2024-12-18',
    requestedTime: 'Flexible',
    submittedAt: '2024-12-14T09:15:00Z',
    expiresIn: '12 hours',
    status: 'pending',
    notes: 'Need help deciding between schools and understanding financial aid options.'
  },
];

const mockUpcomingSessions = [
  {
    id: 'session_001',
    applicantName: 'David Kim',
    applicantAvatar: null,
    serviceType: 'Mock Interview',
    scheduledDate: '2024-12-14',
    scheduledTime: '3:00 PM EST',
    duration: 60,
    price: 125,
    status: 'confirmed',
    zoomLink: 'https://zoom.us/j/123456789',
    prepNotes: 'Applicant has strong academic background, wants to work on behavioral questions.'
  },
  {
    id: 'session_002',
    applicantName: 'Rachel Thompson',
    applicantAvatar: null,
    serviceType: 'School Q&A',
    scheduledDate: '2024-12-15',
    scheduledTime: '7:00 PM EST',
    duration: 30,
    price: 50,
    status: 'confirmed',
    zoomLink: 'https://zoom.us/j/987654321',
    prepNotes: 'Interested in Georgetown clinical rotations and student life.'
  },
];

const mockEarningsSummary = {
  thisMonth: {
    gross: 450.00,
    platformFee: 90.00, // 20%
    net: 360.00,
    bookingsCount: 6,
  },
  availableBalance: 180.00,
  nextPayoutDate: '2024-12-20',
  nextPayoutAmount: 180.00,
  totalLifetimeEarnings: 2340.00,
};

const mockGrowthChecklist = [
  {
    id: 'complete_profile',
    title: 'Complete your full profile',
    description: 'Add video intro and extended bio',
    completed: false,
    link: '/marketplace/provider/profile/edit',
  },
  {
    id: 'add_services',
    title: 'Offer 3+ services',
    description: 'Providers with multiple services get 40% more bookings',
    completed: true,
    link: '/marketplace/provider/services',
  },
  {
    id: 'respond_fast',
    title: 'Maintain <4hr response time',
    description: 'Quick responses rank you higher in search',
    completed: true,
    link: null,
  },
  {
    id: 'engage_community',
    title: 'Join the Mentor Community',
    description: 'Share tips, get advice, and network with other mentors',
    completed: false,
    link: '/community/groups/mentor-lounge',
  },
];

// Temporary Onboarding Widget Component (replace with actual component import)
function OnboardingProgressWidget({ profile }) {
  const steps = [
    { key: 'identityVerified', label: 'Identity Verified', completed: profile.onboardingProgress.identityVerified },
    { key: 'profileComplete', label: 'Profile Complete', completed: profile.onboardingProgress.profileComplete },
    { key: 'servicesAdded', label: 'Services Added', completed: profile.onboardingProgress.servicesAdded },
    { key: 'stripeConnected', label: 'Stripe Connected', completed: profile.onboardingProgress.stripeConnected },
    { key: 'availabilitySet', label: 'Availability Set', completed: profile.onboardingProgress.availabilitySet },
  ];

  const completedCount = steps.filter(s => s.completed).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  return (
    <Card className="border-2 border-primary bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Complete Your Setup</span>
          <Badge variant="outline" className="bg-white">
            {completedCount}/{steps.length}
          </Badge>
        </CardTitle>
        <CardDescription>
          Finish these steps to start accepting bookings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Steps */}
        <div className="space-y-2">
          {steps.map((step) => (
            <div key={step.key} className="flex items-center gap-2 text-sm">
              {step.completed ? (
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
              )}
              <span className={cn(
                step.completed ? 'text-gray-500 line-through' : 'text-gray-900 font-medium'
              )}>
                {step.label}
              </span>
            </div>
          ))}
        </div>

        <Button asChild className="w-full">
          <Link to="/marketplace/provider/onboarding">
            Continue Setup
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

// Temporary Incoming Requests Widget (replace with actual component import)
function IncomingRequestsWidget({ requests }) {
  if (requests.length === 0) {
    return (
      <Card data-testid="incoming-requests-widget">
        <CardHeader>
          <CardTitle>Incoming Requests</CardTitle>
          <CardDescription>New booking requests from applicants</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No pending requests</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="incoming-requests-widget">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Incoming Requests</span>
          <Badge variant="default">{requests.length}</Badge>
        </CardTitle>
        <CardDescription>Respond within 24 hours to maintain your rating</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {requests.slice(0, 3).map((request) => (
          <div
            key={request.id}
            className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-semibold text-gray-900">{request.applicantName}</p>
                <p className="text-sm text-gray-600">{request.serviceType}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">${request.price}</p>
                <p className="text-xs text-gray-500">
                  <Clock className="w-3 h-3 inline mr-1" />
                  {request.expiresIn}
                </p>
              </div>
            </div>

            {request.requestedDate && (
              <p className="text-sm text-gray-600 mb-2">
                <Calendar className="w-3 h-3 inline mr-1" />
                {request.requestedDate} at {request.requestedTime}
              </p>
            )}

            {request.notes && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2 italic">
                "{request.notes}"
              </p>
            )}

            <div className="flex gap-2">
              <Button size="sm" className="flex-1">
                Accept
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                Decline
              </Button>
            </div>
          </div>
        ))}

        {requests.length > 3 && (
          <Button asChild variant="outline" className="w-full">
            <Link to="/marketplace/provider/bookings">
              View All {requests.length} Requests
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// Temporary Upcoming Sessions Widget (replace with actual component import)
function UpcomingSessionsWidget({ sessions }) {
  if (sessions.length === 0) {
    return (
      <Card data-testid="upcoming-sessions-widget">
        <CardHeader>
          <CardTitle>Upcoming Sessions</CardTitle>
          <CardDescription>Next 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No upcoming sessions</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="upcoming-sessions-widget">
      <CardHeader>
        <CardTitle>Upcoming Sessions</CardTitle>
        <CardDescription>Next 7 days</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {sessions.slice(0, 3).map((session) => (
          <div
            key={session.id}
            className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-semibold text-gray-900">{session.applicantName}</p>
                <p className="text-sm text-gray-600">{session.serviceType}</p>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Confirmed
              </Badge>
            </div>

            <p className="text-sm text-gray-900 mb-2">
              <Calendar className="w-3 h-3 inline mr-1" />
              {session.scheduledDate} at {session.scheduledTime}
            </p>

            <p className="text-sm text-gray-600 mb-3">
              <Clock className="w-3 h-3 inline mr-1" />
              {session.duration} minutes • ${session.price}
            </p>

            {session.prepNotes && (
              <p className="text-xs text-gray-500 mb-3 italic">
                {session.prepNotes}
              </p>
            )}

            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1" asChild>
                <a href={session.zoomLink} target="_blank" rel="noopener noreferrer">
                  Join Zoom
                </a>
              </Button>
              <Button size="sm" variant="ghost" className="flex-1" asChild>
                <Link to={`/marketplace/provider/bookings/${session.id}`}>
                  View Details
                </Link>
              </Button>
            </div>
          </div>
        ))}

        {sessions.length > 3 && (
          <Button asChild variant="outline" className="w-full">
            <Link to="/marketplace/provider/calendar">
              View Full Calendar
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// Temporary Earnings Summary Widget (replace with actual component import)
function EarningsSummaryWidget({ earnings }) {
  return (
    <Card data-testid="earnings-widget">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-600" />
          Earnings Summary
        </CardTitle>
        <CardDescription>Your earnings at a glance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* This Month */}
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-600 mb-1">This Month</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">
            ${earnings.thisMonth.net.toFixed(2)}
          </p>
          <div className="text-xs text-gray-500 space-y-1">
            <p>Gross: ${earnings.thisMonth.gross.toFixed(2)}</p>
            <p>Platform Fee (20%): -${earnings.thisMonth.platformFee.toFixed(2)}</p>
            <p className="font-medium text-gray-700">{earnings.thisMonth.bookingsCount} bookings completed</p>
          </div>
        </div>

        {/* Available Balance */}
        <div className="flex items-center justify-between py-2 border-t border-gray-200">
          <span className="text-sm text-gray-600">Available Balance</span>
          <span className="font-bold text-gray-900">${earnings.availableBalance.toFixed(2)}</span>
        </div>

        {/* Next Payout */}
        <div className="flex items-center justify-between py-2 border-t border-gray-200">
          <div>
            <p className="text-sm text-gray-600">Next Payout</p>
            <p className="text-xs text-gray-500">{earnings.nextPayoutDate}</p>
          </div>
          <span className="font-bold text-green-600">${earnings.nextPayoutAmount.toFixed(2)}</span>
        </div>

        {/* Lifetime Earnings */}
        <div className="flex items-center justify-between py-2 border-t border-gray-200">
          <span className="text-sm text-gray-600">Lifetime Earnings</span>
          <span className="font-bold text-gray-900">${earnings.totalLifetimeEarnings.toFixed(2)}</span>
        </div>

        <Button asChild variant="outline" className="w-full">
          <Link to="/marketplace/provider/earnings">
            View Full Report
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

// Temporary Grow Your Practice CTA (replace with actual component import)
function GrowYourPracticeCTA({ checklist }) {
  const completedCount = checklist.filter(item => item.completed).length;
  const progressPercent = Math.round((completedCount / checklist.length) * 100);

  return (
    <Card data-testid="grow-your-practice">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Grow Your Practice
        </CardTitle>
        <CardDescription>
          {completedCount}/{checklist.length} completed
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Checklist */}
        <div className="space-y-3">
          {checklist.map((item) => (
            <div
              key={item.id}
              className={cn(
                "flex items-start gap-3 p-3 rounded-xl transition-colors",
                item.completed ? "bg-gray-50" : "bg-white border border-gray-200"
              )}
            >
              <div className="pt-0.5">
                {item.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                )}
              </div>
              <div className="flex-1">
                <p className={cn(
                  "text-sm font-medium mb-1",
                  item.completed ? "text-gray-500 line-through" : "text-gray-900"
                )}>
                  {item.title}
                </p>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
              {!item.completed && item.link && (
                <Button size="sm" variant="ghost" asChild>
                  <Link to={item.link}>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Stats Card Component
function StatCard({ icon: Icon, label, value, badge, badgeVariant = "default" }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <Icon className="w-5 h-5 text-gray-400" />
          {badge !== undefined && (
            <Badge variant={badgeVariant}>{badge}</Badge>
          )}
        </div>
        <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
        <p className="text-sm text-gray-600">{label}</p>
      </CardContent>
    </Card>
  );
}

export function ProviderDashboardPage() {
  const profile = mockProviderProfile;
  const showOnboarding = !profile.onboardingComplete;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Provider Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, {profile.name}! Here's what's happening with your mentoring practice.
          </p>
        </div>

        {/* Onboarding Widget (if incomplete) */}
        {showOnboarding && (
          <OnboardingProgressWidget profile={profile} />
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Bell}
            label="Incoming Requests"
            value={profile.stats.incomingRequests}
            badge={profile.stats.incomingRequests > 0 ? profile.stats.incomingRequests : undefined}
            badgeVariant="default"
          />
          <StatCard
            icon={Calendar}
            label="Upcoming Sessions"
            value={profile.stats.upcomingSessions}
          />
          <StatCard
            icon={DollarSign}
            label="This Month Earnings"
            value={`$${profile.stats.thisMonthEarnings.toFixed(0)}`}
          />
          <StatCard
            icon={Star}
            label="Overall Rating"
            value={
              <div className="flex items-center gap-2">
                <span>{profile.stats.overallRating}</span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-4 h-4",
                        i < Math.floor(profile.stats.overallRating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      )}
                    />
                  ))}
                </div>
              </div>
            }
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <IncomingRequestsWidget requests={mockIncomingRequests} />
            <UpcomingSessionsWidget sessions={mockUpcomingSessions} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <EarningsSummaryWidget earnings={mockEarningsSummary} />
            <ProviderInbox providerId={profile.id} />
            <GrowYourPracticeCTA checklist={mockGrowthChecklist} />
          </div>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your mentor profile and settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <Button asChild variant="outline" className="justify-start">
                <Link to="/marketplace/provider/profile/edit">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <Link to="/marketplace/provider/services">
                  <Settings className="w-4 h-4 mr-2" />
                  Update Services
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <Link to="/marketplace/provider/calendar">
                  <Calendar className="w-4 h-4 mr-2" />
                  View Calendar
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <Link to="/marketplace/provider/availability">
                  <Clock className="w-4 h-4 mr-2" />
                  Manage Availability
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ProviderDashboardPage;
