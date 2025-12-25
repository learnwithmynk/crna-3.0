/**
 * Progress Component
 *
 * Progress bar component built with Radix UI.
 * Soft rounded design with theme-aware colors.
 *
 * Example:
 * <Progress value={36} className="h-2" />
 * <Progress value={75} variant="success" />
 */

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"
import { useTheme } from "@/contexts/ThemeContext"

const Progress = React.forwardRef(({ className, value, variant, ...props }, ref) => {
  const { colors } = useTheme();

  // Variant colors for the indicator
  const variantStyles = {
    default: { background: colors.accent },
    success: { background: '#10B981' },
    warning: { background: '#F59E0B' },
    error: { background: '#EF4444' },
    orange: { background: 'linear-gradient(90deg, #FDBA74, #FB923C)' },
    gradient: { background: `linear-gradient(90deg, ${colors.accent}, ${colors.accentDark})` },
  };

  const indicatorStyle = variantStyles[variant] || variantStyles.default;

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-gray-100",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full w-full flex-1 transition-all duration-300 ease-out rounded-full"
        style={{
          transform: `translateX(-${100 - (value || 0)}%)`,
          ...indicatorStyle,
        }}
      />
    </ProgressPrimitive.Root>
  );
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
