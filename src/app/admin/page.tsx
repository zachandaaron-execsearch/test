'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Pick {
  id: string;
  sport: string;
  league: string;
  game: string;
  pickTeam: string;
  pickType: string;
  odds: string;
  analysis: string;
  result: 'pending' | 'won' | 'lost' | 'push';
  requiredTier: 'free' | 'pro' | 'premium';
  oneTimePurchasePrice: number;
  gameDate: string;
  isVisible: boolean;
  createdAt: string;
}

type FormData = {
  sport: string;
  league: string;
  game: string;
  pickTeam: string;
  pickType: string;
  odds: string;
  analysis: string;
  requiredTier: 'free' | 'pro' | 'premium';
  oneTimePurchasePrice: number;
  gameDate: string;
  isVisible: boolean;
};

const defaultPick: FormData = {
  sport: '',
  league: '',
  game: '',
  pickTeam: '',
  pickType: 'spread',
  odds: '',
  analysis: '',
  requiredTier: 'pro',
  oneTimePurchasePrice: 299,
  gameDate: '',
  isVisible: true,
};

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [picks, setPicks] = useState<Pick[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState(defaultPick);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && !session?.user?.isAdmin) {
      router.push('/');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (session?.user?.isAdmin) {
      fetchPicks();
    }
  }, [session]);

  const fetchPicks = async () => {
    try {
      const res = await fetch('/api/admin/picks');
      const data = await res.json();
      setPicks(data.picks || []);
    } catch (error) {
      console.error('Error fetching picks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = '/api/admin/picks';
      const method = editing ? 'PUT' : 'POST';
      const body = editing ? { id: editing, ...formData } : formData;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        await fetchPicks();
        setShowForm(false);
        setEditing(null);
        setFormData(defaultPick);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save pick');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save pick');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (pick: Pick) => {
    setFormData({
      sport: pick.sport,
      league: pick.league,
      game: pick.game,
      pickTeam: pick.pickTeam,
      pickType: pick.pickType,
      odds: pick.odds,
      analysis: pick.analysis,
      requiredTier: pick.requiredTier,
      oneTimePurchasePrice: pick.oneTimePurchasePrice,
      gameDate: pick.gameDate.slice(0, 16),
      isVisible: pick.isVisible,
    });
    setEditing(pick.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this pick?')) return;

    try {
      const res = await fetch(`/api/admin/picks?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await fetchPicks();
      } else {
        alert('Failed to delete pick');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete pick');
    }
  };

  const handleUpdateResult = async (id: string, result: string) => {
    try {
      const res = await fetch('/api/admin/picks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, result }),
      });

      if (res.ok) {
        await fetchPicks();
      } else {
        alert('Failed to update result');
      }
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  if (status === 'loading' || !session?.user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-gray-400 mt-1">Manage your sports picks</p>
          </div>
          <button
            onClick={() => {
              setFormData(defaultPick);
              setEditing(null);
              setShowForm(true);
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition"
          >
            + New Pick
          </button>
        </div>

        {/* Pick Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-6">
                {editing ? 'Edit Pick' : 'Create New Pick'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Sport
                    </label>
                    <input
                      type="text"
                      value={formData.sport}
                      onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500"
                      placeholder="e.g., NFL, NBA"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      League
                    </label>
                    <input
                      type="text"
                      value={formData.league}
                      onChange={(e) => setFormData({ ...formData, league: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500"
                      placeholder="e.g., Regular Season, Playoffs"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Game (Matchup)
                  </label>
                  <input
                    type="text"
                    value={formData.game}
                    onChange={(e) => setFormData({ ...formData, game: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500"
                    placeholder="e.g., Chiefs vs Ravens"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Pick (Team/Selection)
                    </label>
                    <input
                      type="text"
                      value={formData.pickTeam}
                      onChange={(e) => setFormData({ ...formData, pickTeam: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500"
                      placeholder="e.g., Chiefs -3.5"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Pick Type
                    </label>
                    <select
                      value={formData.pickType}
                      onChange={(e) => setFormData({ ...formData, pickType: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500"
                    >
                      <option value="spread">Spread</option>
                      <option value="moneyline">Moneyline</option>
                      <option value="over/under">Over/Under</option>
                      <option value="prop">Prop Bet</option>
                      <option value="parlay">Parlay</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Odds
                    </label>
                    <input
                      type="text"
                      value={formData.odds}
                      onChange={(e) => setFormData({ ...formData, odds: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500"
                      placeholder="e.g., -110"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Analysis
                  </label>
                  <textarea
                    value={formData.analysis}
                    onChange={(e) => setFormData({ ...formData, analysis: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 min-h-[120px]"
                    placeholder="Explain your reasoning for this pick..."
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Game Date/Time
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.gameDate}
                      onChange={(e) => setFormData({ ...formData, gameDate: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Required Tier
                    </label>
                    <select
                      value={formData.requiredTier}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          requiredTier: e.target.value as 'free' | 'pro' | 'premium',
                        })
                      }
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500"
                    >
                      <option value="free">Free</option>
                      <option value="pro">Pro</option>
                      <option value="premium">Premium</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      One-time Price (cents)
                    </label>
                    <input
                      type="number"
                      value={formData.oneTimePurchasePrice}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          oneTimePurchasePrice: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500"
                      min="0"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isVisible"
                    checked={formData.isVisible}
                    onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-green-500 focus:ring-green-500"
                  />
                  <label htmlFor="isVisible" className="text-sm text-gray-400">
                    Visible to users
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditing(null);
                    }}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg font-medium transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white py-2 rounded-lg font-medium transition"
                  >
                    {saving ? 'Saving...' : editing ? 'Update Pick' : 'Create Pick'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Picks List */}
        {loading ? (
          <div className="text-center text-gray-400 py-12">Loading picks...</div>
        ) : picks.length === 0 ? (
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-12 text-center">
            <p className="text-gray-400 mb-4">No picks created yet.</p>
            <button
              onClick={() => setShowForm(true)}
              className="text-green-500 hover:text-green-400 font-medium"
            >
              Create your first pick
            </button>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Game</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Pick</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Tier</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Date</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Result</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {picks.map((pick) => (
                    <tr key={pick.id} className="border-b border-gray-800 last:border-0">
                      <td className="p-4">
                        <div className="font-medium">{pick.game}</div>
                        <div className="text-sm text-gray-400">
                          {pick.sport} • {pick.league}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-green-400 font-medium">{pick.pickTeam}</div>
                        <div className="text-sm text-gray-400">
                          {pick.pickType} ({pick.odds})
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            pick.requiredTier === 'premium'
                              ? 'bg-purple-500/20 text-purple-400'
                              : pick.requiredTier === 'pro'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-gray-500/20 text-gray-400'
                          }`}
                        >
                          {pick.requiredTier.toUpperCase()}
                        </span>
                        {!pick.isVisible && (
                          <span className="ml-2 px-2 py-1 rounded text-xs font-medium bg-yellow-500/20 text-yellow-400">
                            HIDDEN
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-sm text-gray-400">
                        {new Date(pick.gameDate).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <select
                          value={pick.result}
                          onChange={(e) => handleUpdateResult(pick.id, e.target.value)}
                          className={`px-3 py-1 rounded text-xs font-medium border-0 focus:ring-0 ${
                            pick.result === 'won'
                              ? 'bg-green-500/20 text-green-400'
                              : pick.result === 'lost'
                              ? 'bg-red-500/20 text-red-400'
                              : pick.result === 'push'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-gray-500/20 text-gray-400'
                          }`}
                        >
                          <option value="pending">PENDING</option>
                          <option value="won">WON</option>
                          <option value="lost">LOST</option>
                          <option value="push">PUSH</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(pick)}
                            className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(pick.id)}
                            className="text-red-400 hover:text-red-300 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
