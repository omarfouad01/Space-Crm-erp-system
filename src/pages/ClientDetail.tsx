import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  DollarSign,
  FileText,
  Ticket,
  Activity
} from 'lucide-react';

export default function ClientDetail() {
  const { id } = useParams();

  // Mock client data
  const client = {
    id: '1',
    company_name: 'Green Tech Solutions',
    client_type: 'exhibitor',
    industry: 'Renewable Energy',
    country: 'United States',
    primary_contact: {
      name: 'John Smith',
      email: 'john@greentech.com',
      phone: '+1-555-0123',
      position: 'CEO'
    },
    created_at: '2025-12-01',
    status: 'active'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-space-blue/10 rounded-lg flex items-center justify-center">
            <Building2 className="w-8 h-8 text-space-blue" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-text-primary">{client.company_name}</h1>
            <div className="flex items-center gap-4 mt-2">
              <Badge className="bg-blue-100 text-blue-800">
                {client.client_type.replace('_', ' ')}
              </Badge>
              <span className="text-text-secondary">{client.industry}</span>
              <span className="text-text-secondary flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {client.country}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">Edit Client</Button>
          <Button className="bg-space-blue hover:bg-space-blue/90">Create Deal</Button>
        </div>
      </div>

      {/* Client Details Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="deals">Deals</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Contact Information */}
            <Card className="enterprise-card">
              <CardHeader>
                <CardTitle>Primary Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-text-primary">{client.primary_contact.name}</h4>
                  <p className="text-sm text-text-secondary">{client.primary_contact.position}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-text-secondary" />
                    <span className="text-sm">{client.primary_contact.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-text-secondary" />
                    <span className="text-sm">{client.primary_contact.phone}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="enterprise-card">
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Active Deals</span>
                  <Badge variant="outline">2</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Total Value</span>
                  <span className="font-semibold finance-number">$125,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Last Activity</span>
                  <span className="text-sm">2026-01-08</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="enterprise-card">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-space-blue rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Deal updated</p>
                      <p className="text-xs text-text-secondary">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-status-success rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Payment received</p>
                      <p className="text-xs text-text-secondary">1 day ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="deals">
          <Card className="enterprise-card">
            <CardHeader>
              <CardTitle>Client Deals</CardTitle>
              <CardDescription>All deals associated with this client</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-text-secondary">Deal management interface would be here...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card className="enterprise-card">
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>Payment records and upcoming payments</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-text-secondary">Payment tracking interface would be here...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card className="enterprise-card">
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>Proposals, contracts, and other documents</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-text-secondary">Document management interface would be here...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tickets">
          <Card className="enterprise-card">
            <CardHeader>
              <CardTitle>Support Tickets</CardTitle>
              <CardDescription>Client support requests and issues</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-text-secondary">Ticket management interface would be here...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card className="enterprise-card">
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
              <CardDescription>Complete activity history for this client</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-text-secondary">Activity timeline would be here...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}