'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plan } from '@/types';
import { api } from '@/lib/api';

export function usePlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getPlans();
      setPlans(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch plans');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  return { plans, loading, error, refetch: fetchPlans };
}

export function useAdminPlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAdminPlans();
      setPlans(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch plans');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const createPlan = useCallback(async (data: FormData) => {
    const newPlan = await api.createPlan(data);
    setPlans((prev) => [newPlan, ...prev]);
    return newPlan;
  }, []);

  const updatePlan = useCallback(async (id: number, data: FormData) => {
    const updatedPlan = await api.updatePlan(id, data);
    setPlans((prev) => prev.map((p) => (p.id === id ? updatedPlan : p)));
    return updatedPlan;
  }, []);

  const deletePlan = useCallback(async (id: number) => {
    await api.deletePlan(id);
    setPlans((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return {
    plans,
    loading,
    error,
    refetch: fetchPlans,
    createPlan,
    updatePlan,
    deletePlan,
  };
}
