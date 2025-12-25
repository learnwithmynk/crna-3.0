/**
 * Badge component for The CRNA Club
 * Soft pill-style status indicators with gentle colors
 */

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const badgeVariants = {
  default: 'bg-gray-100 text-gray-700',
  primary: 'bg-amber-50 text-amber-700',
  secondary: 'bg-gray-50 text-gray-600',
  success: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-orange-50 text-orange-700',
  error: 'bg-red-50 text-red-700',
  info: 'bg-blue-50 text-blue-700',
  purple: 'bg-purple-50 text-purple-700',
  coral: 'bg-rose-50 text-rose-600',
  outline: 'border border-gray-200 text-gray-600 bg-white',
};

export const Badge = forwardRef(function Badge({ className, variant = 'default', children, ...props }, ref) {
  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 ease-apple',
        badgeVariants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});
