/**
 * LessonEditPage - Admin
 *
 * Create and edit lessons with video, Editor.js content, and downloads.
 * Route: /admin/lessons/:lessonId
 */

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { Button } from '@/components/ui/button';
import { LessonForm } from '@/components/features/admin/LessonForm';
import { useLessonById, useLessonAdmin } from '@/hooks/useLessons';
import { useModule } from '@/hooks/useModules';
import {
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle,
  Eye,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import { DeleteConfirmModal } from '@/components/features/admin/DeleteConfirmModal';

export function LessonEditPage() {
  const { lessonId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // When accessing /admin/lessons/new, lessonId will be undefined (not 'new')
  // because we have a separate route for that path
  const isNew = !lessonId;
  const moduleIdParam = searchParams.get('moduleId');
  const sectionIdParam = searchParams.get('sectionId');

  // Fetch existing lesson by ID (if editing)
  const { lesson, module: lessonModule, isLoading, error } = useLessonById(
    isNew ? null : lessonId
  );

  // Get module for new lessons
  const { module: paramModule } = useModule(isNew ? moduleIdParam : null);

  // The module we're working with
  const module = lessonModule || paramModule;

  // Admin operations
  const { createLesson, updateLesson, deleteLesson } = useLessonAdmin(
    module?.id
  );

  // Local state
  const [lessonData, setLessonData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const formRef = useRef(null);

  // Track changes
  const handleChange = (data) => {
    setLessonData(data);
    setHasChanges(true);
  };

  // Save lesson
  const handleSave = async () => {
    if (!lessonData?.title?.trim()) {
      toast.error('Title is required');
      return;
    }

    if (!lessonData?.slug?.trim()) {
      toast.error('Slug is required');
      return;
    }

    setIsSaving(true);

    try {
      if (isNew) {
        // Create new lesson
        const { data: created, error: createError } = await createLesson({
          moduleId: moduleIdParam,
          sectionId: sectionIdParam || null,
          ...lessonData,
        });

        if (createError) {
          toast.error('Failed to create lesson', { description: createError });
          return;
        }

        toast.success('Lesson created!');
        setHasChanges(false);
        navigate(`/admin/lessons/${created.id}`, { replace: true });
      } else {
        // Update existing lesson
        const { error: updateError } = await updateLesson(lessonId, lessonData);

        if (updateError) {
          toast.error('Failed to save lesson', { description: updateError });
          return;
        }

        toast.success('Lesson saved!');
        setHasChanges(false);
      }
    } catch (err) {
      console.error('Failed to save lesson:', err);
      toast.error('Failed to save lesson');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete lesson
  const handleDelete = async () => {
    try {
      const { error: deleteError } = await deleteLesson(lessonId);

      if (deleteError) {
        toast.error('Failed to delete lesson', { description: deleteError });
        return;
      }

      toast.success('Lesson deleted');
      navigate(`/admin/modules/${module?.id}`, { replace: true });
    } catch (err) {
      console.error('Failed to delete lesson:', err);
      toast.error('Failed to delete lesson');
    }
  };

  // Preview lesson
  const handlePreview = () => {
    if (lessonData?.slug && module?.slug) {
      window.open(`/learn/${module.slug}/${lessonData.slug}`, '_blank');
    }
  };

  // Back navigation
  const handleBack = () => {
    if (module?.id) {
      navigate(`/admin/modules/${module.id}`);
    } else {
      navigate('/admin/modules');
    }
  };

  // Warn about unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

  // Loading state
  if (!isNew && isLoading) {
    return (
      <PageWrapper title="Loading...">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </PageWrapper>
    );
  }

  // Error state
  if (!isNew && error) {
    return (
      <PageWrapper title="Error">
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Failed to Load Lesson
          </h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button onClick={() => navigate('/admin/modules')}>
            Back to Modules
          </Button>
        </div>
      </PageWrapper>
    );
  }

  // Missing module for new lesson
  if (isNew && !moduleIdParam) {
    return (
      <PageWrapper title="Error">
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="w-12 h-12 text-amber-500 mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Module Required
          </h2>
          <p className="text-gray-500 mb-4">
            Please create lessons from within a module.
          </p>
          <Button onClick={() => navigate('/admin/modules')}>
            Go to Modules
          </Button>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title={isNew ? 'New Lesson' : lessonData?.title || lesson?.title || 'Edit Lesson'}
      description={
        isNew
          ? `Creating lesson in ${module?.title || 'module'}`
          : 'Edit lesson content and settings'
      }
    >
      {/* Lesson ID badge */}
      {!isNew && lessonId && (
        <div className="mb-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600 font-mono">
            ID: {lessonId}
          </span>
        </div>
      )}

      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={handleBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Module
        </Button>

        <div className="flex items-center gap-2">
          {/* Preview */}
          {!isNew && lessonData?.slug && module?.slug && (
            <Button variant="outline" onClick={handlePreview}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          )}

          {/* Delete */}
          {!isNew && (
            <Button
              variant="outline"
              onClick={() => setDeleteModalOpen(true)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          )}

          {/* Save */}
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Unsaved changes indicator */}
      {hasChanges && (
        <div className="mb-4 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
          You have unsaved changes
        </div>
      )}

      {/* Form */}
      <LessonForm
        ref={formRef}
        lesson={lesson}
        module={module}
        onChange={handleChange}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleDelete}
        title="Delete Lesson"
        itemName={lessonData?.title || lesson?.title}
      />
    </PageWrapper>
  );
}

export default LessonEditPage;
