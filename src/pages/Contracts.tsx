import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Calendar,
  User,
  Building,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Contract {
  id: string;
  title: string;
  client_name: string;
  contract_type: 'booth_rental' | 'sponsorship' | 'service' | 'partnership';
  status: 'draft' | 'pending' | 'signed' | 'expired' | 'cancelled';
  value: number;
  start_date: string;
  end_date: string;
  created_at: string;
  created_by: string;
  description?: string;
}

const contractTypes = [
  { value: 'booth_rental', label: 'Booth Rental', color: 'bg-blue-100 text-blue-800' },
  { value: 'sponsorship', label: 'Sponsorship', color: 'bg-purple-100 text-purple-800' },
  { value: 'service', label: 'Service Agreement', color: 'bg-green-100 text-green-800' },
  { value: 'partnership', label: 'Partnership', color: 'bg-orange-100 text-orange-800' }
];

const contractStatuses = [
  { value: 'draft', label: 'Draft', color: 'bg-gray-100 text-gray-800', icon: Edit },
  { value: 'pending', label: 'Pending Review', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  { value: 'signed', label: 'Signed', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  { value: 'expired', label: 'Expired', color: 'bg-red-100 text-red-800', icon: AlertCircle },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: XCircle }
];

export default function Contracts() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Mock data for demonstration
  const mockContracts: Contract[] = [
    {
      id: '1',
      title: 'Green Life Expo 2024 - Premium Booth Rental',
      client_name: 'EcoTech Solutions',
      contract_type: 'booth_rental',
      status: 'signed',
      value: 72000,
      start_date: '2024-03-15',
      end_date: '2024-03-17',
      created_at: '2024-01-15T10:00:00Z',
      created_by: 'Sarah Johnson',
      description: 'Premium booth rental agreement for Green Life Expo 2024'
    },
    {
      id: '2',
      title: 'Platinum Sponsorship Agreement - Green Energy Alliance',
      client_name: 'Green Energy Alliance',
      contract_type: 'sponsorship',
      status: 'signed',
      value: 50000,
      start_date: '2024-03-01',
      end_date: '2024-03-31',
      created_at: '2024-01-10T14:30:00Z',
      created_by: 'Michael Chen',
      description: 'Platinum level sponsorship package with premium benefits'
    },
    {
      id: '3',
      title: 'Event Management Services - Tech Summit 2024',
      client_name: 'Innovation Corp',
      contract_type: 'service',
      status: 'pending',
      value: 25000,
      start_date: '2024-04-01',
      end_date: '2024-04-03',
      created_at: '2024-02-01T09:15:00Z',
      created_by: 'Emily Rodriguez',
      description: 'Comprehensive event management services contract'
    },
    {
      id: '4',
      title: 'Strategic Partnership - Sustainable Systems Inc',
      client_name: 'Sustainable Systems Inc',
      contract_type: 'partnership',
      status: 'draft',
      value: 100000,
      start_date: '2024-05-01',
      end_date: '2025-04-30',
      created_at: '2024-02-10T16:45:00Z',
      created_by: 'David Wilson',
      description: 'Long-term strategic partnership agreement'
    }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setContracts(mockContracts);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.client_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
    const matchesType = typeFilter === 'all' || contract.contract_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusConfig = (status: string) => {
    return contractStatuses.find(s => s.value === status) || contractStatuses[0];
  };

  const getTypeConfig = (type: string) => {
    return contractTypes.find(t => t.value === type) || contractTypes[0];
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate summary statistics
  const totalContracts = contracts.length;
  const signedContracts = contracts.filter(c => c.status === 'signed').length;
  const pendingContracts = contracts.filter(c => c.status === 'pending').length;
  const totalValue = contracts.reduce((sum, contract) => sum + contract.value, 0);
  const signedValue = contracts.filter(c => c.status === 'signed').reduce((sum, contract) => sum + contract.value, 0);

  if (loading) {
    return (
      <div className="content-area">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading contracts...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Contract Management</h1>
            <p className="text-gray-600 mt-2">Manage legal documents, agreements, and contracts</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              New Contract
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 mb-1">Total Contracts</p>
                  <p className="text-3xl font-bold text-blue-900">{totalContracts}</p>
                </div>
                <div className="p-3 bg-blue-200 rounded-full">
                  <FileText className="w-6 h-6 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 mb-1">Signed</p>
                  <p className="text-3xl font-bold text-green-900">{signedContracts}</p>
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
                  <p className="text-3xl font-bold text-yellow-900">{pendingContracts}</p>
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
                  <p className="text-sm font-medium text-purple-600 mb-1">Total Value</p>
                  <p className="text-2xl font-bold text-purple-900">{formatCurrency(totalValue)}</p>
                </div>
                <div className="p-3 bg-purple-200 rounded-full">
                  <DollarSign className="w-6 h-6 text-purple-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-indigo-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-indigo-600 mb-1">Signed Value</p>
                  <p className="text-2xl font-bold text-indigo-900">{formatCurrency(signedValue)}</p>
                </div>
                <div className="p-3 bg-indigo-200 rounded-full">
                  <Building className="w-6 h-6 text-indigo-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                placeholder="Search contracts..."
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
              {contractStatuses.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
            <select
              className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              {contractTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Contracts List */}
        <div className="space-y-4">
          {filteredContracts.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No contracts found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' 
                    ? 'Try adjusting your search criteria or filters.'
                    : 'Get started by creating your first contract.'}
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Contract
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredContracts.map((contract) => {
              const statusConfig = getStatusConfig(contract.status);
              const typeConfig = getTypeConfig(contract.contract_type);
              const StatusIcon = statusConfig.icon;

              return (
                <Card key={contract.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-blue-100 rounded-lg">
                            <FileText className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                              {contract.title}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center gap-1">
                                <Building className="w-4 h-4" />
                                <span>{contract.client_name}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                <span>Created by {contract.created_by}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(contract.start_date)} - {formatDate(contract.end_date)}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 mb-3">
                              <Badge className={typeConfig.color}>
                                {typeConfig.label}
                              </Badge>
                              <Badge className={statusConfig.color}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {statusConfig.label}
                              </Badge>
                              <span className="text-lg font-semibold text-green-600">
                                {formatCurrency(contract.value)}
                              </span>
                            </div>
                            {contract.description && (
                              <p className="text-sm text-gray-600 mb-3">{contract.description}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}