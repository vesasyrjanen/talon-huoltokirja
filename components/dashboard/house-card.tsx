import Link from "next/link";

export function HouseCard({
  house,
}: {
  house: { id: string; name: string };
}) {
  return (
    <Link href={`/houses/${house.id}`} className="ui-link-card">
      <h3 style={{ margin: 0, fontSize: 20 }}>{house.name}</h3>
      <div className="ui-meta" style={{ marginTop: 12 }}>
        Avaa talo →
      </div>
    </Link>
  );
}
