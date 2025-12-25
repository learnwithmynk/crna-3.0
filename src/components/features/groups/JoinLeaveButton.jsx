/**
 * JoinLeaveButton Component
 *
 * Button for joining or leaving a group.
 * Handles public vs private groups (request vs join).
 */

import { useState } from 'react';
import { UserPlus, UserMinus, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function JoinLeaveButton({
  isMember = false,
  isPrivate = false,
  isPending = false,
  onJoin,
  onLeave,
  onRequestJoin,
  size = 'default',
  className
}) {
  const [loading, setLoading] = useState(false);

  const handleAction = async () => {
    setLoading(true);
    try {
      if (isMember) {
        await onLeave?.();
      } else if (isPrivate && !isPending) {
        await onRequestJoin?.();
      } else {
        await onJoin?.();
      }
    } finally {
      setLoading(false);
    }
  };

  // Pending request state
  if (isPending) {
    return (
      <Button
        variant="outline"
        size={size}
        disabled
        className={cn('cursor-not-allowed', className)}
      >
        <Clock className="w-4 h-4 mr-2" />
        Pending
      </Button>
    );
  }

  // Member - show leave button
  if (isMember) {
    return (
      <Button
        variant="outline"
        size={size}
        onClick={handleAction}
        disabled={loading}
        className={cn('hover:bg-red-50 hover:text-red-600 hover:border-red-200', className)}
      >
        <UserMinus className="w-4 h-4 mr-2" />
        {loading ? 'Leaving...' : 'Leave Group'}
      </Button>
    );
  }

  // Not a member - show join/request button
  return (
    <Button
      size={size}
      onClick={handleAction}
      disabled={loading}
      className={className}
    >
      <UserPlus className="w-4 h-4 mr-2" />
      {loading
        ? (isPrivate ? 'Requesting...' : 'Joining...')
        : (isPrivate ? 'Request to Join' : 'Join Group')
      }
    </Button>
  );
}

export default JoinLeaveButton;
