# OpenLog

OpenLog is a learn-in-public streak tracker. Create a public learning log, add one note per day, and share the proof.

## Development

- pnpm dev starts the Vite frontend and Express server.
- pnpm build creates production builds.
- pnpm typecheck checks all TypeScript packages.
- pnpm lint checks the workspace.
- pnpm db:generate creates a Drizzle migration.
- pnpm db:migrate applies migrations to the configured PostgreSQL database.
- pnpm db:studio opens Drizzle Studio.

## Accounts, history, and public links

Creating a public log does not require account credentials in the landing form. After creation, sign in or create an account to edit the log and keep it in your history. The original owner-only browser cookie lets the creator attach that new log to the account once.

Passwords are stored only as Argon2id hashes. OpenLog uses a hashed-token, HTTP-only session cookie for dashboard and history access.

- /login is the separate sign-in and account-creation page.
- /history shows the authenticated user's trackers and their latest derived statistics.
- /dashboard/:slug requires an authenticated account that owns the tracker.
- /learn/:slug is public and does not require login or cookies.
- Existing trackers created before account ownership can be attached once from the original owner-cookie browser.

Public links are intentionally shareable. They expose only the learning goal, public entries, derived streak statistics, and activity heatmap. They never expose passwords, session tokens, owner-token hashes, or authorization records.

## Public page rendering limitation

The /learn/:slug page updates its browser title and meta description after the tracker loads. This is client-rendered; crawlers or link previews that do not execute JavaScript may see the default index.html metadata. OpenLog does not add SSR solely for social metadata.
