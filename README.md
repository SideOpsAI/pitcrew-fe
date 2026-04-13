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

## Email delivery (Netlify Forms)

Booking/contact submissions are handled by `src/app/api/contact/route.ts`.

1. Create `.env.local` from `.env.example`.
2. Set in `.env.local`:
   - `NETLIFY_FORMS_URL=https://your-site-name.netlify.app`
3. Restart `npm run dev`.

If `NETLIFY_FORMS_URL` is missing, `/api/contact` returns `email_not_configured`.

## Netlify setup

1. Deploy the project to Netlify.
2. Keep `public/__forms.html` in the repo. Netlify Runtime v5 scans this static file to detect form names/fields.
3. Submit one form from production (`/en/contact` or booking modal) to register fields.
4. Go to Netlify Dashboard -> Site -> Forms -> `pitcrew-contact`.
5. Add Email Notifications and set your recipient email.

## Cloudflare note

Netlify Forms only sends notifications for forms processed by Netlify.

If you deploy only on Cloudflare Pages, Netlify Forms notifications will not run unless you still post to a Netlify-hosted site via `NETLIFY_FORMS_URL`.

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
