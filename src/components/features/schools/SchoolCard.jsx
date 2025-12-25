/**
 * SchoolCard Component
 *
 * Displays a CRNA program card with school image, key stats, and actions.
 * Used in the School Database grid view.
 */

import { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Heart,
  MapPin,
  GraduationCap,
  Calendar,
  Target,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function SchoolCard({
  school,
  onSave,
  onUnsave,
  compact = false,
}) {
  const {
    id,
    name,
    city,
    state,
    programType,
    degree,
    tuitionInState,
    greRequired,
    applicationDeadline,
    isSaved,
    isTarget,
    imageUrl,
  } = school;

  // Get required prerequisites as list
  const getPrereqs = () => {
    const prereqMap = {
      prereqStatistics: 'Statistics',
      prereqGenChemistry: 'Gen Chem',
      prereqOrganicChemistry: 'Organic Chem',
      prereqBiochemistry: 'Biochem',
      prereqAnatomy: 'Anatomy',
      prereqPhysics: 'Physics',
      prereqPharmacology: 'Pharmacology',
      prereqPhysiology: 'Physiology',
      prereqMicrobiology: 'Microbio',
      prereqResearch: 'Research',
    };
    return Object.entries(prereqMap)
      .filter(([field]) => school[field])
      .map(([, label]) => label);
  };

  // Get GPA types used by this program
  const getGpaTypes = () => {
    const gpaMap = {
      gpaCumulative: 'Cumulative',
      gpaScience: 'Science',
      gpaNursing: 'Nursing',
      gpaLast60: 'Last 60',
      gpaGraduate: 'Graduate',
    };
    return Object.entries(gpaMap)
      .filter(([field]) => school[field])
      .map(([, label]) => label);
  };

  const prereqs = getPrereqs();
  const gpaTypes = getGpaTypes();

  // Tooltip positioning state - calculate best side based on card position
  const [tooltipSide, setTooltipSide] = useState('top');
  const tooltipTriggerRef = useRef(null);

  // Calculate tooltip position when opening
  const handleTooltipOpen = useCallback((open) => {
    if (open && tooltipTriggerRef.current) {
      const rect = tooltipTriggerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      // If the trigger is in the bottom half of the viewport, show tooltip above
      // If in the top half, show below
      const isInBottomHalf = rect.top > viewportHeight / 2;
      setTooltipSide(isInBottomHalf ? 'top' : 'bottom');
    }
  }, []);

  // Format tuition
  const formatTuition = (amount) => {
    if (!amount) return 'N/A';
    return `$${(amount / 1000).toFixed(0)}K`;
  };

  // Format deadline
  const formatDeadline = (date) => {
    if (!date) return null;
    const d = new Date(date);
    const now = new Date();
    const diffDays = Math.ceil((d - now) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return null;
    if (diffDays <= 30) return { text: 'Due Soon', urgent: true };
    if (diffDays <= 90) return { text: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), urgent: false };
    return null;
  };

  const deadline = formatDeadline(applicationDeadline);

  // Placeholder image if none available
  const schoolImage = imageUrl || `https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=200&fit=crop`;

  // Handle save click
  const handleSaveClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSaved) {
      onUnsave?.(id);
    } else {
      onSave?.(id);
    }
  };

  return (
    <Card className={cn(
      "group overflow-hidden hover:shadow-lg transition-all duration-200 border border-gray-200/60 hover:border-orange-200/60 hover:scale-[1.02] bg-white",
      isTarget && "ring-2 ring-[linear-gradient(135deg,#FFD6B8,#FFC0A0,#FFB090)] shadow-[0_0_20px_rgba(255,176,144,0.3)] border-orange-300/60"
    )}>
      <Link to={`/schools/${id}`} className="block">
        {/* School Image */}
        <div className="relative h-24 overflow-hidden">
          <img
            src={schoolImage}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Target indicator in upper right */}
          {isTarget && (
            <div className="absolute top-2 right-2 p-1.5 bg-linear-to-br from-[#FFE4CC] to-[#FFD0B0] rounded-xl shadow-sm">
              <Target className="w-4 h-4 text-orange-600" />
            </div>
          )}
          {/* Save button - subtle in upper left */}
          <button
            onClick={handleSaveClick}
            className={cn(
              "absolute top-2 left-2 p-2 rounded-xl shadow-sm transition-all duration-200",
              isSaved
                ? "bg-linear-to-br from-[#FE90AF]/90 to-[#FFB088]/90 text-white"
                : "bg-white/90 text-gray-500 hover:bg-linear-to-br hover:from-[#FFF5E6] hover:to-[#FFEBE0] hover:text-orange-600"
            )}
          >
            <Heart className={cn("w-4 h-4", isSaved && "fill-current")} />
          </button>
        </div>

        <CardContent className="p-3">
          {/* Header: Name + Location + Deadline */}
          <div className="mb-2">
            <h3 className="font-semibold text-base leading-tight line-clamp-1 group-hover:bg-linear-to-r group-hover:from-[#F97066] group-hover:via-[#FE90AF] group-hover:to-[#FFB088] group-hover:bg-clip-text group-hover:text-transparent transition-colors">
              {name}
            </h3>
            <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{city}, {state}</span>
            </div>
            {applicationDeadline && (
              <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
                <Calendar className="w-3 h-3 shrink-0" />
                <span>
                  Deadline: {new Date(applicationDeadline).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
            )}
          </div>

          {/* Program Type + Degree */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            <Badge variant="outline" className="text-xs border-gray-200/60 bg-gray-50/50">
              <GraduationCap className="w-3 h-3 mr-1" />
              {degree?.toUpperCase() || 'DNP'}
            </Badge>
            <Badge variant="outline" className="text-xs capitalize border-gray-200/60 bg-gray-50/50">
              {programType?.replace('_', '-') || 'Front-Loaded'}
            </Badge>
          </div>

          {/* Quick Facts Section - Two-column layout for GPA/Facts, full-width for Prerequisites */}
          {!compact && (
            <div className="space-y-1.5 mb-2">
              {/* Row 1: GPA Type + Quick Facts side by side */}
              <div className="grid grid-cols-2 gap-2">
                {/* GPA Type */}
                <div>
                  <div className="text-[10px] text-gray-500 mb-0.5">GPA Type</div>
                  {gpaTypes.length > 0 ? (
                    <div className="flex flex-wrap gap-0.5">
                      {gpaTypes.slice(0, 2).map((gpaType) => (
                        <span
                          key={gpaType}
                          className="inline-flex px-1.5 py-0.5 bg-purple-50/50 text-purple-700 text-[10px] rounded-full border border-purple-100/60"
                        >
                          {gpaType}
                        </span>
                      ))}
                      {gpaTypes.length > 2 && (
                        <span className="inline-flex px-1.5 py-0.5 bg-gray-50 text-gray-500 text-[10px] rounded-full border border-gray-200/60">
                          +{gpaTypes.length - 2}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-[10px] text-gray-400">N/A</span>
                  )}
                </div>

                {/* Quick Facts - Tuition & GRE */}
                <div>
                  <div className="text-[10px] text-gray-500 mb-0.5">Quick Facts</div>
                  <div className="flex flex-wrap gap-0.5">
                    <span className="inline-flex px-1.5 py-0.5 bg-orange-50/50 text-gray-700 text-[10px] rounded-full border border-orange-100/60">
                      {formatTuition(tuitionInState)}
                    </span>
                    <span className={cn(
                      "inline-flex px-1.5 py-0.5 text-[10px] rounded-full border",
                      greRequired
                        ? "bg-amber-50/50 text-amber-700 border-amber-100/60"
                        : "bg-emerald-50/50 text-emerald-700 border-emerald-100/60"
                    )}>
                      {greRequired ? 'GRE' : 'No GRE'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Row 2: Prerequisites - full width */}
              <div>
                <div className="text-[10px] text-gray-500 mb-0.5">Prerequisites</div>
                {prereqs.length > 0 ? (
                  <div className="flex flex-wrap gap-0.5">
                    {prereqs.slice(0, 4).map((prereq) => (
                      <span
                        key={prereq}
                        className="inline-flex px-1.5 py-0.5 bg-orange-50/50 text-gray-700 text-[10px] rounded-full border border-orange-100/60"
                      >
                        {prereq}
                      </span>
                    ))}
                    {prereqs.length > 4 && (
                      <TooltipProvider delayDuration={100}>
                        <Tooltip onOpenChange={handleTooltipOpen}>
                          <TooltipTrigger asChild>
                            <span
                              ref={tooltipTriggerRef}
                              className="inline-flex px-1.5 py-0.5 bg-gray-50 text-gray-500 text-[10px] rounded-full border border-gray-200/60 cursor-help hover:bg-gray-100 transition-colors"
                            >
                              +{prereqs.length - 4}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent
                            side={tooltipSide}
                            align="start"
                            sideOffset={5}
                            className="z-9999 max-w-[200px] bg-white shadow-lg border border-gray-200"
                          >
                            <p className="text-xs font-medium text-gray-700 mb-1.5">More Prerequisites:</p>
                            <div className="flex flex-wrap gap-1">
                              {prereqs.slice(4).map((prereq) => (
                                <span
                                  key={prereq}
                                  className="inline-flex px-2 py-0.5 bg-orange-100 text-orange-800 text-xs rounded-full"
                                >
                                  {prereq}
                                </span>
                              ))}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                ) : (
                  <span className="text-[10px] text-gray-400">None listed</span>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Link>
    </Card>
  );
}

export default SchoolCard;
