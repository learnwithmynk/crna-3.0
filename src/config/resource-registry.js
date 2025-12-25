/**
 * Resource Registry
 *
 * Central registry of all protected resources in the application.
 * This defines WHAT exists (pages, features, widgets, tools).
 * The database stores WHO can access them (via accessible_via).
 *
 * Categories:
 * - pages: Full pages with routes
 * - features: Major sections within pages
 * - widgets: Smaller components within features
 * - tools: Standalone tools/utilities
 */

export const RESOURCE_REGISTRY = {
  // ============================================
  // PAGES - Main Routes
  // ============================================
  pages: [
    // Applicant Core
    {
      slug: 'dashboard',
      displayName: 'Dashboard 123',
      route: '/dashboard',
      description: 'Main dashboard with overview of user progress and activity'
    },
    {
      slug: 'my-programs',
      displayName: 'My Programs',
      route: '/my-programs',
      description: 'Saved target programs and comparison tools'
    },
    {
      slug: 'target-program-detail',
      displayName: 'Target Program Detail',
      route: '/my-programs/:programId',
      description: 'Detailed view of a saved target program with checklists'
    },
    {
      slug: 'trackers',
      displayName: 'My Trackers',
      route: '/trackers',
      description: 'Track GPA, clinical hours, shadow days, and more'
    },
    {
      slug: 'my-stats',
      displayName: 'My Stats',
      route: '/my-stats',
      description: 'Comprehensive profile with academic and clinical data'
    },

    // Content & Discovery
    {
      slug: 'school-database',
      displayName: 'School Database',
      route: '/schools',
      description: 'Searchable database of CRNA programs nationwide'
    },
    {
      slug: 'school-profile',
      displayName: 'School Profile',
      route: '/schools/:schoolId',
      description: 'Detailed information about a specific CRNA program'
    },
    {
      slug: 'prerequisite-library',
      displayName: 'Prerequisite Library',
      route: '/prerequisites',
      description: 'Browse and track prerequisite courses for CRNA programs'
    },
    {
      slug: 'learning-library',
      displayName: 'Learning Library',
      route: '/learn',
      description: 'Educational modules and courses'
    },
    {
      slug: 'module-detail',
      displayName: 'Module Detail',
      route: '/learn/:moduleSlug',
      description: 'View a specific learning module with lessons'
    },
    {
      slug: 'lesson',
      displayName: 'Lesson',
      route: '/learn/:moduleSlug/:lessonSlug',
      description: 'Individual lesson content'
    },
    {
      slug: 'events',
      displayName: 'Events',
      route: '/events',
      description: 'Browse CRNA school events, info sessions, and deadlines'
    },

    // Marketplace - Applicant Side
    {
      slug: 'marketplace',
      displayName: 'Marketplace',
      route: '/marketplace',
      description: 'Browse and book mentorship services from SRNAs'
    },
    {
      slug: 'mentor-profile',
      displayName: 'Mentor Profile',
      route: '/marketplace/mentor/:mentorId',
      description: 'View mentor details and available services'
    },
    {
      slug: 'mentor-reviews',
      displayName: 'Mentor Reviews',
      route: '/marketplace/mentor/:mentorId/reviews',
      description: 'All reviews for a specific mentor'
    },
    {
      slug: 'booking',
      displayName: 'Booking',
      route: '/marketplace/book/:serviceId',
      description: 'Book a mentorship service'
    },
    {
      slug: 'my-bookings',
      displayName: 'My Bookings',
      route: '/marketplace/my-bookings',
      description: 'View all bookings (past, upcoming, cancelled)'
    },
    {
      slug: 'booking-detail',
      displayName: 'Booking Detail',
      route: '/marketplace/bookings/:bookingId',
      description: 'View details of a specific booking'
    },
    {
      slug: 'session-room',
      displayName: 'Session Room',
      route: '/marketplace/bookings/:bookingId/join',
      description: 'Join a live mentorship session'
    },
    {
      slug: 'leave-review',
      displayName: 'Leave Review',
      route: '/marketplace/bookings/:bookingId/review',
      description: 'Leave a review after a completed session'
    },

    // Marketplace - Provider Side
    {
      slug: 'become-mentor-landing',
      displayName: 'Become a Mentor',
      route: '/marketplace/become-a-mentor',
      description: 'Information about becoming a marketplace mentor'
    },
    {
      slug: 'provider-application',
      displayName: 'Provider Application',
      route: '/marketplace/provider/apply',
      description: 'Apply to become a marketplace provider'
    },
    {
      slug: 'application-status',
      displayName: 'Application Status',
      route: '/marketplace/provider/application-status',
      description: 'Check status of provider application'
    },
    {
      slug: 'provider-onboarding',
      displayName: 'Provider Onboarding',
      route: '/marketplace/provider/onboarding',
      description: 'Onboarding flow for approved providers'
    },
    {
      slug: 'provider-dashboard',
      displayName: 'Provider Dashboard',
      route: '/marketplace/provider/dashboard',
      description: 'Provider overview with earnings and booking stats'
    },
    {
      slug: 'provider-requests',
      displayName: 'Provider Requests',
      route: '/marketplace/provider/requests',
      description: 'Manage incoming booking requests'
    },
    {
      slug: 'provider-bookings',
      displayName: 'Provider Bookings',
      route: '/marketplace/provider/bookings',
      description: 'View all provider bookings'
    },
    {
      slug: 'provider-leave-review',
      displayName: 'Provider Leave Review',
      route: '/marketplace/provider/bookings/:id/review',
      description: 'Leave a review for an applicant (provider perspective)'
    },
    {
      slug: 'provider-services',
      displayName: 'Provider Services',
      route: '/marketplace/provider/services',
      description: 'Manage offered services and pricing'
    },
    {
      slug: 'provider-availability',
      displayName: 'Provider Availability',
      route: '/marketplace/provider/availability',
      description: 'Set availability calendar'
    },
    {
      slug: 'provider-earnings',
      displayName: 'Provider Earnings',
      route: '/marketplace/provider/earnings',
      description: 'View earnings and payout history'
    },
    {
      slug: 'provider-profile',
      displayName: 'Provider Profile',
      route: '/marketplace/provider/profile',
      description: 'Edit provider profile and bio'
    },
    {
      slug: 'provider-insights',
      displayName: 'Provider Insights',
      route: '/marketplace/provider/insights',
      description: 'Analytics and performance insights'
    },
    {
      slug: 'mentor-resources',
      displayName: 'Mentor Resources',
      route: '/marketplace/provider/resources',
      description: 'Resources and guides for mentors'
    },

    // Community
    {
      slug: 'community-forums',
      displayName: 'Forums',
      route: '/community/forums',
      description: 'Community discussion forums'
    },
    {
      slug: 'forum-topics',
      displayName: 'Forum Topics',
      route: '/community/forums/:forumId',
      description: 'Topics within a specific forum'
    },
    {
      slug: 'topic-detail',
      displayName: 'Topic Detail',
      route: '/community/forums/:forumId/:topicId',
      description: 'View and reply to a forum topic'
    },
    {
      slug: 'community-groups',
      displayName: 'Groups',
      route: '/community/groups',
      description: 'Community groups (future feature)'
    },
    {
      slug: 'group-detail',
      displayName: 'Group Detail',
      route: '/community/groups/:groupId',
      description: 'View a specific group'
    },
    {
      slug: 'messages',
      displayName: 'Messages',
      route: '/messages',
      description: 'Direct messages with other members'
    },

    // Tools
    {
      slug: 'tools',
      displayName: 'Tools',
      route: '/tools',
      description: 'Collection of CRNA application tools'
    },

    // Account
    {
      slug: 'settings',
      displayName: 'Settings',
      route: '/settings',
      description: 'Account settings and preferences'
    },
    {
      slug: 'notification-settings',
      displayName: 'Notification Settings',
      route: '/settings/notifications',
      description: 'Configure notification preferences'
    },
    {
      slug: 'my-purchases',
      displayName: 'My Purchases',
      route: '/my-purchases',
      description: 'View purchased toolkits and products'
    },
    {
      slug: 'notifications',
      displayName: 'Notifications',
      route: '/notifications',
      description: 'View all notifications'
    },

    // Admin Routes
    {
      slug: 'admin-dashboard',
      displayName: 'Admin Dashboard',
      route: '/admin',
      description: 'Admin overview and quick actions'
    },
    {
      slug: 'admin-modules',
      displayName: 'Admin Modules',
      route: '/admin/modules',
      description: 'Manage learning modules'
    },
    {
      slug: 'admin-module-edit',
      displayName: 'Admin Module Edit',
      route: '/admin/modules/:moduleId',
      description: 'Edit a learning module'
    },
    {
      slug: 'admin-lesson-edit',
      displayName: 'Admin Lesson Edit',
      route: '/admin/lessons/:lessonId',
      description: 'Edit a lesson'
    },
    {
      slug: 'admin-downloads',
      displayName: 'Admin Downloads',
      route: '/admin/downloads',
      description: 'Manage digital downloads'
    },
    {
      slug: 'admin-download-edit',
      displayName: 'Admin Download Edit',
      route: '/admin/downloads/:downloadId',
      description: 'Edit a download'
    },
    {
      slug: 'admin-categories',
      displayName: 'Admin Categories',
      route: '/admin/categories',
      description: 'Manage content categories'
    },
    {
      slug: 'admin-entitlements',
      displayName: 'Admin Entitlements',
      route: '/admin/entitlements',
      description: 'Manage access entitlements'
    },
    {
      slug: 'admin-points',
      displayName: 'Admin Points Config',
      route: '/admin/points',
      description: 'Configure gamification points'
    },
    {
      slug: 'admin-marketplace',
      displayName: 'Admin Marketplace',
      route: '/admin/marketplace',
      description: 'Marketplace admin dashboard'
    },
    {
      slug: 'admin-marketplace-providers',
      displayName: 'Admin Providers',
      route: '/admin/marketplace/providers',
      description: 'Manage marketplace providers'
    },
    {
      slug: 'admin-marketplace-bookings',
      displayName: 'Admin Bookings',
      route: '/admin/marketplace/bookings',
      description: 'View and manage all bookings'
    },
    {
      slug: 'admin-marketplace-disputes',
      displayName: 'Admin Disputes',
      route: '/admin/marketplace/disputes',
      description: 'Handle booking disputes'
    },
    {
      slug: 'admin-marketplace-quality',
      displayName: 'Admin Quality',
      route: '/admin/marketplace/quality',
      description: 'Review quality metrics and flags'
    },
    {
      slug: 'admin-community',
      displayName: 'Admin Community',
      route: '/admin/community',
      description: 'Community moderation dashboard'
    },
    {
      slug: 'admin-community-reports',
      displayName: 'Admin Community Reports',
      route: '/admin/community/reports',
      description: 'Review reported content'
    },
    {
      slug: 'admin-suspensions',
      displayName: 'Admin Suspensions',
      route: '/admin/community/suspensions',
      description: 'Manage user suspensions'
    },
    {
      slug: 'admin-user-reports',
      displayName: 'Admin User Reports',
      route: '/admin/user-reports',
      description: 'School error reports and event suggestions'
    },
    {
      slug: 'admin-prerequisite-courses',
      displayName: 'Admin Prerequisite Courses',
      route: '/admin/prerequisite-courses',
      description: 'Manage prerequisite course database'
    },
  ],

  // ============================================
  // FEATURES - Major sections within pages
  // ============================================
  features: [
    // Dashboard Features
    {
      slug: 'dashboard-ai-tips',
      displayName: 'Dashboard AI Tips',
      parent: 'dashboard',
      description: 'AI-powered personalized guidance on dashboard'
    },
    {
      slug: 'dashboard-readyscore',
      displayName: 'ReadyScore Widget',
      parent: 'dashboard',
      description: 'Application readiness score'
    },
    {
      slug: 'dashboard-quick-actions',
      displayName: 'Quick Actions',
      parent: 'dashboard',
      description: 'Frequently used action buttons'
    },

    // School Database Features
    {
      slug: 'school-ai-insights',
      displayName: 'School AI Insights',
      parent: 'school-profile',
      description: 'AI-generated insights about program compatibility'
    },
    {
      slug: 'school-comparison',
      displayName: 'School Comparison',
      parent: 'school-database',
      description: 'Side-by-side school comparison tool'
    },
    {
      slug: 'school-save',
      displayName: 'Save School',
      parent: 'school-database',
      description: 'Save schools to My Programs list'
    },

    // My Programs Features
    {
      slug: 'program-checklist',
      displayName: 'Program Checklist',
      parent: 'target-program-detail',
      description: 'Dynamic checklist for program requirements'
    },
    {
      slug: 'program-notes',
      displayName: 'Program Notes',
      parent: 'target-program-detail',
      description: 'Personal notes for saved programs'
    },

    // My Stats Features
    {
      slug: 'stats-ai-analysis',
      displayName: 'Stats AI Analysis',
      parent: 'my-stats',
      description: 'AI analysis of competitiveness'
    },
    {
      slug: 'stats-export',
      displayName: 'Stats Export',
      parent: 'my-stats',
      description: 'Export stats to PDF or spreadsheet'
    },

    // Marketplace Features
    {
      slug: 'mentor-messaging',
      displayName: 'Mentor Messaging',
      parent: 'marketplace',
      description: 'Direct messaging with mentors'
    },
    {
      slug: 'booking-calendar',
      displayName: 'Booking Calendar',
      parent: 'booking',
      description: 'Calendar for scheduling sessions'
    },
  ],

  // ============================================
  // WIDGETS - Smaller components
  // ============================================
  widgets: [
    {
      slug: 'gpa-calculator',
      displayName: 'GPA Calculator',
      parent: 'trackers',
      description: 'Calculate GPA from transcript data'
    },
    {
      slug: 'readyscore-badge',
      displayName: 'ReadyScore Badge',
      parent: 'dashboard-readyscore',
      description: 'Visual badge showing readiness score'
    },
    {
      slug: 'progress-charts',
      displayName: 'Progress Charts',
      parent: 'dashboard',
      description: 'Visual charts of user progress'
    },
  ],

  // ============================================
  // TOOLS - Standalone utilities
  // ============================================
  tools: [
    {
      slug: 'transcript-analyzer',
      displayName: 'Transcript Analyzer',
      parent: 'tools',
      description: 'Upload and analyze transcripts for GPA calculation'
    },
    {
      slug: 'timeline-generator',
      displayName: 'Timeline Generator',
      parent: 'tools',
      description: 'Generate personalized application timeline'
    },
    {
      slug: 'mock-interview',
      displayName: 'Mock Interview',
      parent: 'tools',
      description: 'Practice interview questions with feedback'
    },
    {
      slug: 'financial-planner',
      displayName: 'Financial Planner',
      parent: 'tools',
      description: 'Plan finances for CRNA school'
    },
  ],
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get all resources across all categories
 * @returns {Array} All resources with category metadata
 */
export function getAllResources() {
  const resources = [];

  for (const [category, items] of Object.entries(RESOURCE_REGISTRY)) {
    items.forEach(item => {
      resources.push({
        ...item,
        category,
      });
    });
  }

  return resources;
}

/**
 * Get a resource by its slug
 * @param {string} slug - Resource slug
 * @returns {Object|null} Resource object or null if not found
 */
export function getResourceBySlug(slug) {
  const allResources = getAllResources();
  return allResources.find(r => r.slug === slug) || null;
}

/**
 * Get all resources that have a specific parent
 * @param {string} parentSlug - Parent resource slug
 * @returns {Array} Child resources
 */
export function getChildResources(parentSlug) {
  const allResources = getAllResources();
  return allResources.filter(r => r.parent === parentSlug);
}

/**
 * Get all pages (resources with routes)
 * @returns {Array} Page resources
 */
export function getAllPages() {
  return RESOURCE_REGISTRY.pages;
}

/**
 * Get all features
 * @returns {Array} Feature resources
 */
export function getAllFeatures() {
  return RESOURCE_REGISTRY.features;
}

/**
 * Get all widgets
 * @returns {Array} Widget resources
 */
export function getAllWidgets() {
  return RESOURCE_REGISTRY.widgets;
}

/**
 * Get all tools
 * @returns {Array} Tool resources
 */
export function getAllTools() {
  return RESOURCE_REGISTRY.tools;
}

/**
 * Validate resource registry (useful for tests)
 * @returns {Object} Validation results
 */
export function validateRegistry() {
  const errors = [];
  const allResources = getAllResources();
  const slugs = new Set();

  allResources.forEach(resource => {
    // Check for duplicate slugs
    if (slugs.has(resource.slug)) {
      errors.push(`Duplicate slug: ${resource.slug}`);
    }
    slugs.add(resource.slug);

    // Check required fields
    if (!resource.slug) {
      errors.push(`Resource missing slug: ${JSON.stringify(resource)}`);
    }
    if (!resource.displayName) {
      errors.push(`Resource missing displayName: ${resource.slug}`);
    }

    // Check parent exists (if specified)
    if (resource.parent && !getResourceBySlug(resource.parent)) {
      errors.push(`Resource ${resource.slug} has invalid parent: ${resource.parent}`);
    }

    // Check pages have routes
    if (resource.category === 'pages' && !resource.route) {
      errors.push(`Page ${resource.slug} missing route`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    totalResources: allResources.length,
    byCategory: {
      pages: RESOURCE_REGISTRY.pages.length,
      features: RESOURCE_REGISTRY.features.length,
      widgets: RESOURCE_REGISTRY.widgets.length,
      tools: RESOURCE_REGISTRY.tools.length,
    },
  };
}
