import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { userService, roleService, permissionService } from "@/services/supabaseService";
import { supabase } from '@/integrations/supabase/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Users,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  UserCheck,
  UserX,
  Shield,
  Mail,
  Phone,
  Calendar,
  Building2,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Download,
  TrendingUp,
  Crown,
  Settings,
  Key,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  User,
  Flag,
  Activity
} from "lucide-react";

const UserManagement = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  
  // Dialog states
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [showCreateRole, setShowCreateRole] = useState(false);
  const [showEditRole, setShowEditRole] = useState(false);
  const [showAssignRoles, setShowAssignRoles] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [passwordChangeUser, setPasswordChangeUser] = useState(null);
  
  // Form states
  const [userForm, setUserForm] = useState({
    email: '',
    full_name: '',
    phone: '',
    department: '',
    position: '',
    hire_date: '',
    salary: '',
    address: '',
    emergency_contact: '',
    notes: '',
    status: 'active'
  });
  
  const [roleForm, setRoleForm] = useState({
    name: '',
    display_name: '',
    description: '',
    color: '#6B7280',
    selectedPermissions: []
  });

  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  const [assignRoleForm, setAssignRoleForm] = useState({
    selectedRoles: []
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('📊 UserManagement: Starting loadData...');
      
      console.log('📊 UserManagement: Loading roles...');
      const rolesData = await roleService.getAll();
      console.log('📊 UserManagement: Roles result:', rolesData);
      
      console.log('📊 UserManagement: Loading permissions...');
      const permissionsData = await permissionService.getAll();
      console.log('📊 UserManagement: Permissions result:', permissionsData);
      
      console.log('📊 UserManagement: Loading users...');
      const usersData = await userService.getAll();
      console.log('📊 UserManagement: Users result:', usersData);
      
      setUsers(usersData || []);
      setRoles(rolesData || []);
      setPermissions(permissionsData || []);
      
      console.log('📊 UserManagement: Final state set:', { users: usersData?.length, roles: rolesData?.length, permissions: permissionsData?.length });
    } catch (error) {
      console.error("Error loading data:", error);
      
      toast({
        title: "Loading Error",
        description: "Failed to load user management data. Please try again.",
        variant: "destructive",
      });
      
      // Set empty arrays as fallback
      setUsers([]);
      setRoles([]);
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncCredentials = async () => {
    try {
      setLoading(true);
      console.log('🔄 UserManagement: Syncing user credentials...');
      
      // Get all users
      const { data: allUsers, error: queryError } = await supabase
        .from('users_2026_01_10_17_00')
        .select('id, email, full_name')
        .not('email', 'is', null);
      
      if (queryError) {
        throw queryError;
      }
      
      let createdCount = 0;
      
      for (const user of allUsers || []) {
        try {
          // Try to create credentials for each user with default password
          await userService.createCredentials(user.id, user.email, 'password123');
          createdCount++;
          console.log(`✅ Created credentials for: ${user.email}`);
        } catch (error: any) {
          // Skip if credentials already exist
          if (error.message?.includes('duplicate') || error.code === '23505') {
            console.log(`ℹ️ Credentials already exist for: ${user.email}`);
          } else {
            console.error(`❌ Failed to create credentials for ${user.email}:`, error);
          }
        }
      }
      
      toast({
        title: "Credentials Sync Complete",
        description: `Processed ${allUsers?.length || 0} users. Created ${createdCount} new credentials. Default password: 'password123'`,
      });
      
    } catch (error: any) {
      console.error('🚨 UserManagement: Sync error:', error);
      toast({
        title: "Sync Failed",
        description: error.message || "Failed to sync user credentials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const parseRoles = (rolesData) => {
    try {
      if (typeof rolesData === 'string') {
        return JSON.parse(rolesData);
      }
      return Array.isArray(rolesData) ? rolesData : [];
    } catch {
      return [];
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'suspended': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDepartments = () => {
    const departments = [...new Set(users.map(user => user.department).filter(Boolean))];
    return departments.sort();
  };

  const getRoleNames = () => {
    return roles.map(role => ({ id: role.id, name: role.name, display_name: role.display_name }));
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.position?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || user.department === departmentFilter;
    
    let matchesRole = roleFilter === 'all';
    if (!matchesRole && user.roles) {
      const userRoles = parseRoles(user.roles);
      matchesRole = userRoles.some(role => role.role_name === roleFilter);
    }
    
    return matchesSearch && matchesStatus && matchesDepartment && matchesRole;
  });

  const handleCreateUser = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const userData = {
        ...userForm,
        salary: userForm.salary ? parseFloat(userForm.salary) : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      await userService.create(userData);
      
      toast({
        title: "User Created",
        description: `User "${userForm.full_name}" has been created successfully`,
      });
      
      setShowCreateUser(false);
      setUserForm({
        email: '', full_name: '', phone: '', department: '', position: '',
        hire_date: '', salary: '', address: '', emergency_contact: '', notes: '', status: 'active'
      });
      
      await loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create user",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    
    if (!selectedUser) return;
    
    try {
      setLoading(true);
      
      const updates = {
        ...userForm,
        salary: userForm.salary ? parseFloat(userForm.salary) : null
      };
      
      await userService.update(selectedUser.id, updates);
      
      toast({
        title: "User Updated",
        description: `User "${userForm.full_name}" has been updated successfully`,
      });
      
      setShowEditUser(false);
      setSelectedUser(null);
      
      await loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteTarget) return;
    
    try {
      setLoading(true);
      
      await userService.delete(deleteTarget.id);
      
      toast({
        title: "User Deleted",
        description: `User "${deleteTarget.full_name}" has been deleted successfully`,
      });
      
      setShowDeleteDialog(false);
      setDeleteTarget(null);
      
      await loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAllDemoUsers = async () => {
    const demoUsers = users.filter(user => user.is_demo_user);
    
    if (demoUsers.length === 0) {
      toast({
        title: "No Demo Users",
        description: "No demo users found to delete",
      });
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete all ${demoUsers.length} demo users? This action cannot be undone.`
    );
    if (!confirmed) return;
    
    try {
      setLoading(true);
      
      // Delete all demo users
      for (const user of demoUsers) {
        await userService.delete(user.id);
      }
      
      toast({
        title: "Demo Users Deleted",
        description: `Successfully deleted ${demoUsers.length} demo users`,
      });
      
      await loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete some demo users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const roleData = {
        name: roleForm.name.toLowerCase().replace(/\s+/g, '_'),
        display_name: roleForm.display_name,
        description: roleForm.description,
        color: roleForm.color,
        is_system_role: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      await roleService.create(roleData);
      
      toast({
        title: "Role Created",
        description: `Role "${roleForm.display_name}" has been created successfully`,
      });
      
      setShowCreateRole(false);
      setRoleForm({
        name: '', display_name: '', description: '', color: '#6B7280', selectedPermissions: []
      });
      
      await loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create role",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRole = async () => {
    if (!deleteTarget) return;
    
    try {
      setLoading(true);
      
      await roleService.delete(deleteTarget.id);
      
      toast({
        title: "Role Deleted",
        description: `Role "${deleteTarget.display_name}" has been deleted successfully`,
      });
      
      setShowDeleteDialog(false);
      setDeleteTarget(null);
      
      await loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete role",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditRole = async (e) => {
    e.preventDefault();
    if (!selectedRole) return;
    
    try {
      setLoading(true);
      
      const updates = {
        display_name: roleForm.display_name,
        description: roleForm.description,
        color: roleForm.color
      };
      
      await roleService.update(selectedRole.id, updates);
      
      toast({
        title: "Role Updated",
        description: `Role "${roleForm.display_name}" has been updated successfully`,
      });
      
      setShowEditRole(false);
      setSelectedRole(null);
      
      await loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update role",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (!passwordChangeUser) return;
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirmation do not match",
        variant: "destructive",
      });
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      
      await userService.updatePassword(passwordChangeUser.id, passwordForm.newPassword);
      
      toast({
        title: "Password Updated",
        description: `Password for "${passwordChangeUser.full_name}" has been updated successfully`,
      });
      
      setShowChangePassword(false);
      setPasswordChangeUser(null);
      setPasswordForm({ newPassword: '', confirmPassword: '' });
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAssignRoles = async (e) => {
    e.preventDefault();
    
    if (!selectedUser) return;
    
    try {
      setLoading(true);
      
      // First, remove all existing roles for the user
      const currentRoles = parseRoles(selectedUser.roles);
      for (const role of currentRoles) {
        await userService.removeRole(selectedUser.id, role.role_id);
      }
      
      // Then assign the new roles
      for (const roleId of assignRoleForm.selectedRoles) {
        await userService.assignRole(selectedUser.id, roleId);
      }
      
      toast({
        title: "Roles Updated",
        description: `Roles for "${selectedUser.full_name}" have been updated successfully`,
      });
      
      setShowAssignRoles(false);
      setSelectedUser(null);
      setAssignRoleForm({ selectedRoles: [] });
      
      await loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign roles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    try {
      const exportData = filteredUsers.map(user => {
        const userRoles = parseRoles(user.roles);
        return {
          'Email': user.email,
          'Full Name': user.full_name,
          'Phone': user.phone || '',
          'Department': user.department || '',
          'Position': user.position || '',
          'Hire Date': user.hire_date || '',
          'Salary': user.salary || '',
          'Status': user.status,
          'Roles': userRoles.map(role => role.role_display_name).join(', '),
          'Address': user.address || '',
          'Emergency Contact': user.emergency_contact || '',
          'Notes': user.notes || '',
          'Created At': user.created_at ? new Date(user.created_at).toLocaleDateString() : ''
        };
      });

      const headers = Object.keys(exportData[0] || {});
      const csvContent = [
        headers.join(','),
        ...exportData.map(row => 
          headers.map(header => {
            const value = row[header];
            return typeof value === 'string' && (value.includes(',') || value.includes('"')) 
              ? `"${value.replace(/"/g, '""')}"` 
              : value;
          }).join(',')
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `users-export-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export Successful",
        description: `Exported ${exportData.length} users to CSV file`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export user data",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-12">
            <div className="flex items-center justify-center">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mr-3" />
              <p className="text-lg text-gray-600">Loading user management data...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-8 h-8 text-blue-600" />
            User Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage users, roles, and permissions across the system
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExport} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button 
            onClick={() => loadData()} 
            variant="outline" 
            size="sm"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
          <Button 
            onClick={handleSyncCredentials}
            variant="outline" 
            size="sm"
            disabled={loading}
          >
            <Key className="w-4 h-4 mr-2" />
            Sync Credentials
          </Button>
          <Button 
            onClick={() => setShowCreateRole(true)}
            variant="outline"
            className="border-purple-200 text-purple-700 hover:bg-purple-50"
          >
            <Shield className="w-4 h-4 mr-2" />
            Add Role
          </Button>
          <Button 
            onClick={() => setShowCreateUser(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters & Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger className="w-48">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Filter by department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {getDepartments().map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-48">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      {getRoleNames().map(role => (
                        <SelectItem key={role.id} value={role.name}>{role.display_name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    onClick={() => setShowCreateUser(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                  <Button 
                    onClick={handleDeleteAllDemoUsers}
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Demo Users
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold">{users.length}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Users</p>
                    <p className="text-2xl font-bold">
                      {users.filter(u => u.status === 'active').length}
                    </p>
                  </div>
                  <UserCheck className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Departments</p>
                    <p className="text-2xl font-bold">
                      {getDepartments().length}
                    </p>
                  </div>
                  <Building2 className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Roles</p>
                    <p className="text-2xl font-bold">{roles.length}</p>
                  </div>
                  <Shield className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Info */}
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">
                Showing {filteredUsers.length} of {users.length} users
                {searchTerm && ` matching "${searchTerm}"`}
                {statusFilter !== 'all' && ` with status "${statusFilter}"`}
                {departmentFilter !== 'all' && ` in "${departmentFilter}"`}
                {roleFilter !== 'all' && ` with role "${roleFilter}"`}
              </p>
            </CardContent>
          </Card>

          {/* Users Grid */}
          <Card>
            <CardHeader>
              <CardTitle>
                System Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredUsers.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No users found</h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm || statusFilter !== 'all' || departmentFilter !== 'all' || roleFilter !== 'all'
                      ? 'Try adjusting your search or filter criteria.' 
                      : 'No user data available.'}
                  </p>
                  <Button onClick={() => loadData()}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh Data
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredUsers.map((user) => {
                    const userRoles = parseRoles(user.roles);
                    return (
                      <Card key={user.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            {/* Header */}
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <User className="w-5 h-5 text-gray-500" />
                                  <h3 className="text-lg font-semibold text-gray-900">
                                    {user.full_name}
                                  </h3>
                                  {user.is_demo_user && (
                                    <Badge variant="outline" className="text-orange-600 border-orange-200">
                                      Demo User
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-gray-600 mb-1">{user.email}</p>
                                <p className="text-sm text-gray-500">{user.department} • {user.position}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={getStatusColor(user.status)} variant="secondary">
                                  {user.status}
                                </Badge>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => {
                                      setSelectedUser(user);
                                      setUserForm({
                                        email: user.email,
                                        full_name: user.full_name,
                                        phone: user.phone || '',
                                        department: user.department || '',
                                        position: user.position || '',
                                        hire_date: user.hire_date || '',
                                        salary: user.salary?.toString() || '',
                                        address: user.address || '',
                                        emergency_contact: user.emergency_contact || '',
                                        notes: user.notes || '',
                                        status: user.status
                                      });
                                      setShowEditUser(true);
                                    }}>
                                      <Edit className="w-4 h-4 mr-2" />
                                      Edit User
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => {
                                      setSelectedUser(user);
                                      setAssignRoleForm({
                                        selectedRoles: userRoles.map(role => role.role_id)
                                      });
                                      setShowAssignRoles(true);
                                    }}>
                                      <Shield className="w-4 h-4 mr-2" />
                                      Assign Roles
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => {
                                      setPasswordChangeUser(user);
                                      setShowChangePassword(true);
                                    }}>
                                      <Key className="w-4 h-4 mr-2" />
                                      Change Password
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                      onClick={() => {
                                        setDeleteTarget(user);
                                        setShowDeleteDialog(true);
                                      }}
                                      className="text-red-600"
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>

                            {/* Details */}
                            <div className="grid md:grid-cols-3 gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-600">Phone:</span>
                                <span className="font-medium">{user.phone || 'N/A'}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-600">Hire Date:</span>
                                <span className="font-medium">
                                  {user.hire_date ? new Date(user.hire_date).toLocaleDateString() : 'N/A'}
                                </span>
                              </div>
                              {user.salary && (
                                <div className="flex items-center gap-2">
                                  <TrendingUp className="w-4 h-4 text-gray-500" />
                                  <span className="text-gray-600">Salary:</span>
                                  <span className="font-medium">
                                    ${user.salary.toLocaleString()}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Roles */}
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-2">Roles:</p>
                              <div className="flex flex-wrap gap-2">
                                {userRoles.length > 0 ? userRoles.map((role, index) => (
                                  <Badge 
                                    key={index} 
                                    variant="outline" 
                                    style={{ borderColor: role.role_color, color: role.role_color }}
                                  >
                                    {role.role_display_name}
                                  </Badge>
                                )) : (
                                  <Badge variant="outline" className="text-gray-500">
                                    No roles assigned
                                  </Badge>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-4 border-t border-gray-200">
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setUserForm({
                                    email: user.email,
                                    full_name: user.full_name,
                                    phone: user.phone || '',
                                    department: user.department || '',
                                    position: user.position || '',
                                    hire_date: user.hire_date || '',
                                    salary: user.salary?.toString() || '',
                                    address: user.address || '',
                                    emergency_contact: user.emergency_contact || '',
                                    notes: user.notes || '',
                                    status: user.status
                                  });
                                  setShowEditUser(true);
                                }}
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setAssignRoleForm({
                                    selectedRoles: userRoles.map(role => role.role_id)
                                  });
                                  setShowAssignRoles(true);
                                }}
                              >
                                <Shield className="w-4 h-4 mr-2" />
                                Roles
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roles Tab */}
        <TabsContent value="roles" className="space-y-6">
          {/* Role Management Header */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Role & Permission Management
              </CardTitle>
              <CardDescription>
                Manage system roles and assign permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setShowCreateRole(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Role
              </Button>
            </CardContent>
          </Card>

          {/* Role Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Roles</p>
                    <p className="text-2xl font-bold">{roles.length}</p>
                  </div>
                  <Shield className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">System Roles</p>
                    <p className="text-2xl font-bold">
                      {roles.filter(r => r.is_system_role).length}
                    </p>
                  </div>
                  <Crown className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Custom Roles</p>
                    <p className="text-2xl font-bold">
                      {roles.filter(r => !r.is_system_role).length}
                    </p>
                  </div>
                  <Settings className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Permissions</p>
                    <p className="text-2xl font-bold">{permissions.length}</p>
                  </div>
                  <Key className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                System Roles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {roles.map((role) => (
                  <Card key={role.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div 
                                className="w-4 h-4 rounded-full" 
                                style={{ backgroundColor: role.color }}
                              />
                              <h3 className="text-lg font-semibold text-gray-900">
                                {role.display_name}
                              </h3>
                              <Badge variant="outline" className="text-xs">
                                {role.name}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {role.is_system_role && (
                              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                                <Crown className="w-3 h-3 mr-1" />
                                System
                              </Badge>
                            )}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => {
                                  setSelectedRole(role);
                                  setRoleForm({
                                    name: role.name,
                                    display_name: role.display_name,
                                    description: role.description || '',
                                    color: role.color || '#6B7280',
                                    selectedPermissions: []
                                  });
                                  setShowEditRole(true);
                                }}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit Role
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  setSelectedRole(role);
                                  setShowEditRole(true);
                                }}>
                                  <Key className="w-4 h-4 mr-2" />
                                  Manage Permissions
                                </DropdownMenuItem>
                                {!role.is_system_role && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                      onClick={() => {
                                        setDeleteTarget(role);
                                        setShowDeleteDialog(true);
                                      }}
                                      className="text-red-600"
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        {/* Description */}
                        <div>
                          <p className="text-gray-600">{role.description}</p>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>Users: {users.filter(u => {
                            const userRoles = parseRoles(u.roles);
                            return userRoles.some(ur => ur.role_name === role.name);
                          }).length}</span>
                          <span>{role.is_system_role ? 'System Role' : 'Custom Role'}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Permissions Tab */}
        <TabsContent value="permissions" className="space-y-6">
          {/* Permission Management Header */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                Permission Management
              </CardTitle>
              <CardDescription>
                View and manage system permissions by module
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Permission Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Permissions</p>
                    <p className="text-2xl font-bold">{permissions.length}</p>
                  </div>
                  <Key className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Modules</p>
                    <p className="text-2xl font-bold">
                      {[...new Set(permissions.map(p => p.module))].length}
                    </p>
                  </div>
                  <Activity className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Actions</p>
                    <p className="text-2xl font-bold">
                      {[...new Set(permissions.map(p => p.action))].length}
                    </p>
                  </div>
                  <Settings className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Role Assignments</p>
                    <p className="text-2xl font-bold">
                      {users.reduce((total, user) => {
                        const userRoles = parseRoles(user.roles);
                        return total + userRoles.length;
                      }, 0)}
                    </p>
                  </div>
                  <Flag className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Permissions by Module */}
          <Card>
            <CardHeader>
              <CardTitle>
                Permissions by Module
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[...new Set(permissions.map(p => p.module))].map(module => {
                  const modulePermissions = permissions.filter(p => p.module === module);
                  return (
                    <Card key={module} className="border-l-4 border-l-blue-500">
                      <CardHeader>
                        <CardTitle className="text-lg">
                          {module} Module ({modulePermissions.length} permissions)
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {modulePermissions.map(permission => (
                            <Card key={permission.id} className="border border-gray-200">
                              <CardContent className="p-4">
                                <div className="space-y-2">
                                  <h4 className="font-medium text-gray-900">
                                    {permission.display_name}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    Action: {permission.action}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {permission.description}
                                  </p>
                                </div>
                                <Badge variant="outline" className="mt-2 text-xs">
                                  {permission.name}
                                </Badge>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create User Dialog */}
      <Dialog open={showCreateUser} onOpenChange={setShowCreateUser}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateUser}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                    placeholder="john.smith@company.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    value={userForm.full_name}
                    onChange={(e) => setUserForm({...userForm, full_name: e.target.value})}
                    placeholder="John Smith"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={userForm.phone}
                    onChange={(e) => setUserForm({...userForm, phone: e.target.value})}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department *</Label>
                  <Select value={userForm.department} onValueChange={(value) => setUserForm({...userForm, department: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Human Resources">Human Resources</SelectItem>
                      <SelectItem value="Information Technology">Information Technology</SelectItem>
                      <SelectItem value="Customer Service">Customer Service</SelectItem>
                      <SelectItem value="Management">Management</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    value={userForm.position}
                    onChange={(e) => setUserForm({...userForm, position: e.target.value})}
                    placeholder="Sales Manager"
                  />
                </div>
                <div>
                  <Label htmlFor="hire_date">Hire Date</Label>
                  <Input
                    id="hire_date"
                    type="date"
                    value={userForm.hire_date}
                    onChange={(e) => setUserForm({...userForm, hire_date: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="salary">Annual Salary ($)</Label>
                  <Input
                    id="salary"
                    type="number"
                    value={userForm.salary}
                    onChange={(e) => setUserForm({...userForm, salary: e.target.value})}
                    placeholder="75000"
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={userForm.status} onValueChange={(value) => setUserForm({...userForm, status: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowCreateUser(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create User"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={showEditUser} onOpenChange={setShowEditUser}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit User: {selectedUser?.full_name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditUser}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit_email">Email Address *</Label>
                  <Input
                    id="edit_email"
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                    placeholder="john.smith@company.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit_full_name">Full Name *</Label>
                  <Input
                    id="edit_full_name"
                    value={userForm.full_name}
                    onChange={(e) => setUserForm({...userForm, full_name: e.target.value})}
                    placeholder="John Smith"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit_phone">Phone Number</Label>
                  <Input
                    id="edit_phone"
                    value={userForm.phone}
                    onChange={(e) => setUserForm({...userForm, phone: e.target.value})}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="edit_department">Department *</Label>
                  <Select value={userForm.department} onValueChange={(value) => setUserForm({...userForm, department: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Human Resources">Human Resources</SelectItem>
                      <SelectItem value="Information Technology">Information Technology</SelectItem>
                      <SelectItem value="Customer Service">Customer Service</SelectItem>
                      <SelectItem value="Management">Management</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit_position">Position</Label>
                  <Input
                    id="edit_position"
                    value={userForm.position}
                    onChange={(e) => setUserForm({...userForm, position: e.target.value})}
                    placeholder="Sales Manager"
                  />
                </div>
                <div>
                  <Label htmlFor="edit_hire_date">Hire Date</Label>
                  <Input
                    id="edit_hire_date"
                    type="date"
                    value={userForm.hire_date}
                    onChange={(e) => setUserForm({...userForm, hire_date: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit_salary">Annual Salary ($)</Label>
                  <Input
                    id="edit_salary"
                    type="number"
                    value={userForm.salary}
                    onChange={(e) => setUserForm({...userForm, salary: e.target.value})}
                    placeholder="75000"
                  />
                </div>
                <div>
                  <Label htmlFor="edit_status">Status</Label>
                  <Select value={userForm.status} onValueChange={(value) => setUserForm({...userForm, status: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {setShowEditUser(false); setSelectedUser(null);}}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update User"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Create Role Dialog */}
      <Dialog open={showCreateRole} onOpenChange={setShowCreateRole}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Role</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateRole}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="role_name">Role Name *</Label>
                <Input
                  id="role_name"
                  value={roleForm.name}
                  onChange={(e) => setRoleForm({...roleForm, name: e.target.value})}
                  placeholder="custom_role"
                  required
                />
              </div>
              <div>
                <Label htmlFor="role_display_name">Display Name *</Label>
                <Input
                  id="role_display_name"
                  value={roleForm.display_name}
                  onChange={(e) => setRoleForm({...roleForm, display_name: e.target.value})}
                  placeholder="Custom Role"
                  required
                />
              </div>
              <div>
                <Label htmlFor="role_description">Description</Label>
                <Textarea
                  id="role_description"
                  value={roleForm.description}
                  onChange={(e) => setRoleForm({...roleForm, description: e.target.value})}
                  placeholder="Describe the role's purpose and responsibilities"
                />
              </div>
              <div>
                <Label htmlFor="role_color">Color</Label>
                <Input
                  id="role_color"
                  type="color"
                  value={roleForm.color}
                  onChange={(e) => setRoleForm({...roleForm, color: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowCreateRole(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Role"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={showEditRole} onOpenChange={setShowEditRole}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Role: {selectedRole?.display_name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditRole}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit_role_display_name">Display Name *</Label>
                <Input
                  id="edit_role_display_name"
                  value={roleForm.display_name}
                  onChange={(e) => setRoleForm({...roleForm, display_name: e.target.value})}
                  placeholder="Custom Role"
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit_role_description">Description</Label>
                <Textarea
                  id="edit_role_description"
                  value={roleForm.description}
                  onChange={(e) => setRoleForm({...roleForm, description: e.target.value})}
                  placeholder="Describe the role's purpose and responsibilities"
                />
              </div>
              <div>
                <Label htmlFor="edit_role_color">Color</Label>
                <Input
                  id="edit_role_color"
                  type="color"
                  value={roleForm.color}
                  onChange={(e) => setRoleForm({...roleForm, color: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {setShowEditRole(false); setSelectedRole(null);}}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Role"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Assign Roles Dialog */}
      <Dialog open={showAssignRoles} onOpenChange={setShowAssignRoles}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Assign Roles: {selectedUser?.full_name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAssignRoles}>
            <div className="space-y-4">
              <div>
                <Label>Select Roles</Label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {roles.map(role => (
                    <div key={role.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`role-${role.id}`}
                        checked={assignRoleForm.selectedRoles.includes(role.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setAssignRoleForm({
                              selectedRoles: [...assignRoleForm.selectedRoles, role.id]
                            });
                          } else {
                            setAssignRoleForm({
                              selectedRoles: assignRoleForm.selectedRoles.filter(id => id !== role.id)
                            });
                          }
                        }}
                        className="rounded"
                      />
                      <label htmlFor={`role-${role.id}`} className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: role.color }}
                        />
                        {role.display_name}
                        {role.is_system_role && (
                          <Badge variant="outline" className="text-xs">System</Badge>
                        )}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {setShowAssignRoles(false); setSelectedUser(null);}}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Assigning..." : "Assign Roles"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={showChangePassword} onOpenChange={setShowChangePassword}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Change Password: {passwordChangeUser?.full_name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleChangePassword}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="new_password">New Password *</Label>
                <Input
                  id="new_password"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                  placeholder="Enter new password"
                  required
                />
              </div>
              <div>
                <Label htmlFor="confirm_password">Confirm Password *</Label>
                <Input
                  id="confirm_password"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                  placeholder="Confirm new password"
                  required
                />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {setShowChangePassword(false); setPasswordChangeUser(null);}}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {deleteTarget?.full_name || deleteTarget?.display_name} and all associated data. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={deleteTarget?.email ? handleDeleteUser : handleDeleteRole}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete {deleteTarget?.email ? 'User' : 'Role'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserManagement;