/**
 * DemoIndexPage
 *
 * Master demo page with all major platform sections.
 * Access at: /preview/demo
 */

import { Link } from 'react-router-dom';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  User,
  Star,
  Calendar,
  Video,
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
  GraduationCap,
  MessageSquare,
  Home,
  Target,
  Activity,
  Award,
  Database,
  FolderOpen,
  Play,
  Download,
  Tag,
  Coins,
  Layout,
  Bell,
  ShoppingCart,
  Heart,
  Map,
  Clipboard,
  Lightbulb,
  Wrench,
} from 'lucide-react';

// ============================================================================
// MARKETPLACE SECTION
// ============================================================================
const MARKETPLACE_SECTIONS = [
  {
    id: 'applicant-browse',
    title: 'Applicant: Browse & Discovery',
    description: 'Where applicants find and explore mentors',
    icon: Search,
    color: 'bg-blue-500',
    routes: [
      { path: '/marketplace', label: 'Browse Mentors', description: 'Main marketplace with filters and search', icon: Search },
      { path: '/marketplace/mentor/provider_001', label: 'Mentor Profile', description: 'Individual mentor page with services', icon: User },
      { path: '/marketplace/mentor/provider_001/reviews', label: 'Mentor Reviews', description: 'All reviews for a mentor', icon: Star },
    ],
  },
  {
    id: 'applicant-booking',
    title: 'Applicant: Booking Flow',
    description: 'The booking and session experience',
    icon: Calendar,
    color: 'bg-green-500',
    routes: [
      { path: '/marketplace/book/service_001', label: 'Book a Service', description: 'Select time and complete booking', icon: Calendar },
      { path: '/marketplace/my-bookings', label: 'My Bookings', description: 'List of all applicant bookings', icon: Clock },
      { path: '/marketplace/bookings/booking_001', label: 'Booking Detail', description: 'Single booking with status', icon: FileText },
      { path: '/marketplace/bookings/booking_001/join', label: 'Session Room', description: 'Video call and session notes', icon: Video },
      { path: '/marketplace/bookings/booking_001/review', label: 'Leave Review', description: 'Post-session review form', icon: Star },
      { path: '/marketplace/messages', label: 'Marketplace Messages', description: 'Mentor messaging (placeholder)', icon: MessageSquare },
    ],
  },
  {
    id: 'become-mentor',
    title: 'Become a Mentor (SRNA)',
    description: 'How SRNAs apply to become providers',
    icon: Sparkles,
    color: 'bg-purple-500',
    routes: [
      { path: '/marketplace/become-a-mentor', label: 'Landing Page', description: 'Marketing page for potential mentors', icon: Sparkles },
      { path: '/marketplace/provider/apply', label: 'Application Form', description: 'Multi-step provider application', icon: FileText },
      { path: '/marketplace/provider/application-status', label: 'Application Status', description: 'Check application progress', icon: Clock },
      { path: '/marketplace/provider/onboarding', label: 'Onboarding Wizard', description: 'Setup profile, services, availability', icon: CheckCircle },
    ],
  },
  {
    id: 'provider-dashboard',
    title: 'Provider Dashboard',
    description: 'Tools for approved mentors',
    icon: BarChart3,
    color: 'bg-orange-500',
    routes: [
      { path: '/marketplace/provider/dashboard', label: 'Dashboard', description: 'Overview with stats', icon: BarChart3 },
      { path: '/marketplace/provider/requests', label: 'Booking Requests', description: 'Pending requests', icon: Clock },
      { path: '/marketplace/provider/bookings', label: 'Manage Bookings', description: 'All sessions', icon: Calendar },
      { path: '/marketplace/provider/services', label: 'Manage Services', description: 'Create/edit offerings', icon: Settings },
      { path: '/marketplace/provider/availability', label: 'Availability', description: 'Cal.com calendar', icon: Calendar },
      { path: '/marketplace/provider/earnings', label: 'Earnings', description: 'Revenue and payouts', icon: DollarSign },
      { path: '/marketplace/provider/profile', label: 'Edit Profile', description: 'Bio and photo', icon: User },
      { path: '/marketplace/provider/insights', label: 'Analytics', description: 'Performance metrics', icon: BarChart3 },
      { path: '/marketplace/provider/resources', label: 'Resources', description: 'Guides and tips', icon: BookOpen },
      { path: '/marketplace/provider/bookings/booking_001/review', label: 'Provider Leave Review', description: 'Review applicant after session', icon: Star },
    ],
  },
  {
    id: 'admin-marketplace',
    title: 'Admin: Marketplace',
    description: 'Platform operator tools',
    icon: Shield,
    color: 'bg-red-500',
    routes: [
      { path: '/admin/marketplace', label: 'Admin Dashboard', description: 'Marketplace health', icon: BarChart3 },
      { path: '/admin/marketplace/providers', label: 'Manage Providers', description: 'Approve/suspend', icon: Users },
      { path: '/admin/marketplace/bookings', label: 'All Bookings', description: 'Platform-wide', icon: Calendar },
      { path: '/admin/marketplace/disputes', label: 'Disputes', description: 'Handle refunds', icon: AlertTriangle },
      { path: '/admin/marketplace/quality', label: 'Quality', description: 'Moderation', icon: Shield },
    ],
  },
];

// ============================================================================
// LMS / LEARNING SECTION
// ============================================================================
const LMS_SECTIONS = [
  {
    id: 'applicant-learning',
    title: 'Applicant: Learning Experience',
    description: 'How users consume learning content',
    icon: BookOpen,
    color: 'bg-indigo-500',
    routes: [
      { path: '/learn', label: 'Learning Library', description: 'Browse all modules', icon: BookOpen },
      { path: '/learn/getting-started', label: 'Module Detail', description: 'Single module with lessons', icon: FolderOpen },
      { path: '/learn/getting-started/introduction', label: 'Lesson Page', description: 'Video + content + resources', icon: Play },
    ],
  },
  {
    id: 'admin-lms',
    title: 'Admin: Content Management',
    description: 'Create and manage learning content',
    icon: Settings,
    color: 'bg-teal-500',
    routes: [
      { path: '/admin/modules', label: 'Modules List', description: 'All modules overview', icon: FolderOpen },
      { path: '/admin/modules/new', label: 'Create Module', description: 'New module form', icon: FolderOpen },
      { path: '/admin/modules/mod_001', label: 'Edit Module', description: 'Module settings', icon: Settings },
      { path: '/admin/lessons/new', label: 'Create Lesson', description: 'New lesson editor', icon: FileText },
      { path: '/admin/lessons/lesson_001', label: 'Edit Lesson', description: 'Lesson content editor', icon: FileText },
      { path: '/admin/downloads', label: 'Downloads List', description: 'Manage downloads', icon: Download },
      { path: '/admin/downloads/new', label: 'Create Download', description: 'New download form', icon: Download },
      { path: '/admin/downloads/dl_001', label: 'Edit Download', description: 'Download settings', icon: Settings },
      { path: '/admin/categories', label: 'Categories', description: 'Organize content', icon: Tag },
      { path: '/admin/entitlements', label: 'Entitlements', description: 'Access control', icon: Shield },
    ],
  },
];

// ============================================================================
// COMMUNITY / BUDDYBOSS SECTION
// ============================================================================
const COMMUNITY_SECTIONS = [
  {
    id: 'forums',
    title: 'Forums',
    description: 'Discussion forums and topics',
    icon: MessageSquare,
    color: 'bg-cyan-500',
    routes: [
      { path: '/community/forums', label: 'Forums List', description: 'All forum categories', icon: MessageSquare },
      { path: '/community/forums/forum_001', label: 'Forum Topics', description: 'Topics in a forum', icon: FileText },
      { path: '/community/forums/forum_001/topic_001', label: 'Topic Detail', description: 'Discussion thread', icon: MessageSquare },
    ],
  },
  {
    id: 'groups',
    title: 'Groups',
    description: 'Community groups and activities',
    icon: Users,
    color: 'bg-pink-500',
    routes: [
      { path: '/community/groups', label: 'Groups List', description: 'Browse all groups', icon: Users },
      { path: '/community/groups/group_001', label: 'Group Detail', description: 'Group activity feed', icon: Activity },
    ],
  },
  {
    id: 'messaging',
    title: 'Messaging',
    description: 'Private messaging system',
    icon: MessageSquare,
    color: 'bg-violet-500',
    routes: [
      { path: '/messages', label: 'Messages', description: 'Inbox and conversations', icon: MessageSquare },
    ],
  },
];

// ============================================================================
// PLATFORM ADMIN SECTION
// ============================================================================
const ADMIN_SECTIONS = [
  {
    id: 'admin-dashboard',
    title: 'Admin Dashboard',
    description: 'Platform overview and settings',
    icon: Layout,
    color: 'bg-slate-600',
    routes: [
      { path: '/admin', label: 'Admin Home', description: 'Platform overview', icon: Layout },
      { path: '/admin/points', label: 'Points Config', description: 'Gamification settings', icon: Coins },
    ],
  },
];

// ============================================================================
// AUTH SECTION
// ============================================================================
const AUTH_SECTIONS = [
  {
    id: 'auth',
    title: 'Authentication',
    description: 'Login and registration flows',
    icon: User,
    color: 'bg-zinc-500',
    routes: [
      { path: '/login', label: 'Login', description: 'User login (placeholder)', icon: User },
      { path: '/register', label: 'Register', description: 'User registration (placeholder)', icon: User },
    ],
  },
];

// ============================================================================
// DEV/PREVIEW SECTION
// ============================================================================
const DEV_SECTIONS = [
  {
    id: 'dev',
    title: 'Development & Previews',
    description: 'Test pages and component previews',
    icon: Wrench,
    color: 'bg-yellow-500',
    routes: [
      { path: '/playground', label: 'Playground', description: 'Component playground', icon: Wrench },
      { path: '/timeline-test', label: 'Timeline Test', description: 'Timeline testing', icon: Clock },
      { path: '/lms-test', label: 'LMS Test', description: 'LMS testing', icon: BookOpen },
      { path: '/preview/mentor-recommendations', label: 'Mentor Recommendations Preview', description: 'Smart recommendations demo', icon: Users },
      { path: '/preview/marketplace-demo', label: 'Marketplace Demo', description: 'Marketplace routes list', icon: DollarSign },
      { path: '/preview/demo', label: 'Full Demo Index', description: 'This page', icon: Layout },
    ],
  },
];

// ============================================================================
// APPLICANT CORE SECTION
// ============================================================================
const APPLICANT_SECTIONS = [
  {
    id: 'applicant-dashboard',
    title: 'Dashboard & Home',
    description: 'Main user experience',
    icon: Home,
    color: 'bg-amber-500',
    routes: [
      { path: '/dashboard', label: 'Dashboard', description: 'Main dashboard with widgets', icon: Home },
      { path: '/notifications', label: 'Notifications', description: 'Activity feed', icon: Bell },
    ],
  },
  {
    id: 'programs',
    title: 'Programs & Schools',
    description: 'CRNA program discovery and tracking',
    icon: GraduationCap,
    color: 'bg-emerald-500',
    routes: [
      { path: '/schools', label: 'School Database', description: 'Browse all CRNA programs', icon: Database },
      { path: '/schools/school_001', label: 'School Profile', description: 'Individual program details', icon: GraduationCap },
      { path: '/my-programs', label: 'My Programs', description: 'Saved and target programs', icon: Heart },
      { path: '/my-programs/target_001', label: 'Target Program Detail', description: 'Application tracking', icon: Target },
      { path: '/prerequisites', label: 'Prerequisites Library', description: 'Course requirements', icon: Clipboard },
    ],
  },
  {
    id: 'trackers',
    title: 'Trackers & Stats',
    description: 'Personal progress tracking',
    icon: Activity,
    color: 'bg-rose-500',
    routes: [
      { path: '/trackers', label: 'My Trackers', description: 'All tracking tools', icon: Activity },
      { path: '/trackers/clinical', label: 'Clinical Tracker', description: 'ICU experience logging', icon: Activity },
      { path: '/trackers/eq', label: 'EQ Tracker', description: 'Emotional quotient', icon: Heart },
      { path: '/trackers/shadow', label: 'Shadow Days', description: 'Shadowing hours', icon: Clock },
      { path: '/my-stats', label: 'My Stats', description: 'Profile and readiness', icon: BarChart3 },
    ],
  },
  {
    id: 'tools-events',
    title: 'Tools, Events & Documents',
    description: 'Utilities, calendar, and files',
    icon: Wrench,
    color: 'bg-sky-500',
    routes: [
      { path: '/tools', label: 'Tools', description: 'Calculators and utilities', icon: Wrench },
      { path: '/events', label: 'Events', description: 'CRNA events calendar', icon: Calendar },
      { path: '/documents', label: 'My Documents', description: 'Uploaded files (placeholder)', icon: FileText },
    ],
  },
  {
    id: 'account',
    title: 'Account & Settings',
    description: 'User preferences and purchases',
    icon: Settings,
    color: 'bg-gray-500',
    routes: [
      { path: '/settings', label: 'Settings', description: 'Account settings (placeholder)', icon: Settings },
      { path: '/settings/notifications', label: 'Notification Settings', description: 'Notification prefs (placeholder)', icon: Bell },
      { path: '/my-purchases', label: 'My Purchases', description: 'Purchase history (placeholder)', icon: ShoppingCart },
    ],
  },
];

// ============================================================================
// COMPONENT
// ============================================================================

function SectionCard({ section }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 ${section.color} rounded-xl flex items-center justify-center`}>
            <section.icon className="w-4 h-4 text-white" />
          </div>
          <div>
            <CardTitle className="text-base">{section.title}</CardTitle>
            <CardDescription className="text-xs">{section.description}</CardDescription>
          </div>
          <Badge variant="secondary" className="ml-auto">
            {section.routes.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {section.routes.map((route) => (
            <Link
              key={route.path}
              to={route.path}
              className="group flex items-center gap-2 p-2 rounded-lg hover:bg-accent transition-colors"
            >
              <route.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium group-hover:text-primary">
                  {route.label}
                </span>
                <span className="text-xs text-muted-foreground ml-2 hidden sm:inline">
                  {route.description}
                </span>
              </div>
              <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function TabContent({ sections, totalLabel }) {
  const totalPages = sections.reduce((acc, s) => acc + s.routes.length, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {totalPages} pages in {sections.length} sections
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {sections.map((section) => (
          <SectionCard key={section.id} section={section} />
        ))}
      </div>
    </div>
  );
}

export function DemoIndexPage() {
  const allSections = [
    ...APPLICANT_SECTIONS,
    ...MARKETPLACE_SECTIONS,
    ...LMS_SECTIONS,
    ...COMMUNITY_SECTIONS,
    ...ADMIN_SECTIONS,
    ...AUTH_SECTIONS,
    ...DEV_SECTIONS,
  ];
  const totalPages = allSections.reduce((acc, s) => acc + s.routes.length, 0);

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Badge variant="outline" className="mb-2">Demo Index</Badge>
          <h1 className="text-3xl font-bold mb-2">CRNA Club Platform Demo</h1>
          <p className="text-muted-foreground">
            Complete platform walkthrough with {totalPages} pages across all major features.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 mb-6">
          <Card className="text-center">
            <CardContent className="pt-4 pb-3">
              <Home className="w-5 h-5 mx-auto mb-1 text-amber-500" />
              <div className="text-xl font-bold">{APPLICANT_SECTIONS.reduce((a, s) => a + s.routes.length, 0)}</div>
              <div className="text-xs text-muted-foreground">Applicant</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4 pb-3">
              <DollarSign className="w-5 h-5 mx-auto mb-1 text-green-500" />
              <div className="text-xl font-bold">{MARKETPLACE_SECTIONS.reduce((a, s) => a + s.routes.length, 0)}</div>
              <div className="text-xs text-muted-foreground">Marketplace</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4 pb-3">
              <BookOpen className="w-5 h-5 mx-auto mb-1 text-indigo-500" />
              <div className="text-xl font-bold">{LMS_SECTIONS.reduce((a, s) => a + s.routes.length, 0)}</div>
              <div className="text-xs text-muted-foreground">Learning</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4 pb-3">
              <Users className="w-5 h-5 mx-auto mb-1 text-pink-500" />
              <div className="text-xl font-bold">{COMMUNITY_SECTIONS.reduce((a, s) => a + s.routes.length, 0)}</div>
              <div className="text-xs text-muted-foreground">Community</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4 pb-3">
              <Shield className="w-5 h-5 mx-auto mb-1 text-slate-500" />
              <div className="text-xl font-bold">{ADMIN_SECTIONS.reduce((a, s) => a + s.routes.length, 0)}</div>
              <div className="text-xs text-muted-foreground">Admin</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4 pb-3">
              <User className="w-5 h-5 mx-auto mb-1 text-zinc-500" />
              <div className="text-xl font-bold">{AUTH_SECTIONS.reduce((a, s) => a + s.routes.length, 0)}</div>
              <div className="text-xs text-muted-foreground">Auth</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4 pb-3">
              <Wrench className="w-5 h-5 mx-auto mb-1 text-yellow-500" />
              <div className="text-xl font-bold">{DEV_SECTIONS.reduce((a, s) => a + s.routes.length, 0)}</div>
              <div className="text-xs text-muted-foreground">Dev</div>
            </CardContent>
          </Card>
        </div>

        <Separator className="mb-6" />

        {/* Tabs */}
        <Tabs defaultValue="applicant" className="w-full">
          <TabsList className="w-full justify-start mb-4 flex-wrap h-auto gap-1">
            <TabsTrigger value="applicant" className="gap-1">
              <Home className="w-3 h-3" /> Applicant Core
            </TabsTrigger>
            <TabsTrigger value="marketplace" className="gap-1">
              <DollarSign className="w-3 h-3" /> Marketplace
            </TabsTrigger>
            <TabsTrigger value="learning" className="gap-1">
              <BookOpen className="w-3 h-3" /> Learning/LMS
            </TabsTrigger>
            <TabsTrigger value="community" className="gap-1">
              <Users className="w-3 h-3" /> Community
            </TabsTrigger>
            <TabsTrigger value="admin" className="gap-1">
              <Shield className="w-3 h-3" /> Platform Admin
            </TabsTrigger>
            <TabsTrigger value="auth" className="gap-1">
              <User className="w-3 h-3" /> Auth
            </TabsTrigger>
            <TabsTrigger value="dev" className="gap-1">
              <Wrench className="w-3 h-3" /> Dev/Preview
            </TabsTrigger>
            <TabsTrigger value="all" className="gap-1">
              <Layout className="w-3 h-3" /> All Pages
            </TabsTrigger>
          </TabsList>

          <TabsContent value="applicant">
            <TabContent sections={APPLICANT_SECTIONS} />
          </TabsContent>

          <TabsContent value="marketplace">
            <TabContent sections={MARKETPLACE_SECTIONS} />
          </TabsContent>

          <TabsContent value="learning">
            <TabContent sections={LMS_SECTIONS} />
          </TabsContent>

          <TabsContent value="community">
            <TabContent sections={COMMUNITY_SECTIONS} />
          </TabsContent>

          <TabsContent value="admin">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                All admin pages across the platform
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {ADMIN_SECTIONS.map((section) => (
                  <SectionCard key={section.id} section={section} />
                ))}
                {/* Include admin sections from other areas */}
                {MARKETPLACE_SECTIONS.filter(s => s.id.includes('admin')).map((section) => (
                  <SectionCard key={section.id} section={section} />
                ))}
                {LMS_SECTIONS.filter(s => s.id.includes('admin')).map((section) => (
                  <SectionCard key={section.id} section={section} />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="auth">
            <TabContent sections={AUTH_SECTIONS} />
          </TabsContent>

          <TabsContent value="dev">
            <TabContent sections={DEV_SECTIONS} />
          </TabsContent>

          <TabsContent value="all">
            <div className="space-y-6">
              <p className="text-sm text-muted-foreground">
                All {totalPages} pages organized by feature area
              </p>

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Home className="w-4 h-4 text-amber-500" /> Applicant Core
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                  {APPLICANT_SECTIONS.map((section) => (
                    <SectionCard key={section.id} section={section} />
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-500" /> Marketplace
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                  {MARKETPLACE_SECTIONS.map((section) => (
                    <SectionCard key={section.id} section={section} />
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-500" /> Learning / LMS
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                  {LMS_SECTIONS.map((section) => (
                    <SectionCard key={section.id} section={section} />
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-pink-500" /> Community / BuddyBoss
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                  {COMMUNITY_SECTIONS.map((section) => (
                    <SectionCard key={section.id} section={section} />
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-slate-500" /> Platform Admin
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                  {ADMIN_SECTIONS.map((section) => (
                    <SectionCard key={section.id} section={section} />
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-zinc-500" /> Authentication
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                  {AUTH_SECTIONS.map((section) => (
                    <SectionCard key={section.id} section={section} />
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-yellow-500" /> Development & Previews
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {DEV_SECTIONS.map((section) => (
                    <SectionCard key={section.id} section={section} />
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <Separator className="my-8" />
        <div className="text-center text-sm text-muted-foreground pb-8">
          <p>Total: {totalPages} pages across {allSections.length} sections</p>
          <p className="mt-1">
            Pages with mock IDs (e.g., <code className="text-xs">school_001</code>) use sample data
          </p>
        </div>
      </div>
    </PageWrapper>
  );
}

export default DemoIndexPage;
