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
  Building,
  MapPin,
  Ruler,
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
  Grid3X3,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface Exhibition {
  id: string;
  exhibition_name: string;
  start_date: string;
  end_date: string;
}

interface Client {
  id: string;
  client_name: string;
  client_type: string;
  contact_person: string;
}

interface Booth {
  id: string;
  booth_number: string;
  exhibition_id: string;
  client_id?: string;
  size_sqm: number;
  location_hall?: string;
  location_section?: string;
  price_per_sqm: number;
  total_price: number;
  status: string;
  booth_type?: string;
  facilities?: string;
  setup_requirements?: string;
  notes?: string;
  created_at: string;
  exhibitions_2026_01_10?: Exhibition;
  clients_2026_01_10?: Client;
}

interface BoothFormData {
  booth_number: string;
  exhibition_id: string;
  client_id: string;
  size_sqm: string;
  location_hall: string;
  location_section: string;
  price_per_sqm: string;
  total_price: string;
  status: string;
  booth_type: string;
  facilities: string;
  setup_requirements: string;
  notes: string;
}

export default function Booths() {
  const { toast } = useToast();
  const [booths, setBooths] = useState<Booth[]>([]);
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [exhibitionFilter, setExhibitionFilter] = useState('all');
  const [isAddBoothOpen, setIsAddBoothOpen] = useState(false);
  const [isEditBoothOpen, setIsEditBoothOpen] = useState(false);
  const [editingBooth, setEditingBooth] = useState<Booth | null>(null);

  // Booth statuses and types from system settings
  const boothStatuses = ['Available', 'Reserved', 'Occupied', 'Maintenance', 'Blocked'];
  const boothTypes = ['Standard', 'Premium', 'Corner', 'Island', 'Peninsula'];

  // Form data state
  const [formData, setFormData] = useState<BoothFormData>({
    booth_number: '',
    exhibition_id: '',
    client_id: '',
    size_sqm: '',
    location_hall: '',
    location_section: '',
    price_per_sqm: '',
    total_price: '',
    status: '',
    booth_type: '',
    facilities: '',
    setup_requirements: '',
    notes: ''
  });

  useEffect(() => {
    fetchBooths();
    fetchExhibitions();
    fetchClients();
  }, []);

  const fetchBooths = async () => {
    try {
      const { data, error } = await supabase
        .from('booths_2026_01_10')
        .select(`
          *,
          exhibitions_2026_01_10 (
            id,
            exhibition_name,
            start_date,
            end_date
          ),
          clients_2026_01_10 (
            id,
            client_name,
            client_type,
            contact_person
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBooths(data || []);
    } catch (error) {
      console.error('Error fetching booths:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch booths',
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

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients_2026_01_10')
        .select('id, client_name, client_type, contact_person')
        .eq('status', 'active')
        .order('client_name');

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const calculateTotalPrice = () => {
    const size = parseFloat(formData.size_sqm) || 0;
    const pricePerSqm = parseFloat(formData.price_per_sqm) || 0;
    const total = size * pricePerSqm;
    setFormData(prev => ({ ...prev, total_price: total.toString() }));
  };

  useEffect(() => {
    calculateTotalPrice();
  }, [formData.size_sqm, formData.price_per_sqm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const submitData = {
        ...formData,
        size_sqm: parseFloat(formData.size_sqm),
        price_per_sqm: parseFloat(formData.price_per_sqm),
        total_price: parseFloat(formData.total_price),
        client_id: formData.client_id || null,
      };

      const { error } = await supabase
        .from('booths_2026_01_10')
        .insert([submitData]);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Booth created successfully',
      });

      setIsAddBoothOpen(false);
      resetForm();
      fetchBooths();
    } catch (error) {
      console.error('Error creating booth:', error);
      toast({
        title: 'Error',
        description: 'Failed to create booth',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (booth: Booth) => {
    setEditingBooth(booth);
    setFormData({
      booth_number: booth.booth_number,
      exhibition_id: booth.exhibition_id,
      client_id: booth.client_id || '',
      size_sqm: booth.size_sqm.toString(),
      location_hall: booth.location_hall || '',
      location_section: booth.location_section || '',
      price_per_sqm: booth.price_per_sqm.toString(),
      total_price: booth.total_price.toString(),
      status: booth.status,
      booth_type: booth.booth_type || '',
      facilities: booth.facilities || '',
      setup_requirements: booth.setup_requirements || '',
      notes: booth.notes || ''
    });
    setIsEditBoothOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooth) return;
    
    setSubmitting(true);

    try {
      const submitData = {
        ...formData,
        size_sqm: parseFloat(formData.size_sqm),
        price_per_sqm: parseFloat(formData.price_per_sqm),
        total_price: parseFloat(formData.total_price),
        client_id: formData.client_id || null,
      };

      const { error } = await supabase
        .from('booths_2026_01_10')
        .update(submitData)
        .eq('id', editingBooth.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Booth updated successfully',
      });

      setIsEditBoothOpen(false);
      setEditingBooth(null);
      resetForm();
      fetchBooths();
    } catch (error) {
      console.error('Error updating booth:', error);
      toast({
        title: 'Error',
        description: 'Failed to update booth',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (boothId: string) => {
    if (!confirm('Are you sure you want to delete this booth?')) return;

    try {
      const { error } = await supabase
        .from('booths_2026_01_10')
        .delete()
        .eq('id', boothId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Booth deleted successfully',
      });

      fetchBooths();
    } catch (error) {
      console.error('Error deleting booth:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete booth',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      booth_number: '',
      exhibition_id: '',
      client_id: '',
      size_sqm: '',
      location_hall: '',
      location_section: '',
      price_per_sqm: '',
      total_price: '',
      status: '',
      booth_type: '',
      facilities: '',
      setup_requirements: '',
      notes: ''
    });
  };

  const handleRefresh = () => {
    fetchBooths();
  };

  const handleExport = () => {
    console.log('Exporting booths data...');
  };

  // Calculate metrics
  const totalBooths = booths.length;
  const availableBooths = booths.filter(booth => booth.status === 'Available').length;
  const reservedBooths = booths.filter(booth => booth.status === 'Reserved').length;
  const occupiedBooths = booths.filter(booth => booth.status === 'Occupied').length;
  const totalRevenue = booths.reduce((sum, booth) => sum + booth.total_price, 0);
  const totalArea = booths.reduce((sum, booth) => sum + booth.size_sqm, 0);
  const occupancyRate = totalBooths > 0 ? ((reservedBooths + occupiedBooths) / totalBooths) * 100 : 0;

  const getStatusColor = (status: string) => {
    const colors = {
      'Available': 'bg-green-100 text-green-800',
      'Reserved': 'bg-yellow-100 text-yellow-800',
      'Occupied': 'bg-blue-100 text-blue-800',
      'Maintenance': 'bg-orange-100 text-orange-800',
      'Blocked': 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getBoothTypeColor = (type: string) => {
    const colors = {
      'Standard': 'bg-gray-100 text-gray-800',
      'Premium': 'bg-purple-100 text-purple-800',
      'Corner': 'bg-blue-100 text-blue-800',
      'Island': 'bg-green-100 text-green-800',
      'Peninsula': 'bg-orange-100 text-orange-800',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const filteredBooths = booths.filter(booth => {
    const matchesSearch = booth.booth_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (booth.location_hall && booth.location_hall.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (booth.clients_2026_01_10?.client_name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || booth.status === statusFilter;
    const matchesExhibition = exhibitionFilter === 'all' || booth.exhibition_id === exhibitionFilter;
    return matchesSearch && matchesStatus && matchesExhibition;
  });

  const BoothForm = ({ onSubmit, isEdit = false }: { onSubmit: (e: React.FormEvent) => void; isEdit?: boolean }) => (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="booth_number">Booth Number *</Label>
            <Input 
              id="booth_number" 
              value={formData.booth_number}
              onChange={(e) => setFormData({...formData, booth_number: e.target.value})}
              placeholder="Enter booth number" 
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
            <Label htmlFor="client_id">Client (Optional)</Label>
            <Select value={formData.client_id} onValueChange={(value) => setFormData({...formData, client_id: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select client (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No Client Assigned</SelectItem>
                {clients.map(client => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.client_name} ({client.client_type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {boothStatuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Size and Pricing */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Size and Pricing</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="size_sqm">Size (SQM) *</Label>
            <Input 
              id="size_sqm" 
              type="number"
              step="0.01"
              value={formData.size_sqm}
              onChange={(e) => setFormData({...formData, size_sqm: e.target.value})}
              placeholder="Enter size in square meters" 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price_per_sqm">Price per SQM (EGP) *</Label>
            <Input 
              id="price_per_sqm" 
              type="number"
              step="0.01"
              value={formData.price_per_sqm}
              onChange={(e) => setFormData({...formData, price_per_sqm: e.target.value})}
              placeholder="Enter price per square meter" 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="total_price">Total Price (EGP)</Label>
            <Input 
              id="total_price" 
              type="number"
              step="0.01"
              value={formData.total_price}
              readOnly
              className="bg-gray-50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="booth_type">Booth Type</Label>
            <Select value={formData.booth_type} onValueChange={(value) => setFormData({...formData, booth_type: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select booth type" />
              </SelectTrigger>
              <SelectContent>
                {boothTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Location</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="location_hall">Hall</Label>
            <Input 
              id="location_hall" 
              value={formData.location_hall}
              onChange={(e) => setFormData({...formData, location_hall: e.target.value})}
              placeholder="Enter hall name/number" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location_section">Section</Label>
            <Input 
              id="location_section" 
              value={formData.location_section}
              onChange={(e) => setFormData({...formData, location_section: e.target.value})}
              placeholder="Enter section name/number" 
            />
          </div>
        </div>
      </div>

      {/* Additional Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Additional Details</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="facilities">Facilities</Label>
            <Textarea 
              id="facilities" 
              value={formData.facilities}
              onChange={(e) => setFormData({...formData, facilities: e.target.value})}
              placeholder="List available facilities (e.g., power outlets, internet, etc.)" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="setup_requirements">Setup Requirements</Label>
            <Textarea 
              id="setup_requirements" 
              value={formData.setup_requirements}
              onChange={(e) => setFormData({...formData, setup_requirements: e.target.value})}
              placeholder="Enter setup requirements and restrictions" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea 
              id="notes" 
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Enter additional notes" 
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
              setIsEditBoothOpen(false);
              setEditingBooth(null);
            } else {
              setIsAddBoothOpen(false);
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
          {isEdit ? 'Update Booth' : 'Create Booth'}
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
            <Grid3X3 className="w-8 h-8 text-blue-600" />
            Booths Management
          </h1>
          <p className="text-gray-600 mt-1">Manage exhibition booths, assignments, and layouts</p>
          <div className="flex items-center gap-4 mt-4">
            <Badge className="bg-blue-100 text-blue-800">
              {totalBooths} Total Booths
            </Badge>
            <Badge className="bg-green-100 text-green-800">
              {availableBooths} Available
            </Badge>
            <Badge className="bg-purple-100 text-purple-800">
              {occupancyRate.toFixed(1)}% Occupied
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
          <Dialog open={isAddBoothOpen} onOpenChange={setIsAddBoothOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Booth
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Booth</DialogTitle>
                <DialogDescription>
                  Create a new booth for an exhibition.
                </DialogDescription>
              </DialogHeader>
              <BoothForm onSubmit={handleSubmit} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Booths</p>
                <p className="text-2xl font-bold text-gray-900">{totalBooths}</p>
              </div>
              <Building className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Available</p>
                <p className="text-2xl font-bold text-green-600">{availableBooths}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Reserved</p>
                <p className="text-2xl font-bold text-yellow-600">{reservedBooths}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Occupied</p>
                <p className="text-2xl font-bold text-blue-600">{occupiedBooths}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

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
                <p className="text-sm font-medium text-gray-600">Total Area</p>
                <p className="text-2xl font-bold text-purple-600">{totalArea.toLocaleString()} SQM</p>
              </div>
              <Ruler className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
                <p className="text-2xl font-bold text-orange-600">{occupancyRate.toFixed(1)}%</p>
              </div>
              <MapPin className="w-8 h-8 text-orange-600" />
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
                placeholder="Search booths..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {boothStatuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
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

      {/* Booths Table */}
      <Card>
        <CardHeader>
          <CardTitle>Booths Directory</CardTitle>
          <CardDescription>
            {filteredBooths.length} booths found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booth</TableHead>
                <TableHead>Exhibition</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Size & Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBooths.map((booth) => (
                <TableRow key={booth.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Grid3X3 className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{booth.booth_number}</p>
                        <p className="text-sm text-gray-600">{booth.booth_type || 'Standard'}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{booth.exhibitions_2026_01_10?.exhibition_name}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(booth.exhibitions_2026_01_10?.start_date || '').toLocaleDateString()}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      {booth.clients_2026_01_10 ? (
                        <>
                          <p className="font-medium text-gray-900">{booth.clients_2026_01_10.client_name}</p>
                          <p className="text-sm text-gray-600">{booth.clients_2026_01_10.contact_person}</p>
                        </>
                      ) : (
                        <p className="text-sm text-gray-500">Unassigned</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{booth.size_sqm} SQM</p>
                      {booth.booth_type && (
                        <Badge className={getBoothTypeColor(booth.booth_type)} variant="secondary">
                          {booth.booth_type}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {booth.location_hall && (
                        <p className="text-sm font-medium">Hall: {booth.location_hall}</p>
                      )}
                      {booth.location_section && (
                        <p className="text-sm text-gray-600">Section: {booth.location_section}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-semibold">EGP {booth.total_price.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">EGP {booth.price_per_sqm}/SQM</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(booth.status)} variant="secondary">
                      {booth.status}
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
                        <DropdownMenuItem onClick={() => handleEdit(booth)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Booth
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDelete(booth.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Booth
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

      {/* Edit Booth Dialog */}
      <Dialog open={isEditBoothOpen} onOpenChange={setIsEditBoothOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Booth</DialogTitle>
            <DialogDescription>
              Update booth information.
            </DialogDescription>
          </DialogHeader>
          <BoothForm onSubmit={handleUpdate} isEdit={true} />
        </DialogContent>
      </Dialog>
    </div>
  );
}