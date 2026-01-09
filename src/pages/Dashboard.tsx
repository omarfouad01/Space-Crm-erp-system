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
  // Mock data - in real app this would come from API
  const stats = {
    totalClients: 247,
    activeDeals: 89,
    monthlyRevenue: 1250000,
    upcomingPayments: 450000,
    tasksOverdue: 12,
    ticketsOpen: 8,
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-text-primary">Dashboard</h1>
          <p className="text-text-secondary mt-1">
            Welcome back! Here's what's happening with your expo management.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-border-neutral">
            <Calendar className="w-4 h-4 mr-2" />
            This Month
          </Button>
          <Button className="bg-space-blue hover:bg-space-blue/90">
            <Building2 className="w-4 h-4 mr-2" />
            Green Life Expo 2026
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="enterprise-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-space-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-text-primary finance-number">{stats.totalClients}</div>
            <p className="text-xs text-status-success">
              <TrendingUp className="inline w-3 h-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="enterprise-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">Active Deals</CardTitle>
            <Handshake className="h-4 w-4 text-space-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-text-primary finance-number">{stats.activeDeals}</div>
            <p className="text-xs text-status-success">
              <TrendingUp className="inline w-3 h-3 mr-1" />
              +8% from last month
            </p>
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