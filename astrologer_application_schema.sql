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

-- Update RLS policies (The existing policies handle INSERT/SELECT, 
-- but we should ensure UPDATE is allowed for users if they want to modify their app later.
-- For now, our flow only requires INSERT via the service_role key, 
-- and SELECT which is already handled.)
