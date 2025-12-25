/**
 * ServiceTemplates Component
 *
 * Provides pre-written service descriptions to help mentors who aren't
 * professional contractors write better, more compelling service descriptions.
 *
 * Features:
 * - Templates for each service type (Mock Interview, Essay Review, Coaching, Q&A)
 * - One-click copy to service description
 * - Customizable after selection
 * - Visual indicator showing which templates have been used
 * - Expandable preview of template text
 */

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Check, Copy, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const SERVICE_TEMPLATES = {
  mock_interview: {
    title: 'Mock Interview',
    description: "I'll simulate a real CRNA program interview, covering behavioral questions, clinical scenarios, and program-specific topics. You'll receive honest, constructive feedback on your answers, body language, and presentation. I'll help you identify areas for improvement and build confidence for the real thing.",
    icon: FileText,
  },
  essay_review: {
    title: 'Essay Review',
    description: "I'll provide detailed feedback on your personal statement or secondary essays. I'll focus on story structure, authenticity, and what makes YOU stand out. You'll get specific suggestions for improvement, not just grammar fixes. My goal is to help your unique voice shine through.",
    icon: FileText,
  },
  coaching: {
    title: 'Coaching/Strategy',
    description: "Whether you're just starting to explore CRNA school or fine-tuning your application strategy, I'll help you create a clear action plan. We'll discuss school selection, timeline, strengthening weak areas, and what programs are really looking for.",
    icon: FileText,
  },
  qa_call: {
    title: 'Q&A Call',
    description: "Got questions about the CRNA journey? Let's chat! No formal structure - just an open conversation where you can ask anything about ICU experience, applications, student life, or what to expect. I'll share my honest experiences and advice.",
    icon: FileText,
  },
};

export function ServiceTemplates({
  serviceType,
  onSelectTemplate,
  currentDescription = ''
}) {
  const [expandedTemplate, setExpandedTemplate] = useState(null);
  const [copiedTemplate, setCopiedTemplate] = useState(null);

  // Determine which templates to show
  // If serviceType is specified, show only that one
  // If not specified, show all templates
  const templatesToShow = serviceType
    ? { [serviceType]: SERVICE_TEMPLATES[serviceType] }
    : SERVICE_TEMPLATES;

  const handleSelectTemplate = (type, description) => {
    onSelectTemplate(description);
    setCopiedTemplate(type);

    // Reset copied state after 2 seconds
    setTimeout(() => {
      setCopiedTemplate(null);
    }, 2000);
  };

  const toggleExpanded = (type) => {
    setExpandedTemplate(expandedTemplate === type ? null : type);
  };

  const isTemplateUsed = (description) => {
    // Check if current description contains significant portion of template
    return currentDescription.includes(description.substring(0, 50));
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Service Description Templates
        </h3>
        <p className="text-sm text-gray-600">
          Choose a template to get started, then customize it to match your style and expertise.
        </p>
      </div>

      {/* Template Cards */}
      <div className="space-y-3">
        {Object.entries(templatesToShow).map(([type, template]) => {
          const Icon = template.icon;
          const isExpanded = expandedTemplate === type;
          const isCopied = copiedTemplate === type;
          const isUsed = isTemplateUsed(template.description);

          return (
            <Card
              key={type}
              className={cn(
                "transition-all",
                isUsed && "border-green-300 bg-green-50"
              )}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={cn(
                      "p-2 rounded-xl",
                      isUsed ? "bg-green-200" : "bg-gray-100"
                    )}>
                      <Icon className={cn(
                        "w-5 h-5",
                        isUsed ? "text-green-700" : "text-gray-600"
                      )} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base">
                          {template.title}
                        </CardTitle>
                        {isUsed && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-200 text-green-800 text-xs font-medium">
                            <Check className="w-3 h-3" />
                            Used
                          </span>
                        )}
                      </div>
                      <CardDescription className="mt-1">
                        Click to preview and use this template
                      </CardDescription>
                    </div>
                  </div>

                  {/* Expand/Collapse Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleExpanded(type)}
                    className="shrink-0"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>

              {/* Expanded Content */}
              {isExpanded && (
                <>
                  <CardContent className="pt-0 pb-3">
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                        {template.description}
                      </p>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-0">
                    <Button
                      onClick={() => handleSelectTemplate(type, template.description)}
                      className="w-full"
                      disabled={isCopied}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Copied to Description!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Use This Template
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </>
              )}
            </Card>
          );
        })}
      </div>

      {/* Tips Section */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">
          Tips for Customizing Your Description
        </h4>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Add specific details about your program or experience</li>
          <li>Mention any unique expertise or specializations</li>
          <li>Keep it conversational and authentic to your voice</li>
          <li>Include what applicants will walk away with</li>
          <li>Be honest about what you can and can't help with</li>
        </ul>
      </div>
    </div>
  );
}

// Optional: Export template data for use elsewhere
export { SERVICE_TEMPLATES };
