/**
 * RequestCard Example Usage
 *
 * Demonstrates the RequestCard component with mock data
 */

import { RequestCard } from './RequestCard';

// Mock request data
const mockRequest = {
  id: 'req_001',
  requestDate: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
  applicant: {
    name: 'Sarah Johnson',
    avatar: null, // Will show initials fallback
    targetPrograms: [
      'Duke University',
      'University of Pittsburgh',
      'Rush University',
      'Columbia University',
    ],
    icuExperience: {
      type: 'CVICU',
      years: 3,
    },
    gpa: '3.85',
    stage: 'Actively applying',
    previousSessionsCount: 2,
  },
  service: {
    name: 'Mock Interview - Program Specific',
    type: 'mock-interview',
    duration: 60,
    price: 100,
    platformFee: 0.2,
  },
  preferredTimes: [
    'Monday, Dec 16 at 6:00 PM EST',
    'Tuesday, Dec 17 at 7:00 PM EST',
    'Wednesday, Dec 18 at 5:30 PM EST',
  ],
  message: `Hi! I have my Duke interview coming up in 2 weeks and I'm really nervous. I'd love to practice with someone who knows the program well.

I've already had 2 sessions with you for essay review and they were incredibly helpful. Would love your help again!`,
  materials: [
    {
      name: 'Personal_Statement_Draft_v3.pdf',
      size: 245000,
      url: '#',
    },
    {
      name: 'Duke_Research.docx',
      size: 89000,
      url: '#',
    },
  ],
  intakeInfo: {
    interviewType: 'Program Specific',
    targetSchool: 'Duke University',
    interviewDate: 'December 30, 2024',
    specificConcerns: 'Panel format, clinical scenarios',
  },
};

// Mock request with urgency (2 hours left)
const urgentRequest = {
  ...mockRequest,
  id: 'req_002',
  requestDate: new Date(Date.now() - 46 * 60 * 60 * 1000).toISOString(), // 46 hours ago
  applicant: {
    ...mockRequest.applicant,
    name: 'Michael Chen',
    previousSessionsCount: 0,
  },
};

// Mock request - essay review
const essayRequest = {
  id: 'req_003',
  requestDate: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
  applicant: {
    name: 'Emily Rodriguez',
    avatar: null,
    targetPrograms: ['Boston College', 'Northeastern University', 'Yale University'],
    icuExperience: {
      type: 'SICU',
      years: 2.5,
    },
    gpa: '3.92',
    stage: 'Plan & Apply',
    previousSessionsCount: 1,
  },
  service: {
    name: 'Personal Statement Review',
    type: 'essay-review',
    duration: 45,
    price: 75,
    platformFee: 0.2,
  },
  preferredTimes: ['Any time this week'],
  message: `I've been working on my personal statement for the past month and would love a fresh set of eyes. I'm particularly struggling with how to tie my ICU experience to my interest in anesthesia.`,
  materials: [
    {
      name: 'Personal_Statement_v5.pdf',
      size: 156000,
      url: '#',
    },
  ],
  intakeInfo: {
    essayType: 'Personal Statement',
    wordCount: '850',
    specificFeedback: 'Flow, clinical examples, motivation',
  },
};

function RequestCardExample() {
  const handleAccept = (request) => {
    console.log('Accept request:', request.id);
    alert(`Accepting request ${request.id}`);
  };

  const handleDecline = (request) => {
    console.log('Decline request:', request.id);
    alert(`Declining request ${request.id}`);
  };

  const handleProposeAlternative = (request) => {
    console.log('Propose alternative:', request.id);
    alert(`Proposing alternative for request ${request.id}`);
  };

  return (
    <div className="p-8 space-y-6 bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">RequestCard Examples</h1>
        <p className="text-gray-600">
          Different states and scenarios for booking request cards
        </p>
      </div>

      <div className="space-y-6 max-w-4xl">
        {/* Standard Request */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Standard Request (43h left)
          </h2>
          <RequestCard
            request={mockRequest}
            onAccept={handleAccept}
            onDecline={handleDecline}
            onProposeAlternative={handleProposeAlternative}
          />
        </div>

        {/* Urgent Request */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Urgent Request (2h left - Critical)
          </h2>
          <RequestCard
            request={urgentRequest}
            onAccept={handleAccept}
            onDecline={handleDecline}
            onProposeAlternative={handleProposeAlternative}
          />
        </div>

        {/* Essay Review Request */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Essay Review Request (36h left)
          </h2>
          <RequestCard
            request={essayRequest}
            onAccept={handleAccept}
            onDecline={handleDecline}
            onProposeAlternative={handleProposeAlternative}
          />
        </div>
      </div>
    </div>
  );
}

export default RequestCardExample;
