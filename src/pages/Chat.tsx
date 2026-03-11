import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/hooks/useChat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Layout from '@/components/layout/Layout';
import { Send, AlertCircle, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ChatContent = () => {
  const { user, profile, isLoading: authLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [messageInput, setMessageInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages = [], isLoading = false, error = null, sendMessage } = useChat(user?.id);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      try {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      } catch (e) {
        console.error('Scroll error:', e);
      }
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!messageInput.trim() || !profile) return;

    setIsSending(true);

    try {
      const result = await sendMessage(
        messageInput,
        profile.full_name || 'Anonymous',
        'user'
      );

      if (!result?.error) {
        setMessageInput('');
      }
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setIsSending(false);
    }
  };

  // Filter messages based on search
  const filteredMessages = messages.filter(msg =>
    msg?.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg?.sender_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <div className="max-w-7xl mx-auto h-[calc(100vh-200px)] px-4 py-6">
        <div className="flex gap-6 h-full">
          {/* Sidebar */}
          <div className="w-72 border-r border-gray-200 dark:border-gray-800 flex flex-col">
            {/* Header */}
            <div className="pb-4">
              <h2 className="text-xl font-bold mb-4">Chats</h2>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10"
                />
              </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto space-y-2">
              {!isAdmin ? (
                // For regular users - show conversation with admin
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950 border-l-4 border-blue-500 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 transition">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarFallback className="bg-green-500 text-white">
                        A
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">Admin Support</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {messages.length > 0 
                          ? messages[messages.length - 1]?.message 
                          : 'Start a conversation'}
                      </p>
                    </div>
                    {messages.length > 0 && (
                      <span className="text-xs text-gray-400 flex-shrink-0">
                        {new Date(messages[messages.length - 1]?.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                // For admins - show list of user conversations
                <p className="text-sm text-gray-500 p-4">Admin chat view coming soon</p>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <Card className="flex-1 flex flex-col shadow-lg">
            {/* Chat Header */}
            <div className="border-b border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className={isAdmin ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'}>
                    {isAdmin ? 'A' : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{isAdmin ? 'User Chat' : 'Admin Support'}</h3>
                  <p className="text-xs text-gray-500">
                    {messages.length} {messages.length === 1 ? 'message' : 'messages'}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {isLoading && messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">Loading messages...</p>
                </div>
              ) : filteredMessages.length === 0 && searchQuery ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">No messages match your search</p>
                </div>
              ) : filteredMessages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <p className="text-gray-500 mb-2">No messages yet</p>
                    <p className="text-sm text-gray-400">
                      Start a conversation by sending a message
                    </p>
                  </div>
                </div>
              ) : (
                filteredMessages.map((msg) => {
                  try {
                    const isUserMessage = msg?.sender_role === 'user';
                    return (
                      <div
                        key={msg?.id || Math.random()}
                        className={`flex gap-3 ${
                          isUserMessage ? 'flex-row-reverse' : 'flex-row'
                        }`}
                      >
                        {/* Avatar */}
                        <Avatar className="h-8 w-8 flex-shrink-0 mt-1">
                          <AvatarFallback
                            className={
                              isUserMessage
                                ? 'bg-blue-500 text-white text-xs'
                                : 'bg-green-500 text-white text-xs'
                            }
                          >
                            {msg?.sender_name?.charAt(0).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>

                        {/* Message Bubble */}
                        <div className={`flex flex-col ${isUserMessage ? 'items-end' : 'items-start'}`}>
                          <p className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 px-2">
                            {msg?.sender_name || 'Unknown'}
                          </p>
                          <div
                            className={`px-4 py-2 rounded-lg max-w-sm ${
                              isUserMessage
                                ? 'bg-blue-500 text-white rounded-br-none'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-none'
                            }`}
                          >
                            <p className="text-sm break-words">{msg?.message || ''}</p>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 px-2">
                            {msg?.created_at
                              ? new Date(msg.created_at).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : ''}
                          </p>
                        </div>
                      </div>
                    );
                  } catch (msgError) {
                    console.error('Error rendering message:', msgError);
                    return null;
                  }
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Error Alert */}
            {error && (
              <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 px-6 py-3 flex items-center gap-2 text-red-700 dark:text-red-300">
                <AlertCircle size={18} />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="border-t border-gray-200 dark:border-gray-800 p-4">
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
      </div>
    </Layout>
  );
};

const Chat = () => {
  try {
    return <ChatContent />;
  } catch (error) {
    console.error('Chat component error:', error);
    return (
      <Layout>
        <div className="max-w-4xl mx-auto py-6 px-4">
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="text-red-500 flex-shrink-0 mt-1" size={24} />
              <div>
                <h2 className="font-bold text-red-700 mb-2">Error Loading Chat</h2>
                <p className="text-sm text-gray-600">
                  There was an error loading the chat. Please refresh the page and try again.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }
};

export default Chat;

