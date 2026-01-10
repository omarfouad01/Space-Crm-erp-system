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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Globe, 
  Activity, 
  Clock, 
  Users, 
  CheckCircle2, 
  XCircle, 
  DollarSign, 
  Target,
  Plus,
  RefreshCw,
  Download,
  Search,
  Filter,
  Calendar,
  MapPin,
  Building,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface Country {
  id: string;
  name: string;
  code: string;
}

interface ExhibitionManager {
  id: string;
  name: string;
  email: string;
  phone?: string;
  department?: string;
}

interface Exhibition {
  id: string;
  exhibition_name: string;
  status: string;
  exhibition_manager_id?: string;
  description?: string;
  start_date: string;
  end_date: string;
  registration_start?: string;
  registration_end?: string;
  venue_name?: string;
  venue_capacity?: number;
  venue_address?: string;
  venue_city?: string;
  venue_country_id?: string;
  total_area_sqm?: number;
  expected_visitors?: number;
  website_url?: string;
  organizer_name?: string;
  organizer_email?: string;
  organizer_phone?: string;
  additional_notes?: string;
  created_at: string;
  exhibition_managers_2026_01_10?: ExhibitionManager;
  countries_2026_01_10?: Country;
}

interface ExhibitionFormData {
  exhibition_name: string;
  status: string;
  exhibition_manager_id: string;
  description: string;
  start_date: string;
  end_date: string;
  registration_start: string;
  registration_end: string;
  venue_name: string;
  venue_capacity: string;
  venue_address: string;
  venue_city: string;
  venue_country_id: string;
  total_area_sqm: string;
  expected_visitors: string;
  website_url: string;
  organizer_name: string;
  organizer_email: string;
  organizer_phone: string;
  additional_notes: string;
}

export default function Expos() {
  const { toast } = useToast();
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [exhibitionManagers, setExhibitionManagers] = useState<ExhibitionManager[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddExhibitionOpen, setIsAddExhibitionOpen] = useState(false);
  const [isEditExhibitionOpen, setIsEditExhibitionOpen] = useState(false);
  const [editingExhibition, setEditingExhibition] = useState<Exhibition | null>(null);

  // Exhibition statuses from system settings
  const exhibitionStatuses = ['Planning', 'Registration Open', 'Active', 'Completed', 'Cancelled', 'Postponed'];

  // Form data state
  const [formData, setFormData] = useState<ExhibitionFormData>({
    exhibition_name: '',
    status: '',
    exhibition_manager_id: '',
    description: '',
    start_date: '',
    end_date: '',
    registration_start: '',
    registration_end: '',
    venue_name: '',
    venue_capacity: '',
    venue_address: '',
    venue_city: '',
    venue_country_id: '',
    total_area_sqm: '',
    expected_visitors: '',
    website_url: '',
    organizer_name: '',
    organizer_email: '',
    organizer_phone: '',
    additional_notes: ''
  });

  useEffect(() => {
    fetchExhibitions();
    fetchCountries();
    fetchExhibitionManagers();
  }, []);

  const fetchExhibitions = async () => {
    try {
      const { data, error } = await supabase
        .from('exhibitions_2026_01_10')
        .select(`
          *,
          exhibition_managers_2026_01_10 (
            id,
            name,
            email,
            phone,
            department
          ),
          countries_2026_01_10 (
            id,
            name,
            code
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setExhibitions(data || []);
    } catch (error) {
      console.error('Error fetching exhibitions:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch exhibitions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCountries = async () => {
    try {
      const { data, error } = await supabase
        .from('countries_2026_01_10')
        .select('*')
        .order('name');

      if (error) throw error;
      setCountries(data || []);
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  const fetchExhibitionManagers = async () => {
    try {
      const { data, error } = await supabase
        .from('exhibition_managers_2026_01_10')
        .select('*')
        .eq('status', 'active')
        .order('name');

      if (error) throw error;
      setExhibitionManagers(data || []);
    } catch (error) {
      console.error('Error fetching exhibition managers:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const submitData = {
        ...formData,
        venue_capacity: formData.venue_capacity ? parseInt(formData.venue_capacity) : null,
        total_area_sqm: formData.total_area_sqm ? parseFloat(formData.total_area_sqm) : null,
        expected_visitors: formData.expected_visitors ? parseInt(formData.expected_visitors) : null,
      };

      const { error } = await supabase
        .from('exhibitions_2026_01_10')
        .insert([submitData]);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Exhibition created successfully',
      });

      setIsAddExhibitionOpen(false);
      resetForm();
      fetchExhibitions();
    } catch (error) {
      console.error('Error creating exhibition:', error);
      toast({
        title: 'Error',
        description: 'Failed to create exhibition',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (exhibition: Exhibition) => {
    setEditingExhibition(exhibition);
    setFormData({
      exhibition_name: exhibition.exhibition_name,
      status: exhibition.status,
      exhibition_manager_id: exhibition.exhibition_manager_id || '',
      description: exhibition.description || '',
      start_date: exhibition.start_date,
      end_date: exhibition.end_date,
      registration_start: exhibition.registration_start || '',
      registration_end: exhibition.registration_end || '',
      venue_name: exhibition.venue_name || '',
      venue_capacity: exhibition.venue_capacity?.toString() || '',
      venue_address: exhibition.venue_address || '',
      venue_city: exhibition.venue_city || '',
      venue_country_id: exhibition.venue_country_id || '',
      total_area_sqm: exhibition.total_area_sqm?.toString() || '',
      expected_visitors: exhibition.expected_visitors?.toString() || '',
      website_url: exhibition.website_url || '',
      organizer_name: exhibition.organizer_name || '',
      organizer_email: exhibition.organizer_email || '',
      organizer_phone: exhibition.organizer_phone || '',
      additional_notes: exhibition.additional_notes || ''
    });
    setIsEditExhibitionOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExhibition) return;
    
    setSubmitting(true);

    try {
      const submitData = {
        ...formData,
        venue_capacity: formData.venue_capacity ? parseInt(formData.venue_capacity) : null,
        total_area_sqm: formData.total_area_sqm ? parseFloat(formData.total_area_sqm) : null,
        expected_visitors: formData.expected_visitors ? parseInt(formData.expected_visitors) : null,
      };

      const { error } = await supabase
        .from('exhibitions_2026_01_10')
        .update(submitData)
        .eq('id', editingExhibition.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Exhibition updated successfully',
      });

      setIsEditExhibitionOpen(false);
      setEditingExhibition(null);
      resetForm();
      fetchExhibitions();
    } catch (error) {
      console.error('Error updating exhibition:', error);
      toast({
        title: 'Error',
        description: 'Failed to update exhibition',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (exhibitionId: string) => {
    if (!confirm('Are you sure you want to delete this exhibition?')) return;

    try {
      const { error } = await supabase
        .from('exhibitions_2026_01_10')
        .delete()
        .eq('id', exhibitionId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Exhibition deleted successfully',
      });

      fetchExhibitions();
    } catch (error) {
      console.error('Error deleting exhibition:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete exhibition',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      exhibition_name: '',
      status: '',
      exhibition_manager_id: '',
      description: '',
      start_date: '',
      end_date: '',
      registration_start: '',
      registration_end: '',
      venue_name: '',
      venue_capacity: '',
      venue_address: '',
      venue_city: '',
      venue_country_id: '',
      total_area_sqm: '',
      expected_visitors: '',
      website_url: '',
      organizer_name: '',
      organizer_email: '',
      organizer_phone: '',
      additional_notes: ''
    });
  };

  const handleRefresh = () => {
    fetchExhibitions();
  };

  const handleExport = () => {
    console.log('Exporting exhibitions data...');
  };

  // Calculate metrics
  const totalExhibitions = exhibitions.length;
  const activeExhibitions = exhibitions.filter(e => e.status === 'Active').length;
  const planningExhibitions = exhibitions.filter(e => e.status === 'Planning').length;
  const registrationExhibitions = exhibitions.filter(e => e.status === 'Registration Open').length;
  const completedExhibitions = exhibitions.filter(e => e.status === 'Completed').length;
  const cancelledExhibitions = exhibitions.filter(e => e.status === 'Cancelled').length;
  const totalRevenue = 0; // Will be calculated from deals later
  const totalExpectedVisitors = exhibitions.reduce((sum, e) => sum + (e.expected_visitors || 0), 0);

  const getStatusColor = (status: string) => {
    const colors = {
      'Planning': 'bg-blue-100 text-blue-800',
      'Registration Open': 'bg-purple-100 text-purple-800',
      'Active': 'bg-green-100 text-green-800',
      'Completed': 'bg-gray-100 text-gray-800',
      'Cancelled': 'bg-red-100 text-red-800',
      'Postponed': 'bg-yellow-100 text-yellow-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const filteredExhibitions = exhibitions.filter(exhibition => {
    const matchesSearch = exhibition.exhibition_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (exhibition.venue_city && exhibition.venue_city.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (exhibition.organizer_name && exhibition.organizer_name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || exhibition.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const ExhibitionForm = ({ onSubmit, isEdit = false }: { onSubmit: (e: React.FormEvent) => void; isEdit?: boolean }) => (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="exhibition_name">Exhibition Name *</Label>
            <Input 
              id="exhibition_name" 
              value={formData.exhibition_name}
              onChange={(e) => setFormData({...formData, exhibition_name: e.target.value})}
              placeholder="Enter exhibition name" 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {exhibitionStatuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="exhibition_manager_id">Exhibition Manager</Label>
            <Select value={formData.exhibition_manager_id} onValueChange={(value) => setFormData({...formData, exhibition_manager_id: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select manager" />
              </SelectTrigger>
              <SelectContent>
                {exhibitionManagers.map(manager => (
                  <SelectItem key={manager.id} value={manager.id}>{manager.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2 space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Enter exhibition description" 
            />
          </div>
        </div>
      </div>

      {/* Dates and Timeline */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Dates and Timeline</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start_date">Start Date *</Label>
            <Input 
              id="start_date" 
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData({...formData, start_date: e.target.value})}
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end_date">End Date *</Label>
            <Input 
              id="end_date" 
              type="date"
              value={formData.end_date}
              onChange={(e) => setFormData({...formData, end_date: e.target.value})}
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="registration_start">Registration Start</Label>
            <Input 
              id="registration_start" 
              type="date"
              value={formData.registration_start}
              onChange={(e) => setFormData({...formData, registration_start: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="registration_end">Registration End</Label>
            <Input 
              id="registration_end" 
              type="date"
              value={formData.registration_end}
              onChange={(e) => setFormData({...formData, registration_end: e.target.value})}
            />
          </div>
        </div>
      </div>

      {/* Venue Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Venue Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="venue_name">Venue Name</Label>
            <Input 
              id="venue_name" 
              value={formData.venue_name}
              onChange={(e) => setFormData({...formData, venue_name: e.target.value})}
              placeholder="Enter venue name" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="venue_capacity">Venue Capacity</Label>
            <Input 
              id="venue_capacity" 
              type="number"
              value={formData.venue_capacity}
              onChange={(e) => setFormData({...formData, venue_capacity: e.target.value})}
              placeholder="Enter capacity" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="venue_city">City Name</Label>
            <Input 
              id="venue_city" 
              value={formData.venue_city}
              onChange={(e) => setFormData({...formData, venue_city: e.target.value})}
              placeholder="Enter city" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="venue_country_id">Country</Label>
            <Select value={formData.venue_country_id} onValueChange={(value) => setFormData({...formData, venue_country_id: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map(country => (
                  <SelectItem key={country.id} value={country.id}>{country.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2 space-y-2">
            <Label htmlFor="venue_address">Venue Address</Label>
            <Textarea 
              id="venue_address" 
              value={formData.venue_address}
              onChange={(e) => setFormData({...formData, venue_address: e.target.value})}
              placeholder="Enter full venue address" 
            />
          </div>
        </div>
      </div>

      {/* Exhibition Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Exhibition Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="total_area_sqm">Total Area (SQM)</Label>
            <Input 
              id="total_area_sqm" 
              type="number"
              step="0.01"
              value={formData.total_area_sqm}
              onChange={(e) => setFormData({...formData, total_area_sqm: e.target.value})}
              placeholder="Enter total area" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expected_visitors">Expected Visitors</Label>
            <Input 
              id="expected_visitors" 
              type="number"
              value={formData.expected_visitors}
              onChange={(e) => setFormData({...formData, expected_visitors: e.target.value})}
              placeholder="Enter expected visitors" 
            />
          </div>
          <div className="col-span-2 space-y-2">
            <Label htmlFor="website_url">Website URL</Label>
            <Input 
              id="website_url" 
              type="url"
              value={formData.website_url}
              onChange={(e) => setFormData({...formData, website_url: e.target.value})}
              placeholder="Enter website URL" 
            />
          </div>
        </div>
      </div>

      {/* Organizer Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Organizer Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="organizer_name">Organizer Name</Label>
            <Input 
              id="organizer_name" 
              value={formData.organizer_name}
              onChange={(e) => setFormData({...formData, organizer_name: e.target.value})}
              placeholder="Enter organizer name" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="organizer_email">Organizer Email</Label>
            <Input 
              id="organizer_email" 
              type="email"
              value={formData.organizer_email}
              onChange={(e) => setFormData({...formData, organizer_email: e.target.value})}
              placeholder="Enter organizer email" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="organizer_phone">Organizer Phone</Label>
            <Input 
              id="organizer_phone" 
              value={formData.organizer_phone}
              onChange={(e) => setFormData({...formData, organizer_phone: e.target.value})}
              placeholder="Enter organizer phone" 
            />
          </div>
          <div className="col-span-2 space-y-2">
            <Label htmlFor="additional_notes">Additional Notes</Label>
            <Textarea 
              id="additional_notes" 
              value={formData.additional_notes}
              onChange={(e) => setFormData({...formData, additional_notes: e.target.value})}
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
              setIsEditExhibitionOpen(false);
              setEditingExhibition(null);
            } else {
              setIsAddExhibitionOpen(false);
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
          {isEdit ? 'Update Exhibition' : 'Create Exhibition'}
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
            <Globe className="w-8 h-8 text-blue-600" />
            Exhibitions Management
          </h1>
          <p className="text-gray-600 mt-1">Manage exhibitions, exhibitors, and event logistics</p>
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
          <Dialog open={isAddExhibitionOpen} onOpenChange={setIsAddExhibitionOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Exhibition
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Exhibition</DialogTitle>
                <DialogDescription>
                  Create a new exhibition with comprehensive details.
                </DialogDescription>
              </DialogHeader>
              <ExhibitionForm onSubmit={handleSubmit} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Exhibitions</p>
                <p className="text-2xl font-bold text-gray-900">{totalExhibitions}</p>
              </div>
              <Globe className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">{activeExhibitions}</p>
              </div>
              <Activity className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Planning</p>
                <p className="text-2xl font-bold text-blue-600">{planningExhibitions}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Registration Open</p>
                <p className="text-2xl font-bold text-purple-600">{registrationExhibitions}</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-600">{completedExhibitions}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-red-600">{cancelledExhibitions}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
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
                <p className="text-sm font-medium text-gray-600">Expected Visitors</p>
                <p className="text-2xl font-bold text-blue-600">{totalExpectedVisitors.toLocaleString()}</p>
              </div>
              <Target className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search exhibitions by name, city, or organizer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {exhibitionStatuses.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exhibitions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Exhibitions Directory</CardTitle>
          <CardDescription>
            {filteredExhibitions.length} exhibitions found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exhibition</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Venue</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead>Expected Visitors</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExhibitions.map((exhibition) => (
                <TableRow key={exhibition.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Globe className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{exhibition.exhibition_name}</p>
                        <p className="text-sm text-gray-600">{exhibition.description}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(exhibition.status)} variant="secondary">
                      {exhibition.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="w-3 h-3" />
                        {new Date(exhibition.start_date).toLocaleDateString()} - {new Date(exhibition.end_date).toLocaleDateString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{exhibition.venue_name || 'TBD'}</p>
                      {exhibition.venue_city && exhibition.countries_2026_01_10 && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin className="w-3 h-3" />
                          {exhibition.venue_city}, {exhibition.countries_2026_01_10.name}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {exhibition.exhibition_managers_2026_01_10?.name || 'Unassigned'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">
                      {exhibition.expected_visitors?.toLocaleString() || 'TBD'}
                    </div>
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
                        <DropdownMenuItem onClick={() => handleEdit(exhibition)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Exhibition
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDelete(exhibition.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Exhibition
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

      {/* Edit Exhibition Dialog */}
      <Dialog open={isEditExhibitionOpen} onOpenChange={setIsEditExhibitionOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Exhibition</DialogTitle>
            <DialogDescription>
              Update exhibition information.
            </DialogDescription>
          </DialogHeader>
          <ExhibitionForm onSubmit={handleUpdate} isEdit={true} />
        </DialogContent>
      </Dialog>
    </div>
  );
}