import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  Handshake,
  DollarSign,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Building2,
  Target,
} from 'lucide-react';

export default function Dashboard() {
  // Enhanced mock data with growth metrics
  const stats = {
    totalClients: 247,
    clientsGrowth: 12,
    activeDeals: 89,
    dealsGrowth: 8,
    monthlyRevenue: 1250000,
    revenueGrowth: 15,
    upcomingPayments: 450000,
    tasksOverdue: 12,
    ticketsOpen: 8,
    conversionRate: 68,
    avgDealSize: 42500,
  };

  const recentDeals = [
    {
      id: '1',
      client: 'Green Tech Solutions',
      value: 45000,
      stage: 'terms_finalized',
      probability: 90,
      salesperson: 'Sarah Johnson',
    },
    {
      id: '2',
      client: 'EcoLife Industries',
      value: 78000,
      stage: 'strategy_proposal',
      probability: 65,
      salesperson: 'Mike Chen',
    },
    {
      id: '3',
      client: 'Sustainable Future Corp',
      value: 32000,
      stage: 'meeting_scheduled',
      probability: 40,
      salesperson: 'Emma Davis',
    },
  ];

  const upcomingTasks = [
    {
      id: '1',
      title: 'Follow up with Green Tech Solutions',
      dueDate: '2026-01-10',
      priority: 'high',
      assignee: 'Sarah Johnson',
    },
    {
      id: '2',
      title: 'Prepare proposal for EcoLife Industries',
      dueDate: '2026-01-11',
      priority: 'medium',
      assignee: 'Mike Chen',
    },
    {
      id: '3',
      title: 'Contract review meeting',
      dueDate: '2026-01-12',
      priority: 'high',
      assignee: 'Emma Davis',
    },
  ];

  const getStageColor = (stage: string) => {
    const colors = {
      lead_created: 'bg-gray-100 text-gray-800',
      talking: 'bg-blue-100 text-blue-800',
      meeting_scheduled: 'bg-yellow-100 text-yellow-800',
      strategy_proposal: 'bg-purple-100 text-purple-800',
      objection_handling: 'bg-orange-100 text-orange-800',
      terms_finalized: 'bg-green-100 text-green-800',
      closed_won: 'bg-emerald-100 text-emerald-800',
      closed_lost: 'bg-red-100 text-red-800',
    };
    return colors[stage as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800',
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="section-spacing fade-in">
      {/* Enhanced Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-space-blue to-space-blue/80 rounded-xl flex items-center justify-center shadow-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-text-primary tracking-tight">Dashboard</h1>
              <p className="text-text-secondary text-lg">
                Welcome back! Here's your expo management overview.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <Badge className="bg-status-success/10 text-status-success border-status-success/20">
              Green Life Expo 2026 Active
            </Badge>
            <span className="text-sm text-text-secondary">Last updated: 2 minutes ago</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="btn-secondary">
            <Calendar className="w-4 h-4 mr-2" />
            This Month
          </Button>
          <Button className="btn-primary">
            <Target className="w-4 h-4 mr-2" />
            View Goals
          </Button>
        </div>
      </div>

      {/* Enhanced Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="metric-card-primary group hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <div>
              <CardTitle className="text-sm font-semibold text-text-secondary uppercase tracking-wide">Total Clients</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <div className="finance-large text-text-primary">{stats.totalClients}</div>
                <Badge className="status-success text-xs">
                  +{stats.clientsGrowth}%
                </Badge>
              </div>
            </div>
            <div className="w-12 h-12 bg-space-blue/10 rounded-xl flex items-center justify-center group-hover:bg-space-blue/20 transition-colors">
              <Users className="h-6 w-6 text-space-blue" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <TrendingUp className="w-4 h-4 text-status-success" />
              <span>+{stats.clientsGrowth}% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card group hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <div>
              <CardTitle className="text-sm font-semibold text-text-secondary uppercase tracking-wide">Active Deals</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <div className="finance-large text-text-primary">{stats.activeDeals}</div>
                <Badge className="status-success text-xs">
                  +{stats.dealsGrowth}%
                </Badge>
              </div>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-200 transition-colors">
              <Handshake className="h-6 w-6 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <TrendingUp className="w-4 h-4 text-status-success" />
              <span>+{stats.dealsGrowth}% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="enterprise-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-space-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-text-primary finance-number">
              ${stats.monthlyRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-status-success">
              <TrendingUp className="inline w-3 h-3 mr-1" />
              +15% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="enterprise-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">Upcoming Payments</CardTitle>
            <Target className="h-4 w-4 text-space-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-text-primary finance-number">
              ${stats.upcomingPayments.toLocaleString()}
            </div>
            <p className="text-xs text-text-secondary">Next 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="enterprise-card border-l-4 border-l-status-warning">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-status-warning" />
              Attention Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Overdue Tasks</span>
              <Badge className="bg-status-warning/10 text-status-warning">{stats.tasksOverdue}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Open Tickets</span>
              <Badge className="bg-status-info/10 text-status-info">{stats.ticketsOpen}</Badge>
            </div>
            <Button variant="outline" size="sm" className="w-full mt-3">
              View All Issues
            </Button>
          </CardContent>
        </Card>

        <Card className="enterprise-card border-l-4 border-l-status-success">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-status-success" />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Deals Closed This Week</span>
              <Badge className="bg-status-success/10 text-status-success">7</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Payments Collected</span>
              <Badge className="bg-status-success/10 text-status-success">$125K</Badge>
            </div>
            <Button variant="outline" size="sm" className="w-full mt-3">
              View Performance
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Deals & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Deals */}
        <Card className="enterprise-card">
          <CardHeader>
            <CardTitle className="text-lg">Recent Deals</CardTitle>
            <CardDescription>Latest deals in your pipeline</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDeals.map((deal) => (
                <div key={deal.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-text-primary">{deal.client}</h4>
                    <p className="text-sm text-text-secondary">{deal.salesperson}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-text-primary finance-number">
                      ${deal.value.toLocaleString()}
                    </p>
                    <Badge className={getStageColor(deal.stage)} variant="secondary">
                      {deal.stage.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="ml-4">
                    <div className="w-16">
                      <Progress value={deal.probability} className="h-2" />
                    </div>
                    <p className="text-xs text-text-secondary mt-1">{deal.probability}%</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Deals
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card className="enterprise-card">
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Tasks</CardTitle>
            <CardDescription>Tasks requiring your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-text-primary">{task.title}</h4>
                    <p className="text-sm text-text-secondary">{task.assignee}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-text-secondary" />
                      <span className="text-sm text-text-secondary">{task.dueDate}</span>
                    </div>
                    <Badge className={getPriorityColor(task.priority)} variant="secondary">
                      {task.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Tasks
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}