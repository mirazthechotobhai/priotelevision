import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { KeyboardNav } from '@/components/KeyboardNav';

export const metadata: Metadata = { title: 'Redline — Watch what moves you', description: 'A fast, focused streaming discovery experience for movies, TV and anime.' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <><Header /><KeyboardNav /><main className="shell">{children}</main><footer className="footer"><div className="shell">© 2025 Redline · Discover something worth watching.</div></footer></>;
}
