-- run this in Supabase SQL Editor

-- Create the client_portals table
CREATE TABLE IF NOT EXISTS public.client_portals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES public.onboarding_leads(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    access_token TEXT NOT NULL UNIQUE,
    access_pin TEXT NOT NULL,
    report_url TEXT,
    report_uploaded_at TIMESTAMP WITH TIME ZONE,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'ready', 'viewed'
    payment_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'success', 'failed'
    failed_attempts INT NOT NULL DEFAULT 0,
    is_locked BOOLEAN NOT NULL DEFAULT false,
    last_accessed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for fast lookup
CREATE INDEX IF NOT EXISTS idx_client_portals_access_token ON public.client_portals USING btree (access_token);
CREATE INDEX IF NOT EXISTS idx_client_portals_email ON public.client_portals USING btree (email);

-- Enable RLS
ALTER TABLE public.client_portals ENABLE ROW LEVEL SECURITY;

-- Policy: Admin (service role) can do everything
CREATE POLICY "Admins have full access" ON public.client_portals
    FOR ALL
    USING (auth.role() = 'service_role');

-- Create storage bucket for reports if it doesn't exist (you may need to do this manually in Storage -> New Bucket)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('client-reports', 'client-reports', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for the bucket
-- Allow service_role (Admin) full access to the bucket
CREATE POLICY "Admin CRUD client reports" ON storage.objects
    FOR ALL
    USING (bucket_id = 'client-reports' AND auth.role() = 'service_role');
