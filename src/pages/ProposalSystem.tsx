import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Building2,
  Calendar,
  DollarSign,
  FileCheck,
  Signature,
  Copy,
  Archive,
  RefreshCw,
  PenTool,
  FileX,
  AlertTriangle,
  Tag,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  ThumbsDown,
  Printer,
  Settings,
  Flag
} from "lucide-react";

// Proposal templates and configurations
const PROPOSAL_TEMPLATES = [
  {
    id: 'premium_exhibition',
    name: 'Premium Exhibition Package',
    description: 'Complete exhibition solution with premium booth and services',
    category: 'Exhibition',
    base_price: 125000,
    includes: [
      'Premium booth space (6x6m)',
      'Professional booth design and setup',
      'Marketing materials and signage',
      'Lead generation system',
      'Networking events access',
      'Post-event analytics report'
    ]
  },
  {
    id: 'sponsorship_platinum',
    name: 'Platinum Sponsorship',
    description: 'Maximum visibility and branding opportunities',
    category: 'Sponsorship',
    base_price: 250000,
    includes: [
      'Title sponsor recognition',
      'Logo placement on all materials',
      'Speaking opportunity',
      'VIP networking access',
      'Custom activation space',
      'Year-round digital presence'
    ]
  },
  {
    id: 'partnership_strategic',
    name: 'Strategic Partnership',
    description: 'Long-term collaboration and mutual benefits',
    category: 'Partnership',
    base_price: 75000,
    includes: [
      'Co-branding opportunities',
      'Joint marketing initiatives',
      'Exclusive partner benefits',
      'Priority booth selection',
      'Quarterly business reviews',
      'Custom partnership terms'
    ]
  }
];

const VAT_RATE = 0.14; // 14% VAT

interface ProposalData {
  id?: string;
  client_id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  client_company: string;
  template_id: string;
  title: string;
  description: string;
  items: ProposalItem[];
  subtotal: number;
  vat_enabled: boolean;
  vat_amount: number;
  total_amount: number;
  valid_until: string;
  status: 'draft' | 'sent' | 'viewed' | 'signed' | 'rejected' | 'expired';
  created_at: string;
  updated_at: string;
  signed_at?: string;
  signed_by?: string;
  signature_data?: string;
  notes?: string;
  tags?: string[];
  priority?: 'low' | 'medium' | 'high';
  follow_up_date?: string;
  last_viewed?: string;
}

interface ProposalItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address?: string;
  website?: string;
}

const ProposalSystem = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [proposals, setProposals] = useState<ProposalData[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showProposalViewer, setShowProposalViewer] = useState(false);
  const [showSignatureDialog, setShowSignatureDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<ProposalData | null>(null);
  const [expandedProposalId, setExpandedProposalId] = useState<string | null>(null);
  
  // Create proposal form state
  const [newProposal, setNewProposal] = useState<Omit<ProposalData, 'id' | 'created_at' | 'updated_at'>>({
    client_id: '',
    client_name: '',
    client_email: '',
    client_phone: '',
    client_company: '',
    template_id: '',
    title: '',
    description: '',
    items: [],
    subtotal: 0,
    vat_enabled: true,
    vat_amount: 0,
    total_amount: 0,
    valid_until: '',
    status: 'draft',
    signed_at: undefined,
    signed_by: undefined,
    signature_data: undefined,
    notes: '',
    tags: [],
    priority: 'medium',
    follow_up_date: '',
    last_viewed: undefined
  });

  // Settings state
  const [settings, setSettings] = useState({
    default_validity_days: 30,
    auto_follow_up: true,
    require_signature_verification: true,
    enable_notifications: true,
    default_currency: 'USD',
    tax_rate: 14,
    company_name: 'Space Organizing',
    company_address: '123 Event Street, Expo City',
    company_email: 'info@spaceorganizing.com',
    company_phone: '+1 (555) 123-4567'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Mock clients data
      const mockClients: Client[] = [
        {
          id: 'client_1',
          name: 'John Smith',
          email: 'john.smith@ecotech.com',
          phone: '+1 (555) 123-4567',
          company: 'EcoTech Solutions',
          address: '456 Green Avenue, EcoCity',
          website: 'www.ecotechsolutions.com'
        },
        {
          id: 'client_2',
          name: 'Sarah Johnson',
          email: 'sarah.j@solardynamics.com',
          phone: '+1 (555) 234-5678',
          company: 'Solar Dynamics Corp',
          address: '789 Solar Blvd, SunCity',
          website: 'www.solardynamicscorp.com'
        },
        {
          id: 'client_3',
          name: 'Michael Chen',
          email: 'm.chen@windpower.com',
          phone: '+1 (555) 345-6789',
          company: 'WindPower Solutions',
          address: '101 Wind Way, BreezeTown',
          website: 'www.windpowersolutions.com'
        }
      ];

      // Mock proposals data
      const mockProposals: ProposalData[] = [
        {
          id: 'proposal_1',
          client_id: 'client_1',
          client_name: 'John Smith',
          client_email: 'john.smith@ecotech.com',
          client_phone: '+1 (555) 123-4567',
          client_company: 'EcoTech Solutions',
          template_id: 'premium_exhibition',
          title: 'Green Energy Expo 2024 - Premium Exhibition Package',
          description: 'Comprehensive exhibition solution for sustainable energy showcase',
          items: [
            {
              id: 'item_1',
              description: 'Premium Booth Space (6x6m)',
              quantity: 1,
              unit_price: 75000,
              total: 75000
            },
            {
              id: 'item_2',
              description: 'Professional Booth Design & Setup',
              quantity: 1,
              unit_price: 35000,
              total: 35000
            },
            {
              id: 'item_3',
              description: 'Marketing & Lead Generation Package',
              quantity: 1,
              unit_price: 15000,
              total: 15000
            }
          ],
          subtotal: 125000,
          vat_enabled: true,
          vat_amount: 17500,
          total_amount: 142500,
          valid_until: '2024-02-15T23:59:59Z',
          status: 'signed',
          created_at: '2024-01-10T09:00:00Z',
          updated_at: '2024-01-15T14:30:00Z',
          signed_at: '2024-01-15T14:30:00Z',
          signed_by: 'John Smith, CEO',
          signature_data: 'signature_hash_123',
          notes: 'Client requested additional networking access',
          tags: ['expo', 'green-energy', 'premium'],
          priority: 'high',
          follow_up_date: '2024-02-20T00:00:00Z',
          last_viewed: '2024-01-14T10:30:00Z'
        },
        {
          id: 'proposal_2',
          client_id: 'client_2',
          client_name: 'Sarah Johnson',
          client_email: 'sarah.j@solardynamics.com',
          client_phone: '+1 (555) 234-5678',
          client_company: 'Solar Dynamics Corp',
          template_id: 'sponsorship_platinum',
          title: 'Platinum Sponsorship - Clean Energy Summit 2024',
          description: 'Maximum visibility package for industry leadership positioning',
          items: [
            {
              id: 'item_1',
              description: 'Title Sponsor Recognition',
              quantity: 1,
              unit_price: 150000,
              total: 150000
            },
            {
              id: 'item_2',
              description: 'Custom Activation Space',
              quantity: 1,
              unit_price: 75000,
              total: 75000
            },
            {
              id: 'item_3',
              description: 'Digital Marketing Package',
              quantity: 1,
              unit_price: 25000,
              total: 25000
            }
          ],
          subtotal: 250000,
          vat_enabled: true,
          vat_amount: 35000,
          total_amount: 285000,
          valid_until: '2024-02-20T23:59:59Z',
          status: 'sent',
          created_at: '2024-01-12T11:30:00Z',
          updated_at: '2024-01-12T11:30:00Z',
          notes: 'Awaiting client review and approval',
          tags: ['sponsorship', 'platinum', 'summit'],
          priority: 'high',
          follow_up_date: '2024-01-20T00:00:00Z'
        },
        {
          id: 'proposal_3',
          client_id: 'client_3',
          client_name: 'Michael Chen',
          client_email: 'm.chen@windpower.com',
          client_phone: '+1 (555) 345-6789',
          client_company: 'WindPower Solutions',
          template_id: 'partnership_strategic',
          title: 'Strategic Partnership Agreement 2024-2025',
          description: 'Long-term collaboration for renewable energy initiatives',
          items: [
            {
              id: 'item_1',
              description: 'Annual Partnership Fee',
              quantity: 1,
              unit_price: 50000,
              total: 50000
            },
            {
              id: 'item_2',
              description: 'Co-branding & Marketing Rights',
              quantity: 1,
              unit_price: 20000,
              total: 20000
            },
            {
              id: 'item_3',
              description: 'Exclusive Benefits Package',
              quantity: 1,
              unit_price: 5000,
              total: 5000
            }
          ],
          subtotal: 75000,
          vat_enabled: false,
          vat_amount: 0,
          total_amount: 75000,
          valid_until: '2024-03-01T23:59:59Z',
          status: 'viewed',
          created_at: '2024-01-14T16:15:00Z',
          updated_at: '2024-01-16T10:20:00Z',
          last_viewed: '2024-01-16T10:20:00Z',
          notes: 'Client requested modifications to partnership terms',
          tags: ['partnership', 'strategic', 'renewable'],
          priority: 'medium',
          follow_up_date: '2024-01-25T00:00:00Z'
        }
      ];

      setProposals(mockProposals);
      setClients(mockClients);
      
      toast({
        title: "Proposal Data Loaded",
        description: `Loaded ${mockProposals.length} proposals and ${mockClients.length} clients`,
      });
    } catch (error: any) {
      console.error('Error loading proposal data:', error);
      toast({
        title: "Error",
        description: "Failed to load proposals data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProposal = () => {
    const defaultValidityDate = new Date();
    defaultValidityDate.setDate(defaultValidityDate.getDate() + settings.default_validity_days);
    
    setNewProposal({
      client_id: '',
      client_name: '',
      client_email: '',
      client_phone: '',
      client_company: '',
      template_id: '',
      title: '',
      description: '',
      items: [],
      subtotal: 0,
      vat_enabled: true,
      vat_amount: 0,
      total_amount: 0,
      valid_until: defaultValidityDate.toISOString().split('T')[0],
      status: 'draft',
      signed_at: undefined,
      signed_by: undefined,
      signature_data: undefined,
      notes: '',
      tags: [],
      priority: 'medium',
      follow_up_date: '',
      last_viewed: undefined
    });
    setShowCreateDialog(true);
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = PROPOSAL_TEMPLATES.find(t => t.id === templateId);
    if (!template) return;
    
    const items: ProposalItem[] = template.includes.map((item, index) => ({
      id: `item_${index + 1}`,
      description: item,
      quantity: 1,
      unit_price: template.base_price / template.includes.length,
      total: template.base_price / template.includes.length
    }));
    
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const vatAmount = newProposal.vat_enabled ? subtotal * (settings.tax_rate / 100) : 0;
    
    setNewProposal(prev => ({
      ...prev,
      template_id: templateId,
      title: template.name,
      description: template.description,
      items,
      subtotal,
      vat_amount: vatAmount,
      total_amount: subtotal + vatAmount
    }));
  };

  const handleClientSelect = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;
    
    setNewProposal(prev => ({
      ...prev,
      client_id: clientId,
      client_name: client.name,
      client_email: client.email,
      client_phone: client.phone,
      client_company: client.company
    }));
  };

  const toggleVAT = (enabled: boolean) => {
    const vatAmount = enabled ? (newProposal.subtotal || 0) * (settings.tax_rate / 100) : 0;
    setNewProposal(prev => ({
      ...prev,
      vat_enabled: enabled,
      vat_amount: vatAmount,
      total_amount: (prev.subtotal || 0) + vatAmount
    }));
  };

  const updateProposalItem = (itemId: string, field: keyof ProposalItem, value: any) => {
    setNewProposal(prev => {
      const updatedItems = (prev.items || []).map(item => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'quantity' || field === 'unit_price') {
            updatedItem.total = updatedItem.quantity * updatedItem.unit_price;
          }
          return updatedItem;
        }
        return item;
      });
      
      const subtotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
      const vatAmount = prev.vat_enabled ? subtotal * (settings.tax_rate / 100) : 0;
      
      return {
        ...prev,
        items: updatedItems,
        subtotal,
        vat_amount: vatAmount,
        total_amount: subtotal + vatAmount
      };
    });
  };

  const addProposalItem = () => {
    const newItem: ProposalItem = {
      id: `item_${Date.now()}`,
      description: '',
      quantity: 1,
      unit_price: 0,
      total: 0
    };
    setNewProposal(prev => ({
      ...prev,
      items: [...(prev.items || []), newItem]
    }));
  };

  const removeProposalItem = (itemId: string) => {
    setNewProposal(prev => {
      const updatedItems = (prev.items || []).filter(item => item.id !== itemId);
      const subtotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
      const vatAmount = prev.vat_enabled ? subtotal * (settings.tax_rate / 100) : 0;
      
      return {
        ...prev,
        items: updatedItems,
        subtotal,
        vat_amount: vatAmount,
        total_amount: subtotal + vatAmount
      };
    });
  };

  const saveProposal = async () => {
    try {
      // Validate required fields
      if (!newProposal.client_id || !newProposal.title || !newProposal.items?.length) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }
      
      // Create new proposal
      const proposalData: ProposalData = {
        ...newProposal,
        id: `proposal_${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setProposals(prev => [proposalData, ...prev]);
      setShowCreateDialog(false);
      
      toast({
        title: "Success",
        description: "Proposal created successfully",
      });
    } catch (error: any) {
      console.error('Error creating proposal:', error);
      toast({
        title: "Error",
        description: "Failed to create proposal",
        variant: "destructive",
      });
    }
  };

  const sendProposal = async (proposalId: string) => {
    try {
      setProposals(prev => prev.map(p => 
        p.id === proposalId 
          ? { ...p, status: 'sent', updated_at: new Date().toISOString() }
          : p
      ));
      
      toast({
        title: "Success",
        description: "Proposal sent to client successfully",
      });
    } catch (error: any) {
      console.error('Error sending proposal:', error);
      toast({
        title: "Error",
        description: "Failed to send proposal",
        variant: "destructive",
      });
    }
  };

  const handleSignProposal = async (proposalId: string) => {
    try {
      setProposals(prev => prev.map(p => 
        p.id === proposalId 
          ? { 
              ...p, 
              status: 'signed',
              signed_at: new Date().toISOString(),
              signed_by: 'Digital Signature',
              signature_data: `signature_${Date.now()}`,
              updated_at: new Date().toISOString()
            }
          : p
      ));
      
      setShowSignatureDialog(false);
      
      toast({
        title: "Success",
        description: "Proposal signed successfully",
      });
    } catch (error: any) {
      console.error('Error signing proposal:', error);
      toast({
        title: "Error",
        description: "Failed to sign proposal",
        variant: "destructive",
      });
    }
  };

  const handleRejectProposal = async (proposalId: string) => {
    try {
      setProposals(prev => prev.map(p => 
        p.id === proposalId 
          ? { 
              ...p, 
              status: 'rejected',
              updated_at: new Date().toISOString()
            }
          : p
      ));
      
      toast({
        title: "Proposal Rejected",
        description: "Proposal has been marked as rejected",
      });
    } catch (error: any) {
      console.error('Error rejecting proposal:', error);
      toast({
        title: "Error",
        description: "Failed to reject proposal",
        variant: "destructive",
      });
    }
  };

  const handleArchiveProposal = async (proposalId: string) => {
    try {
      setProposals(prev => prev.map(p => 
        p.id === proposalId 
          ? { 
              ...p, 
              status: 'expired',
              updated_at: new Date().toISOString()
            }
          : p
      ));
      
      toast({
        title: "Proposal Archived",
        description: "Proposal has been archived",
      });
    } catch (error: any) {
      console.error('Error archiving proposal:', error);
      toast({
        title: "Error",
        description: "Failed to archive proposal",
        variant: "destructive",
      });
    }
  };

  const handleDuplicateProposal = async (proposal: ProposalData) => {
    try {
      const duplicatedProposal: ProposalData = {
        ...proposal,
        id: `proposal_${Date.now()}`,
        title: `${proposal.title} (Copy)`,
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        signed_at: undefined,
        signed_by: undefined,
        signature_data: undefined
      };
      
      setProposals(prev => [duplicatedProposal, ...prev]);
      
      toast({
        title: "Proposal Duplicated",
        description: "A copy of the proposal has been created",
      });
    } catch (error: any) {
      console.error('Error duplicating proposal:', error);
      toast({
        title: "Error",
        description: "Failed to duplicate proposal",
        variant: "destructive",
      });
    }
  };

  const handleFollowUp = async (proposalId: string) => {
    try {
      setProposals(prev => prev.map(p => 
        p.id === proposalId 
          ? { 
              ...p, 
              follow_up_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              updated_at: new Date().toISOString()
            }
          : p
      ));
      
      toast({
        title: "Follow-up Scheduled",
        description: "Follow-up reminder has been set for 7 days from now",
      });
    } catch (error: any) {
      console.error('Error scheduling follow-up:', error);
      toast({
        title: "Error",
        description: "Failed to schedule follow-up",
        variant: "destructive",
      });
    }
  };

  const filteredProposals = proposals.filter(proposal => {
    const matchesSearch = searchTerm === "" || 
      proposal.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.client_company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (proposal.tags && proposal.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    
    const matchesStatus = statusFilter === "all" || proposal.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || proposal.priority === priorityFilter;
    
    // Category filter based on template
    let matchesCategory = true;
    if (categoryFilter !== "all") {
      const template = PROPOSAL_TEMPLATES.find(t => t.id === proposal.template_id);
      matchesCategory = template?.category.toLowerCase() === categoryFilter;
    }
    
    // Date filter logic
    let matchesDate = true;
    if (dateFilter !== "all" && proposal.valid_until) {
      const validUntil = new Date(proposal.valid_until);
      const today = new Date();
      const diffDays = Math.ceil((validUntil.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      switch (dateFilter) {
        case "expired":
          matchesDate = diffDays < 0;
          break;
        case "expiring-soon":
          matchesDate = diffDays >= 0 && diffDays <= 7;
          break;
        case "this-month":
          matchesDate = validUntil.getMonth() === today.getMonth() && 
                        validUntil.getFullYear() === today.getFullYear();
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory && matchesDate;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: settings.default_currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Draft</Badge>;
      case 'sent':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Sent</Badge>;
      case 'viewed':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Viewed</Badge>;
      case 'signed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Signed</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
      case 'expired':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Expired</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <PenTool className="w-4 h-4 text-gray-500" />;
      case 'sent': return <Send className="w-4 h-4 text-blue-500" />;
      case 'viewed': return <Eye className="w-4 h-4 text-purple-500" />;
      case 'signed': return <FileCheck className="w-4 h-4 text-green-500" />;
      case 'rejected': return <FileX className="w-4 h-4 text-red-500" />;
      case 'expired': return <Clock className="w-4 h-4 text-orange-500" />;
      default: return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Low</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Medium</Badge>;
    }
  };

  // Calculate statistics
  const stats = {
    total: proposals.length,
    signed: proposals.filter(p => p.status === 'signed').length,
    pending: proposals.filter(p => ['sent', 'viewed'].includes(p.status)).length,
    draft: proposals.filter(p => p.status === 'draft').length,
    rejected: proposals.filter(p => p.status === 'rejected').length,
    totalValue: proposals.reduce((sum, p) => sum + p.total_amount, 0),
    avgValue: proposals.length > 0 ? proposals.reduce((sum, p) => sum + p.total_amount, 0) / proposals.length : 0,
    conversionRate: proposals.length > 0 ? (proposals.filter(p => p.status === 'signed').length / proposals.length) * 100 : 0
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-96 bg-gray-200 rounded animate-pulse mt-2"></div>
          </div>
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-9 w-24 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-8 w-1/2 bg-gray-200 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 w-full bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-600" />
            Proposals & E-Signature
          </h1>
          <p className="text-gray-600 mt-2">
            Create, manage, and track client proposals with integrated e-signature
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setShowSettingsDialog(true)}>
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={loadData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleCreateProposal} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Proposal
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Proposals</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-xs text-green-600 mt-2 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              +15% this month
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Signed Proposals</p>
                <p className="text-2xl font-bold">{stats.signed}</p>
              </div>
              <FileCheck className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-xs text-green-600 mt-2">
              {stats.conversionRate.toFixed(1)}% conversion rate
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-xs text-gray-600 mt-2">Pipeline value</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
            <p className="text-xs text-gray-600 mt-2">Awaiting client action</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Search proposals, clients, tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="viewed">Viewed</SelectItem>
                  <SelectItem value="signed">Signed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-40">
                  <Flag className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <Tag className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="exhibition">Exhibition</SelectItem>
                  <SelectItem value="sponsorship">Sponsorship</SelectItem>
                  <SelectItem value="partnership">Partnership</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-40">
                  <Calendar className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="expiring-soon">Expiring Soon</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Proposals List */}
      <div className="space-y-4">
        {filteredProposals.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {proposals.length === 0 ? "No Proposals Found" : "No Matching Proposals"}
              </h3>
              <p className="text-gray-600 mb-4">
                {proposals.length === 0 
                  ? "Create your first proposal to get started"
                  : "Try adjusting your search criteria or filters"
                }
              </p>
              <Button onClick={handleCreateProposal}>
                <Plus className="w-4 h-4 mr-2" />
                Create Proposal
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredProposals.map((proposal) => (
            <Card 
              key={proposal.id} 
              className={`hover:shadow-md transition-shadow ${expandedProposalId === proposal.id ? 'ring-2 ring-blue-500' : ''}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                      {getStatusIcon(proposal.status)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap mb-2">
                        <h3 className="font-semibold text-gray-900">{proposal.title}</h3>
                        {getStatusBadge(proposal.status)}
                        {getPriorityBadge(proposal.priority || 'medium')}
                        {proposal.tags && proposal.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <p className="text-gray-600 mb-3">{proposal.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Client:</span>
                          <p className="font-medium">{proposal.client_name}</p>
                          <p className="text-gray-500 text-xs">{proposal.client_company}</p>
                        </div>
                        
                        <div>
                          <span className="font-medium text-gray-700">Value:</span>
                          <p className="font-medium text-green-600">{formatCurrency(proposal.total_amount)}</p>
                        </div>
                        
                        <div>
                          <span className="font-medium text-gray-700">Valid Until:</span>
                          <p className="font-medium">{formatDate(proposal.valid_until)}</p>
                        </div>
                        
                        <div>
                          <span className="font-medium text-gray-700">Created:</span>
                          <p className="font-medium">{formatDate(proposal.created_at)}</p>
                        </div>
                      </div>
                      
                      {proposal.signed_at && (
                        <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex items-center gap-2">
                            <Signature className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-800">
                              Signed by {proposal.signed_by} on {formatDate(proposal.signed_at)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setExpandedProposalId(expandedProposalId === proposal.id ? null : proposal.id || null)}
                    >
                      {expandedProposalId === proposal.id ? 
                        <ChevronUp className="w-4 h-4" /> : 
                        <ChevronDown className="w-4 h-4" />
                      }
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSelectedProposal(proposal);
                        setShowProposalViewer(true);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {expandedProposalId === proposal.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedProposal(proposal);
                          setShowProposalViewer(true);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      
                      {proposal.status === 'draft' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => sendProposal(proposal.id!)}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Send
                        </Button>
                      )}
                      
                      {['sent', 'viewed'].includes(proposal.status) && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedProposal(proposal);
                            setShowSignatureDialog(true);
                          }}
                        >
                          <Signature className="w-4 h-4 mr-2" />
                          Sign
                        </Button>
                      )}
                      
                      {proposal.status === 'sent' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleRejectProposal(proposal.id!)}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <ThumbsDown className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      )}
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDuplicateProposal(proposal)}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Duplicate
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleFollowUp(proposal.id!)}
                      >
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Follow Up
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleArchiveProposal(proposal.id!)}
                      >
                        <Archive className="w-4 h-4 mr-2" />
                        Archive
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create Proposal Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create New Proposal
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="client">Client *</Label>
                      <Select 
                        value={newProposal.client_id} 
                        onValueChange={handleClientSelect}
                      >
                        <SelectTrigger id="client">
                          <SelectValue placeholder="Select client" />
                        </SelectTrigger>
                        <SelectContent>
                          {clients.map(client => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.name} ({client.company})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="template">Template</Label>
                      <Select 
                        value={newProposal.template_id} 
                        onValueChange={handleTemplateSelect}
                      >
                        <SelectTrigger id="template">
                          <SelectValue placeholder="Select template" />
                        </SelectTrigger>
                        <SelectContent>
                          {PROPOSAL_TEMPLATES.map(template => (
                            <SelectItem key={template.id} value={template.id}>
                              {template.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="title">Proposal Title *</Label>
                    <Input
                      id="title"
                      value={newProposal.title}
                      onChange={(e) => setNewProposal(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter proposal title"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newProposal.description}
                      onChange={(e) => setNewProposal(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter proposal description"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="valid_until">Valid Until *</Label>
                      <Input
                        id="valid_until"
                        type="date"
                        value={newProposal.valid_until}
                        onChange={(e) => setNewProposal(prev => ({ ...prev, valid_until: e.target.value }))}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Select 
                        value={newProposal.priority} 
                        onValueChange={(value) => setNewProposal(prev => ({ ...prev, priority: value as any }))}
                      >
                        <SelectTrigger id="priority">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      placeholder="Enter tags separated by commas"
                      value={newProposal.tags?.join(', ') || ''}
                      onChange={(e) => setNewProposal(prev => ({ 
                        ...prev, 
                        tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag) 
                      }))}
                    />
                  </div>
                </CardContent>
              </Card>
              
              {/* Proposal Items */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Proposal Items</CardTitle>
                    <Button onClick={addProposalItem} variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Item
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(newProposal.items || []).map((item) => (
                    <div key={item.id} className="grid grid-cols-12 gap-3 items-end">
                      <div className="col-span-5">
                        <Label>Description</Label>
                        <Input
                          value={item.description}
                          onChange={(e) => updateProposalItem(item.id, 'description', e.target.value)}
                          placeholder="Item description"
                        />
                      </div>
                      
                      <div className="col-span-2">
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateProposalItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      
                      <div className="col-span-3">
                        <Label>Unit Price</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={item.unit_price}
                          onChange={(e) => updateProposalItem(item.id, 'unit_price', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      
                      <div className="col-span-1">
                        <Label>Total</Label>
                        <p className="font-medium">{formatCurrency(item.total)}</p>
                      </div>
                      
                      <div className="col-span-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeProposalItem(item.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FileX className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              {/* Totals */}
              <Card>
                <CardHeader>
                  <CardTitle>Totals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-medium">{formatCurrency(newProposal.subtotal || 0)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Switch
                        id="vat"
                        checked={newProposal.vat_enabled}
                        onCheckedChange={toggleVAT}
                      />
                      <Label htmlFor="vat">VAT ({settings.tax_rate}%)</Label>
                    </div>
                    <span className="font-medium">{formatCurrency(newProposal.vat_amount || 0)}</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-3 flex justify-between">
                    <span className="font-semibold">Total Amount:</span>
                    <span className="font-bold text-lg text-green-600">
                      {formatCurrency(newProposal.total_amount || 0)}
                    </span>
                  </div>
                </CardContent>
              </Card>
              
              {/* Notes */}
              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={newProposal.notes || ''}
                    onChange={(e) => setNewProposal(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Add internal notes..."
                    rows={4}
                  />
                </CardContent>
              </Card>
              
              {/* Actions */}
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowCreateDialog(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={saveProposal}
                >
                  Create Proposal
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Proposal Viewer Dialog */}
      <Dialog open={showProposalViewer} onOpenChange={setShowProposalViewer}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedProposal?.title}
            </DialogTitle>
          </DialogHeader>
          
          {selectedProposal && (
            <div className="space-y-6">
              {/* Proposal Header */}
              <div className="text-center border-b pb-6">
                <h1 className="text-2xl font-bold text-gray-900">{settings.company_name}</h1>
                <p className="text-gray-600">{settings.company_address}</p>
                <p className="text-gray-600">{settings.company_email} | {settings.company_phone}</p>
              </div>
              
              {/* Client Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Proposal For:</h3>
                  <p className="font-medium">{selectedProposal.client_name}</p>
                  <p className="text-gray-600">{selectedProposal.client_company}</p>
                  <p className="text-gray-600">{selectedProposal.client_email}</p>
                  <p className="text-gray-600">{selectedProposal.client_phone}</p>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(selectedProposal.status)}
                    {getStatusBadge(selectedProposal.status)}
                  </div>
                  <p><span className="font-medium">Date:</span> {formatDate(selectedProposal.created_at)}</p>
                  <p><span className="font-medium">Valid Until:</span> {formatDate(selectedProposal.valid_until)}</p>
                  <p><span className="font-medium">Proposal #:</span> {selectedProposal.id}</p>
                </div>
              </div>
              
              {/* Description */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700">{selectedProposal.description}</p>
              </div>
              
              {/* Items */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Proposal Items</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Description</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-700">Qty</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-700">Unit Price</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-700">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedProposal.items.map((item) => (
                        <tr key={item.id} className="border-t">
                          <td className="py-3 px-4">{item.description}</td>
                          <td className="py-3 px-4 text-right">{item.quantity}</td>
                          <td className="py-3 px-4 text-right">{formatCurrency(item.unit_price)}</td>
                          <td className="py-3 px-4 text-right font-medium">{formatCurrency(item.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Totals */}
              <div className="ml-auto w-full md:w-1/2">
                <div className="border rounded-lg overflow-hidden">
                  <div className="p-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="font-medium">{formatCurrency(selectedProposal.subtotal)}</span>
                    </div>
                    
                    {selectedProposal.vat_enabled && (
                      <div className="flex justify-between">
                        <span>VAT ({settings.tax_rate}%):</span>
                        <span className="font-medium">{formatCurrency(selectedProposal.vat_amount)}</span>
                      </div>
                    )}
                    
                    <div className="border-t border-gray-200 pt-2 flex justify-between">
                      <span className="font-semibold">Total Amount:</span>
                      <span className="font-bold text-lg text-green-600">
                        {formatCurrency(selectedProposal.total_amount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Signature Section */}
              {selectedProposal.signed_at && (
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <Signature className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Digitally Signed</h3>
                      <p className="text-gray-600">
                        Signed by {selectedProposal.signed_by} on {formatDate(selectedProposal.signed_at)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div className="flex gap-3 mt-6">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setShowProposalViewer(false)}
            >
              Close
            </Button>
            <Button variant="outline" className="flex-1">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            {selectedProposal && ['sent', 'viewed'].includes(selectedProposal.status) && (
              <Button 
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={() => {
                  setShowProposalViewer(false);
                  setShowSignatureDialog(true);
                }}
              >
                <Signature className="w-4 h-4 mr-2" />
                Sign Proposal
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* E-Signature Dialog */}
      <Dialog open={showSignatureDialog} onOpenChange={setShowSignatureDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Signature className="w-5 h-5" />
              Digital Signature
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Signature className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sign Proposal</h3>
              <p className="text-gray-600">
                By signing this proposal, you agree to the terms and conditions outlined above.
              </p>
            </div>
            
            {selectedProposal && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Proposal:</span>
                  <span className="text-right">{selectedProposal.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Client:</span>
                  <span>{selectedProposal.client_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Total Amount:</span>
                  <span className="font-bold text-green-600">{formatCurrency(selectedProposal.total_amount)}</span>
                </div>
              </div>
            )}
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4" />
                Important Notice
              </h4>
              <p className="text-yellow-700 text-sm">
                This digital signature is legally binding and equivalent to a handwritten signature.
                Please review all terms carefully before proceeding.
              </p>
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setShowSignatureDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={() => selectedProposal && handleSignProposal(selectedProposal.id!)}
            >
              <Signature className="w-4 h-4 mr-2" />
              Sign Proposal
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Proposal Settings
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="company_name">Company Name</Label>
                  <Input
                    id="company_name"
                    value={settings.company_name}
                    onChange={(e) => setSettings(prev => ({ ...prev, company_name: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="company_address">Company Address</Label>
                  <Input
                    id="company_address"
                    value={settings.company_address}
                    onChange={(e) => setSettings(prev => ({ ...prev, company_address: e.target.value }))}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company_email">Email</Label>
                    <Input
                      id="company_email"
                      type="email"
                      value={settings.company_email}
                      onChange={(e) => setSettings(prev => ({ ...prev, company_email: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="company_phone">Phone</Label>
                    <Input
                      id="company_phone"
                      value={settings.company_phone}
                      onChange={(e) => setSettings(prev => ({ ...prev, company_phone: e.target.value }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Proposal Defaults</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="default_validity">Default Validity (days)</Label>
                    <Input
                      id="default_validity"
                      type="number"
                      value={settings.default_validity_days}
                      onChange={(e) => setSettings(prev => ({ 
                        ...prev, 
                        default_validity_days: parseInt(e.target.value) || 30 
                      }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="tax_rate">Tax Rate (%)</Label>
                    <Input
                      id="tax_rate"
                      type="number"
                      step="0.1"
                      value={settings.tax_rate}
                      onChange={(e) => setSettings(prev => ({ 
                        ...prev, 
                        tax_rate: parseFloat(e.target.value) || 14 
                      }))}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto_follow_up">Auto Follow-up</Label>
                  <Switch
                    id="auto_follow_up"
                    checked={settings.auto_follow_up}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, auto_follow_up: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="require_signature_verification">Require Signature Verification</Label>
                  <Switch
                    id="require_signature_verification"
                    checked={settings.require_signature_verification}
                    onCheckedChange={(checked) => setSettings(prev => ({ 
                      ...prev, 
                      require_signature_verification: checked 
                    }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="enable_notifications">Enable Notifications</Label>
                  <Switch
                    id="enable_notifications"
                    checked={settings.enable_notifications}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enable_notifications: checked }))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex gap-3 mt-6">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setShowSettingsDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                toast({
                  title: "Settings Saved",
                  description: "Your proposal settings have been updated",
                });
                setShowSettingsDialog(false);
              }}
            >
              Save Settings
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProposalSystem;