/**
 * Hooks Index
 *
 * Central export file for all custom React hooks.
 * Import hooks from this file for cleaner imports.
 *
 * Example usage:
 * import { useUser, usePrograms, useTrackers } from '@/hooks';
 */

// Core Hooks
export { useUser } from './useUser';
export { usePrograms } from './usePrograms';
export { useTrackers } from './useTrackers';
export { useReactions } from './useReactions';
export { useOnboardingSteps } from './useOnboardingSteps';
export { useOnboardingStatus } from './useOnboardingStatus';

// Access Control Hooks
export { useResourceAccess, useAccess, useEntitlementAccess, useAnyEntitlementAccess } from './useResourceAccess';
export { useProviderStatus } from './useProviderStatus';
export { usePreviewMode, PreviewModeProvider } from './usePreviewMode';
export { useAccessControl } from './useAccessControl';
export { useEntitlements } from './useEntitlements';
export { useUserEntitlements } from './useUserEntitlements';

// Auth Hook
export { useAuth } from './useAuth';

// Admin Hooks
export { useAdminCourseSubmissions } from './useAdminCourseSubmissions';
export { useAdminForums } from './useAdminForums';
export { useAdminReports } from './useAdminReports';
export { useAdminSuspensions } from './useAdminSuspensions';
export { useAdminTopics } from './useAdminTopics';

// Community Hooks
export { useForums } from './useForums';
export { useTopics } from './useTopics';
export { useReplies } from './useReplies';
// Groups hooks removed - not used in MVP
// export { useGroups } from './useGroups';
// export { useGroupMembers } from './useGroupMembers';
// export { useGroupActivity } from './useGroupActivity';
export { useCommunityNotifications } from './useCommunityNotifications';
export { useRecentTopics } from './useRecentTopics';
export { useArchivedForums } from './useArchivedForums';
export { useUserBlocks } from './useUserBlocks';
export { useProfanityWords } from './useProfanityWords';

// Marketplace Hooks
export { useProviders } from './useProviders';
export { useServices } from './useServices';
export { useBookings } from './useBookings';
export { useReviews } from './useReviews';
export { useConversations } from './useConversations';
export { useMessages } from './useMessages';
export { useRecommendedMentors } from './useRecommendedMentors';
export { useCalComAvailability } from './useCalComAvailability';

// Learning Hooks
export { useModules } from './useModules';
export { useLessons } from './useLessons';
export { useCategories } from './useCategories';
export { useDownloads } from './useDownloads';
export { useLessonProgress } from './useLessonProgress';
export { useLessonAccess } from './useLessonAccess';
export { useDownloadAccess } from './useDownloadAccess';

// Gamification Hooks
export { usePoints } from './usePoints';
export { usePointsConfig } from './usePointsConfig';
export { useBadges } from './useBadges';

// Guidance Hooks
export { useGuidanceState } from './useGuidanceState';
export { usePromptState } from './usePromptState';
export { useSmartPrompts } from './useSmartPrompts';

// Feature Hooks
export { useSchools } from './useSchools';
export { useEvents } from './useEvents';
export { useNotifications } from './useNotifications';

// Utility Hooks
export { useWindowSize } from './useWindowSize';
export { usePersistentState } from './usePersistentState';
export { useFileUpload } from './useFileUpload';
export { useImageUpload } from './useImageUpload';
