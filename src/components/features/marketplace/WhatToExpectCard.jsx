/**
 * WhatToExpectCard Component
 *
 * Displays service-specific guidance for what to expect during a session.
 * Content varies based on service type (mock_interview, essay_review, etc.)
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  MessageSquare,
  FileText,
  Lightbulb,
  Clock,
  CheckCircle,
  HelpCircle,
  Video
} from 'lucide-react';

/**
 * Service-specific expectations content
 */
const EXPECTATIONS_BY_TYPE = {
  mock_interview: {
    title: 'What to Expect',
    icon: Video,
    description: 'Your mentor will simulate a real CRNA program interview to help you practice.',
    sections: [
      {
        heading: 'During the Session',
        items: [
          'Introduction and warm-up (5 min)',
          'Simulated interview questions (30-40 min)',
          'Detailed feedback and coaching (15-20 min)',
          'Q&A and next steps'
        ]
      },
      {
        heading: 'What Your Mentor Will Cover',
        items: [
          'Common behavioral and situational questions',
          'Program-specific questions based on your target schools',
          'Body language and delivery feedback',
          'Tips for standing out'
        ]
      }
    ]
  },
  essay_review: {
    title: 'What to Expect',
    icon: FileText,
    description: 'Your mentor will provide detailed written feedback on your personal statement or essay.',
    sections: [
      {
        heading: 'What You\'ll Receive',
        items: [
          'Inline comments throughout your document',
          'Summary of strengths and areas for improvement',
          'Specific suggestions for revision',
          'Optional: brief follow-up call to discuss feedback'
        ]
      },
      {
        heading: 'Timeline',
        items: [
          'Your mentor has up to 72 hours to deliver feedback',
          'Most feedback is delivered within 48 hours',
          'You\'ll be notified when feedback is ready'
        ]
      }
    ]
  },
  strategy_session: {
    title: 'What to Expect',
    icon: Lightbulb,
    description: 'A personalized coaching call to help you plan your CRNA application journey.',
    sections: [
      {
        heading: 'During the Session',
        items: [
          'Review of your current situation and goals',
          'Deep dive into your specific questions',
          'Personalized recommendations and action items',
          'Resources and next steps'
        ]
      },
      {
        heading: 'Topics Often Covered',
        items: [
          'School selection and fit',
          'Timeline planning',
          'Strengthening your application',
          'Addressing weaknesses or gaps'
        ]
      }
    ]
  },
  school_qa: {
    title: 'What to Expect',
    icon: MessageSquare,
    description: 'An insider Q&A with a current student at your target program.',
    sections: [
      {
        heading: 'During the Session',
        items: [
          'Ask any questions about the program',
          'Get honest insights from a current student',
          'Learn what the program really looks for',
          'Understand the culture and student life'
        ]
      },
      {
        heading: 'Great Questions to Ask',
        items: [
          'What surprised you most about the program?',
          'What do they really look for in applicants?',
          'How is the work-life balance?',
          'What would you do differently if applying again?'
        ]
      }
    ]
  },
  resume_review: {
    title: 'What to Expect',
    icon: FileText,
    description: 'Professional feedback on your nursing resume for CRNA applications.',
    sections: [
      {
        heading: 'What You\'ll Receive',
        items: [
          'Line-by-line review of your resume',
          'Suggestions for highlighting ICU experience',
          'Formatting and presentation feedback',
          'Tips for making your resume stand out'
        ]
      },
      {
        heading: 'Areas Typically Covered',
        items: [
          'ICU experience presentation',
          'Leadership and certifications',
          'Education and achievements',
          'Overall structure and readability'
        ]
      }
    ]
  }
};

/**
 * Default expectations for unknown service types
 */
const DEFAULT_EXPECTATIONS = {
  title: 'What to Expect',
  icon: HelpCircle,
  description: 'Your mentor will guide you through a personalized session.',
  sections: [
    {
      heading: 'During the Session',
      items: [
        'Introduction and goal-setting',
        'Main session content',
        'Q&A and discussion',
        'Action items and next steps'
      ]
    }
  ]
};

export function WhatToExpectCard({ serviceType, className }) {
  const content = EXPECTATIONS_BY_TYPE[serviceType] || DEFAULT_EXPECTATIONS;
  const Icon = content.icon;

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className="w-5 h-5 text-primary" />
          {content.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">{content.description}</p>

        <div className="space-y-4">
          {content.sections.map((section, idx) => (
            <div key={idx}>
              <h4 className="font-medium text-sm text-gray-900 mb-2">
                {section.heading}
              </h4>
              <ul className="space-y-1.5">
                {section.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * How to Prepare checklist - service-specific preparation tips
 */
const PREP_BY_TYPE = {
  mock_interview: [
    { text: 'Review your personal statement for talking points', important: true },
    { text: 'Research your target programs thoroughly', important: true },
    { text: 'Prepare your "Tell me about yourself" answer', important: true },
    { text: 'Have 3-5 questions ready to ask your interviewer', important: false },
    { text: 'Test your camera and microphone before the session', important: true },
    { text: 'Find a quiet, well-lit space', important: false },
    { text: 'Dress professionally (at least from the waist up!)', important: false }
  ],
  essay_review: [
    { text: 'Upload your document before the deadline', important: true },
    { text: 'Note any specific areas you want feedback on', important: true },
    { text: 'Include the prompt/requirements if applicable', important: false },
    { text: 'Let your mentor know your deadline', important: true }
  ],
  strategy_session: [
    { text: 'Write down your top 3 questions/concerns', important: true },
    { text: 'Have your application timeline handy', important: false },
    { text: 'Know your target schools (or be ready to discuss)', important: true },
    { text: 'Have your transcript/GPA info available', important: false }
  ],
  school_qa: [
    { text: 'Research the program basics first', important: true },
    { text: 'Prepare specific questions (not easily Googleable)', important: true },
    { text: 'Know why you\'re interested in this program', important: false }
  ],
  resume_review: [
    { text: 'Upload your current resume', important: true },
    { text: 'Note any specific concerns about your resume', important: false },
    { text: 'Include the job posting if applying to specific roles', important: false }
  ]
};

export function HowToPrepareCard({ serviceType, className }) {
  const items = PREP_BY_TYPE[serviceType] || PREP_BY_TYPE.strategy_session;

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="w-5 h-5 text-primary" />
          How to Prepare
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {items.map((item, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3 text-sm"
            >
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className={item.important ? 'text-gray-900' : 'text-gray-600'}>
                {item.text}
                {item.important && <span className="text-red-500 ml-1">*</span>}
              </span>
            </li>
          ))}
        </ul>
        <p className="text-xs text-gray-500 mt-3">
          <span className="text-red-500">*</span> Recommended
        </p>
      </CardContent>
    </Card>
  );
}

export default WhatToExpectCard;
