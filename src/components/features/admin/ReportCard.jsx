/**
 * ReportCard Component
 *
 * Displays a single community content report with action buttons.
 * Shows: content preview, reporter info, reason, timestamp.
 * Actions: View, Dismiss, Hide Content, Suspend User
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Eye,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  EyeOff,
  UserX,
  AlertTriangle,
  MessageSquare,
  FileText,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { REPORT_REASON_LABELS } from '@/data/community/mockReports';

export function ReportCard({
  report,
  onView,
  onDismiss,
  onHideContent,
  onSuspendUser,
}) {
  const initials = report.reporter_name?.split(' ').map(n => n[0]).join('') || '?';
  const contentTypeIcon = report.content_type === 'topic' ? FileText : MessageSquare;
  const ContentIcon = contentTypeIcon;

  // Status badge configuration
  const statusConfig = {
    pending: { className: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
    reviewed: { className: 'bg-blue-100 text-blue-800', label: 'Reviewed' },
    dismissed: { className: 'bg-gray-100 text-gray-800', label: 'Dismissed' },
    actioned: { className: 'bg-green-100 text-green-800', label: 'Actioned' },
  };

  const status = statusConfig[report.status] || statusConfig.pending;

  // Reason badge configuration
  const reasonConfig = {
    spam: { className: 'bg-orange-100 text-orange-800' },
    harassment: { className: 'bg-red-100 text-red-800' },
    inappropriate: { className: 'bg-purple-100 text-purple-800' },
    other: { className: 'bg-gray-100 text-gray-800' },
  };

  const reasonStyle = reasonConfig[report.reason] || reasonConfig.other;

  return (
    <Card className="hover:shadow-md transition-shadow" data-testid="report-card">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          {/* Left Section: Content Preview */}
          <div className="flex-1 min-w-0">
            {/* Header: Content Type & Status */}
            <div className="flex items-center gap-2 mb-2">
              <ContentIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm text-muted-foreground capitalize">
                {report.content_type}
              </span>
              <Badge variant="outline" className={status.className}>
                {status.label}
              </Badge>
              <Badge variant="outline" className={reasonStyle.className}>
                {REPORT_REASON_LABELS[report.reason]}
              </Badge>
            </div>

            {/* Content Preview */}
            <div className="mb-3">
              <p className="text-sm font-medium text-gray-900 mb-1">
                Reported Content:
              </p>
              <div className="bg-gray-50 rounded p-3 border border-gray-200">
                <p className="text-sm line-clamp-2">
                  {report.content_preview}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  By {report.content_author_name}
                </p>
              </div>
            </div>

            {/* Reporter Info */}
            <div className="flex items-center gap-2 mb-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={report.reporter_avatar} />
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">
                Reported by <span className="font-medium text-gray-900">{report.reporter_name}</span>
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}
              </span>
            </div>

            {/* Report Details */}
            {report.details && (
              <div className="mb-2">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Details:</span> {report.details}
                </p>
              </div>
            )}

            {/* Admin Notes (if reviewed) */}
            {report.admin_notes && (
              <div className="bg-blue-50 rounded p-2 border border-blue-200 mt-2">
                <p className="text-xs font-medium text-blue-900 mb-1">Admin Notes:</p>
                <p className="text-xs text-blue-800">{report.admin_notes}</p>
              </div>
            )}
          </div>

          {/* Right Section: Actions */}
          <div className="flex items-start gap-2">
            {/* Quick Actions (for pending reports) */}
            {report.status === 'pending' && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onView(report)}
                  data-testid="view-report-button"
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-gray-600 hover:bg-gray-50"
                  onClick={() => onDismiss(report)}
                  data-testid="dismiss-report-button"
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Dismiss
                </Button>
              </>
            )}

            {/* More Actions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView(report)}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                {report.status === 'pending' && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onHideContent(report)}
                      className="text-orange-600"
                      data-testid="hide-content-button"
                    >
                      <EyeOff className="w-4 h-4 mr-2" />
                      Hide Content
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onSuspendUser(report)}
                      className="text-red-600"
                      data-testid="suspend-user-button"
                    >
                      <UserX className="w-4 h-4 mr-2" />
                      Suspend User
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onDismiss(report)}>
                      <XCircle className="w-4 h-4 mr-2" />
                      Dismiss Report
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ReportCard;
