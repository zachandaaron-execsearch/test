# SportsPicksPro

A sports picks subscription website built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- **User Authentication**: Register, login, and manage user accounts
- **Subscription Tiers**: Free, Pro, and Premium tiers with different access levels
- **Admin Panel**: Create, edit, and manage sports picks with detailed analysis
- **Pick Management**: Per-game selections with pick type, odds, and analysis
- **One-time Purchases**: Users can unlock individual picks without a subscription
- **User Dashboard**: View accessible picks, stats, and account info

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment

Create a `.env.local` file (or the setup script will use defaults):

```env
NEXTAUTH_SECRET=your-secret-key-change-in-production
NEXTAUTH_URL=http://localhost:3000
```

### 3. Initialize Sample Data

Run the setup script to create sample users and picks:

```bash
npm run setup
```

This creates:
- **Admin account**: `admin@sportspickspro.com` / `admin123`
- **Test user**: `user@example.com` / `user123`
- 5 sample picks across different sports

### 4. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── api/              # API routes
│   │   ├── admin/picks/  # Admin pick management
│   │   ├── auth/         # NextAuth endpoints
│   │   ├── picks/        # Public picks endpoint
│   │   ├── purchase/     # One-time purchase
│   │   ├── register/     # User registration
│   │   └── subscription/ # Subscription management
│   ├── admin/            # Admin panel page
│   ├── dashboard/        # User dashboard
│   ├── login/            # Login page
│   ├── picks/            # Picks listing
│   ├── pricing/          # Pricing page
│   └── register/         # Registration page
├── components/           # React components
├── lib/                  # Utilities
│   ├── auth.ts           # NextAuth configuration
│   ├── db.ts             # JSON database layer
│   └── types.ts          # TypeScript types
└── types/                # Type declarations
```

## Subscription Tiers

| Feature | Free | Pro ($19.99/mo) | Premium ($49.99/mo) |
|---------|------|-----------------|---------------------|
| Free picks | Yes | Yes | Yes |
| Pro picks | No | Yes | Yes |
| Premium picks | No | No | Yes |
| One-time purchases | Yes | Yes | N/A |

## Admin Features

- Create new picks with sport, league, game, pick details, and analysis
- Set required tier (Free/Pro/Premium) for each pick
- Set one-time purchase price for individual unlock
- Update pick results (Pending/Won/Lost/Push)
- Show/hide picks from users
- Edit and delete picks

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **Database**: JSON file storage (easily upgradeable to PostgreSQL/SQLite/etc.)

## Production Notes

For production deployment:

1. Change `NEXTAUTH_SECRET` to a secure random string
2. Consider migrating from JSON storage to a proper database (PostgreSQL, MySQL, etc.)
3. Integrate Stripe for real payment processing
4. Set up proper HTTPS and security headers
