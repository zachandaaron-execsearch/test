import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getVisiblePicks, getUserPurchases } from '@/lib/db';
import { SubscriptionTier } from '@/lib/types';

const tierAccess: Record<SubscriptionTier, SubscriptionTier[]> = {
  free: ['free'],
  pro: ['free', 'pro'],
  premium: ['free', 'pro', 'premium'],
};

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const picks = getVisiblePicks();

    // Sort by date, newest first
    picks.sort((a, b) => new Date(b.gameDate).getTime() - new Date(a.gameDate).getTime());

    // Get user's purchases if logged in
    const userPurchases = session?.user?.id
      ? getUserPurchases(session.user.id).map(p => p.pickId)
      : [];

    const userTier = (session?.user?.subscriptionTier || 'free') as SubscriptionTier;
    const accessibleTiers = tierAccess[userTier];

    // Map picks with access info
    const picksWithAccess = picks.map(pick => {
      const hasAccess = accessibleTiers.includes(pick.requiredTier) ||
                        userPurchases.includes(pick.id) ||
                        session?.user?.isAdmin;

      return {
        id: pick.id,
        sport: pick.sport,
        league: pick.league,
        game: pick.game,
        gameDate: pick.gameDate,
        result: pick.result,
        requiredTier: pick.requiredTier,
        oneTimePurchasePrice: pick.oneTimePurchasePrice,
        hasAccess,
        // Only include these if user has access
        ...(hasAccess ? {
          pickTeam: pick.pickTeam,
          pickType: pick.pickType,
          odds: pick.odds,
          analysis: pick.analysis,
        } : {}),
      };
    });

    return NextResponse.json({ picks: picksWithAccess });
  } catch (error) {
    console.error('Error fetching picks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch picks' },
      { status: 500 }
    );
  }
}
