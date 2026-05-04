-- ============================================================================
-- PERMANENT FIX: saved_reports table — all report types + B2B support
-- Run this ONCE in Supabase SQL editor
-- ============================================================================

-- STEP 1: Drop ALL existing check constraints on report_type
-- (PostgreSQL sometimes auto-generates names like saved_reports_report_type_check1)
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT con.conname
    FROM pg_constraint con
    JOIN pg_class rel ON rel.oid = con.conrelid
    JOIN pg_namespace ns ON ns.oid = rel.relnamespace
    WHERE ns.nspname = 'public'
      AND rel.relname = 'saved_reports'
      AND con.contype = 'c'
      AND pg_get_constraintdef(con.oid) LIKE '%report_type%'
  LOOP
    EXECUTE format('ALTER TABLE public.saved_reports DROP CONSTRAINT IF EXISTS %I', r.conname);
    RAISE NOTICE 'Dropped constraint: %', r.conname;
  END LOOP;
END $$;

-- STEP 2: Re-add constraint with ALL current and future report types
-- Add any new report types here as the product grows
ALTER TABLE public.saved_reports
  ADD CONSTRAINT saved_reports_report_type_check
  CHECK (report_type IN (
    'karma_dna',
    'destiny_window',
    'karmic_patterns',
    'royal_roast'       -- Added: was missing, caused all Royal Roast saves to fail silently
  ));

-- STEP 3: Make profile_id nullable and remove the FK constraint to family_profiles
-- Reason: B2B clients live in astrologer_clients table, NOT family_profiles.
-- The FK was causing every B2B save to fail with a foreign key violation.
ALTER TABLE public.saved_reports
  ALTER COLUMN profile_id DROP NOT NULL;

-- Drop FK to family_profiles (if it exists)
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT con.conname
    FROM pg_constraint con
    JOIN pg_class rel ON rel.oid = con.conrelid
    JOIN pg_namespace ns ON ns.oid = rel.relnamespace
    WHERE ns.nspname = 'public'
      AND rel.relname = 'saved_reports'
      AND con.contype = 'f'
      AND pg_get_constraintdef(con.oid) LIKE '%profile_id%'
  LOOP
    EXECUTE format('ALTER TABLE public.saved_reports DROP CONSTRAINT IF EXISTS %I', r.conname);
    RAISE NOTICE 'Dropped FK constraint: %', r.conname;
  END LOOP;
END $$;

-- STEP 4: Add a separate nullable column for B2B client source tracking
-- This lets us query by client ID without breaking the family_profiles FK
ALTER TABLE public.saved_reports
  ADD COLUMN IF NOT EXISTS client_id UUID;   -- astrologer_clients.id for B2B reports

-- STEP 5: Add composite index for fast lookups (user + profile + type)
DROP INDEX IF EXISTS idx_saved_reports_lookup;
CREATE INDEX IF NOT EXISTS idx_saved_reports_lookup
  ON public.saved_reports(user_id, profile_id, report_type);

CREATE INDEX IF NOT EXISTS idx_saved_reports_client_lookup
  ON public.saved_reports(user_id, client_id, report_type);

-- STEP 6: Ensure service role bypass policy exists (allows supabaseAdmin to insert/select)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'saved_reports'
      AND policyname = 'Service role full access on saved_reports'
  ) THEN
    CREATE POLICY "Service role full access on saved_reports"
      ON public.saved_reports FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
    RAISE NOTICE 'Service role policy created';
  ELSE
    RAISE NOTICE 'Service role policy already exists — skipped';
  END IF;
END $$;

-- STEP 7: Verify the final state
SELECT
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'saved_reports'
ORDER BY ordinal_position;

SELECT conname, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'public.saved_reports'::regclass
ORDER BY contype;
