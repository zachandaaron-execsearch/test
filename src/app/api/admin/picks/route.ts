import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getPicks, createPick, updatePick, deletePick, generateId } from '@/lib/db';
import { Pick, SubscriptionTier } from '@/lib/types';

// Middleware to check admin status
async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return null;
  }
  return session;
}

export async function GET() {
  try {
    const session = await checkAdmin();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const picks = getPicks();
    picks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ picks });
  } catch (error) {
    console.error('Error fetching picks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch picks' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await checkAdmin();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const {
      sport,
      league,
      game,
      pickTeam,
      pickType,
      odds,
      analysis,
      requiredTier,
      oneTimePurchasePrice,
      gameDate,
      isVisible = true,
    } = body;

    if (!sport || !league || !game || !pickTeam || !pickType || !odds || !gameDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const pick: Pick = {
      id: generateId(),
      sport,
      league,
      game,
      pickTeam,
      pickType,
      odds,
      analysis: analysis || '',
      result: 'pending',
      requiredTier: (requiredTier as SubscriptionTier) || 'free',
      oneTimePurchasePrice: oneTimePurchasePrice || 299,
      gameDate,
      createdAt: new Date().toISOString(),
      isVisible,
    };

    createPick(pick);

    return NextResponse.json({ message: 'Pick created', pick }, { status: 201 });
  } catch (error) {
    console.error('Error creating pick:', error);
    return NextResponse.json(
      { error: 'Failed to create pick' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await checkAdmin();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Pick ID is required' },
        { status: 400 }
      );
    }

    const updatedPick = updatePick(id, updates);

    if (!updatedPick) {
      return NextResponse.json(
        { error: 'Pick not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Pick updated', pick: updatedPick });
  } catch (error) {
    console.error('Error updating pick:', error);
    return NextResponse.json(
      { error: 'Failed to update pick' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await checkAdmin();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Pick ID is required' },
        { status: 400 }
      );
    }

    const deleted = deletePick(id);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Pick not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Pick deleted' });
  } catch (error) {
    console.error('Error deleting pick:', error);
    return NextResponse.json(
      { error: 'Failed to delete pick' },
      { status: 500 }
    );
  }
}
