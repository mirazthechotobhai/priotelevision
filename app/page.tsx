import HomeCatalog from '@/components/HomeCatalog';
import BackToTop from '@/components/BackToTop';
import { fallbackMedia } from '@/lib/fallback';

export default function Home() {
  return <div className="home" id="top"><header className="nav"><a className="brand" href="/">red<span>line</span></a><nav aria-label="Main navigation"><a href="/search">Search</a><a href="/watchlist">My list</a></nav></header><main><section className="hero"><p className="eyebrow">Your next obsession</p><h1>Stories that stay with you.</h1><p>Find your next favorite movie, series, or anime in one simple place.</p><a className="button" href="#catalog-heading">Explore now</a></section><HomeCatalog initialItems={fallbackMedia.filter(item => item.type === 'movie')} /></main><footer>Discover something worth watching.</footer><BackToTop /></div>;
}
