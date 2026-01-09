import React, { useState } from 'react';
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
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';

export default function Clients() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [clientTypeFilter, setClientTypeFilter] = useState('all');
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);

  // Mock data - in real app this would come from API
  const clients = [
    {
      id: '1',
      company_name: 'Green Tech Solutions',
      client_type: 'exhibitor',
      industry: 'Renewable Energy',
      country: 'United States',
      primary_contact: {
        name: 'John Smith',
        email: 'john@greentech.com',
        phone: '+1-555-0123',
      },
      active_deals: 2,
      total_value: 125000,
      last_activity: '2026-01-08',
      status: 'active',
    },
    {
      id: '2',
      company_name: 'EcoLife Industries',
      client_type: 'main_sponsor',
      industry: 'Sustainable Products',
      country: 'Germany',
      primary_contact: {
        name: 'Maria Schmidt',
        email: 'maria@ecolife.de',
        phone: '+49-30-12345678',
      },
      active_deals: 1,
      total_value: 250000,
      last_activity: '2026-01-09',
      status: 'active',
    },
    {
      id: '3',
      company_name: 'Solar Innovations Corp',
      client_type: 'sector_sponsor',
      industry: 'Solar Technology',
      country: 'Japan',
      primary_contact: {
        name: 'Hiroshi Tanaka',
        email: 'h.tanaka@solarinnovations.jp',
        phone: '+81-3-1234-5678',
      },
      active_deals: 1,
      total_value: 75000,
      last_activity: '2026-01-07',
      status: 'active',
    },
    {
      id: '4',
      company_name: 'Sustainable Future Corp',
      client_type: 'exhibitor',
      industry: 'Green Building',
      country: 'Canada',
      primary_contact: {
        name: 'Sarah Johnson',
        email: 'sarah@sustainablefuture.ca',
        phone: '+1-416-555-0199',
      },
      active_deals: 0,
      total_value: 0,
      last_activity: '2026-01-05',
      status: 'inactive',
    },
  ];

  const getClientTypeColor = (type: string) => {
    const colors = {
      exhibitor: 'bg-blue-100 text-blue-800',
      main_sponsor: 'bg-purple-100 text-purple-800',
      sector_sponsor: 'bg-green-100 text-green-800',
      partner_vendor: 'bg-orange-100 text-orange-800',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-status-success/10 text-status-success' 
      : 'bg-gray-100 text-gray-600';
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.primary_contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.industry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = clientTypeFilter === 'all' || client.client_type === clientTypeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="section-spacing fade-in">
      {/* Enhanced Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-text-primary tracking-tight">Clients</h1>
              <p className="text-text-secondary text-lg">
                Manage exhibitors, sponsors, and partners for your expos
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
              {clients.length} Total Clients
            </Badge>
            <Badge className="bg-green-100 text-green-800 border-green-200">
              {clients.filter(c => c.status === 'active').length} Active
            </Badge>
          </div>
        </div>
        <Dialog open={isAddClientOpen} onOpenChange={setIsAddClientOpen}>
          <DialogTrigger asChild>
            <Button className="btn-primary shadow-lg hover:shadow-xl">
              <Plus className="w-4 h-4 mr-2" />
              Add Client
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl dropdown-content">
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
              <DialogDescription>
                Create a new client record for exhibitors, sponsors, or partners.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="company_name">Company Name</Label>
                <Input id="company_name" placeholder="Enter company name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client_type">Client Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select client type" />
                  </SelectTrigger>
                  <SelectContent className="dropdown-content">
                    <SelectItem value="exhibitor">Exhibitor</SelectItem>
                    <SelectItem value="main_sponsor">Main Sponsor</SelectItem>
                    <SelectItem value="sector_sponsor">Sector Sponsor</SelectItem>
                    <SelectItem value="partner_vendor">Partner/Vendor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input id="industry" placeholder="e.g., Renewable Energy" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" placeholder="Enter country" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_name">Primary Contact Name</Label>
                <Input id="contact_name" placeholder="Enter contact name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_email">Contact Email</Label>
                <Input id="contact_email" type="email" placeholder="Enter email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_phone">Contact Phone</Label>
                <Input id="contact_phone" placeholder="Enter phone number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_position">Contact Position</Label>
                <Input id="contact_position" placeholder="e.g., CEO, Marketing Director" />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" placeholder="Additional notes about the client" />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsAddClientOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-space-blue hover:bg-space-blue/90">
                Create Client
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <Card className="enterprise-card">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-4 h-4" />
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
              <SelectContent className="dropdown-content">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="exhibitor">Exhibitors</SelectItem>
                <SelectItem value="main_sponsor">Main Sponsors</SelectItem>
                <SelectItem value="sector_sponsor">Sector Sponsors</SelectItem>
                <SelectItem value="partner_vendor">Partners/Vendors</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card className="enterprise-card">
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
                <TableHead>Primary Contact</TableHead>
                <TableHead>Active Deals</TableHead>
                <TableHead>Total Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-space-blue/10 rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-space-blue" />
                      </div>
                      <div>
                        <p className="font-medium text-text-primary">{client.company_name}</p>
                        <p className="text-sm text-text-secondary flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {client.country}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getClientTypeColor(client.client_type)} variant="secondary">
                      {client.client_type.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-text-secondary">{client.industry}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-text-primary">{client.primary_contact.name}</p>
                      <div className="flex items-center gap-3 text-sm text-text-secondary">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {client.primary_contact.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {client.primary_contact.phone}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="finance-number">
                      {client.active_deals}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold finance-number">
                    ${client.total_value.toLocaleString()}
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
                      <DropdownMenuContent align="end" className="dropdown-content">
                        <DropdownMenuItem onClick={() => navigate(`/clients/${client.id}`)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Client
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-status-error">
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
    </div>
  );
}