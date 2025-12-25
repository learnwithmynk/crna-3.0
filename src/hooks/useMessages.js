/**
 * useMessages Hook
 *
 * Manages messages for a single conversation.
 * Uses Supabase admin_messages table when authenticated.
 * Falls back to mock data when not authenticated.
 * Includes real-time subscription for new messages.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getMockMessagesForConversation,
  isOwnMessage as checkOwnMessage,
  getMessageSender
} from '@/data/mockMessages';
import { mockUsers } from '@/data/mockTopics';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from './useAuth';

const CURRENT_USER_ID = mockUsers.currentUser.id;

export function useMessages(conversationId) {
  // Use centralized auth - prevents duplicate auth listeners
  const { user, isLoading: authLoading } = useAuth();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);

  // Track conversation ID for cleanup
  const conversationIdRef = useRef(conversationId);

  // Fetch messages when conversation changes
  useEffect(() => {
    conversationIdRef.current = conversationId;

    const fetchMessages = async () => {
      if (!conversationId) {
        setMessages([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Check if we're still on the same conversation
        if (conversationIdRef.current !== conversationId) return;

        if (user && isSupabaseConfigured()) {
          // Fetch from Supabase admin_messages
          const { data, error: fetchError } = await supabase
            .from('admin_messages')
            .select('*')
            .eq('conversation_id', conversationId)
            .order('created_at', { ascending: true });

          if (fetchError) throw fetchError;

          // Transform to app format (camelCase)
          const transformedMessages = (data || []).map(msg => ({
            id: msg.id,
            conversation_id: msg.conversation_id,
            sender_id: msg.sender_id,
            content: msg.content,
            created_at: msg.created_at,
            read_at: msg.read_at,
            // Additional fields from admin_messages
            sender_name: msg.sender_name,
            sender_role: msg.sender_role,
            message_type: msg.message_type
          }));

          setMessages(transformedMessages);
        } else {
          // Use mock data when not authenticated
          await new Promise(resolve => setTimeout(resolve, 300));
          setMessages(getMockMessagesForConversation(conversationId));
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchMessages();
    }

    // Set up real-time subscription for authenticated users
    if (user && isSupabaseConfigured() && conversationId) {
      const channel = supabase
        .channel(`messages:${conversationId}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'admin_messages',
          filter: `conversation_id=eq.${conversationId}`
        }, (payload) => {
          // Transform and add new message
          const newMessage = {
            id: payload.new.id,
            conversation_id: payload.new.conversation_id,
            sender_id: payload.new.sender_id,
            content: payload.new.content,
            created_at: payload.new.created_at,
            read_at: payload.new.read_at,
            sender_name: payload.new.sender_name,
            sender_role: payload.new.sender_role,
            message_type: payload.new.message_type
          };
          setMessages(prev => [...prev, newMessage]);
        })
        .subscribe();

      return () => {
        channel.unsubscribe();
      };
    }
  }, [conversationId, user, authLoading]);

  // Send a message
  const sendMessage = useCallback(async (content) => {
    if (!conversationId || !content.trim()) return null;

    try {
      setSending(true);

      if (user && isSupabaseConfigured()) {
        // Supabase: Insert message
        const { data, error: insertError } = await supabase
          .from('admin_messages')
          .insert({
            conversation_id: conversationId,
            sender_id: user.id,
            sender_name: user.user_metadata?.name || user.email,
            sender_role: 'admin',
            message_type: 'check_in',
            content: content.trim()
          })
          .select()
          .single();

        if (insertError) throw insertError;

        // Transform to app format
        const newMessage = {
          id: data.id,
          conversation_id: data.conversation_id,
          sender_id: data.sender_id,
          content: data.content,
          created_at: data.created_at,
          read_at: data.read_at,
          sender_name: data.sender_name,
          sender_role: data.sender_role,
          message_type: data.message_type
        };

        // Note: Real-time subscription will handle adding to messages list
        // But we add optimistically for immediate UI update
        setMessages(prev => [...prev, newMessage]);
        return newMessage;
      } else {
        // Mock data fallback
        const newMessage = {
          id: `msg_${Date.now()}`,
          conversation_id: conversationId,
          sender_id: CURRENT_USER_ID,
          content: content.trim(),
          created_at: new Date().toISOString()
        };

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 200));

        setMessages(prev => [...prev, newMessage]);
        return newMessage;
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err.message);
      return null;
    } finally {
      setSending(false);
    }
  }, [conversationId, user]);

  // Delete a message (own only)
  const deleteMessage = useCallback(async (messageId) => {
    const message = messages.find(m => m.id === messageId);
    const currentUserId = user?.id || CURRENT_USER_ID;

    // Only allow deleting own messages
    if (!message || message.sender_id !== currentUserId) {
      return false;
    }

    try {
      if (user && isSupabaseConfigured()) {
        // Supabase: Delete message
        const { error: deleteError } = await supabase
          .from('admin_messages')
          .delete()
          .eq('id', messageId)
          .eq('sender_id', user.id);

        if (deleteError) throw deleteError;

        setMessages(prev => prev.filter(m => m.id !== messageId));
        return true;
      } else {
        // Mock data fallback
        await new Promise(resolve => setTimeout(resolve, 200));
        setMessages(prev => prev.filter(m => m.id !== messageId));
        return true;
      }
    } catch (err) {
      console.error('Error deleting message:', err);
      setError(err.message);
      return false;
    }
  }, [messages, user]);

  // Check if a message is from current user
  const isOwnMessage = useCallback((message) => {
    const currentUserId = user?.id || CURRENT_USER_ID;
    return message.sender_id === currentUserId;
  }, [user]);

  // Get sender info for a message
  const getSender = useCallback((message) => {
    if (user && isSupabaseConfigured()) {
      // For authenticated users, use sender info from message
      return {
        id: message.sender_id,
        name: message.sender_name || 'Unknown',
        avatar: null,
        role: message.sender_role
      };
    } else {
      // For unauthenticated users, use mock data
      return getMessageSender(message);
    }
  }, [user]);

  // Refresh messages
  const refresh = useCallback(async () => {
    if (!conversationId) return;

    setLoading(true);
    try {
      if (user && isSupabaseConfigured()) {
        // Fetch from Supabase
        const { data, error: fetchError } = await supabase
          .from('admin_messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true });

        if (fetchError) throw fetchError;

        // Transform to app format
        const transformedMessages = (data || []).map(msg => ({
          id: msg.id,
          conversation_id: msg.conversation_id,
          sender_id: msg.sender_id,
          content: msg.content,
          created_at: msg.created_at,
          read_at: msg.read_at,
          sender_name: msg.sender_name,
          sender_role: msg.sender_role,
          message_type: msg.message_type
        }));

        setMessages(transformedMessages);
      } else {
        // Mock data fallback
        await new Promise(resolve => setTimeout(resolve, 300));
        setMessages(getMockMessagesForConversation(conversationId));
      }
      setError(null);
    } catch (err) {
      console.error('Error refreshing messages:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [conversationId, user]);

  // Computed values
  const messageCount = messages.length;
  const hasMessages = messages.length > 0;
  const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;

  return {
    messages,
    loading: loading || authLoading,
    error,
    sending,

    // Methods
    sendMessage,
    deleteMessage,
    isOwnMessage,
    getSender,
    refresh,

    // Computed values
    messageCount,
    hasMessages,
    lastMessage,
    currentUserId: user?.id || CURRENT_USER_ID,

    // Auth state
    isAuthenticated: !!user,
    user
  };
}

export default useMessages;
