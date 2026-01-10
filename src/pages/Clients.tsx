import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Building2,
  Mail,
  Phone,
  MapPin,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Download,
  Users,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface Country {
  id: string;
  name: string;
  code: string;
}

interface Client {
  id: string;
  client_name: string;
  client_type: string;
  contact_person: string;
  email: string;
  phone?: string;
  website?: string;
  industry?: string;
  company_size?: string;
  address?: string;
  country_id?: string;
  city?: string;
  notes?: string;
  status: string;
  created_at: string;
  countries_2026_01_10?: Country;
}

interface ClientFormData {
  client_name: string;
  client_type: string;
  contact_person: string;
  email: string;
  phone: string;
  website: string;
  industry: string;
  company_size: string;
  address: string;
  country_id: string;
  city: string;
  notes: string;
}

export default function Clients() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [clientTypeFilter, setClientTypeFilter] = useState('all');
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [isEditClientOpen, setIsEditClientOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form data state
  const [formData, setFormData] = useState<ClientFormData>({
    client_name: '',
    client_type: '',
    contact_person: '',
    email: '',
    phone: '',
    website: '',
    industry: '',
    company_size: '',
    address: '',
    country_id: '',
    city: '',
    notes: ''
  });

  // Dropdown options from system settings
  const clientTypes = ['Sponsor', 'Exhibitor', 'Media Partner'];
  const industries = ['Food & Beverage', 'Beauty & Wellness', 'Home & Design', 'Green Manufacturing'];
  const companySizes = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];

  useEffect(() => {
    fetchClients();
    fetchCountries();
  }, []);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients_2026_01_10')
        .select(`
          *,
          countries_2026_01_10 (
            id,
            name,
            code
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch clients',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('clients_2026_01_10')
        .insert([formData]);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Client created successfully',
      });

      setIsAddClientOpen(false);
      resetForm();
      fetchClients();
    } catch (error) {
      console.error('Error creating client:', error);
      toast({
        title: 'Error',
        description: 'Failed to create client',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      client_name: client.client_name,
      client_type: client.client_type,
      contact_person: client.contact_person,
      email: client.email,
      phone: client.phone || '',
      website: client.website || '',
      industry: client.industry || '',
      company_size: client.company_size || '',
      address: client.address || '',
      country_id: client.country_id || '',
      city: client.city || '',
      notes: client.notes || ''
    });
    setIsEditClientOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient) return;
    
    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('clients_2026_01_10')
        .update(formData)
        .eq('id', editingClient.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Client updated successfully',
      });

      setIsEditClientOpen(false);
      setEditingClient(null);
      resetForm();
      fetchClients();
    } catch (error) {
      console.error('Error updating client:', error);
      toast({
        title: 'Error',
        description: 'Failed to update client',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (clientId: string) => {
    if (!confirm('Are you sure you want to delete this client?')) return;

    try {
      const { error } = await supabase
        .from('clients_2026_01_10')
        .delete()
        .eq('id', clientId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Client deleted successfully',
      });

      fetchClients();
    } catch (error) {
      console.error('Error deleting client:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete client',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      client_name: '',
      client_type: '',
      contact_person: '',
      email: '',
      phone: '',
      website: '',
      industry: '',
      company_size: '',
      address: '',
      country_id: '',
      city: '',
      notes: ''
    });
  };

  const getClientTypeColor = (type: string) => {
    const colors = {
      'Sponsor': 'bg-purple-100 text-purple-800',
      'Exhibitor': 'bg-blue-100 text-blue-800',
      'Media Partner': 'bg-green-100 text-green-800',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-600';
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (client.industry && client.industry.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = clientTypeFilter === 'all' || client.client_type === clientTypeFilter;
    return matchesSearch && matchesType;
  });

  const ClientForm = ({ onSubmit, isEdit = false }: { onSubmit: (e: React.FormEvent) => void; isEdit?: boolean }) => (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="client_name">Client Name *</Label>
          <Input 
            id="client_name" 
            value={formData.client_name}
            onChange={(e) => setFormData({...formData, client_name: e.target.value})}
            placeholder="Enter client name" 
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="client_type">Client Type *</Label>
          <Select value={formData.client_type} onValueChange={(value) => setFormData({...formData, client_type: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select client type" />
            </SelectTrigger>
            <SelectContent>
              {clientTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact_person">Contact Person *</Label>
          <Input 
            id="contact_person" 
            value={formData.contact_person}
            onChange={(e) => setFormData({...formData, contact_person: e.target.value})}
            placeholder="Enter contact person name" 
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input 
            id="email" 
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            placeholder="Enter email address" 
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input 
            id="phone" 
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            placeholder="Enter phone number" 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input 
            id="website" 
            value={formData.website}
            onChange={(e) => setFormData({...formData, website: e.target.value})}
            placeholder="Enter website URL" 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="industry">Industry</Label>
          <Select value={formData.industry} onValueChange={(value) => setFormData({...formData, industry: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              {industries.map(industry => (
                <SelectItem key={industry} value={industry}>{industry}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="company_size">Company Size</Label>
          <Select value={formData.company_size} onValueChange={(value) => setFormData({...formData, company_size: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select company size" />
            </SelectTrigger>
            <SelectContent>
              {companySizes.map(size => (
                <SelectItem key={size} value={size}>{size} employees</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="country_id">Country</Label>
          <Select value={formData.country_id} onValueChange={(value) => setFormData({...formData, country_id: value})}>
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
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input 
            id="city" 
            value={formData.city}
            onChange={(e) => setFormData({...formData, city: e.target.value})}
            placeholder="Enter city" 
          />
        </div>
        <div className="col-span-2 space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input 
            id="address" 
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
            placeholder="Enter full address" 
          />
        </div>
        <div className="col-span-2 space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea 
            id="notes" 
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            placeholder="Additional notes about the client" 
          />
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => {
            if (isEdit) {
              setIsEditClientOpen(false);
              setEditingClient(null);
            } else {
              setIsAddClientOpen(false);
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
          {isEdit ? 'Update Client' : 'Create Client'}
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
            <Users className="w-8 h-8 text-blue-600" />
            Client Management
          </h1>
          <p className="text-gray-600 mt-1">Manage exhibitors, sponsors, and media partners</p>
          <div className="flex items-center gap-4 mt-4">
            <Badge className="bg-blue-100 text-blue-800">
              {clients.length} Total Clients
            </Badge>
            <Badge className="bg-green-100 text-green-800">
              {clients.filter(c => c.status === 'active').length} Active
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchClients}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Dialog open={isAddClientOpen} onOpenChange={setIsAddClientOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Client
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Client</DialogTitle>
                <DialogDescription>
                  Create a new client record for exhibitors, sponsors, or media partners.
                </DialogDescription>
              </DialogHeader>
              <ClientForm onSubmit={handleSubmit} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={clientTypeFilter} onValueChange={setClientTypeFilter}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {clientTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Client Directory</CardTitle>
          <CardDescription>
            {filteredClients.length} clients found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{client.client_name}</p>
                        <p className="text-sm text-gray-600">{client.contact_person}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getClientTypeColor(client.client_type)} variant="secondary">
                      {client.client_type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">{client.industry || 'N/A'}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Mail className="w-3 h-3" />
                        {client.email}
                      </div>
                      {client.phone && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Phone className="w-3 h-3" />
                          {client.phone}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="w-3 h-3" />
                      {client.city && client.countries_2026_01_10 
                        ? `${client.city}, ${client.countries_2026_01_10.name}`
                        : client.countries_2026_01_10?.name || 'N/A'
                      }
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(client.status)} variant="secondary">
                      {client.status}
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
                        <DropdownMenuItem onClick={() => navigate(`/clients/${client.id}`)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(client)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Client
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDelete(client.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Client
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

      {/* Edit Client Dialog */}
      <Dialog open={isEditClientOpen} onOpenChange={setIsEditClientOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
            <DialogDescription>
              Update client information.
            </DialogDescription>
          </DialogHeader>
          <ClientForm onSubmit={handleUpdate} isEdit={true} />
        </DialogContent>
      </Dialog>
    </div>
  );
}