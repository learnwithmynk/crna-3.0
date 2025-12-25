/**
 * Checkbox Component
 *
 * Checkbox component built with Radix UI.
 * Soft rounded design with theme-aware colors.
 *
 * Example:
 * <div className="flex items-center space-x-2">
 *   <Checkbox id="terms" />
 *   <Label htmlFor="terms">Accept terms and conditions</Label>
 * </div>
 */

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/contexts/ThemeContext"

// Variant colors for checkbox
const CHECKBOX_VARIANTS = {
  default: null, // Uses theme accent
  success: '#10B981', // Green
  successLight: '#34D399', // Light green (emerald-400)
  warning: '#F59E0B', // Orange/Amber
  error: '#EF4444', // Red
};

const Checkbox = React.forwardRef(({ className, variant, ...props }, ref) => {
  const { colors } = useTheme();
  const accentColor = CHECKBOX_VARIANTS[variant] || colors.accent;

  return (
    <CheckboxPrimitive.Root
      ref={ref}
      style={{
        '--theme-accent': accentColor,
        '--focus-ring': colors.focusRing,
        '--focus-glow': colors.focusGlow,
      }}
      className={cn(
        "peer h-5 w-5 min-h-[20px] min-w-[20px] shrink-0 rounded-lg border-2 border-gray-300 bg-white",
        "focus-visible:outline-none",
        "focus-visible:shadow-[0_0_0_3px_var(--focus-ring),0_0_12px_var(--focus-glow)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:bg-[var(--theme-accent)] data-[state=checked]:border-transparent data-[state=checked]:text-white",
        "hover:border-gray-400 transition-all duration-200",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn("flex items-center justify-center text-current")}
      >
        <Check className="h-3 w-3 stroke-[3]" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
})
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
