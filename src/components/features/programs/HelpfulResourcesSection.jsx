/**
 * HelpfulResourcesSection - Personalized resources filtered by checklist
 *
 * Features:
 * - Grid of LearnDash lesson cards (videos, guides)
 * - Filtered based on incomplete checklist items
 * - Pagination
 * - "Recommended for you" filter dropdown
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PlayCircle, BookOpen, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock resources data - would come from LearnDash API
// TODO: Replace with API call
const MOCK_RESOURCES = [
  { id: 'r1', title: 'Most Common Essay Prompts (Replay Sachi)', type: 'video', thumbnail: null, taxonomies: ['PERSONAL STATEMENT'] },
  { id: 'r2', title: 'Essay Writing Tips w/ CRNA School Faculty', type: 'video', thumbnail: null, taxonomies: ['PERSONAL STATEMENT'] },
  { id: 'r3', title: 'Essay Writing Tips w/ Dr. Cady', type: 'video', thumbnail: null, taxonomies: ['PERSONAL STATEMENT'] },
  { id: 'r4', title: 'CRNA School Essay Basics', type: 'video', thumbnail: null, taxonomies: ['PERSONAL STATEMENT'] },
  { id: 'r5', title: 'References Basics', type: 'video', thumbnail: null, taxonomies: ['LETTERS OF RECOMMENDATION'] },
  { id: 'r6', title: 'Prerequisite Live Call Q+A Replay', type: 'video', thumbnail: null, taxonomies: ['PREREQUISITES'] },
  { id: 'r7', title: 'Retaking Science Classes', type: 'video', thumbnail: null, taxonomies: ['PREREQUISITES', 'GPA'] },
  { id: 'r8', title: 'Types of GPA Calculation', type: 'video', thumbnail: null, taxonomies: ['GPA'] },
  { id: 'r9', title: 'Anesthesia-Related Experiences + GRE', type: 'video', thumbnail: null, taxonomies: ['GRE', 'SHADOWING'] },
  { id: 'r10', title: 'How to Prepare for the GRE', type: 'video', thumbnail: null, taxonomies: ['GRE'] },
  { id: 'r11', title: 'GRE Study Schedule', type: 'article', thumbnail: null, taxonomies: ['GRE'] },
  { id: 'r12', title: 'CCRN Certification Guide', type: 'article', thumbnail: null, taxonomies: ['CERTIFICATIONS'] },
  { id: 'r13', title: 'Building Your Resume', type: 'video', thumbnail: null, taxonomies: ['RESUME'] },
  { id: 'r14', title: 'Resume Templates', type: 'article', thumbnail: null, taxonomies: ['RESUME'] },
  { id: 'r15', title: 'Interview Prep Basics', type: 'video', thumbnail: null, taxonomies: ['INTERVIEWING'] },
  { id: 'r16', title: 'Critical Care Experience Guide', type: 'article', thumbnail: null, taxonomies: ['CRITICAL CARE EXPERIENCE'] },
  { id: 'r17', title: 'Networking with CRNAs', type: 'video', thumbnail: null, taxonomies: ['NETWORKING'] },
  { id: 'r18', title: 'AANA Meeting Guide', type: 'article', thumbnail: null, taxonomies: ['AANA MEETINGS'] },
];

// Taxonomy mapping from checklist items
const CHECKLIST_TO_TAXONOMY = {
  'Complete the GRE': 'GRE',
  'Send GRE Scores': 'GRE',
  'Complete CCRN': 'CERTIFICATIONS',
  'Complete Resume': 'RESUME',
  'Complete Personal Statement': 'PERSONAL STATEMENT',
  'Complete Letters of Recommendation': 'LETTERS OF RECOMMENDATION',
};

const ITEMS_PER_PAGE = 6;

/**
 * Resource Card Component
 */
function ResourceCard({ resource }) {
  const isVideo = resource.type === 'video';

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gray-100">
        {resource.thumbnail ? (
          <img
            src={resource.thumbnail}
            alt={resource.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            {isVideo ? (
              <PlayCircle className="w-12 h-12 text-gray-400 group-hover:text-primary transition-colors" />
            ) : (
              <BookOpen className="w-10 h-10 text-gray-400" />
            )}
          </div>
        )}

        {/* Video Play Overlay */}
        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center">
              <PlayCircle className="w-8 h-8 text-primary" />
            </div>
          </div>
        )}
      </div>

      {/* Title */}
      <CardContent className="p-3">
        <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
          {resource.title}
        </h4>
      </CardContent>
    </Card>
  );
}

export function HelpfulResourcesSection({ checklist = [] }) {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('recommended');

  // Calculate excluded taxonomies based on completed checklist items
  const excludedTaxonomies = useMemo(() => {
    const excluded = new Set();
    checklist.forEach(item => {
      if (item.completed) {
        const taxonomy = CHECKLIST_TO_TAXONOMY[item.label];
        if (taxonomy) {
          excluded.add(taxonomy);
        }
      }
    });
    return excluded;
  }, [checklist]);

  // Filter resources
  const filteredResources = useMemo(() => {
    let resources = MOCK_RESOURCES;

    // Filter based on checklist completion (exclude completed topics)
    if (filter === 'recommended') {
      resources = resources.filter(resource =>
        !resource.taxonomies.some(tax => excludedTaxonomies.has(tax))
      );
    }

    return resources;
  }, [filter, excludedTaxonomies]);

  // Pagination
  const totalPages = Math.ceil(filteredResources.length / ITEMS_PER_PAGE);
  const paginatedResources = filteredResources.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  // Reset page when filter changes
  const handleFilterChange = (value) => {
    setFilter(value);
    setPage(1);
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Helpful Resources
            <span className="text-sm font-normal text-gray-500">
              ({filteredResources.length})
            </span>
          </CardTitle>

          <Select value={filter} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recommended">Recommended for you</SelectItem>
              <SelectItem value="all">All Resources</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filter === 'recommended' && excludedTaxonomies.size > 0 && (
          <p className="text-xs text-gray-500 mt-2">
            Showing resources for your incomplete checklist items.
            Completed topics are hidden.
          </p>
        )}
      </CardHeader>

      <CardContent>
        {paginatedResources.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              {filter === 'recommended'
                ? "Great job! You've completed all the related topics."
                : 'No resources available.'}
            </p>
            {filter === 'recommended' && (
              <Button
                variant="link"
                className="mt-2"
                onClick={() => setFilter('all')}
              >
                View all resources
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Resource Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {paginatedResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 mt-6">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="min-h-[44px] min-w-[44px]"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={cn(
                        "min-w-[44px] min-h-[44px] rounded text-sm font-medium transition-colors flex items-center justify-center",
                        page === p
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-gray-100"
                      )}
                      aria-label={`Page ${p}`}
                      aria-current={page === p ? 'page' : undefined}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="min-h-[44px] min-w-[44px]"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
