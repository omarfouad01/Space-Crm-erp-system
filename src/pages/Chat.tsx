import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Chat() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-text-primary">Internal Chat</h1>
        <p className="text-text-secondary mt-1">Team communication with contextual chat linked to deals and clients</p>
      </div>
      
      <Card className="enterprise-card">
        <CardHeader>
          <CardTitle>Communication Hub</CardTitle>
          <CardDescription>1:1 chat, group chat, and contextual conversations</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-text-secondary">Internal chat system will be implemented here...</p>
        </CardContent>
      </Card>
    </div>
  );
}