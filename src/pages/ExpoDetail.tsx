import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Globe,
  Users,
  DollarSign,
  Calendar,
  MapPin,
  Building2,
  Trophy,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  Edit,
  Share2,
  Download,
  Plus,
  FileText,
  BarChart3,
  PieChart,
  Activity,
  TrendingUp,
  Star,
  Award,
  Target,
  Play,
  XCircle,
  Pause,
  Zap,
  ExternalLink,
  User,
  Briefcase,
  Mail,
  Phone,
  Loader2
} from "lucide-react";

interface ExpoData {
  id: string;
  expo_number: string;
  name: string;
  description: string;
  theme?: string;
  start_date: string;
  end_date: string;
  city?: string;
  country?: string;
  venue_name?: string;
  status: 'Planning' | 'Marketing' | 'Registration Open' | 'Active' | 'Completed' | 'Cancelled' | 'Postponed';
  priority: string;
  expected_visitors?: number;
  booth_count?: number;
  budget?: number;
  manager_name?: string;
  organizer_name?: string;
  website_url?: string;
  tags?: string[];
  totalBooths: number;
  bookedBooths: number;
  totalRevenue: number;
  occupancyRate: number;
  sponsors: number;
  attendees: number;
  analytics: ExpoAnalytics;
  timeline: ExpoEvent[];
}

interface ExpoAnalytics {
  total_exhibitors: number;
  total_visitors: number;
  revenue_generated: number;
  satisfaction_score: number;
  lead_conversions: number;
  networking_sessions: number;
}

interface ExpoEvent {
  id: string;
  type: 'planning' | 'setup' | 'opening' | 'event' | 'closing' | 'marketing';
  title: string;
  description: string;
  date: string;
  user: string;
  status: 'completed' | 'pending' | 'cancelled';
}

const ExpoDetail = () => {
  const { expoId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [expoData, setExpoData] = useState<ExpoData | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadExpoData();
  }, [expoId]);

  const loadExpoData = async () => {
    setLoading(true);
    try {
      // Mock expo data - replace with actual API call
      const mockExpoData: ExpoData = {
        id: expoId || '1',
        expo_number: 'EXPO-2026-001',
        name: 'Green Energy Expo 2026',
        description: 'Leading sustainable energy exhibition showcasing the latest innovations in renewable energy, green technology, and environmental solutions. This comprehensive event brings together industry leaders, innovators, and sustainability advocates from around the world.',
        theme: 'Sustainable Future',
        start_date: '2026-03-15',
        end_date: '2026-03-18',
        city: 'Dubai',
        country: 'UAE',
        venue_name: 'Dubai World Trade Centre',
        status: 'Active',
        priority: 'High',
        expected_visitors: 15000,
        booth_count: 150,
        budget: 2500000,
        manager_name: 'Sarah Johnson',
        organizer_name: 'Green Energy Alliance',
        website_url: 'https://greenenergy-expo.com',
        tags: ['renewable', 'sustainability', 'technology', 'innovation'],
        totalBooths: 150,
        bookedBooths: 142,
        totalRevenue: 2840000,
        occupancyRate: 94.7,
        sponsors: 12,
        attendees: 15000,
        analytics: {
          total_exhibitors: 142,
          total_visitors: 15000,
          revenue_generated: 2840000,
          satisfaction_score: 4.6,
          lead_conversions: 1250,
          networking_sessions: 45
        },
        timeline: [
          {
            id: '1',
            type: 'opening',
            title: 'Exhibition Opening Ceremony',
            description: 'Official opening ceremony with keynote speakers from leading renewable energy companies',
            date: '2026-03-15T09:00:00Z',
            user: 'Event Team',
            status: 'completed'
          },
          {
            id: '2',
            type: 'setup',
            title: 'Booth Setup Complete',
            description: 'All 142 exhibitor booths setup and ready for visitors',
            date: '2026-03-14T18:00:00Z',
            user: 'Operations Team',
            status: 'completed'
          },
          {
            id: '3',
            type: 'marketing',
            title: 'Marketing Campaign Launch',
            description: 'Launched comprehensive marketing campaign across digital and traditional channels',
            date: '2026-02-01T10:00:00Z',
            user: 'Marketing Team',
            status: 'completed'
          },
          {
            id: '4',
            type: 'planning',
            title: 'Final Planning Meeting',
            description: 'Last coordination meeting before exhibition start with all stakeholders',
            date: '2026-03-10T14:00:00Z',
            user: 'Sarah Johnson',
            status: 'completed'
          },
          {
            id: '5',
            type: 'event',
            title: 'Sustainability Panel Discussion',
            description: 'Panel discussion on the future of renewable energy with industry experts',
            date: '2026-03-16T14:00:00Z',
            user: 'Program Committee',
            status: 'pending'
          },
          {
            id: '6',
            type: 'closing',
            title: 'Exhibition Closing & Awards',
            description: 'Closing ceremony with innovation awards and networking reception',
            date: '2026-03-18T17:00:00Z',
            user: 'Event Team',
            status: 'pending'
          }
        ]
      };

      setExpoData(mockExpoData);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load exhibition data",
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Planning': { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: <Clock className="w-3 h-3" /> },
      'Marketing': { color: 'bg-orange-100 text-orange-800 border-orange-200', icon: <Zap className="w-3 h-3" /> },
      'Registration Open': { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: <Users className="w-3 h-3" /> },
      'Active': { color: 'bg-green-100 text-green-800 border-green-200', icon: <Play className="w-3 h-3" /> },
      'Completed': { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: <CheckCircle className="w-3 h-3" /> },
      'Cancelled': { color: 'bg-red-100 text-red-800 border-red-200', icon: <XCircle className="w-3 h-3" /> },
      'Postponed': { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: <Pause className="w-3 h-3" /> }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['Planning'];
    
    return (
      <Badge className={`${config.color} border flex items-center gap-1`}>
        {config.icon}
        {status}
      </Badge>
    );
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'planning': return <Target className="w-4 h-4 text-blue-600" />;
      case 'setup': return <Building2 className="w-4 h-4 text-green-600" />;
      case 'opening': return <Play className="w-4 h-4 text-green-600" />;
      case 'event': return <Activity className="w-4 h-4 text-purple-600" />;
      case 'closing': return <CheckCircle className="w-4 h-4 text-gray-600" />;
      case 'marketing': return <Zap className="w-4 h-4 text-orange-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getEventStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/expos')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-9 w-24 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-8 w-1/2 bg-gray-200 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!expoData) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/expos')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <Card>
          <CardContent className="p-8 text-center">
            <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Exhibition Not Found</h3>
            <p className="text-gray-600 mb-4">The requested exhibition could not be found.</p>
            <Button onClick={() => navigate('/expos')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Exhibitions
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/expos')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="flex items-center gap-3">
            <Globe className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{expoData.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">{expoData.venue_name}</span>
                {getStatusBadge(expoData.status)}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Edit Exhibition
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(expoData.analytics.revenue_generated)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Visitors</p>
                <p className="text-2xl font-bold">{expoData.analytics.total_visitors.toLocaleString()}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Lead Conversions</p>
                <p className="text-2xl font-bold">{expoData.analytics.lead_conversions}</p>
              </div>
              <Target className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Networking Sessions</p>
                <p className="text-2xl font-bold">{expoData.analytics.networking_sessions}</p>
              </div>
              <Activity className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Satisfaction Score</p>
                <p className="text-2xl font-bold">{expoData.analytics.satisfaction_score}/5.0</p>
              </div>
              <Star className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sponsors</p>
                <p className="text-2xl font-bold">{expoData.sponsors}</p>
              </div>
              <Award className="w-8 h-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Exhibition Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Exhibition Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                <p className="text-gray-600">{expoData.description}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Start Date</h4>
                  <p className="text-gray-600">{formatDate(expoData.start_date)}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-1">End Date</h4>
                  <p className="text-gray-600">{formatDate(expoData.end_date)}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Duration</h4>
                  <p className="text-gray-600">
                    {Math.ceil((new Date(expoData.end_date).getTime() - new Date(expoData.start_date).getTime()) / (1000 * 60 * 60 * 24))} days
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Venue</h4>
                  <p className="text-gray-600">{expoData.venue_name}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Total Booths</h4>
                  <p className="text-gray-600">{expoData.totalBooths}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Occupancy</h4>
                  <p className="text-gray-600">{expoData.occupancyRate.toFixed(1)}%</p>
                </div>
              </div>

              {/* Tags */}
              {expoData.tags && expoData.tags.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {expoData.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Performance Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Performance Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{expoData.analytics.total_exhibitors}</div>
                  <div className="text-sm text-gray-600">Exhibitors</div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{expoData.analytics.total_visitors.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Visitors</div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{expoData.analytics.lead_conversions}</div>
                  <div className="text-sm text-gray-600">Lead Conversions</div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{expoData.analytics.networking_sessions}</div>
                  <div className="text-sm text-gray-600">Networking Sessions</div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{expoData.analytics.satisfaction_score}/5.0</div>
                  <div className="text-sm text-gray-600">Satisfaction Score</div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">{expoData.sponsors}</div>
                  <div className="text-sm text-gray-600">Sponsors</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar Info */}
        <div className="space-y-6">
          {/* Revenue & Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Revenue & Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{formatCurrency(expoData.totalRevenue)}</div>
                <div className="text-sm text-gray-600">Total Revenue</div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Booth Occupancy:</span>
                  <span className="font-medium">
                    {expoData.bookedBooths} / {expoData.totalBooths}
                  </span>
                </div>
                <Progress value={expoData.occupancyRate} className="h-2" />
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Expected Attendees:</span>
                  <span className="font-medium">{expoData.attendees.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Sponsors:</span>
                  <span className="font-medium">{expoData.sponsors}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Satisfaction:</span>
                  <span className="font-medium">{expoData.analytics.satisfaction_score}/5.0</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exhibition Details */}
          <Card>
            <CardHeader>
              <CardTitle>Exhibition Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Expo Number:</span>
                <Badge variant="outline" className="font-mono text-xs">{expoData.expo_number}</Badge>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                {getStatusBadge(expoData.status)}
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Priority:</span>
                <Badge className={
                  expoData.priority === 'Critical' ? 'bg-red-100 text-red-800 border-red-200' :
                  expoData.priority === 'High' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                  expoData.priority === 'Medium' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                  'bg-gray-100 text-gray-800 border-gray-200'
                }>
                  {expoData.priority}
                </Badge>
              </div>

              {expoData.theme && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Theme:</span>
                  <span className="font-medium">{expoData.theme}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-600">Location:</span>
                <span className="font-medium">{expoData.city}, {expoData.country}</span>
              </div>

              {expoData.manager_name && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Manager:</span>
                  <span className="font-medium">{expoData.manager_name}</span>
                </div>
              )}

              {expoData.organizer_name && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Organizer:</span>
                  <span className="font-medium">{expoData.organizer_name}</span>
                </div>
              )}

              {expoData.website_url && (
                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => window.open(expoData.website_url, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visit Website
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/booths')}>
                <Building2 className="w-4 h-4 mr-2" />
                Manage Booths
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                <Users className="w-4 h-4 mr-2" />
                View Exhibitors
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                <Award className="w-4 h-4 mr-2" />
                Manage Sponsors
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                <FileText className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detailed Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="exhibitors">Exhibitors</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Exhibition Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  {getStatusBadge(expoData.status)}
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Venue:</span>
                  <span className="font-medium">{expoData.venue_name}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">
                    {Math.ceil((new Date(expoData.end_date).getTime() - new Date(expoData.start_date).getTime()) / (1000 * 60 * 60 * 24))} days
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Total Booths:</span>
                  <span className="font-medium">{expoData.totalBooths}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Booked Booths:</span>
                  <span className="font-medium">{expoData.bookedBooths}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Revenue:</span>
                  <span className="font-medium">{formatCurrency(expoData.totalRevenue)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Occupancy Rate:</span>
                  <span className="font-medium">{expoData.occupancyRate.toFixed(1)}%</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Expected Visitors:</span>
                  <span className="font-medium">{expoData.attendees.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Sponsors:</span>
                  <span className="font-medium">{expoData.sponsors}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Satisfaction:</span>
                  <span className="font-medium">{expoData.analytics.satisfaction_score}/5.0</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="exhibitors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Exhibitor Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Exhibitor Directory</h3>
                <p className="text-gray-600 mb-4">
                  Manage exhibitor registrations, booth assignments, and communications
                </p>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Exhibitor
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Exhibition Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expoData.timeline.map((event) => (
                  <div key={event.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0">
                      {getEventIcon(event.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-900">{event.title}</h4>
                        <div className="text-sm text-gray-500">
                          {formatDateTime(event.date)}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{event.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">by {event.user}</span>
                        <Badge className={`${getEventStatusColor(event.status)} border text-xs`}>
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

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold">{formatCurrency(expoData.analytics.revenue_generated)}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Visitors</p>
                    <p className="text-2xl font-bold">{expoData.analytics.total_visitors.toLocaleString()}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Lead Conversions</p>
                    <p className="text-2xl font-bold">{expoData.analytics.lead_conversions}</p>
                  </div>
                  <Target className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Satisfaction Score</p>
                    <p className="text-2xl font-bold">{expoData.analytics.satisfaction_score}/5.0</p>
                  </div>
                  <Star className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Exhibition performance analytics chart will be displayed here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExpoDetail;