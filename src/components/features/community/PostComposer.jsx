/**
 * PostComposer - Skool-inspired inline post composer
 *
 * Features:
 * - Collapsed: Avatar + "Write something" placeholder
 * - Expanded: Full composer with Title, Body, and category selector
 * - Category dropdown at bottom (like Skool)
 * - When "Programs" selected, shows secondary program dropdown
 * - Programs dropdown includes "General Q&A" option first
 *
 * Used in: CommunityActivityWidget (dashboard)
 */

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Link2, Smile } from 'lucide-react';
import { mockForums } from '@/data/mockForums';
import { schools } from '@/data/supabase/schools';
import { cn } from '@/lib/utils';

// Toolbar buttons for rich content (hyperlink and emoji only)
const TOOLBAR_ITEMS = [
  { id: 'link', icon: Link2, label: 'Add link', action: 'link' },
  { id: 'emoji', icon: Smile, label: 'Add emoji', action: 'emoji' },
];

// Forums available for posting (exclude CRNA Programs parent - user picks subforum)
const POSTABLE_FORUMS = mockForums
  .filter(f => f.id !== 2) // Exclude "CRNA Programs" parent
  .map(f => ({
    id: f.id,
    slug: f.slug || f.title.rendered.toLowerCase().replace(/\s+/g, '-'),
    name: f.title.rendered,
  }));

// Add Programs as a special option that triggers subforum picker
const CATEGORY_OPTIONS = [
  ...POSTABLE_FORUMS,
  { id: 'programs', slug: 'programs', name: 'Programs', isSpecial: true },
];

// Sort schools alphabetically for the dropdown
const sortedSchools = [...schools].sort((a, b) => a.name.localeCompare(b.name));

export function PostComposer({
  user = { name: 'You', avatar: null },
  onPost,
  className,
}) {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const containerRef = useRef(null);
  const titleRef = useRef(null);

  // Check if Programs is selected (shows secondary dropdown)
  const showProgramPicker = selectedCategory === 'programs';

  // Get initials for avatar fallback
  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Get selected category name for display
  const selectedCategoryName = selectedCategory
    ? CATEGORY_OPTIONS.find(c => c.id.toString() === selectedCategory)?.name
    : null;

  // Handle expand
  const handleExpand = () => {
    setIsExpanded(true);
    // Focus title after expansion
    setTimeout(() => titleRef.current?.focus(), 100);
  };

  // Handle collapse (click outside)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        // Only collapse if empty
        if (!title && !body && !selectedCategory) {
          setIsExpanded(false);
        }
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isExpanded, title, body, selectedCategory]);

  // Handle cancel
  const handleCancel = () => {
    setIsExpanded(false);
    setTitle('');
    setBody('');
    setSelectedCategory(null);
    setSelectedProgram(null);
  };

  // Handle post
  const handlePost = () => {
    if (!title.trim() || !selectedCategory) return;

    // For now, navigate to the forum with the content as query params
    // In production, this would create the post via API
    const forumSlug = selectedCategory === 'programs' && selectedProgram
      ? (selectedProgram === 'general-qa' ? 'crna-programs' : `programs/${selectedProgram}`)
      : CATEGORY_OPTIONS.find(c => c.id.toString() === selectedCategory)?.slug;

    navigate(`/community/forums/${forumSlug}?new=true&title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`);

    // Reset
    handleCancel();
  };

  // Handle category selection
  const handleCategoryChange = (value) => {
    setSelectedCategory(value === 'none' ? null : value);
    setSelectedProgram(null);
  };

  // Can post?
  const canPost = title.trim() && selectedCategory && (!showProgramPicker || selectedProgram);

  return (
    <div
      ref={containerRef}
      className={cn(
        'transition-all duration-200',
        isExpanded ? 'bg-gray-50 rounded-2xl p-4' : '',
        className
      )}
    >
      {!isExpanded ? (
        /* Collapsed state - clean, very subtle border */
        <div className="flex items-center gap-4 cursor-pointer" onClick={handleExpand}>
          <Avatar className="w-12 h-12 shrink-0">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-amber-100 text-amber-700 text-base font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 px-5 py-3.5 rounded-full bg-gray-50 text-gray-400 text-sm">
            Write something...
          </div>
        </div>
      ) : (
        /* Expanded state */
        <div className="space-y-3">
          {/* Header: Avatar + posting in */}
          <div className="flex items-center gap-2 text-sm">
            <Avatar className="w-8 h-8 shrink-0">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-primary/20 text-gray-700 text-xs font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium text-gray-900">{user.name}</span>
            {selectedCategoryName && (
              <>
                <span className="text-gray-400">posting in</span>
                <span className="font-semibold text-gray-900">{selectedCategoryName}</span>
              </>
            )}
          </div>

          {/* Title input */}
          <input
            ref={titleRef}
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-xl font-medium text-gray-900 placeholder:text-gray-300 border-0 outline-none bg-transparent"
          />

          {/* Body textarea */}
          <textarea
            placeholder="Write something..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            className="w-full text-sm text-gray-700 placeholder:text-gray-400 border-0 outline-none bg-transparent resize-none"
          />

          {/* Bottom toolbar */}
          <div className="flex items-center justify-between pt-3">
            <div className="flex items-center gap-3">
              {/* Rich content toolbar icons */}
              <TooltipProvider delayDuration={300}>
                <div className="flex items-center gap-1">
                  {TOOLBAR_ITEMS.map(item => (
                    <Tooltip key={item.id}>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={() => {
                            // TODO: Implement each action
                            console.log(`${item.action} clicked`);
                          }}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <item.icon className="w-5 h-5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>{item.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </TooltipProvider>

              {/* Spacer */}
              <div className="w-2" />

              {/* Category selector */}
              <Select value={selectedCategory || ''} onValueChange={handleCategoryChange}>
                <SelectTrigger className="h-9 text-sm min-w-[160px] bg-white border-0 shadow-sm">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map(cat => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Program dropdown (appears when Programs is selected) */}
              {showProgramPicker && (
                <Select value={selectedProgram || ''} onValueChange={setSelectedProgram}>
                  <SelectTrigger className="h-9 text-sm min-w-[200px] bg-white border-0 shadow-sm">
                    <SelectValue placeholder="Select program" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    <SelectGroup>
                      <SelectItem value="general-qa" className="font-medium">
                        General Q&A
                      </SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel className="text-xs text-gray-500">Programs (A-Z)</SelectLabel>
                      {sortedSchools.map(school => (
                        <SelectItem key={school.id} value={school.id.toString()}>
                          {school.name}
                          {school.state && (
                            <span className="text-gray-400 ml-1">({school.state})</span>
                          )}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleCancel}>
                CANCEL
              </Button>
              <Button
                size="sm"
                disabled={!canPost}
                onClick={handlePost}
                className="bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:opacity-50"
              >
                POST
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostComposer;
