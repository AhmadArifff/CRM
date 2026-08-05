import { Contact, Deal, Activity, User, StageId, KpiMetric } from '../types/crm';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  error?: {
    code: string;
    message: string;
  };
}

export const apiClient = {
  // 1. AUTH API
  async login(email: string, role: string): Promise<ApiResponse<{ token: string; user: User }>> {
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role }),
      });
      return await res.json();
    } catch (err) {
      console.error('API Error login:', err);
      throw err;
    }
  },

  async getMe(): Promise<ApiResponse<User>> {
    const res = await fetch('/api/v1/auth/me');
    return await res.json();
  },

  // 2. CONTACTS API
  async getContacts(userId?: string): Promise<ApiResponse<Contact[]>> {
    const url = userId ? `/api/v1/contacts?userId=${encodeURIComponent(userId)}` : '/api/v1/contacts';
    const res = await fetch(url);
    return await res.json();
  },

  async createContact(newContact: Omit<Contact, 'id' | 'createdAt' | 'notesCount'>): Promise<ApiResponse<Contact>> {
    const res = await fetch('/api/v1/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newContact),
    });
    return await res.json();
  },

  // 3. DEALS API
  async getDeals(userId?: string): Promise<ApiResponse<Deal[]>> {
    const url = userId ? `/api/v1/deals?userId=${encodeURIComponent(userId)}` : '/api/v1/deals';
    const res = await fetch(url);
    return await res.json();
  },

  async createDeal(newDeal: Omit<Deal, 'id' | 'createdAt'>): Promise<ApiResponse<Deal>> {
    const res = await fetch('/api/v1/deals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newDeal),
    });
    return await res.json();
  },

  async updateDealStage(dealId: string, stageId: StageId): Promise<ApiResponse<Deal>> {
    const res = await fetch(`/api/v1/deals/${dealId}/stage`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stageId, targetStage: stageId }),
    });
    return await res.json();
  },

  // 4. ACTIVITIES API
  async getActivities(userId?: string): Promise<ApiResponse<Activity[]>> {
    const url = userId ? `/api/v1/activities?userId=${encodeURIComponent(userId)}` : '/api/v1/activities';
    const res = await fetch(url);
    return await res.json();
  },

  async createActivity(newActivity: Omit<Activity, 'id'>): Promise<ApiResponse<Activity>> {
    const res = await fetch('/api/v1/activities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newActivity),
    });
    return await res.json();
  },

  async toggleActivityComplete(activityId: string): Promise<ApiResponse<Activity>> {
    const res = await fetch(`/api/v1/activities/${activityId}/complete`, {
      method: 'PATCH',
    });
    return await res.json();
  },

  // 5. ANALYTICS SUMMARY API
  async getAnalyticsSummary(): Promise<ApiResponse<{ kpis: KpiMetric[]; activePipelineValue: number }>> {
    const res = await fetch('/api/v1/analytics/summary');
    return await res.json();
  },
};
