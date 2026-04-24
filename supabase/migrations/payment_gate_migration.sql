-- Payment Gate Migration
-- Run this in Supabase → SQL Editor
-- Adds payment fields to user_profiles

ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS plan_type          TEXT    DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS payment_status     TEXT    DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS razorpay_order_id  TEXT    DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS subscription_id    TEXT    DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS paid_at            TIMESTAMPTZ DEFAULT NULL;

-- Index for fast payment status lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_payment_status
  ON public.user_profiles (payment_status);

-- Index for subscription lookups (Plan 2 monthly renewal)
CREATE INDEX IF NOT EXISTS idx_user_profiles_subscription_id
  ON public.user_profiles (subscription_id);

COMMENT ON COLUMN public.user_profiles.plan_type IS 'plan1 = one-time report, plan2 = monthly AI credits';
COMMENT ON COLUMN public.user_profiles.payment_status IS 'null = unpaid, pending, success, failed';
COMMENT ON COLUMN public.user_profiles.subscription_id IS 'Razorpay subscription ID for Plan 2 monthly billing';
