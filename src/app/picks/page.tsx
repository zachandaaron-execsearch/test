'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Pick {
  id: string;
  sport: string;
  league: string;
  game: string;
  gameDate: string;
  result: 'pending' | 'won' | 'lost' | 'push';
  requiredTier: string;
  oneTimePurchasePrice: number;
  hasAccess: boolean;
  pickTeam?: string;
  pickType?: string;
  odds?: string;
  analysis?: string;
}

export default function PicksPage() {
  const { data: session } = useSession();
  const [picks, setPicks] = useState<Pick[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchPicks();
  }, [session]);

  const fetchPicks = async () => {
    try {
      const res = await fetch('/api/picks');
      const data = await res.json();
      setPicks(data.picks || []);
    } catch (error) {
      console.error('Error fetching picks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (pickId: string) => {
    if (!session) {
      window.location.href = '/login';
      return;
    }

    setPurchasing(pickId);
    try {
      const res = await fetch('/api/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pickId }),
      });

      if (res.ok) {
        await fetchPicks();
      } else {
        const data = await res.json();
        alert(data.error || 'Purchase failed');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Purchase failed');
    } finally {
      setPurchasing(null);
    }
  };

  const filteredPicks = picks.filter(pick => {
    if (filter === 'all') return true;
    return pick.sport.toLowerCase() === filter.toLowerCase();
  });

  const sports = [...new Set(picks.map(p => p.sport))];

  const getResultBadge = (result: string) => {
    switch (result) {
      case 'won':
        return <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-medium">WON</span>;
      case 'lost':
        return <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs font-medium">LOST</span>;
      case 'push':
        return <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs font-medium">PUSH</span>;
      default:
        return <span className="bg-gray-500/20 text-gray-400 px-2 py-1 rounded text-xs font-medium">PENDING</span>;
    }
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'premium':
        return <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs font-medium">PREMIUM</span>;
      case 'pro':
        return <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs font-medium">PRO</span>;
      default:
        return <span className="bg-gray-500/20 text-gray-400 px-2 py-1 rounded text-xs font-medium">FREE</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">Loading picks...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Sports Picks</h1>
            <p className="text-gray-400 mt-1">Expert analysis and winning picks</p>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === 'all' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              All
            </button>
            {sports.map(sport => (
              <button
                key={sport}
                onClick={() => setFilter(sport)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === sport ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {sport}
              </button>
            ))}
          </div>
        </div>

        {filteredPicks.length === 0 ? (
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-12 text-center">
            <p className="text-gray-400 text-lg">No picks available yet.</p>
            <p className="text-gray-500 mt-2">Check back soon for new picks!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPicks.map(pick => (
              <div
                key={pick.id}
                className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-green-500">{pick.sport}</span>
                        <span className="text-gray-600">•</span>
                        <span className="text-sm text-gray-400">{pick.league}</span>
                        <span className="text-gray-600">•</span>
                        <span className="text-sm text-gray-400">
                          {new Date(pick.gameDate).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{pick.game}</h3>
                      <div className="flex flex-wrap items-center gap-2">
                        {getResultBadge(pick.result)}
                        {getTierBadge(pick.requiredTier)}
                      </div>
                    </div>
                  </div>

                  {pick.hasAccess ? (
                    <div className="mt-6 pt-6 border-t border-gray-800">
                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-gray-800 p-4 rounded-lg">
                          <div className="text-sm text-gray-400 mb-1">Pick</div>
                          <div className="text-lg font-bold text-green-400">{pick.pickTeam}</div>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg">
                          <div className="text-sm text-gray-400 mb-1">Type</div>
                          <div className="text-lg font-semibold">{pick.pickType}</div>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg">
                          <div className="text-sm text-gray-400 mb-1">Odds</div>
                          <div className="text-lg font-semibold">{pick.odds}</div>
                        </div>
                      </div>
                      {pick.analysis && (
                        <div className="bg-gray-800/50 p-4 rounded-lg">
                          <div className="text-sm text-gray-400 mb-2">Analysis</div>
                          <p className="text-gray-300 whitespace-pre-wrap">{pick.analysis}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="mt-6 pt-6 border-t border-gray-800">
                      <div className="bg-gradient-to-r from-gray-800 to-gray-800/50 p-6 rounded-lg text-center">
                        <div className="text-4xl mb-3">🔒</div>
                        <p className="text-gray-400 mb-4">
                          {pick.requiredTier === 'free'
                            ? 'Sign in to view this pick'
                            : `This pick requires ${pick.requiredTier.toUpperCase()} access`}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                          {!session ? (
                            <Link
                              href="/login"
                              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition"
                            >
                              Sign In
                            </Link>
                          ) : (
                            <>
                              <Link
                                href="/pricing"
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition"
                              >
                                Upgrade to {pick.requiredTier.charAt(0).toUpperCase() + pick.requiredTier.slice(1)}
                              </Link>
                              <button
                                onClick={() => handlePurchase(pick.id)}
                                disabled={purchasing === pick.id}
                                className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white px-6 py-2 rounded-lg font-medium transition"
                              >
                                {purchasing === pick.id
                                  ? 'Processing...'
                                  : `Unlock for $${(pick.oneTimePurchasePrice / 100).toFixed(2)}`}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
