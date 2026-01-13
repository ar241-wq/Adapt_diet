import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How It Works - Adapt Diet',
  description: 'Learn about our simple 4-step process to transform your health with personalized nutrition.',
};

export default function HowItWorksPage() {
  const steps = [
    {
      number: 1,
      title: 'Choose Your Plan',
      description: 'Browse through our carefully designed diet programs and select the one that aligns with your health goals. Whether you want to lose weight, build muscle, or simply eat healthier, we have a plan for you.',
      details: [
        'Compare different plan options',
        'Read detailed descriptions and benefits',
        'See what is included in each plan',
        'Choose based on your specific goals',
      ],
    },
    {
      number: 2,
      title: 'Share Your Profile',
      description: 'Tell us about yourself! Fill out our comprehensive questionnaire covering your health history, dietary preferences, allergies, lifestyle, and goals. This information helps us personalize your plan.',
      details: [
        'Health and medical history',
        'Food preferences and restrictions',
        'Daily schedule and activity level',
        'Specific goals and timeline',
      ],
    },
    {
      number: 3,
      title: 'Receive Your Custom Plan',
      description: 'Our team of nutrition experts will create a personalized meal plan tailored specifically for you. You will receive detailed weekly meal plans, recipes, shopping lists, and nutritional guidance.',
      details: [
        'Personalized weekly meal plans',
        'Easy-to-follow recipes',
        'Organized shopping lists',
        'Nutritional breakdown for each meal',
      ],
    },
    {
      number: 4,
      title: 'Transform & Thrive',
      description: 'Start following your plan and watch the transformation happen. Track your progress, get support from our team, and make adjustments as needed. We are with you every step of the way.',
      details: [
        'Daily meal guidance',
        'Progress tracking tools',
        'Direct support from nutritionists',
        'Regular plan adjustments',
      ],
    },
  ];

  const faqs = [
    {
      question: 'How long until I see results?',
      answer: 'Most clients start noticing changes within 2-3 weeks of following their plan consistently. However, sustainable results vary based on individual factors and goals.',
    },
    {
      question: 'Can I customize my meal plan after receiving it?',
      answer: 'Absolutely! We understand that life happens. Our team is always available to make adjustments to your plan based on your feedback and changing needs.',
    },
    {
      question: 'What if I have food allergies or restrictions?',
      answer: 'We take all dietary restrictions seriously. During the questionnaire phase, you will specify all allergies and restrictions, and your plan will be crafted accordingly.',
    },
    {
      question: 'Do I need to buy special foods or supplements?',
      answer: 'Our plans focus on whole, accessible foods that you can find at any grocery store. We may recommend certain supplements based on your needs, but they are never mandatory.',
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            How Adapt Diet Works
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our simple 4-step process makes it easy to start your journey to better health.
            No complicated formulas, no confusing science - just a clear path to your goals.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mr-4">
                      {step.number}
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {step.title}
                    </h2>
                  </div>
                  <p className="text-lg text-gray-600 mb-6">{step.description}</p>
                  <ul className="space-y-3">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-start">
                        <svg
                          className="w-6 h-6 text-primary-500 mr-2 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-600">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl p-8 lg:p-12 h-64 flex items-center justify-center">
                    <span className="text-8xl font-bold text-primary-200">{step.number}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Got questions? We have answers.
            </p>
          </div>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto mb-8">
            Take the first step towards a healthier you. Browse our plans or reach out to us directly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/plans"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-100 transition-colors"
            >
              View Plans
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-white/10 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
