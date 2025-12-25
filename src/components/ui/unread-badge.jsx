/**
 * UnreadBadge Component
 *
 * Displays a notification badge for unread counts.
 * Used for messages, forum notifications, etc.
 *
 * Usage:
 *   <UnreadBadge count={5} />
 *   <UnreadBadge count={unreadMessages} max={99} />
 *   <UnreadBadge count={3} variant="dot" /> // Just shows dot
 */

import { cn } from '@/lib/utils';

export function UnreadBadge({
  count = 0,
  max = 99,
  variant = 'count', // 'count' | 'dot'
  size = 'default', // 'sm' | 'default' | 'lg'
  className,
  ...props
}) {
  // Don't render if no unread items
  if (count === 0) {
    return null;
  }

  // Format count with max
  const displayCount = count > max ? `${max}+` : count;

  // Size variants
  const sizeClasses = {
    sm: variant === 'dot' ? 'w-2 h-2' : 'min-w-[16px] h-4 text-[10px] px-1',
    default: variant === 'dot' ? 'w-2.5 h-2.5' : 'min-w-[20px] h-5 text-xs px-1.5',
    lg: variant === 'dot' ? 'w-3 h-3' : 'min-w-[24px] h-6 text-sm px-2',
  };

  if (variant === 'dot') {
    return (
      <span
        className={cn(
          'inline-block rounded-full bg-red-500',
          sizeClasses[size],
          className
        )}
        aria-label={`${count} unread`}
        {...props}
      />
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full',
        'bg-red-500 text-white font-medium',
        sizeClasses[size],
        className
      )}
      aria-label={`${count} unread`}
      {...props}
    >
      {displayCount}
    </span>
  );
}

/**
 * UnreadIndicator - A simple dot indicator
 * Alternative to UnreadBadge when you just need to show "has unread"
 */
export function UnreadIndicator({
  hasUnread = false,
  className,
  ...props
}) {
  if (!hasUnread) {
    return null;
  }

  return (
    <span
      className={cn(
        'inline-block w-2 h-2 rounded-full bg-primary',
        className
      )}
      aria-label="Has unread items"
      {...props}
    />
  );
}

export default UnreadBadge;
