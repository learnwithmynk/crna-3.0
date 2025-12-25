/**
 * Switch Component
 *
 * Toggle switch built with Radix UI.
 * Soft rounded design with theme-aware colors.
 */

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"
import { useTheme } from "@/contexts/ThemeContext"

const Switch = React.forwardRef(({ className, ...props }, ref) => {
  const { colors } = useTheme();

  return (
    <SwitchPrimitives.Root
      style={{
        '--theme-accent': colors.accent,
        '--focus-ring': colors.focusRing,
        '--focus-glow': colors.focusGlow,
      }}
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-all duration-200",
        "focus-visible:outline-none",
        "focus-visible:shadow-[0_0_0_3px_var(--focus-ring),0_0_12px_var(--focus-glow)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:bg-[var(--theme-accent)] data-[state=unchecked]:bg-gray-200",
        className
      )}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-md ring-0 transition-transform duration-200",
          "data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
        )}
      />
    </SwitchPrimitives.Root>
  );
})
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
