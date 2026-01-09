import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-text-primary">Settings</h1>
        <p className="text-text-secondary mt-1">System configuration and user preferences</p>
      </div>
      
      <Card className="enterprise-card">
        <CardHeader>
          <CardTitle>System Configuration</CardTitle>
          <CardDescription>User preferences, system settings, and admin controls</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-text-secondary">Settings interface will be implemented here...</p>
        </CardContent>
      </Card>
    </div>
  );
}