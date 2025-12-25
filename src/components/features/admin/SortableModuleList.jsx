/**
 * SortableModuleList Component
 *
 * Drag & drop sortable list for modules using @dnd-kit.
 * Allows reordering modules and provides visual feedback during drag.
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
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  GripVertical,
  BookOpen,
  MoreVertical,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

/**
 * Single sortable module item
 */
function SortableModuleItem({ module, onEdit, onDelete, onTogglePublish }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: module.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center gap-4 p-4 mb-2 transition-shadow',
        isDragging && 'shadow-lg ring-2 ring-blue-500 bg-blue-50/50 z-50'
      )}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="p-1 cursor-grab hover:bg-gray-100 rounded active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        <GripVertical className="w-5 h-5 text-gray-400" />
      </button>

      {/* Module icon */}
      <div
        className={cn(
          'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
          module.status === 'published' ? 'bg-green-100' : 'bg-gray-100'
        )}
      >
        <BookOpen
          className={cn(
            'w-5 h-5',
            module.status === 'published' ? 'text-green-600' : 'text-gray-400'
          )}
        />
      </div>

      {/* Module info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-gray-900 truncate">{module.title}</h3>
          <Badge
            variant={module.status === 'published' ? 'default' : 'secondary'}
            className="shrink-0"
          >
            {module.status === 'published' ? 'Published' : 'Draft'}
          </Badge>
        </div>
        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
          <span>{module.lesson_count || 0} lessons</span>
          <span>•</span>
          <span>Updated {formatDate(module.updated_at)}</span>
          {module.category_slug && (
            <>
              <span>•</span>
              <span className="capitalize">{module.category_slug}</span>
            </>
          )}
        </div>
      </div>

      {/* Actions dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="shrink-0">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(module)}>
            <Pencil className="w-4 h-4 mr-2" />
            Edit Module
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onTogglePublish(module)}>
            {module.status === 'published' ? (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                Unpublish
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Publish
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => onDelete(module)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Card>
  );
}

/**
 * SortableModuleList Component
 */
export function SortableModuleList({
  modules,
  onReorder,
  onEdit,
  onDelete,
  onTogglePublish,
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = modules.findIndex((m) => m.id === active.id);
      const newIndex = modules.findIndex((m) => m.id === over.id);
      const newOrder = arrayMove(modules, oldIndex, newIndex);
      onReorder(newOrder);
    }
  };

  if (modules.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed">
        <BookOpen className="w-12 h-12 mx-auto text-gray-300 mb-3" />
        <h3 className="font-medium text-gray-900 mb-1">No modules yet</h3>
        <p className="text-sm text-gray-500">
          Create your first module to get started
        </p>
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
        items={modules.map((m) => m.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {modules.map((module) => (
            <SortableModuleItem
              key={module.id}
              module={module}
              onEdit={onEdit}
              onDelete={onDelete}
              onTogglePublish={onTogglePublish}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

export default SortableModuleList;
