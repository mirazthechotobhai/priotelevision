'use client';
import { useEffect, useState } from 'react';
import type { Media } from '@/lib/tmdb';

export function WatchlistButton({ item }: { item: Media }) {
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    let list: Array<string | Media> = [];
    try {
      const parsed = JSON.parse(localStorage.getItem('redline-watchlist') || '[]');
      if (Array.isArray(parsed)) list = parsed;
    } catch {
      localStorage.removeItem('redline-watchlist');
    }
    setSaved(list.some(entry => typeof entry === 'string' ? entry === item.id : entry.id === item.id));
  }, [item.id]);
  function toggle() {
    let list: Array<string | Media> = [];
    try {
      const parsed = JSON.parse(localStorage.getItem('redline-watchlist') || '[]');
      if (Array.isArray(parsed)) list = parsed;
    } catch {
      localStorage.removeItem('redline-watchlist');
    }
    const next = saved
      ? list.filter(entry => typeof entry === 'string' ? entry !== item.id : entry.id !== item.id)
      : [...list.filter(entry => typeof entry !== 'string'), item];
    localStorage.setItem('redline-watchlist', JSON.stringify(next));
    setSaved(!saved);
  }
  return <button className="btn btn-secondary" onClick={toggle} aria-pressed={saved}>{saved ? '✓ In my list' : '+ Add to my list'}</button>;
}
