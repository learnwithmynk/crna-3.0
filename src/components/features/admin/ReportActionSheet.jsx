/**
 * ReportActionSheet Component
 *
 * Modal/sheet for taking action on community content reports.
 * Supports: Dismiss, Hide Content, Suspend User
 * Includes admin notes field and suspension duration picker.
 */

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  AlertTriangle,
  EyeOff,
  UserX,
  XCircle,
  CheckCircle,
} from 'lucide-react';
import { REPORT_REASON_LABELS } from '@/data/community/mockReports';

export function ReportActionSheet({
  open,
  onOpenChange,
  report,
  actionType, // 'dismiss' | 'hide' | 'suspend'
  onConfirm,
  isLoading = false,
}) {
  const [adminNotes, setAdminNotes] = useState('');
  const [suspensionDuration, setSuspensionDuration] = useState('7');

  if (!report) return null;

  const handleConfirm = () => {
    const data = {
      adminNotes,
      ...(actionType === 'suspend' && { durationDays: parseInt(suspensionDuration) }),
    };
    onConfirm(data);
    setAdminNotes('');
    setSuspensionDuration('7');
  };

  // Action-specific configuration
  const actionConfig = {
    dismiss: {
      title: 'Dismiss Report',
      description: 'Mark this report as reviewed with no action taken.',
      icon: XCircle,
      iconClass: 'text-gray-600',
      confirmLabel: 'Dismiss Report',
      confirmClass: '',
      notesPlaceholder: 'Optional: Explain why this report is being dismissed...',
    },
    hide: {
      title: 'Hide Content',
      description: 'Hide this content from the community. The user will be notified.',
      icon: EyeOff,
      iconClass: 'text-orange-600',
      confirmLabel: 'Hide Content',
      confirmClass: 'bg-orange-600 hover:bg-orange-700',
      notesPlaceholder: 'Explain why this content is being hidden (will be sent to user)...',
    },
    suspend: {
      title: 'Suspend User',
      description: 'Temporarily or permanently suspend this user from the community.',
      icon: UserX,
      iconClass: 'text-red-600',
      confirmLabel: 'Suspend User',
      confirmClass: 'bg-red-600 hover:bg-red-700',
      notesPlaceholder: 'Explain the reason for suspension (will be sent to user)...',
    },
  };

  const config = actionConfig[actionType] || actionConfig.dismiss;
  const Icon = config.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className={`w-5 h-5 ${config.iconClass}`} />
            {config.title}
          </DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Report Summary */}
          <div className="bg-gray-50 rounded-xl p-4 border">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="bg-red-100 text-red-800">
                {REPORT_REASON_LABELS[report.reason]}
              </Badge>
              <span className="text-sm text-muted-foreground capitalize">
                {report.content_type}
              </span>
            </div>

            <div className="mb-3">
              <p className="text-sm font-medium text-gray-900 mb-1">Reported Content:</p>
              <p className="text-sm text-gray-700 line-clamp-3">
                {report.content_preview}
              </p>
            </div>

            <div className="text-xs text-muted-foreground">
              <p><span className="font-medium">Author:</span> {report.content_author_name}</p>
              <p><span className="font-medium">Reported by:</span> {report.reporter_name}</p>
              {report.details && (
                <p className="mt-1"><span className="font-medium">Details:</span> {report.details}</p>
              )}
            </div>
          </div>

          {/* Suspension Duration (only for suspend action) */}
          {actionType === 'suspend' && (
            <div className="space-y-2">
              <Label htmlFor="suspension-duration">Suspension Duration</Label>
              <Select value={suspensionDuration} onValueChange={setSuspensionDuration}>
                <SelectTrigger id="suspension-duration">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Day</SelectItem>
                  <SelectItem value="3">3 Days</SelectItem>
                  <SelectItem value="7">7 Days (1 Week)</SelectItem>
                  <SelectItem value="14">14 Days (2 Weeks)</SelectItem>
                  <SelectItem value="30">30 Days (1 Month)</SelectItem>
                  <SelectItem value="90">90 Days (3 Months)</SelectItem>
                  <SelectItem value="0">Permanent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Admin Notes */}
          <div className="space-y-2">
            <Label htmlFor="admin-notes">
              {actionType === 'dismiss' ? 'Admin Notes (Optional)' : 'Reason (Required)'}
            </Label>
            <Textarea
              id="admin-notes"
              placeholder={config.notesPlaceholder}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={4}
            />
            {actionType !== 'dismiss' && (
              <p className="text-xs text-muted-foreground">
                This message will be sent to the user.
              </p>
            )}
          </div>

          {/* Warning for severe actions */}
          {actionType === 'suspend' && (
            <div className="flex items-start gap-2 p-3 bg-red-50 rounded-xl border border-red-200">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-800">
                <p className="font-medium mb-1">Warning</p>
                <p>
                  Suspending a user will prevent them from accessing community features.
                  {suspensionDuration === '0' && ' Permanent suspensions cannot be undone.'}
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={
              isLoading ||
              (actionType !== 'dismiss' && !adminNotes.trim())
            }
            className={config.confirmClass}
          >
            {isLoading ? (
              <>Processing...</>
            ) : (
              <>
                <Icon className="w-4 h-4 mr-2" />
                {config.confirmLabel}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ReportActionSheet;
