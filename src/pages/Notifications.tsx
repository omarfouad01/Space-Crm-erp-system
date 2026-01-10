import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Bell,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  DollarSign,
  Users,
  Target,
  CheckCircle,
  AlertTriangle,
  Info,
  Mail,
  MessageSquare,
  Phone,
  Settings,
  Eye,
  Trash2,
  MoreHorizontal,
  Zap,
  TrendingUp,
  FileText,
  Building2,
  Archive,
  Send,
  Copy,
  ExternalLink,
  RefreshCw,
  Download,
  BellRing,
  BellOff,
  Volume2,
  VolumeX,
  Smartphone,
  Monitor,
  Globe,
  Shield,
  Activity,
  Timer,
  Star,
  Flag,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  PlayCircle,
  PauseCircle,
  Edit,
  Repeat
} from "lucide-react";

// Notification types and categories
const NOTIFICATION_TYPES = [
  { id: 'payment_due', name: 'Payment Due', icon: DollarSign, color: '#EF4444', category: 'Finance' },
  { id: 'meeting_reminder', name: 'Meeting Reminder', icon: Calendar, color: '#3B82F6', category: 'Schedule' },
  { id: 'task_deadline', name: 'Task Deadline', icon: Clock, color: '#F59E0B', category: 'Tasks' },
  { id: 'deal_update', name: 'Deal Update', icon: Target, color: '#10B981', category: 'Sales' },
  { id: 'client_activity', name: 'Client Activity', icon: Users, color: '#8B5CF6', category: 'CRM' },
  { id: 'system_alert', name: 'System Alert', icon: AlertTriangle, color: '#EF4444', category: 'System' },
  { id: 'contract_expiry', name: 'Contract Expiry', icon: FileText, color: '#F59E0B', category: 'Legal' },
  { id: 'performance_alert', name: 'Performance Alert', icon: TrendingUp, color: '#06B6D4', category: 'Analytics' },
];

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Unread' | 'Read' | 'Archived';
  created_at: string;
  due_date?: string;
  related_entity?: string;
  entity_id?: string;
  entity_name?: string;
  actions?: string[];
  read_at?: string;
  archived_at?: string;
  metadata?: any;
}

interface Reminder {
  id: string;
  title: string;
  description: string;
  type: string;
  frequency: string;
  next_trigger: string;
  enabled: boolean;
  recipients: string[];
  conditions: any;
  created_at: string;
  updated_at: string;
}

interface NotificationSettings {
  email_enabled: boolean;
  sms_enabled: boolean;
  in_app_enabled: boolean;
  push_enabled: boolean;
  sound_enabled: boolean;
  payment_reminders: boolean;
  meeting_reminders: boolean;
  task_reminders: boolean;
  deal_updates: boolean;
  client_updates: boolean;
  system_alerts: boolean;
  contract_alerts: boolean;
  performance_alerts: boolean;
  quiet_hours_enabled: boolean;
  quiet_hours_start: string;
  quiet_hours_end: string;
}

const Notifications = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showReminderDialog, setShowReminderDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null);
  const [notificationToDelete, setNotificationToDelete] = useState<Notification | null>(null);
  
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    email_enabled: true,
    sms_enabled: false,
    in_app_enabled: true,
    push_enabled: true,
    sound_enabled: true,
    payment_reminders: true,
    meeting_reminders: true,
    task_reminders: true,
    deal_updates: true,
    client_updates: false,
    system_alerts: true,
    contract_alerts: true,
    performance_alerts: false,
    quiet_hours_enabled: false,
    quiet_hours_start: "22:00",
    quiet_hours_end: "08:00"
  });

  const [reminderForm, setReminderForm] = useState({
    title: '',
    description: '',
    type: 'payment_due',
    frequency: 'daily',
    recipients: '',
    enabled: true
  });

  useEffect(() => {
    loadData();
    // Set up real-time updates
    const interval = setInterval(loadData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Enhanced mock notifications data with more realistic scenarios
      const mockNotifications: Notification[] = [
        {
          id: 'notif-001',
          type: 'payment_due',
          title: 'Urgent: Payment Overdue - EcoTech Solutions',
          message: 'Payment of $125,000 is now 2 days overdue for Green Energy Expo sponsorship. Immediate action required.',
          priority: 'High',
          status: 'Unread',
          created_at: '2026-01-10T10:30:00Z',
          due_date: '2026-01-08T23:59:59Z',
          related_entity: 'client',
          entity_id: 'client_1',
          entity_name: 'EcoTech Solutions',
          actions: ['View Payment', 'Send Reminder', 'Mark Paid', 'Contact Client'],
          metadata: { amount: 125000, currency: 'USD', days_overdue: 2 }
        },
        {
          id: 'notif-002',
          type: 'meeting_reminder',
          title: 'Meeting Starting Soon - Solar Dynamics Corp',
          message: 'Strategy discussion meeting with Solar Dynamics Corp starts in 30 minutes. Conference Room A.',
          priority: 'High',
          status: 'Unread',
          created_at: '2026-01-10T13:30:00Z',
          due_date: '2026-01-10T14:00:00Z',
          related_entity: 'meeting',
          entity_id: 'meeting_2',
          entity_name: 'Solar Dynamics - Strategy Discussion',
          actions: ['Join Meeting', 'View Agenda', 'Reschedule', 'Add Attendee'],
          metadata: { meeting_type: 'client', location: 'Conference Room A', duration: 60 }
        },
        {
          id: 'notif-003',
          type: 'task_deadline',
          title: 'Critical Task Due Today',
          message: 'Follow up with Green Alliance partnership proposal is due today at 5:00 PM.',
          priority: 'High',
          status: 'Unread',
          created_at: '2026-01-10T09:15:00Z',
          due_date: '2026-01-10T17:00:00Z',
          related_entity: 'task',
          entity_id: 'task_3',
          entity_name: 'Green Alliance Partnership Follow-up',
          actions: ['Complete Task', 'Extend Deadline', 'View Details', 'Assign to Team'],
          metadata: { task_type: 'follow_up', assigned_to: 'Sarah Johnson', priority: 'High' }
        },
        {
          id: 'notif-004',
          type: 'deal_update',
          title: 'Deal Won! WindPower Solutions',
          message: 'Congratulations! WindPower Solutions deal worth $180,000 has been closed successfully.',
          priority: 'Medium',
          status: 'Read',
          created_at: '2026-01-09T16:20:00Z',
          related_entity: 'deal',
          entity_id: 'deal_4',
          entity_name: 'WindPower Solutions - Premium Booth Package',
          actions: ['View Deal', 'Generate Contract', 'Schedule Kickoff', 'Send Thank You'],
          metadata: { deal_value: 180000, stage: 'Closed Won', probability: 100 },
          read_at: '2026-01-09T18:45:00Z'
        },
        {
          id: 'notif-005',
          type: 'system_alert',
          title: 'System Maintenance Tonight',
          message: 'Scheduled maintenance window: Tonight from 2:00 AM to 4:00 AM EST. System will be unavailable.',
          priority: 'Medium',
          status: 'Unread',
          created_at: '2026-01-09T11:00:00Z',
          due_date: '2026-01-11T02:00:00Z',
          related_entity: 'system',
          entity_name: 'System Maintenance',
          actions: ['Acknowledge', 'Set Reminder', 'View Details', 'Notify Team'],
          metadata: { maintenance_type: 'scheduled', duration: 120, impact: 'full_downtime' }
        },
        {
          id: 'notif-006',
          type: 'client_activity',
          title: 'New Client Inquiry - CleanTech Innovations',
          message: 'CleanTech Innovations has submitted a new inquiry for Platinum Sponsorship package.',
          priority: 'Medium',
          status: 'Unread',
          created_at: '2026-01-09T14:30:00Z',
          related_entity: 'client',
          entity_id: 'client_6',
          entity_name: 'CleanTech Innovations',
          actions: ['View Inquiry', 'Assign Sales Rep', 'Schedule Call', 'Send Proposal'],
          metadata: { inquiry_type: 'sponsorship', package: 'platinum', estimated_value: 320000 }
        },
        {
          id: 'notif-007',
          type: 'contract_expiry',
          title: 'Contract Expiring Soon - TechGreen Corp',
          message: 'TechGreen Corp contract expires in 15 days. Renewal discussion needed.',
          priority: 'Medium',
          status: 'Read',
          created_at: '2026-01-08T10:00:00Z',
          due_date: '2026-01-25T23:59:59Z',
          related_entity: 'contract',
          entity_id: 'contract_7',
          entity_name: 'TechGreen Corp - Annual Partnership',
          actions: ['View Contract', 'Schedule Renewal', 'Send Notice', 'Update Terms'],
          metadata: { contract_value: 150000, renewal_probability: 85 },
          read_at: '2026-01-08T15:20:00Z'
        },
        {
          id: 'notif-008',
          type: 'performance_alert',
          title: 'Sales Target Achievement',
          message: 'Congratulations! Q1 sales target of $2M has been achieved 3 weeks early.',
          priority: 'Low',
          status: 'Read',
          created_at: '2026-01-07T09:45:00Z',
          related_entity: 'performance',
          entity_name: 'Q1 Sales Performance',
          actions: ['View Report', 'Share Achievement', 'Set New Target', 'Celebrate'],
          metadata: { target: 2000000, achieved: 2150000, percentage: 107.5 },
          read_at: '2026-01-07T11:30:00Z'
        }
      ];

      // Enhanced mock reminders data
      const mockReminders: Reminder[] = [
        {
          id: 'reminder-001',
          title: 'Payment Follow-up Automation',
          description: 'Automatically follow up on overdue payments with escalating reminders',
          type: 'payment_due',
          frequency: 'Daily at 9:00 AM',
          next_trigger: '2026-01-11T09:00:00Z',
          enabled: true,
          recipients: ['finance@company.com', 'sales@company.com', 'manager@company.com'],
          conditions: { days_overdue: 1, amount_threshold: 10000 },
          created_at: '2026-01-01T08:00:00Z',
          updated_at: '2026-01-08T14:30:00Z'
        },
        {
          id: 'reminder-002',
          title: 'Meeting Preparation Alerts',
          description: 'Remind team members to prepare for upcoming client meetings',
          type: 'meeting_reminder',
          frequency: '2 hours before meeting',
          next_trigger: '2026-01-10T12:00:00Z',
          enabled: true,
          recipients: ['team@company.com', 'sales@company.com'],
          conditions: { meeting_type: 'client', importance: 'high' },
          created_at: '2026-01-01T08:00:00Z',
          updated_at: '2026-01-09T16:45:00Z'
        },
        {
          id: 'reminder-003',
          title: 'Task Deadline Warnings',
          description: 'Alert assigned users when high-priority tasks are approaching deadline',
          type: 'task_deadline',
          frequency: '1 day before deadline',
          next_trigger: '2026-01-09T17:00:00Z',
          enabled: true,
          recipients: ['assigned_user', 'manager@company.com'],
          conditions: { priority: 'High', task_type: 'client_related' },
          created_at: '2026-01-01T08:00:00Z',
          updated_at: '2026-01-07T10:15:00Z'
        },
        {
          id: 'reminder-004',
          title: 'Deal Stage Progression',
          description: 'Notify sales team when deals have been in the same stage for too long',
          type: 'deal_update',
          frequency: 'Weekly on Mondays',
          next_trigger: '2026-01-13T09:00:00Z',
          enabled: true,
          recipients: ['sales@company.com', 'sales-manager@company.com'],
          conditions: { days_in_stage: 14, deal_value_min: 50000 },
          created_at: '2026-01-01T08:00:00Z',
          updated_at: '2026-01-06T11:20:00Z'
        },
        {
          id: 'reminder-005',
          title: 'Contract Renewal Alerts',
          description: 'Early warning system for contract renewals and expirations',
          type: 'contract_expiry',
          frequency: '30, 15, and 7 days before expiry',
          next_trigger: '2026-01-10T09:00:00Z',
          enabled: true,
          recipients: ['legal@company.com', 'account-manager@company.com'],
          conditions: { contract_value_min: 100000, auto_renewal: false },
          created_at: '2026-01-01T08:00:00Z',
          updated_at: '2026-01-05T13:40:00Z'
        }
      ];

      setNotifications(mockNotifications);
      setReminders(mockReminders);
      
      // Store notifications in localStorage for header component access
      localStorage.setItem('notifications', JSON.stringify(mockNotifications));
      
      toast({
        title: "Notifications Updated",
        description: `Loaded ${mockNotifications.length} notifications and ${mockReminders.length} reminders`,
      });
    } catch (error: any) {
      console.error("Error loading notifications:", error);
      toast({
        title: "Error",
        description: "Failed to load notifications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    const notificationType = NOTIFICATION_TYPES.find(t => t.id === type);
    if (notificationType) {
      const IconComponent = notificationType.icon;
      return <IconComponent className="w-5 h-5" style={{ color: notificationType.color }} />;
    }
    return <Bell className="w-5 h-5 text-gray-500" />;
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'High':
        return <Badge className="bg-red-100 text-red-800 border-red-200">High</Badge>;
      case 'Medium':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Medium</Badge>;
      case 'Low':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Low</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Unread':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Unread</Badge>;
      case 'Read':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Read</Badge>;
      case 'Archived':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Archived</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = (now.getTime() - date.getTime()) / (1000 * 60);
    
    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${Math.floor(diffInMinutes)} minutes ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => {
      const updated = prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, status: 'Read' as const, read_at: new Date().toISOString() }
          : notification
      );
      localStorage.setItem('notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const markAllAsRead = () => {
    const now = new Date().toISOString();
    setNotifications(prev => {
      const updated = prev.map(notification => ({ 
        ...notification, 
        status: 'Read' as const, 
        read_at: notification.read_at || now 
      }));
      localStorage.setItem('notifications', JSON.stringify(updated));
      return updated;
    });
    toast({
      title: "Success",
      description: "All notifications marked as read",
    });
  };

  const archiveNotification = (notificationId: string) => {
    setNotifications(prev => {
      const updated = prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, status: 'Archived' as const, archived_at: new Date().toISOString() }
          : notification
      );
      localStorage.setItem('notifications', JSON.stringify(updated));
      return updated;
    });
    toast({
      title: "Success",
      description: "Notification archived",
    });
  };

  const deleteNotification = () => {
    if (!notificationToDelete) return;
    
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== notificationToDelete.id);
      localStorage.setItem('notifications', JSON.stringify(updated));
      return updated;
    });
    toast({
      title: "Success",
      description: "Notification deleted",
    });
    setShowDeleteDialog(false);
    setNotificationToDelete(null);
  };

  const handleCreateReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const newReminder: Reminder = {
        id: `reminder-${Date.now()}`,
        title: reminderForm.title,
        description: reminderForm.description,
        type: reminderForm.type,
        frequency: reminderForm.frequency,
        next_trigger: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        enabled: reminderForm.enabled,
        recipients: reminderForm.recipients.split(',').map(r => r.trim()).filter(r => r),
        conditions: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setReminders(prev => [newReminder, ...prev]);
      
      toast({
        title: "Reminder Created",
        description: `${reminderForm.title} has been set up successfully`,
      });
      
      setShowReminderDialog(false);
      setReminderForm({
        title: '',
        description: '',
        type: 'payment_due',
        frequency: 'daily',
        recipients: '',
        enabled: true
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create reminder",
        variant: "destructive",
      });
    }
  };

  const toggleReminder = (reminderId: string, enabled: boolean) => {
    setReminders(prev => 
      prev.map(r => 
        r.id === reminderId ? { ...r, enabled, updated_at: new Date().toISOString() } : r
      )
    );
    toast({
      title: enabled ? "Reminder Enabled" : "Reminder Disabled",
      description: `Reminder has been ${enabled ? 'activated' : 'deactivated'}`,
    });
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = searchTerm === "" || 
      notification.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.entity_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === "all" || notification.type === typeFilter;
    const matchesStatus = statusFilter === "all" || notification.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || notification.priority === priorityFilter;
    
    return matchesSearch && matchesType && matchesStatus && matchesPriority;
  });

  const unreadCount = notifications.filter(n => n.status === 'Unread').length;
  const highPriorityCount = notifications.filter(n => n.priority === 'High' && n.status === 'Unread').length;
  const todayCount = notifications.filter(n => {
    const today = new Date().toDateString();
    return new Date(n.created_at).toDateString() === today;
  }).length;

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
          <div className="flex gap-2">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-9 w-24 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-8 w-1/2 bg-gray-200 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Bell className="w-8 h-8 text-blue-600" />
            Notifications & Reminders
          </h1>
          <p className="text-gray-600 mt-2">
            Stay on top of important events and deadlines
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Mark All Read
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowReminderDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Reminder
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Notification Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowSettingsDialog(true)}>
                <Settings className="w-4 h-4 mr-2" />
                Preferences
              </DropdownMenuItem>
              <DropdownMenuItem onClick={loadData}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="w-4 h-4 mr-2" />
                Export
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Notifications</p>
                <p className="text-3xl font-bold">{notifications.length}</p>
              </div>
              <Bell className="w-8 h-8 text-blue-600" />
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <span className="text-blue-600 font-medium">{todayCount} today</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unread</p>
                <p className="text-3xl font-bold">{unreadCount}</p>
              </div>
              <BellRing className="w-8 h-8 text-orange-600" />
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <span className="font-medium">Require attention</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Priority</p>
                <p className="text-3xl font-bold">{highPriorityCount}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <span className="font-medium">Urgent items</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Reminders</p>
                <p className="text-3xl font-bold">{reminders.filter(r => r.enabled).length}</p>
              </div>
              <Timer className="w-8 h-8 text-green-600" />
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <span className="font-medium">Automated alerts</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="notifications">
            Notifications ({notifications.length})
          </TabsTrigger>
          <TabsTrigger value="reminders">
            Reminders ({reminders.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      placeholder="Search notifications..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-40">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {NOTIFICATION_TYPES.map(type => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Unread">Unread</SelectItem>
                      <SelectItem value="Read">Read</SelectItem>
                      <SelectItem value="Archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-40">
                      <Flag className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications List */}
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`hover:shadow-md transition-shadow cursor-pointer ${
                  notification.status === 'Unread' ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                            {getPriorityBadge(notification.priority)}
                            {getStatusBadge(notification.status)}
                            {notification.due_date && new Date(notification.due_date) < new Date() && (
                              <Badge className="bg-red-100 text-red-800 border-red-200">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Overdue
                              </Badge>
                            )}
                          </div>
                        </div>

                        <p className="text-gray-600">{notification.message}</p>

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{formatDateTime(notification.created_at)}</span>
                          {notification.entity_name && (
                            <>
                              <span>•</span>
                              <span className="font-medium">{notification.entity_name}</span>
                            </>
                          )}
                          {notification.due_date && (
                            <>
                              <span>•</span>
                              <span>Due: {new Date(notification.due_date).toLocaleDateString()}</span>
                            </>
                          )}
                        </div>

                        {notification.actions && notification.actions.length > 0 && (
                          <div className="flex items-center gap-2 flex-wrap">
                            {notification.actions.slice(0, 3).map((action, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toast({
                                    title: "Action Triggered",
                                    description: `${action} for ${notification.entity_name}`,
                                  });
                                }}
                              >
                                {action}
                              </Button>
                            ))}
                            {notification.actions.length > 3 && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  {notification.actions.slice(3).map((action, index) => (
                                    <DropdownMenuItem key={index}>
                                      {action}
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.id);
                          }}>
                            <Eye className="w-4 h-4 mr-2" />
                            Mark as Read
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            archiveNotification(notification.id);
                          }}>
                            <Archive className="w-4 h-4 mr-2" />
                            Archive
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(notification.message);
                            toast({ title: "Copied", description: "Notification copied to clipboard" });
                          }}>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              setNotificationToDelete(notification);
                              setShowDeleteDialog(true);
                            }}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredNotifications.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
                  <p className="text-gray-600">
                    {searchTerm || typeFilter !== "all" || statusFilter !== "all" || priorityFilter !== "all"
                      ? "Try adjusting your search criteria"
                      : "You're all caught up! No new notifications."
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="reminders" className="space-y-6">
          {/* Reminders List */}
          <div className="space-y-4">
            {reminders.map((reminder) => (
              <Card key={reminder.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg">
                        <Timer className="w-6 h-6 text-purple-600" />
                      </div>
                      
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-gray-900">{reminder.title}</h3>
                            <Badge className={reminder.enabled ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'}>
                              {reminder.enabled ? 'Active' : 'Disabled'}
                            </Badge>
                            <Badge variant="outline">
                              {NOTIFICATION_TYPES.find(t => t.id === reminder.type)?.name || reminder.type}
                            </Badge>
                          </div>
                        </div>

                        <p className="text-gray-600">{reminder.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Frequency:</span>
                            <span className="ml-2">{reminder.frequency}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Next Trigger:</span>
                            <span className="ml-2">{new Date(reminder.next_trigger).toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Recipients:</span>
                            <span className="ml-2">{reminder.recipients.length} users</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>Created: {formatDateTime(reminder.created_at)}</span>
                          <span>•</span>
                          <span>Updated: {formatDateTime(reminder.updated_at)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Switch
                        checked={reminder.enabled}
                        onCheckedChange={(checked) => toggleReminder(reminder.id, checked)}
                      />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Reminder
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="w-4 h-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <PlayCircle className="w-4 h-4 mr-2" />
                            Test Reminder
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {reminders.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Timer className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No reminders set up</h3>
                  <p className="text-gray-600 mb-4">
                    Create automated reminders to stay on top of important tasks and deadlines
                  </p>
                  <Button onClick={() => setShowReminderDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Reminder
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Settings Dialog */}
      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Notification Settings
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Delivery Methods</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <span>Email Notifications</span>
                  </div>
                  <Switch
                    checked={notificationSettings.email_enabled}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, email_enabled: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-gray-500" />
                    <span>SMS Notifications</span>
                  </div>
                  <Switch
                    checked={notificationSettings.sms_enabled}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, sms_enabled: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Monitor className="w-5 h-5 text-gray-500" />
                    <span>In-App Notifications</span>
                  </div>
                  <Switch
                    checked={notificationSettings.in_app_enabled}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, in_app_enabled: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-gray-500" />
                    <span>Push Notifications</span>
                  </div>
                  <Switch
                    checked={notificationSettings.push_enabled}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, push_enabled: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Volume2 className="w-5 h-5 text-gray-500" />
                    <span>Sound Notifications</span>
                  </div>
                  <Switch
                    checked={notificationSettings.sound_enabled}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, sound_enabled: checked }))
                    }
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Notification Types</h3>
              <div className="space-y-4">
                {Object.entries({
                  payment_reminders: 'Payment Reminders',
                  meeting_reminders: 'Meeting Reminders',
                  task_reminders: 'Task Reminders',
                  deal_updates: 'Deal Updates',
                  client_updates: 'Client Updates',
                  system_alerts: 'System Alerts',
                  contract_alerts: 'Contract Alerts',
                  performance_alerts: 'Performance Alerts',
                }).map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span>{label}</span>
                    <Switch
                      checked={notificationSettings[key as keyof NotificationSettings] as boolean}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, [key]: checked }))
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Quiet Hours</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Enable Quiet Hours</span>
                  <Switch
                    checked={notificationSettings.quiet_hours_enabled}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, quiet_hours_enabled: checked }))
                    }
                  />
                </div>
                {notificationSettings.quiet_hours_enabled && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="quiet_start">Start Time</Label>
                      <Input
                        id="quiet_start"
                        type="time"
                        value={notificationSettings.quiet_hours_start}
                        onChange={(e) => 
                          setNotificationSettings(prev => ({ ...prev, quiet_hours_start: e.target.value }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="quiet_end">End Time</Label>
                      <Input
                        id="quiet_end"
                        type="time"
                        value={notificationSettings.quiet_hours_end}
                        onChange={(e) => 
                          setNotificationSettings(prev => ({ ...prev, quiet_hours_end: e.target.value }))
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSettingsDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              setShowSettingsDialog(false);
              toast({
                title: "Settings Saved",
                description: "Your notification preferences have been updated",
              });
            }}>
              Save Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Reminder Dialog */}
      <Dialog open={showReminderDialog} onOpenChange={setShowReminderDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create New Reminder
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateReminder} className="space-y-4">
            <div>
              <Label htmlFor="reminder_title">Title *</Label>
              <Input
                id="reminder_title"
                value={reminderForm.title}
                onChange={(e) => setReminderForm({...reminderForm, title: e.target.value})}
                placeholder="Enter reminder title"
                required
              />
            </div>
            <div>
              <Label htmlFor="reminder_description">Description</Label>
              <Textarea
                id="reminder_description"
                value={reminderForm.description}
                onChange={(e) => setReminderForm({...reminderForm, description: e.target.value})}
                placeholder="Describe what this reminder is for"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="reminder_type">Type</Label>
                <Select value={reminderForm.type} onValueChange={(value) => setReminderForm({...reminderForm, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {NOTIFICATION_TYPES.map(type => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="reminder_frequency">Frequency</Label>
                <Select value={reminderForm.frequency} onValueChange={(value) => setReminderForm({...reminderForm, frequency: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="1_hour_before">1 hour before</SelectItem>
                    <SelectItem value="1_day_before">1 day before</SelectItem>
                    <SelectItem value="1_week_before">1 week before</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="reminder_recipients">Recipients</Label>
              <Input
                id="reminder_recipients"
                value={reminderForm.recipients}
                onChange={(e) => setReminderForm({...reminderForm, recipients: e.target.value})}
                placeholder="Enter email addresses, separated by commas"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="reminder_enabled"
                checked={reminderForm.enabled}
                onChange={(e) => setReminderForm({...reminderForm, enabled: e.target.checked})}
                className="rounded"
              />
              <Label htmlFor="reminder_enabled">Enable this reminder immediately</Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowReminderDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Create Reminder
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Delete Notification
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{notificationToDelete?.title}"? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteNotification} className="bg-red-600 hover:bg-red-700">
              Delete Notification
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Notifications;