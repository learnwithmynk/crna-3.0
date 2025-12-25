/**
 * ProgressRing Component
 *
 * Circular progress indicator for displaying completion percentages.
 * Used for checklist completion, profile completion, etc.
 *
 * Example:
 * <ProgressRing percent={75} size={80} strokeWidth={8} />
 */

import * as React from "react"
import { cn } from "@/lib/utils"

export function ProgressRing({
  percent = 0,
  size = 80,
  strokeWidth = 8,
  className,
  showPercentage = true,
  color = "yellow"
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percent / 100) * circumference

  const colors = {
    yellow: "text-primary",
    green: "text-green-500",
    blue: "text-blue-500",
    orange: "text-orange-500",
    purple: "text-purple-500"
  }

  const colorClass = colors[color] || colors.yellow

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          className="text-gray-200"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress circle */}
        <circle
          className={cn(colorClass, "transition-all duration-500 ease-out")}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      {/* Percentage text */}
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-gray-900">
            {Math.round(percent)}%
          </span>
        </div>
      )}
    </div>
  )
}
