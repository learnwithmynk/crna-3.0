/**
 * TargetProgramDetailPage - Full management view for a target program
 *
 * Features:
 * - Two-column layout (desktop), single column (mobile)
 * - Hero banner with school image
 * - Visual progress stepper (hidden when denied)
 * - Application checklist with progress tracking
 * - Collapsible requirements section
 * - Tabs for Tasks, LOR, Documents
 * - Personal notes with auto-save
 * - Personalized resources filtered by checklist completion
 * - Confetti animation on 100% checklist completion
 * - Mobile sticky action bar
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Confetti from 'react-confetti';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { usePrograms } from '@/hooks/usePrograms';
import {
  ProgramDetailHeader,
  ApplicationChecklist,
  ProgramNotes,
  ProgramTasksTab,
  ProgramLORTab,
  ProgramDocumentsTab,
  HelpfulResourcesSection,
  ProgramSidebar,
  ApplicationProgressStepper
} from '@/components/features/programs';
import {
  ChevronLeft,
  ListTodo,
  Users,
  FileText,
  AlertCircle,
  CheckSquare,
  Plus,
  ExternalLink
} from 'lucide-react';

export function TargetProgramDetailPage() {
  const { programId } = useParams();
  const navigate = useNavigate();
  const {
    targetPrograms,
    tasks,
    loading,
    updateTargetData,
    toggleChecklistItem,
    getSchoolNotes,
    updateSchoolNotes
  } = usePrograms();

  // Find the target program by id or programId
  const targetProgram = useMemo(() => {
    return targetPrograms.find(p => p.id === programId || p.programId === programId);
  }, [targetPrograms, programId]);

  // Extract school ID from programId for shared notes
  const schoolId = useMemo(() => {
    if (!targetProgram) return null;
    const pid = targetProgram.programId || programId;
    if (typeof pid === 'string' && pid.startsWith('school_')) {
      return Number(pid.replace('school_', ''));
    }
    return Number(pid);
  }, [targetProgram, programId]);

  // Get shared notes for this school (persists across saved/target status)
  const schoolNotes = schoolId ? getSchoolNotes(schoolId) : '';

  // Filter tasks for this program
  const programTasks = useMemo(() => {
    if (!targetProgram) return [];
    return tasks.filter(t => t.programId === targetProgram.programId);
  }, [tasks, targetProgram]);

  // UI State
  const [activeTab, setActiveTab] = useState('tasks');
  const [showConfetti, setShowConfetti] = useState(false);
  const [mobileActionOpen, setMobileActionOpen] = useState(null); // 'checklist' | 'task' | null

  // Window size for confetti
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  // Update window size for confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Track previous progress for confetti trigger
  const previousProgressRef = React.useRef(targetProgram?.targetData?.progress || 0);

  // Trigger confetti when progress hits 100%
  useEffect(() => {
    if (!targetProgram) return;
    const currentProgress = targetProgram.targetData?.progress || 0;
    const previousProgress = previousProgressRef.current;

    if (currentProgress === 100 && previousProgress < 100) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
    previousProgressRef.current = currentProgress;
  }, [targetProgram?.targetData?.progress]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-amber-50/80 via-orange-50/60 to-slate-100">
        <div className="px-4 md:px-8 lg:px-12 py-6 md:py-8 pb-24 lg:pb-8">
          <div className="space-y-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-48 rounded-2xl" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-40" />
                <Skeleton className="h-64" />
              </div>
              <div className="space-y-6">
                <Skeleton className="h-80" />
                <Skeleton className="h-40" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Program not found
  if (!targetProgram) {
    return (
      <div className="min-h-screen bg-linear-to-br from-amber-50/80 via-orange-50/60 to-slate-100">
        <div className="px-4 md:px-8 lg:px-12 py-6 md:py-8 pb-24 lg:pb-8">
          <Card className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Program Not Found</h2>
            <p className="text-gray-500 mb-4">
              This program may have been removed or you don't have access to it.
            </p>
            <Button onClick={() => navigate('/my-programs')}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to My Programs
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const { program, targetData } = targetProgram;

  // Handlers
  const handleStatusChange = (newStatus) => {
    updateTargetData(targetProgram.programId, { status: newStatus });
  };

  const handleNotesChange = (notes) => {
    // Use shared notes storage so notes persist when converting saved ↔ target
    if (schoolId) {
      updateSchoolNotes(schoolId, notes);
    }
  };

  const handleChecklistToggle = (itemId) => {
    toggleChecklistItem(targetProgram.programId, itemId);
  };

  const handleAddChecklistItem = (label) => {
    const newItem = {
      id: `custom_${Date.now()}`,
      label,
      completed: false,
      isDefault: false
    };
    const updatedChecklist = [...(targetData.checklist || []), newItem];
    updateTargetData(targetProgram.programId, { checklist: updatedChecklist });
  };

  const handleRemoveChecklistItem = (itemId) => {
    const updatedChecklist = (targetData.checklist || []).filter(item => item.id !== itemId);
    const completedCount = updatedChecklist.filter(item => item.completed).length;
    const progress = updatedChecklist.length > 0
      ? Math.round((completedCount / updatedChecklist.length) * 100)
      : 0;
    updateTargetData(targetProgram.programId, { checklist: updatedChecklist, progress });
  };

  const handleRestoreChecklistItem = (itemId, label) => {
    // Restore a previously removed default item
    const newItem = {
      id: itemId,
      label: label,
      completed: false,
      isDefault: true
    };
    const updatedChecklist = [...(targetData.checklist || []), newItem];
    const completedCount = updatedChecklist.filter(item => item.completed).length;
    const progress = updatedChecklist.length > 0
      ? Math.round((completedCount / updatedChecklist.length) * 100)
      : 0;
    updateTargetData(targetProgram.programId, { checklist: updatedChecklist, progress });
  };

  const handleVerifyRequirements = () => {
    updateTargetData(targetProgram.programId, { verifiedRequirements: true });
  };

  // Count custom checklist items
  const customItemCount = (targetData.checklist || []).filter(item => !item.isDefault).length;
  const canAddCustomItem = customItemCount < 3;

  // Check if status is denied (hide progress stepper)
  const isDenied = targetData.status === 'denied';

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50/80 via-orange-50/60 to-slate-100">
      {/* Confetti Animation */}
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.3}
        />
      )}

      <div className="px-4 md:px-8 lg:px-12 py-6 md:py-8 pb-24 lg:pb-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
          <Link to="/dashboard" className="hover:text-gray-700 min-h-11 flex items-center">
            My Dashboard
          </Link>
          <span aria-hidden="true">/</span>
          <Link to="/my-programs" className="hover:text-gray-700 min-h-11 flex items-center">
            My Programs
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-none">
            {program.name}
          </span>
        </nav>

        {/* Hero Banner */}
        <div className="relative h-40 md:h-48 rounded-2xl overflow-hidden mb-6">
          {program.imageUrl ? (
            <img
              src={program.imageUrl}
              alt={`${program.schoolName} campus`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-purple-100 via-pink-100 to-orange-100 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-white/80 flex items-center justify-center">
                  <span className="text-2xl font-bold text-purple-600">
                    {program.schoolName?.charAt(0) || 'P'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 font-medium">{program.schoolName}</p>
              </div>
            </div>
          )}
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/20 to-transparent" />
          {/* School info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
            <div className="flex items-end justify-between gap-4">
              <div className="text-white">
                <h1 className="text-xl md:text-2xl font-bold drop-shadow-lg">
                  {program.name}
                </h1>
                <p className="text-sm md:text-base text-white/90 drop-shadow">
                  {program.schoolName}
                </p>
              </div>
              <a
                href={`/schools/${program.id || program.programId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 bg-white/90 hover:bg-white text-gray-900 text-sm font-medium rounded-xl transition-colors min-h-11"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="hidden sm:inline">View School Profile</span>
              </a>
            </div>
          </div>
        </div>

        {/* Progress Stepper (hide when denied) */}
        {!isDenied && (
          <div className="mb-6">
            <ApplicationProgressStepper
              status={targetData.status}
              requirementsVerified={targetData.verifiedRequirements}
            />
          </div>
        )}

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (Main Content) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header with integrated requirements */}
            <ProgramDetailHeader
              program={program}
              status={targetData.status}
              onStatusChange={handleStatusChange}
              verified={targetData.verifiedRequirements}
              onVerify={handleVerifyRequirements}
            />

            {/* Tabs: Tasks, LOR, Documents */}
            <Card className="shadow-[0_0_20px_-5px_rgba(251,146,60,0.25),0_0_10px_-3px_rgba(251,191,36,0.2)] border border-orange-200/40">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <CardHeader className="pb-0">
                  <TabsList className="w-full sm:w-auto">
                    <TabsTrigger value="tasks" className="flex items-center gap-2">
                      <ListTodo className="w-4 h-4" />
                      Tasks
                    </TabsTrigger>
                    <TabsTrigger value="lor" className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      LOR
                    </TabsTrigger>
                    <TabsTrigger value="documents" className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Documents
                    </TabsTrigger>
                  </TabsList>
                </CardHeader>
                <CardContent className="pt-4">
                  <TabsContent value="tasks" className="mt-0">
                    <ProgramTasksTab
                      tasks={programTasks}
                      programId={targetProgram.programId}
                      programName={program.schoolName}
                    />
                  </TabsContent>
                  <TabsContent value="lor" className="mt-0">
                    <ProgramLORTab
                      lor={targetData.lor || []}
                      programId={targetProgram.programId}
                      onUpdate={(lor) => updateTargetData(targetProgram.programId, { lor })}
                    />
                  </TabsContent>
                  <TabsContent value="documents" className="mt-0">
                    <ProgramDocumentsTab
                      documents={targetData.documents || []}
                      programId={targetProgram.programId}
                      onUpdate={(documents) => updateTargetData(targetProgram.programId, { documents })}
                    />
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>

            {/* Helpful Resources Section */}
            <HelpfulResourcesSection
              checklist={targetData.checklist || []}
            />
          </div>

          {/* Right Column (Sidebar) - order-last on mobile so main content comes first */}
          <div className="space-y-6 order-last">
            {/* Application Checklist */}
            <ApplicationChecklist
              checklist={targetData.checklist || []}
              progress={targetData.progress || 0}
              onToggle={handleChecklistToggle}
              onAddItem={handleAddChecklistItem}
              onRemoveItem={handleRemoveChecklistItem}
              onRestoreItem={handleRestoreChecklistItem}
              canAddItem={canAddCustomItem}
            />

            {/* Notes - uses shared storage so notes persist when converting saved ↔ target */}
            <ProgramNotes
              notes={schoolNotes}
              onChange={handleNotesChange}
            />

            {/* Program Events + Digital Downloads */}
            <ProgramSidebar
              checklist={targetData.checklist || []}
              programId={targetProgram.programId}
              schoolName={program.schoolName}
              websiteUrl={program.websiteUrl}
            />
          </div>
        </div>

        {/* Mobile Sticky Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t shadow-lg p-3 flex gap-2 z-40">
          <Button
            variant="outline"
            className="flex-1 min-h-11"
            onClick={() => setMobileActionOpen('checklist')}
          >
            <CheckSquare className="w-4 h-4 mr-2" />
            Checklist
          </Button>
          <Button
            className="flex-1 min-h-11"
            onClick={() => setActiveTab('tasks')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>
    </div>
  );
}
