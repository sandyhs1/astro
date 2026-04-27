-- ============================================================
-- Migration: create_plan1_intakes
-- Purpose: Store Plan 1 user intake form submissions so that
--          Dreamlit.ai can watch this table and email
--          sandesh@quantumkarma.tech with each new row.
-- Safe to run multiple times (all statements are idempotent).
-- ============================================================

-- 1. Create the table if it doesn't already exist
CREATE TABLE IF NOT EXISTS public.plan1_intakes (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email          TEXT NOT NULL,
  full_name      TEXT NOT NULL,
  dob            TEXT,
  tob            TEXT,
  pob            TEXT,
  questions      TEXT,
  submitted_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Index on user_id for fast lookups (idempotent)
CREATE INDEX IF NOT EXISTS idx_plan1_intakes_user_id
  ON public.plan1_intakes (user_id);

-- 3. Index on submitted_at for ordered admin queries (idempotent)
CREATE INDEX IF NOT EXISTS idx_plan1_intakes_submitted_at
  ON public.plan1_intakes (submitted_at DESC);

-- 4. Enable Row Level Security
ALTER TABLE public.plan1_intakes ENABLE ROW LEVEL SECURITY;

-- 5. Users can only read their own intake row (DROP first to keep idempotent)
DROP POLICY IF EXISTS "plan1_intakes_select_own" ON public.plan1_intakes;
CREATE POLICY "plan1_intakes_select_own"
  ON public.plan1_intakes
  FOR SELECT
  USING (auth.uid() = user_id);

-- 6. Users can only insert their own intake row (idempotent)
DROP POLICY IF EXISTS "plan1_intakes_insert_own" ON public.plan1_intakes;
CREATE POLICY "plan1_intakes_insert_own"
  ON public.plan1_intakes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 7. Service role bypass — allows server-side API and Dreamlit to read all rows
DROP POLICY IF EXISTS "plan1_intakes_service_role_all" ON public.plan1_intakes;
CREATE POLICY "plan1_intakes_service_role_all"
  ON public.plan1_intakes
  FOR ALL
  USING (auth.role() = 'service_role');

-- 8. Table comments for clarity
COMMENT ON TABLE  public.plan1_intakes IS 'Intake form submissions from Plan 1 (one-time report) users after payment. Watched by Dreamlit.ai to trigger notification email to sandesh@quantumkarma.tech.';
COMMENT ON COLUMN public.plan1_intakes.questions IS 'Free-text questions the user wants analyzed in their report.';
