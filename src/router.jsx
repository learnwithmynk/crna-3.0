/**
 * Router configuration for The CRNA Club
 * All routes are defined here using React Router v6
 *
 * Code-splitting: Heavy pages are lazy-loaded to reduce initial bundle size.
 * The AppLayout and PlaceholderPage are eagerly loaded since they're used everywhere.
 */

import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/app-layout';
import { PlaceholderPage } from '@/pages/shared/PlaceholderPage';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AdminRoute } from '@/components/access/AdminRoute';
import { ProviderRoute } from '@/components/access/ProviderRoute';

// Auth pages (eagerly loaded for fast initial render)
import { LoginPage } from '@/pages/shared/LoginPage';
import { RegisterPage } from '@/pages/shared/RegisterPage';

// Loading fallback for lazy-loaded routes
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  );
}

// Lazy-loaded page components
const DashboardPage = lazy(() => import('@/pages/applicant/DashboardPage').then(m => ({ default: m.DashboardPage })));
const MyProgramsPage = lazy(() => import('@/pages/applicant/MyProgramsPage').then(m => ({ default: m.MyProgramsPage })));
const TargetProgramDetailPage = lazy(() => import('@/pages/applicant/TargetProgramDetailPage').then(m => ({ default: m.TargetProgramDetailPage })));
const ToolsPage = lazy(() => import('@/pages/applicant/ToolsPage').then(m => ({ default: m.ToolsPage })));
const MyTrackersPage = lazy(() => import('@/pages/applicant/MyTrackersPage').then(m => ({ default: m.MyTrackersPage })));
const MyStatsPage = lazy(() => import('@/pages/applicant/MyStatsPage').then(m => ({ default: m.MyStatsPage })));
const SchoolDatabasePage = lazy(() => import('@/pages/applicant/SchoolDatabasePage').then(m => ({ default: m.SchoolDatabasePage })));
const SchoolProfilePage = lazy(() => import('@/pages/applicant/SchoolProfilePage').then(m => ({ default: m.SchoolProfilePage })));
const PrerequisiteLibraryPage = lazy(() => import('@/pages/applicant/PrerequisiteLibraryPage').then(m => ({ default: m.PrerequisiteLibraryPage })));
const EventsPage = lazy(() => import('@/pages/applicant/EventsPage').then(m => ({ default: m.EventsPage })));
const LearningLibraryPage = lazy(() => import('@/pages/applicant/LearningLibraryPage').then(m => ({ default: m.LearningLibraryPage })));
const ModuleDetailPage = lazy(() => import('@/pages/applicant/ModuleDetailPage').then(m => ({ default: m.ModuleDetailPage })));
const LessonPage = lazy(() => import('@/pages/applicant/LessonPage').then(m => ({ default: m.LessonPage })));
const SettingsPage = lazy(() => import('@/pages/applicant/SettingsPage').then(m => ({ default: m.SettingsPage })));
const PlaygroundPage = lazy(() => import('@/pages/PlaygroundPage'));
const TimelineTestPage = lazy(() => import('@/pages/TimelineTestPage'));
const LmsTestPage = lazy(() => import('@/pages/LmsTestPage'));
const ComponentShowcasePage = lazy(() => import('@/pages/ComponentShowcasePage'));
const MentorRecommendationsPreview = lazy(() => import('@/pages/previews/MentorRecommendationsPreview').then(m => ({ default: m.MentorRecommendationsPreview })));
const MarketplaceDemoPage = lazy(() => import('@/pages/previews/MarketplaceDemoPage').then(m => ({ default: m.MarketplaceDemoPage })));
const DemoIndexPage = lazy(() => import('@/pages/previews/DemoIndexPage').then(m => ({ default: m.DemoIndexPage })));
const RouteAuditPage = lazy(() => import('@/pages/previews/RouteAuditPage').then(m => ({ default: m.RouteAuditPage })));
const TrackerCardsDemo = lazy(() => import('@/pages/demo/TrackerCardsDemo').then(m => ({ default: m.TrackerCardsDemo })));
const SuggestedTasksDemo = lazy(() => import('@/pages/demo/SuggestedTasksDemo'));
const AppleStyleDemo = lazy(() => import('@/pages/demo/AppleStyleDemo'));
const SidebarShowcasePage = lazy(() => import('@/pages/demo/SidebarShowcasePage'));
const AccentColorDemo = lazy(() => import('@/pages/demo/AccentColorDemo'));
const TrackerColorShowcasePage = lazy(() => import('@/pages/demo/TrackerColorShowcasePage'));

// Marketplace pages
const MarketplacePage = lazy(() => import('@/pages/applicant/MarketplacePage').then(m => ({ default: m.MarketplacePage })));
const MentorProfilePage = lazy(() => import('@/pages/applicant/MentorProfilePage').then(m => ({ default: m.MentorProfilePage })));
const BookingPage = lazy(() => import('@/pages/applicant/BookingPage').then(m => ({ default: m.BookingPage })));
const MyBookingsPage = lazy(() => import('@/pages/applicant/MyBookingsPage').then(m => ({ default: m.MyBookingsPage })));
const MentorReviewsPage = lazy(() => import('@/pages/applicant/MentorReviewsPage').then(m => ({ default: m.MentorReviewsPage })));
const BookingDetailPage = lazy(() => import('@/pages/applicant/BookingDetailPage').then(m => ({ default: m.BookingDetailPage })));
const SessionRoomPage = lazy(() => import('@/pages/applicant/SessionRoomPage').then(m => ({ default: m.SessionRoomPage })));
const LeaveReviewPage = lazy(() => import('@/pages/applicant/LeaveReviewPage').then(m => ({ default: m.LeaveReviewPage })));

// SRNA/Provider pages
const BecomeMentorLandingPage = lazy(() => import('@/pages/srna/BecomeMentorLandingPage').then(m => ({ default: m.BecomeMentorLandingPage })));
const ProviderApplicationPage = lazy(() => import('@/pages/srna/ProviderApplicationPage').then(m => ({ default: m.ProviderApplicationPage })));
const ApplicationStatusPage = lazy(() => import('@/pages/srna/ApplicationStatusPage').then(m => ({ default: m.ApplicationStatusPage })));
const ProviderOnboardingPage = lazy(() => import('@/pages/srna/ProviderOnboardingPage').then(m => ({ default: m.ProviderOnboardingPage })));
const ProviderDashboardPage = lazy(() => import('@/pages/srna/ProviderDashboardPage').then(m => ({ default: m.ProviderDashboardPage })));
const ProviderRequestsPage = lazy(() => import('@/pages/srna/ProviderRequestsPage').then(m => ({ default: m.ProviderRequestsPage })));
const ProviderBookingsPage = lazy(() => import('@/pages/srna/ProviderBookingsPage').then(m => ({ default: m.ProviderBookingsPage })));
const ProviderLeaveReviewPage = lazy(() => import('@/pages/srna/ProviderLeaveReviewPage').then(m => ({ default: m.ProviderLeaveReviewPage })));
const ProviderServicesPage = lazy(() => import('@/pages/srna/ProviderServicesPage').then(m => ({ default: m.ProviderServicesPage })));
const ProviderEarningsPage = lazy(() => import('@/pages/srna/ProviderEarningsPage').then(m => ({ default: m.ProviderEarningsPage })));
const ProviderAvailabilityPage = lazy(() => import('@/pages/srna/ProviderAvailabilityPage').then(m => ({ default: m.ProviderAvailabilityPage })));
const ProviderInsightsPage = lazy(() => import('@/pages/srna/ProviderInsightsPage').then(m => ({ default: m.ProviderInsightsPage })));
const MentorResourcesPage = lazy(() => import('@/pages/srna/MentorResourcesPage').then(m => ({ default: m.MentorResourcesPage })));
const ProviderProfilePage = lazy(() => import('@/pages/srna/ProviderProfilePage').then(m => ({ default: m.ProviderProfilePage })));

// Shared pages
const NotificationsPage = lazy(() => import('@/pages/shared/NotificationsPage').then(m => ({ default: m.NotificationsPage })));
const TermsPage = lazy(() => import('@/pages/shared/TermsPage').then(m => ({ default: m.TermsPage })));
const PrivacyPolicyPage = lazy(() => import('@/pages/shared/PrivacyPolicyPage').then(m => ({ default: m.PrivacyPolicyPage })));
const CookiePolicyPage = lazy(() => import('@/pages/shared/CookiePolicyPage').then(m => ({ default: m.CookiePolicyPage })));
const AcceptableUsePolicyPage = lazy(() => import('@/pages/shared/AcceptableUsePolicyPage').then(m => ({ default: m.AcceptableUsePolicyPage })));
const DMCAPolicyPage = lazy(() => import('@/pages/shared/DMCAPolicyPage').then(m => ({ default: m.DMCAPolicyPage })));
const AccessibilityPage = lazy(() => import('@/pages/shared/AccessibilityPage').then(m => ({ default: m.AccessibilityPage })));
const CaliforniaPrivacyPage = lazy(() => import('@/pages/shared/CaliforniaPrivacyPage').then(m => ({ default: m.CaliforniaPrivacyPage })));

// Admin pages
const ModulesListPage = lazy(() => import('@/pages/admin/ModulesListPage').then(m => ({ default: m.ModulesListPage })));
const AdminModuleDetailPage = lazy(() => import('@/pages/admin/ModuleDetailPage').then(m => ({ default: m.ModuleDetailPage })));
const LessonEditPage = lazy(() => import('@/pages/admin/LessonEditPage').then(m => ({ default: m.LessonEditPage })));
const DownloadsListPage = lazy(() => import('@/pages/admin/DownloadsListPage').then(m => ({ default: m.DownloadsListPage })));
const DownloadEditPage = lazy(() => import('@/pages/admin/DownloadEditPage').then(m => ({ default: m.DownloadEditPage })));
const CategoriesPage = lazy(() => import('@/pages/admin/CategoriesPage').then(m => ({ default: m.CategoriesPage })));
const EntitlementsPage = lazy(() => import('@/pages/admin/EntitlementsPage').then(m => ({ default: m.EntitlementsPage })));
const PointsConfigPage = lazy(() => import('@/pages/admin/PointsConfigPage').then(m => ({ default: m.PointsConfigPage })));
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));
const AdminMarketplaceDashboard = lazy(() => import('@/pages/admin/AdminMarketplaceDashboard').then(m => ({ default: m.AdminMarketplaceDashboard })));
const AdminProvidersPage = lazy(() => import('@/pages/admin/AdminProvidersPage').then(m => ({ default: m.AdminProvidersPage })));
const AdminBookingsPage = lazy(() => import('@/pages/admin/AdminBookingsPage').then(m => ({ default: m.AdminBookingsPage })));
const AdminDisputesPage = lazy(() => import('@/pages/admin/AdminDisputesPage').then(m => ({ default: m.AdminDisputesPage })));
const AdminQualityPage = lazy(() => import('@/pages/admin/AdminQualityPage').then(m => ({ default: m.AdminQualityPage })));
const AdminCommunityReportsPage = lazy(() => import('@/pages/admin/AdminCommunityReportsPage').then(m => ({ default: m.AdminCommunityReportsPage })));
const AdminSuspensionsPage = lazy(() => import('@/pages/admin/AdminSuspensionsPage').then(m => ({ default: m.AdminSuspensionsPage })));
const AdminCommunityPage = lazy(() => import('@/pages/admin/AdminCommunityPage').then(m => ({ default: m.AdminCommunityPage })));
const AdminUserReportsPage = lazy(() => import('@/pages/admin/AdminUserReportsPage').then(m => ({ default: m.AdminUserReportsPage })));
const AdminPrerequisiteCoursesPage = lazy(() => import('@/pages/admin/AdminPrerequisiteCoursesPage').then(m => ({ default: m.AdminPrerequisiteCoursesPage })));
const AccessControlPage = lazy(() => import('@/pages/admin/AccessControlPage').then(m => ({ default: m.AccessControlPage })));

// Community pages - Forums
const ForumsPage = lazy(() => import('@/pages/applicant/ForumsPage').then(m => ({ default: m.ForumsPage })));
const ForumTopicsPage = lazy(() => import('@/pages/applicant/ForumTopicsPage').then(m => ({ default: m.ForumTopicsPage })));
const TopicDetailPage = lazy(() => import('@/pages/applicant/TopicDetailPage').then(m => ({ default: m.TopicDetailPage })));

// Community pages - Groups (DISABLED - not used in MVP)
// const GroupsPage = lazy(() => import('@/pages/applicant/GroupsPage').then(m => ({ default: m.GroupsPage })));
// const GroupDetailPage = lazy(() => import('@/pages/applicant/GroupDetailPage').then(m => ({ default: m.GroupDetailPage })));

// Community pages - Messages
const MessagesPage = lazy(() => import('@/pages/applicant/MessagesPage').then(m => ({ default: m.MessagesPage })));

// Helper to wrap admin routes
function adminPage(Component) {
  return (
    <AdminRoute>
      <Suspense fallback={<PageLoader />}>
        <Component />
      </Suspense>
    </AdminRoute>
  );
}

// Helper to wrap provider routes
function providerPage(Component) {
  return (
    <ProviderRoute>
      <Suspense fallback={<PageLoader />}>
        <Component />
      </Suspense>
    </ProviderRoute>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      // Redirect root to dashboard
      { index: true, element: <Navigate to="/dashboard" replace /> },

      // Applicant Core
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'my-programs', element: <MyProgramsPage /> },
      { path: 'my-programs/:programId', element: <TargetProgramDetailPage /> },
      { path: 'trackers', element: <MyTrackersPage /> },
      { path: 'trackers/:tab', element: <MyTrackersPage /> },
      { path: 'my-stats', element: <MyStatsPage /> },

      // Content & Discovery
      { path: 'schools', element: <SchoolDatabasePage /> },
      { path: 'schools/:schoolId', element: <SchoolProfilePage /> },
      { path: 'prerequisites', element: <PrerequisiteLibraryPage /> },
      { path: 'learn', element: <LearningLibraryPage /> },
      { path: 'learn/:moduleSlug', element: <ModuleDetailPage /> },
      { path: 'learn/:moduleSlug/:lessonSlug', element: <LessonPage /> },
      { path: 'learning', element: <Navigate to="/learn" replace /> },
      { path: 'events', element: <EventsPage /> },

      // Marketplace
      { path: 'marketplace', element: <MarketplacePage /> },
      { path: 'marketplace/mentor/:mentorId', element: <MentorProfilePage /> },
      { path: 'marketplace/mentor/:mentorId/reviews', element: <MentorReviewsPage /> },
      { path: 'marketplace/become-a-mentor', element: <BecomeMentorLandingPage /> },
      { path: 'marketplace/provider/apply', element: <ProviderApplicationPage /> },
      { path: 'marketplace/provider/application-status', element: <ApplicationStatusPage /> },
      // Provider Dashboard Routes (requires approved provider status)
      { path: 'marketplace/provider/onboarding', element: providerPage(ProviderOnboardingPage) },
      { path: 'marketplace/provider/dashboard', element: providerPage(ProviderDashboardPage) },
      { path: 'marketplace/provider/requests', element: providerPage(ProviderRequestsPage) },
      { path: 'marketplace/provider/bookings', element: providerPage(ProviderBookingsPage) },
      { path: 'marketplace/provider/bookings/:id/review', element: providerPage(ProviderLeaveReviewPage) },
      { path: 'marketplace/provider/services', element: providerPage(ProviderServicesPage) },
      { path: 'marketplace/provider/availability', element: providerPage(ProviderAvailabilityPage) },
      { path: 'marketplace/provider/earnings', element: providerPage(ProviderEarningsPage) },
      { path: 'marketplace/provider/profile', element: providerPage(ProviderProfilePage) },
      { path: 'marketplace/provider/insights', element: providerPage(ProviderInsightsPage) },
      { path: 'marketplace/provider/resources', element: providerPage(MentorResourcesPage) },
      { path: 'marketplace/book/:serviceId', element: <BookingPage /> },
      { path: 'marketplace/bookings/:bookingId', element: <BookingDetailPage /> },
      { path: 'marketplace/bookings/:bookingId/details', element: <BookingDetailPage /> },
      { path: 'marketplace/bookings/:bookingId/join', element: <SessionRoomPage /> },
      { path: 'marketplace/bookings/:bookingId/review', element: <LeaveReviewPage /> },
      { path: 'marketplace/my-bookings', element: <MyBookingsPage /> },
      { path: 'marketplace/messages', element: <PlaceholderPage title="Marketplace Messages" /> },

      // Community
      { path: 'community', element: <Navigate to="/community/forums" replace /> },
      { path: 'community/forums', element: <ForumsPage /> },
      { path: 'community/forums/:forumId', element: <ForumTopicsPage /> },
      { path: 'community/forums/:forumId/:topicId', element: <TopicDetailPage /> },
      // Groups routes disabled - not used in MVP
      // { path: 'community/groups', element: <GroupsPage /> },
      // { path: 'community/groups/:groupId', element: <GroupDetailPage /> },
      { path: 'messages', element: <MessagesPage /> },

      // Tools
      { path: 'tools', element: <ToolsPage /> },
      { path: 'documents', element: <PlaceholderPage title="My Documents" /> },

      // Account
      { path: 'settings', element: <SettingsPage /> },
      { path: 'my-purchases', element: <PlaceholderPage title="My Purchases" /> },
      { path: 'notifications', element: <NotificationsPage /> },

      // Legal
      { path: 'terms', element: <TermsPage /> },
      { path: 'privacy', element: <PrivacyPolicyPage /> },
      { path: 'cookies', element: <CookiePolicyPage /> },
      { path: 'acceptable-use', element: <AcceptableUsePolicyPage /> },
      { path: 'dmca', element: <DMCAPolicyPage /> },
      { path: 'accessibility', element: <AccessibilityPage /> },
      { path: 'california-privacy', element: <CaliforniaPrivacyPage /> },

      // Admin Routes (requires admin role)
      { path: 'admin', element: adminPage(AdminDashboardPage) },
      { path: 'admin/modules', element: adminPage(ModulesListPage) },
      { path: 'admin/modules/new', element: adminPage(AdminModuleDetailPage) },
      { path: 'admin/modules/:moduleId', element: adminPage(AdminModuleDetailPage) },
      { path: 'admin/lessons/new', element: adminPage(LessonEditPage) },
      { path: 'admin/lessons/:lessonId', element: adminPage(LessonEditPage) },
      { path: 'admin/downloads', element: adminPage(DownloadsListPage) },
      { path: 'admin/downloads/new', element: adminPage(DownloadEditPage) },
      { path: 'admin/downloads/:downloadId', element: adminPage(DownloadEditPage) },
      { path: 'admin/categories', element: adminPage(CategoriesPage) },
      { path: 'admin/entitlements', element: adminPage(EntitlementsPage) },
      { path: 'admin/access-control', element: adminPage(AccessControlPage) },
      { path: 'admin/points', element: adminPage(PointsConfigPage) },

      // Admin Marketplace Routes
      { path: 'admin/marketplace', element: adminPage(AdminMarketplaceDashboard) },
      { path: 'admin/marketplace/providers', element: adminPage(AdminProvidersPage) },
      { path: 'admin/marketplace/bookings', element: adminPage(AdminBookingsPage) },
      { path: 'admin/marketplace/disputes', element: adminPage(AdminDisputesPage) },
      { path: 'admin/marketplace/quality', element: adminPage(AdminQualityPage) },

      // Admin Community Routes
      { path: 'admin/community', element: adminPage(AdminCommunityPage) },
      { path: 'admin/community/reports', element: adminPage(AdminCommunityReportsPage) },
      { path: 'admin/community/suspensions', element: adminPage(AdminSuspensionsPage) },

      // Admin User Reports (school errors, event suggestions)
      { path: 'admin/user-reports', element: adminPage(AdminUserReportsPage) },

      // Admin Prerequisite Library
      { path: 'admin/prerequisite-courses', element: adminPage(AdminPrerequisiteCoursesPage) },
    ],
  },

  // Auth routes (no layout, no protection)
  { path: 'login', element: <LoginPage /> },
  { path: 'register', element: <RegisterPage /> },

  // Development
  {
    path: 'playground',
    element: (
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>}>
        <PlaygroundPage />
      </Suspense>
    )
  },
  {
    path: 'timeline-test',
    element: (
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>}>
        <TimelineTestPage />
      </Suspense>
    )
  },
  {
    path: 'lms-test',
    element: (
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>}>
        <LmsTestPage />
      </Suspense>
    )
  },
  {
    path: 'component-showcase',
    element: (
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>}>
        <ComponentShowcasePage />
      </Suspense>
    )
  },
  {
    path: 'preview/mentor-recommendations',
    element: (
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>}>
        <MentorRecommendationsPreview />
      </Suspense>
    )
  },
  {
    path: 'preview/marketplace-demo',
    element: (
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>}>
        <MarketplaceDemoPage />
      </Suspense>
    )
  },
  {
    path: 'preview/demo',
    element: (
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>}>
        <DemoIndexPage />
      </Suspense>
    )
  },
  {
    path: 'route-audit',
    element: (
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>}>
        <RouteAuditPage />
      </Suspense>
    )
  },
  {
    path: 'demo/tracker-cards',
    element: (
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>}>
        <TrackerCardsDemo />
      </Suspense>
    )
  },
  {
    path: 'demo/suggested-tasks',
    element: (
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>}>
        <SuggestedTasksDemo />
      </Suspense>
    )
  },
  {
    path: 'demo/apple-style',
    element: (
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>}>
        <AppleStyleDemo />
      </Suspense>
    )
  },
  {
    path: 'demo/sidebar-showcase',
    element: (
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>}>
        <SidebarShowcasePage />
      </Suspense>
    )
  },
  {
    path: 'demo/tracker-colors',
    element: (
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>}>
        <TrackerColorShowcasePage />
      </Suspense>
    )
  },
  {
    path: 'demo/accent-colors',
    element: (
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>}>
        <AccentColorDemo />
      </Suspense>
    )
  },

  // 404
  { path: '*', element: <PlaceholderPage title="Page Not Found" /> },
]);
