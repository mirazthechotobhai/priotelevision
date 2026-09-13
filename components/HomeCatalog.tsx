'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { CatalogKind, Media } from '@/lib/tmdb';
import Image from 'next/image';

const labels: Record<CatalogKind, string> = { movie: 'Movie', tv: 'TV Show', anime: 'Anime' };
const unique = (items: Media[]) => Array.from(new Map(items.map(item => [item.id, item])).values());

export default function HomeCatalog({ initialItems }: { initialItems: Media[] }) {
  const [kind, setKind] = useState<CatalogKind>('movie');
  const [items, setItems] = useState(initialItems);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const sentinel = useRef<HTMLDivElement>(null);
  const pageRef = useRef(0);
  const hasMoreRef = useRef(true);
  const loadingRef = useRef(false);
  const requestRef = useRef(0);

  const fetchPage = useCallback(async (requestedKind: CatalogKind, requestedPage: number, replace: boolean) => {
    const requestId = ++requestRef.current;
    loadingRef.current = true;
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/tmdb?type=${requestedKind}&page=${requestedPage}`);
      const data = await response.json();
      if (requestId !== requestRef.current) return;
      const responseItems = Array.isArray(data.results) ? data.results : [];
      if (replace) setItems(current => data.source === 'fallback' && current.length ? current : responseItems);
      else setItems(current => unique([...current, ...responseItems]));
      const returnedPage = Number(data.page) || requestedPage;
      pageRef.current = returnedPage;
      setPage(returnedPage);
      const nextHasMore = Boolean(response.ok && data.has_more && returnedPage >= requestedPage);
      hasMoreRef.current = nextHasMore;
      setHasMore(nextHasMore);
      if (!response.ok) throw new Error(data.error || 'Unable to load titles.');
    } catch (cause) {
      if (requestId === requestRef.current) setError(cause instanceof Error ? cause.message : 'Unable to load titles.');
    } finally {
      if (requestId === requestRef.current) {
        loadingRef.current = false;
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    pageRef.current = 0;
    hasMoreRef.current = true;
    setPage(0);
    setHasMore(true);
    void fetchPage(kind, 1, true);
  }, [fetchPage, kind]);

  const loadNext = useCallback(() => {
    if (loadingRef.current || !hasMoreRef.current || pageRef.current < 1) return;
    void fetchPage(kind, pageRef.current + 1, false);
  }, [fetchPage, kind]);

  useEffect(() => {
    const node = sentinel.current;
    if (!node) return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) loadNext();
    }, { rootMargin: '500px 0px' });
    observer.observe(node);
    return () => observer.disconnect();
  }, [loadNext]);

  const selectKind = (next: CatalogKind) => {
    if (next !== kind) {
      requestRef.current++;
      setKind(next);
      setItems([]);
      setError('');
    }
  };

  return <section className="catalog" aria-labelledby="catalog-heading">
    <div className="catalog-head"><div><p className="eyebrow">Browse the collection</p><h2 id="catalog-heading">{labels[kind]}</h2></div>
      <div className="tabs" role="tablist" aria-label="Content type">{(Object.keys(labels) as CatalogKind[]).map(tab => <button key={tab} className={tab === kind ? 'tab active' : 'tab'} role="tab" aria-selected={tab === kind} onClick={() => selectKind(tab)}>{labels[tab]}</button>)}</div>
    </div>
    <div className="grid">{unique(items).map(item => <a className="card" href={`/title/${item.id}`} key={`${kind}-${item.id}`}><div className="poster"><Image src={item.poster} alt={`${item.title} poster`} fill sizes="(max-width: 800px) 33vw, 16vw" loading="lazy" /><span className="play" aria-hidden>▶</span></div><strong>{item.title}</strong><span>{item.year} · ★ {item.rating.toFixed(1)}</span></a>)}</div>
    <div ref={sentinel} className="catalog-status" aria-live="polite">{loading && <span>Loading more {labels[kind].toLowerCase()}…</span>}{!loading && error && <><span>{error}</span><button className="retry" onClick={() => void fetchPage(kind, pageRef.current || 1, pageRef.current > 1)}>Try again</button></>}{!loading && !error && !hasMore && page > 0 && <span>You&apos;ve reached the end.</span>}</div>
  </section>;
}
