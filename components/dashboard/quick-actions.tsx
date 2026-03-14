import Link from "next/link";

export function QuickActions() {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold">Pikatoiminnot</h2>

      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href="/houses/new"
          className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
        >
          Lisää talo
        </Link>

        <Link
          href="/dashboard"
          className="rounded-lg border px-4 py-2 text-sm font-medium"
        >
          Päivitä näkymä
        </Link>
      </div>
    </div>
  );
}
