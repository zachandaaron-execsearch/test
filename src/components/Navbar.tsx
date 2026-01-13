'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

export default function Navbar() {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-green-500">SportsPicks</span>
              <span className="text-2xl font-bold text-white">Pro</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/picks"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Picks
            </Link>
            <Link
              href="/pricing"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Pricing
            </Link>

            {status === 'loading' ? (
              <div className="w-8 h-8 rounded-full bg-gray-700 animate-pulse" />
            ) : session ? (
              <>
                {session.user.isAdmin && (
                  <Link
                    href="/admin"
                    className="text-yellow-400 hover:text-yellow-300 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">{session.user.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    session.user.subscriptionTier === 'premium'
                      ? 'bg-purple-600 text-white'
                      : session.user.subscriptionTier === 'pro'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-600 text-gray-300'
                  }`}>
                    {session.user.subscriptionTier.toUpperCase()}
                  </span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-300 hover:text-white"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              <Link href="/picks" className="text-gray-300 hover:text-white px-3 py-2">
                Picks
              </Link>
              <Link href="/pricing" className="text-gray-300 hover:text-white px-3 py-2">
                Pricing
              </Link>
              {session ? (
                <>
                  {session.user.isAdmin && (
                    <Link href="/admin" className="text-yellow-400 hover:text-yellow-300 px-3 py-2">
                      Admin
                    </Link>
                  )}
                  <Link href="/dashboard" className="text-gray-300 hover:text-white px-3 py-2">
                    Dashboard
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="text-left text-gray-300 hover:text-white px-3 py-2"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-gray-300 hover:text-white px-3 py-2">
                    Sign In
                  </Link>
                  <Link href="/register" className="text-green-500 hover:text-green-400 px-3 py-2">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
