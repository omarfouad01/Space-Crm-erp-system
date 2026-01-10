import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { expoService } from "@/services/supabaseService";
import { useCurrency } from "@/contexts/CurrencyContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Crown,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Star,
  Building2,
  DollarSign,
  Users,
  Target,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  RefreshCw,
  Globe,
  Trophy,
  Award,
  Zap
} from "lucide-react";

const Sponsorship = () => {
  const { toast } = useToast();
  const { formatAmount } = useCurrency();
  const [searchTerm, setSearchTerm] = useState("");
  const [tierFilter, setTierFilter] = useState("all-tiers");
  const [expoFilter, setExpoFilter] = useState("all-expos");
  const [statusFilter, setStatusFilter] = useState("all-status");
  const [packages, setPackages] = useState([]);
  const [expos, setExpos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [formData, setFormData] = useState({
    package_name: '',
    tier_level: '',
    price_egp: '',
    max_sponsors: '',
    benefits: '',
    visibility_level: '',
    marketing_materials: '',
    booth_allocation: '',
    additional_services: '',
    status: 'Active',
    expo_id: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('📦 Sponsorship Packages: Loading data...');
      
      // Load expos first
      const exposData = await expoService.getAll();
      console.log('✅ Sponsorship Packages: Loaded expos:', exposData?.length);
      setExpos(exposData || []);
      
      // Load all sponsorship packages from all expos
      const allPackages: any[] = [];
      
      if (exposData && exposData.length > 0) {
        for (const expo of exposData) {
          try {
            // For now, we'll create mock packages since the API might not have this endpoint
            // In a real implementation, you'd call something like: await expoService.getSponsorshipPackages(expo.id)
            const mockPackages = [
              {
                id: `${expo.id}-title`,
                package_name: `${expo.name} - Title Sponsor`,
                tier_level: 'Title',
                price_egp: 500000,
                max_sponsors: 1,
                current_sponsors: 0,
                benefits: 'Exclusive naming rights, premium booth location, VIP access, speaking opportunities',
                visibility_level: 'Premium',
                marketing_materials: 'Logo on all materials, website prominence, press releases',
                booth_allocation: 'Premium 100sqm booth in prime location',
                additional_services: 'Dedicated account manager, custom activation space',
                status: 'Active',
                expo_id: expo.id,
                expo_name: expo.name,
                expo_number: expo.expo_number,
                expo_start_date: expo.start_date,
                expo_end_date: expo.end_date,
                expo_city: expo.city
              },
              {
                id: `${expo.id}-platinum`,
                package_name: `${expo.name} - Platinum Sponsor`,
                tier_level: 'Platinum',
                price_egp: 300000,
                max_sponsors: 3,
                current_sponsors: 1,
                benefits: 'Premium booth location, VIP access, networking events',
                visibility_level: 'High',
                marketing_materials: 'Logo on key materials, website listing',
                booth_allocation: '60sqm booth in premium area',
                additional_services: 'Welcome reception invitation, media kit',
                status: 'Active',
                expo_id: expo.id,
                expo_name: expo.name,
                expo_number: expo.expo_number,
                expo_start_date: expo.start_date,
                expo_end_date: expo.end_date,
                expo_city: expo.city
              },
              {
                id: `${expo.id}-gold`,
                package_name: `${expo.name} - Gold Sponsor`,
                tier_level: 'Gold',
                price_egp: 150000,
                max_sponsors: 5,
                current_sponsors: 3,
                benefits: 'Standard booth, networking access, promotional opportunities',
                visibility_level: 'Medium',
                marketing_materials: 'Logo on select materials, website listing',
                booth_allocation: '40sqm booth in main exhibition area',
                additional_services: 'Networking event access, promotional materials',
                status: 'Active',
                expo_id: expo.id,
                expo_name: expo.name,
                expo_number: expo.expo_number,
                expo_start_date: expo.start_date,
                expo_end_date: expo.end_date,
                expo_city: expo.city
              },
              {
                id: `${expo.id}-silver`,
                package_name: `${expo.name} - Silver Sponsor`,
                tier_level: 'Silver',
                price_egp: 75000,
                max_sponsors: 10,
                current_sponsors: 7,
                benefits: 'Exhibition booth, basic promotional opportunities',
                visibility_level: 'Standard',
                marketing_materials: 'Logo on program, website listing',
                booth_allocation: '25sqm booth in exhibition area',
                additional_services: 'Basic promotional support',
                status: 'Active',
                expo_id: expo.id,
                expo_name: expo.name,
                expo_number: expo.expo_number,
                expo_start_date: expo.start_date,
                expo_end_date: expo.end_date,
                expo_city: expo.city
              }
            ];
            allPackages.push(...mockPackages);
          } catch (error) {
            console.log('⚠️ Sponsorship Packages: Error loading packages for expo:', expo.id, error);
          }
        }
      }
      
      console.log('✅ Sponsorship Packages: Loaded all packages:', allPackages.length);
      setPackages(allPackages);
    } catch (error) {
      console.error("🚨 Sponsorship Packages: Error loading data:", error);
      toast({
        title: "Error Loading Packages",
        description: "Failed to load sponsorship package data. Please try refreshing the page.",
        variant: "destructive",
      });
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePackage = async () => {
    try {
      if (!formData.expo_id) {
        toast({
          title: "Error",
          description: "Please select an exhibition",
          variant: "destructive",
        });
        return;
      }

      const packageData = {
        ...formData,
        price_egp: parseFloat(formData.price_egp) || 0,
        max_sponsors: parseInt(formData.max_sponsors) || 1,
        current_sponsors: 0
      };

      // In a real implementation, you'd call: await expoService.createSponsorshipPackage(formData.expo_id, packageData);
      console.log('Creating package:', packageData);
      
      toast({
        title: "Success",
        description: "Sponsorship package created successfully",
      });

      setShowCreateDialog(false);
      resetForm();
      loadData();
    } catch (error) {
      console.error("Error creating package:", error);
      toast({
        title: "Error",
        description: "Failed to create sponsorship package",
        variant: "destructive",
      });
    }
  };

  const handleEditPackage = async () => {
    try {
      if (!editingPackage) return;

      const packageData = {
        ...formData,
        price_egp: parseFloat(formData.price_egp) || 0,
        max_sponsors: parseInt(formData.max_sponsors) || 1
      };

      // In a real implementation, you'd call: await expoService.updateSponsorshipPackage(editingPackage.expo_id, editingPackage.id, packageData);
      console.log('Updating package:', packageData);
      
      toast({
        title: "Success",
        description: "Sponsorship package updated successfully",
      });

      setShowEditDialog(false);
      setEditingPackage(null);
      resetForm();
      loadData();
    } catch (error) {
      console.error("Error updating package:", error);
      toast({
        title: "Error",
        description: "Failed to update sponsorship package",
        variant: "destructive",
      });
    }
  };

  const handleDeletePackage = async (packageItem) => {
    if (!confirm('Are you sure you want to delete this sponsorship package?')) return;

    try {
      // In a real implementation, you'd call: await expoService.deleteSponsorshipPackage(packageItem.expo_id, packageItem.id);
      console.log('Deleting package:', packageItem.id);
      
      toast({
        title: "Success",
        description: "Sponsorship package deleted successfully",
      });

      loadData();
    } catch (error) {
      console.error("Error deleting package:", error);
      toast({
        title: "Error",
        description: "Failed to delete sponsorship package",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      package_name: '',
      tier_level: '',
      price_egp: '',
      max_sponsors: '',
      benefits: '',
      visibility_level: '',
      marketing_materials: '',
      booth_allocation: '',
      additional_services: '',
      status: 'Active',
      expo_id: ''
    });
  };

  const openEditDialog = (packageItem) => {
    setEditingPackage(packageItem);
    setFormData({
      package_name: packageItem.package_name || '',
      tier_level: packageItem.tier_level || '',
      price_egp: packageItem.price_egp?.toString() || '',
      max_sponsors: packageItem.max_sponsors?.toString() || '',
      benefits: packageItem.benefits || '',
      visibility_level: packageItem.visibility_level || '',
      marketing_materials: packageItem.marketing_materials || '',
      booth_allocation: packageItem.booth_allocation || '',
      additional_services: packageItem.additional_services || '',
      status: packageItem.status || 'Active',
      expo_id: packageItem.expo_id || ''
    });
    setShowEditDialog(true);
  };

  const exportPackages = () => {
    try {
      const csvContent = [
        // CSV Header
        ['Package Name', 'Tier Level', 'Price (EGP)', 'Max Sponsors', 'Current Sponsors', 'Status', 'Exhibition', 'City'].join(','),
        // CSV Data
        ...filteredPackages.map(pkg => [
          `"${pkg.package_name || ''}"`,
          pkg.tier_level || '',
          pkg.price_egp || '',
          pkg.max_sponsors || '',
          pkg.current_sponsors || '',
          pkg.status || '',
          `"${pkg.expo_name || ''}"`,
          pkg.expo_city || ''
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `sponsorship_packages_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export Successful",
        description: "Sponsorship package data has been exported to CSV",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export sponsorship package data",
        variant: "destructive",
      });
    }
  };

  // Filter packages based on search and filters
  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = !searchTerm || 
      pkg.package_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.tier_level?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.expo_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTier = tierFilter === "all-tiers" || pkg.tier_level === tierFilter;
    const matchesExpo = expoFilter === "all-expos" || pkg.expo_id === expoFilter;
    const matchesStatus = statusFilter === "all-status" || pkg.status === statusFilter;

    return matchesSearch && matchesTier && matchesExpo && matchesStatus;
  });

  // Calculate statistics
  const stats = {
    total: packages.length,
    title: packages.filter(p => p.tier_level === 'Title').length,
    platinum: packages.filter(p => p.tier_level === 'Platinum').length,
    gold: packages.filter(p => p.tier_level === 'Gold').length,
    silver: packages.filter(p => p.tier_level === 'Silver').length,
    bronze: packages.filter(p => p.tier_level === 'Bronze').length,
    active: packages.filter(p => p.status === 'Active').length,
    totalRevenue: packages.reduce((sum, pkg) => sum + (pkg.price_egp * pkg.current_sponsors || 0), 0),
    totalSponsors: packages.reduce((sum, pkg) => sum + (pkg.current_sponsors || 0), 0),
    availableSlots: packages.reduce((sum, pkg) => sum + ((pkg.max_sponsors || 0) - (pkg.current_sponsors || 0)), 0)
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'Title': return <Crown className="w-4 h-4" />;
      case 'Platinum': return <Trophy className="w-4 h-4" />;
      case 'Gold': return <Award className="w-4 h-4" />;
      case 'Silver': return <Star className="w-4 h-4" />;
      case 'Bronze': return <Zap className="w-4 h-4" />;
      case 'Supporting': return <Building2 className="w-4 h-4" />;
      default: return <Building2 className="w-4 h-4" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Title': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Platinum': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'Gold': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Silver': return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'Bronze': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Supporting': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 border-green-200';
      case 'Inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Full': return 'bg-red-100 text-red-800 border-red-200';
      case 'Draft': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Crown className="w-8 h-8 text-blue-600" />
            Sponsorship Packages
          </h1>
          <p className="text-gray-600 mt-1">Manage sponsorship packages and partnership tiers</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => loadData()} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={exportPackages} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowCreateDialog(true)} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Package
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Packages</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Packages</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sponsors</p>
                <p className="text-2xl font-bold">{stats.totalSponsors}</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Available Slots</p>
                <p className="text-2xl font-bold">{stats.availableSlots}</p>
              </div>
              <Target className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">{formatAmount(stats.totalRevenue)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search packages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={tierFilter} onValueChange={setTierFilter}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-tiers">All Tiers</SelectItem>
                <SelectItem value="Title">Title</SelectItem>
                <SelectItem value="Platinum">Platinum</SelectItem>
                <SelectItem value="Gold">Gold</SelectItem>
                <SelectItem value="Silver">Silver</SelectItem>
                <SelectItem value="Bronze">Bronze</SelectItem>
                <SelectItem value="Supporting">Supporting</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-status">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Full">Full</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
              </SelectContent>
            </Select>
            <Select value={expoFilter} onValueChange={setExpoFilter}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by exhibition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-expos">All Exhibitions</SelectItem>
                {expos.map((expo) => (
                  <SelectItem key={expo.id} value={expo.id}>
                    {expo.expo_number} - {expo.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Packages List */}
      {loading ? (
        <Card>
          <CardContent className="p-12">
            <div className="flex items-center justify-center">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mr-3" />
              <p className="text-lg text-gray-600">Loading packages...</p>
            </div>
          </CardContent>
        </Card>
      ) : filteredPackages.length === 0 ? (
        <Card>
          <CardContent className="p-12">
            <div className="text-center">
              <Crown className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {packages.length === 0 ? "No Packages Found" : "No Matching Packages"}
              </h3>
              <p className="text-gray-600 mb-6">
                {packages.length === 0 
                  ? "Sponsorship packages will appear here when created for exhibitions"
                  : "Try adjusting your search criteria or filters"
                }
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredPackages.map((pkg) => (
            <Card key={pkg.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center gap-2">
                        <Badge className={getTierColor(pkg.tier_level)} variant="secondary">
                          {getTierIcon(pkg.tier_level)}
                          {pkg.tier_level}
                        </Badge>
                        <Badge className={getStatusColor(pkg.status)} variant="secondary">
                          {pkg.status === 'Active' ? <CheckCircle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                          {pkg.status}
                        </Badge>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {pkg.package_name}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {pkg.benefits}
                    </p>
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
                      <DropdownMenuItem onClick={() => openEditDialog(pkg)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Package
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeletePackage(pkg)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Package
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Exhibition Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-900">{pkg.expo_name}</p>
                        <p className="text-sm text-gray-600">{pkg.expo_number}</p>
                      </div>
                    </div>
                  </div>

                  {/* Package Details */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Package Price</p>
                        <p className="font-medium text-gray-900">
                          {formatAmount(pkg.price_egp || 0)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Sponsors</p>
                        <p className="font-medium text-gray-900">
                          {pkg.current_sponsors || 0}/{pkg.max_sponsors || 0}
                        </p>
                        <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ 
                              width: `${((pkg.current_sponsors || 0) / (pkg.max_sponsors || 1)) * 100}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Visibility Level</p>
                        <p className="font-medium text-gray-900">{pkg.visibility_level}</p>
                      </div>
                    </div>
                    {/* Exhibition Dates */}
                    {pkg.expo_start_date && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <p className="text-sm text-gray-600">
                          {formatDate(pkg.expo_start_date)} - {formatDate(pkg.expo_end_date)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Details */}
                {(pkg.marketing_materials || pkg.booth_allocation || pkg.additional_services) && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      {pkg.marketing_materials && (
                        <div>
                          <p className="font-medium text-gray-700">Marketing Materials:</p>
                          <p className="text-gray-600">{pkg.marketing_materials}</p>
                        </div>
                      )}
                      {pkg.booth_allocation && (
                        <div>
                          <p className="font-medium text-gray-700">Booth Allocation:</p>
                          <p className="text-gray-600">{pkg.booth_allocation}</p>
                        </div>
                      )}
                      {pkg.additional_services && (
                        <div>
                          <p className="font-medium text-gray-700">Additional Services:</p>
                          <p className="text-gray-600">{pkg.additional_services}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Package Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Sponsorship Package</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="package_name">Package Name *</Label>
                  <Input
                    id="package_name"
                    value={formData.package_name}
                    onChange={(e) => setFormData({...formData, package_name: e.target.value})}
                    placeholder="Enter package name"
                  />
                </div>
                <div>
                  <Label htmlFor="tier_level">Tier Level *</Label>
                  <Select value={formData.tier_level} onValueChange={(value) => setFormData({...formData, tier_level: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tier level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Title">Title</SelectItem>
                      <SelectItem value="Platinum">Platinum</SelectItem>
                      <SelectItem value="Gold">Gold</SelectItem>
                      <SelectItem value="Silver">Silver</SelectItem>
                      <SelectItem value="Bronze">Bronze</SelectItem>
                      <SelectItem value="Supporting">Supporting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="price_egp">Price (EGP) *</Label>
                  <Input
                    id="price_egp"
                    type="number"
                    value={formData.price_egp}
                    onChange={(e) => setFormData({...formData, price_egp: e.target.value})}
                    placeholder="Enter package price"
                  />
                </div>
                <div>
                  <Label htmlFor="max_sponsors">Maximum Sponsors *</Label>
                  <Input
                    id="max_sponsors"
                    type="number"
                    value={formData.max_sponsors}
                    onChange={(e) => setFormData({...formData, max_sponsors: e.target.value})}
                    placeholder="Enter maximum sponsors"
                  />
                </div>
                <div>
                  <Label htmlFor="visibility_level">Visibility Level</Label>
                  <Select value={formData.visibility_level} onValueChange={(value) => setFormData({...formData, visibility_level: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select visibility level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Premium">Premium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Standard">Standard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="expo_id">Exhibition *</Label>
                  <Select value={formData.expo_id} onValueChange={(value) => setFormData({...formData, expo_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select exhibition" />
                    </SelectTrigger>
                    <SelectContent>
                      {expos.map((expo) => (
                        <SelectItem key={expo.id} value={expo.id}>
                          {expo.expo_number} - {expo.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Package Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Package Details</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="benefits">Benefits *</Label>
                  <Textarea
                    id="benefits"
                    value={formData.benefits}
                    onChange={(e) => setFormData({...formData, benefits: e.target.value})}
                    placeholder="List the benefits included in this package"
                  />
                </div>
                <div>
                  <Label htmlFor="marketing_materials">Marketing Materials</Label>
                  <Textarea
                    id="marketing_materials"
                    value={formData.marketing_materials}
                    onChange={(e) => setFormData({...formData, marketing_materials: e.target.value})}
                    placeholder="Describe marketing materials and promotional opportunities"
                  />
                </div>
                <div>
                  <Label htmlFor="booth_allocation">Booth Allocation</Label>
                  <Textarea
                    id="booth_allocation"
                    value={formData.booth_allocation}
                    onChange={(e) => setFormData({...formData, booth_allocation: e.target.value})}
                    placeholder="Describe booth space allocation and specifications"
                  />
                </div>
                <div>
                  <Label htmlFor="additional_services">Additional Services</Label>
                  <Textarea
                    id="additional_services"
                    value={formData.additional_services}
                    onChange={(e) => setFormData({...formData, additional_services: e.target.value})}
                    placeholder="List any additional services included"
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {setShowCreateDialog(false); resetForm();}}>
              Cancel
            </Button>
            <Button onClick={handleCreatePackage}>
              Create Package
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Package Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Sponsorship Package</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit_package_name">Package Name *</Label>
                  <Input
                    id="edit_package_name"
                    value={formData.package_name}
                    onChange={(e) => setFormData({...formData, package_name: e.target.value})}
                    placeholder="Enter package name"
                  />
                </div>
                <div>
                  <Label htmlFor="edit_tier_level">Tier Level *</Label>
                  <Select value={formData.tier_level} onValueChange={(value) => setFormData({...formData, tier_level: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tier level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Title">Title</SelectItem>
                      <SelectItem value="Platinum">Platinum</SelectItem>
                      <SelectItem value="Gold">Gold</SelectItem>
                      <SelectItem value="Silver">Silver</SelectItem>
                      <SelectItem value="Bronze">Bronze</SelectItem>
                      <SelectItem value="Supporting">Supporting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit_price_egp">Price (EGP) *</Label>
                  <Input
                    id="edit_price_egp"
                    type="number"
                    value={formData.price_egp}
                    onChange={(e) => setFormData({...formData, price_egp: e.target.value})}
                    placeholder="Enter package price"
                  />
                </div>
                <div>
                  <Label htmlFor="edit_max_sponsors">Maximum Sponsors *</Label>
                  <Input
                    id="edit_max_sponsors"
                    type="number"
                    value={formData.max_sponsors}
                    onChange={(e) => setFormData({...formData, max_sponsors: e.target.value})}
                    placeholder="Enter maximum sponsors"
                  />
                </div>
                <div>
                  <Label htmlFor="edit_visibility_level">Visibility Level</Label>
                  <Select value={formData.visibility_level} onValueChange={(value) => setFormData({...formData, visibility_level: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select visibility level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Premium">Premium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Standard">Standard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit_status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Package Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Package Details</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit_benefits">Benefits *</Label>
                  <Textarea
                    id="edit_benefits"
                    value={formData.benefits}
                    onChange={(e) => setFormData({...formData, benefits: e.target.value})}
                    placeholder="List the benefits included in this package"
                  />
                </div>
                <div>
                  <Label htmlFor="edit_marketing_materials">Marketing Materials</Label>
                  <Textarea
                    id="edit_marketing_materials"
                    value={formData.marketing_materials}
                    onChange={(e) => setFormData({...formData, marketing_materials: e.target.value})}
                    placeholder="Describe marketing materials and promotional opportunities"
                  />
                </div>
                <div>
                  <Label htmlFor="edit_booth_allocation">Booth Allocation</Label>
                  <Textarea
                    id="edit_booth_allocation"
                    value={formData.booth_allocation}
                    onChange={(e) => setFormData({...formData, booth_allocation: e.target.value})}
                    placeholder="Describe booth space allocation and specifications"
                  />
                </div>
                <div>
                  <Label htmlFor="edit_additional_services">Additional Services</Label>
                  <Textarea
                    id="edit_additional_services"
                    value={formData.additional_services}
                    onChange={(e) => setFormData({...formData, additional_services: e.target.value})}
                    placeholder="List any additional services included"
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {setShowEditDialog(false); setEditingPackage(null); resetForm();}}>
              Cancel
            </Button>
            <Button onClick={handleEditPackage}>
              Update Package
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Sponsorship;