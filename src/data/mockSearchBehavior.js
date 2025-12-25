/**
 * Mock Search Behavior (Category 5 Data)
 *
 * Implicit preferences inferred from user behavior.
 * Powers "Similar users also viewed", recommendations, and personalization.
 *
 * TODO: Replace with analytics tracking and Supabase user_behavior table
 */

// =============================================================================
// MOCK SEARCH BEHAVIOR DATA
// =============================================================================

export const mockSearchBehavior = {
  userId: 'user_001',

  // Programs the user has viewed (with engagement metrics)
  programsViewed: [
    {
      programId: 'school_001',
      schoolName: 'Georgetown University',
      viewedAt: '2024-11-28T14:30:00Z',
      dwellTimeMs: 180000, // 3 minutes
      sectionsViewed: ['overview', 'requirements', 'tuition', 'deadlines'],
    },
    {
      programId: 'school_002',
      schoolName: 'Cedar Crest College',
      viewedAt: '2024-11-27T10:15:00Z',
      dwellTimeMs: 120000, // 2 minutes
      sectionsViewed: ['overview', 'requirements'],
    },
    {
      programId: 'school_005',
      schoolName: 'University of Pittsburgh',
      viewedAt: '2024-11-26T16:45:00Z',
      dwellTimeMs: 240000, // 4 minutes
      sectionsViewed: ['overview', 'requirements', 'tuition', 'deadlines', 'clinical_sites'],
    },
    {
      programId: 'school_006',
      schoolName: 'Duke University',
      viewedAt: '2024-11-25T09:00:00Z',
      dwellTimeMs: 90000, // 1.5 minutes
      sectionsViewed: ['overview', 'tuition'],
    },
    {
      programId: 'school_008',
      schoolName: 'Columbia University',
      viewedAt: '2024-11-24T11:30:00Z',
      dwellTimeMs: 60000, // 1 minute
      sectionsViewed: ['overview'],
    },
  ],

  // Programs compared side-by-side
  programsCompared: [
    {
      programIds: ['school_001', 'school_005'],
      comparedAt: '2024-11-26T17:00:00Z',
    },
    {
      programIds: ['school_002', 'school_003', 'school_007'],
      comparedAt: '2024-11-20T14:00:00Z',
    },
  ],

  // Search queries performed
  searchQueries: [
    {
      query: 'no GRE required',
      filters: { gre: 'not_required' },
      resultsCount: 45,
      timestamp: '2024-11-28T14:00:00Z',
    },
    {
      query: 'Pennsylvania programs',
      filters: { state: 'PA' },
      resultsCount: 8,
      timestamp: '2024-11-27T10:00:00Z',
    },
    {
      query: '',
      filters: { maxTuition: 100000, region: 'northeast' },
      resultsCount: 22,
      timestamp: '2024-11-25T08:30:00Z',
    },
  ],

  // Filter usage counts (for preference inference)
  filtersUsed: {
    gre: 8,
    tuition: 5,
    state: 12,
    region: 3,
    degree: 2,
    programType: 1,
    deadline: 4,
    classSize: 0,
  },

  // Most recent sort preference
  sortPreference: 'deadline',

  // Resources downloaded
  downloadedResources: [
    {
      resourceId: 'guide_001',
      resourceType: 'pdf',
      resourceName: 'CRNA Application Timeline Guide',
      timestamp: '2024-11-20T15:00:00Z',
    },
    {
      resourceId: 'template_001',
      resourceType: 'docx',
      resourceName: 'Personal Statement Template',
      timestamp: '2024-11-15T10:00:00Z',
    },
  ],

  // Deadline clicks (signals urgency awareness)
  clickedDeadlines: [
    { programId: 'school_001', timestamp: '2024-11-28T14:35:00Z' },
    { programId: 'school_005', timestamp: '2024-11-26T16:50:00Z' },
  ],

  // Aggregate engagement metrics
  timeOnSchoolDatabase: 3600, // 1 hour total
  searchSessionCount: 12,
  lastSearchAt: '2024-11-28T14:30:00Z',

  // Inferred preferences (computed from behavior)
  inferredPreferences: {
    preferNoGre: true, // Based on 8 GRE filter uses
    budgetSensitive: true, // Based on 5 tuition filter uses
    focusStates: ['PA', 'NY'], // Based on search patterns
    urgencyAware: true, // Based on deadline clicks
  },
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get recently viewed programs (last 7 days)
 */
export function getRecentlyViewed(behavior = mockSearchBehavior, daysBack = 7) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - daysBack);

  return behavior.programsViewed
    .filter((view) => new Date(view.viewedAt) > cutoff)
    .sort((a, b) => new Date(b.viewedAt) - new Date(a.viewedAt));
}

/**
 * Get programs with high engagement (dwell time > 2 minutes)
 */
export function getHighEngagementPrograms(behavior = mockSearchBehavior) {
  return behavior.programsViewed
    .filter((view) => view.dwellTimeMs > 120000)
    .sort((a, b) => b.dwellTimeMs - a.dwellTimeMs);
}

/**
 * Get most-used filters (for preference inference)
 */
export function getTopFilters(behavior = mockSearchBehavior, limit = 3) {
  return Object.entries(behavior.filtersUsed)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([filter, count]) => ({ filter, count }));
}

/**
 * Check if user has viewed a specific program
 */
export function hasViewedProgram(programId, behavior = mockSearchBehavior) {
  return behavior.programsViewed.some((view) => view.programId === programId);
}

/**
 * Get view count for a program
 */
export function getProgramViewCount(programId, behavior = mockSearchBehavior) {
  return behavior.programsViewed.filter((view) => view.programId === programId).length;
}

/**
 * Suggest "Continue researching" programs
 * Programs viewed multiple times or with high dwell time but not saved
 */
export function getContinueResearchingSuggestions(
  behavior = mockSearchBehavior,
  savedProgramIds = []
) {
  const viewCounts = {};
  behavior.programsViewed.forEach((view) => {
    viewCounts[view.programId] = (viewCounts[view.programId] || 0) + 1;
  });

  return Object.entries(viewCounts)
    .filter(([programId]) => !savedProgramIds.includes(programId))
    .filter(([, count]) => count >= 2)
    .map(([programId, count]) => {
      const lastView = behavior.programsViewed
        .filter((v) => v.programId === programId)
        .sort((a, b) => new Date(b.viewedAt) - new Date(a.viewedAt))[0];
      return {
        programId,
        viewCount: count,
        lastViewedAt: lastView.viewedAt,
        schoolName: lastView.schoolName,
      };
    })
    .sort((a, b) => b.viewCount - a.viewCount);
}

/**
 * Infer preferences from behavior patterns
 */
export function inferPreferencesFromBehavior(behavior = mockSearchBehavior) {
  const inferred = {
    preferNoGre: behavior.filtersUsed.gre >= 3,
    budgetSensitive: behavior.filtersUsed.tuition >= 3,
    deadlineConscious: behavior.clickedDeadlines.length >= 2,
    activeResearcher: behavior.searchSessionCount >= 5,
    focusedStates: [],
  };

  // Extract state preferences from search queries
  const stateFilters = behavior.searchQueries
    .filter((q) => q.filters?.state)
    .map((q) => q.filters.state);
  inferred.focusedStates = [...new Set(stateFilters)];

  return inferred;
}

/**
 * Get search history for display
 */
export function getSearchHistory(behavior = mockSearchBehavior, limit = 5) {
  return behavior.searchQueries.slice(0, limit).map((query) => ({
    query: query.query || 'Filter search',
    filters: query.filters,
    resultsCount: query.resultsCount,
    timestamp: query.timestamp,
  }));
}

export default mockSearchBehavior;
