import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { boothService, expoService, clientService, type Booth, type Exhibition, type Client } from '@/services/supabaseService';
import {
  Building2,
  MapPin,
  Ruler,
  DollarSign,
  Users,
  Zap,
  Plus,
  X,
  Loader2,
  Info,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface CreateBoothDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const BOOTH_TYPES = [
  { value: 'Standard', label: 'Standard', description: 'Basic inline booth configuration' },
  { value: 'Premium', label: 'Premium', description: 'Enhanced location with premium features' },
  { value: 'Corner', label: 'Corner', description: 'Corner location with two open sides' },
  { value: 'Island', label: 'Island', description: 'Standalone booth with 360° access' },
  { value: 'Peninsula', label: 'Peninsula', description: 'Three open sides configuration' },
  { value: 'Inline', label: 'Inline', description: 'Standard inline configuration' },
  { value: 'Custom', label: 'Custom', description: 'Custom booth configuration' }
];

const BOOTH_STATUS = [
  { value: 'Available', label: 'Available', color: 'bg-green-100 text-green-800' },
  { value: 'Reserved', label: 'Reserved', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'Booked', label: 'Booked', color: 'bg-blue-100 text-blue-800' },
  { value: 'Occupied', label: 'Occupied', color: 'bg-purple-100 text-purple-800' },
  { value: 'Maintenance', label: 'Maintenance', color: 'bg-orange-100 text-orange-800' },
  { value: 'Unavailable', label: 'Unavailable', color: 'bg-red-100 text-red-800' }
];

const CURRENCIES = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'JPY', label: 'JPY (¥)' }
];

export const CreateBoothDialog: React.FC<CreateBoothDialogProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');
  
  const [formData, setFormData] = useState({
    // Basic Information
    booth_number: '',
    booth_code: '',
    exhibition_id: '',
    hall: '',
    zone: '',
    aisle: '',
    position: '',
    
    // Specifications
    booth_type: 'Standard',
    size_sqm: '',
    width_m: '',
    length_m: '',
    height_m: '',
    
    // Status & Availability
    status: 'Available',
    
    // Pricing
    base_price: '',
    additional_costs: '',
    currency: 'USD',
    
    // Assignment
    assigned_to_company: '',
    assigned_to_contact: '',
    assigned_to_email: '',
    assigned_to_phone: '',
    client_id: '',
    
    // Technical
    power_supply: '',
    internet_access: false,
    water_supply: false,
    compressed_air: false,
    
    // Additional
    description: '',
    notes: '',
    special_requirements: ''
  });

  useEffect(() => {
    if (isOpen) {
      loadData();
      resetForm();
    }
  }, [isOpen]);

  const loadData = async () => {
    try {
      const [exhibitionsData, clientsData] = await Promise.all([
        expoService.getAll(),
        clientService.getAll()
      ]);
      setExhibitions(exhibitionsData || []);
      setClients(clientsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      booth_number: '',
      booth_code: '',
      exhibition_id: '',
      hall: '',
      zone: '',
      aisle: '',
      position: '',
      booth_type: 'Standard',
      size_sqm: '',
      width_m: '',
      length_m: '',
      height_m: '',
      status: 'Available',
      base_price: '',
      additional_costs: '',
      currency: 'USD',
      assigned_to_company: '',
      assigned_to_contact: '',
      assigned_to_email: '',
      assigned_to_phone: '',
      client_id: '',
      power_supply: '',
      internet_access: false,
      water_supply: false,
      compressed_air: false,
      description: '',
      notes: '',
      special_requirements: ''
    });
    setFeatures([]);
    setNewFeature('');
    setActiveTab('basic');
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field === 'exhibition_id' && value === 'none') {
      value = '';
    }
    if (field === 'client_id' && value === 'none') {
      value = '';
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures(prev => [...prev, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (feature: string) => {
    setFeatures(prev => prev.filter(f => f !== feature));
  };

  const calculateTotalPrice = () => {
    const basePrice = parseFloat(formData.base_price) || 0;
    const additionalCosts = parseFloat(formData.additional_costs) || 0;
    return basePrice + additionalCosts;
  };

  const validateForm = () => {
    const errors: string[] = [];
    
    if (!formData.booth_number.trim()) errors.push('Booth number is required');
    if (!formData.booth_code.trim()) errors.push('Booth code is required');
    if (!formData.size_sqm || parseFloat(formData.size_sqm) <= 0) {
      errors.push('Size (sqm) must be greater than 0');
    }
    if (!formData.base_price || parseFloat(formData.base_price) < 0) {
      errors.push('Base price must be 0 or greater');
    }
    
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
      const boothData: Partial<Booth> = {
        booth_number: formData.booth_number.trim(),
        booth_code: formData.booth_code.trim(),
        exhibition_id: formData.exhibition_id || undefined,
        expo_name: exhibitions.find(e => e.id === formData.exhibition_id)?.name,
        hall: formData.hall.trim() || undefined,
        zone: formData.zone.trim() || undefined,
        aisle: formData.aisle.trim() || undefined,
        position: formData.position.trim() || undefined,
        booth_type: formData.booth_type,
        size_sqm: parseFloat(formData.size_sqm),
        width_m: formData.width_m ? parseFloat(formData.width_m) : undefined,
        length_m: formData.length_m ? parseFloat(formData.length_m) : undefined,
        height_m: formData.height_m ? parseFloat(formData.height_m) : undefined,
        status: formData.status,
        base_price: parseFloat(formData.base_price) || 0,
        additional_costs: parseFloat(formData.additional_costs) || 0,
        total_price: calculateTotalPrice(),
        currency: formData.currency,
        assigned_to_company: formData.assigned_to_company.trim() || undefined,
        assigned_to_contact: formData.assigned_to_contact.trim() || undefined,
        assigned_to_email: formData.assigned_to_email.trim() || undefined,
        assigned_to_phone: formData.assigned_to_phone.trim() || undefined,
        client_id: formData.client_id || undefined,
        features: features,
        power_supply: formData.power_supply.trim() || undefined,
        internet_access: formData.internet_access,
        water_supply: formData.water_supply,
        compressed_air: formData.compressed_air,
        description: formData.description.trim() || undefined,
        notes: formData.notes.trim() || undefined,
        special_requirements: formData.special_requirements.trim() || undefined,
        created_by: 'current-user'
      };

      await boothService.create(boothData);

      toast({
        title: "Booth Created",
        description: `Booth "${formData.booth_code}" has been created successfully`,
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error creating booth:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create booth. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: formData.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <Building2 className="w-6 h-6 text-blue-600" />
            Create New Booth
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="assignment">Assignment</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
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
                      <Label htmlFor="booth_number">Booth Number *</Label>
                      <Input
                        id="booth_number"
                        value={formData.booth_number}
                        onChange={(e) => handleInputChange('booth_number', e.target.value)}
                        placeholder="e.g., A001, B102"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="booth_code">Booth Code *</Label>
                      <Input
                        id="booth_code"
                        value={formData.booth_code}
                        onChange={(e) => handleInputChange('booth_code', e.target.value)}
                        placeholder="e.g., GLE2024-A001"
                        required
                      />
                    </div>
                  </div>

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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describe the booth location, features, and any special characteristics..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Location Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hall">Hall</Label>
                      <Input
                        id="hall"
                        value={formData.hall}
                        onChange={(e) => handleInputChange('hall', e.target.value)}
                        placeholder="e.g., Hall A, Main Hall"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="zone">Zone</Label>
                      <Input
                        id="zone"
                        value={formData.zone}
                        onChange={(e) => handleInputChange('zone', e.target.value)}
                        placeholder="e.g., Zone 1, North Wing"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="aisle">Aisle</Label>
                      <Input
                        id="aisle"
                        value={formData.aisle}
                        onChange={(e) => handleInputChange('aisle', e.target.value)}
                        placeholder="e.g., A1, Main Aisle"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="position">Position</Label>
                      <Input
                        id="position"
                        value={formData.position}
                        onChange={(e) => handleInputChange('position', e.target.value)}
                        placeholder="e.g., Corner, Center, End"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Specifications Tab */}
            <TabsContent value="specifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ruler className="w-5 h-5" />
                    Booth Specifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="booth_type">Booth Type</Label>
                      <Select value={formData.booth_type} onValueChange={(value) => handleInputChange('booth_type', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {BOOTH_TYPES.map((type) => (
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

                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {BOOTH_STATUS.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              <div className="flex items-center gap-2">
                                <Badge className={status.color}>{status.label}</Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="size_sqm">Size (sqm) *</Label>
                      <Input
                        id="size_sqm"
                        type="number"
                        value={formData.size_sqm}
                        onChange={(e) => handleInputChange('size_sqm', e.target.value)}
                        placeholder="100"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="width_m">Width (m)</Label>
                      <Input
                        id="width_m"
                        type="number"
                        value={formData.width_m}
                        onChange={(e) => handleInputChange('width_m', e.target.value)}
                        placeholder="10"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="length_m">Length (m)</Label>
                      <Input
                        id="length_m"
                        type="number"
                        value={formData.length_m}
                        onChange={(e) => handleInputChange('length_m', e.target.value)}
                        placeholder="10"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="height_m">Height (m)</Label>
                      <Input
                        id="height_m"
                        type="number"
                        value={formData.height_m}
                        onChange={(e) => handleInputChange('height_m', e.target.value)}
                        placeholder="3"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Pricing Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="base_price">Base Price *</Label>
                      <Input
                        id="base_price"
                        type="number"
                        value={formData.base_price}
                        onChange={(e) => handleInputChange('base_price', e.target.value)}
                        placeholder="5000"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="additional_costs">Additional Costs</Label>
                      <Input
                        id="additional_costs"
                        type="number"
                        value={formData.additional_costs}
                        onChange={(e) => handleInputChange('additional_costs', e.target.value)}
                        placeholder="500"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CURRENCIES.map((currency) => (
                            <SelectItem key={currency.value} value={currency.value}>
                              {currency.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-green-900">Total Price:</span>
                      <span className="text-2xl font-bold text-green-900">
                        {formatCurrency(calculateTotalPrice())}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Add a feature (e.g., Premium Location, High Traffic)"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    />
                    <Button type="button" onClick={addFeature} variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {feature}
                        <button
                          type="button"
                          onClick={() => removeFeature(feature)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Assignment Tab */}
            <TabsContent value="assignment" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Assignment Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="client">Assigned Client</Label>
                    <Select value={formData.client_id || "none"} onValueChange={(value) => handleInputChange('client_id', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a client" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Client Assigned</SelectItem>
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
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="assigned_to_company">Company Name</Label>
                      <Input
                        id="assigned_to_company"
                        value={formData.assigned_to_company}
                        onChange={(e) => handleInputChange('assigned_to_company', e.target.value)}
                        placeholder="Company name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="assigned_to_contact">Contact Person</Label>
                      <Input
                        id="assigned_to_contact"
                        value={formData.assigned_to_contact}
                        onChange={(e) => handleInputChange('assigned_to_contact', e.target.value)}
                        placeholder="Contact person name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="assigned_to_email">Email</Label>
                      <Input
                        id="assigned_to_email"
                        type="email"
                        value={formData.assigned_to_email}
                        onChange={(e) => handleInputChange('assigned_to_email', e.target.value)}
                        placeholder="contact@company.com"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="assigned_to_phone">Phone</Label>
                      <Input
                        id="assigned_to_phone"
                        value={formData.assigned_to_phone}
                        onChange={(e) => handleInputChange('assigned_to_phone', e.target.value)}
                        placeholder="+1-555-0123"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="Any additional notes about this booth..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="special_requirements">Special Requirements</Label>
                    <Textarea
                      id="special_requirements"
                      value={formData.special_requirements}
                      onChange={(e) => handleInputChange('special_requirements', e.target.value)}
                      placeholder="Any special requirements or restrictions..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Technical Tab */}
            <TabsContent value="technical" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Technical Specifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="power_supply">Power Supply</Label>
                    <Input
                      id="power_supply"
                      value={formData.power_supply}
                      onChange={(e) => handleInputChange('power_supply', e.target.value)}
                      placeholder="e.g., 220V/16A, 380V/32A"
                    />
                  </div>

                  <div className="space-y-4">
                    <Label>Available Services</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="internet_access"
                          checked={formData.internet_access}
                          onChange={(e) => handleInputChange('internet_access', e.target.checked)}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="internet_access" className="text-sm">
                          Internet Access
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="water_supply"
                          checked={formData.water_supply}
                          onChange={(e) => handleInputChange('water_supply', e.target.checked)}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="water_supply" className="text-sm">
                          Water Supply
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="compressed_air"
                          checked={formData.compressed_air}
                          onChange={(e) => handleInputChange('compressed_air', e.target.checked)}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="compressed_air" className="text-sm">
                          Compressed Air
                        </Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Booth Information</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Number:</span> {formData.booth_number || 'Not specified'}</p>
                        <p><span className="font-medium">Code:</span> {formData.booth_code || 'Not specified'}</p>
                        <p><span className="font-medium">Type:</span> {formData.booth_type}</p>
                        <p><span className="font-medium">Size:</span> {formData.size_sqm} sqm</p>
                        <p><span className="font-medium">Status:</span> 
                          <Badge className={`ml-2 ${BOOTH_STATUS.find(s => s.value === formData.status)?.color}`}>
                            {formData.status}
                          </Badge>
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Pricing & Assignment</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Base Price:</span> {formatCurrency(parseFloat(formData.base_price) || 0)}</p>
                        <p><span className="font-medium">Additional Costs:</span> {formatCurrency(parseFloat(formData.additional_costs) || 0)}</p>
                        <p><span className="font-medium">Total Price:</span> {formatCurrency(calculateTotalPrice())}</p>
                        <p><span className="font-medium">Company:</span> {formData.assigned_to_company || 'Not assigned'}</p>
                        <p><span className="font-medium">Contact:</span> {formData.assigned_to_contact || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Form Actions */}
            <div className="flex items-center justify-between pt-6 border-t">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Info className="w-4 h-4" />
                <span>Fields marked with * are required</span>
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
                      Creating Booth...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Booth
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