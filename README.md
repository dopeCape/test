# Learning Feed

A scrollable, reel-style feed for your own notes and reminders — built to
replace the Instagram/TikTok scroll with something productive. Single-user,
password-gated, Next.js 14.

## What's in it

- **Feed** — full-screen vertical snap-scroll. One card at a time. Mixes your
  notes with curated tech content via a weighted shuffle, so high-priority
  reminders resurface more often.
- **Notes** — CRUD for notes with categories (`remind-me`, `tech`, `ai`,
  `papers`, `code`, `idea`) and per-note weight.
- **Curated sources** — pluggable external feeds, cached on disk:
  - **arXiv** — recent CS papers (AI, ML, PL, SE, distributed systems, DB)
  - **GitHub Trending** — repos gaining the most stars this week
  - **npm** — active, high-quality JS/TS packages
  - **Hacker News** — front-page tech stories
- **Settings** — toggle note categories, toggle each source, tune the
  note/curated balance, refresh sources on demand, log out.
- **Auth** — single password gate. No usernames. HMAC-signed cookie session.

## Setup

```bash
npm install

# 1. Hash your password
node -e "console.log(require('crypto').createHash('sha256').update('YOUR_PASSWORD').digest('hex'))"

# 2. Generate a session secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 3. Create .env.local with both values
cp .env.example .env.local
# edit .env.local

# 4. (optional) seed with sample notes
npm run seed

# 5. Run
npm run dev
```

Visit http://localhost:3000 — you'll be redirected to `/login`.

## Storage

Notes and settings live in `./data/*.json` (gitignored). For deployment on a
read-only filesystem (e.g. Vercel), swap `src/lib/db.ts` for a persistent store
(Turso, Neon, Upstash, etc.). On a VPS/Fly.io/Railway with a writable volume
the JSON files work as-is.

## Stack

- Next.js 14 App Router, TypeScript
- Tailwind CSS
- CSS scroll-snap (no framer-motion dependency)
- Node `crypto` + Web Crypto for password hashing and HMAC session cookie —
  zero auth dependencies
