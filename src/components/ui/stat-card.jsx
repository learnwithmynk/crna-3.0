/**
 * StatCard Component
 *
 * Display a single stat with icon, value, label, and optional sublabel.
 * Used on dashboard and stats pages for GPA, points, clinical hours, etc.
 *
 * Example:
 * <StatCard
 *   icon={Heart}
 *   label="Clinical Hours"
 *   value="1,247"
 *   sublabel="Target: 2,000"
 * />
 */

import * as React from "react"
import { cn } from "@/lib/utils"

export function StatCard({
  icon: Icon,
  label,
  value,
  sublabel,
  trend,
  trendDirection,
  className,
  variant = "default"
}) {
  const variants = {
    default: "bg-white border border-gray-100",
    primary: "bg-primary/10 border border-primary/30",
    success: "bg-green-50 border border-green-200",
    warning: "bg-orange-50 border border-orange-200"
  }

  return (
    <div
      className={cn(
        "rounded-2xl p-4 text-center shadow-sm hover:shadow-md transition-shadow",
        variants[variant],
        className
      )}
    >
      {/* Icon */}
      {Icon && (
        <Icon className="w-6 h-6 mx-auto text-gray-400 mb-2" />
      )}

      {/* Value */}
      <div className="text-2xl font-bold text-gray-900">
        {value}
      </div>

      {/* Label */}
      <div className="text-sm text-gray-600 mt-1">
        {label}
      </div>

      {/* Sublabel */}
      {sublabel && (
        <div className="text-xs text-gray-400 mt-0.5">
          {sublabel}
        </div>
      )}

      {/* Trend Indicator */}
      {trend && (
        <div
          className={cn(
            "text-xs font-medium mt-2",
            trendDirection === "up" && "text-green-600",
            trendDirection === "down" && "text-red-600",
            !trendDirection && "text-gray-500"
          )}
        >
          {trendDirection === "up" && "↑ "}
          {trendDirection === "down" && "↓ "}
          {trend}
        </div>
      )}
    </div>
  )
}
