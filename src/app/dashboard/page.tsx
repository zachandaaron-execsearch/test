'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Pick {
  id: string;
  sport: string;
  game: string;
  gameDate: string;
  result: string;
  pickTeam?: string;
  pickType?: string;
  hasAccess: boolean;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [picks, setPicks] = useState<Pick[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchPicks();
    }
  }, [session]);

  const fetchPicks = async () => {
    try {
      const res = await fetch('/api/picks');
      const data = await res.json();
      setPicks(data.picks?.filter((p: Pick) => p.hasAccess) || []);
    } catch (error) {
      console.error('Error fetching picks:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  const user = session.user;
  const tierColors: Record<string, string> = {
    free: 'bg-gray-600',
    pro: 'bg-blue-600',
    premium: 'bg-purple-600',
  };

  const accessiblePicks = picks.filter(p => p.hasAccess);
  const wonPicks = accessiblePicks.filter(p => p.result === 'won').length;
  const lostPicks = accessiblePicks.filter(p => p.result === 'lost').length;
  const pendingPicks = accessiblePicks.filter(p => p.result === 'pending').length;
  const winRate = wonPicks + lostPicks > 0 ? ((wonPicks / (wonPicks + lostPicks)) * 100).toFixed(1) : '-';

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome back, {user.name}</p>
        </div>

        {/* Account Overview */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h2 className="text-lg font-semibold mb-4">Account Info</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Name</span>
                <span>{user.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Email</span>
                <span>{user.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Plan</span>
                <span className={`${tierColors[user.subscriptionTier]} px-3 py-1 rounded-full text-sm font-medium`}>
                  {user.subscriptionTier.toUpperCase()}
                </span>
              </div>
              {user.subscriptionExpiry && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Renews</span>
                  <span>{new Date(user.subscriptionExpiry).toLocaleDateString()}</span>
                </div>
              )}
            </div>
            {user.subscriptionTier !== 'premium' && (
              <Link
                href="/pricing"
                className="block mt-6 text-center bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition"
              >
                Upgrade Plan
              </Link>
            )}
          </div>

          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h2 className="text-lg font-semibold mb-4">Your Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-green-500">{winRate}%</div>
                <div className="text-gray-400 text-sm">Win Rate</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold">{accessiblePicks.length}</div>
                <div className="text-gray-400 text-sm">Total Picks</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-green-400">{wonPicks}</div>
                <div className="text-gray-400 text-sm">Wins</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-red-400">{lostPicks}</div>
                <div className="text-gray-400 text-sm">Losses</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Picks */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Your Accessible Picks</h2>
            <Link
              href="/picks"
              className="text-green-500 hover:text-green-400 text-sm font-medium"
            >
              View All Picks
            </Link>
          </div>

          {loading ? (
            <div className="text-center text-gray-400 py-8">Loading picks...</div>
          ) : accessiblePicks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">You don't have access to any picks yet.</p>
              <Link
                href="/picks"
                className="text-green-500 hover:text-green-400 font-medium"
              >
                Browse Available Picks
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {accessiblePicks.slice(0, 5).map(pick => (
                <div
                  key={pick.id}
                  className="flex items-center justify-between bg-gray-800 rounded-lg p-4"
                >
                  <div>
                    <div className="font-medium">{pick.game}</div>
                    <div className="text-sm text-gray-400">
                      {pick.sport} • {pick.pickTeam} ({pick.pickType})
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-400">
                      {new Date(pick.gameDate).toLocaleDateString()}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        pick.result === 'won'
                          ? 'bg-green-500/20 text-green-400'
                          : pick.result === 'lost'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}
                    >
                      {pick.result.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {pendingPicks > 0 && (
          <div className="mt-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-center">
            <p className="text-yellow-400">
              You have <span className="font-bold">{pendingPicks}</span> pending pick{pendingPicks > 1 ? 's' : ''} awaiting results
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
