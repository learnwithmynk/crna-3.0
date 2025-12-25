/**
 * MarketplaceDemoPage
 *
 * Demo page listing all marketplace routes grouped by section.
 * Access at: /preview/marketplace-demo
 */

import { Link } from 'react-router-dom';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Search,
  User,
  Star,
  Calendar,
  CreditCard,
  Video,
  MessageSquare,
  Sparkles,
  FileText,
  Clock,
  CheckCircle,
  Settings,
  DollarSign,
  BarChart3,
  BookOpen,
  Shield,
  Users,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';

const DEMO_SECTIONS = [
  {
    id: 'applicant-browse',
    title: '1. Applicant: Browse & Discovery',
    description: 'Where applicants find and explore mentors',
    icon: Search,
    color: 'bg-blue-500',
    routes: [
      {
        path: '/marketplace',
        label: 'Browse Mentors',
        description: 'Main marketplace with filters and search',
        icon: Search,
      },
      {
        path: '/marketplace/mentor/provider_001',
        label: 'Mentor Profile',
        description: 'Individual mentor page with services',
        icon: User,
      },
      {
        path: '/marketplace/mentor/provider_001/reviews',
        label: 'Mentor Reviews',
        description: 'All reviews for a mentor',
        icon: Star,
      },
    ],
  },
  {
    id: 'applicant-booking',
    title: '2. Applicant: Booking Flow',
    description: 'The booking and session experience',
    icon: Calendar,
    color: 'bg-green-500',
    routes: [
      {
        path: '/marketplace/book/service_001',
        label: 'Book a Service',
        description: 'Select time and complete booking',
        icon: Calendar,
      },
      {
        path: '/marketplace/my-bookings',
        label: 'My Bookings',
        description: 'List of all applicant bookings',
        icon: Clock,
      },
      {
        path: '/marketplace/bookings/booking_001',
        label: 'Booking Detail',
        description: 'Single booking with status and actions',
        icon: FileText,
      },
      {
        path: '/marketplace/bookings/booking_001/join',
        label: 'Session Room',
        description: 'Video call and session notes',
        icon: Video,
      },
      {
        path: '/marketplace/bookings/booking_001/review',
        label: 'Leave Review',
        description: 'Post-session review form',
        icon: Star,
      },
    ],
  },
  {
    id: 'become-mentor',
    title: '3. Become a Mentor (SRNA Application)',
    description: 'How SRNAs apply to become providers',
    icon: Sparkles,
    color: 'bg-purple-500',
    routes: [
      {
        path: '/marketplace/become-a-mentor',
        label: 'Landing Page',
        description: 'Marketing page for potential mentors',
        icon: Sparkles,
      },
      {
        path: '/marketplace/provider/apply',
        label: 'Application Form',
        description: 'Multi-step provider application',
        icon: FileText,
      },
      {
        path: '/marketplace/provider/application-status',
        label: 'Application Status',
        description: 'Check application progress',
        icon: Clock,
      },
      {
        path: '/marketplace/provider/onboarding',
        label: 'Onboarding Wizard',
        description: 'Setup profile, services, availability',
        icon: CheckCircle,
      },
    ],
  },
  {
    id: 'provider-dashboard',
    title: '4. Provider Dashboard (After Approval)',
    description: 'Tools for approved mentors to manage their business',
    icon: BarChart3,
    color: 'bg-orange-500',
    routes: [
      {
        path: '/marketplace/provider/dashboard',
        label: 'Dashboard',
        description: 'Overview with stats and quick actions',
        icon: BarChart3,
      },
      {
        path: '/marketplace/provider/requests',
        label: 'Booking Requests',
        description: 'Pending requests to accept/decline',
        icon: Clock,
      },
      {
        path: '/marketplace/provider/bookings',
        label: 'Manage Bookings',
        description: 'All upcoming and past sessions',
        icon: Calendar,
      },
      {
        path: '/marketplace/provider/services',
        label: 'Manage Services',
        description: 'Create and edit service offerings',
        icon: Settings,
      },
      {
        path: '/marketplace/provider/availability',
        label: 'Availability',
        description: 'Cal.com calendar integration',
        icon: Calendar,
      },
      {
        path: '/marketplace/provider/earnings',
        label: 'Earnings & Payouts',
        description: 'Revenue tracking and Stripe payouts',
        icon: DollarSign,
      },
      {
        path: '/marketplace/provider/profile',
        label: 'Edit Profile',
        description: 'Update bio, photo, personality',
        icon: User,
      },
      {
        path: '/marketplace/provider/insights',
        label: 'Analytics',
        description: 'Performance metrics and trends',
        icon: BarChart3,
      },
      {
        path: '/marketplace/provider/resources',
        label: 'Mentor Resources',
        description: 'Guides and best practices',
        icon: BookOpen,
      },
    ],
  },
  {
    id: 'admin',
    title: '5. Admin: Marketplace Management',
    description: 'Administrative tools for platform operators',
    icon: Shield,
    color: 'bg-red-500',
    routes: [
      {
        path: '/admin/marketplace',
        label: 'Admin Dashboard',
        description: 'Overview of marketplace health',
        icon: BarChart3,
      },
      {
        path: '/admin/marketplace/providers',
        label: 'Manage Providers',
        description: 'Review applications, approve/suspend',
        icon: Users,
      },
      {
        path: '/admin/marketplace/bookings',
        label: 'All Bookings',
        description: 'Platform-wide booking management',
        icon: Calendar,
      },
      {
        path: '/admin/marketplace/disputes',
        label: 'Disputes',
        description: 'Handle refunds and conflicts',
        icon: AlertTriangle,
      },
      {
        path: '/admin/marketplace/quality',
        label: 'Quality & Moderation',
        description: 'Review flagged content',
        icon: Shield,
      },
    ],
  },
];

export function MarketplaceDemoPage() {
  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Badge variant="outline" className="mb-2">Demo Preview</Badge>
          <h1 className="text-3xl font-bold mb-2">Marketplace Demo</h1>
          <p className="text-muted-foreground text-lg">
            All marketplace pages organized by user flow. Click any link to navigate.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {DEMO_SECTIONS.map((section) => (
            <Card key={section.id} className="text-center">
              <CardContent className="pt-4 pb-3">
                <div className={`w-10 h-10 ${section.color} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                  <section.icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-2xl font-bold">{section.routes.length}</div>
                <div className="text-xs text-muted-foreground">pages</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator className="mb-8" />

        {/* Sections */}
        <div className="space-y-8">
          {DEMO_SECTIONS.map((section, sectionIndex) => (
            <Card key={section.id}>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${section.color} rounded-xl flex items-center justify-center`}>
                    <section.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {section.routes.map((route, routeIndex) => (
                    <Link
                      key={route.path}
                      to={route.path}
                      className="group flex items-start gap-3 p-3 rounded-xl border bg-card hover:bg-accent hover:border-primary/50 transition-all"
                    >
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0 group-hover:bg-primary/10">
                        <route.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm group-hover:text-primary">
                            {route.label}
                          </span>
                          <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {route.description}
                        </p>
                        <code className="text-[10px] text-muted-foreground/70 font-mono">
                          {route.path}
                        </code>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <Separator className="my-8" />

        <div className="text-center text-sm text-muted-foreground pb-8">
          <p>Total: {DEMO_SECTIONS.reduce((acc, s) => acc + s.routes.length, 0)} marketplace pages</p>
          <p className="mt-1">
            Note: Pages with IDs (e.g., <code className="text-xs">provider_001</code>) use mock data
          </p>
        </div>
      </div>
    </PageWrapper>
  );
}

export default MarketplaceDemoPage;
