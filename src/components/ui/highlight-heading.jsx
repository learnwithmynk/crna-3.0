/**
 * HighlightHeading Component
 *
 * The signature yellow marker highlight behind headings.
 * A key brand element of The CRNA Club design system.
 *
 * Example:
 * <HighlightHeading>MY PROGRAMS</HighlightHeading>
 * <HighlightHeading as="h1">Welcome Back</HighlightHeading>
 */

import * as React from "react"
import { cn } from "@/lib/utils"

export function HighlightHeading({
  children,
  as: Component = "h2",
  className,
  highlightColor = "yellow"
}) {
  const colors = {
    yellow: "from-primary/60",
    green: "from-green-300",
    blue: "from-blue-300",
    purple: "from-purple-300",
    pink: "from-pink-300"
  }

  const colorClass = colors[highlightColor] || colors.yellow

  return (
    <Component
      className={cn(
        "inline font-bold text-2xl",
        className
      )}
    >
      <span
        className={cn(
          "bg-gradient-to-t to-transparent bg-[length:100%_50%] bg-no-repeat bg-bottom px-1",
          colorClass
        )}
      >
        {children}
      </span>
    </Component>
  )
}
