'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { CatalogKind, Media } from '@/lib/tmdb';

const labels: Record<CatalogKind, string> = { movie: 'Movie', tv: 'TV Show', anime: 'Anime' };

export default function HomeCatalog({ initialItems }: { initialItems: Media[] }) {
  const [kind, setKind] = useState<CatalogKind>('movie');
  const [items, setItems] = useState(initialItems);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);

  const loadNext = useCallback(async () => {
    if (!ready || loading || !hasMore) return;
    const next = page + 1;
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/tmdb?type=${kind}&page=${next}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to load titles.');
      setItems(current => [...current, ...(data.results || [])]);
      setPage(next);
      setHasMore(next < (data.total_pages || next));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to load titles.');
    } finally {
      setLoading(false);
    }
  }, [hasMore, kind, loading, page, ready]);

  useEffect(() => {
    const node = sentinel.current;
    if (!node) return;
    const observer = new IntersectionObserver(entries => {
      if (entries[0]?.isIntersecting) void loadNext();
    }, { rootMargin: '500px 0px' });
    observer.observe(node);
    return () => observer.disconnect();
  }, [loadNext]);

  const selectKind = (next: CatalogKind) => {
    if (next === kind) return;
    setKind(next);
    setItems([]);
    setPage(0);
    setReady(false);
    setHasMore(true);
    setError('');
  };

  useEffect(() => {
    if (page === 0 && !ready) {
      setItems([]);
      setPage(1);
      setLoading(true);
      fetch(`/api/tmdb?type=${kind}&page=1`).then(async response => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Unable to load titles.');
        setItems(data.results || []);
        setHasMore((data.total_pages || 1) > 1);
        setPage(1);
        setReady(true);
      }).catch(cause => setError(cause instanceof Error ? cause.message : 'Unable to load titles.')).finally(() => setLoading(false));
    }
  }, [kind, page, ready]);

  return <section className="catalog" aria-labelledby="catalog-heading">
    <div className="catalog-head"><div><p className="eyebrow">Browse the collection</p><h2 id="catalog-heading">{labels[kind]}</h2></div>
      <div className="tabs" role="tablist" aria-label="Content type">{(Object.keys(labels) as CatalogKind[]).map(tab => <button key={tab} className={tab === kind ? 'tab active' : 'tab'} role="tab" aria-selected={tab === kind} onClick={() => selectKind(tab)}>{labels[tab]}</button>)}</div>
    </div>
    <div className="grid">{items.map(item => <a className="card" href={`/title/${item.id}`} key={`${kind}-${item.id}`}><div className="poster"><img src={item.poster} alt={`${item.title} poster`} loading="lazy" /><span className="play" aria-hidden>▶</span></div><strong>{item.title}</strong><span>{item.year} · ★ {item.rating.toFixed(1)}</span></a>)}</div>
    <div ref={sentinel} className="catalog-status" aria-live="polite">{loading && <span>Loading more {labels[kind].toLowerCase()}…</span>}{!loading && error && <><span>{error}</span><button className="retry" onClick={() => void loadNext()}>Try again</button></>}{!loading && !error && !hasMore && <span>You&apos;ve reached the end.</span>}</div>
  </section>;
}
