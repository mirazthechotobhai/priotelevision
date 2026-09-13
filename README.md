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

## Firebase Functions TMDB gateway

The optional Firebase Functions gateway keeps `TMDB_API_KEY` in Google Secret Manager. It is an unauthenticated, CORS-restricted HTTP endpoint for discover pagination; authentication can be added later with Firebase Auth or another token at the function boundary. Configure the exact browser origins that may call it (for example, your Vercel URL and local URL):

```sh
firebase login
firebase use <firebase-project-id>
firebase functions:secrets:set TMDB_API_KEY
firebase functions:params:set FRONTEND_ORIGINS="https://your-app.example, http://localhost:3000"
firebase deploy --only functions
```

Set `NEXT_PUBLIC_TMDB_FUNCTION_URL` to the deployed `tmdbDiscover` URL when the browser should call Firebase directly. Alternatively, set server-only `TMDB_FUNCTION_URL` so the browser continues calling `/api/tmdb` and the Next route forwards catalog requests. Do not set either variable to a URL containing an API key, and do not add Firebase frontend configuration.

To rotate a compromised or expired key, run `firebase functions:secrets:set TMDB_API_KEY` again with the replacement value, then deploy:

```sh
firebase functions:secrets:set TMDB_API_KEY
firebase deploy --only functions
```

The Firebase function validates `type` (`movie`, `tv`, or `anime`) and `page` (1–500), and only proxies the corresponding TMDB discover endpoint. No client bundle receives the secret.

## Checks

`npm run lint`, `npm run typecheck`, and `npm run build`. `TMDB_API_KEY` is optional during build; it is read only when the runtime API route handles a request. If Vercel still reports `npm run build` exit 1, copy the complete build log (including the first TypeScript/Next error) because the exit code alone does not identify the failing module.
