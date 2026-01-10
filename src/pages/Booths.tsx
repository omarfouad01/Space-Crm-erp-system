import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { boothService, type Booth } from '@/services/supabaseService';
import { CreateBoothDialog } from '@/components/forms/CreateBoothDialog';
import { EditBoothDialog } from '@/components/forms/EditBoothDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Building2,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  MapPin,
  DollarSign,
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  Edit,
  Trash2,
  Download,
  RefreshCw,
  Ruler,
  Target,
  Globe,
  Zap,
  Activity,
  XCircle,
  AlertCircle
} from 'lucide-react';

const Booths = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all-status");
  const [typeFilter, setTypeFilter] = useState("all-types");
  const [booths, setBooths] = useState<Booth[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [actionsDialogOpen, setActionsDialogOpen] = useState(false);
  const [selectedBooth, setSelectedBooth] = useState<Booth | null>(null);

  useEffect(() => {
    loadBooths();
  }, []);

  const loadBooths = async () => {
    try {
      setLoading(true);
      console.log('🏢 Booths: Loading booths from database...');
      const data = await boothService.getAll();
      console.log('✅ Booths: Loaded booths:', data?.length, data);
      
      if (!data || data.length === 0) {
        console.log('📝 Booths: No booths found in database, showing empty state');
        setBooths([]);
        return;
      }
      
      console.log('✅ Booths: Set booths data:', data);
      setBooths(data);
    } catch (error) {
      console.error("🚨 Booths: Error loading booths:", error);
      toast({
        title: "Error Loading Booths",
        description: "Failed to load booths from database. Please try refreshing the page.",
        variant: "destructive",
      });
      setBooths([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBooth = async (boothId: string) => {
    if (!confirm('Are you sure you want to delete this booth? This action cannot be undone.')) {
      return;
    }

    try {
      console.log('🗑️ Booths: Deleting booth with ID:', boothId);
      
      // Remove from local state immediately for better UX
      const originalBooths = booths;
      setBooths(prevBooths => prevBooths.filter(booth => booth.id !== boothId));
      
      // Try to delete from backend database
      await boothService.delete(boothId);
      console.log('✅ Booths: Delete successful');
      
      toast({
        title: "Booth Deleted",
        description: "Booth has been permanently removed from the system",
      });
      
      // Force reload to ensure consistency
      setTimeout(() => {
        loadBooths();
      }, 1000);
    } catch (error: any) {
      console.error('🚨 Booths: Error deleting booth:', error);
      // Restore original state on error
      setBooths(booths);
      toast({
        title: "Error",
        description: error.message || "Failed to delete booth",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (boothId: string, newStatus: string) => {
    try {
      console.log('🔄 Booths: Updating booth status:', boothId, newStatus);
      
      // Update local state immediately
      setBooths(prevBooths => 
        prevBooths.map(booth => 
          booth.id === boothId ? { ...booth, status: newStatus } : booth
        )
      );
      
      // Update in database
      await boothService.updateStatus(boothId, newStatus);
      
      toast({
        title: "Status Updated",
        description: `Booth status changed to ${newStatus}`,
      });
    } catch (error: any) {
      console.error('🚨 Booths: Error updating status:', error);
      // Reload to restore correct state
      loadBooths();
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const handleEditBooth = (booth: Booth) => {
    setSelectedBooth(booth);
    setEditDialogOpen(true);
    setActionsDialogOpen(false);
  };

  const handleOpenActions = (booth: Booth) => {
    setSelectedBooth(booth);
    setActionsDialogOpen(true);
  };

  const exportBooths = () => {
    try {
      const csvContent = [
        // CSV Header
        ['Booth Number', 'Booth Code', 'Exhibition', 'Hall', 'Zone', 'Size (sqm)', 'Type', 'Status', 'Total Price', 'Assigned Company'].join(','),
        // CSV Data
        ...filteredBooths.map(booth => [
          booth.booth_number || '',
          booth.booth_code || '',
          `"${booth.expo_name || ''}"`,
          booth.hall || '',
          booth.zone || '',
          booth.size_sqm || '',
          booth.booth_type || '',
          booth.status || '',
          booth.total_price || '',
          `"${booth.assigned_to_company || ''}"`
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `booths_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export Successful",
        description: "Booth data has been exported to CSV",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export booth data",
        variant: "destructive",
      });
    }
  };

  // Filter booths based on search and filters
  const filteredBooths = booths.filter(booth => {
    const matchesSearch = !searchTerm || 
      booth.booth_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booth.booth_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booth.expo_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booth.hall?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booth.zone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booth.assigned_to_company?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all-status" || booth.status === statusFilter;
    const matchesType = typeFilter === "all-types" || booth.booth_type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Calculate statistics
  const stats = {
    total: booths.length,
    available: booths.filter(b => b.status === 'Available').length,
    booked: booths.filter(b => b.status === 'Booked').length,
    reserved: booths.filter(b => b.status === 'Reserved').length,
    occupied: booths.filter(b => b.status === 'Occupied').length,
    maintenance: booths.filter(b => b.status === 'Maintenance').length,
    totalArea: booths.reduce((sum, booth) => sum + (booth.size_sqm || 0), 0),
    totalRevenue: booths.reduce((sum, booth) => sum + (booth.total_price || 0), 0)
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Available': return <CheckCircle className="w-4 h-4" />;
      case 'Booked': return <Target className="w-4 h-4" />;
      case 'Reserved': return <Clock className="w-4 h-4" />;
      case 'Occupied': return <Users className="w-4 h-4" />;
      case 'Maintenance': return <AlertTriangle className="w-4 h-4" />;
      case 'Unavailable': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800 border-green-200';
      case 'Booked': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Reserved': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Occupied': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Maintenance': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Unavailable': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Premium': return <Zap className="w-4 h-4" />;
      case 'Corner': return <Target className="w-4 h-4" />;
      case 'Island': return <Globe className="w-4 h-4" />;
      case 'Peninsula': return <Activity className="w-4 h-4" />;
      default: return <Building2 className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="content-area">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Building2 className="w-8 h-8 text-blue-600" />
              Booth Management
            </h1>
            <p className="text-gray-600 mt-2">Manage exhibition booths, assignments, and availability</p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={() => loadBooths()} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={exportBooths} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Booth
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-between mb-2">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-600">Total Booths</p>
                <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-600">Available</p>
                <p className="text-2xl font-bold text-green-900">{stats.available}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-600">Booked</p>
                <p className="text-2xl font-bold text-blue-900">{stats.booked}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-yellow-600">Reserved</p>
                <p className="text-2xl font-bold text-yellow-900">{stats.reserved}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-600">Occupied</p>
                <p className="text-2xl font-bold text-purple-900">{stats.occupied}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-between mb-2">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-orange-600">Maintenance</p>
                <p className="text-2xl font-bold text-orange-900">{stats.maintenance}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-indigo-100">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-between mb-2">
                <Ruler className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-indigo-600">Total Area</p>
                <p className="text-xl font-bold text-indigo-900">{stats.totalArea.toLocaleString()}</p>
                <p className="text-xs text-indigo-700">sqm</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-600">Total Revenue</p>
                <p className="text-lg font-bold text-emerald-900">{formatCurrency(stats.totalRevenue)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                placeholder="Search booths..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-status">All Status</SelectItem>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Reserved">Reserved</SelectItem>
                  <SelectItem value="Booked">Booked</SelectItem>
                  <SelectItem value="Occupied">Occupied</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="Unavailable">Unavailable</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-48">
                  <Building2 className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-types">All Types</SelectItem>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                  <SelectItem value="Corner">Corner</SelectItem>
                  <SelectItem value="Island">Island</SelectItem>
                  <SelectItem value="Peninsula">Peninsula</SelectItem>
                  <SelectItem value="Inline">Inline</SelectItem>
                  <SelectItem value="Custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Booths List */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Loading booths...</p>
            </div>
          </div>
        ) : filteredBooths.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="space-y-4">
              <Building2 className="w-16 h-16 mx-auto text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900">
                {booths.length === 0 ? "No Booths Found" : "No Matching Booths"}
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {booths.length === 0 
                  ? "Create your first booth to get started with booth management"
                  : "Try adjusting your search criteria or filters"
                }
              </p>
              {booths.length === 0 && (
                <Button onClick={() => setCreateDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Booth
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooths.map((booth) => (
              <Card key={booth.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">
                          {booth.booth_number}
                        </h3>
                        <Badge className={`${getStatusColor(booth.status)} border`}>
                          {getStatusIcon(booth.status)}
                          {booth.status}
                        </Badge>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenActions(booth)}
                          className="hover:bg-gray-100"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                    </DropdownMenu>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">
                      {booth.booth_code}
                    </p>
                    {booth.expo_name && (
                      <p className="text-xs text-blue-600 font-medium">
                        {booth.expo_name}
                      </p>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Location Info */}
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {booth.hall && booth.zone ? `${booth.hall} - ${booth.zone}` : booth.hall || booth.zone || 'Location not set'}
                      </p>
                      {booth.aisle && <p className="text-xs text-gray-500">Aisle: {booth.aisle}</p>}
                    </div>
                  </div>

                  {/* Booth Type and Size */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(booth.booth_type)}
                      <div>
                        <p className="text-xs text-gray-500">Type</p>
                        <p className="text-sm font-medium">{booth.booth_type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Ruler className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Size</p>
                        <p className="text-sm font-medium">{booth.size_sqm} sqm</p>
                      </div>
                    </div>
                  </div>

                  {/* Pricing */}
                  {booth.total_price > 0 && (
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm text-green-700">Total Price:</span>
                      <span className="font-semibold text-green-900">
                        {formatCurrency(booth.total_price, booth.currency)}
                      </span>
                    </div>
                  )}

                  {/* Assignment Info */}
                  {booth.assigned_to_company && (
                    <div className="flex items-start gap-2">
                      <Users className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">Assigned to:</p>
                        <p className="text-sm font-medium">{booth.assigned_to_company}</p>
                        {booth.assigned_to_contact && (
                          <p className="text-xs text-gray-500">{booth.assigned_to_contact}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Features */}
                  {booth.features && booth.features.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {booth.features.slice(0, 3).map((feature: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {booth.features.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{booth.features.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Dialogs */}
        <CreateBoothDialog
          isOpen={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          onSuccess={loadBooths}
        />
        
        <EditBoothDialog
          isOpen={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          onSuccess={loadBooths}
          booth={selectedBooth}
        />

        {/* Actions Dialog */}
        <Dialog open={actionsDialogOpen} onOpenChange={setActionsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Booth Actions: {selectedBooth?.booth_code}
              </DialogTitle>
            </DialogHeader>
            
            {selectedBooth && (
              <div className="space-y-4">
                {/* Quick Actions */}
                <div>
                  <h4 className="font-medium mb-2">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        // View details action
                        setActionsDialogOpen(false);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleEditBooth(selectedBooth)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Booth
                    </Button>
                  </div>
                </div>

                {/* Quick Status Changes */}
                {(selectedBooth.status === 'Available' || selectedBooth.status === 'Reserved') && (
                  <div>
                    <h4 className="font-medium mb-2">Quick Status Changes</h4>
                    <div className="space-y-2">
                      {selectedBooth.status === 'Available' && (
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => {
                            handleStatusChange(selectedBooth.id, 'Reserved');
                            setActionsDialogOpen(false);
                          }}
                        >
                          <Clock className="w-4 h-4 mr-2" />
                          Mark Reserved
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => {
                          handleStatusChange(selectedBooth.id, 'Booked');
                          setActionsDialogOpen(false);
                        }}
                      >
                        <Target className="w-4 h-4 mr-2" />
                        Mark Booked
                      </Button>
                    </div>
                  </div>
                )}

                {/* All Status Options */}
                <div>
                  <h4 className="font-medium mb-2">Change Status</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        handleStatusChange(selectedBooth.id, 'Available');
                        setActionsDialogOpen(false);
                      }}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Available
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        handleStatusChange(selectedBooth.id, 'Reserved');
                        setActionsDialogOpen(false);
                      }}
                    >
                      <Clock className="w-4 h-4 mr-1" />
                      Reserved
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        handleStatusChange(selectedBooth.id, 'Booked');
                        setActionsDialogOpen(false);
                      }}
                    >
                      <Target className="w-4 h-4 mr-1" />
                      Booked
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        handleStatusChange(selectedBooth.id, 'Occupied');
                        setActionsDialogOpen(false);
                      }}
                    >
                      <Users className="w-4 h-4 mr-1" />
                      Occupied
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        handleStatusChange(selectedBooth.id, 'Maintenance');
                        setActionsDialogOpen(false);
                      }}
                    >
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      Maintenance
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        handleStatusChange(selectedBooth.id, 'Unavailable');
                        setActionsDialogOpen(false);
                      }}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Unavailable
                    </Button>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2 text-red-600">Danger Zone</h4>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => {
                      handleDeleteBooth(selectedBooth.id);
                      setActionsDialogOpen(false);
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Booth
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Booths;