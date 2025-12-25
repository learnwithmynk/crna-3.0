/**
 * ModuleDetailPage - Admin
 *
 * Edit module details, manage sections, and organize lessons.
 * Route: /admin/modules/:moduleId
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ModuleForm } from '@/components/features/admin/ModuleForm';
import { SectionManager } from '@/components/features/admin/SectionManager';
import { DeleteConfirmModal } from '@/components/features/admin/DeleteConfirmModal';
import { useModule, useModuleAdmin } from '@/hooks/useModules';
import { useLessonAdmin } from '@/hooks/useLessons';
import {
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle,
  Eye,
  Settings,
  FolderTree,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function ModuleDetailPage() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const isNew = moduleId === 'new';

  // Hooks
  const { module, isLoading, error } = useModule(isNew ? null : moduleId);
  const { createModule, updateModule, deleteModule } = useModuleAdmin();
  const {
    lessons,
    sections,
    createLesson,
    updateLesson,
    deleteLesson,
    createSection,
    updateSection,
    deleteSection,
    reorderSections,
    reorderLessons,
  } = useLessonAdmin(isNew ? null : moduleId);

  // Local state
  const [moduleData, setModuleData] = useState({
    title: '',
    slug: '',
    description: '',
    thumbnail_url: '',
    category_slug: '',
    status: 'draft',
    entitlement_slugs: [],
  });
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState(null); // 'lesson' | 'section'

  // Load module data
  useEffect(() => {
    if (module) {
      setModuleData({
        title: module.title || '',
        slug: module.slug || '',
        description: module.description || '',
        thumbnail_url: module.thumbnail_url || '',
        category_slug: module.category_slug || '',
        status: module.status || 'draft',
        entitlement_slugs: module.entitlement_slugs || [],
      });
    }
  }, [module]);

  // Handlers
  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (isNew) {
        const { data: created, error: createError } = await createModule(moduleData);
        if (createError) {
          toast.error('Failed to create module', { description: createError });
          return;
        }
        toast.success('Module created!');
        navigate(`/admin/modules/${created.id}`, { replace: true });
      } else {
        const { error: updateError } = await updateModule(moduleId, moduleData);
        if (updateError) {
          toast.error('Failed to save module', { description: updateError });
          return;
        }
        toast.success('Module saved!');
      }
    } catch (err) {
      console.error('Failed to save module:', err);
      toast.error('Failed to save module');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSection = async (data) => {
    try {
      await createSection({
        ...data,
        module_id: moduleId,
        sort_order: sections.length,
      });
    } catch (err) {
      console.error('Failed to create section:', err);
    }
  };

  const handleEditSection = async (sectionId, data) => {
    try {
      await updateSection(sectionId, data);
    } catch (err) {
      console.error('Failed to update section:', err);
    }
  };

  const handleDeleteSection = (sectionId) => {
    const section = sections.find((s) => s.id === sectionId);
    setItemToDelete(section);
    setDeleteType('section');
    setDeleteModalOpen(true);
  };

  const handleReorderSections = async (newOrder) => {
    try {
      await reorderSections(newOrder.map((s) => s.id));
    } catch (err) {
      console.error('Failed to reorder sections:', err);
    }
  };

  const handleAddLesson = (sectionId) => {
    navigate(`/admin/lessons/new?moduleId=${moduleId}&sectionId=${sectionId}`);
  };

  const handleEditLesson = (lesson) => {
    navigate(`/admin/lessons/${lesson.id}`);
  };

  const handleDeleteLesson = (lesson) => {
    setItemToDelete(lesson);
    setDeleteType('lesson');
    setDeleteModalOpen(true);
  };

  const handleReorderLessons = async (sectionId, newOrder) => {
    try {
      await reorderLessons(sectionId, newOrder.map((l) => l.id));
    } catch (err) {
      console.error('Failed to reorder lessons:', err);
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      if (deleteType === 'lesson') {
        await deleteLesson(itemToDelete.id);
      } else if (deleteType === 'section') {
        await deleteSection(itemToDelete.id);
      }
      setDeleteModalOpen(false);
      setItemToDelete(null);
      setDeleteType(null);
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const handlePreview = () => {
    if (moduleData.slug) {
      window.open(`/learn/${moduleData.slug}`, '_blank');
    }
  };

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
            Failed to Load Module
          </h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button onClick={() => navigate('/admin/modules')}>
            Back to Modules
          </Button>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title={isNew ? 'New Module' : moduleData.title || 'Edit Module'}
      description={isNew ? 'Create a new learning module' : 'Edit module settings and content'}
    >
      {/* Module ID badge */}
      {!isNew && moduleId && (
        <div className="mb-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600 font-mono">
            ID: {moduleId}
          </span>
        </div>
      )}
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/modules')}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Modules
        </Button>

        <div className="flex items-center gap-2">
          {!isNew && moduleData.slug && (
            <Button variant="outline" onClick={handlePreview}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          )}
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

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="details" className="gap-2">
            <Settings className="w-4 h-4" />
            Details
          </TabsTrigger>
          {!isNew && (
            <TabsTrigger value="content" className="gap-2">
              <FolderTree className="w-4 h-4" />
              Content
            </TabsTrigger>
          )}
        </TabsList>

        {/* Details Tab */}
        <TabsContent value="details">
          <ModuleForm
            module={moduleData}
            onChange={setModuleData}
          />
        </TabsContent>

        {/* Content Tab */}
        {!isNew && (
          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle>Sections & Lessons</CardTitle>
              </CardHeader>
              <CardContent>
                <SectionManager
                  sections={sections || []}
                  lessons={lessons || []}
                  onAddSection={handleAddSection}
                  onEditSection={handleEditSection}
                  onDeleteSection={handleDeleteSection}
                  onReorderSections={handleReorderSections}
                  onAddLesson={handleAddLesson}
                  onEditLesson={handleEditLesson}
                  onDeleteLesson={handleDeleteLesson}
                  onReorderLessons={handleReorderLessons}
                />
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* Delete Confirmation */}
      <DeleteConfirmModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        title={deleteType === 'section' ? 'Delete Section' : 'Delete Lesson'}
        itemName={itemToDelete?.title}
        description={
          deleteType === 'section'
            ? 'Deleting this section will also remove all lessons within it.'
            : undefined
        }
      />
    </PageWrapper>
  );
}

export default ModuleDetailPage;
