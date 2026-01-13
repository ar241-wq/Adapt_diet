import { AuthResponse, Plan, Lead, ChatSession, ChatMessage, LeadFormData, ApiError, DietPlanRequest, DietPlanResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

class ApiClient {
  private getAuthHeaders(): HeadersInit {
    if (typeof window === 'undefined') return {};
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || error.detail || 'Request failed');
    }
    if (response.status === 204) {
      return {} as T;
    }
    return response.json();
  }

  // Auth endpoints
  async login(username: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return this.handleResponse<AuthResponse>(response);
  }

  async refreshToken(refreshToken: string): Promise<{ access: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    return this.handleResponse<{ access: string }>(response);
  }

  async getMe(): Promise<AuthResponse['user']> {
    const response = await fetch(`${API_BASE_URL}/auth/me/`, {
      headers: { ...this.getAuthHeaders() },
    });
    return this.handleResponse(response);
  }

  // Public plan endpoints
  async getPlans(): Promise<Plan[]> {
    const response = await fetch(`${API_BASE_URL}/plans/`);
    return this.handleResponse<Plan[]>(response);
  }

  async getPlanBySlug(slug: string): Promise<Plan> {
    const response = await fetch(`${API_BASE_URL}/plans/${slug}/`);
    return this.handleResponse<Plan>(response);
  }

  // Admin plan endpoints
  async getAdminPlans(): Promise<Plan[]> {
    const response = await fetch(`${API_BASE_URL}/plans/admin/list/`, {
      headers: { ...this.getAuthHeaders() },
    });
    return this.handleResponse<Plan[]>(response);
  }

  async getAdminPlan(id: number): Promise<Plan> {
    const response = await fetch(`${API_BASE_URL}/plans/admin/${id}/`, {
      headers: { ...this.getAuthHeaders() },
    });
    return this.handleResponse<Plan>(response);
  }

  async createPlan(data: FormData): Promise<Plan> {
    const response = await fetch(`${API_BASE_URL}/plans/admin/create/`, {
      method: 'POST',
      headers: { ...this.getAuthHeaders() },
      body: data,
    });
    return this.handleResponse<Plan>(response);
  }

  async updatePlan(id: number, data: FormData): Promise<Plan> {
    const response = await fetch(`${API_BASE_URL}/plans/admin/${id}/update/`, {
      method: 'PATCH',
      headers: { ...this.getAuthHeaders() },
      body: data,
    });
    return this.handleResponse<Plan>(response);
  }

  async deletePlan(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/plans/admin/${id}/delete/`, {
      method: 'DELETE',
      headers: { ...this.getAuthHeaders() },
    });
    return this.handleResponse<void>(response);
  }

  // Lead endpoints
  async createLead(data: LeadFormData): Promise<{ message: string; id: number }> {
    const response = await fetch(`${API_BASE_URL}/leads/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async getAdminLeads(): Promise<Lead[]> {
    const response = await fetch(`${API_BASE_URL}/leads/admin/`, {
      headers: { ...this.getAuthHeaders() },
    });
    return this.handleResponse<Lead[]>(response);
  }

  // Chat endpoints
  async createOrGetSession(sessionId?: string, visitorName?: string): Promise<ChatSession> {
    const response = await fetch(`${API_BASE_URL}/chat/session/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId, visitor_name: visitorName }),
    });
    return this.handleResponse<ChatSession>(response);
  }

  async getSessionMessages(sessionId: string): Promise<ChatMessage[]> {
    const response = await fetch(`${API_BASE_URL}/chat/session/${sessionId}/messages/`);
    return this.handleResponse<ChatMessage[]>(response);
  }

  async getAdminSessions(): Promise<ChatSession[]> {
    const response = await fetch(`${API_BASE_URL}/chat/admin/sessions/`, {
      headers: { ...this.getAuthHeaders() },
    });
    return this.handleResponse<ChatSession[]>(response);
  }

  async getAdminSessionMessages(sessionId: string): Promise<ChatMessage[]> {
    const response = await fetch(`${API_BASE_URL}/chat/admin/sessions/${sessionId}/messages/`, {
      headers: { ...this.getAuthHeaders() },
    });
    return this.handleResponse<ChatMessage[]>(response);
  }

  // Diet Plan Generator
  async generateDietPlan(data: DietPlanRequest): Promise<DietPlanResponse> {
    const response = await fetch(`${API_BASE_URL}/plans/generate-diet/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return this.handleResponse<DietPlanResponse>(response);
  }
}

export const api = new ApiClient();
