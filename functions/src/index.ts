import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret, defineString } from 'firebase-functions/params';

const tmdbApiKey = defineSecret('TMDB_API_KEY');
const frontendOrigins = defineString('FRONTEND_ORIGINS', {
  default: 'http://localhost:3000',
  description: 'Comma-separated browser origins allowed to call the TMDB function',
});

type CatalogKind = 'movie' | 'tv' | 'anime';

const imageUrl = (path: unknown) => typeof path === 'string' && path
  ? `https://image.tmdb.org/t/p/w500${path}`
  : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop';

function allowedOrigins() {
  return new Set(frontendOrigins.value().split(',').map(origin => origin.trim()).filter(Boolean));
}

function discoverPath(kind: CatalogKind, page: number) {
  const path = kind === 'anime' ? 'tv' : kind;
  const params = new URLSearchParams({
    language: 'en-US',
    sort_by: 'popularity.desc',
    page: String(page),
  });
  if (kind === 'anime') {
    params.set('with_genres', '16');
    params.set('with_original_language', 'ja');
  }
  return `https://api.themoviedb.org/3/discover/${path}?${params}`;
}

function normalize(item: Record<string, unknown>, kind: 'movie' | 'tv') {
  const title = item.title || item.name;
  const date = item.release_date || item.first_air_date;
  return {
    id: String(item.id),
    title: typeof title === 'string' ? title : 'Untitled',
    poster: imageUrl(item.poster_path),
    overview: typeof item.overview === 'string' && item.overview ? item.overview : 'No overview available.',
    year: typeof date === 'string' && date ? date.slice(0, 4) : '—',
    rating: typeof item.vote_average === 'number' ? item.vote_average : 0,
    genre: 'Featured',
    type: kind,
  };
}

export const tmdbDiscover = onRequest(
  { secrets: [tmdbApiKey], region: 'us-central1' },
  async (request, response) => {
    const origin = request.get('origin');
    const origins = allowedOrigins();
    if (origin && origins.has(origin)) {
      response.set('Access-Control-Allow-Origin', origin);
      response.set('Vary', 'Origin');
    }
    response.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.set('Access-Control-Allow-Headers', 'Content-Type');

    if (request.method === 'OPTIONS') {
      response.status(204).send('');
      return;
    }
    if (origin && !origins.has(origin)) {
      response.status(403).json({ error: 'Origin is not allowed.' });
      return;
    }

    const kind = request.query.type;
    const pageValue = request.query.page || '1';
    if (typeof kind !== 'string' || !['movie', 'tv', 'anime'].includes(kind) ||
        typeof pageValue !== 'string' || !/^[1-9]\d*$/.test(pageValue)) {
      response.status(400).json({ error: 'Invalid catalog query.' });
      return;
    }
    const page = Number(pageValue);
    if (page > 500) {
      response.status(400).json({ error: 'Invalid catalog query.' });
      return;
    }

    try {
      const url = `${discoverPath(kind as CatalogKind, page)}&api_key=${encodeURIComponent(tmdbApiKey.value())}`;
      const tmdbResponse = await fetch(url);
      if (!tmdbResponse.ok) {
        response.status(tmdbResponse.status).json({ error: 'TMDB request failed.' });
        return;
      }
      const data = await tmdbResponse.json() as { results?: Record<string, unknown>[]; page?: number; total_pages?: number };
      const currentPage = Number(data.page) || page;
      const totalPages = Math.min(Number(data.total_pages) || currentPage, 500);
      const mediaType = kind === 'movie' ? 'movie' : 'tv';
      response.json({
        results: Array.isArray(data.results) ? data.results.map(item => normalize(item, mediaType)) : [],
        page: currentPage,
        total_pages: totalPages,
        has_more: currentPage < totalPages,
        source: 'tmdb',
      });
    } catch {
      response.status(502).json({ error: 'TMDB is temporarily unavailable. Try again.' });
    }
  },
);
