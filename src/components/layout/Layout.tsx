import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  Settings, 
  HelpCircle, 
  Plus, 
  X,
  BellRing,
  Eye,
  CheckCircle2,
  Archive,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sidebar } from './Sidebar';
import { UserMenu } from '@/components/auth/UserMenu';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  // Load notifications from localStorage and set up real-time updates
  useEffect(() => {
    const loadNotifications = () => {
      try {
        const storedNotifications = localStorage.getItem('notifications');
        if (storedNotifications) {
          const parsedNotifications = JSON.parse(storedNotifications);
          setNotifications(parsedNotifications);
          const unread = parsedNotifications.filter((n: any) => n.status === 'Unread').length;
          setUnreadCount(unread);
        }
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    };

    // Load initially
    loadNotifications();

    // Set up interval to check for updates
    const interval = setInterval(loadNotifications, 5000); // Check every 5 seconds

    // Listen for storage changes (when notifications are updated from other tabs/components)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'notifications') {
        loadNotifications();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const markAsRead = (notificationId: string) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, status: 'Read', read_at: new Date().toISOString() }
        : notification
    );
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    const now = new Date().toISOString();
    const updatedNotifications = notifications.map(notification => ({ 
      ...notification, 
      status: 'Read', 
      read_at: notification.read_at || now 
    }));
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    setUnreadCount(0);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = (now.getTime() - date.getTime()) / (1000 * 60);
    
    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${Math.floor(diffInMinutes)}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-600';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const recentNotifications = notifications
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-40 w-64">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 transition-all duration-300 ml-64">
        {/* Top Bar */}
        <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              {/* Mobile menu button */}
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-black"
              >
                {sidebarOpen ? <X className="w-5 h-5 text-black" /> : <X className="w-5 h-5 text-black" />}
              </button>

              {/* Search */}
              <div className="relative max-w-md flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
                <input
                  type="text"
                  placeholder="Search clients, deals, contracts..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black text-sm placeholder-gray-500"
                />
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              {/* Quick Create */}
              <div className="relative">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                  <Plus className="w-4 h-4" />
                  Quick Create
                </Button>
              </div>

              {/* Action buttons */}
              <button className="p-2 rounded-md hover:bg-gray-100 transition-colors">
                <HelpCircle className="w-5 h-5 text-gray-600" />
              </button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 rounded-md hover:bg-gray-100 transition-colors relative">
                    {unreadCount > 0 ? (
                      <BellRing className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Bell className="w-5 h-5 text-gray-600" />
                    )}
                    {unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-white">
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                      </div>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
                  <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Notifications</span>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {unreadCount} unread
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate('/notifications')}
                        className="h-6 px-2 text-xs"
                      >
                        View All
                      </Button>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {recentNotifications.length > 0 ? (
                    <>
                      {recentNotifications.map((notification) => (
                        <DropdownMenuItem
                          key={notification.id}
                          className={`p-3 cursor-pointer ${
                            notification.status === 'Unread' ? 'bg-blue-50 border-l-2 border-l-blue-500' : ''
                          }`}
                          onClick={() => {
                            markAsRead(notification.id);
                            if (notification.related_entity === 'client' && notification.entity_id) {
                              navigate(`/clients/${notification.entity_id}`);
                            } else if (notification.related_entity === 'deal' && notification.entity_id) {
                              navigate(`/deals/${notification.entity_id}`);
                            } else {
                              navigate('/notifications');
                            }
                          }}
                        >
                          <div className="flex flex-col gap-1 w-full">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-medium text-sm text-gray-900 line-clamp-1">
                                {notification.title}
                              </h4>
                              <div className="flex items-center gap-1 flex-shrink-0">
                                {notification.status === 'Unread' && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                                <span className={`text-xs font-medium ${
                                  getPriorityColor(notification.priority)
                                }`}>
                                  {notification.priority}
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-gray-600 line-clamp-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs text-gray-500">
                                {formatDateTime(notification.created_at)}
                              </span>
                              {notification.entity_name && (
                                <span className="text-xs text-blue-600 font-medium">
                                  {notification.entity_name}
                                </span>
                              )}
                            </div>
                          </div>
                        </DropdownMenuItem>
                      ))}
                      
                      <DropdownMenuSeparator />
                      
                      <div className="p-2 flex gap-1">
                        {unreadCount > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={markAllAsRead}
                            className="flex-1 h-8 text-xs"
                          >
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Mark All Read
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate('/notifications')}
                          className="flex-1 h-8 text-xs"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View All
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="p-4 text-center">
                      <Bell className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">No notifications</p>
                      <p className="text-xs text-gray-500">You're all caught up!</p>
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <button className="p-2 rounded-md hover:bg-gray-100 transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>

              {/* User Menu */}
              <div className="pl-3 border-l border-gray-200">
                <UserMenu />
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}