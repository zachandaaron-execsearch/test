import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getPickById, hasPurchasedPick, createPurchase, generateId } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'You must be logged in to purchase' },
        { status: 401 }
      );
    }

    const { pickId } = await req.json();

    if (!pickId) {
      return NextResponse.json(
        { error: 'Pick ID is required' },
        { status: 400 }
      );
    }

    const pick = getPickById(pickId);
    if (!pick) {
      return NextResponse.json(
        { error: 'Pick not found' },
        { status: 404 }
      );
    }

    if (hasPurchasedPick(session.user.id, pickId)) {
      return NextResponse.json(
        { error: 'You have already purchased this pick' },
        { status: 400 }
      );
    }

    // In a real app, you'd process payment here with Stripe
    // For now, we'll simulate a successful payment

    const purchase = {
      id: generateId(),
      userId: session.user.id,
      pickId,
      amount: pick.oneTimePurchasePrice,
      createdAt: new Date().toISOString(),
    };

    createPurchase(purchase);

    return NextResponse.json({
      message: 'Purchase successful',
      purchase,
    });
  } catch (error) {
    console.error('Purchase error:', error);
    return NextResponse.json(
      { error: 'Failed to process purchase' },
      { status: 500 }
    );
  }
}
