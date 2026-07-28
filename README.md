# OpenLog

OpenLog is a small learn-in-public tracker. You pick something you want to learn, write one update a day, and share the progress through a public link.

**Live:** [openlog-production.up.railway.app](https://openlog-production.up.railway.app/)

## The idea

I wanted starting a log to feel lightweight, so creating one does not require an account. The app gives the creator a private browser key and immediately creates a public page such as `/learn/system-design-a1b2`.

An account is only needed for returning to logs and editing them from another browser. When the creator signs in, OpenLog uses that private browser key to attach any unclaimed logs to the account. Visitors opening the public link never need to sign in.

Each tracker has its own timezone. Entries are limited to one per calendar day, and the streak and heatmap are calculated from those entries rather than stored as counters.

## Project structure

This is a pnpm monorepo:

- `apps/web` contains the React and Vite frontend.
- `apps/server` contains the Express API and production web server.
- `packages/shared` contains validation schemas, API types, and streak calculations used by both sides.

The API uses PostgreSQL through Drizzle. The database enforces the rules that should not depend on UI code: unique usernames and slugs, unique session tokens, and one entry per tracker per day.

In production, Express serves the API and the built frontend from the same Railway service. Keeping them on one origin also keeps the session-cookie setup straightforward.

## Public links and private editing

These pages are intentionally public:

- `/`
- `/learn/:slug`
- the public tracker API used by the shared page

These areas require a signed-in owner:

- `/history`
- `/dashboard/:slug`
- creating, updating, or deleting entries

The frontend route guards are there for navigation, but the API performs the real authentication and ownership checks.

Passwords are hashed with Argon2id. Session and anonymous-owner tokens are random values stored only in HTTP-only cookies; the database stores hashes of those tokens. Production cookies are secure, use `SameSite=Lax`, and sessions expire after 30 days.

## Running locally

You need Node.js, pnpm, and a PostgreSQL database.

Copy `.env.example` to `.env`:

```env
PORT=3000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

Install dependencies, apply the migrations, and start both apps:

```bash
pnpm install
pnpm db:migrate
pnpm dev
```

The frontend runs at `http://localhost:5173`; Vite proxies `/api` requests to the server on port `3000`.

## Useful commands

```bash
pnpm test          # authentication, ownership, and redirect regression tests
pnpm typecheck     # TypeScript checks for every workspace
pnpm lint          # ESLint
pnpm build         # production server and frontend builds
pnpm db:generate   # generate a Drizzle migration
pnpm db:migrate    # apply pending migrations
```

## Deployment

The app is deployed on Railway at [openlog-production.up.railway.app](https://openlog-production.up.railway.app/). Railway builds with `pnpm build` and starts the production server with `pnpm start`.

The health endpoint also checks the database connection: [openlog-production.up.railway.app/api/health](https://openlog-production.up.railway.app/api/health).

## Things I intentionally left out

- Accounts use usernames instead of email, so there is no email provider or password-reset flow.
- Public pages are client-rendered. The title and description update in the browser, but link-preview crawlers that do not run JavaScript may see the default metadata.
- Sessions have a fixed 30-day lifetime instead of renewing forever on activity.
