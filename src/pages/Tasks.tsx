import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Tasks() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-text-primary">Task Management</h1>
        <p className="text-text-secondary mt-1">Create, assign, and track tasks across deals, clients, and expos</p>
      </div>
      
      <Card className="enterprise-card">
        <CardHeader>
          <CardTitle>Task Dashboard</CardTitle>
          <CardDescription>Comprehensive task management with priorities and due dates</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-text-secondary">Task management interface will be implemented here...</p>
        </CardContent>
      </Card>
    </div>
  );
}