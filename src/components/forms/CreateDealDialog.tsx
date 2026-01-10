import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
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

const CreateDealDialog: React.FC<CreateDealDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
  clients,
  exhibitions
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [closeDate, setCloseDate] = useState<Date>();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    client_id: '',
    deal_value: '',
    status: 'Talking',
    priority: 'Medium',
    exhibition_id: '',
    notes: ''
  });

  const handleInputChange = (field: string, value: string) => {
    // Handle special case for exhibition_id
    if (field === 'exhibition_id' && value === 'none') {
      value = '';
    }
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Deal title is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.client_id) {
      toast({
        title: "Validation Error",
        description: "Please select a client",
        variant: "destructive",
      });
      return;
    }

    if (!formData.deal_value || parseFloat(formData.deal_value) <= 0) {
      toast({
        title: "Validation Error",
        description: "Deal value must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const dealData: Partial<Deal> = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        client_id: formData.client_id,
        deal_value: parseFloat(formData.deal_value),
        status: formData.status,
        stage: mapStatusToStage(formData.status),
        priority: formData.priority as 'High' | 'Medium' | 'Low',
        probability: calculateInitialProbability(formData.status),
        close_date: closeDate?.toISOString(),
        exhibition_id: formData.exhibition_id || undefined,
        notes: formData.notes.trim() || undefined,
        created_by: 'current-user-id', // Replace with actual user ID
        created_by_name: 'Current User', // Replace with actual user name
        assigned_to: 'current-user-id', // Replace with actual user ID
        assigned_to_name: 'Current User' // Replace with actual user name
      };

      await dealService.create(dealData);
      
      toast({
        title: "Success",
        description: "Deal created successfully",
      });
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        client_id: '',
        deal_value: '',
        status: 'Talking',
        priority: 'Medium',
        exhibition_id: '',
        notes: ''
      });
      setCloseDate(undefined);
      
      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create deal",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const mapStatusToStage = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      'Talking': 'talking',
      'Meeting Scheduled': 'meeting_scheduled',
      'Proposal': 'strategy_proposal',
      'Negotiation': 'objection_handling',
      'Contract': 'terms_finalized',
      'Closed Won': 'closed_won',
      'Closed Lost': 'closed_lost',
      'Canceled': 'canceled',
    };
    return statusMap[status] || 'talking';
  };

  const calculateInitialProbability = (status: string): number => {
    const probabilities: { [key: string]: number } = {
      'Talking': 10,
      'Meeting Scheduled': 25,
      'Proposal': 40,
      'Negotiation': 60,
      'Contract': 80,
      'Closed Won': 100,
      'Closed Lost': 0,
      'Canceled': 0,
    };
    return probabilities[status] || 10;
  };

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, '');
    if (numericValue) {
      const formatted = parseFloat(numericValue).toLocaleString('en-US');
      return formatted;
    }
    return '';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Create New Deal</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Deal Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter deal title"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="client">Client *</Label>
                <Select value={formData.client_id} onValueChange={(value) => handleInputChange('client_id', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
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
                placeholder="Enter deal description"
                rows={3}
              />
            </div>
          </div>

          {/* Deal Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Deal Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deal_value">Deal Value *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="deal_value"
                    type="text"
                    value={formData.deal_value}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9.]/g, '');
                      handleInputChange('deal_value', value);
                    }}
                    placeholder="0.00"
                    className="pl-8"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Talking">Talking</SelectItem>
                    <SelectItem value="Meeting Scheduled">Meeting Scheduled</SelectItem>
                    <SelectItem value="Proposal">Proposal</SelectItem>
                    <SelectItem value="Negotiation">Negotiation</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Closed Won">Closed Won</SelectItem>
                    <SelectItem value="Closed Lost">Closed Lost</SelectItem>
                    <SelectItem value="Canceled">Canceled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        {exhibition.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Expected Close Date</Label>
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
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Additional Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Add any additional notes about this deal"
                rows={3}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t">
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
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Deal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDealDialog;