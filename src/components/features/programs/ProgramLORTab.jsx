/**
 * ProgramLORTab - Letters of Recommendation tracking
 *
 * Features:
 * - Track LOR status: Not Requested → Requested → Received
 * - Visual progress bar showing received/total LORs
 * - Days since requested tracking for pending LORs
 * - Fields: Person name, relationship, email, status, dates
 * - Add/Edit/Remove LOR entries
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { EmptyState } from '@/components/ui/empty-state';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  Users,
  Mail,
  Calendar,
  Pencil,
  Trash2,
  CheckCircle2,
  Clock,
  Circle,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDateFull } from '@/lib/dateFormatters';

/**
 * Calculate days since a date
 */
function daysSince(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  const now = new Date();
  const diffTime = now - date;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

const LOR_STATUSES = [
  { value: 'not_requested', label: 'Not Requested', icon: Circle, color: 'text-gray-400' },
  { value: 'requested', label: 'Requested', icon: Clock, color: 'text-yellow-500' },
  { value: 'received', label: 'Received', icon: CheckCircle2, color: 'text-green-500' },
];

// formatDate moved to @/lib/dateFormatters (use formatDateFull)

/**
 * LOR Card Component
 */
function LorCard({ lor, onEdit, onDelete }) {
  const statusInfo = LOR_STATUSES.find(s => s.value === lor.status) || LOR_STATUSES[0];
  const StatusIcon = statusInfo.icon;

  // Calculate days since requested for pending LORs
  const daysPending = lor.status === 'requested' ? daysSince(lor.requestedDate) : null;
  const isPendingLong = daysPending !== null && daysPending > 14; // More than 2 weeks

  return (
    <Card className={cn(
      "p-4",
      isPendingLong && "border-yellow-300 bg-yellow-50/50"
    )}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Person Name & Relationship */}
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-gray-900 truncate">
              {lor.personName}
            </h4>
            {lor.relationship && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                {lor.relationship}
              </span>
            )}
          </div>

          {/* Email */}
          {lor.email && (
            <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-2">
              <Mail className="w-3.5 h-3.5" />
              <a
                href={`mailto:${lor.email}`}
                className="hover:text-primary truncate"
              >
                {lor.email}
              </a>
            </div>
          )}

          {/* Status & Dates */}
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className={cn("flex items-center gap-1.5", statusInfo.color)}>
              <StatusIcon className="w-4 h-4" />
              {statusInfo.label}
            </span>

            {lor.requestedDate && lor.status === 'requested' && (
              <span className={cn(
                "flex items-center gap-1.5",
                isPendingLong ? "text-yellow-700" : "text-gray-500"
              )}>
                <Calendar className="w-3.5 h-3.5" />
                Requested: {formatDateFull(lor.requestedDate)}
                {daysPending !== null && (
                  <span className={cn(
                    "ml-1 px-1.5 py-0.5 rounded text-xs",
                    isPendingLong ? "bg-yellow-200 text-yellow-800" : "bg-gray-100 text-gray-600"
                  )}>
                    {daysPending} days ago
                  </span>
                )}
              </span>
            )}

            {lor.requestedDate && lor.status === 'received' && (
              <span className="flex items-center gap-1.5 text-gray-500">
                <Calendar className="w-3.5 h-3.5" />
                Requested: {formatDateFull(lor.requestedDate)}
              </span>
            )}

            {lor.receivedDate && (
              <span className="flex items-center gap-1.5 text-green-600">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Received: {formatDateFull(lor.receivedDate)}
              </span>
            )}
          </div>

          {/* Follow-up reminder for long pending */}
          {isPendingLong && (
            <div className="mt-2 flex items-center gap-2 text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded">
              <AlertCircle className="w-3.5 h-3.5" />
              Consider sending a follow-up reminder
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-0">
          <button
            onClick={() => onEdit(lor)}
            className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors min-h-11 min-w-11 flex items-center justify-center"
            title="Edit"
            aria-label={`Edit letter from ${lor.personName}`}
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(lor.id)}
            className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors min-h-11 min-w-11 flex items-center justify-center"
            title="Delete"
            aria-label={`Delete letter from ${lor.personName}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Card>
  );
}

export function ProgramLORTab({ lor = [], programId, onUpdate }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLor, setEditingLor] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    personName: '',
    relationship: '',
    email: '',
    status: 'not_requested',
    requestedDate: '',
    receivedDate: ''
  });

  const handleOpenDialog = (lorToEdit = null) => {
    if (lorToEdit) {
      setEditingLor(lorToEdit);
      setFormData({
        personName: lorToEdit.personName || '',
        relationship: lorToEdit.relationship || '',
        email: lorToEdit.email || '',
        status: lorToEdit.status || 'not_requested',
        requestedDate: lorToEdit.requestedDate || '',
        receivedDate: lorToEdit.receivedDate || ''
      });
    } else {
      setEditingLor(null);
      setFormData({
        personName: '',
        relationship: '',
        email: '',
        status: 'not_requested',
        requestedDate: '',
        receivedDate: ''
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.personName.trim()) return;

    if (editingLor) {
      // Update existing
      const updated = lor.map(l =>
        l.id === editingLor.id
          ? { ...l, ...formData }
          : l
      );
      onUpdate(updated);
    } else {
      // Add new
      const newLor = {
        id: `lor_${Date.now()}`,
        ...formData
      };
      onUpdate([...lor, newLor]);
    }

    setIsDialogOpen(false);
    setEditingLor(null);
  };

  const handleDelete = (lorId) => {
    onUpdate(lor.filter(l => l.id !== lorId));
  };

  // Count by status
  const receivedCount = lor.filter(l => l.status === 'received').length;
  const requestedCount = lor.filter(l => l.status === 'requested').length;

  if (lor.length === 0) {
    return (
      <>
        <EmptyState
          icon={Users}
          title="No letters of recommendation"
          description="Track your letter of recommendation requests and their status."
          actionLabel="Add LOR"
          onAction={() => handleOpenDialog()}
        />

        {/* Dialog */}
        <LorDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          formData={formData}
          setFormData={setFormData}
          onSave={handleSave}
          isEditing={!!editingLor}
        />
      </>
    );
  }

  // Progress calculation
  const progressPercent = lor.length > 0 ? Math.round((receivedCount / lor.length) * 100) : 0;
  const notRequestedCount = lor.filter(l => l.status === 'not_requested').length;

  return (
    <div className="space-y-4">
      {/* Header with Progress */}
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">
            Letters of Recommendation
          </h3>
          <Button
            size="sm"
            onClick={() => handleOpenDialog()}
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add LOR
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {receivedCount} of {lor.length} received
            </span>
            <span className={cn(
              "font-semibold",
              progressPercent === 100 ? "text-green-600" : "text-gray-900"
            )}>
              {progressPercent}%
            </span>
          </div>
          <Progress value={progressPercent} className="h-2" />

          {/* Status Summary */}
          <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              {receivedCount} Received
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-yellow-500" />
              {requestedCount} Pending
            </span>
            {notRequestedCount > 0 && (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-gray-400" />
                {notRequestedCount} Not Requested
              </span>
            )}
          </div>
        </div>
      </div>

      {/* LOR List */}
      <div className="space-y-3">
        {lor.map((item) => (
          <LorCard
            key={item.id}
            lor={item}
            onEdit={handleOpenDialog}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Dialog */}
      <LorDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSave}
        isEditing={!!editingLor}
      />
    </div>
  );
}

/**
 * LOR Add/Edit Dialog
 */
function LorDialog({ isOpen, onClose, formData, setFormData, onSave, isEditing }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Letter of Recommendation' : 'Add Letter of Recommendation'}
          </DialogTitle>
          <DialogDescription>
            Track your letter of recommendation request.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Person Name */}
          <div className="space-y-2">
            <Label htmlFor="personName">Person Name *</Label>
            <Input
              id="personName"
              value={formData.personName}
              onChange={(e) => setFormData({ ...formData, personName: e.target.value })}
              placeholder="Dr. Jane Smith"
            />
          </div>

          {/* Relationship */}
          <div className="space-y-2">
            <Label htmlFor="relationship">Relationship</Label>
            <Input
              id="relationship"
              value={formData.relationship}
              onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
              placeholder="Clinical Supervisor, Professor, etc."
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="jsmith@hospital.org"
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LOR_STATUSES.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Requested Date */}
          {(formData.status === 'requested' || formData.status === 'received') && (
            <div className="space-y-2">
              <Label htmlFor="requestedDate">Date Requested</Label>
              <Input
                id="requestedDate"
                type="date"
                value={formData.requestedDate}
                onChange={(e) => setFormData({ ...formData, requestedDate: e.target.value })}
              />
            </div>
          )}

          {/* Received Date */}
          {formData.status === 'received' && (
            <div className="space-y-2">
              <Label htmlFor="receivedDate">Date Received</Label>
              <Input
                id="receivedDate"
                type="date"
                value={formData.receivedDate}
                onChange={(e) => setFormData({ ...formData, receivedDate: e.target.value })}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSave} disabled={!formData.personName.trim()}>
            {isEditing ? 'Save Changes' : 'Add LOR'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
