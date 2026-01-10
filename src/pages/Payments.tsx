import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  CreditCard,
  Calendar,
  DollarSign,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Download,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface Deal {
  id: string;
  deal_name: string;
  value_egp: number;
  clients_2026_01_10?: {
    client_name: string;
  };
}

interface PaymentSchedule {
  id: string;
  deal_id: string;
  payment_number: number;
  amount_egp: number;
  due_date: string;
  status: string;
  payment_method?: string;
  transaction_reference?: string;
  notes?: string;
  created_at: string;
  deals_2026_01_10?: Deal;
}

interface PaymentFormData {
  deal_id: string;
  payment_number: string;
  amount_egp: string;
  due_date: string;
  status: string;
  payment_method: string;
  transaction_reference: string;
  notes: string;
}

export default function Payments() {
  const { toast } = useToast();
  const [payments, setPayments] = useState<PaymentSchedule[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [isEditPaymentOpen, setIsEditPaymentOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<PaymentSchedule | null>(null);

  // Payment statuses and methods from system settings
  const paymentStatuses = ['Pending', 'Paid', 'Overdue', 'Cancelled', 'Refunded'];
  const paymentMethods = ['Bank Transfer', 'Credit Card', 'Cash', 'Check', 'Online Payment'];

  // Form data state
  const [formData, setFormData] = useState<PaymentFormData>({
    deal_id: '',
    payment_number: '',
    amount_egp: '',
    due_date: '',
    status: '',
    payment_method: '',
    transaction_reference: '',
    notes: ''
  });

  useEffect(() => {
    fetchPayments();
    fetchDeals();
  }, []);

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_schedules_2026_01_10')
        .select(`
          *,
          deals_2026_01_10 (
            id,
            deal_name,
            value_egp,
            clients_2026_01_10 (
              client_name
            )
          )
        `)
        .order('due_date', { ascending: true });

      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch payment schedules',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDeals = async () => {
    try {
      const { data, error } = await supabase
        .from('deals_2026_01_10')
        .select(`
          id,
          deal_name,
          value_egp,
          clients_2026_01_10 (
            client_name
          )
        `)
        .in('stage', ['Qualified', 'Proposal', 'Negotiation', 'Closed Won'])
        .order('deal_name');

      if (error) throw error;
      setDeals(data || []);
    } catch (error) {
      console.error('Error fetching deals:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const submitData = {
        ...formData,
        payment_number: parseInt(formData.payment_number),
        amount_egp: parseFloat(formData.amount_egp),
      };

      const { error } = await supabase
        .from('payment_schedules_2026_01_10')
        .insert([submitData]);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Payment schedule created successfully',
      });

      setIsAddPaymentOpen(false);
      resetForm();
      fetchPayments();
    } catch (error) {
      console.error('Error creating payment schedule:', error);
      toast({
        title: 'Error',
        description: 'Failed to create payment schedule',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (payment: PaymentSchedule) => {
    setEditingPayment(payment);
    setFormData({
      deal_id: payment.deal_id,
      payment_number: payment.payment_number.toString(),
      amount_egp: payment.amount_egp.toString(),
      due_date: payment.due_date,
      status: payment.status,
      payment_method: payment.payment_method || '',
      transaction_reference: payment.transaction_reference || '',
      notes: payment.notes || ''
    });
    setIsEditPaymentOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPayment) return;
    
    setSubmitting(true);

    try {
      const submitData = {
        ...formData,
        payment_number: parseInt(formData.payment_number),
        amount_egp: parseFloat(formData.amount_egp),
      };

      const { error } = await supabase
        .from('payment_schedules_2026_01_10')
        .update(submitData)
        .eq('id', editingPayment.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Payment schedule updated successfully',
      });

      setIsEditPaymentOpen(false);
      setEditingPayment(null);
      resetForm();
      fetchPayments();
    } catch (error) {
      console.error('Error updating payment schedule:', error);
      toast({
        title: 'Error',
        description: 'Failed to update payment schedule',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (paymentId: string) => {
    if (!confirm('Are you sure you want to delete this payment schedule?')) return;

    try {
      const { error } = await supabase
        .from('payment_schedules_2026_01_10')
        .delete()
        .eq('id', paymentId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Payment schedule deleted successfully',
      });

      fetchPayments();
    } catch (error) {
      console.error('Error deleting payment schedule:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete payment schedule',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      deal_id: '',
      payment_number: '',
      amount_egp: '',
      due_date: '',
      status: '',
      payment_method: '',
      transaction_reference: '',
      notes: ''
    });
  };

  const handleRefresh = () => {
    fetchPayments();
  };

  const handleExport = () => {
    console.log('Exporting payment schedules data...');
  };

  // Calculate metrics
  const totalPayments = payments.length;
  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount_egp, 0);
  const paidPayments = payments.filter(payment => payment.status === 'Paid').length;
  const pendingPayments = payments.filter(payment => payment.status === 'Pending').length;
  const overduePayments = payments.filter(payment => {
    return payment.status === 'Overdue' || 
           (payment.status === 'Pending' && new Date(payment.due_date) < new Date());
  }).length;
  const paidAmount = payments
    .filter(payment => payment.status === 'Paid')
    .reduce((sum, payment) => sum + payment.amount_egp, 0);

  const getStatusColor = (status: string, dueDate: string) => {
    if (status === 'Paid') return 'bg-green-100 text-green-800';
    if (status === 'Overdue' || (status === 'Pending' && new Date(dueDate) < new Date())) {
      return 'bg-red-100 text-red-800';
    }
    if (status === 'Pending') return 'bg-yellow-100 text-yellow-800';
    if (status === 'Cancelled') return 'bg-gray-100 text-gray-800';
    if (status === 'Refunded') return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string, dueDate: string) => {
    if (status === 'Paid') return <CheckCircle2 className="w-4 h-4" />;
    if (status === 'Overdue' || (status === 'Pending' && new Date(dueDate) < new Date())) {
      return <AlertTriangle className="w-4 h-4" />;
    }
    if (status === 'Pending') return <Clock className="w-4 h-4" />;
    if (status === 'Cancelled') return <XCircle className="w-4 h-4" />;
    return <Clock className="w-4 h-4" />;
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.deals_2026_01_10?.deal_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.deals_2026_01_10?.clients_2026_01_10?.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.transaction_reference?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const PaymentForm = ({ onSubmit, isEdit = false }: { onSubmit: (e: React.FormEvent) => void; isEdit?: boolean }) => (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="deal_id">Deal *</Label>
          <Select value={formData.deal_id} onValueChange={(value) => setFormData({...formData, deal_id: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select deal" />
            </SelectTrigger>
            <SelectContent>
              {deals.map(deal => (
                <SelectItem key={deal.id} value={deal.id}>
                  {deal.deal_name} - {deal.clients_2026_01_10?.client_name} (EGP {deal.value_egp.toLocaleString()})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="payment_number">Payment Number *</Label>
          <Input 
            id="payment_number" 
            type="number"
            min="1"
            value={formData.payment_number}
            onChange={(e) => setFormData({...formData, payment_number: e.target.value})}
            placeholder="Enter payment number" 
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount_egp">Amount (EGP) *</Label>
          <Input 
            id="amount_egp" 
            type="number"
            step="0.01"
            value={formData.amount_egp}
            onChange={(e) => setFormData({...formData, amount_egp: e.target.value})}
            placeholder="Enter payment amount" 
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="due_date">Due Date *</Label>
          <Input 
            id="due_date" 
            type="date"
            value={formData.due_date}
            onChange={(e) => setFormData({...formData, due_date: e.target.value})}
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status *</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {paymentStatuses.map(status => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="payment_method">Payment Method</Label>
          <Select value={formData.payment_method} onValueChange={(value) => setFormData({...formData, payment_method: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              {paymentMethods.map(method => (
                <SelectItem key={method} value={method}>{method}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-2 space-y-2">
          <Label htmlFor="transaction_reference">Transaction Reference</Label>
          <Input 
            id="transaction_reference" 
            value={formData.transaction_reference}
            onChange={(e) => setFormData({...formData, transaction_reference: e.target.value})}
            placeholder="Enter transaction reference or ID" 
          />
        </div>
        <div className="col-span-2 space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea 
            id="notes" 
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            placeholder="Enter additional notes" 
          />
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => {
            if (isEdit) {
              setIsEditPaymentOpen(false);
              setEditingPayment(null);
            } else {
              setIsAddPaymentOpen(false);
            }
            resetForm();
          }}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : null}
          {isEdit ? 'Update Payment' : 'Create Payment'}
        </Button>
      </div>
    </form>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <CreditCard className="w-8 h-8 text-blue-600" />
            Payment Schedules
          </h1>
          <p className="text-gray-600 mt-1">Manage payment schedules and track transactions</p>
          <div className="flex items-center gap-4 mt-4">
            <Badge className="bg-blue-100 text-blue-800">
              {totalPayments} Total Payments
            </Badge>
            <Badge className="bg-green-100 text-green-800">
              {paidPayments} Paid
            </Badge>
            <Badge className="bg-red-100 text-red-800">
              {overduePayments} Overdue
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Dialog open={isAddPaymentOpen} onOpenChange={setIsAddPaymentOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Payment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Payment Schedule</DialogTitle>
                <DialogDescription>
                  Create a new payment schedule for a deal.
                </DialogDescription>
              </DialogHeader>
              <PaymentForm onSubmit={handleSubmit} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">EGP {totalAmount.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Paid Amount</p>
                <p className="text-2xl font-bold text-green-600">EGP {paidAmount.toLocaleString()}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Paid Payments</p>
                <p className="text-2xl font-bold text-green-600">{paidPayments}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingPayments}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{overduePayments}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Collection Rate</p>
                <p className="text-2xl font-bold text-blue-600">
                  {totalPayments > 0 ? ((paidPayments / totalPayments) * 100).toFixed(1) : 0}%
                </p>
              </div>
              <CreditCard className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {paymentStatuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Schedules</CardTitle>
          <CardDescription>
            {filteredPayments.length} payments found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment</TableHead>
                <TableHead>Deal & Client</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Payment #{payment.payment_number}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(payment.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{payment.deals_2026_01_10?.deal_name}</p>
                      <p className="text-sm text-gray-600">{payment.deals_2026_01_10?.clients_2026_01_10?.client_name}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">
                    EGP {payment.amount_egp.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="w-3 h-3" />
                      {new Date(payment.due_date).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(payment.status, payment.due_date)} variant="secondary">
                      {getStatusIcon(payment.status, payment.due_date)}
                      <span className="ml-1">{payment.status}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">
                      {payment.payment_method || 'Not specified'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">
                      {payment.transaction_reference || 'N/A'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(payment)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Payment
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDelete(payment.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Payment
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Payment Dialog */}
      <Dialog open={isEditPaymentOpen} onOpenChange={setIsEditPaymentOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Payment Schedule</DialogTitle>
            <DialogDescription>
              Update payment schedule information.
            </DialogDescription>
          </DialogHeader>
          <PaymentForm onSubmit={handleUpdate} isEdit={true} />
        </DialogContent>
      </Dialog>
    </div>
  );
}