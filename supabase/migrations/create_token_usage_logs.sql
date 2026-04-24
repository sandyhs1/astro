-- Create the token_usage_logs table
CREATE TABLE IF NOT EXISTS public.token_usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    model_name TEXT NOT NULL,
    input_tokens INTEGER DEFAULT 0,
    output_tokens INTEGER DEFAULT 0,
    total_tokens INTEGER DEFAULT 0,
    cost_inr NUMERIC(10, 6) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Allow admins to read all logs, allow authenticated users to read their own logs (if needed)
ALTER TABLE public.token_usage_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own token logs" 
    ON public.token_usage_logs FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own token logs" 
    ON public.token_usage_logs FOR SELECT 
    USING (auth.uid() = user_id);

-- Optional: If you want a specific admin policy based on user_profiles.role
CREATE POLICY "Admins can read all token logs" 
    ON public.token_usage_logs FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );
