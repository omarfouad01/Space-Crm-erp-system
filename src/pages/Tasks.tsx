import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { taskService } from "@/services/supabaseService";
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
  CheckSquare,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Calendar,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle,
  Eye,
  Edit,
  Trash2,
  Flag,
  RefreshCw,
  Download,
  TrendingUp,
  Target,
  User,
  Link,
  PlayCircle,
  PauseCircle,
  XCircle
} from "lucide-react";

const Tasks = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all-status");
  const [priorityFilter, setPriorityFilter] = useState("all-priority");
  const [assigneeFilter, setAssigneeFilter] = useState("all-assignees");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'To Do',
    assigned_to_name: '',
    due_date: '',
    estimated_hours: '',
    tags: '',
    linked_type: '',
    linked_name: ''
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      console.log('📋 Tasks: Loading tasks...');
      
      // For now, we'll create mock tasks since the API might not have this endpoint
      // In a real implementation, you'd call: const data = await taskService.getAll();
      const mockTasks = [
        {
          id: '1',
          task_number: 'TSK-001',
          title: 'Prepare exhibition booth design',
          description: 'Create detailed booth layout and design specifications for upcoming tech expo',
          status: 'In Progress',
          priority: 'High',
          assigned_to_name: 'Sarah Johnson',
          due_date: '2026-01-15',
          estimated_hours: 8,
          progress: 65,
          tags: ['Design', 'Exhibition'],
          linked_type: 'Exhibition',
          linked_name: 'Tech Expo 2026',
          created_at: '2026-01-08T10:00:00Z'
        },
        {
          id: '2',
          task_number: 'TSK-002',
          title: 'Client follow-up call',
          description: 'Schedule and conduct follow-up call with potential sponsor',
          status: 'To Do',
          priority: 'Medium',
          assigned_to_name: 'Ahmed Hassan',
          due_date: '2026-01-12',
          estimated_hours: 2,
          progress: 0,
          tags: ['Client', 'Sales'],
          linked_type: 'Client',
          linked_name: 'ABC Corporation',
          created_at: '2026-01-09T14:30:00Z'
        },
        {
          id: '3',
          task_number: 'TSK-003',
          title: 'Update sponsorship packages',
          description: 'Review and update all sponsorship package details and pricing',
          status: 'Review',
          priority: 'Critical',
          assigned_to_name: 'Mohamed Ali',
          due_date: '2026-01-11',
          estimated_hours: 4,
          progress: 90,
          tags: ['Sponsorship', 'Pricing'],
          linked_type: 'Sponsorship',
          linked_name: 'Gold Package',
          created_at: '2026-01-07T09:15:00Z'
        },
        {
          id: '4',
          task_number: 'TSK-004',
          title: 'Venue inspection',
          description: 'Conduct final venue inspection and prepare checklist',
          status: 'Completed',
          priority: 'High',
          assigned_to_name: 'Fatima Omar',
          due_date: '2026-01-10',
          estimated_hours: 6,
          progress: 100,
          tags: ['Venue', 'Inspection'],
          linked_type: 'Exhibition',
          linked_name: 'Business Summit 2026',
          created_at: '2026-01-06T11:45:00Z'
        },
        {
          id: '5',
          task_number: 'TSK-005',
          title: 'Marketing material review',
          description: 'Review and approve all marketing materials for upcoming campaign',
          status: 'To Do',
          priority: 'Low',
          assigned_to_name: null,
          due_date: '2026-01-20',
          estimated_hours: 3,
          progress: 0,
          tags: ['Marketing', 'Review'],
          linked_type: null,
          linked_name: null,
          created_at: '2026-01-09T16:20:00Z'
        }
      ];
      
      console.log('✅ Tasks: Loaded tasks:', mockTasks.length, mockTasks);
      setTasks(mockTasks);
    } catch (error) {
      console.error('🚨 Tasks: Error loading tasks:', error);
      toast({
        title: "Error",
        description: "Failed to load tasks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async () => {
    try {
      const taskData = {
        ...formData,
        task_number: `TSK-${String(tasks.length + 1).padStart(3, '0')}`,
        estimated_hours: formData.estimated_hours ? parseInt(formData.estimated_hours) : null,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        progress: 0,
        created_at: new Date().toISOString()
      };

      // In a real implementation, you'd call: await taskService.create(taskData);
      console.log('Creating task:', taskData);
      
      toast({
        title: "Task Created",
        description: `Task "${formData.title}" has been created successfully`,
      });

      setCreateDialogOpen(false);
      resetForm();
      loadTasks();
    } catch (error) {
      console.error("Error creating task:", error);
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      });
    }
  };

  const handleEditTask = async () => {
    try {
      if (!selectedTask) return;

      const taskData = {
        ...formData,
        estimated_hours: formData.estimated_hours ? parseInt(formData.estimated_hours) : null,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
      };

      // In a real implementation, you'd call: await taskService.update(selectedTask.id, taskData);
      console.log('Updating task:', taskData);
      
      toast({
        title: "Task Updated",
        description: `Task "${formData.title}" has been updated successfully`,
      });

      setEditDialogOpen(false);
      setSelectedTask(null);
      resetForm();
      loadTasks();
    } catch (error) {
      console.error("Error updating task:", error);
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    
    try {
      // In a real implementation, you'd call: await taskService.delete(taskToDelete.id);
      console.log('Deleting task:', taskToDelete.id);
      
      toast({
        title: "Task Deleted",
        description: `Task "${taskToDelete.title}" has been deleted successfully`,
      });
      loadTasks();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setTaskToDelete(null);
    }
  };

  const handleUpdateStatus = async (taskId: string, newStatus: string, progress?: number) => {
    try {
      // In a real implementation, you'd call: await taskService.updateStatus(taskId, newStatus, progress);
      console.log('Updating task status:', taskId, newStatus, progress);
      
      toast({
        title: "Status Updated",
        description: `Task status updated to ${newStatus}`,
      });
      loadTasks();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'Medium',
      status: 'To Do',
      assigned_to_name: '',
      due_date: '',
      estimated_hours: '',
      tags: '',
      linked_type: '',
      linked_name: ''
    });
  };

  const openEditDialog = (task) => {
    setSelectedTask(task);
    setFormData({
      title: task.title || '',
      description: task.description || '',
      priority: task.priority || 'Medium',
      status: task.status || 'To Do',
      assigned_to_name: task.assigned_to_name || '',
      due_date: task.due_date || '',
      estimated_hours: task.estimated_hours?.toString() || '',
      tags: task.tags ? task.tags.join(', ') : '',
      linked_type: task.linked_type || '',
      linked_name: task.linked_name || ''
    });
    setEditDialogOpen(true);
  };

  const exportTasks = () => {
    const csvContent = [
      ['Task Number', 'Title', 'Status', 'Priority', 'Assignee', 'Due Date', 'Progress', 'Created Date'].join(','),
      ...filteredTasks.map(task => [
        task.task_number,
        `"${task.title}"`,
        task.status,
        task.priority,
        task.assigned_to_name || 'Unassigned',
        task.due_date || '',
        `${task.progress}%`,
        new Date(task.created_at).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tasks-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: "Tasks have been exported to CSV",
    });
  };

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.task_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.assigned_to_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all-status" || task.status === statusFilter;
    const matchesPriority = priorityFilter === "all-priority" || task.priority === priorityFilter;
    const matchesAssignee = assigneeFilter === "all-assignees" || 
                           (assigneeFilter === "unassigned" && !task.assigned_to_name) ||
                           task.assigned_to_name === assigneeFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
  });

  // Calculate statistics
  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'To Do').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    completed: tasks.filter(t => t.status === 'Completed').length,
    overdue: tasks.filter(t => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'Completed').length,
    highPriority: tasks.filter(t => ['High', 'Critical'].includes(t.priority)).length
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Review': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'To Do': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return <CheckCircle className="w-3 h-3" />;
      case 'In Progress': return <PlayCircle className="w-3 h-3" />;
      case 'Review': return <Eye className="w-3 h-3" />;
      case 'To Do': return <Clock className="w-3 h-3" />;
      case 'Cancelled': return <XCircle className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `Due in ${diffDays} days`;
  };

  const isOverdue = (dueDate: string, status: string) => {
    if (!dueDate || status === 'Completed') return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <CheckSquare className="w-8 h-8 text-blue-600" />
            Tasks Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and track all your tasks and assignments
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportTasks} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => loadTasks()} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setCreateDialogOpen(true)} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <CheckSquare className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">To Do</p>
                <p className="text-2xl font-bold">{stats.todo}</p>
              </div>
              <Clock className="w-8 h-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
              </div>
              <PlayCircle className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold">{stats.overdue}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Priority</p>
                <p className="text-2xl font-bold">{stats.highPriority}</p>
              </div>
              <Flag className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search tasks..."
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
                  <SelectItem value="To Do">To Do</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Review">Review</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
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
              <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-assignees">All Assignees</SelectItem>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {Array.from(new Set(tasks.map(t => t.assigned_to_name).filter(Boolean))).map(assignee => (
                    <SelectItem key={assignee} value={assignee}>{assignee}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks List */}
      <div className="space-y-4">
        {loading ? (
          <Card>
            <CardContent className="p-12">
              <div className="flex items-center justify-center">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mr-3" />
                <p className="text-lg text-gray-600">Loading tasks...</p>
              </div>
            </CardContent>
          </Card>
        ) : filteredTasks.length === 0 ? (
          <Card>
            <CardContent className="p-12">
              <div className="text-center">
                <CheckSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No tasks found</h3>
                <p className="text-gray-600 mb-6">
                  {tasks.length === 0 
                    ? "Get started by creating your first task" 
                    : "Try adjusting your search or filter criteria"}
                </p>
                {tasks.length === 0 && (
                  <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Task
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <Card key={task.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge variant="outline" className="font-mono text-xs">
                          {task.task_number}
                        </Badge>
                        <Badge className={getPriorityColor(task.priority)} variant="secondary">
                          <Flag className="w-3 h-3 mr-1" />
                          {task.priority}
                        </Badge>
                        <Badge className={getStatusColor(task.status)} variant="secondary">
                          {getStatusIcon(task.status)}
                          {task.status}
                        </Badge>
                        {task.linked_type && (
                          <Badge variant="outline">
                            <Link className="w-3 h-3 mr-1" />
                            {task.linked_type}
                          </Badge>
                        )}
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {task.title}
                      </h3>
                      
                      {task.description && (
                        <p className="text-gray-600 mb-4">
                          {task.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                        {task.assigned_to_name && (
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {task.assigned_to_name}
                          </div>
                        )}
                        
                        {task.due_date && (
                          <div className={`flex items-center gap-1 ${isOverdue(task.due_date, task.status) ? 'text-red-600' : ''}`}>
                            <Calendar className="w-4 h-4" />
                            {formatDate(task.due_date)}
                          </div>
                        )}
                        
                        {task.estimated_hours && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {task.estimated_hours}h estimated
                          </div>
                        )}
                        {task.linked_name && (
                          <div className="flex items-center gap-1">
                            <Link className="w-4 h-4" />
                            {task.linked_name}
                          </div>
                        )}
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Progress</span>
                          <span className="text-sm text-gray-600">{task.progress}%</span>
                        </div>
                        <Progress value={task.progress} className="h-2" />
                      </div>

                      {/* Tags */}
                      {task.tags && task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {task.tags.map((tag: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-4">
                      {/* Quick Status Actions */}
                      {task.status === 'To Do' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStatus(task.id, 'In Progress', 25)}
                        >
                          <PlayCircle className="w-4 h-4 mr-1" />
                          Start
                        </Button>
                      )}
                      
                      {task.status === 'In Progress' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStatus(task.id, 'Completed', 100)}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Complete
                        </Button>
                      )}
                      {task.status === 'Review' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStatus(task.id, 'Completed', 100)}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                      )}
                      {/* More Actions Menu */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => {
                            setSelectedTask(task);
                            setEditDialogOpen(true);
                          }}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Task
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleUpdateStatus(task.id, 'To Do', 0)}
                            disabled={task.status === 'To Do'}
                          >
                            <Clock className="w-4 h-4 mr-2" />
                            Mark as To Do
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleUpdateStatus(task.id, 'In Progress', 50)}
                            disabled={task.status === 'In Progress'}
                          >
                            <PlayCircle className="w-4 h-4 mr-2" />
                            Mark as In Progress
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleUpdateStatus(task.id, 'Review', 90)}
                            disabled={task.status === 'Review'}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Mark as Review
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleUpdateStatus(task.id, 'Completed', 100)}
                            disabled={task.status === 'Completed'}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Mark as Completed
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => {
                              setTaskToDelete(task);
                              setDeleteDialogOpen(true);
                            }}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Task
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Results Summary */}
      {!loading && (
        <div className="text-center text-sm text-gray-600">
          Showing {filteredTasks.length} of {tasks.length} tasks
        </div>
      )}

      {/* Create Task Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="title">Task Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Enter task title"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Enter task description"
                />
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
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="To Do">To Do</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Review">Review</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="assigned_to_name">Assignee</Label>
                <Input
                  id="assigned_to_name"
                  value={formData.assigned_to_name}
                  onChange={(e) => setFormData({...formData, assigned_to_name: e.target.value})}
                  placeholder="Enter assignee name"
                />
              </div>
              <div>
                <Label htmlFor="due_date">Due Date</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="estimated_hours">Estimated Hours</Label>
                <Input
                  id="estimated_hours"
                  type="number"
                  value={formData.estimated_hours}
                  onChange={(e) => setFormData({...formData, estimated_hours: e.target.value})}
                  placeholder="Enter estimated hours"
                />
              </div>
              <div>
                <Label htmlFor="linked_type">Linked Type</Label>
                <Select value={formData.linked_type} onValueChange={(value) => setFormData({...formData, linked_type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select linked type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    <SelectItem value="Client">Client</SelectItem>
                    <SelectItem value="Exhibition">Exhibition</SelectItem>
                    <SelectItem value="Sponsorship">Sponsorship</SelectItem>
                    <SelectItem value="Deal">Deal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="linked_name">Linked Name</Label>
                <Input
                  id="linked_name"
                  value={formData.linked_name}
                  onChange={(e) => setFormData({...formData, linked_name: e.target.value})}
                  placeholder="Enter linked item name"
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
            <Button variant="outline" onClick={() => {setCreateDialogOpen(false); resetForm();}}>
              Cancel
            </Button>
            <Button onClick={handleCreateTask}>
              Create Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="edit_title">Task Title *</Label>
                <Input
                  id="edit_title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Enter task title"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="edit_description">Description</Label>
                <Textarea
                  id="edit_description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Enter task description"
                />
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
                    <SelectItem value="To Do">To Do</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Review">Review</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit_assigned_to_name">Assignee</Label>
                <Input
                  id="edit_assigned_to_name"
                  value={formData.assigned_to_name}
                  onChange={(e) => setFormData({...formData, assigned_to_name: e.target.value})}
                  placeholder="Enter assignee name"
                />
              </div>
              <div>
                <Label htmlFor="edit_due_date">Due Date</Label>
                <Input
                  id="edit_due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit_estimated_hours">Estimated Hours</Label>
                <Input
                  id="edit_estimated_hours"
                  type="number"
                  value={formData.estimated_hours}
                  onChange={(e) => setFormData({...formData, estimated_hours: e.target.value})}
                  placeholder="Enter estimated hours"
                />
              </div>
              <div>
                <Label htmlFor="edit_linked_type">Linked Type</Label>
                <Select value={formData.linked_type} onValueChange={(value) => setFormData({...formData, linked_type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select linked type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    <SelectItem value="Client">Client</SelectItem>
                    <SelectItem value="Exhibition">Exhibition</SelectItem>
                    <SelectItem value="Sponsorship">Sponsorship</SelectItem>
                    <SelectItem value="Deal">Deal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="edit_linked_name">Linked Name</Label>
                <Input
                  id="edit_linked_name"
                  value={formData.linked_name}
                  onChange={(e) => setFormData({...formData, linked_name: e.target.value})}
                  placeholder="Enter linked item name"
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
            <Button variant="outline" onClick={() => {setEditDialogOpen(false); setSelectedTask(null); resetForm();}}>
              Cancel
            </Button>
            <Button onClick={handleEditTask}>
              Update Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the task "{taskToDelete?.title}"? 
              This action cannot be undone and will permanently remove the task and all its associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTask} className="bg-red-600 hover:bg-red-700">
              Delete Task
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Tasks;