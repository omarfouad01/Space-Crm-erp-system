-- Enhanced Clients Schema for CRM System
-- Created: 2026-01-10 13:00 UTC

-- Update existing clients table with new fields
ALTER TABLE clients_2026_01_10_12_00 
ADD COLUMN IF NOT EXISTS contact_person VARCHAR(255),
ADD COLUMN IF NOT EXISTS website VARCHAR(500),
ADD COLUMN IF NOT EXISTS industry VARCHAR(100),
ADD COLUMN IF NOT EXISTS company_size VARCHAR(50),
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS postal_code VARCHAR(20),
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Active',
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update existing records to have default values
UPDATE clients_2026_01_10_12_00 
SET 
  status = COALESCE(status, 'Active'),
  updated_at = COALESCE(updated_at, created_at)
WHERE status IS NULL OR updated_at IS NULL;

-- Insert sample enhanced client data with proper UUIDs
INSERT INTO clients_2026_01_10_12_00 (
  id, name, email, phone, company, type, contact_person, website, industry, 
  company_size, address, city, country, postal_code, status, notes, created_at, updated_at
) VALUES 
(
  gen_random_uuid(),
  'EcoTech Solutions',
  'contact@ecotech.com',
  '+1-555-0123',
  'EcoTech Solutions Inc.',
  'Exhibitor',
  'Sarah Johnson',
  'https://www.ecotech.com',
  'Technology',
  '51-200',
  '123 Innovation Drive, Suite 100',
  'San Francisco',
  'United States',
  '94105',
  'Active',
  'Leading provider of sustainable technology solutions. Key client for green energy exhibitions.',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Global Manufacturing Corp',
  'partnerships@globalmanuf.com',
  '+1-555-0456',
  'Global Manufacturing Corporation',
  'Sponsor',
  'Michael Chen',
  'https://www.globalmanuf.com',
  'Manufacturing',
  '1000+',
  '456 Industrial Boulevard',
  'Detroit',
  'United States',
  '48201',
  'Active',
  'Major sponsor for industrial exhibitions. Long-term partnership since 2020.',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'HealthCare Innovations',
  'info@healthcareinno.com',
  '+1-555-0789',
  'HealthCare Innovations Ltd.',
  'Partner',
  'Dr. Emily Rodriguez',
  'https://www.healthcareinno.com',
  'Healthcare',
  '201-500',
  '789 Medical Center Way',
  'Boston',
  'United States',
  '02101',
  'Active',
  'Strategic partner for medical device exhibitions. Excellent collaboration history.',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Digital Marketing Pro',
  'hello@digitalmarketingpro.com',
  '+1-555-0321',
  'Digital Marketing Pro Agency',
  'Vendor',
  'Alex Thompson',
  'https://www.digitalmarketingpro.com',
  'Media',
  '11-50',
  '321 Creative Street, Floor 5',
  'New York',
  'United States',
  '10001',
  'Active',
  'Provides marketing services for our exhibitions. Reliable vendor with creative solutions.',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Future Foods International',
  'contact@futurefoods.com',
  '+44-20-7123-4567',
  'Future Foods International PLC',
  'Exhibitor',
  'James Wilson',
  'https://www.futurefoods.com',
  'Food & Beverage',
  '501-1000',
  '567 Food Innovation Park',
  'London',
  'United Kingdom',
  'SW1A 1AA',
  'Prospect',
  'Potential exhibitor for food technology shows. Currently in negotiation phase.',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Green Energy Solutions',
  'partnerships@greenenergy.com',
  '+49-30-1234-5678',
  'Green Energy Solutions GmbH',
  'Sponsor',
  'Anna Mueller',
  'https://www.greenenergy.de',
  'Energy',
  '201-500',
  '890 Renewable Energy Allee',
  'Berlin',
  'Germany',
  '10115',
  'Active',
  'Major sponsor for renewable energy exhibitions. Strong commitment to sustainability.',
  NOW(),
  NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clients_status_2026_01_10_13_00 ON clients_2026_01_10_12_00(status);
CREATE INDEX IF NOT EXISTS idx_clients_type_2026_01_10_13_00 ON clients_2026_01_10_12_00(type);
CREATE INDEX IF NOT EXISTS idx_clients_industry_2026_01_10_13_00 ON clients_2026_01_10_12_00(industry);
CREATE INDEX IF NOT EXISTS idx_clients_city_2026_01_10_13_00 ON clients_2026_01_10_12_00(city);
CREATE INDEX IF NOT EXISTS idx_clients_country_2026_01_10_13_00 ON clients_2026_01_10_12_00(country);
CREATE INDEX IF NOT EXISTS idx_clients_updated_at_2026_01_10_13_00 ON clients_2026_01_10_12_00(updated_at);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_clients_updated_at_2026_01_10_13_00()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS trigger_update_clients_updated_at_2026_01_10_13_00 ON clients_2026_01_10_12_00;
CREATE TRIGGER trigger_update_clients_updated_at_2026_01_10_13_00
    BEFORE UPDATE ON clients_2026_01_10_12_00
    FOR EACH ROW
    EXECUTE FUNCTION update_clients_updated_at_2026_01_10_13_00();