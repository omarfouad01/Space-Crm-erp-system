import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  CalendarIcon, 
  Loader2, 
  User, 
  Building2, 
  DollarSign, 
  Target, 
  Calendar as CalendarDays,
  FileText,
  Users,
  MapPin,
  Phone,
  Mail,
  Globe,
  Star,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  Plus,
  X,
  Info
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { dealService, clientService, expoService, type Deal, type Client, type Exhibition } from '@/services/supabaseService';

interface CreateDealDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  clients: Client[];
  exhibitions: Exhibition[];
}

// Enhanced pipeline stages with detailed information
const PIPELINE_STAGES = [
  {
    id: 'talking',
    name: 'Talking',
    status: 'Talking',
    color: '#7B8FA1',
    probability: 10,
    description: 'Initial contact and discovery phase',
    icon: User,
    nextActions: ['Schedule discovery call', 'Send company information', 'Qualify budget']
  },
  {
    id: 'meeting_scheduled',
    name: 'Meeting Scheduled',
    status: 'Meeting Scheduled',
    color: '#2BB0E6',
    probability: 25,
    description: 'Meeting arranged with prospect',
    icon: CalendarDays,
    nextActions: ['Prepare meeting agenda', 'Send calendar invite', 'Research client needs']
  },
  {
    id: 'strategy_proposal',
    name: 'Strategy Proposal',
    status: 'Proposal',
    color: '#5FB3A2',
    probability: 40,
    description: 'Proposal sent and under review',
    icon: FileText,
    nextActions: ['Follow up on proposal', 'Schedule review meeting', 'Address questions']
  },
  {
    id: 'objection_handling',
    name: 'Objection Handling',
    status: 'Negotiation',
    color: '#9CA3AF',
    probability: 60,
    description: 'Addressing concerns and negotiations',
    icon: AlertCircle,
    nextActions: ['Address objections', 'Negotiate terms', 'Provide references']
  },
  {
    id: 'terms_finalized',
    name: 'Terms Finalized',
    status: 'Contract',
    color: '#2BB0E6',
    probability: 80,
    description: 'Agreement on terms and conditions',
    icon: CheckCircle,
    nextActions: ['Prepare contract', 'Legal review', 'Schedule signing']
  },
  {
    id: 'closed_won',
    name: 'Closed Won',
    status: 'Closed Won',
    color: '#5FB3A2',
    probability: 100,
    description: 'Deal successfully closed',
    icon: Star,
    nextActions: ['Setup payment', 'Onboard client', 'Project kickoff']
  }
];

const PRIORITY_LEVELS = [
  { value: 'High', label: 'High Priority', color: 'bg-red-100 text-red-800', description: 'Urgent, high-value opportunity' },
  { value: 'Medium', label: 'Medium Priority', color: 'bg-yellow-100 text-yellow-800', description: 'Standard opportunity' },
  { value: 'Low', label: 'Low Priority', color: 'bg-green-100 text-green-800', description: 'Future opportunity' }
];

const DEAL_TYPES = [
  { value: 'booth_rental', label: 'Booth Rental', description: 'Standard booth space rental' },
  { value: 'sponsorship', label: 'Sponsorship Package', description: 'Event sponsorship opportunities' },
  { value: 'premium_package', label: 'Premium Package', description: 'Premium booth with additional services' },
  { value: 'custom_solution', label: 'Custom Solution', description: 'Tailored exhibition solution' }
];

const CreateDealDialog: React.FC<CreateDealDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
  clients,
  exhibitions
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [closeDate, setCloseDate] = useState<Date>();
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedExhibition, setSelectedExhibition] = useState<Exhibition | null>(null);
  const [selectedStage, setSelectedStage] = useState(PIPELINE_STAGES[0]);
  
  const [formData, setFormData] = useState({
    // Basic Information
    title: '',
    description: '',
    client_id: '',
    deal_value: '',
    status: 'Talking',
    priority: 'Medium',
    deal_type: 'booth_rental',
    
    // Exhibition & Booth Details
    exhibition_id: '',
    booth_size: '',
    booth_location: '',
    booth_requirements: '',
    
    // Timeline & Probability
    probability: 10,
    expected_revenue: '',
    commission_rate: '5',
    
    // Assignment & Ownership
    created_by: 'current-user',
    created_by_name: 'Current User',
    assigned_to: 'current-user',
    assigned_to_name: 'Current User',
    
    // Additional Details
    notes: '',
    tags: '',
    source: 'website',
    competitor_info: '',
    budget_confirmed: false,
    decision_maker_identified: false
  });

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: '',
        description: '',
        client_id: '',
        deal_value: '',
        status: 'Talking',
        priority: 'Medium',
        deal_type: 'booth_rental',
        exhibition_id: '',
        booth_size: '',
        booth_location: '',
        booth_requirements: '',
        probability: 10,
        expected_revenue: '',
        commission_rate: '5',
        created_by: 'current-user',
        created_by_name: 'Current User',
        assigned_to: 'current-user',
        assigned_to_name: 'Current User',
        notes: '',
        tags: '',
        source: 'website',
        competitor_info: '',
        budget_confirmed: false,
        decision_maker_identified: false
      });
      setCloseDate(undefined);
      setSelectedClient(null);
      setSelectedExhibition(null);
      setSelectedStage(PIPELINE_STAGES[0]);
      setActiveTab('basic');
    }
  }, [isOpen]);

  // Update selected client when client_id changes
  useEffect(() => {
    if (formData.client_id) {
      const client = clients.find(c => c.id === formData.client_id);
      setSelectedClient(client || null);
    } else {
      setSelectedClient(null);
    }
  }, [formData.client_id, clients]);

  // Update selected exhibition when exhibition_id changes
  useEffect(() => {
    if (formData.exhibition_id && formData.exhibition_id !== 'none') {
      const exhibition = exhibitions.find(e => e.id === formData.exhibition_id);
      setSelectedExhibition(exhibition || null);
    } else {
      setSelectedExhibition(null);
    }
  }, [formData.exhibition_id, exhibitions]);

  // Update stage and probability when status changes
  useEffect(() => {
    const stage = PIPELINE_STAGES.find(s => s.status === formData.status);
    if (stage) {
      setSelectedStage(stage);
      setFormData(prev => ({
        ...prev,
        probability: stage.probability
      }));
    }
  }, [formData.status]);

  const handleInputChange = (field: string, value: string | boolean) => {
    // Handle special cases
    if (field === 'exhibition_id' && value === 'none') {
      value = '';
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateHealthScore = () => {
    let score = 50; // Base score
    
    // Deal value impact
    const dealValue = parseFloat(formData.deal_value) || 0;
    if (dealValue > 100000) score += 20;
    else if (dealValue > 50000) score += 10;
    else if (dealValue > 10000) score += 5;
    
    // Priority impact
    if (formData.priority === 'High') score += 15;
    else if (formData.priority === 'Low') score -= 10;
    
    // Client selection impact
    if (formData.client_id) score += 10;
    
    // Exhibition selection impact
    if (formData.exhibition_id) score += 10;
    
    // Budget confirmation impact
    if (formData.budget_confirmed) score += 15;
    
    // Decision maker identified impact
    if (formData.decision_maker_identified) score += 10;
    
    return Math.max(0, Math.min(100, score));
  };

  const calculateExpectedRevenue = () => {
    const dealValue = parseFloat(formData.deal_value) || 0;
    const probability = formData.probability / 100;
    return dealValue * probability;
  };

  const calculateCommission = () => {
    const dealValue = parseFloat(formData.deal_value) || 0;
    const commissionRate = parseFloat(formData.commission_rate) || 0;
    return (dealValue * commissionRate) / 100;
  };

  const validateForm = () => {
    const errors: string[] = [];
    
    if (!formData.title.trim()) errors.push('Deal title is required');
    if (!formData.client_id) errors.push('Please select a client');
    if (!formData.deal_value || parseFloat(formData.deal_value) <= 0) {
      errors.push('Deal value must be greater than 0');
    }
    if (!closeDate) errors.push('Expected close date is required');
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      toast({
        title: "Validation Error",
        description: errors.join(', '),
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const dealData: Partial<Deal> = {
        // Basic Information
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        client_id: formData.client_id,
        deal_value: parseFloat(formData.deal_value),
        status: formData.status,
        stage: selectedStage.id,
        priority: formData.priority as 'High' | 'Medium' | 'Low',
        probability: formData.probability,
        close_date: closeDate?.toISOString(),
        
        // Exhibition & Booth Details
        exhibition_id: formData.exhibition_id || undefined,
        booth_id: formData.booth_size ? `${formData.booth_size}-${Date.now()}` : undefined,
        
        // Assignment & Ownership
        created_by: formData.created_by,
        created_by_name: formData.created_by_name,
        assigned_to: formData.assigned_to,
        assigned_to_name: formData.assigned_to_name,
        
        // Additional Details
        notes: formData.notes.trim() || undefined,
        health_score: calculateHealthScore(),
        days_in_stage: 0,
        next_action: selectedStage.nextActions[0],
        last_activity: new Date().toISOString()
      };

      await dealService.create(dealData);

      toast({
        title: "Deal Created",
        description: `Deal "${formData.title}" has been created successfully`,
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error creating deal:', error);
      toast({
        title: "Error",
        description: "Failed to create deal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const getPriorityColor = (priority: string) => {
    const priorityLevel = PRIORITY_LEVELS.find(p => p.value === priority);
    return priorityLevel?.color || 'bg-gray-100 text-gray-800';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <Target className="w-6 h-6 text-blue-600" />
            Create New Deal
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="details">Deal Details</TabsTrigger>
            <TabsTrigger value="timeline">Timeline & Stage</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Tab */}
            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Deal Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="Enter deal title (e.g., EcoTech - Premium Booth Package)"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="deal_type">Deal Type</Label>
                      <Select value={formData.deal_type} onValueChange={(value) => handleInputChange('deal_type', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {DEAL_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              <div>
                                <div className="font-medium">{type.label}</div>
                                <div className="text-xs text-gray-500">{type.description}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describe the deal opportunity, client needs, and proposed solution..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="client">Client *</Label>
                      <Select value={formData.client_id} onValueChange={(value) => handleInputChange('client_id', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a client" />
                        </SelectTrigger>
                        <SelectContent>
                          {clients.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              <div>
                                <div className="font-medium">{client.name}</div>
                                <div className="text-xs text-gray-500">{client.company}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      {selectedClient && (
                        <Card className="mt-2 p-3 bg-blue-50 border-blue-200">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Building2 className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-blue-900">{selectedClient.name}</h4>
                              <p className="text-sm text-blue-700">{selectedClient.company}</p>
                              {selectedClient.email && (
                                <div className="flex items-center gap-1 mt-1 text-xs text-blue-600">
                                  <Mail className="w-3 h-3" />
                                  <span>{selectedClient.email}</span>
                                </div>
                              )}
                              {selectedClient.phone && (
                                <div className="flex items-center gap-1 mt-1 text-xs text-blue-600">
                                  <Phone className="w-3 h-3" />
                                  <span>{selectedClient.phone}</span>
                                </div>
                              )}
                              {selectedClient.city && (
                                <div className="flex items-center gap-1 mt-1 text-xs text-blue-600">
                                  <MapPin className="w-3 h-3" />
                                  <span>{selectedClient.city}, {selectedClient.country}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </Card>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="deal_value">Deal Value (USD) *</Label>
                      <Input
                        id="deal_value"
                        type="number"
                        value={formData.deal_value}
                        onChange={(e) => handleInputChange('deal_value', e.target.value)}
                        placeholder="Enter deal value"
                        min="0"
                        step="0.01"
                        required
                      />
                      {formData.deal_value && (
                        <p className="text-sm text-green-600 font-medium">
                          {formatCurrency(parseFloat(formData.deal_value))}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PRIORITY_LEVELS.map((priority) => (
                            <SelectItem key={priority.value} value={priority.value}>
                              <div className="flex items-center gap-2">
                                <Badge className={priority.color}>{priority.label}</Badge>
                                <span className="text-xs text-gray-500">{priority.description}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="source">Lead Source</Label>
                      <Select value={formData.source} onValueChange={(value) => handleInputChange('source', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="website">Website</SelectItem>
                          <SelectItem value="referral">Referral</SelectItem>
                          <SelectItem value="cold_call">Cold Call</SelectItem>
                          <SelectItem value="email_campaign">Email Campaign</SelectItem>
                          <SelectItem value="social_media">Social Media</SelectItem>
                          <SelectItem value="trade_show">Trade Show</SelectItem>
                          <SelectItem value="partner">Partner</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Deal Details Tab */}
            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Exhibition & Booth Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="exhibition">Exhibition</Label>
                    <Select value={formData.exhibition_id || "none"} onValueChange={(value) => handleInputChange('exhibition_id', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an exhibition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Exhibition</SelectItem>
                        {exhibitions.map((exhibition) => (
                          <SelectItem key={exhibition.id} value={exhibition.id}>
                            <div>
                              <div className="font-medium">{exhibition.name}</div>
                              <div className="text-xs text-gray-500">
                                {exhibition.start_date} - {exhibition.location}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {selectedExhibition && (
                      <Card className="mt-2 p-3 bg-green-50 border-green-200">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <CalendarDays className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-green-900">{selectedExhibition.name}</h4>
                            <p className="text-sm text-green-700">{selectedExhibition.description}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-green-600">
                              <div className="flex items-center gap-1">
                                <CalendarDays className="w-3 h-3" />
                                <span>{selectedExhibition.start_date} - {selectedExhibition.end_date}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                <span>{selectedExhibition.location}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="booth_size">Booth Size</Label>
                      <Select value={formData.booth_size} onValueChange={(value) => handleInputChange('booth_size', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select booth size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10x10">10x10 ft (Standard)</SelectItem>
                          <SelectItem value="10x20">10x20 ft (Premium)</SelectItem>
                          <SelectItem value="20x20">20x20 ft (Large)</SelectItem>
                          <SelectItem value="20x30">20x30 ft (Extra Large)</SelectItem>
                          <SelectItem value="custom">Custom Size</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="booth_location">Preferred Location</Label>
                      <Select value={formData.booth_location} onValueChange={(value) => handleInputChange('booth_location', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select location preference" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="entrance">Near Entrance</SelectItem>
                          <SelectItem value="center">Center Hall</SelectItem>
                          <SelectItem value="corner">Corner Location</SelectItem>
                          <SelectItem value="wall">Wall Location</SelectItem>
                          <SelectItem value="no_preference">No Preference</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="booth_requirements">Special Requirements</Label>
                    <Textarea
                      id="booth_requirements"
                      value={formData.booth_requirements}
                      onChange={(e) => handleInputChange('booth_requirements', e.target.value)}
                      placeholder="Describe any special booth requirements (power, internet, storage, etc.)"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Financial Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="commission_rate">Commission Rate (%)</Label>
                      <Input
                        id="commission_rate"
                        type="number"
                        value={formData.commission_rate}
                        onChange={(e) => handleInputChange('commission_rate', e.target.value)}
                        placeholder="5"
                        min="0"
                        max="100"
                        step="0.1"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Estimated Commission</Label>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-lg font-semibold text-green-600">
                          {formatCurrency(calculateCommission())}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="budget_confirmed"
                        checked={formData.budget_confirmed}
                        onChange={(e) => handleInputChange('budget_confirmed', e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="budget_confirmed" className="text-sm">
                        Budget confirmed by client
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="decision_maker_identified"
                        checked={formData.decision_maker_identified}
                        onChange={(e) => handleInputChange('decision_maker_identified', e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="decision_maker_identified" className="text-sm">
                        Decision maker identified
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Timeline & Stage Tab */}
            <TabsContent value="timeline" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Pipeline Stage & Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Current Stage</Label>
                    <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PIPELINE_STAGES.map((stage) => {
                          const IconComponent = stage.icon;
                          return (
                            <SelectItem key={stage.id} value={stage.status}>
                              <div className="flex items-center gap-2">
                                <IconComponent className="w-4 h-4" style={{ color: stage.color }} />
                                <div>
                                  <div className="font-medium">{stage.name}</div>
                                  <div className="text-xs text-gray-500">{stage.description}</div>
                                </div>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Stage Information Card */}
                  <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg" style={{ backgroundColor: `${selectedStage.color}20` }}>
                          <selectedStage.icon className="w-5 h-5" style={{ color: selectedStage.color }} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{selectedStage.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{selectedStage.description}</p>
                          <div className="mt-3">
                            <p className="text-xs font-medium text-gray-700 mb-2">Recommended Next Actions:</p>
                            <div className="flex flex-wrap gap-1">
                              {selectedStage.nextActions.map((action, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {action}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-700">Probability</p>
                          <p className="text-2xl font-bold" style={{ color: selectedStage.color }}>
                            {selectedStage.probability}%
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="space-y-2">
                    <Label>Expected Close Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !closeDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {closeDate ? format(closeDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={closeDate}
                          onSelect={setCloseDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => handleInputChange('tags', e.target.value)}
                      placeholder="Enter tags separated by commas (e.g., hot-lead, premium, urgent)"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Assignment & Ownership
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="assigned_to_name">Assigned To</Label>
                      <Input
                        id="assigned_to_name"
                        value={formData.assigned_to_name}
                        onChange={(e) => handleInputChange('assigned_to_name', e.target.value)}
                        placeholder="Sales representative name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="created_by_name">Created By</Label>
                      <Input
                        id="created_by_name"
                        value={formData.created_by_name}
                        onChange={(e) => handleInputChange('created_by_name', e.target.value)}
                        placeholder="Your name"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Summary Tab */}
            <TabsContent value="summary" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Deal Summary & Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                      <CardContent className="p-4 text-center">
                        <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <p className="text-sm text-green-600 font-medium">Deal Value</p>
                        <p className="text-2xl font-bold text-green-900">
                          {formatCurrency(parseFloat(formData.deal_value) || 0)}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                      <CardContent className="p-4 text-center">
                        <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <p className="text-sm text-blue-600 font-medium">Probability</p>
                        <p className="text-2xl font-bold text-blue-900">{formData.probability}%</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                      <CardContent className="p-4 text-center">
                        <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                        <p className="text-sm text-purple-600 font-medium">Expected Revenue</p>
                        <p className="text-2xl font-bold text-purple-900">
                          {formatCurrency(calculateExpectedRevenue())}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                      <CardContent className="p-4 text-center">
                        <Star className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                        <p className="text-sm text-orange-600 font-medium">Health Score</p>
                        <p className="text-2xl font-bold text-orange-900">{calculateHealthScore()}%</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Health Score Breakdown */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Health Score Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Overall Health Score</span>
                          <div className="flex items-center gap-2">
                            <Progress value={calculateHealthScore()} className="w-24" />
                            <span className="font-medium">{calculateHealthScore()}%</span>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span>Deal Value Impact</span>
                              <span className={parseFloat(formData.deal_value) > 50000 ? 'text-green-600' : 'text-gray-600'}>
                                {parseFloat(formData.deal_value) > 100000 ? '+20' : 
                                 parseFloat(formData.deal_value) > 50000 ? '+10' : 
                                 parseFloat(formData.deal_value) > 10000 ? '+5' : '0'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Priority Level</span>
                              <span className={formData.priority === 'High' ? 'text-green-600' : 
                                             formData.priority === 'Low' ? 'text-red-600' : 'text-gray-600'}>
                                {formData.priority === 'High' ? '+15' : 
                                 formData.priority === 'Low' ? '-10' : '0'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Client Selected</span>
                              <span className={formData.client_id ? 'text-green-600' : 'text-gray-600'}>
                                {formData.client_id ? '+10' : '0'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span>Exhibition Selected</span>
                              <span className={formData.exhibition_id ? 'text-green-600' : 'text-gray-600'}>
                                {formData.exhibition_id ? '+10' : '0'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Budget Confirmed</span>
                              <span className={formData.budget_confirmed ? 'text-green-600' : 'text-gray-600'}>
                                {formData.budget_confirmed ? '+15' : '0'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Decision Maker ID'd</span>
                              <span className={formData.decision_maker_identified ? 'text-green-600' : 'text-gray-600'}>
                                {formData.decision_maker_identified ? '+10' : '0'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Deal Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Deal Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Basic Information</h4>
                          <div className="space-y-1 text-sm">
                            <p><span className="font-medium">Title:</span> {formData.title || 'Not specified'}</p>
                            <p><span className="font-medium">Type:</span> {DEAL_TYPES.find(t => t.value === formData.deal_type)?.label}</p>
                            <p><span className="font-medium">Client:</span> {selectedClient?.name || 'Not selected'}</p>
                            <p><span className="font-medium">Value:</span> {formatCurrency(parseFloat(formData.deal_value) || 0)}</p>
                            <p><span className="font-medium">Priority:</span> 
                              <Badge className={`ml-2 ${getPriorityColor(formData.priority)}`}>
                                {formData.priority}
                              </Badge>
                            </p>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Timeline & Stage</h4>
                          <div className="space-y-1 text-sm">
                            <p><span className="font-medium">Stage:</span> {selectedStage.name}</p>
                            <p><span className="font-medium">Probability:</span> {formData.probability}%</p>
                            <p><span className="font-medium">Close Date:</span> {closeDate ? format(closeDate, "PPP") : 'Not set'}</p>
                            <p><span className="font-medium">Exhibition:</span> {selectedExhibition?.name || 'None'}</p>
                            <p><span className="font-medium">Assigned To:</span> {formData.assigned_to_name}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Notes Section */}
                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="Add any additional notes, competitor information, or special considerations..."
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Form Actions */}
            <div className="flex items-center justify-between pt-6 border-t">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Info className="w-4 h-4" />
                <span>All fields marked with * are required</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Deal...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Deal
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDealDialog;