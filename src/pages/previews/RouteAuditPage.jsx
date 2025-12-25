/**
 * Route Audit Page
 *
 * Comprehensive list of all routes for UI auditing and testing.
 * DELETE THIS FILE before production launch.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  Database,
  User,
  Shield,
  Users,
  BookOpen,
  Calendar,
  MessageSquare,
  Settings,
  ShoppingBag,
  Wrench,
  Layout,
  Play,
  RotateCcw,
  Check,
  Layers,
  PanelRight,
  Star,
  FileEdit,
  GraduationCap
} from 'lucide-react';

// Route status types
const STATUS = {
  WORKS: 'works',           // Fully functional with mock data
  NEEDS_BACKEND: 'backend', // UI works but needs real API
  PLACEHOLDER: 'placeholder', // PlaceholderPage component
  PARTIAL: 'partial',       // Some features work, some don't
};

const statusConfig = {
  [STATUS.WORKS]: {
    label: 'Works',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle2,
    description: 'Fully functional with mock data'
  },
  [STATUS.NEEDS_BACKEND]: {
    label: 'Needs Backend',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Database,
    description: 'UI works, needs Supabase integration'
  },
  [STATUS.PLACEHOLDER]: {
    label: 'Placeholder',
    color: 'bg-gray-100 text-gray-600 border-gray-200',
    icon: Clock,
    description: 'Not implemented yet'
  },
  [STATUS.PARTIAL]: {
    label: 'Partial',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: AlertCircle,
    description: 'Some features work, some need backend'
  },
};

// All routes organized by section
const routeSections = [
  {
    title: 'Applicant Core',
    icon: User,
    routes: [
      { path: '/dashboard', name: 'Dashboard', status: STATUS.WORKS, notes: 'Mock data, all widgets functional' },
      { path: '/my-programs', name: 'My Programs', status: STATUS.WORKS, notes: 'Saved & target programs' },
      { path: '/my-programs/1', name: 'Target Program Detail', status: STATUS.WORKS, notes: 'Use ID 1-3 for test data' },
      { path: '/trackers', name: 'My Trackers', status: STATUS.WORKS, notes: 'All 4 tracker tabs' },
      { path: '/trackers/clinical', name: 'Clinical Tab', status: STATUS.WORKS },
      { path: '/trackers/eq', name: 'EQ Tab', status: STATUS.WORKS },
      { path: '/trackers/shadow', name: 'Shadow Days Tab', status: STATUS.WORKS },
      { path: '/trackers/events', name: 'Events Tab', status: STATUS.WORKS },
      { path: '/my-stats', name: 'My Stats', status: STATUS.WORKS, notes: 'Full profile with ReadyScore' },
    ]
  },
  {
    title: 'Content & Discovery',
    icon: BookOpen,
    routes: [
      { path: '/schools', name: 'School Database', status: STATUS.WORKS, notes: '~140 programs searchable' },
      { path: '/schools/1', name: 'School Profile', status: STATUS.WORKS, notes: 'Use ID 1 for test' },
      { path: '/prerequisites', name: 'Prerequisite Library', status: STATUS.WORKS },
      { path: '/learn', name: 'Learning Library', status: STATUS.WORKS, notes: 'Module grid with progress' },
      { path: '/learn/getting-started', name: 'Module Detail', status: STATUS.WORKS, notes: 'Mock module slug' },
      { path: '/learn/getting-started/welcome', name: 'Lesson Page', status: STATUS.PARTIAL, notes: 'Vimeo player needs real videos' },
      { path: '/events', name: 'Events', status: STATUS.WORKS },
    ]
  },
  {
    title: 'Marketplace - Applicant',
    icon: ShoppingBag,
    routes: [
      { path: '/marketplace', name: 'Marketplace Browse', status: STATUS.WORKS, notes: 'Filter/search mentors' },
      { path: '/marketplace/mentor/1', name: 'Mentor Profile', status: STATUS.WORKS, notes: 'Mock mentor ID 1' },
      { path: '/marketplace/mentor/1/reviews', name: 'Mentor Reviews', status: STATUS.WORKS },
      { path: '/marketplace/book/1', name: 'Book Service', status: STATUS.PARTIAL, notes: 'UI works, payment needs Stripe' },
      { path: '/marketplace/my-bookings', name: 'My Bookings', status: STATUS.WORKS },
      { path: '/marketplace/bookings/1', name: 'Booking Detail', status: STATUS.WORKS },
      { path: '/marketplace/bookings/1/details', name: 'Booking Details Alt', status: STATUS.WORKS },
      { path: '/marketplace/bookings/1/join', name: 'Session Room', status: STATUS.PARTIAL, notes: 'Video needs real integration' },
      { path: '/marketplace/bookings/1/review', name: 'Leave Review', status: STATUS.WORKS },
      { path: '/marketplace/messages', name: 'Marketplace Messages', status: STATUS.PLACEHOLDER },
    ]
  },
  {
    title: 'Marketplace - Provider (SRNA)',
    icon: Users,
    routes: [
      { path: '/marketplace/become-a-mentor', name: 'Become a Mentor Landing', status: STATUS.WORKS },
      { path: '/marketplace/provider/apply', name: 'Provider Application', status: STATUS.WORKS, notes: 'Multi-step form' },
      { path: '/marketplace/provider/application-status', name: 'Application Status', status: STATUS.WORKS },
      { path: '/marketplace/provider/onboarding', name: 'Provider Onboarding', status: STATUS.WORKS, notes: '5-step onboarding wizard' },
      { path: '/marketplace/provider/dashboard', name: 'Provider Dashboard', status: STATUS.WORKS },
      { path: '/marketplace/provider/requests', name: 'Booking Requests', status: STATUS.WORKS },
      { path: '/marketplace/provider/bookings', name: 'Provider Bookings', status: STATUS.WORKS },
      { path: '/marketplace/provider/bookings/1/review', name: 'Provider Leave Review', status: STATUS.WORKS },
      { path: '/marketplace/provider/services', name: 'Manage Services', status: STATUS.WORKS },
      { path: '/marketplace/provider/availability', name: 'Availability Settings', status: STATUS.PARTIAL, notes: 'Cal.com integration needed' },
      { path: '/marketplace/provider/earnings', name: 'Earnings & Payouts', status: STATUS.PARTIAL, notes: 'Stripe Connect needed' },
      { path: '/marketplace/provider/profile', name: 'Edit Profile', status: STATUS.WORKS },
      { path: '/marketplace/provider/insights', name: 'Provider Insights', status: STATUS.WORKS },
      { path: '/marketplace/provider/resources', name: 'Mentor Resources', status: STATUS.WORKS },
    ]
  },
  {
    title: 'Community',
    icon: MessageSquare,
    routes: [
      { path: '/community/forums', name: 'Forums List', status: STATUS.WORKS, notes: 'BuddyBoss mock data' },
      { path: '/community/forums/1', name: 'Forum Topics', status: STATUS.WORKS },
      { path: '/community/forums/1/1', name: 'Topic Detail', status: STATUS.WORKS },
      { path: '/community/groups', name: 'Groups List', status: STATUS.WORKS },
      { path: '/community/groups/1', name: 'Group Detail', status: STATUS.WORKS },
      { path: '/messages', name: 'Messages/Inbox', status: STATUS.WORKS, notes: 'Real-time needs Supabase' },
    ]
  },
  {
    title: 'Tools & Documents',
    icon: Wrench,
    routes: [
      { path: '/tools', name: 'Tools Hub', status: STATUS.WORKS, notes: 'Links to micro-apps' },
      { path: '/documents', name: 'My Documents', status: STATUS.PLACEHOLDER },
    ]
  },
  {
    title: 'Account & Settings',
    icon: Settings,
    routes: [
      { path: '/notifications', name: 'Notifications', status: STATUS.WORKS },
      { path: '/settings', name: 'Settings', status: STATUS.PLACEHOLDER },
      { path: '/settings/notifications', name: 'Notification Settings', status: STATUS.PLACEHOLDER },
      { path: '/my-purchases', name: 'My Purchases', status: STATUS.PLACEHOLDER },
    ]
  },
  {
    title: 'Admin - LMS',
    icon: Shield,
    routes: [
      { path: '/admin', name: 'Admin Dashboard', status: STATUS.WORKS },
      { path: '/admin/modules', name: 'Modules List', status: STATUS.WORKS, notes: 'Drag & drop ordering' },
      { path: '/admin/modules/new', name: 'Create Module', status: STATUS.WORKS },
      { path: '/admin/modules/1', name: 'Edit Module', status: STATUS.WORKS },
      { path: '/admin/lessons/new', name: 'Create Lesson', status: STATUS.WORKS, notes: 'Editor.js block editor' },
      { path: '/admin/lessons/1', name: 'Edit Lesson', status: STATUS.WORKS },
      { path: '/admin/downloads', name: 'Downloads List', status: STATUS.WORKS },
      { path: '/admin/downloads/new', name: 'Create Download', status: STATUS.WORKS },
      { path: '/admin/downloads/1', name: 'Edit Download', status: STATUS.WORKS },
      { path: '/admin/categories', name: 'Categories', status: STATUS.WORKS },
      { path: '/admin/entitlements', name: 'Entitlements', status: STATUS.WORKS },
      { path: '/admin/points', name: 'Points Config', status: STATUS.WORKS },
    ]
  },
  {
    title: 'Admin - Marketplace',
    icon: Shield,
    routes: [
      { path: '/admin/marketplace', name: 'Marketplace Dashboard', status: STATUS.WORKS },
      { path: '/admin/marketplace/providers', name: 'Manage Providers', status: STATUS.WORKS, notes: 'Approve/reject applications' },
      { path: '/admin/marketplace/bookings', name: 'All Bookings', status: STATUS.WORKS },
      { path: '/admin/marketplace/disputes', name: 'Disputes', status: STATUS.WORKS },
      { path: '/admin/marketplace/quality', name: 'Quality Metrics', status: STATUS.WORKS },
    ]
  },
  {
    title: 'Admin - Community',
    icon: Shield,
    routes: [
      { path: '/admin/community/reports', name: 'Community Reports', status: STATUS.WORKS, notes: 'Moderate reported content' },
      { path: '/admin/community/suspensions', name: 'User Suspensions', status: STATUS.WORKS, notes: 'Manage suspended users' },
    ]
  },
  {
    title: 'Authentication',
    icon: User,
    routes: [
      { path: '/login', name: 'Login', status: STATUS.PLACEHOLDER, notes: 'Needs Supabase Auth' },
      { path: '/register', name: 'Register', status: STATUS.PLACEHOLDER, notes: 'Needs Supabase Auth' },
    ]
  },
  {
    title: 'Development / Preview',
    icon: Play,
    routes: [
      { path: '/playground', name: 'Component Playground', status: STATUS.WORKS },
      { path: '/timeline-test', name: 'Timeline Test', status: STATUS.WORKS },
      { path: '/lms-test', name: 'LMS Test', status: STATUS.WORKS },
      { path: '/preview/mentor-recommendations', name: 'Mentor Recommendations Preview', status: STATUS.WORKS },
      { path: '/preview/marketplace-demo', name: 'Marketplace Demo', status: STATUS.WORKS },
      { path: '/preview/demo', name: 'Demo Index', status: STATUS.WORKS },
      { path: '/route-audit', name: 'Route Audit (this page)', status: STATUS.WORKS },
    ]
  },
];

// Modals, Sheets, and Popups organized by section
const modalSections = [
  {
    title: 'Onboarding & Auth Modals',
    icon: User,
    items: [
      { id: 'onboarding-modal', name: 'OnboardingModal', file: 'onboarding/OnboardingModal.jsx', status: STATUS.WORKS, trigger: 'Dashboard → first visit or "Start Onboarding"', notes: '12-step wizard' },
      { id: 'account-gate-modal', name: 'AccountGateModal', file: 'auth/AccountGateModal.jsx', status: STATUS.WORKS, trigger: 'Paywalled content access', notes: 'Login/register prompt' },
      { id: 'school-onboarding-modal', name: 'SchoolOnboardingModal', file: 'schools/SchoolOnboardingModal.jsx', status: STATUS.WORKS, trigger: 'First visit to schools page' },
    ]
  },
  {
    title: 'Gamification Modals',
    icon: Star,
    items: [
      { id: 'badge-earned-modal', name: 'BadgeEarnedModal', file: 'gamification/BadgeEarnedModal.jsx', status: STATUS.WORKS, trigger: 'Earning a badge', notes: 'Celebration animation' },
      { id: 'level-up-modal', name: 'LevelUpModal', file: 'gamification/LevelUpModal.jsx', status: STATUS.WORKS, trigger: 'Level up event', notes: 'Confetti animation' },
    ]
  },
  {
    title: 'Dashboard Modals & Sheets',
    icon: Layout,
    items: [
      { id: 'task-edit-modal', name: 'TaskEditModal', file: 'dashboard/TaskEditModal.jsx', status: STATUS.WORKS, trigger: 'Dashboard → edit task' },
      { id: 'task-edit-drawer', name: 'TaskEditDrawer', file: 'dashboard/TaskEditDrawer.jsx', status: STATUS.WORKS, trigger: 'Dashboard → task click (mobile)' },
    ]
  },
  {
    title: 'Tracker Modals & Sheets',
    icon: Calendar,
    items: [
      { id: 'shadow-goal-edit', name: 'ShadowGoalEditDialog', file: 'trackers/ShadowGoalEditDialog.jsx', status: STATUS.WORKS, trigger: '/trackers/shadow → Edit goal' },
      { id: 'shadow-day-form', name: 'ShadowDayForm (Sheet)', file: 'trackers/ShadowDayForm.jsx', status: STATUS.WORKS, trigger: '/trackers/shadow → Log shadow day' },
      { id: 'entry-form-sheet', name: 'EntryFormSheet', file: 'trackers/EntryFormSheet.jsx', status: STATUS.WORKS, trigger: '/trackers → Add entry' },
      { id: 'clinical-entry-form', name: 'ClinicalEntryForm (Sheet)', file: 'trackers/clinical/ClinicalEntryForm.jsx', status: STATUS.WORKS, trigger: '/trackers/clinical → Log shift' },
      { id: 'unit-profile-setup', name: 'UnitProfileSetup (Sheet)', file: 'trackers/clinical/UnitProfileSetup.jsx', status: STATUS.WORKS, trigger: '/trackers/clinical → First visit' },
    ]
  },
  {
    title: 'MyStats Edit Sheets',
    icon: FileEdit,
    items: [
      { id: 'gpa-edit-sheet', name: 'GpaEditSheet', file: 'stats/GpaEditSheet.jsx', status: STATUS.WORKS, trigger: '/my-stats → Edit GPA' },
      { id: 'gre-edit-sheet', name: 'GreEditSheet', file: 'stats/GreEditSheet.jsx', status: STATUS.WORKS, trigger: '/my-stats → Edit GRE' },
      { id: 'prereqs-edit-sheet', name: 'PrerequisitesEditSheet', file: 'stats/PrerequisitesEditSheet.jsx', status: STATUS.WORKS, trigger: '/my-stats → Edit prerequisites' },
      { id: 'certs-edit-sheet', name: 'CertificationsEditSheet', file: 'stats/CertificationsEditSheet.jsx', status: STATUS.WORKS, trigger: '/my-stats → Edit certifications' },
      { id: 'resume-booster-sheet', name: 'ResumeBoosterEditSheet', file: 'stats/ResumeBoosterEditSheet.jsx', status: STATUS.WORKS, trigger: '/my-stats → Edit leadership/research' },
    ]
  },
  {
    title: 'Prerequisite Modals',
    icon: GraduationCap,
    items: [
      { id: 'course-detail-modal', name: 'CourseDetailModal', file: 'prerequisites/CourseDetailModal.jsx', status: STATUS.WORKS, trigger: '/prerequisites → Click course' },
      { id: 'submit-course-modal', name: 'SubmitCourseModal', file: 'prerequisites/SubmitCourseModal.jsx', status: STATUS.WORKS, trigger: '/prerequisites → Submit new course' },
      { id: 'write-review-modal', name: 'WriteReviewModal', file: 'prerequisites/WriteReviewModal.jsx', status: STATUS.WORKS, trigger: '/prerequisites → Write review' },
    ]
  },
  {
    title: 'Events Modal',
    icon: Calendar,
    items: [
      { id: 'event-detail-modal', name: 'EventDetailModal', file: 'events/EventDetailModal.jsx', status: STATUS.WORKS, trigger: '/events → Click event card' },
    ]
  },
  {
    title: 'Marketplace Booking Modals',
    icon: ShoppingBag,
    items: [
      { id: 'cancel-booking-modal', name: 'CancelBookingModal', file: 'marketplace/CancelBookingModal.jsx', status: STATUS.WORKS, trigger: 'Booking detail → Cancel' },
      { id: 'reschedule-modal', name: 'RescheduleModal', file: 'marketplace/RescheduleModal.jsx', status: STATUS.WORKS, trigger: 'Booking detail → Reschedule' },
      { id: 'mentor-recommendations-popup', name: 'MentorRecommendationsPopup', file: 'marketplace/MentorRecommendationsPopup.jsx', status: STATUS.WORKS, trigger: 'Dashboard widget → See all' },
    ]
  },
  {
    title: 'Provider Request Modals',
    icon: Users,
    items: [
      { id: 'accept-request-modal', name: 'AcceptRequestModal', file: 'provider/AcceptRequestModal.jsx', status: STATUS.WORKS, trigger: 'Provider requests → Accept' },
      { id: 'decline-request-modal', name: 'DeclineRequestModal', file: 'provider/DeclineRequestModal.jsx', status: STATUS.WORKS, trigger: 'Provider requests → Decline' },
      { id: 'propose-alternative-modal', name: 'ProposeAlternativeModal', file: 'provider/ProposeAlternativeModal.jsx', status: STATUS.WORKS, trigger: 'Provider requests → Propose alt' },
      { id: 'edit-service-sheet', name: 'EditServiceSheet', file: 'provider/EditServiceSheet.jsx', status: STATUS.WORKS, trigger: 'Provider services → Edit' },
      { id: 'welcome-video-modal', name: 'WelcomeVideoModal', file: 'provider/WelcomeVideoUpload.jsx', status: STATUS.WORKS, trigger: 'Provider profile → Upload video' },
    ]
  },
  {
    title: 'Community Sheets',
    icon: MessageSquare,
    items: [
      { id: 'new-topic-sheet', name: 'NewTopicSheet', file: 'community/NewTopicSheet.jsx', status: STATUS.WORKS, trigger: '/community/forums → New topic' },
      { id: 'edit-topic-sheet', name: 'EditTopicSheet', file: 'community/EditTopicSheet.jsx', status: STATUS.WORKS, trigger: 'Topic detail → Edit' },
      { id: 'new-conversation-sheet', name: 'NewConversationSheet', file: 'messages/NewConversationSheet.jsx', status: STATUS.WORKS, trigger: '/messages → New message' },
      { id: 'post-activity-sheet', name: 'PostActivitySheet', file: 'groups/PostActivitySheet.jsx', status: STATUS.WORKS, trigger: 'Group detail → Post' },
    ]
  },
  {
    title: 'Schools & Programs',
    icon: BookOpen,
    items: [
      { id: 'saved-programs-tray', name: 'SavedProgramsTray (Sheet)', file: 'schools/SavedProgramsTray.jsx', status: STATUS.WORKS, trigger: '/schools → Saved programs button' },
      { id: 'school-filters', name: 'SchoolFilters (Popover)', file: 'schools/SchoolFilters.jsx', status: STATUS.WORKS, trigger: '/schools → Filter button' },
      { id: 'milestone-detail', name: 'MilestoneDetail (Dialog)', file: 'MilestoneDetail.jsx', status: STATUS.WORKS, trigger: 'Target program → Milestone' },
    ]
  },
  {
    title: 'Admin Modals',
    icon: Shield,
    items: [
      { id: 'delete-confirm-modal', name: 'DeleteConfirmModal', file: 'admin/DeleteConfirmModal.jsx', status: STATUS.WORKS, trigger: 'Admin pages → Delete action' },
      { id: 'category-form-dialog', name: 'CategoryForm (Dialog)', file: 'admin/CategoryForm.jsx', status: STATUS.WORKS, trigger: '/admin/categories → Add/Edit' },
      { id: 'entitlement-form-dialog', name: 'EntitlementForm (Dialog)', file: 'admin/EntitlementForm.jsx', status: STATUS.WORKS, trigger: '/admin/entitlements → Add/Edit' },
      { id: 'report-action-sheet', name: 'ReportActionSheet', file: 'admin/ReportActionSheet.jsx', status: STATUS.WORKS, trigger: '/admin/community/reports → Action' },
    ]
  },
  {
    title: 'Global Components',
    icon: Layers,
    items: [
      { id: 'global-search', name: 'GlobalSearch (Command)', file: 'search/GlobalSearch.jsx', status: STATUS.PARTIAL, trigger: '⌘+K / Ctrl+K', notes: 'UI works, search needs backend' },
      { id: 'confirm-dialog', name: 'ConfirmDialog', file: 'ui/confirm-dialog.jsx', status: STATUS.WORKS, trigger: 'Various delete/confirm actions' },
    ]
  },
];

// Summary stats
function getStats() {
  const allRoutes = routeSections.flatMap(s => s.routes);
  const allModals = modalSections.flatMap(s => s.items);
  return {
    total: allRoutes.length,
    works: allRoutes.filter(r => r.status === STATUS.WORKS).length,
    needsBackend: allRoutes.filter(r => r.status === STATUS.NEEDS_BACKEND).length,
    partial: allRoutes.filter(r => r.status === STATUS.PARTIAL).length,
    placeholder: allRoutes.filter(r => r.status === STATUS.PLACEHOLDER).length,
    modalTotal: allModals.length,
    modalWorks: allModals.filter(m => m.status === STATUS.WORKS).length,
  };
}

function StatusBadge({ status }) {
  const config = statusConfig[status];
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${config.color}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
}

function RouteCard({ route, isChecked, onToggle }) {
  return (
    <div className={`flex items-center justify-between p-3 rounded-xl border hover:shadow-sm transition-all ${isChecked ? 'bg-green-50 border-green-200' : 'bg-white'}`}>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(route.path)}
          className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
            isChecked
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-gray-300 hover:border-green-400'
          }`}
        >
          {isChecked && <Check className="w-3 h-3" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Link
              to={route.path}
              className={`font-medium hover:underline truncate ${isChecked ? 'text-green-700' : 'text-blue-600 hover:text-blue-800'}`}
            >
              {route.name}
            </Link>
            <ExternalLink className="w-3 h-3 text-gray-400 shrink-0" />
          </div>
          <div className="flex items-center gap-2 mt-1">
            <code className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
              {route.path}
            </code>
            {route.notes && (
              <span className="text-xs text-gray-500 truncate">
                {route.notes}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="ml-3 shrink-0">
        <StatusBadge status={route.status} />
      </div>
    </div>
  );
}

function SectionCard({ section, checkedRoutes, onToggle, onCheckAll }) {
  const Icon = section.icon;
  const checkedCount = section.routes.filter(r => checkedRoutes.has(r.path)).length;
  const allChecked = checkedCount === section.routes.length;

  return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-gray-600" />
          <h2 className="font-semibold text-gray-900">{section.title}</h2>
          <span className="text-sm text-gray-500">
            ({checkedCount}/{section.routes.length} checked)
          </span>
        </div>
        <button
          onClick={() => onCheckAll(section.routes.map(r => r.path), !allChecked)}
          className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
        >
          {allChecked ? 'Uncheck all' : 'Check all'}
        </button>
      </div>
      <div className="p-3 space-y-2">
        {section.routes.map(route => (
          <RouteCard
            key={route.path}
            route={route}
            isChecked={checkedRoutes.has(route.path)}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  );
}

// Modal card component (similar to RouteCard but for modals)
function ModalCard({ modal, isChecked, onToggle }) {
  return (
    <div className={`flex items-center justify-between p-3 rounded-xl border hover:shadow-sm transition-all ${isChecked ? 'bg-purple-50 border-purple-200' : 'bg-white'}`}>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(modal.id)}
          className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
            isChecked
              ? 'bg-purple-500 border-purple-500 text-white'
              : 'border-gray-300 hover:border-purple-400'
          }`}
        >
          {isChecked && <Check className="w-3 h-3" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`font-medium ${isChecked ? 'text-purple-700' : 'text-gray-900'}`}>
              {modal.name}
            </span>
            <PanelRight className="w-3 h-3 text-gray-400 shrink-0" />
          </div>
          <div className="flex flex-col gap-1 mt-1">
            <div className="flex items-center gap-2">
              <code className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                {modal.file}
              </code>
            </div>
            <div className="text-xs text-gray-600">
              <span className="font-medium">Trigger:</span> {modal.trigger}
            </div>
            {modal.notes && (
              <span className="text-xs text-gray-500">{modal.notes}</span>
            )}
          </div>
        </div>
      </div>
      <div className="ml-3 shrink-0">
        <StatusBadge status={modal.status} />
      </div>
    </div>
  );
}

function ModalSectionCard({ section, checkedModals, onToggle, onCheckAll }) {
  const Icon = section.icon;
  const checkedCount = section.items.filter(m => checkedModals.has(m.id)).length;
  const allChecked = checkedCount === section.items.length;

  return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
      <div className="px-4 py-3 bg-purple-50 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-purple-600" />
          <h2 className="font-semibold text-gray-900">{section.title}</h2>
          <span className="text-sm text-gray-500">
            ({checkedCount}/{section.items.length} checked)
          </span>
        </div>
        <button
          onClick={() => onCheckAll(section.items.map(m => m.id), !allChecked)}
          className="text-xs text-purple-600 hover:text-purple-800 hover:underline"
        >
          {allChecked ? 'Uncheck all' : 'Check all'}
        </button>
      </div>
      <div className="p-3 space-y-2">
        {section.items.map(modal => (
          <ModalCard
            key={modal.id}
            modal={modal}
            isChecked={checkedModals.has(modal.id)}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  );
}

const STORAGE_KEY = 'crna-route-audit-checked';
const MODAL_STORAGE_KEY = 'crna-modal-audit-checked';

export function RouteAuditPage() {
  const stats = getStats();

  // Load checked routes from localStorage
  const [checkedRoutes, setCheckedRoutes] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Load checked modals from localStorage
  const [checkedModals, setCheckedModals] = useState(() => {
    try {
      const saved = localStorage.getItem(MODAL_STORAGE_KEY);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Save to localStorage whenever checked routes change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...checkedRoutes]));
  }, [checkedRoutes]);

  // Save to localStorage whenever checked modals change
  useEffect(() => {
    localStorage.setItem(MODAL_STORAGE_KEY, JSON.stringify([...checkedModals]));
  }, [checkedModals]);

  // Toggle a single route
  const handleToggle = (path) => {
    setCheckedRoutes(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  // Toggle a single modal
  const handleModalToggle = (id) => {
    setCheckedModals(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Check/uncheck all routes in a section
  const handleCheckAll = (paths, check) => {
    setCheckedRoutes(prev => {
      const next = new Set(prev);
      paths.forEach(path => {
        if (check) {
          next.add(path);
        } else {
          next.delete(path);
        }
      });
      return next;
    });
  };

  // Check/uncheck all modals in a section
  const handleModalCheckAll = (ids, check) => {
    setCheckedModals(prev => {
      const next = new Set(prev);
      ids.forEach(id => {
        if (check) {
          next.add(id);
        } else {
          next.delete(id);
        }
      });
      return next;
    });
  };

  // Reset all checkboxes
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all checkboxes?')) {
      setCheckedRoutes(new Set());
      setCheckedModals(new Set());
    }
  };

  // Check all routes
  const handleCheckAllRoutes = () => {
    const allPaths = routeSections.flatMap(s => s.routes.map(r => r.path));
    setCheckedRoutes(new Set(allPaths));
  };

  // Check all modals
  const handleCheckAllModals = () => {
    const allIds = modalSections.flatMap(s => s.items.map(m => m.id));
    setCheckedModals(new Set(allIds));
  };

  const checkedCount = checkedRoutes.size;
  const checkedModalCount = checkedModals.size;
  const progress = Math.round((checkedCount / stats.total) * 100);
  const modalProgress = Math.round((checkedModalCount / stats.modalTotal) * 100);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Route & Modal Audit</h1>
              <p className="text-gray-600 mt-1">
                {stats.total} routes + {stats.modalTotal} modals/popups for UI testing
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-red-600 font-medium">
                DELETE THIS PAGE BEFORE PRODUCTION
              </p>
              <code className="text-xs text-gray-500">/route-audit</code>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Audit Progress: {checkedCount}/{stats.total} routes checked ({progress}%)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleCheckAllRoutes}
                  className="px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                >
                  Check All
                </button>
                <button
                  onClick={handleReset}
                  className="px-3 py-1 text-xs font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-xs text-gray-600">Total Routes</div>
            </div>
            <div className="bg-green-50 rounded-xl p-3 text-center border-2 border-green-200">
              <div className="text-2xl font-bold text-green-700">{checkedCount}</div>
              <div className="text-xs text-green-600">Checked</div>
            </div>
            <div className="bg-green-50 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-green-700">{stats.works}</div>
              <div className="text-xs text-green-600">Works</div>
            </div>
            <div className="bg-blue-50 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-blue-700">{stats.partial}</div>
              <div className="text-xs text-blue-600">Partial</div>
            </div>
            <div className="bg-yellow-50 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-yellow-700">{stats.needsBackend}</div>
              <div className="text-xs text-yellow-600">Needs Backend</div>
            </div>
            <div className="bg-gray-100 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-gray-600">{stats.placeholder}</div>
              <div className="text-xs text-gray-500">Placeholder</div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white rounded-2xl border shadow-sm p-4 mb-6">
          <h3 className="font-medium text-gray-900 mb-3">Status Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(statusConfig).map(([key, config]) => (
              <div key={key} className="flex items-start gap-2">
                <StatusBadge status={key} />
                <span className="text-xs text-gray-600">{config.description}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Route Sections */}
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <ExternalLink className="w-5 h-5" />
          Routes ({checkedCount}/{stats.total} checked)
        </h2>
        <div className="space-y-6 mb-8">
          {routeSections.map(section => (
            <SectionCard
              key={section.title}
              section={section}
              checkedRoutes={checkedRoutes}
              onToggle={handleToggle}
              onCheckAll={handleCheckAll}
            />
          ))}
        </div>

        {/* Modal Sections */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-600" />
                Modals, Sheets & Popups
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                {stats.modalTotal} components to test - check the "Trigger" to open each one
              </p>
            </div>
            <button
              onClick={handleCheckAllModals}
              className="px-3 py-1 text-xs font-medium text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded transition-colors"
            >
              Check All Modals
            </button>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">
                  {checkedModalCount}/{stats.modalTotal} modals checked ({modalProgress}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${modalProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 mb-8">
          {modalSections.map(section => (
            <ModalSectionCard
              key={section.title}
              section={section}
              checkedModals={checkedModals}
              onToggle={handleModalToggle}
              onCheckAll={handleModalCheckAll}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Generated for UI audit - The CRNA Club</p>
          <p>Last updated: December 13, 2024</p>
        </div>
      </div>
    </div>
  );
}

export default RouteAuditPage;
