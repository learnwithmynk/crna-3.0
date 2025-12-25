/**
 * Toggle Component
 * Multi-select toggle button for skills, tags, and other selections
 * Soft rounded design with theme-aware colors
 */

import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

export function Toggle({ className, pressed, onPressedChange, children, ...props }) {
  const { colors } = useTheme();

  return (
    <button
      type="button"
      role="button"
      aria-pressed={pressed}
      onClick={() => onPressedChange?.(!pressed)}
      style={{
        '--theme-accent': colors.accent,
        '--theme-accent-light': colors.accentLight,
        '--focus-ring': colors.focusRing,
        '--focus-glow': colors.focusGlow,
      }}
      className={cn(
        'inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium',
        'transition-all duration-200',
        'focus-visible:outline-none',
        'focus-visible:shadow-[0_0_0_3px_var(--focus-ring),0_0_12px_var(--focus-glow)]',
        'min-h-[44px]', // Touch target
        pressed
          ? 'bg-[var(--theme-accent-light)] border border-[var(--theme-accent)] text-gray-900'
          : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
