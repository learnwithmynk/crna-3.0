/**
 * Input component for The CRNA Club
 * Soft glassmorphism design with theme-aware focus rings
 */

import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

export function Input({ className, type = 'text', ...props }) {
  const { colors } = useTheme();

  return (
    <input
      type={type}
      style={{
        '--focus-ring': colors.focusRing,
        '--focus-glow': colors.focusGlow,
        '--focus-border': colors.focusBorder,
      }}
      className={cn(
        'flex h-11 w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3',
        'text-sm text-gray-900 placeholder:text-gray-400',
        'shadow-inner-soft', // Apple-style inset shadow
        'focus:outline-none focus:bg-white',
        'focus:border-[var(--focus-border)]',
        'focus:shadow-[0_0_0_3px_var(--focus-ring),0_0_12px_var(--focus-glow)]',
        'transition-all duration-200 ease-apple',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'min-h-[44px]', // Touch target minimum
        className
      )}
      {...props}
    />
  );
}

export function Label({ className, children, ...props }) {
  return (
    <label
      className={cn('text-sm font-medium text-gray-700', className)}
      {...props}
    >
      {children}
    </label>
  );
}

export function Textarea({ className, ...props }) {
  const { colors } = useTheme();

  return (
    <textarea
      style={{
        '--focus-ring': colors.focusRing,
        '--focus-glow': colors.focusGlow,
        '--focus-border': colors.focusBorder,
      }}
      className={cn(
        'flex w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3',
        'text-sm text-gray-900 placeholder:text-gray-400',
        'shadow-inner-soft', // Apple-style inset shadow
        'focus:outline-none focus:bg-white',
        'focus:border-[var(--focus-border)]',
        'focus:shadow-[0_0_0_3px_var(--focus-ring),0_0_12px_var(--focus-glow)]',
        'transition-all duration-200 ease-apple',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'min-h-[100px] resize-y',
        className
      )}
      {...props}
    />
  );
}
