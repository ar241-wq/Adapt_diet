'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Plan } from '@/types';
import Card from '@/components/ui/Card';

interface PlanCardProps {
  plan: Plan;
}

export default function PlanCard({ plan }: PlanCardProps) {
  return (
    <Card variant="elevated" className="overflow-hidden hover:shadow-xl transition-shadow group">
      <div className="relative h-48 bg-gray-200">
        {plan.image_url ? (
          <Image
            src={plan.image_url}
            alt={plan.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-3">
          {plan.tags_list.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{plan.short_description}</p>
        <div className="flex items-center justify-between">
          {plan.price ? (
            <span className="text-2xl font-bold text-primary-600">${plan.price}</span>
          ) : (
            <span className="text-sm text-gray-500">Contact for pricing</span>
          )}
          <Link
            href={`/plans/${plan.slug}`}
            className="text-primary-600 font-medium hover:text-primary-700 transition-colors"
          >
            Learn More &rarr;
          </Link>
        </div>
      </div>
    </Card>
  );
}
