import { searchTitles } from '@/lib/tmdb';
import { Catalog } from '@/components/Catalog';
export default async function Search({ searchParams }: { searchParams: { q?: string; type?: string } }) {
  const q = searchParams.q || '';
  const items = q ? await searchTitles(q, searchParams.type) : [];
  return <section className="section"><div className="eyebrow">Explore the catalog</div><h1 style={{fontFamily:'Space Grotesk',fontSize:42,margin:'10px 0'}}>Search Redline</h1><form className="toolbar"><input name="q" defaultValue={q} placeholder="Try “Dune”, “comedy”, “anime”…" autoFocus/><select name="type" defaultValue={searchParams.type || ''}><option value="">All formats</option><option value="movie">Movies</option><option value="tv">TV shows</option></select><button className="btn btn-primary">Search</button></form>{q ? <Catalog title={`${items.length} results for “${q}”`} items={items}/> : <div className="empty">Search for a title, actor, or genre to get started.</div>}</section>;
}
