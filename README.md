# Redline

Redline is a Vercel-ready Next.js App Router streaming discovery UI for movies, TV and anime.

## Run locally

1. Install Node.js 18.17+.
2. `npm install`
3. Copy `.env.example` to `.env.local` and set `TMDB_API_KEY`.
4. `npm run dev`, then open `http://localhost:3000`.

Without a key the app uses curated fallback content, so the UI remains previewable. The TMDB key is read only on the server and is never exposed to the browser. **Rotate your key immediately if it is ever committed, logged, pasted in a ticket, or otherwise exposed**; do not put real secrets in `.env.example`.

Firebase is intentionally optional. When it is not configured, “My list” uses browser localStorage. Add Firebase auth and persistence behind the same client boundary when cross-device accounts are needed.

## Checks

`npm run lint`, `npm run typecheck`, and `npm run build`
