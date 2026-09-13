import { NextRequest, NextResponse } from 'next/server';

/** A deliberately server-only TMDB gateway. The API key never crosses this boundary. */
export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get('path');
  const key = process.env.TMDB_API_KEY;
  if (!path || !/^\/(trending|discover|search|movie|tv)(\/|$)/.test(path)) {
    return NextResponse.json({ error: 'Unsupported TMDB path.' }, { status: 400 });
  }
  if (!key) return NextResponse.json({ results: [] });
  const url = new URL(`https://api.themoviedb.org/3${path}`);
  url.searchParams.set('api_key', key);
  const response = await fetch(url, { next: { revalidate: 300 } });
  if (!response.ok) return NextResponse.json({ error: 'TMDB request failed.' }, { status: response.status });
  return NextResponse.json(await response.json());
}
