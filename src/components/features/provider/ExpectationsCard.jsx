/**
 * ExpectationsCard Component
 *
 * Displays crystal clear expectations for becoming a mentor.
 * Shows what mentors need to know upfront - independent contractor status,
 * commission, taxes, response times, etc.
 */

import {
  Briefcase,
  Percent,
  Video,
  Receipt,
  Clock,
  DollarSign,
  CreditCard,
  Check
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const EXPECTATIONS = [
  {
    icon: Briefcase,
    title: "You're an independent contractor",
    description: "You run your own mentoring business. We provide the platform and customers.",
    highlight: false
  },
  {
    icon: Percent,
    title: "Commission: 20%",
    description: "You keep 80%, we handle payments and the platform.",
    example: "$100 session = $80 in your pocket",
    compare: "Other platforms take 35%+",
    highlight: true
  },
  {
    icon: Video,
    title: "You provide your own video link",
    description: "Use your Zoom, Google Meet, or any video tool. We don't host video calls.",
    highlight: false
  },
  {
    icon: Receipt,
    title: "You're responsible for your own taxes",
    description: "You'll receive a 1099 at year end for your earnings.",
    highlight: false
  },
  {
    icon: Clock,
    title: "48 hours to respond to requests",
    description: "Keep your response time high to rank well in search results.",
    highlight: false
  },
  {
    icon: DollarSign,
    title: "Set your own prices",
    description: "We suggest ranges, but you decide what to charge.",
    highlight: false
  },
  {
    icon: CreditCard,
    title: "Payouts every 2 weeks",
    description: "Direct deposit to your bank account via Stripe.",
    highlight: false
  }
];

function ExpectationItem({ expectation }) {
  const Icon = expectation.icon;

  return (
    <div
      className={cn(
        'flex gap-4 p-4 rounded-xl transition-colors',
        expectation.highlight
          ? 'bg-green-50 border border-green-200'
          : 'bg-gray-50 hover:bg-gray-100'
      )}
    >
      <div className={cn(
        'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
        expectation.highlight ? 'bg-green-100' : 'bg-white'
      )}>
        <Icon className={cn(
          'w-5 h-5',
          expectation.highlight ? 'text-green-600' : 'text-gray-600'
        )} />
      </div>

      <div className="flex-1">
        <h4 className={cn(
          'font-semibold',
          expectation.highlight && 'text-green-800'
        )}>
          {expectation.title}
        </h4>
        <p className="text-sm text-gray-600 mt-0.5">
          {expectation.description}
        </p>

        {/* Highlight extras for commission */}
        {expectation.example && (
          <div className="mt-2 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-1 text-sm font-medium text-green-700 bg-green-100 px-2 py-1 rounded">
              <Check className="w-4 h-4" />
              {expectation.example}
            </span>
            <span className="text-sm text-gray-500 italic">
              {expectation.compare}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export function ExpectationsCard({ className }) {
  return (
    <Card className={cn('', className)}>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-6 text-center">
          Crystal Clear Expectations
        </h3>

        <div className="space-y-3">
          {EXPECTATIONS.map((exp, idx) => (
            <ExpectationItem key={idx} expectation={exp} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default ExpectationsCard;
