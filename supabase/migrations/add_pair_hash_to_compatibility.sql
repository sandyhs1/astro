-- =====================================================================================
-- Migration: add pair_hash to compatibility_reports
-- Purpose : enables the "first-time-only credit deduction" semantics for the
--           Compatibility feature. We charge 5 credits the FIRST time a user
--           generates a report for a given pair of birth-data hashes; any
--           subsequent generation for the same pair (regardless of which
--           partner is "first") is free.
--
-- pair_hash = sha1( min(birthHashA,birthHashB) + ':' + max(birthHashA,birthHashB) )
--
-- Idempotent: safe to run multiple times.
-- =====================================================================================

ALTER TABLE public.compatibility_reports
  ADD COLUMN IF NOT EXISTS pair_hash TEXT;

CREATE INDEX IF NOT EXISTS idx_compatibility_user_pair
  ON public.compatibility_reports (user_id, pair_hash);

COMMENT ON COLUMN public.compatibility_reports.pair_hash IS
  'sha1(sortedBirthHashA + ":" + sortedBirthHashB). Used to detect "we already '
  'generated this exact pair for this user" and skip credit deduction on '
  'subsequent generations.';
