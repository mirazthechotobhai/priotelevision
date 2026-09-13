import { NextRequest, NextResponse } from 'next/server';
import { getCatalogPage, type CatalogKind } from '@/lib/tmdb';

/** A deliberately server-only TMDB gateway. The API key never crosses this boundary. */
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const kind = request.nextUrl.searchParams.get('type');
  const pageValue = request.nextUrl.searchParams.get('page') || '1';
  if (kind) {
    const page = Number(pageValue);
    if (!['movie', 'tv', 'anime'].includes(kind) || !/^\d+$/.test(pageValue) || page < 1 || page > 500) {
      return NextResponse.json({ error: 'Invalid catalog query.' }, { status: 400 });
    }
    try {
      const functionUrl = process.env.TMDB_FUNCTION_URL;
      if (functionUrl) {
        const url = new URL(functionUrl);
        url.searchParams.set('type', kind);
        url.searchParams.set('page', pageValue);
        const functionResponse = await fetch(url, { cache: 'no-store' });
        const data = await functionResponse.json();
        return NextResponse.json(data, { status: functionResponse.status });
      }
      const catalog = await getCatalogPage(kind as CatalogKind, page);
      if (catalog.error) {
        return NextResponse.json(catalog, { status: catalog.error.includes('not configured') ? 503 : 502 });
      }
      return NextResponse.json(catalog);
    } catch {
      return NextResponse.json({ results: [], page, total_pages: page, has_more: false, source: 'fallback', error: 'TMDB is temporarily unavailable. Try again.' }, { status: 502 });
    }
  }
  const path = request.nextUrl.searchParams.get('path');
  const key = process.env.TMDB_API_KEY;
  if (!path || !/^\/(trending|discover|search|movie|tv)(\/|$)/.test(path)) {
    return NextResponse.json({ error: 'Unsupported TMDB path.' }, { status: 400 });
  }
  if (!key) return NextResponse.json({ results: [], error: 'TMDB is unavailable because TMDB_API_KEY is not configured.' }, { status: 503 });
  const url = new URL(`https://api.themoviedb.org/3${path}`);
  url.searchParams.set('api_key', key);
  let response: Response;
  try {
    response = await fetch(url, { next: { revalidate: 300 } });
  } catch {
    return NextResponse.json({ results: [], error: 'TMDB is temporarily unavailable. Try again.' }, { status: 502 });
  }
  if (!response.ok) return NextResponse.json({ error: 'TMDB request failed.' }, { status: response.status });
  try {
    return NextResponse.json(await response.json());
  } catch {
    return NextResponse.json({ error: 'TMDB returned an invalid response.' }, { status: 502 });
  }
}
