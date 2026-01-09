import React, { useState, useEffect } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
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
  Download,
  Upload,
  RefreshCw,
  Settings,
  BarChart3,
  Clock,
  Phone,
  Mail,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
  Target,
  Users,
  Building2,
  MapPin,
  Star,
  Copy,
  Archive,
  Trash2,
  Send,
  Activity,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

export default function Deals() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [dealTypeFilter, setDealTypeFilter] = useState('all');
  const [salespersonFilter, setSalespersonFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [dateRangeFilter, setDateRangeFilter] = useState('all');
  const [isAddDealOpen, setIsAddDealOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isBulkActionOpen, setIsBulkActionOpen] = useState(false);
  const [selectedDeals, setSelectedDeals] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'kanban' | 'pipeline'>('table');
  const [sortBy, setSortBy] = useState('last_activity');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  // Enhanced mock data with comprehensive deal information
  const deals = [
    {
      id: '1',
      client_name: 'Green Tech Solutions',
      client_id: '1',
      client_email: 'contact@greentech.com',
      client_phone: '+1 (555) 123-4567',
      client_company_size: 'Enterprise',
      expo_name: 'Green Life Expo 2026',
      expo_id: 'expo_1',
      deal_type: 'booth',
      stage: 'terms_finalized',
      deal_value: 45000,
      probability: 90,
      priority: 'high',
      assigned_salesperson: 'Sarah Johnson',
      salesperson_id: 'sarah_j',
      booth_details: {
        booth_size_sqm: 36,
        booth_code: 'A-15',
        zone: 'Technology Zone',
        location: 'Hall A, Level 1',
        power_requirements: '10kW',
        special_requirements: 'High-speed internet, water connection',
      },
      timeline: {
        created_at: '2026-01-05',
        last_activity: '2026-01-08',
        expected_close: '2026-01-15',
        contract_deadline: '2026-01-20',
        next_follow_up: '2026-01-10',
      },
      activities: [
        { date: '2026-01-08', type: 'call', description: 'Follow-up call completed', user: 'Sarah Johnson' },
        { date: '2026-01-07', type: 'email', description: 'Contract terms sent', user: 'Sarah Johnson' },
        { date: '2026-01-06', type: 'meeting', description: 'Site visit completed', user: 'Sarah Johnson' },
      ],
      documents: [
        { name: 'Booth Contract Draft.pdf', type: 'contract', date: '2026-01-07' },
        { name: 'Floor Plan.pdf', type: 'floorplan', date: '2026-01-06' },
      ],
      notes: 'Client is very interested in premium location. Willing to pay extra for corner booth.',
      tags: ['premium', 'technology', 'returning_client'],
      source: 'website',
      competitor_info: 'Previously exhibited with TechExpo Inc.',
      budget_range: '$40,000 - $50,000',
      decision_makers: ['John Smith (CEO)', 'Mary Johnson (Marketing Director)'],
    },
    {
      id: '2',
      client_name: 'EcoLife Industries',
      client_id: '2',
      client_email: 'partnerships@ecolife.com',
      client_phone: '+1 (555) 234-5678',
      client_company_size: 'Large',
      expo_name: 'Green Life Expo 2026',
      expo_id: 'expo_1',
      deal_type: 'sponsor',
      stage: 'strategy_proposal',
      deal_value: 125000,
      probability: 65,
      priority: 'high',
      assigned_salesperson: 'Mike Chen',
      salesperson_id: 'mike_c',
      sponsorship_details: {
        package_name: 'Gold Sponsor',
        sector_exclusivity: false,
        benefits: ['Logo on all materials', 'Speaking slot', 'Premium booth location'],
        duration: '3 days',
      },
      timeline: {
        created_at: '2026-01-03',
        last_activity: '2026-01-09',
        expected_close: '2026-01-18',
        contract_deadline: '2026-01-25',
        next_follow_up: '2026-01-11',
      },
      activities: [
        { date: '2026-01-09', type: 'email', description: 'Proposal sent for review', user: 'Mike Chen' },
        { date: '2026-01-08', type: 'meeting', description: 'Strategy meeting completed', user: 'Mike Chen' },
        { date: '2026-01-05', type: 'call', description: 'Initial requirements discussion', user: 'Mike Chen' },
      ],
      documents: [
        { name: 'Gold Sponsorship Proposal.pdf', type: 'proposal', date: '2026-01-09' },
        { name: 'Sponsorship Benefits Overview.pdf', type: 'marketing', date: '2026-01-08' },
      ],
      notes: 'Looking for maximum brand exposure. Interested in speaking opportunities.',
      tags: ['sponsorship', 'brand_exposure', 'speaking'],
      source: 'referral',
      competitor_info: 'Currently sponsors GreenTech Summit',
      budget_range: '$100,000 - $150,000',
      decision_makers: ['Lisa Brown (CMO)', 'David Wilson (VP Marketing)'],
    },
    {
      id: '3',
      client_name: 'Solar Innovations Corp',
      client_id: '3',
      client_email: 'events@solarinnovations.com',
      client_phone: '+1 (555) 345-6789',
      client_company_size: 'Medium',
      expo_name: 'Green Life Expo 2026',
      expo_id: 'expo_1',
      deal_type: 'sector_sponsor',
      stage: 'meeting_scheduled',
      deal_value: 75000,
      probability: 40,
      priority: 'medium',
      assigned_salesperson: 'Emma Davis',
      salesperson_id: 'emma_d',
      sponsorship_details: {
        package_name: 'Solar Technology Sector Sponsor',
        sector_exclusivity: true,
        sector: 'Solar Technology',
        benefits: ['Sector branding rights', 'Dedicated pavilion', 'Industry report sponsorship'],
      },
      timeline: {
        created_at: '2026-01-02',
        last_activity: '2026-01-07',
        expected_close: '2026-01-22',
        contract_deadline: '2026-01-30',
        next_follow_up: '2026-01-12',
      },
      activities: [
        { date: '2026-01-07', type: 'meeting', description: 'Meeting scheduled for next week', user: 'Emma Davis' },
        { date: '2026-01-05', type: 'email', description: 'Initial information sent', user: 'Emma Davis' },
        { date: '2026-01-03', type: 'call', description: 'First contact established', user: 'Emma Davis' },
      ],
      documents: [
        { name: 'Sector Sponsorship Overview.pdf', type: 'proposal', date: '2026-01-05' },
      ],
      notes: 'Interested in sector exclusivity. Need to demonstrate ROI clearly.',
      tags: ['sector_sponsor', 'exclusivity', 'solar'],
      source: 'cold_outreach',
      competitor_info: 'No previous expo experience',
      budget_range: '$60,000 - $80,000',
      decision_makers: ['Robert Chen (CEO)', 'Amanda Lee (Business Development)'],
    },
    {
      id: '4',
      client_name: 'Sustainable Future Corp',
      client_id: '4',
      client_email: 'info@sustainablefuture.com',
      client_phone: '+1 (555) 456-7890',
      client_company_size: 'Small',
      expo_name: 'Green Life Expo 2026',
      expo_id: 'expo_1',
      deal_type: 'booth',
      stage: 'talking',
      deal_value: 28000,
      probability: 25,
      priority: 'low',
      assigned_salesperson: 'John Wilson',
      salesperson_id: 'john_w',
      booth_details: {
        booth_size_sqm: 24,
        booth_code: 'B-22',
        zone: 'Innovation Zone',
        location: 'Hall B, Level 1',
        power_requirements: '5kW',
        special_requirements: 'Standard setup',
      },
      timeline: {
        created_at: '2026-01-01',
        last_activity: '2026-01-06',
        expected_close: '2026-01-25',
        contract_deadline: '2026-02-01',
        next_follow_up: '2026-01-13',
      },
      activities: [
        { date: '2026-01-06', type: 'email', description: 'Pricing information sent', user: 'John Wilson' },
        { date: '2026-01-04', type: 'call', description: 'Initial interest call', user: 'John Wilson' },
        { date: '2026-01-02', type: 'email', description: 'Welcome email sent', user: 'John Wilson' },
      ],
      documents: [
        { name: 'Booth Pricing Sheet.pdf', type: 'pricing', date: '2026-01-06' },
      ],
      notes: 'Budget-conscious client. Looking for basic booth package.',
      tags: ['budget_conscious', 'small_business', 'first_time'],
      source: 'trade_show',
      competitor_info: 'Considering other smaller expos',
      budget_range: '$20,000 - $30,000',
      decision_makers: ['Tom Anderson (Owner)'],
    },
    {
      id: '5',
      client_name: 'Clean Energy Partners',
      client_id: '5',
      client_email: 'marketing@cleanenergypartners.com',
      client_phone: '+1 (555) 567-8901',
      client_company_size: 'Large',
      expo_name: 'Green Life Expo 2026',
      expo_id: 'expo_1',
      deal_type: 'booth',
      stage: 'closed_won',
      deal_value: 52000,
      probability: 100,
      priority: 'high',
      assigned_salesperson: 'Sarah Johnson',
      salesperson_id: 'sarah_j',
      booth_details: {
        booth_size_sqm: 48,
        booth_code: 'A-08',
        zone: 'Premium Zone',
        location: 'Hall A, Level 1',
        power_requirements: '15kW',
        special_requirements: 'Premium lighting, AV equipment',
      },
      timeline: {
        created_at: '2025-12-15',
        last_activity: '2026-01-04',
        expected_close: '2026-01-04',
        contract_deadline: '2026-01-10',
        next_follow_up: '2026-01-15',
      },
      activities: [
        { date: '2026-01-04', type: 'contract', description: 'Contract signed and payment received', user: 'Sarah Johnson' },
        { date: '2026-01-03', type: 'meeting', description: 'Final contract review', user: 'Sarah Johnson' },
        { date: '2025-12-20', type: 'proposal', description: 'Proposal accepted', user: 'Sarah Johnson' },
      ],
      documents: [
        { name: 'Signed Contract.pdf', type: 'contract', date: '2026-01-04' },
        { name: 'Payment Receipt.pdf', type: 'payment', date: '2026-01-04' },
        { name: 'Booth Setup Requirements.pdf', type: 'setup', date: '2026-01-03' },
      ],
      notes: 'Excellent client. Paid in full upfront. Premium booth setup required.',
      tags: ['closed_won', 'premium', 'paid_in_full'],
      source: 'returning_client',
      competitor_info: 'Long-term partner',
      budget_range: '$50,000 - $60,000',
      decision_makers: ['Jennifer White (Marketing VP)', 'Michael Brown (CEO)'],
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

  const priorities = [
    { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-800' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'High', color: 'bg-red-100 text-red-800' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-200 text-red-900' },
  ];

  const salespeople = [
    { value: 'sarah_j', label: 'Sarah Johnson' },
    { value: 'mike_c', label: 'Mike Chen' },
    { value: 'emma_d', label: 'Emma Davis' },
    { value: 'john_w', label: 'John Wilson' },
  ];

  const getStageColor = (stage: string) => {
    const stageObj = dealStages.find(s => s.value === stage);
    return stageObj?.color || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const priorityObj = priorities.find(p => p.value === priority);
    return priorityObj?.color || 'bg-gray-100 text-gray-800';
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
                         deal.expo_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deal.client_email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = stageFilter === 'all' || deal.stage === stageFilter;
    const matchesType = dealTypeFilter === 'all' || deal.deal_type === dealTypeFilter;
    const matchesSalesperson = salespersonFilter === 'all' || deal.salesperson_id === salespersonFilter;
    const matchesPriority = priorityFilter === 'all' || deal.priority === priorityFilter;
    
    return matchesSearch && matchesStage && matchesType && matchesSalesperson && matchesPriority;
  });

  // Pipeline summary with enhanced metrics
  const pipelineSummary = {
    totalDeals: deals.length,
    totalValue: deals.reduce((sum, deal) => sum + deal.deal_value, 0),
    weightedValue: deals.reduce((sum, deal) => sum + (deal.deal_value * deal.probability / 100), 0),
    wonDeals: deals.filter(deal => deal.stage === 'closed_won').length,
    wonValue: deals.filter(deal => deal.stage === 'closed_won').reduce((sum, deal) => sum + deal.deal_value, 0),
    avgDealSize: deals.length > 0 ? deals.reduce((sum, deal) => sum + deal.deal_value, 0) / deals.length : 0,
    avgSalesCycle: 28, // Mock data - days
    conversionRate: deals.length > 0 ? (deals.filter(deal => deal.stage === 'closed_won').length / deals.length) * 100 : 0,
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDeals(filteredDeals.map(deal => deal.id));
    } else {
      setSelectedDeals([]);
    }
  };

  const handleSelectDeal = (dealId: string, checked: boolean) => {
    if (checked) {
      setSelectedDeals([...selectedDeals, dealId]);
    } else {
      setSelectedDeals(selectedDeals.filter(id => id !== dealId));
    }
  };

  const handleBulkAction = (action: string) => {
    toast({
      title: "Bulk Action",
      description: `${action} applied to ${selectedDeals.length} deals`,
    });
    setSelectedDeals([]);
    setIsBulkActionOpen(false);
  };

  const toggleRowExpansion = (dealId: string) => {
    if (expandedRows.includes(dealId)) {
      setExpandedRows(expandedRows.filter(id => id !== dealId));
    } else {
      setExpandedRows([...expandedRows, dealId]);
    }
  };

  const handleQuickAction = (action: string, dealId: string) => {
    toast({
      title: "Quick Action",
      description: `${action} applied to deal ${dealId}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-text-primary">Deals & Sales Pipeline</h1>
          <p className="text-text-secondary mt-1">
            Comprehensive deal management with advanced tracking and analytics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setIsImportOpen(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={isAddDealOpen} onOpenChange={setIsAddDealOpen}>
            <DialogTrigger asChild>
              <Button className="bg-space-blue hover:bg-space-blue/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Deal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl dropdown-content max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Deal</DialogTitle>
                <DialogDescription>
                  Add a comprehensive new deal to your sales pipeline with all relevant details.
                </DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="details">Deal Details</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="notes">Notes & Tags</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="client">Client *</Label>
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
                      <Label htmlFor="expo">Expo *</Label>
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
                      <Label htmlFor="deal_type">Deal Type *</Label>
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
                      <Label htmlFor="salesperson">Assigned Salesperson *</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select salesperson" />
                        </SelectTrigger>
                        <SelectContent className="dropdown-content">
                          {salespeople.map(person => (
                            <SelectItem key={person.value} value={person.value}>
                              {person.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deal_value">Deal Value ($) *</Label>
                      <Input id="deal_value" type="number" placeholder="Enter deal value" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="probability">Probability (%) *</Label>
                      <Input id="probability" type="number" min="0" max="100" placeholder="Enter probability" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent className="dropdown-content">
                          {priorities.map(priority => (
                            <SelectItem key={priority.value} value={priority.value}>
                              {priority.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="source">Lead Source</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                        <SelectContent className="dropdown-content">
                          <SelectItem value="website">Website</SelectItem>
                          <SelectItem value="referral">Referral</SelectItem>
                          <SelectItem value="cold_outreach">Cold Outreach</SelectItem>
                          <SelectItem value="trade_show">Trade Show</SelectItem>
                          <SelectItem value="returning_client">Returning Client</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="budget_range">Budget Range</Label>
                      <Input id="budget_range" placeholder="e.g., $40,000 - $50,000" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company_size">Company Size</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                        <SelectContent className="dropdown-content">
                          <SelectItem value="small">Small (1-50 employees)</SelectItem>
                          <SelectItem value="medium">Medium (51-200 employees)</SelectItem>
                          <SelectItem value="large">Large (201-1000 employees)</SelectItem>
                          <SelectItem value="enterprise">Enterprise (1000+ employees)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="decision_makers">Decision Makers</Label>
                      <Textarea id="decision_makers" placeholder="List key decision makers and their roles" />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="competitor_info">Competitor Information</Label>
                      <Textarea id="competitor_info" placeholder="Any known competitor relationships or considerations" />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="timeline" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expected_close">Expected Close Date</Label>
                      <Input id="expected_close" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contract_deadline">Contract Deadline</Label>
                      <Input id="contract_deadline" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="next_follow_up">Next Follow-up</Label>
                      <Input id="next_follow_up" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stage">Initial Stage</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select stage" />
                        </SelectTrigger>
                        <SelectContent className="dropdown-content">
                          {dealStages.map(stage => (
                            <SelectItem key={stage.value} value={stage.value}>
                              {stage.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="notes" className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="notes">Initial Notes</Label>
                      <Textarea id="notes" placeholder="Add detailed notes about this deal, client requirements, special considerations, etc." className="min-h-[100px]" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags</Label>
                      <Input id="tags" placeholder="Enter tags separated by commas (e.g., premium, technology, returning_client)" />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end gap-3 pt-4 border-t">
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
      </div>

      {/* Enhanced Pipeline Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        <Card className="enterprise-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">Total Deals</CardTitle>
            <Handshake className="h-4 w-4 text-space-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-text-primary finance-number">{pipelineSummary.totalDeals}</div>
            <p className="text-xs text-text-secondary">Active pipeline</p>
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
            <p className="text-xs text-text-secondary">Total potential</p>
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
            <p className="text-xs text-text-secondary">Probability adjusted</p>
          </CardContent>
        </Card>

        <Card className="enterprise-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">Won Deals</CardTitle>
            <CheckCircle className="h-4 w-4 text-status-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-text-primary finance-number">
              ${pipelineSummary.wonValue.toLocaleString()}
            </div>
            <p className="text-xs text-text-secondary">{pipelineSummary.wonDeals} deals closed</p>
          </CardContent>
        </Card>

        <Card className="enterprise-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">Avg Deal Size</CardTitle>
            <Target className="h-4 w-4 text-space-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-text-primary finance-number">
              ${Math.round(pipelineSummary.avgDealSize).toLocaleString()}
            </div>
            <p className="text-xs text-text-secondary">Per deal average</p>
          </CardContent>
        </Card>

        <Card className="enterprise-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">Sales Cycle</CardTitle>
            <Clock className="h-4 w-4 text-space-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-text-primary finance-number">
              {pipelineSummary.avgSalesCycle}
            </div>
            <p className="text-xs text-text-secondary">Days average</p>
          </CardContent>
        </Card>

        <Card className="enterprise-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">Win Rate</CardTitle>
            <div className="text-lg font-bold text-status-success">
              {Math.round(pipelineSummary.conversionRate)}%
            </div>
          </CardHeader>
          <CardContent>
            <Progress 
              value={pipelineSummary.conversionRate} 
              className="h-2" 
            />
            <p className="text-xs text-text-secondary mt-1">Conversion rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Filters and Search */}
      <Card className="enterprise-card">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-4 h-4" />
                  <Input
                    placeholder="Search deals, clients, emails..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Advanced Search
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-text-secondary">View:</span>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                >
                  Table
                </Button>
                <Button
                  variant={viewMode === 'kanban' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('kanban')}
                >
                  Kanban
                </Button>
                <Button
                  variant={viewMode === 'pipeline' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('pipeline')}
                >
                  Pipeline
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-4 flex-wrap">
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

              <Select value={salespersonFilter} onValueChange={setSalespersonFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by salesperson" />
                </SelectTrigger>
                <SelectContent className="dropdown-content">
                  <SelectItem value="all">All Salespeople</SelectItem>
                  {salespeople.map(person => (
                    <SelectItem key={person.value} value={person.value}>
                      {person.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent className="dropdown-content">
                  <SelectItem value="all">All Priorities</SelectItem>
                  {priorities.map(priority => (
                    <SelectItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedDeals.length > 0 && (
                <DropdownMenu open={isBulkActionOpen} onOpenChange={setIsBulkActionOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Bulk Actions ({selectedDeals.length})
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="dropdown-content">
                    <DropdownMenuItem onClick={() => handleBulkAction('Update Stage')}>
                      <Edit className="w-4 h-4 mr-2" />
                      Update Stage
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction('Assign Salesperson')}>
                      <User className="w-4 h-4 mr-2" />
                      Assign Salesperson
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction('Export Selected')}>
                      <Download className="w-4 h-4 mr-2" />
                      Export Selected
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleBulkAction('Archive')}>
                      <Archive className="w-4 h-4 mr-2" />
                      Archive
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Deals Table */}
      <Card className="enterprise-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Sales Pipeline</CardTitle>
              <CardDescription>
                {filteredDeals.length} deals found • ${filteredDeals.reduce((sum, deal) => sum + deal.deal_value, 0).toLocaleString()} total value
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedDeals.length === filteredDeals.length && filteredDeals.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Client & Contact</TableHead>
                <TableHead>Deal Details</TableHead>
                <TableHead>Stage & Priority</TableHead>
                <TableHead>Value & Probability</TableHead>
                <TableHead>Salesperson</TableHead>
                <TableHead>Timeline</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDeals.map((deal) => (
                <React.Fragment key={deal.id}>
                  <TableRow className="hover:bg-gray-50">
                    <TableCell>
                      <Checkbox
                        checked={selectedDeals.includes(deal.id)}
                        onCheckedChange={(checked) => handleSelectDeal(deal.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-text-primary">{deal.client_name}</p>
                          <Badge className="text-xs" variant="outline">{deal.client_company_size}</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-text-secondary">
                          <Mail className="w-3 h-3" />
                          <span>{deal.client_email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-text-secondary">
                          <Phone className="w-3 h-3" />
                          <span>{deal.client_phone}</span>
                        </div>
                        <p className="text-xs text-text-secondary">{deal.expo_name}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge className={getDealTypeColor(deal.deal_type)} variant="secondary">
                          {deal.deal_type.replace('_', ' ')}
                        </Badge>
                        {deal.booth_details && (
                          <div className="text-xs text-text-secondary">
                            <p>Booth {deal.booth_details.booth_code} - {deal.booth_details.booth_size_sqm}m²</p>
                            <p>{deal.booth_details.zone}</p>
                          </div>
                        )}
                        {deal.sponsorship_details && (
                          <div className="text-xs text-text-secondary">
                            <p>{deal.sponsorship_details.package_name}</p>
                            {deal.sponsorship_details.sector && <p>Sector: {deal.sponsorship_details.sector}</p>}
                          </div>
                        )}
                        <div className="flex flex-wrap gap-1 mt-1">
                          {deal.tags.slice(0, 2).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {deal.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{deal.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <Badge className={getStageColor(deal.stage)} variant="secondary">
                          {deal.stage.replace('_', ' ')}
                        </Badge>
                        <Badge className={getPriorityColor(deal.priority)} variant="secondary">
                          {deal.priority}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <p className="font-semibold finance-number text-text-primary">
                          ${deal.deal_value.toLocaleString()}
                        </p>
                        <div className="flex items-center gap-2">
                          <Progress value={deal.probability} className="h-2 w-16" />
                          <span className="text-sm font-medium finance-number">{deal.probability}%</span>
                        </div>
                        <p className="text-xs text-text-secondary">{deal.budget_range}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-space-blue/10 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-space-blue" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{deal.assigned_salesperson}</p>
                          <p className="text-xs text-text-secondary">Sales Rep</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-text-secondary" />
                          <span>Last: {deal.timeline.last_activity}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-text-secondary" />
                          <span>Next: {deal.timeline.next_follow_up}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="w-3 h-3 text-text-secondary" />
                          <span>Close: {deal.timeline.expected_close}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleRowExpansion(deal.id)}
                        >
                          {expandedRows.includes(deal.id) ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </Button>
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
                            <DropdownMenuItem onClick={() => handleQuickAction('Edit', deal.id)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Deal
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleQuickAction('Call', deal.id)}>
                              <Phone className="w-4 h-4 mr-2" />
                              Schedule Call
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleQuickAction('Email', deal.id)}>
                              <Mail className="w-4 h-4 mr-2" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleQuickAction('Proposal', deal.id)}>
                              <FileText className="w-4 h-4 mr-2" />
                              Generate Proposal
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleQuickAction('Contract', deal.id)}>
                              <FileText className="w-4 h-4 mr-2" />
                              Create Contract
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleQuickAction('Clone', deal.id)}>
                              <Copy className="w-4 h-4 mr-2" />
                              Clone Deal
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleQuickAction('Archive', deal.id)}>
                              <Archive className="w-4 h-4 mr-2" />
                              Archive
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                  
                  {/* Expanded Row Details */}
                  {expandedRows.includes(deal.id) && (
                    <TableRow>
                      <TableCell colSpan={8} className="bg-gray-50 p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          {/* Recent Activities */}
                          <div>
                            <h4 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                              <Activity className="w-4 h-4" />
                              Recent Activities
                            </h4>
                            <div className="space-y-2">
                              {deal.activities.map((activity, index) => (
                                <div key={index} className="flex items-start gap-3 p-2 bg-white rounded border">
                                  <div className={`p-1 rounded ${
                                    activity.type === 'call' ? 'bg-blue-100 text-blue-600' :
                                    activity.type === 'email' ? 'bg-green-100 text-green-600' :
                                    activity.type === 'meeting' ? 'bg-purple-100 text-purple-600' :
                                    'bg-gray-100 text-gray-600'
                                  }`}>
                                    {activity.type === 'call' && <Phone className="w-3 h-3" />}
                                    {activity.type === 'email' && <Mail className="w-3 h-3" />}
                                    {activity.type === 'meeting' && <Users className="w-3 h-3" />}
                                    {activity.type === 'contract' && <FileText className="w-3 h-3" />}
                                    {activity.type === 'proposal' && <FileText className="w-3 h-3" />}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-text-primary">{activity.description}</p>
                                    <p className="text-xs text-text-secondary">{activity.user} • {activity.date}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Documents */}
                          <div>
                            <h4 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                              <FileText className="w-4 h-4" />
                              Documents
                            </h4>
                            <div className="space-y-2">
                              {deal.documents.map((doc, index) => (
                                <div key={index} className="flex items-center gap-3 p-2 bg-white rounded border">
                                  <FileText className="w-4 h-4 text-text-secondary" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-text-primary truncate">{doc.name}</p>
                                    <p className="text-xs text-text-secondary">{doc.type} • {doc.date}</p>
                                  </div>
                                  <Button variant="ghost" size="sm">
                                    <ExternalLink className="w-3 h-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Deal Info */}
                          <div>
                            <h4 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                              <Building2 className="w-4 h-4" />
                              Deal Information
                            </h4>
                            <div className="space-y-3 text-sm">
                              <div>
                                <p className="text-text-secondary">Source</p>
                                <p className="font-medium text-text-primary capitalize">{deal.source.replace('_', ' ')}</p>
                              </div>
                              <div>
                                <p className="text-text-secondary">Decision Makers</p>
                                <div className="space-y-1">
                                  {deal.decision_makers.map((dm, index) => (
                                    <p key={index} className="text-text-primary text-xs">{dm}</p>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <p className="text-text-secondary">Competitor Info</p>
                                <p className="text-text-primary">{deal.competitor_info}</p>
                              </div>
                              <div>
                                <p className="text-text-secondary">Notes</p>
                                <p className="text-text-primary">{deal.notes}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Import Dialog */}
      <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
        <DialogContent className="dropdown-content">
          <DialogHeader>
            <DialogTitle>Import Deals</DialogTitle>
            <DialogDescription>
              Upload a CSV file to import multiple deals at once.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-text-secondary">Drop your CSV file here or click to browse</p>
              <Button variant="outline" className="mt-2">
                Choose File
              </Button>
            </div>
            <div className="text-xs text-text-secondary">
              <p>Supported format: CSV</p>
              <p>Required columns: client_name, deal_value, stage, assigned_salesperson</p>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsImportOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-space-blue hover:bg-space-blue/90">
              Import Deals
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}