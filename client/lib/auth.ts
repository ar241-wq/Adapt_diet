import { User } from '@/types';
import { api } from './api';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user';

export const auth = {
  setTokens(access: string, refresh: string) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  },

  setUser(user: User) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  getUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  },

  async login(username: string, password: string): Promise<User> {
    const response = await api.login(username, password);
    this.setTokens(response.access, response.refresh);
    this.setUser(response.user);
    return response.user;
  },

  logout() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  async refreshAccessToken(): Promise<boolean> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return false;

    try {
      const response = await api.refreshToken(refreshToken);
      localStorage.setItem(ACCESS_TOKEN_KEY, response.access);
      return true;
    } catch {
      this.logout();
      return false;
    }
  },

  async validateSession(): Promise<boolean> {
    if (!this.isAuthenticated()) return false;

    try {
      await api.getMe();
      return true;
    } catch {
      // Try to refresh token
      const refreshed = await this.refreshAccessToken();
      if (refreshed) {
        try {
          await api.getMe();
          return true;
        } catch {
          return false;
        }
      }
      return false;
    }
  },
};
