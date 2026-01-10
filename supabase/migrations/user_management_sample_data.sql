-- Insert sample users
INSERT INTO public.users_2026_01_10_17_00 (email, full_name, phone, department, position, hire_date, salary, address, emergency_contact, notes, status) VALUES
('admin@space.com', 'System Administrator', '+20 100 123 4567', 'IT', 'System Administrator', '2024-01-01', 120000.00, 'Cairo, Egypt', 'Emergency Contact: +20 100 999 8888', 'System administrator with full access', 'active'),
('john.manager@space.com', 'John Manager', '+20 100 234 5678', 'Sales', 'Sales Manager', '2024-02-01', 95000.00, 'Alexandria, Egypt', 'Emergency Contact: +20 100 888 7777', 'Experienced sales manager', 'active'),
('sarah.johnson@space.com', 'Sarah Johnson', '+20 100 345 6789', 'Sales', 'Senior Sales Representative', '2024-03-01', 75000.00, 'Giza, Egypt', 'Emergency Contact: +20 100 777 6666', 'Top performing sales rep', 'active'),
('mike.chen@space.com', 'Mike Chen', '+20 100 456 7890', 'Operations', 'Operations Manager', '2024-04-01', 85000.00, 'Cairo, Egypt', 'Emergency Contact: +20 100 666 5555', 'Operations and logistics expert', 'active'),
('emma.davis@space.com', 'Emma Davis', '+20 100 567 8901', 'Finance', 'Finance Manager', '2024-05-01', 90000.00, 'Cairo, Egypt', 'Emergency Contact: +20 100 555 4444', 'Financial operations specialist', 'active'),
('lisa.wang@space.com', 'Lisa Wang', '+20 100 678 9012', 'HR', 'HR Manager', '2024-06-01', 80000.00, 'Alexandria, Egypt', 'Emergency Contact: +20 100 444 3333', 'Human resources professional', 'active'),
('alex.thompson@space.com', 'Alex Thompson', '+20 100 789 0123', 'Sales', 'Sales Representative', '2024-07-01', 65000.00, 'Giza, Egypt', 'Emergency Contact: +20 100 333 2222', 'Junior sales representative', 'active'),
('maria.garcia@space.com', 'Maria Garcia', '+20 100 890 1234', 'Marketing', 'Marketing Specialist', '2024-08-01', 70000.00, 'Cairo, Egypt', 'Emergency Contact: +20 100 222 1111', 'Digital marketing expert', 'active'),
('david.wilson@space.com', 'David Wilson', '+20 100 901 2345', 'Operations', 'Booth Coordinator', '2024-09-01', 60000.00, 'Alexandria, Egypt', 'Emergency Contact: +20 100 111 0000', 'Exhibition booth specialist', 'active'),
('jane.employee@space.com', 'Jane Employee', '+20 100 012 3456', 'Customer Service', 'Customer Support', '2024-10-01', 55000.00, 'Giza, Egypt', 'Emergency Contact: +20 100 000 9999', 'Customer service representative', 'active')
ON CONFLICT (email) DO NOTHING;

-- Get role IDs for assignments
DO $$
DECLARE
    admin_role_id UUID;
    sales_manager_role_id UUID;
    sales_rep_role_id UUID;
    operations_manager_role_id UUID;
    finance_manager_role_id UUID;
    hr_manager_role_id UUID;
    employee_role_id UUID;
    
    admin_user_id UUID;
    john_user_id UUID;
    sarah_user_id UUID;
    mike_user_id UUID;
    emma_user_id UUID;
    lisa_user_id UUID;
    alex_user_id UUID;
    maria_user_id UUID;
    david_user_id UUID;
    jane_user_id UUID;
BEGIN
    -- Get role IDs
    SELECT id INTO admin_role_id FROM public.roles_2026_01_10_17_00 WHERE name = 'admin';
    SELECT id INTO sales_manager_role_id FROM public.roles_2026_01_10_17_00 WHERE name = 'sales_manager';
    SELECT id INTO sales_rep_role_id FROM public.roles_2026_01_10_17_00 WHERE name = 'sales_rep';
    SELECT id INTO operations_manager_role_id FROM public.roles_2026_01_10_17_00 WHERE name = 'operations_manager';
    SELECT id INTO finance_manager_role_id FROM public.roles_2026_01_10_17_00 WHERE name = 'finance_manager';
    SELECT id INTO hr_manager_role_id FROM public.roles_2026_01_10_17_00 WHERE name = 'hr_manager';
    SELECT id INTO employee_role_id FROM public.roles_2026_01_10_17_00 WHERE name = 'employee';
    
    -- Get user IDs
    SELECT id INTO admin_user_id FROM public.users_2026_01_10_17_00 WHERE email = 'admin@space.com';
    SELECT id INTO john_user_id FROM public.users_2026_01_10_17_00 WHERE email = 'john.manager@space.com';
    SELECT id INTO sarah_user_id FROM public.users_2026_01_10_17_00 WHERE email = 'sarah.johnson@space.com';
    SELECT id INTO mike_user_id FROM public.users_2026_01_10_17_00 WHERE email = 'mike.chen@space.com';
    SELECT id INTO emma_user_id FROM public.users_2026_01_10_17_00 WHERE email = 'emma.davis@space.com';
    SELECT id INTO lisa_user_id FROM public.users_2026_01_10_17_00 WHERE email = 'lisa.wang@space.com';
    SELECT id INTO alex_user_id FROM public.users_2026_01_10_17_00 WHERE email = 'alex.thompson@space.com';
    SELECT id INTO maria_user_id FROM public.users_2026_01_10_17_00 WHERE email = 'maria.garcia@space.com';
    SELECT id INTO david_user_id FROM public.users_2026_01_10_17_00 WHERE email = 'david.wilson@space.com';
    SELECT id INTO jane_user_id FROM public.users_2026_01_10_17_00 WHERE email = 'jane.employee@space.com';
    
    -- Assign roles to users
    INSERT INTO public.user_roles_2026_01_10_17_00 (user_id, role_id, assigned_by) VALUES
    (admin_user_id, admin_role_id, admin_user_id),
    (john_user_id, sales_manager_role_id, admin_user_id),
    (sarah_user_id, sales_rep_role_id, admin_user_id),
    (mike_user_id, operations_manager_role_id, admin_user_id),
    (emma_user_id, finance_manager_role_id, admin_user_id),
    (lisa_user_id, hr_manager_role_id, admin_user_id),
    (alex_user_id, sales_rep_role_id, admin_user_id),
    (maria_user_id, employee_role_id, admin_user_id),
    (david_user_id, employee_role_id, admin_user_id),
    (jane_user_id, employee_role_id, admin_user_id)
    ON CONFLICT (user_id, role_id) DO NOTHING;
    
    -- Create default credentials for all users (password: 'password123')
    INSERT INTO public.user_credentials_2026_01_10_17_00 (user_id, email, password_hash) VALUES
    (admin_user_id, 'admin@space.com', 'password123'),
    (john_user_id, 'john.manager@space.com', 'password123'),
    (sarah_user_id, 'sarah.johnson@space.com', 'password123'),
    (mike_user_id, 'mike.chen@space.com', 'password123'),
    (emma_user_id, 'emma.davis@space.com', 'password123'),
    (lisa_user_id, 'lisa.wang@space.com', 'password123'),
    (alex_user_id, 'alex.thompson@space.com', 'password123'),
    (maria_user_id, 'maria.garcia@space.com', 'password123'),
    (david_user_id, 'david.wilson@space.com', 'password123'),
    (jane_user_id, 'jane.employee@space.com', 'password123')
    ON CONFLICT (email) DO NOTHING;
END $$;

-- Assign permissions to roles (Super Admin gets all permissions)
DO $$
DECLARE
    super_admin_role_id UUID;
    admin_role_id UUID;
    sales_manager_role_id UUID;
    sales_rep_role_id UUID;
    operations_manager_role_id UUID;
    finance_manager_role_id UUID;
    hr_manager_role_id UUID;
    employee_role_id UUID;
    viewer_role_id UUID;
    perm_id UUID;
BEGIN
    -- Get role IDs
    SELECT id INTO super_admin_role_id FROM public.roles_2026_01_10_17_00 WHERE name = 'super_admin';
    SELECT id INTO admin_role_id FROM public.roles_2026_01_10_17_00 WHERE name = 'admin';
    SELECT id INTO sales_manager_role_id FROM public.roles_2026_01_10_17_00 WHERE name = 'sales_manager';
    SELECT id INTO sales_rep_role_id FROM public.roles_2026_01_10_17_00 WHERE name = 'sales_rep';
    SELECT id INTO operations_manager_role_id FROM public.roles_2026_01_10_17_00 WHERE name = 'operations_manager';
    SELECT id INTO finance_manager_role_id FROM public.roles_2026_01_10_17_00 WHERE name = 'finance_manager';
    SELECT id INTO hr_manager_role_id FROM public.roles_2026_01_10_17_00 WHERE name = 'hr_manager';
    SELECT id INTO employee_role_id FROM public.roles_2026_01_10_17_00 WHERE name = 'employee';
    SELECT id INTO viewer_role_id FROM public.roles_2026_01_10_17_00 WHERE name = 'viewer';
    
    -- Super Admin gets all permissions
    FOR perm_id IN SELECT id FROM public.permissions_2026_01_10_17_00 LOOP
        INSERT INTO public.role_permissions_2026_01_10_17_00 (role_id, permission_id) 
        VALUES (super_admin_role_id, perm_id) ON CONFLICT DO NOTHING;
    END LOOP;
    
    -- Admin gets most permissions (excluding some sensitive ones)
    FOR perm_id IN SELECT id FROM public.permissions_2026_01_10_17_00 WHERE name NOT LIKE '%delete%' OR name IN ('clients_delete', 'deals_delete', 'tasks_delete') LOOP
        INSERT INTO public.role_permissions_2026_01_10_17_00 (role_id, permission_id) 
        VALUES (admin_role_id, perm_id) ON CONFLICT DO NOTHING;
    END LOOP;
    
    -- Sales Manager permissions
    FOR perm_id IN SELECT id FROM public.permissions_2026_01_10_17_00 WHERE 
        name IN ('dashboard_view', 'clients_view', 'clients_create', 'clients_edit', 'deals_view', 'deals_create', 'deals_edit', 'deals_delete', 'tasks_view', 'tasks_create', 'tasks_edit', 'hr_view') LOOP
        INSERT INTO public.role_permissions_2026_01_10_17_00 (role_id, permission_id) 
        VALUES (sales_manager_role_id, perm_id) ON CONFLICT DO NOTHING;
    END LOOP;
    
    -- Sales Rep permissions
    FOR perm_id IN SELECT id FROM public.permissions_2026_01_10_17_00 WHERE 
        name IN ('dashboard_view', 'clients_view', 'clients_edit', 'deals_view', 'deals_create', 'deals_edit', 'tasks_view', 'tasks_create', 'tasks_edit') LOOP
        INSERT INTO public.role_permissions_2026_01_10_17_00 (role_id, permission_id) 
        VALUES (sales_rep_role_id, perm_id) ON CONFLICT DO NOTHING;
    END LOOP;
    
    -- Operations Manager permissions
    FOR perm_id IN SELECT id FROM public.permissions_2026_01_10_17_00 WHERE 
        name IN ('dashboard_view', 'booths_view', 'booths_create', 'booths_edit', 'booths_delete', 'clients_view', 'deals_view', 'tasks_view', 'tasks_create', 'tasks_edit') LOOP
        INSERT INTO public.role_permissions_2026_01_10_17_00 (role_id, permission_id) 
        VALUES (operations_manager_role_id, perm_id) ON CONFLICT DO NOTHING;
    END LOOP;
    
    -- Finance Manager permissions
    FOR perm_id IN SELECT id FROM public.permissions_2026_01_10_17_00 WHERE 
        name IN ('dashboard_view', 'payments_view', 'payments_create', 'payments_edit', 'clients_view', 'deals_view', 'tasks_view', 'tasks_create', 'tasks_edit') LOOP
        INSERT INTO public.role_permissions_2026_01_10_17_00 (role_id, permission_id) 
        VALUES (finance_manager_role_id, perm_id) ON CONFLICT DO NOTHING;
    END LOOP;
    
    -- HR Manager permissions
    FOR perm_id IN SELECT id FROM public.permissions_2026_01_10_17_00 WHERE 
        name IN ('dashboard_view', 'hr_view', 'hr_create', 'hr_edit', 'hr_delete', 'users_view', 'users_create', 'users_edit', 'tasks_view', 'tasks_create', 'tasks_edit') LOOP
        INSERT INTO public.role_permissions_2026_01_10_17_00 (role_id, permission_id) 
        VALUES (hr_manager_role_id, perm_id) ON CONFLICT DO NOTHING;
    END LOOP;
    
    -- Employee permissions (basic access)
    FOR perm_id IN SELECT id FROM public.permissions_2026_01_10_17_00 WHERE 
        name IN ('dashboard_view', 'clients_view', 'deals_view', 'tasks_view', 'tasks_create', 'tasks_edit') LOOP
        INSERT INTO public.role_permissions_2026_01_10_17_00 (role_id, permission_id) 
        VALUES (employee_role_id, perm_id) ON CONFLICT DO NOTHING;
    END LOOP;
    
    -- Viewer permissions (read-only)
    FOR perm_id IN SELECT id FROM public.permissions_2026_01_10_17_00 WHERE name LIKE '%_view' LOOP
        INSERT INTO public.role_permissions_2026_01_10_17_00 (role_id, permission_id) 
        VALUES (viewer_role_id, perm_id) ON CONFLICT DO NOTHING;
    END LOOP;
END $$;