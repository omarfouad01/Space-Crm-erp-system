import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from '@/integrations/supabase/client';
import { userService } from "@/services/supabaseService";
import { useToast } from "@/hooks/use-toast";
import { TestTube, CheckCircle, XCircle, AlertTriangle, RefreshCw } from "lucide-react";

const PasswordTest = () => {
  const { toast } = useToast();
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [testUserId, setTestUserId] = useState('');

  const addResult = (test: string, result: any, success: boolean = true) => {
    setTestResults(prev => [...prev, {
      test,
      result: JSON.stringify(result, null, 2),
      success,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const testDirectTableAccess = async () => {
    try {
      console.log('🧪 Testing direct table access...');
      
      const { data, error } = await supabase
        .from('user_credentials_2026_01_10_17_00')
        .select('*')
        .limit(5);
      
      if (error) {
        addResult('Direct Table Access', { error: error.message, code: error.code }, false);
      } else {
        addResult('Direct Table Access', { success: true, count: data?.length, sample: data?.[0] });
      }
    } catch (err) {
      addResult('Direct Table Access', { error: err.message }, false);
    }
  };

  const testUserServiceUpdate = async () => {
    if (!testUserId) {
      addResult('UserService Update', { error: 'Please enter a user ID' }, false);
      return;
    }
    try {
      console.log('🧪 Testing userService.updatePassword...');
      
      const result = await userService.updatePassword(testUserId, 'testpass123');
      addResult('UserService Update', { success: true, result });
    } catch (err) {
      addResult('UserService Update', { 
        error: err.message, 
        code: err.code,
        details: err.details,
        hint: err.hint 
      }, false);
    }
  };

  const testTableExists = async () => {
    try {
      console.log('🧪 Testing if table exists...');
      
      // Try alternative method
      const { data, error } = await supabase
        .from('user_credentials_2026_01_10_17_00')
        .select('count(*)', { count: 'exact', head: true });
      
      if (error) {
        addResult('Table Exists Check', { error: error.message, code: error.code }, false);
      } else {
        addResult('Table Exists Check', { exists: true, method: 'count query' });
      }
    } catch (err) {
      addResult('Table Exists Check', { error: err.message }, false);
    }
  };

  const getUsersForTesting = async () => {
    try {
      console.log('🧪 Getting users for testing...');
      
      const { data, error } = await supabase
        .from('users_2026_01_10_17_00')
        .select('id, email, full_name')
        .limit(3);
      
      if (error) {
        addResult('Get Users', { error: error.message }, false);
      } else {
        addResult('Get Users', { users: data });
      }
    } catch (err) {
      addResult('Get Users', { error: err.message }, false);
    }
  };

  const runAllTests = async () => {
    setLoading(true);
    setTestResults([]);
    
    await testTableExists();
    await testDirectTableAccess();
    await getUsersForTesting();
    
    setLoading(false);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <TestTube className="w-8 h-8 text-purple-600" />
            Password Management Debug Tool
          </h1>
          <p className="text-gray-600 mt-1">
            Debug and test password management functionality
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Test Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <Button 
              onClick={runAllTests}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Running Tests...' : 'Run All Tests'}
            </Button>
            <Button onClick={testTableExists} variant="outline">
              Check Table Exists
            </Button>
            <Button onClick={testDirectTableAccess} variant="outline">
              Test Direct Access
            </Button>
            <Button onClick={getUsersForTesting} variant="outline">
              Get Users
            </Button>
            <Button onClick={clearResults} variant="outline">
              Clear Results
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="testUserId">User ID for Testing:</Label>
            <Input
              id="testUserId"
              value={testUserId}
              onChange={(e) => setTestUserId(e.target.value)}
              placeholder="Enter user ID"
              className="max-w-xs"
            />
            <Button onClick={testUserServiceUpdate} variant="outline">
              Test Password Update
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {testResults.map((result, index) => (
              <Card key={index} className={`border-l-4 ${result.success ? 'border-l-green-500' : 'border-l-red-500'}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      {result.success ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                      {result.test}
                    </CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {result.timestamp}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto">
                    {result.result}
                  </pre>
                </CardContent>
              </Card>
            ))}
          </div>

          {testResults.length === 0 && (
            <div className="text-center py-8">
              <TestTube className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                No test results yet. Click "Run All Tests" to start debugging.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PasswordTest;