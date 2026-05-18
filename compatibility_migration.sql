-- =====================================================================================
-- Migration: B2C Compatibility Feature (v2 — adds match-endpoint cache)
-- Description: Per-user compatibility reports + a pair-hash cache for the
--              AstrologyAPI match_* endpoints (Ashtakoota, Manglik, Obstructions,
--              Dashakoota, Percentage). Re-running this is safe.
-- Run this in the Supabase SQL Editor.
-- =====================================================================================

-- ─── 1. compatibility_reports ───────────────────────────────────────────────────────
-- Each row = one generated compatibility report between two people.
CREATE TABLE IF NOT EXISTS public.compatibility_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Each partner: { name, dob, tob, pob, gender, lat, lon, timezone }
    partner1 JSONB NOT NULL,
    partner2 JSONB NOT NULL,

    -- Generated markdown report
    report_markdown TEXT NOT NULL,

    -- Verified deterministic metrics from AstrologyAPI match_* endpoints
    -- (Ashtakoota score, Manglik status, obstructions, percentage, dashakoota, etc.)
    metrics JSONB,

    -- Model attribution + cost tracking
    model TEXT,
    tokens_in  INTEGER DEFAULT 0,
    tokens_out INTEGER DEFAULT 0,

    created_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL
);

-- If the table already existed without `metrics`, add the column safely.
ALTER TABLE public.compatibility_reports
    ADD COLUMN IF NOT EXISTS metrics JSONB;

-- Fast lookup of a user's report archive, newest first
CREATE INDEX IF NOT EXISTS idx_compatibility_reports_user
    ON public.compatibility_reports (user_id, created_at DESC);

-- Enable RLS
ALTER TABLE public.compatibility_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own compatibility reports" ON public.compatibility_reports;
CREATE POLICY "Users manage own compatibility reports"
    ON public.compatibility_reports
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role manages compatibility reports" ON public.compatibility_reports;
CREATE POLICY "Service role manages compatibility reports"
    ON public.compatibility_reports
    FOR ALL
    USING (auth.role() = 'service_role');


-- ─── 2. match_cache ─────────────────────────────────────────────────────────────────
-- Pair-hash → cached AstrologyAPI match_* responses.
-- pair_hash is sorted(birthHashA, birthHashB) joined with "::".
-- Same pair (regardless of which partner is "first") always hits the same cache row.
CREATE TABLE IF NOT EXISTS public.match_cache (
    pair_hash TEXT PRIMARY KEY,

    -- Raw responses from AstrologyAPI keyed by endpoint short name
    -- ('ashtakoot', 'manglik', 'obstructions', 'dashakoot', 'percentage')
    payload JSONB NOT NULL,

    created_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL
);

-- This table is server-only (service role writes). Lock down RLS.
ALTER TABLE public.match_cache ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role manages match_cache" ON public.match_cache;
CREATE POLICY "Service role manages match_cache"
    ON public.match_cache
    FOR ALL
    USING (auth.role() = 'service_role');
