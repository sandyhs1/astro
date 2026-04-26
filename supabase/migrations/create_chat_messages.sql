-- Create chat_messages table to persist Oracle Chat history across sessions
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.chat_messages (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    profile_id  UUID REFERENCES public.family_profiles(id) ON DELETE CASCADE,
    role        TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content     TEXT NOT NULL,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast history retrieval (most common query pattern)
CREATE INDEX IF NOT EXISTS idx_chat_messages_lookup
    ON public.chat_messages(user_id, profile_id, created_at);

-- RLS
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own messages"
    ON public.chat_messages FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own messages"
    ON public.chat_messages FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own messages"
    ON public.chat_messages FOR DELETE
    USING (auth.uid() = user_id);

-- Service role bypass (used by supabaseAdmin in the API)
CREATE POLICY "Service role full access"
    ON public.chat_messages FOR ALL
    USING (true)
    WITH CHECK (true);
