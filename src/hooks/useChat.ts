import { useState, useCallback } from 'react';
import { ChatMessage } from '@/lib/types';

export const useChat = (userId: string | undefined) => {
  const [messages] = useState<ChatMessage[]>([]);
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);
  const [tableExists] = useState(false);

  const fetchMessages = useCallback(async () => {}, []);

  const sendMessage = useCallback(
    async (_message: string, _senderName: string, _senderRole: 'user' | 'admin') => {
      return { error: 'Not connected' };
    },
    []
  );

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    fetchMessages,
    tableExists,
  };
};
