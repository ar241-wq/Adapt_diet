'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PlanForm from '@/components/admin/PlanForm';
import { api } from '@/lib/api';

export default function NewPlanPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await api.createPlan(data);
      router.push('/admin/plans');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create plan');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create New Plan</h1>
        <p className="text-gray-600">Add a new diet plan to your offerings</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <PlanForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
}
