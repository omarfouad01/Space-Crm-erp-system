-- Create comprehensive CRM database schema for deals management
-- Current time: 2026-01-10 12:00 UTC

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create clients table
CREATE TABLE IF NOT EXISTS public.clients_2026_01_10_12_00 (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    company VARCHAR(255),
    type VARCHAR(100),
    city VARCHAR(100),
    country VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create exhibitions table
CREATE TABLE IF NOT EXISTS public.exhibitions_2026_01_10_12_00 (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    location VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Planning',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create deals table
CREATE TABLE IF NOT EXISTS public.deals_2026_01_10_12_00 (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    client_id UUID REFERENCES public.clients_2026_01_10_12_00(id) ON DELETE CASCADE,
    deal_value DECIMAL(15,2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Talking',
    stage VARCHAR(50) DEFAULT 'talking',
    priority VARCHAR(20) DEFAULT 'Medium',
    probability INTEGER DEFAULT 10,
    close_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by VARCHAR(255),
    created_by_name VARCHAR(255),
    assigned_to VARCHAR(255),
    assigned_to_name VARCHAR(255),
    notes TEXT,
    exhibition_id UUID REFERENCES public.exhibitions_2026_01_10_12_00(id) ON DELETE SET NULL,
    booth_id VARCHAR(100),
    health_score INTEGER DEFAULT 50,
    days_in_stage INTEGER DEFAULT 0,
    next_action TEXT,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS public.tasks_2026_01_10_12_00 (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'Open',
    priority VARCHAR(20) DEFAULT 'Medium',
    due_date DATE,
    assigned_to VARCHAR(255),
    deal_id UUID REFERENCES public.deals_2026_01_10_12_00(id) ON DELETE CASCADE,
    client_id UUID REFERENCES public.clients_2026_01_10_12_00(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample clients
INSERT INTO public.clients_2026_01_10_12_00 (name, email, phone, company, type, city, country) VALUES
('EcoTech Solutions', 'contact@ecotech.com', '+1-555-0101', 'EcoTech Solutions Inc.', 'Technology Company', 'San Francisco', 'USA'),
('Green Energy Alliance', 'info@greenenergy.com', '+1-555-0102', 'Green Energy Alliance', 'Energy Company', 'Austin', 'USA'),
('Innovation Corp', 'hello@innovation.com', '+1-555-0103', 'Innovation Corp', 'Startup', 'New York', 'USA'),
('Sustainable Systems Inc', 'contact@sustainable.com', '+1-555-0104', 'Sustainable Systems Inc', 'Manufacturing', 'Seattle', 'USA'),
('Future Tech Ltd', 'info@futuretech.com', '+1-555-0105', 'Future Tech Ltd', 'Technology', 'Boston', 'USA');

-- Insert sample exhibitions
INSERT INTO public.exhibitions_2026_01_10_12_00 (name, description, start_date, end_date, location, status) VALUES
('Green Life Expo 2024', 'Annual sustainable living and green technology exhibition', '2024-03-15', '2024-03-17', 'Los Angeles Convention Center', 'Planning'),
('Tech Innovation Summit 2024', 'Technology and innovation showcase', '2024-05-20', '2024-05-22', 'San Francisco Moscone Center', 'Planning'),
('Sustainable Future Conference', 'Conference on sustainability and environmental solutions', '2024-07-10', '2024-07-12', 'Chicago McCormick Place', 'Planning');

-- Insert sample deals
INSERT INTO public.deals_2026_01_10_12_00 (
    title, description, client_id, deal_value, status, stage, priority, probability, close_date,
    created_by, created_by_name, assigned_to, assigned_to_name, notes, exhibition_id
) 
SELECT 
    'EcoTech Solutions - Premium Booth Package',
    'Premium booth rental with additional services for Green Life Expo 2024',
    c.id,
    72000,
    'Proposal',
    'strategy_proposal',
    'High',
    75,
    '2024-03-15',
    'user-1',
    'Sarah Johnson',
    'user-1',
    'Sarah Johnson',
    'Client very interested in premium location. Needs custom booth design.',
    e.id
FROM public.clients_2026_01_10_12_00 c, public.exhibitions_2026_01_10_12_00 e
WHERE c.name = 'EcoTech Solutions' AND e.name = 'Green Life Expo 2024'
LIMIT 1;

INSERT INTO public.deals_2026_01_10_12_00 (
    title, description, client_id, deal_value, status, stage, priority, probability, close_date,
    created_by, created_by_name, assigned_to, assigned_to_name, notes, exhibition_id
) 
SELECT 
    'Green Energy Alliance - Sponsorship Package',
    'Platinum sponsorship package with speaking opportunities',
    c.id,
    50000,
    'Negotiation',
    'objection_handling',
    'High',
    60,
    '2024-02-28',
    'user-2',
    'Michael Chen',
    'user-2',
    'Michael Chen',
    'Negotiating on speaking slot timing and booth location.',
    e.id
FROM public.clients_2026_01_10_12_00 c, public.exhibitions_2026_01_10_12_00 e
WHERE c.name = 'Green Energy Alliance' AND e.name = 'Green Life Expo 2024'
LIMIT 1;

INSERT INTO public.deals_2026_01_10_12_00 (
    title, description, client_id, deal_value, status, stage, priority, probability, close_date,
    created_by, created_by_name, assigned_to, assigned_to_name, notes, exhibition_id
) 
SELECT 
    'Innovation Corp - Standard Booth',
    'Standard booth rental for Tech Innovation Summit',
    c.id,
    25000,
    'Talking',
    'talking',
    'Medium',
    25,
    '2024-04-01',
    'user-3',
    'Emily Rodriguez',
    'user-3',
    'Emily Rodriguez',
    'Initial contact made. Waiting for budget approval.',
    e.id
FROM public.clients_2026_01_10_12_00 c, public.exhibitions_2026_01_10_12_00 e
WHERE c.name = 'Innovation Corp' AND e.name = 'Tech Innovation Summit 2024'
LIMIT 1;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_deals_client_id ON public.deals_2026_01_10_12_00(client_id);
CREATE INDEX IF NOT EXISTS idx_deals_exhibition_id ON public.deals_2026_01_10_12_00(exhibition_id);
CREATE INDEX IF NOT EXISTS idx_deals_status ON public.deals_2026_01_10_12_00(status);
CREATE INDEX IF NOT EXISTS idx_deals_stage ON public.deals_2026_01_10_12_00(stage);
CREATE INDEX IF NOT EXISTS idx_deals_created_at ON public.deals_2026_01_10_12_00(created_at);
CREATE INDEX IF NOT EXISTS idx_tasks_deal_id ON public.tasks_2026_01_10_12_00(deal_id);
CREATE INDEX IF NOT EXISTS idx_tasks_client_id ON public.tasks_2026_01_10_12_00(client_id);