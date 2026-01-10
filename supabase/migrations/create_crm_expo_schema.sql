-- CRM Expo Management System Database Schema
-- Created: 2026-01-10

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Countries table for dropdown
CREATE TABLE countries_2026_01_10 (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(3) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert common countries
INSERT INTO countries_2026_01_10 (name, code) VALUES
('United States', 'USA'),
('United Kingdom', 'GBR'),
('Germany', 'DEU'),
('France', 'FRA'),
('Italy', 'ITA'),
('Spain', 'ESP'),
('Canada', 'CAN'),
('Australia', 'AUS'),
('Japan', 'JPN'),
('China', 'CHN'),
('India', 'IND'),
('Brazil', 'BRA'),
('Mexico', 'MEX'),
('Netherlands', 'NLD'),
('Switzerland', 'CHE'),
('Sweden', 'SWE'),
('Norway', 'NOR'),
('Denmark', 'DNK'),
('Finland', 'FIN'),
('Belgium', 'BEL'),
('Austria', 'AUT'),
('Poland', 'POL'),
('Czech Republic', 'CZE'),
('Hungary', 'HUN'),
('Portugal', 'PRT'),
('Greece', 'GRC'),
('Turkey', 'TUR'),
('Russia', 'RUS'),
('South Korea', 'KOR'),
('Singapore', 'SGP'),
('Malaysia', 'MYS'),
('Thailand', 'THA'),
('Indonesia', 'IDN'),
('Philippines', 'PHL'),
('Vietnam', 'VNM'),
('South Africa', 'ZAF'),
('Egypt', 'EGY'),
('UAE', 'ARE'),
('Saudi Arabia', 'SAU'),
('Israel', 'ISR'),
('New Zealand', 'NZL'),
('Ireland', 'IRL'),
('Luxembourg', 'LUX'),
('Iceland', 'ISL'),
('Chile', 'CHL'),
('Argentina', 'ARG'),
('Colombia', 'COL'),
('Peru', 'PER'),
('Venezuela', 'VEN'),
('Ecuador', 'ECU'),
('Uruguay', 'URY'),
('Paraguay', 'PRY');

-- System settings table
CREATE TABLE system_settings_2026_01_10 (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT NOT NULL,
    setting_type VARCHAR(50) NOT NULL DEFAULT 'string',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default system settings
INSERT INTO system_settings_2026_01_10 (setting_key, setting_value, setting_type, description) VALUES
('default_currency', 'EGP', 'string', 'Default currency for the system'),
('date_format', 'DD/MM/YYYY', 'string', 'Default date format'),
('time_format', '24h', 'string', 'Default time format (12h or 24h)'),
('client_types', '["Sponsor", "Exhibitor", "Media Partner"]', 'json', 'Available client types'),
('industries', '["Food & Beverage", "Beauty & Wellness", "Home & Design", "Green Manufacturing"]', 'json', 'Available industries'),
('company_sizes', '["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"]', 'json', 'Company size ranges'),
('exhibition_statuses', '["Planning", "Registration Open", "Active", "Completed", "Cancelled", "Postponed"]', 'json', 'Exhibition status options'),
('booth_types', '["Standard", "Premium", "Corner", "Island", "Custom", "Inline"]', 'json', 'Booth type options'),
('booth_statuses', '["Available", "Reserved", "Booked", "Occupied", "Maintenance"]', 'json', 'Booth status options'),
('booth_availability', '["Open", "Restricted", "VIP Only", "Premium"]', 'json', 'Booth availability options'),
('deal_types', '["Booth", "Sponsorship", "Custom", "Other"]', 'json', 'Deal type options'),
('deal_priorities', '["Low", "Medium", "High"]', 'json', 'Deal priority options'),
('deal_stages', '["Talking", "Meeting Scheduled", "Strategy Proposal", "Objection Handling", "Terms Finalized", "Contract Sent"]', 'json', 'Deal stage options'),
('payment_methods', '["Cash", "Bank Transfer", "Credit Card", "Check", "Online Payment"]', 'json', 'Payment method options'),
('payment_plans', '["Full Payment", "Installments"]', 'json', 'Payment plan options'),
('payment_statuses', '["Pending", "Collected", "Cancelled", "Refunded"]', 'json', 'Payment status options');

-- Clients table
CREATE TABLE clients_2026_01_10 (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_name VARCHAR(255) NOT NULL,
    client_type VARCHAR(50) NOT NULL,
    contact_person VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    website VARCHAR(255),
    industry VARCHAR(100),
    company_size VARCHAR(50),
    address TEXT,
    country_id UUID REFERENCES countries_2026_01_10(id),
    city VARCHAR(100),
    notes TEXT,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exhibition managers table
CREATE TABLE exhibition_managers_2026_01_10 (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    department VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default exhibition managers
INSERT INTO exhibition_managers_2026_01_10 (name, email, phone, department) VALUES
('Ahmed Hassan', 'ahmed.hassan@space.com', '+20-100-123-4567', 'Exhibition Management'),
('Sarah Mohamed', 'sarah.mohamed@space.com', '+20-100-234-5678', 'Operations'),
('Omar Ali', 'omar.ali@space.com', '+20-100-345-6789', 'Client Relations'),
('Fatima Ibrahim', 'fatima.ibrahim@space.com', '+20-100-456-7890', 'Marketing');

-- Exhibitions table
CREATE TABLE exhibitions_2026_01_10 (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exhibition_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    exhibition_manager_id UUID REFERENCES exhibition_managers_2026_01_10(id),
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    registration_start DATE,
    registration_end DATE,
    venue_name VARCHAR(255),
    venue_capacity INTEGER,
    venue_address TEXT,
    venue_city VARCHAR(100),
    venue_country_id UUID REFERENCES countries_2026_01_10(id),
    total_area_sqm DECIMAL(10,2),
    expected_visitors INTEGER,
    website_url VARCHAR(255),
    organizer_name VARCHAR(255),
    organizer_email VARCHAR(255),
    organizer_phone VARCHAR(50),
    additional_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sponsorship packages table
CREATE TABLE sponsorship_packages_2026_01_10 (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exhibition_id UUID REFERENCES exhibitions_2026_01_10(id) ON DELETE CASCADE,
    package_name VARCHAR(255) NOT NULL,
    package_tier VARCHAR(50) NOT NULL,
    price DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EGP',
    benefits TEXT,
    description TEXT,
    max_sponsors INTEGER DEFAULT 1,
    current_sponsors INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Booths table
CREATE TABLE booths_2026_01_10 (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booth_code VARCHAR(50) NOT NULL,
    exhibition_id UUID REFERENCES exhibitions_2026_01_10(id) ON DELETE CASCADE,
    booth_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    availability VARCHAR(50) NOT NULL,
    description TEXT,
    hall VARCHAR(100),
    aisle VARCHAR(100),
    sector VARCHAR(100),
    category VARCHAR(100),
    size_sqm DECIMAL(10,2) NOT NULL,
    width_m DECIMAL(8,2),
    length_m DECIMAL(8,2),
    height_m DECIMAL(8,2),
    price_per_sqm DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(15,2) GENERATED ALWAYS AS (size_sqm * price_per_sqm) STORED,
    currency VARCHAR(3) DEFAULT 'EGP',
    special_requirements TEXT,
    additional_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(exhibition_id, booth_code)
);

-- Deals table
CREATE TABLE deals_2026_01_10 (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deal_title VARCHAR(255) NOT NULL,
    deal_type VARCHAR(50) NOT NULL,
    priority VARCHAR(20) NOT NULL,
    description TEXT,
    client_id UUID REFERENCES clients_2026_01_10(id),
    exhibition_id UUID REFERENCES exhibitions_2026_01_10(id),
    booth_id UUID REFERENCES booths_2026_01_10(id),
    sponsorship_package_id UUID REFERENCES sponsorship_packages_2026_01_10(id),
    deal_value DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EGP',
    commission_rate DECIMAL(5,2),
    lead_source VARCHAR(100),
    contract_start_date DATE,
    contract_end_date DATE,
    payment_method VARCHAR(50),
    payment_plan VARCHAR(50),
    current_stage VARCHAR(100),
    additional_notes TEXT,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment schedules table
CREATE TABLE payment_schedules_2026_01_10 (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deal_id UUID REFERENCES deals_2026_01_10(id) ON DELETE CASCADE,
    payment_name VARCHAR(255) NOT NULL,
    percentage DECIMAL(5,2) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    due_date DATE NOT NULL,
    payment_method VARCHAR(50),
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    collected_date DATE,
    collected_amount DECIMAL(15,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Commissions table
CREATE TABLE commissions_2026_01_10 (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deal_id UUID REFERENCES deals_2026_01_10(id) ON DELETE CASCADE,
    commission_amount DECIMAL(15,2) NOT NULL,
    commission_rate DECIMAL(5,2) NOT NULL,
    base_amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EGP',
    status VARCHAR(20) DEFAULT 'pending',
    due_date DATE,
    paid_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_clients_email ON clients_2026_01_10(email);
CREATE INDEX idx_clients_type ON clients_2026_01_10(client_type);
CREATE INDEX idx_clients_status ON clients_2026_01_10(status);
CREATE INDEX idx_exhibitions_status ON exhibitions_2026_01_10(status);
CREATE INDEX idx_exhibitions_dates ON exhibitions_2026_01_10(start_date, end_date);
CREATE INDEX idx_booths_exhibition ON booths_2026_01_10(exhibition_id);
CREATE INDEX idx_booths_status ON booths_2026_01_10(status);
CREATE INDEX idx_deals_client ON deals_2026_01_10(client_id);
CREATE INDEX idx_deals_exhibition ON deals_2026_01_10(exhibition_id);
CREATE INDEX idx_deals_status ON deals_2026_01_10(status);
CREATE INDEX idx_payment_schedules_deal ON payment_schedules_2026_01_10(deal_id);
CREATE INDEX idx_payment_schedules_due_date ON payment_schedules_2026_01_10(due_date);
CREATE INDEX idx_commissions_deal ON commissions_2026_01_10(deal_id);

-- Create update timestamp triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients_2026_01_10 FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_exhibitions_updated_at BEFORE UPDATE ON exhibitions_2026_01_10 FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sponsorship_packages_updated_at BEFORE UPDATE ON sponsorship_packages_2026_01_10 FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_booths_updated_at BEFORE UPDATE ON booths_2026_01_10 FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_deals_updated_at BEFORE UPDATE ON deals_2026_01_10 FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payment_schedules_updated_at BEFORE UPDATE ON payment_schedules_2026_01_10 FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_commissions_updated_at BEFORE UPDATE ON commissions_2026_01_10 FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings_2026_01_10 FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();