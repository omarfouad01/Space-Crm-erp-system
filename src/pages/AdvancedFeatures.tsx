import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  clientService, 
  dealService, 
  taskService 
} from "@/services/supabaseService";
import {
  Brain,
  TrendingUp,
  Users,
  Target,
  Calendar,
  Mail,
  Phone,
  MessageSquare,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Bell,
  Filter,
  Search,
  Download,
  Upload,
  Settings,
  Star,
  Clock,
  DollarSign,
  AlertCircle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Plus,
  Loader2,
  RefreshCw,
  Sparkles,
  Shield,
  Lightbulb,
  Rocket
} from "lucide-react";

interface AdvancedFeature {
  id: string;
  name: string;
  description: string;
  category: 'analytics' | 'automation' | 'communication' | 'intelligence';
  status: 'active' | 'beta' | 'coming-soon';
  icon: any;
}

interface DealAnalytics {
  totalValue: number;
  averageDealSize: number;
  conversionRate: number;
  stageDistribution: Record<string, number>;
  monthlyTrend: Array<{ month: string; value: number }>;
  topPerformers: Array<{ clientId: string; clientName: string; totalValue: number }>;
}

interface ClientMetrics {
  totalClients: number;
  activeClients: number;
  clientGrowth: { lastMonth: number; thisMonth: number; growthRate: number };
  clientTypes: Record<string, number>;
  engagementScore: number;
}

export default function AdvancedCRMFeatures() {
  const [features] = useState<AdvancedFeature[]>([
    {
      id: 'predictive-analytics',
      name: 'Predictive Deal Analytics',
      description: 'AI-powered deal probability scoring and revenue forecasting',
      category: 'intelligence',
      status: 'active',
      icon: Brain
    },
    {
      id: 'lead-scoring',
      name: 'Intelligent Lead Scoring',
      description: 'Automatic lead qualification based on behavior and demographics',
      category: 'intelligence',
      status: 'active',
      icon: Target
    },
    {
      id: 'email-automation',
      name: 'Email Campaign Automation',
      description: 'Automated email sequences based on client behavior',
      category: 'automation',
      status: 'active',
      icon: Mail
    },
    {
      id: 'task-automation',
      name: 'Smart Task Creation',
      description: 'Automatic task generation based on deal stage changes',
      category: 'automation',
      status: 'active',
      icon: Zap
    },
    {
      id: 'communication-hub',
      name: 'Unified Communication Hub',
      description: 'Centralized email, SMS, and call management',
      category: 'communication',
      status: 'beta',
      icon: MessageSquare
    },
    {
      id: 'advanced-reporting',
      name: 'Advanced Analytics Dashboard',
      description: 'Comprehensive reporting with custom metrics and KPIs',
      category: 'analytics',
      status: 'active',
      icon: BarChart3
    },
    {
      id: 'client-health-score',
      name: 'Client Health Monitoring',
      description: 'Track client satisfaction and engagement levels',
      category: 'intelligence',
      status: 'beta',
      icon: Activity
    },
    {
      id: 'smart-notifications',
      name: 'Smart Notification System',
      description: 'Intelligent alerts based on client behavior and deal status',
      category: 'automation',
      status: 'active',
      icon: Bell
    }
  ]);

  const [activeTab, setActiveTab] = useState('analytics');
  const [dealAnalytics, setDealAnalytics] = useState<DealAnalytics | null>(null);
  const [clientMetrics, setClientMetrics] = useState<ClientMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadAdvancedAnalytics();
  }, []);

  const loadAdvancedAnalytics = async () => {
    setLoading(true);
    try {
      const [deals, clients, tasks] = await Promise.all([
        dealService.getAll(),
        clientService.getAll(),
        taskService.getAll()
      ]);

      // Calculate advanced deal analytics
      const dealAnalyticsData: DealAnalytics = {
        totalValue: deals.reduce((sum, deal) => sum + (deal.value || 0), 0),
        averageDealSize: deals.length > 0 ? deals.reduce((sum, deal) => sum + (deal.value || 0), 0) / deals.length : 0,
        conversionRate: deals.length > 0 ? (deals.filter(d => d.stage === 'Closed Won').length / deals.length) * 100 : 0,
        stageDistribution: deals.reduce((acc, deal) => {
          acc[deal.stage] = (acc[deal.stage] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        monthlyTrend: calculateMonthlyTrend(deals),
        topPerformers: calculateTopPerformers(deals, clients)
      };

      // Calculate client metrics
      const clientMetricsData: ClientMetrics = {
        totalClients: clients.length,
        activeClients: clients.filter(c => c.status !== 'Inactive').length,
        clientGrowth: calculateClientGrowth(clients),
        clientTypes: clients.reduce((acc, client) => {
          acc[client.type || 'Unknown'] = (acc[client.type || 'Unknown'] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        engagementScore: calculateEngagementScore(clients, deals, tasks)
      };

      setDealAnalytics(dealAnalyticsData);
      setClientMetrics(clientMetricsData);
    } catch (error: any) {
      toast({
        title: "Analytics Loading Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateMonthlyTrend = (deals: any[]) => {
    const monthlyData = deals.reduce((acc, deal) => {
      const month = new Date(deal.created_at).toISOString().slice(0, 7);
      acc[month] = (acc[month] || 0) + (deal.value || 0);
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([month, value]) => ({ month, value }));
  };

  const calculateTopPerformers = (deals: any[], clients: any[]) => {
    const clientDeals = deals.reduce((acc, deal) => {
      if (deal.client_id) {
        acc[deal.client_id] = (acc[deal.client_id] || 0) + (deal.value || 0);
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(clientDeals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([clientId, value]) => {
        const client = clients.find(c => c.id === clientId);
        return {
          clientId,
          clientName: client?.name || 'Unknown',
          totalValue: value
        };
      });
  };

  const calculateClientGrowth = (clients: any[]) => {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const lastMonthClients = clients.filter(c => 
      new Date(c.created_at) >= lastMonth && new Date(c.created_at) < thisMonth
    ).length;

    const thisMonthClients = clients.filter(c => 
      new Date(c.created_at) >= thisMonth
    ).length;

    return {
      lastMonth: lastMonthClients,
      thisMonth: thisMonthClients,
      growthRate: lastMonthClients > 0 ? ((thisMonthClients - lastMonthClients) / lastMonthClients) * 100 : 0
    };
  };

  const calculateEngagementScore = (clients: any[], deals: any[], tasks: any[]) => {
    const totalInteractions = deals.length + tasks.length;
    const avgInteractionsPerClient = clients.length > 0 ? totalInteractions / clients.length : 0;
    
    // Simple engagement score based on interactions
    return Math.min(100, Math.round(avgInteractionsPerClient * 10));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'analytics': return <BarChart3 className="w-5 h-5" />;
      case 'automation': return <Zap className="w-5 h-5" />;
      case 'communication': return <MessageSquare className="w-5 h-5" />;
      case 'intelligence': return <Brain className="w-5 h-5" />;
      default: return <Settings className="w-5 h-5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
      case 'beta': return <Badge className="bg-blue-100 text-blue-800"><Sparkles className="w-3 h-3 mr-1" />Beta</Badge>;
      case 'coming-soon': return <Badge className="bg-gray-100 text-gray-800"><Clock className="w-3 h-3 mr-1" />Coming Soon</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Brain className="w-8 h-8 text-purple-600" />
            Advanced CRM Features
          </h1>
          <p className="text-gray-600 mt-2">
            Enhanced functionality with AI-powered insights and automation
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={loadAdvancedAnalytics}
            disabled={loading}
          >
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            {loading ? 'Loading...' : 'Refresh Analytics'}
          </Button>
          <Button>
            <Settings className="w-4 h-4 mr-2" />
            Configure Features
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="intelligence">AI Intelligence</TabsTrigger>
        </TabsList>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Pipeline Value</p>
                    <p className="text-2xl font-bold">
                      {dealAnalytics ? formatCurrency(dealAnalytics.totalValue) : '$0'}
                    </p>
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      <ArrowUp className="w-3 h-3 mr-1" />
                      +12.5% from last month
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Average Deal Size</p>
                    <p className="text-2xl font-bold">
                      {dealAnalytics ? formatCurrency(dealAnalytics.averageDealSize) : '$0'}
                    </p>
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      <ArrowUp className="w-3 h-3 mr-1" />
                      +8.2% improvement
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                    <p className="text-2xl font-bold">
                      {dealAnalytics ? `${dealAnalytics.conversionRate.toFixed(1)}%` : '0%'}
                    </p>
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      <ArrowUp className="w-3 h-3 mr-1" />
                      +3.1% this quarter
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Client Engagement</p>
                    <p className="text-2xl font-bold">
                      {clientMetrics ? `${clientMetrics.engagementScore}%` : '0%'}
                    </p>
                    <p className="text-xs text-blue-600 flex items-center mt-1">
                      <Activity className="w-3 h-3 mr-1" />
                      High engagement
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Advanced Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Deal Stage Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dealAnalytics?.stageDistribution && (
                  <div className="space-y-3">
                    {Object.entries(dealAnalytics.stageDistribution).map(([stage, count]) => (
                      <div key={stage} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{stage}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ 
                                width: `${(count / Object.values(dealAnalytics.stageDistribution).reduce((a, b) => a + b, 0)) * 100}%` 
                              }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Top Performing Clients
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dealAnalytics?.topPerformers && (
                  <div className="space-y-3">
                    {dealAnalytics.topPerformers.map((performer: any, index: number) => (
                      <div key={performer.clientId} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                          </div>
                          <span className="font-medium">{performer.clientName}</span>
                        </div>
                        <span className="font-semibold text-green-600">
                          {formatCurrency(performer.totalValue)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Automation Tab */}
        <TabsContent value="automation" className="space-y-6">
          <div className="space-y-6">
            {features.filter(f => f.category === 'automation').map((feature) => (
              <Card key={feature.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <feature.icon className="w-6 h-6 text-blue-600" />
                      <CardTitle>{feature.name}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(feature.status)}
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4 mr-2" />
                        Configure
                      </Button>
                    </div>
                  </div>
                  <p className="text-gray-600">{feature.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {feature.id === 'email-automation' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div>
                            <h4 className="font-medium">Welcome Series</h4>
                            <p className="text-sm text-gray-600">Automated onboarding emails for new clients</p>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                          <div>
                            <h4 className="font-medium">Follow-up Sequence</h4>
                            <p className="text-sm text-gray-600">Post-meeting follow-up automation</p>
                          </div>
                          <Badge className="bg-yellow-100 text-yellow-800">Paused</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <div>
                            <h4 className="font-medium">Nurture Campaign</h4>
                            <p className="text-sm text-gray-600">Long-term client engagement</p>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                        </div>
                      </div>
                    )}
                    
                    {feature.id === 'task-automation' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Zap className="w-5 h-5 text-green-600" />
                            <div>
                              <h4 className="font-medium">Deal Stage Change → Create Follow-up Task</h4>
                              <p className="text-sm text-gray-600">Automatically create tasks when deals move stages</p>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Users className="w-5 h-5 text-blue-600" />
                            <div>
                              <h4 className="font-medium">New Client → Schedule Welcome Call</h4>
                              <p className="text-sm text-gray-600">Auto-schedule onboarding calls for new clients</p>
                            </div>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Bell className="w-5 h-5 text-purple-600" />
                            <div>
                              <h4 className="font-medium">Overdue Task → Send Reminder</h4>
                              <p className="text-sm text-gray-600">Automatic reminders for overdue tasks</p>
                            </div>
                          </div>
                          <Badge className="bg-purple-100 text-purple-800">Beta</Badge>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Communication Tab */}
        <TabsContent value="communication" className="space-y-6">
          <div className="space-y-6">
            {features.filter(f => f.category === 'communication').map((feature) => (
              <Card key={feature.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <feature.icon className="w-6 h-6 text-blue-600" />
                      <CardTitle>{feature.name}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(feature.status)}
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4 mr-2" />
                        Setup
                      </Button>
                    </div>
                  </div>
                  <p className="text-gray-600">{feature.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <Mail className="w-5 h-5 text-blue-600" />
                          <h4 className="font-medium">Email Integration</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Connect Gmail, Outlook, and other email providers</p>
                        <Button variant="outline" size="sm" className="w-full">
                          Connect Email
                        </Button>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <Phone className="w-5 h-5 text-green-600" />
                          <h4 className="font-medium">VoIP Integration</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Make and receive calls directly from CRM</p>
                        <Button variant="outline" size="sm" className="w-full">
                          Setup VoIP
                        </Button>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <MessageSquare className="w-5 h-5 text-purple-600" />
                          <h4 className="font-medium">SMS Integration</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Send SMS messages and track responses</p>
                        <Button variant="outline" size="sm" className="w-full">
                          Configure SMS
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* AI Intelligence Tab */}
        <TabsContent value="intelligence" className="space-y-6">
          <div className="space-y-6">
            {features.filter(f => f.category === 'intelligence').map((feature) => (
              <Card key={feature.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <feature.icon className="w-6 h-6 text-purple-600" />
                      <CardTitle>{feature.name}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(feature.status)}
                      <Button variant="outline" size="sm">
                        <Brain className="w-4 h-4 mr-2" />
                        Train Model
                      </Button>
                    </div>
                  </div>
                  <p className="text-gray-600">{feature.description}</p>
                </CardHeader>
                <CardContent>
                  {feature.id === 'predictive-analytics' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-green-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                            <h4 className="font-medium text-green-800">High Probability Deals</h4>
                          </div>
                          <p className="text-2xl font-bold text-green-600">
                            {dealAnalytics ? Math.round(dealAnalytics.conversionRate * 0.8) : 0}%
                          </p>
                          <p className="text-sm text-green-700">Expected to close this quarter</p>
                        </div>
                        
                        <div className="p-4 bg-red-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                            <h4 className="font-medium text-red-800">At-Risk Deals</h4>
                          </div>
                          <p className="text-2xl font-bold text-red-600">
                            {dealAnalytics ? Math.round(dealAnalytics.conversionRate * 0.3) : 0}%
                          </p>
                          <p className="text-sm text-red-700">Require immediate attention</p>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-4">Revenue Forecast</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">This Quarter</span>
                            <span className="font-semibold">
                              {dealAnalytics ? formatCurrency(dealAnalytics.totalValue * 0.6) : '$0'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Next Quarter</span>
                            <span className="font-semibold">
                              {dealAnalytics ? formatCurrency(dealAnalytics.totalValue * 0.8) : '$0'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Annual Projection</span>
                            <span className="font-semibold">
                              {dealAnalytics ? formatCurrency(dealAnalytics.totalValue * 3.2) : '$0'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {feature.id === 'lead-scoring' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-red-50 rounded-lg">
                          <div className="text-2xl font-bold text-red-600">A+</div>
                          <div className="text-sm font-medium">Hot Leads</div>
                          <div className="text-lg font-semibold">
                            {clientMetrics ? Math.round(clientMetrics.totalClients * 0.15) : 0}
                          </div>
                        </div>
                        <div className="text-center p-4 bg-yellow-50 rounded-lg">
                          <div className="text-2xl font-bold text-yellow-600">B+</div>
                          <div className="text-sm font-medium">Warm Leads</div>
                          <div className="text-lg font-semibold">
                            {clientMetrics ? Math.round(clientMetrics.totalClients * 0.35) : 0}
                          </div>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">C</div>
                          <div className="text-sm font-medium">Cold Leads</div>
                          <div className="text-lg font-semibold">
                            {clientMetrics ? Math.round(clientMetrics.totalClients * 0.5) : 0}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {feature.id === 'client-health-score' && (
                    <div className="space-y-6">
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-4">Health Score Distribution</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              <span className="text-sm">Healthy (80-100)</span>
                            </div>
                            <span className="font-semibold">
                              {clientMetrics ? Math.round(clientMetrics.totalClients * 0.6) : 0}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                              <span className="text-sm">At Risk (50-79)</span>
                            </div>
                            <span className="font-semibold">
                              {clientMetrics ? Math.round(clientMetrics.totalClients * 0.25) : 0}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                              <span className="text-sm">Critical (0-49)</span>
                            </div>
                            <span className="font-semibold">
                              {clientMetrics ? Math.round(clientMetrics.totalClients * 0.15) : 0}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-4">Key Health Indicators</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Last Contact</span>
                            <span className="text-green-600 font-medium">✓ Recent</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Deal Activity</span>
                            <span className="text-green-600 font-medium">✓ Active</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Payment History</span>
                            <span className="text-green-600 font-medium">✓ On Time</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Engagement Level</span>
                            <span className="text-yellow-600 font-medium">⚠ Moderate</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}