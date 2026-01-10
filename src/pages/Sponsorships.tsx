import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Crown,
  Star,
  Award,
  DollarSign,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Download,
  Gift,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface Exhibition {
  id: string;
  exhibition_name: string;
  start_date: string;
  end_date: string;
}

interface SponsorshipPackage {
  id: string;
  package_name: string;
  exhibition_id: string;
  tier_level: string;
  price_egp: number;
  max_sponsors: number;
  current_sponsors: number;
  benefits: string;
  visibility_level: string;
  marketing_materials?: string;
  booth_allocation?: string;
  additional_services?: string;
  status: string;
  created_at: string;
  exhibitions_2026_01_10?: Exhibition;
}

interface SponsorshipFormData {
  package_name: string;
  exhibition_id: string;
  tier_level: string;
  price_egp: string;
  max_sponsors: string;
  benefits: string;
  visibility_level: string;
  marketing_materials: string;
  booth_allocation: string;
  additional_services: string;
  status: string;
}

export default function Sponsorships() {
  const { toast } = useToast();
  const [sponsorships, setSponsorships] = useState<SponsorshipPackage[]>([]);
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [exhibitionFilter, setExhibitionFilter] = useState('all');
  const [isAddSponsorshipOpen, setIsAddSponsorshipOpen] = useState(false);
  const [isEditSponsorshipOpen, setIsEditSponsorshipOpen] = useState(false);
  const [editingSponsorship, setEditingSponsorship] = useState<SponsorshipPackage | null>(null);

  // Sponsorship tiers and statuses from system settings
  const sponsorshipTiers = ['Platinum', 'Gold', 'Silver', 'Bronze', 'Supporting'];
  const visibilityLevels = ['Premium', 'High', 'Medium', 'Standard'];
  const packageStatuses = ['Active', 'Inactive', 'Full', 'Draft'];

  // Form data state
  const [formData, setFormData] = useState<SponsorshipFormData>({
    package_name: '',
    exhibition_id: '',
    tier_level: '',
    price_egp: '',
    max_sponsors: '',
    benefits: '',
    visibility_level: '',
    marketing_materials: '',
    booth_allocation: '',
    additional_services: '',
    status: ''
  });

  useEffect(() => {
    fetchSponsorships();
    fetchExhibitions();
  }, []);

  const fetchSponsorships = async () => {
    try {
      const { data, error } = await supabase
        .from('sponsorship_packages_2026_01_10')
        .select(`
          *,
          exhibitions_2026_01_10 (
            id,
            exhibition_name,
            start_date,
            end_date
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSponsorships(data || []);
    } catch (error) {
      console.error('Error fetching sponsorships:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch sponsorship packages',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchExhibitions = async () => {
    try {
      const { data, error } = await supabase
        .from('exhibitions_2026_01_10')
        .select('id, exhibition_name, start_date, end_date')
        .in('status', ['Planning', 'Registration Open', 'Active'])
        .order('start_date');

      if (error) throw error;
      setExhibitions(data || []);
    } catch (error) {
      console.error('Error fetching exhibitions:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const submitData = {
        ...formData,
        price_egp: parseFloat(formData.price_egp),
        max_sponsors: parseInt(formData.max_sponsors),
        current_sponsors: 0, // Initialize with 0 sponsors
      };

      const { error } = await supabase
        .from('sponsorship_packages_2026_01_10')
        .insert([submitData]);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Sponsorship package created successfully',
      });

      setIsAddSponsorshipOpen(false);
      resetForm();
      fetchSponsorships();
    } catch (error) {
      console.error('Error creating sponsorship package:', error);
      toast({
        title: 'Error',
        description: 'Failed to create sponsorship package',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (sponsorship: SponsorshipPackage) => {
    setEditingSponsorship(sponsorship);
    setFormData({
      package_name: sponsorship.package_name,
      exhibition_id: sponsorship.exhibition_id,
      tier_level: sponsorship.tier_level,
      price_egp: sponsorship.price_egp.toString(),
      max_sponsors: sponsorship.max_sponsors.toString(),
      benefits: sponsorship.benefits,
      visibility_level: sponsorship.visibility_level,
      marketing_materials: sponsorship.marketing_materials || '',
      booth_allocation: sponsorship.booth_allocation || '',
      additional_services: sponsorship.additional_services || '',
      status: sponsorship.status
    });
    setIsEditSponsorshipOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSponsorship) return;
    
    setSubmitting(true);

    try {
      const submitData = {
        ...formData,
        price_egp: parseFloat(formData.price_egp),
        max_sponsors: parseInt(formData.max_sponsors),
      };

      const { error } = await supabase
        .from('sponsorship_packages_2026_01_10')
        .update(submitData)
        .eq('id', editingSponsorship.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Sponsorship package updated successfully',
      });

      setIsEditSponsorshipOpen(false);
      setEditingSponsorship(null);
      resetForm();
      fetchSponsorships();
    } catch (error) {
      console.error('Error updating sponsorship package:', error);
      toast({
        title: 'Error',
        description: 'Failed to update sponsorship package',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (sponsorshipId: string) => {
    if (!confirm('Are you sure you want to delete this sponsorship package?')) return;

    try {
      const { error } = await supabase
        .from('sponsorship_packages_2026_01_10')
        .delete()
        .eq('id', sponsorshipId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Sponsorship package deleted successfully',
      });

      fetchSponsorships();
    } catch (error) {
      console.error('Error deleting sponsorship package:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete sponsorship package',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      package_name: '',
      exhibition_id: '',
      tier_level: '',
      price_egp: '',
      max_sponsors: '',
      benefits: '',
      visibility_level: '',
      marketing_materials: '',
      booth_allocation: '',
      additional_services: '',
      status: ''
    });
  };

  const handleRefresh = () => {
    fetchSponsorships();
  };

  const handleExport = () => {
    console.log('Exporting sponsorship packages data...');
  };

  // Calculate metrics
  const totalPackages = sponsorships.length;
  const activePackages = sponsorships.filter(pkg => pkg.status === 'Active').length;
  const totalRevenue = sponsorships.reduce((sum, pkg) => sum + (pkg.price_egp * pkg.current_sponsors), 0);
  const totalSponsors = sponsorships.reduce((sum, pkg) => sum + pkg.current_sponsors, 0);
  const availableSlots = sponsorships.reduce((sum, pkg) => sum + (pkg.max_sponsors - pkg.current_sponsors), 0);
  const fullPackages = sponsorships.filter(pkg => pkg.current_sponsors >= pkg.max_sponsors).length;

  const getTierColor = (tier: string) => {
    const colors = {
      'Platinum': 'bg-gray-100 text-gray-800 border-gray-300',
      'Gold': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'Silver': 'bg-gray-50 text-gray-700 border-gray-200',
      'Bronze': 'bg-orange-100 text-orange-800 border-orange-300',
      'Supporting': 'bg-blue-100 text-blue-800 border-blue-300',
    };
    return colors[tier as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'Active': 'bg-green-100 text-green-800',
      'Inactive': 'bg-gray-100 text-gray-800',
      'Full': 'bg-red-100 text-red-800',
      'Draft': 'bg-yellow-100 text-yellow-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'Platinum': return <Crown className="w-4 h-4" />;
      case 'Gold': return <Award className="w-4 h-4" />;
      case 'Silver': return <Star className="w-4 h-4" />;
      case 'Bronze': return <Gift className="w-4 h-4" />;
      default: return <Gift className="w-4 h-4" />;
    }
  };

  const filteredSponsorships = sponsorships.filter(sponsorship => {
    const matchesSearch = sponsorship.package_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (sponsorship.exhibitions_2026_01_10?.exhibition_name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTier = tierFilter === 'all' || sponsorship.tier_level === tierFilter;
    const matchesExhibition = exhibitionFilter === 'all' || sponsorship.exhibition_id === exhibitionFilter;
    return matchesSearch && matchesTier && matchesExhibition;
  });

  const SponsorshipForm = ({ onSubmit, isEdit = false }: { onSubmit: (e: React.FormEvent) => void; isEdit?: boolean }) => (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="package_name">Package Name *</Label>
            <Input 
              id="package_name" 
              value={formData.package_name}
              onChange={(e) => setFormData({...formData, package_name: e.target.value})}
              placeholder="Enter package name" 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="exhibition_id">Exhibition *</Label>
            <Select value={formData.exhibition_id} onValueChange={(value) => setFormData({...formData, exhibition_id: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select exhibition" />
              </SelectTrigger>
              <SelectContent>
                {exhibitions.map(exhibition => (
                  <SelectItem key={exhibition.id} value={exhibition.id}>
                    {exhibition.exhibition_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tier_level">Tier Level *</Label>
            <Select value={formData.tier_level} onValueChange={(value) => setFormData({...formData, tier_level: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select tier level" />
              </SelectTrigger>
              <SelectContent>
                {sponsorshipTiers.map(tier => (
                  <SelectItem key={tier} value={tier}>{tier}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="visibility_level">Visibility Level *</Label>
            <Select value={formData.visibility_level} onValueChange={(value) => setFormData({...formData, visibility_level: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select visibility level" />
              </SelectTrigger>
              <SelectContent>
                {visibilityLevels.map(level => (
                  <SelectItem key={level} value={level}>{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Pricing and Capacity */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Pricing and Capacity</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price_egp">Price (EGP) *</Label>
            <Input 
              id="price_egp" 
              type="number"
              step="0.01"
              value={formData.price_egp}
              onChange={(e) => setFormData({...formData, price_egp: e.target.value})}
              placeholder="Enter package price" 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="max_sponsors">Maximum Sponsors *</Label>
            <Input 
              id="max_sponsors" 
              type="number"
              min="1"
              value={formData.max_sponsors}
              onChange={(e) => setFormData({...formData, max_sponsors: e.target.value})}
              placeholder="Enter maximum number of sponsors" 
              required 
            />
          </div>
          <div className="col-span-2 space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {packageStatuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Benefits and Services */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Benefits and Services</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="benefits">Benefits *</Label>
            <Textarea 
              id="benefits" 
              value={formData.benefits}
              onChange={(e) => setFormData({...formData, benefits: e.target.value})}
              placeholder="List the benefits included in this package" 
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="marketing_materials">Marketing Materials</Label>
            <Textarea 
              id="marketing_materials" 
              value={formData.marketing_materials}
              onChange={(e) => setFormData({...formData, marketing_materials: e.target.value})}
              placeholder="Describe marketing materials and promotional opportunities" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="booth_allocation">Booth Allocation</Label>
            <Textarea 
              id="booth_allocation" 
              value={formData.booth_allocation}
              onChange={(e) => setFormData({...formData, booth_allocation: e.target.value})}
              placeholder="Describe booth space allocation and specifications" 
            />
          </div>
          <div className="space-y-2">
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

      <div className="flex justify-end gap-3">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => {
            if (isEdit) {
              setIsEditSponsorshipOpen(false);
              setEditingSponsorship(null);
            } else {
              setIsAddSponsorshipOpen(false);
            }
            resetForm();
          }}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : null}
          {isEdit ? 'Update Package' : 'Create Package'}
        </Button>
      </div>
    </form>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Crown className="w-8 h-8 text-blue-600" />
            Sponsorship Packages
          </h1>
          <p className="text-gray-600 mt-1">Manage sponsorship tiers, packages, and benefits</p>
          <div className="flex items-center gap-4 mt-4">
            <Badge className="bg-blue-100 text-blue-800">
              {totalPackages} Total Packages
            </Badge>
            <Badge className="bg-green-100 text-green-800">
              {activePackages} Active
            </Badge>
            <Badge className="bg-purple-100 text-purple-800">
              {totalSponsors} Sponsors
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Dialog open={isAddSponsorshipOpen} onOpenChange={setIsAddSponsorshipOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Package
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Sponsorship Package</DialogTitle>
                <DialogDescription>
                  Create a new sponsorship package for an exhibition.
                </DialogDescription>
              </DialogHeader>
              <SponsorshipForm onSubmit={handleSubmit} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">EGP {totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Packages</p>
                <p className="text-2xl font-bold text-blue-600">{activePackages}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sponsors</p>
                <p className="text-2xl font-bold text-purple-600">{totalSponsors}</p>
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
                <p className="text-2xl font-bold text-orange-600">{availableSlots}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Full Packages</p>
                <p className="text-2xl font-bold text-red-600">{fullPackages}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Package Price</p>
                <p className="text-2xl font-bold text-indigo-600">
                  EGP {totalPackages > 0 ? Math.round(sponsorships.reduce((sum, pkg) => sum + pkg.price_egp, 0) / totalPackages).toLocaleString() : 0}
                </p>
              </div>
              <Award className="w-8 h-8 text-indigo-600" />
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
                placeholder="Search sponsorship packages..."
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
                <SelectItem value="all">All Tiers</SelectItem>
                {sponsorshipTiers.map(tier => (
                  <SelectItem key={tier} value={tier}>{tier}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={exhibitionFilter} onValueChange={setExhibitionFilter}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by exhibition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Exhibitions</SelectItem>
                {exhibitions.map(exhibition => (
                  <SelectItem key={exhibition.id} value={exhibition.id}>{exhibition.exhibition_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Sponsorship Packages Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sponsorship Packages Directory</CardTitle>
          <CardDescription>
            {filteredSponsorships.length} packages found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Package</TableHead>
                <TableHead>Exhibition</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Sponsors</TableHead>
                <TableHead>Visibility</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSponsorships.map((sponsorship) => (
                <TableRow key={sponsorship.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        {getTierIcon(sponsorship.tier_level)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{sponsorship.package_name}</p>
                        <p className="text-sm text-gray-600 line-clamp-1">{sponsorship.benefits}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{sponsorship.exhibitions_2026_01_10?.exhibition_name}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(sponsorship.exhibitions_2026_01_10?.start_date || '').toLocaleDateString()}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getTierColor(sponsorship.tier_level)} variant="secondary">
                      {getTierIcon(sponsorship.tier_level)}
                      <span className="ml-1">{sponsorship.tier_level}</span>
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold">
                    EGP {sponsorship.price_egp.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {sponsorship.current_sponsors}/{sponsorship.max_sponsors}
                      </span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ 
                            width: `${(sponsorship.current_sponsors / sponsorship.max_sponsors) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {sponsorship.visibility_level}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(sponsorship.status)} variant="secondary">
                      {sponsorship.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(sponsorship)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Package
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDelete(sponsorship.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Package
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Sponsorship Dialog */}
      <Dialog open={isEditSponsorshipOpen} onOpenChange={setIsEditSponsorshipOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Sponsorship Package</DialogTitle>
            <DialogDescription>
              Update sponsorship package information.
            </DialogDescription>
          </DialogHeader>
          <SponsorshipForm onSubmit={handleUpdate} isEdit={true} />
        </DialogContent>
      </Dialog>
    </div>
  );
}