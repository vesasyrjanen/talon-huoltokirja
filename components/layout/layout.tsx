import Link from "next/link";
import type { ReactNode } from "react";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-inner">
          <Link href="/dashboard" className="app-brand">
            Talon huoltokirja
          </Link>

          <nav className="app-nav">
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/houses/new">Uusi talo</Link>
          </nav>
        </div>
      </header>

      <main className="app-main">{children}</main>
    </div>
  );
}
