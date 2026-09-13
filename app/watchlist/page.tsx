'use client';
import { useEffect, useState } from 'react';
import type { Media } from '@/lib/tmdb';

export default function Watchlist() {
  const [items, setItems] = useState<Media[]>([]);
  useEffect(() => {
    const entries = JSON.parse(localStorage.getItem('redline-watchlist') || '[]') as Array<string | Media>;
    setItems(entries.filter((entry): entry is Media => typeof entry !== 'string'));
  }, []);
  return <section className="section"><div className="eyebrow">Saved for later</div><h1 style={{fontFamily:'Space Grotesk',fontSize:42}}>My list</h1>{items.length ? <div className="grid">{items.map(item => <a className="card" href={`/title/${item.id}`} key={item.id}><div className="poster"><img src={item.poster} alt={`${item.title} poster`} /></div><div className="card-title">{item.title}</div><div className="meta">{item.year} · ★ {item.rating.toFixed(1)}</div></a>)}</div> : <div className="empty">Your list is empty.<br/><a className="btn btn-primary" href="/search" style={{display:'inline-block',marginTop:20}}>Find something</a></div>}</section>;
}
