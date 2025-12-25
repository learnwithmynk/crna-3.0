/**
 * ProviderBookingCard Examples
 *
 * Demonstrates different states of the ProviderBookingCard component
 */

import { ProviderBookingCard } from './ProviderBookingCard';

// Example 1: Pending Acceptance
const pendingBooking = {
  id: '1',
  status: 'pending_acceptance',
  scheduledAt: '2024-12-20T14:00:00Z',
  applicant: {
    id: 'app123',
    name: 'Sarah Johnson',
    avatarUrl: null,
    currentStage: 'interviewing',
    targetPrograms: ['Georgetown University', 'Duke University', 'Johns Hopkins'],
  },
  service: {
    title: 'Mock Interview Prep',
    durationMinutes: 60,
    isLive: true,
  },
  amountPaid: 125,
  providerPayout: 100,
  applicantNotes: 'I have my Georgetown interview coming up in 2 weeks. Would love to practice answering common questions and get feedback on my responses.',
  materials: [],
};

// Example 2: Upcoming Session with Materials
const upcomingBooking = {
  id: '2',
  status: 'confirmed',
  scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
  applicant: {
    id: 'app456',
    name: 'Michael Chen',
    avatarUrl: '/avatars/michael.jpg',
    currentStage: 'applying',
    targetPrograms: ['Stanford', 'UCSF'],
  },
  service: {
    title: 'Personal Statement Review',
    durationMinutes: 45,
    isLive: false,
  },
  amountPaid: 85,
  providerPayout: 68,
  applicantNotes: 'This is my final draft. Looking for any grammatical errors and overall flow.',
  materials: [
    {
      id: 'm1',
      filename: 'personal-statement-draft3.docx',
      url: '/uploads/personal-statement.docx',
    },
    {
      id: 'm2',
      filename: 'resume.pdf',
      url: '/uploads/resume.pdf',
    },
  ],
  videoLink: 'https://zoom.us/j/123456789',
};

// Example 3: Session Starting Soon
const soonBooking = {
  id: '3',
  status: 'confirmed',
  scheduledAt: new Date(Date.now() + 3 * 60 * 1000).toISOString(), // 3 minutes from now
  applicant: {
    id: 'app789',
    name: 'Emily Rodriguez',
    avatarUrl: '/avatars/emily.jpg',
    currentStage: 'interviewing',
  },
  service: {
    title: 'Strategy Session',
    durationMinutes: 30,
    isLive: true,
  },
  amountPaid: 75,
  providerPayout: 60,
  applicantNotes: 'Need help deciding between three programs I got accepted to.',
  materials: [],
  videoLink: 'https://zoom.us/j/987654321',
};

// Example 4: Completed (needs review)
const completedBooking = {
  id: '4',
  status: 'completed',
  scheduledAt: '2024-12-10T16:00:00Z',
  applicant: {
    id: 'app111',
    name: 'David Park',
    avatarUrl: null,
    currentStage: 'applying',
    targetPrograms: ['Columbia', 'NYU'],
  },
  service: {
    title: 'Resume Review',
    durationMinutes: 30,
    isLive: false,
  },
  amountPaid: 50,
  providerPayout: 40,
  materials: [],
  providerReview: null, // No review left yet
};

// Example 5: Completed with Review
const completedWithReviewBooking = {
  id: '5',
  status: 'completed',
  scheduledAt: '2024-12-08T10:00:00Z',
  applicant: {
    id: 'app222',
    name: 'Jessica Martinez',
    avatarUrl: '/avatars/jessica.jpg',
    currentStage: 'accepted',
  },
  service: {
    title: 'School Q&A Session',
    durationMinutes: 30,
    isLive: true,
  },
  amountPaid: 60,
  providerPayout: 48,
  materials: [],
  providerReview: {
    rating: 5,
    comment: 'Great questions! Very engaged and prepared.',
  },
};

// Example 6: Cancelled
const cancelledBooking = {
  id: '6',
  status: 'cancelled',
  scheduledAt: '2024-12-15T13:00:00Z',
  applicant: {
    id: 'app333',
    name: 'Alex Thompson',
    avatarUrl: null,
    currentStage: 'preparing',
  },
  service: {
    title: 'Essay Review',
    durationMinutes: 45,
    isLive: false,
  },
  amountPaid: 75,
  providerPayout: 60,
  cancellationReason: 'Applicant had to reschedule due to work emergency',
  materials: [],
};

// Example handlers
const handlers = {
  onJoinVideo: (videoLink) => {
    console.log('Joining video:', videoLink);
    window.open(videoLink, '_blank');
  },
  onReschedule: (bookingId) => {
    console.log('Reschedule booking:', bookingId);
  },
  onCancel: (bookingId) => {
    console.log('Cancel booking:', bookingId);
  },
  onLeaveReview: (bookingId) => {
    console.log('Leave review for booking:', bookingId);
  },
  onAccept: (bookingId) => {
    console.log('Accept booking:', bookingId);
  },
  onDecline: (bookingId) => {
    console.log('Decline booking:', bookingId);
  },
  onViewReview: (bookingId) => {
    console.log('View review for booking:', bookingId);
  },
  onMessageApplicant: (applicantId) => {
    console.log('Message applicant:', applicantId);
  },
  onViewDetails: (bookingId) => {
    console.log('View details for booking:', bookingId);
  },
};

export function ProviderBookingCardExamples() {
  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">ProviderBookingCard States</h1>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">1. Pending Acceptance</h2>
        <ProviderBookingCard booking={pendingBooking} {...handlers} />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">2. Upcoming with Materials</h2>
        <ProviderBookingCard booking={upcomingBooking} {...handlers} />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">3. Session Starting Soon (Join Video Enabled)</h2>
        <ProviderBookingCard booking={soonBooking} {...handlers} />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">4. Completed (Needs Review)</h2>
        <ProviderBookingCard booking={completedBooking} {...handlers} />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">5. Completed (With Review)</h2>
        <ProviderBookingCard booking={completedWithReviewBooking} {...handlers} />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">6. Cancelled</h2>
        <ProviderBookingCard booking={cancelledBooking} {...handlers} />
      </section>
    </div>
  );
}

export default ProviderBookingCardExamples;
