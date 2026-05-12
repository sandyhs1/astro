-- Migration: create_life_journals
-- Description: Create table for storing voice journal entries with Deepgram sentiment analysis and astrological transits

CREATE TABLE IF NOT EXISTS public.life_journals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES public.family_profiles(id) ON DELETE CASCADE,
    transcription TEXT NOT NULL,
    sentiment TEXT NOT NULL,
    sentiment_score FLOAT NOT NULL,
    gochar_snapshot JSONB,
    dasha_snapshot JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE public.life_journals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own journals" 
    ON public.life_journals FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own journals" 
    ON public.life_journals FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own journals" 
    ON public.life_journals FOR DELETE 
    USING (auth.uid() = user_id);

-- Optional: Create an index for faster queries on profile_id and created_at
CREATE INDEX IF NOT EXISTS idx_life_journals_profile_id ON public.life_journals(profile_id);
CREATE INDEX IF NOT EXISTS idx_life_journals_created_at ON public.life_journals(created_at DESC);
