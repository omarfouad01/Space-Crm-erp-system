import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  CreditCard,
  Receipt,
  PieChart,
  BarChart3,
  Target,
  Users,
  Building2,
  Search,
  Filter,
  Download,
  RefreshCw,
  Plus,
  Eye,
  Edit,
  Send,
  Bell,
  Flag,
  Zap,
  Award,
  Calculator,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Mail,
  Phone,
  MapPin,
  Star,
  Activity,
  Briefcase,
  Loader2,
  XCircle,
  CheckCircle2
} from "lucide-react";

// Payment plan configuration (30% / 40% / 30%)
const PAYMENT_PLAN_CONFIG = {
  initial: 0.30,    // 30% initial payment
  progress: 0.40,   // 40% progress payment
  final: 0.30       // 30% final payment
};

interface PaymentRecord {
  id: string;
  deal_id: string;
  deal_title: string;
  client_id: string;
  client_name: string;
  amount: number;
  due_date: string;
  paid_date?: string;
  status: 'pending' | 'paid' | 'overdue' | 'partial';
  payment_type: 'initial' | 'progress' | 'final' | 'full';
  installment_number: number;
  total_installments: number;
  method?: 'bank_transfer' | 'credit_card' | 'check' | 'cash';
  reference?: string;
  notes?: string;
  reminder_sent?: boolean;
  commission_triggered?: boolean;
}

interface CommissionRecord {
  id: string;
  deal_id: string;
  deal_title: string;
  user_id: string;
  user_name: string;
  user_role: string;
  percentage: number;
  amount: number;
  status: 'pending' | 'approved' | 'paid' | 'cancelled';
  trigger_event: 'deal_closed' | 'payment_received' | 'manual';
  created_at: string;
  approved_at?: string;
  paid_at?: string;
  notes?: string;
}

interface FinancialMetrics {
  total_revenue: number;
  monthly_revenue: number;
  revenue_growth: number;
  payments_collected: number;
  payments_pending: number;
  payments_overdue: number;
  commission_pending: number;
  commission_paid: number;
  collection_rate: number;
  avg_payment_time: number;
}

const Finance = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [commissions, setCommissions] = useState<CommissionRecord[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<FinancialMetrics>({
    total_revenue: 0,
    monthly_revenue: 0,
    revenue_growth: 0,
    payments_collected: 0,
    payments_pending: 0,
    payments_overdue: 0,
    commission_pending: 0,
    commission_paid: 0,
    collection_rate: 0,
    avg_payment_time: 0,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTimeframe, setSelectedTimeframe] = useState("30d");
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);
  const [showCommissionDetails, setShowCommissionDetails] = useState(false);
  const [selectedCommission, setSelectedCommission] = useState<CommissionRecord | null>(null);

  useEffect(() => {
    loadData();
  }, [selectedTimeframe]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Mock data since we don't have actual deals/clients tables yet
      const mockDeals = [
        {
          id: '1',
          title: 'Green Energy Expo 2026 - Premium Package',
          client_id: '1',
          value: 250000,
          status: 'Closed Won',
          created_at: '2026-01-05T10:00:00Z',
          updated_at: '2026-01-08T15:30:00Z'
        },
        {
          id: '2',
          title: 'Solar Technology Summit - Platinum Sponsorship',
          client_id: '2',
          value: 180000,
          status: 'Closed Won',
          created_at: '2026-01-03T14:20:00Z',
          updated_at: '2026-01-07T11:45:00Z'
        },
        {
          id: '3',
          title: 'Wind Power Conference - Gold Package',
          client_id: '3',
          value: 120000,
          status: 'Negotiation',
          created_at: '2026-01-08T09:15:00Z',
          updated_at: '2026-01-10T16:20:00Z'
        },
        {
          id: '4',
          title: 'Clean Tech Innovation Fair - Diamond Tier',
          client_id: '4',
          value: 320000,
          status: 'Closed Won',
          created_at: '2026-01-02T11:30:00Z',
          updated_at: '2026-01-06T14:15:00Z'
        },
        {
          id: '5',
          title: 'Energy Storage Expo - Silver Package',
          client_id: '5',
          value: 85000,
          status: 'Proposal',
          created_at: '2026-01-09T13:45:00Z',
          updated_at: '2026-01-10T10:30:00Z'
        }
      ];

      const mockClients = [
        { id: '1', name: 'Tesla Energy Solutions' },
        { id: '2', name: 'SolarMax Technologies' },
        { id: '3', name: 'WindTech Industries' },
        { id: '4', name: 'CleanTech Innovations' },
        { id: '5', name: 'PowerGrid Systems' }
      ];

      // Generate payment records based on deals
      const paymentRecords: PaymentRecord[] = [];
      const commissionRecords: CommissionRecord[] = [];

      mockDeals.forEach(deal => {
        const client = mockClients.find(c => c.id === deal.client_id);
        
        if (deal.value && deal.value > 0) {
          // Generate payment schedule based on 30/40/30 plan
          const initialAmount = deal.value * PAYMENT_PLAN_CONFIG.initial;
          const progressAmount = deal.value * PAYMENT_PLAN_CONFIG.progress;
          const finalAmount = deal.value * PAYMENT_PLAN_CONFIG.final;
          const baseDate = new Date(deal.created_at);
          
          // Initial payment (due immediately)
          paymentRecords.push({
            id: `payment_${deal.id}_1`,
            deal_id: deal.id,
            deal_title: deal.title,
            client_id: deal.client_id,
            client_name: client?.name || 'Unknown Client',
            amount: initialAmount,
            due_date: baseDate.toISOString(),
            paid_date: deal.status === 'Closed Won' ? baseDate.toISOString() : undefined,
            status: deal.status === 'Closed Won' ? 'paid' : 
                   new Date() > baseDate ? 'overdue' : 'pending',
            payment_type: 'initial',
            installment_number: 1,
            total_installments: 3,
            method: deal.status === 'Closed Won' ? 'bank_transfer' : undefined,
            reference: deal.status === 'Closed Won' ? `REF-${deal.id}-001` : undefined,
            commission_triggered: deal.status === 'Closed Won'
          });

          // Progress payment (due 30 days after initial)
          const progressDate = new Date(baseDate);
          progressDate.setDate(progressDate.getDate() + 30);
          
          paymentRecords.push({
            id: `payment_${deal.id}_2`,
            deal_id: deal.id,
            deal_title: deal.title,
            client_id: deal.client_id,
            client_name: client?.name || 'Unknown Client',
            amount: progressAmount,
            due_date: progressDate.toISOString(),
            paid_date: deal.status === 'Closed Won' && Math.random() > 0.3 ? progressDate.toISOString() : undefined,
            status: deal.status === 'Closed Won' && Math.random() > 0.3 ? 'paid' : 
                   new Date() > progressDate ? 'overdue' : 'pending',
            payment_type: 'progress',
            installment_number: 2,
            total_installments: 3,
            method: deal.status === 'Closed Won' && Math.random() > 0.3 ? 'bank_transfer' : undefined,
            reference: deal.status === 'Closed Won' && Math.random() > 0.3 ? `REF-${deal.id}-002` : undefined
          });

          // Final payment (due 60 days after initial)
          const finalDate = new Date(baseDate);
          finalDate.setDate(finalDate.getDate() + 60);
          
          paymentRecords.push({
            id: `payment_${deal.id}_3`,
            deal_id: deal.id,
            deal_title: deal.title,
            client_id: deal.client_id,
            client_name: client?.name || 'Unknown Client',
            amount: finalAmount,
            due_date: finalDate.toISOString(),
            paid_date: deal.status === 'Closed Won' && Math.random() > 0.7 ? finalDate.toISOString() : undefined,
            status: deal.status === 'Closed Won' && Math.random() > 0.7 ? 'paid' : 
                   new Date() > finalDate ? 'overdue' : 'pending',
            payment_type: 'final',
            installment_number: 3,
            total_installments: 3,
            method: deal.status === 'Closed Won' && Math.random() > 0.7 ? 'bank_transfer' : undefined,
            reference: deal.status === 'Closed Won' && Math.random() > 0.7 ? `REF-${deal.id}-003` : undefined
          });

          // Generate commission records for closed deals
          if (deal.status === 'Closed Won') {
            // Sales person commission (5%)
            commissionRecords.push({
              id: `commission_${deal.id}_sales`,
              deal_id: deal.id,
              deal_title: deal.title,
              user_id: 'user_sales_1',
              user_name: 'Sarah Johnson',
              user_role: 'Sales Manager',
              percentage: 5,
              amount: deal.value * 0.05,
              status: 'approved',
              trigger_event: 'deal_closed',
              created_at: deal.updated_at || deal.created_at,
              approved_at: deal.updated_at || deal.created_at,
              notes: 'Primary sales commission'
            });

            // Account manager commission (2%)
            commissionRecords.push({
              id: `commission_${deal.id}_account`,
              deal_id: deal.id,
              deal_title: deal.title,
              user_id: 'user_account_1',
              user_name: 'Mike Chen',
              user_role: 'Account Manager',
              percentage: 2,
              amount: deal.value * 0.02,
              status: 'pending',
              trigger_event: 'payment_received',
              created_at: deal.updated_at || deal.created_at,
              notes: 'Account management commission'
            });
          }
        }
      });

      // Calculate metrics
      const totalRevenue = paymentRecords
        .filter(p => p.status === 'paid')
        .reduce((sum, p) => sum + p.amount, 0);
      
      const paymentsCollected = paymentRecords
        .filter(p => p.status === 'paid')
        .reduce((sum, p) => sum + p.amount, 0);
      
      const paymentsPending = paymentRecords
        .filter(p => p.status === 'pending')
        .reduce((sum, p) => sum + p.amount, 0);
      
      const paymentsOverdue = paymentRecords
        .filter(p => p.status === 'overdue')
        .reduce((sum, p) => sum + p.amount, 0);

      const commissionPending = commissionRecords
        .filter(c => c.status === 'pending' || c.status === 'approved')
        .reduce((sum, c) => sum + c.amount, 0);
      
      const commissionPaid = commissionRecords
        .filter(c => c.status === 'paid')
        .reduce((sum, c) => sum + c.amount, 0);

      const totalPayments = paymentsCollected + paymentsPending + paymentsOverdue;
      const collectionRate = totalPayments > 0 ? (paymentsCollected / totalPayments) * 100 : 0;

      setMetrics({
        total_revenue: totalRevenue,
        monthly_revenue: totalRevenue * 0.3, // Mock monthly revenue
        revenue_growth: 12.5, // Mock growth rate
        payments_collected: paymentsCollected,
        payments_pending: paymentsPending,
        payments_overdue: paymentsOverdue,
        commission_pending: commissionPending,
        commission_paid: commissionPaid,
        collection_rate: collectionRate,
        avg_payment_time: 18, // Mock average payment time in days
      });

      setPayments(paymentRecords);
      setCommissions(commissionRecords);
      setDeals(mockDeals);
      setClients(mockClients);

    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load financial data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendPaymentReminder = async (paymentId: string) => {
    try {
      setPayments(prev => prev.map(p => 
        p.id === paymentId 
          ? { ...p, reminder_sent: true }
          : p
      ));

      toast({
        title: "Success",
        description: "Payment reminder sent successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to send payment reminder",
        variant: "destructive",
      });
    }
  };

  const approveCommission = async (commissionId: string) => {
    try {
      setCommissions(prev => prev.map(c => 
        c.id === commissionId 
          ? { 
              ...c, 
              status: 'approved',
              approved_at: new Date().toISOString()
            }
          : c
      ));

      toast({
        title: "Success",
        description: "Commission approved successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to approve commission",
        variant: "destructive",
      });
    }
  };

  const markCommissionPaid = async (commissionId: string) => {
    try {
      setCommissions(prev => prev.map(c => 
        c.id === commissionId 
          ? { 
              ...c, 
              status: 'paid',
              paid_at: new Date().toISOString()
            }
          : c
      ));

      toast({
        title: "Success",
        description: "Commission marked as paid",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update commission status",
        variant: "destructive",
      });
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = searchTerm === "" || 
      payment.deal_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.client_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Overdue</Badge>;
      case 'partial':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Partial</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getCommissionStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case 'approved':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Approved</Badge>;
      case 'paid':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Paid</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPaymentTypeLabel = (type: string) => {
    switch (type) {
      case 'initial': return 'Initial (30%)';
      case 'progress': return 'Progress (40%)';
      case 'final': return 'Final (30%)';
      case 'full': return 'Full Payment';
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
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
      <div className="flex items-center justify-between">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-green-600" />
            Financial Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Payment tracking, commission management, and financial analytics
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-40">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={loadData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold">{formatCurrency(metrics.total_revenue)}</p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600 font-medium">
                +{formatPercentage(metrics.revenue_growth)} growth
              </span>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>This Month</span>
                <span className="font-medium">{formatCurrency(metrics.monthly_revenue)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Payments Collected</p>
                <p className="text-3xl font-bold">{formatCurrency(metrics.payments_collected)}</p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <Target className="w-4 h-4 text-blue-600 mr-1" />
              <span className="text-sm text-blue-600 font-medium">
                {formatPercentage(metrics.collection_rate)} collection rate
              </span>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Avg payment time: {metrics.avg_payment_time} days
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Payments</p>
                <p className="text-3xl font-bold">{formatCurrency(metrics.payments_pending)}</p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <AlertTriangle className="w-4 h-4 text-red-600 mr-1" />
              <span className="text-sm text-red-600 font-medium">
                {formatCurrency(metrics.payments_overdue)} overdue
              </span>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Requires immediate attention
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Commission Pending</p>
                <p className="text-3xl font-bold">{formatCurrency(metrics.commission_pending)}</p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <CheckCircle2 className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600 font-medium">
                {formatCurrency(metrics.commission_paid)} paid out
              </span>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Team performance incentives
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="payments" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="payments">
            Payments ({payments.length})
          </TabsTrigger>
          <TabsTrigger value="commissions">
            Commissions ({commissions.length})
          </TabsTrigger>
          <TabsTrigger value="analytics">
            Analytics
          </TabsTrigger>
          <TabsTrigger value="reports">
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="space-y-6">
          {/* Payment Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      placeholder="Search payments..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                      <SelectItem value="partial">Partial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payments Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left p-4 font-medium text-gray-900">Deal & Client</th>
                      <th className="text-left p-4 font-medium text-gray-900">Payment Type</th>
                      <th className="text-left p-4 font-medium text-gray-900">Amount</th>
                      <th className="text-left p-4 font-medium text-gray-900">Due Date</th>
                      <th className="text-left p-4 font-medium text-gray-900">Status</th>
                      <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.map((payment) => (
                      <tr key={payment.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">
                          <div>
                            <div className="font-medium text-gray-900">{payment.deal_title}</div>
                            <div className="text-sm text-gray-600">{payment.client_name}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <div className="font-medium">{getPaymentTypeLabel(payment.payment_type)}</div>
                            <div className="text-sm text-gray-600">
                              {payment.installment_number}/{payment.total_installments}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium">{formatCurrency(payment.amount)}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium">{new Date(payment.due_date).toLocaleDateString()}</div>
                          {payment.paid_date && (
                            <div className="text-sm text-green-600">
                              Paid: {new Date(payment.paid_date).toLocaleDateString()}
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          {getPaymentStatusBadge(payment.status)}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedPayment(payment);
                                setShowPaymentDetails(true);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {payment.status === 'overdue' && !payment.reminder_sent && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => sendPaymentReminder(payment.id)}
                              >
                                <Send className="w-4 h-4" />
                              </Button>
                            )}
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commissions" className="space-y-6">
          {/* Commissions List */}
          <div className="space-y-4">
            {commissions.map((commission) => (
              <Card key={commission.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                        <span className="text-sm font-medium text-blue-600">
                          {commission.user_name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{commission.user_name}</h3>
                          <Badge variant="secondary">{commission.user_role}</Badge>
                          {getCommissionStatusBadge(commission.status)}
                        </div>
                        <p className="text-gray-600 mb-2">{commission.deal_title}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Commission:</span>
                            <span className="font-medium ml-1">{commission.percentage}%</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Amount:</span>
                            <span className="font-medium ml-1">{formatCurrency(commission.amount)}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Trigger:</span>
                            <span className="font-medium ml-1">{commission.trigger_event.replace('_', ' ')}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Created:</span>
                            <span className="font-medium ml-1">{new Date(commission.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        {commission.notes && (
                          <div className="mt-2 text-sm text-gray-600">
                            <span className="font-medium">Notes:</span> {commission.notes}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {commission.status === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => approveCommission(commission.id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                      )}
                      {commission.status === 'approved' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => markCommissionPaid(commission.id)}
                        >
                          <DollarSign className="w-4 h-4 mr-2" />
                          Mark Paid
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedCommission(commission);
                          setShowCommissionDetails(true);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Revenue analytics chart will be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Distribution</CardTitle>
                <CardDescription>Payment status breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-center">
                    <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Payment distribution chart will be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Financial reports and export functionality will be available here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Payment Details Dialog */}
      <Dialog open={showPaymentDetails} onOpenChange={setShowPaymentDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Deal</label>
                  <p className="font-medium">{selectedPayment.deal_title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Client</label>
                  <p className="font-medium">{selectedPayment.client_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Payment Type</label>
                  <p className="font-medium">{getPaymentTypeLabel(selectedPayment.payment_type)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Amount</label>
                  <p className="font-medium">{formatCurrency(selectedPayment.amount)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Due Date</label>
                  <p className="font-medium">{new Date(selectedPayment.due_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <div>{getPaymentStatusBadge(selectedPayment.status)}</div>
                </div>
              </div>

              {selectedPayment.paid_date && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <h4 className="font-medium text-green-900">Payment Received</h4>
                      <p className="text-sm text-green-700">
                        Paid on {new Date(selectedPayment.paid_date).toLocaleDateString()}
                        {selectedPayment.method && ` via ${selectedPayment.method.replace('_', ' ')}`}
                        {selectedPayment.reference && ` (Ref: ${selectedPayment.reference})`}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {selectedPayment.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Notes</label>
                  <p className="text-gray-900">{selectedPayment.notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentDetails(false)}>
              Close
            </Button>
            {selectedPayment?.status === 'overdue' && (
              <Button
                onClick={() => {
                  sendPaymentReminder(selectedPayment.id);
                  setShowPaymentDetails(false);
                }}
              >
                <Send className="w-4 h-4 mr-2" />
                Send Reminder
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Commission Details Dialog */}
      <Dialog open={showCommissionDetails} onOpenChange={setShowCommissionDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Commission Details</DialogTitle>
          </DialogHeader>
          {selectedCommission && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Employee</label>
                  <p className="font-medium">{selectedCommission.user_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Role</label>
                  <p className="font-medium">{selectedCommission.user_role}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Deal</label>
                  <p className="font-medium">{selectedCommission.deal_title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Commission Rate</label>
                  <p className="font-medium">{selectedCommission.percentage}%</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Amount</label>
                  <p className="font-medium">{formatCurrency(selectedCommission.amount)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <div>{getCommissionStatusBadge(selectedCommission.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Trigger Event</label>
                  <p className="font-medium">{selectedCommission.trigger_event.replace('_', ' ')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Created</label>
                  <p className="font-medium">{new Date(selectedCommission.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              {selectedCommission.approved_at && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                    <div>
                      <h4 className="font-medium text-blue-900">Commission Approved</h4>
                      <p className="text-sm text-blue-700">
                        Approved on {new Date(selectedCommission.approved_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {selectedCommission.paid_at && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <div>
                      <h4 className="font-medium text-green-900">Commission Paid</h4>
                      <p className="text-sm text-green-700">
                        Paid on {new Date(selectedCommission.paid_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {selectedCommission.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Notes</label>
                  <p className="text-gray-900">{selectedCommission.notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCommissionDetails(false)}>
              Close
            </Button>
            {selectedCommission?.status === 'pending' && (
              <Button
                onClick={() => {
                  approveCommission(selectedCommission.id);
                  setShowCommissionDetails(false);
                }}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve Commission
              </Button>
            )}
            {selectedCommission?.status === 'approved' && (
              <Button
                onClick={() => {
                  markCommissionPaid(selectedCommission.id);
                  setShowCommissionDetails(false);
                }}
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Mark as Paid
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Finance;