/**
 * ApplicationChecklist - Gamified checklist for tracking application requirements
 *
 * Features:
 * - Progress indicator (X of Y completed, X%)
 * - Progress bar with visual feedback
 * - Motivational message
 * - Collapsible categories (Academic, Documents, Testing, Custom)
 * - Default items (no delete) vs Custom items (with X to remove)
 * - Add custom item button (max 3 custom items)
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CheckCircle2, X, Plus, TrendingUp, ChevronDown, ChevronRight, GraduationCap, FileText, ClipboardCheck, User, HelpCircle, RotateCcw, EyeOff, PlusCircle, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';

// Category definitions based on the 12 default checklist items from mockPrograms.js
// c1: Verify all program requirements + due date
// c2: Check for Open House or program event
// c3: Request official Transcripts
// c4: Complete Prerequisites
// c5: Complete the GRE
// c6: Send GRE Scores
// c7: Complete CCRN
// c8: Complete Resume
// c9: Complete Personal Statement
// c10: Complete Letters of Recommendation
// c11: Complete Supplemental Forms
// c12: Submit Application

// Items that can be removed by the user (not required by all schools)
const REMOVABLE_ITEM_IDS = ['c5', 'c6', 'c7']; // GRE, Send GRE, CCRN

// Labels for removable items (used for restore functionality)
const REMOVABLE_ITEM_LABELS = {
  c5: 'Complete the GRE',
  c6: 'Send GRE Scores',
  c7: 'Complete CCRN'
};

const CHECKLIST_CATEGORIES = [
  {
    id: 'setup',
    label: 'Getting Started',
    icon: ClipboardCheck,
    itemIds: ['c1', 'c2'], // Verify requirements, Open House
    tooltip: null
  },
  {
    id: 'academic',
    label: 'Academic & Certifications',
    icon: GraduationCap,
    itemIds: ['c4', 'c5', 'c7'], // Prerequisites, GRE, CCRN
    tooltip: "This is a generic checklist applied to every school. You may delete any items below that don't apply (i.e., GRE, CCRN)."
  },
  {
    id: 'documents',
    label: 'Application Materials',
    icon: FileText,
    itemIds: ['c3', 'c6', 'c8', 'c9', 'c10', 'c11', 'c12'], // Transcripts, Send GRE, Resume, Personal Statement, LOR, Supplemental, Submit
    tooltip: null
  },
  {
    id: 'custom',
    label: 'My Custom Items',
    icon: User,
    itemIds: [], // Custom items have ids starting with 'custom_'
    tooltip: null
  }
];

/**
 * Categorize a checklist item based on its id
 */
function categorizeItem(item) {
  // Custom items (non-default or ids starting with custom_)
  if (!item.isDefault || item.id.startsWith('custom_')) return 'custom';

  // Find category by item id
  for (const category of CHECKLIST_CATEGORIES) {
    if (category.itemIds.includes(item.id)) {
      return category.id;
    }
  }

  // Fallback: categorize by label keywords for any edge cases
  const label = item.label.toLowerCase();
  if (label.includes('transcript') || label.includes('prerequisite') || label.includes('gpa')) {
    return 'academic';
  }
  if (label.includes('gre') || label.includes('ccrn') || label.includes('certification')) {
    return 'academic';
  }
  if (label.includes('verify') || label.includes('open house') || label.includes('event') || label.includes('requirement')) {
    return 'setup';
  }

  return 'documents'; // Default category
}

/**
 * Get motivational message based on progress
 */
function getMotivationalMessage(progress, completedCount, totalCount) {
  if (progress === 100) {
    return { text: "Amazing! All done! 🎉", icon: "🎉" };
  }
  if (progress >= 75) {
    return { text: "Almost there! Keep pushing!", icon: "💪" };
  }
  if (progress >= 50) {
    return { text: "Great work! Keep it up!", icon: "📈" };
  }
  if (progress >= 25) {
    return { text: "Good progress! You're on track.", icon: "👍" };
  }
  if (completedCount > 0) {
    return { text: "Nice start! Keep going!", icon: "🚀" };
  }
  return { text: "Let's get started!", icon: "✨" };
}

/**
 * Collapsible Category Component
 */
function ChecklistCategory({ category, items, expanded, onToggleExpand, onToggleItem, onRemoveItem }) {
  const CategoryIcon = category.icon;
  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;
  const allComplete = completedCount === totalCount && totalCount > 0;

  if (items.length === 0) return null;

  return (
    <TooltipProvider>
      <div className="border rounded-xl overflow-hidden">
        {/* Category Header */}
        <button
          onClick={onToggleExpand}
          className={cn(
            "w-full flex items-center justify-between p-3 min-h-11 transition-colors",
            allComplete ? "bg-green-50" : "bg-gray-50 hover:bg-gray-100"
          )}
        >
          <div className="flex items-center gap-2">
            {expanded ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
            <CategoryIcon className={cn("w-4 h-4", allComplete ? "text-green-600" : "text-gray-600")} />
            <span className={cn("text-sm font-medium", allComplete ? "text-green-700" : "text-gray-700")}>
              {category.label}
            </span>
            {category.tooltip && (
              <Tooltip>
                <TooltipTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <span className="p-1 text-gray-400 hover:text-gray-600">
                    <HelpCircle className="w-3.5 h-3.5" />
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs text-xs">
                  {category.tooltip}
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          <span className={cn(
            "text-xs px-2 py-0.5 rounded-full",
            allComplete ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
          )}>
            {completedCount}/{totalCount}
          </span>
        </button>

        {/* Category Items */}
        {expanded && (
          <div className="border-t divide-y">
            {items.map((item) => {
              const isRemovable = REMOVABLE_ITEM_IDS.includes(item.id) || !item.isDefault;
              return (
                <div
                  key={item.id}
                  className={cn(
                    "group flex items-center gap-3 p-3 transition-colors",
                    item.completed ? "bg-gray-50/50" : "hover:bg-gray-50"
                  )}
                >
                  <Checkbox
                    id={item.id}
                    checked={item.completed}
                    onCheckedChange={() => onToggleItem(item.id)}
                    variant="successLight"
                    className="shrink-0"
                  />
                  <label
                    htmlFor={item.id}
                    className={cn(
                      "flex-1 text-sm cursor-pointer select-none",
                      item.completed ? "text-gray-400 line-through" : "text-gray-700"
                    )}
                  >
                    {item.label}
                  </label>
                  {/* Show remove button for custom items or removable default items (GRE, CCRN) */}
                  {isRemovable && (
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors min-h-11 min-w-11 flex items-center justify-center opacity-0 group-hover:opacity-100"
                      title="Remove item (not required for this school)"
                      aria-label={`Remove ${item.label}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}

export function ApplicationChecklist({
  checklist = [],
  hiddenItems = [],
  progress = 0,
  onToggle,
  onAddItem,
  onRemoveItem,
  onRestoreItem,
  onRevealItem,
  onReportError,
  canAddItem = true,
  defaultCollapsed = false
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [newItemLabel, setNewItemLabel] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [showHiddenSection, setShowHiddenSection] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({
    setup: true,
    academic: true,
    documents: true,
    custom: true
  });

  // Filter out hidden items from the visible checklist
  const visibleChecklist = useMemo(() => {
    return checklist.filter(item => !item.hidden);
  }, [checklist]);

  // Get hidden items from checklist (items with hidden: true)
  const checklistHiddenItems = useMemo(() => {
    return checklist.filter(item => item.hidden);
  }, [checklist]);

  // Combine passed hiddenItems prop with hidden items from checklist
  const allHiddenItems = useMemo(() => {
    const combined = [...checklistHiddenItems];
    // Add any hiddenItems that aren't already in the list
    hiddenItems.forEach(item => {
      if (!combined.find(h => h.id === item.id)) {
        combined.push(item);
      }
    });
    return combined;
  }, [checklistHiddenItems, hiddenItems]);

  const completedCount = visibleChecklist.filter(item => item.completed).length;
  const totalCount = visibleChecklist.length;
  const customItemCount = visibleChecklist.filter(item => !item.isDefault).length;

  const motivationalMessage = getMotivationalMessage(progress, completedCount, totalCount);

  // Find which removable items are missing from the checklist (not hidden, just removed)
  const missingRemovableItems = useMemo(() => {
    const currentIds = checklist.map(item => item.id);
    return REMOVABLE_ITEM_IDS.filter(id => !currentIds.includes(id));
  }, [checklist]);

  // Group visible items by category
  const categorizedItems = useMemo(() => {
    const grouped = {};
    CHECKLIST_CATEGORIES.forEach(cat => {
      grouped[cat.id] = [];
    });

    visibleChecklist.forEach(item => {
      const categoryId = categorizeItem(item);
      grouped[categoryId].push(item);
    });

    return grouped;
  }, [visibleChecklist]);

  const handleAddItem = () => {
    if (newItemLabel.trim()) {
      onAddItem(newItemLabel.trim());
      setNewItemLabel('');
      setIsAdding(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddItem();
    } else if (e.key === 'Escape') {
      setNewItemLabel('');
      setIsAdding(false);
    }
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  return (
    <Card className="shadow-[0_0_15px_-3px_rgba(251,146,60,0.3)] border border-orange-200/50">
      <CardHeader className="pb-3">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-between text-left"
        >
          <CardTitle className="flex items-center gap-2 text-lg">
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
            <CheckCircle2 className="w-5 h-5 text-primary" />
            Application Checklist
          </CardTitle>
          <span className="text-sm font-semibold text-gray-900">
            {progress}%
          </span>
        </button>

        {/* Progress Summary - always visible */}
        <div className="flex items-center justify-between mt-2 ml-7">
          <span className="text-sm text-gray-600">
            {completedCount} of {totalCount} completed
          </span>
        </div>

        {/* Progress Bar - always visible */}
        <Progress value={progress} variant="warning" className="h-2 mt-2" />

        {/* Motivational Message - only when expanded */}
        {!isCollapsed && totalCount > 0 && (
          <div className="flex items-center gap-2 mt-3 text-sm text-gray-600">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span>{motivationalMessage.text}</span>
          </div>
        )}
      </CardHeader>

      {!isCollapsed && (
      <CardContent className="pt-0">
        {/* Categorized Checklist Items */}
        <div className="space-y-3">
          {CHECKLIST_CATEGORIES.map((category) => (
            <ChecklistCategory
              key={category.id}
              category={category}
              items={categorizedItems[category.id]}
              expanded={expandedCategories[category.id]}
              onToggleExpand={() => toggleCategory(category.id)}
              onToggleItem={onToggle}
              onRemoveItem={onRemoveItem}
            />
          ))}
        </div>

        {/* Add Custom Item */}
        {isAdding ? (
          <div className="mt-4 flex items-center gap-2">
            <Input
              type="text"
              placeholder="Enter checklist item..."
              value={newItemLabel}
              onChange={(e) => setNewItemLabel(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              className="flex-1 text-sm"
            />
            <Button
              size="sm"
              onClick={handleAddItem}
              disabled={!newItemLabel.trim()}
            >
              Add
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setNewItemLabel('');
                setIsAdding(false);
              }}
            >
              Cancel
            </Button>
          </div>
        ) : (
          canAddItem && customItemCount < 3 && (
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-4"
              onClick={() => setIsAdding(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Checklist Item
              <span className="ml-2 text-xs text-gray-400">
                ({3 - customItemCount} remaining)
              </span>
            </Button>
          )
        )}

        {/* Max items reached message */}
        {customItemCount >= 3 && (
          <p className="mt-4 text-xs text-center text-gray-400">
            Maximum 3 custom items reached. Use Tasks for daily to-dos.
          </p>
        )}

        {/* Restore removed items - single button in bottom right */}
        {missingRemovableItems.length > 0 && onRestoreItem && (
          <TooltipProvider>
            <div className="mt-4 flex justify-end">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => {
                      // Restore all missing items
                      missingRemovableItems.forEach((itemId) => {
                        onRestoreItem(itemId, REMOVABLE_ITEM_LABELS[itemId]);
                      });
                    }}
                    className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-colors"
                    aria-label="Restore deleted items"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="left" className="text-xs">
                  Restore deleted items
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        )}

        {/* Hidden Items Section */}
        {allHiddenItems.length > 0 && (
          <div className="mt-4 border-t pt-4">
            <button
              onClick={() => setShowHiddenSection(!showHiddenSection)}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors w-full"
            >
              {showHiddenSection ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              <EyeOff className="w-4 h-4" />
              <span>Hidden Items ({allHiddenItems.length})</span>
              <span className="ml-auto text-xs text-gray-400">
                School doesn't require
              </span>
            </button>

            {showHiddenSection && (
              <div className="mt-3 space-y-2">
                {allHiddenItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-xl border border-dashed border-gray-200"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 italic">
                        {item.label}
                      </span>
                      <span className="text-xs text-gray-400">
                        (not required)
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => {
                                if (onRevealItem) {
                                  onRevealItem(item.id);
                                  // After revealing, optionally trigger report dialog
                                  if (onReportError) {
                                    // Small delay to let the reveal complete
                                    setTimeout(() => onReportError(item), 100);
                                  }
                                }
                              }}
                              className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                              aria-label={`Add ${item.label} to checklist`}
                            >
                              <PlusCircle className="w-4 h-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="text-xs">
                            Add to checklist
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                ))}
                <p className="text-xs text-gray-400 mt-2 text-center">
                  Adding an item you think should be required? We'll ask if you want to report it.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
      )}
    </Card>
  );
}
