/**
 * InquiryComposer Component
 *
 * Form for starting a new inquiry/conversation with a mentor.
 * Includes service type selection and message composition.
 */

import { useState } from 'react';
import { Send, MessageSquare, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

/**
 * Get initials from name
 */
function getInitials(name) {
  if (!name) return '??';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Service type options for inquiry
 */
const SERVICE_TYPES = [
  { value: 'general', label: 'General Question' },
  { value: 'mock_interview', label: 'Mock Interview' },
  { value: 'essay_review', label: 'Essay/Personal Statement Review' },
  { value: 'coaching', label: '1:1 Coaching Call' },
  { value: 'qa_call', label: 'Q&A Call' },
  { value: 'other', label: 'Other' }
];

/**
 * Suggested questions by service type
 */
const SUGGESTED_QUESTIONS = {
  general: [
    "What made you choose your CRNA program?",
    "How do you typically structure your sessions?",
    "What's your availability like over the next few weeks?"
  ],
  mock_interview: [
    "Do you focus on behavioral or traditional interview questions?",
    "How many mock interviews do you recommend before the real thing?",
    "Do you provide written feedback after the session?"
  ],
  essay_review: [
    "How many rounds of revisions are included?",
    "What's your typical turnaround time for feedback?",
    "Do you help with personal statements or just secondaries?"
  ],
  coaching: [
    "What topics do you typically cover in coaching sessions?",
    "Do you help with school selection based on my profile?",
    "What should I prepare before our first session?"
  ],
  qa_call: [
    "What aspects of your program would you like to share?",
    "Can you discuss the clinical rotation structure?",
    "What's the day-to-day life like as an SRNA?"
  ]
};

export function InquiryComposer({
  provider,
  services = [],
  onSend,
  onCancel,
  loading = false,
  className
}) {
  const [serviceType, setServiceType] = useState('general');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Get available service types based on provider's services
  const availableServiceTypes = SERVICE_TYPES.filter(type => {
    if (type.value === 'general' || type.value === 'other') return true;
    return services.some(s => s.type === type.value);
  });

  // Get suggested questions for selected service type
  const suggestedQuestions = SUGGESTED_QUESTIONS[serviceType] || SUGGESTED_QUESTIONS.general;

  // Handle suggestion click
  const handleSuggestionClick = (question) => {
    setMessage(prev => {
      if (prev.trim()) {
        return prev + '\n\n' + question;
      }
      return question;
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate message
    if (!message.trim()) {
      setError('Please enter a message');
      return;
    }

    if (message.trim().length < 20) {
      setError('Message must be at least 20 characters');
      return;
    }

    if (message.length > 1000) {
      setError('Message must be less than 1000 characters');
      return;
    }

    try {
      await onSend({
        providerId: provider.id,
        serviceType,
        message: message.trim()
      });
    } catch (err) {
      setError(err.message || 'Failed to send inquiry');
    }
  };

  const characterCount = message.length;

  return (
    <Card className={cn('', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageSquare className="w-5 h-5 text-primary" />
          Send an Inquiry
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Provider preview */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-4">
          <Avatar className="h-10 w-10">
            {provider.avatar && (
              <AvatarImage src={provider.avatar} alt={provider.name} />
            )}
            <AvatarFallback className="bg-primary/10">
              {getInitials(provider.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{provider.name}</p>
            <p className="text-sm text-gray-500">{provider.program}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Service type selector */}
          <div className="space-y-2">
            <Label htmlFor="service-type">What are you interested in?</Label>
            <Select
              value={serviceType}
              onValueChange={setServiceType}
              disabled={loading}
            >
              <SelectTrigger id="service-type">
                <SelectValue placeholder="Select a topic" />
              </SelectTrigger>
              <SelectContent>
                {availableServiceTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Message textarea */}
          <div className="space-y-2">
            <Label htmlFor="inquiry-message">Your Message</Label>
            <Textarea
              id="inquiry-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Hi ${provider.name?.split(' ')[0]}, I'm interested in...`}
              disabled={loading}
              className="min-h-[120px]"
              maxLength={1000}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Min 20 characters</span>
              <span className={characterCount > 900 ? 'text-yellow-600' : ''}>
                {characterCount}/1000
              </span>
            </div>
          </div>

          {/* Suggested questions */}
          {suggestedQuestions.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm text-gray-600">
                Not sure what to ask? Try one of these:
              </Label>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionClick(question)}
                    disabled={loading}
                    className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full text-gray-700 transition-colors text-left"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Response time info */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              {provider.name?.split(' ')[0]} typically responds within{' '}
              <strong>{provider.responseTime || '24 hours'}</strong>.
              You'll receive a notification when they reply.
            </AlertDescription>
          </Alert>

          {/* Error message */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={loading || !message.trim()}
              className="flex-1"
            >
              {loading ? (
                'Sending...'
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Inquiry
                </>
              )}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default InquiryComposer;
