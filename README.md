# OpenLog

OpenLog is a learn-in-public streak tracker. Create a public learning log, add one note per day, and share the proof.

## Development

- `pnpm dev` starts the Vite frontend and Express server.
- `pnpm build` creates production builds.
- `pnpm typecheck` checks all TypeScript packages.
- `pnpm lint` checks the workspace.

## Public page rendering limitation

The `/learn/:slug` page updates its browser title and meta description after the tracker loads. This is client-rendered; crawlers or link previews that do not execute JavaScript may see the default `index.html` metadata. OpenLog does not add SSR solely for social metadata.
