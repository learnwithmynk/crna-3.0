/**
 * StatusBadge Component
 *
 * Consistent status badges for program/task/application statuses.
 * Automatically applies correct colors based on status type.
 *
 * Example:
 * <StatusBadge status="submitted" />
 * <StatusBadge status="in_progress" />
 * <StatusBadge status="not_started" />
 */

import * as React from "react"
import { cn } from "@/lib/utils"

const STATUS_STYLES = {
  // Application statuses (official workflow)
  not_started: {
    className: 'bg-gray-100 text-gray-600',
    label: 'Not Started'
  },
  researching: {
    className: 'bg-gray-100 text-gray-600',
    label: 'Researching'
  },
  preparing: {
    className: 'bg-amber-100 text-amber-800',
    label: 'Preparing'
  },
  applying: {
    className: 'bg-orange-100 text-orange-800',
    label: 'Applying'
  },
  in_progress: {
    className: 'bg-orange-100 text-orange-800',
    label: 'In Progress'
  },
  submitted: {
    className: 'bg-blue-100 text-blue-800',
    label: 'Submitted'
  },
  interview_invite: {
    className: 'bg-purple-100 text-purple-800',
    label: 'Interview Invite'
  },
  interview_invited: {
    className: 'bg-purple-100 text-purple-800',
    label: 'Interview Invited'
  },
  interview_complete: {
    className: 'bg-purple-100 text-purple-800',
    label: 'Interview Complete'
  },
  interviewed: {
    className: 'bg-indigo-100 text-indigo-800',
    label: 'Interviewed'
  },
  waitlisted: {
    className: 'bg-yellow-100 text-yellow-800',
    label: 'Waitlisted'
  },
  denied: {
    className: 'bg-red-100 text-red-800',
    label: 'Denied'
  },
  rejected: {
    className: 'bg-red-100 text-red-800',
    label: 'Rejected'
  },
  accepted: {
    className: 'bg-green-100 text-green-800',
    label: 'Accepted'
  },
  accepted_declined: {
    className: 'bg-gray-200 text-gray-700 line-through',
    label: 'Declined Offer'
  },

  // Generic/other statuses
  completed: {
    className: 'bg-green-100 text-green-800',
    label: 'Completed'
  },
  pending: {
    className: 'bg-yellow-100 text-yellow-800',
    label: 'Pending'
  },
  confirmed: {
    className: 'bg-green-100 text-green-800',
    label: 'Confirmed'
  },
  cancelled: {
    className: 'bg-red-100 text-red-800',
    label: 'Cancelled'
  },

  // Default fallback
  default: {
    className: 'bg-gray-100 text-gray-600',
    label: 'Unknown'
  }
}

export function StatusBadge({ status, customLabel, className, size = "default" }) {
  const statusConfig = STATUS_STYLES[status] || STATUS_STYLES.default
  const label = customLabel || statusConfig.label

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    default: "px-2 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm"
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded font-medium whitespace-nowrap",
        statusConfig.className,
        sizeClasses[size],
        className
      )}
    >
      {label}
    </span>
  )
}
