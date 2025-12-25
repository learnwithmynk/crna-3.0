/**
 * SchoolProfilePage
 *
 * Detailed view of a single CRNA program.
 * Shows all information on one screen without tabs.
 *
 * Card Design System:
 * - Personal cards (My Notes, My Documents): Full sunset gradient bg with thick border + glow
 * - Need Prerequisites: Regular card style with purple sparkle indicator
 * - Regular cards: White with border, hover effect (scale + illuminate)
 * - Section headers: Sunset gradient with filled background icons
 *
 * TODO: Replace mock data with Supabase/WordPress API call
 */

import { useState, useMemo } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { SchoolHeader } from '@/components/features/schools/SchoolHeader';
import { NewTopicModal } from '@/components/features/community';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Calendar,
  FileText,
  MessageSquare,
  Users,
  BookOpen,
  ExternalLink,
  Clock,
  DollarSign,
  Award,
  Building2,
  TrendingUp,
  GraduationCap,
  Stethoscope,
  CheckCircle2,
  XCircle,
  AlertCircle,
  HelpCircle,
  ClipboardList,
  Instagram,
  Mail,
  Phone,
  MapPin,
  StickyNote,
  ChevronDown,
  ChevronUp,
  Star,
  Sparkles,
  FolderOpen,
  Info,
  MessageCircle,
  Download,
  Pencil,
  Trash2,
  ThumbsUp,
} from 'lucide-react';
import { useSchools } from '@/hooks/useSchools';
import { usePrograms } from '@/hooks/usePrograms';
import { useEvents } from '@/hooks/useEvents';
import { useTopics } from '@/hooks/useTopics';
import { RecommendedMentorsWidget } from '@/components/features/marketplace/RecommendedMentorsWidget';
import { ReportRequirementError } from '@/components/features/programs/ReportRequirementError';
import { mockForums } from '@/data/mockForums';
import { mockPrerequisiteCourses, SUBJECT_AREAS } from '@/data/mockPrerequisites';
import { cn } from '@/lib/utils';
import { formatDistanceToNowStrict } from 'date-fns';

// Filled background icon component
function FilledIcon({ icon: Icon, className }) {
  return (
    <div className={cn(
      "w-8 h-8 rounded-xl flex items-center justify-center",
      "bg-gradient-to-br from-orange-100 to-amber-50",
      className
    )}>
      <Icon className="w-4 h-4 text-orange-600" />
    </div>
  );
}

// Section header - inline style without banner
function SectionHeader({ children, icon: Icon, tooltip, rightElement }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <FilledIcon icon={Icon} />
      <h3 className="font-semibold text-gray-900 flex-1">{children}</h3>
      {rightElement}
      {tooltip && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="text-gray-400 hover:text-orange-500 transition-colors">
                <Info className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-xs bg-white border border-gray-200 shadow-lg p-3">
              <p className="text-sm text-gray-700">{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}

// Hoverable card wrapper with border and hover effect
function HoverCard({ children, className }) {
  return (
    <Card className={cn(
      "overflow-hidden border border-gray-200/80 transition-all duration-200",
      "hover:border-orange-200 hover:shadow-[0_0_20px_rgba(249,115,22,0.08)] hover:scale-[1.01]",
      "p-5",
      className
    )}>
      {children}
    </Card>
  );
}

// Full gradient personal card (My Notes, My Documents)
function GradientCard({ children, title, icon: Icon, collapsible, isExpanded, onToggle }) {
  return (
    <div className="rounded-3xl overflow-hidden border border-orange-200/80 bg-linear-to-br from-[#FFF4E6] via-[#FFE4CC] to-[#FFECD2]">
        {collapsible ? (
          <button
            onClick={onToggle}
            className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-orange-50/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <FilledIcon icon={Icon} />
              <span className="font-semibold text-gray-900">{title}</span>
            </div>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-orange-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-orange-500" />
            )}
          </button>
        ) : (
          <div className="px-5 py-4 flex items-center gap-3">
            <FilledIcon icon={Icon} />
            <span className="font-semibold text-gray-900">{title}</span>
          </div>
        )}
        {(!collapsible || isExpanded) && (
          <div className="px-5 pb-5 pt-2">
            {children}
          </div>
        )}
    </div>
  );
}

// Format short time for forum posts
function formatShortTime(timestamp) {
  try {
    const date = new Date(timestamp);
    const result = formatDistanceToNowStrict(date, { addSuffix: false });
    return result
      .replace(' seconds', 's')
      .replace(' second', 's')
      .replace(' minutes', 'm')
      .replace(' minute', 'm')
      .replace(' hours', 'h')
      .replace(' hour', 'h')
      .replace(' days', 'd')
      .replace(' day', 'd')
      .replace(' weeks', 'w')
      .replace(' week', 'w')
      .replace(' months', 'mo')
      .replace(' month', 'mo')
      .replace(' years', 'y')
      .replace(' year', 'y');
  } catch (err) {
    return 'now';
  }
}

// Get initials from name
function getInitials(name) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Map prerequisite text to subject keys
function mapPrereqToSubjects(prereqList) {
  const subjectMap = {
    'statistics': 'statistics',
    'stats': 'statistics',
    'chemistry': 'general_chemistry',
    'general chemistry': 'general_chemistry',
    'organic chemistry': 'organic_chemistry',
    'biochemistry': 'biochemistry',
    'anatomy': 'anatomy',
    'physiology': 'physiology',
    'anatomy & physiology': 'anatomy_physiology',
    'anatomy and physiology': 'anatomy_physiology',
    'a&p': 'anatomy_physiology',
    'physics': 'physics',
    'microbiology': 'microbiology',
    'pharmacology': 'pharmacology',
    'pathophysiology': 'pathophysiology',
    'research': 'research',
  };

  const subjects = new Set();
  prereqList.forEach(prereq => {
    const lower = prereq.toLowerCase();
    Object.entries(subjectMap).forEach(([keyword, subject]) => {
      if (lower.includes(keyword)) {
        subjects.add(subject);
      }
    });
  });
  return Array.from(subjects);
}

// Mock discussion topics for this school
const mockSchoolDiscussions = [
  {
    id: 'topic_1',
    title: 'Anyone else applying for Spring 2026?',
    preview: 'Just submitted my application last week. Wondering if anyone else is in the same cohort...',
    author: { name: 'FutureCRNA', avatar: null },
    likeCount: 8,
    replyCount: 12,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'topic_2',
    title: 'Interview tips for this program?',
    preview: 'I have an interview scheduled for next month. Any advice from current students or recent applicants?',
    author: { name: 'ICUNurse2024', avatar: null },
    likeCount: 15,
    replyCount: 23,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Mock documents for this school
const mockDocuments = [
  { id: 'doc_1', name: 'Personal Statement Draft', type: 'essay', uploadedAt: '2024-11-15' },
];

export function SchoolProfilePage() {
  const { schoolId } = useParams();
  const {
    getSchoolById,
    saveSchool,
    unsaveSchool,
    makeTarget,
    removeTarget,
  } = useSchools();
  const { getSchoolNotes, updateSchoolNotes } = usePrograms();
  const { events } = useEvents();

  // Get school data
  const school = getSchoolById(schoolId);

  // Handle school not found
  if (!school) {
    return <Navigate to="/schools" replace />;
  }

  // State for collapsible sections
  const [isNotesExpanded, setIsNotesExpanded] = useState(true);
  const [isDocsExpanded, setIsDocsExpanded] = useState(true);

  // State for new topic modal
  const [newTopicSheetOpen, setNewTopicSheetOpen] = useState(false);

  // Get notes for this school
  const schoolNotes = getSchoolNotes(school.id);
  const handleNotesChange = (notes) => {
    updateSchoolNotes(school.id, notes);
  };

  // Get forum data for this school
  const schoolForum = useMemo(() => {
    const programsForumList = mockForums.find(f => f.slug === 'crna-programs');
    if (!programsForumList) return null;
    return programsForumList.sub_forums?.find(sf => sf.school_id === school.id);
  }, [school.id]);

  // Hook for creating topics in this school's forum
  const { createTopic } = useTopics(schoolForum?.id);

  // Handle creating a new topic
  const handleCreateTopic = async (data) => {
    if (!schoolForum?.id) return;
    await createTopic(schoolForum.id, data.title, data.content, data.honeypot);
    setNewTopicSheetOpen(false);
  };

  // Get upcoming events for this school
  const schoolEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return events
      .filter(e => e.schoolId === school.id || e.schoolId === `school_${school.id}`)
      .filter(e => new Date(e.date) >= today)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 3);
  }, [events, school.id]);

  // Get matching prerequisite courses from library
  const matchingCourses = useMemo(() => {
    const prereqList = school.prerequisites?.length > 0
      ? school.prerequisites
      : ['Statistics', 'General Chemistry'];

    const requiredSubjects = mapPrereqToSubjects(prereqList);
    if (requiredSubjects.length === 0) return [];

    return mockPrerequisiteCourses
      .filter(course => requiredSubjects.includes(course.subject))
      .sort((a, b) => b.reviewCount - a.reviewCount)
      .slice(0, 4);
  }, [school.prerequisites]);

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // GRE requirements
  const greInfo = {
    required: school.greRequired ? 'Required' : 'Not Required',
    expiration: school.greExpiration || 'Yes',
    waivedFor: school.greWaivedFor || 'Not specified',
  };

  // Accepted experience types
  const acceptedExperience = [
    { type: 'NICU Experience', accepted: school.acceptsNicu },
    { type: 'PICU Experience', accepted: school.acceptsPicu },
    { type: 'ER Experience', accepted: school.acceptsEr },
    { type: 'Other Critical Care', accepted: school.acceptsOtherCriticalCare },
  ];

  // Generate placeholder image URL
  const getSchoolImageUrl = () => {
    if (school.imageUrl) return school.imageUrl;
    const seed = encodeURIComponent(school.name || 'university');
    return `https://picsum.photos/seed/${seed}/400/250`;
  };

  // Get subject label
  const getSubjectLabel = (subjectKey) => {
    const subject = SUBJECT_AREAS.find(s => s.key === subjectKey);
    return subject ? subject.label : subjectKey;
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50/80 to-pink-50/25">
      <PageWrapper className="px-8 md:px-16 lg:px-24 xl:px-32 pt-8 md:pt-12 lg:pt-16 pb-8 bg-transparent relative z-10">
        {/* Header */}
        <SchoolHeader
          school={school}
          onSave={saveSchool}
          onUnsave={unsaveSchool}
          onMakeTarget={makeTarget}
          onRemoveTarget={removeTarget}
        />

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              {/* Fast Facts */}
              <HoverCard>
                <SectionHeader icon={ClipboardList}>Fast Facts</SectionHeader>
                <div className="mt-4">
                  <div className="grid grid-cols-4 gap-x-4 gap-y-2 text-sm">
                    <div>
                      <span className="text-xs text-gray-500">Type:</span>
                      <p className="font-semibold capitalize">{school.programType?.replace('_', '-') || 'Integrated'}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Start:</span>
                      <p className="font-semibold">{school.startDates?.join(', ') || 'Contact'}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Length:</span>
                      <p className="font-semibold">{school.lengthMonths ? `${school.lengthMonths} mo` : 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Degree:</span>
                      <p className="font-semibold">{school.degree?.toUpperCase() || 'DNAP'}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Class Size:</span>
                      <p className="font-semibold">{school.classSize || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Clinical Sites:</span>
                      <p className="font-semibold">{school.clinicalSites || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Min. GPA:</span>
                      <p className="font-semibold">{school.minimumGpa || '3.0'}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Experience:</span>
                      <p className="font-semibold">{school.minimumExperience || 1} yr</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">NCE Pass:</span>
                      <p className={cn("font-semibold", school.ncePassRate >= 90 && "text-green-600")}>
                        {school.ncePassRate ? `${school.ncePassRate}%` : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Attrition:</span>
                      <p className="font-semibold">{school.attritionRate != null ? `${school.attritionRate}%` : 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">NursingCAS:</span>
                      <p className="font-semibold">{school.applicationSystem === 'nursingcas' ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Rolling:</span>
                      <p className="font-semibold">{school.rollingAdmissions ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Online:</span>
                      <p className="font-semibold">{school.partiallyOnline ? 'Partial' : 'No'}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Work:</span>
                      <p className="font-semibold">{school.ableToWork ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">CCRN:</span>
                      <p className="font-semibold">{school.ccrnRequired ? 'Required' : 'Preferred'}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Shadowing:</span>
                      <p className="font-semibold">{school.shadowingRequired ? 'Required' : 'Recommended'}</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100 text-sm">
                    <span className="text-gray-500">Degree from Regionally Accredited Institution Required?</span>
                    <span className="font-semibold ml-2">Yes</span>
                  </div>
                </div>
              </HoverCard>

              {/* Two Column Grid: GPA Calculations & GRE Requirements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* GPA Calculations */}
                <HoverCard>
                  <SectionHeader icon={GraduationCap}>GPA Calculations</SectionHeader>
                  <div className="mt-4">
                    <div className="mb-3">
                      <span className="text-xs text-gray-500">GPA Type:</span>
                      <p className="font-semibold text-sm">{school.gpaType || 'Cumulative & Science GPA'}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Calculation Notes:</span>
                      <p className="text-xs text-gray-600 leading-relaxed mt-1">
                        {school.gpaNotes ||
                          `Minimum cumulative GPA of ${school.minimumGpa || '3.20'} on a 4.00 scale. Minimum science GPA of 3.0 on a 4.00 scale. Cumulative GPA based on last 60 credit hours.`
                        }
                      </p>
                    </div>
                  </div>
                </HoverCard>

                {/* GRE Requirements */}
                <HoverCard>
                  <SectionHeader icon={FileText}>GRE Requirements</SectionHeader>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Required:</span>
                      <span className="font-medium">{greInfo.required}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Expiration:</span>
                      <span className="font-medium">{greInfo.expiration}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Waived For:</span>
                      <span className="font-medium">{greInfo.waivedFor}</span>
                    </div>
                  </div>
                </HoverCard>
              </div>

              {/* Two Column Grid: Prerequisites & References */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Prerequisites */}
                <HoverCard>
                  <SectionHeader icon={BookOpen}>Prerequisites</SectionHeader>
                  <div className="mt-4 space-y-2 text-sm">
                    {school.prerequisites && school.prerequisites.length > 0 ? (
                      school.prerequisites.map((prereq, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-gray-400">•</span>
                          <span>{prereq}</span>
                        </div>
                      ))
                    ) : (
                      <div>
                        <p>Statistics, General Chemistry</p>
                        <p className="text-xs text-gray-500 mt-2 font-medium">Additional Notes:</p>
                        <p className="text-xs text-gray-600 mt-1">
                          Chemistry for Nurse Anesthesia required by December 31 prior to enrollment.
                        </p>
                      </div>
                    )}
                  </div>
                </HoverCard>

                {/* References */}
                <HoverCard>
                  <SectionHeader icon={Users}>References</SectionHeader>
                  <div className="mt-4 text-sm">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600"># of References:</span>
                      <span className="font-medium">{school.referencesRequired || 3}</span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {school.referencesDescription ||
                        `Submit three letters of recommendation. One from a licensed CRNA, one from your immediate supervisor, and one from a current RN/APRN co-worker.`
                      }
                    </p>
                  </div>
                </HoverCard>
              </div>

              {/* Essay Prompt */}
              {school.essayPrompt && (
                <HoverCard>
                  <SectionHeader icon={FileText}>Essay Prompt</SectionHeader>
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 leading-relaxed">{school.essayPrompt}</p>
                  </div>
                </HoverCard>
              )}

              {/* Additional Experience Accepted */}
              <HoverCard>
                <SectionHeader icon={Stethoscope}>Additional Experience Accepted</SectionHeader>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {acceptedExperience.map((exp) => (
                    <div key={exp.type} className="flex items-center gap-2 text-sm">
                      {exp.accepted ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span className={exp.accepted ? 'text-gray-700' : 'text-gray-500'}>
                        {exp.type}
                      </span>
                    </div>
                  ))}
                </div>
              </HoverCard>

              {/* Additional Requirements */}
              {school.programNotes && (
                <HoverCard>
                  <SectionHeader icon={ClipboardList}>Additional Requirements</SectionHeader>
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 leading-relaxed">{school.programNotes}</p>
                  </div>
                </HoverCard>
              )}

              {/* Convos About This School - Skool-inspired style matching Dashboard */}
              <HoverCard>
                <SectionHeader icon={MessageSquare}>Convos About This School</SectionHeader>
                <div className="mt-6">
                  {/* Discussion snippets - Skool-inspired style */}
                  <div className="space-y-8">
                    {mockSchoolDiscussions.map((topic) => (
                      <Link
                        key={topic.id}
                        to={`/community/forums/${topic.id}`}
                        className="flex items-start gap-4 group"
                      >
                        {/* User avatar - subtle gray background */}
                        <Avatar className="w-11 h-11 shrink-0">
                          <AvatarImage src={topic.author?.avatar} alt={topic.author?.name} />
                          <AvatarFallback className="bg-gray-100 text-gray-500 text-sm font-semibold">
                            {getInitials(topic.author?.name || 'User')}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          {/* Title */}
                          <p className="mb-1.5">
                            <span className="font-bold text-base text-gray-900 group-hover:text-orange-600 transition-colors">
                              {topic.title}
                            </span>
                          </p>

                          {/* Preview text - 2 lines */}
                          <p className="text-sm text-gray-500 line-clamp-2 mb-3 leading-relaxed">
                            {topic.preview}
                          </p>

                          {/* Bottom row: Likes, Comments, Time */}
                          <div className="flex items-center gap-5 text-sm text-gray-300">
                            <span className="flex items-center gap-1.5">
                              <ThumbsUp className="w-4 h-4" strokeWidth={1.5} />
                              <span>{topic.likeCount || 0}</span>
                            </span>
                            <span className="flex items-center gap-1.5">
                              <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
                              <span>{topic.replyCount || 0}</span>
                            </span>
                            <span>{formatShortTime(topic.createdAt)}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* View all link */}
                  <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <Link
                      to={`/forums/programs/${school.id}`}
                      className="text-xs font-medium uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      View all discussions →
                    </Link>
                    <Button
                      size="sm"
                      onClick={() => setNewTopicSheetOpen(true)}
                      className="bg-linear-to-r from-[#F97316] to-[#F59E0B] hover:from-[#EA580C] hover:to-[#D97706] text-white border-none"
                    >
                      <FileText className="w-3 h-3 mr-1" />
                      New discussion
                    </Button>
                  </div>
                </div>
              </HoverCard>
            </div>

            {/* Sidebar - 1 column */}
            <div className="space-y-4">
              {/* School Image & Description */}
              <Card className="overflow-hidden border border-gray-200/80 transition-all duration-200 hover:border-orange-200 hover:shadow-[0_0_20px_rgba(249,115,22,0.08)] hover:scale-[1.01]">
                <img
                  src={getSchoolImageUrl()}
                  alt={`${school.name} campus`}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=250&fit=crop';
                  }}
                />
                <div className="p-5">
                  <p className="text-sm text-gray-600">
                    {school.description ||
                      `${school.name} in ${school.city}, ${school.state} is a ${school.programType?.replace('_', ' ') || 'integrated'} program. The ${school.greRequired ? 'GRE is required' : 'GRE is not required'} and program length is ${school.lengthMonths || 36} months.`
                    }
                  </p>
                </div>
              </Card>

              {/* Estimated Tuition - Compact with tooltip */}
              <HoverCard>
                <SectionHeader
                  icon={DollarSign}
                  tooltip="It's nearly impossible to get an accurate tuition estimate. We recommend attending an open house or contacting the school directly for the most current tuition information."
                >
                  Estimated Tuition
                </SectionHeader>
                <div className="mt-3 flex justify-between text-sm">
                  <div>
                    <span className="text-xs text-gray-500">In-State:</span>
                    <p className="font-semibold">{formatCurrency(school.tuitionInState)}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500">Out-of-State:</span>
                    <p className="font-semibold">{formatCurrency(school.tuitionOutOfState)}</p>
                  </div>
                </div>
              </HoverCard>

              {/* Application Dates */}
              <HoverCard>
                <SectionHeader icon={Calendar}>Application Dates</SectionHeader>
                <div className="mt-4 space-y-2 text-sm">
                  <div>
                    <span className="text-gray-500">Applications Open:</span>
                    <p className="font-medium">
                      {school.applicationOpenDate
                        ? new Date(school.applicationOpenDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                        : 'Contact school'
                      }
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Applications Close:</span>
                    <p className="font-medium">
                      {school.applicationDeadline
                        ? new Date(school.applicationDeadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                        : 'Rolling'
                      }
                    </p>
                  </div>
                </div>
              </HoverCard>

              {/* My Notes - Full gradient background */}
              <GradientCard
                title="My Notes"
                icon={StickyNote}
                collapsible
                isExpanded={isNotesExpanded}
                onToggle={() => setIsNotesExpanded(!isNotesExpanded)}
              >
                <Textarea
                  placeholder="My notes about the program here..."
                  value={schoolNotes || ''}
                  onChange={(e) => handleNotesChange(e.target.value)}
                  className="min-h-20 resize-none bg-white/80 border-orange-200 focus:border-orange-400"
                />
                <p className="text-xs text-orange-700/70 mt-2">
                  ⓘ Notes are private and saved automatically.
                </p>
              </GradientCard>

              {/* My Documents - Full gradient background with edit/download/trash */}
              <GradientCard
                title="My Documents"
                icon={FolderOpen}
                collapsible
                isExpanded={isDocsExpanded}
                onToggle={() => setIsDocsExpanded(!isDocsExpanded)}
              >
                {mockDocuments.length > 0 ? (
                  <div className="space-y-2">
                    {mockDocuments.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-2 bg-white/80 rounded-xl border border-orange-200">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="w-4 h-4 text-orange-600 shrink-0" />
                          <span className="text-sm text-gray-700 truncate">{doc.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500 hover:text-orange-600">
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500 hover:text-orange-600">
                            <Download className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500 hover:text-red-500">
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-orange-700/70 text-center py-2">No documents uploaded yet</p>
                )}
                <p className="text-xs text-orange-700/70 mt-2">
                  Documents are also visible on your Target Program page.
                </p>
              </GradientCard>

              {/* Contact Information - Condensed with Instagram icon in header */}
              <HoverCard>
                <SectionHeader
                  icon={Mail}
                  rightElement={
                    school.instagramHandle && (
                      <a
                        href={`https://instagram.com/${school.instagramHandle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-pink-500 transition-colors"
                        title="Follow on Instagram"
                      >
                        <Instagram className="w-5 h-5" />
                      </a>
                    )
                  }
                >
                  Contact Information
                </SectionHeader>
                <div className="mt-3 space-y-1 text-sm">
                  {school.contactName && (
                    <p className="font-medium">{school.contactName}</p>
                  )}
                  {school.contactTitle && (
                    <p className="text-gray-600 text-xs">{school.contactTitle}</p>
                  )}
                  {school.contactEmail && (
                    <a href={`mailto:${school.contactEmail}`} className="text-orange-600 hover:text-orange-800 hover:underline block">
                      {school.contactEmail}
                    </a>
                  )}
                  {school.contactPhone && (
                    <p className="text-gray-600">{school.contactPhone}</p>
                  )}
                </div>
              </HoverCard>

              {/* Upcoming Events */}
              <HoverCard>
                <SectionHeader icon={Calendar}>Upcoming Events</SectionHeader>
                <div className="mt-4">
                  {schoolEvents.length > 0 ? (
                    <div className="space-y-3">
                      {schoolEvents.map((event) => (
                        <div key={event.id} className="p-2 bg-gray-50 rounded-xl">
                          <p className="text-sm font-medium">{event.title}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(event.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                            {event.isVirtual && ' • Virtual'}
                          </p>
                        </div>
                      ))}
                      <Link
                        to={`/events?school=${school.id}`}
                        className="text-sm text-orange-600 hover:text-orange-800 font-medium block"
                      >
                        View all events →
                      </Link>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-2">Check back soon</p>
                  )}
                </div>
              </HoverCard>

              {/* Need Prerequisites? - Regular card style with purple sparkle */}
              {matchingCourses.length > 0 && (
                <HoverCard>
                  <SectionHeader icon={BookOpen}>
                    <span className="flex items-center gap-2">
                      Need Prerequisites?
                      <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                    </span>
                  </SectionHeader>
                  <div className="mt-4">
                    <div className="space-y-2">
                      {matchingCourses.map((course) => (
                        <Link
                          key={course.id}
                          to={`/prerequisites/${course.id}`}
                          className="block p-2 bg-gray-50 rounded-xl hover:bg-orange-50 border border-gray-100 hover:border-orange-200 transition-colors"
                        >
                          <p className="text-sm font-medium text-gray-900">{course.courseName}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {getSubjectLabel(course.subject)}
                            </Badge>
                            <span className="text-xs text-gray-500 flex items-center gap-0.5">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              {course.averageRecommend.toFixed(1)}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <Link to="/prerequisites">
                      <Button variant="outline" size="sm" className="w-full mt-3">
                        Browse All Prerequisites
                      </Button>
                    </Link>
                  </div>
                </HoverCard>
              )}

              {/* Report Error - Centered */}
              <div className="flex justify-center">
                <ReportRequirementError
                  programId={school.id}
                  programName={school.name}
                  schoolName={school.name}
                  triggerLabel="Something not right?"
                />
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>

      {/* New Topic Modal */}
      <NewTopicModal
        open={newTopicSheetOpen}
        onOpenChange={setNewTopicSheetOpen}
        forumName={school.name}
        onSubmit={handleCreateTopic}
      />
    </div>
  );
}

export default SchoolProfilePage;
