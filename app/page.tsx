import { Catalog } from '@/components/Catalog';
import { fallbackMedia } from '@/lib/tmdb';

export default function Home() {
  return <><section className="hero"><div className="hero-content"><div className="eyebrow">Your next obsession</div><h1>Stories that stay with you.</h1><p>Find your next favorite movie, series, or anime. Curated picks, endless worlds, one simple place.</p><div className="actions"><a className="btn btn-primary" href="#trending">Explore now ↓</a><a className="btn btn-secondary" href="/search">Search titles</a></div></div></section><Catalog title="Trending now" items={fallbackMedia.slice(0, 5)} id="trending"/><Catalog title="Animation & anime" items={fallbackMedia.slice(4)}/></>;
}
