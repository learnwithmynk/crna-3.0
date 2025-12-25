/**
 * OnboardingProgressWidget - Usage Examples
 *
 * This file demonstrates how to use the OnboardingProgressWidget component
 * in various scenarios throughout the provider onboarding flow.
 */

import { OnboardingProgressWidget } from './OnboardingProgressWidget';

// Example 1: User just started - on step 1 (Application)
export function Example1_JustStarted() {
  return (
    <div className="p-6">
      <OnboardingProgressWidget
        currentStep={1}
        completedSteps={[]}
      />
    </div>
  );
}

// Example 2: User completed application, now on Profile (step 2)
export function Example2_OnProfileStep() {
  return (
    <div className="p-6">
      <OnboardingProgressWidget
        currentStep={2}
        completedSteps={[1]}
      />
    </div>
  );
}

// Example 3: User is halfway through - on Services (step 3)
export function Example3_HalfwayThrough() {
  return (
    <div className="p-6">
      <OnboardingProgressWidget
        currentStep={3}
        completedSteps={[1, 2]}
      />
    </div>
  );
}

// Example 4: User almost done - on Stripe setup (step 5)
export function Example4_AlmostComplete() {
  return (
    <div className="p-6">
      <OnboardingProgressWidget
        currentStep={5}
        completedSteps={[1, 2, 3, 4]}
      />
    </div>
  );
}

// Example 5: All steps complete
export function Example5_Complete() {
  return (
    <div className="p-6">
      <OnboardingProgressWidget
        currentStep={6}
        completedSteps={[1, 2, 3, 4, 5]}
      />
    </div>
  );
}

// Example 6: Integration in an actual onboarding page
export function Example6_InOnboardingPage() {
  // This would typically come from your state management
  const currentStep = 2;
  const completedSteps = [1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Progress widget at the top */}
        <OnboardingProgressWidget
          currentStep={currentStep}
          completedSteps={completedSteps}
        />

        {/* Your onboarding form content goes here */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Build Your Profile</h2>
          <p className="text-gray-600">
            Tell applicants about yourself and your experience...
          </p>
          {/* Form fields, etc. */}
        </div>
      </div>
    </div>
  );
}

// Example 7: With custom className for styling
export function Example7_CustomStyling() {
  return (
    <div className="p-6">
      <OnboardingProgressWidget
        currentStep={3}
        completedSteps={[1, 2]}
        className="max-w-4xl mx-auto"
      />
    </div>
  );
}

// Example 8: Typical usage pattern with React state
import { useState, useEffect } from 'react';

export function Example8_WithState() {
  const [onboardingData, setOnboardingData] = useState({
    currentStep: 1,
    completedSteps: []
  });

  // This would typically fetch from an API
  useEffect(() => {
    // Mock API call
    const fetchOnboardingProgress = async () => {
      // In real app: const data = await api.getProviderOnboarding();
      const data = {
        currentStep: 2,
        completedSteps: [1]
      };
      setOnboardingData(data);
    };

    fetchOnboardingProgress();
  }, []);

  const handleStepComplete = (stepNumber) => {
    setOnboardingData(prev => ({
      completedSteps: [...prev.completedSteps, stepNumber],
      currentStep: stepNumber + 1
    }));
  };

  return (
    <div className="p-6">
      <OnboardingProgressWidget
        currentStep={onboardingData.currentStep}
        completedSteps={onboardingData.completedSteps}
      />

      <button
        onClick={() => handleStepComplete(onboardingData.currentStep)}
        className="mt-4 px-4 py-2 bg-yellow-400 rounded-xl font-medium"
      >
        Complete Current Step
      </button>
    </div>
  );
}
