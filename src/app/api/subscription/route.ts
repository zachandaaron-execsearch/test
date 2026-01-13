import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { updateUser } from '@/lib/db';
import { SubscriptionTier } from '@/lib/types';

export const subscriptionPlans = {
  pro: {
    name: 'Pro',
    price: 1999, // $19.99
    features: ['Access to Pro picks', 'Daily picks', 'Basic analysis'],
  },
  premium: {
    name: 'Premium',
    price: 4999, // $49.99
    features: ['Access to ALL picks', 'Premium analysis', 'Early access', 'Discord access'],
  },
};

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'You must be logged in' },
        { status: 401 }
      );
    }

    const { tier } = await req.json();

    if (!tier || !['pro', 'premium'].includes(tier)) {
      return NextResponse.json(
        { error: 'Invalid subscription tier' },
        { status: 400 }
      );
    }

    // In a real app, you'd process payment with Stripe here
    // For now, we'll simulate a successful subscription

    // Set expiry to 30 days from now
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);

    const updatedUser = updateUser(session.user.id, {
      subscriptionTier: tier as SubscriptionTier,
      subscriptionExpiry: expiryDate.toISOString(),
    });

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Subscription activated',
      subscriptionTier: tier,
      subscriptionExpiry: expiryDate.toISOString(),
    });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to process subscription' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ plans: subscriptionPlans });
}
