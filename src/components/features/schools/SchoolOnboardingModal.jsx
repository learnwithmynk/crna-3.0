/**
 * SchoolOnboardingModal Component
 *
 * First-time personalization modal for the School Database.
 * Asks one quick question to personalize the experience.
 */

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  Clock,
  Calendar,
  Rocket,
  Target,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const TIMELINE_OPTIONS = [
  {
    id: '12_plus_months',
    label: '12+ months away',
    description: 'Just starting to explore options',
    icon: Clock,
  },
  {
    id: '6_to_12_months',
    label: '6-12 months from applying',
    description: 'Building my target list',
    icon: Target,
  },
  {
    id: '3_to_6_months',
    label: '3-6 months out',
    description: 'Actively preparing applications',
    icon: Calendar,
  },
  {
    id: 'applying_now',
    label: 'Applying now',
    description: 'Ready to submit applications',
    icon: Rocket,
  },
];

export function SchoolOnboardingModal({ open, onComplete, onSkip }) {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" hideCloseButton>
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 bg-gradient-to-br from-purple-100 to-primary/20 rounded-full p-4 w-16 h-16 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-purple-600" />
          </div>
          <DialogTitle className="text-xl">Let's personalize your search</DialogTitle>
          <DialogDescription>
            One quick question to show you the most relevant programs
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          <p className="text-sm font-medium text-center text-gray-700">
            Where are you in your CRNA journey?
          </p>

          <div className="space-y-2">
            {TIMELINE_OPTIONS.map((option) => (
              <button
                key={option.id}
                onClick={() => onComplete(option.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl border",
                  "hover:border-primary hover:bg-primary/5 transition-all",
                  "text-left group"
                )}
              >
                <div className="bg-gray-100 group-hover:bg-primary/10 rounded-full p-2 transition-colors">
                  <option.icon className="w-5 h-5 text-gray-600 group-hover:text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{option.label}</p>
                  <p className="text-xs text-gray-500">{option.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSkip}
            className="text-gray-500"
          >
            Skip for now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SchoolOnboardingModal;
