/**
 * OnboardingStep2Services Example
 *
 * Demonstrates the services configuration step of provider onboarding
 */

import { useState } from 'react';
import { OnboardingStep2Services } from './OnboardingStep2Services';

export function OnboardingStep2ServicesExample() {
  const [servicesData, setServicesData] = useState({
    mock_interview: {
      enabled: true,
      description: "I'll simulate a real CRNA program interview, covering behavioral questions, clinical scenarios, and program-specific topics. You'll receive honest, constructive feedback on your answers, body language, and presentation. I'll help you identify areas for improvement and build confidence for the real thing.",
      price: '100',
      duration: '60min',
      deliverables: ['realtime_feedback', 'written_summary', 'recording'],
      instantBook: true
    },
    essay_review: {
      enabled: true,
      description: "I'll provide detailed feedback on your personal statement or secondary essays. I'll focus on story structure, authenticity, and what makes YOU stand out.",
      price: '75',
      duration: '45min',
      deliverables: ['inline_comments', 'summary_feedback', 'revision_suggestions'],
      instantBook: false
    },
    coaching: {
      enabled: false,
      description: '',
      price: '',
      duration: '',
      deliverables: [],
      instantBook: false
    },
    qa_call: {
      enabled: true,
      description: "Got questions about the CRNA journey? Let's chat! No formal structure - just an open conversation where you can ask anything about ICU experience, applications, student life, or what to expect. I'll share my honest experiences and advice.",
      price: '50',
      duration: '30min',
      deliverables: ['notes_summary', 'resource_links'],
      instantBook: true
    }
  });

  const handleChange = (newData) => {
    setServicesData(newData);
    console.log('Services data updated:', newData);
  };

  const handleNext = () => {
    console.log('Proceeding to next step with data:', servicesData);
    alert('Step 2 complete! Check console for data.');
  };

  const handleBack = () => {
    console.log('Going back to previous step');
    alert('Going back to Step 1');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Provider Onboarding Example
          </h1>
          <p className="text-gray-600">Step 2: Configure Your Services</p>
        </div>

        <OnboardingStep2Services
          data={servicesData}
          onChange={handleChange}
          onNext={handleNext}
          onBack={handleBack}
        />

        {/* Debug Info */}
        <div className="mt-8 p-4 bg-gray-900 text-gray-100 rounded-xl text-xs font-mono overflow-auto max-h-96">
          <div className="mb-2 font-semibold">Current State:</div>
          <pre>{JSON.stringify(servicesData, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}

export default OnboardingStep2ServicesExample;
