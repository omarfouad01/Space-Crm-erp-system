import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ticketService } from "@/services/supabaseService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Ticket,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle,
  Eye,
  Edit,
  Trash2,
  MessageSquare,
  Paperclip,
  Flag,
  User,
  Calendar,
  RefreshCw,
  Download,
  TrendingUp,
  BarChart3,
  Activity
} from "lucide-react";

const Tickets = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all-status");
  const [priorityFilter, setPriorityFilter] = useState("all-priority");
  const [categoryFilter, setCategoryFilter] = useState("all-categories");
  
  // Dialog states
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [ticketToDelete, setTicketToDelete] = useState(null);
  
  // Form data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'Medium',
    status: 'Open',
    assignee_name: '',
    client_name: '',
    due_date: '',
    tags: ''
  });

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      console.log('🎫 Tickets: Loading tickets...');
      
      // For now, we'll create mock tickets since the API might not have this endpoint
      // In a real implementation, you'd call: const ticketsData = await ticketService.getAll();
      const mockTickets = [
        {
          id: '1',
          ticket_number: 'TKT-001',
          title: 'Exhibition booth setup issue',
          description: 'Client experiencing difficulties with booth setup process and needs immediate assistance',
          category: 'Technical Support',
          priority: 'High',
          status: 'Open',
          assignee_name: 'Sarah Johnson',
          client_name: 'ABC Corporation',
          reporter_name: 'John Smith',
          due_date: '2026-01-15',
          created_at: '2026-01-10T09:00:00Z',
          tags: ['Booth', 'Setup', 'Urgent'],
          comments: [{ count: 3 }],
          attachments: [{ count: 2 }]
        },
        {
          id: '2',
          ticket_number: 'TKT-002',
          title: 'Payment processing error',
          description: 'Sponsorship payment failed to process through the system',
          category: 'Billing',
          priority: 'Critical',
          status: 'In Progress',
          assignee_name: 'Ahmed Hassan',
          client_name: 'XYZ Industries',
          reporter_name: 'Lisa Chen',
          due_date: '2026-01-12',
          created_at: '2026-01-09T14:30:00Z',
          tags: ['Payment', 'Billing', 'Critical'],
          comments: [{ count: 5 }],
          attachments: [{ count: 1 }]
        },
        {
          id: '3',
          ticket_number: 'TKT-003',
          title: 'Access credentials request',
          description: 'New team member needs access to exhibition management portal',
          category: 'Access Request',
          priority: 'Medium',
          status: 'Pending Review',
          assignee_name: 'Mohamed Ali',
          client_name: 'Tech Solutions Ltd',
          reporter_name: 'David Wilson',
          due_date: '2026-01-18',
          created_at: '2026-01-08T11:15:00Z',
          tags: ['Access', 'Credentials'],
          comments: [{ count: 2 }],
          attachments: [{ count: 0 }]
        },
        {
          id: '4',
          ticket_number: 'TKT-004',
          title: 'Marketing material approval',
          description: 'Sponsor logo placement needs final approval before printing',
          category: 'Marketing',
          priority: 'Low',
          status: 'Resolved',
          assignee_name: 'Fatima Omar',
          client_name: 'Global Marketing Inc',
          reporter_name: 'Emma Thompson',
          due_date: '2026-01-14',
          created_at: '2026-01-07T16:45:00Z',
          tags: ['Marketing', 'Approval'],
          comments: [{ count: 4 }],
          attachments: [{ count: 3 }]
        },
        {
          id: '5',
          ticket_number: 'TKT-005',
          title: 'Venue layout modification',
          description: 'Request to modify booth layout due to equipment size constraints',
          category: 'Venue Management',
          priority: 'Medium',
          status: 'Open',
          assignee_name: null,
          client_name: 'Innovation Hub',
          reporter_name: 'Michael Brown',
          due_date: '2026-01-20',
          created_at: '2026-01-09T10:20:00Z',
          tags: ['Venue', 'Layout'],
          comments: [{ count: 1 }],
          attachments: [{ count: 1 }]
        }
      ];
      
      console.log('✅ Tickets: Loaded tickets:', mockTickets.length);
      setTickets(mockTickets);
      
      if (mockTickets.length === 0) {
        toast({
          title: "No Tickets Found",
          description: "No tickets found in the system. Create your first ticket!",
        });
      }
    } catch (error) {
      console.error('🚨 Tickets: Error loading tickets:', error);
      toast({
        title: "Loading Error",
        description: "Failed to load tickets. Please try again.",
        variant: "destructive",
      });
      
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async () => {
    try {
      const ticketData = {
        ...formData,
        ticket_number: `TKT-${String(tickets.length + 1).padStart(3, '0')}`,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        created_at: new Date().toISOString(),
        reporter_name: 'Current User', // In real app, get from auth
        comments: [{ count: 0 }],
        attachments: [{ count: 0 }]
      };

      // In a real implementation, you'd call: await ticketService.create(ticketData);
      console.log('Creating ticket:', ticketData);
      
      toast({
        title: "Ticket Created",
        description: `Ticket ${ticketData.ticket_number} has been created successfully`,
      });

      setShowCreateDialog(false);
      resetForm();
      loadTickets();
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast({
        title: "Error",
        description: "Failed to create ticket",
        variant: "destructive",
      });
    }
  };

  const handleEditTicket = (ticket) => {
    setEditingTicket(ticket);
    setFormData({
      title: ticket.title || '',
      description: ticket.description || '',
      category: ticket.category || '',
      priority: ticket.priority || 'Medium',
      status: ticket.status || 'Open',
      assignee_name: ticket.assignee_name || '',
      client_name: ticket.client_name || '',
      due_date: ticket.due_date || '',
      tags: ticket.tags ? ticket.tags.join(', ') : ''
    });
    setShowEditDialog(true);
  };

  const handleUpdateTicket = async () => {
    try {
      if (!editingTicket) return;

      const ticketData = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
      };

      // In a real implementation, you'd call: await ticketService.update(editingTicket.id, ticketData);
      console.log('Updating ticket:', ticketData);
      
      toast({
        title: "Ticket Updated",
        description: `Ticket ${editingTicket.ticket_number} has been updated successfully`,
      });

      setShowEditDialog(false);
      setEditingTicket(null);
      resetForm();
      loadTickets();
    } catch (error) {
      console.error("Error updating ticket:", error);
      toast({
        title: "Error",
        description: "Failed to update ticket",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTicket = (ticket) => {
    setTicketToDelete(ticket);
    setShowDeleteDialog(true);
  };

  const confirmDeleteTicket = async () => {
    if (!ticketToDelete) return;
    
    try {
      // In a real implementation, you'd call: await ticketService.delete(ticketToDelete.id);
      console.log('Deleting ticket:', ticketToDelete.id);
      
      toast({
        title: "Ticket Deleted",
        description: `Ticket ${ticketToDelete.ticket_number} has been deleted successfully`,
      });
      
      loadTickets();
    } catch (error) {
      console.error('Error deleting ticket:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete ticket",
        variant: "destructive",
      });
    } finally {
      setShowDeleteDialog(false);
      setTicketToDelete(null);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      priority: 'Medium',
      status: 'Open',
      assignee_name: '',
      client_name: '',
      due_date: '',
      tags: ''
    });
  };

  const handleExport = () => {
    try {
      const csvContent = [
        ['Ticket Number', 'Title', 'Category', 'Priority', 'Status', 'Assignee', 'Client', 'Created Date', 'Due Date'].join(','),
        ...filteredTickets.map(ticket => [
          ticket.ticket_number || '',
          `"${ticket.title || ''}"`,
          ticket.category || '',
          ticket.priority || '',
          ticket.status || '',
          ticket.assignee_name || '',
          ticket.client_name || '',
          ticket.created_at ? new Date(ticket.created_at).toLocaleDateString() : '',
          ticket.due_date || ''
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tickets-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: `Exported ${filteredTickets.length} tickets to CSV`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export tickets",
        variant: "destructive",
      });
    }
  };

  // Filter tickets based on search and filters
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = searchTerm === "" || 
      ticket.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.ticket_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ticket.client_name && ticket.client_name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === "all-status" || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === "all-priority" || ticket.priority === priorityFilter;
    const matchesCategory = categoryFilter === "all-categories" || ticket.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const ticketStats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'Open').length,
    inProgress: tickets.filter(t => t.status === 'In Progress').length,
    resolved: tickets.filter(t => t.status === 'Resolved').length,
    high: tickets.filter(t => t.priority === 'High' || t.priority === 'Critical').length
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'In Progress': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Pending Review': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'Closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  const categories = [...new Set(tickets.map(t => t.category).filter(Boolean))];

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-12">
            <div className="flex items-center justify-center">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mr-3" />
              <p className="text-lg text-gray-600">Loading tickets...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Ticket className="w-8 h-8 text-blue-600" />
            Support Tickets
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and track support tickets across the organization
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExport} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button 
            onClick={() => loadTickets()} 
            variant="outline" 
            size="sm"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
          <Button 
            onClick={() => setShowCreateDialog(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Ticket
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tickets</p>
                <p className="text-2xl font-bold">{ticketStats.total}</p>
              </div>
              <Ticket className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Open</p>
                <p className="text-2xl font-bold">{ticketStats.open}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold">{ticketStats.inProgress}</p>
              </div>
              <Activity className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold">{ticketStats.resolved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Priority</p>
                <p className="text-2xl font-bold">{ticketStats.high}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-status">All Status</SelectItem>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Pending Review">Pending Review</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-priority">All Priority</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-categories">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.length === 0 ? (
          <Card>
            <CardContent className="p-12">
              <div className="text-center">
                <Ticket className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Tickets Found</h3>
                <p className="text-gray-600 mb-6">
                  {tickets.length === 0 
                    ? "No tickets have been created yet. Create your first ticket to get started."
                    : "No tickets match your current filters. Try adjusting your search criteria."
                  }
                </p>
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Ticket
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredTickets.map((ticket) => (
            <Card key={ticket.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          #{ticket.ticket_number} - {ticket.title}
                        </h3>
                        <Badge className={getPriorityColor(ticket.priority)} variant="secondary">
                          <Flag className="w-3 h-3 mr-1" />
                          {ticket.priority}
                        </Badge>
                        <Badge className={getStatusColor(ticket.status)} variant="secondary">
                          {ticket.status}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-4">
                        {ticket.description}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleEditTicket(ticket)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteTicket(ticket)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Details */}
                  <div className="grid md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Assignee:</span>
                      <span className="font-medium">{ticket.assignee_name || 'Unassigned'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Due:</span>
                      <span className="font-medium">{formatDate(ticket.due_date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium">{ticket.category}</span>
                    </div>
                    {ticket.client_name && (
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">Client:</span>
                        <span className="font-medium">{ticket.client_name}</span>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {ticket.tags && ticket.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {ticket.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                      Created {formatDate(ticket.created_at)}
                      {ticket.reporter_name && (
                        <span> by {ticket.reporter_name}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      {ticket.comments && ticket.comments.length > 0 && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MessageSquare className="w-4 h-4" />
                          {ticket.comments[0].count || 0}
                        </div>
                      )}
                      {ticket.attachments && ticket.attachments.length > 0 && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Paperclip className="w-4 h-4" />
                          {ticket.attachments[0].count || 0}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create Ticket Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Ticket</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Enter ticket title"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe the issue or request"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technical Support">Technical Support</SelectItem>
                    <SelectItem value="Billing">Billing</SelectItem>
                    <SelectItem value="Access Request">Access Request</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Venue Management">Venue Management</SelectItem>
                    <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="assignee_name">Assignee</Label>
                <Input
                  id="assignee_name"
                  value={formData.assignee_name}
                  onChange={(e) => setFormData({...formData, assignee_name: e.target.value})}
                  placeholder="Assign to team member"
                />
              </div>
              <div>
                <Label htmlFor="client_name">Client</Label>
                <Input
                  id="client_name"
                  value={formData.client_name}
                  onChange={(e) => setFormData({...formData, client_name: e.target.value})}
                  placeholder="Client name"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="due_date">Due Date</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  placeholder="Enter tags separated by commas"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {setShowCreateDialog(false); resetForm();}}>
              Cancel
            </Button>
            <Button onClick={handleCreateTicket}>
              Create Ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Ticket Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Ticket</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="edit_title">Title *</Label>
                <Input
                  id="edit_title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Enter ticket title"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="edit_description">Description *</Label>
                <Textarea
                  id="edit_description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe the issue or request"
                />
              </div>
              <div>
                <Label htmlFor="edit_category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technical Support">Technical Support</SelectItem>
                    <SelectItem value="Billing">Billing</SelectItem>
                    <SelectItem value="Access Request">Access Request</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Venue Management">Venue Management</SelectItem>
                    <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit_priority">Priority</Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit_status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Pending Review">Pending Review</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit_assignee_name">Assignee</Label>
                <Input
                  id="edit_assignee_name"
                  value={formData.assignee_name}
                  onChange={(e) => setFormData({...formData, assignee_name: e.target.value})}
                  placeholder="Assign to team member"
                />
              </div>
              <div>
                <Label htmlFor="edit_client_name">Client</Label>
                <Input
                  id="edit_client_name"
                  value={formData.client_name}
                  onChange={(e) => setFormData({...formData, client_name: e.target.value})}
                  placeholder="Client name"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="edit_due_date">Due Date</Label>
                <Input
                  id="edit_due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="edit_tags">Tags (comma-separated)</Label>
                <Input
                  id="edit_tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  placeholder="Enter tags separated by commas"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {setShowEditDialog(false); setEditingTicket(null); resetForm();}}>
              Cancel
            </Button>
            <Button onClick={handleUpdateTicket}>
              Update Ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Ticket</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete ticket #{ticketToDelete?.ticket_number}? 
              This action cannot be undone and will permanently remove the ticket and all associated comments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteTicket} className="bg-red-600 hover:bg-red-700">
              Delete Ticket
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Tickets;