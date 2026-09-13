import { fallbackMedia } from '@/lib/fallback';

export type Media={id:string;title:string;poster:string;overview:string;year:string;rating:number;genre:string;type:'movie'|'tv'};
export type CatalogKind = 'movie' | 'tv' | 'anime';
const img=(path:string)=>path?`https://image.tmdb.org/t/p/w500${path}`:'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop';
async function tmdb(path:string):Promise<any>{
  const key = process.env.TMDB_API_KEY;
  if (!key) return null;
  try {
    const url = new URL(`https://api.themoviedb.org/3${path}`);
    url.searchParams.set('api_key', key);
    const r = await fetch(url, { next: { revalidate: 300 } });
    if (!r.ok) return null;
    const data = await r.json();
    return data && typeof data === 'object' ? data : null;
  } catch {
    return null;
  }
}
function normalize(x:any,type:'movie'|'tv'):Media{return{id:String(x.id),title:x.title||x.name,poster:img(x.poster_path),overview:x.overview||'No overview available.',year:(x.release_date||x.first_air_date||'').slice(0,4)||'—',rating:x.vote_average||0,genre:'Featured',type}}
const results = (data:any): any[] => Array.isArray(data?.results) ? data.results : [];
const fallbackFor = (kind: CatalogKind) => kind === 'movie'
  ? fallbackMedia.filter(x => ['872585', '667538', '693134'].includes(x.id))
  : kind === 'tv' ? fallbackMedia.filter(x => ['1399', '94605'].includes(x.id)) : fallbackMedia.filter(x => x.id === '37854' || x.id === '94605');

export async function getCatalogPage(kind: CatalogKind, page: number) {
  const path = kind === 'anime'
    ? `/discover/tv?language=en-US&sort_by=popularity.desc&with_genres=16&with_keywords=210024&with_original_language=ja&page=${page}`
    : `/discover/${kind}?language=en-US&sort_by=popularity.desc&page=${page}`;
  const data = await tmdb(path);
  const items = results(data).map((x:any) => normalize(x, kind === 'movie' ? 'movie' : 'tv'));
  if (items.length) return { results: items, page: data.page || page, total_pages: Math.min(data.total_pages || page, 500) };
  return { results: page === 1 ? fallbackFor(kind) : [], page, total_pages: page === 1 && !process.env.TMDB_API_KEY ? 1 : (data?.total_pages || page) };
}
export async function getTrending(){const items=results(await tmdb('/trending/all/week?language=en-US')).filter((x:any)=>x.media_type!=='person').slice(0,10);return items.length?items.map((x:any)=>normalize(x,x.media_type==='tv'?'tv':'movie')):fallbackMedia.slice(0,5)}
export async function getByGenre(id:number){const items=results(await tmdb(`/discover/tv?with_genres=${id}&sort_by=popularity.desc`)).slice(0,10);return items.length?items.map((x:any)=>normalize(x,'tv')):fallbackMedia.slice(4)}
export async function searchTitles(q:string,type?:string){const items=results(await tmdb(`/search/${type||'multi'}?query=${encodeURIComponent(q)}&language=en-US`)).filter((x:any)=>x.media_type!=='person').slice(0,20);return items.length?items.map((x:any)=>normalize(x,x.media_type==='tv'||type==='tv'?'tv':'movie')):fallbackMedia.filter(x=>x.title.toLowerCase().includes(q.toLowerCase()))}
export async function getTitle(id:string){
  const found = fallbackMedia.find(x => x.id === id);
  if (found) return found;
  const movie = await tmdb(`/movie/${encodeURIComponent(id)}?language=en-US`);
  if (movie) return normalize(movie, 'movie');
  const tv = await tmdb(`/tv/${encodeURIComponent(id)}?language=en-US`);
  return tv ? normalize(tv, 'tv') : undefined;
}
