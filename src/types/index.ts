// SPACE CRM & Expo Management System Types

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department: string;
  assigned_expos: string[];
  assigned_deals: string[];
  created_at: string;
  updated_at: string;
}

export type UserRole = 
  | 'super_admin'
  | 'management'
  | 'sales_manager'
  | 'sales_executive'
  | 'finance_manager'
  | 'finance_officer'
  | 'hr_manager'
  | 'support'
  | 'client';

export interface Client {
  id: string;
  company_name: string;
  client_type: ClientType;
  industry: string;
  country: string;
  contacts: Contact[];
  linked_expos: string[];
  linked_deals: string[];
  linked_payments: string[];
  linked_tickets: string[];
  documents: Document[];
  created_at: string;
  updated_at: string;
}

export type ClientType = 'exhibitor' | 'main_sponsor' | 'sector_sponsor' | 'partner_vendor';

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  position: string;
  is_primary: boolean;
}

export interface Deal {
  id: string;
  client_id: string;
  expo_id: string;
  deal_type: DealType;
  stage: DealStage;
  assigned_salesperson: string;
  deal_value: number;
  probability: number;
  commission_rules: CommissionRule[];
  payment_plan: PaymentPlan;
  booth_details?: BoothDetails;
  sponsorship_details?: SponsorshipDetails;
  cancellation_reason?: string;
  down_payment?: number;
  created_at: string;
  updated_at: string;
}

export type DealType = 'booth' | 'sponsor' | 'sector_sponsor';

export type DealStage = 
  | 'lead_created'
  | 'talking'
  | 'meeting_scheduled'
  | 'strategy_proposal'
  | 'objection_handling'
  | 'terms_finalized'
  | 'closed_won'
  | 'closed_lost'
  | 'deal_failed'
  | 'deal_canceled';

export interface BoothDetails {
  booth_size_sqm: number;
  price_per_meter: number;
  total_price: number;
  booth_code: string;
  zone: string;
  hall_number: string;
  location_type: 'corner' | 'aisle' | 'premium';
  booth_status: 'available' | 'reserved' | 'confirmed' | 'paid';
}

export interface SponsorshipDetails {
  package_name: string;
  original_price: number;
  negotiated_price: number;
  benefits: string[];
  sector_exclusivity: boolean;
  sector?: string;
}

export interface PaymentPlan {
  installments: PaymentInstallment[];
  total_amount: number;
  currency: string;
}

export interface PaymentInstallment {
  id: string;
  amount: number;
  due_date: string;
  status: 'pending' | 'paid' | 'overdue';
  payment_method?: string;
  paid_date?: string;
  transaction_id?: string;
}

export interface CommissionRule {
  salesperson_id: string;
  percentage: number;
  based_on: 'deal_value' | 'payments_received';
}

export interface DealNote {
  id: string;
  deal_id: string;
  author_id: string;
  date: string;
  description: string;
  note_type: 'call' | 'meeting' | 'decision' | 'follow_up' | 'general';
  created_at: string;
}

export interface Expo {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  location: string;
  halls: Hall[];
  status: 'planning' | 'active' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface Hall {
  id: string;
  name: string;
  total_area: number;
  available_booths: number;
  occupied_booths: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assigned_to: string;
  due_date: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in_progress' | 'completed' | 'cancelled';
  linked_deal_id?: string;
  linked_client_id?: string;
  linked_expo_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Ticket {
  id: string;
  client_id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'waiting_client' | 'resolved' | 'closed';
  assigned_to?: string;
  sla_due_date: string;
  internal_comments: TicketComment[];
  created_at: string;
  updated_at: string;
}

export interface TicketComment {
  id: string;
  author_id: string;
  content: string;
  is_internal: boolean;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'payment_due' | 'task_deadline' | 'meeting_reminder' | 'ticket_update' | 'deal_stage_change' | 'commission_eligible';
  is_read: boolean;
  action_url?: string;
  created_at: string;
}

export interface KPI {
  user_id: string;
  period: string; // YYYY-MM format
  deals_closed: number;
  revenue_generated: number;
  follow_ups: number;
  meetings: number;
  collection_performance: number;
}

export interface Document {
  id: string;
  name: string;
  type: 'proposal' | 'contract' | 'invoice' | 'receipt' | 'other';
  file_url: string;
  status?: 'draft' | 'sent' | 'viewed' | 'signed' | 'expired';
  linked_deal_id?: string;
  linked_client_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  sender_id: string;
  recipient_id?: string; // For 1:1 chat
  group_id?: string; // For group chat
  content: string;
  message_type: 'text' | 'file' | 'image';
  linked_deal_id?: string;
  linked_client_id?: string;
  created_at: string;
}

export interface ChatGroup {
  id: string;
  name: string;
  members: string[];
  created_by: string;
  created_at: string;
}