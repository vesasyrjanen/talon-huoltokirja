import Link from "next/link";
import type { ReactNode } from "react";
import { LogoutButton } from "@/components/auth/logout-button";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-inner">
          <Link href="/dashboard" className="app-brand">
            Rakennuksen huoltokirja
          </Link>

          <nav className="app-nav">
            <Link href="/dashboard">Etusivu</Link>
            <Link href="/houses/new">Uusi rakennus</Link>
            <LogoutButton />
          </nav>
        </div>
      </header>

      <main className="app-main">{children}</main>
    </div>
  );
}
