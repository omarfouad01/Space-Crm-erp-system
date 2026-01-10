import { Layout } from "@/components/layout/Layout";
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
  const [sponsors, setSponsors] = useState([]);
  const [expos, setExpos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState(null);
  const [formData, setFormData] = useState({
    company_name: '',
    sponsor_level: '',
    contact_person: '',
    email: '',
    phone: '',
    website_url: '',
    sponsorship_amount: '',
    benefits: '',
    contract_signed: false,
    expo_id: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('👑 Sponsorship: Loading data...');
      
      // Load expos first
      const exposData = await expoService.getAll();
      console.log('✅ Sponsorship: Loaded expos:', exposData?.length);
      setExpos(exposData || []);
      
      // Load all sponsors from all expos
      const allSponsors: any[] = [];
      
      if (exposData && exposData.length > 0) {
        for (const expo of exposData) {
          try {
            const sponsorsFromExpo = await expoService.getSponsors(expo.id);
            const enhancedSponsors = sponsorsFromExpo.map(sponsor => ({
              ...sponsor,
              expo_name: expo.name,
              expo_number: expo.expo_number,
              expo_status: expo.status,
              expo_start_date: expo.start_date,
              expo_end_date: expo.end_date,
              expo_city: expo.city,
              status: sponsor.contract_signed ? 'Confirmed' : 'Pending'
            }));
            allSponsors.push(...enhancedSponsors);
          } catch (error) {
            console.log('⚠️ Sponsorship: Error loading sponsors for expo:', expo.id, error);
          }
        }
      }
      
      console.log('✅ Sponsorship: Loaded all sponsors:', allSponsors.length);
      setSponsors(allSponsors);
    } catch (error) {
      console.error("🚨 Sponsorship: Error loading data:", error);
      toast({
        title: "Error Loading Sponsorships",
        description: "Failed to load sponsorship data from database. Please try refreshing the page.",
        variant: "destructive",
      });
      setSponsors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSponsor = async () => {
    try {
      if (!formData.expo_id) {
        toast({
          title: "Error",
          description: "Please select an exhibition",
          variant: "destructive",
        });
        return;
      }

      const sponsorData = {
        ...formData,
        sponsorship_amount: parseFloat(formData.sponsorship_amount) || 0
      };

      await expoService.addSponsor(formData.expo_id, sponsorData);
      
      toast({
        title: "Success",
        description: "Sponsor created successfully",
      });

      setShowCreateDialog(false);
      resetForm();
      loadData();
    } catch (error) {
      console.error("Error creating sponsor:", error);
      toast({
        title: "Error",
        description: "Failed to create sponsor",
        variant: "destructive",
      });
    }
  };

  const handleEditSponsor = async () => {
    try {
      if (!editingSponsor) return;

      const sponsorData = {
        ...formData,
        sponsorship_amount: parseFloat(formData.sponsorship_amount) || 0
      };

      await expoService.updateSponsor(editingSponsor.expo_id, editingSponsor.id, sponsorData);
      
      toast({
        title: "Success",
        description: "Sponsor updated successfully",
      });

      setShowEditDialog(false);
      setEditingSponsor(null);
      resetForm();
      loadData();
    } catch (error) {
      console.error("Error updating sponsor:", error);
      toast({
        title: "Error",
        description: "Failed to update sponsor",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSponsor = async (sponsor) => {
    if (!confirm('Are you sure you want to delete this sponsor?')) return;

    try {
      await expoService.deleteSponsor(sponsor.expo_id, sponsor.id);
      
      toast({
        title: "Success",
        description: "Sponsor deleted successfully",
      });

      loadData();
    } catch (error) {
      console.error("Error deleting sponsor:", error);
      toast({
        title: "Error",
        description: "Failed to delete sponsor",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      company_name: '',
      sponsor_level: '',
      contact_person: '',
      email: '',
      phone: '',
      website_url: '',
      sponsorship_amount: '',
      benefits: '',
      contract_signed: false,
      expo_id: ''
    });
  };

  const openEditDialog = (sponsor) => {
    setEditingSponsor(sponsor);
    setFormData({
      company_name: sponsor.company_name || '',
      sponsor_level: sponsor.sponsor_level || '',
      contact_person: sponsor.contact_person || '',
      email: sponsor.email || '',
      phone: sponsor.phone || '',
      website_url: sponsor.website_url || '',
      sponsorship_amount: sponsor.sponsorship_amount?.toString() || '',
      benefits: sponsor.benefits || '',
      contract_signed: sponsor.contract_signed || false,
      expo_id: sponsor.expo_id || ''
    });
    setShowEditDialog(true);
  };

  const exportSponsors = () => {
    try {
      const csvContent = [
        // CSV Header
        ['Company', 'Sponsor Level', 'Contact Person', 'Email', 'Phone', 'Amount', 'Status', 'Exhibition', 'City'].join(','),
        // CSV Data
        ...filteredSponsors.map(sponsor => [
          `"${sponsor.company_name || ''}"`,
          sponsor.sponsor_level || '',
          `"${sponsor.contact_person || ''}"`,
          sponsor.email || '',
          sponsor.phone || '',
          sponsor.sponsorship_amount || '',
          sponsor.status || '',
          `"${sponsor.expo_name || ''}"`,
          sponsor.expo_city || ''
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `sponsorships_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export Successful",
        description: "Sponsorship data has been exported to CSV",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export sponsorship data",
        variant: "destructive",
      });
    }
  };

  // Filter sponsors based on search and filters
  const filteredSponsors = sponsors.filter(sponsor => {
    const matchesSearch = !searchTerm || 
      sponsor.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sponsor.contact_person?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sponsor.expo_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sponsor.sponsor_level?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTier = tierFilter === "all-tiers" || sponsor.sponsor_level === tierFilter;
    const matchesExpo = expoFilter === "all-expos" || sponsor.expo_id === expoFilter;
    const matchesStatus = statusFilter === "all-status" || sponsor.status === statusFilter;

    return matchesSearch && matchesTier && matchesExpo && matchesStatus;
  });

  // Calculate statistics
  const stats = {
    total: sponsors.length,
    title: sponsors.filter(s => s.sponsor_level === 'Title').length,
    platinum: sponsors.filter(s => s.sponsor_level === 'Platinum').length,
    gold: sponsors.filter(s => s.sponsor_level === 'Gold').length,
    silver: sponsors.filter(s => s.sponsor_level === 'Silver').length,
    bronze: sponsors.filter(s => s.sponsor_level === 'Bronze').length,
    confirmed: sponsors.filter(s => s.status === 'Confirmed').length,
    totalRevenue: sponsors.reduce((sum, sponsor) => sum + (sponsor.sponsorship_amount || 0), 0)
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
      case 'Confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
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
            Sponsorship Management
          </h1>
          <p className="text-gray-600 mt-1">Manage exhibition sponsors and partnership deals</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => loadData()} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={exportSponsors} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowCreateDialog(true)} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Sponsor
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sponsors</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Title</p>
                <p className="text-2xl font-bold">{stats.title}</p>
              </div>
              <Crown className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Platinum</p>
                <p className="text-2xl font-bold">{stats.platinum}</p>
              </div>
              <Trophy className="w-8 h-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Gold</p>
                <p className="text-2xl font-bold">{stats.gold}</p>
              </div>
              <Award className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Silver</p>
                <p className="text-2xl font-bold">{stats.silver}</p>
              </div>
              <Star className="w-8 h-8 text-slate-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bronze</p>
                <p className="text-2xl font-bold">{stats.bronze}</p>
              </div>
              <Zap className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold">{stats.confirmed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
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
                placeholder="Search sponsors..."
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
                <SelectItem value="Confirmed">Confirmed</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
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

      {/* Sponsors List */}
      {loading ? (
        <Card>
          <CardContent className="p-12">
            <div className="flex items-center justify-center">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mr-3" />
              <p className="text-lg text-gray-600">Loading sponsors...</p>
            </div>
          </CardContent>
        </Card>
      ) : filteredSponsors.length === 0 ? (
        <Card>
          <CardContent className="p-12">
            <div className="text-center">
              <Crown className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {sponsors.length === 0 ? "No Sponsors Found" : "No Matching Sponsors"}
              </h3>
              <p className="text-gray-600 mb-6">
                {sponsors.length === 0 
                  ? "Sponsors will appear here when they register for exhibitions"
                  : "Try adjusting your search criteria or filters"
                }
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredSponsors.map((sponsor) => (
            <Card key={sponsor.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center gap-2">
                        <Badge className={getTierColor(sponsor.sponsor_level)} variant="secondary">
                          {getTierIcon(sponsor.sponsor_level)}
                          {sponsor.sponsor_level}
                        </Badge>
                        <Badge className={getStatusColor(sponsor.status)} variant="secondary">
                          {sponsor.status === 'Confirmed' ? <CheckCircle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                          {sponsor.status}
                        </Badge>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {sponsor.company_name}
                    </h3>
                    {sponsor.contact_person && (
                      <p className="text-gray-600 mb-4">
                        Contact: {sponsor.contact_person}
                      </p>
                    )}
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
                      {sponsor.email && (
                        <DropdownMenuItem onClick={() => window.open(`mailto:${sponsor.email}`, '_blank')}>
                          <Globe className="w-4 h-4 mr-2" />
                          Send Email
                        </DropdownMenuItem>
                      )}
                      {sponsor.website_url && (
                        <DropdownMenuItem onClick={() => window.open(sponsor.website_url, '_blank')}>
                          <Globe className="w-4 h-4 mr-2" />
                          Visit Website
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => openEditDialog(sponsor)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Sponsor
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteSponsor(sponsor)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Sponsor
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
                        <p className="font-medium text-gray-900">{sponsor.expo_name}</p>
                        <p className="text-sm text-gray-600">{sponsor.expo_number}</p>
                      </div>
                    </div>
                  </div>

                  {/* Sponsorship Details */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Sponsorship Amount</p>
                        <p className="font-medium text-gray-900">
                          {formatAmount(sponsor.sponsorship_amount || 0)}
                        </p>
                      </div>
                    </div>
                    {sponsor.benefits && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-700">Benefits:</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {sponsor.benefits}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Contract Status */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-600">
                        Contract: {sponsor.contract_signed ? 'Signed' : 'Pending'}
                      </p>
                    </div>
                    {/* Exhibition Dates */}
                    {sponsor.expo_start_date && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <p className="text-sm text-gray-600">
                          {formatDate(sponsor.expo_start_date)} - {formatDate(sponsor.expo_end_date)}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Contact Info */}
                  {(sponsor.email || sponsor.phone) && (
                    <div className="md:col-span-3 pt-4 border-t border-gray-200">
                      {sponsor.email && <p className="text-sm text-gray-600">📧 {sponsor.email}</p>}
                      {sponsor.phone && <p className="text-sm text-gray-600">📞 {sponsor.phone}</p>}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Sponsor Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Sponsor</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company_name">Company Name *</Label>
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                  placeholder="Enter company name"
                />
              </div>
              <div>
                <Label htmlFor="sponsor_level">Sponsor Level *</Label>
                <Select value={formData.sponsor_level} onValueChange={(value) => setFormData({...formData, sponsor_level: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sponsor level" />
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
                <Label htmlFor="contact_person">Contact Person</Label>
                <Input
                  id="contact_person"
                  value={formData.contact_person}
                  onChange={(e) => setFormData({...formData, contact_person: e.target.value})}
                  placeholder="Enter contact person name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <Label htmlFor="sponsorship_amount">Sponsorship Amount</Label>
                <Input
                  id="sponsorship_amount"
                  type="number"
                  value={formData.sponsorship_amount}
                  onChange={(e) => setFormData({...formData, sponsorship_amount: e.target.value})}
                  placeholder="Enter amount"
                />
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
              <div className="col-span-2">
                <Label htmlFor="website_url">Website URL</Label>
                <Input
                  id="website_url"
                  value={formData.website_url}
                  onChange={(e) => setFormData({...formData, website_url: e.target.value})}
                  placeholder="Enter website URL"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="benefits">Benefits</Label>
                <Textarea
                  id="benefits"
                  value={formData.benefits}
                  onChange={(e) => setFormData({...formData, benefits: e.target.value})}
                  placeholder="Enter sponsorship benefits"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {setShowCreateDialog(false); resetForm();}}>
              Cancel
            </Button>
            <Button onClick={handleCreateSponsor}>
              Create Sponsor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Sponsor Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Sponsor</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit_company_name">Company Name *</Label>
                <Input
                  id="edit_company_name"
                  value={formData.company_name}
                  onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                  placeholder="Enter company name"
                />
              </div>
              <div>
                <Label htmlFor="edit_sponsor_level">Sponsor Level *</Label>
                <Select value={formData.sponsor_level} onValueChange={(value) => setFormData({...formData, sponsor_level: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sponsor level" />
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
                <Label htmlFor="edit_contact_person">Contact Person</Label>
                <Input
                  id="edit_contact_person"
                  value={formData.contact_person}
                  onChange={(e) => setFormData({...formData, contact_person: e.target.value})}
                  placeholder="Enter contact person name"
                />
              </div>
              <div>
                <Label htmlFor="edit_email">Email</Label>
                <Input
                  id="edit_email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <Label htmlFor="edit_phone">Phone</Label>
                <Input
                  id="edit_phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <Label htmlFor="edit_sponsorship_amount">Sponsorship Amount</Label>
                <Input
                  id="edit_sponsorship_amount"
                  type="number"
                  value={formData.sponsorship_amount}
                  onChange={(e) => setFormData({...formData, sponsorship_amount: e.target.value})}
                  placeholder="Enter amount"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="edit_website_url">Website URL</Label>
                <Input
                  id="edit_website_url"
                  value={formData.website_url}
                  onChange={(e) => setFormData({...formData, website_url: e.target.value})}
                  placeholder="Enter website URL"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="edit_benefits">Benefits</Label>
                <Textarea
                  id="edit_benefits"
                  value={formData.benefits}
                  onChange={(e) => setFormData({...formData, benefits: e.target.value})}
                  placeholder="Enter sponsorship benefits"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {setShowEditDialog(false); setEditingSponsor(null); resetForm();}}>
              Cancel
            </Button>
            <Button onClick={handleEditSponsor}>
              Update Sponsor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Sponsorship;