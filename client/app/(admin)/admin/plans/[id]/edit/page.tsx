'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PlanForm from '@/components/admin/PlanForm';
import Loading from '@/components/ui/Loading';
import { api } from '@/lib/api';
import { Plan } from '@/types';

export default function EditPlanPage() {
  const params = useParams();
  const router = useRouter();
  const planId = Number(params.id);

  const [plan, setPlan] = useState<Plan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const data = await api.getAdminPlan(planId);
        setPlan(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load plan');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlan();
  }, [planId]);

  const handleSubmit = async (data: FormData) => {
    setIsSaving(true);
    setError(null);

    try {
      await api.updatePlan(planId, data);
      router.push('/admin/plans');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update plan');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loading size="lg" />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Plan Not Found</h2>
        <p className="text-gray-600 mb-4">{error || 'The plan you are looking for does not exist.'}</p>
        <button
          onClick={() => router.push('/admin/plans')}
          className="text-primary-600 hover:text-primary-700"
        >
          Back to Plans
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Plan</h1>
        <p className="text-gray-600">Update the details of {plan.title}</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <PlanForm plan={plan} onSubmit={handleSubmit} isLoading={isSaving} />
      </div>
    </div>
  );
}
