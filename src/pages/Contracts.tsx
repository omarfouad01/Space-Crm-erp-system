import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  FileText,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Calendar,
  DollarSign,
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  Edit,
  Trash2,
  Download,
  Send,
  PenTool,
  FileCheck,
  FileX,
  RefreshCw,
  TrendingUp,
  Building2,
  Flag,
  Link,
  User,
  ExternalLink,
  Upload,
  Save,
  X,
  Star,
  Archive,
  Copy,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Target,
  Activity,
  BarChart3,
  PieChart,
  Loader2
} from "lucide-react";

interface Document {
  id: string;
  document_number: string;
  title: string;
  description?: string;
  document_type: string;
  status: string;
  priority: string;
  client_name?: string;
  deal_name?: string;
  contract_value?: number;
  currency?: string;
  signature_deadline?: string;
  assigned_to_name?: string;
  version: number;
  tags?: string[];
  file_url?: string;
  created_at: string;
  updated_at: string;
}

interface DocumentStats {
  total: number;
  draft: number;
  sent: number;
  signed: number;
  review: number;
  totalValue: number;
  overdue: number;
}

const Documents = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all-status");
  const [typeFilter, setTypeFilter] = useState("all-types");
  const [priorityFilter, setPriorityFilter] = useState("all-priority");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState('all');

  // Form states for create/edit
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    document_type: 'Contract',
    status: 'Draft',
    priority: 'Medium',
    client_name: '',
    deal_name: '',
    contract_value: '',
    currency: 'USD',
    signature_deadline: '',
    assigned_to_name: '',
    tags: ''
  });

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      
      // Mock data since we don't have a documents table yet
      const mockDocuments: Document[] = [
        {
          id: '1',
          document_number: 'DOC-2026-001',
          title: 'Solar Energy Partnership Agreement',
          description: 'Comprehensive partnership agreement for solar energy project development',
          document_type: 'Contract',
          status: 'Review',
          priority: 'High',
          client_name: 'EcoTech Solutions',
          deal_name: 'Solar Farm Development',
          contract_value: 2500000,
          currency: 'USD',
          signature_deadline: '2026-02-15',
          assigned_to_name: 'Sarah Johnson',
          version: 2,
          tags: ['renewable', 'partnership', 'high-value'],
          file_url: '#',
          created_at: '2026-01-05T10:00:00Z',
          updated_at: '2026-01-10T14:30:00Z'
        },
        {
          id: '2',
          document_number: 'DOC-2026-002',
          title: 'Wind Energy Service Agreement',
          description: 'Service agreement for wind turbine maintenance and operations',
          document_type: 'Agreement',
          status: 'Sent',
          priority: 'Medium',
          client_name: 'Green Energy Alliance',
          deal_name: 'Wind Farm Operations',
          contract_value: 850000,
          currency: 'USD',
          signature_deadline: '2026-01-25',
          assigned_to_name: 'Mike Chen',
          version: 1,
          tags: ['wind', 'maintenance', 'operations'],
          file_url: '#',
          created_at: '2026-01-08T09:15:00Z',
          updated_at: '2026-01-09T16:45:00Z'
        },
        {
          id: '3',
          document_number: 'DOC-2026-003',
          title: 'Clean Tech Investment Proposal',
          description: 'Investment proposal for clean technology development fund',
          document_type: 'Proposal',
          status: 'Draft',
          priority: 'Critical',
          client_name: 'Future Energy Corp',
          deal_name: 'Clean Tech Fund',
          contract_value: 5000000,
          currency: 'USD',
          signature_deadline: '2026-02-01',
          assigned_to_name: 'Emma Davis',
          version: 3,
          tags: ['investment', 'clean-tech', 'fund'],
          file_url: '#',
          created_at: '2026-01-10T11:30:00Z',
          updated_at: '2026-01-10T15:20:00Z'
        },
        {
          id: '4',
          document_number: 'DOC-2026-004',
          title: 'Renewable Energy Consulting Contract',
          description: 'Consulting services contract for renewable energy strategy',
          document_type: 'Contract',
          status: 'Signed',
          priority: 'Medium',
          client_name: 'Solar Dynamics Inc',
          deal_name: 'Strategy Consulting',
          contract_value: 125000,
          currency: 'USD',
          signature_deadline: '2026-01-15',
          assigned_to_name: 'Lisa Wang',
          version: 1,
          tags: ['consulting', 'strategy', 'renewable'],
          file_url: '#',
          created_at: '2026-01-03T14:20:00Z',
          updated_at: '2026-01-08T10:15:00Z'
        },
        {
          id: '5',
          document_number: 'DOC-2026-005',
          title: 'Energy Storage System Quote',
          description: 'Detailed quote for battery energy storage system installation',
          document_type: 'Quote',
          status: 'Sent',
          priority: 'High',
          client_name: 'PowerGrid Solutions',
          deal_name: 'Battery Storage Project',
          contract_value: 1750000,
          currency: 'USD',
          signature_deadline: '2026-01-30',
          assigned_to_name: 'Alex Thompson',
          version: 2,
          tags: ['storage', 'battery', 'installation'],
          file_url: '#',
          created_at: '2026-01-07T13:45:00Z',
          updated_at: '2026-01-10T09:30:00Z'
        },
        {
          id: '6',
          document_number: 'DOC-2026-006',
          title: 'Environmental Impact Report',
          description: 'Comprehensive environmental impact assessment report',
          document_type: 'Report',
          status: 'Review',
          priority: 'Low',
          client_name: 'EcoTech Solutions',
          deal_name: 'Environmental Assessment',
          contract_value: 75000,
          currency: 'USD',
          signature_deadline: '2026-02-10',
          assigned_to_name: 'John Doe',
          version: 1,
          tags: ['environmental', 'assessment', 'compliance'],
          file_url: '#',
          created_at: '2026-01-09T16:00:00Z',
          updated_at: '2026-01-10T12:00:00Z'
        }
      ];

      setDocuments(mockDocuments);
      
    } catch (error: any) {
      console.error('Error loading documents:', error);
      toast({
        title: "Error",
        description: "Failed to load documents",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDocument = async () => {
    try {
      const newDocument: Document = {
        id: Date.now().toString(),
        document_number: `DOC-2026-${String(documents.length + 1).padStart(3, '0')}`,
        title: formData.title,
        description: formData.description,
        document_type: formData.document_type,
        status: formData.status,
        priority: formData.priority,
        client_name: formData.client_name,
        deal_name: formData.deal_name,
        contract_value: formData.contract_value ? parseFloat(formData.contract_value) : undefined,
        currency: formData.currency,
        signature_deadline: formData.signature_deadline,
        assigned_to_name: formData.assigned_to_name,
        version: 1,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setDocuments(prev => [newDocument, ...prev]);
      setCreateDialogOpen(false);
      resetForm();
      
      toast({
        title: "Document Created",
        description: `Document "${formData.title}" has been created successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create document",
        variant: "destructive",
      });
    }
  };

  const handleUpdateDocument = async () => {
    if (!selectedDocument) return;

    try {
      const updatedDocument = {
        ...selectedDocument,
        title: formData.title,
        description: formData.description,
        document_type: formData.document_type,
        status: formData.status,
        priority: formData.priority,
        client_name: formData.client_name,
        deal_name: formData.deal_name,
        contract_value: formData.contract_value ? parseFloat(formData.contract_value) : undefined,
        currency: formData.currency,
        signature_deadline: formData.signature_deadline,
        assigned_to_name: formData.assigned_to_name,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        updated_at: new Date().toISOString()
      };

      setDocuments(prev => prev.map(doc => 
        doc.id === selectedDocument.id ? updatedDocument : doc
      ));
      
      setEditDialogOpen(false);
      setSelectedDocument(null);
      resetForm();
      
      toast({
        title: "Document Updated",
        description: `Document "${formData.title}" has been updated successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update document",
        variant: "destructive",
      });
    }
  };

  const handleDeleteDocument = async () => {
    if (!documentToDelete) return;
    
    try {
      setDocuments(prev => prev.filter(doc => doc.id !== documentToDelete.id));
      
      toast({
        title: "Document Deleted",
        description: `Document "${documentToDelete.title}" has been deleted successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete document",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setDocumentToDelete(null);
    }
  };

  const handleUpdateStatus = async (documentId: string, newStatus: string) => {
    try {
      setDocuments(prev => prev.map(doc => 
        doc.id === documentId 
          ? { ...doc, status: newStatus, updated_at: new Date().toISOString() }
          : doc
      ));
      
      toast({
        title: "Status Updated",
        description: `Document status updated to ${newStatus}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update document status",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      document_type: 'Contract',
      status: 'Draft',
      priority: 'Medium',
      client_name: '',
      deal_name: '',
      contract_value: '',
      currency: 'USD',
      signature_deadline: '',
      assigned_to_name: '',
      tags: ''
    });
  };

  const openEditDialog = (document: Document) => {
    setSelectedDocument(document);
    setFormData({
      title: document.title,
      description: document.description || '',
      document_type: document.document_type,
      status: document.status,
      priority: document.priority,
      client_name: document.client_name || '',
      deal_name: document.deal_name || '',
      contract_value: document.contract_value?.toString() || '',
      currency: document.currency || 'USD',
      signature_deadline: document.signature_deadline || '',
      assigned_to_name: document.assigned_to_name || '',
      tags: document.tags?.join(', ') || ''
    });
    setEditDialogOpen(true);
  };

  const exportDocuments = () => {
    const csvContent = [
      ['Document Number', 'Title', 'Type', 'Status', 'Client', 'Contract Value', 'Signature Deadline', 'Created Date'].join(','),
      ...filteredDocuments.map(doc => [
        doc.document_number,
        `"${doc.title}"`,
        doc.document_type,
        doc.status,
        doc.client_name || 'No Client',
        doc.contract_value || '0',
        doc.signature_deadline || '',
        new Date(doc.created_at).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `documents-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Documents have been exported successfully",
    });
  };

  // Filter documents based on search and filters
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.document_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.deal_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all-status" || doc.status === statusFilter;
    const matchesType = typeFilter === "all-types" || doc.document_type === typeFilter;
    const matchesPriority = priorityFilter === "all-priority" || doc.priority === priorityFilter;
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'contracts' && doc.document_type === 'Contract') ||
                      (activeTab === 'proposals' && doc.document_type === 'Proposal') ||
                      (activeTab === 'agreements' && doc.document_type === 'Agreement') ||
                      (activeTab === 'overdue' && isOverdue(doc.signature_deadline || '', doc.status));
    
    return matchesSearch && matchesStatus && matchesType && matchesPriority && matchesTab;
  });

  // Calculate statistics
  const stats: DocumentStats = {
    total: documents.length,
    draft: documents.filter(d => d.status === 'Draft').length,
    sent: documents.filter(d => d.status === 'Sent').length,
    signed: documents.filter(d => d.status === 'Signed').length,
    review: documents.filter(d => d.status === 'Review').length,
    totalValue: documents.reduce((sum, d) => sum + (d.contract_value || 0), 0),
    overdue: documents.filter(d => d.signature_deadline && new Date(d.signature_deadline) < new Date() && d.status !== 'Signed').length
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Contract': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Proposal': return 'bg-green-100 text-green-800 border-green-200';
      case 'Agreement': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Invoice': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Quote': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Report': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Legal': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Signed': return 'bg-green-100 text-green-800 border-green-200';
      case 'Sent': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Review': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Draft': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Expired': return 'bg-red-100 text-red-800 border-red-200';
      case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'Archived': return 'bg-gray-100 text-gray-600 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Signed': return <CheckCircle className="w-4 h-4" />;
      case 'Sent': return <Send className="w-4 h-4" />;
      case 'Review': return <Eye className="w-4 h-4" />;
      case 'Draft': return <Edit className="w-4 h-4" />;
      case 'Expired': return <AlertTriangle className="w-4 h-4" />;
      case 'Cancelled': return <FileX className="w-4 h-4" />;
      case 'Archived': return <Archive className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'No deadline';
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `Due in ${diffDays} days`;
  };

  const isOverdue = (deadline: string, status: string) => {
    if (!deadline || status === 'Signed') return false;
    return new Date(deadline) < new Date();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-600" />
            Documents Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage contracts, proposals, agreements and all business documents
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={exportDocuments}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={loadDocuments}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Document
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Documents</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Draft</p>
                <p className="text-2xl font-bold">{stats.draft}</p>
              </div>
              <Edit className="w-8 h-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sent</p>
                <p className="text-2xl font-bold">{stats.sent}</p>
              </div>
              <Send className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Review</p>
                <p className="text-2xl font-bold">{stats.review}</p>
              </div>
              <Eye className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Signed</p>
                <p className="text-2xl font-bold">{stats.signed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold">{stats.overdue}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Documents</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
          <TabsTrigger value="proposals">Proposals</TabsTrigger>
          <TabsTrigger value="agreements">Agreements</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      placeholder="Search documents..."
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
                      <SelectItem value="all-status">All Status</SelectItem>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Review">Review</SelectItem>
                      <SelectItem value="Sent">Sent</SelectItem>
                      <SelectItem value="Signed">Signed</SelectItem>
                      <SelectItem value="Expired">Expired</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                      <SelectItem value="Archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-40">
                      <FileText className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-types">All Types</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Proposal">Proposal</SelectItem>
                      <SelectItem value="Agreement">Agreement</SelectItem>
                      <SelectItem value="Invoice">Invoice</SelectItem>
                      <SelectItem value="Quote">Quote</SelectItem>
                      <SelectItem value="Report">Report</SelectItem>
                      <SelectItem value="Legal">Legal</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-40">
                      <Flag className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-priority">All Priority</SelectItem>
                      <SelectItem value="Critical">Critical</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents List */}
          <div className="space-y-4">
            {loading ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                  <p>Loading documents...</p>
                </CardContent>
              </Card>
            ) : filteredDocuments.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
                  <p className="text-gray-600 mb-4">
                    {documents.length === 0 
                      ? "Get started by creating your first document" 
                      : "Try adjusting your search or filter criteria"}
                  </p>
                  {documents.length === 0 && (
                    <Button onClick={() => setCreateDialogOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Document
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredDocuments.map((document) => (
                  <Card key={document.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-4">
                          {/* Header Row */}
                          <div className="flex items-center gap-3 flex-wrap">
                            <Badge variant="outline" className="font-mono text-xs">
                              {document.document_number}
                            </Badge>
                            <Badge className={`${getTypeColor(document.document_type)} border`}>
                              <FileText className="w-3 h-3 mr-1" />
                              {document.document_type}
                            </Badge>
                            <Badge className={`${getStatusColor(document.status)} border`}>
                              {getStatusIcon(document.status)}
                              <span className="ml-1">{document.status}</span>
                            </Badge>
                            <Badge className={`${getPriorityColor(document.priority)} border`}>
                              <Flag className="w-3 h-3 mr-1" />
                              {document.priority}
                            </Badge>
                          </div>

                          {/* Title */}
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {document.title}
                            </h3>
                            {document.description && (
                              <p className="text-gray-600 text-sm">
                                {document.description}
                              </p>
                            )}
                          </div>

                          {/* Details Row */}
                          <div className="flex items-center gap-6 text-sm text-gray-600 flex-wrap">
                            {document.client_name && (
                              <div className="flex items-center gap-1">
                                <Building2 className="w-4 h-4" />
                                <span>{document.client_name}</span>
                              </div>
                            )}
                            
                            {document.deal_name && (
                              <div className="flex items-center gap-1">
                                <Target className="w-4 h-4" />
                                <span>{document.deal_name}</span>
                              </div>
                            )}
                            
                            {document.contract_value && (
                              <div className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                <span>{formatCurrency(document.contract_value, document.currency)}</span>
                              </div>
                            )}
                            
                            {document.signature_deadline && (
                              <div className={`flex items-center gap-1 ${
                                isOverdue(document.signature_deadline, document.status) 
                                  ? 'text-red-600 font-medium' 
                                  : ''
                              }`}>
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(document.signature_deadline)}</span>
                              </div>
                            )}

                            {document.assigned_to_name && (
                              <div className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                <span>{document.assigned_to_name}</span>
                              </div>
                            )}
                            
                            <div className="flex items-center gap-1">
                              <Activity className="w-4 h-4" />
                              <span>v{document.version}</span>
                            </div>
                          </div>

                          {/* Tags */}
                          {document.tags && document.tags.length > 0 && (
                            <div className="flex items-center gap-2 flex-wrap">
                              {document.tags.map((tag: string, index: number) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 ml-4">
                          {/* File Link */}
                          {document.file_url && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(document.file_url, '_blank')}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          )}

                          {/* Quick Status Actions */}
                          {document.status === 'Draft' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateStatus(document.id, 'Review')}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Review
                            </Button>
                          )}
                          
                          {document.status === 'Review' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateStatus(document.id, 'Sent')}
                            >
                              <Send className="w-4 h-4 mr-1" />
                              Send
                            </Button>
                          )}

                          {document.status === 'Sent' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateStatus(document.id, 'Signed')}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Sign
                            </Button>
                          )}

                          {/* More Actions Menu */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => openEditDialog(document)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Document
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleUpdateStatus(document.id, 'Draft')}
                                disabled={document.status === 'Draft'}
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Mark as Draft
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleUpdateStatus(document.id, 'Review')}
                                disabled={document.status === 'Review'}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Mark as Review
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleUpdateStatus(document.id, 'Sent')}
                                disabled={document.status === 'Sent'}
                              >
                                <Send className="w-4 h-4 mr-2" />
                                Mark as Sent
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleUpdateStatus(document.id, 'Signed')}
                                disabled={document.status === 'Signed'}
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Mark as Signed
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => {
                                  setDocumentToDelete(document);
                                  setDeleteDialogOpen(true);
                                }}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Document
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Results Summary */}
          {!loading && (
            <div className="text-center text-sm text-gray-600">
              Showing {filteredDocuments.length} of {documents.length} documents
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Document Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Document</DialogTitle>
            <DialogDescription>
              Add a new document to your document management system.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Document title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="document_type">Type</Label>
              <Select value={formData.document_type} onValueChange={(value) => setFormData(prev => ({ ...prev, document_type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Proposal">Proposal</SelectItem>
                  <SelectItem value="Agreement">Agreement</SelectItem>
                  <SelectItem value="Invoice">Invoice</SelectItem>
                  <SelectItem value="Quote">Quote</SelectItem>
                  <SelectItem value="Report">Report</SelectItem>
                  <SelectItem value="Legal">Legal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Document description"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client_name">Client Name</Label>
              <Input
                id="client_name"
                value={formData.client_name}
                onChange={(e) => setFormData(prev => ({ ...prev, client_name: e.target.value }))}
                placeholder="Client name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deal_name">Deal Name</Label>
              <Input
                id="deal_name"
                value={formData.deal_name}
                onChange={(e) => setFormData(prev => ({ ...prev, deal_name: e.target.value }))}
                placeholder="Associated deal"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contract_value">Contract Value</Label>
              <Input
                id="contract_value"
                type="number"
                value={formData.contract_value}
                onChange={(e) => setFormData(prev => ({ ...prev, contract_value: e.target.value }))}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signature_deadline">Signature Deadline</Label>
              <Input
                id="signature_deadline"
                type="date"
                value={formData.signature_deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, signature_deadline: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="assigned_to_name">Assigned To</Label>
              <Input
                id="assigned_to_name"
                value={formData.assigned_to_name}
                onChange={(e) => setFormData(prev => ({ ...prev, assigned_to_name: e.target.value }))}
                placeholder="Assigned person"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="tag1, tag2, tag3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateDocument} disabled={!formData.title}>
              <Save className="w-4 h-4 mr-2" />
              Create Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Document Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Document</DialogTitle>
            <DialogDescription>
              Update document information and settings.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title *</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Document title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-document_type">Type</Label>
              <Select value={formData.document_type} onValueChange={(value) => setFormData(prev => ({ ...prev, document_type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Proposal">Proposal</SelectItem>
                  <SelectItem value="Agreement">Agreement</SelectItem>
                  <SelectItem value="Invoice">Invoice</SelectItem>
                  <SelectItem value="Quote">Quote</SelectItem>
                  <SelectItem value="Report">Report</SelectItem>
                  <SelectItem value="Legal">Legal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Document description"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Review">Review</SelectItem>
                  <SelectItem value="Sent">Sent</SelectItem>
                  <SelectItem value="Signed">Signed</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                  <SelectItem value="Archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-client_name">Client Name</Label>
              <Input
                id="edit-client_name"
                value={formData.client_name}
                onChange={(e) => setFormData(prev => ({ ...prev, client_name: e.target.value }))}
                placeholder="Client name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-deal_name">Deal Name</Label>
              <Input
                id="edit-deal_name"
                value={formData.deal_name}
                onChange={(e) => setFormData(prev => ({ ...prev, deal_name: e.target.value }))}
                placeholder="Associated deal"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-contract_value">Contract Value</Label>
              <Input
                id="edit-contract_value"
                type="number"
                value={formData.contract_value}
                onChange={(e) => setFormData(prev => ({ ...prev, contract_value: e.target.value }))}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-signature_deadline">Signature Deadline</Label>
              <Input
                id="edit-signature_deadline"
                type="date"
                value={formData.signature_deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, signature_deadline: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-assigned_to_name">Assigned To</Label>
              <Input
                id="edit-assigned_to_name"
                value={formData.assigned_to_name}
                onChange={(e) => setFormData(prev => ({ ...prev, assigned_to_name: e.target.value }))}
                placeholder="Assigned person"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="edit-tags">Tags (comma-separated)</Label>
              <Input
                id="edit-tags"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="tag1, tag2, tag3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateDocument} disabled={!formData.title}>
              <Save className="w-4 h-4 mr-2" />
              Update Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the document "{documentToDelete?.title}"? 
              This action cannot be undone and will permanently remove the document and all its associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDocument} className="bg-red-600 hover:bg-red-700">
              Delete Document
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Documents;