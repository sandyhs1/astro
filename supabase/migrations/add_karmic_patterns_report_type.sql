-- Migration: Add 'karmic_patterns' to the saved_reports report_type constraint
-- Robust version — handles auto-generated constraint names and orphan rows.

-- Step 1: Dynamically find and drop ALL check constraints on report_type
-- (PostgreSQL auto-generates names like saved_reports_report_type_check1 etc.)
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

-- Step 2: Remove any rows whose report_type is not in the new valid set
-- (safety net — these rows would block adding the constraint)
DELETE FROM public.saved_reports
WHERE report_type NOT IN ('karma_dna', 'destiny_window', 'karmic_patterns');

-- Step 3: Re-add the constraint with all three valid types
ALTER TABLE public.saved_reports
  ADD CONSTRAINT saved_reports_report_type_check
  CHECK (report_type IN ('karma_dna', 'destiny_window', 'karmic_patterns'));
