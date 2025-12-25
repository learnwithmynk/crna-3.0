/**
 * OnboardingStep5Review - Example Usage
 *
 * This file demonstrates how to use the OnboardingStep5Review component
 * in the provider onboarding flow.
 */

import { useState } from 'react';
import { OnboardingStep5Review } from './OnboardingStep5Review';

export function OnboardingStep5ReviewExample() {
  const [isLaunching, setIsLaunching] = useState(false);

  // Mock profile data
  const mockProfileData = {
    firstName: 'Sarah',
    lastName: 'Johnson',
    tagline: 'ICU nurse turned CRNA student here to help you succeed',
    bio: 'I remember how overwhelming the CRNA application process was. I\'m here to share what I learned and help you put together a competitive application. I specialize in essay reviews and mock interviews.',
    avatarUrl: 'https://i.pravatar.cc/150?img=5',
    videoCallLink: 'https://meet.google.com/abc-defg-hij',
    school: 'Johns Hopkins University',
    yearInProgram: 2,
    personality: {
      cats_or_dogs: 'Dog person! I have two golden retrievers',
      road_trip_music: 'Pop & Country',
      comfort_food: 'Mac and cheese',
    },
  };

  // Mock services data
  const mockServicesData = [
    {
      name: 'Essay Review',
      price: 75,
      duration: 45,
      enabled: true,
    },
    {
      name: 'Mock Interview',
      price: 100,
      duration: 60,
      enabled: true,
    },
    {
      name: '1-on-1 Application Coaching',
      price: 150,
      duration: 90,
      enabled: true,
    },
  ];

  // Mock availability data
  const mockAvailabilityData = {
    monday: { morning: true, afternoon: false, evening: true },
    tuesday: { morning: true, afternoon: true, evening: false },
    wednesday: { morning: false, afternoon: true, evening: true },
    thursday: { morning: true, afternoon: true, evening: true },
    friday: { morning: true, afternoon: false, evening: false },
  };

  const handleLaunch = async () => {
    setIsLaunching(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // TODO: In production, this would:
    // 1. Submit profile data to Supabase
    // 2. Mark provider as "active" in database
    // 3. Create provider profile record
    // 4. Send confirmation email
    // 5. Trigger welcome automation

    setIsLaunching(false);
    console.log('Profile launched successfully!');
  };

  const handleBack = () => {
    console.log('Navigate back to Step 4');
  };

  const handleNavigateToStep = (stepNumber) => {
    console.log(`Navigate to step ${stepNumber}`);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Step 5 Review Example</h1>
        <p className="text-gray-600">
          Review your complete profile before launching
        </p>
      </div>

      {/* Example with all items complete and Stripe connected */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Ready to Launch (Stripe Connected)</h2>
        <OnboardingStep5Review
          profileData={mockProfileData}
          servicesData={mockServicesData}
          availabilityData={mockAvailabilityData}
          stripeStatus="connected"
          onBack={handleBack}
          onLaunch={handleLaunch}
          isLaunching={isLaunching}
          onNavigateToStep={handleNavigateToStep}
        />
      </div>

      <hr className="my-12 border-gray-300" />

      {/* Example with incomplete profile */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Incomplete Profile</h2>
        <OnboardingStep5Review
          profileData={{
            firstName: 'John',
            lastName: 'Doe',
            // Missing bio, school, etc.
          }}
          servicesData={[]}
          availabilityData={{}}
          stripeStatus="not_connected"
          onBack={handleBack}
          onLaunch={handleLaunch}
          isLaunching={false}
          onNavigateToStep={handleNavigateToStep}
        />
      </div>

      <hr className="my-12 border-gray-300" />

      {/* Example with Stripe pending */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Profile Complete, Stripe Pending</h2>
        <OnboardingStep5Review
          profileData={mockProfileData}
          servicesData={mockServicesData}
          availabilityData={mockAvailabilityData}
          stripeStatus="pending"
          onBack={handleBack}
          onLaunch={handleLaunch}
          isLaunching={false}
          onNavigateToStep={handleNavigateToStep}
        />
      </div>
    </div>
  );
}

/**
 * Integration Notes:
 *
 * 1. Profile Data Structure:
 *    - firstName, lastName: Required for display
 *    - tagline: Optional intro text
 *    - bio: Full bio text (required for completion)
 *    - avatarUrl: Profile photo URL
 *    - videoCallLink: Zoom/Google Meet link
 *    - school: CRNA program name
 *    - yearInProgram: 1, 2, or 3
 *    - personality: Object with optional personality questions
 *
 * 2. Services Data Structure:
 *    - Array of service objects
 *    - Each service: { name, price, duration, enabled }
 *    - At least one enabled service required for completion
 *
 * 3. Availability Data Structure:
 *    - Object keyed by day of week
 *    - Each day has morning/afternoon/evening boolean flags
 *
 * 4. Stripe Status:
 *    - 'connected': Stripe account fully set up
 *    - 'pending': Stripe onboarding in progress
 *    - 'not_connected': No Stripe account linked
 *
 * 5. Callbacks:
 *    - onLaunch: Called when user clicks "Launch My Profile"
 *    - onBack: Navigate to previous step
 *    - onNavigateToStep: Navigate to specific step from checklist
 *
 * 6. Launch Flow:
 *    - Pre-launch: Shows checklist, terms, and preview
 *    - Post-launch: Shows celebration with confetti and action buttons
 *    - Profile URL is generated after successful launch
 *
 * 7. API Integration:
 *    - Submit all profile data to Supabase
 *    - Update provider status to "active"
 *    - Generate unique profile URL/slug
 *    - Send confirmation email via Groundhogg
 *    - Award gamification points for profile completion
 */

export default OnboardingStep5ReviewExample;
