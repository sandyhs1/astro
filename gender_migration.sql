-- =====================================================================================
-- Migration: Add Gender Field
-- Description: Adds gender column to tracking tables for better astrological accuracy
-- =====================================================================================

-- 1. Add gender to onboarding_leads (B2C)
ALTER TABLE public.onboarding_leads
ADD COLUMN IF NOT EXISTS gender TEXT;

-- 2. Add gender to astrologer_clients (B2B)
ALTER TABLE public.astrologer_clients
ADD COLUMN IF NOT EXISTS gender TEXT;
