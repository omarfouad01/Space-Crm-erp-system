import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCurrency, SUPPORTED_CURRENCIES } from "@/contexts/CurrencyContext";
import { settingsService } from "@/services/supabaseService";
import {
  Settings,
  Save,
  RefreshCw,
  Database,
  Mail,
  Bell,
  Shield,
  Palette,
  Globe,
  Users,
  Key,
  Server,
  Monitor,
  Smartphone,
} from "lucide-react";

const SettingsPage = () => {
  const { toast } = useToast();
  const { currency: currentCurrency, setCurrency: setSystemCurrency } = useCurrency();
  const [companyName, setCompanyName] = useState("SPACE Organizing");
  const [companyEmail, setCompanyEmail] = useState("info@space.com");
  const [timezone, setTimezone] = useState("America/New_York");
  const [currency, setCurrency] = useState(currentCurrency.code);
  const [language, setLanguage] = useState("en");
  
  useEffect(() => {
    setCurrency(currentCurrency.code);
  }, [currentCurrency]);

  // Sample settings data
  const systemSettings = {
    version: "2.1.4",
    lastUpdate: "2024-01-08",
    uptime: "99.9%",
    storage: "2.4 GB / 10 GB",
    activeUsers: 12,
    totalUsers: 15,
  };

  const handleSaveSettings = async (section: string) => {
    try {
      if (section === 'General') {
        console.log('⚙️ Settings: Saving currency setting:', currency);
        
        // Save currency setting to database
        const success = await settingsService.updateCurrency(currency);
        console.log('🔍 Settings: Currency update result:', success);
        
        if (success) {
          // Update the currency context immediately
          setSystemCurrency(currency);
          
          toast({
            title: "Settings Saved Successfully",
            description: `System currency has been updated to ${currency}. All financial displays will now use this currency.`,
          });
        } else {
          toast({
            title: "Save Failed",
            description: "Failed to save currency setting to database. Please check your connection and try again.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Settings Saved",
          description: `${section} settings have been updated successfully.`,
        });
      }
    } catch (error: any) {
      console.error('🚨 Settings: Error saving settings:', error);
      toast({
        title: "Save Error",
        description: error.message || "An unexpected error occurred while saving settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleResetSettings = () => {
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to default values.",
    });
  };

  const handleBackupData = () => {
    toast({
      title: "Backup Started",
      description: "System backup has been initiated. You'll be notified when complete.",
    });
  };

  const handleTestEmail = () => {
    toast({
      title: "Test Email Sent",
      description: "A test email has been sent to verify email configuration.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Settings className="w-8 h-8 text-blue-600" />
            System Settings
          </h1>
          <p className="text-gray-600 mt-2">
            Configure system preferences, integrations, and security settings
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleResetSettings}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset to Defaults
          </Button>
          <Button variant="outline" onClick={handleBackupData}>
            <Database className="w-4 h-4 mr-2" />
            Backup Data
          </Button>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Server className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">System Version</p>
                <p className="text-lg font-bold">{systemSettings.version}</p>
                <p className="text-xs text-gray-500">Current version</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Last Update</p>
                <p className="text-lg font-bold">{systemSettings.lastUpdate}</p>
                <p className="text-xs text-gray-500">System updated</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Monitor className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Uptime</p>
                <p className="text-lg font-bold">{systemSettings.uptime}</p>
                <p className="text-xs text-gray-500">System availability</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Database className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Storage Used</p>
                <p className="text-lg font-bold">{systemSettings.storage}</p>
                <p className="text-xs text-gray-500">Database storage</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-lg font-bold">{systemSettings.activeUsers}</p>
                <p className="text-xs text-gray-500">Currently online</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-lg font-bold">{systemSettings.totalUsers}</p>
                <p className="text-xs text-gray-500">Registered users</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Settings Content */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                General Settings
              </CardTitle>
              <CardDescription>
                Basic system configuration and company information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Company Name</label>
                  <Input 
                    value={companyName} 
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Enter company name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Company Email</label>
                  <Input 
                    value={companyEmail} 
                    onChange={(e) => setCompanyEmail(e.target.value)}
                    placeholder="Enter company email"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Timezone</label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                      <SelectItem value="Europe/London">London (GMT)</SelectItem>
                      <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="text-sm font-medium">Default Currency</label>
                    <p className="text-xs text-gray-500">
                      Current: {currentCurrency.symbol} {currentCurrency.code}
                    </p>
                  </div>
                  <Select value={currency} onValueChange={(value) => {
                    setCurrency(value);
                    setSystemCurrency(value);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(SUPPORTED_CURRENCIES).map((curr) => (
                        <SelectItem key={curr.code} value={curr.code}>
                          <div className="flex items-center gap-2">
                            {curr.symbol}
                            {curr.code} - {curr.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">System Language</label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="ja">Japanese</SelectItem>
                      <SelectItem value="zh">Chinese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Date Format</label>
                  <Select defaultValue="MM/DD/YYYY">
                    <SelectTrigger>
                      <SelectValue placeholder="Select date format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      <SelectItem value="DD-MM-YYYY">DD-MM-YYYY</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Company Description</label>
                <Textarea 
                  placeholder="Enter company description..."
                  rows={3}
                />
              </div>

              <Button onClick={() => handleSaveSettings("General")}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure system-wide notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Email Notifications</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Payment Notifications</label>
                      <p className="text-xs text-gray-500">Notify when payments are received or overdue</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Deal Updates</label>
                      <p className="text-xs text-gray-500">Notify when deals are created or updated</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Task Assignments</label>
                      <p className="text-xs text-gray-500">Notify when tasks are assigned or completed</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">System Alerts</label>
                      <p className="text-xs text-gray-500">Notify about system maintenance and updates</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Push Notifications</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Real-time Updates</label>
                      <p className="text-xs text-gray-500">Show instant notifications for important events</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Meeting Reminders</label>
                      <p className="text-xs text-gray-500">Remind about upcoming meetings</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Mobile Notifications</label>
                      <p className="text-xs text-gray-500">Send notifications to mobile devices</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Email Configuration</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">SMTP Server</label>
                    <Input placeholder="smtp.gmail.com" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">SMTP Port</label>
                    <Input placeholder="587" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Username</label>
                    <Input placeholder="your-email@domain.com" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Password</label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleTestEmail}>
                    <Mail className="w-4 h-4 mr-2" />
                    Test Email
                  </Button>
                </div>
              </div>

              <Button onClick={() => handleSaveSettings("Notification")}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Configure security policies and authentication settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Password Policy</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Require Strong Passwords</label>
                      <p className="text-xs text-gray-500">Minimum 8 characters with mixed case and numbers</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Password Expiration</label>
                      <p className="text-xs text-gray-500">Force password change every 90 days</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Two-Factor Authentication</label>
                      <p className="text-xs text-gray-500">Require 2FA for all users</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Session Management</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Session Timeout (minutes)</label>
                    <Input defaultValue="30" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Max Login Attempts</label>
                    <Input defaultValue="5" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Data Protection</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Data Encryption</label>
                      <p className="text-xs text-gray-500">Encrypt sensitive data at rest</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Audit Logging</label>
                      <p className="text-xs text-gray-500">Log all user actions and system events</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">IP Whitelisting</label>
                      <p className="text-xs text-gray-500">Restrict access to specific IP addresses</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>

              <Button onClick={() => handleSaveSettings("Security")}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                Third-Party Integrations
              </CardTitle>
              <CardDescription>
                Configure external service integrations and API keys
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Payment Processing</h3>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Key className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Stripe</p>
                      <p className="text-sm text-gray-500">Payment processing and invoicing</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded">Connected</span>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Email Services</h3>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Resend</p>
                      <p className="text-sm text-gray-500">Transactional email delivery</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded">Connected</span>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Calendar Integration</h3>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Globe className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium">Google Calendar</p>
                      <p className="text-sm text-gray-500">Meeting and event synchronization</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">Not Connected</span>
                    <Button variant="outline" size="sm">Connect</Button>
                  </div>
                </div>
              </div>

              <Button onClick={() => handleSaveSettings("Integration")}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Appearance Settings
              </CardTitle>
              <CardDescription>
                Customize the look and feel of the system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Theme Settings</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Dark Mode</label>
                      <p className="text-xs text-gray-500">Use dark theme for the interface</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Compact Mode</label>
                      <p className="text-xs text-gray-500">Reduce spacing for more content</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Brand Customization</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Primary Color</label>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-600 rounded border"></div>
                      <Input defaultValue="#2563eb" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Secondary Color</label>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-600 rounded border"></div>
                      <Input defaultValue="#4b5563" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Layout Preferences</h3>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sidebar Position</label>
                  <Select defaultValue="left">
                    <SelectTrigger>
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={() => handleSaveSettings("Appearance")}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5" />
                System Administration
              </CardTitle>
              <CardDescription>
                System maintenance, backups, and advanced configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Database Management</h3>
                
                <div className="flex gap-3">
                  <Button variant="outline">
                    <Database className="w-4 h-4 mr-2" />
                    Create Backup
                  </Button>
                  <Button variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Optimize Database
                  </Button>
                  <Button variant="outline">
                    <Monitor className="w-4 h-4 mr-2" />
                    View Logs
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">System Maintenance</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Automatic Updates</label>
                      <p className="text-xs text-gray-500">Install security updates automatically</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Maintenance Mode</label>
                      <p className="text-xs text-gray-500">Enable maintenance mode for system updates</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Performance Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Cache Duration (hours)</label>
                    <Input defaultValue="24" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Max File Upload Size (MB)</label>
                    <Input defaultValue="50" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-red-600">Danger Zone</h3>
                
                <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium text-red-900">Reset All Settings</label>
                      <p className="text-xs text-red-700">This will reset all system settings to default values</p>
                    </div>
                    <Button variant="destructive" onClick={handleResetSettings}>
                      Reset System Settings
                    </Button>
                  </div>
                </div>
              </div>

              <Button onClick={() => handleSaveSettings("System")}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;