/**
 * SchoolHeader Component
 *
 * Hero section for school profile page.
 * Displays school name, location, and primary actions.
 * Website link is an icon next to the school name.
 */

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Heart,
  Star,
  ExternalLink,
  MapPin,
  GraduationCap,
  Share2,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ReportRequirementError } from '@/components/features/programs/ReportRequirementError';

export function SchoolHeader({
  school,
  onSave,
  onUnsave,
  onMakeTarget,
  onRemoveTarget,
}) {
  if (!school) return null;

  const {
    name,
    city,
    state,
    programType,
    degree,
    isSaved,
    isTarget,
    websiteUrl,
  } = school;

  const handleSaveClick = () => {
    if (isSaved) {
      onUnsave?.(school.id);
    } else {
      onSave?.(school.id);
    }
  };

  const handleTargetClick = () => {
    if (isTarget) {
      onRemoveTarget?.(school.id);
    } else {
      onMakeTarget?.(school.id);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: name,
          text: `Check out ${name} CRNA Program`,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="border-b border-gray-100/50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        {/* Back Navigation */}
        <Link
          to="/schools"
          className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to School Search
        </Link>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          {/* Left: School Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {name}
              </h1>
              {/* Website icon next to name */}
              {websiteUrl && (
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-orange-600 transition-colors"
                  title="Visit program website"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-2 text-gray-600">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {city}, {state}
              </span>
              <span className="text-gray-300">•</span>
              <Badge variant="outline" className="text-xs">
                <GraduationCap className="w-3 h-3 mr-1" />
                {degree?.toUpperCase() || 'DNP'}
              </Badge>
              <Badge variant="outline" className="text-xs capitalize">
                {programType?.replace('_', '-') || 'Front-Loaded'}
              </Badge>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Save Button - On brand gradient when saved */}
            <Button
              variant="outline"
              onClick={handleSaveClick}
              className={cn(
                isSaved && "bg-linear-to-r from-[#F1EAB9] via-[#FFD6B8] to-[#FF8C8C] text-orange-900 border-none hover:from-[#E8E0A8] hover:via-[#FFCAA8] hover:to-[#FF7B7B]"
              )}
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Saved
                </>
              ) : (
                <>
                  <Heart className="w-4 h-4 mr-2" />
                  Save
                </>
              )}
            </Button>

            {/* Target Button - Only show if saved */}
            {isSaved && (
              <Button
                variant="outline"
                onClick={handleTargetClick}
                className={cn(
                  isTarget && "bg-linear-to-r from-[#FFD6B8] via-[#FE90AF] to-[#FFB088] text-orange-900 border-none hover:from-[#FFCAA8] hover:via-[#FE80A0] hover:to-[#FFA078]"
                )}
              >
                <Star className={cn("w-4 h-4 mr-2", isTarget && "fill-current")} />
                {isTarget ? 'Target' : 'Make Target'}
              </Button>
            )}

            {/* Share Button */}
            <Button variant="outline" size="icon" onClick={handleShare}>
              <Share2 className="w-4 h-4" />
            </Button>

            {/* Report Error */}
            <ReportRequirementError
              triggerLabel="Something not right?"
              schoolName={name}
            />
          </div>
        </div>

        {/* Target School Banner */}
        {isTarget && (
          <div className="mt-4 p-3 rounded-xl bg-white/60 backdrop-blur-md border border-white/40 shadow-sm flex items-center gap-2">
            <Star className="w-5 h-5 text-orange-500 fill-orange-500" />
            <span className="text-sm font-medium text-gray-800">
              This is one of your target schools. Track your progress in My Programs.
            </span>
            <Link
              to="/my-programs"
              className="ml-auto text-sm text-orange-600 hover:text-orange-800 font-medium"
            >
              View Progress →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default SchoolHeader;
