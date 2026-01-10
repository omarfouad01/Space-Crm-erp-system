import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { dealService, clientService, taskService, expoService, type Deal, type Client, type Exhibition } from '@/services/supabaseService';
import CreateDealDialog from '@/components/forms/CreateDealDialog';
import ComprehensiveDealForm from '@/components/forms/ComprehensiveDealForm';
import {
  Target,
  Plus,
  Search,
  Filter,
  Calendar,
  DollarSign,
  User,
  Building2,
  Phone,
  Mail,
  FileText,
  Clock,
  TrendingUp,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  MessageSquare,
  Star,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Zap,
  Users,
  MapPin,
  Globe,
  Activity,
  PieChart,
  BarChart3,
  Calculator,
  CreditCard,
  Bell,
  Flag,
  Bookmark,
  Share2,
  Download,
  RefreshCw,
} from 'lucide-react';

// Enhanced Pipeline Stages with SPACE-specific workflow
const PIPELINE_STAGES = [
  {
    id: 'talking',
    name: 'Talking',
    color: '#7B8FA1',
    description: 'Initial contact and discovery',
    icon: MessageSquare,
    actions: ['Schedule Meeting', 'Send Info', 'Add Note']
  },
  {
    id: 'meeting_scheduled',
    name: 'Meeting Scheduled',
    color: '#2BB0E6',
    description: 'Meeting arranged with prospect',
    icon: Calendar,
    actions: ['Confirm Meeting', 'Prepare Agenda', 'Send Reminder']
  },
  {
    id: 'strategy_proposal',
    name: 'Strategy Proposal',
    color: '#5FB3A2',
    description: 'Proposal sent and under review',
    icon: FileText,
    actions: ['Follow Up', 'Modify Proposal', 'Schedule Review']
  },
  {
    id: 'objection_handling',
    name: 'Objection Handling',
    color: '#9CA3AF',
    description: 'Addressing concerns and questions',
    icon: AlertCircle,
    actions: ['Address Concerns', 'Provide Clarification', 'Negotiate Terms']
  },
  {
    id: 'terms_finalized',
    name: 'Terms Finalized',
    color: '#2BB0E6',
    description: 'Agreement on terms and conditions',
    icon: CheckCircle,
    actions: ['Prepare Contract', 'Legal Review', 'Schedule Signing']
  },
  {
    id: 'closed_won',
    name: 'Closed Won',
    color: '#5FB3A2',
    description: 'Deal successfully closed',
    icon: Star,
    actions: ['Setup Payment', 'Onboard Client', 'Celebrate']
  },
  {
    id: 'closed_lost',
    name: 'Closed Lost',
    color: '#B97A7A',
    description: 'Deal lost to competitor or cancelled',
    icon: Trash2,
    actions: ['Analyze Loss', 'Future Opportunity', 'Archive']
  },
  {
    id: 'canceled',
    name: 'Canceled',
    color: '#9CA3AF',
    description: 'Deal cancelled by prospect',
    icon: Flag,
    actions: ['Document Reason', 'Future Follow-up', 'Archive']
  },
];

interface DealNote {
  id: string;
  content: string;
  author: string;
  timestamp: string;
  type: 'note' | 'call' | 'meeting' | 'email';
}

interface PaymentSchedule {
  id: string;
  amount: number;
  due_date: string;
  status: 'pending' | 'paid' | 'overdue';
  description: string;
}

interface Commission {
  user_id: string;
  user_name: string;
  percentage: number;
  amount: number;
  status: 'pending' | 'approved' | 'paid';
}

const Deals = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStage, setFilterStage] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [showDealDetails, setShowDealDetails] = useState(false);
  const [dealNotes, setDealNotes] = useState<DealNote[]>([]);
  const [newNote, setNewNote] = useState("");
  const [paymentSchedule, setPaymentSchedule] = useState<PaymentSchedule[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [dealToDelete, setDealToDelete] = useState<Deal | null>(null);
  const [expos, setExpos] = useState<Exhibition[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [dealsData, clientsData, tasksData, exposData] = await Promise.all([
        dealService.getAll(),
        clientService.getAll(),
        taskService.getAll(),
        expoService.getAll()
      ]);

      // Transform deals to match pipeline stages
      const transformedDeals = (dealsData || []).map(deal => ({
        ...deal,
        stage: deal.stage || mapStatusToStage(deal.status || 'Talking'),
        value: deal.deal_value || 0,
        client_name: deal.client_name || clientsData?.find(c => c.id === deal.client_id)?.name || 'Unknown Client',
        client_info: clientsData?.find(c => c.id === deal.client_id) || {},
        priority: deal.priority || 'Medium',
        last_activity: deal.updated_at || deal.created_at,
        notes: deal.notes || '',
        probability: deal.probability || calculateProbability(deal.status || 'Talking'),
        days_in_stage: calculateDaysInStage(deal.updated_at || deal.created_at),
        next_action: getNextAction(deal.status || 'Talking'),
        health_score: deal.health_score || calculateHealthScore(deal),
      }));

      setDeals(transformedDeals);
      setClients(clientsData || []);
      setExpos(exposData || []);
      setTasks(tasksData || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load deals data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const mapStatusToStage = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'Talking': 'talking',
      'Meeting Scheduled': 'meeting_scheduled',
      'Proposal': 'strategy_proposal',
      'Negotiation': 'objection_handling',
      'Contract': 'terms_finalized',
      'Closed Won': 'closed_won',
      'Closed Lost': 'closed_lost',
      'Canceled': 'canceled',
    };
    return statusMap[status] || 'talking';
  };

  const mapStageToStatus = (stage: string) => {
    const stageMap: { [key: string]: string } = {
      'talking': 'Talking',
      'meeting_scheduled': 'Meeting Scheduled',
      'strategy_proposal': 'Proposal',
      'objection_handling': 'Negotiation',
      'terms_finalized': 'Contract',
      'closed_won': 'Closed Won',
      'closed_lost': 'Closed Lost',
      'canceled': 'Canceled',
    };
    return stageMap[stage] || 'Talking';
  };

  const calculateProbability = (status: string) => {
    const probabilities: { [key: string]: number } = {
      'Talking': 10,
      'Meeting Scheduled': 25,
      'Proposal': 40,
      'Negotiation': 60,
      'Contract': 80,
      'Closed Won': 100,
      'Closed Lost': 0,
      'Canceled': 0,
    };
    return probabilities[status] || 10;
  };

  const calculateDaysInStage = (updatedAt: string) => {
    const now = new Date();
    const updated = new Date(updatedAt);
    const diffTime = Math.abs(now.getTime() - updated.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getNextAction = (status: string) => {
    const actions: { [key: string]: string } = {
      'Talking': 'Schedule discovery call',
      'Meeting Scheduled': 'Prepare meeting agenda',
      'Proposal': 'Follow up on proposal',
      'Negotiation': 'Address objections',
      'Contract': 'Finalize contract terms',
      'Closed Won': 'Setup onboarding',
      'Closed Lost': 'Document lessons learned',
      'Canceled': 'Archive deal',
    };
    return actions[status] || 'Update deal status';
  };

  const calculateHealthScore = (deal: any) => {
    let score = 50; // Base score

    // Adjust based on stage progression
    if (deal.stage === 'closed_won') score = 100;
    else if (deal.stage === 'closed_lost' || deal.stage === 'canceled') score = 0;
    else {
      // Factor in time in stage
      const daysInStage = calculateDaysInStage(deal.updated_at || deal.created_at);
      if (daysInStage > 30) score -= 20;
      else if (daysInStage > 14) score -= 10;

      // Factor in deal value
      if (deal.deal_value > 100000) score += 20;
      else if (deal.deal_value > 50000) score += 10;

      // Factor in client engagement
      if (deal.priority === 'High') score += 15;
      else if (deal.priority === 'Low') score -= 10;
    }

    return Math.max(0, Math.min(100, score));
  };

  const handleViewDeal = async (deal: Deal) => {
    setSelectedDeal(deal);

    // Load deal-specific data
    const mockNotes: DealNote[] = [
      {
        id: '1',
        content: 'Initial contact made. Client interested in premium sponsorship package.',
        author: 'Sarah Johnson',
        timestamp: '2024-01-15T10:30:00Z',
        type: 'note'
      },
      {
        id: '2',
        content: 'Discovery call scheduled for next Tuesday at 2 PM.',
        author: 'Sarah Johnson',
        timestamp: '2024-01-14T16:45:00Z',
        type: 'call'
      },
      {
        id: '3',
        content: 'Sent detailed proposal with custom booth configuration.',
        author: 'Mike Chen',
        timestamp: '2024-01-13T11:20:00Z',
        type: 'email'
      }
    ];
    setDealNotes(mockNotes);

    // Mock payment schedule
    const mockPayments: PaymentSchedule[] = [
      {
        id: '1',
        amount: deal.deal_value * 0.3,
        due_date: '2024-02-01T00:00:00Z',
        status: 'pending',
        description: 'Initial payment (30%)'
      },
      {
        id: '2',
        amount: deal.deal_value * 0.4,
        due_date: '2024-03-01T00:00:00Z',
        status: 'pending',
        description: 'Progress payment (40%)'
      },
      {
        id: '3',
        amount: deal.deal_value * 0.3,
        due_date: '2024-04-01T00:00:00Z',
        status: 'pending',
        description: 'Final payment (30%)'
      }
    ];
    setPaymentSchedule(mockPayments);

    // Mock commission calculation
    const mockCommissions: Commission[] = [
      {
        user_id: '1',
        user_name: 'Sarah Johnson',
        percentage: 5,
        amount: deal.deal_value * 0.05,
        status: 'pending'
      },
      {
        user_id: '2',
        user_name: 'Mike Chen',
        percentage: 2,
        amount: deal.deal_value * 0.02,
        status: 'pending'
      }
    ];
    setCommissions(mockCommissions);

    setShowDealDetails(true);
  };

  const addNote = () => {
    if (!newNote.trim() || !selectedDeal) return;

    const note: DealNote = {
      id: Date.now().toString(),
      content: newNote,
      author: 'Current User',
      timestamp: new Date().toISOString(),
      type: 'note'
    };

    setDealNotes(prev => [note, ...prev]);
    setNewNote("");

    toast({
      title: "Note Added",
      description: "Deal note has been saved successfully",
    });
  };

  // Enhanced CRUD Operations
  const handleEditDeal = (deal: Deal) => {
    setEditingDeal(deal);
    setShowEditDialog(true);
  };

  const handleDeleteDeal = (dealId: string) => {
    const deal = deals.find(d => d.id === dealId);
    if (deal) {
      setDealToDelete(deal);
      setShowDeleteDialog(true);
    }
  };

  const confirmDeleteDeal = async () => {
    if (!dealToDelete) return;

    try {
      await dealService.delete(dealToDelete.id);

      setDeals(prevDeals => prevDeals.filter(deal => deal.id !== dealToDelete.id));

      toast({
        title: "Deal Deleted",
        description: `Deal "${dealToDelete.title}" has been deleted successfully`,
      });

      setShowDeleteDialog(false);
      setDealToDelete(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete deal",
        variant: "destructive",
      });
    }
  };

  const handleUpdateDeal = async (updatedDeal: Deal) => {
    try {
      setDeals(prevDeals =>
        prevDeals.map(deal =>
          deal.id === updatedDeal.id
            ? {
                ...deal,
                ...updatedDeal,
                stage: mapStatusToStage(updatedDeal.status),
                probability: calculateProbability(updatedDeal.status),
                days_in_stage: 0,
                next_action: getNextAction(updatedDeal.status),
                health_score: calculateHealthScore({ ...deal, ...updatedDeal })
              }
            : deal
        )
      );

      toast({
        title: "Deal Updated",
        description: `Deal "${updatedDeal.title}" has been updated successfully`,
      });

      setShowEditDialog(false);
      setEditingDeal(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update deal",
        variant: "destructive",
      });
    }
  };

  // Export functionality
  const handleExport = () => {
    try {
      // Prepare data for export
      const exportData = filteredDeals.map(deal => ({
        'Deal Title': deal.title,
        'Client': deal.client_name,
        'Created By': deal.created_by_name || 'Unknown',
        'Assigned To': deal.assigned_to_name || 'Unassigned',
        'Stage': mapStageToStatus(deal.stage),
        'Value': deal.deal_value,
        'Priority': deal.priority,
        'Probability': `${deal.probability}%`,
        'Health Score': `${deal.health_score}%`,
        'Days in Stage': deal.days_in_stage,
        'Expected Close Date': deal.close_date ? new Date(deal.close_date).toLocaleDateString() : 'Not set',
        'Created Date': new Date(deal.created_at).toLocaleDateString(),
        'Last Updated': new Date(deal.updated_at || deal.created_at).toLocaleDateString(),
        'Description': deal.description || '',
        'Notes': deal.notes || '',
        'Next Action': deal.next_action
      }));

      // Convert to CSV
      const headers = Object.keys(exportData[0] || {});
      const csvContent = [
        headers.join(','),
        ...exportData.map(row =>
          headers.map(header => {
            const value = row[header as keyof typeof row];
            // Escape commas and quotes in CSV
            return typeof value === 'string' && (value.includes(',') || value.includes('"'))
              ? `"${value.replace(/"/g, '""')}"`
              : value;
          }).join(',')
        )
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `deals-export-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export Successful",
        description: `Exported ${exportData.length} deals to CSV file`,
      });
    } catch (error: any) {
      toast({
        title: "Export Failed",
        description: "Failed to export deals data",
        variant: "destructive",
      });
    }
  };

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = searchTerm === "" ||
      deal.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.client_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStage = filterStage === "all" || deal.stage === filterStage;
    const matchesPriority = filterPriority === "all" || deal.priority === filterPriority;

    return matchesSearch && matchesStage && matchesPriority;
  });

  const getDealsByStage = (stageId: string) => {
    return filteredDeals.filter(deal => deal.stage === stageId);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="content-area">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading deals...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content-area">
      <div className="space-y-8">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Target className="w-8 h-8 text-blue-600" />
              Sales Pipeline
            </h1>
            <p className="text-gray-600 mt-2">Manage deals through the complete SPACE sales process</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant={viewMode === 'kanban' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('kanban')}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Kanban
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <FileText className="w-4 h-4 mr-2" />
              List
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" onClick={loadData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Deal
            </Button>
          </div>
        </div>

        {/* Enhanced Pipeline Statistics */}
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600 mb-1">Total Deals</p>
                    <p className="text-3xl font-bold text-blue-900">{filteredDeals.length}</p>
                  </div>
                  <div className="p-3 bg-blue-200 rounded-full">
                    <Target className="w-6 h-6 text-blue-700" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600 mb-1">Total Value</p>
                    <p className="text-2xl font-bold text-green-900">
                      {formatCurrency(filteredDeals.reduce((sum, deal) => sum + (deal.deal_value || 0), 0))}
                    </p>
                  </div>
                  <div className="p-3 bg-green-200 rounded-full">
                    <DollarSign className="w-6 h-6 text-green-700" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600 mb-1">Won Deals</p>
                    <p className="text-3xl font-bold text-purple-900">
                      {getDealsByStage('closed_won').length}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-200 rounded-full">
                    <Star className="w-6 h-6 text-purple-700" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600 mb-1">Win Rate</p>
                    <p className="text-3xl font-bold text-orange-900">
                      {filteredDeals.length > 0
                        ? Math.round((getDealsByStage('closed_won').length / filteredDeals.length) * 100)
                        : 0}%
                    </p>
                  </div>
                  <div className="p-3 bg-orange-200 rounded-full">
                    <TrendingUp className="w-6 h-6 text-orange-700" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stage Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {PIPELINE_STAGES.map(stage => {
              const stageDeals = getDealsByStage(stage.id);
              const stageValue = stageDeals.reduce((sum, deal) => sum + (deal.deal_value || 0), 0);
              const IconComponent = stage.icon;

              return (
                <Card key={stage.id} className="border-0 shadow-sm">
                  <CardContent className="p-4 text-center">
                    <div className="p-2 rounded-lg mb-2 mx-auto w-fit" style={{ backgroundColor: `${stage.color}20` }}>
                      <IconComponent className="w-5 h-5" style={{ color: stage.color }} />
                    </div>
                    <h3 className="font-medium text-sm text-gray-900 mb-1">{stage.name}</h3>
                    <div className="space-y-1">
                      <p className="text-lg font-bold text-gray-900">{stageDeals.length}</p>
                      <p className="text-xs text-gray-600">{formatCurrency(stageValue)}</p>
                      {stageDeals.length > 0 && (
                        <p className="text-xs text-gray-500">
                          Avg: {formatCurrency(stageValue / stageDeals.length)}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                placeholder="Search deals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStage} onValueChange={setFilterStage}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Stages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                {PIPELINE_STAGES.map(stage => (
                  <SelectItem key={stage.id} value={stage.id}>
                    {stage.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Pipeline Board */}
        {viewMode === 'kanban' ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-8 gap-4 overflow-x-auto">
            {PIPELINE_STAGES.map(stage => {
              const IconComponent = stage.icon;
              return (
                <div key={stage.id} className="min-w-80 lg:min-w-0">
                  <Card className="h-full">
                    <CardHeader className="pb-3" style={{ backgroundColor: `${stage.color}10` }}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <IconComponent className="w-4 h-4" style={{ color: stage.color }} />
                          <CardTitle className="text-sm font-medium">{stage.name}</CardTitle>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {getDealsByStage(stage.id).length}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{stage.description}</p>
                    </CardHeader>
                    <CardContent className="p-3 space-y-3 min-h-96">
                      {getDealsByStage(stage.id).map((deal) => (
                        <Card key={deal.id} className="cursor-pointer hover:shadow-md transition-shadow border border-gray-200">
                          <CardContent className="p-4">
                            {/* Deal Header */}
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm text-gray-900 truncate mb-1">
                                  {deal.title}
                                </h4>
                                <p className="text-xs text-gray-600 truncate">
                                  {deal.client_name}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Created by: {deal.created_by_name || 'Unknown'}
                                </p>
                              </div>
                              <Badge className={`text-xs ${getPriorityColor(deal.priority)}`}>
                                {deal.priority}
                              </Badge>
                            </div>

                            {/* Health Score */}
                            <div className="mb-3">
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-gray-500">Health</span>
                                <span className={`font-medium ${getHealthScoreColor(deal.health_score || 50)}`}>
                                  {deal.health_score || 50}%
                                </span>
                              </div>
                            </div>

                            {/* Deal Value & Probability */}
                            <div className="flex items-center justify-between mb-3">
                              <div className="text-lg font-semibold text-green-600">
                                {formatCurrency(deal.deal_value)}
                              </div>
                              <div className="text-sm font-medium text-blue-600">
                                {deal.probability}%
                              </div>
                            </div>

                            {/* Deal Progress */}
                            <div className="mb-3">
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-gray-500">Progress</span>
                                <span className="font-medium">{deal.probability}%</span>
                              </div>
                              <Progress value={deal.probability} className="h-2" />
                            </div>

                            {/* Deal Details */}
                            <div className="space-y-2 text-xs text-gray-600">
                              {deal.close_date && (
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>Close: {new Date(deal.close_date).toLocaleDateString()}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{deal.days_in_stage} days in stage</span>
                              </div>
                            </div>

                            {/* Next Action */}
                            <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
                              <div className="flex items-center gap-1 text-gray-700">
                                <Zap className="w-3 h-3" />
                                <span className="font-medium">Next:</span>
                              </div>
                              <p className="text-gray-600 mt-1">{deal.next_action}</p>
                            </div>

                            {/* Quick Actions */}
                            <div className="flex items-center justify-between mt-3 pt-3 border-t">
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewDeal(deal);
                                  }}
                                >
                                  <Eye className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditDeal(deal);
                                  }}
                                >
                                  <Edit className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteDeal(deal.id);
                                  }}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                              <div className="flex items-center gap-1">
                                {deal.notes && (
                                  <MessageSquare className="w-3 h-3 text-gray-400" />
                                )}
                                {deal.priority === 'High' && (
                                  <AlertCircle className="w-3 h-3 text-red-500" />
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        ) : (
          /* List View */
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Deal</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Probability</TableHead>
                    <TableHead>Health</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDeals.map((deal) => (
                    <TableRow key={deal.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{deal.title}</p>
                          <p className="text-sm text-gray-500">{deal.days_in_stage} days in stage</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{deal.client_name}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{deal.created_by_name || 'Unknown'}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{mapStageToStatus(deal.stage)}</Badge>
                      </TableCell>
                      <TableCell>
                        <p className="font-semibold text-green-600">{formatCurrency(deal.deal_value)}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={deal.probability} className="w-16 h-2" />
                          <span className="text-sm">{deal.probability}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`font-medium ${getHealthScoreColor(deal.health_score || 50)}`}>
                          {deal.health_score || 50}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDeal(deal)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditDeal(deal)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteDeal(deal.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Deal Details Dialog */}
        <Dialog open={showDealDetails} onOpenChange={setShowDealDetails}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedDeal?.title} - Deal Details</DialogTitle>
            </DialogHeader>
            
            {selectedDeal && (
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="notes">Notes ({dealNotes.length})</TabsTrigger>
                  <TabsTrigger value="tasks">Tasks</TabsTrigger>
                  <TabsTrigger value="payments">Payments</TabsTrigger>
                  <TabsTrigger value="commission">Commission</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  {/* Deal Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Deal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Value</Label>
                        <p className="text-2xl font-bold text-green-600">{formatCurrency(selectedDeal.deal_value)}</p>
                      </div>
                      <div>
                        <Label>Probability</Label>
                        <p className="text-xl font-semibold">{selectedDeal.probability}%</p>
                      </div>
                      <div>
                        <Label>Priority</Label>
                        <Badge className={getPriorityColor(selectedDeal.priority)}>{selectedDeal.priority}</Badge>
                      </div>
                      <div>
                        <Label>Health Score</Label>
                        <div className="flex items-center gap-2">
                          <Progress value={selectedDeal.health_score} className="flex-1" />
                          <span className={`font-medium ${getHealthScoreColor(selectedDeal.health_score || 50)}`}>
                            {selectedDeal.health_score || 50}%
                          </span>
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <Label>Next Action</Label>
                        <p className="text-gray-700">{selectedDeal.next_action}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Client Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Client Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <Building2 className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{selectedDeal.client_name}</h3>
                          <p className="text-gray-600">{selectedDeal.client_info?.type || 'Client'}</p>
                          
                          {selectedDeal.client_info?.email && (
                            <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                              <Mail className="w-4 h-4" />
                              <span>{selectedDeal.client_info.email}</span>
                            </div>
                          )}
                          {selectedDeal.client_info?.phone && (
                            <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                              <Phone className="w-4 h-4" />
                              <span>{selectedDeal.client_info.phone}</span>
                            </div>
                          )}
                          {selectedDeal.client_info?.city && (
                            <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                              <MapPin className="w-4 h-4" />
                              <span>
                                {selectedDeal.client_info.city}, {selectedDeal.client_info.country}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="notes" className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Add a note about this deal..."
                      className="flex-1"
                    />
                    <Button onClick={addNote}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Note
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {dealNotes.map((note) => (
                      <Card key={note.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">
                                {note.author.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm">{note.author}</span>
                                <Badge variant="outline" className="text-xs">{note.type}</Badge>
                                <span className="text-xs text-gray-500">
                                  {new Date(note.timestamp).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-gray-700 text-sm">{note.content}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="payments" className="space-y-4">
                  {paymentSchedule.map((payment) => (
                    <Card key={payment.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{payment.description}</h4>
                            <p className="text-sm text-gray-600">
                              Due: {new Date(payment.due_date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold">{formatCurrency(payment.amount)}</p>
                            <Badge variant={payment.status === 'paid' ? 'default' : 'secondary'}>
                              {payment.status}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="commission" className="space-y-4">
                  {commissions.map((commission) => (
                    <Card key={commission.user_id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{commission.user_name}</h4>
                            <p className="text-sm text-gray-600">{commission.percentage}% commission</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold">{formatCurrency(commission.amount)}</p>
                            <Badge variant="outline">{commission.status}</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="activity" className="space-y-4">
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-gray-600">Activity timeline will be displayed here</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Deal Dialog */}
        {editingDeal && (
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Deal - {editingDeal.title}</DialogTitle>
              </DialogHeader>
              <ComprehensiveDealForm
                deal={editingDeal}
                clients={clients}
                exhibitions={expos}
                onSuccess={handleUpdateDeal}
                onCancel={() => setShowEditDialog(false)}
              />
            </DialogContent>
          </Dialog>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Deal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <div>
                  <p className="font-medium text-red-900">Are you sure you want to delete this deal?</p>
                  <p className="text-sm text-red-700 mt-1">This action cannot be undone.</p>
                </div>
              </div>
              
              {dealToDelete && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium">{dealToDelete.title}</h4>
                  <p className="text-sm text-gray-600">{dealToDelete.client_name}</p>
                  <p className="text-sm font-semibold text-green-600">{formatCurrency(dealToDelete.deal_value)}</p>
                </div>
              )}
              
              <div className="flex items-center justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmDeleteDeal}
                >
                  Delete Deal
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Create Deal Dialog */}
        <CreateDealDialog
          isOpen={showCreateDialog}
          onClose={() => setShowCreateDialog(false)}
          onSuccess={loadData}
          clients={clients}
          exhibitions={expos}
        />
      </div>
    </div>
  );
};

export default Deals;