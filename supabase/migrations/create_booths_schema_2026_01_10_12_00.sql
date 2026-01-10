-- Create booths table for booth management
CREATE TABLE IF NOT EXISTS public.booths_2026_01_10_12_00 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booth_number VARCHAR(50) NOT NULL,
    booth_code VARCHAR(100) NOT NULL UNIQUE,
    exhibition_id UUID REFERENCES public.exhibitions_2026_01_10_12_00(id) ON DELETE SET NULL,
    expo_name VARCHAR(255),
    hall VARCHAR(100),
    zone VARCHAR(100),
    aisle VARCHAR(100),
    position VARCHAR(100),
    booth_type VARCHAR(50) NOT NULL DEFAULT 'Standard',
    size_sqm DECIMAL(10,2) NOT NULL,
    width_m DECIMAL(8,2),
    length_m DECIMAL(8,2),
    height_m DECIMAL(8,2),
    status VARCHAR(50) NOT NULL DEFAULT 'Available',
    availability_start TIMESTAMP WITH TIME ZONE,
    availability_end TIMESTAMP WITH TIME ZONE,
    base_price DECIMAL(12,2) NOT NULL DEFAULT 0,
    additional_costs DECIMAL(12,2) DEFAULT 0,
    total_price DECIMAL(12,2) GENERATED ALWAYS AS (base_price + COALESCE(additional_costs, 0)) STORED,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    assigned_to_company VARCHAR(255),
    assigned_to_contact VARCHAR(255),
    assigned_to_email VARCHAR(255),
    assigned_to_phone VARCHAR(50),
    client_id UUID REFERENCES public.clients_2026_01_10_12_00(id) ON DELETE SET NULL,
    features JSONB DEFAULT '[]'::jsonb,
    amenities JSONB DEFAULT '{}'::jsonb,
    power_supply VARCHAR(100),
    internet_access BOOLEAN DEFAULT false,
    water_supply BOOLEAN DEFAULT false,
    compressed_air BOOLEAN DEFAULT false,
    description TEXT,
    notes TEXT,
    special_requirements TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_booths_booth_number ON public.booths_2026_01_10_12_00(booth_number);
CREATE INDEX IF NOT EXISTS idx_booths_booth_code ON public.booths_2026_01_10_12_00(booth_code);
CREATE INDEX IF NOT EXISTS idx_booths_exhibition_id ON public.booths_2026_01_10_12_00(exhibition_id);
CREATE INDEX IF NOT EXISTS idx_booths_status ON public.booths_2026_01_10_12_00(status);
CREATE INDEX IF NOT EXISTS idx_booths_booth_type ON public.booths_2026_01_10_12_00(booth_type);
CREATE INDEX IF NOT EXISTS idx_booths_client_id ON public.booths_2026_01_10_12_00(client_id);
CREATE INDEX IF NOT EXISTS idx_booths_created_at ON public.booths_2026_01_10_12_00(created_at);

-- Insert sample booth data
INSERT INTO public.booths_2026_01_10_12_00 (
    booth_number, booth_code, exhibition_id, expo_name, hall, zone, aisle, position,
    booth_type, size_sqm, width_m, length_m, height_m, status,
    base_price, additional_costs, currency,
    assigned_to_company, assigned_to_contact, assigned_to_email, assigned_to_phone,
    features, power_supply, internet_access, water_supply, compressed_air,
    description, notes, created_by
) VALUES 
-- Green Life Expo 2024 Booths
('A001', 'GLE2024-A001', 
 (SELECT id FROM public.exhibitions_2026_01_10_12_00 WHERE name = 'Green Life Expo 2024' LIMIT 1),
 'Green Life Expo 2024', 'Hall A', 'Zone 1', 'A1', 'Corner',
 'Premium', 100.00, 10.00, 10.00, 4.00, 'Booked',
 5000.00, 500.00, 'USD',
 'EcoTech Solutions', 'John Smith', 'john.smith@ecotech.com', '+1-555-0101',
 '["Premium Location", "Corner Booth", "High Traffic Area"]'::jsonb,
 '220V/16A', true, false, false,
 'Premium corner booth with high visibility and foot traffic',
 'Client very satisfied with location. Requires custom booth design.',
 'system'),

('A002', 'GLE2024-A002',
 (SELECT id FROM public.exhibitions_2026_01_10_12_00 WHERE name = 'Green Life Expo 2024' LIMIT 1),
 'Green Life Expo 2024', 'Hall A', 'Zone 1', 'A1', 'Standard',
 'Standard', 50.00, 5.00, 10.00, 3.50, 'Reserved',
 2500.00, 250.00, 'USD',
 'Green Energy Alliance', 'Sarah Johnson', 'sarah.johnson@greenenergy.com', '+1-555-0102',
 '["Standard Location", "Good Visibility"]'::jsonb,
 '220V/10A', true, false, false,
 'Standard booth with good location and visibility',
 'Waiting for final confirmation from client.',
 'system'),

('A003', 'GLE2024-A003',
 (SELECT id FROM public.exhibitions_2026_01_10_12_00 WHERE name = 'Green Life Expo 2024' LIMIT 1),
 'Green Life Expo 2024', 'Hall A', 'Zone 2', 'A2', 'Standard',
 'Standard', 36.00, 6.00, 6.00, 3.00, 'Available',
 1800.00, 0.00, 'USD',
 NULL, NULL, NULL, NULL,
 '["Standard Location"]'::jsonb,
 '220V/10A', true, false, false,
 'Standard booth in good location',
 NULL,
 'system'),

-- Tech Innovation Summit 2024 Booths
('B001', 'TIS2024-B001',
 (SELECT id FROM public.exhibitions_2026_01_10_12_00 WHERE name = 'Tech Innovation Summit 2024' LIMIT 1),
 'Tech Innovation Summit 2024', 'Hall B', 'Zone 2', 'B1', 'Center',
 'Island', 200.00, 10.00, 20.00, 5.00, 'Available',
 8000.00, 800.00, 'USD',
 NULL, NULL, NULL, NULL,
 '["Island Booth", "360° Access", "Premium Location"]'::jsonb,
 '380V/32A', true, true, true,
 'Large island booth with 360-degree access and premium location',
 'Perfect for large tech companies with extensive displays.',
 'system'),

('B002', 'TIS2024-B002',
 (SELECT id FROM public.exhibitions_2026_01_10_12_00 WHERE name = 'Tech Innovation Summit 2024' LIMIT 1),
 'Tech Innovation Summit 2024', 'Hall B', 'Zone 2', 'B2', 'Corner',
 'Corner', 75.00, 7.50, 10.00, 4.00, 'Available',
 3750.00, 375.00, 'USD',
 NULL, NULL, NULL, NULL,
 '["Corner Location", "Two Open Sides", "Good Traffic"]'::jsonb,
 '220V/16A', true, false, false,
 'Corner booth with two open sides and good foot traffic',
 NULL,
 'system'),

('B003', 'TIS2024-B003',
 (SELECT id FROM public.exhibitions_2026_01_10_12_00 WHERE name = 'Tech Innovation Summit 2024' LIMIT 1),
 'Tech Innovation Summit 2024', 'Hall B', 'Zone 1', 'B3', 'Standard',
 'Standard', 48.00, 6.00, 8.00, 3.50, 'Reserved',
 2400.00, 200.00, 'USD',
 'Innovation Corp', 'Michael Chen', 'michael.chen@innovation.com', '+1-555-0103',
 '["Standard Location", "Good Access"]'::jsonb,
 '220V/10A', true, false, false,
 'Standard booth with good access and visibility',
 'Client requested additional power outlets.',
 'system'),

-- Additional booths for variety
('C001', 'SFC2024-C001', NULL, 'Sustainable Future Conference', 'Hall C', 'Zone 3', 'C1', 'Peninsula',
 'Peninsula', 150.00, 10.00, 15.00, 4.50, 'Maintenance',
 6000.00, 600.00, 'USD',
 NULL, NULL, NULL, NULL,
 '["Peninsula Booth", "Three Open Sides", "High Visibility"]'::jsonb,
 '220V/25A', true, true, false,
 'Peninsula booth under maintenance - three open sides with high visibility',
 'Scheduled maintenance for electrical systems. Will be available next week.',
 'system'),

('C002', 'SFC2024-C002', NULL, 'Sustainable Future Conference', 'Hall C', 'Zone 3', 'C2', 'Standard',
 'Custom', 120.00, 8.00, 15.00, 6.00, 'Occupied',
 4800.00, 1200.00, 'USD',
 'Sustainable Systems Inc', 'Emily Rodriguez', 'emily.rodriguez@sustainable.com', '+1-555-0104',
 '["Custom Design", "Extra Height", "Special Requirements"]'::jsonb,
 '380V/25A', true, true, true,
 'Custom booth with special height requirements and full utilities',
 'Client has specific branding requirements. Custom build completed.',
 'system'),

('D001', 'EXPO2024-D001', NULL, 'General Exhibition', 'Hall D', 'Zone 4', 'D1', 'Standard',
 'Inline', 30.00, 5.00, 6.00, 3.00, 'Unavailable',
 1500.00, 0.00, 'USD',
 NULL, NULL, NULL, NULL,
 '["Basic Location"]'::jsonb,
 '220V/10A', false, false, false,
 'Basic inline booth - currently unavailable due to structural issues',
 'Structural assessment required before next use.',
 'system'),

('D002', 'EXPO2024-D002', NULL, 'General Exhibition', 'Hall D', 'Zone 4', 'D2', 'Standard',
 'Premium', 80.00, 8.00, 10.00, 4.00, 'Available',
 4000.00, 400.00, 'USD',
 NULL, NULL, NULL, NULL,
 '["Premium Features", "Enhanced Location", "High Traffic"]'::jsonb,
 '220V/20A', true, false, true,
 'Premium booth with enhanced features and high foot traffic location',
 'Recently upgraded with new electrical systems.',
 'system');

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_booths_updated_at 
    BEFORE UPDATE ON public.booths_2026_01_10_12_00 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();