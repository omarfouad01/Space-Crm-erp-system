import { useState, useEffect } from 'react';
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { 
  clientService, 
  dealService, 
  taskService, 
  paymentService,
  connectionService 
} from "@/services/supabaseService";
import { useCurrency } from "@/contexts/CurrencyContext";
import {
  DollarSign,
  Users,
  Target,
  Calendar,
  TrendingUp,
  Activity,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Wifi,
  WifiOff
} from "lucide-react";

interface DashboardData {
  clients: any[];
  deals: any[];
  tasks: any[];
  payments: any[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export default function RobustDashboard() {
  const { formatAmount } = useCurrency();
  const [data, setData] = useState<DashboardData>({
    clients: [],
    deals: [],
    tasks: [],
    payments: [],
    loading: true,
    error: null,
    lastUpdated: null
  });
  
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'connected' | 'disconnected'>('unknown');
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  const testConnection = async () => {
    try {
      const result = await connectionService.testConnection();
      setConnectionStatus(result.success ? 'connected' : 'disconnected');
      return result.success;
    } catch (error) {
      setConnectionStatus('disconnected');
      return false;
    }
  };

  const loadDashboardData = async (showToast = true) => {
    console.log('🔄 Starting robust dashboard data load...');
    setData(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Test connection first
      const isConnected = await testConnection();
      
      if (!isConnected) {
        throw new Error('Network connection failed. Please check your internet connection.');
      }

      // Load data with individual error handling
      const results = await Promise.allSettled([
        clientService.getAll(),
        dealService.getAll(),
        taskService.getAll(),
        paymentService.getAll()
      ]);

      const [clientsResult, dealsResult, tasksResult, paymentsResult] = results;

      const newData: Partial<DashboardData> = {
        clients: clientsResult.status === 'fulfilled' ? clientsResult.value : [],
        deals: dealsResult.status === 'fulfilled' ? dealsResult.value : [],
        tasks: tasksResult.status === 'fulfilled' ? tasksResult.value : [],
        payments: paymentsResult.status === 'fulfilled' ? paymentsResult.value : [],
        loading: false,
        error: null,
        lastUpdated: new Date()
      };

      // Check for any failures
      const failures = results.filter(r => r.status === 'rejected');
      if (failures.length > 0) {
        console.warn('⚠️ Some data failed to load:', failures);
        
        if (showToast) {
          toast({
            title: "Partial Data Load",
            description: `${4 - failures.length}/4 data sources loaded successfully`,
            variant: "default",
          });
        }
      } else if (showToast) {
        toast({
          title: "Data Loaded",
          description: "All dashboard data loaded successfully",
        });
      }

      setData(prev => ({ ...prev, ...newData }));
      setRetryCount(0);

    } catch (error: any) {
      console.error('❌ Dashboard data loading failed:', error);
      
      const errorMessage = error.message || 'Failed to load dashboard data';
      setData(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }));

      if (showToast) {
        toast({
          title: "Dashboard Loading Failed",
          description: errorMessage,
          variant: "destructive",
          action: (
            <Button variant="outline" size="sm" onClick={() => navigate('/user-testing')}>
              Diagnose
            </Button>
          ),
        });
      }
    }
  };

  const handleRetry = async () => {
    setRetryCount(prev => prev + 1);
    await loadDashboardData();
  };

  useEffect(() => {
    loadDashboardData(false);
  }, []);

  // Calculate metrics
  const totalRevenue = data.deals.reduce((sum, deal) => 
    deal.status === 'Closed Won' ? sum + (deal.value || 0) : sum, 0
  );
  
  const activeDeals = data.deals.filter(d => 
    !['Closed Won', 'Closed Lost', 'Canceled'].includes(d.status)
  );
  
  const overdueTasks = data.tasks.filter(t => 
    new Date(t.due_date) < new Date() && t.status !== 'Completed'
  );

  const formatCurrency = (amount: number) => {
    return formatAmount(amount);
  };

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'connected': return <Wifi className="w-4 h-4 text-green-600" />;
      case 'disconnected': return <WifiOff className="w-4 h-4 text-red-600" />;
      default: return <Activity className="w-4 h-4 text-yellow-600 animate-pulse" />;
    }
  };

  const getConnectionBadge = () => {
    switch (connectionStatus) {
      case 'connected': 
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Connected</Badge>;
      case 'disconnected': 
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Disconnected</Badge>;
      default: 
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Testing...</Badge>;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Activity className="w-8 h-8 text-blue-600" />
              Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              {data.lastUpdated 
                ? `Last updated: ${data.lastUpdated.toLocaleTimeString()}`
                : 'Loading dashboard data...'
              }
            </p>
          </div>

          <div className="flex items-center gap-3">
            {getConnectionIcon()}
            {getConnectionBadge()}
            <Button 
              variant="outline" 
              onClick={() => loadDashboardData()}
              disabled={data.loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${data.loading ? 'animate-spin' : ''}`} />
              {data.loading ? 'Loading...' : 'Refresh'}
            </Button>
            <Button variant="outline" onClick={() => navigate('/user-testing')}>
              Diagnose
            </Button>
          </div>
        </div>

        {/* Error State */}
        {data.error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                
                <div className="flex-1">
                  <h3 className="font-semibold text-red-900 mb-2">
                    Connection Error
                  </h3>
                  <p className="text-red-700 mb-4">
                    {data.error}
                  </p>
                  {retryCount > 0 && (
                    <p className="text-sm text-red-600 mb-4">
                      Retry attempts: {retryCount}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleRetry}
                    disabled={data.loading}
                  >
                    Retry
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigate('/user-testing')}>
                    Diagnose Issue
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {data.loading && (
          <Card>
            <CardContent className="p-8 text-center">
              <Activity className="w-8 h-8 text-blue-600 mx-auto mb-4 animate-pulse" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Loading dashboard data...
              </h3>
              <p className="text-gray-600">
                This may take a few moments if the connection is slow
              </p>
            </CardContent>
          </Card>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Clients
                  </p>
                  <p className="text-2xl font-bold">
                    {data.clients.length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {data.loading ? 'Loading...' : 'Active clients'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Deals
                  </p>
                  <p className="text-2xl font-bold">
                    {activeDeals.length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {data.loading ? 'Loading...' : `${data.deals.length} total deals`}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Pending Tasks
                  </p>
                  <p className="text-2xl font-bold">
                    {data.tasks.filter(t => t.status !== 'Completed').length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {data.loading ? 'Loading...' : `${overdueTasks.length} overdue`}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Revenue
                  </p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(totalRevenue)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {data.loading ? 'Loading...' : 'Closed won deals'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center gap-3">
                {connectionStatus === 'connected' ? 
                  <CheckCircle className="w-5 h-5 text-green-600" /> :
                  <XCircle className="w-5 h-5 text-red-600" />
                }
                <div>
                  <p className="font-medium text-gray-900">
                    Database
                  </p>
                  <p className="text-sm text-gray-600">
                    {connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {data.clients.length > 0 ? 
                  <CheckCircle className="w-5 h-5 text-green-600" /> :
                  <XCircle className="w-5 h-5 text-red-600" />
                }
                <div>
                  <p className="font-medium text-gray-900">
                    Clients Service
                  </p>
                  <p className="text-sm text-gray-600">
                    {data.clients.length > 0 ? 'Operational' : 'No Data'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {data.deals.length > 0 ? 
                  <CheckCircle className="w-5 h-5 text-green-600" /> :
                  <XCircle className="w-5 h-5 text-red-600" />
                }
                <div>
                  <p className="font-medium text-gray-900">
                    Deals Service
                  </p>
                  <p className="text-sm text-gray-600">
                    {data.deals.length > 0 ? 'Operational' : 'No Data'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {data.lastUpdated ? 
                  <CheckCircle className="w-5 h-5 text-green-600" /> :
                  <XCircle className="w-5 h-5 text-red-600" />
                }
                <div>
                  <p className="font-medium text-gray-900">
                    Last Sync
                  </p>
                  <p className="text-sm text-gray-600">
                    {data.lastUpdated ? 'Recent' : 'Never'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}