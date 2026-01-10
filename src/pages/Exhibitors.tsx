import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Building, 
  Users, 
  MapPin, 
  Calendar, 
  Phone, 
  Mail, 
  Globe,
  RefreshCw,
  Download,
  Filter,
  Search,
  Eye,
  Edit,
  Plus,
  Star,
  TrendingUp,
  DollarSign,
  Award,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';

interface Exhibitor {
  id: string;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  website?: string;
  industry: string;
  company_size: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  status: 'active' | 'inactive' | 'pending' | 'blacklisted';
  rating: number;
  total_exhibitions: number;
  total_spent: number;
  last_exhibition: string;
  next_exhibition?: string;
  booth_preferences: string[];
  special_requirements?: string;
  created_at: string;
  notes?: string;
}

const industries = [
  'Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Retail',
  'Education', 'Energy', 'Transportation', 'Real Estate', 'Food & Beverage'
];

const companySizes = [
  { value: 'startup', label: 'Startup (1-10)', color: 'bg-purple-100 text-purple-800' },
  { value: 'small', label: 'Small (11-50)', color: 'bg-blue-100 text-blue-800' },
  { value: 'medium', label: 'Medium (51-200)', color: 'bg-green-100 text-green-800' },
  { value: 'large', label: 'Large (201-1000)', color: 'bg-orange-100 text-orange-800' },
  { value: 'enterprise', label: 'Enterprise (1000+)', color: 'bg-red-100 text-red-800' }
];

const exhibitorStatuses = [
  { value: 'active', label: 'Active', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  { value: 'inactive', label: 'Inactive', color: 'bg-gray-100 text-gray-800', icon: Clock },
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  { value: 'blacklisted', label: 'Blacklisted', color: 'bg-red-100 text-red-800', icon: AlertTriangle }
];

export default function Exhibitors() {
  const [exhibitors, setExhibitors] = useState<Exhibitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [sizeFilter, setSizeFilter] = useState('all');

  // Mock data
  const mockExhibitors: Exhibitor[] = [
    {
      id: '1',
      company_name: 'EcoTech Solutions',
      contact_person: 'John Smith',
      email: 'john.smith@ecotech.com',
      phone: '+1-555-0101',
      website: 'https://ecotech.com',
      industry: 'Technology',
      company_size: 'medium',
      status: 'active',
      rating: 4.8,
      total_exhibitions: 12,
      total_spent: 285000,
      last_exhibition: '2024-01-15',
      next_exhibition: '2024-03-15',
      booth_preferences: ['Premium Location', 'Corner Booth', 'Large Space'],
      special_requirements: 'High power requirements for demo equipment',
      created_at: '2022-03-15T10:00:00Z',
      notes: 'Excellent exhibitor, always pays on time, great booth presentation'
    },
    {
      id: '2',
      company_name: 'Green Energy Alliance',
      contact_person: 'Sarah Wilson',
      email: 'sarah.wilson@greenenergy.com',
      phone: '+1-555-0102',
      website: 'https://greenenergy.com',
      industry: 'Energy',
      company_size: 'large',
      status: 'active',
      rating: 4.6,
      total_exhibitions: 8,
      total_spent: 420000,
      last_exhibition: '2024-01-10',
      next_exhibition: '2024-04-20',
      booth_preferences: ['Premium Location', 'High Traffic Area'],
      created_at: '2022-06-20T14:30:00Z',
      notes: 'Major sponsor, prefers platinum packages'
    },
    {
      id: '3',
      company_name: 'Innovation Corp',
      contact_person: 'Michael Chen',
      email: 'michael.chen@innovation.com',
      phone: '+1-555-0103',
      industry: 'Technology',
      company_size: 'startup',
      status: 'pending',
      rating: 4.2,
      total_exhibitions: 3,
      total_spent: 45000,
      last_exhibition: '2023-11-15',
      booth_preferences: ['Standard Location', 'Budget Friendly'],
      created_at: '2023-08-10T09:15:00Z',
      notes: 'New exhibitor, needs guidance on booth setup'
    },
    {
      id: '4',
      company_name: 'Sustainable Systems Inc',
      contact_person: 'Emily Rodriguez',
      email: 'emily.rodriguez@sustainable.com',
      phone: '+1-555-0104',
      website: 'https://sustainable.com',
      industry: 'Manufacturing',
      company_size: 'medium',
      status: 'active',
      rating: 4.9,
      total_exhibitions: 15,
      total_spent: 380000,
      last_exhibition: '2024-01-08',
      next_exhibition: '2024-05-10',
      booth_preferences: ['Eco-Friendly Setup', 'Premium Location'],
      special_requirements: 'Sustainable materials only, no plastic displays',
      created_at: '2021-11-30T16:45:00Z',
      notes: 'Long-term partner, sustainability focused'
    },
    {
      id: '5',
      company_name: 'Future Tech Ltd',
      contact_person: 'David Brown',
      email: 'david.brown@futuretech.com',
      phone: '+1-555-0105',
      industry: 'Technology',
      company_size: 'small',
      status: 'inactive',
      rating: 3.8,
      total_exhibitions: 5,
      total_spent: 125000,
      last_exhibition: '2023-09-20',
      booth_preferences: ['Standard Location'],
      created_at: '2023-01-15T11:20:00Z',
      notes: 'Has not participated in recent exhibitions'
    }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setExhibitors(mockExhibitors);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredExhibitors = exhibitors.filter(exhibitor => {
    const matchesSearch = exhibitor.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exhibitor.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exhibitor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || exhibitor.status === statusFilter;
    const matchesIndustry = industryFilter === 'all' || exhibitor.industry === industryFilter;
    const matchesSize = sizeFilter === 'all' || exhibitor.company_size === sizeFilter;
    
    return matchesSearch && matchesStatus && matchesIndustry && matchesSize;
  });

  const getStatusConfig = (status: string) => {
    return exhibitorStatuses.find(s => s.value === status) || exhibitorStatuses[0];
  };

  const getSizeConfig = (size: string) => {
    return companySizes.find(s => s.value === size) || companySizes[0];
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  // Calculate summary statistics
  const totalExhibitors = exhibitors.length;
  const activeExhibitors = exhibitors.filter(e => e.status === 'active').length;
  const totalRevenue = exhibitors.reduce((sum, e) => sum + e.total_spent, 0);
  const avgRating = exhibitors.reduce((sum, e) => sum + e.rating, 0) / exhibitors.length || 0;

  if (loading) {
    return (
      <div className="content-area">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading exhibitors...</p>
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
              <Building className="w-8 h-8 text-blue-600" />
              Exhibitor Relations
            </h1>
            <p className="text-gray-600 mt-2">Manage exhibitor relationships and partnerships</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export List
            </Button>
            <Button variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Exhibitor
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 mb-1">Total Exhibitors</p>
                  <p className="text-3xl font-bold text-blue-900">{totalExhibitors}</p>
                  <p className="text-sm text-blue-700 mt-1">Registered companies</p>
                </div>
                <div className="p-3 bg-blue-200 rounded-full">
                  <Building className="w-6 h-6 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 mb-1">Active</p>
                  <p className="text-3xl font-bold text-green-900">{activeExhibitors}</p>
                  <p className="text-sm text-green-700 mt-1">{((activeExhibitors / totalExhibitors) * 100).toFixed(1)}% active</p>
                </div>
                <div className="p-3 bg-green-200 rounded-full">
                  <CheckCircle className="w-6 h-6 text-green-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 mb-1">Total Revenue</p>
                  <p className="text-2xl font-bold text-purple-900">{formatCurrency(totalRevenue)}</p>
                  <p className="text-sm text-purple-700 mt-1">Lifetime value</p>
                </div>
                <div className="p-3 bg-purple-200 rounded-full">
                  <DollarSign className="w-6 h-6 text-purple-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600 mb-1">Avg Rating</p>
                  <p className="text-3xl font-bold text-yellow-900">{avgRating.toFixed(1)}</p>
                  <div className="flex items-center mt-1">
                    {renderStars(avgRating)}
                  </div>
                </div>
                <div className="p-3 bg-yellow-200 rounded-full">
                  <Star className="w-6 h-6 text-yellow-700" />
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
                placeholder="Search exhibitors..."
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
              {exhibitorStatuses.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
            <select
              className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
            >
              <option value="all">All Industries</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
            <select
              className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={sizeFilter}
              onChange={(e) => setSizeFilter(e.target.value)}
            >
              <option value="all">All Sizes</option>
              {companySizes.map(size => (
                <option key={size.value} value={size.value}>{size.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Exhibitors List */}
        <div className="space-y-4">
          {filteredExhibitors.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No exhibitors found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || statusFilter !== 'all' || industryFilter !== 'all' || sizeFilter !== 'all'
                    ? 'Try adjusting your search criteria or filters.'
                    : 'Get started by adding your first exhibitor.'}
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Exhibitor
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredExhibitors.map((exhibitor) => {
              const statusConfig = getStatusConfig(exhibitor.status);
              const sizeConfig = getSizeConfig(exhibitor.company_size);
              const StatusIcon = statusConfig.icon;

              return (
                <Card key={exhibitor.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <Building className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{exhibitor.company_name}</h3>
                            <Badge className={statusConfig.color}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {statusConfig.label}
                            </Badge>
                            <Badge className={sizeConfig.color}>
                              {sizeConfig.label}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                <Users className="w-4 h-4" />
                                <span>{exhibitor.contact_person}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                <Mail className="w-4 h-4" />
                                <span>{exhibitor.email}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Phone className="w-4 h-4" />
                                <span>{exhibitor.phone}</span>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                <Award className="w-4 h-4" />
                                <span>{exhibitor.industry}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                <TrendingUp className="w-4 h-4" />
                                <span>{exhibitor.total_exhibitions} exhibitions</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <DollarSign className="w-4 h-4" />
                                <span>{formatCurrency(exhibitor.total_spent)} spent</span>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm text-gray-500">Rating:</span>
                                <div className="flex items-center gap-1">
                                  {renderStars(exhibitor.rating)}
                                  <span className="text-sm font-medium text-gray-900 ml-1">
                                    {exhibitor.rating.toFixed(1)}
                                  </span>
                                </div>
                              </div>
                              <div className="text-sm text-gray-600 mb-1">
                                Last: {new Date(exhibitor.last_exhibition).toLocaleDateString()}
                              </div>
                              {exhibitor.next_exhibition && (
                                <div className="text-sm text-green-600">
                                  Next: {new Date(exhibitor.next_exhibition).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          </div>

                          {exhibitor.booth_preferences.length > 0 && (
                            <div className="mb-3">
                              <span className="text-sm text-gray-500 mb-2 block">Booth Preferences:</span>
                              <div className="flex flex-wrap gap-2">
                                {exhibitor.booth_preferences.map((pref, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {pref}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {exhibitor.special_requirements && (
                            <div className="mb-3">
                              <span className="text-sm text-gray-500">Special Requirements:</span>
                              <p className="text-sm text-gray-700 mt-1">{exhibitor.special_requirements}</p>
                            </div>
                          )}

                          {exhibitor.notes && (
                            <div className="mb-3">
                              <span className="text-sm text-gray-500">Notes:</span>
                              <p className="text-sm text-gray-700 mt-1">{exhibitor.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        {exhibitor.website && (
                          <Button variant="ghost" size="sm">
                            <Globe className="w-4 h-4" />
                          </Button>
                        )}
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
            })
          )}
        </div>
      </div>
    </div>
  );
}