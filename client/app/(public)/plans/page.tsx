'use client';

import { Metadata } from 'next';
import PlanCard from '@/components/public/PlanCard';
import DietPlanBuilder from '@/components/public/DietPlanBuilder';
import { usePlans } from '@/hooks/usePlans';
import Loading from '@/components/ui/Loading';

export default function PlansPage() {
  const { plans, loading, error } = usePlans();

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Our Diet Plans
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our range of expertly designed nutrition programs.
            Each plan is crafted to help you achieve specific health goals.
          </p>
        </div>
      </section>

      {/* Plans Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <Loading size="lg" className="py-12" />
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Try again
              </button>
            </div>
          ) : plans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {plans.map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Plans Available Yet</h3>
              <p className="text-gray-600">
                We are working on adding new diet plans. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* AI Diet Plan Builder */}
      <DietPlanBuilder />

      {/* CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Not sure which plan is right for you?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Our nutrition experts are here to help you find the perfect plan for your goals and lifestyle.
          </p>
          <a
            href="/contact"
            className="bg-primary-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors inline-block"
          >
            Get a Free Consultation
          </a>
        </div>
      </section>
    </div>
  );
}
