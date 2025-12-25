/**
 * BecomeMentorLandingPage
 *
 * Landing page for SRNAs interested in becoming mentors.
 * Shows clear value proposition, how it works, expectations, and FAQ.
 * Route: /marketplace/become-a-mentor
 */

import { Link } from 'react-router-dom';
import {
  Sparkles,
  DollarSign,
  Users,
  MessageSquare,
  Smartphone,
  ArrowRight,
  CheckCircle2,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { HowItWorksSteps } from '@/components/features/provider/HowItWorksSteps';
import { ExpectationsCard } from '@/components/features/provider/ExpectationsCard';
import { MentorFAQ } from '@/components/features/provider/MentorFAQ';
import { cn } from '@/lib/utils';

// What makes CRNA Club different from competitors
const DIFFERENTIATORS = [
  {
    icon: Sparkles,
    title: 'Stand out with personality',
    description: 'Fun profile questions help applicants find mentors they vibe with. Be yourself, not a resume.'
  },
  {
    icon: DollarSign,
    title: 'Keep more of what you earn',
    description: '20% platform fee vs industry standard 35%. Your expertise, your earnings.'
  },
  {
    icon: Users,
    title: 'Built-in audience',
    description: '8,000+ engaged CRNA applicants in our community. No need to market yourself elsewhere.'
  },
  {
    icon: MessageSquare,
    title: 'Mentor community',
    description: 'Private forum, resources, and templates to help you succeed. Learn from other mentors.'
  },
  {
    icon: Smartphone,
    title: 'Modern platform',
    description: 'Mobile-friendly, real-time messaging, easy scheduling. No clunky interfaces.'
  }
];

// Social proof / testimonials
const TESTIMONIALS = [
  {
    quote: "I made $600 in my first month just doing mock interviews on weekends. It's flexible and rewarding.",
    author: "Sarah M.",
    role: "2nd Year SRNA, Georgetown",
    rating: 5
  },
  {
    quote: "Helping applicants reminds me why I started this journey. Plus, the extra income helps with student loans!",
    author: "Marcus T.",
    role: "3rd Year SRNA, Duke",
    rating: 5
  }
];

function DifferentiatorCard({ icon: Icon, title, description }) {
  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TestimonialCard({ quote, author, role, rating }) {
  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-6">
        <div className="flex gap-1 mb-3">
          {[...Array(rating)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        <p className="text-gray-700 italic mb-4">"{quote}"</p>
        <div>
          <p className="font-semibold text-gray-900">{author}</p>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function BecomeMentorLandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-100/30" />

        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary-foreground px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-gray-800">Now accepting SRNA mentors</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Turn Your SRNA Experience Into{' '}
              <span className="text-primary bg-primary/10 px-2 rounded">Income</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Help aspiring CRNAs while earning extra money. Set your own hours, your own rates.
              You've been where they want to go—share your experience.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8">
                <Link to="/marketplace/provider/apply">
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8">
                <a href="#how-it-works">
                  Learn More
                </a>
              </Button>
            </div>

            {/* Quick stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-12 text-center">
              <div>
                <p className="text-3xl font-bold text-gray-900">$200-800</p>
                <p className="text-sm text-gray-500">avg monthly earnings</p>
              </div>
              <div className="hidden sm:block w-px bg-gray-200" />
              <div>
                <p className="text-3xl font-bold text-gray-900">20%</p>
                <p className="text-sm text-gray-500">platform fee only</p>
              </div>
              <div className="hidden sm:block w-px bg-gray-200" />
              <div>
                <p className="text-3xl font-bold text-gray-900">8,000+</p>
                <p className="text-sm text-gray-500">active applicants</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 md:py-20 scroll-mt-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get started in minutes, not days. Our simple process gets you earning quickly.
            </p>
          </div>

          <HowItWorksSteps />
        </div>
      </section>

      {/* Expectations Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Crystal Clear Expectations
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              No surprises. Here's exactly what you need to know before you apply.
            </p>
          </div>

          <ExpectationsCard />
        </div>
      </section>

      {/* What Makes Us Different Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Makes CRNA Club Different
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We built this platform for SRNAs, not against you. Here's why mentors love us.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DIFFERENTIATORS.map((item, idx) => (
              <DifferentiatorCard key={idx} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Hear From Our Mentors
            </h2>
            <p className="text-lg text-gray-600">
              Real SRNAs sharing their experience on CRNA Club.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {TESTIMONIALS.map((testimonial, idx) => (
              <TestimonialCard key={idx} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Got questions? We've got answers.
            </p>
          </div>

          <MentorFAQ />
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Application takes about 5 minutes. We'll review within 2-3 business days and get you earning.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button asChild size="lg" className="text-lg px-8 bg-primary hover:bg-primary/90">
              <Link to="/marketplace/provider/apply">
                Start My Application
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-6 text-gray-400 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span>No upfront costs</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span>Keep 80% of earnings</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default BecomeMentorLandingPage;
