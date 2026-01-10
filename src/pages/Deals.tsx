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
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
  Target,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Download,
  Handshake,
  Building2,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface Client {
  id: string;
  client_name: string;
  client_type: string;
  contact_person: string;
  email: string;
}

interface Exhibition {
  id: string;
  exhibition_name: string;
  start_date: string;
  end_date: string;
}

interface Deal {
  id: string;
  deal_name: string;
  client_id: string;
  exhibition_id?: string;
  deal_type: string;
  stage: string;
  value_egp: number;
  probability: number;
  expected_close_date: string;
  description?: string;
  notes?: string;
  created_at: string;
  clients_2026_01_10?: Client;
  exhibitions_2026_01_10?: Exhibition;
}

interface DealFormData {
  deal_name: string;
  client_id: string;
  exhibition_id: string;
  deal_type: string;
  stage: string;
  value_egp: string;
  probability: string;
  expected_close_date: string;
  description: string;
  notes: string;
}

export default function Deals() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [dealTypeFilter, setDealTypeFilter] = useState('all');
  const [isAddDealOpen, setIsAddDealOpen] = useState(false);
  const [isEditDealOpen, setIsEditDealOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);

  // Deal stages and types from system settings
  const dealStages = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];
  const dealTypes = ['Booth Rental', 'Sponsorship', 'Partnership', 'Service'];

  // Form data state
  const [formData, setFormData] = useState<DealFormData>({
    deal_name: '',
    client_id: '',
    exhibition_id: '',
    deal_type: '',
    stage: '',
    value_egp: '',
    probability: '',
    expected_close_date: '',
    description: '',
    notes: ''
  });

  useEffect(() => {
    fetchDeals();
    fetchClients();
    fetchExhibitions();
  }, []);

  const fetchDeals = async () => {
    try {
      const { data, error } = await supabase
        .from('deals_2026_01_10')
        .select(`
          *,
          clients_2026_01_10 (
            id,
            client_name,
            client_type,
            contact_person,
            email
          ),
          exhibitions_2026_01_10 (
            id,
            exhibition_name,
            start_date,
            end_date
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDeals(data || []);
    } catch (error) {
      console.error('Error fetching deals:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch deals',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients_2026_01_10')
        .select('id, client_name, client_type, contact_person, email')
        .eq('status', 'active')
        .order('client_name');

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
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
        value_egp: parseFloat(formData.value_egp),
        probability: parseInt(formData.probability),
        exhibition_id: formData.exhibition_id || null,
      };

      const { error } = await supabase
        .from('deals_2026_01_10')
        .insert([submitData]);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Deal created successfully',
      });

      setIsAddDealOpen(false);
      resetForm();
      fetchDeals();
    } catch (error) {
      console.error('Error creating deal:', error);
      toast({
        title: 'Error',
        description: 'Failed to create deal',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (deal: Deal) => {
    setEditingDeal(deal);
    setFormData({
      deal_name: deal.deal_name,
      client_id: deal.client_id,
      exhibition_id: deal.exhibition_id || '',
      deal_type: deal.deal_type,
      stage: deal.stage,
      value_egp: deal.value_egp.toString(),
      probability: deal.probability.toString(),
      expected_close_date: deal.expected_close_date,
      description: deal.description || '',
      notes: deal.notes || ''
    });
    setIsEditDealOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDeal) return;
    
    setSubmitting(true);

    try {
      const submitData = {
        ...formData,
        value_egp: parseFloat(formData.value_egp),
        probability: parseInt(formData.probability),
        exhibition_id: formData.exhibition_id || null,
      };

      const { error } = await supabase
        .from('deals_2026_01_10')
        .update(submitData)
        .eq('id', editingDeal.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Deal updated successfully',
      });

      setIsEditDealOpen(false);
      setEditingDeal(null);
      resetForm();
      fetchDeals();
    } catch (error) {
      console.error('Error updating deal:', error);
      toast({
        title: 'Error',
        description: 'Failed to update deal',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (dealId: string) => {
    if (!confirm('Are you sure you want to delete this deal?')) return;

    try {
      const { error } = await supabase
        .from('deals_2026_01_10')
        .delete()
        .eq('id', dealId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Deal deleted successfully',
      });

      fetchDeals();
    } catch (error) {
      console.error('Error deleting deal:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete deal',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      deal_name: '',
      client_id: '',
      exhibition_id: '',
      deal_type: '',
      stage: '',
      value_egp: '',
      probability: '',
      expected_close_date: '',
      description: '',
      notes: ''
    });
  };

  const handleRefresh = () => {
    fetchDeals();
  };

  const handleExport = () => {
    console.log('Exporting deals data...');
  };

  // Calculate metrics
  const totalDeals = deals.length;
  const totalValue = deals.reduce((sum, deal) => sum + deal.value_egp, 0);
  const wonDeals = deals.filter(deal => deal.stage === 'Closed Won').length;
  const lostDeals = deals.filter(deal => deal.stage === 'Closed Lost').length;
  const activeDeals = deals.filter(deal => !['Closed Won', 'Closed Lost'].includes(deal.stage)).length;
  const averageDealValue = totalDeals > 0 ? totalValue / totalDeals : 0;
  const winRate = totalDeals > 0 ? (wonDeals / (wonDeals + lostDeals)) * 100 : 0;

  const getStageColor = (stage: string) => {
    const colors = {
      'Lead': 'bg-gray-100 text-gray-800',
      'Qualified': 'bg-blue-100 text-blue-800',
      'Proposal': 'bg-yellow-100 text-yellow-800',
      'Negotiation': 'bg-orange-100 text-orange-800',
      'Closed Won': 'bg-green-100 text-green-800',
      'Closed Lost': 'bg-red-100 text-red-800',
    };
    return colors[stage as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getDealTypeColor = (type: string) => {
    const colors = {
      'Booth Rental': 'bg-blue-100 text-blue-800',
      'Sponsorship': 'bg-purple-100 text-purple-800',
      'Partnership': 'bg-green-100 text-green-800',
      'Service': 'bg-orange-100 text-orange-800',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.deal_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (deal.clients_2026_01_10?.client_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (deal.exhibitions_2026_01_10?.exhibition_name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStage = stageFilter === 'all' || deal.stage === stageFilter;
    const matchesType = dealTypeFilter === 'all' || deal.deal_type === dealTypeFilter;
    return matchesSearch && matchesStage && matchesType;
  });

  const DealForm = ({ onSubmit, isEdit = false }: { onSubmit: (e: React.FormEvent) => void; isEdit?: boolean }) => (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="deal_name">Deal Name *</Label>
          <Input 
            id="deal_name" 
            value={formData.deal_name}
            onChange={(e) => setFormData({...formData, deal_name: e.target.value})}
            placeholder="Enter deal name" 
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="client_id">Client *</Label>
          <Select value={formData.client_id} onValueChange={(value) => setFormData({...formData, client_id: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select client" />
            </SelectTrigger>
            <SelectContent>
              {clients.map(client => (
                <SelectItem key={client.id} value={client.id}>
                  {client.client_name} ({client.client_type})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="exhibition_id">Exhibition</Label>
          <Select value={formData.exhibition_id} onValueChange={(value) => setFormData({...formData, exhibition_id: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select exhibition (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">No Exhibition</SelectItem>
              {exhibitions.map(exhibition => (
                <SelectItem key={exhibition.id} value={exhibition.id}>
                  {exhibition.exhibition_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="deal_type">Deal Type *</Label>
          <Select value={formData.deal_type} onValueChange={(value) => setFormData({...formData, deal_type: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select deal type" />
            </SelectTrigger>
            <SelectContent>
              {dealTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="stage">Stage *</Label>
          <Select value={formData.stage} onValueChange={(value) => setFormData({...formData, stage: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select stage" />
            </SelectTrigger>
            <SelectContent>
              {dealStages.map(stage => (
                <SelectItem key={stage} value={stage}>{stage}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="value_egp">Value (EGP) *</Label>
          <Input 
            id="value_egp" 
            type="number"
            step="0.01"
            value={formData.value_egp}
            onChange={(e) => setFormData({...formData, value_egp: e.target.value})}
            placeholder="Enter deal value" 
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="probability">Probability (%) *</Label>
          <Input 
            id="probability" 
            type="number"
            min="0"
            max="100"
            value={formData.probability}
            onChange={(e) => setFormData({...formData, probability: e.target.value})}
            placeholder="Enter probability" 
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="expected_close_date">Expected Close Date *</Label>
          <Input 
            id="expected_close_date" 
            type="date"
            value={formData.expected_close_date}
            onChange={(e) => setFormData({...formData, expected_close_date: e.target.value})}
            required 
          />
        </div>
        <div className="col-span-2 space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description" 
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Enter deal description" 
          />
        </div>
        <div className="col-span-2 space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea 
            id="notes" 
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            placeholder="Enter additional notes" 
          />
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => {
            if (isEdit) {
              setIsEditDealOpen(false);
              setEditingDeal(null);
            } else {
              setIsAddDealOpen(false);
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
          {isEdit ? 'Update Deal' : 'Create Deal'}
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
            <Handshake className="w-8 h-8 text-blue-600" />
            Deals Management
          </h1>
          <p className="text-gray-600 mt-1">Track and manage sales opportunities and deals</p>
          <div className="flex items-center gap-4 mt-4">
            <Badge className="bg-blue-100 text-blue-800">
              {totalDeals} Total Deals
            </Badge>
            <Badge className="bg-green-100 text-green-800">
              {activeDeals} Active
            </Badge>
            <Badge className="bg-purple-100 text-purple-800">
              {winRate.toFixed(1)}% Win Rate
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
          <Dialog open={isAddDealOpen} onOpenChange={setIsAddDealOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Deal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Deal</DialogTitle>
                <DialogDescription>
                  Create a new sales opportunity or deal.
                </DialogDescription>
              </DialogHeader>
              <DealForm onSubmit={handleSubmit} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">EGP {totalValue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Deals</p>
                <p className="text-2xl font-bold text-blue-600">{activeDeals}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Won Deals</p>
                <p className="text-2xl font-bold text-green-600">{wonDeals}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Lost Deals</p>
                <p className="text-2xl font-bold text-red-600">{lostDeals}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Value</p>
                <p className="text-2xl font-bold text-purple-600">EGP {averageDealValue.toLocaleString()}</p>
              </div>
              <Target className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Win Rate</p>
                <p className="text-2xl font-bold text-orange-600">{winRate.toFixed(1)}%</p>
              </div>
              <AlertCircle className="w-8 h-8 text-orange-600" />
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
                placeholder="Search deals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                {dealStages.map(stage => (
                  <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={dealTypeFilter} onValueChange={setDealTypeFilter}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {dealTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Deals Table */}
      <Card>
        <CardHeader>
          <CardTitle>Deals Directory</CardTitle>
          <CardDescription>
            {filteredDeals.length} deals found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Deal</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Probability</TableHead>
                <TableHead>Close Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDeals.map((deal) => (
                <TableRow key={deal.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Handshake className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{deal.deal_name}</p>
                        <p className="text-sm text-gray-600">{deal.exhibitions_2026_01_10?.exhibition_name || 'No Exhibition'}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{deal.clients_2026_01_10?.client_name}</p>
                      <p className="text-sm text-gray-600">{deal.clients_2026_01_10?.contact_person}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getDealTypeColor(deal.deal_type)} variant="secondary">
                      {deal.deal_type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStageColor(deal.stage)} variant="secondary">
                      {deal.stage}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold">
                    EGP {deal.value_egp.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{deal.probability}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="w-3 h-3" />
                      {new Date(deal.expected_close_date).toLocaleDateString()}
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
                        <DropdownMenuItem onClick={() => navigate(`/deals/${deal.id}`)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(deal)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Deal
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDelete(deal.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Deal
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

      {/* Edit Deal Dialog */}
      <Dialog open={isEditDealOpen} onOpenChange={setIsEditDealOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Deal</DialogTitle>
            <DialogDescription>
              Update deal information.
            </DialogDescription>
          </DialogHeader>
          <DealForm onSubmit={handleUpdate} isEdit={true} />
        </DialogContent>
      </Dialog>
    </div>
  );
}