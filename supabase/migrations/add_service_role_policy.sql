-- Add service-role bypass policy to saved_reports
-- This allows supabaseAdmin (service role) to INSERT/SELECT without RLS interference

CREATE POLICY "Service role full access on saved_reports"
  ON public.saved_reports FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
