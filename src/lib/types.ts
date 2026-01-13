export type SubscriptionTier = 'free' | 'pro' | 'premium';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  isAdmin: boolean;
  subscriptionTier: SubscriptionTier;
  subscriptionExpiry: string | null;
  createdAt: string;
}

export interface Pick {
  id: string;
  sport: string;
  league: string;
  game: string;
  pickTeam: string;
  pickType: string; // spread, moneyline, over/under, etc.
  odds: string;
  analysis: string;
  result: 'pending' | 'won' | 'lost' | 'push';
  requiredTier: SubscriptionTier;
  oneTimePurchasePrice: number; // in cents
  gameDate: string;
  createdAt: string;
  isVisible: boolean;
}

export interface Purchase {
  id: string;
  userId: string;
  pickId: string;
  amount: number; // in cents
  createdAt: string;
}

export interface UserSession {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  subscriptionTier: SubscriptionTier;
  subscriptionExpiry: string | null;
}
