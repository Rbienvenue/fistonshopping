import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/hooks/useChat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Layout } from '@/components/layout/Layout';
import { Send, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Chat = () => {
  const { user, profile, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [messageInput, setMessageInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, isLoading, error, sendMessage } = useChat(user?.id);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!messageInput.trim() || !profile) return;

    setIsSending(true);

    const { error: sendError } = await sendMessage(
      messageInput,
      profile.full_name || 'Anonymous',
      'user'
    );

    if (!sendError) {
      setMessageInput('');
    }

    setIsSending(false);
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-500">Loading...</p>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-6 px-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Chat with Us
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Ask questions or report issues. Our admin team will respond soon.
          </p>
        </div>

        {/* Chat Container */}
        <Card className="flex flex-col h-[600px] shadow-lg">
          {/* Messages Area */}
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-4">
              {isLoading && messages.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                  <p className="text-gray-500">Loading messages...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <p className="text-gray-500 mb-2">No messages yet</p>
                    <p className="text-sm text-gray-400">
                      Start a conversation by sending a message
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((msg) => {
                  const isUserMessage = msg.sender_role === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${
                        isUserMessage ? 'flex-row-reverse' : 'flex-row'
                      }`}
                    >
                      {/* Avatar */}
                      <Avatar className="h-10 w-10 flex-shrink-0 mt-1">
                        <AvatarFallback
                          className={
                            isUserMessage
                              ? 'bg-blue-500 text-white'
                              : 'bg-green-500 text-white'
                          }
                        >
                          {msg.sender_name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      {/* Message Bubble */}
                      <div
                        className={`max-w-xs ${
                          isUserMessage ? 'items-end' : 'items-start'
                        }`}
                      >
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          {msg.sender_name}
                        </p>
                        <div
                          className={`px-4 py-2 rounded-lg ${
                            isUserMessage
                              ? 'bg-blue-500 text-white rounded-br-none'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'
                          }`}
                        >
                          <p className="text-sm break-words">{msg.message}</p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 px-2">
                          {new Date(msg.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 px-6 py-3 flex items-center gap-2 text-red-700 dark:text-red-300">
              <AlertCircle size={18} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="border-t p-4">
            <div className="flex gap-3">
              <Input
                placeholder="Type your message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                disabled={isSending}
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={!messageInput.trim() || isSending}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6"
              >
                <Send size={18} />
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default Chat;
