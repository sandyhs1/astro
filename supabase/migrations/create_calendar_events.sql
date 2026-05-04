-- ============================================================================
-- Vedic Calendar Events table + Day Scores history
-- Run ONCE in Supabase SQL Editor
-- ============================================================================

-- Calendar Events
CREATE TABLE IF NOT EXISTS public.calendar_events (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  profile_id   UUID,
  title        TEXT NOT NULL,
  event_type   TEXT DEFAULT 'general',
  event_date   DATE NOT NULL,
  start_time   TIME,
  end_time     TIME,
  choghadiya   TEXT,
  hora_lord    TEXT,
  muhurat_grade TEXT,
  notes        TEXT,
  color        TEXT DEFAULT '#6366F1',
  google_synced BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own events" ON public.calendar_events
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Service role bypass calendar" ON public.calendar_events
  FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE INDEX IF NOT EXISTS idx_calendar_events_user_date
  ON public.calendar_events(user_id, event_date);

-- Day Scores (auspiciousness history)
CREATE TABLE IF NOT EXISTS public.day_scores (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  profile_id UUID,
  score_date DATE NOT NULL,
  score      INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  nakshatra  TEXT,
  choghadiya TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, profile_id, score_date)
);
ALTER TABLE public.day_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own scores" ON public.day_scores
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Service role bypass scores" ON public.day_scores
  FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE INDEX IF NOT EXISTS idx_day_scores_user_date
  ON public.day_scores(user_id, score_date DESC);
