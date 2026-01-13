'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Plan } from '@/types';
import Loading from '@/components/ui/Loading';
import Button from '@/components/ui/Button';

export default function PlanDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const data = await api.getPlanBySlug(slug);
        setPlan(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load plan');
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Plan Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The plan you are looking for does not exist.'}</p>
          <Link href="/plans">
            <Button>View All Plans</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/plans"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Plans
          </Link>
        </div>
      </section>

      {/* Plan Details */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image */}
            <div className="relative h-96 lg:h-auto bg-gray-200 rounded-2xl overflow-hidden">
              {plan.image_url ? (
                <Image
                  src={plan.image_url}
                  alt={plan.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                {plan.tags_list.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-sm font-medium bg-primary-100 text-primary-700 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                {plan.title}
              </h1>

              <p className="text-lg text-gray-600 mb-6">{plan.short_description}</p>

              {plan.price ? (
                <div className="mb-8">
                  <span className="text-4xl font-bold text-primary-600">${plan.price}</span>
                  <span className="text-gray-500 ml-2">one-time</span>
                </div>
              ) : (
                <div className="mb-8">
                  <span className="text-lg text-gray-600">Contact us for pricing</span>
                </div>
              )}

              <Link href="/contact">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started with This Plan
                </Button>
              </Link>
            </div>
          </div>

          {/* Full Description */}
          {plan.full_description && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">About This Plan</h2>
              <div className="prose prose-lg max-w-none text-gray-600">
                {plan.full_description.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Have Questions About This Plan?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Our nutrition experts are here to help. Reach out and we will guide you through everything.
          </p>
          <Link href="/contact">
            <Button variant="outline" size="lg">
              Contact Us
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
