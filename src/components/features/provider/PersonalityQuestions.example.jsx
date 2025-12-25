/**
 * PersonalityQuestions Usage Example
 *
 * This demonstrates how to use the PersonalityQuestions component
 * in a mentor profile onboarding flow.
 */

import { useState } from 'react';
import { PersonalityQuestions } from './PersonalityQuestions';
import { Button } from '@/components/ui/button';

export function PersonalityQuestionsExample() {
  const [personalityData, setPersonalityData] = useState({
    tagline: '',
    astrology: '',
    icu_vibe: '',
    pet_preference: '',
    patient_population: '',
    music: '',
    weird_fact: '',
    comfort_food: '',
    hobbies: '',
    motto: ''
  });

  const handleSave = () => {
    console.log('Saving personality data:', personalityData);
    // In a real app, this would save to your backend/Supabase
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">
          Tell Us About Yourself
        </h1>
        <p className="text-gray-600">
          These personality questions help applicants find mentors they'll
          connect with. They're all optional, but the more you share, the
          better your matches!
        </p>
      </div>

      <PersonalityQuestions
        value={personalityData}
        onChange={setPersonalityData}
      />

      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline">
          Skip for Now
        </Button>
        <Button onClick={handleSave}>
          Save & Continue
        </Button>
      </div>

      {/* Debug output */}
      <details className="bg-gray-50 rounded p-4 text-xs">
        <summary className="cursor-pointer font-medium mb-2">
          Debug: Current Values
        </summary>
        <pre className="overflow-auto">
          {JSON.stringify(personalityData, null, 2)}
        </pre>
      </details>
    </div>
  );
}

export default PersonalityQuestionsExample;
