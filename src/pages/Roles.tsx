import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { roleService, permissionService, userService } from "@/services/supabaseService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Shield,
  Plus,
  Search,
  MoreHorizontal,
  Users,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  X,
  Settings,
  Lock,
  UserCheck,
  RefreshCw,
  Download,
  TrendingUp,
  Calendar,
  Crown,
  Key,
  Activity
} from "lucide-react";

const Roles = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      setLoading(true);
      
      // Load roles, permissions, and users
      const [rolesData, permissionsData, usersData] = await Promise.all([
        roleService.getAll(),
        permissionService.getAll(),
        userService.getAll()
      ]);
      
      setRoles(rolesData || []);
      setPermissions(permissionsData || []);
      setUsers(usersData || []);
    } catch (error) {
      console.error("Error loading roles:", error);
      toast({
        title: "Loading Error",
        description: "Failed to load roles data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const modules = [
    { key: "dashboard", name: "Dashboard", description: "Main dashboard and analytics" },
    { key: "clients", name: "Client Management", description: "Client database and relationships" },
    { key: "deals", name: "Deals Pipeline", description: "Sales deals and opportunities" },
    { key: "booths", name: "Booth Management", description: "Exhibition booth allocation" },
    { key: "payments", name: "Payment Management", description: "Invoicing and payments" },
    { key: "documents", name: "Document Management", description: "Contracts and documents" },
    { key: "tasks", name: "Task Management", description: "Task tracking and assignment" },
    { key: "hr", name: "HR & KPIs", description: "Human resources management" },
    { key: "settings", name: "System Settings", description: "System configuration" },
  ];

  // Filter roles based on search
  const filteredRoles = roles.filter(role => 
    searchTerm === "" || 
    role.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const roleStats = {
    totalRoles: roles.length,
    systemRoles: roles.filter(r => r.is_system_role).length,
    customRoles: roles.filter(r => !r.is_system_role).length,
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === "active").length,
  };

  const handleDeleteRole = async (roleId: string) => {
    try {
      await roleService.delete(roleId);
      toast({
        title: "Role Deleted",
        description: "Role has been removed from the system",
      });
      loadRoles();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete role",
        variant: "destructive",
      });
    }
  };

  const getPermissionIcon = (hasPermission: boolean) => {
    return hasPermission ? (
      <CheckCircle className="w-4 h-4 text-green-600" />
    ) : (
      <X className="w-4 h-4 text-red-600" />
    );
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

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-12">
            <div className="flex items-center justify-center">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mr-3" />
              <p className="text-lg text-gray-600">Loading roles...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="w-8 h-8 text-purple-600" />
            User Roles & Permissions
          </h1>
          <p className="text-gray-600 mt-1">
            Manage user roles, permissions, and access control
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => loadRoles()} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Role KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Roles</p>
                <p className="text-2xl font-bold">{roleStats.totalRoles}</p>
              </div>
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-xs">
                <Crown className="w-3 h-3 mr-1" />
                System roles
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Custom Roles</p>
                <p className="text-2xl font-bold">{roleStats.customRoles}</p>
              </div>
              <Settings className="w-8 h-8 text-blue-600" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-xs">
                User-defined
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold">{roleStats.totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-xs">
                Active accounts
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold">{roleStats.activeUsers}</p>
              </div>
              <UserCheck className="w-8 h-8 text-teal-600" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-xs">
                {roleStats.totalUsers > 0 ? ((roleStats.activeUsers / roleStats.totalUsers) * 100).toFixed(1) : 0}% active
              </Badge>
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
              <Key className="w-8 h-8 text-orange-600" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-xs">
                System wide
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="roles" className="space-y-6">
        <TabsList>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Search & Filter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search roles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="text-sm text-gray-600">
                  {filteredRoles.length} of {roles.length} roles
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Role Cards */}
          <div className="space-y-4">
            {filteredRoles.map((role) => (
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
                          {role.is_system_role && (
                            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                              <Crown className="w-3 h-3 mr-1" />
                              System
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {users.filter(u => {
                              const userRoles = parseRoles(u.roles);
                              return userRoles.some(ur => ur.role_name === role.name);
                            }).length} users
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-2">{role.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Created {new Date(role.created_at).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {users.filter(u => {
                              const userRoles = parseRoles(u.roles);
                              return userRoles.some(ur => ur.role_name === role.name);
                            }).length} users
                          </div>
                          <div className="flex items-center gap-1">
                            <Activity className="w-4 h-4" />
                            {role.is_system_role ? "System" : "Custom"}
                          </div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Role
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Users className="w-4 h-4 mr-2" />
                            Manage Users
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {!role.is_system_role && (
                            <DropdownMenuItem 
                              onClick={() => handleDeleteRole(role.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Key Permissions Preview */}
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Key Permissions</p>
                      <div className="flex flex-wrap gap-2">
                        {modules.slice(0, 6).map((module) => (
                          <Badge key={module.key} variant="outline" className="text-xs">
                            <CheckCircle className="w-3 h-3 mr-1 text-green-600" />
                            {module.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage user accounts and role assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">User management coming soon</h3>
                <p className="text-gray-600">
                  Assign roles, manage permissions, and control user access
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Permission Matrix</CardTitle>
              <CardDescription>Detailed view of all role permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Key className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Permission matrix coming soon</h3>
                <p className="text-gray-600">
                  Comprehensive permission overview and management
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Roles;