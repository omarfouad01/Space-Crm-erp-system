import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HR() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-text-primary">HR & KPIs</h1>
        <p className="text-text-secondary mt-1">Employee performance metrics and team analytics</p>
      </div>
      
      <Card className="enterprise-card">
        <CardHeader>
          <CardTitle>Performance Dashboard</CardTitle>
          <CardDescription>Individual and team KPI tracking with performance analytics</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-text-secondary">HR and KPI dashboard will be implemented here...</p>
        </CardContent>
      </Card>
    </div>
  );
}