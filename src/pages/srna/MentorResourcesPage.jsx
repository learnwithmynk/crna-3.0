/**
 * MentorResourcesPage
 *
 * Central hub for mentor training materials, templates, and support.
 * Route: /marketplace/provider/resources
 *
 * Features:
 * - Hero section with welcome message
 * - Getting Started (onboarding video, quick start guide, FAQs)
 * - Training Materials (videos, PDFs, guides)
 * - Templates (feedback, checklists, email templates)
 * - Community & Support (forum link, contact, office hours)
 * - Social Media Kit (shareable graphics, captions)
 */

import { Link } from 'react-router-dom';
import {
  PlayCircle,
  FileText,
  Download,
  ExternalLink,
  MessageSquare,
  Mail,
  Calendar,
  CheckCircle2,
  BookOpen,
  Users,
  Image,
  Clock,
  FileDown,
  Video,
  Share2,
  Rocket
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// MOCK DATA - Replace with API call

const gettingStartedItems = [
  {
    id: 'onboarding_video',
    type: 'video',
    title: 'Welcome to CRNA Club Mentorship',
    description: 'Everything you need to know to get started as a mentor',
    duration: '12 min',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
    thumbnail: null,
  },
  {
    id: 'quick_start',
    type: 'guide',
    title: 'Quick Start Guide',
    description: 'Essential steps for your first 30 days',
    items: [
      'Complete your profile with video intro and bio',
      'Set up at least 2-3 service offerings',
      'Configure your availability and instant book settings',
      'Connect your Stripe account for payments',
      'Respond to your first booking request within 24 hours',
      'Join the Mentor Community forum',
      'Review best practices for each service type'
    ]
  }
];

const trainingMaterials = [
  {
    id: 'training_001',
    type: 'video',
    title: 'Mock Interview Best Practices',
    description: 'How to conduct effective mock interviews that prepare applicants for success',
    duration: '18 min',
    category: 'Mock Interviews',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
  },
  {
    id: 'training_002',
    type: 'video',
    title: 'Essay Review Techniques',
    description: 'Providing constructive feedback that improves personal statements',
    duration: '15 min',
    category: 'Essay Review',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
  },
  {
    id: 'training_003',
    type: 'video',
    title: 'Building Rapport with Applicants',
    description: 'Creating a supportive and professional mentoring relationship',
    duration: '10 min',
    category: 'General',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
  },
  {
    id: 'training_004',
    type: 'pdf',
    title: 'Mock Interview Question Bank',
    description: 'Comprehensive list of behavioral and clinical questions with sample answers',
    pages: 24,
    category: 'Mock Interviews',
    downloadUrl: '#', // Placeholder
  },
  {
    id: 'training_005',
    type: 'pdf',
    title: 'Essay Review Rubric',
    description: 'Structured framework for evaluating personal statements',
    pages: 6,
    category: 'Essay Review',
    downloadUrl: '#', // Placeholder
  },
  {
    id: 'training_006',
    type: 'guide',
    title: 'Handling Difficult Situations',
    description: 'How to navigate challenging client interactions professionally',
    pages: 8,
    category: 'General',
    downloadUrl: '#', // Placeholder
  }
];

const templates = [
  {
    id: 'template_001',
    type: 'feedback',
    title: 'Mock Interview Feedback Template',
    description: 'Structured template for providing comprehensive interview feedback',
    downloadUrl: '#',
  },
  {
    id: 'template_002',
    type: 'feedback',
    title: 'Essay Review Template',
    description: 'Template for line-by-line and overall essay feedback',
    downloadUrl: '#',
  },
  {
    id: 'template_003',
    type: 'checklist',
    title: 'Session Preparation Checklist',
    description: 'Pre-session checklist to ensure you re fully prepared',
    downloadUrl: '#',
  },
  {
    id: 'template_004',
    type: 'email',
    title: 'Booking Confirmation Email',
    description: 'Template for confirming bookings with clients',
    downloadUrl: '#',
  },
  {
    id: 'template_005',
    type: 'email',
    title: 'Session Reminder Email',
    description: 'Reminder template to send 24 hours before sessions',
    downloadUrl: '#',
  },
  {
    id: 'template_006',
    type: 'email',
    title: 'Follow-up Email Template',
    description: 'Post-session follow-up to check in with clients',
    downloadUrl: '#',
  }
];

const socialMediaKit = [
  {
    id: 'social_001',
    title: 'Instagram Story Template',
    description: 'Branded story template announcing your services',
    format: 'PNG (1080x1920)',
    downloadUrl: '#',
  },
  {
    id: 'social_002',
    title: 'Instagram Post Template',
    description: 'Square post template for feed',
    format: 'PNG (1080x1080)',
    downloadUrl: '#',
  },
  {
    id: 'social_003',
    title: 'Facebook Cover Photo',
    description: 'Cover photo showcasing your mentor status',
    format: 'PNG (1640x856)',
    downloadUrl: '#',
  },
  {
    id: 'social_004',
    title: 'LinkedIn Banner',
    description: 'Professional banner for LinkedIn profile',
    format: 'PNG (1584x396)',
    downloadUrl: '#',
  }
];

const captionTemplates = [
  {
    id: 'caption_001',
    title: 'Service Announcement',
    template: "🎯 Now offering [SERVICE NAME] to help CRNA applicants succeed! As a current SRNA at [YOUR SCHOOL], I know what it takes to get accepted. Let's work together on your journey! Book a session at crnaclub.com/mentors/[YOUR-PROFILE] #CRNASchool #NurseAnesthesia #CRNAClub"
  },
  {
    id: 'caption_002',
    title: 'Success Story',
    template: "So proud of [CLIENT NAME] who just got accepted to [SCHOOL]! 🎉 It's been amazing watching your growth through our mock interviews. If you're applying to CRNA school and need guidance, I'd love to help! Link in bio. #CRNASchool #CRNAClub #NurseAnesthesia"
  },
  {
    id: 'caption_003',
    title: 'Tips & Insights',
    template: "Insider tip for [SCHOOL] applicants: [YOUR TIP]. Want more personalized advice for your application? I offer 1-on-1 sessions to help you stand out. Book at crnaclub.com/mentors/[YOUR-PROFILE] #CRNASchool #CRNAClub"
  }
];

const supportInfo = {
  forumLink: '/community/groups/mentor-lounge',
  supportEmail: 'mentorsupport@crnaclub.com',
  officeHours: [
    { day: 'Tuesday', time: '7:00 PM - 8:00 PM EST', type: 'Q&A Session' },
    { day: 'Thursday', time: '12:00 PM - 1:00 PM EST', type: 'Office Hours' }
  ]
};

// Resource Type Badge Component
function ResourceTypeBadge({ type }) {
  const variants = {
    video: { icon: Video, label: 'Video', className: 'bg-purple-100 text-purple-700 border-purple-200' },
    pdf: { icon: FileText, label: 'PDF', className: 'bg-red-100 text-red-700 border-red-200' },
    guide: { icon: BookOpen, label: 'Guide', className: 'bg-blue-100 text-blue-700 border-blue-200' },
    feedback: { icon: MessageSquare, label: 'Template', className: 'bg-green-100 text-green-700 border-green-200' },
    checklist: { icon: CheckCircle2, label: 'Checklist', className: 'bg-orange-100 text-orange-700 border-orange-200' },
    email: { icon: Mail, label: 'Email', className: 'bg-indigo-100 text-indigo-700 border-indigo-200' }
  };

  const variant = variants[type] || variants.guide;
  const Icon = variant.icon;

  return (
    <Badge variant="outline" className={variant.className}>
      <Icon className="w-3 h-3 mr-1" />
      {variant.label}
    </Badge>
  );
}

// Training Material Card
function TrainingMaterialCard({ material }) {
  const isVideo = material.type === 'video';
  const isPdf = material.type === 'pdf';

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <ResourceTypeBadge type={material.type} />
          {material.category && (
            <Badge variant="outline" className="bg-gray-50">
              {material.category}
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg">{material.title}</CardTitle>
        <CardDescription>{material.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {isVideo && (
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {material.duration}
              </span>
            )}
            {isPdf && (
              <span className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                {material.pages} pages
              </span>
            )}
          </div>
          <Button size="sm" variant="default">
            {isVideo ? (
              <>
                <PlayCircle className="w-4 h-4 mr-2" />
                Watch
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Download
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Template Card
function TemplateCard({ template }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="mb-2">
          <ResourceTypeBadge type={template.type} />
        </div>
        <CardTitle className="text-base">{template.title}</CardTitle>
        <CardDescription className="text-sm">{template.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button size="sm" variant="outline" className="w-full">
          <Download className="w-4 h-4 mr-2" />
          Download Template
        </Button>
      </CardContent>
    </Card>
  );
}

// Social Media Kit Card
function SocialMediaKitCard({ item }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-base">{item.title}</CardTitle>
        <CardDescription className="text-sm">
          {item.description}
          <br />
          <span className="text-xs text-gray-500">{item.format}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button size="sm" variant="outline" className="w-full">
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </CardContent>
    </Card>
  );
}

export function MentorResourcesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-8">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <Rocket className="w-8 h-8 text-gray-900" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Mentor Resources
          </h1>
          <p className="text-xl text-gray-600">
            Everything you need to succeed as a CRNA Club mentor
          </p>
        </div>

        {/* Getting Started Section */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Getting Started</h2>
            <p className="text-gray-600">Your roadmap to becoming a successful mentor</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Onboarding Video */}
            <Card>
              <CardHeader>
                <div className="mb-2">
                  <ResourceTypeBadge type="video" />
                </div>
                <CardTitle>{gettingStartedItems[0].title}</CardTitle>
                <CardDescription>{gettingStartedItems[0].description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Video Placeholder */}
                <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <PlayCircle className="w-16 h-16 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-500">Video: {gettingStartedItems[0].duration}</p>
                  </div>
                </div>
                <Button className="w-full">
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Watch Now
                </Button>
              </CardContent>
            </Card>

            {/* Quick Start Guide */}
            <Card>
              <CardHeader>
                <div className="mb-2">
                  <ResourceTypeBadge type="guide" />
                </div>
                <CardTitle>{gettingStartedItems[1].title}</CardTitle>
                <CardDescription>{gettingStartedItems[1].description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2">
                  {gettingStartedItems[1].items.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/help/mentor-faq">
                    <BookOpen className="w-4 h-4 mr-2" />
                    View Full FAQs
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Training Materials Section */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Training Materials</h2>
            <p className="text-gray-600">Video tutorials, guides, and best practices</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainingMaterials.map((material) => (
              <TrainingMaterialCard key={material.id} material={material} />
            ))}
          </div>
        </section>

        {/* Templates Section */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Templates & Checklists</h2>
            <p className="text-gray-600">Save time with our ready-to-use templates</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        </section>

        {/* Community & Support Section */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Community & Support</h2>
            <p className="text-gray-600">Connect with other mentors and get help when you need it</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Mentor Community */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Mentor Community</CardTitle>
                <CardDescription>
                  Join our private forum to share tips, ask questions, and network with fellow mentors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <Link to={supportInfo.forumLink}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Join Forum
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Support Contact */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Support Team</CardTitle>
                <CardDescription>
                  Have questions or need help? Our support team is here for you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <a href={`mailto:${supportInfo.supportEmail}`}>
                    <Mail className="w-4 h-4 mr-2" />
                    Email Support
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Office Hours */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Office Hours</CardTitle>
                <CardDescription>
                  Join our weekly live sessions for Q&A and mentor support
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {supportInfo.officeHours.map((session, index) => (
                  <div key={index} className="text-sm">
                    <p className="font-medium text-gray-900">{session.day}</p>
                    <p className="text-gray-600">{session.time}</p>
                    <p className="text-xs text-gray-500">{session.type}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Social Media Kit Section */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Social Media Kit</h2>
            <p className="text-gray-600">Promote your services with our branded graphics and templates</p>
          </div>

          {/* Graphics */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Image className="w-5 h-5" />
              Shareable Graphics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {socialMediaKit.map((item) => (
                <SocialMediaKitCard key={item.id} item={item} />
              ))}
            </div>
            <div className="mt-4 text-center">
              <Button>
                <Download className="w-4 h-4 mr-2" />
                Download All Graphics
              </Button>
            </div>
          </div>

          {/* Caption Templates */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              Caption Templates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {captionTemplates.map((caption) => (
                <Card key={caption.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-base">{caption.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-xl mb-3 italic">
                      "{caption.template}"
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        navigator.clipboard.writeText(caption.template);
                        // TODO: Show toast notification
                      }}
                    >
                      <FileDown className="w-4 h-4 mr-2" />
                      Copy Template
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Need Something Else?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Can't find what you're looking for? We're always adding new resources based on mentor feedback.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button asChild>
                <a href={`mailto:${supportInfo.supportEmail}`}>
                  <Mail className="w-4 h-4 mr-2" />
                  Request a Resource
                </a>
              </Button>
              <Button variant="outline" asChild>
                <Link to={supportInfo.forumLink}>
                  <Users className="w-4 h-4 mr-2" />
                  Ask the Community
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default MentorResourcesPage;
