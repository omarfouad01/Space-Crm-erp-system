import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Expos() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-text-primary">Expo Management</h1>
        <p className="text-text-secondary mt-1">Manage multiple exhibitions with hall and booth allocation</p>
      </div>
      
      <Card className="enterprise-card">
        <CardHeader>
          <CardTitle>Multi-Expo Dashboard</CardTitle>
          <CardDescription>Green Life Expo and future exhibitions management</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-text-secondary">Expo management interface will be implemented here...</p>
        </CardContent>
      </Card>
    </div>
  );
}