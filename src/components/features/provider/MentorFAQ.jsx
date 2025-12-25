/**
 * MentorFAQ Component
 *
 * FAQ accordion for potential mentors.
 * Answers common questions about becoming a mentor.
 */

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const FAQ_ITEMS = [
  {
    question: "How much can I realistically earn?",
    answer: "It depends on your availability and pricing. Active mentors typically earn $200-800/month with just a few hours per week. Top mentors who offer multiple services and maintain high ratings can earn $1,500+ monthly. You set your own prices and schedule."
  },
  {
    question: "How long does approval take?",
    answer: "We review applications within 2-3 business days. Once approved, you can immediately set up your profile and start accepting bookings. Most mentors are live within a week of applying."
  },
  {
    question: "Do I need to be a CRNA to become a mentor?",
    answer: "No! We're specifically looking for current SRNAs (Student Registered Nurse Anesthetists). Your recent experience applying to and being accepted into a CRNA program is exactly what applicants need. You've been where they want to go."
  },
  {
    question: "What services can I offer?",
    answer: "You can offer mock interviews, personal statement/essay reviews, 1:1 coaching calls, and general Q&A sessions. Choose whichever services you're comfortable providing. You can start with one and add more later."
  },
  {
    question: "How do I get paid?",
    answer: "Payments are processed through Stripe and deposited directly to your bank account every 2 weeks. You'll receive 80% of each booking (we take a 20% platform fee). You can track all earnings in your dashboard."
  },
  {
    question: "What if I need to take a break?",
    answer: "No problem! You can enable vacation mode anytime to pause new bookings. Set your dates, add an auto-response message, and we'll handle the rest. Your profile stays active but shows you're temporarily unavailable."
  },
  {
    question: "Can I message clients off-platform?",
    answer: "For your protection, all communication should stay on the platform. This ensures you have documentation if any disputes arise, and it protects you from no-shows since clients pay upfront through us."
  },
  {
    question: "What if a client doesn't show up?",
    answer: "You still get paid! Clients pay when they book, and cancellation policies protect your time. If they no-show, you keep the full payment. We recommend sending a reminder message the day before."
  },
  {
    question: "How do I handle scheduling?",
    answer: "You set your availability in your profile - pick the days and times you're free. Clients see these slots and can request times that work for them. You approve each booking request within 48 hours."
  },
  {
    question: "What if I get a bad review?",
    answer: "Reviews are double-blind - neither party sees the other's review until both submit (or 14 days pass). This encourages honest feedback. If you receive unfair feedback, you can respond professionally or contact support."
  }
];

function FAQItem({ item, isOpen, onToggle }) {
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 text-left hover:bg-gray-50 px-2 -mx-2 rounded transition-colors"
        aria-expanded={isOpen}
      >
        <span className="font-medium text-gray-900 pr-4">{item.question}</span>
        <ChevronDown
          className={cn(
            'w-5 h-5 text-gray-500 shrink-0 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      <div
        className={cn(
          'overflow-hidden transition-all duration-200',
          isOpen ? 'max-h-96 pb-4' : 'max-h-0'
        )}
      >
        <p className="text-gray-600 text-sm leading-relaxed px-2">
          {item.answer}
        </p>
      </div>
    </div>
  );
}

export function MentorFAQ({ className }) {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(prev => prev === index ? null : index);
  };

  return (
    <Card className={cn('', className)}>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle className="w-6 h-6 text-primary" />
          <h3 className="text-xl font-bold">Frequently Asked Questions</h3>
        </div>

        <div className="divide-y divide-gray-100">
          {FAQ_ITEMS.map((item, idx) => (
            <FAQItem
              key={idx}
              item={item}
              isOpen={openIndex === idx}
              onToggle={() => handleToggle(idx)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default MentorFAQ;
