import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Percent, 
  DollarSign, 
  TrendingUp, 
  User, 
  Target, 
  Calendar,
  RefreshCw,
  Download,
  Filter,
  Search,
  Eye,
  Edit,
  Plus,
  Award,
  BarChart3,
  Users,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

interface Commission {
  id: string;
  sales_rep_id: string;
  sales_rep_name: string;
  deal_id: string;
  deal_title: string;
  client_name: string;
  deal_value: number;
  commission_rate: number;
  commission_amount: number;
  status: 'pending' | 'approved' | 'paid' | 'disputed';
  created_at: string;
  paid_at?: string;
  period: string;
}

interface SalesRep {
  id: string;
  name: string;
  email: string;
  total_deals: number;
  total_commission: number;
  paid_commission: number;
  pending_commission: number;
  commission_rate: number;
  target: number;
  achievement: number;
}

export default function Commissions() {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [salesReps, setSalesReps] = useState<SalesRep[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [periodFilter, setPeriodFilter] = useState('current');
  const [activeTab, setActiveTab] = useState('commissions');

  // Mock data
  const mockCommissions: Commission[] = [
    {
      id: '1',
      sales_rep_id: 'REP-001',
      sales_rep_name: 'Sarah Johnson',
      deal_id: 'DEAL-001',
      deal_title: 'EcoTech Solutions - Premium Booth',
      client_name: 'EcoTech Solutions',
      deal_value: 72000,
      commission_rate: 8,
      commission_amount: 5760,
      status: 'approved',
      created_at: '2024-01-08T10:00:00Z',
      period: '2024-01'
    },
    {
      id: '2',
      sales_rep_id: 'REP-002',
      sales_rep_name: 'Michael Chen',
      deal_id: 'DEAL-002',
      deal_title: 'Green Energy Alliance - Platinum Sponsorship',
      client_name: 'Green Energy Alliance',
      deal_value: 50000,
      commission_rate: 10,
      commission_amount: 5000,
      status: 'paid',
      created_at: '2024-01-05T14:30:00Z',
      paid_at: '2024-01-15T09:00:00Z',
      period: '2024-01'
    },
    {
      id: '3',
      sales_rep_id: 'REP-003',
      sales_rep_name: 'Emily Rodriguez',
      deal_id: 'DEAL-003',
      deal_title: 'Innovation Corp - Service Agreement',
      client_name: 'Innovation Corp',
      deal_value: 25000,
      commission_rate: 6,
      commission_amount: 1500,
      status: 'pending',
      created_at: '2024-01-10T16:45:00Z',
      period: '2024-01'
    },
    {
      id: '4',
      sales_rep_id: 'REP-001',
      sales_rep_name: 'Sarah Johnson',
      deal_id: 'DEAL-004',
      deal_title: 'Sustainable Systems Inc - Partnership',
      client_name: 'Sustainable Systems Inc',
      deal_value: 100000,
      commission_rate: 8,
      commission_amount: 8000,
      status: 'disputed',
      created_at: '2024-01-12T11:20:00Z',
      period: '2024-01'
    }
  ];

  const mockSalesReps: SalesRep[] = [
    {
      id: 'REP-001',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@space.com',
      total_deals: 23,
      total_commission: 46320,
      paid_commission: 32560,
      pending_commission: 13760,
      commission_rate: 8,
      target: 50000,
      achievement: 92.6
    },
    {
      id: 'REP-002',
      name: 'Michael Chen',
      email: 'michael.chen@space.com',
      total_deals: 19,
      total_commission: 38750,
      paid_commission: 33750,
      pending_commission: 5000,
      commission_rate: 10,
      target: 40000,
      achievement: 96.9
    },
    {
      id: 'REP-003',
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@space.com',
      total_deals: 17,
      total_commission: 28900,
      paid_commission: 27400,
      pending_commission: 1500,
      commission_rate: 6,
      target: 35000,
      achievement: 82.6
    },
    {
      id: 'REP-004',
      name: 'David Wilson',
      email: 'david.wilson@space.com',
      total_deals: 15,
      total_commission: 31200,
      paid_commission: 31200,
      pending_commission: 0,
      commission_rate: 7,
      target: 30000,
      achievement: 104.0
    }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setCommissions(mockCommissions);
      setSalesReps(mockSalesReps);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredCommissions = commissions.filter(commission => {
    const matchesSearch = commission.sales_rep_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         commission.deal_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         commission.client_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || commission.status === statusFilter;
    const matchesPeriod = periodFilter === 'all' || commission.period === periodFilter;
    
    return matchesSearch && matchesStatus && matchesPeriod;
  });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending': return { color: 'bg-yellow-100 text-yellow-800', icon: Clock };
      case 'approved': return { color: 'bg-blue-100 text-blue-800', icon: CheckCircle };
      case 'paid': return { color: 'bg-green-100 text-green-800', icon: CheckCircle };
      case 'disputed': return { color: 'bg-red-100 text-red-800', icon: AlertCircle };
      default: return { color: 'bg-gray-100 text-gray-800', icon: Clock };
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  // Calculate summary statistics
  const totalCommissions = commissions.reduce((sum, c) => sum + c.commission_amount, 0);
  const paidCommissions = commissions.filter(c => c.status === 'paid').reduce((sum, c) => sum + c.commission_amount, 0);
  const pendingCommissions = commissions.filter(c => c.status === 'pending' || c.status === 'approved').reduce((sum, c) => sum + c.commission_amount, 0);
  const avgCommissionRate = commissions.reduce((sum, c) => sum + c.commission_rate, 0) / commissions.length || 0;

  if (loading) {
    return (
      <div className="content-area">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading commissions...</p>
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
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Percent className="w-8 h-8 text-blue-600" />
              Commission Management
            </h1>
            <p className="text-gray-600 mt-2">Track sales compensation and performance metrics</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Process Commissions
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 mb-1">Total Commissions</p>
                  <p className="text-2xl font-bold text-blue-900">{formatCurrency(totalCommissions)}</p>
                  <p className="text-sm text-blue-700 mt-1">{commissions.length} transactions</p>
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
                  <p className="text-sm font-medium text-green-600 mb-1">Paid Out</p>
                  <p className="text-2xl font-bold text-green-900">{formatCurrency(paidCommissions)}</p>
                  <p className="text-sm text-green-700 mt-1">{formatPercentage((paidCommissions / totalCommissions) * 100)}</p>
                </div>
                <div className="p-3 bg-green-200 rounded-full">
                  <CheckCircle className="w-6 h-6 text-green-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600 mb-1">Pending</p>
                  <p className="text-2xl font-bold text-yellow-900">{formatCurrency(pendingCommissions)}</p>
                  <p className="text-sm text-yellow-700 mt-1">{formatPercentage((pendingCommissions / totalCommissions) * 100)}</p>
                </div>
                <div className="p-3 bg-yellow-200 rounded-full">
                  <Clock className="w-6 h-6 text-yellow-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 mb-1">Avg Rate</p>
                  <p className="text-2xl font-bold text-purple-900">{formatPercentage(avgCommissionRate)}</p>
                  <p className="text-sm text-purple-700 mt-1">Commission rate</p>
                </div>
                <div className="p-3 bg-purple-200 rounded-full">
                  <Percent className="w-6 h-6 text-purple-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: 'commissions', label: 'Commissions', icon: DollarSign },
              { id: 'sales-reps', label: 'Sales Team', icon: Users }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'commissions' && (
          <div className="space-y-6">
            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <Input
                    placeholder="Search commissions..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="paid">Paid</option>
                  <option value="disputed">Disputed</option>
                </select>
                <select
                  className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={periodFilter}
                  onChange={(e) => setPeriodFilter(e.target.value)}
                >
                  <option value="current">Current Period</option>
                  <option value="2024-01">January 2024</option>
                  <option value="2023-12">December 2023</option>
                  <option value="all">All Periods</option>
                </select>
              </div>
            </div>

            {/* Commissions List */}
            <div className="space-y-4">
              {filteredCommissions.map((commission) => {
                const statusConfig = getStatusConfig(commission.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <Card key={commission.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="p-3 bg-blue-100 rounded-lg">
                            <Percent className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{commission.deal_title}</h3>
                              <Badge className={statusConfig.color}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {commission.status}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-3">
                              <div>
                                <span className="text-gray-500">Sales Rep:</span>
                                <p className="font-medium text-gray-900">{commission.sales_rep_name}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Client:</span>
                                <p className="font-medium text-gray-900">{commission.client_name}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Deal Value:</span>
                                <p className="font-medium text-gray-900">{formatCurrency(commission.deal_value)}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Commission Rate:</span>
                                <p className="font-medium text-gray-900">{formatPercentage(commission.commission_rate)}</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="text-2xl font-bold text-green-600">
                                  {formatCurrency(commission.commission_amount)}
                                </div>
                                <div className="text-sm text-gray-500">
                                  Created: {new Date(commission.created_at).toLocaleDateString()}
                                  {commission.paid_at && (
                                    <span className="ml-2">
                                      • Paid: {new Date(commission.paid_at).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'sales-reps' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {salesReps.map((rep) => (
                <Card key={rep.id} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{rep.name}</h3>
                            <p className="text-sm text-gray-600">{rep.email}</p>
                          </div>
                          <Badge className={rep.achievement >= 100 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                            {formatPercentage(rep.achievement)} of target
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-500">Total Commission</p>
                            <p className="text-lg font-semibold text-gray-900">{formatCurrency(rep.total_commission)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Commission Rate</p>
                            <p className="text-lg font-semibold text-gray-900">{formatPercentage(rep.commission_rate)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Paid</p>
                            <p className="text-lg font-semibold text-green-600">{formatCurrency(rep.paid_commission)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Pending</p>
                            <p className="text-lg font-semibold text-yellow-600">{formatCurrency(rep.pending_commission)}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Target Progress</span>
                            <span className="font-medium">{formatCurrency(rep.total_commission)} / {formatCurrency(rep.target)}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${rep.achievement >= 100 ? 'bg-green-600' : 'bg-blue-600'}`}
                              style={{ width: `${Math.min(rep.achievement, 100)}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <BarChart3 className="w-4 h-4" />
                            <span>{rep.total_deals} deals closed</span>
                          </div>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}