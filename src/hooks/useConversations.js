/**
 * useConversations Hook
 *
 * Manages conversation list for direct messaging.
 * Uses Supabase admin_conversations table when authenticated.
 * Falls back to mock data when not authenticated.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  mockConversations,
  getMockConversation,
  getMockConversationsForUser,
  getMockUnreadCount,
  getOtherParticipant
} from '@/data/mockConversations';
import { mockUsers } from '@/data/mockTopics';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from './useAuth';

const CURRENT_USER_ID = mockUsers.currentUser.id;

export function useConversations() {
  // Use centralized auth - prevents duplicate auth listeners
  const { user, isLoading: authLoading } = useAuth();
  const hasFetchedRef = useRef(false);

  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);

        if (user && isSupabaseConfigured()) {
          // Fetch from Supabase admin_conversations
          const { data, error: fetchError } = await supabase
            .from('admin_conversations')
            .select(`
              id,
              provider_id,
              provider_name,
              provider_email,
              status,
              unread_by_provider,
              unread_by_admin,
              last_message_at,
              created_at
            `)
            .order('last_message_at', { ascending: false });

          if (fetchError) throw fetchError;

          // Transform to app format (camelCase)
          const transformedConversations = (data || []).map(conv => ({
            id: conv.id,
            created_at: conv.created_at,
            updated_at: conv.last_message_at,
            participants: [
              {
                user_id: user.id,
                name: user.user_metadata?.name || user.email,
                avatar: user.user_metadata?.avatar || null,
                last_read_at: new Date().toISOString()
              },
              {
                user_id: conv.provider_id,
                name: conv.provider_name,
                avatar: null,
                last_read_at: null
              }
            ],
            last_message: null, // Will be fetched separately if needed
            unread_count: conv.unread_by_admin || 0
          }));

          setConversations(transformedConversations);
        } else {
          // Use mock data when not authenticated
          await new Promise(resolve => setTimeout(resolve, 300));
          setConversations(getMockConversationsForUser(CURRENT_USER_ID));
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching conversations:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchConversations();
    }
  }, [user, authLoading]);

  // Get single conversation by ID
  const getConversation = useCallback((conversationId) => {
    return conversations.find(c => c.id === conversationId) || null;
  }, [conversations]);

  // Get other participant in a conversation (for display)
  const getOtherUser = useCallback((conversation) => {
    return getOtherParticipant(conversation, CURRENT_USER_ID);
  }, []);

  // Create new conversation
  const createConversation = useCallback(async (participantId) => {
    // Check if conversation already exists
    const existing = conversations.find(c =>
      c.participants.some(p => p.user_id === participantId)
    );

    if (existing) {
      return existing;
    }

    if (user && isSupabaseConfigured()) {
      // Supabase: Create admin conversation
      try {
        // Get participant info (provider profile)
        const { data: providerData, error: providerError } = await supabase
          .from('provider_profiles')
          .select('id, user_id')
          .eq('id', participantId)
          .single();

        if (providerError) throw providerError;

        // Get user info for provider name
        const { data: userData, error: userError } = await supabase
          .from('auth.users')
          .select('email, raw_user_meta_data')
          .eq('id', providerData.user_id)
          .single();

        if (userError) {
          console.warn('Could not fetch user data:', userError);
        }

        const providerName = userData?.raw_user_meta_data?.name || userData?.email || 'Unknown';
        const providerEmail = userData?.email;

        const { data, error: insertError } = await supabase
          .from('admin_conversations')
          .insert({
            provider_id: participantId,
            provider_name: providerName,
            provider_email: providerEmail,
            status: 'open',
            unread_by_admin: 0,
            unread_by_provider: 0
          })
          .select()
          .single();

        if (insertError) throw insertError;

        // Transform to app format
        const newConversation = {
          id: data.id,
          created_at: data.created_at,
          updated_at: data.last_message_at,
          participants: [
            {
              user_id: user.id,
              name: user.user_metadata?.name || user.email,
              avatar: user.user_metadata?.avatar || null,
              last_read_at: new Date().toISOString()
            },
            {
              user_id: participantId,
              name: providerName,
              avatar: null,
              last_read_at: null
            }
          ],
          last_message: null,
          unread_count: 0
        };

        setConversations(prev => [newConversation, ...prev]);
        return newConversation;
      } catch (err) {
        console.error('Error creating conversation:', err);
        setError(err.message);
        return null;
      }
    } else {
      // Mock data fallback
      const participant = Object.values(mockUsers).find(u => u.id === participantId);
      if (!participant) return null;

      const newConversation = {
        id: `conv_${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        participants: [
          {
            user_id: CURRENT_USER_ID,
            name: mockUsers.currentUser.name,
            avatar: mockUsers.currentUser.avatar,
            last_read_at: new Date().toISOString()
          },
          {
            user_id: participant.id,
            name: participant.name,
            avatar: participant.avatar,
            last_read_at: null
          }
        ],
        last_message: null,
        unread_count: 0
      };

      setConversations(prev => [newConversation, ...prev]);
      return newConversation;
    }
  }, [user, conversations]);

  // Mark conversation as read
  const markAsRead = useCallback(async (conversationId) => {
    if (user && isSupabaseConfigured()) {
      // Supabase: Use the mark_messages_read function
      try {
        const { error: markError } = await supabase.rpc('mark_messages_read', {
          p_conversation_id: conversationId,
          p_reader_role: 'admin'
        });

        if (markError) throw markError;

        // Update local state
        setConversations(prev => prev.map(conv => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              unread_count: 0,
              participants: conv.participants.map(p =>
                p.user_id === user.id
                  ? { ...p, last_read_at: new Date().toISOString() }
                  : p
              )
            };
          }
          return conv;
        }));
      } catch (err) {
        console.error('Error marking as read:', err);
        setError(err.message);
      }
    } else {
      // Mock data fallback
      setConversations(prev => prev.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            unread_count: 0,
            participants: conv.participants.map(p =>
              p.user_id === CURRENT_USER_ID
                ? { ...p, last_read_at: new Date().toISOString() }
                : p
            )
          };
        }
        return conv;
      }));
    }
  }, [user]);

  // Update conversation with new message (called from useMessages)
  const updateConversationLastMessage = useCallback((conversationId, message) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          updated_at: message.created_at,
          last_message: message
        };
      }
      return conv;
    }).sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)));
  }, []);

  // Search conversations by participant name
  const searchConversations = useCallback((query) => {
    if (!query) return conversations;
    const lowerQuery = query.toLowerCase();
    return conversations.filter(conv => {
      const other = getOtherParticipant(conv, CURRENT_USER_ID);
      return other?.name.toLowerCase().includes(lowerQuery);
    });
  }, [conversations]);

  // Refresh conversations
  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      if (user && isSupabaseConfigured()) {
        // Fetch from Supabase
        const { data, error: fetchError } = await supabase
          .from('admin_conversations')
          .select(`
            id,
            provider_id,
            provider_name,
            provider_email,
            status,
            unread_by_provider,
            unread_by_admin,
            last_message_at,
            created_at
          `)
          .order('last_message_at', { ascending: false });

        if (fetchError) throw fetchError;

        // Transform to app format
        const transformedConversations = (data || []).map(conv => ({
          id: conv.id,
          created_at: conv.created_at,
          updated_at: conv.last_message_at,
          participants: [
            {
              user_id: user.id,
              name: user.user_metadata?.name || user.email,
              avatar: user.user_metadata?.avatar || null,
              last_read_at: new Date().toISOString()
            },
            {
              user_id: conv.provider_id,
              name: conv.provider_name,
              avatar: null,
              last_read_at: null
            }
          ],
          last_message: null,
          unread_count: conv.unread_by_admin || 0
        }));

        setConversations(transformedConversations);
      } else {
        // Mock data fallback
        await new Promise(resolve => setTimeout(resolve, 300));
        setConversations(getMockConversationsForUser(CURRENT_USER_ID));
      }
      setError(null);
    } catch (err) {
      console.error('Error refreshing conversations:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Computed values
  const totalUnreadCount = conversations.reduce((total, conv) => total + conv.unread_count, 0);
  const hasConversations = conversations.length > 0;

  return {
    conversations,
    loading: loading || authLoading,
    error,

    // Methods
    getConversation,
    getOtherUser,
    createConversation,
    markAsRead,
    updateConversationLastMessage,
    searchConversations,
    refresh,

    // Computed values
    totalUnreadCount,
    hasConversations,
    currentUserId: user?.id || CURRENT_USER_ID,

    // Auth state
    isAuthenticated: !!user,
    user
  };
}

export default useConversations;
