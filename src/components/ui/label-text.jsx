/**
 * LabelText - Standardized ALL CAPS label component
 *
 * Use for:
 * - Role/status labels (e.g., "SRNA APPLICANT")
 * - Category labels (e.g., "DEADLINE", "GRE", "CLUB")
 * - Section headers (e.g., "UPCOMING EVENTS")
 * - Metadata tags
 *
 * Variants:
 * - default: Light gray (text-gray-400) - for neutral labels
 * - primary: Brand orange (text-orange-400) - for user roles, highlights
 * - accent: Primary purple (text-primary) - for action links
 * - muted: Very light (text-gray-300) - for subtle metadata
 *
 * See /docs/skills/component-library.md for usage guidelines.
 */

import { cn } from '@/lib/utils';

const variants = {
  default: 'text-gray-400',
  primary: 'text-orange-400',
  accent: 'text-primary',
  muted: 'text-gray-300',
  success: 'text-green-500',
  danger: 'text-red-500',
  warning: 'text-amber-500',
  info: 'text-blue-500',
};

const sizes = {
  xs: 'text-[10px]',
  sm: 'text-xs',
  base: 'text-sm',
};

export function LabelText({
  children,
  variant = 'default',
  size = 'sm',
  className,
  as: Component = 'span',
  ...props
}) {
  return (
    <Component
      className={cn(
        'font-medium uppercase tracking-widest',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * SectionHeader - ALL CAPS section header with wider letter-spacing
 * Use for card/widget section titles
 */
export function SectionHeader({
  children,
  className,
  as: Component = 'h3',
  ...props
}) {
  return (
    <Component
      className={cn(
        'text-xs font-medium text-gray-400 uppercase tracking-widest',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * ActionLink - ALL CAPS action link with arrow
 * Use for "VIEW DETAILS", "SEE ALL", etc.
 */
export function ActionLink({
  children,
  href,
  onClick,
  className,
  showArrow = true,
  ...props
}) {
  const Component = href ? 'a' : 'button';

  return (
    <Component
      href={href}
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-widest hover:underline transition-colors',
        className
      )}
      {...props}
    >
      {children}
      {showArrow && <span className="text-[10px]">↗</span>}
    </Component>
  );
}

export default LabelText;
