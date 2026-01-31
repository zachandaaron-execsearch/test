# Power Newsletter Workflow

A guided web app for creating clinical operations newsletters with integrated AI chat.

## Overview

This app provides a complete newsletter creation workflow with built-in AI assistance:

1. **Discovery Chat** - Develop your topic angle with the Discovery Agent
2. **Brief Review** - Review and edit the generated narrative brief
3. **Creation Chat** - Write your newsletter draft with the Newsletter Agent
4. **Final Review** - Complete quality checklist before publishing

## Features

- In-app AI chat (no need to leave the interface)
- Step-by-step guided workflow
- Progress auto-saves to browser localStorage
- Pre-publish quality checklist (8 items)
- Quick action buttons for common tasks
- Mobile-responsive design

## Getting Started

### 1. Clone and Install

```bash
git clone <repo-url>
cd power-newsletter-workflow
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file:

```bash
ANTHROPIC_API_KEY=your-api-key-here
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment on Vercel

### 1. Push to GitHub

### 2. Import to Vercel
- Go to [vercel.com/new](https://vercel.com/new)
- Import your repository
- Add environment variable: `ANTHROPIC_API_KEY`
- Deploy

## Workflow Steps

### Step 1: Start
Select your source material type:
- Podcast Transcript
- Internal Data/Analytics
- Customer Insights
- Brainstorm/Concept
- Industry News

### Step 2: Discovery Chat
Chat with the Discovery Agent to:
- Explore your topic angle
- Identify key themes
- Generate a narrative brief

### Step 3: Brief Review
- Review the auto-generated brief
- Edit as needed
- Pass to Creation step

### Step 4: Creation Chat
Chat with the Newsletter Agent to:
- Generate the newsletter draft
- Request revisions
- Refine the content

### Step 5: Final Review
- Review the final draft
- Complete the 8-item quality checklist
- Copy to clipboard for publishing

## Pre-Publish Checklist

- All clinical claims fact-checked
- No absolutist language (never, always, revolutionary)
- Scientific language used (showed vs proved)
- Under 800 words
- Limitations acknowledged
- Related past newsletters linked
- Strong opening hook
- Would a clinical ops director forward this?

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Anthropic Claude API

## Environment Variables

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key |

## Future Enhancements

- Google Docs export integration
- Team collaboration features
- Newsletter archive/history
