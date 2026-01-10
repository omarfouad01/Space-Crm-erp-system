import { supabase } from '@/integrations/supabase/client';

export interface Deal {
  id: string;
  title: string;
  description?: string;
  client_id: string;
  client_name?: string;
  deal_value: number;
  status: string;
  stage: string;
  priority: 'High' | 'Medium' | 'Low';
  probability: number;
  close_date?: string;
  created_at: string;
  updated_at?: string;
  created_by: string;
  created_by_name?: string;
  assigned_to?: string;
  assigned_to_name?: string;
  notes?: string;
  exhibition_id?: string;
  booth_id?: string;
  health_score?: number;
  days_in_stage?: number;
  next_action?: string;
  last_activity?: string;
}

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  type?: string;
  city?: string;
  country?: string;
  created_at: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  due_date?: string;
  assigned_to?: string;
  deal_id?: string;
  client_id?: string;
  created_at: string;
}

export interface Exhibition {
  id: string;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  location?: string;
  status: string;
  created_at: string;
}

class SupabaseService {
  // Deal Service
  async getAllDeals(): Promise<Deal[]> {
    try {
      const { data, error } = await supabase
        .from('deals')
        .select(`
          *,
          clients:client_id (
            id,
            name,
            email,
            phone,
            company,
            type,
            city,
            country
          ),
          exhibitions:exhibition_id (
            id,
            name,
            start_date,
            end_date
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(deal => ({
        ...deal,
        client_name: deal.clients?.name || 'Unknown Client',
        client_info: deal.clients || {}
      }));
    } catch (error) {
      console.error('Error fetching deals:', error);
      // Return mock data for development
      return this.getMockDeals();
    }
  }

  async createDeal(deal: Partial<Deal>): Promise<Deal> {
    try {
      const { data, error } = await supabase
        .from('deals')
        .insert([{
          ...deal,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating deal:', error);
      throw error;
    }
  }

  async updateDeal(id: string, updates: Partial<Deal>): Promise<Deal> {
    try {
      const { data, error } = await supabase
        .from('deals')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating deal:', error);
      throw error;
    }
  }

  async deleteDeal(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('deals')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting deal:', error);
      throw error;
    }
  }

  // Client Service
  async getAllClients(): Promise<Client[]> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching clients:', error);
      return this.getMockClients();
    }
  }

  // Task Service
  async getAllTasks(): Promise<Task[]> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
  }

  // Exhibition Service
  async getAllExhibitions(): Promise<Exhibition[]> {
    try {
      const { data, error } = await supabase
        .from('exhibitions')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching exhibitions:', error);
      return this.getMockExhibitions();
    }
  }

  // Mock data for development
  private getMockDeals(): Deal[] {
    return [
      {
        id: '1',
        title: 'EcoTech Solutions - Premium Booth Package',
        description: 'Premium booth rental with additional services for Green Life Expo 2024',
        client_id: 'client-1',
        client_name: 'EcoTech Solutions',
        deal_value: 72000,
        status: 'Proposal',
        stage: 'strategy_proposal',
        priority: 'High',
        probability: 75,
        close_date: '2024-03-15',
        created_at: '2024-01-10T10:00:00Z',
        updated_at: '2024-01-15T14:30:00Z',
        created_by: 'user-1',
        created_by_name: 'Sarah Johnson',
        assigned_to: 'user-1',
        assigned_to_name: 'Sarah Johnson',
        notes: 'Client very interested in premium location. Needs custom booth design.',
        exhibition_id: 'expo-1',
        health_score: 85,
        days_in_stage: 5,
        next_action: 'Follow up on proposal feedback',
        last_activity: '2024-01-15T14:30:00Z'
      },
      {
        id: '2',
        title: 'Green Energy Alliance - Sponsorship Package',
        description: 'Platinum sponsorship package with speaking opportunities',
        client_id: 'client-2',
        client_name: 'Green Energy Alliance',
        deal_value: 50000,
        status: 'Negotiation',
        stage: 'objection_handling',
        priority: 'High',
        probability: 60,
        close_date: '2024-02-28',
        created_at: '2024-01-08T09:15:00Z',
        updated_at: '2024-01-14T16:45:00Z',
        created_by: 'user-2',
        created_by_name: 'Michael Chen',
        assigned_to: 'user-2',
        assigned_to_name: 'Michael Chen',
        notes: 'Negotiating on speaking slot timing and booth location.',
        exhibition_id: 'expo-1',
        health_score: 70,
        days_in_stage: 8,
        next_action: 'Address pricing concerns',
        last_activity: '2024-01-14T16:45:00Z'
      },
      {
        id: '3',
        title: 'Innovation Corp - Standard Booth',
        description: 'Standard booth rental for Tech Innovation Summit',
        client_id: 'client-3',
        client_name: 'Innovation Corp',
        deal_value: 25000,
        status: 'Talking',
        stage: 'talking',
        priority: 'Medium',
        probability: 25,
        close_date: '2024-04-01',
        created_at: '2024-01-12T11:20:00Z',
        updated_at: '2024-01-12T11:20:00Z',
        created_by: 'user-3',
        created_by_name: 'Emily Rodriguez',
        assigned_to: 'user-3',
        assigned_to_name: 'Emily Rodriguez',
        notes: 'Initial contact made. Waiting for budget approval.',
        exhibition_id: 'expo-2',
        health_score: 45,
        days_in_stage: 3,
        next_action: 'Schedule discovery call',
        last_activity: '2024-01-12T11:20:00Z'
      },
      {
        id: '4',
        title: 'Sustainable Systems Inc - Partnership Deal',
        description: 'Long-term partnership agreement with multiple exhibitions',
        client_id: 'client-4',
        client_name: 'Sustainable Systems Inc',
        deal_value: 150000,
        status: 'Contract',
        stage: 'terms_finalized',
        priority: 'High',
        probability: 90,
        close_date: '2024-02-15',
        created_at: '2024-01-05T08:30:00Z',
        updated_at: '2024-01-16T10:15:00Z',
        created_by: 'user-1',
        created_by_name: 'Sarah Johnson',
        assigned_to: 'user-1',
        assigned_to_name: 'Sarah Johnson',
        notes: 'Contract review in progress. Legal team involved.',
        exhibition_id: 'expo-1',
        health_score: 95,
        days_in_stage: 2,
        next_action: 'Finalize contract terms',
        last_activity: '2024-01-16T10:15:00Z'
      }
    ];
  }

  private getMockClients(): Client[] {
    return [
      {
        id: 'client-1',
        name: 'EcoTech Solutions',
        email: 'contact@ecotech.com',
        phone: '+1-555-0101',
        company: 'EcoTech Solutions Inc.',
        type: 'Technology Company',
        city: 'San Francisco',
        country: 'USA',
        created_at: '2023-06-15T10:00:00Z'
      },
      {
        id: 'client-2',
        name: 'Green Energy Alliance',
        email: 'info@greenenergy.com',
        phone: '+1-555-0102',
        company: 'Green Energy Alliance',
        type: 'Energy Company',
        city: 'Austin',
        country: 'USA',
        created_at: '2023-08-20T14:30:00Z'
      },
      {
        id: 'client-3',
        name: 'Innovation Corp',
        email: 'hello@innovation.com',
        phone: '+1-555-0103',
        company: 'Innovation Corp',
        type: 'Startup',
        city: 'New York',
        country: 'USA',
        created_at: '2023-11-10T09:15:00Z'
      },
      {
        id: 'client-4',
        name: 'Sustainable Systems Inc',
        email: 'contact@sustainable.com',
        phone: '+1-555-0104',
        company: 'Sustainable Systems Inc',
        type: 'Manufacturing',
        city: 'Seattle',
        country: 'USA',
        created_at: '2023-09-25T12:00:00Z'
      }
    ];
  }

  private getMockExhibitions(): Exhibition[] {
    return [
      {
        id: 'expo-1',
        name: 'Green Life Expo 2024',
        description: 'Annual sustainable living and green technology exhibition',
        start_date: '2024-03-15',
        end_date: '2024-03-17',
        location: 'Los Angeles Convention Center',
        status: 'Planning',
        created_at: '2023-12-01T10:00:00Z'
      },
      {
        id: 'expo-2',
        name: 'Tech Innovation Summit 2024',
        description: 'Technology and innovation showcase',
        start_date: '2024-05-20',
        end_date: '2024-05-22',
        location: 'San Francisco Moscone Center',
        status: 'Planning',
        created_at: '2024-01-05T14:00:00Z'
      }
    ];
  }
}

// Export service instances
export const dealService = {
  getAll: () => new SupabaseService().getAllDeals(),
  create: (deal: Partial<Deal>) => new SupabaseService().createDeal(deal),
  update: (id: string, updates: Partial<Deal>) => new SupabaseService().updateDeal(id, updates),
  delete: (id: string) => new SupabaseService().deleteDeal(id)
};

export const clientService = {
  getAll: () => new SupabaseService().getAllClients()
};

export const taskService = {
  getAll: () => new SupabaseService().getAllTasks()
};

export const expoService = {
  getAll: () => new SupabaseService().getAllExhibitions()
};

export default SupabaseService;