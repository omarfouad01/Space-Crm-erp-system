import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Globe,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Calendar,
  MapPin,
  Users,
  User,
  DollarSign,
  Building2,
  Trophy,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Download,
  TrendingUp,
  Activity,
  Play,
  Send,
  CheckCircle2,
  XCircle,
  Pause,
  BarChart3,
  Target,
  Zap,
  Star,
  Award,
  Briefcase,
  FileText,
  Share2,
  ExternalLink,
  Loader2,
  ArrowRight,
  TrendingDown,
  PieChart
} from "lucide-react";

interface Expo {
  id: string;
  expo_number: string;
  name: string;
  description?: string;
  theme?: string;
  start_date: string;
  end_date: string;
  city?: string;
  country?: string;
  venue_name?: string;
  status: string;
  priority: string;
  expected_visitors?: number;
  booth_count?: number;
  budget?: number;
  manager_name?: string;
  organizer_name?: string;
  website_url?: string;
  tags?: string[];
  totalExhibitors?: number;
  paidExhibitors?: number;
  totalSponsors?: number;
  totalRevenue?: number;
  occupancyRate?: number;
  created_at: string;
  updated_at: string;
}

interface ExpoStats {
  total: number;
  active: number;
  planning: number;
  completed: number;
  registration: number;
  cancelled: number;
  totalRevenue: number;
  totalVisitors: number;
}

const Expos = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all-status");
  const [priorityFilter, setPriorityFilter] = useState("all-priority");
  const [yearFilter, setYearFilter] = useState("all-years");
  const [expos, setExpos] = useState<Expo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingExpo, setEditingExpo] = useState<Expo | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [expoToDelete, setExpoToDelete] = useState<Expo | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  // Form states for create/edit
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    theme: '',
    start_date: '',
    end_date: '',
    city: '',
    country: '',
    venue_name: '',
    status: 'Planning',
    priority: 'Medium',
    expected_visitors: '',
    booth_count: '',
    budget: '',
    manager_name: '',
    organizer_name: '',
    website_url: '',
    tags: ''
  });

  useEffect(() => {
    loadExpos();
  }, []);

  const loadExpos = async () => {
    try {
      setLoading(true);
      
      // Mock data since we don't have an expos table yet
      const mockExpos: Expo[] = [
        {
          id: '1',
          expo_number: 'EXPO-2026-001',
          name: 'Green Energy Expo 2026',
          description: 'Leading sustainable energy exhibition showcasing the latest innovations in renewable energy, green technology, and environmental solutions.',
          theme: 'Sustainable Future',
          start_date: '2026-03-15',
          end_date: '2026-03-18',
          city: 'Dubai',
          country: 'UAE',
          venue_name: 'Dubai World Trade Centre',
          status: 'Active',
          priority: 'High',
          expected_visitors: 15000,
          booth_count: 150,
          budget: 2500000,
          manager_name: 'Sarah Johnson',
          organizer_name: 'Green Energy Alliance',
          website_url: 'https://greenenergy-expo.com',
          tags: ['renewable', 'sustainability', 'technology'],
          totalExhibitors: 142,
          paidExhibitors: 138,
          totalSponsors: 12,
          totalRevenue: 2840000,
          occupancyRate: 94.7,
          created_at: '2026-01-05T10:00:00Z',
          updated_at: '2026-01-10T14:30:00Z'
        },
        {
          id: '2',
          expo_number: 'EXPO-2026-002',
          name: 'Solar Technology Summit',
          description: 'International summit focusing on solar panel technology, energy storage solutions, and photovoltaic innovations.',
          theme: 'Solar Innovation',
          start_date: '2026-05-20',
          end_date: '2026-05-23',
          city: 'Berlin',
          country: 'Germany',
          venue_name: 'Messe Berlin',
          status: 'Registration Open',
          priority: 'High',
          expected_visitors: 8500,
          booth_count: 80,
          budget: 1200000,
          manager_name: 'Mike Chen',
          organizer_name: 'Solar Tech International',
          website_url: 'https://solar-summit.com',
          tags: ['solar', 'photovoltaic', 'energy-storage'],
          totalExhibitors: 65,
          paidExhibitors: 58,
          totalSponsors: 8,
          totalRevenue: 1450000,
          occupancyRate: 81.3,
          created_at: '2026-01-08T09:15:00Z',
          updated_at: '2026-01-09T16:45:00Z'
        },
        {
          id: '3',
          expo_number: 'EXPO-2026-003',
          name: 'Wind Power Conference',
          description: 'Comprehensive conference and exhibition dedicated to wind energy technology, offshore wind farms, and turbine innovations.',
          theme: 'Wind Energy Future',
          start_date: '2026-07-10',
          end_date: '2026-07-12',
          city: 'Copenhagen',
          country: 'Denmark',
          venue_name: 'Bella Center',
          status: 'Planning',
          priority: 'Medium',
          expected_visitors: 6000,
          booth_count: 60,
          budget: 800000,
          manager_name: 'Emma Davis',
          organizer_name: 'Wind Energy Association',
          website_url: 'https://windpower-conf.com',
          tags: ['wind', 'offshore', 'turbines'],
          totalExhibitors: 45,
          paidExhibitors: 35,
          totalSponsors: 6,
          totalRevenue: 920000,
          occupancyRate: 75.0,
          created_at: '2026-01-10T11:30:00Z',
          updated_at: '2026-01-10T15:20:00Z'
        },
        {
          id: '4',
          expo_number: 'EXPO-2026-004',
          name: 'Clean Tech Innovation Fair',
          description: 'Showcase of cutting-edge clean technology solutions, environmental innovations, and sustainable business practices.',
          theme: 'Clean Innovation',
          start_date: '2026-09-05',
          end_date: '2026-09-08',
          city: 'San Francisco',
          country: 'USA',
          venue_name: 'Moscone Center',
          status: 'Marketing',
          priority: 'Critical',
          expected_visitors: 12000,
          booth_count: 120,
          budget: 1800000,
          manager_name: 'Lisa Wang',
          organizer_name: 'Clean Tech Alliance',
          website_url: 'https://cleantech-fair.com',
          tags: ['cleantech', 'innovation', 'sustainability'],
          totalExhibitors: 95,
          paidExhibitors: 85,
          totalSponsors: 10,
          totalRevenue: 2100000,
          occupancyRate: 79.2,
          created_at: '2026-01-03T14:20:00Z',
          updated_at: '2026-01-08T10:15:00Z'
        },
        {
          id: '5',
          expo_number: 'EXPO-2026-005',
          name: 'Energy Storage Expo',
          description: 'Specialized exhibition focusing on battery technology, energy storage systems, and grid integration solutions.',
          theme: 'Energy Storage',
          start_date: '2026-11-15',
          end_date: '2026-11-17',
          city: 'Tokyo',
          country: 'Japan',
          venue_name: 'Tokyo Big Sight',
          status: 'Completed',
          priority: 'Medium',
          expected_visitors: 7500,
          booth_count: 90,
          budget: 1000000,
          manager_name: 'Alex Thompson',
          organizer_name: 'Energy Storage Japan',
          website_url: 'https://energy-storage-expo.jp',
          tags: ['battery', 'storage', 'grid'],
          totalExhibitors: 78,
          paidExhibitors: 78,
          totalSponsors: 7,
          totalRevenue: 1350000,
          occupancyRate: 86.7,
          created_at: '2026-01-07T13:45:00Z',
          updated_at: '2026-01-10T09:30:00Z'
        }
      ];

      setExpos(mockExpos);
      
    } catch (error: any) {
      console.error("Error loading expos:", error);
      toast({
        title: "Error Loading Exhibitions",
        description: "Failed to load exhibitions from database. Please try refreshing the page.",
        variant: "destructive",
      });
      setExpos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExpo = async () => {
    try {
      const newExpo: Expo = {
        id: Date.now().toString(),
        expo_number: `EXPO-2026-${String(expos.length + 1).padStart(3, '0')}`,
        name: formData.name,
        description: formData.description,
        theme: formData.theme,
        start_date: formData.start_date,
        end_date: formData.end_date,
        city: formData.city,
        country: formData.country,
        venue_name: formData.venue_name,
        status: formData.status,
        priority: formData.priority,
        expected_visitors: formData.expected_visitors ? parseInt(formData.expected_visitors) : undefined,
        booth_count: formData.booth_count ? parseInt(formData.booth_count) : undefined,
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
        manager_name: formData.manager_name,
        organizer_name: formData.organizer_name,
        website_url: formData.website_url,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        totalExhibitors: 0,
        paidExhibitors: 0,
        totalSponsors: 0,
        totalRevenue: 0,
        occupancyRate: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setExpos(prev => [newExpo, ...prev]);
      setShowCreateDialog(false);
      resetForm();
      
      toast({
        title: "Exhibition Created",
        description: `Exhibition "${formData.name}" has been created successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create exhibition",
        variant: "destructive",
      });
    }
  };

  const handleUpdateExpo = async () => {
    if (!editingExpo) return;

    try {
      const updatedExpo = {
        ...editingExpo,
        name: formData.name,
        description: formData.description,
        theme: formData.theme,
        start_date: formData.start_date,
        end_date: formData.end_date,
        city: formData.city,
        country: formData.country,
        venue_name: formData.venue_name,
        status: formData.status,
        priority: formData.priority,
        expected_visitors: formData.expected_visitors ? parseInt(formData.expected_visitors) : undefined,
        booth_count: formData.booth_count ? parseInt(formData.booth_count) : undefined,
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
        manager_name: formData.manager_name,
        organizer_name: formData.organizer_name,
        website_url: formData.website_url,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        updated_at: new Date().toISOString()
      };

      setExpos(prev => prev.map(expo => 
        expo.id === editingExpo.id ? updatedExpo : expo
      ));
      
      setShowEditDialog(false);
      setEditingExpo(null);
      resetForm();
      
      toast({
        title: "Exhibition Updated",
        description: `Exhibition "${formData.name}" has been updated successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update exhibition",
        variant: "destructive",
      });
    }
  };

  const handleDeleteExpo = (expo: Expo) => {
    setExpoToDelete(expo);
    setShowDeleteDialog(true);
  };

  const confirmDeleteExpo = async () => {
    if (!expoToDelete) return;
    
    try {
      setExpos(prev => prev.filter(expo => expo.id !== expoToDelete.id));
      
      toast({
        title: "Exhibition Deleted",
        description: `Exhibition "${expoToDelete.name}" has been deleted successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete exhibition",
        variant: "destructive",
      });
    } finally {
      setShowDeleteDialog(false);
      setExpoToDelete(null);
    }
  };

  const handleStatusChange = async (expoId: string, newStatus: string) => {
    try {
      setExpos(prevExpos => 
        prevExpos.map(expo => 
          expo.id === expoId ? { ...expo, status: newStatus, updated_at: new Date().toISOString() } : expo
        )
      );
      
      toast({
        title: "Status Updated",
        description: `Exhibition status changed to ${newStatus}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const handleEditExpo = (expo: Expo) => {
    setEditingExpo(expo);
    setFormData({
      name: expo.name,
      description: expo.description || '',
      theme: expo.theme || '',
      start_date: expo.start_date,
      end_date: expo.end_date,
      city: expo.city || '',
      country: expo.country || '',
      venue_name: expo.venue_name || '',
      status: expo.status,
      priority: expo.priority,
      expected_visitors: expo.expected_visitors?.toString() || '',
      booth_count: expo.booth_count?.toString() || '',
      budget: expo.budget?.toString() || '',
      manager_name: expo.manager_name || '',
      organizer_name: expo.organizer_name || '',
      website_url: expo.website_url || '',
      tags: expo.tags?.join(', ') || ''
    });
    setShowEditDialog(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      theme: '',
      start_date: '',
      end_date: '',
      city: '',
      country: '',
      venue_name: '',
      status: 'Planning',
      priority: 'Medium',
      expected_visitors: '',
      booth_count: '',
      budget: '',
      manager_name: '',
      organizer_name: '',
      website_url: '',
      tags: ''
    });
  };

  const exportExpos = () => {
    try {
      const csvContent = [
        ['Expo Number', 'Name', 'Status', 'Start Date', 'End Date', 'City', 'Country', 'Expected Visitors', 'Budget', 'Priority', 'Manager'].join(','),
        ...filteredExpos.map(expo => [
          expo.expo_number || '',
          `"${expo.name || ''}"`,
          expo.status || '',
          expo.start_date || '',
          expo.end_date || '',
          expo.city || '',
          expo.country || '',
          expo.expected_visitors || '',
          expo.budget || '',
          expo.priority || '',
          `"${expo.manager_name || ''}"`
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `exhibitions_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export Successful",
        description: "Exhibitions data has been exported to CSV",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export exhibitions data",
        variant: "destructive",
      });
    }
  };

  // Filter expos based on search and filters
  const filteredExpos = expos.filter(expo => {
    const matchesSearch = !searchTerm || 
      expo.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expo.expo_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expo.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expo.theme?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expo.organizer_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all-status" || expo.status === statusFilter;
    const matchesPriority = priorityFilter === "all-priority" || expo.priority === priorityFilter;
    
    const matchesYear = yearFilter === "all-years" || 
      (expo.start_date && new Date(expo.start_date).getFullYear().toString() === yearFilter);

    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'active' && expo.status === 'Active') ||
                      (activeTab === 'planning' && expo.status === 'Planning') ||
                      (activeTab === 'completed' && expo.status === 'Completed') ||
                      (activeTab === 'upcoming' && new Date(expo.start_date) > new Date());

    return matchesSearch && matchesStatus && matchesPriority && matchesYear && matchesTab;
  });

  // Calculate statistics
  const stats: ExpoStats = {
    total: expos.length,
    active: expos.filter(e => e.status === 'Active').length,
    planning: expos.filter(e => e.status === 'Planning').length,
    completed: expos.filter(e => e.status === 'Completed').length,
    registration: expos.filter(e => e.status === 'Registration Open').length,
    cancelled: expos.filter(e => e.status === 'Cancelled').length,
    totalRevenue: expos.reduce((sum, expo) => sum + (expo.totalRevenue || 0), 0),
    totalVisitors: expos.reduce((sum, expo) => sum + (expo.expected_visitors || 0), 0)
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active': return <Play className="w-4 h-4" />;
      case 'Planning': return <Clock className="w-4 h-4" />;
      case 'Registration Open': return <Users className="w-4 h-4" />;
      case 'Completed': return <CheckCircle className="w-4 h-4" />;
      case 'Cancelled': return <XCircle className="w-4 h-4" />;
      case 'Postponed': return <Pause className="w-4 h-4" />;
      case 'Marketing': return <Zap className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 border-green-200';
      case 'Planning': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Registration Open': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'Postponed': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Marketing': return 'bg-orange-100 text-orange-800 border-orange-200';
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue = (expo: Expo) => {
    if (!expo.end_date) return false;
    const today = new Date();
    const endDate = new Date(expo.end_date);
    return endDate < today && expo.status !== 'Completed' && expo.status !== 'Cancelled';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Globe className="w-8 h-8 text-blue-600" />
            Exhibitions Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage exhibitions, exhibitors, and event logistics
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={loadExpos} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={exportExpos}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Exhibition
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Exhibitions</p>
                <p className="text-2xl font-bold">{stats.total}</p>
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
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
              <Play className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Planning</p>
                <p className="text-2xl font-bold">{stats.planning}</p>
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
                <p className="text-2xl font-bold">{stats.registration}</p>
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
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold">{stats.cancelled}</p>
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
                <p className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
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
                <p className="text-2xl font-bold">{stats.totalVisitors.toLocaleString()}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Exhibitions</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="planning">Planning</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      placeholder="Search exhibitions..."
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
                      <SelectItem value="Planning">Planning</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Registration Open">Registration Open</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                      <SelectItem value="Postponed">Postponed</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-40">
                      <Target className="w-4 h-4 mr-2" />
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

                  <Select value={yearFilter} onValueChange={setYearFilter}>
                    <SelectTrigger className="w-40">
                      <Calendar className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-years">All Years</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2026">2026</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exhibitions List */}
          {loading ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                <p>Loading exhibitions...</p>
              </CardContent>
            </Card>
          ) : filteredExpos.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {expos.length === 0 ? "No Exhibitions Found" : "No Matching Exhibitions"}
                </h3>
                <p className="text-gray-600 mb-4">
                  {expos.length === 0 
                    ? "Get started by creating your first exhibition"
                    : "Try adjusting your search criteria or filters"
                  }
                </p>
                {expos.length === 0 && (
                  <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Exhibition
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredExpos.map((expo) => (
                <Card key={expo.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-4">
                        {/* Header Row */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-wrap">
                            <Badge variant="outline" className="font-mono text-xs">
                              {expo.expo_number}
                            </Badge>
                            <Badge className={`${getPriorityColor(expo.priority)} border`}>
                              <Target className="w-3 h-3 mr-1" />
                              {expo.priority}
                            </Badge>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => navigate(`/expos/${expo.id}`)}>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              
                              {/* Quick Status Changes */}
                              {expo.status === 'Planning' && (
                                <DropdownMenuItem onClick={() => handleStatusChange(expo.id, 'Marketing')}>
                                  <Zap className="w-4 h-4 mr-2" />
                                  Start Marketing
                                </DropdownMenuItem>
                              )}
                              {expo.status === 'Marketing' && (
                                <DropdownMenuItem onClick={() => handleStatusChange(expo.id, 'Registration Open')}>
                                  <Users className="w-4 h-4 mr-2" />
                                  Open Registration
                                </DropdownMenuItem>
                              )}
                              {expo.status === 'Registration Open' && (
                                <DropdownMenuItem onClick={() => handleStatusChange(expo.id, 'Active')}>
                                  <Play className="w-4 h-4 mr-2" />
                                  Start Exhibition
                                </DropdownMenuItem>
                              )}
                              {expo.status === 'Active' && (
                                <DropdownMenuItem onClick={() => handleStatusChange(expo.id, 'Completed')}>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Mark Completed
                                </DropdownMenuItem>
                              )}
                              
                              <DropdownMenuSeparator />
                              
                              {/* Standard Actions */}
                              {expo.website_url && (
                                <DropdownMenuItem onClick={() => window.open(expo.website_url, '_blank')}>
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  View Website
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => handleEditExpo(expo)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Exhibition
                              </DropdownMenuItem>
                              
                              <DropdownMenuSeparator />
                              
                              {/* Status Menu */}
                              <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleStatusChange(expo.id, 'Planning')}>
                                <Clock className="w-4 h-4 mr-2" />
                                Planning
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(expo.id, 'Marketing')}>
                                <Zap className="w-4 h-4 mr-2" />
                                Marketing
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(expo.id, 'Registration Open')}>
                                <Users className="w-4 h-4 mr-2" />
                                Registration Open
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(expo.id, 'Active')}>
                                <Play className="w-4 h-4 mr-2" />
                                Active
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(expo.id, 'Completed')}>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Completed
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(expo.id, 'Cancelled')}>
                                <XCircle className="w-4 h-4 mr-2" />
                                Cancelled
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(expo.id, 'Postponed')}>
                                <Pause className="w-4 h-4 mr-2" />
                                Postponed
                              </DropdownMenuItem>
                              
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleDeleteExpo(expo)}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Exhibition
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {/* Title and Theme */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {expo.name}
                          </h3>
                          {expo.theme && (
                            <p className="text-gray-600 text-sm">
                              {expo.theme}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status and Dates */}
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className={`${getStatusColor(expo.status)} border`}>
                            {getStatusIcon(expo.status)}
                            <span className="ml-1">{expo.status}</span>
                          </Badge>
                          {isOverdue(expo) && (
                            <Badge className="bg-red-100 text-red-800 border-red-200">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Overdue
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <div>
                              <div className="font-medium">Start</div>
                              <div>{formatDate(expo.start_date)}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <div>
                              <div className="font-medium">End</div>
                              <div>{formatDate(expo.end_date)}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Location */}
                      {(expo.city || expo.venue_name) && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <div>
                            {expo.venue_name && <div className="font-medium">{expo.venue_name}</div>}
                            {expo.city && <div>{expo.city}{expo.country && `, ${expo.country}`}</div>}
                          </div>
                        </div>
                      )}

                      {/* Statistics */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-blue-600" />
                          <div>
                            <div className="font-medium">Exhibitors</div>
                            <div>{expo.totalExhibitors || 0}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <Building2 className="w-4 h-4 text-green-600" />
                          <div>
                            <div className="font-medium">Booths</div>
                            <div>{expo.booth_count || 0}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4 text-purple-600" />
                          <div>
                            <div className="font-medium">Expected</div>
                            <div>{expo.expected_visitors?.toLocaleString() || 'TBD'}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <div>
                            <div className="font-medium">Revenue</div>
                            <div>{formatCurrency(expo.totalRevenue || 0)}</div>
                          </div>
                        </div>
                      </div>

                      {/* Manager */}
                      {expo.manager_name && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <User className="w-4 h-4" />
                          <span className="font-medium">Manager:</span>
                          <span>{expo.manager_name}</span>
                        </div>
                      )}

                      {/* Tags */}
                      {expo.tags && expo.tags.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap">
                          {expo.tags.slice(0, 3).map((tag: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {expo.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{expo.tags.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Results Summary */}
          {!loading && (
            <div className="text-center text-sm text-gray-600">
              Showing {filteredExpos.length} of {expos.length} exhibitions
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Exhibition Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create New Exhibition
            </DialogTitle>
            <DialogDescription>
              Add a new exhibition to your event management system. Fill in the required information below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Basic Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Exhibition Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter exhibition name"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Input
                    id="theme"
                    value={formData.theme}
                    onChange={(e) => setFormData(prev => ({ ...prev, theme: e.target.value }))}
                    placeholder="Exhibition theme"
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the exhibition"
                  rows={3}
                  className="w-full resize-none"
                />
              </div>
            </div>
            
            {/* Date & Location Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Date & Location</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date *</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date *</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="City name"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                    placeholder="Country name"
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="venue_name">Venue</Label>
                <Input
                  id="venue_name"
                  value={formData.venue_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, venue_name: e.target.value }))}
                  placeholder="Venue name and address"
                  className="w-full"
                />
              </div>
            </div>
            
            {/* Management & Settings Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Management & Settings</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Planning">Planning</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Registration Open">Registration Open</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                      <SelectItem value="Postponed">Postponed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger className="w-full">
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
                  <Label htmlFor="manager_name">Manager</Label>
                  <Input
                    id="manager_name"
                    value={formData.manager_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, manager_name: e.target.value }))}
                    placeholder="Exhibition manager name"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organizer_name">Organizer</Label>
                  <Input
                    id="organizer_name"
                    value={formData.organizer_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, organizer_name: e.target.value }))}
                    placeholder="Organizing company/entity"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
            
            {/* Capacity & Budget Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Capacity & Budget</h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expected_visitors">Expected Visitors</Label>
                  <Input
                    id="expected_visitors"
                    type="number"
                    value={formData.expected_visitors}
                    onChange={(e) => setFormData(prev => ({ ...prev, expected_visitors: e.target.value }))}
                    placeholder="0"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="booth_count">Total Booths</Label>
                  <Input
                    id="booth_count"
                    type="number"
                    value={formData.booth_count}
                    onChange={(e) => setFormData(prev => ({ ...prev, booth_count: e.target.value }))}
                    placeholder="0"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget (USD)</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                    placeholder="0.00"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
            
            {/* Additional Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Additional Information</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="website_url">Website URL</Label>
                  <Input
                    id="website_url"
                    type="url"
                    value={formData.website_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, website_url: e.target.value }))}
                    placeholder="https://example.com"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="renewable, technology, sustainability, innovation"
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500">Add relevant tags to help categorize and search for this exhibition</p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateExpo} disabled={!formData.name}>
              Create Exhibition
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Exhibition Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Edit Exhibition
            </DialogTitle>
            <DialogDescription>
              Update exhibition information and settings. Modify any field as needed.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Basic Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Exhibition Name *</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter exhibition name"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-theme">Theme</Label>
                  <Input
                    id="edit-theme"
                    value={formData.theme}
                    onChange={(e) => setFormData(prev => ({ ...prev, theme: e.target.value }))}
                    placeholder="Exhibition theme"
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the exhibition"
                  rows={3}
                  className="w-full resize-none"
                />
              </div>
            </div>
            
            {/* Simplified Edit Form - Key Fields Only */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Key Details</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-start_date">Start Date</Label>
                  <Input
                    id="edit-start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-end_date">End Date</Label>
                  <Input
                    id="edit-end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Planning">Planning</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Registration Open">Registration Open</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                      <SelectItem value="Postponed">Postponed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-priority">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger className="w-full">
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
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-city">City</Label>
                  <Input
                    id="edit-city"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="City name"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-venue_name">Venue</Label>
                  <Input
                    id="edit-venue_name"
                    value={formData.venue_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, venue_name: e.target.value }))}
                    placeholder="Venue name"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateExpo} disabled={!formData.name}>
              Update Exhibition
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Exhibition</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the exhibition and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {expoToDelete && (
            <div className="my-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Globe className="w-8 h-8 text-blue-600" />
                    <div>
                      <h4 className="font-semibold">{expoToDelete.name}</h4>
                      <div className="text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(expoToDelete.start_date).toLocaleDateString()} - {new Date(expoToDelete.end_date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {expoToDelete.city || 'Location not specified'}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {expoToDelete.totalExhibitors || 0} exhibitors, {expoToDelete.totalSponsors || 0} sponsors
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowDeleteDialog(false);
              setExpoToDelete(null);
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteExpo} className="bg-red-600 hover:bg-red-700">
              Delete Exhibition
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Expos;