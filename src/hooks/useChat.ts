import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChatMessage } from '@/lib/types';

export const useChat = (userId: string | undefined) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tableExists, setTableExists] = useState(true);

  // Fetch chat messages
  const fetchMessages = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (fetchError) {
        console.error('Fetch error:', fetchError);
        // Check if table doesn't exist
        if (
          fetchError.message?.toLowerCase().includes('relation') ||
          fetchError.message?.toLowerCase().includes('does not exist') ||
          fetchError.message?.toLowerCase().includes('undefined table')
        ) {
          setTableExists(false);
          setMessages([]);
          setError('Chat table is being initialized. Please refresh the page.');
        } else {
          setError(fetchError.message || 'Failed to fetch messages');
        }
        return;
      }
      setTableExists(true);
      setMessages(data || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch messages');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Send a message
  const sendMessage = useCallback(
    async (message: string, senderName: string, senderRole: 'user' | 'admin') => {
      if (!userId) {
        const errorMsg = 'User not authenticated';
        setError(errorMsg);
        return { error: errorMsg };
      }

      if (!tableExists) {
        const errorMsg = 'Chat is not available yet. Please try again after refreshing.';
        setError(errorMsg);
        return { error: errorMsg };
      }

      try {
        const { data, error: insertError } = await supabase
          .from('chat_messages')
          .insert([
            {
              user_id: userId,
              sender_name: senderName,
              sender_role: senderRole,
              message: message.trim(),
            },
          ])
          .select();

        if (insertError) {
          console.error('Insert error:', insertError);
          if (
            insertError.message?.toLowerCase().includes('relation') ||
            insertError.message?.toLowerCase().includes('does not exist')
          ) {
            setTableExists(false);
            const errorMsg = 'Chat table is being initialized. Please refresh the page.';
            setError(errorMsg);
            return { error: errorMsg };
          }
          const errorMsg = insertError.message || 'Failed to send message';
          setError(errorMsg);
          return { error: errorMsg };
        }

        if (data && data.length > 0) {
          setMessages((prev) => [...prev, data[0] as ChatMessage]);
        }

        return { error: null };
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to send message';
        console.error('Send error:', err);
        setError(errorMsg);
        return { error: errorMsg };
      }
    },
    [userId, tableExists]
  );

  // Subscribe to new messages
  useEffect(() => {
    if (!userId || !tableExists) return;

    // Initial fetch
    fetchMessages();

    // Setup subscription with error handling
    let subscription: any = null;
    try {
      subscription = supabase
        .channel(`chat:${userId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'chat_messages',
            filter: `user_id=eq.${userId}`,
          },
          (payload: any) => {
            setMessages((prev) => [...prev, payload.new as ChatMessage]);
          }
        )
        .subscribe((status: string) => {
          if (status === 'SUBSCRIBED') {
            console.log('Chat subscription active');
          }
        });
    } catch (err) {
      console.error('Subscription error:', err);
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [userId, tableExists, fetchMessages]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    fetchMessages,
    tableExists,
  };
};
