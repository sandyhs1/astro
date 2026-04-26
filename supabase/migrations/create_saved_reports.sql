-- Create the saved_reports table to persist generated features
CREATE TABLE IF NOT EXISTS public.saved_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES public.family_profiles(id) ON DELETE CASCADE,
    report_type TEXT NOT NULL CHECK (report_type IN ('karma_dna', 'destiny_window')),
    content JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster lookups when querying a specific user's report for a specific profile
CREATE INDEX IF NOT EXISTS idx_saved_reports_lookup 
ON public.saved_reports(user_id, profile_id, report_type);

-- Allow authenticated users to read their own reports
ALTER TABLE public.saved_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own reports" 
    ON public.saved_reports FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own reports" 
    ON public.saved_reports FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own reports" 
    ON public.saved_reports FOR UPDATE
    USING (auth.uid() = user_id);

-- Optional Admin policy
CREATE POLICY "Admins can read all reports" 
    ON public.saved_reports FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );
