import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Key, User, Mail, CheckCircle, AlertTriangle, Shield } from "lucide-react";

const PasswordSetup = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const createCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate inputs
      if (!credentials.email || !credentials.password) {
        toast({
          title: "Validation Error",
          description: "Please fill in all fields",
          variant: "destructive",
        });
        return;
      }

      if (credentials.password.length < 6) {
        toast({
          title: "Validation Error",
          description: "Password must be at least 6 characters long",
          variant: "destructive",
        });
        return;
      }

      if (credentials.password !== credentials.confirmPassword) {
        toast({
          title: "Validation Error",
          description: "Passwords do not match",
          variant: "destructive",
        });
        return;
      }

      console.log('🔐 PasswordSetup: Creating credentials for:', credentials.email);

      // Insert or update credentials directly
      const { data, error } = await supabase
        .from('user_credentials_2026_01_10_17_00')
        .upsert({
          email: credentials.email,
          password_hash: credentials.password,
          is_active: true,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('🚨 PasswordSetup: Error:', error);
        toast({
          title: "Error",
          description: `Failed to create credentials: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      console.log('✅ PasswordSetup: Credentials created successfully:', data);
      toast({
        title: "Credentials Created Successfully!",
        description: `You can now login with ${credentials.email}`,
      });

      // Reset form
      setCredentials({
        email: '',
        password: '',
        confirmPassword: ''
      });
    } catch (error: any) {
      console.error('🚨 PasswordSetup: Unexpected error:', error);
      toast({
        title: "Unexpected Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testExistingCredentials = async () => {
    setLoading(true);
    try {
      console.log('🧪 Testing existing credentials...');
      const { data, error } = await supabase
        .from('user_credentials_2026_01_10_17_00')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('🚨 Test error:', error);
        toast({
          title: "Test Failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      console.log('✅ Existing credentials:', data);
      toast({
        title: "Test Successful",
        description: `Found ${data?.length || 0} existing credentials. Check console for details.`,
      });
    } catch (error: any) {
      console.error('🚨 Test error:', error);
      toast({
        title: "Test Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Key className="w-8 h-8 text-blue-600" />
            Password Setup - No Login Required
          </h1>
          <p className="text-gray-600 mt-1">
            Create your own login credentials to access the system
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Test Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              Test Database Access
            </CardTitle>
            <CardDescription>
              First, test if you can access the credentials table
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={testExistingCredentials}
              disabled={loading}
              variant="outline"
            >
              {loading ? 'Testing...' : 'Test Database Access'}
            </Button>
          </CardContent>
        </Card>

        {/* Create Credentials Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Create Login Credentials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={createCredentials} className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    value={credentials.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="your.email@company.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="password"
                    type="password"
                    value={credentials.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    placeholder="Enter password (min 6 characters)"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={credentials.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    placeholder="Confirm password"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Creating Credentials...' : 'Create My Credentials'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Success Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              After Creating Credentials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                <span>Your credentials will be saved to the database</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                <span>Go to the User Management page</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                <span>Use the "Change Password" feature to update any user passwords</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                <span>Re-enable authentication when ready</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Links */}
        <div className="flex gap-4 justify-center">
          <Button 
            onClick={() => window.location.href = '#/users'}
            variant="outline"
          >
            <Shield className="w-4 h-4 mr-2" />
            Go to User Management
          </Button>
          <Button 
            onClick={() => window.location.href = '#/'}
            variant="outline"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PasswordSetup;