/**
 * useArchivedForums Hook
 *
 * Manages archived forum content - forums that were preserved when
 * a school was deleted from the database.
 *
 * Database table: archived_forum_content
 * Access: Admin only (RLS enforced)
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// Mock archived forums data for development/fallback
const mockArchivedForums = [
  {
    id: 'arch-1',
    original_forum_id: 'forum-123',
    original_school_id: 9999,
    school_name: 'Example University CRNA Program',
    archived_at: '2024-12-10T14:30:00Z',
    archived_by: null,
    archive_reason: 'school_deleted',
    forum_data: {
      id: 'forum-123',
      title: 'Example University CRNA Program',
      description: 'Discussion forum for Example University CRNA Program',
      slug: 'example-university-crna-program',
      created_at: '2024-01-15T10:00:00Z',
    },
    topics_data: [
      {
        id: 'topic-1',
        title: 'Interview Experience Fall 2024',
        content: '<p>Just had my interview last week. The panel was really friendly...</p>',
        author_id: 'user-1',
        created_at: '2024-11-20T09:00:00Z',
        is_sticky: false,
        view_count: 145,
        replies: [
          {
            id: 'reply-1',
            content: '<p>Thanks for sharing! How long was the interview?</p>',
            author_id: 'user-2',
            created_at: '2024-11-20T10:30:00Z',
            parent_reply_id: null,
          },
          {
            id: 'reply-2',
            content: '<p>About 45 minutes total. They asked a lot about ICU experience.</p>',
            author_id: 'user-1',
            created_at: '2024-11-20T11:00:00Z',
            parent_reply_id: 'reply-1',
          },
        ],
      },
      {
        id: 'topic-2',
        title: 'Prerequisites Question',
        content: '<p>Does anyone know if they accept online chemistry?</p>',
        author_id: 'user-3',
        created_at: '2024-10-05T14:00:00Z',
        is_sticky: false,
        view_count: 89,
        replies: [
          {
            id: 'reply-3',
            content: '<p>Yes, they accept online courses from accredited institutions.</p>',
            author_id: 'user-4',
            created_at: '2024-10-05T16:00:00Z',
            parent_reply_id: null,
          },
        ],
      },
    ],
    topic_count: 2,
    reply_count: 3,
    content_preview: 'Interview Experience Fall 2024 | Prerequisites Question',
  },
];

export function useArchivedForums() {
  const [archivedForums, setArchivedForums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedArchive, setSelectedArchive] = useState(null);

  // Fetch all archived forums
  useEffect(() => {
    async function fetchArchivedForums() {
      // If Supabase is not configured, use mock data
      if (!isSupabaseConfigured()) {
        setArchivedForums(mockArchivedForums);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('archived_forum_content')
          .select('*')
          .order('archived_at', { ascending: false });

        if (error) throw error;

        setArchivedForums(data || []);
      } catch (err) {
        console.error('Error fetching archived forums:', err);
        // Fall back to mock data on error in development
        if (import.meta.env.DEV) {
          setArchivedForums(mockArchivedForums);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchArchivedForums();
  }, []);

  // Get a specific archived forum
  const getArchivedForum = useCallback((archiveId) => {
    return archivedForums.find(a => a.id === archiveId);
  }, [archivedForums]);

  // Export archived forum as JSON
  const exportArchive = useCallback((archiveId) => {
    const archive = archivedForums.find(a => a.id === archiveId);
    if (!archive) return null;

    const exportData = {
      school_name: archive.school_name,
      archived_at: archive.archived_at,
      archive_reason: archive.archive_reason,
      forum: archive.forum_data,
      topics: archive.topics_data,
      stats: {
        topic_count: archive.topic_count,
        reply_count: archive.reply_count,
      },
    };

    return JSON.stringify(exportData, null, 2);
  }, [archivedForums]);

  // Export all archived forums
  const exportAllArchives = useCallback(() => {
    const exportData = archivedForums.map(archive => ({
      school_name: archive.school_name,
      archived_at: archive.archived_at,
      archive_reason: archive.archive_reason,
      forum: archive.forum_data,
      topics: archive.topics_data,
      stats: {
        topic_count: archive.topic_count,
        reply_count: archive.reply_count,
      },
    }));

    return JSON.stringify(exportData, null, 2);
  }, [archivedForums]);

  // Delete archived forum permanently
  const deleteArchive = async (archiveId) => {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('archived_forum_content')
          .delete()
          .eq('id', archiveId);

        if (error) throw error;
      } catch (err) {
        console.error('Error deleting archived forum:', err);
        return; // Don't update local state if delete failed
      }
    }

    setArchivedForums(prev => prev.filter(a => a.id !== archiveId));
  };

  // Get stats
  const stats = {
    totalArchives: archivedForums.length,
    totalTopics: archivedForums.reduce((sum, a) => sum + (a.topic_count || 0), 0),
    totalReplies: archivedForums.reduce((sum, a) => sum + (a.reply_count || 0), 0),
  };

  return {
    archivedForums,
    isLoading,
    stats,
    selectedArchive,
    setSelectedArchive,
    getArchivedForum,
    exportArchive,
    exportAllArchives,
    deleteArchive,
  };
}

export default useArchivedForums;
