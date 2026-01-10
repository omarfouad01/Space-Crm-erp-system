import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Grid3X3,
  List,
  TrendingUp,
  TrendingDown,
  Minus,
  Star,
  Calendar,
  DollarSign,
  Activity,
  FileText,
  BarChart3,
  PieChart,
  Target,
  Award,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { clientService, type Client, type ClientMetrics, type ClientActivity, type ClientDocument } from '@/services/supabaseService';
import { CreateClientDialog } from '@/components/forms/CreateClientDialog';
import { EditClientDialog } from '@/components/forms/EditClientDialog';

const Clients = () => {
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showClientDetails, setShowClientDetails] = useState(false);

  // Mock data for enhanced features
  const [clientMetrics, setClientMetrics] = useState<Record<string, ClientMetrics>>({});
  const [clientActivities, setClientActivities] = useState<Record<string, ClientActivity[]>>({});
  const [clientDocuments, setClientDocuments] = useState<Record<string, ClientDocument[]>>({});

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    filterClients();
  }, [clients, searchTerm, typeFilter, statusFilter]);

  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await clientService.getAll();
      setClients(data);
      
      // Generate mock metrics and activities for each client
      const metrics: Record<string, ClientMetrics> = {};
      const activities: Record<string, ClientActivity[]> = {};
      const documents: Record<string, ClientDocument[]> = {};
      
      data.forEach(client => {
        // Mock metrics
        metrics[client.id] = {
          total_deals: Math.floor(Math.random() * 20) + 1,
          active_deals: Math.floor(Math.random() * 5) + 1,
          won_deals: Math.floor(Math.random() * 10) + 1,
          total_value: Math.floor(Math.random() * 500000) + 50000,
          won_value: Math.floor(Math.random() * 300000) + 25000,
          avg_deal_size: Math.floor(Math.random() * 50000) + 10000,
          conversion_rate: Math.floor(Math.random() * 80) + 20,
          lifetime_value: Math.floor(Math.random() * 1000000) + 100000,
          open_tasks: Math.floor(Math.random() * 8),
          overdue_payments: Math.floor(Math.random() * 3),
          last_activity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          engagement_score: Math.floor(Math.random() * 100) + 1,
          satisfaction_score: Math.floor(Math.random() * 5) + 1,
          growth_trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable'
        };

        // Mock activities
        activities[client.id] = [
          {
            id: '1',
            type: 'deal',
            title: 'New deal created',
            description: 'Created deal "Q1 Exhibition Package"',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'completed',
            user: 'John Smith',
            priority: 'high'
          },
          {
            id: '2',
            type: 'email',
            title: 'Email sent',
            description: 'Sent proposal follow-up email',
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'completed',
            user: 'Sarah Johnson'
          },
          {
            id: '3',
            type: 'meeting',
            title: 'Meeting scheduled',
            description: 'Quarterly review meeting',
            timestamp: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'pending',
            user: 'Mike Davis',
            priority: 'medium'
          }
        ];

        // Mock documents
        documents[client.id] = [
          {
            id: '1',
            name: 'Service Agreement 2024',
            type: 'PDF',
            size: 2048576,
            uploaded_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            uploaded_by: 'John Smith',
            status: 'signed',
            category: 'contract'
          },
          {
            id: '2',
            name: 'Exhibition Proposal',
            type: 'PDF',
            size: 1024768,
            uploaded_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            uploaded_by: 'Sarah Johnson',
            status: 'pending',
            category: 'proposal'
          }
        ];
      });

      setClientMetrics(metrics);
      setClientActivities(activities);
      setClientDocuments(documents);
    } catch (error) {
      console.error('Error loading clients:', error);
      toast({
        title: "Error",
        description: "Failed to load clients. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterClients = () => {
    let filtered = clients;

    if (searchTerm) {
      filtered = filtered.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.contact_person?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(client => client.type === typeFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(client => client.status === statusFilter);
    }

    setFilteredClients(filtered);
  };

  const handleDeleteClient = async (client: Client) => {
    if (!confirm(`Are you sure you want to delete client "${client.name}"?`)) {
      return;
    }

    try {
      await clientService.delete(client.id);
      toast({
        title: "Client Deleted",
        description: `Client "${client.name}" has been deleted successfully`,
      });
      loadClients();
    } catch (error) {
      console.error('Error deleting client:', error);
      toast({
        title: "Error",
        description: "Failed to delete client. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Active': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'Inactive': { color: 'bg-gray-100 text-gray-800', icon: XCircle },
      'Prospect': { color: 'bg-blue-100 text-blue-800', icon: AlertCircle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.Active;
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {status}
      </Badge>
    );
  };

  const getEngagementScore = (score: number) => {
    if (score >= 80) return { color: 'text-green-600', label: 'High' };
    if (score >= 60) return { color: 'text-yellow-600', label: 'Medium' };
    return { color: 'text-red-600', label: 'Low' };
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'deal': return <DollarSign className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'meeting': return <Calendar className="w-4 h-4" />;
      case 'call': return <Phone className="w-4 h-4" />;
      case 'task': return <CheckCircle className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const renderClientCard = (client: Client) => {
    const metrics = clientMetrics[client.id];
    const engagement = getEngagementScore(metrics?.engagement_score || 0);
    
    return (
      <Card key={client.id} className="hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg">{client.name}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  {client.company && (
                    <>
                      <Building2 className="w-4 h-4" />
                      {client.company}
                    </>
                  )}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(client.status || 'Active')}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => {
                    setSelectedClient(client);
                    setShowClientDetails(true);
                  }}>
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    setSelectedClient(client);
                    setShowEditDialog(true);
                  }}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => handleDeleteClient(client)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span>{client.type}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span>{client.city || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <span className="truncate">{client.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <span>{client.phone || 'N/A'}</span>
            </div>
          </div>
          
          {metrics && (
            <div className="border-t pt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Total Deals</div>
                  <div className="font-semibold">{metrics.total_deals}</div>
                </div>
                <div>
                  <div className="text-gray-500">Total Value</div>
                  <div className="font-semibold">{formatCurrency(metrics.total_value)}</div>
                </div>
                <div>
                  <div className="text-gray-500">Conversion Rate</div>
                  <div className="font-semibold">{metrics.conversion_rate}%</div>
                </div>
                <div>
                  <div className="text-gray-500 flex items-center gap-1">
                    Engagement
                    <Star className="w-3 h-3" />
                  </div>
                  <div className={`font-semibold ${engagement.color}`}>
                    {engagement.label}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderClientDetails = () => {
    if (!selectedClient) return null;
    
    const metrics = clientMetrics[selectedClient.id];
    const activities = clientActivities[selectedClient.id] || [];
    const documents = clientDocuments[selectedClient.id] || [];
    const engagement = getEngagementScore(metrics?.engagement_score || 0);

    return (
      <Dialog open={showClientDetails} onOpenChange={setShowClientDetails}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl">
              <Building2 className="w-6 h-6 text-blue-600" />
              {selectedClient.name}
              {getStatusBadge(selectedClient.status || 'Active')}
            </DialogTitle>
            <DialogDescription>
              Comprehensive client profile and analytics
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span>{selectedClient.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span>{selectedClient.phone || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Building2 className="w-4 h-4 text-gray-500" />
                      <span>{selectedClient.company || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>{selectedClient.city ? `${selectedClient.city}, ${selectedClient.country || ''}` : 'Not provided'}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="w-5 h-5" />
                      Business Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-500">Client Type</div>
                      <div className="font-medium">{selectedClient.type}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Industry</div>
                      <div className="font-medium">{selectedClient.industry || 'Not specified'}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Company Size</div>
                      <div className="font-medium">{selectedClient.company_size || 'Not specified'}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Website</div>
                      <div className="font-medium">{selectedClient.website || 'Not provided'}</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {selectedClient.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{selectedClient.notes}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="metrics" className="space-y-6">
              {metrics && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Total Deals</p>
                            <p className="text-2xl font-bold">{metrics.total_deals}</p>
                          </div>
                          <DollarSign className="w-8 h-8 text-blue-600" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Total Value</p>
                            <p className="text-2xl font-bold">{formatCurrency(metrics.total_value)}</p>
                          </div>
                          <BarChart3 className="w-8 h-8 text-green-600" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                            <p className="text-2xl font-bold">{metrics.conversion_rate}%</p>
                          </div>
                          <Target className="w-8 h-8 text-purple-600" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Engagement</p>
                            <p className={`text-2xl font-bold ${engagement.color}`}>{engagement.label}</p>
                          </div>
                          <Star className="w-8 h-8 text-yellow-600" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <PieChart className="w-5 h-5" />
                          Deal Performance
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>Active Deals</span>
                          <span className="font-semibold">{metrics.active_deals}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Won Deals</span>
                          <span className="font-semibold text-green-600">{metrics.won_deals}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Average Deal Size</span>
                          <span className="font-semibold">{formatCurrency(metrics.avg_deal_size)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Lifetime Value</span>
                          <span className="font-semibold">{formatCurrency(metrics.lifetime_value)}</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Activity className="w-5 h-5" />
                          Current Status
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>Open Tasks</span>
                          <Badge variant="outline">{metrics.open_tasks}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Overdue Payments</span>
                          <Badge variant={metrics.overdue_payments > 0 ? "destructive" : "outline"}>
                            {metrics.overdue_payments}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Growth Trend</span>
                          <div className="flex items-center gap-1">
                            {getTrendIcon(metrics.growth_trend)}
                            <span className="capitalize">{metrics.growth_trend}</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Satisfaction Score</span>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < metrics.satisfaction_score
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Recent Activity Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activities.map((activity, index) => (
                      <div key={activity.id} className="flex items-start gap-4 pb-4 border-b last:border-b-0">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{activity.title}</h4>
                            <div className="flex items-center gap-2">
                              {activity.priority && (
                                <Badge 
                                  variant={activity.priority === 'high' ? 'destructive' : 
                                          activity.priority === 'medium' ? 'default' : 'secondary'}
                                  className="text-xs"
                                >
                                  {activity.priority}
                                </Badge>
                              )}
                              <span className="text-xs text-gray-500">
                                {new Date(activity.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                          <p className="text-xs text-gray-500 mt-1">by {activity.user}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Client Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-8 h-8 text-blue-600" />
                          <div>
                            <h4 className="font-medium">{doc.name}</h4>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>{doc.type}</span>
                              <span>{formatFileSize(doc.size)}</span>
                              <span>Uploaded by {doc.uploaded_by}</span>
                              <span>{new Date(doc.uploaded_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={doc.status === 'signed' ? 'default' : 
                                    doc.status === 'pending' ? 'secondary' : 'destructive'}
                          >
                            {doc.status}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-gray-600">Manage your client relationships and track engagement</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Client
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Clients</p>
                <p className="text-2xl font-bold">{clients.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Clients</p>
                <p className="text-2xl font-bold">
                  {clients.filter(c => c.status === 'Active').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Prospects</p>
                <p className="text-2xl font-bold">
                  {clients.filter(c => c.status === 'Prospect').length}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold">
                  {clients.filter(c => {
                    const created = new Date(c.created_at);
                    const now = new Date();
                    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search clients by name, email, company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Sponsor">Sponsors</SelectItem>
                <SelectItem value="Exhibitor">Exhibitors</SelectItem>
                <SelectItem value="Partner">Partners</SelectItem>
                <SelectItem value="Vendor">Vendors</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Prospect">Prospect</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
            </div>

            <Button variant="outline" onClick={loadClients}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Clients Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map(renderClientCard)}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Engagement</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => {
                  const metrics = clientMetrics[client.id];
                  const engagement = getEngagementScore(metrics?.engagement_score || 0);
                  
                  return (
                    <TableRow key={client.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{client.name}</div>
                          <div className="text-sm text-gray-500">{client.company}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{client.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-3 h-3" />
                            {client.email}
                          </div>
                          {client.phone && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="w-3 h-3" />
                              {client.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>{client.city || 'N/A'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(client.status || 'Active')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className={`font-medium ${engagement.color}`}>
                            {engagement.label}
                          </span>
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
                            <DropdownMenuItem onClick={() => {
                              setSelectedClient(client);
                              setShowClientDetails(true);
                            }}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              setSelectedClient(client);
                              setShowEditDialog(true);
                            }}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteClient(client)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {filteredClients.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No clients found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || typeFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Get started by adding your first client'}
            </p>
            {!searchTerm && typeFilter === 'all' && statusFilter === 'all' && (
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Client
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Dialogs */}
      <CreateClientDialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSuccess={loadClients}
      />

      <EditClientDialog
        isOpen={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        onSuccess={loadClients}
        client={selectedClient}
      />

      {renderClientDetails()}
    </div>
  );
};

export default Clients;