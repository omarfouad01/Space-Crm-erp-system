-- Create Users table
CREATE TABLE IF NOT EXISTS public.users_2026_01_10_17_00 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    department VARCHAR(100),
    position VARCHAR(100),
    hire_date DATE,
    salary DECIMAL(12,2),
    address TEXT,
    emergency_contact VARCHAR(255),
    notes TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    is_demo_user BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Roles table
CREATE TABLE IF NOT EXISTS public.roles_2026_01_10_17_00 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#6B7280',
    is_system_role BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Permissions table
CREATE TABLE IF NOT EXISTS public.permissions_2026_01_10_17_00 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    module VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create User Roles junction table
CREATE TABLE IF NOT EXISTS public.user_roles_2026_01_10_17_00 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users_2026_01_10_17_00(id) ON DELETE CASCADE,
    role_id UUID REFERENCES public.roles_2026_01_10_17_00(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assigned_by UUID REFERENCES public.users_2026_01_10_17_00(id),
    UNIQUE(user_id, role_id)
);

-- Create Role Permissions junction table
CREATE TABLE IF NOT EXISTS public.role_permissions_2026_01_10_17_00 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    role_id UUID REFERENCES public.roles_2026_01_10_17_00(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES public.permissions_2026_01_10_17_00(id) ON DELETE CASCADE,
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(role_id, permission_id)
);

-- Create User Credentials table for authentication
CREATE TABLE IF NOT EXISTS public.user_credentials_2026_01_10_17_00 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users_2026_01_10_17_00(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    failed_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default system roles
INSERT INTO public.roles_2026_01_10_17_00 (name, display_name, description, color, is_system_role) VALUES
('super_admin', 'Super Administrator', 'Full system access with all administrative privileges', '#DC2626', true),
('admin', 'Administrator', 'Administrative access to most system functions', '#EA580C', true),
('manager', 'Manager', 'Management access with team oversight capabilities', '#D97706', true),
('sales_manager', 'Sales Manager', 'Manage sales team, deals, and client relationships', '#059669', true),
('sales_rep', 'Sales Representative', 'Handle client interactions and manage assigned deals', '#0D9488', true),
('operations_manager', 'Operations Manager', 'Oversee booth management, logistics, and operations', '#0891B2', true),
('finance_manager', 'Finance Manager', 'Manage payments, invoicing, and financial operations', '#7C3AED', true),
('hr_manager', 'HR Manager', 'Human resources and employee management', '#C026D3', true),
('employee', 'Employee', 'Standard employee access to basic functions', '#6B7280', true),
('viewer', 'Viewer', 'Read-only access to system information', '#9CA3AF', true)
ON CONFLICT (name) DO NOTHING;

-- Insert default permissions
INSERT INTO public.permissions_2026_01_10_17_00 (name, display_name, description, module, action) VALUES
-- Dashboard permissions
('dashboard_view', 'View Dashboard', 'Access to main dashboard and analytics', 'dashboard', 'view'),
('dashboard_edit', 'Edit Dashboard', 'Modify dashboard settings and widgets', 'dashboard', 'edit'),

-- Client permissions
('clients_view', 'View Clients', 'View client information and lists', 'clients', 'view'),
('clients_create', 'Create Clients', 'Add new clients to the system', 'clients', 'create'),
('clients_edit', 'Edit Clients', 'Modify existing client information', 'clients', 'edit'),
('clients_delete', 'Delete Clients', 'Remove clients from the system', 'clients', 'delete'),

-- Deal permissions
('deals_view', 'View Deals', 'View deals and sales pipeline', 'deals', 'view'),
('deals_create', 'Create Deals', 'Add new deals to the pipeline', 'deals', 'create'),
('deals_edit', 'Edit Deals', 'Modify existing deals', 'deals', 'edit'),
('deals_delete', 'Delete Deals', 'Remove deals from the system', 'deals', 'delete'),

-- Booth permissions
('booths_view', 'View Booths', 'View booth information and availability', 'booths', 'view'),
('booths_create', 'Create Booths', 'Add new booths to exhibitions', 'booths', 'create'),
('booths_edit', 'Edit Booths', 'Modify booth configurations', 'booths', 'edit'),
('booths_delete', 'Delete Booths', 'Remove booths from exhibitions', 'booths', 'delete'),

-- Payment permissions
('payments_view', 'View Payments', 'View payment information and transactions', 'payments', 'view'),
('payments_create', 'Create Payments', 'Process new payments', 'payments', 'create'),
('payments_edit', 'Edit Payments', 'Modify payment information', 'payments', 'edit'),
('payments_delete', 'Delete Payments', 'Remove payment records', 'payments', 'delete'),

-- Task permissions
('tasks_view', 'View Tasks', 'View task lists and assignments', 'tasks', 'view'),
('tasks_create', 'Create Tasks', 'Add new tasks', 'tasks', 'create'),
('tasks_edit', 'Edit Tasks', 'Modify existing tasks', 'tasks', 'edit'),
('tasks_delete', 'Delete Tasks', 'Remove tasks from the system', 'tasks', 'delete'),

-- HR permissions
('hr_view', 'View HR', 'View HR information and employee data', 'hr', 'view'),
('hr_create', 'Create HR Records', 'Add new HR records', 'hr', 'create'),
('hr_edit', 'Edit HR Records', 'Modify HR information', 'hr', 'edit'),
('hr_delete', 'Delete HR Records', 'Remove HR records', 'hr', 'delete'),

-- User Management permissions
('users_view', 'View Users', 'View user accounts and information', 'users', 'view'),
('users_create', 'Create Users', 'Add new user accounts', 'users', 'create'),
('users_edit', 'Edit Users', 'Modify user account information', 'users', 'edit'),
('users_delete', 'Delete Users', 'Remove user accounts', 'users', 'delete'),

-- Role Management permissions
('roles_view', 'View Roles', 'View system roles and permissions', 'roles', 'view'),
('roles_create', 'Create Roles', 'Add new system roles', 'roles', 'create'),
('roles_edit', 'Edit Roles', 'Modify existing roles', 'roles', 'edit'),
('roles_delete', 'Delete Roles', 'Remove system roles', 'roles', 'delete'),

-- Settings permissions
('settings_view', 'View Settings', 'View system configuration', 'settings', 'view'),
('settings_edit', 'Edit Settings', 'Modify system settings', 'settings', 'edit')
ON CONFLICT (name) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users_2026_01_10_17_00(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users_2026_01_10_17_00(status);
CREATE INDEX IF NOT EXISTS idx_users_department ON public.users_2026_01_10_17_00(department);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles_2026_01_10_17_00(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON public.user_roles_2026_01_10_17_00(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON public.role_permissions_2026_01_10_17_00(role_id);
CREATE INDEX IF NOT EXISTS idx_user_credentials_email ON public.user_credentials_2026_01_10_17_00(email);
CREATE INDEX IF NOT EXISTS idx_user_credentials_user_id ON public.user_credentials_2026_01_10_17_00(user_id);

-- Enable Row Level Security
ALTER TABLE public.users_2026_01_10_17_00 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles_2026_01_10_17_00 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions_2026_01_10_17_00 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles_2026_01_10_17_00 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions_2026_01_10_17_00 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_credentials_2026_01_10_17_00 ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for authenticated users
CREATE POLICY "Users can view all users" ON public.users_2026_01_10_17_00
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert users" ON public.users_2026_01_10_17_00
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update users" ON public.users_2026_01_10_17_00
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete users" ON public.users_2026_01_10_17_00
    FOR DELETE USING (auth.role() = 'authenticated');

-- Similar policies for other tables
CREATE POLICY "Allow all operations on roles" ON public.roles_2026_01_10_17_00
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations on permissions" ON public.permissions_2026_01_10_17_00
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations on user_roles" ON public.user_roles_2026_01_10_17_00
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations on role_permissions" ON public.role_permissions_2026_01_10_17_00
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations on user_credentials" ON public.user_credentials_2026_01_10_17_00
    FOR ALL USING (auth.role() = 'authenticated');