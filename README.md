# Redline

Redline is a Vercel-ready Next.js App Router streaming discovery UI for movies, TV and anime.

## Run locally

1. Install Node.js 18.17+.
2. `npm install`
3. Copy `.env.example` to `.env.local` and set `TMDB_API_KEY`.
4. `npm run dev`, then open `http://localhost:3000`.

Without a key the app uses curated fallback content, so the UI remains previewable. The TMDB key is read only on the server and is never exposed to the browser. **Rotate your key immediately if it is ever committed, logged, pasted in a ticket, or otherwise exposed**; do not put real secrets in `.env.example`.

For Vercel, open **Project → Settings → Environment Variables**, add the exact name `TMDB_API_KEY` (without `NEXT_PUBLIC_`) and the TMDB v3 API key as its value, select the environments to deploy, save, and redeploy. Never use a `NEXT_PUBLIC_` name for this secret. The home page renders the static fallback first, then requests paginated TMDB pages through the server-only `/api/tmdb` gateway. Missing keys and API/rate-limit failures are shown with a retry action instead of being hidden behind static data. TMDB pagination is finite (up to page 500, with rate limits applying), so infinite loading ends when TMDB reports no more pages.

Firebase is intentionally optional. When it is not configured, “My list” uses browser localStorage. Add Firebase auth and persistence behind the same client boundary when cross-device accounts are needed.

## Checks

`npm run lint`, `npm run typecheck`, and `npm run build`. `TMDB_API_KEY` is optional during build; it is read only when the runtime API route handles a request. If Vercel still reports `npm run build` exit 1, copy the complete build log (including the first TypeScript/Next error) because the exit code alone does not identify the failing module.
