-- Add 'remedy' to saved_reports report_type check constraint
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
  END LOOP;
END $$;

ALTER TABLE public.saved_reports
  ADD CONSTRAINT saved_reports_report_type_check
  CHECK (report_type IN (
    'karma_dna',
    'destiny_window',
    'karmic_patterns',
    'royal_roast',
    'remedy'
  ));
