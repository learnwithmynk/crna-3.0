/**
 * RadioGroup Component
 *
 * Radio button group built with Radix UI.
 * Soft rounded design with theme-aware colors.
 */

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { cn } from "@/lib/utils"
import { useTheme } from "@/contexts/ThemeContext"

const RadioGroup = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = React.forwardRef(({ className, ...props }, ref) => {
  const { colors } = useTheme();

  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      style={{
        '--theme-accent': colors.accent,
        '--focus-ring': colors.focusRing,
        '--focus-glow': colors.focusGlow,
      }}
      className={cn(
        "aspect-square h-5 w-5 rounded-full border-2 border-gray-300 bg-white",
        "focus:outline-none",
        "focus-visible:shadow-[0_0_0_3px_var(--focus-ring),0_0_12px_var(--focus-glow)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:border-[var(--theme-accent)]",
        "hover:border-gray-400 transition-all duration-200",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <div
          className="h-2.5 w-2.5 rounded-full"
          style={{ background: `linear-gradient(135deg, ${colors.accent}, ${colors.accentDark})` }}
        />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
