/**
 * SectionManager Component
 *
 * Manages sections within a module. Allows adding, editing, deleting,
 * and reordering sections. Each section contains a list of lessons.
 */

import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SortableLessonList } from './SortableLessonList';
import {
  GripVertical,
  ChevronDown,
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  FolderOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Single sortable section
 */
function SortableSection({
  section,
  lessons,
  isExpanded,
  onToggle,
  onEdit,
  onDelete,
  onAddLesson,
  onEditLesson,
  onDeleteLesson,
  onReorderLessons,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(section.title);
  const [isAddingLesson, setIsAddingLesson] = useState(false);
  const [newLessonTitle, setNewLessonTitle] = useState('');

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSaveTitle = () => {
    onEdit(section.id, { title: editTitle });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(section.title);
    setIsEditing(false);
  };

  const sectionLessons = lessons.filter((l) => l.section_id === section.id);

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        'mb-3 transition-shadow',
        isDragging && 'shadow-lg ring-2 ring-blue-500 bg-blue-50/50 z-50'
      )}
    >
      <CardHeader className="py-3 px-4">
        <div className="flex items-center gap-2">
          {/* Drag handle */}
          <button
            {...attributes}
            {...listeners}
            className="p-1 cursor-grab hover:bg-gray-100 rounded active:cursor-grabbing"
            aria-label="Drag to reorder"
          >
            <GripVertical className="w-4 h-4 text-gray-400" />
          </button>

          {/* Expand/collapse */}
          <button
            onClick={onToggle}
            className="p-1 hover:bg-gray-100 rounded"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </button>

          {/* Section title */}
          {isEditing ? (
            <div className="flex items-center gap-2 flex-1">
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="h-8"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveTitle();
                  if (e.key === 'Escape') handleCancelEdit();
                }}
              />
              <Button size="icon" variant="ghost" onClick={handleSaveTitle}>
                <Check className="w-4 h-4 text-green-500" />
              </Button>
              <Button size="icon" variant="ghost" onClick={handleCancelEdit}>
                <X className="w-4 h-4 text-gray-500" />
              </Button>
            </div>
          ) : (
            <>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{section.title}</h3>
                <p className="text-xs text-gray-500">
                  {sectionLessons.length} lesson{sectionLessons.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil className="w-4 h-4 text-gray-400" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onDelete(section.id)}
                >
                  <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                </Button>
              </div>
            </>
          )}
        </div>
      </CardHeader>

      {/* Lessons list */}
      {isExpanded && (
        <CardContent className="pt-0 pb-3 px-4">
          <div className="ml-6 pl-4 border-l-2 border-gray-100">
            <SortableLessonList
              lessons={sectionLessons}
              onReorder={(newOrder) => onReorderLessons(section.id, newOrder)}
              onEdit={onEditLesson}
              onDelete={onDeleteLesson}
            />

            {/* Add lesson inline form */}
            {isAddingLesson ? (
              <div className="flex items-center gap-2 mt-2">
                <Input
                  value={newLessonTitle}
                  onChange={(e) => setNewLessonTitle(e.target.value)}
                  placeholder="Lesson title"
                  className="h-8 text-sm"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newLessonTitle.trim()) {
                      onAddLesson(section.id, { title: newLessonTitle.trim() });
                      setNewLessonTitle('');
                      setIsAddingLesson(false);
                    }
                    if (e.key === 'Escape') {
                      setIsAddingLesson(false);
                      setNewLessonTitle('');
                    }
                  }}
                />
                <Button
                  size="sm"
                  onClick={() => {
                    if (newLessonTitle.trim()) {
                      onAddLesson(section.id, { title: newLessonTitle.trim() });
                      setNewLessonTitle('');
                      setIsAddingLesson(false);
                    }
                  }}
                  disabled={!newLessonTitle.trim()}
                >
                  Add
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setIsAddingLesson(false);
                    setNewLessonTitle('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 text-gray-500"
                onClick={() => setIsAddingLesson(true)}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Lesson
              </Button>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

/**
 * SectionManager Component
 */
export function SectionManager({
  sections = [],
  lessons = [],
  onAddSection,
  onEditSection,
  onDeleteSection,
  onReorderSections,
  onAddLesson,
  onEditLesson,
  onDeleteLesson,
  onReorderLessons,
}) {
  const [expandedSections, setExpandedSections] = useState(
    new Set(sections.map((s) => s.id))
  );
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [isAddingSection, setIsAddingSection] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const toggleSection = (id) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);
      const newOrder = arrayMove(sections, oldIndex, newIndex);
      onReorderSections(newOrder);
    }
  };

  const handleAddSection = () => {
    if (newSectionTitle.trim()) {
      onAddSection({ title: newSectionTitle.trim() });
      setNewSectionTitle('');
      setIsAddingSection(false);
    }
  };

  if (sections.length === 0 && !isAddingSection) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed">
        <FolderOpen className="w-12 h-12 mx-auto text-gray-300 mb-3" />
        <h3 className="font-medium text-gray-900 mb-1">No sections yet</h3>
        <p className="text-sm text-gray-500 mb-4">
          Create sections to organize your lessons
        </p>
        <Button onClick={() => setIsAddingSection(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add First Section
        </Button>
      </div>
    );
  }

  return (
    <div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sections.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          {sections.map((section) => (
            <SortableSection
              key={section.id}
              section={section}
              lessons={lessons}
              isExpanded={expandedSections.has(section.id)}
              onToggle={() => toggleSection(section.id)}
              onEdit={onEditSection}
              onDelete={onDeleteSection}
              onAddLesson={onAddLesson}
              onEditLesson={onEditLesson}
              onDeleteLesson={onDeleteLesson}
              onReorderLessons={onReorderLessons}
            />
          ))}
        </SortableContext>
      </DndContext>

      {/* Add section form */}
      {isAddingSection ? (
        <Card className="mt-3">
          <CardContent className="py-3 px-4">
            <div className="flex items-center gap-2">
              <Input
                value={newSectionTitle}
                onChange={(e) => setNewSectionTitle(e.target.value)}
                placeholder="Section title"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddSection();
                  if (e.key === 'Escape') {
                    setIsAddingSection(false);
                    setNewSectionTitle('');
                  }
                }}
              />
              <Button onClick={handleAddSection} disabled={!newSectionTitle.trim()}>
                Add
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setIsAddingSection(false);
                  setNewSectionTitle('');
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button
          variant="outline"
          className="mt-3 w-full"
          onClick={() => setIsAddingSection(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Section
        </Button>
      )}
    </div>
  );
}

export default SectionManager;
