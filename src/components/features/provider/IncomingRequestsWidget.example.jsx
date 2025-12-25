/**
 * IncomingRequestsWidget Example
 *
 * Demonstrates the IncomingRequestsWidget component with various states:
 * - With pending requests (showing countdown timers)
 * - Empty state (no requests)
 * - Different urgency levels (green, orange, red timers)
 */

import { IncomingRequestsWidget } from './IncomingRequestsWidget';

// Example requests with different time urgencies
const exampleRequests = [
  {
    id: 'req-1',
    applicantName: 'Sarah M.',
    applicantAvatar: null,
    service: 'Mock Interview',
    price: 100,
    submittedAt: new Date(Date.now() - 20 * 60 * 60 * 1000), // 20 hours ago (green - >24h remaining)
    preferredTimes: ['Mon 2pm', 'Tue 10am']
  },
  {
    id: 'req-2',
    applicantName: 'Jennifer K.',
    applicantAvatar: null,
    service: 'Essay Review',
    price: 75,
    submittedAt: new Date(Date.now() - 40 * 60 * 60 * 1000), // 40 hours ago (red - <12h remaining)
    preferredTimes: ['Wed 1pm', 'Thu 3pm']
  },
  {
    id: 'req-3',
    applicantName: 'Rachel T.',
    applicantAvatar: null,
    service: '1:1 Coaching Session',
    price: 150,
    submittedAt: new Date(Date.now() - 32 * 60 * 60 * 1000), // 32 hours ago (orange - 12-24h remaining)
    preferredTimes: ['Fri 10am', 'Sat 2pm']
  },
  {
    id: 'req-4',
    applicantName: 'Michelle B.',
    applicantAvatar: null,
    service: 'Application Review',
    price: 125,
    submittedAt: new Date(Date.now() - 15 * 60 * 60 * 1000), // 15 hours ago (green)
    preferredTimes: ['Mon 4pm', 'Tue 2pm']
  }
];

export default function IncomingRequestsWidgetExample() {
  const handleAccept = (requestId) => {
    console.log('Accepting request:', requestId);
    alert(`Request ${requestId} accepted! Would navigate to scheduling page.`);
  };

  const handleDecline = (requestId) => {
    console.log('Declining request:', requestId);
    const confirmed = confirm('Are you sure you want to decline this request?');
    if (confirmed) {
      alert(`Request ${requestId} declined.`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">IncomingRequestsWidget Examples</h1>
          <p className="text-gray-600">
            Provider dashboard widget showing pending booking requests with countdown timers
          </p>
        </div>

        {/* Example 1: With Requests */}
        <div>
          <h2 className="text-xl font-semibold mb-4">With Pending Requests</h2>
          <p className="text-sm text-gray-600 mb-4">
            Shows first 3 requests with countdown timers. Timer colors indicate urgency:
            Green (&gt;24h), Orange (12-24h), Red (&lt;12h)
          </p>
          <IncomingRequestsWidget
            requests={exampleRequests}
            onAccept={handleAccept}
            onDecline={handleDecline}
          />
        </div>

        {/* Example 2: Empty State */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Empty State</h2>
          <p className="text-sm text-gray-600 mb-4">
            Shown when provider has no pending requests
          </p>
          <IncomingRequestsWidget
            requests={[]}
            onAccept={handleAccept}
            onDecline={handleDecline}
          />
        </div>

        {/* Example 3: Single Request */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Single Request</h2>
          <p className="text-sm text-gray-600 mb-4">
            With only one request (no "View All" link shown)
          </p>
          <IncomingRequestsWidget
            requests={[exampleRequests[0]]}
            onAccept={handleAccept}
            onDecline={handleDecline}
          />
        </div>

        {/* Implementation Notes */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Implementation Notes</h2>
          <div className="space-y-3 text-sm text-gray-700">
            <div>
              <strong className="text-gray-900">Countdown Timer:</strong>
              <p>Updates every minute. 48-hour response deadline from submission time.</p>
            </div>
            <div>
              <strong className="text-gray-900">Timer Colors:</strong>
              <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                <li className="text-green-600">Green: &gt; 24 hours remaining</li>
                <li className="text-orange-500">Orange: 12-24 hours remaining</li>
                <li className="text-red-600">Red: &lt; 12 hours remaining</li>
              </ul>
            </div>
            <div>
              <strong className="text-gray-900">Commission:</strong>
              <p>Shows "You'll earn $X" (80% of price after 20% commission)</p>
            </div>
            <div>
              <strong className="text-gray-900">Props:</strong>
              <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                <li><code>requests</code>: array of request objects</li>
                <li><code>onAccept</code>: function(requestId) - handle accept action</li>
                <li><code>onDecline</code>: function(requestId) - handle decline action</li>
                <li><code>className</code>: optional additional CSS classes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
