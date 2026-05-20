-- =====================================================================================
-- Migration: add per-feature breakdown columns to usage logs
-- Purpose : let the Admin dashboard show, for every user, a row per feature
--           (Karma DNA, Year Ahead, Royal Roast, Core Horoscope PDF, …) with
--           tokens-in, tokens-out, INR cost, credits charged.
--
-- Tables affected:
--   public.token_usage_logs  — for LLM-backed reports (10 of 12)
--   public.astroapi_logs     — for AstrologyAPI calls + PDF reports (Core / Pro)
--
-- Columns are added with IF NOT EXISTS so the migration is idempotent and safe
-- to run on a database that already has any of these columns from earlier
-- ad-hoc edits (`credits_used`, `question_preview`, `usage_type`).
-- =====================================================================================

-- ── token_usage_logs ────────────────────────────────────────────────────────────────
ALTER TABLE public.token_usage_logs
  ADD COLUMN IF NOT EXISTS credits_used     INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS question_preview TEXT,
  ADD COLUMN IF NOT EXISTS usage_type       TEXT DEFAULT 'user',
  ADD COLUMN IF NOT EXISTS feature          TEXT;

COMMENT ON COLUMN public.token_usage_logs.feature IS
  'Stable feature key for admin grouping. Allowed values: '
  'karma_dna | karmic_patterns | your_purpose | year_ahead | royal_roast | '
  'remedy | your_gotra | ishta_devata | nakshatra_ascendant | core_horoscope | '
  'professional_horoscope | chat | other';

CREATE INDEX IF NOT EXISTS idx_token_usage_logs_feature
  ON public.token_usage_logs(feature);

CREATE INDEX IF NOT EXISTS idx_token_usage_logs_user_feature
  ON public.token_usage_logs(user_id, feature);

-- ── astroapi_logs ───────────────────────────────────────────────────────────────────
ALTER TABLE public.astroapi_logs
  ADD COLUMN IF NOT EXISTS feature TEXT;

COMMENT ON COLUMN public.astroapi_logs.feature IS
  'Stable feature key. Same vocabulary as token_usage_logs.feature. '
  'For chart-prep batches use NULL or "chart_prep". For PDF endpoints use '
  '"core_horoscope" or "professional_horoscope".';

CREATE INDEX IF NOT EXISTS idx_astroapi_logs_feature
  ON public.astroapi_logs(feature);

CREATE INDEX IF NOT EXISTS idx_astroapi_logs_user_feature
  ON public.astroapi_logs(user_id, feature);

-- ── Best-effort backfill of existing rows from question_preview ─────────────────────
-- Only updates rows where feature is still NULL, so re-running is safe.
UPDATE public.token_usage_logs SET feature = 'karma_dna'
  WHERE feature IS NULL AND question_preview ILIKE 'Karma DNA%';
UPDATE public.token_usage_logs SET feature = 'karmic_patterns'
  WHERE feature IS NULL AND question_preview ILIKE 'Karmic Patterns%';
UPDATE public.token_usage_logs SET feature = 'royal_roast'
  WHERE feature IS NULL AND question_preview ILIKE 'Royal Roast%';
UPDATE public.token_usage_logs SET feature = 'remedy'
  WHERE feature IS NULL AND question_preview ILIKE 'Remedy%';
UPDATE public.token_usage_logs SET feature = 'your_gotra'
  WHERE feature IS NULL AND question_preview ILIKE 'Gotra Report%';
UPDATE public.token_usage_logs SET feature = 'ishta_devata'
  WHERE feature IS NULL AND question_preview ILIKE 'Ishta Devata%';
-- Anything else that already has a question_preview but no feature → "chat"
UPDATE public.token_usage_logs SET feature = 'chat'
  WHERE feature IS NULL AND question_preview IS NOT NULL;
