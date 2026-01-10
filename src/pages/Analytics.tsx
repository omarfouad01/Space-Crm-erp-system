import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChartColumn, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Calendar,
  Target,
  BarChart3,
  PieChart,
  Activity,
  RefreshCw,
  Download,
  Filter,
  Eye,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface AnalyticsData {
  revenue: {
    total: number;
    growth: number;
    monthly: Array<{ month: string; amount: number }>;
  };
  deals: {
    total: number;
    won: number;
    lost: number;
    winRate: number;
    avgDealSize: number;
    pipeline: Array<{ stage: string; count: number; value: number }>;
  };
  clients: {
    total: number;
    active: number;
    new: number;
    retention: number;
    satisfaction: number;
  };
  exhibitions: {
    total: number;
    upcoming: number;
    completed: number;
    revenue: number;
    attendance: number;
  };
  performance: {
    salesTeam: Array<{ name: string; deals: number; revenue: number; target: number }>;
    topClients: Array<{ name: string; revenue: number; deals: number }>;
    topExhibitions: Array<{ name: string; revenue: number; attendance: number }>;
  };
}

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('12m'); // 1m, 3m, 6m, 12m

  // Mock analytics data
  const mockData: AnalyticsData = {
    revenue: {
      total: 2450000,
      growth: 15.3,
      monthly: [
        { month: 'Jan', amount: 180000 },
        { month: 'Feb', amount: 195000 },
        { month: 'Mar', amount: 220000 },
        { month: 'Apr', amount: 205000 },
        { month: 'May', amount: 240000 },
        { month: 'Jun', amount: 260000 },
        { month: 'Jul', amount: 235000 },
        { month: 'Aug', amount: 275000 },
        { month: 'Sep', amount: 290000 },
        { month: 'Oct', amount: 310000 },
        { month: 'Nov', amount: 285000 },
        { month: 'Dec', amount: 325000 }
      ]
    },
    deals: {
      total: 156,
      won: 89,
      lost: 34,
      winRate: 72.4,
      avgDealSize: 27500,
      pipeline: [
        { stage: 'Talking', count: 12, value: 330000 },
        { stage: 'Meeting Scheduled', count: 8, value: 220000 },
        { stage: 'Strategy Proposal', count: 15, value: 412500 },
        { stage: 'Objection Handling', count: 6, value: 165000 },
        { stage: 'Terms Finalized', count: 4, value: 110000 },
        { stage: 'Closed Won', count: 89, value: 2447500 },
        { stage: 'Closed Lost', count: 34, value: 935000 }
      ]
    },
    clients: {
      total: 234,
      active: 189,
      new: 23,
      retention: 87.5,
      satisfaction: 4.6
    },
    exhibitions: {
      total: 12,
      upcoming: 3,
      completed: 9,
      revenue: 1850000,
      attendance: 45600
    },
    performance: {
      salesTeam: [
        { name: 'Sarah Johnson', deals: 23, revenue: 632500, target: 600000 },
        { name: 'Michael Chen', deals: 19, revenue: 523000, target: 500000 },
        { name: 'Emily Rodriguez', deals: 17, revenue: 467500, target: 450000 },
        { name: 'David Wilson', deals: 15, revenue: 412500, target: 400000 },
        { name: 'Lisa Anderson', deals: 15, revenue: 411000, target: 425000 }
      ],
      topClients: [
        { name: 'EcoTech Solutions', revenue: 285000, deals: 8 },
        { name: 'Green Energy Alliance', revenue: 245000, deals: 6 },
        { name: 'Sustainable Systems Inc', revenue: 198000, deals: 5 },
        { name: 'Innovation Corp', revenue: 167500, deals: 4 },
        { name: 'Future Tech Ltd', revenue: 145000, deals: 3 }
      ],
      topExhibitions: [
        { name: 'Green Life Expo 2024', revenue: 485000, attendance: 12500 },
        { name: 'Tech Innovation Summit', revenue: 367000, attendance: 8900 },
        { name: 'Sustainable Future Expo', revenue: 298000, attendance: 7200 },
        { name: 'Digital Transformation Conference', revenue: 245000, attendance: 5800 },
        { name: 'Clean Energy Showcase', revenue: 198000, attendance: 4600 }
      ]
    }
  };

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 1000);
  }, [timeRange]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  if (loading || !data) {
    return (
      <div className="content-area">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content-area">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Business Analytics</h1>
            <p className="text-gray-600 mt-2">Comprehensive business intelligence and performance metrics</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="1m">Last Month</option>
              <option value="3m">Last 3 Months</option>
              <option value="6m">Last 6 Months</option>
              <option value="12m">Last 12 Months</option>
            </select>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 mb-1">Total Revenue</p>
                  <p className="text-2xl font-bold text-blue-900">{formatCurrency(data.revenue.total)}</p>
                  <div className="flex items-center mt-2">
                    {data.revenue.growth > 0 ? (
                      <ArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-600 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${data.revenue.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPercentage(Math.abs(data.revenue.growth))}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-blue-200 rounded-full">
                  <DollarSign className="w-6 h-6 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 mb-1">Win Rate</p>
                  <p className="text-2xl font-bold text-green-900">{formatPercentage(data.deals.winRate)}</p>
                  <p className="text-sm text-green-700 mt-2">{data.deals.won} of {data.deals.total} deals</p>
                </div>
                <div className="p-3 bg-green-200 rounded-full">
                  <Target className="w-6 h-6 text-green-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 mb-1">Active Clients</p>
                  <p className="text-2xl font-bold text-purple-900">{data.clients.active}</p>
                  <p className="text-sm text-purple-700 mt-2">{formatPercentage(data.clients.retention)} retention</p>
                </div>
                <div className="p-3 bg-purple-200 rounded-full">
                  <Users className="w-6 h-6 text-purple-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600 mb-1">Avg Deal Size</p>
                  <p className="text-2xl font-bold text-orange-900">{formatCurrency(data.deals.avgDealSize)}</p>
                  <p className="text-sm text-orange-700 mt-2">{data.deals.total} total deals</p>
                </div>
                <div className="p-3 bg-orange-200 rounded-full">
                  <BarChart3 className="w-6 h-6 text-orange-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Revenue Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.revenue.monthly.slice(-6).map((month, index) => (
                  <div key={month.month} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">{month.month}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(month.amount / 350000) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 w-20 text-right">
                        {formatCurrency(month.amount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sales Pipeline */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-green-600" />
                Sales Pipeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.deals.pipeline.filter(stage => stage.count > 0).map((stage, index) => (
                  <div key={stage.stage} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-blue-600" />
                      <span className="text-sm font-medium text-gray-600">{stage.stage}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="secondary">{stage.count} deals</Badge>
                      <span className="text-sm font-semibold text-gray-900 w-20 text-right">
                        {formatCurrency(stage.value)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales Team Performance */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-600" />
                Sales Team Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.performance.salesTeam.map((member, index) => (
                  <div key={member.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{member.name}</span>
                      <Badge variant={member.revenue >= member.target ? "default" : "secondary"}>
                        {member.deals} deals
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>{formatCurrency(member.revenue)}</span>
                      <span>Target: {formatCurrency(member.target)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${member.revenue >= member.target ? 'bg-green-600' : 'bg-blue-600'}`}
                        style={{ width: `${Math.min((member.revenue / member.target) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Clients */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-green-600" />
                Top Clients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.performance.topClients.map((client, index) => (
                  <div key={client.name} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{client.name}</p>
                      <p className="text-xs text-gray-600">{client.deals} deals</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{formatCurrency(client.revenue)}</p>
                      <Badge variant="outline" className="text-xs">
                        #{index + 1}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Exhibitions */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-600" />
                Top Exhibitions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.performance.topExhibitions.map((exhibition, index) => (
                  <div key={exhibition.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">{exhibition.name}</p>
                      <Badge variant="outline" className="text-xs">
                        #{index + 1}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>{formatCurrency(exhibition.revenue)}</span>
                      <span>{exhibition.attendance.toLocaleString()} attendees</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{data.exhibitions.total}</p>
              <p className="text-sm text-gray-600">Total Exhibitions</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{data.exhibitions.attendance.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Total Attendance</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 text-center">
              <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{data.clients.satisfaction}/5.0</p>
              <p className="text-sm text-gray-600">Client Satisfaction</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{data.clients.new}</p>
              <p className="text-sm text-gray-600">New Clients</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}