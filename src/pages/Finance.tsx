import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, Calendar, Users } from 'lucide-react';

export default function Finance() {
  const financialSummary = {
    expectedRevenue: 2500000,
    receivedRevenue: 1875000,
    upcomingPayments: 450000,
    overduePayments: 75000,
    totalCommissions: 187500,
    paidCommissions: 140625,
  };

  const collectionRate = (financialSummary.receivedRevenue / financialSummary.expectedRevenue) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-text-primary">Finance & Payments</h1>
        <p className="text-text-secondary mt-1">
          Track payments, commissions, and financial performance across all deals
        </p>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="enterprise-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">Expected Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-space-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-text-primary finance-number">
              ${financialSummary.expectedRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-text-secondary">This fiscal year</p>
          </CardContent>
        </Card>

        <Card className="enterprise-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">Received Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-status-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-text-primary finance-number">
              ${financialSummary.receivedRevenue.toLocaleString()}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Progress value={collectionRate} className="h-2 flex-1" />
              <span className="text-xs font-medium">{Math.round(collectionRate)}%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="enterprise-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">Upcoming Payments</CardTitle>
            <Calendar className="h-4 w-4 text-space-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-text-primary finance-number">
              ${financialSummary.upcomingPayments.toLocaleString()}
            </div>
            <p className="text-xs text-text-secondary">Next 30 days</p>
          </CardContent>
        </Card>

        <Card className="enterprise-card border-l-4 border-l-status-warning">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">Overdue Payments</CardTitle>
            <Badge className="bg-status-warning/10 text-status-warning">
              ${financialSummary.overduePayments.toLocaleString()}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-status-warning finance-number">
              ${financialSummary.overduePayments.toLocaleString()}
            </div>
            <p className="text-xs text-text-secondary">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Plans & Commission System */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="enterprise-card">
          <CardHeader>
            <CardTitle>Default Payment Plan</CardTitle>
            <CardDescription>Standard payment structure for all deals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Upfront Payment</span>
              <Badge className="bg-space-blue/10 text-space-blue">30%</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">After 6 Months</span>
              <Badge className="bg-space-blue/10 text-space-blue">40%</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">After 9 Months</span>
              <Badge className="bg-space-blue/10 text-space-blue">30%</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="enterprise-card">
          <CardHeader>
            <CardTitle>Commission Overview</CardTitle>
            <CardDescription>Commission tracking and payments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Total Commissions</span>
              <span className="font-semibold finance-number">
                ${financialSummary.totalCommissions.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Paid Commissions</span>
              <span className="font-semibold text-status-success finance-number">
                ${financialSummary.paidCommissions.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Pending Commissions</span>
              <span className="font-semibold text-status-warning finance-number">
                ${(financialSummary.totalCommissions - financialSummary.paidCommissions).toLocaleString()}
              </span>
            </div>
            <Progress 
              value={(financialSummary.paidCommissions / financialSummary.totalCommissions) * 100} 
              className="h-2" 
            />
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 gap-6">
        <Card className="enterprise-card">
          <CardHeader>
            <CardTitle>Payment Tracking</CardTitle>
            <CardDescription>Detailed payment schedules and status</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-text-secondary">Payment tracking table will be implemented here...</p>
          </CardContent>
        </Card>

        <Card className="enterprise-card">
          <CardHeader>
            <CardTitle>Commission Dashboard</CardTitle>
            <CardDescription>Individual and team commission performance</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-text-secondary">Commission dashboard will be implemented here...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}