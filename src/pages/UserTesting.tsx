import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  clientService, 
  dealService, 
  boothService,
  taskService,
  expoService
} from '@/services/supabaseService';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Key, 
  Database, 
  Wifi, 
  Server,
  Shield,
  Clock,
  Activity,
  Zap,
  Globe,
  Settings,
  RefreshCw,
  Play,
  Loader2,
  TestTube,
  Bug,
  Monitor,
  Network,
  Lock,
  Unlock,
  Eye,
  EyeOff
} from 'lucide-react';

interface TestResult {
  test: string;
  status: 'success' | 'failed' | 'testing' | 'pending';
  message: string;
  details?: string;
  duration?: number;
  timestamp?: string;
}

interface SystemHealth {
  database: 'healthy' | 'warning' | 'error';
  api: 'healthy' | 'warning' | 'error';
  authentication: 'healthy' | 'warning' | 'error';
  services: 'healthy' | 'warning' | 'error';
}

export default function UserTesting() {
  const { toast } = useToast();
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    database: 'healthy',
    api: 'healthy',
    authentication: 'healthy',
    services: 'healthy'
  });
  const [showApiKey, setShowApiKey] = useState(false);
  const [testProgress, setTestProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('api-tests');

  const addResult = (result: TestResult) => {
    setResults(prev => [...prev, { 
      ...result, 
      timestamp: new Date().toISOString() 
    }]);
  };

  const updateResult = (testName: string, updates: Partial<TestResult>) => {
    setResults(prev => prev.map(result => 
      result.test === testName ? { ...result, ...updates } : result
    ));
  };

  const runApiKeyTests = async () => {
    setIsRunning(true);
    setResults([]);
    setTestProgress(0);
    
    const tests = [
      'Connection Test',
      'Direct API Call',
      'Supabase Client',
      'Authentication Check',
      'Database Access',
      'Service Integration'
    ];

    // Test 1: Connection Test
    addResult({ test: 'Connection Test', status: 'testing', message: 'Testing network connectivity...' });
    setTestProgress(16);
    
    try {
      const startTime = Date.now();
      const response = await fetch('https://xecogeelxabowzazqajq.supabase.co/rest/v1/', {
        method: 'HEAD',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlY29nZWVseGFib3d6YXpxYWpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMjU1ODMsImV4cCI6MjA4MjYwMTU4M30.wZVVQF2A7iHgj4Yjzk1pumeIzCkZbTppw3TLVrWnW1M'
        }
      });
      const duration = Date.now() - startTime;
      
      if (response.ok) {
        updateResult('Connection Test', { 
          status: 'success', 
          message: 'Network connectivity successful',
          details: `Response time: ${duration}ms`,
          duration
        });
      } else {
        updateResult('Connection Test', { 
          status: 'failed', 
          message: `Connection failed with status: ${response.status}`,
          duration
        });
      }
    } catch (error: any) {
      updateResult('Connection Test', { 
        status: 'failed', 
        message: 'Network connection failed',
        details: error.message
      });
    }

    // Test 2: Direct API Call
    addResult({ test: 'Direct API Call', status: 'testing', message: 'Testing direct API call with explicit headers...' });
    setTestProgress(33);
    
    try {
      const startTime = Date.now();
      const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlY29nZWVseGFib3d6YXpxYWpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMjU1ODMsImV4cCI6MjA4MjYwMTU4M30.wZVVQF2A7iHgj4Yjzk1pumeIzCkZbTppw3TLVrWnW1M';
      
      const response = await fetch('https://xecogeelxabowzazqajq.supabase.co/rest/v1/clients_2026_01_10_12_00?select=count&limit=1', {
        method: 'GET',
        headers: {
          'apikey': apiKey,
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        }
      });
      const duration = Date.now() - startTime;
      const responseText = await response.text();
      
      if (response.ok) {
        updateResult('Direct API Call', { 
          status: 'success', 
          message: 'Direct API call successful',
          details: `Status: ${response.status}, Response time: ${duration}ms`,
          duration
        });
      } else {
        updateResult('Direct API Call', { 
          status: 'failed', 
          message: `API call failed with status: ${response.status}`,
          details: responseText,
          duration
        });
      }
    } catch (error: any) {
      updateResult('Direct API Call', { 
        status: 'failed', 
        message: 'Direct API call failed',
        details: error.message
      });
    }

    // Test 3: Supabase Client
    addResult({ test: 'Supabase Client', status: 'testing', message: 'Testing Supabase client query...' });
    setTestProgress(50);
    
    try {
      const startTime = Date.now();
      const { data, error } = await supabase
        .from('clients_2026_01_10_12_00')
        .select('count')
        .limit(1);
      const duration = Date.now() - startTime;
      
      if (error) {
        updateResult('Supabase Client', { 
          status: 'failed', 
          message: 'Supabase client query failed',
          details: `Error: ${error.message} (Code: ${error.code})`,
          duration
        });
      } else {
        updateResult('Supabase Client', { 
          status: 'success', 
          message: 'Supabase client query successful',
          details: `Response time: ${duration}ms`,
          duration
        });
      }
    } catch (error: any) {
      updateResult('Supabase Client', { 
        status: 'failed', 
        message: 'Supabase client error',
        details: error.message
      });
    }

    // Test 4: Authentication Check
    addResult({ test: 'Authentication Check', status: 'testing', message: 'Testing authentication system...' });
    setTestProgress(66);
    
    try {
      const startTime = Date.now();
      const { data: { session }, error } = await supabase.auth.getSession();
      const duration = Date.now() - startTime;
      
      if (error) {
        updateResult('Authentication Check', { 
          status: 'failed', 
          message: 'Authentication check failed',
          details: error.message,
          duration
        });
      } else {
        updateResult('Authentication Check', { 
          status: 'success', 
          message: 'Authentication system operational',
          details: `Session status: ${session ? 'Active' : 'No active session'}, Response time: ${duration}ms`,
          duration
        });
      }
    } catch (error: any) {
      updateResult('Authentication Check', { 
        status: 'failed', 
        message: 'Authentication error',
        details: error.message
      });
    }

    // Test 5: Database Access
    addResult({ test: 'Database Access', status: 'testing', message: 'Testing database table access...' });
    setTestProgress(83);
    
    try {
      const startTime = Date.now();
      const { count, error } = await supabase
        .from('clients_2026_01_10_12_00')
        .select('*', { count: 'exact', head: true });
      const duration = Date.now() - startTime;
      
      if (error) {
        updateResult('Database Access', { 
          status: 'failed', 
          message: 'Database access failed',
          details: `Error: ${error.message} (Code: ${error.code})`,
          duration
        });
      } else {
        updateResult('Database Access', { 
          status: 'success', 
          message: 'Database access successful',
          details: `Records found: ${count}, Response time: ${duration}ms`,
          duration
        });
      }
    } catch (error: any) {
      updateResult('Database Access', { 
        status: 'failed', 
        message: 'Database access error',
        details: error.message
      });
    }

    // Test 6: Service Integration
    addResult({ test: 'Service Integration', status: 'testing', message: 'Testing service layer integration...' });
    setTestProgress(100);
    
    try {
      const startTime = Date.now();
      const clients = await clientService.getAll();
      const duration = Date.now() - startTime;
      
      updateResult('Service Integration', { 
        status: 'success', 
        message: 'Service integration successful',
        details: `Loaded ${clients.length} clients, Response time: ${duration}ms`,
        duration
      });
    } catch (error: any) {
      updateResult('Service Integration', { 
        status: 'failed', 
        message: 'Service integration failed',
        details: error.message
      });
    }

    setIsRunning(false);
    updateSystemHealth();
  };

  const runPerformanceTests = async () => {
    setIsRunning(true);
    setResults([]);
    setTestProgress(0);

    const performanceTests = [
      'Load Time Test',
      'Concurrent Requests',
      'Large Dataset Query',
      'Memory Usage',
      'Response Time Analysis'
    ];

    // Performance Test 1: Load Time
    addResult({ test: 'Load Time Test', status: 'testing', message: 'Testing initial load performance...' });
    setTestProgress(20);

    try {
      const startTime = Date.now();
      await Promise.all([
        clientService.getAll(),
        dealService.getAll(),
        boothService.getAll()
      ]);
      const duration = Date.now() - startTime;

      updateResult('Load Time Test', {
        status: duration < 2000 ? 'success' : 'failed',
        message: `Load time: ${duration}ms`,
        details: duration < 2000 ? 'Excellent performance' : 'Performance needs improvement',
        duration
      });
    } catch (error: any) {
      updateResult('Load Time Test', {
        status: 'failed',
        message: 'Load time test failed',
        details: error.message
      });
    }

    // Performance Test 2: Concurrent Requests
    addResult({ test: 'Concurrent Requests', status: 'testing', message: 'Testing concurrent request handling...' });
    setTestProgress(40);

    try {
      const startTime = Date.now();
      const requests = Array(5).fill(null).map(() => clientService.getAll());
      await Promise.all(requests);
      const duration = Date.now() - startTime;

      updateResult('Concurrent Requests', {
        status: 'success',
        message: 'Concurrent requests handled successfully',
        details: `5 concurrent requests completed in ${duration}ms`,
        duration
      });
    } catch (error: any) {
      updateResult('Concurrent Requests', {
        status: 'failed',
        message: 'Concurrent request test failed',
        details: error.message
      });
    }

    setTestProgress(100);
    setIsRunning(false);
  };

  const updateSystemHealth = () => {
    const successCount = results.filter(r => r.status === 'success').length;
    const failedCount = results.filter(r => r.status === 'failed').length;
    const totalTests = results.length;

    const healthStatus = failedCount === 0 ? 'healthy' : 
                        failedCount < totalTests / 2 ? 'warning' : 'error';

    setSystemHealth({
      database: healthStatus,
      api: healthStatus,
      authentication: healthStatus,
      services: healthStatus
    });
  };

  useEffect(() => {
    runApiKeyTests();
  }, []);

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'failed': return <XCircle className="w-5 h-5 text-red-600" />;
      case 'testing': return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />;
      case 'pending': return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getTestIcon = (test: string) => {
    switch (test) {
      case 'Connection Test': return <Wifi className="w-5 h-5 text-blue-600" />;
      case 'Direct API Call': return <Globe className="w-5 h-5 text-green-600" />;
      case 'Supabase Client': return <Database className="w-5 h-5 text-purple-600" />;
      case 'Authentication Check': return <Shield className="w-5 h-5 text-orange-600" />;
      case 'Database Access': return <Server className="w-5 h-5 text-indigo-600" />;
      case 'Service Integration': return <Zap className="w-5 h-5 text-yellow-600" />;
      case 'Load Time Test': return <Clock className="w-5 h-5 text-blue-600" />;
      case 'Concurrent Requests': return <Network className="w-5 h-5 text-green-600" />;
      default: return <TestTube className="w-5 h-5 text-gray-600" />;
    }
  };

  const getHealthIcon = (status: SystemHealth[keyof SystemHealth]) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getOverallStatus = () => {
    const successCount = results.filter(r => r.status === 'success').length;
    const failedCount = results.filter(r => r.status === 'failed').length;
    const testingCount = results.filter(r => r.status === 'testing').length;

    if (testingCount > 0) return { status: 'testing', message: '🔄 Testing in Progress...' };
    if (failedCount === 0 && successCount > 0) return { status: 'success', message: '✅ All Tests Passed' };
    if (failedCount > 0) return { status: 'failed', message: '❌ Some Tests Failed' };
    return { status: 'pending', message: '⏳ Ready to Test' };
  };

  const overallStatus = getOverallStatus();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <TestTube className="w-8 h-8 text-blue-600" />
            System Testing & Diagnostics
          </h1>
          <p className="text-gray-600 mt-2">
            Comprehensive API key authentication and system health testing
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge 
            variant={
              overallStatus.status === 'success' ? 'default' :
              overallStatus.status === 'failed' ? 'destructive' : 'outline'
            }
            className="px-4 py-2"
          >
            {overallStatus.message}
          </Badge>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Database</span>
              </div>
              {getHealthIcon(systemHealth.database)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-green-600" />
                <span className="font-medium">API</span>
              </div>
              {getHealthIcon(systemHealth.api)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-orange-600" />
                <span className="font-medium">Auth</span>
              </div>
              {getHealthIcon(systemHealth.authentication)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-600" />
                <span className="font-medium">Services</span>
              </div>
              {getHealthIcon(systemHealth.services)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      {isRunning && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-2">
                  <span>Running Tests...</span>
                  <span>{testProgress}%</span>
                </div>
                <Progress value={testProgress} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="api-tests">API Tests</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="api-tests" className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Button 
              onClick={runApiKeyTests} 
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              {isRunning ? 'Running...' : 'Run API Tests'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setResults([])}
              disabled={isRunning}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Clear Results
            </Button>
          </div>

          <div className="space-y-4">
            {results.map((result, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-lg">
                    <div className="flex items-center gap-3">
                      {getTestIcon(result.test)}
                      <span>{result.test}</span>
                      {getStatusIcon(result.status)}
                    </div>
                    {result.duration && (
                      <Badge variant="outline" className="text-xs">
                        {result.duration}ms
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">{result.message}</p>
                    {result.details && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <code className="text-xs text-gray-700 break-all">{result.details}</code>
                      </div>
                    )}
                    {result.timestamp && (
                      <p className="text-xs text-gray-500">
                        Completed at: {new Date(result.timestamp).toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {results.length === 0 && !isRunning && (
            <Card>
              <CardContent className="p-8 text-center">
                <TestTube className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Tests Run Yet</h3>
                <p className="text-gray-500">Click "Run API Tests" to start testing your system</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Button 
              onClick={runPerformanceTests} 
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
              {isRunning ? 'Running...' : 'Run Performance Tests'}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Response Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {results.find(r => r.test === 'Load Time Test')?.duration || 0}ms
                </div>
                <p className="text-sm text-gray-600">Average load time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="w-5 h-5" />
                  Throughput
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {results.filter(r => r.status === 'success').length}
                </div>
                <p className="text-sm text-gray-600">Successful requests</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Success Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {results.length > 0 ? Math.round((results.filter(r => r.status === 'success').length / results.length) * 100) : 0}%
                </div>
                <p className="text-sm text-gray-600">Test success rate</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="configuration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                API Key Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Supabase URL</label>
                    <div className="mt-1 p-2 bg-gray-50 rounded border text-sm font-mono">
                      https://xecogeelxabowzazqajq.supabase.co
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Project ID</label>
                    <div className="mt-1 p-2 bg-gray-50 rounded border text-sm font-mono">
                      xecogeelxabowzazqajq
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">API Key</label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  <div className="mt-1 p-2 bg-gray-50 rounded border text-sm font-mono break-all">
                    {showApiKey 
                      ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlY29nZWVseGFib3d6YXpxYWpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMjU1ODMsImV4cCI6MjA4MjYwMTU4M30.wZVVQF2A7iHgj4Yjzk1pumeIzCkZbTppw3TLVrWnW1M'
                      : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                    }
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">🔍 Test Results Interpretation</h4>
                  <div className="space-y-2 text-sm text-blue-800">
                    <div><strong>Connection Test:</strong> Verifies network connectivity to Supabase</div>
                    <div><strong>Direct API Call:</strong> Tests if the API key works with raw HTTP requests</div>
                    <div><strong>Supabase Client:</strong> Tests if the Supabase client properly sends the API key</div>
                    <div><strong>Authentication Check:</strong> Verifies the authentication system status</div>
                    <div><strong>Database Access:</strong> Tests if the API key has read permissions</div>
                    <div><strong>Service Integration:</strong> Tests if the service layer can access data</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}