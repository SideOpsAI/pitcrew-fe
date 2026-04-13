# Pit Crew FE

Frontend for Pit Crew Mobile Auto Detailing built with Next.js, React, Tailwind CSS and TypeScript.

## Development

Stable dev mode (recommended on Windows):

```bash
npm run dev
```

This uses `next dev --webpack` for better stability.

Optional Turbopack mode:

```bash
npm run dev:turbo
```

Open [http://localhost:3000/en](http://localhost:3000/en).

## Build

```bash
npm run lint
npm run build
```

## Smoke test (testable quick check)

1. Start the app in one terminal:

```bash
npm run dev
```

2. In another terminal run:

```bash
npm run test:smoke
```

This validates key routes:
- `/en`
- `/en/services`
- `/en/contact`
- `/robots.txt`
- `/sitemap.xml`

## Stability note

If local dev feels slow/hangs on Windows, avoid OneDrive-synced folders for active development when possible.
