-- ============================================================
-- Quantum Karma: Chat History Upgrade
-- Run this in the Supabase SQL Editor
-- ============================================================
-- This migration adds user_id and profile_id directly to the 
-- existing chat_messages table so we can persist messages
-- without needing the chat_sessions intermediary.
-- ============================================================

-- 1. Add direct user_id and profile_id columns to existing chat_messages
ALTER TABLE public.chat_messages
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.chat_messages
ADD COLUMN IF NOT EXISTS profile_id UUID REFERENCES public.family_profiles(id) ON DELETE CASCADE;

-- 2. Make session_id optional (it was required before, now we use direct linking)
ALTER TABLE public.chat_messages
ALTER COLUMN session_id DROP NOT NULL;

-- 3. Add index for fast user+profile history loading
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_profile
ON public.chat_messages(user_id, profile_id, created_at ASC);

-- 4. Drop old restrictive policy and create new direct ones
DROP POLICY IF EXISTS "Users can manage their own chat messages" ON public.chat_messages;

CREATE POLICY "Users can view own chat messages"
  ON public.chat_messages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat messages"
  ON public.chat_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- NOTE: No UPDATE or DELETE policies. Chat messages are PERMANENT.
