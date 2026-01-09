import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, FileText, DollarSign, Upload, Headphones } from 'lucide-react';

function ClientPortalDashboard() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-space-blue rounded-lg flex items-center justify-center">
            <Building2 className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-semibold text-text-primary">Welcome to SPACE Client Portal</h1>
        <p className="text-text-secondary mt-2">Green Life Expo 2026 - Exhibitor Portal</p>
      </div>

      <Tabs defaultValue="proposals" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="proposals">Proposals</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
        </TabsList>

        <TabsContent value="proposals">
          <Card className="enterprise-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Proposals & Quotations
              </CardTitle>
              <CardDescription>View and respond to proposals from SPACE Organizing</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-text-secondary">Your proposals will appear here...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contracts">
          <Card className="enterprise-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Contracts & E-Signature
              </CardTitle>
              <CardDescription>Review and sign contracts electronically</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-text-secondary">Your contracts will appear here...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card className="enterprise-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Payment Schedule
              </CardTitle>
              <CardDescription>View payment schedules and make payments</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-text-secondary">Your payment information will appear here...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card className="enterprise-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Document Upload
              </CardTitle>
              <CardDescription>Upload required documents and files</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-text-secondary">Document upload interface will be here...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="support">
          <Card className="enterprise-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Headphones className="w-5 h-5" />
                Support Tickets
              </CardTitle>
              <CardDescription>Submit support requests and track their status</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-text-secondary">Support ticket system will be here...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ClientPortalLogin() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-space-blue rounded-lg flex items-center justify-center">
              <Building2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl">Client Portal</CardTitle>
          <CardDescription>SPACE Organizing - Green Life Expo 2026</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-text-secondary text-center">Client portal login will be implemented here...</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ClientPortal() {
  // Mock authentication - in real app this would be proper client auth
  const isClientAuthenticated = true;

  return (
    <div className="min-h-screen bg-white">
      {isClientAuthenticated ? (
        <div className="container mx-auto p-6">
          <Routes>
            <Route path="/" element={<ClientPortalDashboard />} />
            <Route path="/dashboard" element={<ClientPortalDashboard />} />
            <Route path="*" element={<ClientPortalDashboard />} />
          </Routes>
        </div>
      ) : (
        <ClientPortalLogin />
      )}
    </div>
  );
}