'use client';

import { useState, useEffect, useCallback } from 'react';
import { User } from '@/types';
import { auth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = auth.getUser();
      if (storedUser) {
        setUser(storedUser);
        // Validate session in background
        const isValid = await auth.validateSession();
        if (!isValid) {
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const loggedInUser = await auth.login(username, password);
    setUser(loggedInUser);
    return loggedInUser;
  }, []);

  const logout = useCallback(() => {
    auth.logout();
    setUser(null);
    router.push('/admin/login');
  }, [router]);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
  };
}
