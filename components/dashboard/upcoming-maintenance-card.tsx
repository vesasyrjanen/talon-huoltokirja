import Link from "next/link";

type RelatedSystem = {
  id: string;
  name: string;
  house_id: string;
};

type MaintenanceItem = {
  id: string;
  next_service_date: string | null;
  systems: RelatedSystem | RelatedSystem[] | null;
};

function firstOf<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export function UpcomingMaintenanceCard({
  items,
}: {
  items: MaintenanceItem[];
}) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Seuraavat 30 päivän huollot</h2>
        <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">
          {items.length}
        </span>
      </div>

      {items.length === 0 ? (
        <p className="mt-4 text-sm text-neutral-600">
          Ei tulevia huoltoja seuraavan 30 päivän aikana.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {items.map((item) => {
            const system = firstOf(item.systems);

            if (!system) return null;

            return (
              <Link
                key={item.id}
                href={`/houses/${system.house_id}/systems/${system.id}`}
                className="block rounded-xl border p-3 hover:bg-neutral-50"
              >
                <div className="font-medium">{system.name}</div>
                <div className="mt-1 text-sm text-neutral-700">
                  Seuraava huolto: {item.next_service_date}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
