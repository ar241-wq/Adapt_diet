'use client';

import Link from 'next/link';

export default function Hero() {
  return (
    <section
      className="relative py-24 lg:py-40 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/dieta.jpg')" }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-lg">
            Transform Your Health with{' '}
            <span className="text-primary-300">Personalized</span> Nutrition
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-8 drop-shadow">
            Discover diet plans tailored to your unique body, lifestyle, and goals.
            Our expert-crafted programs help you achieve lasting results without the guesswork.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/plans"
              className="bg-primary-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-primary-700 transition-colors shadow-lg"
            >
              Explore Plans
            </Link>
            <Link
              href="/how-it-works"
              className="border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-white/10 transition-colors"
            >
              How It Works
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
