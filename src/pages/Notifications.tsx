import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Zap,
  Settings,
  RefreshCw,
  Filter,
  Search,
  MoreVertical,
  Eye,
  Trash2,
  Clock,
  User,
  Building,
  DollarSign,
  Target,
  TrendingUp,
  Users
} from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'deal' | 'client' | 'exhibition' | 'payment';
  priority: 'high' | 'medium' | 'low';
  read: boolean;
  actionable: boolean;
  created_at: string;
  related_entity?: {
    type: string;
    id: string;
    name: string;
  };
  actions?: Array<{
    label: string;
    action: string;
    variant?: 'default' | 'destructive' | 'outline';
  }>;
}

interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  categories: {
    deals: boolean;
    clients: boolean;
    exhibitions: boolean;
    payments: boolean;
    system: boolean;
  };
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
    email: true,
    push: true,
    sms: false,
    categories: {
      deals: true,
      clients: true,
      exhibitions: true,
      payments: true,
      system: false
    },
    frequency: 'immediate'
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('notifications');

  // Mock notifications data
  const mockNotifications: Notification[] = [
    {
      id: '1',
      title: 'High-Value Deal Alert',
      message: 'EcoTech Solutions deal has moved to "Terms Finalized" stage. Deal value: $72,000',
      type: 'deal',
      priority: 'high',
      read: false,
      actionable: true,
      created_at: '2024-01-10T11:30:00Z',
      related_entity: {
        type: 'deal',
        id: 'DEAL-001',
        name: 'EcoTech Solutions - Premium Booth'
      },
      actions: [
        { label: 'View Deal', action: 'view_deal', variant: 'default' },
        { label: 'Send Contract', action: 'send_contract', variant: 'outline' }
      ]
    },
    {
      id: '2',
      title: 'Payment Overdue',
      message: 'Innovation Corp payment of $25,000 is 5 days overdue. Immediate action required.',
      type: 'payment',
      priority: 'high',
      read: false,
      actionable: true,
      created_at: '2024-01-10T10:15:00Z',
      related_entity: {
        type: 'client',
        id: 'CLIENT-003',
        name: 'Innovation Corp'
      },
      actions: [
        { label: 'Send Reminder', action: 'send_reminder', variant: 'default' },
        { label: 'View Payment', action: 'view_payment', variant: 'outline' }
      ]
    },
    {
      id: '3',
      title: 'Exhibition Capacity Alert',
      message: 'Green Life Expo 2024 has reached 85% capacity. Only 12 booths remaining.',
      type: 'exhibition',
      priority: 'medium',
      read: true,
      actionable: true,
      created_at: '2024-01-10T09:45:00Z',
      related_entity: {
        type: 'exhibition',
        id: 'EXPO-001',
        name: 'Green Life Expo 2024'
      },
      actions: [
        { label: 'View Exhibition', action: 'view_exhibition', variant: 'default' }
      ]
    },
    {
      id: '4',
      title: 'New Client Registration',
      message: 'Future Tech Ltd has completed registration and is ready for onboarding.',
      type: 'client',
      priority: 'medium',
      read: true,
      actionable: true,
      created_at: '2024-01-10T08:30:00Z',
      related_entity: {
        type: 'client',
        id: 'CLIENT-008',
        name: 'Future Tech Ltd'
      },
      actions: [
        { label: 'Start Onboarding', action: 'start_onboarding', variant: 'default' },
        { label: 'View Profile', action: 'view_profile', variant: 'outline' }
      ]
    },
    {
      id: '5',
      title: 'System Maintenance Scheduled',
      message: 'Scheduled maintenance window: January 15, 2024, 2:00 AM - 4:00 AM UTC.',
      type: 'info',
      priority: 'low',
      read: true,
      actionable: false,
      created_at: '2024-01-09T16:00:00Z'
    },
    {
      id: '6',
      title: 'Monthly Target Achievement',
      message: 'Congratulations! You have achieved 105% of your monthly sales target.',
      type: 'success',
      priority: 'medium',
      read: false,
      actionable: false,
      created_at: '2024-01-09T14:20:00Z'
    }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setNotifications(mockNotifications);
      setLoading(false);
    }, 1000);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'deal': return Target;
      case 'client': return Users;
      case 'exhibition': return Calendar;
      case 'payment': return DollarSign;
      case 'success': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'error': return AlertTriangle;
      case 'info': return Info;
      default: return Bell;
    }
  };

  const getNotificationColor = (type: string, priority: string) => {
    if (priority === 'high') {
      return 'text-red-600 bg-red-100';
    }
    switch (type) {
      case 'deal': return 'text-blue-600 bg-blue-100';
      case 'client': return 'text-green-600 bg-green-100';
      case 'exhibition': return 'text-purple-600 bg-purple-100';
      case 'payment': return 'text-orange-600 bg-orange-100';
      case 'success': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || 
                         (filter === 'unread' && !notification.read) ||
                         (filter === 'actionable' && notification.actionable) ||
                         notification.type === filter;
    
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const updateSettings = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const updateCategorySetting = (category: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      categories: { ...prev.categories, [category]: value }
    }));
  };

  // Calculate summary stats
  const unreadCount = notifications.filter(n => !n.read).length;
  const highPriorityCount = notifications.filter(n => n.priority === 'high' && !n.read).length;
  const actionableCount = notifications.filter(n => n.actionable && !n.read).length;

  if (loading) {
    return (
      <div className="content-area">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading notifications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content-area">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Bell className="w-8 h-8 text-blue-600" />
              Smart Notifications
            </h1>
            <p className="text-gray-600 mt-2">Intelligent alerts and notification management</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={markAllAsRead}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark All Read
            </Button>
            <Button variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 mb-1">Total Notifications</p>
                  <p className="text-3xl font-bold text-blue-900">{notifications.length}</p>
                </div>
                <div className="p-3 bg-blue-200 rounded-full">
                  <Bell className="w-6 h-6 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-red-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600 mb-1">Unread</p>
                  <p className="text-3xl font-bold text-red-900">{unreadCount}</p>
                </div>
                <div className="p-3 bg-red-200 rounded-full">
                  <Mail className="w-6 h-6 text-red-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600 mb-1">High Priority</p>
                  <p className="text-3xl font-bold text-orange-900">{highPriorityCount}</p>
                </div>
                <div className="p-3 bg-orange-200 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-orange-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 mb-1">Actionable</p>
                  <p className="text-3xl font-bold text-green-900">{actionableCount}</p>
                </div>
                <div className="p-3 bg-green-200 rounded-full">
                  <Zap className="w-6 h-6 text-green-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {tab.id === 'notifications' && unreadCount > 0 && (
                    <Badge className="bg-red-500 text-white text-xs">{unreadCount}</Badge>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <Input
                    placeholder="Search notifications..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Notifications</option>
                  <option value="unread">Unread</option>
                  <option value="actionable">Actionable</option>
                  <option value="deal">Deals</option>
                  <option value="client">Clients</option>
                  <option value="exhibition">Exhibitions</option>
                  <option value="payment">Payments</option>
                </select>
              </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
              {filteredNotifications.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
                    <p className="text-gray-600">
                      {searchTerm || filter !== 'all' 
                        ? 'Try adjusting your search criteria or filters.'
                        : 'You\'re all caught up! No new notifications.'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredNotifications.map((notification) => {
                  const Icon = getNotificationIcon(notification.type);
                  const colorClass = getNotificationColor(notification.type, notification.priority);
                  
                  return (
                    <Card 
                      key={notification.id} 
                      className={`border-0 shadow-sm hover:shadow-md transition-shadow ${
                        !notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                      }`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-lg ${colorClass} flex-shrink-0`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <h3 className={`text-lg font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                                  {notification.title}
                                </h3>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={getPriorityColor(notification.priority)}>
                                  {notification.priority}
                                </Badge>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-gray-600 mb-3">{notification.message}</p>
                            
                            {notification.related_entity && (
                              <div className="flex items-center gap-2 mb-3">
                                <Building className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                  Related: {notification.related_entity.name}
                                </span>
                              </div>
                            )}

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Clock className="w-4 h-4" />
                                <span>{new Date(notification.created_at).toLocaleString()}</span>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                {notification.actions?.map((action, index) => (
                                  <Button 
                                    key={index}
                                    size="sm" 
                                    variant={action.variant || 'default'}
                                    className={action.variant === 'default' ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}
                                  >
                                    {action.label}
                                  </Button>
                                ))}
                                {!notification.read && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => markAsRead(notification.id)}
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                )}
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => deleteNotification(notification.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Delivery Methods */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Methods</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-900">Email Notifications</p>
                          <p className="text-sm text-gray-600">Receive notifications via email</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.email}
                        onCheckedChange={(value) => updateSettings('email', value)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-900">Push Notifications</p>
                          <p className="text-sm text-gray-600">Receive browser push notifications</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.push}
                        onCheckedChange={(value) => updateSettings('push', value)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <MessageSquare className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-900">SMS Notifications</p>
                          <p className="text-sm text-gray-600">Receive notifications via SMS</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.sms}
                        onCheckedChange={(value) => updateSettings('sms', value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Categories</h3>
                  <div className="space-y-4">
                    {Object.entries(settings.categories).map(([category, enabled]) => (
                      <div key={category} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {category === 'deals' && <Target className="w-5 h-5 text-gray-600" />}
                          {category === 'clients' && <Users className="w-5 h-5 text-gray-600" />}
                          {category === 'exhibitions' && <Calendar className="w-5 h-5 text-gray-600" />}
                          {category === 'payments' && <DollarSign className="w-5 h-5 text-gray-600" />}
                          {category === 'system' && <Settings className="w-5 h-5 text-gray-600" />}
                          <div>
                            <p className="font-medium text-gray-900 capitalize">{category}</p>
                            <p className="text-sm text-gray-600">
                              Notifications related to {category.toLowerCase()}
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={enabled}
                          onCheckedChange={(value) => updateCategorySetting(category, value)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Frequency */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Frequency</h3>
                  <select
                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={settings.frequency}
                    onChange={(e) => updateSettings('frequency', e.target.value)}
                  >
                    <option value="immediate">Immediate</option>
                    <option value="hourly">Hourly Digest</option>
                    <option value="daily">Daily Digest</option>
                    <option value="weekly">Weekly Digest</option>
                  </select>
                </div>

                <div className="pt-4 border-t">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}