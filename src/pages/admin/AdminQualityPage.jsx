/**
 * AdminQualityPage
 *
 * Manage content quality and moderation.
 * Features: Flagged reviews, flagged messages (contact exchange attempts),
 * reported content, remove/approve actions.
 * Route: /admin/marketplace/quality
 */

import { useState, useMemo } from 'react';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertTriangle,
  MessageSquare,
  Star,
  Flag,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  Shield,
  Ban,
  Mail,
  Phone,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

// Mock flagged content data
const CONTENT_TYPE = {
  REVIEW: 'review',
  MESSAGE: 'message',
  PROFILE: 'profile',
};

const FLAG_REASON = {
  INAPPROPRIATE: 'inappropriate',
  SPAM: 'spam',
  CONTACT_EXCHANGE: 'contact_exchange',
  FALSE_INFO: 'false_information',
  HARASSMENT: 'harassment',
  OTHER: 'other',
};

const mockFlaggedContent = [
  {
    id: 'flag_001',
    contentType: CONTENT_TYPE.REVIEW,
    contentId: 'review_flagged_001',
    content: 'This mentor was terrible! Total waste of money. Don\'t book with them unless you want to throw away $100.',
    authorId: 'user_angry_001',
    authorName: 'Anonymous Reviewer',
    targetId: 'provider_001',
    targetName: 'Sarah Chen',
    reason: FLAG_REASON.INAPPROPRIATE,
    reportedBy: 'provider_001',
    reporterName: 'Sarah Chen',
    reportNotes: 'This review is defamatory and doesn\'t reflect what happened in our session.',
    status: 'pending',
    rating: 1,
    createdAt: '2024-12-09T14:00:00Z',
  },
  {
    id: 'flag_002',
    contentType: CONTENT_TYPE.MESSAGE,
    contentId: 'message_flagged_001',
    content: 'Hey! You can reach me directly at john.smith@gmail.com or text me at 555-123-4567 so we can skip the platform fees.',
    authorId: 'provider_suspicious_001',
    authorName: 'John Smith',
    targetId: 'user_002',
    targetName: 'Emily Davis',
    reason: FLAG_REASON.CONTACT_EXCHANGE,
    reportedBy: 'system',
    reporterName: 'Automated Detection',
    reportNotes: 'Message contains email address and phone number - possible attempt to circumvent platform.',
    status: 'pending',
    createdAt: '2024-12-10T09:30:00Z',
  },
  {
    id: 'flag_003',
    contentType: CONTENT_TYPE.MESSAGE,
    contentId: 'message_flagged_002',
    content: 'Check out my Instagram @fakementor for more tips! DM me there for special rates.',
    authorId: 'provider_002',
    authorName: 'Marcus Johnson',
    targetId: 'user_003',
    targetName: 'Alex Wilson',
    reason: FLAG_REASON.CONTACT_EXCHANGE,
    reportedBy: 'system',
    reporterName: 'Automated Detection',
    reportNotes: 'Social media handle detected - possible off-platform solicitation.',
    status: 'pending',
    createdAt: '2024-12-10T11:00:00Z',
  },
  {
    id: 'flag_004',
    contentType: CONTENT_TYPE.PROFILE,
    contentId: 'provider_profile_flagged_001',
    content: 'Bio contains: "I guarantee you\'ll get into your top choice program or your money back!"',
    authorId: 'provider_new_001',
    authorName: 'New Provider',
    reason: FLAG_REASON.FALSE_INFO,
    reportedBy: 'user_005',
    reporterName: 'Jane Doe',
    reportNotes: 'Making false guarantees about CRNA school admissions.',
    status: 'pending',
    createdAt: '2024-12-08T16:00:00Z',
  },
];

const REASON_LABELS = {
  [FLAG_REASON.INAPPROPRIATE]: 'Inappropriate Content',
  [FLAG_REASON.SPAM]: 'Spam',
  [FLAG_REASON.CONTACT_EXCHANGE]: 'Contact Exchange Attempt',
  [FLAG_REASON.FALSE_INFO]: 'False Information',
  [FLAG_REASON.HARASSMENT]: 'Harassment',
  [FLAG_REASON.OTHER]: 'Other',
};

const CONTENT_TYPE_LABELS = {
  [CONTENT_TYPE.REVIEW]: 'Review',
  [CONTENT_TYPE.MESSAGE]: 'Message',
  [CONTENT_TYPE.PROFILE]: 'Profile',
};

function ContentIcon({ type }) {
  switch (type) {
    case CONTENT_TYPE.REVIEW:
      return <Star className="w-4 h-4" />;
    case CONTENT_TYPE.MESSAGE:
      return <MessageSquare className="w-4 h-4" />;
    case CONTENT_TYPE.PROFILE:
      return <Shield className="w-4 h-4" />;
    default:
      return <Flag className="w-4 h-4" />;
  }
}

function FlaggedContentCard({ item, onReview, onApprove, onRemove }) {
  const isContactExchange = item.reason === FLAG_REASON.CONTACT_EXCHANGE;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <ContentIcon type={item.contentType} />
              {CONTENT_TYPE_LABELS[item.contentType]}
            </Badge>
            <Badge
              variant="outline"
              className={isContactExchange ? 'bg-red-50 text-red-800' : 'bg-yellow-50 text-yellow-800'}
            >
              {REASON_LABELS[item.reason]}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
          </div>
        </div>

        {/* Content Preview */}
        <div className="p-3 bg-gray-50 rounded-xl mb-4">
          {item.contentType === CONTENT_TYPE.REVIEW && item.rating && (
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < item.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                />
              ))}
            </div>
          )}
          <p className="text-sm">
            {isContactExchange ? (
              // Highlight potential contact info
              <span>
                {item.content.split(/(\S+@\S+|\d{3}[-.\s]?\d{3}[-.\s]?\d{4}|@\w+)/g).map((part, i) => {
                  if (part.match(/\S+@\S+|\d{3}[-.\s]?\d{3}[-.\s]?\d{4}|@\w+/)) {
                    return (
                      <span key={i} className="bg-red-100 text-red-800 px-1 rounded">
                        {part}
                      </span>
                    );
                  }
                  return part;
                })}
              </span>
            ) : (
              item.content
            )}
          </p>
        </div>

        {/* Author & Target */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <Label className="text-xs text-muted-foreground">Author</Label>
            <p className="font-medium">{item.authorName}</p>
          </div>
          {item.targetName && (
            <div>
              <Label className="text-xs text-muted-foreground">Target</Label>
              <p className="font-medium">{item.targetName}</p>
            </div>
          )}
        </div>

        {/* Report Info */}
        <div className="p-3 bg-orange-50 rounded-xl mb-4">
          <div className="flex items-center gap-2 mb-1">
            <Flag className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-800">
              Reported by {item.reporterName}
            </span>
          </div>
          {item.reportNotes && (
            <p className="text-sm text-orange-700">{item.reportNotes}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={() => onApprove(item)}>
            <CheckCircle className="w-4 h-4 mr-2" />
            Keep Content
          </Button>
          <Button variant="destructive" className="flex-1" onClick={() => onRemove(item)}>
            <Trash2 className="w-4 h-4 mr-2" />
            Remove
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function AdminQualityPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [actionNotes, setActionNotes] = useState('');
  const [warnUser, setWarnUser] = useState(false);

  // Filter content by type
  const content = useMemo(() => ({
    all: mockFlaggedContent.filter(c => c.status === 'pending'),
    reviews: mockFlaggedContent.filter(c => c.contentType === CONTENT_TYPE.REVIEW && c.status === 'pending'),
    messages: mockFlaggedContent.filter(c => c.contentType === CONTENT_TYPE.MESSAGE && c.status === 'pending'),
    profiles: mockFlaggedContent.filter(c => c.contentType === CONTENT_TYPE.PROFILE && c.status === 'pending'),
  }), []);

  // Count contact exchange attempts
  const contactExchangeCount = mockFlaggedContent.filter(
    c => c.reason === FLAG_REASON.CONTACT_EXCHANGE && c.status === 'pending'
  ).length;

  const handleApprove = (item) => {
    setSelectedItem(item);
    setActionNotes('');
    setShowApproveDialog(true);
  };

  const handleRemove = (item) => {
    setSelectedItem(item);
    setActionNotes('');
    setWarnUser(item.reason === FLAG_REASON.CONTACT_EXCHANGE);
    setShowRemoveDialog(true);
  };

  const confirmApprove = () => {
    // TODO: API call to approve content
    console.log('Approve content:', selectedItem?.id, { notes: actionNotes });
    setShowApproveDialog(false);
    setSelectedItem(null);
  };

  const confirmRemove = () => {
    // TODO: API call to remove content and optionally warn user
    console.log('Remove content:', selectedItem?.id, { notes: actionNotes, warnUser });
    setShowRemoveDialog(false);
    setSelectedItem(null);
  };

  const breadcrumbs = [
    { label: 'Admin', href: '/admin' },
    { label: 'Marketplace', href: '/admin/marketplace' },
    { label: 'Quality & Moderation' },
  ];

  return (
    <PageWrapper
      title="Quality & Moderation"
      description="Review flagged content and maintain platform quality"
      breadcrumbs={breadcrumbs}
    >
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{content.all.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Flagged Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{content.reviews.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Flagged Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{content.messages.length}</div>
          </CardContent>
        </Card>
        <Card className={contactExchangeCount > 0 ? 'border-red-200 bg-red-50' : ''}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Contact Exchange</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${contactExchangeCount > 0 ? 'text-red-600' : ''}`}>
              {contactExchangeCount}
            </div>
            {contactExchangeCount > 0 && (
              <p className="text-xs text-red-600">Priority review needed</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Alert for contact exchange attempts */}
      {contactExchangeCount > 0 && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <p className="font-medium text-red-800">
                  {contactExchangeCount} contact exchange attempt{contactExchangeCount !== 1 ? 's' : ''} detected
                </p>
                <p className="text-sm text-red-600">
                  Users may be trying to circumvent platform fees. Review and take action.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all" className="gap-2">
            All
            {content.all.length > 0 && (
              <Badge variant="secondary">{content.all.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({content.reviews.length})</TabsTrigger>
          <TabsTrigger value="messages">Messages ({content.messages.length})</TabsTrigger>
          <TabsTrigger value="profiles">Profiles ({content.profiles.length})</TabsTrigger>
        </TabsList>

        {['all', 'reviews', 'messages', 'profiles'].map(tab => (
          <TabsContent key={tab} value={tab} className="mt-4">
            {content[tab].length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                  <p>No flagged content to review</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {content[tab].map(item => (
                  <FlaggedContentCard
                    key={item.id}
                    item={item}
                    onApprove={handleApprove}
                    onRemove={handleRemove}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Keep Content</DialogTitle>
            <DialogDescription>
              This content will remain visible on the platform.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="p-3 bg-green-50 rounded-xl">
              <p className="text-sm text-green-800">
                The flagged content will be marked as reviewed and remain on the platform.
              </p>
            </div>
            <div className="space-y-2">
              <Label>Notes (optional)</Label>
              <Textarea
                placeholder="Add any notes about this decision..."
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmApprove} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="w-4 h-4 mr-2" />
              Keep Content
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Dialog */}
      <Dialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Content</DialogTitle>
            <DialogDescription>
              This content will be removed from the platform.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="p-3 bg-red-50 rounded-xl">
              <p className="text-sm text-red-800">
                The content will be permanently removed. This action cannot be undone.
              </p>
            </div>

            {selectedItem?.reason === FLAG_REASON.CONTACT_EXCHANGE && (
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
                <input
                  type="checkbox"
                  id="warn-user"
                  checked={warnUser}
                  onChange={(e) => setWarnUser(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="warn-user" className="text-sm text-orange-800">
                  <span className="font-medium">Send warning to user</span>
                  <br />
                  <span className="text-orange-600">
                    User will be notified that contact exchange attempts violate platform terms.
                  </span>
                </label>
              </div>
            )}

            <div className="space-y-2">
              <Label>Reason for removal</Label>
              <Textarea
                placeholder="Explain why this content is being removed..."
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRemoveDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmRemove}>
              <Trash2 className="w-4 h-4 mr-2" />
              Remove Content
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );
}

export default AdminQualityPage;
