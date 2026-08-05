export type UserRole = 'ADMIN' | 'MANAGER' | 'SALES_REP';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  dealsClosedThisMonth: number;
}

export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CUSTOMER' | 'LOST';

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  companyId?: string;
  role: string;
  status: LeadStatus;
  value: number;
  assignedTo: string;
  createdAt: string;
  notesCount: number;
}

export interface Company {
  id: string;
  name: string;
  domain: string;
  industry: string;
  employeeCount: number;
  totalDealsValue: number;
  location: string;
}

export type StageId = 'QUALIFICATION' | 'DISCOVERY' | 'PROPOSAL' | 'NEGOTIATION' | 'CLOSED_WON' | 'CLOSED_LOST';

export interface PipelineStage {
  id: StageId;
  name: string;
  color: string;
  order: number;
}

export interface Deal {
  id: string;
  title: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  value: number;
  stageId: StageId;
  ownerName: string;
  ownerAvatar: string;
  expectedCloseDate: string;
  probability: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: string;
}

export type ActivityType = 'CALL' | 'MEETING' | 'EMAIL' | 'NOTE' | 'TASK';

export interface Activity {
  id: string;
  type: ActivityType;
  subject: string;
  description: string;
  contactName: string;
  dealTitle?: string;
  userName: string;
  userAvatar: string;
  dueDate: string;
  isCompleted: boolean;
  priority?: 'NORMAL' | 'URGENT';
}

export interface KpiMetric {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  period: string;
  iconName: string;
}
