import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  Handshake,
  DollarSign,
  Calendar,
  User,
  Eye,
  Edit,
  FileText,
  TrendingUp,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';

export default function Deals() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [dealTypeFilter, setDealTypeFilter] = useState('all');
  const [isAddDealOpen, setIsAddDealOpen] = useState(false);

  // Mock data - in real app this would come from API
  const deals = [
    {
      id: '1',
      client_name: 'Green Tech Solutions',
      client_id: '1',
      expo_name: 'Green Life Expo 2026',
      deal_type: 'booth',
      stage: 'terms_finalized',
      deal_value: 45000,
      probability: 90,
      assigned_salesperson: 'Sarah Johnson',
      booth_details: {
        booth_size_sqm: 36,
        booth_code: 'A-15',
        zone: 'Technology Zone',
      },
      created_at: '2026-01-05',
      last_activity: '2026-01-08',
    },
    {
      id: '2',
      client_name: 'EcoLife Industries',
      client_id: '2',
      expo_name: 'Green Life Expo 2026',
      deal_type: 'sponsor',
      stage: 'strategy_proposal',
      deal_value: 125000,
      probability: 65,
      assigned_salesperson: 'Mike Chen',
      sponsorship_details: {
        package_name: 'Gold Sponsor',
        sector_exclusivity: false,
      },
      created_at: '2026-01-03',
      last_activity: '2026-01-09',
    },
    {
      id: '3',
      client_name: 'Solar Innovations Corp',
      client_id: '3',
      expo_name: 'Green Life Expo 2026',
      deal_type: 'sector_sponsor',
      stage: 'meeting_scheduled',
      deal_value: 75000,
      probability: 40,
      assigned_salesperson: 'Emma Davis',
      sponsorship_details: {
        package_name: 'Solar Technology Sector Sponsor',
        sector_exclusivity: true,
        sector: 'Solar Technology',
      },
      created_at: '2026-01-02',
      last_activity: '2026-01-07',
    },
    {
      id: '4',
      client_name: 'Sustainable Future Corp',
      client_id: '4',
      expo_name: 'Green Life Expo 2026',
      deal_type: 'booth',
      stage: 'talking',
      deal_value: 28000,
      probability: 25,
      assigned_salesperson: 'John Wilson',
      booth_details: {
        booth_size_sqm: 24,
        booth_code: 'B-22',
        zone: 'Innovation Zone',
      },
      created_at: '2026-01-01',
      last_activity: '2026-01-06',
    },
    {
      id: '5',
      client_name: 'Clean Energy Partners',
      client_id: '5',
      expo_name: 'Green Life Expo 2026',
      deal_type: 'booth',
      stage: 'closed_won',
      deal_value: 52000,
      probability: 100,
      assigned_salesperson: 'Sarah Johnson',
      booth_details: {
        booth_size_sqm: 48,
        booth_code: 'A-08',
        zone: 'Premium Zone',
      },
      created_at: '2025-12-15',
      last_activity: '2026-01-04',
    },
  ];

  const dealStages = [
    { value: 'lead_created', label: 'Lead Created', color: 'bg-gray-100 text-gray-800' },
    { value: 'talking', label: 'Talking', color: 'bg-blue-100 text-blue-800' },
    { value: 'meeting_scheduled', label: 'Meeting Scheduled', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'strategy_proposal', label: 'Strategy Proposal', color: 'bg-purple-100 text-purple-800' },
    { value: 'objection_handling', label: 'Objection Handling', color: 'bg-orange-100 text-orange-800' },
    { value: 'terms_finalized', label: 'Terms Finalized', color: 'bg-green-100 text-green-800' },
    { value: 'closed_won', label: 'Closed - Won', color: 'bg-emerald-100 text-emerald-800' },
    { value: 'closed_lost', label: 'Closed - Lost', color: 'bg-red-100 text-red-800' },
    { value: 'deal_failed', label: 'Deal Failed', color: 'bg-red-100 text-red-800' },
    { value: 'deal_canceled', label: 'Deal Canceled', color: 'bg-gray-100 text-gray-800' },
  ];

  const getStageColor = (stage: string) => {
    const stageObj = dealStages.find(s => s.value === stage);
    return stageObj?.color || 'bg-gray-100 text-gray-800';
  };

  const getDealTypeColor = (type: string) => {
    const colors = {
      booth: 'bg-blue-100 text-blue-800',
      sponsor: 'bg-purple-100 text-purple-800',
      sector_sponsor: 'bg-green-100 text-green-800',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deal.assigned_salesperson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deal.expo_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = stageFilter === 'all' || deal.stage === stageFilter;
    const matchesType = dealTypeFilter === 'all' || deal.deal_type === dealTypeFilter;
    return matchesSearch && matchesStage && matchesType;
  });

  // Pipeline summary
  const pipelineSummary = {
    totalDeals: deals.length,
    totalValue: deals.reduce((sum, deal) => sum + deal.deal_value, 0),
    weightedValue: deals.reduce((sum, deal) => sum + (deal.deal_value * deal.probability / 100), 0),
    wonDeals: deals.filter(deal => deal.stage === 'closed_won').length,
    wonValue: deals.filter(deal => deal.stage === 'closed_won').reduce((sum, deal) => sum + deal.deal_value, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-text-primary">Deals & Sales Pipeline</h1>
          <p className="text-text-secondary mt-1">
            Track and manage your sales opportunities from lead to close
          </p>
        </div>
        <Dialog open={isAddDealOpen} onOpenChange={setIsAddDealOpen}>
          <DialogTrigger asChild>
            <Button className="bg-space-blue hover:bg-space-blue/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Deal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl dropdown-content">
            <DialogHeader>
              <DialogTitle>Create New Deal</DialogTitle>
              <DialogDescription>
                Add a new deal to your sales pipeline.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="client">Client</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent className="dropdown-content">
                    <SelectItem value="1">Green Tech Solutions</SelectItem>
                    <SelectItem value="2">EcoLife Industries</SelectItem>
                    <SelectItem value="3">Solar Innovations Corp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expo">Expo</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select expo" />
                  </SelectTrigger>
                  <SelectContent className="dropdown-content">
                    <SelectItem value="1">Green Life Expo 2026</SelectItem>
                    <SelectItem value="2">Future Tech Expo 2026</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="deal_type">Deal Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select deal type" />
                  </SelectTrigger>
                  <SelectContent className="dropdown-content">
                    <SelectItem value="booth">Booth</SelectItem>
                    <SelectItem value="sponsor">Sponsor</SelectItem>
                    <SelectItem value="sector_sponsor">Sector Sponsor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="salesperson">Assigned Salesperson</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select salesperson" />
                  </SelectTrigger>
                  <SelectContent className="dropdown-content">
                    <SelectItem value="sarah">Sarah Johnson</SelectItem>
                    <SelectItem value="mike">Mike Chen</SelectItem>
                    <SelectItem value="emma">Emma Davis</SelectItem>
                    <SelectItem value="john">John Wilson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="deal_value">Deal Value ($)</Label>
                <Input id="deal_value" type="number" placeholder="Enter deal value" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="probability">Probability (%)</Label>
                <Input id="probability" type="number" min="0" max="100" placeholder="Enter probability" />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="notes">Initial Notes</Label>
                <Textarea id="notes" placeholder="Add initial notes about this deal" />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsAddDealOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-space-blue hover:bg-space-blue/90">
                Create Deal
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Pipeline Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="enterprise-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">Total Deals</CardTitle>
            <Handshake className="h-4 w-4 text-space-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-text-primary finance-number">{pipelineSummary.totalDeals}</div>
          </CardContent>
        </Card>

        <Card className="enterprise-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">Pipeline Value</CardTitle>
            <DollarSign className="h-4 w-4 text-space-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-text-primary finance-number">
              ${pipelineSummary.totalValue.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="enterprise-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">Weighted Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-space-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-text-primary finance-number">
              ${Math.round(pipelineSummary.weightedValue).toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="enterprise-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">Won Deals</CardTitle>
            <Badge className="bg-status-success/10 text-status-success">{pipelineSummary.wonDeals}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-text-primary finance-number">
              ${pipelineSummary.wonValue.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="enterprise-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">Win Rate</CardTitle>
            <div className="text-lg font-bold text-status-success">
              {Math.round((pipelineSummary.wonDeals / pipelineSummary.totalDeals) * 100)}%
            </div>
          </CardHeader>
          <CardContent>
            <Progress 
              value={(pipelineSummary.wonDeals / pipelineSummary.totalDeals) * 100} 
              className="h-2" 
            />
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="enterprise-card">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-4 h-4" />
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
              <SelectContent className="dropdown-content">
                <SelectItem value="all">All Stages</SelectItem>
                {dealStages.map(stage => (
                  <SelectItem key={stage.value} value={stage.value}>
                    {stage.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={dealTypeFilter} onValueChange={setDealTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent className="dropdown-content">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="booth">Booth</SelectItem>
                <SelectItem value="sponsor">Sponsor</SelectItem>
                <SelectItem value="sector_sponsor">Sector Sponsor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Deals Table */}
      <Card className="enterprise-card">
        <CardHeader>
          <CardTitle>Sales Pipeline</CardTitle>
          <CardDescription>
            {filteredDeals.length} deals found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client & Expo</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Probability</TableHead>
                <TableHead>Salesperson</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDeals.map((deal) => (
                <TableRow key={deal.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div>
                      <p className="font-medium text-text-primary">{deal.client_name}</p>
                      <p className="text-sm text-text-secondary">{deal.expo_name}</p>
                      {deal.booth_details && (
                        <p className="text-xs text-text-secondary">
                          Booth {deal.booth_details.booth_code} - {deal.booth_details.booth_size_sqm}m²
                        </p>
                      )}
                      {deal.sponsorship_details && (
                        <p className="text-xs text-text-secondary">
                          {deal.sponsorship_details.package_name}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getDealTypeColor(deal.deal_type)} variant="secondary">
                      {deal.deal_type.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStageColor(deal.stage)} variant="secondary">
                      {deal.stage.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold finance-number">
                    ${deal.deal_value.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={deal.probability} className="h-2 w-16" />
                      <span className="text-sm font-medium finance-number">{deal.probability}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-text-secondary" />
                      <span className="text-sm">{deal.assigned_salesperson}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-text-secondary" />
                      <span className="text-sm">{deal.last_activity}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="dropdown-content">
                        <DropdownMenuItem onClick={() => navigate(`/deals/${deal.id}`)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Deal
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="w-4 h-4 mr-2" />
                          Generate Proposal
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