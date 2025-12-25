/**
 * ShadowDaysPage - Shadow days tracker
 * Allows users to log and track CRNA shadowing experiences
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { TrackerLayout } from '@/components/features/trackers/shared/TrackerLayout';
import { TrackerTabs } from '@/components/features/trackers/shared/TrackerTabs';
import { TrackerSummaryCard } from '@/components/features/trackers/shared/TrackerSummaryCard';
import { ShadowDayCard } from '@/components/features/trackers/ShadowDayCard';
import { ShadowDayForm } from '@/components/features/trackers/ShadowDayForm';
import { ShadowGoalEditDialog } from '@/components/features/trackers/ShadowGoalEditDialog';
import { SkillsLifetimeSummary } from '@/components/features/trackers/SkillsLifetimeSummary';
import { mockShadowDays, userShadowGoal } from '@/data/mockShadowDays';
import { Calendar, Plus } from 'lucide-react';

export default function ShadowDaysPage() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState(mockShadowDays);
  const [goal, setGoal] = useState(userShadowGoal);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  // Calculate stats
  const totalHours = entries.reduce((sum, entry) => sum + entry.hours, 0);
  const totalCases = entries.reduce((sum, entry) => sum + entry.cases, 0);
  const progress = (totalHours / goal) * 100;
  const hoursRemaining = Math.max(0, goal - totalHours);

  const getMotivationalMessage = () => {
    if (totalHours >= goal) {
      return "Goal achieved! 🎉";
    } else if (progress >= 75) {
      return "Almost there! 💪";
    } else if (progress >= 50) {
      return "Halfway there! 🎯";
    } else if (progress >= 25) {
      return "Great start! Keep going! 🚀";
    } else {
      return `${hoursRemaining} hours to go`;
    }
  };

  const handleTabChange = (value) => {
    const routes = {
      clinical: '/trackers/clinical',
      eq: '/trackers/eq',
      shadow: '/trackers/shadow-days',
      events: '/trackers/events',
    };
    navigate(routes[value]);
  };

  const handleAddEntry = () => {
    setEditingEntry(null);
    setIsFormOpen(true);
  };

  const handleEditEntry = (entry) => {
    setEditingEntry(entry);
    setIsFormOpen(true);
  };

  const handleDeleteEntry = (id) => {
    if (confirm('Are you sure you want to delete this shadow day entry?')) {
      setEntries(entries.filter(e => e.id !== id));
    }
  };

  const handleSubmit = (formData) => {
    if (editingEntry) {
      // Update existing
      setEntries(entries.map(e => e.id === formData.id ? formData : e));
    } else {
      // Add new
      setEntries([formData, ...entries]);
    }
  };

  return (
    <div className="p-6">
      <TrackerLayout>
        {/* Tabs Navigation */}
        <TrackerTabs activeTab="shadow" onTabChange={handleTabChange} />

        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Shadow Days Tracker</h1>
            <p className="text-sm text-gray-600 mt-1">
              Track your CRNA shadowing experiences and hours
            </p>
          </div>
          <Button onClick={handleAddEntry} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Log Shadow Day</span>
            <span className="sm:hidden">Log Day</span>
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <TrackerSummaryCard
            label="Shadow Hours"
            value={totalHours}
            goal={goal}
            progress={progress}
            subtitle={getMotivationalMessage()}
            onEdit={() => setIsGoalDialogOpen(true)}
          />
          <TrackerSummaryCard
            label="Cases Observed"
            value={totalCases}
          />
          <TrackerSummaryCard
            label="Shadow Days"
            value={entries.length}
          />
        </div>

        {/* Entries List */}
        {entries.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="Log your shadowing experiences"
            description="Track your hours and the skills you observe during CRNA shadowing. Most programs recommend 24+ hours."
            action={{
              label: 'Log First Shadow Day',
              onClick: handleAddEntry
            }}
          />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">My Shadow Days</h2>
              <span className="text-sm text-gray-600">{entries.length} {entries.length === 1 ? 'entry' : 'entries'}</span>
            </div>
            {entries.map(entry => (
              <ShadowDayCard
                key={entry.id}
                entry={entry}
                onEdit={handleEditEntry}
                onDelete={handleDeleteEntry}
              />
            ))}
          </div>
        )}

        {/* Skills Lifetime Summary */}
        {entries.length > 0 && (
          <SkillsLifetimeSummary entries={entries} />
        )}
      </TrackerLayout>

      {/* Form Dialog */}
      <ShadowDayForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        entry={editingEntry}
        onSubmit={handleSubmit}
      />

      {/* Goal Edit Dialog */}
      <ShadowGoalEditDialog
        open={isGoalDialogOpen}
        onOpenChange={setIsGoalDialogOpen}
        currentGoal={goal}
        onSave={setGoal}
      />
    </div>
  );
}
