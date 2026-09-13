import { fallbackMedia } from '@/lib/fallback';

function Cards({ items }: { items: typeof fallbackMedia }) {
  return <div className="grid">{items.map(item => <a className="card" href={`/title/${item.id}`} key={item.id}><img src={item.poster} alt={`${item.title} poster`} /><strong>{item.title}</strong><span>{item.year} · ★ {item.rating.toFixed(1)}</span></a>)}</div>;
}

export default function Home() {
  return <div className="home"><header className="nav"><a className="brand" href="/">red<span>line</span></a><nav><a href="/search">Movies & TV</a><a href="/search?type=tv">Series</a><a href="/watchlist">My list</a></nav></header><main><section className="hero"><p className="eyebrow">Your next obsession</p><h1>Stories that stay with you.</h1><p>Find your next favorite movie, series, or anime in one simple place.</p><a className="button" href="#trending">Explore now</a></section><section id="trending"><div className="section-heading"><h2>Trending now</h2><a href="/search">View all</a></div><Cards items={fallbackMedia.slice(0, 5)} /></section><section><div className="section-heading"><h2>Animation & anime</h2><a href="/search">View all</a></div><Cards items={fallbackMedia.slice(4)} /></section></main><footer>Discover something worth watching.</footer></div>;
}
