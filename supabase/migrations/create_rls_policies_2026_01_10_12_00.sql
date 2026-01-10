-- Create RLS policies for deals management tables
-- Current time: 2026-01-10 12:00 UTC

-- Enable RLS on all tables
ALTER TABLE public.clients_2026_01_10_12_00 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exhibitions_2026_01_10_12_00 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals_2026_01_10_12_00 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks_2026_01_10_12_00 ENABLE ROW LEVEL SECURITY;

-- Clients policies - Allow authenticated users to read and manage clients
CREATE POLICY "Allow authenticated users to view clients" ON public.clients_2026_01_10_12_00
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert clients" ON public.clients_2026_01_10_12_00
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update clients" ON public.clients_2026_01_10_12_00
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete clients" ON public.clients_2026_01_10_12_00
    FOR DELETE USING (auth.role() = 'authenticated');

-- Exhibitions policies - Allow authenticated users to read and manage exhibitions
CREATE POLICY "Allow authenticated users to view exhibitions" ON public.exhibitions_2026_01_10_12_00
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert exhibitions" ON public.exhibitions_2026_01_10_12_00
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update exhibitions" ON public.exhibitions_2026_01_10_12_00
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete exhibitions" ON public.exhibitions_2026_01_10_12_00
    FOR DELETE USING (auth.role() = 'authenticated');

-- Deals policies - Allow authenticated users to read and manage deals
CREATE POLICY "Allow authenticated users to view deals" ON public.deals_2026_01_10_12_00
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert deals" ON public.deals_2026_01_10_12_00
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update deals" ON public.deals_2026_01_10_12_00
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete deals" ON public.deals_2026_01_10_12_00
    FOR DELETE USING (auth.role() = 'authenticated');

-- Tasks policies - Allow authenticated users to read and manage tasks
CREATE POLICY "Allow authenticated users to view tasks" ON public.tasks_2026_01_10_12_00
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert tasks" ON public.tasks_2026_01_10_12_00
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update tasks" ON public.tasks_2026_01_10_12_00
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete tasks" ON public.tasks_2026_01_10_12_00
    FOR DELETE USING (auth.role() = 'authenticated');