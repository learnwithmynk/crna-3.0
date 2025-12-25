/**
 * ApplicationStatusPage
 *
 * Shows the status of a provider's application.
 * States: Pending, Approved (redirect to onboarding), Rejected (with reason), Info Needed.
 * Route: /marketplace/provider/application-status
 *
 * Features:
 * - Shows application timeline with verification status
 * - Displays admin messages and info requests
 * - Shows denial reason with reapply date if rejected
 * - Redirects to onboarding when approved
 */

import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Mail,
  ArrowRight,
  RefreshCw,
  Shield,
  Calendar,
  MessageSquare,
  Send,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  APPLICATION_STATUS,
  getApplicationByProviderId,
  getProviderInbox,
  sendProviderMessage,
} from '@/data/marketplace/mockAdminMessages';
import { format } from 'date-fns';

// Mock current provider ID - would come from auth context
const MOCK_PROVIDER_ID = 'provider_pending_002'; // Rachel Liu - has info_needed status

// Get application data for current provider
function useApplicationStatus(providerId) {
  // TODO: Replace with API call
  const application = getApplicationByProviderId(providerId);
  const inbox = getProviderInbox(providerId);

  return {
    application,
    conversation: inbox.conversation,
    messages: inbox.messages,
  };
}

const STATUS_CONFIG = {
  [APPLICATION_STATUS.PENDING]: {
    icon: Clock,
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    title: 'Application Under Review',
    description: 'Our team is reviewing your application. This typically takes 2-3 business days.'
  },
  [APPLICATION_STATUS.APPROVED]: {
    icon: CheckCircle2,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    title: 'Application Approved!',
    description: "Congratulations! You're ready to set up your mentor profile."
  },
  [APPLICATION_STATUS.DENIED]: {
    icon: XCircle,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    title: 'Application Not Approved',
    description: "We weren't able to approve your application at this time."
  },
  [APPLICATION_STATUS.INFO_NEEDED]: {
    icon: Info,
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    title: 'Additional Information Needed',
    description: 'We need some additional information to complete your application review.'
  }
};

export function ApplicationStatusPage() {
  const navigate = useNavigate();
  const { application, conversation, messages } = useApplicationStatus(MOCK_PROVIDER_ID);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Map application data to component state format
  const appData = useMemo(() => {
    if (!application) {
      // Fallback for no application found
      return {
        status: APPLICATION_STATUS.PENDING,
        submittedAt: new Date().toISOString(),
        licenseVerified: false,
        licenseStatus: 'Pending',
        denialReason: null,
        canReapplyAt: null,
        infoRequestMessage: null,
      };
    }
    return {
      status: application.status,
      submittedAt: application.submittedAt,
      licenseVerified: application.idVerificationStatus === 'verified',
      licenseStatus: application.idVerificationStatus === 'verified' ? 'Verified' : 'Pending',
      denialReason: application.denialReason,
      canReapplyAt: application.canReapplyAt,
      infoRequestMessage: application.infoRequestMessage,
    };
  }, [application]);

  // If approved, redirect to onboarding after short delay
  useEffect(() => {
    if (appData.status === APPLICATION_STATUS.APPROVED) {
      const timer = setTimeout(() => {
        navigate('/marketplace/provider/onboarding');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [appData.status, navigate]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // TODO: Fetch latest status from API
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const handleSendReply = async () => {
    if (!replyContent.trim()) return;

    setIsSending(true);
    // TODO: Replace with actual API call
    const result = sendProviderMessage(MOCK_PROVIDER_ID, replyContent);
    console.log('Reply sent:', result);

    await new Promise(resolve => setTimeout(resolve, 500));

    setIsSending(false);
    setReplyContent('');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const config = STATUS_CONFIG[appData.status] || STATUS_CONFIG[APPLICATION_STATUS.PENDING];
  const StatusIcon = config.icon;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-xl mx-auto px-4">
        {/* Status Card */}
        <Card className="mb-6">
          <CardContent className="p-8 text-center">
            {/* Status Icon */}
            <div className={cn(
              'w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6',
              config.iconBg
            )}>
              <StatusIcon className={cn('w-10 h-10', config.iconColor)} />
            </div>

            {/* Status Title */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {config.title}
            </h1>
            <p className="text-gray-600 mb-6">
              {config.description}
            </p>

            {/* Status-specific content */}
            {appData.status === APPLICATION_STATUS.PENDING && (
              <>
                {/* Timeline */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
                  <h3 className="font-medium text-gray-900 mb-3">What happens next?</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Application submitted</p>
                        <p className="text-sm text-gray-500">{formatDate(appData.submittedAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        'w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5',
                        appData.licenseVerified ? 'bg-green-100' : 'bg-gray-100'
                      )}>
                        {appData.licenseVerified ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        ) : (
                          <Clock className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">License verification</p>
                        <p className="text-sm text-gray-500">
                          {appData.licenseVerified
                            ? `Verified - Status: ${appData.licenseStatus}`
                            : 'In progress...'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                        <Clock className="w-4 h-4 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Team review</p>
                        <p className="text-sm text-gray-500">Usually 1-2 business days</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                        <Mail className="w-4 h-4 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Decision notification</p>
                        <p className="text-sm text-gray-500">We'll email you when ready</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  {isRefreshing ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Check Status
                    </>
                  )}
                </Button>
              </>
            )}

            {appData.status === APPLICATION_STATUS.INFO_NEEDED && (
              <>
                {/* Info Request Message */}
                {appData.infoRequestMessage && (
                  <div className="bg-orange-50 rounded-xl p-4 mb-6 text-left">
                    <div className="flex items-start gap-2">
                      <Info className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-orange-800 mb-1">What we need:</p>
                        <p className="text-orange-700 text-sm">{appData.infoRequestMessage}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Admin Messages */}
                {messages.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
                    <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Messages from CRNA Club Team
                    </h3>
                    <div className="space-y-3 max-h-48 overflow-y-auto">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={cn(
                            'rounded-xl p-3',
                            msg.senderRole === 'admin' ? 'bg-white border' : 'bg-primary/10'
                          )}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {msg.senderName} • {format(new Date(msg.createdAt), 'MMM d, h:mm a')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reply Section */}
                <div className="space-y-3 mb-6">
                  <Textarea
                    placeholder="Type your response here..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    rows={3}
                    className="bg-white"
                  />
                  <Button
                    onClick={handleSendReply}
                    disabled={!replyContent.trim() || isSending}
                    className="w-full"
                  >
                    {isSending ? (
                      <>Sending...</>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Response
                      </>
                    )}
                  </Button>
                </div>

                <p className="text-sm text-gray-500">
                  Once you provide the requested information, our team will continue reviewing your application.
                </p>
              </>
            )}

            {appData.status === APPLICATION_STATUS.APPROVED && (
              <>
                <div className="bg-green-50 rounded-xl p-4 mb-6">
                  <p className="text-green-800">
                    Redirecting you to set up your profile...
                  </p>
                </div>
                <Button asChild>
                  <Link to="/marketplace/provider/onboarding">
                    Continue to Profile Setup
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </>
            )}

            {appData.status === APPLICATION_STATUS.DENIED && (
              <>
                {appData.denialReason && (
                  <div className="bg-red-50 rounded-xl p-4 mb-6 text-left">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-red-800 mb-1">Reason:</p>
                        <p className="text-red-700 text-sm">{appData.denialReason}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Admin Messages for denied application */}
                {messages.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
                    <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Messages
                    </h3>
                    <div className="space-y-3 max-h-48 overflow-y-auto">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className="bg-white border rounded-xl p-3"
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {msg.senderName} • {format(new Date(msg.createdAt), 'MMM d, h:mm a')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {appData.canReapplyAt && (
                  <div className="bg-gray-50 rounded-xl p-4 mb-6 flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">You can reapply on:</p>
                      <p className="text-sm text-gray-600">
                        {formatDate(appData.canReapplyAt)}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 justify-center">
                  <Button variant="outline" asChild>
                    <Link to="/marketplace/become-a-mentor">
                      Learn More
                    </Link>
                  </Button>
                  {!appData.canReapplyAt && (
                    <Button asChild>
                      <Link to="/marketplace/provider/apply">
                        Reapply
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Help Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Have questions?</h3>
                <p className="text-sm text-gray-600 mb-3">
                  If you have any questions about your application or need to update your information,
                  please reach out to us.
                </p>
                <a
                  href="mailto:mentors@thecrnaclub.com"
                  className="text-sm text-primary hover:underline font-medium"
                >
                  mentors@thecrnaclub.com
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Note */}
        <div className="mt-6 flex items-center justify-center gap-2 text-gray-500 text-sm">
          <Shield className="w-4 h-4" />
          <span>Your information is secure and confidential</span>
        </div>
      </div>
    </div>
  );
}

export default ApplicationStatusPage;
