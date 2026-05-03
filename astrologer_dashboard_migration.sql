-- =====================================================================================
-- Migration: Astrologer Dashboard (B2B) Schema
-- Description: Creates tables for astrologer access control and B2B client management.
-- =====================================================================================

-- 1. Astrologers Table
-- Controls access to the /astrologer/dashboard route
CREATE TABLE IF NOT EXISTS public.astrologers (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'declined'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for astrologers table
ALTER TABLE public.astrologers ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own astrologer status
CREATE POLICY "Users can read own astrologer status" ON public.astrologers
    FOR SELECT USING (auth.uid() = id);

-- Policy: Users can apply to be an astrologer (insert)
CREATE POLICY "Users can insert own astrologer profile" ON public.astrologers
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Policy: Service role can do everything
CREATE POLICY "Admin can manage astrologers" ON public.astrologers
    FOR ALL USING (auth.role() = 'service_role');

-- 2. Astrologer Clients Table
-- Separate table for B2B clients, distinct from B2C family_profiles
CREATE TABLE IF NOT EXISTS public.astrologer_clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    astrologer_id UUID NOT NULL REFERENCES public.astrologers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    dob TEXT NOT NULL, -- Format: DD-MM-YYYY
    tob TEXT NOT NULL, -- Format: HH:MM (24h)
    pob TEXT NOT NULL,
    timezone TEXT DEFAULT '+05:30',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for fast lookup by astrologer
CREATE INDEX IF NOT EXISTS idx_astrologer_clients_astrologer_id ON public.astrologer_clients USING btree (astrologer_id);

-- Enable RLS for astrologer_clients
ALTER TABLE public.astrologer_clients ENABLE ROW LEVEL SECURITY;

-- Policy: Astrologers can CRUD their own clients
CREATE POLICY "Astrologers manage own clients" ON public.astrologer_clients
    FOR ALL USING (auth.uid() = astrologer_id);

-- Policy: Service role can do everything
CREATE POLICY "Admin can manage all clients" ON public.astrologer_clients
    FOR ALL USING (auth.role() = 'service_role');

-- 3. Update Chat Messages for Astrologer Clients
-- Add astrologer_client_id so we can persist chats for B2B clients without breaking the family_profiles foreign key
ALTER TABLE public.chat_messages
ADD COLUMN IF NOT EXISTS astrologer_client_id UUID REFERENCES public.astrologer_clients(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_chat_messages_astrologer_client
ON public.chat_messages(astrologer_client_id);

-- =====================================================================================
-- ADMIN CHEAT SHEET: How to approve an astrologer
-- =====================================================================================
-- To approve an astrologer, run this query in the Supabase SQL Editor:
-- 
-- UPDATE public.astrologers 
-- SET status = 'approved' 
-- WHERE id = (SELECT id FROM auth.users WHERE email = 'astrologer@email.com');
--
-- (Replace 'astrologer@email.com' with the user's actual email)
-- =====================================================================================
