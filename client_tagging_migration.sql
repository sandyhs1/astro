-- =====================================================================================
-- Migration: Client Tagging Support
-- Description: Adds tagging support for organized client management.
-- =====================================================================================

ALTER TABLE public.astrologer_clients 
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

CREATE INDEX IF NOT EXISTS idx_astrologer_clients_tags ON public.astrologer_clients USING gin (tags);
