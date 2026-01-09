import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  DollarSign,
  Target,
  Users,
  Clock,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertTriangle,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Plus,
  BarChart3,
  Activity,
  Calendar,
  FileText,
  ArrowUpRight
} from 'lucide-react';

const Index = () => {
  // Mock data for dashboard metrics
  const metrics = {
    totalRevenue: 0,
    activeDeals: 2,
    activeClients: 8,
    paymentsDue: 0
  };

  // Deal stages data
  const dealStages = [
    { name: 'Talking', deals: 0, value: 0 },
    { name: 'Meeting Scheduled', deals: 0, value: 0 },
    { name: 'Proposal', deals: 0, value: 0 },
    { name: 'Negotiation', deals: 0, value: 0 },
    { name: 'Contract', deals: 0, value: 0 },
    { name: 'Closed Won', deals: 0, value: 0 },
    { name: 'Closed Lost', deals: 0, value: 0 },
    { name: 'Canceled', deals: 0, value: 0 }
  ];

  // Upcoming reminders
  const reminders = [
    {
      id: 1,
      title: 'Payment Due - EcoTech Solutions',
      description: '$50,000 final payment due in 2 days',
      dueDate: '1/17/2024',
      type: 'payment',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Client Meeting - Solar Dynamics',
      description: 'Quarterly review meeting tomorrow at 2:00 PM',
      dueDate: '1/16/2024',
      type: 'meeting',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Proposal Deadline',
      description: 'Submit WindPower Solutions proposal by Friday',
      dueDate: '1/19/2024',
      type: 'proposal',
      priority: 'medium'
    }
  ];

  // Team performance data
  const teamPerformance = [
    {
      name: 'Sarah Johnson',
      role: 'Senior Sales Manager',
      revenue: 485000,
      deals: 12,
      percentage: 97,
      trend: 'up'
    },
    {
      name: 'Mike Chen',
      role: 'Sales Executive',
      revenue: 320000,
      deals: 8,
      percentage: 91,
      trend: 'up'
    },
    {
      name: 'Alex Rivera',
      role: 'Account Manager',
      revenue: 275000,
      deals: 15,
      percentage: 92,
      trend: 'stable'
    },
    {
      name: 'Emma Davis',
      role: 'Business Development',
      revenue: 180000,
      deals: 6,
      percentage: 72,
      trend: 'down'
    }
  ];

  // Recent activity data
  const recentActivity = [
    {
      id: 1,
      title: 'Deal Closed Won',
      description: 'EcoTech Solutions - Premium Sponsorship Package',
      type: 'deal',
      status: 'Closed Won',
      user: 'Sarah Johnson',
      date: '1/15/2024'
    },
    {
      id: 2,
      title: 'Payment Received',
      description: '$125,000 payment for Green Energy Expo sponsorship',
      type: 'payment',
      status: 'Completed',
      user: 'Finance Team',
      date: '1/15/2024'
    },
    {
      id: 3,
      title: 'New Client Onboarded',
      description: 'WindPower Solutions joined as Premium Exhibitor',
      type: 'client',
      status: 'Active',
      user: 'Mike Chen',
      date: '1/15/2024'
    },
    {
      id: 4,
      title: 'Strategy Meeting Completed',
      description: 'Quarterly planning session with Green Alliance',
      type: 'meeting',
      status: 'Completed',
      user: 'Team Lead',
      date: '1/14/2024'
    },
    {
      id: 5,
      title: 'Proposal Submitted',
      description: 'Custom exhibition package for CleanTech Innovations',
      type: 'proposal',
      status: 'In Progress',
      user: 'Alex Rivera',
      date: '1/14/2024'
    }
  ];

  const getIconForActivityType = (type: string) => {
    switch (type) {
      case 'deal':
        return <Target className="w-4 h-4" />;
      case 'payment':
        return <DollarSign className="w-4 h-4" />;
      case 'client':
        return <Users className="w-4 h-4" />;
      case 'meeting':
        return <Calendar className="w-4 h-4" />;
      case 'proposal':
        return <FileText className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getIconColorForActivityType = (type: string) => {
    switch (type) {
      case 'deal':
        return 'text-error-soft';
      case 'payment':
        return 'text-warning-soft';
      case 'client':
        return 'text-warning-soft';
      case 'meeting':
        return 'text-success-soft';
      case 'proposal':
        return 'text-warning-soft';
      default:
        return 'text-primary';
    }
  };

  const getBgColorForActivityType = (type: string) => {
    switch (type) {
      case 'deal':
        return 'bg-surface-primary';
      case 'payment':
        return 'bg-surface-primary';
      case 'client':
        return 'bg-surface-primary';
      case 'meeting':
        return 'bg-surface-primary';
      case 'proposal':
        return 'bg-surface-primary';
      default:
        return 'bg-surface-primary';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-success-soft" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-error-soft" />;
      case 'stable':
        return <ArrowUpRight className="w-4 h-4 text-info-soft" />;
      default:
        return <TrendingUp className="w-4 h-4 text-success-soft" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Executive Dashboard</h1>
          <p className="text-gray-600 mt-2">Real-time insights and performance metrics for SPACE Organizing</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <Card className="card-enhanced">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">${metrics.totalRevenue}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-50">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <TrendingUp className="w-4 h-4 mr-1 text-green-600" />
              <span className="text-sm font-medium text-green-600">+12.5% this month</span>
            </div>
            {/* Progress bar */}
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Monthly: ${metrics.totalRevenue}</span>
                <span>Target: $0</span>
              </div>
              <Progress value={0} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Active Deals */}
        <Card className="card-enhanced">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Deals</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{metrics.activeDeals}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <CheckCircle className="w-4 h-4 mr-1 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">0 won (0.0% rate)</span>
            </div>
            {/* Deal stats */}
            <div className="mt-3 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-600">Total: </span>
                <span className="text-gray-900 font-medium">{metrics.activeDeals}</span>
              </div>
              <div>
                <span className="text-gray-600">Won: </span>
                <span className="text-gray-900 font-medium">0</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Clients */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Clients</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{metrics.activeClients}</p>
              </div>
              <div className="p-3 rounded-lg bg-surface-tertiary">
                <Users className="w-6 h-6 text-space-cyan" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <TrendingUp className="w-4 h-4 mr-1 text-green-600" />
              <span className="text-sm font-medium text-green-600">+8 new this month</span>
            </div>
            {/* Client stats */}
            <div className="mt-3 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-600">Total: </span>
                <span className="text-gray-900 font-medium">{metrics.activeClients}</span>
              </div>
              <div>
                <span className="text-gray-600">Retention: </span>
                <span className="text-gray-900 font-medium">94.2%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payments Due */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Payments Due</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">${metrics.paymentsDue}</p>
              </div>
              <div className="p-3 rounded-lg bg-surface-tertiary">
                <Clock className="w-6 h-6 text-warning-soft" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <AlertTriangle className="w-4 h-4 mr-1 text-error-soft" />
              <span className="text-sm font-medium text-red-600">0 overdue</span>
            </div>
            {/* Payment stats */}
            <div className="mt-3 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-600">Collected: </span>
                <span className="text-gray-900 font-medium">${metrics.paymentsDue}</span>
              </div>
              <div>
                <span className="text-gray-600">Next Week: </span>
                <span className="text-gray-900 font-medium">$0</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Pipeline */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900">Sales Pipeline</CardTitle>
                  <CardDescription>Deal progression through stages</CardDescription>
                </div>
                <Button variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dealStages.map((stage, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-surface-tertiary">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{stage.name}</p>
                        <p className="text-xs text-gray-600">{stage.deals} deals</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-body font-medium text-primary">${stage.value}</p>
                      <p className="text-caption text-secondary">Total value</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Reminders */}
        <div>
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-heading-2">Upcoming Reminders</CardTitle>
                  <CardDescription>Critical deadlines and events</CardDescription>
                </div>
                <Button variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reminders.map((reminder) => (
                  <div key={reminder.id} className="flex items-start gap-3 p-3 rounded-lg bg-surface-tertiary">
                    <div className={`p-2 rounded-md ${
                      reminder.type === 'payment' ? 'bg-red-100 text-error-soft' :
                      reminder.type === 'meeting' ? 'bg-yellow-100 text-warning-soft' :
                      'bg-yellow-100 text-warning-soft'
                    }`}>
                      {reminder.type === 'payment' && <DollarSign className="w-4 h-4" />}
                      {reminder.type === 'meeting' && <Calendar className="w-4 h-4" />}
                      {reminder.type === 'proposal' && <FileText className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-body-sm font-medium text-primary">{reminder.title}</p>
                      <p className="text-caption text-secondary mt-1">{reminder.description}</p>
                      <p className="text-caption text-tertiary mt-1">Due: {reminder.dueDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Team Performance */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-heading-2">Team Performance</CardTitle>
                <CardDescription>Individual targets and achievements</CardDescription>
              </div>
              <Button variant="outline">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamPerformance.map((member, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-surface-tertiary">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-space-cyan text-white flex items-center justify-center text-sm font-medium">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-body font-medium text-primary">{member.name}</p>
                      <p className="text-caption text-secondary">{member.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {getTrendIcon(member.trend)}
                  </div>
                  <div className="text-right">
                    <p className="text-body-sm font-medium text-primary">${member.revenue.toLocaleString()}</p>
                    <p className="text-caption text-secondary">{member.deals} deals • {member.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-heading-2">Recent Activity</CardTitle>
                <CardDescription>Latest updates and changes</CardDescription>
              </div>
              <Button variant="outline">
                <Activity className="w-4 h-4 mr-2" />
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-surface-tertiary">
                  <div className={`p-2 rounded-md ${getBgColorForActivityType(activity.type)} ${getIconColorForActivityType(activity.type)}`}>
                    {getIconForActivityType(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-body-sm font-medium text-primary">{activity.title}</p>
                    <p className="text-caption text-secondary mt-1">{activity.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">{activity.status}</Badge>
                      <span className="text-caption text-tertiary">by {activity.user} • {activity.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
