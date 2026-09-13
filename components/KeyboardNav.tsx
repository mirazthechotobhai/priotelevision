'use client';
import { useEffect } from 'react';

/** Makes a simple remote/keyboard workflow possible without changing native link semantics. */
export function KeyboardNav() {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        (document.activeElement as HTMLElement | null)?.blur();
        return;
      }
      if (!['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
      const target = event.target as HTMLElement;
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName)) return;
      const cards = Array.from(document.querySelectorAll<HTMLElement>('.card'));
      const activeCard = cards.indexOf(document.activeElement as HTMLElement);
      if (activeCard >= 0 && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
        const firstRowTop = cards[0]?.getBoundingClientRect().top ?? 0;
        const columns = cards.filter(card => Math.abs(card.getBoundingClientRect().top - firstRowTop) < 4).length || 1;
        const next = event.key === 'ArrowUp' ? activeCard - columns : activeCard + columns;
        if (cards[next]) {
          event.preventDefault();
          cards[next].focus();
        }
        return;
      }
      const links = Array.from(document.querySelectorAll<HTMLElement>('.card, .navlinks a, .actions .btn'));
      const current = links.indexOf(document.activeElement as HTMLElement);
      if (current < 0) return;
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      event.preventDefault();
      const next = event.key === 'ArrowRight' ? current + 1 : current - 1;
      links[(next + links.length) % links.length]?.focus();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);
  return null;
}
