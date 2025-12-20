-- Create chat_messages table for user-admin communication
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_name TEXT NOT NULL,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('user', 'admin')),
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_chat_messages_user_id ON public.chat_messages(user_id);
CREATE INDEX idx_chat_messages_created_at ON public.chat_messages(created_at);

-- RLS Policies
-- Allow authenticated users to insert their own messages
CREATE POLICY "allow_users_insert_own_messages" ON public.chat_messages
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to select messages from their own chat
CREATE POLICY "allow_users_select_own_messages" ON public.chat_messages
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow admins to select all messages
CREATE POLICY "allow_admins_select_all_messages" ON public.chat_messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Allow admins to insert messages
CREATE POLICY "allow_admins_insert_messages" ON public.chat_messages
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Grant permissions
GRANT SELECT, INSERT ON public.chat_messages TO authenticated;
