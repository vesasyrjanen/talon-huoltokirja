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
      <div className="ui-card">
        <h3 style={{ marginTop: 0 }}>Ei irtaimistoa vielä</h3>
        <p className="ui-meta">
          Lisää ensimmäinen laite, työkalu tai muu irtaimisto.
        </p>
      </div>
    );
  }

  return (
    <div className="ui-grid cols-3">
      {items.map((item) => (
        <Link
          key={item.id}
          href={`/houses/${houseId}/items/${item.id}`}
          className="ui-link-card"
        >
          <h3 style={{ margin: 0, fontSize: 20 }}>{item.name}</h3>
          {item.category ? (
            <p className="ui-meta" style={{ marginTop: 10 }}>{item.category}</p>
          ) : null}
          {(item.brand || item.model) ? (
            <p className="ui-meta" style={{ marginTop: 6 }}>
              {[item.brand, item.model].filter(Boolean).join(" / ")}
            </p>
          ) : null}
          {item.location ? (
            <p className="ui-meta" style={{ marginTop: 6 }}>
              Sijainti: {item.location}
            </p>
          ) : null}
        </Link>
      ))}
    </div>
  );
}
