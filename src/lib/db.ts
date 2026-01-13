import { User, Pick, Purchase } from './types';
import bcrypt from 'bcryptjs';

// Check if we're in a serverless environment (Vercel)
const isServerless = process.env.VERCEL === '1' || !process.cwd().includes('/home');

// In-memory storage for serverless environments
let memoryUsers: User[] = [];
let memoryPicks: Pick[] = [];
let memoryPurchases: Purchase[] = [];
let initialized = false;

// Initialize with demo data for serverless
async function initDemoData() {
  if (initialized) return;

  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  memoryUsers = [
    {
      id: 'admin1',
      email: 'admin@sportspickspro.com',
      password: adminPassword,
      name: 'Admin',
      isAdmin: true,
      subscriptionTier: 'premium',
      subscriptionExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: 'user1',
      email: 'user@example.com',
      password: userPassword,
      name: 'Demo User',
      isAdmin: false,
      subscriptionTier: 'free',
      subscriptionExpiry: null,
      createdAt: new Date().toISOString(),
    },
  ];

  memoryPicks = [
    {
      id: 'pick1',
      sport: 'NFL',
      league: 'Regular Season',
      game: 'Chiefs vs Ravens',
      pickTeam: 'Chiefs -3.5',
      pickType: 'spread',
      odds: '-110',
      analysis: 'The Chiefs have been dominant at home this season with a 6-1 record ATS. Mahomes is playing at an MVP level and the Ravens secondary has been vulnerable to elite QBs.',
      result: 'pending',
      requiredTier: 'free',
      oneTimePurchasePrice: 0,
      gameDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      isVisible: true,
    },
    {
      id: 'pick2',
      sport: 'NBA',
      league: 'Regular Season',
      game: 'Lakers vs Celtics',
      pickTeam: 'Over 224.5',
      pickType: 'over/under',
      odds: '-108',
      analysis: 'Both teams rank in the top 10 for pace this season. Their last 3 meetings have gone over by an average of 12 points.',
      result: 'pending',
      requiredTier: 'pro',
      oneTimePurchasePrice: 299,
      gameDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      isVisible: true,
    },
    {
      id: 'pick3',
      sport: 'NFL',
      league: 'Regular Season',
      game: 'Bills vs Dolphins',
      pickTeam: 'Bills -7',
      pickType: 'spread',
      odds: '-105',
      analysis: 'Premium pick with detailed analysis. The Bills defense has been shutting down opponents and Josh Allen is in top form.',
      result: 'won',
      requiredTier: 'premium',
      oneTimePurchasePrice: 499,
      gameDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      isVisible: true,
    },
    {
      id: 'pick4',
      sport: 'NHL',
      league: 'Regular Season',
      game: 'Bruins vs Rangers',
      pickTeam: 'Bruins ML',
      pickType: 'moneyline',
      odds: '+125',
      analysis: 'Great value on the Bruins as underdogs. They are 8-2 in their last 10 road games.',
      result: 'pending',
      requiredTier: 'pro',
      oneTimePurchasePrice: 349,
      gameDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      isVisible: true,
    },
  ];

  memoryPurchases = [];
  initialized = true;
}

// File system storage for local development
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    return true;
  } catch {
    return false;
  }
}

function readJson<T>(filename: string, defaultValue: T): T {
  if (isServerless) {
    return defaultValue;
  }
  try {
    if (!ensureDataDir()) return defaultValue;
    const filePath = path.join(DATA_DIR, filename);
    if (!fs.existsSync(filePath)) {
      return defaultValue;
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return defaultValue;
  }
}

function writeJson<T>(filename: string, data: T): void {
  if (isServerless) return;
  try {
    if (!ensureDataDir()) return;
    const filePath = path.join(DATA_DIR, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch {
    // Silently fail in read-only environments
  }
}

// Users
export function getUsers(): User[] {
  if (isServerless) {
    if (!initialized) {
      // Return empty initially, will be populated on first auth attempt
      return memoryUsers;
    }
    return memoryUsers;
  }
  return readJson<User[]>('users.json', []);
}

export async function getUsersAsync(): Promise<User[]> {
  if (isServerless) {
    await initDemoData();
    return memoryUsers;
  }
  return readJson<User[]>('users.json', []);
}

export function getUserById(id: string): User | undefined {
  return getUsers().find(u => u.id === id);
}

export async function getUserByIdAsync(id: string): Promise<User | undefined> {
  const users = await getUsersAsync();
  return users.find(u => u.id === id);
}

export function getUserByEmail(email: string): User | undefined {
  return getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
}

export async function getUserByEmailAsync(email: string): Promise<User | undefined> {
  const users = await getUsersAsync();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

export function createUser(user: User): User {
  if (isServerless) {
    memoryUsers.push(user);
    return user;
  }
  const users = getUsers();
  users.push(user);
  writeJson('users.json', users);
  return user;
}

export function updateUser(id: string, updates: Partial<User>): User | null {
  if (isServerless) {
    const index = memoryUsers.findIndex(u => u.id === id);
    if (index === -1) return null;
    memoryUsers[index] = { ...memoryUsers[index], ...updates };
    return memoryUsers[index];
  }
  const users = getUsers();
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return null;
  users[index] = { ...users[index], ...updates };
  writeJson('users.json', users);
  return users[index];
}

// Picks
export function getPicks(): Pick[] {
  if (isServerless) {
    if (!initialized) {
      initDemoData();
    }
    return memoryPicks;
  }
  return readJson<Pick[]>('picks.json', []);
}

export async function getPicksAsync(): Promise<Pick[]> {
  if (isServerless) {
    await initDemoData();
    return memoryPicks;
  }
  return readJson<Pick[]>('picks.json', []);
}

export function getPickById(id: string): Pick | undefined {
  return getPicks().find(p => p.id === id);
}

export function getVisiblePicks(): Pick[] {
  return getPicks().filter(p => p.isVisible);
}

export function createPick(pick: Pick): Pick {
  if (isServerless) {
    memoryPicks.push(pick);
    return pick;
  }
  const picks = getPicks();
  picks.push(pick);
  writeJson('picks.json', picks);
  return pick;
}

export function updatePick(id: string, updates: Partial<Pick>): Pick | null {
  if (isServerless) {
    const index = memoryPicks.findIndex(p => p.id === id);
    if (index === -1) return null;
    memoryPicks[index] = { ...memoryPicks[index], ...updates };
    return memoryPicks[index];
  }
  const picks = getPicks();
  const index = picks.findIndex(p => p.id === id);
  if (index === -1) return null;
  picks[index] = { ...picks[index], ...updates };
  writeJson('picks.json', picks);
  return picks[index];
}

export function deletePick(id: string): boolean {
  if (isServerless) {
    const index = memoryPicks.findIndex(p => p.id === id);
    if (index === -1) return false;
    memoryPicks.splice(index, 1);
    return true;
  }
  const picks = getPicks();
  const index = picks.findIndex(p => p.id === id);
  if (index === -1) return false;
  picks.splice(index, 1);
  writeJson('picks.json', picks);
  return true;
}

// Purchases
export function getPurchases(): Purchase[] {
  if (isServerless) {
    return memoryPurchases;
  }
  return readJson<Purchase[]>('purchases.json', []);
}

export function getUserPurchases(userId: string): Purchase[] {
  return getPurchases().filter(p => p.userId === userId);
}

export function hasPurchasedPick(userId: string, pickId: string): boolean {
  return getPurchases().some(p => p.userId === userId && p.pickId === pickId);
}

export function createPurchase(purchase: Purchase): Purchase {
  if (isServerless) {
    memoryPurchases.push(purchase);
    return purchase;
  }
  const purchases = getPurchases();
  purchases.push(purchase);
  writeJson('purchases.json', purchases);
  return purchase;
}

// Utility to generate IDs
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
