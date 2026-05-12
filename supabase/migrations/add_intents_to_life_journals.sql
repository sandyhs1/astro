-- Migration: add_intents_to_life_journals
-- Description: Adds a JSONB column to store Deepgram Intent Recognition results
--              per journal entry. Each entry is an array of detected intent strings.

ALTER TABLE public.life_journals
  ADD COLUMN IF NOT EXISTS intents JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.life_journals.intents IS
  'Array of intent strings detected by Deepgram Intent Recognition (e.g. ["seek support", "express frustration"])';
