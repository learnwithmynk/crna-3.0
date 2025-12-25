/**
 * ForumFilterPills - Horizontal scrollable forum filter pills
 *
 * Skool-inspired filter UI for browsing community topics by forum.
 * Pills: All, General, Intro, Programs, Shadowing, Interview Prep, More...
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ChevronRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FORUM_SLUGS } from '@/hooks/useRecentTopics';

// Main pills shown in the row
const MAIN_FORUMS = [
  { slug: null, label: 'All' },
  { slug: FORUM_SLUGS.GENERAL, label: 'General' },
  { slug: FORUM_SLUGS.INTRODUCTIONS, label: 'Intro' },
  { slug: FORUM_SLUGS.PROGRAMS, label: 'Programs' },
  { slug: FORUM_SLUGS.SHADOWING, label: 'Shadowing' },
  { slug: FORUM_SLUGS.INTERVIEW_PREP, label: 'Interview Prep' },
];

// Overflow forums shown in "More..." dropdown
const MORE_FORUMS = [
  { slug: FORUM_SLUGS.PREREQUISITES, label: 'Prerequisites' },
  { slug: FORUM_SLUGS.STUDY_GROUPS, label: 'Study Groups' },
  { slug: FORUM_SLUGS.APPLICATION_JOURNEY, label: 'Application Journey' },
  { slug: FORUM_SLUGS.CERTIFICATIONS, label: 'Certifications' },
];

export function ForumFilterPills({ selectedSlug, onSelect, className }) {
  const [moreOpen, setMoreOpen] = useState(false);

  // Check if selected slug is in the "More" dropdown
  const isMoreSelected = MORE_FORUMS.some((f) => f.slug === selectedSlug);
  const selectedMoreLabel = MORE_FORUMS.find((f) => f.slug === selectedSlug)?.label;

  return (
    <div
      className={cn(
        'flex items-center gap-6 overflow-x-auto scrollbar-hide',
        className
      )}
    >
      {/* Main forum pills */}
      {MAIN_FORUMS.map((forum) => (
        <button
          key={forum.slug ?? 'all'}
          className={cn(
            'whitespace-nowrap shrink-0 text-xs font-medium uppercase tracking-widest transition-colors',
            selectedSlug === forum.slug
              ? 'bg-amber-100 text-amber-800 rounded-full h-9 px-5'
              : 'text-gray-400 hover:text-gray-600 px-2'
          )}
          onClick={() => onSelect(forum.slug)}
        >
          {forum.label}
        </button>
      ))}

      {/* More dropdown */}
      <Popover open={moreOpen} onOpenChange={setMoreOpen}>
        <PopoverTrigger asChild>
          <button
            className={cn(
              'whitespace-nowrap shrink-0 text-xs font-medium uppercase tracking-widest transition-colors flex items-center gap-1',
              isMoreSelected
                ? 'bg-amber-100 text-amber-800 rounded-full h-9 px-5'
                : 'text-gray-400 hover:text-gray-600 px-2'
            )}
          >
            {isMoreSelected ? selectedMoreLabel : 'More'}
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-48 p-1">
          {MORE_FORUMS.map((forum) => (
            <button
              key={forum.slug}
              className={cn(
                'flex items-center justify-between w-full px-3 py-2 text-sm rounded-lg',
                'hover:bg-muted transition-colors text-left',
                selectedSlug === forum.slug && 'bg-muted'
              )}
              onClick={() => {
                onSelect(forum.slug);
                setMoreOpen(false);
              }}
            >
              {forum.label}
              {selectedSlug === forum.slug && (
                <Check className="w-4 h-4 text-primary" />
              )}
            </button>
          ))}
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default ForumFilterPills;
