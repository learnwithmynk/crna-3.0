/**
 * SuggestedTasksDemo - Demo page showing how suggested tasks work
 *
 * This page demonstrates:
 * - The "Suggestions" button in the ToDoListWidget header
 * - The SuggestedTasksModal with category icons and colors
 * - Adding tasks to the to-do list
 * - Dismissing suggestions permanently
 */

import React, { useState } from 'react';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { ToDoListWidget } from '@/components/features/dashboard/ToDoListWidget';
import { SuggestedTasksModal } from '@/components/features/dashboard/SuggestedTasksModal';
import { Button } from '@/components/ui/button';
import { DASHBOARD_SUGGESTED_TASKS } from '@/data/taskConfig';
import { Lightbulb, RotateCcw, Info } from 'lucide-react';

// Mock programs for the widget
const MOCK_PROGRAMS = [
  { id: 'prog1', name: 'Duke University' },
  { id: 'prog2', name: 'Columbia University' },
];

// Initial mock tasks
const INITIAL_TASKS = [
  {
    id: 'task1',
    task: 'Request official transcripts',
    category: 'transcripts',
    status: 'pending',
    dueDate: '2025-02-15',
    programId: 'prog1',
    programName: 'Duke University',
  },
  {
    id: 'task2',
    task: 'Follow up on LORs',
    category: 'lor',
    status: 'pending',
    dueDate: '2025-01-30',
    programId: 'prog2',
    programName: 'Columbia University',
  },
];

export default function SuggestedTasksDemo() {
  // State for demo
  const [dashboardTasks, setDashboardTasks] = useState(INITIAL_TASKS);
  const [dismissedSuggestions, setDismissedSuggestions] = useState([]);
  const [standalonModalOpen, setStandaloneModalOpen] = useState(false);
  const [sessionAddedIds, setSessionAddedIds] = useState(new Set());

  // Handler for adding a task from suggestions
  const handleAddDashboardTask = (task) => {
    const newTask = {
      id: `task_${Date.now()}`,
      task: task.task,
      category: task.category,
      status: 'pending',
      dueDate: null,
      programId: null,
      programName: null,
      isGlobal: true,
    };
    setDashboardTasks(prev => [...prev, newTask]);
  };

  // Handler for dismissing a suggestion
  const handleDismissSuggestion = (taskId) => {
    setDismissedSuggestions(prev => [...prev, taskId]);
  };

  // Handler for task completion
  const handleTaskComplete = (taskId) => {
    setDashboardTasks(prev =>
      prev.map(t =>
        t.id === taskId
          ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' }
          : t
      )
    );
  };

  // Handler for task save
  const handleTaskSave = (taskData) => {
    if (taskData.id) {
      setDashboardTasks(prev =>
        prev.map(t => (t.id === taskData.id ? { ...t, ...taskData } : t))
      );
    } else {
      setDashboardTasks(prev => [
        ...prev,
        { ...taskData, id: `task_${Date.now()}` },
      ]);
    }
  };

  // Handler for task delete
  const handleTaskDelete = (taskId) => {
    setDashboardTasks(prev => prev.filter(t => t.id !== taskId));
  };

  // Reset demo state
  const resetDemo = () => {
    setDashboardTasks(INITIAL_TASKS);
    setDismissedSuggestions([]);
    setSessionAddedIds(new Set());
  };

  // Calculate available suggestions for standalone modal
  const addedTaskNames = new Set(dashboardTasks.map(t => t.task));
  const availableSuggestions = DASHBOARD_SUGGESTED_TASKS.filter(task => {
    if (dismissedSuggestions.includes(task.id)) return false;
    if (addedTaskNames.has(task.task)) return false;
    return true;
  });

  return (
    <PageWrapper title="Suggested Tasks Demo">
      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900">How Suggested Tasks Work</h3>
            <ul className="mt-2 text-sm text-blue-800 space-y-1">
              <li>• The <strong>"Suggestions"</strong> button appears when there are available suggestions based on your profile</li>
              <li>• Click <strong>"+ Add"</strong> to add a suggestion to your to-do list (shows "Added ✓" for that session)</li>
              <li>• Hover over a suggestion and click <strong>X</strong> to permanently dismiss it</li>
              <li>• When all suggestions are added or dismissed, the button hides</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Reset Button */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-gray-500">
          <span className="font-medium">{availableSuggestions.length}</span> suggestions available,{' '}
          <span className="font-medium">{dismissedSuggestions.length}</span> dismissed
        </div>
        <Button variant="outline" size="sm" onClick={resetDemo}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset Demo
        </Button>
      </div>

      {/* Two-column layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: ToDoListWidget with integrated suggestions */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Integrated in ToDoListWidget</h2>
          <p className="text-sm text-gray-500 mb-4">
            The "Suggestions" button appears in the widget header. Click it to open the modal.
          </p>
          <ToDoListWidget
            tasks={dashboardTasks}
            title="My To-Do List"
            programs={MOCK_PROGRAMS}
            showFilters={false}
            showViewAll={false}
            onTaskComplete={handleTaskComplete}
            onTaskSave={handleTaskSave}
            onTaskDelete={handleTaskDelete}
            dashboardTasks={dashboardTasks}
            dismissedSuggestions={dismissedSuggestions}
            onAddDashboardTask={handleAddDashboardTask}
            onDismissSuggestion={handleDismissSuggestion}
          />
        </div>

        {/* Right: Standalone modal demo */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Standalone Modal Preview</h2>
          <p className="text-sm text-gray-500 mb-4">
            This shows the modal contents directly for easier viewing.
          </p>

          <Button
            onClick={() => setStandaloneModalOpen(true)}
            className="mb-4"
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            Open Suggestions Modal
          </Button>

          {/* Inline preview of suggestions */}
          <div className="bg-white rounded-3xl border border-gray-50 shadow-soft overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 px-6 pt-6 pb-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-amber-100">
                <Lightbulb className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Available Suggestions</h3>
            </div>
            <p className="px-6 pb-4 text-sm text-gray-400">
              Based on your profile, here are tasks to consider:
            </p>

            <div className="px-6 max-h-[400px] overflow-y-auto">
              {availableSuggestions.length > 0 ? (
                <div className="space-y-1">
                  {availableSuggestions.slice(0, 5).map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-4 py-4 transition-colors"
                    >
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${getCategoryColor(task.category)}`}>
                        {getCategoryIcon(task.category)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900">{task.task}</p>
                      </div>
                      <span className="text-sm font-semibold text-gray-400">+ ADD</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  All suggestions have been added or dismissed!
                </div>
              )}
              {availableSuggestions.length > 5 && (
                <p className="text-xs text-gray-400 text-center py-3">
                  +{availableSuggestions.length - 5} more suggestions
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-5 border-t border-gray-100 mt-2 flex justify-end">
              <Button variant="outline" className="rounded-full px-6">
                Done
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Standalone Modal */}
      <SuggestedTasksModal
        open={standalonModalOpen}
        onOpenChange={setStandaloneModalOpen}
        suggestions={availableSuggestions}
        sessionAddedIds={sessionAddedIds}
        onAdd={(task) => {
          handleAddDashboardTask(task);
          setSessionAddedIds(prev => new Set([...prev, task.id]));
        }}
        onDismiss={handleDismissSuggestion}
      />
    </PageWrapper>
  );
}

// Helper functions for category styling
function getCategoryColor(category) {
  const colors = {
    gre: 'bg-purple-100 text-purple-700',
    'ccrn-prep': 'bg-blue-100 text-blue-700',
    ccrn: 'bg-blue-100 text-blue-700',
    shadowing: 'bg-green-100 text-green-700',
    profile: 'bg-orange-100 text-orange-700',
    resume: 'bg-pink-100 text-pink-700',
    'personal-statement': 'bg-pink-100 text-pink-700',
  };
  return colors[category] || 'bg-gray-100 text-gray-700';
}

function getCategoryLabel(category) {
  const labels = {
    gre: 'GRE',
    'ccrn-prep': 'CCRN Prep',
    ccrn: 'CCRN',
    shadowing: 'Shadowing',
    profile: 'Profile',
    resume: 'Resume',
    'personal-statement': 'Personal Statement',
  };
  return labels[category] || category;
}

function getCategoryIcon(category) {
  // Using simple emoji placeholders since we're outside the component
  const icons = {
    gre: '🎓',
    'ccrn-prep': '🏆',
    ccrn: '🏆',
    shadowing: '📅',
    profile: '👤',
    resume: '📄',
    'personal-statement': '📝',
  };
  return <span className="text-sm">{icons[category] || '📋'}</span>;
}
