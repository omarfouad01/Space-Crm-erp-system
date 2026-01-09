import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2 } from 'lucide-react';

export default function Login() {
  return (
    <div className="min-h-screen bg-app-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md enterprise-card">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-space-blue rounded-lg flex items-center justify-center">
              <Building2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl">SPACE CRM</CardTitle>
          <CardDescription>Expo Management System</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter your email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Enter your password" />
          </div>
          <Button className="w-full bg-space-blue hover:bg-space-blue/90">
            Sign In
          </Button>
          <div className="text-center">
            <Button variant="link" className="text-space-blue">
              Forgot password?
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}