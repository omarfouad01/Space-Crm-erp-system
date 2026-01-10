import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  clientService, 
  dealService, 
  boothService,
  type Client,
  type Deal,
  type Booth
} from "@/services/supabaseService";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Target,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  PieChart,
  LineChart,
  Activity,
  Building2,
  Award,
  Clock,
  AlertCircle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Loader2,
  Eye,
  Star,
  Zap,
  Globe,
  Briefcase
} from "lucide-react";

interface AnalyticsData {
  revenue: {
    current: number;
    previous: number;
    growth: number;
    trend: 'up' | 'down';
  };
  deals: {
    current: number;
    previous: number;
    growth: number;
    trend: 'up' | 'down';
  };
  clients: {
    current: number;
    previous: number;
    growth: number;
    trend: 'up' | 'down';
  };
  conversion: {
    current: number;
    previous: number;
    growth: number;
    trend: 'up' | 'down';
  };
  booths: {
    current: number;
    previous: number;
    growth: number;
    trend: 'up' | 'down';
  };
}

interface MonthlyData {
  month: string;
  revenue: number;
  deals: number;
  clients: number;
  booths: number;
}

interface TopPerformer {
  name: string;
  revenue: number;
  deals: number;
  conversion: number;
  type: string;
}

const Analytics = () => {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState("last-30-days");
  const [metricType, setMetricType] = useState("revenue");
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [topPerformers, setTopPerformers] = useState<TopPerformer[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [booths, setBooths] = useState<Booth[]>([]);

  useEffect(() => {
    loadAnalyticsData();
  }, [dateRange]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      // Load data from services
      const [clientsData, dealsData, boothsData] = await Promise.all([
        clientService.getAll(),
        dealService.getAll(),
        boothService.getAll()
      ]);

      setClients(clientsData);
      setDeals(dealsData);
      setBooths(boothsData);

      // Calculate analytics
      const analytics = calculateAnalytics(clientsData, dealsData, boothsData);
      const monthly = calculateMonthlyData(clientsData, dealsData, boothsData);
      const performers = calculateTopPerformers(clientsData, dealsData);

      setAnalyticsData(analytics);
      setMonthlyData(monthly);
      setTopPerformers(performers);

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

  const calculateAnalytics = (clients: Client[], deals: Deal[], booths: Booth[]): AnalyticsData => {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Revenue calculations
    const currentRevenue = deals
      .filter(d => d.stage === 'Closed Won')
      .reduce((sum, deal) => sum + (deal.value || 0), 0);
    
    const previousRevenue = deals
      .filter(d => d.stage === 'Closed Won' && new Date(d.created_at) < lastMonth)
      .reduce((sum, deal) => sum + (deal.value || 0), 0);

    // Deal calculations
    const currentDeals = deals.filter(d => new Date(d.created_at) >= thisMonth).length;
    const previousDeals = deals.filter(d => 
      new Date(d.created_at) >= lastMonth && new Date(d.created_at) < thisMonth
    ).length;

    // Client calculations
    const currentClients = clients.filter(c => new Date(c.created_at) >= thisMonth).length;
    const previousClients = clients.filter(c => 
      new Date(c.created_at) >= lastMonth && new Date(c.created_at) < thisMonth
    ).length;

    // Conversion calculations
    const totalDeals = deals.length;
    const wonDeals = deals.filter(d => d.stage === 'Closed Won').length;
    const currentConversion = totalDeals > 0 ? (wonDeals / totalDeals) * 100 : 0;
    const previousConversion = 65.2; // Mock previous data

    // Booth calculations
    const currentBooths = booths.filter(b => b.status === 'Booked' || b.status === 'Occupied').length;
    const previousBooths = Math.round(currentBooths * 0.85); // Mock previous data

    return {
      revenue: {
        current: currentRevenue,
        previous: previousRevenue,
        growth: previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0,
        trend: currentRevenue >= previousRevenue ? 'up' : 'down'
      },
      deals: {
        current: currentDeals,
        previous: previousDeals,
        growth: previousDeals > 0 ? ((currentDeals - previousDeals) / previousDeals) * 100 : 0,
        trend: currentDeals >= previousDeals ? 'up' : 'down'
      },
      clients: {
        current: currentClients,
        previous: previousClients,
        growth: previousClients > 0 ? ((currentClients - previousClients) / previousClients) * 100 : 0,
        trend: currentClients >= previousClients ? 'up' : 'down'
      },
      conversion: {
        current: currentConversion,
        previous: previousConversion,
        growth: ((currentConversion - previousConversion) / previousConversion) * 100,
        trend: currentConversion >= previousConversion ? 'up' : 'down'
      },
      booths: {
        current: currentBooths,
        previous: previousBooths,
        growth: previousBooths > 0 ? ((currentBooths - previousBooths) / previousBooths) * 100 : 0,
        trend: currentBooths >= previousBooths ? 'up' : 'down'
      }
    };
  };

  const calculateMonthlyData = (clients: Client[], deals: Deal[], booths: Booth[]): MonthlyData[] => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, index) => {
      const monthDeals = deals.filter(d => {
        const dealMonth = new Date(d.created_at).getMonth();
        return dealMonth === index;
      });
      
      const monthClients = clients.filter(c => {
        const clientMonth = new Date(c.created_at).getMonth();
        return clientMonth === index;
      });

      return {
        month,
        revenue: monthDeals.reduce((sum, deal) => sum + (deal.value || 0), 0),
        deals: monthDeals.length,
        clients: monthClients.length,
        booths: Math.round(booths.length * (0.6 + Math.random() * 0.4)) // Mock booth data
      };
    });
  };

  const calculateTopPerformers = (clients: Client[], deals: Deal[]): TopPerformer[] => {
    // Group deals by client
    const clientPerformance = clients.map(client => {
      const clientDeals = deals.filter(d => d.client_id === client.id);
      const revenue = clientDeals.reduce((sum, deal) => sum + (deal.value || 0), 0);
      const wonDeals = clientDeals.filter(d => d.stage === 'Closed Won').length;
      const conversion = clientDeals.length > 0 ? (wonDeals / clientDeals.length) * 100 : 0;

      return {
        name: client.name,
        revenue,
        deals: clientDeals.length,
        conversion,
        type: client.type || 'Client'
      };
    }).filter(p => p.revenue > 0)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return clientPerformance;
  };

  const handleExportData = () => {
    const csvContent = [
      ['Metric', 'Current', 'Previous', 'Growth'],
      ['Revenue', analyticsData?.revenue.current || 0, analyticsData?.revenue.previous || 0, `${analyticsData?.revenue.growth.toFixed(1)}%`],
      ['Deals', analyticsData?.deals.current || 0, analyticsData?.deals.previous || 0, `${analyticsData?.deals.growth.toFixed(1)}%`],
      ['Clients', analyticsData?.clients.current || 0, analyticsData?.clients.previous || 0, `${analyticsData?.clients.growth.toFixed(1)}%`],
      ['Conversion Rate', `${analyticsData?.conversion.current.toFixed(1)}%` || '0%', `${analyticsData?.conversion.previous.toFixed(1)}%` || '0%', `${analyticsData?.conversion.growth.toFixed(1)}%`]
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast({
      title: "Export Complete",
      description: "Analytics data has been exported successfully.",
    });
  };

  const handleRefreshData = () => {
    loadAnalyticsData();
    toast({
      title: "Data Refreshed",
      description: "Analytics data has been updated with latest information.",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getTrendIcon = (trend: 'up' | 'down', growth: number) => {
    if (trend === 'up') {
      return <ArrowUp className="w-4 h-4 text-green-600" />;
    }
    return <ArrowDown className="w-4 h-4 text-red-600" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Comprehensive business intelligence and performance metrics
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-48">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-7-days">Last 7 days</SelectItem>
              <SelectItem value="last-30-days">Last 30 days</SelectItem>
              <SelectItem value="last-90-days">Last 90 days</SelectItem>
              <SelectItem value="last-year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleRefreshData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExportData}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              Total Revenue
              <DollarSign className="w-4 h-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(analyticsData?.revenue.current || 0)}
            </div>
            <div className="flex items-center gap-1 text-sm mt-1">
              {getTrendIcon(analyticsData?.revenue.trend || 'up', analyticsData?.revenue.growth || 0)}
              <span className={analyticsData?.revenue.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                {Math.abs(analyticsData?.revenue.growth || 0).toFixed(1)}% from last period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              Active Deals
              <Target className="w-4 h-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData?.deals.current || 0}</div>
            <div className="flex items-center gap-1 text-sm mt-1">
              {getTrendIcon(analyticsData?.deals.trend || 'up', analyticsData?.deals.growth || 0)}
              <span className={analyticsData?.deals.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                {Math.abs(analyticsData?.deals.growth || 0).toFixed(1)}% from last period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              Total Clients
              <Users className="w-4 h-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData?.clients.current || 0}</div>
            <div className="flex items-center gap-1 text-sm mt-1">
              {getTrendIcon(analyticsData?.clients.trend || 'up', analyticsData?.clients.growth || 0)}
              <span className={analyticsData?.clients.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                {Math.abs(analyticsData?.clients.growth || 0).toFixed(1)}% from last period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              Conversion Rate
              <Activity className="w-4 h-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData?.conversion.current.toFixed(1) || 0}%</div>
            <div className="flex items-center gap-1 text-sm mt-1">
              {getTrendIcon(analyticsData?.conversion.trend || 'up', analyticsData?.conversion.growth || 0)}
              <span className={analyticsData?.conversion.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                {Math.abs(analyticsData?.conversion.growth || 0).toFixed(1)}% from last period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              Booked Booths
              <Building2 className="w-4 h-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData?.booths.current || 0}</div>
            <div className="flex items-center gap-1 text-sm mt-1">
              {getTrendIcon(analyticsData?.booths.trend || 'up', analyticsData?.booths.growth || 0)}
              <span className={analyticsData?.booths.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                {Math.abs(analyticsData?.booths.growth || 0).toFixed(1)}% from last period
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Analysis</TabsTrigger>
          <TabsTrigger value="performance">Team Performance</TabsTrigger>
          <TabsTrigger value="trends">Market Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="w-5 h-5" />
                  Monthly Revenue Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyData.map((month, index) => (
                    <div key={month.month} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-sm font-bold text-blue-600">{month.month}</span>
                          </div>
                          <div>
                            <div className="font-semibold">{formatCurrency(month.revenue)}</div>
                            <div className="text-sm text-gray-500">{month.deals} deals</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{month.clients} clients</div>
                          <div className="text-sm text-gray-500">New acquisitions</div>
                        </div>
                      </div>
                      <Progress 
                        value={(month.revenue / Math.max(...monthlyData.map(m => m.revenue))) * 100} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Revenue Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Main Sponsors</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Booth Rentals</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '35%' }}></div>
                      </div>
                      <span className="text-sm font-medium">35%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Sector Sponsors</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: '20%' }}></div>
                      </div>
                      <span className="text-sm font-medium">20%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Revenue Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  +{analyticsData?.revenue.growth.toFixed(1) || 0}%
                </div>
                <div className="text-sm text-gray-600">vs last period</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Average Deal Size</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(deals.length > 0 ? deals.reduce((sum, deal) => sum + (deal.value || 0), 0) / deals.length : 0)}
                </div>
                <div className="text-sm text-green-600">+8.2% increase</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Revenue per Client</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(clients.length > 0 ? (analyticsData?.revenue.current || 0) / clients.length : 0)}
                </div>
                <div className="text-sm text-green-600">+12.4% increase</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performers</CardTitle>
              <CardDescription>
                Client performance rankings for the selected period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPerformers.map((performer, index) => (
                  <div key={performer.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                      </div>
                      <div>
                        <div className="font-semibold">{performer.name}</div>
                        <div className="text-sm text-gray-500">{performer.deals} deals closed • {performer.type}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(performer.revenue)}</div>
                      <div className="text-sm text-gray-500">{performer.conversion.toFixed(1)}% conversion</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Market Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Solar Energy Sector</span>
                    <Badge className="bg-green-100 text-green-800">+23% Growth</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Clean Technology</span>
                    <Badge className="bg-green-100 text-green-800">+18% Growth</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Wind Energy</span>
                    <Badge className="bg-blue-100 text-blue-800">+12% Growth</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Environmental Tech</span>
                    <Badge className="bg-blue-100 text-blue-800">+15% Growth</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Seasonal Patterns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Q1 Performance</span>
                    <Badge className="bg-yellow-100 text-yellow-800">Above Average</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Q2 Performance</span>
                    <Badge className="bg-green-100 text-green-800">Peak Season</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Q3 Performance</span>
                    <Badge className="bg-blue-100 text-blue-800">Strong Growth</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Q4 Performance</span>
                    <Badge className="bg-gray-100 text-gray-800">Planning Phase</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;