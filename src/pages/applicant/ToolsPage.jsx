/**
 * Tools Page - Central hub for all tools and utilities
 *
 * Links to:
 * - My Documents
 * - GPA Calculator
 * - Financial Planner
 * - Transcript Analyzer (future)
 * - Timeline Generator (future)
 * - Mock Interview (future)
 */

import { PageWrapper, PageHeader } from '@/components/layout/page-wrapper';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Calculator,
  DollarSign,
  FileSearch,
  CalendarClock,
  Mic,
  ExternalLink,
} from 'lucide-react';

const tools = [
  {
    id: 'documents',
    title: 'My Documents',
    description: 'Store and organize your transcripts, essays, resume, and other application materials.',
    icon: FileText,
    href: '/documents',
    color: 'bg-blue-100 text-blue-600',
    available: true,
  },
  {
    id: 'gpa-calculator',
    title: 'GPA Calculator',
    description: 'Calculate your cumulative and science GPA to see how you stack up.',
    icon: Calculator,
    href: '/tools/gpa-calculator',
    color: 'bg-purple-100 text-purple-600',
    external: true,
    available: true,
  },
  {
    id: 'financial-planner',
    title: 'Financial Planner',
    description: 'Plan your budget for CRNA school including tuition, living expenses, and loans.',
    icon: DollarSign,
    href: '/tools/financial-planner',
    color: 'bg-green-100 text-green-600',
    external: true,
    available: true,
  },
  {
    id: 'transcript-analyzer',
    title: 'Transcript Analyzer',
    description: 'Upload your transcript and get instant analysis of your coursework and GPA.',
    icon: FileSearch,
    href: '/tools/transcript-analyzer',
    color: 'bg-orange-100 text-orange-600',
    external: true,
    available: false,
    comingSoon: true,
  },
  {
    id: 'timeline-generator',
    title: 'Timeline Generator',
    description: 'Create a personalized application timeline based on your target programs.',
    icon: CalendarClock,
    href: '/tools/timeline-generator',
    color: 'bg-pink-100 text-pink-600',
    external: true,
    available: false,
    comingSoon: true,
  },
  {
    id: 'mock-interview',
    title: 'AI Mock Interview',
    description: 'Practice your interview skills with our AI-powered mock interview tool.',
    icon: Mic,
    href: '/tools/mock-interview',
    color: 'bg-cyan-100 text-cyan-600',
    external: true,
    available: false,
    comingSoon: true,
  },
];

export function ToolsPage() {
  return (
    <PageWrapper>
      <PageHeader
        title="Tools"
        description="Calculators, planners, and utilities to help your CRNA journey."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isDisabled = !tool.available;

          const content = (
            <Card
              className={`h-full transition-all ${
                isDisabled
                  ? 'opacity-60 cursor-not-allowed'
                  : 'hover:shadow-md hover:border-gray-300 cursor-pointer'
              }`}
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${tool.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{tool.title}</h3>
                      {tool.external && tool.available && (
                        <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                      )}
                      {tool.comingSoon && (
                        <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{tool.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );

          if (isDisabled) {
            return <div key={tool.id}>{content}</div>;
          }

          return (
            <a
              key={tool.id}
              href={tool.href}
              target={tool.external ? '_blank' : undefined}
              rel={tool.external ? 'noopener noreferrer' : undefined}
              className="block"
            >
              {content}
            </a>
          );
        })}
      </div>
    </PageWrapper>
  );
}
