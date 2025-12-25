/**
 * ProviderInbox
 *
 * Inbox component for providers to view and respond to admin messages.
 * Shows messages about application status, info requests, check-ins.
 * Displayed on the provider dashboard.
 */

import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  Send,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  Info,
  Inbox,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import {
  getProviderInbox,
  getProviderUnreadCount,
  sendProviderMessage,
  MESSAGE_TYPES,
} from '@/data/marketplace/mockAdminMessages';
import { formatDistanceToNow, format } from 'date-fns';

// Message type icons and colors
const MESSAGE_STYLES = {
  [MESSAGE_TYPES.APPLICATION_UPDATE]: {
    icon: AlertCircle,
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-600',
  },
  [MESSAGE_TYPES.INFO_REQUEST]: {
    icon: Info,
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-600',
  },
  [MESSAGE_TYPES.CHECK_IN]: {
    icon: MessageSquare,
    bgColor: 'bg-green-100',
    textColor: 'text-green-600',
  },
  [MESSAGE_TYPES.SUPPORT]: {
    icon: MessageSquare,
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-600',
  },
  [MESSAGE_TYPES.SYSTEM]: {
    icon: Info,
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-500',
  },
};

function MessageBubble({ message, isFromProvider }) {
  const style = MESSAGE_STYLES[message.type] || MESSAGE_STYLES[MESSAGE_TYPES.SUPPORT];
  const Icon = style.icon;

  return (
    <div className={cn('flex gap-3', isFromProvider ? 'flex-row-reverse' : '')}>
      {/* Avatar */}
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className={cn(
          'text-xs',
          isFromProvider ? 'bg-purple-100 text-purple-600' : 'bg-primary/10 text-primary'
        )}>
          {isFromProvider ? 'You' : 'CC'}
        </AvatarFallback>
      </Avatar>

      {/* Message content */}
      <div className={cn(
        'flex-1 max-w-[80%]',
        isFromProvider ? 'text-right' : ''
      )}>
        <div className={cn(
          'inline-block rounded-xl px-4 py-2 text-sm',
          isFromProvider
            ? 'bg-purple-100 text-purple-900'
            : 'bg-gray-100 text-gray-900'
        )}>
          {/* Message type badge for admin messages */}
          {!isFromProvider && message.type !== MESSAGE_TYPES.SUPPORT && (
            <div className="flex items-center gap-1 mb-1">
              <Icon className="w-3 h-3" />
              <span className="text-xs font-medium opacity-70">
                {message.type === MESSAGE_TYPES.APPLICATION_UPDATE && 'Application Update'}
                {message.type === MESSAGE_TYPES.INFO_REQUEST && 'Info Needed'}
                {message.type === MESSAGE_TYPES.CHECK_IN && 'Check-in'}
              </span>
            </div>
          )}
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
        <div className={cn(
          'text-xs text-gray-500 mt-1',
          isFromProvider ? 'text-right' : ''
        )}>
          {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
          {!isFromProvider && !message.readAt && (
            <Badge variant="secondary" className="ml-2 text-[10px] px-1 py-0">
              New
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProviderInbox({ providerId, className }) {
  const [isOpen, setIsOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Get inbox data
  const { conversation, messages } = getProviderInbox(providerId);
  const unreadCount = getProviderUnreadCount(providerId);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Handle send message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    setIsSending(true);
    try {
      // TODO: Replace with actual API call
      const result = sendProviderMessage(providerId, newMessage.trim());
      if (result.success) {
        setNewMessage('');
        // In real implementation, would refetch messages
      }
    } finally {
      setIsSending(false);
    }
  };

  // Handle key press (Enter to send)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Empty state - no conversation yet
  if (!conversation) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Inbox className="w-5 h-5" />
            Admin Messages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-gray-500">
            <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No messages yet</p>
            <p className="text-xs text-gray-400 mt-1">
              Questions? Contact us at mentors@thecrnaclub.com
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="pb-3 cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Inbox className="w-5 h-5" />
                Admin Messages
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-1">
                    {unreadCount} new
                  </Badge>
                )}
              </CardTitle>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                {isOpen ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            </div>
            {!isOpen && messages.length > 0 && (
              <p className="text-sm text-gray-500 truncate mt-1">
                {messages[messages.length - 1].content.slice(0, 60)}...
              </p>
            )}
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0">
            {/* Messages list */}
            <div className="max-h-80 overflow-y-auto space-y-4 mb-4 pr-2">
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isFromProvider={message.senderRole === 'provider'}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply input */}
            <div className="border-t pt-4">
              <div className="flex gap-2">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="resize-none min-h-[60px]"
                  rows={2}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isSending}
                  size="icon"
                  className="h-[60px] w-[60px] shrink-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

/**
 * Compact badge version for showing in header or sidebar
 */
export function ProviderInboxBadge({ providerId }) {
  const unreadCount = getProviderUnreadCount(providerId);

  if (unreadCount === 0) return null;

  return (
    <Badge variant="destructive" className="ml-1">
      {unreadCount}
    </Badge>
  );
}

export default ProviderInbox;
