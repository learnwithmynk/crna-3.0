/**
 * WelcomeScreen
 *
 * First onboarding screen that positions the app as an "Application Companion"
 * and sets expectations for what makes CRNA Club different.
 */

import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight } from 'lucide-react';

const VALUE_PROPS = [
  'Track your progress across every requirement',
  'Know exactly what to focus on next',
  'Create personalized checklists for each school',
  'Get alerts before deadlines sneak up',
  'See how you compare to successful applicants',
];

export default function WelcomeScreen({ onContinue }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 text-center">
        {/* Welcome text */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          Welcome to Your CRNA Application Companion
        </h1>

        <p className="text-gray-600 mb-8 max-w-md">
          This isn't just another membership site with videos. We're going to actively guide you through your CRNA journey.
        </p>

        {/* Value propositions */}
        <div className="w-full max-w-md space-y-3 text-left mb-8">
          {VALUE_PROPS.map((prop, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">{prop}</span>
            </div>
          ))}
        </div>

        {/* Time estimate */}
        <p className="text-sm text-gray-500 mb-6">
          Let's spend 2 minutes setting up your personalized dashboard.
          <br />
          The more you share, the smarter we get.
        </p>
      </div>

      {/* Sticky footer */}
      <div className="sticky bottom-0 p-4 bg-white border-t border-gray-100">
        <Button
          onClick={onContinue}
          className="w-full h-12 text-base font-semibold"
        >
          Let's Do This
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        <p className="text-xs text-center text-gray-400 mt-2">+5 points</p>
      </div>
    </div>
  );
}
