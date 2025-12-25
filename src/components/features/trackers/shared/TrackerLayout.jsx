/**
 * TrackerLayout - Page wrapper for tracker pages
 * Provides consistent layout and styling for Clinical, EQ, Shadow Days, and Events trackers
 */

import { cn } from '@/lib/utils';

export function TrackerLayout({ children, className }) {
  return (
    <div className={cn('space-y-6', className)}>
      {children}
    </div>
  );
}
