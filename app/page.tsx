import { Catalog } from '@/components/Catalog';
import { getTrending, getByGenre } from '@/lib/tmdb';

export default async function Home() {
  const [trending, anime] = await Promise.all([getTrending(), getByGenre(16)]);
  return <><section className="hero"><div className="hero-content"><div className="eyebrow">Your next obsession</div><h1>Stories that stay with you.</h1><p>Find your next favorite movie, series, or anime. Curated picks, endless worlds, one simple place.</p><div className="actions"><a className="btn btn-primary" href="#trending">Explore now ↓</a><a className="btn btn-secondary" href="/search">Search titles</a></div></div></section><Catalog title="Trending now" items={trending} id="trending"/><Catalog title="Animation & anime" items={anime}/></>;
}
