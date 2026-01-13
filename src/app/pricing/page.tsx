'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    description: 'Get started with basic picks',
    features: [
      'Access to free picks',
      'Basic game analysis',
      'Community access',
    ],
    notIncluded: [
      'Pro picks',
      'Premium picks',
      'Priority support',
      'Discord access',
    ],
    buttonText: 'Current Plan',
    buttonStyle: 'bg-gray-700',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 19.99,
    description: 'For serious sports bettors',
    features: [
      'All Free features',
      'Access to Pro picks',
      'Detailed analysis',
      'Email alerts',
    ],
    notIncluded: [
      'Premium picks',
      'Discord access',
    ],
    buttonText: 'Subscribe to Pro',
    buttonStyle: 'bg-green-600 hover:bg-green-700',
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 49.99,
    description: 'All access VIP membership',
    features: [
      'All Pro features',
      'Access to ALL picks',
      'Early access to picks',
      'Premium analysis',
      'Discord VIP access',
      'Priority support',
      '1-on-1 consultations',
    ],
    notIncluded: [],
    buttonText: 'Go Premium',
    buttonStyle: 'bg-purple-600 hover:bg-purple-700',
  },
];

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (tier: string) => {
    if (!session) {
      router.push('/login');
      return;
    }

    if (tier === 'free') return;

    setLoading(tier);
    try {
      const res = await fetch('/api/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
      });

      if (res.ok) {
        // In a real app, you'd redirect to Stripe checkout
        // For demo, we simulate successful subscription
        alert(`Successfully subscribed to ${tier.toUpperCase()}!`);
        router.push('/picks');
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || 'Subscription failed');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Subscription failed');
    } finally {
      setLoading(null);
    }
  };

  const currentTier = session?.user?.subscriptionTier || 'free';

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Get access to winning picks and expert analysis. Cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-gray-900 rounded-2xl border-2 ${
                plan.popular
                  ? 'border-green-500'
                  : plan.id === 'premium'
                  ? 'border-purple-500'
                  : 'border-gray-800'
              } p-8 relative flex flex-col`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500 text-sm px-4 py-1 rounded-full font-semibold">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold">
                    ${plan.price.toFixed(0)}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-gray-400">/month</span>
                  )}
                </div>
                <p className="text-gray-400 mt-2">{plan.description}</p>
              </div>

              <div className="flex-1">
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                  {plan.notIncluded.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      <span className="text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {currentTier === plan.id ? (
                <button
                  disabled
                  className="w-full py-3 rounded-lg font-semibold bg-gray-700 text-gray-400 cursor-not-allowed"
                >
                  Current Plan
                </button>
              ) : session ? (
                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={loading === plan.id || plan.id === 'free'}
                  className={`w-full py-3 rounded-lg font-semibold transition ${plan.buttonStyle} ${
                    plan.id === 'free' ? 'cursor-not-allowed' : ''
                  } disabled:opacity-50`}
                >
                  {loading === plan.id ? 'Processing...' : plan.buttonText}
                </button>
              ) : (
                <Link
                  href="/register"
                  className={`block w-full py-3 rounded-lg font-semibold text-center transition ${plan.buttonStyle}`}
                >
                  Get Started
                </Link>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
              <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-400">
                Yes! You can cancel your subscription at any time. Your access will continue until the end of your billing period.
              </p>
            </div>
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
              <h3 className="font-semibold mb-2">What sports do you cover?</h3>
              <p className="text-gray-400">
                We cover NFL, NBA, MLB, NHL, college sports, and more. Premium members get picks across all sports.
              </p>
            </div>
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
              <h3 className="font-semibold mb-2">Can I buy individual picks?</h3>
              <p className="text-gray-400">
                Yes! If you don't want a subscription, you can unlock individual picks with a one-time purchase.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
