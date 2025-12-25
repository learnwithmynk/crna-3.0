/**
 * Button component for The CRNA Club
 * Soft rounded buttons with gentle shadows and theme-aware focus
 * Supports asChild prop for rendering as different elements (e.g., links)
 */

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

const buttonVariants = {
  // Primary - solid with Apple-style shadow
  default: 'bg-gray-900 text-white hover:bg-gray-800 shadow-soft hover:shadow-soft-md',
  // Secondary - soft outline
  secondary: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-soft',
  // Outline - minimal
  outline: 'bg-transparent text-gray-700 border border-gray-200 hover:bg-gray-50',
  // Ghost - no border
  ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900',
  // Destructive - red
  destructive: 'bg-red-500 text-white hover:bg-red-600 shadow-soft hover:shadow-soft-md',
  // Success - green
  success: 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-soft hover:shadow-soft-md',
  // Soft - very subtle
  soft: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
  // Accent - brand yellow with Apple styling
  accent: 'bg-yellow-400 text-gray-900 hover:bg-yellow-500 shadow-soft hover:shadow-soft-md',
};

const buttonSizes = {
  xs: 'h-8 px-3 text-xs',
  sm: 'h-9 px-4 text-sm',
  default: 'h-10 px-5 text-sm',
  lg: 'h-11 px-6 text-base',
  icon: 'h-10 w-10',
};

export const Button = React.forwardRef(function Button(
  {
    className,
    variant = 'default',
    size = 'default',
    asChild = false,
    children,
    ...props
  },
  ref
) {
  const { colors } = useTheme();
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      ref={ref}
      style={{
        '--focus-ring': colors.focusRing,
        '--focus-glow': colors.focusGlow,
      }}
      className={cn(
        'inline-flex items-center justify-center rounded-3xl font-medium',
        'transition-all duration-200 ease-apple',
        'active:scale-[0.98]', // Apple-style press feedback
        'focus-visible:outline-none',
        'focus-visible:shadow-[0_0_0_3px_var(--focus-ring),0_0_12px_var(--focus-glow)]',
        'disabled:pointer-events-none disabled:opacity-50',
        'min-h-[44px]', // Touch target minimum
        buttonVariants[variant],
        buttonSizes[size],
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
});

Button.displayName = 'Button';
