import Link from "next/link";

type Item = {
  id: string;
  name: string;
  category: string | null;
  brand: string | null;
  model: string | null;
  location: string | null;
};

export function ItemList({
  items,
  houseId,
}: {
  items: Item[];
  houseId: string;
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h3 className="text-lg font-medium">Ei irtaimistoa vielä</h3>
        <p className="mt-2 text-sm text-neutral-600">
          Lisää ensimmäinen laite, työkalu tai muu irtaimisto.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <Link
          key={item.id}
          href={`/houses/${houseId}/items/${item.id}`}
          className="block rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md"
        >
          <h3 className="text-lg font-semibold">{item.name}</h3>
          {item.category ? (
            <p className="mt-2 text-sm text-neutral-600">{item.category}</p>
          ) : null}
          {(item.brand || item.model) ? (
            <p className="mt-1 text-sm text-neutral-500">
              {[item.brand, item.model].filter(Boolean).join(" / ")}
            </p>
          ) : null}
          {item.location ? (
            <p className="mt-1 text-sm text-neutral-500">
              Sijainti: {item.location}
            </p>
          ) : null}
        </Link>
      ))}
    </div>
  );
}
