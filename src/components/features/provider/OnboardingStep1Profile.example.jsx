/**
 * OnboardingStep1Profile Example
 *
 * Demonstrates how to use the OnboardingStep1Profile component
 * in a provider onboarding wizard.
 */

import { useState } from 'react';
import { OnboardingStep1Profile } from './OnboardingStep1Profile';

export default function OnboardingStep1ProfileExample() {
  const [stepData, setStepData] = useState({
    tagline: '',
    bio: '',
    icuType: '',
    icuYears: '',
    specializations: [],
    personality: {}
  });

  const handleChange = (field, value) => {
    setStepData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    console.log('Proceeding to next step with data:', stepData);
    // In real implementation, this would move to Step 2
  };

  const handleBack = () => {
    console.log('Going back to previous step');
    // In real implementation, this would go to the welcome/intro screen
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Provider Onboarding
          </h1>
          <p className="text-gray-600">
            Step 1 of 4: Your Profile - Professional + Personality
          </p>
        </div>

        <OnboardingStep1Profile
          data={stepData}
          onChange={handleChange}
          onNext={handleNext}
          onBack={handleBack}
        />

        {/* Debug output */}
        <div className="mt-8 p-4 bg-gray-100 rounded-xl">
          <h3 className="font-semibold mb-2">Current Data (Debug)</h3>
          <pre className="text-xs overflow-auto">
            {JSON.stringify(stepData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
