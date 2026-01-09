import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Globe, 
  Activity, 
  Clock, 
  Users, 
  CheckCircle2, 
  XCircle, 
  DollarSign, 
  Target,
  Plus,
  RefreshCw,
  Download,
  Search,
  Filter
} from 'lucide-react';

interface Exhibition {
  id: string;
  name: string;
  number: string;
  city: string;
  theme: string;
  organizer: string;
  status: 'active' | 'planning' | 'registration' | 'completed' | 'cancelled';
  priority: 'high' | 'medium' | 'low';
  year: number;
  startDate: string;
  endDate: string;
  revenue: number;
  expectedVisitors: number;
}

export default function Expos() {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');

  // Mock data for exhibitions
  const mockExhibitions: Exhibition[] = [
    {
      id: '1',
      name: 'Green Life Expo 2024',
      number: 'EXP-2024-001',
      city: 'Dubai',
      theme: 'Sustainability & Environment',
      organizer: 'SPACE Organizing',
      status: 'active',
      priority: 'high',
      year: 2024,
      startDate: '2024-03-15',
      endDate: '2024-03-18',
      revenue: 250000,
      expectedVisitors: 15000
    },
    {
      id: '2',
      name: 'Tech Innovation Summit',
      number: 'EXP-2024-002',
      city: 'Abu Dhabi',
      theme: 'Technology & Innovation',
      organizer: 'SPACE Organizing',
      status: 'planning',
      priority: 'high',
      year: 2024,
      startDate: '2024-06-10',
      endDate: '2024-06-12',
      revenue: 180000,
      expectedVisitors: 12000
    },
    {
      id: '3',
      name: 'Healthcare Expo 2024',
      number: 'EXP-2024-003',
      city: 'Sharjah',
      theme: 'Healthcare & Medical',
      organizer: 'SPACE Organizing',
      status: 'registration',
      priority: 'medium',
      year: 2024,
      startDate: '2024-09-20',
      endDate: '2024-09-22',
      revenue: 120000,
      expectedVisitors: 8000
    }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setExhibitions(mockExhibitions);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Calculate metrics
  const totalExhibitions = exhibitions.length;
  const activeExhibitions = exhibitions.filter(e => e.status === 'active').length;
  const planningExhibitions = exhibitions.filter(e => e.status === 'planning').length;
  const registrationExhibitions = exhibitions.filter(e => e.status === 'registration').length;
  const completedExhibitions = exhibitions.filter(e => e.status === 'completed').length;
  const cancelledExhibitions = exhibitions.filter(e => e.status === 'cancelled').length;
  const totalRevenue = exhibitions.reduce((sum, e) => sum + e.revenue, 0);
  const totalExpectedVisitors = exhibitions.reduce((sum, e) => sum + e.expectedVisitors, 0);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setExhibitions(mockExhibitions);
      setLoading(false);
    }, 1000);
  };

  const handleExport = () => {
    console.log('Exporting exhibitions data...');
  };

  const handleAddExhibition = () => {
    console.log('Adding new exhibition...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Globe className="w-8 h-8 text-blue-600" />
            Exhibitions Management
          </h1>
          <p className="text-gray-600 mt-1">Manage exhibitions, exhibitors, and event logistics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleAddExhibition}>
            <Plus className="w-4 h-4 mr-2" />
            Add Exhibition
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Exhibitions</p>
                <p className="text-2xl font-bold text-gray-900">{totalExhibitions}</p>
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
                <p className="text-2xl font-bold text-green-600">{activeExhibitions}</p>
              </div>
              <Activity className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Planning</p>
                <p className="text-2xl font-bold text-blue-600">{planningExhibitions}</p>
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
                <p className="text-2xl font-bold text-purple-600">{registrationExhibitions}</p>
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
                <p className="text-2xl font-bold text-gray-600">{completedExhibitions}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-red-600">{cancelledExhibitions}</p>
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
                <p className="text-2xl font-bold text-green-600">${totalRevenue.toLocaleString()}</p>
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
                <p className="text-2xl font-bold text-blue-600">{totalExpectedVisitors.toLocaleString()}</p>
              </div>
              <Target className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search exhibitions by name, number, city, theme, or organizer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="registration">Registration Open</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="All Years" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading exhibitions...</p>
          </div>
        </div>
      )}

      {/* Exhibition List - Will be implemented when loading is complete */}
      {!loading && exhibitions.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Exhibitions Found</h3>
            <p className="text-gray-600 mb-4">Get started by creating your first exhibition.</p>
            <Button onClick={handleAddExhibition}>
              <Plus className="w-4 h-4 mr-2" />
              Add Exhibition
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Exhibition Cards - Will show when data is loaded */}
      {!loading && exhibitions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exhibitions.map((exhibition) => (
            <Card key={exhibition.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{exhibition.name}</h3>
                    <p className="text-sm text-gray-600">{exhibition.number}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    exhibition.status === 'active' ? 'bg-green-100 text-green-800' :
                    exhibition.status === 'planning' ? 'bg-blue-100 text-blue-800' :
                    exhibition.status === 'registration' ? 'bg-purple-100 text-purple-800' :
                    exhibition.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {exhibition.status.charAt(0).toUpperCase() + exhibition.status.slice(1)}
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium">City:</span> {exhibition.city}</p>
                  <p><span className="font-medium">Theme:</span> {exhibition.theme}</p>
                  <p><span className="font-medium">Organizer:</span> {exhibition.organizer}</p>
                  <p><span className="font-medium">Date:</span> {exhibition.startDate} - {exhibition.endDate}</p>
                  <p><span className="font-medium">Revenue:</span> ${exhibition.revenue.toLocaleString()}</p>
                  <p><span className="font-medium">Expected Visitors:</span> {exhibition.expectedVisitors.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}