-- ============================================================
-- Promo Codes System
-- Allows bypassing PaymentGate for promotional users.
-- Each code is single-use, tracked with user + timestamp.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.promo_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    credits_granted INTEGER NOT NULL DEFAULT 50,
    used_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fast lookups by code string
CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON public.promo_codes(code);

-- RLS: only service role can insert/read (we use service role key in API)
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;

-- Users cannot read the promo_codes table directly
-- All access is via our server-side API route (service role key)

-- ── Seed 50 unique promotional codes ────────────────────────────────────────
INSERT INTO public.promo_codes (code, credits_granted) VALUES
  ('QK-T627-3VB4', 50),
  ('QK-ED9G-KEGN', 50),
  ('QK-ZQVE-CBDS', 50),
  ('QK-8QH6-FF8N', 50),
  ('QK-3ZK8-9FKX', 50),
  ('QK-YYJ7-VMR9', 50),
  ('QK-6RTQ-HWU2', 50),
  ('QK-S6EM-ZM5Z', 50),
  ('QK-U9ED-3R3L', 50),
  ('QK-87TT-MKNQ', 50),
  ('QK-EMD6-MSE5', 50),
  ('QK-SBCT-S2QX', 50),
  ('QK-4S6V-LFCF', 50),
  ('QK-ANN5-UXLB', 50),
  ('QK-482F-LKQE', 50),
  ('QK-XGHA-8S5C', 50),
  ('QK-E4T7-WYUM', 50),
  ('QK-MAXU-4529', 50),
  ('QK-VSP8-RM85', 50),
  ('QK-RMFU-TCBT', 50),
  ('QK-282M-G596', 50),
  ('QK-KB7L-A7KX', 50),
  ('QK-H4T3-QBGG', 50),
  ('QK-4XZH-BFW2', 50),
  ('QK-33WY-79FY', 50),
  ('QK-48FS-9N6V', 50),
  ('QK-76QQ-SF8J', 50),
  ('QK-4TTE-5ENS', 50),
  ('QK-F555-WZWW', 50),
  ('QK-KAA8-NFVJ', 50),
  ('QK-VKPN-PDXR', 50),
  ('QK-9BNP-GLHJ', 50),
  ('QK-EVD7-M3LZ', 50),
  ('QK-6DNQ-Z426', 50),
  ('QK-YD7D-ZSZ5', 50),
  ('QK-B4LN-TU25', 50),
  ('QK-CPNA-AEYV', 50),
  ('QK-62NL-YRP6', 50),
  ('QK-VFHD-FZDF', 50),
  ('QK-C8YE-FY2M', 50),
  ('QK-QKQM-3DUL', 50),
  ('QK-SM4E-G39V', 50),
  ('QK-QWFF-QY2E', 50),
  ('QK-QNJ4-SLWM', 50),
  ('QK-KNH7-CTBJ', 50),
  ('QK-2CZR-UTYB', 50),
  ('QK-5AS6-3FEY', 50),
  ('QK-M63C-DZK2', 50),
  ('QK-587M-JA9N', 50),
  ('QK-94GV-T7KP', 50)
ON CONFLICT (code) DO NOTHING;
