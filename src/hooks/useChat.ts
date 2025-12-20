import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChatMessage } from '@/lib/types';

export const useChat = (userId: string | undefined) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch chat messages
  const fetchMessages = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;
      setMessages(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch messages');
      console.error('Error fetching messages:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Send a message
  const sendMessage = useCallback(
    async (message: string, senderName: string, senderRole: 'user' | 'admin') => {
      if (!userId) {
        setError('User not authenticated');
        return;
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

        if (insertError) throw insertError;

        if (data && data.length > 0) {
          setMessages((prev) => [...prev, data[0]]);
        }

        return { error: null };
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to send message';
        setError(errorMsg);
        return { error: errorMsg };
      }
    },
    [userId]
  );

  // Subscribe to new messages
  useEffect(() => {
    if (!userId) return;

    fetchMessages();

    const subscription = supabase
      .channel(`chat:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as ChatMessage]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    fetchMessages,
  };
};
