import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  Building2,
  Users,
  DollarSign,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Globe,
  Star,
  Award,
  Target,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  Edit,
  Share2,
  Download,
  Plus,
  Eye,
  FileText,
  CreditCard,
  Handshake,
  Crown,
  Zap,
  Flag,
  Bookmark,
  Heart,
  MessageSquare,
  Settings,
  Ruler,
  Wifi,
  Car,
  Grid3X3,
  XCircle,
  Loader2
} from 'lucide-react';

// Booth data interface
interface BoothData {
  id: string;
  code: string;
  size_sqm: number;
  price_per_meter: number;
  total_price: number;
  zone: string;
  aisle: string;
  hall: string;
  is_corner: boolean;
  status: 'Available' | 'Reserved' | 'Confirmed' | 'Occupied';
  client?: {
    id: string;
    name: string;
    contact_person: string;
    email: string;
    phone: string;
  };
  expo?: {
    id: string;
    name: string;
    start_date: string;
    end_date: string;
  };
  deal?: {
    id: string;
    title: string;
    value: number;
    status: string;
  };
  features: string[];
  reserved_date?: string;
  confirmed_date?: string;
  setup_date?: string;
  breakdown_date?: string;
  notes?: string;
  analytics: BoothAnalytics;
  timeline: BoothEvent[];
}

interface BoothAnalytics {
  revenue_generated: number;
  visitor_count: number;
  lead_conversions: number;
  satisfaction_score: number;
  utilization_rate: number;
  setup_efficiency: number;
}

interface BoothEvent {
  id: string;
  type: 'reservation' | 'confirmation' | 'setup' | 'event' | 'breakdown';
  title: string;
  description: string;
  date: string;
  user: string;
  status: 'completed' | 'pending' | 'cancelled';
}

const BoothDetail = () => {
  const { boothId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [boothData, setBoothData] = useState<BoothData | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadBoothData();
  }, [boothId]);

  const loadBoothData = async () => {
    setLoading(true);
    try {
      // Mock booth data - replace with actual API call
      const mockBoothData: BoothData = {
        id: boothId || '1',
        code: 'A-101',
        size_sqm: 48,
        price_per_meter: 1200,
        total_price: 57600,
        zone: 'Zone A',
        aisle: 'Main Aisle',
        hall: 'Hall 1',
        is_corner: true,
        status: 'Confirmed',
        client: {
          id: 'client-1',
          name: 'EcoTech Solutions',
          contact_person: 'John Smith',
          email: 'john.smith@ecotech.com',
          phone: '+1 (555) 123-4567'
        },
        expo: {
          id: 'expo-1',
          name: 'Green Life Expo 2024',
          start_date: '2024-03-15',
          end_date: '2024-03-18'
        },
        deal: {
          id: 'deal-1',
          title: 'Main Sponsor Package',
          value: 57600,
          status: 'Closed Won'
        },
        features: ['Power', 'WiFi', 'Corner Location', 'Premium Parking', 'Storage Area', 'Meeting Room Access'],
        reserved_date: '2023-12-15',
        confirmed_date: '2023-12-20',
        setup_date: '2024-03-14',
        breakdown_date: '2024-03-19',
        notes: 'Premium corner booth with excellent visibility. Client requested additional power outlets and WiFi access points.',
        analytics: {
          revenue_generated: 57600,
          visitor_count: 1250,
          lead_conversions: 45,
          satisfaction_score: 4.8,
          utilization_rate: 95,
          setup_efficiency: 92
        },
        timeline: [
          {
            id: '1',
            type: 'confirmation',
            title: 'Booth Confirmed',
            description: 'EcoTech Solutions confirmed booth reservation with full payment',
            date: '2023-12-20T14:30:00Z',
            user: 'Sarah Johnson',
            status: 'completed'
          },
          {
            id: '2',
            type: 'reservation',
            title: 'Booth Reserved',
            description: 'Initial booth reservation with 30% deposit',
            date: '2023-12-15T09:15:00Z',
            user: 'Mike Chen',
            status: 'completed'
          },
          {
            id: '3',
            type: 'setup',
            title: 'Setup Scheduled',
            description: 'Booth setup scheduled for March 14th, 8:00 AM',
            date: '2024-01-10T16:00:00Z',
            user: 'Operations Team',
            status: 'pending'
          }
        ]
      };
      setBoothData(mockBoothData);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load booth data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Available':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Available</Badge>;
      case 'Reserved':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Reserved</Badge>;
      case 'Confirmed':
        return <Badge className="bg-blue-100 text-blue-800"><CheckCircle className="w-3 h-3 mr-1" />Confirmed</Badge>;
      case 'Occupied':
        return <Badge className="bg-purple-100 text-purple-800"><Users className="w-3 h-3 mr-1" />Occupied</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'reservation': return <Bookmark className="w-4 h-4" />;
      case 'confirmation': return <CheckCircle className="w-4 h-4" />;
      case 'setup': return <Settings className="w-4 h-4" />;
      case 'event': return <Calendar className="w-4 h-4" />;
      case 'breakdown': return <XCircle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        </div>
      </div>
    );
  }

  if (!boothData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="p-12 text-center">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Booth Not Found</h3>
              <p className="text-gray-500 mb-4">The requested booth could not be found.</p>
              <Button onClick={() => navigate('/booths')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Booths
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Custom header for booth detail */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/booths')}
                className="flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    Booth {boothData.code}
                  </h1>
                  <div className="flex items-center space-x-3 mt-1">
                    <Badge variant="outline">{boothData.zone}</Badge>
                    {getStatusBadge(boothData.status)}
                    {boothData.is_corner && <Badge className="bg-orange-100 text-orange-800"><Crown className="w-3 h-3 mr-1" />Corner</Badge>}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button>
                <Edit className="w-4 h-4 mr-2" />
                Edit Booth
              </Button>
            </div>
          </div>
        </div>

        {/* Full-width content area */}
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booth Overview */}
            <div className="lg:col-span-2 space-y-6">
              {/* Main Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Ruler className="w-5 h-5" />
                      Booth Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Size</span>
                        <span className="font-semibold">{boothData.size_sqm} sqm</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Hall</span>
                        <span className="font-semibold">{boothData.hall}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Aisle</span>
                        <span className="font-semibold">{boothData.aisle}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price/sqm</span>
                        <span className="font-semibold">{formatCurrency(boothData.price_per_meter)}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Price</span>
                        <span className="font-semibold text-lg">{formatCurrency(boothData.total_price)}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type</span>
                        <span className="font-semibold">{boothData.is_corner ? 'Corner' : 'Standard'}</span>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="font-medium mb-3">Features & Amenities</h4>
                      <div className="flex flex-wrap gap-2">
                        {boothData.features.map((feature, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {boothData.notes && (
                      <div className="mt-6">
                        <h4 className="font-medium mb-2">Notes</h4>
                        <p className="text-gray-600 text-sm">{boothData.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Client Information */}
                {boothData.client && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Client Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Company</span>
                          <span className="font-semibold">{boothData.client.name}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Contact Person</span>
                          <span className="font-semibold">{boothData.client.contact_person}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email</span>
                          <span className="font-semibold">{boothData.client.email}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Phone</span>
                          <span className="font-semibold">{boothData.client.phone}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Status & Dates */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Status & Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Current Status</span>
                        {getStatusBadge(boothData.status)}
                      </div>
                      
                      <hr />
                      {boothData.reserved_date && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Reserved Date</span>
                          <span className="font-semibold">{new Date(boothData.reserved_date).toLocaleDateString()}</span>
                        </div>
                      )}
                      
                      {boothData.confirmed_date && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Confirmed Date</span>
                          <span className="font-semibold">{new Date(boothData.confirmed_date).toLocaleDateString()}</span>
                        </div>
                      )}
                      
                      {boothData.expo && (
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Exhibition</span>
                            <span className="font-semibold">{boothData.expo.name}</span>
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(boothData.expo.start_date).toLocaleDateString()} - {new Date(boothData.expo.end_date).toLocaleDateString()}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Analytics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Performance Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Revenue:</span>
                        <span className="font-semibold text-green-600">
                          {formatCurrency(boothData.analytics.revenue_generated)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Visitors:</span>
                        <span className="font-semibold">
                          {boothData.analytics.visitor_count.toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Lead Conversions:</span>
                        <span className="font-semibold">
                          {boothData.analytics.lead_conversions}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Satisfaction:</span>
                        <span className="font-semibold">
                          {boothData.analytics.satisfaction_score}/5.0
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Utilization:</span>
                        <span className="font-semibold">
                          {boothData.analytics.utilization_rate}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Detailed Tabs */}
            <div className="lg:col-span-1">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Booth Specifications</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Code:</span>
                        <span className="font-medium">{boothData.code}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Size:</span>
                        <span className="font-medium">{boothData.size_sqm} sqm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Zone:</span>
                        <span className="font-medium">{boothData.zone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Hall:</span>
                        <span className="font-medium">{boothData.hall}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Aisle:</span>
                        <span className="font-medium">{boothData.aisle}</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Booth Details
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Users className="w-4 h-4 mr-2" />
                        Assign Client
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule Setup
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="w-4 h-4 mr-2" />
                        Generate Contract
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="timeline" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Activity Timeline</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {boothData.timeline.map((event) => (
                          <div key={event.id} className="flex items-start gap-3 pb-4 border-b last:border-b-0">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                              {getEventIcon(event.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-sm">{event.title}</h4>
                                <span className="text-xs text-gray-500">
                                  {new Date(event.date).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-gray-500">by {event.user}</span>
                                <Badge 
                                  variant={event.status === 'completed' ? 'default' : 
                                          event.status === 'pending' ? 'secondary' : 'destructive'}
                                  className="text-xs"
                                >
                                  {event.status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoothDetail;