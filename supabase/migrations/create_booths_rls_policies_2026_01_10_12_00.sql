-- Enable RLS on booths table
ALTER TABLE public.booths_2026_01_10_12_00 ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to view all booths
CREATE POLICY "view_booths" ON public.booths_2026_01_10_12_00
    FOR SELECT 
    USING (auth.role() = 'authenticated');

-- Policy for authenticated users to insert booths
CREATE POLICY "insert_booths" ON public.booths_2026_01_10_12_00
    FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated');

-- Policy for authenticated users to update booths
CREATE POLICY "update_booths" ON public.booths_2026_01_10_12_00
    FOR UPDATE 
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Policy for authenticated users to delete booths
CREATE POLICY "delete_booths" ON public.booths_2026_01_10_12_00
    FOR DELETE 
    USING (auth.role() = 'authenticated');