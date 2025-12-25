/**
 * Card component for The CRNA Club
 * Soft glassmorphism design with subtle shadows
 */

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export const Card = forwardRef(function Card({ className, children, interactive, glass, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-4xl transition-shadow duration-300 ease-apple',
        // Glassmorphism variant
        glass
          ? 'bg-white/70 backdrop-blur-xl border border-white/50'
          : 'bg-white border border-gray-50',
        // Hover shadow for all cards (Apple-style)
        'hover:shadow-soft',
        // Interactive variant (clickable cards) - extra lift on hover
        interactive && 'cursor-pointer transition-all duration-300 ease-apple hover:shadow-soft-lg hover:-translate-y-1',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

export function CardHeader({ className, children, ...props }) {
  return (
    <div
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3
      className={cn('text-lg font-semibold leading-none tracking-tight', className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }) {
  return (
    <p
      className={cn('text-sm text-gray-500', className)}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }) {
  return (
    <div className={cn('p-6 pt-0', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }) {
  return (
    <div
      className={cn('flex items-center p-6 pt-0', className)}
      {...props}
    >
      {children}
    </div>
  );
}
