'use client';

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <main className="shell">
      <section className="empty">
        <div className="eyebrow">Playback interrupted</div>
        <h1>Redline could not load this page.</h1>
        <p>Try again, or continue browsing with the local catalog.</p>
        <button className="btn btn-primary" onClick={reset}>Try again</button>
      </section>
    </main>
  );
}
