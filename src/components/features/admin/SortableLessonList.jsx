/**
 * SortableLessonList Component
 *
 * Drag & drop sortable list of lessons within a section.
 */

import React from 'react';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  GripVertical,
  FileText,
  Pencil,
  Trash2,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

/**
 * Single sortable lesson item
 */
function SortableLessonItem({ lesson, onEdit, onDelete }) {
  const [copied, setCopied] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lesson.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const copyUrl = () => {
    const moduleSlug = lesson.module_slug || 'module';
    const url = `${window.location.origin}/learn/${moduleSlug}/${lesson.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center gap-3 p-2 bg-white rounded-xl border mb-2',
        'hover:bg-gray-50 transition-colors',
        isDragging && 'shadow-lg ring-2 ring-blue-500 bg-blue-50 z-50'
      )}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="p-1 cursor-grab hover:bg-gray-100 rounded active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        <GripVertical className="w-4 h-4 text-gray-400" />
      </button>

      {/* Lesson icon */}
      <div
        className={cn(
          'w-8 h-8 rounded flex items-center justify-center shrink-0',
          lesson.status === 'published' ? 'bg-green-100' : 'bg-gray-100'
        )}
      >
        <FileText
          className={cn(
            'w-4 h-4',
            lesson.status === 'published' ? 'text-green-600' : 'text-gray-400'
          )}
        />
      </div>

      {/* Lesson info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm text-gray-900 truncate">
            {lesson.title}
          </span>
          <Badge
            variant={lesson.status === 'published' ? 'default' : 'secondary'}
            className="text-xs shrink-0"
          >
            {lesson.status === 'published' ? 'Published' : 'Draft'}
          </Badge>
        </div>
        <p className="text-xs text-gray-500 truncate">
          /{lesson.slug}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7"
          onClick={copyUrl}
          title="Copy URL"
        >
          {copied ? (
            <Check className="w-3 h-3 text-green-500" />
          ) : (
            <Copy className="w-3 h-3 text-gray-400" />
          )}
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7"
          onClick={() => onEdit(lesson)}
          title="Edit"
        >
          <Pencil className="w-3 h-3 text-gray-400" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7"
          onClick={() => onDelete(lesson)}
          title="Delete"
        >
          <Trash2 className="w-3 h-3 text-gray-400 hover:text-red-500" />
        </Button>
      </div>
    </div>
  );
}

/**
 * SortableLessonList Component
 */
export function SortableLessonList({ lessons = [], onReorder, onEdit, onDelete }) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = lessons.findIndex((l) => l.id === active.id);
      const newIndex = lessons.findIndex((l) => l.id === over.id);
      const newOrder = arrayMove(lessons, oldIndex, newIndex);
      onReorder(newOrder);
    }
  };

  if (lessons.length === 0) {
    return (
      <div className="text-center py-4 text-sm text-gray-400">
        No lessons in this section
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={lessons.map((l) => l.id)}
        strategy={verticalListSortingStrategy}
      >
        {lessons.map((lesson) => (
          <SortableLessonItem
            key={lesson.id}
            lesson={lesson}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
}

export default SortableLessonList;
