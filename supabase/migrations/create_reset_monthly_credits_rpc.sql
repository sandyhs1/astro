-- Create an RPC function to reliably reset monthly credits
-- Active Plan 2 users get 50 credits.
-- Everyone else gets 0 credits.

CREATE OR REPLACE FUNCTION public.reset_monthly_credits()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE public.user_profiles
  SET credits = CASE
    WHEN plan_type = 'plan2' AND payment_status = 'success' THEN 50
    ELSE 0
  END;
$$;
