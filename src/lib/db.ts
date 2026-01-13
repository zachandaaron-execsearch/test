import fs from 'fs';
import path from 'path';
import { User, Pick, Purchase } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJson<T>(filename: string, defaultValue: T): T {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    return defaultValue;
  }
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

function writeJson<T>(filename: string, data: T): void {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Users
export function getUsers(): User[] {
  return readJson<User[]>('users.json', []);
}

export function getUserById(id: string): User | undefined {
  return getUsers().find(u => u.id === id);
}

export function getUserByEmail(email: string): User | undefined {
  return getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
}

export function createUser(user: User): User {
  const users = getUsers();
  users.push(user);
  writeJson('users.json', users);
  return user;
}

export function updateUser(id: string, updates: Partial<User>): User | null {
  const users = getUsers();
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return null;
  users[index] = { ...users[index], ...updates };
  writeJson('users.json', users);
  return users[index];
}

// Picks
export function getPicks(): Pick[] {
  return readJson<Pick[]>('picks.json', []);
}

export function getPickById(id: string): Pick | undefined {
  return getPicks().find(p => p.id === id);
}

export function getVisiblePicks(): Pick[] {
  return getPicks().filter(p => p.isVisible);
}

export function createPick(pick: Pick): Pick {
  const picks = getPicks();
  picks.push(pick);
  writeJson('picks.json', picks);
  return pick;
}

export function updatePick(id: string, updates: Partial<Pick>): Pick | null {
  const picks = getPicks();
  const index = picks.findIndex(p => p.id === id);
  if (index === -1) return null;
  picks[index] = { ...picks[index], ...updates };
  writeJson('picks.json', picks);
  return picks[index];
}

export function deletePick(id: string): boolean {
  const picks = getPicks();
  const index = picks.findIndex(p => p.id === id);
  if (index === -1) return false;
  picks.splice(index, 1);
  writeJson('picks.json', picks);
  return true;
}

// Purchases
export function getPurchases(): Purchase[] {
  return readJson<Purchase[]>('purchases.json', []);
}

export function getUserPurchases(userId: string): Purchase[] {
  return getPurchases().filter(p => p.userId === userId);
}

export function hasPurchasedPick(userId: string, pickId: string): boolean {
  return getPurchases().some(p => p.userId === userId && p.pickId === pickId);
}

export function createPurchase(purchase: Purchase): Purchase {
  const purchases = getPurchases();
  purchases.push(purchase);
  writeJson('purchases.json', purchases);
  return purchase;
}

// Utility to generate IDs
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
