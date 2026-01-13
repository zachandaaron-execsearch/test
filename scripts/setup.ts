import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function writeJson(filename: string, data: unknown) {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

async function setup() {
  console.log('Setting up SportsPicksPro...\n');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const adminUser = {
    id: 'admin-001',
    email: 'admin@sportspickspro.com',
    password: adminPassword,
    name: 'Admin',
    isAdmin: true,
    subscriptionTier: 'premium',
    subscriptionExpiry: null,
    createdAt: new Date().toISOString(),
  };

  // Create sample user
  const userPassword = await bcrypt.hash('user123', 10);
  const sampleUser = {
    id: 'user-001',
    email: 'user@example.com',
    password: userPassword,
    name: 'Test User',
    isAdmin: false,
    subscriptionTier: 'free',
    subscriptionExpiry: null,
    createdAt: new Date().toISOString(),
  };

  writeJson('users.json', [adminUser, sampleUser]);
  console.log('Created users:');
  console.log('  Admin: admin@sportspickspro.com / admin123');
  console.log('  User:  user@example.com / user123\n');

  // Create sample picks
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const samplePicks = [
    {
      id: 'pick-001',
      sport: 'NFL',
      league: 'Regular Season',
      game: 'Kansas City Chiefs vs Baltimore Ravens',
      pickTeam: 'Chiefs -3.5',
      pickType: 'spread',
      odds: '-110',
      analysis: 'The Chiefs have been dominant at home this season with Mahomes playing at an MVP level. Baltimore\'s secondary has struggled against elite quarterbacks, and I expect Mahomes to exploit those weaknesses. The Chiefs defense has also improved significantly, making this spread very achievable.',
      result: 'pending',
      requiredTier: 'free',
      oneTimePurchasePrice: 199,
      gameDate: tomorrow.toISOString(),
      createdAt: now.toISOString(),
      isVisible: true,
    },
    {
      id: 'pick-002',
      sport: 'NBA',
      league: 'Regular Season',
      game: 'Boston Celtics vs Milwaukee Bucks',
      pickTeam: 'Over 228.5',
      pickType: 'over/under',
      odds: '-105',
      analysis: 'Both teams are averaging over 115 points per game in their last 5 matchups. Giannis and Tatum will be aggressive, and neither defense has been particularly strong lately. I see a high-scoring affair here with both teams pushing the pace.',
      result: 'won',
      requiredTier: 'pro',
      oneTimePurchasePrice: 299,
      gameDate: yesterday.toISOString(),
      createdAt: yesterday.toISOString(),
      isVisible: true,
    },
    {
      id: 'pick-003',
      sport: 'NFL',
      league: 'Regular Season',
      game: 'San Francisco 49ers vs Dallas Cowboys',
      pickTeam: '49ers ML',
      pickType: 'moneyline',
      odds: '-145',
      analysis: 'San Francisco\'s defense is playing at an elite level, and their running game with CMC has been unstoppable. Dallas has struggled on the road this season and their offensive line injuries are a major concern. Taking the 49ers straight up here.',
      result: 'pending',
      requiredTier: 'pro',
      oneTimePurchasePrice: 349,
      gameDate: tomorrow.toISOString(),
      createdAt: now.toISOString(),
      isVisible: true,
    },
    {
      id: 'pick-004',
      sport: 'NHL',
      league: 'Regular Season',
      game: 'Edmonton Oilers vs Toronto Maple Leafs',
      pickTeam: 'McDavid Over 1.5 Points',
      pickType: 'prop',
      odds: '+120',
      analysis: 'McDavid always shows up against Toronto. In his last 5 games against the Leafs, he\'s averaged 2.4 points per game. The Leafs\' defense has been leaky recently, and this is a prime spot for McDavid to put on a show. Great value at plus money.',
      result: 'lost',
      requiredTier: 'premium',
      oneTimePurchasePrice: 499,
      gameDate: yesterday.toISOString(),
      createdAt: yesterday.toISOString(),
      isVisible: true,
    },
    {
      id: 'pick-005',
      sport: 'NBA',
      league: 'Regular Season',
      game: 'Los Angeles Lakers vs Golden State Warriors',
      pickTeam: 'Warriors +4.5',
      pickType: 'spread',
      odds: '-110',
      analysis: 'Home court advantage plus Curry playing in a revenge game after last week\'s loss. The Warriors have covered this spread in 4 of their last 5 home games against the Lakers. Expecting a close game that comes down to the wire.',
      result: 'pending',
      requiredTier: 'premium',
      oneTimePurchasePrice: 399,
      gameDate: tomorrow.toISOString(),
      createdAt: now.toISOString(),
      isVisible: true,
    },
  ];

  writeJson('picks.json', samplePicks);
  console.log('Created', samplePicks.length, 'sample picks\n');

  // Initialize empty purchases
  writeJson('purchases.json', []);
  console.log('Initialized purchases database\n');

  console.log('Setup complete!');
  console.log('\nRun `npm run dev` to start the development server');
  console.log('Then visit http://localhost:3000');
}

setup().catch(console.error);
