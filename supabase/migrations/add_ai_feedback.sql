-- Migration: add_ai_feedback
-- Description: Adds the ai_feedback JSONB column to life_journals table

ALTER TABLE public.life_journals 
ADD COLUMN IF NOT EXISTS ai_feedback JSONB;
