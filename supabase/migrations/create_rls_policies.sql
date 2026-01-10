-- Enable RLS on all tables
ALTER TABLE countries_2026_01_10 ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings_2026_01_10 ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients_2026_01_10 ENABLE ROW LEVEL SECURITY;
ALTER TABLE exhibition_managers_2026_01_10 ENABLE ROW LEVEL SECURITY;
ALTER TABLE exhibitions_2026_01_10 ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsorship_packages_2026_01_10 ENABLE ROW LEVEL SECURITY;
ALTER TABLE booths_2026_01_10 ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals_2026_01_10 ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_schedules_2026_01_10 ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions_2026_01_10 ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users (simple approach)
-- Countries - read only for all authenticated users
CREATE POLICY "Countries are viewable by authenticated users" ON countries_2026_01_10
    FOR SELECT USING (auth.role() = 'authenticated');

-- System settings - read only for authenticated users
CREATE POLICY "System settings are viewable by authenticated users" ON system_settings_2026_01_10
    FOR SELECT USING (auth.role() = 'authenticated');

-- Clients - full access for authenticated users
CREATE POLICY "Clients are manageable by authenticated users" ON clients_2026_01_10
    FOR ALL USING (auth.role() = 'authenticated');

-- Exhibition managers - read only for authenticated users
CREATE POLICY "Exhibition managers are viewable by authenticated users" ON exhibition_managers_2026_01_10
    FOR SELECT USING (auth.role() = 'authenticated');

-- Exhibitions - full access for authenticated users
CREATE POLICY "Exhibitions are manageable by authenticated users" ON exhibitions_2026_01_10
    FOR ALL USING (auth.role() = 'authenticated');

-- Sponsorship packages - full access for authenticated users
CREATE POLICY "Sponsorship packages are manageable by authenticated users" ON sponsorship_packages_2026_01_10
    FOR ALL USING (auth.role() = 'authenticated');

-- Booths - full access for authenticated users
CREATE POLICY "Booths are manageable by authenticated users" ON booths_2026_01_10
    FOR ALL USING (auth.role() = 'authenticated');

-- Deals - full access for authenticated users
CREATE POLICY "Deals are manageable by authenticated users" ON deals_2026_01_10
    FOR ALL USING (auth.role() = 'authenticated');

-- Payment schedules - full access for authenticated users
CREATE POLICY "Payment schedules are manageable by authenticated users" ON payment_schedules_2026_01_10
    FOR ALL USING (auth.role() = 'authenticated');

-- Commissions - full access for authenticated users
CREATE POLICY "Commissions are manageable by authenticated users" ON commissions_2026_01_10
    FOR ALL USING (auth.role() = 'authenticated');