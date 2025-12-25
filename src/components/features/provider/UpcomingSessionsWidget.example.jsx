/**
 * UpcomingSessionsWidget - Usage Examples
 *
 * This file demonstrates how to use the UpcomingSessionsWidget component
 * in different scenarios.
 */

import { UpcomingSessionsWidget } from './UpcomingSessionsWidget';

// ============================================================================
// EXAMPLE 1: Basic Usage with Mock Data
// ============================================================================

export function Example1_BasicUsage() {
  const sessions = [
    {
      id: 'session-1',
      applicantName: 'Sarah Johnson',
      applicantAvatar: null,
      service: 'Mock Interview',
      scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      videoLink: 'https://zoom.us/j/123456789',
      duration: 60,
    },
    {
      id: 'session-2',
      applicantName: 'Michael Chen',
      applicantAvatar: 'https://i.pravatar.cc/150?img=12',
      service: 'Essay Review Session',
      scheduledAt: new Date(Date.now() + 26 * 60 * 60 * 1000), // Tomorrow
      videoLink: 'https://zoom.us/j/987654321',
      duration: 30,
    },
  ];

  const handleJoinVideo = (sessionId) => {
    // Open video link in new window
    const session = sessions.find((s) => s.id === sessionId);
    if (session?.videoLink) {
      window.open(session.videoLink, '_blank');
    }
  };

  return (
    <UpcomingSessionsWidget sessions={sessions} onJoinVideo={handleJoinVideo} />
  );
}

// ============================================================================
// EXAMPLE 2: Empty State (No Sessions)
// ============================================================================

export function Example2_EmptyState() {
  return <UpcomingSessionsWidget sessions={[]} />;
}

// ============================================================================
// EXAMPLE 3: Provider Dashboard Integration
// ============================================================================

export function Example3_DashboardIntegration() {
  // In a real app, fetch from API
  const { sessions, isLoading } = useSessions(); // Hypothetical hook

  const handleJoinVideo = async (sessionId) => {
    // Track analytics
    analytics.track('Provider Joined Session', { sessionId });

    // Navigate to video session
    const session = sessions.find((s) => s.id === sessionId);
    if (session?.videoLink) {
      window.open(session.videoLink, '_blank');
    }
  };

  if (isLoading) {
    return <UpcomingSessionsWidgetSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <UpcomingSessionsWidget
        sessions={sessions}
        onJoinVideo={handleJoinVideo}
      />
      {/* Other dashboard widgets */}
    </div>
  );
}

// ============================================================================
// EXAMPLE 4: Real-time Updates
// ============================================================================

export function Example4_RealtimeUpdates() {
  const [sessions, setSessions] = useState([]);

  // Poll for updates every 30 seconds
  useEffect(() => {
    const fetchSessions = async () => {
      const data = await api.getSessions();
      setSessions(data);
    };

    fetchSessions();
    const interval = setInterval(fetchSessions, 30000);

    return () => clearInterval(interval);
  }, []);

  return <UpcomingSessionsWidget sessions={sessions} />;
}

// ============================================================================
// EXAMPLE 5: With Custom Styling
// ============================================================================

export function Example5_CustomStyling() {
  return (
    <UpcomingSessionsWidget
      sessions={mockSessions}
      className="shadow-lg border-2 border-purple-200"
    />
  );
}

// ============================================================================
// MOCK DATA STRUCTURES
// ============================================================================

/**
 * Session Object Structure
 *
 * @typedef {Object} Session
 * @property {string} id - Unique session identifier
 * @property {string} applicantName - Full name of the applicant
 * @property {string|null} applicantAvatar - URL to applicant's avatar image (optional)
 * @property {string} service - Name of the service being provided
 * @property {Date|string} scheduledAt - When the session is scheduled to start
 * @property {string} videoLink - URL to join the video session (Zoom, Google Meet, etc.)
 * @property {number} duration - Session duration in minutes
 */

const mockSessions = [
  {
    id: 'session-1',
    applicantName: 'Jane Smith',
    applicantAvatar: null,
    service: 'Mock Interview',
    scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
    videoLink: 'https://zoom.us/j/123456789',
    duration: 60,
  },
];

// ============================================================================
// LOADING SKELETON (Optional Enhancement)
// ============================================================================

function UpcomingSessionsWidgetSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="animate-pulse">
        <div className="h-5 w-48 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-3 p-3">
              <div className="w-10 h-10 rounded-full bg-gray-200"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
                <div className="h-3 w-24 bg-gray-200 rounded"></div>
                <div className="h-3 w-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
