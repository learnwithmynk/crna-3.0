/**
 * Hook to fetch recent forum topics across all forums
 *
 * Fetches from Supabase topics table with forum name, ordered by created_at DESC.
 * Falls back to mock data when Supabase is not configured.
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// Forum slug constants for filtering
export const FORUM_SLUGS = {
  GENERAL: 'general-discussion',
  INTRODUCTIONS: 'introductions',
  PROGRAMS: 'crna-programs',
  SHADOWING: 'shadowing',
  INTERVIEW_PREP: 'interview-prep',
  PREREQUISITES: 'prerequisites',
  STUDY_GROUPS: 'study-groups',
  APPLICATION_JOURNEY: 'application-journey',
  CERTIFICATIONS: 'certifications',
  CRITICAL_CARE: 'critical-care-experience',
};

// TODO: Replace with API call - Extended mock data for pagination
// Includes author object with avatar, name, level for Skool-style feed
const mockRecentTopics = [
  {
    id: "topic_001",
    title: "Georgetown vs Cedar Crest - Help Me Decide!",
    preview: "I've been accepted to both programs and can't decide. Georgetown is closer to family but Cedar Crest has better clinical sites...",
    forumName: "Programs",
    author: {
      name: "Sarah M.",
      avatar: "https://ui-avatars.com/api/?name=Sarah+M&background=e5e7eb&color=6b7280",
      level: 4,
    },
    createdAt: "2025-12-13T10:30:00Z",
    replyCount: 12,
    likeCount: 8,
  },
  {
    id: "topic_002",
    title: "CCRN Study Tips - What Worked for You?",
    preview: "Taking my CCRN in 3 weeks and feeling nervous. What resources did you all use? I've been doing Barron's practice tests...",
    forumName: "Certifications",
    author: {
      name: "Mike R.",
      avatar: "https://ui-avatars.com/api/?name=Mike+R&background=e5e7eb&color=6b7280",
      level: 6,
    },
    createdAt: "2025-12-13T08:15:00Z",
    replyCount: 8,
    likeCount: 15,
  },
  {
    id: "topic_003",
    title: "Shadow Day Etiquette - First Timer!",
    preview: "Got my first shadow day scheduled! What should I wear? What questions should I ask? Any tips appreciated!",
    forumName: "Shadowing",
    author: {
      name: "Jessica L.",
      avatar: "https://ui-avatars.com/api/?name=Jessica+L&background=e5e7eb&color=6b7280",
      level: 2,
    },
    createdAt: "2025-12-12T15:45:00Z",
    replyCount: 15,
    likeCount: 22,
  },
  {
    id: "topic_004",
    title: "Just Got Accepted to Rush!",
    preview: "After 2 application cycles, I finally got in! Don't give up everyone - it's possible! Happy to answer questions about my journey.",
    forumName: "General",
    author: {
      name: "Alex T.",
      avatar: "https://ui-avatars.com/api/?name=Alex+T&background=e5e7eb&color=6b7280",
      level: 5,
    },
    createdAt: "2025-12-12T09:20:00Z",
    replyCount: 23,
    likeCount: 47,
  },
  {
    id: "topic_005",
    title: "GRE vs No GRE Programs",
    preview: "Making my program list and wondering if I should even bother with GRE-required programs. Is it worth the extra stress?",
    forumName: "Programs",
    author: {
      name: "Chris B.",
      avatar: "https://ui-avatars.com/api/?name=Chris+B&background=e5e7eb&color=6b7280",
      level: 3,
    },
    createdAt: "2025-12-11T14:00:00Z",
    replyCount: 6,
    likeCount: 4,
  },
  {
    id: "topic_006",
    title: "Interview Prep Thread - Share Your Experience",
    preview: "Let's create a master thread of interview questions! I'll start: What made you want to become a CRNA?",
    forumName: "Interview Prep",
    author: {
      name: "Nicole P.",
      avatar: "https://ui-avatars.com/api/?name=Nicole+P&background=e5e7eb&color=6b7280",
      level: 7,
    },
    createdAt: "2025-12-11T11:00:00Z",
    replyCount: 18,
    likeCount: 31,
  },
  {
    id: "topic_007",
    title: "Best ICU Specialties for CRNA Applicants",
    preview: "Currently in MICU but considering a transfer. Does CVICU really give you an edge in admissions?",
    forumName: "General",
    author: {
      name: "David K.",
      avatar: "https://ui-avatars.com/api/?name=David+K&background=e5e7eb&color=6b7280",
      level: 4,
    },
    createdAt: "2025-12-10T16:30:00Z",
    replyCount: 9,
    likeCount: 12,
  },
  {
    id: "topic_008",
    title: "How Many Programs Should I Apply To?",
    preview: "Budget is tight but I want to maximize my chances. Is 5 programs enough or should I aim for 10+?",
    forumName: "Programs",
    author: {
      name: "Emily W.",
      avatar: "https://ui-avatars.com/api/?name=Emily+W&background=e5e7eb&color=6b7280",
      level: 2,
    },
    createdAt: "2025-12-10T09:45:00Z",
    replyCount: 14,
    likeCount: 9,
  },
  {
    id: "topic_009",
    title: "Essay Review Request - Personal Statement",
    preview: "Would anyone be willing to review my personal statement? I've been through 5 drafts and still not happy with it.",
    forumName: "General",
    author: {
      name: "Rachel H.",
      avatar: "https://ui-avatars.com/api/?name=Rachel+H&background=e5e7eb&color=6b7280",
      level: 3,
    },
    createdAt: "2025-12-09T14:20:00Z",
    replyCount: 7,
    likeCount: 5,
  },
  {
    id: "topic_010",
    title: "DNP vs MSN Programs - Which Path?",
    preview: "With the push for doctoral education, is it worth the extra time/money to go DNP? What are the actual career differences?",
    forumName: "Programs",
    author: {
      name: "James C.",
      avatar: "https://ui-avatars.com/api/?name=James+C&background=e5e7eb&color=6b7280",
      level: 5,
    },
    createdAt: "2025-12-09T10:00:00Z",
    replyCount: 21,
    likeCount: 18,
  },
  {
    id: "topic_011",
    title: "Relocation for CRNA School - Tips?",
    preview: "Moving across the country for school next fall. Any advice on finding housing, making friends, etc?",
    forumName: "General",
    author: {
      name: "Olivia S.",
      avatar: "https://ui-avatars.com/api/?name=Olivia+S&background=e5e7eb&color=6b7280",
      level: 4,
    },
    createdAt: "2025-12-08T15:30:00Z",
    replyCount: 11,
    likeCount: 14,
  },
  {
    id: "topic_012",
    title: "Part-time vs Full-time Programs",
    preview: "Has anyone done a part-time program while working? Is it actually feasible or am I setting myself up for burnout?",
    forumName: "Programs",
    author: {
      name: "Brandon L.",
      avatar: "https://ui-avatars.com/api/?name=Brandon+L&background=e5e7eb&color=6b7280",
      level: 3,
    },
    createdAt: "2025-12-08T08:15:00Z",
    replyCount: 16,
    likeCount: 11,
  },
];

// Map forum slugs to display names for filtering
const FORUM_NAME_MAP = {
  'general-discussion': 'General Discussion',
  'introductions': 'Introductions',
  'crna-programs': 'Program Comparisons',
  'shadowing': 'Shadowing',
  'interview-prep': 'Interviews',
  'prerequisites': 'Prerequisites',
  'study-groups': 'Study Groups',
  'application-journey': 'Application Journey',
  'certifications': 'Certifications',
  'critical-care-experience': 'Clinical Experience',
};

/**
 * Fetch recent forum topics with pagination and filtering support
 * @param {number} initialLimit - Initial number of topics to fetch (default: 5)
 * @param {string|null} forumSlug - Forum slug to filter by (null = all forums)
 * @returns {Object} { topics, loading, loadingMore, error, hasMore, loadMore, refetch }
 */
export function useRecentTopics(initialLimit = 5, forumSlug = null) {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchTopics = useCallback(async (isLoadMore = false, currentOffsetOverride = null) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const currentOffset = currentOffsetOverride !== null ? currentOffsetOverride : (isLoadMore ? offset : 0);

      // If Supabase is not configured, use mock data
      if (!isSupabaseConfigured()) {
        // Filter by forum if slug provided
        let filteredTopics = mockRecentTopics;
        if (forumSlug) {
          const forumName = FORUM_NAME_MAP[forumSlug];
          if (forumName) {
            filteredTopics = mockRecentTopics.filter(t =>
              t.forumName === forumName ||
              t.forumName.toLowerCase().includes(forumSlug.split('-')[0])
            );
          }
        }

        const newTopics = filteredTopics.slice(currentOffset, currentOffset + initialLimit);

        if (isLoadMore) {
          setTopics(prev => [...prev, ...newTopics]);
        } else {
          setTopics(newTopics);
        }

        setOffset(currentOffset + initialLimit);
        setHasMore(currentOffset + initialLimit < filteredTopics.length);
        return;
      }

      // Fetch from Supabase - simplified query without complex joins
      // The profiles/replies/reactions relationships may not be set up yet
      let query = supabase
        .from('topics')
        .select(`
          id,
          title,
          content,
          created_at,
          view_count,
          author_id,
          forum_id
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .range(currentOffset, currentOffset + initialLimit - 1);

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      // If no topics, use mock data
      if (!data || data.length === 0) {
        const newTopics = mockRecentTopics.slice(currentOffset, currentOffset + initialLimit);
        if (isLoadMore) {
          setTopics(prev => [...prev, ...newTopics]);
        } else {
          setTopics(newTopics);
        }
        setOffset(currentOffset + initialLimit);
        setHasMore(currentOffset + initialLimit < mockRecentTopics.length);
        return;
      }

      // Transform Supabase data to match expected format
      // Note: Without joins, we use placeholder values for author/forum
      const transformedTopics = (data || []).map(topic => ({
        id: topic.id,
        title: topic.title,
        preview: topic.content ? topic.content.substring(0, 150).replace(/<[^>]*>/g, '') + '...' : '',
        forumName: 'General', // Would need separate query to get forum name
        forumSlug: null,
        author: {
          name: 'Member',
          avatar: `https://ui-avatars.com/api/?name=M&background=e5e7eb&color=6b7280`,
          level: 1,
        },
        createdAt: topic.created_at,
        replyCount: 0,
        likeCount: 0,
      }));

      if (isLoadMore) {
        setTopics(prev => [...prev, ...transformedTopics]);
      } else {
        setTopics(transformedTopics);
      }

      setOffset(currentOffset + initialLimit);
      setHasMore(transformedTopics.length === initialLimit);
    } catch (err) {
      console.error('Error fetching recent topics:', err);
      setError(err.message);
      // Fall back to mock data on error in development
      if (import.meta.env.DEV) {
        const newTopics = mockRecentTopics.slice(0, initialLimit);
        setTopics(newTopics);
        setHasMore(mockRecentTopics.length > initialLimit);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [initialLimit, forumSlug]); // Removed offset to prevent infinite loop

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      fetchTopics(true, offset);
    }
  }, [fetchTopics, loadingMore, hasMore, offset]);

  // Refetch when forum filter changes - only run once on mount and when deps change
  useEffect(() => {
    setOffset(0);
    fetchTopics(false, 0);
  }, [initialLimit, forumSlug]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    topics,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    refetch: () => fetchTopics(false),
  };
}
