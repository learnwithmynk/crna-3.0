/**
 * CourseCard Component
 *
 * Displays a prerequisite course card with ratings, tags, and actions.
 * Used in the Prerequisite Library grid view.
 */

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Heart,
  ExternalLink,
  BookOpen,
  MessageSquare,
  Monitor,
  MapPin,
  FlaskConical,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getSubjectLabel } from '@/data/mockPrerequisites';

// Color coding for ratings based on score
const getRatingColor = (score) => {
  if (score >= 4.5) return { bg: 'bg-green-100', text: 'text-green-700' };
  if (score >= 4.0) return { bg: 'bg-lime-100', text: 'text-lime-700' };
  if (score >= 3.0) return { bg: 'bg-yellow-100', text: 'text-yellow-700' };
  if (score >= 2.0) return { bg: 'bg-orange-100', text: 'text-orange-700' };
  return { bg: 'bg-red-100', text: 'text-red-700' };
};

export function CourseCard({
  course,
  onSave,
  onUnsave,
  onViewDetails,
  onWriteReview,
}) {
  const {
    id,
    schoolName,
    courseName,
    courseUrl,
    subject,
    level,
    credits,
    hasLab,
    format,
    selfPaced,
    costRange,
    courseLengthWeeks,
    averageRecommend,
    averageEase,
    reviewCount,
    isSaved,
  } = course;

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

  // Handle external link click
  const handleExternalClick = (e) => {
    e.stopPropagation();
  };

  // Handle title click
  const handleTitleClick = (e) => {
    e.preventDefault();
    onViewDetails?.(course);
  };

  // Format display
  const getFormatDisplay = () => {
    if (format === 'online_async' || format === 'online_sync') {
      return 'Online';
    }
    if (format === 'in_person') {
      return 'In-Person';
    }
    return 'Hybrid';
  };

  const getFormatIcon = () => {
    if (format === 'in_person') {
      return <MapPin className="w-3 h-3" />;
    }
    return <Monitor className="w-3 h-3" />;
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-0 hover:scale-[1.02] bg-white/80 backdrop-blur-sm rounded-4xl shadow-sm">
      <CardContent className="p-6">
        {/* Header: School name + Save button */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <span className="text-[11px] text-gray-500 uppercase tracking-wider">
            {schoolName}
          </span>
          <button
            onClick={handleSaveClick}
            className={cn(
              "p-2 rounded-2xl shadow-sm transition-all duration-200 shrink-0",
              isSaved
                ? "bg-linear-to-br from-[#FE90AF]/90 to-[#FFB088]/90 text-white"
                : "bg-white/90 text-gray-400 hover:bg-linear-to-br hover:from-[#FFF5E6] hover:to-[#FFEBE0] hover:text-orange-600"
            )}
            title={isSaved ? "Remove from saved" : "Save course"}
          >
            <Heart className={cn("w-4 h-4", isSaved && "fill-current")} />
          </button>
        </div>

        {/* Course Name - Clickable with inline external link */}
        <button
          onClick={handleTitleClick}
          className="text-left w-full"
        >
          <h3 className="font-semibold text-sm leading-snug line-clamp-2 transition-colors group-hover:bg-linear-to-r group-hover:from-[#F97066] group-hover:via-[#FE90AF] group-hover:to-[#FFB088] group-hover:bg-clip-text group-hover:text-transparent inline">
            {courseName}
          </h3>
          {courseUrl && (
            <a
              href={courseUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleExternalClick}
              className="inline-flex align-middle ml-1 text-gray-400 hover:text-gray-600 transition-colors"
              title="Visit course website"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </button>

        {/* Course Info - price, credits, format, length */}
        <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-[11px] text-gray-500 mt-3">
          <span>{costRange}</span>
          <span className="flex items-center gap-0.5">
            <BookOpen className="w-3 h-3" />
            {credits} cr
          </span>
          <span className="flex items-center gap-0.5">
            {getFormatIcon()}
            {getFormatDisplay()}
          </span>
          {courseLengthWeeks && (
            <span className="flex items-center gap-0.5">
              <Clock className="w-3 h-3" />
              {courseLengthWeeks} wks
            </span>
          )}
        </div>

        {/* Subject & Level Badges */}
        <div className="flex flex-wrap gap-2 mt-4 mb-4">
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-orange-50/50 text-orange-700 border-orange-100/60">
            {getSubjectLabel(subject)}
          </Badge>
          <Badge
            className={cn(
              "text-[10px] px-1.5 py-0",
              level === 'graduate'
                ? "bg-emerald-50/50 text-emerald-700 border border-emerald-100/60"
                : "bg-purple-50/50 text-purple-700 border border-purple-100/60"
            )}
          >
            {level === 'graduate' ? 'Graduate' : 'Undergrad'}
          </Badge>
          {hasLab && (
            <Badge className="text-[10px] px-1.5 py-0 bg-blue-50/50 text-blue-700 border border-blue-100/60">
              <FlaskConical className="w-2.5 h-2.5 mr-0.5" />
              Lab
            </Badge>
          )}
        </div>

        {/* Ratings Section - centered, color-coded */}
        <div className="flex justify-center gap-8 mb-5 py-4 bg-white/60 backdrop-blur-sm rounded-2xl">
          {/* Recommend Score */}
          <div className="flex flex-col items-center">
            {(() => {
              const colors = averageRecommend ? getRatingColor(averageRecommend) : { bg: 'bg-gray-100', text: 'text-gray-600' };
              return (
                <div className={cn(
                  "inline-flex items-center justify-center w-14 h-12 rounded-2xl font-bold text-xl",
                  colors.bg, colors.text
                )}>
                  {averageRecommend?.toFixed(1) || '—'}
                </div>
              );
            })()}
            <span className="text-[9px] text-gray-500 uppercase tracking-widest mt-2">Recommend</span>
          </div>

          {/* Ease Score */}
          <div className="flex flex-col items-center">
            {(() => {
              const colors = averageEase ? getRatingColor(averageEase) : { bg: 'bg-gray-100', text: 'text-gray-600' };
              return (
                <div className={cn(
                  "inline-flex items-center justify-center w-14 h-12 rounded-2xl font-bold text-xl",
                  colors.bg, colors.text
                )}>
                  {averageEase?.toFixed(1) || '—'}
                </div>
              );
            })()}
            <span className="text-[9px] text-gray-500 uppercase tracking-widest mt-2">Ease</span>
          </div>
        </div>

        {/* Actions - Write a Review on left (gradient), View Details on right (outline with colored border) */}
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            className="flex-1 text-xs h-10 rounded-xl bg-linear-to-r from-[#FEF3E2] via-[#FFECD2] to-[#FFE4E1] hover:from-[#FDE8CC] hover:via-[#FFE0C0] hover:to-[#FFD8D4] text-orange-800 border-0 shadow-sm font-medium"
            onClick={() => onWriteReview?.(course)}
          >
            <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
            Write a Review
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs h-10 rounded-xl border-0 bg-white/60 text-gray-600 hover:bg-white/80 hover:text-orange-700 transition-all shadow-sm"
            onClick={() => onViewDetails?.(course)}
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default CourseCard;
