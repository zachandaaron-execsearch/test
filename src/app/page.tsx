import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 to-gray-950" />
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Win More With
            <span className="text-green-500"> Expert Picks</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto">
            Get access to professional sports analysis and winning picks across NFL, NBA, MLB, NHL, and more.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-4 rounded-lg font-semibold transition"
            >
              Start Winning Today
            </Link>
            <Link
              href="/picks"
              className="bg-gray-800 hover:bg-gray-700 text-white text-lg px-8 py-4 rounded-lg font-semibold transition"
            >
              View Recent Picks
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-green-500">68%</div>
              <div className="text-gray-400 mt-2">Win Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-green-500">500+</div>
              <div className="text-gray-400 mt-2">Picks Made</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-green-500">5K+</div>
              <div className="text-gray-400 mt-2">Members</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-green-500">4+</div>
              <div className="text-gray-400 mt-2">Sports</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-900 p-8 rounded-xl border border-gray-800">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center text-2xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Create Account</h3>
              <p className="text-gray-400">
                Sign up for free and get instant access to select daily picks and analysis.
              </p>
            </div>
            <div className="bg-gray-900 p-8 rounded-xl border border-gray-800">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center text-2xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Choose Your Plan</h3>
              <p className="text-gray-400">
                Subscribe to Pro or Premium for full access, or buy individual picks.
              </p>
            </div>
            <div className="bg-gray-900 p-8 rounded-xl border border-gray-800">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center text-2xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Start Winning</h3>
              <p className="text-gray-400">
                Follow our expert picks with detailed analysis and watch your bankroll grow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-gray-400 mb-12 max-w-2xl mx-auto">
            Choose the plan that works for you. Cancel anytime.
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-gray-900 p-8 rounded-xl border border-gray-800">
              <h3 className="text-xl font-semibold mb-2">Free</h3>
              <div className="text-4xl font-bold mb-4">$0</div>
              <p className="text-gray-400 mb-6">Perfect for getting started</p>
              <Link
                href="/register"
                className="block w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition"
              >
                Get Started
              </Link>
            </div>
            <div className="bg-gray-900 p-8 rounded-xl border-2 border-green-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500 text-sm px-3 py-1 rounded-full font-semibold">
                Popular
              </div>
              <h3 className="text-xl font-semibold mb-2">Pro</h3>
              <div className="text-4xl font-bold mb-4">$19.99<span className="text-lg text-gray-400">/mo</span></div>
              <p className="text-gray-400 mb-6">For serious bettors</p>
              <Link
                href="/pricing"
                className="block w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
              >
                Subscribe Now
              </Link>
            </div>
            <div className="bg-gray-900 p-8 rounded-xl border border-purple-500">
              <h3 className="text-xl font-semibold mb-2">Premium</h3>
              <div className="text-4xl font-bold mb-4">$49.99<span className="text-lg text-gray-400">/mo</span></div>
              <p className="text-gray-400 mb-6">All access VIP</p>
              <Link
                href="/pricing"
                className="block w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition"
              >
                Go Premium
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Winning?</h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of members who trust our expert picks.
          </p>
          <Link
            href="/register"
            className="inline-block bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-4 rounded-lg font-semibold transition"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} SportsPicksPro. All rights reserved.</p>
          <p className="mt-2 text-sm">
            Gambling involves risk. Please bet responsibly.
          </p>
        </div>
      </footer>
    </div>
  );
}
