import { getTitle } from '@/lib/tmdb';
import { WatchlistButton } from '@/components/WatchlistButton';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const item = await getTitle(params.id);
  return item ? { title: `${item.title} — Redline`, description: item.overview, openGraph: { title: item.title, description: item.overview, images: [item.poster] } } : { title: 'Title not found — Redline' };
}

export default async function TitlePage({ params }: { params: { id: string } }) {
  const item = await getTitle(params.id); if (!item) return <div className="empty">Title not found.</div>;
  return <article className="detail"><div><img className="poster" src={item.poster} alt={`${item.title} poster`} /></div><div><div className="eyebrow">{item.type === 'tv' ? 'Series' : 'Movie'} · {item.year}</div><h1>{item.title}</h1><div><span className="pill">★ {item.rating.toFixed(1)}</span><span className="pill">{item.genre}</span></div><p>{item.overview}</p><div className="actions"><a className="btn btn-primary" href={`https://www.youtube.com/results?search_query=${encodeURIComponent(item.title + ' trailer')}`} target="_blank" rel="noreferrer">▶ Watch trailer</a><WatchlistButton item={item}/></div></div></article>;
}
