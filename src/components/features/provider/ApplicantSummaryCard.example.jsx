/**
 * ApplicantSummaryCard Example Usage
 *
 * Demonstrates how to use the ApplicantSummaryCard component
 * with different applicant scenarios.
 */

import { ApplicantSummaryCard } from './ApplicantSummaryCard';

export default function ApplicantSummaryCardExample() {
  // Example 1: First-time client (no session history)
  const firstTimeApplicant = {
    id: 'applicant_001',
    name: 'Sarah Johnson',
    avatarUrl: null,
    subscriptionTier: 'member',
    targetPrograms: [
      { id: 'prog_1', schoolName: 'Georgetown' },
      { id: 'prog_2', schoolName: 'Duke' },
      { id: 'prog_3', schoolName: 'Columbia' },
    ],
    icuType: 'micu',
    icuYears: 3,
    gpa: 3.6,
    gpaPrivate: false,
    stage: 'strategizing',
    schoolsAttended: ['Georgetown'], // Provider attended Georgetown
    icuTypeMatch: true,
  };

  // Example 2: Returning client with session history
  const returningApplicant = {
    id: 'applicant_002',
    name: 'Michael Chen',
    avatarUrl: null,
    subscriptionTier: 'member',
    targetPrograms: [
      { id: 'prog_4', schoolName: 'Emory' },
      { id: 'prog_5', schoolName: 'Rush' },
    ],
    icuType: 'cvicu',
    icuYears: 5,
    gpa: 3.8,
    gpaPrivate: false,
    stage: 'applying_now',
    schoolsAttended: [],
    icuTypeMatch: false,
  };

  const sessionHistory = [
    {
      id: 'session_001',
      serviceName: 'Mock Interview',
      date: 'Dec 1, 2024',
      rating: 5,
    },
    {
      id: 'session_002',
      serviceName: 'Essay Review',
      date: 'Nov 15, 2024',
      rating: 5,
    },
    {
      id: 'session_003',
      serviceName: 'School Selection Consult',
      date: 'Oct 28, 2024',
      rating: 4,
    },
  ];

  // Example 3: Non-member applicant
  const nonMemberApplicant = {
    id: 'applicant_003',
    name: 'Emily Rodriguez',
    avatarUrl: null,
    subscriptionTier: 'free',
    targetPrograms: [],
    icuType: 'sicu',
    icuYears: 2,
    gpa: 3.4,
    gpaPrivate: true, // GPA is private
    stage: 'exploring',
    schoolsAttended: [],
    icuTypeMatch: false,
  };

  // Example 4: Applicant with many target programs
  const manyTargetsApplicant = {
    id: 'applicant_004',
    name: 'James Wilson',
    avatarUrl: null,
    subscriptionTier: 'member',
    targetPrograms: [
      { id: 'prog_6', schoolName: 'Georgetown' },
      { id: 'prog_7', schoolName: 'Duke' },
      { id: 'prog_8', schoolName: 'Columbia' },
      { id: 'prog_9', schoolName: 'Emory' },
      { id: 'prog_10', schoolName: 'Rush' },
      { id: 'prog_11', schoolName: 'Johns Hopkins' },
    ],
    icuType: 'neuro-icu',
    icuYears: 4,
    gpa: 3.7,
    gpaPrivate: false,
    stage: 'applying_now',
    schoolsAttended: ['Duke', 'Columbia'],
    icuTypeMatch: false,
  };

  return (
    <div className="p-8 space-y-8 bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold mb-2">ApplicantSummaryCard Examples</h1>
        <p className="text-gray-600 mb-6">
          Component for providers to view applicant summaries
        </p>
      </div>

      {/* Example 1: First-time client */}
      <div>
        <h2 className="text-lg font-semibold mb-3">
          Example 1: First-Time Client
        </h2>
        <div className="max-w-md">
          <ApplicantSummaryCard
            applicant={firstTimeApplicant}
            sessionHistory={[]}
            showFullProfile={true}
          />
        </div>
      </div>

      {/* Example 2: Returning client with history */}
      <div>
        <h2 className="text-lg font-semibold mb-3">
          Example 2: Returning Client with History
        </h2>
        <div className="max-w-md">
          <ApplicantSummaryCard
            applicant={returningApplicant}
            sessionHistory={sessionHistory}
            showFullProfile={true}
          />
        </div>
      </div>

      {/* Example 3: Non-member */}
      <div>
        <h2 className="text-lg font-semibold mb-3">
          Example 3: Non-Member (No Profile Access)
        </h2>
        <div className="max-w-md">
          <ApplicantSummaryCard
            applicant={nonMemberApplicant}
            sessionHistory={[]}
            showFullProfile={false}
          />
        </div>
      </div>

      {/* Example 4: Many target programs + school matches */}
      <div>
        <h2 className="text-lg font-semibold mb-3">
          Example 4: Many Target Programs + School Matches
        </h2>
        <div className="max-w-md">
          <ApplicantSummaryCard
            applicant={manyTargetsApplicant}
            sessionHistory={sessionHistory}
            showFullProfile={true}
          />
        </div>
      </div>

      {/* Usage in a sidebar or modal */}
      <div>
        <h2 className="text-lg font-semibold mb-3">
          Example 5: In a Provider Session Detail Page
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-xl font-bold mb-4">Mock Interview Session</h3>
            <p className="text-gray-600">
              Main session content would go here...
            </p>
          </div>
          <div className="lg:col-span-1">
            <ApplicantSummaryCard
              applicant={firstTimeApplicant}
              sessionHistory={[]}
              showFullProfile={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
