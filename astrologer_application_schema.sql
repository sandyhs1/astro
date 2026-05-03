-- =====================================================================================
-- Migration: Astrologer Application Enhancements
-- Description: Adds detailed vetting columns to the astrologers table.
-- =====================================================================================

-- Add new columns to capture application details
ALTER TABLE public.astrologers 
    ADD COLUMN IF NOT EXISTS full_name TEXT,
    ADD COLUMN IF NOT EXISTS experience_level TEXT,
    ADD COLUMN IF NOT EXISTS q1_answer TEXT,
    ADD COLUMN IF NOT EXISTS q2_answer TEXT,
    ADD COLUMN IF NOT EXISTS q3_answer TEXT;

-- Track whether usage is from a regular user or an astrologer partner
ALTER TABLE public.token_usage_logs ADD COLUMN IF NOT EXISTS usage_type TEXT DEFAULT 'user';
ALTER TABLE public.astroapi_logs ADD COLUMN IF NOT EXISTS usage_type TEXT DEFAULT 'user';

-- Create index for faster filtering by admin
CREATE INDEX IF NOT EXISTS idx_token_usage_logs_type ON public.token_usage_logs(usage_type);
CREATE INDEX IF NOT EXISTS idx_astroapi_logs_type ON public.astroapi_logs(usage_type);

-- Update RLS policies (The existing policies handle INSERT/SELECT, 
-- but we should ensure UPDATE is allowed for users if they want to modify their app later.
-- For now, our flow only requires INSERT via the service_role key, 
-- and SELECT which is already handled.)
