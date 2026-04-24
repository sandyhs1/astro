-- Run this in Supabase SQL Editor

-- 1. Add credits to existing user_profiles table
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS credits INTEGER DEFAULT 50 NOT NULL;

-- 2. Create family_profiles table
CREATE TABLE IF NOT EXISTS public.family_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    relationship TEXT NOT NULL, -- e.g., 'Self', 'Spouse', 'Child', 'Parent'
    dob TEXT NOT NULL, -- 'YYYY-MM-DD'
    tob TEXT NOT NULL, -- 'HH:MM'
    pob TEXT NOT NULL,
    timezone TEXT DEFAULT '+05:30',
    created_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL
);

-- 3. Create chat_sessions table
CREATE TABLE IF NOT EXISTS public.chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    family_profile_id UUID REFERENCES public.family_profiles(id) ON DELETE SET NULL,
    title TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL
);

-- 4. Create chat_messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
    role TEXT NOT NULL, -- 'user' or 'assistant'
    content TEXT NOT NULL,
    intent_count INTEGER DEFAULT 1,
    tokens_used INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL
);

-- Enable RLS for all new tables
ALTER TABLE public.family_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Policies for family_profiles
CREATE POLICY "Users can manage their own family profiles" ON public.family_profiles
    FOR ALL USING (auth.uid() = user_id);

-- Policies for chat_sessions
CREATE POLICY "Users can manage their own chat sessions" ON public.chat_sessions
    FOR ALL USING (auth.uid() = user_id);

-- Policies for chat_messages
-- Requires a join to check if the session belongs to the user
CREATE POLICY "Users can manage their own chat messages" ON public.chat_messages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.chat_sessions cs 
            WHERE cs.id = chat_messages.session_id 
            AND cs.user_id = auth.uid()
        )
    );
