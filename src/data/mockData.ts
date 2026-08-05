import { Contact, Company, Deal, PipelineStage, Activity, User, KpiMetric } from '../types/crm';

export const INITIAL_USERS: User[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Ahmad Ariff',
    email: 'ahmad@enterprise.co.id',
    role: 'ADMIN',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    dealsClosedThisMonth: 12,
  },
  {
    id: '11111111-1111-1111-1111-222222222222',
    name: 'Siti Nurhaliza',
    email: 'siti@enterprise.co.id',
    role: 'MANAGER',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    dealsClosedThisMonth: 8,
  },
  {
    id: '11111111-1111-1111-1111-333333333333',
    name: 'Rudi Hermawan',
    email: 'rudi@enterprise.co.id',
    role: 'SALES_REP',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    dealsClosedThisMonth: 5,
  },
];

export const INITIAL_STAGES: PipelineStage[] = [
  { id: 'QUALIFICATION', name: 'Qualification', color: 'from-blue-500 to-cyan-500', order: 1 },
  { id: 'DISCOVERY', name: 'Discovery', color: 'from-amber-500 to-orange-500', order: 2 },
  { id: 'PROPOSAL', name: 'Proposal Sent', color: 'from-purple-500 to-indigo-500', order: 3 },
  { id: 'NEGOTIATION', name: 'Negotiation', color: 'from-rose-500 to-pink-500', order: 4 },
  { id: 'CLOSED_WON', name: 'Closed Won', color: 'from-emerald-500 to-teal-500', order: 5 },
];

export const INITIAL_COMPANIES: Company[] = [];
export const INITIAL_CONTACTS: Contact[] = [];
export const INITIAL_DEALS: Deal[] = [];
export const INITIAL_ACTIVITIES: Activity[] = [];

export const KPI_SUMMARY: KpiMetric[] = [
  {
    title: 'Total Revenue Pipeline',
    value: 'Rp 2.750.000.000',
    change: '+24.5%',
    isPositive: true,
    period: 'vs bulan lalu',
    iconName: 'DollarSign',
  },
  {
    title: 'Active Qualified Deals',
    value: '4 Enterprise Deals',
    change: '+2 deals',
    isPositive: true,
    period: 'sprint ini',
    iconName: 'Briefcase',
  },
  {
    title: 'Lead Conversion Rate',
    value: '33.3%',
    change: '+5.0%',
    isPositive: true,
    period: 'target: 30%',
    iconName: 'TrendingUp',
  },
  {
    title: 'Avg. Sales Cycle Length',
    value: '12 Hari',
    change: '-3.5 hari',
    isPositive: true,
    period: 'efisiensi tinggi',
    iconName: 'Clock',
  },
];
