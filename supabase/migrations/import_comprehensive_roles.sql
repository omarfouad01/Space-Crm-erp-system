-- Import comprehensive roles from provided code
-- First, let's add any missing roles that were in the sample code

INSERT INTO public.roles_2026_01_10_17_00 (name, display_name, description, color, is_system_role) VALUES
-- Core administrative roles
('super_admin', 'Super Admin', 'Full system access with all administrative privileges', '#DC2626', true),
('system_admin', 'System Administrator', 'System administration and technical management', '#B91C1C', true),

-- Management hierarchy roles
('ceo', 'Chief Executive Officer', 'Executive leadership and strategic oversight', '#7C2D12', true),
('coo', 'Chief Operating Officer', 'Operations leadership and management oversight', '#A16207', true),
('cfo', 'Chief Financial Officer', 'Financial leadership and fiscal oversight', '#7C3AED', true),
('cto', 'Chief Technology Officer', 'Technology leadership and innovation oversight', '#1D4ED8', true),

-- Department management roles
('sales_director', 'Sales Director', 'Sales department leadership and strategy', '#059669', true),
('marketing_director', 'Marketing Director', 'Marketing department leadership and campaigns', '#DC2626', true),
('operations_director', 'Operations Director', 'Operations department leadership and logistics', '#0891B2', true),
('finance_director', 'Finance Director', 'Finance department leadership and planning', '#7C3AED', true),
('hr_director', 'HR Director', 'Human resources department leadership', '#C026D3', true),
('it_director', 'IT Director', 'Information technology department leadership', '#1D4ED8', true),

-- Senior management roles
('senior_manager', 'Senior Manager', 'Senior management with cross-departmental oversight', '#D97706', true),
('project_manager', 'Project Manager', 'Project management and coordination', '#0D9488', true),
('team_lead', 'Team Lead', 'Team leadership and coordination', '#059669', true),

-- Specialized management roles
('account_manager', 'Account Manager', 'Client account management and relationships', '#0891B2', true),
('product_manager', 'Product Manager', 'Product development and management', '#7C3AED', true),
('business_analyst', 'Business Analyst', 'Business analysis and process improvement', '#1D4ED8', true),

-- Sales and client-facing roles
('senior_sales_rep', 'Senior Sales Representative', 'Senior sales with mentoring responsibilities', '#059669', true),
('inside_sales_rep', 'Inside Sales Representative', 'Internal sales and lead qualification', '#0D9488', true),
('field_sales_rep', 'Field Sales Representative', 'External sales and client visits', '#0891B2', true),
('sales_coordinator', 'Sales Coordinator', 'Sales support and coordination', '#06B6D4', true),
('client_success_manager', 'Client Success Manager', 'Client retention and success management', '#8B5CF6', true),

-- Marketing and communication roles
('marketing_manager', 'Marketing Manager', 'Marketing campaigns and strategy management', '#DC2626', true),
('digital_marketing_specialist', 'Digital Marketing Specialist', 'Digital marketing and online campaigns', '#F59E0B', true),
('content_manager', 'Content Manager', 'Content creation and management', '#EF4444', true),
('social_media_manager', 'Social Media Manager', 'Social media strategy and management', '#EC4899', true),
('pr_specialist', 'PR Specialist', 'Public relations and communications', '#F97316', true),

-- Operations and logistics roles
('logistics_manager', 'Logistics Manager', 'Logistics and supply chain management', '#0891B2', true),
('warehouse_manager', 'Warehouse Manager', 'Warehouse operations and inventory', '#059669', true),
('quality_manager', 'Quality Manager', 'Quality assurance and control', '#7C3AED', true),
('procurement_manager', 'Procurement Manager', 'Procurement and vendor management', '#0D9488', true),
('facilities_manager', 'Facilities Manager', 'Facilities and infrastructure management', '#6B7280', true),

-- Exhibition and event specific roles
('exhibition_manager', 'Exhibition Manager', 'Exhibition planning and management', '#0891B2', true),
('booth_coordinator', 'Booth Coordinator', 'Booth setup and coordination', '#059669', true),
('event_coordinator', 'Event Coordinator', 'Event planning and execution', '#8B5CF6', true),
('venue_manager', 'Venue Manager', 'Venue management and operations', '#0D9488', true),
('exhibitor_relations', 'Exhibitor Relations', 'Exhibitor communication and support', '#06B6D4', true),

-- Finance and accounting roles
('accounting_manager', 'Accounting Manager', 'Accounting operations and reporting', '#7C3AED', true),
('financial_analyst', 'Financial Analyst', 'Financial analysis and reporting', '#8B5CF6', true),
('accounts_payable', 'Accounts Payable', 'Vendor payments and payables management', '#6366F1', true),
('accounts_receivable', 'Accounts Receivable', 'Client payments and receivables management', '#8B5CF6', true),
('payroll_specialist', 'Payroll Specialist', 'Payroll processing and management', '#A855F7', true),
('budget_analyst', 'Budget Analyst', 'Budget planning and analysis', '#7C3AED', true),

-- Human resources roles
('hr_business_partner', 'HR Business Partner', 'Strategic HR support and partnership', '#C026D3', true),
('recruiter', 'Recruiter', 'Talent acquisition and recruitment', '#EC4899', true),
('hr_coordinator', 'HR Coordinator', 'HR operations and coordination', '#F472B6', true),
('training_coordinator', 'Training Coordinator', 'Employee training and development', '#DB2777', true),
('compensation_analyst', 'Compensation Analyst', 'Compensation and benefits analysis', '#BE185D', true),

-- Information technology roles
('it_manager', 'IT Manager', 'IT operations and infrastructure management', '#1D4ED8', true),
('system_administrator', 'System Administrator', 'System administration and maintenance', '#2563EB', true),
('network_administrator', 'Network Administrator', 'Network infrastructure and security', '#3B82F6', true),
('database_administrator', 'Database Administrator', 'Database management and optimization', '#60A5FA', true),
('security_specialist', 'Security Specialist', 'Information security and compliance', '#1E40AF', true),
('help_desk_technician', 'Help Desk Technician', 'Technical support and troubleshooting', '#3B82F6', true),

-- Customer service and support roles
('customer_service_manager', 'Customer Service Manager', 'Customer service operations management', '#059669', true),
('customer_service_rep', 'Customer Service Representative', 'Customer support and assistance', '#0D9488', true),
('technical_support', 'Technical Support', 'Technical customer support', '#0891B2', true),
('call_center_agent', 'Call Center Agent', 'Inbound and outbound call handling', '#06B6D4', true),

-- Legal and compliance roles
('legal_counsel', 'Legal Counsel', 'Legal advice and contract management', '#374151', true),
('compliance_officer', 'Compliance Officer', 'Regulatory compliance and risk management', '#4B5563', true),
('contract_manager', 'Contract Manager', 'Contract negotiation and management', '#6B7280', true),

-- Specialized operational roles
('data_analyst', 'Data Analyst', 'Data analysis and business intelligence', '#1D4ED8', true),
('reporting_specialist', 'Reporting Specialist', 'Report generation and analysis', '#3B82F6', true),
('process_improvement', 'Process Improvement Specialist', 'Process optimization and improvement', '#0891B2', true),
('vendor_manager', 'Vendor Manager', 'Vendor relationship management', '#059669', true),

-- Junior and entry-level roles
('junior_analyst', 'Junior Analyst', 'Entry-level analysis and support', '#6B7280', true),
('coordinator', 'Coordinator', 'General coordination and administrative support', '#9CA3AF', true),
('assistant', 'Assistant', 'Administrative and operational assistance', '#D1D5DB', true),
('intern', 'Intern', 'Internship and learning role', '#E5E7EB', true),

-- Consultant and contractor roles
('senior_consultant', 'Senior Consultant', 'Senior consulting and advisory services', '#F59E0B', true),
('consultant', 'Consultant', 'Consulting and advisory services', '#FBBF24', true),
('contractor', 'Contractor', 'Contract-based specialized services', '#FCD34D', true),
('freelancer', 'Freelancer', 'Freelance and project-based work', '#FDE68A', true),

-- Audit and review roles
('internal_auditor', 'Internal Auditor', 'Internal audit and compliance review', '#374151', true),
('external_auditor', 'External Auditor', 'External audit and verification', '#4B5563', true),
('reviewer', 'Reviewer', 'Document and process review', '#6B7280', true),

-- Special access roles
('read_only_user', 'Read Only User', 'Read-only access to system information', '#9CA3AF', true),
('limited_access', 'Limited Access', 'Limited system access for specific functions', '#D1D5DB', true),
('guest_user', 'Guest User', 'Temporary guest access', '#E5E7EB', true),
('api_user', 'API User', 'Programmatic API access', '#6366F1', true),
('integration_user', 'Integration User', 'System integration and automation', '#8B5CF6', true)

ON CONFLICT (name) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  description = EXCLUDED.description,
  color = EXCLUDED.color,
  is_system_role = EXCLUDED.is_system_role,
  updated_at = NOW();

-- Update existing roles with better descriptions and colors
UPDATE public.roles_2026_01_10_17_00 SET
  description = 'Complete system administration with all privileges and access controls',
  color = '#DC2626'
WHERE name = 'super_admin';

UPDATE public.roles_2026_01_10_17_00 SET
  description = 'Administrative access to most system functions with user management capabilities',
  color = '#EA580C'
WHERE name = 'admin';

UPDATE public.roles_2026_01_10_17_00 SET
  description = 'Management access with team oversight and departmental responsibilities',
  color = '#D97706'
WHERE name = 'manager';

UPDATE public.roles_2026_01_10_17_00 SET
  description = 'Sales team management with deal oversight and client relationship management',
  color = '#059669'
WHERE name = 'sales_manager';

UPDATE public.roles_2026_01_10_17_00 SET
  description = 'Client interaction and deal management with sales pipeline access',
  color = '#0D9488'
WHERE name = 'sales_rep';

UPDATE public.roles_2026_01_10_17_00 SET
  description = 'Operations oversight including booth management, logistics, and venue coordination',
  color = '#0891B2'
WHERE name = 'operations_manager';

UPDATE public.roles_2026_01_10_17_00 SET
  description = 'Financial operations including payments, invoicing, and budget management',
  color = '#7C3AED'
WHERE name = 'finance_manager';

UPDATE public.roles_2026_01_10_17_00 SET
  description = 'Human resources management including recruitment, training, and employee relations',
  color = '#C026D3'
WHERE name = 'hr_manager';

UPDATE public.roles_2026_01_10_17_00 SET
  description = 'Standard employee access to basic system functions and assigned responsibilities',
  color = '#6B7280'
WHERE name = 'employee';

UPDATE public.roles_2026_01_10_17_00 SET
  description = 'Read-only access to system information without modification privileges',
  color = '#9CA3AF'
WHERE name = 'viewer';

-- Create some sample custom roles based on the provided code
INSERT INTO public.roles_2026_01_10_17_00 (name, display_name, description, color, is_system_role) VALUES
('custom_sales_lead', 'Custom Sales Lead', 'Custom role for sales team leadership with specific permissions', '#10B981', false),
('custom_event_manager', 'Custom Event Manager', 'Custom role for event management with exhibition focus', '#3B82F6', false),
('custom_client_manager', 'Custom Client Manager', 'Custom role for dedicated client relationship management', '#8B5CF6', false),
('custom_finance_analyst', 'Custom Finance Analyst', 'Custom role for financial analysis and reporting', '#A855F7', false),
('custom_operations_lead', 'Custom Operations Lead', 'Custom role for operations leadership and coordination', '#06B6D4', false)
ON CONFLICT (name) DO NOTHING;

-- Add some role assignments for existing users to the new roles
DO $$
DECLARE
    user_record RECORD;
    role_record RECORD;
    admin_user_id UUID;
BEGIN
    -- Get admin user for assignment tracking
    SELECT id INTO admin_user_id FROM public.users_2026_01_10_17_00 WHERE email = 'admin@space.com' LIMIT 1;
    
    -- Assign some users to the new specialized roles
    
    -- Assign sales manager to sales director role
    SELECT id INTO role_record FROM public.roles_2026_01_10_17_00 WHERE name = 'sales_director' LIMIT 1;
    FOR user_record IN SELECT id FROM public.users_2026_01_10_17_00 WHERE department = 'Sales' AND position LIKE '%Manager%' LIMIT 1 LOOP
        INSERT INTO public.user_roles_2026_01_10_17_00 (user_id, role_id, assigned_by) 
        VALUES (user_record.id, role_record.id, admin_user_id) 
        ON CONFLICT (user_id, role_id) DO NOTHING;
    END LOOP;
    
    -- Assign operations manager to operations director role
    SELECT id INTO role_record FROM public.roles_2026_01_10_17_00 WHERE name = 'operations_director' LIMIT 1;
    FOR user_record IN SELECT id FROM public.users_2026_01_10_17_00 WHERE department = 'Operations' AND position LIKE '%Manager%' LIMIT 1 LOOP
        INSERT INTO public.user_roles_2026_01_10_17_00 (user_id, role_id, assigned_by) 
        VALUES (user_record.id, role_record.id, admin_user_id) 
        ON CONFLICT (user_id, role_id) DO NOTHING;
    END LOOP;
    
    -- Assign finance manager to finance director role
    SELECT id INTO role_record FROM public.roles_2026_01_10_17_00 WHERE name = 'finance_director' LIMIT 1;
    FOR user_record IN SELECT id FROM public.users_2026_01_10_17_00 WHERE department = 'Finance' AND position LIKE '%Manager%' LIMIT 1 LOOP
        INSERT INTO public.user_roles_2026_01_10_17_00 (user_id, role_id, assigned_by) 
        VALUES (user_record.id, role_record.id, admin_user_id) 
        ON CONFLICT (user_id, role_id) DO NOTHING;
    END LOOP;
    
    -- Assign HR manager to HR director role
    SELECT id INTO role_record FROM public.roles_2026_01_10_17_00 WHERE name = 'hr_director' LIMIT 1;
    FOR user_record IN SELECT id FROM public.users_2026_01_10_17_00 WHERE department = 'HR' AND position LIKE '%Manager%' LIMIT 1 LOOP
        INSERT INTO public.user_roles_2026_01_10_17_00 (user_id, role_id, assigned_by) 
        VALUES (user_record.id, role_record.id, admin_user_id) 
        ON CONFLICT (user_id, role_id) DO NOTHING;
    END LOOP;
    
    -- Assign some employees to specialized roles
    SELECT id INTO role_record FROM public.roles_2026_01_10_17_00 WHERE name = 'booth_coordinator' LIMIT 1;
    FOR user_record IN SELECT id FROM public.users_2026_01_10_17_00 WHERE position LIKE '%Coordinator%' LIMIT 1 LOOP
        INSERT INTO public.user_roles_2026_01_10_17_00 (user_id, role_id, assigned_by) 
        VALUES (user_record.id, role_record.id, admin_user_id) 
        ON CONFLICT (user_id, role_id) DO NOTHING;
    END LOOP;
    
    -- Assign marketing specialist to digital marketing role
    SELECT id INTO role_record FROM public.roles_2026_01_10_17_00 WHERE name = 'digital_marketing_specialist' LIMIT 1;
    FOR user_record IN SELECT id FROM public.users_2026_01_10_17_00 WHERE department = 'Marketing' LIMIT 1 LOOP
        INSERT INTO public.user_roles_2026_01_10_17_00 (user_id, role_id, assigned_by) 
        VALUES (user_record.id, role_record.id, admin_user_id) 
        ON CONFLICT (user_id, role_id) DO NOTHING;
    END LOOP;
    
END $$;

-- Update role statistics and create some permission assignments for new roles
DO $$
DECLARE
    role_id UUID;
    perm_id UUID;
BEGIN
    -- Assign comprehensive permissions to director-level roles
    
    -- Sales Director permissions
    SELECT id INTO role_id FROM public.roles_2026_01_10_17_00 WHERE name = 'sales_director';
    FOR perm_id IN SELECT id FROM public.permissions_2026_01_10_17_00 WHERE 
        module IN ('dashboard', 'clients', 'deals', 'tasks', 'hr') OR
        (module = 'payments' AND action = 'view') OR
        (module = 'booths' AND action = 'view')
    LOOP
        INSERT INTO public.role_permissions_2026_01_10_17_00 (role_id, permission_id) 
        VALUES (role_id, perm_id) ON CONFLICT DO NOTHING;
    END LOOP;
    
    -- Operations Director permissions
    SELECT id INTO role_id FROM public.roles_2026_01_10_17_00 WHERE name = 'operations_director';
    FOR perm_id IN SELECT id FROM public.permissions_2026_01_10_17_00 WHERE 
        module IN ('dashboard', 'booths', 'tasks') OR
        (module IN ('clients', 'deals', 'payments') AND action = 'view')
    LOOP
        INSERT INTO public.role_permissions_2026_01_10_17_00 (role_id, permission_id) 
        VALUES (role_id, perm_id) ON CONFLICT DO NOTHING;
    END LOOP;
    
    -- Finance Director permissions
    SELECT id INTO role_id FROM public.roles_2026_01_10_17_00 WHERE name = 'finance_director';
    FOR perm_id IN SELECT id FROM public.permissions_2026_01_10_17_00 WHERE 
        module IN ('dashboard', 'payments', 'tasks') OR
        (module IN ('clients', 'deals', 'booths') AND action = 'view')
    LOOP
        INSERT INTO public.role_permissions_2026_01_10_17_00 (role_id, permission_id) 
        VALUES (role_id, perm_id) ON CONFLICT DO NOTHING;
    END LOOP;
    
    -- HR Director permissions
    SELECT id INTO role_id FROM public.roles_2026_01_10_17_00 WHERE name = 'hr_director';
    FOR perm_id IN SELECT id FROM public.permissions_2026_01_10_17_00 WHERE 
        module IN ('dashboard', 'hr', 'users', 'tasks') OR
        (module IN ('clients', 'deals') AND action = 'view')
    LOOP
        INSERT INTO public.role_permissions_2026_01_10_17_00 (role_id, permission_id) 
        VALUES (role_id, perm_id) ON CONFLICT DO NOTHING;
    END LOOP;
    
    -- Booth Coordinator permissions
    SELECT id INTO role_id FROM public.roles_2026_01_10_17_00 WHERE name = 'booth_coordinator';
    FOR perm_id IN SELECT id FROM public.permissions_2026_01_10_17_00 WHERE 
        module IN ('dashboard', 'booths', 'tasks') AND action IN ('view', 'create', 'edit')
    LOOP
        INSERT INTO public.role_permissions_2026_01_10_17_00 (role_id, permission_id) 
        VALUES (role_id, perm_id) ON CONFLICT DO NOTHING;
    END LOOP;
    
    -- Digital Marketing Specialist permissions
    SELECT id INTO role_id FROM public.roles_2026_01_10_17_00 WHERE name = 'digital_marketing_specialist';
    FOR perm_id IN SELECT id FROM public.permissions_2026_01_10_17_00 WHERE 
        module IN ('dashboard', 'clients', 'tasks') AND action IN ('view', 'create', 'edit')
    LOOP
        INSERT INTO public.role_permissions_2026_01_10_17_00 (role_id, permission_id) 
        VALUES (role_id, perm_id) ON CONFLICT DO NOTHING;
    END LOOP;
    
END $$;