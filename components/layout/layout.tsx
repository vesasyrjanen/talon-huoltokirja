import Link from "next/link";
import type { ReactNode } from "react";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-inner">
          <Link href="/etusivu" className="app-brand">
            Rakennusn huoltokirja
          </Link>

          <nav className="app-nav">
            <Link href="/etusivu">Etusivu</Link>
            <Link href="/houses/new">Uusi rakennus</Link>
          </nav>
        </div>
      </header>

      <main className="app-main">{children}</main>
    </div>
  );
}
